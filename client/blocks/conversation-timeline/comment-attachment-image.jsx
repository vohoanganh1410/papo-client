import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import Image from 'components/image';
import styles from './style.scss';

export default class CommentAttachmentImage extends React.PureComponent {
	static propTypes = {
		id: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
		attachment: PropTypes.object,
		onShowFullImage: PropTypes.func,
	};

	render() {
		const { attachment, id, error } = this.props;

		if ( ! attachment || ! attachment.media ) {
			// render placeholder
			return (
				<div key={ 'placeholder_' + id } className={ styles.attachment_item_container }>
					<div className={ styles.attachment_placeholder }>{ /*<LoadingSpinner />*/ }</div>
				</div>
			);
		}

		if ( error ) {
			return <span>{ error.message || "Không thể hiển thị tệp đính kèm." }</span>
		}

		// const { image } = attachment.media;
		if ( ! attachment.media.image || ! attachment.media.image.src )
			return <span>Unknown attachment type</span>;

		const fullImageData = {
			src: attachment.media.image.src,
			width: attachment.media.image.width,
			height: attachment.media.image.height,
		};

		return (
			<div
				className={ styles.img_wrapper }
				onClick={ () => this.props.onShowFullImage( fullImageData ) }
			>
				<Image
					key={ id }
					alt={ 'attachment' }
					title="Click để phóng to"
					className={ styles.message_attachment_img }
					src={ attachment.media.image.src }
					height={ 240 }
					onError={ noop }
				/>
			</div>
		);
	}
}
