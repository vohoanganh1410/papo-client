import { CHANGE_SELECTED_CONVERSATION, ON_SWITCH_PAGE } from 'state/action-types';
import { createReducer } from 'state/utils';

export const conversationList = createReducer( null, {
	[ CHANGE_SELECTED_CONVERSATION ]: ( state, { current_selected, previous_selected } ) => {
		return {
			...state,
			selectedConversation: current_selected,
			previousSelected: previous_selected,
		};
	},
	[ ON_SWITCH_PAGE ]: state => {
		return {
			...state,
			selectedConversation: null,
			previousSelected: null,
		};
	},
} );

export default conversationList;
