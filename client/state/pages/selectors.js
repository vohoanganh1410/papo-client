/** @format */

/**
 * External dependencies
 */
import { values, get, map } from 'lodash';

/**
 * Internal dependencies
 */
import { getSitePostsPage } from 'state/sites/selectors';

export function isFrontPage( state, siteId, pageId ) {
	return /*pageId === getSiteFrontPage( state, siteId )*/ false;
}

export function isPostsPage( state, siteId, pageId ) {
	return pageId === getSitePostsPage( state, siteId );
}

export function getPages( state ) {
	return values( state.pages.items );
}

export function getActivedPages( state ) {
	return values( state.pages.actived_items );
}

export function isRequestingActivedPages( state ) {
	return state.pages.is_requesting_actived_pages;
}

export function getPage( state, page_id ) {
	return state.pages ? get( state.pages.items, page_id ) : null;
}

export function getPageAccessToken( state, pageId ) {
	const pages = getPages( state );
	// console.log( pages );
	const page = pages.filter( page => {
		return page.id == pageId;
	} );
	return page && page[ 0 ] ? page[ 0 ].access_token : null;
}

/**
 * Return true if page given by page id is initializing
 */
export function isPageInitializing( state, pageId ) {
	return get( state.pages.initializing, pageId );
}

/**
 * Return true if page given by page id is initializing
 */
export function isPageInitialized( state, pageId ) {
	return get( state.pages.initialized, pageId );
}

export function getPageSnippets( state, pageId ) {
	return get( state.pages.snippets, pageId );
}

export function isCreatingPageSnippet( state ) {
	return state.pages.is_creating_page_snippet;
}

export function isRequestingPageSnippets( state ) {
	return state.pages.is_requesting_page_snippets;
}

export function getPageAutoMessageTasks( state, pageId ) {
	return get( state.pages.auto_message_tasks, pageId );
}

export function isCreatingAutoMessageTask( state ) {
	return state.pages.is_creating_auto_message_task;
}

export function isRequestingPageAutoMessageTasks( state ) {
	return state.pages.is_requesting_auto_message_tasks;
}

export function isPageSnippetsLoaded( state, pageId ) {
	return get( state.pages.snippets_has_loaded, pageId );
}

export function isPageTagsLoaded( state, pageId ) {
	return get( state.pages.tags_has_loaded, pageId );
}

export function getPageTags( state, pageId ) {
	return get( state.pages.tags, pageId );
}

export function getPageAnalyticsData( state, pageId ) {
	return get( state.pages.analytics.data, pageId );
}

export function isPageAnalyticsDataLoading( state, pageId ) {
	return get( state.pages.analytics.loading, pageId );
}
