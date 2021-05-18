import { isFunction, mapValues, first } from 'lodash';

import Layout from 'components/virtualized-list/layout';

export default class MessageLayout extends Layout {
	constructor( props ) {
		const a = super( props );

		isFunction( props.shouldExcludeFirstItemFromGravity ) &&
			( a.shouldExcludeFirstItemFromGravity = props.shouldExcludeFirstItemFromGravity );
		return a;
	}

	layout() {
		super.layout();

		if ( this.totalHeight < this.containerHeight ) {
			const a = this.containerHeight - this.totalHeight;
			this.tops = mapValues( this.tops, function( e ) {
				return e + a;
			} );
			this.totalHeight = this.containerHeight;
		}
		this.shouldExcludeFirstItemFromGravity &&
			this.shouldExcludeFirstItemFromGravity() &&
			this.keys.length > 0 &&
			( this.tops[ first( this.keys ) ] = 0 );
	}
}

// export default MessageLayout;
MessageLayout.displayName = 'DynamicList';
