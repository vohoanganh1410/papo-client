/** @format */

/**
 * External dependencies
 */

import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Badge from 'papo-components/Badge';
import Avatar from 'papo-components/Avatar';

/**
 * Internal dependencies
 */
import { getAvatarURL } from 'lib/facebook/utils';
import { getMemberRoles } from 'state/team/selectors';
import styles from './style.scss';

class PeopleProfile extends React.PureComponent {
	static displayName = 'PeopleProfile';

	renderNameOrEmail = () => {
		const { user } = this.props;

		const displayName = user.display_name || user.first_name + ' ' + user.last_name;

		return (
			<div className={ styles.people_profile__username } title={ displayName }>
				{ displayName }
			</div>
		);
	};

	renderRole = () => {
		const { user, roles } = this.props;
		if ( ! user ) return null;

		if ( ! roles && ! user.scheme_admin ) return <span>Unknown roles</span>;

		if ( user.scheme_admin ) {
			return (
				<Badge size="small" skin="danger" type="solid" uppercase>
					Khởi tạo nhóm
				</Badge>
			);
		}

		if ( roles ) {
			return (
				<Badge size="small" skin="general" type="outlined" uppercase>
					{ roles.display_name }
				</Badge>
			);
		}
	};

	renderFbName = () => {
		const { user } = this.props;

		const displayName = user.first_name + ' ' + user.last_name;

		return (
			<div className={ styles.people_profile__login }>
				<span>@{ displayName }</span>
			</div>
		);
	};

	render() {
		const { user } = this.props;

		if ( ! user ) return null;

		const classes = classNames(
			styles.people_profile,
			{
				[ styles.is_placeholder ]: ! user,
			},
			this.props.className
		);

		const avatarURL = getAvatarURL( user.auth_data, 100 );
		const displayName = user.first_name + ' ' + user.last_name;

		return (
			<div className={ classes }>
				<div className={ styles.people_profile__gravatar }>
					<Avatar size="size72" color="grey" imgProps={ { src: avatarURL } } name={ displayName } />
				</div>
				<div className={ styles.people_profile__detail }>
					{ this.renderNameOrEmail() }
					{ this.renderFbName() }
					{ this.renderRole() }
				</div>
			</div>
		);
	}
}

export default connect( ( state, { user, teamId } ) => {
	return {
		roles: user ? getMemberRoles( state, user.roles, teamId ) : null,
	};
} )( PeopleProfile );
