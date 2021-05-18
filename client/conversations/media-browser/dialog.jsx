import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import Modal from 'papo-components/Modal';
import Loader from 'papo-components/Loader';
import { MessageBoxFunctionalLayout } from 'papo-components/MessageBox';

import Grid from './grid';
import styles from './style.scss';
import g_styles from 'components/general-styles.scss';
import AutoSizer from 'react-virtualized-auto-sizer';
import Toolbar from './toolbar';

const dataHooks = {
	subtitle: 'modal-selector-subtitle',
	search: 'modal-selector-search',
	modalBody: 'modal-selector-modal-body',
	mainLoader: 'modal-selector-main-loader',
	emptyState: 'modal-selector-empty-state',
	nextPageLoader: 'modal-selector-next-page-loader',
	noResultsFoundState: 'modal-selector-no-results-found-state',
	selector: 'modal-selector-selector',
	list: 'modal-selector-list',
};

export default class MediaBrowserDialog extends React.PureComponent {
	static propTypes = {
		pages: PropTypes.arrayOf( PropTypes.object ).isRequired,
		onClose: PropTypes.func.isRequired,
		onConfirm: PropTypes.func.isRequired,
		isOpen: PropTypes.bool,
	};

	static defaultProps = {
		isOpen: false,
		onClose: noop,
		onConfirm: noop,
	};

	constructor( props ) {
		super( props );

		this.state = {
			scale: 0.157, // 6 items/row
		};
	}

	onSearchClose = () => {
		this.props.onClose();
	};

	renderContent = () => {
		return (
			<div className={ styles.media_browser_container }>
				<Grid
					page={ this.props.page }
					initScale={ this.props.initScale || 1 }
					scale={ this.state.scale }
				/>
			</div>
		);
	};

	renderLoader = () => {
		return (
			<div className={ styles.mainLoaderWrapper }>
				<Loader size="medium" dataHook={ dataHooks.mainLoader } />
			</div>
		);
	};

	_handleMediaScaleChange = value => {
		if ( value === this.state.scale ) {
			return;
		}

		this.setState( {
			scale: value,
		} );
	};

	render() {
		return (
			<Modal
				isOpen={ true }
				title="sdfsdf"
				onRequestClose={ this.props.onClose }
				shouldDisplayCloseButton
				shouldCloseOnOverlayClick
				scrollableContent={ false }
			>
				<MessageBoxFunctionalLayout
					theme="blue"
					title="Thư viện ảnh"
					confirmText="Chọn"
					cancelText="Cancel"
					onOk={ this.props.onConfirm }
					onCancel={ this.props.onClose }
					dataHook="alert-actions"
					fullscreen
					noBodyPadding
					sideActions={
						<Toolbar
							pages={ this.props.pages }
							page={ this.props.page }
							onMediaScaleChange={ this._handleMediaScaleChange }
							onFileUploadComplete={ this.props.onFileUploadComplete }
						/>
					}
				>
					{ this.renderContent() }
				</MessageBoxFunctionalLayout>
			</Modal>
		);
	}

	// render() {
	// 	const r = {
	// 		top: 0,
	// 		left: 0,
	// 		bottom: 0,
	// 		right: 0,
	// 	};
	//
	// 	const t = classNames( 'c-popover', 'c-search_modal', {
	// 		'c-search_modal--autocomplete': true,
	// 	} );
	//
	// 	return React.createElement(
	// 		Popover,
	// 		{
	// 			ariaHideApp: false,
	// 			ariaRole: 'dialog',
	// 			ariaLabel: 'Search',
	// 			isOpen: /*this.props.visible*/ true,
	// 			position: 'top-left',
	// 			targetBounds: r,
	// 			onClose: this.onSearchClose,
	// 			shouldFade: false,
	// 			overlayClassName: t,
	// 			allowanceX: 0,
	// 			allowanceY: 0,
	// 			shouldFocusAfterRender: true,
	// 			shouldReturnFocusAfterClose: false,
	// 			contentStyle: {
	// 				marginTop: 0,
	// 			},
	// 		},
	// 		this.renderContent()
	// 	);
	// }
}
