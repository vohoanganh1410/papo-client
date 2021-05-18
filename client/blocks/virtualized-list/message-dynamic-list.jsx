import React from 'react';
import DynamicList from './dynamic-list';

const C = 20;

export default class A extends DynamicList {
	static displayName = 'DynamicList';
	constructor( props ) {
		super( props );
		this.pendingUpdate = null;
		this.recomputeOffsets( props );
		this.overscan = Math.max( 200, props.height / 2 );
	}

	componentDidUpdate() {
		super.componentDidUpdate();
		0 === this.props.keys.length && this.loadMore();
		this.layout.setBottomMargin( this.getLoadingOffsetBottom() );
		this.pendingUpdate = false;
	}

	getOffset() {
		const t = this.getLoadingOffsetTop();
		return this.startTop - t;
	}

	getLoadingOffsetTop() {
		return 0;
		// if (!this.props.keys.length) return 0;
		// if (this.props.reachedStart && 0 === this.state.start) return 0;
		// if (this.layout.getTotalHeight() <= this.props.height) return 0;
		// if (0 !== this.state.start) return 96;
		// return 56
	}

	getLoadingOffsetBottom() {
		return 0;
		// if ( ! this.props.keys.length ) return 0;
		// if ( this.props.reachedEnd && this.state.end === this.props.keys.length ) return 0;
		// return 96;
	}

	getScrollTop() {
		if ( 'number' === typeof this.scrollTop ) return this.scrollTop;
		if ( 'number' === typeof this.pendingScrollTop ) return this.pendingScrollTop;
		return super.getScrollTop() + this.getOffset();
	}

	getContentHeight() {
		return this.endBottom - this.getOffset() + this.getLoadingOffsetBottom();
	}

	getTop( t ) {
		return this.layout.getTop( t ) - this.getOffset();
	}

	getBottom( t ) {
		return this.layout.getBottom( t ) - this.getOffset();
	}

	setScrollTop( a ) {
		const r = a < this.getOffset();
		const n = a + this.props.height > this.endBottom + this.getLoadingOffsetBottom();
		if ( ( r && 0 !== this.state.start ) || ( n && this.state.end !== this.props.keys.length ) ) {
			this.scrollTop = a;
			this.relayout();
			return;
		}

		super.setScrollTop( a - this.getOffset() );
	}

	scrollToOffset( a ) {
		const r = arguments.length > 1 && void 0 !== arguments[ 1 ] ? arguments[ 1 ] : {},
			n = r.animate,
			i = r.absolute;
		if ( ! this.node ) return;
		if ( this.pendingUpdate ) return;
		let s = i ? a : a - this.getOffset();
		! i && s > 0 && s < this.getLoadingOffsetTop() && ( s = 0 );
		const o = this.bracketScrollTop( s );
		if ( ! i && o !== s ) {
			this.setScrollTop( a );
			return;
		}
		if ( n ) {
			this.scrollAnimation = this.node.scrollWithAnimation( o );
			return;
		}

		super.setScrollTop( o );
	}

	bracketScrollTop( t ) {
		return Math.max( 0, Math.min( this.getContentHeight() - this.props.height, t ) );
	}

	resetRendered() {
		this.overscan = this.props.height / 2;
	}

	loadMore() {
		const t = arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : this.state.start;
		const a = arguments.length > 1 && void 0 !== arguments[ 1 ] ? arguments[ 1 ] : this.state.end;
		const r = arguments.length > 2 && void 0 !== arguments[ 2 ] ? arguments[ 2 ] : this.props;
		const n =
			arguments.length > 3 && void 0 !== arguments[ 3 ] ? arguments[ 3 ] : this.getScrollTop();
		const i = this.layout.getTotalHeight();
		const s = 0 === t && n < 1;
		const o = a === r.keys.length && n + r.height > i - 1;
		const l = ! r.keys.length || i <= r.height || s;
		const c = ! r.keys.length || i <= r.height || o;
		if ( l && c ) return r.loadAround();
		if ( l ) return r.loadPre();
		if ( c ) return r.loadPost();
		return false;
	}

	relayout() {
		const t = this;
		this.setState( function( e, a ) {
			if ( a.isLoading ) return null;
			const r = e.start,
				n = e.end;
			const i = t.startKey;
			const o = t.endKey;
			t.recomputeOffsets( a, r, n );
			const l = t.node ? t.node.scrollTop() : 0;
			const c = t.getScrollTop();
			let u = l - 1 <= 0 || c - 1 <= t.getOffset();
			let d = l + 1 >= t.getContentHeight() - a.height || c + 1 >= t.endBottom - a.height;
			let p = {
				start: r,
				end: n,
			};

			if (
				t.startKey !== i ||
				t.endKey !== o ||
				( u && 0 !== r ) ||
				( d && n !== a.keys.length )
			) {
				e.scrolling && ( t.overscan = 8e3 );
				p = t.computeBounds( a, c );
				const m = p,
					h = m.start,
					f = m.end;
				t.recomputeOffsets( a, h, f );
				u = c - 1 <= t.getOffset();
				d = c + a.height + 1 >= t.endBottom + t.getLoadingOffsetBottom();
			}
			( ( u && 0 === p.start ) ||
				( d && p.end === a.keys.length ) ||
				( t.layout.getTotalHeight() < a.height && 0 === p.start ) ) &&
				t.loadMore( r, n, a );
			const v = t.layout.getTops();
			if ( p.start === r && p.end === n && v === e.tops ) return null;
			t.scrollAnimation && t.scrollAnimation.cancel();
			t.pendingUpdate = true;
			// console.log("c", c);
			c > 0 && ( t.scrollTop = c );
			return Object.assign( {}, p, {
				tops: v,
			} );
		} );
	}

	recomputeOffsets() {
		const t = arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : this.props;
		const a = arguments.length > 1 && void 0 !== arguments[ 1 ] ? arguments[ 1 ] : this.state.start;
		const r = arguments.length > 2 && void 0 !== arguments[ 2 ] ? arguments[ 2 ] : this.state.end;
		const n = this.layout.getTotalHeight() <= t.height;
		this.startKey = t.keys[ a ];
		this.endKey = t.keys[ r - 1 ];
		this.startTop = n ? 0 : this.layout.getTop( this.startKey ) || 0;
		this.endBottom = this.layout.getBottom( this.endKey ) || 0;
	}

	computeBounds() {
		const a = arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : this.props;
		const r = arguments[ 1 ];
		const n = r - this.overscan;
		const i = r + a.height + this.overscan;
		const s = super.getBounds( n, i );
		return this.snapBounds( a, s );
	}

	snapBounds() {
		const t = arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : this.props;
		const a = arguments[ 1 ];
		const r = a.start,
			n = a.end;
		return {
			start: r < C ? 0 : r,
			end: t.keys.length - n < C ? t.keys.length : n,
		};
	}

	renderLoading( t ) {
		const a = t
			? {
					top: 0,
					paddingTop: 0,
					position: 'absolute',
			  }
			: {
					bottom: 0,
					paddingBottom: 0,
					position: 'absolute',
			  };
		const r = t ? 'degradedLoadingTop' : 'degradedLoadingBottom';
		return React.createElement(
			'div',
			{
				key: r,
				className: 'p-degraded_list__loading',
				style: a,
			},
			React.createElement(
				'div',
				{
					className: 'p-degraded_list__loading_txt',
				},
				'Đang tải thêm...'
			)
		);
	}

	renderItems() {
		const a = super.renderItems();
		const r = this.props.keys.length > 1 && ( ! this.props.reachedStart || this.state.start > 0 );
		const i =
			this.props.keys.length > 1 &&
			( ! this.props.reachedEnd || this.state.end < this.props.keys.length );
		return [ r && this.renderLoading( true ) ].concat( /*n()(a)*/ a, [
			i && this.renderLoading( false ),
		] );
	}
}
