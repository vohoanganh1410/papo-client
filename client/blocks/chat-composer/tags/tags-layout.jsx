import React from 'react';
import { takeRight, forEach, filter } from 'lodash';
import AutoSizer from 'react-virtualized-auto-sizer';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import wrapWithClickOutside from 'react-click-outside';
import clickOutside from 'click-outside';
import AddItem from 'papo-components/AddItem';
import Text from 'papo-components/Text';

import Layout from 'components/horizontal-layout/layout';
import HorizontalItem from 'components/horizontal-layout/item';
import ConversationActionButton from 'conversations/action-button';
import MoreTagItem from './more-item';

import MenuWrapper from 'components/menu/menu-wrapper';
import Menu from 'components/menu';
import MenuGroup from 'components/menu/menu-group';
import Icon from 'components/icon2';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

const TAG_ACTION_BUTTON_WIDTH = 32;

class TagsLayout extends React.PureComponent {
	static displayName = 'TagsLayout';

	constructor( props ) {
		super( props );

		this.layout = props.layout || new Layout();
		this.layout.setKeys( props.keys );

		this.setWidth = this.setWidth.bind( this );
		this.setDOMBehavior = this.setDOMBehavior.bind( this );
		this.tags = [];
		this.moreTags = [];
		this.actionsWidth = 0;
		this.unwantedWidth = 0;
		this.renderedWidth = 0;

		this.state = {
			availableItems: this.layout.keys.length,
			autoSort: true,
			showMyTags: true,
		};
	}

	componentDidUpdate() {
		this.reLayout();

		if ( this.unwantedWidth > 0 ) {
			const add = this.unwantedWidth;
			this.layout.ajustItemWidth( this.tags, add );
		}
	}

	componentWillReceiveProps( nextProps ) {
		this.props.keys !== nextProps.keys && this.layout.setKeys( nextProps.keys );
		this.setState( {
			availableItems: nextProps.keys.length,
		} );

		this.reLayout();
	}

	bindClickoutHandler( el = this.domContainer ) {
		if ( ! el ) {
			return null;
		}

		if ( this._clickoutHandlerReference ) {
			return null;
		}

		this._clickoutHandlerReference = clickOutside( el, this.onClickout );
	}

	unbindClickoutHandler() {
		if ( this._clickoutHandlerReference ) {
			this._clickoutHandlerReference();
			this._clickoutHandlerReference = null;
		}
	}

	setDOMBehavior( domContainer ) {
		if ( ! domContainer ) {
			this.unbindClickoutHandler();
			return null;
		}

		this.bindClickoutHandler( domContainer );
		// store DOM element referencies
		this.domContainer = domContainer;
	}

	onClickout = () => {
		if ( ! this.props.editMode ) return null;
		this.props.onEditModeChange && this.props.onEditModeChange( false );
	};

	setWidth( r, a ) {
		if ( ! r ) return;
		if ( Math.abs( a - this.layout.getWidth( r ) ) < 0.5 ) return;
		this.layout.setWidth( r, a );
		this.reLayout();
	}

	reLayout = () => {
		const { width } = this.props;
		const _actionWidth = this.calculateActionsWidth();
		let r = 0;
		for ( let i = 0; i < this.layout.keys.length; i++ ) {
			r += this.layout.getWidth( this.layout.keys[ i ] );

			if ( r < width - _actionWidth - 33 ) {
				this.setState(
					{
						availableItems: i,
					},
					() => {
						return r;
					}
				);
				// break;
				this.renderedWidth = r;
			}
		}

		this.actionsWidth = _actionWidth;
		this.unwantedWidth = width - r;

		return this.layout.keys.length;
	};

	getLeft( r ) {
		return this.layout.getLeft( r );
	}

	renderItem = key => {
		const n = this.getLeft( key );
		const a = this.layout.getWidth( key );
		const s = this.layout.getWidthValidity( key );

		return (
			<HorizontalItem
				id={ key }
				key={ key }
				width={ a }
				style={ {
					left: n,
				} }
				validity={ s }
				onWidthChange={ this.setWidth }
			>
				{ this.props.itemRenderer( key ) }
			</HorizontalItem>
		);
	};

	renderNoTags = () => {
		return (
			<div className={ g_styles.d_flex } style={ { width: this.props.width } }>
				<div className={ styles.tags__bar } style={ { width: this.props.width - 100 } }>
					<span className={ styles.empty_tag_txt }>
						<AddItem
							data-id="createTag"
							onClick={ () => {
								this.props.handleTagActionClick( 'createTag' );
							} }
							size="tiny"
							theme="plain"
							style={ { padding: '0 10px' } }
							alignItems="left"
						>
							<Text>Tạo nhãn</Text>
						</AddItem>
					</span>
				</div>
			</div>
		);
	};

	renderTags = tags => {
		const o = [];
		if ( ! tags || tags.length === 0 ) {
			o.push( this.renderNoTags() );
			return o;
		}

		tags.map( ( item, index ) => {
			o.push( this.renderItem( item, index ) );
		} );

		return o;
	};

	handleTagAction = tag => {
		const tagName = tag.currentTarget.dataset.id;

		if ( tagName && tagName.length > 0 && this.props.handleTagActionClick ) {
			this.props.handleTagActionClick( tagName );
		}
	};

	renderTagAction = tag => {
		const classes = classNames( styles.tag_action_btn, g_styles.blue_on_hover, {
			[ styles.tag_action_selected ]: tag.active,
		} );

		return (
			<ConversationActionButton
				className={ classes }
				key={ tag.name }
				name={ tag.name }
				data-id={ tag.name }
				description={ tag.description }
				onClick={ this.handleTagAction }
				icon={ tag.icon }
				iconClasses="tag_action"
				tooltipPosition="top"
			/>
		);
	};

	calculateActionsWidth = () => {
		let width = 0;
		width += TAG_ACTION_BUTTON_WIDTH; // edit tag button
		width += TAG_ACTION_BUTTON_WIDTH; // create tag button
		width += TAG_ACTION_BUTTON_WIDTH; // settings button

		return width;
	};

	renderMoreTagsAndActions = () => {
		if ( ! this.tags || this.tags.length === 0 ) return null;
		const actions = [
			{
				name: 'createTag',
				description: 'Thêm nhãn',
				icon: 'plus_circle',
			},
			{
				name: 'editTag',
				description: 'Chỉnh sửa nhãn',
				icon: 'compose_dm',
				active: this.props.editMode,
			},
		];

		return (
			<div
				className={ g_styles.d_flex }
				style={ {
					position: 'absolute',
					left: this.width - this.actionsWidth,
					width: this.actionsWidth,
					height: 27,
					boxSizing: 'border-box',
					justifyContent: 'flex-end',
				} }
			>
				{ actions.map( this.renderTagAction ) }
				{ this.renderSettingButton() }
			</div>
		);
	};

	toggleAutoSort = () => {
		this.setState(
			{
				autoSort: ! this.state.autoSort,
			},
			() => {
				this.props.onSortTagsChanged && this.props.onSortTagsChanged( this.state.autoSort );
			}
		);
	};

	toggleShowMyTags = () => {
		this.setState( {
			showMyTags: ! this.state.showMyTags,
		} );
	};

	renderSettingButton = () => {
		return (
			<MenuWrapper>
				<ConversationActionButton
					className={ styles.conversation__tags }
					key={ 'tagSettings' }
					name={ 'tagSettings' }
					data-id={ 'tagSettings' }
					description={ 'Thiết lập' }
					icon={ 'cog_o' }
					iconClasses="tag_action"
					tooltipPosition="top"
				/>
				<div>
					<Menu
						className={ styles.more_tags__dropdown }
						ariaLabel="more-tags"
						openUp={ true }
						openLeft={ true }
					>
						<MenuGroup className={ g_styles.full_width_and_height }>
							<div
								role={ 'button' }
								className={ classNames( g_styles.menu_dropdown_item, g_styles.d_flex ) }
								onClick={ this.toggleAutoSort }
							>
								<div className={ styles.setting_menu_check_icon_holder }>
									{ this.state.autoSort && <Icon type="form_checkbox_check" /> }
								</div>
								<span>Tự động sắp xếp nhãn</span>
							</div>
							<div
								role={ 'button' }
								className={ classNames( g_styles.menu_dropdown_item, g_styles.d_flex ) }
								onClick={ this.toggleShowMyTags }
							>
								<div className={ styles.setting_menu_check_icon_holder }>
									{ this.state.showMyTags && <Icon type="form_checkbox_check" /> }
								</div>
								<span>Hiển thị nhãn của tôi</span>
							</div>
						</MenuGroup>
					</Menu>
				</div>
			</MenuWrapper>
		);
	};

	handleMoreItemClick = tag => {
		this.props.handleTagClick && this.props.handleTagClick( tag );
	};

	renderMoreItem = t => {
		if ( ! this.props.columns || this.props.columns.length === 0 ) return null;
		const r = filter( this.props.columns, _item => _item.data.id === t );
		if ( ! r ) return null;
		const item = r[ 0 ].data;

		return <MoreTagItem tag={ item } handleMoreItemClick={ this.handleMoreItemClick } />;
	};

	renderMoreList = () => {
		return (
			<Menu
				className={ styles.more_tags__dropdown }
				ariaLabel="more-tags"
				openUp={ true }
				openLeft={ true }
			>
				<MenuGroup className={ g_styles.full_width_and_height }>
					<div>{ this.moreTags.map( this.renderMoreItem ) }</div>
				</MenuGroup>
			</Menu>
		);
	};

	renderMoreTagsBtn = () => {
		return (
			<ConversationActionButton
				className={ styles.conversation__tags }
				key={ 'more_tags' }
				name={ 'more_tags' }
				data-id={ 'more_tags' }
				icon={ 'ellipsis' }
				iconClasses="tag_action"
				tooltipPosition="top"
			/>
		);
	};

	renderMoreTags = () => {
		if ( this.moreTags.length === 0 ) {
			return null;
		}

		return (
			<MenuWrapper style={ { left: this.renderedWidth, position: 'absolute' } }>
				{ this.renderMoreTagsBtn() }
				<div>{ this.renderMoreList() }</div>
			</MenuWrapper>
		);
	};

	renderNotification = () => {
		if ( ! this.props.editMode || this.props.editTag ) return null;
		return (
			<div className={ classNames( g_styles.p_absolute, styles.tag_notification_container ) }>
				<FormattedMessage
					id="conversations.edit_tag_message"
					defaultMessage="Click on any tag to start editing."
				/>
			</div>
		);
	};

	render() {
		const { keys, width } = this.props;

		let totalWidth = 0;
		const tags = [],
			moreTags = [];

		forEach( keys, key => {
			totalWidth += this.layout.getWidth( key );
			// const actionsWidth = this.calculateActionsWidth();
			if ( totalWidth < width - this.actionsWidth - 33 ) {
				this.renderedWidth = totalWidth;
				tags.push( key );
			} else {
				moreTags.push( key );
			}
		} );

		this.tags = tags;
		this.moreTags = moreTags;

		const o = this.renderTags( tags );

		return React.createElement(
			AutoSizer,
			{
				disableHeight: true,
			},
			e => {
				const a = e.width,
					r = e.height;
				if ( 0 === a || 0 === r ) return null;
				if ( a !== this.height ) {
					this.layout.widthCache.invalidate();
					// this.reLayout();
					this.width = a;
				}
				this.height = r;

				return React.createElement(
					'div',
					{
						style: {
							display: 'flex',
							width: '100%',
							zIndex: 1,
							height: 27,
						},
						ref: this.setDOMBehavior,
					},
					React.createElement(
						'div',
						{
							className: g_styles.d_flex,
							style: {
								marginRight: 'auto',
								width: this.width - this.actionsWidth - 33,
								height: 27,
							},
						},
						o.concat( [ this.moreTags.length > 0 && this.renderMoreTags() ] )
					),
					this.renderMoreTagsAndActions( moreTags ),
					this.renderNotification()
				);
			}
		);
	}
}

export default wrapWithClickOutside( TagsLayout );
