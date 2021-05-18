/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { identity } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';

const InviteAction = ( {
	sending,
	onAction,
	translate,
} ) => {
	let label;
	const onClick = event => {
		event.stopPropagation();
		onAction();
	};
	// const isAcceptingInvite = sending == true;
	if ( 'pendding' === sending ) {
		label = translate( 'Accept', {
			context: 'Sharing: Publicize reconnect pending button label',
		} );
	}
	else {
		label = translate( 'Accept', {
			context: 'Sharing: Publicize reconnect pending button label',
		} );
	}
	return (
		<Button
			primary={ true }
			compact
			onClick={ onClick }
			disabled={ sending }
		>
			{ label }
		</Button>
	);
}

export default connect( ( state, { service } ) => ( {
	removableConnections: /*getRemovableConnections( state, service.ID )*/null,
} ) )( localize( InviteAction ) );


