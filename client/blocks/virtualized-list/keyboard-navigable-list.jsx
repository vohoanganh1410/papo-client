import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import VirtualizedList from './list';
import ListItem from 'components/list-item';
import FocusManager from 'components/focus-manager';
import KeyCommands from 'lib/key-commands';

class KeyboardNavigableList extends VirtualizedList {
	static propTypes = Object.assign( {}, VirtualizedList.propTypes, {
		itemToFocus: PropTypes.string,
		initialActiveItem: PropTypes.string,
		isFocusableItem: PropTypes.func,
		shouldIgnoreScrollKeys: PropTypes.func,
		shouldIgnoreArrowKeys: PropTypes.func,
		onFocusEnter: PropTypes.func,
		onFocusLeave: PropTypes.func,
		onPageUp: PropTypes.func,
		onPageDown: PropTypes.func,
		onHome: PropTypes.func,
		onEnd: PropTypes.func,
		keyCommands: PropTypes.array,
		useAriaApplicationMode: PropTypes.bool,
		hideHiddenStopTabs: PropTypes.bool,
	} );

	static defaultProps = Object.assign( {}, VirtualizedList.defaultProps, {
		itemToFocus: undefined,
		initialActiveItem: undefined,
		isFocusableItem: noop,
		onFocusEnter: noop,
		onFocusLeave: noop,
		onPageUp: undefined,
		onPageDown: undefined,
		onHome: undefined,
		onEnd: undefined,
		keyCommands: undefined,
		useAriaApplicationMode: false,
		hideHiddenStopTabs: false,
		shouldIgnoreScrollKeys: function e() {
			return ! this.state.hasKeyboardFocus;
		},
		shouldIgnoreArrowKeys: function e() {
			return ! this.state.hasKeyboardFocus;
		},
	} );

	constructor( props ) {
		super( props );
		this.onFocusEnter = this.onFocusEnter.bind( this );
		this.onFocusLeave = this.onFocusLeave.bind( this );
		this.onItemMouseOver = this.onItemMouseOver.bind( this );
		this.onItemFocusEnter = this.onItemFocusEnter.bind( this );
		this.onItemFocusWithin = this.onItemFocusWithin.bind( this );
		this.onItemMouseLeave = this.onItemMouseLeave.bind( this );
		this.onItemMouseDown = this.onItemMouseDown.bind( this );
		this.onItemMouseUp = this.onItemMouseUp.bind( this );
		this.onMouseInterceptorMouseMove = this.onMouseInterceptorMouseMove.bind( this );
		this.moveFocusIntoVisibleScrollRegion = this.moveFocusIntoVisibleScrollRegion.bind( this );
		this.setFirstHiddenTabStopRef = this.setFirstHiddenTabStopRef.bind( this );
		this.setLastHiddenTabStopRef = this.setLastHiddenTabStopRef.bind( this );
		this.state = Object.assign( {}, this.state, {
			initialActiveItem: undefined,
			activeItem: null,
			hasKeyboardFocus: false,
			hoveredItem: null,
			mouseDownTargetItem: null,
		} );
	}

	componentWillReceiveProps( nextProps ) {
		super.componentWillReceiveProps( nextProps ); //?
		this.possiblySetInitialFocus( nextProps );
		this.possiblyUpdateInitialActiveItem( nextProps );
	}

	possiblySetInitialFocus( r ) {
		if ( this.state.hasKeyboardFocus ) return;
		const t = r.itemToFocus;
		if ( this.isItemInView( t ) ) {
			this.setActiveItem( t );
			return;
		}
		t &&
			t.length > 0 &&
			this.setState( function() {
				return {
					initialActiveItem: t,
					setFocusOnScrollEnd: true,
				};
			} );
	}

	possiblyUpdateInitialActiveItem( r ) {
		if ( this.state.hasKeyboardFocus ) return;
		if ( r.initialActiveItem === this.state.initialActiveItem ) return;
		this.setState( function() {
			return {
				initialActiveItem: r.initialActiveItem,
			};
		} );
	}

	componentDidMount() {
		super.componentDidMount(); //?
		const t = false; // this.props.shouldIgnoreScrollKeys.bind( this );
		const a = [
			{
				keys: [ 'pageup' ],
				handler: this.onPageUp.bind( this ),
				filter: t,
			},
			{
				keys: [ 'shift+space' ],
				ignoreInputs: true,
				handler: this.onPageUp.bind( this ),
				filter: t,
			},
			{
				keys: [ 'pagedown' ],
				handler: this.onPageDown.bind( this ),
				filter: t,
			},
			{
				keys: [ 'space' ],
				ignoreInputs: true,
				handler: this.onPageDown.bind( this ),
				filter: t,
			},
			{
				keys: [ 'home' ],
				handler: this.onKeyDownHome.bind( this ),
				action: 'keydown',
				filter: t,
			},
			{
				keys: [ 'end' ],
				handler: this.onKeyDownEnd.bind( this ),
				action: 'keydown',
				filter: t,
			},
			{
				keys: [ 'home' ],
				handler: this.onKeyUpHome.bind( this ),
				action: 'keyup',
			},
			{
				keys: [ 'end' ],
				handler: this.onKeyUpEnd.bind( this ),
				action: 'keyup',
			},
			{
				keys: [ 'up', 'down' ],
				handler: this.onArrowKeyDown.bind( this ),
				ignoreInputs: true,
				filter: false, // this.props.shouldIgnoreArrowKeys.bind( this ),
			},
			{
				keys: [ 'tab', 'shift+tab' ],
				handler: this.onTabKeyDown.bind( this ),
				ignoreInputs: true,
			},
		];
		const n = this.props.keyCommands ? a.concat( this.props.keyCommands ) : a;
		this.keyCommands = new KeyCommands();
		this.keyCommands.bindAll( n );
	}

	componentWillUnmount() {
		this.keyCommands.reset();
		this.keyCommands = null;
		clearTimeout( this.focusTimerId );
	}

	componentDidUpdate() {
		// this.state.hasKeyboardFocus && ! this.isScrolling() && this.updateTabIndexes();
	}

	onScrollEnd() {
		const t = this.state.hasKeyboardFocus;
		t && ! this.isScrolling() && this.updateTabIndexes();
		super.onScrollEnd();
		t && this.state.setFocusOnScrollEnd && this.moveFocusOnScrollEnd();
	}

	onScrollKeyDown( r ) {
		// var t = r.keyCode;
		// if (!this.state.hasKeyboardFocus) return;
		// if ((t === y["e"] || t === y["h"]) && this.isScrolledToTop()) {
		// 	this.focusFirstItem();
		// 	return
		// }
		// if ((t === y["b"] || t === y["g"]) && this.isScrolledToBottom()) {
		// 	this.focusLastItem();
		// 	return
		// }
		// var a = C[t];
		// this.setState(function () {
		// 	return {
		// 		initialActiveItem: a,
		// 		setFocusOnScrollEnd: true
		// 	}
		// })
	}

	onPageUp( r ) {
		this.onScrollKeyDown( r );
		if ( this.props.onPageUp ) {
			r.preventDefault();
			this.props.onPageUp( r );
		}
	}

	onPageDown( r ) {
		this.onScrollKeyDown( r );
		if ( this.props.onPageDown ) {
			r.preventDefault();
			this.props.onPageDown( r );
		}
	}

	onKeyDownHome( r ) {
		if ( this.isHomeKeyPressed ) return;
		this.isHomeKeyPressed = true;
		this.onScrollKeyDown( r );
		if ( this.props.onHome ) {
			r.preventDefault();
			this.props.onHome( r );
		}
	}

	onKeyDownEnd( r ) {
		if ( this.isEndKeyPressed ) return;
		this.isEndKeyPressed = true;
		this.onScrollKeyDown( r );
		if ( this.props.onEnd ) {
			r.preventDefault();
			this.props.onEnd( r );
		}
	}

	onArrowKeyDown( r ) {
		r.preventDefault();
		this.focusNextItem( r.keyCode );
	}

	onTabKeyDown( r ) {
		r.target === this.firstHiddenTabStop && this.onFirstHiddenTabStopKeyDown( r );
	}

	onKeyUpHome() {
		this.isHomeKeyPressed = false;
	}

	onKeyUpEnd() {
		this.isEndKeyPressed = false;
	}

	onItemFocusEnter( r ) {
		const t = r.id,
			a = r.relatedEvent,
			n = r.currentTarget,
			s = r.target;
		const l = ! this.haveActiveItem() && ! a && s === n;
		if ( l ) {
			this.setActiveItem( t );
			return;
		}
		const i = ! this.haveActiveItem() && ! a && n.contains( s );
		if ( i ) {
			this.setState( function() {
				return {
					activeItem: null,
					initialActiveItem: t,
					hasKeyboardFocus: true,
				};
			} );
			return;
		}
		const o = a && 'keydown' === a.type;
		o &&
			this.setState( function() {
				return {
					activeItem: null,
					initialActiveItem: t,
					hasKeyboardFocus: true,
				};
			} );
	}

	onItemFocusWithin( r ) {
		const t = r.id,
			a = r.relatedEvent,
			n = r.currentTarget,
			s = r.target;
		const l = a && 'keydown' === a.type;
		const i =
			l && a.shiftKey && n === s && ! this.state.activeItem && this.state.initialActiveItem === t;
		if ( i ) {
			this.setActiveItem( t );
			return;
		}
		l &&
			this.setState( function() {
				return {
					activeItem: null,
					initialActiveItem: t,
					hasKeyboardFocus: true,
				};
			} );
	}

	onFocusEnter( r ) {
		const t = r.relatedEvent,
			a = r.target;
		if ( t && 'mousedown' === t.type ) return;
		const n = a === this.firstHiddenTabStop;
		const s = a === this.lastHiddenTabStop;
		const l = ! t;
		const i = ! l && ( n || s );
		const o = t && 'keydown' === t.type;
		const u = o || l;
		if ( ! u ) {
			this.props.onFocusEnter && this.props.onFocusEnter( r );
			return;
		}
		i &&
			this.moveFocusIntoVisibleScrollRegion( {
				isFirstHiddenTabStop: n,
				shiftKeyPressed: t && t.shiftKey,
			} );
		this.props.onFocusEnter &&
			this.props.onFocusEnter(
				Object.assign(
					{
						isKeyboardFocus: true,
					},
					r
				)
			);
	}

	onFocusLeave( r ) {
		const t = this;
		const a = this.state.activeItem;
		const n = this.haveActiveItem()
			? {
					activeItem: null,
					hasKeyboardFocus: false,
					initialActiveItem: a,
			  }
			: {
					activeItem: null,
					hasKeyboardFocus: false,
			  };
		const s = Object.assign(
			{
				activeItem: a,
			},
			r
		);
		this.setState(
			function() {
				return n;
			},
			function() {
				t.props.onFocusLeave && t.props.onFocusLeave( s );
			}
		);
	}

	onItemMouseOver( r ) {
		const t = r.id;
		this.setState( function() {
			return {
				hoveredItem: t,
			};
		} );
	}

	onItemMouseLeave() {
		this.setState( function() {
			return {
				hoveredItem: null,
				mouseDownTargetItem: null,
			};
		} );
	}

	onItemMouseDown( r ) {
		const t = r.id;
		this.setState( function() {
			return {
				mouseDownTargetItem: t,
			};
		} );
	}

	onItemMouseUp() {
		this.setState( function() {
			return {
				mouseDownTargetItem: null,
			};
		} );
	}

	onFirstHiddenTabStopKeyDown( r ) {
		const t = r.shiftKey;
		if ( ! t ) return;
		r.preventDefault();
		this.updateTabIndexes();
		this.moveFocusIntoVisibleScrollRegion( {
			isFirstHiddenTabStop: false,
			shiftKeyPressed: t,
		} );
	}

	moveFocusOnScrollEnd() {
		const r = this.getInitialActiveItem();
		if ( r ) {
			this.setActiveItem( r );
			this.isItemInView( r ) || this.scrollToKey( r );
		}
	}

	focus() {
		const r = this;
		const t = this.getInitialActiveItem();
		if ( ! t ) return;
		const a = function e() {
			r.focusTimerId = setTimeout( function() {
				r.lastHiddenTabStop.focus();
				r.firstHiddenTabStop.removeEventListener( 'focus', e, false );
			}, 250 );
		};
		const n = function e() {
			r.focusTimerId = setTimeout( function() {
				r.setActiveItem( t );
				r.lastHiddenTabStop.removeEventListener( 'focus', e, false );
			}, 250 );
		};
		if ( this.focusTimerId ) {
			clearTimeout( this.focusTimerId );
			this.firstHiddenTabStop.removeEventListener( 'focus', a, false );
			this.lastHiddenTabStop.removeEventListener( 'focus', n, false );
		}
		if ( Object( R[ 'isWindows' ] )() && this.props.useAriaApplicationMode ) {
			this.firstHiddenTabStop.addEventListener( 'focus', a, false );
			this.lastHiddenTabStop.addEventListener( 'focus', n, false );
			this.firstHiddenTabStop.focus();
		} else {
			this.setActiveItem( t );
			this.isItemInView( t ) || this.scrollToKey( t );
		}
	}

	blur() {
		var r = document.activeElement;
		this.node.scroller.contains( r ) && r.blur();
	}

	getActiveItem() {
		return this.state.activeItem;
	}

	setFirstHiddenTabStopRef( r ) {
		this.firstHiddenTabStop = r;
	}

	setLastHiddenTabStopRef( r ) {
		this.lastHiddenTabStop = r;
	}

	moveFocusIntoVisibleScrollRegion( r ) {
		// var t = r.isFirstHiddenTabStop,
		// 	a = r.shiftKeyPressed;
		// if (!this.node) return;
		// var n = this.node.scroller;
		// var s = function () {
		// 	if (t && !a) return Object(w["b"])(n);
		// 	if (!t && a) return Object(w["c"])(n);
		// 	return null
		// }();
		// if (!s) return;
		// s.focus();
		// s.classList.add("focus-ring");
		// this.firstHiddenTabStop.removeAttribute("tabIndex");
		// this.lastHiddenTabStop.removeAttribute("tabIndex")
	}

	updateTabIndexes() {
		// if (!this.state.hasKeyboardFocus || !this.node) return;
		// var r = this.node.scroller;
		// var t = r.getBoundingClientRect();
		// var a = function e(r) {
		// 	var a = r.getBoundingClientRect();
		// 	var n = a.top >= t.top && a.bottom <= t.bottom;
		// 	return !n
		// };
		// var n = function e(t) {
		// 	return r.contains(t) && t.removeAttribute("tabIndex")
		// };
		// this.childrenScrolledOutOfView && this.childrenScrolledOutOfView.forEach(n);
		// var s = Object(w["a"])(r, a);
		// s.forEach(function (e) {
		// 	return e.setAttribute("tabIndex", -1)
		// });
		// this.childrenScrolledOutOfView = s
	}

	setActiveItem( r ) {
		this.setState( function() {
			return {
				hasKeyboardFocus: true,
				hoveredItem: null,
				activeItem: r,
				initialActiveItem: r,
				setFocusOnScrollEnd: false,
			};
		} );
	}

	haveActiveItem() {
		return null !== this.state.activeItem;
	}

	focusFirstItem() {
		var r = this.getFocusableItemsInView()[ 0 ];
		this.state.activeItem !== r && this.setActiveItem( r );
	}

	focusLastItem() {
		var r = this.getFocusableItemsInView();
		var t = r[ r.length - 1 ];
		this.state.activeItem !== t && this.setActiveItem( t );
	}

	focusNextItem( r ) {
		var t = this.getNextActiveItem( r, this.state.activeItem );
		if ( t ) {
			this.setActiveItem( t );
			this.isItemInView( t ) || this.scrollToKey( t );
		}
	}

	getFocusableItemsInView() {
		var r = this.props,
			t = r.keys,
			a = r.isFocusableItem;
		var n = this.getVisibleRange(),
			s = n.start,
			l = n.end;
		return t.slice( s, l ).filter( function( e ) {
			return a( {
				index: Object( g[ 'indexOf' ] )( t, e ),
				key: e,
			} );
		} );
	}

	getFirstFocusableItemInView() {
		var r = this.state.activeItem;
		var t = this.getFocusableItemsInView()[ 0 ];
		if ( ( t && t === r ) || ( ! t && r ) ) return this.getNextActiveItem( y[ 'l' ], r );
		return t;
	}

	getLastFocusableItemInView() {
		var r = this.state.activeItem;
		var t = this.getFocusableItemsInView();
		var a = t[ t.length - 1 ];
		if ( ( a && a === r ) || ( ! a && r ) ) return this.getNextActiveItem( y[ 'a' ], r );
		return a;
	}

	getInitialActiveItem() {
		// var r = this.state.initialActiveItem;
		// if (r === T) return this.getFirstFocusableItemInView();
		// if (r === I) return this.getLastFocusableItemInView();
		// if (!this.isItemInView(r)) return this.getFirstFocusableItemInView();
		// return r
		return null;
	}

	getNextActiveItem( r, t ) {
		if ( ! this.haveActiveItem() ) return this.getInitialActiveItem();
		var a = t;
		var n = Object( g[ 'indexOf' ] )( this.props.keys, a );
		var s = r === y[ 'l' ] ? n - 1 : n + 1;
		var l = this.props.keys[ s ];
		if (
			l &&
			! this.props.isFocusableItem( {
				index: s,
				key: l,
			} )
		)
			return this.getNextActiveItem( r, l );
		return l;
	}

	renderItem( r, t ) {
		const a = this.getTop( r );
		var n = this.layout.getHeight( r );
		var s = this.state.activeItem === r;
		var l =
			null === this.state.activeItem &&
			this.state.hasKeyboardFocus &&
			this.state.initialActiveItem === r;
		var i = this.state.mouseDownTargetItem === r;
		var o = this.state.hoveredItem === r;

		var u = this.props.getAriaLabelForRow;
		var c =
			u &&
			u( t, {
				hasFocus: s,
			} );

		return (
			<ListItem
				id={ r }
				key={ r }
				height={ n }
				style={ { top: a } }
				role={ this.props.itemRole }
				onHeightChange={ this.setHeight }
				hasFocus={ s }
				hasFocusWithin={ l }
				isMouseDownOnItem={ i }
				onFocusEnter={ this.onItemFocusEnter }
				onFocusWithin={ this.onItemFocusWithin }
				onMouseOver={ this.onItemMouseOver }
				onMouseLeave={ this.onItemMouseLeave }
				onMouseDown={ this.onItemMouseDown }
				onMouseUp={ this.onItemMouseup }
				ariaLabel={ c }
				shouldHorizontallyScroll={ this.props.shouldHorizontallyScroll }
			>
				{ this.props.rowRenderer( a, {
					hasFocus: s,
					isHovered: o,
				} ) }
			</ListItem>
		);
	}

	renderHiddenTabStop( r ) {
		var t = r.key,
			a = r.tabIndex,
			n = r.ref;
		if ( this.props.hideHiddenStopTabs ) return null;
		var s = {
			position: 'absolute',
			width: '1px',
			height: '1px',
			outline: 'none',
			boxShadow: 'none',
		};

		return <div key={ t } ref={ n } tabIndex={ a } style={ s } />;
	}

	onMouseInterceptorMouseMove( r ) {
		var t = this;
		var a = r.screenX,
			n = r.screenY;
		if ( ! this.lastMouseCoords ) {
			this.lastMouseCoords = {
				screenX: a,
				screenY: n,
			};
			return;
		}
		var s = this.lastMouseCoords,
			l = s.screenX,
			i = s.screenY;
		this.lastMouseCoords = {
			screenX: a,
			screenY: n,
		};
		var o = Math.abs( l - a );
		var u = Math.abs( i - n );
		if ( 0 === o && 0 === u ) return;
		this.setState(
			function() {
				return {
					activeItem: null,
					initialActiveItem: t.state.activeItem,
					hasKeyboardFocus: false,
				};
			},
			function() {
				t.lastMouseCoords = null;
			}
		);
	}

	renderMouseInterceptor() {
		var r = this.props,
			t = r.height,
			a = r.width;
		var n = {
			position: 'absolute',
			top: '0',
			left: '0',
			height: t,
			width: a,
			zIndex: 201,
		};
		if ( this.state.hasKeyboardFocus ) {
			return (
				<div
					style={ n }
					onMouseMove={ this.onMouseInterceptorMouseMove }
					data-qa="kb_list_mouse_interceptor"
				/>
			);
		}
		return null;
	}

	render() {
		const t = this.state.hasKeyboardFocus ? '-1' : '0';
		const a = this.renderHiddenTabStop( {
			key: 'first-hidden-tab-stop',
			tabIndex: t,
			ref: this.setFirstHiddenTabStopRef,
		} );
		const n = this.renderHiddenTabStop( {
			key: 'last-hidden-tab-stop',
			tabIndex: t,
			ref: this.setLastHiddenTabStopRef,
		} );

		const s = 'presentation';
		const l = this.state.hasKeyboardFocus
			? {
					position: 'relative',
			  }
			: undefined;

		return React.createElement(
			FocusManager,
			{
				onFocusEnter: this.onFocusEnter,
				onFocusLeave: this.onFocusLeave,
			},
			React.createElement(
				'div',
				{
					role: s,
					style: l,
				},
				n,
				super.render(),
				a,
				this.renderMouseInterceptor()
			)
		);
	}
}

export default KeyboardNavigableList;
