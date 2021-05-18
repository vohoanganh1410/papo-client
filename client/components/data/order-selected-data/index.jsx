/** @format */

/**
 * External dependencies
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import OrderSelectedStore from 'lib/orders/order-selected-store';
import passToChildren from 'lib/react-pass-to-children';

function getStateData( siteId ) {
	return {
		ordersSelectedItems: OrderSelectedStore.getAll( siteId ),
	};
}

export default class extends React.Component {
	static displayName = 'MediaLibrarySelectedData';

	static propTypes = {
		siteId: PropTypes.number.isRequired,
	};

	state = getStateData( this.props.siteId );

	componentDidMount() {
		OrderSelectedStore.on( 'change', this.updateState );
	}

	componentWillUnmount() {
		OrderSelectedStore.off( 'change', this.updateState );
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.props.siteId !== nextProps.siteId ) {
			this.setState( getStateData( nextProps.siteId ) );
		}
	}

	updateState = () => {
		this.setState( getStateData( this.props.siteId ) );
	};

	render() {
		return passToChildren( this, this.state );
	}
}
