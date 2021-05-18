/** @format */

/**
 * External dependencies
 */

import config from 'config';
import page from 'page';


/**
 * Internal dependencies
 */
import { navigation, enforceSiteEnding, orders } from './controller';
import { makeLayout, render as clientRender } from 'controller';
import { siteSelection } from 'dashboard/controller';

export default function() {
	page( '/orders/:site?', enforceSiteEnding, siteSelection, navigation, orders, makeLayout, clientRender );
}