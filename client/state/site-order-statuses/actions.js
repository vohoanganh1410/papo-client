/** @format */

/**
 * Internal dependencies
 */

import papo from 'lib/papo';
import {
	SITE_ORDER_STATUSES_RECEIVE,
	SITE_ORDER_STATUSES_REQUEST,
	SITE_ORDER_STATUSES_REQUEST_FAILURE,
	SITE_ORDER_STATUSES_REQUEST_SUCCESS,
	SITE_ORDER_STATUSES_SAVE,
	SITE_ORDER_STATUSES_SAVE_FAILURE,
	SITE_ORDER_STATUSES_SAVE_SUCCESS,
	SITE_ORDER_STATUSES_UPDATE,
} from 'state/action-types';
import { normalizeSettings } from './utils';

/**
 * Returns an action object to be used in signalling that site settings have been received.
 *
 * @param  {Number} siteId Site ID
 * @param  {Object} settings The site settings object
 * @return {Object}        Action object
 */
export function receiveSiteOrderStatuses( siteId, statuses ) {
	return {
		type: SITE_ORDER_STATUSES_RECEIVE,
		siteId,
		statuses,
	};
}

/**
 * Returns an action object to be used in signalling that some site settings have been update.
 *
 * @param  {Number} siteId Site ID
 * @param  {Object} settings The updated site settings
 * @return {Object}        Action object
 */
export function updateSiteOrderStatuses( siteId, statuses ) {
	return {
		type: SITE_ORDER_STATUSES_UPDATE,
		siteId,
		statuses,
	};
}

/**
 * Returns an action thunk which, when invoked, triggers a network request to
 * retrieve site settings
 *
 * @param  {Number} siteId Site ID
 * @return {Function}      Action thunk
 */
export function requestSiteOrderStatuses( siteId ) {
	return dispatch => {
		dispatch( {
			type: SITE_ORDER_STATUSES_REQUEST,
			siteId,
		} );

		return papo
			.undocumented()
			.orderStatuses( siteId )
			.then( ( { statuses } ) => {

				dispatch( receiveSiteOrderStatuses( siteId, statuses ) );
				dispatch( {
					type: SITE_ORDER_STATUSES_REQUEST_SUCCESS,
					siteId,
				} );
			} )
			.catch( error => {
				console.log(error);
				dispatch( {
					type: SITE_ORDER_STATUSES_REQUEST_FAILURE,
					siteId,
					error,
				} );
			} );
	};
}

export function saveSiteOrderStatuses( siteId, statuses ) {
	return dispatch => {
		dispatch( {
			type: SITE_ORDER_STATUSES_SAVE,
			siteId,
		} );

		return papo
			.undocumented()
			.orderStatuses( siteId, 'post', statuses )
			.then( ( { updated } ) => {
				dispatch( updateSiteOrderStatuses( siteId, normalizeSettings( updated ) ) );
				dispatch( {
					type: SITE_ORDER_STATUSES_SAVE_SUCCESS,
					siteId,
				} );
			} )
			.catch( error => {
				dispatch( {
					type: SITE_ORDER_STATUSES_SAVE_FAILURE,
					siteId,
					error,
				} );
			} );
	};
}
