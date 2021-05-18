import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { noop, omit, bindAll } from 'lodash';
import { moment } from 'i18n-calypso';

import ViewHeader from './view-header';
import MonthView from './month-view';
import Year from './year';

function W(e, r) {
    if (e && r) return moment(e, r);
    // e && z["isDev"] && G.warn("View specified without format -- ignoring");
    return moment()
}

var B = {
    year: "year",
    month: "month"
};
var H = {
    year: "YYYY",
    month: "YYYY-MM"
};

class DatePickerCalendar extends React.PureComponent {
	static propTypes = {
        className: PropTypes.string,
        selectedDate: PropTypes.string,
        disabledDates: PropTypes.arrayOf(PropTypes.string),
        monthTitleFormat: PropTypes.string,
        yearTitleFormat: PropTypes.string,
        dateFormat: PropTypes.string,
        onDateChange: PropTypes.func,
        kbNavActive: PropTypes.bool,
        focusOnMount: PropTypes.bool,
        isDateDisabled: PropTypes.func,
        disableDatesBefore: PropTypes.string,
        disableDatesAfter: PropTypes.string,
        featureA11yDatepicker: PropTypes.bool.isRequired,
        logger: PropTypes.object
    };
    static defaultProps = {
        className: null,
        selectedDate: null,
        disabledDates: [],
        monthTitleFormat: "MMMM YYYY",
        yearTitleFormat: "YYYY",
        dateFormat: "YYYY-MM-DD",
        onDateChange: noop,
        kbNavActive: true,
        focusOnMount: true,
        isDateDisabled: void 0,
        disableDatesBefore: void 0,
        disableDatesAfter: void 0,
        featureA11yDatepicker: true
    };

    constructor( props ) {
		super( props );

		var n = this.props,
            a = n.selectedDate,
            s = n.dateFormat,
            l = n.focusOnMount;
        var i = W(a, s);
        var u = i.format(H.month);
        this.state = {
            ariaLive: null,
            ariaIntro: true,
            activeDate: i.format(s),
            selectedMonth: u,
            activeMonth: u,
            viewType: B.month,
            viewFormat: H.month,
            view: u,
            focusOnActiveMonthOrDate: l
        };
        this.isDateDisabled(i) && (this.state.activeDate = this.getActiveDateFromMonth(i));
        bindAll(this, ["handleKeyboardCommand", "handleDateClick", "handleMonthClick", "handleViewSwitch", "handleViewIncrement", "handleViewDecrement", "renderDate", "renderMonthButton", "renderMonthView", "renderYearView"]);
        this.introRef = React.createRef();
        this.activeDayElement = React.createRef();
        this.activeMonthElement = React.createRef();
    }

    componentDidMount() {
    	// this.keyCommands = new j["a"];
     //    this.keyCommands.bindAll([{
     //        keys: ["up", "down", "left", "right", "pageup", "pagedown"],
     //        handler: this.handleKeyboardCommand
     //    }]);
        this.maybeFocusOnActiveMonthOrDate()
    }

    componentDidUpdate() {
    	this.maybeFocusOnActiveMonthOrDate()
    }

    componentWillUnmount() {
    	// this.keyCommands.reset()
    }

    getActiveDateFromMonth(r) {
		if (this.props.selectedDate) {
            var t = moment(this.props.selectedDate, this.props.dateFormat);
            if (r.isSame(t, "month") && !this.isDateDisabled(t)) return t.format(this.props.dateFormat)
        }
        if (this.state.activeDate) {
            var n = moment(this.state.activeDate, this.props.dateFormat).month(r.month()).year(r.year());
            if (!this.isDateDisabled(n)) return n.format(this.props.dateFormat)
        }
        var a = r.clone().startOf("month");
        while (r.isSame(a, "month")) {
            if (!this.isDateDisabled(a)) return a.format(this.props.dateFormat);
            a.add(1, "day")
        }
        return null
    }

    getActiveMonthFromYear(r) {
		if (this.state.selectedMonth) {
            var t = moment(this.state.selectedMonth, H.month);
            if (r.isSame(t, "year") && !this.isMonthDisabled(t)) return t.format(H.month)
        }
        if (this.state.activeMonth) {
            var n = moment(this.state.activeMonth, H.month).year(r.year());
            if (!this.isMonthDisabled(n)) return n.format(H.month)
        }
        var a = r.clone().startOf("year");
        while (r.isSame(a, "year")) {
            if (!this.isMonthDisabled(a)) return a.format(H.month);
            a.add(1, "month")
        }
        return null
    }

    setView(r, t, n) {
        // alert("x")
    	var a = this;
        // z["isDev"] && !t && this.props.logger.warn("Missing view type");
        var s = this.state.viewType !== t;
        var l = H[t];
        var i = s && n;
        var o = null;
        i || (t === B.month ? o = r.format(this.props.monthTitleFormat) : t === B.year && (o = r.format(this.props.yearTitleFormat)));
        this.setState(function(e) {
            return {
                ariaLive: o,
                ariaIntro: i,
                viewType: t,
                viewFormat: l,
                view: r.format(l),
                selectedMonth: t === B.month ? r.format(H.month) : e.selectedMonth,
                activeDate: t === B.month ? a.getActiveDateFromMonth(r) : e.activeDate,
                activeMonth: t === B.year ? a.getActiveMonthFromYear(r) : e.activeMonth,
                focusOnActiveMonthOrDate: i
            }
        })
    }

    maybeFocusOnActiveMonthOrDate() {
    	this.props.kbNavActive && this.state.focusOnActiveMonthOrDate && (this.activeDayElement.current ? this.activeDayElement.current.focus() : this.activeMonthElement.current && this.activeMonthElement.current.focus())
    }

    handleViewSwitch(r) {
    	var t = this.state,
            n = t.selectedMonth,
            a = t.viewType;
        var s = a === B.month ? B.year : B.month;
        var l = moment(n, H.month);
        this.setView(l, s, /*Object(P["a"])(r)*/true)
    }

    handleViewIncrement(r) {
		var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
        var n = this.state,
            a = n.view,
            s = n.viewType;
        var l = moment(a, H[s]).add(t, s);
        this.setView(l, s, /*Object(P["a"])(r)*/true)
    }

    handleViewDecrement(r) {
		this.handleViewIncrement(r, -1)
    }

    handleKeyboardCommand(r, t) {
    	if (!this.props.kbNavActive) return;
        r.stopPropagation();
        r.preventDefault();
        if (this.state.viewType === B.month) switch (t) {
            case "up":
                this.moveDateBy(-1, "week");
                break;
            case "down":
                this.moveDateBy(1, "week");
                break;
            case "left":
                this.moveDateBy(-1, "day");
                break;
            case "right":
                this.moveDateBy(1, "day");
                break;
            case "pageup":
                this.moveDateBy(-1, "month");
                break;
            case "pagedown":
                this.moveDateBy(1, "month");
                break;
            default:
                break
        } else if (this.state.viewType === B.year) switch (t) {
            case "up":
                this.moveSelectedMonthBy(-3);
                break;
            case "down":
                this.moveSelectedMonthBy(3);
                break;
            case "left":
                this.moveSelectedMonthBy(-1);
                break;
            case "right":
                this.moveSelectedMonthBy(1);
                break;
            case "pageup":
                this.moveSelectedMonthBy(-12);
                break;
            case "pagedown":
                this.moveSelectedMonthBy(12);
                break;
            default:
                break
        }
    }

    handleDateClick(r) {
		var t = r.target.dataset.value;
        if (this.isDateDisabled(moment(t, this.props.dateFormat))) return;
        this.setState(function() {
            return {
                ariaLive: null,
                activeDate: t
            }
        });
        this.props.onDateChange(t)
    }

    handleMonthClick(r) {
		var t = r.target.dataset.value;
        var n = r.target.dataset.format;
        var a = moment(t, n);
        this.setView(a, B.month, /*Object(P["a"])(r)*/true)
    }

    isDateSelected(r) {
		var t = moment(this.props.selectedDate, this.props.dateFormat);
        return r.isSame(t)
    }

    isDateActive(r) {
		var t = moment(this.state.activeDate, this.props.dateFormat);
        return r.isSame(t)
    }

    isDateDisabled(r) {
		var t = false;
        this.props.isDateDisabled && (t = this.props.isDateDisabled(r));
        if (!t)
            for (var n = 0, a = this.props.disabledDates[n]; n < this.props.disabledDates.length; n++) r.isSame(moment(a, this.props.dateFormat)) && (t = true);
        !t && this.props.disableDatesBefore && (t = t || r.isBefore(moment(this.props.disableDatesBefore, this.props.dateFormat)));
        !t && this.props.disableDatesAfter && (t = t || r.isAfter(moment(this.props.disableDatesAfter, this.props.dateFormat)));
        return t
    }

    isMonthDisabled(r) {
		var t = false;
        this.props.disableDatesBefore && (t = r.clone().endOf("month").isBefore(moment(this.props.disableDatesBefore, this.props.dateFormat)));
        this.props.disableDatesAfter && !t && (t = r.clone().startOf("month").isAfter(moment(this.props.disableDatesAfter, this.props.dateFormat)));
        return t
    }

    moveDateBy(r, t) {
    	var n = this;
        var a = this.state,
            s = a.activeDate,
            l = a.activeMonth;
        if (!s && l) {
            var i = moment(l, H.month);
            var o = this.getActiveDateFromMonth(i);
            this.setState(function() {
                return {
                    activeDate: o,
                    focusOnActiveMonthOrDate: !!o
                }
            });
            return
        }
        if (this.activeDayElement.current && document.activeElement !== this.activeDayElement.current) {
            this.state.focusOnActiveMonthOrDate ? this.activeDayElement.current.focus() : this.setState(function() {
                return {
                    focusOnActiveMonthOrDate: true
                }
            });
            return
        }
        var u = moment(s, this.props.dateFormat);
        u.add(r, t);
        this.isDateDisabled(u) || this.setState(function() {
            return {
                ariaIntro: false,
                activeDate: u.format(n.props.dateFormat),
                view: u.format(H.month),
                focusOnActiveMonthOrDate: true
            }
        })
    }

    moveSelectedMonthBy(r) {
		var t = this.state.activeMonth;
        if (!t) return;
        if (this.activeMonthElement.current && document.activeElement !== this.activeMonthElement.current) {
            this.state.focusOnActiveMonthOrDate ? this.activeMonthElement.current.focus() : this.setState(function() {
                return {
                    focusOnActiveMonthOrDate: true
                }
            });
            return
        }
        var n = moment(t, H.month);
        n.add(r, "month");
        this.isMonthDisabled(n) || this.setState(function() {
            return {
                ariaIntro: false,
                activeMonth: n.format(H.month),
                view: n.format(H.year),
                focusOnActiveMonthOrDate: true
            }
        })
    }

    canMoveForward() {
    	if (!this.props.disableDatesAfter) return true;
        return moment(this.state.view, H[this.state.viewType]).endOf(this.state.viewType).isBefore(moment(this.props.disableDatesAfter, this.props.dateFormat))
    }

    canMoveBack() {
    	if (!this.props.disableDatesBefore) return true;
        return moment(this.state.view, H[this.state.viewType]).startOf(this.state.viewType).isAfter(moment(this.props.disableDatesBefore, this.props.dateFormat))
    }

    renderMonthButton() {
    	var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        var t = r.value,
            n = r.format,
            s = omit(r, ["value", "format"]); // or pick??????????
        var i = this.props.featureA11yDatepicker;
        var o = moment(t, n);
        var u = t === this.state.activeMonth;
        var c = t === this.state.selectedMonth;
        var d = classNames("c-button-unstyled", "c-mini_calendar__month_button", "c-mini_calendar__month_" + (o.month() + 1), {
            "c-mini_calendar__month_button--is_active": u,
            "c-mini_calendar__month_button--is_selected": c,
            "focus-ring": u && this.state.focusOnActiveMonthOrDate
        });
        var _ = this.state.ariaIntro && u && i ? "Month picker: {selectedMonth} selected. Use arrow keys to change month." : o.format("MMMM YYYY");
        // var _ = this.state.ariaIntro && u && i ? D.t("Month picker: {selectedMonth} selected. Use arrow keys to change month.", {
        //     selectedMonth: o.format("MMMM YYYY")
        // }) : o.format("MMMM YYYY");
        return React.createElement("button", Object.assign({
            style: {
                padding: 25,
                width: "100%",
                textAlign: "center"
            },
            tabIndex: u ? "0" : "-1",
            ref: u ? this.activeMonthElement : noop,
            className: d,
            disabled: this.isMonthDisabled(o),
            onClick: this.handleMonthClick,
            "aria-current": !!c,
            "aria-label": _,
            "data-value": t,
            "data-format": n,
            "data-qa": u && "active_month",
            "data-qa-month": t
        }, s), o.format("MMM"))
    }

    renderDate() {
    	var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            t = r.value,
            n = r.dateFormat,
            a = r.sameMonth,
            s = r.isToday,
            l = r.monthStart,
            i = r.monthEnd,
            o = r.firstWeekStart,
            u = r.firstWeekEnd,
            c = r.lastWeekStart,
            d = r.lastWeekEnd;
        var _ = this.props.featureA11yDatepicker;
        var h = moment(t, n);
        var f = this.isDateActive(h);
        var m = this.isDateSelected(h);
        var p = classNames("c-date_picker_calendar__date", "c-button-unstyled", {
            "c-date_picker_calendar__date--is_today": s,
            "c-date_picker_calendar__date--is_selected": m,
            "c-date_picker_calendar__date--is_active": f,
            "c-date_picker_calendar__date--disabled": this.isDateDisabled(h),
            "c-date_picker_calendar__date--month_start": l,
            "c-date_picker_calendar__date--month_end": i,
            "c-date_picker_calendar__date--first_week_start": o,
            "c-date_picker_calendar__date--first_week_end": u,
            "c-date_picker_calendar__date--last_week_start": c,
            "c-date_picker_calendar__date--last_week_end": d,
            "focus-ring": f && this.state.focusOnActiveMonthOrDate
        });
        var b = this.state.ariaIntro && f && _ ? "Date picker: {selectedDate} selected. Use arrow keys to change date." : h.format("D, MMMM YYYY, dddd");// D.t("Date picker: {selectedDate} selected. Use arrow keys to change date.", {
        //     selectedDate: h.format("LL")
        // }) : h.format("D, MMMM YYYY, dddd");
        return a ? React.createElement("button", {
            ref: f ? this.activeDayElement : noop,
            className: p,
            onClick: this.handleDateClick,
            "data-value": t,
            "data-format": n,
            tabIndex: f ? "0" : "-1",
            "aria-current": !!m && "date",
            "aria-label": b,
            "data-qa": f && "active_date",
            "data-qa-date": t
        }, h.format("D")) : null
    }

    renderMonthView() {
        // alert("sdf")
    	var r = this.state.view;
        var t = this.props,
            n = t.dateFormat,
            a = t.monthTitleFormat,
            s = t.featureA11yDatepicker;
        var l = moment(r, n);
        var i = l.format(a);
        var o = s ? "Jump to another month" : "";
        return React.createElement("div", {
            className: "c-mini_calendar__month_view"
        }, React.createElement("i", {
            enabled: ["feature_date_picker"]
        }, React.createElement(ViewHeader, {
            title: i,
            onTitleClick: this.handleViewSwitch,
            onLeftArrowClick: this.handleViewDecrement,
            onRightArrowClick: this.handleViewIncrement,
            titleLabel: o,
            leftArrowLabel: "Previous month",
            rightArrowLabel: "Next month",
            leftArrowIsDisabled: !this.canMoveBack(),
            rightArrowIsDisabled: !this.canMoveForward()
        })), React.createElement(MonthView, {
            month: r,
            monthFormat: n,
            renderDate: this.renderDate
        }))
    }

    renderYearView() {
    	var r = this.state.view;
        var t = this.props,
            n = t.dateFormat,
            a = t.yearTitleFormat,
            s = t.featureA11yDatepicker;
        var l = moment(r, n);
        var i = l.format(a);
        var o = s ? "Back to date picker" : "";
        return React.createElement("div", {
            className: "c-mini_calendar__year_view"
        }, React.createElement("i", {
            enabled: ["feature_date_picker"]
        }, React.createElement(ViewHeader, {
            title: i,
            onTitleClick: this.handleViewSwitch,
            onLeftArrowClick: this.handleViewDecrement,
            onRightArrowClick: this.handleViewIncrement,
            titleLabel: o,
            leftArrowLabel: "Previous year",
            rightArrowLabel: "Next year",
            leftArrowIsDisabled: !this.canMoveBack(),
            rightArrowIsDisabled: !this.canMoveForward()
        })), React.createElement(Year, {
            year: r,
            yearFormat: n,
            renderMonth: this.renderMonthButton
        }))
    }

    renderAriaLive() {
    	if (this.state.ariaLive) return React.createElement("span", {
            className: "offscreen",
            "aria-live": "polite",
            "aria-label": this.state.ariaLive
        });
        return null
    }

    render() {
    	var r = this.state.viewType;
        var t = classNames("c-date_picker_calendar", this.props.className);
        return React.createElement("div", {
            className: t,
            "data-qa": "date_picker_calendar"
        }, this.renderAriaLive(), React.createElement("div", {
            className: "c-mini_calendar"
        }, r === B.year ? this.renderYearView() : this.renderMonthView()))
    }
}

export default DatePickerCalendar;