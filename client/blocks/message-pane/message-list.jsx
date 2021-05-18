import React from 'react';
import PropTypes from 'prop-types';
import { moment } from 'i18n-calypso';
import classnames from 'classnames';
import {
	noop,
	debounce,
	throttle,
	find,
	isNumber,
	isEqual,
	first,
	last,
	keys,
	groupBy,
	indexOf,
	sortBy,
	forEach,
	isFunction,
	includes,
} from 'lodash';
import AutoSizer from 'react-virtualized-auto-sizer';

import config from 'config';
import HeightCache from 'components/virtualized-list/height-cache';
import Avatar from 'papo-components/Avatar';
import Layout from 'components/virtualized-list/layout';
import FocusIndicator from 'blocks/focus-indicator';
import Foreword from './forword';
import TimeItem from 'blocks/conversation-timeline/time-item';
import SenderName from './sender-name';
import Message from 'blocks/conversation-timeline/message';
import Alert from 'components/alert';
import DateSeparator from 'blocks/conversation-timeline/date-separator';
import DynamicList from 'blocks/virtualized-list/message-dynamic-list';
import Loading from 'components/loading';
import DelayLoading from 'components/loading/delay-loading';
import GlobalEventEmitter from 'utils/global-event-emitter';
import EventTypes from 'utils/event-types';
import { getAvatarURL } from 'lib/facebook/utils';

import styles from 'blocks/conversation-timeline/style.scss';
import general_styles from 'components/general-styles.scss';

const Dr = 40; //80;
const Fr = 40; //60;
const Lr = 0; //21;
const Br = 0; // 64;
const Ur = 0; // 120;
const qr = 'MESSAGE-LIST';
const Gr = 864e5;
const Wr = {
	ABOVE: 1,
	VISIBLE: 2,
	BELOW: 3,
};
const Hr = '0000000000.000001';

// const LOAD_LIMIT_COUNT = 20;

export default class MessageList extends React.PureComponent {
	static displayName = 'MessageList';
	static propTypes = {
		type: PropTypes.string,
		readWatermark: PropTypes.number,
		conversationId: PropTypes.string,
		keys: PropTypes.arrayOf( PropTypes.string ),
		requestHistory: PropTypes.func,
		lastReadTs: PropTypes.string,
		isGhostLastRead: PropTypes.bool,
		startTs: PropTypes.string,
		startTsOffset: PropTypes.number,
		highlightTs: PropTypes.string,
		// rollups: PropTypes.objectOf(X["a"].Rollup()),
		setUnreadPoint: PropTypes.func,
		isLoading: PropTypes.bool,
		isLoadingOlder: PropTypes.bool,
		reachedStart: PropTypes.bool,
		reachedEnd: PropTypes.bool,
		prevReachedEnd: PropTypes.bool,
		oldest: PropTypes.string,
		latest: PropTypes.string,
		onScroll: PropTypes.func,
		onVisibleRowsChanged: PropTypes.func,
		doneHighlighting: PropTypes.func,
		isLimited: PropTypes.bool,
		isSlackbotIm: PropTypes.bool,
		isTeambotIm: PropTypes.bool,
		useStickyDayDividers: PropTypes.bool,
		shouldIgnoreScrollKeys: PropTypes.func,
		shouldIgnoreArrowKeys: PropTypes.func,
		channelSessionId: PropTypes.string,
		theme: PropTypes.string,
		firstUnreadTs: PropTypes.string,
		featureReactMessages: PropTypes.bool,
		featureTinyspeck: PropTypes.bool,
		featureJumpToUnreadShortcut: PropTypes.bool,
		featureAriaApplicationMode: PropTypes.bool,
		messageContainerType: PropTypes.string,
		ariaLabel: PropTypes.string.isRequired,
		teamId: PropTypes.string,
		enterpriseId: PropTypes.string,
		sessionId: PropTypes.string,
		msgTriggers: PropTypes.object,
		currentUserId: PropTypes.string,
		jumpToTimestamp: PropTypes.func,
		makeMessageSummary: PropTypes.func,
		isScreenReaderEnabled: PropTypes.bool,
		windowLastFocusEvent: PropTypes.number,
		onFocusEnter: PropTypes.func,
		onFocusLeave: PropTypes.func,
	};

	static defaultProps = {
		conversationId: null,
		keys: [],
		requestHistory: noop,
		lastReadTs: void 0,
		isGhostLastRead: false,
		startTs: null,
		startTsOffset: null,
		highlightTs: null,
		rollups: null,
		setUnreadPoint: noop,
		isLoading: false,
		isLoadingOlder: false,
		reachedStart: false,
		reachedEnd: false,
		prevReachedEnd: false,
		oldest: void 0,
		latest: void 0,
		onScroll: noop,
		onVisibleRowsChanged: noop,
		doneHighlighting: noop,
		isLimited: false,
		isSlackbotIm: false,
		isTeambotIm: false,
		useStickyDayDividers: true,
		shouldIgnoreScrollKeys: function e() {
			return false;
		},
		shouldIgnoreArrowKeys: function e() {
			return false;
		},
		channelSessionId: null,
		theme: 'light',
		firstUnreadTs: null,
		featureReactMessages: false,
		featureTinyspeck: false,
		featureJumpToUnreadShortcut: false,
		featureAriaApplicationMode: false,
		messageContainerType: void 0,
		teamId: null,
		enterpriseId: null,
		sessionId: null,
		msgTriggers: null,
		currentUserId: null,
		jumpToTimestamp: noop,
		makeMessageSummary: void 0,
		isScreenReaderEnabled: false,
		windowLastFocusEvent: null,
		onFocusEnter: noop,
		onFocusLeave: noop,
	};

	constructor( e ) {
		super( e );
		let r; //= Object(cr["a"])();
		this.state = {
			degraded: r,
			isLoading: e.isLoading,
			isLoadingOlder: e.isLoadingOlder,
			isSelecting: false,
			hasKeyboardFocus: false,
			limit: config( 'conversation_page_size' ),
			offset: 0,
		};
		this.DEFAULT_ROW_HEIGHT = 'light' === e.theme ? Dr : Fr;
		this.STICKY_EPSILON = 0; //this.DEFAULT_ROW_HEIGHT / 2;
		this.ANCHOR_OFFSET = 0; // r ? Ur : Br;
		this.heightCache = new HeightCache( {
			DEFAULT_HEIGHT: 40, //this.DEFAULT_ROW_HEIGHT,
		} );
		this.layout = new Layout( {
			heightCache: this.heightCache,
			stickToBottom: false, //e.reachedEnd || e.prevReachedEnd,
			shouldExcludeFirstItemFromGravity: false, //this.isFirstRowLimitedHistoryForeword.bind( this ),
			STICKY_EPSILON: 0, //this.STICKY_EPSILON,
			STICKY_EPSILON_SETHEIGHT: 0, //2,
			ANCHOR_OFFSET: 0, //this.ANCHOR_OFFSET,
		} );
		this.keys = [];
		this.rows = [];
		this.visibleRows = [];
		this.unreadIndex = null;
		this.list = null;
		this.useAnchor = true;
		this.keyToScrollTo = null;
		this.width = 0;
		this.hasRenderedOneMessage = false;
		this.requestAround = this.requestAround.bind( this );
		this.requestOlder = this.requestOlder.bind( this );
		this.requestNewer = this.requestNewer.bind( this );
		this.renderRow = this.renderRow.bind( this );
		this.setListRef = this.setListRef.bind( this );
		this.getAriaLabelForRow = this.getAriaLabelForRow.bind( this );
		this.onScroll = this.onScroll.bind( this );
		this.onListScrolled = this.onListScrolled.bind( this );
		this.onFocusEnter = this.onFocusEnter.bind( this );
		this.onFocusLeave = this.onFocusLeave.bind( this );
		this.debouncedOnListScrolled = debounce( this.onListScrolled, 150 );
		this.isMessage = this.isMessage.bind( this );
		this.onSelectionChange = this.onSelectionChange.bind( this );
		this.onJumpToUnreadShortcut = this.onJumpToUnreadShortcut.bind( this );
		this.onPageUp = this.onPageUp.bind( this );
		this.onPageDown = this.onPageDown.bind( this );
		this.onHome = this.onHome.bind( this );
		this.onEnd = this.onEnd.bind( this );
		this.scrollToOffset = throttle( this.scrollToOffset.bind( this ), 200 );
		this.onShiftPageUp = this.onShiftPageUp.bind( this );
		this.onShiftPageDown = this.onShiftPageDown.bind( this );
		this.onArrowKeyRight = this.onArrowKeyRight.bind( this );
		// this.unfurlLinkCache = new pr["a"];
		this.messagesRendered = {};
		this.loadingHistoriesSeen = 0;
		this.loadingHistoriesSeenHighEnd = 0;
		this.loadingHistoriesPerHowManyMessages = 84;
		this.loadingHistoriesPerHowManyMessagesHighEnd = 500;
		// this.scrollMetricsGatheringEnabled = Object(re["a"])(1) || this.props.featureTinyspeck;
		// if (this.scrollMetricsGatheringEnabled) {
		// 	this.debounceBatchMessagesSeen = d.this.debounce(function () {
		// 		Object(ee["h"])("modern_history_load_seen_per_84_messages", this.loadingHistoriesSeen, {
		// 			allow_zero: true
		// 		});
		// 		this.loadingHistoriesSeen = 0
		// 	}, 1e3);
		// 	this.debounceBatchMessagesSeenHighEnd = d.this.debounce(function () {
		// 		Object(ee["h"])("modern_history_load_seen_per_500_messages", this.loadingHistoriesSeenHighEnd, {
		// 			allow_zero: true
		// 		});
		// 		this.loadingHistoriesSeenHighEnd = 0
		// 	}, 1e3)
		// }
		// this.debounceCountHistoryLoadSeen = debounce( function() {
		// 	this.loadingHistoriesSeen += 1;
		// 	this.loadingHistoriesSeenHighEnd += 1;
		// }, 1e3 );
		// this.prqMetrics = {
		// 	channelSwitch: {},
		// };
	}

	componentDidMount() {
		GlobalEventEmitter.addListener(
			EventTypes.CONVERSATION_MESSAGES_LOADED,
			this.handleSuccessLoaded
		);
		GlobalEventEmitter.addListener(
			EventTypes.CONVERSATION_MESSAGES_MORE_LOADED,
			this.handleSuccessLoadedMore
		);
		GlobalEventEmitter.addListener(
			EventTypes.PENDING_MESSAGE_SUBMITED,
			this.handleSuccessSubmitPendingMessage
		);
	}

	componentWillUnmount() {
		GlobalEventEmitter.removeListener(
			EventTypes.CONVERSATION_MESSAGES_LOADED,
			this.handleSuccessLoaded
		);
		GlobalEventEmitter.removeListener(
			EventTypes.CONVERSATION_MESSAGES_MORE_LOADED,
			this.handleSuccessLoadedMore
		);
		GlobalEventEmitter.removeListener(
			EventTypes.PENDING_MESSAGE_SUBMITED,
			this.handleSuccessSubmitPendingMessage
		);
	}

	componentDidUpdate( t ) {
		if ( this.keyToScrollTo && this.list ) {
			this.list.scrollToKey( this.keyToScrollTo, {
				lazy: this.lazyScroll,
			} );
			this.keyToScrollTo = null;
		}
		this.layout.setStickToBottom( this.props.reachedEnd || this.props.prevReachedEnd );
		this.onListScrolled();
	}

	componentWillReceiveProps( t ) {
		this.setState( function( e ) {
			if ( t.isLoading === e.isLoading && t.isLoadingOlder === e.isLoadingOlder ) return null;
			return {
				isLoading: t.isLoading,
				isLoadingOlder: t.isLoadingOlder,
			};
		} );
		if (
			t.conversationId !== this.props.conversationId ||
			t.startTs !== this.props.startTs ||
			( t.highlightTs && t.highlightTs !== this.props.highlightTs ) ||
			( t.keys.length && ! this.props.keys.length )
		) {
			if ( t.conversationId === this.props.conversationId ) {
				this.useAnchor = false;
			}
			// this.useAnchor = true;
			// if (inRange(r, floor(first(n)), ceil(last(n))) && t.conversationId === this.props.conversationId) {
			// 	var s = findLast(i, function (e) {
			// 		return e <= t.startTs
			// 	});
			// 	this.keyToScrollTo = s;
			// 	this.lazyScroll = t.highlightLazy;
			// 	this.useAnchor = false
			// }
		}
		if ( t.conversationId !== this.props.conversationId ) {
			this.useAnchor = true;
			this.setState(
				{
					offset: 0,
				},
				() => {
					this.requestAround();
				}
			);

			this.heightCache.invalidate();
			this.list && this.list.resetRendered && this.list.resetRendered();
		}

		t.lastReadTs !== this.props.lastReadTs && ( this.unreadIndex = null );
	}

	handleSuccessLoaded = loaded => {
		this.setState( {
			offset: this.state.offset + loaded,
		} );
	};

	handleSuccessLoadedMore = loaded => {
		this.setState( {
			offset: this.state.offset + ( loaded || 0 ),
		} );
	};

	handleSuccessSubmitPendingMessage = () => {};

	findTimestampClosestToStartTs() {
		const t = this.props,
			a = t.startTs,
			r = t.keys;
		if ( ! r.length ) return false;
		if ( ! a ) return null;
		return find( r, function( e ) {
			return e >= a;
		} );
	}

	focus() {
		this.list.focus();
	}

	blur() {
		this.list.blur();
	}

	setListRef( t ) {
		this.list = t;
	}

	jumpToUnread( t ) {
		const a = this.props,
			r = a.lastReadTs,
			n = a.jumpToTimestamp,
			i = a.isScreenReaderEnabled;
		const s = t && 'keydown' === t.type && ( i || this.state.hasKeyboardFocus );
		const o = isNumber( this.unreadIndex ) && this.keys[ this.unreadIndex ];
		if ( s ) {
			this.focusFirstUnreadMsgAfterUpdate = true;
			if ( o ) {
				this.forceUpdate();
				return;
			}
			n( {
				ts: r,
			} );
			return;
		}
		if ( o ) {
			this.list.scrollToKey( o );
			return;
		}
		n( {
			ts: r,
		} );
	}

	isAtBottom() {
		if ( ! this.list ) return false;
		const t = this.list.getScrollTop();
		const a = this.layout.getTotalHeight();
		const r = this.height;
		return t + r >= Math.floor( a ) - this.STICKY_EPSILON;
	}

	getUnreadLinePlacement() {
		if ( 'number' !== typeof this.unreadIndex ) return Wr.ABOVE;
		if ( ! this.list ) return Wr.ABOVE;
		const t = this.list.getVisibleRange(),
			a = t.start,
			r = t.end;
		if ( this.unreadIndex < a ) return Wr.ABOVE;
		if ( this.unreadIndex < r ) return Wr.VISIBLE;
		return Wr.BELOW;
	}

	getVisibleRows() {
		if ( ! this.list ) return [];
		const t = this.list.getVisibleRange(),
			a = t.start,
			r = t.end;
		return this.rows.slice( a, r );
	}

	getScrollmarkForFocusedItem( t ) {
		const a = t === Hr ? this.props.keys[ 0 ] : t;
		return {
			mark: t,
			offset: this.layout.getTop( a ) - this.list.getScrollTop(),
		};
	}

	getScrollmark() {
		if ( ! this.list || ! this.layout ) return null;
		const t = this.state.hasKeyboardFocus ? this.list.getActiveItem() : this.previouslyActiveItem;
		this.previouslyActiveItem = null;
		if ( t ) return this.getScrollmarkForFocusedItem( t );
		const a = this.list.getScrollTop();
		if ( this.layout.shouldStickToBottom( a ) ) return null;
		const r = this.props.keys;
		const n = this.layout.findAnchor( r, r, a + this.ANCHOR_OFFSET );
		const i = this.layout.getTop( n ) - a;
		return {
			mark: n,
			offset: i,
		};
	}

	onScroll() {
		this.useAnchor = false;
		this.layout.setAnchor( false );
		this.debouncedOnListScrolled();
		this.props.onScroll();
	}

	onSelectionChange( t ) {
		if ( ! this.node ) return;
		this.setState( function() {
			return {
				isSelecting: t,
			};
		} );
	}

	isMessage( t ) {
		const a = this.rows[ t.index ];
		return a && ( 'message' === a.type || 'foreword' === a.type );
	}

	onListScrolled() {
		const t = this.getVisibleRows();
		if ( isEqual( t, this.visibleRows ) ) return;
		this.visibleRows = t;
		this.props.onVisibleRowsChanged( t );
	}

	onPageUp() {
		this.scrollToOffset( this.list.getScrollTop() - ( this.height - Lr ) );
	}

	onPageDown() {
		this.scrollToOffset( this.list.getScrollTop() + ( this.height - Lr ) );
	}

	onHome() {
		this.scrollToOffset( 0, {
			absolute: true,
		} );
	}

	onEnd() {
		this.props.reachedEnd
			? this.scrollToOffset( Infinity, {
					absolute: true,
			  } )
			: this.props.jumpToTimestamp( {
					ts: null,
			  } );
	}

	onShiftPageUp() {
		const t = this;
		const a = this.getTimestampOfPrevDay();
		if ( ! a ) return;
		const r = this.state.hasKeyboardFocus;
		if ( this.list.isScrolledToTop() && this.props.reachedStart && r ) {
			this.list.setActiveItem( this.getTimestampOfFirstMessageForDay( a ) );
			return;
		}
		const i = 0; // this.props.isBannerVisible ? Ar : Pr;
		this.jumpToTimestamp( {
			ts: null,
			offset: i,
			onJump: function e() {
				const n = t.getTimestampOfFirstMessageForDay( a );
				r && t.list.setActiveItem( n );
				t.list.scrollToKey( n, {
					lazy: t.lazyScroll,
				} );
			},
		} );
	}

	onShiftPageDown() {
		const t = this;
		const a = this.getTimestampOfNextDay();
		if ( ! a ) return;
		const r = this.state.hasKeyboardFocus;
		if ( this.list.isScrolledToBottom() && this.props.reachedEnd && r ) {
			this.list.setActiveItem( this.getTimestampOfFirstMessageForDay( a ) );
			return;
		}
		const i = 0; // this.props.isBannerVisible ? Ar : Pr;
		this.jumpToTimestamp( {
			ts: null,
			offset: i,
			onJump: function e() {
				const n = t.getTimestampOfFirstMessageForDay( a );
				r && t.list.setActiveItem( n );
				t.list.scrollToKey( n, {
					lazy: t.lazyScroll,
				} );
			},
		} );
	}

	onArrowKeyRight( t ) {
		const a = t.target;
		if ( ! a ) return;
		// if (Object(je["a"])(a)) return;
		const r = this.props,
			n = r.channelId,
			i = r.timestamps,
			s = r.featureReactThreads;
		if ( ! s ) return;
		if ( ! this.state.hasKeyboardFocus ) return;
		const o = this.list.getInitialActiveItem();
		if ( ! o || ! includes( i, o ) ) return;
		const l = this.props.showThreadIfThreadable( {
			conversationId: n,
			threadTs: o,
			requestFocus: true,
		} );
		l && this.blur();
	}

	onJumpToUnreadShortcut( t ) {
		if ( ! this.props.featureJumpToUnreadShortcut ) return;
		//if (!mr["a"]) return; ??
		this.jumpToUnread( t );
	}

	onFocusEnter( t ) {
		const a = this;
		this.setState(
			function() {
				return {
					hasKeyboardFocus: t.isKeyboardFocus,
				};
			},
			function() {
				a.props.onFocusEnter( t );
			}
		);
	}

	onFocusLeave( t ) {
		const a = this;
		this.state.hasKeyboardFocus && ( this.previouslyActiveItem = t.activeItem );
		this.setState(
			function() {
				return {
					hasKeyboardFocus: false,
				};
			},
			function() {
				a.props.onFocusLeave( t );
			}
		);
	}

	scrollToOffset() {
		let t;
		if ( ! this.list ) return;
		( t = this.list ).scrollToOffset.apply( t, arguments );
	}

	shouldShowLimitedHistoryAlert() {
		const t = this.props,
			a = t.isLimited,
			r = t.isSlackbotIm;
		return a && r;
	}

	shouldShowLimitedHistoryForeword() {
		const t = this.props,
			a = t.isLimited,
			r = t.isSlackbotIm;
		return a && ! r;
	}

	isFirstRowLimitedHistoryForeword() {
		if ( ! this.shouldShowLimitedHistoryForeword() ) return false;
		const t = first( this.rows );
		return t && 'foreword' === t.type;
	}

	requestAround() {
		//console.log( '---000: called load around' );
		//const t = this;
		// if ( this.props.isLoading || this.props.isLoadingOlder ) return false;
		// only request around for the first time
		// if ( this.props.keys && this.props.keys.length > 0 ) return false;
		// console.log( 'still called' );
		if ( this.state.isLoading ) return false;
		if ( this.props.reachedEnd ) return this.requestOlder();
		if ( this.props.reachedStart ) return this.requestNewer();

		const a = this.props,
			r = a.oldest,
			n = a.latest,
			i = a.keys,
			s = a.startTs;
		// this should request for first time
		// if (isEmpty(i) && !s) return this.props.requestHistory({
		// 	limit: this.state.limit,
		// 	offset: 0,
		// });
		const o = r || ( i && first( i ) ) || s;
		const l = n || ( i && last( i ) ) || s;

		// this.setState( function() {
		// 	return {
		// 		isLoading: true,
		// 	};
		// } );

		const c = this.props.requestHistory( {
			latest: o,
			oldest: l,
			limit: this.state.limit,
			offset: this.state.offset,
		} );

		// if ( c ) {
		// 	// c.finally( () => {
		// 	// 	return setTimeout( () => {
		// 	// 		this.setState( function() {
		// 	// 			return {
		// 	// 				isLoading: false,
		// 	// 			};
		// 	// 		} );
		// 	// 	}, 250 );
		// 	// } ).then( () => {} );
		// }

		return c;
	}

	requestOlder() {
		//console.log( 'called load older' );
		// if ( this.list && this.list.isScrolling() ) {
		// 	// alert("no request");
		// 	return false;
		// }
		// return;
		//const t = this;
		// if ( this.props.isLoading || this.props.isLoadingOlder ) return false;
		if ( this.props.reachedStart ) return false;
		const a = this.props,
			r = a.oldest,
			n = a.keys,
			i = a.startTs;
		// const s = r || ( n && first( n ) ) || i;

		// this.setState( function() {
		// 	return {
		// 		isLoading: true,
		// 		isLoadingOlder: true,
		// 	};
		// } );

		const c = this.props.requestHistory( {
			limit: this.state.limit,
			offset: this.state.offset,
		} );

		// if ( c ) {
		// 	// c.finally( () => {
		// 	// 	return setTimeout( () => {
		// 	// 		this.setState( function() {
		// 	// 			return {
		// 	// 				isLoading: false,
		// 	// 				isLoadingOlder: false,
		// 	// 			};
		// 	// 		} );
		// 	// 	}, 250 );
		// 	// } ).then( () => {} );
		// }

		return c;
	}

	requestNewer() {
		//console.log( '22222: called load newer..' );
		return; //
		// //const t = this;
		// if ( this.state.isLoading ) return false;
		// const a = this.props,
		// 	r = a.latest,
		// 	n = a.keys,
		// 	i = a.startTs;
		// const s = r || ( n && last( n ) ) || i;
		// const o = this.props.requestHistory( {
		// 	oldest: s,
		// } );
		// if ( o ) {
		// 	//this.prqMetrics.channelSwitch.fetchHistoryState !== le && (this.prqMetrics.channelSwitch.fetchHistoryState = oe);
		// 	o.then( function() {
		// 		//t.prqMetrics.channelSwitch.fetchHistoryState = le
		// 	} );
		// 	this.setState( function() {
		// 		return {
		// 			isLoading: true,
		// 			isLoadingOlder: false,
		// 		};
		// 	} );
		// }
		// return o;
	}

	renderMessage( t, a ) {
		const r = a.hasFocus,
			i = a.isHovered;
		const s = t.id,
			o = null; //t.previousMessageTs;
		const l = last( this.props.keys );
		const c = s && s === this.props.highlightTs;

		const page_id = t.page_id;

		const p = React.createElement( Message, {
			type: this.props.type,
			readWatermark: this.props.readWatermark,
			ts: s,
			key: s,
			message: t,
			conversationId: this.props.conversationId,
			fromPage: t.from === page_id,
			previousMessageTs: o,
			isLast: s === l,
			fadeAwayHighlight: c,
			doneHighlighting: this.props.doneHighlighting,
			isHovered: i,
			messageContainerType: this.props.messageContainerType,
			renderActions: i || r,
			hasFocus: r,
			onClickImage: this.props.onClickImage,
		} );
		if ( r )
			return [
				p,
				React.createElement( FocusIndicator, {
					key: 'message-list-focus-indicator',
				} ),
			];
		return p;
	}

	renderForeword( t ) {
		const a = t.hasFocus;
		const r = React.createElement( Foreword, {
			key: 'message-list-foreword',
			channelType: this.props.channelType,
			conversationId: this.props.conversationId,
			hasLimitedHistory: this.shouldShowLimitedHistoryForeword(),
		} );
		if ( a )
			return [
				r,
				React.createElement( FocusIndicator, {
					key: 'message-list-focus-indicator',
				} ),
			];
		return r;
	}

	onError = () => {
		// error on getting image
	};

	orderMessagesByCreatedTime( messages ) {
		return sortBy( messages, [ 'created_time' ] );
	}

	renderDateGroup = date => {
		return <DateSeparator key={ date } date={ new Date( date ) } />;
	};

	renderSender = sender => {
		const { page, type } = this.props;

		const avatarURL =
			page && page.data && page.data.access_token
				? getAvatarURL( sender.data, 50, page.data.access_token )
				: null;

		if ( sender.from_page === true ) {
			return (
				<span
					className={ classnames( styles.group__sender__name, {
						[ styles.sender_name_type_message ]: type === 'message',
					} ) }
				>
					<SenderName from={ sender.data } />
					<TimeItem time={ sender.time } />
				</span>
			);
		}
		return (
			<div className={ styles.sender__group } key={ sender.id } style={ { height: 32 } }>
				<div className={ styles.user__avatar }>
					<div className={ styles.avatar_image }>
						<Avatar
							size="size36"
							color="grey"
							imgProps={ { src: avatarURL } }
							name={ sender.data }
						/>
					</div>
				</div>
				<div className={ styles.group__sender__name + ' ' + styles.customer }>
					<SenderName from={ sender.data } />
					<TimeItem time={ sender.time } />
				</div>
			</div>
		);
	};

	renderLoading() {
		return <DelayLoading delayTime={ 100 } />;
	}

	renderLoadingMore() {
		return <Loading style={ { height: 50, position: 'absolute' } } />;
	}

	renderLoadingError = () => {
		return (
			<div style={ { margin: '50px auto' } }>
				<Alert message={ this.props.loadingError } type="error" />
			</div>
		);
	};

	renderEndOfList() {
		return <div style={ { height: 20 } } key="end_of_list" className={ styles.end_of_list } />;
	}

	renderLoadMoreButton = () => {
		return (
			<div className={ styles.load_more } style={ { height: 50 } } key="load_more">
				<div onClick={ this.requestOlder } className={ styles.load_more_button }>
					<span className={ general_styles.full_width_and_height }>Tải thêm</span>
				</div>
			</div>
		);
	};

	groupMessagesBySender = messages => {
		const grouped = messages.reduce(
			( { user_id, group, groups }, message ) => {
				const author = message && message.from ? message.from : null;
				if ( user_id !== author ) {
					return {
						user_id: author,
						group: [ message ],
						groups: group ? groups.concat( [ group ] ) : groups,
					};
				}
				// it's the same user so group it together
				return { user_id, group: group.concat( [ message ] ), groups };
			},
			{ groups: [] }
		);

		return grouped.groups.concat( [ grouped.group ] );
	};

	sameDay = ( d1, d2 ) => {
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	};

	groupMessagesByDate = messages => {
		const grouped = messages.reduce(
			( { group, groups, created_time }, message ) => {
				if ( ! this.sameDay( new Date( created_time ), new Date( message.created_time ) ) ) {
					return {
						created_time: message.created_time,
						group: [ message ],
						groups: group ? groups.concat( [ group ] ) : groups,
					};
				}
				return { created_time, group: group.concat( [ message ] ), groups };
			},
			{ groups: [] }
		);

		return grouped.groups.concat( [ grouped.group ] );
	};

	renderLoadingPlaceholder = () => {
		return <div style={ { width: '100%', height: 56 } } />;
	};

	renderReadWatermark = row => {
		// console.log("row", row);
		const { page } = this.props;

		const avatarURL =
			page && page.data && page.data.access_token
				? getAvatarURL( row.data.id, 50, page.data.access_token )
				: null;

		return (
			<div title={ 'Đã xem' } className={ styles.message_seen_indicator }>
				<Avatar size="size18" color="grey" imgProps={ { src: avatarURL } } />
			</div>
		);
	};

	renderRow( key, a ) {
		const r = a && a.hasFocus,
			i = a && a.isHovered,
			row = this.rows[ key ];

		if ( ! row || ! row.type ) return null;
		// console.log('row', row);

		switch ( row.type ) {
			case 'fix_height_50px':
				return this.renderFixedHeight();
			case 'loadMore':
				return this.renderLoadMoreButton();
			case 'loading':
				return this.renderLoadingMore();
			case 'loading_placeholder':
				return this.renderLoadingPlaceholder();
			case 'message':
				return this.renderMessage( row.data, {
					hasFocus: r,
					isHovered: i,
					page_id: row.page_id,
				} );
			case 'dayDividerLabel':
				return this.renderDateGroup( row.id );
			case 'bySenderDivider':
				return this.renderSender( row );
			case 'end_of_list':
				return this.renderEndOfList();
			case 'read_watermark':
				return this.renderReadWatermark( row );
			default:
				return <strong>Đã có lỗi xảy ra trong quá trình hiển thị tin nhắn!</strong>;
		}
	}

	isItemAriaExpanded( t, a ) {
		// temporary return false
		return false;
	}

	getAriaLabelForRow( t ) {
		const a = this.rows[ t ];
		if ( ! a || ! a.type ) return;
		if ( 'message' !== a.type ) return;
		const r = a.ts,
			n = a.previousMessageTs,
			i = a.isFirstMsgForDay,
			s = a.isLastMsgForDay,
			o = a.isFirstUnreadMsg,
			l = a.day;
		const c = this.props,
			u = c.conversationId,
			d = c.makeMessageSummary;
		const p = this.props.rollups[ r ];
		if ( d )
			return d( {
				conversationId: u,
				ts: r,
				isFirstUnreadMsg: o,
				isFirstMsgForDay: i,
				isLastMsgForDay: s,
				previousMessageTs: n,
				day: l,
				rollup: p,
				hasFocus: this.state.hasKeyboardFocus,
			} );
	}

	groupkeysByDay( t ) {
		const a = this;
		return groupBy( t, function( e ) {
			return a.getDayTimestampForMessage( e );
		} );
	}

	getDayTimestampForMessage( t ) {
		// ??????????????????????????????????????????
		if ( ! t ) return;
		const a = moment( t );
		const r = new Date( a.getFullYear(), a.getMonth(), a.getDate() );
		return r.getTime().toString();
	}

	getkeysForDays( t ) {
		return keys( this.groupkeysByDay( t ) ).sort();
	}

	getTimestampOfDayClosestToTop() {
		const t = this.list.getVisibleRange(),
			a = t.start;
		const r = this.rows[ a ];
		if ( ! r ) return;
		if ( 'dayDividerLabel' === r.type ) return r.id;
		if ( 'message' === r.type ) return r.data.created_time;
	}

	getStartTimestampForDayNavigation() {
		if ( this.state.hasKeyboardFocus )
			return this.getDayTimestampForMessage( this.list.getInitialActiveItem() );
		return this.getTimestampOfDayClosestToTop();
	}

	getTimestampOfPrevDay() {
		const t = this.getStartTimestampForDayNavigation();
		const a = this.getTimestampOfFirstMessageForDay( t );
		if ( ! a ) return t;
		if ( a && ! this.list.isItemInView( a ) ) return t;
		const r = this.getkeysForDays( this.props.keys );
		const n = indexOf( r, t );
		const i = n - 1;
		return r[ i ];
	}

	getTimestampOfNextDay() {
		const t = this.getStartTimestampForDayNavigation();
		const a = this.getkeysForDays( this.props.keys );
		const r = indexOf( a, t );
		const n = a[ r + 1 ];
		if ( n ) return n;
		return ( parseInt( t, 10 ) + Gr ).toString();
	}

	getTimestampOfFirstMessageForDay( t ) {
		const a = this.getkeysForDays( this.props.keys );
		const r = indexOf( a, t );
		if ( r < 0 ) return;
		if ( 0 === r && ! this.props.reachedStart ) return;
		const n = this.groupkeysByDay( this.props.keys );
		const i = n[ t ];
		return i ? i[ 0 ] : void 0;
	}

	jumpToTimestamp( t ) {
		const a = t.ts,
			r = t.offset,
			n = t.onJump;
		isFunction( n ) && ( this.onJump = n );
		this.props.jumpToTimestamp( {
			ts: a,
			offset: r,
		} );
	}

	render() {
		if ( this.state.isLoading && ! this.props.reachedEnd ) {
			return this.renderLoading();
		}

		if ( ! this.props.isLoading && this.props.loadingError ) {
			return this.renderLoadingError();
		}

		const { rows, pendingMessages, pageId, from, readWatermark } = this.props;

		pendingMessages && rows.concat( pendingMessages );
		readWatermark > 0 &&
			rows &&
			! includes( rows, { type: 'read_watermark' } ) &&
			rows.push( {
				type: 'read_watermark',
				created_time: new Date( readWatermark ).toISOString(),
				from: 'system',
				id: from,
			} );

		const rowsResult = [],
			keysResult = [];

		// if ( this.state.isLoadingOlder && !this.props.reachedStart ) {
		// 	keysResult.push( 'loading_placeholder' );
		// 	rowsResult.push( {
		// 		type: 'loading_placeholder',
		// 	} );
		// }

		const sortedByCreatedTimeMessages = this.orderMessagesByCreatedTime( rows );

		if ( rows && rows.length > 0 ) {
			const groups = this.groupMessagesByDate( sortedByCreatedTimeMessages );

			// console.log("groups", groups);

			forEach( groups, group => {
				const date = new Date( group[ 0 ].created_time ).getTime();
				keysResult.push( date + '_group' );

				rowsResult.push( {
					type: 'dayDividerLabel',
					id: date,
					key: date + '_group',
				} );

				const messagesBySender = this.groupMessagesBySender( group );
				forEach( messagesBySender, messages => {
					// console.log('messagesBySender', messagesBySender);
					const senderDivider =
						messages[ 0 ].type !== 'read_watermark'
							? messages[ 0 ].from + '_' + messages[ 0 ].id
							: null;
					if ( senderDivider ) {
						keysResult.push( senderDivider );

						rowsResult.push( {
							type: 'bySenderDivider',
							id: senderDivider,
							key: senderDivider,
							data: messages[ 0 ].from,
							from_page: messages[ 0 ].from === pageId,
							time: messages[ 0 ].created_time,
						} );
					}

					if ( messages[ 0 ].type === 'read_watermark' ) {
						keysResult.push( 'read_watermark' );
						rowsResult.push( {
							type: 'read_watermark',
							id: 'read_watermark',
							key: 'read_watermark',
							data: messages[ 0 ],
						} );
					}

					forEach( messages, message => {
						if ( message.type !== 'read_watermark' ) {
							keysResult.push( message.id );

							rowsResult.push( {
								type: 'message',
								id: message.id,
								key: message.id,
								data: message,
								page_id: pageId,
							} );
						}
					} );
				} );
			} );
		}

		// add end of list
		keysResult.push( 'end_of_list' );
		rowsResult.push( {
			type: 'end_of_list',
			id: 'end_of_list',
			key: 'end_of_list',
		} );

		this.rows = rowsResult;
		this.keys = keysResult;

		this.layout.setAnchor(
			this.useAnchor && this.keys[ this.keys.length - 1 ],
			this.useAnchor && 0
		);

		const v = [
			{
				keys: [ 'command+j', 'ctrl+j' ],
				handler: this.onJumpToUnreadShortcut,
			},
			{
				keys: [ 'shift+pagedown' ],
				handler: this.onShiftPageDown.bind( this ),
				filter: false,
			},
			{
				keys: [ 'shift+pageup' ],
				handler: this.onShiftPageUp.bind( this ),
				filter: false,
			},
			{
				keys: [ 'right' ],
				handler: this.onArrowKeyRight,
				filter: false,
			},
		];

		const c = this.props.firstUnreadTs;
		const m = {
			firstVisibleUnreadTs: c,
			isGhostLastRead: this.props.isGhostLastRead,
			highlightTs: this.props.highlightTs,
			lastTimestamp: last( this.props.keys ),
			reachedEnd: this.props.reachedEnd,
			isLimited: this.props.isLimited,
			isTeambotIm: this.props.isTeambotIm,
			useStickyDayDividers: this.props.useStickyDayDividers,
		};

		return React.createElement( AutoSizer, null, e => {
			const a = e.width,
				r = e.height;
			if ( 0 === a || 0 === r ) return null;
			if ( a !== this.width ) {
				// this.heightCache.invalidate();
				this.width = a;
			}
			this.height = r;

			return (
				<DynamicList
					ref={ this.setListRef }
					layout={ this.layout }
					height={ r }
					width={ a }
					keys={ this.keys }
					// rows={ this.rows }
					rowRenderer={ this.renderRow }
					fadeScrollbar={ true }
					onScroll={ this.onScroll }
					stickyOffsetTop={ -21 }
					stickyZIndex={ 200 }
					loadPre={ this.requestOlder }
					loadAround={ this.requestAround }
					loadPost={ this.requestNewer }
					reachedStart={ this.props.reachedStart }
					reachedEnd={ this.props.reachedEnd }
					onSelectionChange={ this.onSelectionChange }
					onPageUp={ this.onPageUp }
					onPageDown={ this.onPageDown }
					onHome={ this.onHome }
					onEnd={ this.onEnd }
					onFocusEnter={ this.onFocusEnter }
					onFocusLeave={ this.onFocusLeave }
					keyCommands={ v }
					shouldIgnoreScrollKeys={ this.props.shouldIgnoreScrollKeys }
					shouldIgnoreArrowKeys={ this.props.shouldIgnoreArrowKeys }
					isFocusableItem={ this.isMessage }
					unrelatedUpdateProps={ m }
					featureReactMessages={ this.props.featureReactMessages }
					useAriaApplicationMode={ this.props.featureAriaApplicationMode }
					isLoading={ this.state.isLoading }
					isLoadingOlder={ this.state.isLoadingOlder }
					isItemAriaExpanded={ this.isItemAriaExpanded }
					onKeyDown={ this.props.onKeyDown }
					// shouldSetPendingScrollTop={ true }
					// renderAllItems={ true }
				/>
			);
		} );
	}
}
