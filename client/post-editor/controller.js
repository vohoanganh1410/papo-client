/** @format */

/**
 * External dependencies
 */

import ReactDomServer from 'react-dom/server';
import React from 'react';
import i18n from 'i18n-calypso';
import page from 'page';
import { stringify } from 'qs';
import { isWebUri as isValidUrl } from 'valid-url';
import { map, pick, reduce, startsWith } from 'lodash';

/**
 * Internal dependencies
 */
import { startEditingPost } from 'state/ui/editor/actions';
import PostEditor from 'post-editor/post-editor';
import { getNormalizedPost } from 'state/posts/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';
import {
	getEditorPostId,
	getEditorPath,
	isConfirmationSidebarEnabled,
} from 'state/ui/editor/selectors';
import { getSitePost } from 'state/posts/selectors';
import { setDocumentHeadTitle as setTitle } from 'state/document-head/actions';
import { getCurrentUser } from 'state/current-user/selectors';
import { addSiteFragment } from 'lib/route';


function getPostID( context ) {
	if ( ! context.params.post || 'new' === context.params.post ) {
		return null;
	}

	// both post and site are in the path
	return parseInt( context.params.post, 10 );
}

function determinePostType( context ) {
	if ( startsWith( context.path, '/post' ) ) {
		return 'post';
	}

	if ( startsWith( context.path, '/page' ) ) {
		return 'page';
	}

	return context.params.type;
}

function renderEditor( context, siteId, postID ) {
	context.primary = React.createElement( PostEditor, {
		siteId,
		postID
	} );
}

export default {
	pressThis: function( context, next ) {
		console.log('sdfdssd');
		context.getSiteSelectionHeaderText = function() {
			return i18n.translate( 'Vui lòng chọn cửa hàng!' );
		};

		if ( ! context.query.url ) {
			// not pressThis, early return
			return next();
		}

		const currentUser = getCurrentUser( context.store.getState() );

		if ( ! currentUser.primarySiteSlug ) {
			return next();
		}

		const redirectPath = addSiteFragment( context.pathname, currentUser.primarySiteSlug );
		const queryString = stringify( context.query );
		const redirectWithParams = [ redirectPath, queryString ].join( '?' );

		page.redirect( redirectWithParams );
		return false;
	},
	post: function( context, next ) {
		const state = context.store.getState();
		const postType = determinePostType( context );
		const postID = getPostID( context );

		const siteId = getSelectedSiteId( state );

		// const globalId = getPostID( context );
		// const post = getSitePost( state, siteId, postID);

		context.store.dispatch( setTitle( i18n.translate( 'Edit Order', { textOnly: true } ) ) );

		function startEditing( siteId ) {
			
			context.store.dispatch( startEditingPost( siteId, postID, postType ) );
		}

		// Before starting to edit, we want to be sure that we have a valid
		// selected site to work with. Therefore, we wait on the following
		// conditions:
		//  - Sites have not yet been initialized (no localStorage available)
		//  - Sites are initialized, but the site ID is unknown, so we wait for
		//    the sites list to be refreshed (for example, if the user does not
		//    have permission to view the site)
		//  - Sites are initialized _and_ fetched, but the selected site has
		//    not yet been selected, so is not available in global state yet
		// let unsubscribe;
		// function startEditingOnSiteSelected() {
		// 	const siteId = getSelectedSiteId( state );
		// 	if ( ! siteId ) {
		// 		return false;
		// 	}

		// 	if ( unsubscribe ) {
		// 		unsubscribe();
		// 	}

		// 	startEditing( siteId );
		// 	return true;
		// }

		// if ( ! startEditingOnSiteSelected() ) {
		// 	unsubscribe = context.store.subscribe( startEditingOnSiteSelected );
		// }
		startEditing( siteId );

		renderEditor( context, siteId, postID );
		next();
	},
}