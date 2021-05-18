import React from 'react';
import { connect } from 'react-redux';

import Card from 'components/card';
import { getTeamErrors, getTeamMembers } from 'state/team/selectors';
import MemberItem from './member-item';
import { addTeamMember } from 'actions/team';
import WithTeam from 'components/with-team';

import styles from './style.scss';

class Team extends React.PureComponent {
	renderMember = member => {
		if ( ! member ) {
			return null;
		}

		return (
			<div key={ member.id }>
				<MemberItem
					member={ member }
					path={ this.props.path }
					query={ this.props.query }
					teamId={ this.props.selectedTeam ? this.props.selectedTeam.id : null }
				/>
			</div>
		);
	};

	addTeamMember = memberData => {
		const { selectedTeam } = this.props;
		if ( ! selectedTeam ) return;

		this.props.addTeamMember( {
			team_id: selectedTeam.id,
			user_id: memberData.id,
			roles: memberData.roles,
		} );
	};

	render() {
		const { errors } = this.props;

		if ( errors ) {
			return <Card highlight="error">{ errors.message }</Card>;
		}

		const members = this.props.members || [];

		return <div>{ members.map( this.renderMember ) }</div>;
	}
}

export default connect(
	( state, { selectedTeam } ) => {
		return {
			members: selectedTeam ? getTeamMembers( state, selectedTeam.id ) : null,
			errors: selectedTeam ? getTeamErrors( state, selectedTeam.id ) : null,
		};
	},
	{
		addTeamMember,
	}
)( WithTeam( Team ) );
