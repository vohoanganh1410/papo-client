/** @format */

/**
 * External dependencies
 */

import {
	compact,
	every,
	filter,
	find,
	flowRight as compose,
	get,
	has,
	map,
	partialRight,
	some,
	split,
	includes,
	startsWith,
} from 'lodash';
import i18n from 'i18n-calypso';
import moment from 'moment';

/**
 * Internal dependencies
 */
import config from 'config';
import { isHttps, withoutHttp, addQueryArgs, urlToSlug } from 'lib/url';

/**
 * Internal dependencies
 */
import createSelector from 'lib/create-selector';

