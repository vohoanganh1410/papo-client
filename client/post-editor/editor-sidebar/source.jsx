/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getPage } from 'state/conversation/selectors';
import ConversationSource from 'blocks/conversation-source';

export class Source extends Component {
	
	render () {
		const { page } = this.props;
		if ( ! page ) {
			return null;
		}
		return (
			<ConversationSource source={ page } />
		)
	}
}

export default connect( state => {
	const page = getPage( state );

	return {
		page,
	};
} )( Source  );