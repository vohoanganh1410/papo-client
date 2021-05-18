/** @format */

/**
 * External dependencies
 */

import { assign } from 'lodash';
import debugFactory from 'debug';
const debug = debugFactory( 'papo:media' );

/**
 * Internal dependencies
 */
import Dispatcher from 'dispatcher';

/**
 * Module variables
 */
const OrdersActions = {
	_fetching: {},
};

OrdersActions.sourceChanged = function( siteId ) {
	debug( 'Media data source changed' );
	Dispatcher.handleViewAction( {
		type: 'CHANGE_ORDERS_SOURCE',
		siteId,
	} );
};

OrdersActions.setOrdersSelectedItems = function( siteId, items ) {
	debug( 'Setting selected items for %d as %o', siteId, items );
	Dispatcher.handleViewAction( {
		type: 'SET_MEDIA_LIBRARY_SELECTED_ITEMS',
		siteId: siteId,
		data: items,
	} );
};

export default OrdersActions;
