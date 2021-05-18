/** @format */

/**
 * External dependencies
 */

import debugFactory from 'debug';

const debug = debugFactory( 'papo:papo-undocumented:me' );

function MePreferences( wpcom ) {
	if ( ! ( this instanceof MePreferences ) ) {
		return new MePreferences( this.wpcom );
	}

	this.wpcom = wpcom;
}

MePreferences.prototype.get = function( query, fn ) {
	debug( 'get preferences', query );
	return this.wpcom.req.get( '/auth/me/preferences', query, fn );
};

MePreferences.prototype.update = function( query, body, fn ) {
	debug( 'update preferences', query );
	return this.wpcom.req.put( '/auth/me/preferences', query, body, fn );
};

export default MePreferences;
