/** @format */

/**
 * External dependencies
 */

import deterministicStringify from 'json-stable-stringify';
import { endsWith, find, omit } from 'lodash';
import debugFactory from 'debug';
const debug = debugFactory( 'papo:users:store' );

/**
 * Internal dependencies
 */
import Dispatcher from 'dispatcher';
import emitter from 'lib/mixins/emitter';

var _fetchingUsersByNamespace = {}, // store fetching state (boolean)
	_fetchingUpdatedUsersByNamespace = {}, // store fetching state (boolean)
	_usersBySite = {}, // store user objects
	_totalUsersByNamespace = {}, // store total found for params
	_usersFetchedByNamespace = {}, // store fetch progress
	_offsetByNamespace = {}, // store fetch progress
	_userIDsByNamespace = {}; // store user order

var UsersStore = {
	// This data can help manage infinite scroll
	getPaginationData: function( fetchOptions ) {
		var namespace = getNamespace( fetchOptions );
		// console.log( '_fetchingUsersByNamespace' );
		// console.log( _fetchingUsersByNamespace[ namespace ] );
		debug( 'getPaginationData:', namespace );
		return {
			fetchInitialized: _usersFetchedByNamespace.hasOwnProperty( namespace ),
			totalUsers: _totalUsersByNamespace[ namespace ] || 0,
			fetchingUsers: _fetchingUsersByNamespace[ namespace ] || false,
			usersCurrentOffset: _offsetByNamespace[ namespace ],
			numUsersFetched: _usersFetchedByNamespace[ namespace ],
			fetchNameSpace: namespace,
		};
	},
	// Get Users for a set of fetchOptions
	getUsers: function( fetchOptions ) {
		var namespace = getNamespace( fetchOptions ),
			siteId = fetchOptions.siteId,
			users = [];

		// console.log(namespace);

		debug( 'getUsers:', namespace );

		if ( ! _usersBySite[ siteId ] ) {
			_usersBySite[ siteId ] = {};
		}
		if ( ! _userIDsByNamespace[ namespace ] ) {
			return users;
		}
		_userIDsByNamespace[ namespace ].forEach( userId => {
			if ( _usersBySite[ siteId ][ userId ] ) {
				users.push( _usersBySite[ siteId ][ userId ] );
			}
		} );
		return users;
	},

	getUser: function( siteId, userId ) {
		if ( ! _usersBySite[ siteId ] || ! _usersBySite[ siteId ][ userId ] ) {
			return null;
		}
		return _usersBySite[ siteId ][ userId ];
	},

	getUserByLogin: function( siteId, login ) {
		// console.log( login );
		return find( _usersBySite[ siteId ], function( user ) {
			return user._id === login;
		} );
	},

	getUpdatedParams( fetchOptions ) {
		const namespace = getNamespace( fetchOptions );
		const requestNumber = _usersFetchedByNamespace[ namespace ] || fetchOptions.number;

		return Object.assign( {}, fetchOptions, {
			offset: 0,
			number: Math.min( requestNumber, 1000 ),
		} );
	},

	emitChange: function() {
		this.emit( 'change' );
	},
};

function updateUser( siteId, id, user ) {
	if ( ! _usersBySite[ siteId ] ) {
		_usersBySite[ siteId ] = {};
	}
	if ( ! _usersBySite[ siteId ][ id ] ) {
		_usersBySite[ siteId ][ id ] = {};
	}

	// TODO: user = UserUtils.normalizeTeamMemberData( teamMember );
	_usersBySite[ siteId ][ id ] = Object.assign( {}, _usersBySite[ siteId ][ id ], user );
}

function decrementPaginationData( siteId, userId ) {
	Object.keys( _userIDsByNamespace ).forEach( function( namespace ) {
		if (
			endsWith( namespace, 'siteId=' + siteId ) &&
			_userIDsByNamespace[ namespace ].has( userId )
		) {
			_totalUsersByNamespace[ namespace ]--;
			_usersFetchedByNamespace[ namespace ]--;
		}
	} );
}

function incrementPaginationData( siteId, userId ) {
	Object.keys( _userIDsByNamespace ).forEach( function( namespace ) {
		if (
			endsWith( namespace, 'siteId=' + siteId ) &&
			_userIDsByNamespace[ namespace ].has( userId )
		) {
			_totalUsersByNamespace[ namespace ]++;
			_usersFetchedByNamespace[ namespace ]++;
		}
	} );
}

function deleteUserFromSite( siteId, userId ) {
	if ( ! _usersBySite[ siteId ] || ! _usersBySite[ siteId ][ userId ] ) {
		return;
	}
	delete _usersBySite[ siteId ][ userId ];
	decrementPaginationData( siteId, userId );
}

function deleteUserFromNamespaces( siteId, userId ) {
	Object.keys( _userIDsByNamespace ).forEach( function( namespace ) {
		if (
			endsWith( namespace, 'siteId=' + siteId ) &&
			_userIDsByNamespace[ namespace ].has( userId )
		) {
			_userIDsByNamespace[ namespace ].delete( userId );
		}
	} );
}

function addSingleUser( fetchOptions, user, namespace ) {
	if ( ! _userIDsByNamespace[ namespace ] ) {
		_userIDsByNamespace[ namespace ] = new Set();
	}
	_userIDsByNamespace[ namespace ].add( user._id );
	updateUser( fetchOptions.siteId, user._id, user );
}

function updateUsers( fetchOptions, users, total ) {
	var namespace = getNamespace( fetchOptions ),
		offset = fetchOptions.offset;

	debug( 'updateUsers:', namespace );

	// reset the order
	if ( ! offset ) {
		_userIDsByNamespace[ namespace ] = new Set();
	}

	users.forEach( function( user ) {
		_userIDsByNamespace[ namespace ].add( user._id );
		updateUser( fetchOptions.siteId, user._id, user );
	} );

	_totalUsersByNamespace[ namespace ] = total;
	_offsetByNamespace[ namespace ] = offset;
	_usersFetchedByNamespace[ namespace ] = _userIDsByNamespace[ namespace ].size;
}

function getNamespace( fetchOptions ) {
	return deterministicStringify( omit( fetchOptions, [ 'number', 'offset' ] ) );
}

UsersStore.dispatchToken = Dispatcher.register( function( payload ) {
	var action = payload.action,
		namespace;

	switch ( action.type ) {
		case 'RECEIVE_USERS':
			namespace = getNamespace( action.fetchOptions );

			_fetchingUsersByNamespace[ namespace ] = false;

			if ( ! action.error ) {
				updateUsers( action.fetchOptions, action.data.users, action.data.found );
				UsersStore.emitChange();
			}

			break;
		case 'RECEIVE_UPDATED_USERS':
			namespace = getNamespace( action.fetchOptions );
			_fetchingUpdatedUsersByNamespace[ namespace ] = false;
			console.log( action );
			if ( ! action.error ) {
				updateUsers( action.fetchOptions, action.data.users, action.data.found );
				UsersStore.emitChange();
			}
			break;
		case 'UPDATE_SITE_USER':
			updateUser( action.siteId, action.user._id, action.user );
			UsersStore.emitChange();
			break;
		case 'RECEIVE_UPDATE_SITE_USER_FAILURE':
			updateUser( action.siteId, action.user._id, action.user );
			UsersStore.emitChange();
			break;
		case 'DELETE_SITE_USER':
			deleteUserFromSite( action.siteId, action.user._id );
			UsersStore.emitChange();
			break;
		case 'RECEIVE_DELETE_SITE_USER_SUCCESS':
			deleteUserFromNamespaces( action.siteId, action.user._id );
			UsersStore.emitChange();
			break;
		case 'RECEIVE_DELETE_SITE_USER_FAILURE':
			updateUser( action.siteId, action.user._id, action.user );
			incrementPaginationData( action.siteId, action.user._id );
			UsersStore.emitChange();
			break;
		case 'FETCHING_USERS':
			namespace = getNamespace( action.fetchOptions );

			_fetchingUsersByNamespace[ namespace ] = true;
			UsersStore.emitChange();
			break;
		case 'FETCHING_UPDATED_USERS':
			namespace = getNamespace( action.fetchOptions );
			_fetchingUpdatedUsersByNamespace[ namespace ] = true;
			UsersStore.emitChange();
			break;
		case 'RECEIVE_SINGLE_USER':
			namespace = getNamespace( action.fetchOptions );
			_fetchingUsersByNamespace[ namespace ] = false;
			addSingleUser( action.fetchOptions, action.user, namespace );
			UsersStore.emitChange();
			break;
		case 'RECEIVE_USER_FAILED':
			namespace = getNamespace( action.fetchOptions );
			_fetchingUsersByNamespace[ namespace ] = false;
			UsersStore.emitChange();
			break;
	}
} );

emitter( UsersStore );

export default UsersStore;
