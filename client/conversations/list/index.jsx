import React from 'react';
import PropTypes from 'prop-types';
import { debounce, isEqual, forEach, throttle } from 'lodash';
import AutoSizer from 'react-virtualized-auto-sizer';

import config from 'config';
import DynamicList from 'blocks/virtualized-list/dynamic-list';
import Layout from 'components/virtualized-list/layout';
import HeightCache from 'components/virtualized-list/height-cache';
import GlobalEventEmitter from 'utils/global-event-emitter';
import EventTypes from 'utils/event-types';
import ConversationItem from 'blocks/conversation-item';
import userFactory from 'lib/user';
import ConversationFilter from './filter';
import styles from './style.scss';
import c_styles from 'conversations/style.scss';

const user = userFactory();
//const DEFAULT_LIMIT = 30; // items/load

//compare booleans, returns -1,0 or 1
const compareSeen = direction => ( a, b ) => {
	if ( a.seen === b.seen ) {
		return 0;
	}

	if ( a.seen ) {
		return -1 * direction;
	}

	return 1 * direction;
};
//compare numbers, returns negative number, 0 or positive number
const compareDate = direction => ( a, b ) => ( a.updated_time - b.updated_time ) * direction;

const createSort = ( comparers = [] ) => ( a, b ) =>
	comparers.reduce( ( result, compareFn ) => ( result === 0 ? compareFn( a, b ) : result ), 0 );

class CList extends React.PureComponent {
	static displayName = 'ConversationList';
	static propTypes = {
		height: PropTypes.number,
		fadeScrollbar: PropTypes.bool,
		onScroll: PropTypes.func,
		selectedPageIds: PropTypes.string,
		selectedPageId: PropTypes.string,
		loadConversations: PropTypes.func,
		rows: PropTypes.arrayOf( PropTypes.object ),
		onChangeSelected: PropTypes.func,
		isMultipleMode: PropTypes.bool,
		showHeader: PropTypes.bool,
		selectedId: PropTypes.string,
	};

	static defaultProps = {
		showHeader: true,
	};

	constructor( props ) {
		super( props );

		this.state = {
			isFistTimeLoad: true,
			isLoading: props.isLoading,
			isLoadingOlder: props.isLoadingOlder,
			isSelecting: false,
			hasKeyboardFocus: false,
			offset: 0,
			limit: config( 'conversations_page_size' ),
			hasNext: true,
		};

		this.DEFAULT_ROW_HEIGHT = 70;
		this.STICKY_EPSILON = 0; //this.DEFAULT_ROW_HEIGHT / 2;
		this.ANCHOR_OFFSET = 0; //120;
		this.heightCache = new HeightCache( {
			DEFAULT_HEIGHT: 70, //this.DEFAULT_ROW_HEIGHT,
		} );

		this.layout = new Layout( {
			heightCache: this.heightCache,
			STICKY_EPSILON: this.STICKY_EPSILON,
			STICKY_EPSILON_SETHEIGHT: 2,
			ANCHOR_OFFSET: this.ANCHOR_OFFSET,
		} );

		this.keys = [];
		this.rows = [];
		this.visibleRows = [];
		// this.unreadIndex = null;
		this.list = null;
		this.useAnchor = false;
		this.keyToScrollTo = null;
		this.width = 0;

		// a.hasRenderedOneMessage = false;
		// a.requestAround = a.requestAround.bind(a);
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

		this.scrollToOffset = throttle( this.scrollToOffset.bind( this ), 200 );
	}

	componentWillMount() {
		this.loadConversations( true );
	}

	componentDidMount() {
		GlobalEventEmitter.addListener( EventTypes.CONVERSATIONS_LOADED, this.handleSuccessLoaded );
	}

	componentWillUnmount() {
		GlobalEventEmitter.removeListener( EventTypes.CONVERSATIONS_LOADED, this.handleSuccessLoaded );
	}

	componentDidUpdate() {
		if ( this.keyToScrollTo && this.list ) {
			this.list.scrollToKey( this.keyToScrollTo, {
				lazy: this.lazyScroll,
			} );
			this.keyToScrollTo = null;
		}
		this.layout.setStickToBottom( this.props.reachedEnd || this.props.prevReachedEnd );
		this.onListScrolled();
	}

	componentWillReceiveProps( nextProps ) {
		if (
			nextProps.selectedPageId !== this.props.selectedPageId ||
			nextProps.selectedPageIds !== this.props.selectedPageIds
		) {
			this.heightCache && this.heightCache.invalidate();
		}
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

	// isAtBottom() {
	// 	if ( ! this.list ) return false;
	// 	const t = this.list.getScrollTop();
	// 	const a = this.layout.getTotalHeight();
	// 	const r = this.height;
	// 	return t + r >= Math.floor( a ) - this.STICKY_EPSILON;
	// }

	getVisibleRows() {
		if ( ! this.list ) return [];
		const t = this.list.getVisibleRange(),
			a = t.start,
			r = t.end;
		const n = this.rows.slice( a, r );
		return n;
	}

	onScroll() {
		this.useAnchor = false;
		this.layout.setAnchor( false );
		this.debouncedOnListScrolled();
		this.props.onScroll();
	}

	onSelectionChange( t ) {
		//console.log("tttttttttttttttttttttttttttttttttttttttttttttttttt", t);
		// if ( ! this.node ) return;
		// this.setState( function() {
		// 	return {
		// 		isSelecting: t,
		// 	};
		// } );
	}

	onListScrolled() {
		// const t = this.getVisibleRows();
		// if ( isEqual( t, this.visibleRows ) ) return;
		// this.visibleRows = t;
		// this.props.onVisibleRowsChanged(t)
	}

	onFocusEnter( t ) {
		this.hasFocus = true;
		this.hasKeyboardFocus = t.isKeyboardFocus;
	}

	onFocusLeave() {
		this.hasFocus = false;
		this.hasKeyboardFocus = false;
	}

	// onVisibleRowsChanged() {
	// 	if ( ! this.list ) return;
	// 	// maybe do something later
	// }

	scrollToOffset() {
		let t;
		if ( ! this.list ) return;
		( t = this.list ).scrollToOffset.apply( t, arguments );
	}

	renderRow( index, a ) {
		const hasFocus = a.hasFocus;
		const conversation = this.rows[ index ];
		if ( ! conversation ) return null;

		const isMultipleMode =
			( ! this.props.selectedPageId || this.props.selectedPageId.length === 0 ) &&
			this.props.selectedPageIds.length > 0;

		return (
			<ConversationItem
				key={ conversation.id }
				id={ conversation.id }
				conversation={ conversation }
				onChangeSelected={ this.handleChangeSelected }
				hasFocus={ hasFocus }
				isMultipleMode={ isMultipleMode }
				selected={ conversation.id === this.props.selectedId }
			/>
		);
	}

	handleChangeSelected = selected => {
		if ( this.props.onChangeSelected ) {
			this.props.onChangeSelected( selected );
		}
	};

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
			u = c.channelId,
			d = c.makeMessageSummary;
		const p = this.props.rollups[ r ];
		if ( d )
			return d( {
				channelId: u,
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

	requestNewer() {
		if ( this.state.isLoading ) return false;

		//console.log( 'loading...' );
	}

	requestOlder() {
		if ( this.state.isLoading ) return false;
		//console.log( 'loading older...' );
		this.loadConversations();
	}

	loadConversations = async ( isFirstLoad = false ) => {
		if ( ! isFirstLoad && ! this.state.hasNext ) {
			return;
		}

		const { selectedPageId, selectedPageIds } = this.props;
		if ( ! selectedPageId && ! selectedPageIds ) {
			return;
		}

		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.props.loadConversations(
					selectedPageId || selectedPageIds,
					this.state.limit,
					this.state.offset
				);
			}
		);
	};

	handleSuccessLoaded = loaded => {
		this.setState( {
			isLoading: false,
			offset: this.state.offset + loaded,
			hasNext: loaded === config( 'conversations_page_size' ),
		} );

		if ( this.state.isFistTimeLoad ) {
			this.setState( { isFistTimeLoad: false } );
		}
	};

	render() {
		const sortedConversations = this.props.rows
			.map( item => ( {
				...item,
				updated_time: new Date( item.updated_time ).getTime(),
			} ) ) //map already copied data so sort will not mutate it
			.sort( createSort( [ compareSeen( -1 ), compareDate( -1 ) ] ) );

		const sortedKeys = [];

		forEach( sortedConversations, c => {
			sortedKeys.push( c.id );
		} );

		this.rows = sortedConversations;

		return (
			<div className={ c_styles.conversation__list } style={ this.props.style }>
				{ ! this.props.hideHeader && (
					<div className={ c_styles.list_header }>
						<ConversationFilter
							user={ user.get() }
							style={ { height: '100%' } }
							onShowSwitchPages={ this.props.onShowSwitchPages }
						/>
					</div>
				) }

				<div style={ { height: 'calc(100% - 55px)', width: '100%' } }>
					{ React.createElement(
						AutoSizer,
						{
							style: { height: '100%', width: '100%' },
						},
						e => {
							const a = e.width,
								r = e.height;
							if ( 0 === a || 0 === r ) return null;
							if ( r !== this.height ) {
								this.heightCache.invalidate();
								this.height = r;
							}
							this.width = a;

							return (
								<DynamicList
									ref={ this.setListRef }
									className={ styles.conversation_virtualized_list }
									width={ a }
									layout={ this.layout }
									height={ r }
									keys={ sortedKeys }
									rowRenderer={ this.renderRow }
									fadeScrollbar={ true }
									onScroll={ this.onScroll }
									onSelectionChange={ this.onSelectionChange }
									loadPost={ this.requestOlder }
									isLoading={ this.state.isLoading }
									onFocusEnter={ this.onFocusEnter }
									onFocusLeave={ this.onFocusLeave }
									preventAutoScroll={ true }
								/>
							);
						}
					) }
				</div>
			</div>
		);
	}
}

export default CList;
