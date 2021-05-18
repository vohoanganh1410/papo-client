import React from 'react';
import classNames from 'classnames';
import styles from './style.scss';
import g_styles from 'components/general-styles.scss';

export default class JumperHelp extends React.PureComponent {
	render() {
		return (
			<div className={ classNames( styles.p_jumper__help, styles.footer ) } aria-hidden="true">
				<span className={ styles.kb_shortcuts }>
					<strong>↑</strong> <strong>↓</strong>&nbsp; lên xuống{' '}
					<strong className={ g_styles.left_margin } aria-label="Return">
						↵
					</strong>
					<small>/</small>
					<strong aria-label="Return">
						<small>TAB</small>
					</strong>
					<small>/</small>
					<strong aria-label="Return">
						<small>CLICK</small>
					</strong>
					&nbsp; Để chọn trang
					{ ! this.props.disableEsc && (
						<span>
							<strong className={ g_styles.left_margin } aria-label="Escape">
								&nbsp;ESC
							</strong>
							<small>/</small>
							<strong aria-label="Escape">
								<small>Ctrl+K</small>
							</strong>
							&nbsp; thoát
						</span>
					) }
				</span>
			</div>
		);
	}
}
