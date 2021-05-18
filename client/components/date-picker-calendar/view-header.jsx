import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { noop, bindAll, omit } from 'lodash';
import { moment } from 'i18n-calypso';

import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';

class ViewHeader extends React.Component {
	static propTypes = {
	    title: PropTypes.string,
	    onTitleClick: PropTypes.func,
	    onLeftArrowClick: PropTypes.func,
	    onRightArrowClick: PropTypes.func,
	    titleLabel: PropTypes.string,
	    leftArrowLabel: PropTypes.string,
	    rightArrowLabel: PropTypes.string,
	    rightArrowIsDisabled: PropTypes.bool,
	    leftArrowIsDisabled: PropTypes.bool,
	    onFocus: PropTypes.func,
	    onBlur: PropTypes.func
	};
	static defaultProps = {
	    title: "",
	    onTitleClick: null,
	    onLeftArrowClick: null,
	    onRightArrowClick: null,
	    titleLabel: undefined,
	    leftArrowLabel: undefined,
	    rightArrowLabel: undefined,
	    rightArrowIsDisabled: false,
	    leftArrowIsDisabled: false,
	    onFocus: noop,
	    onBlur: noop
	};

	constructor( props ) {
		super( props );

		this.titleRef = null;
		bindAll( this, ["setTitleRef"] );
	}

	setTitleRef(r) {
		this.titleRef = r
	}

	focus() {
		this.titleRef && this.titleRef.focus()
	}

	renderButton(r) {
		var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        var n = t.className,
            s = omit(t, ["className"]); // or pick?????????
        var i = classNames("c-calendar_view_header__stepper_btn", n);
        return React.createElement(UnstyledButton, Object.assign({
            className: i
        }, s), React.createElement(Icon, {
            type: r
        }))
	}

	renderLeftArrow() {
		if (this.props.onLeftArrowClick) return this.renderButton("chevron-large-left", {
            onClick: this.props.onLeftArrowClick,
            className: "c-calendar_view_header__left_stepper_btn",
            "aria-label": this.props.leftArrowLabel,
            "data-qa": "cal_header_prev_btn",
            disabled: this.props.leftArrowIsDisabled
        });
        return null
	}

	renderRightArrow() {
		if (this.props.onRightArrowClick) return this.renderButton("chevron-large-right", {
            onClick: this.props.onRightArrowClick,
            className: "c-calendar_view_header__right_stepper_btn",
            "aria-label": this.props.rightArrowLabel,
            "data-qa": "cal_header_next_btn",
            disabled: this.props.rightArrowIsDisabled
        });
        return null
	}

	renderTitle() {
		var r = this.props,
            t = r.title,
            n = r.titleLabel,
            a = r.onTitleClick;
        if (a) return React.createElement("button", {
            className: "c-button-unstyled c-calendar_view_header__title_btn",
            "data-qa": "cal_header_title",
            onClick: a,
            "aria-label": n || t,
            ref: this.setTitleRef
        }, t);
        return t
	}

	render() {
		return React.createElement("div", {
            className: "c-calendar_view_header",
            onFocus: this.props.onFocus,
            onBlur: this.props.onBlur
        }, this.renderLeftArrow(), React.createElement("span", {
            className: "c-calendar_view_header__title"
        }, this.renderTitle()), this.renderRightArrow())
	}
}

export default ViewHeader;