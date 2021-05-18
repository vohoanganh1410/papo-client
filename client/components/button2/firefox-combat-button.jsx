import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class FirefoxCombatButton extends React.Component {
	static displayName = 'FirefoxCombatButton';

	static propTypes = {
		onClick: PropTypes.func,
		className: PropTypes.string,
	};

	static defaultProps = {
		onClick: void 0,
		className: void 0,
	};

	constructor( props ) {
		super( props );

		this.onKeyPress = this.onKeyPress.bind( this );
	}

	onKeyPress( r ) {
		( ' ' !== r.key && 'Enter' !== r.key ) || ( this.props.onClick && this.props.onClick( r ) );
	}

	render() {
		return React.createElement(
			'div',
			Object.assign( {}, this.props, {
				className: classNames( 'c-firefox-compat-button', this.props.className ),
				type: void 0,
				role: 'button',
				tabIndex: 0,
				onKeyPress: this.onKeyPress,
			} )
		);
	}
}
