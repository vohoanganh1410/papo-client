// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadTranslations } from 'actions/global-actions';

import { getCurrentLocale, getTranslations } from 'state/i18n/selectors';

import IntlProvider from './intl-provider';

function mapStateToProps( state ) {
	const locale = getCurrentLocale( state );

	return {
		locale,
		translations: getTranslations( state, locale ),
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		actions: bindActionCreators(
			{
				loadTranslations,
			},
			dispatch
		),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( IntlProvider );
