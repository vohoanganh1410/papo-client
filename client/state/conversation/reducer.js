import { reduce, values, find } from 'lodash';
import update from 'immutability-helper';
import {
	CONVERSATION_REQUEST,
	CONVERSATION_REQUEST_SUCCESS,
	CONVERSATION_REQUEST_FAILURED,
	CONVERSATION_RECEIVED,
	CONVERSATION_REQUEST_MORE,
	CONVERSATION_REQUEST_MORE_SUCCESS,
	CONVERSATION_REQUEST_MORE_FAILURED,
	CONVERSATION_RECEIVED_MORE,
	RECEIVED_PENDING_MESSAGE,
	ON_SWITCH_PAGE,
	RECEIVED_CONVERSATION_NOTE,
	CREATE_CONVERSATION_NOTE_SUCCESS,
	CREATE_CONVERSATION_NOTE_FAILURED,
	CHANGE_SELECTED_CONVERSATION,
	RECEIVED_CONVERSATION_UPDATED,
	RECEIVED_CONVERSATION_MESSAGE,
} from 'state/action-types';
import { ConversationTypes } from 'action-types';
import config from 'config';

import { combineReducers, createReducer } from 'state/utils';

export const _data = createReducer(
	{},
	{
		[ CONVERSATION_RECEIVED ]: ( state, { conversation } ) => {
			return reduce(
				conversation,
				( memo, c ) => {
					if ( memo === state ) {
						memo = { ...memo };
					}

					memo[ c.id ] = c;
					return memo;
				},
				state
			);
			// return conversation || [];
		},
		[ CONVERSATION_RECEIVED_MORE ]: ( state, { conversation } ) => {
			if ( ! conversation || ! conversation.length === 0 ) return state;

			const messageByIds = reduce(
				conversation,
				( memo, c ) => {
					if ( memo === state ) {
						memo = { ...memo };
					}

					memo[ c.id ] = c;
					return memo;
				},
				state
			);

			return messageByIds;

			// return state.concat( conversation );
		},
		[ ON_SWITCH_PAGE ]: () => null,
		[ RECEIVED_PENDING_MESSAGE ]: ( state, { data } ) => {
			if ( ! data ) return state;
			// return state.concat( data );
			return {
				...state,
				[ data.id ]: data,
			};
		},
		[ RECEIVED_CONVERSATION_UPDATED ]: ( state, { data, selectedId } ) => {
			if ( ! data.id || ! data.newMessage || ( selectedId && data.id !== selectedId ) ) {
				return state;
			}

			const message = data.newMessage;

			return {
				...state,
				[ message.id ]: Object.assign( message, {
					sent: true,
				} ),
			};
		},
		[ CHANGE_SELECTED_CONVERSATION ]: () => null,
		[ ConversationTypes.MESSAGE_SENT ]: ( state, { data } ) => {
			if ( ! data || ! data.messageId ) return state;

			const messagesArray = values( state );
			if ( messagesArray && messagesArray.length > 0 ) {
				const needUpdateMessage = find( messagesArray, { message_id: data.messageId } );

				if ( needUpdateMessage ) {
					return {
						...state,
						[ needUpdateMessage.id ]: Object.assign( needUpdateMessage, {
							delivered: true,
						} ),
					};
					// return update( state, {
					// 	[ needUpdateMessage.id ]: { $merge: { sent: true } },
					// } );
				}
			}

			return state;
		},
		[ RECEIVED_CONVERSATION_MESSAGE ]: ( state, { data } ) => {
			if ( ! data || ! data.id || ! data.message ) return state;

			if ( data.pending_message_id ) {
				const messagesArray = values( state );
				if ( messagesArray && messagesArray.length > 0 ) {
					const needUpdateMessage = find( messagesArray, {
						pending_message_id: data.pending_message_id,
					} );

					if ( needUpdateMessage ) {
						return update( state, {
							[ needUpdateMessage.id ]: {
								$merge: {
									message_id: data.message.message_id,
									created_time: data.message.created_time,
									sent: true,
									user_id: data.message.user_id,
								},
							},
						} );
					}
				}
			}

			return {
				...state,
				[ data.id ]: data.message,
			};
		},
	}
);

export const isLoading = createReducer( false, {
	[ CONVERSATION_REQUEST ]: () => true,
	[ CONVERSATION_REQUEST_SUCCESS ]: () => false,
	[ CONVERSATION_REQUEST_FAILURED ]: () => false,
	[ CONVERSATION_REQUEST_MORE ]: () => true,
	[ CONVERSATION_REQUEST_MORE_SUCCESS ]: () => false,
	[ CONVERSATION_REQUEST_MORE_FAILURED ]: () => false,
	// [ CONVERSATION_RECEIVED ]: () => false,
} );

export const isLoadingOlder = createReducer( false, {
	[ CONVERSATION_REQUEST_MORE ]: () => true,
	[ CONVERSATION_REQUEST_MORE_SUCCESS ]: () => false,
	[ CONVERSATION_REQUEST_MORE_FAILURED ]: () => false,
	// [ CONVERSATION_RECEIVED_MORE ]: () => false,
	// [ CONVERSATION_REQUEST ]: () => false,
} );

export const loadingError = createReducer( null, {
	[ CONVERSATION_REQUEST ]: () => null,
	[ CONVERSATION_REQUEST_SUCCESS ]: () => null,
	[ CONVERSATION_REQUEST_FAILURED ]: () => 'Không thể tải dữ liệu. Vui lòng kiểm tra lại',
	[ CONVERSATION_REQUEST_MORE_FAILURED ]: () => 'Không thể tải thêm dữ liệu. Vui lòng kiểm tra lại',
	[ CONVERSATION_REQUEST_MORE ]: () => null,
	[ CONVERSATION_REQUEST_MORE_SUCCESS ]: () => null,
} );

export const reachedEnd = createReducer(
	{},
	{
		[ CONVERSATION_RECEIVED ]: ( state, { conversation, conversationId } ) => {
			if ( ! conversation ) return state;

			return {
				...state,
				[ conversationId ]: true,
			};
		},
	}
);

export const reachedStart = createReducer(
	{},
	{
		[ CONVERSATION_RECEIVED ]: ( state, { conversation, conversationId, limit } ) => {
			if ( ! conversation ) return true;

			return {
				[ conversationId ]: conversation.length < ( limit || config( 'conversation_page_size' ) ),
			};
		},
		[ CONVERSATION_RECEIVED_MORE ]: ( state, { conversation, conversationId, limit } ) => {
			if ( ! conversation ) {
				return {
					[ conversationId ]: true,
				};
			}

			return {
				[ conversationId ]: conversation.length < ( limit || config( 'conversation_page_size' ) ),
			};
		},
	}
);

export const lastRequestTime = createReducer( null, {
	[ CONVERSATION_REQUEST ]: () => Date.now(),
	[ CONVERSATION_REQUEST_MORE ]: () => Date.now(),
	[ CHANGE_SELECTED_CONVERSATION ]: () => null,
} );

export default combineReducers( {
	data: _data,
	isLoading,
	isLoadingOlder,
	loadingError,
	reachedEnd,
	reachedStart,
	lastRequestTime,
} );
