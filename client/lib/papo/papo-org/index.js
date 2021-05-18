/**
 * Module dependencies.
 */
import debugModule from 'debug';

import requestHandler from 'lib/papo/xhr-request';
import Pinghub from './utils/pinghub';
import Request from './utils/request';

import Me from './lib/me';
import Site from './lib/site';
import Page from './lib/page';


/**
 * Local module constants
 */
const debug = debugModule( 'papo' );
const DEFAULT_ASYNC_TIMEOUT = 30000;

/**
 * XMLHttpRequest (and CORS) API access method.
 *
 * API authentication is done via an (optional) access `token`,
 * which needs to be retrieved via OAuth.
 *
 * Request Handler is optional and XHR is defined as default.
 *
 * @param {String} [token] - OAuth API access token
 * @param {Function} [reqHandler] - function Request Handler
 * @return {WPCOM} papo instance
 */
export default function PAPO( token, reqHandler ) {
	// console.log('token: ' + token);
	if ( ! ( this instanceof PAPO ) ) {
		return new PAPO( token, reqHandler );
	}

	// `token` is optional
	if ( 'function' === typeof token ) {
		reqHandler = token;
		token = null;
	}

	if ( token ) {
		debug( 'Token defined: %s…', token.substring( 0, 6 ) );
		this.token = token;
	}

	// Set default request handler
	if ( ! reqHandler ) {
		debug( 'No request handler. Adding default XHR request handler' );

		this.request = function( params, fn ) {
			params = params || {};

			// token is optional
			if ( token ) {
				params.authToken = token;
			}

			return requestHandler( params, fn );
		};
	} else {
		this.request = reqHandler;
	}

	// Add Req instance
	this.req = new Request( this );

	// Add Pinghub instance
	this.pinghub = new Pinghub( this );

	// Default api version;
	this.apiVersion = '1';
}

/**
 * Return `Me` object instance
 *
 * @return {Me} Me instance
 */
PAPO.prototype.me = function() {
	return new Me( this );
};

/**
 * Return `Site` object instance
 *
 * @param {String} id - site identifier
 * @return {Site} Site instance
 */
PAPO.prototype.site = function( id ) {
	return new Site( id, this );
};

/**
 * Return `Page` object instance
 *
 * @param {String} id - site identifier
 * @return {Page} Page instance
 */
PAPO.prototype.page = function( id ) {
	return new Page( id, this );
};

/**
 * Re-export all the class types.
 */
PAPO.Me = Me;
PAPO.Site = Site;
PAPO.Page = Page;

if ( ! Promise.prototype.timeout ) {
	/**
	* Returns a new promise with a deadline
	*
	* After the timeout interval, the promise will
	* reject. If the actual promise settles before
	* the deadline, the timer is cancelled.
	*
	* @param {number} delay how many ms to wait
	* @return {Promise} promise
	*/
	Promise.prototype.timeout = function( delay = DEFAULT_ASYNC_TIMEOUT ) {
		let cancelTimeout, timer, timeout;

		timeout = new Promise( ( resolve, reject ) => {
			timer = setTimeout( () => {
				reject( new Error( 'Action timed out while waiting for response.' ) );
			}, delay );
		} );

		cancelTimeout = () => {
			clearTimeout( timer );
			return this;
		};

		return Promise.race( [
			this.then( cancelTimeout ).catch( cancelTimeout ),
			timeout
		] );
	};
}