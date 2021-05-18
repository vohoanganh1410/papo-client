/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';
import { find, isEmpty, noop } from 'lodash';

/**
 * Internal dependencies
 */
import CreateOrderNumberInput from 'components/upgrades/create-order-number-input';
import { maskField, unmaskField, getCreditCardType } from 'lib/create-order-details';
import Input from 'components/number-input';
import FormPhoneMediaInput from 'components/forms/form-phone-media-input';
import OrderNote from './order-note';
import OrderPublishDate from 'components/order-publish-date';


export class CreateOrderFormFields extends React.Component {
	static propTypes = {
		card: PropTypes.object.isRequired,
		countriesList: PropTypes.object,
		eventFormName: PropTypes.string,
		onFieldChange: PropTypes.func,
		getErrorMessage: PropTypes.func,
	};

	static defaultProps = {
		eventFormName: 'Credit card input',
		onFieldChange: noop,
		getErrorMessage: noop,
	};

	constructor( props ) {
		super( props );
		this.state = {
			userSelectedPhoneCountryCode: '',
		};
	}

	createField = ( fieldName, componentClass, props ) => {
		let errorMessage = this.props.getErrorMessage( fieldName ) || [];
		// const graphError = this.props.graphError;
		if ( fieldName == 'name' ) {
			errorMessage = this.props.graphError && this.props.graphError.message 
			? [ this.props.graphError.message ] : null;
		}
		return React.createElement(
			componentClass,
			Object.assign(
				{},
				{
					additionalClasses: 'credit-card-form-fields__field',
					eventFormName: this.props.eventFormName,
					isError: ! isEmpty( errorMessage ),
					errorMessage: errorMessage ? errorMessage[ 0 ] : null,
					name: fieldName,
					onBlur: this.handleFieldChange,
					onChange: this.handleFieldChange,
					value: this.getFieldValue( fieldName ),
					autoComplete: 'off',
					disabled: this.props.disabled,

				},
				props
			)
		);
	};

	getFieldValue = fieldName => this.props.card[ fieldName ] || '';

	updateFieldValues = ( fieldName, nextValue ) => {
		const previousValue = this.getFieldValue( fieldName );

		if ( previousValue === nextValue ) {
			return;
		}

		const { onFieldChange } = this.props;

		const rawDetails = {
			[ fieldName ]: unmaskField( fieldName, previousValue, nextValue ),
		};

		const maskedDetails = {
			[ fieldName ]: maskField( fieldName, previousValue, nextValue ),
		};

		if ( fieldName === 'number' ) {
			rawDetails.brand = getCreditCardType( rawDetails[ fieldName ] );
		}

		onFieldChange( rawDetails, maskedDetails );
	};

	handlePhoneFieldChange = ( { value, countryCode } ) => {
		this.setState(
			{
				userSelectedPhoneCountryCode: countryCode,
			},
			() => {
				this.updateFieldValues( 'phone-number', value );
			}
		);
	};

	handleFieldChange = event => {
		// console.log(event);
		this.updateFieldValues( event.target.name, event.target.value );
	};

	shouldRenderEbanx() {
		return /*isEbanxEnabledForCountry( this.getFieldValue( 'country' ) );*/false;
	}

	renderEbanxFields() {
		const { translate, countriesList } = this.props;
		const { userSelectedPhoneCountryCode } = this.state;
		const countryCode = this.getFieldValue( 'country' );
		const countryData = find( countriesList.get(), { code: countryCode } );
		const countryName = countryData && countryData.name ? countryData.name : '';
		let ebanxMessage = '';
		if ( countryName ) {
			ebanxMessage = translate(
				'The following fields are also required for payments in %(countryName)s',
				{
					args: {
						countryName,
					},
				}
			);
		}

		return [
			<span key="ebanx-required-fields" className="credit-card-form-fields__info-text">
				{ ebanxMessage }
			</span>,
		];
	}

	render() {
		const { translate, countriesList } = this.props;
		// const { userSelectedPhoneCountryCode } = this.state;
		// const countryCode = this.getFieldValue( 'country' );
		// const countryData = find( countriesList.get(), { code: countryCode } );
		// const countryName = countryData && countryData.name ? countryData.name : '';
		// const ebanxDetailsRequired = this.shouldRenderEbanx();
		const creditCardFormFieldsExtrasClassNames = classNames( {
			'credit-card-form-fields__extras': true,
			'ebanx-details-required': false,
		} );

		return (
			<div className="credit-card-form-fields">
				{ this.createField( 'name', Input, {
					autoFocus: true,
					label: translate( 'Link hội thoại từ Facebook', {
						context: 'Vui lòng nhập link hội thoại từ Facebook',
					} ),
					required: true,
				} ) }

				{ /*this.createField( 'number', CreateOrderNumberInput, {
					inputMode: 'numeric',
					label: translate( 'Card Number', {
						context: 'Card number label on credit card form',
					} ),
				} ) */}

				{/*
					this.createField( 'phone-number', FormPhoneMediaInput, {
						onChange: this.handlePhoneFieldChange,
						countriesList: countriesList,
						// If the user has manually selected a country for the phone
						// number, use that, but otherwise default this to the same
						// country as the billing address.
						countryCode: userSelectedPhoneCountryCode || countryCode,
						label: translate( 'Phone' ),
						key: 'phone-number',
					} )*/
				}

				<div className={ creditCardFormFieldsExtrasClassNames }>
					{ this.createField( 'customer-name', Input, {
						/*inputMode: 'numeric',*/
						label: translate( 'Tên khách hàng', {
							context: 'Expiry label on credit card form',
						} ),
						required: true,
					} ) }

					{ this.createField( 'mobile', Input, {
						inputMode: 'numeric',
						label: translate( 'Số điện thoại', {
							context: '3 digit security number on credit card form',
						} ),
						required: true,
					} ) }

					

					{ /*this.createField( 'country', PaymentCountrySelect, {
						label: translate( 'Country' ),
						countriesList: countriesList,
						onChange: noop,
						onCountrySelected: this.updateFieldValues,
					} )*/ }

					{ /*ebanxDetailsRequired && this.renderEbanxFields()*/ }

					{ this.createField( 'order-note', OrderNote, {
						label: translate( 'Ghi chú', {
							context: 'Postal code on credit card form',
						} ),
						placeholder: translate( 'Ghi chú Order', {
							context: 'Postal code on credit card form',
						} ),
					} ) }

					{ this.createField( 'publish-date', OrderPublishDate, {
						label: translate( 'Thời gian khả dụng', {
							context: '3 digit security number on credit card form',
						} ),
					} ) }

					{ /*this.createField( 'order-note', Input, {
						label: translate( 'Ghi chú', {
							context: 'Postal code on credit card form',
						} ),
					} )*/ }
				</div>
			</div>
		);
	}
}

export default localize( CreateOrderFormFields );