/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import Button from 'components/button';
// import { recordTracksEvent } from 'state/analytics/actions';

class SiteSelectorAddSite extends Component {
	getAddNewSiteUrl() {
		return '/sites/create';
	}

	recordAddNewSite = () => {
		// this.props.recordTracksEvent( 'calypso_add_new_wordpress_click' );
	};

	render() {
		const { translate } = this.props;
		return (
			<span className="site-selector__add-new-site">
				<Button borderless href={ this.getAddNewSiteUrl() } onClick={ this.recordAddNewSite }>
					<Gridicon icon="add-outline" /> { translate( 'Add New Site' ) }
				</Button>
			</span>
		);
	}
}

export default connect( null, { /*recordTracksEvent*/ } )( localize( SiteSelectorAddSite ) );
