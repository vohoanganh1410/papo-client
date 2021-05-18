/** @format */

/**
 * External dependencies
 */

import { castArray } from 'lodash';

/**
 * Internal dependencies
 */
import {
	MEDIA_DELETE,
	MEDIA_ITEM_REQUEST,
	MEDIA_ITEM_REQUEST_FAILURE,
	MEDIA_ITEM_REQUEST_SUCCESS,
	MEDIA_ITEM_REQUESTING,
	MEDIA_RECEIVE,
	MEDIA_REQUEST,
	MEDIA_REQUEST_FAILURE,
	MEDIA_REQUEST_SUCCESS,
	MEDIA_REQUESTING,
} from 'state/action-types';

/**
 * Returns an action object used in signalling that media item(s) for the site
 * have been received.
 *
 * @param  {Number}         pageId Site ID
 * @param  {(Array|Object)} media  Media item(s) received
 * @param  {Number}         found  Number of found media
 * @param  {Object}         query  Query Object
 * @return {Object}                Action object
 */
export function receiveMedia( pageId, media, found, query ) {
	return {
		type: MEDIA_RECEIVE,
		pageId,
		media: castArray( media ),
		found,
		query,
	};
}

/**
 * Returns an action object used in signalling that media item(s) for the site
 * have been requested.
 *
 * @param  {Number} pageId Site ID
 * @param  {Object} query  Query object
 * @return {Object}        Action object
 */
export function requestMedia( pageId, query ) {
	return {
		type: MEDIA_REQUEST,
		pageId,
		query,
	};
}

/**
 * Returns an action object used in signalling that media item(s) for the site
 * are being requested.
 *
 * @param  {Number} pageId Site ID
 * @param  {Object} query  Query object
 * @return {Object}        Action object
 */
export function requestingMedia( pageId, query ) {
	return {
		type: MEDIA_REQUESTING,
		pageId,
		query,
	};
}

/**
 * Returns an action object used in signalling that a request for media item(s)
 * has failed.
 *
 * @param  {Number} pageId Site ID
 * @param  {Object} query  Query object
 * @return {Object}        Action object
 */
export function failMediaRequest( pageId, query ) {
	return {
		type: MEDIA_REQUEST_FAILURE,
		pageId,
		query,
	};
}

/**
 * Returns an action object used in signalling that a request for media item(s)
 * has failed.
 *
 * @param  {Number} pageId Site ID
 * @param  {Object} query  Query object
 * @return {Object}        Action object
 */
export function successMediaRequest( pageId, query ) {
	return {
		type: MEDIA_REQUEST_SUCCESS,
		pageId,
		query,
	};
}

/**
 * Returns an action object used in signalling that a media item for the site
 * have been requested.
 *
 * @param  {Number} pageId  Site ID
 * @param  {Number} mediaId Media ID
 * @return {Object}         Action object
 */
export function requestMediaItem( pageId, mediaId ) {
	return {
		type: MEDIA_ITEM_REQUEST,
		pageId,
		mediaId,
	};
}

/**
 * Returns an action object used in signalling that a media item for the site
 * are being requested.
 *
 * @param  {Number} pageId  Site ID
 * @param  {Number} mediaId Media ID
 * @return {Object}         Action object
 */
export function requestingMediaItem( pageId, mediaId ) {
	return {
		type: MEDIA_ITEM_REQUESTING,
		pageId,
		mediaId,
	};
}

/**
 * Returns an action object used in signalling that a request for media item(s)
 * has failed.
 *
 * @param  {Number} pageId  Site ID
 * @param  {Number} mediaId Media ID
 * @return {Object}         Action object
 */
export function failMediaItemRequest( pageId, mediaId ) {
	return {
		type: MEDIA_ITEM_REQUEST_FAILURE,
		pageId,
		mediaId,
	};
}

/**
 * Returns an action object used in signalling that a request for media item(s)
 * has failed.
 *
 * @param  {Number} pageId  Site ID
 * @param  {Number} mediaId Media ID
 * @return {Object}         Action object
 */
export function successMediaItemRequest( pageId, mediaId ) {
	return {
		type: MEDIA_ITEM_REQUEST_SUCCESS,
		pageId,
		mediaId,
	};
}

/**
 * Returns an action object used in signalling that media item(s) for the site
 * are to be deleted.
 *
 * TODO: When network layer behavior is attached to this action type, remember
 * to ignore media IDs for "transient" items (upload in progress) by validating
 * numeric ID.
 *
 * @param  {Number}         pageId   Site ID
 * @param  {(Array|Number)} mediaIds ID(s) of media to be deleted
 * @return {Object}                  Action object
 */
export function deleteMedia( pageId, mediaIds ) {
	return {
		type: MEDIA_DELETE,
		mediaIds: castArray( mediaIds ),
		pageId,
	};
}
