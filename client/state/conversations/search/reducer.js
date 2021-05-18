import { reduce } from 'lodash';

import { ConversationTypes } from 'action-types';

import { combineReducers, createReducer } from 'state/utils';

export const isSearching = createReducer( false, {
	[ ConversationTypes.SEARCH_CONVERSATION_REQUEST ]: () => true,
	[ ConversationTypes.SEARCH_CONVERSATION_SUCCESS ]: () => false,
	[ ConversationTypes.SEARCH_CONVERSATION_FAILURED ]: () => false,
} );

export const searchData = createReducer(
	{},
	{
		[ ConversationTypes.SEARCH_CONVERSATION_SUCCESS ]: ( state, { data } ) => {
			return reduce(
				data,
				( memo, conversation ) => {
					const { id } = conversation.data;

					if ( memo === state ) {
						memo = { ...memo };
					}

					memo[ id ] = conversation;
					return memo;
				},
				state
			);
		},
		[ ConversationTypes.SEARCH_CONVERSATION_REQUEST ]: () => null,
	}
);

export const selectedId = createReducer( null, {
	[ ConversationTypes.CHANGE_SELECTED_CONVERSATION_SEARCH ]: ( state, { conversation } ) => {
		if ( ! conversation ) return state;

		return conversation.data.id;
	},
} );

export default combineReducers( {
	isSearching,
	searchData,
	selectedId,
} );
