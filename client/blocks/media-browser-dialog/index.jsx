// import React from 'react';
// import PropTypes from 'prop-types';
// // import classNames from 'classnames';
//
// // import Dialog from 'components/dialog';
// import MediaBrowser from 'blocks/media-browser';
// import Button from 'components/button';
// import MediaLibrarySelectedStore from 'lib/media/library-selected-store';
// import BaseDialog from 'components/dialog2/base-dialog';
//
// class MediaBrowserDialog extends React.Component {
//
// 	static propTypes = {
// 		headerText: PropTypes.string,
// 	};
//
// 	static defaultProps = {
// 		headerText: '',
// 	};
//
// 	handleClose = ( e ) => {
// 		// clear all media selected
// 		MediaLibrarySelectedStore.clearSelected();
// 		e.preventDefault();
// 		if ( this.props.onClose ) {
// 			this.props.onClose( e );
// 		}
// 	}
//
// 	onSetSelected = ( e ) => {
// 		// e.preventDefault();
//
// 		const { page } = this.props;
// 		if ( !page ) return;
//
// 		const selectedImages = MediaLibrarySelectedStore.getAll( page.page_id );
//
// 		if ( this.props.onSetSelected ) {
// 			this.props.onSetSelected( selectedImages );
// 		}
// 		if ( this.props.onClose ) {
// 			this.props.onClose( e );
// 		}
// 	}
//
// 	render() {
// 		const { page } = this.props;
// 		if ( !page ) return null;
//
// 		return(
// 			<BaseDialog
// 				className="media_browser"
// 				title="Thêm nhãn"
// 				cancelText="Đóng"
// 				goButtonText="OK"
// 				onGo={ this.onSetSelected }
// 				onClose={ this.handleClose }
// 				onEscape={ this.handleClose }
// 				shouldCloseOnGo={true}
// 				showHeader={false}
// 			>
// 				<MediaBrowser page={ page }/>
// 			</BaseDialog>
//
//
// 		)
// 	}
// }
//
//
//
// export default MediaBrowserDialog;
//
// 				{/*<Dialog id="fs_modal" shouldCloseOnEsc={ true } isVisible additionalClassNames="fs_modal_header fs_modal_footer media_browser_dialog"*/}
// 						{/*onClose={ this.handleClose }>*/}
// 					{/*<button onClick={ this.handleClose } type="button" id="fs_modal_close_btn" className="fs_modal_btn btn_unstyle">*/}
// 						{/*<i className="ts_icon ts_icon_times"></i>*/}
// 						{/*<span className="key_label">esc</span>*/}
// 					{/*</button>*/}
// 					{/*<div id="fs_modal_header"><h3>{ this.props.headerText }</h3></div>*/}
//
// 					{/*<MediaBrowser page={ page }/>*/}
// 					{/*<div className="p-jumper__help" aria-hidden="true">*/}
// 						{/*<span  style={{flex: 'auto'}}></span>*/}
// 						{/*<Button style={{flex: 'none'}} primary onClick={ this.onSetSelected } className="c-button c-button--primary c-button--medium c-fullscreen_modal__go null--primary null--medium">Đồng ý</Button>*/}
// 					{/*</div>*/}
// 				{/*</Dialog>*/}

import React from 'react';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import { bindAll } from 'lodash';

import Popover from 'components/popover2';
import SearchInput from './search';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';
import MediaBrowser from 'blocks/media-browser';
import MediaLibrarySelectedStore from 'lib/media/library-selected-store';
import Button from 'components/button2';
import DateRangeFilter from 'components/date-range-filter';

class MediaBrowserDialog extends React.PureComponent {
	constructor( props ) {
		super( props );

		bindAll( this, [ 'onSearchClose' ] );

		this.state = {
			appBannerHeightPx: 0,
		};
	}

	onSearchClose() {
		MediaLibrarySelectedStore.clearSelected();
		this.props.onClose();
	}

	onSetSelected = e => {
		// e.preventDefault();

		const { page } = this.props;
		if ( ! page ) return;

		const selectedImages = MediaLibrarySelectedStore.getAll( page.page_id );

		if ( this.props.onSetSelected ) {
			this.props.onSetSelected( selectedImages );
		}
		if ( this.props.onClose ) {
			this.props.onClose( e );
		}
	};

	renderContent() {
		const { page } = this.props;
		return (
			<div className="c-search__container">
				<div className="c-search" data-qa="search_view">
					<div role="tablist" className="c-search__tabs c-tabs__tab_menu">
						<button
							className="c-search__tab c-tabs__tab c-tabs__tab--active"
							aria-selected="true"
							role="tab"
							data-qa="search_tab"
							data-qa-tab="messages"
						>
							Hội thoại
						</button>
						<button
							className="c-search__tab c-tabs__tab"
							aria-selected="false"
							role="tab"
							data-qa="search_tab"
							data-qa-tab="files"
						>
							Đơn hàng
						</button>
					</div>
					<div className="c-search__view" id="c-search__tab__messages" role="tabpanel">
						<div className="c-search__section c-search__main">
							<MediaBrowser page={ page } />
						</div>
						<div className="c-search__extras">
							<DateRangeFilter
								onStartDateChange={ this.onStartDateChange }
								onEndDateChange={ this.onEndDateChange }
								startDate={ this.state.startDate }
								endDate={ this.state.endDate }
							/>
						</div>
					</div>
				</div>
				<div className="footer">
					<Button className={ 'c-dialog__go' } onClick={ this.onSetSelected }>
						OK
					</Button>
				</div>
			</div>
		);
	}

	render() {
		var r = {
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
		};

		const t = classNames( 'c-popover', 'c-search_modal', {
			'c-search_modal--autocomplete': true,
		} );

		return React.createElement(
			Popover,
			{
				ariaHideApp: false,
				ariaRole: 'dialog',
				ariaLabel: 'Search',
				isOpen: /*this.props.visible*/ true,
				position: 'top-left',
				targetBounds: r,
				onClose: this.onSearchClose,
				shouldFade: false,
				overlayClassName: t,
				allowanceX: 0,
				allowanceY: 0,
				shouldFocusAfterRender: true,
				shouldReturnFocusAfterClose: false,
				contentStyle: {
					marginTop: this.state.appBannerHeightPx,
				},
			},
			React.createElement(
				'div',
				{
					className: 'c-search__input_and_close',
				},
				React.createElement( SearchInput, {
					autoFocus: true,
					onEnter: this.onSearchAutocompleteSuggestionAccept,
					onEscape: this.onSearchInputBoxEscape,
					onFocus: this.onSearchInputBoxFocus,
				} ),
				React.createElement(
					UnstyledButton,
					{
						className: 'c-search__input_and_close__close',
						onClick: this.props.onClose,
						ariaLabel: 'Cancel',
						'data-qa': 'search_input_close',
					},
					React.createElement( Icon, {
						type: 'times',
					} )
				)
			),
			this.renderContent()
		);
	}
}

export default MediaBrowserDialog;
