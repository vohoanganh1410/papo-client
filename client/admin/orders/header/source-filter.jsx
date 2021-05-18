import React from 'react';
import PropTypes from 'prop-types';

import VirtualizedSelect from 'components/virtualized-select';

export default class SourceFilter extends React.PureComponent {

	static propTypes = {
		sources: PropTypes.arrayOf( PropTypes.object ),
	};

	constructor( props ) {
		super( props );

		this.state = {
			selectedOption: null,
		}
	}

	render() {
		return(
			<VirtualizedSelect className={ this.props.className } noSelectText={ "Nguồn..." }/>
		)
	}
}
