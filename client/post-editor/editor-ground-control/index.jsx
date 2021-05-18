/** @format */
/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { identity, noop, get, findLast } from 'lodash';
import moment from 'moment';
import page from 'page';
import { localize } from 'i18n-calypso';
import Gridicon from 'gridicons';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Site from 'blocks/site';

import Button from 'components/button';
import SpinnerButton from 'components/spinner-button';
import { getRouteHistory } from 'state/ui/action-log/selectors';
import EditorPublishButton, { getPublishButtonStatus } from 'post-editor/editor-publish-button';
// import { isGraphing } from 'state/conversation/selectors';

export class EditorGroundControl extends React.Component {
	static propTypes = {
		hasContent: PropTypes.bool,
		isConfirmationSidebarEnabled: PropTypes.bool,
		confirmationSidebarStatus: PropTypes.string,
		isDirty: PropTypes.bool,
		isSaveBlocked: PropTypes.bool,
		isPublishing: PropTypes.bool,
		isSaving: PropTypes.bool,
		isSidebarOpened: PropTypes.bool,
		loadRevision: PropTypes.func,
		moment: PropTypes.func,
		onPreview: PropTypes.func,
		onPublish: PropTypes.func,
		onSave: PropTypes.func,
		onSaveDraft: PropTypes.func,
		onMoreInfoAboutEmailVerify: PropTypes.func,
		post: PropTypes.object,
		savedPost: PropTypes.object,
		setPostDate: PropTypes.func,
		site: PropTypes.object,
		toggleSidebar: PropTypes.func,
		translate: PropTypes.func,
	};

	static defaultProps = {
		hasContent: false,
		isConfirmationSidebarEnabled: true,
		isDirty: false,
		isSaveBlocked: false,
		isPublishing: false,
		isSaving: false,
		moment,
		onPublish: noop,
		onSaveDraft: noop,
		post: null,
		savedPost: null,
		site: {},
		translate: identity,
		setPostDate: noop,
	};

	renderGroundControlActionButtons() {
		if ( this.props.confirmationSidebarStatus === 'open' ) {
			return;
		}

		// const { isGraphing } = this.props;

		return (
			<div className="editor-ground-control__action-buttons">
				<SpinnerButton
					borderless
					className="editor-ground-control__toggle-sidebar"
					loadingText="Loading" 
					loading={ false }
					onClick={ this.props.toggleSidebar }
				>
					<Gridicon icon="globe" />
				</SpinnerButton>
				{/*<Button
					className="editor-ground-control__preview-button"
					disabled={ ! this.isPreviewEnabled() }
					onClick={ this.onPreviewButtonClick }
					tabIndex={ 4 }
				>
					<span className="editor-ground-control__button-label">{ this.getPreviewLabel() }</span>
				</Button>*/}
				<div className="editor-ground-control__publish-button">
					<EditorPublishButton
						site={ this.props.site }
						post={ this.props.post }
						savedPost={ this.props.savedPost }
						onSave={ this.props.onSave }
						onPublish={ this.props.onPublish }
						tabIndex={ 5 }
						isConfirmationSidebarEnabled={ this.props.isConfirmationSidebarEnabled }
						isPublishing={ this.props.isPublishing }
						isSaveBlocked={ this.props.isSaveBlocked }
						hasContent={ this.props.hasContent }
						needsVerification={ this.props.userNeedsVerification }
						busy={
							this.props.isPublishing ||
							( /*isPublished( this.props.savedPost ) && this.props.isSaving*/false )
						}
					/>
				</div>
			</div>
		);
	}
	getCloseButtonPath() {
		// find the last non-editor path in routeHistory, default to "all posts"
		const lastNonEditorPath = findLast(
			this.props.routeHistory,
			action => ! action.path.match( /^\/(order|page|(edit\/[^\/]+))\/[^\/]+(\/\d+)?$/i )
		);
		return lastNonEditorPath ? lastNonEditorPath.path : /*this.props.allPostsUrl*/'/dashboard/orders';
	}
	onCloseButtonClick = () => {
		// this.props.recordCloseButtonClick();
		page.show( this.getCloseButtonPath() );
	};
	render() {
		const {
			isSaving,
			isSaveBlocked,
			isDirty,
			hasContent,
			loadRevision,
			post,
			onSave,
			translate,
			userNeedsVerification,
		} = this.props;

		return (
			<Card className="editor-ground-control">
				<Button
					borderless
					className="editor-ground-control__back"
					href={ '' }
					onClick={ this.onCloseButtonClick }
					aria-label={ translate( 'Close' ) }
				>
					{ translate( 'Đóng' ) }
				</Button>
				<Site
					compact
					site={ this.props.site }
					onSelect={ this.props.recordSiteButtonClick }
					indicator={ false }
				/>
				{ this.renderGroundControlActionButtons() }
			</Card>
		);
	}
}

const mapStateToProps = ( state, ownProps ) => {
	const siteId = get( ownProps, 'site.ID', null );

	return {
		canUserPublishPosts: true,
		routeHistory: getRouteHistory( state ),
		// isGraphing: isGraphing( state ),
	};
};

export default connect( mapStateToProps )( localize( EditorGroundControl ) );