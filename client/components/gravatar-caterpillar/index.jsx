/** @format */
/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { noop, map, size, takeRight, filter, uniqBy } from 'lodash';

/**
 * Internal dependencies
 */
import Avatar from 'components/avatar';

class GravatarCaterpillar extends React.Component {
	static propTypes = {
		onClick: PropTypes.func,
	};

	render() {
		const { users, onClick, maxGravatarsToDisplay } = this.props;

		if ( size( users ) < 1 ) {
			return null;
		}

		const gravatarSmallScreenThreshold = maxGravatarsToDisplay / 2;

		// Only display authors with a gravatar, and only display each author once
		const displayedUsers = takeRight(
			filter( uniqBy( users, 'facebookId' ), 'facebookId' ),
			maxGravatarsToDisplay
		);
		const displayedUsersCount = size( displayedUsers );

		return (
			<div className="gravatar-caterpillar" onClick={ onClick } aria-hidden="true">
				{ map( displayedUsers, ( user, index ) => {
					let gravClasses = 'gravatar-caterpillar__gravatar';
					// If we have more than x gravs,
					// add a additional class so we can hide some on small screens
					if (
						displayedUsersCount > gravatarSmallScreenThreshold &&
						index < displayedUsersCount - gravatarSmallScreenThreshold
					) {
						gravClasses += ' is-hidden-on-small-screens';
					}

					return (
						<Avatar className={ gravClasses } key={ user.email } user={ user } size={ 32 } />
					);
				} ) }
			</div>
		);
	}
}

GravatarCaterpillar.defaultProps = {
	onClick: noop,
	maxGravatarsToDisplay: 10,
};

export default GravatarCaterpillar;
