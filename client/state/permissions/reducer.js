import { map } from 'lodash';

import { combineReducers, createReducer } from 'state/utils';
import {
	RECEIVED_PERMISSIONS,
	REQUEST_PERMISSIONS,
	REQUEST_PERMISSIONS_FAILURED,
} from 'state/action-types';
import { normalizePermissionForClient } from './utils';

export const systemPermissions = createReducer( [], {
	[ RECEIVED_PERMISSIONS ]: ( state, action ) => {
		return map( action.permissions, permission => normalizePermissionForClient( permission ) );
	},
	[ REQUEST_PERMISSIONS_FAILURED ]: state => {
		return state;
	},
} );

export const isLoadingPermissions = createReducer( false, {
	[ REQUEST_PERMISSIONS ]: () => true,
	[ RECEIVED_PERMISSIONS ]: () => false,
	[ REQUEST_PERMISSIONS_FAILURED ]: () => false,
} );

export const hasLoadedPermissions = createReducer( false, {
	[ REQUEST_PERMISSIONS ]: () => false,
	[ RECEIVED_PERMISSIONS ]: () => true,
	[ REQUEST_PERMISSIONS_FAILURED ]: () => true,
} );

export default combineReducers( {
	systemPermissions,
	isLoadingPermissions,
	hasLoadedPermissions,
} );
