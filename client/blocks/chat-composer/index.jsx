import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { defineMessages, intlShape } from 'react-intl';
import AutoSizer from 'react-virtualized-auto-sizer';
import PopoverMenuItem from 'papo-components/PopoverMenuItem';
import Tooltip from 'papo-components/Tooltip';

import Snippets from './snippets';
import Icon from 'components/icon2';
import FocusManager from 'components/focus-manager';
import MediaButton from './media-button';
import { sendMessage } from 'state/conversation/actions';
import Composer from './composer';
import * as UserAgent from 'lib/user-agent';
import * as Utils from 'lib/utils';
import { Constants } from 'lib/key-codes';
import { postMessageOnKeyPress } from './utils';
import Tags from './tags';
import MediaBrowserDialog from 'conversations/media-browser/dialog';
import MediaLibrarySelectedStore from 'lib/media/library-selected-store';
import NotificationBar from './notification-bar';

import { getPageReplySnipests } from 'actions/snippet-actions';
import {
	getPage,
	isPageSnippetsLoaded,
	isPageTagsLoaded,
	getPageTags,
	getPageSnippets,
} from 'state/pages/selectors';
import { loadPageTags } from 'actions/page';
import { onPreventSendMessage } from 'state/ui/composer/actions';
import { updateComposerSuggestionDisplay } from 'actions/preference';
import { shouldDisplaySuggestionBox } from 'state/preferences/selectors';
import { receiveFilesUpload } from 'actions/file';

import GlobalEventEmitter from 'utils/global-event-emitter';
import EventTypes from 'utils/event-types';

import userFactory from 'lib/user';
import styles from './style.scss';
import Emoji from './emoji';
import general_styles from 'components/general-styles.scss';

const user = userFactory();
const KeyCodes = Constants.KeyCodes;

/*
 * Renders a textarea to be used to composer a message for the chat.
 */
class ChatComposer extends Component {
	static displayName = 'Composer';
	static propTypes = {
		disabled: PropTypes.bool,
		message: PropTypes.string,
		onFocus: PropTypes.func,
		onSendMessage: PropTypes.func,
		onSendTyping: PropTypes.func,
		onSendNotTyping: PropTypes.func,
		onSetCurrentMessage: PropTypes.func,
		translate: PropTypes.func, // localize HOC
		pageId: PropTypes.string,
	};

	static contextTypes = {
		intl: intlShape,
	};

	constructor( props ) {
		super( props );

		this.state = {
			message: '',
			showMediaBrowser: false,
			user: user.get(),
			selectedImages: null,
			shouldShowSuggestionBox: props.shouldDisplaySuggestionBox,
			isShowSnippetsDialog: false,
		};

		this.lastBlurAt = 0;
		this.draftsForConversation = {};
	}

	componentWillMount() {
		const { selectedConversation } = this.props;
		if ( selectedConversation ) {
			this.props.getPageReplySnipests( selectedConversation.page_id );
			this.props.loadPageTags( selectedConversation.page_id );
		}
	}

	componentDidMount() {
		// this.focusTextbox();
		document.addEventListener( 'keydown', this.documentKeyHandler );
		GlobalEventEmitter.addListener(
			EventTypes.PENDING_MESSAGE_SUBMITED,
			this.handleSubmitPenddingSuccess
		);

		GlobalEventEmitter.addListener(
			EventTypes.CONVERSATION_MESSAGES_LOADED,
			this.handleSuccessLoaded
		);
	}

	componentDidUpdate( prevProps ) {
		//this.focusTextbox();
	}

	componentWillUnmount() {
		document.removeEventListener( 'keydown', this.documentKeyHandler );
		GlobalEventEmitter.removeListener(
			EventTypes.PENDING_MESSAGE_SUBMITED,
			this.handleSubmitPenddingSuccess
		);
		GlobalEventEmitter.removeListener(
			EventTypes.CONVERSATION_MESSAGES_LOADED,
			this.handleSuccessLoaded
		);
	}

	componentWillReceiveProps( nextProps ) {
		// eslint-disable-line camelcase
		const { globalState } = this.props;

		if (
			nextProps.selectedConversation &&
			this.props.selectedConversation &&
			nextProps.selectedConversation.page_id !== this.props.selectedConversation.page_id
		) {
			const _isLoaded = isPageSnippetsLoaded( globalState, nextProps.selectedConversation.page_id );
			const _isTagsLoaded = isPageTagsLoaded( globalState, nextProps.selectedConversation.page_id );

			if ( ! _isLoaded ) {
				this.props.getPageReplySnipests( nextProps.selectedConversation.page_id );
			}

			if ( ! _isTagsLoaded ) {
				this.props.loadPageTags( nextProps.selectedConversation.page_id );
			}
		}

		if (
			nextProps.selectedConversation &&
			this.props.selectedConversation &&
			nextProps.selectedConversation.id !== this.props.selectedConversation.id
		) {
			const draft = this.draftsForConversation[ nextProps.selectedConversation.id ];

			this.setState( {
				message: draft ? draft.message : '',
				submitting: false,
				serverError: null,
			} );
		}
	}

	buildComposerSuggestionPref = userId => {
		let preferences = [];
		preferences.push( {
			user_id: userId,
			category: 'composer',
			name: 'display_suggestion_box',
			value: this.state.shouldShowSuggestionBox === true ? 'yes' : 'no',
		} );

		return preferences;
	};

	toggleShowSuggestionBox = () => {
		const currentUser = user.get();

		this.props.updateComposerSuggestionDisplay(
			currentUser.id,
			this.buildComposerSuggestionPref( currentUser.id )
		);
	};

	documentKeyHandler = e => {
		if ( ( e.ctrlKey || e.metaKey ) && Utils.isKeyPressed( e, KeyCodes.FORWARD_SLASH ) ) {
			e.preventDefault();
			this.setState(
				{
					shouldShowSuggestionBox: ! this.state.shouldShowSuggestionBox,
				},
				() => {
					this.toggleShowSuggestionBox();
				}
			);
			return;
		}

		if ( ( e.ctrlKey || e.metaKey ) && Utils.isKeyPressed( e, KeyCodes.M ) ) {
			this.setState( {
				showMediaBrowser: ! this.state.showMediaBrowser,
			} );
		}
	};

	handleKeyDown = e => {
		const ctrlOrMetaKeyPressed = e.ctrlKey || e.metaKey;
		const messageIsEmpty = this.state.message.length === 0;
		const draftMessageIsEmpty = false; // this.props.draft.message.length === 0;
		const ctrlEnterKeyCombo =
			/*(this.props.ctrlSend || this.props.codeBlockOnCtrlEnter)*/ true &&
			Utils.isKeyPressed( e, KeyCodes.ENTER ) &&
			ctrlOrMetaKeyPressed;
		const upKeyOnly =
			! ctrlOrMetaKeyPressed && ! e.altKey && ! e.shiftKey && Utils.isKeyPressed( e, KeyCodes.UP );
		const shiftUpKeyCombo =
			! ctrlOrMetaKeyPressed && ! e.altKey && e.shiftKey && Utils.isKeyPressed( e, KeyCodes.UP );
		const ctrlKeyCombo = ctrlOrMetaKeyPressed && ! e.altKey && ! e.shiftKey;

		if ( ctrlEnterKeyCombo ) {
			// this.setState( { showMediaBrowser: ! this.state.showMediaBrowser } )
			// this.postMsgKeyPress(e);
		} else if ( upKeyOnly && messageIsEmpty ) {
			this.editLastPost( e );
		} else if ( shiftUpKeyCombo && messageIsEmpty ) {
			// this.replyToLastPost(e);
		} else if ( ctrlKeyCombo && draftMessageIsEmpty && Utils.isKeyPressed( e, KeyCodes.UP ) ) {
			// this.loadPrevMessage(e);
		} else if ( ctrlKeyCombo && draftMessageIsEmpty && Utils.isKeyPressed( e, KeyCodes.DOWN ) ) {
			// this.loadNextMessage(e);
		}
	};

	editLastPost = e => {
		e.preventDefault();
		// alert("sửa tin nhắn cuối")
	};

	sendMessage = message => {
		// const { conversationId } = this.props;
		if ( ! isEmpty( message ) ) {
			this.props.sendMessage( message );
		}
	};

	handleImageButtonClick = event => {
		this.setState( {
			showMediaBrowser: true,
		} );
	};

	handleChange = e => {
		const message = e.target.value;
		const { selectedConversation } = this.props;
		this.setState( {
			message,
		} );

		const draft = {
			...this.props.draft,
			message,
		};

		if ( selectedConversation ) {
			this.draftsForConversation[ selectedConversation.id ] = draft;
		}
	};

	handlePreventSubmit = ( e, reason ) => {
		e.preventDefault();
		if ( reason ) {
			this.props.onPreventSendMessage( reason );
		}
		// maybe show a notice
		this.focusTextbox();
	};

	handleSubmit = e => {
		if ( ! this.state.user ) return;
		e.preventDefault();

		const { page, selectedConversation } = this.props;
		if ( ! page || ! selectedConversation ) return;

		if ( this.props.onSendMessage ) {
			const message = {
				page_id: page.data.page_id,
				conversation_id: selectedConversation.id,
				created_time: new Date(),
				message: this.state.message,
				from: page.data.page_id,
				to: selectedConversation.from,
				attachments: this.state.selectedImages,
				type: selectedConversation.type,
				comment_id: selectedConversation.comment_id,
				thread_id: selectedConversation.scoped_thread_key,
				page_scope_id: selectedConversation.page_scope_id,
				user_token: this.props.userToken,
				page_token: this.props.pageToken,
			};

			console.log('message: ', message);

			if (
				message.message.trim().length === 0 &&
				( ! this.state.selectedImages || this.state.selectedImages.length === 0 )
			) {
				this.handlePreventSubmit( e );
				return;
			}

			if ( message.message.indexOf( '/' ) === 0 ) {
				this.focusTextbox();
				return;
			}

			this.props.onSendMessage( message );
		}
	};

	handleSubmitPenddingSuccess = () => {
		this.setState( {
			message: '',
			selectedImages: null,
		} );

		const { selectedConversation } = this.props;
		if ( selectedConversation ) {
			this.draftsForConversation[ selectedConversation.id ] = null;
		}

		const fasterThanHumanWillClick = 150;
		const forceFocus = Date.now() - this.lastBlurAt < fasterThanHumanWillClick;

		this.focusTextbox( forceFocus );
	};

	handleSuccessLoaded = () => {
		this.focusTextbox();
	};

	handleBlur = () => {
		// console.log( 'blur' );
		this.setState( {
			textboxFocused: false,
		} );
	};

	handleFocus = () => {
		// console.log( 'focused' );
		this.setState( {
			textboxFocused: true,
		} );
	};

	postMsgKeyPress = e => {
		const { allowSending, withClosedCodeBlock, message } = postMessageOnKeyPress(
			e,
			this.state.message,
			false,
			true
		);
		if ( allowSending ) {
			e.persist();
			this.textbox.blur();

			if ( withClosedCodeBlock && message ) {
				this.setState( { message }, () => this.handleSubmit( e ) );
			} else {
				this.handleSubmit( e );
			}
		}
	};

	handlePostError = postError => {
		// this.setState({postError});
	};

	handleTagClick = tag => {
		if ( this.props.onTagClick ) {
			this.props.onTagClick( tag );
		}
	};

	focusTextbox = ( keepFocus = true ) => {
		if ( this.textbox && ( keepFocus || ! UserAgent.isMobile() ) ) {
			this.textbox.focus();
		}
	};

	closeMediaBrowserDialog = () => {
		this.setState( {
			showMediaBrowser: false,
		} );
	};

	onCloseMediaBrowserDialog = () => {
		this.closeMediaBrowserDialog();
	};

	_handleFileUploadComplete = ( fileInfos, pageId ) => {
		this.props.receiveFilesUpload( fileInfos, pageId );
	};

	renderMediaBrowser = () => {
		const { page } = this.props;
		if ( ! page ) return null;

		return (
			<MediaBrowserDialog
				pages={ this.props.pages }
				page={ page }
				onClose={ this.onCloseMediaBrowserDialog }
				filesInfo={ this.props.filesInfo }
				onFileUploadComplete={ this._handleFileUploadComplete }
			/>
		);
	};

	handleSetSelected = () => {
		if ( ! this.props.page ) return;
		const selected = MediaLibrarySelectedStore.getAll( this.props.page.page_id );
		this.setState( {
			selectedImages: selected,
		} );
	};

	_handleComposerMenuItemClick = e => {
		this.composerPopover && this.composerPopover.hide();
		const menuItem = e.currentTarget.dataset;
		if ( menuItem && menuItem.id ) {
			switch ( menuItem.id ) {
				case 'createSnippet':
					this.setState( {
						isShowSnippetsDialog: true,
					} );
					break;
				case 'sendImages':
					this.setState( {
						showMediaBrowser: true,
					} );
			}
		} else {
			console.log( 'unhandled menu item click' ); // eslint-disable-line no-console
		}
	};

	renderMediaMenu = () => {
		return (
			<div style={ { padding: '15px 0' } }>
				<ul className={ classNames( 'menu_list', general_styles.ul_no_style ) }>
					<li
						data-id="createSnippet"
						role="button"
						className={ classNames( 'filter__item', general_styles.menu_dropdown_item ) }
						key="createSnippet"
						onClick={ this._handleComposerMenuItemClick }
					>
						<div className={ classNames( 'item__detail', general_styles.d_flex ) }>
							<div className="icon" style={ { marginRight: 6 } }>
								<Icon type="create_snippet" />
							</div>
							<div>Tạo câu trả lời mẫu</div>
						</div>
					</li>
					<li
						data-id="snippets"
						role="button"
						className={ classNames( 'filter__item', general_styles.menu_dropdown_item ) }
						key="snippets"
						onClick={ this._handleComposerMenuItemClick }
					>
						<div className={ classNames( 'item__detail', general_styles.d_flex ) }>
							<div className="icon" style={ { marginRight: 6 } }>
								<Icon type="input_file" />
							</div>
							<div>Câu trả lời mẫu</div>
						</div>
					</li>
				</ul>
				<PopoverMenuItem divider />
				<ul className={ classNames( 'menu_list', general_styles.ul_no_style ) }>
					<li
						data-id="sendImages"
						role="button"
						className={ classNames( 'filter__item', general_styles.menu_dropdown_item ) }
						key="sendImages"
						onClick={ this._handleComposerMenuItemClick }
					>
						<div className={ classNames( 'item__detail', general_styles.d_flex ) }>
							<div className="icon" style={ { marginRight: 6 } }>
								<Icon type="input_img" />
							</div>
							<div>Gửi ảnh (Ctrl+M)</div>
						</div>
					</li>
				</ul>
			</div>
		);
	};

	setComposerPopover = e => {
		this.composerPopover = e;
	};

	renderSnippetsDialog = () => {
		return (
			<Snippets
				isOpen={ this.state.isShowSnippetsDialog }
				onClose={ () => {
					this.setState( {
						isShowSnippetsDialog: false,
					} );
				} }
			/>
		);
	};

	render() {
		if ( ! this.props.selectedConversation ) {
			return null;
		}
		const { pageId, pageTags, conversationTags, disabled } = this.props;
		const rootClasses = classNames( styles.composer__content, {
			'is-gallery-opened': this.state.showMediaBrowser,
			msg_input_wrapper: true,
		} );

		const composerClasses = classNames( 'chat__composer', {
			'is-disabled': disabled,
			texty_legacy: true,
			focused: this.state.textboxFocused,
		} );

		const { formatMessage } = this.context.intl;

		const readOnlyChannel = false;
		const placeholder = formatMessage( {
			id: 'conversations.composer.placeholder',
			defaultMessage: 'Typing something...',
		} );

		const mediaButton = (
			<div className={ classNames( 'media__buttons chat__images__button' ) }>
				<MediaButton
					page={ this.props.page }
					selectedImages={ this.state.selectedImages }
					className="media_button image__button"
					icon="ts_icon_plus_thick"
				/>
			</div>
		);

		// const mediaButton = (
		// 	<div className={ classNames("media__buttons chat__images__button" ) }
		// 		 onClick={ this.handleImageButtonClick }>
		// 		<MediaButton
		// 			page={ this.props.page }
		// 			selectedImages={ this.state.selectedImages }
		// 			className="media_button image__button"
		// 			icon="ts_icon_plus_thick"
		// 		/>
		// 	</div>
		// );

		return (
			<div>
				<div className="conversation__tags">
					{ React.createElement(
						AutoSizer,
						{
							className: 'full_width',
							style: { width: '100%', height: '100%' },
						},
						e => {
							const a = e.width,
								r = e.height;
							return React.createElement(
								Tags,
								Object.assign(
									{},
									{
										width: a,
										height: r,
										conversation: this.props.selectedConversation,
										pageId: pageId,
										pageTags: pageTags,
										conversationTags: conversationTags,
										onClickTag: this.handleTagClick,
									}
								)
							);
						}
					) }
					<div className={ styles.top__border } />
				</div>
				<form id="msg_form" ref="topDiv" role="form" onSubmit={ this.handleSubmit }>
					<div className={ rootClasses }>
						<div id="msg_input" className={ composerClasses }>
							<div className={ styles.chat__message }>
								<div className="">
									<FocusManager onFocusEnter={ this.handleFocus } onFocusLeave={ this.handleBlur }>
										<Composer
											className={ styles.composer_input }
											onChange={ this.handleChange }
											onKeyPress={ this.postMsgKeyPress }
											onKeyDown={ this.handleKeyDown }
											handlePostError={ this.handlePostError }
											value={ readOnlyChannel ? '' : this.state.message }
											onBlur={ this.handleBlur }
											onFocus={ this.handleFocus }
											ref={ textbox => {
												this.textbox = textbox;
											} }
											createMessage={ placeholder }
											disabled={ false }
											characterLimit={ 1000 }
											badConnection={ true }
											snippets={ this.props.snippets }
											pageId={ pageId }
											displaySuggestion={ this.props.shouldDisplaySuggestionBox }
										/>
									</FocusManager>
								</div>
							</div>

							<Tooltip
								ref={ this.setComposerPopover }
								content={ this.renderMediaMenu() }
								shouldCloseOnClickOutside
								showImmediately
								showArrow={ false }
								theme="dark"
								placement="top"
								alignment="left"
								maxWidth={ 350 }
								moveBy={ {
									x: 0,
									y: 0,
								} }
								popover
							>
								{ mediaButton }
							</Tooltip>
							<div className={ styles.right_actions }>
								<Emoji />
							</div>
						</div>
						<div style={ { marginTop: -5 } }>
							<div id="notification_bar" data-reactroot="">
								{ /*<div className="p-notification_bar">
									<div className="p-notification_bar__section p-notification_bar__section--left">
										<span className="p-notification_bar__formatting" aria-hidden="true">
											{ suggestionStatusMessage }
										</span>
									</div>
									<div className="p-notification_bar__section p-notification_bar__section--right">
										<span className="p-notification_bar__formatting" aria-hidden="true">
											<b>Ctrl+M</b>{' '}
											{ formatMessage( {
												id: 'general.attach_images',
												defaultMessage: 'Attach images',
											} ) }
											.
											<b>
												{' '}
												Ctrl+
												<strong className="left_margin" aria-label="Return">
													↵
												</strong>
											</b>{' '}
											{ formatMessage( {
												id: 'conversations.next_conversation',
												defaultMessage: 'Next conversation',
											} ) }
											.<b> Ctrl+K</b>{' '}
											{ formatMessage( {
												id: 'general.switch_pages',
												defaultMessage: 'Switch pages',
											} ) }
											.
										</span>
									</div>
								</div>*/ }
								<NotificationBar />
							</div>
						</div>
					</div>
				</form>
				{ this.state.showMediaBrowser && this.renderMediaBrowser() }
				{ this.renderSnippetsDialog() }
			</div>
		);
	}
}

export default connect(
	( state, { selectedConversation } ) => {
		const pageToken = selectedConversation && state.pages.items[selectedConversation.page_id] &&
			state.pages.items[selectedConversation.page_id].data && state.pages.items[selectedConversation.page_id].data.access_token;

		return {
			globalState: state,
			snippets: selectedConversation
				? getPageSnippets( state, selectedConversation.page_id )
				: null,
			pageTags: selectedConversation ? getPageTags( state, selectedConversation.page_id ) : null,
			conversationTags: selectedConversation ? selectedConversation.tags : null,
			shouldDisplaySuggestionBox: shouldDisplaySuggestionBox( state ),
			userToken: state.currentUser.data.facebook_token,
			pageToken,
			// selectedImages: page ? MediaLibrarySelectedStore.getAll( page.page_id ) : null,
		};
	},
	{
		sendMessage,
		getPageReplySnipests,
		loadPageTags,
		onPreventSendMessage,
		updateComposerSuggestionDisplay,
		receiveFilesUpload,
	},
	null,
	{ withRef: true }
)( ChatComposer );
