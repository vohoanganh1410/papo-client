/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { values, noop, some, every, flow, partial, pick } from 'lodash';
import Gridicon from 'gridicons';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
// import { canUserDeleteItem } from 'lib/media/utils';
// import { getCurrentUser } from 'state/current-user/selectors';
// import { getSiteSlug } from 'state/sites/selectors';
// import { getMediaModalView } from 'state/ui/media-modal/selectors';
// import { setEditorMediaModalView } from 'state/ui/editor/actions';
import { resetPostSelected } from 'state/ui/post-type-list/selectors';
import { ModalViews } from 'state/ui/media-modal/constants';
// import { withAnalytics, bumpStat, recordGoogleEvent } from 'state/analytics/actions';
import Button from 'components/button';
import Count from 'components/count';

class MediaModalSecondaryActions extends Component {
	static propTypes = {
		user: PropTypes.object,
		site: PropTypes.object,
		selectedItems: PropTypes.array,
		view: PropTypes.oneOf( values( ModalViews ) ),
		disabled: PropTypes.bool,
		onDelete: PropTypes.func,
		onViewDetails: PropTypes.func,
	};

	static defaultProps = {
		disabled: false,
		onDelete: noop,
	};

	getButtons() {
		const {
			disabled,
			selectedItems,
			site,
			translate,
			user,
			view,

			onDelete,
			onViewDetails,
			onResetPostSelected,
			onShowDialog,
		} = this.props;

		const buttons = [];

		if ( ModalViews.LIST === view && selectedItems.length ) {
			buttons.push( {
				key: 'edit',
				text: translate( 'Phân bổ'),
				count: selectedItems.length,
				disabled: disabled,
				primary: true,
				onClick: onShowDialog,
				showCount: false,
			} );

			buttons.push( {
				key: 'reset',
				text: translate( 'Bỏ chọn tất cả'),
				count: selectedItems.length,
				className: 'editor-media-modal__delete',
				disabled: isButtonDisabled,
				onClick: onResetPostSelected,
				showCount: false,
			} );

			const isButtonDisabled = disabled || some( selectedItems, 'transient' );
			buttons.push( {
				key: 'delete',
				icon: 'trash',
				count: selectedItems.length,
				className: 'editor-media-modal__delete',
				disabled: isButtonDisabled,
				onClick: isButtonDisabled ? noop : onDelete,
				showCount: false,
			} );
		}

		// const canDeleteItems =
		// 	selectedItems.length &&
		// 	every( selectedItems, item => {
		// 		return /*canUserDeleteItem( item, user, site )*/true;
		// 	} );

		// if ( /*ModalViews.GALLERY !== view && canDeleteItems*/true ) {
		// 	const isButtonDisabled = disabled || some( selectedItems, 'transient' );
		// 	buttons.push( {
		// 		key: 'delete',
		// 		icon: 'trash',
		// 		className: 'editor-media-modal__delete',
		// 		disabled: isButtonDisabled,
		// 		onClick: isButtonDisabled ? noop : onDelete,
		// 	} );
		// }

		return buttons;
	}

	render() {
		return (
			<div>
				{
					this.props.selectedItems.length > 0 &&
					<span className={ 'post-selection__label' }>
						<span>Đã chọn </span>
						<Count count={ this.props.selectedItems.length } primary/>
						<span> order(s)</span>
					</span>
				}
				
				{ this.getButtons().map( button => (
					<Button
						className={ classNames( 'editor-media-modal__secondary-action section-header__label', button.className ) }
						data-e2e-button={ button.key }
						
						compact
						{ ...pick( button, [ 'key', 'disabled', 'onClick', 'primary' ] ) }
					>
						{ button.icon && <Gridicon icon={ button.icon } /> }
						{ button.text && button.text }
					</Button>
				) ) }
				
			</div>
		);
	}
}

export default connect(
	( state, ownProps ) => {
		return {
			onResetPostSelected: flow(
				partial( resetPostSelected, state )
			),
		}
	},
	function mergeProps( stateProps, dispatchProps, ownProps ) {
		//We want to overwrite connected props if 'onViewDetails', 'view' were provided
		return Object.assign(
			{},
			ownProps,
			stateProps,
			dispatchProps,
			pick( ownProps, [ 'onResetPostSelected', 'view' ] )
		);
	}
)( localize( MediaModalSecondaryActions ) );

// export default connect(
// 	( state, ownProps ) => ( {
// 		view: /*getMediaModalView( state )*/null,
// 		user: /*getCurrentUser( state )*/null,
// 		siteSlug: ownProps.site ? /*getSiteSlug( state, ownProps.site.ID )*/'ddddd' : '',
// 	} ),
// 	{
// 		// onViewDetails: flow(
// 		// 	withAnalytics( bumpStat( 'editor_media_actions', 'edit_button_dialog' ) ),
// 		// 	withAnalytics( recordGoogleEvent( 'Media', 'Clicked Dialog Edit Button' ) ),
// 		// 	// partial( setEditorMediaModalView, ModalViews.DETAIL )
// 		// ),
// 		onResetPostSelected: flow(
// 				partial( resetPostSelected, state )
// 			)
// 	},
// 	function mergeProps( stateProps, dispatchProps, ownProps ) {
// 		//We want to overwrite connected props if 'onViewDetails', 'view' were provided
// 		return Object.assign(
// 			{},
// 			ownProps,
// 			stateProps,
// 			dispatchProps,
// 			pick( ownProps, [ 'onResetPostSelected', 'view' ] )
// 		);
// 	}
// )( localize( MediaModalSecondaryActions ) );
