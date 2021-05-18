import React from 'react';
import classNames from 'classnames';
import { moment } from 'i18n-calypso';
import styles from 'blocks/conversation-item/style.scss';

function getDisplayedTimeFromConversation( _time ) {
	if ( ! _time ) {
		// Placeholder text: "a few seconds ago" in English locale
		return moment().fromNow();
	}

	const time = moment( _time );
	if ( time.isBefore( moment().subtract( 2, 'days' ) ) ) {
		// Like "Mar 15, 2013 6:23 PM" in English locale
		return time.format( 'DD/MM' );
	}

	if ( time.isBefore( moment().subtract( 1, 'days' ) ) ) {
		// Like "Mar 15, 2013 6:23 PM" in English locale
		return time.format( 'HH:mm' ) + ' h.qua';
	}

	// Like "3 days ago" in English locale
	return time.format( 'HH:mm' );
}

export function ConversationTime( { time, className } ) {
	if ( ! time ) {
		// Placeholder text: "a few seconds ago" in English locale
		return moment().fromNow();
	}

	const timeClasses = classNames( styles.time__value, className );

	return (
		<div className={ styles.post_time }>
			<span className={ timeClasses }>{ getDisplayedTimeFromConversation( time ) }</span>
		</div>
	);
}

export default ConversationTime;
