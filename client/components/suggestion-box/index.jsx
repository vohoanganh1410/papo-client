import PropTypes from 'prop-types';
import React from 'react';
import { endsWith } from 'lodash';

import { debounce } from 'lodash';
import QuickInput from 'components/quick-input';
import { Constants } from 'lib/key-codes';
import * as UserAgent from 'lib/user-agent';
import * as Utils from 'lib/utils';

const KeyCodes = Constants.KeyCodes;
const MIN_TIME_BEFORE_CLICK = 200;

export default class SuggestionBox extends React.Component {
	static propTypes = {
		displaySuggestion: PropTypes.bool,

		/**
		 * The list component to render, usually SuggestionList
		 */
		listComponent: PropTypes.func.isRequired,

		/**
		 * The date component to render
		 */
		dateComponent: PropTypes.func,

		/**
		 * The value of in the input
		 */
		value: PropTypes.string.isRequired,

		/**
		 * Array of suggestion providers
		 */
		providers: PropTypes.arrayOf( PropTypes.object ),

		/**
		 * Where the list will be displayed relative to the input box, defaults to 'top'
		 */
		listStyle: PropTypes.string,

		/**
		 * CSS class for the div parent of the input box
		 */
		containerClass: PropTypes.string,

		/**
		 * Set to true to draw dividers between types of list items, defaults to false
		 */
		renderDividers: PropTypes.bool,

		/**
		 * Set to true to render a message when there were no results found, defaults to false
		 */
		renderNoResults: PropTypes.bool,

		/**
		 * Set to allow TAB to select an item in the list, defaults to true
		 */
		completeOnTab: PropTypes.bool,

		/**
		 * Function called when input box gains focus
		 */
		onFocus: PropTypes.func,

		/**
		 * Function called when input box loses focus
		 */
		onBlur: PropTypes.func,

		/**
		 * Function called when input box value changes
		 */
		onChange: PropTypes.func,

		/**
		 * Function called when a key is pressed and the input box is in focus
		 */
		onKeyDown: PropTypes.func,

		/**
		 * Function called when an item is selected
		 */
		onItemSelected: PropTypes.func,

		/**
		 * Flags if the suggestion_box is for the RHS (Reply).
		 */
		isRHS: PropTypes.bool,

		/**
		 * The number of characters required to show the suggestion list, defaults to 1
		 */
		requiredCharacters: PropTypes.number,

		/**
		 * If true, the suggestion box is opened on focus, default to false
		 */
		openOnFocus: PropTypes.bool,

		/**
		 * If true, the suggestion box is disabled
		 */
		disabled: PropTypes.bool,

		/**
		 * If true, it displays allow to display a default list when empty
		 */
		openWhenEmpty: PropTypes.bool,

		/**
		 * If true, replace all input in the suggestion box with the selected option after a select, defaults to false
		 */
		replaceAllInputOnSelect: PropTypes.bool,

		/**
		 * If true, it allow user select multiple items
		 */
		isMultiple: PropTypes.bool,
	};

	static defaultProps = {
		displaySuggestion: false,
		listStyle: 'top',
		containerClass: '',
		renderDividers: false,
		renderNoResults: false,
		completeOnTab: true,
		isRHS: false,
		requiredCharacters: 1,
		openOnFocus: false,
		openWhenEmpty: false,
		replaceAllInputOnSelect: false,
		isMultiple: false,
	};

	constructor( props ) {
		super( props );

		// Keep track of whether we're composing a CJK character so we can make suggestions for partial characters
		this.composing = false;

		// Keep track of whether a list based or date based suggestion provider has been triggered
		this.presentationType = 'text';

		this.pretext = '';

		// pretext: the text before the cursor
		// matchedPretext: a list of the text before the cursor that will be replaced if the corresponding autocomplete term is selected
		// terms: a list of strings which the previously typed text may be replaced by
		// items: a list of objects backing the terms which may be used in rendering
		// components: a list of react components that can be used to render their corresponding item
		// selection: the term currently selected by the keyboard
		this.state = {
			focused: false,
			cleared: true,
			matchedPretext: [],
			items: [],
			terms: [],
			components: [],
			selection: '',
		};
	}

	// componentWillReceiveProps( nextProps ) {
	//     // console.log( 'nextProps', nextProps );
	// }

	getTextbox = () => {
		if ( ! this.refs.input ) {
			return null;
		}

		const input = this.refs.input.getInput();

		if ( input.getDOMNode ) {
			return input.getDOMNode();
		}

		return input;
	};

	recalculateSize = () => {
		// Pretty hacky way to force an AutosizeTextarea to recalculate its height if that's what
		// we're rendering as the input
		const input = this.refs.input.getInput();

		if ( input.recalculateSize ) {
			input.recalculateSize();
		}
	};

	handleEmitClearSuggestions = ( delay = 0 ) => {
		if ( ! this.props.openWhenEmpty ) {
			setTimeout( () => {
				this.clear();
			}, delay );
		}
	};

	handleFocusOut = e => {
		// Focus is switching TO e.relatedTarget, so only treat this as a blur event if we're not switching
		// between children (like from the textbox to the suggestion list)
		if ( this.container.contains( e.relatedTarget ) ) {
			return;
		}

		this.setState( { focused: false } );

		if ( UserAgent.isIos() && ! e.relatedTarget ) {
			// iOS doesn't support e.relatedTarget, so we need to use the old method of just delaying the
			// blur so that click handlers on the list items still register
			if ( this.presentationType !== 'date' || this.props.value.length === 0 ) {
				this.handleEmitClearSuggestions( MIN_TIME_BEFORE_CLICK );
			}
		} else {
			this.handleEmitClearSuggestions();
		}

		if ( this.props.onBlur ) {
			this.props.onBlur( e );
		}
	};

	handleFocusIn = e => {
		// Focus is switching FROM e.relatedTarget, so only treat this as a focus event if we're not switching
		// between children (like from the textbox to the suggestion list)
		if ( this.container.contains( e.relatedTarget ) ) {
			return;
		}

		this.setState( { focused: true } );

		// if ( this.props.openOnFocus || this.props.openWhenEmpty ) {
		// 	setTimeout( () => {
		// 		const textbox = this.getTextbox();
		// 		if ( textbox ) {
		// 			const pretext = textbox.value.substring( 0, textbox.selectionEnd );
		// 			if ( this.props.openWhenEmpty || pretext.length >= this.props.requiredCharacters ) {
		// 				this.handlePretextChanged( pretext );
		// 			}
		// 		}
		// 	} );
		// }

		if ( this.props.onFocus ) {
			this.props.onFocus( e );
		}
	};

	handleChange = e => {
		const textbox = this.getTextbox();
		const pretext = textbox.value.substring( 0, textbox.selectionEnd ).toLowerCase();

		if ( ! this.composing && this.pretext !== pretext ) {
			this.handlePretextChanged( pretext );
		}

		if ( this.props.onChange ) {
			this.props.onChange( e );
		}
	};

	handleCompositionStart = () => {
		this.composing = true;
	};

	handleCompositionUpdate = e => {
		if ( ! e.data ) {
			return;
		}

		// The caret appears before the CJK character currently being composed, so re-add it to the pretext
		const textbox = this.getTextbox();
		const pretext = textbox.value.substring( 0, textbox.selectionStart ) + e.data;

		this.pretext = pretext;
	};

	handleCompositionEnd = () => {
		this.composing = false;
	};

	addTextAtCaret = ( term, matchedPretext ) => {
		const textbox = this.getTextbox();
		const caret = textbox.selectionEnd;
		const text = this.props.value;
		const pretext = textbox.value.substring( 0, textbox.selectionEnd );

		let prefix;
		let keepPretext = false;
		if ( endsWith( pretext.toLowerCase(), matchedPretext.toLowerCase() ) ) {
			prefix = pretext.substring( 0, pretext.length - matchedPretext.length );
		} else {
			// the pretext has changed since we got a term to complete so see if the term still fits the pretext
			const termWithoutMatched = term.substring( matchedPretext.length );
			const overlap = SuggestionBox.findOverlap( pretext, termWithoutMatched );

			keepPretext = overlap.length === 0;
			prefix = pretext.substring( 0, pretext.length - overlap.length - matchedPretext.length );
		}

		const suffix = text.substring( caret );

		let newValue;
		if ( keepPretext ) {
			newValue = pretext;
		} else {
			newValue = prefix + term + ' ' + suffix;
		}

		textbox.value = newValue;

		if ( this.props.onChange ) {
			// fake an input event to send back to parent components
			const e = {
				target: textbox,
			};

			// don't call handleChange or we'll get into an event loop
			this.props.onChange( e );
		}

		// set the caret position after the next rendering
		window.requestAnimationFrame( () => {
			if ( textbox.value === newValue ) {
				Utils.setCaretPosition( textbox, prefix.length + term.length + 1 );
			}
		} );
	};

	replaceText = term => {
		const textbox = this.getTextbox();
		textbox.value = term;

		if ( this.props.onChange ) {
			// fake an input event to send back to parent components
			const e = {
				target: textbox,
			};

			// don't call handleChange or we'll get into an event loop
			this.props.onChange( e );
		}
	};

	handleCompleteWord = ( term, matchedPretext ) => {
		if ( this.props.replaceAllInputOnSelect ) {
			this.replaceText( term );
		} else {
			// this.addTextAtCaret(term, matchedPretext)
			// find description of term
			const items = this.state.items;
			for ( let i = 0; i < items.length; i++ ) {
				if ( items[ i ].suggestion === term ) {
					this.replaceText( items[ i ].description );
					break;
				}
			}
		}

		if ( this.props.onItemSelected ) {
			const items = this.state.items;
			// const terms = this.state.terms;
			for ( let i = 0; i < items.length; i++ ) {
				if ( items[ i ] === term ) {
					this.props.onItemSelected( items[ i ] );
					break;
				}
			}
		}

		this.clear();

		this.refs.input.focus();

		for ( const provider of this.props.providers ) {
			if ( provider.handleCompleteWord ) {
				provider.handleCompleteWord( term, matchedPretext );
			}
		}
	};

	selectNext = () => {
		// prevent select next if user disable displaySuggestion
		if ( ! this.props.displaySuggestion ) return;
		this.setSelectionByDelta( 1 );
	};

	selectPrevious = () => {
		// prevent select previous if user disable displaySuggestion
		if ( ! this.props.displaySuggestion ) return;
		this.setSelectionByDelta( -1 );
	};

	setSelectionByDelta = delta => {
		let selectionIndex = this.state.terms.indexOf( this.state.selection );

		if ( selectionIndex === -1 ) {
			this.setState( {
				selection: '',
			} );
			return;
		}

		selectionIndex += delta;

		if ( selectionIndex < 0 ) {
			selectionIndex = 0;
		} else if ( selectionIndex > this.state.terms.length - 1 ) {
			selectionIndex = this.state.terms.length - 1;
		}

		this.setState( {
			selection: this.state.terms[ selectionIndex ],
		} );
	};

	clear = () => {
		this.setState(
			{
				cleared: true,
				matchedPretext: [],
				terms: [],
				items: [],
				components: [],
			},
			() => {
				if ( this.props.isMultiple ) {
					setTimeout( () => {
						const textbox = this.getTextbox();
						if ( textbox ) {
							textbox.value = '';
							const pretext = textbox.value.substring( 0, textbox.selectionEnd );
							this.handlePretextChanged( pretext );
						}
					} );
				}
			}
		);
	};

	hasSuggestions = () => {
		return this.state.items.some( item => ! item.loading );
	};

	handleKeyDown = e => {
		// alert(this.props.displaySuggestion)
		if ( ( this.props.openWhenEmpty || this.props.value ) && this.hasSuggestions() ) {
			if ( Utils.isKeyPressed( e, KeyCodes.UP ) ) {
				this.selectPrevious();
				e.preventDefault();
			} else if ( Utils.isKeyPressed( e, KeyCodes.DOWN ) ) {
				this.selectNext();
				e.preventDefault();
			} else if (
				Utils.isKeyPressed( e, KeyCodes.ENTER ) ||
				( this.props.completeOnTab && Utils.isKeyPressed( e, KeyCodes.TAB ) )
			) {
				let matchedPretext = '';
				const textbox = this.getTextbox();
				const pretext = textbox.value.substring( 0, textbox.selectionEnd ).toLowerCase();

				for ( let i = 0; i < this.state.terms.length; i++ ) {
					if ( this.state.terms[ i ] === this.state.selection && this.props.displaySuggestion ) {
						matchedPretext = this.state.matchedPretext[ i ];
						this.handleCompleteWord( this.state.selection, matchedPretext );
						if ( this.props.onKeyDown ) {
							this.props.onKeyDown( e );
						}
					} else if ( this.state.terms[ i ] === pretext ) {
						matchedPretext = this.state.matchedPretext[ i ];
						this.handleCompleteWord( this.state.selection, matchedPretext );
						if ( this.props.onKeyDown ) {
							this.props.onKeyDown( e );
						}
					} else {
						console.log( 'should prevent sending' );
					}
				}

				e.preventDefault();
			} else if ( Utils.isKeyPressed( e, KeyCodes.ESCAPE ) ) {
				this.clear();
				this.presentationType = 'text';

				if ( this.pretext.length > 0 ) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if ( this.props.onKeyDown ) {
				this.props.onKeyDown( e );
			}
		} else if ( this.props.onKeyDown ) {
			this.props.onKeyDown( e );
		}
	};

	handleReceivedSuggestions = suggestions => {
		// console.log("suggestions", suggestions);
		const newComponents = [];
		const newPretext = [];
		for ( let i = 0; i < suggestions.terms.length; i++ ) {
			newComponents.push( suggestions.component );
			newPretext.push( suggestions.matchedPretext );
		}
		const terms = suggestions.terms;
		// console.log('suggestions', suggestions)
		const items = suggestions.items;
		let selection = this.state.selection;
		if ( terms.length > 0 ) {
			// if the current selection is no longer in the map, select the first term in the list
			if ( ! this.state.selection || terms.indexOf( this.state.selection ) === -1 ) {
				// selection = items[0].description;
				selection = terms[ 0 ];
			}
		} else if ( this.state.selection ) {
			selection = '';
		}

		this.setState( {
			cleared: false,
			selection,
			terms,
			items,
			components: newComponents,
			matchedPretext: newPretext,
		} );
	};

	handlePretextChanged = debounce( pretext => {
		this.pretext = pretext;
		const { snippets } = this.props;
		let handled = false;
		for ( const provider of this.props.providers ) {
			handled =
				provider.handlePretextChanged( pretext, snippets, this.handleReceivedSuggestions ) ||
				handled;

			if ( handled ) {
				if ( provider.constructor.name === 'SearchDateProvider' ) {
					this.presentationType = 'date';
				} else {
					this.presentationType = 'text';
				}

				break;
			}
		}
		if ( ! handled ) {
			this.clear();
		}
	}, Constants.SEARCH_TIMEOUT_MILLISECONDS );

	blur = () => {
		this.refs.input.blur();
	};

	setContainerRef = container => {
		// Attach/detach event listeners that aren't supported by React
		if ( this.container ) {
			this.container.removeEventListener( 'focusin', this.handleFocusIn );
			this.container.removeEventListener( 'focusout', this.handleFocusOut );
		}

		if ( container ) {
			container.addEventListener( 'focusin', this.handleFocusIn );
			container.addEventListener( 'focusout', this.handleFocusOut );
		}

		// Save ref
		this.container = container;
	};

	render() {
		const {
			listComponent,
			dateComponent,
			listStyle,
			listClass,
			renderDividers,
			renderNoResults,
			...props
		} = this.props;

		// Don't pass props used by SuggestionBox
		Reflect.deleteProperty( props, 'providers' );
		Reflect.deleteProperty( props, 'onChange' ); // We use onInput instead of onChange on the actual input
		Reflect.deleteProperty( props, 'onItemSelected' );
		Reflect.deleteProperty( props, 'completeOnTab' );
		Reflect.deleteProperty( props, 'isRHS' );
		Reflect.deleteProperty( props, 'requiredCharacters' );
		Reflect.deleteProperty( props, 'openOnFocus' );
		Reflect.deleteProperty( props, 'openWhenEmpty' );
		// Reflect.deleteProperty(props, 'onFocus');
		// Reflect.deleteProperty(props, 'onBlur');
		Reflect.deleteProperty( props, 'containerClass' );
		Reflect.deleteProperty( props, 'replaceAllInputOnSelect' );
		Reflect.deleteProperty( props, 'isMultiple' );

		// This needs to be upper case so React doesn't think it's an html tag
		const SuggestionListComponent = listComponent;
		const SuggestionDateComponent = dateComponent;

		return (
			<div ref={ this.setContainerRef } className={ this.props.containerClass }>
				<QuickInput
					className={ this.props.className }
					inputContainerClasses={ this.props.inputContainerClasses }
					ref="input"
					autoComplete="off"
					{ ...props }
					onInput={ this.handleChange }
					onCompositionStart={ this.handleCompositionStart }
					onCompositionUpdate={ this.handleCompositionUpdate }
					onCompositionEnd={ this.handleCompositionEnd }
					onKeyDown={ this.handleKeyDown }
				/>

				{ ( this.props.openWhenEmpty ||
					( this.props.displaySuggestion &&
						this.props.value.length >= this.props.requiredCharacters ) ) &&
					this.presentationType === 'text' && (
						<SuggestionListComponent
							ref="list"
							open={ this.state.focused }
							pretext={ this.pretext }
							location={ listStyle }
							listClass={ listClass }
							renderDividers={ renderDividers }
							renderNoResults={ renderNoResults }
							onCompleteWord={ this.handleCompleteWord }
							cleared={ this.state.cleared }
							matchedPretext={ this.state.matchedPretext }
							items={ this.state.items }
							terms={ this.state.terms }
							selection={ this.state.selection }
							components={ this.state.components }
							resultHeaderRenderer={ this.props.resultHeaderRenderer }
						/>
					) }
				{ /*(this.props.openWhenEmpty || this.props.value.length >= this.props.requiredCharacters) && this.presentationType === 'date' &&
                    <SuggestionDateComponent
                        ref='date'
                        items={this.state.items}
                        terms={this.state.terms}
                        components={this.state.components}
                        matchedPretext={this.state.matchedPretext}
                        onCompleteWord={this.handleCompleteWord}
                    />*/ }
			</div>
		);
	}

	// Finds the longest substring that's at both the end of b and the start of a. For example,
	// if a = "firepit" and b = "pitbull", findOverlap would return "pit".
	static findOverlap( a, b ) {
		const aLower = a.toLowerCase();
		const bLower = b.toLowerCase();

		for ( let i = bLower.length; i > 0; i-- ) {
			const substring = bLower.substring( 0, i );

			if ( endsWith( aLower, substring ) ) {
				return substring;
			}
		}
		return '';
	}
}
