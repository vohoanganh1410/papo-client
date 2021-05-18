import React from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { compact, includes } from 'lodash';

import config from 'config';
import SidebarItem from './sidebar-item';
import { itemLinkMatches } from './utils';
import SidebarButton from './sidebar-item-button';
import SidebarMenu from './menu';
import SidebarHeading from './heading';
import TeamPicker from 'admin/team-picker';
import { getSelectedTeam } from 'state/current-user/selectors';

import styles from './style.scss';

class Sidebar extends React.PureComponent {
	addQueryTeamToURLIfNeed = () => {
		const { selectedTeam, query } = this.props;
		const selectedTeamFromParams = query.team;

		if ( selectedTeamFromParams ) {
			return `?team=${ selectedTeamFromParams }`;
		}
		return null;
	};

	getDefaultMenuItems() {
		const items = [
			{
				name: 'order',
				label: 'Orders',
				capability: 'edit_posts',
				queryable: true,
				config: 'manage/pages',
				link: '/admin/orders' + this.addQueryTeamToURLIfNeed(),
				buttonLink: '/order',
			},
			{
				name: 'product',
				label: 'Sản phẩm',
				link: '/admin/products' + this.addQueryTeamToURLIfNeed(),
				paths: [ '/admin/products' ],
				buttonLink: '/product',
			},
			{
				name: 'media',
				label: 'Tập tin',
				link: '/admin/media' + this.addQueryTeamToURLIfNeed(),
				buttonLink: '/admin/media/',
			},
			{
				name: 'members',
				label: 'Thành viên',
				link: '/admin/members/team' + this.addQueryTeamToURLIfNeed(),
				paths: [ '/admin/members', '/admin/members/team' ],
			},
			{
				name: 'fanpages',
				label: 'Trang',
				link: '/admin/fanpages' + this.addQueryTeamToURLIfNeed(),
				paths: [ '/admin/fanpages', '/admin/comments' ],
			},
			{
				name: 'logistics',
				label: 'Vận chuyển',
				link: '/admin/logistics' + this.addQueryTeamToURLIfNeed(),
				paths: [ '/admin/logistics' ],
			},
		];

		return items;
	}

	renderMenuItem( menuItem ) {
		// console.log(this.props);
		const { canCurrentUserFn, site, siteId, siteAdminUrl } = this.props;

		if ( siteId && ! canCurrentUserFn( menuItem.capability ) ) {
			return null;
		}

		// Hide the sidebar link for media
		if ( 'attachment' === menuItem.name ) {
			return null;
		}

		// Hide the sidebar link for multiple site view if it's not in calypso, or
		// if it opts not to be shown.
		const isEnabled = config.isEnabled( menuItem.config );
		// if ( ! siteId && ( ! isEnabled || ! menuItem.showOnAllMySites ) ) {
		// 	return null;
		// }

		let link;
		if ( ( ! isEnabled || ! menuItem.queryable ) && siteAdminUrl ) {
			link = siteAdminUrl + menuItem.wpAdminLink;
		} else {
			link = compact( [ menuItem.link, this.props.siteSlug ] ).join( '/' );
		}

		let preload;
		if ( includes( [ 'post', 'order', 'people' ], menuItem.name ) ) {
			preload = 'dashboard-orders';
		} else if ( 'comments' === menuItem.name ) {
			preload = 'comments';
		} else if ( 'media' === menuItem.name ) {
			preload = 'dashboard-media';
		} else if ( 'product' === menuItem.name ) {
			preload = 'dashboard-products';
		} else {
			preload = 'admin';
		}

		let icon;
		switch ( menuItem.name ) {
			case 'order':
				icon = 'check_circle_o';
				break;
			case 'members':
				icon = 'user_groups';
				break;
			case 'media':
				icon = 'input_img';
				break;
			case 'fanpages':
				icon = 'facebook';
				break;
			case 'product':
				icon = 'cart';
				break;
			case 'logistics':
				icon = 'emoji_travel';
				break;
			default:
				icon = 'smile_o';
		}

		return (
			<SidebarItem
				key={ menuItem.name }
				label={ menuItem.label }
				selected={ itemLinkMatches( menuItem.paths || menuItem.link, this.props.path ) }
				link={ link }
				onNavigate={ /*this.onNavigate( menuItem.name )*/ null }
				icon={ icon }
				preloadSectionName={ preload }
				tipTarget={ `side-menu-${ menuItem.name }` }
			>
				{ /*menuItem.name !== 'media' && (
					<SidebarButton
						onClick={ this.trackSidebarButtonClick( menuItem.name ) }
						href={ menuItem.buttonLink }
						preloadSectionName="dashboard-orders"
					>
						Thêm
					</SidebarButton>
				)*/ }
			</SidebarItem>
		);
	}

	getCustomMenuItems() {
		return [];
	}

	trackSidebarButtonClick = name => {
		return () => {
			// this.props.recordTracksEvent(
			// 	'calypso_mysites_sidebar_' + name.replace( /-/g, '_' ) + '_sidebar_button_clicked'
			// );
		};
	};

	renderSidebarMenus() {
		const manage = !! this.manage(),
			configuration = true;

		return (
			<div>
				{ manage ? (
					<SidebarMenu>
						<SidebarHeading>Quản lý</SidebarHeading>
						{ this.manage() }
					</SidebarMenu>
				) : null }

				{ configuration ? (
					<SidebarMenu>
						<SidebarHeading>Thiết lập</SidebarHeading>
						<ul>
							{ /*{ this.users() }*/ }
							{ this.settings() }
						</ul>
					</SidebarMenu>
				) : null }
			</div>
		);
	}

	stats() {
		// const statsLink = getStatsPathForTab( 'day', siteId );
		return (
			<SidebarMenu>
				<ul>
					<SidebarItem
						tipTarget="menus"
						label={ 'Bảng điều khiển' }
						className="stats"
						selected={ this.props.path === '/admin' }
						link={ '/admin' + this.addQueryTeamToURLIfNeed() }
						icon="dashboard"
					/>
				</ul>
			</SidebarMenu>
		);
	}

	manage = () => {
		const menuItems = [ ...this.getDefaultMenuItems(), ...this.getCustomMenuItems() ];
		return (
			<ul>
				{ /*{ this.props.siteId && <QueryPostTypes siteId={ this.props.siteId } /> }*/ }
				{ menuItems && menuItems.map( this.renderMenuItem, this ) }
			</ul>
		);
	};

	settings = () => {
		return (
			<SidebarItem
				label="Cài đặt"
				selected={ itemLinkMatches( '/admin/settings', this.props.path ) }
				link={ 'admin/settings' + this.addQueryTeamToURLIfNeed() }
				icon="cog_o"
				tipTarget="settings"
			/>
		);
	};

	render() {
		return (
			<div className="sidebar">
				<TeamPicker
					allSitesPath={ this.props.allSitesPath }
					siteBasePath={ this.props.siteBasePath }
					onClose={ this.preventPickerDefault }
				/>
				{ /*<SidebarNotices />*/ }
				{ this.stats() }
				{ this.renderSidebarMenus() }
			</div>
		);
	}
}

export default connect( state => {
	return {
		selectedTeam: getSelectedTeam( state ),
	};
} )( localize( Sidebar ) );
