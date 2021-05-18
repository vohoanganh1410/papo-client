/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Gridicon from 'gridicons';
import { localize } from 'i18n-calypso';
import { each, get, includes, isEqual, isUndefined, map, times } from 'lodash';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import ButtonGroup from 'components/button-group';
import ControlItem from 'components/segmented-control/item';
import SectionNav from 'components/section-nav';
import OrderNavigationTab from './order-navigation-tab';
import UrlSearch from 'lib/url-search';
import CustomerAvatar from 'telesale/customer-avatar';
import OrderStatusButton from 'components/order-status-button';
import StatusButtonPlaceholder from './status-placeholder';

/**
 * Module variables
 */
const bulkActions = {
	unapproved: [ 'approve', 'spam', 'trash' ],
	approved: [ 'unapprove', 'spam', 'trash' ],
	spam: [ 'approve', 'delete' ],
	trash: [ 'approve', 'spam', 'delete' ],
	all: [ 'approve', 'unapprove', 'spam', 'trash' ],
};

const NUMBER_OF_PLACEHOLDERS = 5;

export class OrderNavigation extends Component {
	setOrderStatus = newStatus => () => {
		console.log( newStatus );
	}

	renderOrderStatuses() {
		const { statuses, translate } = this.props;
		if ( !statuses || statuses.length == 0 ) {
			// return null;
			// render placeholder
			return (
				<div className="order-status__buttons">
					{
						times( NUMBER_OF_PLACEHOLDERS, index => {
							return <StatusButtonPlaceholder key={ 'status-placeholder-' + index } />
						} )
					}
				</div>
			)
		}

		return(
			<div className="order-status__buttons">
				{
					statuses.map( status => {
						return(
							<OrderStatusButton
								compact
								key={ status.id }
								disabled={ false }
								status={ status }
								onClick={ this.setOrderStatus( status.name ) }
							>
								{ translate( status.display_name ) }
							</OrderStatusButton>
						);
					} )
				}
			</div>
		)
	}

	render() {
		const { post, translate } = this.props;
		if ( !post ) {
			return(
				<strong>No order selected!</strong>
			)
		}
		return (
			<SectionNav className="order-navigation">
				<OrderNavigationTab className="order-navigation__general-info">
					<CustomerAvatar user={ post.from } />
				</OrderNavigationTab>
				<OrderNavigationTab className="order-navigation__actions">
					{ this.renderOrderStatuses() }
				</OrderNavigationTab>

			</SectionNav>
		)
	}
}

const mapStateToProps = ( state, { siteId } ) => {
	return {
		test: null
	}
};

const mapDispatchToProps = ( dispatch, { siteId } ) => ( {
	test: null,
} );

export default connect( mapStateToProps, /*mapDispatchToProps*/false )(
	localize( UrlSearch( OrderNavigation ) )
);



