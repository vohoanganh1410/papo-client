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
import { Client1 } from 'lib/client1';
import papo from 'lib/papo';
import { createTransientMedia } from './utils';
// import PostEditStore from 'lib/posts/post-edit-store';
import MediaStore from './store';
import MediaListStore from './list-store';
import MediaValidationStore from './validation-store';

import { FETCHING_MEDIA_ITEMS } from 'state/action-types';

/**
 * Module variables
 */
const MediaActions = {
	_fetching: {},
};

/**
 * Constants
 */
const ONE_YEAR_IN_MILLISECONDS = 31540000000;

MediaActions.setQuery = function( pageId, query ) {
	Dispatcher.handleViewAction( {
		type: 'SET_MEDIA_QUERY',
		pageId: pageId,
		query: query,
	} );
};

MediaActions.fetch = function( pageId, itemId ) {
	const fetchKey = [ pageId, itemId ].join();
	if ( MediaActions._fetching[ fetchKey ] ) {
		return;
	}

	MediaActions._fetching[ fetchKey ] = true;
	Dispatcher.handleViewAction( {
		type: 'FETCH_MEDIA_ITEM',
		pageId: pageId,
		id: itemId,
	} );

	debug( 'Fetching media for %d using ID %d', pageId, itemId );
	papo
		.site( pageId )
		.media( itemId )
		.get( function( error, data ) {
			Dispatcher.handleServerAction( {
				type: 'RECEIVE_MEDIA_ITEM',
				error: error,
				pageId: pageId,
				data: data,
			} );

			delete MediaActions._fetching[ fetchKey ];
		} );
};

MediaActions.fetchNextPage = function( pageId ) {
	if ( MediaListStore.isFetchingNextPage( pageId ) ) {
		return;
	}

	Dispatcher.handleServerAction( {
		type: FETCHING_MEDIA_ITEMS,
		pageId: pageId,
	} );

	Dispatcher.handleViewAction( {
		type: 'FETCH_MEDIA_ITEMS',
		pageId: pageId,
	} );

	const query = MediaListStore.getNextPageQuery( pageId );
	const mediaReceived = ( error, data ) => {
		// console.log( 'data', data );
		Dispatcher.handleServerAction( {
			type: 'RECEIVE_MEDIA_ITEMS',
			error: error,
			pageId: pageId,
			data: data,
			query: query,
		} );
	};

	debug( 'Fetching media for %d using query %o', pageId, query );

	Client1.getPageImages( pageId )
		.then( data => {
			mediaReceived( null, data );
		} )
		.catch( err => {
			mediaReceived( err, null );
		} );

	// if ( ! query.source ) {
	// 	papo.page( pageId ).imageList( query, mediaReceived );
	// } else {
	// 	papo.undocumented().externalMediaList( query, mediaReceived );
	// }
};

const getExternalUploader = service => ( file, pageId ) => {
	return papo
		.undocumented()
		.site( pageId )
		.uploadExternalMedia( service, [ file.guid ] );
};

const getFileUploader = () => ( file, pageId ) => {
	// // Determine upload mechanism by object type
	// const isUrl = 'string' === typeof file;
	//
	// // alert(isUrl)
	//
	// // Assign parent ID if currently editing post
	// const post = PostEditStore.get();
	// const title = file.title;
	// if ( post && post.id ) {
	// 	file = {
	// 		parent_id: post.id,
	// 		[ isUrl ? 'url' : 'file' ]: file,
	// 	};
	// } else if ( file.fileContents ) {
	// 	//if there's no parent_id, but the file object is wrapping a Blob
	// 	//(contains fileContents, fileName etc) still wrap it in a new object
	// 	file = {
	// 		file: file,
	// 	};
	// }
	//
	// if ( title ) {
	// 	file.title = title;
	// }
	//
	// debug( 'Uploading media to %d from %o', pageId, file );
	//
	// if ( isUrl ) {
	// 	return papo.site( pageId ).addMediaUrls( {}, file );
	// }
	//
	// return papo.page( pageId ).addMediaFiles( {}, file );
};

function uploadFiles( uploader, files, page ) {
	// We offset the current time when generating a fake date for the transient
	// media so that the first uploaded media doesn't suddenly become newest in
	// the set once it finishes uploading. This duration is pretty arbitrary,
	// but one would hope that it would never take this long to upload an item.
	const baseTime = Date.now() + ONE_YEAR_IN_MILLISECONDS;
	const pageId = page.data.page_id;

	return files.reduce( ( lastUpload, file, i ) => {
		// Assign a date such that the first item will be the oldest at the
		// time of upload, as this is expected order when uploads finish
		const date = new Date( baseTime - ( files.length - i ) ).toISOString();

		// Generate a fake transient item that can be used immediately, even
		// before the media has persisted to the server
		const transientMedia = { date, ...createTransientMedia( file ) };
		if ( file.id ) {
			transientMedia.id = file.id;
		}

		Dispatcher.handleViewAction( {
			type: 'CREATE_MEDIA_ITEM',
			pageId: pageId,
			data: transientMedia,
			page,
		} );

		// Abort upload if file fails to pass validation.
		if ( MediaValidationStore.getErrors( pageId, transientMedia.id ).length ) {
			return Promise.resolve();
		}

		const action = { type: 'RECEIVE_MEDIA_ITEM', id: transientMedia.id, pageId };

		return lastUpload.then( () => {
			// Achieve series upload by waiting for the previous promise to
			// resolve before starting this item's upload

			return uploader( file, pageId )
				.then( data => {
					console.log( data, data );

					// remove placeholder
					Dispatcher.handleViewAction( {
						type: 'REMOVE_MEDIA_ITEM',
						pageId: pageId,
						data: transientMedia,
					} );

					Dispatcher.handleServerAction( {
						type: 'RECEIVE_MEDIA_ITEMS',
						error: null,
						pageId: pageId,
						data: data.file_infos,
						// query: query,
					} );

					// Dispatcher.handleServerAction(
					// 	Object.assign( action, {
					// 		data: data,
					// 	} )
					// );
					// also refetch media limits
					Dispatcher.handleServerAction( {
						type: 'FETCH_MEDIA_LIMITS',
						pageId: pageId,
					} );
				} )
				.catch( error => {
					console.log( error );
					Dispatcher.handleServerAction( Object.assign( action, { error } ) );
				} );
		} );
	}, Promise.resolve() );
}

MediaActions.addExternal = function( site, files, service ) {
	return uploadFiles( getExternalUploader( service ), files, site );
};

MediaActions.add = function( site, files ) {
	if ( files instanceof window.FileList ) {
		files = [ ...files ];
	}

	if ( ! Array.isArray( files ) ) {
		files = [ files ];
	}

	return uploadFiles( getFileUploader(), files, site );
};

MediaActions.edit = function( pageId, item ) {
	const newItem = assign( {}, MediaStore.get( pageId, item.id ), item );

	Dispatcher.handleViewAction( {
		type: 'RECEIVE_MEDIA_ITEM',
		pageId: pageId,
		data: newItem,
	} );
};

MediaActions.update = function( pageId, item, editMediaFile = false ) {
	if ( Array.isArray( item ) ) {
		item.forEach( MediaActions.update.bind( null, pageId ) );
		return;
	}

	const mediaId = item.id;
	const newItem = assign( {}, MediaStore.get( pageId, mediaId ), item );

	// Let's update the media modal immediately
	// with a fake transient media item
	const updateAction = {
		type: 'RECEIVE_MEDIA_ITEM',
		pageId,
		data: newItem,
	};

	if ( item.media ) {
		// Show a fake transient media item that can be rendered into the list immediately,
		// even before the media has persisted to the server
		updateAction.data = {
			...newItem,
			...createTransientMedia( item.media ),
			ID: mediaId,
		};
	} else if ( editMediaFile && item.media_url ) {
		updateAction.data = {
			...newItem,
			...createTransientMedia( item.media_url ),
			ID: mediaId,
		};
	}

	if ( editMediaFile && updateAction.data ) {
		// We need this to show a transient (edited) image in post/page editor after it has been edited there.
		updateAction.data.isDirty = true;
	}

	debug( 'Updating media for %o by ID %o to %o', pageId, mediaId, updateAction );
	Dispatcher.handleViewAction( updateAction );

	const method = editMediaFile ? 'edit' : 'update';

	papo
		.site( pageId )
		.media( item.id )
		[ method ]( item, function( error, data ) {
			Dispatcher.handleServerAction( {
				type: 'RECEIVE_MEDIA_ITEM',
				error: error,
				pageId: pageId,
				data: editMediaFile ? { ...data, isDirty: true } : data,
			} );
		} );
};

MediaActions.delete = function( pageId, item ) {
	if ( Array.isArray( item ) ) {
		item.forEach( MediaActions.delete.bind( null, pageId ) );
		return;
	}

	Dispatcher.handleViewAction( {
		type: 'REMOVE_MEDIA_ITEM',
		pageId: pageId,
		data: item,
	} );

	debug( 'Deleting media from %d by ID %d', pageId, item.id );
	papo
		.site( pageId )
		.media( item.id )
		.delete( function( error, data ) {
			Dispatcher.handleServerAction( {
				type: 'REMOVE_MEDIA_ITEM',
				error: error,
				pageId: pageId,
				data: data,
			} );
			// also refetch storage limits
			Dispatcher.handleServerAction( {
				type: 'FETCH_MEDIA_LIMITS',
				pageId: pageId,
			} );
		} );
};

MediaActions.setLibrarySelectedItems = function( pageId, items ) {
	debug( 'Setting selected items for %d as %o', pageId, items );
	Dispatcher.handleViewAction( {
		type: 'SET_MEDIA_LIBRARY_SELECTED_ITEMS',
		pageId: pageId,
		data: items,
	} );
};

MediaActions.clearValidationErrors = function( pageId, itemId ) {
	debug( 'Clearing validation errors for %d, with item ID %d', pageId, itemId );
	Dispatcher.handleViewAction( {
		type: 'CLEAR_MEDIA_VALIDATION_ERRORS',
		pageId: pageId,
		itemId: itemId,
	} );
};

MediaActions.clearValidationErrorsByType = function( pageId, type ) {
	debug( 'Clearing validation errors for %d, by type %s', pageId, type );
	Dispatcher.handleViewAction( {
		type: 'CLEAR_MEDIA_VALIDATION_ERRORS',
		pageId: pageId,
		errorType: type,
	} );
};

MediaActions.sourceChanged = function( pageId ) {
	debug( 'Media data source changed' );
	Dispatcher.handleViewAction( {
		type: 'CHANGE_MEDIA_SOURCE',
		pageId,
	} );
};

export default MediaActions;
