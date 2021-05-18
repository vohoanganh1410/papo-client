import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { noop } from 'lodash';

import { getCurrentUser } from 'state/current-user/selectors';
import { getSelectedPageId } from 'state/ui/selectors';
import { getPage } from 'state/pages/selectors';
import { getSelectedPageIdsPreference } from 'state/preferences/selectors';
import * as GlobalActions from 'actions/global-actions';

class CListHeader extends React.PureComponent {
	static propTypes = {
		currentPage: PropTypes.object,
		multipleMode: PropTypes.bool,
		currentUser: PropTypes.object,
	};

	static defaultProps = {
		currentPage: undefined,
		multipleMode: false,
		currentUser: noop,
	};

	constructor( props ) {
		super( props );

		this.state = {
			showFilter: false,
		};
	}

	_logout = () => {
		GlobalActions.emitUserLoggedOutEvent();
	};

	renderCurrentUser = () => {
		var u = this.props.currentUser;
		return (
			<div id="team_menu_user">
				<div id="presence_container" className="no_wrap ts_tip ts_tip_bottom ts_tip_left">
					<i
						id="presence"
						className="ts_icon ts_icon_presence active"
						style={ { opacity: 0.98 } }
					/>
					<span className="ts_tip_tip">Active</span>
				</div>
				<span id="team_menu_user_details">
					<span id="team_menu_user_name" className="overflow_ellipsis current_user_name">
						{ u.first_name + ' ' + u.last_name }
					</span>
					<span
						className="current_status ts_tip ts_tip_bottom ts_tip_multiline ts_tip_delay_150 color_UDUUUD3MH color_235e5b hidden ts_tip_hidden current_status_with_expiration current_user_current_status ts_tip_float"
						data-member-id="UDUUUD3MH"
					>
						<span className="ts_tip_tip ts_tip_inner_current_status">
							<span className="ts_tip_multiline_inner" />
						</span>
					</span>
				</span>
			</div>
		);
	};

	render() {
		const { currentUser, selectedPage, selectedPageIds } = this.props;
		// console.log('currentUser', currentUser);
		if ( ! currentUser ) return null;

		const user_display_name = currentUser.first_name + ' ' + currentUser.last_name;
		const page_display_name = selectedPage
			? selectedPage.name
			: selectedPageIds
			? `Chế độ gộp trang (${ selectedPageIds.split( ',' ).length } trang)`
			: 'Lỗi';

		return (
			<div className="header_panel" ref="filerbutton">
				<div
					id="team_menu"
					data-qa="team_menu"
					className=""
					data-clog-click="true"
					data-clog-event="TEAM_MENU_OPENED"
					role="navigation"
					aria-labelledby="team_menu_aria_label"
				>
					<h1 id="team_menu_aria_label" className="offscreen">
						Team Menu
					</h1>
					<div className="placeholder_shimmer_clipper">
						<div className="placeholder_shimmer_bg_wrapper">
							<div className="placeholder_shimmer_bg" />
						</div>
					</div>
					<div className="team_name_container top_margin">
						<button
							className="ts_icon ts_icon_chevron_down team_name_caret btn_unstyle"
							aria-label="Team Menu"
							aria-haspopup="true"
						/>
						<span id="team_name" className="overflow_ellipsis">
							{ page_display_name }
						</span>
					</div>
					<div id="team_menu_overlay" className="onboarding_overlay hidden">
						<div className="overlay_mock_text seventy_percent_width" />
					</div>
					<span
						data-automount-component="DndButton"
						className="notifications_menu_btn_react"
						data-reactroot=""
					>
						<button
							className="c-button-unstyled p-dnd_button"
							type="button"
							aria-haspopup="true"
							data-qa="do_not_disturb_btn"
							delay="150"
						>
							<i
								className="c-icon c-icon--real-checkbox-checked-o"
								type="bell-o"
								aria-hidden="true"
							/>
						</button>
					</span>
					<div id="team_menu_user">
						<div id="presence_container" className="no_wrap ts_tip ts_tip_bottom ts_tip_left">
							<i
								id="presence"
								className="ts_icon ts_icon_presence active"
								style={ { opacity: 0.98 } }
							/>
							<span className="ts_tip_tip">Trực tuyến</span>
						</div>
						<span id="team_menu_user_details">
							<span id="team_menu_user_name" className="overflow_ellipsis current_user_name">
								{ user_display_name }
							</span>
							<span
								className="current_status ts_tip ts_tip_bottom ts_tip_multiline ts_tip_delay_150 color_UDUUUD3MH color_235e5b hidden ts_tip_hidden current_status_with_expiration current_user_current_status ts_tip_float"
								data-member-id="UDUUUD3MH"
							>
								<span className="ts_tip_tip ts_tip_inner_current_status">
									<span className="ts_tip_multiline_inner" />
								</span>
							</span>
						</span>
					</div>
				</div>
			</div>
		);
	}
}

export default connect( state => {
	const selectedPageId = getSelectedPageId( state );
	const selectedPage = selectedPageId ? getPage( state, selectedPageId ) : null;

	return {
		currentUser: getCurrentUser( state ),
		selectedPageId,
		selectedPage,
		selectedPageIds: getSelectedPageIdsPreference( state ),
	};
} )( CListHeader );
