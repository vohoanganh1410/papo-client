/** @format */

import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import React from 'react';

import { preload } from 'sections-preload';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';
import styles from './style.scss';

class SidebarButton extends React.Component {
	static propTypes = {
		href: PropTypes.string,
		onClick: PropTypes.func,
		preloadSectionName: PropTypes.string,
	};

	_preloaded = false;

	preload = () => {
		if ( ! this._preloaded && this.props.preloadSectionName ) {
			this._preloaded = true;
			preload( this.props.preloadSectionName );
		}
	};

	render() {
		if ( ! this.props.href ) {
			return null;
		}

		return (
			<UnstyledButton className={ styles.sidebar__button } onClick={ this.props.onClick }>
				<Icon type="plus_thick" />
			</UnstyledButton>
		);
	}
}

export default localize( SidebarButton );
