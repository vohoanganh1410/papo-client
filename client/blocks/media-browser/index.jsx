/** @format */

/**
 * External dependencies
 */
import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import MediaLibrarySelectedData from 'components/data/media-library-selected-data';
// import MediaLibrary from 'dashboard/media-library';
/**
 * Module variables
 */

class MediaBrowser extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			source: '',
			containerWidth: 500,
		};
	}
	render() {
		const { page } = this.props;
		if ( ! page ) return null;

		return (
			<div className="media__gallery">
				<div className="gallery__content">
					<MediaLibrarySelectedData pageId={ page.data.page_id }>
						{ /*<MediaLibrary
							{ ...this.props }
							className="media__main-section"
							onFilterChange={ this.onFilterChange }
							page={ page }
							single={ false }
							isConnected={ true }
							filter={ this.props.filter }
							source={ this.state.source }
							onEditItem={ this.openDetailsModalForASingleImage }
							onViewDetails={ this.openDetailsModalForAllSelected }
							onDeleteItem={ this.handleDeleteMediaEvent }
							onSourceChange={ this.handleSourceChange }
							modal={ false }
							containerWidth={ this.state.containerWidth }
						/>*/ }
					</MediaLibrarySelectedData>
				</div>
			</div>
		);
	}
}

// MediaBrowser.propTypes = {
// 	icon: PropTypes.string,
// 	onClick: PropTypes.func.isRequired,
// 	showMediaBrowser: PropTypes.bool,
// };

// MediaBrowser.defaultProps = {
// 	showMediaBrowser: true,
// };

export default connect(
	( state, ownerProps ) => {
		return {
			conversations: null,
		};
	},
	{}
)( localize( MediaBrowser ) );
