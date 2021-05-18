/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Avatar from 'components/avatar';
import Tooltip from 'components/tooltip';
import ExternalLink from 'components/external-link';
import Emojify from 'components/emojify';
import { getSelectedSiteId } from 'state/ui/selectors';

export class ConversationSource extends Component {
	render() {
		const {
			order,
			siteId,
			moment,
			translate,
		} = this.props;

		return(
			<div className="conversation-source__author">
				<div className="conversation-source__author-avatar">
					<Avatar user={ null } />
					<span className="conversation-source__author-avatar-placeholder" />
				</div>
				<div className="conversation-source__author-info">
					<div className="conversation-source__author-info-element">
						<strong className="conversation-source__author-name">
							<Emojify>{ order.source.page_name }</Emojify>
						</strong>
					</div>
					<div className="conversation-source__author-info-element">
						<span className="comment__date">
							[ Display something here ]
						</span>
					</div>
				</div>
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

export default connect( mapStateToProps )( localize( ConversationSource ) );