import EventEmitter from 'events';

import Dispatcher from 'dispatcher';
import EventTypes from 'utils/event-types';

class GlobalEventEmitterClass extends EventEmitter {
	constructor() {
		super();
		this.dispatchToken = Dispatcher.register( this.handleEventPayload );
	}

	handleEventPayload = payload => {
		const { type, value, ...args } = payload.action; // eslint-disable-line no-use-before-define

		switch ( type ) {
			case EventTypes.MESSAGE_LIST_SCROLL_CHANGE:
			case EventTypes.CLEAR_SNIPPET_CREATE_FORM:
			case EventTypes.CLEAR_AUTO_MESSAGE_TASK_CREATE_FORM:
			case EventTypes.CREATE_PAGE_TAG_SUCCESS:
			case EventTypes.CONVERSATION_MESSAGES_LOADED:
			case EventTypes.CONVERSATION_MESSAGES_MORE_LOADED:
			case EventTypes.SET_SELECTED_PAGES_SUCCESS:
			case EventTypes.CONVERSATIONS_LOADED:
			case EventTypes.UPDATE_COMPOSER_SUGGESTION_DISPLAY:
			case EventTypes.PENDING_MESSAGE_SUBMITED:
			case EventTypes.CONVERSATION_NOTE_CREATED:
			case EventTypes.TEAM_CREATE_STATUS:
			case EventTypes.CREATE_TEAM_ROLE_SUCCESS:
			case EventTypes.UPDATE_TEAM_ROLE_SUCCESS:
			case EventTypes.LOADED_FILE_INFOS_SUCCESS:
			case EventTypes.LOADED_MORE_FILE_INFOS_SUCCESS:
				this.emit( type, value, args );
				break;
		}
	};
}

const GlobalEventEmitter = new GlobalEventEmitterClass();
export default GlobalEventEmitter;
