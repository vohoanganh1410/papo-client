import React from 'react';
import PropTypes from 'prop-types';

import EditRole from './edit-role';

export default class RoleItem extends React.PureComponent {
	static propTypes = {
		role: PropTypes.object,
	};

	render() {
		const { team, role, systemPermissions } = this.props;
		if ( ! role ) return null;

		return (
			<EditRole
				key={ role.id }
				team={ team }
				role={ role }
				permissions={ systemPermissions }
				updateTeamRole={ this.props.updateTeamRole }
				canManageRoles={ this.props.canManageRoles }
				onRoleDataChanged={ this.props.onRoleDataChanged }
			/>
		);
	}
}
