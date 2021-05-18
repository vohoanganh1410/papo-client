import React from 'react';
import PropTypes from 'prop-types';
import {bindAll, isEqual} from "lodash";
import d3 from 'd3';

import { realTimeChart } from './lib/realtime-chart';
import {dynamicAttributes} from "components/c3/utils";
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';


export function getGraphAttribute( name ) {
	return "realtime-graph-svg-container-" + name;
}

class RealtimeChart extends React.PureComponent {

	static propTypes = {
		name: PropTypes.string.isRequired,
		config: PropTypes.object.isRequired,
	};

	constructor( props ) {
		super( props );

		this.state = {
			stop: false,
		};

		this.chart = null;
		bindAll( this, [ "updateChart", "loadNewData", "generateChart" ] );
	}

	componentDidMount() {
		const { config } = this.props;
		this.updateChart( config );
	}

	componentWillReceiveProps(nextProps) {
		if ( !isEqual( this.props.data, nextProps.data && this.chart ) ) {
			// console.log("nextProps.data", nextProps.data);
			this.chart.datum( nextProps.data );
		}
	}

	generateChart( mountNode, config ) {
		const newConfig = Object.assign( { bindTo: mountNode }, config );
		this.chart = realTimeChart()
			.title( newConfig.title )
			.iconSize( newConfig.iconSize || 16 )
			.yTitle("Categories")
			.xTitle("Time")
			.yDomain( config.categories.map( c => c.displayName ) || [] ) // initial y domain (note array)
			.border( false )
			.width(900)
			.height(500);

		// invoke the chart
		d3.select("[" + getGraphAttribute( this.props.name ) + "]").append("div")
			.attr("id", "chartDiv")
			.call(this.chart);

		return this.chart;
	}

	updateChart( config ) {
		if ( !this.chart ) {
			this.chart = this.generateChart( d3.select( "[" + getGraphAttribute( this.props.name ) + "]" ), config );
			// this.chart.yDomain(["Category1", "Category2", "Category3"])
			if ( config.categories ) {
				this.chart.yDomain( config.categories.map( c => c.displayName ) );
			}
		}
	}

	loadNewData() {

	}

	handlePlayPause = () => {
		this.setState( {
			stop: !this.state.stop,
		}, () => {
			this.chart && this.chart.halt( this.state.stop );
		} );
	};

	render() {
		return (
			<div>
				<UnstyledButton onClick={ this.handlePlayPause }>
					<Icon type={ this.state.stop ? "play" : "pause" } />
				</UnstyledButton>
				<div id={ this.props.name } { ...dynamicAttributes( getGraphAttribute( this.props.name ), "" ) }>
				</div>
			</div>
		)
	}
}

export default RealtimeChart;
