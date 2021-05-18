import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, bindAll, unescape } from 'lodash';

import Icon from 'components/icon2';
import UnstyledButton from 'components/button2/unstyled-button';

function x(e) {
	var r = new RegExp("<@([A-Z0-9a-z]+)\\|([^>]+)>", "g");
	return e.replace(r, function (e, r, t) {
		var n = unescape(t);
		return "<@" + r + "|" + n + ">"
	})
}

class SearchInput extends React.Component {
	static propTypes = {
		usePrimarySearch: PropTypes.bool.isRequired,
		isSearchAutocompleteOpen: PropTypes.bool.isRequired,
		autoFocus: PropTypes.bool,
		isSonic: PropTypes.bool.isRequired,
		displayQuery: PropTypes.string.isRequired,
		onBlur: PropTypes.func,
		onEnter: PropTypes.func,
		onEscape: PropTypes.func,
		onFocus: PropTypes.func,
		searchInputChanged: PropTypes.func.isRequired,
		clearSearchInput: PropTypes.func.isRequired,
		orgName: PropTypes.string.isRequired,
		teamName: PropTypes.string.isRequired,
		autocompleteSelectedIndex: PropTypes.number,
		searchAutocompleteMode: PropTypes.string,
		isExperimentAnyOmniSwitcher: PropTypes.bool
	};
	static defaultProps = {
		autoFocus: false,
		onBlur: noop,
		onEnter: noop,
		onEscape: noop,
		onFocus: noop,
		autocompleteSelectedIndex: undefined,
		searchAutocompleteMode: undefined,
		isExperimentAnyOmniSwitcher: false
	};

	constructor( props ) {
		super( props );

		this.texty = null;
		bindAll( this, [ "onClickClear", "getTextyString", "onEnter", "onUserQueryChange", "setTextyRef", "updateDisplayQuery" ] );
	}

	componentDidMount() {
		this.texty.focus();
		// var r = this.props,
		// 	t = r.autoFocus,
		// 	n = r.usePrimarySearch,
		// 	a = r.isSearchAutocompleteOpen;
		// (t || n && a) && this.texty.setCursorAtEnd()
	}

	shouldComponentUpdate(r) {
		var t = this.props.usePrimarySearch && r.isSearchAutocompleteOpen !== this.props.isSearchAutocompleteOpen;
		return t || this.props.displayQuery !== r.displayQuery || this.props.autocompleteSelectedIndex !== r.autocompleteSelectedIndex
	}

	componentDidUpdate(r) {
		this.texty && this.props.usePrimarySearch && !r.isSearchAutocompleteOpen && this.props.isSearchAutocompleteOpen && this.texty.focus();
		r.displayQuery !== this.props.displayQuery && this.updateDisplayQuery()
	}

	onUserQueryChange() {
		this.props.searchInputChanged({
			textyString: this.getTextyString()
		})
	}

	onEnter() {
		this.props.onEnter()
	}

	onClickClear() {
		this.props.clearSearchInput();
		this.texty && this.texty.focus()
	}

	setTextyRef(r) {
		// var t = !!(r && r.getWrappedInstance);
		this.texty = r; // ? r.getWrappedInstance() : r
	}

	getTextyString() {
		if (!this.texty) return this.props.displayQuery;
		return x(this.texty.value())
	}

	updateDisplayQuery() {
		this.texty && this.props.displayQuery !== this.getTextyString() && this.texty.value(this.props.displayQuery)
	}

	render() {
		var r = this.props,
			t = r.orgName,
			n = r.teamName;
		var a = "Search";
		var s = {
			tabcomplete: {
				completers: []
			},
			keyboard: {
				useFormattingCommands: false
			}
		};
		var l = this.props.displayQuery ? "c-search__input_box__clear" : "c-search__input_box__clear c-search__input_box__clear__hidden";
		// var i = "number" === typeof this.props.autocompleteSelectedIndex ? Object(C["b"])(this.props.autocompleteSelectedIndex) : void 0;
		// var o = {
		// 	autocomplete: "list",
		// 	owns: "c-search_autocomplete__suggestion_list",
		// 	expanded: true,
		// 	activedescendant: i
		// };
		var u = "Search";
		// var u = A.t("Search {teamName}", {
		// 	teamName: t || n || ""
		// });
		this.props.isExperimentAnyOmniSwitcher && ( u = "Jump to..." );// && this.props.searchAutocompleteMode === j["searchAutocompleteModes"].NAVIGATION && (u = N.t("Jump to..."));
		return React.createElement("div", {
			className: "c-search__input_box",
			"data-qa": "search_input_box"
		}, React.createElement(Icon, {
			type: "search-medium",
			className: "c-search__input_box__icon"
		}), React.createElement("input", {
			className: "c-search__input_box__input",
			modules: s,
			ref: this.setTextyRef,
			ariaLabel: a,
			placeholder: u,
			onFocus: this.props.onFocus,
			onBlur: this.props.onBlur,
			onEnter: this.onEnter,
			onTextChange: this.onUserQueryChange,
			onEscape: this.props.onEscape,

		}), React.createElement(UnstyledButton, {
			className: l,
			onClick: this.onClickClear,
			label: "Clear",
			"data-qa": "search_input_clear"
		}, "Clear"))
	}
}

export default SearchInput;
