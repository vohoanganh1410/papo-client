import { get } from 'lodash';

export function getPageFiles( state, pageId ) {
	return get( state.files.data, pageId );
}

export function getPageFilesLoadStatus( state, pageId ) {
	return get( state.files.loadStatus, pageId );
}
