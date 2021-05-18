import { get } from 'lodash';

import { Client1 } from 'lib/client1';
import WebSocketClient from 'lib/client1/websocket';
import { SocketEvents } from 'utils/constants';
import { ConversationTypes } from 'action-types';

import {
	handleSeen,
	handleUnseen,
	handleReceivedTag,
	handleRemovedTag,
	handleConversationUpdate,
	handleConversationMessageReceived,
	handleMessageSent,
	handleConversationRead,
} from './conversation';

import {
	handleReceivedPageTag,
	handlePageStatusUpdated,
	handlePagesStatusUpdated,
	handleInitValidationResult,
	handleReceiveInitValue,
} from './page';
import config from 'config';

const MAX_WEBSOCKET_FAILS = 7;

let dispatch, getState;

export function initialize( reduxStore, page_id ) {
	if ( ! window.WebSocket ) {
		console.log( 'Browser does not support websocket' ); //eslint-disable-line no-console
		return;
	}

	if ( reduxStore ) {
		dispatch = reduxStore.dispatch;
		getState = reduxStore.getState;
	}

	let pageIdQuery = '';

	if ( page_id && page_id.length > 0 ) {
		pageIdQuery = page_id.split( ',' ).join( '&page_id=' );
	}

	const connUrl =
		config( 'env' ) !== 'production'
			? `wss://localhost:8065/api/v1/websocket?page_id=${ pageIdQuery }`
			: `wss://www.papovn.com/public-api/api/v1/websocket?page_id=${ pageIdQuery }`;

	WebSocketClient.setEventCallback( handleEvent );
	WebSocketClient.setFirstConnectCallback( handleFirstConnect );
	WebSocketClient.setReconnectCallback( () => reconnect( false ) );
	// WebSocketClient.setMissedEventCallback( () => reconnect( false ) );
	WebSocketClient.setCloseCallback( handleClose );
	WebSocketClient.initialize( connUrl );
}

export function close() {
	WebSocketClient.close();
}

function reconnectWebSocket() {
	close();
	initialize();
}

export function reconnect( includeWebSocket = true ) {
	if ( includeWebSocket ) {
		reconnectWebSocket();
	}

	// loadPluginsIfNecessary();

	// Object.values(pluginReconnectHandlers).forEach((handler) => {
	//     if (handler && typeof handler === 'function') {
	//         handler();
	//     }
	// });

	// const currentTeamId = getState().entities.teams.currentTeamId;
	// if (currentTeamId) {
	//     loadChannelsForCurrentUser();
	//     dispatch(getPosts(getCurrentChannelId(getState())));
	//     StatusActions.loadStatusesForChannelAndSidebar();
	//     dispatch(TeamActions.getMyTeamUnreads());
	// }

	// dispatch(resetWsErrorCount());
	// dispatch(clearErrors());
}

function handleFirstConnect() {
	// console.log( "wow! you connect websocket for first time!" );
	// dispatch(clearErrors);
}

function handleClose( failCount ) {
	if ( failCount > MAX_WEBSOCKET_FAILS ) {
		console.log( 'failure to connect websocket' ); //eslint-disable-line no-console
	}
	// if (failCount > MAX_WEBSOCKET_FAILS) {
	//     dispatch(logError({type: 'critical', message: AnnouncementBarMessages.WEBSOCKET_PORT_ERROR}, true));
	// }
	// dispatch(incrementWsErrorCount());
}

function handleEvent( msg ) {
	// console.log('msg', msg);
	switch ( msg.event ) {
		case SocketEvents.RECEIVE_CONVERSATION_UPDATED:
			handleReceiveConversationUpdate( msg );
			break;
		case SocketEvents.RECEIVE_COMMENT_UPDATED:
			handleReceiveCommentUpdate( msg );
			break;
		case SocketEvents.CONVERSATION_UNSEEN:
			handleConversationUnseen( msg );
			break;
		case SocketEvents.CONVERSATION_SEEN:
			handleConversationSeen( msg );
			break;
		case SocketEvents.CONVERSATION_RECEIVED_TAG:
			handleTagReceived( msg );
			break;
		case SocketEvents.CONVERSATION_REMOVED_TAG:
			handleTagRemoved( msg );
			break;
		case SocketEvents.PAGE_RECEIVED_TAG:
			handlePageTagReceived( msg );
			break;
		case SocketEvents.RECEIVE_PAGE_STATUS_UPDATED:
			handlePageStatusUpdate( msg );
			break;
		case SocketEvents.RECEIVE_PAGES_STATUS_UPDATED:
			handlePagesStatusUpdate( msg );
			break;
		case SocketEvents.RECEIVE_PAGES_INIT_VALIDATION_RESULT:
			handleInitValidation( msg );
			break;
		case SocketEvents.RECEIVE_PAGES_INIT_VALUE:
			handleInitValue( msg );
			break;
		case SocketEvents.CONVERSATION_ADD_MESSAGE:
			handleReceiveMessage( msg );
			break;
		case SocketEvents.MESSAGE_SENT:
			handleReceiveMessageSent( msg );
			break;
		case SocketEvents.CONVERSATION_READ:
			handleReceiveConversationRead( msg );
			break;
		case SocketEvents.ADDED_ORDER:
			handleReceiveOrder( msg );
			break;
		default:
	}
}

function handleReceiveOrder( msg ) {
	console.log( 'new order added: ', msg );
}

function handleReceiveMessage( msg ) {
	// const state = getState();
	// if ( ! state.ui.conversationList || ! state.ui.conversationList.selectedConversation ) return;
	// if ( msg.data.id !== state.ui.conversationList.selectedConversation ) return;
	dispatch( handleConversationMessageReceived( msg ) );
}

function handleReceiveConversationRead( msg ) {
	dispatch( handleConversationRead( msg ) );
}

function handleReceiveMessageSent( msg ) {
	setTimeout( () => {
		dispatch( handleMessageSent( msg ) );
	}, 250 );
}

function handleInitValue( msg ) {
	dispatch( handleReceiveInitValue( msg ) );
}

function handleInitValidation( msg ) {
	dispatch( handleInitValidationResult( msg ) );
}

function handleReceiveConversationUpdate( msg ) {
	const state = getState();
	let selectedConversationId;
	if ( ! state.ui.conversationList || ! state.ui.conversationList.selectedConversation ) {
		selectedConversationId = state.ui.conversationList.selectedConversation;
	}

	const { data } = msg;
	if ( ! data ) return;

	// request attachments if need
	if ( data.newMessage.has_attachments ) {
		const m = data.newMessage;

		const { pages } = state;
		let currentPage;
		if ( pages && pages.items ) {
			currentPage = get( pages.items, m.page_id );
		}

		Client1.fetchFacebookAttachmentsByMessageId(
			m.page_id,
			m.message_id,
			currentPage ? currentPage.data.access_token : null
		)
			.then( response => {
				console.log( response );
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
	}

	dispatch( handleConversationUpdate( msg, selectedConversationId ) );
}

function handleReceiveCommentUpdate( msg ) {
	console.log( msg );
}

function handleConversationSeen( msg ) {
	dispatch( handleSeen( msg ) );
}

function handleConversationUnseen( msg ) {
	dispatch( handleUnseen( msg ) );
}

function handleTagReceived( msg ) {
	dispatch( handleReceivedTag( msg ) );
}

function handleTagRemoved( msg ) {
	dispatch( handleRemovedTag( msg ) );
}

function handlePageTagReceived( msg ) {
	dispatch( handleReceivedPageTag( msg ) );
}

function handlePageStatusUpdate( msg ) {
	dispatch( handlePageStatusUpdated( msg ) );
}

function handlePagesStatusUpdate( msg ) {
	dispatch( handlePagesStatusUpdated( msg ) );
}
