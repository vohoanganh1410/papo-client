import { Client1 } from 'lib/client1';
import { PostTypes } from 'action-types';

export const requestPagePost = ( pageId, postId, pageToken ) => dispatch => {
	dispatch( {
		type: PostTypes.REQUEST_PAGE_POST,
		pageId,
		postId,
	} );

	return Client1.fetchPost( pageId, postId, pageToken )
		.then( post => {
			dispatch( {
				type: PostTypes.RECEIVED_PAGE_POST,
				pageId,
				postId,
				post,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: PostTypes.REQUEST_PAGE_POST_FAILED,
				pageId,
				postId,
				error,
			} );
		} );
};
