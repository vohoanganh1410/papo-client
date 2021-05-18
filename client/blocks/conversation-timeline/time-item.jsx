import React from 'react';
import PropTypes from 'prop-types';
import { moment } from 'i18n-calypso';

import Tooltip from 'components/tooltip2';
import styles from './style.scss';

export default class TimeItem extends React.PureComponent {
	static propTypes = {
		time: PropTypes.string,
		showTooltip: PropTypes.bool,
	};

	static defaultProps = {
		showTooltip: true,
	};

	constructor( props ) {
		super( props );

		this.state = {
			position: props.tooltipPosition || 'top',
		};
	}

	render() {
		if ( ! this.props.time ) return null;

		const t = moment( this.props.time );
		return (
			<span className={ styles.time_item } title={ t.format( 'h:mm:ss A DD-MM-YYYY' ) }>
				{ t.format( 'h:mm A' ) }
			</span>
		);
		// return (
		// 	<Tooltip tip={ t.format( 'h:mm:ss A DD-MM-YYYY' ) } position={ this.state.position }>
		// 		<span className={ styles.time_item }>{ t.format( 'h:mm A' ) }</span>
		// 	</Tooltip>
		// );
	}
}
