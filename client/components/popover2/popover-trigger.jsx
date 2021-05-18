import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, debounce } from 'lodash';

const T = 150;

class PopoverTrigger extends React.Component {
	static propTypes = {
		renderPopover: PropTypes.func.isRequired,
		children: PropTypes.node.isRequired,
		startsOpen: PropTypes.bool,
		targetBounds: PropTypes.shape({
			top: PropTypes.number,
			left: PropTypes.number,
			right: PropTypes.number,
			bottom: PropTypes.number,
			height: PropTypes.number,
			width: PropTypes.number
		}),
		onClick: PropTypes.func,
		onClose: PropTypes.func,
		useMouseCoordinatesAsTargetBounds: PropTypes.bool,
		ariaHasPopup: PropTypes.bool,
		customTrigger: PropTypes.bool,
		forceOpen: PropTypes.bool
	};
	static defaultProps = {
		startsOpen: false,
		targetBounds: void 0,
		className: "",
		onClick: noop,
		onClose: noop,
		useMouseCoordinatesAsTargetBounds: false,
		ariaHasPopup: null,
		customTrigger: false,
		forceOpen: false
	};

	constructor( props ) {
		super( props );

		this.state = {
			isOpen: this.props.startsOpen,
			openedWithKeyboard: null,
			targetBounds: void 0
		};
		this.listenerInstalled = false;
		this.closePopover = this.closePopover.bind(this);
		this.onTrigger = this.onTrigger.bind(this);
		this.setTargetBounds = this.setTargetBounds.bind(this);
		this.onResize = debounce(this.setTargetBounds, T, {
			maxWait: T,
			trailing: true
		});
	}

	componentDidMount() {
		this.installOrUninstallListener()
	}

	componentDidUpdate(r) {
		this.installOrUninstallListener();
		!r.forceOpen && this.props.forceOpen && this.onTrigger()
	}

	componentWillUnmount() {
		this.onResize.cancel();
		this.listenerInstalled && window.removeEventListener("resize", this.onResize)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			isOpen: nextProps.startsOpen,
		})
	}

	onTrigger(r) {
		const t = this;
		const n = this.props.useMouseCoordinatesAsTargetBounds;
		r && r.stopPropagation();
		if (n && r && r.nativeEvent) {
			r.preventDefault();
			const a = r.nativeEvent;
			this.setTargetBounds(a.x, a.y)
		} else this.setTargetBounds();
		const s = null;//Object(x["a"])(r);
		this.setState(function () {
			return {
				isOpen: !t.state.isOpen,
				openedWithKeyboard: s
			}
		}, function () {
			t.state.isOpen || t.props.onClose();
			if ( this.props.onToggle ) {
				this.props.onToggle( this.state.isOpen );
			}
		});
		this.props.onClick(r);

	}

	getTargetBounds() {
		return this.props.targetBounds || this.target && ReactDom.findDOMNode(this.target).getBoundingClientRect()
	}

	setTargetBounds(r, t) {
		const n = r && t ? {
			left: r,
			top: t
		} : this.getTargetBounds();
		this.setState(function () {
			return {
				targetBounds: n
			}
		})
	}

	installOrUninstallListener() {
		if (this.state.isOpen && !this.listenerInstalled) {
			window.addEventListener("resize", this.onResize);
			this.listenerInstalled = true
		}
		if (!this.state.isOpen && this.listenerInstalled) {
			this.onResize.cancel();
			window.removeEventListener("resize", this.onResize);
			this.listenerInstalled = false
		}
	}

	closePopover() {
		const r = this;
		this.state.isOpen && this.setState(function () {
			return {
				isOpen: false,
				openedWithKeyboard: null
			}
		}, function () {
			r.props.onClose();
			r.onResize.cancel();
			window.removeEventListener("resize", r.onResize);
			r.listenerInstalled = false;

			if ( this.props.onToggle ) {
				this.props.onToggle( this.state.isOpen );
			}
		})
	}

	render() {
		const r = this;
		const t = this.props.children;
		const n = "function" === typeof t.type ? {
			ariaHasPopup: this.props.ariaHasPopup
		} : {
			"aria-haspopup": this.props.ariaHasPopup
		};
		const s = Object.assign({
			ref: function e(_t) {
				r.target = _t
			},
			className: classNames(t.props.className, {
				active: this.state.isOpen
			})
		}, n);
		this.props.customTrigger ? s.onTrigger = this.onTrigger : this.props.useMouseCoordinatesAsTargetBounds ? s.onContextMenu = this.onTrigger : s.onClick = this.onTrigger;
		const l = React.cloneElement(t, s);
		const i = this.state.isOpen && this.props.renderPopover(Object.assign({}, this.props, {
			useTargetBoundsAsPosition: this.props.useMouseCoordinatesAsTargetBounds,
			isOpen: this.state.isOpen,
			onClose: this.closePopover,
			targetBounds: this.state.targetBounds,
			openedWithKeyboard: this.state.openedWithKeyboard
		}));
		return React.createElement(React.Fragment, this.props.style, l, i)
	}

}

export default PopoverTrigger;
