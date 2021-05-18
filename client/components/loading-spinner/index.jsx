import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class LoadingSpinner extends React.PureComponent {
	static propTypes = {
		size: PropTypes.oneOf( [ 'small', 'medium', 'large' ] ),
	};
	static defaultProps = {
		size: 'small',
	};

	render() {
		const classes = classnames( 'infinite_spinner', {
			infinite_spinner_small: this.props.size === 'small',
			infinite_spinner_medium: this.props.size === 'medium',
			infinite_spinner_large: this.props.size === 'large',
		} );

		return (
			<div className={ classes } data-qa="infinite_spinner">
				<svg className="infinite_spinner_spinner infinite_spinner_fast" viewBox="0 0 100 100">
					<circle className="infinite_spinner_bg" cx="50%" cy="50%" r="35" />
					<circle
						className="infinite_spinner_path infinite_spinner_blue"
						cx="50%"
						cy="50%"
						r="35"
					/>
				</svg>
				<svg
					className="infinite_spinner_spinner infinite_spinner_tail infinite_spinner_fast"
					viewBox="0 0 100 100"
				>
					<circle
						className="infinite_spinner_path infinite_spinner_blue"
						cx="50%"
						cy="50%"
						r="35"
					/>
				</svg>
			</div>
		);
	}
}

export default LoadingSpinner;
