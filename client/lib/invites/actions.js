/** @format */

/**
 * External dependencies
 */

import Debug from 'debug';
import { get, isEmpty, omit, values, difference } from 'lodash';
import i18n from 'i18n-calypso';
import request from 'superagent';
import config from 'config';
import { v4 as uuid } from 'uuid';

/**
 * Internal dependencies
 */
import Dispatcher from 'dispatcher';
import papo from 'lib/papo';
import { action as ActionTypes } from 'lib/invites/constants';
// import analytics from 'lib/analytics';
import { errorNotice, successNotice } from 'state/notices/actions';
import { acceptedNotice } from 'dashboard/invites/utils';
import { requestSites, receiveSites } from 'state/sites/actions';
import { getCurrentUser } from 'state/current-user/selectors';

/**
 * Module variables
 */
const debug = new Debug( 'calypso:invites-actions' );

export function fetchInvite( siteId, inviteKey ) {
	debug( 'fetchInvite', siteId, inviteKey );



	Dispatcher.handleViewAction( {
		type: ActionTypes.FETCH_INVITE,
		siteId,
		inviteKey,
	} );

	request
		.post( `${ config( 'api_url' ) }/api/v1/invitees/invite` )
		.withCredentials()
		.send( { site_name: siteId, invite_key: inviteKey } )
		.then( response => {
			const data = response.body;
			const error = null;
			Dispatcher.handleServerAction( {
				type: error ? ActionTypes.RECEIVE_INVITE_ERROR : ActionTypes.RECEIVE_INVITE,
				siteId,
				inviteKey,
				data,
				error,
			} );
		})

	// wpcom.undocumented().getInvite( siteId, inviteKey, ( error, data ) => {
	// 	Dispatcher.handleServerAction( {
	// 		type: error ? ActionTypes.RECEIVE_INVITE_ERROR : ActionTypes.RECEIVE_INVITE,
	// 		siteId,
	// 		inviteKey,
	// 		data,
	// 		error,
	// 	} );

	// 	if ( error ) {
	// 		analytics.tracks.recordEvent( 'calypso_invite_validation_failure', {
	// 			error: error.error,
	// 		} );
	// 	}
	// } );
}

export function createAccount( userData, invite, callback ) {
	const send_verification_email = userData.email !== invite.sentTo;

	// return dispatch => {
	// 	wpcom
	// 		.undocumented()
	// 		.usersNew(
	// 			Object.assign( {}, userData, { validate: false, send_verification_email } ),
	// 			( error, response ) => {
	// 				const bearerToken = response && response.bearer_token;
	// 				if ( error ) {
	// 					if ( error.message ) {
	// 						dispatch( errorNotice( error.message ) );
	// 					}
	// 					analytics.tracks.recordEvent( 'calypso_invite_account_creation_failed', {
	// 						error: error.error,
	// 					} );
	// 				} else {
	// 					analytics.tracks.recordEvent( 'calypso_invite_account_created' );
	// 				}
	// 				callback( error, bearerToken );
	// 			}
	// 		);
	// };
}

export function acceptInvite( invite, callback ) {
	return dispatch => {
		Dispatcher.handleViewAction( {
			type: ActionTypes.INVITE_ACCEPTED,
			invite,
		} );
		// console.log( invite );

		// request
		// 	.post( `${ config( 'api_url' ) }/api/v1/invitees/acceptInvite` )
		// 	.withCredentials()
		// 	.send( { invite: invite } )
		// 	.then( response => {
		// 		const data = response.body;
		// 		console.log( data );
		// 		const error = null;
				
		// 		dispatch( {
		// 			type: error
		// 				? ActionTypes.RECEIVE_INVITE_ACCEPTED_ERROR
		// 				: ActionTypes.RECEIVE_INVITE_ACCEPTED_SUCCESS,
		// 			error,
		// 			invite,
		// 			data,
		// 		} );
		// 		if ( error ) {
		// 			if ( error.message ) {
		// 				dispatch( errorNotice( error.message, { displayOnNextPage: true } ) );
		// 			}
		// 			// analytics.tracks.recordEvent( 'calypso_invite_accept_failed', {
		// 			// 	error: error.error,
		// 			// } );
		// 		} else {
		// 			if ( invite.role !== 'follower' && invite.role !== 'viewer' ) {
		// 				dispatch( receiveSites( data.sites ) );
		// 			}

		// 			if ( ! get( invite, 'site.is_vip' ) ) {
		// 				dispatch( successNotice( ...acceptedNotice( invite ) ) );
		// 			}

		// 			// analytics.tracks.recordEvent( 'calypso_invite_accepted' );
		// 		}
		// 		dispatch( requestSites() );
		// 		if ( typeof callback === 'function' ) {
		// 			callback( error, data );
		// 		}
		// 	} );


			// })
		papo.undocumented().acceptInvite( invite, ( error, data ) => {
			console.log( error );
			dispatch( {
				type: error
					? ActionTypes.RECEIVE_INVITE_ACCEPTED_ERROR
					: ActionTypes.RECEIVE_INVITE_ACCEPTED_SUCCESS,
				error,
				invite,
				data,
			} );
			if ( error ) {
				if ( error.message ) {
					dispatch( errorNotice( error.message, { displayOnNextPage: true } ) );
				}
			} else {
				if ( invite.role !== 'follower' && invite.role !== 'viewer' ) {
					dispatch( receiveSites( data.sites ) );
				}

				if ( ! get( invite, 'site.is_vip' ) ) {
					dispatch( successNotice( ...acceptedNotice( invite ) ) );
				}

				// analytics.tracks.recordEvent( 'calypso_invite_accepted' );
			}
			dispatch( requestSites() );
			if ( typeof callback === 'function' ) {
				callback( error, data );
			}
		} );
	};
}

export function sendInvites( siteId, usernamesOrEmails, role, message, inviteBy, formId ) {
	return dispatch => {
		Dispatcher.handleViewAction( {
			type: ActionTypes.SENDING_INVITES,
			siteId,
			usernamesOrEmails,
			role,
			message,
		} );

		papo.undocumented().sendInvites( siteId, usernamesOrEmails, role, message, ( error, data ) => {
			const validationErrors = get( data, 'errors' );
			const isErrored = !! error || ! isEmpty( validationErrors );

			Dispatcher.handleServerAction( {
				type: isErrored
					? ActionTypes.RECEIVE_SENDING_INVITES_ERROR
					: ActionTypes.RECEIVE_SENDING_INVITES_SUCCESS,
				error,
				siteId,
				usernamesOrEmails,
				role,
				message,
				formId,
				data,
			} );

			if ( isErrored ) {
				// If there are no validation errors but the form errored, assume that all errored
				const countErrors =
					error || isEmpty( validationErrors ) || 'object' !== typeof validationErrors
						? usernamesOrEmails.length
						: Object.keys( data.errors ).length;

				if ( countErrors === usernamesOrEmails.length ) {
					message = i18n.translate( 'Invitation failed to send', 'Invitations failed to send', {
						count: countErrors,
						context: 'Displayed in a notice when all invitations failed to send.',
					} );
				} else {
					message = i18n.translate(
						'An invitation failed to send',
						'Some invitations failed to send',
						{
							count: countErrors,
							context: 'Displayed in a notice when some invitations failed to send.',
						}
					);
				}

				dispatch( errorNotice( message ) );
			} else {
				dispatch(
					successNotice(
						i18n.translate( 'Invitation sent successfully', 'Invitations sent successfully', {
							count: usernamesOrEmails.length,
						} )
					)
				);
			}
		} );
	};
}


export function createInviteValidation( siteId, usernamesOrEmails, role ) {

	Dispatcher.handleViewAction( {
		type: ActionTypes.CREATE_INVITE_VALIDATION,
		siteId,
		usernamesOrEmails,
		role,
	} );

	papo.undocumented().createInviteValidation( siteId, usernamesOrEmails, role, ( error, data ) => {

		Dispatcher.handleServerAction( {
			type: error
				? ActionTypes.RECEIVE_CREATE_INVITE_VALIDATION_ERROR
				: ActionTypes.RECEIVE_CREATE_INVITE_VALIDATION_SUCCESS,
			error,
			siteId,
			usernamesOrEmails,
			role,
			data,
		} );
		if ( error ) {
			// analytics.tracks.recordEvent( 'calypso_invite_create_validation_failed' );
		} else {
			// analytics.tracks.recordEvent( 'calypso_invite_create_validation_success' );
		}
	} );
	
}
