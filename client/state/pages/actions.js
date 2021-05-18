import papo from 'lib/papo';
import Dispatcher from 'dispatcher';
import {
	PAGES_RECEIVED,
	REQUEST_ACTIVED_PAGES,
	RECEIVED_ACTIVED_PAGES,
	REQUEST_ACTIVED_PAGES_FAILURED,
	REQUEST_ACTIVED_PAGES_SUCCESS,

	REQUEST_PAGE_REPLY_SNIPESTS,
	REQUEST_PAGE_REPLY_SNIPESTS_FAILURED,
	REQUEST_PAGE_REPLY_SNIPESTS_SUCCESS,
	RECEIVED_PAGE_REPLY_SNIPESTS,
	CREATE_PAGE_SNIPPET,
	CREATE_PAGE_SNIPPET_SUCCESS,
	CREATE_PAGE_SNIPPET_FAILURED,
	RECEIVED_PAGE_SNIPPET,

	CREATE_AUTO_MESSAGE_TASK,
	CREATE_AUTO_MESSAGE_TASK_SUCCESS,
	CREATE_AUTO_MESSAGE_TASK_FAILURED,
	RECEIVED_AUTO_MESSAGE_TASK,
	REQUEST_AUTO_MESSAGE_TASKS,
	REQUEST_AUTO_MESSAGE_TASKS_SUCCESS,
	REQUEST_AUTO_MESSAGE_TASKS_FAILURED,
	RECEIVED_AUTO_MESSAGE_TASKS,

} from 'state/action-types';
import EventTypes from 'utils/event-types';
import { Client1 } from 'lib/client1';

/**
 * Returns an action object to be used in signalling that page objects have
 * been received.
 *
 * @param  {Array}  pages Posts received
 * @return {Object}       Action object
 */
export function receivedPages( response ) {
	const pages = response ? response.data : null;
	const paging = response ? response.paging : null;
	return {
		type: PAGES_RECEIVED,
		pages,
	};
}

// export function receivedActivedPages( pages ) {
// 	return dispatch => {
// 		dispatch( {
// 			type: REQUEST_ACTIVED_PAGES,
// 		} );
// 	}
// }

export function receivedActivedPage( page ) {
	return receivedActivedPages( [ page ] );
}

/**
 * Returns an action object to be used in signalling that post objects have
 * been received.
 *
 * @param  {Array}  posts Posts received
 * @return {Object}       Action object
 */
export function receivedActivedPages( pages ) {
	return {
		type: RECEIVED_ACTIVED_PAGES,
		pages,
	};
}

/**
 * Request Pages from given page ids
 *
 * @param  {Array}  page_Ids Page ids
 * @return {Object}       Action object
 */
export function requestPages() {
	return dispatch => {
		dispatch( {
			type: REQUEST_ACTIVED_PAGES,
		} );

		papo
			.undocumented()
			.listPages()
			.then( pages => {
				const actived_pages = pages.map( page => {
					return page.status == 'initialized';
				} )
				// dispatch( receivedActivedPages( actived_pages ) );
				dispatch( {
					type: PAGES_RECEIVED,
					pages,
				} );

				dispatch( {
					type: REQUEST_ACTIVED_PAGES_SUCCESS,
				} )
			} )
			.catch( error => {
				dispatch( {
					type: REQUEST_ACTIVED_PAGES_FAILURED,
					error,
				} )
				console.log( error );
			} )
	}
}

export const activePages = ( selectedPages ) => dispatch => {
	papo.
		undocumented()
		.activePages( selectedPages )
		.then( response => {
			// alert( response.pages );
			dispatch( receivedActivedPages( response.pages ) );
		} )
		.catch( error => {
			console.log( error );
		} )
}

export const initPage = ( pageId, pageName, data ) => {
	papo.
		undocumented()
		.initPage( pageId, pageName, data )
		.then( response => {
			console.log( response.pages );
			// dispatch( receivedActivedPages( response.pages ) );
		} )
		.catch( error => {
			console.log( error );
		} )
}

export const getPageInitializeStatus = ( page_id ) => {
	return new Promise( ( resolve, reject ) => {
		return papo.
			undocumented()
			.checkPageInitializeStatus( page_id )
			.then( response => {
				resolve( response );
			} )
			.catch( error => {
				reject( error );
			} )
	} )
}

// export const getPagesSettings = ( page_ids ) => dispatch => {
// 	papo
// 		.undocumented()
// 		.getPagesSettings()
// 		.then( response => {
// 			console.log( response );
// 		} )
// 		.catch( error => {
// 			console.log( error );
// 		} )
// }

export const getPageReplySnipests = ( page_id ) => dispatch => {
	dispatch( {
		type: REQUEST_PAGE_REPLY_SNIPESTS,
		page_id,
	} );

	papo
		.undocumented()
		.getPageReplySnipests( page_id )
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

export const createSnippet = ( _snippet ) => dispatch => {
	dispatch( {
		type: CREATE_PAGE_SNIPPET,
	} );

	papo
		.undocumented()
		.createSnippet( _snippet )
		.then( snippet => {
			dispatch( {
				type: CREATE_PAGE_SNIPPET_SUCCESS,
				snippet,
			} );

			const snippets = [ snippet ];
			const page_id = snippet.page_id;

			dispatch( {
				type: RECEIVED_PAGE_REPLY_SNIPESTS,
				snippets,
				page_id,
			} );
			
			Dispatcher.handleViewAction({
		        type: EventTypes.CLEAR_SNIPPET_CREATE_FORM,
		        value: true,
		    });

		} )
		.catch( error => {
			dispatch( {
				type: CREATE_PAGE_SNIPPET_FAILURED,
				error,
			} );
		})
}

export const createAutoMessageTask = ( _task ) => dispatch => {
	dispatch( {
		type: CREATE_AUTO_MESSAGE_TASK,
	} );

	papo
		.undocumented()
		.createAutoMessageTask( _task )
		.then( task => {
			dispatch( {
				type: CREATE_AUTO_MESSAGE_TASK_SUCCESS,
				task,
			} );

			const tasks = [ task ];
			const page_id = task.page_id;

			dispatch( {
				type: RECEIVED_AUTO_MESSAGE_TASKS,
				tasks,
				page_id,
			} );
			
			Dispatcher.handleViewAction({
		        type: EventTypes.CLEAR_AUTO_MESSAGE_TASK_CREATE_FORM,
		        value: true,
		    });

		} )
		.catch( error => {
			dispatch( {
				type: CREATE_AUTO_MESSAGE_TASK_FAILURED,
				error,
			} );
		})
}

export const fetchPageAutoMessageTasks = ( page_id ) => dispatch => {
	dispatch( {
		type: REQUEST_AUTO_MESSAGE_TASKS,
		page_id,
	} );

	papo
		.undocumented()
		.getPageAutoMessageTasks( page_id )
		.then( tasks => {

			dispatch( {
				type: REQUEST_AUTO_MESSAGE_TASKS_SUCCESS,
				page_id,
			} );

			dispatch( {
				type: RECEIVED_AUTO_MESSAGE_TASKS,
				tasks,
				page_id,
			} );
		} )
		.catch( error => {
			console.log( error );
			dispatch( {
				type: REQUEST_AUTO_MESSAGE_TASKS_FAILURED,
				error,
				page_id,
			} );
		} )
}