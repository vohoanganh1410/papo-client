import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, bindAll, get, keys, values, forEach, isEqual } from 'lodash';
import c3 from 'c3';
import d3 from "d3";

import {
	getGraphAttribute,
	getLegendAttribute,
	dynamicAttributes,
} from './utils';

var e = {
    primary: {
        hex: "#2AB27B",
        class: "seafoam_green"
    },
    secondary: {
        hex: "#2D9EE0",
        class: "fill_blue"
    },
    tertiary: {
        hex: "#F04C58",
        class: "ent_red"
    }
};
var t = {
    primary: {
        hex: "#2D9EE0",
        class: "fill_blue"
    },
    secondary: {
        hex: "#005E99",
        class: "hover_blue"
    },
    tertiary: {
        hex: "#F04C58",
        class: "ent_red"
    }
};
var a = {
    primary: {
        hex: "#7F5AC8",
        class: "ent_violet"
    },
    secondary: {
        hex: "#2C2D30",
        class: "sk_black"
    },
    tertiary: {
        hex: "#F04C58",
        class: "ent_red"
    }
};
var n = function e(t, a, n, r) {
    if (!a) return {
        id: "graph_summary",
        component: n,
        selector: "[" + r + "]",
        data: {
            data_points: get(t, "summary", []),
            date_range_label: get(t, "summary_date_range_label")
        }
    };
    return []
};

function r(e) {
    var t = {};
    t.graph_colors = i(get(e, "color"), get(e, "columns.data"));
    t.timeseries = get(e, "timeseries");
    t.columns = get(e, "columns");
    t.annotations = get(e, "columns.annotation_id");
    t.y_type = get(e, "y_type");
    t.tooltips = get(e, "tooltips");
    t.y_max = get(e, "y_max");
    t.hide_graph_data = get(e, "hide_graph_data");
    t.x_tick_max = get(e, "x_tick_max");
    t.is_team_overview = get(e, "is_team_overview");
    t.team_overview_id = get(e, "team_overview_id");
    t.selected_tab = get(e, "selected_tab");
    t.graph_id = get(e, "graph_id");
    t.is_team = get(e, "is_team");
    return t
}

function i(e, t) {
    var a = s(e);
    var n = {};
    forEach(t, function (e, t) {
        n[e[0]] = 0 === t ? a.primary.hex : 1 === t ? a.secondary.hex : a.tertiary.hex
    });
    return n
}

function s(n) {
    switch (n) {
        case "green":
            return e;
        case "blue":
            return t;
        case "violet":
            return a;
        default:
            return e
    }
}

function o(e) {
    return s(e).primary.class
}

var v = function e(t, a, n) {
    a.on("click", function (e) {
        t.toggle(e)
        d3.select("[" + n + "]").select("[data-id=" + e + "]").selectAll("circle, text").classed("ent_graph__legend_item--defocus", !a)
    })
    .on('mouseover', function(id) {
        t.focus(id);
    })
    .on('mouseout', function(id) {
        t.revert();
    })
};

var m = function e(t) {
    d3.select("[" + t + "]").selectAll(".legend div svg g").each(function () {
        var e = d3.select(this).select("rect");
        e.attr("width", 0);
        e.attr("height", 0);
        var t = this.getBBox().width;
        var a = this.getBBox().height;
        this.parentNode.setAttribute("height", a);
        this.parentNode.setAttribute("width", t);
        e.attr("width", t);
        e.attr("height", a)
    })
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

function restyleChart( _chart, config ) {
    forEach( [ config.data.names ], ( chart ) => {
        var a, l;
        var i = chart;
        var s = keys( i );
        var container = getGraphAttribute( config.name );
        var c = getLegendAttribute( config.name ); // get( configs, "legend_selector" );

        forEach( s, id => {
            var allPoints = d3.select( "[" + container + "]" )
                .selectAll(".c3-circles-" + id + " circle");

            allPoints.each( ( point ) => {
            	// console.log("point");
                var y = get( allPoints, [ 0, point.index ] );
                d3.select(y)
                .attr("r", 3)
                .classed("ent_graph__point", true)
                .style("stroke", config.data.colors[id]);
            } )

        } )

        if ( d3.select( "[" + c + "]" ).select( '.ent_graph__legend' ).empty() ) {
            l = d3.select( "[" + c + "]" ).insert("div").attr("class", "legend ent_graph__legend").selectAll("div").data(s);
        } else {
            l = d3.select( "[" + c + "]" ).select("div .ent_graph__legend").selectAll("div").data(s).attr("class", "ent_graph__legend_item").attr("data-name", function (e) {
                return "ent-graph-legend-item-" + e
            }).attr("data-id", function (e) {
                return e
            }).classed("ent_graph__legend_item--defocus", function (e) {
                return false; //_.includes(t.internal.hiddenTargetIds, e)
            });
            l.select("svg g text").text(function (e) {
                return i[e]
            })
        }

        a = l.enter().append("div").attr("class", "ent_graph__legend_item").attr("data-name", function (e) {
            return "ent-graph-legend-item-" + e
        }).attr("data-id", function (e) {
            return e
        }).classed("ent_graph__legend_item--defocus", function (e) {
            return true;//_.includes(t.internal.hiddenTargetIds, e)
        }).append("svg").append("g");
        // _.get(n, "hide_graph_data") ? b(t, a, c) : v(t, a, c);
        a.on("click", e => {
            _chart.toggle(e)
            var shown = _chart.data.shown( e ).length === 1;
            d3.select( "[" + c + "]" ).select("[data-id=" + e + "]").selectAll("circle, text").classed("ent_graph__legend_item--defocus", !shown)
        })
        .on('mouseover', id => {
            !_chart.internal.transiting && _chart.internal.isTargetToShow(id) && _chart.focus(id);
        })
        .on('mouseout', id => {
            !_chart.internal.transiting && _chart.internal.isTargetToShow(id) && _chart.revert();
        })

        S(a, config.data);
        m(c);

        l.exit().on("click", null).on("mouseover", null).on("mouseout", null).remove();
    })
}

class Chart extends React.PureComponent {
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
        if ( newProps.data && !isEqual(newProps.data, this.props.data) ) {
            this.setState( {
                data: newProps.data,
            } );
            // TODO: need shallow compare to update chart if data change
            // and any config change
            this.updateChart( newProps );
            // if ( newProps.onPropsChanged ) {
            //     newProps.onPropsChanged(this.props, newProps, this.chart);
            // }
        }
    }

    generateChart( mountNode, config ) {
        const newConfig = Object.assign( { bindto: mountNode }, config );
        return this.chart = c3.generate( newConfig );
    }

    loadNewData(data) {
        this.chart.load(data);
    }

    updateChart( config ) {
        // console.log( "called update chart" );
        if ( !this.chart ) {
            // console.log( "create new chart" );
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

export default Chart;
