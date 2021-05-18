import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Alert extends React.Component {
	static propTypes = {
		type: PropTypes.string,
		message: PropTypes.any,
	};

	static defaultProps = {
		type: 'info',
		message: 'This is default message',
	};

	render() {
		const classes = classNames( 'alert', {
			alert_info: this.props.type === 'info',
			alert_warning: this.props.type === 'warning',
			alert_success: this.props.type === 'success',
			alert_error: this.props.type === 'error',
		} );

		const iconClasses = classNames( 'ts_icon', {
			ts_icon_info: this.props.type === 'info',
			ts_icon_warning: this.props.type === 'warning',
			ts_icon_circle_checkbox_checked_o: this.props.type === 'success',
			ts_icon_question_circle: this.props.type === 'error',
		} );

		return (
			<div className={ classes } style={ this.props.style }>
				<i className={ iconClasses } />
				{ this.props.message }
			</div>
		);
	}
}

export default Alert;
