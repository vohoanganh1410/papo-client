/** @format */
/**
 * External dependencies
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { get, random, times, map, isEmpty } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';
import {
	getConversationPost,
	isRequestingConversationPost,
} from 'state/conversation/selectors';

const NUMBER_OF_PLACEHOLDERS = 5;

export class ConversationPost extends PureComponent {
	getRandomWidth() {
		return random( 15, 50 );
	}
	getRandomHeight() {
		return random( 16, 30 );
	}
	renderPlaceholder() {
		
		return (
			<div className="conversation__post is-placeholder">
					{
						times( NUMBER_OF_PLACEHOLDERS, index => {
							// return <StatusButtonPlaceholder key={ 'status-placeholder-' + index } />
							return <div key={ 'status-placeholder-' + index } 
										className="placeholder__line" 
										style={ { width: this.getRandomWidth() + '%', height: this.getRandomHeight() } } >
									</div>
						} )
					}
			</div>
		)
	}

	renderPostAttachments() {
		const { post } = this.props;
		if ( ! post || isEmpty( post ) || ! post.attachments ) return null;
		// need more check for attachments type

		// return for video attachments

		// return for photos attachments
		if ( post.attachments && post.attachments.data && post.attachments.data[0] && post.attachments.data[0].subattachments ) {
			return (
				<div>
	              <div id="postAttachment" style={{width: 'auto', height: 160, overflowX: 'auto', whiteSpace: 'nowrap'}}>
		              {
		              	map( post.attachments.data[0].subattachments.data, image => {
			              	return <div className="LazyLoad is-visible post-attachment-item" style={ { height: 140 } } key={ image.media.image.src } >
					              	<img src={ image.media.image.src } className="img-rounded" style={{cursor: 'zoom-in', height: 140}} />
					              </div>
			              } )
		              }
	              </div>
	            </div>
			)
		}
		

		if ( post.attachments && post.attachments.data && post.attachments.data[0] ) {
			return (
				<div>
	              <div id="postAttachment" style={{width: 'auto', height: 160, overflowX: 'auto', whiteSpace: 'nowrap'}}>
		              <div className="LazyLoad is-visible post-attachment-item" style={ { height: 140 } } key={ post.attachments.data[0].media.image.src } >
		              	<img src={ post.attachments.data[0].media.image.src } className="img-rounded" style={{cursor: 'zoom-in', height: 140}} />
		              </div>
	              </div>
	            </div>
			)
		}

		return null;
	}

	renderPostContent() {
		const { post } = this.props;
		if ( ! post || isEmpty( post ) ) return null;

		return(
			<div style={{margin: 0}}>
				<div>
					<div>
						{ post.name }
					</div>
					<br />
				</div>
				<div>
					<div style={{whiteSpace: 'pre-line', display: 'block'}}>
						{ post.message }
                    </div>
      				<br />
      			</div>
      			<div>
      				{ this.renderPostAttachments() }
	            </div>
          		<div style={{margin: '25px 0', border: 0, backgroundColor: '#c8d7e1', color: 'rgb(182, 182, 182)', height: 1}} />
			</div>
		)
	}

	render() {
		const { order, siteId, post, isRequestConversationPost } = this.props;
		if (  isRequestConversationPost ) {
			return (
				this.renderPlaceholder()
			);
		}
			
		return(
			<div className="conversation__post">
				{
					! isRequestConversationPost && this.renderPostContent()
				}
			</div>
		)
	}
}


const mapStateToProps = ( state, { siteId } ) => {
	return {
		post: getConversationPost( state ),
		isRequestConversationPost: isRequestingConversationPost( state ),
	}
};

const mapDispatchToProps = ( dispatch, { siteId } ) => ( {
	getConversationPost,
	isRequestingConversationPost,
} );

export default connect( mapStateToProps, mapDispatchToProps )(
	localize( ConversationPost )
);
