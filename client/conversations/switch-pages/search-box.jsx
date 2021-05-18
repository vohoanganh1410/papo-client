import React from 'react';

export default class SearchBox extends React.PureComponent {
	handleChange = e => {
		if ( this.props.onChange ) {
			this.props.onChange( e );
		}
	};
	render() {
		return (
			<input
				className="p-jumper__input"
				autoFocus
				type="text"
				aria-label="sdfsd"
				spellCheck="false"
				aria-autocomplete="list"
				placeholder="Chuyển tới trang..."
				onChange={ this.handleChange }
			/>
		);
	}
}
