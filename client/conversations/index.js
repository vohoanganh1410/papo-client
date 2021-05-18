import page from 'page';

import {
	generalSetup,
	preferenceCheck,
	setPageLoadingSuccess,
	conversations,
	makeSidebar,
} from './controller';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	page(
		'/conversations/m',
		generalSetup,
		preferenceCheck,
		setPageLoadingSuccess,
		makeSidebar,
		conversations,
		makeLayout,
		clientRender
	);
	page(
		'/conversations/:pageID?',
		generalSetup,
		preferenceCheck,
		setPageLoadingSuccess,
		makeSidebar,
		conversations,
		makeLayout,
		clientRender
	);
}
