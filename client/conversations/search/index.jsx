import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, bindAll, throttle } from 'lodash';
import AutoSizer from 'react-virtualized-auto-sizer';

import Popover from 'components/popover2';
import SearchInput from 'components/search-input';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';
// import {searchConversations} from "../../actions/conversation";
import CList from 'conversations/list';
import Timeline from 'blocks/conversation-timeline';

import g_styles from 'components/general-styles.scss';
import styles from '../style.scss';

class Search extends React.PureComponent {
	static propTypes = {
		selectedId: PropTypes.string,
	};

	constructor( props ) {
		super( props );

		bindAll( this, [ 'onSearchClose' ] );

		this.state = {
			appBannerHeightPx: 0,
		};
	}

	onSearchClose() {
		this.props.close();
	}

	_onSearch = term => {
		// console.log(term);
		this.props.onSearch( term );
	};

	handleContentScroll = () => {};

	handleChangeSelected = conversation => {
		this.props.onChangeSearchSelected && this.props.onChangeSearchSelected( conversation );
	};

	_loadMore = () => {
		console.log( 'load more...' );
	};

	renderContent() {
		const { searchData, selected, rows, keys } = this.props;
		// console.log('searchData', searchData);
		return (
			<div className={ g_styles.full_width_and_height }>
				{ React.createElement(
					AutoSizer,
					{
						style: {
							width: '100%',
							height: '100%',
						},
					},
					e => {
						return (
							<div className={ classNames( g_styles.d_flex, g_styles.flex_row ) }>
								<CList
									height={ e.height }
									width={ 350 }
									style={ {
										width: 350,
										height: e.height,
									} }
									fadeScrollbar={ true }
									onScroll={ this.handleContentScroll }
									selectedPageIds={ this.props.selectedPageIds }
									selectedPageId={ this.props.selectedPageId }
									loadConversations={ this._loadMore }
									rows={ searchData }
									onChangeSelected={ this.handleChangeSelected }
									isMultipleMode={ this.props.isMultipleMode }
									hideHeader={ true }
									selectedId={ this.props.selectedId }
								/>
								<div>
									<div className={ styles.conversation }>
										{ this.props.selected && (
											<Timeline
												conversation={ selected }
												conversationId={ selected.data.id }
												rows={ rows }
												keys={ keys }
												pendingMessages={ null }
												pageId={ selected.data.page_id }
												height={ e.height - 54 - 92 }
												width={ 450 }
												requestConversation={ this.props.requestConversation }
												requestMoreConversation={ this.props.requestMoreConversation }
												isLoadingOlder={ this.props.isLoadingOlder }
												isLoading={ this.props.isLoading }
												loadingError={ this.props.loadingError }
												onClickImage={ this.handleImageClick }
												onMessagePaneKeyDown={ this.onMessagePaneKeyDown }
												focusOrder={ 2 }
											/>
										) }
									</div>
								</div>
							</div>
						);
					}
				) }
			</div>
		);
	}

	render() {
		var r = {
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
		};

		var t = classNames( 'c-popover', 'c-search_modal', {
			'c-search_modal--autocomplete': true,
		} );

		return React.createElement(
			Popover,
			{
				ariaHideApp: false,
				ariaRole: 'dialog',
				ariaLabel: 'Search',
				isOpen: /*this.props.visible*/ true,
				position: 'top-left',
				targetBounds: r,
				onClose: this.onSearchClose,
				shouldFade: false,
				overlayClassName: t,
				allowanceX: 0,
				allowanceY: 0,
				shouldFocusAfterRender: true,
				shouldReturnFocusAfterClose: false,
				contentStyle: {
					marginTop: this.state.appBannerHeightPx,
				},
			},
			React.createElement(
				'div',
				{
					className: 'c-search__input_and_close',
				},
				React.createElement( SearchInput, {
					className: g_styles.no_margin,
					autoFocus: true,
					onSearch: this._onSearch,
					searching: this.props.isSearching,
				} ),
				React.createElement(
					UnstyledButton,
					{
						className: 'c-search__input_and_close__close',
						onClick: this.props.close,
						ariaLabel: 'Cancel',
						'data-qa': 'search_input_close',
					},
					React.createElement( Icon, {
						type: 'times',
					} )
				)
			),
			this.renderContent()
		);
	}
}

export default Search;
