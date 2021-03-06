/** @format */

/**
 * External dependencies
 */

import { get, isEmpty } from 'lodash';

/**
 * Returns a user object by user ID.
 *
 *
 * @format
 * @param {Number} userId User ID
 * @return {Object}        User object
 */
export function getUser( state ) {
	return state.currentUser && ! isEmpty( state.currentUser.data ) ? state.currentUser.data : null;
}

export function getFacebookUser( state ) {
	const user = getUser( state );

	const fbu = {
		id: user.auth_data,
		name: user.first_name,
	};

	return fbu;
}

/**
 * Returns the current user ID
 *
 * @param  {Object}  state  Global state tree
 * @return {?Number}        Current user ID
 */
export function getCurrentUserId( state ) {
	return get( state, [ 'oauthUser', 'id' ] );
}

/**
 * Returns the user object for the current user.
 *
 * @param  {Object}  state  Global state tree
 * @return {?Object}        Current user
 */
export function getCurrentUser( state ) {
	return getUser( state );
}

/**
 * Returns a selector that fetches a property from the current user object
 * @param {String} path Path to the property in the user object
 * @param {?Any} otherwise A default value that is returned if no user or property is found
 * @returns {function} A selector which takes the state as a parameter
 */
export const createCurrentUserSelector = ( path, otherwise = null ) => state => {
	const user = getCurrentUser( state );
	return get( user, path, otherwise );
};

/**
 * Returns the locale slug for the current user.
 *
 * @param  {Object}  state  Global state tree
 * @return {?String}        Current user locale
 */
export const getCurrentUserLocale = createCurrentUserSelector( 'localeSlug' );

/**
 * Returns the locale variant slug for the current user.
 * @param  {Object}  state  Global state tree
 * @return {?String}        Current user locale variant
 */
export const getCurrentUserLocaleVariant = createCurrentUserSelector( 'localeVariant' );

/**
 * Returns the country code for the current user.
 *
 * @param  {Object}  state  Global state tree
 * @return {?String}        Current user country code
 */
export const getCurrentUserCountryCode = createCurrentUserSelector( 'user_ip_country_code' );

/**
 * Returns the number of sites for the current user.
 *
 * @param  {Object}  state  Global state tree
 * @return {?Number}        Current user site count
 */
export function getCurrentUserSiteCount( state ) {
	const user = getCurrentUser( state );
	if ( ! user ) {
		return null;
	}

	return user.site_count || 0;
}

/**
 * Returns the number of visible sites for the current user.
 *
 * @param  {Object}  state  Global state tree
 * @return {?Number}        Current user visible site count
 */
export function getCurrentUserVisibleSiteCount( state ) {
	const user = getCurrentUser( state );
	if ( ! user ) {
		return null;
	}

	return user.visible_site_count || 0;
}

/**
 * Returns the currency code for the current user.
 *
 * @param  {Object}  state  Global state tree
 * @return {?String}        Current currency code
 */
export function getCurrentUserCurrencyCode( state ) {
	return state.currentUser.currencyCode;
}

/**
 * Returns the date (of registration) for the current user.
 *
 * @param  {Object}  state  Global state tree
 * @return {?String}        Date of registration for user
 */
export const getCurrentUserDate = createCurrentUserSelector( 'date' );

/**
 *  Returns the primary email of the current user.
 *
 *  @param {Object} state Global state tree
 *  @returns {?String} The primary email of the current user.
 */
export const getCurrentUserEmail = createCurrentUserSelector( 'email' );

/**
 * Returns true if the capability name is valid for the current user on a given
 * site, false if capabilities are known for the site but the name is invalid,
 * or null if capabilities are not known for the site.
 *
 * @param  {Object}   state      Global state tree
 * @param  {Number}   siteId     Site ID
 * @param  {String}   capability Capability name
 * @return {?Boolean}            Whether capability name is valid
 */
export function isValidCapability( state, siteId, capability ) {
	// return true; // ph???i s???a
	const capabilities = state.currentUser.capabilities[ siteId ];
	if ( ! capabilities ) {
		return null;
	}

	return capabilities.hasOwnProperty( capability );
}

/**
 * Returns true if the specified flag is enabled for the user
 * @param  {Object}   state      Global state tree
 * @param {String}    flagName   Flag name
 * @returns {boolean}            Whether the flag is enabled for the user
 */
export function currentUserHasFlag( state, flagName ) {
	return state.currentUser.flags.indexOf( flagName ) !== -1;
}

/**
 * Returns true if the current user is email-verified.
 *
 * @param   {Object } state Global state tree
 * @returns {boolean}       Whether the current user is email-verified.
 */
export const isCurrentUserEmailVerified = createCurrentUserSelector( 'email_verified', false );

/**
 * Returns invites list for the current user.
 *
 * @param  {Object}  state  Global state tree
 * @return {Array}        User invites list
 */
export function getMeInvites( state ) {
	// console.log( state );
	return state.currentUser ? state.currentUser.invites : [];
}

/**
 * Returns true if currently requesting invites for the given site, or false
 * otherwise.
 *
 * @param  {Object}  state  Global state tree
 * @param  {Number}  siteId Site ID
 * @return {Boolean}        Whether invites are being requested
 */
export function isRequestingMeInvites( state ) {
	return !! state.currentUser.requestingMeInvites;
}

export function getMyTeams( state ) {
	return state.currentUser.teams;
}

export function getSelectedTeam( state ) {
	return state.currentUser.selectedTeam;
}

export function getTeamFromName( state, name ) {
	return get( state.currentUser.teams.name, name );
}
