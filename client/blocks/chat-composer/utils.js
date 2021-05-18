import * as Utils from 'lib/utils';
import {isMobile} from 'lib/user-agent';
import { Constants } from 'lib/key-codes';
const KeyCodes = Constants.KeyCodes;

function canAutomaticallyCloseBackticks(message) {
    const splitMessage = message.split('\n').filter((line) => line.trim() !== '');
    const lastPart = splitMessage[splitMessage.length - 1];

    if (splitMessage.length > 1 && !lastPart.includes('```')) {
        return {
            allowSending: true,
            message: message.endsWith('\n') ? message.concat('```') : message.concat('\n```'),
            withClosedCodeBlock: true,
        };
    }

    return {allowSending: true};
}

function sendOnCtrlEnter(message, ctrlOrMetaKeyPressed, isSendMessageOnCtrlEnter) {
    const match = message.match(Constants.TRIPLE_BACK_TICKS);
    if (isSendMessageOnCtrlEnter && ctrlOrMetaKeyPressed && (!match || match.length % 2 === 0)) {
        return {allowSending: true};
    } else if (!isSendMessageOnCtrlEnter && (!match || match.length % 2 === 0)) {
        return {allowSending: true};
    } else if (ctrlOrMetaKeyPressed && match && match.length % 2 !== 0) {
        return canAutomaticallyCloseBackticks(message);
    }

    return {allowSending: false};
}

export function postMessageOnKeyPress(event, message, sendMessageOnCtrlEnter, sendCodeBlockOnCtrlEnter) {
    if (
        !event ||
        isMobile() ||
        !Utils.isKeyPressed(event, Constants.KeyCodes.ENTER) ||
        event.shiftKey ||
        event.altKey
    ) {
        return {allowSending: false};
    }

    if (
        message.trim() === '' ||
        !(sendMessageOnCtrlEnter || sendCodeBlockOnCtrlEnter)
    ) {
        return {allowSending: true};
    }

    const ctrlOrMetaKeyPressed = event.ctrlKey || event.metaKey;

    if (sendMessageOnCtrlEnter) {
        return sendOnCtrlEnter(message, ctrlOrMetaKeyPressed, true);
    } else if (sendCodeBlockOnCtrlEnter) {
        return sendOnCtrlEnter(message, ctrlOrMetaKeyPressed, false);
    }

    return {allowSending: false};
}