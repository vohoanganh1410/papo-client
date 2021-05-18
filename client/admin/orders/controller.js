import OrdersComponent from './main';
import React from 'react';

export function makeOrdersComponent( context, next ) {
	context.primary = React.createElement( OrdersComponent, {
		path: context.path,
		query: context.query,
	} );

	next();
}
