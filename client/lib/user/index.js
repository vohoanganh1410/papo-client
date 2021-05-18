/** @format */

/**
 * External dependencies
 */

import Dispatcher from 'dispatcher';

/**
 * Internal Dependencies
 */
import { action as InvitesActionTypes } from 'lib/invites/constants';
import {
	SITE_CREATE_SUCCESS,

} from 'state/action-types';
import User from './user';
let _user = false;

export default function() {
	if ( ! _user ) {
		_user = new User();
	}
	return _user;
}

User.dispatchToken = Dispatcher.register( function( payload ) {
	var action = payload.action;
	switch ( action.type ) {
		// case InvitesActionTypes.INVITE_ACCEPTED:
		// 	if ( [ 'follower', 'viewer' ].indexOf( action.invite.role ) === -1 ) {
		// 		_user.incrementSiteCount();
		// 	}
		// 	break;
		case SITE_CREATE_SUCCESS:
		case InvitesActionTypes.INVITE_ACCEPTED:
			_user.incrementSiteCount();
			break;
		default:
			break;

	}
} );
