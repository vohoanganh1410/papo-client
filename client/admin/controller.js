import i18n from 'i18n-calypso';
import React from 'react';
import page from 'page';
import { forEach, values } from 'lodash';
// import page from 'page';

import Masterbar from 'blocks/masterbar';
import {
	setModuleLoadingStatus,
	setModuleLoadingStep,
	setNeedCheckPermissions,
} from 'state/ui/actions';
import { requestActivedPages } from 'actions/page';
import { setDocumentHeadTitle as setTitle } from 'state/document-head/actions';
import AdminComponent from 'admin/main';
import {
	RECEIVED_PREFERENCES,
	REQUEST_PREFERENCES,
	REQUEST_PREFERENCES_FAILURED,
	REQUEST_PREFERENCES_SUCCESS,
	FETCH_TEAMS_FAILURED,
	REQUEST_MY_TEAMS,
	RECEIVED_MY_TEAMS,
	SET_SELECTED_TEAM,
} from 'state/action-types';
import { Client1 } from 'lib/client1';
import { getPreferences } from 'actions/me';
import {
	getUserTeams as fetchUserTeams,
	requestTeamMembers,
	requestTeamRoles as fetchTeamRoles,
} from 'actions/team';
import * as WebSocketActions from 'actions/websocket';
import { requestPermissions } from 'actions/permission';
import SidebarTeamSwitcher from 'admin/sidebar';

export function generalSetup( context, next ) {
	context.isFluidWidth = true;
	next();
}

// TODO: make sure team has selected for every pages in admin module
export function enforceTeamHasSelected( context, next ) {
	const state = context.store.getState();
	if ( ! state.currentUser ) {
		page.redirect( '/login' );
	}

	if ( ! state.currentUser.selectedTeam ) {
		page.redirect( '/teams/select' );
	} else {
		next();
	}
}

export function preferences( context, next ) {
	// context.store.dispatch( setModuleLoadingStatus( true ) );
	// context.store.dispatch( setModuleLoadingStep( 'fetching preferences' ) );
	context.store.dispatch( getPreferences() );

	Client1.getMyPreferences()
		.then( _preferences => {
			// context.store.dispatch( setModuleLoadingStatus( false ) );
			let foundSelected = false;
			if ( _preferences.length > 0 ) {
				_preferences.forEach( p => {
					if ( p.category === 'team_ids' ) {
						if ( p.value.length > 0 ) {
							// init web socket
							WebSocketActions.initialize( context.store, p.value );
							foundSelected = true;
						}
					}
				} );
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
				preferences: _preferences,
			} );

			next();
		} )
		.catch( error => {
			context.store.dispatch( {
				type: REQUEST_PREFERENCES_FAILURED,
				error,
			} );
		} );
}

export function makeMasterbar( context, next ) {
	context.masterbar = React.createElement( Masterbar, {
		path: context.path,
	} );
	next();
}

export function adminComponent( context, next ) {
	// context.store.dispatch( hideMasterbar() );
	context.store.dispatch( requestActivedPages() );
	context.store.dispatch( setTitle( i18n.translate( 'Bảng điều khiển', { textOnly: true } ) ) );

	context.primary = React.createElement( AdminComponent, {
		path: context.path,
		query: context.query,
	} );

	next();
}

export function makeSidebar( context, next ) {
	context.secondary = createSidebar( context );
	next();
}

function createSidebar( context ) {
	return (
		<SidebarTeamSwitcher
			path={ context.path }
			query={ context.query }
			allSitesPath={ 'basePath' }
			siteBasePath={ 'basePath' }
			user={ null }
		/>
	);
}
