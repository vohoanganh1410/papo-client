import { reduce } from 'lodash';

import { combineReducers, createReducer } from 'state/utils';

import { FacebookUserTypes } from 'action-types';

export const data = createReducer(
	{},
	{
		[ FacebookUserTypes.RECEIVED_FACEBOOK_USERS ]: ( state, { users } ) => {
			if ( ! users || users.length === 0 ) return state;

			return reduce(
				users,
				( memo, user ) => {
					const { id } = user;

					if ( memo === state ) {
						memo = { ...memo };
					}

					memo[ id ] = user;
					return memo;
				},
				state
			);
		},
	}
);

export default combineReducers( {
	data,
} );
