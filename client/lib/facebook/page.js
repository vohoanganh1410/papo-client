/** @format */

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import * as FacebookToken from 'lib/facebook/token';

import {
	FACEBOOK_INIT_PAGE_REQUEST,
	FACEBOOK_INIT_PAGE_SUCCESS,
	FACEBOOK_INIT_PAGE_FAILURE,
} from 'state/action-types';
import {
	getPageAccessToken,
} from './utils';
import papo from 'lib/papo';
import {
	initPage,
} from 'state/pages/actions';

/**
 * Module variables
 */
const FACEBOOK_USER_TOKEN = FacebookToken.getToken();

/**
 * Initialize page for the first time load
 * @params {string} pageId Facebook ID of page to initialize
 * @return action object
 */
export const initializePage = ( pageId, page_access_token ) => ( dispatch ) => {
	dispatch( {
		type: FACEBOOK_INIT_PAGE_REQUEST,
		page_id: pageId,
	} );
	
	initPage( pageId, page_access_token );
}
