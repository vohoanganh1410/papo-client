import { filter, findIndex } from 'lodash';

export function getSelectedPages( pages ) {
	// temporary accept select initializing pages
	return filter( pages, page => page.selected && ( page.initializeStatus == 'initialized' || page.initializeStatus == 'initializing' ) );
}

export function getSelectedUnInitializedPages( pages ) {
	return filter( pages, page => page.selected && ( page.initializeStatus !== 'initialized' && page.initializeStatus !== 'initializing' ) );
}