// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { batchActions } from 'redux-batched-actions';
import request from 'superagent';
import { FileTypes } from 'action-types';
// import {getLogErrorAction} from 'mattermost-redux/actions/errors';
// import {forceLogoutIfNecessary} from 'mattermost-redux/actions/helpers';
import { Client1 } from 'lib/client1';

import * as Utils from 'utils/utils';

export function uploadFile( file, name, pageId, rootId, clientId ) {
	console.log(
		"Client1.getOptions({method: 'post'}).headers",
		Client1.getOptions( { method: 'post' } ).headers
	);
	return dispatch => {
		dispatch( { type: FileTypes.UPLOAD_FILES_REQUEST } );

		return request
			.post( Client1.getFilesRoute() )
			.withCredentials()
			.set( Client1.getOptions( { method: 'post' } ).headers )
			.attach( 'files', file, name )
			.field( 'page_id', pageId )
			.field( 'client_ids', clientId )
			.accept( 'application/json' );
	};
}

export const receiveFilesUpload = ( fileInfos, pageId ) => dispatch => {
	dispatch( {
		type: FileTypes.RECEIVED_UPLOAD_FILES,
		fileInfos,
		pageId,
	} );
};

export function handleFileUploadEnd( file, name, channelId, rootId, clientId, { err, res } ) {
	return ( dispatch, getState ) => {
		if ( err ) {
			let e;
			if ( res && res.body && res.body.id ) {
				e = res.body;
			} else if ( err.status === 0 || ! err.status ) {
				e = {
					message: Utils.localizeMessage(
						'channel_loader.connection_error',
						'There appears to be a problem with your internet connection.'
					),
				};
			} else {
				e = {
					message:
						Utils.localizeMessage(
							'channel_loader.unknown_error',
							'We received an unexpected status code from the server.'
						) +
						' (' +
						err.status +
						')',
				};
			}

			// forceLogoutIfNecessary(err, dispatch, getState);

			const failure = {
				type: FileTypes.UPLOAD_FILES_FAILURE,
				clientIds: [ clientId ],
				channelId,
				rootId,
				error: err,
			};

			// dispatch(batchActions([failure, getLogErrorAction(err)]));
			return { error: e };
		}
		const data = res.body.file_infos.map( ( fileInfo, index ) => {
			return {
				...fileInfo,
				clientId: res.body.client_ids[ index ],
			};
		} );

		dispatch(
			batchActions( [
				{
					type: FileTypes.RECEIVED_UPLOAD_FILES,
					data,
					channelId,
					rootId,
				},
				{
					type: FileTypes.UPLOAD_FILES_SUCCESS,
				},
			] )
		);

		return { data: res.body };
	};
}
