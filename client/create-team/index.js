import page from 'page';

import { makeLayout, render as clientRender } from 'controller';
import { makeMasterbar } from 'admin/controller';
import {
	generalSetup,
	createTeam,
	redirectToAdminIfUserHasTeams,
	noTeam,
	teamSelector,
} from './controller';

export default function() {
	page( '/teams/create', generalSetup, makeMasterbar, createTeam, makeLayout, clientRender );

	page(
		'/teams/noteam',
		generalSetup,
		redirectToAdminIfUserHasTeams,
		makeMasterbar,
		noTeam,
		makeLayout,
		clientRender
	);

	page( '/teams/select', generalSetup, makeMasterbar, teamSelector, makeLayout, clientRender );
}
