import { Client1 } from 'lib/client1';
import Dispatcher from 'dispatcher';
import EventTypes from 'utils/event-types';

import {
	REQUEST_ACTIVED_PAGES,
	PAGES_RECEIVED,
	REQUEST_ACTIVED_PAGES_SUCCESS,
	REQUEST_ACTIVED_PAGES_FAILURED,
	RECEIVED_PAGE_TAGS,
	REQUEST_PAGE_TAGS,
	REQUEST_PAGE_TAGS_SUCCESS,
	REQUEST_PAGE_TAGS_FAILURED,
	ADD_NEW_PAGE_TAG,
	ADD_NEW_PAGE_TAG_SUCCESS,
	RECEIVED_NEW_PAGE_TAG,
	ADD_NEW_PAGE_TAG_FAILURED,
	ON_SWITCH_PAGE,
	RECEIVED_PAGE_STATUS_UPDATED,
	RECEIVED_PAGES_STATUS_UPDATED,
	RECEIVED_PAGE_INIT_VALIDATION,
	RECEIVED_PAGE_INIT_VALUE,
} from 'state/action-types';

import { PageTypes } from 'action-types';
import { Preferences } from 'lib/client1/constants';
import { savePreferences } from 'actions/preference';

export const initializePages = ( pageIds = {} ) => dispatch => {
	return Client1.initializePages( pageIds )
		.then( result => {
			console.log( result ); // eslint-disable-line no-console
		} )
		.catch( error => {
			console.log( error ); // eslint-disable-line no-console
		} );
};

export const switchPage = () => dispatch => {
	dispatch( {
		type: ON_SWITCH_PAGE,
	} );
};

export const requestActivedPages = () => dispatch => {
	dispatch( {
		type: REQUEST_ACTIVED_PAGES,
	} );

	return Client1.getActivedPages()
		.then( pages => {
			dispatch( {
				type: REQUEST_ACTIVED_PAGES_SUCCESS,
			} );

			dispatch( {
				type: PAGES_RECEIVED,
				pages,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: REQUEST_ACTIVED_PAGES_FAILURED,
				error,
			} );
		} );
};

export const viewPage = pageId => async ( dispatch, getState ) => {
	const currentUser = getState().currentUser;
	const preferences = getState().preferences;

	const viewTimePref =
		preferences[ `${ Preferences.CATEGORY_PAGE_APPROXIMATE_VIEW_TIME }--${ pageId }` ];
	const viewTime = viewTimePref ? parseInt( viewTimePref.value, 10 ) : 0;
	if ( viewTime < new Date().getTime() - 3 * 60 * 60 * 1000 ) {
		const _preferences = [
			{
				user_id: currentUser.id,
				category: Preferences.CATEGORY_PAGE_APPROXIMATE_VIEW_TIME,
				name: pageId,
				value: new Date().getTime().toString(),
			},
		];
		savePreferences( currentUser.id, _preferences )( dispatch );
	}

	try {
		await Client1.viewMyPage( pageId );
	} catch ( error ) {
		// forceLogoutIfNecessary(error, dispatch, getState);
		// dispatch(logError(error));

		return { error };
	}

	return { data: true };
};

export const addNewPageTag = _tag => dispatch => {
	dispatch( {
		type: ADD_NEW_PAGE_TAG,
	} );

	return Client1.addNewPageTag( _tag )
		.then( tag => {
			dispatch( {
				type: ADD_NEW_PAGE_TAG_SUCCESS,
				tag,
			} );

			// dispatch( {
			// 	type: RECEIVED_NEW_PAGE_TAG,
			// 	tag,
			// } );

			Dispatcher.handleViewAction( {
				type: EventTypes.CREATE_PAGE_TAG_SUCCESS,
				value: true,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: ADD_NEW_PAGE_TAG_FAILURED,
				error,
			} );
		} );
};

export const handleReceivedPageTag = msg => {
	return {
		type: RECEIVED_NEW_PAGE_TAG,
		data: msg.data,
	};
};

export const handlePagesStatusUpdated = msg => {
	// console.log( msg );
	return {
		type: RECEIVED_PAGES_STATUS_UPDATED,
		data: msg.data,
	};
};

export const handleReceiveInitValue = msg => {
	return {
		type: RECEIVED_PAGE_INIT_VALUE,
		data: msg.data,
	};
};

export const handlePageStatusUpdated = msg => {
	// console.log("msg", msg);
	return {
		type: RECEIVED_PAGE_STATUS_UPDATED,
		data: msg.data,
	};
};

export const loadPageTags = pageId => dispatch => {
	dispatch( {
		type: REQUEST_PAGE_TAGS,
	} );

	return Client1.loadPageTags( pageId )
		.then( tags => {
			dispatch( {
				type: REQUEST_PAGE_TAGS_SUCCESS,
				pageId,
			} );

			dispatch( {
				type: RECEIVED_PAGE_TAGS,
				tags,
				pageId,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: REQUEST_PAGE_TAGS_FAILURED,
				error,
			} );
		} );
};

export const fetchPageAnalyticsData = ( pageId, startTime, endTime ) => dispatch => {
	dispatch( {
		type: PageTypes.REQUEST_PAGE_ANALYTICS,
		page_id: pageId,
	} );

	return Client1.fetchPageAnalytics(pageId, startTime, endTime)
		.then( data => {
			dispatch( {
				type: PageTypes.RECEIVED_PAGE_ANALYTICS_DATA,
				page_id: pageId,
				data,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: PageTypes.RECEIVED_PAGE_ANALYTICS_DATA,
				page_id: pageId,
				error,
			} );
		} )
};

export const loadPageFilesInfo = ( page_id, limit = 30, offset = 0 ) => dispatch => {
	dispatch( {
		type: PageTypes.REQUEST_PAGE_FILES_INFO,
		page_id,
	} );

	return Client1.getPageImages( page_id, limit, offset )
		.then( filesInfo => {
			dispatch( {
				type: PageTypes.RECEIVED_PAGE_FILES_INFO,
				data: filesInfo,
				page_id,
			} );

			dispatch( {
				type: PageTypes.REQUEST_PAGE_FILE_INFOS_SUCCESS,
				page_id,
			} );

			Dispatcher.handleViewAction( {
				type: EventTypes.LOADED_FILE_INFOS_SUCCESS,
				value: filesInfo.length,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: PageTypes.REQUEST_PAGE_FILES_INFO_ERROR,
				error,
				page_id,
			} );
		} );
};

export const loadMorePageFilesInfo = ( page_id, limit = 30, offset = 0 ) => dispatch => {
	dispatch( {
		type: PageTypes.REQUEST_MORE_PAGE_FILES_INFO,
		page_id,
	} );

	return Client1.getMorePageImages( page_id, limit, offset )
		.then( filesInfo => {
			dispatch( {
				type: PageTypes.RECEIVED_MORE_PAGE_FILES_INFO,
				data: filesInfo,
				page_id,
			} );

			dispatch( {
				type: PageTypes.REQUEST_MORE_PAGE_FILE_INFOS_SUCCESS,
				page_id,
			} );

			Dispatcher.handleViewAction( {
				type: EventTypes.LOADED_MORE_FILE_INFOS_SUCCESS,
				value: filesInfo.length,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: PageTypes.REQUEST_MORE_PAGE_FILES_INFO_ERROR,
				error,
				page_id,
			} );
		} );
};

export const handleInitValidationResult = msg => {
	return {
		type: RECEIVED_PAGE_INIT_VALIDATION,
		data: msg.data,
	};
};
