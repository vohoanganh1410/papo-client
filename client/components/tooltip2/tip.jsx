import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

var c = {
	children: PropTypes.node.isRequired,
	position: PropTypes.string,
	arrowOffset: PropTypes.number,
	status: PropTypes.oneOf(["success"]),
	className: PropTypes.string,
	"data-qa": PropTypes.string
};
var d = {
	position: "top",
	arrowOffset: null,
	status: null,
	className: null,
	"data-qa": "tooltip-tip"
};

var TooltipTip = function e(r) {
	var t = r.children,
		n = r.position,
		a = r.arrowOffset,
		l = r.status,
		o = r.className,
		u = r["data-qa"];
	var c = classNames("c-tooltip__tip", "c-tooltip__tip--" + n, {
		"c-tooltip__tip--success": "success" === l
	}, o);
	var d = {};
	a && ("top-right" === n || "bottom-right" === n ? d.right = a : "top-left" !== n && "bottom-left" !== n || (d.left = a));
	return React.createElement("div", {
		className: c,
		"data-qa": u
	}, t, React.createElement("div", {
		className: "c-tooltip__tip__arrow",
		style: d
	}))
};
TooltipTip.displayName = "TooltipTip";
TooltipTip.defaultProps = d;

export default TooltipTip;
