/** @format */

/**
 * External dependencies
 */
import IO from 'socket.io-client';
import { isString } from 'lodash';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import {
	receiveAccept,
	receiveConnect,
	receiveDisconnect,
	receiveError,
	receiveInit,
	receiveLocalizedSupport,
	receiveMessage,
	receiveReconnecting,
	receiveStatus,
	receiveToken,
	receiveUnauthorized,
	requestTranscript,
	receiveUser,
} from 'state/realtime/connection/actions';

import {
	initSiteSocket,
	initUserSocket,
} from 'state/realtime/sockets/actions';


import { receiveOrder, receivePost } from 'state/posts/actions';
import { 
	sendRoleSocket,
	sendUserSocket,
} from 'state/realtime/connection/actions';

import {
	receivedActivedPages,
} from 'state/pages/actions';

import { 
	POSTS_REQUEST_SUCCESS,
	REALTIME_RECEIVE_LOGISTIC_DATA,
	INIT_PAGE_START,
	INIT_PAGE_COMPLETE,
} from 'state/action-types';

const debug = debugFactory( 'papo:realtime:connection' );

const buildConnection = socket =>
	isString( socket )
		? new IO( socket ) // If socket is an URL, connect to server.
		: socket; // If socket is not an url, use it directly. Useful for testing.

class Connection {
	/**
	 * Init the SockeIO connection: check user authorization and bind socket events
	 *
	 * @param  { Function } dispatch Redux dispatch function
	 * @param  { Promise } auth Authentication promise, will return the user info upon fulfillment
	 * @return { Promise } Fulfilled (returns the opened socket)
	 *                   	 or rejected (returns an error message)
	 */
	init( dispatch, auth ) {
		if ( this.openSocket ) {
			// console.log( 'socket is already connected' );
			debug( 'socket is already connected' );
			// we need to destroy this socket
			// this.openSocket = null;
			return this.openSocket;
		}
		this.dispatch = dispatch;
		// console.log( auth );

		this.openSocket = new Promise( ( resolve, reject ) => {
			auth
				.then( ( { url, user: { 
						signer_user_id, 
						current_site_ID, 
						current_site_role, 
						jwt, 
						locale, 
						groups, 
						skills, 
						geoLocation 
					} } ) => {
					const socket = buildConnection( url );
					console.log( 'current site id: ' + current_site_ID );
					socket
						.once( 'connect', () => {

							dispatch( receiveConnect() );

							dispatch( receiveUser( { ID: signer_user_id } ) );

							// raise change to state
							dispatch( initSiteSocket( current_site_ID, current_site_role ) );
							dispatch( initUserSocket( { user_ID: signer_user_id } ) );

							// emit site connected for current selected site with current role
							dispatch( sendRoleSocket( { current_site_role: current_site_role, site_ID: current_site_ID } ) );
							// emit user connected for current user
							// for receiving particular socket events
							// eg: when order is assigned to seller, socket will send
							// event only to this seller
							// socket.on( 'assignedOrder' ) => io.sockets.in( 'user12345' )...
							dispatch( sendUserSocket( { user_ID: signer_user_id } ) );
						} )
						.on( 'init', () => {
							dispatch( receiveInit( { signer_user_id, locale, groups, skills, geoLocation } ) );
							// dispatch( requestTranscript() );
							// resolve socket to promise
							resolve( socket );
						} )
						.on( 'unauthorized', () => {
							socket.close();
							dispatch( receiveUnauthorized( 'User is not authorized' ) );
							reject( 'user is not authorized' );
						} )
						.on( 'disconnect', reason => dispatch( receiveDisconnect( reason ) ) )
						.on( 'reconnecting', () => dispatch( receiveReconnecting() ) )
						.on( 'status', status => dispatch( receiveStatus( status ) ) )
						.on( 'accept', accept => dispatch( receiveAccept( accept ) ) )
						.on( 'localized-support', accept => dispatch( receiveLocalizedSupport( accept ) ) )
						.on( 'successCreateOrder', message => {
							const order = message.text;
							dispatch( receivePost( order ) );
							const query = {
								number: 1, // we only received one realtime order
								order: status === 'future' ? 'ASC' : 'DESC',
								page: 1,
								status: 'publish,private',
								type: 'post',
							};

							const siteId = order.site_ID;
							const found = 100; // need rewrite !!!!!!!!!!!!!!!!!!!!!!!!!!
							const posts = [ order ];
							dispatch( {
								type: POSTS_REQUEST_SUCCESS,
								siteId,
								query,
								found,
								posts,
							} );
						} )
						.on( 'assignedOrder', order => {
							console.log( order );
						} )
						.on( 'receivedLogisticUpdate', data => {
							console.log( data );
							dispatch( {
								type: REALTIME_RECEIVE_LOGISTIC_DATA,
								data,
							} )
						} )
						.on( 'startPageInit', page_id => {
							console.log( 'initializing page ' + page_id );
							dispatch( {
								type: INIT_PAGE_START,
								page_id,
							} )
						} )
						.on( 'completePageInit', page_id => {
							console.log( 'Page ' + page_id + ' has initialized completely.' );
							dispatch( {
								type: INIT_PAGE_COMPLETE,
								page_id,
							} )
						} )
						.on( 'receivedActivedPages', pages => {
							dispatch( receivedActivedPages( pages ) );
						} )
				} )
				.catch( e => reject( e ) );
		} );

		return this.openSocket;
	}

	/**
	 * Given a Redux action, emits a SocketIO event.
	 *
	 * @param  { Object } action A Redux action with props
	 *                    {
	 *                  		event: SocketIO event name,
	 *                  	  payload: contents to be sent,
	 *                  	  error: message to be shown should the event fails to be sent,
	 *                  	}
	 * @return { Promise } Fulfilled (returns nothing)
	 *                     or rejected (returns an error message)
	 */
	send( action ) {
		if ( ! this.openSocket ) {
			return;
		}
		return this.openSocket.then(
			socket => socket.emit( action.event, action.payload ),
			e => {
				this.dispatch( receiveError( 'failed to send ' + action.event + ': ' + e ) );
				// so we can relay the error message, for testing purposes
				return Promise.reject( e );
			}
		);
	}

	/**
	 *
	 * Given a Redux action and a timeout, emits a SocketIO event that request
	 * some info to the Happychat server.
	 *
	 * The request can have three states, and will dispatch an action accordingly:
	 *
	 * - request was succesful: would dispatch action.callback
	 * - request was unsucessful: would dispatch receiveError
	 * - request timeout: would dispatch action.callbackTimeout
	 *
	 * @param  { Object } action A Redux action with props
	 *                  	{
	 *                  		event: SocketIO event name,
	 *                  		payload: contents to be sent,
	 *                  		callback: a Redux action creator,
	 *                  		callbackTimeout: a Redux action creator,
	 *                  	}
	 * @param  { Number } timeout How long (in milliseconds) has the server to respond
	 * @return { Promise } Fulfilled (returns the transcript response)
	 *                     or rejected (returns an error message)
	 */
	request( action, timeout ) {
		if ( ! this.openSocket ) {
			return;
		}

		return this.openSocket.then(
			socket => {
				const promiseRace = Promise.race( [
					new Promise( ( resolve, reject ) => {
						socket.emit( action.event, action.payload, ( e, result ) => {
							if ( e ) {
								return reject( new Error( e ) ); // request failed
							}
							return resolve( result ); // request succesful
						} );
					} ),
					new Promise( ( resolve, reject ) =>
						setTimeout( () => {
							return reject( new Error( 'timeout' ) ); // request timeout
						}, timeout )
					),
				] );

				// dispatch the request state upon promise race resolution
				promiseRace.then(
					result => this.dispatch( action.callback( result ) ),
					e =>
						e.message === 'timeout'
							? this.dispatch( action.callbackTimeout() )
							: this.dispatch( receiveError( action.event + ' request failed: ' + e.message ) )
				);

				return promiseRace;
			},
			e => {
				this.dispatch( receiveError( 'failed to send ' + action.event + ': ' + e ) );
				// so we can relay the error message, for testing purposes
				return Promise.reject( e );
			}
		);
	}
}

export default () => new Connection();