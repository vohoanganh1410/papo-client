/** @format */

/**
 * External dependencies
 */
import { reduce, get } from 'lodash';
import update from 'immutability-helper';

/**
 * Internal dependencies
 */
import { combineReducers, createReducer } from 'state/utils';
import {
	CONVERSATIONS_RECEIVE,
	CONVERSATIONS_REQUEST,
	// CONVERSATIONS_REQUEST_SUCCESS,
	CONVERSATIONS_REQUEST_FAILURE,
	ON_SWITCH_PAGE,
	CONVERSATION_RECEIVED_TAG,
	CONVERSATION_REMOVED_TAG,
	RECEIVED_CONVERSATION_SEEN,
	RECEIVED_CONVERSATION_UNSEEN,
	RECEIVED_PENDING_MESSAGE,
	REPLY_FACEBOOK_COMMENT_SUCCESS,
	REPLY_FACEBOOK_COMMENT_FAILED,
	DELETE_PENDING_MESSAGE,
	RECEIVED_CONVERSATION_UPDATED,
	CHANGE_SELECTED_CONVERSATION,
} from 'state/action-types';

import { ConversationTypes } from 'action-types';

import search from './search/reducer';
import { Client1 } from '../../lib/client1';

export const _data = createReducer(
	{},
	{
		[ CONVERSATIONS_RECEIVE ]: ( state, { conversations } ) => {
			// const conversations = action.conversations;
			return reduce(
				conversations,
				( memo, conversation ) => {
					const { id } = conversation;

					if ( memo === state ) {
						memo = { ...memo };
					}

					memo[ id ] = conversation;
					return memo;
				},
				state
			);
		},
		[ ON_SWITCH_PAGE ]: () => null, // reset conversation list on change page
		[ CONVERSATION_RECEIVED_TAG ]: ( state, { data } ) => {
			if ( data && data.new_tag ) {
				return update( state, {
					[ data.new_tag.conversation_id ]: {
						tags: {
							$push: [
								{
									id: data.new_tag.tag_id,
									color: data.page_tag.color,
									name: data.page_tag.name,
								},
							],
						},
					},
				} );
				// const updateItem = get( state, data.new_tag.conversation_id );
				//
				// if ( updateItem ) {
				// 	updateItem.tags = updateItem.tags.concat( {
				// 		id: data.new_tag.tag_id,
				// 		color: data.page_tag.color,
				// 	} )
				// }
				//
				// return {
				// 	...state,
				// 	updateItem,
				// }
			}
			return state;
		},
		[ CONVERSATION_REMOVED_TAG ]: ( state, { data } ) => {
			return update( state, {
				[ data.conversation_id ]: {
					tags: { $apply: arr => arr.filter( item => item.id !== data.tag_id ) },
				},
			} );
		},
		[ RECEIVED_PENDING_MESSAGE ]: ( state, { data } ) => {
			if ( ! data || ! ( data.conversation_id in state ) ) return state;

			return update( state, {
				[ data.conversation_id ]: {
					$merge: { snippet: data.message, updated_time: data.created_time },
				},
			} );
		},
		[ CHANGE_SELECTED_CONVERSATION ]: ( state, { current_selected, previous_selected } ) => {
			if ( ! current_selected || current_selected.length === 0 ) return state;

			if ( ! previous_selected || previous_selected.length === 0 ) {
				return update( state, {
					[ current_selected ]: { $merge: { selected: true } },
				} );
			}

			// find and edit previous selected
			const previousItem = get( state, previous_selected );
			if ( ! previousItem ) {
				return update( state, {
					[ current_selected ]: { $merge: { selected: true } },
				} );
			}

			let needUpdate = { selected: false };

			if (
				previousItem &&
				typeof previousItem.pending_updated_time !== 'undefined' &&
				previousItem.pending_updated_time !== null
			) {
				needUpdate = Object.assign( needUpdate, {
					updated_time: previousItem.pending_updated_time,
				} );
			}

			if (
				previousItem &&
				typeof previousItem.pending_seen_value !== 'undefined' &&
				previousItem.pending_seen_value !== null &&
				previousItem.pending_seen_value !== previousItem.seen
			) {
				needUpdate = Object.assign( needUpdate, {
					seen: previousItem.pending_seen_value,
				} );
			}

			return update( state, {
				[ current_selected ]: {
					$merge: { selected: true, pending_seen_value: null, pending_updated_time: null },
				},
				[ previous_selected ]: {
					$merge: needUpdate,
				},
			} );
		},
		[ RECEIVED_CONVERSATION_SEEN ]: ( state, { data } ) => {
			if ( ! data || ! ( data.conversation_id in state ) ) return state;

			const thisItem = get( state, data.conversation_id );

			if ( thisItem.selected === true ) {
				return update( state, {
					[ data.conversation_id ]: { $merge: { pending_seen_value: true } },
				} );
			}

			return update( state, {
				[ data.conversation_id ]: { $merge: { seen: true } },
			} );
		},
		[ RECEIVED_CONVERSATION_UNSEEN ]: ( state, { data } ) => {
			if ( ! data || ! data.conversation || ! ( data.conversation.id in state ) ) return state;

			const thisItem = get( state, data.conversation.id );

			if ( thisItem.selected === true ) {
				return update( state, {
					[ data.conversation.id ]: { $merge: { pending_seen_value: false } },
				} );
			}

			return update( state, {
				[ data.conversation.id ]: { $merge: { seen: false } },
			} );
		},
		[ RECEIVED_CONVERSATION_UPDATED ]: ( state, { data } ) => {
			if ( ! data.id || ! data.conversation ) {
				// console.log( 'Không cập nhật state' );
				return state;
			}

			// kiểm tra nếu webhook gửi kèm tin nhắn mới, chúng ta cần chỉnh sửa lại conversation
			// để đảm bảo conversation này được cập nhật giá trị mới nhất.
			// vì một lỗi phía server chưa xủ lý được (không trả về conversation đã cập nhật)

			let updatedConversation;

			if ( data.newMessage ) {
				updatedConversation = update( data.conversation, {
					$merge: {
						updated_time: data.newMessage.created_time,
						snippet: data.newMessage.message,
					},
				} );
			}

			if ( ! ( data.id in state ) ) {
				// console.log( 'Thêm mới hội thoại vào state vì chưa có' );
				return {
					...state,
					[ data.id ]: updatedConversation,
				};
			}

			// console.log( 'Cập nhật hội thoại trong state' );
			return update( state, {
				$merge: {
					[ data.id ]: updatedConversation,
				},
			} );
		},
		[ ConversationTypes.CONVERSATION_READ ]: ( state, { data } ) => {
			if ( ! data || ! data.id || ! data.read_watermark || ! ( data.id in state ) ) return state;

			return update( state, {
				[ data.id ]: { $merge: { read_watermark: data.read_watermark } },
			} );
		},
	}
);

// export function keys( state = [], action ) {
// 	switch ( action.type ) {
// 		case CONVERSATIONS_RECEIVE:
// 			if ( ! action.conversations || ! action.conversations.length ) return state;
// 			return state.concat( action.conversations.map( conversation => conversation.data.id ) );
// 		case RECEIVED_CONVERSATION_UPDATED:
// 			if (
// 				! action.data ||
// 				! action.data.id ||
// 				! action.data.conversation ||
// 				action.data.conversation.length === 0
// 			) {
// 				return state;
// 			}
//
// 			if ( includes( state, action.data.id ) ) {
// 				return state;
// 			}
//
// 			return state.concat( action.data.id );
// 		case ON_SWITCH_PAGE:
// 			return [];
// 		default:
// 	}
//
// 	return state;
// }

// export const keys = createReducer(
// 	[],
// 	{
// 		[ CONVERSATIONS_RECEIVE ]: ( state, { conversations } ) => {
// 			return reduce(
// 				conversations,
// 				( memo, conversation ) => {
// 					memo = conversation.id;
// 					return memo;
// 				},
// 				state
// 			)

// 		},
// 	}
// )

export const isRequesting = createReducer( false, {
	[ CONVERSATIONS_REQUEST ]: () => true,
	[ CONVERSATIONS_RECEIVE ]: () => false,
	[ CONVERSATIONS_REQUEST_FAILURE ]: () => false,
} );

export const pendingMessages = createReducer(
	{},
	{
		[ RECEIVED_PENDING_MESSAGE ]: ( state = [], action ) => {
			const payload = action.data;
			if ( payload && payload.conversation_id ) {
				if ( ! state[ payload.conversation_id ] ) {
					return {
						...state,
						[ payload.conversation_id ]: [ payload ],
					};
				}

				return {
					...state,
					[ payload.conversation_id ]: [ ...state[ payload.conversation_id ].concat( payload ) ],
				};
			}

			return state;
		},
		[ REPLY_FACEBOOK_COMMENT_SUCCESS ]: ( state, action ) => {
			// Chuyển trạng thái của pending message tương ứng để client biết tin nhắn này đã được gửi thành công
			// tuy nhiên vẫn chưa xóa pending message này,
			// việc xóa pending message sẽ được thực hiện khi nhận được webhook
			const { id, pending_message_id, conversation_id } = action.data;

			if ( ! id || ! pending_message_id || ! conversation_id ) {
				return state;
			}

			// const pendingsArr = get( state, conversation_id );
			// if ( pendingsArr.length === 0 ) return state;
			//
			// const needUpdateItem = find( pendingsArr, { pending_message_id: pending_message_id } );

			return update( state, {
				[ conversation_id ]: {
					$apply: arr =>
						arr.filter( item => {
							if ( item.pending_message_id !== pending_message_id ) {
								return item;
							}

							return Object.assign( item, {
								sent: true,
								error: null,
								error_detail: null,
							} );
						} ),
				},
			} );
		},
		[ REPLY_FACEBOOK_COMMENT_FAILED ]: (
			state,
			{ error, pending_message_id, conversation_id }
		) => {
			if ( ! pending_message_id || ! conversation_id ) {
				return state;
			}

			return update( state, {
				[ conversation_id ]: {
					$apply: arr =>
						arr.filter( item => {
							if ( item.pending_message_id !== pending_message_id ) {
								return item;
							}

							return Object.assign( item, {
								error: true,
								error_detail: error,
							} );
						} ),
				},
			} );
		},
		[ DELETE_PENDING_MESSAGE ]: ( state, { message } ) => {
			const { pending_message_id, conversation_id } = message;
			if ( ! pending_message_id || ! conversation_id ) {
				return state;
			}

			return update( state, {
				[ conversation_id ]: {
					$apply: arr => arr.filter( item => item.pending_message_id !== pending_message_id ),
				},
			} );
		},
	}
);

export default combineReducers( {
	data: _data,
	isRequesting,
	pendingMessages,
	search,
} );
