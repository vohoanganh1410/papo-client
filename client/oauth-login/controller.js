/** @format */

/**
 * External dependencies
 */
import page from 'page';
import { parse } from 'qs';
import React from 'react';
import { includes, map } from 'lodash';
import { parse as parseUrl } from 'url';

/**
 * Internal dependencies
 */
import config from 'config';
import PAPOLogin from './papo-login';

// We cannot export it from either of those (to import it from the other) because of
// the way that `server/bundler/loader` expects only a default export and nothing else.
export const lang = `:lang(${ map( config( 'languages' ), 'langSlug' ).join( '|' ) })?`;

const enhanceContextWithLogin = context => {
	const { params: { flow, isJetpack, socialService, twoFactorAuthType }, path } = context;
	
	// console.log( context );

	context.cacheQueryKeys = [ 'client_id', 'signup_flow' ];

	context.primary = (
		<PAPOLogin
			isJetpack={ isJetpack === 'jetpack' }
			path={ path }
			twoFactorAuthType={ twoFactorAuthType }
			socialService={ socialService }
			socialServiceResponse={ context.hash }
			socialConnect={ flow === 'social-connect' }
			privateSite={ flow === 'private-site' }
		/>
	);
};

export function login( context, next ) {
	const { query: { client_id, redirect_to } } = context;

	if ( client_id ) {
		if ( ! redirect_to ) {
			const error = new Error( 'The `redirect_to` query parameter is missing.' );
			error.status = 401;
			return next( error );
		}

		const parsedRedirectUrl = parseUrl( redirect_to );
		const redirectQueryString = parse( parsedRedirectUrl.query );

		if ( client_id !== redirectQueryString.client_id ) {
			// recordTracksEvent( 'calypso_login_phishing_attempt', context.query );

			const error = new Error(
				'The `redirect_to` query parameter is invalid with the given `client_id`.'
			);
			error.status = 401;
			return next( error );
		}

		context.store
			.dispatch( fetchOAuth2ClientData( Number( client_id ) ) )
			.then( () => {
				enhanceContextWithLogin( context );

				next();
			} )
			.catch( error => next( error ) );
	} else {
		enhanceContextWithLogin( context );

		next();
	}
}

export function redirectDefaultLocale( context, next ) {
	// Only handle simple routes
	if ( context.pathname !== '/log-in/en' && context.pathname !== '/log-in/jetpack/en' ) {
		return next();
	}

	// Do not redirect if user bootrapping is disabled
	if (
		! getCurrentUser( context.store.getState() ) &&
		! config.isEnabled( 'wpcom-user-bootstrap' )
	) {
		return next();
	}

	// Do not redirect if user is logged in and the locale is different than english
	// so we force the page to display in english
	const currentUserLocale = getCurrentUserLocale( context.store.getState() );
	if ( currentUserLocale && currentUserLocale !== 'en' ) {
		return next();
	}

	if ( context.params.isJetpack === 'jetpack' ) {
		context.redirect( '/log-in/jetpack' );
	} else {
		context.redirect( '/log-in' );
	}
}

export function redirectJetpack( context, next ) {
	
	const { isJetpack } = context.params;
	const { redirect_to } = context.query;

	/**
	 * Send arrivals from the jetpack connect process (when site user email matches
	 * a wpcom account) to the jetpack branded login.
	 *
	 * A direct redirect to /log-in/jetpack is not currently done at jetpack.wordpress.com
	 * because the iOS app relies on seeing a request to /log-in$ to show its
	 * native credentials form.
	 */
	if ( isJetpack !== 'jetpack' && includes( redirect_to, 'jetpack/connect' ) ) {
		return context.redirect( context.path.replace( 'log-in', 'log-in/jetpack' ) );
	}
	next();
}