/** @format */

/**
 * External dependencies
 */
import { reduce } from 'lodash';

/**
 * Internal dependencies
 */
import { combineReducers, createReducer } from 'state/utils';
import { PageTypes, FileTypes } from 'action-types';

export const _data = createReducer(
	{},
	{
		[ PageTypes.RECEIVED_PAGE_FILES_INFO ]: ( state, { data, page_id } ) => {
			const filesByPageId = reduce(
				data,
				( memo, file ) => {
					return Object.assign( memo, {
						[ file.page_id ]: [ ...( memo[ file.page_id ] || [] ), file ],
					} );
				},
				{}
			);

			if ( ! state[ page_id ] ) {
				return reduce(
					filesByPageId,
					( memo, pageFiles, pageId ) => {
						return {
							...state,
							[ pageId ]: pageFiles,
						};
					},
					state
				);
			}

			return reduce(
				filesByPageId,
				( memo, pageFiles, pageId ) => {
					return {
						[ pageId ]: [ ...state[ pageId ].concat( pageFiles ) ],
					};
				},
				state
			);
		},
		[ PageTypes.RECEIVED_MORE_PAGE_FILES_INFO ]: ( state, { data, page_id } ) => {
			const filesByPageId = reduce(
				data,
				( memo, file ) => {
					return Object.assign( memo, {
						[ file.page_id ]: [ ...( memo[ file.page_id ] || [] ), file ],
					} );
				},
				{}
			);

			if ( ! state[ page_id ] ) {
				return reduce(
					filesByPageId,
					( memo, pageFiles, pageId ) => {
						return {
							...state,
							[ pageId ]: pageFiles,
						};
					},
					state
				);
			}

			return reduce(
				filesByPageId,
				( memo, pageFiles, pageId ) => {
					return {
						[ pageId ]: [ ...state[ pageId ].concat( pageFiles ) ],
					};
				},
				state
			);
		},
		[ FileTypes.RECEIVED_UPLOAD_FILES ]: ( state, { fileInfos, pageId } ) => {
			console.log( 'pageId', pageId );
			const filesByPageId = reduce(
				fileInfos,
				( memo, file ) => {
					return Object.assign( memo, {
						[ file.page_id ]: [ ...( memo[ file.page_id ] || [] ), file ],
					} );
				},
				{}
			);

			if ( ! state[ pageId ] ) {
				return reduce(
					filesByPageId,
					( memo, pageFiles, _pageId ) => {
						return {
							...state,
							[ _pageId ]: pageFiles,
						};
					},
					state
				);
			}

			return reduce(
				filesByPageId,
				( memo, pageFiles, _pageId ) => {
					return {
						[ _pageId ]: [ ...state[ _pageId ].concat( pageFiles ) ],
					};
				},
				state
			);
		},
	}
);

export const loadStatus = createReducer(
	{},
	{
		[ PageTypes.REQUEST_PAGE_FILES_INFO ]: ( state, { page_id } ) => {
			return {
				...state,
				[ page_id ]: {
					isLoading: true,
				},
			};
		},
		[ PageTypes.REQUEST_PAGE_FILE_INFOS_SUCCESS ]: ( state, { page_id } ) => {
			return {
				...state,
				[ page_id ]: {
					isLoading: false,
					success: true,
				},
			};
		},
		[ PageTypes.REQUEST_PAGE_FILES_INFO_ERROR ]: ( state, { page_id, error } ) => {
			return {
				...state,
				[ page_id ]: {
					isLoading: false,
					success: false,
					error: error,
				},
			};
		},
	}
);

export default combineReducers( {
	data: _data,
	loadStatus,
} );
