/** @format */

/**
 * External dependencies
 */

import cookie from 'cookie';
import store from 'store';

/**
 * Module variables
 */
const TOKEN_NAME = 'papoweb_token';
const MAX_AGE = 365 * 24 * 60 * 60 * 1000; // How long to store the OAuth cookie

export function getToken() {
	// if( ! document ) return;
	// var document = typeof document === 'undefined' ? null : document;
	if( typeof document === 'undefined' ) return false;
	let cookies = cookie.parse( document.cookie );

	if ( typeof cookies[ TOKEN_NAME ] !== 'undefined' ) {
		return cookies[ TOKEN_NAME ];
	}

	const token = store.get( TOKEN_NAME );

	if ( token ) {
		return token;
	}

	return false;
}

export function setToken( token ) {
	// if( typeof document === 'undefined' ) return false;
	// TODO: Support secure cookies if this is ever used outside of the desktop app
	document.cookie = cookie.serialize( TOKEN_NAME, token, { maxAge: MAX_AGE } );
}

export function clearToken() {
	if( typeof document === 'undefined' ) return false;
	let cookies = cookie.parse( document.cookie );

	if ( typeof cookies[ TOKEN_NAME ] !== 'undefined' ) {
		document.cookie = cookie.serialize( TOKEN_NAME, false, { maxAge: -1 } );
	}
}
