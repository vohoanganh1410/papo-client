import {Client1} from 'lib/client1';
import {
	REQUEST_UPDATE_PAGE_SNIPPET,
	UPDATE_PAGE_SNIPPET_SUCCESS,
	UPDATE_PAGE_SNIPPET_FAILURED,
	RECEIVED_PAGE_SNIPPET_UPDATE,

	REQUEST_PAGE_REPLY_SNIPESTS,
	RECEIVED_PAGE_REPLY_SNIPESTS,
	REQUEST_PAGE_REPLY_SNIPESTS_FAILURED,
	REQUEST_PAGE_REPLY_SNIPESTS_SUCCESS,

} from 'state/action-types';

export const updatePageSnippet = ( _snippet ) => dispatch => {
	dispatch( {
		type: REQUEST_UPDATE_PAGE_SNIPPET,
	} );

	return Client1.updatePageSnippet( _snippet )
		.then( snippet => {
			dispatch( {
				type: UPDATE_PAGE_SNIPPET_SUCCESS,
				snippet,
			} );

			dispatch( {
				type: RECEIVED_PAGE_SNIPPET_UPDATE,
				snippet,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: UPDATE_PAGE_SNIPPET_FAILURED,
				error,
			} );
		} )
}

export const getPageReplySnipests = ( page_id ) => dispatch => {
	dispatch( {
		type: REQUEST_PAGE_REPLY_SNIPESTS,
		page_id,
	} );

	return Client1.getPageSnippets( page_id )
		.then( snippets => {

			dispatch( {
				type: REQUEST_PAGE_REPLY_SNIPESTS_SUCCESS,
				page_id,
			} );

			dispatch( {
				type: RECEIVED_PAGE_REPLY_SNIPESTS,
				snippets,
				page_id,
			} );
		} )
		.catch( error => {
			console.log( error );
			dispatch( {
				type: REQUEST_PAGE_REPLY_SNIPESTS_FAILURED,
				error,
				page_id,
			} );
		} )
}