import React from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

import Icon from 'components/icon2';
import WithDropdown from 'blocks/with-dropdown';
import UnstyledButton from 'components/button2/unstyled-button';
import MenuWrapper from 'components/menu/menu-wrapper';
import Menu from 'components/menu';
// import styles from './style.scss';

export default class Emoji extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.trigger = React.createRef();
	}

	renderEmojiContent = () => {
		return (
			<Menu ariaLabel="emoji" openUp={ true } openLeft={ true }>
				<Picker set="facebook" sheetSize={ 32 } color={ '#008952' } title={ 'Papo' } />
			</Menu>
		);
	};

	renderEmojiBtn = () => {
		return (
			<UnstyledButton>
				<Icon type={ 'smile_o' } />
			</UnstyledButton>
		);
	};

	render() {
		// return(
		// 	<WithDropdown
		// 		contentRenderer={this.renderEmojiBtn}
		// 		dropdownRenderer={this.renderEmojiContent}
		// 		dropdownPosition={"top-right"}/>
		// )

		return (
			<MenuWrapper>
				{ this.renderEmojiBtn() }
				{ this.renderEmojiContent() }
			</MenuWrapper>
		);
	}
}
