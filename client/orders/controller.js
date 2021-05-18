import i18n from 'i18n-calypso';
import React from 'react';
import page from 'page';

import Masterbar from 'blocks/masterbar';
import { requestActivedPages } from 'actions/page';
import { setDocumentHeadTitle as setTitle } from 'state/document-head/actions';
import OrdersComponent from 'orders/main';
import {
	RECEIVED_PREFERENCES,
	REQUEST_PREFERENCES,
	REQUEST_PREFERENCES_FAILURED,
	REQUEST_PREFERENCES_SUCCESS,
} from 'state/action-types';
import { Client1 } from 'lib/client1';
import { getPreferences } from 'actions/me';
import * as WebSocketActions from 'actions/websocket';
import {setLoadingStatus} from 'state/ui/actions';

export function loadData( context, next ) {
	context.store.dispatch(setLoadingStatus(true));
	// what data to load?
	next();
}

export function preferences( context, next ) {
	context.store.dispatch( getPreferences() );
	context.store.dispatch( {
		type: REQUEST_PREFERENCES,
	} );

	Client1.getMyPreferences()
		.then( preferences => {
			let foundSelected = false;
			if ( preferences.length > 0 ) {
				preferences.forEach( p => {
					if ( p.category === "team_ids" ) {
						if ( p.value.length > 0 ) {
							// init web socket
							WebSocketActions.initialize( context.store, p.value );
							foundSelected = true;
						}
					}
				} )
			}

			if ( ! foundSelected ) {
				// if no page ids found, redirect user to select page
				// page.redirect( '/pages/select' );
			}

			context.store.dispatch( {
				type: REQUEST_PREFERENCES_SUCCESS,
			} );
			context.store.dispatch( {
				type: RECEIVED_PREFERENCES,
				preferences,
			} );

			setTimeout(()=> {
				context.store.dispatch(setLoadingStatus(false));
				next();
			}, 1500);
		} )
		.catch( error => {
			context.store.dispatch( {
				type: REQUEST_PREFERENCES_FAILURED,
				error,
			} )
		} );
}

export function makeMasterbar(context, next) {
	context.masterbar = React.createElement(Masterbar, {
		path: context.path,
	});
	next();
}

export function ordersComponent( context, next ) {
	context.store.dispatch( requestActivedPages() );
	context.store.dispatch( setTitle( i18n.translate( 'Admin', { textOnly: true } ) ) );

	context.primary = React.createElement( OrdersComponent, {
		path: context.path,
	} );

	next();
}
