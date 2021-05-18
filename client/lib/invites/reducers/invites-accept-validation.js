/** @format */

/**
 * External dependencies
 */

import { fromJS } from 'immutable';
import { mapValues } from 'lodash';

/**
 * Internal dependencies
 */
import { action as ActionTypes } from 'lib/invites/constants';
import { decodeEntities } from 'lib/formatting';

const initialState = fromJS( {
	list: {},
	errors: {},
} );

function filterObjectProperties( object ) {
	return mapValues( object, value => {
		if ( 'object' === typeof value ) {
			return filterObjectProperties( value );
		}

		return value ? decodeEntities( value ) : value;
	} );
}

function normalizeInvite( data ) {
	return {
		inviteKey: data.invite.invite_key,
		date: data.invite.invite_date,
		role: decodeEntities( data.invite.role ),
		sentTo: decodeEntities( data.invite.user.email ),
		userId: data.invite.user._id,
		forceMatchingEmail: /*data.invite.meta.force_matching_email*/true, // if true, only people who's invited can seen
		site: data.invite.site,
		inviter: filterObjectProperties( data.invite.invited_by ),
		knownUser: /*data.invite.meta.known*/true,
	};
}

const reducer = ( state = initialState, payload ) => {
	const { action } = payload;
	switch ( action.type ) {
		case ActionTypes.RECEIVE_INVITE:
			// console.log( action.inviteKey );
			return state.setIn(
				[ 'list', action.siteId, action.inviteKey ],
				normalizeInvite( action.data )
			);
		case ActionTypes.RECEIVE_INVITE_ERROR:
			return state.setIn( [ 'errors', action.siteId, action.inviteKey ], action.error );
	}
	return state;
};

export { initialState, reducer };
