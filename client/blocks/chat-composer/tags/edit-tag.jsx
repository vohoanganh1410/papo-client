import React from 'react';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import formState from 'lib/form-state';
import FormFieldset from 'components/forms/form-fieldset';
import Input from 'papo-components/Input';
import ToggleSwitch from 'papo-components/ToggleSwitch';
import ColorInput from 'papo-components/ColorInput';
import FormField from 'papo-components/FormField';
import Constants from 'utils/constants';

export default class EditTag extends React.PureComponent {
	static displayName = 'EditTag';

	static propTypes = {
		editTag: PropTypes.object,
	};

	static contextTypes = {
		intl: intlShape,
	};

	constructor( props ) {
		super( props );

		this.state = {
			form: null,
			formSubmitting: false,

			/*
			 * These are default colors for initial tags
			 * */
			colors: Constants.TAG_COLORS,
		};
	}

	componentWillMount() {
		this.formStateController = new formState.Controller( {
			initialFields: this.getInitialFields(),
			validatorFunction: this.validate,
			onNewState: this.setFormState,
			hideFieldErrorsOnChange: true,
			onError: this.handleFormControllerError,
		} );

		this.setFormState( this.formStateController.getInitialState() );
	}

	getInitialFields() {
		const { tag } = this.props;
		return {
			name: tag ? tag.name : '',
			isPrivate: tag ? tag.is_private : false,
			color: tag ? tag.color : '#F7412C',
		};
	}

	setFormState = state => {
		this.setState( { form: state } );
	};

	handleChangeEvent = event => {
		const name = event.target.id;
		let value = event.target.value;

		this.setState( { notice: null } );

		if ( name === 'isPrivate' ) {
			const oldValue = formState.getFieldValue( this.state.form, 'isPrivate' );
			value = ! oldValue;
		}

		this.formStateController.handleFieldChange( {
			name: name,
			value: value,
		} );
	};

	getErrorMessagesWithCreateTag( fieldName ) {
		const messages = formState.getFieldErrorMessages( this.state.form, fieldName );
		// console.log(messages);
		if ( ! messages ) {
			return;
		}

		return map( messages, ( message, error_code ) => {
			if ( error_code === 'taken' ) {
				return (
					<span key={ error_code }>
						<p>{ message }</p>
					</span>
				);
			}
			return message;
		} );
	}

	handleColorChangeComplete = color => {
		this.formStateController.handleFieldChange( {
			name: 'color',
			value: color,
		} );
	};

	storeForm = ref => ( this.formElem = ref );

	render() {
		const { formatMessage } = this.context.intl;

		return (
			<form onSubmit={ this.handleSubmit } ref={ this.storeForm }>
				<FormFieldset>
					<FormField
						label={ formatMessage( { id: 'general.tag_name', defaultMessage: 'Tag name' } ) }
						required
					>
						<Input
							id="name"
							autoFocus
							onChange={ this.handleChangeEvent }
							value={ formState.getFieldValue( this.state.form, 'name' ) }
							placeholder={ formatMessage( {
								id: 'conversations.create_new_tag_placeholder',
								defaultMessage: 'Tag name',
							} ) }
							error={ formState.isFieldInvalid( this.state.form, 'name' ) }
							errorMessage={ this.getErrorMessagesWithCreateTag( 'name' ) }
						/>
					</FormField>
				</FormFieldset>
				<FormFieldset>
					<FormField
						label={ formatMessage( { id: 'general.color', defaultMessage: 'Color' } ) }
						required
					>
						<ColorInput
							id="color"
							value={ formState.getFieldValue( this.state.form, 'color' ) || null }
							onConfirm={ this.handleColorChangeComplete }
						/>
					</FormField>
				</FormFieldset>
				<FormFieldset>
					<FormField
						id="formfieldCheckboxId"
						infoContent={ formatMessage( {
							id: 'conversations.private_tag_description',
							defaultMessage:
								'This option let you create an private tag. When a tag is set private, only you can use it.',
						} ) }
						label={ formatMessage( {
							id: 'conversations.private_tag_txt',
							defaultMessage: 'Private',
						} ) }
						labelPlacement="right"
						stretchContent={ false }
					>
						<ToggleSwitch
							id="isPrivate"
							checked={ formState.getFieldValue( this.state.form, 'isPrivate' ) === true }
							onChange={ this.handleChangeEvent }
						/>
					</FormField>
				</FormFieldset>
			</form>
		);
	}
}
