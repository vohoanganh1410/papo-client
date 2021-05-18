import { reset } from 'redux-form';
import { find } from 'lodash';

import { Client1 } from 'lib/client1';

import {
	REQUEST_TEAM_MEMBERS,
	RECEIVED_TEAM_MEMBERS,
	REQUEST_TEAM_MEMBERS_FAILURED,
	REQUEST_TEAM_ROLES,
	RECEIVED_TEAM_ROLES,
	REQUEST_TEAM_ROLES_FAILURED,
	RECEIVED_TEAM,
	FETCH_TEAMS_FAILURED,
	RECEIVED_MY_TEAMS,
	SET_SELECTED_TEAM,
	REQUEST_MY_TEAMS,
} from 'state/action-types';

import { TeamTypes } from 'action-types';

// export const createTeam = teamData => dispatch => {
// 	return Client1.createTeam( teamData )
// 		.then( team => {
// 			dispatch( {
// 				type: RECEIVED_TEAM,
// 				team: team,
// 			} );
// 			Dispatcher.handleViewAction( {
// 				type: EventTypes.TEAM_CREATE_STATUS,
// 				value: true,
// 			} );
// 		} )
// 		.catch( error => {
// 			Dispatcher.handleViewAction( {
// 				type: EventTypes.TEAM_CREATE_STATUS,
// 				value: false,
// 			} );
// 		} );
// };

export function createTeam( values, dispatch ) {
	const teamData = Object.assign( values, { type: 'I' } );

	return Client1.createTeam( teamData )
		.then( team => {
			dispatch( reset( 'createTeam' ) );

			dispatch( {
				type: TeamTypes.CREATE_TEAM_SUCCESS,
				team,
			} );

			dispatch( {
				type: RECEIVED_TEAM,
				team,
			} );
		} )
		.catch( error => {
			// dispatch( {
			// 	type: CREATE_TEAM_ROLE_FAILURED,
			// 	teamId,
			// 	error,
			// } );
		} );
}

export const requestUserTeams = userId => dispatch => {
	if ( ! userId || userId.length === 0 ) {
		dispatch( {
			type: FETCH_TEAMS_FAILURED,
		} );
	}

	dispatch( {
		type: REQUEST_MY_TEAMS,
	} );

	return Client1.getUserTeams( userId )
		.then( teams => {
			dispatch( {
				type: RECEIVED_MY_TEAMS,
				teams,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: FETCH_TEAMS_FAILURED,
				error: error,
			} );
		} );
};

export const setSelectedTeam = team => dispatch => {
	dispatch( {
		type: SET_SELECTED_TEAM,
		team,
	} );
};

export const requestTeamMembers = teamId => dispatch => {
	if ( ! teamId || teamId.length === 0 ) {
		dispatch( {
			type: REQUEST_TEAM_MEMBERS_FAILURED,
		} );
		return;
	}

	dispatch( {
		type: REQUEST_TEAM_MEMBERS,
		teamId,
	} );

	return Client1.fetchTeamMembers( teamId )
		.then( members => {
			dispatch( {
				type: RECEIVED_TEAM_MEMBERS,
				teamId,
				members,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: REQUEST_TEAM_MEMBERS_FAILURED,
				teamId,
				error,
			} );
		} );
};

export const requestTeamMember = ( teamId, memberId ) => {
	return new Promise( ( resolve, reject ) => {
		Client1.fetchTeamMember( teamId, memberId )
			.then( member => {
				resolve( member );
			} )
			.catch( error => reject( error ) );
	} );
};

export const requestTeamRoles = teamId => dispatch => {
	if ( ! teamId || teamId.length === 0 ) {
		dispatch( {
			type: REQUEST_TEAM_ROLES_FAILURED,
		} );
		return;
	}

	dispatch( {
		type: REQUEST_TEAM_ROLES,
		teamId,
	} );

	return Client1.fetchTeamRoles( teamId )
		.then( roles => {
			dispatch( {
				type: RECEIVED_TEAM_ROLES,
				teamId,
				roles,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: REQUEST_TEAM_ROLES_FAILURED,
				teamId,
				error,
			} );
		} );
};

// export const addTeamMember = memberData => dispatch => {
// 	dispatch( {
// 		type: ADD_TEAM_MEMBER,
// 	} );
//
// 	return Client1.addTeamMember( memberData )
// 		.then( member => {
// 			dispatch( {
// 				type: ADD_TEAM_MEMBER_SUCCESS,
// 				teamId: memberData.team_id,
// 				member,
// 			} );
// 		} )
// 		.catch( error => {
// 			dispatch( {
// 				type: ADD_TEAM_MEMBER_FAILURED,
// 				error,
// 			} );
// 		} );
// };

export function validateUserBeforeAddToTeam( values, dispatch, getState ) {
	const { team } = getState;

	if ( ! team ) {
		throw { id: 'Nhóm không đúng' }; // ???
	}

	if ( values.id && values.id.length !== 26 ) {
		return new Promise( () => {
			throw { id: 'Mã thành viên không đúng' };
		} );
	}

	return Client1.validateUserBeforAddToTeam( team.id, values.id )
		.then()
		.catch( error => {
			if ( error && error.message ) {
				throw { id: error.message };
			} else {
				throw { id: 'Đã có lỗi xảy ra, vui lòng thử lại sau.' };
			}
		} );
}

export function addTeamMember( values, dispatch, getState ) {
	const { teamRoles, team } = getState;
	const role = find( teamRoles, { display_name: values.roles } );

	if ( ! role || ! team ) return null;

	const memberData = {
		user_id: values.id,
		display_name: values.display_name,
		roles: role.name,
		team_id: team.id,
	};

	return Client1.addTeamMember( memberData )
		.then( member => {
			dispatch( reset( 'addTeamMember' ) );
			dispatch( {
				type: TeamTypes.CREATE_TEAM_MEMBER_SUCCESS,
				teamId: memberData.team_id,
				member,
			} );

			dispatch( {
				type: TeamTypes.RECEIVED_TEAM_MEMBER,
				teamId: memberData.team_id,
				member,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: TeamTypes.CREATE_TEAM_MEMBER_FAILED,
				error,
			} );
		} );
}

export function updateTeamMember( values, dispatch, getState ) {
	const { team, member, teamRoles } = getState;
	const role = find( teamRoles, { display_name: values.roles } );

	dispatch( {
		type: TeamTypes.UPDATE_TEAM_MEMBER,
	} );

	return Client1.updateTeamMember(
		team.id,
		member.id,
		Object.assign(
			{},
			{
				roles: role.name,
				display_name: values.display_name,
			}
		)
	)
		.then( () => {
			dispatch( {
				type: TeamTypes.UPDATE_TEAM_MEMBER_SUCCESS,
				teamId: team.id,
				memberId: member.id,
				roles: role.name,
				display_name: values.display_name,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: TeamTypes.UPDATE_TEAM_MEMBER_FAILED,
				error,
			} );
		} );
}

// export const updateTeamMember = ( teamId, memberId, roles ) => dispatch => {
// 	dispatch( {
// 		type: UPDATE_TEAM_MEMBER,
// 	} );
//
// 	return Client1.updateTeamMemberRoles( teamId, memberId, roles )
// 		.then( data => {
// 			dispatch( {
// 				type: UPDATE_TEAM_MEMBER_SUCCESS,
// 				teamId,
// 				memberId,
// 				roles,
// 			} );
// 		} )
// 		.catch( error => {
// 			dispatch( {
// 				type: UPDATE_TEAM_MEMBER_FAILURED,
// 				error,
// 			} );
// 		} );
// };
