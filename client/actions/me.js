import { Client1 } from 'lib/client1';
import {
	REQUEST_PREFERENCES,
	REQUEST_PREFERENCES_SUCCESS,
	REQUEST_PREFERENCES_FAILURED,
	RECEIVED_PREFERENCES,
} from 'state/action-types';

export const getPreferences = () => dispatch => {
	dispatch( {
		type: REQUEST_PREFERENCES,
	} );

	return Client1.getMyPreferences()
		.then( preferences => {
			dispatch( {
				type: REQUEST_PREFERENCES_SUCCESS,
			} );
			dispatch( {
				type: RECEIVED_PREFERENCES,
				preferences,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: REQUEST_PREFERENCES_FAILURED,
				error,
			} );
		} );
};
