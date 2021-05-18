z0G2: function (e, t, a) {
	"use strict";
	a.d(t, "a", function () {
		return Layout
	});
	var n = a("OZf9"),
		r = a("ifKl"),
		i = a("ukTK");
	class Layout {
		constructor() {
			var {
				keys: e = [],
				heightCache: t = new i.a,
				onTotalHeightChange: a = r.a
			} = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
			this.keys = e, this.heightCache = t, this.onTotalHeightChange = a, this.layout()
		}
		layout() {
			var {
				keys: e
			} = this, t = {}, a = 0;
			Object(n.a)(e, e => {
				t[e] = a, a += this.getHeight(e)
			}), this.tops = t, a !== this.totalHeight && this.onTotalHeightChange(a), this.totalHeight = a
		}
		getHeight(e) {
			return this.heightCache.get(e)
		}
		getHeightValidity(e) {
			return this.heightCache.getValidity(e)
		}
		getTop(e) {
			return this.tops[e]
		}
		getBottom(e) {
			return this.tops[e] + this.getHeight(e)
		}
		getTops() {
			return this.tops
		}
		getTotalHeight() {
			return this.totalHeight
		}
		getOffsetForKey(e) {
			return e ? this.getTop(e) : this.totalHeight
		}
		getBounds(e, t) {
			for (var a = this.keys, n = 0; n + 1 < a.length;) {
				var r = a[n + 1];
				if (this.getTop(r) > e) break;
				n += 1
			}
			for (var i = n; i < a.length;) {
				var s = a[i];
				if (this.getTop(s) > t) break;
				i += 1
			}
			return {
				start: n,
				end: i
			}
		}
		setHeight(e, t) {
			this.heightCache.set(e, t), this.layout()
		}
		setKeys(e) {
			this.keys = e, this.layout()
		}
	}
}