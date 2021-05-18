// import React from 'react';
// import PropTypes from 'prop-types';
// import classnames from 'classnames';
// import { noop, debounce, isEqual, throttle, forEach, sortBy } from 'lodash';
// import AutoSizer from 'react-virtualized-auto-sizer';
//
// import Loading from 'components/loading';
// import DynamicList from 'blocks/virtualized-list/message-dynamic-list';
// import Layout from 'components/virtualized-list/layout';
// import HeightCache from 'components/virtualized-list/height-cache';
// import DateSeparator from './date-separator';
// import GlobalEventEmitter from 'utils/global-event-emitter';
// import EventTypes from 'utils/event-types';
// import Message from './message';
// import TimeItem from './time-item';
//
// import general_styles from 'components/general-styles.scss';
// import styles from './style.scss';
// import ClickToCopyText from 'components/click-to-copy-text';
// import Alert from 'components/alert';
//
// const DEFAULT_LIMIT = 35; // items/load
//
// export default class MessageList extends React.PureComponent {
// 	static propTypes = {
// 		requestConversation: PropTypes.func,
// 		requestMoreConversation: PropTypes.func,
// 	};
//
// 	static defaultProps = {
// 		requestConversation: noop,
// 		requestMoreConversation: noop,
// 	};
//
// 	constructor( props ) {
// 		super( props );
//
// 		this.state = {
// 			hasLoadedForFirstTime: false,
// 			readyForLoadPre: false,
// 			isLoading: props.isLoading,
// 			isLoadingOlder: props.isLoadingOlder,
// 			isSelecting: false,
// 			hasKeyboardFocus: false,
// 			offset: 0,
// 			limit: DEFAULT_LIMIT,
// 			hasNext: true,
// 			hasScrollForFirstTime: false,
// 			readyForLoadMore: false,
// 		};
// 		// this.stickToBottom = true,
// 		this.DEFAULT_ROW_HEIGHT = 0;
// 		this.STICKY_EPSILON = this.DEFAULT_ROW_HEIGHT / 2;
// 		this.ANCHOR_OFFSET = 64;
// 		this.heightCache = new HeightCache( {
// 			DEFAULT_HEIGHT: this.DEFAULT_ROW_HEIGHT,
// 		} );
//
// 		this.layout = new Layout( {
// 			heightCache: this.heightCache,
// 			STICKY_EPSILON: this.STICKY_EPSILON,
// 			STICKY_EPSILON_SETHEIGHT: 2,
// 			ANCHOR_OFFSET: this.ANCHOR_OFFSET,
// 		} );
//
// 		this.keys = [];
// 		this.rows = [];
// 		//this.visibleRows = [];
// 		//this.unreadIndex = null;
// 		this.list = null;
// 		//this.useAnchor = true;
// 		this.keyToScrollTo = null;
// 		this.width = 0;
//
// 		// a.hasRenderedOneMessage = false;
// 		// a.requestAround = a.requestAround.bind(a);
// 		// this.requestOlder = this.requestOlder.bind( this );
// 		//this.requestNewer = this.requestNewer.bind( this );
//
// 		this.renderRow = this.renderRow.bind( this );
// 		this.setListRef = this.setListRef.bind( this );
// 		//this.getAriaLabelForRow = this.getAriaLabelForRow.bind( this );
// 		this.onScroll = this.onScroll.bind( this );
// 		this.onListScrolled = this.onListScrolled.bind( this );
// 		this.onFocusEnter = this.onFocusEnter.bind( this );
// 		this.onFocusLeave = this.onFocusLeave.bind( this );
// 		this.debouncedOnListScrolled = debounce( this.onListScrolled, 150 );
// 		this.debounceLoadMore = debounce( this.requestOlder, 100 );
//
// 		this.scrollToOffset = throttle( this.scrollToOffset.bind( this ), 200 );
// 	}
//
// 	componentDidMount() {
// 		const { conversation } = this.props;
// 		conversation && conversation.data && this.loadConversation( conversation.data.id );
//
// 		GlobalEventEmitter.addListener(
// 			EventTypes.CONVERSATION_MESSAGES_LOADED,
// 			this.handleSuccessLoaded
// 		);
// 		GlobalEventEmitter.addListener(
// 			EventTypes.CONVERSATION_MESSAGES_MORE_LOADED,
// 			this.handleSuccessLoadedMore
// 		);
// 		GlobalEventEmitter.addListener(
// 			EventTypes.PENDING_MESSAGE_SUBMITED,
// 			this.handleSuccessSubmitPendingMessage
// 		);
// 	}
//
// 	componentWillUnmount() {
// 		GlobalEventEmitter.removeListener(
// 			EventTypes.CONVERSATION_MESSAGES_LOADED,
// 			this.handleSuccessLoaded
// 		);
// 		GlobalEventEmitter.removeListener(
// 			EventTypes.CONVERSATION_MESSAGES_MORE_LOADED,
// 			this.handleSuccessLoadedMore
// 		);
// 		GlobalEventEmitter.removeListener(
// 			EventTypes.PENDING_MESSAGE_SUBMITED,
// 			this.handleSuccessSubmitPendingMessage
// 		);
// 	}
//
// 	handleSuccessSubmitPendingMessage = () => {
// 		// this.keyToScrollTo = this.keys[ this.keys.length - 1 ];
// 		//
// 		// if ( this.keyToScrollTo && this.list ) {
// 		// 	setTimeout( () => {
// 		// 		this.list.scrollToKey( this.keyToScrollTo, {
// 		// 			lazy: this.lazyScroll,
// 		// 		} );
// 		// 		this.keyToScrollTo = null;
// 		// 	} );
// 		// }
// 		//
// 		// this.keyToScrollTo = null;
// 		this.setState( {
// 			keyToScrollTo: this.keys[ this.keys.length - 1 ],
// 		} );
// 	};
//
// 	componentDidUpdate() {
// 		if ( this.state.keyToScrollTo && this.list ) {
// 			this._scrollToKey();
// 		}
// 		// this.heightCache && this.heightCache.invalidate();
// 		// this.keyToScrollTo = null;
// 		// this.layout.setStickToBottom( this.props.reachedEnd || this.props.prevReachedEnd );
// 		// this.onListScrolled();
// 	}
//
// 	_scrollToKey = () => {
// 		if ( ! this.state.keyToScrollTo ) return;
// 		this.list.scrollToKey( this.state.keyToScrollTo, {
// 			lazy: this.lazyScroll,
// 		} );
//
// 		// setTimeout( () => {
// 		// 	this.setState( {
// 		// 		keyToScrollTo: null,
// 		// 	} );
// 		// } );
// 	};
//
// 	componentWillReceiveProps( nextProps ) {
// 		if ( nextProps.conversation.data.id !== this.props.conversation.data.id ) {
// 			this.setState(
// 				{
// 					hasLoadedForFirstTime: false,
// 					offset: 0,
// 					limit: DEFAULT_LIMIT,
// 					hasNext: true,
// 					readyForLoadPre: false,
// 					keyToScrollTo: null,
// 				},
// 				() => {
// 					this.loadConversation( nextProps.conversation.data.id );
// 				}
// 			);
// 			this.list && this.list.resetRendered && this.list.resetRendered();
// 		}
// 	}
//
// 	focus() {
// 		this.list.focus();
// 	}
//
// 	blur() {
// 		this.list.blur();
// 	}
//
// 	setListRef( t ) {
// 		this.list = t;
// 	}
//
// 	onScroll( value, { scrollTop } ) {
// 		this.layout.setAnchor( false );
// 		this.setState( {
// 			pendingScrollTop: scrollTop,
// 			keyToScrollTo: null,
// 		} );
// 		// console.log("scrollTop", scrollTop);
// 		// this.useAnchor = false;
// 		// this.layout.setAnchor( false );
// 		// this.debouncedOnListScrolled();
// 		// this.props.onScroll();
// 	}
//
// 	onListScrolled() {
// 		// const t = this.getVisibleRows();
// 		// if ( isEqual( t, this.visibleRows ) ) return;
// 		// this.visibleRows = t;
// 		// this.props.onVisibleRowsChanged(t)
// 	}
//
// 	onFocusEnter( t ) {
// 		this.hasFocus = true;
// 		this.hasKeyboardFocus = t.isKeyboardFocus;
// 	}
//
// 	onFocusLeave() {
// 		this.hasFocus = false;
// 		this.hasKeyboardFocus = false;
// 	}
//
// 	scrollToOffset() {
// 		let t;
// 		if ( ! this.list ) return;
// 		( t = this.list ).scrollToOffset.apply( t, arguments );
// 	}
//
// 	requestOlder = () => {
// 		console.log( 'this.state.readyForLoadPre', this.state.readyForLoadPre );
// 		if (
// 			this.props.isLoading ||
// 			this.props.isLoadingOlder ||
// 			! this.state.hasNext ||
// 			! this.state.readyForLoadPre
// 		) {
// 			return false;
// 		}
//
// 		console.log( 'ssssssssssssssssssss', new Date().getTime() );
//
// 		const { conversation } = this.props;
// 		this.setState(
// 			{
// 				isLoadingOlder: true,
// 				readyForLoadPre: false,
// 			},
// 			() => {
// 				conversation && conversation.data && this.loadMoreConversation( conversation.data.id );
// 			}
// 		);
// 	};
//
// 	loadConversation = conversationId => {
// 		if ( this.props.isLoading ) {
// 			return false;
// 		}
// 		this.props
// 			.requestConversation( conversationId, this.state.limit, this.state.offset )
// 			.then( () => {
// 				console.log( 'this.keys[ this.keys.length - 1 ]', this.keys[ this.keys.length - 1 ] );
// 				// alert(loaded);
// 				this.setState( {
// 					isLoading: false,
// 					keyToScrollTo: this.keys[ this.keys.length - 1 ],
// 					readyForLoadPre: true,
// 				} );
// 			} );
// 	};
//
// 	loadMoreConversation = conversationId => {
// 		this.setState(
// 			{
// 				scrollTopBeforeLoadMore: this.state.pendingScrollTop,
// 				totalLayoutBeforeLoadMore: this.layout.getTotalHeight(),
// 				readyForLoadPre: false,
// 			},
// 			() => {
// 				this.props
// 					.requestMoreConversation( conversationId, this.state.limit, this.state.offset )
// 					.then( () => {
// 						const a =
// 							this.layout.getTotalHeight() -
// 							( this.state.totalLayoutBeforeLoadMore - this.state.scrollTopBeforeLoadMore );
// 						this.list.scrollToOffset( a );
// 						this.setState(
// 							{
// 								isLoadingOlder: false,
// 								readyForLoadPre: true,
// 							},
// 							() => {
// 								console.log( 'must called before' );
// 							}
// 						);
// 					} )
// 					.catch();
// 			}
// 		);
// 	};
//
// 	handleSuccessLoadedMore = loaded => {
// 		this.setState(
// 			{
// 				offset: this.state.offset + loaded,
// 				hasNext: loaded >= DEFAULT_LIMIT,
// 				// readyForLoadPre: true,
// 			},
// 			() => {
// 				console.log( 'must called before' );
// 			}
// 		);
// 	};
//
// 	handleSuccessLoaded = loaded => {
// 		this.setState( {
// 			isLoading: false,
// 			hasLoadedForFirstTime: true,
// 			offset: this.state.offset + loaded,
// 			hasNext: loaded >= DEFAULT_LIMIT,
// 		} );
// 	};
//
// 	groupMessagesBySender = messages => {
// 		const grouped = messages.reduce(
// 			( { user_id, group, groups }, message ) => {
// 				const author = message && message.from ? message.from : null;
// 				if ( user_id !== author.id ) {
// 					return {
// 						user_id: author.id,
// 						group: [ message ],
// 						groups: group ? groups.concat( [ group ] ) : groups,
// 					};
// 				}
// 				// it's the same user so group it together
// 				return { user_id, group: group.concat( [ message ] ), groups };
// 			},
// 			{ groups: [] }
// 		);
//
// 		return grouped.groups.concat( [ grouped.group ] );
// 	};
//
// 	sameDay = ( d1, d2 ) => {
// 		return (
// 			d1.getFullYear() === d2.getFullYear() &&
// 			d1.getMonth() === d2.getMonth() &&
// 			d1.getDate() === d2.getDate()
// 		);
// 	};
//
// 	groupMessagesByDate = messages => {
// 		const grouped = messages.reduce(
// 			( { group, groups, created_time }, message ) => {
// 				if ( ! this.sameDay( new Date( created_time ), new Date( message.created_time ) ) ) {
// 					return {
// 						created_time: message.created_time,
// 						group: [ message ],
// 						groups: group ? groups.concat( [ group ] ) : groups,
// 					};
// 				}
// 				return { created_time, group: group.concat( [ message ] ), groups };
// 			},
// 			{ groups: [] }
// 		);
//
// 		return grouped.groups.concat( [ grouped.group ] );
// 	};
//
// 	renderMessage = ( item, a ) => {
// 		const r = a.hasFocus,
// 			i = a.isHovered,
// 			page_id = a.page_id;
//
// 		const className = classnames( styles.timeline_item, {
// 			[ styles.me ]: item.from.id === page_id,
// 			focus: r,
// 			[ styles.hover ]: i,
// 		} );
// 		return (
// 			<Message
// 				fromPage={ item.from.id === page_id }
// 				className={ className }
// 				isHovered={ i }
// 				message={ item }
// 				onClickImage={ this.props.onClickImage }
// 			/>
// 		);
// 	};
//
// 	onError = () => {
// 		// error on getting image
// 	};
//
// 	orderMessagesByCreatedTime( messages ) {
// 		return sortBy( messages, [ 'created_time' ] );
// 	}
//
// 	renderDateGroup = date => {
// 		return <DateSeparator key={ date } date={ new Date( date ) } />;
// 	};
//
// 	renderSender = sender => {
// 		if ( sender.from_page === true ) {
// 			return (
// 				<span className={ styles.group__sender__name }>
// 					<ClickToCopyText
// 						tooltipPosition={ 'top' }
// 						className={ general_styles.black_and_bold }
// 						text={ sender.data.name }
// 					/>
// 					<TimeItem time={ sender.time } />
// 				</span>
// 			);
// 		}
// 		return (
// 			<div className={ styles.sender__group } key={ sender.id } style={ { height: 32 } }>
// 				<div className={ styles.user__avatar }>
// 					<div className={ styles.avatar_image }>
// 						<img
// 							alt={ sender.data.id }
// 							title={ sender.data.id }
// 							src={ `//graph.facebook.com/${ sender.data.id }/picture?width=50&height=50` }
// 							width={ 36 }
// 							height={ 36 }
// 							onError={ this.onError() }
// 						/>
// 					</div>
// 				</div>
// 				<div className={ styles.group__sender__name + ' ' + styles.customer }>
// 					<ClickToCopyText
// 						tooltipPosition={ 'top' }
// 						className={ general_styles.black_and_bold }
// 						text={ sender.data.name }
// 					/>
// 					<TimeItem time={ sender.time } />
// 				</div>
// 			</div>
// 		);
// 	};
//
// 	renderLoading() {
// 		return <Loading />;
// 	}
//
// 	renderLoadingMore() {
// 		return <Loading style={ { height: 50, position: 'absolute' } } />;
// 	}
//
// 	renderLoadingError = () => {
// 		return (
// 			<div style={ { margin: '50px auto' } }>
// 				<Alert message={ this.props.loadingError } type="error" />
// 			</div>
// 		);
// 	};
//
// 	renderEndOfList() {
// 		return <div style={ { height: 20 } } key="end_of_list" className={ styles.end_of_list } />;
// 	}
//
// 	renderLoadMoreButton = () => {
// 		return (
// 			<div className={ styles.load_more } style={ { height: 50 } } key="load_more">
// 				<div onClick={ this.requestOlder } className={ styles.load_more_button }>
// 					<span className={ general_styles.full_width_and_height }>Tải thêm</span>
// 				</div>
// 			</div>
// 		);
// 	};
//
// 	renderFixedHeight = () => {
// 		return <div style={ { height: 50 } } />;
// 	};
//
// 	renderRow( key, a ) {
// 		const r = a.hasFocus,
// 			i = a.isHovered,
// 			row = this.rows[ key ];
//
// 		if ( ! row || ! row.type ) return null;
// 		// console.log('row', row);
//
// 		switch ( row.type ) {
// 			case 'fix_height_50px':
// 				return this.renderFixedHeight();
// 			case 'loadMore':
// 				return this.renderLoadMoreButton();
// 			case 'loading':
// 				return this.renderLoadingMore();
// 			case 'message':
// 				return this.renderMessage( row.data, {
// 					hasFocus: r,
// 					isHovered: i,
// 					page_id: row.page_id,
// 				} );
// 			case 'dayDividerLabel':
// 				return this.renderDateGroup( row.id );
// 			case 'bySenderDivider':
// 				return this.renderSender( row );
// 			case 'end_of_list':
// 				return this.renderEndOfList();
// 			default:
// 				return <strong>Đã có lỗi xảy ra trong quá trình hiển thị tin nhắn!</strong>;
// 		}
// 	}
//
// 	render() {
// 		if ( this.props.isLoading ) {
// 			return this.renderLoading();
// 		}
//
// 		if ( ! this.props.isLoading && this.props.loadingError ) {
// 			return this.renderLoadingError();
// 		}
//
// 		const { rows, pendingMessages, pageId } = this.props;
//
// 		if ( ! rows || rows.length === 0 ) return null;
//
// 		const groups = this.groupMessagesByDate(
// 				this.orderMessagesByCreatedTime( pendingMessages ? rows.concat( pendingMessages ) : rows )
// 			),
// 			rowsResult = [],
// 			keysResult = [];
//
// 		// always keep 50px at the top of conversation, so it not change the position of view when
// 		// display loading ( height = 50px ) or not
// 		// keysResult.push( {
// 		// 	type: 'fix_height_50px'
// 		// } );
// 		// rowsResult.push( {
// 		// 	type: 'fix_height_50px',
// 		// } );
//
// 		// if ( this.props.isLoadingOlder ) {
// 		// 	keysResult.push( 'loading' );
// 		// 	rowsResult.push( {
// 		// 		type: 'loading',
// 		// 	} );
// 		// }
//
// 		// if ( this.state.hasNext && ! this.props.isLoadingOlder ) {
// 		// 	keysResult.push( 'loadMore' );
// 		// 	rowsResult.push( {
// 		// 		type: 'loadMore',
// 		// 		id: 'loadMore',
// 		// 		key: 'loadMore',
// 		// 	} );
// 		// }
//
// 		forEach( groups, group => {
// 			const date = new Date( group[ 0 ].created_time ).getTime();
// 			keysResult.push( date + '_group' );
//
// 			rowsResult.push( {
// 				type: 'dayDividerLabel',
// 				id: date,
// 				key: date + '_group',
// 			} );
//
// 			const messagesBySender = this.groupMessagesBySender( group );
// 			forEach( messagesBySender, messages => {
// 				const senderDivider = messages[ 0 ].from.id + '_' + messages[ 0 ].id;
// 				keysResult.push( senderDivider );
//
// 				rowsResult.push( {
// 					type: 'bySenderDivider',
// 					id: senderDivider,
// 					key: senderDivider,
// 					data: messages[ 0 ].from,
// 					from_page: messages[ 0 ].from.id === pageId,
// 					time: messages[ 0 ].created_time,
// 				} );
//
// 				forEach( messages, message => {
// 					keysResult.push( message.id );
//
// 					rowsResult.push( {
// 						type: 'message',
// 						id: message.id,
// 						key: message.id,
// 						data: message,
// 						page_id: pageId,
// 					} );
// 				} );
// 			} );
// 		} );
//
// 		// add end of list
// 		keysResult.push( 'end_of_list' );
// 		rowsResult.push( {
// 			type: 'end_of_list',
// 			id: 'end_of_list',
// 			key: 'end_of_list',
// 		} );
//
// 		this.rows = rowsResult;
// 		this.keys = keysResult;
//
// 		return React.createElement( AutoSizer, null, e => {
// 			const a = e.width,
// 				r = e.height;
// 			if ( 0 === a || 0 === r ) return null;
// 			if ( a !== this.width ) {
// 				this.heightCache.invalidate();
// 				this.width = a;
// 			}
// 			this.height = r;
//
// 			return (
// 				<DynamicList
// 					ref={ this.setListRef }
// 					layout={ this.layout }
// 					height={ r }
// 					width={ a }
// 					keys={ this.keys }
// 					// rows={ this.rows }
// 					rowRenderer={ this.renderRow }
// 					fadeScrollbar={ true }
// 					onScroll={ this.onScroll }
// 					loadPre={ this.debounceLoadMore }
// 					isLoading={ this.props.isLoading }
// 					isLoadingOlder={ this.props.isLoadingOlder }
// 					// shouldSetPendingScrollTop={ true }
// 					// renderAllItems={ true }
// 				/>
// 			);
// 		} );
// 	}
// }
