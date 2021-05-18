import d3 from 'd3';
import moment from 'moment';

import { getNodeType, nameToInitials } from 'components/d3/utils';

export function realTimeChart() {

	var version = "0.1.0",
		datum, data,
		maxSeconds = 180, pixelsPerSecond = 10,
		svgWidth = 700, svgHeight = 550,
		margin = { top: 20, bottom: 20, left: 100, right: 30, topNav: 10, bottomNav: 20 },
		dimension = { chartTitle: 20, xAxis: 20, yAxis: 20, xTitle: 20, yTitle: 20, navChart: 70 },
		maxY = 100, minY = 0,
		chartTitle, yTitle, xTitle,
		drawXAxis = true, drawYAxis = true, drawNavChart = false,
		border,
		selection,
		barId = 0,
		txtId = 0,
		yDomain = [],
		debug = false,
		barWidth = 5,
		halted = false,
		x, y,
		xNav, yNav,
		width, height,
		widthNav, heightNav,
		xAxisG, yAxisG,
		xAxis, yAxis,
		svg,
		iconSize;

	// create the chart
	const chart = function(s) {
		selection = s;
		if (selection === undefined) {
			console.error("selection is undefined"); //eslint-disable-line
			return;
		}

		// process titles
		chartTitle = chartTitle || "";
		xTitle = xTitle || "";
		yTitle = yTitle || "";
		iconSize = iconSize || 16;

		// compute component dimensions
		var chartTitleDim = chartTitle === "" ? 0 : dimension.chartTitle,
			xTitleDim = xTitle === "" ? 0 : dimension.xTitle,
			xAxisDim = !drawXAxis ? 0 : dimension.xAxis,
			navChartDim = !drawNavChart ? 0 : dimension.navChart;

		// compute dimension of main and nav charts, and offsets
		var marginTop = margin.top + chartTitleDim;
		height = svgHeight - marginTop - margin.bottom - chartTitleDim - xTitleDim - xAxisDim - navChartDim + 30;
		heightNav = navChartDim - margin.topNav - margin.bottomNav;
		width = svgWidth - margin.left - margin.right;
		widthNav = width;


		// Define the div for the tooltip
		const div = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

		// append the svg
		svg = selection.append("svg")
			.attr("width", svgWidth)
			.attr("height", svgHeight)
			.style("border", function() {
				if (border) return "1px solid lightgray";
			});

		// create main group and translate
		const main = svg.append("g")
			.attr("transform", "translate (" + margin.left + "," + marginTop + ")");

		// define clip-path
		main.append("defs").append("clipPath")
			.attr("id", "myClip")
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", width)
			.attr("height", height);

		// create chart background
		main.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", width)
			.attr("height", height)
			.style("fill", "transparent");

		// note that two groups are created here, the latter assigned to barG;
		// the former will contain a clip path to constrain objects to the chart area; 
		// no equivalent clip path is created for the nav chart as the data itself
		// is clipped to the full time domain
		var barG = main.append("g")
			.attr("class", "barGroup")
			.attr("transform", "translate(0, 0)")
			.attr("clip-path", "url(#myClip")
			.append("g");

		var percentages = main.append("g")
			.attr("class", "percentages")
			.attr("transform", "translate(0, 0)")
			.attr("clip-path", "url(#myClip")
			.append("g");

		// add group for x axis
		xAxisG = main.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")");

		// add group for y axis
		yAxisG = main.append("g")
			.attr("class", "y axis");

		// in x axis group, add x axis title
		// xAxisG.append("text")
		// 	.attr("class", "title")
		// 	.attr("x", width / 2)
		// 	.attr("y", 25)
		// 	.attr("dy", ".71em")
		// 	.text(function(d) {
		// 		var text = xTitle === undefined ? "" : xTitle;
		// 		return text;
		// 	});

		// in y axis group, add y axis title
		// yAxisG.append("text")
		// 	.attr("class", "title")
		// 	.attr("transform", "rotate(-90)")
		// 	.attr("x", - height / 2)
		// 	.attr("y", -margin.left + 15) //-35
		// 	.attr("dy", ".71em")
		// 	.text(function(d) {
		// 		var text = yTitle === undefined ? "" : yTitle;
		// 		return text;
		// 	});

		// in main group, add chart title
		main.append("text")
			.attr("class", "chartTitle")
			.attr("x", width / 2)
			.attr("y", -20)
			.attr("dy", ".71em")
			.text(function(d) {
				return chartTitle === undefined ? "" : chartTitle;
			});

		// define main chart scales
		x = d3.time.scale().range([0, width]);
		y = d3.scale.ordinal().domain(yDomain).rangeRoundPoints([height, 0], 1)

		// define main chart axis
		xAxis = d3.svg.axis().outerTickSize(0).orient("bottom");
		yAxis = d3.svg.axis().tickSize(0).outerTickSize(0).orient("left");

		// add nav chart
		//var nav = svg.append("g")
		//  .attr("transform", "translate (" + margin.left + "," + marginTopNav + ")");

		// add nav background
		// nav.append("rect")
		//     .attr("x", 0)
		//     .attr("y", 0)
		//     .attr("width", width)
		//     .attr("height", heightNav)
		//     .style("fill", "#F5F5F5")
		//     .style("shape-rendering", "crispEdges")
		//     .attr("transform", "translate(0, 0)");

		// //add group to data items
		// var navG = nav.append("g")
		//     .attr("class", "nav");

		// add group to hold nav x axis
		// please note that a clip path has yet to be added here (tbd)
		// var xAxisGNav = nav.append("g")
		//     .attr("class", "x axis")
		//     .attr("transform", "translate(0," + heightNav + ")");

		// define nav chart scales
		xNav = d3.time.scale().range([0, widthNav]);
		yNav = d3.scale.ordinal().domain(yDomain).rangeRoundPoints([heightNav, 0], 1)

		// define nav axis
		//var xAxisNav = d3.svg.axis().orient("bottom");

		// compute initial time domains...
		var ts = new Date().getTime();

		// first, the full time domain
		var endTime = new Date(ts);
		var startTime = new Date(endTime.getTime() - maxSeconds * 1000);
		var interval = endTime.getTime() - startTime.getTime();

		// then the viewport time domain (what's visible in the main chart and the viewport in the nav chart)
		var endTimeViewport = new Date(ts);
		var startTimeViewport = new Date(endTime.getTime() - width / pixelsPerSecond * 1000);
		var intervalViewport = endTimeViewport.getTime() - startTimeViewport.getTime();
		var offsetViewport = startTimeViewport.getTime() - startTime.getTime();

		// set the scale domains for main and nav charts
		x.domain([startTimeViewport, endTimeViewport]);
		xNav.domain([startTime, endTime]);

		// update axis with modified scale
		xAxis.scale(x)(xAxisG);
		yAxis.scale(y)(yAxisG);
		//xAxisNav.scale(xNav)(xAxisGNav);

		// create brush (moveable, changable rectangle that determines the time domain of main chart)
		var viewport = d3.svg.brush()
			.x(xNav)
			.extent([startTimeViewport, endTimeViewport])
			.on("brush", function () {
				// get the current time extent of viewport
				var extent = viewport.extent();
				startTimeViewport = extent[0];
				endTimeViewport = extent[1];

				// compute viewport extent in milliseconds
				intervalViewport = endTimeViewport.getTime() - startTimeViewport.getTime();
				offsetViewport = startTimeViewport.getTime() - startTime.getTime();

				// handle invisible viewport
				if (intervalViewport === 0) {
					intervalViewport = maxSeconds * 1000;
					offsetViewport = 0;
				}

				// update the x domain of the main chart
				x.domain(viewport.empty() ? xNav.domain() : extent);

				// update the x axis of the main chart
				xAxis.scale(x)(xAxisG);

				// update display
				refresh();
			});

		// create group and assign to brush
		// var viewportG = nav.append("g")
		//     .attr("class", "viewport")
		//     .call(viewport)
		//     .selectAll("rect")
		//     .attr("height", heightNav);

		// initial invocation; update display
		data = [];


		// function to refresh the viz upon changes of the time domain
		// (which happens constantly), or after arrival of new data, or at init
		function refresh() {
			// process data to remove too late data items
			data = data.filter(function(d) {
				// console.log()
				if (d.time.getTime() > startTime.getTime()) {
					return true
				}
			});

			// determine number of categories
			var categoryCount = yDomain.length;
			if (debug) console.log("yDomain", yDomain);

			// here we bind the new data to the main chart
			// note: no key function is used here; therefore the data binding is
			// by index, which effectivly means that available DOM elements
			// are associated with each item in the available data array, from
			// first to last index; if the new data array contains fewer elements
			// than the existing DOM elements, the LAST DOM elements are removed;
			// basically, for each step, the data items "walks" leftward (each data
			// item occupying the next DOM element to the left);
			// This data binding is very different from one that is done with a key
			// function; in such a case, a data item stays "resident" in the DOM
			// element, and such DOM element (with data) would be moved left, until
			// the x position is to the left of the chart, where the item would be
			// exited
			const updateSel = barG.selectAll(".bar")
				.data(data);

			// remove items
			updateSel.exit().remove();

			let type = "path";
			// add items
			updateSel.enter()
				.append(function(d) {
					if (debug) { console.log("d", JSON.stringify(d)); } //eslint-disable-line
					if (d.type === undefined) console.error(JSON.stringify(d)); //eslint-disable-line
					type = getNodeType( d.type ) ;// ( d.type === "circle" || d.type === "rect" ) ? d.type : "path";
					return document.createElementNS("http://www.w3.org/2000/svg", type);
				})
				.attr("class", "bar")
				.attr("id", function() {
					return "bar-" + barId++;
				})
				.style('fill', function ( d, i ) {
					if ( d.type === "in" ) {
						return "#1264a3";
					} else if ( d.type === "phone" ) {
						return "#008952";
					} return "#fa3e3e";
				});

			// update items; added items are now part of the update selection
			if ( type === "circle" || type === "rect" ) {
				updateSel
					.attr("x", function(d) {
						var retVal = null;
						switch (getTagName(this)) {
							case "rect":
								var size = d.size || 6;
								retVal = Math.round(x(d.time) - size / 2);
								break;
							default:
						}
						return retVal;
					})
					.attr("y", function(d) {
						var retVal = null;
						switch (getTagName(this)) {
							case "rect":
								var size = d.size || 6;
								retVal = y(d.category) - size / 2;
								break;
							default:
						}
						return retVal;
					})
					.attr("cx", function(d) {
						var retVal = null;
						switch (getTagName(this)) {
							case "circle":
								retVal = Math.round(x(d.time));
								break;
							default:
						}
						return retVal;
					})
					.attr("cy", function(d) {
						var retVal = null;
						switch (getTagName(this)) {
							case "circle":
								retVal = y(d.category);
								break;
							default:
						}
						return retVal;
					})
					.attr("r", function(d) {
						var retVal = null;
						switch (getTagName(this)) {
							case "circle":
								retVal = d.size / 2;
								break;
							default:
						}
						return retVal;
					})
					.attr("width", function(d) {
						var retVal = null;
						switch (getTagName(this)) {
							case "rect":
								retVal = d.size;
								break;
							default:
						}
						return retVal;
					})
					.attr("height", function(d) {
						var retVal = null;
						switch (getTagName(this)) {
							case "rect":
								retVal = d.size;
								break;
							default:
						}
						return retVal;
					})
					// .style("fill", function(d) { return d.color || "black"; })
					// .style("stroke", "orange")
					// .style("stroke-width", "1px")
					// .style("stroke-opacity", 0.8)
					.style("fill-opacity", function(d) { return d.opacity || 1; });
			} else {

				updateSel.attr("d", function( d, i ){
					let pathData;
					if ( d.type === "in" ) {
						const xStart = 0, yStart = y(d.category) - 16 / 2;
						const size = iconSize;

						pathData = "M " + xStart + " " + (yStart + size/2) + " " +
							"L " + xStart + " " + (yStart + size/2) + " " +
							"L " + (xStart + size) + " " + (yStart + size/2) + " " +
							"L " + (xStart + size/2) + " " + (yStart + size) + " z";
					} else if ( d.type === "out" ) {
						const xStart = 0, yStart = y(d.category) - 16 / 2;
						const size = iconSize;

						pathData = "M " + xStart + " " + (yStart + size/2) + " " +
							"L " + xStart + " " + (yStart + size/2) + " " +
							"L " + (xStart + size) + " " + (yStart + size/2) + " " +
							"L " + (xStart + size/2) + " " + yStart + " z";
					} else if ( d.type === "phone" ) {
						pathData = "M7.711087074383371,0 C3.459288145078944,0 0.00004974793629576506,3.459238397142649 0.00004974793629576506,7.711037326447075 c0,1.3276394701187144 0.34297352978066803,2.6331516157354486 0.9933827651418564,3.7851135398081506 L0.012454460157101999,14.996291287477288 c-0.03218519927560528,0.1149950349117978 -0.001005787477362665,0.23837163213495124 0.08213931065128417,0.32386356771077723 C0.15862890686714218,15.386201566201551 0.24579715490524012,15.42207465289415 0.3353122403905169,15.42207465289415 c0.026820999396337735,0 0.053977261285129634,-0.0033526249245422086 0.08046299818901301,-0.009722612281172426 l3.653020117781188,-0.904873467133942 C5.184213668755909,15.106257385002275 6.440442227981874,15.42207465289415 7.711087074383371,15.42207465289415 c4.251798929304426,0 7.711037326447075,-3.459238397142649 7.711037326447075,-7.711037326447075 S11.9628860036878,0 7.711087074383371,0 zM11.590074112078703,10.432027715205528 c-0.16494914628747673,0.45662751472264906 -0.9561686284794375,0.8733587928432454 -1.3363562949225238,0.9293476290830996 c-0.34129721731839674,0.04995411137567903 -0.7731153075994334,0.07141091089274916 -1.2471764719297016,-0.07744563575692519 c-0.28731995603326743,-0.09052087296263972 -0.6561086977329105,-0.2105448452612509 -1.1284935496009072,-0.41203760322623734 c-1.9857597428063496,-0.8468730559393619 -3.2825550636192737,-2.821233874002267 -3.3817927613857246,-2.9516509835669593 C4.3973525989658535,7.789824012173816 3.687937164932724,6.860476383090718 3.687937164932724,5.898608292239559 s0.5112753009926875,-1.4349234677040645 0.6929875719028746,-1.6307167632973292 c0.18171227091018782,-0.1957932955932651 0.3959450035884354,-0.24474161949158157 0.5280384256153985,-0.24474161949158157 s0.2638515815614718,0.0016763124622711078 0.3795171414581778,0.007040512341538658 c0.12170028476088222,0.006034724864175973 0.28497311858608804,-0.04593096146622828 0.44556385247165997,0.3355977549466753 c0.16494914628747673,0.39158659118653016 0.5608941498759121,1.3534546820376891 0.6098424737742275,1.4516865923267754 c0.04961884888322481,0.09789664779663272 0.08247457314373836,0.2122211577235221 0.01676312462271106,0.3426382672882141 c-0.06571144852102735,0.13041710956469202 -0.09856717278154097,0.21188589523106796 -0.19780487054799029,0.3262104051579572 s-0.207862745321617,0.2547994942652081 -0.29704256831444004,0.3426382672882141 c-0.09923769776644935,0.09756138530417825 -0.20216328294989527,0.2031690704272579 -0.08683298554564321,0.39896236602052304 c0.11533029740425213,0.1957932955932651 0.5126163509625038,0.8358093936883728 1.1013372877121157,1.354125207022597 c0.7560169204842666,0.6658313100140822 1.3940214436246503,0.8723530053658823 1.5918263141726399,0.9702496531625158 c0.19780487054799029,0.09789664779663272 0.3134704304446965,0.08146878566637583 0.42880072784894885,-0.04894832389831634 c0.11533029740425213,-0.13075237205714632 0.49484743886243027,-0.5709520246495384 0.6266055983969389,-0.7664100577503483 s0.2638515815614718,-0.16327283382520558 0.44556385247165997,-0.09789664779663272 c0.18171227091018782,0.06504092353611894 1.1549792865047903,0.5377610378965698 1.352784157052781,0.6356576856932026 c0.19780487054799029,0.09789664779663272 0.32989829257495334,0.14684497169494878 0.3795171414581778,0.22831375736132467 C11.755023258366178,9.584148871788804 11.755023258366178,9.975735462975337 11.590074112078703,10.432027715205528 z";
					}

					return pathData;
				})
					.attr("transform", function(d, i) {
						const yAdd = d.type === "phone" ? 50 : 0;
						return "translate("+(Math.round(x(d.time)))+","+(yAdd)+")";
					})
					.on("mouseover", function(d) {
						div.transition()
							.duration(200)
							.style("opacity", .9);
						div.html(moment(d.time).format("HH:mm:ss") + "<br/>" + "Name: " + d.userName + "<br/>" + "Phone: " + d.phoneNumber)
							.style("left", (d3.event.pageX) + "px")
							.style("top", (d3.event.pageY - 28 - 40) + "px");
					})
					.on("mouseout", function(d) {
						div.transition()
							.duration(500)
							.style("opacity", 0);
					});
			}


			const percentagesUpdate = percentages.selectAll(".txt")
				.data(data);

			// remove items
			percentagesUpdate.exit().remove();

			percentagesUpdate.enter().append( "text" )
				.attr("class", "txt")
				.attr("id", function() {
					return "txt-" + txtId++;
				})
				.attr("fill","#262626")
				.text(function ( d ){
					return d.userName
				})
				.style("font-size", "12px");


			if ( type !== "circle" || type !== "rect" ) {
				percentagesUpdate.attr("transform", function( d ) {
					const yStart = y(d.category) - 16 / 2;
					return "translate("+(Math.round(x(d.time)) + 12)+","+(yStart)+")  rotate(270)";
				})
				.text(function ( d ){
					if (d.time.getTime() < ( new Date().getTime() - 3500 )) {
						return nameToInitials( d.userName );
					}
					return d.userName
				})
			}

			// refresh();

			// create update selection for the nav chart, by applying data
			// var updateSelNav = navG.selectAll("circle")
			//     .data(data);

			// // remove items
			// updateSelNav.exit().remove();

			// // add items
			// updateSelNav.enter().append("circle")
			//     .attr("r", 1)
			//     .attr("fill", "black")

			// added items now part of update selection; set coordinates of points
			// updateSelNav
			//     .attr("cx", function(d) {
			//       return Math.round(xNav(d.time));
			//     })
			//     .attr("cy", function(d) {
			//       return yNav(d.category);
			//     })

		} // end refreshChart function


		function getTagName(that) {
			var tagName = d3.select(that).node().tagName;
			return (tagName);
		}


		// function to keep the chart "moving" through time (right to left)
		setInterval(function() {

			if (halted) return;

			// get current viewport extent
			var extent = viewport.empty() ? xNav.domain() : viewport.extent();
			var interval = extent[1].getTime() - extent[0].getTime();
			var offset = extent[0].getTime() - xNav.domain()[0].getTime();

			// compute new nav extents
			endTime = new Date();
			startTime = new Date(endTime.getTime() - maxSeconds * 1000);

			// compute new viewport extents
			startTimeViewport = new Date(startTime.getTime() + offset);
			endTimeViewport = new Date(startTimeViewport.getTime() + interval);
			viewport.extent([startTimeViewport, endTimeViewport]);

			// update scales
			x.domain([startTimeViewport, endTimeViewport]);
			xNav.domain([startTime, endTime]);

			// update axis
			xAxis.scale(x)(xAxisG);
			//xAxisNav.scale(xNav)(xAxisGNav);

			// refresh svg
			refresh();

		}, 100);

		// end setInterval function

		return chart;

	}; // end chart function


	// chart getters/setters

	// new data item (this most recent item will appear
	// on the right side of the chart, and begin moving left)
	chart.datum = function(_) {
		if (arguments.length === 0) return datum;
		datum = _;
		data.push(datum);
		return chart;
	};

	// svg width
	chart.width = function(_) {
		if (arguments.length === 0) return svgWidth;
		svgWidth = _;
		return chart;
	};

	// svg height
	chart.height = function(_) {
		if (arguments.length === 0) return svgHeight;
		svgHeight = _;
		return chart;
	};

	// svg border
	chart.border = function(_) {
		if (arguments.length === 0) return border;
		border = _;
		return chart;
	};

	// chart title
	chart.title = function(_) {
		if (arguments.length === 0) return chartTitle;
		chartTitle = _;
		return chart;
	};

	// x axis title
	chart.xTitle = function(_) {
		if (arguments.length === 0) return xTitle;
		xTitle = _;
		return chart;
	};

	// y axis title
	chart.yTitle = function(_) {
		if (arguments.length === 0) return yTitle;
		yTitle = _;
		return chart;
	};

	chart.iconSize = function(_) {
		if (arguments.length === 0) return iconSize;
		iconSize = _;
		return chart;
	};

	// yItems (can be dynamically added after chart construction)
	chart.yDomain = function(_) {
		if (arguments.length === 0) return yDomain;
		yDomain = _;
		if (svg) {
			// update the y ordinal scale
			y = d3.scale.ordinal().domain(yDomain).rangeRoundPoints([height, 0], 1);
			// update the y axis
			yAxis.scale(y)(yAxisG);
			// update the y ordinal scale for the nav chart
			//yNav = d3.scale.ordinal().domain(yDomain).rangeRoundPoints([heightNav, 0], 1);
		}
		return chart;
	};

	// debug
	chart.debug = function(_) {
		if (arguments.length === 0) return debug;
		debug = _;
		return chart;
	};

	// halt
	chart.halt = function(_) {
		if (arguments.length === 0) return halted;
		halted = _;
		return chart;
	}

	// version
	chart.version = version;

	return chart;

} // end realTimeChart function
