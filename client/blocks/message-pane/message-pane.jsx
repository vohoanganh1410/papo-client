import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, filter, isEmpty, get, values } from 'lodash';

import MessageList from './message-list';
import FocusableSection from 'components/focusable-section';
import { numToWords } from 'utils/number-to-words';

const Dr = 80;
const Fr = 60;
const Lr = 21;
const Br = 64;
const Ur = 120;
const qr = 'MESSAGE-LIST';
const Gr = 864e5;
const Wr = {
	ABOVE: 1,
	VISIBLE: 2,
	BELOW: 3,
};

const o = {
	MESSAGE_PANE: 'message_pane',
	WINDOW_NOT_FOCUSED: 'window_not_focused',
	WORKSPACE_NOT_FOCUSED: 'workspace_not_focused',
	MODAL: 'fs_modal_is_showing',
	SEARCH: 'universal_search_is_showing',
};

const Hr = '0000000000.000001';

const v = {
	UNKNOWN: 0,
	COMPLETED: 1,
	TIMED_OUT: 2,
	ABANDONED: 3,
};

const Va = Object.freeze( {
	NOT_STARTED: 'NOT_STARTED',
	LOADING: 'LOADING',
	ACTIVE: 'ACTIVE',
	CANCELLED: 'CANCELLED',
	COMPLETE: 'COMPLETE',
} );

export default class MessagePane extends React.PureComponent {
	static displayName = 'MessagePane';
	static propTypes = {
		conversationId: PropTypes.string,
		channelDisplayName: PropTypes.string,
		type: PropTypes.oneOf( [ 'channel', 'private', 'im', 'mpim', 'message', 'comment' ] ),
		readWatermark: PropTypes.number,
		theme: PropTypes.oneOf( [ 'light', 'dense' ] ),
		timestamps: PropTypes.arrayOf( PropTypes.string ),
		reachedStart: PropTypes.bool,
		reachedEnd: PropTypes.bool,
		prevReachedEnd: PropTypes.bool,
		oldest: PropTypes.string,
		latest: PropTypes.string,
		fetchHistory: PropTypes.func,
		fetchSliHighlights: PropTypes.func,
		onMount: PropTypes.func,
		lastReadTs: PropTypes.string,
		isGhostLastRead: PropTypes.bool,
		unreadCount: PropTypes.number,
		unreadCountKnown: PropTypes.bool,
		startTs: PropTypes.string,
		startTsOffset: PropTypes.number,
		highlightTs: PropTypes.string,
		highlightLazy: PropTypes.bool,
		// rollups: PropTypes.objectOf(X["a"].Rollup()),
		isLoading: PropTypes.bool,
		isLoadingOlder: PropTypes.bool,
		setUnreadPoint: PropTypes.func,
		markMostRecentMsgRead: PropTypes.func,
		setUnreadLineVisibility: PropTypes.func,
		clearHighlightTs: PropTypes.func,
		jumpToTimestamp: PropTypes.func,
		saveScrollmark: PropTypes.func,
		isArchived: PropTypes.bool,
		isLimited: PropTypes.bool,
		isSlackbotIm: PropTypes.bool,
		overlayVisible: PropTypes.bool,
		channelSessionId: PropTypes.string,
		prevChannelSwitchTs: PropTypes.string,
		newxpOnboardingStep: PropTypes.string,
		firstUnreadTs: PropTypes.string,
		featureReactMessages: PropTypes.bool,
		featureTinyspeck: PropTypes.bool,
		featureJumpToUnreadShortcut: PropTypes.bool,
		useGlobalNav: PropTypes.bool,
		featureClassicNav: PropTypes.bool,
		featureAriaApplicationMode: PropTypes.bool,
		teamId: PropTypes.string,
		enterpriseId: PropTypes.string,
		sessionId: PropTypes.string,
		msgTriggers: PropTypes.object,
		hasMessagePaneUnmounted: PropTypes.bool,
		setMessagePaneHasUnmounted: PropTypes.func,
		currentUserId: PropTypes.string,
		isAppSpaceOpen: PropTypes.bool,
		isShared: PropTypes.bool,
		isOrgShared: PropTypes.bool,
		isYou: PropTypes.bool,
		isMuted: PropTypes.bool,
		hasUnreads: PropTypes.bool,
		hasDraft: PropTypes.bool,
		badgeCount: PropTypes.number,
		screenReaderOverride: PropTypes.bool,
		windowLastBlurEvent: PropTypes.number,
		windowLastFocusEvent: PropTypes.number,
		makeMessageSummary: PropTypes.func,
		isScreenReaderEnabled: PropTypes.bool,
	};

	static defaultProps = {
		conversationId: null,
		channelDisplayName: void 0,
		type: 'channel',
		theme: 'light',
		timestamps: [],
		reachedStart: false,
		reachedEnd: false,
		prevReachedEnd: false,
		oldest: void 0,
		latest: void 0,
		fetchHistory: noop,
		fetchSliHighlights: noop,
		onMount: noop,
		lastReadTs: void 0,
		isGhostLastRead: false,
		unreadCount: 0,
		unreadCountKnown: false,
		startTs: null,
		startTsOffset: null,
		highlightTs: null,
		highlightLazy: void 0,
		rollups: null,
		isLoading: false,
		isLoadingOlder: false,
		setUnreadPoint: noop,
		markMostRecentMsgRead: noop,
		setUnreadLineVisibility: noop,
		clearHighlightTs: noop,
		jumpToTimestamp: noop,
		saveScrollmark: noop,
		isArchived: false,
		isLimited: false,
		isSlackbotIm: false,
		overlayVisible: false,
		channelSessionId: null,
		prevChannelSwitchTs: null,
		newxpOnboardingStep: null,
		firstUnreadTs: null,
		featureReactMessages: false,
		featureTinyspeck: false,
		featureJumpToUnreadShortcut: false,
		useGlobalNav: false,
		featureClassicNav: false,
		featureAriaApplicationMode: false,
		teamId: null,
		enterpriseId: null,
		sessionId: null,
		msgTriggers: null,
		hasMessagePaneUnmounted: false,
		setMessagePaneHasUnmounted: noop,
		currentUserId: null,
		isAppSpaceOpen: false,
		isShared: false,
		isOrgShared: false,
		isYou: false,
		isMuted: false,
		hasUnreads: false,
		hasDraft: false,
		badgeCount: 0,
		screenReaderOverride: void 0,
		windowLastBlurEvent: null,
		windowLastFocusEvent: null,
		makeMessageSummary: void 0,
		isScreenReaderEnabled: false,
	};

	constructor( props ) {
		super( props );

		this.list = null;
		this.onFocusEnter = this.onFocusEnter.bind( this );
		this.onFocusLeave = this.onFocusLeave.bind( this );
		this.onVisibleRowsChanged = this.onVisibleRowsChanged.bind( this );
		this.setListRef = this.setListRef.bind( this );
		this.shouldIgnoreScrollKeys = this.shouldIgnoreScrollKeys.bind( this );
		this.shouldIgnoreArrowKeys = this.shouldIgnoreArrowKeys.bind( this );
		this.requestHistory = this.requestHistory.bind( this );
		this.jumpToMostRecent = this.jumpToMostRecent.bind( this );
		this.jumpToUnread = this.jumpToUnread.bind( this );
		this.state = {
			showingArchiveBanner: false,
			unreadPlacement: Wr.VISIBLE,
		};
		this.historyRequests = {};
		this.prqMetrics = {
			usableVisible: {},
		};
		this.sendSessionFrameStats = this.sendSessionFrameStats.bind( this );
		this.recordSessionFrameStats = this.recordSessionFrameStats.bind( this );
	}

	componentDidMount() {
		const t = this;
		this.props.onMount();
		const a = !! this.props.timestamps.length;
		const r = !! ( this.props.unreadCount || this.props.unreadCountKnown );
		a &&
			r &&
			( 'channel' === this.props.type || 'private' === this.props.type ) &&
			this.props.fetchSliHighlights( {
				conversationId: this.props.conversationId,
				timestamps: filter( this.props.timestamps, function( e ) {
					return e > t.props.lastReadTs;
				} ),
				lastReadTs: this.props.lastReadTs,
				prevChannelSwitchTs: this.props.prevChannelSwitchTs,
			} );
		this.recordAndTrackTimeToVisible();
		document.hasFocus()
			? this.recordSessionFrameStats()
			: window.addEventListener( 'focus', this.recordSessionFrameStats );
	}

	componentWillReceiveProps( t ) {
		// const a = this;

		this.setState( function( e ) {
			if ( t.isLoading === e.isLoading && t.isLoadingOlder === e.isLoadingOlder ) return null;

			return {
				isLoading: t.isLoading,
				isLoadingOlder: t.isLoadingOlder,
			};
		} );

		const r = this.props.conversationId;
		// this.setState( function( e ) {
		// 	const rr = a.getUnreadLinePlacement();
		// 	if ( ! t.isLoading && ! isEmpty( t.timestamps ) ) {
		// 		const n = false === t.reachedEnd && ! t.prevReachedEnd;
		// 		if ( n !== e.showingArchiveBanner )
		// 			return Object.assign( {}, e, {
		// 				unreadPlacement: rr,
		// 				showingArchiveBanner: n,
		// 			} );
		// 	}
		// 	if ( e.unreadPlacement !== rr )
		// 		return Object.assign( {}, e, {
		// 			unreadPlacement: rr,
		// 		} );
		// 	return e;
		// } );
		if ( r && t.conversationId !== r ) {
			// const n = this.list && this.list.getScrollmark();
			// console.log("this.list.getScrollmark()", this.list.getScrollmark());
			// this.props.saveScrollmark( {
			// 	conversationId: r,
			// 	scrollmark: n,
			// } );
			this.historyRequests = {};
			// this.recordAndTrackTimeToUsable( v.ABANDONED );
		}
		// const i = this.props.timestamps.length !== t.timestamps.length;
		// const s =
		// 	this.props.unreadCount !== t.unreadCount ||
		// 	this.props.unreadCountKnown !== t.unreadCountKnown;
		// ! t.conversationId ||
		// 	( ! i && ! s ) ||
		// 	( 'channel' !== t.type && 'private' !== t.type ) ||
		// 	this.props.fetchSliHighlights( {
		// 		conversationId: t.conversationId,
		// 		timestamps: filter( t.timestamps, function( e ) {
		// 			return e > t.lastReadTs;
		// 		} ),
		// 		lastReadTs: t.lastReadTs,
		// 		prevChannelSwitchTs: this.props.prevChannelSwitchTs,
		// 	} );
	}

	componentDidUpdate() {
		if ( this.list ) {
			const t = this.isUnreadLineVisible();
			this.props.setUnreadLineVisibility( t );
		}
		( ( true === this.props.reachedStart && true === this.props.reachedEnd ) ||
			this.props.timestamps.length > 0 ) &&
			this.recordAndTrackTimeToUsable( v.COMPLETED );
	}

	componentWillUnmount() {
		//this.sendSessionFrameStats();
		//window.removeEventListener( 'focus', this.recordSessionFrameStats );
		this.props.setMessagePaneHasUnmounted( true );
	}

	onFocusEnter( t ) {
		this.hasFocus = true;
		this.hasKeyboardFocus = t.isKeyboardFocus;
	}

	onFocusLeave() {
		this.hasFocus = false;
		this.hasKeyboardFocus = false;
	}

	onVisibleRowsChanged() {
		if ( ! this.list ) return;
		const t = this.getUnreadLinePlacement();
		this.setState( function() {
			return {
				unreadPlacement: t,
			};
		} );
		const a = this.isUnreadLineVisible();
		this.props.setUnreadLineVisibility( a );
	}

	getUnreadLinePlacement() {
		if ( ( 1 === this.props.unreadCount && ! this.props.unreadCountKnown ) || ! this.list )
			return Wr.VISIBLE;
		return this.list.getUnreadLinePlacement();
	}

	setListRef( t ) {
		this.list = t;
	}

	focus() {
		this.list.focus();
	}

	blur() {
		this.list.blur();
	}

	recordAndTrackTimeToVisible() {
		// if (this.props.hasMessagePaneUnmounted) return;
		// if (0 !== this.props.windowLastBlurEvent) {
		// 	this.prqMetrics.usableVisible = {};
		// 	return
		// }
		// var t = Object(ee["f"])("prq_time_to_visible", "navigationStart", null, {
		// 	return_unprocessed: true
		// }).unprocessed;
		// this.prqMetrics.usableVisible = L()({}, this.props.conversationId, t);
		// pe(t, "APP_ICON", false, this.props.teamId, this.props.enterpriseId, this.props.sessionId, this.props.currentUserId, window.desktop);
		// this.props.setMessagePaneHasUnmounted(true)
	}

	recordAndTrackTimeToUsable( t ) {
		// if (0 === Object.keys(this.prqMetrics.usableVisible).length) return;
		// if (0 !== this.props.windowLastBlurEvent) {
		// 	this.prqMetrics.usableVisible = {};
		// 	return
		// }
		// var a = Object(ee["f"])("prq_time_to_usable", "navigationStart", null, {
		// 	return_unprocessed: true
		// }).unprocessed;
		// de(a, "APP_ICON", true, this.props.teamId, this.props.enterpriseId, this.props.sessionId, this.props.currentUserId, t, window.desktop);
		// this.prqMetrics.usableVisible = {}
	}

	recordSessionFrameStats() {
		window.removeEventListener( 'focus', this.recordSessionFrameStats );
		window.addEventListener( 'blur', this.sendSessionFrameStats );
		window.addEventListener( 'beforeunload', this.sendSessionFrameStats );
		// be(this.props.teamId, this.props.enterpriseId, ne["j"].PRQ_SESSION_FRAME_STATS) && Object(ge["g"])()
	}

	sendSessionFrameStats() {
		window.addEventListener( 'focus', this.recordSessionFrameStats );
		window.removeEventListener( 'blur', this.sendSessionFrameStats );
		window.removeEventListener( 'beforeunload', this.sendSessionFrameStats );
		// if (!Object(ge["e"])()) return;
		// Object(ge["i"])();
		// var t = Object(ge["a"])();
		// if (0 === t.durationMs) return;
		// me(t.durationMs, t.histFrameRenderTime, t.histJankyWindows, this.props.teamId, this.props.enterpriseId, this.props.sessionId, this.props.currentUserId, window.desktop)
	}

	shouldIgnoreScrollKeys( t ) {
		// const a = t.target;
		// const r = a === document.body;
		// const n = this.hasFocus;
		// const i = Object(ke["e"])();
		// return !(r || n || i)
		return true;
	}

	shouldIgnoreArrowKeys() {
		// var a = t.target;
		// var r = document.querySelector(".client_channels_list_container");
		// var n = document.getElementById("col_flex");
		// var i = r && r.contains(a);
		// var s = n && n.contains(a);
		// return !Object(ke["f"])() || s || i || !this.hasKeyboardFocus
		return false;
	}

	isUnreadLineVisible() {
		const t = this.props,
			a = t.isGhostLastRead,
			r = t.unreadCount,
			n = t.reachedEnd,
			i = t.isLoading;
		if ( i ) return false;
		if ( ! a && this.list.getUnreadLinePlacement() === Wr.VISIBLE ) return true;
		if ( ! r && n && this.list.isAtBottom() ) return true;
		return false;
	}

	componentDidCatch( t ) {
		this.setState( function() {
			return {
				caughtError: true,
			};
		} );
		// var a = t ? t.message : "";
		// var r = t ? t.stack : "";
		// var n = Object(I["a"])({
		// 	teamId: this.props.teamId
		// });
		// n.error("MessagePane componentDidCatch: " + a);
		// r && n.error(r)
	}

	logHistoryRequest = t => {
		var a = t.oldest,
			r = t.latest,
			n = t.now,
			i = void 0 === n ? Date.now() : n;
		var s = a + '_' + r;
		var o = this.historyRequests[ s ];
		if ( ! o ) {
			o = {
				count: 0,
				time: 0,
			};
			this.historyRequests[ s ] = o;
		}
		if ( i - 1e4 > o.time ) {
			o.count = 1;
			o.time = i;
		} else o.count += 1;
		this.historyRequests.lastRequestTime = Date.now();
	};

	shouldPreventHistoryRequest = t => {
		// prevent user scroll very fast
		// don't request after 500ms
		if ( Date.now() - this.historyRequests.lastRequestTime < 500 ) return true;

		const a = t.oldest,
			r = t.latest,
			n = t.now,
			i = void 0 === n ? Date.now() : n;
		const s = this.historyRequests[ a + '_' + r ];
		if ( ! s ) return false;
		if ( s.count >= 1 ) return true;
		if ( s.time < i - 1e4 ) return false;
		return true;
	};

	requestHistory( queryData ) {
		const { reachedStart, reachedEnd, conversationId } = this.props;

		if ( this.state.isLoading ) return false;

		if ( reachedStart && reachedEnd ) return false;

		if ( ! queryData || isEmpty( queryData ) || ! queryData.limit || ! conversationId ) return;

		if (
			this.shouldPreventHistoryRequest( {
				oldest: queryData.limit,
				latest: queryData.offset,
			} )
		) {
			return false;
		}

		let p;

		if ( queryData.offset > 0 ) {
			p = this.props.requestMoreConversation( conversationId, queryData.limit, queryData.offset );
		} else {
			p = this.props.requestConversation( conversationId, queryData.limit, queryData.offset );
		}

		if ( p ) {
			this.logHistoryRequest( {
				oldest: queryData.limit,
				latest: queryData.offset,
			} );

			this.setState( function() {
				return {
					isLoading: true,
					isLoadingOlder: false,
				};
			} );
		}
	}

	jumpToMostRecent() {
		this.props.jumpToTimestamp( {
			ts: null,
		} );
	}

	jumpToUnread( t ) {
		this.list.jumpToUnread( t );
	}

	renderArchivesBanner() {
		if ( ! this.state.showingArchiveBanner ) return null;
		const t = this.props.timestamps;
		if ( isEmpty( t ) ) return null;
		return <div>ArchivesBanner</div>;
		// return n.a.createElement(sn, {
		// 	firstTimestamp: d.a.first(t),
		// 	lastTimestamp: d.a.last(t),
		// 	jumpToRecent: this.jumpToMostRecent
		// })
	}

	renderUnreadBanner() {
		const t = this.props,
			a = t.unreadCount,
			r = t.unreadCountKnown,
			i = t.lastReadTs,
			s = t.conversationId,
			o = t.isGhostLastRead,
			l = t.markMostRecentMsgRead,
			c = t.timestamps,
			u = t.reachedEnd,
			d = t.newxpOnboardingStep,
			p = t.overlayVisible,
			m = t.isArchived,
			h = t.featureJumpToUnreadShortcut;
		if ( p ) return null;
		if ( d && d !== Va.CANCELLED && d !== Va.COMPLETE ) return null;
		if ( m ) return null;
		const f =
			c.length && u
				? c.filter( function( e ) {
						return e > i;
				  } ).length
				: a;
		return <div>Unread banner</div>;
		// return React.createElement(yn, {
		// 	conversationId: s,
		// 	hasUnreads: a > 0,
		// 	displayCount: f,
		// 	known: r,
		// 	since: i,
		// 	ghost: o,
		// 	unreadPlacement: this.state.unreadPlacement,
		// 	jumpToUnread: this.jumpToUnread,
		// 	markMostRecentMsgRead: l,
		// 	featureJumpToUnreadShortcut: h
		// })
	}

	renderMessagePaneBannerContainer() {
		const t = this.props,
			a = t.newxpOnboardingStep,
			r = t.overlayVisible;
		if ( r ) return null;
		if ( a ) return null;
		return <div>sdfsdf</div>;
		// return n.a.createElement(Qr, null)
	}

	handleKeydown = e => {
		this.props.onMessagePaneKeyDown && this.props.onMessagePaneKeyDown( e );
	};

	render() {
		if ( this.props.isAppSpaceOpen ) return null;
		if ( this.state.caughtError ) return null;
		// if (this.props.newxpOnboardingStep === Va.START) return n.a.createElement(Ka, {
		// 	step: this.props.newxpOnboardingStep
		// });
		if ( ! this.props.conversationId ) return null;

		const r = classNames( 'p-message_pane', {
			'p-message_pane--ie': false,
			'p-message_pane--global-nav': this.props.useGlobalNav,
			'p-message_pane--classic-nav': /*Object($["a"])() && this.props.featureClassicNav*/ false,
		} );
		// const i = this.props,
		// 	s = i.type,
		// 	oo = i.channelDisplayName,
		// 	l = i.isShared,
		// 	c = i.isOrgShared,
		// 	u = i.isYou,
		// 	d = i.isMuted,
		// 	p = i.hasUnreads,
		// 	m = i.hasDraft,
		// 	h = i.isArchived,
		// 	f = i.unreadCount,
		// 	v = i.badgeCount;

		return React.createElement(
			FocusableSection,
			{
				component: this,
				order: this.props.focusOrder || 1,
			},
			React.createElement(
				'div',
				{
					className: r,
					'data-qa': 'message_pane',
				},
				React.createElement( MessageList, {
					type: this.props.type,
					from: this.props.from,
					ref: this.setListRef,
					conversationId: this.props.conversationId,
					readWatermark: this.props.readWatermark,
					pageId: this.props.pageId,
					page: this.props.page,
					rows: this.props.rows,
					ariaLabel: 'message page',
					timestamps: this.props.timestamps,
					startTs: this.props.startTs,
					startTsOffset: this.props.startTsOffset,
					shouldIgnoreScrollKeys: this.shouldIgnoreScrollKeys,
					shouldIgnoreArrowKeys: this.shouldIgnoreArrowKeys,
					highlightTs: this.props.highlightTs,
					highlightLazy: this.props.highlightLazy,
					requestHistory: this.requestHistory,
					lastReadTs: this.props.lastReadTs,
					isGhostLastRead: this.props.isGhostLastRead,
					rollups: this.props.rollups,
					isLoading: this.props.isLoading,
					isLoadingOlder: this.props.isLoadingOlder,
					setUnreadPoint: this.props.setUnreadPoint,
					reachedStart: this.props.reachedStart,
					reachedEnd: this.props.reachedEnd,
					prevReachedEnd: this.props.prevReachedEnd,
					oldest: this.props.oldest,
					latest: this.props.latest,
					onVisibleRowsChanged: this.onVisibleRowsChanged,
					doneHighlighting: this.props.clearHighlightTs,
					channelType: this.props.type,
					isLimited: this.props.isLimited,
					isSlackbotIm: this.props.isSlackbotIm,
					useStickyDayDividers: true,
					theme: this.props.theme,
					channelSessionId: this.props.channelSessionId,
					firstUnreadTs: this.props.firstUnreadTs,
					messageContainerType: o.MESSAGE_PANE,
					featureReactMessages: this.props.featureReactMessages,
					featureTinyspeck: this.props.featureTinyspeck,
					featureJumpToUnreadShortcut: this.props.featureJumpToUnreadShortcut,
					featureAriaApplicationMode: this.props.featureAriaApplicationMode,
					teamId: this.props.teamId,
					enterpriseId: this.props.enterpriseId,
					sessionId: this.props.sessionId,
					msgTriggers: this.props.msgTriggers,
					windowLastFocusEvent: this.props.windowLastFocusEvent,
					currentUserId: this.props.currentUserId,
					screenReaderOverride: this.props.screenReaderOverride,
					jumpToTimestamp: this.props.jumpToTimestamp,
					makeMessageSummary: this.props.makeMessageSummary,
					isScreenReaderEnabled: this.props.isScreenReaderEnabled,
					onFocusEnter: this.onFocusEnter,
					onFocusLeave: this.onFocusLeave,
					onClickImage: this.props.onClickImage,
					onKeyDown: this.handleKeydown,
				} )
			)
		);
	}
}
