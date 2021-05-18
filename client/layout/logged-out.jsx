/** @format */

/**
 * External dependencies
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { includes } from 'lodash';

/**
 * Internal dependencies
 */
// import MasterbarLoggedOut from './masterbar/logged-out';
import MasterbarLoggedOut from '../layout/masterbar/loged-out';
// import { getSection, masterbarIsVisible } from 'state/ui/selectors';
// import OauthClientMasterbar from 'layout/masterbar/oauth-client';
// import { getCurrentOAuth2Client, showOAuth2Layout } from 'state/ui/oauth2-clients/selectors';

// Returns true if given section should display sidebar for logged out users.

const LayoutLoggedOut = ( {
	masterbarIsHidden,
	oauth2Client,
	primary,
	secondary,
	section,
	redirectUri,
	useOAuth2Layout,
} ) => {
	const classes = {
		'focus-content': true,
		'has-no-sidebar': true, //true
		'has-no-masterbar': false,
	};

	let masterbar = <MasterbarLoggedOut
						title={ 'section.title' }
						sectionName={ 'section.name' }
						redirectUri={ '/' }
					/>


	return (
		<div className={ classNames( 'layout full-height', classes ) }>
			{ masterbar }

			<div id="content" className="layout__content full-height">
				<div id="primary" className="layout__primary full-height">
					{ primary }
				</div>

				<div id="secondary" className="layout__secondary">
					{ secondary }
				</div>
			</div>
		</div>
	);
};

LayoutLoggedOut.displayName = 'LayoutLoggedOut';
LayoutLoggedOut.propTypes = {
	primary: PropTypes.element,
	secondary: PropTypes.element,
	// Connected props
	masterbarIsHidden: PropTypes.bool,
	section: PropTypes.oneOfType( [ PropTypes.bool, PropTypes.object ] ),
	redirectUri: PropTypes.string,
	showOAuth2Layout: PropTypes.bool,
};

export default connect( state => ( {
	masterbarIsHidden: false,
} ) )( LayoutLoggedOut );
