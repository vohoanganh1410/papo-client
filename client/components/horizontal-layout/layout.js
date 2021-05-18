import { forEach, mapValues, includes } from 'lodash';

import WidthCache from './width-cache';

class LayoutBase {
	constructor() {
		const r = arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : {},
			a = r.keys,
			n = void 0 === a ? [] : a,
			s = r.widthCache,
			l = void 0 === s ? new WidthCache() : s;
		this.keys = n;
		this.widthCache = l;
		this.layout();
	}

	layout() {
		const r = this;
		const a = this.keys;
		const n = {};
		let t = 0;
		forEach( a, function( e ) {
			n[ e ] = t;
			t += r.getWidth( e );
		} );
		this.lefts = n;
		this.totalWidth = t;
	}

	getWidth( r ) {
		return this.widthCache.get( r );
	}

	getTotalWidthToItemIndex( index ) {
		let res = 0;
		for ( let i = 0; i < index; i++ ) {
			const key = this.keys[ index ];
			res += this.getWidth( key );
		}
		return res;
	}

	getWidthValidity( r ) {
		return this.widthCache.getValidity( r );
	}

	getLeft( r ) {
		return this.lefts[ r ];
	}

	getRight( r ) {
		return this.lefts[ r ] + this.getWidth( r );
	}

	getLefts() {
		return this.lefts;
	}

	getTotalWidth() {
		return this.totalWidth;
	}

	getOffsetForKey( r ) {
		if ( ! r ) return this.totalWidth;
		return this.getLeft( r );
	}

	getBounds( r, a ) {
		const n = this.keys;
		let t = 0;
		while ( t + 1 < n.length ) {
			const s = n[ t + 1 ];
			const l = this.getLeft( s );
			if ( l > r ) break;
			t += 1;
		}
		let o = t;
		while ( o < n.length ) {
			const i = n[ o ];
			const u = this.getLeft( i );
			if ( u > a ) break;
			o += 1;
		}
		return {
			start: t,
			end: o,
		};
	}

	setWidth( r, a ) {
		this.widthCache.set( r, a );
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
			r = e.widthCache,
			i = e.containerWidth,
			s = void 0 === i ? 0 : i,
			o = e.stickToRight,
			c = void 0 !== o && o,
			u = e.rightMargin,
			d = void 0 === u ? 0 : u,
			p = e.ANCHOR_OFFSET,
			m = void 0 === p ? 0 : p,
			h = e.STICKY_EPSILON,
			f = void 0 === h ? 2 : h,
			v = e.STICKY_EPSILON_SETWIDTH,
			b = void 0 === v ? 2 : v;

		const g = super( {
			keys: a,
			widthCache: r,
		} );
		g.containerWidth = s;
		g.stickToRight = c;
		g.rightMargin = d;
		g.STICKY_EPSILON = f;
		g.STICKY_EPSILON_SETWIDTH = b;
		g.ANCHOR_OFFSET = m;
		g.anchorOffset = m;
		g.anchor = false;
		return g;
	}

	getOffsetForKey( t ) {
		if ( ! t ) return this.totalWidth;
		const a = this.getLeft( t );
		if ( void 0 === a ) return 0;
		return a - this.anchorOffset;
	}

	setWidth( a, r, n ) {
		if ( false !== this.anchor ) {
			super.setWidth( a, r );
			return this.bracketScrollLeft( this.getOffsetForKey( this.anchor ) );
		}
		if ( this.shouldStickToRight( n, this.STICKY_EPSILON_SETWIDTH ) ) {
			super.setWidth( a, r );
			return this.bracketScrollLeft( Infinity );
		}
		let i = n;
		const s = this.getRight( a );
		if ( s <= n + this.anchorOffset ) {
			const o = r - this.getWidth( a );
			i += o;
		}
		super.setWidth( a, r );
		return this.bracketScrollLeft( i );
	}

	setKeys( a, r ) {
		if ( false !== this.anchor ) {
			super.setKeys( a );
			return this.bracketScrollLeft( this.getOffsetForKey( this.anchor ) );
		}
		if ( this.shouldStickToRight( r ) ) {
			super.setKeys( a );
			return this.bracketScrollLeft( Infinity );
		}
		const n = r + this.anchorOffset;
		const i = this.findAnchor( this.keys, a, n );
		if ( ! i ) {
			super.setKeys( a );
			return this.bracketScrollLeft( r );
		}
		const s = this.getLeft( i ) - n;
		super.setKeys( a );
		const o = this.getLeft( i ) - n;
		const l = s - o;
		return this.bracketScrollLeft( r - l );
	}

	setContainerWidth( t, a ) {
		if ( false !== this.anchor ) {
			this.containerWidth = t;
			this.layout();
			return this.bracketScrollLeft( this.getOffsetForKey( this.anchor ) );
		}
		if ( this.shouldStickToRight( a ) ) {
			this.containerWidth = t;
			this.layout();
			return this.bracketScrollLeft( Infinity );
		}
		this.containerWidth = t;
		this.layout();
		return a;
	}

	setrightMargin( t ) {
		this.rightMargin = t;
	}

	setstickToRight( t ) {
		this.stickToRight = t;
	}

	setAnchor( t, a ) {
		this.anchor = t;
		this.anchorOffset = 'number' !== typeof a ? this.ANCHOR_OFFSET : a;
	}

	findAnchor( t, a, r ) {
		for ( let n = 0; n < t.length; n++ ) {
			const i = t[ n ];
			if ( this.getRight( i ) > r )
				for ( let s = 0; s < a.length; s++ ) if ( a[ s ] === i ) return i;
		}
		return null;
	}

	bracketScrollLeft( t ) {
		return Math.max( 0, Math.min( this.totalWidth - this.containerWidth + this.rightMargin, t ) );
	}

	shouldStickToRight( t ) {
		const a =
			arguments.length > 1 && void 0 !== arguments[ 1 ] ? arguments[ 1 ] : this.STICKY_EPSILON;
		if ( ! this.stickToRight ) return false;
		return t >= this.totalWidth - this.containerWidth - a + this.rightMargin;
	}

	ajustItemWidth( keys, addWidth ) {
		// console.log("need ajust key: ", addWidth);
		// // const newWidthsCache = {};
		// const willAdd = addWidth / keys.length;
		// mapValues( this.widthCache.widths, ( value, oldItemKey ) => {
		// 	// newWidthsCache[ oldItemKey ] = value + willAdd;
		// 	// console.log( 'oldItemKey', oldItemKey );
		// 	// console.log( 'value', value );
		// 	// console.log( 'addWidth', addWidth );
		// 	includes( keys, oldItemKey ) && super.setWidth( oldItemKey, value + willAdd );
		// } );
		// this.widthCache = newWidthsCache;
		// this.layout();
	}
}

export default Layout;
