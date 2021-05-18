import Dispatcher from 'dispatcher';
import EventTypes from 'utils/event-types';

export function clearSnipetCreateForm() {
    Dispatcher.handleViewAction({
        type: EventTypes.CLEAR_SNIPPET_CREATE_FORM,
        value: true,
    });
}