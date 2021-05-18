import React from 'react';
import { Field, reduxForm } from 'redux-form';

import WithTeam from 'components/with-team';
import FormFieldset from 'components/forms/form-fieldset';
import { renderField, renderSelect } from './utils';
import { addTeamMember, validateUserBeforeAddToTeam as asyncValidate } from 'actions/team';

const validate = values => {
	const errors = {};

	if ( ! values.id ) {
		errors.id = 'Mã thành viên không được để trống';
	}

	if ( ! values.roles ) {
		errors.roles = 'Vai trò không được để trống';
	}

	return errors;
};

class AddMember extends React.PureComponent {
	render() {
		const { canEditMembers, team, handleSubmit } = this.props;

		const _roles = [];

		( this.props.teamRoles || [] ).forEach( r => {
			_roles.push( {
				id: r.id,
				value: r.display_name,
				name: r.name,
			} );
		} );

		return (
			<form onSubmit={ handleSubmit }>
				<FormFieldset>
					<Field name="id" type="text" component={ renderField } label="Mã thành viên" required />
				</FormFieldset>
				<FormFieldset>
					<Field
						name="roles"
						component={ renderSelect }
						label="Vai trò"
						options={ _roles }
						placeholder="Chọn vai trò"
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
			</form>
		);
	}
}

export default reduxForm( {
	form: 'addTeamMember',
	validate,
	asyncValidate,
	asyncBlurFields: [ 'id' ],
	onSubmit: addTeamMember,
} )( WithTeam( AddMember ) );
