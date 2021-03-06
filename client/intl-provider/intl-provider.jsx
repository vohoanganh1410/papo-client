// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import { IntlProvider as BaseIntlProvider } from 'react-intl';

// import { Client1 } from 'lib/client1';
import { setLocalizeFunction } from 'utils/i18n';

import * as I18n from 'i18n/i18n';

import { localizeMessage } from 'utils/utils';

export default class IntlProvider extends React.PureComponent {
	static propTypes = {
		children: PropTypes.element.isRequired,
		locale: PropTypes.string.isRequired,
		translations: PropTypes.object,
		actions: PropTypes.shape( {
			loadTranslations: PropTypes.func.isRequired,
		} ).isRequired,
	};

	componentDidMount() {
		// Initialize browser's i18n data
		I18n.doAddLocaleData();

		// Pass localization function back to mattermost-redux
		setLocalizeFunction( localizeMessage );

		this.handleLocaleChange( this.props.locale );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.locale !== this.props.locale ) {
			this.handleLocaleChange( this.props.locale );
		}
	}

	handleLocaleChange = locale => {
		// Client4.setAcceptLanguage(locale);
		// console.log('localelocalelocalelocalelocale',locale);

		this.loadTranslationsIfNecessary( locale );
	};

	loadTranslationsIfNecessary = locale => {
		if ( this.props.translations ) {
			// Already loaded
			return;
		}

		const localeInfo = I18n.getLanguageInfo( locale );

		if ( locale === 'en' || ! localeInfo ) {
			// English is loaded by default and invalid locales fall back to English, so we should never hit this
			return;
		}

		this.props.actions.loadTranslations( locale, localeInfo.url );
	};

	render() {
		if ( ! this.props.translations ) {
			return null;
		}

		return (
			<BaseIntlProvider
				key={ this.props.locale }
				locale={ this.props.locale }
				messages={ this.props.translations }
			>
				{ this.props.children }
			</BaseIntlProvider>
		);
	}
}
