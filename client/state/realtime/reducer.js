import { combineReducers, createReducer } from 'state/utils';
import { RealtimeTypes } from 'action-types';

export const listen = createReducer(
	false,
	{
		[ RealtimeTypes.ENABLE_REALTIME_LISTEN ]: () => true,
		[ RealtimeTypes.DISABLE_REALTIME_LISTEN ]: () => false,
	}
);

export const currentPageId = createReducer(
	null,
	{
		[ RealtimeTypes.ENABLE_REALTIME_LISTEN ]: ( state, { pageId } ) => pageId,
		[ RealtimeTypes.DISABLE_REALTIME_LISTEN ]: () => null,
	}
);

export const latestAction = createReducer(
	null,
	{
		[ RealtimeTypes.RECEIVED_REALTIME_ACTION ]: ( state, { data } ) => data,
		[ RealtimeTypes.DISABLE_REALTIME_LISTEN ]: () => null,
	}
);

export default combineReducers( {
	listen,
	currentPageId,
	latestAction,
} )
