/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { isFunction, noop } from 'lodash';
import Gridicon from 'gridicons';
import TranslatableString from 'components/translatable/proptype';

class MasterbarItem extends Component {
	static propTypes = {
		url: PropTypes.string,
		onClick: PropTypes.func,
		tooltip: TranslatableString,
		icon: PropTypes.string,
		className: PropTypes.string,
		isActive: PropTypes.bool,
		preloadSection: PropTypes.func,
		isLastItem: PropTypes.bool,
		usingCustomIcon: PropTypes.bool,
	};

	static defaultProps = {
		icon: '',
		onClick: noop,
	};

	_preloaded = false;

	preload = () => {
		if ( ! this._preloaded && isFunction( this.props.preloadSection ) ) {
			this._preloaded = true;
			this.props.preloadSection();
		}
	};

	render() {
		const itemClasses = classNames( 'masterbar__item', this.props.className, {
			'is-active': this.props.isActive,
		} );

		const style = this.props.isLastItem
			? {
					marginRight: 'auto',
			  }
			: {};

		return (
			<a
				data-tip-target={ this.props.tipTarget }
				href={ this.props.url }
				style={ style }
				onClick={ this.props.onClick }
				title={ this.props.tooltip }
				className={ itemClasses }
				onTouchStart={ this.preload }
				onMouseEnter={ this.preload }
			>
				{ this.props.usingCustomIcon && this.props.icon }
				{ ! this.props.usingCustomIcon && !! this.props.icon && (
					<Gridicon icon={ this.props.icon } size={ 24 } />
				) }
				<span className="masterbar__item-content">{ this.props.children }</span>
			</a>
		);
	}
}

export default MasterbarItem;
