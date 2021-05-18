import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { filter } from 'lodash';

import PageItem from 'conversations/switch-pages/page-item';
import Icon from 'components/icon2';
import UnstyledButton from 'components/button2/unstyled-button';
import WithTooltip from 'blocks/with-tooltip';
import Searchbox from 'components/searchbox';
import Button from 'components/button';
import PageSearch from 'blocks/page-search';
import { getAvatarURL } from 'lib/facebook/utils';

import g_style from 'components/general-styles.scss';
import styles from './style.scss';

export default class FilterBar extends React.PureComponent {
	static propTypes = {
		pages: PropTypes.arrayOf( PropTypes.object ).isRequired,
	};

	constructor( props ) {
		super( props );

		this.state = {
			isSearchFocus: false,
		};
	}

	_onFocusSearch = () => {
		this.setState( {
			isSearchFocus: true,
		} );
	};

	_onBlur = () => {
		this.setState( {
			isSearchFocus: false,
		} );
	};

	renderSearchBox = () => {
		const classes = classNames( styles.search_container, {
			[ styles.search_focus ]: this.state.isSearchFocus,
		} );

		return (
			<Searchbox
				className={ classes }
				inputClassName={ styles.search_input_container }
				placeholder="Tìm kiếm"
				onFocus={ this._onFocusSearch }
				onBlur={ this._onBlur }
				close={ this.props.close }
			/>
		);
	};

	renderViewTypes = () => {
		const classes = classNames( styles.view_types_buttons, {
			[ styles.search_focus ]: this.state.isSearchFocus,
		} );
		return (
			<div className={ classes }>
				<UnstyledButton className={ classNames( styles.view_types_button, styles.active ) }>
					<Icon type="th-large" />
				</UnstyledButton>
				<UnstyledButton className={ styles.view_types_button }>
					<Icon type="bullet_list" />
				</UnstyledButton>
			</div>
		);
	};

	renderUploadBar = () => {
		return (
			<div>
				<Button compact>sdfsdf</Button>
				<Button compact>sdfsdf</Button>
			</div>
		);
	};

	_renderPageItem = ( _page, match, selected ) => {
		return (
			<PageItem
				key={ _page.page_id }
				page={ _page }
				data-id={ _page.page_id }
				selected={ selected }
				match={ match }
			/>
		);
	};

	_onClickRemove = value => {
		if ( ! value.currentTarget.dataset.id ) {
			return;
		}

		this.setState( {
			selectedPages: filter(
				this.state.selectedPages,
				_p => _p.data.page_id !== value.currentTarget.dataset.id
			),
		} );
	};

	_renderTokenContent = value => {
		const imageURL = getAvatarURL( value.data.page_id );
		return (
			<div className={ classNames( g_style.d_flex, g_style.v_center ) }>
				<div className={ styles.token_field__token_text }>
					<img alt={ value.data.name } src={ imageURL } className={ styles.page__img } />
					<UnstyledButton
						data-id={ value.data.page_id }
						className={ styles.token_field__remove_token }
						onClick={ this._onClickRemove }
					>
						<Icon type="times" />
					</UnstyledButton>
				</div>
			</div>
		);
	};

	_renderToken = token => {
		if ( ! token || ! token.data ) return null;

		return (
			<span tabIndex={ -1 }>
				<WithTooltip
					tooltip={ token.data.name }
					contentRenderer={ this._renderTokenContent( token ) }
				/>
			</span>
		);
	};

	_onTokensChange = value => {
		this.setState( {
			selectedPages: value,
		} );
	};

	renderPageSelect = () => {
		if ( ! this.props.pages || this.props.pages.length === 0 ) {
			return null;
		}

		const availablePages = filter( this.props.pages, function( _p ) {
			return _p.data.status === 'initialized' || _p.data.status === 'initializing';
		} );

		return (
			<PageSearch
				pages={ availablePages }
				SuggestionItemRenderer={ this._renderPageItem }
				hideNotificationBar={ true }
				isExpanded={ false }
				suggestionsListClasses={ styles.pages_list_container }
				inputContainerClasses={ styles.page_filter_list_container }
				inputIcon="facebook"
				renderAsDropdown={ true }
				tokenRenderer={ this._renderToken }
				onChange={ this._onTokensChange }
				selectedPages={ this.state.selectedPages }
				ref="searchbox"
				forceFocus={ false }
			/>
		);
	};

	render() {
		return (
			<div className={ styles.filter_bar_container }>
				<div>
					<div style={ { marginRight: 'auto' } }>{ this.renderPageSelect() }</div>
					{ this.renderSearchBox() }
					{ this.renderViewTypes() }
				</div>
			</div>
		);
	}
}
