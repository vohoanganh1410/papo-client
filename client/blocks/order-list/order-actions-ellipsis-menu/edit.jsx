/** @format */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { getPost } from 'state/posts/selectors';
import PopoverMenuItem from 'components/popover/menu-item';
import { preload } from 'sections-preload';

function preloadEditor() {
	preload( 'post-editor' );
}

function OrderActionsEllipsisMenuEdit( { translate, canEdit, status, editUrl, bumpStat } ) {
	// if ( 'trash' === status || ! canEdit ) {
	// 	return null;
	// }

	return (
		<PopoverMenuItem
			href={ editUrl }
			onClick={ bumpStat }
			icon="pencil"
			onMouseOver={ preloadEditor }
		>
			{ translate( 'Sửa thông tin', { context: 'verb' } ) }
		</PopoverMenuItem>
	);
}

OrderActionsEllipsisMenuEdit.propTypes = {
	globalId: PropTypes.string,
	translate: PropTypes.func,
	canEdit: PropTypes.bool,
	status: PropTypes.string,
	editUrl: PropTypes.string,
	bumpStat: PropTypes.func,
};

const mapStateToProps = ( state, { globalId } ) => {
	const post = getPost( state, globalId );
	if ( ! post ) {
		return {};
	}

	return {
		canEdit: /*canCurrentUserEditPost( state, globalId )*/true,
		status: post.status,
		type: post.type,
		editUrl: '/edit/order/' +  post.ID ,
	};
};

export default connect( mapStateToProps )(
	localize( OrderActionsEllipsisMenuEdit )
);