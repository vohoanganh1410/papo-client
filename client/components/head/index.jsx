/**
 * External dependencies
 *
 * @format
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */

const Head = ( {
	title = 'Papo Client beta 0.1.0',
	faviconURL,
	children,
	cdn,
	branchName,
	inlineScriptNonce,
} ) => {
	return (
		<head>
			<title>{ title }</title>

			<meta charSet="utf-8" />
			<meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
			<meta name="format-detection" content="telephone=no" />
			<meta name="mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="theme-color" content="#0087be" />
			<meta name="referrer" content="origin" />

			<link
				rel="shortcut icon"
				type="image/vnd.microsoft.icon"
				href={ faviconURL }
				sizes="16x16 32x32"
			/>
			<link rel="shortcut icon" type="image/x-icon" href={ faviconURL } sizes="16x16 32x32" />
			<link rel="icon" type="image/x-icon" href={ faviconURL } sizes="16x16 32x32" />

			<link
				rel="icon"
				type="image/png"
				href={ cdn + '/i/favicons/favicon-64x64.png' }
				sizes="64x64"
			/>
			<link
				rel="icon"
				type="image/png"
				href={ cdn + '/i/favicons/favicon-96x96.png' }
				sizes="96x96"
			/>
			<link
				rel="icon"
				type="image/png"
				href={ cdn + '/i/favicons/android-chrome-192x192.png' }
				sizes="192x192"
			/>
			{ [ 57, 60, 72, 76, 114, 120, 144, 152, 180 ].map( size => (
				<link
					key={ size }
					rel="apple-touch-icon"
					sizes={ `${ size }x${ size }` }
					href={ cdn + `/i/favicons/apple-touch-icon-${ size }x${ size }.png` }
				/>
			) ) }

			<link rel="profile" href="http://gmpg.org/xfn/11" />
			{ ! branchName || 'master' === branchName ? (
				<link rel="manifest" href="/papo/manifest.json" />
			) : (
				<link
					rel="manifest"
					href={ '/papo/manifest.json?branch=' + encodeURIComponent( branchName ) }
				/>
			) }
			{ /*<link rel="manifest" href="/papo/manifest.json" />*/ }
			{ /*<link
				rel="stylesheet"
				id="noticons-css"
				href={ cdn + '/i/noticons/noticons.css?v=20150727' }
			/>*/ }

			{ children }
		</head>
	);
};

Head.propTypes = {
	title: PropTypes.string,
	faviconURL: PropTypes.string.isRequired,
	children: PropTypes.node,
	cdn: PropTypes.string.isRequired,
};

export default Head;
