import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './style.scss';

class LoadingSpinner extends React.PureComponent {

	static propTypes = {
		size: PropTypes.string,
		speed: PropTypes.string,
	};

	static defaultProps = {
		size: 'medium',
		speed: 'fast',
	};

	render() {
		const { size, speed } = this.props;

		const rootClasses = classNames( styles.infinite_spinner, {
			[ styles.infinite_spinner_small ]: size === 'small',
			[ styles.infinite_spinner_medium ]: size === 'medium',
			[ styles.infinite_spinner_large ]: size === 'large',
		}, this.props.className );

		const circleClasses = classNames( styles.infinite_spinner_spinner, {
			[ styles.infinite_spinner_fast ]: speed === 'fast',
		} );

		return(
			<div className={ rootClasses }>
				<svg className={ circleClasses } viewBox="0 0 100 100">
					<circle className="infinite_spinner_bg" cx="50%" cy="50%" r="35"/>
					<circle className="infinite_spinner_path infinite_spinner_blue" cx="50%" cy="50%" r="35"/>
				</svg>
				<svg className={ classNames( circleClasses, styles.infinite_spinner_tail ) }
					 viewBox="0 0 100 100">
					<circle className="infinite_spinner_path infinite_spinner_blue"
							cx="50%" cy="50%" r="35"/>
				</svg>
			</div>
		)
	}
}

export default LoadingSpinner;
