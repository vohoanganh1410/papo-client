import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';
import ReactDom from 'react-dom';
import Modal from 'react-modal';

const k = 200;

class Popover extends React.Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		isOpen: PropTypes.bool,
		onOpen: PropTypes.func,
		onClose: PropTypes.func,
		position: PropTypes.string,
		allowanceX: PropTypes.number,
		allowanceY: PropTypes.number,
		offsetX: PropTypes.number,
		offsetY: PropTypes.number,
		targetBounds: PropTypes.shape( {
			top: PropTypes.number,
			left: PropTypes.number,
			right: PropTypes.number,
			bottom: PropTypes.number,
			height: PropTypes.number,
			width: PropTypes.number,
		} ),
		onResize: PropTypes.func,
		overlayClassName: PropTypes.string,
		modalBodyOpenClassName: PropTypes.string,
		useTargetBoundsAsPosition: PropTypes.bool,
		parentSelector: PropTypes.func,
		zIndex: PropTypes.oneOf( [ 'above_fs', 'fs', 'menu', 'below_menu' ] ),
		shouldFocusAfterRender: PropTypes.bool,
		shouldReturnFocusAfterClose: PropTypes.bool,
		shouldCloseOnOverlayClick: PropTypes.bool,
		shouldFade: PropTypes.bool,
		shouldObserveResize: PropTypes.bool,
		ariaHideApp: PropTypes.bool,
		ariaRole: PropTypes.string,
		ariaLabel: PropTypes.string,
		contentStyle: PropTypes.object,
		overlayStyle: PropTypes.object,
		shouldAnchorAtInitialPosition: PropTypes.bool,
	};

	static defaultProps = {
		allowanceX: 16,
		allowanceY: 10,
		offsetX: 0,
		offsetY: 0,
		isOpen: false,
		onOpen: noop,
		onClose: noop,
		position: null,
		targetBounds: {
			top: 0,
			left: 0,
			right: 20,
			bottom: 20,
		},
		onResize: noop,
		overlayClassName: 'c-popover',
		modalBodyOpenClassName: undefined,
		useTargetBoundsAsPosition: false,
		parentSelector: undefined,
		zIndex: 'above_fs',
		shouldFocusAfterRender: true,
		shouldReturnFocusAfterClose: true,
		shouldCloseOnOverlayClick: true,
		shouldObserveResize: true,
		shouldFade: true,
		ariaHideApp: undefined,
		ariaRole: undefined,
		ariaLabel: undefined,
		contentStyle: {},
		overlayStyle: {},
		shouldAnchorAtInitialPosition: false,
	};

	constructor( props ) {
		super( props );

		this.onResize = this.onResize.bind( this );
		this.onOpen = this.onOpen.bind( this );
		this.onClose = this.onClose.bind( this );
		this.setContentRef = this.setContentRef.bind( this );
		this.popoverContent = null;
		this.popoverContentHeight = null;
		this.state = {
			contentBounds: {},
			targetBounds: this.props.targetBounds,
		};
	}

	componentDidMount() {
		window.addEventListener( 'resize', this.onResize );
	}

	componentWillReceiveProps( r ) {
		const t = this;
		this.props.targetBounds !== r.targetBounds &&
			this.setState(
				function() {
					return {
						targetBounds: r.targetBounds,
					};
				},
				function() {
					return t.measureContents();
				}
			);
	}

	componentDidUpdate() {
		if ( ! this.props.isOpen || ! this.popoverContent ) return;
		const r = this.popoverContent.offsetHeight;
		if ( r !== this.popoverContentHeight ) {
			this.popoverContentHeight = r;
			this.measureContents();
		}
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.onResize );
	}

	onResize() {
		this.props.onResize && this.props.onResize();
		this.props.isOpen && this.measureContents();
	}

	onOpen() {
		this.props.onOpen();
		this.measureContents();
		if ( this.popoverContent && this.props.shouldObserveResize ) {
			this.mutationObserver = new MutationObserver( this.onResize );
			this.mutationObserver.observe( this.popoverContent, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: true,
			} );
		}
	}

	onClose( r ) {
		r.stopPropagation();
		this.props.onClose( r );
		this.setState( function() {
			return {
				contentBounds: {},
			};
		} );
		if ( this.mutationObserver ) {
			this.mutationObserver.disconnect();
			this.mutationObserver = null;
		}
	}

	setContentRef( r ) {
		this.popoverContent = r;
	}

	getInitialPosition( r ) {
		const t = this.props,
			n = t.position,
			a = t.offsetX,
			s = t.offsetY;
		const l = this.state.targetBounds;
		switch ( n ) {
			case 'top':
				return {
					width: r.width,
					height: r.height,
					top: l.top - r.height + s,
					bottom: l.top + s,
					right: l.right - ( l.width - r.width ) / 2 - a,
					left: l.left + ( l.width - r.width ) / 2 + a,
				};
			case 'top-left':
				return {
					width: r.width,
					height: r.height,
					top: l.top - r.height + s,
					bottom: l.top + s,
					right: l.left + r.width + a,
					left: l.left + a,
				};
			case 'top-right':
				return {
					width: r.width,
					height: r.height,
					top: l.top - r.height + s,
					bottom: l.top + s,
					right: l.right + a,
					left: l.right - r.width + a,
				};
			case 'left':
				return {
					width: r.width,
					height: r.height,
					top: l.top + ( l.height - r.height ) / 2 + s,
					bottom: l.bottom - ( l.height - r.height ) / 2 - s,
					right: l.left + a,
					left: l.left - r.width + a,
				};
			case 'left-bottom':
				return {
					width: r.width,
					height: r.height,
					top: l.top + s,
					bottom: l.top + r.height + s,
					right: l.left + a,
					left: l.left - r.width + a,
				};
			case 'right':
				return {
					width: r.width,
					height: r.height,
					top: l.top + ( l.height - r.height ) / 2 + s,
					bottom: l.bottom - ( l.height - r.height ) / 2 - s,
					right: l.right + r.width + a,
					left: l.right + a,
				};
			case 'right-bottom':
				return {
					width: r.width,
					height: r.height,
					top: l.top + s,
					bottom: l.bottom + r.height + s,
					right: l.right + r.width + a,
					left: l.right + a,
				};
			case 'bottom':
				return {
					width: r.width,
					height: r.height,
					top: l.bottom + s,
					bottom: l.bottom + r.height + s,
					right: l.right - ( l.width - r.width ) / 2 - a,
					left: l.left + ( l.width - r.width ) / 2 + a,
				};
			case 'bottom-left':
				return {
					width: r.width,
					height: r.height,
					top: l.bottom + s,
					bottom: l.bottom + r.height + s,
					right: l.left + r.width + a,
					left: l.left + a,
				};
			case 'bottom-right':
				return {
					width: r.width,
					height: r.height,
					top: l.bottom + s,
					bottom: l.bottom + r.height + s,
					right: l.right + a,
					left: l.right - r.width + a,
				};
			default:
				return this.props.useTargetBoundsAsPosition ? l : r;
		}
	}

	getBoundaries() {
		const r = window,
			t = r.pageYOffset,
			n = r.innerWidth,
			a = r.innerHeight;
		return {
			top: t + this.props.allowanceY,
			right: n - this.props.allowanceX,
			bottom: t + a - this.props.allowanceY,
			left: this.props.allowanceX,
		};
	}

	getStyle() {
		const r = this.state.contentBounds || {};
		const t = this.getBoundaries();
		const n = this.props.shouldFade && k + 'ms';
		return {
			overlay: Object.assign(
				{
					animationDuration: n,
				},
				this.props.overlayStyle
			),
			content: Object.assign(
				{
					position: 'absolute',
					left: r.left || t.left,
					top: r.top || t.top,
					outline: 'none',
					transitionDuration: n,
				},
				this.props.contentStyle
			),
		};
	}

	keepInBounds( r ) {
		const t = this.getBoundaries();
		const n = this.getInitialPosition( r );
		let a = n.left;
		let s = n.top;
		n.left < t.left
			? ( a = t.left )
			: n.right > t.right && ( a = Math.max( t.left, t.right - n.width ) );
		n.top < t.top
			? ( s = t.top )
			: n.bottom > t.bottom && ( s = Math.max( t.top, t.bottom - n.height ) );
		return {
			left: a,
			top: s,
		};
	}

	measureContents() {
		if ( this.popoverContent ) {
			const r = ReactDom.findDOMNode( this.popoverContent ).getBoundingClientRect();
			const t = this.props.shouldAnchorAtInitialPosition
				? this.getInitialPosition( r )
				: this.keepInBounds( r );
			const n = this.state.contentBounds;
			if ( n.left === t.left && n.top === t.top ) return;
			this.setState( function() {
				return {
					contentBounds: t,
				};
			} );
		}
	}

	render() {
		if ( ! this.props.isOpen ) return null;
		const r = classNames( this.props.overlayClassName, 'c-popover--z_' + this.props.zIndex, {
			'c-popover--fade': this.props.shouldFade,
		} );

		const t = this.props.shouldFade ? k : 0;
		const n = {
			label: this.props.ariaLabel,
		};

		return (
			<Modal
				isOpen={ this.props.isOpen }
				contentLabel="popover"
				className="popover"
				overlayClassName={ r }
				bodyOpenClassName={ this.props.modalBodyOpenClassName }
				style={ this.getStyle() }
				onAfterOpen={ this.onOpen }
				onRequestClose={ this.onClose }
				parentSelector={ this.props.parentSelector }
				shouldFocusAfterRender={ this.props.shouldFocusAfterRender }
				shouldCloseOnOverlayClick={ this.props.shouldCloseOnOverlayClick }
				shouldReturnFocusAfterClose={ this.props.shouldReturnFocusAfterClose }
				closeTimeoutMS={ t }
				ariaHideApp={ this.props.ariaHideApp }
				role={ this.props.ariaRole }
				aria={ n }
			>
				<div ref={ this.setContentRef } role="presentation">
					{ this.props.children }
				</div>
			</Modal>
		);
	}
}

export default Popover;
