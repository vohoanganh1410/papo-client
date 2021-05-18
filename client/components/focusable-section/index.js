import React from 'react';
import PropTypes from 'prop-types';

const v = function e( t, a ) {
	return t + '-' + a;
};
const b = {
	add: function e( t, a, r ) {
		this.sections || ( this.sections = {} );
		const n = v( t, a );
		if ( this.sections[ n ] )
			throw new Error( 'A section has already been specified at "' + n + '"' );
		this.sections[ n ] = r;
	},
	remove: function e( t, a ) {
		if ( ! this.sections ) return;
		const r = v( t, a );
		if ( ! this.sections[ r ] ) return;
		this.sections[ r ] = null;
		delete this.sections[ r ];
	},
	get: function e( t, a ) {
		if ( ! this.sections ) return;
		return this.sections[ v( t, a ) ];
	},
};
const g = b;

export default class FocusableSection extends React.PureComponent {
	static propTypes = {
		teamId: PropTypes.string,
		order: PropTypes.number.isRequired,
		component: PropTypes.object.isRequired,
		children: PropTypes.node,
	};

	static defaultProps = {
		children: null,
	};

	componentDidMount() {
		const t = this.props,
			a = t.teamId,
			r = t.order,
			n = t.component;
		g.add( a, r, n );
	}

	componentWillUnmount() {
		const t = this.props,
			a = t.teamId,
			r = t.order;
		g.remove( a, r );
	}

	render() {
		return this.props.children;
	}
}
