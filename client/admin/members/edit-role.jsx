import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, getFormSyncErrors } from 'redux-form';
import { isEmpty } from 'lodash';

import FormField from 'papo-components/FormField';
import FormFieldset from 'components/forms/form-fieldset';
import Button from 'papo-components/Button';
import { updateRole } from 'actions/role';
import WithTeam from 'components/with-team';
import { renderField, renderToggleSwitch, sanitizeRole } from './utils';

import styles from './style.scss';

const validate = values => {
	const errors = {};

	if ( ! values.name ) {
		errors.name = 'Tên vai trò không được để trống';
	}

	return errors;
};

let EditRole = props => {
	const { canManageRoles, permissions, handleSubmit, pristine, submitting, formSyncErrors } = props;

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
				<Button
					type="submit"
					disabled={ ! canManageRoles || pristine || submitting || ! isEmpty( formSyncErrors ) }
				>
					Cập nhật
				</Button>
			</form>
		</div>
	);
};

EditRole = reduxForm( {
	form: 'editRoles',
	validate,
	enableReinitialize: true,
	destroyOnUnmount: false,
	onSubmit: updateRole,
} )( EditRole );

EditRole = connect( ( state, { role } ) => {
	return {
		initialValues: sanitizeRole( role ),
		formSyncErrors: getFormSyncErrors( 'editRoles' )( state ),
	};
} )( WithTeam( EditRole ) );

export default EditRole;
