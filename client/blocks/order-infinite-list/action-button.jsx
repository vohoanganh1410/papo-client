import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

import Tooltip from 'components/tooltip2';
import UnstyledButton from 'components/button2/unstyled-button';
import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

class ActionButton extends React.PureComponent {

	static propTypes = {
		icon: PropTypes.string,
		description: PropTypes.string,
		action: PropTypes.func,
	}

	static defaultProps = {
		icon: 'c-icon--small-reaction',
		description: null,
		action: noop
	}

	constructor( props ) {
		super( props );

		this.state = {
			position: 'top right',
			show: false,
			toggled: false,
		};
	}

	open = () => {
		this.setState( { show: true } );
	}

	close = () => {
		this.setState( { show: false } );
	};

	handleClick = (e) => {
		e.stopPropagation();
		// alert('a');

		if ( this.props.onClick ) {
			this.props.onClick(e);
		}
	};

	render() {
		let iconClasses = 'c-icon ';
		iconClasses += this.props.icon;

		return(

			<Tooltip
				tip={ this.props.description }
				position="top"
			>
				<UnstyledButton
					className={ classNames(styles.actions_button, g_styles.blue_on_hover) }
					onMouseEnter={ this.open }
					onMouseLeave={ this.close }
					onClick={ this.handleClick }
				>
					<i className={ iconClasses } type="small-reaction" aria-hidden="true"/>
				</UnstyledButton>
			</Tooltip>

		)
	}
}

export default ActionButton;
