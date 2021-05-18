import React from 'react';
import PropTypes from 'prop-types';

export default class Foreword extends React.PureComponent {
	static propTypes = {
		channelId: PropTypes.string,
		channelType: PropTypes.string,
		hasLimitedHistory: PropTypes.bool,
		isShared: PropTypes.bool,
		isSlackbotIm: PropTypes.bool,
		newxpOnboardingStep: PropTypes.string,
	};
	static defaultProps = {
		channelId: null,
		channelType: null,
		hasLimitedHistory: false,
		isShared: false,
		isSlackbotIm: false,
		newxpOnboardingStep: null,
	};

	render() {
		// const t = this.props,
		// 	a = t.channelId,
		// 	r = t.channelType,
		// 	i = t.hasLimitedHistory,
		// 	s = t.isShared,
		// 	o = t.isSlackbotIm,
		// 	l = t.newxpOnboardingStep;
		// if (o) {
		// 	if (l && l !== Ua.COMPLETE) return n.a.createElement(Ga, {
		// 		step: l
		// 	});
		// 	return n.a.createElement(Sa, null)
		// }
		// if (i) return n.a.createElement(sa, {
		// 	channelId: a
		// });
		// if ("channel" === r || "private" === r) {
		// 	if (s) return n.a.createElement(Ma, {
		// 		channelId: a
		// 	});
		// 	return n.a.createElement(jt, {
		// 		channelId: a
		// 	})
		// }
		// if ("im" === r) {
		// 	if (s) return n.a.createElement(Xt, {
		// 		channelId: a
		// 	});
		// 	return n.a.createElement(Wt, {
		// 		channelId: a
		// 	})
		// }
		// if ("mpim" === r) return n.a.createElement(ka, {
		// 	channelId: a
		// });
		// Object(N["b"])().warn('Unknown foreword type "' + r + '"');
		return null;
	}
}
