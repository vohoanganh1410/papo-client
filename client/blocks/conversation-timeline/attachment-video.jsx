import React from 'react';
import { connect } from 'react-redux';

import { getAttachmentTargetItem } from 'state/attachments/selectors';

import styles from './style.scss';

class AttachmentVideo extends React.PureComponent {
	render() {
		const { attachment, id } = this.props;
		if ( ! attachment ) return null;

		if ( ! attachment.format || attachment.format.length === 0 ) return null;

		return (
			<div>
				<div
					dangerouslySetInnerHTML={ {
						__html: attachment.format[ attachment.format.length - 1 ].embed_html,
					} }
				/>
			</div>
		);
	}
}

export default connect( ( state, { id } ) => {
	return {
		attachment: id ? getAttachmentTargetItem( state, id ) : null,
	};
} )( AttachmentVideo );
