import React from 'react';
import { noop } from 'lodash';

import styles from './style.scss';

class Content extends React.PureComponent {
	static displayName = 'Content';
	static defaultProps = {
		children: null,
		role: 'presentation',
		onScroll: noop,
	};

	render() {
		const { onScroll, width, role } = this.props;

		return (
			<div
				onScroll={ onScroll }
				role={ role }
				className={ styles.c_scrollbar__child }
				style={ { width: width } }
			>
				{ this.props.children }
			</div>
		);
	}
}

export default Content;
