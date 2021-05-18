import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import wrapWithClickOutside from 'react-click-outside';
import clickOutside from 'click-outside';

import Icon from 'components/icon2';
import UnstyledButton from 'components/button2/unstyled-button';
import List from './list';
import g_styles from 'components/general-styles.scss';
import styles from './style.scss';


class VirtualizedSelect extends React.Component {

	static propTypes = {
		noSelectText: PropTypes.string,
		searchPlaceholderText: PropTypes.string,
		itemRenderer: PropTypes.func.isRequired,
	};

	constructor( props ) {
		super( props );

		this.state = {
			isOpen: false,
			selected: null,
		};

		this.searchBox = null;

		this.setDOMBehavior = this.setDOMBehavior.bind( this );
		this.onClickout = this.onClickout.bind( this );
		this.onKeydown = this.onKeydown.bind( this );
	}

	componentDidMount() {
		this.bindEscKeyListener();
	}

	componentWillUnmount() {
		this.unbindClickoutHandler();
		this.unbindEscKeyListener();
	}

	onKeydown( event ) {
		if ( event.keyCode !== 27 ) {
			return null;
		}

		this.closeDropdown();
	}

	// --- ESC key ---
	bindEscKeyListener() {
		document.addEventListener( 'keydown', this.onKeydown, true );
	}

	unbindEscKeyListener() {
		document.removeEventListener( 'keydown', this.onKeydown, true );
	}

	bindClickoutHandler( el = this.domContainer ) {
		if ( ! el ) {
			return null;
		}

		if ( this._clickoutHandlerReference ) {
			return null;
		}

		this._clickoutHandlerReference = clickOutside( el, this.onClickout );
	}

	unbindClickoutHandler() {
		if ( this._clickoutHandlerReference ) {
			this._clickoutHandlerReference();
			this._clickoutHandlerReference = null;
		}
	}

	onClickout( event ) {
		this.closeDropdown();
	}

	onClearOptions = (e) => {
		e.stopPropagation();
		this.setState({
			selected: null,
			isOpen: false,
		});
	};

	renderSelect = () => {
		const { isOpen } = this.state;
		const rootClasses = classNames(
			styles.virtualized_select,
			this.props.className, {
				[ styles.is_open ]: isOpen
			},
			g_styles.overflow_ellipsis,
		);

		return(
			<div role="presentation" className={ rootClasses } onClick={ this.handleClick }
				 title={ this.state.selected ? this.state.selected.name : this.props.noSelectText || 'Select...' }>
				<div className={ classNames(styles.select_text, g_styles.overflow_ellipsis, styles.select_segment)}>
					{ this.state.selected ? this.state.selected.name : this.props.noSelectText || 'Select...' }
				</div>
				{
					this.state.selected &&
					<UnstyledButton className={classNames(styles.close_btn, styles.select_segment)} onClick={ this.onClearOptions }>
						<Icon type="times_medium" />
					</UnstyledButton>
				}
				<Icon className={styles.select_segment} type="chevron_medium_down" />
			</div>
		)
	};

	handleClick = () => {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	};


	handleSelect = ( option ) => {
		this.setState({
			selected: option,
			isOpen: false,
		});

		if ( this.props.onSelect ) {
			this.props.onSelect( option );
		}
	};

	renderList = () => {
		return(
			<div className={ classNames( g_styles.full_height, styles.dropdown_container ) }>
				<div
					className={ classNames( styles.search_box, {
						[ styles.search_focus ]: this.state.searchFocus
					} ) }
				>
					<input
						className={ styles.select_input }
						ref={ this.setInputRef }
						autoFocus
						onFocus={this.onSearchFocus}
						onBlur={this.onSearchBlur}
						type="text" placeholder={ this.props.searchPlaceholderText || 'Search...' }/>
					<Icon className={ styles.search_icon } type="search_small" />
				</div>
				<div className={ styles.list_container }>
					<List
						style={{ width: '100%', height: '100%' }}
						itemRenderer={ this.props.itemRenderer }
						onSelectOption={ this.handleSelect }
						selected={ this.state.selected }
					/>
				</div>

			</div>
		)
	};

	setInputRef = ( r ) => {
		this.searchBox = r;
	};

	onSearchFocus = () => {
		this.setState({
			searchFocus: true,
		})
	};

	onSearchBlur = () => {
		this.setState({
			searchFocus: false,
		})
	};

	setDOMBehavior( domContainer ) {
		if ( ! domContainer ) {
			this.unbindClickoutHandler();
			return null;
		}

		this.bindClickoutHandler( domContainer );
		// store DOM element referencies
		this.domContainer = domContainer;
	}


	renderDropdown = () => {
		return(
			<div className={styles.dropdown_menu} style={{height: 200}}  ref={ this.setDOMBehavior } >
				<div className={ classNames(styles.dropdown_menu_container, g_styles.full_height) }>

					<div className={ g_styles.full_width_and_height } >
						{ this.renderList() }
					</div>
				</div>
			</div>
		)
	};

	handleToggle = ( isOpen ) => {
		this.setState({
			isOpen: isOpen,
		});

		if ( isOpen && this.searchBox) {
			alert('focus');
			this.searchBox.focus();
		}
	};

	closeDropdown = () => {
		this.setState({
			isOpen: false,
		});
	};

	render() {
		return(
			<div className={ classNames(this.props.className, styles.select_container) }>
				<div>
					{ this.renderSelect() }
				</div>
				{
					this.state.isOpen &&
					this.renderDropdown()
				}
			</div>
		)
	}
}

export default wrapWithClickOutside(VirtualizedSelect);
