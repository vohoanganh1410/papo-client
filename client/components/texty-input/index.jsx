import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, bindAll } from 'lodash';

var Bn = {
	tooltipShowing: false,
	tooltipId: undefined,
	tooltipTitle: undefined,
	tooltipTargetBounds: undefined
};

class TextyInput extends React.PureComponent {
	static propTypes = {
		ariaLabel: PropTypes.string.isRequired,
		className: PropTypes.string,
		legacyTextyClassName: PropTypes.string,
		id: PropTypes.string,
		channelId: PropTypes.string,
		initialText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		onBlur: PropTypes.func,
		onEnter: PropTypes.func,
		onUpArrow: PropTypes.func,
		onLeftWhenEmpty: PropTypes.func,
		onEscape: PropTypes.func,
		onFocus: PropTypes.func,
		onTab: PropTypes.func,
		onTextChange: PropTypes.func,
		modules: PropTypes.object,
		placeholder: PropTypes.string,
		userHighlightWords: PropTypes.arrayOf(PropTypes.string),
		emojiNames: PropTypes.arrayOf(PropTypes.string),
		isSingleLine: PropTypes.bool,
		enableJumbomoji: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
		enableSpellCheck: PropTypes.bool,
		enableEmoticons: PropTypes.bool,
		enableEmojiButton: PropTypes.bool,
		enableMentionButton: PropTypes.bool,
		isDisabled: PropTypes.bool,
		isEmojiDisplayedAsText: PropTypes.bool,
		focusOnMount: PropTypes.bool,
		useLegacyCreate: PropTypes.bool,
		minLines: PropTypes.oneOf([1, 2, 3]),
		maxLines: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8]),
		maxLength: PropTypes.number,
		tabIndex: PropTypes.number,
		openModal: PropTypes.func,
		getIsValidMentionId: PropTypes.func,
		autocompleteMembers: PropTypes.func,
		teamId: PropTypes.string,
		isAutocompleteOpen: PropTypes.bool,
		legacyShouldCompleteOnTab: PropTypes.bool,
		broadcastKeywords: PropTypes.array,
		enableBroadcastKeywords: PropTypes.bool,
		enableFormattingCommands: PropTypes.bool,
		featureReactMessages: PropTypes.bool,
		featureFileThreads: PropTypes.bool,
		useSonicEmoji: PropTypes.bool,
		locale: PropTypes.string,
		useSendButton: PropTypes.bool,
		usePreNewlines: PropTypes.bool,
		showMentionTooltips: PropTypes.bool,
		unsafeAriaProps: PropTypes.shape({
			autocomplete: PropTypes.string.isRequired,
			owns: PropTypes.string.isRequired,
			expanded: PropTypes.bool.isRequired,
			activedescendant: PropTypes.string
		})
	};
	static defaultProps = {
		className: undefined,
		legacyTextyClassName: undefined,
		id: undefined,
		channelId: undefined,
		initialText: undefined,
		onBlur: undefined,
		onEnter: undefined,
		onEscape: undefined,
		onUpArrow: noop,
		onLeftWhenEmpty: noop,
		onFocus: undefined,
		onTab: undefined,
		onTextChange: undefined,
		modules: undefined,
		placeholder: undefined,
		userHighlightWords: undefined,
		emojiNames: undefined,
		isSingleLine: false,
		enableJumbomoji: false,
		enableSpellCheck: false,
		enableEmoticons: false,
		enableEmojiButton: false,
		enableMentionButton: false,
		isDisabled: false,
		isEmojiDisplayedAsText: false,
		focusOnMount: false,
		useLegacyCreate: false,
		minLines: 1,
		maxLines: undefined,
		maxLength: undefined,
		tabIndex: 0,
		openModal: noop,
		getIsValidMentionId: noop,
		autocompleteMembers: noop,
		teamId: undefined,
		featureReactMessages: false,
		featureFileThreads: false,
		unsafeAriaProps: undefined,
		showMentionTooltips: true,
		isAutocompleteOpen: false,
		legacyShouldCompleteOnTab: undefined,
		broadcastKeywords: undefined,
		enableBroadcastKeywords: true,
		enableFormattingCommands: true,
		useSonicEmoji: false,
		locale: undefined,
		useSendButton: false,
		usePreNewlines: false
	};

	constructor( props ) {
		super( props );

		this.container = null;
		this.instance = null;
		this.setContainerRef = this.setContainerRef.bind(this);
		this.mentionReplaceTimer = null;
		bindAll(this, ["getBroadcastKeywords", "getUserHighlightWords", "promiseToSearchMembers", "onMouseOver", "onMouseOut", "onTextChange", "onMentionReplace"]);
		this.state = Bn;
	}

	componentDidMount() {
		var r = this;
		var t = this.props,
			n = t.initialText,
			a = t.focusOnMount,
			s = t.useLegacyCreate,
			l = t.teamId;
		this.instance = new sn(this.container, this.getOptions());
		if (!this.instance) {
			alert("error")
			// Object(O["a"])({
			// 	teamId: l
			// }).error("TextyInput: could not create instance");
			return
		}
		if (n) {
			this.value(n);
			this.clearHistory()
		}
		a && setTimeout(function () {
			return r.setCursorAtEnd()
		}, 0);
		this.handlePropChanges()
	}
}

export default TextyInput;