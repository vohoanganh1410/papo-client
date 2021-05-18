/** @format */

/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { localize } from 'i18n-calypso';
import { omit } from 'lodash';

/**
 * Internal dependencies
 */
import formatNumberCompact from 'lib/format-number-compact';
import styles from './style.scss';

export const Count = ( { count, className, compact, numberFormat, primary, ...inheritProps } ) => {
	return (
		// Omit props passed from the `localize` higher-order component that we don't need.
		<span
			className={ classnames( className, styles.count, {
				[ styles.is_primary ]: primary,
				[ styles.is_scary ]: count === 0,
			} ) }
			{ ...omit( inheritProps, [ 'translate', 'moment' ] ) }
		>
			{ compact ? formatNumberCompact( count ) || numberFormat( count ) : numberFormat( count ) }
		</span>
	);
};

Count.propTypes = {
	count: PropTypes.number.isRequired,
	numberFormat: PropTypes.func,
	primary: PropTypes.bool,
	compact: PropTypes.bool,
};

Count.defaultProps = {
	primary: false,
	compact: false,
};

export default localize( Count );
