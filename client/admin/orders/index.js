import page from 'page';

import { makeLayout, render as clientRender } from 'controller';
import { makeOrdersComponent } from './controller';
import {
	generalSetup,
	requestPermissons,
	checkPermissions,
	requestTeamRoles,
	enforceTeamHasSelected,
	getUserTeams,
	makeMasterbar,
	makeSidebar,
} from 'admin/controller';
import { fetchTeamMembers } from 'admin/members/controller';

export default function() {
	page(
		'/admin/orders',
		generalSetup,
		makeMasterbar,
		makeSidebar,
		makeOrdersComponent,
		makeLayout,
		clientRender
	);
}
