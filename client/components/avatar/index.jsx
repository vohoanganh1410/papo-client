/** @format */

/**
 * External dependencies
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Image from 'components/image';
import { getAvatarURL } from 'lib/facebook/utils';

export class Avatar extends React.PureComponent {
	constructor() {
		super( ...arguments );
		this.state = {
			failedToLoad: false,
		};
	}
	static propTypes = {
		user: PropTypes.object,
		size: PropTypes.number,
		imgSize: PropTypes.number,
		avatarSize: PropTypes.number,
	};

	static defaultProps = {
		// The REST-API returns s=96 by default, so that is most likely to be cached
		imgSize: 50,
		size: 50,
		avatarSize: 36,
	};

	onError = () => this.setState( { failedToLoad: true } );

	render() {
		const { size, user, avatarSize } = this.props;

		if ( ! user ) {
			return <span className="gravatar is-placeholder" style={ { width: size, height: size } } />;
		}

		if ( this.state.failedToLoad /* && ! tempImage*/ ) {
			return <span className="gravatar is-missing" />;
		}

		const classes = classnames( 'gravatar', this.props.className );
		const altText = user.name;
		// console.log("user", user);
		const avatarURL = getAvatarURL( user.id, size );

		return (
			<Image
				alt={ altText }
				title={ user.name || 'Error' }
				className={ classes }
				src={ avatarURL }
				width={ avatarSize }
				height={ avatarSize }
				onError={ this.onError }
			/>
		);
	}
}

export default Avatar;
