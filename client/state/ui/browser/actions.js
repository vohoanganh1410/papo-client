
import EventTypes from 'utils/event-types';

export function emitBrowserFocus(focus) {
   	return {
   		type: EventTypes.BROWSER_CHANGE_FOCUS,
        focus,
   	}
}