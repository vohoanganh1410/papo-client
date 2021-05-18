/** @format */

/**
 * External dependencies
 */

import React from 'react';

/**
 * Internal dependencies
 */
import SitePicker from 'dashboard/picker';
import Sidebar from 'telesale/sidebar';

class TelesaleNavigation extends React.Component {
	static displayName = 'DashboardNavigation';

	preventPickerDefault = event => {
		event.preventDefault();
		event.stopPropagation();
	};

	render() {
		const query = {
			author: null,
			category: null,
			number: 20, // max supported by /me/posts endpoint for all-sites mode
			order: status === 'future' ? 'ASC' : 'DESC',
			search: null,
			status: "publish,private",
			tag: null,
			type: 'post',
		};
		return (
			<div className="sites-navigation">
				<SitePicker
					allSitesPath={ this.props.allSitesPath }
					siteBasePath={ this.props.siteBasePath }
					onClose={ this.preventPickerDefault }
				/>
				<Sidebar
					query={ query  }
					allSitesPath={ this.props.allSitesPath }
					path={ this.props.path }
					siteBasePath={ this.props.siteBasePath }
				/>
			</div>
		);
	}
}

export default TelesaleNavigation;
