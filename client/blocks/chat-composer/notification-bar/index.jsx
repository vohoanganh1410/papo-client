import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';
import { defineMessages, intlShape } from 'react-intl';

import Icon from 'components/icon2';
import Tooltip from 'components/tooltip2';
import Button from 'components/button2';

const holders = defineMessages( {
	suggestionStatusMessage: {
		id: 'conversations.suggestion.status.message',
		defaultMessage: 'Suggestion box is currently {currentStatus}. Press Ctrl+/ to {nextStatus}',
	},
} );

export default class NotificationBar extends React.PureComponent {
	static displayName = 'NotificationBar';
	static propTypes = {
		wasRecentlyOnline: PropTypes.bool,
		typingNames: PropTypes.array,
		snippetCallback: PropTypes.func,
		tooLongCount: PropTypes.number,
		inputHasText: PropTypes.bool,
		showFormattingHint: PropTypes.bool,
	};

	static defaultProps = {
		wasRecentlyOnline: true,
		typingNames: null,
		snippetCallback: noop,
		tooLongCount: 0,
		inputHasText: false,
		showFormattingHint: false,
	};

	static contextTypes = {
		intl: intlShape,
	};

	renderLeft = () => {
		const t = this.props,
			a = t.wasRecentlyOnline,
			r = t.typingNames,
			i = t.inputHasText;
		if ( ! a ) {
			const s = i
				? 'Slack is trying to connect, so messages can\u2019t be sent yet.'
				: 'Slack is trying to connect.';
			return React.createElement(
				'span',
				{
					id: 'msg_input_info',
					className: 'p-notification_bar__offline',
					'aria-live': 'polite',
				},
				s,
				' ',
				React.createElement( Icon, {
					type: 'cloud-offline-small-filled',
					className: 'p-notification_bar__offline_icon',
				} )
			);
		}
		// if (r && r.length > 0) {
		// 	let o = "several people are typing";
		// 	1 === r.length ? o = T.rt("<b>{name}</b> is typing", {
		// 		name: r[0]
		// 	}) : 2 === r.length && (o = T.rt("<b>{name}</b> and <b>{other_name}</b> are typing", {
		// 		name: r[0],
		// 		other_name: r[1]
		// 	}));
		// 	return n.a.createElement("div", {
		// 		role: "status",
		// 		"aria-live": "polite",
		// 		"aria-atomic": "true",
		// 		className: "p-notification_bar__typing"
		// 	}, o)
		// }
		return null;
	};

	renderRight = () => {
		const t = this.props,
			a = t.wasRecentlyOnline,
			r = t.snippetCallback,
			i = t.tooLongCount;

		const { formatMessage } = this.context.intl;

		const isEnable = this.props.shouldDisplaySuggestionBox === true;
		const currentStatus = isEnable
			? formatMessage( { id: 'general.is_on', defaultMessage: 'On' } )
			: formatMessage( { id: 'general.is_off', defaultMessage: 'Off' } );
		const nextStatus = isEnable
			? formatMessage( { id: 'general.is_off', defaultMessage: 'Off' } )
			: formatMessage( { id: 'general.is_on', defaultMessage: 'On' } );

		const suggestionStatusMessage = formatMessage( holders.suggestionStatusMessage, {
			currentStatus: currentStatus,
			nextStatus: nextStatus,
		} );

		if ( a && i > 0 ) {
			const s =
				'Your message is {diff_count, plural, =1{# character}other{# characters}} too long.';
			const o = 'Make a snippet instead?';
			const l = 'A snippet is a text file that can be much longer than a normal message.';
			return React.createElement(
				'div',
				null,
				React.createElement( 'span', null, s, ' ' ),
				React.createElement(
					Tooltip,
					{
						tip: l,
					},
					React.createElement(
						'span',
						null,
						React.createElement(
							Button,
							{
								tabIndex: '5',
								onClick: r,
							},
							o
						)
					)
				)
			);
		}
		const c = ( function() {
			if ( ! a ) return '';
			//if (C["c"]) return T.rt("<b>\uff0abold\uff0a</b> <code>\uff40code\uff40</code> <code>\uff40\uff40\uff40preformatted\uff40\uff40\uff40</code> <span>\uff1equote</span>");
			return <span>{ suggestionStatusMessage }</span>;
		} )();
		return React.createElement(
			'span',
			{
				className: 'p-notification_bar__formatting',
				'aria-hidden': 'true',
			},
			c
		);
	};

	render() {
		const t = this.props,
			a = t.showFormattingHint,
			r = t.wasRecentlyOnline,
			i = t.tooLongCount;
		const s = classNames( 'p-notification_bar__section', 'p-notification_bar__section--right', {
			'p-notification_bar__section--is-visible': r && ( a || i > 0 ),
		} );
		return React.createElement(
			'div',
			{
				className: 'p-notification_bar',
			},
			React.createElement(
				'div',
				{
					className: 'p-notification_bar__section p-notification_bar__section--left',
				},
				this.renderLeft()
			),
			React.createElement(
				'div',
				{
					className: s,
				},
				this.renderRight()
			)
		);
	}
}
