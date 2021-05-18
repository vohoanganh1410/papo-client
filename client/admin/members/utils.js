import React from 'react';
import { get, find } from 'lodash';

import FormField from 'papo-components/FormField';
import ToggleSwitch from 'papo-components/ToggleSwitch';
import Input from 'papo-components/Input';
import Dropdown from 'papo-components/Dropdown';

export const renderField = ( {
	input,
	label,
	name,
	meta: { touched, error, asyncValidating },
	required,
	disabled,
} ) => {
	const statusProps = asyncValidating ? { status: 'loading' } : {};

	return (
		<FormField label={ label } required={ required }>
			<Input
				id={ name }
				name={ name }
				error={ touched && error && error.length > 0 }
				errorMessage={ touched && error }
				disabled={ disabled }
				{ ...input }
				{ ...statusProps }
			/>
		</FormField>
	);
};

export const renderSelect = ( {
	input,
	label,
	selectedId,
	initialSelectedId,
	required,
	meta: { touched, error },
	options,
	...custom
} ) => (
	<FormField label={ label } required={ required }>
		<Dropdown
			id="roles"
			name="roles"
			options={ options }
			error={ touched && error && error.length > 0 }
			errorMessage={ touched && error }
			initialSelectedId={ initialSelectedId }
			{ ...input }
			{ ...custom }
		/>
	</FormField>
);

export const renderToggleSwitch = ( { input, permission, disabled } ) => (
	<div>
		<FormField
			id={ permission.id }
			label={ permission.name }
			labelPlacement="right"
			stretchContent={ false }
			infoContent={ permission.description }
		>
			<ToggleSwitch
				size="medium"
				id={ permission.id }
				name={ permission.id }
				checked={ !! input.value }
				onChange={ input.onChange }
				disabled={ disabled }
				{ ...input }
			/>
		</FormField>
	</div>
);

export const sanitizeRole = role => {
	if ( ! role ) return null;

	const result = {};

	result.name = role.display_name;
	result.description = role.description;

	role.permissions &&
		role.permissions.length > 0 &&
		role.permissions.map( permission => {
			result[ permission ] = true;
		} );

	return result;
};

export const sanitizeMemberForUpdate = ( state, team, member ) => {
	if ( ! team || ! member ) return null;

	const teamRoles = get( state.teams.roles, team.id );
	if ( ! teamRoles || teamRoles.length === 0 ) return null;

	const memberRole = find( teamRoles, { name: member.roles } );
	return {
		display_name: member.display_name,
		roles: memberRole.display_name,
	};
};
