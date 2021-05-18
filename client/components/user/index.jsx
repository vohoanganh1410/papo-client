/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Avatar from 'components/avatar';

export default class UserItem extends Component {
	static displayName = 'UserItem';

	static propTypes = {
		user: PropTypes.object,
	};

	render() {
		const user = this.props.user || null;
		const name = user ? user.displayName : '';
		return (
			<div className="user" title={ name }>
				<Avatar size={ 26 } user={ user } />
				<span className="user__name">{ name }</span>
			</div>
		);
	}
}
