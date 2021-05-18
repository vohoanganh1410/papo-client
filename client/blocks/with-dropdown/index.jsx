// import React from 'react';
// import PropTypes from 'prop-types';
// import classNames from 'classnames';
// import clickOutside from 'click-outside';
// import wrapWithClickOutside from 'react-click-outside';
//
// import Popover from 'components/popover2';
// import general_style from 'components/general-styles.scss';
// import styles from './style.scss';
// // import styles from "../../components/virtualized-select/style.scss";
//
// // var position = {
// // 	top: "top",
// // 	bottom: "bottom",
// // 	left: "left",
// // 	right: "right",
// // 	bottomRight: "bottom-right",
// // 	bottomLeft: "bottom-left",
// // 	rightBottom: "right-bottom",
// // 	leftBottom: "left-bottom",
// // 	topRight: "top-right",
// // 	topLeft: "top-left",
// // };
//
// class WithDropdown extends React.Component {
// 	static propTypes = {
// 		contentRenderer: PropTypes.func.isRequired,
// 		dropdownRenderer: PropTypes.func.isRequired,
// 		dropdownPosition: PropTypes.string,
// 		offsetX: PropTypes.number,
// 		offsetY: PropTypes.number,
// 		className: PropTypes.string,
// 		dropDownClassName: PropTypes.string,
// 	};
//
// 	static defaultProps = {
// 		dropdownPosition: 'bottom',
// 		offsetX: 0,
// 		offsetY: 5,
// 	};
//
// 	constructor( props ) {
// 		super( props );
//
// 		this.state = {
// 			isOpen: props.isOpen,
// 		};
//
// 		this.trigger = React.createRef();
// 		this.setDOMBehavior = this.setDOMBehavior.bind( this );
// 		this.onClickout = this.onClickout.bind( this );
// 		this.onKeydown = this.onKeydown.bind( this );
// 	}
//
// 	componentDidMount() {
// 		this.bindEscKeyListener();
// 	}
//
// 	componentWillReceiveProps(nextProps) {
// 		this.setState({
// 			isOpen: nextProps.isOpen,
// 		})
// 	}
//
// 	componentWillUnmount() {
// 		this.unbindClickoutHandler();
// 		this.unbindEscKeyListener();
// 	}
//
// 	onKeydown( event ) {
// 		if ( event.keyCode !== 27 ) {
// 			return null;
// 		}
//
// 		this.closeDropdown();
// 	}
//
// 	// --- ESC key ---
// 	bindEscKeyListener() {
// 		document.addEventListener( 'keydown', this.onKeydown, true );
// 	}
//
// 	unbindEscKeyListener() {
// 		document.removeEventListener( 'keydown', this.onKeydown, true );
// 	}
//
// 	bindClickoutHandler( el = this.domContainer ) {
// 		if ( ! el ) {
// 			return null;
// 		}
//
// 		if ( this._clickoutHandlerReference ) {
// 			return null;
// 		}
//
// 		this._clickoutHandlerReference = clickOutside( el, this.onClickout );
// 	}
//
// 	unbindClickoutHandler() {
// 		if ( this._clickoutHandlerReference ) {
// 			this._clickoutHandlerReference();
// 			this._clickoutHandlerReference = null;
// 		}
// 	}
//
// 	onClickout( event ) {
// 		this.closeDropdown();
// 	}
//
// 	closeDropdown = () => {
// 		this.setState({
// 			isOpen: false,
// 		});
// 	};
//
// 	setDOMBehavior( domContainer ) {
// 		if ( ! domContainer ) {
// 			this.unbindClickoutHandler();
// 			return null;
// 		}
//
// 		this.bindClickoutHandler( domContainer );
// 		// store DOM element referencies
// 		this.domContainer = domContainer;
// 	}
//
// 	handleClick = () => {
// 		// alert('x');
// 		this.setState({
// 			isOpen: !this.state.isOpen,
// 		});
// 	};
//
// 	renderPopover = r => {
// 		return React.createElement(
// 			Popover,
// 			Object.assign(
// 				{
// 					position: this.props.dropdownPosition,
// 					offsetX: this.props.offsetX,
// 					offsetY: this.props.offsetY,
// 					ariaHideApp: false,
// 				},
// 				r
// 			),
// 			React.createElement(
// 				'div',
// 				{
// 					className: classNames( general_style.menu_dropdown, this.props.dropDownClassName ),
// 				},
// 				this.props.dropdownRenderer()
// 			)
// 		);
// 	};
//
// 	renderDropdown = () => {
// 		const { dropdownPosition } = this.props;
// 		console.log('dropdownPosition', dropdownPosition);
// 		const dropdownClasses = classNames( general_style.menu_dropdown, {
// 			[ styles.dropdown_bottom ]: dropdownPosition === 'bottom',
// 			[ styles.dropdown_top_right ]: dropdownPosition === 'top-right',
// 		} );
//
// 		return(
// 			<div  className={dropdownClasses}  ref={ this.setDOMBehavior }>
// 				{ this.props.dropdownRenderer() }
// 			</div>
// 		)
// 	};
//
// 	render = () => {
// 		return (
// 			<div role="presentation" onClick={ this.handleClick } className={general_style.p_relative}>
// 				{ this.props.contentRenderer() }
// 				{
// 					this.state.isOpen &&
// 					this.renderDropdown()
// 				}
// 			</div>
// 		);
// 	};
// }
//
// export default wrapWithClickOutside(WithDropdown);

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Popover from 'components/popover2';
import PopoverTrigger from 'components/popover2/popover-trigger';
import general_style from 'components/general-styles.scss';

// var position = {
// 	top: "top",
// 	bottom: "bottom",
// 	left: "left",
// 	right: "right",
// 	bottomRight: "bottom-right",
// 	bottomLeft: "bottom-left",
// 	rightBottom: "right-bottom",
// 	leftBottom: "left-bottom",
// 	topRight: "top-right",
// 	topLeft: "top-left",
// };

export default class WithDropdown extends React.Component {
	static propTypes = {
		contentRenderer: PropTypes.func.isRequired,
		dropdownRenderer: PropTypes.func.isRequired,
		// dropdownPosition: PropTypes.oneOf(values(Object.keys(position))),
		offsetX: PropTypes.number,
		offsetY: PropTypes.number,
		className: PropTypes.string,
		dropDownClassName: PropTypes.string,
	};

	static defaultProps = {
		dropdownPosition: 'bottom',
		offsetX: 0,
		offsetY: 5,
	};

	constructor( props ) {
		super( props );

		this.trigger = React.createRef();
	}

	renderPopover = r => {
		return React.createElement(
			Popover,
			Object.assign(
				{
					position: this.props.dropdownPosition,
					offsetX: this.props.offsetX,
					offsetY: this.props.offsetY,
					ariaHideApp: false,
					height: 150,
				},
				r
			),
			React.createElement(
				'div',
				{
					className: classNames( general_style.menu_dropdown, this.props.dropDownClassName ),
				},
				this.props.dropdownRenderer()
			)
		);
	};

	render = () => {
		return (
			<PopoverTrigger
				className={ this.props.className }
				style={ this.props.style }
				ref={ this.trigger }
				ariaHasPopup={ true }
				renderPopover={ this.renderPopover }
				onToggle={ this.props.onToggle }
				startsOpen={ this.props.isOpen }
			>
				{ this.props.contentRenderer() }
			</PopoverTrigger>
		);
	};
}
