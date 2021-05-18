import React from 'react';
import { connect } from 'react-redux';
import { flowRight as compose, isEmpty, values, find, includes } from 'lodash';
import page from 'page';

import ContentPlaceholder from 'admin/content-placeholder';
import { getSelectedTeam, getCurrentUser } from 'state/current-user/selectors';
import {
	getCurrentUserInTeam,
	getTeamRoles,
	hasLoadedTeams,
	hasLoadedTeamRoles,
	hasLoadedTeamMembers,
	getTeamMembers,
	isLoadingTeamMembers,
	isRequestingTeamRoles,
	isLoadingTeams,
} from 'state/team/selectors';
import { getSystemPermissions, hasLoadedPermissions } from 'state/permissions/selectors';
import {
	requestTeamRoles as fetchTeamRoles,
	requestUserTeams,
	setSelectedTeam,
	requestTeamMembers,
} from 'actions/team';
import { requestPermissions } from 'actions/permission';

const createReactClass = require( 'create-react-class' );

const WithTeam = function( ComposedComponent ) {
	const component = createReactClass( {
		displayName: 'WithTeam',

		componentWillMount: function() {
			// fetch teams if need
			const {
				query,
				isTeamsLoaded,
				teams,
				team,
				currentUser,
				isLoadedPermissions,
				isLoadingTeams,
			} = this.props;

			if ( ! isTeamsLoaded && ! isLoadingTeams && currentUser ) {
				// fetch user teams
				this.props.requestUserTeams( currentUser.id );
			}

			if ( ! team && teams && query && query.team && query.team.length > 0 ) {
				const t = find( values( teams ), { name: query.team } );
				if ( t ) {
					this.props.setSelectedTeam( t );
				}

				// we will try to set selected team in componentWillReceiveProps, not redirect user to select page now
			}

			if ( ! isLoadedPermissions ) {
				this.props.requestPermissions();
			}
		},

		componentWillReceiveProps: function( nextProps ) {
			const { query, team } = nextProps;

			if ( isEmpty( this.props.teams ) && ! isEmpty( nextProps.teams ) ) {
				if ( ! team ) {
					if ( query && query.team && query.team.length > 0 ) {
						if ( nextProps.teams ) {
							const t = find( values( nextProps.teams ), { name: query.team } );
							if ( t ) {
								this.props.setSelectedTeam( t );
							} else {
								page.redirect( '/teams/select' );
							}
						}
					}
				}
			}

			if ( isEmpty( this.props.team ) && ! isEmpty( nextProps.team ) ) {
				// fetch all data
				this.props.fetchTeamRoles( nextProps.team.id );
				this.props.requestTeamMembers( nextProps.team.id );
			}
		},

		render: function() {
			const { isLoaded, isLoading, team } = this.props;

			if ( ! isLoaded && isLoading ) {
				return <ContentPlaceholder withHeaderCake={ true } />;
			}

			if ( isLoaded && ! isEmpty( team ) ) {
				return React.createElement( ComposedComponent, this.props );
			}

			return null;
		},
	} );

	component._composedComponent = ComposedComponent;
	return component;
};

const mapStateToProps = state => {
	const team = getSelectedTeam( state );
	const _isLoadingTeams = isLoadingTeams( state );
	const _isLoadingTeamRoles = isRequestingTeamRoles( state );
	const _isLoadedPermissions = hasLoadedPermissions( state );
	const _isLoadingTeamMembers = isLoadingTeamMembers( state );
	// others loading
	const isLoading = _isLoadingTeams || _isLoadingTeamRoles || _isLoadingTeamMembers;

	const _isTeamsLoaded = hasLoadedTeams( state );
	const _isTeamRolesLoaded = hasLoadedTeamRoles( state );
	const _isLoadedTeamMembers = hasLoadedTeamMembers( state );
	// others loaded
	const isLoaded = _isTeamsLoaded && _isTeamRolesLoaded && _isLoadedTeamMembers;

	const _currentMemberRoles = team ? getCurrentUserInTeam( state, team.id ) : null;

	const permissions =
		_currentMemberRoles && _currentMemberRoles.roles && _currentMemberRoles.roles.permissions
			? _currentMemberRoles.roles.permissions
			: [];
	const isTeamCreator = _currentMemberRoles && _currentMemberRoles.scheme_admin;
	const canManageRoles = isTeamCreator || includes( permissions, 'manage_team_roles' );
	const canViewMembers = isTeamCreator || includes( permissions, 'vew_admin_member' );
	const canEditMembers = isTeamCreator || includes( permissions, 'edit_admin_member' );
	const canViewOrders = isTeamCreator || includes( permissions, 'vew_orders' );
	const canEditOrders = isTeamCreator || includes( permissions, 'edit_orders' );
	const canViewProducts = isTeamCreator || includes( permissions, 'view_products' );
	const canEditProducts = isTeamCreator || includes( permissions, 'edit_products' );
	const canViewLogistics = isTeamCreator || includes( permissions, 'view_logistics' );
	const canEditLogistics = isTeamCreator || includes( permissions, 'edit_logistics' );
	const canViewShipping = isTeamCreator || includes( permissions, 'view_shipping' );
	const canEditShipping = isTeamCreator || includes( permissions, 'edit_shipping' );

	return {
		teams: state.teams.data,
		team,
		isTeamsLoaded: _isTeamsLoaded,
		isLoadingTeams: _isLoadingTeams,
		isTeamRolesLoaded: _isTeamRolesLoaded,
		isLoadingTeamRoles: _isLoadingTeamRoles,
		currentMemberRoles: _currentMemberRoles,
		teamRoles: team ? getTeamRoles( state, team.id ) : null,
		permissions: getSystemPermissions( state ),
		currentUser: getCurrentUser( state ),
		isLoadedPermissions: _isLoadedPermissions,
		isLoadedTeamMembers: _isLoadedTeamMembers,
		teamMembers: team ? getTeamMembers( state, team.id ) : null,
		isLoadingTeamMembers: _isLoadingTeamMembers,
		isLoading,
		isLoaded,
		canManageRoles,
		canViewMembers,
		canEditMembers,
		canViewOrders,
		canEditOrders,
		canViewProducts,
		canEditProducts,
		canViewLogistics,
		canEditLogistics,
		canViewShipping,
		canEditShipping,
	};
};

const composedWithTeamWrapper = compose(
	connect(
		mapStateToProps,
		{
			requestUserTeams,
			fetchTeamRoles,
			setSelectedTeam,
			requestPermissions,
			requestTeamMembers,
		},
		null,
		{ forwardRef: true }
	),
	WithTeam
);

export default composedWithTeamWrapper;
