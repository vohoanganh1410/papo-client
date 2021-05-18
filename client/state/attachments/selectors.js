import { get } from 'lodash';

export function getAttachmentItem( state, id ) {
	return get( state.attachments.facebookAttachments, id );
}

export function getAttachmentTargetItem( state, id ) {
	return get( state.attachments.facebookAttachmentTargets, id );
}

export function getFacebookMessageAttachmens( state, scopedMessageId ) {
	return get( state.attachments.facebookMessageAttachments, scopedMessageId );
}

export function getFacebookCommentAttachment( state, commentId ) {
	return get( state.attachments.facebookCommentAttachments, commentId );
}
