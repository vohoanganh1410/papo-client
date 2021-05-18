/** @format */

/**
 * External dependencies
 */

import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import SkipNavigation from './skip-navigation';

export default class SidebarRegion extends React.Component {
	render() {
		return(
				<div className={ classNames( 'sidebar__region', this.props.className ) }>
					<SkipNavigation skipToElementId="primary" />
					{ this.props.children }
				</div>
			)
	}
}

// const SidebarRegion = ( { children, className } ) => (
// 	<div className={ classNames( 'sidebar__region', className ) }>
// 		<SkipNavigation skipToElementId="primary" />
// 		{ children }
// 	</div>
// );

// export default SidebarRegion;
