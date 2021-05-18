/** @format */

/**
 * External dependencies
 */

import { assign, includes } from 'lodash';

/**
 * Internal dependencies
 */
import config from 'config';
import { decodeEntities } from '../formatting';
import { withoutHttp } from '../url';

/**
 * Module variables
 */
// const languages = config( 'languages' );

export function getLanguage( slug ) {
	// const { length: len } = languages;
	// let language;
	// for ( let index = 0; index < len; index++ ) {
	// 	if ( slug === languages[ index ].langSlug ) {
	// 		language = languages[ index ];
	// 		break;
	// 	}
	// }

	return 'en';
}

function getSiteSlug( url ) {
	const slug = withoutHttp( url );
	return slug.replace( /\//g, '::' );
}

export function filterUserObject( obj ) {
	const user = {};
	const allowedKeys = [
		'auth_data',
		'auth_service',
		'create_at',
		'delete_at',
		'email',
		'email_verified',
		'first_name',
		'id',
		'last_name',
		'last_password_update',
		'locale',
		'nickname',
		'notify_props',
		'position',
		'roles',
		'timezone',
		'update_at',
		'username',
		'site_count',
		'facebook_token',
		'visible_site_count',
	];
	const decodeWhitelist = [ 'auth_data', 'id', 'username' ];

	allowedKeys.forEach( function( key ) {
		user[ key ] =
			obj[ key ] && includes( decodeWhitelist, key ) ? decodeEntities( obj[ key ] ) : obj[ key ];
	} );

	return assign( user, getComputedAttributes( obj ) );
}

export function getComputedAttributes( attributes ) {
	const language = getLanguage( attributes.language );
	return {
		localeSlug: attributes.language,
		localeVariant: attributes.locale_variant,
		isRTL: /*!! ( language && language.rtl )*/false,
	};
}
