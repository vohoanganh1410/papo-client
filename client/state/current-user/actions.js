/** @format */

/**
 * Internal dependencies
 */
import request from 'superagent';
import config from 'config';
import {
	USER_RECEIVE,
	USER_LOGOUT,
	REQUEST_ME_INVITES,
	RECEIVED_ME_INVITES,
	REQUEST_ME_INVITES_SUCCESS,
	REQUEST_ME_INVITES_FAILURE,
	SET_SELECTED_TEAM,
} from 'state/action-types';
import papo from 'lib/papo';
// import Dispatcher from '../../dispatcher';

/**
 * Returns an action object to be used in signalling that a user object has
 * been received.
 *
 * @param  {Object} user User received
 * @return {Object}      Action object
 */
export function receiveUser( user ) {
	return {
		type: USER_RECEIVE,
		user,
	};
}

/**
 * Action creator function: USER_LOGOUT
 *
 */
export const logoutUser = redirectTo => ( dispatch, getState ) => {
	request
		.get( `${ config( 'api_url' ) }/logout` )
		.withCredentials()
		.then( function( res ) {
			// console.log(res);
			dispatch( { type: USER_LOGOUT } );
		} );
	return Promise.resolve( redirectTo );
};

/**
 * Triggers a network request to fetch invites for the specified site of current user.
 *
 * @return {Function}        Action thunk
 */
export function requestMeInvites() {
	return dispatch => {
		dispatch( {
			type: REQUEST_ME_INVITES,
		} );

		papo
			.me()
			.invitesList()
			.then( ( { invites } ) => {
				console.log( invites );
				dispatch( receivedMeInvites( invites ) );
				dispatch( {
					type: REQUEST_ME_INVITES_SUCCESS,
					invites,
				} );
			} )
			.catch( error => {
				console.log( error );
				dispatch( {
					type: REQUEST_ME_INVITES_FAILURE,
					error,
				} );
			} );
	};
}

/**
 * Returns an action object to be used in signalling that invite objects have
 * been received.
 *
 * @param  {Array}  invites Invites received
 * @return {Object}       Action object
 */
export function receivedMeInvites( invites ) {
	return {
		type: RECEIVED_ME_INVITES,
		invites,
	};
}

/**
 * Returns an action object to be used in signalling that invite objects have
 * been received.
 *
 * @param  {Array}  imvite Invite received
 * @return {Object}       Action object
 */
export function receivedMeInvite( invite ) {
	return receivedMeInvites( [ invite ] );
}

export const setSelectedTeam = team => dispatch => {
	return dispatch( {
		type: SET_SELECTED_TEAM,
		team: team,
	} );
};
