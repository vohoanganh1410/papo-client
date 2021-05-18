/** @format */
/**
 * Internal dependencies
 */
// import {
// 	bumpStat,
// 	composeAnalytics,
// 	recordGoogleEvent,
// 	withAnalytics,
// 	recordTracksEvent,
// } from 'state/analytics/actions';
// import { savePreference } from 'state/preferences/actions';
import { setLayoutFocus } from 'state/ui/layout-focus/actions';

export const openEditorSidebar = () => dispatch => {
	// dispatch( savePreference( 'editor-sidebar', 'open' ) );
	dispatch( setLayoutFocus( 'sidebar' ) );
};

export const closeEditorSidebar = () => dispatch => {
	// dispatch( savePreference( 'editor-sidebar', 'closed' ) );
	dispatch( setLayoutFocus( 'content' ) );
};
