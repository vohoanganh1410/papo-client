/** @format */
/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import { sourceSelection, sources, siteSelection, sites } from 'dashboard/controller';
import controller from './controller';
import config from 'config';
import { makeLayout, render as clientRender } from 'controller';


export default function() {
	page( '/order', controller.pressThis, siteSelection, sites, makeLayout, clientRender );
	page( '/order/new', () => page.redirect( '/order' ) ); // redirect from beep-beep-boop
	page( '/order/:site?/:post?', siteSelection, controller.post, makeLayout, clientRender );
	// page.exit( '/post/:site?/:post?', controller.exitPost );

	// page( '/page', siteSelection, sites, makeLayout, clientRender );
	// page( '/page/new', () => page.redirect( '/page' ) ); // redirect from beep-beep-boop
	// page( '/page/:site?/:post?', siteSelection, controller.post, makeLayout, clientRender );
	// page.exit( '/page/:site?/:post?', controller.exitPost );

	if ( config.isEnabled( 'manage/custom-post-types' ) ) {
		// page( '/edit/:type', siteSelection, sites, makeLayout, clientRender );
		// page( '/edit/:type/new', context => page.redirect( `/edit/${ context.params.type }` ) );
		page( '/edit/:type/:post?', sourceSelection, controller.post, makeLayout, clientRender );
		// page.exit( '/edit/:type/:site?/:post?', controller.exitPost );
	}
}
