/**
 * Module dependencies
 */

import * as OAuthToken from 'lib/oauth-token';
 /**
 * Create `Me` instance
 *
 * @param {WPCOM} wpcom - wpcom instance
 * @return {Null} null
 */
export default function Me( wpcom ) {
	if ( ! ( this instanceof Me ) ) {
		return new Me( wpcom );
	}

	this.wpcom = wpcom;
}

/**
 * Meta data about auth token's User
 *
 * @param {Object} [query] - query object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Me.prototype.get = function( query, fn ) {
	// set req settings useBasePath = false to let path like: https://example.com/oauth/me
	var args = {
		apiVersion: '2',
		apiNamespace: 'oauth',
		path: '/me',
		sendCredentials: true,
	};
	return this.wpcom.req.get( args, query, fn );
};

/**
 * A list of the current user's sites
 *
 * @param {Object} [query] - query object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Me.prototype.sites = function( query, fn ) {
	return this.wpcom.req.get( '/me/sites', query, fn );
};

/**
 * Create new Site
 * @param {Object} [query] - query object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Me.prototype.createSite = function( query, fn ) {
	return this.wpcom.req.post( '/me/sites/new', query, fn );
}

/**
 * Get a list of invites of from the user
 *
 * *Example:*
 *    // Get posts list
 *    wpcom
 *    .me()
 *    .invitesList( function( err, data ) {
 *      // invites list data object
 *    } );
 *
 * @param {Object} [query] - query object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Me.prototype.invitesList = function( query, fn ) {
	return this.wpcom.req.get( '/me/invites', query, fn );
};