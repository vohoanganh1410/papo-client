import { find } from 'lodash';

export function U(t) {
	var a = t.value,
		r = t.min,
		n = t.max;
	return Math.max(r, Math.min(n, a))
};
export function q(t) {
	var a = t.value,
		r = t.min,
		n = t.max;
	return (a - r) / (n - r)
};
export function G(t) {
	var a = t.value,
		r = t.min,
		n = t.max;
	return a * (n - r) + r
};
export function W(t, a) {
	return {
		left: Math.min(t.x, a.x),
		top: Math.min(t.y, a.y),
		width: Math.abs(t.x - a.x),
		height: Math.abs(t.y - a.y)
	}
};
export function H(t) {
	return {
		x: t.left + t.width / 2,
		y: t.top + t.height / 2
	}
};
export function V(t, a) {
	return Object.assign({}, t, {
		left: t.left - a.left,
		top: t.top - a.top
	})
};

export function z(e) {
	// if (B.a.mac) return e.metaKey; // currently not support macOS
	return e.ctrlKey
}
export function K(t) {
	var a = t.scale,
		r = t.translate,
		n = t.minScale,
		i = t.size;
	var s = Object.assign({}, r);
	Math.abs(r.y) > i.height / 2 * (a - n) && (s.y = Math.sign(r.y) * (i.height / 2) * (a - n));
	Math.abs(r.x) > i.width / 2 * (a - n) && (s.x = Math.sign(r.x) * (i.width / 2) * (a - n));
	return s
};
export function Y(t) {
	var a = t.value,
		r = t.direction,
		n = t.steps;
	var i = 1 === r;
	var s = i ? n : n.slice().reverse();
	var o = function e(t, a) {
		return (i ? t < a : t > a) && t !== a
	};
	return find(s, function (e) {
		return o(a, e)
	})
};
export function Q(t) {
	var a = t.point,
		r = t.containerRect,
		n = t.targetRect,
		i = t.prevScale,
		s = t.newScale,
		o = t.prevTranslate,
		l = t.minScale,
		c = t.maxScale;
	var u = U({
		value: s,
		min: l,
		max: c
	});
	var d = u - i;
	var p = H(r);
	var m = {
		x: (a.x - o.x - p.x) / i,
		y: (a.y - o.y - p.y) / i
	};
	var h = K({
		scale: u,
		translate: {
			x: o.x - m.x * d,
			y: o.y - m.y * d
		},
		minScale: l,
		size: n
	});
	return {
		scale: u,
		translate: h
	}
};
export function J(t) {
	var a = t.rect,
		r = t.prevScale,
		n = t.prevTranslate,
		i = t.minScale,
		s = t.maxScale,
		o = t.containerRect,
		l = t.targetRect;
	var c = H(o);
	var u = H(a);
	var d = Math.min(o.width / a.width, o.height / a.height);
	var p = U({
		value: r * d,
		min: i,
		max: s
	});
	var m = K({
		scale: p,
		translate: {
			x: n.x * (p / r) - (u.x - c.x) * (p / r),
			y: n.y * (p / r) - (u.y - c.y) * (p / r)
		},
		minScale: i,
		size: l
	});
	return {
		scale: p,
		translate: m
	}
};
export function Z(t) {
	var a = t.delta,
		r = t.targetRect,
		n = t.prevScale,
		i = t.prevTranslate,
		s = t.minScale;
	var o = K({
		scale: n || 0,
		translate: {
			x: i.x + a.x,
			y: i.y + a.y
		},
		minScale: s,
		size: r
	});
	return {
		translate: o
	}
};
