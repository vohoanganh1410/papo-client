import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { bindAll, forEach, get, keys } from 'lodash';
import c3 from 'c3';

import { pieConfigs } from './constants';

function dynamicAttributes(attribute, value){
	var opts = {};
	if(typeof value !== 'undefined' && value !== null) {
		opts[ attribute ] = value;
		return opts;
	}
	return false;
};

var S = function e(t, a) {
	var n = get(a, "colors");
	var r = get(a, "names");
	var i = false; //get(a, "hide_graph_data");
	var s = "translate(20, 10)";
	t.append("circle").attr("cx", 5).attr("cy", 5).attr("r", 5).style("fill", function (e) {
		return n[e]
	}).attr("class", "ent_graph__legend_icon");
	t.append("text").attr("transform", s).attr("class", "ent_graph__legend_text").text(function (e) {
		// console.log( n[e] );
		return r[e]
	});
	t.append("rect").attr("width", 0).attr("height", 0).attr("y", -3).style("fill-opacity", 0).classed("ent_graph__legend_event", !i).classed("ent_graph__legend_event--disabled", i)
};

function getGraphAttribute( name ) {
	return "data-ent-graph-svg-container-" + name;
}

function getLegendAttribute( name ) {
	return "data-ent-graph-legend-" + name;
}

function restyleChart( _chart, config ) {
	forEach( [ config.data.names ], ( chart ) => {
		var a, l;
		var i = chart;
		var s = keys( i );
		var container = getGraphAttribute( config.name );
		var c = getLegendAttribute( config.name ); // get( configs, "legend_selector" );

		if ( d3.select( "[" + c + "]" ).select( '.pie_graph__legend' ).empty() ) {
			l = d3.select( "[" + c + "]" ).insert("div").attr("class", "legend pie_graph__legend").selectAll("div").data(s);
		} else {
			l = d3.select( "[" + c + "]" ).select("div .pie_graph__legend").selectAll("div").data(s).attr("class", "pie_graph__legend_item").attr("data-name", function (e) {
				return "ent-graph-legend-item-" + e
			}).attr("data-id", function (e) {
				return e
			}).classed("pie_graph__legend_item--defocus", function (e) {
				return false; //_.includes(t.internal.hiddenTargetIds, e)
			});
			l.select("svg g text").text(function (e) {
				return i[e]
			})
		}

		a = l.enter().append("div").attr("class", "pie_graph__legend_item").attr("data-name", function (e) {
			return "ent-graph-legend-item-" + e
		}).attr("data-id", function (e) {
			return e
		}).classed("pie_graph__legend_item--defocus", function (e) {
			return true;//_.includes(t.internal.hiddenTargetIds, e)
		}).append("svg").append("g");
		// _.get(n, "hide_graph_data") ? b(t, a, c) : v(t, a, c);
		a.on("click", e => {
			_chart.toggle(e)
			var shown = _chart.data.shown( e ).length == 1;
			d3.select( "[" + c + "]" ).select("[data-id=" + e + "]").selectAll("circle, text").classed("pie_graph__legend_item--defocus", !shown)
		})
			.on('mouseover', id => {
				!_chart.internal.transiting && _chart.internal.isTargetToShow(id) && _chart.focus(id);
			})
			.on('mouseout', id => {
				!_chart.internal.transiting && _chart.internal.isTargetToShow(id) && _chart.revert();
			})

		S(a, config.data);

		l.exit().on("click", null).on("mouseover", null).on("mouseout", null).remove();
	})
};

class PieChart extends React.Component {
	constructor( props ) {
		super( props );

		this.chart = null;
		bindAll( this, [ "updateChart", "loadNewData", "generateChart" ] );

		this.state = {
			data: props.data
		}
	}

	componentDidMount() {
		const config = Object.assign( {}, { data: this.state.data }, { name: this.props.name }, pieConfigs );
		this.updateChart( config );
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

		if ( config.unloadBeforeLoad ) {
			this.unloadData();
		}

		this.loadNewData( config.data );

		// restyle chart
		restyleChart( this.chart, config );
	}

	render() {
		const classes = classNames( "pie_infographic_container", this.props.className );
		const style = this.props.style
			? this.props.style
			: {};

		return(
			<div className={ classes } style={ style }>
				<div className="pie_graph" { ...dynamicAttributes( "data-infographic-graph-" + this.props.name, "" ) }>
					<div className="position_relative">
						<div className="position_relative">
							<div id={ this.props.name } className="pie_graph__svg_container" { ...dynamicAttributes( getGraphAttribute( this.props.name ), "" ) }></div>
						</div>
					</div>
				</div>
				<div className="ent_graph__legend_container pie_legend" { ...dynamicAttributes( getLegendAttribute( this.props.name ), "" ) }>
					<div className="legend pie_graph__legend">

					</div>
				</div>
			</div>
		)
	}
}

export default PieChart;
