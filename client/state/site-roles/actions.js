/** @format */

/**
 * Internal dependencies
 */
import request from 'superagent';
import config from 'config';

import papo from 'lib/papo';
import {
	SITE_ROLES_RECEIVE,
	SITE_ROLES_REQUEST,
	SITE_ROLES_REQUEST_FAILURE,
	SITE_ROLES_REQUEST_SUCCESS,
} from 'state/action-types';

export function requestSiteRoles( siteId ) {
	return dispatch => {
		dispatch( {
			type: SITE_ROLES_REQUEST,
			siteId,
		} );

		return papo
			.undocumented()
			.site( siteId )
			.getRoles()
			.then( ( { roles } ) => {
				console.log( roles );
				dispatch( {
					type: SITE_ROLES_REQUEST_SUCCESS,
					siteId,
				} );

				dispatch( {
					type: SITE_ROLES_RECEIVE,
					siteId,
					roles,
				} );
			} )
			.catch( () => {
				dispatch( {
					type: SITE_ROLES_REQUEST_FAILURE,
					siteId,
				} );
			} );
	};
}
