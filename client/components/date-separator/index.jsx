import React from 'react';
import classNames from 'classnames';

import styles from './style.scss';

export default class DateSeparator extends React.PureComponent {
	render() {
		const { date } = this.props;
		const dateString = date.getDate() + " Tháng " + ( date.getMonth() + 1 ) + ", " + date.getFullYear()

		return (
			<div
				className={ classNames(styles.date_separator, this.props.className) }
			>
				<hr className={styles.separator__hr}/>
				<div className={ classNames(styles.separator__text, this.props.className) }>
					<span>{ dateString }</span>
				</div>
			</div>
		);
	}
}

