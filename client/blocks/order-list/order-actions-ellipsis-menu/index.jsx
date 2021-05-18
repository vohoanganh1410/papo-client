/** @format */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { Children, cloneElement } from 'react';

/**
 * Internal dependencies
 */
import EllipsisMenu from 'components/ellipsis-menu';
import PopoverMenuSeparator from 'components/popover/menu-separator';
import OrderActionsEllipsisMenuEdit from './edit';
import OrderActionsEllipsisMenuAssign from './assign';
import OrderActionsEllipsisMenuTrash from './trash';
import OrderActionsEllipsisMenuComment from './comments';

export default function OrderActionsEllipsisMenu( { globalId, includeDefaultActions, children } ) {
	let actions = [];

	if ( includeDefaultActions ) {
		actions.push(
			<OrderActionsEllipsisMenuEdit key="edit" />,
			<OrderActionsEllipsisMenuAssign key="assign" />,
			<OrderActionsEllipsisMenuComment key="comment" />,
			<OrderActionsEllipsisMenuTrash key="trash" />,

		);
	}

	return (
		<div className="post-actions-ellipsis-menu">
			<EllipsisMenu position="bottom left" disabled={ ! globalId }>
				{ actions.map( action => cloneElement( action, { globalId } ) ) }
			</EllipsisMenu>
		</div>
	);
}

OrderActionsEllipsisMenu.propTypes = {
	globalId: PropTypes.string,
	includeDefaultActions: PropTypes.bool,
};

OrderActionsEllipsisMenu.defaultProps = {
	includeDefaultActions: true,
};
