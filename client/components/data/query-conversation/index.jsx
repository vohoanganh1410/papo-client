/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import shallowEqual from 'react-pure-render/shallowEqual';

/**
 * Internal dependencies
 */
import { fetchConversation } from 'state/conversation/actions';

export class QueryConversation extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
	};

	componentWillMount() {
		if ( this.props.id ) {
			this.request( this.props );
		}
		
	}

	componentWillReceiveProps( nextProps ) {
		if (
			this.props.id === nextProps.id &&
			shallowEqual( this.props.query, nextProps.query )
		) {
			return;
		}
		this.request( nextProps );
	}

	request( props ) {
		const { id, query } = props;
		if ( id ) {
			this.props.fetchConversation( id, query );
		}
	}

	render() {
		return null;
	}
}

export default connect(
	( state ) => {
		return {
			a: null,
		}
	},
	{
		fetchConversation,
	}
) ( QueryConversation );