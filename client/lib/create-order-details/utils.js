export function capitalLetter(str) {
	// escape if str has not space
	const hasWhiteSpace = /\s/g.test( str );
	if( ! hasWhiteSpace ) {
		return str;
	}
 	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}