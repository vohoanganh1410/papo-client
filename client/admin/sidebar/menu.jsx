/** @format */

/**
 * External dependencies
 */

import React from 'react';
import classNames from 'classnames';

import styles from './style.scss';

const SidebarMenu = ( { children, className } ) => (
	<li className={ classNames( styles.sidebar__menu, className ) }>{ children }</li>
);

export default SidebarMenu;
