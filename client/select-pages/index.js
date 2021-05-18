/** @format */

/**
 * External dependencies
 */

// import config from 'config';
import page from 'page';

/**
 * Internal dependencies
 */
import { makeLayout, render as clientRender } from 'controller';
import { generalSetup, selectPage } from './controller';

export default function() {
	page( '/pages/select', generalSetup, selectPage, makeLayout, clientRender );
}
