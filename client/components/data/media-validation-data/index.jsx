/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';

/**
 * Interanl dependencies
 */
import MediaValidationStore from 'lib/media/validation-store';
import passToChildren from 'lib/react-pass-to-children';

function getStateData( pageId ) {
	return {
		mediaValidationErrors: MediaValidationStore.getAllErrors( pageId ),
	};
}

export default class extends React.Component {
	static displayName = 'MediaValidationData';

	static propTypes = {
		pageId: PropTypes.string.isRequired,
	};

	state = getStateData( this.props.pageId );

	componentDidMount() {
		MediaValidationStore.on( 'change', this.updateState );
	}

	componentWillUnmount() {
		MediaValidationStore.off( 'change', this.updateState );
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
