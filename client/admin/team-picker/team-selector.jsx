import React from 'react';
import { connect } from 'react-redux';
import { values } from 'lodash';

import { getMyTeams } from 'state/current-user/selectors';

import classNames from 'classnames';
import TeamIteam from './team-item';
import Icon from 'components/icon2';

import styles from './style.scss';

class TeamSelector extends React.PureComponent {
	renderTeamItem = team => {
		return (
			<div key={ team.id }>
				<TeamIteam team={ team } href={ this.props.href } />
			</div>
		);
	};

	renderTeamCreator = () => {
		return (
			<div className={ styles.button }>
				<span>
					<Icon className={ styles.creator_icon } type="plus" />
				</span>
				<a href={ '/teams/create' }>Tạo nhóm mới</a>
			</div>
		);
	};

	render() {
		const teams = values( this.props.teams );
		// console.log( 'teams', teams );

		const selectorClass = classNames( 'team-selector', 'team-list', this.props.className, {
			'is-large': false,
		} );
		return (
			<div className={ selectorClass }>
				{ teams.map( this.renderTeamItem ) }
				<div className={ styles.team_selector__add_new_team }>{ this.renderTeamCreator() }</div>
			</div>
		);
	}
}

export default connect( state => ( {
	teams: getMyTeams( state ),
} ) )( TeamSelector );
