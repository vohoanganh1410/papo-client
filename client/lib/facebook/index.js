/** @format */

/**
 * External dependencies
 */
import { includes } from 'lodash';
import { isURL } from 'validator';

import * as FacebookToken from 'lib/facebook/token';
// import {
// 	REPLY_COMMENT_SUCCESS,
// } from 'state/action-types';
import {
	REPLY_COMMENT_SUCCESS,
	CONVERSATION_REQUEST,
	CONVERSATION_POST_REQUEST,
	CONVERSATION_POST_REQUEST_FAILED,
	CONVERSATION_POST_REQUEST_SUCCESS,
	CONVERSATION_POST_RECEIVED,
	CONVERSATION_SET_CURRENT_MESSAGE,
	CONVERSATION_SEND_TYPING,
	CONVERSATION_SEND_NOT_TYPING,
	CONVERSATION_GRAPH_FAILED,
	CONVERSATION_TYPE_RECEIVED,
	CONVERSATION_SOURCE_RECEIVED,
	CONVERSATION_COMMENTS_RECEIVED,
	CONVERSATION_COMMENTS_REQUEST_FAILURED,
	CONVERSATION_MESSAGES_REQUEST,
	CONVERSATION_MESSAGES_RECEIVED,
	CONVERSATION_MESSAGES_REQUEST_FAILURED,
	CONVERSATION_MESSAGES_REQUEST_SUCCESS,

} from 'state/action-types';
// import {
// 	getConversationId,
// 	getMessage,
// } from 'state/conversation/selectors';

import {
	isValidConversationID,
	isValidPostID,
	getPageFromPermalinkURL,
	findThreadIdFromURL,
	getPageAccessToken,
} from './utils';
import { openEditorSidebar, closeEditorSidebar } from 'state/ui/editor/sidebar/actions';
import { makeCommentFromCommentMessage } from './utils';

/**
 * Module variables
 */
const token = FacebookToken.getToken();

export function graphPost( postId ) {
	return new Promise( ( resolve, reject ) => {
		if ( ! token ) {
			reject( 'Token not found. Please relogin facebook.' );
		}
		// console.log( postId )
		FB.api( '/' + postId + '?fields=message,attachments,admin_creator,created_time,name&access_token=' + token, 
			( response ) => {
				if ( response && response.error ) {
					reject( response.error );
				}
				console.log( response );
				resolve( response )
			} );
	} );
}

// function handleGraphError( dispatch, error ) {
	
// }

export const graphConversationPost = ( { post_id }, page_token ) => dispatch => {
	if ( post_id ) {
		dispatch( {
			type: CONVERSATION_POST_REQUEST,
			post_id: post_id,
		} );
		FB.api( '/' + post_id + '?fields=message,attachments,admin_creator,created_time,name&access_token=' + page_token, 
		( post_response ) => {
			if ( post_response && post_response.error ) {
				const error = post_response.error;
				dispatch( {
					type: CONVERSATION_POST_REQUEST_FAILED,
					error,
				} );
			}
			
			const post = post_response;
			dispatch( {
				type: CONVERSATION_POST_RECEIVED,
				post,
				post_id,

			} );
			dispatch( {
				type: CONVERSATION_POST_REQUEST_SUCCESS,
			} )
		} );
	}
}

/**
 * Graph conversation given by object contains:
 * conversation_type: "comment" or "message"
 * conversation_id: "5616516516516_8498494984984" for comment and "t_21651651651" for "message"
 * post_id: if conversation_type == "comment", post_id like "519851651651_9849451132132"
 */
export const graphConversation = ( { conversation_type, conversation_id, post_id, source } ) => ( dispatch ) => {
	if ( source ) {
		dispatch( {
			type: CONVERSATION_SOURCE_RECEIVED,
			source,
		} );
	}
	// graph post
	if ( post_id ) {
		dispatch( {
			type: CONVERSATION_POST_REQUEST,
			conversation_id: conversation_id,
			post_id: post_id,
		} );
		FB.api( '/' + post_id + '?fields=message,attachments,admin_creator,created_time,name&access_token=' + token, 
		( post_response ) => {
			// console.log( post_response );
			if ( post_response && post_response.error ) {
				const error = post_response.error;
				dispatch( {
					type: CONVERSATION_POST_REQUEST_FAILED,
					error,
				} );
			}
			
			const post = post_response;
			dispatch( {
				type: CONVERSATION_POST_RECEIVED,
				post,
				post_id,

			} );
			dispatch( {
				type: CONVERSATION_POST_REQUEST_SUCCESS,
			} )
		} );
	}
	
	if ( conversation_type === 'comment' && conversation_id ) {
		
		dispatch( {
			type: CONVERSATION_REQUEST,
			conversation_id: conversation_id,
		} );
		// graph comments
		FB.api( '/' + conversation_id + '?fields=from,created_time,permalink_url,message,comments.limit(1000)&access_token=' + token, 
			( conversation_response ) => {
				console.log( conversation_response );
				if ( conversation_response && conversation_response.error ) {
					const error = conversation_response.error;
					dispatch( {
						type: CONVERSATION_COMMENTS_REQUEST_FAILURED,
						error,
					} );
				}

				dispatch( {
					type: CONVERSATION_TYPE_RECEIVED,
					conversation_type,
					conversation_id,
				} );
				
				const comments = 
				conversation_response; //.comments.splice( 0, 0, 
					//makeCommentFromCommentMessage( conversation_response.comments ) );

				dispatch( {
					type: CONVERSATION_COMMENTS_RECEIVED,
					comments,
				} );
				
			} )
	}

	if ( conversation_type === 'message' && conversation_id && source.id ) {
		getPageAccessToken( source.id )
			.then( res => {
				if ( res && res.error ) {
					reject( res.error );
				}

				dispatch( {
					type: CONVERSATION_TYPE_RECEIVED,
					conversation_type,
					conversation_id,
				} );

				const page_access_token = res.access_token;
				graphMessages( conversation_id, page_access_token )
				.then( messages => {
					console.log( messages );
					
					dispatch( {
						type: CONVERSATION_MESSAGES_RECEIVED,
						messages,
					} );
					dispatch( {
						type: CONVERSATION_MESSAGES_REQUEST_SUCCESS,
					} );

				} )
				.catch( error => {
					console.log( error );
					dispatch( {
						type: CONVERSATION_MESSAGES_REQUEST_FAILURED,
						error,
					} );
				} )
			} )
			.catch( error => {
				alert( error )
			} )
	}
	
}

/**
 * Call to Facebook API to get conversation details
 * If conversation is from Comment, this function will graph this comment and all child comments, 
 * then graph Post that comment is belong to.
 * @param  {string} URL of conversation. There are some types of conversation link:
 * 1: if conversation is comment, conversation link should be something like this:
 *		https://facebook.com/2253264311617213_2260747657535545
 * 		https://www.facebook.com/{page_name_or_id}/posts/1774820615946100?comment_id=1778959568865538&comment_tracking=%7B%22tn%22%3A%22R%2311%22%7D
 * 2: if conversation is message:
 *		https://facebook.com/{page_name_or_id}/inbox/1536151546531520
 *		https://www.facebook.com/VongChiDoKimVangMayMan/inbox/?mailbox_id=1535476133213884&selected_item_id=100013636096473
 * @return {object} Facebook API graph response
 */
export const graphConversationByURL = ( URL ) => ( dispatch ) => new Promise( ( resolve, reject ) => {
	// check conversation type to call corresponding graph API
			if ( ! URL || ! URL.length || ! isURL( URL) ) {
				const error = { message: 'Vui lòng nhập link hội thoại từ Facebook!' };
				dispatch( {
					type: CONVERSATION_GRAPH_FAILED,
					error,
				} );
				reject( { message: 'Vui lòng nhập link hội thoại từ Facebook!' } );
				return;
			}

			// we need to check 
			if ( ! includes( URL, 'facebook.com' ) ) {
				const error = { message: 'Vui lòng nhập link hội thoại từ Facebook!' };
				dispatch( {
					type: CONVERSATION_GRAPH_FAILED,
					error,
				} );
				reject( { message: 'Vui lòng nhập link hội thoại từ Facebook!' } );
				return;
			}

			if ( includes( URL, 'inbox' ) ) {
				// https://facebook.com/GoHuyetRongPhongThuyTaiTam/inbox/1547208085425866
				// t_339058773328040?fields=participants,link,former_participants,id,senders,messages{from,id,to,attachments,created_time,message,sticker,tags,shares},updated_time
				getPageFromPermalinkURL( URL )
				.then( page => {

					if ( page ) {
						// open sidebar
						dispatch( openEditorSidebar() );
						const source = page;
						dispatch( {
							type: CONVERSATION_SOURCE_RECEIVED,
							source,
						} );
					}
					// get page_access_token
					getPageAccessToken( page.id )
					.then( res => {
						if ( res && res.error ) {
							reject( res.error );
						}

						const page_access_token = res.access_token;
						console.log(page_access_token);

						// find thread ID of this message from URL
						findThreadIdFromURL( page.id, URL, page_access_token )
						.then( thread_id => {
							const conversation_type = "message";
							const conversation_id = thread_id;
							dispatch( {
								type: CONVERSATION_TYPE_RECEIVED,
								conversation_type,
								conversation_id,
							} );

							dispatch( {
								type: CONVERSATION_MESSAGES_REQUEST,
							} );

							graphMessages( thread_id, page_access_token )
							.then( messages => {
								console.log( messages );
								
								dispatch( {
									type: CONVERSATION_MESSAGES_RECEIVED,
									messages,
								} );
								dispatch( {
									type: CONVERSATION_MESSAGES_REQUEST_SUCCESS,
								} );

							} )
							.catch( error => {
								console.log( error );
								dispatch( {
									type: CONVERSATION_MESSAGES_REQUEST_FAILURED,
									error,
								} );
							} )
						} )
						.catch( error => {
							dispatch( {
								type: CONVERSATION_MESSAGES_REQUEST_FAILURED,
								error,
							} );
							
							console.log( error );
							reject( error );
						} )
					} );

				} )
				.catch( error => {
					dispatch( {
						type: CONVERSATION_GRAPH_FAILED,
						error,
					} );
				} );
			}
			else {
				// graph comment converstation 
				// get the last segment of URL
				// it should be match postID_commentId
				let conversationID = URL.split('/').pop();
				
				// check if conversation ID is valid
				if ( ! isValidConversationID( conversationID ) ) {
					const error = { message: 'Link hội thoại không đúng!' };
					dispatch( {
						type: CONVERSATION_GRAPH_FAILED,
						error,
					} );
					reject( { message: 'Link hội thoại không đúng!' } );
					return;
				}

				dispatch( {
					type: CONVERSATION_POST_REQUEST,
					conversation_id: conversationID,
				} );

				// first we need permalink_url, at this point we don't known page ID to get 
				// page_access_token. So we need get page id to graph page_access_token
				FB.api( '/' + conversationID + '?fields=permalink_url&access_token=' + token,
					( response ) => {
						if ( response && response.error ) {
							const error = response.error;
							dispatch( {
								type: CONVERSATION_GRAPH_FAILED,
								error,
							} );
							reject( response.error );
						}
						if (  response && response.permalink_url ) {
							getPageFromPermalinkURL( response.permalink_url )
							.then( page => {

								const postID = conversationID.split( '_' )[ 0 ];
								const post_id = page.id + '_' + postID;

								if ( page ) {
									// open sidebar
									dispatch( openEditorSidebar() );
									const source = page;
									dispatch( {
										type: CONVERSATION_SOURCE_RECEIVED,
										source,
									} );
								}

								// get page_access_token
								getPageAccessToken( page.id )
								.then( res => {
									if ( res && res.error ) {
										reject( res.error );
									}

									const page_access_token = res.access_token;
									console.log(page_access_token)
									FB.api( '/' + post_id + '?fields=message,attachments,admin_creator,created_time,name&access_token=' + page_access_token, 
									( post_response ) => {
										// console.log( post_response );
										if ( post_response && post_response.error ) {
											const error = post_response.error;
											dispatch( {
												type: CONVERSATION_POST_REQUEST_FAILED,
												error,
											} );
											reject( post_response.error );
										}
										
										const post = post_response;
										dispatch( {
											type: CONVERSATION_POST_RECEIVED,
											post,
											post_id,

										} );
										dispatch( {
											type: CONVERSATION_POST_REQUEST_SUCCESS,
										} )
										
										FB.api( '/' + conversationID + '?fields=from,created_time,permalink_url,message,comments.limit(1000)&access_token=' + page_access_token, 
											( conversation_response ) => {
												console.log( conversation_response );
												if ( conversation_response && conversation_response.error ) {
													const error = conversation_response.error;
													dispatch( {
														type: CONVERSATION_COMMENTS_REQUEST_FAILURED,
														error,
													} );
													reject( conversation_response.error );
												}

												const conversation_type = "comment";
												dispatch( {
													type: CONVERSATION_TYPE_RECEIVED,
													conversation_type,
													conversation_id: conversationID,
												} );
												
												const comments = 
												conversation_response; //.comments.splice( 0, 0, 
													//makeCommentFromCommentMessage( conversation_response.comments ) );

												dispatch( {
													type: CONVERSATION_COMMENTS_RECEIVED,
													comments,
												} );
												
												
												resolve( Object.assign( 
													post_response, 
													{  
														source: page,
														conversation_type: "comment", 
														conversation: conversation_response,
													} ) );
											} )
									} );

								} )
								.catch( err => {
									reject( { message: error.message } )
								} )
							} )
							.catch( error => {
								reject( { message: error.message } )
							} )
						}
					} )
			}

} )

export const graphMessages = ( thread_id, page_access_token ) => new Promise( ( resolve, reject ) => {
	if ( ! thread_id ) {
		reject( { message: 'Missing thread id to graph messages.' } );
	}

	if ( ! page_access_token ) {
		reject( { message: 'Graph messages required a page access token.' } );
	}

	FB.api( '/' + thread_id + '?fields=participants,link,former_participants,id,senders,messages.limit(1000){from,id,to,attachments,created_time,message,sticker,tags,shares},updated_time&access_token=' + page_access_token,
	response => {
		if ( response && response.error ) {
			reject( response.error );
		}
		resolve( response );
	} )

} )

export function replyToComment( conversation_id, message, page_access_token, attachment_url = null ) {
	return dispatch => {
		return new Promise( function( resolve, reject ){
			if ( ! conversation_id ) reject( 'Error. Missing conversation ID' );
			if ( ! page_access_token ) reject( 'Error. Missing Page access token' );
            FB.api(
                "/" + conversation_id + "/comments",
                "POST",
                {
                    "message": message,
                    "attachment_url" : attachment_url,
                    "access_token" : page_access_token || token
                },
                function ( response ) {
                  if ( response && !response.error ) {
                    /* handle the result */
                    dispatch( {
                    	type: REPLY_COMMENT_SUCCESS,
                    } );

                    resolve( 'Success' );
                  }
                  else {
                    reject( response.error );
                  }
                }
            );
        })
	}
	
}


// {
//   "from": {
//     "name": "Thái Hoàng Hải",
//     "id": "538055679973020"
//   },
//   "permalink_url": "https://www.facebook.com/994349830740410/posts/1016392541869472/?comment_id=532454373857940",
//   "message": "Toi sinh 11.10 1979  sdt 0904547891 xem phong thuy giup toi .shop cho toi hoi da do la loai da gi.",
//   "comments": {
//     "data": [
//       {
//         "created_time": "2018-09-22T13:20:47+0000",
//         "from": {
//           "name": "Phong Thủy Tràng An",
//           "id": "994349830740410"
//         },
//         "message": "anh kiểm tra inbox/messenger giúp em ạ",
//         "id": "1016392541869472_532454637191247"
//       },