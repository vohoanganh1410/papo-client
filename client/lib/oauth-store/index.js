/** @format */

/**
 * External dependencies
 */

import debugFactory from 'debug';
import page from 'page';

const debug = debugFactory( 'papo:auth:store' );

/**
 * Internal dependencies
 */
import { createReducerStore } from '../store';
import { actions as ActionTypes } from './constants';
import { errors as errorTypes } from './constants';
import * as OAuthToken from '../oauth-token';

/**
 * Module variables
 */
const initialState = {
	requires2fa: false,
	inProgress: false,
	errorLevel: false,
	errorMessage: false,
};

function handleAuthError( error, data ) {
	let stateChanges = { errorLevel: 'is-error', requires2fa: false, inProgress: false };

	stateChanges.errorMessage = data && data.body ? data.body.message : error.message;

	debug( 'Error processing login: ' + stateChanges.errorMessage );

	if ( data && data.body ) {
		if ( data.body.error === errorTypes.ERROR_REQUIRES_2FA ) {
			stateChanges.requires2fa = true;
			stateChanges.errorLevel = 'is-info';
		} else if ( data.body.error === errorTypes.ERROR_INVALID_OTP ) {
			stateChanges.requires2fa = true;
		}
	}
	return stateChanges;
}

function goToLogin() {
	document.location.replace( '/' );
}

function handleLogin( response ) {
	debug( 'Access token received' );
	// console.log(response);
	OAuthToken.setToken( response.body.token );
	goToLogin();
}

const AuthStore = createReducerStore( function( state, payload ) {
	let stateChanges;
	const { action } = payload;

	switch ( action.type ) {
		case ActionTypes.AUTH_RESET:
			stateChanges = initialState;
			break;
		case ActionTypes.AUTH_LOGIN:
			stateChanges = { inProgress: true, errorLevel: false, errorMessage: false };
			break;
		case ActionTypes.RECEIVE_AUTH_LOGIN:
			if ( action.error ) {
				stateChanges = handleAuthError( action.error, action.data );
			} else {
				// stateChanges = { user: action.data };
				handleLogin( action.data );
			}
			break;
		// case ActionTypes.AUTH_LOGOUT:
		// 	stateChanges = { users: null };
		// 	break;
	}

	if ( stateChanges ) {
		return Object.assign( {}, state, stateChanges );
	}

	return state;
}, initialState );

export default AuthStore;
