import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { intlShape } from 'react-intl';
import Modal from 'papo-components/Modal';
import FormField from 'papo-components/FormField';
import Dropdown from 'papo-components/Dropdown';
import { MessageBoxFunctionalLayout } from 'papo-components/MessageBox';

import LanguageIcon from 'components/language-icon';
import UnstyledButton from 'components/button2/unstyled-button';
import * as I18n from 'i18n/i18n';
import { getCurrentUser } from 'state/current-user/selectors';
import { updateLocale } from 'actions/users';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

class LocaleButton extends React.PureComponent {
	static displayName = 'LocaleButton';

	static propTypes = {
		user: PropTypes.object.isRequired,
	};

	static contextTypes = {
		intl: intlShape,
	};

	constructor( props ) {
		super( props );

		const localeInfo = this.props.user ? I18n.getLanguageInfo( this.props.user.locale ) : null;
		// console.log("localeInfo", localeInfo);

		this.state = {
			locale: localeInfo ? { id: localeInfo.value, value: localeInfo.name } : null,
			isSaving: false,
			showDialog: false,
		};
	}

	setLanguage = e => {
		this.setState( { locale: { id: e.id, value: e.value } } );
	};

	changeLanguage = () => {
		// console.log('user', this.props.user);
		if ( this.props.user.locale === this.state.locale.value ) {
			// this.props.updateSection('');
		} else {
			this.submitUser( {
				...this.props.user,
				locale: this.state.locale.id,
			} );
		}
	};

	submitUser = user => {
		this.setState( { isSaving: true } );

		this.props.updateLocale( user ).then( ( { data, error: err } ) => {
			if ( data ) {
				// Do nothing since changing the locale essentially refreshes the page
			} else if ( err ) {
				let serverError;
				if ( err.message ) {
					serverError = err.message;
				} else {
					serverError = err;
				}
				this.setState( { serverError, isSaving: false } );
			}
		} );
	};

	_onShowLanguageDialog = () => {
		this.setState( {
			showDialog: true,
		} );
	};

	_onCloseLanguageDialog = () => {
		this.setState( {
			showDialog: false,
		} );
	};

	_renderLanguageDialog = () => {
		if ( ! this.state.showDialog ) return null;
		const { formatMessage } = this.context.intl;

		const options = [];
		const locales = I18n.getLanguages();
		// console.log(this.state.locale);

		const languages = Object.keys( locales )
			.map( l => {
				return {
					value: locales[ l ].value,
					name: locales[ l ].name,
					order: locales[ l ].order,
				};
			} )
			.sort( ( a, b ) => a.order - b.order );

		languages.forEach( lang => {
			options.push( {
				id: lang.value,
				value: lang.name,
				name: lang.name,
			} );
		} );

		return (
			<Modal
				isOpen={ true }
				className={ classNames( g_styles.general_confirm_dialog, g_styles.dialog_size_medium ) }
				onRequestClose={ this._onCloseLanguageDialog }
				shouldDisplayCloseButton
				shouldCloseOnOverlayClick
				scrollableContent={ false }
			>
				<MessageBoxFunctionalLayout
					theme="blue"
					title={ formatMessage( {
						id: 'general.change_language_dialog_title',
						defaultMessage: 'Change language',
					} ) }
					confirmText={ formatMessage( {
						id: 'general.submit_btn_txt',
						defaultMessage: 'Submit',
					} ) }
					cancelText="Cancel"
					onOk={ this.changeLanguage }
					onCancel={ this._onCloseLanguageDialog }
				>
					<FormField
						label={ formatMessage( {
							id: 'general.language_select',
							defaultMessage: 'Select display language',
						} ) }
					>
						<Dropdown
							placeholder={ formatMessage( {
								id: 'general.language_select',
								defaultMessage: 'Select display language',
							} ) }
							options={ options }
							onSelect={ this.setLanguage }
							selectedId={ this.state.locale ? this.state.locale.id : null }
						/>
					</FormField>
				</MessageBoxFunctionalLayout>
			</Modal>
		);

		// return (
		// 	<AlertDialog
		// 		className={ classNames( g_styles.general_confirm_dialog, g_styles.dialog_size_medium ) }
		// 		title={ formatMessage( {
		// 			id: 'general.change_language_dialog_title',
		// 			defaultMessage: 'Change language',
		// 		} ) }
		// 		goButtonText={ formatMessage( {
		// 			id: 'general.submit_btn_txt',
		// 			defaultMessage: 'Submit',
		// 		} ) }
		// 		onGo={ this.changeLanguage }
		// 		onClose={ this._onCloseLanguageDialog }
		// 		onEscape={ this._onCloseLanguageDialog }
		// 		shouldCloseOnGo={ false }
		// 		shouldCloseOnEsc={ true }
		// 	>
		// 		<div className={ classNames( g_styles.d_flex, g_styles.v_center, g_styles.mb_20 ) }>
		// 			<span className={ g_styles.mr_10 }>
		// 				<FormattedMessage
		// 					id="general.language_select"
		// 					defaultMessage="Select display language"
		// 				/>
		// 				{ ':' }
		// 			</span>
		// 			<select
		// 				id="displayLanguage"
		// 				ref="language"
		// 				className={ g_styles.select_small }
		// 				value={ this.state.locale }
		// 				onChange={ this.setLanguage }
		// 			>
		// 				{ options }
		// 			</select>
		// 		</div>
		// 	</AlertDialog>
		// );
	};

	render() {
		if ( ! this.props.user ) return null;
		const localeInfo = I18n.getLanguageInfo( this.props.user.locale );
		// console.log('this.props.user.locale', this.props.user);
		return (
			<div
				className={ classNames( g_styles.d_flex, g_styles.v_center, styles.locale_btn_container ) }
			>
				<UnstyledButton
					type="outline"
					size="small"
					onClick={ this._onShowLanguageDialog }
					className={ classNames(
						g_styles.d_flex,
						g_styles.v_center,
						g_styles.blue_on_hover,
						this.props.className
					) }
					style={ this.props.style }
				>
					<LanguageIcon size={ 22 } />
					<span className={ styles.locale_name }>{ localeInfo ? localeInfo.name : '' }</span>
				</UnstyledButton>
				{ this._renderLanguageDialog() }
			</div>
		);
	}
}

export default connect(
	state => {
		return {
			user: getCurrentUser( state ),
		};
	},
	{
		updateLocale,
	}
)( LocaleButton );
