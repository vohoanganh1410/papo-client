import { Client1 } from 'lib/client1';
import Dispatcher from 'dispatcher';
import EventTypes from 'utils/event-types';

import { UPDATE_COMPOSER_SUGGESTION_DISPLAY } from 'state/action-types';
import { PreferenceTypes } from 'action-types';

export const updateUserSelectedPages = ( userId, preferences ) => dispatch => {
	return Client1.savePreferences( userId, preferences )
		.then( () => {
			Dispatcher.handleViewAction( {
				type: EventTypes.SET_SELECTED_PAGES_SUCCESS,
				value: true,
			} );
		} )
		.catch( error => {
			console.log( error );
		} );
};

export const updateComposerSuggestionDisplay = ( userId, preferences ) => dispatch => {
	return Client1.savePreferences( userId, preferences )
		.then( preference => {
			// server response: status: "OK"
			dispatch( {
				type: UPDATE_COMPOSER_SUGGESTION_DISPLAY,
				data: preferences,
			} );
		} )
		.catch( error => {
			console.log( error );
		} );
};

export const savePreferences = ( userId, preferences ) => async dispatch => {
	dispatch( {
		type: PreferenceTypes.RECEIVED_PREFERENCES,
		data: preferences,
		meta: {
			offline: {
				effect: () => Client1.savePreferences( userId, preferences ),
				commit: {
					type: PreferenceTypes.RECEIVED_PREFERENCES,
				},
				rollback: {
					type: PreferenceTypes.DELETED_PREFERENCES,
					data: preferences,
				},
			},
		},
	} );

	return { data: true };
};
