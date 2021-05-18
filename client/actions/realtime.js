import { RealtimeTypes } from 'action-types';

export const enableRealtime = ( pageId ) => dispatch => {
	return dispatch( {
		type: RealtimeTypes.ENABLE_REALTIME_LISTEN,
		pageId,
	} )
};

export const disableRealtime = ( pageId ) => dispatch => {
	return dispatch( {
		type: RealtimeTypes.DISABLE_REALTIME_LISTEN,
		pageId,
	} )
};

export const receivedRealtimeAction = ( data ) => dispatch => {
	return dispatch( {
		type: RealtimeTypes.RECEIVED_REALTIME_ACTION,
		data,
	} )
};
