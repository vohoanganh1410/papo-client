import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Avatar from 'papo-components/Avatar';
import WithTooltip from 'blocks/with-tooltip';
import ClickToCopyText from 'components/click-to-copy-text';
import ConversationActionButton from 'conversations/action-button';
import Searchbox from 'components/searchbox';
import { getPage } from 'state/pages/selectors';
import { getSelectedPageId } from 'state/ui/selectors';
import Icon from 'components/icon2';
import g_styles from 'components/general-styles.scss';
import styles from './style.scss';
import UnstyledButton from 'components/button2/unstyled-button';
import { getFacebookUser } from 'state/facebookusers/selectors';
import { getAvatarURL } from 'lib/facebook/utils';

class ConversationHeader extends React.Component {
	static propTypes = {
		conversation: PropTypes.object,
	};

	constructor( props ) {
		super( props );
		this.handleToggleTag = this.handleToggleTag.bind( this );

		this.state = {
			actions: [
				{
					name: 'info',
					description: 'Thông tin bổ sung',
					icon: 'info',
				},
				{
					name: 'mark__unread',
					description: 'Đánh dấu chưa xem',
					icon: 'eye-filled',
				},
				{
					name: 'star',
					description: 'Gắn sao',
					icon: 'star_o',
				},
				{
					name: 'block',
					description: 'Chặn khách hàng',
					icon: 'disable',
				},
			],
		};
	}

	renderConversationTag = tag => {
		return (
			<ConversationActionButton
				key={ tag.name }
				name={ tag.name }
				data-id={ tag.name }
				description={ tag.description }
				onClick={ this.handleToggleTag }
				icon={ tag.icon }
				actived={ this.props.showInfo && tag.name === 'info' }
			/>
		);
	};

	handleToggleTag = e => {
		this.state.actions.map( tag => {
			if ( tag.name === e.currentTarget.dataset.id ) {
				tag.actived = ! tag.actived;
			} else {
				tag.actived = false;
			}
		} );
		this.setState( {
			actions: this.state.actions,
		} );
		this.props.onToggle( e.currentTarget.dataset.id );
	};

	renderInfoItem = ( { icon, content } ) => {
		return (
			<div className={ styles.conversation_header_info_item }>
				<UnstyledButton className={ classNames( g_styles.d_flex, g_styles.v_center ) }>
					<Icon className={ styles.info_icon } type={ icon } />
					{ content }
				</UnstyledButton>
			</div>
		);
	};

	renderInfo = () => {
		const { conversation } = this.props;

		return (
			<div className={ classNames( styles.info, g_styles.d_flex, g_styles.v_center ) }>
				{
					<WithTooltip
						contentRenderer={ this.renderInfoItem( {
							icon: 'message_notification',
							content: '45',
						} ) }
						tooltip="Tin nhắn đã gửi từ khách hàng"
						tooltipPosition="bottom"
					/>
				}
				{
					<WithTooltip
						contentRenderer={ this.renderInfoItem( { icon: 'compose_dm', content: '5' } ) }
						tooltip="Số ghi chú từ trang"
						tooltipPosition="bottom"
					/>
				}
				{
					<WithTooltip
						contentRenderer={ this.renderInfoItem( { icon: 'bolt', content: '22:25' } ) }
						tooltip="Tin nhắn mới nhất"
						tooltipPosition="bottom"
					/>
				}
				{ conversation.data && conversation.data.last_seen_by.length > 0 && (
					<WithTooltip
						contentRenderer={ this.renderInfoItem( {
							icon: 'eye',
							content: '22:25 Nguyễn Văn Đức',
						} ) }
						tooltip="Xem lần cuối"
						tooltipPosition="bottom"
					/>
				) }
			</div>
		);
	};

	render() {
		const { currentPage, conversation, user } = this.props;

		const avatarURL =
			currentPage && currentPage.data
				? getAvatarURL( conversation.from, 50, currentPage.data.access_token )
				: null;

		const demoTags = [
			{
				name: 'analystics',
				description: 'Thống kê (Ctrl+SPACE)',
				icon: 'slow_network',
			},
			{
				name: 'settings',
				description: 'Thiết lập',
				icon: 'cog_o',
			},
			{
				name: 'help',
				icon: 'question_circle',
			},
		];

		return (
			<div className={ styles.conversation_header }>
				<div className="conversation-header__panel">
					{ conversation && (
						<div className={ styles.from__zone }>
							<Avatar
								size="size36"
								color="grey"
								imgProps={ { src: avatarURL } }
								name={ user ? user.last_name : null }
							/>
							<div className={ styles.ex__info }>
								<div
									className={ classNames( styles.from, g_styles.d_flex, g_styles.v_center ) }
									style={ { height: 24 } }
								>
									<ClickToCopyText className={ styles.black_and_bold } text={ user.name } />
									<div className={ styles.from_title_meta }>
										<Icon type={ 'caret_right' } />
										<span>{ currentPage && currentPage.data.name }</span>
									</div>
								</div>
								{ this.renderInfo() }
							</div>
						</div>
					) }
				</div>

				{ conversation && (
					<div className={ classNames( styles.conversation__actions, g_styles.pr_15 ) }>
						{ this.state.actions.map( this.renderConversationTag ) }
					</div>
				) }
				<Searchbox
					className={ styles.search_container }
					placeholder="Tìm kiếm"
					onFocus={ this.props.onFocusSearch }
					close={ this.props.close }
				/>
				<div className={ classNames( styles.conversation__actions ) }>
					{ demoTags.map( this.renderConversationTag ) }
				</div>
			</div>
		);
	}
}

export default connect(
	( state, { conversation } ) => {
		const selectedPageId = getSelectedPageId( state );
		const page = selectedPageId ? getPage( state, selectedPageId ) : null;
		return {
			page,
			currentPage: conversation ? getPage( state, conversation.page_id ) : null,
			user: conversation ? getFacebookUser( state, conversation.from ) : null,
		};
	},
	{}
)( ConversationHeader );
