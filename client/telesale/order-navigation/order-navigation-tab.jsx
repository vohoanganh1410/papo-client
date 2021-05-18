/** @format */

/**
 * External dependencies
 */

import React from 'react';
import classNames from 'classnames';

export const OrderNavigationTab = ( { children, className } ) => (
	<div className={ classNames( 'order-navigation__tab', className ) }>{ children }</div>
);

export default OrderNavigationTab;
