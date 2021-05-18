/** @format */

/**
 * External dependencies
 */

import { map } from 'lodash';

/**
 * Internal dependencies
 */
import MediaStore from './store';
import Dispatcher from 'dispatcher';
import emitter from 'lib/mixins/emitter';

/**
 * Module variables
 */
const OrdersSelectedStore = {
	_media: {},
};

function ensureSelectedItemsForSiteId( siteId ) {
	if ( siteId in OrdersSelectedStore._media ) {
		return;
	}

	OrdersSelectedStore._media[ siteId ] = [];
}

function setSelectedItems( siteId, items ) {
	OrdersSelectedStore._media[ siteId ] = map( items, 'id' );
}

function addSingle( siteId, item ) {
	ensureSelectedItemsForSiteId( siteId );
	OrdersSelectedStore._media[ siteId ].push( item.id );
}

function receiveSingle( siteId, item, itemId ) {
	var index;

	if ( ! itemId ) {
		itemId = item.id;
	}

	if ( ! itemId || ! ( siteId in OrdersSelectedStore._media ) ) {
		return;
	}

	index = OrdersSelectedStore._media[ siteId ].indexOf( itemId );
	if ( -1 === index ) {
		return;
	}

	// Replace existing index if one exists
	OrdersSelectedStore._media[ siteId ].splice( index, 1, item.id );
}

function receiveMany( siteId, items ) {
	items.forEach( function( item ) {
		receiveSingle( siteId, item );
	} );
}

function removeSingle( siteId, item ) {
	var index;

	if ( ! ( siteId in OrdersSelectedStore._media ) ) {
		return;
	}

	index = OrdersSelectedStore._media[ siteId ].indexOf( item.id );
	if ( -1 !== index ) {
		OrdersSelectedStore._media[ siteId ].splice( index, 1 );
	}
}

emitter( OrdersSelectedStore );

OrdersSelectedStore.get = function( siteId, itemId ) {
	return MediaStore.get( siteId, itemId );
};

OrdersSelectedStore.getAll = function( siteId ) {
	if ( ! ( siteId in OrdersSelectedStore._media ) ) {
		return [];
	}

	// Avoid keeping invalid items in the selected list.
	return OrdersSelectedStore._media[ siteId ]
		.map( itemId => MediaStore.get( siteId, itemId ) )
		.filter( item => item && ( item.guid || item.transient ) );
};

OrdersSelectedStore.dispatchToken = Dispatcher.register( function( payload ) {
	var action = payload.action;

	Dispatcher.waitFor( [ MediaStore.dispatchToken ] );

	switch ( action.type ) {
		case 'CHANGE_MEDIA_SOURCE':
			setSelectedItems( action.siteId, [] );
			OrdersSelectedStore.emit( 'change' );
			break;

		case 'SET_MEDIA_LIBRARY_SELECTED_ITEMS':
			if ( action.error || ! action.siteId || ! action.data || ! Array.isArray( action.data ) ) {
				break;
			}

			setSelectedItems( action.siteId, action.data );
			OrdersSelectedStore.emit( 'change' );
			break;

		case 'CREATE_MEDIA_ITEM':
			if ( ! action.error && action.siteId && action.data ) {
				addSingle( action.siteId, action.data );
				OrdersSelectedStore.emit( 'change' );
			}
			break;

		case 'RECEIVE_MEDIA_ITEM':
			if ( action.error && action.siteId && action.id ) {
				// If error occured while uploading, remove item from store
				removeSingle( action.siteId, { id: action.id } );
				OrdersSelectedStore.emit( 'change' );
			}

			if ( ! action.siteId || ! action.data || action.error ) {
				break;
			}

			receiveSingle( action.siteId, action.data, action.id );
			OrdersSelectedStore.emit( 'change' );
			break;

		case 'RECEIVE_MEDIA_ITEMS':
			if ( ! action.error && action.siteId && action.data && action.data.media ) {
				receiveMany( action.siteId, action.data.media );
				OrdersSelectedStore.emit( 'change' );
			}
			break;

		case 'REMOVE_MEDIA_ITEM':
			if ( ! action.siteId || ! action.data || action.error ) {
				break;
			}

			removeSingle( action.siteId, action.data );
			OrdersSelectedStore.emit( 'change' );
			break;
	}
} );

export default OrdersSelectedStore;
