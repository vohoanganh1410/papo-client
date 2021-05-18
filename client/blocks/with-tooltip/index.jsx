import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from 'components/tooltip2';

export default class WithTooltip extends React.PureComponent {
	static propTypes = {
		tooltip: PropTypes.string,
		tooltipPosition: PropTypes.string,
		// contentRenderer: PropTypes.func.isRequired,
	};

	static defaultProps = {
		tooltip: '',
		tooltipPosition: 'top',
	};

	render() {
		const { tooltip, contentRenderer, tooltipPosition } = this.props;

		if ( ! tooltip || tooltip.length === 0 ) {
			return contentRenderer;
		}

		return (
			<Tooltip tip={ tooltip } position={ tooltipPosition }>
				{ contentRenderer }
			</Tooltip>
		);
	}
}
