/** @format */

/**
 * Internal dependencies
 */

import { CONNECTION_LOST, CONNECTION_RESTORED } from 'state/action-types';

import { successNotice, removeNotice, errorNotice } from 'state/notices/actions';

export function connectionLost( noticeText ) {
	return dispatch => {
		dispatch( removeNotice( 'connectionRestored' ) );
		dispatch(
			errorNotice( noticeText, {
				showDismiss: true,
				isPersistent: true,
				id: 'connectionLost',
			} )
		);
		dispatch( { type: CONNECTION_LOST } );
	};
}

export function connectionRestored( noticeText ) {
	return dispatch => {
		dispatch( removeNotice( 'connectionLost' ) );
		dispatch(
			successNotice( noticeText, {
				showDismiss: true,
				isPersistent: true,
				id: 'connectionRestored',
			} )
		);
		dispatch( { type: CONNECTION_RESTORED } );
	};
}
