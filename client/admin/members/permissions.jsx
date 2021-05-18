import React from 'react';
import PropTypes from 'prop-types';
import { includes } from 'lodash';

import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormLegend from 'components/forms/form-legend';
import FormCheckbox from 'components/forms/form-checkbox';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import styles from './style.scss';

export default class Permissions extends React.PureComponent {
	static propTypes = {
		permissions: PropTypes.arrayOf( PropTypes.object ),
	};

	constructor( props ) {
		super( props );

		this.state = {
			selectedPermissions: props.selectedPermissions,
		};
	}

	renderPermission = permission => {
		if ( ! permission ) return null;

		const { selectedPermissions } = this.state;

		return (
			<FormLabel key={ permission.id }>
				<FormCheckbox
					id={ permission.id }
					name={ permission.id }
					checked={ includes( selectedPermissions, permission.id ) }
					onChange={ this.props.onChange }
				/>
				<span>
					{ permission.name }
					<FormSettingExplanation>{ permission.description }</FormSettingExplanation>
				</span>
			</FormLabel>
		);
	};

	render() {
		const { permissions } = this.props;
		if ( ! permissions || permissions.length === 0 ) return null;

		return (
			<form>
				<FormFieldset>
					<FormLegend>Quyền hạn</FormLegend>
					<div className={ styles.permissions_form }>
						{ permissions.map( this.renderPermission ) }
					</div>
				</FormFieldset>
			</form>
		);
	}
}
