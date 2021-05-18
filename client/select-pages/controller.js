/** @format */

/**
 * External dependencies
 */

import React from 'react';

/**
 * Internal dependencies
 */
import { setDocumentHeadTitle as setTitle } from 'state/document-head/actions';
import MainComponent from './main';
// import { requestPages } from 'state/pages/actions';
import { hideMasterbar } from 'state/ui/actions';
import { requestActivedPages } from 'actions/page';
import { getPreferences } from 'actions/me';
import * as WebSocketActions from 'actions/websocket';

export function generalSetup( context, next ) {
	context.isFluidWidth = false;
	WebSocketActions.close();
	WebSocketActions.initialize( context.store, null );
	next();
}

export function selectPage( context, next ) {
	// context.store.dispatch( hideMasterbar() );
	context.store.dispatch( requestActivedPages() );
	context.store.dispatch( getPreferences() );

	// const basePath = context.path;
	context.store.dispatch( setTitle( 'Chọn trang để tiếp tục' ) ); // FIXME: Auto-converted from the Flux setTitle action. Please use <DocumentHead> instead.
	context.primary = React.createElement( MainComponent, {
		path: context.path,
	} );
	next();
}
