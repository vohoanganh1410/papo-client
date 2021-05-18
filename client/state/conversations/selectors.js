/** @format */

/**
 * External dependencies
 */
// import { filter, find, has, get, includes, isEqual, omit, some, values } from 'lodash';

import { get, values } from 'lodash';

export function getConversation( state, id ) {
	// console.log("state.conversations", state.conversations.data);
	return get( state.conversations.data, id );
}

export function getConversationTags( state, id ) {
	const conversation = get( state.conversations.data, id );
	return conversation ? conversation.tags : null;
}

export function getConversations( state ) {
	return values( state.conversations.data );
}

export function isRequestingConversations( state ) {
	return state.conversations.isRequesting;
}

export function getKeys( state ) {
	return state.conversations.keys;
}

export function getPendingMessages( state, conversationId ) {
	return get( state.conversations.pendingMessages, conversationId );
}

export function isSearching( state ) {
	return state.conversations.search ? state.conversations.search.isSearching : false;
}

export function getSearchData( state ) {
	return state.conversations.search ? values( state.conversations.search.searchData ) : null;
}

export function getSelectedSearch( state ) {
	return state.conversations.search ? state.conversations.search.selectedId : null;
}

export function getSelectedConversationSearch( state, conversationId ) {
	if ( ! state.conversations.search ) return null;
	return get( state.conversations.search.searchData, conversationId );
}
