import React from 'react';
import classNames from 'classnames';

import SuggestionBox from 'components/suggestion-box';
import AutosizeTextarea from 'components/autosize-textarea';
import SuggestionList from 'components/suggestion-list';
import MessageProvider from 'components/suggestion-provider/quick-message';

export default class Composer extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {};

		this.suggestionProviders = [];

		this.suggestionProviders.push( new MessageProvider() );

		this.checkMessageLength( props.value );
	}

	checkMessageLength = message => {
		if ( this.props.handlePostError ) {
			if ( message.length > this.props.characterLimit ) {
				alert( 'Tin nhắn vượt quá giới hạn 1000 ký tự' );
				// const errorMessage = (
				//     <FormattedMessage
				//         id='create_post.error_message'
				//         defaultMessage='Your message is too long. Character count: {length}/{limit}'
				//         values={{
				//             length: message.length,
				//             limit: this.props.characterLimit,
				//         }}
				//     />);
				// this.props.handlePostError(errorMessage);
			} else {
				this.props.handlePostError( null );
			}
		}
	};

	handleChange = e => {
		this.props.onChange( e );
	};

	handleKeyDown = e => {
		if ( this.props.onKeyDown ) {
			this.props.onKeyDown( e );
		}
	};

	handleBlur = e => {
		if ( this.props.onBlur ) {
			this.props.onBlur( e );
		}
	};

	handleFocus = e => {
		if ( this.props.onFocus ) {
			this.props.onFocus( e );
		}
	};

	handleHeightChange = ( height, maxHeight ) => {
		// const wrapper = $(this.refs.wrapper);
		// // Move over attachment icon to compensate for the scrollbar
		// if (height > maxHeight) {
		//     wrapper.closest('.post-create').addClass('scroll');
		// } else {
		//     wrapper.closest('.post-create').removeClass('scroll');
		// }
	};

	focus = () => {
		// const textbox = this.refs.message.getTextbox();
		this.message && this.message.getTextbox().focus();

		// textbox.focus();
		//Utils.placeCaretAtEnd( this.message.getTextbox() );

		// reset character count warning
		// this.checkMessageLength(textbox.value);
	};

	blur = () => {
		// const textbox = this.refs.message.getTextbox();
		this.message && this.message.getTextbox().blur();
	};

	renderResultHeader = text => {
		return (
			<div id="chat_input_tab_ui_header" className="tab_complete_ui_header">
				<span id="chat_input_tab_ui_header_query">
					Các tin nhắn với “<strong>{ text }</strong>”
				</span>
				<span className="header_help">
					<strong>↑</strong> <strong>↓</strong> lên xuóng
					<span className="left_margin">
						<strong>tab</strong> hoặc <strong>↵</strong> để chọn
					</span>
					<span className="left_margin">
						<strong>esc</strong> thoát
					</span>
				</span>
			</div>
		);
	};

	render() {
		const textboxClassName = classNames( 'form-control custom-textarea', this.props.className );
		return (
			<div ref="wrapper" className="textarea-wrapper">
				<SuggestionBox
					id={ this.props.id }
					ref={ message => {
						this.message = message;
					} }
					className={ textboxClassName }
					listClass="tab_complete_ui"
					spellCheck="false"
					placeholder={ this.props.createMessage }
					onChange={ this.handleChange }
					onKeyPress={ this.props.onKeyPress }
					onKeyDown={ this.handleKeyDown }
					onBlur={ this.handleBlur }
					onFocus={ this.handleFocus }
					onHeightChange={ this.handleHeightChange }
					style={ { visibility: /*this.state.preview ? 'hidden' : */ 'visible' } }
					inputComponent={ AutosizeTextarea }
					listComponent={ SuggestionList }
					listStyle={ this.props.suggestionListStyle }
					providers={ this.suggestionProviders }
					channelId={ this.props.channelId }
					value={ this.props.value }
					renderDividers={ true }
					isRHS={ this.props.isRHS }
					disabled={ this.props.disabled }
					snippets={ this.props.snippets }
					displaySuggestion={ this.props.displaySuggestion }
					renderNoResults={ false }
					resultHeaderRenderer={ this.renderResultHeader }
				/>
			</div>
		);
	}
}
