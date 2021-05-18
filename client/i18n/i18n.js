import { addLocaleData } from 'react-intl';

const vi = require( './vi.json' );
const en = require( './en.json' );

import viLocaleData from 'react-intl/locale-data/vi';
import enLocaleData from 'react-intl/locale-data/en';

// should match the values in model/config.go
const languages = {
	vi: {
		value: 'vi',
		name: 'Tiếng Việt',
		order: 0,
		url: vi,
	},
	en: {
		value: 'en',
		name: 'English',
		order: 1,
		url: en,
	},
};

export function getAllLanguages() {
	return languages;
}

export function getLanguages() {
	return getAllLanguages();
	// const config = getConfig(store.getState());
	// if (!config.AvailableLocales) {
	// 	return getAllLanguages();
	// }
	// return config.AvailableLocales.split(',').reduce((result, l) => {
	// 	if (languages[l]) {
	// 		result[l] = languages[l];
	// 	}
	// 	return result;
	// }, {});
}

export function getLanguageInfo( locale ) {
	return getAllLanguages()[ locale ];
}

export function isLanguageAvailable( locale ) {
	return Boolean( getLanguages()[ locale ] );
}

// export function safariFix(callback) {
// 	require.ensure([
// 		'intl',
// 		'intl/locale-data/jsonp/vi.js',
// 		'intl/locale-data/jsonp/en.js',
// 	], (require) => {
// 		require('intl');
// 		require('intl/locale-data/jsonp/vi.js');
// 		require('intl/locale-data/jsonp/en.js');
// 		callback();
// 	});
// }

export function doAddLocaleData() {
	addLocaleData( viLocaleData );
	addLocaleData( enLocaleData );
}
