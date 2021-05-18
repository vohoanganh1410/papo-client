/** @format */

/**
 * External dependencies
 */

import papoFactory from '../papo-org';
import inherits from 'inherits';
import { assign } from 'lodash';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import Undocumented from './lib/undocumented';

const debug = debugFactory( 'papo:wpcom-undocumented' );

/**
 * Class inherited from `WPCOMUnpublished` class and adds
 * specific methods useful for wp-calypso.
 *
 * @param {String} [token] - oauth token
 * @param {Function} [reqHandler] - request handler
 * @return {NUll} null
 */
function PAPOUndocumented( token, reqHandler ) {
	if ( ! ( this instanceof PAPOUndocumented ) ) {
		return new PAPOUndocumented( token, reqHandler );
	}

	if ( 'function' === typeof token ) {
		reqHandler = token;
		token = null;
	} else if ( token ) {
		this.loadToken( token );
	}

	papoFactory.call( this, token, function( params, fn ) {
		if ( this.isTokenLoaded() ) {
			// authToken is used in wpcom-xhr-request,
			// which is used for the signup flow in the REST Proxy
			params = assign( {}, params, { authToken: this._token, token: this._token } );
		}

		return reqHandler( params, fn );
	} );

	debug( 'Extending wpcom with undocumented endpoints.' );
}

inherits( PAPOUndocumented, papoFactory );

/**
 * Get `Undocumented` object instance
 *
 * @return {Undocumented} Undocumented instance
 */
PAPOUndocumented.prototype.undocumented = function() {
	return new Undocumented( this );
};

/**
 * Add a token to this instance of WPCOM.
 * When loaded, the token is applied to the param object of each subsequent request.
 *
 * @param {String} [token] - oauth token
 */
papoFactory.prototype.loadToken = function( token ) {
	this._token = token;
};

/**
 * Returns a boolean representing whether or not the token has been loaded.
 *
 * @return {String} oauth token
 */
PAPOUndocumented.prototype.isTokenLoaded = function() {
	return this._token !== undefined;
};

/**
 * Expose `PAPOUndocumented`
 */
export default PAPOUndocumented;
