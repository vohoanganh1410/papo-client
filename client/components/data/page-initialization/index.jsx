/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { initializePage } from 'lib/facebook/page';

export class InitializePage extends Component {
	static propTypes = {
		page_id: PropTypes.number,
		initialized: PropTypes.bool,
		page_access_token: PropTypes.string,
	};

	componentWillMount() {
		this.init( this.props );
	}

	componentDidUpdate( { page_id, initialized, page_access_token } ) {
		if ( page_id && initialized == false && page_access_token ) {
			this.init();
		}
	}

	componentWillReceiveProps( nextProps ) {
		// console.log(nextProps.query);
		if (
			this.props.page_id === nextProps.page_id &&
			nextProps.initialized &&
			this.props.page_access_token === nextProps.page_access_token
		) {
			return;
		}
		this.init( nextProps );
	}	
	
	// shouldComponentUpdate = nextProps => {
	// 	console.log( 'nextProps', nextProps );
	// 	console.log( 'this.props', this.props );
	// 	return nextProps.page_access_token !== this.props.page_access_token;
	// }

	init( props ) {
		const { page_id, page_name, initialized, page_access_token } = props;
		if (  page_access_token && page_id && ! initialized ) {
			this.props.initializePage( page_id, page_name, page_access_token );
		}
	}

	render() {
		return null;
	}
}

export default connect( null, { initializePage } )( InitializePage );