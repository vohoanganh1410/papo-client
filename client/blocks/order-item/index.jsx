/** @format */

/**
 * External dependencies
 */
import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import FormInputCheckbox from 'components/forms/form-checkbox';
import OrderActionsEllipsisMenu from 'blocks/order-list/order-actions-ellipsis-menu';
import OrderTime from 'blocks/order-time';
import OrderStatus from 'blocks/order-status';
import Spinner from 'components/spinner';
import { hideActiveSharePanel, togglePostSelection } from 'state/ui/post-type-list/actions';
import {
	isSharePanelOpen,
	isMultiSelectEnabled,
	isPostSelected,
} from 'state/ui/post-type-list/selectors';
import { getNormalizedPost } from 'state/posts/selectors';
import Ribbon from 'components/ribbon';
import Avatar from 'components/avatar';

 function preloadEditor() {
	preload( 'post-editor' );
}

class OrderItem extends React.Component {
	clickItem = event => {
		this.props.onToggle( this.props.post, event.shiftKey );
	};
	toggleCurrentPostSelection = event => {
		this.props.togglePostSelection( this.props.globalId );
		event.stopPropagation();
	};
	renderSpinner = () => {
		// if ( ! this.props.media || ! this.props.media.transient ) {
		// 	return;
		// }

		return (
			<div className="media-library__list-item-spinner">
				<Spinner />
			</div>
		);
	};
	renderSelectionCheckbox() {
			const { multiSelectEnabled, isCurrentPostSelected } = this.props;
			return (
				multiSelectEnabled && (
					<div className="post-item__select" onClick={ this.toggleCurrentPostSelection }>
						<FormInputCheckbox
							checked={ isCurrentPostSelected }
							onClick={ this.toggleCurrentPostSelection }
						/>
					</div>
				)
			);
		}
	render() {
		const {
			className,
			post,
			externalPostLink,
			postUrl,
			globalId,
			isAllSitesModeSelected,
			translate,
			multiSelectEnabled,
			hasExpandedContent,
			isCurrentPostSelected,
			isShowCheckbox
		} = this.props;

		// const title = this.props.title + ' - ' + this.props.mobile || 'Test order';
		// const title = post ?  post.ID + '. ' + post.title : null;
		const pageId = post ? post.page_ID : null;
		const isPlaceholder = ! globalId;
		
		
		const panelClasses = classnames( 'post-item__panel', className, {
			'is-untitled': ! (post && post.from),
			'is-placeholder': isPlaceholder,
			'is-selected': isCurrentPostSelected,
		} );

		const isAuthorVisible = true; /*this.hasMultipleUsers() && post && post.author;*/
		const rootClasses = classnames( 'post-item', {
			'is-expanded': /*!! hasExpandedContent*/ false,
		} );
		const isPageInfoVisible = false;
		

		return (
				<div className={ rootClasses } ref={ this.setDomNode }>
					<div className={ panelClasses }>
						{ this.renderSelectionCheckbox() }
						<div className="post-item__detail" onClick={ this.toggleCurrentPostSelection }>
							{ isPageInfoVisible &&
								<div className="post-item__info">
									{ pageId }
								</div>
							}
							{ /*this.renderSpinner()*/ }
							<h1
								className="post-item__title"
								onClick={ /*this.clickHandler( 'title' )*/null }
								onMouseOver={ /*preloadEditor*/null }
							>
								<span className="post-item__title-link">
									{ post && post.from ? post.from.name : translate( 'Untitled' ) }
								</span>
								{ /*post && post.from ? ( post.ID + '. ' + post.from.name ) : translate( 'Untitled' ) */}
							</h1>
							<div className="post-item__meta">
								<span className="post-item__meta-time-status">
									<span className="post-item__time-status-link">
										<OrderTime globalId={ globalId } />
										<OrderStatus globalId={ globalId } />
									</span>
								</span>
								{/*<PostActionCounts globalId={ globalId } />*/}
							</div>
							
							
						</div>
						<div className="post-type-list__post-thumbnail-wrapper has-image">
							{
								post && post.current_assigned && post.current_assigned[0] &&
								<Avatar user={ post.current_assigned[0].user } size={ 32 } />
							}
						</div>
						<OrderActionsEllipsisMenu globalId={ globalId } />
					</div>
				</div>
			)
	}
}

OrderItem.propTypes = {
	translate: PropTypes.func,
	globalId: PropTypes.string,
	post: PropTypes.object,
	canEdit: PropTypes.bool,
	postUrl: PropTypes.string,
	isAllSitesModeSelected: PropTypes.bool,
	allSitesSingleUser: PropTypes.bool,
	singleUserSite: PropTypes.bool,
	singleUserQuery: PropTypes.bool,
	className: PropTypes.string,
	compact: PropTypes.bool,
	hideActiveSharePanel: PropTypes.func,
	hasExpandedContent: PropTypes.bool,
	selectedIndex: PropTypes.number,
};

export default connect(
	( state, { globalId } ) => {
		const post = getNormalizedPost( state, globalId );
		// console.log(post);
		if ( ! post ) {
			return {};
		}
		
		// const siteId = post.site_ID;

		return {
			post,
			isCurrentPostSelected: isPostSelected( state, globalId ),
			multiSelectEnabled: isMultiSelectEnabled( state ),
		};
	},
	{
		hideActiveSharePanel,
		togglePostSelection,
	}
)( localize( OrderItem ) );