import debugFactory from 'debug';

import Post from './site.post';
import Media from './site.media';

import siteGetMethods from './runtime/site.get';
import runtimeBuilder from '../utils/runtime-builder';
import * as OAuthToken from 'lib/oauth-token';

/**
 * Module vars
 */
const debug = debugFactory( 'papo:site' );
const root = '/sites';

/**
 * Site class
 */
class Site {
	/**
	 * Create a Site instance
	 *
	 * @param {String} id - site id
	 * @param {WPCOM} wpcom - wpcom instance
	 * @return {Null} null
	 */
	constructor( id, wpcom ) {
		if ( ! ( this instanceof Site ) ) {
			return new Site( id, wpcom );
		}

		this.wpcom = wpcom;

		debug( 'set %o site id', id );
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
			apiVersion: '1.1',
			path: this.path,
		};
		return this.wpcom.req.get( args, query, fn );
	}


	/**
	 * Create a `Post` instance
	 *
	 * @param {String} id - post id
	 * @return {Post} Post instance
	 */
	post( id ) {
		return new Post( id, this._id, this.wpcom );
	}

	/**
	 * Add a new blog post
	 *
	 * @param {Object} body - body object parameter
	 * @param {Function} fn - callback function
	 * @return {Function} request handler
	 */
	addPost( body, fn ) {
		const post = new Post( null, this._id, this.wpcom );
		return post.add( body, fn );
	}

	/**
	 * Delete a blog post
	 *
	 * @param {String} id - post id
	 * @param {Function} fn - callback function
	 * @return {Function} request handler
	 */
	deletePost( id, fn ) {
		const post = new Post( id, this._id, this.wpcom );
		return post.delete( fn );
	}

	/**
	 * Create a `Media` instance
	 *
	 * @param {String} id - post id
	 * @return {Media} Media instance
	 */
	media( id ) {
		return new Media( id, this._id, this.wpcom );
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
		const media = new Media( null, this._id, this.wpcom );
		return media.addFiles( query, files, fn );
	}

	/**
	 * Add a new media from url
	 *
	 * @param {Object} [query] - query object parameter
	 * @param {Array|String} files - media files to add
	 * @param {Function} fn - callback function
	 * @return {Function} request handler
	 */
	addMediaUrls( query, files, fn ) {
		const media = new Media( null, this._id, this.wpcom );
		return media.addUrls( query, files, fn );
	}

	/**
	 * Delete a blog media
	 *
	 * @param {String} id - media id
	 * @param {Function} fn - callback function
	 * @return {Function} request handler
	 */
	deleteMedia( id, fn ) {
		const media = new Media( id, this._id, this.wpcom );
		return media.del( fn );
	}

	/**
	 * Update multiple posts current assign
	 */
	assignOrders( query, fn ) {
		var args = {
			apiVersion: '1.1',
			path: this.path + '/posts/assign',
		};
		return this.wpcom.req.put( args, query, fn );
	}
}

// add methods in runtime
runtimeBuilder( Site, siteGetMethods, ( methodParams, ctx ) => {
	return `/sites/${ ctx._id }/${ methodParams.subpath }`;
} );

export default Site;