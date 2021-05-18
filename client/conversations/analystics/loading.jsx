import React from 'react';

class Loading extends React.PureComponent {

	render() {
		return(
			<div className="large_padding p-analytics_tab__loading" data-enterprise-basic-analytics-loading="">
		      <div className="infinite_spinner infinite_spinner_medium" data-qa="infinite_spinner">
		         <svg className="infinite_spinner_spinner infinite_spinner_fast" viewBox="0 0 100 100">
		            <circle className="infinite_spinner_bg" cx="50%" cy="50%" r="35"></circle>
		            <circle className="infinite_spinner_path infinite_spinner_blue" cx="50%" cy="50%" r="35"></circle>
		         </svg>
		         <svg className="infinite_spinner_spinner infinite_spinner_tail infinite_spinner_fast" viewBox="0 0 100 100">
		            <circle className="infinite_spinner_path infinite_spinner_blue" cx="50%" cy="50%" r="35"></circle>
		         </svg>
		      </div>
		   </div>
		)
	}
}

export default Loading;