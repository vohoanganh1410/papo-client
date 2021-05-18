import $ from 'jquery';
import React from 'react';
import { connect } from 'react-redux';
import { throttle, includes } from 'lodash';
import classNames from 'classnames';
import Joyride, { STATUS } from 'react-joyride';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FormattedMessage, intlShape } from 'react-intl';
import Modal from 'papo-components/Modal';
import { MessageBoxFunctionalLayout } from 'papo-components/MessageBox';

import Main from 'components/main';
import { getSelectedConversation } from 'state/ui/conversation-list/selectors';
import ConversationHeader from './conversation-header';
import Timeline from 'blocks/conversation-timeline';
import ChatComposer from 'blocks/chat-composer';
import { toggleConversationSelection } from 'state/ui/conversation-list/actions';
import * as Utils from 'lib/utils';
import { Constants } from 'lib/key-codes';
import SwitchPages from './switch-pages';
import { getSelectedPageId, isShowSwitchPages } from 'state/ui/selectors';
import { getPage, getPages } from 'state/pages/selectors';
import Settings from './settings';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';
import ImageViewer from './image-viewer';
import Search from './search';
import Analytics from './analystics';
import ConversationNote from './note';
import SwitchLayoutFocus from './switch-layout-focus';
import { setLayoutFocus } from 'state/ui/layout-focus/actions';
import { toggleShowSwitchPages } from 'state/ui/actions';

import * as WebSocketActions from 'actions/websocket';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

import {
	fetchPageAnalyticsData,
} from 'actions/page';
import {
	sendMessage,
	onChangeSearchSelected,
	addOrRemoveConversationTag,
	updateConversationUnSeen,
	addConversationNote,
	loadConversations,
	requestConversation,
	requestMoreConversation,
	searchConversations,
} from 'actions/conversation';
import { getSelectedPageIdsPreference } from 'state/preferences/selectors';
import {
	isLoading,
	isLoadingOlder,
	loadingError,
	getConversationMessages,
	getConversationNotes,
	getMessageKeys,
} from 'state/conversation/selectors';
import {
	getConversations,
	getConversation,
	isRequestingConversations as isRequesting,
	getPendingMessages,
	isSearching,
	getSearchData,
	getSelectedSearch,
	getSelectedConversationSearch,
} from 'state/conversations/selectors';

const KeyCodes = Constants.KeyCodes;

class Conversations extends React.Component {
	static contextTypes = {
		intl: intlShape,
	};

	constructor( props ) {
		super( props );

		this.state = {
			windowHeight: this.getViewportHeight(),
			windowWidth: this.getViewportWidth(),
			showDialog: props.isShowSwitchPages,
			isFisttimeLoad: true,
			flexPanelShowing: true,
			toggledActions: null,
			showSettings: false,
			selected: null,
			showSearchDialog: false,
			showAnalystics: false,
			searchPageText: '',
			/*
			 * Guidelines tour
			 * */
			showGuides: false,
			steps: [
				{
					content: <h2>Chỉ dẫn sử dụng Papo Conversation</h2>,
					placement: 'center',
					locale: { skip: <strong aria-label="skip">Bỏ qua</strong>, next: 'Tiếp theo' },
					target: 'body',
				},
				{
					target: '.conversation__actions',
					content: (
						<p style={ { textAlign: 'left', marginBottom: 0 } }>
							<strong>Thông tin hội thoại: </strong>Xem thông tin hội thoại và thay đổi các thiết
							lập cơ bản
						</p>
					),
					locale: {
						skip: <strong aria-label="skip">Bỏ qua</strong>,
						back: 'Trước',
						next: 'Tiếp theo',
					},
					spotlightPadding: 0,
				},
				{
					target: '.c-react_search_input',
					content: 'Tìm kiếm hội thoại',
					locale: {
						skip: <strong aria-label="skip">Bỏ qua</strong>,
						back: 'Trước',
						next: 'Tiếp theo',
					},
					spotlightPadding: 0,
				},
				{
					target: '.page_settings',
					content: 'Cài đặt trang và xem thống kê chi tiết',
					locale: {
						skip: <strong aria-label="skip">Bỏ qua</strong>,
						back: 'Trước',
						next: 'Tiếp theo',
					},
					spotlightPadding: 0,
				},
				{
					target: '.list_header',
					content: 'Chuyển đổi giữa các trang hoặc kích hoạt các bộ lọc hội thoại.',
					locale: {
						skip: <strong aria-label="skip">Bỏ qua</strong>,
						back: 'Trước',
						next: 'Tiếp theo',
					},
					spotlightPadding: 0,
				},
				{
					target: '.conversation__tags',
					content:
						'Gắn nhãn hội thoại. Nếu các nhãn nằm ngoài vùng hiển thị, bạn có thể bấm và giữ chuột để kéo sang trái/phải để xem',
					locale: {
						skip: <strong aria-label="skip">Bỏ qua</strong>,
						back: 'Trước',
						next: 'Tiếp theo',
					},
					spotlightPadding: 0,
				},
				{
					target: '.msg_input_wrapper',
					content:
						'Hộp soạn thảo tin nhắn. Nhập nội dung tin nhắn và Enter để gửi. Sử dụng tổ hợp phím Ctrl + / để bật/ tắt các câu mẫu gợi ý. Thông báo phía dưới cùng của hộp soạn thảo này sẽ cho bạn biết các thông tin hữu ích.',
					locale: {
						skip: <strong aria-label="skip">Bỏ qua</strong>,
						back: 'Trước',
						next: 'Tiếp theo',
						last: 'Kết thúc',
					},
					spotlightPadding: 0,
				},
			],
		};
	}

	componentDidMount() {
		this.resize = throttle( this.resize, 400 );
		window.addEventListener( 'resize', this.resize, true );
		document.addEventListener( 'keydown', this.documentKeyHandler );
		setTimeout( () => {
			this.setState( { isFisttimeLoad: false } );
		}, 0 );

		// Make sure the websockets close and reset version
		$( window ).on( 'beforeunload', () => {
			// Turn off to prevent getting stuck in a loop
			$( window ).off( 'beforeunload' );
			// if (document.cookie.indexOf('MMUSERID=') > -1) {
			//     viewChannel('', ChannelStore.getCurrentId() || '')(dispatch, getState);
			// }
			WebSocketActions.close();
		} );
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.resize, true );
		document.removeEventListener( 'keydown', this.documentKeyHandler );
		WebSocketActions.close();
	}

	documentKeyHandler = e => {
		const ctrlOrMetaKeyPressed = e.ctrlKey || e.metaKey;
		if ( ctrlOrMetaKeyPressed && Utils.isKeyPressed( e, KeyCodes.DOWN ) ) {
		}

		if ( Utils.isKeyPressed( e, KeyCodes.SPACE ) && ctrlOrMetaKeyPressed ) {
			// show <<analytics>>
			this.setState( {
				showAnalystics: ! this.state.showAnalystics,
			} );
		}

		if ( Utils.isKeyPressed( e, KeyCodes.ENTER ) && ctrlOrMetaKeyPressed ) {
			// active next item
			if ( this.props.nextItemKey )
				this.props.toggleConversationSelection( this.props.nextItemKey );
		}

		if (
			Utils.cmdOrCtrlPressed( e ) &&
			! e.shiftKey &&
			Utils.isKeyPressed( e, Constants.KeyCodes.K )
		) {
			if ( ! e.altKey ) {
				e.preventDefault();
				this.toggleQuickSwitchModal();
			}
		}
	};

	onMessagePaneKeyDown = e => {
		const ctrlOrMetaKeyPressed = e.ctrlKey || e.metaKey || e.altKey || e.altKey;
		if ( ! ctrlOrMetaKeyPressed ) {
			this.composer &&
				this.composer.getWrappedInstance() &&
				this.composer.getWrappedInstance().focusTextbox();
		}
	};

	toggleQuickSwitchModal = () => {
		this.props.toggleShowSwitchPages();
	};

	getViewportHeight() {
		let height;
		if ( document.documentElement ) {
			height = document.documentElement.clientHeight;
		}

		if ( ! height && document.body ) {
			height = document.body.clientHeight;
		}

		return height || 0;
	}

	getViewportWidth() {
		let width;
		if ( document.documentElement ) {
			width = document.documentElement.clientWidth;
		}

		if ( ! width && document.body ) {
			width = document.body.clientWidth;
		}

		return width || 0;
	}

	resize = () => {
		this.setState( {
			windowHeight: this.getViewportHeight(),
			windowWidth: this.getViewportWidth(),
		} );
	};

	handleActionsToggle = tag => {
		if ( tag === 'info' ) {
			this.setState( {
				flexPanelShowing: ! this.state.flexPanelShowing,
			} );
		}

		if ( tag === 'settings' ) {
			this.setState(
				{
					showSettings: ! this.state.showSettings,
				},
				() => {
					const settings = this.refs.settings;
					if ( settings ) {
						settings.toggleShowDialog();
					}
				}
			);
		}

		if ( tag === 'mark__unread' ) {
			this.setState( {
				showConfirmUnseen: true,
			} );
		}

		if ( tag === 'analystics' ) {
			this.setState( {
				showAnalystics: true,
			} );
		}

		if ( tag === 'help' ) {
			this.setState( {
				showGuides: true,
			} );
		}
	};

	handleTagClick = tag => {
		if ( ! this.props.selected ) return;
		this.props.addOrRemoveConversationTag(
			this.props.selected.page_id,
			this.props.selected.id,
			tag
		);
	};

	handleSendMessage = message => {
		this.props.sendMessage( message );
	};

	setSwitchRef = r => {
		this.switchbox = r;
	};

	handleCloseSwitchBox = () => {
		this.props.toggleShowSwitchPages( false );
	};

	renderSwitchBox = () => {
		const { pages } = this.props;
		return (
			<SwitchPages
				ref={ this.setSwitchRef }
				pages={ pages }
				searchValue={ this.state.searchPageText }
				onChange={ this.handleSeachPageChange }
				isOpen={ this.props.isShowSwitchPages }
				onCloseDialog={ this.handleCloseSwitchBox }
			/>
		);
	};

	handleSeachPageChange = e => {
		// console.log( 'e.target.value', e.target.value );
		this.setState( {
			searchPageText: e.target.value,
		} );
	};

	renderSettings = () => {
		return (
			<Settings
				ref="settings"
				page={ this.props.selectedPage }
				selectedPageIds={ this.props.selectedPageIds }
				height={ this.state.windowHeight }
			/>
		);
	};

	onConfirmUnseen = () => {
		if ( ! this.props.selected ) return;

		this.props.updateConversationUnSeen( this.props.selected.id, this.props.selected.page_id );

		this.closeConfirmUnseen();
	};

	closeConfirmUnseen = () => {
		this.setState( {
			showConfirmUnseen: false,
		} );
	};

	renderConfirmChangeUnseenDialog = () => {
		if ( ! this.state.showConfirmUnseen ) {
			return null;
		}
		const { formatMessage } = this.context.intl;

		return (
			<Modal
				isOpen={ true }
				title={ formatMessage( {
					id: 'general.confirm',
					defaultMessage: 'Confirm',
				} ) }
				onRequestClose={ this.closeConfirmUnseen }
				shouldDisplayCloseButton
				shouldCloseOnOverlayClick
				scrollableContent={ false }
			>
				<MessageBoxFunctionalLayout
					theme="blue"
					title={ formatMessage( {
						id: 'general.confirm',
						defaultMessage: 'Confirm',
					} ) }
					confirmText={ formatMessage( {
						id: 'general.ok',
						defaultMessage: 'OK',
					} ) }
					cancelText="Cancel"
					onOk={ this.onConfirmUnseen }
					onCancel={ this.closeConfirmUnseen }
					dataHook="alert-actions"
				>
					<FormattedMessage
						id="conversations.mark_unread_confirm_message"
						defaultMessage="Do you want to mark this conversation as unread?"
					/>
				</MessageBoxFunctionalLayout>
			</Modal>
		);
	};

	handleCreateNote = note => {
		if ( ! this.props.selectedId || ! note || note.length === 0 ) {
			return;
		}

		this.props.addConversationNote( this.props.selectedId, { message: note } );
	};

	renderInfoPanel = () => {
		const { selected, page } = this.props;
		if ( ! selected ) return null;
		const rootClasses = classNames( styles.panel, styles.active );
		return (
			<div className={ rootClasses } id="details_tab">
				<div className={ styles.heading } tabIndex="-1">
					<div className={ styles.heading_row }>
						<h2
							className={ classNames(
								styles.details_tab_header,
								styles.heading_text,
								g_styles.overflow_ellipsis
							) }
						>
							<FormattedMessage
								id="conversations.detail.info"
								defaultMessage="Conversation details"
							/>
							<span className={ classNames( styles.channel_name, g_styles.overflow_hidden ) }>
								<span className={ g_styles.overflow_ellipsis } />
							</span>
						</h2>

						<UnstyledButton
							className={ g_styles.blue_on_hover }
							onClick={ () => this.setState( { flexPanelShowing: false } ) }
						>
							<Icon type="times" />
						</UnstyledButton>
					</div>
				</div>
				{ React.createElement( AutoSizer, null, e => {
					const a = e.width,
						r = e.height;
					return React.createElement(
						ConversationNote,
						Object.assign(
							{},
							{
								width: a,
								height: r - 59,
								conversation: selected,
								notes: this.props.notes,
								isOpen: this.state.flexPanelShowing,
								onCreateNote: this.handleCreateNote,
								isCreatingNote: this.props.isCreatingNote,
								page: page,
							}
						)
					);
				} ) }
			</div>
		);
	};

	handleImageClick = ( media, from ) => {
		this.setState( {
			selectedImage: media,
			imageFrom: from,
		} );
	};

	onClose = () => {
		this.setState( {
			selectedImage: null,
			imageFrom: null,
		} );
	};

	renderImageViewer = () => {
		if ( ! this.state.selectedImage ) {
			return null;
		}

		return (
			<ImageViewer
				image={ this.state.selectedImage }
				isOpen={ !! this.state.selectedImage }
				onClose={ this.onClose }
				from={ this.state.imageFrom }
				page={ this.props.page }
			/>
		);
	};

	handleFocusSearch = () => {
		this.setState( {
			showSearchDialog: true,
		} );
	};

	closeSearch = () => {
		this.setState( {
			showSearchDialog: false,
		} );
	};

	_handleSearch = term => {
		this.props.searchConversations( term );
	};

	renderSearchDialog = () => {
		if ( ! this.state.showSearchDialog ) {
			return null;
		}

		return (
			<Search
				close={ this.closeSearch }
				onSearch={ this._handleSearch }
				isSearching={ this.props.isSearching }
				searchData={ this.props.searchData }
				selectedPageIds={ this.props.selectedPageIds }
				selectedPageId={ this.props.selectedPageId }
				onChangeSearchSelected={ this.props.onChangeSearchSelected }
				selectedId={ this.props.searchSelectedId }
				selected={ this.props.selectedSearch }
				requestConversation={ this.props.requestConversation }
				requestMoreConversation={ this.props.requestMoreConversation }
			/>
		);
	};

	handleCloseAnalystics = () => {
		this.setState( {
			showAnalystics: false,
		} );
	};

	handleJoyrideCallback = data => {
		const { status } = data;

		if ( includes( [ STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED, STATUS.ERROR ], status ) ) {
			this.setState( { showGuides: false } );
		}

		// console.groupCollapsed(type);
		console.log( data ); //eslint-disable-line no-console
		// console.groupEnd();
	};

	renderAnalystics = () => {
		if ( ! this.state.showAnalystics ) {
			return null;
		}

		return (
			<Analytics
				isOpen={ this.state.showAnalystics }
				onClose={ this.handleCloseAnalystics }
				page={ this.props.selectedPage }
				requestPageAnalytics={ this.props.fetchPageAnalyticsData }
			/>
		);
	};

	_handleSetFocusSidebar = () => {
		this.props.setLayoutFocus( 'sidebar' );
	};

	renderSwitchLayoutFocus = () => {
		return <SwitchLayoutFocus onSetLayoutFocusSidebar={ this._handleSetFocusSidebar } />;
	};

	setComposerRef = r => {
		this.composer = r;
	};

	render() {
		const { selected, page, selectedImages, rows, keys, pendingMessages, translate } = this.props;

		const { steps, showGuides } = this.state;

		const rootClasses = classNames(
			styles.conversation__details,
			styles.supports_custom_scrollbar,
			{
				[ styles.flex_pane_showing ]: this.state.flexPanelShowing === true,
			}
		);

		const timelineWidth = this.state.windowWidth - 350 - ( this.state.flexPanelShowing ? 380 : 0 );

		return (
			<Main className="conversations" wideLayout>
				<div className={ rootClasses }>
					<div className={ styles.conversation_col }>
						<Joyride
							run={ showGuides }
							steps={ steps }
							showSkipButton
							showProgress
							continuous
							styles={ {
								options: {
									zIndex: 100000,
								},
							} }
							callback={ this.handleJoyrideCallback }
						/>
						<ConversationHeader
							conversation={ selected }
							from={ selected ? selected.from : null }
							onToggle={ this.handleActionsToggle }
							toggledActions={ this.state.toggledActions }
							onFocusSearch={ this.handleFocusSearch }
							showInfo={ this.state.flexPanelShowing }
							page={ page }
							selectedPageIds={ this.props.selectedPageIds }
						/>
						<div className={ styles.col_msg }>
							{ selected && (
								<div className={ styles.msg }>
									<div className={ styles.conversation }>
										<Timeline
											type={ selected.type }
											conversation={ selected }
											from={ selected.from }
											conversationId={ selected.id }
											readWatermark={ selected.read_watermark }
											rows={ rows }
											keys={ keys }
											pendingMessages={ pendingMessages }
											pageId={ selected.page_id }
											page={ page }
											height={ this.state.windowHeight - 54 - 92 }
											width={ timelineWidth }
											requestConversation={ this.props.requestConversation }
											requestMoreConversation={ this.props.requestMoreConversation }
											isLoadingOlder={ this.props.isLoadingOlder }
											isLoading={ this.props.isLoading }
											loadingError={ this.props.loadingError }
											onClickImage={ this.handleImageClick }
											onMessagePaneKeyDown={ this.onMessagePaneKeyDown }
										/>
									</div>
									<div className={ styles.composer }>
										<ChatComposer
											ref={ this.setComposerRef }
											selectedConversation={ selected }
											selectedImages={ selectedImages }
											translate={ translate }
											pageId={ selected.page_id }
											page={ page }
											snippets={ this.props.snippets }
											onTagClick={ this.handleTagClick }
											onSendMessage={ this.handleSendMessage }
											pages={ this.props.pages }
											loadPageFilesInfo={ this.props.loadPageFilesInfo }
										/>
									</div>
								</div>
							) }
							{ selected && (
								<div className={ styles.col_flex } role="complementary">
									<div
										className={ classNames(
											styles.flex_contents,
											styles.tab_panels,
											styles.tab_container
										) }
									>
										{ this.renderInfoPanel() }
									</div>
								</div>
							) }
						</div>
					</div>
				</div>
				{ this.renderSwitchLayoutFocus() }
				{ this.renderSwitchBox() }
				{ this.renderSettings() }
				{ this.renderConfirmChangeUnseenDialog() }
				{ this.renderImageViewer() }
				{ this.renderSearchDialog() }
				{ this.renderAnalystics() }
			</Main>
		);
	}
}

export default connect(
	state => {
		// const conversation = getConversationData( state );

		const selectedPageId = getSelectedPageId( state );
		const selectedPage = selectedPageId ? getPage( state, selectedPageId ) : null;

		const selectedId = getSelectedConversation( state );
		const selected = selectedId ? getConversation( state, selectedId ) : null;

		const pendingMessages = selectedId ? getPendingMessages( state, selectedId ) : null;

		const searchSelectedId = getSelectedSearch( state );

		const page = selected ? getPage( state, selected.page_id ) : null;

		return {
			conversations: getConversations( state ),
			// conversation,
			selected,
			notes: getConversationNotes( state ),
			selectedId,
			pendingMessages,
			keys: getMessageKeys( state ),
			rows: getConversationMessages( state ),
			pages: getPages( state ),
			page,
			selectedPage,
			selectedPageId,
			isRequestingConversations: isRequesting( state ),
			selectedPageIds: getSelectedPageIdsPreference( state ),
			isLoading: isLoading( state ),
			isLoadingOlder: isLoadingOlder( state ),
			loadingError: loadingError( state ),
			isSearching: isSearching( state ),
			searchData: getSearchData( state ),
			searchSelectedId,
			selectedSearch: searchSelectedId
				? getSelectedConversationSearch( state, searchSelectedId )
				: null,
			isShowSwitchPages: isShowSwitchPages( state ),
		};
	},
	{
		loadConversations,
		requestConversation,
		requestMoreConversation,
		sendMessage,
		toggleConversationSelection,
		addOrRemoveConversationTag,
		updateConversationUnSeen,
		addConversationNote,
		setLayoutFocus,
		searchConversations,
		onChangeSearchSelected,
		toggleShowSwitchPages,
		fetchPageAnalyticsData,
	},
	null,
	{ withRef: true }
)( Conversations );
