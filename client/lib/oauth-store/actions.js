/** @format */

/**
 * External dependencies
 */

import request from 'superagent';
// import axios from 'axios';

/**
 * Internal dependencies
 */
import Dispatcher from '../../dispatcher';
import { actions, errors as errorTypes } from './constants';
import { USER_RECEIVE, USERS_LOGOUT } from '../../actions/types';
// import analytics from 'lib/analytics';

import { API_URL } from '../../config';

export function login( username, password, auth_code ) {
	Dispatcher.handleViewAction( {
		type: actions.AUTH_LOGIN,
	} );

	request
		.post( `${API_URL}/authentication` )
		.set( 'Content-Type', 'application/x-www-form-urlencoded' )
		.accept( 'application/json' )
		.send( {
			email: username,
			password: password,
			strategy: "local",
		} )
		.end( ( error, data ) => {
			// bumpStats( error, data );
			// console.log(error);

			Dispatcher.handleServerAction( {
				type: actions.RECEIVE_AUTH_LOGIN,
				data,
				error,
			} );
		} );

}

export function oauthLogin() {
	Dispatcher.handleViewAction( {
		type: actions.OAUTH_LOGIN,
	} );
	// const params = {
 //        method: "GET",
 //        headers: {
 //            "Content-Type": "application/json",
 //            "Access-Control-Allow-Origin": "http://localhost:3001",
 //            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
 //            "Access-Control-Allow-Headers": "X-Requested-With,content-type",
 //            "Access-Control-Allow-Credentials": true,
 //        },
 //        withCredentials: true,
 //        data: undefined
 //    }

	request
		.get( `${API_URL}/auth/facebook` )
		.set( 'Content-Type', 'application/x-www-form-urlencoded' )
		// .set("Access-Control-Allow-Origin", "http://localhost:3030")
		// .set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
		// .set("Access-Control-Allow-Headers", "X-Requested-With,content-type")
		// .set("Access-Control-Allow-Credentials", true)
		// .accept( 'application/json' )
		.end( ( error, data ) => {
			// bumpStats( error, data );
			console.log(error);
			console.log(data);

			Dispatcher.handleServerAction( {
				type: actions.RECEIVE_OAUTH_LOGIN,
				data,
				error,
			} );
		} );
}

/*
* login by jwt token
*/
export function jwtLogin( token ) {
	// Dispatcher.handleViewAction( {
	// 	type: actions.AUTH_LOGIN,
	// } );

	return new Promise(function(resolve, reject){
		if(!token) reject(null);
		request
		.post( `${API_URL}/authentication` )
		.set( 'Content-Type', 'application/x-www-form-urlencoded' )
		.accept( 'application/json' )
		.send( {
			accessToken: token,
			strategy: "jwt",
		} )
		.end( ( error, data ) => {
			if(console.error()){
				reject(null);
			}
			// bumpStats( error, data );
			// console.log(data.body.user);
			// Dispatcher.handleServerAction( {
			// 	type: USER_RECEIVE,
			// 	data,
			// } );
			// resolve(data.body.user);
		} );
	})

}

// function bumpStats( error, data ) {
// 	let errorType;

// 	if ( error ) {
// 		if ( data && data.body ) {
// 			errorType = data.body.error;
// 		} else {
// 			errorType = 'status_' + error.status;
// 		}
// 	}

// 	if ( errorType === errorTypes.ERROR_REQUIRES_2FA ) {
// 		analytics.tracks.recordEvent( 'calypso_oauth_login_needs2fa' );
// 		analytics.mc.bumpStat( 'calypso_oauth_login', 'success-needs-2fa' );
// 	} else if ( errorType ) {
// 		analytics.tracks.recordEvent( 'calypso_oauth_login_fail', {
// 			error: error.error,
// 		} );

// 		analytics.mc.bumpStat( {
// 			calypso_oauth_login_error: errorType,
// 			calypso_oauth_login: 'error',
// 		} );
// 	} else {
// 		analytics.tracks.recordEvent( 'calypso_oauth_login_success' );
// 		analytics.mc.bumpStat( 'calypso_oauth_login', 'success' );
// 	}
// }
