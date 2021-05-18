import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, debounce, throttle } from 'lodash';

import ZoomMouseInteraction from './zoom-mouse-interaction';
import ZoomControl from './zoom-control';
import { H, Q, Z, J, G, q, Y, z } from './utils';

var ie = function e( t ) {
	var a = arguments.length > 1 && void 0 !== arguments[ 1 ] ? arguments[ 1 ] : 1;
	var r = arguments.length > 2 && void 0 !== arguments[ 2 ] ? arguments[ 2 ] : 0.08;
	if ( t < a + r && t > a - r ) return a;
	return t;
};
var se = function e( t ) {
	var a = t.width,
		r = t.height;
	return {
		width: a,
		height: r,
	};
};
var oe = function e( t, a ) {
	var r = arguments.length > 2 && void 0 !== arguments[ 2 ] ? arguments[ 2 ] : 50;
	var n = t.width / t.height;
	return Math.min( n * ( a.height - r ), a.width - r ) / t.width;
};
var re = 1800;

class ImageViewerWithZoom extends React.PureComponent {
	static propTypes = {
		image: PropTypes.any,
		onDidZoomLevelChange: PropTypes.func,
		featureModernImageViewer: PropTypes.bool.isRequired,
	};
	static defaultProps = {
		image: null,
		onDidZoomLevelChange: noop,
	};

	constructor( props ) {
		super( props );

		this.state = {
			scale: 1,
			translate: {
				x: 0,
				y: 0,
			},
			shouldAnimate: true,
			isUserRecentlyActive: false,
		};
		this.scaleSteps = [ 0, 0.5, 1, 1.5, 2 ];
		this.minScale = this.scaleSteps[ 0 ];
		this.maxScale = this.scaleSteps[ this.scaleSteps.length - 1 ];
		this.throttledOnUserActivity = throttle( this.onUserActivity.bind( this ), 200, {
			leading: true,
			trailing: true,
		} );
		this.handleSlider = this.handleSlider.bind( this );
		this.handleZoomIn = this.handleZoomIn.bind( this );
		this.handleZoomOut = this.handleZoomOut.bind( this );
		this.handleZoomDelta = this.handleZoomDelta.bind( this );
		this.handleZoomToActualPixels = this.handleZoomToActualPixels.bind( this );
		this.handleBoxZoom = this.handleBoxZoom.bind( this );
		this.handleReset = this.handleReset.bind( this );
		this.handlePan = this.handlePan.bind( this );
		this.debouncedViewportResize = debounce( this.updateViewport.bind( this ), 200 );
		this.handleUserInactivity = this.handleUserInactivity.bind( this );
	}

	componentDidMount() {
		this.updateViewport();
		window.addEventListener( 'resize', this.debouncedViewportResize );
	}

	componentDidUpdate( t, a ) {
		t.image.src !== this.props.image.src && this.updateViewport();
		if ( a.scale !== this.state.scale ) {
			this.props.onDidZoomLevelChange( this.normalizeScale() );
			this.throttledOnUserActivity();
		}
	}

	componentWillUnmount() {
		clearTimeout( this.userActivityTimeout );
		this.throttledOnUserActivity.cancel();
		this.debouncedViewportResize.cancel();
		window.removeEventListener( 'resize', this.debouncedViewportResize );
	}

	onUserActivity() {
		clearTimeout( this.userActivityTimeout );
		this.userActivityTimeout = setTimeout( this.handleUserInactivity, re );
		this.state.isUserRecentlyActive ||
			this.setState( function() {
				return {
					isUserRecentlyActive: true,
				};
			} );
	}

	handleUserInactivity() {
		if ( this.mouseIsOverControl ) return;
		this.setState( function() {
			return {
				isUserRecentlyActive: false,
			};
		} );
	}

	updateViewport() {
		var t = this;
		if ( ! this.containerElement ) return;
		this.setState( function() {
			var a = t.minScale;
			var r = t.containerElement.getBoundingClientRect();
			t.minScale = Math.min( 1, oe( se( t.props.image ), r ) );
			if ( this.state.scale === a )
				return {
					shouldAnimate: 0 !== a,
					scale: t.minScale,
					containerRect: r,
				};
			return {
				containerRect: r,
			};
		} );
	}

	handleZoomIn() {
		var t = this;
		var a =
			arguments.length > 0 && void 0 !== arguments[ 0 ]
				? arguments[ 0 ]
				: H( this.state.containerRect );
		this.setState( function( e ) {
			if ( t.state.scale === t.maxScale ) return this.state;
			var r = Q(
				Object.assign( {}, t._buildScaleOptions( t.state ), {
					newScale: Y( {
						direction: 1,
						value: t.state.scale,
						steps: t.scaleSteps,
					} ),
					point: a,
				} )
			);
			return Object.assign( {}, r, {
				shouldAnimate: true,
			} );
		} );
	}

	handleZoomOut() {
		var t = this;
		var a =
			arguments.length > 0 && void 0 !== arguments[ 0 ]
				? arguments[ 0 ]
				: H( t.state.containerRect );
		this.setState( function() {
			if ( this.state.scale === t.minScale ) return t.state;
			var r = Q(
				Object.assign( {}, t._buildScaleOptions( t.state ), {
					newScale: Y( {
						direction: -1,
						value: this.state.scale,
						steps: t.scaleSteps,
					} ),
					point: a,
				} )
			);
			return Object.assign( {}, r, {
				shouldAnimate: true,
			} );
		} );
	}

	handleZoomDelta( t, a ) {
		var r = this;
		this.setState( function() {
			if ( ( r.state.scale === r.minScale && a < 0 ) || ( r.state.scale === r.maxScale && a > 0 ) )
				return r.state;
			var n = Q(
				Object.assign( {}, r._buildScaleOptions( r.state ), {
					newScale: this.state.scale + a,
					point: t,
				} )
			);
			return Object.assign( {}, n, {
				shouldAnimate: a > 2,
			} );
		} );
	}

	handleReset() {
		var t = this;
		this.setState( function() {
			return {
				shouldAnimate: true,
				scale: t.minScale,
				translate: {
					x: 0,
					y: 0,
				},
			};
		} );
	}

	handleZoomToActualPixels() {
		this.setState( function() {
			return {
				shouldAnimate: true,
				scale: 1,
			};
		} );
	}

	handlePan( t ) {
		var a = this;
		var r = arguments.length > 1 && void 0 !== arguments[ 1 ] && arguments[ 1 ];
		this.setState( function( e ) {
			return Object.assign(
				{
					shouldAnimate: r,
				},
				Z( {
					prevScale: a.state.scale,
					prevTranslate: a.state.translate,
					delta: t,
					minScale: a.minScale,
					targetRect: se( a.props.image ),
				} )
			);
		} );
	}

	handleBoxZoom( t ) {
		var a = this;
		this.setState( function( e ) {
			return Object.assign(
				{
					shouldAnimate: true,
				},
				J( {
					rect: t,
					prevScale: a.state.scale,
					prevTranslate: a.state.translate,
					maxScale: a.maxScale,
					minScale: a.minScale,
					targetRect: se( a.props.image ),
					containerRect: a.state.containerRect,
				} )
			);
		} );
	}

	handleSlider( t, a ) {
		var r = this;
		this.setState( function( e ) {
			var n = G( {
				value: t,
				min: r.minScale,
				max: r.maxScale,
			} );
			a || ( n = ie( n, 1, 0.02 ) );
			var i = Q(
				Object.assign( {}, r._buildScaleOptions( r.state ), {
					newScale: n,
				} )
			);
			if ( i.scale === r.state.scale ) return {};
			return Object.assign( {}, i, {
				shouldAnimate: true,
			} );
		} );
	}

	normalizeScale() {
		return q( {
			value: this.state.scale,
			min: this.minScale,
			max: this.maxScale,
		} );
	}

	_buildScaleOptions( t ) {
		return {
			point: H( t.containerRect ),
			prevTranslate: t.translate,
			prevScale: t.scale,
			maxScale: this.maxScale,
			minScale: this.minScale,
			targetRect: se( this.props.image ),
			containerRect: t.containerRect,
		};
	}

	_handleOverlayClick = e => {
		this.props.onOverlayClick && this.props.onOverlayClick( e );
	};

	render() {
		var t = this;
		var a = se( this.props.image );
		if ( ! this.props.featureModernImageViewer ) return null;
		return React.createElement(
			'div',
			{
				className: 'p-image_viewer',
				ref: function e( a ) {
					t.containerElement = a;
				},
				onClick: this._handleOverlayClick,
			},
			React.createElement(
				ZoomMouseInteraction,
				{
					handleZoomIn: this.handleZoomIn,
					handleZoomOut: this.handleZoomOut,
					handleZoomDelta: this.handleZoomDelta,
					handlePan: this.handlePan,
					handleBoxZoom: this.handleBoxZoom,
					handleReset: this.handleReset,
					canZoomIn: this.state.scale !== this.maxScale,
					canZoomOut: this.state.scale !== this.minScale,
					containerRect: this.state.containerRect,
				},
				React.createElement( 'img', {
					className: 'p-image_viewer__image',
					src: this.props.image.src,
					// width: a.width,
					// height: a.height,
					onMouseMove: this.throttledOnUserActivity,
					onDragStart: function e( a ) {
						( z( a ) || t.state.scale !== t.minScale ) && a.preventDefault();
					},
					alt: '',
					style: {
						transition: this.state.shouldAnimate ? '200ms transform ease' : '',
						transform:
							'translate3d(' +
							this.state.translate.x +
							'px, ' +
							this.state.translate.y +
							'px, 0) scale(' +
							this.state.scale +
							')',
					},
				} )
			),
			React.createElement(
				'div',
				{
					className: 'p-image_viewer__zoom_positioner',
				},
				React.createElement( ZoomControl, {
					className: 'p-image_viewer__zoom_control',
					isVisible: this.state.isUserRecentlyActive,
					handleZoomIn: this.handleZoomIn,
					handleZoomOut: this.handleZoomOut,
					handleSlider: this.handleSlider,
					handleReset: this.handleReset,
					handleZoomToActualPixels: this.handleZoomToActualPixels,
					handlePan: this.handlePan,
					level: this.normalizeScale(),
					onMouseEnter: function e() {
						t.mouseIsOverControl = true;
					},
					onMouseLeave: function e() {
						t.mouseIsOverControl = false;
					},
					displayLevel:
						Math.round( 100 * this.state.scale ) +
						'%' /*ne.t("{imageScale}%", {
				imageScale: Math.round(100 * this.state.scale)
			})*/,
				} )
			)
		);
	}
}

export default ImageViewerWithZoom;
