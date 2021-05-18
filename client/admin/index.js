import page from 'page';

import {
	generalSetup,
	checkPermissions,
	loadData,
	preferences,
	makeMasterbar,
	makeSidebar,
	adminComponent,
} from './controller';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	page(
		'/admin',
		generalSetup,
		preferences,
		makeMasterbar,
		makeSidebar,
		adminComponent,
		makeLayout,
		clientRender
	);
}
