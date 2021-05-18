/** @format */

/**
 * External dependencies
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import MediaLibrarySelectedStore from 'lib/media/library-selected-store';
import passToChildren from 'lib/react-pass-to-children';

function getStateData( pageId ) {
	return {
		mediaLibrarySelectedItems: MediaLibrarySelectedStore.getAll( pageId ),
	};
}

export default class extends React.Component {
	static displayName = 'MediaLibrarySelectedData';

	static propTypes = {
		pageId: PropTypes.string.isRequired,
	};

	state = getStateData( this.props.pageId );

	componentDidMount() {
		MediaLibrarySelectedStore.on( 'change', this.updateState );
	}

	componentWillUnmount() {
		MediaLibrarySelectedStore.off( 'change', this.updateState );
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.props.pageId !== nextProps.pageId ) {
			this.setState( getStateData( nextProps.pageId ) );
		}
	}

	updateState = () => {
		this.setState( getStateData( this.props.pageId ) );
	};

	render() {
		return passToChildren( this, this.state );
	}
}
