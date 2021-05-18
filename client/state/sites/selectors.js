// /** @format */
//
// /**
//  * External dependencies
//  */
//
// import {
// 	compact,
// 	every,
// 	filter,
// 	find,
// 	flowRight as compose,
// 	get,
// 	has,
// 	map,
// 	partialRight,
// 	some,
// 	split,
// 	includes,
// 	startsWith,
// } from 'lodash';
// import i18n from 'i18n-calypso';
// import moment from 'moment';
//
// /**
//  * Internal dependencies
//  */
// import config from 'config';
// import { isHttps, withoutHttp, addQueryArgs, urlToSlug } from 'lib/url';
//
// /**
//  * Internal dependencies
//  */
// import createSelector from 'lib/create-selector';
// // import { fromApi as seoTitleFromApi } from 'components/seo/meta-title-editor/mappings';
// import versionCompare from 'lib/version-compare';
// // import { getCustomizerFocus } from 'my-sites/customize/panels';
// import { getSiteComputedAttributes } from './utils';
// import { getSiteOptions, getSitesItems } from 'state/selectors';
//
// /**
//  * Returns a raw site object by its ID.
//  *
//  * @param  {Object}  state  Global state tree
//  * @param  {Number}  siteId Site ID
//  * @return {?Object}        Site object
//  */
// export const getRawSite = ( state, siteId ) => {
// 	return getSitesItems( state )[ siteId ] || null;
// };
//
// /**
//  * Returns a site object by its slug.
//  *
//  * @param  {Object}  state     Global state tree
//  * @param  {String}  siteSlug  Site URL
//  * @return {?Object}           Site object
//  */
// export const getSiteBySlug = createSelector(
// 	( state, siteSlug ) =>
// 		find( getSitesItems( state ), site => getSiteSlug( state, site.ID ) === siteSlug ) || null,
// 	getSitesItems
// );
//
// /**
//  * Memoization cache for the `getSite` selector
//  */
// let getSiteCache = new WeakMap();
//
// /**
//  * Returns a normalized site object by its ID or site slug.
//  *
//  * @param  {Object}  state  Global state tree
//  * @param  {Number|String}  siteIdOrSlug Site ID or site slug
//  * @return {?Object}        Site object
//  */
// export function getSite( state, siteIdOrSlug ) {
// 	const rawSite = getRawSite( state, siteIdOrSlug ) || getSiteBySlug( state, siteIdOrSlug );
// 	if ( ! rawSite ) {
// 		return null;
// 	}
//
// 	// Use the rawSite object itself as a WeakMap key
// 	const cachedSite = getSiteCache.get( rawSite );
// 	if ( cachedSite ) {
// 		return cachedSite;
// 	}
//
// 	const site = {
// 		...rawSite,
// 		...getSiteComputedAttributes( state, rawSite.ID ),
// 		// ...getJetpackComputedAttributes( state, rawSite.ID ),
// 	};
//
// 	// Once the `rawSite` object becomes outdated, i.e., state gets updated with a newer version
// 	// and no more references are held, the key will be automatically removed from the WeakMap.
// 	getSiteCache.set( rawSite, site );
// 	return site;
// }
//
// /**
//  * Returns a title by which the site can be canonically referenced. Uses the
//  * site's name if available, falling back to its domain. Returns null if the
//  * site is not known.
//  *
//  * @param  {Object}  state  Global state tree
//  * @param  {Number}  siteId Site ID
//  * @return {?String}        Site title
//  */
// export function getSiteTitle( state, siteId ) {
// 	return siteId;
// 	// const site = getRawSite( state, siteId );
// 	// if ( ! site ) {
// 	// 	return null;
// 	// }
//
// 	// if ( site.name ) {
// 	// 	return site.name.trim();
// 	// }
//
// 	// return getSiteDomain( state, siteId );
// }
//
// /**
//  * Returns the domain for a site, or null if the site is unknown.
//  *
//  * @param  {Object}  state  Global state tree
//  * @param  {Number}  siteId Site ID
//  * @return {?String}        Site domain
//  */
// export function getSiteDomain( state, siteId ) {
// 	return siteId;
// 	// if ( getSiteOption( state, siteId, 'is_redirect' ) || isSiteConflicting( state, siteId ) ) {
// 	// 	return getSiteSlug( state, siteId );
// 	// }
//
// 	// const site = getRawSite( state, siteId );
//
// 	// if ( ! site ) {
// 	// 	return null;
// 	// }
//
// 	// return withoutHttp( site.URL );
// }
//
// /**
//  * Returns true if the site can be previewed, false if the site cannot be
//  * previewed, or null if preview ability cannot be determined. This indicates
//  * whether it is safe to embed iframe previews for the site.
//  *
//  * @param  {Object}   state  Global state tree
//  * @param  {Number}   siteId Site ID
//  * @return {?Boolean}        Whether site is previewable
//  */
// export function isSitePreviewable( state, siteId ) {
// 	return false;
// 	// if ( ! config.isEnabled( 'preview-layout' ) ) {
// 	// 	return false;
// 	// }
//
// 	// const site = getRawSite( state, siteId );
// 	// if ( ! site ) {
// 	// 	return null;
// 	// }
//
// 	// if ( site.is_vip ) {
// 	// 	return false;
// 	// }
//
// 	// const unmappedUrl = getSiteOption( state, siteId, 'unmapped_url' );
// 	// return !! unmappedUrl && isHttps( unmappedUrl );
// }
//
// /**
//  * Returns the slug for a site, or null if the site is unknown.
//  *
//  * @param  {Object}  state  Global state tree
//  * @param  {Number}  siteId Site ID
//  * @return {?String}        Site slug
//  */
// export const getSiteSlug = createSelector(
// 	( state, siteId ) => {
// 		const site = getRawSite( state, siteId );
// 		if ( ! site ) {
// 			return null;
// 		}
//
// 		if ( getSiteOption( state, siteId, 'is_redirect' ) || isSiteConflicting( state, siteId ) ) {
// 			return withoutHttp( getSiteOption( state, siteId, 'unmapped_url' ) );
// 		}
//
// 		return urlToSlug( site.URL );
// 	},
// 	[ getSitesItems ]
// );
//
// /**
//  * Returns true if a collision exists for the specified WordPress.com site ID.
//  *
//  * @param  {Object}  state  Global state tree
//  * @param  {Number}  siteId Site ID
//  * @return {Boolean}        Whether collision exists
//  */
// export function isSiteConflicting( state, siteId ) {
// 	return includes( getSiteCollisions( state ), siteId );
// }
//
// /**
//  * Returns a filtered array of WordPress.com site IDs where a Jetpack site
//  * exists in the set of sites with the same URL.
//  *
//  * @param  {Object}   state Global state tree
//  * @return {Number[]}       WordPress.com site IDs with collisions
//  */
// export const getSiteCollisions = createSelector(
// 	state =>
// 		map(
// 			filter( getSitesItems( state ), wpcomSite => {
// 				const wpcomSiteUrlSansProtocol = withoutHttp( wpcomSite.URL );
// 				return (
// 					! wpcomSite.jetpack &&
// 					some(
// 						getSitesItems( state ),
// 						jetpackSite =>
// 							jetpackSite.jetpack && wpcomSiteUrlSansProtocol === withoutHttp( jetpackSite.URL )
// 					)
// 				);
// 			} ),
// 			'ID'
// 		),
// 	getSitesItems
// );
//
// /**
//  * Returns a site option for a site
//  *
//  * @param  {Object}  state  Global state tree
//  * @param  {Number}  siteId Site ID
//  * @param  {String}  optionName The option key
//  * @return {*}  The value of that option or null
//  */
// export function getSiteOption( state, siteId, optionName ) {
// 	return get( getSiteOptions( state, siteId ), optionName, null );
// }
//
// /**
//  * Returns true if we are requesting all sites.
//  * @param {Object}    state  Global state tree
//  * @return {Boolean}        Request State
//  */
// export function isRequestingSites( state ) {
// 	return !! state.sites.requestingAll;
// }
//
// /**
//  * Returns true if a network request is in progress to fetch the specified, or
//  * false otherwise.
//  *
//  * @param  {Object}  state  Global state tree
//  * @param  {Number}  siteId Site ID
//  * @return {Boolean}        Whether request is in progress
//  */
// export function isRequestingSite( state, siteId ) {
// 	return !! state.sites.requesting[ siteId ];
// }
//
// /**
//  * Returns the ID of the static page set as the front page, or 0 if a static page is not set.
//  *
//  * @param {Object} state Global state tree
//  * @param {Object} siteId Site ID
//  * @return {Number} ID of the static page set as the front page, or 0 if a static page is not set
//  */
// export function getSiteFrontPage( state, siteId ) {
// 	return getSiteOption( state, siteId, 'page_on_front' );
// }
//
// /**
//  * Returns the ID of the static page set as the page for posts, or 0 if a static page is not set.
//  *
//  * @param {Object} state Global state tree
//  * @param {Object} siteId Site ID
//  * @return {Number} ID of the static page set as page for posts, or 0 if a static page is not set
//  */
// export function getSitePostsPage( state, siteId ) {
// 	return getSiteOption( state, siteId, 'page_for_posts' );
// }
//
// /**
//  * Returns the front page type.
//  *
//  * @param {Object} state Global state tree
//  * @param {Object} siteId Site ID
//  * @return {String} 'posts' if blog posts are set as the front page or 'page' if a static page is
//  */
// export function getSiteFrontPageType( state, siteId ) {
// 	return getSiteOption( state, siteId, 'show_on_front' );
// }
//
// /**
//  * Returns true if the site is using a static front page
//  *
//  * @param {Object} state Global state tree
//  * @param {Object} siteId Site ID
//  * @return {Boolean} False if not set or set to `0`. True otherwise.
//  */
// export function hasStaticFrontPage( state, siteId ) {
// 	return !! getSiteFrontPage( state, siteId );
// }
//
// /**
//  * Returns whether all sites have been fetched.
//  * @param {Object}    state  Global state tree
//  * @return {Boolean}        Request State
//  */
// export function hasAllSitesList( state ) {
// 	return !! state.sites.hasAllSitesList;
// }
// /**
//  * Returns true if site has only a single user, false if the site not a single
//  * user site, or null if the site is unknown.
//  *
//  * @param  {Object}   state  Global state tree
//  * @param  {Number}   siteId Site ID
//  * @return {?Boolean}        Whether site is a single user site
//  */
// export function isSingleUserSite( state, siteId ) {
// 	return get( getSite( state, siteId ), 'single_user_site', null );
// }
