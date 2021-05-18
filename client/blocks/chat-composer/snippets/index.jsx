import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import Modal from 'papo-components/Modal';
import Loader from 'papo-components/Loader';
import { MessageBoxFunctionalLayout } from 'papo-components/MessageBox';

import { dataHooks } from './data-hooks';
import styles from './style.scss';

export default class Snippets extends React.PureComponent {
	static propTypes = {
		isOpen: PropTypes.bool,
		onClose: PropTypes.func.isRequired,
		onConfirm: PropTypes.func.isRequired,
	};

	static defaultProps = {
		isOpen: false,
		onClose: noop,
		onConfirm: noop,
	};

	renderLoader = () => {
		return (
			<div className={ styles.mainLoaderWrapper }>
				<Loader size="medium" dataHook={ dataHooks.mainLoader } />
			</div>
		);
	};

	render() {
		return (
			<Modal
				isOpen={ this.props.isOpen }
				title="sdfsdf"
				onRequestClose={ this.props.onClose }
				shouldDisplayCloseButton
				shouldCloseOnOverlayClick
				scrollableContent={ false }
			>
				<MessageBoxFunctionalLayout
					theme="blue"
					title="Câu trả lời mẫu"
					confirmText="Sử dụng"
					cancelText="Cancel"
					onOk={ this.props.onConfirm }
					onCancel={ this.props.onClose }
					dataHook="alert-actions"
				>
					{ this.renderLoader() }
				</MessageBoxFunctionalLayout>
			</Modal>
		);
	}
}
