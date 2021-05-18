/** @format */

/**
 * External dependencies
 */

import React from 'react';
import { startsWith } from 'lodash';
import page from 'page';

/**
 * Internal dependencies
 */
// import OAuthLogin from './login';
// import ConnectComponent from './connect';
import * as OAuthToken from 'lib/oauth-token';
// import wpcom from 'lib/wp';
import config from 'config';
// import store from 'store';
// import WPOAuth from 'wpcom-oauth';
import userFactory from 'lib/user';
import Main from 'components/main';
import PulsingDot from 'components/pulsing-dot';

export default {
	checkToken: function( context, next ) {
		const loggedOutRoutes = [
				'/oauth-login',
				'/oauth',
				'/start',
				'/authorize',
				'/api/oauth/token',
				'/log-in'
			],
			isValidSection = loggedOutRoutes.some( route => startsWith( context.path, route ) );

		// Check we have an OAuth token, otherwise redirect to auth/login page
		if ( typeof document !== 'undefined' /*&& OAuthToken.getToken() === false*/ && ! isValidSection ) {
			if ( config( 'env_id' ) === 'desktop' ) {
				return page( config( 'login_url' ) );
			}

			return page( '/authorize' );
		}

		next();
	},
}