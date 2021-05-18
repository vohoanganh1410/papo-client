import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon from 'components/icon2';
import LoadingSpinner from 'components/loading/spinner';
import WithTooltip from 'blocks/with-tooltip';
import { getAvatarURL } from 'lib/facebook/utils';
import g_styles from 'components/general-styles.scss';
import styles from './style.scss';
import s_styles from 'components/token-field/style.scss';

class PageItem extends React.Component {
	static propTypes = {
		page: PropTypes.object,
		onSelect: PropTypes.func,
	};

	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick = e => {
		if ( this.props.onClick ) {
			this.props.onClick( e );
		}
	};

	renderMetaItemContent = ( { tooltip, icon, value } ) => {
		const content = (
			<span>
				<Icon className={ styles.meta_icon } type={ icon } />
				{ value }
			</span>
		);

		return <WithTooltip contentRenderer={ content } tooltip={ tooltip } />;
	};

	renderMeta = () => {
		const { page } = this.props;
		// console.log( "page", page );
		if ( page.data.status !== 'initializing' || ! page.init ) {
			return null;
		}

		const spinner = (
			<span>
				<LoadingSpinner size="small" speed="normal" />
			</span>
		);

		return (
			<div className={ classNames( g_styles.d_flex, g_styles.v_center ) }>
				<div className={ styles.init_meta_item }>
					{ page.init &&
						this.renderMetaItemContent( {
							tooltip: 'Bài viết',
							icon: 'th_large',
							value: page.init.post_count,
						} ) }
				</div>
				<div className={ styles.init_meta_item }>
					{ page.init &&
						this.renderMetaItemContent( {
							tooltip: 'Hội thoại',
							icon: 'user_groups',
							value: page.init.conversation_count,
						} ) }
				</div>
				<div className={ styles.init_meta_item }>
					{ page.init &&
						this.renderMetaItemContent( {
							tooltip: 'Tin nhắn',
							icon: 'envelope-o',
							value: page.init.message_count,
						} ) }
				</div>
				<div className={ styles.init_meta_item }>
					{ page.init &&
						this.renderMetaItemContent( {
							tooltip: 'Bình luận',
							icon: 'comment-alt',
							value: page.init.comment_count,
						} ) }
				</div>
				<WithTooltip tooltip="Đang khởi tạo" contentRenderer={ spinner } />
			</div>
		);
	};

	render() {
		const { page, match, selected } = this.props;
		if ( ! page ) {
			return null;
		}
		const imageURL =
			page && page.data ? getAvatarURL( page.data.page_id, 50, page.data.access_token ) : null;
		const props = selected === true ? { tabIndex: -1, 'aria-selected': true } : {};
		const rowClass = classNames( styles.p_jumper__row, {
			[ styles.highlighted ]: selected === true,
		} );

		return (
			<div
				role="option"
				data-id={ page.data.page_id }
				className={ rowClass }
				onClick={ this.handleClick }
				{ ...props }
			>
				<div
					className={ classNames(
						styles.item_details,
						styles.p_jumper__item_details,
						g_styles.overflow_ellipsis
					) }
				>
					<div
						className={ classNames(
							g_styles.d_flex,
							g_styles.v_center,
							g_styles.full_width_and_height
						) }
					>
						{ /*
							<div title="away">
								<i aria-hidden="true" className="ts_icon ts_icon_presence presence_icon" />
							</div>
							 */ }
						<div className={ styles.page_img_container } aria-hidden="true">
							<img alt={ page.data.name } src={ imageURL } className={ styles.page__img } />
						</div>
						<div
							className="c-unified_member__name c-unified_member__name--small"
							style={ { marginRight: 'auto', maxWidth: '55%' } }
						>
							<span className={ styles.page_item_txt }>
								{ match ? (
									<span>
										{ match.suggestionBeforeMatch }
										<strong className={ s_styles.token_field__suggestion_match }>
											{ match.suggestionMatch }
										</strong>
										{ match.suggestionAfterMatch }
									</span>
								) : (
									page.data.name
								) }
								{ /*page.data.status === 'initializing' && (
									<em>
										<small> (Đang khởi tạo...)</small>
									</em>
								) */ }
								{ page.data.status === 'queued' && (
									<em>
										<small> (Đang chờ khởi tạo...)</small>
									</em>
								) }
							</span>
							{ /*<span className="c-unified_member__secondary-name c-unified_member__secondary-name--small">Nguyen Van An</span>*/ }
						</div>
						{ this.renderMeta() }
					</div>
					{ /*<span className="jumper_item_info" />*/ }
				</div>
			</div>
		);
	}
}

export default PageItem;
