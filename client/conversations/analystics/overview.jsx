import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import Chart from 'components/c3';
import Tooltip from 'components/tooltip2';
import {
	timeseriesDaysConfigs,
	timeseriesDetailConfigs,
} from './configs';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

const configs = {
	columns: {
		names: {
			data1: 'Hội thoại mới',
			data2: 'Số điện thoại',
		},
	},
	graph_colors: {
		data1: '#2AB27B',
		data2: '#2D9EE0',
	},
	hide_graph_data: false,
	legend_selector: 'data-ent-graph-legend-overview',
	chart_container: 'data-enterprise-analytics-infographic-graph-overview',

	columns2: {
		names: {
			data3: 'Hội thoại mới',
			data4: 'Chưa trả lời',
		},
	},
	graph_colors2: {
		data3: '#7f5ac8',
		data4: '#F04C58',
	},
};

class Overview extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object,
	};

	constructor( props ) {
		super( props );

		this.state = {
			selectedTab: "days"
		}
	}

	renderMember = m => {
		const rootClasses = classNames(
			styles.ent_callout__icon_wrapper,
			styles.ts_tip,
			styles.ts_tip_float,
			styles.ts_tip_top,
			styles.sk_dark_gray,
			styles.ts_tip_multiline,
			styles.ts_tip_hidden
		);
		return (
			<Tooltip tip={ m.name } position="top">
				<div className={ rootClasses } data-ent-meter-icon-1="">
					<div
						className={ classNames(
							styles.ent_callout__icon,
							styles.ent_callout__icon_border,
							styles.ent_callout__icon__20
						) }
					/>
					<img
						className={ classNames(
							styles.ent_callout__icon,
							styles.ent_callout__icon_image,
							styles.ent_callout__icon__20,
							styles.ent_callout__icon__filled
						) }
						alt={ m.name }
						src={ `//graph.facebook.com/${ m.id }/picture?height=50&width=50` }
					/>
					<span className={ styles.ts_tip_tip }>
						<span className={ styles.ts_tip_multiline_inner }>{ m.name }</span>
					</span>
				</div>
			</Tooltip>
		);
	};

	renderFakeMembers() {
		const m = [
			{
				name: 'Đình Hùng',
				id: '917571811708116',
			},
			{
				name: 'Lường Vương Chiều',
				id: '280341629031862',
			},
			{
				name: 'Đưc Biên Phong',
				id: '701003106763133',
			},
			{
				name: 'Bạch Henrik',
				id: '126796871444176',
			},
			{
				name: 'Văn Khánh',
				id: '1773868662717179',
			},
			{
				name: 'Đông Nguyễn',
				id: '2209103169377790',
			},
			{
				name: 'Tuấn Phạm Khắc',
				id: '734386646923789',
			},
			{
				name: 'Trương Tiền',
				id: '2301530526790501',
			},
			{
				name: 'Truong Nhu Truong',
				id: '324354928403919',
			},
		];

		return m.map( this.renderMember );
	}

	handleTabClick = e => {
		this.setState( {
			selectedTab: e.currentTarget.dataset.graphTab,
		} );
	};

	render() {
		const {
			startDate,
			endDate,
			analyticsData
		} = this.props;

		const columns = [];

		const dates = [];
		dates.push( 'x' );
		const data1 = [],
			data2 = [];
		data1.push( 'data1' );
		data2.push( 'data2' );

		if ( analyticsData && analyticsData.data && analyticsData.data.detail && analyticsData.data.detail.conversations ) {
			analyticsData.data.detail.conversations.map( x => {
				dates.push( x.time );
				data1.push( x.total );
				data2.push( x.un_seen_count );
			} );
		}

		columns.push( dates, data1, data2 );

		const data = {
			x: 'x',
			xFormat: '%Y-%m-%d %H:%M:%S',
			columns: columns,
			names: configs.columns.names,
			colors: configs.graph_colors,
		};

		// by days chart
		const byDayChartColumns = [];
		const byDayChartDates = [];
		byDayChartDates.push( 'x' );
		const byDayChartData1 = [],
			byDayChartData2 = [];
		byDayChartData1.push( 'data3' );
		byDayChartData2.push( 'data4' );

		if ( analyticsData && analyticsData.data && analyticsData.data.detail && analyticsData.data.detail.new_conversations_by_days ) {
			analyticsData.data.detail.new_conversations_by_days.map( x => {
				byDayChartDates.push( x.time );
				byDayChartData1.push( x.value );
				byDayChartData2.push( x.un_replied );
			} );
		}

		byDayChartColumns.push( byDayChartDates, byDayChartData1, byDayChartData2 );

		const byDayChartData = {
			x: 'x',
			xFormat: '%Y-%m-%d %H:%M:%S',
			columns: byDayChartColumns,
			names: configs.columns2.names,
			colors: configs.graph_colors2,
		};

		let newConversations, totalConversations, unRepliedConversations, unSeenConversations;
		if ( analyticsData && analyticsData.conversations ) {
			newConversations = analyticsData.conversations.new_conversations;
			totalConversations = analyticsData.conversations.total;
			unRepliedConversations = analyticsData.conversations.un_replied;
		}

		let totalMessages, pageMessages, customerMessages, typeComment, typeMessage;
		if ( analyticsData && analyticsData.messages ) {
			totalMessages = analyticsData.messages.total;
			pageMessages = analyticsData.messages.from_page;
			customerMessages = analyticsData.messages.from_user;
			typeComment = analyticsData.messages.type_comment;
			typeMessage = analyticsData.messages.type_message;
		}

		let dateHeader;
		if ( startDate.diff( endDate ) === 0 ) {
			dateHeader = moment().diff( startDate ) === 0 ? "Hôm nay" : startDate.format('DD/MM/YYYY');
		} else {
			dateHeader = "Thời gian: " + startDate.format('DD/MM/YYYY') + " đến: " + endDate.format('DD/MM/YYYY');
		}

		return (
			<div className={ g_styles.p_relative }>
				<div data-enterprise-analytics-org-overview-callouts="">
					<div data-enterprise-analytics-usage-callout-header="">
						<div className="ent_graph_header--no_margin">
							<i className="ts_icon ts_icon_calendar pin_orange inline_block" />
							<div className="ent_graph_header--primary inline_block">{ dateHeader }</div>
						</div>
					</div>
					<div
						className="ent_callout__callout_group"
						data-enterprise-analytics-usage-callout-group-container=""
					>
						<div
							className="ent_callout__callout ent_callout__callout--file_storage"
							data-enterprise-analytics-usage-callouts-file_storage=""
						>
							<div className="ent_usage_callout__callout_item" data-ent-analytics-usage-callout="">
								<div className="ent_callout__header">
									<h4 className="ent_callout__title">Hội thoại mới</h4>
								</div>
								<div data-ent-analytics-usage-callout-number-file_storage="">
									<div>
										<div className="ent_callout__big_number inline_block">
											{ newConversations.toLocaleString() || 0 }
										</div>
										{
											/*<div className="ent_callout__big_number--secondary inline_block">
											<span
												className="ts_icon ts_icon_user_groups flip_horizontal"
												aria-hidden="true"
											/>
										</div>*/
										}
									</div>
								</div>
								<div data-ent-analytics-usage-callout-limit-file_storage="">
									<div className="ent_callout__limit">trong tổng số <strong>{ totalConversations.toLocaleString() || 0 }</strong> hội thoại có tương tác</div>
								</div>
								<div
									className="ent_callout__meter ent_callout__meter_bar"
									data-ent-analytics-usage-callout-bar-meter-file_storage=""
								>
									<div
										className="ent_callout__meter_bar_container"
										data-ent-meter-bar-container-file_storage=""
									>
										<div
											className="ent_callout__meter_bar_fill ent_callout__meter_bar_fill--filled"
											style={ { width: totalConversations > 0 ? (1 - newConversations/totalConversations) * 100 + '%' : '0%' } }
										/>
										<i data-ent-meter-bar-gleam="" />
										<div className="ent_callout__meter_bar_border" />
									</div>
								</div>
								<div data-ent-analytics-usage-callout-insight-file_storage="">
									<div className="ent_callout__insight ent_callout__insight--margin_top">
										{ /*<span className="ent_callout__difference ent_callout__difference--increase">160.4 MB</span>*/ }{' '}
										<strong>{ unRepliedConversations.toLocaleString() || 0 }</strong> hội thoại chưa trả lời.
									</div>
								</div>
							</div>
						</div>
						<div
							className="ent_callout__callout ent_callout__callout--messages_sent"
							data-enterprise-analytics-usage-callouts-messages_sent=""
						>
							<div className="ent_usage_callout__callout_item" data-ent-analytics-usage-callout="">
								<div className="ent_callout__header">
									<h4 className="ent_callout__title">Tin nhắn & Bình luận</h4>
								</div>
								<div data-ent-analytics-usage-callout-number-messages_sent="">
									<div>
										<div className="ent_callout__big_number inline_block">
											{ totalMessages.toLocaleString() || 0 }
										</div>
										<div className="ent_callout__big_number--secondary inline_block">
											<span className={ g_styles.pl_10 }>
												<span
													className="ts_icon ts_icon_comment_alt flip_horizontal"
													aria-hidden="true"
												/>
												<span>
													{ typeComment.toLocaleString() || 0 }
												</span>
											</span>
											<span className={ g_styles.pl_10 }>
												<span
													className="ts_icon ts_icon_facebook_messenger flip_horizontal"
													aria-hidden="true"
												/>
												<span>
													{ typeMessage.toLocaleString() || 0 }
												</span>
											</span>
										</div>
									</div>
								</div>
								<div data-ent-analytics-usage-callout-limit-messages_sent="">
									<div className="ent_callout__limit">
										<span>
											{ pageMessages.toLocaleString() || 0 } <span> Tin nhắn từ trang. </span>
										</span>
										<span>
											{ customerMessages.toLocaleString() || 0 } <span> Tin nhắn từ khách hàng. </span>
										</span>
									</div>
								</div>
								<div
									className="ent_callout__meter ent_callout__meter_bar"
									data-ent-analytics-usage-callout-bar-meter-messages_sent=""
								>
									<div
										className="ent_callout__meter_bar_container"
										data-ent-meter-bar-container-messages_sent=""
									>
										<div
											className="ent_callout__meter_bar_fill ent_callout__meter_bar_fill--limit_reached"
											style={ { width: totalMessages > 0 ? (customerMessages/totalMessages) * 100 + '%' : '0%' } }
										/>
										<i data-ent-meter-bar-gleam="" className="ent_callout__meter_bar_gleam" />
										<div className="ent_callout__meter_bar_border" />
									</div>
								</div>

								<div data-ent-analytics-usage-callout-insight-messages_sent="">
									<div className="ent_callout__insight ent_callout__insight--margin_top">
										<span>35% khách hàng để lại số điện thoại</span>
									</div>
								</div>
							</div>
						</div>
						<div
							className="ent_callout__callout ent_callout__callout--messages_sent"
							data-enterprise-analytics-usage-callouts-messages_sent=""
						>
							<div className="ent_usage_callout__callout_item" data-ent-analytics-usage-callout="">
								<div className="ent_callout__header">
									<h4 className="ent_callout__title">Số điện thoại mới</h4>
								</div>
								<div data-ent-analytics-usage-callout-number-messages_sent="">
									<div>
										<div className="ent_callout__big_number inline_block">0</div>
										<div className="ent_callout__big_number--secondary inline_block">
											<svg
												className="has__phone_icon"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 50 50"
												width="16px"
												height="16px"
											>
												<path d="M25,2C12.318,2,2,12.318,2,25c0,3.96,1.023,7.854,2.963,11.29L2.037,46.73c-0.096,0.343-0.003,0.711,0.245,0.966 C2.473,47.893,2.733,48,3,48c0.08,0,0.161-0.01,0.24-0.029l10.896-2.699C17.463,47.058,21.21,48,25,48c12.682,0,23-10.318,23-23 S37.682,2,25,2z M36.57,33.116c-0.492,1.362-2.852,2.605-3.986,2.772c-1.018,0.149-2.306,0.213-3.72-0.231 c-0.857-0.27-1.957-0.628-3.366-1.229c-5.923-2.526-9.791-8.415-10.087-8.804C15.116,25.235,13,22.463,13,19.594 s1.525-4.28,2.067-4.864c0.542-0.584,1.181-0.73,1.575-0.73s0.787,0.005,1.132,0.021c0.363,0.018,0.85-0.137,1.329,1.001 c0.492,1.168,1.673,4.037,1.819,4.33c0.148,0.292,0.246,0.633,0.05,1.022c-0.196,0.389-0.294,0.632-0.59,0.973 s-0.62,0.76-0.886,1.022c-0.296,0.291-0.603,0.606-0.259,1.19c0.344,0.584,1.529,2.493,3.285,4.039 c2.255,1.986,4.158,2.602,4.748,2.894c0.59,0.292,0.935,0.243,1.279-0.146c0.344-0.39,1.476-1.703,1.869-2.286 s0.787-0.487,1.329-0.292c0.542,0.194,3.445,1.604,4.035,1.896c0.59,0.292,0.984,0.438,1.132,0.681 C37.062,30.587,37.062,31.755,36.57,33.116z" />
											</svg>
										</div>
									</div>
								</div>
								<div data-ent-analytics-usage-callout-limit-messages_sent="">
									<div className="ent_callout__limit">trong tổng số 0 số đt</div>
								</div>
								<div
									className="ent_callout__meter ent_callout__meter_bar"
									data-ent-analytics-usage-callout-bar-meter-messages_sent=""
								>
									<div
										className="ent_callout__meter_bar_container"
										data-ent-meter-bar-container-messages_sent=""
									>
										<div
											className="ent_callout__meter_bar_fill ent_callout__meter_bar_fill--limit_reached"
											style={ { width: '30%' } }
										/>
										<i data-ent-meter-bar-gleam="" className="ent_callout__meter_bar_gleam" />
										<div className="ent_callout__meter_bar_border" />
									</div>
								</div>

								<div data-ent-analytics-usage-callout-insight-messages_sent="">
									<div className="ent_callout__insight ent_callout__insight--margin_top">
										<span>35% khách hàng để lại số điện thoại</span>
									</div>
								</div>
							</div>
						</div>
						{
							/*<div
							className="ent_callout__callout ent_callout__callout--apps_installed"
							data-enterprise-analytics-usage-callouts-apps_installed=""
						>
							<div className="ent_usage_callout__callout_item" data-ent-analytics-usage-callout="">
								<div className="ent_callout__header">
									<h4 className="ent_callout__title">Tham gia trả lời</h4>
								</div>
								<div data-ent-analytics-usage-callout-number-apps_installed="">
									<div>
										<div className="ent_callout__big_number inline_block">9</div>
										<div className="ent_callout__big_number--secondary inline_block">
											<span className="ts_icon ts_icon_user_groups" aria-hidden="true" />
										</div>
									</div>
								</div>
								<div data-ent-analytics-usage-callout-limit-apps_installed="">
									<div className="ent_callout__limit">
										out of 10{' '}
										<a
											href="/services"
											target="_blank"
											data-clog-click="true"
											data-clog-event="WEBSITE_CLICK"
											data-clog-params="action=click,step=team_stats_overview,ui_element=apps_installed_link"
										>
											apps and integrations
										</a>
									</div>
								</div>
								<div
									className="ent_callout__meter"
									data-ent-analytics-usage-callout-icon-meter-apps_installed=""
								>
									<div
										className="ent_callout__meter_icon"
										data-ent-meter-icon-container-apps_installed=""
									>
										{ this.renderFakeMembers() }
									</div>
								</div>
								<div data-ent-analytics-usage-callout-insight-apps_installed="">
									<div className="ent_callout__insight ent_callout__insight--margin_top" />
								</div>
							</div>
						</div>*/
						}
					</div>
				</div>
				<div className="ent_infographic_container">
					<div>
						<div className="ent_graph_header">
							<i className="ts_icon ts_icon_user_groups seafoam_green inline_block" />
							<div className="ent_graph_header--primary inline_block">Hội thoại mới</div>
							<div className="ent_graph_header--secondary block">
								Xem thống kê số lượng hội thoại mới phát sinh trên trang của bạn.
							</div>
						</div>
					</div>
					<div data-enterprise-analytics-infographic-tabs-active-users="">
						<div className="ent_graph_tabs">
							<div
								className={ classNames( "ent_graph_tabs__tab", {
									"ent_graph_tabs__tab--selected ent_graph_tabs__tab--selected_seafoam_green": this.state.selectedTab === "days"
								} ) }
								data-graph-tab="days"
								onClick={ this.handleTabClick }
							>
								30 ngày qua
							</div>
							<div
								className={ classNames( "ent_graph_tabs__tab", {
									"ent_graph_tabs__tab--selected ent_graph_tabs__tab--selected_seafoam_green": this.state.selectedTab === "detail"
								} ) }
								data-graph-tab="detail"
								onClick={ this.handleTabClick }
							>
								Chi tiết
							</div>
						</div>
					</div>
					{
						this.state.selectedTab === "days" && (
							<Chart
								name="days"
								data={ byDayChartData }
								defaultConfig={ timeseriesDaysConfigs }
							/>
						)
					}
					{
						this.state.selectedTab === "detail" && (
							<Chart
								name="overview"
								data={ data }
								defaultConfig={ timeseriesDetailConfigs }
							/>
						)
					}
				</div>
			</div>
		);
	}
}

export default Overview;
