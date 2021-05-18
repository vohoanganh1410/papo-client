/** @format */

/**
 * External dependencies
 */
import update from 'immutability-helper';

/**
 * Internal dependencies
 */
import { USER_RECEIVE, USER_LOGOUT, SET_SELECTED_TEAM } from 'state/action-types';
import { UserTypes } from 'action-types';
import { combineReducers, createReducer } from 'state/utils';

export const data = createReducer( null, {
	[ USER_RECEIVE ]: ( state, action ) => action.user,
	[ USER_LOGOUT ]: () => null,
	[ UserTypes.RECEIVED_ME_LOCALE ]: ( state, action ) => {
		return update( state, { $merge: { locale: action.locale } } );
	},
} );

export const selectedTeam = createReducer( null, {
	[ SET_SELECTED_TEAM ]: ( state, { team } ) => {
		return team;
	},
} );

export default combineReducers( {
	data,
	selectedTeam,
} );
