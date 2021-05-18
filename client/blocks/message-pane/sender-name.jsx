import React from 'react';
import { connect } from 'react-redux';
import ClickToCopyText from 'components/click-to-copy-text';
import { getFacebookUser } from 'state/facebookusers/selectors';

import general_styles from 'components/general-styles.scss';

class SenderName extends React.PureComponent {
	render() {
		const { facebookUser } = this.props;
		if ( ! facebookUser ) return null;
		return (
			<ClickToCopyText
				tooltipPosition={ 'top' }
				text={ facebookUser.name }
				className={ general_styles.black_and_bold }
			/>
		);
	}
}

export default connect( ( state, { from } ) => {
	return {
		facebookUser: from ? getFacebookUser( state, from ) : null,
	};
} )( SenderName );
