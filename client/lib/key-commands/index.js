import { isFunction, flatMap } from 'lodash';

import MouseTrap from 'lib/mousetrap';

const _ = function e( r ) {
	return MouseTrap.stopCallback( r, r.target );
};

const h = function e( r, t ) {
	return function() {
		const xx = arguments.length <= 0 ? void 0 : arguments[ 0 ];
		if ( t( xx ) ) return;
		r.apply( void 0, arguments );
	};
};

const f = function e( r, t ) {
	const n = t[ 0 ];
	return n ? e( h( r, n ), t.slice( 1 ) ) : r;
};

const m = function e( r ) {
	const t = r.ignoreInputs && _;
	return [ t, r.filter ].filter( isFunction );
};

class KeyCommands {
	constructor() {
		this.mousetrap = new MouseTrap();
	}

	bindAll( r ) {
		const t = this;
		r.forEach( function( e ) {
			const rr = m( e );
			e.handler = f( e.handler, rr );
			t.mousetrap.bind( e.keys, e.handler, e.action );
		} );
	}

	reset() {
		const t = this;
		t.mousetrap.reset();
	}

	unbindAll( t ) {
		const r = this;
		r.mousetrap.unbind( flatMap( t, 'keys' ) );
	}

	trigger( r, t ) {
		const x = this;
		x.mousetrap.trigger( r, t );
	}
}

export default KeyCommands;
