/** @format */
/**
 * External dependencies
 */
import creditcards from 'creditcards';
import { capitalize, compact, isArray, isEmpty, pick, includes } from 'lodash';
import i18n from 'i18n-calypso';
import validator from 'validator';

/**
 * Internal dependencies
 */
// import { isEbanxEnabledForCountry, isValidCPF } from 'lib/credit-card-details/ebanx';
// import { isPhoneNumberValid } from 'lib/phone-number/isValid';
import { PAYMENT_PROCESSOR_EBANX_COUNTRIES } from './constants';
import {
	graphConversationByURL,
} from 'lib/facebook';
import {
	CONVERSATION_POST_REQUEST,
	CONVERSATION_POST_REQUEST_FAILED,
	CONVERSATION_POST_REQUEST_SUCCESS,
	CONVERSATION_POST_RECEIVED,
	CONVERSATION_SET_CURRENT_MESSAGE,
	CONVERSATION_SEND_TYPING,
	CONVERSATION_SEND_NOT_TYPING,
	CONVERSATION_GRAPH_FAILED,
	CONVERSATION_TYPE_RECEIVED,
	CONVERSATION_SOURCE_RECEIVED,
} from 'state/action-types';
import { openEditorSidebar, closeEditorSidebar } from 'state/ui/editor/sidebar/actions';
import { getGraphError } from 'state/conversation/selectors';
import Dispatcher from 'dispatcher';
import { action as ActionTypes } from 'lib/conversation/constants';
import ConversationGraphValidationStore from 'lib/conversation/stores/conversation-graph-validation';


function ebanxFieldRules( country ) {
	const requiredFields = PAYMENT_PROCESSOR_EBANX_COUNTRIES[ country ].requiredFields || [];

	return pick(
		{
			document: {
				description: i18n.translate( 'Taxpayer Identification Number' ),
				rules: [ 'validCPF' ],
			},

			'street-number': {
				description: i18n.translate( 'Street Number' ),
				rules: [ 'required' ],
			},

			'address-1': {
				description: i18n.translate( 'Address' ),
				rules: [ 'required' ],
			},

			state: {
				description: i18n.translate( 'State' ),
				rules: [ 'required' ],
			},

			city: {
				description: i18n.translate( 'City' ),
				rules: [ 'required' ],
			},

			'phone-number': {
				description: i18n.translate( 'Phone Number' ),
				rules: [ 'required' ],
			},
		},
		requiredFields
	);
}

function creditCardFieldRules( additionalFieldRules = {} ) {
	return Object.assign(
		{
			name: {
				description: i18n.translate( 'Link hội thoại', {
					context: 'Upgrades: Card holder name label on credit card form',
				} ),
				rules: [ 'validateConversationLink' ],
			},

			// number: {
			// 	description: i18n.translate( 'Card Number', {
			// 		context: 'Upgrades: Card number label on credit card form',
			// 	} ),
			// 	rules: [ 'validCreditCardNumber' ],
			// },

			'customer-name': {
				description: i18n.translate( 'Tên (hoặc tên Facebook) khách hàng' ),
				rules: [ 'validCustomerName' ],
			},

			mobile: {
				description: i18n.translate( 'Số điện thoại khách hàng' ),
				rules: [ 'validPhoneNumber' ],
			},

			// country: {
			// 	description: i18n.translate( 'Country' ),
			// 	rules: [ 'required' ],
			// },

			'order-note': {
				description: i18n.translate( 'Ghi chú', {
					context: 'Upgrades: Postal code on credit card form',
				} ),
				rules: [ 'validOrderNote' ],
			},
		},
		additionalFieldRules
	);
}

function parseExpiration( value ) {
	const [ month, year ] = value.split( '/' );
	return {
		month: creditcards.expiration.month.parse( month ),
		year: creditcards.expiration.year.parse( year, true ),
	};
}

function validationError( description ) {
	return i18n.translate( '%(description)s không đúng', {
		args: { description: capitalize( description ) },
	} );
}

const validators = {};

validators.required = {
	isValid( value ) {
		return ! isEmpty( value );
	},

	error: function( description ) {
		return i18n.translate( '%(description)s là bắt buộc', {
			args: { description: description },
		} );
	},
};

validators.validCreditCardNumber = {
	isValid( value ) {
		if ( ! value ) {
			return false;
		}
		return true; //creditcards.card.isValid( value );
	},
	error: validationError,
};

// validators.validCvvNumber = {
// 	isValid( value ) {
// 		if ( ! value ) {
// 			return false;
// 		}
// 		return creditcards.cvc.isValid( value );
// 	},
// 	error: validationError,
// };

validators.validPhoneNumber = {
	isValid( value ) {
		if ( ! value ) {
			return false;
		}
		return validator.isMobilePhone( value, 'vi-VN' );
	},
	error: validationError,
};

validators.validCustomerName = {
	isValid: function( value ) {
		if ( ! value ) {
			return false;
		}
		return value.length > 0;
	},
	error: validationError,
};

validators.validOrderNote = {
	isValid: function( value ) {
		return value.length < 120;
	},
	error: validationError,
}

validators.validCPF = {
	isValid( value ) {
		if ( ! value ) {
			return false;
		}
		return /*isValidCPF( value );*/true;
	},
	error: function( description ) {


		return i18n.translate( '%(description)s is invalid. Must be in format: 111.444.777-XX', {
			args: { description: description },
		} );
	},
};

validators.validateConversationLink = {
	isValid( link ) {
		// need to check if error
		return true;
		// return graphConversationByURL( link, dispatch )
		// 	.then( res => {

		// 		if ( res && res.error ) {
		// 			return false;
		// 		}
		// 		return true;
		// 	} )
		// 	.catch( error => {
		// 		return false;
		// 	} )
	},
	error: function( description ) {
		// we can use this function because we return error in isValid function to redux state
		// then get error via selectors functions of conversation/state/selectors
		return i18n.translate( '%(description)s is invalid.', {
			args: { description: description },
		} );
	}
}

export function validateOrderDetails( cardDetails ) {
	return ( dispatch, getState ) => {
		// console.log( dispatch );
		const rules = creditCardFieldRules( getAdditionalFieldRules( cardDetails ) ),
			errors = Object.keys( rules ).reduce( function( allErrors, fieldName ) {
				const field = rules[ fieldName ],
					newErrors = getErrors( dispatch, field, cardDetails[ fieldName ], cardDetails );

				if ( newErrors.length ) {
					allErrors[ fieldName ] = newErrors;
				}

				return allErrors;
			}, {} );


		return { errors: errors };
	}
}

/**
 * Retrieves the type of credit card from the specified number.
 *
 * @param {string} number - credit card number
 * @returns {string|null} the type of the credit card
 * @see {@link http://en.wikipedia.org/wiki/Bank_card_number} for more information
 */
export function getCreditCardType( number ) {
	if ( number ) {
		number = number.replace( / /g, '' );

		let cardType = creditcards.card.type( number, true );

		if ( typeof cardType === 'undefined' ) {
			return null;
		}

		// We already use 'amex' for American Express everywhere else
		if ( cardType === 'American Express' ) {
			cardType = 'amex';
		}

		// Normalize Diners as well
		if ( cardType === 'Diners Club' ) {
			cardType = 'diners';
		}

		return cardType.toLowerCase();
	}

	return null;
}

function getErrors( dispatch, field, value, cardDetails ) {

	return compact(
		field.rules.map( function( rule ) {
			const validator = getValidator( rule );

			if ( ! validator.isValid( value, cardDetails, dispatch ) ) {
				return validator.error( field.description );
			}
		} )
	);
}

/**
 *
 * @param {object} cardDetails - a map of credit card field key value pairs
 * @returns {object|null} If match is found,
 * an object containing rule sets for specific credit card processing providers,
 * otherwise `null`
 */
function getAdditionalFieldRules( { country } ) {
	// if ( isEbanxEnabledForCountry( country ) ) {
	// 	return ebanxFieldRules( country );
	// }
	return null;
}

function getValidator( rule ) {
	if ( isArray( rule ) ) {
		return validators[ rule[ 0 ] ].apply( null, rule.slice( 1 ) );
	}

	return validators[ rule ];
}
