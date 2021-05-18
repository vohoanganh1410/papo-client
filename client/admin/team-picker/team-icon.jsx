import React from 'react';

import Icon from 'components/icon2';
import general_styles from 'components/general-styles.scss';
import styles from './style.scss';

export default class TeamIcon extends React.PureComponent {
	render() {
		return (
			<div
				className={
					general_styles.d_flex + ' ' + general_styles.v_center + ' ' + styles.team__icon__panel
				}
				style={ { width: 32, height: 32 } }
			>
				<Icon
					type={ this.props.type }
					size={ this.props.size }
					className={ general_styles.full_width_and_height + ' ' + styles.team_icon }
				/>
			</div>
		);
	}
}
