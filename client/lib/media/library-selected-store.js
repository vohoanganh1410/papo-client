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
const MediaLibrarySelectedStore = {
	_media: {},
};

function ensureSelectedItemsForSiteId( pageId ) {
	if ( pageId in MediaLibrarySelectedStore._media ) {
		return;
	}

	MediaLibrarySelectedStore._media[ pageId ] = [];
}

function setSelectedItems( pageId, items ) {
	// console.log( map( items, 'id' ) );
	MediaLibrarySelectedStore._media[ pageId ] = map( items, 'id' );
}

function addSingle( pageId, item ) {
	ensureSelectedItemsForSiteId( pageId );
	MediaLibrarySelectedStore._media[ pageId ].push( item.id );
	// console.log( MediaLibrarySelectedStore );
}

function receiveSingle( pageId, item, itemId ) {
	var index;

	if ( ! itemId ) {
		itemId = item.id;
	}

	// console.log('MediaLibrarySelectedStore._media', MediaLibrarySelectedStore._media);

	if ( ! itemId || ! ( pageId in MediaLibrarySelectedStore._media ) ) {
		return;
	}

	index = MediaLibrarySelectedStore._media[ pageId ].indexOf( itemId );
	if ( -1 === index ) {
		return;
	}

	// Replace existing index if one exists
	MediaLibrarySelectedStore._media[ pageId ].splice( index, 1, item.id );
	// console.log('MediaLibrarySelectedStore._media', MediaLibrarySelectedStore._media);
}

function receiveMany( pageId, items ) {
	items.forEach( function( item ) {
		receiveSingle( pageId, item );
	} );
}

function removeSingle( pageId, item ) {
	var index;

	if ( ! ( pageId in MediaLibrarySelectedStore._media ) ) {
		return;
	}

	index = MediaLibrarySelectedStore._media[ pageId ].indexOf( item.id );
	if ( -1 !== index ) {
		MediaLibrarySelectedStore._media[ pageId ].splice( index, 1 );
	}
}

emitter( MediaLibrarySelectedStore );

MediaLibrarySelectedStore.get = function( pageId, itemId ) {
	return MediaStore.get( pageId, itemId );
};

MediaLibrarySelectedStore.getAll = function( pageId ) {
	if ( ! ( pageId in MediaLibrarySelectedStore._media ) ) {
		return [];
	}

	// Avoid keeping invalid items in the selected list.
	return MediaLibrarySelectedStore._media[ pageId ]
		.map( itemId => MediaStore.get( pageId, itemId ) )
		.filter( item => item && ( item.id || item.transient ) );
};

MediaLibrarySelectedStore.clearSelected = function() {
	MediaLibrarySelectedStore._media = {};
	MediaLibrarySelectedStore.emit( 'change' );
}

MediaLibrarySelectedStore.dispatchToken = Dispatcher.register( function( payload ) {
	var action = payload.action;

	Dispatcher.waitFor( [ MediaStore.dispatchToken ] );

	switch ( action.type ) {
		case 'CHANGE_MEDIA_SOURCE':
			setSelectedItems( action.pageId, [] );
			MediaLibrarySelectedStore.emit( 'change' );
			break;

		case 'SET_MEDIA_LIBRARY_SELECTED_ITEMS':
			if ( action.error || ! action.pageId || ! action.data || ! Array.isArray( action.data ) ) {
				break;
			}

			setSelectedItems( action.pageId, action.data );
			MediaLibrarySelectedStore.emit( 'change' );
			break;

		case 'CREATE_MEDIA_ITEM':
			if ( ! action.error && action.pageId && action.data ) {
				addSingle( action.pageId, action.data );
				MediaLibrarySelectedStore.emit( 'change' );
			}
			break;

		case 'RECEIVE_MEDIA_ITEM':
			if ( action.error && action.pageId && action.id ) {
				// If error occured while uploading, remove item from store
				removeSingle( action.pageId, { ID: action.id } );
				MediaLibrarySelectedStore.emit( 'change' );
			}

			if ( ! action.pageId || ! action.data || action.error ) {
				break;
			}

			receiveSingle( action.pageId, action.data.file_infos[0], action.id );
			MediaLibrarySelectedStore.emit( 'change' );
			break;

		case 'RECEIVE_MEDIA_ITEMS':
			if ( ! action.error && action.pageId && action.data ) {
				receiveMany( action.pageId, action.data );
				MediaLibrarySelectedStore.emit( 'change' );
			}
			break;

		case 'REMOVE_MEDIA_ITEM':
			if ( ! action.pageId || ! action.data || action.error ) {
				break;
			}

			removeSingle( action.pageId, action.data );
			MediaLibrarySelectedStore.emit( 'change' );
			break;
	}
} );

export default MediaLibrarySelectedStore;
