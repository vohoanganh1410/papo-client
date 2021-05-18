import  React from 'react';
import PropTypes from 'prop-types';
import {values, noop} from 'lodash';

const Hr = {
	ABOVE:1,
	VISIBLE:2,
	BELOW:3
};

class UnreadBanner extends React.PureComponent {
	static propTypes = {
		hasUnreads: PropTypes.bool.isRequired,
		displayCount: PropTypes.number,
		since: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		known: PropTypes.bool,
		do24hrTime: PropTypes.bool,
		channelId: PropTypes.string,
		ghost: PropTypes.bool,
		unreadPlacement: PropTypes.oneOf(values(Hr)),
		jumpToUnread: PropTypes.func,
		markMostRecentMsgRead: PropTypes.func,
		featureJumpToUnreadShortcut: PropTypes.bool,
		onHide: PropTypes.func
	};
	static defaultProps = {
		displayCount: 0,
		since: null,
		do24hrTime: false,
		known: false,
		channelId: null,
		ghost: false,
		unreadPlacement: Hr.VISIBLE,
		jumpToUnread: noop,
		markMostRecentMsgRead: noop,
		featureJumpToUnreadShortcut: false,
		onHide: noop
	};

	constructor(props) {
		super(props);

		this.startFade = this.startFade.bind(this);
		this.onAnimationTick = this.onAnimationTick.bind(this);
		this.onAnimationEnd = this.onAnimationEnd.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.jumpOrMark = this.jumpOrMark.bind(this);
		this.markAsRead = this.markAsRead.bind(this);
		this.animation = null;
		this.delay = null;
		this.state = {
			hasUnreads: props.hasUnreads,
			displayCount: props.displayCount,
			since: props.since,
			unreadPlacement: props.unreadPlacement,
			opacity: 1
		};
	}

	componentWillReceiveProps(t) {
		clearTimeout(this.delay);
		if (this.state.hasUnreads && !t.hasUnreads) {
			if (t.ghost) {
				this.delay = setTimeout(this.startFade, fn);
				return
			}
			this.startFade();
			return
		}
		this.setState(function () {
			return {
				hasUnreads: t.hasUnreads,
				displayCount: t.displayCount,
				since: t.since,
				unreadPlacement: t.unreadPlacement,
				opacity: 1
			}
		})
	}

	componentWillUnmount() {
		clearTimeout(this.delay);
		this.animation && this.animation.cancel()
	}

	onAnimationTick(t) {
		var a = t.value,
			r = t.nextTick;
		if (!this.animation) return;
		this.setState(function () {
			return {
				opacity: a
			}
		});
		r()
	}

	onAnimationEnd() {
		var t = this;
		this.setState(function () {
			return {
				hasUnreads: false,
				opacity: 1
			}
		}, function () {
			t.props.onHide()
		})
	}

	onKeyDown(t) {
		//
	}

	startFade() {
		// this.animation = Object(dn["a"])({
		// 	fromValue: 1,
		// 	toValue: 0,
		// 	duration: vn,
		// 	easing: "easeInQuad",
		// 	onTick: this.onAnimationTick,
		// 	onComplete: this.onAnimationEnd
		// })
	}

	markAsRead(t) {
		// t.stopPropagation();
		// Object(I["b"])().action("UNREAD-BANNER", "Mark " + this.props.channelId + " read");
		// this.props.markMostRecentMsgRead({
		// 	channelId: this.props.channelId,
		// 	reason: _e["MARKED_REASONS"].CLICKED
		// });
		// clearTimeout(this.delay);
		// this.animation && this.animation.cancel();
		// this.onAnimationEnd()
	}

	jumpOrMark(t) {
		this.state.unreadPlacement === Hr.VISIBLE ? this.markAsRead(t) : this.props.jumpToUnread(t)
	}

	makeJumpLabel() {
		if (!this.props.featureJumpToUnreadShortcut) return hn.t("Jump");
		if (!Object(mr["a"])()) return hn.t("Jump");
		var t = "Ctrl";// Object(mn["isMac"])() ? hn.t("Cmd") : hn.t("Ctrl");
		// return hn.rt("Jump <span>({t} + J)</span>", {
		// 	cmdButton: t
		// }, function (e) {
		// 	var t = e.text,
		// 		a = e.key;
		// 	return n.a.createElement("span", {
		// 		key: a,
		// 		className: "normal"
		// 	}, t)
		// })
	}


}

export default UnreadBanner;
