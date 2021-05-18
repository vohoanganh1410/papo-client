import React from 'react';

import g_styles from 'components/general-styles.scss';

export default class LoadingScreen extends React.Component {
	render() {
		return (
			<div className={ g_styles.full_width_and_height }>
				<div className="loading_welcome">
					{ /*<div id="self_help_link_div" style={ { opacity: 1 } }><a href="/help" target="_blank">Trung tâm trợ giúp.</a></div>*/ }
					<div className="loading_message">
						{ /*
							<img className="loading_message_attribution_img" src="/papo/i/favicons/android-chrome-192x192.png"/>
						<p id="loading_welcome_msg">
							Đang tải dữ liệu, vui lòng chờ...
						</p>
						<p className="loading_message_attribution">– Papo v1.0</p>
							 */ }

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
						<p className="loading_message_attribution">Đang tải dữ liệu</p>
					</div>
				</div>
			</div>
		);
	}
}
