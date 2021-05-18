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

function OrderActionsEllipsisMenuAssign( { translate, canEdit, status, editUrl, bumpStat } ) {
	// if ( 'trash' === status || ! canEdit ) {
	// 	return null;
	// }

	return (
		<PopoverMenuItem
			href={ editUrl }
			onClick={ bumpStat }
			icon="share"
			onMouseOver={ preloadEditor }
		>
			{ translate( 'Phân bổ', { context: 'verb' } ) }
		</PopoverMenuItem>
	);
}

OrderActionsEllipsisMenuAssign.propTypes = {
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
	localize( OrderActionsEllipsisMenuAssign )
);