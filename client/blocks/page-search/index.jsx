/** @format */

/**
 * External dependencies
 */

import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { intlShape } from 'react-intl';

/**
 * Internal dependencies
 */
import TokenField from 'components/token-field';

export default class PageSearch extends React.PureComponent {
	static displayName = 'TokenFields';

	static propTypes = {
		pages: PropTypes.array,
		SuggestionItemRenderer: PropTypes.func.isRequired,
	};

	static defaultProps = {
		pages: [],
		SuggestionItemRenderer: noop,
		isExpanded: true,
	};

	static contextTypes = {
		intl: intlShape,
	};

	constructor( props ) {
		super( props );

		this.state = {
			selectedPages: props.selectedPages,
		};
	}

	// componentWillReceiveProps( nextProps, nextContext ) {
	// 	this.setState( {
	// 		selectedPages: nextProps.selectedPages,
	// 	} );
	// }

	_onTokensChange = value => {
		this.setState( { selectedPages: value } );
		// console.log("value", value);
		if ( this.props.onChange ) {
			this.props.onChange( value );
		}
	};

	_onComplete = () => {
		// if ( this.props.activeMode ) {
		// 	return this.props.
		// }
		// console.log( 'selectedPages', this.state.selectedPages );
		if (
			this.state.selectedPages &&
			this.state.selectedPages.length > 0 &&
			this.props.switchPages
		) {
			this.props.switchPages( this.state.selectedPages );
		}
	};

	_handleActiveModeChange = () => {
		this.setState( {
			selectedPages: [],
		} );
	};

	render() {
		const { formatMessage } = this.context.intl;

		return (
			<TokenField
				isExpanded={ this.props.isExpanded }
				suggestions={ this.props.pages }
				value={ this.state.selectedPages }
				onChange={ this._onTokensChange }
				SuggestionItemRenderer={ this.props.SuggestionItemRenderer }
				placeholder={ formatMessage( {
					id: 'general.search_by_page_name',
					defaultMessage: 'Search by Page name...',
				} ) }
				onComplete={ this._onComplete }
				onFocus={ this.props.onFocus }
				onBlur={ this.props.onBlur }
				activeMode={ this.props.activeMode }
				onActiveModeChange={ this._handleActiveModeChange }
				disableEsc={ this.props.disableEsc }
				suggestionsListClasses={ this.props.suggestionsListClasses }
				hideNotificationBar={ this.props.hideNotificationBar }
				inputContainerClasses={ this.props.inputContainerClasses }
				inputIcon={ this.props.inputIcon }
				renderAsDropdown={ this.props.renderAsDropdown }
				tokenRenderer={ this.props.tokenRenderer }
				forceFocus={ this.props.forceFocus }
				isLoadingPages={ this.props.isLoadingPages }
				onSubmit={ this.props._onComplete }
				availablePages={ this.props.availablePages }
			/>
		);
	}
}
