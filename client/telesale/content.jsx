/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Gridicon from 'gridicons';
import { localize } from 'i18n-calypso';
// import { each, get, includes, isEqual, isUndefined, map } from 'lodash';

/**
 * Internal dependencies
 */
import EmptyContent from 'components/empty-content';
import { preventWidows } from 'lib/formatting';
import OrderNavigation from 'telesale/order-navigation';
import Conversation from 'telesale/conversation';
import { ChatComposer } from 'telesale/chat-composer';

export class OrderContent extends Component {
	
	render() {
		const {
			post,
			statuses,
			chatStatus,
			connectionStatus,
			currentUserEmail,
			disabled,
			isChatOpen,
			isCurrentUser,
			isExternalUrl,
			isMinimizing,
			isServerReachable,
			message,
			onSendMessage,
			onSendNotTyping,
			onSendTyping,
			onSetCurrentMessage,
			timeline,
			translate,
			twemojiUrl,
			conversationId,
			pageId
		} = this.props;

		if ( !post ) {
			return(
				<EmptyContent
					title={ preventWidows( translate( "Chưa có Order nào được chọn." ) ) }
					line={ preventWidows(
						translate( 'Vui lòng chọn một Order từ danh sách để xem chi tiết.' )
					) }
					illustration="/papo/images/illustrations/illustration-404.svg"
				/>
			)
		}

		return(
			<div className="order-content">
				{
					post && <OrderNavigation post={ post } statuses={ statuses } />
				}
				<Conversation order={ post } />
				<ChatComposer
					disabled={ disabled }
					message={ message }
					onSendMessage={ onSendMessage }
					onSendNotTyping={ onSendNotTyping }
					onSendTyping={ onSendTyping }
					onSetCurrentMessage={ onSetCurrentMessage }
					translate={ translate }
					conversationId={ conversationId }
					pageId={ pageId }
				/>
			</div>
		)
	}
}

const mapStateToProps = ( state, { siteId } ) => {
	return {
		test: null
	}
};

const mapDispatchToProps = ( dispatch, { siteId } ) => ( {
	test: null,
} );

export default connect( mapStateToProps, mapDispatchToProps )(
	localize( OrderContent )
);