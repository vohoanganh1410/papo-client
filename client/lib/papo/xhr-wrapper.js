/** @format */

/**
 * External dependencies
 */

import xhr from 'lib/papo/xhr-request';
import debugModule from 'debug';

/**
 * Module variables
 */
const debug = debugModule( 'papo:wpcom-xhr-wrapper' );

export default function( params, callback ) {
	return xhr( params, function( error, response, headers ) {
		if ( error && error.name === 'InvalidTokenError' ) {
			debug( 'Invalid token error detected, authorisation probably revoked - logging out' );
			require( 'lib/user/utils' ).logout();
		}

		callback( error, response, headers );
	} );
}
