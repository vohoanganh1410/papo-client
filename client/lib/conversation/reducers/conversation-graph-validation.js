/** @format */

/**
 * External dependencies
 */

import { fromJS } from 'immutable';

/**
 * Internal dependencies
 */
import { action as ActionTypes } from 'lib/conversation/constants';

const initialState = fromJS( {
	errors: {},
	success: {}
} );

const reducer = ( state = initialState, payload ) => {
	const { action } = payload;
	// console.log( action );
	switch ( action.type ) {
		case ActionTypes.RECEIVE_CONVERSATION_GRAPH_ERROR:
			return state
				.setIn( [ 'errors', "message" ], action.error.message  );
	}
	return state;
};

export { initialState, reducer };
