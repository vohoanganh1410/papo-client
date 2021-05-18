import React from 'react';
import PropTypes from 'prop-types';
import { noop, omit } from 'lodash';
import Clipboard from 'clipboard';
import ReactDom from 'react-dom';

import UnstyledButton from 'components/button2/unstyled-button';
import Tooltip from 'components/tooltip2';

export default class ClickToCopyText extends React.PureComponent {
	static propTypes = {
		text: PropTypes.string.isRequired,
		className: PropTypes.string,
		onCopy: PropTypes.func,
	};
	static defaultProps = {
		onCopy: noop,
	};

	constructor(props) {
		super(props);

		this.state = {
			position: props.tooltipPosition || 'bottom',
			tip: "Click để copy",
			isCopied: false,
		};
		this.setRef = this.setRef.bind(this);
	}

	componentDidMount() {
		const button = ReactDom.findDOMNode( this.button );
		if (!button) return null;

		this.clipboard = new Clipboard( button, {
			text: () => this.props.text,
		} );
		this.clipboard.on( 'success', this.onCopied );
		this.clipboard.on( 'error', this.onError );
	};

	componentWillUnmount() {
		if (this.clipboard) {
			this.clipboard.destroy();
			delete this.clipboard;
		}

		if (this.confirmationTimeout) {
			clearTimeout( this.confirmationTimeout );
			delete this.confirmationTimeout;
		}
	};

	setRef(r) {
		this.button = r;
	}

	onCopied = () => {
		this.setState( {
			isCopied: true,
		} );

		this.confirmationTimeout = setTimeout( () => {
			this.setState( {
				isCopied: false,
			} );
		}, 4000 );
		// this.props.recordTracksEvent( 'calypso_editor_clipboard_url_button_click' );
	};

	onError = () => {
		window.prompt(
			"Đã có lỗi xảy ra khi copy text",
			this.props.text
		);
	};

	render() {
		return(
			<Tooltip
				tip={ this.state.isCopied ? "Copied" : "Click để copy" }
				position={this.state.position}
				ref={this.setRef}
			>
				<div style={{display: 'inline-block', cursor: 'pointer'}}
					className={this.props.className}
					{ ...omit( this.props, Object.keys( this.constructor.propTypes ), "tooltipPosition" ) }
				>
					{this.props.text}
				</div>
			</Tooltip>
		)
	}
}

