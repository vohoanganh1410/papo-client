/** @format */

/**
 * External dependencies
 */
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import EmptyContent from 'components/empty-content';
import config from 'config';
import Footer from './footer';
// import Alert from 'components/alert';
import FacebookLoginButton from 'components/social-buttons/facebook';

export class Login extends Component {
	render() {
		const message = (
			<span>
				By click "Continue with Facbook", you agree with &nbsp;
				<a href="/privacy" target="_blank">
					Privacy & Terms
				</a>
				&nbsp; of Papo.
			</span>
		);

		const loginButton = <FacebookLoginButton link={ config( 'login_url' ) } />;
		return (
			<div>
				<EmptyContent
					illustration="/papo/i/favicons/apple-touch-icon-114x114.png"
					title="Manager your fanpages with Papo"
					line="Please login to continue."
					action={ loginButton }
					actionURL={ config( 'login_url' ) }
				/>

				<div style={ { marginTop: 150, width: 650, margin: '50px auto', textAlign: 'center' } }>
					{ message }
				</div>
				<Footer />
			</div>
		);
	}
}

export default Login;
