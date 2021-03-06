import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { debounce, noop, uniqueId } from 'lodash';

import { isMobile } from 'lib/user-agent';
import LoadingSpinner from 'components/loading-spinner';
import Icon from 'components/icon2';
import Button from 'components/button2';

import g_styles from 'components/general-styles.scss';

const SEARCH_DEBOUNCE_MS = 400;

function keyListener( methodToCall, event ) {
	switch ( event.key ) {
		case ' ':
		case 'Enter':
			this[ methodToCall ]( event );
			break;
	}
}

export default class SearchInput extends React.PureComponent {
	static displayName = 'SearchInput';
	static propTypes = {
		additionalClasses: PropTypes.string,
		initialValue: PropTypes.string,
		value: PropTypes.string,
		placeholder: PropTypes.string,
		pinned: PropTypes.bool,
		delaySearch: PropTypes.bool,
		delayTimeout: PropTypes.number,
		describedBy: PropTypes.string,
		onSearch: PropTypes.func.isRequired,
		onSearchChange: PropTypes.func,
		onSearchOpen: PropTypes.func,
		onSearchClose: PropTypes.func,
		analyticsGroup: PropTypes.string,
		overlayStyling: PropTypes.func,
		autoFocus: PropTypes.bool,
		disabled: PropTypes.bool,
		onKeyDown: PropTypes.func,
		onClick: PropTypes.func,
		disableAutocorrect: PropTypes.bool,
		onBlur: PropTypes.func,
		searching: PropTypes.bool,
		isOpen: PropTypes.bool,
		dir: PropTypes.oneOf( [ 'ltr', 'rtl' ] ),
		fitsContainer: PropTypes.bool,
		maxLength: PropTypes.number,
		minLength: PropTypes.number,
		hideClose: PropTypes.bool,
		compact: PropTypes.bool,
		hideOpenIcon: PropTypes.bool,
		inputLabel: PropTypes.string,
	};

	static defaultProps = {
		pinned: false,
		delaySearch: true,
		delayTimeout: SEARCH_DEBOUNCE_MS,
		autoFocus: false,
		disabled: false,
		describedBy: null,
		onSearchChange: noop,
		onSearchOpen: noop,
		onSearchClose: noop,
		onKeyDown: noop,
		onClick: noop,
		//undefined value for overlayStyling is an optimization that will
		//disable overlay scrolling calculation when no overlay is provided.
		overlayStyling: undefined,
		disableAutocorrect: true,
		searching: false,
		isOpen: false,
		dir: undefined,
		fitsContainer: false,
		hideClose: false,
		compact: false,
		hideOpenIcon: false,
	};

	constructor( props ) {
		super( props );

		this.instanceId = uniqueId();

		this.state = {
			keyword: props.initialValue || '',
			isOpen: !! props.isOpen,
			hasFocus: props.autoFocus,
		};

		this.closeListener = keyListener.bind( this, 'closeSearch' );
		this.openListener = keyListener.bind( this, 'openSearch' );
	}

	setOpenIconRef = openIcon => ( this.openIcon = openIcon );

	setSearchInputRef = input => ( this.searchInput = input );

	setOverlayRef = overlay => ( this.overlay = overlay );

	componentWillReceiveProps( nextProps ) {
		if (
			nextProps.onSearch !== this.props.onSearch ||
			nextProps.delaySearch !== this.props.delaySearch
		) {
			this.onSearch = this.props.delaySearch
				? debounce( this.props.onSearch, this.props.delayTimeout )
				: this.props.onSearch;
		}

		if ( nextProps.isOpen ) {
			this.setState( { isOpen: nextProps.isOpen } );
		}

		if (
			this.props.value !== nextProps.value &&
			( nextProps.value || nextProps.value === '' ) &&
			nextProps.value !== this.state.keyword
		) {
			this.setState( { keyword: nextProps.value } );
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		//this.scrollOverlay();
		// Focus if the search box was opened or the autoFocus prop has changed
		if (
			( this.state.isOpen && ! prevState.isOpen ) ||
			( this.props.autoFocus && ! prevProps.autoFocus )
		) {
			this.focus();
		}

		if ( this.state.keyword === prevState.keyword ) {
			return;
		}
		// if there's a keyword change: trigger search
		if ( this.state.keyword ) {
			// this.onSearch is debounced when this.props.delaySearch === true
			// this avoids unnecessary fetches while user types
			this.onSearch( this.state.keyword );
		} else {
			// this.props.onSearch is _not_ debounced
			// no need to debounce if ! this.state.keyword
			if ( this.props.delaySearch ) {
				// Cancel any pending debounce
				this.onSearch.cancel();
			}
			this.props.onSearch( this.state.keyword );
		}
		this.props.onSearchChange( this.state.keyword );
	}

	componentDidMount() {
		this.onSearch = this.props.delaySearch
			? debounce( this.props.onSearch, this.props.delayTimeout )
			: this.props.onSearch;
	}

	scrollOverlay = () => {
		this.overlay &&
			window.requestAnimationFrame( () => {
				if ( this.overlay && this.searchInput ) {
					this.overlay.scrollLeft = this.getScrollLeft( this.searchInput );
				}
			} );
	};

	//This is fix for IE11. Does not work on Edge.
	//On IE11 scrollLeft value for input is always 0.
	//We are calculating it manually using TextRange object.
	getScrollLeft = inputElement => {
		//TextRange is IE11 specific so this checks if we are not on IE11.
		if ( ! inputElement.createTextRange ) {
			return inputElement.scrollLeft;
		}

		const range = inputElement.createTextRange();
		const inputStyle = window.getComputedStyle( inputElement, undefined );
		const paddingLeft = parseFloat( inputStyle.paddingLeft );
		const rangeRect = range.getBoundingClientRect();
		const scrollLeft =
			inputElement.getBoundingClientRect().left +
			inputElement.clientLeft +
			paddingLeft -
			rangeRect.left;
		return scrollLeft;
	};

	focus = () => {
		// if we call focus before the element has been entirely synced up with the DOM, we stand a decent chance of
		// causing the browser to scroll somewhere odd. Instead, defer the focus until a future turn of the event loop.
		setTimeout( () => this.searchInput && this.searchInput.focus(), 0 );
	};

	blur = () => this.searchInput.blur();

	clear = () => this.setState( { keyword: '' } );

	onBlur = event => {
		if ( this.props.onBlur ) {
			this.props.onBlur( event );
		}

		this.setState( { hasFocus: false } );
	};

	onChange = event => {
		this.setState( {
			keyword: event.target.value,
		} );
	};

	openSearch = event => {
		event.preventDefault();
		this.setState( {
			keyword: '',
			isOpen: true,
		} );
	};

	closeSearch = event => {
		event.preventDefault();

		if ( this.props.disabled ) {
			return;
		}

		this.setState( {
			keyword: '',
			isOpen: this.props.isOpen || false,
		} );

		this.searchInput.value = ''; // will not trigger onChange
		this.searchInput.blur();

		if ( this.props.pinned ) {
			this.openIcon.focus();
		}

		this.props.onSearchClose( event );
	};

	keyUp = event => {
		if ( event.key === 'Enter' && isMobile() ) {
			//dismiss soft keyboards
			this.blur();
		}

		if ( ! this.props.pinned ) {
			return;
		}

		if ( event.key === 'Escape' ) {
			this.closeSearch( event );
		}
		//this.scrollOverlay();
	};

	keyDown = event => {
		//this.scrollOverlay();
		if ( event.key === 'Escape' && event.target.value === '' ) {
			this.closeSearch( event );
		}
		this.props.onKeyDown( event );
	};

	// Puts the cursor at end of the text when starting
	// with `initialValue` set.
	onFocus = () => {
		if ( ! this.searchInput ) {
			return;
		}

		const setValue = this.searchInput.value;
		if ( setValue ) {
			// Firefox needs clear or won't move cursor to end
			this.searchInput.value = '';
			this.searchInput.value = setValue;
		}

		this.setState( { hasFocus: true } );
		this.props.onSearchOpen();
	};

	render() {
		const searchValue = this.state.keyword;
		const placeholder = this.props.placeholder || 'Search???';
		const inputLabel = this.props.inputLabel;
		const enableOpenIcon = this.props.pinned && ! this.state.isOpen;
		const isOpenUnpinnedOrQueried =
			this.state.isOpen || ! this.props.pinned || this.props.initialValue;

		const autocorrect = this.props.disableAutocorrect && {
			autoComplete: 'off',
			autoCorrect: 'off',
			spellCheck: 'false',
		};

		const searchClass = classNames(
			this.props.additionalClasses,
			this.props.dir,
			{
				'is-expanded-to-container': this.props.fitsContainer,
				'is-open': isOpenUnpinnedOrQueried,
				'is-searching': this.props.searching,
				'is-compact': this.props.compact,
				// 'has-focus': this.state.hasFocus,
				'has-open-icon': ! this.props.hideOpenIcon,
				search: true,
			},
			this.props.className
		);

		const fadeDivClass = classNames( 'search__input-fade', this.props.dir );
		const inputClass = classNames( 'search__input', g_styles.no_focus, this.props.dir );

		return (
			<div dir={ this.props.dir || null } className={ searchClass } role="search">
				<div
					style={ { width: 36 } }
					ref={ this.setOpenIconRef }
					onClick={ enableOpenIcon ? this.openSearch : this.focus }
					tabIndex={ enableOpenIcon ? '0' : null }
					onKeyDown={ enableOpenIcon ? this.openListener : null }
					aria-controls={ 'search-component-' + this.instanceId }
					aria-label="Open Search"
				>
					{ this.props.searching && <LoadingSpinner /> }
					{ ! this.props.searching && <Icon style={ { width: 36 } } type="search-medium" /> }
				</div>
				<div className={ fadeDivClass }>
					<input
						type="search"
						id={ 'search-component-' + this.instanceId }
						autoFocus={ this.props.autoFocus } // eslint-disable-line jsx-a11y/no-autofocus
						aria-describedby={ this.props.describedBy }
						aria-label={ inputLabel ? inputLabel : 'Search' }
						aria-hidden={ ! isOpenUnpinnedOrQueried }
						className={ inputClass }
						placeholder={ placeholder }
						value={ searchValue }
						ref={ this.setSearchInputRef }
						onChange={ this.onChange }
						onKeyUp={ this.keyUp }
						onKeyDown={ this.keyDown }
						onMouseUp={ this.props.onClick }
						onFocus={ this.onFocus }
						onBlur={ this.onBlur }
						disabled={ this.props.disabled }
						autoCapitalize="none"
						dir={ this.props.dir }
						maxLength={ this.props.maxLength }
						minLength={ this.props.minLength }
						{ ...autocorrect }
					/>
					{ this.props.overlayStyling && this.renderStylingDiv() }
				</div>
				{ this.closeButton() }
			</div>
		);
	}

	renderStylingDiv = () => {
		return (
			<div className="search__text-overlay" ref={ this.setOverlayRef }>
				{ this.props.overlayStyling( this.state.keyword ) }
			</div>
		);
	};

	closeButton = () => {
		if ( ! this.props.hideClose && ( this.state.keyword || this.state.isOpen ) ) {
			return (
				<Button
					type="outline"
					size="small"
					className={ g_styles.mr_10 }
					onClick={ this.closeSearch }
					onKeyDown={ this.closeListener }
					aria-controls={ 'search-component-' + this.instanceId }
					aria-label={ 'Close Search' }
				>
					Clear
				</Button>
			);
		}

		return null;
	};
}
