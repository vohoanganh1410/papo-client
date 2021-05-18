import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import Tooltip from 'components/tooltip2';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';
import styles from './style.scss';

class ActionButton extends React.PureComponent {
	static propTypes = {
		icon: PropTypes.string,
		description: PropTypes.string,
		action: PropTypes.func,
	};

	static defaultProps = {
		icon: 'c-icon--small-reaction',
		description: null,
		action: noop,
	};

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
	};

	close = () => {
		this.setState( { show: false } );
	};

	render() {
		return (
			<Tooltip tip={ this.props.description } position="top">
				<UnstyledButton
					className={ styles.c_message_actions__button }
					onMouseEnter={ this.open }
					onMouseLeave={ this.close }
				>
					<Icon type={ this.props.icon } />
				</UnstyledButton>
			</Tooltip>
		);
	}
}

export default ActionButton;
