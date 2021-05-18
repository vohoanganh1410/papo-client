import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { noop, omit } from 'lodash';

import { moment } from 'i18n-calypso';

class Year extends React.Component {
	static propTypes = {
        className: PropTypes.string,
        year: PropTypes.string.isRequired,
        yearFormat: PropTypes.string,
        renderMonth: PropTypes.func,
        monthFormat: PropTypes.string
    };
    static defaultProps = {
        className: null,
        yearFormat: "YYYY",
        renderMonth: function e(r) {
            var t = r.value,
                n = r.format;
            return moment(t, n).format("MMM")
        },
        monthFormat: "YYYY-MM"
    };

    constructor( props ) {
		super( props );

		this.renderMonth = this.renderMonth.bind(this);
    }

    renderMonth(r) {
    	var t = this.props.monthFormat;
        var n = r.format(t);
        var a = this.props.renderMonth({
            value: n,
            format: t
        });
        return React.createElement("li", {
            key: n,
            className: "c-calendar_year__month"
        }, a)
    }

    render() {
    	var r = this.props,
            t = r.year,
            n = r.yearFormat,
            a = r.className;
        var s = moment(t, n);
        var l = s.clone().startOf("year");
        var i = s.clone().endOf("year");
        var o = l.clone();
        var u = [];
        while (o.isBefore(i)) {
            u.push(this.renderMonth(o.clone()));
            o.add(1, "month")
        }
        var c = classNames("c-calendar_year", a);
        return React.createElement("div", {
            className: c
        }, React.createElement("ul", {
            className: "c-calendar_year__list"
        }, u))
    }
}

export default Year;