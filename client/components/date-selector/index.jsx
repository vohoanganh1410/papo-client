import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { bindAll } from 'lodash';
import { moment } from 'i18n-calypso';

import DatePickerTrigger from './date-picker-trigger';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';

var zr = {
    date: null,
    disableDatesBefore: null,
    disableDatesAfter: null,
    qaLabel: ""
};
var Lr = -364;

class DateSelector extends React.PureComponent {
	static propTypes = {
        onDateChange: PropTypes.func.isRequired,
        isDateDisabled: PropTypes.func.isRequired,
        date: PropTypes.string,
        disableDatesAfter: PropTypes.string,
        disableDatesBefore: PropTypes.string,
        dateLabel: PropTypes.string.isRequired,
        dateAriaLabel: PropTypes.string.isRequired,
        removeAriaLabel: PropTypes.string.isRequired,
        qaLabel: PropTypes.string
    };
    static defaultProps = {
        date: null,
        disableDatesBefore: null,
        disableDatesAfter: null,
        qaLabel: ""
    };

    constructor( props ) {
		super( props );

		bindAll( this, [ "onClearDateChange" ] );
    }

    onClearDateChange() {
    	this.props.onDateChange(null)
    }

    render() {
    	var r = this.props,
            t = r.onDateChange,
            n = r.date,
            a = r.isDateDisabled,
            s = r.disableDatesBefore,
            l = r.disableDatesAfter,
            i = r.dateLabel,
            o = r.dateAriaLabel,
            u = r.removeAriaLabel,
            c = r.qaLabel;
        var d = "";
        // console.log( n );
        d = n ? moment(n, "YYYY-MM-DD").format("DD/MM/YYYY") : "";// /*"es" === Nr.a.locale()*/false ? n ? moment(n, "YYYY-MM-DD").format("DD/MM/YYYY") : "" : n ? moment(n, "YYYY-MM-DD") : "";
        // console.log( d );
        var h = classNames("p-search_filter__datepicker_trigger", {
            "p-search_filter__datepicker_trigger--empty": !n
        });
        return React.createElement("div", {
            className: "p-search_filter__date",
            "data-qa": c
        }, React.createElement(DatePickerTrigger, {
            position: "bottom",
            offsetY: Lr,
            selectedDate: n,
            dateFormat: "YYYY-MM-DD",
            onDateChange: t,
            isDateDisabled: a,
            disableDatesBefore: s,
            disableDatesAfter: l
        }, React.createElement(UnstyledButton, {
            className: h,
            ariaLabel: n ? void 0 : o,
            "data-qa": c + "_button"
        }, React.createElement("div", {
            className: "p-search_filter__date_label"
        }, i), React.createElement("div", {
            className: "p-search_filter__date_readout"
        }, d), n ? null : React.createElement(Icon, {
            type: "calendar",
            className: "p-search_filter__calendar_icon"
        }))), n ? React.createElement(UnstyledButton, {
            ariaLabel: u,
            className: "p-search_filter__date_close",
            onClick: this.onClearDateChange,
            "data-qa": c + "_close"
        }, React.createElement(Icon, {
            type: " c-icon--times-small"
        })) : null)
    }
}

export default DateSelector;