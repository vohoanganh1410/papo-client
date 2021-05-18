import { reduce } from 'lodash';
import update from 'immutability-helper';

import { combineReducers, createReducer } from 'state/utils';
import {
	REQUEST_TEAM_MEMBERS,
	RECEIVED_TEAM_MEMBERS,
	REQUEST_TEAM_MEMBERS_FAILURED,
	RECEIVED_TEAM_ROLES,
	RECEIVED_TEAM_ROLE,
	RECEIVED_TEAM_ROLE_UPDATED,
	REQUEST_TEAM_ROLES,
	REQUEST_TEAM_ROLES_SUCCESS,
	REQUEST_TEAM_ROLES_FAILURED,
	RECEIVED_MY_TEAMS,
	RECEIVED_TEAM,
	REQUEST_MY_TEAMS,
} from 'state/action-types';

import { TeamTypes } from 'action-types';

const _teamMembers = createReducer(
	{},
	{
		[ RECEIVED_TEAM_MEMBERS ]: ( state, { members, teamId } ) => {
			const membersByTeamId = reduce(
				members,
				( memo, member ) => {
					return Object.assign( memo, {
						[ teamId ]: [ ...( memo[ teamId ] || [] ), member ],
					} );
				},
				{}
			);

			if ( ! state[ teamId ] ) {
				return reduce(
					membersByTeamId,
					( memo, teamMembers ) => {
						const memberByIds = reduce(
							teamMembers,
							( _memo, member ) => {
								_memo[ member.id ] = member;
								return _memo;
							},
							{}
						);

						return {
							...state,
							[ teamId ]: memberByIds,
						};
					},
					state
				);
			}

			return reduce(
				membersByTeamId,
				( memo, teamMembers ) => {
					const memberByIds = reduce(
						teamMembers,
						( _memo, member ) => {
							_memo[ member.id ] = member;
							return _memo;
						},
						{}
					);

					return {
						...state,
						[ teamId ]: memberByIds,
					};
				},
				state
			);
		},
		[ TeamTypes.RECEIVED_TEAM_MEMBER ]: ( state, { teamId, member } ) => {
			if ( ! teamId || ! member ) return state;

			return {
				...state,
				[ teamId ]: {
					...state[ teamId ],
					[ member.id ]: member,
				},
			};
		},
	}
);

const _roles = createReducer(
	{},
	{
		[ RECEIVED_TEAM_ROLES ]: ( state, { roles, teamId } ) => {
			const rolesByTeamId = reduce(
				roles,
				( memo, role ) => {
					return Object.assign( memo, {
						[ teamId ]: [ ...( memo[ teamId ] || [] ), role ],
					} );
				},
				{}
			);

			if ( ! state[ teamId ] ) {
				return reduce(
					rolesByTeamId,
					( memo, teamRoles ) => {
						return {
							...state,
							[ teamId ]: teamRoles,
						};
					},
					state
				);
			}

			return reduce(
				rolesByTeamId,
				( memo, teamRoles ) => {
					return {
						...state,
						[ teamId ]: teamRoles,
					};
				},
				state
			);
		},

		[ RECEIVED_TEAM_ROLE ]: ( state, { teamId, role } ) => {
			if ( ! state[ teamId ] ) {
				return {
					[ teamId ]: [ role ],
				};
			}

			return update( state, { [ teamId ]: { $push: [ role ] } } );
		},

		[ RECEIVED_TEAM_ROLE_UPDATED ]: ( state, { teamId, roleId, role } ) => {
			return update( state, {
				[ teamId ]: {
					$apply: b =>
						b.map( item => {
							if ( item.id === roleId ) {
								return role;
							}

							return item;
						} ),
				},
			} );
		},
	}
);

export const isRequestingMembers = createReducer( false, {
	[ REQUEST_TEAM_MEMBERS ]: () => true,
	[ RECEIVED_TEAM_MEMBERS ]: () => false,
	[ REQUEST_TEAM_MEMBERS_FAILURED ]: () => false,
} );

export const isRequestingTeamRoles = createReducer( false, {
	[ REQUEST_TEAM_ROLES ]: () => true,
	[ REQUEST_TEAM_ROLES_SUCCESS ]: () => false,
	[ RECEIVED_TEAM_ROLES ]: () => false,
	[ REQUEST_TEAM_ROLES_FAILURED ]: () => false,
} );

export const teamErrors = createReducer(
	{},
	{
		[ REQUEST_TEAM_MEMBERS_FAILURED ]: ( state, { error, teamId } ) => {
			return {
				[ teamId ]: error,
			};
		},
	}
);

export const roleErrors = createReducer(
	{},
	{
		[ REQUEST_TEAM_ROLES_FAILURED ]: ( state, { error, teamId } ) => {
			return {
				[ teamId ]: error,
			};
		},
	}
);

export const data = createReducer(
	{},
	{
		[ RECEIVED_MY_TEAMS ]: ( state, { teams } ) => {
			if ( ! teams || teams.length === 0 ) return state;

			const teamByIds = reduce(
				teams,
				( memo, team ) => {
					const { id } = team;
					return Object.assign( memo, {
						[ id ]: team,
					} );
				},
				{}
			);

			return teamByIds;
		},
		[ RECEIVED_TEAM ]: ( state, { team } ) => {
			if ( ! team ) return state;
			return {
				...state,
				[ team.id ]: team,
			};
		},
	}
);

export const isloadingTeams = createReducer( false, {
	[ REQUEST_MY_TEAMS ]: () => true,
	[ RECEIVED_MY_TEAMS ]: () => false,
} );

export const hasLoadedTeams = createReducer( false, {
	[ REQUEST_MY_TEAMS ]: () => false,
	[ RECEIVED_MY_TEAMS ]: () => true,
} );

export const hasLoadedTeamRoles = createReducer( false, {
	[ REQUEST_TEAM_ROLES ]: () => false,
	[ RECEIVED_TEAM_ROLES ]: () => true,
	[ REQUEST_TEAM_ROLES_FAILURED ]: () => true,
} );

export const hasLoadedTeamMembers = createReducer( false, {
	[ REQUEST_TEAM_MEMBERS ]: () => false,
	[ RECEIVED_TEAM_MEMBERS ]: () => true,
	[ REQUEST_TEAM_MEMBERS_FAILURED ]: () => true,
} );

export default combineReducers( {
	data,
	isloadingTeams,
	hasLoadedTeams,
	hasLoadedTeamMembers,
	members: _teamMembers,
	roles: _roles,
	hasLoadedTeamRoles,
	isRequestingMembers,
	isRequestingTeamRoles,
	teamErrors,
	roleErrors,
} );
