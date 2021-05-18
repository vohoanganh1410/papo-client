import React from 'react';

// import LoadingSpinner from './spinner';

class Loading extends React.PureComponent {
	render() {
		return (
			<div className="loading_container" style={ this.props.style }>
				<div className="loading_welcome">
					<div className="loading_message">
						{ /*<p id="loading_welcome_msg">
							Đang tải dữ liệu, vui lòng chờ...
						</p>*/ }

						<div className="infinite_spinner infinite_spinner_medium">
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
						<p className="loading_message_attribution">{ this.props.text }</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Loading;
