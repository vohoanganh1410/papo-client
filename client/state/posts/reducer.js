import { combineReducers, createReducer } from 'state/utils';
import { PostTypes } from 'action-types';

export const items = createReducer(
	{},
	{
		[ PostTypes.RECEIVED_PAGE_POST ]: ( state, { postId, post } ) => {
			return {
				...state,
				[ postId ]: post,
			};
		},
	}
);

export default combineReducers( {
	items,
} );
