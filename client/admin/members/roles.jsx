import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
// import { bindActionCreators } from 'redux';

import { isEmpty } from 'lodash';
import { submit, getFormSyncErrors, isSubmitting } from 'redux-form';

import HeaderCake from 'components/header-cake';
import Card from 'papo-components/Card';
import SectionHelper from 'papo-components/SectionHelper';
import Accordion from 'papo-components/Accordion';
import EmptyState from 'papo-components/EmptyState';
import RoleItem from './role-item';
import WithModal from 'blocks/with-modal';
import AddRole from './add-role';
import { Container } from 'papo-components/Grid';
import Page from 'papo-components/Page';
import WithTeam from 'components/with-team';
import ContentPlaceholder from 'admin/content-placeholder';

import styles from './style.scss';
import a_styles from 'admin/style.scss';
import g_styles from 'components/general-styles.scss';

class Roles extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			submitComplete: false,
			newRoleData: null,
		};

		this.addRoleRef = React.createRef();
	}

	renderRoles = () => {
		const { teamRoles, permissions, team, canManageRoles } = this.props;

		const roleItems = teamRoles.map( r => {
			return {
				title: r.display_name,
				buttonType: 'button',
				expandLabel: 'Xem',
				collapseLabel: 'Ẩn',
				children: (
					<RoleItem
						id={ r.id }
						key={ r.id }
						team={ team }
						role={ r }
						canManageRoles={ canManageRoles }
						systemPermissions={ permissions }
						updateTeamRole={ this.props.updateTeamRole }
					/>
				),
			};
		} );
		return (
			<Card>
				<Card.Header title={ 'Vai trò đã tạo' } />
				<Card.Content>
					<Accordion items={ roleItems } />
				</Card.Content>
			</Card>
		);
	};

	renderDialogContent = () => {
		const { permissions, team } = this.props;
		return (
			<div>
				<AddRole
					ref={ this.addRoleRef }
					permissions={ permissions }
					renderButtons={ false }
					team={ team }
				/>
			</div>
		);
	};

	submitRole = () => {
		this.props.dispatch( submit( 'roles' ) );
	};

	_renderAddNewRoleButton = buttonTheme => {
		const { rolesFormSyncErrors, submitting, rolesSubmitting, rolesSubmitSucceeded } = this.props;

		return (
			<WithModal
				isOpen={ true }
				primary
				className={ styles.add_role_dialog }
				title={ 'Thêm vai trò' }
				text={ 'Thêm vai trò' }
				buttonTheme={ buttonTheme }
				dialogContentRenderer={ this.renderDialogContent }
				onGo={ this.submitRole }
				isBusy={ rolesSubmitting }
				goButtonText="Thêm"
				submitComplete={ rolesSubmitSucceeded }
				disableConfirmation={ ! isEmpty( rolesFormSyncErrors ) || submitting }
			/>
		);
	};

	render() {
		const { teamRoles, errors, isTeamRolesLoaded, isLoadingTeamRoles, canManageRoles } = this.props;

		if ( ! isTeamRolesLoaded && isLoadingTeamRoles ) {
			return <ContentPlaceholder withHeaderCake={ true } />;
		}

		if ( isTeamRolesLoaded && errors ) {
			return (
				<Page upgrade>
					<Page.Content>
						<Container
							className={ classNames( a_styles.admin_container, a_styles.admin_container_small ) }
						>
							<Card>
								<Card.Header
									title="Vai trò trong nhóm"
									suffix={ canManageRoles ? this._renderAddNewRoleButton() : null }
								/>
								<Card.Content>{ errors.message }</Card.Content>
							</Card>
						</Container>
					</Page.Content>
				</Page>
			);
		}

		if ( isTeamRolesLoaded && ( ! teamRoles || teamRoles.length === 0 ) && ! isLoadingTeamRoles ) {
			return (
				<Page upgrade>
					<Page.Content>
						<Container
							className={ classNames( a_styles.admin_container, a_styles.admin_container_small ) }
						>
							<div style={ { marginBottom: 15 } }>
								<SectionHelper
									appearance="standard"
									onClose={ () => 'onClose' }
									title="Vai trò trong nhóm."
								>
									Bạn có thể tạo các vai trò trong nhóm và quyết định quyền truy cập hoặc chỉnh sửa
									các dữ liệu trong nhóm.
								</SectionHelper>
							</div>
							<Card>
								<Card.Header
									title="Vai trò trong nhóm"
									suffix={ canManageRoles ? this._renderAddNewRoleButton() : null }
								/>

								<Card.Content>
									<EmptyState
										title="Chưa có vai trò nào được tạo."
										subtitle="Bắt đầu tạo nhóm vai trò và gán cho các thành viên trong nhóm của bạn."
										image="/papo/images/illustrations/empty_experience.svg"
									>
										{ this._renderAddNewRoleButton( 'light' ) }
									</EmptyState>
								</Card.Content>
							</Card>
						</Container>
					</Page.Content>
				</Page>
			);
		}

		return (
			isTeamRolesLoaded && (
				<Page upgrade>
					<Page.Content>
						<Container
							className={ classNames( a_styles.admin_container, a_styles.admin_container_small ) }
						>
							<HeaderCake
								backHref="/admin/members/team"
								actionButton={ canManageRoles ? this._renderAddNewRoleButton() : null }
							/>
							<Card>{ this.renderRoles() }</Card>
						</Container>
					</Page.Content>
				</Page>
			)
		);
	}
}

// function mapDispatchToProps(dispatch) {
// 	const actions = bindActionCreators({ updateTeamRole });
// 	return { ...actions, dispatch };
// }

export default connect( state => {
	return {
		rolesFormSyncErrors: getFormSyncErrors( 'roles' )( state ),
		submitting: isSubmitting( 'roles' )( state ),
	};
} )( WithTeam( Roles ) );
