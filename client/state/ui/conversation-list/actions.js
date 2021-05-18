import {
	CONVERSATION_LIST_SELECTION_TOGGLE,
} from 'state/action-types';

export function toggleConversationSelection( conversation_id ) {
	return {
		type: CONVERSATION_LIST_SELECTION_TOGGLE,
		conversation_id,
	};
}