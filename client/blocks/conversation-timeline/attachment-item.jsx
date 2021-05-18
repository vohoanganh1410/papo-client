import React from 'react';
import { connect } from 'react-redux';
import { noop } from 'lodash';

import { getAttachmentItem } from 'state/attachments/selectors';
import Image from 'components/image';

import styles from './style.scss';

class AttachmentItem extends React.PureComponent {
	render() {
		const { attachment } = this.props;
		if ( ! attachment ) return null;

		return (
			<div
				className={ styles.img_wrapper }
				onClick={ () => this.props.onShowFullImage( attachment ) }
			>
				<Image
					key={ attachment.id }
					alt={ 'attachment' }
					title="Click để phóng to"
					className={ styles.message_attachment_img }
					src={ attachment.preview_url }
					height={ 240 }
					onError={ noop }
				/>
			</div>
		);
	}
}

export default connect( ( state, { id } ) => {
	return {
		attachment: id ? getAttachmentItem( state, id ) : null,
	};
} )( AttachmentItem );
