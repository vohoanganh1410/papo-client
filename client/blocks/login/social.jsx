/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleLoginButton from 'components/social-buttons/google';
import FacebookLoginButton from 'components/social-buttons/facebook';
import { localize } from 'i18n-calypso';
// just test
import request from 'superagent';

/**
 * Internal dependencies
 */
import config from 'config';
import { 
	loginSocialUser, 
	createSocialUser, 
	createSocialUserFailed,
	receiveFacebookPages,
} from 'state/login/actions';

import {
	getCreatedSocialAccountUsername,
	getCreatedSocialAccountBearerToken,
	getRedirectToOriginal,
	isSocialAccountCreating,
} from 'state/login/selectors';
// import { recordTracksEventWithClientId as recordTracksEvent } from 'state/analytics/actions';
// import WpcomLoginForm from 'signup/wpcom-login-form';
import { InfoNotice } from 'blocks/global-notice';
import { login } from 'lib/paths';
import FacebookIcon from 'components/social-icons/facebook';
import Button from 'components/button';
import papo from 'lib/papo';

class SocialLoginForm extends Component {
	
	constructor( props ) {
		super( props );
		this.handleLoginClick = this.handleLoginClick.bind( this );
	}

	handleLoginClick = ( event ) => {
		console.log( event );
	}

	testGetOauthAccessToken = () => {
		request
			.get( `http://localhost:8065/oauth/get_access_token` )
			.withCredentials()
			.set( { 'X-Requested-With': 'XMLHttpRequest' } )
			.then( response => {
				console.log( response );
			} )
			.catch( error => {
				console.log( error );
			} )
	}

	testGetOauthUser = () => {
		papo.me()
			.get()
			.then( response => {
				console.log( response );
					if ( ! response ) {
						console.log( "error" );
					}
				} )
			.catch( err => {
				console.log( err );
			} );

		// request
		// 	.get( `http://localhost:8065/oauth/me` )
		// 	.withCredentials()
		// 	.set( { 'X-Requested-With': 'XMLHttpRequest' } )
		// 	.then( response => {
		// 		console.log( response );
		// 	} )
		// 	.catch( error => {
		// 		console.log( error );
		// 	} )
	}

	testLogout = () => {
		request
			.get( `http://localhost:8065/oauth/authorize` )
			// .set( { 'Authorization': 'Bearer ' + "f89g8h1isfy3xkhh9siodoup1c" } )
			.withCredentials()
			.then( response => {
				console.log( response );
			} )
			.catch( error => {
				console.log( error );
			} )
	}

	test = () => {
		const app = {
			"name": "string",
			"description": "string",
			"icon_url": "https://localhost:5000/papo.png",
			"callback_urls": [
			"https://localhost:5000/callback"
			],
			"homepage": "https://localhost:5000",
			"is_trusted": true
			}
		request
			.post( `http://localhost:8065/api/v1/oauth/apps` )
			.withCredentials()
			.send( app )
			.then( response => {
				console.log( response );
			} )
			.catch( error => {
				console.log( error );
			} )
		
	}

	render() {
		const { redirectTo, uxMode } = this.props;
		const login_URL = config( 'login_url' );
		const redirectUri = uxMode
			? `https://${ ( typeof window !== 'undefined' && window.location.host ) +
					login( { isNative: true, socialService: 'google' } ) }`
			: null;

		return (
			<div className="login__social">
				<div className="login__social-buttons">
					<a className="button" onClick={ this.handleLoginClick }
						href={ login_URL }>
						<FacebookIcon />
						<span className="social-buttons__service-name">
							Đăng nhập
						</span>
					</a>
					<Button onClick={this.testGetOauthAccessToken}>
						Test Get User Token
					</Button>
					<Button onClick={this.testGetOauthUser}>
						Test Get User Info
					</Button>
					<Button onClick={this.testLogout}>
						Logout
					</Button>
				</div>
				
			</div>
		);
	}
}

export default connect(
	state => ( {
	} ),
	{
	}
)( localize( SocialLoginForm ) );
