import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, omit } from 'lodash';

import BaseButton from './base-button';
import styles from './style.scss';

class UnstyledButton extends React.PureComponent {
	static propTypes = {
		className: PropTypes.string,
	};
	static defaultProps = {
		className: undefined,
		onMouseEnter: noop,
		onMouseLeave: noop,
		onFocus: noop,
		onBlur: noop,
	};

	render() {
		const r = this.props,
			t = r.className,
			n = omit( r, [ 'className' ] );

		return React.createElement(
			BaseButton,
			Object.assign( {}, n, {
				className: classNames( styles.c_button_unstyled, t ),
			} )
		);
	}
}

export default UnstyledButton;
