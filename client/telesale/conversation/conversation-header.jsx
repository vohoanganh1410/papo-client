/** @format */
/**
 * External dependencies
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import ConversationSource from './conversation-source';
import { getSelectedSiteId } from 'state/ui/selectors';

export class ConversationHeader extends PureComponent {

	render() {
		const { order, siteId } = this.props;
		return(
			<div className="conversation__header">
				<ConversationSource { ...{ order, siteId } } />
			</div>
		)
	}
}

const mapStateToProps = ( state, { commentId, isBulkMode } ) => {
	const siteId = getSelectedSiteId( state );

	return {
		siteId,
	};
};

export default connect( mapStateToProps )( ConversationHeader );