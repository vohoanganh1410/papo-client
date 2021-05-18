/** @format */

/**
 * External dependencies
 */
import { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { requestMeInvites } from 'state/current-user/actions';
// import { isRequestingInvitesForSite } from 'state/invites/selectors';

class QueryMeInvites extends Component {
	componentWillMount() {
		this.request( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.props.userId === nextProps.userId ) {
			return;
		}

		this.request( nextProps );
	}

	request( props ) {
		if ( props.requesting || ! props.userId ) {
			return;
		}

		props.requestMeInvites( props.userId );
	}

	render() {
		return null;
	}
}

export default connect(
	( state, ownProps ) => {
		const { userId } = ownProps;
		return {
			requesting: /*isRequestingInvitesForSite( state, userId )*/false,
		};
	},
	{ requestMeInvites }
)( QueryMeInvites );
