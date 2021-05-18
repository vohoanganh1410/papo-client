import { Client1 } from 'lib/client1';
import {
	REQUEST_PERMISSIONS,
	RECEIVED_PERMISSIONS,
	REQUEST_PERMISSIONS_FAILURED,
} from 'state/action-types';

export const requestPermissions = () => dispatch => {
	dispatch( {
		type: REQUEST_PERMISSIONS,
	} );

	return Client1.fetchPermissions()
		.then( permissions => {
			dispatch( {
				type: RECEIVED_PERMISSIONS,
				permissions,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: REQUEST_PERMISSIONS_FAILURED,
				error,
			} );
		} );
};
