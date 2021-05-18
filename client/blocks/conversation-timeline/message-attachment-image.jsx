import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

// import Icon from 'components/icon2';
import Image from 'components/image';
import styles from './style.scss';

export default class MessageAttachmentImage extends React.PureComponent {
	static propTypes = {
		id: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
		attachment: PropTypes.object,
		onShowFullImage: PropTypes.func,
	};

	render() {
		const { attachment, id, error } = this.props;

		if ( ! attachment || ! attachment.image_data ) {
			// render placeholder
			return (
				<div key={ 'placeholder_' + id } className={ styles.attachment_item_container }>
					<div className={ styles.attachment_placeholder }>
						{ /*<Icon type="input_img_active" />*/ }
					</div>
				</div>
			);
		}

		if ( error ) {
			return <span>{ error.message || "Không thể hiển thị tệp đính kèm." }</span>
		}

		const fullImageData = {
			src: attachment.image_data.url,
			width: attachment.image_data.width,
			height: attachment.image_data.height,
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
					src={ attachment.image_data.preview_url }
					height={ 240 }
					onError={ noop }
				/>
			</div>
		);
	}
}
