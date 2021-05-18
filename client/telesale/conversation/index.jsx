/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Gridicon from 'gridicons';
import { localize } from 'i18n-calypso';
import { sample } from 'lodash';

/**
 * Internal dependencies
 */
import { getCurrentUser } from 'state/current-user/selectors';
import Card from 'components/card';
import ConversationHeader from './conversation-header';
import ConversationPost from './conversation-post';
import { getConversation, getPage } from 'state/conversation/selectors';

export class Conversation extends Component {
	
	render() {
		const { order, currentUserEmail, isCurrentUser, translate } = this.props;
		
		const timeline = this.props.timeline || [];
		return(
			<Card className="conversation__content" >
			sdfsdf
			</Card>
		)
	}
}

const isMessageFromPage = page => ( { from } ) => {
	if ( ! page ) return null;
	return from ? from.id === page.id : false;
};

const mapStateToProps = state => {
	const currentUser = getCurrentUser( state );
	const page = getPage( state );
	return {
		currentUserEmail: currentUser.email,
		timeline: getConversation( state ),
		isCurrentUser: isMessageFromPage( page ), // see redux-no-bound-selectors eslint-rule
	}
};

const mapDispatchToProps = ( dispatch, { siteId } ) => ( {
	test: null,
} );

export default connect( mapStateToProps, mapDispatchToProps )(
	localize( Conversation )
);