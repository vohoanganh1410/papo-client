import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { bindAll, isEqual } from 'lodash';
import c3 from 'c3';
import d3 from 'd3';

import {
	getGraphAttribute,
	getLegendAttribute,
	dynamicAttributes,
} from './utils';

class RealtimeChart extends React.PureComponent {
	static propTypes = {
		/**
		 * Data of chart
		 */
		data: PropTypes.object.isRequired,

		/**
		 * name of this chat, using non empty string, e.g: "analystics-chart-overview", "analystics-chat-users"
		 */
		name: PropTypes.string.isRequired,

		hideGraphData: PropTypes.bool,

		defaultConfig: PropTypes.object.isRequired,

	};

	static defaultProps = {
		hideGraphData: false,
	};

	constructor( props ) {
		super( props );
		// console.log("props", props);

		this.chart = null;
		bindAll( this, [ "updateChart", "loadNewData", "generateChart" ] );

		this.state = {
			data: props.data
		}
	}

	componentDidMount() {
		const { defaultConfig } = this.props;
		const config = Object.assign( {}, { data: this.state.data }, { name: this.props.name }, defaultConfig );
		this.updateChart( config );
	}

	componentWillReceiveProps( newProps ) {
		console.log("newProps", newProps);
		if ( newProps.data && !isEqual(newProps.data, this.props.data) ) {
			this.setState( {
				data: newProps.data,
			} );
		}
		this.updateChart( newProps );

	}

	generateChart( mountNode, config ) {
		const newConfig = Object.assign( { bindto: mountNode }, config );
		return this.chart = c3.generate( newConfig );
	}

	loadNewData(data) {
		this.chart.load(data);
	}

	updateChart( config ) {
		if ( !this.chart ) {
			this.chart = this.generateChart( d3.select( "[" + getGraphAttribute( this.props.name ) + "]" ), config );
		}

		this.loadNewData( config.data );
	}

	render() {
		const classes = classNames( "ent_infographic_container", this.props.className );
		const style = this.props.style
			? this.props.style
			: {};
		return(
			<div className={ classes } style={ style }>
				<div { ...dynamicAttributes( "data-infographic-graph-" + this.props.name, "" ) }>
					<div className="position_relative">
						<div id={ this.props.name } className="ent_graph__svg_container" { ...dynamicAttributes( getGraphAttribute( this.props.name ), "" ) }/>
					</div>
				</div>
				<div className="ent_graph__legend_container" { ...dynamicAttributes( getLegendAttribute( this.props.name ), "" ) }>
					<div className="legend ent_graph__legend">

					</div>
				</div>
			</div>
		)
	}
}

export default RealtimeChart;
