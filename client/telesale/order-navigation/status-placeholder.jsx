/** @format */

/**
 * External dependencies
 */
import React, { Component } from 'react';
import GridIcon from 'gridicons';

/**
 * Internal dependencies
 */
import OrderStatusButton from 'components/order-status-button';

class StatusPlaceholder extends Component {
	render() {
		return (
			<OrderStatusButton
				compact
				placeholder
				key={ this.props.key }
				disabled={ false }
				status={ null } />
		);
	}
}

export default StatusPlaceholder;
