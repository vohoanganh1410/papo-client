import page from 'page';

// import { navigation, sourceSelection, sites, siteSelection } from 'admin/controller';
import {
	generalSetup,
	requestPermissons,
	checkPermissions,
	requestTeamRoles,
	enforceTeamHasSelected,
	getUserTeams,
	preferences,
	makeMasterbar,
	makeSidebar,
} from 'admin/controller';
import { fetchTeamMembers, members, memberDetail, roles } from './controller';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	page(
		'/admin/members/:filter(team|followers|email-followers|viewers)',
		generalSetup,
		makeMasterbar,
		makeSidebar,
		members,
		makeLayout,
		clientRender
	);

	page(
		'/admin/members/:id/edit',
		generalSetup,
		makeMasterbar,
		makeSidebar,
		memberDetail,
		makeLayout,
		clientRender
	);

	page(
		'/admin/members/roles',
		generalSetup,
		makeMasterbar,
		makeSidebar,
		roles,
		makeLayout,
		clientRender
	);

	// Anything else is unexpected and should be redirected to the default people management URL: /people/team
	// page(
	// 	'/admin/members/(.*)?',
	// 	checkPermissions,
	// 	enforceTeamHasSelected,
	// 	makeMasterbar,
	// 	makeSidebar,
	// 	makeLayout,
	// 	clientRender
	// );

	// page(
	// 	'/admin/members/:filter(team|followers|email-followers|viewers)/:team_id',
	// 	siteSelection,
	// 	navigation,
	// 	membersController.invite,
	// 	makeLayout,
	// 	clientRender
	// );
}
