import React from 'react';
import { noop } from 'lodash';

import Dialog from 'components/dialog';
import FullscreenModal from 'components/dialog2/fullscreen-modal';
import Snippets from './snippets';
import AutoMessageTask from './auto-message-task';

class Settings extends React.Component {

	constructor( props ) {
		super( props );

		this.sections = [
			{
				name: 'general',
				header: 'Thiết lập chung',
				description: 'Các thiết lập tổng thể của trang.',
				icon: 'ts_icon_cogs',
			},
			{
				name: 'snipest',
				header: 'Câu trả lời mẫu',
				description: 'Sử dụng các câu trả lời mẫu để trả lời nhanh hơn. Bạn có thể thêm, chỉnh sửa và xóa các câu trả lời mẫu.',
				icon: 'ts_icon_pencil',
			},
			{
				name: 'label',
				header: 'Gắn nhãn hội thoại',
				description: 'Thêm, chỉnh sửa và xóa các nhãn cho hội thoại. Nhãn giúp bạn lọc các hội thoại và quản lý tốt hơn.',
				icon: 'ts_icon_input_file',
			},
			{
				name: 'assign',
				header: 'Chỉ định trả lời',
				description: 'Thiết lập tự động chỉ định trả lời bình luận và tin nhắn cho các thành viên của trang.',
				icon: 'ts_icon_feedback',
			},
			{
				name: 'auto',
				header: 'Chiến dịch tự động trả lời',
				description: 'Tạo và quản lý các chiến dịch nhắn tin tự động tới các nhóm khách hàng khác nhau.',
				icon: 'ts_icon_bolt',
			}
		];

		this.state = {
			showDialog: false,
			selectedSection: null,
		}
	}

	showDialog = () => {
		this.setState( { showDialog: true } );
	}

	handleGoBack = () => {
		this.setState( { selectedSection: null } )
	}

	closeDialog = () => {
		this.setState( { showDialog: false } );
	}

	toggleShowDialog = () => {
		if ( ! this.state.showDialog ) {
			this.showDialog();
		} else {
			this.closeDialog();
		}
	}

	handleClickSection = ( e ) => {
		if ( ! e.currentTarget.dataset || ! e.currentTarget.dataset.id || e.currentTarget.dataset.id.length == 0 ) return;
		
		this.setState( {
			selectedSection: e.currentTarget.dataset.id
		} )
	}

	renderSection = ( section ) => {
		const sectionIconClasses = 'settings-section-icon ts_icon ' + section.icon + ' ' + section.name;
		return(
			<div key={ section.name } onClick={ this.handleClickSection } data-id={ section.name } 
				className="p-channel_options_section" role="presentation">
		         <button className="c-button-unstyled channel_option_item" type="link" data-action="set_purpose">
		         	<div className="icon">
		         		<i className={ sectionIconClasses } type="arrow_up" aria-hidden="true"></i>
		         	</div>
		         	<div className="content">
		         		<h3 className="title">
			            	<span>{ section.header }</span>
			            </h3>
			            <p className="sk_dark_grey no_bottom_margin">
			            	{ section.description }
			            </p>
		         	</div>
		            
		            <div className="channel_option_open"><i className="c-deprecated-icon c-deprecated-icon--inherit c-icon--arrow-large-right" type="arrow_large_right" aria-hidden="true"></i></div>
		         </button>
		    </div>
		)
	}

	renderSections = () => {
		return this.sections.map( this.renderSection );
	}

	renderSectionDetail = () => {
		const { selectedSection } = this.state;
		
		switch( selectedSection ) {
			case 'general':
				return this.renderGeneralSection();
			case 'snipest':
				return this.renderSnipestSection();
			case 'auto':
				return this.renderAutoMessageTaskSection();
			default:
				break;
		}
	}

	renderGeneralSection = () => {
		return(
			<strong>General Section</strong>
		)
	}

	renderSnipestSection = () => {
		const { page } = this.props;
		if ( !page ) return null;

		return <Snippets page={ page }/>
	}

	renderAutoMessageTaskSection = () => {
		const { page } = this.props;
		if ( !page ) return null;

		return <AutoMessageTask pageId={ page.page_id }/>
	}

	// renderGoBack = () => {
	// 	return(
	// 		<button onClick={ this.handleGoBack } className="c-button-unstyled c-fullscreen_modal__back c-fullscreen_modal__back--with_header" type="button" aria-label="back">
	// 			<i className="c-deprecated-icon c-fullscreen_modal__button__icon nudge_bottom_1 c-icon--arrow-large-left" type="arrow_large_left" aria-hidden="true"></i>
	// 			<span className="c-fullscreen_modal__button__label"></span>
	// 		</button>
	// 	)
	// }

	renderHeaderText = ( text, sectionIconClasses = "" ) => {
		return(
			<span className="channel_options_header">
				<i className={ sectionIconClasses } type="arrow_up" aria-hidden="true"></i>
				{ text || 'Thiết lập' }  
			</span>
		)
	}

	renderHeader = () => {
		const { page } = this.props;
		if ( !page ) return null;

		if ( !this.state.selectedSection ) {
			return(
				<span className="channel_options_header">Thiết lập trang   
					<span>
						<i className="c-deprecated-icon c-icon--align-hashmark c-icon--channel c-deprecated-icon--vertical-align-baseline c-deprecated-icon--inherit" type="channel" aria-hidden="true"></i>
						{ page.name }
					</span>
				</span>
			)
		}

		let section;
		this.sections.forEach( s => {
			if ( s.name == this.state.selectedSection ) {
				section = s;
			}
		} );
		const sectionIconClasses = 'settings-section-icon ts_icon ' + section.icon + ' ' + section.name;

		return this.renderHeaderText( section.name, sectionIconClasses );
	}

	settingContent() {
		return(
			<div>
				<div className="c-fullscreen_modal__body c-fullscreen_modal__body--with_header">
				   <div className="c-fullscreen_modal__body__content">
				   		{ !this.state.selectedSection && this.renderSections() }
				   		{ this.state.selectedSection && this.renderSectionDetail() }
				   </div>
				</div>
			</div>
		)
	}

	render() {
		const { page, selectedPageIds } = this.props;

		let header, content;

		if ( !page ) {
			if ( !selectedPageIds ) {
				header = this.renderHeaderText( "Lỗi" );
				content = <strong>Lỗi!</strong>;
			} else {
				header = "Vui lòng chọn trang để thiết lập";
				content = this.renderHeaderText( "Vui lòng chọn page để thiết lập" );
			}
		} else {
			content = this.settingContent();
			header = this.renderHeader();
		}

		let section;
		this.sections.forEach( s => {
			if ( s.name == this.state.selectedSection ) {
				section = s;
			}
		} );

		if ( ! this.state.showDialog ) {
			return null;
		}

		return(
			
			<FullscreenModal 
				portalClassName="page_settings"
				featureAccessibleFsDialogs={ false }
				withBreadcrumbHeader={ true }
				withFooter={ false }
				title={ page ? page.name : '' }
				contentLabel="page-settings"
				isOpen={ this.state.showDialog }
				overlayClassName="xxxxxx"
				withHeader={ true }
				headerImage={ page ? `//graph.facebook.com/${page.page_id}/picture?width=100&height=100` : null }
				showOpenTransition={ true }
				ariaHideApp={false}
				closeModal={ this.closeDialog }
				onEscape={ this.closeDialog }
				shouldCloseOnOverlayClick={true}
				showBackButton={ true }
				stepTitle={ section && section.header }
				onBack={ this.handleGoBack }
				breadcrumbTitles={ [ "sdffsd", "sdfsdf" ] }
				>
				{ content }
			</FullscreenModal>
		)
	}
}

// <Dialog isVisible additionalClassNames="c-fullscreen_modal c-fullscreen_modal--fixed settings" onClose={ this.closeDialog }>
// 		<div className="c-fullscreen_modal__content channel_options_modal c-fullscreen_modal__content--with_header c-fullscreen_modal__content--before-open c-fullscreen_modal__content--after-open">
// 			{ this.state.selectedSection && this.renderGoBack() }
// 			<button onClick={ this.closeDialog } className="c-button-unstyled c-fullscreen_modal__close c-fullscreen_modal__close--with_header" type="button" aria-label="Close">
// 				<i className="c-deprecated-icon c-fullscreen_modal__button__icon nudge_bottom_2 c-icon--times" type="times" aria-hidden="true"></i>
// 				<span className="c-fullscreen_modal__button__label"></span>
// 			</button>
// 			<div className="c-fullscreen_modal__header">
// 				<h2 className="c-fullscreen_modal__title">
// 					{ header }
// 				</h2>
// 			</div>
// 			{ content }
// 		</div>
		
// </Dialog>
export default Settings;
