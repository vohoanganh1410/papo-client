import React from 'react';
import { Field, reduxForm } from 'redux-form';

import FormField from 'papo-components/FormField';
import FormFieldset from 'components/forms/form-fieldset';
import { submitRole } from 'actions/role';
import { renderField, renderToggleSwitch } from './utils';
import WithTeam from 'components/with-team';

import styles from './style.scss';

const validate = values => {
	const errors = {};

	if ( ! values.name ) {
		errors.name = 'Tên vai trò không được để trống';
	}

	return errors;
};

class AddRole extends React.Component {
	render() {
		const { canManageRoles, permissions, handleSubmit } = this.props;

		return (
			<div>
				<form onSubmit={ handleSubmit }>
					<FormFieldset>
						<Field
							name="name"
							type="text"
							component={ renderField }
							label="Tên vai trò"
							props={ {
								disabled: ! canManageRoles,
							} }
						/>
					</FormFieldset>
					<FormFieldset>
						<Field
							name="description"
							type="text"
							component={ renderField }
							label="Mô tả"
							props={ {
								disabled: ! canManageRoles,
							} }
						/>
					</FormFieldset>
					<FormFieldset>
						<FormField label="Quyền hạn">
							<div className={ styles.permissions_form }>
								{ permissions.map( permission => (
									<Field
										name={ permission.id }
										component={ renderToggleSwitch }
										props={ {
											disabled: ! canManageRoles,
										} }
										permission={ permission }
									/>
								) ) }
							</div>
						</FormField>
					</FormFieldset>
				</form>
			</div>
		);
	}
}

export default reduxForm( {
	form: 'roles',
	validate,
	onSubmit: submitRole,
} )( WithTeam( AddRole ) );
