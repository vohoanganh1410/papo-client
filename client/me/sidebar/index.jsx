/** @format */
/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { flow } from 'lodash';
import { localize } from 'i18n-calypso';
import page from 'page';

/**
 * Internal dependencies
 */
import Button from 'components/button';
// import config from 'config';
// import ProfileGravatar from 'me/profile-gravatar';
// import { addCreditCard, billingHistory, purchasesRoot } from 'me/purchases/paths';
import Sidebar from 'layout/sidebar';
// import SidebarFooter from '../layout/sidebar/footer';
import SidebarHeading from 'layout/sidebar/heading';
import SidebarItem from 'layout/sidebar/item';
import SidebarMenu from 'layout/sidebar/menu';
import SidebarRegion from 'layout/sidebar/region';
import ProfileAvatar from 'me/profile-avatar';
import userFactory from 'lib/user';
import userUtilities from 'lib/user/utils';
// import { getCurrentUser } from 'state/current-user/selectors';
// import { logoutUser } from 'state/login/actions';
// import { recordGoogleEvent } from 'state/analytics/actions';
import { setNextLayoutFocus } from 'state/ui/layout-focus/actions';

import * as OAuthToken from 'lib/oauth-token';
// import { logout } from '../../lib/oauth-store/actions';
import { logoutUser } from 'state/current-user/actions';
import { getCurrentUser } from 'state/current-user/selectors';

/**
 * Module variables
 */
const user = userFactory();

class MeSidebar extends React.Component {

	onNavigate = () => {
		this.props.setNextLayoutFocus( 'content' );
		window.scrollTo( 0, 0 );
	};

	onSignOut = () => {
		let redirectTo = '/';
		this.props.logoutUser(redirectTo).then(response => {
			// OAuthToken.clearToken();
			page.redirect(response);
		}); 
	};

	didClickFacebookLogoutButton = event => {
        let redirectTo = '/log-in';
        OAuthToken.clearToken();
		user.clear( () => ( location.href = redirectTo || '/' ));
		// userUtilities.logout( redirectTo );
		// this.props.logoutUser(redirectTo).then(response => {
			
		// }); 
    }


	renderNextStepsItem( selected ) {
		const { currentUser, translate } = this.props;

		<SidebarItem
			selected={ selected === 'next' }
			link="/me/next"
			label={ translate( 'Next Steps' ) }
			icon="list-checkmark"
			onNavigate={ this.onNavigate }
		/>
	}

	render() {
		const { context, translate, currentUser } = this.props;
		// console.log(currentUser);
		const filterMap = {
			'/me': 'profile',
			'/me/security/account-recovery': 'security',
			'/me/security/connected-applications': 'security',
			'/me/security/social-login': 'security',
			'/me/security/two-step': 'security',
			'me/privacy': 'privacy',
			'/me/notifications/comments': 'notifications',
			'/me/notifications/updates': 'notifications',
			'/me/notifications/subscriptions': 'notifications',
			'/help/contact': 'help',
			'/me/chat': 'happychat',
		};
		const filteredPath = context && context.path ?  context.path.replace( /\/\d+$/, '' ) : null; // Remove ID from end of path
		let selected;

		/*
		 * Determine currently-active path to use for 'selected' menu highlight
		 *
		 * Most routes within /me follow the pattern of `/me/{selected}`. But, there are a few unique cases.
		 * filterMap is an object that maps those special cases to the correct selected value.
		 */
		if ( filterMap[ filteredPath ] ) {
			selected = filterMap[ filteredPath ];
		} else {
			selected = context && context.path ? context.path.split( '/' ).pop() : null;
			// console.log(context);
		}

		return (
			<Sidebar>
				<SidebarRegion>
					<ProfileAvatar user={ currentUser } />

					<div className="sidebar__me-signout">
						<Button
							compact
							className="sidebar__me-signout-button"
							onClick={ this.didClickFacebookLogoutButton }
							title={ translate( 'Sign out of Papo' ) }
						>
							{ 'Sign Out' }
						</Button>
					</div>

					<SidebarMenu>
						<SidebarHeading>{ translate( 'Profile' ) }</SidebarHeading>
						<ul>
							<SidebarItem
								selected={ selected === 'profile' }
								link={ '/me'}
								label={ translate( 'My Profile' ) }
								icon="user"
								onNavigate={ this.onNavigate }
							/>

							<SidebarItem
								selected={ selected === 'account' }
								link={ '/me/account'}
								label={ translate( 'Account Settings' ) }
								icon="cog"
								onNavigate={ this.onNavigate }
								preloadSectionName="account"
							/>

							<SidebarItem
								selected={ selected === 'purchases' }
								link={ 'purchasesRoot' }
								label={ translate( 'Manage Purchases' ) }
								icon="credit-card"
								onNavigate={ this.onNavigate }
								preloadSectionName="purchases"
							/>

							<SidebarItem
								selected={ selected === 'security' }
								link={ '/me/security' }
								label={ translate( 'Security' ) }
								icon="lock"
								onNavigate={ this.onNavigate }
								preloadSectionName="security"
							/>

							<SidebarItem
								selected={ selected === 'notifications' }
								link={ 'me/notifications' }
								label={ translate( 'Notification Settings' ) }
								icon="bell"
								onNavigate={ this.onNavigate }
								preloadSectionName="notification-settings"
							/>
						</ul>
					</SidebarMenu>

					<SidebarMenu>
						<SidebarHeading>{ translate( 'Special' ) }</SidebarHeading>
						<ul>
							<SidebarItem
								selected={ selected === 'get-apps' }
								link={ '/me/get-apps' }
								label={ translate( 'Get Apps' ) }
								icon="my-sites"
								onNavigate={ this.onNavigate }
							/>
							{ this.renderNextStepsItem( selected ) }
						</ul>
					</SidebarMenu>
				</SidebarRegion>
			</Sidebar>
		);
	}
}

const enhance = flow(
	localize,
	connect(
		state => ( {
			currentUser: getCurrentUser(state),
		} ),
		{
			logoutUser,
			setNextLayoutFocus,
		}
	)
);

export default enhance( MeSidebar );
