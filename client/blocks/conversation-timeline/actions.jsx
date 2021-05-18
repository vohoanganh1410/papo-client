import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { bindAll, noop } from 'lodash';

class Actions extends React.PureComponent {
	
	static propTypes = {
		reactionKey: PropTypes.string,
		theme: PropTypes.oneOf(["dark", "light"]),

		isLiked: PropTypes.bool,
		canLike: PropTypes.bool,
		updateLike: PropTypes.func,

		isDeleted: PropTypes.bool,
		canDelete: PropTypes.bool,
		onDelete: PropTypes.func,

		canReplyPrivate: PropTypes.bool,
		privateConversation: PropTypes.string,
		onReplyPrivate: PropTypes.func,

		isPinned: PropTypes.bool,
		pinMessage: PropTypes.func,
		unpinMessage: PropTypes.func,

		messageContainerType: PropTypes.string,
		editHandler: PropTypes.func,
		onMenuOpen: PropTypes.func,
		onMenuClose: PropTypes.func,

		onEmojiPickerOpen: PropTypes.func,
		onEmojiPickerClose: PropTypes.func,

		showReact: PropTypes.bool,
		showJump: PropTypes.bool,

		renderOffscreen: PropTypes.bool.isRequired,
		openModal: PropTypes.func,

	}

	static defaultProps = {
		reactionKey: null,
		theme: 'light',
		isLiked: false,
		isPinned: false,
		messageContainerType: undefined,
		editHandler: noop,
		onMenuOpen: noop,
		onMenuClose: noop,
		onEmojiPickerOpen: noop,
		onEmojiPickerClose: noop,
		showReact: false,
		showJump: true,
		pinMessage: noop,
		unpinMessage: noop,
		updateLike: noop,
		onReplyPrivate: noop,

	}

	render() {
		return(
			<strong>sdfsdf</strong>
		)
	}
}

export default Actions;