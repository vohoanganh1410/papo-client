import Dispatcher from 'dispatcher';
import EventTypes from 'utils/event-types';

export function messageListScrollChangeToBottom() {
    Dispatcher.handleViewAction({
        type: EventTypes.MESSAGE_LIST_SCROLL_CHANGE,
        value: true,
    });
}