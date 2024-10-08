var Xh = Object.defineProperty,
  ep = Object.defineProperties;
var tp = Object.getOwnPropertyDescriptors;
var xr = Object.getOwnPropertySymbols;
var Fc = Object.prototype.hasOwnProperty,
  Lc = Object.prototype.propertyIsEnumerable;
var kc = (e, t, n) =>
    t in e
      ? Xh(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  C = (e, t) => {
    for (var n in (t ||= {})) Fc.call(t, n) && kc(e, n, t[n]);
    if (xr) for (var n of xr(t)) Lc.call(t, n) && kc(e, n, t[n]);
    return e;
  },
  Z = (e, t) => ep(e, tp(t));
var jc = (e, t) => {
  var n = {};
  for (var r in e) Fc.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && xr)
    for (var r of xr(e)) t.indexOf(r) < 0 && Lc.call(e, r) && (n[r] = e[r]);
  return n;
};
var Pi = null;
var Ri = 1,
  Vc = Symbol("SIGNAL");
function V(e) {
  let t = Pi;
  return (Pi = e), t;
}
function Uc() {
  return Pi;
}
var ki = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function np(e) {
  if (!(Ui(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Ri)) {
    if (!e.producerMustRecompute(e) && !Li(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = Ri);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = Ri);
  }
}
function Fi(e) {
  return e && (e.nextProducerIndex = 0), V(e);
}
function Bc(e, t) {
  if (
    (V(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (Ui(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Vi(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function Li(e) {
  Bi(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (np(n), r !== n.version)) return !0;
  }
  return !1;
}
function ji(e) {
  if ((Bi(e), Ui(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Vi(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Vi(e, t) {
  if ((rp(e), e.liveConsumerNode.length === 1 && op(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      Vi(e.producerNode[r], e.producerIndexOfThis[r]);
  let n = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t];
    Bi(o), (o.producerIndexOfThis[r] = t);
  }
}
function Ui(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function Bi(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function rp(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function op(e) {
  return e.producerNode !== void 0;
}
function ip() {
  throw new Error();
}
var sp = ip;
function $c(e) {
  sp = e;
}
function S(e) {
  return typeof e == "function";
}
function Gt(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Nr = Gt(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    },
);
function On(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var W = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (S(r))
        try {
          r();
        } catch (i) {
          t = i instanceof Nr ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Hc(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof Nr ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new Nr(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Hc(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && On(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && On(n, t), t instanceof e && t._removeParent(this);
  }
};
W.EMPTY = (() => {
  let e = new W();
  return (e.closed = !0), e;
})();
var $i = W.EMPTY;
function Ar(e) {
  return (
    e instanceof W ||
    (e && "closed" in e && S(e.remove) && S(e.add) && S(e.unsubscribe))
  );
}
function Hc(e) {
  S(e) ? e() : e.unsubscribe();
}
var Fe = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Zt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = Zt;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = Zt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Or(e) {
  Zt.setTimeout(() => {
    let { onUnhandledError: t } = Fe;
    if (t) t(e);
    else throw e;
  });
}
function Rn() {}
var zc = Hi("C", void 0, void 0);
function Gc(e) {
  return Hi("E", void 0, e);
}
function Zc(e) {
  return Hi("N", e, void 0);
}
function Hi(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Et = null;
function qt(e) {
  if (Fe.useDeprecatedSynchronousErrorHandling) {
    let t = !Et;
    if ((t && (Et = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Et;
      if (((Et = null), n)) throw r;
    }
  } else e();
}
function qc(e) {
  Fe.useDeprecatedSynchronousErrorHandling &&
    Et &&
    ((Et.errorThrown = !0), (Et.error = e));
}
var bt = class extends W {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Ar(t) && t.add(this))
          : (this.destination = lp);
    }
    static create(t, n, r) {
      return new Wt(t, n, r);
    }
    next(t) {
      this.isStopped ? Gi(Zc(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? Gi(Gc(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? Gi(zc, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  ap = Function.prototype.bind;
function zi(e, t) {
  return ap.call(e, t);
}
var Zi = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          Rr(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          Rr(r);
        }
      else Rr(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          Rr(n);
        }
    }
  },
  Wt = class extends bt {
    constructor(t, n, r) {
      super();
      let o;
      if (S(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && Fe.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && zi(t.next, i),
              error: t.error && zi(t.error, i),
              complete: t.complete && zi(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new Zi(o);
    }
  };
function Rr(e) {
  Fe.useDeprecatedSynchronousErrorHandling ? qc(e) : Or(e);
}
function cp(e) {
  throw e;
}
function Gi(e, t) {
  let { onStoppedNotification: n } = Fe;
  n && Zt.setTimeout(() => n(e, t));
}
var lp = { closed: !0, next: Rn, error: cp, complete: Rn };
var Yt = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function ge(e) {
  return e;
}
function qi(...e) {
  return Wi(e);
}
function Wi(e) {
  return e.length === 0
    ? ge
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n);
        };
}
var B = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, o) {
      let i = dp(n) ? n : new Wt(n, r, o);
      return (
        qt(() => {
          let { operator: s, source: c } = this;
          i.add(
            s ? s.call(i, c) : c ? this._subscribe(i) : this._trySubscribe(i),
          );
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = Wc(r)),
        new r((o, i) => {
          let s = new Wt({
            next: (c) => {
              try {
                n(c);
              } catch (a) {
                i(a), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [Yt]() {
      return this;
    }
    pipe(...n) {
      return Wi(n)(this);
    }
    toPromise(n) {
      return (
        (n = Wc(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i),
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function Wc(e) {
  var t;
  return (t = e ?? Fe.Promise) !== null && t !== void 0 ? t : Promise;
}
function up(e) {
  return e && S(e.next) && S(e.error) && S(e.complete);
}
function dp(e) {
  return (e && e instanceof bt) || (up(e) && Ar(e));
}
function Yi(e) {
  return S(e?.lift);
}
function k(e) {
  return (t) => {
    if (Yi(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function F(e, t, n, r, o) {
  return new Qi(e, t, n, r, o);
}
var Qi = class extends bt {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (c) {
            try {
              n(c);
            } catch (a) {
              t.error(a);
            }
          }
        : super._next),
      (this._error = o
        ? function (c) {
            try {
              o(c);
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (c) {
              t.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
function Qt() {
  return k((e, t) => {
    let n = null;
    e._refCount++;
    let r = F(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        n = null;
        return;
      }
      let o = e._connection,
        i = n;
      (n = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe();
    });
    e.subscribe(r), r.closed || (n = e.connect());
  });
}
var Kt = class extends B {
  constructor(t, n) {
    super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Yi(t) && (this.lift = t.lift);
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return (
      (!t || t.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    (this._subject = this._connection = null), t?.unsubscribe();
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new W();
      let n = this.getSubject();
      t.add(
        this.source.subscribe(
          F(
            n,
            void 0,
            () => {
              this._teardown(), n.complete();
            },
            (r) => {
              this._teardown(), n.error(r);
            },
            () => this._teardown(),
          ),
        ),
      ),
        t.closed && ((this._connection = null), (t = W.EMPTY));
    }
    return t;
  }
  refCount() {
    return Qt()(this);
  }
};
var Yc = Gt(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    },
);
var le = (() => {
    class e extends B {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new Pr(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new Yc();
      }
      next(n) {
        qt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        qt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        qt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? $i
          : ((this.currentObservers = null),
            i.push(n),
            new W(() => {
              (this.currentObservers = null), On(i, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new B();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new Pr(t, n)), e;
  })(),
  Pr = class extends le {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n);
    }
    next(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : $i;
    }
  };
var oe = class extends le {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return !n.closed && t.next(this._value), n;
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return this._throwIfClosed(), r;
  }
  next(t) {
    super.next((this._value = t));
  }
};
var me = new B((e) => e.complete());
function Qc(e) {
  return e && S(e.schedule);
}
function Kc(e) {
  return e[e.length - 1];
}
function Jc(e) {
  return S(Kc(e)) ? e.pop() : void 0;
}
function ft(e) {
  return Qc(Kc(e)) ? e.pop() : void 0;
}
function el(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function c(u) {
      try {
        l(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function a(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? i(u.value) : o(u.value).then(c, a);
    }
    l((r = r.apply(e, t || [])).next());
  });
}
function Xc(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined.",
  );
}
function It(e) {
  return this instanceof It ? ((this.v = e), this) : new It(e);
}
function tl(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype,
    )),
    c("next"),
    c("throw"),
    c("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(p) {
    return function (y) {
      return Promise.resolve(y).then(p, d);
    };
  }
  function c(p, y) {
    r[p] &&
      ((o[p] = function (x) {
        return new Promise(function (z, $) {
          i.push([p, x, z, $]) > 1 || a(p, x);
        });
      }),
      y && (o[p] = y(o[p])));
  }
  function a(p, y) {
    try {
      l(r[p](y));
    } catch (x) {
      m(i[0][3], x);
    }
  }
  function l(p) {
    p.value instanceof It
      ? Promise.resolve(p.value.v).then(u, d)
      : m(i[0][2], p);
  }
  function u(p) {
    a("next", p);
  }
  function d(p) {
    a("throw", p);
  }
  function m(p, y) {
    p(y), i.shift(), i.length && a(i[0][0], i[0][1]);
  }
}
function nl(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Xc == "function" ? Xc(e) : e[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (c, a) {
          (s = e[i](s)), o(c, a, s.done, s.value);
        });
      };
  }
  function o(i, s, c, a) {
    Promise.resolve(a).then(function (l) {
      i({ value: l, done: c });
    }, s);
  }
}
var kr = (e) => e && typeof e.length == "number" && typeof e != "function";
function Fr(e) {
  return S(e?.then);
}
function Lr(e) {
  return S(e[Yt]);
}
function jr(e) {
  return Symbol.asyncIterator && S(e?.[Symbol.asyncIterator]);
}
function Vr(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function fp() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Ur = fp();
function Br(e) {
  return S(e?.[Ur]);
}
function $r(e) {
  return tl(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield It(n.read());
        if (o) return yield It(void 0);
        yield yield It(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Hr(e) {
  return S(e?.getReader);
}
function ee(e) {
  if (e instanceof B) return e;
  if (e != null) {
    if (Lr(e)) return hp(e);
    if (kr(e)) return pp(e);
    if (Fr(e)) return gp(e);
    if (jr(e)) return rl(e);
    if (Br(e)) return mp(e);
    if (Hr(e)) return vp(e);
  }
  throw Vr(e);
}
function hp(e) {
  return new B((t) => {
    let n = e[Yt]();
    if (S(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable",
    );
  });
}
function pp(e) {
  return new B((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function gp(e) {
  return new B((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n),
    ).then(null, Or);
  });
}
function mp(e) {
  return new B((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function rl(e) {
  return new B((t) => {
    yp(e, t).catch((n) => t.error(n));
  });
}
function vp(e) {
  return rl($r(e));
}
function yp(e, t) {
  var n, r, o, i;
  return el(this, void 0, void 0, function* () {
    try {
      for (n = nl(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function fe(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function zr(e, t = 0) {
  return k((n, r) => {
    n.subscribe(
      F(
        r,
        (o) => fe(r, e, () => r.next(o), t),
        () => fe(r, e, () => r.complete(), t),
        (o) => fe(r, e, () => r.error(o), t),
      ),
    );
  });
}
function Gr(e, t = 0) {
  return k((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function ol(e, t) {
  return ee(e).pipe(Gr(t), zr(t));
}
function il(e, t) {
  return ee(e).pipe(Gr(t), zr(t));
}
function sl(e, t) {
  return new B((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function al(e, t) {
  return new B((n) => {
    let r;
    return (
      fe(n, t, () => {
        (r = e[Ur]()),
          fe(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0,
          );
      }),
      () => S(r?.return) && r.return()
    );
  });
}
function Zr(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new B((n) => {
    fe(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      fe(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function cl(e, t) {
  return Zr($r(e), t);
}
function ll(e, t) {
  if (e != null) {
    if (Lr(e)) return ol(e, t);
    if (kr(e)) return sl(e, t);
    if (Fr(e)) return il(e, t);
    if (jr(e)) return Zr(e, t);
    if (Br(e)) return al(e, t);
    if (Hr(e)) return cl(e, t);
  }
  throw Vr(e);
}
function Y(e, t) {
  return t ? ll(e, t) : ee(e);
}
function M(...e) {
  let t = ft(e);
  return Y(e, t);
}
function Jt(e, t) {
  let n = S(e) ? e : () => e,
    r = (o) => o.error(n());
  return new B(t ? (o) => t.schedule(r, 0, o) : r);
}
function Ki(e) {
  return !!e && (e instanceof B || (S(e.lift) && S(e.subscribe)));
}
var rt = Gt(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    },
);
function O(e, t) {
  return k((n, r) => {
    let o = 0;
    n.subscribe(
      F(r, (i) => {
        r.next(e.call(t, i, o++));
      }),
    );
  });
}
var { isArray: Cp } = Array;
function Dp(e, t) {
  return Cp(t) ? e(...t) : e(t);
}
function ul(e) {
  return O((t) => Dp(e, t));
}
var { isArray: wp } = Array,
  { getPrototypeOf: Ep, prototype: bp, keys: Ip } = Object;
function dl(e) {
  if (e.length === 1) {
    let t = e[0];
    if (wp(t)) return { args: t, keys: null };
    if (Mp(t)) {
      let n = Ip(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function Mp(e) {
  return e && typeof e == "object" && Ep(e) === bp;
}
function fl(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function qr(...e) {
  let t = ft(e),
    n = Jc(e),
    { args: r, keys: o } = dl(e);
  if (r.length === 0) return Y([], t);
  let i = new B(Sp(r, t, o ? (s) => fl(o, s) : ge));
  return n ? i.pipe(ul(n)) : i;
}
function Sp(e, t, n = ge) {
  return (r) => {
    hl(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          c = o;
        for (let a = 0; a < o; a++)
          hl(
            t,
            () => {
              let l = Y(e[a], t),
                u = !1;
              l.subscribe(
                F(
                  r,
                  (d) => {
                    (i[a] = d), u || ((u = !0), c--), c || r.next(n(i.slice()));
                  },
                  () => {
                    --s || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function hl(e, t, n) {
  e ? fe(n, e, t) : t();
}
function pl(e, t, n, r, o, i, s, c) {
  let a = [],
    l = 0,
    u = 0,
    d = !1,
    m = () => {
      d && !a.length && !l && t.complete();
    },
    p = (x) => (l < r ? y(x) : a.push(x)),
    y = (x) => {
      i && t.next(x), l++;
      let z = !1;
      ee(n(x, u++)).subscribe(
        F(
          t,
          ($) => {
            o?.($), i ? p($) : t.next($);
          },
          () => {
            z = !0;
          },
          void 0,
          () => {
            if (z)
              try {
                for (l--; a.length && l < r; ) {
                  let $ = a.shift();
                  s ? fe(t, s, () => y($)) : y($);
                }
                m();
              } catch ($) {
                t.error($);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      F(t, p, () => {
        (d = !0), m();
      }),
    ),
    () => {
      c?.();
    }
  );
}
function K(e, t, n = 1 / 0) {
  return S(t)
    ? K((r, o) => O((i, s) => t(r, i, o, s))(ee(e(r, o))), n)
    : (typeof t == "number" && (n = t), k((r, o) => pl(r, o, e, n)));
}
function Ji(e = 1 / 0) {
  return K(ge, e);
}
function gl() {
  return Ji(1);
}
function Xt(...e) {
  return gl()(Y(e, ft(e)));
}
function Wr(e) {
  return new B((t) => {
    ee(e()).subscribe(t);
  });
}
function Ie(e, t) {
  return k((n, r) => {
    let o = 0;
    n.subscribe(F(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function ht(e) {
  return k((t, n) => {
    let r = null,
      o = !1,
      i;
    (r = t.subscribe(
      F(n, void 0, void 0, (s) => {
        (i = ee(e(s, ht(e)(t)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n));
  });
}
function ml(e, t, n, r, o) {
  return (i, s) => {
    let c = n,
      a = t,
      l = 0;
    i.subscribe(
      F(
        s,
        (u) => {
          let d = l++;
          (a = c ? e(a, u, d) : ((c = !0), u)), r && s.next(a);
        },
        o &&
          (() => {
            c && s.next(a), s.complete();
          }),
      ),
    );
  };
}
function Mt(e, t) {
  return S(t) ? K(e, t, 1) : K(e, 1);
}
function pt(e) {
  return k((t, n) => {
    let r = !1;
    t.subscribe(
      F(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => {
          r || n.next(e), n.complete();
        },
      ),
    );
  });
}
function ot(e) {
  return e <= 0
    ? () => me
    : k((t, n) => {
        let r = 0;
        t.subscribe(
          F(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          }),
        );
      });
}
function Xi(e) {
  return O(() => e);
}
function Yr(e = _p) {
  return k((t, n) => {
    let r = !1;
    t.subscribe(
      F(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => (r ? n.complete() : n.error(e())),
      ),
    );
  });
}
function _p() {
  return new rt();
}
function en(e) {
  return k((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Le(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Ie((o, i) => e(o, i, r)) : ge,
      ot(1),
      n ? pt(t) : Yr(() => new rt()),
    );
}
function tn(e) {
  return e <= 0
    ? () => me
    : k((t, n) => {
        let r = [];
        t.subscribe(
          F(
            n,
            (o) => {
              r.push(o), e < r.length && r.shift();
            },
            () => {
              for (let o of r) n.next(o);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            },
          ),
        );
      });
}
function es(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Ie((o, i) => e(o, i, r)) : ge,
      tn(1),
      n ? pt(t) : Yr(() => new rt()),
    );
}
function ts(e, t) {
  return k(ml(e, t, arguments.length >= 2, !0));
}
function ns(...e) {
  let t = ft(e);
  return k((n, r) => {
    (t ? Xt(e, n, t) : Xt(e, n)).subscribe(r);
  });
}
function Me(e, t) {
  return k((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      c = () => s && !o && r.complete();
    n.subscribe(
      F(
        r,
        (a) => {
          o?.unsubscribe();
          let l = 0,
            u = i++;
          ee(e(a, u)).subscribe(
            (o = F(
              r,
              (d) => r.next(t ? t(a, d, u, l++) : d),
              () => {
                (o = null), c();
              },
            )),
          );
        },
        () => {
          (s = !0), c();
        },
      ),
    );
  });
}
function rs(e) {
  return k((t, n) => {
    ee(e).subscribe(F(n, () => n.complete(), Rn)), !n.closed && t.subscribe(n);
  });
}
function J(e, t, n) {
  let r = S(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? k((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let c = !0;
        o.subscribe(
          F(
            i,
            (a) => {
              var l;
              (l = r.next) === null || l === void 0 || l.call(r, a), i.next(a);
            },
            () => {
              var a;
              (c = !1),
                (a = r.complete) === null || a === void 0 || a.call(r),
                i.complete();
            },
            (a) => {
              var l;
              (c = !1),
                (l = r.error) === null || l === void 0 || l.call(r, a),
                i.error(a);
            },
            () => {
              var a, l;
              c && ((a = r.unsubscribe) === null || a === void 0 || a.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r);
            },
          ),
        );
      })
    : ge;
}
var nu = "https://g.co/ng/security#xss",
  D = class extends Error {
    constructor(t, n) {
      super(Ao(t, n)), (this.code = t);
    }
  };
function Ao(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function Js(e) {
  return { toString: e }.toString();
}
function H(e) {
  for (let t in e) if (e[t] === H) return t;
  throw Error("Could not find renamed property on target object.");
}
function ve(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(ve).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function vl(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
      ? e
      : e + " " + t;
}
var Tp = H({ __forward_ref__: H });
function ru(e) {
  return (
    (e.__forward_ref__ = ru),
    (e.toString = function () {
      return ve(this());
    }),
    e
  );
}
function _e(e) {
  return ou(e) ? e() : e;
}
function ou(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(Tp) && e.__forward_ref__ === ru
  );
}
function I(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function Oo(e) {
  return yl(e, su) || yl(e, au);
}
function iu(e) {
  return Oo(e) !== null;
}
function yl(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function xp(e) {
  let t = e && (e[su] || e[au]);
  return t || null;
}
function Cl(e) {
  return e && (e.hasOwnProperty(Dl) || e.hasOwnProperty(Np)) ? e[Dl] : null;
}
var su = H({ ɵprov: H }),
  Dl = H({ ɵinj: H }),
  au = H({ ngInjectableDef: H }),
  Np = H({ ngInjectorDef: H }),
  w = class {
    constructor(t, n) {
      (this._desc = t),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = I({
              token: this,
              providedIn: n.providedIn || "root",
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function cu(e) {
  return e && !!e.ɵproviders;
}
var Ap = H({ ɵcmp: H }),
  Op = H({ ɵdir: H }),
  Rp = H({ ɵpipe: H }),
  Pp = H({ ɵmod: H }),
  io = H({ ɵfac: H }),
  Fn = H({ __NG_ELEMENT_ID__: H }),
  wl = H({ __NG_ENV_ID__: H });
function Xs(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function kp(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
      ? e.type.name || e.type.toString()
      : Xs(e);
}
function Fp(e, t) {
  let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new D(-200, e);
}
function ea(e, t) {
  throw new D(-201, !1);
}
var N = (function (e) {
    return (
      (e[(e.Default = 0)] = "Default"),
      (e[(e.Host = 1)] = "Host"),
      (e[(e.Self = 2)] = "Self"),
      (e[(e.SkipSelf = 4)] = "SkipSelf"),
      (e[(e.Optional = 8)] = "Optional"),
      e
    );
  })(N || {}),
  gs;
function lu() {
  return gs;
}
function Se(e) {
  let t = gs;
  return (gs = e), t;
}
function uu(e, t, n) {
  let r = Oo(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & N.Optional) return null;
  if (t !== void 0) return t;
  ea(e, "Injector");
}
var Lp = {},
  Ln = Lp,
  jp = "__NG_DI_FLAG__",
  so = "ngTempTokenPath",
  Vp = "ngTokenPath",
  Up = /\n/gm,
  Bp = "\u0275",
  El = "__source",
  sn;
function $p() {
  return sn;
}
function gt(e) {
  let t = sn;
  return (sn = e), t;
}
function Hp(e, t = N.Default) {
  if (sn === void 0) throw new D(-203, !1);
  return sn === null
    ? uu(e, void 0, t)
    : sn.get(e, t & N.Optional ? null : void 0, t);
}
function R(e, t = N.Default) {
  return (lu() || Hp)(_e(e), t);
}
function g(e, t = N.Default) {
  return R(e, Ro(t));
}
function Ro(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function ms(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = _e(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new D(900, !1);
      let o,
        i = N.Default;
      for (let s = 0; s < r.length; s++) {
        let c = r[s],
          a = zp(c);
        typeof a == "number" ? (a === -1 ? (o = c.token) : (i |= a)) : (o = c);
      }
      t.push(R(o, i));
    } else t.push(R(r));
  }
  return t;
}
function zp(e) {
  return e[jp];
}
function Gp(e, t, n, r) {
  let o = e[so];
  throw (
    (t[El] && o.unshift(t[El]),
    (e.message = Zp(
      `
` + e.message,
      o,
      n,
      r,
    )),
    (e[Vp] = o),
    (e[so] = null),
    e)
  );
}
function Zp(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == Bp
      ? e.slice(2)
      : e;
  let o = ve(t);
  if (Array.isArray(t)) o = t.map(ve).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let c = t[s];
        i.push(s + ":" + (typeof c == "string" ? JSON.stringify(c) : ve(c)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
    Up,
    `
  `,
  )}`;
}
function cn(e, t) {
  let n = e.hasOwnProperty(io);
  return n ? e[io] : null;
}
function ta(e, t) {
  e.forEach((n) => (Array.isArray(n) ? ta(n, t) : t(n)));
}
function du(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function ao(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
var jn = {},
  _t = [],
  Tt = new w(""),
  fu = new w("", -1),
  hu = new w(""),
  co = class {
    get(t, n = Ln) {
      if (n === Ln) {
        let r = new Error(`NullInjectorError: No provider for ${ve(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  pu = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(pu || {}),
  We = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(We || {}),
  yt = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(yt || {});
function qp(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
function vs(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        c = n[r++];
      e.setAttribute(t, s, c, i);
    } else {
      let i = o,
        s = n[++r];
      Yp(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function Wp(e) {
  return e === 3 || e === 4 || e === 6;
}
function Yp(e) {
  return e.charCodeAt(0) === 64;
}
function na(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number"
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? bl(e, n, o, null, t[++r])
              : bl(e, n, o, null, null));
      }
    }
  return e;
}
function bl(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let c = e[i++];
      if (typeof c == "number") {
        if (c === t) {
          s = -1;
          break;
        } else if (c > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let c = e[i];
    if (typeof c == "number") break;
    if (c === n) {
      if (r === null) {
        o !== null && (e[i + 1] = o);
        return;
      } else if (r === e[i + 1]) {
        e[i + 2] = o;
        return;
      }
    }
    i++, r !== null && i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    r !== null && e.splice(i++, 0, r),
    o !== null && e.splice(i++, 0, o);
}
var gu = "ng-template";
function Qp(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && qp(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (ra(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function ra(e) {
  return e.type === 4 && e.value !== gu;
}
function Kp(e, t, n) {
  let r = e.type === 4 && !n ? gu : e.value;
  return t === r;
}
function Jp(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? t1(o) : 0,
    s = !1;
  for (let c = 0; c < t.length; c++) {
    let a = t[c];
    if (typeof a == "number") {
      if (!s && !je(r) && !je(a)) return !1;
      if (s && je(a)) continue;
      (s = !1), (r = a | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (a !== "" && !Kp(e, a, n)) || (a === "" && t.length === 1))
        ) {
          if (je(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !Qp(e, o, a, n)) {
          if (je(r)) return !1;
          s = !0;
        }
      } else {
        let l = t[++c],
          u = Xp(a, o, ra(e), n);
        if (u === -1) {
          if (je(r)) return !1;
          s = !0;
          continue;
        }
        if (l !== "") {
          let d;
          if (
            (u > i ? (d = "") : (d = o[u + 1].toLowerCase()), r & 2 && l !== d)
          ) {
            if (je(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return je(r) || s;
}
function je(e) {
  return (e & 1) === 0;
}
function Xp(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let c = t[++o];
        for (; typeof c == "string"; ) c = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return n1(t, e);
}
function e1(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Jp(e, t[r], n)) return !0;
  return !1;
}
function t1(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Wp(n)) return t;
  }
  return e.length;
}
function n1(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function Il(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function r1(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = "",
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == "string")
      if (r & 2) {
        let c = e[++n];
        o += "[" + s + (c.length > 0 ? '="' + c + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      o !== "" && !je(s) && ((t += Il(i, o)), (o = "")),
        (r = s),
        (i = i || !je(r));
    n++;
  }
  return o !== "" && (t += Il(i, o)), t;
}
function o1(e) {
  return e.map(r1).join(",");
}
function i1(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!je(o)) break;
      o = i;
    }
    r++;
  }
  return { attrs: t, classes: n };
}
function ne(e) {
  return Js(() => {
    let t = Du(e),
      n = Z(C({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === pu.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || We.Emulated,
        styles: e.styles || _t,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    wu(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = Sl(r, !1)), (n.pipeDefs = Sl(r, !0)), (n.id = c1(n)), n
    );
  });
}
function s1(e) {
  return xt(e) || mu(e);
}
function a1(e) {
  return e !== null;
}
function Ml(e, t) {
  if (e == null) return jn;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        c = yt.None;
      Array.isArray(o)
        ? ((c = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = c !== yt.None ? [r, c] : r), (t[i] = s)) : (n[i] = r);
    }
  return n;
}
function oa(e) {
  return Js(() => {
    let t = Du(e);
    return wu(t), t;
  });
}
function xt(e) {
  return e[Ap] || null;
}
function mu(e) {
  return e[Op] || null;
}
function vu(e) {
  return e[Rp] || null;
}
function yu(e) {
  let t = xt(e) || mu(e) || vu(e);
  return t !== null ? t.standalone : !1;
}
function Cu(e, t) {
  let n = e[Pp] || null;
  if (!n && t === !0)
    throw new Error(`Type ${ve(e)} does not have '\u0275mod' property.`);
  return n;
}
function Du(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || jn,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || _t,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Ml(e.inputs, t),
    outputs: Ml(e.outputs),
    debugInfo: null,
  };
}
function wu(e) {
  e.features?.forEach((t) => t(e));
}
function Sl(e, t) {
  if (!e) return null;
  let n = t ? vu : s1;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(a1);
}
function c1(e) {
  let t = 0,
    n = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join("|");
  for (let o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function Rt(e) {
  return { ɵproviders: e };
}
function l1(...e) {
  return { ɵproviders: Eu(!0, e), ɵfromNgModule: !0 };
}
function Eu(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    ta(t, (s) => {
      let c = s;
      ys(c, i, [], r) && ((o ||= []), o.push(c));
    }),
    o !== void 0 && bu(o, i),
    n
  );
}
function bu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    ia(o, (i) => {
      t(i, r);
    });
  }
}
function ys(e, t, n, r) {
  if (((e = _e(e)), !e)) return !1;
  let o = null,
    i = Cl(e),
    s = !i && xt(e);
  if (!i && !s) {
    let a = e.ngModule;
    if (((i = Cl(a)), i)) o = a;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let c = r.has(o);
  if (s) {
    if (c) return !1;
    if ((r.add(o), s.dependencies)) {
      let a =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let l of a) ys(l, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !c) {
      r.add(o);
      let l;
      try {
        ta(i.imports, (u) => {
          ys(u, t, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && bu(l, t);
    }
    if (!c) {
      let l = cn(o) || (() => new o());
      t({ provide: o, useFactory: l, deps: _t }, o),
        t({ provide: hu, useValue: o, multi: !0 }, o),
        t({ provide: Tt, useValue: () => R(o), multi: !0 }, o);
    }
    let a = i.providers;
    if (a != null && !c) {
      let l = e;
      ia(a, (u) => {
        t(u, l);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function ia(e, t) {
  for (let n of e)
    cu(n) && (n = n.ɵproviders), Array.isArray(n) ? ia(n, t) : t(n);
}
var u1 = H({ provide: String, useValue: H });
function Iu(e) {
  return e !== null && typeof e == "object" && u1 in e;
}
function d1(e) {
  return !!(e && e.useExisting);
}
function f1(e) {
  return !!(e && e.useFactory);
}
function Cs(e) {
  return typeof e == "function";
}
var Po = new w(""),
  eo = {},
  h1 = {},
  os;
function sa() {
  return os === void 0 && (os = new co()), os;
}
var Ne = class {},
  Vn = class extends Ne {
    get destroyed() {
      return this._destroyed;
    }
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        ws(t, (s) => this.processProvider(s)),
        this.records.set(fu, nn(void 0, this)),
        o.has("environment") && this.records.set(Ne, nn(void 0, this));
      let i = this.records.get(Po);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(hu, _t, N.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let t = V(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          V(t);
      }
    }
    onDestroy(t) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      this.assertNotDestroyed();
      let n = gt(this),
        r = Se(void 0),
        o;
      try {
        return t();
      } finally {
        gt(n), Se(r);
      }
    }
    get(t, n = Ln, r = N.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(wl))) return t[wl](this);
      r = Ro(r);
      let o,
        i = gt(this),
        s = Se(void 0);
      try {
        if (!(r & N.SkipSelf)) {
          let a = this.records.get(t);
          if (a === void 0) {
            let l = C1(t) && Oo(t);
            l && this.injectableDefInScope(l)
              ? (a = nn(Ds(t), eo))
              : (a = null),
              this.records.set(t, a);
          }
          if (a != null) return this.hydrate(t, a);
        }
        let c = r & N.Self ? sa() : this.parent;
        return (n = r & N.Optional && n === Ln ? null : n), c.get(t, n);
      } catch (c) {
        if (c.name === "NullInjectorError") {
          if (((c[so] = c[so] || []).unshift(ve(t)), i)) throw c;
          return Gp(c, t, "R3InjectorError", this.source);
        } else throw c;
      } finally {
        Se(s), gt(i);
      }
    }
    resolveInjectorInitializers() {
      let t = V(null),
        n = gt(this),
        r = Se(void 0),
        o;
      try {
        let i = this.get(Tt, _t, N.Self);
        for (let s of i) s();
      } finally {
        gt(n), Se(r), V(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(ve(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new D(205, !1);
    }
    processProvider(t) {
      t = _e(t);
      let n = Cs(t) ? t : _e(t && t.provide),
        r = g1(t);
      if (!Cs(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = nn(void 0, eo, !0)),
          (o.factory = () => ms(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n) {
      let r = V(null);
      try {
        return (
          n.value === eo && ((n.value = h1), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            y1(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        V(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = _e(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function Ds(e) {
  let t = Oo(e),
    n = t !== null ? t.factory : cn(e);
  if (n !== null) return n;
  if (e instanceof w) throw new D(204, !1);
  if (e instanceof Function) return p1(e);
  throw new D(204, !1);
}
function p1(e) {
  if (e.length > 0) throw new D(204, !1);
  let n = xp(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function g1(e) {
  if (Iu(e)) return nn(void 0, e.useValue);
  {
    let t = m1(e);
    return nn(t, eo);
  }
}
function m1(e, t, n) {
  let r;
  if (Cs(e)) {
    let o = _e(e);
    return cn(o) || Ds(o);
  } else if (Iu(e)) r = () => _e(e.useValue);
  else if (f1(e)) r = () => e.useFactory(...ms(e.deps || []));
  else if (d1(e)) r = () => R(_e(e.useExisting));
  else {
    let o = _e(e && (e.useClass || e.provide));
    if (v1(e)) r = () => new o(...ms(e.deps));
    else return cn(o) || Ds(o);
  }
  return r;
}
function nn(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function v1(e) {
  return !!e.deps;
}
function y1(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function C1(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof w);
}
function ws(e, t) {
  for (let n of e)
    Array.isArray(n) ? ws(n, t) : n && cu(n) ? ws(n.ɵproviders, t) : t(n);
}
function Ke(e, t) {
  e instanceof Vn && e.assertNotDestroyed();
  let n,
    r = gt(e),
    o = Se(void 0);
  try {
    return t();
  } finally {
    gt(r), Se(o);
  }
}
function D1() {
  return lu() !== void 0 || $p() != null;
}
function w1(e) {
  return typeof e == "function";
}
var ye = 0,
  T = 1,
  b = 2,
  ce = 3,
  Ve = 4,
  Be = 5,
  Ue = 6,
  _l = 7,
  Te = 8,
  ln = 9,
  Ye = 10,
  te = 11,
  Un = 12,
  Tl = 13,
  Wn = 14,
  Ce = 15,
  un = 16,
  rn = 17,
  dn = 18,
  ko = 19,
  Mu = 20,
  vt = 21,
  is = 22,
  xe = 23,
  de = 25,
  Su = 1,
  Bn = 6,
  it = 7,
  lo = 8,
  uo = 9,
  ae = 10,
  fo = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(fo || {});
function qe(e) {
  return Array.isArray(e) && typeof e[Su] == "object";
}
function Je(e) {
  return Array.isArray(e) && e[Su] === !0;
}
function _u(e) {
  return (e.flags & 4) !== 0;
}
function Yn(e) {
  return e.componentOffset > -1;
}
function Tu(e) {
  return (e.flags & 1) === 1;
}
function Qn(e) {
  return !!e.template;
}
function ho(e) {
  return (e[b] & 512) !== 0;
}
var Es = class {
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function xu(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function Fo() {
  return Nu;
}
function Nu(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = b1), E1;
}
Fo.ngInherit = !0;
function E1() {
  let e = Ou(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === jn) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function b1(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = Ou(e) || I1(e, { previous: jn, current: null }),
    c = s.current || (s.current = {}),
    a = s.previous,
    l = a[i];
  (c[i] = new Es(l && l.currentValue, n, a === jn)), xu(e, t, o, n);
}
var Au = "__ngSimpleChanges__";
function Ou(e) {
  return e[Au] || null;
}
function I1(e, t) {
  return (e[Au] = t);
}
var xl = null;
var mt = function (e, t, n) {
    xl?.(e, t, n);
  },
  Ru = "svg",
  M1 = "math";
function Qe(e) {
  for (; Array.isArray(e); ) e = e[ye];
  return e;
}
function S1(e, t) {
  return Qe(t[e]);
}
function $e(e, t) {
  return Qe(t[e.index]);
}
function aa(e, t) {
  return e.data[t];
}
function vn(e, t) {
  let n = t[e];
  return qe(n) ? n : n[ye];
}
function ca(e) {
  return (e[b] & 128) === 128;
}
function _1(e) {
  return Je(e[ce]);
}
function $n(e, t) {
  return t == null ? null : e[t];
}
function Pu(e) {
  e[rn] = 0;
}
function ku(e) {
  e[b] & 1024 || ((e[b] |= 1024), ca(e) && jo(e));
}
function Lo(e) {
  return !!(e[b] & 9216 || e[xe]?.dirty);
}
function bs(e) {
  e[Ye].changeDetectionScheduler?.notify(8),
    e[b] & 64 && (e[b] |= 1024),
    Lo(e) && jo(e);
}
function jo(e) {
  e[Ye].changeDetectionScheduler?.notify(0);
  let t = Nt(e);
  for (; t !== null && !(t[b] & 8192 || ((t[b] |= 8192), !ca(t))); ) t = Nt(t);
}
function Fu(e, t) {
  if ((e[b] & 256) === 256) throw new D(911, !1);
  e[vt] === null && (e[vt] = []), e[vt].push(t);
}
function T1(e, t) {
  if (e[vt] === null) return;
  let n = e[vt].indexOf(t);
  n !== -1 && e[vt].splice(n, 1);
}
function Nt(e) {
  let t = e[ce];
  return Je(t) ? t[ce] : t;
}
var L = { lFrame: Zu(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var Lu = !1;
function x1() {
  return L.lFrame.elementDepthCount;
}
function N1() {
  L.lFrame.elementDepthCount++;
}
function A1() {
  L.lFrame.elementDepthCount--;
}
function ju() {
  return L.bindingsEnabled;
}
function Kn() {
  return L.skipHydrationRootTNode !== null;
}
function O1(e) {
  return L.skipHydrationRootTNode === e;
}
function R1(e) {
  L.skipHydrationRootTNode = e;
}
function P1() {
  L.skipHydrationRootTNode = null;
}
function Q() {
  return L.lFrame.lView;
}
function yn() {
  return L.lFrame.tView;
}
function ct() {
  let e = Vu();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function Vu() {
  return L.lFrame.currentTNode;
}
function k1() {
  let e = L.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Jn(e, t) {
  let n = L.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function Uu() {
  return L.lFrame.isParent;
}
function F1() {
  L.lFrame.isParent = !1;
}
function Bu() {
  return Lu;
}
function Nl(e) {
  Lu = e;
}
function $u() {
  let e = L.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function L1(e) {
  return (L.lFrame.bindingIndex = e);
}
function la() {
  return L.lFrame.bindingIndex++;
}
function j1() {
  return L.lFrame.inI18n;
}
function V1(e, t) {
  let n = L.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), Is(t);
}
function U1() {
  return L.lFrame.currentDirectiveIndex;
}
function Is(e) {
  L.lFrame.currentDirectiveIndex = e;
}
function Hu(e) {
  L.lFrame.currentQueryIndex = e;
}
function B1(e) {
  let t = e[T];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Be] : null;
}
function zu(e, t, n) {
  if (n & N.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & N.Host); )
      if (((o = B1(i)), o === null || ((i = i[Wn]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (L.lFrame = Gu());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function ua(e) {
  let t = Gu(),
    n = e[T];
  (L.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function Gu() {
  let e = L.lFrame,
    t = e === null ? null : e.child;
  return t === null ? Zu(e) : t;
}
function Zu(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function qu() {
  let e = L.lFrame;
  return (L.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var Wu = qu;
function da() {
  let e = qu();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function Vo() {
  return L.lFrame.selectedIndex;
}
function At(e) {
  L.lFrame.selectedIndex = e;
}
function $1() {
  let e = L.lFrame;
  return aa(e.tView, e.selectedIndex);
}
function A() {
  L.lFrame.currentNamespace = Ru;
}
function j() {
  H1();
}
function H1() {
  L.lFrame.currentNamespace = null;
}
function Yu() {
  return L.lFrame.currentNamespace;
}
var Qu = !0;
function fa() {
  return Qu;
}
function Dt(e) {
  Qu = e;
}
function z1(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = Nu(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function ha(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: c,
        ngAfterViewInit: a,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      c &&
        ((e.contentHooks ??= []).push(n, c),
        (e.contentCheckHooks ??= []).push(n, c)),
      a && (e.viewHooks ??= []).push(-n, a),
      l &&
        ((e.viewHooks ??= []).push(n, l), (e.viewCheckHooks ??= []).push(n, l)),
      u != null && (e.destroyHooks ??= []).push(n, u);
  }
}
function to(e, t, n) {
  Ku(e, t, 3, n);
}
function no(e, t, n, r) {
  (e[b] & 3) === n && Ku(e, t, n, r);
}
function ss(e, t) {
  let n = e[b];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[b] = n));
}
function Ku(e, t, n, r) {
  let o = r !== void 0 ? e[rn] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    c = 0;
  for (let a = o; a < s; a++)
    if (typeof t[a + 1] == "number") {
      if (((c = t[a]), r != null && c >= r)) break;
    } else
      t[a] < 0 && (e[rn] += 65536),
        (c < i || i == -1) &&
          (G1(e, n, t, a), (e[rn] = (e[rn] & 4294901760) + a + 2)),
        a++;
}
function Al(e, t) {
  mt(4, e, t);
  let n = V(null);
  try {
    t.call(e);
  } finally {
    V(n), mt(5, e, t);
  }
}
function G1(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    c = e[s];
  o
    ? e[b] >> 14 < e[rn] >> 16 &&
      (e[b] & 3) === t &&
      ((e[b] += 16384), Al(c, i))
    : Al(c, i);
}
var an = -1,
  Hn = class {
    constructor(t, n, r) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function Z1(e) {
  return e instanceof Hn;
}
function q1(e) {
  return (e.flags & 8) !== 0;
}
function W1(e) {
  return (e.flags & 16) !== 0;
}
var as = {},
  Ms = class {
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = Ro(r);
      let o = this.injector.get(t, as, r);
      return o !== as || n === as ? o : this.parentInjector.get(t, n, r);
    }
  };
function Ju(e) {
  return e !== an;
}
function po(e) {
  return e & 32767;
}
function Y1(e) {
  return e >> 16;
}
function go(e, t) {
  let n = Y1(e),
    r = t;
  for (; n > 0; ) (r = r[Wn]), n--;
  return r;
}
var Ss = !0;
function Ol(e) {
  let t = Ss;
  return (Ss = e), t;
}
var Q1 = 256,
  Xu = Q1 - 1,
  ed = 5,
  K1 = 0,
  Ze = {};
function J1(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Fn) && (r = n[Fn]),
    r == null && (r = n[Fn] = K1++);
  let o = r & Xu,
    i = 1 << o;
  t.data[e + (o >> ed)] |= i;
}
function td(e, t) {
  let n = nd(e, t);
  if (n !== -1) return n;
  let r = t[T];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    cs(r.data, e),
    cs(t, null),
    cs(r.blueprint, null));
  let o = pa(e, t),
    i = e.injectorIndex;
  if (Ju(o)) {
    let s = po(o),
      c = go(o, t),
      a = c[T].data;
    for (let l = 0; l < 8; l++) t[i + l] = c[s + l] | a[s + l];
  }
  return (t[i + 8] = o), i;
}
function cs(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function nd(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function pa(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = ad(o)), r === null)) return an;
    if ((n++, (o = o[Wn]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return an;
}
function X1(e, t, n) {
  J1(e, t, n);
}
function rd(e, t, n) {
  if (n & N.Optional || e !== void 0) return e;
  ea(t, "NodeInjector");
}
function od(e, t, n, r) {
  if (
    (n & N.Optional && r === void 0 && (r = null), !(n & (N.Self | N.Host)))
  ) {
    let o = e[ln],
      i = Se(void 0);
    try {
      return o ? o.get(t, r, n & N.Optional) : uu(t, r, n & N.Optional);
    } finally {
      Se(i);
    }
  }
  return rd(r, t, n);
}
function id(e, t, n, r = N.Default, o) {
  if (e !== null) {
    if (t[b] & 2048 && !(r & N.Self)) {
      let s = og(e, t, n, r, Ze);
      if (s !== Ze) return s;
    }
    let i = sd(e, t, n, r, Ze);
    if (i !== Ze) return i;
  }
  return od(t, n, r, o);
}
function sd(e, t, n, r, o) {
  let i = ng(n);
  if (typeof i == "function") {
    if (!zu(t, e, r)) return r & N.Host ? rd(o, n, r) : od(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & N.Optional))) ea(n);
      else return s;
    } finally {
      Wu();
    }
  } else if (typeof i == "number") {
    let s = null,
      c = nd(e, t),
      a = an,
      l = r & N.Host ? t[Ce][Be] : null;
    for (
      (c === -1 || r & N.SkipSelf) &&
      ((a = c === -1 ? pa(e, t) : t[c + 8]),
      a === an || !Pl(r, !1)
        ? (c = -1)
        : ((s = t[T]), (c = po(a)), (t = go(a, t))));
      c !== -1;

    ) {
      let u = t[T];
      if (Rl(i, c, u.data)) {
        let d = eg(c, t, n, s, r, l);
        if (d !== Ze) return d;
      }
      (a = t[c + 8]),
        a !== an && Pl(r, t[T].data[c + 8] === l) && Rl(i, c, t)
          ? ((s = u), (c = po(a)), (t = go(a, t)))
          : (c = -1);
    }
  }
  return o;
}
function eg(e, t, n, r, o, i) {
  let s = t[T],
    c = s.data[e + 8],
    a = r == null ? Yn(c) && Ss : r != s && (c.type & 3) !== 0,
    l = o & N.Host && i === c,
    u = tg(c, s, n, a, l);
  return u !== null ? zn(t, s, u, c) : Ze;
}
function tg(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    c = i & 1048575,
    a = e.directiveStart,
    l = e.directiveEnd,
    u = i >> 20,
    d = r ? c : c + u,
    m = o ? c + u : l;
  for (let p = d; p < m; p++) {
    let y = s[p];
    if ((p < a && n === y) || (p >= a && y.type === n)) return p;
  }
  if (o) {
    let p = s[a];
    if (p && Qn(p) && p.type === n) return a;
  }
  return null;
}
function zn(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (Z1(o)) {
    let s = o;
    s.resolving && Fp(kp(i[n]));
    let c = Ol(s.canSeeViewProviders);
    s.resolving = !0;
    let a,
      l = s.injectImpl ? Se(s.injectImpl) : null,
      u = zu(e, r, N.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && z1(n, i[n], t);
    } finally {
      l !== null && Se(l), Ol(c), (s.resolving = !1), Wu();
    }
  }
  return o;
}
function ng(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(Fn) ? e[Fn] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & Xu : rg) : t;
}
function Rl(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> ed)] & r);
}
function Pl(e, t) {
  return !(e & N.Self) && !(e & N.Host && t);
}
var St = class {
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return id(this._tNode, this._lView, t, Ro(r), n);
  }
};
function rg() {
  return new St(ct(), Q());
}
function ga(e) {
  return Js(() => {
    let t = e.prototype.constructor,
      n = t[io] || _s(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[io] || _s(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function _s(e) {
  return ou(e)
    ? () => {
        let t = _s(_e(e));
        return t && t();
      }
    : cn(e);
}
function og(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[b] & 2048 && !(s[b] & 512); ) {
    let c = sd(i, s, n, r | N.Self, Ze);
    if (c !== Ze) return c;
    let a = i.parent;
    if (!a) {
      let l = s[Mu];
      if (l) {
        let u = l.get(n, Ze, r);
        if (u !== Ze) return u;
      }
      (a = ad(s)), (s = s[Wn]);
    }
    i = a;
  }
  return o;
}
function ad(e) {
  let t = e[T],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[Be] : null;
}
function kl(e, t = null, n = null, r) {
  let o = cd(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function cd(e, t = null, n = null, r, o = new Set()) {
  let i = [n || _t, l1(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : ve(e))),
    new Vn(i, t || sa(), r || null, o)
  );
}
var st = class e {
  static {
    this.THROW_IF_NOT_FOUND = Ln;
  }
  static {
    this.NULL = new co();
  }
  static create(t, n) {
    if (Array.isArray(t)) return kl({ name: "" }, n, t, "");
    {
      let r = t.name ?? "";
      return kl({ name: r }, t.parent, t.providers, r);
    }
  }
  static {
    this.ɵprov = I({ token: e, providedIn: "any", factory: () => R(fu) });
  }
  static {
    this.__NG_ELEMENT_ID__ = -1;
  }
};
var ig = new w("");
ig.__NG_ELEMENT_ID__ = (e) => {
  let t = ct();
  if (t === null) throw new D(204, !1);
  if (t.type & 2) return t.value;
  if (e & N.Optional) return null;
  throw new D(204, !1);
};
var sg = "ngOriginalError";
function ls(e) {
  return e[sg];
}
var ld = !0,
  ud = (() => {
    class e {
      static {
        this.__NG_ELEMENT_ID__ = ag;
      }
      static {
        this.__NG_ENV_ID__ = (n) => n;
      }
    }
    return e;
  })(),
  Ts = class extends ud {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return Fu(this._lView, t), () => T1(this._lView, t);
    }
  };
function ag() {
  return new Ts(Q());
}
var Pt = (() => {
  class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new oe(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
    static {
      this.ɵprov = I({ token: e, providedIn: "root", factory: () => new e() });
    }
  }
  return e;
})();
var xs = class extends le {
    constructor(t = !1) {
      super(),
        (this.destroyRef = void 0),
        (this.pendingTasks = void 0),
        (this.__isAsync = t),
        D1() &&
          ((this.destroyRef = g(ud, { optional: !0 }) ?? void 0),
          (this.pendingTasks = g(Pt, { optional: !0 }) ?? void 0));
    }
    emit(t) {
      let n = V(null);
      try {
        super.next(t);
      } finally {
        V(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == "object") {
        let a = t;
        (o = a.next?.bind(a)),
          (i = a.error?.bind(a)),
          (s = a.complete?.bind(a));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let c = super.subscribe({ next: o, error: i, complete: s });
      return t instanceof W && t.add(c), c;
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          t(n), r !== void 0 && this.pendingTasks?.remove(r);
        });
      };
    }
  },
  ue = xs;
function mo(...e) {}
function dd(e) {
  let t, n;
  function r() {
    e = mo;
    try {
      n !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t);
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      e(), r();
    })),
    typeof requestAnimationFrame == "function" &&
      (n = requestAnimationFrame(() => {
        e(), r();
      })),
    () => r()
  );
}
function Fl(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = mo;
    }
  );
}
var ma = "isAngularZone",
  vo = ma + "_ID",
  cg = 0,
  q = class e {
    constructor(t) {
      (this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new ue(!1)),
        (this.onMicrotaskEmpty = new ue(!1)),
        (this.onStable = new ue(!1)),
        (this.onError = new ue(!1));
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = ld,
      } = t;
      if (typeof Zone > "u") throw new D(908, !1);
      Zone.assertZonePatched();
      let s = this;
      (s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        dg(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(ma) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new D(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new D(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, lg, mo, mo);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  lg = {};
function va(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function ug(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    dd(() => {
      (e.callbackScheduled = !1),
        Ns(e),
        (e.isCheckStableRunning = !0),
        va(e),
        (e.isCheckStableRunning = !1);
    });
  }
  e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    Ns(e);
}
function dg(e) {
  let t = () => {
      ug(e);
    },
    n = cg++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [ma]: !0, [vo]: n, [vo + n]: !0 },
    onInvokeTask: (r, o, i, s, c, a) => {
      if (fg(a)) return r.invokeTask(i, s, c, a);
      try {
        return Ll(e), r.invokeTask(i, s, c, a);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          jl(e);
      }
    },
    onInvoke: (r, o, i, s, c, a, l) => {
      try {
        return Ll(e), r.invoke(i, s, c, a, l);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !hg(a) &&
          t(),
          jl(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), Ns(e), va(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function Ns(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Ll(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function jl(e) {
  e._nesting--, va(e);
}
var As = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new ue()),
      (this.onMicrotaskEmpty = new ue()),
      (this.onStable = new ue()),
      (this.onError = new ue());
  }
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function fg(e) {
  return fd(e, "__ignore_ng_zone__");
}
function hg(e) {
  return fd(e, "__scheduler_tick__");
}
function fd(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var at = class {
    constructor() {
      this._console = console;
    }
    handleError(t) {
      let n = this._findOriginalError(t);
      this._console.error("ERROR", t),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(t) {
      let n = t && ls(t);
      for (; n && ls(n); ) n = ls(n);
      return n || null;
    }
  },
  pg = new w("", {
    providedIn: "root",
    factory: () => {
      let e = g(q),
        t = g(at);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function gg() {
  return ya(ct(), Q());
}
function ya(e, t) {
  return new Uo($e(e, t));
}
var Uo = (() => {
  class e {
    constructor(n) {
      this.nativeElement = n;
    }
    static {
      this.__NG_ELEMENT_ID__ = gg;
    }
  }
  return e;
})();
var mg = "ngSkipHydration",
  vg = "ngskiphydration";
function hd(e) {
  let t = e.mergedAttrs;
  if (t === null) return !1;
  for (let n = 0; n < t.length; n += 2) {
    let r = t[n];
    if (typeof r == "number") return !1;
    if (typeof r == "string" && r.toLowerCase() === vg) return !0;
  }
  return !1;
}
function pd(e) {
  return e.hasAttribute(mg);
}
function yo(e) {
  return (e.flags & 128) === 128;
}
function yg(e) {
  if (yo(e)) return !0;
  let t = e.parent;
  for (; t; ) {
    if (yo(e) || hd(t)) return !0;
    t = t.parent;
  }
  return !1;
}
var gd = new Map(),
  Cg = 0;
function Dg() {
  return Cg++;
}
function wg(e) {
  gd.set(e[ko], e);
}
function Os(e) {
  gd.delete(e[ko]);
}
var Vl = "__ngContext__";
function Ot(e, t) {
  qe(t) ? ((e[Vl] = t[ko]), wg(t)) : (e[Vl] = t);
}
function md(e) {
  return yd(e[Un]);
}
function vd(e) {
  return yd(e[Ve]);
}
function yd(e) {
  for (; e !== null && !Je(e); ) e = e[Ve];
  return e;
}
var Rs;
function Cd(e) {
  Rs = e;
}
function Bo() {
  if (Rs !== void 0) return Rs;
  if (typeof document < "u") return document;
  throw new D(210, !1);
}
var $o = new w("", { providedIn: "root", factory: () => Eg }),
  Eg = "ng",
  Ca = new w(""),
  Xe = new w("", { providedIn: "platform", factory: () => "unknown" });
var Da = new w("", {
  providedIn: "root",
  factory: () =>
    Bo().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
function bg() {
  let e = new Cn();
  return g(Xe) === "browser" && (e.store = Ig(Bo(), g($o))), e;
}
var Cn = (() => {
  class e {
    constructor() {
      (this.store = {}), (this.onSerializeCallbacks = {});
    }
    static {
      this.ɵprov = I({ token: e, providedIn: "root", factory: bg });
    }
    get(n, r) {
      return this.store[n] !== void 0 ? this.store[n] : r;
    }
    set(n, r) {
      this.store[n] = r;
    }
    remove(n) {
      delete this.store[n];
    }
    hasKey(n) {
      return this.store.hasOwnProperty(n);
    }
    get isEmpty() {
      return Object.keys(this.store).length === 0;
    }
    onSerialize(n, r) {
      this.onSerializeCallbacks[n] = r;
    }
    toJson() {
      for (let n in this.onSerializeCallbacks)
        if (this.onSerializeCallbacks.hasOwnProperty(n))
          try {
            this.store[n] = this.onSerializeCallbacks[n]();
          } catch (r) {
            console.warn("Exception in onSerialize callback: ", r);
          }
      return JSON.stringify(this.store).replace(/</g, "\\u003C");
    }
  }
  return e;
})();
function Ig(e, t) {
  let n = e.getElementById(t + "-state");
  if (n?.textContent)
    try {
      return JSON.parse(n.textContent);
    } catch (r) {
      console.warn("Exception while restoring TransferState for app " + t, r);
    }
  return {};
}
var Dd = "h",
  wd = "b",
  Ps = (function (e) {
    return (e.FirstChild = "f"), (e.NextSibling = "n"), e;
  })(Ps || {}),
  Mg = "e",
  Sg = "t",
  wa = "c",
  Ed = "x",
  Co = "r",
  _g = "i",
  Tg = "n",
  bd = "d";
var xg = "__nghData__",
  Id = xg,
  us = "ngh",
  Ng = "nghm",
  Md = () => null;
function Ag(e, t, n = !1) {
  let r = e.getAttribute(us);
  if (r == null) return null;
  let [o, i] = r.split("|");
  if (((r = n ? i : o), !r)) return null;
  let s = i ? `|${i}` : "",
    c = n ? o : s,
    a = {};
  if (r !== "") {
    let u = t.get(Cn, null, { optional: !0 });
    u !== null && (a = u.get(Id, [])[Number(r)]);
  }
  let l = { data: a, firstChild: e.firstChild ?? null };
  return (
    n && ((l.firstChild = e), Ho(l, 0, e.nextSibling)),
    c ? e.setAttribute(us, c) : e.removeAttribute(us),
    l
  );
}
function Og() {
  Md = Ag;
}
function Ea(e, t, n = !1) {
  return Md(e, t, n);
}
function Rg(e) {
  let t = e._lView;
  return t[T].type === 2 ? null : (ho(t) && (t = t[de]), t);
}
function Pg(e) {
  return e.textContent?.replace(/\s/gm, "");
}
function kg(e) {
  let t = Bo(),
    n = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, {
      acceptNode(i) {
        let s = Pg(i);
        return s === "ngetn" || s === "ngtns"
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }),
    r,
    o = [];
  for (; (r = n.nextNode()); ) o.push(r);
  for (let i of o)
    i.textContent === "ngetn"
      ? i.replaceWith(t.createTextNode(""))
      : i.remove();
}
function Ho(e, t, n) {
  (e.segmentHeads ??= {}), (e.segmentHeads[t] = n);
}
function ks(e, t) {
  return e.segmentHeads?.[t] ?? null;
}
function Fg(e, t) {
  let n = e.data,
    r = n[Mg]?.[t] ?? null;
  return r === null && n[wa]?.[t] && (r = ba(e, t)), r;
}
function Sd(e, t) {
  return e.data[wa]?.[t] ?? null;
}
function ba(e, t) {
  let n = Sd(e, t) ?? [],
    r = 0;
  for (let o of n) r += o[Co] * (o[Ed] ?? 1);
  return r;
}
function Lg(e) {
  if (typeof e.disconnectedNodes > "u") {
    let t = e.data[bd];
    e.disconnectedNodes = t ? new Set(t) : null;
  }
  return e.disconnectedNodes;
}
function Xn(e, t) {
  if (typeof e.disconnectedNodes > "u") {
    let n = e.data[bd];
    e.disconnectedNodes = n ? new Set(n) : null;
  }
  return !!Lg(e)?.has(t);
}
var Qr = new w(""),
  _d = !1,
  Td = new w("", { providedIn: "root", factory: () => _d });
var Do = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${nu})`;
  }
};
function Ia(e) {
  return e instanceof Do ? e.changingThisBreaksApplicationSecurity : e;
}
function xd(e, t) {
  let n = jg(e);
  if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${nu})`);
  }
  return n === t;
}
function jg(e) {
  return (e instanceof Do && e.getTypeName()) || null;
}
var Vg = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Nd(e) {
  return (e = String(e)), e.match(Vg) ? e : "unsafe:" + e;
}
var Ma = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(Ma || {});
function Ae(e) {
  let t = Ug();
  return t ? t.sanitize(Ma.URL, e) || "" : xd(e, "URL") ? Ia(e) : Nd(Xs(e));
}
function Ug() {
  let e = Q();
  return e && e[Ye].sanitizer;
}
var Bg = /^>|^->|<!--|-->|--!>|<!-$/g,
  $g = /(<|>)/g,
  Hg = "\u200B$1\u200B";
function zg(e) {
  return e.replace(Bg, (t) => t.replace($g, Hg));
}
function Gg(e) {
  return e.ownerDocument.body;
}
function Ad(e) {
  return e instanceof Function ? e() : e;
}
function Kr(e) {
  return (e ?? g(st)).get(Xe) === "browser";
}
var kt = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(kt || {}),
  Zg;
function Sa(e, t) {
  return Zg(e, t);
}
function on(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    Je(r) ? (i = r) : qe(r) && ((s = !0), (r = r[ye]));
    let c = Qe(r);
    e === 0 && n !== null
      ? o == null
        ? Fd(t, n, c)
        : wo(t, n, c, o || null, !0)
      : e === 1 && n !== null
        ? wo(t, n, c, o || null, !0)
        : e === 2
          ? Na(t, c, s)
          : e === 3 && t.destroyNode(c),
      i != null && am(t, e, i, n, o);
  }
}
function Od(e, t) {
  return e.createText(t);
}
function qg(e, t, n) {
  e.setValue(t, n);
}
function Rd(e, t) {
  return e.createComment(zg(t));
}
function _a(e, t, n) {
  return e.createElement(t, n);
}
function Wg(e, t) {
  Pd(e, t), (t[ye] = null), (t[Be] = null);
}
function Yg(e, t, n, r, o, i) {
  (r[ye] = o), (r[Be] = t), Go(e, r, n, 1, o, i);
}
function Pd(e, t) {
  t[Ye].changeDetectionScheduler?.notify(9), Go(e, t, t[te], 2, null, null);
}
function Qg(e) {
  let t = e[Un];
  if (!t) return ds(e[T], e);
  for (; t; ) {
    let n = null;
    if (qe(t)) n = t[Un];
    else {
      let r = t[ae];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[Ve] && t !== e; ) qe(t) && ds(t[T], t), (t = t[ce]);
      t === null && (t = e), qe(t) && ds(t[T], t), (n = t && t[Ve]);
    }
    t = n;
  }
}
function Kg(e, t, n, r) {
  let o = ae + r,
    i = n.length;
  r > 0 && (n[o - 1][Ve] = t),
    r < i - ae
      ? ((t[Ve] = n[o]), du(n, ae + r, t))
      : (n.push(t), (t[Ve] = null)),
    (t[ce] = n);
  let s = t[un];
  s !== null && n !== s && kd(s, t);
  let c = t[dn];
  c !== null && c.insertView(e), bs(t), (t[b] |= 128);
}
function kd(e, t) {
  let n = e[uo],
    r = t[ce];
  if (qe(r)) e[b] |= fo.HasTransplantedViews;
  else {
    let o = r[ce][Ce];
    t[Ce] !== o && (e[b] |= fo.HasTransplantedViews);
  }
  n === null ? (e[uo] = [t]) : n.push(t);
}
function Ta(e, t) {
  let n = e[uo],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Gn(e, t) {
  if (e.length <= ae) return;
  let n = ae + t,
    r = e[n];
  if (r) {
    let o = r[un];
    o !== null && o !== e && Ta(o, r), t > 0 && (e[n - 1][Ve] = r[Ve]);
    let i = ao(e, ae + t);
    Wg(r[T], r);
    let s = i[dn];
    s !== null && s.detachView(i[T]),
      (r[ce] = null),
      (r[Ve] = null),
      (r[b] &= -129);
  }
  return r;
}
function zo(e, t) {
  if (!(t[b] & 256)) {
    let n = t[te];
    n.destroyNode && Go(e, t, n, 3, null, null), Qg(t);
  }
}
function ds(e, t) {
  if (t[b] & 256) return;
  let n = V(null);
  try {
    (t[b] &= -129),
      (t[b] |= 256),
      t[xe] && ji(t[xe]),
      Xg(e, t),
      Jg(e, t),
      t[T].type === 1 && t[te].destroy();
    let r = t[un];
    if (r !== null && Je(t[ce])) {
      r !== t[ce] && Ta(r, t);
      let o = t[dn];
      o !== null && o.detachView(e);
    }
    Os(t);
  } finally {
    V(n);
  }
}
function Jg(e, t) {
  let n = e.cleanup,
    r = t[_l];
  if (n !== null)
    for (let i = 0; i < n.length - 1; i += 2)
      if (typeof n[i] == "string") {
        let s = n[i + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
      } else {
        let s = r[n[i + 1]];
        n[i].call(s);
      }
  r !== null && (t[_l] = null);
  let o = t[vt];
  if (o !== null) {
    t[vt] = null;
    for (let i = 0; i < o.length; i++) {
      let s = o[i];
      s();
    }
  }
}
function Xg(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof Hn)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let c = o[i[s]],
              a = i[s + 1];
            mt(4, c, a);
            try {
              a.call(c);
            } finally {
              mt(5, c, a);
            }
          }
        else {
          mt(4, o, i);
          try {
            i.call(o);
          } finally {
            mt(5, o, i);
          }
        }
      }
    }
}
function em(e, t, n) {
  return tm(e, t.parent, n);
}
function tm(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[ye];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === We.None || i === We.Emulated) return null;
    }
    return $e(r, n);
  }
}
function wo(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function Fd(e, t, n) {
  e.appendChild(t, n);
}
function Ul(e, t, n, r, o) {
  r !== null ? wo(e, t, n, r, o) : Fd(e, t, n);
}
function Ld(e, t) {
  return e.parentNode(t);
}
function nm(e, t) {
  return e.nextSibling(t);
}
function rm(e, t, n) {
  return im(e, t, n);
}
function om(e, t, n) {
  return e.type & 40 ? $e(e, n) : null;
}
var im = om,
  Bl;
function xa(e, t, n, r) {
  let o = em(e, r, t),
    i = t[te],
    s = r.parent || t[Be],
    c = rm(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let a = 0; a < n.length; a++) Ul(i, o, n[a], c, !1);
    else Ul(i, o, n, c, !1);
  Bl !== void 0 && Bl(i, r, t, n, o);
}
function Pn(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return $e(t, e);
    if (n & 4) return Fs(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return Pn(e, r);
      {
        let o = e[t.index];
        return Je(o) ? Fs(-1, o) : Qe(o);
      }
    } else {
      if (n & 128) return Pn(e, t.next);
      if (n & 32) return Sa(t, e)() || Qe(e[t.index]);
      {
        let r = jd(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = Nt(e[Ce]);
          return Pn(o, r);
        } else return Pn(e, t.next);
      }
    }
  }
  return null;
}
function jd(e, t) {
  if (t !== null) {
    let r = e[Ce][Be],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Fs(e, t) {
  let n = ae + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[T].firstChild;
    if (o !== null) return Pn(r, o);
  }
  return t[it];
}
function Na(e, t, n) {
  e.removeChild(null, t, n);
}
function Vd(e) {
  e.textContent = "";
}
function Aa(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let c = r[n.index],
      a = n.type;
    if (
      (s && t === 0 && (c && Ot(Qe(c), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (a & 8) Aa(e, t, n.child, r, o, i, !1), on(t, e, o, c, i);
      else if (a & 32) {
        let l = Sa(n, r),
          u;
        for (; (u = l()); ) on(t, e, o, u, i);
        on(t, e, o, c, i);
      } else a & 16 ? sm(e, t, r, n, o, i) : on(t, e, o, c, i);
    n = s ? n.projectionNext : n.next;
  }
}
function Go(e, t, n, r, o, i) {
  Aa(n, r, e.firstChild, t, o, i, !1);
}
function sm(e, t, n, r, o, i) {
  let s = n[Ce],
    a = s[Be].projection[r.projection];
  if (Array.isArray(a))
    for (let l = 0; l < a.length; l++) {
      let u = a[l];
      on(t, e, o, u, i);
    }
  else {
    let l = a,
      u = s[ce];
    yo(r) && (l.flags |= 128), Aa(e, t, l, u, o, i, !0);
  }
}
function am(e, t, n, r, o) {
  let i = n[it],
    s = Qe(n);
  i !== s && on(t, e, r, i, o);
  for (let c = ae; c < n.length; c++) {
    let a = n[c];
    Go(a[T], a, e, t, r, i);
  }
}
function cm(e, t, n) {
  e.setAttribute(t, "style", n);
}
function Ud(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Bd(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && vs(e, t, r),
    o !== null && Ud(e, t, o),
    i !== null && cm(e, t, i);
}
var er = {};
function G(e = 1) {
  $d(yn(), Q(), Vo() + e, !1);
}
function $d(e, t, n, r) {
  if (!r)
    if ((t[b] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && to(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && no(t, i, 0, n);
    }
  At(n);
}
function Oa(e, t = N.Default) {
  let n = Q();
  if (n === null) return R(e, t);
  let r = ct();
  return id(r, n, _e(e), t);
}
function Hd(e, t, n, r, o, i) {
  let s = V(null);
  try {
    let c = null;
    o & yt.SignalBased && (c = t[r][Vc]),
      c !== null && c.transformFn !== void 0 && (i = c.transformFn(i)),
      o & yt.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, c, i, n, r) : xu(t, c, r, i);
  } finally {
    V(s);
  }
}
function lm(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) At(~o);
        else {
          let i = o,
            s = n[++r],
            c = n[++r];
          V1(s, i);
          let a = t[i];
          c(2, a);
        }
      }
    } finally {
      At(-1);
    }
}
function Zo(e, t, n, r, o, i, s, c, a, l, u) {
  let d = t.blueprint.slice();
  return (
    (d[ye] = o),
    (d[b] = r | 4 | 128 | 8 | 64),
    (l !== null || (e && e[b] & 2048)) && (d[b] |= 2048),
    Pu(d),
    (d[ce] = d[Wn] = e),
    (d[Te] = n),
    (d[Ye] = s || (e && e[Ye])),
    (d[te] = c || (e && e[te])),
    (d[ln] = a || (e && e[ln]) || null),
    (d[Be] = i),
    (d[ko] = Dg()),
    (d[Ue] = u),
    (d[Mu] = l),
    (d[Ce] = t.type == 2 ? e[Ce] : d),
    d
  );
}
function qo(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = um(e, t, n, r, o)), j1() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = k1();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Jn(i, !0), i;
}
function um(e, t, n, r, o) {
  let i = Vu(),
    s = Uu(),
    c = s ? i : i && i.parent,
    a = (e.data[t] = mm(e, c, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = a),
    i !== null &&
      (s
        ? i.child == null && a.parent !== null && (i.child = a)
        : i.next === null && ((i.next = a), (a.prev = i))),
    a
  );
}
function zd(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function Gd(e, t, n, r, o) {
  let i = Vo(),
    s = r & 2;
  try {
    At(-1), s && t.length > de && $d(e, t, de, !1), mt(s ? 2 : 0, o), n(r, o);
  } finally {
    At(i), mt(s ? 3 : 1, o);
  }
}
function Zd(e, t, n) {
  if (_u(t)) {
    let r = V(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let c = e.data[s];
        if (c.contentQueries) {
          let a = n[s];
          c.contentQueries(1, a, s);
        }
      }
    } finally {
      V(r);
    }
  }
}
function qd(e, t, n) {
  ju() && (bm(e, t, n, $e(n, t)), (n.flags & 64) === 64 && Xd(e, t, n));
}
function Wd(e, t, n = $e) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        c = s === -1 ? n(t, e) : e[s];
      e[o++] = c;
    }
  }
}
function Yd(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = Ra(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : t;
}
function Ra(e, t, n, r, o, i, s, c, a, l, u) {
  let d = de + r,
    m = d + o,
    p = dm(d, m),
    y = typeof l == "function" ? l() : l;
  return (p[T] = {
    type: e,
    blueprint: p,
    template: n,
    queries: null,
    viewQuery: c,
    declTNode: t,
    data: p.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: m,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: a,
    consts: y,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function dm(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : er);
  return n;
}
function fm(e, t, n, r) {
  let i = r.get(Td, _d) || n === We.ShadowDom,
    s = e.selectRootElement(t, i);
  return hm(s), s;
}
function hm(e) {
  Qd(e);
}
var Qd = () => null;
function pm(e) {
  pd(e) ? Vd(e) : kg(e);
}
function gm() {
  Qd = pm;
}
function mm(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    c = 0;
  return (
    Kn() && (c |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: c,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function $l(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    r ??= {};
    let c,
      a = yt.None;
    Array.isArray(s) ? ((c = s[0]), (a = s[1])) : (c = s);
    let l = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      l = o[i];
    }
    e === 0 ? Hl(r, n, l, c, a) : Hl(r, n, l, c);
  }
  return r;
}
function Hl(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function vm(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    c = [],
    a = null,
    l = null;
  for (let u = r; u < o; u++) {
    let d = i[u],
      m = n ? n.get(d) : null,
      p = m ? m.inputs : null,
      y = m ? m.outputs : null;
    (a = $l(0, d.inputs, u, a, p)), (l = $l(1, d.outputs, u, l, y));
    let x = a !== null && s !== null && !ra(t) ? Om(a, u, s) : null;
    c.push(x);
  }
  a !== null &&
    (a.hasOwnProperty("class") && (t.flags |= 8),
    a.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = c),
    (t.inputs = a),
    (t.outputs = l);
}
function ym(e) {
  return e === "class"
    ? "className"
    : e === "for"
      ? "htmlFor"
      : e === "formaction"
        ? "formAction"
        : e === "innerHtml"
          ? "innerHTML"
          : e === "readonly"
            ? "readOnly"
            : e === "tabindex"
              ? "tabIndex"
              : e;
}
function Cm(e, t, n, r, o, i, s, c) {
  let a = $e(t, n),
    l = t.inputs,
    u;
  !c && l != null && (u = l[r])
    ? (Pa(e, n, u, r, o), Yn(t) && Dm(n, t.index))
    : t.type & 3
      ? ((r = ym(r)),
        (o = s != null ? s(o, t.value || "", r) : o),
        i.setProperty(a, r, o))
      : t.type & 12;
}
function Dm(e, t) {
  let n = vn(t, e);
  n[b] & 16 || (n[b] |= 64);
}
function Kd(e, t, n, r) {
  if (ju()) {
    let o = r === null ? null : { "": -1 },
      i = Mm(e, n),
      s,
      c;
    i === null ? (s = c = null) : ([s, c] = i),
      s !== null && Jd(e, t, n, s, o, c),
      o && Sm(n, r, o);
  }
  n.mergedAttrs = na(n.mergedAttrs, n.attrs);
}
function Jd(e, t, n, r, o, i) {
  for (let l = 0; l < r.length; l++) X1(td(n, t), e, r[l].type);
  Tm(n, e.data.length, r.length);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    u.providersResolver && u.providersResolver(u);
  }
  let s = !1,
    c = !1,
    a = zd(e, t, r.length, null);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    (n.mergedAttrs = na(n.mergedAttrs, u.hostAttrs)),
      xm(e, n, t, a, u),
      _m(a, u, o),
      u.contentQueries !== null && (n.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) &&
        (n.flags |= 64);
    let d = u.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !c &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (c = !0)),
      a++;
  }
  vm(e, n, i);
}
function wm(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let c = ~t.index;
    Em(s) != c && s.push(c), s.push(n, r, i);
  }
}
function Em(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function bm(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  Yn(n) && Nm(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || td(n, t),
    Ot(r, t);
  let s = n.initialInputs;
  for (let c = o; c < i; c++) {
    let a = e.data[c],
      l = zn(t, e, c, n);
    if ((Ot(l, t), s !== null && Am(t, c - o, l, a, n, s), Qn(a))) {
      let u = vn(n.index, t);
      u[Te] = zn(t, e, c, n);
    }
  }
}
function Xd(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = U1();
  try {
    At(i);
    for (let c = r; c < o; c++) {
      let a = e.data[c],
        l = t[c];
      Is(c),
        (a.hostBindings !== null || a.hostVars !== 0 || a.hostAttrs !== null) &&
          Im(a, l);
    }
  } finally {
    At(-1), Is(s);
  }
}
function Im(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Mm(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (e1(t, s.selectors, !1))
        if ((r || (r = []), Qn(s)))
          if (s.findHostDirectiveDefs !== null) {
            let c = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, c, o),
              r.unshift(...c, s);
            let a = c.length;
            Ls(e, t, a);
          } else r.unshift(s), Ls(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function Ls(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function Sm(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new D(-301, !1);
      r.push(t[o], i);
    }
  }
}
function _m(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    Qn(t) && (n[""] = e);
  }
}
function Tm(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function xm(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = cn(o.type, !0)),
    s = new Hn(i, Qn(o), Oa);
  (e.blueprint[r] = s), (n[r] = s), wm(e, t, r, zd(e, n, o.hostVars, er), o);
}
function Nm(e, t, n) {
  let r = $e(t, e),
    o = Yd(n),
    i = e[Ye].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let c = Wo(
    e,
    Zo(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null),
  );
  e[t.index] = c;
}
function Am(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let c = 0; c < s.length; ) {
      let a = s[c++],
        l = s[c++],
        u = s[c++],
        d = s[c++];
      Hd(r, n, a, l, u, d);
    }
}
function Om(e, t, n) {
  let r = null,
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (i === 0) {
      o += 4;
      continue;
    } else if (i === 5) {
      o += 2;
      continue;
    }
    if (typeof i == "number") break;
    if (e.hasOwnProperty(i)) {
      r === null && (r = []);
      let s = e[i];
      for (let c = 0; c < s.length; c += 3)
        if (s[c] === t) {
          r.push(i, s[c + 1], s[c + 2], n[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return r;
}
function ef(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function tf(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = V(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let c = e.data[s];
          Hu(i), c.contentQueries(2, t[s], s);
        }
      }
    } finally {
      V(r);
    }
  }
}
function Wo(e, t) {
  return e[Un] ? (e[Tl][Ve] = t) : (e[Un] = t), (e[Tl] = t), t;
}
function js(e, t, n) {
  Hu(0);
  let r = V(null);
  try {
    t(e, n);
  } finally {
    V(r);
  }
}
function Rm(e, t) {
  let n = e[ln],
    r = n ? n.get(at, null) : null;
  r && r.handleError(t);
}
function Pa(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      c = n[i++],
      a = n[i++],
      l = t[s],
      u = e.data[s];
    Hd(u, l, r, c, a, o);
  }
}
function Pm(e, t, n) {
  let r = S1(t, e);
  qg(e[te], r, n);
}
function km(e, t) {
  let n = vn(t, e),
    r = n[T];
  Fm(r, n);
  let o = n[ye];
  o !== null && n[Ue] === null && (n[Ue] = Ea(o, n[ln])), ka(r, n, n[Te]);
}
function Fm(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function ka(e, t, n) {
  ua(t);
  try {
    let r = e.viewQuery;
    r !== null && js(1, r, n);
    let o = e.template;
    o !== null && Gd(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[dn]?.finishViewCreation(e),
      e.staticContentQueries && tf(e, t),
      e.staticViewQueries && js(2, e.viewQuery, n);
    let i = e.components;
    i !== null && Lm(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[b] &= -5), da();
  }
}
function Lm(e, t) {
  for (let n = 0; n < t.length; n++) km(e, t[n]);
}
function nf(e, t, n, r) {
  let o = V(null);
  try {
    let i = t.tView,
      c = e[b] & 4096 ? 4096 : 16,
      a = Zo(
        e,
        i,
        n,
        c,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      l = e[t.index];
    a[un] = l;
    let u = e[dn];
    return u !== null && (a[dn] = u.createEmbeddedView(i)), ka(i, a, n), a;
  } finally {
    V(o);
  }
}
function jm(e, t) {
  let n = ae + t;
  if (n < e.length) return e[n];
}
function Eo(e, t) {
  return !t || t.firstChild === null || yo(e);
}
function Fa(e, t, n, r = !0) {
  let o = t[T];
  if ((Kg(o, t, e, n), r)) {
    let s = Fs(n, e),
      c = t[te],
      a = Ld(c, e[it]);
    a !== null && Yg(o, e[Be], c, t, a, s);
  }
  let i = t[Ue];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function Vm(e, t) {
  let n = Gn(e, t);
  return n !== void 0 && zo(n[T], n), n;
}
function bo(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(Qe(i)), Je(i) && Um(i, r);
    let s = n.type;
    if (s & 8) bo(e, t, n.child, r);
    else if (s & 32) {
      let c = Sa(n, t),
        a;
      for (; (a = c()); ) r.push(a);
    } else if (s & 16) {
      let c = jd(t, n);
      if (Array.isArray(c)) r.push(...c);
      else {
        let a = Nt(t[Ce]);
        bo(a[T], a, c, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function Um(e, t) {
  for (let n = ae; n < e.length; n++) {
    let r = e[n],
      o = r[T].firstChild;
    o !== null && bo(r[T], r, o, t);
  }
  e[it] !== e[ye] && t.push(e[it]);
}
var rf = [];
function Bm(e) {
  return e[xe] ?? $m(e);
}
function $m(e) {
  let t = rf.pop() ?? Object.create(zm);
  return (t.lView = e), t;
}
function Hm(e) {
  e.lView[xe] !== e && ((e.lView = null), rf.push(e));
}
var zm = Z(C({}, ki), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    jo(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[xe] = this;
  },
});
function Gm(e) {
  let t = e[xe] ?? Object.create(Zm);
  return (t.lView = e), t;
}
var Zm = Z(C({}, ki), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    let t = Nt(e.lView);
    for (; t && !of(t[T]); ) t = Nt(t);
    t && ku(t);
  },
  consumerOnSignalRead() {
    this.lView[xe] = this;
  },
});
function of(e) {
  return e.type !== 2;
}
var qm = 100;
function sf(e, t = !0, n = 0) {
  let r = e[Ye],
    o = r.rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    Wm(e, n);
  } catch (s) {
    throw (t && Rm(e, s), s);
  } finally {
    i || (o.end?.(), r.inlineEffectRunner?.flush());
  }
}
function Wm(e, t) {
  let n = Bu();
  try {
    Nl(!0), Vs(e, t);
    let r = 0;
    for (; Lo(e); ) {
      if (r === qm) throw new D(103, !1);
      r++, Vs(e, 1);
    }
  } finally {
    Nl(n);
  }
}
function Ym(e, t, n, r) {
  let o = t[b];
  if ((o & 256) === 256) return;
  let i = !1,
    s = !1;
  !i && t[Ye].inlineEffectRunner?.flush(), ua(t);
  let c = !0,
    a = null,
    l = null;
  i ||
    (of(e)
      ? ((l = Bm(t)), (a = Fi(l)))
      : Uc() === null
        ? ((c = !1), (l = Gm(t)), (a = Fi(l)))
        : t[xe] && (ji(t[xe]), (t[xe] = null)));
  try {
    Pu(t), L1(e.bindingStartIndex), n !== null && Gd(e, t, n, 2, r);
    let u = (o & 3) === 3;
    if (!i)
      if (u) {
        let p = e.preOrderCheckHooks;
        p !== null && to(t, p, null);
      } else {
        let p = e.preOrderHooks;
        p !== null && no(t, p, 0, null), ss(t, 0);
      }
    if ((s || Qm(t), af(t, 0), e.contentQueries !== null && tf(e, t), !i))
      if (u) {
        let p = e.contentCheckHooks;
        p !== null && to(t, p);
      } else {
        let p = e.contentHooks;
        p !== null && no(t, p, 1), ss(t, 1);
      }
    lm(e, t);
    let d = e.components;
    d !== null && lf(t, d, 0);
    let m = e.viewQuery;
    if ((m !== null && js(2, m, r), !i))
      if (u) {
        let p = e.viewCheckHooks;
        p !== null && to(t, p);
      } else {
        let p = e.viewHooks;
        p !== null && no(t, p, 2), ss(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[is])) {
      for (let p of t[is]) p();
      t[is] = null;
    }
    i || (t[b] &= -73);
  } catch (u) {
    throw (i || jo(t), u);
  } finally {
    l !== null && (Bc(l, a), c && Hm(l)), da();
  }
}
function af(e, t) {
  for (let n = md(e); n !== null; n = vd(n))
    for (let r = ae; r < n.length; r++) {
      let o = n[r];
      cf(o, t);
    }
}
function Qm(e) {
  for (let t = md(e); t !== null; t = vd(t)) {
    if (!(t[b] & fo.HasTransplantedViews)) continue;
    let n = t[uo];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      ku(o);
    }
  }
}
function Km(e, t, n) {
  let r = vn(t, e);
  cf(r, n);
}
function cf(e, t) {
  ca(e) && Vs(e, t);
}
function Vs(e, t) {
  let r = e[T],
    o = e[b],
    i = e[xe],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Li(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[b] &= -9217),
    s)
  )
    Ym(r, e, r.template, e[Te]);
  else if (o & 8192) {
    af(e, 1);
    let c = r.components;
    c !== null && lf(e, c, 1);
  }
}
function lf(e, t, n) {
  for (let r = 0; r < t.length; r++) Km(e, t[r], n);
}
function uf(e, t) {
  let n = Bu() ? 64 : 1088;
  for (e[Ye].changeDetectionScheduler?.notify(t); e; ) {
    e[b] |= n;
    let r = Nt(e);
    if (ho(e) && !r) return e;
    e = r;
  }
  return null;
}
var fn = class {
  get rootNodes() {
    let t = this._lView,
      n = t[T];
    return bo(n, t, n.firstChild, []);
  }
  constructor(t, n, r = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r),
      (this._appRef = null),
      (this._attachedToViewContainer = !1);
  }
  get context() {
    return this._lView[Te];
  }
  set context(t) {
    this._lView[Te] = t;
  }
  get destroyed() {
    return (this._lView[b] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[ce];
      if (Je(t)) {
        let n = t[lo],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (Gn(t, r), ao(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    zo(this._lView[T], this._lView);
  }
  onDestroy(t) {
    Fu(this._lView, t);
  }
  markForCheck() {
    uf(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[b] &= -129;
  }
  reattach() {
    bs(this._lView), (this._lView[b] |= 128);
  }
  detectChanges() {
    (this._lView[b] |= 1024), sf(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new D(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = ho(this._lView),
      n = this._lView[un];
    n !== null && !t && Ta(n, this._lView), Pd(this._lView[T], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new D(902, !1);
    this._appRef = t;
    let n = ho(this._lView),
      r = this._lView[un];
    r !== null && !n && kd(r, this._lView), bs(this._lView);
  }
};
var Jm = new RegExp(`^(\\d+)*(${wd}|${Dd})*(.*)`);
function Xm(e) {
  let t = e.match(Jm),
    [n, r, o, i] = t,
    s = r ? parseInt(r, 10) : o,
    c = [];
  for (let [a, l, u] of i.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    c.push(l, d);
  }
  return [s, ...c];
}
function e0(e) {
  return !e.prev && e.parent?.type === 8;
}
function fs(e) {
  return e.index - de;
}
function t0(e, t) {
  let n = e.i18nNodes;
  if (n) return n.get(t);
}
function Yo(e, t, n, r) {
  let o = fs(r),
    i = t0(e, o);
  if (i === void 0) {
    let s = e.data[Tg];
    if (s?.[o]) i = r0(s[o], n);
    else if (t.firstChild === r) i = e.firstChild;
    else {
      let c = r.prev === null,
        a = r.prev ?? r.parent;
      if (e0(r)) {
        let l = fs(r.parent);
        i = ks(e, l);
      } else {
        let l = $e(a, n);
        if (c) i = l.firstChild;
        else {
          let u = fs(a),
            d = ks(e, u);
          if (a.type === 2 && d) {
            let p = ba(e, u) + 1;
            i = Qo(p, d);
          } else i = l.nextSibling;
        }
      }
    }
  }
  return i;
}
function Qo(e, t) {
  let n = t;
  for (let r = 0; r < e; r++) n = n.nextSibling;
  return n;
}
function n0(e, t) {
  let n = e;
  for (let r = 0; r < t.length; r += 2) {
    let o = t[r],
      i = t[r + 1];
    for (let s = 0; s < i; s++)
      switch (o) {
        case Ps.FirstChild:
          n = n.firstChild;
          break;
        case Ps.NextSibling:
          n = n.nextSibling;
          break;
      }
  }
  return n;
}
function r0(e, t) {
  let [n, ...r] = Xm(e),
    o;
  if (n === Dd) o = t[Ce][ye];
  else if (n === wd) o = Gg(t[Ce][ye]);
  else {
    let i = Number(n);
    o = Qe(t[i + de]);
  }
  return n0(o, r);
}
var o0 = !1;
function i0(e) {
  o0 = e;
}
function s0(e) {
  let t = e[Ue];
  if (t) {
    let { i18nNodes: n, dehydratedIcuData: r } = t;
    if (n && r) {
      let o = e[te];
      for (let i of r.values()) a0(o, n, i);
    }
    (t.i18nNodes = void 0), (t.dehydratedIcuData = void 0);
  }
}
function a0(e, t, n) {
  for (let r of n.node.cases[n.case]) {
    let o = t.get(r.index - de);
    o && Na(e, o, !1);
  }
}
function df(e) {
  let t = e[Bn] ?? [],
    r = e[ce][te];
  for (let o of t) c0(o, r);
  e[Bn] = _t;
}
function c0(e, t) {
  let n = 0,
    r = e.firstChild;
  if (r) {
    let o = e.data[Co];
    for (; n < o; ) {
      let i = r.nextSibling;
      Na(t, r, !1), (r = i), n++;
    }
  }
}
function ff(e) {
  df(e);
  let t = e[ye];
  qe(t) && Io(t);
  for (let n = ae; n < e.length; n++) Io(e[n]);
}
function Io(e) {
  s0(e);
  let t = e[T];
  for (let n = de; n < t.bindingStartIndex; n++)
    if (Je(e[n])) {
      let r = e[n];
      ff(r);
    } else qe(e[n]) && Io(e[n]);
}
function l0(e) {
  let t = e._views;
  for (let n of t) {
    let r = Rg(n);
    r !== null && r[ye] !== null && (qe(r) ? Io(r) : ff(r));
  }
}
function u0(e, t) {
  let n = [];
  for (let r of t)
    for (let o = 0; o < (r[Ed] ?? 1); o++) {
      let i = { data: r, firstChild: null };
      r[Co] > 0 && ((i.firstChild = e), (e = Qo(r[Co], e))), n.push(i);
    }
  return [e, n];
}
var hf = () => null;
function d0(e, t) {
  let n = e[Bn];
  return !t || n === null || n.length === 0
    ? null
    : n[0].data[_g] === t
      ? n.shift()
      : (df(e), null);
}
function f0() {
  hf = d0;
}
function Mo(e, t) {
  return hf(e, t);
}
var hn = class {},
  La = new w("", { providedIn: "root", factory: () => !1 });
var pf = new w(""),
  gf = new w(""),
  Us = class {},
  So = class {};
function h0(e) {
  let t = Error(`No component factory found for ${ve(e)}.`);
  return (t[p0] = e), t;
}
var p0 = "ngComponent";
var Bs = class {
    resolveComponentFactory(t) {
      throw h0(t);
    }
  },
  pn = class {
    static {
      this.NULL = new Bs();
    }
  },
  gn = class {};
var g0 = (() => {
  class e {
    static {
      this.ɵprov = I({ token: e, providedIn: "root", factory: () => null });
    }
  }
  return e;
})();
function $s(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let c = t[s];
      if (typeof c == "number") i = c;
      else if (i == 1) o = vl(o, c);
      else if (i == 2) {
        let a = c,
          l = t[++s];
        r = vl(r, a + ": " + l + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var _o = class extends pn {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = xt(t);
    return new Zn(n, this.ngModule);
  }
};
function zl(e, t) {
  let n = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let o = e[r];
    if (o === void 0) continue;
    let i = Array.isArray(o),
      s = i ? o[0] : o,
      c = i ? o[1] : yt.None;
    t
      ? n.push({
          propName: s,
          templateName: r,
          isSignal: (c & yt.SignalBased) !== 0,
        })
      : n.push({ propName: s, templateName: r });
  }
  return n;
}
function m0(e) {
  let t = e.toLowerCase();
  return t === "svg" ? Ru : t === "math" ? M1 : null;
}
var Zn = class extends So {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = zl(t.inputs, !0);
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
      return r;
    }
    get outputs() {
      return zl(this.componentDef.outputs, !1);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = o1(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, o) {
      let i = V(null);
      try {
        o = o || this.ngModule;
        let s = o instanceof Ne ? o : o?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let c = s ? new Ms(t, s) : t,
          a = c.get(gn, null);
        if (a === null) throw new D(407, !1);
        let l = c.get(g0, null),
          u = c.get(hn, null),
          d = {
            rendererFactory: a,
            sanitizer: l,
            inlineEffectRunner: null,
            changeDetectionScheduler: u,
          },
          m = a.createRenderer(null, this.componentDef),
          p = this.componentDef.selectors[0][0] || "div",
          y = r
            ? fm(m, r, this.componentDef.encapsulation, c)
            : _a(m, p, m0(p)),
          x = 512;
        this.componentDef.signals
          ? (x |= 4096)
          : this.componentDef.onPush || (x |= 16);
        let z = null;
        y !== null && (z = Ea(y, c, !0));
        let $ = Ra(0, null, null, 1, 0, null, null, null, null, null, null),
          X = Zo(null, $, null, x, null, null, d, m, c, null, z);
        ua(X);
        let nt,
          dt,
          Ht = null;
        try {
          let Ge = this.componentDef,
            zt,
            Oi = null;
          Ge.findHostDirectiveDefs
            ? ((zt = []),
              (Oi = new Map()),
              Ge.findHostDirectiveDefs(Ge, zt, Oi),
              zt.push(Ge))
            : (zt = [Ge]);
          let Jh = v0(X, y);
          (Ht = y0(Jh, y, Ge, zt, X, d, m)),
            (dt = aa($, de)),
            y && w0(m, Ge, y, r),
            n !== void 0 && E0(dt, this.ngContentSelectors, n),
            (nt = D0(Ht, Ge, zt, Oi, X, [b0])),
            ka($, X, null);
        } catch (Ge) {
          throw (Ht !== null && Os(Ht), Os(X), Ge);
        } finally {
          da();
        }
        return new Hs(this.componentType, nt, ya(dt, X), X, dt);
      } finally {
        V(i);
      }
    }
  },
  Hs = class extends Us {
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new fn(o, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        o;
      if (r !== null && (o = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return;
        let i = this._rootLView;
        Pa(i[T], i, o, t, n), this.previousInputValues.set(t, n);
        let s = vn(this._tNode.index, i);
        uf(s, 1);
      }
    }
    get injector() {
      return new St(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function v0(e, t) {
  let n = e[T],
    r = de;
  return (e[r] = t), qo(n, r, 2, "#host", null);
}
function y0(e, t, n, r, o, i, s) {
  let c = o[T];
  C0(r, e, t, s);
  let a = null;
  t !== null && (a = Ea(t, o[ln]));
  let l = i.rendererFactory.createRenderer(t, n),
    u = 16;
  n.signals ? (u = 4096) : n.onPush && (u = 64);
  let d = Zo(o, Yd(n), null, u, o[e.index], e, i, l, null, null, a);
  return (
    c.firstCreatePass && Ls(c, e, r.length - 1), Wo(o, d), (o[e.index] = d)
  );
}
function C0(e, t, n, r) {
  for (let o of e) t.mergedAttrs = na(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    ($s(t, t.mergedAttrs, !0), n !== null && Bd(r, n, t));
}
function D0(e, t, n, r, o, i) {
  let s = ct(),
    c = o[T],
    a = $e(s, o);
  Jd(c, o, s, n, null, r);
  for (let u = 0; u < n.length; u++) {
    let d = s.directiveStart + u,
      m = zn(o, c, d, s);
    Ot(m, o);
  }
  Xd(c, o, s), a && Ot(a, o);
  let l = zn(o, c, s.directiveStart + s.componentOffset, s);
  if (((e[Te] = o[Te] = l), i !== null)) for (let u of i) u(l, t);
  return Zd(c, s, o), l;
}
function w0(e, t, n, r) {
  if (r) vs(e, n, ["ng-version", "18.2.5"]);
  else {
    let { attrs: o, classes: i } = i1(t.selectors[0]);
    o && vs(e, n, o), i && i.length > 0 && Ud(e, n, i.join(" "));
  }
}
function E0(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null ? Array.from(i) : null);
  }
}
function b0() {
  let e = ct();
  ha(Q()[T], e);
}
var Ko = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = I0;
    }
  }
  return e;
})();
function I0() {
  let e = ct();
  return S0(e, Q());
}
var M0 = Ko,
  mf = class extends M0 {
    constructor(t, n, r) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return ya(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new St(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = pa(this._hostTNode, this._hostLView);
      if (Ju(t)) {
        let n = go(t, this._hostLView),
          r = po(t),
          o = n[T].data[r + 8];
        return new St(o, n);
      } else return new St(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = Gl(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - ae;
    }
    createEmbeddedView(t, n, r) {
      let o, i;
      typeof r == "number"
        ? (o = r)
        : r != null && ((o = r.index), (i = r.injector));
      let s = Mo(this._lContainer, t.ssrId),
        c = t.createEmbeddedViewImpl(n || {}, i, s);
      return this.insertImpl(c, o, Eo(this._hostTNode, s)), c;
    }
    createComponent(t, n, r, o, i) {
      let s = t && !w1(t),
        c;
      if (s) c = n;
      else {
        let y = n || {};
        (c = y.index),
          (r = y.injector),
          (o = y.projectableNodes),
          (i = y.environmentInjector || y.ngModuleRef);
      }
      let a = s ? t : new Zn(xt(t)),
        l = r || this.parentInjector;
      if (!i && a.ngModule == null) {
        let x = (s ? l : this.parentInjector).get(Ne, null);
        x && (i = x);
      }
      let u = xt(a.componentType ?? {}),
        d = Mo(this._lContainer, u?.id ?? null),
        m = d?.firstChild ?? null,
        p = a.create(l, o, m, i);
      return this.insertImpl(p.hostView, c, Eo(this._hostTNode, d)), p;
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let o = t._lView;
      if (_1(o)) {
        let c = this.indexOf(t);
        if (c !== -1) this.detach(c);
        else {
          let a = o[ce],
            l = new mf(a, a[Be], a[ce]);
          l.detach(l.indexOf(t));
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer;
      return Fa(s, o, i, r), t.attachToViewContainerRef(), du(hs(s), i, t), t;
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = Gl(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = Gn(this._lContainer, n);
      r && (ao(hs(this._lContainer), n), zo(r[T], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = Gn(this._lContainer, n);
      return r && ao(hs(this._lContainer), n) != null ? new fn(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function Gl(e) {
  return e[lo];
}
function hs(e) {
  return e[lo] || (e[lo] = []);
}
function S0(e, t) {
  let n,
    r = t[e.index];
  return (
    Je(r) ? (n = r) : ((n = ef(r, t, null, e)), (t[e.index] = n), Wo(t, n)),
    vf(n, t, e, r),
    new mf(n, e, t)
  );
}
function _0(e, t) {
  let n = e[te],
    r = n.createComment(""),
    o = $e(t, e),
    i = Ld(n, o);
  return wo(n, i, r, nm(n, o), !1), r;
}
var vf = yf,
  ja = () => !1;
function T0(e, t, n) {
  return ja(e, t, n);
}
function yf(e, t, n, r) {
  if (e[it]) return;
  let o;
  n.type & 8 ? (o = Qe(r)) : (o = _0(t, n)), (e[it] = o);
}
function x0(e, t, n) {
  if (e[it] && e[Bn]) return !0;
  let r = n[Ue],
    o = t.index - de;
  if (!r || yg(t) || Xn(r, o)) return !1;
  let s = ks(r, o),
    c = r.data[wa]?.[o],
    [a, l] = u0(s, c);
  return (e[it] = a), (e[Bn] = l), !0;
}
function N0(e, t, n, r) {
  ja(e, n, t) || yf(e, t, n, r);
}
function A0() {
  (vf = N0), (ja = x0);
}
var Zl = new Set();
function Ft(e) {
  Zl.has(e) ||
    (Zl.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var Ct = class {},
  qn = class {};
var zs = class extends Ct {
    constructor(t, n, r, o = !0) {
      super(),
        (this.ngModuleType = t),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new _o(this));
      let i = Cu(t);
      (this._bootstrapComponents = Ad(i.bootstrap)),
        (this._r3Injector = cd(
          t,
          n,
          [
            { provide: Ct, useValue: this },
            { provide: pn, useValue: this.componentFactoryResolver },
            ...r,
          ],
          ve(t),
          new Set(["environment"]),
        )),
        o && this.resolveInjectorInitializers();
    }
    resolveInjectorInitializers() {
      this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  Gs = class extends qn {
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new zs(this.moduleType, t, []);
    }
  };
var To = class extends Ct {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new _o(this)),
      (this.instance = null);
    let n = new Vn(
      [
        ...t.providers,
        { provide: Ct, useValue: this },
        { provide: pn, useValue: this.componentFactoryResolver },
      ],
      t.parent || sa(),
      t.debugName,
      new Set(["environment"]),
    );
    (this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function Va(e, t, n = null) {
  return new To({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
function Cf(e, t, n) {
  return (e[t] = n);
}
function Df(e, t) {
  return e[t];
}
function mn(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function ql(e, t, n, r) {
  let o = mn(e, t, n);
  return mn(e, t + 1, r) || o;
}
function O0(e, t, n, r, o, i) {
  let s = ql(e, t, n, r);
  return ql(e, t + 2, o, i) || s;
}
function tr(e) {
  return (e.flags & 32) === 32;
}
function R0(e, t, n, r, o, i, s, c, a) {
  let l = t.consts,
    u = qo(t, e, 4, s || null, c || null);
  Kd(t, n, u, $n(l, a)), ha(t, u);
  let d = (u.tView = Ra(
    2,
    u,
    r,
    o,
    i,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    l,
    null,
  ));
  return (
    t.queries !== null &&
      (t.queries.template(t, u), (d.queries = t.queries.embeddedTView(u))),
    u
  );
}
function Wl(e, t, n, r, o, i, s, c, a, l) {
  let u = n + de,
    d = t.firstCreatePass ? R0(u, t, e, r, o, i, s, c, a) : t.data[u];
  Jn(d, !1);
  let m = wf(t, e, d, n);
  fa() && xa(t, e, m, d), Ot(m, e);
  let p = ef(m, e, m, d);
  return (
    (e[u] = p),
    Wo(e, p),
    T0(p, d, e),
    Tu(d) && qd(t, e, d),
    a != null && Wd(e, d, l),
    d
  );
}
var wf = Ef;
function Ef(e, t, n, r) {
  return Dt(!0), t[te].createComment("");
}
function P0(e, t, n, r) {
  let o = t[Ue],
    i = !o || Kn() || tr(n) || Xn(o, r);
  if ((Dt(i), i)) return Ef(e, t, n, r);
  let s = o.data[Sg]?.[r] ?? null;
  s !== null &&
    n.tView !== null &&
    n.tView.ssrId === null &&
    (n.tView.ssrId = s);
  let c = Yo(o, e, t, n);
  Ho(o, r, c);
  let a = ba(o, r);
  return Qo(a, c);
}
function k0() {
  wf = P0;
}
var kn = (function (e) {
    return (
      (e[(e.EarlyRead = 0)] = "EarlyRead"),
      (e[(e.Write = 1)] = "Write"),
      (e[(e.MixedReadWrite = 2)] = "MixedReadWrite"),
      (e[(e.Read = 3)] = "Read"),
      e
    );
  })(kn || {}),
  F0 = (() => {
    class e {
      constructor() {
        this.impl = null;
      }
      execute() {
        this.impl?.execute();
      }
      static {
        this.ɵprov = I({
          token: e,
          providedIn: "root",
          factory: () => new e(),
        });
      }
    }
    return e;
  })(),
  Yl = class e {
    constructor() {
      (this.ngZone = g(q)),
        (this.scheduler = g(hn)),
        (this.errorHandler = g(at, { optional: !0 })),
        (this.sequences = new Set()),
        (this.deferredRegistrations = new Set()),
        (this.executing = !1);
    }
    static {
      this.PHASES = [kn.EarlyRead, kn.Write, kn.MixedReadWrite, kn.Read];
    }
    execute() {
      this.executing = !0;
      for (let t of e.PHASES)
        for (let n of this.sequences)
          if (!(n.erroredOrDestroyed || !n.hooks[t]))
            try {
              n.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                n.hooks[t](n.pipelinedValue),
              );
            } catch (r) {
              (n.erroredOrDestroyed = !0), this.errorHandler?.handleError(r);
            }
      this.executing = !1;
      for (let t of this.sequences)
        t.afterRun(), t.once && this.sequences.delete(t);
      for (let t of this.deferredRegistrations) this.sequences.add(t);
      this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
        this.deferredRegistrations.clear();
    }
    register(t) {
      this.executing
        ? this.deferredRegistrations.add(t)
        : (this.sequences.add(t), this.scheduler.notify(6));
    }
    unregister(t) {
      this.executing && this.sequences.has(t)
        ? ((t.erroredOrDestroyed = !0),
          (t.pipelinedValue = void 0),
          (t.once = !0))
        : (this.sequences.delete(t), this.deferredRegistrations.delete(t));
    }
    static {
      this.ɵprov = I({ token: e, providedIn: "root", factory: () => new e() });
    }
  };
function L0(e, t, n, r) {
  return mn(e, la(), n) ? t + Xs(n) + r : er;
}
function De(e, t, n) {
  let r = Q(),
    o = la();
  if (mn(r, o, t)) {
    let i = yn(),
      s = $1();
    Cm(i, s, r, e, t, r[te], n, !1);
  }
  return De;
}
function Ql(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? "class" : "style";
  Pa(e, n, i[s], s, r);
}
var Zs = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      this.attach(r, i), this.attach(o, s);
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function ps(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function j0(e, t, n) {
  let r,
    o,
    i = 0,
    s = e.length - 1,
    c = void 0;
  if (Array.isArray(t)) {
    let a = t.length - 1;
    for (; i <= s && i <= a; ) {
      let l = e.at(i),
        u = t[i],
        d = ps(i, l, i, u, n);
      if (d !== 0) {
        d < 0 && e.updateValue(i, u), i++;
        continue;
      }
      let m = e.at(s),
        p = t[a],
        y = ps(s, m, a, p, n);
      if (y !== 0) {
        y < 0 && e.updateValue(s, p), s--, a--;
        continue;
      }
      let x = n(i, l),
        z = n(s, m),
        $ = n(i, u);
      if (Object.is($, z)) {
        let X = n(a, p);
        Object.is(X, x)
          ? (e.swap(i, s), e.updateValue(s, p), a--, s--)
          : e.move(s, i),
          e.updateValue(i, u),
          i++;
        continue;
      }
      if (((r ??= new xo()), (o ??= Jl(e, i, s, n)), qs(e, r, i, $)))
        e.updateValue(i, u), i++, s++;
      else if (o.has($)) r.set(x, e.detach(i)), s--;
      else {
        let X = e.create(i, t[i]);
        e.attach(i, X), i++, s++;
      }
    }
    for (; i <= a; ) Kl(e, r, n, i, t[i]), i++;
  } else if (t != null) {
    let a = t[Symbol.iterator](),
      l = a.next();
    for (; !l.done && i <= s; ) {
      let u = e.at(i),
        d = l.value,
        m = ps(i, u, i, d, n);
      if (m !== 0) m < 0 && e.updateValue(i, d), i++, (l = a.next());
      else {
        (r ??= new xo()), (o ??= Jl(e, i, s, n));
        let p = n(i, d);
        if (qs(e, r, i, p)) e.updateValue(i, d), i++, s++, (l = a.next());
        else if (!o.has(p))
          e.attach(i, e.create(i, d)), i++, s++, (l = a.next());
        else {
          let y = n(i, u);
          r.set(y, e.detach(i)), s--;
        }
      }
    }
    for (; !l.done; ) Kl(e, r, n, e.length, l.value), (l = a.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((a) => {
    e.destroy(a);
  });
}
function qs(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function Kl(e, t, n, r, o) {
  if (qs(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function Jl(e, t, n, r) {
  let o = new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var xo = class {
  constructor() {
    (this.kvMap = new Map()), (this._vMap = void 0);
  }
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) (r = o.get(r)), t(r, n);
      }
  }
};
var Ws = class {
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - ae;
  }
};
var Ys = class {
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function Oe(e, t, n, r, o, i, s, c, a, l, u, d, m) {
  Ft("NgControlFlow");
  let p = Q(),
    y = yn(),
    x = a !== void 0,
    z = Q(),
    $ = c ? s.bind(z[Ce][Te]) : s,
    X = new Ys(x, $);
  (z[de + e] = X),
    Wl(p, y, e + 1, t, n, r, o, $n(y.consts, i)),
    x && Wl(p, y, e + 2, a, l, u, d, $n(y.consts, m));
}
var Qs = class extends Zs {
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.operationsCounter = void 0),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - ae;
  }
  at(t) {
    return this.getLView(t)[Te].$implicit;
  }
  attach(t, n) {
    let r = n[Ue];
    (this.needsIndexUpdate ||= t !== this.length),
      Fa(this.lContainer, n, t, Eo(this.templateTNode, r));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), V0(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = Mo(this.lContainer, this.templateTNode.tView.ssrId),
      o = nf(
        this.hostLView,
        this.templateTNode,
        new Ws(this.lContainer, n, t),
        { dehydratedView: r },
      );
    return this.operationsCounter?.recordCreate(), o;
  }
  destroy(t) {
    zo(t[T], t), this.operationsCounter?.recordDestroy();
  }
  updateValue(t, n) {
    this.getLView(t)[Te].$implicit = n;
  }
  reset() {
    (this.needsIndexUpdate = !1), this.operationsCounter?.reset();
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[Te].$index = t;
  }
  getLView(t) {
    return U0(this.lContainer, t);
  }
};
function Re(e) {
  let t = V(null),
    n = Vo();
  try {
    let r = Q(),
      o = r[T],
      i = r[n],
      s = n + 1,
      c = Xl(r, s);
    if (i.liveCollection === void 0) {
      let l = eu(o, s);
      i.liveCollection = new Qs(c, r, l);
    } else i.liveCollection.reset();
    let a = i.liveCollection;
    if ((j0(a, e, i.trackByFn), a.updateIndexes(), i.hasEmptyBlock)) {
      let l = la(),
        u = a.length === 0;
      if (mn(r, l, u)) {
        let d = n + 2,
          m = Xl(r, d);
        if (u) {
          let p = eu(o, d),
            y = Mo(m, p.tView.ssrId),
            x = nf(r, p, void 0, { dehydratedView: y });
          Fa(m, x, 0, Eo(p, y));
        } else Vm(m, 0);
      }
    }
  } finally {
    V(t);
  }
}
function Xl(e, t) {
  return e[t];
}
function V0(e, t) {
  return Gn(e, t);
}
function U0(e, t) {
  return jm(e, t);
}
function eu(e, t) {
  return aa(e, t);
}
function B0(e, t, n, r, o, i) {
  let s = t.consts,
    c = $n(s, o),
    a = qo(t, e, 2, r, c);
  return (
    Kd(t, n, a, $n(s, i)),
    a.attrs !== null && $s(a, a.attrs, !1),
    a.mergedAttrs !== null && $s(a, a.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, a),
    a
  );
}
function f(e, t, n, r) {
  let o = Q(),
    i = yn(),
    s = de + e,
    c = o[te],
    a = i.firstCreatePass ? B0(s, i, o, t, n, r) : i.data[s],
    l = bf(i, o, a, c, t, e);
  o[s] = l;
  let u = Tu(a);
  return (
    Jn(a, !0),
    Bd(c, l, a),
    !tr(a) && fa() && xa(i, o, l, a),
    x1() === 0 && Ot(l, o),
    N1(),
    u && (qd(i, o, a), Zd(i, a, o)),
    r !== null && Wd(o, a),
    f
  );
}
function h() {
  let e = ct();
  Uu() ? F1() : ((e = e.parent), Jn(e, !1));
  let t = e;
  O1(t) && P1(), A1();
  let n = yn();
  return (
    n.firstCreatePass && (ha(n, e), _u(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      q1(t) &&
      Ql(n, t, Q(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      W1(t) &&
      Ql(n, t, Q(), t.stylesWithoutHost, !1),
    h
  );
}
function v(e, t, n, r) {
  return f(e, t, n, r), h(), v;
}
var bf = (e, t, n, r, o, i) => (Dt(!0), _a(r, o, Yu()));
function $0(e, t, n, r, o, i) {
  let s = t[Ue],
    c = !s || Kn() || tr(n) || Xn(s, i);
  if ((Dt(c), c)) return _a(r, o, Yu());
  let a = Yo(s, e, t, n);
  return (
    Sd(s, i) && Ho(s, i, a.nextSibling),
    s && (hd(n) || pd(a)) && Yn(n) && (R1(n), Vd(a)),
    a
  );
}
function H0() {
  bf = $0;
}
var z0 = (e, t, n, r) => (Dt(!0), Rd(t[te], ""));
function G0(e, t, n, r) {
  let o,
    i = t[Ue],
    s = !i || Kn() || Xn(i, r) || tr(n);
  if ((Dt(s), s)) return Rd(t[te], "");
  let c = Yo(i, e, t, n),
    a = Fg(i, r);
  return Ho(i, r, c), (o = Qo(a, c)), o;
}
function Z0() {
  z0 = G0;
}
var No = "en-US";
var q0 = No;
function W0(e) {
  typeof e == "string" && (q0 = e.toLowerCase().replace(/_/g, "-"));
}
function E(e, t = "") {
  let n = Q(),
    r = yn(),
    o = e + de,
    i = r.firstCreatePass ? qo(r, o, 1, t, null) : r.data[o],
    s = If(r, n, i, t, e);
  (n[o] = s), fa() && xa(r, n, s, i), Jn(i, !1);
}
var If = (e, t, n, r, o) => (Dt(!0), Od(t[te], r));
function Y0(e, t, n, r, o) {
  let i = t[Ue],
    s = !i || Kn() || tr(n) || Xn(i, o);
  return Dt(s), s ? Od(t[te], r) : Yo(i, e, t, n);
}
function Q0() {
  If = Y0;
}
function we(e) {
  return he("", e, ""), we;
}
function he(e, t, n) {
  let r = Q(),
    o = L0(r, e, t, n);
  return o !== er && Pm(r, Vo(), o), he;
}
var K0 = (() => {
  class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = Eu(!1, n.type),
          o =
            r.length > 0
              ? Va([r], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static {
      this.ɵprov = I({
        token: e,
        providedIn: "environment",
        factory: () => new e(R(Ne)),
      });
    }
  }
  return e;
})();
function re(e) {
  Ft("NgStandalone"),
    (e.getStandaloneInjector = (t) =>
      t.get(K0).getOrCreateStandaloneInjector(e));
}
function P(e, t, n) {
  let r = $u() + e,
    o = Q();
  return o[r] === er ? Cf(o, r, n ? t.call(n) : t()) : Df(o, r);
}
function Pe(e, t, n, r, o, i, s, c) {
  let a = $u() + e,
    l = Q(),
    u = O0(l, a, n, r, o, i);
  return mn(l, a + 4, s) || u
    ? Cf(l, a + 5, c ? t.call(c, n, r, o, i, s) : t(n, r, o, i, s))
    : Df(l, a + 5);
}
var Jo = (() => {
  class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "platform" });
    }
  }
  return e;
})();
var Mf = new w("");
function nr(e) {
  return !!e && typeof e.then == "function";
}
function Sf(e) {
  return !!e && typeof e.subscribe == "function";
}
var _f = new w(""),
  Tf = (() => {
    class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, r) => {
            (this.resolve = n), (this.reject = r);
          })),
          (this.appInits = g(_f, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = o();
          if (nr(i)) n.push(i);
          else if (Sf(i)) {
            let s = new Promise((c, a) => {
              i.subscribe({ complete: c, error: a });
            });
            n.push(s);
          }
        }
        let r = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && r(),
          (this.initialized = !0);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  Dn = new w("");
function J0() {
  $c(() => {
    throw new D(600, !1);
  });
}
function X0(e) {
  return e.isBoundToModule;
}
var e2 = 10;
function t2(e, t, n) {
  try {
    let r = n();
    return nr(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
var et = (() => {
  class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = g(pg)),
        (this.afterRenderManager = g(F0)),
        (this.zonelessEnabled = g(La)),
        (this.dirtyFlags = 0),
        (this.deferredDirtyFlags = 0),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new le()),
        (this.afterTick = new le()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = g(Pt).hasPendingTasks.pipe(O((n) => !n))),
        (this._injector = g(Ne));
    }
    get allViews() {
      return [...this.externalTestViews.keys(), ...this._views];
    }
    get destroyed() {
      return this._destroyed;
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      let o = n instanceof So;
      if (!this._injector.get(Tf).done) {
        let m = !o && yu(n),
          p = !1;
        throw new D(405, p);
      }
      let s;
      o ? (s = n) : (s = this._injector.get(pn).resolveComponentFactory(n)),
        this.componentTypes.push(s.componentType);
      let c = X0(s) ? void 0 : this._injector.get(Ct),
        a = r || s.selector,
        l = s.create(st.NULL, [], a, c),
        u = l.location.nativeElement,
        d = l.injector.get(Mf, null);
      return (
        d?.registerApplication(u),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            ro(this.components, l),
            d?.unregisterApplication(u);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
    }
    _tick() {
      if (this._runningTick) throw new D(101, !1);
      let n = V(null);
      try {
        (this._runningTick = !0), this.synchronize();
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        (this._runningTick = !1), V(n), this.afterTick.next();
      }
    }
    synchronize() {
      let n = null;
      this._injector.destroyed ||
        (n = this._injector.get(gn, null, { optional: !0 })),
        (this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0);
      let r = 0;
      for (; this.dirtyFlags !== 0 && r++ < e2; ) this.synchronizeOnce(n);
    }
    synchronizeOnce(n) {
      if (
        ((this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0),
        this.dirtyFlags & 7)
      ) {
        let r = !!(this.dirtyFlags & 1);
        (this.dirtyFlags &= -8),
          (this.dirtyFlags |= 8),
          this.beforeRender.next(r);
        for (let { _lView: o, notifyErrorHandler: i } of this._views)
          n2(o, i, r, this.zonelessEnabled);
        if (
          ((this.dirtyFlags &= -5),
          this.syncDirtyFlagsWithViews(),
          this.dirtyFlags & 7)
        )
          return;
      } else n?.begin?.(), n?.end?.();
      this.dirtyFlags & 8 &&
        ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews();
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => Lo(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      this._views.push(r), r.attachToAppRef(this);
    }
    detachView(n) {
      let r = n;
      ro(this._views, r), r.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let r = this._injector.get(Dn, []);
      [...this._bootstrapListeners, ...r].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => ro(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new D(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function ro(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
var Jr;
function Xo(e) {
  Jr ??= new WeakMap();
  let t = Jr.get(e);
  if (t) return t;
  let n = e.isStable
    .pipe(Le((r) => r))
    .toPromise()
    .then(() => {});
  return Jr.set(e, n), e.onDestroy(() => Jr?.delete(e)), n;
}
function n2(e, t, n, r) {
  if (!n && !Lo(e)) return;
  sf(e, t, n && !r ? 0 : 1);
}
var Ks = class {
    constructor(t, n) {
      (this.ngModuleFactory = t), (this.componentFactories = n);
    }
  },
  Ua = (() => {
    class e {
      compileModuleSync(n) {
        return new Gs(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let r = this.compileModuleSync(n),
          o = Cu(n),
          i = Ad(o.declarations).reduce((s, c) => {
            let a = xt(c);
            return a && s.push(new Zn(a)), s;
          }, []);
        return new Ks(r, i);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
var r2 = (() => {
    class e {
      constructor() {
        (this.zone = g(q)),
          (this.changeDetectionScheduler = g(hn)),
          (this.applicationRef = g(et));
      }
      initialize() {
        this._onMicrotaskEmptySubscription ||
          (this._onMicrotaskEmptySubscription =
            this.zone.onMicrotaskEmpty.subscribe({
              next: () => {
                this.changeDetectionScheduler.runningTick ||
                  this.zone.run(() => {
                    this.applicationRef.tick();
                  });
              },
            }));
      }
      ngOnDestroy() {
        this._onMicrotaskEmptySubscription?.unsubscribe();
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  o2 = new w("", { factory: () => !1 });
function xf({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new q(Z(C({}, Af()), { scheduleInRootZone: n }))),
    [
      { provide: q, useFactory: e },
      {
        provide: Tt,
        multi: !0,
        useFactory: () => {
          let r = g(r2, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: Tt,
        multi: !0,
        useFactory: () => {
          let r = g(i2);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: pf, useValue: !0 } : [],
      { provide: gf, useValue: n ?? ld },
    ]
  );
}
function Nf(e) {
  let t = e?.ignoreChangesOutsideZone,
    n = e?.scheduleInRootZone,
    r = xf({
      ngZoneFactory: () => {
        let o = Af(e);
        return (
          (o.scheduleInRootZone = n),
          o.shouldCoalesceEventChangeDetection && Ft("NgZone_CoalesceEvent"),
          new q(o)
        );
      },
      ignoreChangesOutsideZone: t,
      scheduleInRootZone: n,
    });
  return Rt([{ provide: o2, useValue: !0 }, { provide: La, useValue: !1 }, r]);
}
function Af(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var i2 = (() => {
  class e {
    constructor() {
      (this.subscription = new W()),
        (this.initialized = !1),
        (this.zone = g(q)),
        (this.pendingTasks = g(Pt));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              q.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            q.assertInAngularZone(), (n ??= this.pendingTasks.add());
          }),
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
var s2 = (() => {
  class e {
    constructor() {
      (this.appRef = g(et)),
        (this.taskService = g(Pt)),
        (this.ngZone = g(q)),
        (this.zonelessEnabled = g(La)),
        (this.disableScheduling = g(pf, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < "u" && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new W()),
        (this.angularZoneId = this.zoneIsDefined
          ? this.ngZone._inner?.get(vo)
          : null),
        (this.scheduleInRootZone =
          !this.zonelessEnabled &&
          this.zoneIsDefined &&
          (g(gf, { optional: !0 }) ?? !1)),
        (this.cancelScheduledCallback = null),
        (this.useMicrotaskScheduler = !1),
        (this.runningTick = !1),
        (this.pendingRenderTaskId = null),
        this.subscriptions.add(
          this.appRef.afterTick.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof As || !this.zoneIsDefined));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      switch (n) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 7: {
          this.appRef.deferredDirtyFlags |= 8;
          break;
        }
        case 9:
        case 8:
        case 6:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (!this.shouldScheduleTick()) return;
      let r = this.useMicrotaskScheduler ? Fl : dd;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              r(() => this.tick()),
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              r(() => this.tick()),
            ));
    }
    shouldScheduleTick() {
      return !(
        this.disableScheduling ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(vo + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      !this.zonelessEnabled &&
        this.appRef.dirtyFlags & 7 &&
        (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick();
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (r) {
        throw (this.taskService.remove(n), r);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        Fl(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(n);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(n);
      }
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function a2() {
  return (typeof $localize < "u" && $localize.locale) || No;
}
var Ba = new w("", {
  providedIn: "root",
  factory: () => g(Ba, N.Optional | N.SkipSelf) || a2(),
});
var Of = new w("");
function Xr(e) {
  return !!e.platformInjector;
}
function c2(e) {
  let t = Xr(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(q);
  return n.run(() => {
    Xr(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(at, null),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({
          next: (i) => {
            r.handleError(i);
          },
        });
      }),
      Xr(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(Of);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else
      e.moduleRef.onDestroy(() => {
        ro(e.allPlatformModules, e.moduleRef), o.unsubscribe();
      });
    return t2(r, n, () => {
      let i = t.get(Tf);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get(Ba, No);
          if ((W0(s || No), Xr(e))) {
            let c = t.get(et);
            return (
              e.rootComponent !== void 0 && c.bootstrap(e.rootComponent), c
            );
          } else return l2(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function l2(e, t) {
  let n = e.injector.get(et);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new D(-403, !1);
  t.push(e);
}
var oo = null;
function u2(e = [], t) {
  return st.create({
    name: t,
    providers: [
      { provide: Po, useValue: "platform" },
      { provide: Of, useValue: new Set([() => (oo = null)]) },
      ...e,
    ],
  });
}
function d2(e = []) {
  if (oo) return oo;
  let t = u2(e);
  return (oo = t), J0(), f2(t), t;
}
function f2(e) {
  e.get(Ca, null)?.forEach((n) => n());
}
var rr = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = h2;
    }
  }
  return e;
})();
function h2(e) {
  return p2(ct(), Q(), (e & 16) === 16);
}
function p2(e, t, n) {
  if (Yn(e) && !n) {
    let r = vn(e.index, t);
    return new fn(r, r);
  } else if (e.type & 175) {
    let r = t[Ce];
    return new fn(r, t);
  }
  return null;
}
function Rf(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = d2(r),
      i = [xf({}), { provide: hn, useExisting: s2 }, ...(n || [])],
      s = new To({
        providers: i,
        parent: o,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return c2({
      r3Injector: s.injector,
      platformInjector: o,
      rootComponent: t,
    });
  } catch (t) {
    return Promise.reject(t);
  }
}
var Pf = new w("");
var tu = !1;
function g2() {
  tu || ((tu = !0), Og(), H0(), Q0(), Z0(), k0(), A0(), f0(), gm());
}
function m2(e, t) {
  return Xo(e);
}
function kf() {
  return Rt([
    {
      provide: Qr,
      useFactory: () => {
        let e = !0;
        return (
          Kr() && (e = !!g(Cn, { optional: !0 })?.get(Id, null)),
          e && Ft("NgHydration"),
          e
        );
      },
    },
    {
      provide: Tt,
      useValue: () => {
        i0(!1), Kr() && g(Qr) && (v2(), g2());
      },
      multi: !0,
    },
    { provide: Td, useFactory: () => Kr() && g(Qr) },
    {
      provide: Dn,
      useFactory: () => {
        if (Kr() && g(Qr)) {
          let e = g(et),
            t = g(st);
          return () => {
            m2(e, t).then(() => {
              l0(e);
            });
          };
        }
        return () => {};
      },
      multi: !0,
    },
  ]);
}
function v2() {
  let e = Bo(),
    t;
  for (let n of e.body.childNodes)
    if (n.nodeType === Node.COMMENT_NODE && n.textContent?.trim() === Ng) {
      t = n;
      break;
    }
  if (!t) throw new D(-507, !1);
}
var $f = null;
function wn() {
  return $f;
}
function Hf(e) {
  $f ??= e;
}
var ei = class {};
var pe = new w(""),
  zf = (() => {
    class e {
      historyGo(n) {
        throw new Error("");
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({
          token: e,
          factory: () => g(E2),
          providedIn: "platform",
        });
      }
    }
    return e;
  })();
var E2 = (() => {
  class e extends zf {
    constructor() {
      super(),
        (this._doc = g(pe)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return wn().getBaseHref(this._doc);
    }
    onPopState(n) {
      let r = wn().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("popstate", n, !1),
        () => r.removeEventListener("popstate", n)
      );
    }
    onHashChange(n) {
      let r = wn().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("hashchange", n, !1),
        () => r.removeEventListener("hashchange", n)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(n) {
      this._location.pathname = n;
    }
    pushState(n, r, o) {
      this._history.pushState(n, r, o);
    }
    replaceState(n, r, o) {
      this._history.replaceState(n, r, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(n = 0) {
      this._history.go(n);
    }
    getState() {
      return this._history.state;
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = I({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      });
    }
  }
  return e;
})();
function Gf(e, t) {
  if (e.length == 0) return t;
  if (t.length == 0) return e;
  let n = 0;
  return (
    e.endsWith("/") && n++,
    t.startsWith("/") && n++,
    n == 2 ? e + t.substring(1) : n == 1 ? e + t : e + "/" + t
  );
}
function Ff(e) {
  let t = e.match(/#|\?|$/),
    n = (t && t.index) || e.length,
    r = n - (e[n - 1] === "/" ? 1 : 0);
  return e.slice(0, r) + e.slice(n);
}
function Lt(e) {
  return e && e[0] !== "?" ? "?" + e : e;
}
var ni = (() => {
    class e {
      historyGo(n) {
        throw new Error("");
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: () => g(Zf), providedIn: "root" });
      }
    }
    return e;
  })(),
  b2 = new w(""),
  Zf = (() => {
    class e extends ni {
      constructor(n, r) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            r ??
            this._platformLocation.getBaseHrefFromDOM() ??
            g(pe).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return Gf(this._baseHref, n);
      }
      path(n = !1) {
        let r =
            this._platformLocation.pathname + Lt(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${r}${o}` : r;
      }
      pushState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + Lt(i));
        this._platformLocation.pushState(n, r, s);
      }
      replaceState(n, r, o, i) {
        let s = this.prepareExternalUrl(o + Lt(i));
        this._platformLocation.replaceState(n, r, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(R(zf), R(b2, 8));
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
var or = (() => {
  class e {
    constructor(n) {
      (this._subject = new ue()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = n);
      let r = this._locationStrategy.getBaseHref();
      (this._basePath = S2(Ff(Lf(r)))),
        this._locationStrategy.onPopState((o) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: o.state,
            type: o.type,
          });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = []);
    }
    path(n = !1) {
      return this.normalize(this._locationStrategy.path(n));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(n, r = "") {
      return this.path() == this.normalize(n + Lt(r));
    }
    normalize(n) {
      return e.stripTrailingSlash(M2(this._basePath, Lf(n)));
    }
    prepareExternalUrl(n) {
      return (
        n && n[0] !== "/" && (n = "/" + n),
        this._locationStrategy.prepareExternalUrl(n)
      );
    }
    go(n, r = "", o = null) {
      this._locationStrategy.pushState(o, "", n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Lt(r)), o);
    }
    replaceState(n, r = "", o = null) {
      this._locationStrategy.replaceState(o, "", n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Lt(r)), o);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(n = 0) {
      this._locationStrategy.historyGo?.(n);
    }
    onUrlChange(n) {
      return (
        this._urlChangeListeners.push(n),
        (this._urlChangeSubscription ??= this.subscribe((r) => {
          this._notifyUrlChangeListeners(r.url, r.state);
        })),
        () => {
          let r = this._urlChangeListeners.indexOf(n);
          this._urlChangeListeners.splice(r, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(n = "", r) {
      this._urlChangeListeners.forEach((o) => o(n, r));
    }
    subscribe(n, r, o) {
      return this._subject.subscribe({ next: n, error: r, complete: o });
    }
    static {
      this.normalizeQueryParams = Lt;
    }
    static {
      this.joinWithSlash = Gf;
    }
    static {
      this.stripTrailingSlash = Ff;
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)(R(ni));
      };
    }
    static {
      this.ɵprov = I({ token: e, factory: () => I2(), providedIn: "root" });
    }
  }
  return e;
})();
function I2() {
  return new or(R(ni));
}
function M2(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let n = t.substring(e.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t;
}
function Lf(e) {
  return e.replace(/\/index.html$/, "");
}
function S2(e) {
  if (new RegExp("^(https?:)?//").test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/);
    return n;
  }
  return e;
}
function $a(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var qf = "browser",
  _2 = "server";
function ir(e) {
  return e === _2;
}
var ti = class {};
var oi = class e {
  constructor(t) {
    (this.normalizedNames = new Map()),
      (this.lazyUpdate = null),
      t
        ? typeof t == "string"
          ? (this.lazyInit = () => {
              (this.headers = new Map()),
                t
                  .split(
                    `
`,
                  )
                  .forEach((n) => {
                    let r = n.indexOf(":");
                    if (r > 0) {
                      let o = n.slice(0, r),
                        i = o.toLowerCase(),
                        s = n.slice(r + 1).trim();
                      this.maybeSetNormalizedName(o, i),
                        this.headers.has(i)
                          ? this.headers.get(i).push(s)
                          : this.headers.set(i, [s]);
                    }
                  });
            })
          : typeof Headers < "u" && t instanceof Headers
            ? ((this.headers = new Map()),
              t.forEach((n, r) => {
                this.setHeaderEntries(r, n);
              }))
            : (this.lazyInit = () => {
                (this.headers = new Map()),
                  Object.entries(t).forEach(([n, r]) => {
                    this.setHeaderEntries(n, r);
                  });
              })
        : (this.headers = new Map());
  }
  has(t) {
    return this.init(), this.headers.has(t.toLowerCase());
  }
  get(t) {
    this.init();
    let n = this.headers.get(t.toLowerCase());
    return n && n.length > 0 ? n[0] : null;
  }
  keys() {
    return this.init(), Array.from(this.normalizedNames.values());
  }
  getAll(t) {
    return this.init(), this.headers.get(t.toLowerCase()) || null;
  }
  append(t, n) {
    return this.clone({ name: t, value: n, op: "a" });
  }
  set(t, n) {
    return this.clone({ name: t, value: n, op: "s" });
  }
  delete(t, n) {
    return this.clone({ name: t, value: n, op: "d" });
  }
  maybeSetNormalizedName(t, n) {
    this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
  }
  init() {
    this.lazyInit &&
      (this.lazyInit instanceof e
        ? this.copyFrom(this.lazyInit)
        : this.lazyInit(),
      (this.lazyInit = null),
      this.lazyUpdate &&
        (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
        (this.lazyUpdate = null)));
  }
  copyFrom(t) {
    t.init(),
      Array.from(t.headers.keys()).forEach((n) => {
        this.headers.set(n, t.headers.get(n)),
          this.normalizedNames.set(n, t.normalizedNames.get(n));
      });
  }
  clone(t) {
    let n = new e();
    return (
      (n.lazyInit =
        this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
      (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
      n
    );
  }
  applyUpdate(t) {
    let n = t.name.toLowerCase();
    switch (t.op) {
      case "a":
      case "s":
        let r = t.value;
        if ((typeof r == "string" && (r = [r]), r.length === 0)) return;
        this.maybeSetNormalizedName(t.name, n);
        let o = (t.op === "a" ? this.headers.get(n) : void 0) || [];
        o.push(...r), this.headers.set(n, o);
        break;
      case "d":
        let i = t.value;
        if (!i) this.headers.delete(n), this.normalizedNames.delete(n);
        else {
          let s = this.headers.get(n);
          if (!s) return;
          (s = s.filter((c) => i.indexOf(c) === -1)),
            s.length === 0
              ? (this.headers.delete(n), this.normalizedNames.delete(n))
              : this.headers.set(n, s);
        }
        break;
    }
  }
  setHeaderEntries(t, n) {
    let r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
      o = t.toLowerCase();
    this.headers.set(o, r), this.maybeSetNormalizedName(t, o);
  }
  forEach(t) {
    this.init(),
      Array.from(this.normalizedNames.keys()).forEach((n) =>
        t(this.normalizedNames.get(n), this.headers.get(n)),
      );
  }
};
var th = (function (e) {
    return (
      (e[(e.Sent = 0)] = "Sent"),
      (e[(e.UploadProgress = 1)] = "UploadProgress"),
      (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
      (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
      (e[(e.Response = 4)] = "Response"),
      (e[(e.User = 5)] = "User"),
      e
    );
  })(th || {}),
  Ha = class {
    constructor(t, n = 200, r = "OK") {
      (this.headers = t.headers || new oi()),
        (this.status = t.status !== void 0 ? t.status : n),
        (this.statusText = t.statusText || r),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  };
var ii = class e extends Ha {
  constructor(t = {}) {
    super(t),
      (this.type = th.Response),
      (this.body = t.body !== void 0 ? t.body : null);
  }
  clone(t = {}) {
    return new e({
      body: t.body !== void 0 ? t.body : this.body,
      headers: t.headers || this.headers,
      status: t.status !== void 0 ? t.status : this.status,
      statusText: t.statusText || this.statusText,
      url: t.url || this.url || void 0,
    });
  }
};
var T2 = new w("");
var x2 = new w(""),
  Wf = "b",
  Yf = "h",
  Qf = "s",
  Kf = "st",
  Jf = "u",
  Xf = "rt",
  ri = new w(""),
  N2 = ["GET", "HEAD"];
function A2(e, t) {
  let p = g(ri),
    { isCacheActive: n } = p,
    r = jc(p, ["isCacheActive"]),
    { transferCache: o, method: i } = e;
  if (
    !n ||
    o === !1 ||
    (i === "POST" && !r.includePostRequests && !o) ||
    (i !== "POST" && !N2.includes(i)) ||
    (!r.includeRequestsWithAuthHeaders && O2(e)) ||
    r.filter?.(e) === !1
  )
    return t(e);
  let s = g(Cn),
    c = g(x2, { optional: !0 }),
    a = ir(g(Xe));
  if (c && !a) throw new D(2803, !1);
  let l = a && c ? F2(e.url, c) : e.url,
    u = P2(e, l),
    d = s.get(u, null),
    m = r.includeHeaders;
  if ((typeof o == "object" && o.includeHeaders && (m = o.includeHeaders), d)) {
    let { [Wf]: y, [Xf]: x, [Yf]: z, [Qf]: $, [Kf]: X, [Jf]: nt } = d,
      dt = y;
    switch (x) {
      case "arraybuffer":
        dt = new TextEncoder().encode(y).buffer;
        break;
      case "blob":
        dt = new Blob([y]);
        break;
    }
    let Ht = new oi(z);
    return M(
      new ii({ body: dt, headers: Ht, status: $, statusText: X, url: nt }),
    );
  }
  return t(e).pipe(
    J((y) => {
      y instanceof ii &&
        a &&
        s.set(u, {
          [Wf]: y.body,
          [Yf]: R2(y.headers, m),
          [Qf]: y.status,
          [Kf]: y.statusText,
          [Jf]: l,
          [Xf]: e.responseType,
        });
    }),
  );
}
function O2(e) {
  return e.headers.has("authorization") || e.headers.has("proxy-authorization");
}
function R2(e, t) {
  if (!t) return {};
  let n = {};
  for (let r of t) {
    let o = e.getAll(r);
    o !== null && (n[r] = o);
  }
  return n;
}
function eh(e) {
  return [...e.keys()]
    .sort()
    .map((t) => `${t}=${e.getAll(t)}`)
    .join("&");
}
function P2(e, t) {
  let { params: n, method: r, responseType: o } = e,
    i = eh(n),
    s = e.serializeBody();
  s instanceof URLSearchParams ? (s = eh(s)) : typeof s != "string" && (s = "");
  let c = [r, o, t, s, i].join("|"),
    a = k2(c);
  return a;
}
function k2(e) {
  let t = 0;
  for (let n of e) t = (Math.imul(31, t) + n.charCodeAt(0)) << 0;
  return (t += 2147483648), t.toString();
}
function nh(e) {
  return [
    {
      provide: ri,
      useFactory: () => (
        Ft("NgHttpTransferCache"), C({ isCacheActive: !0 }, e)
      ),
    },
    { provide: T2, useValue: A2, multi: !0, deps: [Cn, ri] },
    {
      provide: Dn,
      multi: !0,
      useFactory: () => {
        let t = g(et),
          n = g(ri);
        return () => {
          Xo(t).then(() => {
            n.isCacheActive = !1;
          });
        };
      },
    },
  ];
}
function F2(e, t) {
  let n = new URL(e, "resolve://").origin,
    r = t[n];
  return r ? e.replace(n, r) : e;
}
var Za = class extends ei {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  qa = class e extends Za {
    static makeCurrent() {
      Hf(new e());
    }
    onAndCancel(t, n, r) {
      return (
        t.addEventListener(n, r),
        () => {
          t.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n);
    }
    remove(t) {
      t.remove();
    }
    createElement(t, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(t);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, n) {
      return n === "window"
        ? window
        : n === "document"
          ? t
          : n === "body"
            ? t.body
            : null;
    }
    getBaseHref(t) {
      let n = j2();
      return n == null ? null : V2(n);
    }
    resetBaseElement() {
      sr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return $a(document.cookie, t);
    }
  },
  sr = null;
function j2() {
  return (
    (sr = sr || document.querySelector("base")),
    sr ? sr.getAttribute("href") : null
  );
}
function V2(e) {
  return new URL(e, document.baseURI).pathname;
}
var U2 = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  si = new w(""),
  sh = (() => {
    class e {
      constructor(n, r) {
        (this._zone = r),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, r, o) {
        return this._findPluginFor(r).addEventListener(n, r, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let r = this._eventNameToPlugin.get(n);
        if (r) return r;
        if (((r = this._plugins.find((i) => i.supports(n))), !r))
          throw new D(5101, !1);
        return this._eventNameToPlugin.set(n, r), r;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(R(si), R(q));
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  ar = class {
    constructor(t) {
      this._doc = t;
    }
  },
  za = "ng-app-id",
  ah = (() => {
    class e {
      constructor(n, r, o, i = {}) {
        (this.doc = n),
          (this.appId = r),
          (this.nonce = o),
          (this.platformId = i),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = ir(i)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let r of n)
          this.changeUsageCount(r, 1) === 1 && this.onStyleAdded(r);
      }
      removeStyles(n) {
        for (let r of n)
          this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((r) => r.remove()), n.clear());
        for (let r of this.getAllStyles()) this.onStyleRemoved(r);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let r of this.getAllStyles()) this.addStyleToHost(n, r);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let r of this.hostNodes) this.addStyleToHost(r, n);
      }
      onStyleRemoved(n) {
        let r = this.styleRef;
        r.get(n)?.elements?.forEach((o) => o.remove()), r.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${za}="${this.appId}"]`);
        if (n?.length) {
          let r = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && r.set(o.textContent, o);
            }),
            r
          );
        }
        return null;
      }
      changeUsageCount(n, r) {
        let o = this.styleRef;
        if (o.has(n)) {
          let i = o.get(n);
          return (i.usage += r), i.usage;
        }
        return o.set(n, { usage: r, elements: [] }), r;
      }
      getStyleElement(n, r) {
        let o = this.styleNodesInDOM,
          i = o?.get(r);
        if (i?.parentNode === n) return o.delete(r), i.removeAttribute(za), i;
        {
          let s = this.doc.createElement("style");
          return (
            this.nonce && s.setAttribute("nonce", this.nonce),
            (s.textContent = r),
            this.platformIsServer && s.setAttribute(za, this.appId),
            n.appendChild(s),
            s
          );
        }
      }
      addStyleToHost(n, r) {
        let o = this.getStyleElement(n, r),
          i = this.styleRef,
          s = i.get(r)?.elements;
        s ? s.push(o) : i.set(r, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(R(pe), R($o), R(Da, 8), R(Xe));
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Ga = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  Qa = /%COMP%/g,
  ch = "%COMP%",
  B2 = `_nghost-${ch}`,
  $2 = `_ngcontent-${ch}`,
  H2 = !0,
  z2 = new w("", { providedIn: "root", factory: () => H2 });
function G2(e) {
  return $2.replace(Qa, e);
}
function Z2(e) {
  return B2.replace(Qa, e);
}
function lh(e, t) {
  return t.map((n) => n.replace(Qa, e));
}
var rh = (() => {
    class e {
      constructor(n, r, o, i, s, c, a, l = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = r),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = i),
          (this.doc = s),
          (this.platformId = c),
          (this.ngZone = a),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = ir(c)),
          (this.defaultRenderer = new cr(n, s, a, this.platformIsServer));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        this.platformIsServer &&
          r.encapsulation === We.ShadowDom &&
          (r = Z(C({}, r), { encapsulation: We.Emulated }));
        let o = this.getOrCreateRenderer(n, r);
        return (
          o instanceof ai
            ? o.applyToHost(n)
            : o instanceof lr && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, r) {
        let o = this.rendererByCompId,
          i = o.get(r.id);
        if (!i) {
          let s = this.doc,
            c = this.ngZone,
            a = this.eventManager,
            l = this.sharedStylesHost,
            u = this.removeStylesOnCompDestroy,
            d = this.platformIsServer;
          switch (r.encapsulation) {
            case We.Emulated:
              i = new ai(a, l, r, this.appId, u, s, c, d);
              break;
            case We.ShadowDom:
              return new Wa(a, l, n, r, s, c, this.nonce, d);
            default:
              i = new lr(a, l, r, u, s, c, d);
              break;
          }
          o.set(r.id, i);
        }
        return i;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(
            R(sh),
            R(ah),
            R($o),
            R(z2),
            R(pe),
            R(Xe),
            R(q),
            R(Da),
          );
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  cr = class {
    constructor(t, n, r, o) {
      (this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = o),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(t, n) {
      return n
        ? this.doc.createElementNS(Ga[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (oh(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (oh(t) ? t.content : t).insertBefore(n, r);
    }
    removeChild(t, n) {
      n.remove();
    }
    selectRootElement(t, n) {
      let r = typeof t == "string" ? this.doc.querySelector(t) : t;
      if (!r) throw new D(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, n, r, o) {
      if (o) {
        n = o + ":" + n;
        let i = Ga[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = Ga[r];
        o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
      } else t.removeAttribute(n);
    }
    addClass(t, n) {
      t.classList.add(n);
    }
    removeClass(t, n) {
      t.classList.remove(n);
    }
    setStyle(t, n, r, o) {
      o & (kt.DashCase | kt.Important)
        ? t.style.setProperty(n, r, o & kt.Important ? "important" : "")
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & kt.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r);
    }
    setValue(t, n) {
      t.nodeValue = n;
    }
    listen(t, n, r) {
      if (
        typeof t == "string" &&
        ((t = wn().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${n}`);
      return this.eventManager.addEventListener(
        t,
        n,
        this.decoratePreventDefault(r),
      );
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === "__ngUnwrap__") return t;
        (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function oh(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var Wa = class extends cr {
    constructor(t, n, r, o, i, s, c, a) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = lh(o.id, o.styles);
      for (let u of l) {
        let d = document.createElement("style");
        c && d.setAttribute("nonce", c),
          (d.textContent = u),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n);
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
    }
    removeChild(t, n) {
      return super.removeChild(null, n);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  lr = class extends cr {
    constructor(t, n, r, o, i, s, c, a) {
      super(t, i, s, c),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = a ? lh(a, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  ai = class extends lr {
    constructor(t, n, r, o, i, s, c, a) {
      let l = o + "-" + r.id;
      super(t, n, r, i, s, c, a, l),
        (this.contentAttr = G2(l)),
        (this.hostAttr = Z2(l));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  q2 = (() => {
    class e extends ar {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, r, o) {
        return (
          n.addEventListener(r, o, !1), () => this.removeEventListener(n, r, o)
        );
      }
      removeEventListener(n, r, o) {
        return n.removeEventListener(r, o);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(R(pe));
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  W2 = (() => {
    class e extends ar {
      constructor(n) {
        super(n), (this.delegate = g(Pf, { optional: !0 }));
      }
      supports(n) {
        return this.delegate ? this.delegate.supports(n) : !1;
      }
      addEventListener(n, r, o) {
        return this.delegate.addEventListener(n, r, o);
      }
      removeEventListener(n, r, o) {
        return this.delegate.removeEventListener(n, r, o);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(R(pe));
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  ih = ["alt", "control", "meta", "shift"],
  Y2 = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  Q2 = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  K2 = (() => {
    class e extends ar {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, r, o) {
        let i = e.parseEventName(r),
          s = e.eventCallback(i.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => wn().onAndCancel(n, i.domEventName, s));
      }
      static parseEventName(n) {
        let r = n.toLowerCase().split("."),
          o = r.shift();
        if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let i = e._normalizeKey(r.pop()),
          s = "",
          c = r.indexOf("code");
        if (
          (c > -1 && (r.splice(c, 1), (s = "code.")),
          ih.forEach((l) => {
            let u = r.indexOf(l);
            u > -1 && (r.splice(u, 1), (s += l + "."));
          }),
          (s += i),
          r.length != 0 || i.length === 0)
        )
          return null;
        let a = {};
        return (a.domEventName = o), (a.fullKey = s), a;
      }
      static matchEventFullKeyCode(n, r) {
        let o = Y2[n.key] || n.key,
          i = "";
        return (
          r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              ih.forEach((s) => {
                if (s !== o) {
                  let c = Q2[s];
                  c(n) && (i += s + ".");
                }
              }),
              (i += o),
              i === r)
        );
      }
      static eventCallback(n, r, o) {
        return (i) => {
          e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(R(pe));
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })();
function uh(e, t) {
  return Rf(C({ rootComponent: e }, J2(t)));
}
function J2(e) {
  return {
    appProviders: [...r3, ...(e?.providers ?? [])],
    platformProviders: n3,
  };
}
function X2() {
  qa.makeCurrent();
}
function e3() {
  return new at();
}
function t3() {
  return Cd(document), document;
}
var n3 = [
  { provide: Xe, useValue: qf },
  { provide: Ca, useValue: X2, multi: !0 },
  { provide: pe, useFactory: t3, deps: [] },
];
var r3 = [
  { provide: Po, useValue: "root" },
  { provide: at, useFactory: e3, deps: [] },
  { provide: si, useClass: q2, multi: !0, deps: [pe, q, Xe] },
  { provide: si, useClass: K2, multi: !0, deps: [pe] },
  { provide: si, useClass: W2, multi: !0 },
  rh,
  ah,
  sh,
  { provide: gn, useExisting: rh },
  { provide: ti, useClass: U2, deps: [] },
  [],
];
var dh = (() => {
  class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)(R(pe));
      };
    }
    static {
      this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
var Ya = (function (e) {
  return (
    (e[(e.NoHttpTransferCache = 0)] = "NoHttpTransferCache"),
    (e[(e.HttpTransferCacheOptions = 1)] = "HttpTransferCacheOptions"),
    (e[(e.I18nSupport = 2)] = "I18nSupport"),
    (e[(e.EventReplay = 3)] = "EventReplay"),
    e
  );
})(Ya || {});
function fh(...e) {
  let t = [],
    n = new Set(),
    r = n.has(Ya.HttpTransferCacheOptions);
  for (let { ɵproviders: o, ɵkind: i } of e) n.add(i), o.length && t.push(o);
  return Rt([[], kf(), n.has(Ya.NoHttpTransferCache) || r ? [] : nh({}), t]);
}
var _ = "primary",
  Sr = Symbol("RouteTitle"),
  tc = class {
    constructor(t) {
      this.params = t || {};
    }
    has(t) {
      return Object.prototype.hasOwnProperty.call(this.params, t);
    }
    get(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function _n(e) {
  return new tc(e);
}
function i3(e, t, n) {
  let r = n.path.split("/");
  if (
    r.length > e.length ||
    (n.pathMatch === "full" && (t.hasChildren() || r.length < e.length))
  )
    return null;
  let o = {};
  for (let i = 0; i < r.length; i++) {
    let s = r[i],
      c = e[i];
    if (s[0] === ":") o[s.substring(1)] = c;
    else if (s !== c.path) return null;
  }
  return { consumed: e.slice(0, r.length), posParams: o };
}
function s3(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; ++n) if (!tt(e[n], t[n])) return !1;
  return !0;
}
function tt(e, t) {
  let n = e ? nc(e) : void 0,
    r = t ? nc(t) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let o;
  for (let i = 0; i < n.length; i++)
    if (((o = n[i]), !Dh(e[o], t[o]))) return !1;
  return !0;
}
function nc(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function Dh(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1;
    let n = [...e].sort(),
      r = [...t].sort();
    return n.every((o, i) => r[i] === o);
  } else return e === t;
}
function wh(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function wt(e) {
  return Ki(e) ? e : nr(e) ? Y(Promise.resolve(e)) : M(e);
}
var a3 = { exact: bh, subset: Ih },
  Eh = { exact: c3, subset: l3, ignored: () => !0 };
function hh(e, t, n) {
  return (
    a3[n.paths](e.root, t.root, n.matrixParams) &&
    Eh[n.queryParams](e.queryParams, t.queryParams) &&
    !(n.fragment === "exact" && e.fragment !== t.fragment)
  );
}
function c3(e, t) {
  return tt(e, t);
}
function bh(e, t, n) {
  if (
    !Vt(e.segments, t.segments) ||
    !ui(e.segments, t.segments, n) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let r in t.children)
    if (!e.children[r] || !bh(e.children[r], t.children[r], n)) return !1;
  return !0;
}
function l3(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((n) => Dh(e[n], t[n]))
  );
}
function Ih(e, t, n) {
  return Mh(e, t, t.segments, n);
}
function Mh(e, t, n, r) {
  if (e.segments.length > n.length) {
    let o = e.segments.slice(0, n.length);
    return !(!Vt(o, n) || t.hasChildren() || !ui(o, n, r));
  } else if (e.segments.length === n.length) {
    if (!Vt(e.segments, n) || !ui(e.segments, n, r)) return !1;
    for (let o in t.children)
      if (!e.children[o] || !Ih(e.children[o], t.children[o], r)) return !1;
    return !0;
  } else {
    let o = n.slice(0, e.segments.length),
      i = n.slice(e.segments.length);
    return !Vt(e.segments, o) || !ui(e.segments, o, r) || !e.children[_]
      ? !1
      : Mh(e.children[_], t, i, r);
  }
}
function ui(e, t, n) {
  return t.every((r, o) => Eh[n](e[o].parameters, r.parameters));
}
var ut = class {
    constructor(t = new U([], {}), n = {}, r = null) {
      (this.root = t), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= _n(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return f3.serialize(this);
    }
  },
  U = class {
    constructor(t, n) {
      (this.segments = t),
        (this.children = n),
        (this.parent = null),
        Object.values(n).forEach((r) => (r.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return di(this);
    }
  },
  jt = class {
    constructor(t, n) {
      (this.path = t), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= _n(this.parameters)), this._parameterMap;
    }
    toString() {
      return _h(this);
    }
  };
function u3(e, t) {
  return Vt(e, t) && e.every((n, r) => tt(n.parameters, t[r].parameters));
}
function Vt(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path);
}
function d3(e, t) {
  let n = [];
  return (
    Object.entries(e.children).forEach(([r, o]) => {
      r === _ && (n = n.concat(t(o, r)));
    }),
    Object.entries(e.children).forEach(([r, o]) => {
      r !== _ && (n = n.concat(t(o, r)));
    }),
    n
  );
}
var Tc = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({
          token: e,
          factory: () => new mr(),
          providedIn: "root",
        });
      }
    }
    return e;
  })(),
  mr = class {
    parse(t) {
      let n = new oc(t);
      return new ut(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment(),
      );
    }
    serialize(t) {
      let n = `/${ur(t.root, !0)}`,
        r = g3(t.queryParams),
        o = typeof t.fragment == "string" ? `#${h3(t.fragment)}` : "";
      return `${n}${r}${o}`;
    }
  },
  f3 = new mr();
function di(e) {
  return e.segments.map((t) => _h(t)).join("/");
}
function ur(e, t) {
  if (!e.hasChildren()) return di(e);
  if (t) {
    let n = e.children[_] ? ur(e.children[_], !1) : "",
      r = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== _ && r.push(`${o}:${ur(i, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = d3(e, (r, o) =>
      o === _ ? [ur(e.children[_], !1)] : [`${o}:${ur(r, !1)}`],
    );
    return Object.keys(e.children).length === 1 && e.children[_] != null
      ? `${di(e)}/${n[0]}`
      : `${di(e)}/(${n.join("//")})`;
  }
}
function Sh(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function ci(e) {
  return Sh(e).replace(/%3B/gi, ";");
}
function h3(e) {
  return encodeURI(e);
}
function rc(e) {
  return Sh(e)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function fi(e) {
  return decodeURIComponent(e);
}
function ph(e) {
  return fi(e.replace(/\+/g, "%20"));
}
function _h(e) {
  return `${rc(e.path)}${p3(e.parameters)}`;
}
function p3(e) {
  return Object.entries(e)
    .map(([t, n]) => `;${rc(t)}=${rc(n)}`)
    .join("");
}
function g3(e) {
  let t = Object.entries(e)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((o) => `${ci(n)}=${ci(o)}`).join("&")
        : `${ci(n)}=${ci(r)}`,
    )
    .filter((n) => n);
  return t.length ? `?${t.join("&")}` : "";
}
var m3 = /^[^\/()?;#]+/;
function Ka(e) {
  let t = e.match(m3);
  return t ? t[0] : "";
}
var v3 = /^[^\/()?;=#]+/;
function y3(e) {
  let t = e.match(v3);
  return t ? t[0] : "";
}
var C3 = /^[^=?&#]+/;
function D3(e) {
  let t = e.match(C3);
  return t ? t[0] : "";
}
var w3 = /^[^&#]+/;
function E3(e) {
  let t = e.match(w3);
  return t ? t[0] : "";
}
var oc = class {
  constructor(t) {
    (this.url = t), (this.remaining = t);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new U([], {})
        : new U([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let t = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(t);
      while (this.consumeOptional("&"));
    return t;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let t = [];
    for (
      this.peekStartsWith("(") || t.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), t.push(this.parseSegment());
    let n = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (n = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith("(") && (r = this.parseParens(!1)),
      (t.length > 0 || Object.keys(n).length > 0) && (r[_] = new U(t, n)),
      r
    );
  }
  parseSegment() {
    let t = Ka(this.remaining);
    if (t === "" && this.peekStartsWith(";")) throw new D(4009, !1);
    return this.capture(t), new jt(fi(t), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(";"); ) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let n = y3(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = Ka(this.remaining);
      o && ((r = o), this.capture(r));
    }
    t[fi(n)] = fi(r);
  }
  parseQueryParam(t) {
    let n = D3(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let s = E3(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let o = ph(n),
      i = ph(r);
    if (t.hasOwnProperty(o)) {
      let s = t[o];
      Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
    } else t[o] = i;
  }
  parseParens(t) {
    let n = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let r = Ka(this.remaining),
        o = this.remaining[r.length];
      if (o !== "/" && o !== ")" && o !== ";") throw new D(4010, !1);
      let i;
      r.indexOf(":") > -1
        ? ((i = r.slice(0, r.indexOf(":"))), this.capture(i), this.capture(":"))
        : t && (i = _);
      let s = this.parseChildren();
      (n[i] = Object.keys(s).length === 1 ? s[_] : new U([], s)),
        this.consumeOptional("//");
    }
    return n;
  }
  peekStartsWith(t) {
    return this.remaining.startsWith(t);
  }
  consumeOptional(t) {
    return this.peekStartsWith(t)
      ? ((this.remaining = this.remaining.substring(t.length)), !0)
      : !1;
  }
  capture(t) {
    if (!this.consumeOptional(t)) throw new D(4011, !1);
  }
};
function Th(e) {
  return e.segments.length > 0 ? new U([], { [_]: e }) : e;
}
function xh(e) {
  let t = {};
  for (let [r, o] of Object.entries(e.children)) {
    let i = xh(o);
    if (r === _ && i.segments.length === 0 && i.hasChildren())
      for (let [s, c] of Object.entries(i.children)) t[s] = c;
    else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
  }
  let n = new U(e.segments, t);
  return b3(n);
}
function b3(e) {
  if (e.numberOfChildren === 1 && e.children[_]) {
    let t = e.children[_];
    return new U(e.segments.concat(t.segments), t.children);
  }
  return e;
}
function vr(e) {
  return e instanceof ut;
}
function I3(e, t, n = null, r = null) {
  let o = Nh(e);
  return Ah(o, t, n, r);
}
function Nh(e) {
  let t;
  function n(i) {
    let s = {};
    for (let a of i.children) {
      let l = n(a);
      s[a.outlet] = l;
    }
    let c = new U(i.url, s);
    return i === e && (t = c), c;
  }
  let r = n(e.root),
    o = Th(r);
  return t ?? o;
}
function Ah(e, t, n, r) {
  let o = e;
  for (; o.parent; ) o = o.parent;
  if (t.length === 0) return Ja(o, o, o, n, r);
  let i = M3(t);
  if (i.toRoot()) return Ja(o, o, new U([], {}), n, r);
  let s = S3(i, o, e),
    c = s.processChildren
      ? hr(s.segmentGroup, s.index, i.commands)
      : Rh(s.segmentGroup, s.index, i.commands);
  return Ja(o, s.segmentGroup, c, n, r);
}
function hi(e) {
  return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function yr(e) {
  return typeof e == "object" && e != null && e.outlets;
}
function Ja(e, t, n, r, o) {
  let i = {};
  r &&
    Object.entries(r).forEach(([a, l]) => {
      i[a] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let s;
  e === t ? (s = n) : (s = Oh(e, t, n));
  let c = Th(xh(s));
  return new ut(c, i, o);
}
function Oh(e, t, n) {
  let r = {};
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === t ? (r[o] = n) : (r[o] = Oh(i, t, n));
    }),
    new U(e.segments, r)
  );
}
var pi = class {
  constructor(t, n, r) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      t && r.length > 0 && hi(r[0]))
    )
      throw new D(4003, !1);
    let o = r.find(yr);
    if (o && o !== wh(r)) throw new D(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function M3(e) {
  if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
    return new pi(!0, 0, e);
  let t = 0,
    n = !1,
    r = e.reduce((o, i, s) => {
      if (typeof i == "object" && i != null) {
        if (i.outlets) {
          let c = {};
          return (
            Object.entries(i.outlets).forEach(([a, l]) => {
              c[a] = typeof l == "string" ? l.split("/") : l;
            }),
            [...o, { outlets: c }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != "string"
        ? [...o, i]
        : s === 0
          ? (i.split("/").forEach((c, a) => {
              (a == 0 && c === ".") ||
                (a == 0 && c === ""
                  ? (n = !0)
                  : c === ".."
                    ? t++
                    : c != "" && o.push(c));
            }),
            o)
          : [...o, i];
    }, []);
  return new pi(n, t, r);
}
var In = class {
  constructor(t, n, r) {
    (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
  }
};
function S3(e, t, n) {
  if (e.isAbsolute) return new In(t, !0, 0);
  if (!n) return new In(t, !1, NaN);
  if (n.parent === null) return new In(n, !0, 0);
  let r = hi(e.commands[0]) ? 0 : 1,
    o = n.segments.length - 1 + r;
  return _3(n, o, e.numberOfDoubleDots);
}
function _3(e, t, n) {
  let r = e,
    o = t,
    i = n;
  for (; i > o; ) {
    if (((i -= o), (r = r.parent), !r)) throw new D(4005, !1);
    o = r.segments.length;
  }
  return new In(r, !1, o - i);
}
function T3(e) {
  return yr(e[0]) ? e[0].outlets : { [_]: e };
}
function Rh(e, t, n) {
  if (((e ??= new U([], {})), e.segments.length === 0 && e.hasChildren()))
    return hr(e, t, n);
  let r = x3(e, t, n),
    o = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new U(e.segments.slice(0, r.pathIndex), {});
    return (
      (i.children[_] = new U(e.segments.slice(r.pathIndex), e.children)),
      hr(i, 0, o)
    );
  } else
    return r.match && o.length === 0
      ? new U(e.segments, {})
      : r.match && !e.hasChildren()
        ? ic(e, t, n)
        : r.match
          ? hr(e, 0, o)
          : ic(e, t, n);
}
function hr(e, t, n) {
  if (n.length === 0) return new U(e.segments, {});
  {
    let r = T3(n),
      o = {};
    if (
      Object.keys(r).some((i) => i !== _) &&
      e.children[_] &&
      e.numberOfChildren === 1 &&
      e.children[_].segments.length === 0
    ) {
      let i = hr(e.children[_], t, n);
      return new U(e.segments, i.children);
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (o[i] = Rh(e.children[i], t, s));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s);
      }),
      new U(e.segments, o)
    );
  }
}
function x3(e, t, n) {
  let r = 0,
    o = t,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length; ) {
    if (r >= n.length) return i;
    let s = e.segments[o],
      c = n[r];
    if (yr(c)) break;
    let a = `${c}`,
      l = r < n.length - 1 ? n[r + 1] : null;
    if (o > 0 && a === void 0) break;
    if (a && l && typeof l == "object" && l.outlets === void 0) {
      if (!mh(a, l, s)) return i;
      r += 2;
    } else {
      if (!mh(a, {}, s)) return i;
      r++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: r };
}
function ic(e, t, n) {
  let r = e.segments.slice(0, t),
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (yr(i)) {
      let a = N3(i.outlets);
      return new U(r, a);
    }
    if (o === 0 && hi(n[0])) {
      let a = e.segments[t];
      r.push(new jt(a.path, gh(n[0]))), o++;
      continue;
    }
    let s = yr(i) ? i.outlets[_] : `${i}`,
      c = o < n.length - 1 ? n[o + 1] : null;
    s && c && hi(c)
      ? (r.push(new jt(s, gh(c))), (o += 2))
      : (r.push(new jt(s, {})), o++);
  }
  return new U(r, {});
}
function N3(e) {
  let t = {};
  return (
    Object.entries(e).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (t[n] = ic(new U([], {}), 0, r));
    }),
    t
  );
}
function gh(e) {
  let t = {};
  return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
}
function mh(e, t, n) {
  return e == n.path && tt(t, n.parameters);
}
var pr = "imperative",
  ie = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = "NavigationStart"),
      (e[(e.NavigationEnd = 1)] = "NavigationEnd"),
      (e[(e.NavigationCancel = 2)] = "NavigationCancel"),
      (e[(e.NavigationError = 3)] = "NavigationError"),
      (e[(e.RoutesRecognized = 4)] = "RoutesRecognized"),
      (e[(e.ResolveStart = 5)] = "ResolveStart"),
      (e[(e.ResolveEnd = 6)] = "ResolveEnd"),
      (e[(e.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (e[(e.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (e[(e.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (e[(e.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (e[(e.ChildActivationStart = 11)] = "ChildActivationStart"),
      (e[(e.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (e[(e.ActivationStart = 13)] = "ActivationStart"),
      (e[(e.ActivationEnd = 14)] = "ActivationEnd"),
      (e[(e.Scroll = 15)] = "Scroll"),
      (e[(e.NavigationSkipped = 16)] = "NavigationSkipped"),
      e
    );
  })(ie || {}),
  ke = class {
    constructor(t, n) {
      (this.id = t), (this.url = n);
    }
  },
  Cr = class extends ke {
    constructor(t, n, r = "imperative", o = null) {
      super(t, n),
        (this.type = ie.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = o);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Ut = class extends ke {
    constructor(t, n, r) {
      super(t, n), (this.urlAfterRedirects = r), (this.type = ie.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  be = (function (e) {
    return (
      (e[(e.Redirect = 0)] = "Redirect"),
      (e[(e.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (e[(e.GuardRejected = 3)] = "GuardRejected"),
      e
    );
  })(be || {}),
  sc = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      e
    );
  })(sc || {}),
  lt = class extends ke {
    constructor(t, n, r, o) {
      super(t, n),
        (this.reason = r),
        (this.code = o),
        (this.type = ie.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Bt = class extends ke {
    constructor(t, n, r, o) {
      super(t, n),
        (this.reason = r),
        (this.code = o),
        (this.type = ie.NavigationSkipped);
    }
  },
  Dr = class extends ke {
    constructor(t, n, r, o) {
      super(t, n),
        (this.error = r),
        (this.target = o),
        (this.type = ie.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  gi = class extends ke {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = ie.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  ac = class extends ke {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = ie.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  cc = class extends ke {
    constructor(t, n, r, o, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.shouldActivate = i),
        (this.type = ie.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  lc = class extends ke {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = ie.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  uc = class extends ke {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = ie.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  dc = class {
    constructor(t) {
      (this.route = t), (this.type = ie.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  fc = class {
    constructor(t) {
      (this.route = t), (this.type = ie.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  hc = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ie.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  pc = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ie.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  gc = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ie.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  mc = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ie.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  };
var wr = class {},
  Tn = class {
    constructor(t, n) {
      (this.url = t), (this.navigationBehaviorOptions = n);
    }
  };
function A3(e, t) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = Va(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  );
}
function ze(e) {
  return e.outlet || _;
}
function O3(e, t) {
  let n = e.filter((r) => ze(r) === t);
  return n.push(...e.filter((r) => ze(r) !== t)), n;
}
function _r(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let t = e.parent; t; t = t.parent) {
    let n = t.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var vc = class {
    get injector() {
      return _r(this.route?.snapshot) ?? this.rootInjector;
    }
    set injector(t) {}
    constructor(t) {
      (this.rootInjector = t),
        (this.outlet = null),
        (this.route = null),
        (this.children = new Ei(this.rootInjector)),
        (this.attachRef = null);
    }
  },
  Ei = (() => {
    class e {
      constructor(n) {
        (this.rootInjector = n), (this.contexts = new Map());
      }
      onChildOutletCreated(n, r) {
        let o = this.getOrCreateContext(n);
        (o.outlet = r), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let r = this.getContext(n);
        r && ((r.outlet = null), (r.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let r = this.getContext(n);
        return (
          r || ((r = new vc(this.rootInjector)), this.contexts.set(n, r)), r
        );
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(R(Ne));
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  mi = class {
    constructor(t) {
      this._root = t;
    }
    get root() {
      return this._root.value;
    }
    parent(t) {
      let n = this.pathFromRoot(t);
      return n.length > 1 ? n[n.length - 2] : null;
    }
    children(t) {
      let n = yc(t, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(t) {
      let n = yc(t, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(t) {
      let n = Cc(t, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((o) => o.value).filter((o) => o !== t);
    }
    pathFromRoot(t) {
      return Cc(t, this._root).map((n) => n.value);
    }
  };
function yc(e, t) {
  if (e === t.value) return t;
  for (let n of t.children) {
    let r = yc(e, n);
    if (r) return r;
  }
  return null;
}
function Cc(e, t) {
  if (e === t.value) return [t];
  for (let n of t.children) {
    let r = Cc(e, n);
    if (r.length) return r.unshift(t), r;
  }
  return [];
}
var Ee = class {
  constructor(t, n) {
    (this.value = t), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function bn(e) {
  let t = {};
  return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
}
var vi = class extends mi {
  constructor(t, n) {
    super(t), (this.snapshot = n), xc(this, t);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Ph(e) {
  let t = R3(e),
    n = new oe([new jt("", {})]),
    r = new oe({}),
    o = new oe({}),
    i = new oe({}),
    s = new oe(""),
    c = new xn(n, r, i, s, o, _, e, t.root);
  return (c.snapshot = t.root), new vi(new Ee(c, []), t);
}
function R3(e) {
  let t = {},
    n = {},
    r = {},
    o = "",
    i = new Mn([], t, r, o, n, _, e, null, {});
  return new Ci("", new Ee(i, []));
}
var xn = class {
  constructor(t, n, r, o, i, s, c, a) {
    (this.urlSubject = t),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = c),
      (this._futureSnapshot = a),
      (this.title = this.dataSubject?.pipe(O((l) => l[Sr])) ?? M(void 0)),
      (this.url = t),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = o),
      (this.data = i);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(O((t) => _n(t)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(O((t) => _n(t)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function yi(e, t, n = "emptyOnly") {
  let r,
    { routeConfig: o } = e;
  return (
    t !== null &&
    (n === "always" ||
      o?.path === "" ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (r = {
          params: C(C({}, t.params), e.params),
          data: C(C({}, t.data), e.data),
          resolve: C(C(C(C({}, e.data), t.data), o?.data), e._resolvedData),
        })
      : (r = {
          params: C({}, e.params),
          data: C({}, e.data),
          resolve: C(C({}, e.data), e._resolvedData ?? {}),
        }),
    o && Fh(o) && (r.resolve[Sr] = o.title),
    r
  );
}
var Mn = class {
    get title() {
      return this.data?.[Sr];
    }
    constructor(t, n, r, o, i, s, c, a, l) {
      (this.url = t),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = c),
        (this.routeConfig = a),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= _n(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= _n(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let t = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${t}', path:'${n}')`;
    }
  },
  Ci = class extends mi {
    constructor(t, n) {
      super(n), (this.url = t), xc(this, n);
    }
    toString() {
      return kh(this._root);
    }
  };
function xc(e, t) {
  (t.value._routerState = e), t.children.forEach((n) => xc(e, n));
}
function kh(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(kh).join(", ")} } ` : "";
  return `${e.value}${t}`;
}
function Xa(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      n = e._futureSnapshot;
    (e.snapshot = n),
      tt(t.queryParams, n.queryParams) ||
        e.queryParamsSubject.next(n.queryParams),
      t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
      tt(t.params, n.params) || e.paramsSubject.next(n.params),
      s3(t.url, n.url) || e.urlSubject.next(n.url),
      tt(t.data, n.data) || e.dataSubject.next(n.data);
  } else
    (e.snapshot = e._futureSnapshot),
      e.dataSubject.next(e._futureSnapshot.data);
}
function Dc(e, t) {
  let n = tt(e.params, t.params) && u3(e.url, t.url),
    r = !e.parent != !t.parent;
  return n && !r && (!e.parent || Dc(e.parent, t.parent));
}
function Fh(e) {
  return typeof e.title == "string" || e.title === null;
}
var se = (() => {
    class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = _),
          (this.activateEvents = new ue()),
          (this.deactivateEvents = new ue()),
          (this.attachEvents = new ue()),
          (this.detachEvents = new ue()),
          (this.parentContexts = g(Ei)),
          (this.location = g(Ko)),
          (this.changeDetector = g(rr)),
          (this.inputBinder = g(Nc, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: r, previousValue: o } = n.name;
          if (r) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new D(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new D(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new D(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, r) {
        (this.activated = n),
          (this._activatedRoute = r),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, r) {
        if (this.isActivated) throw new D(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          s = n.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          a = new wc(n, c, o.injector);
        (this.activated = o.createComponent(s, {
          index: o.length,
          injector: a,
          environmentInjector: r,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵdir = oa({
          type: e,
          selectors: [["router-outlet"]],
          inputs: { name: "name" },
          outputs: {
            activateEvents: "activate",
            deactivateEvents: "deactivate",
            attachEvents: "attach",
            detachEvents: "detach",
          },
          exportAs: ["outlet"],
          standalone: !0,
          features: [Fo],
        });
      }
    }
    return e;
  })(),
  wc = class e {
    __ngOutletInjector(t) {
      return new e(this.route, this.childContexts, t);
    }
    constructor(t, n, r) {
      (this.route = t), (this.childContexts = n), (this.parent = r);
    }
    get(t, n) {
      return t === xn
        ? this.route
        : t === Ei
          ? this.childContexts
          : this.parent.get(t, n);
    }
  },
  Nc = new w("");
function P3(e, t, n) {
  let r = Er(e, t._root, n ? n._root : void 0);
  return new vi(r, t);
}
function Er(e, t, n) {
  if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = t.value;
    let o = k3(e, t, n);
    return new Ee(r, o);
  } else {
    if (e.shouldAttach(t.value)) {
      let i = e.retrieve(t.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((c) => Er(e, c))),
          s
        );
      }
    }
    let r = F3(t.value),
      o = t.children.map((i) => Er(e, i));
    return new Ee(r, o);
  }
}
function k3(e, t, n) {
  return t.children.map((r) => {
    for (let o of n.children)
      if (e.shouldReuseRoute(r.value, o.value.snapshot)) return Er(e, r, o);
    return Er(e, r);
  });
}
function F3(e) {
  return new xn(
    new oe(e.url),
    new oe(e.params),
    new oe(e.queryParams),
    new oe(e.fragment),
    new oe(e.data),
    e.outlet,
    e.component,
    e,
  );
}
var br = class {
    constructor(t, n) {
      (this.redirectTo = t), (this.navigationBehaviorOptions = n);
    }
  },
  Lh = "ngNavigationCancelingError";
function Di(e, t) {
  let { redirectTo: n, navigationBehaviorOptions: r } = vr(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    o = jh(!1, be.Redirect);
  return (o.url = n), (o.navigationBehaviorOptions = r), o;
}
function jh(e, t) {
  let n = new Error(`NavigationCancelingError: ${e || ""}`);
  return (n[Lh] = !0), (n.cancellationCode = t), n;
}
function L3(e) {
  return Vh(e) && vr(e.url);
}
function Vh(e) {
  return !!e && e[Lh];
}
var j3 = (e, t, n, r) =>
    O(
      (o) => (
        new Ec(t, o.targetRouterState, o.currentRouterState, n, r).activate(e),
        o
      ),
    ),
  Ec = class {
    constructor(t, n, r, o, i) {
      (this.routeReuseStrategy = t),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i);
    }
    activate(t) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(n, r, t),
        Xa(this.futureState.root),
        this.activateChildRoutes(n, r, t);
    }
    deactivateChildRoutes(t, n, r) {
      let o = bn(n);
      t.children.forEach((i) => {
        let s = i.value.outlet;
        this.deactivateRoutes(i, o[s], r), delete o[s];
      }),
        Object.values(o).forEach((i) => {
          this.deactivateRouteAndItsChildren(i, r);
        });
    }
    deactivateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if (o === i)
        if (o.component) {
          let s = r.getContext(o.outlet);
          s && this.deactivateChildRoutes(t, n, s.children);
        } else this.deactivateChildRoutes(t, n, r);
      else i && this.deactivateRouteAndItsChildren(n, r);
    }
    deactivateRouteAndItsChildren(t, n) {
      t.value.component &&
      this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, n)
        : this.deactivateRouteAndOutlet(t, n);
    }
    detachAndStoreRouteSubtree(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = bn(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          c = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: s,
          route: t,
          contexts: c,
        });
      }
    }
    deactivateRouteAndOutlet(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = bn(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(t, n, r) {
      let o = bn(n);
      t.children.forEach((i) => {
        this.activateRoutes(i, o[i.value.outlet], r),
          this.forwardEvent(new mc(i.value.snapshot));
      }),
        t.children.length && this.forwardEvent(new pc(t.value.snapshot));
    }
    activateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if ((Xa(o), o === i))
        if (o.component) {
          let s = r.getOrCreateContext(o.outlet);
          this.activateChildRoutes(t, n, s.children);
        } else this.activateChildRoutes(t, n, r);
      else if (o.component) {
        let s = r.getOrCreateContext(o.outlet);
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let c = this.routeReuseStrategy.retrieve(o.snapshot);
          this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(c.contexts),
            (s.attachRef = c.componentRef),
            (s.route = c.route.value),
            s.outlet && s.outlet.attach(c.componentRef, c.route.value),
            Xa(c.route.value),
            this.activateChildRoutes(t, null, s.children);
        } else
          (s.attachRef = null),
            (s.route = o),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(t, null, s.children);
      } else this.activateChildRoutes(t, null, r);
    }
  },
  wi = class {
    constructor(t) {
      (this.path = t), (this.route = this.path[this.path.length - 1]);
    }
  },
  Sn = class {
    constructor(t, n) {
      (this.component = t), (this.route = n);
    }
  };
function V3(e, t, n) {
  let r = e._root,
    o = t ? t._root : null;
  return dr(r, o, n, [r.value]);
}
function U3(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: e, guards: t };
}
function An(e, t) {
  let n = Symbol(),
    r = t.get(e, n);
  return r === n ? (typeof e == "function" && !iu(e) ? e : t.get(e)) : r;
}
function dr(
  e,
  t,
  n,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let i = bn(t);
  return (
    e.children.forEach((s) => {
      B3(s, i[s.value.outlet], n, r.concat([s.value]), o),
        delete i[s.value.outlet];
    }),
    Object.entries(i).forEach(([s, c]) => gr(c, n.getContext(s), o)),
    o
  );
}
function B3(
  e,
  t,
  n,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let i = e.value,
    s = t ? t.value : null,
    c = n ? n.getContext(e.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let a = $3(s, i, i.routeConfig.runGuardsAndResolvers);
    a
      ? o.canActivateChecks.push(new wi(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? dr(e, t, c ? c.children : null, r, o) : dr(e, t, n, r, o),
      a &&
        c &&
        c.outlet &&
        c.outlet.isActivated &&
        o.canDeactivateChecks.push(new Sn(c.outlet.component, s));
  } else
    s && gr(t, c, o),
      o.canActivateChecks.push(new wi(r)),
      i.component
        ? dr(e, null, c ? c.children : null, r, o)
        : dr(e, null, n, r, o);
  return o;
}
function $3(e, t, n) {
  if (typeof n == "function") return n(e, t);
  switch (n) {
    case "pathParamsChange":
      return !Vt(e.url, t.url);
    case "pathParamsOrQueryParamsChange":
      return !Vt(e.url, t.url) || !tt(e.queryParams, t.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Dc(e, t) || !tt(e.queryParams, t.queryParams);
    case "paramsChange":
    default:
      return !Dc(e, t);
  }
}
function gr(e, t, n) {
  let r = bn(e),
    o = e.value;
  Object.entries(r).forEach(([i, s]) => {
    o.component
      ? t
        ? gr(s, t.children.getContext(i), n)
        : gr(s, null, n)
      : gr(s, t, n);
  }),
    o.component
      ? t && t.outlet && t.outlet.isActivated
        ? n.canDeactivateChecks.push(new Sn(t.outlet.component, o))
        : n.canDeactivateChecks.push(new Sn(null, o))
      : n.canDeactivateChecks.push(new Sn(null, o));
}
function Tr(e) {
  return typeof e == "function";
}
function H3(e) {
  return typeof e == "boolean";
}
function z3(e) {
  return e && Tr(e.canLoad);
}
function G3(e) {
  return e && Tr(e.canActivate);
}
function Z3(e) {
  return e && Tr(e.canActivateChild);
}
function q3(e) {
  return e && Tr(e.canDeactivate);
}
function W3(e) {
  return e && Tr(e.canMatch);
}
function Uh(e) {
  return e instanceof rt || e?.name === "EmptyError";
}
var li = Symbol("INITIAL_VALUE");
function Nn() {
  return Me((e) =>
    qr(e.map((t) => t.pipe(ot(1), ns(li)))).pipe(
      O((t) => {
        for (let n of t)
          if (n !== !0) {
            if (n === li) return li;
            if (n === !1 || Y3(n)) return n;
          }
        return !0;
      }),
      Ie((t) => t !== li),
      ot(1),
    ),
  );
}
function Y3(e) {
  return vr(e) || e instanceof br;
}
function Q3(e, t) {
  return K((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = n;
    return s.length === 0 && i.length === 0
      ? M(Z(C({}, n), { guardsResult: !0 }))
      : K3(s, r, o, e).pipe(
          K((c) => (c && H3(c) ? J3(r, i, e, t) : M(c))),
          O((c) => Z(C({}, n), { guardsResult: c })),
        );
  });
}
function K3(e, t, n, r) {
  return Y(e).pipe(
    K((o) => rv(o.component, o.route, n, t, r)),
    Le((o) => o !== !0, !0),
  );
}
function J3(e, t, n, r) {
  return Y(t).pipe(
    Mt((o) =>
      Xt(
        ev(o.route.parent, r),
        X3(o.route, r),
        nv(e, o.path, n),
        tv(e, o.route, n),
      ),
    ),
    Le((o) => o !== !0, !0),
  );
}
function X3(e, t) {
  return e !== null && t && t(new gc(e)), M(!0);
}
function ev(e, t) {
  return e !== null && t && t(new hc(e)), M(!0);
}
function tv(e, t, n) {
  let r = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!r || r.length === 0) return M(!0);
  let o = r.map((i) =>
    Wr(() => {
      let s = _r(t) ?? n,
        c = An(i, s),
        a = G3(c) ? c.canActivate(t, e) : Ke(s, () => c(t, e));
      return wt(a).pipe(Le());
    }),
  );
  return M(o).pipe(Nn());
}
function nv(e, t, n) {
  let r = t[t.length - 1],
    i = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => U3(s))
      .filter((s) => s !== null)
      .map((s) =>
        Wr(() => {
          let c = s.guards.map((a) => {
            let l = _r(s.node) ?? n,
              u = An(a, l),
              d = Z3(u) ? u.canActivateChild(r, e) : Ke(l, () => u(r, e));
            return wt(d).pipe(Le());
          });
          return M(c).pipe(Nn());
        }),
      );
  return M(i).pipe(Nn());
}
function rv(e, t, n, r, o) {
  let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return M(!0);
  let s = i.map((c) => {
    let a = _r(t) ?? o,
      l = An(c, a),
      u = q3(l) ? l.canDeactivate(e, t, n, r) : Ke(a, () => l(e, t, n, r));
    return wt(u).pipe(Le());
  });
  return M(s).pipe(Nn());
}
function ov(e, t, n, r) {
  let o = t.canLoad;
  if (o === void 0 || o.length === 0) return M(!0);
  let i = o.map((s) => {
    let c = An(s, e),
      a = z3(c) ? c.canLoad(t, n) : Ke(e, () => c(t, n));
    return wt(a);
  });
  return M(i).pipe(Nn(), Bh(r));
}
function Bh(e) {
  return qi(
    J((t) => {
      if (typeof t != "boolean") throw Di(e, t);
    }),
    O((t) => t === !0),
  );
}
function iv(e, t, n, r) {
  let o = t.canMatch;
  if (!o || o.length === 0) return M(!0);
  let i = o.map((s) => {
    let c = An(s, e),
      a = W3(c) ? c.canMatch(t, n) : Ke(e, () => c(t, n));
    return wt(a);
  });
  return M(i).pipe(Nn(), Bh(r));
}
var Ir = class {
    constructor(t) {
      this.segmentGroup = t || null;
    }
  },
  Mr = class extends Error {
    constructor(t) {
      super(), (this.urlTree = t);
    }
  };
function En(e) {
  return Jt(new Ir(e));
}
function sv(e) {
  return Jt(new D(4e3, !1));
}
function av(e) {
  return Jt(jh(!1, be.GuardRejected));
}
var bc = class {
    constructor(t, n) {
      (this.urlSerializer = t), (this.urlTree = n);
    }
    lineralizeSegments(t, n) {
      let r = [],
        o = n.root;
      for (;;) {
        if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return M(r);
        if (o.numberOfChildren > 1 || !o.children[_])
          return sv(`${t.redirectTo}`);
        o = o.children[_];
      }
    }
    applyRedirectCommands(t, n, r, o, i) {
      if (typeof n != "string") {
        let c = n,
          {
            queryParams: a,
            fragment: l,
            routeConfig: u,
            url: d,
            outlet: m,
            params: p,
            data: y,
            title: x,
          } = o,
          z = Ke(i, () =>
            c({
              params: p,
              data: y,
              queryParams: a,
              fragment: l,
              routeConfig: u,
              url: d,
              outlet: m,
              title: x,
            }),
          );
        if (z instanceof ut) throw new Mr(z);
        n = z;
      }
      let s = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        t,
        r,
      );
      if (n[0] === "/") throw new Mr(s);
      return s;
    }
    applyRedirectCreateUrlTree(t, n, r, o) {
      let i = this.createSegmentGroup(t, n.root, r, o);
      return new ut(
        i,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment,
      );
    }
    createQueryParams(t, n) {
      let r = {};
      return (
        Object.entries(t).forEach(([o, i]) => {
          if (typeof i == "string" && i[0] === ":") {
            let c = i.substring(1);
            r[o] = n[c];
          } else r[o] = i;
        }),
        r
      );
    }
    createSegmentGroup(t, n, r, o) {
      let i = this.createSegments(t, n.segments, r, o),
        s = {};
      return (
        Object.entries(n.children).forEach(([c, a]) => {
          s[c] = this.createSegmentGroup(t, a, r, o);
        }),
        new U(i, s)
      );
    }
    createSegments(t, n, r, o) {
      return n.map((i) =>
        i.path[0] === ":"
          ? this.findPosParam(t, i, o)
          : this.findOrReturn(i, r),
      );
    }
    findPosParam(t, n, r) {
      let o = r[n.path.substring(1)];
      if (!o) throw new D(4001, !1);
      return o;
    }
    findOrReturn(t, n) {
      let r = 0;
      for (let o of n) {
        if (o.path === t.path) return n.splice(r), o;
        r++;
      }
      return t;
    }
  },
  Ic = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function cv(e, t, n, r, o) {
  let i = $h(e, t, n);
  return i.matched
    ? ((r = A3(t, r)),
      iv(r, t, n, o).pipe(O((s) => (s === !0 ? i : C({}, Ic)))))
    : M(i);
}
function $h(e, t, n) {
  if (t.path === "**") return lv(n);
  if (t.path === "")
    return t.pathMatch === "full" && (e.hasChildren() || n.length > 0)
      ? C({}, Ic)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (t.matcher || i3)(n, e, t);
  if (!o) return C({}, Ic);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([c, a]) => {
    i[c] = a.path;
  });
  let s =
    o.consumed.length > 0
      ? C(C({}, i), o.consumed[o.consumed.length - 1].parameters)
      : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: n.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function lv(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? wh(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function vh(e, t, n, r) {
  return n.length > 0 && fv(e, n, r)
    ? {
        segmentGroup: new U(t, dv(r, new U(n, e.children))),
        slicedSegments: [],
      }
    : n.length === 0 && hv(e, n, r)
      ? {
          segmentGroup: new U(e.segments, uv(e, n, r, e.children)),
          slicedSegments: n,
        }
      : { segmentGroup: new U(e.segments, e.children), slicedSegments: n };
}
function uv(e, t, n, r) {
  let o = {};
  for (let i of n)
    if (bi(e, t, i) && !r[ze(i)]) {
      let s = new U([], {});
      o[ze(i)] = s;
    }
  return C(C({}, r), o);
}
function dv(e, t) {
  let n = {};
  n[_] = t;
  for (let r of e)
    if (r.path === "" && ze(r) !== _) {
      let o = new U([], {});
      n[ze(r)] = o;
    }
  return n;
}
function fv(e, t, n) {
  return n.some((r) => bi(e, t, r) && ze(r) !== _);
}
function hv(e, t, n) {
  return n.some((r) => bi(e, t, r));
}
function bi(e, t, n) {
  return (e.hasChildren() || t.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function pv(e, t, n) {
  return t.length === 0 && !e.children[n];
}
var Mc = class {};
function gv(e, t, n, r, o, i, s = "emptyOnly") {
  return new Sc(e, t, n, r, o, s, i).recognize();
}
var mv = 31,
  Sc = class {
    constructor(t, n, r, o, i, s, c) {
      (this.injector = t),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = c),
        (this.applyRedirects = new bc(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(t) {
      return new D(4002, `'${t.segmentGroup}'`);
    }
    recognize() {
      let t = vh(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(t).pipe(
        O(({ children: n, rootSnapshot: r }) => {
          let o = new Ee(r, n),
            i = new Ci("", o),
            s = I3(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            { state: i, tree: s }
          );
        }),
      );
    }
    match(t) {
      let n = new Mn(
        [],
        Object.freeze({}),
        Object.freeze(C({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        _,
        this.rootComponentType,
        null,
        {},
      );
      return this.processSegmentGroup(this.injector, this.config, t, _, n).pipe(
        O((r) => ({ children: r, rootSnapshot: n })),
        ht((r) => {
          if (r instanceof Mr)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof Ir ? this.noMatchError(r) : r;
        }),
      );
    }
    processSegmentGroup(t, n, r, o, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(t, n, r, i)
        : this.processSegment(t, n, r, r.segments, o, !0, i).pipe(
            O((s) => (s instanceof Ee ? [s] : [])),
          );
    }
    processChildren(t, n, r, o) {
      let i = [];
      for (let s of Object.keys(r.children))
        s === "primary" ? i.unshift(s) : i.push(s);
      return Y(i).pipe(
        Mt((s) => {
          let c = r.children[s],
            a = O3(n, s);
          return this.processSegmentGroup(t, a, c, s, o);
        }),
        ts((s, c) => (s.push(...c), s)),
        pt(null),
        es(),
        K((s) => {
          if (s === null) return En(r);
          let c = Hh(s);
          return vv(c), M(c);
        }),
      );
    }
    processSegment(t, n, r, o, i, s, c) {
      return Y(n).pipe(
        Mt((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? t,
            n,
            a,
            r,
            o,
            i,
            s,
            c,
          ).pipe(
            ht((l) => {
              if (l instanceof Ir) return M(null);
              throw l;
            }),
          ),
        ),
        Le((a) => !!a),
        ht((a) => {
          if (Uh(a)) return pv(r, o, i) ? M(new Mc()) : En(r);
          throw a;
        }),
      );
    }
    processSegmentAgainstRoute(t, n, r, o, i, s, c, a) {
      return ze(r) !== s && (s === _ || !bi(o, i, r))
        ? En(o)
        : r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(t, o, r, i, s, a)
          : this.allowRedirects && c
            ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s, a)
            : En(o);
    }
    expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, c) {
      let {
        matched: a,
        parameters: l,
        consumedSegments: u,
        positionalParamSegments: d,
        remainingSegments: m,
      } = $h(n, o, i);
      if (!a) return En(n);
      typeof o.redirectTo == "string" &&
        o.redirectTo[0] === "/" &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > mv && (this.allowRedirects = !1));
      let p = new Mn(
          i,
          l,
          Object.freeze(C({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          yh(o),
          ze(o),
          o.component ?? o._loadedComponent ?? null,
          o,
          Ch(o),
        ),
        y = yi(p, c, this.paramsInheritanceStrategy);
      (p.params = Object.freeze(y.params)), (p.data = Object.freeze(y.data));
      let x = this.applyRedirects.applyRedirectCommands(
        u,
        o.redirectTo,
        d,
        p,
        t,
      );
      return this.applyRedirects
        .lineralizeSegments(o, x)
        .pipe(K((z) => this.processSegment(t, r, n, z.concat(m), s, !1, c)));
    }
    matchSegmentAgainstRoute(t, n, r, o, i, s) {
      let c = cv(n, r, o, t, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        c.pipe(
          Me((a) =>
            a.matched
              ? ((t = r._injector ?? t),
                this.getChildConfig(t, r, o).pipe(
                  Me(({ routes: l }) => {
                    let u = r._loadedInjector ?? t,
                      {
                        parameters: d,
                        consumedSegments: m,
                        remainingSegments: p,
                      } = a,
                      y = new Mn(
                        m,
                        d,
                        Object.freeze(C({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        yh(r),
                        ze(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        Ch(r),
                      ),
                      x = yi(y, s, this.paramsInheritanceStrategy);
                    (y.params = Object.freeze(x.params)),
                      (y.data = Object.freeze(x.data));
                    let { segmentGroup: z, slicedSegments: $ } = vh(n, m, p, l);
                    if ($.length === 0 && z.hasChildren())
                      return this.processChildren(u, l, z, y).pipe(
                        O((nt) => new Ee(y, nt)),
                      );
                    if (l.length === 0 && $.length === 0)
                      return M(new Ee(y, []));
                    let X = ze(r) === i;
                    return this.processSegment(
                      u,
                      l,
                      z,
                      $,
                      X ? _ : i,
                      !0,
                      y,
                    ).pipe(O((nt) => new Ee(y, nt instanceof Ee ? [nt] : [])));
                  }),
                ))
              : En(n),
          ),
        )
      );
    }
    getChildConfig(t, n, r) {
      return n.children
        ? M({ routes: n.children, injector: t })
        : n.loadChildren
          ? n._loadedRoutes !== void 0
            ? M({ routes: n._loadedRoutes, injector: n._loadedInjector })
            : ov(t, n, r, this.urlSerializer).pipe(
                K((o) =>
                  o
                    ? this.configLoader.loadChildren(t, n).pipe(
                        J((i) => {
                          (n._loadedRoutes = i.routes),
                            (n._loadedInjector = i.injector);
                        }),
                      )
                    : av(n),
                ),
              )
          : M({ routes: [], injector: t });
    }
  };
function vv(e) {
  e.sort((t, n) =>
    t.value.outlet === _
      ? -1
      : n.value.outlet === _
        ? 1
        : t.value.outlet.localeCompare(n.value.outlet),
  );
}
function yv(e) {
  let t = e.value.routeConfig;
  return t && t.path === "";
}
function Hh(e) {
  let t = [],
    n = new Set();
  for (let r of e) {
    if (!yv(r)) {
      t.push(r);
      continue;
    }
    let o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...r.children), n.add(o)) : t.push(r);
  }
  for (let r of n) {
    let o = Hh(r.children);
    t.push(new Ee(r.value, o));
  }
  return t.filter((r) => !n.has(r));
}
function yh(e) {
  return e.data || {};
}
function Ch(e) {
  return e.resolve || {};
}
function Cv(e, t, n, r, o, i) {
  return K((s) =>
    gv(e, t, n, r, s.extractedUrl, o, i).pipe(
      O(({ state: c, tree: a }) =>
        Z(C({}, s), { targetSnapshot: c, urlAfterRedirects: a }),
      ),
    ),
  );
}
function Dv(e, t) {
  return K((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: o },
    } = n;
    if (!o.length) return M(n);
    let i = new Set(o.map((a) => a.route)),
      s = new Set();
    for (let a of i) if (!s.has(a)) for (let l of zh(a)) s.add(l);
    let c = 0;
    return Y(s).pipe(
      Mt((a) =>
        i.has(a)
          ? wv(a, r, e, t)
          : ((a.data = yi(a, a.parent, e).resolve), M(void 0)),
      ),
      J(() => c++),
      tn(1),
      K((a) => (c === s.size ? M(n) : me)),
    );
  });
}
function zh(e) {
  let t = e.children.map((n) => zh(n)).flat();
  return [e, ...t];
}
function wv(e, t, n, r) {
  let o = e.routeConfig,
    i = e._resolve;
  return (
    o?.title !== void 0 && !Fh(o) && (i[Sr] = o.title),
    Ev(i, e, t, r).pipe(
      O(
        (s) => (
          (e._resolvedData = s), (e.data = yi(e, e.parent, n).resolve), null
        ),
      ),
    )
  );
}
function Ev(e, t, n, r) {
  let o = nc(e);
  if (o.length === 0) return M({});
  let i = {};
  return Y(o).pipe(
    K((s) =>
      bv(e[s], t, n, r).pipe(
        Le(),
        J((c) => {
          if (c instanceof br) throw Di(new mr(), c);
          i[s] = c;
        }),
      ),
    ),
    tn(1),
    Xi(i),
    ht((s) => (Uh(s) ? me : Jt(s))),
  );
}
function bv(e, t, n, r) {
  let o = _r(t) ?? r,
    i = An(e, o),
    s = i.resolve ? i.resolve(t, n) : Ke(o, () => i(t, n));
  return wt(s);
}
function ec(e) {
  return Me((t) => {
    let n = e(t);
    return n ? Y(n).pipe(O(() => t)) : M(t);
  });
}
var Gh = (() => {
    class e {
      buildTitle(n) {
        let r,
          o = n.root;
        for (; o !== void 0; )
          (r = this.getResolvedTitleForRoute(o) ?? r),
            (o = o.children.find((i) => i.outlet === _));
        return r;
      }
      getResolvedTitleForRoute(n) {
        return n.data[Sr];
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: () => g(Iv), providedIn: "root" });
      }
    }
    return e;
  })(),
  Iv = (() => {
    class e extends Gh {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let r = this.buildTitle(n);
        r !== void 0 && this.title.setTitle(r);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(R(dh));
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  Ac = new w("", { providedIn: "root", factory: () => ({}) }),
  Mv = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵcmp = ne({
          type: e,
          selectors: [["ng-component"]],
          standalone: !0,
          features: [re],
          decls: 1,
          vars: 0,
          template: function (r, o) {
            r & 1 && v(0, "router-outlet");
          },
          dependencies: [se],
          encapsulation: 2,
        });
      }
    }
    return e;
  })();
function Oc(e) {
  let t = e.children && e.children.map(Oc),
    n = t ? Z(C({}, e), { children: t }) : C({}, e);
  return (
    !n.component &&
      !n.loadComponent &&
      (t || n.loadChildren) &&
      n.outlet &&
      n.outlet !== _ &&
      (n.component = Mv),
    n
  );
}
var Rc = new w(""),
  Sv = (() => {
    class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = g(Ua));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return M(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let r = wt(n.loadComponent()).pipe(
            O(Zh),
            J((i) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = i);
            }),
            en(() => {
              this.componentLoaders.delete(n);
            }),
          ),
          o = new Kt(r, () => new le()).pipe(Qt());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, r) {
        if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
        if (r._loadedRoutes)
          return M({ routes: r._loadedRoutes, injector: r._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = _v(r, this.compiler, n, this.onLoadEndListener).pipe(
            en(() => {
              this.childrenLoaders.delete(r);
            }),
          ),
          s = new Kt(i, () => new le()).pipe(Qt());
        return this.childrenLoaders.set(r, s), s;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function _v(e, t, n, r) {
  return wt(e.loadChildren()).pipe(
    O(Zh),
    K((o) =>
      o instanceof qn || Array.isArray(o) ? M(o) : Y(t.compileModuleAsync(o)),
    ),
    O((o) => {
      r && r(e);
      let i,
        s,
        c = !1;
      return (
        Array.isArray(o)
          ? ((s = o), (c = !0))
          : ((i = o.create(n).injector),
            (s = i.get(Rc, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(Oc), injector: i }
      );
    }),
  );
}
function Tv(e) {
  return e && typeof e == "object" && "default" in e;
}
function Zh(e) {
  return Tv(e) ? e.default : e;
}
var Pc = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: () => g(xv), providedIn: "root" });
      }
    }
    return e;
  })(),
  xv = (() => {
    class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, r) {
        return n;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  Nv = new w("");
var Av = new w(""),
  Ov = (() => {
    class e {
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      constructor() {
        (this.currentNavigation = null),
          (this.currentTransition = null),
          (this.lastSuccessfulNavigation = null),
          (this.events = new le()),
          (this.transitionAbortSubject = new le()),
          (this.configLoader = g(Sv)),
          (this.environmentInjector = g(Ne)),
          (this.urlSerializer = g(Tc)),
          (this.rootContexts = g(Ei)),
          (this.location = g(or)),
          (this.inputBindingEnabled = g(Nc, { optional: !0 }) !== null),
          (this.titleStrategy = g(Gh)),
          (this.options = g(Ac, { optional: !0 }) || {}),
          (this.paramsInheritanceStrategy =
            this.options.paramsInheritanceStrategy || "emptyOnly"),
          (this.urlHandlingStrategy = g(Pc)),
          (this.createViewTransition = g(Nv, { optional: !0 })),
          (this.navigationErrorHandler = g(Av, { optional: !0 })),
          (this.navigationId = 0),
          (this.afterPreactivation = () => M(void 0)),
          (this.rootComponentType = null);
        let n = (o) => this.events.next(new dc(o)),
          r = (o) => this.events.next(new fc(o));
        (this.configLoader.onLoadEndListener = r),
          (this.configLoader.onLoadStartListener = n);
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(n) {
        let r = ++this.navigationId;
        this.transitions?.next(
          Z(C(C({}, this.transitions.value), n), { id: r }),
        );
      }
      setupNavigations(n, r, o) {
        return (
          (this.transitions = new oe({
            id: 0,
            currentUrlTree: r,
            currentRawUrl: r,
            extractedUrl: this.urlHandlingStrategy.extract(r),
            urlAfterRedirects: this.urlHandlingStrategy.extract(r),
            rawUrl: r,
            extras: {},
            resolve: () => {},
            reject: () => {},
            promise: Promise.resolve(!0),
            source: pr,
            restoredState: null,
            currentSnapshot: o.snapshot,
            targetSnapshot: null,
            currentRouterState: o,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
          })),
          this.transitions.pipe(
            Ie((i) => i.id !== 0),
            O((i) =>
              Z(C({}, i), {
                extractedUrl: this.urlHandlingStrategy.extract(i.rawUrl),
              }),
            ),
            Me((i) => {
              let s = !1,
                c = !1;
              return M(i).pipe(
                Me((a) => {
                  if (this.navigationId > i.id)
                    return (
                      this.cancelNavigationTransition(
                        i,
                        "",
                        be.SupersededByNewNavigation,
                      ),
                      me
                    );
                  (this.currentTransition = i),
                    (this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.rawUrl,
                      extractedUrl: a.extractedUrl,
                      targetBrowserUrl:
                        typeof a.extras.browserUrl == "string"
                          ? this.urlSerializer.parse(a.extras.browserUrl)
                          : a.extras.browserUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? Z(C({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                    });
                  let l =
                      !n.navigated ||
                      this.isUpdatingInternalState() ||
                      this.isUpdatedBrowserUrl(),
                    u = a.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                  if (!l && u !== "reload") {
                    let d = "";
                    return (
                      this.events.next(
                        new Bt(
                          a.id,
                          this.urlSerializer.serialize(a.rawUrl),
                          d,
                          sc.IgnoredSameUrlNavigation,
                        ),
                      ),
                      a.resolve(!1),
                      me
                    );
                  }
                  if (this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl))
                    return M(a).pipe(
                      Me((d) => {
                        let m = this.transitions?.getValue();
                        return (
                          this.events.next(
                            new Cr(
                              d.id,
                              this.urlSerializer.serialize(d.extractedUrl),
                              d.source,
                              d.restoredState,
                            ),
                          ),
                          m !== this.transitions?.getValue()
                            ? me
                            : Promise.resolve(d)
                        );
                      }),
                      Cv(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        n.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                      ),
                      J((d) => {
                        (i.targetSnapshot = d.targetSnapshot),
                          (i.urlAfterRedirects = d.urlAfterRedirects),
                          (this.currentNavigation = Z(
                            C({}, this.currentNavigation),
                            { finalUrl: d.urlAfterRedirects },
                          ));
                        let m = new gi(
                          d.id,
                          this.urlSerializer.serialize(d.extractedUrl),
                          this.urlSerializer.serialize(d.urlAfterRedirects),
                          d.targetSnapshot,
                        );
                        this.events.next(m);
                      }),
                    );
                  if (
                    l &&
                    this.urlHandlingStrategy.shouldProcessUrl(a.currentRawUrl)
                  ) {
                    let {
                        id: d,
                        extractedUrl: m,
                        source: p,
                        restoredState: y,
                        extras: x,
                      } = a,
                      z = new Cr(d, this.urlSerializer.serialize(m), p, y);
                    this.events.next(z);
                    let $ = Ph(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = i =
                        Z(C({}, a), {
                          targetSnapshot: $,
                          urlAfterRedirects: m,
                          extras: Z(C({}, x), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      (this.currentNavigation.finalUrl = m),
                      M(i)
                    );
                  } else {
                    let d = "";
                    return (
                      this.events.next(
                        new Bt(
                          a.id,
                          this.urlSerializer.serialize(a.extractedUrl),
                          d,
                          sc.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      a.resolve(!1),
                      me
                    );
                  }
                }),
                J((a) => {
                  let l = new ac(
                    a.id,
                    this.urlSerializer.serialize(a.extractedUrl),
                    this.urlSerializer.serialize(a.urlAfterRedirects),
                    a.targetSnapshot,
                  );
                  this.events.next(l);
                }),
                O(
                  (a) => (
                    (this.currentTransition = i =
                      Z(C({}, a), {
                        guards: V3(
                          a.targetSnapshot,
                          a.currentSnapshot,
                          this.rootContexts,
                        ),
                      })),
                    i
                  ),
                ),
                Q3(this.environmentInjector, (a) => this.events.next(a)),
                J((a) => {
                  if (
                    ((i.guardsResult = a.guardsResult),
                    a.guardsResult && typeof a.guardsResult != "boolean")
                  )
                    throw Di(this.urlSerializer, a.guardsResult);
                  let l = new cc(
                    a.id,
                    this.urlSerializer.serialize(a.extractedUrl),
                    this.urlSerializer.serialize(a.urlAfterRedirects),
                    a.targetSnapshot,
                    !!a.guardsResult,
                  );
                  this.events.next(l);
                }),
                Ie((a) =>
                  a.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(a, "", be.GuardRejected),
                      !1),
                ),
                ec((a) => {
                  if (a.guards.canActivateChecks.length)
                    return M(a).pipe(
                      J((l) => {
                        let u = new lc(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot,
                        );
                        this.events.next(u);
                      }),
                      Me((l) => {
                        let u = !1;
                        return M(l).pipe(
                          Dv(
                            this.paramsInheritanceStrategy,
                            this.environmentInjector,
                          ),
                          J({
                            next: () => (u = !0),
                            complete: () => {
                              u ||
                                this.cancelNavigationTransition(
                                  l,
                                  "",
                                  be.NoDataFromResolver,
                                );
                            },
                          }),
                        );
                      }),
                      J((l) => {
                        let u = new uc(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot,
                        );
                        this.events.next(u);
                      }),
                    );
                }),
                ec((a) => {
                  let l = (u) => {
                    let d = [];
                    u.routeConfig?.loadComponent &&
                      !u.routeConfig._loadedComponent &&
                      d.push(
                        this.configLoader.loadComponent(u.routeConfig).pipe(
                          J((m) => {
                            u.component = m;
                          }),
                          O(() => {}),
                        ),
                      );
                    for (let m of u.children) d.push(...l(m));
                    return d;
                  };
                  return qr(l(a.targetSnapshot.root)).pipe(pt(null), ot(1));
                }),
                ec(() => this.afterPreactivation()),
                Me(() => {
                  let { currentSnapshot: a, targetSnapshot: l } = i,
                    u = this.createViewTransition?.(
                      this.environmentInjector,
                      a.root,
                      l.root,
                    );
                  return u ? Y(u).pipe(O(() => i)) : M(i);
                }),
                O((a) => {
                  let l = P3(
                    n.routeReuseStrategy,
                    a.targetSnapshot,
                    a.currentRouterState,
                  );
                  return (
                    (this.currentTransition = i =
                      Z(C({}, a), { targetRouterState: l })),
                    (this.currentNavigation.targetRouterState = l),
                    i
                  );
                }),
                J(() => {
                  this.events.next(new wr());
                }),
                j3(
                  this.rootContexts,
                  n.routeReuseStrategy,
                  (a) => this.events.next(a),
                  this.inputBindingEnabled,
                ),
                ot(1),
                J({
                  next: (a) => {
                    (s = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new Ut(
                          a.id,
                          this.urlSerializer.serialize(a.extractedUrl),
                          this.urlSerializer.serialize(a.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(
                        a.targetRouterState.snapshot,
                      ),
                      a.resolve(!0);
                  },
                  complete: () => {
                    s = !0;
                  },
                }),
                rs(
                  this.transitionAbortSubject.pipe(
                    J((a) => {
                      throw a;
                    }),
                  ),
                ),
                en(() => {
                  !s &&
                    !c &&
                    this.cancelNavigationTransition(
                      i,
                      "",
                      be.SupersededByNewNavigation,
                    ),
                    this.currentTransition?.id === i.id &&
                      ((this.currentNavigation = null),
                      (this.currentTransition = null));
                }),
                ht((a) => {
                  if (((c = !0), Vh(a)))
                    this.events.next(
                      new lt(
                        i.id,
                        this.urlSerializer.serialize(i.extractedUrl),
                        a.message,
                        a.cancellationCode,
                      ),
                    ),
                      L3(a)
                        ? this.events.next(
                            new Tn(a.url, a.navigationBehaviorOptions),
                          )
                        : i.resolve(!1);
                  else {
                    let l = new Dr(
                      i.id,
                      this.urlSerializer.serialize(i.extractedUrl),
                      a,
                      i.targetSnapshot ?? void 0,
                    );
                    try {
                      let u = Ke(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(l),
                      );
                      if (u instanceof br) {
                        let { message: d, cancellationCode: m } = Di(
                          this.urlSerializer,
                          u,
                        );
                        this.events.next(
                          new lt(
                            i.id,
                            this.urlSerializer.serialize(i.extractedUrl),
                            d,
                            m,
                          ),
                        ),
                          this.events.next(
                            new Tn(u.redirectTo, u.navigationBehaviorOptions),
                          );
                      } else {
                        this.events.next(l);
                        let d = n.errorHandler(a);
                        i.resolve(!!d);
                      }
                    } catch (u) {
                      this.options.resolveNavigationPromiseOnError
                        ? i.resolve(!1)
                        : i.reject(u);
                    }
                  }
                  return me;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(n, r, o) {
        let i = new lt(
          n.id,
          this.urlSerializer.serialize(n.extractedUrl),
          r,
          o,
        );
        this.events.next(i), n.resolve(!1);
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let n = this.urlHandlingStrategy.extract(
            this.urlSerializer.parse(this.location.path(!0)),
          ),
          r =
            this.currentNavigation?.targetBrowserUrl ??
            this.currentNavigation?.extractedUrl;
        return (
          n.toString() !== r?.toString() &&
          !this.currentNavigation?.extras.skipLocationChange
        );
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function Rv(e) {
  return e !== pr;
}
var Pv = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: () => g(kv), providedIn: "root" });
      }
    }
    return e;
  })(),
  _c = class {
    shouldDetach(t) {
      return !1;
    }
    store(t, n) {}
    shouldAttach(t) {
      return !1;
    }
    retrieve(t) {
      return null;
    }
    shouldReuseRoute(t, n) {
      return t.routeConfig === n.routeConfig;
    }
  },
  kv = (() => {
    class e extends _c {
      static {
        this.ɵfac = (() => {
          let n;
          return function (o) {
            return (n || (n = ga(e)))(o || e);
          };
        })();
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  qh = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: () => g(Fv), providedIn: "root" });
      }
    }
    return e;
  })(),
  Fv = (() => {
    class e extends qh {
      constructor() {
        super(...arguments),
          (this.location = g(or)),
          (this.urlSerializer = g(Tc)),
          (this.options = g(Ac, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = g(Pc)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new ut()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Ph(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((r) => {
          r.type === "popstate" && n(r.url, r.state);
        });
      }
      handleRouterEvent(n, r) {
        if (n instanceof Cr) this.stateMemento = this.createStateMemento();
        else if (n instanceof Bt) this.rawUrlTree = r.initialUrl;
        else if (n instanceof gi) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !r.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(r.finalUrl, r.initialUrl);
            this.setBrowserUrl(r.targetBrowserUrl ?? o, r);
          }
        } else
          n instanceof wr
            ? ((this.currentUrlTree = r.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                r.finalUrl,
                r.initialUrl,
              )),
              (this.routerState = r.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                !r.extras.skipLocationChange &&
                this.setBrowserUrl(r.targetBrowserUrl ?? this.rawUrlTree, r))
            : n instanceof lt &&
                (n.code === be.GuardRejected ||
                  n.code === be.NoDataFromResolver)
              ? this.restoreHistory(r)
              : n instanceof Dr
                ? this.restoreHistory(r, !0)
                : n instanceof Ut &&
                  ((this.lastSuccessfulId = n.id),
                  (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, r) {
        let o = n instanceof ut ? this.urlSerializer.serialize(n) : n;
        if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
          let i = this.browserPageId,
            s = C(C({}, r.extras.state), this.generateNgRouterState(r.id, i));
          this.location.replaceState(o, "", s);
        } else {
          let i = C(
            C({}, r.extras.state),
            this.generateNgRouterState(r.id, this.browserPageId + 1),
          );
          this.location.go(o, "", i);
        }
      }
      restoreHistory(n, r = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            i = this.currentPageId - o;
          i !== 0
            ? this.location.historyGo(i)
            : this.currentUrlTree === n.finalUrl &&
              i === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree,
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(n, r) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: r }
          : { navigationId: n };
      }
      static {
        this.ɵfac = (() => {
          let n;
          return function (o) {
            return (n || (n = ga(e)))(o || e);
          };
        })();
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  fr = (function (e) {
    return (
      (e[(e.COMPLETE = 0)] = "COMPLETE"),
      (e[(e.FAILED = 1)] = "FAILED"),
      (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
      e
    );
  })(fr || {});
function Lv(e, t) {
  e.events
    .pipe(
      Ie(
        (n) =>
          n instanceof Ut ||
          n instanceof lt ||
          n instanceof Dr ||
          n instanceof Bt,
      ),
      O((n) =>
        n instanceof Ut || n instanceof Bt
          ? fr.COMPLETE
          : (
                n instanceof lt
                  ? n.code === be.Redirect ||
                    n.code === be.SupersededByNewNavigation
                  : !1
              )
            ? fr.REDIRECTING
            : fr.FAILED,
      ),
      Ie((n) => n !== fr.REDIRECTING),
      ot(1),
    )
    .subscribe(() => {
      t();
    });
}
function jv(e) {
  throw e;
}
var Vv = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  Uv = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Wh = (() => {
    class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.console = g(Jo)),
          (this.stateManager = g(qh)),
          (this.options = g(Ac, { optional: !0 }) || {}),
          (this.pendingTasks = g(Pt)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = g(Ov)),
          (this.urlSerializer = g(Tc)),
          (this.location = g(or)),
          (this.urlHandlingStrategy = g(Pc)),
          (this._events = new le()),
          (this.errorHandler = this.options.errorHandler || jv),
          (this.navigated = !1),
          (this.routeReuseStrategy = g(Pv)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = g(Rc, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!g(Nc, { optional: !0 })),
          (this.eventsSubscription = new W()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((r) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              i = this.navigationTransitions.currentNavigation;
            if (o !== null && i !== null) {
              if (
                (this.stateManager.handleRouterEvent(r, i),
                r instanceof lt &&
                  r.code !== be.Redirect &&
                  r.code !== be.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (r instanceof Ut) this.navigated = !0;
              else if (r instanceof Tn) {
                let s = r.navigationBehaviorOptions,
                  c = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl),
                  a = C(
                    {
                      browserUrl: o.extras.browserUrl,
                      info: o.extras.info,
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        o.extras.replaceUrl ||
                        this.urlUpdateStrategy === "eager" ||
                        Rv(o.source),
                    },
                    s,
                  );
                this.scheduleNavigation(c, pr, null, a, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            $v(r) && this._events.next(r);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              pr,
              this.stateManager.restoredState(),
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, r) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", r);
              }, 0);
            },
          );
      }
      navigateToSyncWithBrowser(n, r, o) {
        let i = { replaceUrl: !0 },
          s = o?.navigationId ? o : null;
        if (o) {
          let a = C({}, o);
          delete a.navigationId,
            delete a.ɵrouterPageId,
            Object.keys(a).length !== 0 && (i.state = a);
        }
        let c = this.parseUrl(n);
        this.scheduleNavigation(c, r, s, i);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(Oc)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, r = {}) {
        let {
            relativeTo: o,
            queryParams: i,
            fragment: s,
            queryParamsHandling: c,
            preserveFragment: a,
          } = r,
          l = a ? this.currentUrlTree.fragment : s,
          u = null;
        switch (c ?? this.options.defaultQueryParamsHandling) {
          case "merge":
            u = C(C({}, this.currentUrlTree.queryParams), i);
            break;
          case "preserve":
            u = this.currentUrlTree.queryParams;
            break;
          default:
            u = i || null;
        }
        u !== null && (u = this.removeEmptyProps(u));
        let d;
        try {
          let m = o ? o.snapshot : this.routerState.snapshot.root;
          d = Nh(m);
        } catch {
          (typeof n[0] != "string" || n[0][0] !== "/") && (n = []),
            (d = this.currentUrlTree.root);
        }
        return Ah(d, n, u, l ?? null);
      }
      navigateByUrl(n, r = { skipLocationChange: !1 }) {
        let o = vr(n) ? n : this.parseUrl(n),
          i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(i, pr, null, r);
      }
      navigate(n, r = { skipLocationChange: !1 }) {
        return Bv(n), this.navigateByUrl(this.createUrlTree(n, r), r);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, r) {
        let o;
        if (
          (r === !0 ? (o = C({}, Vv)) : r === !1 ? (o = C({}, Uv)) : (o = r),
          vr(n))
        )
          return hh(this.currentUrlTree, n, o);
        let i = this.parseUrl(n);
        return hh(this.currentUrlTree, i, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (r, [o, i]) => (i != null && (r[o] = i), r),
          {},
        );
      }
      scheduleNavigation(n, r, o, i, s) {
        if (this.disposed) return Promise.resolve(!1);
        let c, a, l;
        s
          ? ((c = s.resolve), (a = s.reject), (l = s.promise))
          : (l = new Promise((d, m) => {
              (c = d), (a = m);
            }));
        let u = this.pendingTasks.add();
        return (
          Lv(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(u));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: r,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: i,
            resolve: c,
            reject: a,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((d) => Promise.reject(d))
        );
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function Bv(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new D(4008, !1);
}
function $v(e) {
  return !(e instanceof wr) && !(e instanceof Tn);
}
var Hv = new w("");
function Yh(e, ...t) {
  return Rt([
    { provide: Rc, multi: !0, useValue: e },
    [],
    { provide: xn, useFactory: zv, deps: [Wh] },
    { provide: Dn, multi: !0, useFactory: Gv },
    t.map((n) => n.ɵproviders),
  ]);
}
function zv(e) {
  return e.routerState.root;
}
function Gv() {
  let e = g(st);
  return (t) => {
    let n = e.get(et);
    if (t !== n.components[0]) return;
    let r = e.get(Wh),
      o = e.get(Zv);
    e.get(qv) === 1 && r.initialNavigation(),
      e.get(Wv, null, N.Optional)?.setUpPreloading(),
      e.get(Hv, null, N.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe());
  };
}
var Zv = new w("", { factory: () => new le() }),
  qv = new w("", { providedIn: "root", factory: () => 1 });
var Wv = new w("");
var Yv = (e, t) => t.title,
  Qv = () => ({ title: "Explore the Docs", link: "https://angular.dev" }),
  Kv = () => ({
    title: "Learn with Tutorials",
    link: "https://angular.dev/tutorials",
  }),
  Jv = () => ({ title: "CLI Docs", link: "https://angular.dev/tools/cli" }),
  Xv = () => ({
    title: "Angular Language Service",
    link: "https://angular.dev/tools/language-service",
  }),
  e5 = () => ({
    title: "Angular DevTools",
    link: "https://angular.dev/tools/devtools",
  }),
  t5 = (e, t, n, r, o) => [e, t, n, r, o];
function n5(e, t) {
  if (
    (e & 1 &&
      (f(0, "a", 21)(1, "span"),
      E(2),
      h(),
      A(),
      f(3, "svg", 32),
      v(4, "path", 33),
      h()()),
    e & 2)
  ) {
    let n = t.$implicit;
    De("href", n.link, Ae), G(2), we(n.title);
  }
}
var Ii = class e {
  title = "Home";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = ne({
    type: e,
    selectors: [["home"]],
    standalone: !0,
    features: [re],
    decls: 41,
    vars: 12,
    consts: [
      [1, "main"],
      [1, "content"],
      [1, "left-side"],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 982 239",
        "fill",
        "none",
        1,
        "angular-logo",
      ],
      ["clip-path", "url(#a)"],
      [
        "fill",
        "url(#b)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "fill",
        "url(#c)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "id",
        "c",
        "cx",
        "0",
        "cy",
        "0",
        "r",
        "1",
        "gradientTransform",
        "rotate(118.122 171.182 60.81) scale(205.794)",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#FF41F8"],
      ["offset", ".707", "stop-color", "#FF41F8", "stop-opacity", ".5"],
      ["offset", "1", "stop-color", "#FF41F8", "stop-opacity", "0"],
      [
        "id",
        "b",
        "x1",
        "0",
        "x2",
        "982",
        "y1",
        "192",
        "y2",
        "192",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#F0060B"],
      ["offset", "0", "stop-color", "#F0070C"],
      ["offset", ".526", "stop-color", "#CC26D5"],
      ["offset", "1", "stop-color", "#7702FF"],
      ["id", "a"],
      ["fill", "#fff", "d", "M0 0h982v239H0z"],
      ["role", "separator", "aria-label", "Divider", 1, "divider"],
      [1, "right-side"],
      [1, "pill-group"],
      ["target", "_blank", "rel", "noopener", 1, "pill", 3, "href"],
      [1, "social-links"],
      [
        "href",
        "https://github.com/angular/angular",
        "aria-label",
        "Github",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "25",
        "height",
        "24",
        "viewBox",
        "0 0 25 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Github",
      ],
      [
        "d",
        "M12.3047 0C5.50634 0 0 5.50942 0 12.3047C0 17.7423 3.52529 22.3535 8.41332 23.9787C9.02856 24.0946 9.25414 23.7142 9.25414 23.3871C9.25414 23.0949 9.24389 22.3207 9.23876 21.2953C5.81601 22.0377 5.09414 19.6444 5.09414 19.6444C4.53427 18.2243 3.72524 17.8449 3.72524 17.8449C2.61064 17.082 3.81137 17.0973 3.81137 17.0973C5.04697 17.1835 5.69604 18.3647 5.69604 18.3647C6.79321 20.2463 8.57636 19.7029 9.27978 19.3881C9.39052 18.5924 9.70736 18.0499 10.0591 17.7423C7.32641 17.4347 4.45429 16.3765 4.45429 11.6618C4.45429 10.3185 4.9311 9.22133 5.72065 8.36C5.58222 8.04931 5.16694 6.79833 5.82831 5.10337C5.82831 5.10337 6.85883 4.77319 9.2121 6.36459C10.1965 6.09082 11.2424 5.95546 12.2883 5.94931C13.3342 5.95546 14.3801 6.09082 15.3644 6.36459C17.7023 4.77319 18.7328 5.10337 18.7328 5.10337C19.3942 6.79833 18.9789 8.04931 18.8559 8.36C19.6403 9.22133 20.1171 10.3185 20.1171 11.6618C20.1171 16.3888 17.2409 17.4296 14.5031 17.7321C14.9338 18.1012 15.3337 18.8559 15.3337 20.0084C15.3337 21.6552 15.3183 22.978 15.3183 23.3779C15.3183 23.7009 15.5336 24.0854 16.1642 23.9623C21.0871 22.3484 24.6094 17.7341 24.6094 12.3047C24.6094 5.50942 19.0999 0 12.3047 0Z",
      ],
      [
        "href",
        "https://twitter.com/angular",
        "aria-label",
        "Twitter",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "24",
        "height",
        "24",
        "viewBox",
        "0 0 24 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Twitter",
      ],
      [
        "d",
        "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      ],
      [
        "href",
        "https://www.youtube.com/channel/UCbn1OgGei-DV7aSRo_HaAiw",
        "aria-label",
        "Youtube",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "29",
        "height",
        "20",
        "viewBox",
        "0 0 29 20",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Youtube",
      ],
      [
        "fill-rule",
        "evenodd",
        "clip-rule",
        "evenodd",
        "d",
        "M27.4896 1.52422C27.9301 1.96749 28.2463 2.51866 28.4068 3.12258C29.0004 5.35161 29.0004 10 29.0004 10C29.0004 10 29.0004 14.6484 28.4068 16.8774C28.2463 17.4813 27.9301 18.0325 27.4896 18.4758C27.0492 18.9191 26.5 19.2389 25.8972 19.4032C23.6778 20 14.8068 20 14.8068 20C14.8068 20 5.93586 20 3.71651 19.4032C3.11363 19.2389 2.56449 18.9191 2.12405 18.4758C1.68361 18.0325 1.36732 17.4813 1.20683 16.8774C0.613281 14.6484 0.613281 10 0.613281 10C0.613281 10 0.613281 5.35161 1.20683 3.12258C1.36732 2.51866 1.68361 1.96749 2.12405 1.52422C2.56449 1.08095 3.11363 0.76113 3.71651 0.596774C5.93586 0 14.8068 0 14.8068 0C14.8068 0 23.6778 0 25.8972 0.596774C26.5 0.76113 27.0492 1.08095 27.4896 1.52422ZM19.3229 10L11.9036 5.77905V14.221L19.3229 10Z",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "height",
        "14",
        "viewBox",
        "0 -960 960 960",
        "width",
        "14",
        "fill",
        "currentColor",
      ],
      [
        "d",
        "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (f(0, "main", 0)(1, "div", 1)(2, "div", 2)(3, "div"),
        E(4, "Home"),
        h(),
        A(),
        f(5, "svg", 3)(6, "g", 4),
        v(7, "path", 5)(8, "path", 6),
        h(),
        f(9, "defs")(10, "radialGradient", 7),
        v(11, "stop", 8)(12, "stop", 9)(13, "stop", 10),
        h(),
        f(14, "linearGradient", 11),
        v(15, "stop", 12)(16, "stop", 13)(17, "stop", 14)(18, "stop", 15),
        h(),
        f(19, "clipPath", 16),
        v(20, "path", 17),
        h()()(),
        j(),
        f(21, "h1"),
        E(22),
        h(),
        f(23, "p"),
        E(24, "Congratulations! Your app is running. \u{1F389}"),
        h()(),
        v(25, "div", 18),
        f(26, "div", 19)(27, "div", 20),
        Oe(28, n5, 5, 2, "a", 21, Yv),
        h(),
        f(30, "div", 22)(31, "a", 23),
        A(),
        f(32, "svg", 24),
        v(33, "path", 25),
        h()(),
        j(),
        f(34, "a", 26),
        A(),
        f(35, "svg", 27),
        v(36, "path", 28),
        h()(),
        j(),
        f(37, "a", 29),
        A(),
        f(38, "svg", 30),
        v(39, "path", 31),
        h()()()()()(),
        j(),
        v(40, "router-outlet")),
        n & 2 &&
          (G(22),
          he("Hello, ", r.title, ""),
          G(6),
          Re(Pe(6, t5, P(1, Qv), P(2, Kv), P(3, Jv), P(4, Xv), P(5, e5))));
    },
    dependencies: [se],
    styles: [
      `[_nghost-%COMP%] {
    --bright-blue: oklch(51.01% 0.274 263.83);
    --electric-violet: oklch(53.18% 0.28 296.97);
    --french-violet: oklch(47.66% 0.246 305.88);
    --vivid-pink: oklch(69.02% 0.277 332.77);
    --hot-red: oklch(61.42% 0.238 15.34);
    --orange-red: oklch(63.32% 0.24 31.68);

    --gray-900: oklch(19.37% 0.006 300.98);
    --gray-700: oklch(36.98% 0.014 302.71);
    --gray-400: oklch(70.9% 0.015 304.04);

    --red-to-pink-to-purple-vertical-gradient: linear-gradient(
      180deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --red-to-pink-to-purple-horizontal-gradient: linear-gradient(
      90deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --pill-accent: var(--bright-blue);

    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1[_ngcontent-%COMP%] {
    font-size: 3.125rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    letter-spacing: -0.125rem;
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  p[_ngcontent-%COMP%] {
    margin: 0;
    color: var(--gray-700);
  }

  main[_ngcontent-%COMP%] {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: inherit;
    position: relative;
  }

  .angular-logo[_ngcontent-%COMP%] {
    max-width: 9.2rem;
  }

  .content[_ngcontent-%COMP%] {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 700px;
    margin-bottom: 3rem;
  }

  .content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    margin-top: 1.75rem;
  }

  .content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
    margin-top: 1.5rem;
  }

  .divider[_ngcontent-%COMP%] {
    width: 1px;
    background: var(--red-to-pink-to-purple-vertical-gradient);
    margin-inline: 0.5rem;
  }

  .pill-group[_ngcontent-%COMP%] {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .pill[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    --pill-accent: var(--bright-blue);
    background: color-mix(in srgb, var(--pill-accent) 5%, transparent);
    color: var(--pill-accent);
    padding-inline: 0.75rem;
    padding-block: 0.375rem;
    border-radius: 2.75rem;
    border: 0;
    transition: background 0.3s ease;
    font-family: var(--inter-font);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4rem;
    letter-spacing: -0.00875rem;
    text-decoration: none;
  }

  .pill[_ngcontent-%COMP%]:hover {
    background: color-mix(in srgb, var(--pill-accent) 15%, transparent);
  }

  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 1) {
    --pill-accent: var(--bright-blue);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 2) {
    --pill-accent: var(--french-violet);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 3), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 4), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 5) {
    --pill-accent: var(--hot-red);
  }

  .pill-group[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
    margin-inline-start: 0.25rem;
  }

  .social-links[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    gap: 0.73rem;
    margin-top: 1.5rem;
  }

  .social-links[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    transition: fill 0.3s ease;
    fill: var(--gray-400);
  }

  .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    fill: var(--gray-900);
  }

  @media screen and (max-width: 650px) {
    .content[_ngcontent-%COMP%] {
      flex-direction: column;
      width: max-content;
    }

    .divider[_ngcontent-%COMP%] {
      height: 1px;
      width: 100%;
      background: var(--red-to-pink-to-purple-horizontal-gradient);
      margin-block: 1.5rem;
    }
  }`,
    ],
  });
};
var Mi = class e {
  title = "Login";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = ne({
    type: e,
    selectors: [["login"]],
    standalone: !0,
    features: [re],
    decls: 24,
    vars: 0,
    consts: [
      [1, "main"],
      [1, "text-center"],
      [1, "form-signin"],
      [
        "src",
        "/docs/5.0/assets/brand/bootstrap-logo.svg",
        "alt",
        "",
        "width",
        "72",
        "height",
        "57",
        1,
        "mb-4",
      ],
      [1, "h3", "mb-3", "fw-normal"],
      [1, "form-floating"],
      [
        "type",
        "email",
        "id",
        "floatingInput",
        "placeholder",
        "name@example.com",
        1,
        "form-control",
      ],
      ["for", "floatingInput"],
      [
        "type",
        "password",
        "id",
        "floatingPassword",
        "placeholder",
        "Password",
        1,
        "form-control",
      ],
      ["for", "floatingPassword"],
      [1, "checkbox", "mb-3"],
      ["type", "checkbox", "value", "remember-me"],
      ["type", "submit", 1, "w-100", "btn", "btn-lg", "btn-primary"],
      [1, "mt-5", "mb-3", "text-muted"],
    ],
    template: function (n, r) {
      n & 1 &&
        (f(0, "main", 0)(1, "body", 1)(2, "main", 2)(3, "form"),
        v(4, "img", 3),
        f(5, "h1", 4),
        E(6, "Please sign in"),
        h(),
        f(7, "div", 5),
        v(8, "input", 6),
        f(9, "label", 7),
        E(10, "Email address"),
        h()(),
        f(11, "div", 5),
        v(12, "input", 8),
        f(13, "label", 9),
        E(14, "Password"),
        h()(),
        f(15, "div", 10)(16, "label"),
        v(17, "input", 11),
        E(18, " Remember me "),
        h()(),
        f(19, "button", 12),
        E(20, "Sign in"),
        h(),
        f(21, "p", 13),
        E(22, "\xA9 2017\u20132021"),
        h()()()()(),
        v(23, "router-outlet"));
    },
    dependencies: [se],
    styles: [
      `h1[_ngcontent-%COMP%] {
    font-size: 3.125rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    letter-spacing: -0.125rem;
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  p[_ngcontent-%COMP%] {
    margin: 0;
    color: var(--gray-700);
  }

  main[_ngcontent-%COMP%] {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: inherit;
    position: relative;
  }

  .angular-logo[_ngcontent-%COMP%] {
    max-width: 9.2rem;
  }

  .content[_ngcontent-%COMP%] {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 700px;
    margin-bottom: 3rem;
  }

  .content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    margin-top: 1.75rem;
  }

  .content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
    margin-top: 1.5rem;
  }

  .divider[_ngcontent-%COMP%] {
    width: 1px;
    background: var(--red-to-pink-to-purple-vertical-gradient);
    margin-inline: 0.5rem;
  }

  .pill-group[_ngcontent-%COMP%] {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .pill[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    --pill-accent: var(--bright-blue);
    background: color-mix(in srgb, var(--pill-accent) 5%, transparent);
    color: var(--pill-accent);
    padding-inline: 0.75rem;
    padding-block: 0.375rem;
    border-radius: 2.75rem;
    border: 0;
    transition: background 0.3s ease;
    font-family: var(--inter-font);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4rem;
    letter-spacing: -0.00875rem;
    text-decoration: none;
  }

  .pill[_ngcontent-%COMP%]:hover {
    background: color-mix(in srgb, var(--pill-accent) 15%, transparent);
  }

  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 1) {
    --pill-accent: var(--bright-blue);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 2) {
    --pill-accent: var(--french-violet);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 3), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 4), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 5) {
    --pill-accent: var(--hot-red);
  }

  .pill-group[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
    margin-inline-start: 0.25rem;
  }

  .social-links[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    gap: 0.73rem;
    margin-top: 1.5rem;
  }

  .social-links[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    transition: fill 0.3s ease;
    fill: var(--gray-400);
  }

  .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    fill: var(--gray-900);
  }

  @media screen and (max-width: 650px) {
    .content[_ngcontent-%COMP%] {
      flex-direction: column;
      width: max-content;
    }

    .divider[_ngcontent-%COMP%] {
      height: 1px;
      width: 100%;
      background: var(--red-to-pink-to-purple-horizontal-gradient);
      margin-block: 1.5rem;
    }
  }`,
    ],
  });
};
var r5 = (e, t) => t.title,
  o5 = () => ({ title: "Explore the Docs", link: "https://angular.dev" }),
  i5 = () => ({
    title: "Learn with Tutorials",
    link: "https://angular.dev/tutorials",
  }),
  s5 = () => ({ title: "CLI Docs", link: "https://angular.dev/tools/cli" }),
  a5 = () => ({
    title: "Angular Language Service",
    link: "https://angular.dev/tools/language-service",
  }),
  c5 = () => ({
    title: "Angular DevTools",
    link: "https://angular.dev/tools/devtools",
  }),
  l5 = (e, t, n, r, o) => [e, t, n, r, o];
function u5(e, t) {
  if (
    (e & 1 &&
      (f(0, "a", 21)(1, "span"),
      E(2),
      h(),
      A(),
      f(3, "svg", 32),
      v(4, "path", 33),
      h()()),
    e & 2)
  ) {
    let n = t.$implicit;
    De("href", n.link, Ae), G(2), we(n.title);
  }
}
var Si = class e {
  title = "Cliente";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = ne({
    type: e,
    selectors: [["cliente"]],
    standalone: !0,
    features: [re],
    decls: 41,
    vars: 12,
    consts: [
      [1, "main"],
      [1, "content"],
      [1, "left-side"],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 982 239",
        "fill",
        "none",
        1,
        "angular-logo",
      ],
      ["clip-path", "url(#a)"],
      [
        "fill",
        "url(#b)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "fill",
        "url(#c)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "id",
        "c",
        "cx",
        "0",
        "cy",
        "0",
        "r",
        "1",
        "gradientTransform",
        "rotate(118.122 171.182 60.81) scale(205.794)",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#FF41F8"],
      ["offset", ".707", "stop-color", "#FF41F8", "stop-opacity", ".5"],
      ["offset", "1", "stop-color", "#FF41F8", "stop-opacity", "0"],
      [
        "id",
        "b",
        "x1",
        "0",
        "x2",
        "982",
        "y1",
        "192",
        "y2",
        "192",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#F0060B"],
      ["offset", "0", "stop-color", "#F0070C"],
      ["offset", ".526", "stop-color", "#CC26D5"],
      ["offset", "1", "stop-color", "#7702FF"],
      ["id", "a"],
      ["fill", "#fff", "d", "M0 0h982v239H0z"],
      ["role", "separator", "aria-label", "Divider", 1, "divider"],
      [1, "right-side"],
      [1, "pill-group"],
      ["target", "_blank", "rel", "noopener", 1, "pill", 3, "href"],
      [1, "social-links"],
      [
        "href",
        "https://github.com/angular/angular",
        "aria-label",
        "Github",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "25",
        "height",
        "24",
        "viewBox",
        "0 0 25 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Github",
      ],
      [
        "d",
        "M12.3047 0C5.50634 0 0 5.50942 0 12.3047C0 17.7423 3.52529 22.3535 8.41332 23.9787C9.02856 24.0946 9.25414 23.7142 9.25414 23.3871C9.25414 23.0949 9.24389 22.3207 9.23876 21.2953C5.81601 22.0377 5.09414 19.6444 5.09414 19.6444C4.53427 18.2243 3.72524 17.8449 3.72524 17.8449C2.61064 17.082 3.81137 17.0973 3.81137 17.0973C5.04697 17.1835 5.69604 18.3647 5.69604 18.3647C6.79321 20.2463 8.57636 19.7029 9.27978 19.3881C9.39052 18.5924 9.70736 18.0499 10.0591 17.7423C7.32641 17.4347 4.45429 16.3765 4.45429 11.6618C4.45429 10.3185 4.9311 9.22133 5.72065 8.36C5.58222 8.04931 5.16694 6.79833 5.82831 5.10337C5.82831 5.10337 6.85883 4.77319 9.2121 6.36459C10.1965 6.09082 11.2424 5.95546 12.2883 5.94931C13.3342 5.95546 14.3801 6.09082 15.3644 6.36459C17.7023 4.77319 18.7328 5.10337 18.7328 5.10337C19.3942 6.79833 18.9789 8.04931 18.8559 8.36C19.6403 9.22133 20.1171 10.3185 20.1171 11.6618C20.1171 16.3888 17.2409 17.4296 14.5031 17.7321C14.9338 18.1012 15.3337 18.8559 15.3337 20.0084C15.3337 21.6552 15.3183 22.978 15.3183 23.3779C15.3183 23.7009 15.5336 24.0854 16.1642 23.9623C21.0871 22.3484 24.6094 17.7341 24.6094 12.3047C24.6094 5.50942 19.0999 0 12.3047 0Z",
      ],
      [
        "href",
        "https://twitter.com/angular",
        "aria-label",
        "Twitter",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "24",
        "height",
        "24",
        "viewBox",
        "0 0 24 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Twitter",
      ],
      [
        "d",
        "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      ],
      [
        "href",
        "https://www.youtube.com/channel/UCbn1OgGei-DV7aSRo_HaAiw",
        "aria-label",
        "Youtube",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "29",
        "height",
        "20",
        "viewBox",
        "0 0 29 20",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Youtube",
      ],
      [
        "fill-rule",
        "evenodd",
        "clip-rule",
        "evenodd",
        "d",
        "M27.4896 1.52422C27.9301 1.96749 28.2463 2.51866 28.4068 3.12258C29.0004 5.35161 29.0004 10 29.0004 10C29.0004 10 29.0004 14.6484 28.4068 16.8774C28.2463 17.4813 27.9301 18.0325 27.4896 18.4758C27.0492 18.9191 26.5 19.2389 25.8972 19.4032C23.6778 20 14.8068 20 14.8068 20C14.8068 20 5.93586 20 3.71651 19.4032C3.11363 19.2389 2.56449 18.9191 2.12405 18.4758C1.68361 18.0325 1.36732 17.4813 1.20683 16.8774C0.613281 14.6484 0.613281 10 0.613281 10C0.613281 10 0.613281 5.35161 1.20683 3.12258C1.36732 2.51866 1.68361 1.96749 2.12405 1.52422C2.56449 1.08095 3.11363 0.76113 3.71651 0.596774C5.93586 0 14.8068 0 14.8068 0C14.8068 0 23.6778 0 25.8972 0.596774C26.5 0.76113 27.0492 1.08095 27.4896 1.52422ZM19.3229 10L11.9036 5.77905V14.221L19.3229 10Z",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "height",
        "14",
        "viewBox",
        "0 -960 960 960",
        "width",
        "14",
        "fill",
        "currentColor",
      ],
      [
        "d",
        "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (f(0, "main", 0)(1, "div", 1)(2, "div", 2)(3, "div"),
        E(4, "Cliente"),
        h(),
        A(),
        f(5, "svg", 3)(6, "g", 4),
        v(7, "path", 5)(8, "path", 6),
        h(),
        f(9, "defs")(10, "radialGradient", 7),
        v(11, "stop", 8)(12, "stop", 9)(13, "stop", 10),
        h(),
        f(14, "linearGradient", 11),
        v(15, "stop", 12)(16, "stop", 13)(17, "stop", 14)(18, "stop", 15),
        h(),
        f(19, "clipPath", 16),
        v(20, "path", 17),
        h()()(),
        j(),
        f(21, "h1"),
        E(22),
        h(),
        f(23, "p"),
        E(24, "Congratulations! Your app is running. \u{1F389}"),
        h()(),
        v(25, "div", 18),
        f(26, "div", 19)(27, "div", 20),
        Oe(28, u5, 5, 2, "a", 21, r5),
        h(),
        f(30, "div", 22)(31, "a", 23),
        A(),
        f(32, "svg", 24),
        v(33, "path", 25),
        h()(),
        j(),
        f(34, "a", 26),
        A(),
        f(35, "svg", 27),
        v(36, "path", 28),
        h()(),
        j(),
        f(37, "a", 29),
        A(),
        f(38, "svg", 30),
        v(39, "path", 31),
        h()()()()()(),
        j(),
        v(40, "router-outlet")),
        n & 2 &&
          (G(22),
          he("Hello, ", r.title, ""),
          G(6),
          Re(Pe(6, l5, P(1, o5), P(2, i5), P(3, s5), P(4, a5), P(5, c5))));
    },
    dependencies: [se],
    styles: [
      `[_nghost-%COMP%] {
    --bright-blue: oklch(51.01% 0.274 263.83);
    --electric-violet: oklch(53.18% 0.28 296.97);
    --french-violet: oklch(47.66% 0.246 305.88);
    --vivid-pink: oklch(69.02% 0.277 332.77);
    --hot-red: oklch(61.42% 0.238 15.34);
    --orange-red: oklch(63.32% 0.24 31.68);

    --gray-900: oklch(19.37% 0.006 300.98);
    --gray-700: oklch(36.98% 0.014 302.71);
    --gray-400: oklch(70.9% 0.015 304.04);

    --red-to-pink-to-purple-vertical-gradient: linear-gradient(
      180deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --red-to-pink-to-purple-horizontal-gradient: linear-gradient(
      90deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --pill-accent: var(--bright-blue);

    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1[_ngcontent-%COMP%] {
    font-size: 3.125rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    letter-spacing: -0.125rem;
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  p[_ngcontent-%COMP%] {
    margin: 0;
    color: var(--gray-700);
  }

  main[_ngcontent-%COMP%] {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: inherit;
    position: relative;
  }

  .angular-logo[_ngcontent-%COMP%] {
    max-width: 9.2rem;
  }

  .content[_ngcontent-%COMP%] {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 700px;
    margin-bottom: 3rem;
  }

  .content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    margin-top: 1.75rem;
  }

  .content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
    margin-top: 1.5rem;
  }

  .divider[_ngcontent-%COMP%] {
    width: 1px;
    background: var(--red-to-pink-to-purple-vertical-gradient);
    margin-inline: 0.5rem;
  }

  .pill-group[_ngcontent-%COMP%] {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .pill[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    --pill-accent: var(--bright-blue);
    background: color-mix(in srgb, var(--pill-accent) 5%, transparent);
    color: var(--pill-accent);
    padding-inline: 0.75rem;
    padding-block: 0.375rem;
    border-radius: 2.75rem;
    border: 0;
    transition: background 0.3s ease;
    font-family: var(--inter-font);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4rem;
    letter-spacing: -0.00875rem;
    text-decoration: none;
  }

  .pill[_ngcontent-%COMP%]:hover {
    background: color-mix(in srgb, var(--pill-accent) 15%, transparent);
  }

  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 1) {
    --pill-accent: var(--bright-blue);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 2) {
    --pill-accent: var(--french-violet);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 3), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 4), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 5) {
    --pill-accent: var(--hot-red);
  }

  .pill-group[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
    margin-inline-start: 0.25rem;
  }

  .social-links[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    gap: 0.73rem;
    margin-top: 1.5rem;
  }

  .social-links[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    transition: fill 0.3s ease;
    fill: var(--gray-400);
  }

  .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    fill: var(--gray-900);
  }

  @media screen and (max-width: 650px) {
    .content[_ngcontent-%COMP%] {
      flex-direction: column;
      width: max-content;
    }

    .divider[_ngcontent-%COMP%] {
      height: 1px;
      width: 100%;
      background: var(--red-to-pink-to-purple-horizontal-gradient);
      margin-block: 1.5rem;
    }
  }`,
    ],
  });
};
var d5 = (e, t) => t.title,
  f5 = () => ({ title: "Explore the Docs", link: "https://angular.dev" }),
  h5 = () => ({
    title: "Learn with Tutorials",
    link: "https://angular.dev/tutorials",
  }),
  p5 = () => ({ title: "CLI Docs", link: "https://angular.dev/tools/cli" }),
  g5 = () => ({
    title: "Angular Language Service",
    link: "https://angular.dev/tools/language-service",
  }),
  m5 = () => ({
    title: "Angular DevTools",
    link: "https://angular.dev/tools/devtools",
  }),
  v5 = (e, t, n, r, o) => [e, t, n, r, o];
function y5(e, t) {
  if (
    (e & 1 &&
      (f(0, "a", 21)(1, "span"),
      E(2),
      h(),
      A(),
      f(3, "svg", 32),
      v(4, "path", 33),
      h()()),
    e & 2)
  ) {
    let n = t.$implicit;
    De("href", n.link, Ae), G(2), we(n.title);
  }
}
var _i = class e {
  title = "Inventario";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = ne({
    type: e,
    selectors: [["inventario"]],
    standalone: !0,
    features: [re],
    decls: 41,
    vars: 12,
    consts: [
      [1, "main"],
      [1, "content"],
      [1, "left-side"],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 982 239",
        "fill",
        "none",
        1,
        "angular-logo",
      ],
      ["clip-path", "url(#a)"],
      [
        "fill",
        "url(#b)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "fill",
        "url(#c)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "id",
        "c",
        "cx",
        "0",
        "cy",
        "0",
        "r",
        "1",
        "gradientTransform",
        "rotate(118.122 171.182 60.81) scale(205.794)",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#FF41F8"],
      ["offset", ".707", "stop-color", "#FF41F8", "stop-opacity", ".5"],
      ["offset", "1", "stop-color", "#FF41F8", "stop-opacity", "0"],
      [
        "id",
        "b",
        "x1",
        "0",
        "x2",
        "982",
        "y1",
        "192",
        "y2",
        "192",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#F0060B"],
      ["offset", "0", "stop-color", "#F0070C"],
      ["offset", ".526", "stop-color", "#CC26D5"],
      ["offset", "1", "stop-color", "#7702FF"],
      ["id", "a"],
      ["fill", "#fff", "d", "M0 0h982v239H0z"],
      ["role", "separator", "aria-label", "Divider", 1, "divider"],
      [1, "right-side"],
      [1, "pill-group"],
      ["target", "_blank", "rel", "noopener", 1, "pill", 3, "href"],
      [1, "social-links"],
      [
        "href",
        "https://github.com/angular/angular",
        "aria-label",
        "Github",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "25",
        "height",
        "24",
        "viewBox",
        "0 0 25 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Github",
      ],
      [
        "d",
        "M12.3047 0C5.50634 0 0 5.50942 0 12.3047C0 17.7423 3.52529 22.3535 8.41332 23.9787C9.02856 24.0946 9.25414 23.7142 9.25414 23.3871C9.25414 23.0949 9.24389 22.3207 9.23876 21.2953C5.81601 22.0377 5.09414 19.6444 5.09414 19.6444C4.53427 18.2243 3.72524 17.8449 3.72524 17.8449C2.61064 17.082 3.81137 17.0973 3.81137 17.0973C5.04697 17.1835 5.69604 18.3647 5.69604 18.3647C6.79321 20.2463 8.57636 19.7029 9.27978 19.3881C9.39052 18.5924 9.70736 18.0499 10.0591 17.7423C7.32641 17.4347 4.45429 16.3765 4.45429 11.6618C4.45429 10.3185 4.9311 9.22133 5.72065 8.36C5.58222 8.04931 5.16694 6.79833 5.82831 5.10337C5.82831 5.10337 6.85883 4.77319 9.2121 6.36459C10.1965 6.09082 11.2424 5.95546 12.2883 5.94931C13.3342 5.95546 14.3801 6.09082 15.3644 6.36459C17.7023 4.77319 18.7328 5.10337 18.7328 5.10337C19.3942 6.79833 18.9789 8.04931 18.8559 8.36C19.6403 9.22133 20.1171 10.3185 20.1171 11.6618C20.1171 16.3888 17.2409 17.4296 14.5031 17.7321C14.9338 18.1012 15.3337 18.8559 15.3337 20.0084C15.3337 21.6552 15.3183 22.978 15.3183 23.3779C15.3183 23.7009 15.5336 24.0854 16.1642 23.9623C21.0871 22.3484 24.6094 17.7341 24.6094 12.3047C24.6094 5.50942 19.0999 0 12.3047 0Z",
      ],
      [
        "href",
        "https://twitter.com/angular",
        "aria-label",
        "Twitter",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "24",
        "height",
        "24",
        "viewBox",
        "0 0 24 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Twitter",
      ],
      [
        "d",
        "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      ],
      [
        "href",
        "https://www.youtube.com/channel/UCbn1OgGei-DV7aSRo_HaAiw",
        "aria-label",
        "Youtube",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "29",
        "height",
        "20",
        "viewBox",
        "0 0 29 20",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Youtube",
      ],
      [
        "fill-rule",
        "evenodd",
        "clip-rule",
        "evenodd",
        "d",
        "M27.4896 1.52422C27.9301 1.96749 28.2463 2.51866 28.4068 3.12258C29.0004 5.35161 29.0004 10 29.0004 10C29.0004 10 29.0004 14.6484 28.4068 16.8774C28.2463 17.4813 27.9301 18.0325 27.4896 18.4758C27.0492 18.9191 26.5 19.2389 25.8972 19.4032C23.6778 20 14.8068 20 14.8068 20C14.8068 20 5.93586 20 3.71651 19.4032C3.11363 19.2389 2.56449 18.9191 2.12405 18.4758C1.68361 18.0325 1.36732 17.4813 1.20683 16.8774C0.613281 14.6484 0.613281 10 0.613281 10C0.613281 10 0.613281 5.35161 1.20683 3.12258C1.36732 2.51866 1.68361 1.96749 2.12405 1.52422C2.56449 1.08095 3.11363 0.76113 3.71651 0.596774C5.93586 0 14.8068 0 14.8068 0C14.8068 0 23.6778 0 25.8972 0.596774C26.5 0.76113 27.0492 1.08095 27.4896 1.52422ZM19.3229 10L11.9036 5.77905V14.221L19.3229 10Z",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "height",
        "14",
        "viewBox",
        "0 -960 960 960",
        "width",
        "14",
        "fill",
        "currentColor",
      ],
      [
        "d",
        "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (f(0, "main", 0)(1, "div", 1)(2, "div", 2)(3, "div"),
        E(4, "Inventario"),
        h(),
        A(),
        f(5, "svg", 3)(6, "g", 4),
        v(7, "path", 5)(8, "path", 6),
        h(),
        f(9, "defs")(10, "radialGradient", 7),
        v(11, "stop", 8)(12, "stop", 9)(13, "stop", 10),
        h(),
        f(14, "linearGradient", 11),
        v(15, "stop", 12)(16, "stop", 13)(17, "stop", 14)(18, "stop", 15),
        h(),
        f(19, "clipPath", 16),
        v(20, "path", 17),
        h()()(),
        j(),
        f(21, "h1"),
        E(22),
        h(),
        f(23, "p"),
        E(24, "Congratulations! Your app is running. \u{1F389}"),
        h()(),
        v(25, "div", 18),
        f(26, "div", 19)(27, "div", 20),
        Oe(28, y5, 5, 2, "a", 21, d5),
        h(),
        f(30, "div", 22)(31, "a", 23),
        A(),
        f(32, "svg", 24),
        v(33, "path", 25),
        h()(),
        j(),
        f(34, "a", 26),
        A(),
        f(35, "svg", 27),
        v(36, "path", 28),
        h()(),
        j(),
        f(37, "a", 29),
        A(),
        f(38, "svg", 30),
        v(39, "path", 31),
        h()()()()()(),
        j(),
        v(40, "router-outlet")),
        n & 2 &&
          (G(22),
          he("Hello, ", r.title, ""),
          G(6),
          Re(Pe(6, v5, P(1, f5), P(2, h5), P(3, p5), P(4, g5), P(5, m5))));
    },
    dependencies: [se],
    styles: [
      `[_nghost-%COMP%] {
    --bright-blue: oklch(51.01% 0.274 263.83);
    --electric-violet: oklch(53.18% 0.28 296.97);
    --french-violet: oklch(47.66% 0.246 305.88);
    --vivid-pink: oklch(69.02% 0.277 332.77);
    --hot-red: oklch(61.42% 0.238 15.34);
    --orange-red: oklch(63.32% 0.24 31.68);

    --gray-900: oklch(19.37% 0.006 300.98);
    --gray-700: oklch(36.98% 0.014 302.71);
    --gray-400: oklch(70.9% 0.015 304.04);

    --red-to-pink-to-purple-vertical-gradient: linear-gradient(
      180deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --red-to-pink-to-purple-horizontal-gradient: linear-gradient(
      90deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --pill-accent: var(--bright-blue);

    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1[_ngcontent-%COMP%] {
    font-size: 3.125rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    letter-spacing: -0.125rem;
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  p[_ngcontent-%COMP%] {
    margin: 0;
    color: var(--gray-700);
  }

  main[_ngcontent-%COMP%] {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: inherit;
    position: relative;
  }

  .angular-logo[_ngcontent-%COMP%] {
    max-width: 9.2rem;
  }

  .content[_ngcontent-%COMP%] {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 700px;
    margin-bottom: 3rem;
  }

  .content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    margin-top: 1.75rem;
  }

  .content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
    margin-top: 1.5rem;
  }

  .divider[_ngcontent-%COMP%] {
    width: 1px;
    background: var(--red-to-pink-to-purple-vertical-gradient);
    margin-inline: 0.5rem;
  }

  .pill-group[_ngcontent-%COMP%] {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .pill[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    --pill-accent: var(--bright-blue);
    background: color-mix(in srgb, var(--pill-accent) 5%, transparent);
    color: var(--pill-accent);
    padding-inline: 0.75rem;
    padding-block: 0.375rem;
    border-radius: 2.75rem;
    border: 0;
    transition: background 0.3s ease;
    font-family: var(--inter-font);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4rem;
    letter-spacing: -0.00875rem;
    text-decoration: none;
  }

  .pill[_ngcontent-%COMP%]:hover {
    background: color-mix(in srgb, var(--pill-accent) 15%, transparent);
  }

  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 1) {
    --pill-accent: var(--bright-blue);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 2) {
    --pill-accent: var(--french-violet);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 3), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 4), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 5) {
    --pill-accent: var(--hot-red);
  }

  .pill-group[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
    margin-inline-start: 0.25rem;
  }

  .social-links[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    gap: 0.73rem;
    margin-top: 1.5rem;
  }

  .social-links[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    transition: fill 0.3s ease;
    fill: var(--gray-400);
  }

  .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    fill: var(--gray-900);
  }

  @media screen and (max-width: 650px) {
    .content[_ngcontent-%COMP%] {
      flex-direction: column;
      width: max-content;
    }

    .divider[_ngcontent-%COMP%] {
      height: 1px;
      width: 100%;
      background: var(--red-to-pink-to-purple-horizontal-gradient);
      margin-block: 1.5rem;
    }
  }`,
    ],
  });
};
var C5 = (e, t) => t.title,
  D5 = () => ({ title: "Explore the Docs", link: "https://angular.dev" }),
  w5 = () => ({
    title: "Learn with Tutorials",
    link: "https://angular.dev/tutorials",
  }),
  E5 = () => ({ title: "CLI Docs", link: "https://angular.dev/tools/cli" }),
  b5 = () => ({
    title: "Angular Language Service",
    link: "https://angular.dev/tools/language-service",
  }),
  I5 = () => ({
    title: "Angular DevTools",
    link: "https://angular.dev/tools/devtools",
  }),
  M5 = (e, t, n, r, o) => [e, t, n, r, o];
function S5(e, t) {
  if (
    (e & 1 &&
      (f(0, "a", 21)(1, "span"),
      E(2),
      h(),
      A(),
      f(3, "svg", 32),
      v(4, "path", 33),
      h()()),
    e & 2)
  ) {
    let n = t.$implicit;
    De("href", n.link, Ae), G(2), we(n.title);
  }
}
var Ti = class e {
  title = "Negocio";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = ne({
    type: e,
    selectors: [["app-root"]],
    standalone: !0,
    features: [re],
    decls: 41,
    vars: 12,
    consts: [
      [1, "main"],
      [1, "content"],
      [1, "left-side"],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 982 239",
        "fill",
        "none",
        1,
        "angular-logo",
      ],
      ["clip-path", "url(#a)"],
      [
        "fill",
        "url(#b)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "fill",
        "url(#c)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "id",
        "c",
        "cx",
        "0",
        "cy",
        "0",
        "r",
        "1",
        "gradientTransform",
        "rotate(118.122 171.182 60.81) scale(205.794)",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#FF41F8"],
      ["offset", ".707", "stop-color", "#FF41F8", "stop-opacity", ".5"],
      ["offset", "1", "stop-color", "#FF41F8", "stop-opacity", "0"],
      [
        "id",
        "b",
        "x1",
        "0",
        "x2",
        "982",
        "y1",
        "192",
        "y2",
        "192",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#F0060B"],
      ["offset", "0", "stop-color", "#F0070C"],
      ["offset", ".526", "stop-color", "#CC26D5"],
      ["offset", "1", "stop-color", "#7702FF"],
      ["id", "a"],
      ["fill", "#fff", "d", "M0 0h982v239H0z"],
      ["role", "separator", "aria-label", "Divider", 1, "divider"],
      [1, "right-side"],
      [1, "pill-group"],
      ["target", "_blank", "rel", "noopener", 1, "pill", 3, "href"],
      [1, "social-links"],
      [
        "href",
        "https://github.com/angular/angular",
        "aria-label",
        "Github",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "25",
        "height",
        "24",
        "viewBox",
        "0 0 25 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Github",
      ],
      [
        "d",
        "M12.3047 0C5.50634 0 0 5.50942 0 12.3047C0 17.7423 3.52529 22.3535 8.41332 23.9787C9.02856 24.0946 9.25414 23.7142 9.25414 23.3871C9.25414 23.0949 9.24389 22.3207 9.23876 21.2953C5.81601 22.0377 5.09414 19.6444 5.09414 19.6444C4.53427 18.2243 3.72524 17.8449 3.72524 17.8449C2.61064 17.082 3.81137 17.0973 3.81137 17.0973C5.04697 17.1835 5.69604 18.3647 5.69604 18.3647C6.79321 20.2463 8.57636 19.7029 9.27978 19.3881C9.39052 18.5924 9.70736 18.0499 10.0591 17.7423C7.32641 17.4347 4.45429 16.3765 4.45429 11.6618C4.45429 10.3185 4.9311 9.22133 5.72065 8.36C5.58222 8.04931 5.16694 6.79833 5.82831 5.10337C5.82831 5.10337 6.85883 4.77319 9.2121 6.36459C10.1965 6.09082 11.2424 5.95546 12.2883 5.94931C13.3342 5.95546 14.3801 6.09082 15.3644 6.36459C17.7023 4.77319 18.7328 5.10337 18.7328 5.10337C19.3942 6.79833 18.9789 8.04931 18.8559 8.36C19.6403 9.22133 20.1171 10.3185 20.1171 11.6618C20.1171 16.3888 17.2409 17.4296 14.5031 17.7321C14.9338 18.1012 15.3337 18.8559 15.3337 20.0084C15.3337 21.6552 15.3183 22.978 15.3183 23.3779C15.3183 23.7009 15.5336 24.0854 16.1642 23.9623C21.0871 22.3484 24.6094 17.7341 24.6094 12.3047C24.6094 5.50942 19.0999 0 12.3047 0Z",
      ],
      [
        "href",
        "https://twitter.com/angular",
        "aria-label",
        "Twitter",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "24",
        "height",
        "24",
        "viewBox",
        "0 0 24 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Twitter",
      ],
      [
        "d",
        "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      ],
      [
        "href",
        "https://www.youtube.com/channel/UCbn1OgGei-DV7aSRo_HaAiw",
        "aria-label",
        "Youtube",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "29",
        "height",
        "20",
        "viewBox",
        "0 0 29 20",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Youtube",
      ],
      [
        "fill-rule",
        "evenodd",
        "clip-rule",
        "evenodd",
        "d",
        "M27.4896 1.52422C27.9301 1.96749 28.2463 2.51866 28.4068 3.12258C29.0004 5.35161 29.0004 10 29.0004 10C29.0004 10 29.0004 14.6484 28.4068 16.8774C28.2463 17.4813 27.9301 18.0325 27.4896 18.4758C27.0492 18.9191 26.5 19.2389 25.8972 19.4032C23.6778 20 14.8068 20 14.8068 20C14.8068 20 5.93586 20 3.71651 19.4032C3.11363 19.2389 2.56449 18.9191 2.12405 18.4758C1.68361 18.0325 1.36732 17.4813 1.20683 16.8774C0.613281 14.6484 0.613281 10 0.613281 10C0.613281 10 0.613281 5.35161 1.20683 3.12258C1.36732 2.51866 1.68361 1.96749 2.12405 1.52422C2.56449 1.08095 3.11363 0.76113 3.71651 0.596774C5.93586 0 14.8068 0 14.8068 0C14.8068 0 23.6778 0 25.8972 0.596774C26.5 0.76113 27.0492 1.08095 27.4896 1.52422ZM19.3229 10L11.9036 5.77905V14.221L19.3229 10Z",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "height",
        "14",
        "viewBox",
        "0 -960 960 960",
        "width",
        "14",
        "fill",
        "currentColor",
      ],
      [
        "d",
        "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (f(0, "main", 0)(1, "div", 1)(2, "div", 2)(3, "div"),
        E(4, "Negocio"),
        h(),
        A(),
        f(5, "svg", 3)(6, "g", 4),
        v(7, "path", 5)(8, "path", 6),
        h(),
        f(9, "defs")(10, "radialGradient", 7),
        v(11, "stop", 8)(12, "stop", 9)(13, "stop", 10),
        h(),
        f(14, "linearGradient", 11),
        v(15, "stop", 12)(16, "stop", 13)(17, "stop", 14)(18, "stop", 15),
        h(),
        f(19, "clipPath", 16),
        v(20, "path", 17),
        h()()(),
        j(),
        f(21, "h1"),
        E(22),
        h(),
        f(23, "p"),
        E(24, "Congratulations! Your app is running. \u{1F389}"),
        h()(),
        v(25, "div", 18),
        f(26, "div", 19)(27, "div", 20),
        Oe(28, S5, 5, 2, "a", 21, C5),
        h(),
        f(30, "div", 22)(31, "a", 23),
        A(),
        f(32, "svg", 24),
        v(33, "path", 25),
        h()(),
        j(),
        f(34, "a", 26),
        A(),
        f(35, "svg", 27),
        v(36, "path", 28),
        h()(),
        j(),
        f(37, "a", 29),
        A(),
        f(38, "svg", 30),
        v(39, "path", 31),
        h()()()()()(),
        j(),
        v(40, "router-outlet")),
        n & 2 &&
          (G(22),
          he("Hello, ", r.title, ""),
          G(6),
          Re(Pe(6, M5, P(1, D5), P(2, w5), P(3, E5), P(4, b5), P(5, I5))));
    },
    dependencies: [se],
    styles: [
      `[_nghost-%COMP%] {
    --bright-blue: oklch(51.01% 0.274 263.83);
    --electric-violet: oklch(53.18% 0.28 296.97);
    --french-violet: oklch(47.66% 0.246 305.88);
    --vivid-pink: oklch(69.02% 0.277 332.77);
    --hot-red: oklch(61.42% 0.238 15.34);
    --orange-red: oklch(63.32% 0.24 31.68);

    --gray-900: oklch(19.37% 0.006 300.98);
    --gray-700: oklch(36.98% 0.014 302.71);
    --gray-400: oklch(70.9% 0.015 304.04);

    --red-to-pink-to-purple-vertical-gradient: linear-gradient(
      180deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --red-to-pink-to-purple-horizontal-gradient: linear-gradient(
      90deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --pill-accent: var(--bright-blue);

    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1[_ngcontent-%COMP%] {
    font-size: 3.125rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    letter-spacing: -0.125rem;
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  p[_ngcontent-%COMP%] {
    margin: 0;
    color: var(--gray-700);
  }

  main[_ngcontent-%COMP%] {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: inherit;
    position: relative;
  }

  .angular-logo[_ngcontent-%COMP%] {
    max-width: 9.2rem;
  }

  .content[_ngcontent-%COMP%] {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 700px;
    margin-bottom: 3rem;
  }

  .content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    margin-top: 1.75rem;
  }

  .content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
    margin-top: 1.5rem;
  }

  .divider[_ngcontent-%COMP%] {
    width: 1px;
    background: var(--red-to-pink-to-purple-vertical-gradient);
    margin-inline: 0.5rem;
  }

  .pill-group[_ngcontent-%COMP%] {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .pill[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    --pill-accent: var(--bright-blue);
    background: color-mix(in srgb, var(--pill-accent) 5%, transparent);
    color: var(--pill-accent);
    padding-inline: 0.75rem;
    padding-block: 0.375rem;
    border-radius: 2.75rem;
    border: 0;
    transition: background 0.3s ease;
    font-family: var(--inter-font);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4rem;
    letter-spacing: -0.00875rem;
    text-decoration: none;
  }

  .pill[_ngcontent-%COMP%]:hover {
    background: color-mix(in srgb, var(--pill-accent) 15%, transparent);
  }

  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 1) {
    --pill-accent: var(--bright-blue);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 2) {
    --pill-accent: var(--french-violet);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 3), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 4), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 5) {
    --pill-accent: var(--hot-red);
  }

  .pill-group[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
    margin-inline-start: 0.25rem;
  }

  .social-links[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    gap: 0.73rem;
    margin-top: 1.5rem;
  }

  .social-links[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    transition: fill 0.3s ease;
    fill: var(--gray-400);
  }

  .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    fill: var(--gray-900);
  }

  @media screen and (max-width: 650px) {
    .content[_ngcontent-%COMP%] {
      flex-direction: column;
      width: max-content;
    }

    .divider[_ngcontent-%COMP%] {
      height: 1px;
      width: 100%;
      background: var(--red-to-pink-to-purple-horizontal-gradient);
      margin-block: 1.5rem;
    }
  }`,
    ],
  });
};
var _5 = (e, t) => t.title,
  T5 = () => ({ title: "Explore the Docs", link: "https://angular.dev" }),
  x5 = () => ({
    title: "Learn with Tutorials",
    link: "https://angular.dev/tutorials",
  }),
  N5 = () => ({ title: "CLI Docs", link: "https://angular.dev/tools/cli" }),
  A5 = () => ({
    title: "Angular Language Service",
    link: "https://angular.dev/tools/language-service",
  }),
  O5 = () => ({
    title: "Angular DevTools",
    link: "https://angular.dev/tools/devtools",
  }),
  R5 = (e, t, n, r, o) => [e, t, n, r, o];
function P5(e, t) {
  if (
    (e & 1 &&
      (f(0, "a", 21)(1, "span"),
      E(2),
      h(),
      A(),
      f(3, "svg", 32),
      v(4, "path", 33),
      h()()),
    e & 2)
  ) {
    let n = t.$implicit;
    De("href", n.link, Ae), G(2), we(n.title);
  }
}
var xi = class e {
  title = "Recuperacion";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = ne({
    type: e,
    selectors: [["recuperacion-cuenta"]],
    standalone: !0,
    features: [re],
    decls: 41,
    vars: 12,
    consts: [
      [1, "main"],
      [1, "content"],
      [1, "left-side"],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 982 239",
        "fill",
        "none",
        1,
        "angular-logo",
      ],
      ["clip-path", "url(#a)"],
      [
        "fill",
        "url(#b)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "fill",
        "url(#c)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "id",
        "c",
        "cx",
        "0",
        "cy",
        "0",
        "r",
        "1",
        "gradientTransform",
        "rotate(118.122 171.182 60.81) scale(205.794)",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#FF41F8"],
      ["offset", ".707", "stop-color", "#FF41F8", "stop-opacity", ".5"],
      ["offset", "1", "stop-color", "#FF41F8", "stop-opacity", "0"],
      [
        "id",
        "b",
        "x1",
        "0",
        "x2",
        "982",
        "y1",
        "192",
        "y2",
        "192",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#F0060B"],
      ["offset", "0", "stop-color", "#F0070C"],
      ["offset", ".526", "stop-color", "#CC26D5"],
      ["offset", "1", "stop-color", "#7702FF"],
      ["id", "a"],
      ["fill", "#fff", "d", "M0 0h982v239H0z"],
      ["role", "separator", "aria-label", "Divider", 1, "divider"],
      [1, "right-side"],
      [1, "pill-group"],
      ["target", "_blank", "rel", "noopener", 1, "pill", 3, "href"],
      [1, "social-links"],
      [
        "href",
        "https://github.com/angular/angular",
        "aria-label",
        "Github",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "25",
        "height",
        "24",
        "viewBox",
        "0 0 25 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Github",
      ],
      [
        "d",
        "M12.3047 0C5.50634 0 0 5.50942 0 12.3047C0 17.7423 3.52529 22.3535 8.41332 23.9787C9.02856 24.0946 9.25414 23.7142 9.25414 23.3871C9.25414 23.0949 9.24389 22.3207 9.23876 21.2953C5.81601 22.0377 5.09414 19.6444 5.09414 19.6444C4.53427 18.2243 3.72524 17.8449 3.72524 17.8449C2.61064 17.082 3.81137 17.0973 3.81137 17.0973C5.04697 17.1835 5.69604 18.3647 5.69604 18.3647C6.79321 20.2463 8.57636 19.7029 9.27978 19.3881C9.39052 18.5924 9.70736 18.0499 10.0591 17.7423C7.32641 17.4347 4.45429 16.3765 4.45429 11.6618C4.45429 10.3185 4.9311 9.22133 5.72065 8.36C5.58222 8.04931 5.16694 6.79833 5.82831 5.10337C5.82831 5.10337 6.85883 4.77319 9.2121 6.36459C10.1965 6.09082 11.2424 5.95546 12.2883 5.94931C13.3342 5.95546 14.3801 6.09082 15.3644 6.36459C17.7023 4.77319 18.7328 5.10337 18.7328 5.10337C19.3942 6.79833 18.9789 8.04931 18.8559 8.36C19.6403 9.22133 20.1171 10.3185 20.1171 11.6618C20.1171 16.3888 17.2409 17.4296 14.5031 17.7321C14.9338 18.1012 15.3337 18.8559 15.3337 20.0084C15.3337 21.6552 15.3183 22.978 15.3183 23.3779C15.3183 23.7009 15.5336 24.0854 16.1642 23.9623C21.0871 22.3484 24.6094 17.7341 24.6094 12.3047C24.6094 5.50942 19.0999 0 12.3047 0Z",
      ],
      [
        "href",
        "https://twitter.com/angular",
        "aria-label",
        "Twitter",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "24",
        "height",
        "24",
        "viewBox",
        "0 0 24 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Twitter",
      ],
      [
        "d",
        "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      ],
      [
        "href",
        "https://www.youtube.com/channel/UCbn1OgGei-DV7aSRo_HaAiw",
        "aria-label",
        "Youtube",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "29",
        "height",
        "20",
        "viewBox",
        "0 0 29 20",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Youtube",
      ],
      [
        "fill-rule",
        "evenodd",
        "clip-rule",
        "evenodd",
        "d",
        "M27.4896 1.52422C27.9301 1.96749 28.2463 2.51866 28.4068 3.12258C29.0004 5.35161 29.0004 10 29.0004 10C29.0004 10 29.0004 14.6484 28.4068 16.8774C28.2463 17.4813 27.9301 18.0325 27.4896 18.4758C27.0492 18.9191 26.5 19.2389 25.8972 19.4032C23.6778 20 14.8068 20 14.8068 20C14.8068 20 5.93586 20 3.71651 19.4032C3.11363 19.2389 2.56449 18.9191 2.12405 18.4758C1.68361 18.0325 1.36732 17.4813 1.20683 16.8774C0.613281 14.6484 0.613281 10 0.613281 10C0.613281 10 0.613281 5.35161 1.20683 3.12258C1.36732 2.51866 1.68361 1.96749 2.12405 1.52422C2.56449 1.08095 3.11363 0.76113 3.71651 0.596774C5.93586 0 14.8068 0 14.8068 0C14.8068 0 23.6778 0 25.8972 0.596774C26.5 0.76113 27.0492 1.08095 27.4896 1.52422ZM19.3229 10L11.9036 5.77905V14.221L19.3229 10Z",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "height",
        "14",
        "viewBox",
        "0 -960 960 960",
        "width",
        "14",
        "fill",
        "currentColor",
      ],
      [
        "d",
        "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (f(0, "main", 0)(1, "div", 1)(2, "div", 2)(3, "div"),
        E(4, "Recuperacion Cuenta"),
        h(),
        A(),
        f(5, "svg", 3)(6, "g", 4),
        v(7, "path", 5)(8, "path", 6),
        h(),
        f(9, "defs")(10, "radialGradient", 7),
        v(11, "stop", 8)(12, "stop", 9)(13, "stop", 10),
        h(),
        f(14, "linearGradient", 11),
        v(15, "stop", 12)(16, "stop", 13)(17, "stop", 14)(18, "stop", 15),
        h(),
        f(19, "clipPath", 16),
        v(20, "path", 17),
        h()()(),
        j(),
        f(21, "h1"),
        E(22),
        h(),
        f(23, "p"),
        E(24, "Congratulations! Your app is running. \u{1F389}"),
        h()(),
        v(25, "div", 18),
        f(26, "div", 19)(27, "div", 20),
        Oe(28, P5, 5, 2, "a", 21, _5),
        h(),
        f(30, "div", 22)(31, "a", 23),
        A(),
        f(32, "svg", 24),
        v(33, "path", 25),
        h()(),
        j(),
        f(34, "a", 26),
        A(),
        f(35, "svg", 27),
        v(36, "path", 28),
        h()(),
        j(),
        f(37, "a", 29),
        A(),
        f(38, "svg", 30),
        v(39, "path", 31),
        h()()()()()(),
        j(),
        v(40, "router-outlet")),
        n & 2 &&
          (G(22),
          he("Hello, ", r.title, ""),
          G(6),
          Re(Pe(6, R5, P(1, T5), P(2, x5), P(3, N5), P(4, A5), P(5, O5))));
    },
    dependencies: [se],
    styles: [
      `[_nghost-%COMP%] {
    --bright-blue: oklch(51.01% 0.274 263.83);
    --electric-violet: oklch(53.18% 0.28 296.97);
    --french-violet: oklch(47.66% 0.246 305.88);
    --vivid-pink: oklch(69.02% 0.277 332.77);
    --hot-red: oklch(61.42% 0.238 15.34);
    --orange-red: oklch(63.32% 0.24 31.68);

    --gray-900: oklch(19.37% 0.006 300.98);
    --gray-700: oklch(36.98% 0.014 302.71);
    --gray-400: oklch(70.9% 0.015 304.04);

    --red-to-pink-to-purple-vertical-gradient: linear-gradient(
      180deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --red-to-pink-to-purple-horizontal-gradient: linear-gradient(
      90deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --pill-accent: var(--bright-blue);

    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1[_ngcontent-%COMP%] {
    font-size: 3.125rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    letter-spacing: -0.125rem;
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  p[_ngcontent-%COMP%] {
    margin: 0;
    color: var(--gray-700);
  }

  main[_ngcontent-%COMP%] {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: inherit;
    position: relative;
  }

  .angular-logo[_ngcontent-%COMP%] {
    max-width: 9.2rem;
  }

  .content[_ngcontent-%COMP%] {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 700px;
    margin-bottom: 3rem;
  }

  .content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    margin-top: 1.75rem;
  }

  .content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
    margin-top: 1.5rem;
  }

  .divider[_ngcontent-%COMP%] {
    width: 1px;
    background: var(--red-to-pink-to-purple-vertical-gradient);
    margin-inline: 0.5rem;
  }

  .pill-group[_ngcontent-%COMP%] {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .pill[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    --pill-accent: var(--bright-blue);
    background: color-mix(in srgb, var(--pill-accent) 5%, transparent);
    color: var(--pill-accent);
    padding-inline: 0.75rem;
    padding-block: 0.375rem;
    border-radius: 2.75rem;
    border: 0;
    transition: background 0.3s ease;
    font-family: var(--inter-font);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4rem;
    letter-spacing: -0.00875rem;
    text-decoration: none;
  }

  .pill[_ngcontent-%COMP%]:hover {
    background: color-mix(in srgb, var(--pill-accent) 15%, transparent);
  }

  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 1) {
    --pill-accent: var(--bright-blue);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 2) {
    --pill-accent: var(--french-violet);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 3), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 4), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 5) {
    --pill-accent: var(--hot-red);
  }

  .pill-group[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
    margin-inline-start: 0.25rem;
  }

  .social-links[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    gap: 0.73rem;
    margin-top: 1.5rem;
  }

  .social-links[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    transition: fill 0.3s ease;
    fill: var(--gray-400);
  }

  .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    fill: var(--gray-900);
  }

  @media screen and (max-width: 650px) {
    .content[_ngcontent-%COMP%] {
      flex-direction: column;
      width: max-content;
    }

    .divider[_ngcontent-%COMP%] {
      height: 1px;
      width: 100%;
      background: var(--red-to-pink-to-purple-horizontal-gradient);
      margin-block: 1.5rem;
    }
  }`,
    ],
  });
};
var k5 = (e, t) => t.title,
  F5 = () => ({ title: "Explore the Docs", link: "https://angular.dev" }),
  L5 = () => ({
    title: "Learn with Tutorials",
    link: "https://angular.dev/tutorials",
  }),
  j5 = () => ({ title: "CLI Docs", link: "https://angular.dev/tools/cli" }),
  V5 = () => ({
    title: "Angular Language Service",
    link: "https://angular.dev/tools/language-service",
  }),
  U5 = () => ({
    title: "Angular DevTools",
    link: "https://angular.dev/tools/devtools",
  }),
  B5 = (e, t, n, r, o) => [e, t, n, r, o];
function $5(e, t) {
  if (
    (e & 1 &&
      (f(0, "a", 21)(1, "span"),
      E(2),
      h(),
      A(),
      f(3, "svg", 32),
      v(4, "path", 33),
      h()()),
    e & 2)
  ) {
    let n = t.$implicit;
    De("href", n.link, Ae), G(2), we(n.title);
  }
}
var Ni = class e {
  title = "Tendero";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = ne({
    type: e,
    selectors: [["tendero"]],
    standalone: !0,
    features: [re],
    decls: 41,
    vars: 12,
    consts: [
      [1, "main"],
      [1, "content"],
      [1, "left-side"],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "viewBox",
        "0 0 982 239",
        "fill",
        "none",
        1,
        "angular-logo",
      ],
      ["clip-path", "url(#a)"],
      [
        "fill",
        "url(#b)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "fill",
        "url(#c)",
        "d",
        "M388.676 191.625h30.849L363.31 31.828h-35.758l-56.215 159.797h30.848l13.174-39.356h60.061l13.256 39.356Zm-65.461-62.675 21.602-64.311h1.227l21.602 64.311h-44.431Zm126.831-7.527v70.202h-28.23V71.839h27.002v20.374h1.392c2.782-6.71 7.2-12.028 13.255-15.956 6.056-3.927 13.584-5.89 22.503-5.89 8.264 0 15.465 1.8 21.684 5.318 6.137 3.518 10.964 8.673 14.319 15.382 3.437 6.71 5.074 14.81 4.992 24.383v76.175h-28.23v-71.92c0-8.019-2.046-14.237-6.219-18.819-4.173-4.5-9.819-6.791-17.102-6.791-4.91 0-9.328 1.063-13.174 3.272-3.846 2.128-6.792 5.237-9.001 9.328-2.046 4.009-3.191 8.918-3.191 14.728ZM589.233 239c-10.147 0-18.82-1.391-26.103-4.091-7.282-2.7-13.092-6.382-17.511-10.964-4.418-4.582-7.528-9.655-9.164-15.219l25.448-6.136c1.145 2.372 2.782 4.663 4.991 6.954 2.209 2.291 5.155 4.255 8.837 5.81 3.683 1.554 8.428 2.291 14.074 2.291 8.019 0 14.647-1.964 19.884-5.81 5.237-3.845 7.856-10.227 7.856-19.064v-22.665h-1.391c-1.473 2.946-3.601 5.892-6.383 9.001-2.782 3.109-6.464 5.645-10.965 7.691-4.582 2.046-10.228 3.109-17.101 3.109-9.165 0-17.511-2.209-25.039-6.545-7.446-4.337-13.42-10.883-17.757-19.474-4.418-8.673-6.628-19.473-6.628-32.565 0-13.091 2.21-24.301 6.628-33.383 4.419-9.082 10.311-15.955 17.839-20.7 7.528-4.746 15.874-7.037 25.039-7.037 7.037 0 12.846 1.145 17.347 3.518 4.582 2.373 8.182 5.236 10.883 8.51 2.7 3.272 4.746 6.382 6.137 9.327h1.554v-19.8h27.821v121.749c0 10.228-2.454 18.737-7.364 25.447-4.91 6.709-11.538 11.7-20.048 15.055-8.509 3.355-18.165 4.991-28.884 4.991Zm.245-71.266c5.974 0 11.047-1.473 15.302-4.337 4.173-2.945 7.446-7.118 9.573-12.519 2.21-5.482 3.274-12.027 3.274-19.637 0-7.609-1.064-14.155-3.274-19.8-2.127-5.646-5.318-10.064-9.491-13.255-4.174-3.11-9.329-4.746-15.384-4.746s-11.537 1.636-15.792 4.91c-4.173 3.272-7.365 7.772-9.492 13.418-2.128 5.727-3.191 12.191-3.191 19.392 0 7.2 1.063 13.745 3.273 19.228 2.127 5.482 5.318 9.736 9.573 12.764 4.174 3.027 9.41 4.582 15.629 4.582Zm141.56-26.51V71.839h28.23v119.786h-27.412v-21.273h-1.227c-2.7 6.709-7.119 12.191-13.338 16.446-6.137 4.255-13.747 6.382-22.748 6.382-7.855 0-14.81-1.718-20.783-5.237-5.974-3.518-10.72-8.591-14.075-15.382-3.355-6.709-5.073-14.891-5.073-24.464V71.839h28.312v71.921c0 7.609 2.046 13.664 6.219 18.083 4.173 4.5 9.655 6.709 16.365 6.709 4.173 0 8.183-.982 12.111-3.028 3.927-2.045 7.118-5.072 9.655-9.082 2.537-4.091 3.764-9.164 3.764-15.218Zm65.707-109.395v159.796h-28.23V31.828h28.23Zm44.841 162.169c-7.61 0-14.402-1.391-20.457-4.091-6.055-2.7-10.883-6.791-14.32-12.109-3.518-5.319-5.237-11.946-5.237-19.801 0-6.791 1.228-12.355 3.765-16.773 2.536-4.419 5.891-7.937 10.228-10.637 4.337-2.618 9.164-4.664 14.647-6.055 5.4-1.391 11.046-2.373 16.856-3.027 7.037-.737 12.683-1.391 17.102-1.964 4.337-.573 7.528-1.555 9.574-2.782 1.963-1.309 3.027-3.273 3.027-5.973v-.491c0-5.891-1.718-10.391-5.237-13.664-3.518-3.191-8.51-4.828-15.056-4.828-6.955 0-12.356 1.473-16.447 4.5-4.009 3.028-6.71 6.546-8.183 10.719l-26.348-3.764c2.046-7.282 5.483-13.336 10.31-18.328 4.746-4.909 10.638-8.59 17.511-11.045 6.955-2.455 14.565-3.682 22.912-3.682 5.809 0 11.537.654 17.265 2.045s10.965 3.6 15.711 6.71c4.746 3.109 8.51 7.282 11.455 12.6 2.864 5.318 4.337 11.946 4.337 19.883v80.184h-27.166v-16.446h-.9c-1.719 3.355-4.092 6.464-7.201 9.328-3.109 2.864-6.955 5.237-11.619 6.955-4.828 1.718-10.229 2.536-16.529 2.536Zm7.364-20.701c5.646 0 10.556-1.145 14.729-3.354 4.173-2.291 7.364-5.237 9.655-9.001 2.292-3.763 3.355-7.854 3.355-12.273v-14.155c-.9.737-2.373 1.391-4.5 2.046-2.128.654-4.419 1.145-7.037 1.636-2.619.491-5.155.9-7.692 1.227-2.537.328-4.746.655-6.628.901-4.173.572-8.019 1.472-11.292 2.781-3.355 1.31-5.973 3.11-7.855 5.401-1.964 2.291-2.864 5.318-2.864 8.918 0 5.237 1.882 9.164 5.728 11.782 3.682 2.782 8.51 4.091 14.401 4.091Zm64.643 18.328V71.839h27.412v19.965h1.227c2.21-6.955 5.974-12.274 11.292-16.038 5.319-3.763 11.456-5.645 18.329-5.645 1.555 0 3.355.082 5.237.163 1.964.164 3.601.328 4.91.573v25.938c-1.227-.41-3.109-.819-5.646-1.146a58.814 58.814 0 0 0-7.446-.49c-5.155 0-9.738 1.145-13.829 3.354-4.091 2.209-7.282 5.236-9.655 9.164-2.373 3.927-3.519 8.427-3.519 13.5v70.448h-28.312ZM222.077 39.192l-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z",
      ],
      [
        "id",
        "c",
        "cx",
        "0",
        "cy",
        "0",
        "r",
        "1",
        "gradientTransform",
        "rotate(118.122 171.182 60.81) scale(205.794)",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#FF41F8"],
      ["offset", ".707", "stop-color", "#FF41F8", "stop-opacity", ".5"],
      ["offset", "1", "stop-color", "#FF41F8", "stop-opacity", "0"],
      [
        "id",
        "b",
        "x1",
        "0",
        "x2",
        "982",
        "y1",
        "192",
        "y2",
        "192",
        "gradientUnits",
        "userSpaceOnUse",
      ],
      ["stop-color", "#F0060B"],
      ["offset", "0", "stop-color", "#F0070C"],
      ["offset", ".526", "stop-color", "#CC26D5"],
      ["offset", "1", "stop-color", "#7702FF"],
      ["id", "a"],
      ["fill", "#fff", "d", "M0 0h982v239H0z"],
      ["role", "separator", "aria-label", "Divider", 1, "divider"],
      [1, "right-side"],
      [1, "pill-group"],
      ["target", "_blank", "rel", "noopener", 1, "pill", 3, "href"],
      [1, "social-links"],
      [
        "href",
        "https://github.com/angular/angular",
        "aria-label",
        "Github",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "25",
        "height",
        "24",
        "viewBox",
        "0 0 25 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Github",
      ],
      [
        "d",
        "M12.3047 0C5.50634 0 0 5.50942 0 12.3047C0 17.7423 3.52529 22.3535 8.41332 23.9787C9.02856 24.0946 9.25414 23.7142 9.25414 23.3871C9.25414 23.0949 9.24389 22.3207 9.23876 21.2953C5.81601 22.0377 5.09414 19.6444 5.09414 19.6444C4.53427 18.2243 3.72524 17.8449 3.72524 17.8449C2.61064 17.082 3.81137 17.0973 3.81137 17.0973C5.04697 17.1835 5.69604 18.3647 5.69604 18.3647C6.79321 20.2463 8.57636 19.7029 9.27978 19.3881C9.39052 18.5924 9.70736 18.0499 10.0591 17.7423C7.32641 17.4347 4.45429 16.3765 4.45429 11.6618C4.45429 10.3185 4.9311 9.22133 5.72065 8.36C5.58222 8.04931 5.16694 6.79833 5.82831 5.10337C5.82831 5.10337 6.85883 4.77319 9.2121 6.36459C10.1965 6.09082 11.2424 5.95546 12.2883 5.94931C13.3342 5.95546 14.3801 6.09082 15.3644 6.36459C17.7023 4.77319 18.7328 5.10337 18.7328 5.10337C19.3942 6.79833 18.9789 8.04931 18.8559 8.36C19.6403 9.22133 20.1171 10.3185 20.1171 11.6618C20.1171 16.3888 17.2409 17.4296 14.5031 17.7321C14.9338 18.1012 15.3337 18.8559 15.3337 20.0084C15.3337 21.6552 15.3183 22.978 15.3183 23.3779C15.3183 23.7009 15.5336 24.0854 16.1642 23.9623C21.0871 22.3484 24.6094 17.7341 24.6094 12.3047C24.6094 5.50942 19.0999 0 12.3047 0Z",
      ],
      [
        "href",
        "https://twitter.com/angular",
        "aria-label",
        "Twitter",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "24",
        "height",
        "24",
        "viewBox",
        "0 0 24 24",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Twitter",
      ],
      [
        "d",
        "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      ],
      [
        "href",
        "https://www.youtube.com/channel/UCbn1OgGei-DV7aSRo_HaAiw",
        "aria-label",
        "Youtube",
        "target",
        "_blank",
        "rel",
        "noopener",
      ],
      [
        "width",
        "29",
        "height",
        "20",
        "viewBox",
        "0 0 29 20",
        "fill",
        "none",
        "xmlns",
        "http://www.w3.org/2000/svg",
        "alt",
        "Youtube",
      ],
      [
        "fill-rule",
        "evenodd",
        "clip-rule",
        "evenodd",
        "d",
        "M27.4896 1.52422C27.9301 1.96749 28.2463 2.51866 28.4068 3.12258C29.0004 5.35161 29.0004 10 29.0004 10C29.0004 10 29.0004 14.6484 28.4068 16.8774C28.2463 17.4813 27.9301 18.0325 27.4896 18.4758C27.0492 18.9191 26.5 19.2389 25.8972 19.4032C23.6778 20 14.8068 20 14.8068 20C14.8068 20 5.93586 20 3.71651 19.4032C3.11363 19.2389 2.56449 18.9191 2.12405 18.4758C1.68361 18.0325 1.36732 17.4813 1.20683 16.8774C0.613281 14.6484 0.613281 10 0.613281 10C0.613281 10 0.613281 5.35161 1.20683 3.12258C1.36732 2.51866 1.68361 1.96749 2.12405 1.52422C2.56449 1.08095 3.11363 0.76113 3.71651 0.596774C5.93586 0 14.8068 0 14.8068 0C14.8068 0 23.6778 0 25.8972 0.596774C26.5 0.76113 27.0492 1.08095 27.4896 1.52422ZM19.3229 10L11.9036 5.77905V14.221L19.3229 10Z",
      ],
      [
        "xmlns",
        "http://www.w3.org/2000/svg",
        "height",
        "14",
        "viewBox",
        "0 -960 960 960",
        "width",
        "14",
        "fill",
        "currentColor",
      ],
      [
        "d",
        "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (f(0, "main", 0)(1, "div", 1)(2, "div", 2)(3, "div"),
        E(4, "Tendero"),
        h(),
        A(),
        f(5, "svg", 3)(6, "g", 4),
        v(7, "path", 5)(8, "path", 6),
        h(),
        f(9, "defs")(10, "radialGradient", 7),
        v(11, "stop", 8)(12, "stop", 9)(13, "stop", 10),
        h(),
        f(14, "linearGradient", 11),
        v(15, "stop", 12)(16, "stop", 13)(17, "stop", 14)(18, "stop", 15),
        h(),
        f(19, "clipPath", 16),
        v(20, "path", 17),
        h()()(),
        j(),
        f(21, "h1"),
        E(22),
        h(),
        f(23, "p"),
        E(24, "Congratulations! Your app is running. \u{1F389}"),
        h()(),
        v(25, "div", 18),
        f(26, "div", 19)(27, "div", 20),
        Oe(28, $5, 5, 2, "a", 21, k5),
        h(),
        f(30, "div", 22)(31, "a", 23),
        A(),
        f(32, "svg", 24),
        v(33, "path", 25),
        h()(),
        j(),
        f(34, "a", 26),
        A(),
        f(35, "svg", 27),
        v(36, "path", 28),
        h()(),
        j(),
        f(37, "a", 29),
        A(),
        f(38, "svg", 30),
        v(39, "path", 31),
        h()()()()()(),
        j(),
        v(40, "router-outlet")),
        n & 2 &&
          (G(22),
          he("Hello, ", r.title, ""),
          G(6),
          Re(Pe(6, B5, P(1, F5), P(2, L5), P(3, j5), P(4, V5), P(5, U5))));
    },
    dependencies: [se],
    styles: [
      `[_nghost-%COMP%] {
    --bright-blue: oklch(51.01% 0.274 263.83);
    --electric-violet: oklch(53.18% 0.28 296.97);
    --french-violet: oklch(47.66% 0.246 305.88);
    --vivid-pink: oklch(69.02% 0.277 332.77);
    --hot-red: oklch(61.42% 0.238 15.34);
    --orange-red: oklch(63.32% 0.24 31.68);

    --gray-900: oklch(19.37% 0.006 300.98);
    --gray-700: oklch(36.98% 0.014 302.71);
    --gray-400: oklch(70.9% 0.015 304.04);

    --red-to-pink-to-purple-vertical-gradient: linear-gradient(
      180deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --red-to-pink-to-purple-horizontal-gradient: linear-gradient(
      90deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --pill-accent: var(--bright-blue);

    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1[_ngcontent-%COMP%] {
    font-size: 3.125rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    letter-spacing: -0.125rem;
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  p[_ngcontent-%COMP%] {
    margin: 0;
    color: var(--gray-700);
  }

  main[_ngcontent-%COMP%] {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: inherit;
    position: relative;
  }

  .angular-logo[_ngcontent-%COMP%] {
    max-width: 9.2rem;
  }

  .content[_ngcontent-%COMP%] {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 700px;
    margin-bottom: 3rem;
  }

  .content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    margin-top: 1.75rem;
  }

  .content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
    margin-top: 1.5rem;
  }

  .divider[_ngcontent-%COMP%] {
    width: 1px;
    background: var(--red-to-pink-to-purple-vertical-gradient);
    margin-inline: 0.5rem;
  }

  .pill-group[_ngcontent-%COMP%] {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .pill[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    --pill-accent: var(--bright-blue);
    background: color-mix(in srgb, var(--pill-accent) 5%, transparent);
    color: var(--pill-accent);
    padding-inline: 0.75rem;
    padding-block: 0.375rem;
    border-radius: 2.75rem;
    border: 0;
    transition: background 0.3s ease;
    font-family: var(--inter-font);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4rem;
    letter-spacing: -0.00875rem;
    text-decoration: none;
  }

  .pill[_ngcontent-%COMP%]:hover {
    background: color-mix(in srgb, var(--pill-accent) 15%, transparent);
  }

  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 1) {
    --pill-accent: var(--bright-blue);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 2) {
    --pill-accent: var(--french-violet);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 3), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 4), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 5) {
    --pill-accent: var(--hot-red);
  }

  .pill-group[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
    margin-inline-start: 0.25rem;
  }

  .social-links[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    gap: 0.73rem;
    margin-top: 1.5rem;
  }

  .social-links[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    transition: fill 0.3s ease;
    fill: var(--gray-400);
  }

  .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    fill: var(--gray-900);
  }

  @media screen and (max-width: 650px) {
    .content[_ngcontent-%COMP%] {
      flex-direction: column;
      width: max-content;
    }

    .divider[_ngcontent-%COMP%] {
      height: 1px;
      width: 100%;
      background: var(--red-to-pink-to-purple-horizontal-gradient);
      margin-block: 1.5rem;
    }
  }`,
    ],
  });
};
var Qh = [
  { path: "cliente", component: Si },
  { path: "home", component: Ii },
  { path: "inventario", component: _i },
  { path: "login", component: Mi },
  { path: "negocio", component: Ti },
  { path: "recuperacion-cuenta", component: xi },
  { path: "tendero", component: Ni },
];
var Kh = { providers: [Nf({ eventCoalescing: !0 }), Yh(Qh), fh()] };
var Ai = class e {
  title = "my-app";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = ne({
    type: e,
    selectors: [["app-root"]],
    standalone: !0,
    features: [re],
    decls: 41,
    vars: 0,
    consts: [
      [1, "main"],
      [1, "p-3", "mb-3", "border-bottom"],
      [1, "container"],
      [
        1,
        "d-flex",
        "flex-wrap",
        "align-items-center",
        "justify-content-center",
        "justify-content-lg-start",
      ],
      [
        "href",
        "/",
        1,
        "d-flex",
        "align-items-center",
        "mb-2",
        "mb-lg-0",
        "text-dark",
        "text-decoration-none",
      ],
      [
        "width",
        "40",
        "height",
        "32",
        "role",
        "img",
        "aria-label",
        "Bootstrap",
        1,
        "bi",
        "me-2",
      ],
      [0, "xlink", "href", "#bootstrap"],
      [
        1,
        "nav",
        "col-12",
        "col-lg-auto",
        "me-lg-auto",
        "mb-2",
        "justify-content-center",
        "mb-md-0",
      ],
      ["href", "#", 1, "nav-link", "px-2", "link-secondary"],
      ["href", "#", 1, "nav-link", "px-2", "link-dark"],
      [1, "col-12", "col-lg-auto", "mb-3", "mb-lg-0", "me-lg-3"],
      [
        "type",
        "search",
        "placeholder",
        "Search...",
        "aria-label",
        "Search",
        1,
        "form-control",
      ],
      [1, "dropdown", "text-end"],
      [
        "href",
        "#",
        "id",
        "dropdownUser1",
        "data-bs-toggle",
        "dropdown",
        "aria-expanded",
        "false",
        1,
        "d-block",
        "link-dark",
        "text-decoration-none",
        "dropdown-toggle",
      ],
      [
        "src",
        "https://github.com/mdo.png",
        "alt",
        "mdo",
        "width",
        "32",
        "height",
        "32",
        1,
        "rounded-circle",
      ],
      ["aria-labelledby", "dropdownUser1", 1, "dropdown-menu", "text-small"],
      ["href", "#", 1, "dropdown-item"],
      [1, "dropdown-divider"],
    ],
    template: function (n, r) {
      n & 1 &&
        (f(0, "main", 0)(1, "header", 1)(2, "div", 2)(3, "div", 3)(4, "a", 4),
        A(),
        f(5, "svg", 5),
        v(6, "use", 6),
        h()(),
        j(),
        f(7, "ul", 7)(8, "li")(9, "a", 8),
        E(10, "Overview"),
        h()(),
        f(11, "li")(12, "a", 9),
        E(13, "Inventory"),
        h()(),
        f(14, "li")(15, "a", 9),
        E(16, "Customers"),
        h()(),
        f(17, "li")(18, "a", 9),
        E(19, "Products"),
        h()()(),
        f(20, "form", 10),
        v(21, "input", 11),
        h(),
        f(22, "div", 12)(23, "a", 13),
        v(24, "img", 14),
        h(),
        f(25, "ul", 15)(26, "li")(27, "a", 16),
        E(28, "New project..."),
        h()(),
        f(29, "li")(30, "a", 16),
        E(31, "Settings"),
        h()(),
        f(32, "li")(33, "a", 16),
        E(34, "Profile"),
        h()(),
        f(35, "li"),
        v(36, "hr", 17),
        h(),
        f(37, "li")(38, "a", 16),
        E(39, "Sign out"),
        h()()()()()()()(),
        v(40, "router-outlet"));
    },
    dependencies: [se],
    styles: [
      `[_nghost-%COMP%] {
    --bright-blue: oklch(51.01% 0.274 263.83);
    --electric-violet: oklch(53.18% 0.28 296.97);
    --french-violet: oklch(47.66% 0.246 305.88);
    --vivid-pink: oklch(69.02% 0.277 332.77);
    --hot-red: oklch(61.42% 0.238 15.34);
    --orange-red: oklch(63.32% 0.24 31.68);

    --gray-900: oklch(19.37% 0.006 300.98);
    --gray-700: oklch(36.98% 0.014 302.71);
    --gray-400: oklch(70.9% 0.015 304.04);

    --red-to-pink-to-purple-vertical-gradient: linear-gradient(
      180deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --red-to-pink-to-purple-horizontal-gradient: linear-gradient(
      90deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --pill-accent: var(--bright-blue);

    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1[_ngcontent-%COMP%] {
    font-size: 3.125rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    letter-spacing: -0.125rem;
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  p[_ngcontent-%COMP%] {
    margin: 0;
    color: var(--gray-700);
  }

  main[_ngcontent-%COMP%] {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: inherit;
    position: relative;
  }

  .angular-logo[_ngcontent-%COMP%] {
    max-width: 9.2rem;
  }

  .content[_ngcontent-%COMP%] {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 700px;
    margin-bottom: 3rem;
  }

  .content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    margin-top: 1.75rem;
  }

  .content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
    margin-top: 1.5rem;
  }

  .divider[_ngcontent-%COMP%] {
    width: 1px;
    background: var(--red-to-pink-to-purple-vertical-gradient);
    margin-inline: 0.5rem;
  }

  .pill-group[_ngcontent-%COMP%] {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .pill[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    --pill-accent: var(--bright-blue);
    background: color-mix(in srgb, var(--pill-accent) 5%, transparent);
    color: var(--pill-accent);
    padding-inline: 0.75rem;
    padding-block: 0.375rem;
    border-radius: 2.75rem;
    border: 0;
    transition: background 0.3s ease;
    font-family: var(--inter-font);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4rem;
    letter-spacing: -0.00875rem;
    text-decoration: none;
  }

  .pill[_ngcontent-%COMP%]:hover {
    background: color-mix(in srgb, var(--pill-accent) 15%, transparent);
  }

  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 1) {
    --pill-accent: var(--bright-blue);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 2) {
    --pill-accent: var(--french-violet);
  }
  .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 3), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 4), 
   .pill-group[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%]:nth-child(6n + 5) {
    --pill-accent: var(--hot-red);
  }

  .pill-group[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
    margin-inline-start: 0.25rem;
  }

  .social-links[_ngcontent-%COMP%] {
    display: flex;
    align-items: center;
    gap: 0.73rem;
    margin-top: 1.5rem;
  }

  .social-links[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    transition: fill 0.3s ease;
    fill: var(--gray-400);
  }

  .social-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {
    fill: var(--gray-900);
  }

  @media screen and (max-width: 650px) {
    .content[_ngcontent-%COMP%] {
      flex-direction: column;
      width: max-content;
    }

    .divider[_ngcontent-%COMP%] {
      height: 1px;
      width: 100%;
      background: var(--red-to-pink-to-purple-horizontal-gradient);
      margin-block: 1.5rem;
    }
  }`,
    ],
  });
};
uh(Ai, Kh).catch((e) => console.error(e));
