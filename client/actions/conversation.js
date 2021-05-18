import { includes, forEach, get } from 'lodash';

import { Client1 } from 'lib/client1';
import Dispatcher from 'dispatcher';
import EventTypes from 'utils/event-types';

import {
	CONVERSATIONS_RECEIVE,
	CONVERSATIONS_REQUEST,
	CONVERSATIONS_REQUEST_SUCCESS,
	CONVERSATIONS_REQUEST_FAILURE,
	CONVERSATION_REQUEST,
	CONVERSATION_RECEIVED,
	CONVERSATION_REQUEST_FAILURED,
	CONVERSATION_REQUEST_SUCCESS,
	CONVERSATION_REQUEST_MORE,
	CONVERSATION_REQUEST_MORE_SUCCESS,
	CONVERSATION_REQUEST_MORE_FAILURED,
	CONVERSATION_RECEIVED_MORE,
	RECEIVED_PENDING_MESSAGE,
	CONVERSATION_RECEIVED_TAG,
	CONVERSATION_REMOVED_TAG,
	RECEIVED_CONVERSATION_SEEN,
	RECEIVED_CONVERSATION_UNSEEN,
	CREATE_CONVERSATION_NOTE,
	CREATE_CONVERSATION_NOTE_SUCCESS,
	CREATE_CONVERSATION_NOTE_FAILURED,
	RECEIVED_CONVERSATION_NOTE,
	REPLY_FACEBOOK_COMMENT_SUCCESS,
	REPLY_FACEBOOK_COMMENT_FAILED,
	RECEIVED_CONVERSATION_UPDATED,
	CHANGE_SELECTED_CONVERSATION,
	RECEIVED_CONVERSATION_MESSAGE,
} from 'state/action-types';
import { setLoadingStatus } from 'state/ui/actions';

import { ConversationTypes, FacebookUserTypes } from 'action-types';

export const requestConversation = ( conversationId, limit, offset ) => ( dispatch, getState ) => {
	dispatch( {
		type: CONVERSATION_REQUEST,
		conversationId,
		limit,
		offset,
	} );

	return Client1.getConversation( conversationId, limit, offset )
		.then( messages => {
			// load facebook users if need
			const ids = [];
			const state = getState();

			messages.map( c => {
				if ( ! ( c.from in state.facebookUsers.data ) && ! includes( ids, c.from ) ) {
					ids.push( c.from );
				}
			} );

			if ( ids.length > 0 ) {
				Client1.getFacebookUserByIds( ids )
					.then( users => {
						dispatch( {
							type: FacebookUserTypes.RECEIVED_FACEBOOK_USERS,
							users,
						} );
					} )
					.catch( error => {
						console.log( 'error', error );
					} );
			}

			// load attachments
			if ( messages && messages.length > 0 ) {
				// try to get page access token from state
				const { pages } = state;
				let currentPage;
				if ( pages && pages.items ) {
					currentPage = get( pages.items, messages[ 0 ].page_id );
				}

				if ( ! currentPage ) return;

				forEach( messages, m => {
					if (
						m.type === 'message' &&
						m.has_attachments &&
						m.attachments_count > 0 &&
						m.message_id.length > 0 &&
						! ( m.id in state.attachments.facebookMessageAttachments )
					) {
						Client1.fetchFacebookAttachmentsByMessageId(
							m.page_id,
							m.message_id,
							currentPage ? currentPage.data.access_token : null
						)
							.then( response => {
								if (
									response &&
									response.attachments &&
									response.attachments.data &&
									response.attachments.data.length > 0
								) {
									dispatch( {
										type: ConversationTypes.RECEIVE_MESSAGE_ATTACHMENTS,
										attachments: response.attachments.data,
										messageId: m.message_id,
										messageAppScopedId: m.id,
									} );
								}
							} )
							.catch( error => {
								console.log( error );
							} );
					} else if (
						m.type === 'comment' &&
						m.has_attachments &&
						m.comment_id.length > 0 &&
						! ( m.comment_id in state.attachments.facebookCommentAttachments )
					) {
						Client1.fetchFacebookAttachmentsByCommentId(
							m.comment_id,
							currentPage ? currentPage.data.access_token : null
						)
							.then( response => {
								if ( response && response.attachment ) {
									dispatch( {
										type: ConversationTypes.RECEIVE_COMMENT_ATTACHMENTS,
										commentId: m.comment_id,
										attachment: response.attachment,
									} );
								}
							} )
							.catch( error => {
								console.log( 'fetch comment attachments error: ', error );
							} );
					}
				} );
			}

			dispatch( {
				type: CONVERSATION_RECEIVED,
				conversation: messages,
				conversationId,
				limit,
			} );

			Dispatcher.handleViewAction( {
				type: EventTypes.CONVERSATION_MESSAGES_LOADED,
				value: messages ? messages.length : [],
			} );

			dispatch( {
				type: CONVERSATION_REQUEST_SUCCESS,
				conversationId,
			} );
		} )
		.catch( error => {
			console.log( 'error', error );
			dispatch( {
				type: CONVERSATION_REQUEST_FAILURED,
				error,
				conversationId,
			} );

			Dispatcher.handleViewAction( {
				type: EventTypes.CONVERSATION_MESSAGES_LOADED,
				value: 0,
			} );
		} );
};

export const requestMoreConversation = ( conversationId, limit, offset ) => (
	dispatch,
	getState
) => {
	dispatch( {
		type: CONVERSATION_REQUEST_MORE,
		conversationId,
		limit,
		offset,
	} );

	return Client1.getConversation( conversationId, limit, offset )
		.then( messages => {
			// load facebook users if need
			const ids = [];
			const state = getState();

			messages.map( c => {
				if ( ! ( c.from in state.facebookUsers.data ) && ! includes( ids, c.from ) ) {
					ids.push( c.from );
				}
			} );

			if ( ids.length > 0 ) {
				Client1.getFacebookUserByIds( ids )
					.then( users => {
						dispatch( {
							type: FacebookUserTypes.RECEIVED_FACEBOOK_USERS,
							users,
						} );
					} )
					.catch( error => {
						console.log( 'error', error );
					} );
			}

			// load attachments
			if ( messages && messages.length > 0 ) {
				// try to get page access token from state
				const { pages } = state;
				let currentPage;
				if ( pages && pages.items ) {
					currentPage = get( pages.items, messages[ 0 ].page_id );
				}

				if ( ! currentPage ) return;

				forEach( messages, m => {
					if (
						m.type === 'message' &&
						m.has_attachments &&
						m.attachments_count > 0 &&
						m.message_id.length > 0 &&
						! ( m.id in state.attachments.facebookMessageAttachments )
					) {
						Client1.fetchFacebookAttachmentsByMessageId(
							m.page_id,
							m.message_id,
							currentPage ? currentPage.data.access_token : null
						)
							.then( response => {
								if (
									response &&
									response.attachments &&
									response.attachments.data &&
									response.attachments.data.length > 0
								) {
									dispatch( {
										type: ConversationTypes.RECEIVE_MESSAGE_ATTACHMENTS,
										attachments: response.attachments.data,
										messageId: m.message_id,
										messageAppScopedId: m.id,
									} );
								}
							} )
							.catch( error => {
								console.log( error );
							} );
					} else if (
						m.type === 'comment' &&
						m.has_attachments &&
						m.comment_id.length > 0 &&
						! ( m.comment_id in state.attachments.facebookCommentAttachments )
					) {
						Client1.fetchFacebookAttachmentsByCommentId(
							m.comment_id,
							currentPage ? currentPage.data.access_token : null
						)
							.then( response => {
								if ( response && response.attachment ) {
									dispatch( {
										type: ConversationTypes.RECEIVE_COMMENT_ATTACHMENTS,
										commentId: m.comment_id,
										attachment: response.attachment,
									} );
								}
							} )
							.catch( error => {
								console.log( 'fetch comment attachments error: ', error );
							} );
					}
				} );
			}

			dispatch( {
				type: CONVERSATION_RECEIVED_MORE,
				conversation: messages,
				conversationId,
				limit,
			} );

			Dispatcher.handleViewAction( {
				type: EventTypes.CONVERSATION_MESSAGES_MORE_LOADED,
				value: messages ? messages.length : 0,
			} );

			dispatch( {
				type: CONVERSATION_REQUEST_MORE_SUCCESS,
				conversationId,
			} );
		} )
		.catch( error => {
			console.log( 'error', error );
			dispatch( {
				type: CONVERSATION_REQUEST_MORE_FAILURED,
				error,
				conversationId,
			} );

			Dispatcher.handleViewAction( {
				type: EventTypes.CONVERSATION_MESSAGES_MORE_LOADED,
				value: 0,
			} );
		} );
};

export const loadConversations = ( pageIds, limit, offset ) => dispatch => {
	dispatch( {
		type: CONVERSATIONS_REQUEST,
	} );

	return Client1.getConversations( pageIds, limit, offset )
		.then( conversations => {
			// load facebook users
			const ids = conversations && conversations.length > 0 && conversations.map( c => c.from );
			if ( ids && ids.length > 0 ) {
				Client1.getFacebookUserByIds( ids )
					.then( users => {
						dispatch( {
							type: FacebookUserTypes.RECEIVED_FACEBOOK_USERS,
							users,
						} );
					} )
					.catch( error => {
						console.log( 'error', error );
					} );
			}

			dispatch( {
				type: CONVERSATIONS_REQUEST_SUCCESS,
			} );

			dispatch( {
				type: CONVERSATIONS_RECEIVE,
				conversations,
			} );

			Dispatcher.handleViewAction( {
				type: EventTypes.CONVERSATIONS_LOADED,
				value: conversations.length,
			} );

			dispatch( setLoadingStatus( false ) );
		} )
		.catch( error => {
			dispatch( {
				type: CONVERSATIONS_REQUEST_FAILURE,
				error,
			} );
		} );
};

export const sendMessage = message => dispatch => {
	console.log('message: ', message);
	if (
		! message ||
		! message.from ||
		! message.conversation_id ||
		! message.page_token ||
		message.page_token.length === 0 ||
		! message.user_token ||
		message.user_token.length === 0 ||
		message.conversation_id.length === 0 ||
		! message.type ||
		message.type.length === 0
	)
		return;

	const timestamp = Date.now();
	const currentUserId = message.from;
	const pendingMessageId = `${ currentUserId }:${ timestamp }`;

	const newMessage = {
		...message,
		pending_message_id: pendingMessageId,
		create_at: timestamp,
		update_at: timestamp,
	};

	dispatch( {
		type: RECEIVED_PENDING_MESSAGE,
		data: {
			id: pendingMessageId,
			...newMessage,
		},
	} );

	Dispatcher.handleViewAction( {
		type: EventTypes.PENDING_MESSAGE_SUBMITED,
		value: true,
	} );

	return Client1.replyConversation( message.conversation_id, newMessage )
		.then( response => {
			if ( message.type === 'comment' ) {
				// console.log( 'response', response );
				dispatch( {
					type: REPLY_FACEBOOK_COMMENT_SUCCESS,
					data: response,
				} );
			} else if ( message.type === 'message' ) {
				console.log( 'received message' );
			}
		} )
		.catch( error => {
			console.log( 'error sending message: ', error );
			dispatch( {
				type: REPLY_FACEBOOK_COMMENT_FAILED,
				error,
				pending_message_id: pendingMessageId,
				conversation_id: message.conversation_id,
			} );
		} );
};

export const addOrRemoveConversationTag = ( pageId, conversationId, _tag ) => () => {
	return Client1.addOrRemoveConversationTag( pageId, conversationId, _tag );
};

export const searchConversations = ( term, pageIds, limit, offset ) => dispatch => {
	if ( ! term || term.length === 0 ) return;
	dispatch( {
		type: ConversationTypes.SEARCH_CONVERSATION_REQUEST,
		term,
		pageIds,
		limit,
		offset,
	} );

	return Client1.searchConversations( term, pageIds, limit, offset )
		.then( response => {
			dispatch( {
				type: ConversationTypes.SEARCH_CONVERSATION_SUCCESS,
				term,
				pageIds,
				limit,
				offset,
				data: response,
			} );
		} )
		.catch( error => {
			console.log( error );
		} );
};

export const onChangeSearchSelected = conversation => dispatch => {
	dispatch( {
		type: ConversationTypes.CHANGE_SELECTED_CONVERSATION_SEARCH,
		conversation,
	} );
};

export const onChangeSelectedConversation = (
	pageId,
	currentSelectedId,
	previousSelectedId,
	seen
) => dispatch => {
	dispatch( {
		type: CHANGE_SELECTED_CONVERSATION,
		current_selected: currentSelectedId,
		previous_selected: previousSelectedId,
		seen: seen,
	} );

	if ( ! seen ) {
		setTimeout( () => {
			return Client1.updateConversationSeen( currentSelectedId, pageId );
		}, 250 );
	}
};

export const updateConversationUnSeen = ( conversationId, pageId ) => () => {
	return Client1.updateConversationUnSeen( conversationId, pageId );
};

export const addConversationNote = ( conversationId, _note ) => dispatch => {
	dispatch( {
		type: CREATE_CONVERSATION_NOTE,
		data: conversationId,
	} );
	return Client1.addConversationNote( conversationId, _note )
		.then( response => {
			const note = response;
			dispatch( {
				type: CREATE_CONVERSATION_NOTE_SUCCESS,
			} );

			dispatch( {
				type: RECEIVED_CONVERSATION_NOTE,
				data: note,
			} );

			Dispatcher.handleViewAction( {
				type: EventTypes.CONVERSATION_NOTE_CREATED,
				value: note,
			} );
		} )
		.catch( err => {
			dispatch( {
				type: CREATE_CONVERSATION_NOTE_FAILURED,
				error: err,
			} );
		} );
};

export const handleConversationUpdate = ( msg, selectedId ) => {
	return {
		type: RECEIVED_CONVERSATION_UPDATED,
		data: msg.data,
		selectedId,
	};
};

export const handleConversationMessageReceived = msg => {
	console.log( msg );
	return {
		type: RECEIVED_CONVERSATION_MESSAGE,
		data: msg.data,
	};
};

export const handleSeen = msg => {
	return {
		type: RECEIVED_CONVERSATION_SEEN,
		data: msg.data,
	};
};

export const handleUnseen = msg => {
	return {
		type: RECEIVED_CONVERSATION_UNSEEN,
		data: msg.data,
	};
};

export const handleReceivedTag = msg => {
	return {
		type: CONVERSATION_RECEIVED_TAG,
		data: msg.data,
	};
};

export const handleRemovedTag = msg => {
	return {
		type: CONVERSATION_REMOVED_TAG,
		data: msg.data,
	};
};

export const handleMessageSent = msg => {
	console.log( msg );
	return {
		type: ConversationTypes.MESSAGE_SENT,
		data: msg.data,
	};
};

export const handleConversationRead = msg => {
	console.log( msg );
	return {
		type: ConversationTypes.CONVERSATION_READ,
		data: msg.data,
	};
};
