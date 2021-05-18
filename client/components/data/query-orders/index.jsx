/** @format */

/**
 * External dependencies
 */
import { Component } from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debug from 'debug';

/**
 * Internal dependencies
 */
import { isRequestingPostsForQuery } from 'state/orders/selectors';
import { requestOrders, requestAllSitesPosts } from 'state/orders/actions';

class QueryOrders extends Component {
	componentWillMount() {
		// console.log(this.props);
		this.request( this.props );
	}
	componentWillReceiveProps( nextProps ) {
		if (
			this.props.siteId === nextProps.siteId &&
			this.props.postId === nextProps.postId &&
			shallowEqual( this.props.query, nextProps.query )
		) {
			return;
		}

		this.request( nextProps );
	}
	request( props ) {
		// if ( ! props.requestingPosts )
		// props.requestOrders( props.siteId, props.query );
		// props.requestAllSitesPosts( props.query );
		const singleSite = !! props.siteId;
		const singlePost = !! props.postId;

		if ( singleSite ) {
			if ( ! singlePost && ! props.requestingPosts ) {
				// log( 'Request post list for site %d using query %o', props.siteId, props.query );
				props.requestOrders( props.siteId, props.query );
			}

			// if ( singlePost && ! props.requestingPost ) {
			// 	log( 'Request single post for site %d post %d', props.siteId, props.postId );
			// 	props.requestSitePost( props.siteId, props.postId );
			// }
		} else if ( ! props.requestingPosts ) {
			// log( 'Request post list for all sites using query %o', props.query );
			props.requestAllSitesPosts( props.query );
		}

	}

	render() {
		return null;
	}
}

export default connect(
	( state, ownProps ) => {
		const { siteId, postId, query } = ownProps;
		return {
			// requestingPost: siteId && postId && isRequestingSitePost( state, siteId, postId ),
			requestingPosts: isRequestingPostsForQuery( state, siteId, query ),
		};
	},
	dispatch => {
		return bindActionCreators(
			{
				requestOrders,
				requestAllSitesPosts
			},
			dispatch
		);
	}
)( QueryOrders );