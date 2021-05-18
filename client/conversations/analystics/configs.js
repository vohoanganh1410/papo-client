var sanitise = function sanitise(str) {
	return typeof str === 'string' ? str.replace(/</g, '&lt;').replace(/>/g, '&gt;') : str;
};

export const timeseriesDaysConfigs = {
	transition: {
		duration: 350
	},
	padding: {
		left: 50,
		right: 20
	},
	axis: {
		x: {
			padding: {
				left: 0,
				right: 0,
			},
			type: "timeseries",
			tick: {
				width: 55,
				multiline: true,
				outer: false,
				// fit: true,
				format: '%d/%m',
				culling: {
					max: 15,
					min: 10
				}
			},
			height: 50
		},
		y: {
			padding: 0,
			tick: {
				outer: false,
			},
			min: 0,
		},
		y2: {
			show: true,
			tick: {
				outer: false,
				format: function e() {}
			}
		}
	},
	grid: {
		lines: {
			front: false
		},
		y: {
			show: true
		},
		x: {
			show: true
		}
	},
	point: {
		r: 3,
	},
	tooltip: {
		show: true,
		contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
			// var defaultContent = this.getTooltipContent(d, defaultTitleFormat, defaultValueFormat, color);
			var $$ = this,
				config = $$.config,
				titleFormat = config.tooltip_format_title || defaultTitleFormat,
				nameFormat = config.tooltip_format_name || function (name) {
					return name;
				},
				valueFormat = config.tooltip_format_value || defaultValueFormat,
				text,
				i,
				title,
				value,
				name,
				bgcolor;

			var tooltipSortFunction = this.getTooltipSortFunction();
			if (tooltipSortFunction) {
				d.sort(tooltipSortFunction);
			}

			for (i = 0; i < d.length; i++) {
				if (!(d[i] && (d[i].value || d[i].value === 0))) {
					continue;
				}

				if (!text) {
					title = sanitise(titleFormat ? titleFormat(d[i].x) : d[i].x);
					text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
				}

				value = sanitise(valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index, d));
				if (value !== undefined) {
					// Skip elements when their name is set to null
					if (d[i].name === null) {
						continue;
					}
					name = sanitise(nameFormat(d[i].name, d[i].ratio, d[i].id, d[i].index));
					bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

					text += "<tr class='" + $$.CLASS.tooltipName + "-" + $$.getTargetSelectorSuffix(d[i].id) + "'>";
					text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
					text += "<td class='value'>" + value + "</td>";
					text += "</tr>";
				}
			}
			// var percent = d[1].value / d[0].value;
			// text += "<tr class='" + $$.CLASS.tooltipName + "'>";
			// text += "<td class='name'>" + "Hiệu suất: " + "</td>";
			// text += "<td class='value'>" + (percent*100).toFixed(2) + "%" + "</td>";
			// text += "</tr>";
			return text + "</table>";
		}

	},
	legend: {
		show: false
	}
};

export const timeseriesDetailConfigs = {
	transition: {
		duration: 350
	},
	padding: {
		left: 50,
		right: 20
	},
	axis: {
		x: {
			padding: {
				left: 0,
				right: 0,
				top: 10,
			},
			type: "timeseries",
			tick: {
				width: 55,
				multiline: true,
				outer: false,
				// fit: true,
				format: '%H:%M',
				culling: {
					max: 15,
					min: 10
				}
			},
			height: 50
		},
		y: {
			padding: 0,
			tick: {
				outer: false,
			},
			min: 0,
		},
		y2: {
			show: true,
			tick: {
				outer: false,
				format: function e() {}
			}
		}
	},
	grid: {
		lines: {
			front: false
		},
		y: {
			show: true
		},
		x: {
			show: true
		}
	},
	point: {
		r: 3,
	},
	tooltip: {
		show: true,
		contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
			var defaultContent = this.getTooltipContent(d, defaultTitleFormat, defaultValueFormat, color);
			var $$ = this,
				config = $$.config,
				titleFormat = config.tooltip_format_title || defaultTitleFormat,
				nameFormat = config.tooltip_format_name || function (name) {
					return name;
				},
				valueFormat = config.tooltip_format_value || defaultValueFormat,
				text,
				i,
				title,
				value,
				name,
				bgcolor;

			var tooltipSortFunction = this.getTooltipSortFunction();
			if (tooltipSortFunction) {
				d.sort(tooltipSortFunction);
			}

			for (i = 0; i < d.length; i++) {
				if (!(d[i] && (d[i].value || d[i].value === 0))) {
					continue;
				}

				if (!text) {
					title = sanitise(titleFormat ? titleFormat(d[i].x) : d[i].x);
					text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
				}

				value = sanitise(valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index, d));
				if (value !== undefined) {
					// Skip elements when their name is set to null
					if (d[i].name === null) {
						continue;
					}
					name = sanitise(nameFormat(d[i].name, d[i].ratio, d[i].id, d[i].index));
					bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

					text += "<tr class='" + $$.CLASS.tooltipName + "-" + $$.getTargetSelectorSuffix(d[i].id) + "'>";
					text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
					text += "<td class='value'>" + value + "</td>";
					text += "</tr>";
				}
			}
			// var percent = d[1].value / d[0].value;
			// text += "<tr class='" + $$.CLASS.tooltipName + "'>";
			// text += "<td class='name'>" + "Hiệu suất: " + "</td>";
			// text += "<td class='value'>" + (percent*100).toFixed(2) + "%" + "</td>";
			// text += "</tr>";
			return text + "</table>";
		}

	},
	legend: {
		show: false
	}
};

export const realtimeBarChartConfig = {

	padding: {
		left: 50,
		right: 20
	},
	axis: {
		x: {
			padding: {
				left: 0,
				right: 0
			},
			type: "timeseries",
			tick: {
				width: 55,
				multiline: true,
				outer: false,
				// fit: true,
				format: '%H:%M:%S',
			},
			height: 50
		},
		y: {
			padding: 0,
			tick: {
				outer: false,
			},
			min: 0,
			max: 3,
			show: false,
		},
		y2: {
			show: false,
			tick: {
				outer: false,
				format: function e() {}
			}
		}
	},
	grid: {
		lines: {
			front: false
		},
		y: {
			show: false
		},
		x: {
			show: false
		}
	},
	bar: {
		width: 2
	},
	point: {
		r: 5,
	},
	tooltip: {
		show: true,
		contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
			var defaultContent = this.getTooltipContent(d, defaultTitleFormat, defaultValueFormat, color);
			var $$ = this,
				config = $$.config,
				titleFormat = config.tooltip_format_title || defaultTitleFormat,
				nameFormat = config.tooltip_format_name || function (name) {
					return name;
				},
				valueFormat = config.tooltip_format_value || defaultValueFormat,
				text,
				i,
				title,
				value,
				name,
				bgcolor;

			var tooltipSortFunction = this.getTooltipSortFunction();
			if (tooltipSortFunction) {
				d.sort(tooltipSortFunction);
			}

			for (i = 0; i < d.length; i++) {
				if (!(d[i] && (d[i].value || d[i].value === 0))) {
					continue;
				}

				if (!text) {
					title = sanitise(titleFormat ? titleFormat(d[i].x) : d[i].x);
					text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
				}

				value = sanitise(valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index, d));
				if (value !== undefined) {
					// Skip elements when their name is set to null
					if (d[i].name === null) {
						continue;
					}
					name = sanitise(nameFormat(d[i].name, d[i].ratio, d[i].id, d[i].index));
					bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

					text += "<tr class='" + $$.CLASS.tooltipName + "-" + $$.getTargetSelectorSuffix(d[i].id) + "'>";
					text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
					text += "<td class='value'>" + value + "</td>";
					text += "</tr>";
				}
			}
			// var percent = d[1].value / d[0].value;
			// text += "<tr class='" + $$.CLASS.tooltipName + "'>";
			// text += "<td class='name'>" + "Hiệu suất: " + "</td>";
			// text += "<td class='value'>" + (percent*100).toFixed(2) + "%" + "</td>";
			// text += "</tr>";
			return text + "</table>";
		}

	},
	legend: {
		show: false
	}
};
