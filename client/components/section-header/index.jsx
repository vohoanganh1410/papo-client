/** @format */

/**
 * External dependencies
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import CompactCard from 'components/card/compact';
import Count from 'components/count';
import styles from './style.scss';

export default class SectionHeader extends PureComponent {
	static defaultProps = {
		label: '',
		href: null,
	};

	render() {
		const hasCount = 'number' === typeof this.props.count;
		const isEmpty = ! ( this.props.label || hasCount || this.props.children );
		const classes = classNames(
			this.props.className,
			styles.section_header,
			{
				[ styles.is_card ]: true,
			},
			{ [ styles.is_empty ]: isEmpty }
		);

		return (
			<CompactCard className={ classes } href={ this.props.href }>
				<div className={ styles.section_header__label }>
					<span className={ styles.section_header__label_text }>{ this.props.label }</span>
					{ hasCount && <Count className={ styles.member_count } count={ this.props.count } /> }
				</div>
				<div className={ styles.section_header__actions }>{ this.props.children }</div>
			</CompactCard>
		);
	}
}
