/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { identity, isEqual, find, replace, some, isFunction, get } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import FoldableCard from 'components/foldable-card';
import Avatar from 'components/avatar';
import InviteAction from './invite-action';
import { acceptInvite } from 'lib/invites/actions';

export class MeInvite extends Component {
	state = { submitting: false };

	/**
	 * Triggers an action based on the current connection status.
	 */
	performAction = () => {
		this.setState( { submitting: true } );
		this.props.acceptInvite( this.props.invite, error => {
			if ( error ) {
				console.log( error );
				this.setState( { submitting: false } );
			} else if ( get( this.props, 'invite.site.is_vip' ) ) {
				// window.location.href = this.props.redirectTo;
			} else {
				// page( this.props.redirectTo );
			}
		} );
	};
	renderSiteName( site ) {

		if ( ! site ) {
			return null;
		}
		return (
			<span> trên Site: <strong>{ site.full_name }</strong></span>
		)
	}
	renderInviteMessage( invite ) {
		return (
			<span>{ invite.message }</span>
		)
	}
	render() {

		const { invite, translate, moment } = this.props;
		if ( !invite ) {
			return null;
		}
		const header = (
			<div>
				<div className="sharing-service__logo">
					<Avatar user={ invite.invited_by } />
				</div>
				

				<div className="sharing-service__name">
					<h2>{ invite.invited_by.displayName }</h2>
					<p className="sharing-service__description">
						{ 
							translate( 'mời bạn tham gia với vai trò ' ) + invite.role
						}
						{
							this.renderSiteName( invite.site_Id )
						}
					</p>
				</div>
			</div>
		);
		const action = (
			<InviteAction
				status={ invite.is_pending }
				onAction={ this.performAction }
				sending={ this.state.submitting }
			/>
		);
		return (
			<li>
				<FoldableCard
					className={ 'sharing-service' }
					header={ header }
					clickableHeader
					compact
					summary={ action }
					expandedSummary={ action }
				>
					<div
						className={ classnames( 'sharing-service__content', {
							'is-placeholder': /*this.props.isFetching*/false,
						} ) }
					>
						<div>
							{ this.renderInviteMessage( invite ) }
						</div>
						{ translate( 'Gửi lúc: ' ) +  moment( invite.invite_date ).format( 'LLL' ) }
					</div>
					
				</FoldableCard>

			</li>
		)
	}
}

export default connect( null, dispatch => bindActionCreators( { acceptInvite }, dispatch ) )(
	localize( MeInvite )
);