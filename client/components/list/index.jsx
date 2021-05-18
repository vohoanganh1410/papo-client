/** @format */

/**
 * External dependencies
 */

import React from 'react';
import PropTypes from 'prop-types';
import { noop, isEqual } from 'lodash';
import classNames from 'classnames';

class List extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.onScroll = this.onScroll.bind(this);
		this.onContentScroll = this.onContentScroll.bind(this);
		this.onSelectionChange = this.onSelectionChange.bind(this);
		this.setRef = this.setRef.bind(this);
		this.setContentRef = this.setContentRef.bind(this);
		this.setHeight = this.setHeight.bind(this);
		this.getScrollTop = this.getScrollTop.bind(this);
		this.getVisibleRange = this.getVisibleRange.bind(this);
		this.isItemInView = this.isItemInView.bind(this);
		this.onScrollStart = this.onScrollStart.bind(this);
		// this.onScrollEnd = Object(g["a"])(this.onScrollEnd.bind(this), j);
		// this.layout = e.layout || new y["a"];
		this.node = null;
		this.contentNode = null;
		this.isSelecting = false;
		this.selectionStart = null;
		this.selectionEnd = null;
		this.scrollStartTimeout = null;
		this.layout.setKeys(this.keys);
		var n = this.getBounds(0, this.height),
			s = n.start,
			l = n.end;
		var o = this.layout.getTops();
		this.state = {
			start: s,
			end: l,
			tops: o,
			scrolling: false
		};
	}

	static propTypes = {
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		className: PropTypes.string,
		keys: PropTypes.arrayOf(PropTypes.string).isRequired,
		// layout: PropTypes.instanceOf(y["a"]),
		rowRenderer: PropTypes.func.isRequired,
		getAriaLabelForRow: PropTypes.func,
		role: PropTypes.string,
		itemRole: PropTypes.string,
		ariaLabel: PropTypes.string,
		fadeScrollbar: PropTypes.bool,
		onScroll: PropTypes.func,
		onContentScroll: PropTypes.func,
		onSelectionChange: PropTypes.func,
		shouldHorizontallyScroll: PropTypes.bool
	}
	
	static defaultProps = {
		className: "",
		layout: void 0,
		role: "list",
		itemRole: "listitem",
		ariaLabel: null,
		fadeScrollbar: false,
		onScroll: noop,
		onContentScroll: noop,
		onSelectionChange: noop,
		getAriaLabelForRow: void 0,
		shouldHorizontallyScroll: false
	}

	componentDidMount() {
		document.addEventListener("selectionchange", this.onSelectionChange);
	}

	componentWillReceiveProps(nextProps) {
		nextProps.width !== this.props.width && this.layout.heightCache.invalidate();
		this.layout.setKeys(nextProps.keys);
		this.relayout()
	}

	componentWillUnmount() {
		this.scrollStartTimeout && clearTimeout(this.scrollStartTimeout);
		document.removeEventListener("selectionchange", this.onSelectionChange);
	}

	/// Scrolling detect version 2

	debounce = (func) => {
		let timeout;
		return function(...args) {
			const context = this;

			const lastCall = () => {
				timeout = null;
				func.apply(context, args);
			};

			clearTimeout(timeout);
			timeout = setTimeout(lastCall, 100);
		};
	};

	setScrollOn = () => {
		const { scrolling } = this.state;

		if (!scrolling) {
			this.setState({
				scrolling: true
			});
		}
		this.setScrollOff();
	};

	setScrollOff = this.debounce(() => {
		if (this.state.scrolling) {
			this.setState({
				scrolling: false,
			});
		}
	});

	onScroll = ( r ) => {
		this.setScrollOn();
		// this.onScrollEnd();
		// this.scrollStartTimeout || this.isScrolling() || r.target !== this.node.scroller || (this.scrollStartTimeout = setTimeout(this.onScrollStart, 2 * j));
		this.relayout();
		this.props.onScroll(r, {
			scrollTop: this.getScrollTop(),
			scrollHeight: this.getContentHeight(),
			clientHeight: this.props.height
		})
	};

	/// Scrolling detect version 1

	// onScroll = ( r ) => {
	// 	this.onScrollEnd();
	// 	this.scrollStartTimeout || this.isScrolling() || r.target !== this.node.scroller || (this.scrollStartTimeout = setTimeout(this.onScrollStart, 2 * j));
	// 	this.relayout();
	// 	this.props.onScroll(r, {
	// 		scrollTop: this.getScrollTop(),
	// 		scrollHeight: this.getContentHeight(),
	// 		clientHeight: this.props.height
	// 	})
	// }

	onScrollStart = () => {
		this.setState(function () {
			return {
				scrolling: true
			}
		}, this.onScrollEnd);
		this.scrollStartTimeout = null
	}

	onScrollEnd = () => {
		if (this.scrollStartTimeout) {
			clearTimeout(this.scrollStartTimeout);
			this.scrollStartTimeout = null
		}
		this.setState(function (e) {
			if (!e.scrolling) return null;
			return {
				scrolling: false
			}
		})
	}

	onContentScroll = ( r ) => {
		this.props.onContentScroll(r)
	}

	onSelectionChange = () => {
		// if (!this.node) return;
		// if ("Range" === window.getSelection().type && this.contentNode
		// 	&& this.contentNode.contains(window.getSelection().anchorNode)) {
		// 	this.isSelecting = true;
		// 	this.selectionStart = this.props.keys[this.state.start];
		// 	this.selectionEnd = this.props.keys[this.state.end - 1]
		// } else {
		// 	this.isSelecting = false;
		// 	this.selectionStart = null;
		// 	this.selectionEnd = null
		// }
		// this.props.onSelectionChange(this.isSelecting);
	}

	setRef = ( r ) => {
		this.node = r;
	}

	setContentRef = ( r ) => {
		this.contentNode = r;	
	}

	getTop = ( r ) => {
		return this.layout.getTop(r);
	}

	getBottom = ( r ) => {
		return this.layout.getBottom(r);
	}

	getScrollTop = () => {
		if (!this.node) return null;
		return this.node.scrollTop()
	}

	setHeight = ( r, a ) => {
		if (!r) return;
		if (Math.abs(a - this.layout.getHeight(r)) < .5) return;
		this.layout.setHeight(r, a);
		this.relayout()
	}

	setScrollTop = ( r ) => {
		if (!this.node) return;
		this.node.scrollTop(Math.ceil(r))
	}

	getClassName = () => {
		return classNames("c-virtual_list", "c-virtual_list--scrollbar", this.props.className)
	}

	getContentsClassName = () => {
		return classNames("c-virtual_list__scroll_container", {
			"c-virtual_list__scroll_container--scrolling": this.isScrolling() && !this.isSelecting
		})
	}
	
	// >?????????????????
	getVisibleRange = () => {
		var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.getScrollTop();
		var a = this.props,
			n = a.keys,
			t = a.height;
		var s = this.layout.getBounds(r, r + t),
			l = s.start,
			o = s.end;
		var i = this.layout.getTop(n[l]) < r - 1 ? l + 1 : l;
		var u = this.layout.getBottom(n[o - 1]) > r + t + 1 ? o - 1 : o;
		var c = Math.min(i, n.length - 1);
		var d = Math.max(u, c);
		return {
			start: c,
			end: d
		}
	}

	getContentHeight = () => {
		return this.layout.getTotalHeight()
	}

	getContainerHeight = () => {
		return this.props.height
	}

	getBounds = ( r, a ) => {
		this.onSelectionChange();
		var n = r;
		var t = a;
		this.selectionStart && (n = Math.min(n, this.layout.getTop(this.selectionStart)));
		this.selectionEnd && (t = Math.max(t, this.layout.getBottom(this.selectionEnd)));
		return this.layout.getBounds(n, t)
	}

	isScrolling = () => {
		return this.state.scrolling
	}

	isItemInView = ( r ) => {
		var a = this.getScrollTop();
		var n = this.layout.getTop(r);
		return n >= a && n <= a + this.props.height
	}

	isScrolledToTop = () => {
		return Math.floor(this.getScrollTop()) <= 1
	}

	isScrolledToBottom = () => {
		return this.getScrollTop() + this.getContainerHeight() >= this.layout.getTotalHeight() - 1
	}
	
	// ???????????????
	scrollToKey = ( r ) => {
		var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
			n = a.lazy,
			t = a.animate;
		if (n && this.isItemInView(r)) return;
		var s = this.layout.getOffsetForKey(r);
		this.scrollToOffset(s, {
			animate: t
		})
	}
	
	// ?????????????????
	scrollToOffset = ( r ) => {
		var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
			n = a.animate;
		if (!this.node) return;
		var t = this.bracketScrollTop(r);
		if (n) {
			this.node.scrollWithAnimation(t);
			return
		}
		this.scrollTop = t;
		this.setScrollTop(t)
	}

	bracketScrollTop = ( r ) => {
		return Math.max(0, Math.min(this.getContentHeight() - this.props.height, r))
	}

	relayout = () => {
		var r = this;
		this.setState(function (e, a) {
			var n = r.getScrollTop();
			var t = a.height / 2;
			var s = n - t;
			var l = n + a.height + t;
			var o = r.getBounds(s, l),
				i = o.start,
				u = o.end;
			var c = r.layout.getTops();
			if (i === e.start && u === e.end && c === e.tops) return null;
			return {
				start: i,
				end: u,
				tops: c
			}
		})
	}

	renderItem = ( r, a ) => {
		var n = this.getTop(r);
		var t = this.layout.getHeight(r);
		var s = this.layout.getHeightValidity(r);
		var l = this.props.getAriaLabelForRow;
		var o = l && l(a);
		return React.createElement(R["a"], {
			id: r,
			key: r,
			height: t,
			style: {
				top: n
			},
			role: this.props.itemRole,
			onHeightChange: this.setHeight,
			validity: s,
			ariaLabel: o,
			shouldHorizontallyScroll: this.props.shouldHorizontallyScroll
		}, this.props.rowRenderer(a))
	}
	
	renderItems = () => {
		var r = this.props.keys;
		var a = this.state,
			n = a.start,
			t = a.end;
		var s = [];
		for (var l = n; l < t; l++) {
			var o = r[l];
			o && s.push(this.renderItem(o, l))
		}
		return s
	}
	
	renderContents = () => {
		var r = this.getContentsClassName();
		var a = this.getContentHeight();
		var n = this.renderItems();
		return React.createElement("div", {
			ref: this.setContentRef,
			className: r,
			role: "presentation",
			style: {
				position: "relative",
				height: a
			}
		}, n)
	}

	render() {
		var r = this.props,
			a = r.width,
			n = r.height;
		if (0 === a || 0 === n) return null;
		var t = this.getClassName();
		var s = this.renderContents();

		return(
			<strong>aaaaaa</strong>
		)
	}

}

export default List;
