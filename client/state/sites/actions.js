/** @format */

/**
 * External dependencies
 */

import { omit, find } from 'lodash';
import i18n from 'i18n-calypso';
import request from 'superagent';
import config from 'config';

/**
 * Internal dependencies
 */
// import wpcom from 'lib/wp';
import {
	SITE_DELETE,
	SITE_DELETE_FAILURE,
	SITE_DELETE_RECEIVE,
	SITE_DELETE_SUCCESS,
	SITE_RECEIVE,
	SITE_REQUEST,
	SITE_REQUEST_FAILURE,
	SITE_REQUEST_SUCCESS,
	SITES_RECEIVE,
	SITES_REQUEST,
	SITES_REQUEST_SUCCESS,
	SITES_REQUEST_FAILURE,
	SITE_PLUGIN_UPDATED,
} from 'state/action-types';

import papo from 'lib/papo';

/**
 * Returns an action object to be used in signalling that a site has been
 * deleted.
 *
 * @param  {Number} siteId  ID of deleted site
 * @param  {Boolean} silent Indicates to not show the global notice after the site is removed from the state.
 * @return {Object}         Action object
 */
export function receiveDeletedSite( siteId, silent = false ) {
	return {
		type: SITE_DELETE_RECEIVE,
		siteId,
		silent,
	};
}

/**
 * Returns an action object to be used in signalling that a site object has
 * been received.
 *
 * @param  {Object} site Site received
 * @return {Object}      Action object
 */
export function receiveSite( site ) {
	return {
		type: SITE_RECEIVE,
		site,
	};
}

/**
 * Returns an action object to be used in signalling that site objects have
 * been received.
 *
 * @param  {Object[]} sites Sites received
 * @return {Object}         Action object
 */
export function receiveSites( sites ) {
	return {
		type: SITES_RECEIVE,
		sites,
	};
}

/**
 * Triggers a network request to request all visible sites
 * @returns {Function}        Action thunk
 */
export function requestSites() {
	return dispatch => {
		dispatch( {
			type: SITES_REQUEST,
		} );

		return papo
			.me()
			.sites( {
				apiVersion: '1.1',
				site_visibility: 'all',
				include_domain_only: true,
				site_activity: 'active',
				fields:
					'ID,URL,name,capabilities,jetpack,visible,is_private,is_vip,icon,plan,jetpack_modules,single_user_site,is_multisite,options', //eslint-disable-line max-len
				options:
					'is_mapped_domain,unmapped_url,admin_url,is_redirect,is_automated_transfer,allowed_file_types,show_on_front,main_network_site,jetpack_version,software_version,default_post_format,created_at,frame_nonce,publicize_permanently_disabled,page_on_front,page_for_posts,advanced_seo_front_page_description,advanced_seo_title_formats,verification_services_codes,podcasting_archive,is_domain_only,default_sharing_status,default_likes_enabled,wordads,upgraded_filetypes_enabled,videopress_enabled,permalink_structure,gmt_offset,is_wpcom_store,signup_is_store,has_pending_automated_transfer,woocommerce_is_active,design_type,site_goals', //eslint-disable-line max-len
			} )
			.then( response => {
				console.log( response.sites );
				dispatch( receiveSites( response.sites ) );
				dispatch( {
					type: SITES_REQUEST_SUCCESS,
				} );
			} )
			.catch( error => {
				dispatch( {
					type: SITES_REQUEST_FAILURE,
					error,
				} );
			} );

		// return request
		// 		.get( `${ config( 'api_url' ) }/api/v1/me/sites` )
		// 		.withCredentials()
		// 		.then( response => {
		// 			// console.log(response);
		// 			dispatch( receiveSites( response.body.sites ) );
		// 			dispatch( {
		// 				type: SITES_REQUEST_SUCCESS,
		// 			} );
		// 		} )
		// 		.catch( error => {
		// 			dispatch( {
		// 				type: SITES_REQUEST_FAILURE,
		// 				error,
		// 			} );
		// 		} );

		// return fake()
		// 		.then( response => {
		// 				dispatch( receiveSites( response.sites ) );
		// 				dispatch( {
		// 					type: SITES_REQUEST_SUCCESS,
		// 				} );
		// 			} )
		// 			.catch( error => {
		// 				dispatch( {
		// 					type: SITES_REQUEST_FAILURE,
		// 					error,
		// 				} );
		// 			} );

		// return wpcom
		// 	.me()
		// 	.sites( {
		// 		apiVersion: '1.2',
		// 		site_visibility: 'all',
		// 		include_domain_only: true,
		// 		site_activity: 'active',
		// 		fields:
		// 			'ID,URL,name,capabilities,jetpack,visible,is_private,is_vip,icon,plan,jetpack_modules,single_user_site,is_multisite,options', //eslint-disable-line max-len
		// 		options:
		// 			'is_mapped_domain,unmapped_url,admin_url,is_redirect,is_automated_transfer,allowed_file_types,show_on_front,main_network_site,jetpack_version,software_version,default_post_format,created_at,frame_nonce,publicize_permanently_disabled,page_on_front,page_for_posts,advanced_seo_front_page_description,advanced_seo_title_formats,verification_services_codes,podcasting_archive,is_domain_only,default_sharing_status,default_likes_enabled,wordads,upgraded_filetypes_enabled,videopress_enabled,permalink_structure,gmt_offset,is_wpcom_store,signup_is_store,has_pending_automated_transfer,woocommerce_is_active,design_type,site_goals', //eslint-disable-line max-len
		// 	} )
		// 	.then( response => {
		// 		dispatch( receiveSites( response.sites ) );
		// 		dispatch( {
		// 			type: SITES_REQUEST_SUCCESS,
		// 		} );
		// 	} )
		// 	.catch( error => {
		// 		dispatch( {
		// 			type: SITES_REQUEST_FAILURE,
		// 			error,
		// 		} );
		// 	} );
	};
}

/**
 * Returns a function which, when invoked, triggers a network request to fetch
 * a site.
 *
 * @param  {Number}   siteFragment Site ID or slug
 * @return {Function}              Action thunk
 */
export function requestSite( siteFragment ) {
	// console.log('requestSite');
	return dispatch => {
		dispatch( {
			type: SITE_REQUEST,
			siteId: siteFragment,
		} );

		return papo
			.site( siteFragment )
			.get()
			.then( site => {
				// console.log( site );
				// If we can't manage the site, don't add it to state.
				if ( ! ( site && site.capabilities ) ) {
					return dispatch( {
						type: SITE_REQUEST_FAILURE,
						siteId: siteFragment,
						error: i18n.translate( 'No access to manage the site' ),
					} );
				}

				dispatch( receiveSite( omit( site, '_headers' ) ) );

				dispatch( {
					type: SITE_REQUEST_SUCCESS,
					siteId: siteFragment,
				} );
			} )
			.catch( error => {
				dispatch( {
					type: SITE_REQUEST_FAILURE,
					siteId: siteFragment,
					error,
				} );
			} );

		// return request
		// 		.post( `${ config( 'api_url' ) }/api/v1/me/site` )
		// 		.withCredentials()
		// 		.send( { siteFragment } )
		// 		.then( response => {
		// 			// console.log(response);
		// 			if ( ! ( response.body.site /*&& site.capabilities*/ ) ) {
		// 				return dispatch( {
		// 					type: SITE_REQUEST_FAILURE,
		// 					siteId: siteFragment,
		// 					error: i18n.translate( 'No access to manage the site' ),
		// 				} );
		// 			}

		// 			dispatch( receiveSite( omit( response.body.site, '_headers' ) ) );
		// 			dispatch( {
		// 				type: SITE_REQUEST_SUCCESS,
		// 				siteId: siteFragment,
		// 			} );
		// 		} )
		// 		.catch( error => {
		// 			console.log('error request site');
		// 			console.log( error );
		// 			dispatch( {
		// 				type: SITE_REQUEST_FAILURE,
		// 				siteId: siteFragment,
		// 				error,
		// 			} );
		// 		} );

		// return getSingleSiteByID( siteFragment )
		// 		.then( site => {
		// 				// If we can't manage the site, don't add it to state.
		// 				if ( ! ( site /*&& site.capabilities*/ ) ) {
		// 					return dispatch( {
		// 						type: SITE_REQUEST_FAILURE,
		// 						siteId: siteFragment,
		// 						error: i18n.translate( 'No access to manage the site' ),
		// 					} );
		// 				}

		// 				dispatch( receiveSite( omit( site, '_headers' ) ) );

		// 				dispatch( {
		// 					type: SITE_REQUEST_SUCCESS,
		// 					siteId: siteFragment,
		// 				} );
		// 			} )
		// 			.catch( error => {
		// 				console.log('error request site');
		// 				console.log( error );
		// 				dispatch( {
		// 					type: SITE_REQUEST_FAILURE,
		// 					siteId: siteFragment,
		// 					error,
		// 				} );
		// 			} );

		// return wpcom
		// 	.site( siteFragment )
		// 	.get()
		// 	.then( site => {
		// 		// If we can't manage the site, don't add it to state.
		// 		if ( ! ( site && site.capabilities ) ) {
		// 			return dispatch( {
		// 				type: SITE_REQUEST_FAILURE,
		// 				siteId: siteFragment,
		// 				error: i18n.translate( 'No access to manage the site' ),
		// 			} );
		// 		}

		// 		dispatch( receiveSite( omit( site, '_headers' ) ) );

		// 		dispatch( {
		// 			type: SITE_REQUEST_SUCCESS,
		// 			siteId: siteFragment,
		// 		} );
		// 	} )
		// 	.catch( error => {
		// 		dispatch( {
		// 			type: SITE_REQUEST_FAILURE,
		// 			siteId: siteFragment,
		// 			error,
		// 		} );
		// 	} );
	};
}

/**
 * Returns a function which, when invoked, triggers a network request to delete
 * a site.
 *
 * @param  {Number}   siteId Site ID
 * @return {Function}        Action thunk
 */
export function deleteSite( siteId ) {
	return dispatch => {
		dispatch( {
			type: SITE_DELETE,
			siteId,
		} );
		return wpcom
			.undocumented()
			.deleteSite( siteId )
			.then( () => {
				dispatch( receiveDeletedSite( siteId ) );
				dispatch( {
					type: SITE_DELETE_SUCCESS,
					siteId,
				} );
			} )
			.catch( error => {
				dispatch( {
					type: SITE_DELETE_FAILURE,
					siteId,
					error,
				} );
			} );
	};
}

export const sitePluginUpdated = siteId => ( {
	type: SITE_PLUGIN_UPDATED,
	siteId,
} );
