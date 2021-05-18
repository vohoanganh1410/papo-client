/** @format */

/**
 * External dependencies
 */
import React, { Component } from 'react';
import { assign, omit } from 'lodash';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Icon from 'components/icon2';
import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

class Card extends Component {
	static propTypes = {
		className: PropTypes.string,
		href: PropTypes.string,
		tagName: PropTypes.string,
		target: PropTypes.string,
		compact: PropTypes.bool,
		highlight: PropTypes.oneOf( [ false, 'error', 'info', 'success', 'warning' ] ),
	};

	static defaultProps = {
		tagName: 'div',
		highlight: false,
	};

	render() {
		const { children, compact, highlight, href, onClick, tagName, target } = this.props;

		const highlightClass = highlight ? styles[ 'is_' + highlight ] : false;

		const className = classnames(
			styles.card,
			this.props.className,
			{
				[ styles.is_card_link ]: !! href,
				[ styles.is_clickable ]: !! onClick,
				[ styles.is_compact ]: compact,
				[ styles.is_highlight ]: highlightClass,
			},
			highlightClass
		);

		const omitProps = [ 'compact', 'highlight', 'tagName' ];

		let linkIndicator;
		if ( href ) {
			linkIndicator = (
				<div
					className={
						styles.card__link_indicator + ' ' + g_styles.d_flex + ' ' + g_styles.v_center
					}
				>
					<Icon className={ styles.card__link_icon } type="chevron_large_right" />
				</div>
			);
		} else {
			omitProps.push( 'href', 'target' );
		}

		return React.createElement(
			href ? 'a' : tagName,
			assign( omit( this.props, omitProps ), { className } ),
			linkIndicator,
			children
		);
	}
}

export default Card;
