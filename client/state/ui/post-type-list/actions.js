/** @format */

/**
 * Internal dependencies
 */

import {
	POST_TYPE_LIST_LIKES_POPOVER_HIDE,
	POST_TYPE_LIST_LIKES_POPOVER_TOGGLE,
	POST_TYPE_LIST_MULTI_SELECTION_MODE_TOGGLE,
	POST_TYPE_LIST_MULTI_SELECTION_MODE_ACTIVE,
	POST_TYPE_LIST_SELECTION_TOGGLE,
	POST_TYPE_LIST_SHARE_PANEL_HIDE,
	POST_TYPE_LIST_SHARE_PANEL_TOGGLE,
	POST_TYPE_LIST_SELECTION_RESET,
} from 'state/action-types';

export function hideActiveLikesPopover() {
	return {
		type: POST_TYPE_LIST_LIKES_POPOVER_HIDE,
	};
}

export function toggleLikesPopover( postGlobalId ) {
	return {
		type: POST_TYPE_LIST_LIKES_POPOVER_TOGGLE,
		postGlobalId,
	};
}

export function hideActiveSharePanel() {
	return {
		type: POST_TYPE_LIST_SHARE_PANEL_HIDE,
	};
}

export function toggleSharePanel( postGlobalId ) {
	return {
		type: POST_TYPE_LIST_SHARE_PANEL_TOGGLE,
		postGlobalId,
	};
}

export function toggleMultiSelect() {
	return {
		type: POST_TYPE_LIST_MULTI_SELECTION_MODE_TOGGLE,
	};
}

export function activeMultiSelect() {
	return {
		type: POST_TYPE_LIST_MULTI_SELECTION_MODE_ACTIVE,
	};
}

export function togglePostSelection( postGlobalId ) {
	return {
		type: POST_TYPE_LIST_SELECTION_TOGGLE,
		postGlobalId,
	};
}

export function resetPostSelection () {
	return {
		type: POST_TYPE_LIST_SELECTION_RESET
	}
}
