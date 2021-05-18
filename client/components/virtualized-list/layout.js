// import { forEach } from 'lodash';
//
// import HeightCache from './height-cache';
//
// class LayoutBase {
// 	constructor( props ) {
// 		const r = props || {},
// 			a = r.keys,
// 			n = void 0 === a ? [] : a,
// 			s = r.heightCache,
// 			l = void 0 === s ? new HeightCache() : s;
//
// 		this.keys = n;
// 		this.heightCache = l;
// 		// this.containerHeight = 170;
// 		this.layout();
// 	}
//
// 	layout() {
// 		// console.log("called layout()");
// 		const r = this,
// 			a = this.keys,
// 			n = {};
//
// 		let t = 0;
// 		forEach( a, function( e ) {
// 			n[ e ] = t;
// 			t += r.getHeight( e );
// 		} );
//
// 		this.tops = n;
// 		this.totalHeight = t;
// 	}
//
// 	getHeight( r ) {
// 		return this.heightCache.get( r );
// 	}
//
// 	getHeightValidity( r ) {
// 		return this.heightCache.getValidity( r );
// 	}
//
// 	getTop( r ) {
// 		return this.tops[ r ];
// 	}
//
// 	getBottom( r ) {
// 		return this.tops[ r ] + this.getHeight( r );
// 	}
//
// 	getTops() {
// 		return this.tops;
// 	}
//
// 	getTotalHeight() {
// 		return this.totalHeight;
// 	}
//
// 	getOffsetForKey( r ) {
// 		if ( ! r ) return this.totalHeight;
// 		return this.getTop( r );
// 	}
//
// 	getBounds( r, a ) {
// 		const n = this.keys;
// 		let t = 0;
// 		while ( t + 1 < n.length ) {
// 			const s = n[ t + 1 ];
// 			const l = this.getTop( s );
// 			if ( l > r ) break;
// 			t += 1;
// 		}
// 		let o = t;
// 		while ( o < n.length ) {
// 			const i = n[ o ];
// 			const u = this.getTop( i );
// 			if ( u > a ) break;
// 			o += 1;
// 		}
// 		return {
// 			start: t,
// 			end: o,
// 		};
// 	}
//
// 	setHeight( r, a ) {
// 		this.heightCache.set( r, a );
// 		this.layout();
// 	}
//
// 	setKeys( r ) {
// 		if ( ! r || r.length === 0 ) return;
// 		this.keys = r;
// 		this.layout();
// 	}
// }
//
// class Layout extends LayoutBase {
// 	constructor( props ) {
// 		super( props );
//
// 		const e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
// 			a = e.keys,
// 			r = e.heightCache,
// 			i = e.containerHeight,
// 			s = void 0 === i ? 0 : i,
// 			o = e.stickToBottom,
// 			c = void 0 !== o && o,
// 			u = e.bottomMargin,
// 			d = void 0 === u ? 0 : u,
// 			p = e.ANCHOR_OFFSET,
// 			m = void 0 === p ? 0 : p,
// 			h = e.STICKY_EPSILON,
// 			f = void 0 === h ? 2 : h,
// 			v = e.STICKY_EPSILON_SETHEIGHT,
// 			b = void 0 === v ? 2 : v;
//
// 		this.heightCache = new HeightCache( {
// 			keys: a,
// 			heightCache: r,
// 		} );
//
// 		this.containerHeight = s;
// 		this.stickToBottom = c;
// 		this.bottomMargin = d;
// 		this.STICKY_EPSILON = f;
// 		this.STICKY_EPSILON_SETHEIGHT = b;
// 		this.ANCHOR_OFFSET = m;
// 		this.anchorOffset = m;
// 		this.anchor = false;
// 	}
//
// 	getOffsetForKey( t ) {
// 		if ( ! t ) return this.totalHeight;
// 		const a = this.getTop( t );
// 		if ( void 0 === a ) return 0;
// 		return a - this.anchorOffset;
// 	}
//
// 	setHeight( a, r, n ) {
// 		if ( false !== this.anchor ) {
// 			super.setHeight( a, r );
// 			return this.bracketScrollTop( this.getOffsetForKey( this.anchor ) );
// 		}
//
// 		if ( this.shouldStickToBottom( n, this.STICKY_EPSILON_SETHEIGHT ) ) {
// 			super.setHeight( a, r );
// 			return this.bracketScrollTop( Infinity );
// 		}
//
// 		let i = n;
// 		const s = this.getBottom( a );
// 		if ( s <= n + this.anchorOffset ) {
// 			const o = r - this.getHeight( a );
// 			i += o;
// 		}
// 		super.setHeight( a, r );
// 		return this.bracketScrollTop( i );
// 	}
//
// 	setKeys( a, r ) {
// 		if ( false !== this.anchor ) {
// 			super.setKeys( a );
// 			return this.bracketScrollTop( this.getOffsetForKey( this.anchor ) );
// 		}
// 		if ( this.shouldStickToBottom( r ) ) {
// 			super.setKeys( a );
// 			return this.bracketScrollTop( Infinity );
// 		}
// 		const n = r + this.anchorOffset;
// 		const i = this.findAnchor( this.keys, a, n );
// 		if ( ! i ) {
// 			super.setKeys( a );
// 			return this.bracketScrollTop( r );
// 		}
// 		const s = this.getTop( i ) - n;
// 		super.setKeys( a );
// 		const o = this.getTop( i ) - n;
// 		const l = s - o;
// 		return this.bracketScrollTop( r - l );
// 	}
//
// 	setContainerHeight( t, a ) {
// 		if ( false !== this.anchor ) {
// 			this.containerHeight = t;
// 			this.layout();
// 			return this.bracketScrollTop( this.getOffsetForKey( this.anchor ) );
// 		}
// 		if ( this.shouldStickToBottom( a ) ) {
// 			this.containerHeight = t;
// 			this.layout();
// 			return this.bracketScrollTop( Infinity );
// 		}
// 		this.containerHeight = t;
// 		this.layout();
// 		return a;
// 	}
//
// 	setBottomMargin( t ) {
// 		this.bottomMargin = t;
// 	}
//
// 	setStickToBottom( t ) {
// 		this.stickToBottom = t;
// 	}
//
// 	setAnchor( t, a ) {
// 		this.anchor = t;
// 		this.anchorOffset = 'number' !== typeof a ? this.ANCHOR_OFFSET : a;
// 	}
//
// 	findAnchor( t, a, r ) {
// 		for ( let n = 0; n < t.length; n++ ) {
// 			const i = t[ n ];
// 			if ( this.getBottom( i ) > r )
// 				for ( let s = 0; s < a.length; s++ ) if ( a[ s ] === i ) return i;
// 		}
// 		return null;
// 	}
//
// 	bracketScrollTop( t ) {
// 		return Math.max(
// 			0,
// 			Math.min( this.totalHeight - this.containerHeight + this.bottomMargin, t )
// 		);
// 	}
//
// 	shouldStickToBottom( t ) {
// 		const a =
// 			arguments.length > 1 && void 0 !== arguments[ 1 ] ? arguments[ 1 ] : this.STICKY_EPSILON;
// 		if ( ! this.stickToBottom ) return false;
// 		return t >= this.totalHeight - this.containerHeight - a + this.bottomMargin;
// 	}
// }
//
// export default Layout;

import HeightCache from './height-cache';
import { forEach } from 'lodash';

class LayoutBase {
	constructor() {
		const r = arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : {},
			a = r.keys,
			n = void 0 === a ? [] : a,
			s = r.heightCache,
			l = void 0 === s ? new HeightCache() : s;
		this.keys = n;
		this.heightCache = l;
		this.layout();
	}

	layout() {
		// console.log("called layoutttttttttt");
		const r = this;
		const a = this.keys;
		const n = {};
		let t = 0;
		forEach( a, function( e ) {
			n[ e ] = t;
			t += r.getHeight( e );
		} );
		this.tops = n;
		this.totalHeight = t;
	}

	getHeight( r ) {
		return this.heightCache.get( r );
	}

	getHeightValidity( r ) {
		return this.heightCache.getValidity( r );
	}

	getTop( r ) {
		return this.tops[ r ];
	}

	getBottom( r ) {
		return this.tops[ r ] + this.getHeight( r );
	}

	getTops() {
		return this.tops;
	}

	getTotalHeight() {
		return this.totalHeight;
	}

	getOffsetForKey( r ) {
		if ( ! r ) return this.totalHeight;
		return this.getTop( r );
	}

	getBounds( r, a ) {
		const n = this.keys;
		let t = 0;
		while ( t + 1 < n.length ) {
			const s = n[ t + 1 ];
			const l = this.getTop( s );
			if ( l > r ) break;
			t += 1;
		}
		let o = t;
		while ( o < n.length ) {
			const i = n[ o ];
			const u = this.getTop( i );
			if ( u > a ) break;
			o += 1;
		}
		return {
			start: t,
			end: o,
		};
	}

	setHeight( r, a ) {
		this.heightCache.set( r, a );
		this.layout();
	}

	setKeys( r ) {
		this.keys = r;
		this.layout();
	}
}

class Layout extends LayoutBase {
	constructor() {
		//super(props);

		const e = arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : {},
			a = e.keys,
			r = e.heightCache,
			i = e.containerHeight,
			s = void 0 === i ? 0 : i,
			o = e.stickToBottom,
			c = void 0 !== o && o,
			u = e.bottomMargin,
			d = void 0 === u ? 0 : u,
			p = e.ANCHOR_OFFSET,
			m = void 0 === p ? 0 : p,
			h = e.STICKY_EPSILON,
			f = void 0 === h ? 2 : h,
			v = e.STICKY_EPSILON_SETHEIGHT,
			b = void 0 === v ? 2 : v;

		const g = super( {
			keys: a,
			heightCache: r,
		} );
		g.containerHeight = s;
		g.stickToBottom = c;
		g.bottomMargin = d;
		g.STICKY_EPSILON = f;
		g.STICKY_EPSILON_SETHEIGHT = b;
		g.ANCHOR_OFFSET = m;
		g.anchorOffset = m;
		g.anchor = false;
		return g;
	}

	getOffsetForKey( t ) {
		if ( ! t ) return this.totalHeight;
		const a = this.getTop( t );
		if ( void 0 === a ) return 0;
		return a - this.anchorOffset;
	}

	setHeight( a, r, n ) {
		// console.log("called set height");
		if ( false !== this.anchor ) {
			super.setHeight( a, r );
			return this.bracketScrollTop( this.getOffsetForKey( this.anchor ) );
		}
		if ( this.shouldStickToBottom( n, this.STICKY_EPSILON_SETHEIGHT ) ) {
			super.setHeight( a, r );
			return this.bracketScrollTop( Infinity );
		}
		let i = n;
		const s = this.getBottom( a );
		if ( s <= n + this.anchorOffset ) {
			const o = r - this.getHeight( a );
			i += o;
		}
		super.setHeight( a, r );
		return this.bracketScrollTop( i );
	}

	setKeys( a, r ) {
		if ( false !== this.anchor ) {
			super.setKeys( a );
			return this.bracketScrollTop( this.getOffsetForKey( this.anchor ) );
		}
		if ( this.shouldStickToBottom( r ) ) {
			super.setKeys( a );
			return this.bracketScrollTop( Infinity );
		}
		const n = r + this.anchorOffset;
		const i = this.findAnchor( this.keys, a, n );
		if ( ! i ) {
			super.setKeys( a );
			return this.bracketScrollTop( r );
		}
		const s = this.getTop( i ) - n;
		super.setKeys( a );
		const o = this.getTop( i ) - n;
		const l = s - o;
		return this.bracketScrollTop( r - l );
	}

	setContainerHeight( t, a ) {
		if ( false !== this.anchor ) {
			this.containerHeight = t;
			this.layout();
			return this.bracketScrollTop( this.getOffsetForKey( this.anchor ) );
		}
		if ( this.shouldStickToBottom( a ) ) {
			this.containerHeight = t;
			this.layout();
			return this.bracketScrollTop( Infinity );
		}
		this.containerHeight = t;
		this.layout();
		return a;
	}

	setBottomMargin( t ) {
		this.bottomMargin = t;
	}

	setStickToBottom( t ) {
		this.stickToBottom = t;
	}

	setAnchor( t, a ) {
		this.anchor = t;
		this.anchorOffset = 'number' !== typeof a ? this.ANCHOR_OFFSET : a;
	}

	findAnchor( t, a, r ) {
		for ( let n = 0; n < t.length; n++ ) {
			const i = t[ n ];
			if ( this.getBottom( i ) > r )
				for ( let s = 0; s < a.length; s++ ) if ( a[ s ] === i ) return i;
		}
		return null;
	}

	bracketScrollTop( t ) {
		return Math.max(
			0,
			Math.min( this.totalHeight - this.containerHeight + this.bottomMargin, t )
		);
	}

	shouldStickToBottom( t ) {
		const a =
			arguments.length > 1 && void 0 !== arguments[ 1 ] ? arguments[ 1 ] : this.STICKY_EPSILON;
		if ( ! this.stickToBottom ) return false;
		return t >= this.totalHeight - this.containerHeight - a + this.bottomMargin;
	}
}

export default Layout;
