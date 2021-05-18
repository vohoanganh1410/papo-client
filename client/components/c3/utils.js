export function getGraphAttribute( name ) {
	return "data-ent-graph-svg-container-" + name;
}

export function getLegendAttribute( name ) {
	return "data-ent-graph-legend-" + name;
}

export function dynamicAttributes(attribute, value){
	const opts = {};
	if(typeof value !== 'undefined' && value !== null) {
		opts[ attribute ] = value;
		return opts;
	}
	return false;
}
