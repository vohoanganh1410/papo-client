/** @format */

/**
 * External dependencies
 */

import { translate } from 'i18n-calypso';

export const intervals = [
	{ value: 'day', label: translate( 'Days' ) },
	{ value: 'week', label: translate( 'Weeks' ) },
	{ value: 'month', label: translate( 'Months' ) },
	{ value: 'year', label: translate( 'Years' ) },
];

export const navItems = {
	traffic: { label: translate( 'Traffic' ), path: '/dashboard/stats', showIntervals: true },
	insights: { label: translate( 'Insights' ), path: '/dashboard/stats/insights', showIntervals: false },
	activity: { label: translate( 'Activity' ), path: '/dashboard/stats/activity', showIntervals: false },
	store: { label: translate( 'Store' ), path: '/store/stats/orders', showIntervals: true },
};
