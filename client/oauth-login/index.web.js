/** @format */

/**
 * Internal dependencies
 */
import page from 'page';

import config from 'config';
import {
	lang,
	login,
	magicLogin,
	magicLoginUse,
	redirectJetpack,
	redirectDefaultLocale,
} from './controller';
import { makeLayout, redirectLoggedIn, setUpLocale } from 'controller';

// export default function() {
// 	page( '/log-in', login, makeLayout, clientRender );
// }

export default router => {
	// console.log( lang );
	router(
		[
			`/log-in/:twoFactorAuthType(authenticator|backup|sms|push)/${ lang }`,
			`/log-in/:flow(social-connect|private-site)/${ lang }`,
			`/log-in/:socialService(google)/callback/${ lang }`,
			`/log-in/:isJetpack(jetpack)/${ lang }`,
			`/log-in`,
		],
		
		redirectJetpack,
		redirectDefaultLocale,
		setUpLocale,
		login,
		makeLayout
	);
}