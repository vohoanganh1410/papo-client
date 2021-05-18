import React from 'react';

class PageSelectPlaceholder extends React.PureComponent {

	render() {
		return(
			<div className="placeholder">
				<div className="placeholder_shimmer_clipper">
					<div className="placeholder_shimmer_bg_page_wrapper">
						<div className="placeholder_shimmer_bg"></div>
					</div>
				</div>
			</div>
		)
	}
}

export default PageSelectPlaceholder;