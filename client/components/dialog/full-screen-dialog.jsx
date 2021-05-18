import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Dialog from 'components/dialog';

class FullScreenDialog extends React.Component {

	static propTypes = {
		headerText: PropTypes.string,
	};

	static defaultProps = {
		headerText: '',
	};

	handleClose = ( e ) => {
		e.preventDefault();
		if ( this.props.onClose ) {
			this.props.onClose( e );
		}
	}
	
	render() {
		return(
			<Dialog id="fs_modal" shouldCloseOnEsc={ false } isVisible additionalClassNames="full__screen__dialog fs_modal_header fs_modal_footer"
				onClose={ this.handleClose }>
				<button onClick={ this.handleClose } type="button" id="fs_modal_close_btn" className="fs_modal_btn btn_unstyle">
					<i className="ts_icon ts_icon_times"></i>
					<span className="key_label">esc</span>
				</button>
				<div id="fs_modal_header"><h3>{ this.props.headerText }</h3></div>

				{ this.props.children }
			</Dialog>
		)
	}
}

export default FullScreenDialog;