/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import { get } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Emojify from 'components/emojify';

export class CustomerAvatar extends Component {
	constructor() {
		super( ...arguments )
	}
	static propTypes = {
		user: PropTypes.object,
		size: PropTypes.number,
		imgSize: PropTypes.number,
		is_show_name: PropTypes.bool,
		is_show_mobile: PropTypes.bool,
	}
	static defaultProps = {
		// The REST-API returns s=96 by default, so that is most likely to be cached
		imgSize: 96,
		size: 32,
		is_show_name: true,
		is_show_mobile: true,
	}

	render() {
		const {  alt, title, size, user, translate } = this.props;

		if ( ! user ) {
			return <span className="gravatar is-placeholder" style={ { width: size, height: size } } />;
		}

		const classes = classnames( 'gravatar', this.props.className );
		const altText = user.name || 'User';
		// const avatarURL = getAvatarURL( user.facebookId, 100 );

		return (
				<div className="order__author">
					<div className="order__author-avatar">
						<img
							alt={ 'altText' }
							title={ user.name }
							className={ classes }
							src={ '/papo/images/people/mystery-person.svg' }
							width={ size }
							height={ size }
							onError={ this.onError }
						/>
					</div>
					<div className="order__author-info">
						<div className="order__author-info-element">
							<strong className="order__author-name">
								<Emojify>{ user.name || translate( 'Anonymous' ) }</Emojify>
							</strong>
						</div>
						<div className="customer-mobile">
							{ user.mobile }
						</div>
					</div>
				</div>
			)
	}
}

export default CustomerAvatar;