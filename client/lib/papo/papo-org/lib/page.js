import debugFactory from 'debug';

import Image from './page.image';
import pageGetMethods from './runtime/page.get';
import runtimeBuilder from '../utils/runtime-builder';

/**
 * Module vars
 */
const debug = debugFactory( 'papo:pages' );
const root = '/fanpages';

/**
 * Page class
 */
class Page {
	/**
	 * Create a Page instance
	 *
	 * @param {String} id - site id
	 * @param {WPCOM} wpcom - wpcom instance
	 * @return {Null} null
	 */
	constructor( id, wpcom ) {
		if ( ! ( this instanceof Page ) ) {
			return new Page( id, wpcom );
		}

		this.wpcom = wpcom;

		debug( 'set %o page id', id );
		this._id = encodeURIComponent( id );
		this.path = `${ root }/${ this._id }`;
	}

	/**
	 * Require site information
	 *
	 * @param {Object} [query] - query object parameter
	 * @param {Function} fn - callback function
	 * @return {Function} request handler
	 */
	get( query, fn ) {
		var args = {
			apiVersion: '1.0',
			path: this.path,
		};
		return this.wpcom.req.get( args, query, fn );
	}

	/**
	 * Create a `Media` instance
	 *
	 * @param {String} id - post id
	 * @return {Media} Media instance
	 */
	image( id ) {
		return new Image( id, this._id, this.wpcom );
	}

	/**
	 * Add a media from a file
	 *
	 * @param {Object} [query] - query object parameter
	 * @param {Array|String} files - media files to add
	 * @param {Function} fn - callback function
	 * @return {Function} request handler
	 */
	addMediaFiles( query, files, fn ) {
		const media = new Image( null, this._id, this.wpcom );
		return media.addFiles( query, files, fn );
	}

}

// add methods in runtime
runtimeBuilder( Page, pageGetMethods, ( methodParams, ctx ) => {
	return `/fanpages/${ ctx._id }/${ methodParams.subpath }`;
} );

export default Page;