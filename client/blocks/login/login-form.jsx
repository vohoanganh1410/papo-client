/** @format */

/**
 * External dependencies
 */
import classNames from 'classnames';
import { capitalize, defer, includes } from 'lodash';
import page from 'page';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import Gridicon from 'gridicons';
import { stringify } from 'qs';

/**
 * Internal dependencies
 */
import config from 'config';
import FormsButton from 'components/forms/form-button';
import FormInputValidation from 'components/forms/form-input-validation';
import Card from 'components/card';
// import { fetchMagicLoginRequestEmail } from 'state/login/magic-login/actions';
import FormPasswordInput from 'components/forms/form-password-input';
import FormTextInput from 'components/forms/form-text-input';
// import getInitialQueryArguments from 'state/selectors/get-initial-query-arguments';
import { getCurrentUserId } from 'state/current-user/selectors';
import { getCurrentOAuth2Client } from 'state/ui/oauth2-clients/selectors';
import {
	formUpdate,
	getAuthAccountType,
	loginUser,
	resetAuthAccountType,
} from 'state/login/actions';
import { login } from 'lib/paths';
import { preventWidows } from 'lib/formatting';
// import { recordTracksEventWithClientId as recordTracksEvent } from 'state/analytics/actions';
import {
	getAuthAccountType as getAuthAccountTypeSelector,
	getRedirectToOriginal,
	getRequestError,
	getSocialAccountIsLinking,
	getSocialAccountLinkEmail,
	getSocialAccountLinkService,
	isFormDisabled as isFormDisabledSelector,
} from 'state/login/selectors';
import { isPasswordlessAccount, isRegularAccount } from 'state/login/utils';
import Notice from 'components/notice';
import SocialLoginForm from './social';

export class LoginForm extends Component {
	shouldUseRedirectLoginFlow() {
		const { oauth2Client } = this.props;
		// If calypso is loaded in a popup, we don't want to open a second popup for social login
		// let's use the redirect flow instead in that case
		const isPopup = typeof window !== 'undefined' && window.opener && window.opener !== window;
		// disable for oauth2 flows for now
		return ! oauth2Client && isPopup;
	}
	render() {
		return(
				<div className="login__form-social">
					<Card>
						<SocialLoginForm
							onSuccess={ this.props.onSuccess }
							socialService={ this.props.socialService }
							socialServiceResponse={ this.props.socialServiceResponse }
							linkingSocialService={
								this.props.socialAccountIsLinking ? this.props.socialAccountLinkService : null
							}
							uxMode={ this.shouldUseRedirectLoginFlow() ? 'redirect' : 'popup' }
						/>
					</Card>
				</div>
			)
	}
}

export default LoginForm;