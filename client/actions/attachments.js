import { includes } from 'lodash';

import { Client1 } from 'lib/client1';
import { AttachmentTypes } from 'action-types';

export const requestFacebookAttachments = ids => ( dispatch, getState ) => {
	const state = getState();

	const needFetchIds = [];

	ids.map( id => {
		if ( ! ( id in state.attachments.facebookAttachments ) && ! includes( needFetchIds, id ) ) {
			needFetchIds.push( id );
		}
	} );

	if ( needFetchIds.length === 0 ) return;

	return Client1.fetchFacebookAttachmentsByIds( needFetchIds )
		.then( attachments => {
			dispatch( {
				type: AttachmentTypes.RECEIVED_FACEBOOK_ATTACHMENTS,
				attachments,
			} );
		} )
		.catch( error => {
			console.log( 'error', error );
		} );
};

export const requestFacebookAttachmentTargets = ( ids, type ) => ( dispatch, getState ) => {
	const state = getState();

	const needFetchIds = [];

	ids.map( id => {
		if (
			! ( id in state.attachments.facebookAttachmentTargets ) &&
			! includes( needFetchIds, id )
		) {
			needFetchIds.push( id );
		}
	} );

	if ( needFetchIds.length === 0 ) return;

	return Client1.fetchFacebookAttachmentTargetsByIds( needFetchIds, type )
		.then( attachment => {
			// console.log('attachment', attachment);
			dispatch( {
				type: AttachmentTypes.RECEIVED_FACEBOOK_ATTACHMENT_TARGET,
				attachment,
			} );
		} )
		.catch( error => {
			console.log( 'error', error );
		} );
};
