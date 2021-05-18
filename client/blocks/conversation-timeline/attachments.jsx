import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { requestFacebookAttachments, requestFacebookAttachmentTargets } from 'actions/attachments';
import AttachmentImage from './attachment-item';
import AttachmentVideo from './attachment-video';
import AttachmentTargetImage from './attachment-target-item';
import styles from './style.scss';

class Attachments extends React.PureComponent {
	static propTypes = {
		type: PropTypes.string,
		attachmentIds: PropTypes.arrayOf( PropTypes.string ),
		attachmentTargetIds: PropTypes.arrayOf( PropTypes.string ),
		fileIds: PropTypes.arrayOf( PropTypes.string ),
	};

	componentWillMount() {
		const { type, attachmentIds, attachmentTargetIds } = this.props;
		if ( attachmentIds && attachmentIds.length > 0 ) {
			this.props.requestFacebookAttachments( attachmentIds );
		}
		if ( attachmentTargetIds && attachmentTargetIds.length > 0 ) {
			this.props.requestFacebookAttachmentTargets( attachmentTargetIds, type );
		}
	}

	render() {
		const { type, attachmentIds, attachmentTargetIds, fileIds } = this.props;
		const imageNodes = [];

		if ( type === 'video_inline' ) {
			attachmentTargetIds &&
				attachmentTargetIds.length > 0 &&
				attachmentTargetIds.map( id => {
					imageNodes.push(
						<div key={ id } className={ styles.attachment_item_container }>
							<AttachmentVideo id={ id } />
						</div>
					);
				} );
		} else {
			attachmentIds &&
				attachmentIds.length > 0 &&
				attachmentIds.map( id => {
					imageNodes.push(
						<div key={ id } className={ styles.attachment_item_container }>
							<AttachmentImage id={ id } onShowFullImage={ this.props.onShowFullImage } />
						</div>
					);
				} );

			attachmentTargetIds &&
				attachmentTargetIds.length > 0 &&
				attachmentTargetIds.map( id => {
					imageNodes.push(
						<div key={ id } className={ styles.attachment_item_container }>
							<AttachmentTargetImage id={ id } onShowFullImage={ this.props.onShowFullImage } />
						</div>
					);
				} );

			fileIds &&
				fileIds.length > 0 &&
				fileIds.map( id => {
					imageNodes.push( <span key={ id }>{ id }</span> );
				} );
		}

		return <div className={ styles.attachments__media }>{ imageNodes }</div>;
	}
}

export default connect(
	state => {
		return {};
	},
	{
		requestFacebookAttachments,
		requestFacebookAttachmentTargets,
	}
)( Attachments );
