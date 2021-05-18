import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { find, forEach, map, mapKeys, snakeCase, filter } from 'lodash';
import classNames from 'classnames';
import { intlShape } from 'react-intl';
import ColorInput from 'papo-components/ColorInput';
import FormField from 'papo-components/FormField';
import Modal from 'papo-components/Modal';
import Input from 'papo-components/Input';
import ToggleSwitch from 'papo-components/ToggleSwitch';
import { MessageBoxFunctionalLayout } from 'papo-components/MessageBox';

import formState from 'lib/form-state';
import FormFieldset from 'components/forms/form-fieldset';
import TagItem from './tag-item';
import Layout from 'components/horizontal-layout/layout';
import WidthCache from 'components/horizontal-layout/width-cache';
import TagsLayout from './tags-layout';
import GlobalEventEmitter from 'utils/global-event-emitter';
import EventTypes from 'utils/event-types';
import Constants from 'utils/constants';
import EditTag from './edit-tag';

import { addNewPageTag } from 'actions/page';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

const compareSelected = direction => ( a, b ) => {
	if ( a.selected === b.selected ) {
		return 0;
	}

	if ( a.selected ) {
		return -1 * direction;
	}

	return 1 * direction;
};

const compareDate = direction => ( a, b ) => ( a.create_at - b.create_at ) * direction;

const createSort = ( comparers = [] ) => ( a, b ) =>
	comparers.reduce( ( result, compareFn ) => ( result === 0 ? compareFn( a, b ) : result ), 0 );

class Tags extends React.Component {
	static displayName = 'Tags';

	static propTypes = {
		pageId: PropTypes.string.isRequired,
		pageTags: PropTypes.array,
		conversationTags: PropTypes.array,
	};

	static defaultProps = {
		pageTags: [],
		conversationTags: [],
	};

	static contextTypes = {
		intl: intlShape,
	};

	constructor( props ) {
		super( props );

		this.trigger = React.createRef();

		this.widthCache = new WidthCache( {
			DEFAULT_WIDTH: 50,
		} );

		this.layout = new Layout( {
			widthCache: this.widthCache,
		} );
		this.keys = [];
		this.columns = [];
		this.sortedPageTags = [];

		this.state = {
			form: null,
			formSubmitting: false,
			notice: null,
			showTagCreateDialog: false,
			editTagMode: false,
			editTag: null,
			newTag: {
				name: '',
				color: '#065535',
				is_private: false,
			},
			autoSort: true,
			showMyTags: true,

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

	componentDidMount() {
		GlobalEventEmitter.addListener( EventTypes.CREATE_PAGE_TAG_SUCCESS, this.handleSuccessCreate );
	}

	componentWillUnmount() {
		GlobalEventEmitter.removeListener(
			EventTypes.CREATE_PAGE_TAG_SUCCESS,
			this.handleSuccessCreate
		);
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.conversation.id !== this.props.conversation.id ) {
			this.keys = [];
			this.columns = [];
		}

		//this.tags && this.tags.reLayout();
	}

	getInitialFields() {
		return {
			name: '',
			isPrivate: false,
			color: '#F7412C',
		};
	}

	validate = ( fields, onComplete ) => {
		const { formatMessage } = this.context.intl;

		let messages = {};

		if ( ! fields.name || fields.name.length === 0 ) {
			messages = Object.assign( messages, {
				name: {
					invalid: formatMessage( {
						id: 'conversations.create_new_tag.tag_name_error',
						defaultMessage: 'Please enter your tag name',
					} ),
				},
			} );
			onComplete( false, messages );
			return;
		}
		onComplete( false, messages );
	};

	getErrorMessagesWithCreateTag( fieldName ) {
		const messages = formState.getFieldErrorMessages( this.state.form, fieldName );
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

	handleFormControllerError( error ) {
		if ( error ) {
			console.log( error );
			// throw error;
		}
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

	handleColorChangeComplete = color => {
		if ( ! color || color.length === 0 ) return;

		this.formStateController.handleFieldChange( {
			name: 'color',
			value: color,
		} );
	};

	showTagCreateDialog = () => {
		this.setState( { showTagCreateDialog: true } );
	};

	closeDialog = () => {
		this.setState( { showTagCreateDialog: false } );
	};

	closeEditDialog = () => {
		this.setState( { editTag: null } );
	};

	handleSuccessCreate = () => {
		this.formElem &&
			this.setState( {
				formSubmitting: false,
				form: this.formStateController.getInitialState(),
			} );
	};

	handleTagClick = t => {
		if ( this.state.editTagMode ) {
			this.setState( {
				editTag: t,
			} );
			// console.log("t", t);
			return;
		}

		if ( this.props.onClickTag && t.id ) {
			this.props.onClickTag( t );
		}
	};

	handleTagAction = tagName => {
		if ( tagName === 'createTag' ) {
			this.setState( {
				showTagCreateDialog: true,
			} );
		}

		if ( tagName === 'editTag' ) {
			this.setState( {
				editTagMode: ! this.state.editTagMode,
			} );
		}
	};

	handleEditModeChange = editMode => {
		if ( ! this.state.editTagMode ) return null;
		this.setState( {
			editTagMode: editMode,
		} );
	};

	storeForm = ref => ( this.formElem = ref );

	handleSubmit = () => {
		if ( this.state.formSubmitting ) {
			return;
		}

		this.formStateController.handleSubmit( hasErrors => {
			if ( hasErrors ) {
				this.setState( { formSubmitting: false } );
				return;
			}

			this.setState( { formSubmitting: true }, () => {
				const tagData = this.getTagDataForApi();
				tagData.is_private = !! tagData.is_private;
				this.props.addNewPageTag( Object.assign( tagData, { page_id: this.props.pageId } ) );
			} );
		} );
	};

	getTagDataForApi = () => {
		return mapKeys( formState.getAllFieldValues( this.state.form ), ( value, key ) => {
			return snakeCase( key );
		} );
	};

	renderEditModal = () => {
		const { formatMessage } = this.context.intl;
		return (
			<Modal
				isOpen={ true }
				className={ classNames( g_styles.general_confirm_dialog, g_styles.dialog_size_medium ) }
				overlayClassName="dsfsdf"
				title={ formatMessage( {
					id: 'conversations.edit_tag_dialog_title',
					defaultMessage: 'Edit tag',
				} ) }
				onRequestClose={ this.closeEditDialog }
				shouldDisplayCloseButton
				shouldCloseOnOverlayClick
				scrollableContent={ false }
			>
				<MessageBoxFunctionalLayout
					theme="blue"
					title={ formatMessage( {
						id: 'conversations.edit_tag_dialog_title',
						defaultMessage: 'Edit tag',
					} ) }
					confirmText={ formatMessage( {
						id: 'conversations.edit_tag_submit_btn',
						defaultMessage: 'Submit',
					} ) }
					cancelText="Cancel"
					onOk={ this.handleSubmit }
					onCancel={ this.closeEditDialog }
				>
					<EditTag tag={ this.state.editTag } />
				</MessageBoxFunctionalLayout>
			</Modal>
		);
	};

	renderModal = () => {
		const { formatMessage } = this.context.intl;

		return (
			<Modal
				isOpen={ true }
				className={ classNames( g_styles.general_confirm_dialog, g_styles.dialog_size_medium ) }
				overlayClassName="dsfsdf"
				title={ formatMessage( {
					id: 'conversations.create_new_tag',
					defaultMessage: 'Create new tag',
				} ) }
				onRequestClose={ this.closeDialog }
				shouldDisplayCloseButton
				shouldCloseOnOverlayClick
				scrollableContent={ false }
			>
				<MessageBoxFunctionalLayout
					theme="blue"
					title={ formatMessage( {
						id: 'conversations.create_new_tag',
						defaultMessage: 'Create new tag',
					} ) }
					confirmText={ formatMessage( {
						id: 'conversations.btn_submit_new_tag_txt',
						defaultMessage: 'Add tag',
					} ) }
					cancelText="Cancel"
					onOk={ this.handleSubmit }
					onCancel={ this.closeDialog }
					disableConfirmation={
						formState.hasErrors( this.state.form ) ||
						! formState.getFieldValue( this.state.form, 'name' )
					}
				>
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
				</MessageBoxFunctionalLayout>
			</Modal>
		);

		// return (
		// 	<AlertDialog
		// 		className={ classNames( g_styles.general_confirm_dialog, g_styles.dialog_size_medium ) }
		// 		overlayClassName="dsfsdf"
		// 		title={ formatMessage( {
		// 			id: 'conversations.create_new_tag',
		// 			defaultMessage: 'Create new tag',
		// 		} ) }
		// 		goButtonText={ formatMessage( {
		// 			id: 'conversations.btn_submit_new_tag_txt',
		// 			defaultMessage: 'Add tag',
		// 		} ) }
		// 		onGo={ this.handleSubmit }
		// 		onClose={ this.closeDialog }
		// 		onEscape={ this.closeDialog }
		// 		shouldCloseOnGo={ false }
		// 		shouldCloseOnEsc={ true }
		// 	>
		// 		<form onSubmit={ this.handleSubmit } ref={ this.storeForm }>
		// 			<FormFieldset>
		// 				<FormTextInput
		// 					autoFocus
		// 					id="name"
		// 					name="name"
		// 					value={ formState.getFieldValue( this.state.form, 'name' ) }
		// 					placeholder={ formatMessage( {
		// 						id: 'conversations.create_new_tag_placeholder',
		// 						defaultMessage: 'Tag name',
		// 					} ) }
		// 					onChange={ this.handleChangeEvent }
		// 					isError={ formState.isFieldInvalid( this.state.form, 'name' ) }
		// 				/>
		// 				{ formState.isFieldInvalid( this.state.form, 'name' ) && (
		// 					<FormInputValidation isError text={ this.getErrorMessagesWithCreateTag( 'name' ) } />
		// 				) }
		// 			</FormFieldset>
		// 			<FormFieldset>
		// 				<FormLabel htmlFor="name">
		// 					{ formatMessage( { id: 'general.color', defaultMessage: 'Color' } ) }
		// 				</FormLabel>
		// 				<ColorInput
		// 					value={formState.getFieldValue( this.state.form, 'color' )} onConfirm={this.handleColorChangeComplete}
		// 				/>
		// 			</FormFieldset>
		// 			<FormFieldset>
		// 				{
		// 					/*<FormLabel htmlFor="name">
		// 					{ formatMessage( {
		// 						id: 'conversations.tag_display_mode',
		// 						defaultMessage: 'Display mode',
		// 					} ) }
		// 				</FormLabel>
		// 				<FormLabel>
		// 					<FormCheckbox
		// 						id="isPrivate"
		// 						name="isPrivate"
		// 						defaultChecked={ formState.getFieldValue( this.state.form, 'isPrivate' ) === true }
		// 						onChange={ this.handleChangeEvent }
		// 						value={ formState.getFieldValue( this.state.form, 'isPrivate' ) }
		// 					/>
		// 					<span>
		// 						{ formatMessage( {
		// 							id: 'conversations.private_tag_txt',
		// 							defaultMessage: 'Private',
		// 						} ) }
		// 					</span>
		// 				</FormLabel>
		// 				<FormSettingExplanation>
		// 					{ formatMessage( {
		// 						id: 'conversations.private_tag_description',
		// 						defaultMessage:
		// 							'This option let you create an private tag. When a tag is set private, only you can use it.',
		// 					} ) }
		// 				</FormSettingExplanation>*/
		// 				}
		//
		// 				<FormField
		// 					dataHook="storybook-checkbox-formfield"
		// 					id="formfieldCheckboxId"
		// 					infoContent={ formatMessage( {
		// 						id: 'conversations.private_tag_description',
		// 						defaultMessage:
		// 							'This option let you create an private tag. When a tag is set private, only you can use it.',
		// 					} ) }
		// 					label={ formatMessage( {
		// 						id: 'conversations.private_tag_txt',
		// 						defaultMessage: 'Private',
		// 					} ) }
		// 					labelPlacement="right"
		// 					stretchContent={false}
		// 					required
		// 				>
		// 					<Checkbox
		// 						id="formfieldCheckboxId"
		// 						checked={formState.getFieldValue( this.state.form, 'isPrivate' ) === true}
		// 						onChange={this.handleChangeEvent}
		// 					/>
		// 				</FormField>
		// 			</FormFieldset>
		// 		</form>
		// 	</AlertDialog>
		// );
	};

	// getKeys = () => {
	// 	const {pageTags} = this.props;
	// 	if (!pageTags || pageTags.length === 0) return [];
	// 	let n = [];
	//
	// 	forEach(pageTags, function (tag) {
	// 		n.push(tag.id);
	// 	});
	// 	return n;
	// };

	renderPageTag = tag => {
		const classes = classNames( g_styles.blue_on_hover + ' ' + styles.tag__btn, {
			[ styles.selected ]: find( this.props.conversationTags, { id: tag.id } ),
		} );

		return (
			<TagItem
				tag={ tag }
				key={ tag.id }
				id={ tag.id }
				onTagClick={ this.handleTagClick }
				onWidthChange={ this.setWidth }
				className={ classes }
				editMode={ this.state.editTagMode }
			/>
		);
	};

	setWidth( r, a ) {
		if ( ! r ) return;
		if ( Math.abs( a - this.layout.getHeight( r ) ) < 0.5 ) return;
		this.layout.setWidth( r, a );
		// this.relayout()
	}

	setTagsRef = r => {
		this.tags = r;
	};

	renderTag = key => {
		const { pageTags } = this.props;
		// console.log("pageTags", pageTags);
		const r = filter( pageTags, _item => _item.id === key );
		if ( ! r ) return null;
		const tag = r[ 0 ];

		if ( ! tag ) return null;

		return this.renderPageTag( tag );
	};

	handleSortTagsChanged = ( autoSort = false ) => {
		this.setState( {
			autoSort: autoSort,
		} );
	};

	render() {
		const { pageTags } = this.props;

		this.keys = [];
		this.columns = [];

		let sortedPageTags;

		if (
			this.props.conversationTags &&
			this.props.conversationTags.length > 0 &&
			this.state.autoSort
		) {
			pageTags &&
				pageTags.length > 0 &&
				( sortedPageTags = pageTags
					.map( item => ( {
						...item,
						selected: !! find( this.props.conversationTags, { id: item.id } ),
					} ) ) //map already copied data so sort will not mutate it
					.sort( createSort( [ compareSelected( 1 ), compareDate( -1 ) ] ) ) );
		} else {
			sortedPageTags = pageTags;
		}

		forEach( sortedPageTags, tag => {
			this.keys.push( tag.id );
			this.columns.push( {
				type: 'tag',
				data: tag,
			} );
		} );

		this.sortedPageTags = sortedPageTags;

		return (
			<div className={ g_styles.d_flex } style={ { width: this.props.width } }>
				<div className={ styles.tags__bar } style={ { width: this.props.width } }>
					<div style={ { display: 'none' } }>off-screen</div>
					<TagsLayout
						ref={ this.setTagsRef }
						width={ this.props.width }
						layout={ this.layout }
						keys={ this.keys }
						columns={ this.columns }
						itemRenderer={ this.renderTag }
						handleTagClick={ this.handleTagClick }
						handleTagActionClick={ this.handleTagAction }
						editMode={ this.state.editTagMode }
						onEditModeChange={ this.handleEditModeChange }
						editTag={ this.state.editTag }
						onSortTagsChanged={ this.handleSortTagsChanged }
					/>
					{ this.state.showTagCreateDialog && this.renderModal() }
					{ this.state.editTag && this.renderEditModal() }
				</div>
				{ /*this.renderAcions()*/ }
			</div>
		);
	}
}

export default connect(
	null,
	{ addNewPageTag }
)( Tags );
