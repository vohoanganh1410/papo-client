import { get, find, values } from 'lodash';

export function isRequestingTeamMembers( state, teamId ) {
	return state.teams && state.teams.isRequesting ? get( state.teams.isRequesting, teamId ) : false;
}

export function getTeams( state ) {
	return values( state.teams.data );
}

export function isLoadingTeams( state ) {
	return state.teams.isloadingTeams;
}

export function hasLoadedTeams( state ) {
	return state.teams.hasLoadedTeams;
}

export function getTeamMembers( state, teamId ) {
	return state.teams && state.teams.members ? values( get( state.teams.members, teamId ) ) : null;
}

export function isLoadingTeamMembers( state ) {
	return state.teams.isRequestingMembers;
}

export function hasLoadedTeamMembers( state ) {
	return state.teams.hasLoadedTeamMembers;
}

export function getMember( state, teamId, memberId ) {
	const members = getTeamMembers( state, teamId );
	if ( ! members || members.length === 0 ) return null;

	return find( members, [ 'id', memberId ] );
}

export function hasLoadedTeamRoles( state ) {
	return state.teams.hasLoadedTeamRoles;
}

export function getTeamRoles( state, teamId ) {
	return get( state.teams.roles, teamId );
}

export function isRequestingTeamRoles( state ) {
	return state.teams.isRequestingTeamRoles;
}

export function getTeamErrors( state, teamId ) {
	return get( state.teams.teamErrors, teamId );
}

export function getRoleErrors( state, teamId ) {
	return get( state.teams.roleErrors, teamId );
}

export function getMemberRoles( state, roleName, teamId ) {
	const teamRoles = get( state.teams.roles, teamId );
	if ( ! teamRoles || teamRoles.length === 0 ) return null;

	return find( teamRoles, { name: roleName } );
}

export function getCurrentUserInTeam( state, teamId ) {
	const currentUser = state.currentUser.data;
	if ( ! currentUser ) return null;

	const teamMembers = get( state.teams.members, teamId );
	if ( ! teamMembers || teamMembers.length === 0 ) return null;

	const teamRoles = get( state.teams.roles, teamId );
	// if ( !teamRoles || teamRoles.length === 0) return null;

	const currentMember = find( teamMembers, { id: currentUser.id } );

	if ( ! currentMember ) return null;

	return {
		scheme_admin: currentMember.scheme_admin,
		roles: teamRoles ? find( teamRoles, { name: currentMember.roles } ) : null,
	};
}
