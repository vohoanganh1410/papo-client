// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
// @flow

let localizeFunction = null;

export function setLocalizeFunction( func ) {
	localizeFunction = func;
}

export function localizeMessage( id, defaultMessage ) {
	if ( ! localizeFunction ) {
		return defaultMessage;
	}

	return localizeFunction( id, defaultMessage );
}

export function getMonthLong( locale ) {
	if ( locale === 'ko' ) {
		// Long and short are equivalent in Korean except long has a bug on IE11/Windows 7
		return 'short';
	}

	return 'long';
}

export function t( v ) {
	return v;
}
