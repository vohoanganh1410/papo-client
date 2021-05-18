import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';

import { shallowEqual } from 'utils/utils';
import FocusManager from 'components/focus-manager';
import styles from 'components/virtualized-list/style.scss';

class ListItem extends React.Component {
	static displayName = 'ListItem';
	static propTypes = {
		ariaLabel: PropTypes.string,
		id: PropTypes.string.isRequired,
		children: PropTypes.node,
		onFocusEnter: PropTypes.func,
		onFocusWithin: PropTypes.func,
		onFocusLeave: PropTypes.func,
		onHeightChange: PropTypes.func,
		onMouseEnter: PropTypes.func,
		onMouseOver: PropTypes.func,
		onMouseLeave: PropTypes.func,
		onMouseDown: PropTypes.func,
		onMouseUp: PropTypes.func,
		className: PropTypes.string,
		style: PropTypes.objectOf( PropTypes.any ),
		role: PropTypes.string,
		height: PropTypes.number,
		validity: PropTypes.bool,
		hasFocus: PropTypes.bool,
		hasFocusWithin: PropTypes.bool,
		isMouseDownOnItem: PropTypes.bool,
		shouldHorizontallyScroll: PropTypes.bool,
	};

	static defaultProps = {
		ariaLabel: undefined,
		children: null,
		onFocusEnter: noop,
		onFocusWithin: noop,
		onFocusLeave: noop,
		onHeightChange: noop,
		onMouseEnter: noop,
		onMouseOver: noop,
		onMouseLeave: noop,
		onMouseDown: noop,
		onMouseUp: noop,
		className: '',
		style: {},
		role: 'listitem',
		height: null,
		validity: true,
		hasFocus: false,
		hasFocusWithin: false,
		isMouseDownOnItem: false,
		shouldHorizontallyScroll: false,
	};

	constructor( props ) {
		super( props );

		this.updateHeight = this.updateHeight.bind( this );
		this.setRef = this.setRef.bind( this );
		this.onFocusEnter = this.onFocusEnter.bind( this );
		this.onFocusWithin = this.onFocusWithin.bind( this );
		this.onFocusLeave = this.onFocusLeave.bind( this );
		this.onMouseEnter = this.onMouseEnter.bind( this );
		this.onMouseOver = this.onMouseOver.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );
		this.onMouseDown = this.onMouseDown.bind( this );
		this.onMouseUp = this.onMouseUp.bind( this );
		this.mutationObserver = new MutationObserver( this.updateHeight );
		this.node = null;
		this.justFocused = false;
	}

	componentDidMount() {
		if ( this.node ) {
			this.mutationObserver.observe( this.node, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: true,
			} );
			this.node.addEventListener( 'load', this.updateHeight, true );
		}
		this.updateHeight();
		this.maybeFocusNode();
	}

	shouldComponentUpdate( nextProps ) {
		if ( ! shallowEqual( nextProps.style, this.props.style ) ) return true;
		if ( ! shallowEqual( nextProps.children.props, this.props.children.props ) ) return true;
		if ( nextProps.children.key !== this.props.children.key ) return true;
		if ( ! nextProps.validity ) return true;
		// if ( nextProps.hasFocus !== this.props.hasFocus ) return true;
		if ( nextProps.isMouseDownOnItem !== this.props.isMouseDownOnItem ) return true;
		// if ( nextProps.hasFocusWithin !== this.props.hasFocusWithin ) return true;
		return false;
	}

	componentDidUpdate() {
		this.updateHeight();
		this.maybeFocusNode();
	}

	componentWillUnmount() {
		if ( this.mutationObserver ) {
			this.mutationObserver.disconnect();
			this.mutationObserver = null;
		}
	}

	onFocusEnter( r ) {
		const a = this;
		const n = r.relatedEvent;
		if ( n && 'mousedown' === n.type ) return;
		clearTimeout( this.focusTimerId );
		this.justFocused = true;
		this.focusTimerId = setTimeout( function() {
			a.justFocused = false;
		}, 250 );
		this.props.onFocusEnter(
			Object.assign(
				{
					id: this.props.id,
				},
				r
			)
		);
	}

	onFocusWithin( r ) {
		const a = this;
		const n = r.relatedEvent,
			s = r.target,
			l = r.currentTarget;
		if ( n && 'mousedown' === n.type ) return;
		if ( s === l ) {
			clearTimeout( this.focusTimerId );
			this.justFocused = true;
			this.focusTimerId = setTimeout( function() {
				a.justFocused = false;
			}, 250 );
		}
		this.props.onFocusWithin(
			Object.assign(
				{
					id: this.props.id,
				},
				r
			)
		);
	}

	onFocusLeave = () => {
		this.props.onFocusLeave();
	};

	onMouseEnter( r ) {
		if ( this.justFocused ) return;
		const a = Object.assign(
			{
				id: this.props.id,
			},
			r
		);
		this.props.onMouseEnter( a );
	}

	onMouseOver( r ) {
		if ( this.justFocused ) return;
		this.props.onMouseOver(
			Object.assign(
				{
					id: this.props.id,
				},
				r
			)
		);
	}

	onMouseLeave( r ) {
		this.props.onMouseLeave(
			Object.assign(
				{
					id: this.props.id,
				},
				r
			)
		);
	}

	onMouseDown( r ) {
		this.props.onMouseDown(
			Object.assign(
				{
					id: this.props.id,
				},
				r
			)
		);
	}

	onMouseUp( r ) {
		this.props.onMouseUp(
			Object.assign(
				{
					id: this.props.id,
				},
				r
			)
		);
	}

	setRef( r ) {
		this.node = r;
	}

	updateHeight() {
		if ( ! this.node ) return;
		const r = this.node.getBoundingClientRect(),
			a = r.height;
		const needUpdate = Math.abs( a - this.props.height ) > 0.5 || ! this.props.validity;
		if ( needUpdate ) {
			this.props.onHeightChange( this.props.id, a );
		}
	}

	maybeFocusNode() {
		this.props.hasFocus && this.node && this.node.focus();
	}

	determineTabIndex() {
		if ( this.props.isMouseDownOnItem ) return;
		if ( this.props.hasFocusWithin ) return 0;
		return -1;
	}

	render() {
		if ( ! this.props.children ) return null;
		const rootClass = classNames(
			styles.c_virtual_list__item,
			{
				[ styles.c_virtual_list__item__focus ]: this.props.hasFocus,
				[ styles.c_virtual_list__item__auto_width ]: this.props.shouldHorizontallyScroll,
			},
			this.props.className
		);

		return (
			<FocusManager
				onFocusEnter={ this.onFocusEnter }
				onFocusWithin={ this.onFocusWithin }
				onFocusLeave={ this.onFocusLeave }
			>
				<div
					role={ this.props.role }
					ref={ this.setRef }
					style={ this.props.style }
					aria-label={ this.props.ariaLabel }
					aria-expanded={ this.props.ariaExpanded }
					// onMouseEnter={ this.onMouseEnter }
					// onMouseOver={ this.onMouseOver }
					// onMouseLeave={ this.onMouseLeave }
					onMouseDown={ this.onMouseDown }
					onMouseUp={ this.onMouseUp }
					className={ rootClass }
					tabIndex={ this.determineTabIndex() }
				>
					{ this.props.children }
				</div>
			</FocusManager>
		);
	}
}

ListItem.displayName = 'ListItem';

export default ListItem;
