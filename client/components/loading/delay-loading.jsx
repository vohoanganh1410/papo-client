import React from 'react';
import PropTypes from 'prop-types';
import LazyRender from 'react-lazily-render';

import Loading from './index';

export default class DelayLoading extends React.PureComponent {
	static propTypes = {
		delayTime: PropTypes.number, // ms
	};

	static defaultProps = {
		delayTime: 100,
	};

	constructor( props ) {
		super( props );

		this.state = {
			hidden: true,
		};
	}

	componentWillMount() {
		this.timeout = setTimeout( () => {
			this.show();
		}, this.props.delayTime );
	}

	componentWillUnmount() {
		this.timeout && clearTimeout( this.timeout );
	}

	show = () => {
		this.setState( {
			hidden: false,
		} );
	};

	render() {
		if ( this.state.hidden === true ) return null;
		return <Loading />;
	}
}
