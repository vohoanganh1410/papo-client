/** @format */

/**
 * External dependencies
 */

import { includes } from 'lodash';

/**
 * Internal dependencies
 */
import { combineReducers, createReducer } from 'state/utils';
import { items as itemSchemas } from './schema';
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

/**
 * Returns the updated requests state after an action has been dispatched. The
 * state maps site ID to whether a request is in progress.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const requesting = createReducer(
	{},
	{
		[ SITE_ORDER_STATUSES_REQUEST ]: ( state, { siteId } ) => ( { ...state, [ siteId ]: true } ),
		[ SITE_ORDER_STATUSES_REQUEST_SUCCESS ]: ( state, { siteId } ) => ( { ...state, [ siteId ]: false } ),
		[ SITE_ORDER_STATUSES_REQUEST_FAILURE ]: ( state, { siteId } ) => ( { ...state, [ siteId ]: false } ),
	}
);

/**
 * Returns the save Request status after an action has been dispatched. The
 * state maps site ID to the request status
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const saveRequests = createReducer(
	{},
	{
		[ SITE_ORDER_STATUSES_SAVE ]: ( state, { siteId } ) => ( {
			...state,
			[ siteId ]: { saving: true, status: 'pending', error: false },
		} ),
		[ SITE_ORDER_STATUSES_SAVE_SUCCESS ]: ( state, { siteId } ) => ( {
			...state,
			[ siteId ]: { saving: false, status: 'success', error: false },
		} ),
		[ SITE_ORDER_STATUSES_SAVE_FAILURE ]: ( state, { siteId, error } ) => ( {
			...state,
			[ siteId ]: { saving: false, status: 'error', error },
		} ),
	}
);

/**
 * Returns the updated items state after an action has been dispatched. The
 * state maps site ID to the site settings object.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const items = createReducer(
	{},
	{
		[ SITE_ORDER_STATUSES_RECEIVE ]: ( state, { siteId, statuses } ) => ( {
			...state,
			[ siteId ]: statuses,
		} ),
		[ SITE_ORDER_STATUSES_UPDATE ]: ( state, { siteId, statuses } ) => ( {
			...state,
			[ siteId ]: {
				...state[ siteId ],
				...statuses,
			},
		} ),
	},
	itemSchemas
);

export default combineReducers( {
	items,
	requesting,
	saveRequests,
} );
