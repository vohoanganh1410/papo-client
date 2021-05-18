import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { Container } from 'papo-components/Grid';
import Page from 'papo-components/Page';
import HeaderCake from 'components/header-cake';
import Card from 'papo-components/Card';
import PeopleProfile from 'blocks/member-profile';
import EditMember from './edit-member';
import { getSelectedTeam } from 'state/current-user/selectors';
import { getMember } from 'state/team/selectors';
import WithTeam from 'components/with-team';

import styles from './style.scss';
import a_styles from 'admin/style.scss';

class MemberDetails extends React.PureComponent {
	render() {
		const { member, memberId } = this.props;
		if ( ! member ) {
			return (
				<Page upgrade>
					<Page.Content>
						<Container className={ a_styles.admin_container }>
							Không tìm thấy thành viên với ID: <strong>{ memberId }</strong>
						</Container>
					</Page.Content>
				</Page>
			);
		}

		return (
			<Page upgrade>
				<Page.Content>
					<Container
						className={ classNames( a_styles.admin_container, a_styles.admin_container_small ) }
					>
						<HeaderCake backHref="/admin/members/team" />
						<Card>
							<Card.Content>
								<PeopleProfile
									className={ styles.member_list_item_container }
									user={ member }
									teamId={ this.props.team ? this.props.team.id : null }
								/>
								{ // need to check if user can edit other members
								! member.scheme_admin && <EditMember team={ this.props.team } member={ member } /> }
							</Card.Content>
						</Card>
					</Container>
				</Page.Content>
			</Page>
		);
	}
}

export default connect(
	( state, { memberId } ) => {
		const team = getSelectedTeam( state );
		return {
			member: team ? getMember( state, team.id, memberId ) : null,
		};
	},
	{}
)( WithTeam( MemberDetails ) );
