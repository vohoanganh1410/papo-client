import page from 'page';

import { loadData, preferences, makeMasterbar, ordersComponent } from './controller';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	page( '/orders', loadData, preferences, makeMasterbar, ordersComponent, makeLayout, clientRender );
}
