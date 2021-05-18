import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { times, omit } from 'lodash';
import { moment } from 'i18n-calypso';

class DaysOfWeek extends React.PureComponent {
	static propTypes = {
        className: PropTypes.string,
        format: PropTypes.string
    };
    static defaultProps = {
        className: null,
        format: "dd"
    };

    constructor( props ) {
		super( props );

		this.renderSingleDayOfWeek = this.renderSingleDayOfWeek.bind(this);
    }

    renderSingleDayOfWeek(r) {
		return React.createElement("th", {
            key: r,
            className: "c-calendar_month__day_of_week_heading"
        }, moment().weekday(r).format(this.props.format))
    }

    render() {
    	var r = this.props,
            t = r.className,
            n = r.format,
            a = omit(r, ["className", "format"]);
        var s = classNames("c-calendar_month__days_of_week", t);
        return React.createElement("tr", Object.assign({
            className: s
        }, a), times(7, this.renderSingleDayOfWeek))
    }
}

export default DaysOfWeek;