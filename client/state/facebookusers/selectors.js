import { get } from 'lodash';

export function getFacebookUser( state, id ) {
	return get( state.facebookUsers.data, id );
}
