import React from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';

import CList from 'conversations/list';
import { getSelectedPageIdsPreference } from 'state/preferences/selectors';
import { getSelectedPageId } from 'state/ui/selectors';
import { loadConversations, onChangeSelectedConversation } from 'actions/conversation';
import { getConversations } from 'state/conversations/selectors';
import { getSelectedConversation } from 'state/ui/conversation-list/selectors';
import { toggleShowSwitchPages } from 'state/ui/actions';

class ConversationSidebar extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			selected: null,
			windowHeight: this.getViewportHeight(),
		};
	}

	componentDidMount() {
		this.resize = throttle( this.resize, 400 );
		window.addEventListener( 'resize', this.resize, true );
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.resize, true );
	}

	getViewportHeight() {
		let height;
		if ( document.documentElement ) {
			height = document.documentElement.clientHeight;
		}

		if ( ! height && document.body ) {
			height = document.body.clientHeight;
		}

		return height || 0;
	}

	resize = () => {
		this.setState( {
			windowHeight: this.getViewportHeight(),
		} );
	};

	handleContentScroll = () => {
		// console.log( 'onContentScroll', e );
	};

	// TODO: Ưu tiên load Conversation trước khi cập nhật trạng thái Seen = true
	handleChangeSelected = selected => {
		if ( ! selected ) {
			return;
		}

		const previousSelected = this.state.selected ? this.state.selected.id : null;

		this.setState(
			{
				selected: selected,
			},
			() => {
				this.props.onChangeSelectedConversation(
					selected.page_id,
					selected.id,
					previousSelected,
					selected.seen
				);
			}
		);
	};

	handleShowSwitchPages = () => {
		this.props.toggleShowSwitchPages();
	};

	render() {
		return (
			<CList
				height={ this.state.windowHeight }
				fadeScrollbar={ true }
				onScroll={ this.handleContentScroll }
				selectedPageIds={ this.props.selectedPageIds }
				selectedPageId={ this.props.selectedPageId }
				loadConversations={ this.props.loadConversations }
				rows={ this.props.conversations }
				onChangeSelected={ this.handleChangeSelected }
				isMultipleMode={ this.props.isMultipleMode }
				selectedId={ this.props.selectedId }
				onShowSwitchPages={ this.handleShowSwitchPages }
			/>
		);
	}
}

export default connect(
	state => {
		return {
			selectedPageIds: getSelectedPageIdsPreference( state ),
			selectedPageId: getSelectedPageId( state ),
			conversations: getConversations( state ),
			selectedId: getSelectedConversation( state ),
		};
	},
	{
		loadConversations,
		onChangeSelectedConversation,
		toggleShowSwitchPages,
	}
)( ConversationSidebar );
