import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import * as ColorHash from 'color-hash';
import Avatar from 'papo-components/Avatar';

import { toggleConversationSelection } from 'state/ui/conversation-list/actions';
import ConversationTime from 'blocks/conversation-time';
import Icon from 'components/icon2';
import WithTooltip from 'blocks/with-tooltip';
import { setLayoutFocus } from 'state/ui/layout-focus/actions';
import { getFacebookUser } from 'state/facebookusers/selectors';
import { getPage } from 'state/pages/selectors';
import { getAvatarURL } from 'lib/facebook/utils';

// import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

class ConversationItem extends React.PureComponent {
	// shouldComponentUpdate( nextProps ) {
	// 	const { conversation, selectedId } = nextProps;
	// 	return (
	// 		this.props.conversation.data.updated_time !== conversation.data.updated_time ||
	// 		this.props.snippet !== conversation.snippet ||
	// 		this.props.seen !== nextProps.seen ||
	// 		this.props.conversation.data.seen !== conversation.data.seen ||
	// 		this.props.tags !== nextProps.tags ||
	// 		selectedId === conversation.data.id ||
	// 		this.props.selectedId === this.props.conversation.data.id ||
	// 		this.props.conversation.data.snippet !== conversation.data.snippet ||
	// 		this.props.conversation.data.unread_count !== conversation.data.unread_count ||
	// 		this.props.conversation.data.snippet !== conversation.data.snippet
	// 	);
	// }

	onChangeSelected = event => {
		const { conversation } = this.props;
		if ( ! conversation ) return;

		if ( conversation.selected === true ) return;

		if ( this.props.onChangeSelected ) {
			this.props.onChangeSelected( this.props.conversation );
		}
		event.stopPropagation();
		this.props.setLayoutFocus( 'content' );
	};

	renderTagWithTooltip = tag => {
		if ( ! tag ) return null;
		return (
			<Icon
				key={ tag.id }
				type="circle-fill"
				className={ styles.tag_icon }
				style={ { color: tag.color } }
			/>
		);
	};

	renderTagIem = tag => {
		if ( ! tag ) return null;

		return (
			<WithTooltip
				key={ tag.id }
				tooltip={ tag.name }
				contentRenderer={ this.renderTagWithTooltip( tag ) }
			/>
		);
	};

	render() {
		const { conversation, page, from, isMultipleMode, seen } = this.props;
		if ( ! conversation ) return null;

		const colorHash = new ColorHash();
		const pageColor = colorHash.hex( conversation.page_id );

		const rootClasses = classnames( styles.conversation_item, {
			[ styles.is_selected ]: this.props.selected,
			[ styles.unseen ]: seen !== true,
			[ styles.multiple_mode ]: isMultipleMode,
		} );

		const typeIconClasses = classnames(
			'ts_icon',
			'ts_icon_facebook_messenger',
			styles.type__message_icon
		);

		const avatarURL =
			page && page.data ? getAvatarURL( conversation.from, 50, page.data.access_token ) : null;

		const nameClasses = classnames( styles.conversation_item__title_link, {
			[ styles.placeholder ]: ! from,
		} );

		return (
			<div
				key={ this.props.key }
				className={ rootClasses }
				ref={ this.setDomNode }
				style={ { borderColor: pageColor } }
			>
				<div
					role="presentation"
					className={ styles.conversation_item__panel }
					onClick={ this.onChangeSelected }
				>
					<div className={ styles.conversation_list__conversation_thumbnail_wrapper }>
						<Avatar
							size="size36"
							color="grey"
							imgProps={ { src: avatarURL, className: styles.img } }
							name={ from ? from.name : null }
							className={ styles.img_container }
						/>
						{ conversation.type === 'message' && (
							<div className={ styles.type__message }>
								<span className={ typeIconClasses } />
							</div>
						) }
					</div>
					<div className={ styles.conversation_item__detail }>
						<div className={ styles.conversation_item__header }>
							<div className={ styles.conversation_item__customer_name }>
								<h1 className={ styles.conversation_item__title }>
									<span className={ nameClasses }>{ from ? from.name : 'loading...' }</span>
								</h1>
							</div>
							<div className={ styles.conversation_item__time }>
								<ConversationTime time={ conversation.updated_time } />
							</div>
						</div>
						<div className={ styles.conversation_item__meta }>
							<span className={ styles.conversation_item__meta_time_status }>
								<span className={ styles.conversation_snippet }>
									{ conversation.replied && <Icon type="angle_arrow_up_left" /> }

									<span>{ conversation.snippet || 'Lỗi snippet...' }</span>
								</span>
								{ this.props.tags &&
									this.props.tags.length > 0 &&
									this.props.tags.map( this.renderTagIem ) }
								{ /*
									<span className={ styles.has__phone_number }>
									<svg
										className={ styles.has__phone_icon }
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 50 50"
										width="16px"
										height="16px"
									>
										<path d="M25,2C12.318,2,2,12.318,2,25c0,3.96,1.023,7.854,2.963,11.29L2.037,46.73c-0.096,0.343-0.003,0.711,0.245,0.966 C2.473,47.893,2.733,48,3,48c0.08,0,0.161-0.01,0.24-0.029l10.896-2.699C17.463,47.058,21.21,48,25,48c12.682,0,23-10.318,23-23 S37.682,2,25,2z M36.57,33.116c-0.492,1.362-2.852,2.605-3.986,2.772c-1.018,0.149-2.306,0.213-3.72-0.231 c-0.857-0.27-1.957-0.628-3.366-1.229c-5.923-2.526-9.791-8.415-10.087-8.804C15.116,25.235,13,22.463,13,19.594 s1.525-4.28,2.067-4.864c0.542-0.584,1.181-0.73,1.575-0.73s0.787,0.005,1.132,0.021c0.363,0.018,0.85-0.137,1.329,1.001 c0.492,1.168,1.673,4.037,1.819,4.33c0.148,0.292,0.246,0.633,0.05,1.022c-0.196,0.389-0.294,0.632-0.59,0.973 s-0.62,0.76-0.886,1.022c-0.296,0.291-0.603,0.606-0.259,1.19c0.344,0.584,1.529,2.493,3.285,4.039 c2.255,1.986,4.158,2.602,4.748,2.894c0.59,0.292,0.935,0.243,1.279-0.146c0.344-0.39,1.476-1.703,1.869-2.286 s0.787-0.487,1.329-0.292c0.542,0.194,3.445,1.604,4.035,1.896c0.59,0.292,0.984,0.438,1.132,0.681 C37.062,30.587,37.062,31.755,36.57,33.116z" />
									</svg>
								</span>
									 */ }
								{ ! conversation.seen && conversation.unread_count > 0 && (
									<span className={ styles.unread__count }>
										{ conversation.unread_count < 10 && conversation.unread_count }
										{ conversation.unread_count >= 10 && (
											<span>
												<span>9</span>
												<span>+</span>
											</span>
										) }
									</span>
								) }
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ConversationItem.propTypes = {
	translate: PropTypes.func,
	conversation: PropTypes.object,
	className: PropTypes.string,
};

export default connect(
	( state, { conversation } ) => {
		return {
			tags: conversation ? conversation.tags : null,
			seen: conversation ? conversation.seen : null,
			snippet: conversation ? conversation.snippet : null,
			from: conversation ? getFacebookUser( state, conversation.from ) : null,
			page: conversation ? getPage( state, conversation.page_id ) : null,
		};
	},
	{
		toggleConversationSelection,
		setLayoutFocus,
	}
)( ConversationItem );
