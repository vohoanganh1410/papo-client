import React from 'react';
import PropTypes from 'prop-types';
import { isEqual, noop } from 'lodash';

import FocusManager from 'components/focus-manager';

export default class HorizontalItem extends React.Component {
	static propTypes = {
		id: PropTypes.string,
		onWidthChange: PropTypes.func,
		width: PropTypes.number,
		validity: PropTypes.bool,
		style: PropTypes.objectOf( PropTypes.any ),
	};

	static defaultProps = {
		onWidthChange: noop,
		style: {},
		validity: false,
	};

	constructor( props ) {
		super( props );

		this.setRef = this.setRef.bind( this );
		this.updateWidth = this.updateWidth.bind( this );

		this.mutationObserver = new MutationObserver( this.updateWidth );
		this.node = null;
	}

	componentDidMount() {
		if ( this.node ) {
			this.mutationObserver.observe( this.node, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: true,
			} );
			this.node.addEventListener( 'load', this.updateWidth, true );
		}
		this.updateWidth();
	}

	componentDidUpdate() {
		this.updateWidth();
	}

	componentWillUnmount() {
		if ( this.mutationObserver ) {
			this.mutationObserver.disconnect();
			this.mutationObserver = null;
		}
	}

	shouldComponentUpdate( nextProps ) {
		if ( ! isEqual( nextProps.style, this.props.style ) ) return true;
		if (
			this.props.children &&
			nextProps.children &&
			! isEqual( nextProps.children.props, this.props.children.props )
		)
			return true;
		if (
			this.props.children &&
			nextProps.children &&
			nextProps.children.key !== this.props.children.key
		)
			return true;
		if ( nextProps.width !== this.props.width ) return true;
		if ( ! nextProps.validity ) return true;
		if ( nextProps.hasFocus !== this.props.hasFocus ) return true;
		if ( nextProps.isMouseDownOnItem !== this.props.isMouseDownOnItem ) return true;
		if ( nextProps.hasFocusWithin !== this.props.hasFocusWithin ) return true;
		return false;
	}

	updateWidth() {
		if ( ! this.node ) return;
		const r = this.node.getBoundingClientRect(),
			a = r.width;
		// console.log("called update width");
		( Math.abs( a - this.props.width ) > 0.5 || ! this.props.validity ) &&
			this.props.onWidthChange( this.props.id, a );
	}

	setRef = r => {
		this.node = r;
	};

	render() {
		if ( ! this.props.children ) return null;
		return (
			<div
				key={ this.props.id }
				ref={ this.setRef }
				style={ Object.assign( this.props.style, {
					position: 'absolute',
				} ) }
			>
				{ this.props.children }
			</div>
		);
	}
}
