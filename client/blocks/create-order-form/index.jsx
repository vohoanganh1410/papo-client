import React from 'react';

export default class CreateOrderForm extends React.Component {
	render() {
		return null;
	}
}

// /** @format */
// /**
//  * External dependencies
//  */
// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { localize } from 'i18n-calypso';
// import { flow, camelCase, forOwn, kebabCase, mapKeys, values } from 'lodash';
// import { connect } from 'react-redux';
// import Gridicon from 'gridicons';

// /**
//  * Internal Dependencies
//  */
// import Card from 'components/card';
// import CompactCard from 'components/card/compact';
// import CreateOrderFormFields from 'components/create-order-form-fields';
// // import { forPayments as countriesList } from 'lib/countries-list';
// import FormButton from 'components/forms/form-button';
// import formState from 'lib/form-state';
// import { validateOrderDetails } from 'lib/create-order-details';
// import { AUTO_RENEWAL, MANAGE_PURCHASES } from 'lib/url/support';
// import { savePost } from 'state/posts/actions';
// import { getSelectedSiteId } from 'state/ui/selectors';
// import { sendOrder } from 'state/realtime/connection/actions';
// import { graphConversationByURL } from 'lib/facebook';
// import ConversationGraphValidationStore from 'lib/conversation/stores/conversation-graph-validation';
// import {
// 	getGraphError,
// 	getPage,
// 	getConversationType,
// 	getConversationId,
// 	getConversationPostId,
// } from 'state/conversation/selectors';

// class CreateOrderForm extends Component {
// 	static displayName = 'CreateOrderForm';

// 	static propTypes = {
// 		apiParams: PropTypes.object,
// 		createCardToken: PropTypes.func,
// 		initialValues: PropTypes.object,
// 		recordFormSubmitEvent: PropTypes.func,
// 		saveStoredCard: PropTypes.func,
// 		successCallback: PropTypes.func,
// 		showUsedForExistingPurchasesInfo: PropTypes.bool,
// 	};

// 	static defaultProps = {
// 		apiParams: {},
// 		initialValues: {},
// 		saveStoredCard: null,
// 		showUsedForExistingPurchasesInfo: false,
// 	};

// 	state = {
// 		form: null,
// 		formSubmitting: false,
// 		notice: null,
// 	};

// 	fieldNames = [
// 		'name',
// 		'number',
// 		'mobile',
// 		'customerName',
// 		'country',
// 		'orderNote',
// 		'streetNumber',
// 		'address1',
// 		'address2',
// 		'phoneNumber',
// 		'streetNumber',
// 		'city',
// 		'state',
// 		'document',
// 		'brand',
// 		'publishDate',
// 	];

// 	componentWillMount() {
// 		const fields = this.fieldNames.reduce( ( result, fieldName ) => {
// 			return { ...result, [ fieldName ]: '' };
// 		}, {} );

// 		if ( this.props.initialValues ) {
// 			fields.name = this.props.initialValues.name;
// 		}

// 		this.formStateController = formState.Controller( {
// 			initialFields: fields,
// 			onNewState: this.setFormState,
// 			validatorFunction: this.validate,
// 		} );

// 		this.setState( {
// 			form: this.formStateController.getInitialState(),
// 		} );
// 	}

// 	componentDidMount() {
// 		ConversationGraphValidationStore.on( 'change', this.refreshValidation );
// 	}

// 	componentWillUnmount() {
// 		ConversationGraphValidationStore.off( 'change', this.refreshValidation );
// 	}

// 	refreshValidation = () => {
// 		const errors = ConversationGraphValidationStore.getErrors();
// 		// alert( errors );
// 		this.setState( {
// 			graphErrors: errors
// 		} );
// 	}

// 	storeForm = ref => ( this.formElem = ref );

// 	validate = ( formValues, onComplete ) =>
// 		this.formElem && onComplete( null, this.getValidationErrors() );

// 	setFormState = form => this.formElem && this.setState( { form } );

// 	endFormSubmitting = () => this.formElem && this.setState( {
// 		formSubmitting: false,
// 		form: this.formStateController.getInitialState(),
// 	} );

// 	onFieldChange = rawDetails => {
// 		// Maps params from CreateOrderFormFields component to work with formState.
// 		forOwn( rawDetails, ( value, name ) => {
// 			this.formStateController.handleFieldChange( {
// 				name,
// 				value,
// 			} );
// 			if ( name == 'name' ) {
// 				this.props.graphConversationByURL( value );
// 			}
// 		} );
// 	};

// 	getErrorMessage = fieldName => formState.getFieldErrorMessages( this.state.form, fieldName );

// 	onSubmit = event => {
// 		event.preventDefault();

// 		if ( this.state.formSubmitting ) {
// 			return;
// 		}

// 		this.setState( { formSubmitting: true } );

// 		this.formStateController.handleSubmit( hasErrors => {
// 			// console.log( hasErrors );
// 			if ( hasErrors ) {
// 				this.setState( { formSubmitting: false } );
// 				return;
// 			}

// 			this.saveOrder();
// 		} );
// 	};

// 	saveOrder = () => {
// 		const {
// 			translate,
// 			successCallback,
// 			apiParams,
// 			source,
// 			conversation_type,
// 			conversation_id,
// 			post_id,
// 		} = this.props;

// 		const cardDetails = this.getOrderDetails();
// 		if ( ! this.formElem ) {
// 			return;
// 		}

// 		// this.props.graphConversationByURL( cardDetails.name )
// 		// 	.then( response => {
// 				// console.log( response );
// 				const updatedCreditCardApiParams = this.getParamsForApi(
// 					cardDetails,
// 					apiParams
// 				);

// 				const extraInfo = {
// 					site_ID: this.props.siteId,
// 					source: Object.assign( source, { URL: cardDetails.name, } ),
// 					from: {
// 						name: updatedCreditCardApiParams.name,
// 						mobile: updatedCreditCardApiParams.mobile,
// 					},
// 					conversation_type: conversation_type,
// 					conversation_id: conversation_id,
// 					post_id: post_id,
// 				}

// 				console.log( Object.assign( updatedCreditCardApiParams, extraInfo ) );
// 				// return;

// 				this.props.savePost( this.props.siteId, this.props.postId, Object.assign( updatedCreditCardApiParams, extraInfo ) )
// 					.then( post => {
// 						// send to socket io for realtime
// 						this.props.sendOrder( post );
// 						this.endFormSubmitting();
// 					} )
// 					.catch( err => {
// 						this.endFormSubmitting();
// 					} );
// 			// } )
// 			// .catch( error => {
// 			// 	console.log( error );
// 			// } );
// 	}

// 	getParamsForApi( cardDetails, cardToken, extraParams = {} ) {
// 		// console.log(cardDetails);
// 		return {
// 			...extraParams,
// 			country: cardDetails.country,
// 			zip: cardDetails[ 'order-note' ],
// 			name: cardDetails[ 'customer-name' ],
// 			mobile: cardDetails.mobile,
// 			street_number: cardDetails[ 'street-number' ],
// 			address_1: cardDetails[ 'address-1' ],
// 			address_2: cardDetails[ 'address-2' ],
// 			city: cardDetails.city,
// 			state: cardDetails.state,
// 			phone_number: cardDetails[ 'phone-number' ],
// 		};
// 	}

// 	getValidationErrors() {
// 		// console.log(this.getOrderDetails());
// 		const validationResult = this.props.validateOrderDetails( this.getOrderDetails() );

// 		// Maps keys from credit card validator to work with formState.
// 		return mapKeys( validationResult.errors, ( value, key ) => {
// 			return camelCase( key );
// 		} );
// 	}

// 	getOrderDetails() {
// 		// Maps keys from formState to work with CreateOrderFormFields component and credit card validator.
// 		return mapKeys( formState.getAllFieldValues( this.state.form ), ( value, key ) => {
// 			return kebabCase( key );
// 		} );
// 	}

// 	// setPostDate = date => {
// 	// 	// console.log( date );
// 	// 	const { site } = this.props;
// 	// 	const dateValue = date ? date.format() : null;
// 	// 	console.log( date );
// 	// 	// this.state.post.date = dateValue;
// 	// 	// // TODO: REDUX - remove flux actions when whole post-editor is reduxified
// 	// 	// actions.edit( { date: dateValue } );

// 	// 	// this.props.editPost( siteId, postId, { date: dateValue } );

// 	// 	// analytics.tracks.recordEvent( 'calypso_editor_publish_date_change', {
// 	// 	// 	context: 'open' === this.state.confirmationSidebar ? 'confirmation-sidebar' : 'post-settings',
// 	// 	// } );

// 	// 	// this.checkForDateChange( dateValue );
// 	// }

// 	render() {
// 		const { translate, graphError } = this.props;
// 		console.log( graphError );
// 		return (
// 			<form onSubmit={ this.onSubmit } ref={ this.storeForm }>
// 				<Card className="credit-card-form__content">
// 					<CreateOrderFormFields
// 						card={ this.getOrderDetails() }
// 						eventFormName="Edit Card Details Form"
// 						onFieldChange={ this.onFieldChange }
// 						getErrorMessage={ this.getErrorMessage }
// 						disabled={ this.state.formSubmitting }
// 						graphError={ graphError }
// 					/>
// 					<div className="credit-card-form__card-terms">
// 						<Gridicon icon="info-outline" size={ 18 } />
// 						<p>
// 							{ translate(
// 								'By saving a credit card, you agree to our {{tosLink}}Terms of Service{{/tosLink}}, and if ' +
// 									'you use it to pay for a subscription or plan, you authorize your credit card to be charged ' +
// 									'on a recurring basis until you cancel, which you can do at any time. ' +
// 									'You understand {{autoRenewalSupportPage}}how your subscription works{{/autoRenewalSupportPage}} ' +
// 									'and {{managePurchasesSupportPage}}how to cancel{{/managePurchasesSupportPage}}.',
// 								{
// 									components: {
// 										tosLink: (
// 											<a href="//www.papovn.com/tos/" target="_blank" rel="noopener noreferrer" />
// 										),
// 										autoRenewalSupportPage: (
// 											<a href={ AUTO_RENEWAL } target="_blank" rel="noopener noreferrer" />
// 										),
// 										managePurchasesSupportPage: (
// 											<a href={ MANAGE_PURCHASES } target="_blank" rel="noopener noreferrer" />
// 										),
// 									},
// 								}
// 							) }
// 						</p>
// 					</div>
// 					{ this.renderUsedForExistingPurchases() }
// 				</Card>
// 				<CompactCard className="credit-card-form__footer">
// 					<em>{ translate( '(*) Các trường bắt buộc' ) }</em>
// 					<FormButton disabled={ this.state.formSubmitting } type="submit">
// 						{ this.state.formSubmitting
// 							? translate( 'Đang tạo Order…', {
// 									context: 'Button label',
// 									comment: 'Create Order',
// 								} )
// 							: translate( 'Tạo Order', {
// 									context: 'Button label',
// 									comment: 'Credit card',
// 								} ) }
// 					</FormButton>
// 				</CompactCard>
// 			</form>
// 		);
// 	}

// 	renderUsedForExistingPurchases() {
// 		const { translate, showUsedForExistingPurchasesInfo } = this.props;

// 		if ( ! showUsedForExistingPurchasesInfo ) {
// 			return;
// 		}

// 		return (
// 			<div className="credit-card-form__card-terms">
// 				<Gridicon icon="info-outline" size={ 18 } />
// 				<p>{ translate( 'This card will be used for future renewals of existing purchases.' ) }</p>
// 			</div>
// 		);
// 	}
// }

// // export default localize( CreateOrderForm );

// // export default connect(
// // 	( state ) => {
// // 		const siteId = getSelectedSiteId( state );
// // 		return {
// // 			siteId: siteId,
// // 		};
// // 	},
// // 	{
// // 		savePost: savePost,
// // 	}
// // )( localize( CreateOrderForm ) );

// const mapState = ( state, props ) => {
// 	const siteId = getSelectedSiteId( state );
// 	const source = getPage( state );

// 	return {
// 		siteId: siteId,
// 		source,
// 		graphError: getGraphError( state ),
// 		conversation_type: getConversationType( state ),
// 		conversation_id: getConversationId( state ),
// 		post_id: getConversationPostId( state ),
// 	};
// };

// const mapDispatch = {
// 	savePost: savePost /*withoutNotice( savePost )*/,
// 	sendOrder: sendOrder,
// 	validateOrderDetails,
// 	graphConversationByURL,
// };

// export default flow( localize, connect( mapState, mapDispatch ) )( CreateOrderForm );
