import React from 'react';
import { connect } from 'react-redux';
import { Field, getFormSyncErrors, reduxForm } from 'redux-form';
import { isEmpty } from 'lodash';

import { Cell, Layout } from 'papo-components/Layout';
import WithTeam from 'components/with-team';
import Button from 'papo-components/Button';
import Delete from 'papo-components/new-icons/Delete';
import FormFieldset from 'components/forms/form-fieldset';
import { renderField, renderSelect, sanitizeMemberForUpdate } from './utils';
import { updateTeamMember } from 'actions/team';

class EditMember extends React.PureComponent {
	render() {
		const {
			member,
			teamRoles,
			canEditMembers,
			handleSubmit,
			pristine,
			submitting,
			formSyncErrors,
		} = this.props;

		if ( ! canEditMembers ) return null;

		const _roles = [];

		( teamRoles || [] ).forEach( r => {
			_roles.push( {
				id: r.name,
				value: r.display_name,
				name: r.name,
			} );
		} );

		return (
			<form onSubmit={ handleSubmit }>
				<div style={ { marginTop: 30 } }>
					<Layout>
						<Cell span={ 4 }>
							<FormFieldset>
								<Field
									name="roles"
									component={ renderSelect }
									label="Vai trò"
									options={ _roles }
									placeholder="Chọn vai trò"
									initialSelectedId={ member.roles }
									required
								/>
							</FormFieldset>
							<FormFieldset>
								<Field
									name="display_name"
									type="text"
									component={ renderField }
									label="Tên hiển thị trong nhóm"
								/>
							</FormFieldset>
							<Cell>
								<Layout cols={ 2 } gap="10px" alignItems="center">
									<Button skin="destructive" prefixIcon={ <Delete /> }>
										Gỡ
									</Button>
									<Button
										type="submit"
										disabled={ pristine || submitting || ! isEmpty( formSyncErrors ) }
									>
										Cập nhật
									</Button>
								</Layout>
							</Cell>
						</Cell>
					</Layout>
				</div>
			</form>
		);
	}
}

EditMember = reduxForm( {
	form: 'editTeamMember',
	onSubmit: updateTeamMember,
} )( EditMember );

EditMember = connect( ( state, { member, team } ) => {
	return {
		initialValues: sanitizeMemberForUpdate( state, team, member ),
		formSyncErrors: getFormSyncErrors( 'editTeamMember' )( state ),
		enableReinitialize: true,
	};
} )( WithTeam( EditMember ) );

export default EditMember;
