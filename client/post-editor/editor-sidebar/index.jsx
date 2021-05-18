/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
// import { getCurrentUser } from 'state/current-user/selectors';
// import EditorSidebarHeader from './header';
// import Source from './source';
// // import ConversationPost from 'blocks/conversation-post';
// import { getPage, getPost, getConversation } from 'state/conversation/selectors';
// // import Timeline from 'blocks/conversation-timeline/timeline';

export class EditorSidebar extends Component {

	render() {
		const { post, translate, currentUserEmail, isCurrentUser } = this.props;
		const timeline = this.props.timeline || [];
		console.log('timeline', timeline);
		return null;
		// return (
		// 	<div className="editor-sidebar">
		// 		<EditorSidebarHeader />
		// 		<Source />
		// 		<div className="conversation">
		// 			{ /* <ConversationPost post={ post } /> */ }
		// 		</div>
		// 		<div className="conversation__details">
					
		// 		</div>
		// 	</div>
		// )
	}
}

export default EditorSidebar;

// const isMessageFromPage = page => ( { from } ) => {
// 	// if ( ! from ) {
// 	// 	return true;
// 	// }
// 	// console.log( from );
// 	if ( ! page ) return null;
// 	return from ? from.id === page.id : false;
// };

// export default connect( state => {
// 	const page = getPage( state );
// 	// console.log( 'page', page );
// 	return {
// 		page: page,
// 		post: getPost( state ),
// 		timeline: getConversation( state ),
// 		isCurrentUser: isMessageFromPage( page ),
// 	};
// } )( EditorSidebar  );