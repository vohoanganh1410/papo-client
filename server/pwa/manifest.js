/** @format */

/**
 * External dependencies
 */
import querystring from 'querystring';

/**
 * Internal dependencies
 */

/**
 * TODO:
 * - l10n
 * @returns {object} An express app that returns /manifest.json
 */
const buildManifest = ( { branchName } ) => {
	// These options exist to make sure that manifest-linked URLs load correctly even if
	// cookies haven't been set yet in the calypso.live environment.
	// If we find a way to make calypso.live set its cookies before the manifest is loaded,
	// then this can be safely removed.
	const environmentUrlOptions = { source: 'pwa' };

	if ( branchName && 'master' !== branchName ) {
		environmentUrlOptions.branch = branchName;
	}

	const environmentUrlSuffix = '?' + querystring.stringify( environmentUrlOptions );

	return {
		name: 'Papo',
		short_name: 'papovn.com',
		start_url: '/' + environmentUrlSuffix,
		display: 'standalone',
		gcm_sender_id: '87234302238',
		background_color: '#0078be',
		theme_color: '#0078be',
		icons: [
			{
				src: '/papo/images/manifest/icon-144x144.png' + environmentUrlSuffix,
				sizes: '144x144',
				type: 'image/png',
			},
			{
				src: '/papo/images/manifest/icon-192x192.png' + environmentUrlSuffix,
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/papo/images/manifest/icon-512x512.png' + environmentUrlSuffix,
				sizes: '512x512',
				type: 'image/png',
			},
		],
	};
};

export default ( request, response ) => {
	response.json( buildManifest( { branchName: request.query.branch } ) );
};
