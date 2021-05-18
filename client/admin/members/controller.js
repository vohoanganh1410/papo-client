import React from 'react';
import i18n from 'i18n-calypso';

import MembersComponent from './main.jsx';
import MemberDetails from './member-details';
import Roles from './roles';
import { setDocumentHeadTitle as setTitle } from 'state/document-head/actions';

import page from 'page';

// export function fetchTeamMembers( context, next ) {
// 	const currentUser = context.store.getState().currentUser;
// 	const selectedTeamId =
// 		currentUser && currentUser.selectedTeam ? currentUser.selectedTeam.id : null;
// 	if ( ! selectedTeamId ) {
// 		page.redirect( '/teams/select' );
// 	}
// 	context.store.dispatch( requestTeamMembers( selectedTeamId ) );
// 	next();
// }

export function members( context, next ) {
	const filter = context.params.filter;
	context.store.dispatch( setTitle( i18n.translate( 'Quản lý thành viên', { textOnly: true } ) ) );

	context.primary = React.createElement( MembersComponent, {
		path: context.path,
		filter: filter,
		search: context.query.s,
		query: context.query,
	} );

	next();
}

export function memberDetail( context, next ) {
	context.store.dispatch( setTitle( i18n.translate( 'Chi tiết thành viên', { textOnly: true } ) ) );
	const memberId = context.params.id;

	// check if member in current team

	context.primary = React.createElement(
		MemberDetails,
		{
			memberId: memberId,
			query: context.query,
			path: context.path,
		},
		null
	);

	next();
}

export function roles( context, next ) {
	context.store.dispatch( setTitle( i18n.translate( 'Quản lý vai trò', { textOnly: true } ) ) );

	context.primary = React.createElement(
		Roles,
		{
			query: context.query,
			path: context.path,
		},
		null
	);
	next();
}
