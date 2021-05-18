import React from 'react';
import { connect } from 'react-redux';
import { flowRight as compose, isEmpty } from 'lodash';
import page from 'page';

import ContentPlaceholder from 'admin/content-placeholder';
import { getCurrentUser } from 'state/current-user/selectors';
import { hasLoadedTeams, isLoadingTeams } from 'state/team/selectors';
import { requestUserTeams } from 'actions/team';

const createReactClass = require( 'create-react-class' );

const WithTeams = function( ComposedComponent ) {
	const component = createReactClass( {
		displayName: 'WithTeams',

		componentWillMount: function() {
			// fetch teams if need
			const { isTeamsLoaded, currentUser } = this.props;

			if ( ! isTeamsLoaded && currentUser ) {
				// fetch user teams
				this.props.requestUserTeams( currentUser.id );
			}
		},

		componentWillReceiveProps: function( nextProps ) {
			const { isTeamsLoaded, teams } = nextProps;

			if ( isTeamsLoaded && isEmpty( teams ) ) {
				page.redirect( '/teams/noteam' );
			}
		},

		render: function() {
			if ( this.props.isLoadingTeams ) {
				return <ContentPlaceholder />;
			}
			return React.createElement( ComposedComponent, this.props );
		},
	} );

	component._composedComponent = ComposedComponent;
	return component;
};

const mapStateToProps = state => {
	return {
		teams: state.teams.data,
		isTeamsLoaded: hasLoadedTeams( state ),
		isLoadingTeams: isLoadingTeams( state ),
		currentUser: getCurrentUser( state ),
	};
};

const composedWithTeamWrapper = compose(
	connect(
		mapStateToProps,
		{
			requestUserTeams,
		}
	),
	WithTeams
);

export default composedWithTeamWrapper;
