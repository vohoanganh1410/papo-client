/** @format */

/**
 * External dependencies
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import TooltipComponent from 'components/tooltip';

export default class OrderStatusButton extends PureComponent {
	constructor( props ) {
		super( props );

		this.open = this.open.bind( this );
		this.close = this.close.bind( this );
		this.changePosition = this.changePosition.bind( this );

		this.state = {
			position: 'bottom right',
			show: false,
		};
	}

	open() {
		this.setState( { show: true } );
	}

	close() {
		this.setState( { show: false } );
	}

	changePosition( event ) {
		this.setState( { position: event.target.value } );
	}
	renderStatusIcon() {
		let icon;
		switch ( this.props.status.name ) {
			case 'notCalled':
				icon = 'callStart';
				break;
			case 'callLater':
				icon = 'callMissed';
				break;
			case 'missCalled':
				icon = 'callDisabledStatus';
				break;
			case 'badNumber':
				icon = 'callBlocked';
				break;
			case 'success':
				icon = 'Avatar--presence Avatar--online';
				break;
			case 'spam':
				icon = 'blockNotification';
				break;
			default:
				icon = 'callForward';
				break;
		}
		return (
			<span className={ 'iconfont ' + icon }/>
		)
	}

	render() {
		const { status, placeholder } = this.props;
		if ( placeholder ) {
			return (
				<Button 
				borderless 
				className="order-status__button is-placeholder" >
					<span className="placeholder"/>
				</Button>
			)
		}

		return (
			<Button 
				borderless 
				className="order-status__button"
				onMouseEnter={ this.open }
				onMouseLeave={ this.close }
				onClick={ this.close }
				ref="tooltip-reference">
					{ this.renderStatusIcon() }
					<TooltipComponent
						id="tooltip__example"
						isVisible={ this.state.show }
						onClose={ this.close }
						position={ this.state.position }
						context={ this.refs && this.refs[ 'tooltip-reference' ] }
					>
						<div style={ { padding: '5px 10px' } }>{ this.props.status.display_name || 'Unknown' }</div>
					</TooltipComponent>
			</Button>
		)
	}
}