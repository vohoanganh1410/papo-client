/** @format */

/**
 * External dependencies
 */
// import { isNumber, toArray, chunk, find } from 'lodash';
// import request from 'superagent';

/**
 * Internal dependencies
 */
import papo from 'lib/papo';
// import config from 'config';
import {
	CONVERSATIONS_RECEIVE,
	CONVERSATIONS_REQUEST,
	CONVERSATIONS_REQUEST_SUCCESS,
	CONVERSATIONS_REQUEST_FAILURE,
	CURRENT_PAGE_CHANGED,

	DELETE_PENDING_MESSAGE,
} from 'state/action-types';

/**
 * Returns an action object to be used in signalling that a post object has
 * been received.
 *
 * @param  {Object} post Post received
 * @return {Object}      Action object
 */
export function receiveConversation( conversation ) {
	return receiveConversations( [ conversation ] );
}

/**
 * Returns an action object to be used in signalling that post objects have
 * been received.
 *
 * @param  {Array}  posts Posts received
 * @return {Object}       Action object
 */
export function receiveConversations( conversations ) {
	return {
		type: CONVERSATIONS_RECEIVE,
		conversations,
	};
}

/** 
 * Triggers a network request to fetch posts for the specified site and query.
 *
 * @param  {Number}   siteId Site ID
 * @param  {String}   query  Post query
 * @return {Function}        Action thunk
 */
export function requestPageConversations( pageId, query = {} ) {
	// if ( ! pageId ) {
	// 	return null;
	// }

	return requestConversations( pageId, query );
}

/**
 * Returns a function which, when invoked, triggers a network request to fetch
 * posts across all of the current user's sites for the specified query.
 *
 * @param  {String}   query Post query
 * @return {Function}       Action thunk
 */
export function requestAllPagesConversations( query = {} ) {
	return requestConversations( null, query );
}

/**
 * Triggers a network request to fetch posts for the specified site and query.
 *
 * @param  {?Number}  siteId Site ID
 * @param  {String}   query  Post query
 * @return {Function}        Action thunk
 */
function requestConversations( pageId, query = {} ) {
	
	return dispatch => {
		// if ( ! query || ! query.stopIndex > 0 ) {
		// 	alert('sss')
		// 	return {}
		// };
		dispatch( {
			type: CONVERSATIONS_REQUEST,
			pageId,
			query,
		} );		

		// console.log( query );

		return papo
			.undocumented()
			.listConversations( { ...query } )
			.then( response => {
				const conversations = response
				if ( conversations && conversations.length ) {
					const found = query.search && query.search !== '' ? conversations.length : conversations.length + ( query ? parseInt( query.page ) * parseInt( query.number ) : 0 );
					dispatch( receiveConversations( conversations ) );
					dispatch( {
						type: CONVERSATIONS_REQUEST_SUCCESS,
						pageId,
						query,
						found,
						conversations,
					} );
				}
				
			} )
			.catch( error => {
				console.log( error );
				dispatch( {
					type: CONVERSATIONS_REQUEST_FAILURE,
					pageId,
					query,
					error,
				} );
			} );		
	};
}

export function switchPages() {
	return dispatch => {
		dispatch( {
			type: CURRENT_PAGE_CHANGED,
		} )
	}
}

export function deletePendingMessage( message ) {
	return dispatch => {
		dispatch( {
			type: DELETE_PENDING_MESSAGE,
			message,
		} )
	}
}
