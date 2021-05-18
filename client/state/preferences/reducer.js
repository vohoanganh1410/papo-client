import { reduce } from 'lodash';

import {
	REQUEST_PREFERENCES,
	REQUEST_PREFERENCES_SUCCESS,
	REQUEST_PREFERENCES_FAILURED,
	RECEIVED_PREFERENCES,
	UPDATE_COMPOSER_SUGGESTION_DISPLAY,
} from 'state/action-types';
// import { combineReducers, createReducer } from 'state/utils';

// export const items = createReducer(
// 	{},
// 	{
// 		[ RECEIVED_PREFERENCES ]: ( state, { preferences } ) => {
// 			return reduce(
// 				preferences,
// 				( memo, preference ) => {
// 					const { category } = preference;

// 					if ( memo === state ) {
// 						memo = { ...memo };
// 					}

// 					memo[ category ] = preference;
// 					return memo;
// 				},
// 				state
// 			);
// 		}
// 	}
// );

// export default combineReducers( {
// 	items,
// } );

export default function( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVED_PREFERENCES:
			const preferences = action.preferences;
			return reduce(
				preferences,
				( memo, preference ) => {
					const { category } = preference;

					if ( memo === state ) {
						memo = { ...memo };
					}

					memo[ category ] = preference;
					return memo;
				},
				state
			);
		case UPDATE_COMPOSER_SUGGESTION_DISPLAY:
			const updated = action.data;
			return reduce(
				updated,
				( memo, preference ) => {
					const { category } = preference;

					if ( memo === state ) {
						memo = { ...memo };
					}

					memo[ category ] = preference;
					return memo;
				},
				state
			);
			// return state;
	}

	return state;
}
