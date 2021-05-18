// /** @format */
//
// /**
//  * External dependencies
//  */
//
// import React from 'react';
//
// /**
//  * Internal dependencies
//  */
// import TeamPicker from 'admin/team-picker';
// import Sidebar from './sidebar';
// import styles from './style.scss';
// import TeamSelector from 'admin/team-picker/team-selector';
//
// class SidebarTeamSwitcher extends React.Component {
// 	static displayName = 'SidebarTeamSwitcher';
//
// 	preventPickerDefault = event => {
// 		event.preventDefault();
// 		event.stopPropagation();
// 	};
//
// 	render() {
// 		return (
// 			<div className={ styles.sidebar + ' ' + styles.with_team_switch }>
// 				<Sidebar
// 					allSitesPath={ this.props.allSitesPath }
// 					query={ this.props.query }
// 					path={ this.props.path }
// 					siteBasePath={ this.props.siteBasePath }
// 				/>
// 				<TeamSelector />
// 			</div>
// 		);
// 	}
// }
//
// export default SidebarTeamSwitcher;
import React from 'react';
import classNames from 'classnames';

import SideMenuDrill from 'papo-components/SideMenuDrill';
import SideMenu from 'papo-components/SideMenu';
import Button from 'papo-components/Button';
import Tooltip from 'papo-components/Tooltip';
import Heading from 'papo-components/Heading';
import HelpIcon from 'papo-components/new-icons/InfoCircle';
import ChatIcon from 'papo-components/new-icons/Chat';
import ExternalLink from 'papo-components/new-icons/ExternalLink';

import { getSelectedTeam } from 'state/current-user/selectors';
import { itemLinkMatches } from './utils';

import WithTeam from 'components/with-team';

import styles from './style.scss';
import { connect } from 'react-redux';

function doSomething() {}

let counter = 3;

class Sidebar extends React.PureComponent {
	constructor( props ) {
		super( props );

		const initialItems = [
			{
				type: 'link',
				to: '/admin' + this.addQueryTeamToURLIfNeed(),
				title: 'Bảng điều khiển',
				disabled: false,
			},
			{
				type: 'link',
				to: '/admin/members/team' + this.addQueryTeamToURLIfNeed(),
				title: 'Thành viên',
				badge: true,
				badgeTooltip: true,
			},
			{
				type: 'link',
				to: '/admin/members/roles' + this.addQueryTeamToURLIfNeed(),
				title: 'Vai trò',
				badge: true,
				badgeTooltip: true,
			},
			{
				type: 'divider',
			},
			{
				type: 'header',
				value: 'Tài sản',
			},
			{ type: 'link', to: '/admin/orders' + this.addQueryTeamToURLIfNeed(), title: 'Orders' },
			{
				type: 'menu',
				title: 'Đơn hàng',
				badge: true,
				items: [
					{ type: 'link', to: '//wix.com', title: 'link #2_1' },
					{ type: 'link', to: '//wix.com', title: 'link #2_2' },
					{ type: 'link', to: '//wix.com', title: 'link #2_3' },
					{
						type: 'menu',
						title: 'Sub Menu #2-3',
						items: [
							{ type: 'link', to: '//wix.com', title: 'link #2-3_1' },
							{ type: 'link', to: '//wix.com', title: 'link #2-3_2' },
							{ type: 'link', to: '//wix.com', title: 'link #2-3_3' },
						],
					},
				],
			},
			{
				type: 'menu',
				title: 'Kho hàng',
				items: [
					{ type: 'link', to: '//wix.com', title: 'link #3_1' },
					{ type: 'link', to: '//wix.com', title: 'link #3_2' },
					{ type: 'link', to: '//wix.com', title: 'link #3_3' },
				],
			},
			{
				type: 'menu',
				title: 'Sub Menu #4 with long title',
				items: [
					{ type: 'link', to: '//wix.com', title: 'link #4_1' },
					{ type: 'link', to: '//wix.com', title: 'link #4_2' },
					{ type: 'link', to: '//wix.com', title: 'link #4_3' },
				],
			},
		];

		this.state = {
			items: initialItems,
		};
	}

	addQueryTeamToURLIfNeed = () => {
		const { query } = this.props;
		const selectedTeamFromParams = query.team;

		if ( selectedTeamFromParams ) {
			return `?team=${ selectedTeamFromParams }`;
		}
		return null;
	};

	selectMenu( items, link ) {
		items.forEach( item => {
			item.isActive = item === link;

			if ( item.items ) {
				this.selectMenu( item.items, link );
			}
		} );
	}

	onMenuSelected( e, link ) {
		e.preventDefault();
		const items = [ ...this.state.items ];
		this.selectMenu( items, link );
		this.setState( { items: items } );
	}

	renderLink( link ) {
		const { badge, badgeTooltip } = link;
		const badgeElement = badge && <SideMenu.NavigationBadge />;
		const badgeElementWithTooltip = badgeTooltip ? (
			<Tooltip moveBy={ { x: -23, y: 0 } } placement="right" alignment="center" content="Hi there!">
				{ badgeElement }
			</Tooltip>
		) : (
			badgeElement
		);
		return (
			<SideMenuDrill.Link
				key={ link.title }
				isActive={ itemLinkMatches( link.to, this.props.path ) }
				disabled={ link.disabled }
			>
				<a
					href={ link.to }
					onClick={ e => this.onMenuSelected( e, link ) }
					className={ classNames( styles.menu_link, {
						[ styles.menu_active ]: link.isActive,
					} ) }
				>
					{ link.title }
					{ badgeElementWithTooltip }
				</a>
			</SideMenuDrill.Link>
		);
	}

	renderMenu( menu ) {
		const showCategory = true; // menu.title !== 'Sub Menu #3';
		const { badge, badgeTooltip } = menu;
		const badgeElement = badge && <SideMenu.NavigationBadge />;
		const element = badgeTooltip ? (
			<Tooltip moveBy={ { x: -23, y: 0 } } placement="right" alignment="center" content="Hi there!">
				{ badgeElement }
			</Tooltip>
		) : (
			badgeElement
		);

		return (
			<SideMenuDrill.SubMenu
				key={ menu.title }
				menuKey={ menu.title }
				title={ menu.title }
				showCategory={ showCategory }
				badge={ element }
				disabled={ menu.disabled }
			>
				{ this.renderHeader() }
				<SideMenuDrill.Navigation>{ this.renderNavigation( menu.items ) }</SideMenuDrill.Navigation>
			</SideMenuDrill.SubMenu>
		);
	}

	renderDivider() {
		return <div style={ { margin: '20px 24px', borderBottom: '1px solid #434567' } } />;
	}

	renderMenuHeader( item ) {
		return <div className={ styles.menu_header }>{ item.value }</div>;
	}

	renderNavigation( items ) {
		return items.map( item => {
			if ( item.type === 'link' ) {
				return this.renderLink( item );
			}

			if ( item.type === 'divider' ) {
				return this.renderDivider();
			}

			if ( item.type === 'header' ) {
				return this.renderMenuHeader( item );
			}

			if ( item.type === 'menu' ) {
				return this.renderMenu( item );
			}

			return null;
		} );
	}

	addItem() {
		const newItem = {
			type: 'link',
			to: '//wix.com',
			title: `link #0_${ counter++ }`,
		};
		this.setState( {
			items: [ ...this.state.items, newItem ],
		} );
	}

	renderFooter() {
		return (
			<SideMenu.Footer>
				<SideMenu.FooterLink href="https://support.wix.com/" target="_blank" icon={ <HelpIcon /> }>
					Help Me!
				</SideMenu.FooterLink>

				<SideMenu.FooterTinyLink
					href="https://support.wix.com/en/article/wix-seo-wiz-suggestions-and-feedback"
					target="_blank"
					icon={
						<div style={ { marginTop: 2 } }>
							<ChatIcon />
						</div>
					}
					tooltip="Hey, come talk to me!"
					onClick={ () => console.log( 'clicked on tiny link yay!' ) }
				/>
			</SideMenu.Footer>
		);
	}

	renderHeader() {
		const title = 'Nhóm hiện tại';
		return (
			<SideMenu.Header>
				<div
					style={ {
						padding: '26px 30px',
						width: '100%',
						boxSizing: 'border-box',
					} }
				>
					<div style={ { display: 'flex' } }>
						<Heading appearance="H3" light ellipsis>
							{ title }
						</Heading>
						<ExternalLink />
					</div>
					<div style={ { marginTop: '5px', fontSize: '13px' } }>Role: Owner</div>
				</div>
			</SideMenu.Header>
		);
	}

	render() {
		const { items } = this.state;

		return (
			<div style={ { height: '100%', display: 'flex' } }>
				<div style={ { display: 'flex', flexGrow: 1 } }>
					<SideMenuDrill
						inFlex
						stickyFooter={ this.renderFooter() }
						dataHook="side-menu"
						className={ styles.sidebar_container }
					>
						{ this.renderHeader() }
						{ this.renderNavigation( items ) }
						<SideMenu.Promotion>
							<Button skin="premium" onClick={ () => console.log( 'Promotion button clicked!' ) }>
								Upgrade
							</Button>
						</SideMenu.Promotion>
					</SideMenuDrill>
				</div>
			</div>
		);
	}
}

export default connect( state => {
	return {
		selectedTeam: getSelectedTeam( state ),
	};
} )( Sidebar );
