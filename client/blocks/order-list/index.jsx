/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { toArray, isEqual, range, throttle, clone, filter, findIndex, min, noop, some, isEmpty, values } from 'lodash';
import { localize } from 'i18n-calypso';
import { bindActionCreators } from 'redux';

/**
 * Internal dependencies
 */
import afterLayoutFlush from 'lib/after-layout-flush';
import OrderListEmptyContent from 'blocks/order-list/empty-content';
import OrderItem from 'blocks/order-item';
import ListEnd from 'components/list-end';
import OrdersActions from 'lib/orders/actions';
import QueryPosts from 'components/data/query-posts';
import { 
	isRequestingPostsForQueryIgnoringPage,
	getPostsForQueryIgnoringPage,
	getPostsFoundForQuery,
	getPostsLastPageForQuery,
	getSitePosts,
 } from 'state/posts/selectors';

import { getSelectedSiteId } from 'state/ui/selectors';


/**
 * Constants
 */
// The maximum number of pages of results that can be displayed in "All My
// Sites" (API endpoint limitation).
const MAX_ALL_SITES_PAGES = 10;

class OrderList extends Component {
	static propTypes = {
		// Props
		query: PropTypes.object,
		scrollContainer: PropTypes.object,

		// Connected props
		siteId: PropTypes.number,
		posts: PropTypes.array,
		isRequestingPosts: PropTypes.bool,
		totalPostCount: PropTypes.number,
		totalPageCount: PropTypes.number,
		lastPageToRequest: PropTypes.number,

		showCheckbox: PropTypes.bool,
	};
	constructor( props ) {
		super( props );

		this.renderOrder = this.renderOrder.bind( this );
		this.renderPlaceholder = this.renderPlaceholder.bind( this );

		this.maybeLoadNextPage = this.maybeLoadNextPage.bind( this );
		this.maybeLoadNextPageThrottled = throttle( this.maybeLoadNextPage, 100 );
		this.maybeLoadNextPageAfterLayoutFlush = afterLayoutFlush( this.maybeLoadNextPage );

		const maxRequestedPage = this.estimatePageCountFromPosts( this.props.posts );
		this.state = {
			maxRequestedPage,
		};
	}

	componentDidMount() {
		this.maybeLoadNextPageAfterLayoutFlush();
		window.addEventListener( 'scroll', this.maybeLoadNextPageThrottled, true );
	}

	handleScroll = () => {
	    lastScrollY = window.scrollY;

	    if (!ticking) {
	      window.requestAnimationFrame(() => {
	        this.nav.current.style.top = `${lastScrollY}px`;
	        ticking = false;
	      });
	   
	      ticking = true;
	    }
	  };

	componentWillReceiveProps( nextProps ) {
		if (
			! isEqual( this.props.query, nextProps.query ) ||
			! isEqual( this.props.siteId, nextProps.siteId )
		) {
			const maxRequestedPage = this.estimatePageCountFromPosts( nextProps.posts );
			this.setState( {
				maxRequestedPage,
			} );
		}
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.isRequestingPosts && ! this.props.isRequestingPosts ) {
			// We just finished loading a page.  If the bottom of the list is
			// still visible on screen (or almost visible), then we should go
			// ahead and load the next page.
			this.maybeLoadNextPageAfterLayoutFlush();
		}
	}

	componentWillUnmount() {
		window.removeEventListener( 'scroll', this.maybeLoadNextPageThrottled, true );
		this.maybeLoadNextPageThrottled.cancel(); // Cancel any pending scroll events
		this.maybeLoadNextPageAfterLayoutFlush.cancel();
	}

	estimatePageCountFromPosts( posts ) {
		// When loading posts from persistent storage, we want to avoid making
		// a bunch of sequential requests when the user scrolls down to the end
		// of the list.  However, we want to still request the posts, in case
		// some data has changed since the last page reload.  This will spawn a
		// number of concurrent requests for different pages of the posts list.

		if ( ! posts || ! posts.length ) {
			return 1;
		}

		const postsPerPage = this.getPostsPerPageCount();
		const pageCount = Math.ceil( posts.length / postsPerPage );

		// Avoid making more than 5 concurrent requests on page load.
		return Math.min( pageCount, 5 );
	}

	getPostsPerPageCount() {
		const query = this.props.query || {};
		return query.number || DEFAULT_POST_QUERY.number;
	}

	getScrollTop() {
		// console.log('scroll');
		const { scrollContainer } = this.props;
		if ( ! scrollContainer ) {
			return null;
		}
		if ( scrollContainer === document.body ) {
			return 'scrollY' in window ? window.scrollY : document.documentElement.scrollTop;
		}
		return scrollContainer.scrollTop;
	}

	maybeLoadNextPage() {
		const { 
			scrollContainer, 
			lastPageToRequest, 
			isRequestingPosts,
		} = this.props;

		const { maxRequestedPage } = this.state;
		if ( ! scrollContainer || isRequestingPosts || maxRequestedPage >= lastPageToRequest ) {
			return;
		}

		const scrollTop = this.getScrollTop();
		const { scrollHeight, clientHeight } = scrollContainer;
		const pixelsBelowViewport = scrollHeight - scrollTop - clientHeight;
		// When the currently loaded list has this many pixels or less
		// remaining below the viewport, begin loading the next page of items.
		const thresholdPixels = Math.max( clientHeight, 400 );
		if (
			typeof scrollTop !== 'number' ||
			typeof scrollHeight !== 'number' ||
			typeof clientHeight !== 'number' ||
			pixelsBelowViewport > thresholdPixels
		) {
			return;
		}

		this.setState( { maxRequestedPage: maxRequestedPage + 1 } );
	}

	renderOrder( order, index ) {
		// console.log( order );
		const { isShowCheckbox } = this.props;
		return (
			<OrderItem
				key={ order._id } 
				title={ order.title }
				mobile={ order.mobile }
				index={ index }
				post={ order }
				globalId={ order._id }
				statusId={ order.statusId }
				isShowCheckbox={ isShowCheckbox }
			>
			</OrderItem>
		);
	}

	renderListEnd() {
		return <ListEnd />;
	}

	renderPlaceholder() {
		return (
				<div>
					<OrderItem key="placeholder" />
				</div>
			);
	}

	hasListFullyLoaded() {
		const { lastPageToRequest, isRequestingPosts } = this.props;
		const { maxRequestedPage } = this.state;

		return ! isRequestingPosts && maxRequestedPage >= lastPageToRequest;
	}

	render() {

		const { query, siteId, isRequestingPosts, translate, users } = this.props;
		const { maxRequestedPage } = this.state;
		const posts = this.props.posts || [];

		const isLoadedAndEmpty = query && ! posts.length && ! isRequestingPosts;
		
		const classes = classnames( 'post-type-list', {
			'is-empty': isLoadedAndEmpty,
		} );

		return (
			<div className={ classes }>
				{ query && siteId &&
					range( 1, maxRequestedPage + 1 ).map( page => (
						<QueryPosts key={ `query-${ page }` } siteId={ siteId } query={ { ...query, page } } />
					) ) }
				{ posts.map( this.renderOrder ) }
				{ isLoadedAndEmpty && (
					<OrderListEmptyContent type={ query.type } status={ query.status }/>
				) }
				{ this.hasListFullyLoaded() ? this.renderListEnd() : this.renderPlaceholder() }
			</div>
			)
	}
}

export default connect(
	( state, ownProps ) => {
		const siteId = getSelectedSiteId( state );

		const totalPageCount = getPostsLastPageForQuery( state, siteId, ownProps.query );
		const lastPageToRequest =
		siteId === null ? Math.min( MAX_ALL_SITES_PAGES, totalPageCount ) : totalPageCount;

		return {
			siteId: siteId,
			posts: getPostsForQueryIgnoringPage( state, siteId, ownProps.query ),
			// posts: getSitePosts( state, siteId ),
			isRequestingPosts: ! siteId ? true : isRequestingPostsForQueryIgnoringPage( state, siteId, ownProps.query ),
			totalPostCount: getPostsFoundForQuery( state, siteId, ownProps.query ),
			totalPageCount,
			lastPageToRequest,
		};
	},
	{
		// requestOrders
	}
)( localize( OrderList ) );
