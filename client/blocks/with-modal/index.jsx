import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from 'papo-components/Button';
import Add from 'papo-components/new-icons/Add';
import Modal from 'papo-components/Modal';
import { MessageBoxFunctionalLayout } from 'papo-components/MessageBox';
import g_styles from 'components/general-styles.scss';

class WithModal extends React.PureComponent {
	static propTypes = {
		title: PropTypes.string,
		text: PropTypes.string.isRequired,
		dialogContentRenderer: PropTypes.func.isRequired,
		isBusy: PropTypes.bool,
	};

	constructor( props ) {
		super( props );

		this.state = {
			isOpen: false,
		};
	}

	toggleOpen = () => {
		this.setState( {
			isOpen: ! this.state.isOpen,
		} );
	};

	onGo = () => {
		if ( this.props.onGo ) {
			this.props.onGo();
		}
	};

	render() {
		return (
			<div>
				<Button
					onClick={ this.toggleOpen }
					size="small"
					priority="secondary"
					skin={ this.props.buttonTheme }
					prefixIcon={ <Add /> }
					children={ this.props.text }
				/>
				{ this.state.isOpen && (
					<Modal
						zIndex={ 2000 }
						isOpen={ true }
						className={ classNames( g_styles.general_confirm_dialog, g_styles.dialog_size_medium ) }
						title={ this.props.title || 'Untitled' }
						onRequestClose={ () => {
							this.setState( { isOpen: false } );
						} }
						shouldDisplayCloseButton
						shouldCloseOnOverlayClick
						scrollableContent={ true }
					>
						<MessageBoxFunctionalLayout
							theme="blue"
							title={ this.props.title || 'Untitled' }
							confirmText={ this.props.goButtonText || 'OK' }
							cancelText="Cancel"
							onOk={ this.onGo }
							disableConfirmation={ this.props.disableConfirmation }
							onCancel={ () => {
								this.setState( { isOpen: false } );
							} }
						>
							{ this.props.dialogContentRenderer() }
						</MessageBoxFunctionalLayout>
					</Modal>
				) }
			</div>
		);
	}
}

export default WithModal;
