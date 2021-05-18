import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LaddaButton, { XL, EXPAND_RIGHT } from 'react-ladda';
import { localize, moment } from 'i18n-calypso';

import Alert from 'components/alert';
import FullScreenDialog from 'components/dialog/full-screen-dialog';
import CalendarPopover from 'blocks/calendar-popover';
import FormTextInput from 'components/forms/form-text-input';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormLegend from 'components/forms/form-legend';
import FormTextarea from 'components/forms/form-textarea';
import FormCheckbox from 'components/forms/form-checkbox';
import FoldableCard from 'components/foldable-card';
import SectionHeader from 'components/section-header';

import { createAutoMessageTask, fetchPageAutoMessageTasks } from 'state/pages/actions';
import {
	getPageAutoMessageTasks,
	isCreatingAutoMessageTask,
	isRequestingPageAutoMessageTasks,
} from 'state/pages/selectors';
import GlobalEventEmitter from 'utils/global-event-emitter';
import EventTypes from 'utils/event-types';


class AutoMessageTask extends React.Component {

	static propTypes = {
		pageId: PropTypes.string.isRequired,
	}

	constructor( props ) {
		super( props );

		this.state = {
			showDialog: false,
			submitting: false,
			showFromDate: false,
			showToDate: false,
			autoMessageTask: {
				name: '',
				description: '',
				message: '',
				filter_tags: null,
				filter_has_phone: null,
				filter_not_has_phone: true,
				filter_has_order: null,
				filter_not_has_order: true,
				filer_receptions: null,
				filter_from_date: Date.now(),
				filter_to_date: Date.now(),
			},
			hasLoadedForFirstTime: false,
		}
	}

	componentWillMount() {
		if ( this.props.pageId && ! this.state.hasLoadedForFirstTime ) {
			this.props.fetchPageAutoMessageTasks( this.props.pageId );
		}
	}

	componentDidMount() {
		GlobalEventEmitter.addListener(EventTypes.CLEAR_AUTO_MESSAGE_TASK_CREATE_FORM, this.handleSuccessCreate);
		this.setState( {
			hasLoadedForFirstTime: true
		} );
	}

	componentWillUnmount() {
		// do we need this
		GlobalEventEmitter.removeListener(EventTypes.CLEAR_AUTO_MESSAGE_TASK_CREATE_FORM, this.handleSuccessCreate);
	}

	// componentWillReceiveProps( nextProps ) {
	// 	console.log( nextProps.pageId );
	// 	if ( nextProps.pageId && nextProps.pageId !== this.props.pageId ) {
	// 		this.props.fetchPageAutoMessageTasks( nextProps.pageId );
	// 	}
	// }

	clearForm = () => {
		this.setState( {
		  	autoMessageTask: {
				name: '',
				description: '',
				message: '',
				filter_tags: null,
				filter_has_phone: null,
				filter_not_has_phone: true,
				filter_has_order: null,
				filter_not_has_order: true,
				filer_receptions: null,
				filter_from_date: Date.now(),
				filter_to_date: Date.now(),
			}
		  } )
	}

	handleSuccessCreate = ( forceClear ) => {
		setTimeout(() => {
			this.clearForm();
		}, 100);
	}

	setFromDate = date => {
		this.setState( {
    		autoMessageTask: Object.assign( this.state.autoMessageTask, {
    			filter_from_date: new Date(date).getTime(),
    		} )
    	} )
	};

	setToDate = date => {
		this.setState( {
    		autoMessageTask: Object.assign( this.state.autoMessageTask, {
    			filter_to_date: new Date(date).getTime(),
    		} )
    	} )
	};

	documentKeyHandler = (e) => {
		const ctrlOrMetaKeyPressed = e.ctrlKey || e.metaKey;

		// if ( Utils.isKeyPressed(e, KeyCodes.ENTER) ) {
		// 	this.gotoPages();
		// }

		// if ( Utils.isKeyPressed(e, KeyCodes.UP) ) {
		// 	this.setState( { keyboardActived: true }, () => {
		// 		this.setSelectPrevPage();
		// 	} );
		// }

		// if ( Utils.isKeyPressed(e, KeyCodes.DOWN) || Utils.isKeyPressed(e, KeyCodes.TAB) ) {
		// 	this.setState( { keyboardActived: true }, () => {
		// 		this.setSelectNextPage();
		// 	} );
		// }
    }

    toggleFromDate = () => this.setState( { showFromDate: ! this.state.showFromDate } );

    closeFromDate = () => this.setState( { showFromDate: false } );

    toggleToDate = () => this.setState( { showToDate: ! this.state.showToDate } );

    closeToDate = () => this.setState( { showToDate: false } );

	showDialog = () => {
		this.setState( { showDialog: true }, () => {
			document.addEventListener('keydown', this.documentKeyHandler);
		} );

	}

	closeDialog = () => {
		this.setState( { showDialog: false }, () => {
			document.removeEventListener('keydown', this.documentKeyHandler);
		} );
	}

	toggleShowDialog = () => {
		if ( ! this.state.showDialog ) {
			this.showDialog();
		} else {
			this.closeDialog();
		}
	}

	handleSubmit = () => {
  		const { pageId } = this.props;
  		const task = Object.assign( this.state.autoMessageTask, { page_id: pageId } );
		this.props.createAutoMessageTask( task );
  	}

	handleTaskNameChange = ( e ) => {
		this.setState( {
    		autoMessageTask: Object.assign( this.state.autoMessageTask, {
    			name: e.target.value
    		} )
    	} )
	}

	handleTaskDescriptionChange = ( e ) => {
		this.setState( {
    		autoMessageTask: Object.assign( this.state.autoMessageTask, {
    			description: e.target.value
    		} )
    	} )
	}

	handleTaskMessageChange = ( e ) => {
		this.setState( {
    		autoMessageTask: Object.assign( this.state.autoMessageTask, {
    			message: e.target.value
    		} )
    	} )
	}

	handleFilterHasPhoneChange = () => {
		this.setState( {
    		autoMessageTask: Object.assign( this.state.autoMessageTask, {
    			filter_has_phone: !this.state.autoMessageTask.filter_has_phone,
    		} )
    	} )
	}

	handleFilterNotHasPhoneChange = () => {
		this.setState( {
    		autoMessageTask: Object.assign( this.state.autoMessageTask, {
    			filter_not_has_phone: !this.state.autoMessageTask.filter_not_has_phone,
    		} )
    	} )
	}

	handleFilterNotHasOrderChange = () => {
		this.setState( {
    		autoMessageTask: Object.assign( this.state.autoMessageTask, {
    			filter_not_has_order: !this.state.autoMessageTask.filter_not_has_order,
    		} )
    	} )
	}

	handleFilterHasOrderChange = () => {
		this.setState( {
    		autoMessageTask: Object.assign( this.state.autoMessageTask, {
    			filter_has_order: !this.state.autoMessageTask.filter_has_order,
    		} )
    	} )
	}

	renderCreateTask = () => {
		return(
			<FullScreenDialog headerText="Tạo mới chiến dịch nhắn tin tự động" onClose={ this.closeDialog }>
				<div className="contents_container">
					<div className="contents">
						<div className="input__row">
							<FormFieldset>
								<FormLabel htmlFor="task_name">Tên chiến dịch</FormLabel>
								<FormTextInput
									autoCapitalize="off"
									autoComplete="off"
									autoCorrect="off"
									id="task_name"
									name="task_name"
									placeholder="Nhập tên chiến dịch..."
									value={ this.state.autoMessageTask.name }
									onChange={ this.handleTaskNameChange }
								/>
								<p className="form-setting-explanation">
									Đặt tên cho chiến dịch giúp bạn dễ dàng tìm kiếm chiến dịch hơn.
								</p>
								{ /* <FormInputValidation text="Your text can be saved." />*/ }
							</FormFieldset>
						</div>
						<div className="input__row">
							<FormFieldset>
								<FormLabel htmlFor="task_desc">Mô tả chiến dịch</FormLabel>
								<FormTextInput
									autoCapitalize="off"
									autoComplete="off"
									autoCorrect="off"
									id="task_desc"
									name="task_desc"
									placeholder="Mô tả ngắn gọn về chiến dịch..."
									value={ this.state.autoMessageTask.description }
									onChange={ this.handleTaskDescriptionChange }
								/>
							</FormFieldset>
						</div>
						<div className="input__row">
							<FormFieldset>
								<FormLabel htmlFor="task_message_field">Nội dung gửi đi</FormLabel>
								<FormTextarea name="task_message_field"
									id="task_message_field" placeholder="Tin nhắn gửi đi..."
									value={ this.state.autoMessageTask.message }
									onChange={ this.handleTaskMessageChange } />
							</FormFieldset>
						</div>

						<div className="input_row">
							<FormFieldset>
								<FormFieldset>
									<FormLegend>Tùy chọn lọc</FormLegend>
									<FormLabel>
										<FormCheckbox
											checked={ this.state.autoMessageTask.filter_has_phone }
											onChange={ this.handleFilterHasPhoneChange } id="has_phone" name="has_phone" />
										<span>Hội thoại chứa số điện thoại.</span>
									</FormLabel>
									<FormLabel>
										<FormCheckbox
											checked={ this.state.autoMessageTask.filter_not_has_phone }
											onChange={ this.handleFilterNotHasPhoneChange } id="not_has_phone" name="not_has_phone" />
										<span>Hội thoại không chứa số điện thoại.</span>
									</FormLabel>
									<FormLabel>
										<FormCheckbox
											checked={ this.state.autoMessageTask.filter_not_has_order }
											onChange={ this.handleFilterNotHasOrderChange } id="not_has_order" name="not_has_order" />
										<span>Hội thoại chưa có đơn hàng.</span>
									</FormLabel>
									<FormLabel>
										<FormCheckbox
											checked={ this.state.autoMessageTask.filter_has_order }
											onChange={ this.handleFilterHasOrderChange } id="has_order" name="has_order" />
										<span>Hội thoại đã có đơn hàng.</span>
									</FormLabel>
								</FormFieldset>
							</FormFieldset>
						</div>
						<div className="input__row d__flex">
							<div className="from__date">
					            <button ref="frombutton"
					            	onClick={ this.toggleFromDate }
					            	className="btn btn_outline dialog_cancel ">
					            	<span className="ts_icon ts_icon_calendar" aria-hidden="true"></span>
					            	Từ: { moment( new Date(this.state.autoMessageTask.filter_from_date) ).format( 'hh:mm A DD/MM/YYYY' ) }
					            </button>

					            <CalendarPopover
					                context={ this.refs && this.refs.frombutton }
					                isVisible={ this.state.showFromDate }
					                onClose={ this.closeFromDate }
					                onDateChange={ this.setFromDate }
					                selectedDay={ new Date(this.state.autoMessageTask.filter_from_date) }
					            />
					        </div>
					        <div className="to__date">
					            <button ref="tobutton"
					            	onClick={ this.toggleToDate }
					            	className="btn btn_outline dialog_cancel ">
					            	<span className="ts_icon ts_icon_calendar" aria-hidden="true"></span>
					            	Đến: { moment( new Date(this.state.autoMessageTask.filter_to_date) ).format( 'hh:mm A DD/MM/YYYY' ) }
					            </button>

					            <CalendarPopover
					                context={ this.refs && this.refs.tobutton }
					                isVisible={ this.state.showToDate }
					                onClose={ this.closeToDate }
					                onDateChange={ this.setToDate }
									selectedDay={ new Date(this.state.autoMessageTask.filter_to_date) }
					            />
					        </div>
						</div>
					</div>

					{ /* <div><pre>{JSON.stringify(this.state.autoMessageTask, null, 2) }</pre></div> */ }

				</div>


				<div id="fs_modal_footer">
				   <div id="fs_modal_footer_content" className="hidden"></div>
				   <button onClick={ this.clearForm } className="btn btn_outline dialog_cancel ">Hủy</button>

				   <LaddaButton
			        loading={ this.props.isCreatingAutoMessageTask }
			        onClick={ this.handleSubmit }
			        className="btn left_margin dialog_go edit_member_profile_confirm_edit_btn"
			        data-style={ EXPAND_RIGHT }
			        data-spinner-size={ 30 }
			      >
			        Tạo chiến dịch
			      </LaddaButton>
				</div>
			</FullScreenDialog>
		)
	}

	renderLoadingScreen = () => {
		return <strong>Loading...</strong>
	}

	renderNoResult() {
		return(
			<Alert message='Chưa có chiến dịch nào được tạo. Click vào "Tạo chiến dịch" để bắt đầu khởi tạo.' type="info" />
		)
	}

	renderTaskItem = ( task ) => {
		return(
			<li key={ task.create_at }>
				<FoldableCard
					className={ 'classNames' }
					header={ task.name }
					clickableHeader
					compact
					summary={ null }
					expandedSummary={ null }
				>
					{ task.message }
				</FoldableCard>
			</li>
		)
	}

	renderTasksGroup = ( tasks ) => {
		return(
			<div className="sharing-services-group">
				<SectionHeader label={ 'Các chiến dịch đã tạo' } />
				<ul className="sharing-services-group__services">
					{ tasks.map( this.renderTaskItem ) }
				</ul>
			</div>
		)
	}

	render() {
		const { isRequestingPageAutoMessageTasks, pageAutoMessageTasks } = this.props;
		if ( isRequestingPageAutoMessageTasks ) {
			return this.renderLoadingScreen();
		}

		return(
			<div>
				<div className="c-fullscreen_modal__buttons c-fullscreen_modal__buttons--align_right">
					<button onClick={ this.showDialog } className="c-button c-button--primary c-button--medium c-fullscreen_modal__go null--primary null--medium" type="button" data-qa="create_action">
						<span>Tạo chiến dịch</span>
					</button>
				</div>
				<hr />
				{ !pageAutoMessageTasks && this.renderNoResult() }
				{ pageAutoMessageTasks && pageAutoMessageTasks.length > 0 && this.renderTasksGroup( pageAutoMessageTasks ) }
				{ this.state.showDialog && this.renderCreateTask() }
			</div>
		)
	}
}

export default connect(
	( state, ownerProps ) => {
		return {
			isCreatingAutoMessageTask: isCreatingAutoMessageTask( state ),
			isRequestingPageAutoMessageTasks: isRequestingPageAutoMessageTasks( state ),
			pageAutoMessageTasks: ownerProps.pageId ? getPageAutoMessageTasks( state, ownerProps.pageId ) : null,
		}
	},
	{
		createAutoMessageTask,
		fetchPageAutoMessageTasks,
	 }
)( AutoMessageTask );
