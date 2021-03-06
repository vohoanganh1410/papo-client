/** @format */

/**
 * External dependencies
 */

const fs = require( 'fs' ); // eslint-disable-line import/no-nodejs-modules
const path = require( 'path' ); // eslint-disable-line import/no-nodejs-modules

/**
 * Internal dependencies
 */
const config = require( 'config' );
const sections = config( 'project' ) === 'papoweb-org' ? require( 'papoweb-org' ) : [];
const extensions = require( './extensions' );

const extensionSections = extensions.map( extension => {
	try {
		const pkg = JSON.parse(
			fs.readFileSync( path.join( __dirname, 'extensions', extension, 'package.json' ) )
		);

		return Object.assign( {}, pkg.section, { envId: pkg.env_id } );
	} catch ( e ) {
		return null;
	}
} );

sections.push( {
	name: 'devdocs',
	paths: [ '/help' ],
	module: 'devdocs',
	secondary: true,
	enableLoggedOut: true,
	css: 'devdocs',
} );

sections.push( {
	name: 'devdocs',
	paths: [ '/help/start' ],
	module: 'devdocs',
	secondary: false,
	enableLoggedOut: true,
	css: 'devdocs',
} );

module.exports = sections.concat( extensionSections.filter( Boolean ) );
