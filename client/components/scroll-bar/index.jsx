import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';

import Content from './content';
import Animate from './animate';
import styles from './style.scss';

const E = function e( r ) {
	return r.stopPropagation();
};

class Scrollbar extends React.PureComponent {
	static displayName = 'Scrollbar';
	static propTypes = {
		children: PropTypes.node,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		contentHeight: PropTypes.number,
		color: PropTypes.string,
		className: PropTypes.string,
		monkey: PropTypes.bool,
		fade: PropTypes.bool,
		anchor: PropTypes.oneOf( [ 'top', 'bottom' ] ),
		role: PropTypes.string,
		ariaLabel: PropTypes.string,
		onScroll: PropTypes.func,
		onContentScroll: PropTypes.func,
		onTrackClick: PropTypes.func,
		initialScrollTop: PropTypes.number,
	};

	static defaultProps = {
		children: undefined,
		style: undefined,
		contentHeight: undefined,
		color: undefined,
		className: undefined,
		monkey: false,
		fade: false,
		anchor: 'top',
		role: 'presentation',
		ariaLabel: null,
		onScroll: undefined,
		onContentScroll: noop,
		onTrackClick: undefined,
		initialScrollTop: 0,
	};

	constructor( props ) {
		const t = super( props );

		t.scroller = null;
		t.currentScrollTop = props.initialScrollTop;
		t.dragging = false;
		t.delta = {
			y: null,
			top: null,
			speed: null,
		};
		t.trackInterval = void 0;
		t.trackTimeout = void 0;
		t.trackAnimation = void 0;
		t.onScroll = t.onScroll.bind( t );
		t.onDragStart = t.onDragStart.bind( t );
		t.onDragEnd = t.onDragEnd.bind( t );
		t.onDrag = t.onDrag.bind( t );
		t.onTrackDown = t.onTrackDown.bind( t );
		t.onTrackUp = t.onTrackUp.bind( t );
		t.setRef = t.setRef.bind( t );
		t.setTrackRef = t.setTrackRef.bind( t );
		t.state = {
			height: 0,
			top: 0,
		};
		return t;
	}

	componentDidMount() {
		this.props.initialScrollTop && ( this.scroller.scrollTop = this.props.initialScrollTop );
	}

	componentDidUpdate() {
		this.update();
	}

	componentWillUnmount() {
		this.trackAnimation && this.trackAnimation.cancel();
		clearInterval( this.trackInterval );
		clearTimeout( this.trackTimeout );
		window.removeEventListener( 'mouseup', this.onTrackUp );
	}

	onScroll( r ) {
		if ( ! this.scroller ) return;
		const t = this.scroller.scrollTop;
		if ( t && t === this.currentScrollTop ) return;
		this.currentScrollTop = t;
		this.update();
		this.props.onScroll &&
			this.props.onScroll( r, {
				scrollTop: this.currentScrollTop,
			} );
	}

	onDragStart = e => {
		e.preventDefault();
		e.stopPropagation();
		const a = this.getScrollHeight();
		const n = this.getTrackHeight();
		this.dragging = true;
		this.delta.y = e.clientY;
		this.delta.top =
			'top' === this.props.anchor ? this.currentScrollTop : a - this.currentScrollTop;
		this.delta.speed = a / n;
		document.addEventListener( 'mousemove', this.onDrag );
		document.addEventListener( 'mouseup', this.onDragEnd );
		document.addEventListener( 'mouseleave', this.onDragEnd );
	};

	onDragEnd = () => {
		this.dragging = false;
		document.removeEventListener( 'mousemove', this.onDrag );
		document.removeEventListener( 'mouseup', this.onDragEnd );
		document.removeEventListener( 'mouseleave', this.onDragEnd );
	};

	onDrag = e => {
		e.preventDefault();
		e.stopPropagation();
		const a = e.clientY;
		const n = this.getScrollHeight();
		const t = ( a - this.delta.y ) * this.delta.speed;
		const s = 'top' === this.props.anchor ? this.delta.top + t : n - ( this.delta.top - t );
		this.scrollTop( s );
	};

	onTrackDown = a => {
		console.log( 'a', a.nativeEvent.offsetY );
		const n = this;
		a.preventDefault();
		a.stopPropagation();
		const t = this.props.onTrackClick || this.track.to;
		const s = a.nativeEvent.offsetY;
		const l = function e() {
			if ( s >= n.state.top && s <= n.state.top + n.state.height ) {
				clearInterval( n.trackInterval );
				return;
			}
			const r = t( {
				y: s,
				scrollTop: n.currentScrollTop,
				scrollHeight: n.getScrollHeight(),
				trackHeight: n.getTrackHeight(),
				barTop: n.state.top,
				barHeight: n.state.height,
			} );
			n.scrollWithAnimation( r );
		};
		l();
		clearInterval( this.trackInterval );
		clearTimeout( this.trackTimeout );
		this.trackTimeout = setTimeout( function() {
			l();
			n.trackInterval = setInterval( l, 200 );
		}, 500 );
		window.addEventListener( 'mouseup', this.onTrackUp );
	};

	onTrackUp = () => {
		this.trackAnimation && this.trackAnimation.cancel();
		clearInterval( this.trackInterval );
		clearTimeout( this.trackTimeout );
		window.removeEventListener( 'mouseup', this.onTrackUp );
	};

	setRef( scroller ) {
		this.scroller = scroller;
	}

	setTrackRef( track ) {
		this.track = track;
	}

	getScrollHeight = () => {
		const r = this.props.contentHeight;
		return 'undefined' !== typeof r ? r : this.scroller.scrollHeight;
	};

	getBarHeight() {
		const r = this.getScrollHeight();
		const t = this.props.height;
		if ( 0 === r ) return 0;
		return ( t / r ) * t;
	}

	getTrackHeight = () => {
		return this.track && this.track.offsetHeight;
	};

	scrollTop( r ) {
		if ( ! this.scroller ) return null;
		if ( void 0 !== r ) {
			this.scroller.scrollTop = r;
			return this.scroller.scrollTop;
		}
		return this.currentScrollTop;
	}

	scrollWithAnimation = r => {
		return;
		// console.log("rr", r);
		// var t = this;
		// var n = 0;
		// var a = function e( rr ) {
		// 	var a = rr.value,
		// 		s = rr.nextTick;
		//
		// 	var l = t.scroller.scrollTop + a + n;
		// 	var i = Math.round( l );
		// 	n = l - i;
		// 	t.scrollTop( i );
		// 	s();
		// };
		// this.trackAnimation && this.trackAnimation.cancel();
		// this.trackAnimation = Animate( {
		// 	fromValue: this.scroller.scrollTop,
		// 	toValue: r,
		// 	duration: 200,
		// 	delta: true,
		// 	onTick: a,
		// } );
		// return this.trackAnimation;
	};

	update = () => {
		if ( ! this.scroller ) return;
		const r = this.props.height;
		const t = this.currentScrollTop;
		const n = this.getScrollHeight();
		let a = this.getBarHeight( n );
		a = a < 50 ? 50 : a;
		const s = ( t / ( n - r ) ) * ( this.getTrackHeight() - a );
		const l = n <= r;
		this.setState( function() {
			return {
				height: a,
				top: s,
				hidden: l,
			};
		} );
	};

	render() {
		const { width, height } = this.props;
		const rootClass = classNames( this.props.className, styles.c_scrollbar, {
			[ styles.c_scrollbar__hidden ]: this.state.hidden,
			[ styles.c_scrollbar__monkey ]: this.props.monkey,
			[ styles.c_scrollbar__fade ]: this.props.fade,
		} );

		return (
			<div
				className={ rootClass }
				style={ { width: width, height: height } }
				aria-label={ this.props.ariaLabel }
				onKeyDown={ this.props.onKeyDown }
			>
				<div
					role={ 'presentation' }
					className={ styles.c_scrollbar__hider }
					onScroll={ this.onScroll }
					ref={ this.setRef }
				>
					<Content width={ width } role={ 'presentation' } onScroll={ this.props.onContentScroll }>
						{ this.props.children }
					</Content>
				</div>

				<div
					role={ 'presentation' }
					className={ styles.c_scrollbar__track }
					onMouseDown={ this.onTrackDown }
					onMouseUp={ this.onTrackUp }
					ref={ this.setTrackRef }
				>
					<div
						role={ 'presentation' }
						className={ styles.c_scrollbar__bar }
						style={ {
							height: this.state.height,
							transform: 'translateY(' + Math.floor( this.state.top ) + 'px)',
							background: this.props.color,
						} }
						onMouseDown={ this.onDragStart }
						onClick={ E }
						tabIndex={ -1 }
					/>
				</div>
			</div>
		);
	}
}

export default Scrollbar;

Scrollbar.track = {
	to: function e( r ) {
		const a = r.y,
			n = r.scrollTop,
			t = r.scrollHeight,
			s = r.trackHeight,
			l = r.barTop,
			o = r.barHeight;
		const i = a - l - o / 2;
		return n + i * ( t / s );
	},
	page: function e( r ) {
		const a = r.y,
			n = r.scrollTop,
			t = r.trackHeight,
			s = r.barTop;
		return a < s ? n - ( t - 21 ) : n + ( t - 21 );
	},
};
