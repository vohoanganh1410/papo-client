import React from 'react';
import { connect } from 'react-redux';

import MasterbarLoggedIn from 'layout/masterbar/loged-in';
import MasterbarLoggedOut from 'layout/masterbar/loged-out';
import { getCurrentUser } from 'state/current-user/selectors';

class Masterbar extends React.PureComponent {
	render() {
		if ( ! this.props.user ) {
			return <MasterbarLoggedOut sectionName={ this.props.section.name } />;
		}

		return (
			<MasterbarLoggedIn
				user={ this.props.user }
				section={ this.props.section.group }
				renderItems={ this.props.renderItems }
			/>
		);
	}
}

export default connect( state => {
	const { section } = state.ui;
	return {
		section,
		user: getCurrentUser( state ),
	};
} )( Masterbar );
