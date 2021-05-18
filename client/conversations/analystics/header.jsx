import React from 'react';
import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';
import classNames from 'classnames';

import Tooltip from 'papo-components/Tooltip';
import Icon from 'components/icon2';
import CalendarPanel from 'papo-components/CalendarPanel';
import CalendarPanelFooter, { defaultDateToStringOptions } from 'papo-components/CalendarPanelFooter';

import WithDropdown from 'blocks/with-dropdown';

import g_styles from 'components/general-styles.scss';

class AnalyticsHeader extends React.PureComponent {

	static propTypes = {
		startDate: momentPropTypes.momentObj,
		endDate: momentPropTypes.momentObj,
	};

	constructor( props ) {
		super( props );

		this.state = {
			startDate: props.startDate || moment(),
			endDate: props.endDate || moment(),
			selectedDays: {
				from: props.startDate.toDate(),
				to: props.endDate.toDate(),
			}
		}
	}

	componentWillReceiveProps( nextProps ) {
		this.setState({
			startDate: nextProps.startDate,
			endDate: nextProps.endDate,
			selectedDays: {
				from: nextProps.startDate.toDate(),
				to: nextProps.endDate.toDate(),
			}
		} )
	}

	setTooltipRef = r => {
		this.tooltip = r;
	};

	renderExportContent = () => {
		return(
			<div className="ent_csv_popover">
				<div className="ent_csv_popover__body">
					<div className="ent_csv_popover__title">Overview</div>
					<div className="ent_csv_popover__subtitle">Last 30 days</div>
					<a href="/stats/export?type=overview&amp;date_range=30d" data-ent-csv-popover-link="">
						<button className="ent_csv_popover__btn btn ladda-button" data-style="expand-right">Download CSV</button>
					</a>
				</div>
			</div>
		)
	};

	renderExportButton = () => {
		return(
			<div className="hide_on_mobile">
				<div className="ent_date_picker_btn btn_outline btn">
					<div className="ent_analytics__csv_label">Tải dữ liệu</div>
					<i className="ts_icon ts_icon_caret_down no_margin very_small_left_padding"></i>
				</div>
			</div>
		)
	};

	renderTimePeriodButton = () => {
		return(
			<div>
				<div className="ent_date_picker_btn btn_outline btn">
					<i className="ts_icon ts_icon_calendar no_margin small_right_padding"></i>
					<div>30 ngày mới</div>
					<i className="ts_icon ts_icon_caret_down no_margin very_small_left_padding"></i>
				</div>
			</div>
		)
	};

	handleCancel = () => {
		this.tooltip && this.tooltip.hide();
	};

	handleChangeDates = ( value ) => {
		this.setState({
			selectedDays: value
		});
	};

	handleSubmit = () => {
		const { selectedDays } = this.state;
		if ( selectedDays.to ) {
			this.props.onDatesChange && this.props.onDatesChange( moment(selectedDays.from), moment(selectedDays.to) );
		} else {
			this.props.onDatesChange && this.props.onDatesChange( moment(selectedDays.from), moment(selectedDays.from) );
		}

		this.tooltip && this.tooltip.hide();
	};

	renderFooter = ({selectedDays, submitEnabled}) => {
		return (
			<CalendarPanelFooter
				selectedDays={selectedDays}
				submitEnabled={submitEnabled}
				dateToString={ date =>
					date.toLocaleDateString('en-US', defaultDateToStringOptions) }
				primaryActionLabel="OK"
				primaryActionOnClick={ this.handleSubmit }
				secondaryActionLabel="Đóng"
				secondaryActionOnClick={ this.handleCancel }
			/>
		)
	};

	renderTimePeriodContent = () => {
		return(
			<CalendarPanel
				selectedDays={ this.state.selectedDays }
				footer={ this.renderFooter }
				numOfMonths={ 1 }
				onChange={ this.handleChangeDates }
				presets={[
					{
						id: 1,
						selectedDays: {
							from: moment().toDate(),
							to: moment().toDate(),
						},
						value: 'Hôm nay'
					},
					{
						id: 2,
						selectedDays: {
							from: moment().add(-1, 'day').toDate(),
							to: moment().add(-1, 'day').toDate(),
						},
						value: 'Hôm qua'
					},
					{
						id: 3,
						selectedDays: {
							from: moment().add(-7, 'day').toDate(),
							to: moment().toDate()
						},
						value: '7 ngày qua'
					}
				]}
				selectionMode={ "range" }
				showMonthDropdown
				showYearDropdown
				value={ this.state.selectedDays }
			/>
		)
	};

	render() {
		const { serverTime, updatedTime } = this.props;

		return(
			<div className="display_flex align_items_center justify_content_between flex_wrap">
			   <h1 className="flex_none analytics_header">
			      <i className="ts_icon ts_icon_slow_network seafoam_green"></i>Thống kê
			   </h1>
			   <div className="display_flex align_items_center justify_content_between margin_bottom_100">
			      <div className="hide_on_mobile" data-enterprise-analytics-members-updated-at="" data-enterprise-analytics-channels-updated-at="" data-enterprise-analytics-overview-updated-at="">
			         <div className={ classNames( "ent_updated_at", g_styles.d_flex, g_styles.v_center ) }>
						 <span>
							 Cập nhật { updatedTime ? moment( updatedTime ).fromNow() : "" }
						 </span>
						 <span className={ g_styles.pl_5 }>
							 <Tooltip
								 upgrade
								 placement="bottom"
								 content="Dữ liệu báo cáo cho mỗi khoảng thời gian sẽ được cập nhật sau mỗi 5 phút."
							 >
								<Icon size={ 16 } type="channel_info" />
						  	</Tooltip>
						 </span>
			         </div>
			      </div>
				   <WithDropdown
					   contentRenderer={this.renderExportButton}
					   dropdownRenderer={this.renderExportContent}
					   dropdownPosition={"bottom-left"}/>



				   <Tooltip
					   ref={ this.setTooltipRef }
					   content={ this.renderTimePeriodContent() }
					   shouldCloseOnClickOutside
					   showImmediately
					   showArrow={ false }
					   theme="dark"
					   alignment="right"
					   placement="bottom"
					   maxWidth={ 600 }
					   moveBy={ {
						   x: 0,
						   y: 0,
					   } }
					   popover
				   >
					   { this.renderTimePeriodButton() }
				   </Tooltip>
			   </div>
			</div>
		)
	}
}

export default AnalyticsHeader;
