/** @format */

/**
 * External dependencies
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { isRequestingSiteOrderStatuses } from 'state/site-order-statuses/selectors';
import { requestSiteOrderStatuses } from 'state/site-order-statuses/actions';

class QuerySiteOrderStatuses extends Component {
	componentWillMount() {
		this.requestOrderStatuses( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		const { siteId } = this.props;
		if ( ! nextProps.siteId || siteId === nextProps.siteId ) {
			return;
		}

		this.requestOrderStatuses( nextProps );
	}

	requestOrderStatuses( props ) {
		const { requestingSiteOrderStatuses, siteId } = props;
		if ( ! requestingSiteOrderStatuses && siteId ) {
			props.requestSiteOrderStatuses( siteId );
		}
	}

	render() {
		return null;
	}
}

QuerySiteOrderStatuses.propTypes = {
	siteId: PropTypes.number,
	requestingSiteOrderStatuses: PropTypes.bool,
	requestSiteOrderStatuses: PropTypes.func,
};

export default connect(
	( state, { siteId } ) => {
		return {
			requestingSiteOrderStatuses: isRequestingSiteOrderStatuses( state, siteId ),
		};
	},
	{ requestSiteOrderStatuses }
)( QuerySiteOrderStatuses );
