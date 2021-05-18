import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, throttle } from 'lodash';

import Tooltip from 'components/tooltip2';
import Icon from 'components/icon2';

var M = 'p-zoom__slider';
var N = 1e3;
var x = function e( t, a ) {
	return React.createElement(
		React.Fragment,
		null,
		React.createElement( 'div', null, t ),
		React.createElement(
			'div',
			{
				className: 'sk_light_gray',
			},
			a
		)
	);
};
x.displayName = 'makeTooltipContentWithSubtext';

class ZoomControl extends React.PureComponent {
	static propTypes = {
		className: PropTypes.string,
		handleZoomIn: PropTypes.func,
		handleZoomOut: PropTypes.func,
		handleReset: PropTypes.func,
		handleZoomToActualPixels: PropTypes.func,
		handleSlider: PropTypes.func,
		handlePan: PropTypes.func,
		level: PropTypes.number,
		displayLevel: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
		isVisible: PropTypes.bool,
		featureModernImageViewer: PropTypes.bool.isRequired,
		onMouseEnter: PropTypes.func,
		onMouseLeave: PropTypes.func,
	};
	static defaultProps = {
		className: null,
		handleZoomIn: noop,
		handleZoomOut: noop,
		handleReset: noop,
		handleZoomToActualPixels: noop,
		handleSlider: noop,
		handlePan: noop,
		level: 0.5,
		displayLevel: 0.5,
		isVisible: true,
		onMouseEnter: noop,
		onMouseLeave: noop,
		featureModernImageViewer: true,
	};

	constructor( props ) {
		super( props );

		this.inputWidth = 0;
		this.onKeyDown = this.onKeyDown.bind( this );
		this.onKeyUp = this.onKeyUp.bind( this );
		this.handleSliderChange = this.handleSliderChange.bind( this );
		this.handleInactivity = this.handleInactivity.bind( this );
		this.throttledOnActivity = throttle( this.onActivity.bind( this ), 200, {
			leading: true,
			trailing: true,
		} );
		this.state = {
			isHoveringTooltip: false,
			isRecentlyActive: false,
		};
	}

	componentDidMount() {
		this.inputWidth = this.tooltip.tooltipContent.getBoundingClientRect().width;
		this.forceUpdate();
		document.addEventListener( 'keydown', this.onKeyDown );
		document.addEventListener( 'keyup', this.onKeyUp );
	}

	componentWillReceiveProps( t ) {
		t.level !== this.props.level && this.throttledOnActivity();
	}

	componentWillUnmount() {
		clearTimeout( this.activityTimeout );
		this.throttledOnActivity.cancel();
		document.removeEventListener( 'keydown', this.onKeyDown );
		document.removeEventListener( 'keyup', this.onKeyUp );
	}

	onKeyDown( t ) {
		var a = t.shiftKey ? 300 : 50;
		t.ctrlKey && ( this.isCtrlHeld = true );
		// if ( ! t.target.classList.contains( M ) ) return;
		'+' === t.key || '=' === t.key
			? t.metaKey || this.props.handleZoomIn()
			: '-' === t.key
			? t.metaKey || this.props.handleZoomOut()
			: ' ' !== t.key || t.repeat
			? '0' !== t.key || 0 === this.props.level || t.repeat
				? 'ArrowDown' === t.key || 'Down' === t.key
					? this.props.handlePan(
							{
								x: 0,
								y: -a,
							},
							true
					  )
					: 'ArrowUp' === t.key || 'Up' === t.key
					? this.props.handlePan(
							{
								x: 0,
								y: a,
							},
							true
					  )
					: 'ArrowRight' === t.key || 'Right' === t.key
					? this.props.handlePan(
							{
								x: -a,
								y: 0,
							},
							true
					  )
					: ( 'ArrowLeft' !== t.key && 'Left' !== t.key ) ||
					  this.props.handlePan(
							{
								x: a,
								y: 0,
							},
							true
					  )
				: t.metaKey || this.props.handleReset()
			: 0 === this.props.level
			? this.props.handleZoomToActualPixels()
			: this.props.handleReset();
	}

	onKeyUp( t ) {
		t.ctrlKey || ( this.isCtrlHeld = false );
		' ' === t.key && t.preventDefault();
	}

	onActivity() {
		clearTimeout( this.activityTimeout );
		this.activityTimeout = setTimeout( this.handleInactivity, N );
		this.state.isRecentlyActive ||
			this.setState( function() {
				return {
					isRecentlyActive: true,
				};
			} );
	}

	setIsHoveringTooltip( t ) {
		this.setState( function() {
			return {
				isHoveringTooltip: t,
				isRecentlyActive: false,
			};
		} );
	}

	handleInactivity() {
		this.setState( function() {
			return {
				isRecentlyActive: false,
			};
		} );
	}

	handleSliderChange( t ) {
		this.props.handleSlider( Number( t.target.value ), this.isCtrlHeld );
	}

	calcTooltipOffset() {
		var t = 12;
		var a = 0.5;
		return ( this.props.level - a ) * ( this.inputWidth - t );
	}

	_makeSharedTooltipOptions() {
		var t = this;
		return {
			zIndex: 'above_fs',
			onMouseEnter: function e() {
				return t.setIsHoveringTooltip( true );
			},
			onMouseLeave: function e() {
				return t.setIsHoveringTooltip( false );
			},
		};
	}

	handleClick = e => {
		// alert("dd");
		// e.preventDefault();
		e.stopPropagation();
	};

	renderSlider() {
		var t = this;
		return React.createElement(
			Tooltip,
			Object.assign( {}, this._makeSharedTooltipOptions(), {
				ref: function e( a ) {
					t.tooltip = a;
				},
				offsetX: this.calcTooltipOffset(),
				tip: this.props.displayLevel,
				shouldForceVisible: this.state.isRecentlyActive && ! this.state.isHoveringTooltip,
			} ),
			React.createElement( 'input', {
				className: M,
				type: 'range',
				min: 0,
				max: 1,
				value: this.props.level,
				onChange: this.handleSliderChange,
				step: 0.01,
				onKeyDown: function e( t ) {
					return t.preventDefault();
				},
				onKeyPress: function e( t ) {
					return t.preventDefault();
				},
				onClick: this.handleClick,
			} )
		);
	}

	render() {
		var t = this;
		var a = this.props.level > 0;
		if ( ! this.props.featureModernImageViewer ) return null;
		return React.createElement(
			'div',
			{
				className: classNames( 'p-zoom', this.props.className, {
					'p-zoom--hidden': ! this.props.isVisible,
				} ),
				onMouseEnter: this.props.onMouseEnter,
				onMouseLeave: this.props.onMouseLeave,
			},
			React.createElement(
				'div',
				{
					className: 'p-zoom__control_group',
				},
				React.createElement(
					Tooltip,
					Object.assign( {}, this._makeSharedTooltipOptions(), {
						tip: x( 'Thu nhỏ', 'Press -' ),
					} ),
					React.createElement( Icon, {
						type: 'minus',
						className: 'p-zoom__button--zoom_out',
						onClick: function e( event ) {
							// console.log(event);
							event.stopPropagation();
							return t.props.handleZoomOut();
						},
					} )
				),
				this.renderSlider(),
				React.createElement(
					Tooltip,
					Object.assign( {}, this._makeSharedTooltipOptions(), {
						tip: x( 'Phóng to', 'Press + or =' ),
					} ),
					React.createElement( Icon, {
						type: 'plus',
						className: 'p-zoom__button--zoom_in',
						onClick: function e( event ) {
							event.stopPropagation();
							return t.props.handleZoomIn();
						},
					} )
				)
			),
			React.createElement(
				Tooltip,
				Object.assign( {}, this._makeSharedTooltipOptions(), {
					tip: x( 'Reset', 'Press space' ),
				} ),
				React.createElement( Icon, {
					type: 'collapse-vertical',
					className: 'p-zoom__control_group p-zoom__button--reset',
					disabled: ! a,
					onClick: function( event ) {
						event.stopPropagation();
						return t.props.handleReset();
					},
				} )
			)
		);
	}
}

export default ZoomControl;
