import React from 'react';
import classNames from 'classnames';
import { FormattedMessage, intlShape } from 'react-intl';
import Modal from 'papo-components/Modal';
import { MessageBoxFunctionalLayout } from 'papo-components/MessageBox';

import Button from 'papo-components/Button';
import Icon from 'components/icon2';
import * as GlobalActions from 'actions/global-actions';
import g_styles from 'components/general-styles.scss';

export default class LogoutButton extends React.PureComponent {
	static contextTypes = {
		intl: intlShape,
	};

	constructor( props ) {
		super( props );

		this.state = {
			showConfirmDialog: false,
		};
	}

	_showConfirmDialog = () => {
		this.setState( {
			showConfirmDialog: true,
		} );
	};

	_hideConfirmDialog = () => {
		this.setState( {
			showConfirmDialog: false,
		} );
	};

	_renderConfirmDialog = () => {
		if ( ! this.state.showConfirmDialog ) return null;
		const { formatMessage } = this.context.intl;
		return (
			<Modal
				isOpen={ true }
				className={ classNames( g_styles.general_confirm_dialog, g_styles.dialog_size_medium ) }
				onRequestClose={ this._hideConfirmDialog }
				shouldDisplayCloseButton
				shouldCloseOnOverlayClick
				scrollableContent={ false }
			>
				<MessageBoxFunctionalLayout
					theme="blue"
					title={ formatMessage( {
						id: 'general.confirm',
						defaultMessage: 'Confirm',
					} ) }
					confirmText={ formatMessage( {
						id: 'general.logout_btn_txt',
						defaultMessage: 'Logout of Papo',
					} ) }
					cancelText="Cancel"
					onOk={ this._logout }
					onCancel={ this._hideConfirmDialog }
				>
					<FormattedMessage
						id="general.logout_confirm_txt"
						defaultMessage="Do you want to logout of Papo?"
					/>
				</MessageBoxFunctionalLayout>
			</Modal>
		);
	};

	_logout = () => {
		GlobalActions.emitUserLoggedOutEvent();
	};

	render() {
		return (
			<div>
				<Button
					type="outline"
					size="small"
					onClick={ this._showConfirmDialog }
					prefixIcon={ <Icon type="sign_out" className={ this.props.iconClassName } /> }
					className={ classNames( g_styles.d_flex, g_styles.v_center, this.props.className ) }
					style={ this.props.style }
				>
					<FormattedMessage id="general.logout_btn_txt" defaultMessage="Exit" />
				</Button>
				{ this._renderConfirmDialog() }
			</div>
		);
	}
}
