/** @format */

/**
 * External dependencies
 */
import { filter, find, has, get, includes, isEqual, omit, some } from 'lodash';
import createSelector from 'lib/create-selector';
import { moment } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import {
	getNormalizedPostsQuery,
	getSerializedPostsQuery,
	getSerializedPostsQueryWithoutPage,
	normalizePostForDisplay
} from './utils';
import { decodeURIIfValid } from 'lib/url';
import { DEFAULT_POST_QUERY, DEFAULT_NEW_POST_VALUES } from './constants';
import { addQueryArgs } from 'lib/route';

/**
 * Returns the PostsQueryManager from the state tree for a given site ID (or
 * for queries related to all sites at once).
 *
 * @param  {Object}  state  Global state tree
 * @param  {?Number} siteId Site ID, or `null` for all-sites queries
 * @return {Object}         Posts query manager
 */
function getQueryManager( state, siteId ) {
	if ( ! siteId ) {
		return state.orders.queryRequests;
	}
	return state.orders.queryRequests[siteId] || null;
}

/**
 * Returns true if currently requesting posts for the posts query, or false
 * otherwise.
 *
 * @param  {Object}  state  Global state tree
 * @param  {?Number} siteId Site ID, or `null` for all-sites queries
 * @param  {Object}  query  Post query object
 * @return {Boolean}        Whether posts are being requested
 */
export function isRequestingPostsForQuery( state, siteId, query ) {
	const serializedQuery = getSerializedPostsQuery( query, siteId );
	return !! state.orders.queryRequests[ serializedQuery ];
}

/**
 * Returns an array of normalized posts for the posts query, including all
 * known queried pages, or null if the posts for the query are not known.
 *
 * @param  {Object}  state  Global state tree
 * @param  {?Number} siteId Site ID, or `null` for all-sites queries
 * @param  {Object}  query  Post query object
 * @return {?Array}         Posts for the post query
 */
export const getPostsForQueryIgnoringPage = createSelector(
	( state, siteId, query ) => {
		const manager = getQueryManager( state, siteId );
		// console.log(manager);
		if ( ! manager ) {
			return null;
		}

		const itemsIgnoringPage = manager.getItemsIgnoringPage( query );
		if ( ! itemsIgnoringPage ) {
			return null;
		}

		return itemsIgnoringPage.map( normalizePostForDisplay );
	},
	state => [ state.orders.queries, state.orders.queryRequests ],
	( state, siteId, query ) => getSerializedPostsQueryWithoutPage( query, siteId )
);