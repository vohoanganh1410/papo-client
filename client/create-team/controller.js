import React from 'react';
import { values } from 'lodash';

import { setDocumentHeadTitle as setTitle } from 'state/document-head/actions';
import CreateTeamComponent from './main';
import NoTeamComponent from './no-team';
import TeamSelector from './teams-selector';
import { setModuleLoadingStatus } from 'state/ui/actions';
import page from 'page';

export function generalSetup( context, next ) {
	context.isFluidWidth = true;
	next();
}

export function createTeam( context, next ) {
	// TODO: we do not want users have teams see this page
	context.store.dispatch( setTitle( 'Tạo nhóm làm việc' ) );

	context.primary = React.createElement( CreateTeamComponent, {
		path: context.path,
		query: context.query,
	} );
	next();
}

export function noTeam( context, next ) {
	// if user has teams => redirect to admin page
	const state = context.store.getState();

	context.store.dispatch( setModuleLoadingStatus( false ) );
	context.store.dispatch( setTitle( 'Nhóm làm việc' ) );
	context.primary = React.createElement( NoTeamComponent, {
		path: context.path,
		query: context.query,
	} );
	next();
}

export function redirectToAdminIfUserHasTeams( context, next ) {
	const state = context.store.getState();
	const teams = values( state.currentUser.teams );

	if ( teams.length > 0 ) {
		page.redirect( '/admin' );
	} else {
		next();
	}
}

export function teamSelector( context, next ) {
	// alert('s');
	context.primary = React.createElement( TeamSelector, {
		path: context.path,
		query: context.query,
	} );

	next();
}
