import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, omit, values, assign } from 'lodash';

import BaseButton from './base-button';
import Icon from 'components/icon2';
import styles from './style.scss';

var x = {
	primary: 'primary',
	danger: 'danger',
	outline: 'outline',
	outlinePrimary: 'outline-primary',
	outlineDanger: 'outline-danger',
	outlineTractor: 'outline-tractor',
};
var T = {
	small: 'small',
	medium: 'medium',
	large: 'large',
};

class Button extends React.PureComponent {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.node,
		type: PropTypes.oneOf( values( Object.keys( x ) ) ),
		size: PropTypes.oneOf( values( Object.keys( T ) ) ),
		disabled: PropTypes.bool,
		icon: PropTypes.string,
		ariaLabel: PropTypes.string,
		ariaHasPopup: PropTypes.bool,
		pillarClassName: PropTypes.string,
	};

	static defaultProps = {
		className: void 0,
		children: null,
		type: x.primary,
		size: T.medium,
		disabled: false,
		icon: void 0,
		onMouseEnter: noop,
		onMouseLeave: noop,
		ariaLabel: null,
		ariaHasPopup: null,
		pillarClassName: null,
	};

	render() {
		let r;
		const t = this.props,
			n = t.className,
			s = t.children,
			i = t.pillarClassName,
			u = t.type,
			c = t.size,
			d = t.disabled,
			g = t.loading,
			_ = t.icon,
			h = omit( t, [
				'className',
				'children',
				'pillarClassName',
				'type',
				'size',
				'disabled',
				'icon',
				'loading',
			] );
		const f = classNames(
			styles.c_button,
			styles[ 'c_button__' + u ],
			styles[ 'c_button__' + c ],
			{
				[ styles.c_button__disabled ]: d || g,
				[ styles.c_button__icon ]: _,
			},
			n,
			i,
			styles[ i + '__' + u ],
			styles[ i + '__' + c ],
			( ( r = {} ),
			assign( r, styles[ i + '__disabled' ], d ),
			assign( r, styles[ i + '__icon' ], _ ),
			r )
		);
		return React.createElement(
			BaseButton,
			assign( {}, h, {
				className: f,
				disabled: d || g,
			} ),
			_
				? React.createElement( Icon, {
						type: _,
				  } )
				: s
		);
	}
}

export default Button;
