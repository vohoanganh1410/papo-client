/** @format */
/**
 * External dependencies
 */
import { translate } from 'i18n-calypso';
import { get, forEach } from 'lodash';

/**
 * Internal dependencies
 */
import { successNotice, errorNotice, infoNotice } from 'state/notices/actions';
import {
	CREATE_PAGE_SNIPPET_SUCCESS,
	CREATE_PAGE_SNIPPET_FAILURED,
	CREATE_AUTO_MESSAGE_TASK_SUCCESS,
	CREATE_AUTO_MESSAGE_TASK_FAILURED,
	ADD_NEW_PAGE_TAG_SUCCESS,
	ADD_NEW_PAGE_TAG_FAILURED,
	ON_PREVENT_SEND_MESSAGE,
	TEAM_ROLE_CREATED,
	CREATE_TEAM_ROLE_FAILURED,
	TEAM_ROLE_UPDATED,
	UPDATE_TEAM_ROLE_FAILURED,
	REPLY_FACEBOOK_COMMENT_FAILED,
	RECEIVED_PAGE_INIT_VALIDATION,
	RECEIVED_PAGE_INIT_VALUE,
} from 'state/action-types';

// import { purchasesRoot } from 'me/purchases/paths';
import { dispatchSuccess, dispatchError } from './utils';
import { localizeMessage } from 'utils/utils';
import { TeamTypes } from 'action-types';

/**
 * Handler action type mapping
 */

export const handlers = {
	[ CREATE_PAGE_SNIPPET_SUCCESS ]: dispatchSuccess( translate( 'Thêm mẫu câu thành công' ), {
		duration: 3000,
	} ),
	[ CREATE_PAGE_SNIPPET_FAILURED ]: ( dispatch, action ) => {
		dispatch(
			errorNotice( action.error.message || 'Đã có lỗi xảy ra, không thể lưu mẫu câu trả lời.', {
				duration: 3000,
			} )
		);
	},
	[ CREATE_AUTO_MESSAGE_TASK_SUCCESS ]: dispatchSuccess( translate( 'Tạo chiến dịch thành công' ), {
		duration: 3000,
	} ),
	[ CREATE_AUTO_MESSAGE_TASK_FAILURED ]: ( dispatch, action ) => {
		dispatch(
			errorNotice( action.error.message || 'Đã có lỗi xảy ra, không thể tạo chiến dịch.', {
				duration: 3000,
			} )
		);
	},

	[ ADD_NEW_PAGE_TAG_SUCCESS ]: dispatchSuccess(
		localizeMessage( 'conversations.create_tag_success_notice' ),
		{
			duration: 3000,
		}
	),
	[ ADD_NEW_PAGE_TAG_FAILURED ]: ( dispatch, action ) => {
		dispatch(
			errorNotice( action.error.message || 'Đã có lỗi xảy ra, không thể tạo nhãn.', {
				duration: 3000,
			} )
		);
	},
	[ ON_PREVENT_SEND_MESSAGE ]: ( dispatch, action ) => {
		dispatch(
			errorNotice( action.reason.text || 'Đã có lỗi xảy ra, không thể gửi tin nhắn.', {
				duration: 3000,
			} )
		);
	},

	[ TEAM_ROLE_CREATED ]: dispatchSuccess( translate( 'Tạo vai trò thành công' ), {
		duration: 3000,
	} ),
	[ TEAM_ROLE_UPDATED ]: dispatchSuccess( translate( 'Cập nhật vai trò thành công' ), {
		duration: 3000,
	} ),

	[ CREATE_TEAM_ROLE_FAILURED ]: ( dispatch, action ) => {
		dispatch( errorNotice( action.error.message || 'Đã có lỗi xảy ra khi tạo vai trò' ) );
	},

	[ UPDATE_TEAM_ROLE_FAILURED ]: ( dispatch, action ) => {
		dispatch( errorNotice( action.error.message || 'Đã có lỗi xảy ra khi cập nhật vai trò' ) );
	},
	[ REPLY_FACEBOOK_COMMENT_FAILED ]: ( dispatch, action ) => {
		dispatch( errorNotice( action.error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.' ) );
	},
	[ RECEIVED_PAGE_INIT_VALIDATION ]: ( dispatch, { data } ) => {
		const result = data.result && data.result.Data;
		if ( result ) {
			if ( result.success && result.success.length > 0 ) {
				dispatch(
					infoNotice(
						'Papo initializing your ' +
							result.success.length +
							' pages. You can still access your pages while initializing in progress. The initialize process will graph you page comments and messages based on the permissions that you have grant to Papo.'
					)
				);
			}

			if ( result.error && result.error.length > 0 ) {
				forEach( result.error, err => {
					dispatch(
						errorNotice( err.id + ': Lỗi! ' + err.message || 'Không thể khởi tạo trang.' )
					);
				} );
			}
		}
	},
	[ RECEIVED_PAGE_INIT_VALUE ]: ( dispatch, { data } ) => {
		if ( data.status && data.status === 'finished' ) {
			dispatch( successNotice( 'Page with ID: ' + data.page_id + ' complete initialized.' ) );
		}
	},
	[ TeamTypes.CREATE_TEAM_SUCCESS ]: dispatch => {
		dispatch(
			successNotice( 'Tạo nhóm thành công.', {
				duration: 3000,
			} )
		);
	},
	[ TeamTypes.CREATE_TEAM_MEMBER_SUCCESS ]: dispatch => {
		dispatch(
			successNotice( 'Thêm thành viên thành công.', {
				duration: 3000,
			} )
		);
	},
	[ TeamTypes.CREATE_TEAM_MEMBER_FAILED ]: ( dispatch, { error } ) => {
		dispatch( errorNotice( error.message || 'Đã có lỗi xảy ra! Không thể thêm thành viên.' ) );
	},
	[ TeamTypes.UPDATE_TEAM_MEMBER_SUCCESS ]: dispatch => {
		dispatch(
			successNotice( 'Cập nhật thành viên thành công.', {
				duration: 3000,
			} )
		);
	},
	[ TeamTypes.UPDATE_TEAM_MEMBER_FAILED ]: ( dispatch, { error } ) => {
		dispatch( errorNotice( error.message || 'Đã có lỗi xảy ra! Không thể cập nhật thành viên.' ) );
	},
};

/**
 * Middleware
 */

export default ( { dispatch, getState } ) => next => action => {
	if ( ! get( action, 'meta.notices.skip' ) && handlers.hasOwnProperty( action.type ) ) {
		handlers[ action.type ]( dispatch, action, getState );
	}

	return next( action );
};
