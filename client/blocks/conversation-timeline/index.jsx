import React from 'react';
import { connect } from 'react-redux';

import { isReachedEnd, isReachedStart, getLastRequestTime } from 'state/conversation/selectors';

import MessagePane from 'blocks/message-pane/message-pane';

class Timeline extends React.Component {
	handleScroll = e => {};

	render() {
		const { conversationId, keys, rows, pendingMessages } = this.props;

		return (
			<div className="timeline__content" ref="messagelist" key={ 'messagelist' }>
				<MessagePane
					className="message_list"
					conversationId={ conversationId }
					from={ this.props.from }
					rows={ rows }
					height={ this.props.height }
					width={ this.props.width }
					pendingMessages={ pendingMessages }
					fadeScrollbar={ true }
					loadConversations={ this.props.loadConversations }
					onChangeSelected={ this.handleChangeSelected }
					pageId={ this.props.pageId }
					page={ this.props.page }
					conversation={ this.props.conversation }
					requestConversation={ this.props.requestConversation }
					requestMoreConversation={ this.props.requestMoreConversation }
					isLoading={ this.props.isLoading }
					isLoadingOlder={ this.props.isLoadingOlder }
					loadingError={ this.props.loadingError }
					onScroll={ this.handleScroll }
					onClickImage={ this.props.onClickImage }
					reachedEnd={ this.props.reachedEnd }
					reachedStart={ this.props.reachedStart }
					lastRequestTime={ this.props.lastRequestTime }
					onMessagePaneKeyDown={ this.props.onMessagePaneKeyDown }
					focusOrder={ this.props.focusOrder }
					type={ this.props.type }
					readWatermark={ this.props.readWatermark }
				/>
			</div>
		);
	}
}

export default connect(
	( state, { conversationId } ) => {
		return {
			reachedEnd: isReachedEnd( state, conversationId ),
			reachedStart: isReachedStart( state, conversationId ),
			lastRequestTime: getLastRequestTime( state ),
		};
	},
	{}
)( Timeline );
