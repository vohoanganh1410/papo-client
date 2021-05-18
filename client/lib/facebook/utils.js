/** @format */

/**
 * External dependencies
 */
import { includes } from 'lodash';
import { isURL } from 'validator';

/**
 * Internal dependencies
 */
import * as FacebookToken from 'lib/facebook/token';

/**
 * Module variable
 */
const token = FacebookToken.getToken();
const _checkNumberReg = /^\d+$/;

/**
 * Return avatar URL of given Facebook User's ID as string
 * Note: size should be 50 or 100 ( as Facbook required )
 */
export function getAvatarURL( userID, size = 50, access_token ) {
	// if size is not equal to 50 or 100 then return size = 100
	if ( size !== 50 && size !== 100 ) size = 50;
	const baseUrl = '//graph.facebook.com/' + userID + '/picture?width=' + size + '&height=' + size;

	return access_token ? baseUrl + '&access_token=' + access_token : baseUrl;
}

/**
 * Return Post ID from facebook comment link
 * @param {String} link https://facebook.com/1016392541869472_532454373857940
 * return String
 */
// export function getPostURLFromConversationLink( link ) {
// 	if ( ! link || ! link.includes( 'facebook.com' ) ) {
// 		return null;
// 	}
// 	let conversationID = link.split('/').pop();

// }

/**
 * Check if string match 13213516516516_21321321321321 type
 */
function isStringMatchNumber_Number( string ) {
	if ( ! includes( string, '_' ) ) {
		return false;
	}
	const _t = string.split( '_' );

	return _t.length === 2 && ! _t.some( isNaN );
}

export function isValidConversationID( conversationID ) {
	return isStringMatchNumber_Number( conversationID );
}

export function isValidPostID( postID ) {
	return isStringMatchNumber_Number( postID );
}

export function getPageFromPermalinkURL( permalink_url ) {
	return new Promise( ( resolve, reject ) => {
		if ( ! isURL( permalink_url ) || ! includes( permalink_url, 'facebook.com' ) || ! token ) {
			reject( { message: 'Permalink is invalid.' } );
		}

		const _t = permalink_url.split( '/' )[ 3 ];

		FB.api( '/' + _t + '?access_token=' + token, response => {
			if ( response && response.error ) {
				const error = response.error;
				reject( error );
			}
			resolve( response );
		} );
	} );
}

export function findThreadIdFromURL( page_id, URL, page_access_token ) {
	return new Promise( ( resolve, reject ) => {
		if ( ! page_access_token ) {
			reject( { message: 'Find thread id required a page access token.' } );
		}

		// get message ID from URL https://facebook.com/GoHuyetRongPhongThuyTaiTam/inbox/1547208085425866
		const messageID = URL.split( '/' ).pop(); //
		// check if messageID is valid
		if ( ! _checkNumberReg.test( messageID ) ) {
			reject( { message: 'Conversation URL is invalid.' } );
		}

		let found,
			limit = 100;
		console.log( 'searching in ' + limit + ' messages' );
		FB.api(
			'/' +
				page_id +
				'/conversations?fields=id,link&limit=' +
				limit +
				'&access_token=' +
				page_access_token,
			response => {
				if ( response && ! response.error ) {
					response.data.forEach( data => {
						if ( data.link.indexOf( messageID ) !== -1 ) {
							found = data.id;
							resolve( found );
							return;
						}
					} );

					if ( found ) {
						resolve( found );
					} else {
						console.log( 'searching in 5000 messages' );
						FB.api(
							'/' +
								page_id +
								'/conversations?fields=id,link&limit=5000&access_token=' +
								page_access_token,
							response => {
								if ( response && ! response.error ) {
									response.data.forEach( data => {
										if ( data.link.indexOf( messageID ) !== -1 ) {
											found = data.id;
											resolve( found );
											return;
										}
									} );

									if ( found ) {
										resolve( found );
									} else {
										reject( { message: 'Not found' } );
									}
								} else {
									reject( { message: 'Not found' } );
								}
							}
						);
					}
				} else {
					reject( { message: 'Not found' } );
				}
			}
		);
	} );
}

/**
 * Get Page access token given by page ID and app access token
 * @param  {string} pageId Page ID
 */
export function getPageAccessToken( pageId ) {
	return new Promise( ( resolve, reject ) => {
		if ( typeof FB === undefined ) {
			reject( { message: 'Facebook did not loaded', code: '100' } );
		}
		if ( ! pageId ) {
			reject( { message: 'Missing page ID', code: '100' } );
		}
		if ( ! token ) {
			reject( 'Token should not empty. To get Page access token, you must login to app first.' );
		}

		FB.api( '/' + pageId + '?fields=access_token&access_token=' + token, response => {
			if ( response && response.error ) {
				reject( response.error );
			}
			resolve( response );
		} );
	} );
}
