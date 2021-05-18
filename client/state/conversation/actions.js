/** @format */

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import papo from 'lib/papo';
import {
	CONVERSATION_REQUEST,
	CONVERSATION_RECEIVED,
	CONVERSATION_REQUEST_FAILURED,
	CONVERSATION_REQUEST_SUCCESS,
	RECEIVED_NEW_MESSAGE,
	CONVERSATION_DETAIL_RECEIVED,
	RECEIVED_MORE_MESSAGES,
} from 'state/action-types';


export function requestConversationPost( postId, fields = {} ) {
	return dispatch =>{
		dispatch( {
			type: CONVERSATION_POST_REQUEST,
			postId,
			fields,
		} );	
		
		graphConversationByURL( postId )
			.then( res => {
				if ( res && res.error ) {
					const error = res.error;
					return dispatch( {
						type: CONVERSATION_POST_REQUEST_FAILED,
						postId,
						error,
					} )
				}

				dispatch( receiveConversationPost( res ) );
				dispatch( {
					type: CONVERSATION_POST_REQUEST_SUCCESS,
				} )
				console.log( res );
			} )
			.catch( error => {
				console.log( error );
				dispatch( {
					type: CONVERSATION_POST_REQUEST_FAILED,
					postId,
					error,
				} )
			} )

	}
}

/**
 * Fetch conversation
 */
export const fetchConversation = ( id, query = {} ) => dispatch => {
	
	dispatch( {
		type: CONVERSATION_REQUEST,
		id
	} );

	papo.undocumented()
		.fetchConversation( id, query )
		.then( response => {
			const data = response;
			dispatch( {
				type: CONVERSATION_RECEIVED,
				data
			} );
			dispatch( {
				type: CONVERSATION_REQUEST_SUCCESS,
			} );
		} )
		.catch( error => {
			console.log( error );
			dispatch( {
				type: CONVERSATION_REQUEST_FAILURED,
				error
			} );
		} )
}

export const sendMessage = ( message ) => dispatch => {
	const timestamp = Date.now();
	const currentUserId = "sdfsdfsdfssdfsd";
	const pendingMessageId = `${currentUserId}:${timestamp}`;

	let newMessage = {
            ...message,
            pending_message_id: pendingMessageId,
            create_at: timestamp,
            update_at: timestamp,
        };

	dispatch( {
		type: RECEIVED_NEW_MESSAGE,
		data: {
			id: pendingMessageId,
			...newMessage,
		}
	} )
}

export function receiveConversation( conversation ) {
	return {
		type: CONVERSATION_DETAIL_RECEIVED,
		conversation,
	};
}

export function receiveMoreMessages( messages ) {
	return {
		type: RECEIVED_MORE_MESSAGES,
		messages,
	};
}