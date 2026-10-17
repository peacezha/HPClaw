//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/third_party/rxjs/rxjs.js
var e = function(t, n) {
	return e = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, t) {
		e.__proto__ = t;
	} || function(e, t) {
		for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
	}, e(t, n);
};
function t(t, n) {
	if (typeof n != "function" && n !== null) throw TypeError("Class extends value " + String(n) + " is not a constructor or null");
	e(t, n);
	function r() {
		this.constructor = t;
	}
	t.prototype = n === null ? Object.create(n) : (r.prototype = n.prototype, new r());
}
function n(e, t, n, r) {
	function i(e) {
		return e instanceof n ? e : new n(function(t) {
			t(e);
		});
	}
	return new (n ||= Promise)(function(n, a) {
		function o(e) {
			try {
				c(r.next(e));
			} catch (e) {
				a(e);
			}
		}
		function s(e) {
			try {
				c(r.throw(e));
			} catch (e) {
				a(e);
			}
		}
		function c(e) {
			e.done ? n(e.value) : i(e.value).then(o, s);
		}
		c((r = r.apply(e, t || [])).next());
	});
}
function r(e, t) {
	var n = {
		label: 0,
		sent: function() {
			if (a[0] & 1) throw a[1];
			return a[1];
		},
		trys: [],
		ops: []
	}, r, i, a, o = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
	return o.next = s(0), o.throw = s(1), o.return = s(2), typeof Symbol == "function" && (o[Symbol.iterator] = function() {
		return this;
	}), o;
	function s(e) {
		return function(t) {
			return c([e, t]);
		};
	}
	function c(s) {
		if (r) throw TypeError("Generator is already executing.");
		for (; o && (o = 0, s[0] && (n = 0)), n;) try {
			if (r = 1, i && (a = s[0] & 2 ? i.return : s[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, s[1])).done) return a;
			switch (i = 0, a && (s = [s[0] & 2, a.value]), s[0]) {
				case 0:
				case 1:
					a = s;
					break;
				case 4: return n.label++, {
					value: s[1],
					done: !1
				};
				case 5:
					n.label++, i = s[1], s = [0];
					continue;
				case 7:
					s = n.ops.pop(), n.trys.pop();
					continue;
				default:
					if (a = n.trys, !(a = a.length > 0 && a[a.length - 1]) && (s[0] === 6 || s[0] === 2)) {
						n = 0;
						continue;
					}
					if (s[0] === 3 && (!a || s[1] > a[0] && s[1] < a[3])) {
						n.label = s[1];
						break;
					}
					if (s[0] === 6 && n.label < a[1]) {
						n.label = a[1], a = s;
						break;
					}
					if (a && n.label < a[2]) {
						n.label = a[2], n.ops.push(s);
						break;
					}
					a[2] && n.ops.pop(), n.trys.pop();
					continue;
			}
			s = t.call(e, n);
		} catch (e) {
			s = [6, e], i = 0;
		} finally {
			r = a = 0;
		}
		if (s[0] & 5) throw s[1];
		return {
			value: s[0] ? s[1] : void 0,
			done: !0
		};
	}
}
function i(e) {
	var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
	if (n) return n.call(e);
	if (e && typeof e.length == "number") return { next: function() {
		return e && r >= e.length && (e = void 0), {
			value: e && e[r++],
			done: !e
		};
	} };
	throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function a(e, t) {
	var n = typeof Symbol == "function" && e[Symbol.iterator];
	if (!n) return e;
	var r = n.call(e), i, a = [], o;
	try {
		for (; (t === void 0 || t-- > 0) && !(i = r.next()).done;) a.push(i.value);
	} catch (e) {
		o = { error: e };
	} finally {
		try {
			i && !i.done && (n = r.return) && n.call(r);
		} finally {
			if (o) throw o.error;
		}
	}
	return a;
}
function o(e, t, n) {
	if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
	return e.concat(a || Array.prototype.slice.call(t));
}
function s(e) {
	return this instanceof s ? (this.v = e, this) : new s(e);
}
function c(e, t, n) {
	if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
	var r = n.apply(e, t || []), i, a = [];
	return i = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), c("next"), c("throw"), c("return", o), i[Symbol.asyncIterator] = function() {
		return this;
	}, i;
	function o(e) {
		return function(t) {
			return Promise.resolve(t).then(e, f);
		};
	}
	function c(e, t) {
		r[e] && (i[e] = function(t) {
			return new Promise(function(n, r) {
				a.push([
					e,
					t,
					n,
					r
				]) > 1 || l(e, t);
			});
		}, t && (i[e] = t(i[e])));
	}
	function l(e, t) {
		try {
			u(r[e](t));
		} catch (e) {
			p(a[0][3], e);
		}
	}
	function u(e) {
		e.value instanceof s ? Promise.resolve(e.value.v).then(d, f) : p(a[0][2], e);
	}
	function d(e) {
		l("next", e);
	}
	function f(e) {
		l("throw", e);
	}
	function p(e, t) {
		e(t), a.shift(), a.length && l(a[0][0], a[0][1]);
	}
}
function l(e) {
	if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
	var t = e[Symbol.asyncIterator], n;
	return t ? t.call(e) : (e = typeof i == "function" ? i(e) : e[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
		return this;
	}, n);
	function r(t) {
		n[t] = e[t] && function(n) {
			return new Promise(function(r, i) {
				n = e[t](n), a(r, i, n.done, n.value);
			});
		};
	}
	function a(e, t, n, r) {
		Promise.resolve(r).then(function(t) {
			e({
				value: t,
				done: n
			});
		}, t);
	}
}
function u(e) {
	return typeof e == "function";
}
function d(e) {
	var t = e(function(e) {
		Error.call(e), e.stack = (/* @__PURE__ */ Error()).stack;
	});
	return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
}
var f = d(function(e) {
	return function(t) {
		e(this), this.message = t ? t.length + " errors occurred during unsubscription:\n" + t.map(function(e, t) {
			return t + 1 + ") " + e.toString();
		}).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t;
	};
});
function p(e, t) {
	if (e) {
		var n = e.indexOf(t);
		0 <= n && e.splice(n, 1);
	}
}
var m = (function() {
	function e(e) {
		this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null;
	}
	return e.prototype.unsubscribe = function() {
		var e, t, n, r, s;
		if (!this.closed) {
			this.closed = !0;
			var c = this._parentage;
			if (c) {
				if (this._parentage = null, Array.isArray(c)) try {
					for (var l = i(c), d = l.next(); !d.done; d = l.next()) d.value.remove(this);
				} catch (t) {
					e = { error: t };
				} finally {
					try {
						d && !d.done && (t = l.return) && t.call(l);
					} finally {
						if (e) throw e.error;
					}
				}
				else c.remove(this);
			}
			var p = this.initialTeardown;
			if (u(p)) try {
				p();
			} catch (e) {
				s = e instanceof f ? e.errors : [e];
			}
			var m = this._finalizers;
			if (m) {
				this._finalizers = null;
				try {
					for (var h = i(m), g = h.next(); !g.done; g = h.next()) {
						var v = g.value;
						try {
							_(v);
						} catch (e) {
							s ??= [], e instanceof f ? s = o(o([], a(s)), a(e.errors)) : s.push(e);
						}
					}
				} catch (e) {
					n = { error: e };
				} finally {
					try {
						g && !g.done && (r = h.return) && r.call(h);
					} finally {
						if (n) throw n.error;
					}
				}
			}
			if (s) throw new f(s);
		}
	}, e.prototype.add = function(t) {
		if (t && t !== this) {
			if (this.closed) _(t);
			else {
				if (t instanceof e) {
					if (t.closed || t._hasParent(this)) return;
					t._addParent(this);
				}
				(this._finalizers = this._finalizers ?? []).push(t);
			}
		}
	}, e.prototype._hasParent = function(e) {
		var t = this._parentage;
		return t === e || Array.isArray(t) && t.includes(e);
	}, e.prototype._addParent = function(e) {
		var t = this._parentage;
		this._parentage = Array.isArray(t) ? (t.push(e), t) : t ? [t, e] : e;
	}, e.prototype._removeParent = function(e) {
		var t = this._parentage;
		t === e ? this._parentage = null : Array.isArray(t) && p(t, e);
	}, e.prototype.remove = function(t) {
		var n = this._finalizers;
		n && p(n, t), t instanceof e && t._removeParent(this);
	}, e.EMPTY = (function() {
		var t = new e();
		return t.closed = !0, t;
	})(), e;
})(), h = m.EMPTY;
function g(e) {
	return e instanceof m || e && "closed" in e && u(e.remove) && u(e.add) && u(e.unsubscribe);
}
function _(e) {
	u(e) ? e() : e.unsubscribe();
}
var v = {
	onUnhandledError: null,
	onStoppedNotification: null,
	Promise: void 0,
	useDeprecatedSynchronousErrorHandling: !1,
	useDeprecatedNextContext: !1
}, ee = {
	setTimeout: function(e, t) {
		var n = [...arguments].slice(2), r = ee.delegate;
		return r?.setTimeout ? r.setTimeout.apply(r, o([e, t], a(n))) : setTimeout.apply(void 0, o([e, t], a(n)));
	},
	clearTimeout: function(e) {
		return (ee.delegate?.clearTimeout || clearTimeout)(e);
	},
	delegate: void 0
};
function te(e) {
	ee.setTimeout(function() {
		var t = v.onUnhandledError;
		if (t) t(e);
		else throw e;
	});
}
function y() {}
var b = (function() {
	return re("C", void 0, void 0);
})();
function x(e) {
	return re("E", void 0, e);
}
function ne(e) {
	return re("N", e, void 0);
}
function re(e, t, n) {
	return {
		kind: e,
		value: t,
		error: n
	};
}
var ie = null;
function ae(e) {
	if (v.useDeprecatedSynchronousErrorHandling) {
		var t = !ie;
		if (t && (ie = {
			errorThrown: !1,
			error: null
		}), e(), t) {
			var n = ie, r = n.errorThrown, i = n.error;
			if (ie = null, r) throw i;
		}
	} else e();
}
function oe(e) {
	v.useDeprecatedSynchronousErrorHandling && ie && (ie.errorThrown = !0, ie.error = e);
}
var se = (function(e) {
	t(n, e);
	function n(t) {
		var n = e.call(this) || this;
		return n.isStopped = !1, t ? (n.destination = t, g(t) && t.add(n)) : n.destination = me, n;
	}
	return n.create = function(e, t, n) {
		return new de(e, t, n);
	}, n.prototype.next = function(e) {
		this.isStopped ? pe(ne(e), this) : this._next(e);
	}, n.prototype.error = function(e) {
		this.isStopped ? pe(x(e), this) : (this.isStopped = !0, this._error(e));
	}, n.prototype.complete = function() {
		this.isStopped ? pe(b, this) : (this.isStopped = !0, this._complete());
	}, n.prototype.unsubscribe = function() {
		this.closed || (this.isStopped = !0, e.prototype.unsubscribe.call(this), this.destination = null);
	}, n.prototype._next = function(e) {
		this.destination.next(e);
	}, n.prototype._error = function(e) {
		try {
			this.destination.error(e);
		} finally {
			this.unsubscribe();
		}
	}, n.prototype._complete = function() {
		try {
			this.destination.complete();
		} finally {
			this.unsubscribe();
		}
	}, n;
})(m), ce = Function.prototype.bind;
function le(e, t) {
	return ce.call(e, t);
}
var ue = (function() {
	function e(e) {
		this.partialObserver = e;
	}
	return e.prototype.next = function(e) {
		var t = this.partialObserver;
		if (t.next) try {
			t.next(e);
		} catch (e) {
			fe(e);
		}
	}, e.prototype.error = function(e) {
		var t = this.partialObserver;
		if (t.error) try {
			t.error(e);
		} catch (e) {
			fe(e);
		}
		else fe(e);
	}, e.prototype.complete = function() {
		var e = this.partialObserver;
		if (e.complete) try {
			e.complete();
		} catch (e) {
			fe(e);
		}
	}, e;
})(), de = (function(e) {
	t(n, e);
	function n(t, n, r) {
		var i = e.call(this) || this, a;
		if (u(t) || !t) a = {
			next: t ?? void 0,
			error: n ?? void 0,
			complete: r ?? void 0
		};
		else {
			var o;
			i && v.useDeprecatedNextContext ? (o = Object.create(t), o.unsubscribe = function() {
				return i.unsubscribe();
			}, a = {
				next: t.next && le(t.next, o),
				error: t.error && le(t.error, o),
				complete: t.complete && le(t.complete, o)
			}) : a = t;
		}
		return i.destination = new ue(a), i;
	}
	return n;
})(se);
function fe(e) {
	v.useDeprecatedSynchronousErrorHandling ? oe(e) : te(e);
}
function S(e) {
	throw e;
}
function pe(e, t) {
	var n = v.onStoppedNotification;
	n && ee.setTimeout(function() {
		return n(e, t);
	});
}
var me = {
	closed: !0,
	next: y,
	error: S,
	complete: y
}, he = (function() {
	return typeof Symbol == "function" && Symbol.observable || "@@observable";
})();
function ge(e) {
	return e;
}
function _e() {
	return ve([...arguments]);
}
function ve(e) {
	return e.length === 0 ? ge : e.length === 1 ? e[0] : function(t) {
		return e.reduce(function(e, t) {
			return t(e);
		}, t);
	};
}
var C = (function() {
	function e(e) {
		e && (this._subscribe = e);
	}
	return e.prototype.lift = function(t) {
		var n = new e();
		return n.source = this, n.operator = t, n;
	}, e.prototype.subscribe = function(e, t, n) {
		var r = this, i = xe(e) ? e : new de(e, t, n);
		return ae(function() {
			var e = r, t = e.operator, n = e.source;
			i.add(t ? t.call(i, n) : n ? r._subscribe(i) : r._trySubscribe(i));
		}), i;
	}, e.prototype._trySubscribe = function(e) {
		try {
			return this._subscribe(e);
		} catch (t) {
			e.error(t);
		}
	}, e.prototype.forEach = function(e, t) {
		var n = this;
		return t = ye(t), new t(function(t, r) {
			var i = new de({
				next: function(t) {
					try {
						e(t);
					} catch (e) {
						r(e), i.unsubscribe();
					}
				},
				error: r,
				complete: t
			});
			n.subscribe(i);
		});
	}, e.prototype._subscribe = function(e) {
		return this.source?.subscribe(e);
	}, e.prototype[he] = function() {
		return this;
	}, e.prototype.pipe = function() {
		return ve([...arguments])(this);
	}, e.prototype.toPromise = function(e) {
		var t = this;
		return e = ye(e), new e(function(e, n) {
			var r;
			t.subscribe(function(e) {
				return r = e;
			}, function(e) {
				return n(e);
			}, function() {
				return e(r);
			});
		});
	}, e.create = function(t) {
		return new e(t);
	}, e;
})();
function ye(e) {
	return e ?? v.Promise ?? Promise;
}
function be(e) {
	return e && u(e.next) && u(e.error) && u(e.complete);
}
function xe(e) {
	return e && e instanceof se || be(e) && g(e);
}
function Se(e) {
	return u(e?.lift);
}
function w(e) {
	return function(t) {
		if (Se(t)) return t.lift(function(t) {
			try {
				return e(t, this);
			} catch (e) {
				this.error(e);
			}
		});
		throw TypeError("Unable to lift unknown Observable type");
	};
}
function T(e, t, n, r, i) {
	return new Ce(e, t, n, r, i);
}
var Ce = (function(e) {
	t(n, e);
	function n(t, n, r, i, a, o) {
		var s = e.call(this, t) || this;
		return s.onFinalize = a, s.shouldUnsubscribe = o, s._next = n ? function(e) {
			try {
				n(e);
			} catch (e) {
				t.error(e);
			}
		} : e.prototype._next, s._error = i ? function(e) {
			try {
				i(e);
			} catch (e) {
				t.error(e);
			} finally {
				this.unsubscribe();
			}
		} : e.prototype._error, s._complete = r ? function() {
			try {
				r();
			} catch (e) {
				t.error(e);
			} finally {
				this.unsubscribe();
			}
		} : e.prototype._complete, s;
	}
	return n.prototype.unsubscribe = function() {
		var t;
		if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
			var n = this.closed;
			e.prototype.unsubscribe.call(this), !n && ((t = this.onFinalize) == null || t.call(this));
		}
	}, n;
})(se), we = d(function(e) {
	return function() {
		e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
	};
}), Te = (function(e) {
	t(n, e);
	function n() {
		var t = e.call(this) || this;
		return t.closed = !1, t.currentObservers = null, t.observers = [], t.isStopped = !1, t.hasError = !1, t.thrownError = null, t;
	}
	return n.prototype.lift = function(e) {
		var t = new Ee(this, this);
		return t.operator = e, t;
	}, n.prototype._throwIfClosed = function() {
		if (this.closed) throw new we();
	}, n.prototype.next = function(e) {
		var t = this;
		ae(function() {
			var n, r;
			if (t._throwIfClosed(), !t.isStopped) {
				t.currentObservers ||= Array.from(t.observers);
				try {
					for (var a = i(t.currentObservers), o = a.next(); !o.done; o = a.next()) o.value.next(e);
				} catch (e) {
					n = { error: e };
				} finally {
					try {
						o && !o.done && (r = a.return) && r.call(a);
					} finally {
						if (n) throw n.error;
					}
				}
			}
		});
	}, n.prototype.error = function(e) {
		var t = this;
		ae(function() {
			if (t._throwIfClosed(), !t.isStopped) {
				t.hasError = t.isStopped = !0, t.thrownError = e;
				for (var n = t.observers; n.length;) n.shift().error(e);
			}
		});
	}, n.prototype.complete = function() {
		var e = this;
		ae(function() {
			if (e._throwIfClosed(), !e.isStopped) {
				e.isStopped = !0;
				for (var t = e.observers; t.length;) t.shift().complete();
			}
		});
	}, n.prototype.unsubscribe = function() {
		this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
	}, Object.defineProperty(n.prototype, "observed", {
		get: function() {
			return this.observers?.length > 0;
		},
		enumerable: !1,
		configurable: !0
	}), n.prototype._trySubscribe = function(t) {
		return this._throwIfClosed(), e.prototype._trySubscribe.call(this, t);
	}, n.prototype._subscribe = function(e) {
		return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e);
	}, n.prototype._innerSubscribe = function(e) {
		var t = this, n = this, r = n.hasError, i = n.isStopped, a = n.observers;
		return r || i ? h : (this.currentObservers = null, a.push(e), new m(function() {
			t.currentObservers = null, p(a, e);
		}));
	}, n.prototype._checkFinalizedStatuses = function(e) {
		var t = this, n = t.hasError, r = t.thrownError, i = t.isStopped;
		n ? e.error(r) : i && e.complete();
	}, n.prototype.asObservable = function() {
		var e = new C();
		return e.source = this, e;
	}, n.create = function(e, t) {
		return new Ee(e, t);
	}, n;
})(C), Ee = (function(e) {
	t(n, e);
	function n(t, n) {
		var r = e.call(this) || this;
		return r.destination = t, r.source = n, r;
	}
	return n.prototype.next = function(e) {
		var t, n;
		(n = (t = this.destination)?.next) == null || n.call(t, e);
	}, n.prototype.error = function(e) {
		var t, n;
		(n = (t = this.destination)?.error) == null || n.call(t, e);
	}, n.prototype.complete = function() {
		var e, t;
		(t = (e = this.destination)?.complete) == null || t.call(e);
	}, n.prototype._subscribe = function(e) {
		return this.source?.subscribe(e) ?? h;
	}, n;
})(Te), De = {
	now: function() {
		return (De.delegate || Date).now();
	},
	delegate: void 0
}, Oe = (function(e) {
	t(n, e);
	function n(t, n, r) {
		t === void 0 && (t = Infinity), n === void 0 && (n = Infinity), r === void 0 && (r = De);
		var i = e.call(this) || this;
		return i._bufferSize = t, i._windowTime = n, i._timestampProvider = r, i._buffer = [], i._infiniteTimeWindow = !0, i._infiniteTimeWindow = n === Infinity, i._bufferSize = Math.max(1, t), i._windowTime = Math.max(1, n), i;
	}
	return n.prototype.next = function(t) {
		var n = this, r = n.isStopped, i = n._buffer, a = n._infiniteTimeWindow, o = n._timestampProvider, s = n._windowTime;
		r || (i.push(t), !a && i.push(o.now() + s)), this._trimBuffer(), e.prototype.next.call(this, t);
	}, n.prototype._subscribe = function(e) {
		this._throwIfClosed(), this._trimBuffer();
		for (var t = this._innerSubscribe(e), n = this, r = n._infiniteTimeWindow, i = n._buffer.slice(), a = 0; a < i.length && !e.closed; a += r ? 1 : 2) e.next(i[a]);
		return this._checkFinalizedStatuses(e), t;
	}, n.prototype._trimBuffer = function() {
		var e = this, t = e._bufferSize, n = e._timestampProvider, r = e._buffer, i = e._infiniteTimeWindow, a = (i ? 1 : 2) * t;
		if (t < Infinity && a < r.length && r.splice(0, r.length - a), !i) {
			for (var o = n.now(), s = 0, c = 1; c < r.length && r[c] <= o; c += 2) s = c;
			s && r.splice(0, s + 1);
		}
	}, n;
})(Te), ke = (function(e) {
	t(n, e);
	function n(t, n) {
		return e.call(this) || this;
	}
	return n.prototype.schedule = function(e, t) {
		return t === void 0 && (t = 0), this;
	}, n;
})(m), Ae = {
	setInterval: function(e, t) {
		var n = [...arguments].slice(2), r = Ae.delegate;
		return r?.setInterval ? r.setInterval.apply(r, o([e, t], a(n))) : setInterval.apply(void 0, o([e, t], a(n)));
	},
	clearInterval: function(e) {
		return (Ae.delegate?.clearInterval || clearInterval)(e);
	},
	delegate: void 0
}, je = (function(e) {
	t(n, e);
	function n(t, n) {
		var r = e.call(this, t, n) || this;
		return r.scheduler = t, r.work = n, r.pending = !1, r;
	}
	return n.prototype.schedule = function(e, t) {
		if (t === void 0 && (t = 0), this.closed) return this;
		this.state = e;
		var n = this.id, r = this.scheduler;
		return n != null && (this.id = this.recycleAsyncId(r, n, t)), this.pending = !0, this.delay = t, this.id = this.id ?? this.requestAsyncId(r, this.id, t), this;
	}, n.prototype.requestAsyncId = function(e, t, n) {
		return n === void 0 && (n = 0), Ae.setInterval(e.flush.bind(e, this), n);
	}, n.prototype.recycleAsyncId = function(e, t, n) {
		if (n === void 0 && (n = 0), n != null && this.delay === n && this.pending === !1) return t;
		t != null && Ae.clearInterval(t);
	}, n.prototype.execute = function(e, t) {
		if (this.closed) return /* @__PURE__ */ Error("executing a cancelled action");
		this.pending = !1;
		var n = this._execute(e, t);
		if (n) return n;
		this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
	}, n.prototype._execute = function(e, t) {
		var n = !1, r;
		try {
			this.work(e);
		} catch (e) {
			n = !0, r = e || /* @__PURE__ */ Error("Scheduled action threw falsy error");
		}
		if (n) return this.unsubscribe(), r;
	}, n.prototype.unsubscribe = function() {
		if (!this.closed) {
			var t = this, n = t.id, r = t.scheduler, i = r.actions;
			this.work = this.state = this.scheduler = null, this.pending = !1, p(i, this), n != null && (this.id = this.recycleAsyncId(r, n, null)), this.delay = null, e.prototype.unsubscribe.call(this);
		}
	}, n;
})(ke), Me = (function() {
	function e(t, n) {
		n === void 0 && (n = e.now), this.schedulerActionCtor = t, this.now = n;
	}
	return e.prototype.schedule = function(e, t, n) {
		return t === void 0 && (t = 0), new this.schedulerActionCtor(this, e).schedule(n, t);
	}, e.now = De.now, e;
})(), Ne = new ((function(e) {
	t(n, e);
	function n(t, n) {
		n === void 0 && (n = Me.now);
		var r = e.call(this, t, n) || this;
		return r.actions = [], r._active = !1, r;
	}
	return n.prototype.flush = function(e) {
		var t = this.actions;
		if (this._active) {
			t.push(e);
			return;
		}
		var n;
		this._active = !0;
		do
			if (n = e.execute(e.state, e.delay)) break;
		while (e = t.shift());
		if (this._active = !1, n) {
			for (; e = t.shift();) e.unsubscribe();
			throw n;
		}
	}, n;
})(Me))(je), Pe = new C(function(e) {
	return e.complete();
});
function Fe(e) {
	return e && u(e.schedule);
}
function Ie(e) {
	return e[e.length - 1];
}
function Le(e) {
	return Fe(Ie(e)) ? e.pop() : void 0;
}
function Re(e, t) {
	return typeof Ie(e) == "number" ? e.pop() : t;
}
var ze = (function(e) {
	return e && typeof e.length == "number" && typeof e != "function";
});
function Be(e) {
	return u(e?.then);
}
function Ve(e) {
	return u(e[he]);
}
function He(e) {
	return Symbol.asyncIterator && u(e?.[Symbol.asyncIterator]);
}
function Ue(e) {
	return /* @__PURE__ */ TypeError("You provided " + (typeof e == "object" && e ? "an invalid object" : "'" + e + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function We() {
	return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var Ge = We();
function Ke(e) {
	return u(e?.[Ge]);
}
function qe(e) {
	return c(this, arguments, function() {
		var t, n, i, a;
		return r(this, function(r) {
			switch (r.label) {
				case 0: t = e.getReader(), r.label = 1;
				case 1: r.trys.push([
					1,
					,
					9,
					10
				]), r.label = 2;
				case 2: return [4, s(t.read())];
				case 3: return n = r.sent(), i = n.value, a = n.done, a ? [4, s(void 0)] : [3, 5];
				case 4: return [2, r.sent()];
				case 5: return [4, s(i)];
				case 6: return [4, r.sent()];
				case 7: return r.sent(), [3, 2];
				case 8: return [3, 10];
				case 9: return t.releaseLock(), [7];
				case 10: return [2];
			}
		});
	});
}
function Je(e) {
	return u(e?.getReader);
}
function E(e) {
	if (e instanceof C) return e;
	if (e != null) {
		if (Ve(e)) return Ye(e);
		if (ze(e)) return Xe(e);
		if (Be(e)) return Ze(e);
		if (He(e)) return $e(e);
		if (Ke(e)) return Qe(e);
		if (Je(e)) return et(e);
	}
	throw Ue(e);
}
function Ye(e) {
	return new C(function(t) {
		var n = e[he]();
		if (u(n.subscribe)) return n.subscribe(t);
		throw TypeError("Provided object does not correctly implement Symbol.observable");
	});
}
function Xe(e) {
	return new C(function(t) {
		for (var n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
		t.complete();
	});
}
function Ze(e) {
	return new C(function(t) {
		e.then(function(e) {
			t.closed || (t.next(e), t.complete());
		}, function(e) {
			return t.error(e);
		}).then(null, te);
	});
}
function Qe(e) {
	return new C(function(t) {
		var n, r;
		try {
			for (var a = i(e), o = a.next(); !o.done; o = a.next()) {
				var s = o.value;
				if (t.next(s), t.closed) return;
			}
		} catch (e) {
			n = { error: e };
		} finally {
			try {
				o && !o.done && (r = a.return) && r.call(a);
			} finally {
				if (n) throw n.error;
			}
		}
		t.complete();
	});
}
function $e(e) {
	return new C(function(t) {
		tt(e, t).catch(function(e) {
			return t.error(e);
		});
	});
}
function et(e) {
	return $e(qe(e));
}
function tt(e, t) {
	var i, a, o, s;
	return n(this, void 0, void 0, function() {
		var n, c;
		return r(this, function(r) {
			switch (r.label) {
				case 0: r.trys.push([
					0,
					5,
					6,
					11
				]), i = l(e), r.label = 1;
				case 1: return [4, i.next()];
				case 2:
					if (a = r.sent(), a.done) return [3, 4];
					if (n = a.value, t.next(n), t.closed) return [2];
					r.label = 3;
				case 3: return [3, 1];
				case 4: return [3, 11];
				case 5: return c = r.sent(), o = { error: c }, [3, 11];
				case 6: return r.trys.push([
					6,
					,
					9,
					10
				]), a && !a.done && (s = i.return) ? [4, s.call(i)] : [3, 8];
				case 7: r.sent(), r.label = 8;
				case 8: return [3, 10];
				case 9:
					if (o) throw o.error;
					return [7];
				case 10: return [7];
				case 11: return t.complete(), [2];
			}
		});
	});
}
function nt(e, t, n, r, i) {
	r === void 0 && (r = 0), i === void 0 && (i = !1);
	var a = t.schedule(function() {
		n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
	}, r);
	if (e.add(a), !i) return a;
}
function rt(e, t) {
	return t === void 0 && (t = 0), w(function(n, r) {
		n.subscribe(T(r, function(n) {
			return nt(r, e, function() {
				return r.next(n);
			}, t);
		}, function() {
			return nt(r, e, function() {
				return r.complete();
			}, t);
		}, function(n) {
			return nt(r, e, function() {
				return r.error(n);
			}, t);
		}));
	});
}
function it(e, t) {
	return t === void 0 && (t = 0), w(function(n, r) {
		r.add(e.schedule(function() {
			return n.subscribe(r);
		}, t));
	});
}
function at(e, t) {
	return E(e).pipe(it(t), rt(t));
}
function ot(e, t) {
	return E(e).pipe(it(t), rt(t));
}
function st(e, t) {
	return new C(function(n) {
		var r = 0;
		return t.schedule(function() {
			r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
		});
	});
}
function ct(e, t) {
	return new C(function(n) {
		var r;
		return nt(n, t, function() {
			r = e[Ge](), nt(n, t, function() {
				var e, t, i;
				try {
					e = r.next(), t = e.value, i = e.done;
				} catch (e) {
					n.error(e);
					return;
				}
				i ? n.complete() : n.next(t);
			}, 0, !0);
		}), function() {
			return u(r?.return) && r.return();
		};
	});
}
function lt(e, t) {
	if (!e) throw Error("Iterable cannot be null");
	return new C(function(n) {
		nt(n, t, function() {
			var r = e[Symbol.asyncIterator]();
			nt(n, t, function() {
				r.next().then(function(e) {
					e.done ? n.complete() : n.next(e.value);
				});
			}, 0, !0);
		});
	});
}
function ut(e, t) {
	return lt(qe(e), t);
}
function dt(e, t) {
	if (e != null) {
		if (Ve(e)) return at(e, t);
		if (ze(e)) return st(e, t);
		if (Be(e)) return ot(e, t);
		if (He(e)) return lt(e, t);
		if (Ke(e)) return ct(e, t);
		if (Je(e)) return ut(e, t);
	}
	throw Ue(e);
}
function D(e, t) {
	return t ? dt(e, t) : E(e);
}
function ft() {
	var e = [...arguments];
	return D(e, Le(e));
}
var pt = d(function(e) {
	return function() {
		e(this), this.name = "EmptyError", this.message = "no elements in sequence";
	};
});
function O(e, t) {
	var n = typeof t == "object";
	return new Promise(function(r, i) {
		var a = new de({
			next: function(e) {
				r(e), a.unsubscribe();
			},
			error: i,
			complete: function() {
				n ? r(t.defaultValue) : i(new pt());
			}
		});
		e.subscribe(a);
	});
}
function mt(e) {
	return e instanceof Date && !isNaN(e);
}
function k(e, t) {
	return w(function(n, r) {
		var i = 0;
		n.subscribe(T(r, function(n) {
			r.next(e.call(t, n, i++));
		}));
	});
}
var ht = Array.isArray;
function gt(e, t) {
	return ht(t) ? e.apply(void 0, o([], a(t))) : e(t);
}
function _t(e) {
	return k(function(t) {
		return gt(e, t);
	});
}
Array.isArray;
function vt(e, t, n, r, i, a, o, s) {
	var c = [], l = 0, u = 0, d = !1, f = function() {
		d && !c.length && !l && t.complete();
	}, p = function(e) {
		return l < r ? m(e) : c.push(e);
	}, m = function(e) {
		a && t.next(e), l++;
		var s = !1;
		E(n(e, u++)).subscribe(T(t, function(e) {
			i?.(e), a ? p(e) : t.next(e);
		}, function() {
			s = !0;
		}, void 0, function() {
			if (s) try {
				l--;
				for (var e = function() {
					var e = c.shift();
					o ? nt(t, o, function() {
						return m(e);
					}) : m(e);
				}; c.length && l < r;) e();
				f();
			} catch (e) {
				t.error(e);
			}
		}));
	};
	return e.subscribe(T(t, p, function() {
		d = !0, f();
	})), function() {
		s?.();
	};
}
function A(e, t, n) {
	return n === void 0 && (n = Infinity), u(t) ? A(function(n, r) {
		return k(function(e, i) {
			return t(n, e, r, i);
		})(E(e(n, r)));
	}, n) : (typeof t == "number" && (n = t), w(function(t, r) {
		return vt(t, r, e, n);
	}));
}
function yt(e) {
	return e === void 0 && (e = Infinity), A(ge, e);
}
function bt() {
	return yt(1);
}
function xt() {
	var e = [...arguments];
	return bt()(D(e, Le(e)));
}
function St(e) {
	return new C(function(t) {
		E(e()).subscribe(t);
	});
}
var Ct = ["addListener", "removeListener"], wt = ["addEventListener", "removeEventListener"], Tt = ["on", "off"];
function Et(e, t, n, r) {
	if (u(n) && (r = n, n = void 0), r) return Et(e, t, n).pipe(_t(r));
	var i = a(At(e) ? wt.map(function(r) {
		return function(i) {
			return e[r](t, i, n);
		};
	}) : Ot(e) ? Ct.map(Dt(e, t)) : kt(e) ? Tt.map(Dt(e, t)) : [], 2), o = i[0], s = i[1];
	if (!o && ze(e)) return A(function(e) {
		return Et(e, t, n);
	})(E(e));
	if (!o) throw TypeError("Invalid event target");
	return new C(function(e) {
		var t = function() {
			var t = [...arguments];
			return e.next(1 < t.length ? t : t[0]);
		};
		return o(t), function() {
			return s(t);
		};
	});
}
function Dt(e, t) {
	return function(n) {
		return function(r) {
			return e[n](t, r);
		};
	};
}
function Ot(e) {
	return u(e.addListener) && u(e.removeListener);
}
function kt(e) {
	return u(e.on) && u(e.off);
}
function At(e) {
	return u(e.addEventListener) && u(e.removeEventListener);
}
function jt(e, t, n) {
	e === void 0 && (e = 0), n === void 0 && (n = Ne);
	var r = -1;
	return t != null && (Fe(t) ? n = t : r = t), new C(function(t) {
		var i = mt(e) ? +e - n.now() : e;
		i < 0 && (i = 0);
		var a = 0;
		return n.schedule(function() {
			t.closed || (t.next(a++), 0 <= r ? this.schedule(void 0, r) : t.complete());
		}, i);
	});
}
function Mt() {
	var e = [...arguments], t = Le(e), n = Re(e, Infinity), r = e;
	return r.length ? r.length === 1 ? E(r[0]) : yt(n)(D(r, t)) : Pe;
}
var Nt = new C(y), Pt = Array.isArray;
function Ft(e) {
	return e.length === 1 && Pt(e[0]) ? e[0] : e;
}
function It(e, t) {
	return w(function(n, r) {
		var i = 0;
		n.subscribe(T(r, function(n) {
			return e.call(t, n, i++) && r.next(n);
		}));
	});
}
function Lt() {
	var e = [...arguments];
	return e = Ft(e), e.length === 1 ? E(e[0]) : new C(Rt(e));
}
function Rt(e) {
	return function(t) {
		for (var n = [], r = function(r) {
			n.push(E(e[r]).subscribe(T(t, function(e) {
				if (n) {
					for (var i = 0; i < n.length; i++) i !== r && n[i].unsubscribe();
					n = null;
				}
				t.next(e);
			})));
		}, i = 0; n && !t.closed && i < e.length; i++) r(i);
	};
}
function zt(e) {
	return w(function(t, n) {
		var r = null, i = !1, a;
		r = t.subscribe(T(n, void 0, void 0, function(o) {
			a = E(e(o, zt(e)(t))), r ? (r.unsubscribe(), r = null, a.subscribe(n)) : i = !0;
		})), i && (r.unsubscribe(), r = null, a.subscribe(n));
	});
}
function Bt(e) {
	return w(function(t, n) {
		var r = !1;
		t.subscribe(T(n, function(e) {
			r = !0, n.next(e);
		}, function() {
			r || n.next(e), n.complete();
		}));
	});
}
function Vt(e) {
	return e <= 0 ? function() {
		return Pe;
	} : w(function(t, n) {
		var r = 0;
		t.subscribe(T(n, function(t) {
			++r <= e && (n.next(t), e <= r && n.complete());
		}));
	});
}
function Ht() {
	return w(function(e, t) {
		e.subscribe(T(t, y));
	});
}
function Ut(e, t) {
	return t === void 0 && (t = ge), e ??= Wt, w(function(n, r) {
		var i, a = !0;
		n.subscribe(T(r, function(n) {
			var o = t(n);
			(a || !e(i, o)) && (a = !1, i = o, r.next(n));
		}));
	});
}
function Wt(e, t) {
	return e === t;
}
function Gt(e) {
	return e === void 0 && (e = Kt), w(function(t, n) {
		var r = !1;
		t.subscribe(T(n, function(e) {
			r = !0, n.next(e);
		}, function() {
			return r ? n.complete() : n.error(e());
		}));
	});
}
function Kt() {
	return new pt();
}
function qt(e, t) {
	var n = arguments.length >= 2;
	return function(r) {
		return r.pipe(e ? It(function(t, n) {
			return e(t, n, r);
		}) : ge, Vt(1), n ? Bt(t) : Gt(function() {
			return new pt();
		}));
	};
}
function Jt(e, t, n) {
	return n === void 0 && (n = Infinity), w(function(r, i) {
		var a = t;
		return vt(r, i, function(t, n) {
			return e(a, t, n);
		}, n, function(e) {
			a = e;
		}, !1, void 0, function() {
			return a = null;
		});
	});
}
function Yt() {
	var e = [...arguments];
	return e.length ? w(function(t, n) {
		Rt(o([t], a(e)))(n);
	}) : ge;
}
function Xt(e) {
	e === void 0 && (e = Infinity);
	var t = e && typeof e == "object" ? e : { count: e }, n = t.count, r = n === void 0 ? Infinity : n, i = t.delay, a = t.resetOnSuccess, o = a !== void 0 && a;
	return r <= 0 ? ge : w(function(e, t) {
		var n = 0, a, s = function() {
			var c = !1;
			a = e.subscribe(T(t, function(e) {
				o && (n = 0), t.next(e);
			}, void 0, function(e) {
				if (n++ < r) {
					var o = function() {
						a ? (a.unsubscribe(), a = null, s()) : c = !0;
					};
					if (i != null) {
						var l = typeof i == "number" ? jt(i) : E(i(e, n)), u = T(t, function() {
							u.unsubscribe(), o();
						}, function() {
							t.complete();
						});
						l.subscribe(u);
					} else o();
				} else t.error(e);
			})), c && (a.unsubscribe(), a = null, s());
		};
		s();
	});
}
function Zt() {
	var e = [...arguments], t = Le(e);
	return w(function(n, r) {
		(t ? xt(e, n, t) : xt(e, n)).subscribe(r);
	});
}
function Qt(e, t) {
	return w(function(n, r) {
		var i = null, a = 0, o = !1, s = function() {
			return o && !i && r.complete();
		};
		n.subscribe(T(r, function(n) {
			i?.unsubscribe();
			var o = 0, c = a++;
			E(e(n, c)).subscribe(i = T(r, function(e) {
				return r.next(t ? t(n, e, c, o++) : e);
			}, function() {
				i = null, s();
			}));
		}, function() {
			o = !0, s();
		}));
	});
}
function $t(e) {
	return w(function(t, n) {
		E(e).subscribe(T(n, function() {
			return n.complete();
		}, y)), !n.closed && t.subscribe(n);
	});
}
function en(e, t, n) {
	var r = u(e) || t || n ? {
		next: e,
		error: t,
		complete: n
	} : e;
	return r ? w(function(e, t) {
		var n;
		(n = r.subscribe) == null || n.call(r);
		var i = !0;
		e.subscribe(T(t, function(e) {
			var n;
			(n = r.next) == null || n.call(r, e), t.next(e);
		}, function() {
			var e;
			i = !1, (e = r.complete) == null || e.call(r), t.complete();
		}, function(e) {
			var n;
			i = !1, (n = r.error) == null || n.call(r, e), t.error(e);
		}, function() {
			var e, t;
			i && ((e = r.unsubscribe) == null || e.call(r)), (t = r.finalize) == null || t.call(r);
		}));
	}) : ge;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/third_party/mitt/mitt.js
function tn(e) {
	return {
		all: e ||= /* @__PURE__ */ new Map(),
		on: function(t, n) {
			var r = e.get(t);
			r ? r.push(n) : e.set(t, [n]);
		},
		off: function(t, n) {
			var r = e.get(t);
			r && (n ? r.splice(r.indexOf(n) >>> 0, 1) : e.set(t, []));
		},
		emit: function(t, n) {
			var r = e.get(t);
			r && r.slice().map(function(e) {
				e(n);
			}), (r = e.get("*")) && r.slice().map(function(e) {
				e(t, n);
			});
		}
	};
}
Symbol.dispose ??= Symbol("dispose"), Symbol.asyncDispose ??= Symbol("asyncDispose");
var j = Symbol.dispose, M = Symbol.asyncDispose, nn = class e {
	#e = !1;
	#t = [];
	get disposed() {
		return this.#e;
	}
	dispose() {
		this[j]();
	}
	use(e) {
		return e && typeof e[j] == "function" && this.#t.push(e), e;
	}
	adopt(e, t) {
		return this.#t.push({ [j]() {
			t(e);
		} }), e;
	}
	defer(e) {
		this.#t.push({ [j]() {
			e();
		} });
	}
	move() {
		if (this.#e) throw ReferenceError("A disposed stack can not use anything new");
		let t = new e();
		return t.#t = this.#t, this.#t = [], this.#e = !0, t;
	}
	[j]() {
		if (this.#e) return;
		this.#e = !0;
		let e = [];
		for (let t of this.#t.reverse()) try {
			t[j]();
		} catch (t) {
			e.push(t);
		}
		if (e.length === 1) throw e[0];
		if (e.length > 1) {
			let t = null;
			for (let n of e) t = t === null ? n : new sn(n, t);
			throw t;
		}
	}
	[Symbol.toStringTag] = "DisposableStack";
}, rn = globalThis.DisposableStack ?? nn, an = class e {
	#e = !1;
	#t = [];
	get disposed() {
		return this.#e;
	}
	async disposeAsync() {
		await this[M]();
	}
	use(e) {
		if (e) {
			let t = e[M], n = e[j];
			typeof t == "function" ? this.#t.push(e) : typeof n == "function" && this.#t.push({ [M]: async () => {
				e[j]();
			} });
		}
		return e;
	}
	adopt(e, t) {
		return this.#t.push({ [M]() {
			return t(e);
		} }), e;
	}
	defer(e) {
		this.#t.push({ [M]() {
			return e();
		} });
	}
	move() {
		if (this.#e) throw ReferenceError("A disposed stack can not use anything new");
		let t = new e();
		return t.#t = this.#t, this.#t = [], this.#e = !0, t;
	}
	async [M]() {
		if (this.#e) return;
		this.#e = !0;
		let e = [];
		for (let t of this.#t.reverse()) try {
			await t[M]();
		} catch (t) {
			e.push(t);
		}
		if (e.length === 1) throw e[0];
		if (e.length > 1) {
			let t = null;
			for (let n of e) t = t === null ? n : new sn(n, t);
			throw t;
		}
	}
	[Symbol.toStringTag] = "AsyncDisposableStack";
}, on = globalThis.AsyncDisposableStack ?? an, sn = class extends Error {
	#e;
	#t;
	constructor(e, t, n = "An error was suppressed during disposal") {
		super(n), this.name = "SuppressedError", this.#e = e, this.#t = t;
	}
	get error() {
		return this.#e;
	}
	get suppressed() {
		return this.#t;
	}
};
globalThis.SuppressedError;
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/environment.js
var cn = !!(typeof process < "u" && process.version), ln = { value: {
	get fs() {
		throw Error("fs is not available in this environment");
	},
	get ScreenRecorder() {
		throw Error("ScreenRecorder is not available in this environment");
	}
} }, N = (e, t) => {
	if (!e) throw Error(t);
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/util/encoding.js
function un(e, t = !1) {
	return t ? "fromBase64" in Uint8Array ? Uint8Array.fromBase64(e) : typeof Buffer == "function" ? Buffer.from(e, "base64") : Uint8Array.from(atob(e), (e) => e.codePointAt(0)) : new TextEncoder().encode(e);
}
function dn(e) {
	return fn(new TextEncoder().encode(e));
}
function fn(e) {
	let t = 65534, n = [];
	for (let r = 0; r < e.length; r += t) {
		let i = e.subarray(r, r + t);
		n.push(String.fromCodePoint.apply(null, i));
	}
	let r = n.join("");
	return btoa(r);
}
function pn(e) {
	let t = 0;
	for (let n of e) t += n.length;
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.length;
	return n;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/util/version.js
var mn = "25.1.0", hn = null;
async function gn() {
	return hn ||= (await import("./_dsh-devtools_empty-BvRk9kiK.js")).debuglog, hn;
}
var _n = (e) => cn ? async (...t) => {
	yn && vn.push(e + t), (await gn())(e)(...t);
} : (...t) => {
	let n = globalThis.__PUPPETEER_DEBUG;
	n && (n === "*" || (n.endsWith("*") ? e.startsWith(n) : e === n)) && console.log(`${e}:`, ...t);
}, vn = [], yn = !1, bn = class extends Error {
	constructor(e, t) {
		super(e, t), this.name = this.constructor.name;
	}
	get [Symbol.toStringTag]() {
		return this.constructor.name;
	}
}, xn = class extends bn {}, Sn = class extends bn {}, Cn = class extends bn {
	#e;
	#t = "";
	set code(e) {
		this.#e = e;
	}
	get code() {
		return this.#e;
	}
	set originalMessage(e) {
		this.#t = e;
	}
	get originalMessage() {
		return this.#t;
	}
}, wn = class extends bn {}, Tn = class extends Cn {}, En = class extends Cn {}, Dn = {
	letter: {
		cm: {
			width: 21.59,
			height: 27.94
		},
		in: {
			width: 8.5,
			height: 11
		}
	},
	legal: {
		cm: {
			width: 21.59,
			height: 35.56
		},
		in: {
			width: 8.5,
			height: 14
		}
	},
	tabloid: {
		cm: {
			width: 27.94,
			height: 43.18
		},
		in: {
			width: 11,
			height: 17
		}
	},
	ledger: {
		cm: {
			width: 43.18,
			height: 27.94
		},
		in: {
			width: 17,
			height: 11
		}
	},
	a0: {
		cm: {
			width: 84.1,
			height: 118.9
		},
		in: {
			width: 33.1102,
			height: 46.811
		}
	},
	a1: {
		cm: {
			width: 59.4,
			height: 84.1
		},
		in: {
			width: 23.3858,
			height: 33.1102
		}
	},
	a2: {
		cm: {
			width: 42,
			height: 59.4
		},
		in: {
			width: 16.5354,
			height: 23.3858
		}
	},
	a3: {
		cm: {
			width: 29.7,
			height: 42
		},
		in: {
			width: 11.6929,
			height: 16.5354
		}
	},
	a4: {
		cm: {
			width: 21,
			height: 29.7
		},
		in: {
			width: 8.2677,
			height: 11.6929
		}
	},
	a5: {
		cm: {
			width: 14.8,
			height: 21
		},
		in: {
			width: 5.8268,
			height: 8.2677
		}
	},
	a6: {
		cm: {
			width: 10.5,
			height: 14.8
		},
		in: {
			width: 4.1339,
			height: 5.8268
		}
	}
}, P = _n("puppeteer:error");
Object.freeze({
	width: 800,
	height: 600
});
var On = Symbol("Source URL for Puppeteer evaluation scripts"), kn = class e {
	static INTERNAL_URL = "pptr:internal";
	static fromCallSite(t, n) {
		let r = new e();
		return r.#e = t, r.#t = n.toString(), r;
	}
	static parse = (t) => {
		t = t.slice(5);
		let [n = "", r = ""] = t.split(";"), i = new e();
		return i.#e = n, i.#t = decodeURIComponent(r), i;
	};
	static isPuppeteerURL = (e) => e.startsWith("pptr:");
	#e;
	#t;
	get functionName() {
		return this.#e;
	}
	get siteString() {
		return this.#t;
	}
	toString() {
		return `pptr:${[this.#e, encodeURIComponent(this.#t)].join(";")}`;
	}
}, F = (e, t) => {
	if (Object.prototype.hasOwnProperty.call(t, On)) return t;
	let n = Error.prepareStackTrace;
	Error.prepareStackTrace = (e, t) => t[2];
	let r = (/* @__PURE__ */ Error()).stack;
	return Error.prepareStackTrace = n, Object.assign(t, { [On]: kn.fromCallSite(e, r) });
}, An = (e) => {
	if (Object.prototype.hasOwnProperty.call(e, On)) return e[On];
}, jn = (e) => typeof e == "string" || e instanceof String, Mn = (e) => typeof e == "number" || e instanceof Number;
function Nn(e, ...t) {
	if (jn(e)) return N(t.length === 0, "Cannot evaluate a string with arguments"), e;
	function n(e) {
		return Object.is(e, void 0) ? "undefined" : JSON.stringify(e);
	}
	return `(${e})(${t.map(n).join(",")})`;
}
async function Pn(e, t) {
	let n = [], r = e.getReader();
	if (t) {
		let e = await ln.value.fs.promises.open(t, "w+");
		try {
			for (;;) {
				let { done: t, value: i } = await r.read();
				if (t) break;
				n.push(i), await e.writeFile(i);
			}
		} finally {
			await e.close();
		}
	} else for (;;) {
		let { done: e, value: t } = await r.read();
		if (e) break;
		n.push(t);
	}
	try {
		let e = pn(n);
		return e.length === 0 ? null : e;
	} catch (e) {
		return P(e), null;
	}
}
async function Fn(e, t) {
	return new ReadableStream({ async pull(n) {
		let { data: r, base64Encoded: i, eof: a } = await e.send("IO.read", { handle: t });
		n.enqueue(un(r, i ?? !1)), a && (await e.send("IO.close", { handle: t }), n.close());
	} });
}
var In = /* @__PURE__ */ new Set([
	"alert",
	"confirm",
	"prompt",
	"beforeunload"
]);
function Ln(e) {
	let t = null;
	return In.has(e) && (t = e), N(t, `Unknown javascript dialog type: ${e}`), t;
}
function Rn(e, t) {
	return e === 0 ? Nt : jt(e).pipe(k(() => {
		throw new xn(`Timed out after waiting ${e}ms`, { cause: t });
	}));
}
var zn = "__puppeteer_utility_world__" + mn, Bn = /^[\x20\t]*\/\/[@#] sourceURL=\s{0,10}(\S*?)\s{0,10}$/m;
function Vn(e) {
	return `//# sourceURL=${e}`;
}
function Hn(e = {}, t = "in") {
	let n = {
		scale: 1,
		displayHeaderFooter: !1,
		headerTemplate: "",
		footerTemplate: "",
		printBackground: !1,
		landscape: !1,
		pageRanges: "",
		preferCSSPageSize: !1,
		omitBackground: !1,
		outline: !1,
		tagged: !0,
		waitForFonts: !0
	}, r = 8.5, i = 11;
	if (e.format) {
		let n = Dn[e.format.toLowerCase()][t];
		N(n, "Unknown paper format: " + e.format), r = n.width, i = n.height;
	} else r = Wn(e.width, t) ?? r, i = Wn(e.height, t) ?? i;
	let a = {
		top: Wn(e.margin?.top, t) || 0,
		left: Wn(e.margin?.left, t) || 0,
		bottom: Wn(e.margin?.bottom, t) || 0,
		right: Wn(e.margin?.right, t) || 0
	};
	return e.outline && (e.tagged = !0), {
		...n,
		...e,
		width: r,
		height: i,
		margin: a
	};
}
var Un = {
	px: 1,
	in: 96,
	cm: 37.8,
	mm: 3.78
};
function Wn(e, t = "in") {
	if (e === void 0) return;
	let n;
	if (Mn(e)) n = e;
	else if (jn(e)) {
		let t = e, r = t.substring(t.length - 2).toLowerCase(), i = "";
		r in Un ? i = t.substring(0, t.length - 2) : (r = "px", i = t);
		let a = Number(i);
		N(!isNaN(a), "Failed to parse parameter value: " + t), n = a * Un[r];
	} else throw Error("page.pdf() Cannot handle parameter type: " + typeof e);
	return n / Un[t];
}
function I(e, t) {
	return new C((n) => {
		let r = (e) => {
			n.next(e);
		};
		return e.on(t, r), () => {
			e.off(t, r);
		};
	});
}
function Gn(e, t) {
	return e ? Et(e, "abort").pipe(k(() => {
		throw e.reason instanceof Error ? (e.reason.cause = t, e.reason) : Error(e.reason, { cause: t });
	})) : Nt;
}
function Kn(e) {
	return A((t) => D(Promise.resolve(e(t))).pipe(It((e) => e), k(() => t)));
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/common/EventEmitter.js
var L = class {
	#e;
	#t = /* @__PURE__ */ new Map();
	constructor(e = tn(/* @__PURE__ */ new Map())) {
		this.#e = e;
	}
	on(e, t) {
		let n = this.#t.get(e);
		return n === void 0 ? this.#t.set(e, [t]) : n.push(t), this.#e.on(e, t), this;
	}
	off(e, t) {
		let n = this.#t.get(e) ?? [];
		if (t === void 0) {
			for (let t of n) this.#e.off(e, t);
			return this.#t.delete(e), this;
		}
		let r = n.lastIndexOf(t);
		return r > -1 && this.#e.off(e, ...n.splice(r, 1)), this;
	}
	emit(e, t) {
		return this.#e.emit(e, t), this.listenerCount(e) > 0;
	}
	once(e, t) {
		let n = (r) => {
			t(r), this.off(e, n);
		};
		return this.on(e, n);
	}
	listenerCount(e) {
		return this.#t.get(e)?.length || 0;
	}
	removeAllListeners(e) {
		return e === void 0 ? (this[j](), this) : this.off(e);
	}
	[j]() {
		this[M]().catch(P);
	}
	async [M]() {
		for (let [e, t] of this.#t) for (let n of t) this.#e.off(e, n);
		this.#t.clear();
	}
}, qn = /* @__PURE__ */ new Map([
	["accelerometer", "sensors"],
	["ambient-light-sensor", "sensors"],
	["background-sync", "backgroundSync"],
	["camera", "videoCapture"],
	["clipboard-read", "clipboardReadWrite"],
	["clipboard-sanitized-write", "clipboardSanitizedWrite"],
	["clipboard-write", "clipboardReadWrite"],
	["geolocation", "geolocation"],
	["gyroscope", "sensors"],
	["idle-detection", "idleDetection"],
	["keyboard-lock", "keyboardLock"],
	["magnetometer", "sensors"],
	["microphone", "audioCapture"],
	["midi", "midi"],
	["notifications", "notifications"],
	["payment-handler", "paymentHandler"],
	["persistent-storage", "durableStorage"],
	["pointer-lock", "pointerLock"],
	["midi-sysex", "midiSysex"]
]), Jn = class extends L {
	constructor() {
		super();
	}
	async waitForTarget(e, t = {}) {
		let { timeout: n = 3e4, signal: r } = t;
		return await O(Mt(I(this, "targetcreated"), I(this, "targetchanged"), D(this.targets())).pipe(Kn(e), Yt(Gn(r), Rn(n))));
	}
	async pages(e = !1) {
		return (await Promise.all(this.browserContexts().map((t) => t.pages(e)))).reduce((e, t) => e.concat(t), []);
	}
	async cookies() {
		return await this.defaultBrowserContext().cookies();
	}
	async setCookie(...e) {
		return await this.defaultBrowserContext().setCookie(...e);
	}
	async deleteCookie(...e) {
		return await this.defaultBrowserContext().deleteCookie(...e);
	}
	async deleteMatchingCookies(...e) {
		return await this.defaultBrowserContext().deleteMatchingCookies(...e);
	}
	async setPermission(e, ...t) {
		return await this.defaultBrowserContext().setPermission(e, ...t);
	}
	[j]() {
		this[M]().catch(P);
	}
	async [M]() {
		this.process() ? await this.close() : await this.disconnect(), await super[M]();
	}
}, R;
(function(e) {
	e.Disconnected = Symbol("CDPSession.Disconnected"), e.Swapped = Symbol("CDPSession.Swapped"), e.Ready = Symbol("CDPSession.Ready"), e.SessionAttached = "sessionattached", e.SessionDetached = "sessiondetached";
})(R ||= {});
var Yn = class extends L {
	constructor() {
		super();
	}
	parentSession() {}
}, z = class e {
	static create(t) {
		return new e(t);
	}
	static async race(t) {
		let n = /* @__PURE__ */ new Set();
		try {
			let r = t.map((t) => t instanceof e ? (t.#a && n.add(t), t.valueOrThrow()) : t);
			return await Promise.race(r);
		} finally {
			for (let e of n) e.reject(/* @__PURE__ */ Error("Timeout cleared"));
		}
	}
	#e = !1;
	#t = !1;
	#n;
	#r;
	#i = new Promise((e) => {
		this.#r = e;
	});
	#a;
	#o;
	constructor(e) {
		e && e.timeout > 0 && (this.#o = new xn(e.message), this.#a = setTimeout(() => {
			this.reject(this.#o);
		}, e.timeout));
	}
	#s(e) {
		clearTimeout(this.#a), this.#n = e, this.#r();
	}
	resolve(e) {
		this.#t || this.#e || (this.#e = !0, this.#s(e));
	}
	reject(e) {
		this.#t || this.#e || (this.#t = !0, this.#s(e));
	}
	resolved() {
		return this.#e;
	}
	finished() {
		return this.#e || this.#t;
	}
	value() {
		return this.#n;
	}
	#c;
	valueOrThrow() {
		return this.#c ||= (async () => {
			if (await this.#i, this.#t) throw this.#n;
			return this.#n;
		})(), this.#c;
	}
}, Xn = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	[j]() {
		return this.#t?.(), this.#e.release();
	}
}, Zn = class e {
	static Guard = Xn;
	#e = !1;
	#t = [];
	async acquire(t) {
		if (!this.#e) return this.#e = !0, new e.Guard(this, t);
		let n = z.create();
		return this.#t.push(n.resolve.bind(n)), await n.valueOrThrow(), new e.Guard(this, t);
	}
	release() {
		let e = this.#t.shift();
		if (!e) {
			this.#e = !1;
			return;
		}
		e();
	}
}, Qn = class extends L {
	constructor() {
		super();
	}
	#e;
	#t = 0;
	startScreenshot() {
		let e = this.#e || new Zn();
		return this.#e = e, this.#t++, e.acquire(() => {
			this.#t--, this.#t === 0 && (this.#e = void 0);
		});
	}
	waitForScreenshotOperations() {
		return this.#e?.acquire();
	}
	async waitForTarget(e, t = {}) {
		let { timeout: n = 3e4 } = t;
		return await O(Mt(I(this, "targetcreated"), I(this, "targetchanged"), D(this.targets())).pipe(Kn(e), Yt(Rn(n))));
	}
	async deleteCookie(...e) {
		return await this.setCookie(...e.map((e) => ({
			...e,
			expires: 1
		})));
	}
	async deleteMatchingCookies(...e) {
		let t = (await this.cookies()).filter((t) => e.some((e) => {
			if (e.name === t.name) {
				if (e.domain !== void 0 && e.domain === t.domain || e.path !== void 0 && e.path === t.path) return !0;
				if (e.partitionKey !== void 0 && t.partitionKey !== void 0) {
					if (typeof t.partitionKey != "object") throw Error("Unexpected string partition key");
					if (typeof e.partitionKey == "string") {
						if (e.partitionKey === t.partitionKey?.sourceOrigin) return !0;
					} else if (e.partitionKey.sourceOrigin === t.partitionKey?.sourceOrigin) return !0;
				}
				if (e.url !== void 0) {
					let n = new URL(e.url);
					if (n.hostname === t.domain && n.pathname === t.path) return !0;
				}
				return !0;
			}
			return !1;
		}));
		await this.deleteCookie(...t);
	}
	get closed() {
		return !this.browser().browserContexts().includes(this);
	}
	get id() {}
	[j]() {
		this[M]().catch(P);
	}
	async [M]() {
		await this.close(), await super[M]();
	}
}, $n = 3e4, er = class {
	#e;
	#t;
	constructor() {
		this.#e = null, this.#t = null;
	}
	setDefaultTimeout(e) {
		this.#e = e;
	}
	setDefaultNavigationTimeout(e) {
		this.#t = e;
	}
	navigationTimeout() {
		return this.#t === null ? this.#e === null ? $n : this.#e : this.#t;
	}
	timeout() {
		return this.#e === null ? $n : this.#e;
	}
}, tr = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, nr = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
}), rr = /* @__PURE__ */ new WeakSet();
function ir(e, t) {
	let n = !1;
	if (e.prototype[j]) {
		let t = e.prototype[j];
		e.prototype[j] = function() {
			if (rr.has(this)) {
				rr.delete(this);
				return;
			}
			return t.call(this);
		}, n = !0;
	}
	if (e.prototype[M]) {
		let t = e.prototype[M];
		e.prototype[M] = function() {
			if (rr.has(this)) {
				rr.delete(this);
				return;
			}
			return t.call(this);
		}, n = !0;
	}
	return n && (e.prototype.move = function() {
		return rr.add(this), this;
	}), e;
}
function B(e = (e) => `Attempted to use disposed ${e.constructor.name}.`) {
	return (t, n) => function(...n) {
		if (this.disposed) throw Error(e(this));
		return t.call(this, ...n);
	};
}
function V(e, t) {
	let n = /* @__PURE__ */ new WeakMap(), r = -1;
	return function(...t) {
		if (r === -1 && (r = t.length), r !== t.length) throw Error("Memoized method was called with the wrong number of arguments");
		let i = !1, a = n;
		for (let e of t) a.has(e) ? a = a.get(e) : (i = !0, a.set(e, /* @__PURE__ */ new WeakMap()), a = a.get(e));
		if (i) return e.call(this, ...t);
	};
}
function ar(e = function() {
	return this;
}) {
	return (t, n) => {
		let r = /* @__PURE__ */ new WeakMap();
		return async function(...n) {
			let i = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				let a = e.call(this), o = r.get(a);
				return o || (o = new Zn(), r.set(a, o)), tr(i, await o.acquire(), !0), await t.call(this, ...n);
			} catch (e) {
				i.error = e, i.hasError = !0;
			} finally {
				let e = nr(i);
				e && await e;
			}
		};
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/api/locators/locators.js
var or = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, sr = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
}), cr;
(function(e) {
	e.Action = "action";
})(cr ||= {});
var lr = class extends L {
	static race(e) {
		return gr.create(e);
	}
	visibility = null;
	_timeout = 3e4;
	#e = !0;
	#t = !0;
	#n = !0;
	operators = {
		conditions: (e, t) => A((n) => Mt(...e.map((e) => e(n, t))).pipe(Bt(n))),
		retryAndRaceWithSignalAndTimer: (e, t) => {
			let n = [];
			return e && n.push(Gn(e, t)), n.push(Rn(this._timeout, t)), _e(Xt({ delay: 100 }), Yt(...n));
		}
	};
	get timeout() {
		return this._timeout;
	}
	setTimeout(e) {
		let t = this._clone();
		return t._timeout = e, t;
	}
	setVisibility(e) {
		let t = this._clone();
		return t.visibility = e, t;
	}
	setWaitForEnabled(e) {
		let t = this._clone();
		return t.#t = e, t;
	}
	setEnsureElementIsInTheViewport(e) {
		let t = this._clone();
		return t.#e = e, t;
	}
	setWaitForStableBoundingBox(e) {
		let t = this._clone();
		return t.#n = e, t;
	}
	copyOptions(e) {
		return this._timeout = e._timeout, this.visibility = e.visibility, this.#t = e.#t, this.#e = e.#e, this.#n = e.#n, this;
	}
	#r = (e, t) => this.#t ? D(e.frame.waitForFunction((e) => e instanceof HTMLElement ? ![
		"BUTTON",
		"INPUT",
		"SELECT",
		"TEXTAREA",
		"OPTION",
		"OPTGROUP"
	].includes(e.nodeName) || !e.hasAttribute("disabled") : !0, {
		timeout: this._timeout,
		signal: t
	}, e)).pipe(Ht()) : Pe;
	#i = (e) => this.#n ? St(() => D(e.evaluate((e) => new Promise((t) => {
		window.requestAnimationFrame(() => {
			let n = e.getBoundingClientRect();
			window.requestAnimationFrame(() => {
				let r = e.getBoundingClientRect();
				t([{
					x: n.x,
					y: n.y,
					width: n.width,
					height: n.height
				}, {
					x: r.x,
					y: r.y,
					width: r.width,
					height: r.height
				}]);
			});
		});
	})))).pipe(qt(([e, t]) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height), Xt({ delay: 100 }), Ht()) : Pe;
	#a = (e) => this.#e ? D(e.isIntersectingViewport({ threshold: 0 })).pipe(It((e) => !e), A(() => D(e.scrollIntoView())), A(() => St(() => D(e.isIntersectingViewport({ threshold: 0 }))).pipe(qt(ge), Xt({ delay: 100 }), Ht()))) : Pe;
	#o(e) {
		let t = e?.signal, n = /* @__PURE__ */ Error("Locator.click");
		return this._wait(e).pipe(this.operators.conditions([
			this.#a,
			this.#i,
			this.#r
		], t), en(() => this.emit(cr.Action, void 0)), A((t) => D(t.click(e)).pipe(zt((e) => {
			throw t.dispose().catch(P), e;
		}))), this.operators.retryAndRaceWithSignalAndTimer(t, n));
	}
	#s(e, t) {
		let n = t?.signal, r = t?.typingThreshold ?? 100, i = /* @__PURE__ */ Error("Locator.fill");
		return this._wait(t).pipe(this.operators.conditions([
			this.#a,
			this.#i,
			this.#r
		], n), en(() => this.emit(cr.Action, void 0)), A((t) => D(t.evaluate((e) => {
			if (e instanceof HTMLSelectElement) return "select";
			if (e instanceof HTMLTextAreaElement) return "typeable-input";
			if (e instanceof HTMLInputElement) switch (e.type) {
				case "checkbox":
				case "radio": return "checkable-input";
				case "text":
				case "url":
				case "tel":
				case "search":
				case "password":
				case "number":
				case "email": return "typeable-input";
				default: return "other-input";
			}
			switch (e.getAttribute("role")) {
				case "checkbox":
				case "radio":
				case "switch": return "checkable-input";
			}
			return e.isContentEditable ? "contenteditable" : "unknown";
		})).pipe(A((n) => {
			let i = () => D(t.focus()).pipe(A(() => D(t.evaluate((e, t) => {
				let n = e, r = String(t);
				(n.isContentEditable ? n.innerText : n.value) !== r && (n.isContentEditable ? n.innerText = r : n.value = r, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}, e)))), a = () => D(t.evaluate((e) => e.indeterminate || e.getAttribute("aria-checked") === "mixed" ? "mixed" : e.checked || e.getAttribute("aria-checked") === "true")).pipe(A((n) => n === "mixed" || n !== !!e ? D(t.click()) : ft(void 0)));
			switch (n) {
				case "checkable-input": return a();
				case "select": return D(t.select(e).then(y));
				case "contenteditable":
				case "typeable-input": return typeof e == "string" && e.length < r ? D(t.evaluate((e, t) => {
					let n = e, r = String(t), i = n.isContentEditable ? n.innerText : e.value;
					return i === r ? "" : !r.startsWith(i) || !i ? (n.isContentEditable ? n.innerText = "" : e.value = "", r) : (n.isContentEditable ? (n.innerText = "", n.innerText = i) : (e.value = "", e.value = i), r.substring(i.length));
				}, e)).pipe(A((e) => e ? D(t.type(e)) : ft(void 0))) : i();
				case "other-input": return i();
				case "unknown": throw Error("Element cannot be filled out.");
			}
		})).pipe(zt((e) => {
			throw t.dispose().catch(P), e;
		}))), this.operators.retryAndRaceWithSignalAndTimer(n, i));
	}
	#c(e) {
		let t = e?.signal, n = /* @__PURE__ */ Error("Locator.hover");
		return this._wait(e).pipe(this.operators.conditions([this.#a, this.#i], t), en(() => this.emit(cr.Action, void 0)), A((e) => D(e.hover()).pipe(zt((t) => {
			throw e.dispose().catch(P), t;
		}))), this.operators.retryAndRaceWithSignalAndTimer(t, n));
	}
	#l(e) {
		let t = e?.signal, n = /* @__PURE__ */ Error("Locator.scroll");
		return this._wait(e).pipe(this.operators.conditions([this.#a, this.#i], t), en(() => this.emit(cr.Action, void 0)), A((t) => D(t.evaluate((e, t, n) => {
			t !== void 0 && (e.scrollTop = t), n !== void 0 && (e.scrollLeft = n);
		}, e?.scrollTop, e?.scrollLeft)).pipe(zt((e) => {
			throw t.dispose().catch(P), e;
		}))), this.operators.retryAndRaceWithSignalAndTimer(t, n));
	}
	clone() {
		return this._clone();
	}
	async waitHandle(e) {
		let t = /* @__PURE__ */ Error("Locator.waitHandle");
		return await O(this._wait(e).pipe(this.operators.retryAndRaceWithSignalAndTimer(e?.signal, t)));
	}
	async wait(e) {
		let t = {
			stack: [],
			error: void 0,
			hasError: !1
		};
		try {
			return await or(t, await this.waitHandle(e), !1).jsonValue();
		} catch (e) {
			t.error = e, t.hasError = !0;
		} finally {
			sr(t);
		}
	}
	map(e) {
		return new pr(this._clone(), (t) => t.evaluateHandle(e));
	}
	filter(e) {
		return new fr(this._clone(), async (t, n) => (await t.frame.waitForFunction(e, {
			signal: n,
			timeout: this._timeout
		}, t), !0));
	}
	filterHandle(e) {
		return new fr(this._clone(), e);
	}
	mapHandle(e) {
		return new pr(this._clone(), e);
	}
	click(e) {
		return O(this.#o(e));
	}
	fill(e, t) {
		return O(this.#s(e, t));
	}
	hover(e) {
		return O(this.#c(e));
	}
	scroll(e) {
		return O(this.#l(e));
	}
}, ur = class e extends lr {
	static create(t, n) {
		return new e(t, n).setTimeout("getDefaultTimeout" in t ? t.getDefaultTimeout() : t.page().getDefaultTimeout());
	}
	#e;
	#t;
	constructor(e, t) {
		super(), this.#e = e, this.#t = t;
	}
	_clone() {
		return new e(this.#e, this.#t);
	}
	_wait(e) {
		let t = e?.signal;
		return St(() => D(this.#e.waitForFunction(this.#t, {
			timeout: this.timeout,
			signal: t
		}))).pipe(Gt());
	}
}, dr = class extends lr {
	#e;
	constructor(e) {
		super(), this.#e = e, this.copyOptions(this.#e);
	}
	get delegate() {
		return this.#e;
	}
	setTimeout(e) {
		let t = super.setTimeout(e);
		return t.#e = this.#e.setTimeout(e), t;
	}
	setVisibility(e) {
		let t = super.setVisibility(e);
		return t.#e = t.#e.setVisibility(e), t;
	}
	setWaitForEnabled(e) {
		let t = super.setWaitForEnabled(e);
		return t.#e = this.#e.setWaitForEnabled(e), t;
	}
	setEnsureElementIsInTheViewport(e) {
		let t = super.setEnsureElementIsInTheViewport(e);
		return t.#e = this.#e.setEnsureElementIsInTheViewport(e), t;
	}
	setWaitForStableBoundingBox(e) {
		let t = super.setWaitForStableBoundingBox(e);
		return t.#e = this.#e.setWaitForStableBoundingBox(e), t;
	}
}, fr = class e extends dr {
	#e;
	constructor(e, t) {
		super(e), this.#e = t;
	}
	_clone() {
		return new e(this.delegate.clone(), this.#e).copyOptions(this);
	}
	_wait(e) {
		return this.delegate._wait(e).pipe(A((t) => D(Promise.resolve(this.#e(t, e?.signal))).pipe(It((e) => e), k(() => t))), Gt());
	}
}, pr = class e extends dr {
	#e;
	constructor(e, t) {
		super(e), this.#e = t;
	}
	_clone() {
		return new e(this.delegate.clone(), this.#e).copyOptions(this);
	}
	_wait(e) {
		return this.delegate._wait(e).pipe(A((t) => D(Promise.resolve(this.#e(t, e?.signal)))));
	}
}, mr = class e extends lr {
	static create(t, n) {
		return new e(t, n).setTimeout("getDefaultTimeout" in t ? t.getDefaultTimeout() : t.page().getDefaultTimeout());
	}
	static createFromHandle(t, n) {
		return new e(t, n).setTimeout("getDefaultTimeout" in t ? t.getDefaultTimeout() : t.page().getDefaultTimeout());
	}
	#e;
	#t;
	constructor(e, t) {
		super(), this.#e = e, this.#t = t;
	}
	#n = (e) => this.visibility ? (() => {
		switch (this.visibility) {
			case "hidden": return St(() => D(e.isHidden()));
			case "visible": return St(() => D(e.isVisible()));
		}
	})().pipe(qt(ge), Xt({ delay: 100 }), Ht()) : Pe;
	_clone() {
		return new e(this.#e, this.#t).copyOptions(this);
	}
	_wait(e) {
		let t = e?.signal;
		return St(() => typeof this.#t == "string" ? D(this.#e.waitForSelector(this.#t, {
			visible: !1,
			timeout: this._timeout,
			signal: t
		})) : ft(this.#t)).pipe(It((e) => e !== null), Gt(), this.operators.conditions([this.#n], t));
	}
};
function hr(e) {
	for (let t of e) if (!(t instanceof lr)) throw Error("Unknown locator for race candidate");
	return e;
}
var gr = class e extends lr {
	static create(t) {
		let n = hr(t);
		return new e(n);
	}
	#e;
	constructor(e) {
		super(), this.#e = e;
	}
	_clone() {
		return new e(this.#e.map((e) => e.clone())).copyOptions(this);
	}
	_wait(e) {
		return Lt(...this.#e.map((t) => t._wait(e)));
	}
}, _r = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, vr = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, yr = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, br = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
});
function xr(e) {
	e.optimizeForSpeed ??= !1, e.type ??= "png", e.fromSurface ??= !0, e.fullPage ??= !1, e.omitBackground ??= !1, e.encoding ??= "binary", e.captureBeyondViewport ??= !0;
}
var Sr = (() => {
	let e = L, t = [], n;
	return class extends e {
		static {
			let r = typeof Symbol == "function" && Symbol.metadata ? Object.create(e[Symbol.metadata] ?? null) : void 0;
			vr(this, null, n, {
				kind: "method",
				name: "screenshot",
				static: !1,
				private: !1,
				access: {
					has: (e) => "screenshot" in e,
					get: (e) => e.screenshot
				},
				metadata: r
			}, null, t), r && Object.defineProperty(this, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: r
			});
		}
		_isDragging = (_r(this, t), !1);
		_timeoutSettings = new er();
		_tabId = "";
		#e = /* @__PURE__ */ new WeakMap();
		#t = new Oe(1);
		constructor() {
			super(), I(this, "request").pipe(A((e) => xt(ft(1), Mt(I(this, "requestfailed"), I(this, "requestfinished"), I(this, "response").pipe(k((e) => e.request()))).pipe(It((t) => t.id === e.id), Vt(1), k(() => -1)))), Jt((e, t) => ft(e + t), 0), $t(I(this, "close")), Zt(0)).subscribe(this.#t);
		}
		on(e, t) {
			if (e !== "request") return super.on(e, t);
			let n = this.#e.get(t);
			return n === void 0 && (n = (e) => {
				e.enqueueInterceptAction(() => t(e));
			}, this.#e.set(t, n)), super.on(e, n);
		}
		off(e, t) {
			return e === "request" && (t = this.#e.get(t) || t), super.off(e, t);
		}
		get accessibility() {
			return this.mainFrame().accessibility;
		}
		locator(e) {
			return typeof e == "string" ? mr.create(this, e) : ur.create(this, e);
		}
		locatorRace(e) {
			return lr.race(e);
		}
		async $(e) {
			return await this.mainFrame().$(e);
		}
		async $$(e, t) {
			return await this.mainFrame().$$(e, t);
		}
		async evaluateHandle(e, ...t) {
			return e = F(this.evaluateHandle.name, e), await this.mainFrame().evaluateHandle(e, ...t);
		}
		async $eval(e, t, ...n) {
			return t = F(this.$eval.name, t), await this.mainFrame().$eval(e, t, ...n);
		}
		async $$eval(e, t, ...n) {
			return t = F(this.$$eval.name, t), await this.mainFrame().$$eval(e, t, ...n);
		}
		async addScriptTag(e) {
			return await this.mainFrame().addScriptTag(e);
		}
		async addStyleTag(e) {
			return await this.mainFrame().addStyleTag(e);
		}
		url() {
			return this.mainFrame().url();
		}
		async content() {
			return await this.mainFrame().content();
		}
		async setContent(e, t) {
			await this.mainFrame().setContent(e, t);
		}
		async goto(e, t) {
			return await this.mainFrame().goto(e, t);
		}
		async waitForNavigation(e = {}) {
			return await this.mainFrame().waitForNavigation(e);
		}
		waitForRequest(e, t = {}) {
			let { timeout: n = this._timeoutSettings.timeout(), signal: r } = t;
			if (typeof e == "string") {
				let t = e;
				e = (e) => e.url() === t;
			}
			return O(I(this, "request").pipe(Kn(e), Yt(Rn(n), Gn(r), I(this, "close").pipe(k(() => {
				throw new Tn("Page closed!");
			})))));
		}
		waitForResponse(e, t = {}) {
			let { timeout: n = this._timeoutSettings.timeout(), signal: r } = t;
			if (typeof e == "string") {
				let t = e;
				e = (e) => e.url() === t;
			}
			return O(I(this, "response").pipe(Kn(e), Yt(Rn(n), Gn(r), I(this, "close").pipe(k(() => {
				throw new Tn("Page closed!");
			})))));
		}
		waitForNetworkIdle(e = {}) {
			return O(this.waitForNetworkIdle$(e));
		}
		waitForNetworkIdle$(e = {}) {
			let { timeout: t = this._timeoutSettings.timeout(), idleTime: n = 500, concurrency: r = 0, signal: i } = e;
			return this.#t.pipe(k((e) => e > r), Ut(), Qt((e) => e ? Pe : jt(n)), k(() => {}), Yt(Rn(t), Gn(i), I(this, "close").pipe(k(() => {
				throw new Tn("Page closed!");
			}))));
		}
		async waitForFrame(e, t = {}) {
			let { timeout: n = this.getDefaultTimeout(), signal: r } = t, i = jn(e) ? (t) => e === t.url() : e;
			return await O(Mt(I(this, "frameattached"), I(this, "framenavigated"), D(this.frames())).pipe(Kn(i), qt(), Yt(Rn(n), Gn(r), I(this, "close").pipe(k(() => {
				throw new Tn("Page closed.");
			})))));
		}
		async emulate(e) {
			await Promise.all([this.setUserAgent({ userAgent: e.userAgent }), this.setViewport(e.viewport)]);
		}
		async evaluate(e, ...t) {
			return e = F(this.evaluate.name, e), await this.mainFrame().evaluate(e, ...t);
		}
		async _maybeWriteTypedArrayToFile(e, t) {
			e && await ln.value.fs.promises.writeFile(e, t);
		}
		async screencast(e = {}) {
			let t = ln.value.ScreenRecorder, [n, r, i] = await this.#i(), a;
			if (e.crop) {
				let { x: t, y: o, width: s, height: c } = wr(Cr(e.crop));
				if (t < 0 || o < 0) throw Error("`crop.x` and `crop.y` must be greater than or equal to 0.");
				if (s <= 0 || c <= 0) throw Error("`crop.height` and `crop.width` must be greater than or equal to 0.");
				let l = n / i, u = r / i;
				if (t + s > l) throw Error(`\`crop.width\` cannot be larger than the viewport width (${l}).`);
				if (o + c > u) throw Error(`\`crop.height\` cannot be larger than the viewport height (${u}).`);
				a = {
					x: t * i,
					y: o * i,
					width: s * i,
					height: c * i
				};
			}
			if (e.speed !== void 0 && e.speed <= 0) throw Error("`speed` must be greater than 0.");
			if (e.scale !== void 0 && e.scale <= 0) throw Error("`scale` must be greater than 0.");
			let o = new t(this, n, r, {
				...e,
				crop: a
			});
			try {
				await this._startScreencast();
			} catch (e) {
				throw o.stop(), e;
			}
			if (e.path) {
				let { createWriteStream: t } = ln.value.fs, n = t(e.path, "binary");
				o.pipe(n);
			}
			return o;
		}
		#n = 0;
		#r;
		async _startScreencast() {
			++this.#n, this.#r ||= this.mainFrame().client.send("Page.startScreencast", { format: "png" }).then(() => new Promise((e) => this.mainFrame().client.once("Page.screencastFrame", () => e()))), await this.#r;
		}
		async _stopScreencast() {
			--this.#n, this.#r && (this.#r = void 0, this.#n === 0 && await this.mainFrame().client.send("Page.stopScreencast"));
		}
		async #i() {
			let e = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				let t = this.viewport(), n = yr(e, new rn(), !1);
				return t && t.deviceScaleFactor !== 0 && (await this.setViewport({
					...t,
					deviceScaleFactor: 0
				}), n.defer(() => {
					this.setViewport(t).catch(P);
				})), await this.mainFrame().isolatedRealm().evaluate(() => [
					window.visualViewport.width * window.devicePixelRatio,
					window.visualViewport.height * window.devicePixelRatio,
					window.devicePixelRatio
				]);
			} catch (t) {
				e.error = t, e.hasError = !0;
			} finally {
				br(e);
			}
		}
		async screenshot(e = {}) {
			let t = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				yr(t, await this.browserContext().startScreenshot(), !1);
				let n = {
					...e,
					clip: e.clip ? { ...e.clip } : void 0
				};
				if (n.type === void 0 && n.path !== void 0) {
					let e = n.path;
					switch (e.slice(e.lastIndexOf(".") + 1).toLowerCase()) {
						case "png":
							n.type = "png";
							break;
						case "jpeg":
						case "jpg":
							n.type = "jpeg";
							break;
						case "webp": n.type = "webp";
					}
				}
				if (n.quality !== void 0) {
					if (n.quality < 0 || n.quality > 100) throw Error(`Expected 'quality' (${n.quality}) to be between 0 and 100, inclusive.`);
					if (n.type === void 0 || !["jpeg", "webp"].includes(n.type)) throw Error(`${n.type ?? "png"} screenshots do not support 'quality'.`);
				}
				if (n.clip) {
					if (n.clip.width <= 0) throw Error("'width' in 'clip' must be positive.");
					if (n.clip.height <= 0) throw Error("'height' in 'clip' must be positive.");
				}
				xr(n);
				let r = yr(t, new on(), !0);
				if (n.clip) {
					if (n.fullPage) throw Error("'clip' and 'fullPage' are mutually exclusive");
					n.clip = wr(Cr(n.clip));
				} else if (n.fullPage) {
					if (!n.captureBeyondViewport) {
						let e = await this.mainFrame().isolatedRealm().evaluate(() => {
							let e = document.documentElement;
							return {
								width: e.scrollWidth,
								height: e.scrollHeight
							};
						}), t = this.viewport();
						await this.setViewport({
							...t,
							...e
						}), r.defer(async () => {
							await this.setViewport(t).catch(P);
						});
					}
				} else n.captureBeyondViewport = !1;
				let i = await this._screenshot(n);
				if (n.encoding === "base64") return i;
				let a = un(i, !0);
				return await this._maybeWriteTypedArrayToFile(n.path, a), a;
			} catch (e) {
				t.error = e, t.hasError = !0;
			} finally {
				let e = br(t);
				e && await e;
			}
		}
		async title() {
			return await this.mainFrame().title();
		}
		click(e, t) {
			return this.mainFrame().click(e, t);
		}
		focus(e) {
			return this.mainFrame().focus(e);
		}
		hover(e) {
			return this.mainFrame().hover(e);
		}
		select(e, ...t) {
			return this.mainFrame().select(e, ...t);
		}
		tap(e) {
			return this.mainFrame().tap(e);
		}
		type(e, t, n) {
			return this.mainFrame().type(e, t, n);
		}
		async waitForSelector(e, t = {}) {
			return await this.mainFrame().waitForSelector(e, t);
		}
		waitForFunction(e, t, ...n) {
			return this.mainFrame().waitForFunction(e, t, ...n);
		}
		[(n = [ar(function() {
			return this.browser();
		})], j)]() {
			this[M]().catch(P);
		}
		async [M]() {
			await this.close(), await super[M]();
		}
	};
})();
function Cr(e) {
	return {
		...e,
		...e.width < 0 ? {
			x: e.x + e.width,
			width: -e.width
		} : {
			x: e.x,
			width: e.width
		},
		...e.height < 0 ? {
			y: e.y + e.height,
			height: -e.height
		} : {
			y: e.y,
			height: e.height
		}
	};
}
function wr(e) {
	let t = Math.round(e.x), n = Math.round(e.y), r = Math.round(e.width + e.x - t), i = Math.round(e.height + e.y - n);
	return {
		...e,
		x: t,
		y: n,
		width: r,
		height: i
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/api/WebWorker.js
var Tr;
(function(e) {
	e.Console = "console", e.Error = "error";
})(Tr ||= {});
var Er = class extends L {
	timeoutSettings = new er();
	#e;
	constructor(e) {
		super(), this.#e = e;
	}
	url() {
		return this.#e;
	}
	async evaluate(e, ...t) {
		return e = F(this.evaluate.name, e), await this.mainRealm().evaluate(e, ...t);
	}
	async evaluateHandle(e, ...t) {
		return e = F(this.evaluateHandle.name, e), await this.mainRealm().evaluateHandle(e, ...t);
	}
	async close() {
		throw new wn("WebWorker.close() is not supported");
	}
}, Dr = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	constructor(e, t, n, r, i, a, o) {
		this.#e = e, this.#t = t, this.#n = n, this.#r = r, this.#i = i, this.#a = a, this.#o = o;
	}
	type() {
		return this.#e;
	}
	text() {
		return this.#t;
	}
	args() {
		return this.#n;
	}
	location() {
		return this.#r[0] ?? (this.#i ? { url: this.#i.url() } : {});
	}
	stackTrace() {
		return this.#r;
	}
	_rawStackTrace() {
		return this.#a;
	}
	_targetId() {
		return this.#o;
	}
}, Or = class {
	#e;
	#t;
	#n = !1;
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	isMultiple() {
		return this.#t;
	}
	async accept(e) {
		N(!this.#n, "Cannot accept FileChooser which is already handled!"), this.#n = !0, await this.#e.uploadFile(...e);
	}
	async cancel() {
		N(!this.#n, "Cannot cancel FileChooser which is already handled!"), this.#n = !0, await this.#e.evaluate((e) => {
			e.dispatchEvent(new Event("cancel", { bubbles: !0 }));
		});
	}
}, H;
(function(e) {
	e.Request = Symbol("NetworkManager.Request"), e.RequestServedFromCache = Symbol("NetworkManager.RequestServedFromCache"), e.Response = Symbol("NetworkManager.Response"), e.RequestFailed = Symbol("NetworkManager.RequestFailed"), e.RequestFinished = Symbol("NetworkManager.RequestFinished");
})(H ||= {});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/util/ErrorLike.js
function kr(e) {
	return typeof e == "object" && !!e && "name" in e && "message" in e;
}
function Ar(e, t, n) {
	return e.message = t, e.originalMessage = n ?? e.originalMessage, e;
}
function jr(e) {
	let t = e.error.message;
	return e.error && typeof e.error == "object" && "data" in e.error && (t += ` ${e.error.data}`), t;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/api/JSHandle.js
var Mr = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, Nr = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Pr = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, Fr = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
}), Ir = (() => {
	let e = [ir], t, n = [], r, i = [], a, o;
	var s = class {
		static {
			r = this;
		}
		static {
			let c = typeof Symbol == "function" && Symbol.metadata ? Object.create(null) : void 0;
			Nr(this, null, a, {
				kind: "method",
				name: "getProperty",
				static: !1,
				private: !1,
				access: {
					has: (e) => "getProperty" in e,
					get: (e) => e.getProperty
				},
				metadata: c
			}, null, i), Nr(this, null, o, {
				kind: "method",
				name: "getProperties",
				static: !1,
				private: !1,
				access: {
					has: (e) => "getProperties" in e,
					get: (e) => e.getProperties
				},
				metadata: c
			}, null, i), Nr(null, t = { value: r }, e, {
				kind: "class",
				name: r.name,
				metadata: c
			}, null, n), s = r = t.value, c && Object.defineProperty(r, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: c
			}), Mr(r, n);
		}
		constructor() {
			Mr(this, i);
		}
		async evaluate(e, ...t) {
			return e = F(this.evaluate.name, e), await this.realm.evaluate(e, this, ...t);
		}
		async evaluateHandle(e, ...t) {
			return e = F(this.evaluateHandle.name, e), await this.realm.evaluateHandle(e, this, ...t);
		}
		async getProperty(e) {
			return await this.evaluateHandle((e, t) => e[t], e);
		}
		async getProperties() {
			let e = await this.evaluate((e) => {
				let t = [], n = Object.getOwnPropertyDescriptors(e);
				for (let e in n) n[e]?.enumerable && t.push(e);
				return t;
			}), t = /* @__PURE__ */ new Map(), n = await Promise.all(e.map((e) => this.getProperty(e)));
			for (let [r, i] of Object.entries(e)) {
				let e = {
					stack: [],
					error: void 0,
					hasError: !1
				};
				try {
					let a = Pr(e, n[r], !1);
					a && t.set(i, a.move());
				} catch (t) {
					e.error = t, e.hasError = !0;
				} finally {
					Fr(e);
				}
			}
			return t;
		}
		[(a = [B()], o = [B()], j)]() {
			this[M]().catch(P);
		}
		[M]() {
			return this.dispose();
		}
	};
	return r;
})(), Lr = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, Rr = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
}), zr = class {
	#e;
	#t;
	#n;
	constructor(e, t, n) {
		this.#e = e, this.#t = t, this.#n = n;
	}
	get name() {
		return this.#e;
	}
	get initSource() {
		return this.#n;
	}
	async run(e, t, n, r) {
		let i = new rn();
		try {
			if (!r) {
				let r = {
					stack: [],
					error: void 0,
					hasError: !1
				};
				try {
					let a = await Lr(r, await e.evaluateHandle((e, t) => globalThis[e].args.get(t), this.#e, t), !1).getProperties();
					for (let [e, t] of a) if (e in n) switch (t.remoteObject().subtype) {
						case "node":
							n[+e] = t;
							break;
						default: i.use(t);
					}
					else i.use(t);
				} catch (e) {
					r.error = e, r.hasError = !0;
				} finally {
					Rr(r);
				}
			}
			await e.evaluate((e, t, n) => {
				let r = globalThis[e].callbacks;
				r.get(t).resolve(n), r.delete(t);
			}, this.#e, t, await this.#t(...n));
			for (let e of n) e instanceof Ir && i.use(e);
		} catch (n) {
			kr(n) ? await e.evaluate((e, t, n, r) => {
				let i = Error(n);
				i.stack = r;
				let a = globalThis[e].callbacks;
				a.get(t).reject(i), a.delete(t);
			}, this.#e, t, n.message, n.stack).catch(P) : await e.evaluate((e, t, n) => {
				let r = globalThis[e].callbacks;
				r.get(t).reject(n), r.delete(t);
			}, this.#e, t, n).catch(P);
		}
	}
}, Br = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	async emulateAdapter(e, t = !0) {
		await this.#e.send("BluetoothEmulation.disable"), await this.#e.send("BluetoothEmulation.enable", {
			state: e,
			leSupported: t
		});
	}
	async disableEmulation() {
		await this.#e.send("BluetoothEmulation.disable");
	}
	async simulatePreconnectedPeripheral(e) {
		await this.#e.send("BluetoothEmulation.simulatePreconnectedPeripheral", e);
	}
}, Vr = class {
	#e = /* @__PURE__ */ new Map();
	#t;
	constructor(e) {
		this.#t = e;
	}
	has(e) {
		return this.#e.has(e);
	}
	create(e, t, n) {
		let r = new Hr(this.#t(), e, t);
		this.#e.set(r.id, r);
		try {
			n(r.id);
		} catch (e) {
			throw r.promise.catch(P).finally(() => {
				this.#e.delete(r.id);
			}), r.reject(e), e;
		}
		return r.promise.finally(() => {
			this.#e.delete(r.id);
		});
	}
	reject(e, t, n) {
		let r = this.#e.get(e);
		r && this._reject(r, t, n);
	}
	rejectRaw(e, t) {
		let n = this.#e.get(e);
		n && n.reject(t);
	}
	_reject(e, t, n) {
		let r, i;
		t instanceof Cn ? (r = t, r.cause = e.error, i = t.message) : (r = e.error, i = t), e.reject(Ar(r, `Protocol error (${e.label}): ${i}`, n));
	}
	resolve(e, t) {
		let n = this.#e.get(e);
		n && n.resolve(t);
	}
	clear() {
		for (let e of this.#e.values()) this._reject(e, new Tn("Target closed"));
		this.#e.clear();
	}
	getPendingProtocolErrors() {
		let e = [];
		for (let t of this.#e.values()) e.push(/* @__PURE__ */ Error(`${t.label} timed out. Trace: ${t.error.stack}`));
		return e;
	}
}, Hr = class {
	#e;
	#t = new Cn();
	#n = z.create();
	#r;
	#i;
	constructor(e, t, n) {
		this.#e = e, this.#i = t, n && (this.#r = setTimeout(() => {
			this.#n.reject(Ar(this.#t, `${t} timed out. Increase the 'protocolTimeout' setting in launch/connect calls for a higher timeout if needed.`));
		}, n));
	}
	resolve(e) {
		clearTimeout(this.#r), this.#n.resolve(e);
	}
	reject(e) {
		clearTimeout(this.#r), this.#n.reject(e);
	}
	get id() {
		return this.#e;
	}
	get promise() {
		return this.#n.valueOrThrow();
	}
	get error() {
		return this.#t;
	}
	get label() {
		return this.#i;
	}
}, Ur = class extends Yn {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o = !1;
	#s = !1;
	constructor(e, t, n, r, i) {
		super(), this.#r = e, this.#t = t, this.#n = new Vr(e._idGenerator), this.#e = n, this.#i = r, this.#o = i;
	}
	setTarget(e) {
		this.#a = e;
	}
	target() {
		return N(this.#a, "Target must exist"), this.#a;
	}
	connection() {
		return this.#r;
	}
	get detached() {
		return this.#r._closed || this.#s;
	}
	parentSession() {
		return this.#i ? this.#r?.session(this.#i) ?? void 0 : this;
	}
	send(e, t, n) {
		return this.detached ? Promise.reject(new Tn(`Protocol error (${e}): Session closed. Most likely the ${this.#t} has been closed.`)) : this.#r._rawSend(this.#n, e, t, this.#e, n).catch((t) => {
			throw t instanceof Error && t.message.includes("Session with given id not found") ? (this.onClosed(), new Tn(`Protocol error (${e}): Session with given id not found.`)) : t;
		});
	}
	onMessage(e) {
		e.id ? e.error ? this.#o ? this.#n.rejectRaw(e.id, e.error) : this.#n.reject(e.id, jr(e), e.error.message) : this.#n.resolve(e.id, e.result) : (N(!e.id), this.emit(e.method, e.params));
	}
	async detach() {
		if (this.detached) throw Error(`Session already detached. Most likely the ${this.#t} has been closed.`);
		await this.#r.send("Target.detachFromTarget", { sessionId: this.#e }), this.#s = !0;
	}
	onClosed() {
		this.#n.clear(), this.#s = !0, this.emit(R.Disconnected, void 0);
	}
	id() {
		return this.#e;
	}
	hasCallback(e) {
		return this.#n.has(e);
	}
	getPendingProtocolErrors() {
		return this.#n.getPendingProtocolErrors();
	}
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/util/incremental-id-generator.js
function Wr() {
	let e = 0;
	return () => (e === 2 ** 53 - 1 && (e = 0), ++e);
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/cdp/Connection.js
var Gr = _n("puppeteer:protocol:SEND ►"), Kr = _n("puppeteer:protocol:RECV ◀"), qr = class extends L {
	#e;
	#t;
	#n;
	#r;
	#i = /* @__PURE__ */ new Map();
	#a = !1;
	#o = /* @__PURE__ */ new Set();
	#s = !1;
	#c;
	#l = !1;
	#u;
	constructor(e, t, n = 0, r, i = !1, a = Wr()) {
		super(), this.#l = i, this.#u = a, this.#c = new Vr(a), this.#e = e, this.#n = n, this.#r = r ?? 18e4, this.#t = t, this.#t.onmessage = this.onMessage.bind(this), this.#t.onclose = this.#d.bind(this);
	}
	static fromSession(e) {
		return e.connection();
	}
	get delay() {
		return this.#n;
	}
	get timeout() {
		return this.#r;
	}
	get rejectEmulateNetworkConditionsCalls() {
		return this.#s;
	}
	set rejectEmulateNetworkConditionsCalls(e) {
		this.#s = e;
	}
	get _closed() {
		return this.#a;
	}
	get _idGenerator() {
		return this.#u;
	}
	get _sessions() {
		return this.#i;
	}
	_session(e) {
		return this.#i.get(e) || null;
	}
	session(e) {
		return this._session(e);
	}
	url() {
		return this.#e;
	}
	send(e, t, n) {
		return this._rawSend(this.#c, e, t, void 0, n);
	}
	_rawSend(e, t, n, r, i) {
		return this.#a ? Promise.reject(new En("Connection closed.")) : t === "Network.emulateNetworkConditions" && this.rejectEmulateNetworkConditionsCalls ? Promise.reject(/* @__PURE__ */ Error("Cannot reset network conditions: rule-based emulation is enabled.")) : e.create(t, i?.timeout ?? this.#r, (e) => {
			let i = JSON.stringify({
				method: t,
				params: n,
				id: e,
				sessionId: r
			});
			Gr(i), this.#t.send(i);
		});
	}
	async closeBrowser() {
		await this.send("Browser.close");
	}
	async onMessage(e) {
		this.#n && await new Promise((e) => setTimeout(e, this.#n)), Kr(e);
		let t = JSON.parse(e);
		if (t.method === "Target.attachedToTarget") {
			let e = t.params.sessionId, n = new Ur(this, t.params.targetInfo.type, e, t.sessionId, this.#l);
			this.#i.set(e, n), this.emit(R.SessionAttached, n);
			let r = this.#i.get(t.sessionId);
			r && r.emit(R.SessionAttached, n);
		} else if (t.method === "Target.detachedFromTarget") {
			let e = this.#i.get(t.params.sessionId);
			if (e) {
				e.onClosed(), this.#i.delete(t.params.sessionId), this.emit(R.SessionDetached, e);
				let n = this.#i.get(t.sessionId);
				n && n.emit(R.SessionDetached, e);
			}
		}
		if (t.sessionId) {
			let e = this.#i.get(t.sessionId);
			e && e.onMessage(t);
		} else if (t.id) {
			if (this.#c.has(t.id)) t.error ? this.#l ? this.#c.rejectRaw(t.id, t.error) : this.#c.reject(t.id, jr(t), t.error.message) : this.#c.resolve(t.id, t.result);
			else for (let e of this.#i.values()) if (e.hasCallback(t.id)) {
				e.onMessage(t);
				break;
			}
		} else this.emit(t.method, t.params);
	}
	#d() {
		if (!this.#a) {
			this.#a = !0, this.#t.onmessage = void 0, this.#t.onclose = void 0, this.#c.clear();
			for (let e of this.#i.values()) e.onClosed();
			this.#i.clear(), this.emit(R.Disconnected, void 0);
		}
	}
	dispose() {
		this.#d(), this.#t.close();
	}
	isAutoAttached(e) {
		return !this.#o.has(e);
	}
	async _createSession(e, t = !0) {
		t || this.#o.add(e.targetId);
		let { sessionId: n } = await this.send("Target.attachToTarget", {
			targetId: e.targetId,
			flatten: !0
		});
		this.#o.delete(e.targetId);
		let r = this.#i.get(n);
		if (!r) throw Error("CDPSession creation failed.");
		return r;
	}
	async createSession(e) {
		return await this._createSession(e, !1);
	}
	getPendingProtocolErrors() {
		let e = [];
		e.push(...this.#c.getPendingProtocolErrors());
		for (let t of this.#i.values()) e.push(...t.getPendingProtocolErrors());
		return e;
	}
};
function Jr(e) {
	return e instanceof Tn;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/cdp/Coverage.js
var Yr = class {
	#e;
	#t;
	constructor(e) {
		this.#e = new Xr(e), this.#t = new Zr(e);
	}
	updateClient(e) {
		this.#e.updateClient(e), this.#t.updateClient(e);
	}
	async startJSCoverage(e = {}) {
		return await this.#e.start(e);
	}
	async stopJSCoverage() {
		return await this.#e.stop();
	}
	async startCSSCoverage(e = {}) {
		return await this.#t.start(e);
	}
	async stopCSSCoverage() {
		return await this.#t.stop();
	}
}, Xr = class {
	#e;
	#t = !1;
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Map();
	#i;
	#a = !1;
	#o = !1;
	#s = !1;
	constructor(e) {
		this.#e = e;
	}
	updateClient(e) {
		this.#e = e;
	}
	async start(e = {}) {
		N(!this.#t, "JSCoverage is already enabled");
		let { resetOnNavigation: t = !0, reportAnonymousScripts: n = !1, includeRawScriptCoverage: r = !1, useBlockCoverage: i = !0 } = e;
		this.#a = t, this.#o = n, this.#s = r, this.#t = !0, this.#n.clear(), this.#r.clear(), this.#i = new rn();
		let a = this.#i.use(new L(this.#e));
		a.on("Debugger.scriptParsed", this.#l.bind(this)), a.on("Runtime.executionContextsCleared", this.#c.bind(this)), await Promise.all([
			this.#e.send("Profiler.enable"),
			this.#e.send("Profiler.startPreciseCoverage", {
				callCount: this.#s,
				detailed: i
			}),
			this.#e.send("Debugger.enable"),
			this.#e.send("Debugger.setSkipAllPauses", { skip: !0 })
		]);
	}
	#c() {
		this.#a && (this.#n.clear(), this.#r.clear());
	}
	async #l(e) {
		if (!kn.isPuppeteerURL(e.url) && (e.url || this.#o)) try {
			let t = await this.#e.send("Debugger.getScriptSource", { scriptId: e.scriptId });
			this.#n.set(e.scriptId, e.url), this.#r.set(e.scriptId, t.scriptSource);
		} catch (e) {
			P(e);
		}
	}
	async stop() {
		N(this.#t, "JSCoverage is not enabled"), this.#t = !1;
		let e = await Promise.all([
			this.#e.send("Profiler.takePreciseCoverage"),
			this.#e.send("Profiler.stopPreciseCoverage"),
			this.#e.send("Profiler.disable"),
			this.#e.send("Debugger.disable")
		]);
		this.#i?.dispose();
		let t = [], n = e[0];
		for (let e of n.result) {
			let n = this.#n.get(e.scriptId);
			!n && this.#o && (n = "debugger://VM" + e.scriptId);
			let r = this.#r.get(e.scriptId);
			if (r === void 0 || n === void 0) continue;
			let i = [];
			for (let t of e.functions) i.push(...t.ranges);
			let a = Qr(i);
			this.#s ? t.push({
				url: n,
				ranges: a,
				text: r,
				rawScriptCoverage: e
			}) : t.push({
				url: n,
				ranges: a,
				text: r
			});
		}
		return t;
	}
}, Zr = class {
	#e;
	#t = !1;
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Map();
	#i;
	#a = !1;
	constructor(e) {
		this.#e = e;
	}
	updateClient(e) {
		this.#e = e;
	}
	async start(e = {}) {
		N(!this.#t, "CSSCoverage is already enabled");
		let { resetOnNavigation: t = !0 } = e;
		this.#a = t, this.#t = !0, this.#n.clear(), this.#r.clear(), this.#i = new rn();
		let n = this.#i.use(new L(this.#e));
		n.on("CSS.styleSheetAdded", this.#s.bind(this)), n.on("Runtime.executionContextsCleared", this.#o.bind(this)), await Promise.all([
			this.#e.send("DOM.enable"),
			this.#e.send("CSS.enable"),
			this.#e.send("CSS.startRuleUsageTracking")
		]);
	}
	#o() {
		this.#a && (this.#n.clear(), this.#r.clear());
	}
	async #s(e) {
		let t = e.header;
		if (t.sourceURL) try {
			let e = await this.#e.send("CSS.getStyleSheetText", { styleSheetId: t.styleSheetId });
			this.#n.set(t.styleSheetId, t.sourceURL), this.#r.set(t.styleSheetId, e.text);
		} catch (e) {
			P(e);
		}
	}
	async stop() {
		N(this.#t, "CSSCoverage is not enabled"), this.#t = !1;
		let e = await this.#e.send("CSS.stopRuleUsageTracking");
		await Promise.all([this.#e.send("CSS.disable"), this.#e.send("DOM.disable")]), this.#i?.dispose();
		let t = /* @__PURE__ */ new Map();
		for (let n of e.ruleUsage) {
			let e = t.get(n.styleSheetId);
			e || (e = [], t.set(n.styleSheetId, e)), e.push({
				startOffset: n.startOffset,
				endOffset: n.endOffset,
				count: +!!n.used
			});
		}
		let n = [];
		for (let e of this.#n.keys()) {
			let r = this.#n.get(e);
			N(r !== void 0, `Stylesheet URL is undefined (styleSheetId=${e})`);
			let i = this.#r.get(e);
			N(i !== void 0, `Stylesheet text is undefined (styleSheetId=${e})`);
			let a = Qr(t.get(e) || []);
			n.push({
				url: r,
				ranges: a,
				text: i
			});
		}
		return n;
	}
};
function Qr(e) {
	let t = [];
	for (let n of e) t.push({
		offset: n.startOffset,
		type: 0,
		range: n
	}), t.push({
		offset: n.endOffset,
		type: 1,
		range: n
	});
	t.sort((e, t) => {
		if (e.offset !== t.offset) return e.offset - t.offset;
		if (e.type !== t.type) return t.type - e.type;
		let n = e.range.endOffset - e.range.startOffset, r = t.range.endOffset - t.range.startOffset;
		return e.type === 0 ? r - n : n - r;
	});
	let n = [], r = [], i = 0;
	for (let e of t) {
		if (n.length && i < e.offset && n[n.length - 1] > 0) {
			let t = r[r.length - 1];
			t && t.end === i ? t.end = e.offset : r.push({
				start: i,
				end: e.offset
			});
		}
		i = e.offset, e.type === 0 ? n.push(e.range.count) : n.pop();
	}
	return r.filter((e) => e.end - e.start > 0);
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/api/Dialog.js
var $r = class {
	#e;
	#t;
	#n;
	handled = !1;
	constructor(e, t, n = "") {
		this.#e = e, this.#t = t, this.#n = n;
	}
	type() {
		return this.#e;
	}
	message() {
		return this.#t;
	}
	defaultValue() {
		return this.#n;
	}
	async accept(e) {
		N(!this.handled, "Cannot accept dialog which is already handled!"), this.handled = !0, await this.handle({
			accept: !0,
			text: e
		});
	}
	async dismiss() {
		N(!this.handled, "Cannot dismiss dialog which is already handled!"), this.handled = !0, await this.handle({ accept: !1 });
	}
}, ei = class extends $r {
	#e;
	constructor(e, t, n, r = "") {
		super(t, n, r), this.#e = e;
	}
	async handle(e) {
		await this.#e.send("Page.handleJavaScriptDialog", {
			accept: e.accept,
			promptText: e.text
		});
	}
}, ti = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, ni = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, ri = function(e, t, n) {
	return typeof t == "symbol" && (t = t.description ? `[${t.description}]` : ""), Object.defineProperty(e, "name", {
		configurable: !0,
		value: n ? `${n} ${t}` : t
	});
}, ii = class {
	#e;
	#t;
	#n;
	constructor(e, t, n) {
		this.#e = e, this.#t = t, this.#n = n, this.#t.registerState(this);
	}
	async setState(e) {
		this.#e = e, await this.sync();
	}
	get state() {
		return this.#e;
	}
	async sync() {
		await Promise.all(this.#t.clients().map((e) => this.#n(e, this.#e)));
	}
}, ai = (() => {
	let e = [], t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, ee, te, y, b;
	return class {
		static {
			let x = typeof Symbol == "function" && Symbol.metadata ? Object.create(null) : void 0;
			t = [V], r = [V], a = [V], s = [V], l = [V], d = [V], p = [V], h = [V], _ = [V], ee = [V], y = [V], ni(this, n = { value: ri(async function(e, t) {
				if (!t.viewport) {
					await Promise.all([e.send("Emulation.clearDeviceMetricsOverride"), e.send("Emulation.setTouchEmulationEnabled", { enabled: !1 })]).catch(P);
					return;
				}
				let { viewport: n } = t, r = n.isMobile || !1, i = n.width, a = n.height, o = n.deviceScaleFactor ?? 1, s = n.isLandscape ? {
					angle: 90,
					type: "landscapePrimary"
				} : {
					angle: 0,
					type: "portraitPrimary"
				}, c = n.hasTouch || !1;
				await Promise.all([e.send("Emulation.setDeviceMetricsOverride", {
					mobile: r,
					width: i,
					height: a,
					deviceScaleFactor: o,
					screenOrientation: s
				}).catch((e) => {
					if (e.message.includes("Target does not support metrics override")) {
						P(e);
						return;
					}
					throw e;
				}), e.send("Emulation.setTouchEmulationEnabled", { enabled: c })]);
			}, "#applyViewport") }, t, {
				kind: "method",
				name: "#applyViewport",
				static: !1,
				private: !0,
				access: {
					has: (e) => #g in e,
					get: (e) => e.#g
				},
				metadata: x
			}, null, e), ni(this, i = { value: ri(async function(e, t) {
				t.active && (t.overrides ? await e.send("Emulation.setIdleOverride", {
					isUserActive: t.overrides.isUserActive,
					isScreenUnlocked: t.overrides.isScreenUnlocked
				}) : await e.send("Emulation.clearIdleOverride"));
			}, "#emulateIdleState") }, r, {
				kind: "method",
				name: "#emulateIdleState",
				static: !1,
				private: !0,
				access: {
					has: (e) => #_ in e,
					get: (e) => e.#_
				},
				metadata: x
			}, null, e), ni(this, o = { value: ri(async function(e, t) {
				if (t.active) try {
					await e.send("Emulation.setTimezoneOverride", { timezoneId: t.timezoneId || "" });
				} catch (e) {
					throw kr(e) && e.message.includes("Invalid timezone") ? Error(`Invalid timezone ID: ${t.timezoneId}`) : e;
				}
			}, "#emulateTimezone") }, a, {
				kind: "method",
				name: "#emulateTimezone",
				static: !1,
				private: !0,
				access: {
					has: (e) => #v in e,
					get: (e) => e.#v
				},
				metadata: x
			}, null, e), ni(this, c = { value: ri(async function(e, t) {
				t.active && await e.send("Emulation.setEmulatedVisionDeficiency", { type: t.visionDeficiency || "none" });
			}, "#emulateVisionDeficiency") }, s, {
				kind: "method",
				name: "#emulateVisionDeficiency",
				static: !1,
				private: !0,
				access: {
					has: (e) => #y in e,
					get: (e) => e.#y
				},
				metadata: x
			}, null, e), ni(this, u = { value: ri(async function(e, t) {
				t.active && await e.send("Emulation.setCPUThrottlingRate", { rate: t.factor ?? 1 });
			}, "#emulateCpuThrottling") }, l, {
				kind: "method",
				name: "#emulateCpuThrottling",
				static: !1,
				private: !0,
				access: {
					has: (e) => #b in e,
					get: (e) => e.#b
				},
				metadata: x
			}, null, e), ni(this, f = { value: ri(async function(e, t) {
				t.active && await e.send("Emulation.setEmulatedMedia", { features: t.mediaFeatures });
			}, "#emulateMediaFeatures") }, d, {
				kind: "method",
				name: "#emulateMediaFeatures",
				static: !1,
				private: !0,
				access: {
					has: (e) => #x in e,
					get: (e) => e.#x
				},
				metadata: x
			}, null, e), ni(this, m = { value: ri(async function(e, t) {
				t.active && await e.send("Emulation.setEmulatedMedia", { media: t.type || "" });
			}, "#emulateMediaType") }, p, {
				kind: "method",
				name: "#emulateMediaType",
				static: !1,
				private: !0,
				access: {
					has: (e) => #S in e,
					get: (e) => e.#S
				},
				metadata: x
			}, null, e), ni(this, g = { value: ri(async function(e, t) {
				t.active && await e.send("Emulation.setGeolocationOverride", t.geoLocation ? {
					longitude: t.geoLocation.longitude,
					latitude: t.geoLocation.latitude,
					accuracy: t.geoLocation.accuracy
				} : void 0);
			}, "#setGeolocation") }, h, {
				kind: "method",
				name: "#setGeolocation",
				static: !1,
				private: !0,
				access: {
					has: (e) => #C in e,
					get: (e) => e.#C
				},
				metadata: x
			}, null, e), ni(this, v = { value: ri(async function(e, t) {
				t.active && await e.send("Emulation.setDefaultBackgroundColorOverride", { color: t.color });
			}, "#setDefaultBackgroundColor") }, _, {
				kind: "method",
				name: "#setDefaultBackgroundColor",
				static: !1,
				private: !0,
				access: {
					has: (e) => #w in e,
					get: (e) => e.#w
				},
				metadata: x
			}, null, e), ni(this, te = { value: ri(async function(e, t) {
				t.active && await e.send("Emulation.setScriptExecutionDisabled", { value: !t.javaScriptEnabled });
			}, "#setJavaScriptEnabled") }, ee, {
				kind: "method",
				name: "#setJavaScriptEnabled",
				static: !1,
				private: !0,
				access: {
					has: (e) => #T in e,
					get: (e) => e.#T
				},
				metadata: x
			}, null, e), ni(this, b = { value: ri(async function(e, t) {
				t.active && await e.send("Emulation.setFocusEmulationEnabled", { enabled: t.enabled });
			}, "#emulateFocus") }, y, {
				kind: "method",
				name: "#emulateFocus",
				static: !1,
				private: !0,
				access: {
					has: (e) => #E in e,
					get: (e) => e.#E
				},
				metadata: x
			}, null, e), x && Object.defineProperty(this, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: x
			});
		}
		#e = ti(this, e);
		#t = !1;
		#n = !1;
		#r = [];
		#i = new ii({ active: !1 }, this, this.#g);
		#a = new ii({ active: !1 }, this, this.#_);
		#o = new ii({ active: !1 }, this, this.#v);
		#s = new ii({ active: !1 }, this, this.#y);
		#c = new ii({ active: !1 }, this, this.#b);
		#l = new ii({ active: !1 }, this, this.#x);
		#u = new ii({ active: !1 }, this, this.#S);
		#d = new ii({ active: !1 }, this, this.#C);
		#f = new ii({ active: !1 }, this, this.#w);
		#p = new ii({
			javaScriptEnabled: !0,
			active: !1
		}, this, this.#T);
		#m = new ii({
			enabled: !0,
			active: !1
		}, this, this.#E);
		#h = /* @__PURE__ */ new Set();
		constructor(e) {
			this.#e = e;
		}
		updateClient(e) {
			this.#e = e, this.#h.delete(e);
		}
		registerState(e) {
			this.#r.push(e);
		}
		clients() {
			return [this.#e, ...Array.from(this.#h)];
		}
		async registerSpeculativeSession(e) {
			this.#h.add(e), e.once(R.Disconnected, () => {
				this.#h.delete(e);
			}), Promise.all(this.#r.map((e) => e.sync().catch(P)));
		}
		get javascriptEnabled() {
			return this.#p.state.javaScriptEnabled;
		}
		async emulateViewport(e) {
			let t = this.#i.state;
			if (!e && !t.active) return !1;
			await this.#i.setState(e ? {
				viewport: e,
				active: !0
			} : { active: !1 });
			let n = e?.isMobile || !1, r = e?.hasTouch || !1, i = this.#t !== n || this.#n !== r;
			return this.#t = n, this.#n = r, i;
		}
		get #g() {
			return n.value;
		}
		async emulateIdleState(e) {
			await this.#a.setState({
				active: !0,
				overrides: e
			});
		}
		get #_() {
			return i.value;
		}
		get #v() {
			return o.value;
		}
		async emulateTimezone(e) {
			await this.#o.setState({
				timezoneId: e,
				active: !0
			});
		}
		get #y() {
			return c.value;
		}
		async emulateVisionDeficiency(e) {
			N(!e || (/* @__PURE__ */ new Set([
				"none",
				"achromatopsia",
				"blurredVision",
				"deuteranopia",
				"protanopia",
				"reducedContrast",
				"tritanopia"
			])).has(e), `Unsupported vision deficiency: ${e}`), await this.#s.setState({
				active: !0,
				visionDeficiency: e
			});
		}
		get #b() {
			return u.value;
		}
		async emulateCPUThrottling(e) {
			N(e === null || e >= 1, "Throttling rate should be greater or equal to 1"), await this.#c.setState({
				active: !0,
				factor: e ?? void 0
			});
		}
		get #x() {
			return f.value;
		}
		async emulateMediaFeatures(e) {
			if (Array.isArray(e)) for (let t of e) {
				let e = t.name;
				N(/^(?:prefers-(?:color-scheme|reduced-motion)|color-gamut)$/.test(e), "Unsupported media feature: " + e);
			}
			await this.#l.setState({
				active: !0,
				mediaFeatures: e
			});
		}
		get #S() {
			return m.value;
		}
		async emulateMediaType(e) {
			N(e === "screen" || e === "print" || (e ?? void 0) === void 0, "Unsupported media type: " + e), await this.#u.setState({
				type: e,
				active: !0
			});
		}
		get #C() {
			return g.value;
		}
		async setGeolocation(e) {
			let { longitude: t, latitude: n, accuracy: r = 0 } = e;
			if (t < -180 || t > 180) throw Error(`Invalid longitude "${t}": precondition -180 <= LONGITUDE <= 180 failed.`);
			if (n < -90 || n > 90) throw Error(`Invalid latitude "${n}": precondition -90 <= LATITUDE <= 90 failed.`);
			if (r < 0) throw Error(`Invalid accuracy "${r}": precondition 0 <= ACCURACY failed.`);
			await this.#d.setState({
				active: !0,
				geoLocation: {
					longitude: t,
					latitude: n,
					accuracy: r
				}
			});
		}
		get #w() {
			return v.value;
		}
		async resetDefaultBackgroundColor() {
			await this.#f.setState({
				active: !0,
				color: void 0
			});
		}
		async setTransparentBackgroundColor() {
			await this.#f.setState({
				active: !0,
				color: {
					r: 0,
					g: 0,
					b: 0,
					a: 0
				}
			});
		}
		get #T() {
			return te.value;
		}
		async setJavaScriptEnabled(e) {
			await this.#p.setState({
				active: !0,
				javaScriptEnabled: e
			});
		}
		get #E() {
			return b.value;
		}
		async emulateFocus(e) {
			await this.#m.setState({
				active: !0,
				enabled: e
			});
		}
	};
})(), oi = class {
	static async *map(e, t) {
		for await (let n of e) yield await t(n);
	}
	static async *flatMap(e, t) {
		for await (let n of e) yield* t(n);
	}
	static async collect(e) {
		let t = [];
		for await (let n of e) t.push(n);
		return t;
	}
	static async first(e) {
		for await (let t of e) return t;
	}
}, si = Symbol("_isElementHandle"), ci = /* @__PURE__ */ new Map(), li = (e) => {
	let t = ci.get(e);
	return t || (t = Function(`return ${e}`)(), ci.set(e, t), t);
};
function ui(e) {
	let t = e.toString();
	if (t.match(/^(async )*function(\(|\s)/) || t.match(/^(async )*function\s*\*\s*/) || t.startsWith("(") || t.match(/^async\s*\(/) || t.match(/^(async)*\s*(?:[$_\p{ID_Start}])(?:[$\u200C\u200D\p{ID_Continue}])*\s*=>/u)) return t;
	let n = "function ";
	return t.startsWith("async ") && (n = `async ${n}`, t = t.substring(6)), `${n}${t}`;
}
var di = (e, t) => {
	let n = ui(e);
	for (let [e, r] of Object.entries(t)) n = n.replace(RegExp(`PLACEHOLDER\\(\\s*(?:'${e}'|"${e}")\\s*\\)`, "g"), `(${r})`);
	return li(n);
}, fi = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, pi = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
}), mi = 20;
async function* hi(e, t) {
	let n = {
		stack: [],
		error: void 0,
		hasError: !1
	};
	try {
		let r = await fi(n, await e.evaluateHandle(async (e, t) => {
			let n = [];
			for (; n.length < t;) {
				let t = await e.next();
				if (t.done) break;
				n.push(t.value);
			}
			return n;
		}, t), !1).getProperties(), i = r.values();
		return fi(n, new rn(), !1).defer(() => {
			for (let e of i) {
				let t = {
					stack: [],
					error: void 0,
					hasError: !1
				};
				try {
					fi(t, e, !1)[j]();
				} catch (e) {
					t.error = e, t.hasError = !0;
				} finally {
					pi(t);
				}
			}
		}), yield* i, r.size === 0;
	} catch (e) {
		n.error = e, n.hasError = !0;
	} finally {
		pi(n);
	}
}
async function* gi(e) {
	let t = mi;
	for (; !(yield* hi(e, t));) t <<= 1;
}
async function* _i(e) {
	let t = {
		stack: [],
		error: void 0,
		hasError: !1
	};
	try {
		yield* gi(fi(t, await e.evaluateHandle((e) => (async function* () {
			yield* e;
		})()), !1));
	} catch (e) {
		t.error = e, t.hasError = !0;
	} finally {
		pi(t);
	}
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/common/LazyArg.js
var vi = class e {
	static create = (t) => new e(t);
	#e;
	constructor(e) {
		this.#e = e;
	}
	async get(e) {
		return await this.#e(e);
	}
}, yi = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, bi = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
}), xi = class {
	static querySelectorAll;
	static querySelector;
	static get _querySelector() {
		if (this.querySelector) return this.querySelector;
		if (!this.querySelectorAll) throw Error("Cannot create default `querySelector`.");
		return this.querySelector = di(async (e, t, n) => {
			let r = PLACEHOLDER("querySelectorAll")(e, t, n);
			for await (let e of r) return e;
			return null;
		}, { querySelectorAll: ui(this.querySelectorAll) });
	}
	static get _querySelectorAll() {
		if (this.querySelectorAll) return this.querySelectorAll;
		if (!this.querySelector) throw Error("Cannot create default `querySelectorAll`.");
		return this.querySelectorAll = di(async function* (e, t, n) {
			let r = await PLACEHOLDER("querySelector")(e, t, n);
			r && (yield r);
		}, { querySelector: ui(this.querySelector) });
	}
	static async *queryAll(e, t) {
		let n = {
			stack: [],
			error: void 0,
			hasError: !1
		};
		try {
			yield* _i(yi(n, await e.evaluateHandle(this._querySelectorAll, t, vi.create((e) => e.puppeteerUtil)), !1));
		} catch (e) {
			n.error = e, n.hasError = !0;
		} finally {
			bi(n);
		}
	}
	static async queryOne(e, t) {
		let n = {
			stack: [],
			error: void 0,
			hasError: !1
		};
		try {
			let r = yi(n, await e.evaluateHandle(this._querySelector, t, vi.create((e) => e.puppeteerUtil)), !1);
			return si in r ? r.move() : null;
		} catch (e) {
			n.error = e, n.hasError = !0;
		} finally {
			bi(n);
		}
	}
	static async waitFor(e, t, n) {
		let r = {
			stack: [],
			error: void 0,
			hasError: !1
		};
		try {
			let i, a = yi(r, await (async () => {
				if (!(si in e)) {
					i = e;
					return;
				}
				return i = e.frame, await i.isolatedRealm().adoptHandle(e);
			})(), !1), { visible: o = !1, hidden: s = !1, timeout: c, signal: l } = n, u = o || s ? "raf" : n.polling;
			try {
				let e = {
					stack: [],
					error: void 0,
					hasError: !1
				};
				try {
					l?.throwIfAborted();
					let n = yi(e, await i.isolatedRealm().waitForFunction(async (e, t, n, r, i) => {
						let a = await e.createFunction(t)(r ?? document, n, e);
						return e.checkVisibility(a, i);
					}, {
						polling: u,
						root: a,
						timeout: c,
						signal: l
					}, vi.create((e) => e.puppeteerUtil), ui(this._querySelector), t, a, o ? !0 : !s && void 0), !1);
					if (l?.aborted) throw l.reason;
					return si in n ? await i.mainRealm().transferHandle(n) : null;
				} catch (t) {
					e.error = t, e.hasError = !0;
				} finally {
					bi(e);
				}
			} catch (e) {
				if (!kr(e) || e.name === "AbortError") throw e;
				let n = new (e instanceof xn ? xn : Error)(`Waiting for selector \`${t}\` failed`);
				throw n.cause = e, n;
			}
		} catch (e) {
			r.error = e, r.hasError = !0;
		} finally {
			bi(r);
		}
	}
}, Si = (e) => ["name", "role"].includes(e), Ci = /\[\s*(?<attribute>\w+)\s*=\s*(?<quote>"|')(?<value>\\.|.*?(?=\k<quote>))\k<quote>\s*\]/g, wi = (e) => {
	if (e.length > 1e4) throw Error(`Selector ${e} is too long`);
	let t = {}, n = e.replace(Ci, (e, n, r, i) => (N(Si(n), `Unknown aria attribute "${n}" in selector`), t[n] = i, ""));
	return n && !t.name && (t.name = n), t;
}, Ti = class extends xi {
	static querySelector = async (e, t, { ariaQuerySelector: n }) => await n(e, t);
	static async *queryAll(e, t) {
		let { name: n, role: r } = wi(t);
		yield* e.queryAXTree(n, r);
	}
	static queryOne = async (e, t) => await oi.first(this.queryAll(e, t)) ?? null;
}, Ei = class extends xi {
	static querySelector = (e, t, { cssQuerySelector: n }) => n(e, t);
	static querySelectorAll = (e, t, { cssQuerySelectorAll: n }) => n(e, t);
}, Di = "\"use strict\";var N=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var B=Object.getOwnPropertyNames;var Y=Object.prototype.hasOwnProperty;var l=(t,e)=>{for(var r in e)N(t,r,{get:e[r],enumerable:!0})},G=(t,e,r,o)=>{if(e&&typeof e==\"object\"||typeof e==\"function\")for(let s of B(e))!Y.call(t,s)&&s!==r&&N(t,s,{get:()=>e[s],enumerable:!(o=X(e,s))||o.enumerable});return t};var J=t=>G(N({},\"__esModule\",{value:!0}),t);var pe={};l(pe,{default:()=>he});module.exports=J(pe);var x=class extends Error{constructor(e,r){super(e,r),this.name=this.constructor.name}get[Symbol.toStringTag](){return this.constructor.name}},p=class extends x{};var c=class t{static create(e){return new t(e)}static async race(e){let r=new Set;try{let o=e.map(s=>s instanceof t?(s.#s&&r.add(s),s.valueOrThrow()):s);return await Promise.race(o)}finally{for(let o of r)o.reject(new Error(\"Timeout cleared\"))}}#e=!1;#r=!1;#o;#t;#a=new Promise(e=>{this.#t=e});#s;#i;constructor(e){e&&e.timeout>0&&(this.#i=new p(e.message),this.#s=setTimeout(()=>{this.reject(this.#i)},e.timeout))}#l(e){clearTimeout(this.#s),this.#o=e,this.#t()}resolve(e){this.#r||this.#e||(this.#e=!0,this.#l(e))}reject(e){this.#r||this.#e||(this.#r=!0,this.#l(e))}resolved(){return this.#e}finished(){return this.#e||this.#r}value(){return this.#o}#n;valueOrThrow(){return this.#n||(this.#n=(async()=>{if(await this.#a,this.#r)throw this.#o;return this.#o})()),this.#n}};var L=new Map,W=t=>{let e=L.get(t);return e||(e=new Function(`return ${t}`)(),L.set(t,e),e)};var E={};l(E,{ariaQuerySelector:()=>z,ariaQuerySelectorAll:()=>b});var z=(t,e)=>globalThis.__ariaQuerySelector(t,e),b=async function*(t,e){yield*await globalThis.__ariaQuerySelectorAll(t,e)};var v={};l(v,{cssQuerySelector:()=>K,cssQuerySelectorAll:()=>Z});var K=(t,e)=>t.querySelector(e),Z=function(t,e){return t.querySelectorAll(e)};var A={};l(A,{CustomQuerySelectorRegistry:()=>y,customQuerySelectors:()=>P});var y=class{#e=new Map;register(e,r){if(!r.queryOne&&r.queryAll){let o=r.queryAll;r.queryOne=(s,i)=>{for(let n of o(s,i))return n;return null}}else if(r.queryOne&&!r.queryAll){let o=r.queryOne;r.queryAll=(s,i)=>{let n=o(s,i);return n?[n]:[]}}else if(!r.queryOne||!r.queryAll)throw new Error(\"At least one query method must be defined.\");this.#e.set(e,{querySelector:r.queryOne,querySelectorAll:r.queryAll})}unregister(e){this.#e.delete(e)}get(e){return this.#e.get(e)}clear(){this.#e.clear()}},P=new y;var R={};l(R,{pierceQuerySelector:()=>ee,pierceQuerySelectorAll:()=>te});var ee=(t,e)=>{let r=null,o=s=>{let i=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT);do{let n=i.currentNode;n.shadowRoot&&o(n.shadowRoot),!(n instanceof ShadowRoot)&&n!==s&&!r&&n.matches(e)&&(r=n)}while(!r&&i.nextNode())};return t instanceof Document&&(t=t.documentElement),o(t),r},te=(t,e)=>{let r=[],o=s=>{let i=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT);do{let n=i.currentNode;n.shadowRoot&&o(n.shadowRoot),!(n instanceof ShadowRoot)&&n!==s&&n.matches(e)&&r.push(n)}while(i.nextNode())};return t instanceof Document&&(t=t.documentElement),o(t),r};var u=(t,e)=>{if(!t)throw new Error(e)};var w=class{#e;#r;#o;#t;constructor(e,r){this.#e=e,this.#r=r}async start(){let e=this.#t=c.create(),r=await this.#e();if(r){e.resolve(r);return}this.#o=new MutationObserver(async()=>{let o=await this.#e();o&&(e.resolve(o),await this.stop())}),this.#o.observe(this.#r,{childList:!0,subtree:!0,attributes:!0})}async stop(){u(this.#t,\"Polling never started.\"),this.#t.finished()||this.#t.reject(new Error(\"Polling stopped\")),this.#o&&(this.#o.disconnect(),this.#o=void 0)}result(){return u(this.#t,\"Polling never started.\"),this.#t.valueOrThrow()}},T=class{#e;#r;constructor(e){this.#e=e}async start(){let e=this.#r=c.create(),r=await this.#e();if(r){e.resolve(r);return}let o=async()=>{if(e.finished())return;let s=await this.#e();if(!s){window.requestAnimationFrame(o);return}e.resolve(s),await this.stop()};window.requestAnimationFrame(o)}async stop(){u(this.#r,\"Polling never started.\"),this.#r.finished()||this.#r.reject(new Error(\"Polling stopped\"))}result(){return u(this.#r,\"Polling never started.\"),this.#r.valueOrThrow()}},S=class{#e;#r;#o;#t;constructor(e,r){this.#e=e,this.#r=r}async start(){let e=this.#t=c.create(),r=await this.#e();if(r){e.resolve(r);return}this.#o=setInterval(async()=>{let o=await this.#e();o&&(e.resolve(o),await this.stop())},this.#r)}async stop(){u(this.#t,\"Polling never started.\"),this.#t.finished()||this.#t.reject(new Error(\"Polling stopped\")),this.#o&&(clearInterval(this.#o),this.#o=void 0)}result(){return u(this.#t,\"Polling never started.\"),this.#t.valueOrThrow()}};var _={};l(_,{PCombinator:()=>H,pQuerySelector:()=>fe,pQuerySelectorAll:()=>$});var a=class{static async*map(e,r){for await(let o of e)yield await r(o)}static async*flatMap(e,r){for await(let o of e)yield*r(o)}static async collect(e){let r=[];for await(let o of e)r.push(o);return r}static async first(e){for await(let r of e)return r}};var C={};l(C,{textQuerySelectorAll:()=>m});var re=new Set([\"checkbox\",\"image\",\"radio\"]),oe=t=>t instanceof HTMLSelectElement||t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement&&!re.has(t.type),se=new Set([\"SCRIPT\",\"STYLE\"]),f=t=>!se.has(t.nodeName)&&!document.head?.contains(t),I=new WeakMap,F=t=>{for(;t;)I.delete(t),t instanceof ShadowRoot?t=t.host:t=t.parentNode},j=new WeakSet,ne=new MutationObserver(t=>{for(let e of t)F(e.target)}),d=t=>{let e=I.get(t);if(e||(e={full:\"\",immediate:[]},!f(t)))return e;let r=\"\";if(oe(t))e.full=t.value,e.immediate.push(t.value),t.addEventListener(\"input\",o=>{F(o.target)},{once:!0,capture:!0});else{for(let o=t.firstChild;o;o=o.nextSibling){if(o.nodeType===Node.TEXT_NODE){e.full+=o.nodeValue??\"\",r+=o.nodeValue??\"\";continue}r&&e.immediate.push(r),r=\"\",o.nodeType===Node.ELEMENT_NODE&&(e.full+=d(o).full)}r&&e.immediate.push(r),t instanceof Element&&t.shadowRoot&&(e.full+=d(t.shadowRoot).full),j.has(t)||(ne.observe(t,{childList:!0,characterData:!0,subtree:!0}),j.add(t))}return I.set(t,e),e};var m=function*(t,e){let r=!1;for(let o of t.childNodes)if(o instanceof Element&&f(o)){let s;o.shadowRoot?s=m(o.shadowRoot,e):s=m(o,e);for(let i of s)yield i,r=!0}r||t instanceof Element&&f(t)&&d(t).full.includes(e)&&(yield t)};var k={};l(k,{checkVisibility:()=>le,pierce:()=>g,pierceAll:()=>O});var ie=[\"hidden\",\"collapse\"],le=(t,e)=>{if(!t)return e===!1;if(e===void 0)return t;let r=t.nodeType===Node.TEXT_NODE?t.parentElement:t,o=window.getComputedStyle(r),s=o&&!ie.includes(o.visibility)&&!ae(r);return e===s?t:!1};function ae(t){let e=t.getBoundingClientRect();return e.width===0||e.height===0}var ce=t=>\"shadowRoot\"in t&&t.shadowRoot instanceof ShadowRoot;function*g(t){ce(t)?yield t.shadowRoot:yield t}function*O(t){t=g(t).next().value,yield t;let e=[document.createTreeWalker(t,NodeFilter.SHOW_ELEMENT)];for(let r of e){let o;for(;o=r.nextNode();)o.shadowRoot&&(yield o.shadowRoot,e.push(document.createTreeWalker(o.shadowRoot,NodeFilter.SHOW_ELEMENT)))}}var D={};l(D,{xpathQuerySelectorAll:()=>q});var q=function*(t,e,r=-1){let s=(t.ownerDocument||document).evaluate(e,t,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE),i=[],n;for(;(n=s.iterateNext())&&(i.push(n),!(r&&i.length===r)););for(let h=0;h<i.length;h++)n=i[h],yield n,i[h]=null};var ue=/[-\\w\\P{ASCII}*]/u,H=(r=>(r.Descendent=\">>>\",r.Child=\">>>>\",r))(H||{}),V=t=>\"querySelectorAll\"in t,Q=class{#e;#r=[];#o=void 0;elements;constructor(e,r){this.elements=[e],this.#e=r,this.#t()}async run(){for(typeof this.#o==\"string\"&&this.#o.trimStart()===\":scope\"&&this.#t();this.#o!==void 0;this.#t()){let e=this.#o;typeof e==\"string\"?e[0]&&ue.test(e[0])?this.elements=a.flatMap(this.elements,async function*(r){V(r)&&(yield*r.querySelectorAll(e))}):this.elements=a.flatMap(this.elements,async function*(r){if(!r.parentElement){if(!V(r))return;yield*r.querySelectorAll(e);return}let o=0;for(let s of r.parentElement.children)if(++o,s===r)break;yield*r.parentElement.querySelectorAll(`:scope>:nth-child(${o})${e}`)}):this.elements=a.flatMap(this.elements,async function*(r){switch(e.name){case\"text\":yield*m(r,e.value);break;case\"xpath\":yield*q(r,e.value);break;case\"aria\":yield*b(r,e.value);break;default:let o=P.get(e.name);if(!o)throw new Error(`Unknown selector type: ${e.name}`);yield*o.querySelectorAll(r,e.value)}})}}#t(){if(this.#r.length!==0){this.#o=this.#r.shift();return}if(this.#e.length===0){this.#o=void 0;return}let e=this.#e.shift();switch(e){case\">>>>\":{this.elements=a.flatMap(this.elements,g),this.#t();break}case\">>>\":{this.elements=a.flatMap(this.elements,O),this.#t();break}default:this.#r=e,this.#t();break}}},M=class{#e=new WeakMap;calculate(e,r=[]){if(e===null)return r;e instanceof ShadowRoot&&(e=e.host);let o=this.#e.get(e);if(o)return[...o,...r];let s=0;for(let n=e.previousSibling;n;n=n.previousSibling)++s;let i=this.calculate(e.parentNode,[s]);return this.#e.set(e,i),[...i,...r]}},U=(t,e)=>{if(t.length+e.length===0)return 0;let[r=-1,...o]=t,[s=-1,...i]=e;return r===s?U(o,i):r<s?-1:1},de=async function*(t){let e=new Set;for await(let o of t)e.add(o);let r=new M;yield*[...e.values()].map(o=>[o,r.calculate(o)]).sort(([,o],[,s])=>U(o,s)).map(([o])=>o)},$=function(t,e){let r=JSON.parse(e);if(r.some(o=>{let s=0;return o.some(i=>(typeof i==\"string\"?++s:s=0,s>1))}))throw new Error(\"Multiple deep combinators found in sequence.\");return de(a.flatMap(r,o=>{let s=new Q(t,o);return s.run(),s.elements}))},fe=async function(t,e){for await(let r of $(t,e))return r;return null};var me=Object.freeze({...E,...A,...R,..._,...C,...k,...D,...v,Deferred:c,createFunction:W,createTextContent:d,IntervalPoller:S,isSuitableNodeForTextMatching:f,MutationPoller:w,RAFPoller:T}),he=me;\n", Oi = new class {
	#e = !1;
	#t = /* @__PURE__ */ new Set();
	append(e) {
		this.#n(() => {
			this.#t.add(e);
		});
	}
	pop(e) {
		this.#n(() => {
			this.#t.delete(e);
		});
	}
	inject(e, t = !1) {
		(this.#e || t) && e(this.#r()), this.#e = !1;
	}
	#n(e) {
		e(), this.#e = !0;
	}
	#r() {
		return `(() => {
      const module = {};
      ${Di}
      ${[...this.#t].map((e) => `(${e})(module.exports.default);`).join("")}
      return module.exports.default;
    })()`;
	}
}(), ki = new class {
	#e = /* @__PURE__ */ new Map();
	get(e) {
		let t = this.#e.get(e);
		return t ? t[1] : void 0;
	}
	register(e, t) {
		N(!this.#e.has(e), `Cannot register over existing handler: ${e}`), N(/^[a-zA-Z]+$/.test(e), "Custom query handler names may only contain [a-zA-Z]"), N(t.queryAll || t.queryOne, "At least one query method must be implemented.");
		let n = class extends xi {
			static querySelectorAll = di((e, t, n) => n.customQuerySelectors.get(PLACEHOLDER("name")).querySelectorAll(e, t), { name: JSON.stringify(e) });
			static querySelector = di((e, t, n) => n.customQuerySelectors.get(PLACEHOLDER("name")).querySelector(e, t), { name: JSON.stringify(e) });
		}, r = di((e) => {
			e.customQuerySelectors.register(PLACEHOLDER("name"), {
				queryAll: PLACEHOLDER("queryAll"),
				queryOne: PLACEHOLDER("queryOne")
			});
		}, {
			name: JSON.stringify(e),
			queryAll: t.queryAll ? ui(t.queryAll) : "undefined",
			queryOne: t.queryOne ? ui(t.queryOne) : "undefined"
		}).toString();
		this.#e.set(e, [r, n]), Oi.append(r);
	}
	unregister(e) {
		let t = this.#e.get(e);
		if (!t) throw Error(`Cannot unregister unknown handler: ${e}`);
		Oi.pop(t[0]), this.#e.delete(e);
	}
	names() {
		return [...this.#e.keys()];
	}
	clear() {
		for (let [e] of this.#e) Oi.pop(e);
		this.#e.clear();
	}
}(), Ai = class extends xi {
	static querySelector = (e, t, { pierceQuerySelector: n }) => n(e, t);
	static querySelectorAll = (e, t, { pierceQuerySelectorAll: n }) => n(e, t);
}, ji = class extends xi {
	static querySelectorAll = (e, t, { pQuerySelectorAll: n }) => n(e, t);
	static querySelector = (e, t, { pQuerySelector: n }) => n(e, t);
}, Mi = {
	attribute: /\[\s*(?:(?<namespace>\*|[-\w\P{ASCII}]*)\|)?(?<name>[-\w\P{ASCII}]+)\s*(?:(?<operator>\W?=)\s*(?<value>.+?)\s*(\s(?<caseSensitive>[iIsS]))?\s*)?\]/gu,
	id: /#(?<name>[-\w\P{ASCII}]+)/gu,
	class: /\.(?<name>[-\w\P{ASCII}]+)/gu,
	comma: /\s*,\s*/g,
	combinator: /\s*[\s>+~]\s*/g,
	"pseudo-element": /::(?<name>[-\w\P{ASCII}]+)(?:\((?<argument>¶*)\))?/gu,
	"pseudo-class": /:(?<name>[-\w\P{ASCII}]+)(?:\((?<argument>¶*)\))?/gu,
	universal: /(?:(?<namespace>\*|[-\w\P{ASCII}]*)\|)?\*/gu,
	type: /(?:(?<namespace>\*|[-\w\P{ASCII}]*)\|)?(?<name>[-\w\P{ASCII}]+)/gu
}, Ni = /* @__PURE__ */ new Set(["combinator", "comma"]), Pi = (e) => {
	switch (e) {
		case "pseudo-element":
		case "pseudo-class": return new RegExp(Mi[e].source.replace("(?<argument>¶*)", "(?<argument>.*)"), "gu");
		default: return Mi[e];
	}
};
function Fi(e, t) {
	let n = 0, r = "";
	for (; t < e.length; t++) {
		let i = e[t];
		switch (i) {
			case "(":
				++n;
				break;
			case ")": --n;
		}
		if (r += i, n === 0) return r;
	}
	return r;
}
function Ii(e, t = Mi) {
	if (!e) return [];
	let n = [e];
	for (let [e, r] of Object.entries(t)) for (let t = 0; t < n.length; t++) {
		let i = n[t];
		if (typeof i != "string") continue;
		r.lastIndex = 0;
		let a = r.exec(i);
		if (!a) continue;
		let o = a.index - 1, s = [], c = a[0], l = i.slice(0, o + 1);
		l && s.push(l), s.push({
			...a.groups,
			type: e,
			content: c
		});
		let u = i.slice(o + c.length + 1);
		u && s.push(u), n.splice(t, 1, ...s);
	}
	let r = 0;
	for (let e of n) switch (typeof e) {
		case "string": throw Error(`Unexpected sequence ${e} found at index ${r}`);
		case "object": r += e.content.length, e.pos = [r - e.content.length, r], Ni.has(e.type) && (e.content = e.content.trim() || " ");
	}
	return n;
}
var Li = /(['"])([^\\\n]*?)\1/g, Ri = /\\./g;
function zi(e, t = Mi) {
	if (e = e.trim(), e === "") return [];
	let n = [];
	e = e.replace(Ri, (e, t) => (n.push({
		value: e,
		offset: t
	}), "".repeat(e.length))), e = e.replace(Li, (e, t, r, i) => (n.push({
		value: e,
		offset: i
	}), `${t}${"".repeat(r.length)}${t}`));
	{
		let t = 0, r;
		for (; (r = e.indexOf("(", t)) > -1;) {
			let i = Fi(e, r);
			n.push({
				value: i,
				offset: r
			}), e = `${e.substring(0, r)}(${"¶".repeat(i.length - 2)})${e.substring(r + i.length)}`, t = r + i.length;
		}
	}
	let r = Ii(e, t), i = /* @__PURE__ */ new Set();
	for (let e of n.reverse()) for (let t of r) {
		let { offset: n, value: r } = e;
		if (!(t.pos[0] <= n && n + r.length <= t.pos[1])) continue;
		let { content: a } = t, o = n - t.pos[0];
		t.content = a.slice(0, o) + r + a.slice(o + r.length), t.content !== a && i.add(t);
	}
	for (let e of i) {
		let t = Pi(e.type);
		if (!t) throw Error(`Unknown token type: ${e.type}`);
		t.lastIndex = 0;
		let n = t.exec(e.content);
		if (!n) throw Error(`Unable to parse content for ${e.type}: ${e.content}`);
		Object.assign(e, n.groups);
	}
	return r;
}
function Bi(e) {
	if (Array.isArray(e)) return e.map((e) => e.content).join("");
	switch (e.type) {
		case "list": return e.list.map(Bi).join(",");
		case "relative": return e.combinator + Bi(e.right);
		case "complex": return Bi(e.left) + e.combinator + Bi(e.right);
		case "compound": return e.list.map(Bi).join("");
		default: return e.content;
	}
}
Mi.nesting = /&/g, Mi.combinator = /\s*(>>>>?|[\s>+~])\s*/g;
var Vi = /\\[\s\S]/g, Hi = (e) => e.length <= 1 ? e : ((e[0] === "\"" || e[0] === "'") && e.endsWith(e[0]) && (e = e.slice(1, -1)), e.replace(Vi, (e) => e[1]));
function Ui(e) {
	let t = !0, n = !1, r = !1, i = zi(e);
	if (i.length === 0) return [
		[],
		t,
		r,
		!1
	];
	let a = [], o = [a], s = [o], c = [];
	for (let e of i) {
		switch (e.type) {
			case "combinator":
				switch (e.content) {
					case ">>>":
						t = !1, c.length && (a.push(Bi(c)), c.splice(0)), a = [], o.push(">>>"), o.push(a);
						continue;
					case ">>>>":
						t = !1, c.length && (a.push(Bi(c)), c.splice(0)), a = [], o.push(">>>>"), o.push(a);
						continue;
				}
				break;
			case "pseudo-element":
				if (!e.name.startsWith("-p-")) break;
				t = !1, c.length && (a.push(Bi(c)), c.splice(0));
				let i = e.name.slice(3);
				i === "aria" && (n = !0), a.push({
					name: i,
					value: Hi(e.argument ?? "")
				});
				continue;
			case "pseudo-class":
				r = !0;
				break;
			case "comma":
				c.length && (a.push(Bi(c)), c.splice(0)), a = [], o = [a], s.push(o);
				continue;
		}
		c.push(e);
	}
	return c.length && a.push(Bi(c)), [
		s,
		t,
		r,
		n
	];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/common/GetQueryHandler.js
var Wi = {
	aria: Ti,
	pierce: Ai,
	xpath: class extends xi {
		static querySelectorAll = (e, t, { xpathQuerySelectorAll: n }) => n(e, t);
		static querySelector = (e, t, { xpathQuerySelectorAll: n }) => {
			for (let r of n(e, t, 1)) return r;
			return null;
		};
	},
	text: class extends xi {
		static querySelectorAll = (e, t, { textQuerySelectorAll: n }) => n(e, t);
	}
}, Gi = ["=", "/"];
function Ki(e) {
	for (let t of [ki.names().map((e) => [e, ki.get(e)]), Object.entries(Wi)]) for (let [n, r] of t) for (let t of Gi) {
		let i = `${n}${t}`;
		if (e.startsWith(i)) return e = e.slice(i.length), {
			updatedSelector: e,
			polling: n === "aria" ? "raf" : "mutation",
			QueryHandler: r
		};
	}
	try {
		let [t, n, r, i] = Ui(e);
		return n ? {
			updatedSelector: e,
			polling: r ? "raf" : "mutation",
			QueryHandler: Ei
		} : {
			updatedSelector: JSON.stringify(t),
			polling: i ? "raf" : "mutation",
			QueryHandler: ji
		};
	} catch {
		return {
			updatedSelector: e,
			polling: "mutation",
			QueryHandler: Ei
		};
	}
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/api/Frame.js
var qi = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, U = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Ji = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, Yi = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
}), W;
(function(e) {
	e.FrameNavigated = Symbol("Frame.FrameNavigated"), e.FrameSwapped = Symbol("Frame.FrameSwapped"), e.LifecycleEvent = Symbol("Frame.LifecycleEvent"), e.FrameNavigatedWithinDocument = Symbol("Frame.FrameNavigatedWithinDocument"), e.FrameDetached = Symbol("Frame.FrameDetached"), e.FrameSwappedByActivation = Symbol("Frame.FrameSwappedByActivation");
})(W ||= {});
var G = B((e) => `Attempted to use detached Frame '${e._id}'.`), Xi = (() => {
	let e = L, t = [], n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, ee, te, y;
	return class extends e {
		static {
			let b = typeof Symbol == "function" && Symbol.metadata ? Object.create(e[Symbol.metadata] ?? null) : void 0;
			n = [G], r = [G], i = [G], a = [G], o = [G], s = [G], c = [G], l = [G], u = [G], d = [G], f = [G], p = [G], m = [G], h = [G], g = [G], _ = [G], v = [G], ee = [G], te = [G], y = [G], U(this, null, n, {
				kind: "method",
				name: "frameElement",
				static: !1,
				private: !1,
				access: {
					has: (e) => "frameElement" in e,
					get: (e) => e.frameElement
				},
				metadata: b
			}, null, t), U(this, null, r, {
				kind: "method",
				name: "evaluateHandle",
				static: !1,
				private: !1,
				access: {
					has: (e) => "evaluateHandle" in e,
					get: (e) => e.evaluateHandle
				},
				metadata: b
			}, null, t), U(this, null, i, {
				kind: "method",
				name: "evaluate",
				static: !1,
				private: !1,
				access: {
					has: (e) => "evaluate" in e,
					get: (e) => e.evaluate
				},
				metadata: b
			}, null, t), U(this, null, a, {
				kind: "method",
				name: "locator",
				static: !1,
				private: !1,
				access: {
					has: (e) => "locator" in e,
					get: (e) => e.locator
				},
				metadata: b
			}, null, t), U(this, null, o, {
				kind: "method",
				name: "$",
				static: !1,
				private: !1,
				access: {
					has: (e) => "$" in e,
					get: (e) => e.$
				},
				metadata: b
			}, null, t), U(this, null, s, {
				kind: "method",
				name: "$$",
				static: !1,
				private: !1,
				access: {
					has: (e) => "$$" in e,
					get: (e) => e.$$
				},
				metadata: b
			}, null, t), U(this, null, c, {
				kind: "method",
				name: "$eval",
				static: !1,
				private: !1,
				access: {
					has: (e) => "$eval" in e,
					get: (e) => e.$eval
				},
				metadata: b
			}, null, t), U(this, null, l, {
				kind: "method",
				name: "$$eval",
				static: !1,
				private: !1,
				access: {
					has: (e) => "$$eval" in e,
					get: (e) => e.$$eval
				},
				metadata: b
			}, null, t), U(this, null, u, {
				kind: "method",
				name: "waitForSelector",
				static: !1,
				private: !1,
				access: {
					has: (e) => "waitForSelector" in e,
					get: (e) => e.waitForSelector
				},
				metadata: b
			}, null, t), U(this, null, d, {
				kind: "method",
				name: "waitForFunction",
				static: !1,
				private: !1,
				access: {
					has: (e) => "waitForFunction" in e,
					get: (e) => e.waitForFunction
				},
				metadata: b
			}, null, t), U(this, null, f, {
				kind: "method",
				name: "content",
				static: !1,
				private: !1,
				access: {
					has: (e) => "content" in e,
					get: (e) => e.content
				},
				metadata: b
			}, null, t), U(this, null, p, {
				kind: "method",
				name: "addScriptTag",
				static: !1,
				private: !1,
				access: {
					has: (e) => "addScriptTag" in e,
					get: (e) => e.addScriptTag
				},
				metadata: b
			}, null, t), U(this, null, m, {
				kind: "method",
				name: "addStyleTag",
				static: !1,
				private: !1,
				access: {
					has: (e) => "addStyleTag" in e,
					get: (e) => e.addStyleTag
				},
				metadata: b
			}, null, t), U(this, null, h, {
				kind: "method",
				name: "click",
				static: !1,
				private: !1,
				access: {
					has: (e) => "click" in e,
					get: (e) => e.click
				},
				metadata: b
			}, null, t), U(this, null, g, {
				kind: "method",
				name: "focus",
				static: !1,
				private: !1,
				access: {
					has: (e) => "focus" in e,
					get: (e) => e.focus
				},
				metadata: b
			}, null, t), U(this, null, _, {
				kind: "method",
				name: "hover",
				static: !1,
				private: !1,
				access: {
					has: (e) => "hover" in e,
					get: (e) => e.hover
				},
				metadata: b
			}, null, t), U(this, null, v, {
				kind: "method",
				name: "select",
				static: !1,
				private: !1,
				access: {
					has: (e) => "select" in e,
					get: (e) => e.select
				},
				metadata: b
			}, null, t), U(this, null, ee, {
				kind: "method",
				name: "tap",
				static: !1,
				private: !1,
				access: {
					has: (e) => "tap" in e,
					get: (e) => e.tap
				},
				metadata: b
			}, null, t), U(this, null, te, {
				kind: "method",
				name: "type",
				static: !1,
				private: !1,
				access: {
					has: (e) => "type" in e,
					get: (e) => e.type
				},
				metadata: b
			}, null, t), U(this, null, y, {
				kind: "method",
				name: "title",
				static: !1,
				private: !1,
				access: {
					has: (e) => "title" in e,
					get: (e) => e.title
				},
				metadata: b
			}, null, t), b && Object.defineProperty(this, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: b
			});
		}
		_id = qi(this, t);
		_parentId;
		_name;
		_hasStartedLoading = !1;
		constructor() {
			super();
		}
		#e;
		#t() {
			return this.#e ||= this.mainRealm().evaluateHandle(() => document), this.#e;
		}
		clearDocumentHandle() {
			this.#e = void 0;
		}
		async frameElement() {
			let e = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				let t = this.parentFrame();
				if (!t) return null;
				let n = Ji(e, await t.isolatedRealm().evaluateHandle(() => document.querySelectorAll("iframe,frame")), !1);
				for await (let e of _i(n)) {
					let n = {
						stack: [],
						error: void 0,
						hasError: !1
					};
					try {
						let r = Ji(n, e, !1);
						if ((await r.contentFrame())?._id === this._id) return await t.mainRealm().adoptHandle(r);
					} catch (e) {
						n.error = e, n.hasError = !0;
					} finally {
						Yi(n);
					}
				}
				return null;
			} catch (t) {
				e.error = t, e.hasError = !0;
			} finally {
				Yi(e);
			}
		}
		async evaluateHandle(e, ...t) {
			return e = F(this.evaluateHandle.name, e), await this.mainRealm().evaluateHandle(e, ...t);
		}
		async evaluate(e, ...t) {
			return e = F(this.evaluate.name, e), await this.mainRealm().evaluate(e, ...t);
		}
		locator(e) {
			return typeof e == "string" ? mr.create(this, e) : ur.create(this, e);
		}
		async $(e) {
			return await (await this.#t()).$(e);
		}
		async $$(e, t) {
			return await (await this.#t()).$$(e, t);
		}
		async $eval(e, t, ...n) {
			return t = F(this.$eval.name, t), await (await this.#t()).$eval(e, t, ...n);
		}
		async $$eval(e, t, ...n) {
			return t = F(this.$$eval.name, t), await (await this.#t()).$$eval(e, t, ...n);
		}
		async waitForSelector(e, t = {}) {
			let { updatedSelector: n, QueryHandler: r, polling: i } = Ki(e);
			return await r.waitFor(this, n, {
				polling: i,
				...t
			});
		}
		async waitForFunction(e, t = {}, ...n) {
			return await this.mainRealm().waitForFunction(e, t, ...n);
		}
		async content() {
			return await this.evaluate(() => {
				let e = "";
				for (let t of document.childNodes) switch (t) {
					case document.documentElement:
						e += document.documentElement.outerHTML;
						break;
					default: e += new XMLSerializer().serializeToString(t);
				}
				return e;
			});
		}
		async setFrameContent(e) {
			return await this.evaluate((e) => {
				document.open(), document.write(e), document.close();
			}, e);
		}
		name() {
			return this._name || "";
		}
		isDetached() {
			return this.detached;
		}
		get disposed() {
			return this.detached;
		}
		async addScriptTag(e) {
			let { content: t = "", type: n } = e, { path: r } = e;
			if (+!!e.url + +!!r + +!!t != 1) throw Error("Exactly one of `url`, `path`, or `content` must be specified.");
			return r && (t = await ln.value.fs.promises.readFile(r, "utf8"), t += `//# sourceURL=${r.replace(/\n/g, "")}`), n ??= "text/javascript", await this.mainRealm().transferHandle(await this.isolatedRealm().evaluateHandle(async ({ url: e, id: t, type: n, content: r }) => await new Promise((i, a) => {
				let o = document.createElement("script");
				o.type = n, o.text = r, o.addEventListener("error", (e) => {
					a(Error(e.message ?? "Could not load script"));
				}, { once: !0 }), t && (o.id = t), e ? (o.src = e, o.addEventListener("load", () => {
					i(o);
				}, { once: !0 }), document.head.appendChild(o)) : (document.head.appendChild(o), i(o));
			}), {
				...e,
				type: n,
				content: t
			}));
		}
		async addStyleTag(e) {
			let { content: t = "" } = e, { path: n } = e;
			if (+!!e.url + +!!n + +!!t != 1) throw Error("Exactly one of `url`, `path`, or `content` must be specified.");
			return n && (t = await ln.value.fs.promises.readFile(n, "utf8"), t += "/*# sourceURL=" + n.replace(/\n/g, "") + "*/", e.content = t), await this.mainRealm().transferHandle(await this.isolatedRealm().evaluateHandle(async ({ url: e, content: t }) => await new Promise((n, r) => {
				let i;
				if (!e) i = document.createElement("style"), i.appendChild(document.createTextNode(t));
				else {
					let t = document.createElement("link");
					t.rel = "stylesheet", t.href = e, i = t;
				}
				return i.addEventListener("load", () => {
					n(i);
				}, { once: !0 }), i.addEventListener("error", (e) => {
					r(Error(e.message ?? "Could not load style"));
				}, { once: !0 }), document.head.appendChild(i), i;
			}), e));
		}
		async click(e, t = {}) {
			let n = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				let r = Ji(n, await this.$(e), !1);
				N(r, `No element found for selector: ${e}`), await r.click(t), await r.dispose();
			} catch (e) {
				n.error = e, n.hasError = !0;
			} finally {
				Yi(n);
			}
		}
		async focus(e) {
			let t = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				let n = Ji(t, await this.$(e), !1);
				N(n, `No element found for selector: ${e}`), await n.focus();
			} catch (e) {
				t.error = e, t.hasError = !0;
			} finally {
				Yi(t);
			}
		}
		async hover(e) {
			let t = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				let n = Ji(t, await this.$(e), !1);
				N(n, `No element found for selector: ${e}`), await n.hover();
			} catch (e) {
				t.error = e, t.hasError = !0;
			} finally {
				Yi(t);
			}
		}
		async select(e, ...t) {
			let n = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				let r = Ji(n, await this.$(e), !1);
				return N(r, `No element found for selector: ${e}`), await r.select(...t);
			} catch (e) {
				n.error = e, n.hasError = !0;
			} finally {
				Yi(n);
			}
		}
		async tap(e) {
			let t = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				let n = Ji(t, await this.$(e), !1);
				N(n, `No element found for selector: ${e}`), await n.tap();
			} catch (e) {
				t.error = e, t.hasError = !0;
			} finally {
				Yi(t);
			}
		}
		async type(e, t, n) {
			let r = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				let i = Ji(r, await this.$(e), !1);
				N(i, `No element found for selector: ${e}`), await i.type(t, n);
			} catch (e) {
				r.error = e, r.hasError = !0;
			} finally {
				Yi(r);
			}
		}
		async title() {
			return await this.isolatedRealm().evaluate(() => document.title);
		}
	};
})(), Zi = class {
	#e;
	#t;
	constructor(e) {
		this.#e = e.code, this.#t = e.details;
	}
	get code() {
		return this.#e;
	}
	get details() {
		return this.#t;
	}
}, Qi = class {
	#e;
	#t;
	#n = /* @__PURE__ */ new WeakMap();
	constructor(e, t, n) {
		this.#e = t, this.#t = n, this.#n.set(e, t);
	}
	get id() {
		return this.#e;
	}
	get source() {
		return this.#t;
	}
	getIdForFrame(e) {
		return this.#n.get(e);
	}
	setIdForFrame(e, t) {
		this.#n.set(e, t);
	}
}, $i = class {
	devices = [];
}, ea = class extends $i {
	#e;
	#t;
	#n;
	#r = !1;
	#i = this.#o.bind(this);
	#a = /* @__PURE__ */ new Set();
	constructor(e, t, n) {
		super(), this.#e = e, this.#t = t, this.#n = n.id, this.#e.on("DeviceAccess.deviceRequestPrompted", this.#i), this.#e.on("Target.detachedFromTarget", () => {
			this.#e = null;
		}), this.#o(n);
	}
	#o(e) {
		if (e.id === this.#n) for (let t of e.devices) {
			if (this.devices.some((e) => e.id === t.id)) continue;
			let e = {
				id: t.id,
				name: t.name
			};
			this.devices.push(e);
			for (let t of this.#a) t.filter(e) && t.promise.resolve(e);
		}
	}
	async waitForDevice(e, t = {}) {
		for (let t of this.devices) if (e(t)) return t;
		let { timeout: n = this.#t.timeout() } = t, r = z.create({
			message: `Waiting for \`DeviceRequestPromptDevice\` failed: ${n}ms exceeded`,
			timeout: n
		});
		t.signal && t.signal.addEventListener("abort", () => {
			r.reject(t.signal?.reason);
		}, { once: !0 });
		let i = {
			filter: e,
			promise: r
		};
		this.#a.add(i);
		try {
			return await r.valueOrThrow();
		} finally {
			this.#a.delete(i);
		}
	}
	async select(e) {
		return N(this.#e !== null, "Cannot select device through detached session!"), N(this.devices.includes(e), "Cannot select unknown device!"), N(!this.#r, "Cannot select DeviceRequestPrompt which is already handled!"), this.#e.off("DeviceAccess.deviceRequestPrompted", this.#i), this.#r = !0, await this.#e.send("DeviceAccess.selectPrompt", {
			id: this.#n,
			deviceId: e.id
		});
	}
	async cancel() {
		return N(this.#e !== null, "Cannot cancel prompt through detached session!"), N(!this.#r, "Cannot cancel DeviceRequestPrompt which is already handled!"), this.#e.off("DeviceAccess.deviceRequestPrompted", this.#i), this.#r = !0, await this.#e.send("DeviceAccess.cancelPrompt", { id: this.#n });
	}
}, ta = class {
	#e;
	#t;
	#n = /* @__PURE__ */ new Set();
	constructor(e, t) {
		this.#e = e, this.#t = t, this.#e.on("DeviceAccess.deviceRequestPrompted", (e) => {
			this.#r(e);
		}), this.#e.on("Target.detachedFromTarget", () => {
			this.#e = null;
		});
	}
	async waitForDevicePrompt(e = {}) {
		N(this.#e !== null, "Cannot wait for device prompt through detached session!");
		let t = this.#n.size === 0, n;
		t && (n = this.#e.send("DeviceAccess.enable"));
		let { timeout: r = this.#t.timeout() } = e, i = z.create({
			message: `Waiting for \`DeviceRequestPrompt\` failed: ${r}ms exceeded`,
			timeout: r
		});
		e.signal && e.signal.addEventListener("abort", () => {
			i.reject(e.signal?.reason);
		}, { once: !0 }), this.#n.add(i);
		try {
			let [e] = await Promise.all([i.valueOrThrow(), n]);
			return e;
		} finally {
			this.#n.delete(i);
		}
	}
	#r(e) {
		if (!this.#n.size) return;
		N(this.#e !== null);
		let t = new ea(this.#e, this.#t, e);
		for (let e of this.#n) e.resolve(t);
		this.#n.clear();
	}
}, na = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, K = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, ra = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, ia = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
}), aa = function(e, t, n) {
	return typeof t == "symbol" && (t = t.description ? `[${t.description}]` : ""), Object.defineProperty(e, "name", {
		configurable: !0,
		value: n ? `${n} ${t}` : t
	});
};
function q(e, t) {
	return async function(...t) {
		if (this.realm === this.frame.isolatedRealm()) return await e.call(this, ...t);
		let n;
		this.isolatedHandle ? n = this.isolatedHandle : this.isolatedHandle = n = await this.frame.isolatedRealm().adoptHandle(this);
		let r = await e.call(n, ...t);
		return r === n ? this : r instanceof Ir ? await this.realm.transferHandle(r) : (Array.isArray(r) && await Promise.all(r.map(async (e, t, n) => {
			e instanceof Ir && (n[t] = await this.realm.transferHandle(e));
		})), r instanceof Map && await Promise.all([...r.entries()].map(async ([e, t]) => {
			t instanceof Ir && r.set(e, await this.realm.transferHandle(t));
		})), r);
	};
}
var oa = (() => {
	let e = Ir, t = [], n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, ee, te, y, b, x, ne, re, ie, ae, oe, se, ce, le, ue, de, fe;
	return class S extends e {
		static {
			let S = typeof Symbol == "function" && Symbol.metadata ? Object.create(e[Symbol.metadata] ?? null) : void 0;
			n = [B(), q], r = [B(), q], i = [B(), q], a = [B(), q], o = [B()], s = [q], l = [B(), q], u = [B(), q], d = [B(), q], f = [B(), q], p = [B(), q], m = [B(), q], h = [B(), q], g = [B(), q], _ = [B(), q], v = [B(), q], ee = [B(), q], te = [B(), q], y = [B(), q], b = [B(), q], x = [B(), q], ne = [B(), q], re = [B(), q], ie = [B(), q], ae = [B(), q], oe = [B(), q], se = [B(), q], ce = [B(), q], le = [B(), q], ue = [B(), q], de = [B(), q], fe = [B()], K(this, null, n, {
				kind: "method",
				name: "getProperty",
				static: !1,
				private: !1,
				access: {
					has: (e) => "getProperty" in e,
					get: (e) => e.getProperty
				},
				metadata: S
			}, null, t), K(this, null, r, {
				kind: "method",
				name: "getProperties",
				static: !1,
				private: !1,
				access: {
					has: (e) => "getProperties" in e,
					get: (e) => e.getProperties
				},
				metadata: S
			}, null, t), K(this, null, i, {
				kind: "method",
				name: "jsonValue",
				static: !1,
				private: !1,
				access: {
					has: (e) => "jsonValue" in e,
					get: (e) => e.jsonValue
				},
				metadata: S
			}, null, t), K(this, null, a, {
				kind: "method",
				name: "$",
				static: !1,
				private: !1,
				access: {
					has: (e) => "$" in e,
					get: (e) => e.$
				},
				metadata: S
			}, null, t), K(this, null, o, {
				kind: "method",
				name: "$$",
				static: !1,
				private: !1,
				access: {
					has: (e) => "$$" in e,
					get: (e) => e.$$
				},
				metadata: S
			}, null, t), K(this, c = { value: aa(async function(e) {
				return await this.#t(e);
			}, "#$$") }, s, {
				kind: "method",
				name: "#$$",
				static: !1,
				private: !0,
				access: {
					has: (e) => #e in e,
					get: (e) => e.#e
				},
				metadata: S
			}, null, t), K(this, null, l, {
				kind: "method",
				name: "waitForSelector",
				static: !1,
				private: !1,
				access: {
					has: (e) => "waitForSelector" in e,
					get: (e) => e.waitForSelector
				},
				metadata: S
			}, null, t), K(this, null, u, {
				kind: "method",
				name: "isVisible",
				static: !1,
				private: !1,
				access: {
					has: (e) => "isVisible" in e,
					get: (e) => e.isVisible
				},
				metadata: S
			}, null, t), K(this, null, d, {
				kind: "method",
				name: "isHidden",
				static: !1,
				private: !1,
				access: {
					has: (e) => "isHidden" in e,
					get: (e) => e.isHidden
				},
				metadata: S
			}, null, t), K(this, null, f, {
				kind: "method",
				name: "toElement",
				static: !1,
				private: !1,
				access: {
					has: (e) => "toElement" in e,
					get: (e) => e.toElement
				},
				metadata: S
			}, null, t), K(this, null, p, {
				kind: "method",
				name: "clickablePoint",
				static: !1,
				private: !1,
				access: {
					has: (e) => "clickablePoint" in e,
					get: (e) => e.clickablePoint
				},
				metadata: S
			}, null, t), K(this, null, m, {
				kind: "method",
				name: "hover",
				static: !1,
				private: !1,
				access: {
					has: (e) => "hover" in e,
					get: (e) => e.hover
				},
				metadata: S
			}, null, t), K(this, null, h, {
				kind: "method",
				name: "click",
				static: !1,
				private: !1,
				access: {
					has: (e) => "click" in e,
					get: (e) => e.click
				},
				metadata: S
			}, null, t), K(this, null, g, {
				kind: "method",
				name: "drag",
				static: !1,
				private: !1,
				access: {
					has: (e) => "drag" in e,
					get: (e) => e.drag
				},
				metadata: S
			}, null, t), K(this, null, _, {
				kind: "method",
				name: "dragEnter",
				static: !1,
				private: !1,
				access: {
					has: (e) => "dragEnter" in e,
					get: (e) => e.dragEnter
				},
				metadata: S
			}, null, t), K(this, null, v, {
				kind: "method",
				name: "dragOver",
				static: !1,
				private: !1,
				access: {
					has: (e) => "dragOver" in e,
					get: (e) => e.dragOver
				},
				metadata: S
			}, null, t), K(this, null, ee, {
				kind: "method",
				name: "drop",
				static: !1,
				private: !1,
				access: {
					has: (e) => "drop" in e,
					get: (e) => e.drop
				},
				metadata: S
			}, null, t), K(this, null, te, {
				kind: "method",
				name: "dragAndDrop",
				static: !1,
				private: !1,
				access: {
					has: (e) => "dragAndDrop" in e,
					get: (e) => e.dragAndDrop
				},
				metadata: S
			}, null, t), K(this, null, y, {
				kind: "method",
				name: "select",
				static: !1,
				private: !1,
				access: {
					has: (e) => "select" in e,
					get: (e) => e.select
				},
				metadata: S
			}, null, t), K(this, null, b, {
				kind: "method",
				name: "tap",
				static: !1,
				private: !1,
				access: {
					has: (e) => "tap" in e,
					get: (e) => e.tap
				},
				metadata: S
			}, null, t), K(this, null, x, {
				kind: "method",
				name: "touchStart",
				static: !1,
				private: !1,
				access: {
					has: (e) => "touchStart" in e,
					get: (e) => e.touchStart
				},
				metadata: S
			}, null, t), K(this, null, ne, {
				kind: "method",
				name: "touchMove",
				static: !1,
				private: !1,
				access: {
					has: (e) => "touchMove" in e,
					get: (e) => e.touchMove
				},
				metadata: S
			}, null, t), K(this, null, re, {
				kind: "method",
				name: "touchEnd",
				static: !1,
				private: !1,
				access: {
					has: (e) => "touchEnd" in e,
					get: (e) => e.touchEnd
				},
				metadata: S
			}, null, t), K(this, null, ie, {
				kind: "method",
				name: "focus",
				static: !1,
				private: !1,
				access: {
					has: (e) => "focus" in e,
					get: (e) => e.focus
				},
				metadata: S
			}, null, t), K(this, null, ae, {
				kind: "method",
				name: "type",
				static: !1,
				private: !1,
				access: {
					has: (e) => "type" in e,
					get: (e) => e.type
				},
				metadata: S
			}, null, t), K(this, null, oe, {
				kind: "method",
				name: "press",
				static: !1,
				private: !1,
				access: {
					has: (e) => "press" in e,
					get: (e) => e.press
				},
				metadata: S
			}, null, t), K(this, null, se, {
				kind: "method",
				name: "boundingBox",
				static: !1,
				private: !1,
				access: {
					has: (e) => "boundingBox" in e,
					get: (e) => e.boundingBox
				},
				metadata: S
			}, null, t), K(this, null, ce, {
				kind: "method",
				name: "boxModel",
				static: !1,
				private: !1,
				access: {
					has: (e) => "boxModel" in e,
					get: (e) => e.boxModel
				},
				metadata: S
			}, null, t), K(this, null, le, {
				kind: "method",
				name: "screenshot",
				static: !1,
				private: !1,
				access: {
					has: (e) => "screenshot" in e,
					get: (e) => e.screenshot
				},
				metadata: S
			}, null, t), K(this, null, ue, {
				kind: "method",
				name: "isIntersectingViewport",
				static: !1,
				private: !1,
				access: {
					has: (e) => "isIntersectingViewport" in e,
					get: (e) => e.isIntersectingViewport
				},
				metadata: S
			}, null, t), K(this, null, de, {
				kind: "method",
				name: "scrollIntoView",
				static: !1,
				private: !1,
				access: {
					has: (e) => "scrollIntoView" in e,
					get: (e) => e.scrollIntoView
				},
				metadata: S
			}, null, t), K(this, null, fe, {
				kind: "method",
				name: "asLocator",
				static: !1,
				private: !1,
				access: {
					has: (e) => "asLocator" in e,
					get: (e) => e.asLocator
				},
				metadata: S
			}, null, t), S && Object.defineProperty(this, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: S
			});
		}
		isolatedHandle = na(this, t);
		handle;
		constructor(e) {
			super(), this.handle = e, this[si] = !0;
		}
		get id() {
			return this.handle.id;
		}
		get disposed() {
			return this.handle.disposed;
		}
		async getProperty(e) {
			return await this.handle.getProperty(e);
		}
		async getProperties() {
			return await this.handle.getProperties();
		}
		async evaluate(e, ...t) {
			return e = F(this.evaluate.name, e), await this.handle.evaluate(e, ...t);
		}
		async evaluateHandle(e, ...t) {
			return e = F(this.evaluateHandle.name, e), await this.handle.evaluateHandle(e, ...t);
		}
		async jsonValue() {
			return await this.handle.jsonValue();
		}
		toString() {
			return this.handle.toString();
		}
		remoteObject() {
			return this.handle.remoteObject();
		}
		async dispose() {
			await Promise.all([this.handle.dispose(), this.isolatedHandle?.dispose()]);
		}
		asElement() {
			return this;
		}
		async $(e) {
			let { updatedSelector: t, QueryHandler: n } = Ki(e);
			return await n.queryOne(this, t);
		}
		async $$(e, t) {
			return t?.isolate === !1 ? await this.#t(e) : await this.#e(e);
		}
		get #e() {
			return c.value;
		}
		async #t(e) {
			let { updatedSelector: t, QueryHandler: n } = Ki(e);
			return await oi.collect(n.queryAll(this, t));
		}
		async $eval(e, t, ...n) {
			let r = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				t = F(this.$eval.name, t);
				let i = ra(r, await this.$(e), !1);
				if (!i) throw Error(`Error: failed to find element matching selector "${e}"`);
				return await i.evaluate(t, ...n);
			} catch (e) {
				r.error = e, r.hasError = !0;
			} finally {
				ia(r);
			}
		}
		async $$eval(e, t, ...n) {
			let r = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				t = F(this.$$eval.name, t);
				let i = await this.$$(e), a = ra(r, await this.evaluateHandle((e, ...t) => t, ...i), !1), [o] = await Promise.all([a.evaluate(t, ...n), ...i.map((e) => e.dispose())]);
				return o;
			} catch (e) {
				r.error = e, r.hasError = !0;
			} finally {
				ia(r);
			}
		}
		async waitForSelector(e, t = {}) {
			let { updatedSelector: n, QueryHandler: r, polling: i } = Ki(e);
			return await r.waitFor(this, n, {
				polling: i,
				...t
			});
		}
		async #n(e) {
			return await this.evaluate(async (e, t, n) => !!t.checkVisibility(e, n), vi.create((e) => e.puppeteerUtil), e);
		}
		async isVisible() {
			return await this.#n(!0);
		}
		async isHidden() {
			return await this.#n(!1);
		}
		async toElement(e) {
			if (!await this.evaluate((e, t) => e.nodeName === t.toUpperCase(), e)) throw Error(`Element is not a(n) \`${e}\` element`);
			return this;
		}
		async clickablePoint(e) {
			let t = await this.#r();
			if (!t) throw Error("Node is either not clickable or not an Element");
			return e === void 0 ? {
				x: t.x + t.width / 2,
				y: t.y + t.height / 2
			} : {
				x: t.x + e.x,
				y: t.y + e.y
			};
		}
		async hover() {
			await this.scrollIntoViewIfNeeded();
			let { x: e, y: t } = await this.clickablePoint();
			await this.frame.page().mouse.move(e, t);
		}
		async click(e = {}) {
			await this.scrollIntoViewIfNeeded();
			let { x: t, y: n } = await this.clickablePoint(e.offset);
			try {
				await this.frame.page().mouse.click(t, n, e);
			} finally {
				e.debugHighlight && await this.frame.page().evaluate((e, t) => {
					let n = document.createElement("div");
					n.innerHTML = `<style>
        @scope {
          :scope {
              position: fixed;
              left: ${e}px;
              top: ${t}px;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              animation: colorChange 10s 1 normal;
              animation-fill-mode: forwards;
          }

          @keyframes colorChange {
              from {
                  background-color: red;
              }
              to {
                  background-color: #FADADD00;
              }
          }
        }
      </style>`, n.addEventListener("animationend", () => {
						n.remove();
					}, { once: !0 }), document.body.append(n);
				}, t, n);
			}
		}
		async drag(e) {
			await this.scrollIntoViewIfNeeded();
			let t = this.frame.page();
			if (t.isDragInterceptionEnabled()) {
				let n = await this.clickablePoint();
				return e instanceof S && (e = await e.clickablePoint()), await t.mouse.drag(n, e);
			}
			try {
				t._isDragging || (t._isDragging = !0, await this.hover(), await t.mouse.down()), e instanceof S ? await e.hover() : await t.mouse.move(e.x, e.y);
			} catch (e) {
				throw t._isDragging = !1, e;
			}
		}
		async dragEnter(e = {
			items: [],
			dragOperationsMask: 1
		}) {
			let t = this.frame.page();
			await this.scrollIntoViewIfNeeded();
			let n = await this.clickablePoint();
			await t.mouse.dragEnter(n, e);
		}
		async dragOver(e = {
			items: [],
			dragOperationsMask: 1
		}) {
			let t = this.frame.page();
			await this.scrollIntoViewIfNeeded();
			let n = await this.clickablePoint();
			await t.mouse.dragOver(n, e);
		}
		async drop(e = {
			items: [],
			dragOperationsMask: 1
		}) {
			let t = this.frame.page();
			if ("items" in e) {
				await this.scrollIntoViewIfNeeded();
				let n = await this.clickablePoint();
				await t.mouse.drop(n, e);
			} else await e.drag(this), t._isDragging = !1, await t.mouse.up();
		}
		async dragAndDrop(e, t) {
			let n = this.frame.page();
			N(n.isDragInterceptionEnabled(), "Drag Interception is not enabled!"), await this.scrollIntoViewIfNeeded();
			let r = await this.clickablePoint(), i = await e.clickablePoint();
			await n.mouse.dragAndDrop(r, i, t);
		}
		async select(...e) {
			for (let t of e) N(jn(t), "Values must be strings. Found value \"" + t + "\" of type \"" + typeof t + "\"");
			return await this.evaluate((e, t) => {
				let n = new Set(t);
				if (!(e instanceof HTMLSelectElement)) throw Error("Element is not a <select> element.");
				let r = /* @__PURE__ */ new Set();
				if (e.multiple) for (let t of e.options) t.selected = n.has(t.value), t.selected && r.add(t.value);
				else {
					for (let t of e.options) t.selected = !1;
					for (let t of e.options) if (n.has(t.value)) {
						t.selected = !0, r.add(t.value);
						break;
					}
				}
				return e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 })), [...r.values()];
			}, e);
		}
		async tap() {
			await this.scrollIntoViewIfNeeded();
			let { x: e, y: t } = await this.clickablePoint();
			await this.frame.page().touchscreen.tap(e, t);
		}
		async touchStart() {
			await this.scrollIntoViewIfNeeded();
			let { x: e, y: t } = await this.clickablePoint();
			return await this.frame.page().touchscreen.touchStart(e, t);
		}
		async touchMove(e) {
			await this.scrollIntoViewIfNeeded();
			let { x: t, y: n } = await this.clickablePoint();
			if (e) return await e.move(t, n);
			await this.frame.page().touchscreen.touchMove(t, n);
		}
		async touchEnd() {
			await this.scrollIntoViewIfNeeded(), await this.frame.page().touchscreen.touchEnd();
		}
		async focus() {
			await this.evaluate((e) => {
				if (!(e instanceof HTMLElement)) throw Error("Cannot focus non-HTMLElement");
				return e.focus();
			});
		}
		async type(e, t) {
			await this.focus(), await this.frame.page().keyboard.type(e, t);
		}
		async press(e, t) {
			await this.focus(), await this.frame.page().keyboard.press(e, t);
		}
		async #r() {
			let e = await this.evaluate((e) => e instanceof Element ? [...e.getClientRects()].map((e) => ({
				x: e.x,
				y: e.y,
				width: e.width,
				height: e.height
			})) : null);
			if (!e?.length) return null;
			await this.#i(e);
			let t = this.frame, n;
			for (; n = t?.parentFrame();) {
				let r = {
					stack: [],
					error: void 0,
					hasError: !1
				};
				try {
					let i = ra(r, await t.frameElement(), !1);
					if (!i) throw Error("Unsupported frame type");
					let a = await i.evaluate((e) => {
						if (e.getClientRects().length === 0) return null;
						let t = e.getBoundingClientRect(), n = window.getComputedStyle(e);
						return {
							left: t.left + parseInt(n.paddingLeft, 10) + parseInt(n.borderLeftWidth, 10),
							top: t.top + parseInt(n.paddingTop, 10) + parseInt(n.borderTopWidth, 10)
						};
					});
					if (!a) return null;
					for (let t of e) t.x += a.left, t.y += a.top;
					await i.#i(e), t = n;
				} catch (e) {
					r.error = e, r.hasError = !0;
				} finally {
					ia(r);
				}
			}
			let r = e.find((e) => e.width >= 1 && e.height >= 1);
			return r ? {
				x: r.x,
				y: r.y,
				height: r.height,
				width: r.width
			} : null;
		}
		async #i(e) {
			let { documentWidth: t, documentHeight: n } = await this.frame.isolatedRealm().evaluate(() => ({
				documentWidth: document.documentElement.clientWidth,
				documentHeight: document.documentElement.clientHeight
			}));
			for (let r of e) sa(r, t, n);
		}
		async boundingBox() {
			let e = await this.evaluate((e) => {
				if (!(e instanceof Element) || e.getClientRects().length === 0) return null;
				let t = e.getBoundingClientRect();
				return {
					x: t.x,
					y: t.y,
					width: t.width,
					height: t.height
				};
			});
			if (!e) return null;
			let t = await this.#a();
			return t ? {
				x: e.x + t.x,
				y: e.y + t.y,
				height: e.height,
				width: e.width
			} : null;
		}
		async boxModel() {
			let e = await this.evaluate((e) => {
				if (!(e instanceof Element) || e.getClientRects().length === 0) return null;
				let t = e.getBoundingClientRect(), n = window.getComputedStyle(e), r = {
					padding: {
						left: parseInt(n.paddingLeft, 10),
						top: parseInt(n.paddingTop, 10),
						right: parseInt(n.paddingRight, 10),
						bottom: parseInt(n.paddingBottom, 10)
					},
					margin: {
						left: -parseInt(n.marginLeft, 10),
						top: -parseInt(n.marginTop, 10),
						right: -parseInt(n.marginRight, 10),
						bottom: -parseInt(n.marginBottom, 10)
					},
					border: {
						left: parseInt(n.borderLeft, 10),
						top: parseInt(n.borderTop, 10),
						right: parseInt(n.borderRight, 10),
						bottom: parseInt(n.borderBottom, 10)
					}
				}, i = [
					{
						x: t.left,
						y: t.top
					},
					{
						x: t.left + t.width,
						y: t.top
					},
					{
						x: t.left + t.width,
						y: t.top + t.height
					},
					{
						x: t.left,
						y: t.top + t.height
					}
				], a = o(i, r.border);
				return {
					content: o(a, r.padding),
					padding: a,
					border: i,
					margin: o(i, r.margin),
					width: t.width,
					height: t.height
				};
				function o(e, t) {
					return [
						{
							x: e[0].x + t.left,
							y: e[0].y + t.top
						},
						{
							x: e[1].x - t.right,
							y: e[1].y + t.top
						},
						{
							x: e[2].x - t.right,
							y: e[2].y - t.bottom
						},
						{
							x: e[3].x + t.left,
							y: e[3].y - t.bottom
						}
					];
				}
			});
			if (!e) return null;
			let t = await this.#a();
			if (!t) return null;
			for (let n of [
				"content",
				"padding",
				"border",
				"margin"
			]) for (let r of e[n]) r.x += t.x, r.y += t.y;
			return e;
		}
		async #a() {
			let e = {
				x: 0,
				y: 0
			}, t = this.frame, n;
			for (; n = t?.parentFrame();) {
				let r = {
					stack: [],
					error: void 0,
					hasError: !1
				};
				try {
					let i = ra(r, await t.frameElement(), !1);
					if (!i) throw Error("Unsupported frame type");
					let a = await i.evaluate((e) => {
						if (e.getClientRects().length === 0) return null;
						let t = e.getBoundingClientRect(), n = window.getComputedStyle(e);
						return {
							left: t.left + parseInt(n.paddingLeft, 10) + parseInt(n.borderLeftWidth, 10),
							top: t.top + parseInt(n.paddingTop, 10) + parseInt(n.borderTopWidth, 10)
						};
					});
					if (!a) return null;
					e.x += a.left, e.y += a.top, t = n;
				} catch (e) {
					r.error = e, r.hasError = !0;
				} finally {
					ia(r);
				}
			}
			return e;
		}
		async screenshot(e = {}) {
			let { scrollIntoView: t = !0, clip: n } = e, r = this.frame.page();
			t && await this.scrollIntoViewIfNeeded();
			let i = await this.#o(), [a, o] = await this.evaluate(() => {
				if (!window.visualViewport) throw Error("window.visualViewport is not supported.");
				return [window.visualViewport.pageLeft, window.visualViewport.pageTop];
			});
			return i.x += a, i.y += o, n && (i.x += n.x, i.y += n.y, i.height = n.height, i.width = n.width), await r.screenshot({
				...e,
				clip: i
			});
		}
		async #o() {
			let e = await this.boundingBox();
			return N(e, "Node is either not visible or not an HTMLElement"), N(e.width !== 0, "Node has 0 width."), N(e.height !== 0, "Node has 0 height."), e;
		}
		async assertConnectedElement() {
			let e = await this.evaluate(async (e) => {
				if (!e.isConnected) return "Node is detached from document";
				if (e.nodeType !== Node.ELEMENT_NODE) return "Node is not of type HTMLElement";
			});
			if (e) throw Error(e);
		}
		async scrollIntoViewIfNeeded() {
			await this.isIntersectingViewport({ threshold: 1 }) || await this.scrollIntoView();
		}
		async isIntersectingViewport(e = {}) {
			let t = {
				stack: [],
				error: void 0,
				hasError: !1
			};
			try {
				await this.assertConnectedElement();
				let n = await this.#s();
				return await (ra(t, n && await n.#c(), !1) ?? this).evaluate(async (e, t) => {
					let n = await new Promise((t) => {
						let n = new IntersectionObserver((e) => {
							t(e[0].intersectionRatio), n.disconnect();
						});
						n.observe(e);
					});
					return t === 1 ? n === 1 : n > t;
				}, e.threshold ?? 0);
			} catch (e) {
				t.error = e, t.hasError = !0;
			} finally {
				ia(t);
			}
		}
		async scrollIntoView() {
			await this.assertConnectedElement(), await this.evaluate(async (e) => {
				e.scrollIntoView({
					block: "center",
					inline: "center",
					behavior: "instant"
				});
			});
		}
		asLocator() {
			return mr.createFromHandle(this.frame, this);
		}
		async #s() {
			return await this.evaluate((e) => e instanceof SVGElement) ? this : null;
		}
		async #c() {
			return await this.evaluateHandle((e) => e instanceof SVGSVGElement ? e : e.ownerSVGElement);
		}
	};
})();
function sa(e, t, n) {
	e.width = Math.max(e.x >= 0 ? Math.min(t - e.x, e.width) : Math.min(t, e.width + e.x), 0), e.height = Math.max(e.y >= 0 ? Math.min(n - e.y, e.height) : Math.min(n, e.height + e.y), 0), e.x = Math.max(e.x, 0), e.y = Math.max(e.y, 0);
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/cdp/utils.js
function ca(e, t, n) {
	let r = [];
	for (let e of t) r.push(fa(e));
	let i = [];
	if (e.stackTrace) for (let t of e.stackTrace.callFrames) i.push({
		url: t.url,
		lineNumber: t.lineNumber,
		columnNumber: t.columnNumber
	});
	return new Dr(va(e.type), r.join(" "), t, i, void 0, e.stackTrace, n);
}
function la(e) {
	let t, n;
	if (!e.exception) t = "Error", n = e.text;
	else if ((e.exception.type !== "object" || e.exception.subtype !== "error") && !e.exception.objectId) return ma(e.exception);
	else {
		let r = ua(e);
		t = r.name, n = r.message;
	}
	let r = n.split("\n").length, i = Error(n);
	i.name = t;
	let a = i.stack.split("\n"), o = a.splice(0, r);
	if (a.shift(), e.stackTrace && a.length < Error.stackTraceLimit) for (let t of e.stackTrace.callFrames.reverse()) {
		if (kn.isPuppeteerURL(t.url) && t.url !== kn.INTERNAL_URL) {
			let e = kn.parse(t.url);
			a.unshift(`    at ${t.functionName || e.functionName} (${e.functionName} at ${e.siteString}, <anonymous>:${t.lineNumber}:${t.columnNumber})`);
		} else a.push(`    at ${t.functionName || "<anonymous>"} (${t.url}:${t.lineNumber}:${t.columnNumber})`);
		if (a.length >= Error.stackTraceLimit) break;
	}
	return i.stack = [...o, ...a].join("\n"), i;
}
var ua = (e) => {
	let t = "", n, r = e.exception?.description?.split("\n    at ") ?? [], i = Math.min(e.stackTrace?.callFrames.length ?? 0, r.length - 1);
	return r.splice(-i, i), e.exception?.className && (t = e.exception.className), n = r.join("\n"), t && n.startsWith(`${t}: `) && (n = n.slice(t.length + 2)), {
		message: n,
		name: t
	};
};
function da(e) {
	let t, n;
	if (!e.exception) t = "Error", n = e.text;
	else if ((e.exception.type !== "object" || e.exception.subtype !== "error") && !e.exception.objectId) return ma(e.exception);
	else {
		let r = ua(e);
		t = r.name, n = r.message;
	}
	let r = Error(n);
	r.name = t;
	let i = r.message.split("\n").length, a = r.stack.split("\n").splice(0, i), o = [];
	if (e.stackTrace) {
		for (let t of e.stackTrace.callFrames) if (o.push(`    at ${t.functionName || "<anonymous>"} (${t.url}:${t.lineNumber + 1}:${t.columnNumber + 1})`), o.length >= Error.stackTraceLimit) break;
	}
	return r.stack = [...a, ...o].join("\n"), r;
}
function fa(e) {
	let t = e.remoteObject();
	return t.objectId ? pa(e) : ma(t);
}
function pa(e) {
	let t = e.remoteObject();
	N(t.objectId, "Cannot extract value when no objectId is given");
	let n = t.description ?? "";
	if (t.subtype === "error" && n) {
		let e = n.indexOf("\n");
		return e === -1 ? n : n.slice(0, e);
	}
	return `[${t.subtype || t.type} ${t.className}]`;
}
function ma(e) {
	if (N(!e.objectId, "Cannot extract value when objectId is given"), e.unserializableValue) {
		if (e.type === "bigint") return BigInt(e.unserializableValue.replace("n", ""));
		switch (e.unserializableValue) {
			case "-0": return -0;
			case "NaN": return NaN;
			case "Infinity": return Infinity;
			case "-Infinity": return -Infinity;
			default: throw Error("Unsupported unserializable value: " + e.unserializableValue);
		}
	}
	return e.value;
}
function ha(e, t, n) {
	globalThis[t] || Object.assign(globalThis, { [t](...r) {
		let i = globalThis[t];
		i.args ??= /* @__PURE__ */ new Map(), i.callbacks ??= /* @__PURE__ */ new Map();
		let a = (i.lastSeq ?? 0) + 1;
		return i.lastSeq = a, i.args.set(a, r), globalThis[n + t](JSON.stringify({
			type: e,
			name: t,
			seq: a,
			args: r,
			isTrivial: !r.some((e) => e instanceof Node)
		})), new Promise((e, t) => {
			i.callbacks.set(a, {
				resolve(t) {
					i.args.delete(a), e(t);
				},
				reject(e) {
					i.args.delete(a), t(e);
				}
			});
		});
	} });
}
var ga = "puppeteer_";
function _a(e, t) {
	return Nn(ha, e, t, ga);
}
function va(e) {
	switch (e) {
		case "warning": return "warn";
		default: return e;
	}
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/cdp/JSHandle.js
var ya = class extends Ir {
	#e = !1;
	#t;
	#n;
	constructor(e, t) {
		super(), this.#n = e, this.#t = t;
	}
	get disposed() {
		return this.#e;
	}
	get realm() {
		return this.#n;
	}
	get client() {
		return this.realm.environment.client;
	}
	async jsonValue() {
		if (!this.#t.objectId) return ma(this.#t);
		let e = await this.evaluate((e) => e);
		if (e === void 0) throw Error("Could not serialize referenced object");
		return e;
	}
	asElement() {
		return null;
	}
	async dispose() {
		this.#e || (this.#e = !0, await ba(this.client, this.#t));
	}
	toString() {
		return this.#t.objectId ? "JSHandle@" + (this.#t.subtype || this.#t.type) : "JSHandle:" + ma(this.#t);
	}
	get id() {
		return this.#t.objectId;
	}
	remoteObject() {
		return this.#t;
	}
	async getProperties() {
		let e = await this.client.send("Runtime.getProperties", {
			objectId: this.#t.objectId,
			ownProperties: !0
		}), t = /* @__PURE__ */ new Map();
		for (let n of e.result) n.enumerable && n.value && t.set(n.name, this.#n.createCdpHandle(n.value));
		return t;
	}
};
async function ba(e, t) {
	t.objectId && await e.send("Runtime.releaseObject", { objectId: t.objectId }).catch((e) => {
		P(e);
	});
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/cdp/ElementHandle.js
var xa = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, Sa = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, Ca = /* @__PURE__ */ new Set(["StaticText", "InlineTextBox"]), wa = (() => {
	let e = oa, t = [], n, r, i, a;
	return class extends e {
		static {
			let o = typeof Symbol == "function" && Symbol.metadata ? Object.create(e[Symbol.metadata] ?? null) : void 0;
			n = [B()], r = [B(), q], i = [B(), q], a = [B()], Sa(this, null, n, {
				kind: "method",
				name: "contentFrame",
				static: !1,
				private: !1,
				access: {
					has: (e) => "contentFrame" in e,
					get: (e) => e.contentFrame
				},
				metadata: o
			}, null, t), Sa(this, null, r, {
				kind: "method",
				name: "scrollIntoView",
				static: !1,
				private: !1,
				access: {
					has: (e) => "scrollIntoView" in e,
					get: (e) => e.scrollIntoView
				},
				metadata: o
			}, null, t), Sa(this, null, i, {
				kind: "method",
				name: "uploadFile",
				static: !1,
				private: !1,
				access: {
					has: (e) => "uploadFile" in e,
					get: (e) => e.uploadFile
				},
				metadata: o
			}, null, t), Sa(this, null, a, {
				kind: "method",
				name: "autofill",
				static: !1,
				private: !1,
				access: {
					has: (e) => "autofill" in e,
					get: (e) => e.autofill
				},
				metadata: o
			}, null, t), o && Object.defineProperty(this, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: o
			});
		}
		#e = xa(this, t);
		constructor(e, t) {
			super(new ya(e, t));
		}
		get realm() {
			return this.handle.realm;
		}
		get client() {
			return this.handle.client;
		}
		remoteObject() {
			return this.handle.remoteObject();
		}
		get #t() {
			return this.frame._frameManager;
		}
		get frame() {
			return this.realm.environment;
		}
		async contentFrame() {
			let e = await this.client.send("DOM.describeNode", { objectId: this.id });
			return typeof e.node.frameId == "string" ? this.#t.frame(e.node.frameId) : null;
		}
		async scrollIntoView() {
			await this.assertConnectedElement();
			try {
				await this.client.send("DOM.scrollIntoViewIfNeeded", { objectId: this.id });
			} catch (e) {
				P(e), await super.scrollIntoView();
			}
		}
		async uploadFile(...e) {
			let t = await this.evaluate((e) => e.multiple);
			N(e.length <= 1 || t, "Multiple file uploads only work with <input type=file multiple>");
			let n = ln.value.path;
			if (n && (e = e.map((e) => n.win32.isAbsolute(e) || n.posix.isAbsolute(e) ? e : n.resolve(e))), e.length === 0) {
				await this.evaluate((e) => {
					e.files = new DataTransfer().files, e.dispatchEvent(new Event("input", {
						bubbles: !0,
						composed: !0
					})), e.dispatchEvent(new Event("change", { bubbles: !0 }));
				});
				return;
			}
			let { node: { backendNodeId: r } } = await this.client.send("DOM.describeNode", { objectId: this.id });
			await this.client.send("DOM.setFileInputFiles", {
				objectId: this.id,
				files: e,
				backendNodeId: r
			});
		}
		async autofill(e) {
			let t = (await this.client.send("DOM.describeNode", { objectId: this.handle.id })).node.backendNodeId, n = this.frame._id;
			await this.client.send("Autofill.trigger", {
				fieldId: t,
				frameId: n,
				card: e.creditCard,
				address: e.address
			});
		}
		async *queryAXTree(e, t) {
			let { nodes: n } = await this.client.send("Accessibility.queryAXTree", {
				objectId: this.id,
				accessibleName: e,
				role: t
			}), r = n.filter((e) => !(e.ignored || !e.role || Ca.has(e.role.value)));
			return yield* oi.map(r, (e) => this.realm.adoptBackendNode(e.backendDOMNodeId));
		}
		async backendNodeId() {
			if (this.#e) return this.#e;
			let { node: e } = await this.client.send("DOM.describeNode", { objectId: this.handle.id });
			return this.#e = e.backendNodeId, this.#e;
		}
	};
})(), Ta = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, Ea = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
}), Da = new zr("__ariaQuerySelector", Ti.queryOne, ""), Oa = new zr("__ariaQuerySelectorAll", (async (e, t) => {
	let n = Ti.queryAll(e, t);
	return await e.realm.evaluateHandle((...e) => e, ...await oi.collect(n));
}), ""), ka = class extends L {
	#e;
	#t;
	#n;
	#r;
	#i = new rn();
	constructor(e, t, n) {
		super(), this.#e = e, this.#t = n, this.#n = t.id, t.name && (this.#r = t.name);
		let r = this.#i.use(new L(this.#e));
		r.on("Runtime.bindingCalled", this.#c.bind(this)), r.on("Runtime.executionContextDestroyed", async (e) => {
			e.executionContextId === this.#n && this[j]();
		}), r.on("Runtime.executionContextsCleared", async () => {
			this[j]();
		}), r.on("Runtime.consoleAPICalled", this.#l.bind(this)), r.on(R.Disconnected, () => {
			this[j]();
		});
	}
	#a = /* @__PURE__ */ new Map();
	#o = new Zn();
	async #s(e) {
		let t = {
			stack: [],
			error: void 0,
			hasError: !1
		};
		try {
			if (this.#a.has(e.name)) return;
			Ta(t, await this.#o.acquire(), !1);
			try {
				await this.#e.send("Runtime.addBinding", this.#r ? {
					name: ga + e.name,
					executionContextName: this.#r
				} : {
					name: ga + e.name,
					executionContextId: this.#n
				}), await this.evaluate(ha, "internal", e.name, ga), this.#a.set(e.name, e);
			} catch (e) {
				if (e instanceof Error && (e.message.includes("Execution context was destroyed") || e.message.includes("Cannot find context with specified id"))) return;
				P(e);
			}
		} catch (e) {
			t.error = e, t.hasError = !0;
		} finally {
			Ea(t);
		}
	}
	async #c(e) {
		if (e.executionContextId !== this.#n) return;
		let t;
		try {
			t = JSON.parse(e.payload);
		} catch {
			return;
		}
		let { type: n, name: r, seq: i, args: a, isTrivial: o } = t;
		if (n !== "internal") {
			this.emit("bindingcalled", e);
			return;
		}
		if (!this.#a.has(r)) {
			this.emit("bindingcalled", e);
			return;
		}
		try {
			await this.#a.get(r)?.run(this, i, a, o);
		} catch (e) {
			P(e);
		}
	}
	get id() {
		return this.#n;
	}
	#l(e) {
		e.executionContextId === this.#n && this.emit("consoleapicalled", e);
	}
	#u = !1;
	#d;
	get puppeteerUtil() {
		let e = Promise.resolve();
		return this.#u ||= (e = Promise.all([this.#f(Da), this.#f(Oa)]), !0), Oi.inject((t) => {
			this.#d && this.#d.then((e) => {
				e.dispose();
			}), this.#d = e.then(() => this.evaluateHandle(t));
		}, !this.#d), this.#d;
	}
	async #f(e) {
		try {
			await this.#s(e);
		} catch (e) {
			P(e);
		}
	}
	async evaluate(e, ...t) {
		return await this.#p(!0, e, ...t);
	}
	async evaluateHandle(e, ...t) {
		return await this.#p(!1, e, ...t);
	}
	async #p(e, t, ...n) {
		let r = Vn(An(t)?.toString() ?? kn.INTERNAL_URL);
		if (jn(t)) {
			let n = this.#n, i = t, a = Bn.test(i) ? i : `${i}\n${r}\n`, { exceptionDetails: o, result: s } = await this.#e.send("Runtime.evaluate", {
				expression: a,
				contextId: n,
				returnByValue: e,
				awaitPromise: !0,
				userGesture: !0
			}).catch(Aa);
			if (o) throw la(o);
			return e ? ma(s) : this.#t.createCdpHandle(s);
		}
		let i = ui(t), a = Bn.test(i) ? i : `${i}\n${r}\n`, o;
		try {
			o = this.#e.send("Runtime.callFunctionOn", {
				functionDeclaration: a,
				executionContextId: this.#n,
				arguments: n.some((e) => e instanceof vi) ? await Promise.all(n.map((e) => l(this, e))) : n.map((e) => u(this, e)),
				returnByValue: e,
				awaitPromise: !0,
				userGesture: !0
			});
		} catch (e) {
			throw e instanceof TypeError && e.message.startsWith("Converting circular structure to JSON") && (e.message += " Recursive objects are not allowed."), e;
		}
		let { exceptionDetails: s, result: c } = await o.catch(Aa);
		if (s) throw la(s);
		if (e) return ma(c);
		return this.#t.createCdpHandle(c);
		async function l(e, t) {
			return t instanceof vi && (t = await t.get(e)), u(e, t);
		}
		function u(e, t) {
			if (typeof t == "bigint") return { unserializableValue: `${t.toString()}n` };
			if (Object.is(t, -0)) return { unserializableValue: "-0" };
			if (Object.is(t, Infinity)) return { unserializableValue: "Infinity" };
			if (Object.is(t, -Infinity)) return { unserializableValue: "-Infinity" };
			if (Object.is(t, NaN)) return { unserializableValue: "NaN" };
			let n = t && (t instanceof ya || t instanceof wa) ? t : null;
			if (n) {
				if (n.realm !== e.#t) throw Error("JSHandles can be evaluated only in the context they were created!");
				if (n.disposed) throw Error("JSHandle is disposed!");
				return n.remoteObject().unserializableValue ? { unserializableValue: n.remoteObject().unserializableValue } : n.remoteObject().objectId ? { objectId: n.remoteObject().objectId } : { value: n.remoteObject().value };
			}
			return { value: t };
		}
	}
	[j]() {
		this.#i.dispose(), this.emit("disposed", void 0), super[j]();
	}
}, Aa = (e) => {
	if (e.message.includes("Object reference chain is too long") || e.message.includes("Object couldn't be returned by value")) return { result: { type: "undefined" } };
	throw e.message.endsWith("Cannot find context with specified id") || e.message.endsWith("Inspected target navigated or closed") ? Error("Execution context was destroyed, most likely because of a navigation.") : e;
}, ja = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, Ma = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
}), Na = class {
	#e;
	#t;
	constructor(e, t = "") {
		this.#e = e, this.#t = t;
	}
	async snapshot(e = {}) {
		let { interestingOnly: t = !0, root: n = null, includeIframes: r = !1 } = e, { nodes: i } = await this.#e.environment.client.send("Accessibility.getFullAXTree", { frameId: this.#t }), a;
		if (n) {
			let { node: e } = await this.#e.environment.client.send("DOM.describeNode", { objectId: n.id });
			a = e.backendNodeId;
		}
		let o = Pa.createTree(this.#e, i), s = async (t) => {
			if (t.payload.role?.value === "Iframe") {
				let n = {
					stack: [],
					error: void 0,
					hasError: !1
				};
				try {
					if (!t.payload.backendDOMNodeId) return;
					let r = ja(n, await this.#e.adoptBackendNode(t.payload.backendDOMNodeId), !1);
					if (!r || !("contentFrame" in r)) return;
					let i = await r.contentFrame();
					if (!i) return;
					try {
						t.iframeSnapshot = await i.accessibility.snapshot(e) ?? void 0;
					} catch (e) {
						P(e);
					}
				} catch (e) {
					n.error = e, n.hasError = !0;
				} finally {
					Ma(n);
				}
			}
			for (let e of t.children) await s(e);
		}, c = o;
		if (!o || (r && await s(o), a && (c = o.find((e) => e.payload.backendDOMNodeId === a)), !c)) return null;
		if (!t) return this.serializeTree(c)[0] ?? null;
		let l = /* @__PURE__ */ new Set();
		return this.collectInterestingNodes(l, o, !1), this.serializeTree(c, l)[0] ?? null;
	}
	serializeTree(e, t) {
		let n = [];
		for (let r of e.children) n.push(...this.serializeTree(r, t));
		if (t && !t.has(e)) return n;
		let r = e.serialize();
		return n.length && (r.children = n), e.iframeSnapshot && (r.children ||= [], r.children.push(e.iframeSnapshot)), [r];
	}
	collectInterestingNodes(e, t, n) {
		if ((t.isInteresting(n) || t.iframeSnapshot) && e.add(t), !t.isLeafNode()) {
			n ||= t.isControl();
			for (let r of t.children) this.collectInterestingNodes(e, r, n);
		}
	}
}, Pa = class e {
	payload;
	children = [];
	iframeSnapshot;
	#e = !1;
	#t = !1;
	#n = !1;
	#r = !1;
	#i = !1;
	#a = !1;
	#o = !1;
	#s = !1;
	#c;
	#l;
	#u;
	#d;
	#f;
	#p;
	#m;
	#h;
	constructor(e, t) {
		this.payload = t, this.#l = this.payload.role ? this.payload.role.value : "Unknown", this.#p = this.payload.ignored, this.#c = this.payload.name ? this.payload.name.value : "", this.#u = this.payload.description ? this.payload.description.value : void 0, this.#h = e;
		for (let e of this.payload.properties || []) e.name === "editable" && (this.#e = e.value.value === "richtext", this.#t = !0), e.name === "focusable" && (this.#n = e.value.value), e.name === "hidden" && (this.#r = e.value.value), e.name === "busy" && (this.#i = e.value.value), e.name === "live" && (this.#f = e.value.value), e.name === "modal" && (this.#a = e.value.value), e.name === "roledescription" && (this.#d = e.value.value), e.name === "errormessage" && (this.#o = !0), e.name === "details" && (this.#s = !0);
	}
	#g() {
		return this.#e ? !1 : this.#t ? !0 : this.#l === "textbox" || this.#l === "searchbox";
	}
	#_() {
		let e = this.#l;
		return e === "LineBreak" || e === "text" || e === "InlineTextBox" || e === "StaticText";
	}
	#v() {
		if (this.#m === void 0) {
			this.#m = !1;
			for (let e of this.children) if (e.#n || e.#v()) {
				this.#m = !0;
				break;
			}
		}
		return this.#m;
	}
	find(e) {
		if (e(this)) return this;
		for (let t of this.children) {
			let n = t.find(e);
			if (n) return n;
		}
		return null;
	}
	isLeafNode() {
		if (!this.children.length || this.#g() || this.#_()) return !0;
		switch (this.#l) {
			case "doc-cover":
			case "graphics-symbol":
			case "img":
			case "image":
			case "Meter":
			case "scrollbar":
			case "slider":
			case "separator":
			case "progressbar": return !0;
		}
		return !this.#v() && !!(this.#l === "heading" && this.#c);
	}
	isControl() {
		switch (this.#l) {
			case "button":
			case "checkbox":
			case "ColorWell":
			case "combobox":
			case "DisclosureTriangle":
			case "listbox":
			case "menu":
			case "menubar":
			case "menuitem":
			case "menuitemcheckbox":
			case "menuitemradio":
			case "radio":
			case "scrollbar":
			case "searchbox":
			case "slider":
			case "spinbutton":
			case "switch":
			case "tab":
			case "textbox":
			case "tree":
			case "treeitem": return !0;
			default: return !1;
		}
	}
	isLandmark() {
		switch (this.#l) {
			case "banner":
			case "complementary":
			case "contentinfo":
			case "form":
			case "main":
			case "navigation":
			case "region":
			case "search": return !0;
			default: return !1;
		}
	}
	isInteresting(e) {
		return this.#l === "Ignored" || this.#r || this.#p ? !1 : this.isLandmark() || this.#n || this.#e || this.#i || this.#f && this.#f !== "off" || this.#a || this.#o || this.#s || this.#d || this.isControl() ? !0 : !e && this.isLeafNode() && (!!this.#c || !!this.#u);
	}
	serialize() {
		let e = /* @__PURE__ */ new Map();
		for (let t of this.payload.properties || []) e.set(t.name.toLowerCase(), t.value.value);
		this.payload.name && e.set("name", this.payload.name.value), this.payload.value && e.set("value", this.payload.value.value), this.payload.description && e.set("description", this.payload.description.value);
		let t = {
			role: this.#l,
			elementHandle: async () => {
				let e = {
					stack: [],
					error: void 0,
					hasError: !1
				};
				try {
					return this.payload.backendDOMNodeId ? await ja(e, await this.#h.adoptBackendNode(this.payload.backendDOMNodeId), !1).evaluateHandle((e) => e.nodeType === Node.TEXT_NODE ? e.parentElement : e) : null;
				} catch (t) {
					e.error = t, e.hasError = !0;
				} finally {
					Ma(e);
				}
			},
			backendNodeId: this.payload.backendDOMNodeId,
			loaderId: this.#h.environment._loaderId
		}, n = [
			"name",
			"value",
			"description",
			"keyshortcuts",
			"roledescription",
			"valuetext",
			"url"
		], r = (t) => e.get(t);
		for (let i of n) e.has(i) && (t[i] = r(i));
		let i = [
			"disabled",
			"expanded",
			"focused",
			"modal",
			"multiline",
			"multiselectable",
			"readonly",
			"required",
			"selected",
			"busy",
			"atomic"
		], a = (t) => !!e.get(t);
		for (let n of i) (n !== "focused" || this.#l !== "RootWebArea") && e.has(n) && (t[n] = a(n));
		for (let n of ["checked", "pressed"]) {
			if (!e.has(n)) continue;
			let r = e.get(n);
			t[n] = r === "mixed" ? "mixed" : r === "true";
		}
		let o = [
			"level",
			"valuemax",
			"valuemin"
		], s = (t) => e.get(t);
		for (let n of o) e.has(n) && (t[n] = s(n));
		let c = [
			"autocomplete",
			"haspopup",
			"invalid",
			"orientation",
			"live",
			"relevant",
			"errormessage",
			"details"
		], l = (t) => e.get(t);
		for (let e of c) {
			let n = l(e);
			n && n !== "false" && (t[e] = l(e));
		}
		return t;
	}
	static createTree(t, n) {
		let r = /* @__PURE__ */ new Map();
		for (let i of n) r.set(i.nodeId, new e(t, i));
		for (let e of r.values()) for (let t of e.payload.childIds || []) {
			let n = r.get(t);
			n && e.children.push(n);
		}
		return r.values().next().value ?? null;
	}
}, J;
(function(e) {
	e.FrameAttached = Symbol("FrameManager.FrameAttached"), e.FrameNavigated = Symbol("FrameManager.FrameNavigated"), e.FrameDetached = Symbol("FrameManager.FrameDetached"), e.FrameSwapped = Symbol("FrameManager.FrameSwapped"), e.LifecycleEvent = Symbol("FrameManager.LifecycleEvent"), e.FrameNavigatedWithinDocument = Symbol("FrameManager.FrameNavigatedWithinDocument"), e.ConsoleApiCalled = Symbol("FrameManager.ConsoleApiCalled"), e.BindingCalled = Symbol("FrameManager.BindingCalled");
})(J ||= {});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/common/WaitTask.js
var Fa = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o = /* @__PURE__ */ Error("Waiting failed");
	#s;
	#c = z.create();
	#l;
	#u;
	#d = [];
	constructor(e, t, n, ...r) {
		switch (this.#e = e, this.#t = t.polling, this.#n = t.root, this.#u = t.signal, this.#u?.addEventListener("abort", this.#f, { once: !0 }), typeof n) {
			case "string":
				this.#r = `() => {return (${n});}`;
				break;
			default: this.#r = ui(n);
		}
		this.#i = r, this.#e.taskManager.add(this), t.timeout && (this.#s = new xn(`Waiting failed: ${t.timeout}ms exceeded`), this.#a = setTimeout(() => {
			this.terminate(this.#s);
		}, t.timeout)), this.rerun();
	}
	get result() {
		return this.#c.valueOrThrow();
	}
	async rerun() {
		for (let e of this.#d) e.abort();
		this.#d.length = 0;
		let e = new AbortController();
		this.#d.push(e);
		try {
			switch (this.#t) {
				case "raf":
					this.#l = await this.#e.evaluateHandle(({ RAFPoller: e, createFunction: t }, n, ...r) => {
						let i = t(n);
						return new e(() => i(...r));
					}, vi.create((e) => e.puppeteerUtil), this.#r, ...this.#i);
					break;
				case "mutation":
					this.#l = await this.#e.evaluateHandle(({ MutationPoller: e, createFunction: t }, n, r, ...i) => {
						let a = t(r);
						return new e(() => a(...i), n || document);
					}, vi.create((e) => e.puppeteerUtil), this.#n, this.#r, ...this.#i);
					break;
				default: this.#l = await this.#e.evaluateHandle(({ IntervalPoller: e, createFunction: t }, n, r, ...i) => {
					let a = t(r);
					return new e(() => a(...i), n);
				}, vi.create((e) => e.puppeteerUtil), this.#t, this.#r, ...this.#i);
			}
			await this.#l.evaluate((e) => {
				e.start();
			});
			let e = await this.#l.evaluateHandle((e) => e.result());
			this.#c.resolve(e), await this.terminate();
		} catch (t) {
			if (e.signal.aborted) return;
			let n = this.getBadError(t);
			n && (this.#o.cause = n, await this.terminate(this.#o));
		}
	}
	async terminate(e) {
		if (this.#e.taskManager.delete(this), this.#u?.removeEventListener("abort", this.#f), clearTimeout(this.#a), e && !this.#c.finished() && this.#c.reject(e), this.#l) try {
			await this.#l.evaluate(async (e) => {
				await e.stop();
			}), this.#l &&= (await this.#l.dispose(), void 0);
		} catch {}
	}
	getBadError(e) {
		return kr(e) ? e.message.includes("Execution context is not available in detached frame") ? /* @__PURE__ */ Error("Waiting failed: Frame detached") : e.message.includes("Execution context was destroyed") || e.message.includes("Cannot find context with specified id") || e.message.includes("DiscardedBrowsingContextError") ? void 0 : e : Error("WaitTask failed with an error", { cause: e });
	}
	#f = () => {
		this.terminate(this.#u?.reason);
	};
}, Ia = class {
	#e = /* @__PURE__ */ new Set();
	add(e) {
		this.#e.add(e);
	}
	delete(e) {
		this.#e.delete(e);
	}
	terminateAll(e) {
		for (let t of this.#e) t.terminate(e);
		this.#e.clear();
	}
	async rerunAll() {
		await Promise.all([...this.#e].map((e) => e.rerun()));
	}
}, La = class {
	timeoutSettings;
	taskManager = new Ia();
	constructor(e) {
		this.timeoutSettings = e;
	}
	async waitForFunction(e, t = {}, ...n) {
		let { polling: r = "raf", timeout: i = this.timeoutSettings.timeout(), root: a, signal: o } = t;
		if (typeof r == "number" && r < 0) throw Error("Cannot poll with non-positive interval");
		return await new Fa(this, {
			polling: r,
			root: a,
			timeout: i,
			signal: o
		}, e, ...n).result;
	}
	get disposed() {
		return this.#e;
	}
	#e = !1;
	dispose() {
		this.#e = !0, this.taskManager.terminateAll(/* @__PURE__ */ Error("waitForFunction failed: frame got detached."));
	}
	[j]() {
		this.dispose();
	}
}, Ra = Symbol("mainWorld"), za = Symbol("puppeteerWorld"), Y;
(function(e) {
	e.PAGE = "page", e.BACKGROUND_PAGE = "background_page", e.SERVICE_WORKER = "service_worker", e.SHARED_WORKER = "shared_worker", e.BROWSER = "browser", e.WEBVIEW = "webview", e.OTHER = "other", e.TAB = "tab";
})(Y ||= {});
var Ba = class {
	constructor() {}
	async worker() {
		return null;
	}
	async page() {
		return null;
	}
}, Va = class extends Er {
	#e;
	#t;
	#n;
	#r;
	#i;
	get internalEmitter() {
		return this.#i;
	}
	constructor(e, t, n, r, i, a) {
		super(t), this.#n = n, this.#t = e, this.#r = r, this.#e = new Ha(this, new er(), Ra), this.#i = new L(), this.#t.once("Runtime.executionContextCreated", async (t) => {
			this.#e.setContext(new ka(e, t.context, this.#e));
		}), this.#e.emitter.on("consoleapicalled", async (e) => {
			try {
				let t = e.args.map((e) => this.#e.createCdpHandle(e)), n = this.#i.listenerCount(Tr.Console) === 0, r = this.listenerCount(Tr.Console) === 0;
				if (n && r) {
					for (let e of t) e.dispose().catch(P);
					return;
				}
				let i = ca(e, t, this.#n);
				this.#i.emit(Tr.Console, i), r || this.emit(Tr.Console, i);
			} catch (e) {
				P(e);
			}
		}), this.#t.on("Runtime.exceptionThrown", i), this.#t.once(R.Disconnected, () => {
			this.#e.dispose();
		}), a?.addClient(this.#t).catch(P), this.#t.send("Runtime.enable").catch(P);
	}
	mainRealm() {
		return this.#e;
	}
	get client() {
		return this.#t;
	}
	async close() {
		switch (this.#r) {
			case Y.SERVICE_WORKER:
				await this.client.connection()?.send("Target.closeTarget", { targetId: this.#n }), await this.client.connection()?.send("Target.detachFromTarget", { sessionId: this.client.id() });
				break;
			case Y.SHARED_WORKER:
				await this.client.connection()?.send("Target.closeTarget", { targetId: this.#n });
				break;
			default: await this.evaluate(() => {
				self.close();
			});
		}
	}
}, Ha = class extends La {
	#e;
	#t = new L();
	#n;
	#r;
	#i;
	constructor(e, t, n) {
		super(t), this.#i = e, this.#n = n;
	}
	get environment() {
		return this.#i;
	}
	get client() {
		return this.#i.client;
	}
	get emitter() {
		return this.#t;
	}
	setContext(e) {
		this.#e?.[j](), e.once("disposed", this.#a.bind(this)), e.on("consoleapicalled", this.#o.bind(this)), e.on("bindingcalled", this.#s.bind(this)), this.#e = e, this.#t.emit("context", e), this.taskManager.rerunAll();
	}
	#a() {
		this.#e = void 0, "clearDocumentHandle" in this.#i && this.#i.clearDocumentHandle();
	}
	#o(e) {
		this.#t.emit("consoleapicalled", e);
	}
	#s(e) {
		this.#t.emit("bindingcalled", e);
	}
	hasContext() {
		return !!this.#e;
	}
	get context() {
		return this.#e;
	}
	#c() {
		if (this.disposed) throw Error(`Execution context is not available in detached frame or worker "${this.environment.url()}" (are you trying to evaluate?)`);
		return this.#e;
	}
	async #l() {
		let e = /* @__PURE__ */ Error("Execution context was destroyed");
		return await O(I(this.#t, "context").pipe(Yt(I(this.#t, "disposed").pipe(k(() => {
			throw e;
		})), Rn(this.timeoutSettings.timeout()))));
	}
	async evaluateHandle(e, ...t) {
		e = F(this.evaluateHandle.name, e);
		let n = this.#c();
		return n ||= await this.#l(), await n.evaluateHandle(e, ...t);
	}
	async evaluate(e, ...t) {
		e = F(this.evaluate.name, e);
		let n = this.#c();
		return n ||= await this.#l(), await n.evaluate(e, ...t);
	}
	async adoptBackendNode(e) {
		let t = this.#c();
		t ||= await this.#l();
		let { object: n } = await this.client.send("DOM.resolveNode", {
			backendNodeId: e,
			executionContextId: t.id
		});
		return this.createCdpHandle(n);
	}
	async adoptHandle(e) {
		if (e.realm === this) return await e.evaluateHandle((e) => e);
		let t = await this.client.send("DOM.describeNode", { objectId: e.id });
		return await this.adoptBackendNode(t.node.backendNodeId);
	}
	async transferHandle(e) {
		if (e.realm === this || e.remoteObject().objectId === void 0) return e;
		let t = await this.client.send("DOM.describeNode", { objectId: e.remoteObject().objectId }), n = await this.adoptBackendNode(t.node.backendNodeId);
		return await e.dispose(), n;
	}
	createCdpHandle(e) {
		return e.subtype === "node" ? new wa(this, e) : new ya(this, e);
	}
	[j]() {
		this.#e?.[j](), this.#t.emit("disposed", void 0), this.#t.removeAllListeners(), super[j]();
	}
	get origin() {
		return this.#r;
	}
	set origin(e) {
		this.#r = e;
	}
	setWorldId(e) {
		this.#n = e;
	}
	async extension() {
		if (this.#i instanceof Va) throw Error("Unable to get extension from Realm");
		return this.#n === Ra ? null : typeof this.#n == "string" ? (await this.#i._frameManager.page().browser().extensions()).get(this.#n) ?? null : null;
	}
}, Ua = /* @__PURE__ */ new Map([
	["load", "load"],
	["domcontentloaded", "DOMContentLoaded"],
	["networkidle0", "networkIdle"],
	["networkidle2", "networkAlmostIdle"]
]), Wa = class {
	#e;
	#t;
	#n;
	#r = null;
	#i = new rn();
	#a;
	#o;
	#s = z.create();
	#c = z.create();
	#l = z.create();
	#u = /* @__PURE__ */ Error("LifecycleWatcher terminated");
	#d;
	#f;
	#p;
	constructor(e, t, n, r, i) {
		Array.isArray(n) ? n = n.slice() : typeof n == "string" && (n = [n]), this.#a = t._loaderId, this.#e = n.map((e) => {
			let t = Ua.get(e);
			return N(t, "Unknown value for options.waitUntil: " + e), t;
		}), i?.addEventListener("abort", () => {
			i.reason instanceof Error && (i.reason.cause = this.#u), this.#o.reject(i.reason);
		}), this.#t = t, this.#n = r, this.#i.use(new L(t._frameManager)).on(J.LifecycleEvent, this.#x.bind(this));
		let a = this.#i.use(new L(t));
		a.on(W.FrameNavigatedWithinDocument, this.#v.bind(this)), a.on(W.FrameNavigated, this.#y.bind(this)), a.on(W.FrameSwapped, this.#b.bind(this)), a.on(W.FrameSwappedByActivation, this.#b.bind(this)), a.on(W.FrameDetached, this.#_.bind(this));
		let o = this.#i.use(new L(e));
		o.on(H.Request, this.#m.bind(this)), o.on(H.Response, this.#g.bind(this)), o.on(H.RequestFailed, this.#h.bind(this)), this.#o = z.create({
			timeout: this.#n,
			message: `Navigation timeout of ${this.#n} ms exceeded`
		}), this.#x();
	}
	#m(e) {
		e.frame() === this.#t && e.isNavigationRequest() && (this.#r = e, this.#p?.resolve(), this.#p = z.create(), e.response() !== null && this.#p?.resolve());
	}
	#h(e) {
		this.#r?.id === e.id && this.#p?.resolve();
	}
	#g(e) {
		this.#r?.id === e.request().id && this.#p?.resolve();
	}
	#_(e) {
		if (this.#t === e) {
			this.#u.message = "Navigating frame was detached", this.#o.resolve(this.#u);
			return;
		}
		this.#x();
	}
	async navigationResponse() {
		return await this.#p?.valueOrThrow(), this.#r ? this.#r.response() : null;
	}
	sameDocumentNavigationPromise() {
		return this.#s.valueOrThrow();
	}
	newDocumentNavigationPromise() {
		return this.#l.valueOrThrow();
	}
	lifecyclePromise() {
		return this.#c.valueOrThrow();
	}
	terminationPromise() {
		return this.#o.valueOrThrow();
	}
	#v() {
		this.#d = !0, this.#x();
	}
	#y(e) {
		if (e === "BackForwardCacheRestore") return this.#b();
		this.#x();
	}
	#b() {
		this.#f = !0, this.#x();
	}
	#x() {
		if (!e(this.#t, this.#e)) return;
		this.#c.resolve(), this.#d && this.#s.resolve(void 0), (this.#f || this.#t._loaderId !== this.#a) && this.#l.resolve(void 0);
		function e(t, n) {
			for (let e of n) if (!t._lifecycleEvents.has(e)) return !1;
			for (let r of t.childFrames()) if (r._hasStartedLoading && !e(r, n)) return !1;
			return !0;
		}
	}
	dispose() {
		this.#i.dispose(), this.#u.cause = /* @__PURE__ */ Error("LifecycleWatcher disposed"), this.#o.resolve(this.#u);
	}
}, Ga = function(e, t, n) {
	for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
	return r ? n : void 0;
}, Ka = function(e, t, n, r, i, a) {
	function o(e) {
		if (e !== void 0 && typeof e != "function") throw TypeError("Function expected");
		return e;
	}
	for (var s = r.kind, c = s === "getter" ? "get" : s === "setter" ? "set" : "value", l = !t && e ? r.static ? e : e.prototype : null, u = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), d, f = !1, p = n.length - 1; p >= 0; p--) {
		var m = {};
		for (var h in r) m[h] = h === "access" ? {} : r[h];
		for (var h in r.access) m.access[h] = r.access[h];
		m.addInitializer = function(e) {
			if (f) throw TypeError("Cannot add initializers after decoration has completed");
			a.push(o(e || null));
		};
		var g = (0, n[p])(s === "accessor" ? {
			get: u.get,
			set: u.set
		} : u[c], m);
		if (s === "accessor") {
			if (g === void 0) continue;
			if (typeof g != "object" || !g) throw TypeError("Object expected");
			(d = o(g.get)) && (u.get = d), (d = o(g.set)) && (u.set = d), (d = o(g.init)) && i.unshift(d);
		} else (d = o(g)) && (s === "field" ? i.unshift(d) : u[c] = d);
	}
	l && Object.defineProperty(l, r.name, u), f = !0;
}, qa = (() => {
	let e = Xi, t = [], n, r, i, a, o, s, c;
	return class extends e {
		static {
			let l = typeof Symbol == "function" && Symbol.metadata ? Object.create(e[Symbol.metadata] ?? null) : void 0;
			Ka(this, null, n, {
				kind: "method",
				name: "goto",
				static: !1,
				private: !1,
				access: {
					has: (e) => "goto" in e,
					get: (e) => e.goto
				},
				metadata: l
			}, null, t), Ka(this, null, r, {
				kind: "method",
				name: "waitForNavigation",
				static: !1,
				private: !1,
				access: {
					has: (e) => "waitForNavigation" in e,
					get: (e) => e.waitForNavigation
				},
				metadata: l
			}, null, t), Ka(this, null, i, {
				kind: "method",
				name: "setContent",
				static: !1,
				private: !1,
				access: {
					has: (e) => "setContent" in e,
					get: (e) => e.setContent
				},
				metadata: l
			}, null, t), Ka(this, null, a, {
				kind: "method",
				name: "addPreloadScript",
				static: !1,
				private: !1,
				access: {
					has: (e) => "addPreloadScript" in e,
					get: (e) => e.addPreloadScript
				},
				metadata: l
			}, null, t), Ka(this, null, o, {
				kind: "method",
				name: "addExposedFunctionBinding",
				static: !1,
				private: !1,
				access: {
					has: (e) => "addExposedFunctionBinding" in e,
					get: (e) => e.addExposedFunctionBinding
				},
				metadata: l
			}, null, t), Ka(this, null, s, {
				kind: "method",
				name: "removeExposedFunctionBinding",
				static: !1,
				private: !1,
				access: {
					has: (e) => "removeExposedFunctionBinding" in e,
					get: (e) => e.removeExposedFunctionBinding
				},
				metadata: l
			}, null, t), Ka(this, null, c, {
				kind: "method",
				name: "waitForDevicePrompt",
				static: !1,
				private: !1,
				access: {
					has: (e) => "waitForDevicePrompt" in e,
					get: (e) => e.waitForDevicePrompt
				},
				metadata: l
			}, null, t), l && Object.defineProperty(this, Symbol.metadata, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: l
			});
		}
		#e = (Ga(this, t), "");
		#t = !1;
		#n;
		_frameManager;
		_loaderId = "";
		_lifecycleEvents = /* @__PURE__ */ new Set();
		_id;
		_parentId;
		accessibility;
		worlds;
		extensionWorlds = {};
		constructor(e, t, n, r) {
			super(), this._frameManager = e, this.#e = "", this._id = t, this._parentId = n, this.#t = !1, this.#n = r, this._loaderId = "", this.worlds = {
				[Ra]: new Ha(this, this._frameManager.timeoutSettings, Ra),
				[za]: new Ha(this, this._frameManager.timeoutSettings, za)
			}, this.accessibility = new Na(this.worlds[Ra], t), this.on(W.FrameSwappedByActivation, () => {
				this._onLoadingStarted(), this._onLoadingStopped();
			}), this.registerWorldListeners(this.worlds[Ra]);
		}
		registerWorldListeners(e) {
			e.emitter.on("consoleapicalled", (t) => {
				this._frameManager.emit(J.ConsoleApiCalled, [e, t]);
			}), e.emitter.on("bindingcalled", (t) => {
				this._frameManager.emit(J.BindingCalled, [e, t]);
			});
		}
		_client() {
			return this.#n;
		}
		updateId(e) {
			this._id = e;
		}
		updateClient(e) {
			this.#n = e;
		}
		page() {
			return this._frameManager.page();
		}
		async goto(e, t = {}) {
			if (!this.page()._isUrlAllowed(e)) throw Error(`Navigation to ${e} is blocked by blocklist/allowlist rules`);
			let { referer: n = this._frameManager.networkManager.extraHTTPHeaders().referer, referrerPolicy: r = this._frameManager.networkManager.extraHTTPHeaders()["referer-policy"], waitUntil: i = ["load"], timeout: a = this._frameManager.timeoutSettings.navigationTimeout() } = t, o = !1, s = new Wa(this._frameManager.networkManager, this, i, a), c = await z.race([l(this.#n, e, n, r ? Ja(r) : void 0, this._id), s.terminationPromise()]);
			c ||= await z.race([s.terminationPromise(), o ? s.newDocumentNavigationPromise() : s.sameDocumentNavigationPromise()]);
			try {
				if (c) throw c;
				return await s.navigationResponse();
			} finally {
				s.dispose();
			}
			async function l(e, t, n, r, i) {
				try {
					let a = await e.send("Page.navigate", {
						url: t,
						referrer: n,
						frameId: i,
						referrerPolicy: r
					});
					return o = !!a.loaderId, a.errorText === "net::ERR_HTTP_RESPONSE_CODE_FAILURE" ? null : a.errorText ? /* @__PURE__ */ Error(`${a.errorText} at ${t}`) : null;
				} catch (e) {
					if (kr(e)) return e;
					throw e;
				}
			}
		}
		async waitForNavigation(e = {}) {
			let { waitUntil: t = ["load"], timeout: n = this._frameManager.timeoutSettings.navigationTimeout(), signal: r } = e, i = new Wa(this._frameManager.networkManager, this, t, n, r), a = await z.race([
				i.terminationPromise(),
				...e.ignoreSameDocumentNavigation ? [] : [i.sameDocumentNavigationPromise()],
				i.newDocumentNavigationPromise()
			]);
			try {
				if (a) throw a;
				let e = await z.race([i.terminationPromise(), i.navigationResponse()]);
				if (e instanceof Error) throw a;
				return e || null;
			} finally {
				i.dispose();
			}
		}
		get client() {
			return this.#n;
		}
		mainRealm() {
			return this.worlds[Ra];
		}
		isolatedRealm() {
			return this.worlds[za];
		}
		async setContent(e, t = {}) {
			let { waitUntil: n = ["load"], timeout: r = this._frameManager.timeoutSettings.navigationTimeout() } = t;
			await this.setFrameContent(e);
			let i = new Wa(this._frameManager.networkManager, this, n, r), a = await z.race([i.terminationPromise(), i.lifecyclePromise()]);
			if (i.dispose(), a) throw a;
		}
		url() {
			return this.#e;
		}
		parentFrame() {
			return this._frameManager._frameTree.parentFrame(this._id) || null;
		}
		childFrames() {
			return this._frameManager._frameTree.childFrames(this._id);
		}
		#r() {
			return this._frameManager._deviceRequestPromptManager(this.#n);
		}
		async addPreloadScript(e) {
			let t = this.parentFrame();
			if (t && this.#n === t.client || e.getIdForFrame(this)) return;
			let { identifier: n } = await this.#n.send("Page.addScriptToEvaluateOnNewDocument", { source: e.source });
			e.setIdForFrame(this, n);
		}
		async addExposedFunctionBinding(e) {
			(this === this._frameManager.mainFrame() || this._hasStartedLoading) && await Promise.all([this.#n.send("Runtime.addBinding", { name: ga + e.name }), this.evaluate(e.initSource).catch(P)]);
		}
		async removeExposedFunctionBinding(e) {
			(this === this._frameManager.mainFrame() || this._hasStartedLoading) && await Promise.all([this.#n.send("Runtime.removeBinding", { name: ga + e.name }), this.evaluate((e) => {
				globalThis[e] = void 0;
			}, e.name).catch(P)]);
		}
		async waitForDevicePrompt(e = {}) {
			return await this.#r().waitForDevicePrompt(e);
		}
		_navigated(e) {
			this._name = e.name, this.#e = `${e.url}${e.urlFragment || ""}`;
		}
		_navigatedWithinDocument(e) {
			this.#e = e;
		}
		_onLifecycleEvent(e, t) {
			t === "init" && (this._loaderId = e, this._lifecycleEvents.clear()), this._lifecycleEvents.add(t);
		}
		_onLoadingStopped() {
			this._lifecycleEvents.add("DOMContentLoaded"), this._lifecycleEvents.add("load");
		}
		_onLoadingStarted() {
			this._hasStartedLoading = !0;
		}
		get detached() {
			return this.#t;
		}
		[(n = [G], r = [G], i = [G], a = [G], o = [G], s = [G], c = [G], j)]() {
			if (!this.#t) {
				this.#t = !0, this.worlds[Ra][j](), this.worlds[za][j]();
				for (let e of Object.values(this.extensionWorlds)) e[j]();
				super[j]();
			}
		}
		exposeFunction() {
			throw new wn();
		}
		async frameElement() {
			let e = this.parentFrame();
			if (!e) return null;
			let { backendNodeId: t } = await e.client.send("DOM.getFrameOwner", { frameId: this._id });
			return await e.mainRealm().adoptBackendNode(t);
		}
		extensionRealms() {
			return Object.values(this.extensionWorlds);
		}
	};
})();
function Ja(e) {
	return e.replaceAll(/-./g, (e) => e[1].toUpperCase());
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/cdp/FrameTree.js
var Ya = class {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r;
	#i = !1;
	#a = /* @__PURE__ */ new Map();
	getMainFrame() {
		return this.#r;
	}
	getById(e) {
		return this.#e.get(e);
	}
	waitForFrame(e) {
		let t = this.getById(e);
		if (t) return Promise.resolve(t);
		let n = z.create();
		return (this.#a.get(e) || /* @__PURE__ */ new Set()).add(n), n.valueOrThrow();
	}
	frames() {
		return Array.from(this.#e.values());
	}
	addFrame(e) {
		this.#e.set(e._id, e), e._parentId ? (this.#t.set(e._id, e._parentId), this.#n.has(e._parentId) || this.#n.set(e._parentId, /* @__PURE__ */ new Set()), this.#n.get(e._parentId).add(e._id)) : (!this.#r || this.#i) && (this.#r = e, this.#i = !1), this.#a.get(e._id)?.forEach((t) => t.resolve(e));
	}
	removeFrame(e) {
		this.#e.delete(e._id), this.#t.delete(e._id), e._parentId ? this.#n.get(e._parentId)?.delete(e._id) : this.#i = !0;
	}
	childFrames(e) {
		let t = this.#n.get(e);
		return t ? Array.from(t).map((e) => this.getById(e)).filter((e) => e !== void 0) : [];
	}
	parentFrame(e) {
		let t = this.#t.get(e);
		return t ? this.getById(t) : void 0;
	}
}, Xa = class {
	_interceptionId;
	_failureText = null;
	_response = null;
	_fromMemoryCache = !1;
	_redirectChain = [];
	interception = {
		enabled: !1,
		handled: !1,
		handlers: [],
		resolutionState: { action: Za.None },
		requestOverrides: {},
		response: null,
		abortReason: null
	};
	constructor() {}
	continueRequestOverrides() {
		return this.interception.requestOverrides;
	}
	responseForRequest() {
		return this.interception.response;
	}
	abortErrorReason() {
		return this.interception.abortReason;
	}
	interceptResolutionState() {
		return this.interception.enabled ? this.interception.handled ? { action: Za.AlreadyHandled } : { ...this.interception.resolutionState } : { action: Za.Disabled };
	}
	isInterceptResolutionHandled() {
		return this.interception.handled;
	}
	enqueueInterceptAction(e) {
		this.interception.handlers.push(e);
	}
	async finalizeInterceptions() {
		await this.interception.handlers.reduce((e, t) => e.then(t), Promise.resolve()), this.interception.handlers = [];
		let { action: e } = this.interceptResolutionState();
		switch (e) {
			case "abort": return await this._abort(this.interception.abortReason);
			case "respond":
				if (this.interception.response === null) throw Error("Response is missing for the interception");
				return await this._respond(this.interception.response);
			case "continue": return await this._continue(this.interception.requestOverrides);
		}
	}
	verifyInterception() {
		N(this.interception.enabled, "Request Interception is not enabled!"), N(!this.interception.handled, "Request is already handled!");
	}
	async continue(e = {}, t) {
		if (this.verifyInterception(), this.canBeIntercepted()) {
			if (t === void 0) return await this._continue(e);
			if (this.interception.requestOverrides = e, this.interception.resolutionState.priority === void 0 || t > this.interception.resolutionState.priority) {
				this.interception.resolutionState = {
					action: Za.Continue,
					priority: t
				};
				return;
			}
			if (t === this.interception.resolutionState.priority) {
				if (this.interception.resolutionState.action === "abort" || this.interception.resolutionState.action === "respond") return;
				this.interception.resolutionState.action = Za.Continue;
			}
		}
	}
	async respond(e, t) {
		if (this.verifyInterception(), this.canBeIntercepted()) {
			if (t === void 0) return await this._respond(e);
			if (this.interception.response = e, this.interception.resolutionState.priority === void 0 || t > this.interception.resolutionState.priority) {
				this.interception.resolutionState = {
					action: Za.Respond,
					priority: t
				};
				return;
			}
			if (t === this.interception.resolutionState.priority) {
				if (this.interception.resolutionState.action === "abort") return;
				this.interception.resolutionState.action = Za.Respond;
			}
		}
	}
	async abort(e = "failed", t) {
		if (this.verifyInterception(), !this.canBeIntercepted()) return;
		let n = eo[e];
		if (N(n, "Unknown error code: " + e), t === void 0) return await this._abort(n);
		if (this.interception.abortReason = n, this.interception.resolutionState.priority === void 0 || t >= this.interception.resolutionState.priority) {
			this.interception.resolutionState = {
				action: Za.Abort,
				priority: t
			};
			return;
		}
	}
	static getResponse(e) {
		let t = jn(e) ? new TextEncoder().encode(e) : e;
		return {
			contentLength: t.byteLength,
			base64: fn(t)
		};
	}
}, Za;
(function(e) {
	e.Abort = "abort", e.Respond = "respond", e.Continue = "continue", e.Disabled = "disabled", e.None = "none", e.AlreadyHandled = "already-handled";
})(Za ||= {});
function Qa(e) {
	let t = [];
	for (let n in e) {
		let r = e[n];
		if (!Object.is(r, void 0)) {
			let e = Array.isArray(r) ? r : [r];
			t.push(...e.map((e) => ({
				name: n,
				value: e + ""
			})));
		}
	}
	return t;
}
var $a = {
	100: "Continue",
	101: "Switching Protocols",
	102: "Processing",
	103: "Early Hints",
	200: "OK",
	201: "Created",
	202: "Accepted",
	203: "Non-Authoritative Information",
	204: "No Content",
	205: "Reset Content",
	206: "Partial Content",
	207: "Multi-Status",
	208: "Already Reported",
	226: "IM Used",
	300: "Multiple Choices",
	301: "Moved Permanently",
	302: "Found",
	303: "See Other",
	304: "Not Modified",
	305: "Use Proxy",
	306: "Switch Proxy",
	307: "Temporary Redirect",
	308: "Permanent Redirect",
	400: "Bad Request",
	401: "Unauthorized",
	402: "Payment Required",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	406: "Not Acceptable",
	407: "Proxy Authentication Required",
	408: "Request Timeout",
	409: "Conflict",
	410: "Gone",
	411: "Length Required",
	412: "Precondition Failed",
	413: "Payload Too Large",
	414: "URI Too Long",
	415: "Unsupported Media Type",
	416: "Range Not Satisfiable",
	417: "Expectation Failed",
	418: "I'm a teapot",
	421: "Misdirected Request",
	422: "Unprocessable Entity",
	423: "Locked",
	424: "Failed Dependency",
	425: "Too Early",
	426: "Upgrade Required",
	428: "Precondition Required",
	429: "Too Many Requests",
	431: "Request Header Fields Too Large",
	451: "Unavailable For Legal Reasons",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Timeout",
	505: "HTTP Version Not Supported",
	506: "Variant Also Negotiates",
	507: "Insufficient Storage",
	508: "Loop Detected",
	510: "Not Extended",
	511: "Network Authentication Required"
}, eo = {
	aborted: "Aborted",
	accessdenied: "AccessDenied",
	addressunreachable: "AddressUnreachable",
	blockedbyclient: "BlockedByClient",
	blockedbyresponse: "BlockedByResponse",
	connectionaborted: "ConnectionAborted",
	connectionclosed: "ConnectionClosed",
	connectionfailed: "ConnectionFailed",
	connectionrefused: "ConnectionRefused",
	connectionreset: "ConnectionReset",
	internetdisconnected: "InternetDisconnected",
	namenotresolved: "NameNotResolved",
	timedout: "TimedOut",
	failed: "Failed"
};
function to(e) {
	if (e.originalMessage.includes("Invalid header") || e.originalMessage.includes("Unsafe header") || e.originalMessage.includes("Expected \"header\"") || e.originalMessage.includes("invalid argument")) throw e;
	P(e);
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/cdp/HTTPRequest.js
var no = class extends Xa {
	id;
	#e;
	#t;
	#n;
	#r;
	#i;
	#a = !1;
	#o;
	#s = {};
	#c;
	#l;
	get client() {
		return this.#e;
	}
	set client(e) {
		this.#e = e;
	}
	constructor(e, t, n, r, i, a) {
		super(), this.#e = e, this.id = i.requestId, this.#t = i.requestId === i.loaderId && i.type === "Document", this._interceptionId = n, this.#n = i.request.url + (i.request.urlFragment ?? ""), this.#r = (i.type || "other").toLowerCase(), this.#i = i.request.method, this.#o = i.request.postDataEntries && i.request.postDataEntries.length > 0 ? new TextDecoder().decode(pn(i.request.postDataEntries.map((e) => e.bytes ? un(e.bytes, !0) : null).filter((e) => e !== null))) : i.request.postData, this.#a = i.request.hasPostData ?? !1, this.#c = t, this._redirectChain = a, this.#l = i.initiator, this.interception.enabled = r, this.updateHeaders(i.request.headers);
	}
	updateHeaders(e) {
		for (let [t, n] of Object.entries(e)) this.#s[t.toLowerCase()] = n;
	}
	url() {
		return this.#n;
	}
	resourceType() {
		return this.#r;
	}
	method() {
		return this.#i;
	}
	postData() {
		return this.#o;
	}
	hasPostData() {
		return this.#a;
	}
	async fetchPostData() {
		try {
			return (await this.#e.send("Network.getRequestPostData", { requestId: this.id })).postData;
		} catch (e) {
			P(e);
			return;
		}
	}
	headers() {
		return structuredClone(this.#s);
	}
	response() {
		return this._response;
	}
	frame() {
		return this.#c;
	}
	isNavigationRequest() {
		return this.#t;
	}
	initiator() {
		return this.#l;
	}
	redirectChain() {
		return this._redirectChain.slice();
	}
	failure() {
		return this._failureText ? { errorText: this._failureText } : null;
	}
	canBeIntercepted() {
		return !this.url().startsWith("data:") && !this._fromMemoryCache;
	}
	async _continue(e = {}) {
		let { url: t, method: n, postData: r, headers: i } = e;
		this.interception.handled = !0;
		let a = r ? dn(r) : void 0;
		if (this._interceptionId === void 0) throw Error("HTTPRequest is missing _interceptionId needed for Fetch.continueRequest");
		await this.#e.send("Fetch.continueRequest", {
			requestId: this._interceptionId,
			url: t,
			method: n,
			postData: a,
			headers: i ? Qa(i) : void 0
		}).catch((e) => (this.interception.handled = !1, to(e)));
	}
	async _respond(e) {
		this.interception.handled = !0;
		let t;
		e.body && (t = Xa.getResponse(e.body));
		let n = {};
		if (e.headers) for (let t of Object.keys(e.headers)) {
			let r = e.headers[t];
			n[t.toLowerCase()] = Array.isArray(r) ? r.map((e) => String(e)) : String(r);
		}
		e.contentType && (n["content-type"] = e.contentType), t?.contentLength && !("content-length" in n) && (n["content-length"] = String(t.contentLength));
		let r = e.status || 200;
		if (this._interceptionId === void 0) throw Error("HTTPRequest is missing _interceptionId needed for Fetch.fulfillRequest");
		await this.#e.send("Fetch.fulfillRequest", {
			requestId: this._interceptionId,
			responseCode: r,
			responsePhrase: $a[r],
			responseHeaders: Qa(n),
			body: t?.base64
		}).catch((e) => (this.interception.handled = !1, to(e)));
	}
	async _abort(e) {
		if (this.interception.handled = !0, this._interceptionId === void 0) throw Error("HTTPRequest is missing _interceptionId needed for Fetch.failRequest");
		await this.#e.send("Fetch.failRequest", {
			requestId: this._interceptionId,
			errorReason: e || "Failed"
		}).catch(to);
	}
}, ro = class {
	constructor() {}
	ok() {
		let e = this.status();
		return e === 0 || e >= 200 && e <= 299;
	}
	async buffer() {
		let e = await this.content();
		return Buffer.from(e);
	}
	async text() {
		let e = await this.content();
		return new TextDecoder("utf-8", { fatal: !0 }).decode(e);
	}
	async json() {
		let e = await this.text();
		return JSON.parse(e);
	}
}, io = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	constructor(e) {
		this.#e = e.subjectName, this.#t = e.issuer, this.#n = e.validFrom, this.#r = e.validTo, this.#i = e.protocol, this.#a = e.sanList;
	}
	issuer() {
		return this.#t;
	}
	validFrom() {
		return this.#n;
	}
	validTo() {
		return this.#r;
	}
	protocol() {
		return this.#i;
	}
	subjectName() {
		return this.#e;
	}
	subjectAlternativeNames() {
		return this.#a;
	}
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/util/httpUtils.js
function ao(e) {
	return e.includes("\n") ? e.split("\n").map((e) => e.trim()).filter(Boolean).join(", ") : e;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/cdp/HTTPResponse.js
var oo = class extends ro {
	#e;
	#t = null;
	#n = z.create();
	#r;
	#i;
	#a;
	#o;
	#s;
	#c = {};
	#l;
	#u;
	constructor(e, t, n) {
		super(), this.#e = e, this.#r = {
			ip: t.remoteIPAddress,
			port: t.remotePort
		}, this.#a = this.#d(n) || t.statusText, this.#o = !!t.fromDiskCache, this.#s = !!t.fromServiceWorker, this.#i = n ? n.statusCode : t.status;
		let r = n ? n.headers : t.headers;
		for (let [e, t] of Object.entries(r)) this.#c[e.toLowerCase()] = ao(t);
		this.#l = t.securityDetails ? new io(t.securityDetails) : null, this.#u = t.timing || null;
	}
	#d(e) {
		if (!e || !e.headersText) return;
		let t = e.headersText.split("\r", 1)[0];
		if (!t || t.length > 1e3) return;
		let n = t.match(/[^ ]* [^ ]* (.*)/);
		if (!n) return;
		let r = n[1];
		if (r) return r;
	}
	_resolveBody(e) {
		return e ? this.#n.reject(e) : this.#n.resolve();
	}
	remoteAddress() {
		return this.#r;
	}
	url() {
		return this.#e.url();
	}
	status() {
		return this.#i;
	}
	statusText() {
		return this.#a;
	}
	headers() {
		return this.#c;
	}
	securityDetails() {
		return this.#l;
	}
	timing() {
		return this.#u;
	}
	content() {
		return this.#t ||= this.#n.valueOrThrow().then(async () => {
			try {
				let e = await this.#e.client.send("Network.getResponseBody", { requestId: this.#e.id });
				return un(e.body, e.base64Encoded);
			} catch (e) {
				throw e instanceof Cn && e.originalMessage === "No resource with given identifier found" ? new Cn("Could not load response body for this request. This might happen if the request is a preflight request.") : e;
			}
		}), this.#t;
	}
	request() {
		return this.#e;
	}
	fromCache() {
		return this.#o || this.#e._fromMemoryCache;
	}
	fromServiceWorker() {
		return this.#s;
	}
	frame() {
		return this.#e.frame();
	}
}, so = class {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Map();
	#i = /* @__PURE__ */ new Map();
	#a = /* @__PURE__ */ new Map();
	#o = /* @__PURE__ */ new Map();
	forget(e) {
		this.#e.delete(e), this.#t.delete(e), this.#r.delete(e), this.#o.delete(e), this.#a.delete(e), this.#i.delete(e);
	}
	requestExtraInfo(e) {
		return this.#r.has(e) || this.#r.set(e, []), this.#r.get(e);
	}
	responseExtraInfo(e) {
		return this.#i.has(e) || this.#i.set(e, []), this.#i.get(e);
	}
	queuedRedirectInfo(e) {
		return this.#a.has(e) || this.#a.set(e, []), this.#a.get(e);
	}
	queueRedirectInfo(e, t) {
		this.queuedRedirectInfo(e).push(t);
	}
	takeQueuedRedirectInfo(e) {
		return this.queuedRedirectInfo(e).shift();
	}
	inFlightRequestsCount() {
		let e = 0;
		for (let t of this.#n.values()) t.response() || e++;
		return e;
	}
	storeRequestWillBeSent(e, t) {
		this.#e.set(e, t);
	}
	getRequestWillBeSent(e) {
		return this.#e.get(e);
	}
	forgetRequestWillBeSent(e) {
		this.#e.delete(e);
	}
	getRequestPaused(e) {
		return this.#t.get(e);
	}
	forgetRequestPaused(e) {
		this.#t.delete(e);
	}
	storeRequestPaused(e, t) {
		this.#t.set(e, t);
	}
	getRequest(e) {
		return this.#n.get(e);
	}
	storeRequest(e, t) {
		this.#n.set(e, t);
	}
	forgetRequest(e) {
		this.#n.delete(e);
	}
	getQueuedEventGroup(e) {
		return this.#o.get(e);
	}
	queueEventGroup(e, t) {
		this.#o.set(e, t);
	}
	forgetQueuedEventGroup(e) {
		this.#o.delete(e);
	}
	printState() {
		function e(e, t) {
			return t instanceof Map ? {
				dataType: "Map",
				value: Array.from(t.entries())
			} : t instanceof no ? {
				dataType: "CdpHTTPRequest",
				value: `${t.id}: ${t.url()}`
			} : t;
		}
		console.log("httpRequestsMap", JSON.stringify(this.#n, e, 2)), console.log("requestWillBeSentMap", JSON.stringify(this.#e, e, 2)), console.log("requestWillBeSentMap", JSON.stringify(this.#i, e, 2)), console.log("requestWillBeSentMap", JSON.stringify(this.#t, e, 2));
	}
}, co = class extends L {
	#e;
	#t = new so();
	#n;
	#r = null;
	#i = /* @__PURE__ */ new Set();
	#a = !1;
	#o;
	#s;
	#c;
	#l;
	#u;
	#d;
	#f = [
		["Fetch.requestPaused", this.#T],
		["Fetch.authRequired", this.#w],
		["Network.requestWillBeSent", this.#C],
		["Network.requestWillBeSentExtraInfo", this.#k],
		["Network.requestServedFromCache", this.#A],
		["Network.responseReceived", this.#N],
		["Network.loadingFinished", this.#I],
		["Network.loadingFailed", this.#R],
		["Network.responseReceivedExtraInfo", this.#P],
		[R.Disconnected, this.#g]
	];
	#p = /* @__PURE__ */ new Map();
	#m = !0;
	constructor(e, t) {
		super(), this.#e = e, this.#m = t ?? !0;
	}
	#h(e) {
		return kr(e) && (Jr(e) || e.message.includes("Not supported") || e.message.includes("wasn't found"));
	}
	async addClient(e) {
		if (!this.#m || this.#p.has(e)) return;
		let t = new rn();
		this.#p.set(e, t);
		let n = t.use(new L(e));
		for (let [t, r] of this.#f) n.on(t, (t) => r.bind(this)(e, t));
		try {
			await Promise.all([
				e.send("Network.enable"),
				this.#_(e),
				this.#y(e),
				this.#S(e),
				this.#x(e),
				this.#b(e)
			]);
		} catch (e) {
			if (this.#h(e)) return;
			throw e;
		}
	}
	async #g(e) {
		this.#p.get(e)?.dispose(), this.#p.delete(e);
	}
	async authenticate(e) {
		this.#r = e;
		let t = this.#a || !!this.#r;
		t !== this.#o && (this.#o = t, await this.#v(this.#x.bind(this)));
	}
	async setExtraHTTPHeaders(e) {
		let t = {};
		for (let [n, r] of Object.entries(e)) N(jn(r), `Expected value of header "${n}" to be String, but "${typeof r}" is found.`), t[n.toLowerCase()] = r;
		this.#n = t, await this.#v(this.#_.bind(this));
	}
	async #_(e) {
		if (this.#n !== void 0) try {
			await e.send("Network.setExtraHTTPHeaders", { headers: this.#n });
		} catch (e) {
			if (this.#h(e)) return;
			throw e;
		}
	}
	extraHTTPHeaders() {
		return Object.assign({}, this.#n);
	}
	inFlightRequestsCount() {
		return this.#t.inFlightRequestsCount();
	}
	async setOfflineMode(e) {
		this.#c ||= {
			offline: !1,
			upload: -1,
			download: -1,
			latency: 0
		}, this.#c.offline = e, await this.#v(this.#y.bind(this));
	}
	async emulateNetworkConditions(e) {
		this.#c ||= {
			offline: e?.offline ?? !1,
			upload: -1,
			download: -1,
			latency: 0
		}, this.#c.upload = e ? e.upload : -1, this.#c.download = e ? e.download : -1, this.#c.latency = e ? e.latency : 0, this.#c.offline = e?.offline ?? !1, await this.#v(this.#y.bind(this));
	}
	async #v(e) {
		await Promise.all(Array.from(this.#p.keys()).map((t) => e(t)));
	}
	async #y(e) {
		if (this.#c !== void 0) try {
			await e.send("Network.emulateNetworkConditions", {
				offline: this.#c.offline,
				latency: this.#c.latency,
				uploadThroughput: this.#c.upload,
				downloadThroughput: this.#c.download
			});
		} catch (e) {
			if (this.#h(e)) return;
			throw e;
		}
	}
	async setUserAgent(e, t, n) {
		this.#l = e, this.#u = t, this.#d = n, await this.#v(this.#b.bind(this));
	}
	async #b(e) {
		if (this.#l !== void 0) try {
			await e.send("Network.setUserAgentOverride", {
				userAgent: this.#l,
				userAgentMetadata: this.#u,
				platform: this.#d
			});
		} catch (e) {
			if (this.#h(e)) return;
			throw e;
		}
	}
	async setCacheEnabled(e) {
		this.#s = !e, await this.#v(this.#S.bind(this));
	}
	async setRequestInterception(e) {
		this.#a = e;
		let t = this.#a || !!this.#r;
		t !== this.#o && (this.#o = t, await this.#v(this.#x.bind(this)));
	}
	async #x(e) {
		if (this.#o !== void 0) {
			this.#s === void 0 && (this.#s = !1);
			try {
				this.#o ? await Promise.all([this.#S(e), e.send("Fetch.enable", {
					handleAuthRequests: !0,
					patterns: [{ urlPattern: "*" }]
				})]) : await Promise.all([this.#S(e), e.send("Fetch.disable")]);
			} catch (e) {
				if (this.#h(e)) return;
				throw e;
			}
		}
	}
	async #S(e) {
		if (this.#s !== void 0) try {
			await e.send("Network.setCacheDisabled", { cacheDisabled: this.#s });
		} catch (e) {
			if (this.#h(e)) return;
			throw e;
		}
	}
	#C(e, t) {
		if (this.#a && !t.request.url.startsWith("data:")) {
			let { requestId: n } = t;
			this.#t.storeRequestWillBeSent(n, t);
			let r = this.#t.getRequestPaused(n);
			if (r) {
				let { requestId: i } = r;
				this.#E(t, r), this.#O(e, t, i), this.#t.forgetRequestPaused(n);
			}
			return;
		}
		this.#O(e, t, void 0);
	}
	#w(e, t) {
		let n = "Default";
		this.#i.has(t.requestId) ? n = "CancelAuth" : this.#r && (n = "ProvideCredentials", this.#i.add(t.requestId));
		let { username: r, password: i } = this.#r || {
			username: void 0,
			password: void 0
		};
		e.send("Fetch.continueWithAuth", {
			requestId: t.requestId,
			authChallengeResponse: {
				response: n,
				username: r,
				password: i
			}
		}).catch(P);
	}
	#T(e, t) {
		!this.#a && this.#o && e.send("Fetch.continueRequest", { requestId: t.requestId }).catch(P);
		let { networkId: n, requestId: r } = t;
		if (!n) {
			this.#D(e, t);
			return;
		}
		let i = (() => {
			let e = this.#t.getRequestWillBeSent(n);
			if (e && (e.request.url !== t.request.url || e.request.method !== t.request.method)) {
				this.#t.forgetRequestWillBeSent(n);
				return;
			}
			return e;
		})();
		i ? (this.#E(i, t), this.#O(e, i, r)) : this.#t.storeRequestPaused(n, t);
	}
	#E(e, t) {
		e.request.headers = {
			...e.request.headers,
			...t.request.headers
		};
	}
	#D(e, t) {
		let n = new no(e, t.frameId ? this.#e.frame(t.frameId) : null, t.requestId, this.#a, t, []);
		this.emit(H.Request, n), n.finalizeInterceptions();
	}
	#O(e, t, n, r = !1) {
		let i = [];
		if (t.redirectResponse) {
			let r = null;
			if (t.redirectHasExtraInfo && (r = this.#t.responseExtraInfo(t.requestId).shift(), !r)) {
				this.#t.queueRedirectInfo(t.requestId, {
					event: t,
					fetchRequestId: n
				});
				return;
			}
			let a = this.#t.getRequest(t.requestId);
			if (a) {
				this.#j(e, a, t.redirectResponse, r), i = a._redirectChain;
				let n = this.#t.requestExtraInfo(t.requestId).shift();
				n && a.updateHeaders(n.headers);
			}
		}
		let a = new no(e, t.frameId ? this.#e.frame(t.frameId) : null, n, this.#a, t, i), o = this.#t.requestExtraInfo(t.requestId).shift();
		o && a.updateHeaders(o.headers), a._fromMemoryCache = r, this.#t.storeRequest(t.requestId, a), this.emit(H.Request, a), a.finalizeInterceptions();
	}
	#k(e, t) {
		let n = this.#t.getRequest(t.requestId);
		n ? n.updateHeaders(t.headers) : this.#t.requestExtraInfo(t.requestId).push(t);
	}
	#A(e, t) {
		let n = this.#t.getRequestWillBeSent(t.requestId), r = this.#t.getRequest(t.requestId);
		if (r && (r._fromMemoryCache = !0), !r && n && (this.#O(e, n, void 0, !0), r = this.#t.getRequest(t.requestId)), !r) {
			P(/* @__PURE__ */ Error(`Request ${t.requestId} was served from cache but we could not find the corresponding request object`));
			return;
		}
		this.emit(H.RequestServedFromCache, r);
	}
	#j(e, t, n, r) {
		let i = new oo(t, n, r);
		t._response = i, t._redirectChain.push(t), i._resolveBody(/* @__PURE__ */ Error("Response body is unavailable for redirect responses")), this.#F(t, !1), this.emit(H.Response, i), this.emit(H.RequestFinished, t);
	}
	#M(e, t, n) {
		let r = this.#t.getRequest(t.requestId);
		if (!r) return;
		this.#t.responseExtraInfo(t.requestId).length && P(/* @__PURE__ */ Error("Unexpected extraInfo events for request " + t.requestId)), t.response.fromDiskCache && (n = null);
		let i = new oo(r, t.response, n);
		r._response = i, this.emit(H.Response, i);
	}
	#N(e, t) {
		let n = this.#t.getRequest(t.requestId), r = null;
		if (n && !n._fromMemoryCache && t.hasExtraInfo && (r = this.#t.responseExtraInfo(t.requestId).shift(), !r)) {
			this.#t.queueEventGroup(t.requestId, { responseReceivedEvent: t });
			return;
		}
		this.#M(e, t, r);
	}
	#P(e, t) {
		let n = this.#t.takeQueuedRedirectInfo(t.requestId);
		if (n) {
			this.#t.responseExtraInfo(t.requestId).push(t), this.#O(e, n.event, n.fetchRequestId);
			return;
		}
		let r = this.#t.getQueuedEventGroup(t.requestId);
		if (r) {
			this.#t.forgetQueuedEventGroup(t.requestId), this.#M(e, r.responseReceivedEvent, t), r.loadingFinishedEvent && this.#L(e, r.loadingFinishedEvent), r.loadingFailedEvent && this.#z(e, r.loadingFailedEvent);
			return;
		}
		this.#t.responseExtraInfo(t.requestId).push(t);
	}
	#F(e, t) {
		let n = e.id, r = e._interceptionId;
		this.#t.forgetRequest(n), r !== void 0 && this.#i.delete(r), t && this.#t.forget(n);
	}
	#I(e, t) {
		let n = this.#t.getQueuedEventGroup(t.requestId);
		n ? n.loadingFinishedEvent = t : this.#L(e, t);
	}
	#L(e, t) {
		let n = this.#t.getRequest(t.requestId);
		n && (this.#B(e, n), n.response() && n.response()?._resolveBody(), this.#F(n, !0), this.emit(H.RequestFinished, n));
	}
	#R(e, t) {
		let n = this.#t.getQueuedEventGroup(t.requestId);
		n ? n.loadingFailedEvent = t : this.#z(e, t);
	}
	#z(e, t) {
		let n = this.#t.getRequest(t.requestId);
		if (!n) return;
		this.#B(e, n), n._failureText = t.errorText;
		let r = n.response();
		r && r._resolveBody(), this.#F(n, !0), this.emit(H.RequestFailed, n);
	}
	#B(e, t) {
		e !== t.client && (t.client = e);
	}
}, lo = 100, uo = "chrome-extension://", fo = class extends L {
	#e;
	#t;
	#n;
	#r = /* @__PURE__ */ new Set();
	#i;
	#a = /* @__PURE__ */ new Map();
	#o = /* @__PURE__ */ new Set();
	_frameTree = new Ya();
	#s = /* @__PURE__ */ new Set();
	#c = /* @__PURE__ */ new WeakMap();
	#l;
	get timeoutSettings() {
		return this.#n;
	}
	get networkManager() {
		return this.#t;
	}
	get client() {
		return this.#i;
	}
	constructor(e, t, n) {
		super(), this.#i = e, this.#e = t, this.#t = new co(this, t.browser().isNetworkEnabled()), this.#n = n, this.setupEventListeners(this.#i), e.once(R.Disconnected, () => {
			this.#u().catch(P);
		});
	}
	async #u() {
		let e = this._frameTree.getMainFrame();
		if (!e) return;
		if (!this.#e.browser().connected) {
			this.#C(e);
			return;
		}
		for (let t of e.childFrames()) this.#C(t);
		let t = z.create({
			timeout: lo,
			message: "Frame was not swapped"
		});
		e.once(W.FrameSwappedByActivation, () => {
			t.resolve();
		});
		try {
			await t.valueOrThrow();
		} catch {
			this.#C(e);
		}
	}
	async swapFrameTree(e) {
		this.#i = e;
		let t = this._frameTree.getMainFrame();
		t && (this.#s.add(this.#i.target()._targetId), this._frameTree.removeFrame(t), t.updateId(this.#i.target()._targetId), this._frameTree.addFrame(t), t.updateClient(e)), this.setupEventListeners(e), e.once(R.Disconnected, () => {
			this.#u().catch(P);
		}), await this.initialize(e, t), await this.#t.addClient(e), t && t.emit(W.FrameSwappedByActivation, void 0);
	}
	async registerSpeculativeSession(e) {
		await this.#t.addClient(e);
	}
	setupEventListeners(e) {
		e.on("Page.frameAttached", async (t) => {
			await this.#l?.valueOrThrow(), this.#h(e, t.frameId, t.parentFrameId);
		}), e.on("Page.frameNavigated", async (e) => {
			this.#s.add(e.frame.id), await this.#l?.valueOrThrow(), this.#g(e.frame, e.type);
		}), e.on("Page.navigatedWithinDocument", async (e) => {
			await this.#l?.valueOrThrow(), this.#v(e.frameId, e.url);
		}), e.on("Page.frameDetached", async (e) => {
			await this.#l?.valueOrThrow(), this.#y(e.frameId, e.reason);
		}), e.on("Page.frameStartedLoading", async (e) => {
			await this.#l?.valueOrThrow(), this.#f(e.frameId);
		}), e.on("Page.frameStoppedLoading", async (e) => {
			await this.#l?.valueOrThrow(), this.#p(e.frameId);
		}), e.on("Runtime.executionContextCreated", async (t) => {
			await this.#l?.valueOrThrow(), this.#S(t.context, e);
		}), e.on("Page.lifecycleEvent", async (e) => {
			await this.#l?.valueOrThrow(), this.#d(e);
		}), e.on("Audits.issueAdded", (e) => {
			this.#e.emit("issue", new Zi(e.issue));
		});
	}
	async initialize(e, t) {
		try {
			this.#l?.resolve(), this.#l = z.create(), await Promise.all([
				this.#t.addClient(e),
				e.send("Page.enable"),
				e.send("Page.getFrameTree").then(({ frameTree: t }) => {
					this.#m(e, t), this.#l?.resolve();
				}),
				e.send("Page.setLifecycleEventsEnabled", { enabled: !0 }),
				e.send("Runtime.enable").then(() => this.#_(e, zn)),
				...(t ? Array.from(this.#a.values()) : []).map((e) => t?.addPreloadScript(e)),
				...(t ? Array.from(this.#o.values()) : []).map((e) => t?.addExposedFunctionBinding(e)),
				this.#e.browser().isIssuesEnabled() && e.send("Audits.enable")
			]);
		} catch (e) {
			if (this.#l?.resolve(), kr(e) && Jr(e)) return;
			throw e;
		}
	}
	page() {
		return this.#e;
	}
	mainFrame() {
		let e = this._frameTree.getMainFrame();
		return N(e, "Requesting main frame too early!"), e;
	}
	frames() {
		return Array.from(this._frameTree.frames());
	}
	frame(e) {
		return this._frameTree.getById(e) || null;
	}
	async addExposedFunctionBinding(e) {
		this.#o.add(e), await Promise.all(this.frames().map(async (t) => await t.addExposedFunctionBinding(e)));
	}
	async removeExposedFunctionBinding(e) {
		this.#o.delete(e), await Promise.all(this.frames().map(async (t) => await t.removeExposedFunctionBinding(e)));
	}
	async evaluateOnNewDocument(e) {
		let { identifier: t } = await this.mainFrame()._client().send("Page.addScriptToEvaluateOnNewDocument", { source: e }), n = new Qi(this.mainFrame(), t, e);
		return this.#a.set(t, n), await Promise.all(this.frames().map(async (e) => await e.addPreloadScript(n))), { identifier: t };
	}
	async removeScriptToEvaluateOnNewDocument(e) {
		let t = this.#a.get(e);
		if (!t) throw Error(`Script to evaluate on new document with id ${e} not found`);
		this.#a.delete(e), await Promise.all(this.frames().map((e) => {
			let n = t.getIdForFrame(e);
			if (n) return e._client().send("Page.removeScriptToEvaluateOnNewDocument", { identifier: n }).catch(P);
		}));
	}
	onAttachedToTarget(e) {
		if (e._getTargetInfo().type !== "iframe") return;
		let t = this.frame(e._getTargetInfo().targetId);
		t && t.updateClient(e._session()), this.setupEventListeners(e._session()), this.initialize(e._session(), t).catch(P);
	}
	_deviceRequestPromptManager(e) {
		let t = this.#c.get(e);
		return t === void 0 && (t = new ta(e, this.#n), this.#c.set(e, t)), t;
	}
	#d(e) {
		let t = this.frame(e.frameId);
		t && (t._onLifecycleEvent(e.loaderId, e.name), this.emit(J.LifecycleEvent, t), t.emit(W.LifecycleEvent, void 0));
	}
	#f(e) {
		let t = this.frame(e);
		t && t._onLoadingStarted();
	}
	#p(e) {
		let t = this.frame(e);
		t && (t._onLoadingStopped(), this.emit(J.LifecycleEvent, t), t.emit(W.LifecycleEvent, void 0));
	}
	#m(e, t) {
		if (t.frame.parentId && this.#h(e, t.frame.id, t.frame.parentId), this.#s.has(t.frame.id) ? this.#s.delete(t.frame.id) : this.#g(t.frame, "Navigation"), t.childFrames) for (let n of t.childFrames) this.#m(e, n);
	}
	#h(e, t, n) {
		let r = this.frame(t);
		if (r) {
			let t = this.frame(n);
			e && t && r.client !== t?.client && r.updateClient(e);
			return;
		}
		r = new qa(this, t, n, e), this._frameTree.addFrame(r), this.emit(J.FrameAttached, r);
	}
	async #g(e, t) {
		let n = e.id, r = !e.parentId, i = this._frameTree.getById(n);
		if (i) for (let e of i.childFrames()) this.#C(e);
		r && (i ? (this._frameTree.removeFrame(i), i._id = n) : i = new qa(this, n, void 0, this.#i), this._frameTree.addFrame(i)), i = await this._frameTree.waitForFrame(n), i._navigated(e), this.emit(J.FrameNavigated, i), i.emit(W.FrameNavigated, t);
	}
	async #_(e, t) {
		let n = `${e.id()}:${t}`;
		this.#r.has(n) || (await e.send("Page.addScriptToEvaluateOnNewDocument", {
			source: `//# sourceURL=${kn.INTERNAL_URL}`,
			worldName: t
		}), await Promise.all(this.frames().filter((t) => t.client === e).map((n) => e.send("Page.createIsolatedWorld", {
			frameId: n._id,
			worldName: t,
			grantUniveralAccess: !0
		}).catch(P))), this.#r.add(n));
	}
	#v(e, t) {
		let n = this.frame(e);
		n && (n._navigatedWithinDocument(t), this.emit(J.FrameNavigatedWithinDocument, n), n.emit(W.FrameNavigatedWithinDocument, void 0), this.emit(J.FrameNavigated, n), n.emit(W.FrameNavigated, "Navigation"));
	}
	#y(e, t) {
		let n = this.frame(e);
		if (n) switch (t) {
			case "remove":
				this.#C(n);
				break;
			case "swap": this.emit(J.FrameSwapped, n), n.emit(W.FrameSwapped, void 0);
		}
	}
	#b(e) {
		return e.startsWith(uo);
	}
	#x(e) {
		if (!e || !this.#b(e)) return null;
		let t = e.substring(19), n = t.indexOf("/");
		return n === -1 ? t : t.substring(0, n);
	}
	#S(e, t) {
		let n = e.auxData, r = e.origin, i = n && n.frameId, a = typeof i == "string" ? this.frame(i) : void 0, o;
		if (a) {
			if (a.client !== t) return;
			if (e.auxData && e.auxData.isDefault) o = a.worlds[Ra];
			else if (e.name === zn) o = a.worlds[za];
			else if (this.#b(r)) {
				let e = this.#x(r);
				if (!e) {
					P("Error while parsing extension id");
					return;
				}
				a.extensionWorlds[e] ? o = a.extensionWorlds[e] : (o = new Ha(a, this.timeoutSettings, e), a.extensionWorlds[e] = o, a.registerWorldListeners(o), o.origin = r, o.setWorldId(e));
			}
		}
		if (!o) return;
		let s = new ka(a?.client || this.#i, e, o);
		o.setContext(s);
	}
	#C(e) {
		for (let t of e.childFrames()) this.#C(t);
		this._frameTree.removeFrame(e), this.emit(J.FrameDetached, e), e.emit(W.FrameDetached, e), e[j]();
	}
}, po = class {
	constructor() {}
}, X = Object.freeze({
	Left: "left",
	Right: "right",
	Middle: "middle",
	Back: "back",
	Forward: "forward"
}), mo = class {
	constructor() {}
}, ho = class {
	idGenerator = Wr();
	touches = [];
	constructor() {}
	removeHandle(e) {
		let t = this.touches.indexOf(e);
		t !== -1 && this.touches.splice(t, 1);
	}
	async tap(e, t) {
		await (await this.touchStart(e, t)).end();
	}
	async touchMove(e, t) {
		let n = this.touches[0];
		if (!n) throw new Sn("Must start a new Touch first");
		return await n.move(e, t);
	}
	async touchEnd() {
		let e = this.touches.shift();
		if (!e) throw new Sn("Must start a new Touch first");
		await e.end();
	}
}, go = {
	0: {
		keyCode: 48,
		key: "0",
		code: "Digit0"
	},
	1: {
		keyCode: 49,
		key: "1",
		code: "Digit1"
	},
	2: {
		keyCode: 50,
		key: "2",
		code: "Digit2"
	},
	3: {
		keyCode: 51,
		key: "3",
		code: "Digit3"
	},
	4: {
		keyCode: 52,
		key: "4",
		code: "Digit4"
	},
	5: {
		keyCode: 53,
		key: "5",
		code: "Digit5"
	},
	6: {
		keyCode: 54,
		key: "6",
		code: "Digit6"
	},
	7: {
		keyCode: 55,
		key: "7",
		code: "Digit7"
	},
	8: {
		keyCode: 56,
		key: "8",
		code: "Digit8"
	},
	9: {
		keyCode: 57,
		key: "9",
		code: "Digit9"
	},
	Power: {
		key: "Power",
		code: "Power"
	},
	Eject: {
		key: "Eject",
		code: "Eject"
	},
	Abort: {
		keyCode: 3,
		code: "Abort",
		key: "Cancel"
	},
	Help: {
		keyCode: 6,
		code: "Help",
		key: "Help"
	},
	Backspace: {
		keyCode: 8,
		code: "Backspace",
		key: "Backspace"
	},
	Tab: {
		keyCode: 9,
		code: "Tab",
		key: "Tab"
	},
	Numpad5: {
		keyCode: 12,
		shiftKeyCode: 101,
		key: "Clear",
		code: "Numpad5",
		shiftKey: "5",
		location: 3
	},
	NumpadEnter: {
		keyCode: 13,
		code: "NumpadEnter",
		key: "Enter",
		text: "\r",
		location: 3
	},
	Enter: {
		keyCode: 13,
		code: "Enter",
		key: "Enter",
		text: "\r"
	},
	"\r": {
		keyCode: 13,
		code: "Enter",
		key: "Enter",
		text: "\r"
	},
	"\n": {
		keyCode: 13,
		code: "Enter",
		key: "Enter",
		text: "\r"
	},
	ShiftLeft: {
		keyCode: 16,
		code: "ShiftLeft",
		key: "Shift",
		location: 1
	},
	ShiftRight: {
		keyCode: 16,
		code: "ShiftRight",
		key: "Shift",
		location: 2
	},
	ControlLeft: {
		keyCode: 17,
		code: "ControlLeft",
		key: "Control",
		location: 1
	},
	ControlRight: {
		keyCode: 17,
		code: "ControlRight",
		key: "Control",
		location: 2
	},
	AltLeft: {
		keyCode: 18,
		code: "AltLeft",
		key: "Alt",
		location: 1
	},
	AltRight: {
		keyCode: 18,
		code: "AltRight",
		key: "Alt",
		location: 2
	},
	Pause: {
		keyCode: 19,
		code: "Pause",
		key: "Pause"
	},
	CapsLock: {
		keyCode: 20,
		code: "CapsLock",
		key: "CapsLock"
	},
	Escape: {
		keyCode: 27,
		code: "Escape",
		key: "Escape"
	},
	Convert: {
		keyCode: 28,
		code: "Convert",
		key: "Convert"
	},
	NonConvert: {
		keyCode: 29,
		code: "NonConvert",
		key: "NonConvert"
	},
	Space: {
		keyCode: 32,
		code: "Space",
		key: " "
	},
	Numpad9: {
		keyCode: 33,
		shiftKeyCode: 105,
		key: "PageUp",
		code: "Numpad9",
		shiftKey: "9",
		location: 3
	},
	PageUp: {
		keyCode: 33,
		code: "PageUp",
		key: "PageUp"
	},
	Numpad3: {
		keyCode: 34,
		shiftKeyCode: 99,
		key: "PageDown",
		code: "Numpad3",
		shiftKey: "3",
		location: 3
	},
	PageDown: {
		keyCode: 34,
		code: "PageDown",
		key: "PageDown"
	},
	End: {
		keyCode: 35,
		code: "End",
		key: "End"
	},
	Numpad1: {
		keyCode: 35,
		shiftKeyCode: 97,
		key: "End",
		code: "Numpad1",
		shiftKey: "1",
		location: 3
	},
	Home: {
		keyCode: 36,
		code: "Home",
		key: "Home"
	},
	Numpad7: {
		keyCode: 36,
		shiftKeyCode: 103,
		key: "Home",
		code: "Numpad7",
		shiftKey: "7",
		location: 3
	},
	ArrowLeft: {
		keyCode: 37,
		code: "ArrowLeft",
		key: "ArrowLeft"
	},
	Numpad4: {
		keyCode: 37,
		shiftKeyCode: 100,
		key: "ArrowLeft",
		code: "Numpad4",
		shiftKey: "4",
		location: 3
	},
	Numpad8: {
		keyCode: 38,
		shiftKeyCode: 104,
		key: "ArrowUp",
		code: "Numpad8",
		shiftKey: "8",
		location: 3
	},
	ArrowUp: {
		keyCode: 38,
		code: "ArrowUp",
		key: "ArrowUp"
	},
	ArrowRight: {
		keyCode: 39,
		code: "ArrowRight",
		key: "ArrowRight"
	},
	Numpad6: {
		keyCode: 39,
		shiftKeyCode: 102,
		key: "ArrowRight",
		code: "Numpad6",
		shiftKey: "6",
		location: 3
	},
	Numpad2: {
		keyCode: 40,
		shiftKeyCode: 98,
		key: "ArrowDown",
		code: "Numpad2",
		shiftKey: "2",
		location: 3
	},
	ArrowDown: {
		keyCode: 40,
		code: "ArrowDown",
		key: "ArrowDown"
	},
	Select: {
		keyCode: 41,
		code: "Select",
		key: "Select"
	},
	Open: {
		keyCode: 43,
		code: "Open",
		key: "Execute"
	},
	PrintScreen: {
		keyCode: 44,
		code: "PrintScreen",
		key: "PrintScreen"
	},
	Insert: {
		keyCode: 45,
		code: "Insert",
		key: "Insert"
	},
	Numpad0: {
		keyCode: 45,
		shiftKeyCode: 96,
		key: "Insert",
		code: "Numpad0",
		shiftKey: "0",
		location: 3
	},
	Delete: {
		keyCode: 46,
		code: "Delete",
		key: "Delete"
	},
	NumpadDecimal: {
		keyCode: 46,
		shiftKeyCode: 110,
		code: "NumpadDecimal",
		key: "\0",
		shiftKey: ".",
		location: 3
	},
	Digit0: {
		keyCode: 48,
		code: "Digit0",
		shiftKey: ")",
		key: "0"
	},
	Digit1: {
		keyCode: 49,
		code: "Digit1",
		shiftKey: "!",
		key: "1"
	},
	Digit2: {
		keyCode: 50,
		code: "Digit2",
		shiftKey: "@",
		key: "2"
	},
	Digit3: {
		keyCode: 51,
		code: "Digit3",
		shiftKey: "#",
		key: "3"
	},
	Digit4: {
		keyCode: 52,
		code: "Digit4",
		shiftKey: "$",
		key: "4"
	},
	Digit5: {
		keyCode: 53,
		code: "Digit5",
		shiftKey: "%",
		key: "5"
	},
	Digit6: {
		keyCode: 54,
		code: "Digit6",
		shiftKey: "^",
		key: "6"
	},
	Digit7: {
		keyCode: 55,
		code: "Digit7",
		shiftKey: "&",
		key: "7"
	},
	Digit8: {
		keyCode: 56,
		code: "Digit8",
		shiftKey: "*",
		key: "8"
	},
	Digit9: {
		keyCode: 57,
		code: "Digit9",
		shiftKey: "(",
		key: "9"
	},
	KeyA: {
		keyCode: 65,
		code: "KeyA",
		shiftKey: "A",
		key: "a"
	},
	KeyB: {
		keyCode: 66,
		code: "KeyB",
		shiftKey: "B",
		key: "b"
	},
	KeyC: {
		keyCode: 67,
		code: "KeyC",
		shiftKey: "C",
		key: "c"
	},
	KeyD: {
		keyCode: 68,
		code: "KeyD",
		shiftKey: "D",
		key: "d"
	},
	KeyE: {
		keyCode: 69,
		code: "KeyE",
		shiftKey: "E",
		key: "e"
	},
	KeyF: {
		keyCode: 70,
		code: "KeyF",
		shiftKey: "F",
		key: "f"
	},
	KeyG: {
		keyCode: 71,
		code: "KeyG",
		shiftKey: "G",
		key: "g"
	},
	KeyH: {
		keyCode: 72,
		code: "KeyH",
		shiftKey: "H",
		key: "h"
	},
	KeyI: {
		keyCode: 73,
		code: "KeyI",
		shiftKey: "I",
		key: "i"
	},
	KeyJ: {
		keyCode: 74,
		code: "KeyJ",
		shiftKey: "J",
		key: "j"
	},
	KeyK: {
		keyCode: 75,
		code: "KeyK",
		shiftKey: "K",
		key: "k"
	},
	KeyL: {
		keyCode: 76,
		code: "KeyL",
		shiftKey: "L",
		key: "l"
	},
	KeyM: {
		keyCode: 77,
		code: "KeyM",
		shiftKey: "M",
		key: "m"
	},
	KeyN: {
		keyCode: 78,
		code: "KeyN",
		shiftKey: "N",
		key: "n"
	},
	KeyO: {
		keyCode: 79,
		code: "KeyO",
		shiftKey: "O",
		key: "o"
	},
	KeyP: {
		keyCode: 80,
		code: "KeyP",
		shiftKey: "P",
		key: "p"
	},
	KeyQ: {
		keyCode: 81,
		code: "KeyQ",
		shiftKey: "Q",
		key: "q"
	},
	KeyR: {
		keyCode: 82,
		code: "KeyR",
		shiftKey: "R",
		key: "r"
	},
	KeyS: {
		keyCode: 83,
		code: "KeyS",
		shiftKey: "S",
		key: "s"
	},
	KeyT: {
		keyCode: 84,
		code: "KeyT",
		shiftKey: "T",
		key: "t"
	},
	KeyU: {
		keyCode: 85,
		code: "KeyU",
		shiftKey: "U",
		key: "u"
	},
	KeyV: {
		keyCode: 86,
		code: "KeyV",
		shiftKey: "V",
		key: "v"
	},
	KeyW: {
		keyCode: 87,
		code: "KeyW",
		shiftKey: "W",
		key: "w"
	},
	KeyX: {
		keyCode: 88,
		code: "KeyX",
		shiftKey: "X",
		key: "x"
	},
	KeyY: {
		keyCode: 89,
		code: "KeyY",
		shiftKey: "Y",
		key: "y"
	},
	KeyZ: {
		keyCode: 90,
		code: "KeyZ",
		shiftKey: "Z",
		key: "z"
	},
	MetaLeft: {
		keyCode: 91,
		code: "MetaLeft",
		key: "Meta",
		location: 1
	},
	MetaRight: {
		keyCode: 92,
		code: "MetaRight",
		key: "Meta",
		location: 2
	},
	ContextMenu: {
		keyCode: 93,
		code: "ContextMenu",
		key: "ContextMenu"
	},
	NumpadMultiply: {
		keyCode: 106,
		code: "NumpadMultiply",
		key: "*",
		location: 3
	},
	NumpadAdd: {
		keyCode: 107,
		code: "NumpadAdd",
		key: "+",
		location: 3
	},
	NumpadSubtract: {
		keyCode: 109,
		code: "NumpadSubtract",
		key: "-",
		location: 3
	},
	NumpadDivide: {
		keyCode: 111,
		code: "NumpadDivide",
		key: "/",
		location: 3
	},
	F1: {
		keyCode: 112,
		code: "F1",
		key: "F1"
	},
	F2: {
		keyCode: 113,
		code: "F2",
		key: "F2"
	},
	F3: {
		keyCode: 114,
		code: "F3",
		key: "F3"
	},
	F4: {
		keyCode: 115,
		code: "F4",
		key: "F4"
	},
	F5: {
		keyCode: 116,
		code: "F5",
		key: "F5"
	},
	F6: {
		keyCode: 117,
		code: "F6",
		key: "F6"
	},
	F7: {
		keyCode: 118,
		code: "F7",
		key: "F7"
	},
	F8: {
		keyCode: 119,
		code: "F8",
		key: "F8"
	},
	F9: {
		keyCode: 120,
		code: "F9",
		key: "F9"
	},
	F10: {
		keyCode: 121,
		code: "F10",
		key: "F10"
	},
	F11: {
		keyCode: 122,
		code: "F11",
		key: "F11"
	},
	F12: {
		keyCode: 123,
		code: "F12",
		key: "F12"
	},
	F13: {
		keyCode: 124,
		code: "F13",
		key: "F13"
	},
	F14: {
		keyCode: 125,
		code: "F14",
		key: "F14"
	},
	F15: {
		keyCode: 126,
		code: "F15",
		key: "F15"
	},
	F16: {
		keyCode: 127,
		code: "F16",
		key: "F16"
	},
	F17: {
		keyCode: 128,
		code: "F17",
		key: "F17"
	},
	F18: {
		keyCode: 129,
		code: "F18",
		key: "F18"
	},
	F19: {
		keyCode: 130,
		code: "F19",
		key: "F19"
	},
	F20: {
		keyCode: 131,
		code: "F20",
		key: "F20"
	},
	F21: {
		keyCode: 132,
		code: "F21",
		key: "F21"
	},
	F22: {
		keyCode: 133,
		code: "F22",
		key: "F22"
	},
	F23: {
		keyCode: 134,
		code: "F23",
		key: "F23"
	},
	F24: {
		keyCode: 135,
		code: "F24",
		key: "F24"
	},
	NumLock: {
		keyCode: 144,
		code: "NumLock",
		key: "NumLock"
	},
	ScrollLock: {
		keyCode: 145,
		code: "ScrollLock",
		key: "ScrollLock"
	},
	AudioVolumeMute: {
		keyCode: 173,
		code: "AudioVolumeMute",
		key: "AudioVolumeMute"
	},
	AudioVolumeDown: {
		keyCode: 174,
		code: "AudioVolumeDown",
		key: "AudioVolumeDown"
	},
	AudioVolumeUp: {
		keyCode: 175,
		code: "AudioVolumeUp",
		key: "AudioVolumeUp"
	},
	MediaTrackNext: {
		keyCode: 176,
		code: "MediaTrackNext",
		key: "MediaTrackNext"
	},
	MediaTrackPrevious: {
		keyCode: 177,
		code: "MediaTrackPrevious",
		key: "MediaTrackPrevious"
	},
	MediaStop: {
		keyCode: 178,
		code: "MediaStop",
		key: "MediaStop"
	},
	MediaPlayPause: {
		keyCode: 179,
		code: "MediaPlayPause",
		key: "MediaPlayPause"
	},
	Semicolon: {
		keyCode: 186,
		code: "Semicolon",
		shiftKey: ":",
		key: ";"
	},
	Equal: {
		keyCode: 187,
		code: "Equal",
		shiftKey: "+",
		key: "="
	},
	NumpadEqual: {
		keyCode: 187,
		code: "NumpadEqual",
		key: "=",
		location: 3
	},
	Comma: {
		keyCode: 188,
		code: "Comma",
		shiftKey: "<",
		key: ","
	},
	Minus: {
		keyCode: 189,
		code: "Minus",
		shiftKey: "_",
		key: "-"
	},
	Period: {
		keyCode: 190,
		code: "Period",
		shiftKey: ">",
		key: "."
	},
	Slash: {
		keyCode: 191,
		code: "Slash",
		shiftKey: "?",
		key: "/"
	},
	Backquote: {
		keyCode: 192,
		code: "Backquote",
		shiftKey: "~",
		key: "`"
	},
	BracketLeft: {
		keyCode: 219,
		code: "BracketLeft",
		shiftKey: "{",
		key: "["
	},
	Backslash: {
		keyCode: 220,
		code: "Backslash",
		shiftKey: "|",
		key: "\\"
	},
	BracketRight: {
		keyCode: 221,
		code: "BracketRight",
		shiftKey: "}",
		key: "]"
	},
	Quote: {
		keyCode: 222,
		code: "Quote",
		shiftKey: "\"",
		key: "'"
	},
	AltGraph: {
		keyCode: 225,
		code: "AltGraph",
		key: "AltGraph"
	},
	Props: {
		keyCode: 247,
		code: "Props",
		key: "CrSel"
	},
	Cancel: {
		keyCode: 3,
		key: "Cancel",
		code: "Abort"
	},
	Clear: {
		keyCode: 12,
		key: "Clear",
		code: "Numpad5",
		location: 3
	},
	Shift: {
		keyCode: 16,
		key: "Shift",
		code: "ShiftLeft",
		location: 1
	},
	Control: {
		keyCode: 17,
		key: "Control",
		code: "ControlLeft",
		location: 1
	},
	Alt: {
		keyCode: 18,
		key: "Alt",
		code: "AltLeft",
		location: 1
	},
	Accept: {
		keyCode: 30,
		key: "Accept"
	},
	ModeChange: {
		keyCode: 31,
		key: "ModeChange"
	},
	" ": {
		keyCode: 32,
		key: " ",
		code: "Space"
	},
	Print: {
		keyCode: 42,
		key: "Print"
	},
	Execute: {
		keyCode: 43,
		key: "Execute",
		code: "Open"
	},
	"\0": {
		keyCode: 46,
		key: "\0",
		code: "NumpadDecimal",
		location: 3
	},
	a: {
		keyCode: 65,
		key: "a",
		code: "KeyA"
	},
	b: {
		keyCode: 66,
		key: "b",
		code: "KeyB"
	},
	c: {
		keyCode: 67,
		key: "c",
		code: "KeyC"
	},
	d: {
		keyCode: 68,
		key: "d",
		code: "KeyD"
	},
	e: {
		keyCode: 69,
		key: "e",
		code: "KeyE"
	},
	f: {
		keyCode: 70,
		key: "f",
		code: "KeyF"
	},
	g: {
		keyCode: 71,
		key: "g",
		code: "KeyG"
	},
	h: {
		keyCode: 72,
		key: "h",
		code: "KeyH"
	},
	i: {
		keyCode: 73,
		key: "i",
		code: "KeyI"
	},
	j: {
		keyCode: 74,
		key: "j",
		code: "KeyJ"
	},
	k: {
		keyCode: 75,
		key: "k",
		code: "KeyK"
	},
	l: {
		keyCode: 76,
		key: "l",
		code: "KeyL"
	},
	m: {
		keyCode: 77,
		key: "m",
		code: "KeyM"
	},
	n: {
		keyCode: 78,
		key: "n",
		code: "KeyN"
	},
	o: {
		keyCode: 79,
		key: "o",
		code: "KeyO"
	},
	p: {
		keyCode: 80,
		key: "p",
		code: "KeyP"
	},
	q: {
		keyCode: 81,
		key: "q",
		code: "KeyQ"
	},
	r: {
		keyCode: 82,
		key: "r",
		code: "KeyR"
	},
	s: {
		keyCode: 83,
		key: "s",
		code: "KeyS"
	},
	t: {
		keyCode: 84,
		key: "t",
		code: "KeyT"
	},
	u: {
		keyCode: 85,
		key: "u",
		code: "KeyU"
	},
	v: {
		keyCode: 86,
		key: "v",
		code: "KeyV"
	},
	w: {
		keyCode: 87,
		key: "w",
		code: "KeyW"
	},
	x: {
		keyCode: 88,
		key: "x",
		code: "KeyX"
	},
	y: {
		keyCode: 89,
		key: "y",
		code: "KeyY"
	},
	z: {
		keyCode: 90,
		key: "z",
		code: "KeyZ"
	},
	Meta: {
		keyCode: 91,
		key: "Meta",
		code: "MetaLeft",
		location: 1
	},
	"*": {
		keyCode: 106,
		key: "*",
		code: "NumpadMultiply",
		location: 3
	},
	"+": {
		keyCode: 107,
		key: "+",
		code: "NumpadAdd",
		location: 3
	},
	"-": {
		keyCode: 109,
		key: "-",
		code: "NumpadSubtract",
		location: 3
	},
	"/": {
		keyCode: 111,
		key: "/",
		code: "NumpadDivide",
		location: 3
	},
	";": {
		keyCode: 186,
		key: ";",
		code: "Semicolon"
	},
	"=": {
		keyCode: 187,
		key: "=",
		code: "Equal"
	},
	",": {
		keyCode: 188,
		key: ",",
		code: "Comma"
	},
	".": {
		keyCode: 190,
		key: ".",
		code: "Period"
	},
	"`": {
		keyCode: 192,
		key: "`",
		code: "Backquote"
	},
	"[": {
		keyCode: 219,
		key: "[",
		code: "BracketLeft"
	},
	"\\": {
		keyCode: 220,
		key: "\\",
		code: "Backslash"
	},
	"]": {
		keyCode: 221,
		key: "]",
		code: "BracketRight"
	},
	"'": {
		keyCode: 222,
		key: "'",
		code: "Quote"
	},
	Attn: {
		keyCode: 246,
		key: "Attn"
	},
	CrSel: {
		keyCode: 247,
		key: "CrSel",
		code: "Props"
	},
	ExSel: {
		keyCode: 248,
		key: "ExSel"
	},
	EraseEof: {
		keyCode: 249,
		key: "EraseEof"
	},
	Play: {
		keyCode: 250,
		key: "Play"
	},
	ZoomOut: {
		keyCode: 251,
		key: "ZoomOut"
	},
	")": {
		keyCode: 48,
		key: ")",
		code: "Digit0"
	},
	"!": {
		keyCode: 49,
		key: "!",
		code: "Digit1"
	},
	"@": {
		keyCode: 50,
		key: "@",
		code: "Digit2"
	},
	"#": {
		keyCode: 51,
		key: "#",
		code: "Digit3"
	},
	$: {
		keyCode: 52,
		key: "$",
		code: "Digit4"
	},
	"%": {
		keyCode: 53,
		key: "%",
		code: "Digit5"
	},
	"^": {
		keyCode: 54,
		key: "^",
		code: "Digit6"
	},
	"&": {
		keyCode: 55,
		key: "&",
		code: "Digit7"
	},
	"(": {
		keyCode: 57,
		key: "(",
		code: "Digit9"
	},
	A: {
		keyCode: 65,
		key: "A",
		code: "KeyA"
	},
	B: {
		keyCode: 66,
		key: "B",
		code: "KeyB"
	},
	C: {
		keyCode: 67,
		key: "C",
		code: "KeyC"
	},
	D: {
		keyCode: 68,
		key: "D",
		code: "KeyD"
	},
	E: {
		keyCode: 69,
		key: "E",
		code: "KeyE"
	},
	F: {
		keyCode: 70,
		key: "F",
		code: "KeyF"
	},
	G: {
		keyCode: 71,
		key: "G",
		code: "KeyG"
	},
	H: {
		keyCode: 72,
		key: "H",
		code: "KeyH"
	},
	I: {
		keyCode: 73,
		key: "I",
		code: "KeyI"
	},
	J: {
		keyCode: 74,
		key: "J",
		code: "KeyJ"
	},
	K: {
		keyCode: 75,
		key: "K",
		code: "KeyK"
	},
	L: {
		keyCode: 76,
		key: "L",
		code: "KeyL"
	},
	M: {
		keyCode: 77,
		key: "M",
		code: "KeyM"
	},
	N: {
		keyCode: 78,
		key: "N",
		code: "KeyN"
	},
	O: {
		keyCode: 79,
		key: "O",
		code: "KeyO"
	},
	P: {
		keyCode: 80,
		key: "P",
		code: "KeyP"
	},
	Q: {
		keyCode: 81,
		key: "Q",
		code: "KeyQ"
	},
	R: {
		keyCode: 82,
		key: "R",
		code: "KeyR"
	},
	S: {
		keyCode: 83,
		key: "S",
		code: "KeyS"
	},
	T: {
		keyCode: 84,
		key: "T",
		code: "KeyT"
	},
	U: {
		keyCode: 85,
		key: "U",
		code: "KeyU"
	},
	V: {
		keyCode: 86,
		key: "V",
		code: "KeyV"
	},
	W: {
		keyCode: 87,
		key: "W",
		code: "KeyW"
	},
	X: {
		keyCode: 88,
		key: "X",
		code: "KeyX"
	},
	Y: {
		keyCode: 89,
		key: "Y",
		code: "KeyY"
	},
	Z: {
		keyCode: 90,
		key: "Z",
		code: "KeyZ"
	},
	":": {
		keyCode: 186,
		key: ":",
		code: "Semicolon"
	},
	"<": {
		keyCode: 188,
		key: "<",
		code: "Comma"
	},
	_: {
		keyCode: 189,
		key: "_",
		code: "Minus"
	},
	">": {
		keyCode: 190,
		key: ">",
		code: "Period"
	},
	"?": {
		keyCode: 191,
		key: "?",
		code: "Slash"
	},
	"~": {
		keyCode: 192,
		key: "~",
		code: "Backquote"
	},
	"{": {
		keyCode: 219,
		key: "{",
		code: "BracketLeft"
	},
	"|": {
		keyCode: 220,
		key: "|",
		code: "Backslash"
	},
	"}": {
		keyCode: 221,
		key: "}",
		code: "BracketRight"
	},
	"\"": {
		keyCode: 222,
		key: "\"",
		code: "Quote"
	},
	SoftLeft: {
		key: "SoftLeft",
		code: "SoftLeft",
		location: 4
	},
	SoftRight: {
		key: "SoftRight",
		code: "SoftRight",
		location: 4
	},
	Camera: {
		keyCode: 44,
		key: "Camera",
		code: "Camera",
		location: 4
	},
	Call: {
		key: "Call",
		code: "Call",
		location: 4
	},
	EndCall: {
		keyCode: 95,
		key: "EndCall",
		code: "EndCall",
		location: 4
	},
	VolumeDown: {
		keyCode: 182,
		key: "VolumeDown",
		code: "VolumeDown",
		location: 4
	},
	VolumeUp: {
		keyCode: 183,
		key: "VolumeUp",
		code: "VolumeUp",
		location: 4
	}
}, _o = class extends po {
	#e;
	#t = /* @__PURE__ */ new Set();
	_modifiers = 0;
	constructor(e) {
		super(), this.#e = e;
	}
	updateClient(e) {
		this.#e = e;
	}
	async down(e, t = {
		text: void 0,
		commands: []
	}) {
		let n = this.#r(e), r = this.#t.has(n.code);
		this.#t.add(n.code), this._modifiers |= this.#n(n.key);
		let i = t.text === void 0 ? n.text : t.text;
		await this.#e.send("Input.dispatchKeyEvent", {
			type: i ? "keyDown" : "rawKeyDown",
			modifiers: this._modifiers,
			windowsVirtualKeyCode: n.keyCode,
			code: n.code,
			key: n.key,
			text: i,
			unmodifiedText: i,
			autoRepeat: r,
			location: n.location,
			isKeypad: n.location === 3,
			commands: t.commands
		});
	}
	#n(e) {
		return e === "Alt" ? 1 : e === "Control" ? 2 : e === "Meta" ? 4 : e === "Shift" ? 8 : 0;
	}
	#r(e) {
		let t = this._modifiers & 8, n = {
			key: "",
			keyCode: 0,
			code: "",
			text: "",
			location: 0
		}, r = go[e];
		return N(r, `Unknown key: "${e}"`), r.key && (n.key = r.key), t && r.shiftKey && (n.key = r.shiftKey), r.keyCode && (n.keyCode = r.keyCode), t && r.shiftKeyCode && (n.keyCode = r.shiftKeyCode), r.code && (n.code = r.code), r.location && (n.location = r.location), n.key.length === 1 && (n.text = n.key), r.text && (n.text = r.text), t && r.shiftText && (n.text = r.shiftText), this._modifiers & -9 && (n.text = ""), n;
	}
	async up(e) {
		let t = this.#r(e);
		this._modifiers &= ~this.#n(t.key), this.#t.delete(t.code), await this.#e.send("Input.dispatchKeyEvent", {
			type: "keyUp",
			modifiers: this._modifiers,
			key: t.key,
			windowsVirtualKeyCode: t.keyCode,
			code: t.code,
			location: t.location
		});
	}
	async sendCharacter(e) {
		await this.#e.send("Input.insertText", { text: e });
	}
	charIsKey(e) {
		return !!go[e];
	}
	async type(e, t = {}) {
		let n = t.delay || void 0;
		for (let t of e) this.charIsKey(t) ? await this.press(t, { delay: n }) : (n && await new Promise((e) => setTimeout(e, n)), await this.sendCharacter(t));
	}
	async press(e, t = {}) {
		let { delay: n = null } = t;
		await this.down(e, t), n && await new Promise((e) => setTimeout(e, t.delay)), await this.up(e);
	}
}, vo = (e) => {
	switch (e) {
		case X.Left: return 1;
		case X.Right: return 2;
		case X.Middle: return 4;
		case X.Back: return 8;
		case X.Forward: return 16;
	}
}, yo = (e) => e & 1 ? X.Left : e & 2 ? X.Right : e & 4 ? X.Middle : e & 8 ? X.Back : e & 16 ? X.Forward : "none", bo = class extends mo {
	#e;
	#t;
	constructor(e, t) {
		super(), this.#e = e, this.#t = t;
	}
	updateClient(e) {
		this.#e = e;
	}
	#n = {
		position: {
			x: 0,
			y: 0
		},
		buttons: 0
	};
	get #r() {
		return Object.assign({ ...this.#n }, ...this.#i);
	}
	#i = [];
	#a() {
		let e = {};
		this.#i.push(e);
		let t = () => {
			this.#i.splice(this.#i.indexOf(e), 1);
		};
		return {
			update: (t) => {
				Object.assign(e, t);
			},
			commit: () => {
				this.#n = {
					...this.#n,
					...e
				}, t();
			},
			rollback: t
		};
	}
	async #o(e) {
		let { update: t, commit: n, rollback: r } = this.#a();
		try {
			await e(t), n();
		} catch (e) {
			throw r(), e;
		}
	}
	async reset() {
		let e = [];
		for (let [t, n] of [
			[1, X.Left],
			[4, X.Middle],
			[2, X.Right],
			[16, X.Forward],
			[8, X.Back]
		]) this.#r.buttons & t && e.push(this.up({ button: n }));
		(this.#r.position.x !== 0 || this.#r.position.y !== 0) && e.push(this.move(0, 0)), await Promise.all(e);
	}
	async move(e, t, n = {}) {
		let { steps: r = 1 } = n, i = this.#r.position, a = {
			x: e,
			y: t
		};
		for (let e = 1; e <= r; e++) await this.#o((t) => {
			t({ position: {
				x: i.x + (a.x - i.x) * (e / r),
				y: i.y + (a.y - i.y) * (e / r)
			} });
			let { buttons: n, position: o } = this.#r;
			return this.#e.send("Input.dispatchMouseEvent", {
				type: "mouseMoved",
				modifiers: this.#t._modifiers,
				buttons: n,
				button: yo(n),
				...o
			});
		});
	}
	async down(e = {}) {
		let { button: t = X.Left, clickCount: n = 1 } = e, r = vo(t);
		if (!r) throw Error(`Unsupported mouse button: ${t}`);
		if (this.#r.buttons & r) throw Error(`'${t}' is already pressed.`);
		await this.#o((e) => {
			e({ buttons: this.#r.buttons | r });
			let { buttons: i, position: a } = this.#r;
			return this.#e.send("Input.dispatchMouseEvent", {
				type: "mousePressed",
				modifiers: this.#t._modifiers,
				clickCount: n,
				buttons: i,
				button: t,
				...a
			});
		});
	}
	async up(e = {}) {
		let { button: t = X.Left, clickCount: n = 1 } = e, r = vo(t);
		if (!r) throw Error(`Unsupported mouse button: ${t}`);
		if (!(this.#r.buttons & r)) throw Error(`'${t}' is not pressed.`);
		await this.#o((e) => {
			e({ buttons: this.#r.buttons & ~r });
			let { buttons: i, position: a } = this.#r;
			return this.#e.send("Input.dispatchMouseEvent", {
				type: "mouseReleased",
				modifiers: this.#t._modifiers,
				clickCount: n,
				buttons: i,
				button: t,
				...a
			});
		});
	}
	async click(e, t, n = {}) {
		let { delay: r, count: i = 1 } = n;
		if (i < 1) throw Error("Click must occur a positive number of times.");
		let a = [this.move(e, t)];
		for (let e = 1; e < i; ++e) a.push(this.down({
			...n,
			clickCount: e
		}), this.up({
			...n,
			clickCount: e
		}));
		a.push(this.down({
			...n,
			clickCount: i
		})), typeof r == "number" && (await Promise.all(a), a.length = 0, await new Promise((e) => {
			setTimeout(e, r);
		})), a.push(this.up({
			...n,
			clickCount: i
		})), await Promise.all(a);
	}
	async wheel(e = {}) {
		let { deltaX: t = 0, deltaY: n = 0 } = e, { position: r, buttons: i } = this.#r;
		await this.#e.send("Input.dispatchMouseEvent", {
			type: "mouseWheel",
			pointerType: "mouse",
			modifiers: this.#t._modifiers,
			deltaY: n,
			deltaX: t,
			buttons: i,
			...r
		});
	}
	async drag(e, t) {
		let n = new Promise((e) => {
			this.#e.once("Input.dragIntercepted", (t) => e(t.data));
		});
		return await this.move(e.x, e.y), await this.down(), await this.move(t.x, t.y), await n;
	}
	async dragEnter(e, t) {
		await this.#e.send("Input.dispatchDragEvent", {
			type: "dragEnter",
			x: e.x,
			y: e.y,
			modifiers: this.#t._modifiers,
			data: t
		});
	}
	async dragOver(e, t) {
		await this.#e.send("Input.dispatchDragEvent", {
			type: "dragOver",
			x: e.x,
			y: e.y,
			modifiers: this.#t._modifiers,
			data: t
		});
	}
	async drop(e, t) {
		await this.#e.send("Input.dispatchDragEvent", {
			type: "drop",
			x: e.x,
			y: e.y,
			modifiers: this.#t._modifiers,
			data: t
		});
	}
	async dragAndDrop(e, t, n = {}) {
		let { delay: r = null } = n, i = await this.drag(e, t);
		await this.dragEnter(t, i), await this.dragOver(t, i), r && await new Promise((e) => setTimeout(e, r)), await this.drop(t, i), await this.up();
	}
}, xo = class {
	#e = !1;
	#t;
	#n;
	#r;
	#i;
	constructor(e, t, n, r) {
		this.#r = e, this.#t = t, this.#i = n, this.#n = r;
	}
	updateClient(e) {
		this.#r = e;
	}
	async start() {
		if (this.#e) throw new Sn("Touch has already started");
		await this.#r.send("Input.dispatchTouchEvent", {
			type: "touchStart",
			touchPoints: [this.#n],
			modifiers: this.#i._modifiers
		}), this.#e = !0;
	}
	move(e, t) {
		return this.#n.x = Math.round(e), this.#n.y = Math.round(t), this.#r.send("Input.dispatchTouchEvent", {
			type: "touchMove",
			touchPoints: [this.#n],
			modifiers: this.#i._modifiers
		});
	}
	async end() {
		await this.#r.send("Input.dispatchTouchEvent", {
			type: "touchEnd",
			touchPoints: [this.#n],
			modifiers: this.#i._modifiers
		}), this.#t.removeHandle(this);
	}
}, So = class extends ho {
	#e;
	#t;
	constructor(e, t) {
		super(), this.#e = e, this.#t = t;
	}
	updateClient(e) {
		this.#e = e, this.touches.forEach((t) => {
			t.updateClient(e);
		});
	}
	async touchStart(e, t) {
		let n = this.idGenerator(), r = {
			x: Math.round(e),
			y: Math.round(t),
			radiusX: .5,
			radiusY: .5,
			force: .5,
			id: n
		}, i = new xo(this.#e, this, this.#t, r);
		return await i.start(), this.touches.push(i), i;
	}
}, Co = class {
	#e;
	#t = !1;
	#n;
	constructor(e) {
		this.#e = e;
	}
	updateClient(e) {
		this.#e = e;
	}
	async start(e = {}) {
		N(!this.#t, "Cannot start recording trace while already recording trace.");
		let t = [
			"-*",
			"devtools.timeline",
			"v8.execute",
			"disabled-by-default-devtools.timeline",
			"disabled-by-default-devtools.timeline.frame",
			"toplevel",
			"blink.console",
			"blink.user_timing",
			"latencyInfo",
			"disabled-by-default-devtools.timeline.stack",
			"disabled-by-default-v8.cpu_profiler"
		], { path: n, screenshots: r = !1, categories: i = t } = e;
		r && i.push("disabled-by-default-devtools.screenshot");
		let a = i.filter((e) => e.startsWith("-")).map((e) => e.slice(1)), o = i.filter((e) => !e.startsWith("-"));
		this.#n = n, this.#t = !0, await this.#e.send("Tracing.start", {
			transferMode: "ReturnAsStream",
			traceConfig: {
				excludedCategories: a,
				includedCategories: o
			}
		});
	}
	async stop() {
		let e = z.create();
		return this.#e.once("Tracing.tracingComplete", async (t) => {
			try {
				N(t.stream, "Missing \"stream\"");
				let n = await Pn(await Fn(this.#e, t.stream), this.#n);
				e.resolve(n ?? void 0);
			} catch (t) {
				kr(t) ? e.reject(t) : e.reject(/* @__PURE__ */ Error(`Unknown error: ${t}`));
			}
		}), await this.#e.send("Tracing.end"), this.#t = !1, await e.valueOrThrow();
	}
}, wo = class extends L {
	#e;
	#t;
	#n;
	name;
	description;
	inputSchema;
	annotations;
	frame;
	location;
	rawStackTrace;
	constructor(e, t, n) {
		super(), this.#e = e, this.name = t.name, this.description = t.description, this.inputSchema = t.inputSchema, this.annotations = t.annotations, this.frame = n, this.#t = t.backendNodeId, t.stackTrace?.callFrames.length && (this.location = {
			url: t.stackTrace.callFrames[0].url,
			lineNumber: t.stackTrace.callFrames[0].lineNumber,
			columnNumber: t.stackTrace.callFrames[0].columnNumber
		}), this.rawStackTrace = t.stackTrace;
	}
	get formElement() {
		return (async () => {
			if (this.#n && !this.#n.disposed) return this.#n;
			if (this.#t) return this.#n = await this.frame.worlds[Ra].adoptBackendNode(this.#t), this.#n;
		})();
	}
	async execute(e = {}) {
		let { invocationId: t } = await this.#e.invokeTool(this, e);
		return await new Promise((e) => {
			let n = (r) => {
				r.id === t && (this.#e.off("toolresponded", n), e(r));
			};
			this.#e.on("toolresponded", n);
		});
	}
}, To = class {
	id;
	tool;
	input;
	constructor(e, t, n) {
		this.id = e, this.tool = t;
		try {
			this.input = JSON.parse(n);
		} catch (e) {
			this.input = {}, P(e);
		}
	}
}, Eo = class extends L {
	#e;
	#t;
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Map();
	#i = (e) => {
		let t = [];
		for (let n of e.tools) {
			let e = this.#t.frame(n.frameId);
			if (!e) continue;
			let r = this.#n.get(n.frameId) ?? /* @__PURE__ */ new Map();
			this.#n.has(n.frameId) || this.#n.set(n.frameId, r);
			let i = new wo(this, n, e);
			r.set(n.name, i), t.push(i);
		}
		this.emit("toolsadded", { tools: t });
	};
	#a = (e) => {
		let t = [];
		e.tools.forEach((e) => {
			let n = this.#n.get(e.frameId)?.get(e.name);
			n && t.push(n), this.#n.get(e.frameId)?.delete(e.name);
		}), this.emit("toolsremoved", { tools: t });
	};
	#o = (e) => {
		let t = this.#n.get(e.frameId)?.get(e.toolName);
		if (!t) return;
		let n = new To(e.invocationId, t, e.input);
		this.#r.set(n.id, n), t.emit("toolinvoked", n), this.emit("toolinvoked", n);
	};
	#s = (e) => {
		let t = this.#r.get(e.invocationId);
		t && this.#r.delete(e.invocationId);
		let n = {
			id: e.invocationId,
			call: t,
			status: e.status,
			output: e.output,
			errorText: e.errorText,
			exception: e.exception
		};
		this.emit("toolresponded", n);
	};
	#c = (e) => {
		this.#r.clear();
		let t = this.#n.get(e._id);
		if (!t) return;
		let n = Array.from(t.values());
		this.#n.delete(e._id), n.length && this.emit("toolsremoved", { tools: n });
	};
	constructor(e, t) {
		super(), this.#e = e, this.#t = t, this.#t.on(J.FrameNavigated, this.#c), this.#l();
	}
	async initialize() {
		return await this.#e.send("WebMCP.enable").catch(P);
	}
	async invokeTool(e, t) {
		return await this.#e.send("WebMCP.invokeTool", {
			frameId: e.frame._id,
			toolName: e.name,
			input: t
		});
	}
	tools() {
		return Array.from(this.#n.values()).flatMap((e) => Array.from(e.values()));
	}
	#l() {
		this.#e.on("WebMCP.toolsAdded", this.#i), this.#e.on("WebMCP.toolsRemoved", this.#a), this.#e.on("WebMCP.toolInvoked", this.#o), this.#e.on("WebMCP.toolResponded", this.#s);
	}
	updateClient(e) {
		this.#e.off("WebMCP.toolsAdded", this.#i), this.#e.off("WebMCP.toolsRemoved", this.#a), this.#e.off("WebMCP.toolInvoked", this.#o), this.#e.off("WebMCP.toolResponded", this.#s), this.#e = e, this.#l();
	}
}, Do = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, Oo = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
});
function ko(e) {
	switch (e) {
		case "Strict":
		case "Lax":
		case "None": return e;
		default: return;
	}
}
var Ao = class e extends Sr {
	static async _create(t, n, r) {
		let i = new e(t, n);
		if (await i.#k(), r) try {
			await i.setViewport(r);
		} catch (e) {
			if (kr(e) && Jr(e)) P(e);
			else throw e;
		}
		return i;
	}
	#e = !1;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	#c;
	#l;
	#u;
	#d;
	#f;
	#p;
	#m = /* @__PURE__ */ new Map();
	#h = /* @__PURE__ */ new Map();
	#g;
	#_;
	#v = /* @__PURE__ */ new Map();
	#y = /* @__PURE__ */ new Set();
	#b = z.create();
	#x = !1;
	#S = !1;
	constructor(e, t) {
		super(), this.#r = e, this.#a = e.parentSession(), N(this.#a, "Tab target session is not defined."), this.#o = this.#a.target(), N(this.#o, "Tab target is not defined."), this._tabId = this.#o._getTargetInfo().targetId, this.#i = t, this.#t = t._targetManager(), this.#s = new _o(e), this.#c = new bo(e, this.#s), this.#l = new So(e, this.#s), this.#u = new fo(e, this, this._timeoutSettings), this.#d = new ai(e), this.#f = new Co(e), this.#p = new Eo(e, this.#u), this.#g = new Yr(e), this.#_ = null, this.#n = new Br(this.#r.connection());
		let n = new L(this.#u);
		n.on(J.FrameAttached, (e) => {
			this.emit("frameattached", e);
		}), n.on(J.FrameDetached, (e) => {
			this.emit("framedetached", e);
		}), n.on(J.FrameNavigated, (e) => {
			this.emit("framenavigated", e);
		}), n.on(J.ConsoleApiCalled, ([e, t]) => {
			this.#I(e, t);
		}), n.on(J.BindingCalled, ([e, t]) => {
			this.#L(e, t);
		});
		let r = new L(this.#u.networkManager);
		r.on(H.Request, (e) => {
			this.emit("request", e);
		}), r.on(H.RequestServedFromCache, (e) => {
			this.emit("requestservedfromcache", e);
		}), r.on(H.Response, (e) => {
			this.emit("response", e);
		}), r.on(H.RequestFailed, (e) => {
			this.emit("requestfailed", e);
		}), r.on(H.RequestFinished, (e) => {
			this.emit("requestfinished", e);
		}), this.#a.on(R.Swapped, this.#w.bind(this)), this.#a.on(R.Ready, this.#T.bind(this)), this.#t.on("targetGone", this.#D), this.#o._isClosedDeferred.valueOrThrow().then(() => {
			this.#t.off("targetGone", this.#D), this.emit("close", void 0), this.#e = !0;
		}).catch(P), this.#E(), this.#C();
	}
	#C() {
		let e = [];
		for (let t of this.#t.getChildTargets(this.#i)) e.push(t);
		let t = 0;
		for (; t < e.length;) {
			let n = e[t];
			t++;
			let r = n._session();
			r && this.#O(r);
			for (let t of this.#t.getChildTargets(n)) e.push(t);
		}
	}
	async #w(e) {
		N(e instanceof Ur, "CDPSession is not instance of CdpCDPSession"), this.#r = e, this.#i = e.target(), N(this.#i, "Missing target on swap"), this.#s.updateClient(e), this.#c.updateClient(e), this.#l.updateClient(e), this.#d.updateClient(e), this.#f.updateClient(e), this.#p.updateClient(e), this.#g.updateClient(e), await this.#u.swapFrameTree(e), this.#E();
	}
	async #T(e) {
		N(e instanceof Ur), e.target()._subtype() === "prerender" && (this.#u.registerSpeculativeSession(e).catch(P), this.#d.registerSpeculativeSession(e).catch(P));
	}
	#E() {
		let e = new L(this.#r);
		e.on(R.Ready, this.#O), e.on(R.Disconnected, () => {
			this.#b.reject(new Tn("Target closed"));
		}), e.on("Page.domContentEventFired", () => {
			this.emit("domcontentloaded", void 0);
		}), e.on("Page.loadEventFired", () => {
			this.emit("load", void 0);
		}), e.on("Page.javascriptDialogOpening", this.#R.bind(this)), e.on("Runtime.exceptionThrown", this.#F.bind(this)), e.on("Inspector.targetCrashed", this.#j.bind(this)), e.on("Performance.metrics", this.#N.bind(this)), e.on("Log.entryAdded", this.#M.bind(this)), e.on("Page.fileChooserOpened", this.#A.bind(this));
	}
	#D = (e) => {
		let t = e._session()?.id(), n = this.#v.get(t);
		n && (this.#v.delete(t), this.emit("workerdestroyed", n));
	};
	#O = (e) => {
		if (N(e instanceof Ur), this.#u.onAttachedToTarget(e.target()), e.target()._getTargetInfo().type === "worker") {
			let t = new Va(e, e.target().url(), e.target()._targetId, e.target().type(), this.#F.bind(this), this.#u.networkManager);
			this.#v.set(e.id(), t), t.internalEmitter.on(Tr.Console, (e) => {
				let n = this.listenerCount("console") === 0, r = t.listenerCount(Tr.Console) === 0;
				if (n && r) {
					for (let t of e.args()) t.dispose().catch(P);
					return;
				}
				n || this.emit("console", e);
			}), this.emit("workercreated", t);
		}
		e.on(R.Ready, this.#O);
	};
	async #k() {
		try {
			await Promise.all([
				this.#u.initialize(this.#r),
				this.#r.send("Performance.enable"),
				this.#r.send("Log.enable"),
				this.#p.initialize()
			]);
		} catch (e) {
			if (kr(e) && Jr(e)) P(e);
			else throw e;
		}
	}
	async resize(e) {
		let t = await this.windowId();
		await this.#r.send("Browser.setContentsSize", {
			windowId: Number(t),
			width: e.contentWidth,
			height: e.contentHeight
		});
	}
	async windowId() {
		let { windowId: e } = await this.#r.send("Browser.getWindowForTarget");
		return e.toString();
	}
	async #A(e) {
		let t = {
			stack: [],
			error: void 0,
			hasError: !1
		};
		try {
			if (!this.#y.size) return;
			let n = this.#u.frame(e.frameId);
			N(n, "This should never happen.");
			let r = new Or(Do(t, await n.worlds[Ra].adoptBackendNode(e.backendNodeId), !1).move(), e.mode !== "selectSingle");
			for (let e of this.#y) e.resolve(r);
			this.#y.clear();
		} catch (e) {
			t.error = e, t.hasError = !0;
		} finally {
			Oo(t);
		}
	}
	_client() {
		return this.#r;
	}
	_isUrlAllowed(e) {
		return this.#t.isUrlAllowed(e);
	}
	isServiceWorkerBypassed() {
		return this.#x;
	}
	isDragInterceptionEnabled() {
		return this.#S;
	}
	isJavaScriptEnabled() {
		return this.#d.javascriptEnabled;
	}
	async openDevTools() {
		let e = this.target()._targetId, t = this.browser(), n = await t._hasDevToolsTarget(this.target()._targetId);
		return n ? await t._getDevToolsTargetPage(n) : await t._createDevToolsPage(e);
	}
	async hasDevTools() {
		return !!await this.browser()._hasDevToolsTarget(this.target()._targetId);
	}
	async waitForFileChooser(e = {}) {
		let t = this.#y.size === 0, { timeout: n = this._timeoutSettings.timeout() } = e, r = z.create({
			message: `Waiting for \`FileChooser\` failed: ${n}ms exceeded`,
			timeout: n
		});
		e.signal && e.signal.addEventListener("abort", () => {
			r.reject(e.signal?.reason);
		}, { once: !0 }), this.#y.add(r);
		let i;
		t && (i = this.#r.send("Page.setInterceptFileChooserDialog", { enabled: !0 }));
		try {
			let [e] = await Promise.all([r.valueOrThrow(), i]);
			return e;
		} catch (e) {
			throw this.#y.delete(r), e;
		}
	}
	async setGeolocation(e) {
		return await this.#d.setGeolocation(e);
	}
	target() {
		return this.#i;
	}
	browser() {
		return this.#i.browser();
	}
	browserContext() {
		return this.#i.browserContext();
	}
	#j() {
		this.emit("error", /* @__PURE__ */ Error("Page crashed!"));
	}
	#M(e) {
		let { level: t, text: n, args: r, source: i, url: a, lineNumber: o, stackTrace: s } = e.entry;
		r && r.map((e) => {
			ba(this.#r, e);
		}), i !== "worker" && this.emit("console", new Dr(va(t), n, [], [{
			url: a,
			lineNumber: o
		}], void 0, s, this.#i._targetId));
	}
	mainFrame() {
		return this.#u.mainFrame();
	}
	get keyboard() {
		return this.#s;
	}
	get touchscreen() {
		return this.#l;
	}
	get coverage() {
		return this.#g;
	}
	get tracing() {
		return this.#f;
	}
	get webmcp() {
		return this.#p;
	}
	frames() {
		return this.#u.frames();
	}
	workers() {
		return Array.from(this.#v.values());
	}
	async setRequestInterception(e) {
		return await this.#u.networkManager.setRequestInterception(e);
	}
	async setBypassServiceWorker(e) {
		return this.#x = e, await this.#r.send("Network.setBypassServiceWorker", { bypass: e });
	}
	async setDragInterception(e) {
		return this.#S = e, await this.#r.send("Input.setInterceptDrags", { enabled: e });
	}
	async setOfflineMode(e) {
		return await this.#u.networkManager.setOfflineMode(e);
	}
	async emulateNetworkConditions(e) {
		return await this.#u.networkManager.emulateNetworkConditions(e);
	}
	async emulateFocusedPage(e) {
		return await this.#d.emulateFocus(e);
	}
	setDefaultNavigationTimeout(e) {
		this._timeoutSettings.setDefaultNavigationTimeout(e);
	}
	setDefaultTimeout(e) {
		this._timeoutSettings.setDefaultTimeout(e);
	}
	getDefaultTimeout() {
		return this._timeoutSettings.timeout();
	}
	getDefaultNavigationTimeout() {
		return this._timeoutSettings.navigationTimeout();
	}
	async queryObjects(e) {
		N(!e.disposed, "Prototype JSHandle is disposed!"), N(e.id, "Prototype JSHandle must not be referencing primitive value");
		let t = await this.mainFrame().client.send("Runtime.queryObjects", { prototypeObjectId: e.id });
		return this.mainFrame().mainRealm().createCdpHandle(t.objects);
	}
	async cookies(...e) {
		let t = (await this.#r.send("Network.getCookies", { urls: e.length ? e : [this.url()] })).cookies, n = ["sourcePort"];
		return t.map((e) => {
			for (let t of n) delete e[t];
			return e;
		}).map((e) => ({
			...e,
			partitionKey: e.partitionKey ? e.partitionKey.topLevelSite : void 0
		}));
	}
	async deleteCookie(...e) {
		let t = this.url();
		for (let n of e) {
			let e = {
				...n,
				partitionKey: No(n.partitionKey)
			};
			if (!n.url && t.startsWith("http") && (e.url = t), await this.#r.send("Network.deleteCookies", e), t.startsWith("http") && !e.partitionKey) {
				let n = new URL(t);
				await this.#r.send("Network.deleteCookies", {
					...e,
					partitionKey: {
						topLevelSite: n.origin.replace(`:${n.port}`, ""),
						hasCrossSiteAncestor: !1
					}
				});
			}
		}
	}
	async setCookie(...e) {
		let t = this.url(), n = t.startsWith("http"), r = e.map((e) => {
			let r = Object.assign({}, e);
			return !r.url && n && (r.url = t), N(r.url !== "about:blank", `Blank page can not have cookie "${r.name}"`), N(!String.prototype.startsWith.call(r.url || "", "data:"), `Data URL page can not have cookie "${r.name}"`), r;
		});
		await this.deleteCookie(...r), r.length && await this.#r.send("Network.setCookies", { cookies: r.map((e) => ({
			...e,
			partitionKey: No(e.partitionKey),
			sameSite: ko(e.sameSite)
		})) });
	}
	async exposeFunction(e, t) {
		if (this.#m.has(e)) throw Error(`Failed to add page binding with name ${e}: window['${e}'] already exists!`);
		let n = _a("exposedFun", e), r;
		switch (typeof t) {
			case "function":
				r = new zr(e, t, n);
				break;
			default: r = new zr(e, t.default, n);
		}
		this.#m.set(e, r);
		let [{ identifier: i }] = await Promise.all([this.#u.evaluateOnNewDocument(n), this.#u.addExposedFunctionBinding(r)]);
		this.#h.set(e, i);
	}
	async removeExposedFunction(e) {
		let t = this.#h.get(e);
		if (!t) throw Error(`Function with name "${e}" does not exist`);
		let n = this.#m.get(e);
		this.#h.delete(e), this.#m.delete(e), await Promise.all([this.#u.removeScriptToEvaluateOnNewDocument(t), this.#u.removeExposedFunctionBinding(n)]);
	}
	async authenticate(e) {
		return await this.#u.networkManager.authenticate(e);
	}
	async setExtraHTTPHeaders(e) {
		return await this.#u.networkManager.setExtraHTTPHeaders(e);
	}
	async setUserAgent(e, t) {
		if (typeof e == "string") return await this.#u.networkManager.setUserAgent(e, t);
		{
			let t = e.userAgent ?? await this.browser().userAgent();
			return await this.#u.networkManager.setUserAgent(t, e.userAgentMetadata, e.platform);
		}
	}
	async metrics() {
		let e = await this.#r.send("Performance.getMetrics");
		return this.#P(e.metrics);
	}
	async captureHeapSnapshot(e) {
		let { createWriteStream: t } = ln.value.fs, n = t(e.path), r = new Promise((e, t) => {
			n.on("error", t), n.on("finish", e);
		}), i = this.#r;
		await i.send("HeapProfiler.enable"), await i.send("HeapProfiler.collectGarbage");
		let a = (e) => {
			n.write(e.chunk);
		};
		i.on("HeapProfiler.addHeapSnapshotChunk", a);
		try {
			await i.send("HeapProfiler.takeHeapSnapshot", { reportProgress: !1 });
		} finally {
			i.off("HeapProfiler.addHeapSnapshotChunk", a), await i.send("HeapProfiler.disable");
		}
		n.end(), await r;
	}
	#N(e) {
		this.emit("metrics", {
			title: e.title,
			metrics: this.#P(e.metrics)
		});
	}
	#P(e) {
		let t = {};
		for (let n of e || []) jo.has(n.name) && (t[n.name] = n.value);
		return t;
	}
	#F(e) {
		this.emit("pageerror", da(e.exceptionDetails));
	}
	#I(e, t, n) {
		n ||= t.args.map((t) => e.createCdpHandle(t));
		let r = this.listenerCount("console") > 0, i = e.environment instanceof Er && e.environment.listenerCount(Tr.Console) > 0;
		if (!r) {
			if (!i) for (let e of n) e.dispose().catch(P);
			return;
		}
		let a;
		e.environment.client instanceof Ur && (a = e.environment.client.target()._targetId), this.emit("console", ca(t, n, a));
	}
	async #L(e, t) {
		let n;
		try {
			n = JSON.parse(t.payload);
		} catch {
			return;
		}
		let { type: r, name: i, seq: a, args: o, isTrivial: s } = n;
		if (r !== "exposedFun") return;
		let c = e.context;
		c && await this.#m.get(i)?.run(c, a, o, s);
	}
	#R(e) {
		let t = Ln(e.type), n = new ei(this.#r, t, e.message, e.defaultPrompt);
		this.emit("dialog", n);
	}
	async reload(e) {
		let [t] = await Promise.all([this.waitForNavigation({
			...e,
			ignoreSameDocumentNavigation: !0
		}), this.#r.send("Page.reload", { ignoreCache: e?.ignoreCache ?? !1 })]);
		return t;
	}
	async createCDPSession() {
		return await this.target().createCDPSession();
	}
	async goBack(e = {}) {
		return await this.#z(-1, e);
	}
	async goForward(e = {}) {
		return await this.#z(1, e);
	}
	async #z(e, t) {
		let n = await this.#r.send("Page.getNavigationHistory"), r = n.entries[n.currentIndex + e];
		if (!r) throw Error("History entry to navigate to not found.");
		return (await Promise.all([this.waitForNavigation(t), this.#r.send("Page.navigateToHistoryEntry", { entryId: r.id })]))[0];
	}
	async bringToFront() {
		await this.#r.send("Page.bringToFront");
	}
	async setJavaScriptEnabled(e) {
		return await this.#d.setJavaScriptEnabled(e);
	}
	async setBypassCSP(e) {
		await this.#r.send("Page.setBypassCSP", { enabled: e });
	}
	async triggerExtensionAction(e) {
		return await e.triggerAction(this);
	}
	async emulateMediaType(e) {
		return await this.#d.emulateMediaType(e);
	}
	async emulateCPUThrottling(e) {
		return await this.#d.emulateCPUThrottling(e);
	}
	async emulateMediaFeatures(e) {
		return await this.#d.emulateMediaFeatures(e);
	}
	async emulateTimezone(e) {
		return await this.#d.emulateTimezone(e);
	}
	async emulateIdleState(e) {
		return await this.#d.emulateIdleState(e);
	}
	async emulateVisionDeficiency(e) {
		return await this.#d.emulateVisionDeficiency(e);
	}
	async setViewport(e) {
		let t = await this.#d.emulateViewport(e);
		this.#_ = e, t && await this.reload();
	}
	viewport() {
		return this.#_;
	}
	async evaluateOnNewDocument(e, ...t) {
		let n = Nn(e, ...t);
		return await this.#u.evaluateOnNewDocument(n);
	}
	async removeScriptToEvaluateOnNewDocument(e) {
		return await this.#u.removeScriptToEvaluateOnNewDocument(e);
	}
	async setCacheEnabled(e = !0) {
		await this.#u.networkManager.setCacheEnabled(e);
	}
	async _screenshot(e) {
		let t = {
			stack: [],
			error: void 0,
			hasError: !1
		};
		try {
			let { fromSurface: n, omitBackground: r, optimizeForSpeed: i, quality: a, clip: o, type: s, captureBeyondViewport: c } = e, l = Do(t, new on(), !0);
			r && (s === "png" || s === "webp") && (await this.#d.setTransparentBackgroundColor(), l.defer(async () => {
				await this.#d.resetDefaultBackgroundColor().catch(P);
			}));
			let u = o;
			if (u && !c) {
				let e = await this.mainFrame().isolatedRealm().evaluate(() => {
					let { height: e, pageLeft: t, pageTop: n, width: r } = window.visualViewport;
					return {
						x: t,
						y: n,
						height: e,
						width: r
					};
				});
				u = Mo(u, e);
			}
			let { data: d } = await this.#r.send("Page.captureScreenshot", {
				format: s,
				optimizeForSpeed: i,
				fromSurface: n,
				...a === void 0 ? {} : { quality: Math.round(a) },
				...u ? { clip: {
					...u,
					scale: u.scale ?? 1
				} } : {},
				captureBeyondViewport: c
			});
			return d;
		} catch (e) {
			t.error = e, t.hasError = !0;
		} finally {
			let e = Oo(t);
			e && await e;
		}
	}
	async createPDFStream(e = {}) {
		let { timeout: t = this._timeoutSettings.timeout() } = e, { landscape: n, displayHeaderFooter: r, headerTemplate: i, footerTemplate: a, printBackground: o, scale: s, width: c, height: l, margin: u, pageRanges: d, preferCSSPageSize: f, omitBackground: p, tagged: m, outline: h, waitForFonts: g } = Hn(e);
		p && await this.#d.setTransparentBackgroundColor(), g && await O(D(this.mainFrame().isolatedRealm().evaluate(() => document.fonts.ready)).pipe(Yt(Rn(t))));
		let _ = await O(D(this.#r.send("Page.printToPDF", {
			transferMode: "ReturnAsStream",
			landscape: n,
			displayHeaderFooter: r,
			headerTemplate: i,
			footerTemplate: a,
			printBackground: o,
			scale: s,
			paperWidth: c,
			paperHeight: l,
			marginTop: u.top,
			marginBottom: u.bottom,
			marginLeft: u.left,
			marginRight: u.right,
			pageRanges: d,
			preferCSSPageSize: f,
			generateTaggedPDF: m,
			generateDocumentOutline: h
		})).pipe(Yt(Rn(t))));
		return p && await this.#d.resetDefaultBackgroundColor(), N(_.stream, "`stream` is missing from `Page.printToPDF"), await Fn(this.#r, _.stream);
	}
	async pdf(e = {}) {
		let { path: t = void 0 } = e, n = await Pn(await this.createPDFStream(e), t);
		return N(n, "Could not create typed array"), n;
	}
	async close(e = { runBeforeUnload: void 0 }) {
		let t = {
			stack: [],
			error: void 0,
			hasError: !1
		};
		try {
			Do(t, await this.browserContext().waitForScreenshotOperations(), !1);
			let n = this.#r.connection();
			N(n, "Connection closed. Most likely the page has been closed."), e.runBeforeUnload ? await this.#r.send("Page.close") : (await n.send("Target.closeTarget", { targetId: this.#i._targetId }), await this.#o._isClosedDeferred.valueOrThrow());
		} catch (e) {
			t.error = e, t.hasError = !0;
		} finally {
			Oo(t);
		}
	}
	isClosed() {
		return this.#e;
	}
	get mouse() {
		return this.#c;
	}
	async waitForDevicePrompt(e = {}) {
		return await this.mainFrame().waitForDevicePrompt(e);
	}
	get bluetooth() {
		return this.#n;
	}
	extensionRealms() {
		return this.mainFrame().extensionRealms();
	}
}, jo = /* @__PURE__ */ new Set([
	"Timestamp",
	"Documents",
	"Frames",
	"JSEventListeners",
	"Nodes",
	"LayoutCount",
	"RecalcStyleCount",
	"LayoutDuration",
	"RecalcStyleDuration",
	"ScriptDuration",
	"TaskDuration",
	"JSHeapUsedSize",
	"JSHeapTotalSize"
]);
function Mo(e, t) {
	let n = Math.max(e.x, t.x), r = Math.max(e.y, t.y);
	return {
		x: n,
		y: r,
		width: Math.max(Math.min(e.x + e.width, t.x + t.width) - n, 0),
		height: Math.max(Math.min(e.y + e.height, t.y + t.height) - r, 0)
	};
}
function No(e) {
	if (e !== void 0) return typeof e == "string" ? {
		topLevelSite: e,
		hasCrossSiteAncestor: !1
	} : {
		topLevelSite: e.sourceOrigin,
		hasCrossSiteAncestor: e.hasCrossSiteAncestor ?? !1
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/cdp/BrowserContext.js
var Po = function(e, t, n) {
	if (t != null) {
		if (typeof t != "object" && typeof t != "function") throw TypeError("Object expected.");
		var r, i;
		if (n) {
			if (!Symbol.asyncDispose) throw TypeError("Symbol.asyncDispose is not defined.");
			r = t[Symbol.asyncDispose];
		}
		if (r === void 0) {
			if (!Symbol.dispose) throw TypeError("Symbol.dispose is not defined.");
			r = t[Symbol.dispose], n && (i = r);
		}
		if (typeof r != "function") throw TypeError("Object not disposable.");
		i && (r = function() {
			try {
				i.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		}), e.stack.push({
			value: t,
			dispose: r,
			async: n
		});
	} else n && e.stack.push({ async: !0 });
	return t;
}, Fo = (function(e) {
	return function(t) {
		function n(n) {
			t.error = t.hasError ? new e(n, t.error, "An error was suppressed during disposal.") : n, t.hasError = !0;
		}
		var r, i = 0;
		function a() {
			for (; r = t.stack.pop();) try {
				if (!r.async && i === 1) return i = 0, t.stack.push(r), Promise.resolve().then(a);
				if (r.dispose) {
					var e = r.dispose.call(r.value);
					if (r.async) return i |= 2, Promise.resolve(e).then(a, function(e) {
						return n(e), a();
					});
				} else i |= 1;
			} catch (e) {
				n(e);
			}
			if (i === 1) return t.hasError ? Promise.reject(t.error) : Promise.resolve();
			if (t.hasError) throw t.error;
		}
		return a();
	};
})(typeof SuppressedError == "function" ? SuppressedError : function(e, t, n) {
	var r = Error(n);
	return r.name = "SuppressedError", r.error = e, r.suppressed = t, r;
}), Io = class extends Qn {
	#e;
	#t;
	#n;
	constructor(e, t, n) {
		super(), this.#e = e, this.#t = t, this.#n = n;
	}
	get id() {
		return this.#n;
	}
	targets() {
		return this.#t.targets().filter((e) => e.browserContext() === this);
	}
	async pages(e = !1) {
		return (await Promise.all(this.targets().filter((t) => t.type() === "page" || (t.type() === "other" || e) && this.#t._getIsPageTargetCallback()?.(t)).map((e) => e.page()))).filter((e) => !!e);
	}
	async overridePermissions(e, t) {
		let n = t.map((e) => {
			let t = qn.get(e);
			if (!t) throw Error("Unknown permission: " + e);
			return t;
		});
		await this.#e.send("Browser.grantPermissions", {
			origin: e,
			browserContextId: this.#n || void 0,
			permissions: n
		});
	}
	async setPermission(e, ...t) {
		await Promise.all(t.map(async (t) => {
			let n = {
				name: t.permission.name,
				userVisibleOnly: t.permission.userVisibleOnly,
				sysex: t.permission.sysex,
				allowWithoutSanitization: t.permission.allowWithoutSanitization,
				panTiltZoom: t.permission.panTiltZoom
			};
			await this.#e.send("Browser.setPermission", {
				origin: e === "*" ? void 0 : e,
				browserContextId: this.#n || void 0,
				permission: n,
				setting: t.state
			});
		}));
	}
	async clearPermissionOverrides() {
		await this.#e.send("Browser.resetPermissions", { browserContextId: this.#n || void 0 });
	}
	async newPage(e) {
		let t = {
			stack: [],
			error: void 0,
			hasError: !1
		};
		try {
			return Po(t, await this.waitForScreenshotOperations(), !1), await this.#t._createPageInContext(this.#n, e);
		} catch (e) {
			t.error = e, t.hasError = !0;
		} finally {
			Fo(t);
		}
	}
	browser() {
		return this.#t;
	}
	async close() {
		N(this.#n, "Default BrowserContext cannot be closed!"), await this.#t._disposeContext(this.#n);
	}
	async cookies() {
		let { cookies: e } = await this.#e.send("Storage.getCookies", { browserContextId: this.#n });
		return e.map((e) => ({
			...e,
			partitionKey: e.partitionKey ? {
				sourceOrigin: e.partitionKey.topLevelSite,
				hasCrossSiteAncestor: e.partitionKey.hasCrossSiteAncestor
			} : void 0
		}));
	}
	async setCookie(...e) {
		return await this.#e.send("Storage.setCookies", {
			browserContextId: this.#n,
			cookies: e.map((e) => ({
				...e,
				partitionKey: No(e.partitionKey),
				sameSite: ko(e.sameSite)
			}))
		});
	}
	async setDownloadBehavior(e) {
		await this.#e.send("Browser.setDownloadBehavior", {
			behavior: e.policy,
			downloadPath: e.downloadPath,
			browserContextId: this.#n
		});
	}
}, Lo = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	constructor(e, t, n, r, i) {
		if (!e || !t) throw Error("Extension ID and version are required");
		this.#e = e, this.#t = t, this.#n = n, this.#r = r, this.#i = i;
	}
	get enabled() {
		return this.#i;
	}
	get path() {
		return this.#r;
	}
	get version() {
		return this.#t;
	}
	get name() {
		return this.#n;
	}
	get id() {
		return this.#e;
	}
}, Ro = class extends Lo {
	#e;
	constructor(e, t, n, r, i, a) {
		super(e, t, n, r, i), this.#e = a;
	}
	async workers() {
		let e = this.#e.targets().filter((e) => {
			let t = e.url();
			return e.type() === "service_worker" && t.startsWith("chrome-extension://" + this.id);
		}), t = [];
		for (let n of e) try {
			let e = await n.worker();
			e && t.push(e);
		} catch (e) {
			if (this.#t(e)) {
				P(e);
				continue;
			}
			throw e;
		}
		return t;
	}
	async pages() {
		let e = this.#e.targets().filter((e) => {
			let t = e.url();
			return (e.type() === "page" || e.type() === "background_page") && t.startsWith("chrome-extension://" + this.id);
		});
		return (await Promise.all(e.map(async (e) => {
			try {
				return await e.asPage();
			} catch (e) {
				if (this.#t(e)) return P(e), null;
				throw e;
			}
		}))).filter((e) => e !== null);
	}
	async triggerAction(e) {
		await this.#e._connection.send("Extensions.triggerAction", {
			id: this.id,
			targetId: e._tabId
		});
	}
	#t(e) {
		return kr(e) && (Jr(e) || e.message.includes("No target with given id found"));
	}
}, Z;
(function(e) {
	e.SUCCESS = "success", e.ABORTED = "aborted";
})(Z ||= {});
var zo = class extends Ba {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a = /* @__PURE__ */ new Set();
	_initializedDeferred = z.create();
	_isClosedDeferred = z.create();
	_targetId;
	_asPagePromise;
	pagePromise;
	constructor(e, t, n, r, i) {
		super(), this.#t = t, this.#r = r, this.#n = e, this.#e = n, this._targetId = e.targetId, this.#i = i, this.#t && this.#t.setTarget(this);
	}
	async asPage() {
		if (this.pagePromise) {
			let e = await this.pagePromise;
			if (e) return e;
		}
		if (!this._asPagePromise) {
			let e = this._session();
			this._asPagePromise = (e ? Promise.resolve(e) : this._sessionFactory()(!1)).then((e) => Ao._create(e, this, null));
		}
		return await this._asPagePromise ?? null;
	}
	_subtype() {
		return this.#n.subtype;
	}
	_session() {
		return this.#t;
	}
	_addChildTarget(e) {
		this.#a.add(e);
	}
	_removeChildTarget(e) {
		this.#a.delete(e);
	}
	_childTargets() {
		return this.#a;
	}
	_sessionFactory() {
		if (!this.#i) throw Error("sessionFactory is not initialized");
		return this.#i;
	}
	createCDPSession() {
		if (!this.#i) throw Error("sessionFactory is not initialized");
		return this.#i(!1).then((e) => (e.setTarget(this), e));
	}
	url() {
		return this.#n.url;
	}
	type() {
		switch (this.#n.type) {
			case "page": return Y.PAGE;
			case "background_page": return Y.BACKGROUND_PAGE;
			case "service_worker": return Y.SERVICE_WORKER;
			case "shared_worker": return Y.SHARED_WORKER;
			case "browser": return Y.BROWSER;
			case "webview": return Y.WEBVIEW;
			case "tab": return Y.TAB;
			default: return Y.OTHER;
		}
	}
	_targetManager() {
		if (!this.#r) throw Error("targetManager is not initialized");
		return this.#r;
	}
	_getTargetInfo() {
		return this.#n;
	}
	browser() {
		if (!this.#e) throw Error("browserContext is not initialized");
		return this.#e.browser();
	}
	browserContext() {
		if (!this.#e) throw Error("browserContext is not initialized");
		return this.#e;
	}
	opener() {
		let { openerId: e } = this.#n;
		if (e) return this.browser().targets().find((t) => t._targetId === e);
	}
	_targetInfoChanged(e) {
		this.#n = e, this._checkIfInitialized();
	}
	_initialize() {
		this._initializedDeferred.resolve(Z.SUCCESS);
	}
	_isTargetExposed() {
		return this.type() !== Y.TAB && !this._subtype();
	}
	_checkIfInitialized() {
		this._initializedDeferred.resolved() || this._initializedDeferred.resolve(Z.SUCCESS);
	}
}, Bo = class e extends zo {
	#e;
	constructor(e, t, n, r, i, a) {
		super(e, t, n, r, i), this.#e = a ?? void 0;
	}
	_initialize() {
		this._initializedDeferred.valueOrThrow().then(async (t) => {
			if (t === Z.ABORTED) return;
			let n = this.opener();
			if (!(n instanceof e)) return;
			if (!n || !n.pagePromise || this.type() !== "page") return !0;
			let r = await n.pagePromise;
			if (!r.listenerCount("popup")) return !0;
			let i = await this.page();
			return r.emit("popup", i), !0;
		}).catch(P), this._checkIfInitialized();
	}
	async page() {
		if (!this.pagePromise) {
			let e = this._session();
			this.pagePromise = (e ? Promise.resolve(e) : this._sessionFactory()(!1)).then((e) => Ao._create(e, this, this.#e ?? null));
		}
		return await this.pagePromise ?? null;
	}
	_checkIfInitialized() {
		this._initializedDeferred.resolved() || this._getTargetInfo().url !== "" && this._initializedDeferred.resolve(Z.SUCCESS);
	}
}, Vo = class extends Bo {}, Ho = class extends zo {
	#e;
	async worker() {
		if (!this.#e) {
			let e = this._session();
			this.#e = (e ? Promise.resolve(e) : this._sessionFactory()(!1)).then((e) => new Va(e, this._getTargetInfo().url, this._targetId, this.type(), () => {}, void 0));
		}
		return await this.#e;
	}
}, Uo = class extends zo {}, Wo = Object.defineProperty, Q = (e, t) => Wo(e, "name", {
	value: t,
	configurable: !0
}), Go = class {
	type = 3;
	name = "";
	prefix = "";
	value = "";
	suffix = "";
	modifier = 3;
	constructor(e, t, n, r, i, a) {
		this.type = e, this.name = t, this.prefix = n, this.value = r, this.suffix = i, this.modifier = a;
	}
	hasCustomName() {
		return this.name !== "" && typeof this.name != "number";
	}
};
Q(Go, "Part");
var Ko = /[$_\p{ID_Start}]/u, qo = /[$_\u200C\u200D\p{ID_Continue}]/u, Jo = ".*";
function Yo(e, t) {
	return (t ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(e);
}
Q(Yo, "isASCII");
function Xo(e, t = !1) {
	let n = [], r = 0;
	for (; r < e.length;) {
		let i = e[r], a = Q(function(i) {
			if (!t) throw TypeError(i);
			n.push({
				type: "INVALID_CHAR",
				index: r,
				value: e[r++]
			});
		}, "ErrorOrInvalid");
		if (i === "*") {
			n.push({
				type: "ASTERISK",
				index: r,
				value: e[r++]
			});
			continue;
		}
		if (i === "+" || i === "?") {
			n.push({
				type: "OTHER_MODIFIER",
				index: r,
				value: e[r++]
			});
			continue;
		}
		if (i === "\\") {
			n.push({
				type: "ESCAPED_CHAR",
				index: r++,
				value: e[r++]
			});
			continue;
		}
		if (i === "{") {
			n.push({
				type: "OPEN",
				index: r,
				value: e[r++]
			});
			continue;
		}
		if (i === "}") {
			n.push({
				type: "CLOSE",
				index: r,
				value: e[r++]
			});
			continue;
		}
		if (i === ":") {
			let t = "", i = r + 1;
			for (; i < e.length;) {
				let n = e.substr(i, 1);
				if (i === r + 1 && Ko.test(n) || i !== r + 1 && qo.test(n)) {
					t += e[i++];
					continue;
				}
				break;
			}
			if (!t) {
				a(`Missing parameter name at ${r}`);
				continue;
			}
			n.push({
				type: "NAME",
				index: r,
				value: t
			}), r = i;
			continue;
		}
		if (i === "(") {
			let t = 1, i = "", o = r + 1, s = !1;
			if (e[o] === "?") {
				a(`Pattern cannot start with "?" at ${o}`);
				continue;
			}
			for (; o < e.length;) {
				if (!Yo(e[o], !1)) {
					a(`Invalid character '${e[o]}' at ${o}.`), s = !0;
					break;
				}
				if (e[o] === "\\") {
					i += e[o++] + e[o++];
					continue;
				}
				if (e[o] === ")") {
					if (t--, t === 0) {
						o++;
						break;
					}
				} else if (e[o] === "(" && (t++, e[o + 1] !== "?")) {
					a(`Capturing groups are not allowed at ${o}`), s = !0;
					break;
				}
				i += e[o++];
			}
			if (s) continue;
			if (t) {
				a(`Unbalanced pattern at ${r}`);
				continue;
			}
			if (!i) {
				a(`Missing pattern at ${r}`);
				continue;
			}
			n.push({
				type: "REGEX",
				index: r,
				value: i
			}), r = o;
			continue;
		}
		n.push({
			type: "CHAR",
			index: r,
			value: e[r++]
		});
	}
	return n.push({
		type: "END",
		index: r,
		value: ""
	}), n;
}
Q(Xo, "lexer");
function Zo(e, t = {}) {
	let n = Xo(e);
	t.delimiter ??= "/#?", t.prefixes ??= "./";
	let r = `[^${$(t.delimiter)}]+?`, i = [], a = 0, o = 0, s = /* @__PURE__ */ new Set(), c = Q((e) => {
		if (o < n.length && n[o].type === e) return n[o++].value;
	}, "tryConsume"), l = Q(() => c("OTHER_MODIFIER") ?? c("ASTERISK"), "tryConsumeModifier"), u = Q((e) => {
		let t = c(e);
		if (t !== void 0) return t;
		let { type: r, index: i } = n[o];
		throw TypeError(`Unexpected ${r} at ${i}, expected ${e}`);
	}, "mustConsume"), d = Q(() => {
		let e = "", t;
		for (; t = c("CHAR") ?? c("ESCAPED_CHAR");) e += t;
		return e;
	}, "consumeText"), f = Q((e) => e, "DefaultEncodePart"), p = t.encodePart || f, m = "", h = Q((e) => {
		m += e;
	}, "appendToPendingFixedValue"), g = Q(() => {
		m.length && (i.push(new Go(3, "", "", p(m), "", 3)), m = "");
	}, "maybeAddPartFromPendingFixedValue"), _ = Q((e, t, n, o, c) => {
		let l = 3;
		switch (c) {
			case "?":
				l = 1;
				break;
			case "*":
				l = 0;
				break;
			case "+": l = 2;
		}
		if (!t && !n && l === 3) {
			h(e);
			return;
		}
		if (g(), !t && !n) {
			if (!e) return;
			i.push(new Go(3, "", "", p(e), "", l));
			return;
		}
		let u;
		u = n ? n === "*" ? Jo : n : r;
		let d = 2;
		u === r ? (d = 1, u = "") : u === Jo && (d = 0, u = "");
		let f;
		if (t ? f = t : n && (f = a++), s.has(f)) throw TypeError(`Duplicate name '${f}'.`);
		s.add(f), i.push(new Go(d, f, p(e), u, p(o), l));
	}, "addPart");
	for (; o < n.length;) {
		let e = c("CHAR"), n = c("NAME"), r = c("REGEX");
		if (!n && !r && (r = c("ASTERISK")), n || r) {
			let i = e ?? "";
			t.prefixes.indexOf(i) === -1 && (h(i), i = ""), g();
			let a = l();
			_(i, n, r, "", a);
			continue;
		}
		let i = e ?? c("ESCAPED_CHAR");
		if (i) {
			h(i);
			continue;
		}
		if (c("OPEN")) {
			let e = d(), t = c("NAME"), n = c("REGEX");
			!t && !n && (n = c("ASTERISK"));
			let r = d();
			u("CLOSE");
			let i = l();
			_(e, t, n, r, i);
			continue;
		}
		g(), u("END");
	}
	return i;
}
Q(Zo, "parse");
function $(e) {
	return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
}
Q($, "escapeString");
function Qo(e) {
	return e && e.ignoreCase ? "ui" : "u";
}
Q(Qo, "flags");
function $o(e, t, n) {
	return ts(Zo(e, n), t, n);
}
Q($o, "stringToRegexp");
function es(e) {
	switch (e) {
		case 0: return "*";
		case 1: return "?";
		case 2: return "+";
		case 3: return "";
	}
}
Q(es, "modifierToString");
function ts(e, t, n = {}) {
	n.delimiter ??= "/#?", n.prefixes ??= "./", n.sensitive ??= !1, n.strict ??= !1, n.end ??= !0, n.start ??= !0, n.endsWith = "";
	let r = n.start ? "^" : "";
	for (let i of e) {
		if (i.type === 3) {
			i.modifier === 3 ? r += $(i.value) : r += `(?:${$(i.value)})${es(i.modifier)}`;
			continue;
		}
		t && t.push(i.name);
		let e = `[^${$(n.delimiter)}]+?`, a = i.value;
		if (i.type === 1 ? a = e : i.type === 0 && (a = Jo), !i.prefix.length && !i.suffix.length) {
			i.modifier === 3 || i.modifier === 1 ? r += `(${a})${es(i.modifier)}` : r += `((?:${a})${es(i.modifier)})`;
			continue;
		}
		if (i.modifier === 3 || i.modifier === 1) {
			r += `(?:${$(i.prefix)}(${a})${$(i.suffix)})`, r += es(i.modifier);
			continue;
		}
		r += `(?:${$(i.prefix)}`, r += `((?:${a})(?:`, r += $(i.suffix), r += $(i.prefix), r += `(?:${a}))*)${$(i.suffix)})`, i.modifier === 0 && (r += "?");
	}
	let i = `[${$(n.endsWith)}]|$`, a = `[${$(n.delimiter)}]`;
	if (n.end) return n.strict || (r += `${a}?`), n.endsWith.length ? r += `(?=${i})` : r += "$", new RegExp(r, Qo(n));
	n.strict || (r += `(?:${a}(?=${i}))?`);
	let o = !1;
	if (e.length) {
		let t = e[e.length - 1];
		t.type === 3 && t.modifier === 3 && (o = n.delimiter.indexOf(t) > -1);
	}
	return o || (r += `(?=${a}|${i})`), new RegExp(r, Qo(n));
}
Q(ts, "partsToRegexp");
var ns = {
	delimiter: "",
	prefixes: "",
	sensitive: !0,
	strict: !0
}, rs = {
	delimiter: ".",
	prefixes: "",
	sensitive: !0,
	strict: !0
}, is = {
	delimiter: "/",
	prefixes: "/",
	sensitive: !0,
	strict: !0
};
function as(e, t) {
	return e.length ? e[0] === "/" ? !0 : !t || e.length < 2 ? !1 : (e[0] == "\\" || e[0] == "{") && e[1] == "/" : !1;
}
Q(as, "isAbsolutePathname");
function os(e, t) {
	return e.startsWith(t) ? e.substring(t.length, e.length) : e;
}
Q(os, "maybeStripPrefix");
function ss(e, t) {
	return e.endsWith(t) ? e.substr(0, e.length - t.length) : e;
}
Q(ss, "maybeStripSuffix");
function cs(e) {
	return !e || e.length < 2 ? !1 : e[0] === "[" || (e[0] === "\\" || e[0] === "{") && e[1] === "[";
}
Q(cs, "treatAsIPv6Hostname");
var ls = [
	"ftp",
	"file",
	"http",
	"https",
	"ws",
	"wss"
];
function us(e) {
	if (!e) return !0;
	for (let t of ls) if (e.test(t)) return !0;
	return !1;
}
Q(us, "isSpecialScheme");
function ds(e, t) {
	if (e = os(e, "#"), t || e === "") return e;
	let n = new URL("https://example.com");
	return n.hash = e, n.hash ? n.hash.substring(1, n.hash.length) : "";
}
Q(ds, "canonicalizeHash");
function fs(e, t) {
	if (e = os(e, "?"), t || e === "") return e;
	let n = new URL("https://example.com");
	return n.search = e, n.search ? n.search.substring(1, n.search.length) : "";
}
Q(fs, "canonicalizeSearch");
function ps(e, t) {
	return t || e === "" ? e : cs(e) ? ws(e) : Cs(e);
}
Q(ps, "canonicalizeHostname");
function ms(e, t) {
	if (t || e === "") return e;
	let n = new URL("https://example.com");
	return n.password = e, n.password;
}
Q(ms, "canonicalizePassword");
function hs(e, t) {
	if (t || e === "") return e;
	let n = new URL("https://example.com");
	return n.username = e, n.username;
}
Q(hs, "canonicalizeUsername");
function gs(e, t, n) {
	if (n || e === "") return e;
	if (t && !ls.includes(t)) return new URL(`${t}:${e}`).pathname;
	let r = e[0] == "/";
	return e = new URL(r ? e : "/-" + e, "https://example.com").pathname, r || (e = e.substring(2, e.length)), e;
}
Q(gs, "canonicalizePathname");
function _s(e, t, n) {
	return ys(t) === e && (e = ""), n || e === "" ? e : Ts(e);
}
Q(_s, "canonicalizePort");
function vs(e, t) {
	return e = ss(e, ":"), t || e === "" ? e : bs(e);
}
Q(vs, "canonicalizeProtocol");
function ys(e) {
	switch (e) {
		case "ws":
		case "http": return "80";
		case "wws":
		case "https": return "443";
		case "ftp": return "21";
		default: return "";
	}
}
Q(ys, "defaultPortForProtocol");
function bs(e) {
	if (e === "") return e;
	if (/^[-+.A-Za-z0-9]*$/.test(e)) return e.toLowerCase();
	throw TypeError(`Invalid protocol '${e}'.`);
}
Q(bs, "protocolEncodeCallback");
function xs(e) {
	if (e === "") return e;
	let t = new URL("https://example.com");
	return t.username = e, t.username;
}
Q(xs, "usernameEncodeCallback");
function Ss(e) {
	if (e === "") return e;
	let t = new URL("https://example.com");
	return t.password = e, t.password;
}
Q(Ss, "passwordEncodeCallback");
function Cs(e) {
	if (e === "") return e;
	if (/[\t\n\r #%/:<>?@[\]^\\|]/g.test(e)) throw TypeError(`Invalid hostname '${e}'`);
	let t = new URL("https://example.com");
	return t.hostname = e, t.hostname;
}
Q(Cs, "hostnameEncodeCallback");
function ws(e) {
	if (e === "") return e;
	if (/[^0-9a-fA-F[\]:]/g.test(e)) throw TypeError(`Invalid IPv6 hostname '${e}'`);
	return e.toLowerCase();
}
Q(ws, "ipv6HostnameEncodeCallback");
function Ts(e) {
	if (e === "" || /^[0-9]*$/.test(e) && parseInt(e) <= 65535) return e;
	throw TypeError(`Invalid port '${e}'.`);
}
Q(Ts, "portEncodeCallback");
function Es(e) {
	if (e === "") return e;
	let t = new URL("https://example.com");
	return t.pathname = e[0] === "/" ? e : "/-" + e, e[0] === "/" ? t.pathname : t.pathname.substring(2, t.pathname.length);
}
Q(Es, "standardURLPathnameEncodeCallback");
function Ds(e) {
	return e === "" ? e : new URL(`data:${e}`).pathname;
}
Q(Ds, "pathURLPathnameEncodeCallback");
function Os(e) {
	if (e === "") return e;
	let t = new URL("https://example.com");
	return t.search = e, t.search.substring(1, t.search.length);
}
Q(Os, "searchEncodeCallback");
function ks(e) {
	if (e === "") return e;
	let t = new URL("https://example.com");
	return t.hash = e, t.hash.substring(1, t.hash.length);
}
Q(ks, "hashEncodeCallback");
var As = class {
	#e;
	#t = [];
	#n = {};
	#r = 0;
	#i = 1;
	#a = 0;
	#o = 0;
	#s = 0;
	#c = 0;
	#l = !1;
	constructor(e) {
		this.#e = e;
	}
	get result() {
		return this.#n;
	}
	parse() {
		for (this.#t = Xo(this.#e, !0); this.#r < this.#t.length; this.#r += this.#i) {
			if (this.#i = 1, this.#t[this.#r].type === "END") {
				if (this.#o === 0) {
					this.#f(), this.#C() ? this.#u(9, 1) : this.#S() ? this.#u(8, 1) : this.#u(7, 0);
					continue;
				}
				if (this.#o === 2) {
					this.#p(5);
					continue;
				}
				this.#u(10, 0);
				break;
			}
			if (this.#s > 0) {
				if (this.#T()) --this.#s;
				else continue;
			}
			if (this.#w()) {
				this.#s += 1;
				continue;
			}
			switch (this.#o) {
				case 0:
					this.#g() && this.#p(1);
					break;
				case 1:
					if (this.#g()) {
						this.#k();
						let e = 7, t = 1;
						this.#_() ? (e = 2, t = 3) : this.#l && (e = 2), this.#u(e, t);
					}
					break;
				case 2:
					this.#v() ? this.#p(3) : (this.#x() || this.#S() || this.#C()) && this.#p(5);
					break;
				case 3:
					this.#y() ? this.#u(4, 1) : this.#v() && this.#u(5, 1);
					break;
				case 4:
					this.#v() && this.#u(5, 1);
					break;
				case 5:
					this.#E() ? this.#c += 1 : this.#D() && --this.#c, this.#b() && !this.#c ? this.#u(6, 1) : this.#x() ? this.#u(7, 0) : this.#S() ? this.#u(8, 1) : this.#C() && this.#u(9, 1);
					break;
				case 6:
					this.#x() ? this.#u(7, 0) : this.#S() ? this.#u(8, 1) : this.#C() && this.#u(9, 1);
					break;
				case 7:
					this.#S() ? this.#u(8, 1) : this.#C() && this.#u(9, 1);
					break;
				case 8: this.#C() && this.#u(9, 1);
			}
		}
		this.#n.hostname !== void 0 && this.#n.port === void 0 && (this.#n.port = "");
	}
	#u(e, t) {
		switch (this.#o) {
			case 0: break;
			case 1:
				this.#n.protocol = this.#O();
				break;
			case 2: break;
			case 3:
				this.#n.username = this.#O();
				break;
			case 4:
				this.#n.password = this.#O();
				break;
			case 5:
				this.#n.hostname = this.#O();
				break;
			case 6:
				this.#n.port = this.#O();
				break;
			case 7:
				this.#n.pathname = this.#O();
				break;
			case 8:
				this.#n.search = this.#O();
				break;
			case 9: this.#n.hash = this.#O();
		}
		this.#o !== 0 && e !== 10 && ([
			1,
			2,
			3,
			4
		].includes(this.#o) && [
			6,
			7,
			8,
			9
		].includes(e) && (this.#n.hostname ??= ""), [
			1,
			2,
			3,
			4,
			5,
			6
		].includes(this.#o) && [8, 9].includes(e) && (this.#n.pathname ??= this.#l ? "/" : ""), [
			1,
			2,
			3,
			4,
			5,
			6,
			7
		].includes(this.#o) && e === 9 && (this.#n.search ??= "")), this.#d(e, t);
	}
	#d(e, t) {
		this.#o = e, this.#a = this.#r + t, this.#r += t, this.#i = 0;
	}
	#f() {
		this.#r = this.#a, this.#i = 0;
	}
	#p(e) {
		this.#f(), this.#o = e;
	}
	#m(e) {
		return e < 0 && (e = this.#t.length - e), e < this.#t.length ? this.#t[e] : this.#t[this.#t.length - 1];
	}
	#h(e, t) {
		let n = this.#m(e);
		return n.value === t && (n.type === "CHAR" || n.type === "ESCAPED_CHAR" || n.type === "INVALID_CHAR");
	}
	#g() {
		return this.#h(this.#r, ":");
	}
	#_() {
		return this.#h(this.#r + 1, "/") && this.#h(this.#r + 2, "/");
	}
	#v() {
		return this.#h(this.#r, "@");
	}
	#y() {
		return this.#h(this.#r, ":");
	}
	#b() {
		return this.#h(this.#r, ":");
	}
	#x() {
		return this.#h(this.#r, "/");
	}
	#S() {
		if (this.#h(this.#r, "?")) return !0;
		if (this.#t[this.#r].value !== "?") return !1;
		let e = this.#m(this.#r - 1);
		return e.type !== "NAME" && e.type !== "REGEX" && e.type !== "CLOSE" && e.type !== "ASTERISK";
	}
	#C() {
		return this.#h(this.#r, "#");
	}
	#w() {
		return this.#t[this.#r].type == "OPEN";
	}
	#T() {
		return this.#t[this.#r].type == "CLOSE";
	}
	#E() {
		return this.#h(this.#r, "[");
	}
	#D() {
		return this.#h(this.#r, "]");
	}
	#O() {
		let e = this.#t[this.#r], t = this.#m(this.#a).index;
		return this.#e.substring(t, e.index);
	}
	#k() {
		let e = {};
		Object.assign(e, ns), e.encodePart = bs;
		let t = $o(this.#O(), void 0, e);
		this.#l = us(t);
	}
};
Q(As, "Parser");
var js = [
	"protocol",
	"username",
	"password",
	"hostname",
	"port",
	"pathname",
	"search",
	"hash"
], Ms = "*";
function Ns(e, t) {
	if (typeof e != "string") throw TypeError("parameter 1 is not of type 'string'.");
	let n = new URL(e, t);
	return {
		protocol: n.protocol.substring(0, n.protocol.length - 1),
		username: n.username,
		password: n.password,
		hostname: n.hostname,
		port: n.port,
		pathname: n.pathname,
		search: n.search === "" ? void 0 : n.search.substring(1, n.search.length),
		hash: n.hash === "" ? void 0 : n.hash.substring(1, n.hash.length)
	};
}
Q(Ns, "extractValues");
function Ps(e, t) {
	return t ? Is(e) : e;
}
Q(Ps, "processBaseURLString");
function Fs(e, t, n) {
	let r;
	if (typeof t.baseURL == "string") try {
		r = new URL(t.baseURL), t.protocol === void 0 && (e.protocol = Ps(r.protocol.substring(0, r.protocol.length - 1), n)), !n && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && (e.username = Ps(r.username, n)), !n && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && t.password === void 0 && (e.password = Ps(r.password, n)), t.protocol === void 0 && t.hostname === void 0 && (e.hostname = Ps(r.hostname, n)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && (e.port = Ps(r.port, n)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && (e.pathname = Ps(r.pathname, n)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && (e.search = Ps(r.search.substring(1, r.search.length), n)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && t.hash === void 0 && (e.hash = Ps(r.hash.substring(1, r.hash.length), n));
	} catch {
		throw TypeError(`invalid baseURL '${t.baseURL}'.`);
	}
	if (typeof t.protocol == "string" && (e.protocol = vs(t.protocol, n)), typeof t.username == "string" && (e.username = hs(t.username, n)), typeof t.password == "string" && (e.password = ms(t.password, n)), typeof t.hostname == "string" && (e.hostname = ps(t.hostname, n)), typeof t.port == "string" && (e.port = _s(t.port, e.protocol, n)), typeof t.pathname == "string") {
		if (e.pathname = t.pathname, r && !as(e.pathname, n)) {
			let t = r.pathname.lastIndexOf("/");
			t >= 0 && (e.pathname = Ps(r.pathname.substring(0, t + 1), n) + e.pathname);
		}
		e.pathname = gs(e.pathname, e.protocol, n);
	}
	return typeof t.search == "string" && (e.search = fs(t.search, n)), typeof t.hash == "string" && (e.hash = ds(t.hash, n)), e;
}
Q(Fs, "applyInit");
function Is(e) {
	return e.replace(/([+*?:{}()\\])/g, "\\$1");
}
Q(Is, "escapePatternString");
function Ls(e) {
	return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
}
Q(Ls, "escapeRegexpString");
function Rs(e, t) {
	t.delimiter ??= "/#?", t.prefixes ??= "./", t.sensitive ??= !1, t.strict ??= !1, t.end ??= !0, t.start ??= !0, t.endsWith = "";
	let n = `[^${Ls(t.delimiter)}]+?`, r = /[$_\u200C\u200D\p{ID_Continue}]/u, i = "";
	for (let a = 0; a < e.length; ++a) {
		let o = e[a];
		if (o.type === 3) {
			if (o.modifier === 3) {
				i += Is(o.value);
				continue;
			}
			i += `{${Is(o.value)}}${es(o.modifier)}`;
			continue;
		}
		let s = o.hasCustomName(), c = !!o.suffix.length || !!o.prefix.length && (o.prefix.length !== 1 || !t.prefixes.includes(o.prefix)), l = a > 0 ? e[a - 1] : null, u = a < e.length - 1 ? e[a + 1] : null;
		if (!c && s && o.type === 1 && o.modifier === 3 && u && !u.prefix.length && !u.suffix.length) {
			if (u.type === 3) {
				let e = u.value.length > 0 ? u.value[0] : "";
				c = r.test(e);
			} else c = !u.hasCustomName();
		}
		if (!c && !o.prefix.length && l && l.type === 3) {
			let e = l.value[l.value.length - 1];
			c = t.prefixes.includes(e);
		}
		c && (i += "{"), i += Is(o.prefix), s && (i += `:${o.name}`), o.type === 2 ? i += `(${o.value})` : o.type === 1 ? s || (i += `(${n})`) : o.type === 0 && (!s && (!l || l.type === 3 || l.modifier !== 3 || c || o.prefix !== "") ? i += "*" : i += "(.*)"), o.type === 1 && s && o.suffix.length && r.test(o.suffix[0]) && (i += "\\"), i += Is(o.suffix), c && (i += "}"), o.modifier !== 3 && (i += es(o.modifier));
	}
	return i;
}
Q(Rs, "partsToPattern");
var zs = class {
	#e;
	#t = {};
	#n = {};
	#r = {};
	#i = {};
	#a = !1;
	constructor(e = {}, t, n) {
		try {
			let r;
			if (typeof t == "string" ? r = t : n = t, typeof e == "string") {
				let t = new As(e);
				if (t.parse(), e = t.result, r === void 0 && typeof e.protocol != "string") throw TypeError("A base URL must be provided for a relative constructor string.");
				e.baseURL = r;
			} else {
				if (!e || typeof e != "object") throw TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");
				if (r) throw TypeError("parameter 1 is not of type 'string'.");
			}
			typeof n > "u" && (n = { ignoreCase: !1 });
			let i = { ignoreCase: n.ignoreCase === !0 }, a = {
				pathname: Ms,
				protocol: Ms,
				username: Ms,
				password: Ms,
				hostname: Ms,
				port: Ms,
				search: Ms,
				hash: Ms
			};
			this.#e = Fs(a, e, !0), ys(this.#e.protocol) === this.#e.port && (this.#e.port = "");
			let o;
			for (o of js) {
				if (!(o in this.#e)) continue;
				let e = {}, t = this.#e[o];
				switch (this.#n[o] = [], o) {
					case "protocol":
						Object.assign(e, ns), e.encodePart = bs;
						break;
					case "username":
						Object.assign(e, ns), e.encodePart = xs;
						break;
					case "password":
						Object.assign(e, ns), e.encodePart = Ss;
						break;
					case "hostname":
						Object.assign(e, rs), e.encodePart = cs(t) ? ws : Cs;
						break;
					case "port":
						Object.assign(e, ns), e.encodePart = Ts;
						break;
					case "pathname":
						us(this.#t.protocol) ? (Object.assign(e, is, i), e.encodePart = Es) : (Object.assign(e, ns, i), e.encodePart = Ds);
						break;
					case "search":
						Object.assign(e, ns, i), e.encodePart = Os;
						break;
					case "hash": Object.assign(e, ns, i), e.encodePart = ks;
				}
				try {
					this.#i[o] = Zo(t, e), this.#t[o] = ts(this.#i[o], this.#n[o], e), this.#r[o] = Rs(this.#i[o], e), this.#a = this.#a || this.#i[o].some((e) => e.type === 2);
				} catch {
					throw TypeError(`invalid ${o} pattern '${this.#e[o]}'.`);
				}
			}
		} catch (e) {
			throw TypeError(`Failed to construct 'URLPattern': ${e.message}`);
		}
	}
	get [Symbol.toStringTag]() {
		return "URLPattern";
	}
	test(e = {}, t) {
		let n = {
			pathname: "",
			protocol: "",
			username: "",
			password: "",
			hostname: "",
			port: "",
			search: "",
			hash: ""
		};
		if (typeof e != "string" && t) throw TypeError("parameter 1 is not of type 'string'.");
		if (typeof e > "u") return !1;
		try {
			n = typeof e == "object" ? Fs(n, e, !1) : Fs(n, Ns(e, t), !1);
		} catch {
			return !1;
		}
		let r;
		for (r of js) if (!this.#t[r].exec(n[r])) return !1;
		return !0;
	}
	exec(e = {}, t) {
		let n = {
			pathname: "",
			protocol: "",
			username: "",
			password: "",
			hostname: "",
			port: "",
			search: "",
			hash: ""
		};
		if (typeof e != "string" && t) throw TypeError("parameter 1 is not of type 'string'.");
		if (typeof e > "u") return;
		try {
			n = typeof e == "object" ? Fs(n, e, !1) : Fs(n, Ns(e, t), !1);
		} catch {
			return null;
		}
		let r = {};
		r.inputs = t ? [e, t] : [e];
		let i;
		for (i of js) {
			let e = this.#t[i].exec(n[i]);
			if (!e) return null;
			let t = {};
			for (let [n, r] of this.#n[i].entries()) (typeof r == "string" || typeof r == "number") && (t[r] = e[n + 1]);
			r[i] = {
				input: n[i] ?? "",
				groups: t
			};
		}
		return r;
	}
	static compareComponent(e, t, n) {
		let r = Q((e, t) => {
			for (let n of [
				"type",
				"modifier",
				"prefix",
				"value",
				"suffix"
			]) {
				if (e[n] < t[n]) return -1;
				if (e[n] !== t[n]) return 1;
			}
			return 0;
		}, "comparePart"), i = new Go(3, "", "", "", "", 3), a = new Go(0, "", "", "", "", 3), o = Q((e, t) => {
			let n = 0;
			for (; n < Math.min(e.length, t.length); ++n) {
				let i = r(e[n], t[n]);
				if (i) return i;
			}
			return e.length === t.length ? 0 : r(e[n] ?? i, t[n] ?? i);
		}, "comparePartList");
		return !t.#r[e] && !n.#r[e] ? 0 : t.#r[e] && !n.#r[e] ? o(t.#i[e], [a]) : !t.#r[e] && n.#r[e] ? o([a], n.#i[e]) : o(t.#i[e], n.#i[e]);
	}
	get protocol() {
		return this.#r.protocol;
	}
	get username() {
		return this.#r.username;
	}
	get password() {
		return this.#r.password;
	}
	get hostname() {
		return this.#r.hostname;
	}
	get port() {
		return this.#r.port;
	}
	get pathname() {
		return this.#r.pathname;
	}
	get search() {
		return this.#r.search;
	}
	get hash() {
		return this.#r.hash;
	}
	get hasRegExpGroups() {
		return this.#a;
	}
};
Q(zs, "URLPattern"), globalThis.URLPattern || (globalThis.URLPattern = zs);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/cdp/TargetManager.js
function Bs(e, t) {
	return !!e._subtype() && !t.subtype;
}
var Vs = class extends L {
	#e;
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Map();
	#i = /* @__PURE__ */ new Set();
	#a;
	#o;
	#s = /* @__PURE__ */ new WeakMap();
	#c = /* @__PURE__ */ new WeakMap();
	#l = z.create();
	#u = !0;
	#d = [{}];
	#f = /* @__PURE__ */ new Set();
	#p = !1;
	#m = [];
	#h = [];
	constructor(e, t, n, r = !0, i, a) {
		if (super(), i && a) throw Error("Cannot specify both blockList and allowList");
		this.#e = e, this.#a = n, this.#o = t, this.#u = r, this.#m = this.#D(i), this.#h = this.#D(a), this.#e.on("Target.targetCreated", this.#x), this.#e.on("Target.targetDestroyed", this.#S), this.#e.on("Target.targetInfoChanged", this.#C), this.#e.on(R.SessionDetached, this.#b), this.#g(this.#e);
	}
	async initialize() {
		await this.#e.send("Target.setDiscoverTargets", {
			discover: !0,
			filter: this.#d
		}), await this.#e.send("Target.setAutoAttach", {
			waitForDebuggerOnStart: !0,
			flatten: !0,
			autoAttach: !0,
			filter: [{
				type: "page",
				exclude: !0
			}, ...this.#d]
		}), this.#p = !0, this.#T(), await this.#l.valueOrThrow();
	}
	addToIgnoreTarget(e) {
		this.#i.add(e);
	}
	getChildTargets(e) {
		return e._childTargets();
	}
	dispose() {
		this.#e.off("Target.targetCreated", this.#x), this.#e.off("Target.targetDestroyed", this.#S), this.#e.off("Target.targetInfoChanged", this.#C), this.#e.off(R.SessionDetached, this.#b), this.#_(this.#e);
	}
	getAvailableTargets() {
		return this.#n;
	}
	getDiscoveredTargetInfos() {
		return this.#t;
	}
	#g(e) {
		let t = (t) => {
			this.#w(e, t);
		};
		N(!this.#s.has(e)), this.#s.set(e, t), e.on("Target.attachedToTarget", t);
		let n = (t) => this.#E(e, t);
		N(!this.#c.has(e)), this.#c.set(e, n), e.on("Target.detachedFromTarget", n);
	}
	#_(e) {
		let t = this.#s.get(e);
		t && (e.off("Target.attachedToTarget", t), this.#s.delete(e));
		let n = this.#c.get(e);
		n && (e.off("Target.detachedFromTarget", n), this.#c.delete(e));
	}
	#v = async (e, t) => {
		await e.send("Runtime.runIfWaitingForDebugger").catch(P), await t.send("Target.detachFromTarget", { sessionId: e.id() }).catch(P);
	};
	#y = (e) => e instanceof Ur ? e.target() : null;
	#b = (e) => {
		this.#_(e);
	};
	#x = async (e) => {
		if (this.#t.set(e.targetInfo.targetId, e.targetInfo), this.emit("targetDiscovered", e.targetInfo), e.targetInfo.type === "browser" && e.targetInfo.attached) {
			if (this.#n.has(e.targetInfo.targetId)) return;
			let t = this.#o(e.targetInfo, void 0);
			t._initialize(), this.#n.set(e.targetInfo.targetId, t);
		}
	};
	#S = (e) => {
		let t = this.#t.get(e.targetId);
		if (this.#t.delete(e.targetId), this.#T(e.targetId), t?.type === "service_worker") {
			let t = this.#n.get(e.targetId);
			t && (this.emit("targetGone", t), this.#n.delete(e.targetId));
		}
	};
	#C = (e) => {
		if (this.#t.set(e.targetInfo.targetId, e.targetInfo), this.#i.has(e.targetInfo.targetId) || !e.targetInfo.attached) return;
		let t = this.#n.get(e.targetInfo.targetId);
		if (!t) return;
		let n = t.url(), r = t._initializedDeferred.value() === Z.SUCCESS;
		if (Bs(t, e.targetInfo)) {
			let e = t._session();
			N(e, "Target that is being activated is missing a CDPSession."), e.parentSession()?.emit(R.Swapped, e);
		}
		t._targetInfoChanged(e.targetInfo), r && n !== t.url() && this.emit("targetChanged", {
			target: t,
			wasInitialized: r,
			previousURL: n
		});
	};
	#w = async (e, t) => {
		let n = t.targetInfo, r = this.#e._session(t.sessionId);
		if (!r) throw Error(`Session ${t.sessionId} was not created.`);
		if (!this.#e.isAutoAttached(n.targetId)) return;
		if (!this.#p && !this.isUrlAllowed(n.url)) {
			await this.#v(r, e);
			return;
		}
		if (n.type === "service_worker") {
			if (await this.#v(r, e), this.#n.has(n.targetId) || this.#i.has(n.targetId) || !this.#t.has(n.targetId)) return;
			let t = this.#o(n);
			t._initialize(), this.#n.set(n.targetId, t), this.emit("targetAvailable", t);
			return;
		}
		let i = this.#n.get(n.targetId), a = i !== void 0;
		i ||= this.#o(n, r, e instanceof Ur ? e : void 0);
		let o = this.#y(e);
		if (this.#a && !this.#a(i)) {
			this.#i.add(n.targetId), o?.type() === "tab" && this.#T(o._targetId), await this.#v(r, e);
			return;
		}
		this.#u && t.targetInfo.type === "tab" && !this.#p && this.#f.add(t.targetInfo.targetId), this.#g(r), a ? (r.setTarget(i), this.#r.set(r.id(), i)) : (i._initialize(), this.#n.set(n.targetId, i), this.#r.set(r.id(), i)), o?._addChildTarget(i), e.emit(R.Ready, r), a || this.emit("targetAvailable", i), o?.type() === "tab" && this.#T(o._targetId), await Promise.all([
			r.send("Target.setAutoAttach", {
				waitForDebuggerOnStart: !0,
				flatten: !0,
				autoAttach: !0,
				filter: this.#d
			}),
			this.#O(r),
			r.send("Runtime.runIfWaitingForDebugger")
		]).catch(P);
	};
	#T(e) {
		e !== void 0 && this.#f.delete(e), this.#p && this.#f.size === 0 && this.#l.resolve();
	}
	#E = (e, t) => {
		let n = this.#r.get(t.sessionId);
		this.#r.delete(t.sessionId), n && (e instanceof Ur && e.target()._removeChildTarget(n), this.#n.delete(n._targetId), this.emit("targetGone", n));
	};
	isUrlAllowed = (e) => {
		if (this.#m.length === 0 && this.#h.length === 0 || !e || e === "about:blank") return !0;
		for (let t of this.#m) if (t.pattern.test(e)) return !1;
		if (this.#h.length > 0) {
			for (let t of this.#h) if (t.pattern.test(e)) return !0;
			return !1;
		}
		return !0;
	};
	#D(e) {
		let t = [];
		for (let n of e ?? []) t.push({
			pattern: new zs(n),
			rule: n
		});
		return t;
	}
	#O = async (e) => {
		if (this.#m.length === 0 && this.#h.length === 0) return;
		let t = [];
		for (let e of this.#m) t.push({
			urlPattern: e.rule,
			offline: !0,
			latency: 0,
			downloadThroughput: -1,
			uploadThroughput: -1
		});
		if (this.#h.length > 0) {
			for (let e of this.#h) t.push({
				urlPattern: e.rule,
				offline: !1,
				latency: 0,
				downloadThroughput: -1,
				uploadThroughput: -1
			});
			t.push({
				urlPattern: "",
				offline: !0,
				latency: 0,
				downloadThroughput: -1,
				uploadThroughput: -1
			});
		}
		await e.send("Network.emulateNetworkConditionsByRule", {
			offline: this.#m.length > 0 || void 0,
			matchedNetworkConditions: t
		});
	};
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/puppeteer/package/lib/puppeteer/cdp/Browser.js
function Hs(e) {
	return e.startsWith("devtools://devtools/bundled/devtools_app.html");
}
var Us = class e extends Jn {
	protocol = "cdp";
	static async _create(t, n, r, i, a, o, s, c, l, u = !0, d = !0, f = !0, p = !1, m, h) {
		let g = new e(t, n, i, o, s, c, l, u, d, f, p, m, h);
		if (h) {
			let e = await g.#b();
			if (parseInt(e.product.match(/\d+/)?.[0] ?? "0", 10) < 149) throw Error("The allowlist option require Chrome 149 or greater.");
		}
		return r && await t.send("Security.setIgnoreCertificateErrors", { ignore: !0 }), await g._attach(a), g;
	}
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s = /* @__PURE__ */ new Map();
	#c = !0;
	#l = !0;
	#u;
	#d = !1;
	#f = /* @__PURE__ */ new Map();
	constructor(e, t, n, r, i, a, o, s = !0, c = !0, l = !0, u = !1, d, f) {
		super(), this.#c = c, this.#l = l, this.#e = n, this.#t = r, this.#n = e, this.#r = i || (() => {}), this.#i = a || (() => !0), this.#d = u, this.#m(o), e.rejectEmulateNetworkConditionsCalls = !!(d && d.length > 0 || f && f.length > 0), this.#u = new Vs(e, this.#h, this.#i, s, d, f), this.#o = new Io(this.#n, this);
		for (let e of t) this.#s.set(e, new Io(this.#n, this, e));
	}
	#p = () => {
		this.emit("disconnected", void 0);
	};
	async _attach(e) {
		this.#n.on(R.Disconnected, this.#p), e && await this.#o.setDownloadBehavior(e), this.#u.on("targetAvailable", this.#g), this.#u.on("targetGone", this.#_), this.#u.on("targetChanged", this.#v), this.#u.on("targetDiscovered", this.#y), await this.#u.initialize();
	}
	_detach() {
		this.#n.off(R.Disconnected, this.#p), this.#u.off("targetAvailable", this.#g), this.#u.off("targetGone", this.#_), this.#u.off("targetChanged", this.#v), this.#u.off("targetDiscovered", this.#y);
	}
	process() {
		return this.#t ?? null;
	}
	_targetManager() {
		return this.#u;
	}
	#m(e) {
		this.#a = e || ((e) => e.type() === "page" || e.type() === "background_page" || e.type() === "webview" || this.#d && e.type() === "other" && Hs(e.url()));
	}
	_getIsPageTargetCallback() {
		return this.#a;
	}
	async createBrowserContext(e = {}) {
		let { proxyServer: t, proxyBypassList: n, downloadBehavior: r } = e, { browserContextId: i } = await this.#n.send("Target.createBrowserContext", {
			proxyServer: t,
			proxyBypassList: n && n.join(",")
		}), a = new Io(this.#n, this, i);
		return r && await a.setDownloadBehavior(r), this.#s.set(i, a), a;
	}
	browserContexts() {
		return [this.#o, ...Array.from(this.#s.values())];
	}
	defaultBrowserContext() {
		return this.#o;
	}
	async _disposeContext(e) {
		e && (await this.#n.send("Target.disposeBrowserContext", { browserContextId: e }), this.#s.delete(e));
	}
	#h = (e, t) => {
		let { browserContextId: n } = e, r = n && this.#s.has(n) ? this.#s.get(n) : this.#o;
		if (!r) throw Error("Missing browser context");
		let i = (t) => this.#n._createSession(e, t), a = new Uo(e, t, r, this.#u, i);
		return e.url && Hs(e.url) ? new Vo(e, t, r, this.#u, i, this.#e ?? null) : this.#a(a) ? new Bo(e, t, r, this.#u, i, this.#e ?? null) : e.type === "service_worker" || e.type === "shared_worker" ? new Ho(e, t, r, this.#u, i) : a;
	};
	#g = async (e) => {
		e._isTargetExposed() && await e._initializedDeferred.valueOrThrow() === Z.SUCCESS && (this.emit("targetcreated", e), e.browserContext().emit("targetcreated", e));
	};
	#_ = async (e) => {
		e._initializedDeferred.resolve(Z.ABORTED), e._isClosedDeferred.resolve(), e._isTargetExposed() && await e._initializedDeferred.valueOrThrow() === Z.SUCCESS && (this.emit("targetdestroyed", e), e.browserContext().emit("targetdestroyed", e));
	};
	#v = ({ target: e }) => {
		this.emit("targetchanged", e), e.browserContext().emit("targetchanged", e);
	};
	#y = (e) => {
		this.emit("targetdiscovered", e);
	};
	wsEndpoint() {
		return this.#n.url();
	}
	async newPage(e) {
		return await this.#o.newPage(e);
	}
	async _createPageInContext(e, t) {
		let n = this.targets().filter((t) => t.browserContext().id === e).length > 0, r = t?.type === "window" ? t.windowBounds : void 0, { targetId: i } = await this.#n.send("Target.createTarget", {
			url: "about:blank",
			browserContextId: e || void 0,
			left: r?.left,
			top: r?.top,
			width: r?.width,
			height: r?.height,
			windowState: r?.windowState,
			newWindow: n && t?.type === "window" ? !0 : void 0,
			background: t?.background
		}), a = await this.waitForTarget((e) => e._targetId === i);
		if (!a) throw Error(`Missing target for page (id = ${i})`);
		if (await a._initializedDeferred.valueOrThrow() !== Z.SUCCESS) throw Error(`Failed to create target for page (id = ${i})`);
		let o = await a.page();
		if (!o) throw Error(`Failed to create a page for context (id = ${e})`);
		return o;
	}
	async _createDevToolsPage(e) {
		let t = await this.#n.send("Target.openDevTools", { targetId: e });
		return await this._getDevToolsTargetPage(t.targetId);
	}
	async _getDevToolsTargetPage(e) {
		let t = await this.waitForTarget((t) => t._targetId === e);
		if (!t) throw Error(`Missing target for DevTools page (id = ${e})`);
		if (await t._initializedDeferred.valueOrThrow() !== Z.SUCCESS) throw Error(`Failed to create target for DevTools page (id = ${e})`);
		let n = await t.page();
		if (!n) throw Error(`Failed to create a DevTools Page for target (id = ${e})`);
		return n;
	}
	async _hasDevToolsTarget(e) {
		return (await this.#n.send("Target.getDevToolsTarget", { targetId: e })).targetId;
	}
	async installExtension(e) {
		let { id: t } = await this.#n.send("Extensions.loadUnpacked", { path: e });
		return this.#f.delete(t), t;
	}
	async uninstallExtension(e) {
		await this.#n.send("Extensions.uninstall", { id: e });
		let t = [];
		for (let [n, r] of this._targetManager().getDiscoveredTargetInfos().entries()) r.url.includes(e) && r.type === "service_worker" && (this._targetManager().addToIgnoreTarget(n), t.push(new Promise((e) => setTimeout(() => {
			this.#n.emit("Target.targetDestroyed", { targetId: n }), e(null);
		}, 0))));
		await Promise.all(t), this.#f.delete(e);
	}
	async screens() {
		let { screenInfos: e } = await this.#n.send("Emulation.getScreenInfos");
		return e;
	}
	async addScreen(e) {
		let { screenInfo: t } = await this.#n.send("Emulation.addScreen", e);
		return t;
	}
	async removeScreen(e) {
		return await this.#n.send("Emulation.removeScreen", { screenId: e });
	}
	async getWindowBounds(e) {
		let { bounds: t } = await this.#n.send("Browser.getWindowBounds", { windowId: Number(e) });
		return t;
	}
	async setWindowBounds(e, t) {
		await this.#n.send("Browser.setWindowBounds", {
			windowId: Number(e),
			bounds: t
		});
	}
	targets() {
		return Array.from(this.#u.getAvailableTargets().values()).filter((e) => e._isTargetExposed() && e._initializedDeferred.value() === Z.SUCCESS);
	}
	target() {
		let e = this.targets().find((e) => e.type() === "browser");
		if (!e) throw Error("Browser target is not found");
		return e;
	}
	async version() {
		return (await this.#b()).product;
	}
	async userAgent() {
		return (await this.#b()).userAgent;
	}
	async close() {
		await this.#r.call(null), await this.disconnect();
	}
	disconnect() {
		return this.#u.dispose(), this.#n.dispose(), this._detach(), Promise.resolve();
	}
	get _connection() {
		return this.#n;
	}
	get connected() {
		return !this.#n._closed;
	}
	#b() {
		return this.#n.send("Browser.getVersion");
	}
	get debugInfo() {
		return { pendingProtocolErrors: this.#n.getPendingProtocolErrors() };
	}
	isNetworkEnabled() {
		return this.#c;
	}
	async extensions() {
		let e = await this.#n.send("Extensions.getExtensions"), t = /* @__PURE__ */ new Map();
		for (let n of e.extensions) if (this.#f.has(n.id)) t.set(n.id, this.#f.get(n.id));
		else {
			let e = new Ro(n.id, n.version, n.name, n.path, n.enabled, this);
			t.set(n.id, e);
		}
		return this.#f = t, this.#f;
	}
	isIssuesEnabled() {
		return this.#l;
	}
}, Ws = class extends qr {
	#e;
	#t;
	constructor(e, t) {
		super("", { close: () => void 0 }), this.#e = e, this.#e.observe(this), this.#t = t;
	}
	_rawSend(e, t, n, r, i) {
		return this.#e.send(t, n, r ?? this.#t).then((e) => "result" in e ? e.result : {});
	}
	onEvent(e) {
		let { sessionId: t } = e;
		if (t === this.#t) e.sessionId = void 0;
		else if (!t || !this._sessions.has(t)) return;
		super.onMessage(JSON.stringify(e));
	}
	onDisconnect() {
		this.dispose();
	}
	dispose() {
		super.dispose(), this.#e.unobserve(this), this.#e.send("Target.detachFromTarget", { sessionId: this.#t }, this.#t);
	}
}, Gs = class {
	static async connectPuppeteerToConnectionViaTab(e) {
		let { connection: t, targetId: n, sessionId: r, isPageTargetCallback: i } = e, a = new Ws(t, r), o = Us._create(a, [], !1, void 0, void 0, void 0, void 0, void 0, (e) => i(e._getTargetInfo()), !1), [, s] = await Promise.all([a._createSession({ targetId: n }, !0), o]);
		return await s.waitForTarget((e) => e.type() === "page"), {
			page: (await s.pages())[0],
			browser: s,
			puppeteerConnection: a
		};
	}
};
//#endregion
export { Gs as t };
