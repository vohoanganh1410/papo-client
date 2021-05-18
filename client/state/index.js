import { createStore, applyMiddleware, compose } from 'redux';
import devTools from 'remote-redux-devtools';
import thunkMiddleware from 'redux-thunk';

// import automatedTransfer from './automated-transfer/reducer';
import navigationMiddleware from './navigation/middleware';
import noticesMiddleware from './notices/middleware';
import consoleDispatcher from 'state/console-dispatch';
// import { enhancer as httpDataEnhancer } from 'state/data-layer/http-data';
import actionLogger from 'state/action-log';
import config from 'config';

import initialReducer from './reducer';

const addReducerEnhancer = nextCreator => ( reducer, initialState ) => {
	const nextStore = nextCreator( reducer, initialState );

	let currentReducer = reducer;
	function addReducer( keys, subReducer ) {
		currentReducer = currentReducer.addReducer( keys, subReducer );
		this.replaceReducer( currentReducer );
	}

	function getCurrentReducer() {
		return currentReducer;
	}

	return Object.assign( {}, nextStore, { addReducer, getCurrentReducer } );
};

export function createReduxStore( initialState, reducer = initialReducer ) {
	const isBrowser = typeof window === 'object';
	const isAudioSupported = typeof window === 'object' && typeof window.Audio === 'function';
	const middlewares = [
		thunkMiddleware,
		// other middlewares
		// require( './data-layer/wpcom-api-middleware.js' ).default,
		// isBrowser && require( './data-layer/extensions-middleware.js' ).default,
		noticesMiddleware,
		navigationMiddleware,
		// isBrowser && require( './lib/middleware.js' ).default,
		isBrowser &&
			config.isEnabled( 'restore-last-location' ) &&
			require( './routing/middleware.js' ).default,
		isAudioSupported && require( './audio/middleware.js' ).default,
	].filter( Boolean );

	const devToolsEnhancer =
		typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ // eslint-disable-line no-underscore-dangle
			? window.__REDUX_DEVTOOLS_EXTENSION__ // eslint-disable-line no-underscore-dangle
			: () => {};
	// () => {
	// 	return devTools( {
	// 		name: 'Papo',
	// 		hostname: 'localhost',
	// 		port: 5678,
	// 		realtime: true,
	// 	} );
	// };

	const enhancers = [
		addReducerEnhancer,
		isBrowser && window.app && window.app.isDebug && consoleDispatcher,
		// httpDataEnhancer,
		applyMiddleware( ...middlewares ),
		isBrowser && window.app && window.app.isDebug && actionLogger,
		isBrowser && /*config( 'env' ) !== 'production'*/ true && devToolsEnhancer(),
	].filter( Boolean );

	return createStore( reducer, initialState, compose( ...enhancers ) );

	// const enhancers = [
	// 	isBrowser && window.app && window.app.isDebug && consoleDispatcher,
	// 	applyMiddleware( ...middlewares ),
	// 	isBrowser && window.app && window.app.isDebug && actionLogger,
	// 	isBrowser && config( 'env' ) !== 'production' && devToolsEnhancer() /*window.devToolsExtension && window.devToolsExtension()*/,
	// ].filter( Boolean );
	//
	// return compose( ...enhancers )( createStore )( reducer, initialState );
}
