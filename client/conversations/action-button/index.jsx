import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Tooltip from 'components/tooltip2';
import Icon from 'components/icon2';
import UnstyledButton from 'components/button2/unstyled-button';
import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

class ConversationActionButton extends React.Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		description: PropTypes.string,
		icon: PropTypes.string.isRequired,
		onToggle: PropTypes.func,
	};

	constructor( props ) {
		super( props );

		this.open = this.open.bind( this );
		this.close = this.close.bind( this );

		this.state = {
			position: props.tooltipPosition || 'bottom',
			show: false,
			toggled: false,
		};

		this.handleClick = this.handleClick.bind( this );
	}

	open() {
		this.setState( { show: true } );
	}

	close() {
		this.setState( { show: false } );
	}

	handleClick = e => {
		if ( this.props.onClick ) {
			this.props.onClick( e );
		}
	};

	handleToggle = () => {};

	render() {
		const { name, icon, iconClasses } = this.props;

		const buttonClasses = classnames(
			styles.conversations_header_icon,
			this.props.className,
			styles[ name ],
			{
				[ styles.active ]: this.props.actived,
			},
			g_styles.blue_on_hover
		);

		if ( this.props.description ) {
			return (
				<Tooltip tip={ this.props.description } position={ this.state.position }>
					<UnstyledButton
						id={ this.props.name }
						data-id={ this.props.name }
						onClick={ this.handleClick }
						className={ buttonClasses }
					>
						<Icon type={ icon } className={ iconClasses } />
					</UnstyledButton>
				</Tooltip>
			);
		}

		return (
			<UnstyledButton
				id={ this.props.name }
				data-id={ this.props.name }
				onClick={ this.handleClick }
				className={ buttonClasses }
			>
				<Icon type={ icon } className={ iconClasses } />
			</UnstyledButton>
		);
	}
}

export default ConversationActionButton;
