/** @format */
// Initialize polyfills before any dependencies are loaded
import './polyfills';
import '@babel/polyfill';

// if ( process.env.NODE_ENV === 'development' ) {
// 	require( 'lib/wrap-es6-functions' ).default();
// }

/**
 * External dependencies
 */
import debugFactory from 'debug';
import { invoke } from 'lodash';
import page from 'page';

/**
 * Internal dependencies
 */
import { configureReduxStore, locales, setupMiddlewares, utils } from './common';
import { createReduxStore } from 'state';
import initialReducer from 'state/reducer';
import { getInitialState, persistOnChange } from 'state/initial-state';
import detectHistoryNavigation from 'lib/detect-history-navigation';
import userFactory from 'lib/user';
import { setUtilsStore } from 'utils/utils';
// import * as WebSocketActions from 'actions/websocket';

const debug = debugFactory( 'papo' );

const boot = currentUser => {
	debug( "Starting Papo. Let's do this." );
	const project = require( `./project/${ PROJECT_NAME }` );
	invoke( project, 'utils' );
	getInitialState( initialReducer ).then( initialState => {
		const reduxStore = createReduxStore( initialState, initialReducer );
		persistOnChange( reduxStore );

		locales( currentUser, reduxStore );
		invoke( project, 'locales', currentUser, reduxStore );
		configureReduxStore( currentUser, reduxStore );
		utils( currentUser, reduxStore );
		invoke( project, 'configureReduxStore', currentUser, reduxStore );
		setupMiddlewares( currentUser, reduxStore );
		invoke( project, 'setupMiddlewares', currentUser, reduxStore );
		// WebSocketActions.initialize( reduxStore );
		detectHistoryNavigation.start();
		setUtilsStore( currentUser, reduxStore );
		page.start( { decodeURLComponents: false } );
	} );
};

window.AppBoot = () => {
	const user = userFactory();
	if ( user.initialized ) {
		boot( user );
	} else {
		user.once( 'change', () => boot( user ) );
	}
};
