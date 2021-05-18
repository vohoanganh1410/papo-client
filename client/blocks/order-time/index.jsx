/** @format */

/**
 * External dependencies
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { includes } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { getNormalizedPost } from 'state/posts/selectors';

function getDisplayedTimeFromPost( moment, post ) {
	if ( ! post ) {
		// Placeholder text: "a few seconds ago" in English locale
		return moment().fromNow();
	}

	const { status, modified, date } = post;
	const time = moment( includes( [ 'draft', 'pending' ], status ) ? modified : date );
	if ( time.isBefore( moment().subtract( 1, 'hours' ) ) ) {
		// Like "Mar 15, 2013 6:23 PM" in English locale
		return time.format( 'lll' );
	}

	// Like "3 days ago" in English locale
	return time.fromNow();
}

function getLastAssignedTimeFromPost( moment, post ) {
	if ( ! post ) {
		// Placeholder text: "a few seconds ago" in English locale
		return moment().fromNow();
	}

	const { status, modified, last_assigned_at } = post;
	if ( !last_assigned_at ) {
		return null;
	}
	const time = moment( last_assigned_at );
	// if ( time.isBefore( moment().subtract( 1, 'hours' ) ) ) {
	// 	// Like "Mar 15, 2013 6:23 PM" in English locale
	// 	return time.format( 'lll' );
	// }

	// Like "3 days ago" in English locale
	// return time.fromNow();
	return time.format( 'lll' );
}

export function OrderTime( { moment, post } ) {
	const classes = classNames( 'post-time', {
		'is-placeholder': ! post,
	} );

	if ( ! post ) {
		// Placeholder text: "a few seconds ago" in English locale
		return moment().fromNow();
	}

	const { last_assigned_at } = post;

	return <div className={ classes } >
				<span className="time">
					{ getDisplayedTimeFromPost( moment, post ) }
				</span>
				{
					last_assigned_at &&
					<span className="last-assigned-time">
						<span className="time-title">
							Phân bổ lần cuối lúc:
						</span> 
						{ getLastAssignedTimeFromPost( moment, post ) }
					</span>
				}
			</div>;
}

OrderTime.propTypes = {
	globalId: PropTypes.string,
	moment: PropTypes.func,
	post: PropTypes.object,
};

export default connect( ( state, { globalId } ) => {
	return {
		post: getNormalizedPost( state, globalId ),
	};
} )( localize( OrderTime ) );
