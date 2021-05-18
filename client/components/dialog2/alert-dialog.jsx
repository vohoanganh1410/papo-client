import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { noop, omit } from 'lodash';

import BaseDialog from 'components/dialog2/base-dialog';

export default createReactClass( {
	displayName: 'AlertDialog',

	propTypes: {
		children: PropTypes.any.isRequired,
		cancelButtonText: PropTypes.string,
		'data-qa': PropTypes.string,
		goButtonText: PropTypes.string,
		goButtonType: PropTypes.string,
		onCancel: PropTypes.func,
		onClose: PropTypes.func,
		onGo: PropTypes.func,
		showCancelButton: PropTypes.bool,
		title: PropTypes.string,
		truncateTitle: PropTypes.bool,
	},

	getDefaultProps() {
		return {
			cancelButtonText: null,
			'data-qa': 'alert_dialog',
			goButtonText: null,
			goButtonType: 'primary',
			onCancel: noop,
			onClose: noop,
			onGo: noop,
			showCancelButton: false,
			title: null,
			truncateTitle: true,
		};
	},

	render() {
		const e = this.props;
		const t = e.children,
			a = e.cancelButtonText,
			r = e[ 'data-qa' ],
			i = e.goButtonText,
			o = omit( e, [ 'children', 'cancelButtonText', 'data-qa', 'goButtonText' ] );
		return React.createElement(
			BaseDialog,
			Object.assign(
				{
					cancelText: a || 'Cancel',
					'data-qa': r,
					goButtonText: i || 'OK',
					role: 'alertdialog',
				},
				o
			),
			t
		);
	},
} );
