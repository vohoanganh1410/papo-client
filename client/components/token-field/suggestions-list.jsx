/** @format */

/**
 * External dependencies
 */

import { map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import scrollIntoView from 'dom-scroll-into-view';
import { defineMessages, intlShape, FormattedMessage } from 'react-intl';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';
import { nomalizeVietnamese } from 'lib/utils';
import Alert from 'components/alert';
import AlertDialog from '../../select-pages/main';

class SuggestionsList extends React.PureComponent {
	static propTypes = {
		isExpanded: PropTypes.bool,
		match: PropTypes.string,
		displayTransform: PropTypes.func.isRequired,
		onSelect: PropTypes.func,
		suggestions: PropTypes.array,
		selectedIndex: PropTypes.number,
		SuggestionItemRenderer: PropTypes.func.isRequired,
		renderAsDropdown: PropTypes.bool,
		isLoadingPages: PropTypes.bool,
		availablePages: PropTypes.array,
	};

	static defaultProps = {
		isExpanded: false,
		match: '',
		onHover: function() {},
		onSelect: function() {},
		suggestions: Object.freeze( [] ),
	};

	static contextTypes = {
		intl: intlShape,
	};

	componentDidUpdate( prevProps ) {
		let node;

		// only have to worry about scrolling selected suggestion into view
		// when already expanded
		if (
			prevProps.isExpanded &&
			this.props.isExpanded &&
			this.props.selectedIndex > -1 &&
			this.props.scrollIntoView
		) {
			this._scrollingIntoView = true;
			node = this.refs.list;

			scrollIntoView( node.children[ this.props.selectedIndex ], node, {
				onlyScrollIfNeeded: true,
			} );

			setTimeout(
				function() {
					this._scrollingIntoView = false;
				}.bind( this ),
				100
			);
		}
	}

	_computeSuggestionMatch = suggestion => {
		const match = nomalizeVietnamese( ( this.props.match || '' ).toLowerCase() );

		if ( match.length === 0 ) {
			return null;
		}

		const indexOfMatch = nomalizeVietnamese( suggestion.data.name.toLowerCase() ).indexOf( match );

		return {
			suggestionBeforeMatch: suggestion.data.name.substring( 0, indexOfMatch ),
			suggestionMatch: suggestion.data.name.substring( indexOfMatch, indexOfMatch + match.length ),
			suggestionAfterMatch: suggestion.data.name.substring( indexOfMatch + match.length ),
		};
	};

	render() {
		// console.log("this.props.match", this.props.selected);
		if (
			( ! this.props.suggestions || this.props.suggestions.length === 0 ) &&
			this.props.activeMode
		) {
			return null;
		}

		if (
			( ! this.props.availablePages || this.props.availablePages.length === 0 ) &&
			( ! this.props.suggestions || this.props.suggestions.length === 0 ) &&
			( ! this.props.selected || this.props.selected.length === 0 ) &&
			! this.props.isLoadingPages
		) {
			const noPagesMessage = (
				<div>
					<p>
						<FormattedMessage
							id="general.no_pages_initialized"
							defaultMessage="You have not initialized any pages."
						/>{' '}
						<FormattedMessage
							id="general.to_initialize_your_pages"
							defaultMessage="To start using Papo, please click on"
						/>{' '}
						<strong>
							<FormattedMessage
								id="conversation.init_page_btn_txt"
								defaultMessage="Initialize Pages"
							/>{' '}
						</strong>
						<FormattedMessage
							id="general.change_initialize_mode"
							defaultMessage="on the left side to active Initialize mode. Then select your page(s) and click"
						/>{' '}
						<strong>
							<FormattedMessage
								id="general.start_initializing"
								defaultMessage="Start Initializing..."
							/>{' '}
						</strong>
						<FormattedMessage
							id="general.to_initialize_your_pages_txt"
							defaultMessage=" to start initialize your pages."
						/>
					</p>
					<p>
						<FormattedMessage
							id="general.papo_will_using_permissions"
							defaultMessage="Papo will using permissions"
						/>{' '}
						<code style={ { color: '#42b72a' } }>
							<FormattedMessage
								id="general.permissions_manage_pages"
								defaultMessage="manage_pages"
							/>
							{ ', ' }
							<FormattedMessage
								id="general.permissions_read_page_mailboxes"
								defaultMessage="read_page_mailboxes"
							/>{' '}
						</code>
						<FormattedMessage
							id="general.permissions_uses_part_1"
							defaultMessage="to graph your pages comments and messages. If you never give Papo these permissions, Papo can not initialize you page(s). You can re grant these permissions any time by close this dialog and click"
						/>{' '}
						<strong>
							<FormattedMessage id="general.logout_btn_txt" defaultMessage="Logout of Papo" />
						</strong>{' '}
						<FormattedMessage
							id="general.permissions_uses_part_2"
							defaultMessage="then Login again. Please make sure you have granted these permissions to Papo."
						/>
					</p>
					<p>
						<FormattedMessage
							id="general.permissions_uses_part_3"
							defaultMessage='If you have granted these permissions, click "Start Initializing..." to initialize your page(s). Please notice that Initialzing page(s) may take up to 30 minutes to 1 hour or more to complete if your page(s) have alot of comments and messages. But while initializing, you can still access your page(s) and not effect you your data.'
						/>
					</p>
					<p>
						<FormattedMessage
							id="general.disconnect_message"
							defaultMessage="If you need to disconnect Papo completely, please following instructions given by Facebook on"
						/>{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://www.facebook.com/help/204306713029340"
						>
							<FormattedMessage id="general.this_link" defaultMessage="this link" />
						</a>
					</p>
				</div>
			);

			return (
				<div
					style={ { height: 'calc( 100% - 22px )', overflowY: 'auto', boxSizing: 'border-box' } }
				>
					<Alert
						type="warning"
						message={ noPagesMessage }
						style={ {
							border: 'none',
							borderRadius: 0,
						} }
					/>
				</div>
			);
		}

		const classes = classNames(
			styles.token_field__suggestions_list,
			{
				[ styles.is_expanded ]: this.props.isExpanded && this.props.suggestions.length > 0,
			},
			this.props.suggestionsListClasses
		);

		if ( this.props.renderAsDropdown && ! this.props.isExpanded ) {
			return null;
		}

		// We set `tabIndex` here because otherwise Firefox sets focus on this
		// div when tabbing off of the input in `TokenField` -- not really sure
		// why, since usually a div isn't focusable by default
		// TODO does this still apply now that it's a <ul> and not a <div>?
		return (
			<div className={ classes }>
				<ul className={ g_styles.ul_no_style } ref="list" tabIndex="-1">
					{ this._renderSuggestions() }
				</ul>
			</div>
		);
	}

	_renderSuggestions = () => {
		// console.log("this.props.suggestions", );
		return map( this.props.suggestions, ( suggestion, index ) => {
			const selected = index === this.props.selectedIndex;
			const match = this._computeSuggestionMatch( suggestion ),
				classes = classNames( styles.token_field__suggestion, {
					[ styles.is_selected ]: selected,
				} );

			return (
				<li
					role="listitem"
					className={ classes }
					key={ suggestion.data.id }
					onMouseDown={ this._handleMouseDown }
					onClick={ this._handleClick( suggestion ) }
					onMouseEnter={ this._handleHover( suggestion ) }
				>
					{ this.renderSuggestion( suggestion, match, selected ) }
				</li>
			);
		} );
	};

	renderSuggestion = ( suggestion, match, selected ) => {
		return this.props.SuggestionItemRenderer( suggestion, match, selected );
	};

	_handleHover = suggestion => {
		return function() {
			if ( ! this._scrollingIntoView ) {
				this.props.onHover( suggestion );
			}
		}.bind( this );
	};

	_handleClick = suggestion => {
		return function() {
			this.props.onSelect( suggestion );
		}.bind( this );
	};

	_handleMouseDown = e => {
		// By preventing default here, we will not lose focus of <input> when clicking a suggestion
		e.preventDefault();
	};
}

export default SuggestionsList;
