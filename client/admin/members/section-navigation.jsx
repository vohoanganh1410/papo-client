import React, { Component } from 'react';
import createReactClass from 'create-react-class';
import { includes } from 'lodash';
import { localize } from 'i18n-calypso';

import Search from 'components/search';
import UrlSearch from 'lib/mixins/url-search';
import SectionNav from 'components/section-nav';
import NavTabs from 'components/section-nav/tabs';
import NavItem from 'components/section-nav/item';

const PeopleSearch = createReactClass( {
	displayName: 'PeopleSearch',
	mixins: [ UrlSearch ],

	render: function() {
		return (
			<Search
				pinned
				fitsContainer
				placeholder={ 'Tìm kiếm thành viên' }
				onSearch={ this.doSearch }
				initialValue={ this.props.search }
				ref="url-search"
				delaySearch={ true }
				analyticsGroup="People"
			/>
		);
	},
} );

class PeopleNavTabs extends React.Component {
	static displayName = 'PeopleNavTabs';

	render() {
		return (
			<NavTabs selectedText={ /*this.props.selectedText*/ 'ssss' }>
				{ this.props.filters.map( function( filterItem ) {
					return (
						<NavItem
							key={ filterItem.id }
							path={ filterItem.path }
							selected={ filterItem.id === this.props.filter }
						>
							{ filterItem.title }
						</NavItem>
					);
				}, this ) }
			</NavTabs>
		);
	}
}

class PeopleSectionNav extends Component {
	canSearch() {
		const { jetpackPeopleSupported, filter } = this.props;
		if ( ! this.props.site ) {
			return false;
		}

		// Disable search for wpcom followers, viewers, and invites
		if ( filter ) {
			if ( 'followers' === filter || 'viewers' === filter || 'invites' === filter ) {
				return false;
			}
		}

		if ( 'team' === filter && ! jetpackPeopleSupported ) {
			// Jetpack sites can only search team on versions of 3.7.0-beta or later
			return false;
		}

		return true;
	}

	getFilters() {
		const filters = [
			{
				title: 'Nhóm',
				path:
					'/admin/members/team' +
					( this.props.teamSlugQuery ? '?team=' + this.props.teamSlugQuery : null ),
				id: 'team',
			},
			{
				title: 'Vai trò',
				path:
					'/admin/members/roles/' +
					( this.props.teamSlugQuery ? '?team=' + this.props.teamSlugQuery : null ),
				id: 'roles',
			},
		];

		return filters;
	}

	getNavigableFilters() {
		const allowedFilterIds = [ 'team', 'followers', 'email-followers', 'roles' ];

		if ( this.shouldDisplayViewers() ) {
			allowedFilterIds.push( 'viewers' );
		}

		return this.getFilters().filter(
			filter => this.props.filter === filter.id || includes( allowedFilterIds, filter.id )
		);
	}

	shouldDisplayViewers() {
		if ( ! this.props.site ) {
			return false;
		}

		if ( 'viewers' === this.props.filter || ( ! this.props.isJetpack && this.props.isPrivate ) ) {
			return true;
		}
		return false;
	}

	render() {
		var selectedText,
			hasPinnedItems = false,
			search = null;

		if ( /*this.canSearch()*/ true ) {
			hasPinnedItems = true;
			search = <PeopleSearch { ...this.props } />;
		}

		selectedText = 'team';
		return (
			<SectionNav selectedText={ selectedText } hasPinnedItems={ hasPinnedItems }>
				<PeopleNavTabs
					{ ...this.props }
					selectedText={ selectedText }
					filters={ this.getNavigableFilters() }
				/>
				{ search }
			</SectionNav>
		);
	}
}

export default localize( PeopleSectionNav );
