import React from 'react';

// import Tooltip from "components/tooltip2";
import LoadingSpinner from 'components/loading/spinner';

export default class PenddingSpinner extends React.PureComponent {

	render() {
		// return(
		// 	<Tooltip
		// 		tip={ "Đang gửi..." }
		// 		position="top"
		// 	>
		// 		<div>
		// 			<LoadingSpinner className={ this.props.className } size="small"/>
		// 		</div>
		// 	</Tooltip>
		// )

		return(
			<LoadingSpinner className={ this.props.className } size="small"/>
		)
	}
}
