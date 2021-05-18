import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { bindAll, noop, omit } from 'lodash';
import { moment } from 'i18n-calypso';

import DateSelector from 'components/date-selector';

class DateRangeFilter extends React.PureComponent {
	static propTypes = {
		onStartDateChange: PropTypes.func.isRequired,
		onEndDateChange: PropTypes.func.isRequired,
		startDate: PropTypes.string,
		endDate: PropTypes.string
	};
	static defaultProps = {
		startDate: null,
		endDate: null
	};

	constructor( props ) {
		super( props );

		bindAll(this, ["isDateDisabledStart", "isDateDisabledEnd"]);
	}

	isDateDisabledStart(r) {
		var t = this.props.endDate;
		if (t) return r.isAfter(t) || r.isAfter(moment());
		return r.isAfter(moment())
	}

	isDateDisabledEnd(r) {
		var t = this.props.startDate;
		if (t) return r.isBefore(t) || r.isAfter(moment());
		return r.isAfter(moment())
	}

	render() {
		var r = this.props,
			t = r.onStartDateChange,
			n = r.onEndDateChange,
			a = r.endDate,
			s = r.startDate;
		return React.createElement("div", {
			className: "p-search_filter"
		}, React.createElement("div", {
			className: "p-search_filter__title"
		}, React.createElement("h3", {
			className: "p-search_filter__title_text"
		}, "Date")), React.createElement("div", {
			className: "p-search_filter__dates"
		}, React.createElement(DateSelector, {
			date: s,
			onDateChange: function e(r) {
				t(r ? moment(r) : null)
			},
			isDateDisabled: this.isDateDisabledStart,
			disableDatesAfter: a || moment().format("YYYY-MM-DD"),
			dateLabel: "Starting",
			dateAriaLabel: "Starting date",
			removeAriaLabel: "Remove starting date",
			qaLabel: "search_starting_date"
		}), React.createElement(DateSelector, {
			date: a,
			onDateChange: function e(r) {
				n(r ? moment(r) : null)
			},
			isDateDisabled: this.isDateDisabledEnd,
			disableDatesBefore: s,
			disableDatesAfter: moment().format("YYYY-MM-DD"),
			dateLabel: "Ending",
			dateAriaLabel: "Ending date",
			removeAriaLabel: "Remove ending date",
			qaLabel: "search_ending_date"
		})))
	}
}

export default DateRangeFilter;