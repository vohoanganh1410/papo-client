/** @format */

/**
 * External dependencies
 */
import { reducer as formReducer } from 'redux-form';

// TODO: change this back to `from 'redux-form'` after upgrade to Webpack 4.0 and a version
//       of Redux Form that uses the `sideEffects: false` flag

/**
 * Internal dependencies
 */

import activityLog from './activity-log/reducer';

import conversation from 'state/conversation/reducer';
import conversations from './conversations/reducer';

/* eslint-disable */
import { combineReducers } from 'state/utils';

import i18n from './i18n/reducer';
import notices from 'state/notices/reducer';
import ui from 'state/ui/reducer';
import application from 'state/application/reducer';
import attachments from 'state/attachments/reducer';
import currentUser from 'state/current-user/reducer';
import layoutFocus from 'state/ui/layout-focus/reducer';
// import { reducer as dataRequests } from './data-layer/wpcom-http/utils';
import documentHead from 'state/document-head/reducer';
//import login from './login/reducer';
// import media from './media/reducer';
import facebookUsers from './facebookusers/reducer';
import pages from './pages/reducer';
import posts from './posts/reducer';
import preferences from './preferences/reducer';
import permissions from './permissions/reducer';
import realtime from './realtime/reducer';
import teams from './team/reducer';
import files from './files/reducer';

const reducers = {
	attachments,
	conversation,
	conversations,
	documentHead,
	i18n,
	files,
	form: formReducer,
	notices,
	activityLog,
	application,
	currentUser,
	layoutFocus,
	facebookUsers,
	pages,
	posts,
	preferences,
	permissions,
	realtime,
	teams,
	ui,
};

export default combineReducers( reducers );
