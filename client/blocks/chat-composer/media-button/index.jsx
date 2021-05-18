import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import LoadingSpinner from 'components/loading-spinner';

class MediaButton extends Component {
	static propTypes = {
		page: PropTypes.object,
		icon: PropTypes.string,
		onClick: PropTypes.func.isRequired,
		showMediaBrowser: PropTypes.bool,
	};

	static defaultProps = {
		showMediaBrowser: true,
		onClick: noop,
	};

	constructor( props ) {
		super( props );

		this.getIconClasses = this.getIconClasses.bind( this );
	}

	// shouldComponentUpdate = nextProps => {
	// 	return nextProps.showMediaBrowser !== this.props.showMediaBrowser;
	// }

	getIconClasses = () => {
		const icon = this.props.icon ? this.props.icon : 'info';
		return 'ts_icon composer_icons ' + this.props.icon;
	};

	renderButton( selectedImages ) {
		return (
			<div>
				<span className={ this.getIconClasses() } />
				{ selectedImages && selectedImages.length > 0 && (
					<span className="selected_count">{ selectedImages.length }</span>
				) }
			</div>
		);
	}

	renderLoading() {
		return <LoadingSpinner size="small" />;
	}

	render() {
		const { showMediaBrowser, selectedImages, onClick, className, isLoadingImages } = this.props;

		if ( ! showMediaBrowser ) {
			return null;
		}

		return (
			<div className={ className } onClick={ onClick }>
				{ isLoadingImages && this.renderLoading() }
				{ ! isLoadingImages && this.renderButton( selectedImages ) }
			</div>
		);
	}
}

export default MediaButton;
