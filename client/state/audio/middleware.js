/** @format */

/**
 * Internal dependencies
 */
import { RECEIVED_CONVERSATION_UPDATED } from 'state/action-types';

const isAudioSupported = () => typeof window === 'object' && typeof window.Audio === 'function';

export const playSound = src => {
	if ( ! isAudioSupported() ) {
		return;
	}

	const audioClip = new window.Audio( src );

	const playPromise = audioClip.play();
	if ( playPromise !== undefined ) {
		playPromise
			.then( function() {
				// Automatic playback started!
			} )
			.catch( function( error ) {
				console.log( error );
				// Automatic playback failed.
				// Show a UI element to let the user manually start playback.
			} );
	}
};

export const playSoundForMessageToCustomer = ( dispatch, { message } ) => {
	// If the customer sent the message, there's no
	// need to play a sound to the customer.
	if ( message && message.source === 'customer' ) {
		return;
	}

	playSound( '/papo/audio/chat-pling.wav' );
};

/**
 * Action Handlers
 */

// Initialized this way for performance reasons
export const handlers = Object.create( null );
handlers[ RECEIVED_CONVERSATION_UPDATED ] = playSoundForMessageToCustomer;

/**
 * Middleware
 */

export default ( { dispatch } ) => next => {
	if ( ! isAudioSupported() ) {
		return next;
	}

	return action => {
		const handler = handlers[ action.type ];
		if ( 'function' === typeof handler ) {
			handler( dispatch, action );
		}

		return next( action );
	};
};
