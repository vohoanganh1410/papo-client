/** @format */

/**
 * External dependencies
 */
import request from 'superagent';
import config from 'config';
import debugFactory from 'debug';

const debug = debugFactory( 'papo:users:actions' );

/**
 * Internal dependencies
 */
import Dispatcher from 'dispatcher';
import papo from 'lib/papo';
import UsersStore from 'lib/users/store';

export function fetchUsers( fetchOptions ) {
	// console.log( fetchOptions );
	const paginationData = UsersStore.getPaginationData( fetchOptions );
	if ( paginationData.fetchingUsers ) {
		return;
	}
	debug( 'fetchUsers', fetchOptions );
	Dispatcher.handleViewAction( {
		type: 'FETCHING_USERS',
		fetchOptions: fetchOptions,
	} );

	papo.site( fetchOptions.siteId ).usersList( fetchOptions, ( error, data ) => {
		// console.log(data);
		Dispatcher.handleServerAction( {
			type: 'RECEIVE_USERS',
			fetchOptions: fetchOptions,
			data: data,
			error: error,
		} );
	} );

	// request
	// 	.post( `${ config( 'api_url' ) }/api/v1/site-member/siteMembers` )
	// 	.withCredentials()
	// 	.send( { siteId: siteId, fetchOptions: fetchOptions } )
	// 	.then( response => {
	// 		// console.log( response.body.members );
	// 		Dispatcher.handleServerAction( {
	// 			type: 'RECEIVE_USERS',
	// 			fetchOptions: fetchOptions,
	// 			data: {
	// 	    		users: response.body.members,
	// 	    		found: response.body.members ? response.body.members.length : 0
	// 	    	},
	// 			error: null,
	// 		} );
	// 	} )

	// getUsers( fetchOptions.siteId, fetchOptions ).then( ( data ) => {
	// 	// console.log(data);
	// 	Dispatcher.handleServerAction( {
	// 		type: 'RECEIVE_USERS',
	// 		fetchOptions: fetchOptions,
	// 		data: data,
	// 		error: null,
	// 	} );
	// } )

	// wpcom.site( fetchOptions.siteId ).usersList( fetchOptions, ( error, data ) => {
	// 	Dispatcher.handleServerAction( {
	// 		type: 'RECEIVE_USERS',
	// 		fetchOptions: fetchOptions,
	// 		data: data,
	// 		error: error,
	// 	} );
	// } );
}

export function fetchUpdated( fetchOptions ) {
	const paginationData = UsersStore.getPaginationData( fetchOptions );
	if ( paginationData.fetchingUsers ) {
		return;
	}

	Dispatcher.handleViewAction( {
		type: 'FETCHING_UPDATED_USERS',
		fetchOptions: fetchOptions,
	} );

	const updatedFetchOptions = UsersStore.getUpdatedParams( fetchOptions );
	debug( 'Updated fetchOptions: ' + JSON.stringify( updatedFetchOptions ) );

	papo.site( fetchOptions.siteId ).usersList( updatedFetchOptions, ( error, data ) => {
		// console.log(data);
		// Dispatcher.handleServerAction( {
		// 	type: 'RECEIVE_USERS',
		// 	fetchOptions: fetchOptions,
		// 	data: data,
		// 	error: error,
		// } );
		Dispatcher.handleServerAction( {
			type: 'RECEIVE_UPDATED_USERS',
			fetchOptions: fetchOptions,
			data: data,
			error: error,
		} );
	} );

	// wpcom.site( fetchOptions.siteId ).usersList( updatedFetchOptions, ( error, data ) => {
	// 	Dispatcher.handleServerAction( {
	// 		type: 'RECEIVE_UPDATED_USERS',
	// 		fetchOptions: fetchOptions,
	// 		data: data,
	// 		error: error,
	// 	} );
	// } );

	// const siteId = fetchOptions.siteId;

	// request
	// 	.post( `${ config( 'api_url' ) }/api/v1/site-member/siteMembers` )
	// 	.withCredentials()
	// 	.send( { siteId: siteId, fetchOptions: fetchOptions } )
	// 	.then( response => {
	// 		Dispatcher.handleServerAction( {
	// 			type: 'RECEIVE_UPDATED_USERS',
	// 			fetchOptions: fetchOptions,
	// 			data: {
	// 	    		users: response.body.members,
	// 	    		found: response.body.members.length
	// 	    	},
	// 			error: null,
	// 		} );
	// 	} )
}

export function deleteUser( siteId, userId, reassignUserId ) {
	console.log( reassignUserId );
	debug( 'deleteUser', userId );
	const user = UsersStore.getUser( siteId, userId );
	if ( ! user ) {
		return;
	}
	Dispatcher.handleViewAction( {
		type: 'DELETE_SITE_USER',
		siteId: siteId,
		user: user,
	} );

	let attributes;
	if ( 'undefined' !== typeof reassignUserId ) {
		attributes = {
			reassign: reassignUserId,
		};
	}

	// wpcom
	// 	.undocumented()
	// 	.site( siteId )
	// 	.deleteUser( userId, attributes, ( error, data ) => {
	// 		if ( error || ! data.success ) {
	// 			Dispatcher.handleServerAction( {
	// 				type: 'RECEIVE_DELETE_SITE_USER_FAILURE',
	// 				action: 'DELETE_SITE_USER',
	// 				siteId: siteId,
	// 				user: user,
	// 				error: error,
	// 			} );
	// 		} else {
	// 			Dispatcher.handleServerAction( {
	// 				type: 'RECEIVE_DELETE_SITE_USER_SUCCESS',
	// 				action: 'DELETE_SITE_USER',
	// 				siteId: siteId,
	// 				user: user,
	// 				data: data,
	// 			} );
	// 		}
	// 	} );
}

export function updateUser( siteId, userId, attributes ) {
	debug( 'updateUser', userId );
	const user = UsersStore.getUser( siteId, userId ),
		updatedUser = Object.assign( user, attributes );

	if ( ! user ) {
		return;
	}

	Dispatcher.handleViewAction( {
		type: 'UPDATE_SITE_USER',
		siteId: siteId,
		user: updatedUser,
	} );
	// console.log( attributes );

	request
		.post( `${ config( 'api_url' ) }/api/v1/site-leader/updateMemberInfo` )
		.withCredentials()
		.send( { siteId: siteId, userId: userId, attributes: attributes } )
		.then( response => {
			const data = response.body.data;
			Dispatcher.handleServerAction( {
				type: 'RECEIVE_UPDATE_SITE_USER_SUCCESS',
				action: 'UPDATE_SITE_USER',
				siteId: siteId,
				user: user,
				data: data,
			} );
		} )
		.catch( error => {
			debug( 'Update user error', error );
			Dispatcher.handleServerAction( {
				type: 'RECEIVE_UPDATE_SITE_USER_FAILURE',
				action: 'UPDATE_SITE_USER',
				siteId: siteId,
				user: user,
				error: error,
			} );
		} );

	// wpcom
	// 	.undocumented()
	// 	.site( siteId )
	// 	.updateUser( userId, attributes, ( error, data ) => {
	// 		if ( error ) {
	// 			debug( 'Update user error', error );
	// 			Dispatcher.handleServerAction( {
	// 				type: 'RECEIVE_UPDATE_SITE_USER_FAILURE',
	// 				action: 'UPDATE_SITE_USER',
	// 				siteId: siteId,
	// 				user: user,
	// 				error: error,
	// 			} );
	// 		} else {
	// 			Dispatcher.handleServerAction( {
	// 				type: 'RECEIVE_UPDATE_SITE_USER_SUCCESS',
	// 				action: 'UPDATE_SITE_USER',
	// 				siteId: siteId,
	// 				user: user,
	// 				data: data,
	// 			} );
	// 		}
	// 	} );
}

export function fetchUser( fetchOptions, member_id ) {
	// console.log( fetchOptions );
	debug( 'fetchUser', fetchOptions );

	Dispatcher.handleViewAction( {
		type: 'FETCHING_USERS',
		fetchOptions: fetchOptions,
	} );

	// const siteId = fetchOptions.siteId;

	// request
	// 	.post( `${ config( 'api_url' ) }/api/v1/site-member/member` )
	// 	.withCredentials()
	// 	.send( { siteId: siteId, member_id: member_id } )
	// 	.then( response => {
	// 		const data = response.body.member;
	// 		Dispatcher.handleServerAction( {
	// 			type: 'RECEIVE_SINGLE_USER',
	// 			fetchOptions: fetchOptions,
	// 			user: data,
	// 		} );
	// 	} )
	// 	.catch( error => {
	// 		Dispatcher.handleServerAction( {
	// 			type: 'RECEIVE_USER_FAILED',
	// 			fetchOptions: fetchOptions,
	// 			siteId: fetchOptions.siteId,
	// 			login: member_id,
	// 			error: error,
	// 		} );
	// 	} )

	papo
		.undocumented()
		.site( fetchOptions.siteId )
		.getUser( member_id, ( error, data ) => {
			if ( error ) {
				Dispatcher.handleServerAction( {
					type: 'RECEIVE_USER_FAILED',
					fetchOptions: fetchOptions,
					siteId: fetchOptions.siteId,
					login: member_id,
					error: error,
				} );
			} else {
				Dispatcher.handleServerAction( {
					type: 'RECEIVE_SINGLE_USER',
					fetchOptions: fetchOptions,
					user: data,
				} );
			}
		} );
}

// for test
function getUsers( siteId, fetchOptions = {} ) {
	// console.log(fetchOptions);
	return new Promise( function( resolve, reject ) {
		setTimeout( () => {
			// console.log( [ testList[0] ] );
			// pretend search

			resolve( {
				users: testUsers,
				found: testUsers.length,
			} );
		}, 500 );
	} );
}
