/** @format */

/**
 * External dependencies
 */
import {
	get,
	set,
	omit,
	omitBy,
	isEqual,
	reduce,
	merge,
	findKey,
	mapValues,
	mapKeys,
} from 'lodash';

/**
 * Internal dependencies
 */
import PostQueryManager from 'lib/query-manager/post';
import {
	EDITOR_START,
	EDITOR_STOP,
	ORDER_DELETE,
	ORDER_DELETE_SUCCESS,
	ORDER_DELETE_FAILURE,
	ORDER_EDIT,
	ORDER_REQUEST,
	ORDER_REQUEST_SUCCESS,
	ORDER_REQUEST_FAILURE,
	ORDER_RESTORE,
	ORDER_RESTORE_FAILURE,
	ORDER_RESTORE_SUCCESS,
	ORDER_SAVE,
	ORDER_SAVE_SUCCESS,
	ORDER_SAVE_FAILURE,
	ORDERS_RECEIVE,
	ORDERS_REQUEST,
	ORDERS_REQUEST_SUCCESS,
	ORDERS_REQUEST_FAILURE,
	SERIALIZE,
	DESERIALIZE,
} from 'state/action-types';
import { combineReducers, createReducer } from 'state/utils';
import { itemsSchema, queriesSchema, allSitesQueriesSchema } from './schema';

import {
	getSerializedPostsQuery,
	normalizePostForState
} from './utils';


/**
 * Tracks all known post objects, indexed by post global ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const items = createReducer(
	{},
	{
		[ ORDERS_RECEIVE ]: ( state, action ) => {
			return reduce(
				action.orders,
				( memo, post ) => {
					// console.log(post);
					const { site_ID: siteId, ID: postId, id: globalId } = post;
					if ( memo[ globalId ] ) {
						// We're making an assumption here that the site ID and post ID
						// corresponding with a global ID will never change
						return memo;
					}

					if ( memo === state ) {
						memo = { ...memo };
					}

					memo[ globalId ] = [ siteId, globalId ];
					return memo;
				},
				state
			);
		},
		[ ORDER_DELETE_SUCCESS ]: ( state, action ) => {
			const globalId = findKey( state, ( [ siteId, postId ] ) => {
				return siteId === action.siteId && postId === action.postId;
			} );

			if ( ! globalId ) {
				return state;
			}

			return omit( state, globalId );
		},
	},
	itemsSchema
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
export function siteRequests( state = {}, action ) {
	switch ( action.type ) {
		case ORDER_REQUEST:
		case ORDER_REQUEST_SUCCESS:
		case ORDER_REQUEST_FAILURE:
			return Object.assign( {}, state, {
				[ action.siteId ]: Object.assign( {}, state[ action.siteId ], {
					[ action.postId ]: POST_REQUEST === action.type,
				} ),
			} );
	}

	return state;
}



/**
 * Returns the updated post query requesting state after an action has been
 * dispatched. The state reflects a mapping of serialized query to whether a
 * network request is in-progress for that query.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function queryRequests( state = {}, action ) {
	switch ( action.type ) {
		case ORDERS_REQUEST:
		case ORDERS_REQUEST_SUCCESS:
		case ORDERS_REQUEST_FAILURE:
			const serializedQuery = getSerializedPostsQuery( action.query, action.siteId );
			// console.log(serializedQuery);
			return Object.assign( {}, state, {
				[ serializedQuery ]: ORDERS_REQUEST === action.type,
			} );
	}

	return state;
}

/**
 * Returns the updated post query state after an action has been dispatched.
 * The state reflects a mapping by site ID of serialized query key to an array
 * of post IDs for the query, if a query response was successfully received.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const queries = ( () => {
	function applyToManager( state, siteId, method, createDefault, ...args ) {
		if ( ! siteId ) {
			return state;
		}

		if ( ! state[ siteId ] ) {
			if ( ! createDefault ) {
				return state;
			}

			return {
				...state,
				[ siteId ]: new PostQueryManager()[ method ]( ...args ),
			};
		}

		const nextManager = state[ siteId ][ method ]( ...args );
		if ( nextManager === state[ siteId ] ) {
			return state;
		}

		return {
			...state,
			[ siteId ]: nextManager,
		};
	}

	return createReducer(
		{},
		{
			[ ORDERS_REQUEST_SUCCESS ]: ( state, { siteId, query, posts } ) => {
				// console.log(posts);
				if ( ! siteId ) {
					// Handle site-specific queries only
					return state;
				}
				const normalizedPosts = posts.map( normalizePostForState );
				return applyToManager( state, siteId, 'receive', true, normalizedPosts, { query } );
				
			},
			[ ORDERS_RECEIVE ]: ( state, { posts } ) => {
				const postsBySiteId = reduce(
					posts,
					( memo, post ) => {
						return Object.assign( memo, {
							[ post.site_ID ]: [
								...( memo[ post.site_ID ] || [] ),
								normalizePostForState( post ),
							],
						} );
					},
					{}
				);

				return reduce(
					postsBySiteId,
					( memo, sitePosts, siteId ) => {
						return applyToManager( memo, siteId, 'receive', true, sitePosts );
					},
					state
				);
			},
			[ ORDER_RESTORE ]: ( state, { siteId, postId } ) => {
				return applyToManager(
					state,
					siteId,
					'receive',
					false,
					{
						ID: postId,
						status: '__RESTORE_PENDING',
					},
					{ patch: true }
				);
			},
			[ ORDER_RESTORE_FAILURE ]: ( state, { siteId, postId } ) => {
				return applyToManager(
					state,
					siteId,
					'receive',
					false,
					{
						ID: postId,
						status: 'trash',
					},
					{ patch: true }
				);
			},
			[ ORDER_SAVE ]: ( state, { siteId, postId, post } ) => {
				return applyToManager(
					state,
					siteId,
					'receive',
					false,
					{
						ID: postId,
						...post,
					},
					{ patch: true }
				);
			},
			[ ORDER_DELETE ]: ( state, { siteId, postId } ) => {
				return applyToManager(
					state,
					siteId,
					'receive',
					false,
					{
						ID: postId,
						status: '__DELETE_PENDING',
					},
					{ patch: true }
				);
			},
			[ ORDER_DELETE_FAILURE ]: ( state, { siteId, postId } ) => {
				return applyToManager(
					state,
					siteId,
					'receive',
					false,
					{
						ID: postId,
						status: 'trash',
					},
					{ patch: true }
				);
			},
			[ ORDER_DELETE_SUCCESS ]: ( state, { siteId, postId } ) => {
				return applyToManager( state, siteId, 'removeItem', false, postId );
			},
			[ SERIALIZE ]: state => {
				return mapValues( state, ( { data, options } ) => ( { data, options } ) );
			},
			[ DESERIALIZE ]: state => {
				return mapValues( state, ( { data, options } ) => new PostQueryManager( data, options ) );
			},
		},
		queriesSchema
	);
} )();

/**
 * Returns the updated post query state for queries of all sites at once after
 * an action has been dispatched.  The state reflects a mapping of serialized
 * query key to an array of post global IDs for the query, if a query response
 * was successfully received.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const allSitesQueries = ( () => {
	function findItemKey( state, siteId, postId ) {
		return (
			findKey( state.data.items, post => {
				return post.site_ID === siteId && post.ID === postId;
			} ) || null
		);
	}

	return createReducer(
		new PostQueryManager( {}, { itemKey: 'id' } ),
		{
			[ ORDERS_REQUEST_SUCCESS ]: ( state, { siteId, query, posts } ) => {
				
				if ( siteId ) {
					// Handle all-sites queries only.
					return state;
				}
				return state.receive( posts.map( normalizePostForState ), { query } );
			},
			[ ORDERS_RECEIVE ]: ( state, { posts } ) => {
				return state.receive( posts );
			},
			[ ORDER_RESTORE ]: ( state, { siteId, postId } ) => {
				const globalId = findItemKey( state, siteId, postId );
				return state.receive(
					{
						global_ID: globalId,
						status: '__RESTORE_PENDING',
					},
					{ patch: true }
				);
			},
			[ ORDER_RESTORE_FAILURE ]: ( state, { siteId, postId } ) => {
				const globalId = findItemKey( state, siteId, postId );
				return state.receive(
					{
						global_ID: globalId,
						status: 'trash',
					},
					{ patch: true }
				);
			},
			[ ORDER_SAVE ]: ( state, { siteId, postId, post } ) => {
				const globalId = findItemKey( state, siteId, postId );
				return state.receive(
					{
						global_ID: globalId,
						...post,
					},
					{ patch: true }
				);
			},
			[ ORDER_DELETE ]: ( state, { siteId, postId } ) => {
				const globalId = findItemKey( state, siteId, postId );
				return state.receive(
					{
						global_ID: globalId,
						status: '__DELETE_PENDING',
					},
					{ patch: true }
				);
			},
			[ ORDER_DELETE_FAILURE ]: ( state, { siteId, postId } ) => {
				const globalId = findItemKey( state, siteId, postId );
				return state.receive(
					{
						global_ID: globalId,
						status: 'trash',
					},
					{ patch: true }
				);
			},
			[ ORDER_DELETE_SUCCESS ]: ( state, { siteId, postId } ) => {
				const globalId = findItemKey( state, siteId, postId );
				return state.removeItem( globalId );
			},
			[ SERIALIZE ]: state => ( {
				data: state.data,
				options: state.options,
			} ),
			[ DESERIALIZE ]: state => new PostQueryManager( state.data, state.options ),
		},
		allSitesQueriesSchema
	);
} )();

/**
 * Returns the updated editor posts state after an action has been dispatched.
 * The state maps site ID, post ID pairing to an object containing revisions
 * for the post.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function edits( state = {}, action ) {
	switch ( action.type ) {
		case ORDERS_RECEIVE:
			return reduce(
				action.orders,
				( memoState, post ) => {
					const postEdits = get( memoState, [ post.site_ID, post.ID ] );
					if ( ! postEdits ) {
						return memoState;
					} else if ( memoState === state ) {
						memoState = merge( {}, state );
					}

					return set(
						memoState,
						[ post.site_ID, post.ID ],
						omitBy( postEdits, ( value, key ) => {
							if ( key === 'terms' ) {
								return isTermsEqual( value, post[ key ] );
							}
							return isEqual( post[ key ], value );
						} )
					);
				},
				state
			);

		case ORDER_EDIT:
			return mergeIgnoringArrays( {}, state, {
				[ action.siteId ]: {
					[ action.postId || '' ]: action.post,
				},
			} );

		case EDITOR_START:
			return Object.assign( {}, state, {
				[ action.siteId ]: {
					...state[ action.siteId ],
					[ action.postId || '' ]: { type: action.postType },
				},
			} );

		case EDITOR_STOP:
			if ( ! state.hasOwnProperty( action.siteId ) ) {
				break;
			}

			return Object.assign( {}, state, {
				[ action.siteId ]: omit( state[ action.siteId ], action.postId || '' ),
			} );

		case ORDER_SAVE_SUCCESS:
			if ( ! state.hasOwnProperty( action.siteId ) || ! action.savedPost || action.postId ) {
				break;
			}
			const { siteId, savedPost } = action;

			// if postId is null, copy over any edits
			return {
				...state,
				[ siteId ]: mapKeys(
					state[ siteId ],
					( value, key ) => ( '' === key ? savedPost.ID : key )
				),
			};
	}

	return state;
}

export default combineReducers( {
	items,
	siteRequests,
	queryRequests,
	queries,
	allSitesQueries,
	edits,
} );