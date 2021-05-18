/** @format */

/**
 * External dependencies
 */

import { assign, isEqual, map, omit } from 'lodash';

/**
 * Internal dependencies
 */
import Dispatcher from 'dispatcher';
import MediaStore from './store';
import { sortItemsByDate as utilSortItemsByDate } from './utils';
import emitter from 'lib/mixins/emitter';

/**
 * Module variables
 */
const MediaListStore = {
		_activeQueries: {},
		DEFAULT_QUERY: Object.freeze( { limit: 20 } ),
		_media: {},
	},
	DEFAULT_ACTIVE_QUERY = Object.freeze( { isFetchingNextPage: false } ),
	SAME_QUERY_IGNORE_PARAMS = Object.freeze( [ 'limit', 'page_handle' ] );

function sortItemsByDate( pageId ) {
	if ( ! ( pageId in MediaListStore._media ) ) {
		return;
	}

	const sortedItems = utilSortItemsByDate( MediaListStore.getAll( pageId ) );
	// console.log(sortedItems)
	MediaListStore._media[ pageId ] = map( sortedItems, 'id' );
}

function ensureMediaForSiteId( pageId ) {
	if ( ! ( pageId in MediaListStore._media ) ) {
		MediaListStore._media[ pageId ] = [];
	}
}

function receiveSingle( pageId, item, itemId ) {
	// itemId is transient id, so we need re
	// itemId = item.id;

	let existingIndex;

	ensureMediaForSiteId( pageId );

	if ( itemId ) {
		// When updating an existing item, account for the case where the ID
		// has changed by replacing its existing ID in the array
		existingIndex = MediaListStore._media[ pageId ].indexOf( itemId );
		if ( -1 !== existingIndex ) {
			MediaListStore._media[ pageId ].splice( existingIndex, 1, item.id );
		}
	} else if (
		-1 === MediaListStore._media[ pageId ].indexOf( item.id ) &&
		MediaListStore.isItemMatchingQuery( pageId, item )
	) {
		MediaListStore._media[ pageId ].push( item.id );
	}
}

function removeSingle( pageId, item ) {
	let index;

	if ( ! ( pageId in MediaListStore._media ) ) {
		return;
	}

	index = MediaListStore._media[ pageId ].indexOf( item.id );
	if ( -1 !== index ) {
		MediaListStore._media[ pageId ].splice( index, 1 );
	}
}

function receivePage( pageId, items ) {
	ensureMediaForSiteId( pageId );

	items.forEach( function( item ) {
		receiveSingle( pageId, item );
	} );
}

MediaListStore.ensureActiveQueryForSiteId = function( pageId ) {
	if ( ! ( pageId in MediaListStore._activeQueries ) ) {
		MediaListStore._activeQueries[ pageId ] = assign( {}, DEFAULT_ACTIVE_QUERY );
	}
};

function clearSite( pageId ) {
	delete MediaListStore._media[ pageId ];
	delete MediaListStore._activeQueries[ pageId ].nextPageHandle;
	MediaListStore._activeQueries[ pageId ].isFetchingNextPage = false;
}

function updateActiveQuery( pageId, query ) {
	query = omit( query, 'page_handle' );
	MediaListStore.ensureActiveQueryForSiteId( pageId );

	if ( ! isQuerySame( pageId, query ) ) {
		clearSite( pageId );
	}

	MediaListStore._activeQueries[ pageId ].query = query;
}

function updateActiveQueryStatus( pageId, status ) {
	MediaListStore.ensureActiveQueryForSiteId( pageId );
	assign( MediaListStore._activeQueries[ pageId ], status );
}

function getNextPageMetaFromResponse( response ) {
	return response && response.meta && response.meta.next_page ? response.meta.next_page : null;
}

function isQuerySame( pageId, query ) {
	if ( ! ( pageId in MediaListStore._activeQueries ) ) {
		return false;
	}

	return isEqual(
		omit( query, SAME_QUERY_IGNORE_PARAMS ),
		omit( MediaListStore._activeQueries[ pageId ].query, SAME_QUERY_IGNORE_PARAMS )
	);
}

function sourceHasDate( source ) {
	const sourcesWithoutDate = [ 'pexels' ];
	return -1 === sourcesWithoutDate.indexOf( source );
}

MediaListStore.isItemMatchingQuery = function( pageId, item ) {
	var query, matches;

	if ( ! ( pageId in MediaListStore._activeQueries ) ) {
		return true;
	}

	query = omit( MediaListStore._activeQueries[ pageId ].query, SAME_QUERY_IGNORE_PARAMS );

	if ( ! Object.keys( query ).length ) {
		return true;
	}

	matches = true;

	if ( query.search && ! query.source ) {
		// WP_Query tests a post's title and content when performing a search.
		// Since we're testing binary data, we match the title only.
		//
		// See: https://core.trac.wordpress.org/browser/tags/4.2.2/src/wp-includes/query.php#L2091
		matches = item.title && -1 !== item.title.toLowerCase().indexOf( query.search.toLowerCase() );
	}

	if ( !! query.source && matches ) {
		// On uploading external images, the stores will receive the CREATE_MEDIA_ITEM  event
		// and will update the list of media including the new one, but we don't want this new media
		// to be shown in the external source's list - hence the filtering.
		//
		// One use case where this happened was:
		//
		// - go to site icon settings and open google modal
		// - select and image and tap continue
		// - cancel the editing process and you'll be send back to the google modal
		//
		// without this change, the new upload would be shown there.

		matches = ! item.external;
	}

	if ( query.mime_type && matches ) {
		// Mime type query can contain a fragment, e.g. "image/", so match
		// item mime type at beginning
		matches = item.mime_type && 0 === item.mime_type.indexOf( query.mime_type );
	}

	return matches;
};

emitter( MediaListStore );

MediaListStore.get = function( pageId, postId ) {
	return MediaStore.get( pageId, postId );
};

MediaListStore.getAllIds = function( pageId ) {
	return MediaListStore._media[ pageId ];
};

MediaListStore.getAll = function( pageId ) {
	var allIds = MediaListStore.getAllIds( pageId );

	if ( allIds ) {
		return allIds.map( MediaStore.get.bind( null, pageId ) );
	}
};

MediaListStore.getNextPageQuery = function( pageId ) {
	if ( ! ( pageId in MediaListStore._activeQueries ) ) {
		return MediaListStore.DEFAULT_QUERY;
	}

	return assign(
		{},
		MediaListStore.DEFAULT_QUERY,
		{
			page_handle: MediaListStore._activeQueries[ pageId ].nextPageHandle,
		},
		MediaListStore._activeQueries[ pageId ].query
	);
};

MediaListStore.hasNextPage = function( pageId ) {
	return (
		! ( pageId in MediaListStore._activeQueries ) ||
		null !== MediaListStore._activeQueries[ pageId ].nextPageHandle
	);
};

MediaListStore.isFetchingNextPage = function( pageId ) {
	return (
		pageId in MediaListStore._activeQueries &&
		MediaListStore._activeQueries[ pageId ].isFetchingNextPage
	);
};

MediaListStore.dispatchToken = Dispatcher.register( function( payload ) {
	const action = payload.action;

	Dispatcher.waitFor( [ MediaStore.dispatchToken ] );

	switch ( action.type ) {
		case 'CHANGE_MEDIA_SOURCE':
			clearSite( action.pageId );
			MediaListStore.emit( 'change' );
			break;

		case 'SET_MEDIA_QUERY':
			if ( action.pageId && action.query ) {
				updateActiveQuery( action.pageId, action.query );
			}

			break;

		case 'FETCH_MEDIA_ITEMS':
			if ( ! action.pageId ) {
				break;
			}

			updateActiveQueryStatus( action.pageId, {
				isFetchingNextPage: true,
			} );

			MediaListStore.emit( 'change' );
			break;

		case 'CREATE_MEDIA_ITEM':
		case 'RECEIVE_MEDIA_ITEM':
			if ( action.error && action.pageId && action.id ) {
				// If error occured while uploading, remove item from store
				removeSingle( action.pageId, { id: action.id } );
				MediaListStore.emit( 'change' );
			}

			if ( ! action.pageId ) {
				break;
			}

			if ( action.error || ! action.data ) {
				break;
			}

			receiveSingle( action.pageId, action.data, action.id );
			sortItemsByDate( action.pageId );
			MediaListStore.emit( 'change' );
			break;

		case 'RECEIVE_MEDIA_ITEMS':
			if ( ! action.pageId ) {
				break;
			}

			updateActiveQueryStatus( action.pageId, {
				isFetchingNextPage: false,
				nextPageHandle: getNextPageMetaFromResponse( action.data ),
			} );

			if (
				action.error ||
				! action.data ||
				( action.query && ! isQuerySame( action.pageId, action.query ) )
			) {
				break;
			}

			receivePage( action.pageId, action.data );
			// either, no query (so no external source), or there is a query and the source has date data
			if (
				action.query === undefined ||
				( action.query !== undefined && sourceHasDate( action.query.source ) )
			) {
				sortItemsByDate( action.pageId );
			}
			MediaListStore.emit( 'change' );
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

			MediaListStore.emit( 'change' );
			break;
	}
} );

export default MediaListStore;
