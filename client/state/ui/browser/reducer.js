import {combineReducers} from 'redux';

import EventTypes from 'utils/event-types';

function focused(state = true, action) {
    switch (action.type) {
    case EventTypes.BROWSER_CHANGE_FOCUS:
        return action.focus;
    default:
        return state;
    }
}

export default combineReducers({
    focused,
});