/** @format */
/**
 * External dependencies
 */
import express from 'express';
import fs from 'fs';
import path from 'path';
// import { stringify } from 'qs';
import crypto from 'crypto';
import { execSync } from 'child_process';
import cookieParser from 'cookie-parser';
// import debugFactory from 'debug';
import {
	defaults,
	// endsWith,
	// get,
	// includes,
	pick,
	flatten,
	forEach,
	groupBy,
	intersection,
	snakeCase,
	// split,
} from 'lodash';
import bodyParser from 'body-parser';

/**
 * Internal dependencies
 */
import config from 'config';
import sanitize from 'server/sanitize';
import utils from 'server/bundler/utils';
import { pathToRegExp } from 'client/utils';
import sections from 'client/sections';
import { serverRouter, getNormalizedPath } from 'server/isomorphic-routing';
import { serverRender, serverRenderError, renderJsx } from 'server/render';
import stateCache from 'server/state-cache';
import initialReducer from 'state/reducer';
import { createReduxStore } from 'client/state';
import { DESERIALIZE } from 'client/state/action-types';
// import { setCurrentUserOnReduxStore } from 'lib/redux-helpers';

// const debug = debugFactory( 'papo:pages' );
const SERVER_BASE_PATH = '/public';
const papoEnv = config( 'env_id' );

const staticFiles = [
	{ path: 'style.css' },
	{ path: 'editor.css' },
	{ path: 'tinymce/skins/wordpress/wp-content.css' },
	{ path: 'style-debug.css' },
	{ path: 'style-rtl.css' },
	{ path: 'style-debug-rtl.css' },
];

const staticFilesUrls = staticFiles.reduce( ( result, file ) => {
	if ( ! file.hash ) {
		file.hash = utils.hashFile( process.cwd() + SERVER_BASE_PATH + '/' + file.path );
	}
	result[ file.path ] = utils.getUrl( file.path, file.hash );
	return result;
}, {} );

// List of browser languages to show pride styling for.
// Add a '*' element to show the styling for all visitors.
const prideLanguages = [];

// List of geolocated locations to show pride styling for.
// Geolocation may not be 100% accurate.
const prideLocations = [];

// TODO: Re-use (a modified version of) client/state/initial-state#getInitialServerState here
function getInitialServerState( serializedServerState ) {
	// Bootstrapped state from a server-render
	const serverState = initialReducer( serializedServerState, { type: DESERIALIZE } );
	return pick( serverState, Object.keys( serializedServerState ) );
}

const ASSETS_PATH = path.join( __dirname, '../', 'bundler', 'assets.json' );
const getAssets = ( () => {
	let assets;
	return () => {
		if ( ! assets ) {
			assets = JSON.parse( fs.readFileSync( ASSETS_PATH, 'utf8' ) );
		}
		return assets;
	};
} )();

const EMPTY_ASSETS = { js: [], 'css.ltr': [], 'css.rtl': [] };

const getAssetType = asset => {
	if ( asset.endsWith( '.rtl.css' ) ) {
		return 'css.rtl';
	}
	if ( asset.endsWith( '.css' ) ) {
		return 'css.ltr';
	}

	return 'js';
};

const groupAssetsByType = assets => defaults( groupBy( assets, getAssetType ), EMPTY_ASSETS );

const getFilesForChunk = chunkName => {
	const assets = getAssets();

	function getChunkByName( _chunkName ) {
		return assets.chunks.find( chunk => chunk.names.some( name => name === _chunkName ) );
	}

	function getChunkById( chunkId ) {
		return assets.chunks.find( chunk => chunk.id === chunkId );
	}

	const chunk = getChunkByName( chunkName );
	if ( ! chunk ) {
		console.warn( 'cannot find the chunk ' + chunkName );
		console.warn( 'available chunks:' );
		assets.chunks.forEach( c => {
			console.log( '    ' + c.id + ': ' + c.names.join( ',' ) );
		} );
		return EMPTY_ASSETS;
	}

	const allTheFiles = chunk.files.concat(
		flatten( chunk.siblings.map( sibling => getChunkById( sibling ).files ) )
	);

	return groupAssetsByType( allTheFiles );
};

const getFilesForEntrypoint = () => {
	const entrypointAssets = getAssets().entrypoints.build.assets.filter(
		asset => ! asset.startsWith( 'manifest' )
	);
	return groupAssetsByType( entrypointAssets );
};

/**
 * Generate an object that maps asset names name to a server-relative urls.
 * Assets in request and static files are included.
 *
 * @returns {Object} Map of asset names to urls
 **/
function generateStaticUrls() {
	const urls = { ...staticFilesUrls };
	const assets = getAssets().assetsByChunkName;

	forEach( assets, ( asset, name ) => {
		urls[ name ] = asset;
	} );

	return urls;
}

function getCurrentBranchName() {
	try {
		return execSync( 'git rev-parse --abbrev-ref HEAD' )
			.toString()
			.replace( /\s/gm, '' );
	} catch ( err ) {
		return undefined;
	}
}

function getCurrentCommitShortChecksum() {
	try {
		return execSync( 'git rev-parse --short HEAD' )
			.toString()
			.replace( /\s/gm, '' );
	} catch ( err ) {
		return undefined;
	}
}

/**
 * Given the content of an 'Accept-Language' request header, returns an array of the languages.
 *
 * This differs slightly from other language functions, as it doesn't try to validate the language codes,
 * or merge similar language codes.
 *
 * @param  {string} header - The content of the AcceptedLanguages header.
 * @return {Array} An array of language codes in the header, all in lowercase.
 */
function getAcceptedLanguagesFromHeader( header ) {
	if ( ! header ) {
		return [];
	}

	return header
		.split( ',' )
		.map( lang => {
			const match = lang.match( /^[A-Z]{2,3}(-[A-Z]{2,3})?/i );
			if ( ! match ) {
				return false;
			}

			return match[ 0 ].toLowerCase();
		} )
		.filter( lang => lang );
}

function getDefaultContext( request ) {
	let initialServerState = {};
	const lang = config( 'i18n_default_locale_slug' );
	const bodyClasses = [];
	const cacheKey = getNormalizedPath( request.path, request.query );
	const geoLocation = ( request.headers[ 'x-geoip-country-code' ] || '' ).toLowerCase();
	const isDebug = papoEnv === 'development' || request.query.debug !== undefined;
	let sectionCss;

	if ( cacheKey ) {
		const serializeCachedServerState = stateCache.get( cacheKey ) || {};
		initialServerState = getInitialServerState( serializeCachedServerState );
	}

	// Note: The x-geoip-country-code header should *not* be considered 100% accurate.
	// It should only be used for guestimating the visitor's location.
	const acceptedLanguages = getAcceptedLanguagesFromHeader( request.headers[ 'accept-language' ] );
	if (
		prideLanguages.indexOf( '*' ) > -1 ||
		intersection( prideLanguages, acceptedLanguages ).length > 0 ||
		prideLocations.indexOf( '*' ) > -1 ||
		prideLocations.indexOf( geoLocation ) > -1
	) {
		bodyClasses.push( 'pride' );
	}

	if ( request.context && request.context.sectionCss ) {
		sectionCss = request.context.sectionCss;
	}

	const context = Object.assign( {}, request.context, {
		commitSha: process.env.hasOwnProperty( 'COMMIT_SHA' ) ? process.env.COMMIT_SHA : '(unknown)',
		compileDebug: process.env.NODE_ENV === 'development',
		urls: generateStaticUrls(),
		user: false,
		env: papoEnv,
		sanitize: sanitize,
		isRTL: false,
		isFluidWidth: request.context && request.context.isFluidWidth,
		isDebug,
		entrypoint: getFilesForEntrypoint(),
		manifest: getAssets().manifests.manifest,
		badge: false,
		lang,
		jsFile: 'build',
		faviconURL: '//www.papovn.com/papo/i/favicons/favicon.ico',
		abTestHelper: !! config.isEnabled( 'dev/test-helper' ),
		preferencesHelper: !! config.isEnabled( 'dev/preferences-helper' ),
		devDocsURL: '/devdocs',
		store: createReduxStore( initialServerState ),
		bodyClasses,
		sectionCss,
	} );

	context.app = {
		// use ipv4 address when is ipv4 mapped address
		clientIp: request.ip ? request.ip.replace( '::ffff:', '' ) : request.ip,
		isDebug: context.env === 'development' || context.isDebug,
		staticUrls: staticFilesUrls,
	};

	if ( papoEnv === 'stage' ) {
		context.badge = 'staging';
		context.feedbackURL = 'https://github.com/enesyteam/papo-client/issues/';
		context.faviconURL = '/papo/images/favicons/favicon-staging.ico';
	}

	if ( papoEnv === 'development' ) {
		context.badge = 'dev';
		context.devDocs = true;
		context.feedbackURL = 'https://github.com/enesyteam/papo-client/issues/';
		context.faviconURL = '/papo/images/favicons/favicon-development.ico';
		context.branchName = getCurrentBranchName();
		context.commitChecksum = getCurrentCommitShortChecksum();
	}

	return context;
}

function setUpLoggedOutRoute( req, res, next ) {
	res.set( {
		'X-Frame-Options': 'SAMEORIGIN',
	} );

	next();
}

function setUpLoggedInRoute( req, res, next ) {
	// let redirectUrl, start;

	res.set( {
		'X-Frame-Options': 'SAMEORIGIN',
	} );

	// we need config something for logged in routes
	// but at this time, I don't know what to config if user is logged in
	// so we temporary jump to next
	next();
}

/**
 * Sets up a Content Security Policy header
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next a callback to call when done
 */
function setUpCSP( req, res, next ) {
	const originalUrlPathname = req.originalUrl.split( '?' )[ 0 ];

	// We only setup CSP for /log-in* for now
	if ( ! /^\/login/.test( originalUrlPathname ) ) {
		next();
		return;
	}

	// This is calculated by taking the contents of the script text from between the tags,
	// and calculating SHA256 hash on it, encoded in base64, example:
	// `sha256-${ base64( sha256( 'window.AppBoot();' ) ) }` === sha256-3yiQswl88knA3EhjrG5tj5gmV6EUdLYFvn2dygc0xUQ
	// you can also just run it in Chrome, chrome will give you the hash of the violating scripts
	const inlineScripts = [
		'sha256-3yiQswl88knA3EhjrG5tj5gmV6EUdLYFvn2dygc0xUQ=',
		'sha256-ZKTuGaoyrLu2lwYpcyzib+xE4/2mCN8PKv31uXS3Eg4=',
	];

	req.context.inlineScriptNonce = crypto.randomBytes( 48 ).toString( 'hex' );
	req.context.analyticsScriptNonce = crypto.randomBytes( 48 ).toString( 'hex' );

	const policy = {
		'default-src': [ "'self'" ],
		'script-src': [
			"'self'",
			"'report-sample'",
			"'unsafe-eval'",
			'stats.wp.com',
			'http://connect.facebook.net',
			`'nonce-${ req.context.inlineScriptNonce }'`,
			`'nonce-${ req.context.analyticsScriptNonce }'`,
			...inlineScripts.map( hash => `'${ hash }'` ),
		],
		'base-uri': [ "'none'" ],
		'style-src': [
			"'self'",
			'*.wp.com',
			'*.papovn.com',
			"'unsafe-inline'",
			'https://fonts.googleapis.com',
			'https://localhost:5000',
			'https://www.facebook.com/',
			'https://static.xx.fbcdn.net',
		],
		'form-action': [ "'self'" ],
		'object-src': [ "'none'" ],
		'img-src': [
			"'self'",
			'*.wp.com',
			'*.papovn.com',
			'https://web.facebook.com/',
			'https://www.facebook.com/',
			'http://graph.facebook.com',
			'https://platform-lookaside.fbsbx.com/',
		],
		'frame-src': [
			"'self'",
			'https://localhost:5000',
			'http://localhost:8065',
			'https://public-api.papovn.com',
			'https://www.facebook.com/',
			'https://staticxx.facebook.com/',
		],
		'font-src': [
			"'self'",
			'*.wp.com',
			'https://fonts.gstatic.com',
			'*.papovn.com',
			'data:', // should remove 'data:' ASAP
		],
		'media-src': [ "'self'" ],
		'connect-src': [
			"'self'",
			'https://graph.facebook.com',
			'https://localhost:5000',
			'http://localhost:8065',
			'wss://localhost:5000',
			'ws://localhost:8065',
			'https://public-api.papovn.com',
			'wss://public-api.papovn.com',
			'wss://www.papovn.com',
		],
		'report-uri': [ '/cspreport' ],
	};

	const policyString = Object.keys( policy )
		.map( key => `${ key } ${ policy[ key ].join( ' ' ) }` )
		.join( '; ' );

	// For now we're just logging policy violations and not blocking them
	// so we won't actually break anything, later we'll remove the 'Report-Only'
	// part so browsers will block violating content.
	res.set( { 'Content-Security-Policy-Report-Only': policyString } );
	next();
}

function setUpRoute( req, res, next ) {
	req.context = getDefaultContext( req );
	setUpCSP( req, res, () =>
		req.cookies.wordpress_logged_in // a cookie probably indicates someone is logged-in
			? setUpLoggedInRoute( req, res, next )
			: setUpLoggedOutRoute( req, res, next )
	);
}

function render404( request, response ) {
	const ctx = getDefaultContext( request );
	response.status( 404 ).send( renderJsx( '404', ctx ) );
}

module.exports = function() {
	const app = express();

	app.set( 'views', __dirname );

	// app.use( logSectionResponseTime );
	app.use( cookieParser() );

	// redirect homepage to select pages
	app.get( '/', function( request, response, next ) {
		if ( ! config.isEnabled( 'home' ) ) {
			response.redirect( '/pages/select' );
		} else {
			next();
		}
	} );

	sections
		.filter( section => ! section.envId || section.envId.indexOf( config( 'env_id' ) ) > -1 )
		.forEach( section => {
			// console.log(section);
			section.paths.forEach( sectionPath => {
				const pathRegex = pathToRegExp( sectionPath );

				app.get( pathRegex, function( req, res, next ) {
					req.context = Object.assign( {}, req.context, { sectionName: section.name } );

					if ( config.isEnabled( 'code-splitting' ) ) {
						req.context.chunkFiles = getFilesForChunk( section.name );
					} else {
						req.context.chunkFiles = EMPTY_ASSETS;
					}

					if ( section.secondary && req.context ) {
						req.context.hasSecondary = true;
					}

					if ( section.group && req.context ) {
						req.context.sectionGroup = section.group;
					}

					if ( section.css && req.context ) {
						req.context.sectionCss = section.css;
					}

					if ( section.wideSecondary ) {
						req.context.wideSecondary = true;
					}

					if ( section.isFluidWidth ) {
						req.context.isFluidWidth = true;
					}

					next();
				} );

				if ( ! section.isomorphic ) {
					app.get( pathRegex, setUpRoute, serverRender );
				}
			} );

			if ( section.isomorphic ) {
				// section.load() uses require on the server side so we also need to access the
				// default export of it. See webpack/bundler/sections-loader.js
				section.load().default( serverRouter( app, setUpRoute, section ) );
			}
		} );

	// This is used to log to tracks Content Security Policy violation reports sent by browsers
	// app.post(
	// 	'/cspreport',
	// 	bodyParser.json( { type: [ 'json', 'application/csp-report' ] } ),
	// 	function( req, res ) {
	// 		const cspReport = req.body[ 'csp-report' ] || {};
	// 		const cspReportSnakeCase = Object.keys( cspReport ).reduce( ( report, key ) => {
	// 			report[ snakeCase( key ) ] = cspReport[ key ];
	// 			return report;
	// 		}, {} );
	//
	// 		if ( papoEnv !== 'development' ) {
	// 			// consider to do something if you want
	// 		}
	//
	// 		res.status( 200 ).send( 'Got it!' );
	// 	},
	// 	// eslint-disable-next-line no-unused-vars
	// 	function( err, req, res, next ) {
	// 		res.status( 500 ).send( 'Bad report!' );
	// 	}
	// );

	app.get( '/privacy', function( req, res ) {
		res.send( renderJsx( 'privacy' ) );
	} );

	app.get( '/', function( req, res ) {
		res.send( renderJsx( 'home' ) );
	} );

	app.get( '/pricing', function( req, res ) {
		res.send( renderJsx( 'pricing' ) );
	} );

	// app.get( '/kvz92yn12k8scum9il5zdrobzmfpsa.html', function( req, res ) {
	// 	res.send( 'kvz92yn12k8scum9il5zdrobzmfpsa' );
	// } );

	// catchall to render 404 for all routes not whitelisted in client/sections
	app.use( render404 );

	// Error handling middleware for displaying the server error 500 page must be the very last middleware defined
	app.use( serverRenderError );

	return app;
};
