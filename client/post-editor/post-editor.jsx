/** @format */
/**
 * External dependencies
 */
import React from 'react';
import createReactClass from 'create-react-class';
import ReactDom from 'react-dom';
import page from 'page';
import PropTypes from 'prop-types';
import { debounce, flow, get, partial, throttle, noop } from 'lodash';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';
import tinyMce from 'tinymce/tinymce';
import { v4 as uuid } from 'uuid';
import { bindActionCreators } from 'redux';
import debug from 'debug';
import shallowEqual from 'react-pure-render/shallowEqual';

/**
 * Internal dependencies
 */
import { addSiteFragment } from 'lib/route';
import EditorGroundControl from 'post-editor/editor-ground-control';
import { getSelectedSiteId, getSelectedSite } from 'state/ui/selectors';
import { getCurrentUserId } from 'state/current-user/selectors';
import {
	getEditorPostId,
	getEditorPath,
	isConfirmationSidebarEnabled,
} from 'state/ui/editor/selectors';
import { getSitePost, isRequestingPostsForQuery, isRequestingSitePost } from 'state/posts/selectors';
// import { isRequestingPostsForQuery, isRequestingSitePost } from 'state/posts/selectors';
import { requestSitePosts, requestSitePost, requestAllSitesPosts } from 'state/posts/actions';
import { setLayoutFocus, setNextLayoutFocus } from 'state/ui/layout-focus/actions';
import { getCurrentLayoutFocus } from 'state/ui/layout-focus/selectors';
import PostEditStore from 'lib/posts/post-edit-store';

// import Card from 'components/card';
// import Button from 'components/button';
import formState from 'lib/form-state';
// import FormTextInput from 'components/forms/form-text-input';
// import FormLabel from 'components/forms/form-label';
// import FormLegend from 'components/forms/form-legend';
// import FormFieldset from 'components/forms/form-fieldset';
// import FormInputCheckbox from 'components/forms/form-checkbox';
// import SegmentedControl from 'components/segmented-control';
// import ControlItem from 'components/segmented-control/item';
import EditorSidebar from 'post-editor/editor-sidebar';
import { closeEditorSidebar, openEditorSidebar } from 'state/ui/editor/sidebar/actions';

import CreateOrderForm from 'blocks/create-order-form';

/**
 * Module variables
 */
const log = debug( 'calypso:query-posts' );

function getPostID( context ) {
	if ( ! context.params.post || 'new' === context.params.post ) {
		return null;
	}
	// both post and site are in the path
	return parseInt( context.params.post, 10 );
}

export const PostEditor = createReactClass( {
	displayName: 'PostEditor',

	propTypes: {
		siteId: PropTypes.number,
		preferences: PropTypes.object,
		setEditorModePreference: PropTypes.func,
		setLayoutFocus: PropTypes.func.isRequired,
		setNextLayoutFocus: PropTypes.func.isRequired,
		editorModePreference: PropTypes.string,
		editorSidebarPreference: PropTypes.string,
		editPath: PropTypes.string,
		// markChanged: PropTypes.func.isRequired,
		// markSaved: PropTypes.func.isRequired,
		translate: PropTypes.func.isRequired,
		hasBrokenPublicizeConnection: PropTypes.bool,
		editPost: PropTypes.func,
		type: PropTypes.string,
	},

	_previewWindow: null,

	getInitialState() {
		return {
			...this.getPostEditState(),
			confirmationSidebar: 'closed',
			confirmationSidebarPreference: true,
			isSaving: false,
			isPublishing: false,
			notice: null,
			selectedText: null,
			showVerifyEmailDialog: false,
			showAutosaveDialog: true,
			isLoadingRevision: false,
			isTitleFocused: false,
			showPreview: false,
			isPostPublishPreview: false,
			previewAction: null,
			post: { type: "post", date: null }
		};
	},

	getPostEditState: function() {
		return {
			savedPost: PostEditStore.getSavedPost(),
			loadingError: PostEditStore.getLoadingError(),
			isDirty: PostEditStore.isDirty(),
			isSaveBlocked: PostEditStore.isSaveBlocked(),
			hasContent: PostEditStore.hasContent(),
			previewUrl: PostEditStore.getPreviewUrl(),
			post: PostEditStore.get(),
			isNew: PostEditStore.isNew(),
			isAutosaving: PostEditStore.isAutosaving(),
			isLoading: PostEditStore.isLoading(),
		};
	},
	componentWillMount: function() {
		PostEditStore.on( 'change', this.onEditedPostChange );

		if ( this.props.siteId && this.props.postID ) {
			this.request( this.props );
		}

		this.formStateController = new formState.Controller( {
			fieldNames: [ 'siteTitle', 'siteGoals' ],
			validatorFunction: noop,
			onNewState: this.setFormState,
			hideFieldErrorsOnChange: true,
			initialState: {
				siteTitle: {
					value: 'Công ty TNHH ABC - Chi nhánh XYZ',
				},
				siteGoals: {
					value: 'abcxyz',
				},
			},
		} );

		this.setFormState( this.formStateController.getInitialState() );
	},

	onEditedPostChange: function() {
		var didLoad = this.state.isLoading && ! PostEditStore.isLoading(),
			loadingError = PostEditStore.getLoadingError(),
			postEditState,
			post,
			site;

		if ( loadingError ) {
			this.setState( { loadingError } );
		} else if ( ( PostEditStore.isNew() && ! this.state.isNew ) || PostEditStore.isLoading() ) {
			// is new or loading
			this.setState(
				this.getInitialState(),
				() => this.editor && this.editor.setEditorContent( '' )
			);
		} else if ( this.state.isNew && this.state.hasContent && ! this.state.isDirty ) {
			// Is a copy of an existing post.
			// When copying a post, the created draft is new and the editor is not yet dirty, but it already has content.
			// Once the content is set, the editor becomes dirty and the following setState won't trigger anymore.
			this.setState(
				this.getInitialState(),
				() => this.editor && this.editor.setEditorContent( this.state.post.content )
			);
		} else {
			postEditState = this.getPostEditState();
			post = postEditState.post;
			site = this.props.selectedSite;
			if ( didLoad && site && ( this.props.type === 'page' ) !== utils.isPage( post ) ) {
				// incorrect post type in URL
				page.redirect( utils.getEditURL( post, site ) );
			}
			this.setState( postEditState, function() {
				if ( this.editor && ( didLoad || this.state.isLoadingRevision ) ) {
					this.editor.setEditorContent( this.state.post.content, { initial: true } );
				}

				if ( this.state.isLoadingRevision ) {
					this.setState( { isLoadingRevision: false } );
				}
			} );
		}
	},

	componentWillUnmount: function() {
		PostEditStore.removeListener( 'change', this.onEditedPostChange );
	},

	componentWillReceiveProps( nextProps ) {
		if (
			this.props.siteId === nextProps.siteId &&
			this.props.postID === nextProps.postID &&
			shallowEqual( this.props.query, nextProps.query )
		) {
			return;
		}

		this.request( nextProps );
	},

	request( props ) {
		props.requestSitePost( props.siteId, props.postID );
	},

	setFormState( state ) {
		this.setState( { form: state } );
	},

	handleSubmit( event ) {
		event.preventDefault();
		console.log('sdf');
	},

	handleChangeEvent( event ) {
		this.formStateController.handleFieldChange( {
			name: event.target.name,
			value: event.target.value,
		} );
	},

	toggleSidebar: function() {
		this.props.layoutFocus === 'sidebar'
			? this.props.closeEditorSidebar()
			: this.props.openEditorSidebar();
	},


 	render: function() {
 		const { postId, translate } = this.props;
 		const site = this.props.selectedSite || undefined;
 		const classes = classNames( 'post-editor', {
			'is-loading': false /*! this.state.isEditorInitialized*/,
		} );
		
		return (
			<div className={ classes }>
				<div className="post-editor__inner">
					<EditorGroundControl
						site={ site }
						toggleSidebar={ this.toggleSidebar }
					/>
					<div className="post-editor__content">
						<div className="post-editor__content-editor">
							<div className="post-editor__inner-content">
								<div className="post-editor__header">
									<CreateOrderForm 
										postId={ postId }
										site={ site }
										/>
								</div>
							</div>
						</div>
					</div>
					<EditorSidebar
					/>
				</div>
			</div>
			)
 	}
 })

 // export default PostEditor;

 export default connect(
	( state, ownProps ) => {
		const { siteId, postID } = ownProps;
		// const { /*siteId, postId, */query } = ownProps;
		// const globalId = getPostID( context );
		const post = getSitePost( state, siteId, postID);

		// const siteId = getSelectedSiteId( state );
		const postId = getEditorPostId( state );	

		// const totalPageCount = getPostsLastPageForQuery( state, siteId, ownProps.query );
		// const lastPageToRequest =
		// siteId === null ? Math.min( MAX_ALL_SITES_PAGES, totalPageCount ) : totalPageCount;

		return {
			post,
			postId,
			selectedSite: getSelectedSite( state ),
			requestingPost: siteId && postID && isRequestingSitePost( state, siteId, postID ),
			layoutFocus: getCurrentLayoutFocus( state ),
		};
	},
	dispatch => {
		return bindActionCreators(
			{
				requestSitePosts,
				requestAllSitesPosts,
				requestSitePost,
				setLayoutFocus,
				setNextLayoutFocus,
				closeEditorSidebar,
				openEditorSidebar,
			},
			dispatch
		);
	}
)( localize( PostEditor ) );



// export default connect(
// 	( state, ownProps ) => {
// 		const { siteId, postId, query } = ownProps;
// 		return {
// 			requestingPost: siteId && postId && isRequestingSitePost( state, siteId, postId ),
// 			requestingPosts: isRequestingPostsForQuery( state, siteId, query ),
// 		};
// 	},
// 	dispatch => {
// 		return bindActionCreators(
// 			{
// 				requestSitePosts,
// 				requestAllSitesPosts,
// 				requestSitePost,
// 			},
// 			dispatch
// 		);
// 	}
// )( QueryPosts );