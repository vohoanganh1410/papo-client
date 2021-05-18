import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, times } from 'lodash';

import AudioPlayer from 'blocks/simple-audio-player';
import VideoPlayer from 'blocks/simple-video-player';
import FocusManager from 'components/focus-manager';
import WithTooltip from 'blocks/with-tooltip';
import Icon from 'components/icon2';
import UnstyledButton from 'components/button2/unstyled-button';
import MessageActions from './message-actions';
import Attachments from './attachments';
import MessageAttachmentImage from './message-attachment-image';
import CommentAttachmentImage from './comment-attachment-image';
import { deletePendingMessage } from 'state/conversations/actions';
import { getFacebookUser } from 'state/facebookusers/selectors';
import {
	getFacebookMessageAttachmens,
	getFacebookCommentAttachment,
} from 'state/attachments/selectors';
import TimeItem from './time-item';
import g_styles from 'components/general-styles.scss';
import styles from './style.scss';
import Image from './attachment-item';

class Message extends React.PureComponent {
	static displayName = 'Message';
	static propTypes = {
		fromPage: PropTypes.bool,
		isHovered: PropTypes.bool,
		message: PropTypes.object,
		onClickImage: PropTypes.func,
		readWatermark: PropTypes.number,
	};

	constructor( props ) {
		super( props );

		this.state = {
			isHovered: props.isHovered,
			sent: props.message && props.message.sent,
			delivered: props.message && props.message.delivered,
			pending: props.message && ! props.message.sent && ! props.message.delivered,
		};

		this.setRef = this.setRef.bind( this );
		this.onFocusEnter = this.onFocusEnter.bind( this );
		this.onFocusLeave = this.onFocusLeave.bind( this );
		this.onFocusEnter = this.onFocusEnter.bind( this );
		this.onFocusLeave = this.onFocusLeave.bind( this );
		this.onMouseEnter = this.onMouseEnter.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );

		this.messageRef = null;
	}

	componentWillReceiveProps( nextProps ) {
		this.setState( {
			isHovered: nextProps.isHovered,
		} );

		if ( nextProps.message && nextProps.message.sent ) {
			this.setState( {
				sent: true,
			} );
		}

		if ( nextProps.message && nextProps.message.delivered ) {
			this.setState( {
				delivered: true,
			} );
		}
	}

	onFocusEnter( t ) {
		const a = t.relatedEvent;
		a &&
			'keydown' === a.type &&
			this.setState( function() {
				return {
					hasKeyboardFocus: true,
				};
			} );
	}

	onFocusLeave() {
		this.setState( function() {
			return {
				hasKeyboardFocus: false,
			};
		} );
	}

	onMouseEnter() {
		this.setState( function() {
			return {
				isHovered: true,
			};
		} );
	}

	onMouseLeave() {
		this.setState( function() {
			return {
				isHovered: false,
			};
		} );
	}

	setRef( t ) {
		this.messageRef = t;
	}

	handleImageClick = media => {
		const { message } = this.props;
		if ( this.props.onClickImage ) {
			this.props.onClickImage( media, message.from );
		}
	};

	handleShowFullImage = url => {
		const { from } = this.props;
		if ( this.props.onClickImage ) {
			this.props.onClickImage( url, from );
		}
	};

	renderActions = () => {
		const { message } = this.props;
		return <MessageActions message={ message } type={ message.type } />;
	};

	handleDeletePendingMessage = () => {
		const { message } = this.props;
		this.props.deletePendingMessage( message );
	};

	renderSendingErrorContent = () => {
		return (
			<div className={ styles.pendding_spinner }>
				<UnstyledButton onClick={ this.handleDeletePendingMessage }>
					<Icon type="trash" />
				</UnstyledButton>
			</div>
		);
	};

	renderSendingError = error => {
		if ( ! error || ! error.message ) return null;
		return (
			<WithTooltip
				tooltip={ error.message }
				contentRenderer={ this.renderSendingErrorContent( error ) }
			/>
		);
	};

	renderHoveredContent = () => {
		const { message, fromPage } = this.props;

		if ( ! fromPage ) {
			return (
				<div
					className={
						styles.message_meta +
						' ' +
						( fromPage ? styles.is_from_page_meta : styles.is_from_customer_meta )
					}
				>
					{ message.type === 'comment' && this.renderActions() }
					<TimeItem time={ message.created_time } style={ { marginRight: 10 } } />
				</div>
			);
		}

		return (
			<div
				className={
					styles.message_meta +
					' ' +
					( fromPage ? styles.is_from_page_meta : styles.is_from_customer_meta )
				}
			>
				{ message.user_id && <span>{ message.user_id }</span> }
				<TimeItem time={ message.created_time } style={ { marginRight: 10 } } />
				{ message.type === 'comment' && this.renderActions() }
			</div>
		);
	};

	renderAttachmentItem = item => {
		if ( item && item.mime_type && item.mime_type.includes( 'image' ) ) {
			return (
				<MessageAttachmentImage
					id={ item.id }
					attachment={ item }
					onShowFullImage={ this.handleShowFullImage }
				/>
			);
		}

		if ( item && item.mime_type && item.mime_type.includes( 'video' ) ) {
			if ( ! item.video_data ) {
				return null;
			}

			return (
				<VideoPlayer
					url={ item.video_data.url }
					poster={ item.video_data.preview_url }
					style={ { width: '100%', height: '100%' } }
					// width={ item.video_data.width }
					height={ 240 }
				/>
			);
		}

		if ( item && item.mime_type && item.mime_type.includes( 'audio' ) ) {
			return <AudioPlayer url={ item.file_url } name={ item.name } />;
		}

		if ( item && item.mime_type && item.mime_type.includes( 'text' ) ) {
			return (
				<a href={ item.file_url } target="_blank" rel="noopener nofollow">
					<Icon type="download" />
					<span className={ g_styles.pl_10 }>{ item.name }</span>
				</a>
			);
		}

		if ( item && item.mime_type && item.mime_type.includes( 'file' ) ) {
			return (
				<a href={ item.file_url } target="_blank" rel="noopener nofollow">
					<Icon type="download" />
					<span className={ g_styles.pl_10 }>{ item.name }</span>
				</a>
			);
		}

		return <span>Unknown attachment type</span>;
	};

	renderMessageAttachment = () => {
		const { message, messageAttachments } = this.props;

		// console.log("attachments", attachments);

		if (
			message.attachments_count > 0 &&
			( ! messageAttachments || messageAttachments.length === 0 )
		) {
			return times( message.attachments_count, i => {
				return <MessageAttachmentImage id={ i } />;
			} );
		}

		if ( messageAttachments && messageAttachments.length > 0 ) {
			return messageAttachments.map( item => {
				return this.renderAttachmentItem( item );
			} );
		}
	};

	renderCommentAttachment = () => {
		const { commentAttachment } = this.props;

		if ( ! commentAttachment ) {
			return <CommentAttachmentImage id={ 'attachment' } />;
		}

		return (
			<CommentAttachmentImage
				id={ 'attachment' }
				attachment={ commentAttachment }
				onShowFullImage={ this.handleShowFullImage }
			/>
		);
	};

	render() {
		const { message, fromPage, readWatermark, isSending, sendingError } = this.props;

		const { sent, delivered, pending } = this.state;

		const isMessage = message.type === 'message';
		const isComment = message.type === 'comment';

		const rootMessageClasses = classNames( styles.timeline_item, {
			[ styles.me ]: fromPage,
			[ styles.is_pendding ]: isSending,
		} );

		const messageTime = new Date( message.created_time ).getTime();

		const shouldRenderPendingIndicator = isMessage && fromPage && pending;

		const shouldRenderDeliveredIndicator =
			isMessage &&
			fromPage &&
			( delivered && ( readWatermark > 0 && messageTime > readWatermark ) );

		const shouldRenderSentIndicator =
			isMessage &&
			fromPage &&
			sent &&
			( readWatermark > 0 && messageTime > readWatermark ) &&
			! shouldRenderDeliveredIndicator;

		const shouldRenderAttachments =
			( message.attachment_ids || message.attachment_target_ids || message.file_ids ) &&
			! ( message.delete_at > 0 ) &&
			message.type === 'comment' &&
			message.attachment_type !== 'sticker';

		return (
			<FocusManager onFocusEnter={ this.onFocusEnter } onFocusLeave={ this.onFocusLeave }>
				<div
					className={ styles.timeline }
					ref={ this.setRef }
					onMouseEnter={ this.onMouseEnter }
					onMouseLeave={ this.onMouseLeave }
					onMouseOver={ this.onMouseEnter }
				>
					<div className={ rootMessageClasses } key={ message.id }>
						<div
							className={ classNames( styles.item__content, {
								[ styles.sending_error ]: sendingError,
								[ styles.is_attachments ]: ! message.message || message.message.length === 0,
							} ) }
						>
							<div>
								<div className={ styles.group__item }>
									{ message.message && message.message.length > 0 && (
										<div className={ styles.message__text }>
											<div className={ g_styles.zoom_1 }>
												<span>{ message.message }</span>
											</div>
										</div>
									) }
									{ shouldRenderAttachments && (
										<div className={ styles.attachments }> 
											<Attachments
												type={ message.attachment_type }
												attachmentIds={ message.attachment_ids }
												attachmentTargetIds={ message.attachment_target_ids }
												fileIds={ message.file_ids }
												onShowFullImage={ this.handleShowFullImage }
											/>
										</div>
									) }
									{ isMessage && message.has_attachments && (
										<div className={ styles.attachments }>{ this.renderMessageAttachment() }</div>
									) }
									{ message.sticker && (
										<div className={ styles.message_sticker }>
											<img alt={ 'sticker' } src={ message.sticker } style={ { height: 75 } } />
										</div>
									) }
									{ isComment && message.has_attachments && (
										<div className={ styles.attachments }>{ this.renderCommentAttachment() }</div>
									) }
								</div>
								{ sendingError && this.renderSendingError( sendingError ) }
								{ /*this.state.isHovered && */ this.renderHoveredContent() }
							</div>
							{ shouldRenderDeliveredIndicator && (
								<span>
									<span className={ styles.message_delivered_indicator } title={ 'Đã chuyển' } />
								</span>
							) }
							{ shouldRenderSentIndicator && (
								<span className={ styles.message_sent_indicator } title={ 'Đã gửi' } />
							) }
							{ shouldRenderPendingIndicator && (
								<span className={ styles.message_pending_indicator } />
							) }
						</div>
					</div>
				</div>
			</FocusManager>
		);
	}
}

export default connect(
	( state, { message } ) => {
		return {
			isSending: message && message.pending_message_id && ! message.sent && ! message.error,
			sendingError: message && message.error && message.error_detail,
			from: message ? getFacebookUser( state, message.from ) : null,
			messageAttachments:
				message && message.type === 'message' && message.has_attachments
					? getFacebookMessageAttachmens( state, message.id )
					: null,
			commentAttachment:
				message && message.type === 'comment' && message.has_attachments && message.comment_id
					? getFacebookCommentAttachment( state, message.comment_id )
					: null,
		};
	},
	{
		deletePendingMessage,
	}
)( Message );
