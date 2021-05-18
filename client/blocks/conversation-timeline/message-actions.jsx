import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import ActionButton from './action-button';
import styles from './style.scss';

class MessageActions extends React.PureComponent {
	static propTypes = {
		msg: PropTypes.object,
		className: PropTypes.string,
		children: PropTypes.node,
		position: PropTypes.oneOf( [ 'default', 'inside', 'above' ] ),
		show: PropTypes.bool,
		showReact: PropTypes.bool,
		hover: PropTypes.bool,
		setHover: PropTypes.func,
		isEditing: PropTypes.bool,
		isLiked: PropTypes.bool,
		isDeleted: PropTypes.bool,
		canDelete: PropTypes.bool,
		canReplyPrivate: PropTypes.bool,
		canHide: PropTypes.bool,
		isHidden: PropTypes.bool,
		privateReplyConversationId: PropTypes.string,
		renderOffscreen: PropTypes.bool,
	};

	static defaultProps = {
		className: undefined,
		children: undefined,
		position: 'default',
		show: undefined,
		hover: false,
		setHover: noop,
		isEditing: false,
		renderOffscreen: false,
		showReact: false,
	};

	constructor( props ) {
		super( props );

		// this.renderActions = this.renderActions.bind( this );
	}

	// renderActions() {
	// 	const { msg, hover, show, showReact, isEditing, renderOffscreen, children } = this.props;
	// }

	render() {
		const { message } = this.props;

		return (
			<div
				className={ classNames( styles.c_message_actions__container, styles.c_message__actions ) }
			>
				{ message.can_hide && <ActionButton icon="eye" description="Ẩn bình luận" /> }
				{ message.can_like && <ActionButton icon="thumbs-up" description="Thích" /> }
				{ message.can_reply_privately && <ActionButton icon="envelope-o" description="Nhắn tin" /> }
				{ message.can_remove && <ActionButton icon="trash" description="Xóa" /> }
			</div>
		);
	}
}

export default MessageActions;
