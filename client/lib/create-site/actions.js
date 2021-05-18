/** @format */

/**
 * External dependencies
 */
// import debugFactory from 'debug';
// import { assign, defer, get, isEmpty, isNull, omitBy, pick, startsWith } from 'lodash';
// import async from 'async';
// import { parse as parseURL } from 'url';
// import page from 'page';
// import request from 'superagent';
import papo from 'lib/papo';

import {
	SITE_CREATE_SUCCESS,
	SITE_CREATE_FAILURE
} from 'state/action-types';

import { receiveSite } from 'state/sites/actions';

/**
 * Internal dependencies
 */
// import config from 'config';

// const CreateSiteActions = {
// 	createSite( site ) {
// 		return papo
// 			.me()
// 			.createSite( { site: site } )
// 			.then( data => {
// 				// console.log( data );
// 				const error = data.error;
// 				if( data.error ) {
// 					// console.log( error );
// 					dispatch( {
// 						type: SITE_CREATE_FAILURE,
// 						error,
// 					} );
// 					return Promise.reject( error );
// 				}
				
// 				const site = data.site;
// 				// console.log( response.site );
// 				dispatch( receiveSite( site ) );
// 				dispatch( {
// 					type: SITE_CREATE_SUCCESS,
// 					site,
// 				} );

// 				return Promise.resolve( site );
// 			} )
// 			.catch( error => {
// 				// dispatch( {
// 				// 	type: SITE_CREATE_FAILURE,
// 				// 	error,
// 				// } );

// 				return Promise.reject( error );
// 			} );
// 		// return new Promise( ( resolve, reject ) => {
// 		// 	request
// 		// 		.post( `${ config( 'api_url' ) }/api/v1/site-leader/sites/add` )
// 		// 		.withCredentials()
// 		// 		.send( { site } )
// 		// 		.then( response => {
// 		// 			// console.log( response );
// 		// 			resolve( response );
// 		// 		} )
// 		// 		.catch( error => {
// 		// 			reject( error );
// 		// 		} )
// 		// } )
		

// 		// request
// 		// 	.post( '/sms' )
// 		// 	.send( { username, password } )
// 		// 	.end( ( error, data ) => {
// 		// 		timeout = setTimeout( resetCode, 1000 * 30 );

// 		// 		Dispatcher.handleServerAction( {
// 		// 			type: actions.RECEIVE_AUTH_CODE_REQUEST,
// 		// 			data,
// 		// 			error,
// 		// 		} );
// 		// 	} );
// 	}
// }
 // export default CreateSiteActions;

 export function createSite( site ) {
 	return dispatch => {
		return papo
			.me()
			.createSite( { site: site } )
			.then( data => {
				// console.log( data );
				const error = data.error;
				if( data.error ) {
					// console.log( error );
					dispatch( {
						type: SITE_CREATE_FAILURE,
						error,
					} );
					// return Promise.reject( error );
				}
				
				const site = data.site;
				// console.log( response.site );
				dispatch( receiveSite( site ) );
				dispatch( {
					type: SITE_CREATE_SUCCESS,
					site,
				} );

				// return Promise.resolve( site );
			} )
			.catch( error => {
				dispatch( {
					type: SITE_CREATE_FAILURE,
					error,
				} );

				// return Promise.reject( error );
			} );
 	}
 }