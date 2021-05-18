import React from 'react';
import { connect } from 'react-redux';
import { omit, map } from 'lodash';

import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormSelect from 'components/forms/form-select';
import { getTeamRoles } from 'state/team/selectors';

class RoleSelect extends React.PureComponent {
	render() {
		const { team, id, roles } = this.props;
		const omitProps = [ 'team', 'roles' ];

		return (
			<FormFieldset key={ team.id } disabled={ false }>
				<FormLabel htmlFor={ id }>Vai trò</FormLabel>
				<FormSelect { ...omit( this.props, omitProps ) }>
					{ roles &&
						map( roles, role => {
							return (
								<option value={ role.name } key={ role.name }>
									{ role.display_name }
								</option>
							);
						} ) }
				</FormSelect>
			</FormFieldset>
		);
	}
}

export default connect(
	( state, { team } ) => {
		return {
			roles: team ? getTeamRoles( state, team.id ) : null,
		};
	},
	{}
)( RoleSelect );
