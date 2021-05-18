/** @format */

/**
 * External dependencies
 */

import React from 'react';

import styles from './style.scss';

const SidebarHeading = ( { children, onClick } ) => (
	<h2 className={styles.sidebar__heading} onClick={ onClick }>
		{ children }
	</h2>
);

export default SidebarHeading;
