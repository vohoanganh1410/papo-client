/** @format */

/**
 * External dependencies
 */

import { omit } from 'lodash';
/**
 * Internal dependencies
 */
import {
	MEDIA_DELETE,
	MEDIA_ITEM_REQUEST_FAILURE,
	MEDIA_ITEM_REQUEST_SUCCESS,
	MEDIA_ITEM_REQUESTING,
	MEDIA_RECEIVE,
	MEDIA_REQUEST_FAILURE,
	MEDIA_REQUEST_SUCCESS,
	MEDIA_REQUESTING,
} from 'state/action-types';
import { combineReducers, createReducer } from 'state/utils';
import MediaQueryManager from 'lib/query-manager/media';

export const queries = ( () => {
	function applyToManager( state, pageId, method, createDefault, ...args ) {
		if ( ! state[ pageId ] ) {
			if ( ! createDefault ) {
				return state;
			}

			return {
				...state,
				[ pageId ]: new MediaQueryManager()[ method ]( ...args ),
			};
		}

		const nextManager = state[ pageId ][ method ]( ...args );

		if ( nextManager === state[ pageId ] ) {
			return state;
		}

		return {
			...state,
			[ pageId ]: nextManager,
		};
	}

	return createReducer(
		{},
		{
			[ MEDIA_RECEIVE ]: ( state, { pageId, media, found, query } ) => {
				return applyToManager( state, pageId, 'receive', true, media, { found, query } );
			},
			[ MEDIA_DELETE ]: ( state, { pageId, mediaIds } ) => {
				return applyToManager( state, pageId, 'removeItems', true, mediaIds );
			},
		}
	);
} )();

export const queryRequests = createReducer(
	{},
	{
		[ MEDIA_REQUESTING ]: ( state, { pageId, query } ) => {
			return {
				...state,
				[ pageId ]: {
					...state[ pageId ],
					[ MediaQueryManager.QueryKey.stringify( query ) ]: true,
				},
			};
		},
		[ MEDIA_REQUEST_SUCCESS ]: ( state, { pageId, query } ) => {
			return {
				...state,
				[ pageId ]: omit( state[ pageId ], MediaQueryManager.QueryKey.stringify( query ) ),
			};
		},
		[ MEDIA_REQUEST_FAILURE ]: ( state, { pageId, query } ) => {
			return {
				...state,
				[ pageId ]: omit( state[ pageId ], MediaQueryManager.QueryKey.stringify( query ) ),
			};
		},
	}
);

/**
 * Returns the updated site post requests state after an action has been
 * dispatched. The state reflects a mapping of site ID, post ID pairing to a
 * boolean reflecting whether a request for the post is in progress.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const mediaItemRequests = createReducer(
	{},
	{
		[ MEDIA_ITEM_REQUESTING ]: ( state, { pageId, mediaId } ) => {
			return {
				...state,
				[ pageId ]: {
					...state[ pageId ],
					[ mediaId ]: true,
				},
			};
		},
		[ MEDIA_ITEM_REQUEST_SUCCESS ]: ( state, { pageId, mediaId } ) => {
			return {
				...state,
				[ pageId ]: omit( state[ pageId ], mediaId ),
			};
		},
		[ MEDIA_ITEM_REQUEST_FAILURE ]: ( state, { pageId, mediaId } ) => {
			return {
				...state,
				[ pageId ]: omit( state[ pageId ], mediaId ),
			};
		},
	}
);

export default combineReducers( {
	queries,
	queryRequests,
	mediaItemRequests,
} );
