import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, isEqual } from 'lodash';
import {
	requestAnimationTimeout,
	cancelAnimationTimeout,
} from 'react-virtualized/dist/commonjs/utils/requestAnimationTimeout';

import Layout from 'components/virtualized-list/layout';
import ListItem from 'components/list-item';
import ScrollBar from 'components/scroll-bar';

export default class List extends React.PureComponent {
	static propTypes = {
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		className: PropTypes.string,
		keys: PropTypes.arrayOf( PropTypes.string ).isRequired,
		layout: PropTypes.instanceOf( Layout ),
		rowRenderer: PropTypes.func.isRequired,
		getAriaLabelForRow: PropTypes.func,
		role: PropTypes.string,
		itemRole: PropTypes.string,
		ariaLabel: PropTypes.string,
		persistentKeys: PropTypes.arrayOf( PropTypes.string ),
		fadeScrollbar: PropTypes.bool,
		onScroll: PropTypes.func,
		onContentScroll: PropTypes.func,
		onSelectionChange: PropTypes.func,
		shouldHorizontallyScroll: PropTypes.bool,
	};

	static defaultProps = {
		className: '',
		layout: void 0,
		role: 'list',
		itemRole: 'listitem',
		ariaLabel: null,
		persistentKeys: [],
		fadeScrollbar: false,
		onScroll: noop,
		onContentScroll: noop,
		onSelectionChange: noop,
		getAriaLabelForRow: void 0,
		shouldHorizontallyScroll: false,
	};

	constructor( e ) {
		const t = super( e );

		t.onScroll = t.onScroll.bind( t );
		t.onContentScroll = t.onContentScroll.bind( t );
		t.onSelectionChange = t.onSelectionChange.bind( t );
		t.setRef = t.setRef.bind( t );
		t.setContentRef = t.setContentRef.bind( t );
		t.setHeight = t.setHeight.bind( t );
		t.getScrollTop = t.getScrollTop.bind( t );
		t.getVisibleRange = t.getVisibleRange.bind( t );
		t.isItemInView = t.isItemInView.bind( t );

		t.layout = e ? e.layout : new Layout();
		t.node = null;
		t.contentNode = null;
		t.isSelecting = false;
		t.selectionStart = null;
		t.selectionEnd = null;
		t.scrollStartTimeout = null;
		t._disablePointerEventsTimeoutId = null;
		e && e.keys && t.layout.setKeys( e.keys );
		const n = t.getBounds( 0, e ? e.height : 0 ),
			s = n.start,
			l = n.end;
		const i = t.layout.getTops();
		t.state = {
			start: s,
			end: l,
			tops: i,
			scrolling: false,
		};

		return t;
	}

	componentDidMount() {
		document.addEventListener( 'selectionchange', this.onSelectionChange );
	}

	componentWillReceiveProps( r ) {
		r.width !== this.props.width && this.layout.heightCache.invalidate();
		isEqual( this.props.keys, r.keys ) || this.layout.setKeys( r.keys );
		this.relayout();
	}

	componentWillUnmount() {
		if ( this._disablePointerEventsTimeoutId ) {
			cancelAnimationTimeout( this._disablePointerEventsTimeoutId );
		}
		document.removeEventListener( 'selectionchange', this.onSelectionChange );
	}

	/**
	 * Sets an :isScrolling flag for a small window of time.
	 * This flag is used to disable pointer events on the scrollable portion of the Grid.
	 * This prevents jerky/stuttery mouse-wheel scrolling.
	 */
	_debounceScrollEnded() {
		const scrollingResetTimeInterval = 150; // {scrollingResetTimeInterval} = this.props || 50;

		if ( this._disablePointerEventsTimeoutId ) {
			cancelAnimationTimeout( this._disablePointerEventsTimeoutId );
		}

		this._disablePointerEventsTimeoutId = requestAnimationTimeout(
			this._debounceScrollEndedCallback,
			scrollingResetTimeInterval
		);
	}

	_debounceScrollEndedCallback = () => {
		this._disablePointerEventsTimeoutId = null;
		// isScrolling is used to determine if we reset styleCache
		this.setState( function( e ) {
			if ( ! e.scrolling ) return null;
			return {
				scrolling: false,
			};
		} );
	};

	onScroll( r ) {
		// console.log(r.target.scrollTop);
		this._debounceScrollEnded();
		this.setState( function() {
			return {
				scrolling: true,
			};
		} );
		this.relayout();
		this.props.onScroll( r, {
			scrollTop: this.getScrollTop(),
			scrollHeight: this.getContentHeight(),
			clientHeight: this.props.height,
		} );
	}

	onContentScroll( r ) {
		this.props.onContentScroll( r );
	}

	onSelectionChange() {
		if ( ! this.node ) return;
		if (
			'Range' === window.getSelection().type &&
			this.contentNode &&
			this.contentNode.contains( window.getSelection().anchorNode )
		) {
			this.isSelecting = true;
			this.selectionStart = this.props.keys[ this.state.start ];
			this.selectionEnd = this.props.keys[ this.state.end - 1 ];
		} else {
			this.isSelecting = false;
			this.selectionStart = null;
			this.selectionEnd = null;
		}
		this.props.onSelectionChange( this.isSelecting );
	}

	setRef( r ) {
		this.node = r;
	}

	setContentRef( r ) {
		this.contentNode = r;
	}

	getTop( r ) {
		return this.layout.getTop( r );
	}

	getBottom( r ) {
		return this.layout.getBottom( r );
	}

	getScrollTop() {
		if ( ! this.node ) return null;
		return this.node.scrollTop();
	}

	setHeight( r, t ) {
		// console.log( 'called set Height a' );
		if ( ! r ) return;
		if ( Math.abs( t - this.layout.getHeight( r ) ) < 0.5 ) return;
		this.layout.setHeight( r, t );
		this.relayout();
	}

	setScrollTop( r ) {
		if ( ! this.node ) return;
		this.node.scrollTop( Math.ceil( r ) );
	}

	getClassName() {
		return classNames( 'c-virtual_list', 'c-virtual_list--scrollbar', this.props.className );
	}

	getContentsClassName() {
		return classNames( 'c-virtual_list__scroll_container', {
			'c-virtual_list__scroll_container--scrolling': this.isScrolling() && ! this.isSelecting,
		} );
	}

	getVisibleRange() {
		const r =
			arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : this.getScrollTop();
		const t = this.props,
			n = t.keys,
			a = t.height;
		const s = this.layout.getBounds( r, r + a ),
			l = s.start,
			i = s.end;
		const o = this.layout.getTop( n[ l ] ) < r - 1 ? l + 1 : l;
		const u = this.layout.getBottom( n[ i - 1 ] ) > r + a + 1 ? i - 1 : i;
		const c = Math.min( o, n.length - 1 );
		const d = Math.max( u, c );
		return {
			start: c,
			end: d,
		};
	}

	getContentHeight() {
		return this.layout.getTotalHeight();
	}

	getContainerHeight() {
		return this.props.height;
	}

	getBounds( r, t ) {
		// this.onSelectionChange();
		let n = r;
		let a = t;
		this.selectionStart && ( n = Math.min( n, this.layout.getTop( this.selectionStart ) ) );
		this.selectionEnd && ( a = Math.max( a, this.layout.getBottom( this.selectionEnd ) ) );
		return this.layout.getBounds( n, a );
	}

	isScrolling() {
		//console.log('this.state.scrolling', this.state.scrolling);
		return this.state.scrolling;
	}

	isItemInView( r ) {
		const t = this.getScrollTop();
		const n = this.layout.getTop( r );
		return n >= t && n <= t + this.props.height;
	}

	isScrolledToTop() {
		return Math.floor( this.getScrollTop() ) <= 1;
	}

	isScrolledToBottom() {
		return this.getScrollTop() + this.getContainerHeight() >= this.layout.getTotalHeight() - 1;
	}

	scrollToKey( r ) {
		const t = arguments.length > 1 && void 0 !== arguments[ 1 ] ? arguments[ 1 ] : {},
			n = t.lazy,
			a = t.animate;
		if ( n && this.isItemInView( r ) ) return;
		const s = this.layout.getOffsetForKey( r );
		this.scrollToOffset( s, {
			animate: a,
		} );
	}

	scrollToOffset( r ) {
		const t = arguments.length > 1 && void 0 !== arguments[ 1 ] ? arguments[ 1 ] : {},
			n = t.animate;
		if ( ! this.node ) return;
		const a = this.bracketScrollTop( r );
		if ( n ) {
			this.node.scrollWithAnimation( a );
			return;
		}
		this.scrollTop = a;
		// console.log("scrollTop", a);
		this.setScrollTop( a );
	}

	bracketScrollTop( r ) {
		return Math.max( 0, Math.min( this.getContentHeight() - this.props.height, r ) );
	}

	relayout() {
		var r = this;
		this.setState( function( e, t ) {
			var n = r.getScrollTop();
			var a = t.height / 2;
			var s = n - a;
			var l = n + t.height + a;
			var i = r.getBounds( s, l ),
				o = i.start,
				u = i.end;
			var c = r.layout.getTops();
			if ( o === e.start && u === e.end && c === e.tops ) return null;
			return {
				start: o,
				end: u,
				tops: c,
			};
		} );
	}

	renderItem( t, r ) {
		const n = this.getTop( r );
		const a = this.layout.getHeight( r );
		const s = this.layout.getHeightValidity( r );
		const l = this.props.getAriaLabelForRow;
		const i = l && l( t );
		return React.createElement(
			ListItem,
			{
				id: r,
				key: r,
				height: a,
				style: {
					top: n,
				},
				role: this.props.itemRole,
				onHeightChange: this.setHeight,
				validity: s,
				ariaLabel: i,
				shouldHorizontallyScroll: this.props.shouldHorizontallyScroll,
			},
			this.props.rowRenderer( t )
		);
	}

	renderItems() {
		const r = this;
		const t = this.props,
			n = t.keys,
			a = t.persistentKeys;
		const s = this.state,
			l = s.start,
			i = s.end;
		const o = [];
		for ( let u = l; u < i; u++ ) {
			const c = n[ u ];
			c && o.push( this.renderItem( c, u ) );
		}
		a.forEach( function( e ) {
			const tt = n.indexOf( e );
			if ( tt < 0 ) return;
			if ( tt >= l && tt < i ) return;
			o.push( r.renderItem( e, tt ) );
		} );
		return o;
	}

	renderContents() {
		const r = this.getContentsClassName();
		const t = this.getContentHeight();
		const n = this.renderItems();
		return React.createElement(
			'div',
			{
				ref: this.setContentRef,
				className: r,
				role: 'presentation',
				style: {
					position: 'relative',
					height: t,
				},
			},
			n
		);
	}

	render() {
		const r = this.props,
			t = r.width,
			n = r.height;
		if ( 0 === t || 0 === n ) return null;
		const a = this.getClassName();
		const s = this.renderContents();
		return React.createElement(
			ScrollBar,
			{
				className: a,
				width: t,
				height: this.getContainerHeight(),
				contentHeight: this.getContentHeight(),
				onTrackClick: ScrollBar.track.page,
				onScroll: this.onScroll,
				onContentScroll: this.onContentScroll,
				anchor: 'top',
				role: this.props.role,
				ref: this.setRef,
				ariaLabel: this.props.ariaLabel,
				fade: this.props.fadeScrollbar,
				onKeyDown: this.props.onKeyDown,
			},
			s
		);
	}
}
