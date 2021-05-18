import React from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { noop } from 'lodash';
import Bowser from 'bowser';

import { W, V, z } from './utils';

class ZoomMouseInteraction extends React.PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
		handleZoomIn: PropTypes.func,
		handleZoomOut: PropTypes.func,
		handlePan: PropTypes.func,
		handleZoomDelta: PropTypes.func,
		handleBoxZoom: PropTypes.func,
		handleReset: PropTypes.func,
		canZoomIn: PropTypes.bool,
		canZoomOut: PropTypes.bool,
		containerRect: PropTypes.object,
	};
	static defaultProps = {
		children: null,
		handleZoomIn: noop,
		handleZoomOut: noop,
		handlePan: noop,
		handleZoomDelta: noop,
		handleBoxZoom: noop,
		handleReset: noop,
		canZoomIn: false,
		canZoomOut: false,
		containerRect: null,
	};

	constructor( props ) {
		super( props );

		this.onMouseDown = this.onMouseDown.bind( this );
		this.onMouseUp = this.onMouseUp.bind( this );
		this.onMouseMove = this.onMouseMove.bind( this );
		this.onMouseWheel = this.onMouseWheel.bind( this );
		this.onDocumentCaptureClick = this.onDocumentCaptureClick.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );
		this.onKeyUp = this.onKeyUp.bind( this );
		this.state = {
			cursor: 'default',
			dragBoxCSSPosition: null,
		};
	}

	componentDidMount() {
		this.targetNode.addEventListener( 'click', function( e ) {
			return e.stopPropagation();
		} );
		this.targetNode.addEventListener( 'mousedown', this.onMouseDown );
		document.addEventListener( 'wheel', this.onMouseWheel, { passive: false } );
		document.addEventListener( 'mouseup', this.onMouseUp );
		document.addEventListener( 'mousemove', this.onMouseMove );
		document.addEventListener( 'keydown', this.onKeyDown );
		document.addEventListener( 'keyup', this.onKeyUp );
		document.addEventListener( 'click', this.onDocumentCaptureClick, true );
	}

	componentWillReceiveProps( t ) {
		const a = this.determineCursor( t );
		this.setCursor( a );
	}

	componentWillUnmount() {
		this.targetNode.removeEventListener( 'click', function( e ) {
			return e.stopPropagation();
		} );
		this.targetNode.removeEventListener( 'mousedown', this.onMouseDown );
		document.removeEventListener( 'wheel', this.onMouseWheel );
		document.removeEventListener( 'mouseup', this.onMouseUp );
		document.removeEventListener( 'mousemove', this.onMouseMove );
		document.removeEventListener( 'keydown', this.onKeyDown );
		document.removeEventListener( 'keyup', this.onKeyUp );
		document.removeEventListener( 'click', this.onDocumentCaptureClick, true );
	}

	onMouseDown( t ) {
		t.stopPropagation();
		this.isMouseDown = 0 === t.button;
		this.dragOrigin = {
			x: t.x,
			y: t.y,
		};
		this.numMouseMoves = 0;
		this.wasPlatformCtrlDownAtStart = z( t );
		this.wasAltKeyDownAtStart = t.altKey;
		this.setCursor();
	}

	onMouseMove( t ) {
		this.isAltKeyDown = t.altKey;
		this.isPlatformCtrlDown = z( t );
		this.setCursor();
		if ( ! this.isMouseDown ) return;
		this.numMouseMoves += 1;
		if ( this.wasPlatformCtrlDownAtStart ) {
			const a = W( this.dragOrigin, {
				x: t.clientX,
				y: t.clientY,
			} );
			const r = V( a, this.props.containerRect );
			this.setState( function() {
				return {
					dragBoxCSSPosition: r,
				};
			} );
		} else {
			if ( ! this.props.canZoomOut ) return;
			this.props.handlePan( {
				x: t.movementX,
				y: t.movementY,
			} );
		}
		t.stopPropagation();
		t.preventDefault();
	}

	onMouseUp( t ) {
		const a = this.isMouseDown;
		const r = this.wasAltKeyDownAtStart;
		const n = this.wasPlatformCtrlDownAtStart;
		const i = this.numMouseMoves > 5;
		const s = ! i || r;
		const o = ! r && i && n;
		this.shouldCancelClickEvent = a;
		this.isMouseDown = false;
		this.isRightClick = false;
		if ( ! a ) return;
		t.stopPropagation();
		t.preventDefault();
		if ( o ) {
			const l = W( this.dragOrigin, {
				x: t.clientX,
				y: t.clientY,
			} );
			this.props.handleBoxZoom( l );
			this.setState( function() {
				return {
					dragBoxCSSPosition: null,
				};
			} );
		} else if ( s ) {
			const c = {
				x: t.x,
				y: t.y,
			};
			r
				? this.props.handleZoomOut( c )
				: this.props.canZoomIn
				? this.props.handleZoomIn( c )
				: this.props.handleReset();
		}
		this.setCursor();
	}

	onDocumentCaptureClick( t ) {
		this.shouldCancelClickEvent && t.stopPropagation();
	}

	onMouseWheel( t ) {
		t.preventDefault();
		t.stopPropagation();
		const a = {
			x: t.clientX,
			y: t.clientY,
		};
		if ( 0 === t.deltaMode ) {
			const r = 0.01;
			const n = 0.6;
			t.ctrlKey
				? this.props.handleZoomDelta( a, -t.deltaY * r )
				: this.props.handlePan( {
						x: -t.deltaX * n,
						y: -t.deltaY * n,
				  } );
		} else {
			const i = 0.01;
			this.props.handleZoomDelta( a, -t.deltaY * i );
		}
	}

	onKeyDown( t ) {
		t.altKey && ( this.isAltKeyDown = true );
		z( t ) && ( this.isPlatformCtrlDown = true );
		this.setCursor();
	}

	onKeyUp( t ) {
		t.altKey || ( this.isAltKeyDown = false );
		z( t ) || ( this.isPlatformCtrlDown = false );
		this.setCursor();
	}

	setCursor() {
		const t =
			arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : this.determineCursor();
		this.setState( function() {
			return {
				cursor: t,
			};
		} );
	}

	determineCursor() {
		const t = arguments.length > 0 && void 0 !== arguments[ 0 ] ? arguments[ 0 ] : this.props;
		if ( this.isPlatformCtrlDown ) return 'crosshair';
		if ( t.canZoomOut && this.isMouseDown && this.numMouseMoves > 5 )
			return Bowser.webkit ? '-webkit-grabbing' : 'grabbing';
		if ( ( t.canZoomOut && this.isAltKeyDown ) || ! t.canZoomIn ) return 'zoom-out';
		if ( t.canZoomIn ) return 'zoom-in';
		return Bowser.webkit ? '-webkit-grab' : 'grab';
	}

	render() {
		const t = this;
		const a = React.Children.only( this.props.children );
		const i = React.cloneElement( a, {
			ref: function e( _a ) {
				t.targetNode = _a;
			},
			style: Object.assign( {}, a.props.style, {
				cursor: this.state.cursor,
			} ),
		} );
		return React.createElement(
			React.Fragment,
			null,
			i,
			this.state.dragBoxCSSPosition &&
				React.createElement( 'div', {
					className: 'p-zoom__box',
					style: Object.assign( {}, this.state.dragBoxCSSPosition ),
				} )
		);
	}
}

export default ZoomMouseInteraction;
