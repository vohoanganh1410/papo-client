import { ON_PREVENT_SEND_MESSAGE } from 'state/action-types';

export function onPreventSendMessage( reason = null ) {
	return {
		type: ON_PREVENT_SEND_MESSAGE,
		reason,
	};
}
