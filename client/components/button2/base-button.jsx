import React from 'react';
import PropTypes from 'prop-types';
import { noop, omit, assign } from 'lodash';

import { isFirefox } from 'lib/user-agent';
import FirefoxCombatButton from './firefox-combat-button';

const I = function e( r ) {
	return r.preventDefault();
};

class BaseButton extends React.PureComponent {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.node,
		href: PropTypes.string,
		htmlType: PropTypes.string,
		disabled: PropTypes.bool,
		onClick: PropTypes.func,
		ariaLabel: PropTypes.string,
		ariaHasPopup: PropTypes.bool,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		focused: PropTypes.bool,
	};

	static defaultProps = {
		className: undefined,
		children: undefined,
		href: undefined,
		htmlType: 'button',
		disabled: false,
		onClick: undefined,
		ariaLabel: null,
		ariaHasPopup: null,
		onFocus: noop,
		onBlur: noop,
		focused: false,
	};

	constructor( props ) {
		super( props );

		this.buttonRef = React.createRef();
	}

	componentDidMount() {
		const r = this.props.focused;
		r && this.buttonRef.current && this.buttonRef.current.focus();
	}

	componentWillReceiveProps( r ) {
		const t = this.props.focused;
		this.buttonRef.current &&
			( r.focused && ! t
				? this.buttonRef.current.focus()
				: ! r.focused && t && this.buttonRef.current.blur() );
	}

	render() {
		const r = this.props,
			t = r.className,
			n = r.children,
			s = r.href,
			i = r.htmlType,
			o = r.disabled,
			u = r.onClick,
			c = r.onFocus,
			d = r.onBlur,
			_ = r.ariaHasPopup,
			h = r.ariaLabel,
			f = r.focused,
			m = omit( r, [
				'className',
				'children',
				'href',
				'htmlType',
				'disabled',
				'onClick',
				'onFocus',
				'onBlur',
				'ariaHasPopup',
				'ariaLabel',
				'focused',
			] );
		let p;
		p = s ? 'a' : 'button';
		isFirefox && /*b.a.version < "52"*/ false && ( p = FirefoxCombatButton );
		return React.createElement(
			p,
			assign(
				{
					className: t,
					href: s,
					disabled: o,
					onClick: o ? I : u,
					onFocus: c,
					onBlur: d,
					type: i,
					'aria-haspopup': _ || null,
					'aria-label': h,
					ref: this.buttonRef,
				},
				m
			),
			n
		);
	}
}

export default BaseButton;
