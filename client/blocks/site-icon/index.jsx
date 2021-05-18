/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import classNames from 'classnames';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */

 class SiteIcon extends React.Component {
	render() {
		const classes = classNames( 'site-icon', {
			'is-blank': true,
			'is-transient': false,
		} );

		const { size } = this.props;
		// if( ! size ) {
		// 	size = 32;
		// } 

		const style = {
			height: size,
			width: size,
			lineHeight: size + 'px',
			fontSize: size + 'px',
		};
		return (
			<div className={ classes } style={ style }>
				<Gridicon icon="multiple-users" size={ size ? Math.round( size / 1.3 ) : Math.round( 32 / 1.3 ) } />
			</div>
		);
	}
 }

export default SiteIcon;