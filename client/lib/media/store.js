/** @format */

/**
 * External dependencies
 */

import { values } from 'lodash';

/**
 * Internal dependencies
 */
import { isItemBeingUploaded } from 'lib/media/utils';
import Dispatcher from 'dispatcher';
import emitter from 'lib/mixins/emitter';
import MediaValidationStore from './validation-store';

/**
 * Module variables
 */
const MediaStore = {
	_media: {},
	_pointers: {},
};

emitter( MediaStore );

function receiveSingle( pageId, item, itemId ) {
	if ( ! ( pageId in MediaStore._media ) ) {
		MediaStore._media[ pageId ] = {};
	}

	if ( itemId ) {
		if ( ! ( pageId in MediaStore._pointers ) ) {
			MediaStore._pointers[ pageId ] = {};
		}

		MediaStore._pointers[ pageId ][ itemId ] = item.id;

		const maybeTransientMediaItem = MediaStore._media[ pageId ][ itemId ];

		if ( isItemBeingUploaded( maybeTransientMediaItem ) ) {
			item.description = maybeTransientMediaItem.description;
			item.alt = maybeTransientMediaItem.alt;
			item.caption = maybeTransientMediaItem.caption;
		}

		delete MediaStore._media[ pageId ][ itemId ];
	}

	MediaStore._media[ pageId ][ item.id ] = item;
}

function removeSingle( pageId, item ) {
	if ( ! ( pageId in MediaStore._media ) ) {
		return;
	}

	// This mimics the behavior we get from the server.
	// Deleted items return with only an ID.
	// Status is also added to let any listeners distinguish deleted items.
	MediaStore._media[ pageId ][ item.id ] = { id: item.id, status: item.status };
}

function receivePage( pageId, items ) {
	items.forEach( function( item ) {
		receiveSingle( pageId, item );
	} );
}

function clearPointers( pageId ) {
	MediaStore._pointers[ pageId ] = {};
	MediaStore._media[ pageId ] = {};
}

MediaStore.get = function( pageId, postId ) {
	if ( ! ( pageId in MediaStore._media ) ) {
		return;
	}

	if ( pageId in MediaStore._pointers && postId in MediaStore._pointers[ pageId ] ) {
		return MediaStore.get( pageId, MediaStore._pointers[ pageId ][ postId ] );
	}

	return MediaStore._media[ pageId ][ postId ];
};

MediaStore.getAll = function( pageId ) {
	if ( ! ( pageId in MediaStore._media ) ) {
		return;
	}

	return values( MediaStore._media[ pageId ] );
};

MediaStore.dispatchToken = Dispatcher.register( function( payload ) {
	var action = payload.action;

	Dispatcher.waitFor( [ MediaValidationStore.dispatchToken ] );

	switch ( action.type ) {
		case 'CHANGE_MEDIA_SOURCE':
			clearPointers( action.pageId );
			MediaStore.emit( 'change' );
			break;

		case 'CREATE_MEDIA_ITEM':
		case 'RECEIVE_MEDIA_ITEM':
		case 'RECEIVE_MEDIA_ITEMS':
			if ( action.error && action.pageId && action.id ) {
				// If error occured while uploading, remove item from store
				removeSingle( action.pageId, { id: action.id } );
				MediaStore.emit( 'change' );
			}

			if ( action.error || ! action.pageId || ! action.data ) {
				break;
			}

			if ( Array.isArray( action.data ) ) {

				receivePage( action.pageId, action.data );
			} else {
				receiveSingle( action.pageId, action.data, action.id );
			}

			MediaStore.emit( 'change' );
			break;

		case 'REMOVE_MEDIA_ITEM':
			if ( ! action.pageId || ! action.data ) {
				break;
			}

			if ( action.error ) {
				receiveSingle( action.pageId, action.data );
			} else {
				removeSingle( action.pageId, action.data );
			}

			MediaStore.emit( 'change' );
			break;

		case 'FETCH_MEDIA_ITEM':
			if ( ! action.pageId || ! action.id ) {
				break;
			}

			receiveSingle( action.pageId, {
				id: action.id,
			} );

			MediaStore.emit( 'change' );
			break;
		case 'FETCH_MEDIA_LIMITS':
			if ( ! action.pageId ) {
				break;
			}
			MediaStore.emit( 'fetch-media-limits' );
			break;
	}
} );

export default MediaStore;