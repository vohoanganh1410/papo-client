import { reduce, map } from 'lodash';
import update from 'immutability-helper';

import {
	PAGES_RECEIVED,
	REQUEST_ACTIVED_PAGES,
	RECEIVED_ACTIVED_PAGES,
	REQUEST_ACTIVED_PAGES_FAILURED,
	REQUEST_ACTIVED_PAGES_SUCCESS,
	INIT_PAGE_START,
	INIT_PAGE_COMPLETE,
	CREATE_PAGE_SNIPPET,
	CREATE_PAGE_SNIPPET_SUCCESS,
	CREATE_PAGE_SNIPPET_FAILURED,
	RECEIVED_PAGE_SNIPPET,
	REQUEST_PAGE_REPLY_SNIPESTS,
	REQUEST_PAGE_REPLY_SNIPESTS_SUCCESS,
	REQUEST_PAGE_REPLY_SNIPESTS_FAILURED,
	RECEIVED_PAGE_REPLY_SNIPESTS,
	CREATE_AUTO_MESSAGE_TASK,
	CREATE_AUTO_MESSAGE_TASK_SUCCESS,
	CREATE_AUTO_MESSAGE_TASK_FAILURED,
	RECEIVED_AUTO_MESSAGE_TASK,
	REQUEST_AUTO_MESSAGE_TASKS,
	REQUEST_AUTO_MESSAGE_TASKS_SUCCESS,
	REQUEST_AUTO_MESSAGE_TASKS_FAILURED,
	RECEIVED_AUTO_MESSAGE_TASKS,
	RECEIVED_PAGE_TAGS,
	REQUEST_PAGE_TAGS_SUCCESS,
	REQUEST_PAGE_TAGS_FAILURED,
	RECEIVED_NEW_PAGE_TAG,
	RECEIVED_PAGE_STATUS_UPDATED,
	RECEIVED_PAGES_STATUS_UPDATED,
	RECEIVED_PAGE_INIT_VALUE,
} from 'state/action-types';
import { PageTypes } from 'action-types';
import { combineReducers, createReducer } from 'state/utils';

// import { itemsSchema } from './schema';

export const items = createReducer(
	{},
	{
		[ PAGES_RECEIVED ]: ( state, { pages } ) => {
			return reduce(
				pages,
				( memo, page ) => {
					const { page_id } = page.data;

					if ( memo === state ) {
						memo = { ...memo };
					}

					memo[ page_id ] = page;
					return memo;
				},
				state
			);
		},
		[ RECEIVED_PAGE_STATUS_UPDATED ]: ( state, { data } ) => {
			if ( ! data.page_id || ! data.status ) {
				return state;
			}

			return update( state, {
				[ data.page_id ]: { data: { $merge: { status: data.status } } },
			} );
		},
		[ RECEIVED_PAGES_STATUS_UPDATED ]: ( state, { data } ) => {
			if ( ! data.page_ids || ! data.status ) {
				return state;
			}

			let updateProps = {};

			map( data.page_ids, pageId => {
				updateProps = Object.assign( updateProps, {
					[ pageId ]: { data: { $merge: { status: data.status } } },
				} );
			} );

			return update( state, updateProps );
		},
		[ RECEIVED_PAGE_INIT_VALUE ]: ( state, { data } ) => {
			console.log( data );
			const value = data.data;
			if ( ! value ) return state;

			return update( state, {
				[ value.page_id ]: { $merge: { init: value } },
			} );
		},
	}
);

// export const actived_items = createReducer(
// 	{},
// 	{
// 		[ PAGES_RECEIVED ]: ( state, { pages } ) => {
// 			return reduce(
// 				pages,
// 				( memo, page ) => {
// 					if ( page.status === 'initialized' || page.status === 'initializing' ) {
// 						const { page_id } = page;
//
// 						if ( memo === state ) {
// 							memo = { ...memo };
// 						}
//
// 						memo[ page_id ] = page;
// 					}
// 					return memo;
// 				},
// 				state
// 			);
// 		},
// 		[ INIT_PAGE_START ]: ( state, { page_id } ) => {
// 			// find this page in actived pages
// 			if ( ! state.hasOwnProperty( page_id ) ) {
// 				return state;
// 			}
//
// 			return {
// 				...state,
// 				[ page_id ]: true,
// 			};
// 		},
// 	}
// );

export const is_requesting_actived_pages = createReducer( true, {
	[ RECEIVED_ACTIVED_PAGES ]: () => false,
	[ REQUEST_ACTIVED_PAGES ]: () => true,
	[ REQUEST_ACTIVED_PAGES_FAILURED ]: () => false,
	[ REQUEST_ACTIVED_PAGES_SUCCESS ]: () => false,
} );

export const paging = createReducer( null, {
	[ PAGES_RECEIVED ]: ( state, action ) => {
		return action.paging ? action.paging.next : null;
	},
} );

// export const initializing = createReducer(
// 	{},
// 	{
// 		[ INIT_PAGE_START ]: ( state, { page_id } ) => {
// 			return {
// 				...state,
// 				[ page_id ]: true,
// 			};
// 		},
// 		[ INIT_PAGE_COMPLETE ]: ( state, { page_id } ) => {
// 			return {
// 				...state,
// 				[ page_id ]: false,
// 			};
// 		},
// 		[ PAGES_RECEIVED ]: ( state, { pages } ) => {
// 			return reduce(
// 				pages,
// 				( memo, page ) => {
// 					if ( page.status === 'initializing' ) {
// 						const { page_id } = page;
//
// 						if ( memo === state ) {
// 							memo = { ...memo };
// 						}
//
// 						memo[ page_id ] = page;
// 					}
// 					return memo;
// 				},
// 				state
// 			);
// 		},
// 	}
// );

// export const initialized = createReducer(
// 	{},
// 	{
// 		[ INIT_PAGE_COMPLETE ]: ( state, { page_id } ) => {
// 			return {
// 				...state,
// 				[ page_id ]: true,
// 			};
// 		},
// 		[ RECEIVED_ACTIVED_PAGES ]: ( state, { pages } ) => {
// 			return reduce(
// 				pages,
// 				( memo, page ) => {
// 					const { page_id } = page;
//
// 					if ( memo === state ) {
// 						memo = { ...memo };
// 					}
//
// 					memo[ page_id ] = page.status === 'initialized';
// 					return memo;
// 				},
// 				state
// 			);
// 		},
// 	}
// );

export const _snippets = createReducer(
	{},
	{
		[ RECEIVED_PAGE_REPLY_SNIPESTS ]: ( state, { snippets, page_id } ) => {
			const snippetsByPageId = reduce(
				snippets,
				( memo, snippet ) => {
					return Object.assign( memo, {
						[ snippet.page_id ]: [ ...( memo[ snippet.page_id ] || [] ), snippet ],
					} );
				},
				{}
			);

			if ( ! state[ page_id ] ) {
				return reduce(
					snippetsByPageId,
					( memo, pageSnippets, pageId ) => {
						return {
							...state,
							[ pageId ]: pageSnippets,
						};
					},
					state
				);
			}

			return reduce(
				snippetsByPageId,
				( memo, pageSnippets, pageId ) => {
					// if ( memo[ pageId ] ) {
					// 	return state;
					// }
					return {
						[ pageId ]: [ ...state[ pageId ].concat( pageSnippets ) ],
					};
				},
				state
			);
		},
	}
);

export const snippets_has_loaded = createReducer(
	{},
	{
		[ REQUEST_PAGE_REPLY_SNIPESTS_SUCCESS ]: ( state, { page_id } ) => {
			return {
				...state,
				[ page_id ]: true,
			};
		},
		[ REQUEST_PAGE_REPLY_SNIPESTS_FAILURED ]: ( state, { page_id } ) => {
			return {
				...state,
				[ page_id ]: false,
			};
		},
	}
);

export const tags = createReducer(
	{},
	{
		[ RECEIVED_PAGE_TAGS ]: ( state, { tags, pageId } ) => {
			const tagsByPageId = reduce(
				tags,
				( memo, tag ) => {
					return Object.assign( memo, {
						[ pageId ]: [ ...( memo[ tag.page_id ] || [] ), tag ],
					} );
				},
				{}
			);

			if ( ! state[ pageId ] ) {
				return reduce(
					tagsByPageId,
					( memo, pageTags, pageId ) => {
						return {
							...state,
							[ pageId ]: pageTags,
						};
					},
					state
				);
			}

			return reduce(
				tagsByPageId,
				( memo, pageTags, pageId ) => {
					// if ( memo[ pageId ] ) {
					// 	return state;
					// }
					return {
						[ pageId ]: [ ...state[ pageId ].concat( pageTags ) ],
					};
				},
				state
			);
		},
		[ RECEIVED_NEW_PAGE_TAG ]: ( state = [], { data } ) => {
			if ( data && data.new_page_tag ) {
				if ( ! state[ data.new_page_tag.page_id ] ) {
					return {
						...state,
						[ data.new_page_tag.page_id ]: [ data.new_page_tag ],
					};
				}

				return {
					...state,
					[ data.new_page_tag.page_id ]: [
						...state[ data.new_page_tag.page_id ].concat( data.new_page_tag ),
					],
				};
			}

			return state;
		},
	}
);

export const tags_has_loaded = createReducer(
	{},
	{
		[ REQUEST_PAGE_TAGS_SUCCESS ]: ( state, { pageId } ) => {
			return {
				...state,
				[ pageId ]: true,
			};
		},
		[ REQUEST_PAGE_TAGS_FAILURED ]: ( state, { pageId } ) => {
			return {
				...state,
				[ pageId ]: false,
			};
		},
	}
);

export const is_creating_page_snippet = createReducer( false, {
	[ CREATE_PAGE_SNIPPET ]: () => true,
	[ CREATE_PAGE_SNIPPET_SUCCESS ]: () => false,
	[ CREATE_PAGE_SNIPPET_FAILURED ]: () => false,
	[ RECEIVED_PAGE_SNIPPET ]: () => false,
} );

export const is_requesting_page_snippets = createReducer( false, {
	[ REQUEST_PAGE_REPLY_SNIPESTS ]: () => true,
	[ REQUEST_PAGE_REPLY_SNIPESTS_SUCCESS ]: () => false,
	[ RECEIVED_PAGE_REPLY_SNIPESTS ]: () => false,
	[ REQUEST_PAGE_REPLY_SNIPESTS_FAILURED ]: () => false,
} );

export const auto_message_tasks = createReducer(
	{},
	{
		[ RECEIVED_AUTO_MESSAGE_TASKS ]: ( state, { tasks, page_id } ) => {
			const tasksByPageId = reduce(
				tasks,
				( memo, task ) => {
					return Object.assign( memo, {
						[ task.page_id ]: [ ...( memo[ task.page_id ] || [] ), task ],
					} );
				},
				{}
			);

			if ( ! state[ page_id ] ) {
				return reduce(
					tasksByPageId,
					( memo, pageTasks, pageId ) => {
						return {
							...state,
							[ pageId ]: pageTasks,
						};
					},
					state
				);
			}

			return reduce(
				tasksByPageId,
				( memo, pageTasks, pageId ) => {
					// if ( memo[ pageId ] ) {
					// 	return state;
					// }
					return {
						[ pageId ]: [ ...state[ pageId ].concat( pageTasks ) ],
					};
				},
				state
			);
		},
	}
);

export const is_requesting_auto_message_tasks = createReducer( false, {
	[ REQUEST_AUTO_MESSAGE_TASKS ]: () => true,
	[ REQUEST_AUTO_MESSAGE_TASKS_SUCCESS ]: () => false,
	[ RECEIVED_AUTO_MESSAGE_TASKS ]: () => false,
	[ REQUEST_AUTO_MESSAGE_TASKS_FAILURED ]: () => false,
} );

export const is_creating_auto_message_task = createReducer( false, {
	[ CREATE_AUTO_MESSAGE_TASK ]: () => true,
	[ CREATE_AUTO_MESSAGE_TASK_SUCCESS ]: () => false,
	[ CREATE_AUTO_MESSAGE_TASK_FAILURED ]: () => false,
	[ RECEIVED_AUTO_MESSAGE_TASK ]: () => false,
} );

const _analyticsData = createReducer(
	{},
	{
		[ PageTypes.RECEIVED_PAGE_ANALYTICS_DATA ]: ( state, { data, page_id } ) => {
			return {
				...state,
				[ page_id ]: data,
			}
		},
	}
);

const _analyticsLoading = createReducer(
	{},
	{
		[ PageTypes.REQUEST_PAGE_ANALYTICS ]: ( state, { page_id } ) => {
			return {
				...state,
				[ page_id ]: true,
			}
		},
		[ PageTypes.RECEIVED_PAGE_ANALYTICS_DATA ]: ( state, { page_id } ) => {
			return {
				...state,
				[ page_id ]: false,
			}
		},
		[ PageTypes.REQUEST_PAGE_DETAIL_ANALYTICS_ERROR ]: ( state, { page_id } ) => {
			return {
				...state,
				[ page_id ]: false,
			}
		}
	}
);

export const analytics = combineReducers( {
	data: _analyticsData,
	loading: _analyticsLoading,
} );

export default combineReducers( {
	items,
	paging,
	// actived_items,
	snippets: _snippets,
	snippets_has_loaded,
	tags,
	tags_has_loaded,
	auto_message_tasks,
	is_creating_auto_message_task,
	is_requesting_auto_message_tasks,
	is_creating_page_snippet,
	is_requesting_page_snippets,
	is_requesting_actived_pages,
	analytics,
	// initializing,
	// initialized,
} );
