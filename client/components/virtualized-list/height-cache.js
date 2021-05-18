// class BaseHeightCache {
// 	constructor( props ) {
// 		// console.log("propspropspropspropspropsprops", props);
// 		const r = props || {},
// 			t = r.DEFAULT_HEIGHT,
// 			m = r.heights,
// 			a = undefined === t ? 70 : t;
//
// 		this.heights = m || {};
// 		this.DEFAULT_HEIGHT = a;
// 	}
//
// 	get( r ) {
// 		// return get( this.heights, r ) || this.DEFAULT_HEIGHT;
// 		if ( r in this.heights ) return this.heights[ r ];
// 		// alert("s")
// 		return this.DEFAULT_HEIGHT;
// 	}
//
// 	set( r, t ) {
// 		// if ( t === 0 ) return;
// 		this.heights[ r ] = t;
// 	}
//
// 	getValidity( r ) {
// 		return r in this.heights;
// 	}
// }
//
// class HeightCache extends BaseHeightCache {
// 	constructor( props ) {
// 		super( props );
//
// 		this.validity = {};
// 	}
//
// 	getValidity( r ) {
// 		return this.validity[ r ];
// 	}
//
// 	set( t, a ) {
// 		// console.log("settttttttttttttttt: ", t, " a: ", a);
// 		super.set( t, a );
// 		this.validity[ t ] = true;
// 	}
//
// 	invalidate( r ) {
// 		if ( ! r ) {
// 			this.validity = {};
// 			return;
// 		}
// 		delete this.validity[ r ];
// 	}
// }
//
// export default HeightCache;

class BaseHeightCache {
	constructor() {
		const r = arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : {},
			t = r.DEFAULT_HEIGHT,
			n = void 0 === t ? 50 : t;
		this.heights = {};
		this.DEFAULT_HEIGHT = n;
	}

	get( r ) {
		if ( r in this.heights ) return this.heights[ r ];
		return this.DEFAULT_HEIGHT;
	}

	set( r, t ) {
		this.heights[ r ] = t;
	}

	getValidity( r ) {
		return r in this.heights;
	}
}

class HeightCache extends BaseHeightCache {
	constructor( props ) {
		const t = super( props );
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

export default HeightCache;
