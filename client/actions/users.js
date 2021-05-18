import { batchActions } from 'redux-batched-actions';

import { Client1 } from 'lib/client1';
import { UserTypes } from 'action-types';

export async function logout() {
	try {
		await Client1.logout();
	} catch ( error ) {
		// nothing to do here
	}

	return { data: true };
}

export function getUserById( userId ) {
	return new Promise( ( resolve, reject ) => {
		Client1.getUserById( userId )
			.then( user => {
				resolve( user );
			} )
			.catch( error => reject( error ) );
	} );
}

export function updateMe( user ) {
	return async ( dispatch, getState ) => {
		dispatch( { type: UserTypes.UPDATE_ME_REQUEST, data: null }, getState );

		let data;
		try {
			data = await Client1.patchMe( user );
		} catch ( error ) {
			dispatch( batchActions( [ { type: UserTypes.UPDATE_ME_FAILURE, error } ] ), getState );
			return { error };
		}

		dispatch( { type: UserTypes.RECEIVED_ME, data } );
		// dispatch(loadRolesIfNeeded(data.roles.split(' ')));

		return { data };
	};
}

export function updateLocale( user ) {
	return async ( dispatch, getState ) => {
		dispatch( { type: UserTypes.UPDATE_ME_REQUEST, data: null }, getState );

		let data;
		try {
			data = await Client1.updateLocale( user );
		} catch ( error ) {
			dispatch( batchActions( [ { type: UserTypes.UPDATE_ME_FAILURE, error } ] ), getState );
			return { error };
		}

		dispatch( { type: UserTypes.RECEIVED_ME_LOCALE, locale: user.locale } );
		// dispatch(loadRolesIfNeeded(data.roles.split(' ')));

		return { data };
	};
}
