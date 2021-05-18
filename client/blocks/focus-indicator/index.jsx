import React from 'react';

export default class FocusIndicator extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			isVisible: true,
		};
		this.onMouseMove = this.onMouseMove.bind( this );
	}

	onMouseMove() {
		this.setState( function() {
			return {
				isVisible: false,
			};
		} );
	}

	render() {
		const t = React.createElement( 'div', {
			className: 'c-message_list__focus_indicator',
			onMouseMove: this.onMouseMove,
		} );
		return this.state.isVisible ? t : null;
	}
}
