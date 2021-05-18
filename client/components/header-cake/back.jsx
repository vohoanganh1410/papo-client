/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { localize } from 'i18n-calypso';
import { throttle } from 'lodash';

/**
 * Internal dependencies
 */
import TextButton from 'papo-components/TextButton';
import ChevronLeft from 'papo-components/new-icons/ChevronLeft';
import Icon from 'components/icon2';
import { getWindowInnerWidth } from 'lib/viewport';
import styles from './style.scss';

/**
 * Module variables
 */
const HIDE_BACK_CRITERIA = {
	windowWidth: 480,
	characterLength: 8,
};

class HeaderCakeBack extends Component {
	static propTypes = {
		onClick: PropTypes.func,
		href: PropTypes.string,
		text: PropTypes.string,
		spacer: PropTypes.bool,
		alwaysShowActionText: PropTypes.bool,
	};

	static defaultProps = {
		spacer: false,
		disabled: false,
		alwaysShowActionText: false,
	};

	state = {
		windowWidth: getWindowInnerWidth(),
	};

	componentDidMount() {
		this.resizeThrottled = throttle( this.handleWindowResize, 100 );
		window.addEventListener( 'resize', this.resizeThrottled );
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.resizeThrottled );
	}

	handleWindowResize = () => {
		this.setState( {
			windowWidth: getWindowInnerWidth(),
		} );
	};

	hideText( text ) {
		if (
			! this.props.alwaysShowActionText &&
			( ( this.state.windowWidth <= HIDE_BACK_CRITERIA.windowWidth &&
				text.length >= HIDE_BACK_CRITERIA.characterLength ) ||
				this.state.windowWidth <= 300 )
		) {
			return true;
		}

		return false;
	}

	render() {
		const { href, icon, onClick, spacer, text, translate } = this.props;
		const backText = text === undefined ? translate( 'Trở về' ) : text;
		const linkClasses = classNames( {
			[ styles.header_cake__back ]: true,
			[ styles.is_spacer ]: spacer,
			[ styles.is_action ]: !! icon,
		} );

		return (
			<TextButton onClick={ onClick } prefixIcon={ <ChevronLeft /> }>
				Trở về
			</TextButton>
		);

		// return (
		// 	<Button
		// 		compact
		// 		borderless
		// 		className={ linkClasses }
		// 		href={ href }
		// 		onClick={ onClick }
		// 		disabled={ spacer }
		// 	>
		// 		<Icon type="arrow_large_left" />
		// 		{ ! this.hideText( backText ) && backText }
		// 	</Button>
		// );
	}
}

export default localize( HeaderCakeBack );
