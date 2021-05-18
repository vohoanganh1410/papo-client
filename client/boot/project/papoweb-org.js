/** @format */
/**
 * External dependencies
 */
// import { startsWith } from 'lodash';
import React from 'react';
import ReactDom from 'react-dom';
// import store from 'store';
import page from 'page';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import config from 'config';
import { setReduxStore as setReduxBridgeReduxStore } from 'lib/redux-bridge';
import { getSiteFragment, normalize } from 'lib/route';
import { isLegacyRoute } from 'lib/route/legacy-routes';

import { getSelectedSiteId, getSectionName } from 'state/ui/selectors';
import { setNextLayoutFocus, activateNextLayoutFocus } from 'state/ui/layout-focus/actions';
import Logger from 'lib/catch-js-errors';
import setupGlobalKeyboardShortcuts from 'lib/keyboard-shortcuts/global';

import * as controller from 'controller';

const debug = debugFactory( 'papo' );

function renderLayout( reduxStore ) {
	const Layout = controller.ReduxWrappedLayout;

	const layoutElement = React.createElement( Layout, {
		store: reduxStore,
	} );

	ReactDom.render( layoutElement, document.getElementById( 'papoweb' ) );

	debug( 'Main layout rendered.' );
}

export const configureReduxStore = ( currentUser, reduxStore ) => {
	debug( 'Executing papovn.com configure Redux store.' );

	// setSupportUserReduxStore( reduxStore );
	setReduxBridgeReduxStore( reduxStore );

	if ( /*currentUser.get()*/ true ) {
		if ( config.isEnabled( 'push-notifications' ) ) {
			// If the browser is capable, registers a service worker & exposes the API
			// reduxStore.dispatch( pushNotificationsInit() );
		}
	}
};

export function setupMiddlewares( currentUser, reduxStore ) {
	debug( 'Executing papovn.com setup middlewares.' );

	// Render Layout only for non-isomorphic sections.
	// Isomorphic sections will take care of rendering their Layout last themselves.
	if ( ! document.getElementById( 'primary' ) ) {
		renderLayout( reduxStore );

		if ( config.isEnabled( 'catch-js-errors' ) ) {
			const errorLogger = new Logger();
			//Save errorLogger to a singleton for use in arbitrary logging.
			require( '../../lib/catch-js-errors/log' ).registerLogger( errorLogger );
			//Save data to JS error logger
			errorLogger.saveDiagnosticData( {
				user_id: /*currentUser.get().ID*/ '123456789',
				calypso_env: config( 'env_id' ),
			} );
			errorLogger.saveDiagnosticReducer( function() {
				const state = reduxStore.getState();
				return {
					blog_id: getSelectedSiteId( state ),
					calypso_section: getSectionName( state ),
				};
			} );
			errorLogger.saveDiagnosticReducer( () => ( { tests: getSavedVariations() } ) );
			// analytics.on( 'record-event', ( eventName, eventProperties ) =>
			// 	errorLogger.saveExtraData( { lastTracksEvent: eventProperties } )
			// );
			page( '*', function( context, next ) {
				errorLogger.saveNewPath(
					context.canonicalPath.replace( getSiteFragment( context.canonicalPath ), ':siteId' )
				);
				next();
			} );
		}
	}

	// If `?sb` or `?sp` are present on the path set the focus of layout
	// This can be removed when the legacy version is retired.
	page( '*', function( context, next ) {
		if ( [ 'sb', 'sp' ].indexOf( context.querystring ) !== -1 ) {
			const layoutSection = context.querystring === 'sb' ? 'sidebar' : 'sites';
			reduxStore.dispatch( setNextLayoutFocus( layoutSection ) );
			page.replace( context.pathname );
		}

		next();
	} );

	page( '*', function( context, next ) {
		// Don't normalize legacy routes - let them fall through and be unhandled
		// so that page redirects away from Calypso
		if ( isLegacyRoute( context.pathname ) ) {
			return next();
		}

		return normalize( context, next );
	} );

	page( '*', function( context, next ) {
		const path = context.pathname;

		// Bypass this global handler for legacy routes
		// to avoid bumping stats and changing focus to the content
		if ( isLegacyRoute( path ) ) {
			return next();
		}

		// Focus UI on the content on page navigation
		if ( ! config.isEnabled( 'code-splitting' ) ) {
			context.store.dispatch( activateNextLayoutFocus() );
		}

		// Bump general stat tracking overall Newdash usage
		// analytics.mc.bumpStat( { newdash_pageviews: 'route' } );

		next();
	} );

	if ( config.isEnabled( 'keyboard-shortcuts' ) ) {
		setupGlobalKeyboardShortcuts();
	}
}
