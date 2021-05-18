/** @format */

/**
 * External dependencies
 */
import React from 'react';
import createReactClass from 'create-react-class';
import debugFactory from 'debug';
import { connect } from 'react-redux';
import { flowRight, times } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Main from 'components/main';
import MeSidebarNavigation from 'me/sidebar-navigation';
import SectionHeader from 'components/section-header';
import MeInviteDetail from 'me/profile/invite-item';
import ClipboardButtonInputExport from 'components/clipboard-button-input';
import { getCurrentUser, getMeInvites } from 'state/current-user/selectors';
import QueryMeInvites from 'components/data/query-me-invites';
import InvitePlaceholder from './invite-placeholder';
import { isRequestingMeInvites } from 'state/current-user/selectors';

/**
 * Module constants
 */
const NUMBER_OF_PLACEHOLDERS = 2;
const debug = debugFactory( 'papo:me:profile' );

const Profile = createReactClass( {
	displayName: 'Profile',

	componentDidMount() {
		debug( this.displayName + ' component is mounted.' );
	},

	componentWillUnmount() {
		debug( this.displayName + ' component is unmounting.' );
	},

	render() {
		const { currentUser, meInvites } = this.props;

		return (
			<Main className="profile">
				<QueryMeInvites userId={ currentUser._id } />
				<MeSidebarNavigation />
				<div className="sharing-settings sharing-connections">
					<div className="sharing-services-group">
						<SectionHeader label={ this.props.translate( 'Current Invitations' ) } />
						<ul className="sharing-services-group__services">
							
							{
								this.props.isRequestingMyInvites && times( NUMBER_OF_PLACEHOLDERS, index => {
									return <InvitePlaceholder key={ 'service-placeholder-' + index } />
								} )
								
							}
							{
								meInvites && meInvites.length > 0 
								&&  meInvites.map( invite => {
									return <MeInviteDetail key={ invite.invite_key } invite={ invite } />;
								} )
							}
						</ul>
						<SectionHeader label={ this.props.translate( 'Get invited' ) } />
						<Card className="me-profile-settings">
							<div>
								<p>{ this.props.translate( 'Để gia nhập một Site, hãy copy mã thành viên của bạn và gửi tới người quản trị Site.' ) }</p>
								<ClipboardButtonInputExport value={ currentUser._id } />
							</div>
						</Card>
					</div>
					
				</div>
			</Main>	
		)
	}

});

// export default connect( null, {  } ) ( Profile );


export default connect(
	state => ( {
		currentUser: getCurrentUser( state ),
		meInvites: getMeInvites( state ),
		isRequestingMyInvites: isRequestingMeInvites( state ),
	} ),
	{
		getMeInvites,
		isRequestingMeInvites,
		// resetUserProfileLinkErrors,
	}
)( localize( Profile ) );
