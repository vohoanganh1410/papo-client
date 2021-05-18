import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { times } from 'lodash';
import { moment } from 'i18n-calypso';

import DaysOfWeek from './days-of-week';

class MonthView extends React.Component {
	static propTypes = {
        className: PropTypes.string,
        month: PropTypes.string.isRequired,
        monthFormat: PropTypes.string,
        renderDate: PropTypes.func,
        dateFormat: PropTypes.string,
        header: PropTypes.node
    };
    static defaultProps = {
        className: null,
        monthFormat: "YYYY-MM",
        renderDate: function e(r) {
            var t = r.value,
                n = r.format,
                a = r.sameMonth;
            return a && moment(t, n).format("D")
        },
        dateFormat: "YYYY-MM-DD",
        header: React.createElement(DaysOfWeek, null)
    };

    constructor( props ) {
		super( props );
    }

    renderDate(r) {
		var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            n = t.startMoment,
            a = t.endMoment;
        var s = this.props.dateFormat;
        var l = r.startOf("day").format(s);
        var i = r.diff(n, "days");
        var o = r.clone().endOf("day").diff(a, "days");
        var u = i >= 0 && o <= 0;
        var c = r.isSame(new Date, "day");
        var d = r.weekday();
        var h = u && 0 === d && i < 7;
        var f = u && 6 === d && i < 7;
        var m = u && 0 === d && o > -7;
        var v = u && 6 === d && o > -7;
        var p = this.props.renderDate({
            value: l,
            format: s,
            sameMonth: u,
            isToday: c,
            monthStart: 0 === i,
            monthEnd: 0 === o,
            firstWeekStart: h,
            firstWeekEnd: f,
            lastWeekStart: m,
            lastWeekEnd: v
        });
        return React.createElement("td", {
            key: l,
            className: "c-calendar_month__date_container"
        }, p)
    }

    renderWeek(r, t) {
    	var n = r.clone();
        var a = [];
        while (a.length < 7) {
            a.push(this.renderDate(n, t));
            n.add(1, "day")
        }
        return React.createElement("tr", {
            key: r.week(),
            className: "c-calendar_month__week"
        }, a)
    }

    render() {
    	var r = this.props,
            t = r.month,
            n = r.monthFormat,
            a = r.className,
            s = r.header;
        var l = moment(t, n);
        var i = l.clone().startOf("month");
        var o = l.clone().endOf("month");
        var u = i.clone().startOf("week");
        var c = {
            startMoment: i,
            endMoment: o
        };
        var d = [];
        while (u.isBefore(o)) {
            d.push(this.renderWeek(u.clone(), c));
            u.add(1, "week")
        }
        var h = classNames("c-calendar_month", a);
        return React.createElement("table", {
            className: h
        }, React.createElement("thead", null, s), React.createElement("tbody", null, d))
    }
}

export default MonthView;