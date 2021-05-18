import { Client1 } from 'lib/client1';

export function setCSRFFromCookie() {
	if ( typeof document !== 'undefined' && typeof document.cookie !== 'undefined' ) {
		const cookies = document.cookie.split( ';' );
		for ( let i = 0; i < cookies.length; i++ ) {
			const cookie = cookies[ i ].trim();
			if ( cookie.startsWith( 'MMCSRF=' ) ) {
				Client1.setCSRF( cookie.replace( 'MMCSRF=', '' ) );
				break;
			}
		}
	}
}

export function clearUserCookie() {
	// We need to clear the cookie both with and without the domain set because we can't tell if the server set
	// the cookie with it. At this time, the domain will be set if ServiceSettings.EnableCookiesForSubdomains is true.
	document.cookie = 'MMUSERID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	document.cookie = `MMUSERID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=${
		window.location.hostname
	};path=/`;
	document.cookie = 'MMCSRF=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	document.cookie = `MMCSRF=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=${
		window.location.hostname
	};path=/`;
}
