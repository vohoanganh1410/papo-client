import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, values, bindAll, isString } from 'lodash';
import Modal from 'react-modal';

import BaseDialog from 'components/dialog2/base-dialog';
import Button from 'components/button2';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';
import Tooltip from 'components/tooltip2';
import FullscreenModalBreadcrumbHeader from './fullscreen-modal-breadcrumb-header';

var P = {
	right: 'right',
	floatRight: 'float_right',
	center: 'center',
};

var D = 250;
var F = 0;

function U() {
	return F > 0;
}

class FullscreenModal extends React.PureComponent {
	static propTypes = {
		cancelButtonType: PropTypes.string,
		cancelText: PropTypes.string,
		children: PropTypes.any.isRequired,
		contentLabel: PropTypes.string,
		goButtonIsDisabled: PropTypes.bool,
		goButtonIsPending: PropTypes.bool,
		goButtonText: PropTypes.string,
		goButtonType: PropTypes.string,
		buttonAlignment: PropTypes.oneOf( values( P ) ),
		onBack: PropTypes.func,
		onCancel: PropTypes.func,
		onGo: PropTypes.func,
		showBackButton: PropTypes.bool,
		showCancelButton: PropTypes.bool,
		showCloseButton: PropTypes.bool,
		showGoButton: PropTypes.bool,
		title: PropTypes.node,
		breadcrumbTitles: PropTypes.arrayOf( PropTypes.string ),
		withFooter: PropTypes.bool,
		withHeader: PropTypes.bool,
		withBreadcrumbHeader: PropTypes.bool,
		position: PropTypes.string,
		currentStepIndex: PropTypes.number,
		isSteppingBack: PropTypes.bool,
		isOpen: PropTypes.bool,
		showOpenTransition: PropTypes.bool,
		showCloseTransition: PropTypes.bool,
		modalClasses: PropTypes.string,
		modalBodyClasses: PropTypes.string,
		modalBodyOpenClassName: PropTypes.string,
		fullBleedModalBodyContent: PropTypes.bool,
		featureAccessibleFsDialogs: PropTypes.bool.isRequired,
		stepModalClasses: PropTypes.string,
		closeModal: PropTypes.func,
		shouldCloseOnGo: PropTypes.bool,
		headerImage: PropTypes.string,
		setBodyRef: PropTypes.func,
		stepTitle: PropTypes.string,
	};
	static defaultProps = {
		cancelButtonType: 'outline',
		cancelText: null,
		contentLabel: null,
		goButtonIsDisabled: false,
		goButtonIsPending: false,
		goButtonText: null,
		goButtonType: 'primary',
		onBack: noop,
		onCancel: noop,
		onGo: noop,
		showBackButton: false,
		showCancelButton: true,
		showCloseButton: true,
		showGoButton: true,
		buttonAlignment: null,
		title: null,
		breadcrumbTitles: [],
		withFooter: false,
		withHeader: false,
		withBreadcrumbHeader: false,
		position: null,
		currentStepIndex: null,
		isSteppingBack: false,
		isOpen: true,
		showOpenTransition: true,
		showCloseTransition: true,
		modalClasses: '',
		modalBodyClasses: '',
		modalBodyOpenClassName: undefined,
		fullBleedModalBodyContent: false,
		stepModalClasses: null,
		closeModal: noop,
		shouldCloseOnGo: false,
		headerImage: undefined,
		setBodyRef: noop,
	};

	constructor( props ) {
		super( props );

		bindAll( this, [ 'onCancel', 'onGo' ] );
	}

	componentDidMount() {
		F += 1;
	}

	componentWillUnmount() {
		F -= 1;
	}

	onGo() {
		var r = this.props,
			e = r.onGo,
			t = r.shouldCloseOnGo;
		e();
		t && this.props.closeModal();
	}

	onCancel() {
		// alert("xxx");s
		var e = this.props.onCancel;
		e();
		this.props.closeModal();
	}

	getContentLabel() {
		var r = this.props.contentLabel;
		r ||
			( isString( this.props.title )
				? ( r = this.props.title )
				: alert(
						'error'
				  ) ) /*Object(N["b"])().warn('You should pass the "contentLabel" prop when passing a non-string "title" prop.')*/;
		return r;
	}

	getCloseTimeout() {
		if ( this.props.showCloseTransition ) return D;
		return null;
	}

	maybeShowTransition() {
		var r = this.props,
			t = r.showOpenTransition,
			n = r.showCloseTransition;
		return {
			afterOpen: t ? 'c-fullscreen_modal__content--after-open' : null,
			beforeClose: n ? 'c-fullscreen_modal__content--before-close' : null,
		};
	}

	renderBackButton() {
		var r = this.props,
			t = r.onBack,
			n = r.withHeader,
			a = r.withBreadcrumbHeader;
		var s = 'back';
		var l = a || n ? '' : s;
		var i = classNames( 'c-fullscreen_modal__back', {
			'c-fullscreen_modal__back--with_header': a || n,
		} );
		return React.createElement(
			UnstyledButton,
			{
				className: i,
				onClick: t,
				'aria-label': s,
			},
			React.createElement( Icon, {
				className: 'c-fullscreen_modal__button__icon nudge_bottom_1',
				type: 'arrow_large_left',
			} ),
			React.createElement(
				'span',
				{
					className: 'c-fullscreen_modal__button__label',
				},
				l
			)
		);
	}

	renderCancelButton() {
		var r = this.props,
			t = r.cancelText,
			n = r.cancelButtonType;
		var a = t || 'Cancel';
		return React.createElement(
			Button,
			{
				type: n,
				className: 'c-fullscreen_modal__cancel',
				onClick: this.onCancel,
			},
			a
		);
	}

	renderCloseButton() {
		var r = this.props,
			t = r.withHeader,
			n = r.withBreadcrumbHeader,
			a = r.featureAccessibleFsDialogs;
		var s = '';
		n || t || ( s = 'esc' );
		var l = classNames( 'c-fullscreen_modal__close', {
			'c-fullscreen_modal__close--with_header': n || t,
		} );
		var i = a ? 'Close' : '';
		return React.createElement(
			UnstyledButton,
			{
				className: l,
				onClick: this.onCancel,
				'aria-label': i,
			},
			React.createElement( Icon, {
				className: 'c-fullscreen_modal__button__icon nudge_bottom_2',
				type: 'times',
			} ),
			React.createElement(
				'span',
				{
					className: 'c-fullscreen_modal__button__label',
				},
				s
			)
		);
	}

	renderGoButton() {
		var r = this.props,
			t = r.goButtonIsDisabled,
			n = r.goButtonIsPending,
			a = r.goButtonText,
			s = r.goButtonType;
		var l = a || 'OK';
		return React.createElement(
			Button,
			{
				type: s,
				className: 'c-fullscreen_modal__go',
				'data-qa': 'create_action',
				onClick: this.onGo,
				loading: n,
				disabled: t,
			},
			l
		);
	}

	renderHeader() {
		var r = this.props,
			t = r.title,
			n = r.withHeader,
			a = r.breadcrumbTitles,
			s = r.currentStepIndex,
			l = r.isSteppingBack,
			i = r.withBreadcrumbHeader,
			j = r.headerClasses,
			o = r.headerImage,
			q = r.stepTitle,
			x = r.showBackButton;
		if ( n )
			return React.createElement(
				'div',
				{
					className: classNames(
						'c-fullscreen_modal__header',
						{
							with_back: x,
						},
						j
					),
				},
				o &&
					React.createElement(
						'div',
						{
							className: 'c-fullscreen_modal__header_image_wrapper',
						},
						React.createElement( 'img', {
							className: 'c-fullscreen_modal__header_image',
							src: o,
							alt: t,
						} )
					),
				React.createElement(
					'h2',
					{
						className: 'c-fullscreen_modal__title',
					},
					t,
					React.createElement(
						'span',
						{
							className: 'c-fullscreen_modal__subtitle',
						},
						this.props.subTitle
					)
				),
				React.createElement(
					'h1',
					{
						className: 'current_step_title',
					},
					q
				)
			);
		if ( i )
			return React.createElement(
				'div',
				{
					className: 'c-fullscreen_modal__header',
				},
				React.createElement( FullscreenModalBreadcrumbHeader, {
					breadcrumbTitles: a,
					highlightedIndex: s,
					isSteppingBack: l,
				} )
			);
		if ( ! t ) return null;
		return React.createElement(
			'h1',
			{
				className: 'c-fullscreen_modal__title',
			},
			t
		);
	}

	renderFooter() {
		var r = this.props,
			t = r.showCancelButton,
			n = r.showGoButton,
			a = r.buttonAlignment,
			s = r.withFooter;
		if ( ! t && ! n ) return null;
		var l = classNames( {
			'c-fullscreen_modal__buttons': true,
			'c-fullscreen_modal__buttons--align_right': a === P.right,
			'c-fullscreen_modal__buttons--float_right': a === P.floatRight,
			'c-fullscreen_modal__buttons--center': a === P.center,
		} );
		var i = React.createElement(
			'div',
			{
				className: l,
			},
			t && this.renderCancelButton(),
			n && this.renderGoButton()
		);
		if ( s )
			return React.createElement(
				'div',
				{
					className: 'c-fullscreen_modal__footer',
				},
				i
			);
		return i;
	}

	render() {
		var r = this.props,
			t = r.children,
			n = r.showBackButton,
			s = r.showCloseButton,
			l = r.withFooter,
			i = r.withHeader,
			o = r.withBreadcrumbHeader,
			u = r.position,
			k = r.overlayClassName,
			c = r.isOpen,
			d = r.modalClasses,
			_ = r.modalBodyClasses,
			h = r.modalBodyOpenClassName,
			f = r.showOpenTransition,
			v = r.stepModalClasses,
			p = r.fullBleedModalBodyContent,
			b = r.setBodyRef;
		var y = classNames(
			'c-fullscreen_modal',
			{
				'c-fullscreen_modal--fixed': 'fixed' === u,
			},
			k
		);
		var w = classNames( 'c-fullscreen_modal__content', d, v, {
			'c-fullscreen_modal__content--with_footer': l,
			'c-fullscreen_modal__content--with_header': i,
			'c-fullscreen_modal__content--with_breadcrumb_header': o,
			'c-fullscreen_modal__content--before-open': f,
		} );
		var k = classNames( 'c-fullscreen_modal__body', _, {
			'c-fullscreen_modal__body--full_bleed': p,
			'c-fullscreen_modal__body--with_header': i,
			'c-fullscreen_modal__body--with_footer': l,
			'c-fullscreen_modal__body--with_breadcrumb_header': o,
		} );
		var j = classNames( 'c-fullscreen_modal__body__content', {
			'c-fullscreen_modal__body__content--full_bleed': p,
		} );
		return React.createElement(
			Modal,
			{
				role: 'dialog',
				className: classNames(
					'fullscreen_body',
					{
						base: w,
					},
					this.maybeShowTransition()
				),
				closeTimeoutMS: this.getCloseTimeout(),
				contentLabel: this.getContentLabel(),
				isOpen: c,
				onRequestClose: this.onCancel,
				overlayClassName: y,
				bodyOpenClassName: h,
				portalClassName: r.portalClassName,
				ariaHideApp: this.props.ariaHideApp,
				shouldCloseOnOverlayClick: this.props.shouldCloseOnOverlayClick,
			},
			n && this.renderBackButton(),
			s && this.renderCloseButton(),
			( o || i ) && this.renderHeader(),
			React.createElement(
				'div',
				{
					className: k,
					ref: b,
				},
				React.createElement(
					'div',
					{
						className: j,
					},
					! ( o || i ) && this.renderHeader(),
					t
				)
			),
			l && this.renderFooter()
		);
	}
}

export default FullscreenModal;
