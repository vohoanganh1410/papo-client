
export function makeCommentFromCommentMessage( comments ) {
	console.log( 'comments', comments );
	if ( comments && comments.message ) {
		return {
			message: comments.message,
			id: comments.id,
			created_time: comments.created_time,
		}
	}
	return null;
}