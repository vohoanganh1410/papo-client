import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { getFormSyncErrors, getFormAsyncErrors, isSubmitting, submit } from 'redux-form';

import Team from './team';
import { Container } from 'papo-components/Grid';
import Page from 'papo-components/Page';
import Card from 'papo-components/Card';
import AddMemberForm from './add-member';
import WithModal from 'blocks/with-modal';
import WithTeam from 'components/with-team';

import styles from 'admin/style.scss';

// TODO: port to es6 once we remove the last observe
class Members extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			newTeamMember: null,
		};
	}

	renderPeopleList() {
		switch ( this.props.filter ) {
			case 'team':
				return (
					<Team
						path={ this.props.path }
						selectedTeam={ this.props.team }
						query={ this.props.query }
						search={ this.props.search }
					/>
				);
			default:
				return null;
		}
	}

	_handleFoundUserChange = user => {
		this.setState( {
			newTeamMember: user,
		} );
	};

	renderDialogContent = () => {
		return (
			<AddMemberForm
				team={ this.props.team }
				teamRoles={ this.props.teamRoles }
				onFoundUserChange={ this._handleFoundUserChange }
			/>
		);
	};

	submitMember = () => {
		this.props.dispatch( submit( 'addTeamMember' ) );
	};

	render() {
		const { canEditMembers, formSyncErrors, formAsyncErrors, submitting } = this.props;

		const addMemberButton = canEditMembers ? (
			<WithModal
				className={ styles.add_role_dialog }
				compact
				primary
				title={ 'Thêm thành viên' }
				text={ 'Thêm thành viên' }
				dialogContentRenderer={ this.renderDialogContent }
				onGo={ this.submitMember }
				goButtonText="Thêm"
				disableConfirmation={
					! isEmpty( formSyncErrors ) || ! isEmpty( formAsyncErrors ) || submitting
				}
			/>
		) : null;

		return (
			<Page upgrade>
				<Page.Content>
					<Container
						className={ classNames( styles.admin_container, styles.admin_container_small ) }
					>
						<Card>
							<Card.Header title="Nhóm làm việc" suffix={ addMemberButton } />
							<Card.Content>{ this.renderPeopleList() }</Card.Content>
						</Card>
					</Container>
				</Page.Content>
			</Page>
		);
	}
}

export default connect( state => {
	return {
		formSyncErrors: getFormSyncErrors( 'addTeamMember' )( state ),
		formAsyncErrors: getFormAsyncErrors( 'addTeamMember' )( state ),
		submitting: isSubmitting( 'addTeamMember' )( state ),
	};
} )( WithTeam( Members ) );
