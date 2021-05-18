import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

import CompactCard from 'components/card/compact';
import PeopleProfile from 'blocks/member-profile';

import styles from './style.scss';

export default class MemberItem extends React.PureComponent {
	static propTypes = {
		member: PropTypes.object,
		isLoading: PropTypes.bool,
	};

	addQueryTeamToURLIfNeed = () => {
		const { query } = this.props;
		const selectedTeamFromParams = query.team;

		if ( selectedTeamFromParams ) {
			return `?team=${ selectedTeamFromParams }`;
		}
		return null;
	};

	maybeGetCardLink = () => {
		const { type, member } = this.props;

		if ( 'invite-details' === type ) {
			return null;
		}

		const editLink = '/admin/members/' + member.id + '/edit' + this.addQueryTeamToURLIfNeed();

		return editLink;
	};

	render() {
		const { className, invite, type, member } = this.props;

		const classes = classNames( styles.member_list_item, className );
		const canLinkToProfile = noop;
		const tagName = canLinkToProfile ? 'a' : 'span';

		return (
			<CompactCard className={ classes } tagName={ tagName } href={ this.maybeGetCardLink() }>
				<PeopleProfile
					className={ styles.member_list_item_container }
					invite={ invite }
					type={ type }
					user={ member }
					teamId={ this.props.teamId }
				/>
			</CompactCard>
		);
	}
}
