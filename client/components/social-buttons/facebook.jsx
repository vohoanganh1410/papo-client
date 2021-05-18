/** @format */

/**
 * External dependencies
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
// import { loadScript } from 'lib/load-script';
import { localize } from 'i18n-calypso';
// import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import FacebookIcon from 'components/social-icons/facebook';
import { isFormDisabled } from 'state/login/selectors';

class FacebookLoginButton extends Component {
	// See: https://developers.facebook.com/docs/javascript/reference/FB.init/v2.8
	static propTypes = {
		translate: PropTypes.func.isRequired,
		onClick: PropTypes.func,
	};

	constructor( props ) {
		super( props );
		this.handleClick = this.handleClick.bind( this );
	}

	handleClick( event ) {
		event.preventDefault();
		this.props.onClick( event );
	}

	render() {
		const isDisabled = Boolean( this.props.isFormDisabled );

		return (
			<div className="social-buttons__button-container">
				<a
					className={ classNames( 'social-buttons__button button', { disabled: isDisabled } ) }
					href={ this.props.link }
					style={ {
						background: '#4267B2',
						color: '#fff',
						boxShadow: 'none',
						border: 'none',
					} }
				>
					<FacebookIcon />

					<span className="social-buttons__service-name">
						{ this.props.translate( 'Continue with %(service)s', {
							args: { service: 'Facebook' },
							comment:
								'%(service)s is the name of a Social Network, e.g. "Google", "Facebook", "Twitter" ...',
						} ) }
					</span>
				</a>
			</div>
		);
	}
}

export default connect( state => ( {
	isFormDisabled: isFormDisabled( state ),
} ) )( localize( FacebookLoginButton ) );
