/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { debounce, partial } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import FormRange from 'components/forms/range';
import Icon from 'components/icon2';

import styles from './style.scss';
import UnstyledButton from 'components/button2/unstyled-button';
import g_styles from 'components/general-styles.scss';

/**
 * Constants
 */

/**
 * Scale choices are 12, 8, 6, 4, and 3 items per row, with some horizontal
 * padding between items
 *
 * @type {Array}
 */
const SCALE_CHOICES = [ 0.077, 0.115, 0.157, 0.24, 0.323 ];

/**
 * Number of steps on the rendered input range
 *
 * @type {Number}
 */
const SLIDER_STEPS = 100;

/**
 * Scale size for small viewports grid option (3 items per row).
 *
 * @type {Number}
 */
const SCALE_TOUCH_GRID = 0.32;

class MediaLibraryScale extends Component {
	static propTypes = {
		mediaScale: PropTypes.number,
		onChange: PropTypes.func,
		setMediaScalePreference: PropTypes.func,
		saveMediaScalePreference: PropTypes.func,
	};

	static defaultProps = {
		onChange: () => {},
	};

	constructor( props ) {
		super( props );

		this.onScaleChange = this.onScaleChange.bind( this );
		this.savePreference = this.savePreference.bind( this );
		this.debouncedSavePreference = debounce( this.savePreference, 1000 );
		this.setScaleToMobileGrid = this.setScale.bind( this, SCALE_TOUCH_GRID );
		this.setScaleToMobileFull = this.setScale.bind( this, 1 );
		this.debouncedSetScale = debounce( this.setScale, 150 );

		this.state = {
			scale: props.scale,
		};
	}

	componentWillUnmount() {
		this.debouncedSavePreference.cancel();
	}

	componentWillReceiveProps( nextProps, nextContext ) {
		this.setState( {
			scale: nextProps.scale,
		} );
	}

	savePreference( value ) {
		// no need at this time
		// this.props.saveMediaScalePreference( value );
	}

	setScale( value ) {
		if ( value === this.state.scale ) {
			return;
		}

		this.props.onChange( value );
		// this.props.setMediaScalePreference( value );
		this.debouncedSavePreference( value );
	}

	onScaleChange( event ) {
		const sliderPosition = parseInt( event.target.value, 10 );
		const scaleIndex = ( sliderPosition * SCALE_CHOICES.length ) / SLIDER_STEPS;
		const scale = SCALE_CHOICES[ Math.floor( scaleIndex ) ];

		this.setState( { sliderPosition, scale: scale } );
		this.setScale( scale );
	}

	getSliderPosition() {
		// As part of the smooth motion of the slider, the user can move it
		// between two snap points, and we want to remember this.
		// if ( this.state.hasOwnProperty( 'sliderPosition' ) ) {
		// 	return this.state.sliderPosition;
		// }

		const { scale } = this.state;

		// Map the media scale index back to a slider position as follows:
		// index 0 -> position 0
		// index SCALE_CHOICES.length - 1 -> position SLIDER_STEPS - 1
		const scaleIndex = SCALE_CHOICES.indexOf( scale );
		if ( -1 === scaleIndex ) {
			return 0;
		}

		return Math.floor( ( scaleIndex * ( SLIDER_STEPS - 1 ) ) / ( SCALE_CHOICES.length - 1 ) );
	}

	_setMinScale = () => {
		this.setState(
			{
				scale: SCALE_CHOICES[ 0 ],
			},
			() => {
				this.setScale( SCALE_CHOICES[ 0 ] );
				this.props.onChange( SCALE_CHOICES[ 0 ] );
			}
		);
	};

	_setMaxScale = () => {
		this.setState(
			{
				scale: SCALE_CHOICES[ SCALE_CHOICES.length - 1 ],
			},
			() => {
				this.setScale( SCALE_CHOICES[ SCALE_CHOICES.length - 1 ] );
				this.props.onChange( SCALE_CHOICES[ SCALE_CHOICES.length - 1 ] );
			}
		);
	};

	render() {
		const { scale } = this.state;

		return (
			<div className={ styles.media_library__scale }>
				<FormRange
					step="1"
					min="0"
					max={ SLIDER_STEPS - 1 }
					minContent={
						<UnstyledButton className={ g_styles.blue_on_hover } onClick={ this._setMinScale }>
							<Icon type="image" size={ 12 } />
						</UnstyledButton>
					}
					maxContent={
						<UnstyledButton className={ g_styles.blue_on_hover } onClick={ this._setMaxScale }>
							<Icon type="image" size={ 20 } />
						</UnstyledButton>
					}
					value={ this.getSliderPosition() }
					onChange={ this.onScaleChange }
					className={ styles.media_library__scale_range }
				/>
			</div>
		);
	}
}

export default connect(
	state => ( {
		scale: /*getPreference( state, 'mediaScale' )*/ 0.157,
	} ),
	{
		// setMediaScalePreference: partial( setPreference, 'mediaScale' ),
		// saveMediaScalePreference: partial( savePreference, 'mediaScale' ),
	}
)( localize( MediaLibraryScale ) );
