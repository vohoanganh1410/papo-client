import React from 'react';
import PropTypes from 'prop-types';

import ImageViewerWithZoom from 'components/image-viewer-with-zoom';
import FullscreenModal from 'components/dialog2/fullscreen-modal';
import { getAvatarURL } from 'lib/facebook/utils';

import styles from './style.scss';

class ImageViewer extends React.PureComponent {
	static propTypes = {
		image: PropTypes.object.isRequired,
		page: PropTypes.object,
	};

	render() {
		const { from, page } = this.props;

		if ( ! this.props.image ) return null;
		return (
			<FullscreenModal
				featureAccessibleFsDialogs={ false }
				withBreadcrumbHeader={ true }
				withFooter={ false }
				title={ from ? from.name : 'Unknown' }
				isOpen={ this.props.isOpen }
				modalBodyClasses={ styles.image_viewer_body }
				overlayClassName={ styles.image_viewer_body_overlay }
				headerClasses={ styles.image_viewer_header }
				withHeader={ true }
				headerImage={
					from ? getAvatarURL( from.id, 50, page ? page.data.access_token : null ) : null
				}
				showOpenTransition={ true }
				ariaHideApp={ false }
				closeModal={ this.props.onClose }
				onEscape={ this.props.onClose }
			>
				<ImageViewerWithZoom
					onOverlayClick={ this.props.onClose }
					featureModernImageViewer={ true }
					image={ this.props.image }
				/>
			</FullscreenModal>
		);
	}
}

export default ImageViewer;
