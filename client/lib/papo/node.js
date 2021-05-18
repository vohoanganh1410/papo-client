/** @format */

/**
 * Internal dependencies
 */
import papoUndocumented from './papo-undocumented';
import config from 'config';
// import { injectLocalization } from './localization';
// import wpSupportWrapper from 'lib/wp/support';
import papoXhrRequest from './xhr-request';

// OAuthToken.getToken(), 
let papo = papoUndocumented( papoXhrRequest );

// if ( config.isEnabled( 'support-user' ) ) {
// 	papo = wpSupportWrapper( wpcom );
// }

// Inject localization helpers to `wpcom` instance
// wpcom = injectLocalization( wpcom );

export default papo;
