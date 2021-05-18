/** @format */

/**
 * Internal dependencies
 */

import { successNotice, errorNotice } from './actions';

export function dispatchSuccess( ...args ) {
	return dispatch => dispatch( successNotice( ...args ) );
}

export function dispatchError( ...args ) {
	return dispatch => dispatch( errorNotice( ...args ) );
}
