/** @format */

/**
 * External dependencies
 */

import { isEmpty, mapValues, pickBy, without } from 'lodash';

/**
 * Internal dependencies
 */
import Dispatcher from 'dispatcher';
import emitter from 'lib/mixins/emitter';
import * as MediaUtils from './utils';
import { ValidationErrors as MediaValidationErrors } from './constants';

/**
 * Module variables
 */
const MediaValidationStore = {
	_errors: {},
};
const ERROR_GLOBAL_ITEM_ID = 0;

/**
 * Errors are represented as an object, mapping a site to an object of items
 * where errors exist. Each site's item errors are reflected as an array of
 * constant error types.
 *
 * {
 *     [ pageId ]: {
 *         [ itemId ]: [
 *             MediaValidationErrors.FILE_TYPE_UNSUPPORTED,
 *             MediaValidationErrors.EXCEEDS_MAX_UPLOAD_SIZE
 *         ]
 *     }
 * }
 *
 * @type {Object}
 * @private
 */

emitter( MediaValidationStore );

function ensureErrorsObjectForSite( pageId ) {
	if ( pageId in MediaValidationStore._errors ) {
		return;
	}

	MediaValidationStore._errors[ pageId ] = {};
}

const isExternalError = message => message.error && message.error === 'servicefail';
const isMediaError = action => action.error && ( action.id || isExternalError( action.error ) );

MediaValidationStore.validateItem = function( site, item ) {
	const itemErrors = [];

	if ( ! site ) {
		return;
	}

	if ( ! MediaUtils.isSupportedFileTypeForSite( item, site ) ) {
		if ( MediaUtils.isSupportedFileTypeInPremium( item, site ) ) {
			itemErrors.push( MediaValidationErrors.FILE_TYPE_NOT_IN_PLAN );
		} else {
			itemErrors.push( MediaValidationErrors.FILE_TYPE_UNSUPPORTED );
		}
	}

	if ( true === MediaUtils.isExceedingSiteMaxUploadSize( item, site ) ) {
		itemErrors.push( MediaValidationErrors.EXCEEDS_MAX_UPLOAD_SIZE );
	}

	if ( itemErrors.length ) {
		ensureErrorsObjectForSite( site.id );
		MediaValidationStore._errors[ site.id ][ item.id ] = itemErrors;
	}
};

MediaValidationStore.clearValidationErrors = function( pageId, itemId ) {
	if ( ! ( pageId in MediaValidationStore._errors ) ) {
		return;
	}

	if ( itemId ) {
		delete MediaValidationStore._errors[ pageId ][ itemId ];
	} else {
		delete MediaValidationStore._errors[ pageId ];
	}
};

/**
 * Update the errors object for a site by picking only items where errors still
 * exist after excluding all errors for that item matching the specified type.
 *
 * @param {Number}               pageId    The site ID
 * @param {MediaValidationError} errorType The error type to remove
 */
MediaValidationStore.clearValidationErrorsByType = function( pageId, errorType ) {
	if ( ! ( pageId in MediaValidationStore._errors ) ) {
		return;
	}

	MediaValidationStore._errors[ pageId ] = pickBy(
		mapValues( MediaValidationStore._errors[ pageId ], errors => without( errors, errorType ) ),
		errors => ! isEmpty( errors )
	);
};

function receiveServerError( pageId, itemId, errors ) {
	ensureErrorsObjectForSite( pageId );

	MediaValidationStore._errors[ pageId ][ itemId ] = errors.map( error => {
		switch ( error.error ) {
			case 'http_404':
				return MediaValidationErrors.UPLOAD_VIA_URL_404;
			case 'upload_error':
				if ( error.message.indexOf( 'Not enough space to upload' ) === 0 ) {
					return MediaValidationErrors.NOT_ENOUGH_SPACE;
				}
				if ( error.message.indexOf( 'You have used your space quota' ) === 0 ) {
					return MediaValidationErrors.EXCEEDS_PLAN_STORAGE_LIMIT;
				}
				return MediaValidationErrors.SERVER_ERROR;
			case 'servicefail':
				return MediaValidationErrors.SERVICE_FAILED;
			default:
				return MediaValidationErrors.SERVER_ERROR;
		}
	} );
}

MediaValidationStore.getAllErrors = function( pageId ) {
	return MediaValidationStore._errors[ pageId ] || {};
};

MediaValidationStore.getErrors = function( pageId, itemId ) {
	if ( ! ( pageId in MediaValidationStore._errors ) ) {
		return [];
	}

	return MediaValidationStore._errors[ pageId ][ itemId ] || [];
};

MediaValidationStore.hasErrors = function( pageId, itemId ) {
	if ( itemId ) {
		return MediaValidationStore.getErrors( pageId, itemId ).length;
	}

	return Object.keys( MediaValidationStore.getAllErrors( pageId ) ).length;
};

MediaValidationStore.dispatchToken = Dispatcher.register( function( payload ) {
	var action = payload.action,
		items,
		errors;

	switch ( action.type ) {
		case 'CREATE_MEDIA_ITEM':
			if ( ! action.pageId || ! action.data ) {
				break;
			}

			items = Array.isArray( action.data ) ? action.data : [ action.data ];
			errors = items.reduce( function( memo, item ) {
				var itemErrors;

				MediaValidationStore.validateItem( action.page, item );

				itemErrors = MediaValidationStore.getErrors( action.pageId, item.id );
				if ( itemErrors.length ) {
					memo[ item.id ] = itemErrors;
				}

				return memo;
			}, {} );

			if ( errors && Object.keys( errors ).length ) {
				action.error = MediaValidationStore.getAllErrors( action.pageId );
				MediaValidationStore.emit( 'change' );
			}
			break;

		case 'RECEIVE_MEDIA_ITEM':
		case 'RECEIVE_MEDIA_ITEMS':
			// Track any errors which occurred during upload or getting external media
			if ( ! isMediaError( action ) ) {
				break;
			}

			if ( Array.isArray( action.error.errors ) ) {
				errors = action.error.errors;
			} else {
				errors = [ action.error ];
			}

			receiveServerError( action.pageId, action.id ? action.id : ERROR_GLOBAL_ITEM_ID, errors );
			MediaValidationStore.emit( 'change' );
			break;

		case 'CHANGE_MEDIA_SOURCE':
		case 'CLEAR_MEDIA_VALIDATION_ERRORS':
			if ( ! action.pageId ) {
				break;
			}

			if ( action.errorType ) {
				MediaValidationStore.clearValidationErrorsByType( action.pageId, action.errorType );
			} else {
				MediaValidationStore.clearValidationErrors( action.pageId, action.itemId );
			}

			MediaValidationStore.emit( 'change' );
			break;
	}
} );

export default MediaValidationStore;
