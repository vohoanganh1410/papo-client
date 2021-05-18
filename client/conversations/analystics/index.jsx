import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';
import moment from 'moment';

import FullscreenModal from 'components/dialog2/fullscreen-modal';
import AnalyticsHeader from './header';
import LoadingSpinner from 'components/loading-spinner';
import Overview from './overview';
import Realtime from './realtime';
import {
	getPageAnalyticsData,
	isPageAnalyticsDataLoading,
} from 'state/pages/selectors';

class Analytics extends React.Component {
	static propTypes = {
		isOpen: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
		requestPageAnalytics: PropTypes.func.isRequired,
	};

	static defaultProps = {
		isOpen: false,
		onClose: noop,
	};

	constructor( props ) {
		super( props );

		this.state = {
			showDialog: props.isOpen,
			isLoading: props.isLoadingPageAnalyticsData,
			selectedTab: 'overview',
			startDate: moment().add(-10, 'day'),
			endDate: moment().add(-9, 'day'),
		};
	}

	componentWillMount() {
		const { page } = this.props;

		if ( page ) {
			this.props.requestPageAnalytics( page.data.page_id, this.state.startDate.format('YYYY-MM-DD'), this.state.endDate.format('YYYY-MM-DD') )
		}
	}

	// componentWillUnmount() {
	// 	// reset date range
	// 	this.setState( {
	// 		startDate: moment().add(-3, 'day'),
	// 		endDate: moment(),
	// 	} )
	// }

	componentWillReceiveProps( nextProps ) {
		this.setState( {
			showDialog: nextProps.isOpen,
			isLoading: nextProps.isLoadingPageAnalyticsData,
		} );

		if ( ( nextProps.page &&
			nextProps.page.data.page_id &&
			nextProps.page.data.page_id !== this.props.page.data.page_id )
		) {
			this.props.requestPageAnalytics( nextProps.page.data.page_id, nextProps.startDate.format('YYYY-MM-DD'), nextProps.endDate.format('YYYY-MM-DD') )
		}
	}

	showDialog = () => {
		this.setState( { showDialog: true } );
	};

	handleGoBack = () => {
		this.setState( { selectedSection: null } );
	};

	closeDialog = () => {
		this.setState( { showDialog: false }, () => {
			this.props.onClose();
		} );
	};

	renderHeader = () => {
		const { analyticsData } = this.props;

		return (
			<AnalyticsHeader
				startDate={ this.state.startDate }
				endDate={ this.state.endDate }
				onDatesChange={ this.handleDatesChange }
				serverTime={ analyticsData ? analyticsData.server_ts : null }
				updatedTime={ analyticsData ? analyticsData.updated_ts : null }
			/>
		)
	};

	handleDatesChange = ( startDate, endDate ) => {
		if ( moment.isMoment( startDate ) && moment.isMoment( endDate ) ) {
			const { page } = this.props;
			page && this.props.requestPageAnalytics( page.data.page_id, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD') );

			this.setState({ startDate, endDate });
		}
	};

	handleTabClick = e => {
		this.setState( {
			selectedTab: e.currentTarget.dataset.analyticsTab,
		} );
	};

	renderTabs = () => {
		const overviewClasses = classNames( 'analytics_overview_tab', {
			selected: this.state.selectedTab === 'overview',
		} );

		const membersClasses = classNames( 'analytics_members_tab', {
			selected: this.state.selectedTab === 'realtime',
		} );

		return (
			<div id="analytics_tabs" className="tab_set on_neutral_grey hide_on_mobile">
				<a
					className={ overviewClasses }
					onClick={ this.handleTabClick }
					data-analytics-tab="overview"
				>
					Tổng quan
				</a>
				<a
					className={ membersClasses }
					onClick={ this.handleTabClick }
					data-analytics-tab="realtime"
				>
					Thời gian thực
				</a>
			</div>
		);
	};

	renderLoading = () => {
		return (
			<div className="large_padding p-analytics_tab__loading">
				<LoadingSpinner size="medium" />
			</div>
		)
	};

	renderOverview = () => {
		const { analyticsData } = this.props;
		return (
			<Overview
				startDate={ this.state.startDate }
				endDate={ this.state.endDate }
				analyticsData={ analyticsData }
				requestPageAnalytics={ this.props.requestPageAnalytics }
			/>
		)
	};

	renderRealtime = () => {
		const { page } = this.props;
		return (
			<Realtime pageId={ page ? page.data.page_id : null } />
		)
	};

	renderContent = () => {
		if ( this.state.selectedTab === 'overview' ) {
			return this.renderOverview();
		} else if ( this.state.selectedTab === 'realtime' ) {
			return this.renderRealtime();
		} else {
			return (
				<div>Error</div>
			)
		}
	};

	render() {

		const isLoading = !this.props.analyticsData && this.state.isLoading;
		const isLoadingUpdate = this.props.analyticsData && this.state.isLoading;

		return (
			<FullscreenModal
				portalClassName="analystics"
				featureAccessibleFsDialogs={ false }
				withBreadcrumbHeader={ true }
				withFooter={ false }
				title={ 'page.name' }
				contentLabel="page-settings"
				isOpen={ this.state.showDialog }
				withHeader={ true }
				headerImage={ `//graph.facebook.com/994349830740410/picture?width=100&height=100` }
				ariaHideApp={ false }
				closeModal={ this.closeDialog }
				onEscape={ this.closeDialog }
				shouldCloseOnOverlayClick={ true }
				showBackButton={ true }
				onBack={ this.handleGoBack }
				showOpenTransition={ true }
			>
				{ this.renderHeader() }
				{ this.renderTabs() }
				<section className="tab_pane selected" data-tab="overview" data-enterprise-basic-analytics="1" style={{height: 'auto'}}>
					{
						isLoading && this.renderLoading()
					}
					{
						! isLoading && (
							<div className="ent_analytics_overview__container" data-ent-analytics-overview-container>

								{ this.renderContent() }
								<div className="ent_loading" data-loading-container>
									<div className={ classNames("ent_loading__overlay", {
										"ent_loading__overlay--loading": isLoadingUpdate
									}) }>
									</div>
									<div className="ent_loading__contents position_relative ent_loading__contents--viewable" data-loading-contents-container>
										<div className={ classNames( "ent_loading__spinner", {
											"ent_loading__spinner--loading": isLoadingUpdate
										} ) }>
											<LoadingSpinner size="medium" />
										</div>
									</div>
								</div>
							</div>
						)
					}
				</section>
			</FullscreenModal>
		);
	}
}

export default connect(
	( state, { page } ) => {
		return {
			isLoadingPageAnalyticsData: page ? isPageAnalyticsDataLoading( state, page.data.page_id ) : false,
			analyticsData: page ? getPageAnalyticsData( state, page.data.page_id ) : null,
		}
	}
)( Analytics )
