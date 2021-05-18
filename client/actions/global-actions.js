import page from 'page';

import { browserHistory } from 'utils/browser-history';
import { Client1 } from 'lib/client1';
import { logout } from './users';
import * as WebSocketActions from 'actions/websocket';
import { clearUserCookie } from 'lib/client1/cookie';
import { GeneralTypes } from 'action-types';

export function emitUserLoggedOutEvent(
	redirectTo = '/',
	shouldSignalLogout = true,
	userAction = true
) {
	// If the logout was intentional, discard knowledge about having previously been logged in.
	// This bit is otherwise used to detect session expirations on the login page.
	// if (userAction) {
	// 	LocalStorageStore.setWasLoggedIn(false);
	// }

	logout()
		.then( () => {
			// if (shouldSignalLogout) {
			// 	BrowserStore.signalLogout();
			// }

			// BrowserStore.clear();
			// stopPeriodicStatusUpdates();
			WebSocketActions.close();

			clearUserCookie();

			page( redirectTo );

			// browserHistory.push(redirectTo);
		} )
		.catch( () => {
			browserHistory.push( redirectTo );
		} );
}

export function loadTranslations( locale, url ) {
	// console.log('url', url);
	return dispatch => {
		Client1.getTranslations( url )
			.then( translations => {
				dispatch( {
					type: GeneralTypes.RECEIVED_TRANSLATIONS,
					data: {
						locale,
						translations,
					},
				} );
			} )
			.catch( () => {} ); // eslint-disable-line no-empty-function
	};
}
