/* eslint-disable no-console */

require( '@babel/polyfill' );
// import "@babel/polyfill";

/**
 * External dependencies.
 */
var boot = require( './boot' ),
	path = require( 'path' ),
	chalk = require( 'chalk' ),
	fs = require( 'fs' );

/**
 * Internal dependencies
 */
const pkg = require( '../package.json' ),
	config = require( 'config' );

var start = Date.now(),
	port = config( 'port' ) || process.env.PORT,
	host = config( 'hostname' ) || process.env.HOST,
	app = boot(),
	server,
	compiler,
	hotReloader;

function sendBootStatus( status ) {
	// don't send anything if we're not running in a fork
	if ( ! process.send ) {
		// console.log('Khoong cos context');
		return;
	}
	process.send( { boot: status } );
}

console.log(
	chalk.yellow( '%s booted in %dms - http://%s:%s' ),
	pkg.name,
	Date.now() - start,
	host,
	port
);

const certOptions = {
	key: fs.readFileSync( path.join( __dirname, 'ssl', 'server.key' ) ),
	cert: fs.readFileSync( path.join( __dirname, 'ssl', 'server.crt' ) ),
};

if ( process.env.NODE_ENV === 'development' ) {
	server = require( 'https' ).createServer( certOptions, app );
} else {
	server = require( 'http' ).createServer( app );
}

server.listen( { port, host }, function() {
	// Tell the parent process that Calypso has booted.
	sendBootStatus( 'ready' );
} );

// Enable hot reloader in development
if ( process.env.NODE_ENV === 'development' ) {
	console.info( chalk.cyan( '\nGetting bundles ready, hold on...' ) );

	hotReloader = require( './bundler/hot-reloader' );
	compiler = app.get( 'compiler' );

	compiler.plugin( 'compile', function() {
		sendBootStatus( 'compiler compiling' );
	} );
	compiler.plugin( 'invalid', function() {
		sendBootStatus( 'compiler invalid' );
	} );
	compiler.plugin( 'done', function() {
		sendBootStatus( 'compiler done' );
	} );

	hotReloader.listen( server, compiler );
}
