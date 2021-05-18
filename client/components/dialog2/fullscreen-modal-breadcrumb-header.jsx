import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { forEach } from 'lodash';

import Button from 'components/button2';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';

class FullscreenModalBreadcrumbHeader extends React.PureComponent {
	static propTYpes = {
        breadcrumbTitles: PropTypes.arrayOf(PropTypes.string),
        highlightedIndex: PropTypes.number,
        isSteppingBack: PropTypes.bool
    };
    static defaultProps = {
        breadcrumbTitles: [],
        highlightedIndex: null,
        isSteppingBack: false
    };

    constructor( props ) {
		super( props );
    }

    setBreadcrumbAnimationDirection(r) {
		return r ? "reverse" : ""
    }

    renderBreadcrumbHeader() {
    	var r = this;
        var t = this.props,
            n = t.breadcrumbTitles,
            a = t.highlightedIndex;
        var s = [];
        forEach(n, function(e, t) {
            t === a ? s.push(r.renderActiveBreadcrumb(e, t)) : s.push(r.renderInactiveBreadcrumb(e, t))
        });
        return React.createElement("div", {
            className: "c-fullscreen_modal__breadcrumb_wrapper",
            "data-qa": "fs_modal_breadcrumb_wrapper"
        }, s)
    }

    renderActiveBreadcrumb(r) {
    	var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        var n = this.props.isSteppingBack;
        var a = this.setBreadcrumbAnimationDirection(n);
        return React.createElement("div", {
            className: "c-fullscreen_modal__breadcrumb",
            "data-qa": "fs_modal_breadcrumb_" + t,
            key: t
        }, React.createElement(Icon, {
            className: "c-fullscreen_modal__breadcrumb_circle_icon active",
            "data-qa": "fs_modal_breadcrumb_icon_active",
            type: "circle_fill"
        }), React.createElement("div", {
            "data-js": "modal_animated_step",
            className: "c-fullscreen_modal__breadcrumb_animated_step " + a,
            "data-qa": "fs_modal_breadcrumb_animated_step"
        }), React.createElement("span", {
            className: "c-fullscreen_modal__breadcrumb_text active bold",
            "data-qa": "fs_modal_breadcrumb_text_active"
        }, r))
    }

    renderInactiveBreadcrumb(r) {
		var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        return React.createElement("div", {
            className: "c-fullscreen_modal__breadcrumb",
            "data-qa": "fs_modal_breadcrumb_" + t,
            key: t
        }, React.createElement(Icon, {
            className: "c-fullscreen_modal__breadcrumb_circle_icon",
            "data-qa": "fs_modal_breadcrumb_icon_inactive",
            type: "circle_fill"
        }), React.createElement("span", {
            className: "c-fullscreen_modal__breadcrumb_text",
            "data-qa": "fs_modal_breadcrumb_text_inactive"
        }, r))
    }

    render() {
    	var r = this.props,
            t = r.breadcrumbTitles,
            n = r.highlightedIndex;
        var a = t[n];
        return React.createElement("div", {
            className: "c-fullscreen_modal__breadcrumb_header",
            "data-qa": "fs_modal_breadcrumb_header"
        }, React.createElement("div", {
            className: "c-fullscreen_modal__breadcrumb_line"
        }), React.createElement("p", {
            className: "c-fullscreen_modal__title--small small bold",
            "data-js": "c-fullscreen_modal__title"
        }, a), this.renderBreadcrumbHeader())
    }
}

export default FullscreenModalBreadcrumbHeader;