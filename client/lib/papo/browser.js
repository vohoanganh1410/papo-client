/** @format */

/**
 * External dependencies
 */

import { SyncHandler, syncOptOut } from './sync-handler';
import debugFactory from 'debug';
const debug = debugFactory( 'papo:wp' );

/**
 * Internal dependencies
 */
import papoUndocumented from 'lib/papo/papo-undocumented';
import config from 'config';
// import wpcomSupport from 'lib/wp/support';
// import { injectLocalization } from './localization';
// import { injectGuestSandboxTicketHandler } from './handlers/guest-sandbox-ticket';
import * as oauthToken from 'lib/oauth-token';
import papoXhrWrapper from 'lib/papo/xhr-wrapper';
import papoProxyRequest from 'lib/papo/proxy-request';

const addSyncHandlerWrapper = config.isEnabled( 'sync-handler' );
let wpcom;

if ( config.isEnabled( 'oauth' ) ) {
	const requestHandler = addSyncHandlerWrapper ? new SyncHandler( papoXhrWrapper ) : papoXhrWrapper;

	wpcom = papoUndocumented( /*oauthToken.getToken(), */ requestHandler );
} else {
	const requestHandler = addSyncHandlerWrapper
		? new SyncHandler( papoProxyRequest )
		: papoProxyRequest;

	wpcom = papoUndocumented( requestHandler );

	// Upgrade to "access all users blogs" mode
	wpcom.request(
		{
			metaAPI: { accessAllUsersBlogs: true },
		},
		function( error ) {
			if ( error ) {
				throw error;
			}
			debug( 'Proxy now running in "access all user\'s blogs" mode' );
		}
	);
}

if ( addSyncHandlerWrapper ) {
	wpcom = syncOptOut( wpcom );
}

// if ( config.isEnabled( 'support-user' ) ) {
// 	wpcom = wpcomSupport( wpcom );
// }

// if ( 'development' === process.env.NODE_ENV ) {
// 	require( './offline-library' ).makeOffline( wpcom );

// 	// expose wpcom global var only in development
// 	const wpcomPKG = require( 'wpcom/package' );
// 	window.wpcom = wpcom;
// 	window.wpcom.__version = wpcomPKG.version;
// }

// Inject localization helpers to `wpcom` instance
// injectLocalization( wpcom );

// injectGuestSandboxTicketHandler( wpcom );

/**
 * Expose `wpcom`
 */
export default wpcom;
