/** @format */

/**
 * External dependencies
 */

import { assign, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Internal dependencies
 */
import MediaActions from 'lib/media/actions';
import MediaListStore from 'lib/media/list-store';
import passToChildren from 'lib/react-pass-to-children';
import utils from './utils';

function getStateData( pageId ) {
	return {
		media: MediaListStore.getAll( pageId ),
		mediaHasNextPage: MediaListStore.hasNextPage( pageId ),
		mediaFetchingNextPage: MediaListStore.isFetchingNextPage( pageId ),
	};
}

export default class extends React.Component {
	static displayName = 'MediaListData';

	static propTypes = {
		pageId: PropTypes.string.isRequired,
		source: PropTypes.string,
		postId: PropTypes.number,
		filter: PropTypes.string,
		search: PropTypes.string,
	};

	state = getStateData( this.props.pageId );

	componentWillMount() {
		MediaActions.setQuery( this.props.pageId, this.getQuery() );
		MediaListStore.on( 'change', this.updateStateData );
		this.updateStateData();
	}

	componentWillUnmount() {
		MediaListStore.off( 'change', this.updateStateData );
	}

	componentWillReceiveProps( nextProps ) {
		var nextQuery = this.getQuery( nextProps );

		if ( this.props.pageId !== nextProps.pageId || ! isEqual( nextQuery, this.getQuery() ) ) {
			MediaActions.setQuery( nextProps.pageId, nextQuery );
			this.setState( getStateData( nextProps.pageId ) );
		}
	}

	getQuery = props => {
		const query = {};

		props = props || this.props;

		if ( props.search ) {
			query.search = props.search;
		}

		if ( props.filter && ! props.source ) {
			if ( props.filter === 'this-post' ) {
				if ( props.postId ) {
					query.post_ID = props.postId;
				}
			} else {
				query.mime_type = utils.getMimeBaseTypeFromFilter( props.filter );
			}
		}

		if ( props.source ) {
			query.source = props.source;
			query.path = 'recent';
		}

		return query;
	};

	fetchData = () => {
		MediaActions.fetchNextPage( this.props.pageId );
	};

	updateStateData = () => {
		this.setState( getStateData( this.props.pageId ) );
	};

	render() {
		return passToChildren(
			this,
			assign( {}, this.state, {
				mediaOnFetchNextPage: this.fetchData,
			} )
		);
	}
}
