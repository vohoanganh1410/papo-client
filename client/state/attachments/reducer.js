import { reduce, isEmpty } from 'lodash';

import { combineReducers, createReducer } from 'state/utils';

import { AttachmentTypes, ConversationTypes } from 'action-types';

export const facebookAttachments = createReducer(
	{},
	{
		[ AttachmentTypes.RECEIVED_FACEBOOK_ATTACHMENTS ]: ( state, { attachments } ) => {
			if ( ! attachments || attachments.length === 0 ) return state;

			return reduce(
				attachments,
				( memo, attachment ) => {
					const { id } = attachment;

					if ( memo === state ) {
						memo = { ...memo };
					}

					memo[ id ] = attachment;
					return memo;
				},
				state
			);
		},
	}
);

export const facebookAttachmentTargets = createReducer(
	{},
	{
		[ AttachmentTypes.RECEIVED_FACEBOOK_ATTACHMENT_TARGET ]: ( state, { attachment } ) => {
			if ( ! attachment || isEmpty( attachment ) ) return state;

			return {
				...state,
				[ attachment.id ]: attachment,
			};
		},
	}
);

export const facebookMessageAttachments = createReducer(
	{},
	{
		[ ConversationTypes.RECEIVE_MESSAGE_ATTACHMENTS ]: (
			state,
			{ attachments, messageAppScopedId }
		) => {
			if (
				! attachments ||
				attachments.length === 0 ||
				! messageAppScopedId ||
				messageAppScopedId.length === 0
			)
				return state;
			return {
				...state,
				[ messageAppScopedId ]: attachments,
			};
		},
	}
);

export const facebookCommentAttachments = createReducer(
	{},
	{
		[ ConversationTypes.RECEIVE_COMMENT_ATTACHMENTS ]: ( state, { attachment, commentId } ) => {
			if ( ! attachment || ! commentId || commentId.length === 0 ) return state;
			return {
				...state,
				[ commentId ]: attachment,
			};
		},
	}
);

export default combineReducers( {
	facebookAttachments,
	facebookAttachmentTargets,
	facebookMessageAttachments,
	facebookCommentAttachments,
} );
