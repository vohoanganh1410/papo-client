/** @format */

/**
 * External dependencies
 */

import React from 'react';

/**
 * Internal dependencies
 */
import { setDocumentHeadTitle as setTitle } from '../state/document-head/actions';
import LoginComponent from './login';
import { hideMasterbar } from 'state/ui/actions';

const ANALYTICS_PAGE_TITLE = 'Đăng nhập';

export default {
	login( context, next ) {
		// context.store.dispatch( hideMasterbar() );
		// const basePath = context.path;
		// context.store.dispatch( setTitle( 'Papo - Đăng nhập hệ thống' ) ); // FIXME: Auto-converted from the Flux setTitle action. Please use <DocumentHead> instead.

		context.primary = React.createElement( LoginComponent, {
			path: context.path,
		} );
		next();
	},
};
