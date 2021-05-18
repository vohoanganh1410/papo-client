class BaseWidthCache {
	constructor() {
		const r = arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : {},
			t = r.DEFAULT_WIDTH,
			n = void 0 === t ? 50 : t;
		this.widths = {};
		this.DEFAULT_WIDTH = n;
	}

	get( r ) {
		if ( r in this.widths ) return this.widths[ r ];
		return this.DEFAULT_WIDTH;
	}

	set( r, t ) {
		this.widths[ r ] = t;
	}

	getValidity( r ) {
		return r in this.widths;
	}
}

class WidthCache extends BaseWidthCache {
	constructor() {
		const t = super();
		t.validity = {};
		return t;
	}

	getValidity( r ) {
		return !! this.validity[ r ];
	}

	set( t, n ) {
		super.set( t, n );
		this.validity[ t ] = true;
	}

	invalidate( r ) {
		if ( ! r ) {
			this.validity = {};
			return;
		}
		delete this.validity[ r ];
	}
}

export default WidthCache;
