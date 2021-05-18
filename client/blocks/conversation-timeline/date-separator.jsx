import React from 'react';
import PropTypes from 'prop-types';
import { moment } from 'i18n-calypso';

import styles from './style.scss';

export default class DateSeparator extends React.PureComponent {
	static propTypes = {
		alignment: PropTypes.oneOf( [ 'left', 'center', 'right' ] ),
	};

	static defaultProps = {
		alignment: 'center',
	};

	constructor( props ) {
		super( props );

		this.state = {
			position: props.tooltipPosition || 'top',
		};
	}

	render() {
		const { date } = this.props;
		if ( ! date ) return null;

		const t = moment( date );

		return (
			<div className={ styles.date_separator } style={ { textAlign: this.props.alignment } }>
				<hr className={ styles.separator__hr } />
				<div className={ styles.separator__text }>{ t.format( 'DD [Tháng] MM, YYYY' ) }</div>
			</div>
		);
	}
}
