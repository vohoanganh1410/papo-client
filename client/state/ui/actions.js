import {
	MASTERBAR_TOGGLE_VISIBILITY,
	SELECTED_SITE_SET,
	ROUTE_SET,
	SECTION_SET,
	PREVIEW_IS_SHOWING,
	NOTIFICATIONS_PANEL_TOGGLE,
	NAVIGATE,
	SELECTED_PAGE_SET,
	PAGE_LOADING_STATUS,
	MODULE_LOADING_STATUS,
	SET_MODULE_LOADING_TEXT,
	TOGGLE_SHOW_SWITCH_PAGES,
	SET_NEED_CHECK_PERMISSIONS,
} from 'state/action-types';

/**
 * Returns an action object to be used in signalling that a site has been set
 * as selected.
 *
 * @param  {Number} siteId Site ID
 * @return {Object}        Action object
 */
export function setSelectedSiteId( siteId ) {
	return {
		type: SELECTED_SITE_SET,
		siteId,
	};
}

/**
 * Returns an action object to be used in signalling that a site has been set
 * as selected.
 *
 * @param  {Number} siteId Site ID
 * @return {Object}        Action object
 */
export function setSelectedPageId( pageId ) {
	return {
		type: SELECTED_PAGE_SET,
		pageId,
	};
}

/**
 * Returns an action object to be used in signalling that all sites have been
 * set as selected.
 *
 * @return {Object}        Action object
 */
export function setAllSitesSelected() {
	return {
		type: SELECTED_SITE_SET,
		siteId: null,
	};
}

/**
 * Returns an action object signalling that the current route is to be changed
 *
 * @param  {String} path    Route path
 * @param  {Object} [query] Query arguments
 * @return {Object}         Action object
 */
export function setRoute( path, query = {} ) {
	return {
		type: ROUTE_SET,
		path,
		query,
	};
}

export function setSection( section, options = {} ) {
	options.type = SECTION_SET;
	if ( section ) {
		options.section = section;
	}
	options.hasSidebar = options.hasSidebar === false ? false : true;
	return options;
}

export function setPreviewShowing( isShowing ) {
	return {
		type: PREVIEW_IS_SHOWING,
		isShowing,
	};
}

/**
 * Sets ui state to toggle the notifications panel
 *
 * @returns {Object} An action object
 */
export const toggleNotificationsPanel = () => {
	return {
		type: NOTIFICATIONS_PANEL_TOGGLE,
	};
};

/**
 * Returns an action object signalling navigation to the given path.
 *
 * @param  {String} path Navigation path
 * @return {Object}      Action object
 */
export const navigate = path => ( { type: NAVIGATE, path } );

/**
 * Hide the masterbar.
 *
 * @return {Object} Action object
 */
export const hideMasterbar = () => ( { type: MASTERBAR_TOGGLE_VISIBILITY, isVisible: false } );

/**
 * Show the masterbar.
 *
 * @return {Object} Action object
 */
export const showMasterbar = () => ( { type: MASTERBAR_TOGGLE_VISIBILITY, isVisible: true } );

export const setLoadingStatus = isLoading => ( {
	type: PAGE_LOADING_STATUS,
	isLoading: isLoading,
} );
export const setModuleLoadingStatus = isLoading => ( {
	type: MODULE_LOADING_STATUS,
	isLoading: isLoading,
} );
export const setModuleLoadingStep = text => ( {
	type: SET_MODULE_LOADING_TEXT,
	currentLoadingStep: text,
} );
export const setNeedCheckPermissions = value => ( {
	type: SET_NEED_CHECK_PERMISSIONS,
	needCheck: value,
} );

export const toggleShowSwitchPages = isShowing => ( {
	type: TOGGLE_SHOW_SWITCH_PAGES,
	isShowing: isShowing,
} );
