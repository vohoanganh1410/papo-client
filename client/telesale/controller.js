// /** @format */

// /**
//  * External dependencies
//  */

// import React from 'react';
// import { includes, noop, some, startsWith, uniq } from 'lodash';
// import page from 'page';
// import i18n from 'i18n-calypso';

// /**
//  * Internal dependencies
//  */
// import { SITES_ONCE_CHANGED } from 'state/action-types';
// import { setDocumentHeadTitle as setTitle } from 'state/document-head/actions';
// // import { setSection } from 'state/ui/actions';
// import SidebarComponent from 'dashboard/sidebar';
// import { getSiteFragment, sectionify } from 'lib/route';
// import { setLayoutFocus } from 'state/ui/layout-focus/actions';
// import { setSelectedSiteId, setSection, setAllSitesSelected } from 'state/ui/actions';
// // import { initConnection as initRealtimeConnection } from 'state/realtime/connection/actions';
// // import { getRealtimeAuth } from 'state/realtime/utils';
// import notices from 'notices';
// import config from 'config';

// import Card from 'components/card';
// import Main from 'components/main';
// import NavigationComponent from 'telesale/navigation';
// import { getCurrentUser } from 'state/current-user/selectors';
// import { warningNotice } from 'state/notices/actions';
// import NoSitesMessage from 'components/empty-content/no-sites-message';
// import EmptyContentComponent from 'components/empty-content';
// import SitesComponent from 'dashboard/sites';
// import { makeLayout, render as clientRender } from 'controller';
// import { receiveSite, requestSite } from 'state/sites/actions';
// import {
// 	getSite,
// 	getSiteSlug,
// 	isJetpackModuleActive,
// 	isJetpackSite,
// 	isRequestingSites,
// 	isRequestingSite,
// 	hasAllSitesList,
// } from 'state/sites/selectors';

// import {
// 	getSourceId,
// 	getPrimarySiteId,
// 	getSites,
// 	getSiteId
// } from 'state/selectors';

// import { getSelectedSite, getSelectedSiteId } from 'state/ui/selectors';
// import { hasReceivedRemotePreferences, getPreference } from 'state/preferences/selectors';
// import { savePreference } from 'state/preferences/actions';
// import OrdersComponent from './main';

// const ANALYTICS_PAGE_TITLE = 'Telesale';

// export function navigation( context, next ) {
// 	// Render the My Sites navigation in #secondary
// 	context.secondary = createNavigation( context );
// 	next();
// }

// export function orders( context, next ) {
// 	context.store.dispatch( setTitle( i18n.translate( 'Orders', { textOnly: true } ) ) );
// 	context.primary = React.createElement( OrdersComponent, {
// 		path: context.path,
// 	} );
// 	next();
// }

// export function enforceSiteEnding( context, next ) {
// 	const siteId = getSiteFragment( context.path );
// 	if ( ! siteId ) {
// 		page.redirect( '/' );
// 		// redirectToTeam( context );
// 	}
// 	next();
// }

// /*
//  * The main navigation of My Sites consists of a component with
//  * the site selector list and the sidebar section items
//  * @param { object } context - Middleware context
//  * @returns { object } React element containing the site selector and sidebar
//  */
// function createNavigation( context ) {
// 	const siteFragment = getSiteFragment( context.pathname );
// 	const user = getCurrentUser( context.store.getState() );
// 	let basePath = context.pathname;

// 	if ( siteFragment ) {
// 		basePath = sectionify( context.pathname );
// 	}

// 	return (
// 		<NavigationComponent
// 			path={ context.path }
// 			allSitesPath={ basePath }
// 			siteBasePath={ basePath }
// 			user={ user }
// 		/>
// 	);
// }

// function removeSidebar( context ) {
// 	context.store.dispatch(
// 		setSection( {
// 			group: 'telesale',
// 			secondary: false,
// 		} )
// 	);
// }