/** @format */
/**
 * External dependencies
 */
import classNames from 'classnames';
import debugFactory from 'debug';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import Gridicon from 'gridicons';
import page from 'page';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import config from 'config';
import CurrentSite from 'dashboard/current-site';
import Sidebar from 'layout/sidebar';
import SidebarButton from 'layout/sidebar/button';
// import SidebarFooter from 'layout/sidebar/footer';
import SidebarHeading from 'layout/sidebar/heading';
import SidebarItem from 'layout/sidebar/item';
import SidebarMenu from 'layout/sidebar/menu';
import SidebarRegion from 'layout/sidebar/region';
import { getCurrentUser } from 'state/current-user/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';
import { setNextLayoutFocus, setLayoutFocus } from 'state/ui/layout-focus/actions';
import { itemLinkMatches } from 'dashboard/sidebar/utils';
import OrderList from 'blocks/order-list';
import FilterBar from 'dashboard/orders/filter-bar';
import QuerySiteOrderStatuses from 'components/data/query-site-order-statuses';

import {
	getPrimarySiteId,
	getSites,
	getSiteId,
	canCurrentUser,
} from 'state/selectors';

import {
	getSite,
} from 'state/sites/selectors';

import { getSiteOrderStatuses } from 'state/site-order-statuses/selectors';

/**
 * Module variables
 */
const debug = debugFactory( 'papo:telesale' );

export class TelesaleSidebar extends Component {
	
	constructor( props ) {
		super( props );
		this.state = {
			scrollContainer: null
		}
	}

	componentWillUnmount() {
	  this.mounted = false;
	}

	componentDidMount() {
		this.mounted = true;
		if( this.mounted ) {
			this.setState( {
				scrollContainer: ReactDom.findDOMNode( this.refs.sidebar ),
			} );
		}
	}

	doSearch = keywords => {
		console.log(keywords);
		// searchUrl( keywords, this.props.search, this.props.onSearch );
	};

	render() {
		// console.log( this.state );
		const { query, author, category, search, siteId, statusSlug, tag, users } = this.props;
		// const container = ReactDom.findDOMNode( this.refs.sidebar );
		return (
			<Sidebar>
				<QuerySiteOrderStatuses siteId={ siteId } />
				<FilterBar
					{ ...this.props }
					site={ this.props.site }
					filter={ this.props.filter }
					onSourceChange={ this.props.onSourceChange }
					enabledFilters={ this.props.enabledFilters }
					search={ this.props.search }
					source={ '' }
					onSearch={ this.doSearch }
				/>
				<SidebarRegion ref="sidebar">
					<CurrentSite allSitesPath={ this.props.allSitesPath } />
						<OrderList 
							{ ...this.props }
							site={ this.props.site }
							query={ query }
							scrollContainer={ this.state.scrollContainer }/>
					
				</SidebarRegion>
				
			</Sidebar>
		);
	}
}

function mapStateToProps( state ) {
	const currentUser = getCurrentUser( state );
	const selectedSiteId = getSelectedSiteId( state );
	const isSingleSite = !! selectedSiteId || currentUser.site_count === 1;
	const siteId = selectedSiteId || ( isSingleSite && getPrimarySiteId( state ) ) || null;
	const site = getSite( state, siteId );

	const statuses = getSiteOrderStatuses( state, siteId );

	return {
		currentUser,
		// canUserListUsers: canCurrentUser( state, siteId, 'list_users' ),
		siteId,
		site,
		siteSuffix: site ? '/' + site.slug : '',
		statuses: statuses,
	};
}

export default connect( mapStateToProps, {
	setLayoutFocus,
	setNextLayoutFocus,
} )( localize( TelesaleSidebar ) );