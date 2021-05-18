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
import PopoverMenuItem from 'components/popover/menu-item';

import { preload } from 'sections-preload';
function preloadEditor() {
	preload( 'post-editor' );
}

function OrderActionsEllipsisMenuComment( { translate, canEdit, status, editUrl, bumpStat } ) {
	// if ( 'trash' === status || ! canEdit ) {
	// 	return null;
	// }

	return (
		<PopoverMenuItem
			href={ editUrl }
			onClick={ bumpStat }
			icon="chat"
			onMouseOver={ preloadEditor }
		>
			{ translate( 'Thêm ghi chú', { context: 'verb' } ) }
		</PopoverMenuItem>
	);
}

OrderActionsEllipsisMenuComment.propTypes = {
	globalId: PropTypes.string,
	translate: PropTypes.func,
	canEdit: PropTypes.bool,
	status: PropTypes.string,
	editUrl: PropTypes.string,
	bumpStat: PropTypes.func,
};

const mapStateToProps = ( state, { globalId } ) => {
	const post = /*getPost( state, globalId )*/null;
	// if ( ! post ) {
	// 	return {};
	// }

	return {
		canEdit: /*canCurrentUserEditPost( state, globalId )*/true,
	};
};

export default connect( mapStateToProps )(
	localize( OrderActionsEllipsisMenuComment )
);