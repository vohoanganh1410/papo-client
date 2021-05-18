/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Avatar from 'components/avatar';

export class ConversationSource extends Component {
	// shouldComponentUpdate = nextProps => {
	// 	if ( ! nextProps.source ) return false;
	// 	if ( ! nextProps.source.page_id) return false;

	// 	return nextProps.source.page_id !== this.props.source.page_id;
	// }
	render() {
		
		const {
			source,
			size,
			avatarSize,
			className,
		} = this.props;

		if ( ! source ) return null;

		if ( ! source || ! source.page_id || ! source.name ) {
			// check and render placeholder here
			return null;
		}

		const authorClasses = classnames( 'conversation-source__author-name', {
			'large': avatarSize > 50,
		} )

		return(
			<div className="conversation-source__author">
				<div className="conversation-source__author-avatar">
					<Avatar user={ { id: source.page_id, name: source.name } } 
					avatarSize={ size || 50 } avatarSize={ avatarSize } className={ className } />
					<span className="conversation-source__author-avatar-placeholder" />
				</div>
				<div className="conversation-source__author-info">
					<div className="conversation-source__author-info-element">
						<span className={ authorClasses }>
							<span>{ source.name }</span>
						</span>
					</div>
				</div>
			</div>
		)
	}
}

export default ConversationSource;