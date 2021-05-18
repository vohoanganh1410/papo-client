import * as I18n from 'i18n/i18n';

export function getTranslations( state, locale ) {
	// console.log(locale);
	const localeInfo = I18n.getLanguageInfo( locale );
	// console.log("localeInfo", localeInfo);

	let translations;
	if ( localeInfo ) {
		// console.log('localeInfo', localeInfo);
		translations = state.i18n.translations[ locale ];
	} else {
		// Default to English if an unsupported locale is specified
		translations = state.i18n.translations.en;
	}

	// console.log('translations', translations);

	return translations;
}

export function getCurrentLocale( state ) {
	return state.currentUser && state.currentUser.data ? state.currentUser.data.locale : null;
}
