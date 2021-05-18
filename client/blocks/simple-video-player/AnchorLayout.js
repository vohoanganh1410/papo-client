YG3N: function (e, t, a) {
		"use strict";
		a.d(t, "a", function () {
			return n
		}), a.d(t, "b", function () {
			return r
		});
		var n = {
				AUTH_REQUIRED: "auth_required",
				FILENAME_TOO_LONG: "filename_too_long",
				UNIDENTIFIED_EXTERNAL_URL: "unidentified_external_url",
				FILE_TYPE_HAS_NO_HANDLER: "file_type_has_no_handler"
			},
			r = "GDRIVE_FILE_PICKER"
	}, YH7y: function (e, t, a) {
		"use strict";
		a.d(t, "a", function () {
			return s
		});
		var n = a("s4P+"),
			r = a("uVZW"),
			i = Object(n.b)(),
			s = e => {
				var {
					spaceName: t,
					notificationName: a
				} = e;
				a && i.error(r.j, a + " is not a recognized notification name for space " + t + ".")
			}
	}, YH8F: function (e, t, a) {
		"use strict";

		function n(e) {
			for (var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document, a = e.parentElement, n = e.scrollTop; a && a !== t;) n += a.scrollTop, a = a.parentElement;
			return n
		}
		a.d(t, "a", function () {
			return n
		})
	}, YL49: function (e, t, a) {}, YLnb: function (e, t, a) {
		"use strict";
		a.d(t, "a", function () {
			return AnchorLayout
		});
		var n = a("z0G2");
		class AnchorLayout extends n.a {
			constructor() {
				var {
					keys: e,
					heightCache: t,
					containerHeight: a = 0,
					stickToBottom: n = !1,
					bottomMargin: r = 0,
					ANCHOR_OFFSET: i = 0,
					STICKY_EPSILON: s = 2,
					STICKY_EPSILON_SETHEIGHT: o = 2
				} = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
				super({
					keys: e,
					heightCache: t
				}), this.containerHeight = a, this.stickToBottom = n, this.bottomMargin = r, this.STICKY_EPSILON = s, this.STICKY_EPSILON_SETHEIGHT = o, this.ANCHOR_OFFSET = i, this.anchorOffset = i, this.anchor = !1
			}
			getOffsetForKey(e) {
				if (!e) return this.totalHeight;
				var t = this.getTop(e);
				return void 0 === t ? 0 : t - this.anchorOffset
			}
			setHeight(e, t, a) {
				if (!1 !== this.anchor) return super.setHeight(e, t), this.bracketScrollTop(this.getOffsetForKey(this.anchor));
				if (this.shouldStickToBottom(a, this.STICKY_EPSILON_SETHEIGHT)) return super.setHeight(e, t), this.bracketScrollTop(1 / 0);
				var n = a;
				this.getBottom(e) <= a + this.anchorOffset && (n += t - this.getHeight(e));
				return super.setHeight(e, t), this.bracketScrollTop(n)
			}
			setKeys(e, t) {
				if (!1 !== this.anchor) return super.setKeys(e), this.bracketScrollTop(this.getOffsetForKey(this.anchor));
				if (this.shouldStickToBottom(t)) return super.setKeys(e), this.bracketScrollTop(1 / 0);
				var a = t + this.anchorOffset,
					n = this.findAnchor(this.keys, e, a);
				if (!n) return super.setKeys(e), this.bracketScrollTop(t);
				var r = this.getTop(n) - a;
				super.setKeys(e);
				var i = r - (this.getTop(n) - a);
				return this.bracketScrollTop(t - i)
			}
			setContainerHeight(e, t) {
				return !1 !== this.anchor ? (this.containerHeight = e, this.layout(), this.bracketScrollTop(this.getOffsetForKey(this.anchor))) : this.shouldStickToBottom(t) ? (this.containerHeight = e, this.layout(), this.bracketScrollTop(1 / 0)) : (this.containerHeight = e, this.layout(), t)
			}
			setBottomMargin(e) {
				this.bottomMargin = e
			}
			setStickToBottom(e) {
				this.stickToBottom = e
			}
			setAnchor(e, t) {
				this.anchor = e, this.anchorOffset = "number" != typeof t ? this.ANCHOR_OFFSET : t
			}
			findAnchor(e, t, a) {
				for (var n = 0; n < e.length; n++) {
					var r = e[n];
					if (this.getBottom(r) > a)
						for (var i = 0; i < t.length; i++)
							if (t[i] === r) return r
				}
				return null
			}
			bracketScrollTop(e) {
				return Math.max(0, Math.min(this.totalHeight - this.containerHeight + this.bottomMargin, e))
			}
			shouldStickToBottom(e) {
				var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.STICKY_EPSILON;
				return !!this.stickToBottom && e >= this.totalHeight - this.containerHeight - t + this.bottomMargin
			}
		}
	}, YPPF: function (e, t, a) {
		"use strict";
		a.d(t, "d", function () {
			return i
		}), a.d(t, "b", function () {
			return s
		}), a.d(t, "e", function () {
			return o
		}), a.d(t, "f", function () {
			return l
		}), a.d(t, "a", function () {
			return c
		}), a.d(t, "c", function () {
			return d
		});
		var n = a("aK/h"),
			r = a("A2B7"),
			i = Object(r.b)("Store channel draft");
		i.meta = {
			name: "setChannelDraft",
			key: "draftsStoreActionsSetChannelDraft",
			description: "Store channel draft"
		}, i.propTypes = {
			channelId: n.default.string.isRequired,
			threadTs: n.default.string,
			delta: n.default.object.isRequired,
			broadcast: n.default.bool,
			range: n.default.object,
			shouldWithold: n.default.bool
		};
		var s = Object(r.b)("Clear channel draft");
		s.meta = {
			name: "clearChannelDraft",
			key: "draftsStoreActionsClearChannelDraft",
			description: "Clear channel draft"
		}, s.propTypes = {
			channelId: n.default.string.isRequired,
			threadTs: n.default.string
		};
		var o = Object(r.b)("Store composer draft");
		o.meta = {
			name: "setComposerDraft",
			key: "draftsStoreActionsSetComposerDraft",
			description: "Store composer draft"
		}