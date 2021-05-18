import {combineReducers} from 'redux';

import { ON_PREVENT_SEND_MESSAGE } from 'state/action-types';

function preventSendMessage(state = true, action) {
    switch (action.type) {
    case ON_PREVENT_SEND_MESSAGE:
        return action.reason;
    default:
        return state;
    }
}

export default combineReducers({
    preventSendMessage,
});