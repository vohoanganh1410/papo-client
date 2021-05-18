import { get } from 'lodash';

export function getPost( state, postId ) {
	return get( state.posts.items, postId );
}
