import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PopoverMenuItem from 'papo-components/PopoverMenuItem';
import Tooltip from 'papo-components/Tooltip';

import Icon from 'components/icon2';
import LogoutButton from 'blocks/logout-button';
import Avatar from 'papo-components/Avatar';
import { getAvatarURL } from 'lib/facebook/utils';
import { getCurrentUser } from 'state/current-user/selectors';
import { getSelectedPageId } from 'state/ui/selectors';
import { getPage, getPages } from 'state/pages/selectors';
import { getSelectedPageIdsPreference } from 'state/preferences/selectors';
import UnstyledButton from 'components/button2/unstyled-button';
import styles from './style.scss';
import general_styles from 'components/general-styles.scss';

class ConversationFilter extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.trigger = React.createRef();
		this.state = {
			shown: false,
		};
	}

	renderFilterItem = item => {
		return (
			<li
				data-id={ item.id }
				role="button"
				className={ classNames( 'filter__item', general_styles.menu_dropdown_item ) }
				key={ item.id }
				onClick={ this.handleFilterItemClick }
			>
				<div className={ classNames( 'item__detail', general_styles.d_flex ) }>
					<div className="icon" style={ { marginRight: 6 } }>
						<Icon type={ item.icon } />
					</div>
					<div className={ styles.item_text }>{ item.name }</div>
				</div>
			</li>
		);
	};

	handleFilterItemClick = e => {
		this.tooltip && this.tooltip.hide();
		// console.log( e.currentTarget.dataset );
		const willFilter = e.currentTarget.dataset;
		if ( willFilter && willFilter.id.length > 0 ) {
			alert( willFilter.id );
		}
	};

	renderFilterMenu = () => {
		const filterItems = [
			{
				id: 'unread',
				name: 'Lọc các hội thoại chưa xem',
				icon: 'eye_filled',
			},
			{
				id: 'unreplied',
				name: 'Hội thoại chưa được trả lời',
				icon: 'missing_emoji',
			},
			{
				id: 'comment',
				name: 'Lọc bình luận',
				icon: 'comment_alt',
			},
			{
				id: 'inbox',
				name: 'Lọc tin nhắn',
				icon: 'facebook_messenger',
			},
			{
				id: 'label',
				name: 'Lọc hội thoại theo nhãn',
				icon: 'circle_fill',
			},
			{
				id: 'date',
				name: 'Lọc theo ngày tạo',
				icon: 'calendar',
			},
			{
				id: 'star',
				name: 'Hội thoại được gắn sao',
				icon: 'star_o',
			},
		];

		return (
			<ul className={ classNames( 'menu_list', general_styles.ul_no_style ) }>
				{ filterItems.map( this.renderFilterItem ) }
			</ul>
		);
	};

	handleSwitchPages = () => {
		this.tooltip && this.tooltip.hide();
		this.props.onShowSwitchPages();
	};

	renderDropdownContent = () => {
		const { user } = this.props;
		const avatarURL = getAvatarURL( user.auth_data, 50 );
		const user_display_name = user.first_name + ' ' + user.last_name;

		return (
			<div style={ { padding: '15px 0' } }>
				<div style={ { display: 'flex', padding: 0 } }>
					<h2 className="slack_menu_header">
						<Avatar
							size="size36"
							color="grey"
							imgProps={ { src: avatarURL } }
							name={ user_display_name }
							className="member_preview_link member_image thumb_36"
						/>
						<span className="current_user_name slack_menu_header_primary overflow_ellipsis">
							{ user_display_name }
						</span>
						<span className="current_user_preferred_name slack_menu_header_secondary overflow_ellipsis">
							{ user_display_name }
						</span>
					</h2>
					<div style={ { display: 'flex', alignItems: 'center', padding: '0 15px' } }>
						<LogoutButton />
					</div>
				</div>
				<PopoverMenuItem divider />
				{ this.renderFilterMenu() }
				<PopoverMenuItem divider />
				<PopoverMenuItem
					icon={ <Icon type="facebook" /> }
					text={ 'Chuyển trang (Ctrl+K)' }
					onClick={ this.handleSwitchPages }
				/>
			</div>
		);
	};

	renderAvatar = ( id, width, height, index, customClass ) => {
		if ( index > 2 ) {
			return null;
		}

		const avatarURL = '//graph.facebook.com/' + id + '/picture?width=50&height=50';

		const classes = classNames( styles.fit_cover, customClass, {
			[ styles.avatar_1 ]: index === 1,
			[ styles.avatar_2 ]: index === 2,
		} );

		return (
			<img
				alt={ id }
				title={ 'id' || 'Error' }
				className={ classes }
				src={ avatarURL }
				width={ width }
				height={ height }
			/>
		);
	};
	renderTwoAvatars = ids => {
		if ( ids.length < 2 ) {
			return null;
		}
		return (
			<div style={ { display: 'flex', alignItems: 'center' } }>
				<div style={ { width: '50px', height: '50px' } }>
					{ this.renderAvatar( ids[ 0 ], 50, 50, 0, styles.thin_border_right + ' ' + styles.w50 ) }
				</div>
				<div style={ { width: '50px', height: '50px' } }>
					{ this.renderAvatar( ids[ 1 ], 50, 50, 1, styles.w50 ) }
				</div>
			</div>
		);
	};

	renderThreeAvatars = ids => {
		if ( ids.length < 3 ) {
			return null;
		}
		return (
			<div style={ { width: '50px', height: '50px' } }>
				<div>
					<div
						className={ styles.float_left + ' ' + styles.thin_border_right }
						style={ { width: '33px' } }
					>
						{ this.renderAvatar( ids[ 0 ], 50, 50, 0, styles.w50 ) }
					</div>
					<div
						className={ styles.float_left + ' ' + styles.thin_border_bottom }
						style={ { width: '17px', height: '25px' } }
					>
						{ this.renderAvatar( ids[ 1 ], 25, 25, 1, styles.w25 ) }
					</div>
					<div className={ styles.float_left } style={ { width: '17px', height: '25px' } }>
						{ this.renderAvatar( ids[ 2 ], 25, 25, 2, styles.w25 ) }
					</div>
				</div>
			</div>
		);
	};

	renderPageAvatars = () => {
		const { selectedPage, selectedPageIds } = this.props;
		if ( ! selectedPage && ! selectedPageIds ) return null;

		if ( selectedPage ) {
			const avatarURL =
				'//graph.facebook.com/' + selectedPage.data.page_id + '/picture?width=100&height=100';
			return (
				<div style={ { width: 50, height: 50 } }>
					<img
						alt={ selectedPage.data.name }
						title={ selectedPage.data.name || 'Error' }
						className={ styles.avatar_container }
						src={ avatarURL }
						width={ 50 }
						height={ 50 }
					/>
				</div>
			);
		} else if ( selectedPageIds.split( ',' ).length > 0 ) {
			const ids = selectedPageIds.split( ',' );

			if ( ids.length === 2 ) {
				return this.renderTwoAvatars( ids );
			}

			return this.renderThreeAvatars( ids );
		}
	};

	renderContent = () => {
		const { currentUser, selectedPage, selectedPageIds } = this.props;
		const user_display_name = currentUser.first_name + ' ' + currentUser.last_name;
		const page_display_name = selectedPage
			? selectedPage.data.name
			: selectedPageIds
			? `Chế độ gộp trang (${ selectedPageIds.split( ',' ).length } trang)`
			: '?';

		return (
			<div ref="filerbutton" style={ { maxHeight: '400px' } }>
				<div className={ styles.team_menu } role="navigation">
					<div className={ classNames( general_styles.d_flex, general_styles.v_center ) }>
						<div className={ styles.position_relative } style={ { width: '50px', height: '50px' } }>
							<div className={ styles.round_flex } style={ { width: '50px', height: '50px' } }>
								{ this.renderPageAvatars() }
							</div>
						</div>
					</div>
					<div
						className={ classNames(
							general_styles.full_width_and_height,
							general_styles.d_flex,
							general_styles.flex_column
						) }
						style={ { paddingLeft: '4px' } }
					>
						<div className={ styles.team_name_container }>
							<span className={ classNames( styles.team_name, general_styles.overflow_ellipsis ) }>
								{ page_display_name }
							</span>
						</div>
						<div className={ styles.team_menu_user }>
							{ /*<div className={ classNames(styles.presence_container, general_styles.no_wrap, general_styles.ts_tip ) }>
								<i className="presence ts_icon ts_icon_presence active" style={ { opacity: 0.98 } }/>
								<span className="ts_tip_tip">Trực tuyến</span>
							</div>*/ }
							<span className={ styles.team_menu_user_details }>
								<span
									className={ classNames(
										styles.team_menu_user_name,
										general_styles.overflow_ellipsis,
										styles.current_user_name
									) }
								>
									{ user_display_name }
								</span>
							</span>
						</div>
					</div>
					<div className={ styles.notifications_menu_btn_react }>
						<UnstyledButton>
							<Icon type="vertical_ellipsis" />
						</UnstyledButton>
					</div>
				</div>
			</div>
		);
	};

	// render() {
	// 	if ( ! this.props.currentUser ) {
	// 		return null;
	// 	}
	// 	return (
	// 		<WithDropdown
	// 			className={ this.props.className }
	// 			style={ this.props.style }
	// 			contentRenderer={ this.renderContent }
	// 			dropdownRenderer={ this.renderDropdownContent }
	// 			dropdownPosition={ 'bottom' }
	// 		/>
	// 	);
	// }

	setTooltipRef = r => {
		this.tooltip = r;
	};

	render() {
		return (
			<Tooltip
				ref={ this.setTooltipRef }
				content={ this.renderDropdownContent() }
				shouldCloseOnClickOutside
				showImmediately
				showArrow={ false }
				theme="dark"
				placement="bottom"
				maxWidth={ 350 }
				moveBy={ {
					x: 0,
					y: 0,
				} }
				popover
			>
				{ this.renderContent() }
			</Tooltip>
		);

		// return (
		// 	<Popover
		// 		shown={ this.state.shown }
		// 		appendTo="window"
		// 		flip
		// 		shouldCloseOnClickOutside
		// 		placement="bottom-start"
		// 		onClick={ () => {
		// 			this.setState({
		// 				shown: !this.state.shown,
		// 			})
		// 		} }
		// 	>
		// 		<Popover.Element>
		// 			{ this.renderContent() }
		// 		</Popover.Element>
		// 		<Popover.Content>
		// 			{ this.renderDropdownContent() }
		// 		</Popover.Content>
		// 	</Popover>
		// )
		// return (
		// 	<MenuWrapper>
		// 		{ this.renderContent() }
		// 		{ this.renderDropdownContent() }
		// 	</MenuWrapper>
		// );
	}
}

export default connect( state => {
	const selectedPageId = getSelectedPageId( state );
	const selectedPage = selectedPageId ? getPage( state, selectedPageId ) : null;

	return {
		currentUser: getCurrentUser( state ),
		selectedPageId,
		selectedPage,
		selectedPageIds: getSelectedPageIdsPreference( state ),
		availablePages: getPages( state ),
	};
} )( ConversationFilter );
