/** @format */

/**
 * External dependencies
 */

import debugFactory from 'debug';
import page from 'page';
import { parse } from 'qs';
import { some, startsWith } from 'lodash';
import url from 'url';
import moment from 'moment';
/**
 * Internal dependencies
 */
import accessibleFocus from 'lib/accessible-focus';
import config from 'config';
import { setRoute as setRouteAction } from 'state/ui/actions';
import { hasTouch } from 'lib/touch-detect';
import { setCurrentUserOnReduxStore } from 'lib/redux-helpers';
import { installPerfmonPageHandlers } from 'lib/perfmon';
// import { getCurrentUser } from 'state/users/selectors';
import { setupRoutes } from 'sections-middleware';
import { getSections } from 'sections-helper';
import notices from 'notices';
import authController from 'auth/controller';
// import localforage from 'localforage';
// import { loadScript } from 'lib/load-script';
// import * as FacebookToken from 'lib/facebook/token';
// import * as OAuthToken from 'lib/oauth-token';
// // import userFactory from 'lib/user';
// import { receivedPages } from 'state/pages/actions';
import { setCSRFFromCookie } from 'lib/client1/cookie';

const debug = debugFactory( 'papo' );

const switchUserLocale = ( currentUser, reduxStore ) => {
	// const { localeSlug, localeVariant } = currentUser.get();
	// if ( localeSlug ) {
	// 	reduxStore.dispatch( setLocale( localeSlug, localeVariant ) );
	// }
};

const setupContextMiddleware = reduxStore => {
	page( '*', ( context, next ) => {
		// page.js url parsing is broken so we had to disable it with `decodeURLComponents: false`
		const parsed = url.parse( context.canonicalPath, true );
		context.prevPath = parsed.path === context.path ? false : parsed.path;
		context.query = parsed.query;

		context.hashstring = ( parsed.hash && parsed.hash.substring( 1 ) ) || '';
		// set `context.hash` (we have to parse manually)
		if ( context.hashstring ) {
			try {
				context.hash = parse( context.hashstring );
			} catch ( e ) {
				debug( 'failed to query-string parse `location.hash`', e );
				context.hash = {};
			}
		} else {
			context.hash = {};
		}

		context.store = reduxStore;

		// // set selected site if current user is logedin
		// // TODO: get current user site ID then dispatch setSelectedSiteId action
		// // const siteID = currentUser.siteID;
		// context.store.dispatch( setSelectedSiteId( 1009 ) );

		// client version of the isomorphic method for redirecting to another page
		context.redirect = ( httpCode, newUrl = null ) => {
			if ( isNaN( httpCode ) && ! newUrl ) {
				newUrl = httpCode;
			}

			return page.replace( newUrl, context.state, false, false );
		};

		// Break routing and do full load for logout link in /me
		// if ( context.pathname === '/log-in' ) {

		// 	window.location.href = context.path;
		// 	return;
		// }

		next();
	} );

	page.exit( '*', ( context, next ) => {
		if ( ! context.store ) {
			context.store = reduxStore;
		}
		next();
	} );
};

// We need to require sections to load React with i18n mixin
const loadSectionsMiddleware = () => setupRoutes();

const loggedOutMiddleware = currentUser => {
	if ( currentUser.get() ) {
		return;
	}

	// if ( config.isEnabled( 'desktop' ) ) {
	// 	page( '/', () => {
	// 		if ( config.isEnabled( 'oauth' ) ) {
	// 			page.redirect( '/authorize' );
	// 		} else {
	// 			page.redirect( '/log-in' );
	// 		}
	// 	} );
	// } else if ( config.isEnabled( 'devdocs/redirect-loggedout-homepage' ) ) {
	// 	page( '/', () => {
	// 		page.redirect( '/devdocs/start' );
	// 	} );
	// }

	const validSections = getSections().reduce( ( acc, section ) => {
		return section.enableLoggedOut ? acc.concat( section.paths ) : acc;
	}, [] );
	const isValidSection = sectionPath =>
		some( validSections, validPath => startsWith( sectionPath, validPath ) );

	page( '*', ( context, next ) => {
		if ( isValidSection( context.path ) ) {
			next();
		} else {
			page.redirect( '/' );
		}
	} );
};

export const locales = ( currentUser, reduxStore ) => {
	// debug( 'Executing Calypso locales.' );
	//
	// if ( window.i18nLocaleStrings ) {
	// 	const i18nLocaleStringsObject = JSON.parse( window.i18nLocaleStrings );
	// 	reduxStore.dispatch( setLocaleRawData( i18nLocaleStringsObject ) );
	// }
	//
	// // Use current user's locale if it was not bootstrapped (non-ssr pages)
	// if (
	// 	! window.i18nLocaleStrings &&
	// 	! config.isEnabled( 'wpcom-user-bootstrap' ) &&
	// 	false
	// 	// currentUser.get()
	// ) {
	// 	switchUserLocale( currentUser, reduxStore );
	// }
};

const setRouteMiddleware = () => {
	page( '*', ( context, next ) => {
		context.store.dispatch( setRouteAction( context.pathname, context.query ) );

		next();
	} );
};

const clearNoticesMiddleware = () => {
	//TODO: remove this one when notices are reduxified - it is for old notices
	page( '*', notices.clearNoticesOnNavigation );
};

const oauthTokenMiddleware = () => {
	if ( config.isEnabled( 'oauth' ) ) {
		// Forces OAuth users to the /login page if no token is present
		page( '*', authController.checkToken );
	}
};

export const utils = ( currentUser, reduxStore ) => {
	debug( 'Executing Papo utils.' );

	// set cookie
	setCSRFFromCookie();

	if ( process.env.NODE_ENV === 'development' ) {
		require( './dev-modules' ).default();
	}
	// Infer touch screen by checking if device supports touch events
	// See touch-detect/README.md
	if ( hasTouch() ) {
		document.documentElement.classList.add( 'touch' );
	} else {
		document.documentElement.classList.add( 'notouch' );
	}

	// Add accessible-focus listener
	accessibleFocus();

	// custom momentjs
	moment.updateLocale('en', {
		relativeTime : {
			future: "in %s",
			past:   "%s tr?????c",
			s  : 'v??i gi??y',
			ss : '%d gi??y',
			m:  "m???t ph??t",
			mm: "%d ph??t",
			h:  "m???t gi???",
			hh: "%d gi???",
			d:  "m???t ng??y",
			dd: "%d ng??y",
			M:  "m???t th??ng",
			MM: "%d th??ng",
			y:  "m???t n??m",
			yy: "%d n??m"
		}
	});
};

export const configureReduxStore = ( currentUser, reduxStore ) => {
	debug( 'Executing Papo configure Redux store.' );
	if ( currentUser.get() ) {
		// Set current user in Redux store
		setCurrentUserOnReduxStore( currentUser.get(), reduxStore );
		currentUser.on( 'change', () => {
			setCurrentUserOnReduxStore( currentUser.get(), reduxStore );
		} );
	}

	if ( config.isEnabled( 'network-connection' ) ) {
		asyncRequire( 'lib/network-connection', networkConnection =>
			networkConnection.init( reduxStore )
		);
	}
};

export const setupMiddlewares = ( currentUser, reduxStore ) => {
	debug( 'Executing Papo setup middlewares.' );
	installPerfmonPageHandlers();
	setupContextMiddleware( reduxStore );
	oauthTokenMiddleware();
	loadSectionsMiddleware();
	loggedOutMiddleware( currentUser );
	setRouteMiddleware();
	clearNoticesMiddleware();
};
