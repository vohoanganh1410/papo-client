import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { noop } from 'lodash';
import { moment } from 'i18n-calypso';

import { getPage } from 'state/pages/selectors';
import { getPost } from 'state/posts/selectors';
import { requestPagePost } from 'actions/post';
import ConversationTime from 'blocks/conversation-time';
import Image from 'components/image';
import Icon from 'components/icon2';
import PostActions from './post-actions';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

class Post extends React.PureComponent {
	static propTypes = {
		postId: PropTypes.string.isRequired,
		pageId: PropTypes.string.isRequired,
	};

	componentWillMount() {
		const { pageId, postId, page, post } = this.props;

		// if post already fetch

		if ( ! post && pageId && postId && page ) {
			this.props.requestPagePost( pageId, postId, page.data.access_token );
		}
	}

	componentWillReceiveProps( nextProps ) {
		const { page } = nextProps;

		if ( this.props.post && nextProps.postId === this.props.post.id ) return;

		if ( nextProps.postId !== this.props.postId && page && ! nextProps.post ) {
			this.props.requestPagePost( nextProps.pageId, nextProps.postId, page.data.access_token );
		}
	}

	render() {
		const { post } = this.props;
		// if ( !post ) return null;

		const rootClasses = classNames( styles.post, {
			[ styles.placeholder ]: ! post,
		} );

		const postTime = post
			? moment( new Date( post.created_time ) ).format( 'MMMM Do YYYY [at] HH:mm A' )
			: null;

		const postPictureClasses = classNames( styles.post_picture, {
			[ styles.has_no_picture ]: post && ( ! post.picture || post.picture.length === 0 ),
		} );

		return (
			<div className={ rootClasses }>
				<div className={ postPictureClasses }>
					{ post && post.picture && (
						<Image
							alt={ 'attachment' }
							title="Click để phóng to"
							className={ styles.post_picture }
							src={ post.picture }
							height={ 100 }
							onError={ noop }
						/>
					) }
				</div>
				<div className={ styles.post_item__byline }>
					<span className={ classNames( g_styles.d_flex, styles.post_item__post_title ) }>
						{ post && (
							<span className={ styles.post_time }>
								<a
									href={ post ? post.permalink_url : null }
									target="_blank"
									rel="noopener noreferrer"
									className={ classNames( g_styles.d_flex, g_styles.v_center ) }
								>
									<Icon type="clock_o" className={ styles.post_time_icon } />
									<span>{ postTime }</span>
								</a>
							</span>
						) }
					</span>
					<div className={ styles.post_item__post_text }>
						{ post ? post.message : 'Post text' }
						{ post && <span className={ styles.truncate_fade } /> }
					</div>
					<div className={ styles.post_item__post_text_extra_line }>
						{ post && (
							<a
								href={ post ? post.permalink_url : null }
								target="_blank"
								rel="noopener noreferrer"
								className={ classNames( g_styles.d_flex, g_styles.v_center ) }
							>
								<Icon type="external_link_large" />
								<span>Xem bài viết</span>
							</a>
						) }
						{ ! post && 'post link' }
					</div>
					<div className={ styles.post_item__post_text_bottom_line }>
						{ post && post.likes && post.comments && (
							<PostActions likes={ post.likes.summary } comments={ post.comments.summary } />
						) }
						{ ! post && 'post actions' }
					</div>
				</div>
				{ /*<div className={ styles.post_item__post_meta }>
					<div className={ styles.post_item__post_time }>
						{ post && <ConversationTime time={ new Date( post.created_time ) } className={ styles.post_time } /> }
					</div>
				</div>*/ }
			</div>
		);
	}
}

export default connect(
	( state, { pageId, postId } ) => {
		return {
			page: pageId ? getPage( state, pageId ) : null,
			post: postId ? getPost( state, postId ) : null,
		};
	},
	{
		requestPagePost,
	}
)( Post );
