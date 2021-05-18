import React from 'react';
import { connect } from 'react-redux';
import { noop, find } from 'lodash';

import { getAttachmentTargetItem } from 'state/attachments/selectors';
import Image from 'components/image';

import styles from './style.scss';

class AttachmentTargetItem extends React.PureComponent {
	render() {
		const { attachment } = this.props;
		if ( ! attachment ) return null;
		// console.log("attachment", attachment);
		// trying to find attachment image with height = 320px
		const found = find( attachment.images, { height: 320 } );
		// console.log("found", found)

		return (
			<Image
				key={ attachment.id }
				alt={ attachment.alt_text }
				title="Click để phóng to"
				className={ styles.message_attachment_img }
				src={ found ? found.source : attachment.picture }
				// width={ 150 }
				onClick={ () =>
					this.props.onShowFullImage(
						{
							height: attachment.images[ 0 ].height,
							width: attachment.images[ 0 ].width,
							src: attachment.images[ 0 ].source,
						} || attachment
					)
				}
				height={ 240 }
				onError={ noop }
			/>
		);
	}
}

export default connect( ( state, { id } ) => {
	return {
		attachment: id ? getAttachmentTargetItem( state, id ) : null,
	};
} )( AttachmentTargetItem );
