import React from 'react';
import PropTypes from 'prop-types';
import { noop, isEqual } from 'lodash';

import KeyboardNavigableList from './keyboard-navigable-list';
import List from './list';
import Layout from 'components/virtualized-list/layout';
import ListItem from 'components/list-item';

const w = 400;

export default class DynamicList extends KeyboardNavigableList {
	static displayName = 'DynamicList';
	static propTypes = Object.assign( {}, List.propTypes, {
		layout: PropTypes.instanceOf( Layout ),
		loadPre: PropTypes.func,
		loadPost: PropTypes.func,
		loadAround: PropTypes.func,
		itemToScroll: PropTypes.string,
		animateOnScroll: PropTypes.bool,
	} );

	static defaultProps = Object.assign( {}, List.defaultProps, {
		layout: void 0,
		loadPre: noop,
		loadPost: noop,
		loadAround: noop,
		itemToScroll: void 0,
		animateOnScroll: false,
	} );

	constructor( e ) {
		const a = super( e );
		a.onScroll = a.onScroll.bind( a );
		a.setHeight = a.setHeight.bind( a );
		a.layout = e ? e.layout : new Layout();
		a.node = null;
		a.scrollTop = a.layout.setContainerHeight( e ? e.height : 0, 0 );
		a.scrollTop = a.layout.setKeys( e ? e.keys : {}, a.scrollTop );
		const r = a.layout.getBounds( a.scrollTop, a.scrollTop + e.height ),
			i = r.start,
			s = r.end;
		const o = a.layout.getTops();
		a.state = Object.assign( {}, a.state, {
			start: i,
			end: s,
			tops: o,
		} );
		return a;
	}

	componentWillReceiveProps( t ) {
		// this.scrollToIfNotVisible( t );
		t.width !== this.props.width && this.layout.heightCache.invalidate();
		t.height !== this.props.height &&
			( this.scrollTop = this.layout.setContainerHeight( t.height, this.getScrollTop() ) );
		if ( ! isEqual( t.keys, this.props.keys ) ) {
			if ( ! this.props.preventAutoScroll ) {
				isEqual( t.keys, this.props.keys ) ||
					( this.scrollTop = this.layout.setKeys( t.keys, this.getScrollTop() ) );
			} else {
				this.layout.setKeys( t.keys, this.getScrollTop() );
			}
		}

		this.relayout();
	}

	scrollToIfNotVisible( t ) {
		const r = t.itemToScroll,
			a = t.animateOnScroll;
		r &&
			this.scrollToKey( r, {
				lazy: true,
				animate: a,
			} );
	}

	componentDidUpdate() {
		// let a;
		// ( a = super.componentDidUpdate ).call.apply( a, [ this ].concat( arguments ) );
		'number' === typeof this.pendingScrollTop && this.setScrollTop( this.pendingScrollTop );
		this.loadMore();
	}

	componentDidMount() {
		super.componentDidMount();
		'number' === typeof this.pendingScrollTop && this.setScrollTop( this.pendingScrollTop );
		this.loadMore();
	}

	onScroll( r ) {
		this.pendingScrollTop = false;
		super.onScroll( r );
	}

	getScrollTop() {
		if ( 'number' === typeof this.scrollTop ) return this.scrollTop;
		if ( 'number' === typeof this.pendingScrollTop ) return this.pendingScrollTop;
		if ( ! this.node ) return 0;

		return super.getScrollTop();
	}

	setHeight( t, a ) {
		if ( ! t ) return;
		if ( Math.abs( a - this.layout.getHeight( t ) ) < 0.5 ) return;
		const r = this.getScrollTop();
		this.scrollTop = this.layout.setHeight( t, a, r );
		this.relayout();
	}

	loadMore() {
		//if ( this.isScrolling() ) return false;
		const t = arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : this.state.start;
		const a = arguments.length > 1 && void 0 !== arguments[ 1 ] ? arguments[ 1 ] : this.state.end;
		const r = arguments.length > 2 && void 0 !== arguments[ 2 ] ? arguments[ 2 ] : this.props;
		const n = r.keys,
			i = r.height;
		const s = this.layout.getTotalHeight();
		const o = this.layout.getTop( n[ t ] );
		const l = this.layout.getBottom( n[ a - 1 ] );
		const c = ! n.length || s <= i || o < w;
		const u = ! n.length || s <= i || s - l < w;
		if ( c && u ) return r.loadAround();
		if ( c ) return r.loadPre();
		if ( u ) return r.loadPost();
		// console.log( '2222222222222222222222222222222222' );
		return null;
	}

	renderItem( t, r ) {
		const a = this.getTop( t );
		const n = this.layout.getHeight( t );
		const i = this.layout.getHeightValidity( t );
		const s = this.state.activeItem === t;
		const o =
			null === this.state.activeItem &&
			this.state.hasKeyboardFocus &&
			this.state.initialActiveItem === t;
		const l = this.state.mouseDownTargetItem === t;
		const c = this.state.hoveredItem === t;
		const u = this.props.getAriaLabelForRow;
		const p = this.props.isItemAriaExpanded;
		const d =
			u &&
			u( r, {
				hasFocus: s,
			} );
		const h = p && p( t, a );
		return React.createElement(
			ListItem,
			{
				key: t,
				id: t,
				height: n,
				validity: i,
				style: {
					top: a,
				},
				role: this.props.itemRole,
				hasFocus: s,
				hasFocusWithin: o,
				isMouseDownOnItem: l,
				onHeightChange: this.setHeight,
				onFocusEnter: this.onItemFocusEnter,
				onFocusWithin: this.onItemFocusWithin,
				onMouseOver: this.onItemMouseOver,
				onMouseLeave: this.onItemMouseLeave,
				onMouseDown: this.onItemMouseDown,
				onMouseUp: this.onItemMouseup,
				ariaLabel: d,
			},
			this.props.rowRenderer( r, {
				hasFocus: s,
				isHovered: c,
			} )
		);
	}

	render() {
		this.pendingScrollTop = this.scrollTop;
		this.scrollTop = false;

		return super.render();
	}
}
