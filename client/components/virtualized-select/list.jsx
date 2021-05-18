import React from 'react';
import { debounce, forEach, isEqual, noop, sortBy } from 'lodash';
import classnames from 'classnames';

import OrderItem from './item';
import DynamicList from 'components/virtualized-list/dynamic-list';
import Layout from 'components/virtualized-list/layout';
import HeightCache from 'components/virtualized-list/height-cache';
import AutoSizer from 'react-virtualized-auto-sizer';
import styles from './style.scss';

const DEFAULT_LIMIT = 30; // items/load

export default class List extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			isLoading: props.isLoading,
			isLoadingOlder: props.isLoadingOlder,
			isSelecting: false,
			hasKeyboardFocus: false,
			offset: 0,
			limit: DEFAULT_LIMIT,
			hasNext: true,
		};

		this.DEFAULT_ROW_HEIGHT = 80;
		this.STICKY_EPSILON = this.DEFAULT_ROW_HEIGHT / 2;
		this.ANCHOR_OFFSET = 64;
		this.heightCache = new HeightCache( {
			DEFAULT_HEIGHT: this.DEFAULT_ROW_HEIGHT,
		} );

		this.layout = new Layout( {
			heightCache: this.heightCache,
			STICKY_EPSILON: this.STICKY_EPSILON,
			STICKY_EPSILON_SETHEIGHT: 2,
			ANCHOR_OFFSET: this.ANCHOR_OFFSET,
			stickToBottom: this.stickToBottom,
		} );

		this.keys = [];
		this.rows = [];
		this.visibleRows = [];
		this.unreadIndex = null;
		this.list = null;
		this.useAnchor = true;
		this.keyToScrollTo = null;
		this.width = 0;

		this.debouncedOnListScrolled = debounce( this.onListScrolled, 150 );
	}

	focus = () => {
		this.list.focus();
	};

	blur = () => {
		this.list.blur();
	};

	setListRef = t => {
		this.list = t;
	};

	getVisibleRows = () => {
		if ( ! this.list ) return [];
		const t = this.list.getVisibleRange(),
			a = t.start,
			r = t.end;
		const n = this.rows.slice( a, r );
		return n;
	};

	onScroll = () => {
		this.useAnchor = false;
		this.layout.setAnchor( false );
		this.debouncedOnListScrolled();
		// this.props.onScroll();
	};

	onSelectionChange = t => {
		if ( ! this.node ) return;
		this.setState( function() {
			return {
				isSelecting: t,
			};
		} );
	};

	onListScrolled() {
		const t = this.getVisibleRows();
		if ( isEqual( t, this.visibleRows ) ) return;
		this.visibleRows = t;
		// this.props.onVisibleRowsChanged(t)
	}

	onFocusEnter = t => {
		this.hasFocus = true;
		this.hasKeyboardFocus = t.isKeyboardFocus;
	};

	onFocusLeave = () => {
		this.hasFocus = false;
		this.hasKeyboardFocus = false;
	};

	scrollToOffset = () => {
		let t;
		if ( ! this.list ) return;
		// ( t = this.list ).scrollToOffset.apply( t, arguments );
	};

	getAriaLabelForRow = t => {
		var a = this.rows[ t ];
		if ( ! a || ! a.type ) return;
		if ( 'order' !== a.type ) return;
		var r = a.ts,
			n = a.previousMessageTs,
			i = a.isFirstMsgForDay,
			s = a.isLastMsgForDay,
			o = a.isFirstUnreadMsg,
			l = a.day;
		var c = this.props,
			u = c.channelId,
			d = c.makeMessageSummary;
		var p = this.props.rollups[ r ];
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
	};

	renderEndOfList() {
		return <div style={ { height: 50 } } key="end_of_list" className="end_of_list" />;
	}

	renderLoadMoreButton = () => {
		return (
			<div style={ { height: 50 } } key="load_more">
				<div
					onClick={ this.requestOlder }
					style={ {
						lineHeight: '50px',
						textAlign: 'center',
						cursor: 'pointer',
						background: '#2d9ee0',
						color: '#fff',
					} }
				>
					<span style={ { width: '100%', height: '100%' } }>Tải thêm</span>
				</div>
			</div>
		);
	};

	renderItem = ( item, a ) => {
		const r = a.hasFocus,
			i = a.isHovered;

		const className = classnames( styles.list_item, {
			focus: r,
			hover: i,
		} );
		const selected = this.props.selected && item.id === this.props.selected.id;
		return <OrderItem
			className={ className }
			isHovered={ i }
			option={ item }
			onSelectOption={ this.props.onSelectOption }
			selected={selected}
		/>;
	};

	renderDateGroup = date => {
		// return <DateSeparator key={ date } date={ new Date( date ) } />;
		return <div>{ date }</div>;
	};

	renderRow = ( key, a ) => {
		const r = a.hasFocus;
		const i = a.isHovered;
		const row = this.rows[ key ];
		if ( ! row || ! row.type ) return null;

		switch ( row.type ) {
			case 'loadMore':
				return this.renderLoadMoreButton();
			case 'loading':
				return this.renderLoading();
			case 'order':
				return this.renderItem( row.data, {
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
			default:
				return <strong>Đã có lỗi xảy ra trong quá trình hiển thị tin nhắn!</strong>;
		}
	};

	makeSeedData( numberOfItems ) {
		const result = [];

		for ( let i = 0; i < numberOfItems; i++ ) {
			result.push( {
				id: 'item_' + i,
				name: 'Nguyễn Văn Trần Thị ' + i,
				created_time: new Date().getTime() + i * 60 * 60 * 1000,
			} );
		}

		return result;
	}

	sameDay = ( d1, d2 ) => {
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	};

	groupOrdersByDate = orders => {
		const grouped = orders.reduce(
			( { group, groups, created_time }, order ) => {
				if ( ! this.sameDay( new Date( created_time ), new Date( order.created_time ) ) ) {
					return {
						created_time: order.created_time,
						group: [ order ],
						groups: group ? groups.concat( [ group ] ) : groups,
					};
				}
				return { created_time, group: group.concat( [ order ] ), groups };
			},
			{ groups: [] }
		);

		return grouped.groups.concat( [ grouped.group ] );
	};

	ordersByCreatedTime( orders ) {
		return sortBy( orders, [ 'created_time' ] );
	}

	render() {
		if ( this.props.isLoading ) {
			return this.renderLoading();
		}

		if ( ! this.props.isLoading && this.props.loadingError ) {
			return this.renderLoadingError();
		}

		// const { rows, teamId } = this.props;
		const { teamId } = this.props;
		const rows = this.makeSeedData( 1500 );

		if ( ! rows || rows.length === 0 ) return null;
		// this.rows = rows;
		const groups = this.groupOrdersByDate( this.ordersByCreatedTime( rows ) );

		const rowsResult = [];
		const keysResult = [];

		if ( this.state.isLoadingOlder ) {
			keysResult.push( 'loading' );
			rowsResult.push( {
				type: 'loading',
			} );
		}

		forEach( groups, group => {
			// const date = new Date( group[ 0 ].created_time ).getTime();
			// keysResult.push( date + '_group' );

			// rowsResult.push( {
			// 	type: 'dayDividerLabel',
			// 	id: date,
			// 	key: date + '_group',
			// } );

			// console.log('groups', groups);

			forEach( group, order => {
				keysResult.push( order.id );

				rowsResult.push( {
					type: 'order',
					id: order.id,
					key: order.id,
					data: order,
					team_id: teamId,
				} );
			} );
		} );

		// if ( this.state.hasNext && ! this.state.isLoading ) {
		// 	keysResult.push( 'loadMore' );
		// 	rowsResult.push( {
		// 		type: 'loadMore',
		// 		id: 'loadMore',
		// 		key: 'loadMore',
		// 	} );
		// }

		// add end of list
		// keysResult.push( 'end_of_list' );
		// rowsResult.push( {
		// 	type: 'end_of_list',
		// 	id: 'end_of_list',
		// 	key: 'end_of_list',
		// } );

		this.rows = rowsResult;
		this.keys = keysResult;

		// console.log('this.rows', this.rows);

		return React.createElement( AutoSizer, {
			className: styles.col_list,
		}, e => {
			const a = e.width,
				r = e.height;
			if ( 0 === a || 0 === r ) return null;
			if ( a !== this.width ) {
				this.heightCache.invalidate();
				this.width = a;
			}
			this.height = r;

			return (
				<div style={ { height: 'calc(100% - 28px)' } }>
					<DynamicList
						className={ this.props.className }
						ref={ this.setListRef }
						layout={ this.layout }
						rowClass={ styles.order_item_class }
						height={ r }
						width={ a }
						keys={ this.keys }
						rows={ this.rows }
						rowRenderer={ this.renderRow }
						fadeScrollbar={ true }
						onScroll={ this.onScroll }
						onSelectionChange={ this.onSelectionChange }
						loadPre={ /*this.requestOlder*/ noop }
						isLoading={ this.state.isLoading }
						onFocusEnter={ this.onFocusEnter }
						onFocusLeave={ this.onFocusLeave }
						isFocusableItem={ this.isMessage }
					/>
				</div>
			);
		} );
	}
}
