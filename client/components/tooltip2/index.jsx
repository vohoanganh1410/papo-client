import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, omit, isFunction } from 'lodash';
import ReactDom from 'react-dom';

import Popover from 'components/popover2';
import TooltipTip from './tip';

class Tooltip extends React.PureComponent {
	static propTypes = {
		children: PropTypes.element,
		position: PropTypes.string,
		delay: PropTypes.number,
		shouldFade: PropTypes.bool,
		tip: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
		tipClassName: PropTypes.string,
		tipArrowOffset: PropTypes.number,
		"data-qa": PropTypes.string,
		status: PropTypes.oneOf(["success"]),
		offsetX: PropTypes.number,
		offsetY: PropTypes.number,
		zIndex: PropTypes.oneOf(["above_fs", "fs", "menu", "below_menu"]),
		shouldForceVisible: PropTypes.bool,
		onMouseEnter: PropTypes.func,
		onMouseLeave: PropTypes.func
	};

	static defaultProps = {
		position: "top",
		delay: 150,
		shouldFade: true,
		tip: null,
		tipClassName: null,
		tipArrowOffset: null,
		"data-qa": undefined,
		status: null,
		offsetX: 0,
		offsetY: 0,
		children: null,
		zIndex: "below_menu",
		shouldForceVisible: false,
		onMouseEnter: noop,
		onMouseLeave: noop
	};

	constructor( props ) {
		super( props );

		this.state = {
			isHovering: false,
			contentsRect: null
		};
		this.delayTimer = null;
		this.tooltipContent = null;
		this.setRef = this.setRef.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.showTip = this.showTip.bind(this);
		this.hideTip = this.hideTip.bind(this);
		this.measureContents = this.measureContents.bind(this);
	}

	componentWillMount() {
		var r = React.Children.only(this.props.children);
		if ("function" === typeof r.type) {
			var t = !!r.props.onMouseEnter && !!r.props.onMouseLeave;
			if (!t) throw new Error("Tooltip must contain a React component that can implement event handlers. Try wrapping the inside of your Tooltip with a `button`, `div` or `span`.")
		}
	}

	componentWillReceiveProps(r) {
		var t = this;
		var n = r.shouldForceVisible;
		n && this.props.shouldForceVisible !== n && this.setState(function () {
			return {
				contentsRect: t.measureContents()
			}
		})
	}

	componentWillUnmount() {
		window.clearTimeout(this.delayTimer)
	}

	onMouseEnter(r) {
		this.delayTimer = window.setTimeout(this.showTip, this.props.delay);
		var t = React.Children.only(this.props.children);
		t.props.onMouseEnter && t.props.onMouseEnter(r);
		this.props.onMouseEnter(r)
	}

	onMouseLeave(r) {
		this.hideTip();
		this.props.onMouseLeave(r);
		window.clearTimeout(this.delayTimer)
	}

	setRef(r) {
		this.tooltipContent = r
	}

	measureContents() {
		if (this.tooltipContent) {
			var r = ReactDom.findDOMNode(this.tooltipContent).getBoundingClientRect();
			var t = window.scrollX || window.pageXOffset;
			var n = window.scrollY || window.pageYOffset;
			return {
				width: r.width,
				height: r.height,
				left: r.left + t,
				right: r.right + t,
				top: r.top + n,
				bottom: r.bottom + n
			}
		}
		return null
	}

	showTip() {
		var r = this;
		this.setState(function () {
			return {
				isHovering: true,
				contentsRect: r.measureContents()
			}
		})
	}

	hideTip() {
		this.setState(function () {
			return {
				isHovering: false,
				contentsRect: null
			}
		})
	}
	
	render() {
		var r = this.props,
			t = r.children,
			n = r.position,
			s = r.tip,
			i = r.tipClassName,
			o = r.tipArrowOffset,
			u = r.status,
			c = r.offsetX,
			d = r.offsetY,
			_ = r.zIndex,
			h = r.shouldFade,
			f = r["data-qa"],
			m = r.shouldForceVisible,
			g = omit(r, ["children", "position", "tip", "tipClassName", "tipArrowOffset", "status", "offsetX", "offsetY", "zIndex", "shouldFade", "data-qa", "shouldForceVisible"]);
		var b = this.state,
			y = b.isHovering,
			j = b.contentsRect;
		var O = void 0;
		o ? O = o : j && (O = j.width / 2);
		var E = {
			position: n,
			arrowOffset: O,
			status: u,
			className: i,
			"data-qa": f
		};
		var S = (y || m) && !!j;
		var x = S && React.createElement(Popover, {
			isOpen: S,
			position: n,
			targetBounds: j,
			overlayClassName: "c-popover c-popover--no-pointer",
			offsetX: c,
			offsetY: d,
			allowanceX: 0,
			allowanceY: 0,
			key: "tooltip-popover",
			zIndex: _,
			shouldFocusAfterRender: false,
			shouldFade: h,
			ariaHideApp: false
		}, React.createElement(TooltipTip, E, isFunction(s) ? s() : s));
		var T = React.Children.only(t);
		var I = React.cloneElement(T, Object.assign({}, g, T.props, {
			onClick: g.onClick || T.props.onClick,
			onMouseEnter: this.onMouseEnter,
			onMouseLeave: this.onMouseLeave,
			ref: this.setRef
		}));
		return React.createElement(React.Fragment, null, I, x)
	}
}

export default Tooltip;
