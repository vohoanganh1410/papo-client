import { get, values } from 'lodash';

export function getConversationData( state ) {
	return state.conversation.data && state.conversation.data;
}

export function isLoading( state ) {
	return state.conversation.isLoading;
}

export function isLoadingOlder( state ) {
	return state.conversation.isLoadingOlder;
}

export function getMessageKeys( state ) {
	return state.conversation.keys;
}

export function getConversationMessages( state ) {
	return values( state.conversation.data );
}

export function getConversationNotes( state ) {
	return state.conversation.notes;
}

export function loadingError( state ) {
	return state.conversation.loadingError;
}

export function isReachedEnd( state, conversationId ) {
	return get( state.conversation.reachedEnd, conversationId );
}

export function isReachedStart( state, conversationId ) {
	return get( state.conversation.reachedStart, conversationId );
}

export function getLastRequestTime( state ) {
	return state.conversation.lastRequestTime;
}
