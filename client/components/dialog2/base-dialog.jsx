import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, bindAll, isString } from 'lodash';
import Modal from 'react-modal';

// import Button from 'components/button2';
import Button from 'papo-components/Button';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';
import Tooltip from 'components/tooltip2';
import KeyCommands from 'lib/key-commands';

let W = 0;

class BaseDialog extends React.PureComponent {
	static propTypes = {
		ariaContent: PropTypes.object,
		children: PropTypes.any.isRequired,
		cancelButtonType: PropTypes.string,
		cancelText: PropTypes.string,
		className: PropTypes.string,
		overlayClassName: PropTypes.string,
		bodyClassName: PropTypes.string,
		modalBodyOpenClassName: PropTypes.string,
		contentHeight: PropTypes.number,
		contentLabel: PropTypes.string,
		'data-qa': PropTypes.string,
		footerIcon: PropTypes.string,
		footerLink: PropTypes.string,
		footerText: PropTypes.node,
		onFooterLinkClick: PropTypes.func,
		goButtonType: PropTypes.string,
		goButtonText: PropTypes.string,
		goButtonTooltip: PropTypes.node,
		goButtonIsDisabled: PropTypes.bool,
		goButtonIsPending: PropTypes.bool,
		goOnEnterPressed: PropTypes.bool,
		onCancel: PropTypes.func,
		onClose: PropTypes.func,
		onGo: PropTypes.func,
		onScroll: PropTypes.func,
		role: PropTypes.string,
		showCancelButton: PropTypes.bool,
		showCloseButton: PropTypes.bool,
		showGoButton: PropTypes.bool,
		showHeader: PropTypes.bool,
		showFooter: PropTypes.bool,
		showTooltipOnCloseButton: PropTypes.bool,
		title: PropTypes.node,
		titleAria: PropTypes.string,
		useSlackScrollbar: PropTypes.bool,
		useSlackScrollbarWithPadding: PropTypes.bool,
		titleImage: PropTypes.string,
		truncateTitle: PropTypes.bool,
		closeModal: PropTypes.func,
		featureDialogSpeedBump: PropTypes.bool,
		shouldCloseOnOverlayClick: PropTypes.bool,
		shouldCloseOnGo: PropTypes.bool,
		shouldCloseOnCancel: PropTypes.bool,
		getShouldShowSpeedBump: PropTypes.func,
		speedBumpBodyText: PropTypes.oneOfType( [ PropTypes.string, PropTypes.array ] ),
		speedBumpCancelButtonText: PropTypes.string,
		speedBumpContinueButtonText: PropTypes.string,
		speedBumpContinueButtonType: PropTypes.string,
		isSpeedBumpEnabled: PropTypes.bool,
		reverseButtons: PropTypes.bool,
	};
	static defaultProps = {
		ariaContent: undefined,
		cancelButtonType: 'outline',
		cancelText: undefined,
		overlayClassName: undefined,
		bodyClassName: undefined,
		modalBodyOpenClassName: undefined,
		className: undefined,
		contentHeight: undefined,
		contentLabel: undefined,
		'data-qa': 'dialog',
		footerIcon: undefined,
		footerLink: undefined,
		footerText: undefined,
		onFooterLinkClick: undefined,
		goButtonType: 'primary',
		goButtonText: undefined,
		goButtonTooltip: undefined,
		goButtonIsDisabled: false,
		goButtonIsPending: false,
		goOnEnterPressed: true,
		onCancel: noop,
		onClose: noop,
		onGo: noop,
		onScroll: noop,
		role: 'dialog',
		showCancelButton: true,
		showCloseButton: true,
		showGoButton: true,
		showHeader: true,
		showFooter: true,
		showTooltipOnCloseButton: false,
		title: undefined,
		titleAria: null,
		useSlackScrollbar: true,
		useSlackScrollbarWithPadding: false,
		titleImage: undefined,
		truncateTitle: true,
		closeModal: noop,
		featureDialogSpeedBump: false,
		shouldCloseOnOverlayClick: true,
		shouldCloseOnGo: true,
		shouldCloseOnCancel: true,
		getShouldShowSpeedBump: noop,
		speedBumpBodyText: undefined,
		speedBumpCancelButtonText: undefined,
		speedBumpContinueButtonType: 'danger',
		speedBumpContinueButtonText: undefined,
		isSpeedBumpEnabled: true,
		reverseButtons: false,
	};

	static getDerivedStateFromProps( r ) {
		var t = r.isSpeedBumpEnabled;
		if ( ! t )
			return {
				isShowingSpeedBump: false,
				speedBumpButton: '',
			};
		return null;
	}

	constructor( props ) {
		super( props );

		bindAll( this, [
			'onScroll',
			'setBodyRef',
			'updateScrollState',
			'onRequestGo',
			'onGo',
			'onEnter',
			'onRequestClose',
			'onRequestCancel',
			'onCancel',
			'onEscape',
			'setModalRef',
		] );
		this.keyCommands = null;
		this.scroller = null;
		this.state = {
			hasOverflow: null,
			scrolledToBottom: null,
			scrolledToTop: null,
		};
	}

	componentDidMount() {
		const r = this.props.goOnEnterPressed;
		window.addEventListener( 'scroll', this.onScroll );
		let t = void 0;
		this.modal && this.modal.node && ( t = this.modal.node );
		this.keyCommands = new KeyCommands();
		const n = [];
		r &&
			n.push( {
				keys: [ 'enter' ],
				handler: this.onEnter,
			} );
		n.push( {
			keys: [ 'escape' ],
			handler: this.onEscape,
		} );
		this.keyCommands.bindAll( n );
		W += 1;
	}

	componentDidUpdate() {
		requestAnimationFrame( this.updateScrollState );
	}

	componentWillUnmount() {
		window.removeEventListener( 'scroll', this.onScroll );
		this.keyCommands && this.keyCommands.reset();
		W -= 1;
	}

	onRequestClose() {
		const r = this.props,
			t = r.featureDialogSpeedBump,
			n = r.getShouldShowSpeedBump,
			a = r.isSpeedBumpEnabled,
			s = r.onClose;
		if ( t && n( 'close' ) && a ) {
			this.setState( function() {
				return {
					isShowingSpeedBump: true,
					speedBumpButton: 'close',
				};
			} );
			return;
		}
		if ( false === s() ) return;
		this.props.closeModal();
	}

	onRequestCancel() {
		const r = this.props,
			t = r.featureDialogSpeedBump,
			n = r.getShouldShowSpeedBump,
			a = r.isSpeedBumpEnabled;
		if ( t && n( 'cancel' ) && a ) {
			this.setState( function() {
				return {
					isShowingSpeedBump: true,
					speedBumpButton: 'cancel',
				};
			} );
			return;
		}
		this.onCancel();
	}

	onRequestGo( r ) {
		const t = this.props,
			n = t.featureDialogSpeedBump,
			a = t.getShouldShowSpeedBump,
			s = t.isSpeedBumpEnabled;
		if ( n && a( 'go' ) && s ) {
			this.setState( function() {
				return {
					isShowingSpeedBump: true,
					speedBumpButton: 'go',
				};
			} );
			return;
		}
		this.onGo( r );
	}

	onCancel() {
		const r = this.props,
			t = r.onClose,
			e = r.onCancel,
			n = r.shouldCloseOnCancel;
		if ( false === e() ) return;
		if ( n ) {
			t();
			this.props.closeModal();
		}
	}

	onGo( r ) {
		const t = this;
		const n = this.props,
			e = n.onGo,
			a = n.onClose,
			s = n.shouldCloseOnGo;
		if ( r.defaultPrevented ) return;
		Promise.resolve( e() ).then( function( e ) {
			if ( false === e ) return;
			if ( s ) {
				a();
				t.props.closeModal();
			}
		} );
	}

	onEnter( r ) {
		const t = r && r.target && r.target.tagName;
		if ( 'BUTTON' === t || 'A' === t || 'INPUT' === t ) return;
		this.onRequestGo( r );
	}

	onEscape( r ) {
		if ( r.defaultPrevented ) return;
		this.onRequestClose();
	}

	onScroll( r ) {
		if ( ! this.scroller ) return;
		requestAnimationFrame( this.updateScrollState );
		this.props.onScroll(
			{
				scrollTop: this.scroller.scrollTop,
			},
			r
		);
	}

	setBodyRef( r ) {
		this.scroller = r;
	}

	setModalRef( r ) {
		this.modal = r;
	}

	getScrollHeight() {
		const r = this.props.contentHeight;
		return r !== undefined ? r : this.scroller.scrollHeight;
	}

	getTitleAria() {
		const r = this.props,
			t = r.contentLabel,
			n = r.title,
			a = r.titleAria;
		let s = '';
		t
			? ( s = t )
			: isString( n )
			? ( s = n )
			: a
			? ( s = a )
			: console.log(
					'dddd'
			  ); /*Object(E["b"])().warn('You should pass the "titleAria" prop when passing a non-string "title" prop if there is no "contentLabel".')*/
		return s;
	}

	updateScrollState() {
		if ( ! this.scroller ) return;
		const r = this.scroller.scrollTop;
		const t = this.getScrollHeight();
		const n = this.scroller.offsetHeight;
		const a = r === t - n;
		const s = 0 === r;
		const l = t > n;
		this.setState( function() {
			return {
				hasOverflow: l,
				scrolledToBottom: a,
				scrolledToTop: s,
			};
		} );
	}

	renderCancelButton() {
		const r = this.props,
			t = r.cancelText,
			n = r.cancelButtonType,
			a = r[ 'data-qa' ];
		const s = t || 'Cancel';
		return React.createElement(
			Button,
			{
				type: n,
				className: 'c-dialog__cancel',
				onClick: this.onRequestCancel,
				'data-qa': a + '_cancel',
			},
			s
		);
	}

	renderCloseButton() {
		const r = this.props.showTooltipOnCloseButton;
		const t = 'Close';
		const n = React.createElement(
			UnstyledButton,
			{
				ariaLabel: t,
				className: 'c-dialog__close',
				onClick: this.onRequestClose,
			},
			React.createElement( Icon, {
				type: 'times',
			} )
		);
		return r
			? React.createElement(
					Tooltip,
					{
						tip: t,
						zIndex: 'above_fs',
					},
					n
			  )
			: n;
	}

	renderGoButton() {
		const r = this.props,
			t = r[ 'data-qa' ],
			n = r.goButtonIsDisabled,
			a = r.goButtonIsPending,
			s = r.goButtonText,
			l = r.goButtonType,
			i = r.goButtonTooltip;
		const o = s || 'Confirm';
		const u = React.createElement(
			Button,
			{
				// maybe ladda button
				type: l,
				className: 'c-dialog__go',
				onClick: this.onRequestGo,
				loading: a === true,
				disabled: n,
				'data-qa': t + '_go',
			},
			o
		);
		return i
			? React.createElement(
					Tooltip,
					{
						tip: i,
						zIndex: 'above_fs',
					},
					n ? React.createElement( 'div', null, u ) : u
			  )
			: u;
	}

	renderFooterTextMaybe() {
		const r = this.props,
			t = r.footerIcon,
			n = r.footerLink,
			a = r.footerText;
		if ( ! a ) return null;
		if ( n )
			return React.createElement(
				'div',
				{
					className: 'c-dialog__footer_text',
				},
				React.createElement(
					'a',
					{
						href: n,
						className: 'c-dialog__footer_link',
						onClick: this.props.onFooterLinkClick,
					},
					t &&
						React.createElement( Icon, {
							inherit: true,
							type: t,
							align: 'baseline',
							className: 'c-dialog__footer_icon',
						} ),
					a
				)
			);
		return React.createElement(
			'div',
			{
				className: 'c-dialog__footer_text',
			},
			t &&
				React.createElement( React, {
					inherit: true,
					type: t,
					align: 'baseline',
					className: 'c-dialog__footer_icon',
				} ),
			a
		);
	}

	renderOverflowPaddingMaybe() {
		const r = this.props.showFooter;
		const t = this.state,
			n = t.hasOverflow,
			a = t.scrolledToBottom;
		if ( ! r && n ) {
			const s = classNames( 'c-dialog__overflow_padding', {
				'c-dialog__overflow_padding--scroll_border': n && ! a,
			} );
			return React.createElement( 'div', {
				className: s,
			} );
		}
		return null;
	}

	renderSpeedBumpMaybe() {
		const r = this;
		if ( ! this.state.isShowingSpeedBump ) return null;
		const t = this.props,
			n = t.speedBumpBodyText,
			a = t.speedBumpCancelButtonText,
			s = t.speedBumpContinueButtonText,
			l = t.speedBumpContinueButtonType;
		return React.createElement( F, {
			bodyText: n,
			cancelButtonText: a,
			continueButtonText: s,
			continueButtonType: l,
			onCancel: function e() {
				r.setState( function() {
					return {
						isShowingSpeedBump: false,
					};
				} );
			},
			onContinue: 'go' === this.state.speedBumpButton ? this.onGo : this.onCancel,
		} );
	}

	renderTitle() {
		const r = this.props,
			t = r.title,
			n = r.titleImage,
			a = r.truncateTitle;
		let s = undefined;
		s = n
			? React.createElement(
					'div',
					{
						className: 'display_flex',
					},
					React.createElement( 'img', {
						className: 'c-dialog__title_image',
						src: n,
						alt: t,
					} ),
					React.createElement(
						'div',
						{
							className: classNames( {
								overflow_ellipsis: a,
							} ),
						},
						t
					)
			  )
			: t;
		return React.createElement(
			'h3',
			{
				className: classNames( 'c-dialog__title', {
					overflow_ellipsis: a && ! n,
				} ),
			},
			s
		);
	}

	render() {
		const r = this.props,
			t = r.ariaContent,
			n = r.children,
			s = r.className,
			l = r.overlayClassName,
			i = r.bodyClassName,
			o = r.footerText,
			u = r.showCancelButton,
			c = r.showCloseButton,
			d = r.showGoButton,
			_ = r.role,
			h = r.showHeader,
			f = r.showFooter,
			v = r.useSlackScrollbar,
			g = r.useSlackScrollbarWithPadding,
			R = r[ 'data-qa' ],
			y = r.shouldCloseOnOverlayClick,
			w = r.reverseButtons,
			k = r.modalBodyOpenClassName;
		const j = classNames( 'c-dialog', l );
		const O = classNames( 'c-dialog__content', s );
		const E = classNames( 'c-dialog__header', {
			'c-dialog__header--overflow': this.state.hasOverflow && ! this.state.scrolledToTop,
		} );
		const S = classNames( 'c-dialog__body', i, {
			'c-dialog__body--slack_scrollbar': v && ! g,
			'c-dialog__body--slack_scrollbar_with_padding': v && g,
		} );
		const x = classNames( 'c-dialog__footer', {
			'c-dialog__footer--overflow': this.state.hasOverflow && ! this.state.scrolledToBottom,
			'c-dialog__footer--has_text': o && ! ( u || d ),
			'c-dialog__footer--has_buttons': ! o && ( u || d ),
			'c-dialog__footer--has_both': o && ( u || d ),
		} );
		const T = this.getTitleAria();
		const I = Object.assign( {}, t, {
			label: h && T,
		} );
		return React.createElement(
			Modal,
			{
				className: O,
				bodyOpenClassName: k,
				contentLabel: T,
				isOpen: true,
				ariaHideApp: false,
				onRequestClose: this.onRequestClose,
				overlayClassName: j,
				role: _,
				aria: I,
				shouldCloseOnOverlayClick: y,
				shouldCloseOnEsc: false,
				ref: this.setModalRef,
			},
			h &&
				React.createElement(
					'div',
					{
						className: E,
						'data-qa': R + '_header',
					},
					this.renderTitle(),
					c && this.renderCloseButton()
				),
			React.createElement(
				'div',
				{
					className: S,
					onScroll: this.onScroll,
					ref: this.setBodyRef,
					'data-qa': R + '_body',
				},
				n
			),
			f &&
				React.createElement(
					'div',
					{
						className: x,
						'data-qa': R + '_footer',
					},
					this.renderFooterTextMaybe(),
					React.createElement(
						'div',
						{
							className: 'c-dialog__footer_buttons',
						},
						! w && d && this.renderGoButton(),
						u && this.renderCancelButton(),
						w && d && this.renderGoButton()
					)
				),
			this.renderSpeedBumpMaybe(),
			this.renderOverflowPaddingMaybe()
		);
	}
}

export default BaseDialog;
