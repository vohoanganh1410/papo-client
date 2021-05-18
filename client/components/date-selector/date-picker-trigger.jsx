import React from 'react';
import PropTypes from 'prop-types';
import {noop, bindAll, omit} from 'lodash';
import {moment} from 'i18n-calypso';
import classNames from 'classnames';

import Popover from 'components/popover2';
import PopoverTrigger from 'components/popover2/popover-trigger';
import DatePickerCalendar from 'components/date-picker-calendar';

var x = {
	x: 0,
	y: 12
};

class DatePickerTrigger extends React.PureComponent {
	static propTypes = {
		children: PropTypes.node,
		renderTrigger: PropTypes.func,
		dropdownClassName: PropTypes.string,
		calendarClassName: PropTypes.string,
		selectedDate: PropTypes.string,
		disabledDates: PropTypes.arrayOf(PropTypes.string),
		monthTitleFormat: PropTypes.string,
		yearTitleFormat: PropTypes.string,
		dateFormat: PropTypes.string.isRequired,
		onDateChange: PropTypes.func,
		isDateDisabled: PropTypes.func,
		disableDatesBefore: PropTypes.string,
		disableDatesAfter: PropTypes.string
	};
	static defaultProps = {
		children: null,
		renderTrigger: undefined,
		dropdownClassName: undefined,
		onDateChange: noop,
		calendarClassName: undefined,
		selectedDate: undefined,
		disabledDates: undefined,
		monthTitleFormat: undefined,
		yearTitleFormat: undefined,
		isDateDisabled: undefined,
		disableDatesBefore: undefined,
		disableDatesAfter: undefined
	};

	constructor(props) {
		super(props);

		this.state = {
			selectedDate: moment(props.selectedDate, props.dateFormat).isValid() ? props.selectedDate : null
		};
		this.trigger = React.createRef();
		bindAll(this, ["handleDateChange", "renderPopover"]);
	};

	componentWillReceiveProps(r) {
		this.setState(function() {
			return {
				selectedDate: moment(r.selectedDate, r.dateFormat).isValid() ? r.selectedDate : null
			}
		})
	};

	triggerPopover(r) {
		this.trigger.current && this.trigger.current.onTrigger(r)
	};

	handleDateChange(r) {
		this.setState(function() {
			return {
				selectedDate: r
			}
		});
		this.props.onDateChange(r);
		this.trigger.current && this.trigger.current.closePopover()
	};

	renderPopover(r) {
		var t = this.props,
			n = t.calendarClassName,
			a = t.dropdownClassName,
			s = t.disabledDates,
			i = t.monthTitleFormat,
			o = t.yearTitleFormat,
			u = t.dateFormat,
			c = t.isDateDisabled,
			d = t.disableDatesBefore,
			_ = t.disableDatesAfter;
		var h = classNames(a, "c-date_picker__dropdown");
		return React.createElement(Popover, Object.assign({
			position: "bottom-right",
			offsetX: x.x,
			offsetY: x.y
		}, r), React.createElement("div", {
			className: h,
			"data-qa": "date_picker_dropdown"
		}, React.createElement(DatePickerCalendar, {
			className: n,
			selectedDate: this.state.selectedDate,
			disabledDates: s,
			monthTitleFormat: i,
			yearTitleFormat: o,
			dateFormat: u,
			onDateChange: this.handleDateChange,
			isDateDisabled: c,
			disableDatesBefore: d,
			disableDatesAfter: _,
			focusOnMount: r.openedWithKeyboard
		})))
	};

	renderTrigger() {
		if (this.props.renderTrigger) return this.props.renderTrigger(this.state.selectedDate);
		return this.props.children
	};

	render() {
		var r = this.props,
			t = r.children,
			n = r.renderTrigger,
			s = r.calendarClassName,
			i = r.dropdownClassName,
			o = r.selectedDate,
			u = r.disabledDates,
			c = r.monthTitleFormat,
			d = r.yearTitleFormat,
			_ = r.dateFormat,
			h = r.onDateChange,
			f = r.isDateDisabled,
			m = r.disableDatesBefore,
			v = r.disableDatesAfter,
			p = omit(r, ["children", "renderTrigger", "calendarClassName", "dropdownClassName", "selectedDate", "disabledDates", "monthTitleFormat", "yearTitleFormat", "dateFormat", "onDateChange", "isDateDisabled", "disableDatesBefore", "disableDatesAfter"]);
		return React.createElement(PopoverTrigger, Object.assign({}, p, {
			ref: this.trigger,
			renderPopover: this.renderPopover,
			ariaHasPopup: true
		}), this.renderTrigger())
	}
}

export default DatePickerTrigger;
