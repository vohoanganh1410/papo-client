/** @format */

/**
 * External dependencies
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class WordPressLogo extends PureComponent {
	static displayName = 'WordPressLogo';

	static defaultProps = {
		size: 72,
		className: 'wordpress-logo',
	};

	static propTypes = {
		size: PropTypes.number,
		className: PropTypes.string,
	};

	render() {
		return (
			<svg
				className={ this.props.className }
				height={ this.props.size }
				width={ this.props.size }
				viewBox="-269 361 72 72"
				fill="currentColor"
			>
				{ /* eslint-disable max-len */ }
				<path
					id="XMLID_5_"
					d="M-233.1,361c-19.8,0-35.9,16.1-35.9,35.9c0,11,4.9,20.8,12.7,27.4v-25.7h8.6c2.3,0,4.7,1.1,6,3.4v0  c1.7,3,5,5,8.7,5c5.6,0,10.1-4.5,10.1-10.1c0-5.6-4.5-10.1-10.1-10.1c-3.7,0-6.9,2-8.7,5v0c-1.3,2.3-3.7,3.4-6,3.4h-8.5  c0.9-12,10.9-21.4,23-21.4c12.8,0,23.1,10.4,23.1,23.1c0,12.8-10.4,23.1-23.1,23.1c-3.7,0-7.2-0.9-10.3-2.4v13.5  c3.3,1,6.8,1.6,10.5,1.6c19.8,0,35.9-16.1,35.9-35.9C-197.1,377.1-213.2,361-233.1,361z"
				/>
				{ /* eslint-enable max-len */ }
			</svg>
		);
	}
}
