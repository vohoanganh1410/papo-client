import { omit, map, isEmpty } from 'lodash';
import { reset } from 'redux-form';

import { Client1 } from 'lib/client1';
import Dispatcher from 'dispatcher';
import EventTypes from 'utils/event-types';

import { makeUserName } from 'utils/utils';

import {
	CREATE_TEAM_ROLE,
	TEAM_ROLE_CREATED,
	CREATE_TEAM_ROLE_FAILURED,
	RECEIVED_TEAM_ROLE,
	UPDATE_TEAM_ROLE,
	TEAM_ROLE_UPDATED,
	RECEIVED_TEAM_ROLE_UPDATED,
	UPDATE_TEAM_ROLE_FAILURED,
} from 'state/action-types';

export function submitRole( values, dispatch, getState ) {
	const rolePermissions = omit( values, [ 'name', 'description' ] );

	const permissions = [];
	map( rolePermissions, ( value, permission ) => {
		if ( value === true ) {
			permissions.push( permission );
		}
	} );

	const team = getState.team;

	if ( ! team || isEmpty( team ) ) return;
	const teamId = team.id;

	const apiData = {
		team_id: teamId,
		name: makeUserName( values.name ),
		display_name: values.name,
		description: values.description,
		permissions: permissions,
	};

	dispatch( {
		type: CREATE_TEAM_ROLE,
		teamId: apiData.team_id,
	} );

	return Client1.createRole( apiData )
		.then( role => {
			dispatch( reset( 'roles' ) );
			dispatch( {
				type: TEAM_ROLE_CREATED,
				role,
				teamId,
			} );

			dispatch( {
				type: RECEIVED_TEAM_ROLE,
				role,
				teamId,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: CREATE_TEAM_ROLE_FAILURED,
				teamId,
				error,
			} );
		} );

	// return sleep(1000) // simulate server latency
	// 	.then(() => {
	// 		if (![ 'john', 'paul', 'george', 'ringo' ].includes(values.username)) {
	// 			throw new SubmissionError({ username: 'User does not exist', _error: 'Login failed!' })
	// 		} else if (values.password !== 'redux-form') {
	// 			throw new SubmissionError({ password: 'Wrong password', _error: 'Login failed!' })
	// 		} else {
	// 			window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
	// 		}
	// 	})
}

export function updateRole( values, dispatch, getState ) {
	const rolePermissions = omit( values, [ 'name', 'description' ] );

	const permissions = [];
	map( rolePermissions, ( value, permission ) => {
		if ( value === true ) {
			permissions.push( permission );
		}
	} );

	const team = getState.team;
	const _role = getState.role;
	if ( ! _role || isEmpty( _role ) ) return;
	const roleId = _role.id;

	if ( ! team || isEmpty( team ) ) return;
	const teamId = team.id;

	const apiData = {
		team_id: teamId,
		name: makeUserName( values.name ),
		display_name: values.name,
		description: values.description,
		permissions: permissions,
	};

	dispatch( {
		type: UPDATE_TEAM_ROLE,
		teamId,
		roleId,
	} );

	return Client1.updateTeamRole( apiData, roleId )
		.then( role => {
			Dispatcher.handleViewAction( {
				type: EventTypes.UPDATE_TEAM_ROLE_SUCCESS,
				value: true,
			} );

			dispatch( {
				type: RECEIVED_TEAM_ROLE_UPDATED,
				teamId,
				roleId,
				role,
			} );

			dispatch( {
				type: TEAM_ROLE_UPDATED,
				teamId,
				roleId,
				role,
			} );
		} )
		.catch( error => {
			Dispatcher.handleViewAction( {
				type: EventTypes.UPDATE_TEAM_ROLE_SUCCESS,
				value: true,
			} );
			dispatch( {
				type: UPDATE_TEAM_ROLE_FAILURED,
				teamId,
				roleId,
				error,
			} );
		} );
}

// export const updateTeamRole = ( roleData, roleId ) => dispatch => {
// 	const teamId = roleData.team_id;
// 	if ( ! roleId || ! teamId ) {
// 		return;
// 	}
//
// 	dispatch( {
// 		type: UPDATE_TEAM_ROLE,
// 		teamId,
// 		roleId,
// 	} );
//
// 	return Client1.updateTeamRole( roleData, roleId )
// 		.then( role => {
// 			Dispatcher.handleViewAction( {
// 				type: EventTypes.UPDATE_TEAM_ROLE_SUCCESS,
// 				value: true,
// 			} );
//
// 			dispatch( {
// 				type: RECEIVED_TEAM_ROLE_UPDATED,
// 				teamId,
// 				roleId,
// 				role,
// 			} );
//
// 			dispatch( {
// 				type: TEAM_ROLE_UPDATED,
// 				teamId,
// 				roleId,
// 				role,
// 			} );
// 		} )
// 		.catch( error => {
// 			Dispatcher.handleViewAction( {
// 				type: EventTypes.UPDATE_TEAM_ROLE_SUCCESS,
// 				value: true,
// 			} );
// 			dispatch( {
// 				type: UPDATE_TEAM_ROLE_FAILURED,
// 				teamId,
// 				roleId,
// 				error,
// 			} );
// 		} );
// };
