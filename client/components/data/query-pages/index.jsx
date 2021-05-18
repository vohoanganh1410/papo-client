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
import { requestPages } from 'state/pages/actions';

export class QueryPages extends Component {

	componentWillMount() {
		this.request();
	}

	request() {
		this.props.requestPages( );
	}

	render() {
		return null;
	}
}

export default connect( null, { requestPages } )( QueryPages );