/** @format */

/**
 * Internal dependencies
 */

import { createReducerStore } from 'lib/store';
import { reducer, initialState } from 'lib/conversation/reducers/conversation-graph-validation';

const ConversationGraphValidationStore = createReducerStore( reducer, initialState );

ConversationGraphValidationStore.getErrors = () =>
	ConversationGraphValidationStore.get().getIn( [ 'errors', "message" ] );

export default ConversationGraphValidationStore;
