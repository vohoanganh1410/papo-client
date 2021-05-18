/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Avatar from 'components/avatar';
import Animate from 'components/animate';

class ProfileAvatar extends Component {
	render() {
		// use imgSize = 400 for caching
		// it's the popular value for large Avatar in Papo
		const GRAVATAR_IMG_SIZE = 400;

		return (
			<div className="profile-gravatar" style={ this.props.style }>
				<div>
					<Animate type="appear">
						<Avatar user={ this.props.user } avatarSize={ 100 } size={ 100 } imgSize={ 100 } />
					</Animate>
				</div>
				<h2 className="profile-gravatar__user-display-name">{ this.props.user.displayName }</h2>
				<div className="profile-gravatar__user-secondary-info">{ this.props.user.email }</div>
			</div>
		);
	}
}

export default ProfileAvatar;
