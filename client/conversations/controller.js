/** @format */

/**
 * External dependencies
 */

import React from 'react';
import { find } from 'lodash';
import page from 'page';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { setDocumentHeadTitle as setTitle } from 'state/document-head/actions';

// import { setLayoutFocus } from 'state/ui/layout-focus/actions';
import { setModuleLoadingStatus, setSelectedPageId, setLoadingStatus } from 'state/ui/actions';
// import notices from 'notices';
// import config from 'config';
//
// import { warningNotice } from 'state/notices/actions';
// import NoSitesMessage from 'components/empty-content/no-sites-message';
// import EmptyContentComponent from 'components/empty-content';
// import { makeLayout, render as clientRender } from 'controller';

import ConversationsComponent from './main';
// import InitializePages from './initialize-pages';
// import {
// 	initializePage as initPage,
// } from 'lib/facebook/page';
// import {
// 	getPageInitializeStatus,
// } from 'state/pages/actions';
// import {
// 	INIT_PAGE_START,
// 	INIT_PAGE_COMPLETE,
// } from 'state/action-types';
// import {
// 	getPage,
// } from 'state/pages/selectors';
import { hideMasterbar } from 'state/ui/actions';

import ConversationSidebar from './sidebar';

import { requestActivedPages, switchPage } from 'actions/page';
import { loadConversations } from 'actions/conversation';
// import { getPreferences } from 'actions/me';
import * as WebSocketActions from 'actions/websocket';
import { Client1 } from 'lib/client1';
import {
	REQUEST_PREFERENCES,
	REQUEST_PREFERENCES_SUCCESS,
	REQUEST_PREFERENCES_FAILURED,
	RECEIVED_PREFERENCES,
	REQUEST_ACTIVED_PAGES,
	REQUEST_ACTIVED_PAGES_SUCCESS,
	PAGES_RECEIVED,
	REQUEST_ACTIVED_PAGES_FAILURED,
} from 'state/action-types';
import { setLayoutFocus } from 'state/ui/layout-focus/actions';

// const ANALYTICS_PAGE_TITLE = 'Conversations';

export function generalSetup( context, next ) {
	context.store.dispatch( setLoadingStatus( true ) );
	context.store.dispatch( hideMasterbar() ); // if need
	context.store.dispatch( setLayoutFocus( 'sidebar' ) );
	context.isFluidWidth = true;
	next();
}

export function authCheck( context, next ) {}

export function loadConversationsForFirstTime( context, next, pageIds ) {
	context.store.dispatch( loadConversations( pageIds, 30, 0 ) );
	next();
}

export function setPageLoadingSuccess( context, next ) {
	context.store.dispatch( setLoadingStatus( false ) );
	next();
}

export function preferenceCheck( context, next ) {
	const pieces = context.path.split( '/' );
	const page_id = pieces[ pieces.length - 1 ];
	// we need to clear conversations state if user switch between pages
	context.store.dispatch( switchPage() );
	context.store.dispatch( requestActivedPages() );

	context.store.dispatch( {
		type: REQUEST_ACTIVED_PAGES,
	} );

	Client1.getActivedPages()
		.then( pages => {
			context.store.dispatch( {
				type: REQUEST_ACTIVED_PAGES_SUCCESS,
			} );

			context.store.dispatch( {
				type: PAGES_RECEIVED,
				pages,
			} );

			context.store.dispatch( {
				type: REQUEST_PREFERENCES,
			} );

			Client1.getMyPreferences()
				.then( preferences => {
					let foundSelected = false;
					// try to get current selected page ids from preferences
					if ( preferences.length > 0 ) {
						preferences.forEach( p => {
							if ( p.category === 'selected_pages' ) {
								if ( p.value.length > 0 && page_id === 'm' ) {
									// init web socket
									WebSocketActions.initialize( context.store, p.value );
									foundSelected = true;
									loadConversationsForFirstTime( context, next, p.value );
									next();
								}
							}
						} );
					}

					context.store.dispatch( {
						type: REQUEST_PREFERENCES_SUCCESS,
					} );
					context.store.dispatch( {
						type: RECEIVED_PREFERENCES,
						preferences,
					} );

					if ( page_id === 'm' ) {
						if ( ! foundSelected ) {
							// if no page ids found, redirect user to select page
							page.redirect( '/pages/select' );
						}
					} else {
						// check if user has permission to this page
						const _page = find( pages, { data: { page_id: page_id } } );
						if (
							! _page ||
							( _page.data.status !== 'initializing' && _page.data.status !== 'initialized' )
						) {
							page.redirect( '/pages/select' );
						}
						// console.log("_page", _page);
						context.isMultipleMode = false;

						WebSocketActions.close();
						WebSocketActions.initialize( context.store, page_id );
						context.store.dispatch( setSelectedPageId( page_id ) );
						loadConversationsForFirstTime( context, next, page_id );
						next();
					}
				} )
				.catch( error => {
					context.store.dispatch( {
						type: REQUEST_PREFERENCES_FAILURED,
						error,
					} );
				} );
		} )
		.catch( error => {
			context.store.dispatch( {
				type: REQUEST_ACTIVED_PAGES_FAILURED,
				error,
			} );
		} );
}

// export function initializePage( context, next ) {
// 	context.store.dispatch( hideMasterbar() );
//
//
// 	const pieces = context.path.split( '/' );
// 	const page_id = pieces[ pieces.length - 1 ];
// 	if ( page_id === 'm' ) {
// 		context.store.dispatch( getPreferences() );
// 		context.store.dispatch( {
// 			type: REQUEST_PREFERENCES,
// 		} );
//
// 		context.isMultipleMode = true;
//
// 		Client1.getMyPreferences()
// 			.then( preferences => {
// 				let foundSelected = false;
// 				// try to get current selected page ids from preferences
// 				if ( preferences.length > 0 ) {
// 					preferences.forEach( p => {
// 						if ( p.category === 'selected_pages' ) {
// 							if ( p.value.length > 0 ) {
// 								// init web socket
// 								WebSocketActions.initialize( context.store, p.value );
// 								foundSelected = true;
// 							}
// 						}
// 					} );
// 				}
//
// 				if ( ! foundSelected ) {
// 					// if no page ids found, redirect user to select page
// 					page.redirect( '/pages/select' );
// 				}
//
// 				context.store.dispatch( {
// 					type: REQUEST_PREFERENCES_SUCCESS,
// 				} );
// 				context.store.dispatch( {
// 					type: RECEIVED_PREFERENCES,
// 					preferences,
// 				} );
// 			} )
// 			.catch( error => {
// 				context.store.dispatch( {
// 					type: REQUEST_PREFERENCES_FAILURED,
// 					error,
// 				} );
// 			} );
// 	} else {
// 		context.isMultipleMode = true;
//
// 		WebSocketActions.close();
// 		WebSocketActions.initialize( context.store, page_id );
// 		context.store.dispatch( setSelectedPageId( page_id ) );
// 	}
// 	next();
// }

export function makeSidebar( context, next ) {
	context.secondary = <ConversationSidebar isMultipleMode={ context.isMultipleMode } />;
	next();
}

export function conversations( context, next ) {
	context.store.dispatch( setTitle( i18n.translate( 'Hội thoại', { textOnly: true } ) ) );
	// context.secondary = createNavigation( context );
	context.primary = React.createElement( ConversationsComponent, {
		path: context.path,
	} );
	next();
}
