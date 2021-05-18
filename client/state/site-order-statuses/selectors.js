/** @format */

/**
 * External dependencies
 */

import { get } from 'lodash';

/**
 * Returns true if we are requesting settings for the specified site ID, false otherwise.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @return {Boolean}        Whether site settings is being requested
 */
export function isRequestingSiteOrderStatuses( state, siteId ) {
	return get( state.siteOrderStatuses.requesting, [ siteId ], false );
}

/**
 * Returns true if we are saving settings for the specified site ID, false otherwise.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @return {Boolean}        Whether site settings is being requested
 */
export function isSavingSiteOrderStatuses( state, siteId ) {
	return get( state.siteOrderStatuses.saveRequests, [ siteId, 'saving' ], false );
}

/**
 * Returns the status of the last site settings save request
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @return {String}         The request status (peding, success or error)
 */
export function getSiteOrderStatusesSaveRequestStatus( state, siteId ) {
	return get( state.siteOrderStatuses.saveRequests, [ siteId, 'status' ] );
}

/**
 * Returns the order statuses for the specified site ID
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @return {Object}        Site settings
 */
export function getSiteOrderStatuses( state, siteId ) {
	return get( state.siteOrderStatuses.items, [ siteId ], null );
}

/**
 * Returns true fi the save site settings requests is successful
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @return {Boolean}         Whether the requests is successful or not
 */
export function isSiteOrderStatusesSaveSuccessful( state, siteId ) {
	return getSiteSettingsSaveRequestStatus( state, siteId ) === 'success';
}

/**
 * Returns the error returned by the last site settings save request
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @return {String}         The request error
 */
export function getSiteOrderStatusesSaveError( state, siteId ) {
	return get( state.siteOrderStatuses.saveRequests, [ siteId, 'error' ], false );
}
