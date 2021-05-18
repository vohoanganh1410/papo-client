/** @format */

/**
 * External dependencies
 */

import ReactDom from 'react-dom';
import React, { Component } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import CountedTextarea from 'components/forms/counted-textarea';
import FormInputValidation from 'components/forms/form-input-validation';
import FormLabel from 'components/forms/form-label';

class OrderNote extends Component {
	static displayName = 'OrderNote';
	static defaultProps = { autoFocus: false, autoComplete: 'off' };

	componentDidMount() {
		this.setupInputModeHandlers();
		this.autoFocusInput();
	}

	setupInputModeHandlers = () => {
		const inputElement = ReactDom.findDOMNode( this.refs.input );

		if ( this.props.inputMode === 'numeric' ) {
			// This forces mobile browsers to use a numeric keyboard. We have to
			// toggle the pattern on and off to avoid getting errors against the
			// masked value (which could contain characters other than digits).
			//
			// This workaround is based on the following StackOverflow post:
			// http://stackoverflow.com/a/19998430/821706
			inputElement.addEventListener( 'touchstart', () => ( inputElement.pattern = '\\d*' ) );

			[ 'keydown', 'blur' ].forEach( eventName =>
				inputElement.addEventListener( eventName, () => ( inputElement.pattern = '.*' ) )
			);
		}
	};

	componentDidUpdate( oldProps ) {
		if ( oldProps.disabled && ! this.props.disabled ) {
			// We focus when the state goes from disabled to enabled. This is needed because we show a disabled input
			// until we receive data from the server.
			this.autoFocusInput();
		}
	}

	focus = () => {
		const node = ReactDom.findDOMNode( this.refs.input );
		node.focus();
		scrollIntoViewport( node );
	};

	autoFocusInput = () => {
		if ( this.props.autoFocus ) {
			this.focus();
		}
	};

	recordFieldClick = () => {
		if ( this.props.eventFormName ) {
			// analytics.ga.recordEvent(
			// 	'Upgrades',
			// 	`Clicked ${ this.props.eventFormName } Field`,
			// 	this.props.name
			// );
		}
	};

	// onChange = event => {
	// 	this.setState( {
	// 		value: event.target.value,
	// 	} );
	// };

	render() {
		const classes = classNames(
			this.props.additionalClasses,
			this.props.name,
			this.props.labelClass,
			this.props.classes
		);

		return (
			<div className={ classes }>
				<FormLabel htmlFor={ this.props.name }>{ this.props.label }</FormLabel>
				<CountedTextarea 
					value={ this.props.value }
					name={ this.props.name }
					placeholder={ this.props.placeholder ? this.props.placeholder : this.props.label }
					onChange={ this.props.onChange }
					isError={ this.props.isError }
					acceptableLength={ 120 } 
					showRemainingCharacters = { true }/>
				{ this.props.errorMessage && (
					<FormInputValidation text={ this.props.errorMessage } isError />
				) }
			</div>
		);
	}
}

export default OrderNote;