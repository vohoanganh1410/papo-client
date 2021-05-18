import React from 'react';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

export default class SwitchLayoutFocus extends React.PureComponent {
	handleClick = () => {
		if ( this.props.onSetLayoutFocusSidebar ) {
			this.props.onSetLayoutFocusSidebar();
		}
	};

	render() {
		return (
			<div className={ styles.switch_layout_focus_container }>
				<UnstyledButton onClick={ this.handleClick } className={ g_styles.full_width_and_height }>
					<Icon type="chevron_medium_left" />
				</UnstyledButton>
			</div>
		);
	}
}
