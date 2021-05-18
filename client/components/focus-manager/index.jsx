/** @format */

/**
 * External dependencies
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { noop } from 'lodash';
// import classNames from 'classnames';

// function focus()

// var A = function e(r) {
// 	var a = r.relatedTarget;
// 	if (FocusManager.blurTimeoutId) {
// 		clearTimeout(FocusManager.blurTimeoutId);
// 		FocusManager.blurTimeoutId = null
// 	}
// 	var n = FocusManager.relatedEvent || {},
// 		t = n.shiftKey,
// 		s = n.type,
// 		l = n.keyCode;
// 	var o = !a && "keydown" === s;
// 	if (!o) return;
// 	FocusManager.blurTimeoutId = setTimeout(function () {
// 		if (document.activeElement !== document.body) return;
// 		FocusManager.relatedEvent = {
// 			type: s,
// 			shiftKey: t,
// 			keyCode: l
// 		};
// 		var e = t ? x : E;
// 		e();
// 		FocusManager.relatedEvent = null
// 	}, 150)
// };

class FocusManager extends React.PureComponent {
	static displayName = 'FocusManager';
	static defaultProps = {
		children: null,
		onFocusEnter: noop,
		onFocusWithin: noop,
		onFocusLeave: noop,
	};

	constructor( props ) {
		super( props );

		this.instances = 0;
		this.onFocus = this.onFocus.bind( this );
		this.onBlur = this.onBlur.bind( this );
		this.blurTimeoutId = null;
		this.hasFocus = false;
	}

	componentWillMount() {
		var a = React.Children.only( this.props.children );
		'function' === typeof a.type && this.checkChildIsValid( a );
		// if (0 === this.instances) {
		// 	if (Object(p["a"])()) document.addEventListener("blur", A, true);
		// 	else {
		// 		j();
		// 		y ? document.addEventListener("focusin", C, false) : document.addEventListener("focus", C, true)
		// 	}
		// 	if (y) {
		// 		document.addEventListener("focusin", I, false);
		// 		document.addEventListener("focusout", I, false)
		// 	}
		// 	document.addEventListener("keydown", S, true);
		// 	document.addEventListener("mousedown", T, true)
		// }
		this.instances += 1;
	}

	componentWillUnmount() {
		if ( 0 === this.instances ) {
		}
		this.instances -= 1;
		this.blurTimeoutId && clearTimeout( this.blurTimeoutId );
	}

	onFocus( t ) {
		var n = this.hasFocus ? this.props.onFocusWithin : this.props.onFocusEnter;
		this.hasFocus = true;
		var a = t.currentTarget,
			s = t.target;
		var l = t.relatedTarget || this.relatedTarget;
		n( {
			relatedTarget: l,
			currentTarget: a,
			target: s,
			relatedEvent: this.relatedEvent,
		} );
	}

	onBlur( t ) {
		var n = this;
		var a = t.currentTarget,
			s = t.target;
		var l = t.relatedTarget || this.relatedTarget;
		var i = {
			relatedTarget: l,
			currentTarget: a,
			target: s,
		};
		if ( ! l ) {
			this.handleBlur( i );
			return;
		}
		this.blurTimeoutId = setTimeout( function() {
			n.blurTimeoutId = null;
			a && ! a.contains( l ) && n.handleBlur( i );
		}, 150 );
	}

	checkChildIsValid( r ) {
		var t = r.props,
			n = t.onFocus,
			a = t.onBlur;
		var s = !! n && !! a;
		if ( s ) return;
		throw new Error( 'FocusManager requires a single child with onFocus and onBlur props.' );
	}

	handleBlur( r ) {
		if ( ! this.hasFocus ) return;
		this.hasFocus = false;
		this.props.onFocusLeave( r );
	}

	render() {
		return React.cloneElement(
			this.props.children,
			{
				onFocus: this.onFocus,
				onBlur: this.onBlur,
			},
			this.props.children.props.children
		);
	}
}

export default FocusManager;
