import "./polyfills.server.mjs";
import { a as Y, b as Ge, d as ea, h as er } from "./chunk-5XUXGTUW.mjs";
var Kl = null;
var Wl = 1,
  Lp = Symbol("SIGNAL");
function Oe(e) {
  let t = Kl;
  return (Kl = e), t;
}
function Pp() {
  return Kl;
}
var Ql = {
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
function _0(e) {
  if (!(eu(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Wl)) {
    if (!e.producerMustRecompute(e) && !Zl(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = Wl);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = Wl);
  }
}
function Yl(e) {
  return e && (e.nextProducerIndex = 0), Oe(e);
}
function Fp(e, t) {
  if (
    (Oe(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (eu(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Jl(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function Zl(e) {
  tu(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (_0(n), r !== n.version)) return !0;
  }
  return !1;
}
function Xl(e) {
  if ((tu(e), eu(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Jl(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Jl(e, t) {
  if ((w0(e), e.liveConsumerNode.length === 1 && D0(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      Jl(e.producerNode[r], e.producerIndexOfThis[r]);
  let n = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      i = e.liveConsumerNode[t];
    tu(i), (i.producerIndexOfThis[r] = t);
  }
}
function eu(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function tu(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function w0(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function D0(e) {
  return e.producerNode !== void 0;
}
function T0() {
  throw new Error();
}
var S0 = T0;
function jp(e) {
  S0 = e;
}
function ge(e) {
  return typeof e == "function";
}
function si(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var ta = si(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    },
);
function cs(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var rt = class e {
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
          for (let s of n) s.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (ge(r))
        try {
          r();
        } catch (s) {
          t = s instanceof ta ? s.errors : [s];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let s of i)
          try {
            Up(s);
          } catch (o) {
            (t = t ?? []),
              o instanceof ta ? (t = [...t, ...o.errors]) : t.push(o);
          }
      }
      if (t) throw new ta(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Up(t);
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
    n === t ? (this._parentage = null) : Array.isArray(n) && cs(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && cs(n, t), t instanceof e && t._removeParent(this);
  }
};
rt.EMPTY = (() => {
  let e = new rt();
  return (e.closed = !0), e;
})();
var nu = rt.EMPTY;
function na(e) {
  return (
    e instanceof rt ||
    (e && "closed" in e && ge(e.remove) && ge(e.add) && ge(e.unsubscribe))
  );
}
function Up(e) {
  ge(e) ? e() : e.unsubscribe();
}
var Xt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var oi = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = oi;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = oi;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function ra(e) {
  oi.setTimeout(() => {
    let { onUnhandledError: t } = Xt;
    if (t) t(e);
    else throw e;
  });
}
function ls() {}
var Bp = ru("C", void 0, void 0);
function Hp(e) {
  return ru("E", void 0, e);
}
function Vp(e) {
  return ru("N", e, void 0);
}
function ru(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Mr = null;
function ai(e) {
  if (Xt.useDeprecatedSynchronousErrorHandling) {
    let t = !Mr;
    if ((t && (Mr = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Mr;
      if (((Mr = null), n)) throw r;
    }
  } else e();
}
function $p(e) {
  Xt.useDeprecatedSynchronousErrorHandling &&
    Mr &&
    ((Mr.errorThrown = !0), (Mr.error = e));
}
var Ar = class extends rt {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), na(t) && t.add(this))
          : (this.destination = N0);
    }
    static create(t, n, r) {
      return new ci(t, n, r);
    }
    next(t) {
      this.isStopped ? su(Vp(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? su(Hp(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? su(Bp, this) : ((this.isStopped = !0), this._complete());
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
  C0 = Function.prototype.bind;
function iu(e, t) {
  return C0.call(e, t);
}
var ou = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          ia(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          ia(r);
        }
      else ia(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          ia(n);
        }
    }
  },
  ci = class extends Ar {
    constructor(t, n, r) {
      super();
      let i;
      if (ge(t) || !t)
        i = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let s;
        this && Xt.useDeprecatedNextContext
          ? ((s = Object.create(t)),
            (s.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: t.next && iu(t.next, s),
              error: t.error && iu(t.error, s),
              complete: t.complete && iu(t.complete, s),
            }))
          : (i = t);
      }
      this.destination = new ou(i);
    }
  };
function ia(e) {
  Xt.useDeprecatedSynchronousErrorHandling ? $p(e) : ra(e);
}
function I0(e) {
  throw e;
}
function su(e, t) {
  let { onStoppedNotification: n } = Xt;
  n && oi.setTimeout(() => n(e, t));
}
var N0 = { closed: !0, next: ls, error: I0, complete: ls };
var li = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function It(e) {
  return e;
}
function au(...e) {
  return cu(e);
}
function cu(e) {
  return e.length === 0
    ? It
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, i) => i(r), n);
        };
}
var je = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, i) {
      let s = A0(n) ? n : new ci(n, r, i);
      return (
        ai(() => {
          let { operator: o, source: a } = this;
          s.add(
            o ? o.call(s, a) : a ? this._subscribe(s) : this._trySubscribe(s),
          );
        }),
        s
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
        (r = qp(r)),
        new r((i, s) => {
          let o = new ci({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                s(c), o.unsubscribe();
              }
            },
            error: s,
            complete: i,
          });
          this.subscribe(o);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [li]() {
      return this;
    }
    pipe(...n) {
      return cu(n)(this);
    }
    toPromise(n) {
      return (
        (n = qp(n)),
        new n((r, i) => {
          let s;
          this.subscribe(
            (o) => (s = o),
            (o) => i(o),
            () => r(s),
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function qp(e) {
  var t;
  return (t = e ?? Xt.Promise) !== null && t !== void 0 ? t : Promise;
}
function M0(e) {
  return e && ge(e.next) && ge(e.error) && ge(e.complete);
}
function A0(e) {
  return (e && e instanceof Ar) || (M0(e) && na(e));
}
function lu(e) {
  return ge(e?.lift);
}
function Ce(e) {
  return (t) => {
    if (lu(t))
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
function Ie(e, t, n, r, i) {
  return new uu(e, t, n, r, i);
}
var uu = class extends Ar {
  constructor(t, n, r, i, s, o) {
    super(t),
      (this.onFinalize = s),
      (this.shouldUnsubscribe = o),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              t.error(c);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (c) {
              t.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
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
function ui() {
  return Ce((e, t) => {
    let n = null;
    e._refCount++;
    let r = Ie(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        n = null;
        return;
      }
      let i = e._connection,
        s = n;
      (n = null), i && (!s || i === s) && i.unsubscribe(), t.unsubscribe();
    });
    e.subscribe(r), r.closed || (n = e.connect());
  });
}
var di = class extends je {
  constructor(t, n) {
    super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      lu(t) && (this.lift = t.lift);
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
      t = this._connection = new rt();
      let n = this.getSubject();
      t.add(
        this.source.subscribe(
          Ie(
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
        t.closed && ((this._connection = null), (t = rt.EMPTY));
    }
    return t;
  }
  refCount() {
    return ui()(this);
  }
};
var zp = si(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    },
);
var ut = (() => {
    class e extends je {
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
        let r = new sa(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new zp();
      }
      next(n) {
        ai(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        ai(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        ai(() => {
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
        let { hasError: r, isStopped: i, observers: s } = this;
        return r || i
          ? nu
          : ((this.currentObservers = null),
            s.push(n),
            new rt(() => {
              (this.currentObservers = null), cs(s, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: s } = this;
        r ? n.error(i) : s && n.complete();
      }
      asObservable() {
        let n = new je();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new sa(t, n)), e;
  })(),
  sa = class extends ut {
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
        : nu;
    }
  };
var dt = class extends ut {
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
var Nt = new je((e) => e.complete());
function Gp(e) {
  return e && ge(e.schedule);
}
function Wp(e) {
  return e[e.length - 1];
}
function Kp(e) {
  return ge(Wp(e)) ? e.pop() : void 0;
}
function tr(e) {
  return Gp(Wp(e)) ? e.pop() : void 0;
}
function Yp(e, t, n, r) {
  function i(s) {
    return s instanceof n
      ? s
      : new n(function (o) {
          o(s);
        });
  }
  return new (n || (n = Promise))(function (s, o) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        o(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        o(d);
      }
    }
    function l(u) {
      u.done ? s(u.value) : i(u.value).then(a, c);
    }
    l((r = r.apply(e, t || [])).next());
  });
}
function Qp(e) {
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
function Rr(e) {
  return this instanceof Rr ? ((this.v = e), this) : new Rr(e);
}
function Zp(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    i,
    s = [];
  return (
    (i = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype,
    )),
    a("next"),
    a("throw"),
    a("return", o),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function o(E) {
    return function (S) {
      return Promise.resolve(S).then(E, d);
    };
  }
  function a(E, S) {
    r[E] &&
      ((i[E] = function (M) {
        return new Promise(function (H, L) {
          s.push([E, M, H, L]) > 1 || c(E, M);
        });
      }),
      S && (i[E] = S(i[E])));
  }
  function c(E, S) {
    try {
      l(r[E](S));
    } catch (M) {
      g(s[0][3], M);
    }
  }
  function l(E) {
    E.value instanceof Rr
      ? Promise.resolve(E.value.v).then(u, d)
      : g(s[0][2], E);
  }
  function u(E) {
    c("next", E);
  }
  function d(E) {
    c("throw", E);
  }
  function g(E, S) {
    E(S), s.shift(), s.length && c(s[0][0], s[0][1]);
  }
}
function Xp(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Qp == "function" ? Qp(e) : e[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(s) {
    n[s] =
      e[s] &&
      function (o) {
        return new Promise(function (a, c) {
          (o = e[s](o)), i(a, c, o.done, o.value);
        });
      };
  }
  function i(s, o, a, c) {
    Promise.resolve(c).then(function (l) {
      s({ value: l, done: a });
    }, o);
  }
}
var oa = (e) => e && typeof e.length == "number" && typeof e != "function";
function aa(e) {
  return ge(e?.then);
}
function ca(e) {
  return ge(e[li]);
}
function la(e) {
  return Symbol.asyncIterator && ge(e?.[Symbol.asyncIterator]);
}
function ua(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function R0() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var da = R0();
function fa(e) {
  return ge(e?.[da]);
}
function ha(e) {
  return Zp(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: i } = yield Rr(n.read());
        if (i) return yield Rr(void 0);
        yield yield Rr(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function pa(e) {
  return ge(e?.getReader);
}
function ct(e) {
  if (e instanceof je) return e;
  if (e != null) {
    if (ca(e)) return x0(e);
    if (oa(e)) return O0(e);
    if (aa(e)) return k0(e);
    if (la(e)) return Jp(e);
    if (fa(e)) return L0(e);
    if (pa(e)) return P0(e);
  }
  throw ua(e);
}
function x0(e) {
  return new je((t) => {
    let n = e[li]();
    if (ge(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable",
    );
  });
}
function O0(e) {
  return new je((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function k0(e) {
  return new je((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n),
    ).then(null, ra);
  });
}
function L0(e) {
  return new je((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function Jp(e) {
  return new je((t) => {
    F0(e, t).catch((n) => t.error(n));
  });
}
function P0(e) {
  return Jp(ha(e));
}
function F0(e, t) {
  var n, r, i, s;
  return Yp(this, void 0, void 0, function* () {
    try {
      for (n = Xp(e); (r = yield n.next()), !r.done; ) {
        let o = r.value;
        if ((t.next(o), t.closed)) return;
      }
    } catch (o) {
      i = { error: o };
    } finally {
      try {
        r && !r.done && (s = n.return) && (yield s.call(n));
      } finally {
        if (i) throw i.error;
      }
    }
    t.complete();
  });
}
function Dt(e, t, n, r = 0, i = !1) {
  let s = t.schedule(function () {
    n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(s), !i)) return s;
}
function ma(e, t = 0) {
  return Ce((n, r) => {
    n.subscribe(
      Ie(
        r,
        (i) => Dt(r, e, () => r.next(i), t),
        () => Dt(r, e, () => r.complete(), t),
        (i) => Dt(r, e, () => r.error(i), t),
      ),
    );
  });
}
function ga(e, t = 0) {
  return Ce((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function em(e, t) {
  return ct(e).pipe(ga(t), ma(t));
}
function tm(e, t) {
  return ct(e).pipe(ga(t), ma(t));
}
function nm(e, t) {
  return new je((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function rm(e, t) {
  return new je((n) => {
    let r;
    return (
      Dt(n, t, () => {
        (r = e[da]()),
          Dt(
            n,
            t,
            () => {
              let i, s;
              try {
                ({ value: i, done: s } = r.next());
              } catch (o) {
                n.error(o);
                return;
              }
              s ? n.complete() : n.next(i);
            },
            0,
            !0,
          );
      }),
      () => ge(r?.return) && r.return()
    );
  });
}
function ya(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new je((n) => {
    Dt(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      Dt(
        n,
        t,
        () => {
          r.next().then((i) => {
            i.done ? n.complete() : n.next(i.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function im(e, t) {
  return ya(ha(e), t);
}
function sm(e, t) {
  if (e != null) {
    if (ca(e)) return em(e, t);
    if (oa(e)) return nm(e, t);
    if (aa(e)) return tm(e, t);
    if (la(e)) return ya(e, t);
    if (fa(e)) return rm(e, t);
    if (pa(e)) return im(e, t);
  }
  throw ua(e);
}
function it(e, t) {
  return t ? sm(e, t) : ct(e);
}
function pe(...e) {
  let t = tr(e);
  return it(e, t);
}
function fi(e, t) {
  let n = ge(e) ? e : () => e,
    r = (i) => i.error(n());
  return new je(t ? (i) => t.schedule(r, 0, i) : r);
}
function du(e) {
  return !!e && (e instanceof je || (ge(e.lift) && ge(e.subscribe)));
}
var An = si(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    },
);
function Se(e, t) {
  return Ce((n, r) => {
    let i = 0;
    n.subscribe(
      Ie(r, (s) => {
        r.next(e.call(t, s, i++));
      }),
    );
  });
}
var { isArray: j0 } = Array;
function U0(e, t) {
  return j0(t) ? e(...t) : e(t);
}
function om(e) {
  return Se((t) => U0(e, t));
}
var { isArray: B0 } = Array,
  { getPrototypeOf: H0, prototype: V0, keys: $0 } = Object;
function am(e) {
  if (e.length === 1) {
    let t = e[0];
    if (B0(t)) return { args: t, keys: null };
    if (q0(t)) {
      let n = $0(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function q0(e) {
  return e && typeof e == "object" && H0(e) === V0;
}
function cm(e, t) {
  return e.reduce((n, r, i) => ((n[r] = t[i]), n), {});
}
function va(...e) {
  let t = tr(e),
    n = Kp(e),
    { args: r, keys: i } = am(e);
  if (r.length === 0) return it([], t);
  let s = new je(z0(r, t, i ? (o) => cm(i, o) : It));
  return n ? s.pipe(om(n)) : s;
}
function z0(e, t, n = It) {
  return (r) => {
    lm(
      t,
      () => {
        let { length: i } = e,
          s = new Array(i),
          o = i,
          a = i;
        for (let c = 0; c < i; c++)
          lm(
            t,
            () => {
              let l = it(e[c], t),
                u = !1;
              l.subscribe(
                Ie(
                  r,
                  (d) => {
                    (s[c] = d), u || ((u = !0), a--), a || r.next(n(s.slice()));
                  },
                  () => {
                    --o || r.complete();
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
function lm(e, t, n) {
  e ? Dt(n, e, t) : t();
}
function um(e, t, n, r, i, s, o, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    g = () => {
      d && !c.length && !l && t.complete();
    },
    E = (M) => (l < r ? S(M) : c.push(M)),
    S = (M) => {
      s && t.next(M), l++;
      let H = !1;
      ct(n(M, u++)).subscribe(
        Ie(
          t,
          (L) => {
            i?.(L), s ? E(L) : t.next(L);
          },
          () => {
            H = !0;
          },
          void 0,
          () => {
            if (H)
              try {
                for (l--; c.length && l < r; ) {
                  let L = c.shift();
                  o ? Dt(t, o, () => S(L)) : S(L);
                }
                g();
              } catch (L) {
                t.error(L);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      Ie(t, E, () => {
        (d = !0), g();
      }),
    ),
    () => {
      a?.();
    }
  );
}
function st(e, t, n = 1 / 0) {
  return ge(t)
    ? st((r, i) => Se((s, o) => t(r, s, i, o))(ct(e(r, i))), n)
    : (typeof t == "number" && (n = t), Ce((r, i) => um(r, i, e, n)));
}
function fu(e = 1 / 0) {
  return st(It, e);
}
function dm() {
  return fu(1);
}
function hi(...e) {
  return dm()(it(e, tr(e)));
}
function Ea(e) {
  return new je((t) => {
    ct(e()).subscribe(t);
  });
}
function Ht(e, t) {
  return Ce((n, r) => {
    let i = 0;
    n.subscribe(Ie(r, (s) => e.call(t, s, i++) && r.next(s)));
  });
}
function nr(e) {
  return Ce((t, n) => {
    let r = null,
      i = !1,
      s;
    (r = t.subscribe(
      Ie(n, void 0, void 0, (o) => {
        (s = ct(e(o, nr(e)(t)))),
          r ? (r.unsubscribe(), (r = null), s.subscribe(n)) : (i = !0);
      }),
    )),
      i && (r.unsubscribe(), (r = null), s.subscribe(n));
  });
}
function fm(e, t, n, r, i) {
  return (s, o) => {
    let a = n,
      c = t,
      l = 0;
    s.subscribe(
      Ie(
        o,
        (u) => {
          let d = l++;
          (c = a ? e(c, u, d) : ((a = !0), u)), r && o.next(c);
        },
        i &&
          (() => {
            a && o.next(c), o.complete();
          }),
      ),
    );
  };
}
function xr(e, t) {
  return ge(t) ? st(e, t, 1) : st(e, 1);
}
function rr(e) {
  return Ce((t, n) => {
    let r = !1;
    t.subscribe(
      Ie(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => {
          r || n.next(e), n.complete();
        },
      ),
    );
  });
}
function Rn(e) {
  return e <= 0
    ? () => Nt
    : Ce((t, n) => {
        let r = 0;
        t.subscribe(
          Ie(n, (i) => {
            ++r <= e && (n.next(i), e <= r && n.complete());
          }),
        );
      });
}
function hu(e) {
  return Se(() => e);
}
function ba(e = G0) {
  return Ce((t, n) => {
    let r = !1;
    t.subscribe(
      Ie(
        n,
        (i) => {
          (r = !0), n.next(i);
        },
        () => (r ? n.complete() : n.error(e())),
      ),
    );
  });
}
function G0() {
  return new An();
}
function pi(e) {
  return Ce((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Jt(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Ht((i, s) => e(i, s, r)) : It,
      Rn(1),
      n ? rr(t) : ba(() => new An()),
    );
}
function mi(e) {
  return e <= 0
    ? () => Nt
    : Ce((t, n) => {
        let r = [];
        t.subscribe(
          Ie(
            n,
            (i) => {
              r.push(i), e < r.length && r.shift();
            },
            () => {
              for (let i of r) n.next(i);
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
function pu(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Ht((i, s) => e(i, s, r)) : It,
      mi(1),
      n ? rr(t) : ba(() => new An()),
    );
}
function mu(e, t) {
  return Ce(fm(e, t, arguments.length >= 2, !0));
}
function gu(...e) {
  let t = tr(e);
  return Ce((n, r) => {
    (t ? hi(e, n, t) : hi(e, n)).subscribe(r);
  });
}
function Vt(e, t) {
  return Ce((n, r) => {
    let i = null,
      s = 0,
      o = !1,
      a = () => o && !i && r.complete();
    n.subscribe(
      Ie(
        r,
        (c) => {
          i?.unsubscribe();
          let l = 0,
            u = s++;
          ct(e(c, u)).subscribe(
            (i = Ie(
              r,
              (d) => r.next(t ? t(c, d, u, l++) : d),
              () => {
                (i = null), a();
              },
            )),
          );
        },
        () => {
          (o = !0), a();
        },
      ),
    );
  });
}
function yu(e) {
  return Ce((t, n) => {
    ct(e).subscribe(Ie(n, () => n.complete(), ls)), !n.closed && t.subscribe(n);
  });
}
function ot(e, t, n) {
  let r = ge(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? Ce((i, s) => {
        var o;
        (o = r.subscribe) === null || o === void 0 || o.call(r);
        let a = !0;
        i.subscribe(
          Ie(
            s,
            (c) => {
              var l;
              (l = r.next) === null || l === void 0 || l.call(r, c), s.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                s.complete();
            },
            (c) => {
              var l;
              (a = !1),
                (l = r.error) === null || l === void 0 || l.call(r, c),
                s.error(c);
            },
            () => {
              var c, l;
              a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r);
            },
          ),
        );
      })
    : It;
}
var vu = { JSACTION: "jsaction" };
var Xe = {
    AUXCLICK: "auxclick",
    CHANGE: "change",
    CLICK: "click",
    CLICKMOD: "clickmod",
    CLICKONLY: "clickonly",
    DBLCLICK: "dblclick",
    FOCUS: "focus",
    FOCUSIN: "focusin",
    BLUR: "blur",
    FOCUSOUT: "focusout",
    SUBMIT: "submit",
    KEYDOWN: "keydown",
    KEYPRESS: "keypress",
    KEYUP: "keyup",
    MOUSEUP: "mouseup",
    MOUSEDOWN: "mousedown",
    MOUSEOVER: "mouseover",
    MOUSEOUT: "mouseout",
    MOUSEENTER: "mouseenter",
    MOUSELEAVE: "mouseleave",
    MOUSEMOVE: "mousemove",
    POINTERUP: "pointerup",
    POINTERDOWN: "pointerdown",
    POINTEROVER: "pointerover",
    POINTEROUT: "pointerout",
    POINTERENTER: "pointerenter",
    POINTERLEAVE: "pointerleave",
    POINTERMOVE: "pointermove",
    POINTERCANCEL: "pointercancel",
    GOTPOINTERCAPTURE: "gotpointercapture",
    LOSTPOINTERCAPTURE: "lostpointercapture",
    ERROR: "error",
    LOAD: "load",
    UNLOAD: "unload",
    TOUCHSTART: "touchstart",
    TOUCHEND: "touchend",
    TOUCHMOVE: "touchmove",
    INPUT: "input",
    SCROLL: "scroll",
    TOGGLE: "toggle",
    CUSTOM: "_custom",
  },
  KL = [Xe.MOUSEENTER, Xe.MOUSELEAVE, "pointerenter", "pointerleave"],
  W0 = [
    Xe.CLICK,
    Xe.DBLCLICK,
    Xe.FOCUSIN,
    Xe.FOCUSOUT,
    Xe.KEYDOWN,
    Xe.KEYUP,
    Xe.KEYPRESS,
    Xe.MOUSEOVER,
    Xe.MOUSEOUT,
    Xe.SUBMIT,
    Xe.TOUCHSTART,
    Xe.TOUCHEND,
    Xe.TOUCHMOVE,
    "touchcancel",
    "auxclick",
    "change",
    "compositionstart",
    "compositionupdate",
    "compositionend",
    "beforeinput",
    "input",
    "select",
    "copy",
    "cut",
    "paste",
    "mousedown",
    "mouseup",
    "wheel",
    "contextmenu",
    "dragover",
    "dragenter",
    "dragleave",
    "drop",
    "dragstart",
    "dragend",
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointercancel",
    "pointerover",
    "pointerout",
    "gotpointercapture",
    "lostpointercapture",
    "ended",
    "loadedmetadata",
    "pagehide",
    "pageshow",
    "visibilitychange",
    "beforematch",
  ],
  hm = [Xe.FOCUS, Xe.BLUR, Xe.ERROR, Xe.LOAD, Xe.TOGGLE],
  pm = (e) => hm.indexOf(e) >= 0,
  K0 = W0.concat(hm),
  mm = (e) => K0.indexOf(e) >= 0,
  Q0 = 3,
  Y0 = 13,
  Z0 = 32,
  Mt = { MAC_ENTER: Q0, ENTER: Y0, SPACE: Z0 };
var QL = typeof navigator < "u" && /Macintosh/.test(navigator.userAgent);
var YL =
    typeof navigator < "u" &&
    !/Opera/.test(navigator.userAgent) &&
    /WebKit/.test(navigator.userAgent),
  ZL =
    typeof navigator < "u" &&
    (/MSIE/.test(navigator.userAgent) || /Trident/.test(navigator.userAgent)),
  XL =
    typeof navigator < "u" &&
    !/Opera|WebKit/.test(navigator.userAgent) &&
    /Gecko/.test(navigator.product);
var JL = { Enter: Mt.ENTER, " ": Mt.SPACE },
  eP = {
    A: Mt.ENTER,
    BUTTON: 0,
    CHECKBOX: Mt.SPACE,
    COMBOBOX: Mt.ENTER,
    FILE: 0,
    GRIDCELL: Mt.ENTER,
    LINK: Mt.ENTER,
    LISTBOX: Mt.ENTER,
    MENU: 0,
    MENUBAR: 0,
    MENUITEM: 0,
    MENUITEMCHECKBOX: 0,
    MENUITEMRADIO: 0,
    OPTION: 0,
    RADIO: Mt.SPACE,
    RADIOGROUP: Mt.SPACE,
    RESET: 0,
    SUBMIT: 0,
    SWITCH: Mt.SPACE,
    TAB: 0,
    TREE: Mt.ENTER,
    TREEITEM: Mt.ENTER,
  };
var tP = typeof navigator < "u" && /iPhone|iPad|iPod/.test(navigator.userAgent);
var nP = Xe.CLICK;
var rg = "https://g.co/ng/security#xss",
  G = class extends Error {
    constructor(t, n) {
      super(sc(t, n)), (this.code = t);
    }
  };
function sc(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function oc(e) {
  return { toString: e }.toString();
}
var _a = "__parameters__";
function X0(e) {
  return function (...n) {
    if (e) {
      let r = e(...n);
      for (let i in r) this[i] = r[i];
    }
  };
}
function J0(e, t, n) {
  return oc(() => {
    let r = X0(t);
    function i(...s) {
      if (this instanceof i) return r.apply(this, s), this;
      let o = new i(...s);
      return (a.annotation = o), a;
      function a(c, l, u) {
        let d = c.hasOwnProperty(_a)
          ? c[_a]
          : Object.defineProperty(c, _a, { value: [] })[_a];
        for (; d.length <= u; ) d.push(null);
        return (d[u] = d[u] || []).push(o), c;
      }
    }
    return (
      n && (i.prototype = Object.create(n.prototype)),
      (i.prototype.ngMetadataName = e),
      (i.annotationCls = i),
      i
    );
  });
}
var ig = globalThis;
function Ue(e) {
  for (let t in e) if (e[t] === Ue) return t;
  throw Error("Could not find renamed property on target object.");
}
function At(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(At).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function gm(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
      ? e
      : e + " " + t;
}
var ew = Ue({ __forward_ref__: Ue });
function sg(e) {
  return (
    (e.__forward_ref__ = sg),
    (e.toString = function () {
      return At(this());
    }),
    e
  );
}
function qt(e) {
  return og(e) ? e() : e;
}
function og(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(ew) && e.__forward_ref__ === sg
  );
}
function ne(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function ac(e) {
  return ym(e, cg) || ym(e, lg);
}
function ag(e) {
  return ac(e) !== null;
}
function ym(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function tw(e) {
  let t = e && (e[cg] || e[lg]);
  return t || null;
}
function vm(e) {
  return e && (e.hasOwnProperty(Em) || e.hasOwnProperty(nw)) ? e[Em] : null;
}
var cg = Ue({ ɵprov: Ue }),
  Em = Ue({ ɵinj: Ue }),
  lg = Ue({ ngInjectableDef: Ue }),
  nw = Ue({ ngInjectorDef: Ue }),
  ie = class {
    constructor(t, n) {
      (this._desc = t),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = ne({
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
function ug(e) {
  return e && !!e.ɵproviders;
}
var rw = Ue({ ɵcmp: Ue }),
  iw = Ue({ ɵdir: Ue }),
  sw = Ue({ ɵpipe: Ue }),
  ow = Ue({ ɵmod: Ue }),
  Ra = Ue({ ɵfac: Ue }),
  ds = Ue({ __NG_ELEMENT_ID__: Ue }),
  bm = Ue({ __NG_ENV_ID__: Ue });
function cc(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function aw(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
      ? e.type.name || e.type.toString()
      : cc(e);
}
function cw(e, t) {
  let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new G(-200, e);
}
function _d(e, t) {
  throw new G(-201, !1);
}
var Ee = (function (e) {
    return (
      (e[(e.Default = 0)] = "Default"),
      (e[(e.Host = 1)] = "Host"),
      (e[(e.Self = 2)] = "Self"),
      (e[(e.SkipSelf = 4)] = "SkipSelf"),
      (e[(e.Optional = 8)] = "Optional"),
      e
    );
  })(Ee || {}),
  Ru;
function dg() {
  return Ru;
}
function $t(e) {
  let t = Ru;
  return (Ru = e), t;
}
function fg(e, t, n) {
  let r = ac(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & Ee.Optional) return null;
  if (t !== void 0) return t;
  _d(e, "Injector");
}
var lw = {},
  ms = lw,
  xu = "__NG_DI_FLAG__",
  xa = "ngTempTokenPath",
  uw = "ngTokenPath",
  dw = /\n/gm,
  fw = "\u0275",
  _m = "__source",
  bi;
function hw() {
  return bi;
}
function ir(e) {
  let t = bi;
  return (bi = e), t;
}
function pw(e, t = Ee.Default) {
  if (bi === void 0) throw new G(-203, !1);
  return bi === null
    ? fg(e, void 0, t)
    : bi.get(e, t & Ee.Optional ? null : void 0, t);
}
function le(e, t = Ee.Default) {
  return (dg() || pw)(qt(e), t);
}
function z(e, t = Ee.Default) {
  return le(e, lc(t));
}
function lc(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function Ou(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = qt(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new G(900, !1);
      let i,
        s = Ee.Default;
      for (let o = 0; o < r.length; o++) {
        let a = r[o],
          c = gw(a);
        typeof c == "number" ? (c === -1 ? (i = a.token) : (s |= c)) : (i = a);
      }
      t.push(le(i, s));
    } else t.push(le(r));
  }
  return t;
}
function mw(e, t) {
  return (e[xu] = t), (e.prototype[xu] = t), e;
}
function gw(e) {
  return e[xu];
}
function yw(e, t, n, r) {
  let i = e[xa];
  throw (
    (t[_m] && i.unshift(t[_m]),
    (e.message = vw(
      `
` + e.message,
      i,
      n,
      r,
    )),
    (e[uw] = i),
    (e[xa] = null),
    e)
  );
}
function vw(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == fw
      ? e.slice(2)
      : e;
  let i = At(t);
  if (Array.isArray(t)) i = t.map(At).join(" -> ");
  else if (typeof t == "object") {
    let s = [];
    for (let o in t)
      if (t.hasOwnProperty(o)) {
        let a = t[o];
        s.push(o + ":" + (typeof a == "string" ? JSON.stringify(a) : At(a)));
      }
    i = `{${s.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${e.replace(
    dw,
    `
  `,
  )}`;
}
var uc = mw(J0("Optional"), 8);
function wi(e, t) {
  let n = e.hasOwnProperty(Ra);
  return n ? e[Ra] : null;
}
function wd(e, t) {
  e.forEach((n) => (Array.isArray(n) ? wd(n, t) : t(n)));
}
function hg(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function Oa(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
var gs = {},
  cr = [],
  Lr = new ie(""),
  pg = new ie("", -1),
  mg = new ie(""),
  ka = class {
    get(t, n = ms) {
      if (n === ms) {
        let r = new Error(`NullInjectorError: No provider for ${At(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  gg = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(gg || {}),
  rn = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(rn || {}),
  lr = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(lr || {});
function Ew(e, t, n) {
  let r = e.length;
  for (;;) {
    let i = e.indexOf(t, n);
    if (i === -1) return i;
    if (i === 0 || e.charCodeAt(i - 1) <= 32) {
      let s = t.length;
      if (i + s === r || e.charCodeAt(i + s) <= 32) return i;
    }
    n = i + 1;
  }
}
function ku(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let i = n[r];
    if (typeof i == "number") {
      if (i !== 0) break;
      r++;
      let s = n[r++],
        o = n[r++],
        a = n[r++];
      e.setAttribute(t, o, a, s);
    } else {
      let s = i,
        o = n[++r];
      _w(s) ? e.setProperty(t, s, o) : e.setAttribute(t, s, o), r++;
    }
  }
  return r;
}
function bw(e) {
  return e === 3 || e === 4 || e === 6;
}
function _w(e) {
  return e.charCodeAt(0) === 64;
}
function Dd(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let i = t[r];
        typeof i == "number"
          ? (n = i)
          : n === 0 ||
            (n === -1 || n === 2
              ? wm(e, n, i, null, t[++r])
              : wm(e, n, i, null, null));
      }
    }
  return e;
}
function wm(e, t, n, r, i) {
  let s = 0,
    o = e.length;
  if (t === -1) o = -1;
  else
    for (; s < e.length; ) {
      let a = e[s++];
      if (typeof a == "number") {
        if (a === t) {
          o = -1;
          break;
        } else if (a > t) {
          o = s - 1;
          break;
        }
      }
    }
  for (; s < e.length; ) {
    let a = e[s];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        i !== null && (e[s + 1] = i);
        return;
      } else if (r === e[s + 1]) {
        e[s + 2] = i;
        return;
      }
    }
    s++, r !== null && s++, i !== null && s++;
  }
  o !== -1 && (e.splice(o, 0, t), (s = o + 1)),
    e.splice(s++, 0, n),
    r !== null && e.splice(s++, 0, r),
    i !== null && e.splice(s++, 0, i);
}
var yg = "ng-template";
function ww(e, t, n, r) {
  let i = 0;
  if (r) {
    for (; i < t.length && typeof t[i] == "string"; i += 2)
      if (t[i] === "class" && Ew(t[i + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (Td(e)) return !1;
  if (((i = t.indexOf(1, i)), i > -1)) {
    let s;
    for (; ++i < t.length && typeof (s = t[i]) == "string"; )
      if (s.toLowerCase() === n) return !0;
  }
  return !1;
}
function Td(e) {
  return e.type === 4 && e.value !== yg;
}
function Dw(e, t, n) {
  let r = e.type === 4 && !n ? yg : e.value;
  return t === r;
}
function Tw(e, t, n) {
  let r = 4,
    i = e.attrs,
    s = i !== null ? Iw(i) : 0,
    o = !1;
  for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
      if (!o && !en(r) && !en(c)) return !1;
      if (o && en(c)) continue;
      (o = !1), (r = c | (r & 1));
      continue;
    }
    if (!o)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !Dw(e, c, n)) || (c === "" && t.length === 1))
        ) {
          if (en(r)) return !1;
          o = !0;
        }
      } else if (r & 8) {
        if (i === null || !ww(e, i, c, n)) {
          if (en(r)) return !1;
          o = !0;
        }
      } else {
        let l = t[++a],
          u = Sw(c, i, Td(e), n);
        if (u === -1) {
          if (en(r)) return !1;
          o = !0;
          continue;
        }
        if (l !== "") {
          let d;
          if (
            (u > s ? (d = "") : (d = i[u + 1].toLowerCase()), r & 2 && l !== d)
          ) {
            if (en(r)) return !1;
            o = !0;
          }
        }
      }
  }
  return en(r) || o;
}
function en(e) {
  return (e & 1) === 0;
}
function Sw(e, t, n, r) {
  if (t === null) return -1;
  let i = 0;
  if (r || !n) {
    let s = !1;
    for (; i < t.length; ) {
      let o = t[i];
      if (o === e) return i;
      if (o === 3 || o === 6) s = !0;
      else if (o === 1 || o === 2) {
        let a = t[++i];
        for (; typeof a == "string"; ) a = t[++i];
        continue;
      } else {
        if (o === 4) break;
        if (o === 0) {
          i += 4;
          continue;
        }
      }
      i += s ? 1 : 2;
    }
    return -1;
  } else return Nw(t, e);
}
function Cw(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Tw(e, t[r], n)) return !0;
  return !1;
}
function Iw(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (bw(n)) return t;
  }
  return e.length;
}
function Nw(e, t) {
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
function Dm(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function Mw(e) {
  let t = e[0],
    n = 1,
    r = 2,
    i = "",
    s = !1;
  for (; n < e.length; ) {
    let o = e[n];
    if (typeof o == "string")
      if (r & 2) {
        let a = e[++n];
        i += "[" + o + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (i += "." + o) : r & 4 && (i += " " + o);
    else
      i !== "" && !en(o) && ((t += Dm(s, i)), (i = "")),
        (r = o),
        (s = s || !en(r));
    n++;
  }
  return i !== "" && (t += Dm(s, i)), t;
}
function Aw(e) {
  return e.map(Mw).join(",");
}
function Rw(e) {
  let t = [],
    n = [],
    r = 1,
    i = 2;
  for (; r < e.length; ) {
    let s = e[r];
    if (typeof s == "string")
      i === 2 ? s !== "" && t.push(s, e[++r]) : i === 8 && n.push(s);
    else {
      if (!en(i)) break;
      i = s;
    }
    r++;
  }
  return { attrs: t, classes: n };
}
function vg(e) {
  return oc(() => {
    let t = Dg(e),
      n = Ge(Y({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === gg.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || rn.Emulated,
        styles: e.styles || cr,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    Tg(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = Sm(r, !1)), (n.pipeDefs = Sm(r, !0)), (n.id = kw(n)), n
    );
  });
}
function xw(e) {
  return ur(e) || Eg(e);
}
function Ow(e) {
  return e !== null;
}
function Tm(e, t) {
  if (e == null) return gs;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let i = e[r],
        s,
        o,
        a = lr.None;
      Array.isArray(i)
        ? ((a = i[0]), (s = i[1]), (o = i[2] ?? s))
        : ((s = i), (o = i)),
        t ? ((n[s] = a !== lr.None ? [r, a] : r), (t[s] = o)) : (n[s] = r);
    }
  return n;
}
function Sd(e) {
  return oc(() => {
    let t = Dg(e);
    return Tg(t), t;
  });
}
function ur(e) {
  return e[rw] || null;
}
function Eg(e) {
  return e[iw] || null;
}
function bg(e) {
  return e[sw] || null;
}
function _g(e) {
  let t = ur(e) || Eg(e) || bg(e);
  return t !== null ? t.standalone : !1;
}
function wg(e, t) {
  let n = e[ow] || null;
  if (!n && t === !0)
    throw new Error(`Type ${At(e)} does not have '\u0275mod' property.`);
  return n;
}
function Dg(e) {
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
    inputConfig: e.inputs || gs,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || cr,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Tm(e.inputs, t),
    outputs: Tm(e.outputs),
    debugInfo: null,
  };
}
function Tg(e) {
  e.features?.forEach((t) => t(e));
}
function Sm(e, t) {
  if (!e) return null;
  let n = t ? bg : xw;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(Ow);
}
function kw(e) {
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
  for (let i of n) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function kn(e) {
  return { ɵproviders: e };
}
function Lw(...e) {
  return { ɵproviders: Sg(!0, e), ɵfromNgModule: !0 };
}
function Sg(e, ...t) {
  let n = [],
    r = new Set(),
    i,
    s = (o) => {
      n.push(o);
    };
  return (
    wd(t, (o) => {
      let a = o;
      Lu(a, s, [], r) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && Cg(i, s),
    n
  );
}
function Cg(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: i } = e[n];
    Cd(i, (s) => {
      t(s, r);
    });
  }
}
function Lu(e, t, n, r) {
  if (((e = qt(e)), !e)) return !1;
  let i = null,
    s = vm(e),
    o = !s && ur(e);
  if (!s && !o) {
    let c = e.ngModule;
    if (((s = vm(c)), s)) i = c;
    else return !1;
  } else {
    if (o && !o.standalone) return !1;
    i = e;
  }
  let a = r.has(i);
  if (o) {
    if (a) return !1;
    if ((r.add(i), o.dependencies)) {
      let c =
        typeof o.dependencies == "function" ? o.dependencies() : o.dependencies;
      for (let l of c) Lu(l, t, n, r);
    }
  } else if (s) {
    if (s.imports != null && !a) {
      r.add(i);
      let l;
      try {
        wd(s.imports, (u) => {
          Lu(u, t, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && Cg(l, t);
    }
    if (!a) {
      let l = wi(i) || (() => new i());
      t({ provide: i, useFactory: l, deps: cr }, i),
        t({ provide: mg, useValue: i, multi: !0 }, i),
        t({ provide: Lr, useValue: () => le(i), multi: !0 }, i);
    }
    let c = s.providers;
    if (c != null && !a) {
      let l = e;
      Cd(c, (u) => {
        t(u, l);
      });
    }
  } else return !1;
  return i !== e && e.providers !== void 0;
}
function Cd(e, t) {
  for (let n of e)
    ug(n) && (n = n.ɵproviders), Array.isArray(n) ? Cd(n, t) : t(n);
}
var Pw = Ue({ provide: String, useValue: Ue });
function Ig(e) {
  return e !== null && typeof e == "object" && Pw in e;
}
function Fw(e) {
  return !!(e && e.useExisting);
}
function jw(e) {
  return !!(e && e.useFactory);
}
function Pu(e) {
  return typeof e == "function";
}
var dc = new ie(""),
  Ca = {},
  Uw = {},
  Eu;
function Id() {
  return Eu === void 0 && (Eu = new ka()), Eu;
}
var Gt = class {},
  ys = class extends Gt {
    get destroyed() {
      return this._destroyed;
    }
    constructor(t, n, r, i) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        ju(t, (o) => this.processProvider(o)),
        this.records.set(pg, gi(void 0, this)),
        i.has("environment") && this.records.set(Gt, gi(void 0, this));
      let s = this.records.get(dc);
      s != null && typeof s.value == "string" && this.scopes.add(s.value),
        (this.injectorDefTypes = new Set(this.get(mg, cr, Ee.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let t = Oe(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          Oe(t);
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
      let n = ir(this),
        r = $t(void 0),
        i;
      try {
        return t();
      } finally {
        ir(n), $t(r);
      }
    }
    get(t, n = ms, r = Ee.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(bm))) return t[bm](this);
      r = lc(r);
      let i,
        s = ir(this),
        o = $t(void 0);
      try {
        if (!(r & Ee.SkipSelf)) {
          let c = this.records.get(t);
          if (c === void 0) {
            let l = zw(t) && ac(t);
            l && this.injectableDefInScope(l)
              ? (c = gi(Fu(t), Ca))
              : (c = null),
              this.records.set(t, c);
          }
          if (c != null) return this.hydrate(t, c);
        }
        let a = r & Ee.Self ? Id() : this.parent;
        return (n = r & Ee.Optional && n === ms ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[xa] = a[xa] || []).unshift(At(t)), s)) throw a;
          return yw(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        $t(o), ir(s);
      }
    }
    resolveInjectorInitializers() {
      let t = Oe(null),
        n = ir(this),
        r = $t(void 0),
        i;
      try {
        let s = this.get(Lr, cr, Ee.Self);
        for (let o of s) o();
      } finally {
        ir(n), $t(r), Oe(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(At(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new G(205, !1);
    }
    processProvider(t) {
      t = qt(t);
      let n = Pu(t) ? t : qt(t && t.provide),
        r = Hw(t);
      if (!Pu(t) && t.multi === !0) {
        let i = this.records.get(n);
        i ||
          ((i = gi(void 0, Ca, !0)),
          (i.factory = () => Ou(i.multi)),
          this.records.set(n, i)),
          (n = t),
          i.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n) {
      let r = Oe(null);
      try {
        return (
          n.value === Ca && ((n.value = Uw), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            qw(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        Oe(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = qt(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function Fu(e) {
  let t = ac(e),
    n = t !== null ? t.factory : wi(e);
  if (n !== null) return n;
  if (e instanceof ie) throw new G(204, !1);
  if (e instanceof Function) return Bw(e);
  throw new G(204, !1);
}
function Bw(e) {
  if (e.length > 0) throw new G(204, !1);
  let n = tw(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function Hw(e) {
  if (Ig(e)) return gi(void 0, e.useValue);
  {
    let t = Vw(e);
    return gi(t, Ca);
  }
}
function Vw(e, t, n) {
  let r;
  if (Pu(e)) {
    let i = qt(e);
    return wi(i) || Fu(i);
  } else if (Ig(e)) r = () => qt(e.useValue);
  else if (jw(e)) r = () => e.useFactory(...Ou(e.deps || []));
  else if (Fw(e)) r = () => le(qt(e.useExisting));
  else {
    let i = qt(e && (e.useClass || e.provide));
    if ($w(e)) r = () => new i(...Ou(e.deps));
    else return wi(i) || Fu(i);
  }
  return r;
}
function gi(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function $w(e) {
  return !!e.deps;
}
function qw(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function zw(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof ie);
}
function ju(e, t) {
  for (let n of e)
    Array.isArray(n) ? ju(n, t) : n && ug(n) ? ju(n.ɵproviders, t) : t(n);
}
function gn(e, t) {
  e instanceof ys && e.assertNotDestroyed();
  let n,
    r = ir(e),
    i = $t(void 0);
  try {
    return t();
  } finally {
    ir(r), $t(i);
  }
}
function Gw() {
  return dg() !== void 0 || hw() != null;
}
function Ww(e) {
  let t = ig.ng;
  if (t && t.ɵcompilerFacade) return t.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function Kw(e) {
  return typeof e == "function";
}
var Je = 0,
  ue = 1,
  de = 2,
  ht = 3,
  tn = 4,
  on = 5,
  sn = 6,
  Uu = 7,
  Rt = 8,
  Di = 9,
  mn = 10,
  et = 11,
  vs = 12,
  Cm = 13,
  ks = 14,
  Tt = 15,
  Ti = 16,
  yi = 17,
  Si = 18,
  fc = 19,
  Ng = 20,
  or = 21,
  bu = 22,
  zt = 23,
  $e = 25,
  Nd = 1,
  Es = 6,
  xn = 7,
  La = 8,
  Pa = 9,
  ft = 10,
  Fa = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(Fa || {});
function nn(e) {
  return Array.isArray(e) && typeof e[Nd] == "object";
}
function xt(e) {
  return Array.isArray(e) && e[Nd] === !0;
}
function Mg(e) {
  return (e.flags & 4) !== 0;
}
function Ai(e) {
  return e.componentOffset > -1;
}
function Ag(e) {
  return (e.flags & 1) === 1;
}
function Ls(e) {
  return !!e.template;
}
function bs(e) {
  return (e[de] & 512) !== 0;
}
function Rg(e) {
  return (e.type & 16) === 16;
}
function Qw(e) {
  return (e[de] & 32) === 32;
}
var Bu = class {
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function xg(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function hc() {
  return Og;
}
function Og(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = Zw), Yw;
}
hc.ngInherit = !0;
function Yw() {
  let e = Lg(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === gs) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function Zw(e, t, n, r, i) {
  let s = this.declaredInputs[r],
    o = Lg(e) || Xw(e, { previous: gs, current: null }),
    a = o.current || (o.current = {}),
    c = o.previous,
    l = c[s];
  (a[s] = new Bu(l && l.currentValue, n, c === gs)), xg(e, t, i, n);
}
var kg = "__ngSimpleChanges__";
function Lg(e) {
  return e[kg] || null;
}
function Xw(e, t) {
  return (e[kg] = t);
}
var Im = null;
var sr = function (e, t, n) {
    Im?.(e, t, n);
  },
  Pg = "svg",
  Jw = "math";
function We(e) {
  for (; Array.isArray(e); ) e = e[Je];
  return e;
}
function Fg(e) {
  for (; Array.isArray(e); ) {
    if (typeof e[Nd] == "object") return e;
    e = e[Je];
  }
  return null;
}
function eD(e, t) {
  return We(t[e]);
}
function an(e, t) {
  return We(t[e.index]);
}
function Md(e, t) {
  return e.data[t];
}
function Br(e, t) {
  let n = t[e];
  return nn(n) ? n : n[Je];
}
function Ad(e) {
  return (e[de] & 128) === 128;
}
function tD(e) {
  return xt(e[ht]);
}
function _s(e, t) {
  return t == null ? null : e[t];
}
function jg(e) {
  e[yi] = 0;
}
function Ug(e) {
  e[de] & 1024 || ((e[de] |= 1024), Ad(e) && mc(e));
}
function pc(e) {
  return !!(e[de] & 9216 || e[zt]?.dirty);
}
function Hu(e) {
  e[mn].changeDetectionScheduler?.notify(8),
    e[de] & 64 && (e[de] |= 1024),
    pc(e) && mc(e);
}
function mc(e) {
  e[mn].changeDetectionScheduler?.notify(0);
  let t = Pr(e);
  for (; t !== null && !(t[de] & 8192 || ((t[de] |= 8192), !Ad(t))); )
    t = Pr(t);
}
function Bg(e, t) {
  if ((e[de] & 256) === 256) throw new G(911, !1);
  e[or] === null && (e[or] = []), e[or].push(t);
}
function nD(e, t) {
  if (e[or] === null) return;
  let n = e[or].indexOf(t);
  n !== -1 && e[or].splice(n, 1);
}
function Pr(e) {
  let t = e[ht];
  return xt(t) ? t[ht] : t;
}
var Ne = {
  lFrame: Yg(null),
  bindingsEnabled: !0,
  skipHydrationRootTNode: null,
};
var Hg = !1;
function rD() {
  return Ne.lFrame.elementDepthCount;
}
function iD() {
  Ne.lFrame.elementDepthCount++;
}
function sD() {
  Ne.lFrame.elementDepthCount--;
}
function Vg() {
  return Ne.bindingsEnabled;
}
function Ps() {
  return Ne.skipHydrationRootTNode !== null;
}
function oD(e) {
  return Ne.skipHydrationRootTNode === e;
}
function aD(e) {
  Ne.skipHydrationRootTNode = e;
}
function cD() {
  Ne.skipHydrationRootTNode = null;
}
function tt() {
  return Ne.lFrame.lView;
}
function Ri() {
  return Ne.lFrame.tView;
}
function yn() {
  let e = $g();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function $g() {
  return Ne.lFrame.currentTNode;
}
function lD() {
  let e = Ne.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Fs(e, t) {
  let n = Ne.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function qg() {
  return Ne.lFrame.isParent;
}
function uD() {
  Ne.lFrame.isParent = !1;
}
function zg() {
  return Hg;
}
function Nm(e) {
  Hg = e;
}
function Gg() {
  let e = Ne.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function dD(e) {
  return (Ne.lFrame.bindingIndex = e);
}
function Rd() {
  return Ne.lFrame.bindingIndex++;
}
function fD() {
  return Ne.lFrame.inI18n;
}
function hD(e, t) {
  let n = Ne.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), Vu(t);
}
function pD() {
  return Ne.lFrame.currentDirectiveIndex;
}
function Vu(e) {
  Ne.lFrame.currentDirectiveIndex = e;
}
function Wg(e) {
  Ne.lFrame.currentQueryIndex = e;
}
function mD(e) {
  let t = e[ue];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[on] : null;
}
function Kg(e, t, n) {
  if (n & Ee.SkipSelf) {
    let i = t,
      s = e;
    for (; (i = i.parent), i === null && !(n & Ee.Host); )
      if (((i = mD(s)), i === null || ((s = s[ks]), i.type & 10))) break;
    if (i === null) return !1;
    (t = i), (e = s);
  }
  let r = (Ne.lFrame = Qg());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function xd(e) {
  let t = Qg(),
    n = e[ue];
  (Ne.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function Qg() {
  let e = Ne.lFrame,
    t = e === null ? null : e.child;
  return t === null ? Yg(e) : t;
}
function Yg(e) {
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
function Zg() {
  let e = Ne.lFrame;
  return (Ne.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var Xg = Zg;
function Od() {
  let e = Zg();
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
function gc() {
  return Ne.lFrame.selectedIndex;
}
function Fr(e) {
  Ne.lFrame.selectedIndex = e;
}
function gD() {
  let e = Ne.lFrame;
  return Md(e.tView, e.selectedIndex);
}
function wP() {
  Ne.lFrame.currentNamespace = Pg;
}
function DP() {
  yD();
}
function yD() {
  Ne.lFrame.currentNamespace = null;
}
function Jg() {
  return Ne.lFrame.currentNamespace;
}
var ey = !0;
function kd() {
  return ey;
}
function hr(e) {
  ey = e;
}
function vD(e, t, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: s } = t.type.prototype;
  if (r) {
    let o = Og(t);
    (n.preOrderHooks ??= []).push(e, o),
      (n.preOrderCheckHooks ??= []).push(e, o);
  }
  i && (n.preOrderHooks ??= []).push(0 - e, i),
    s &&
      ((n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s));
}
function Ld(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let s = e.data[n].type.prototype,
      {
        ngAfterContentInit: o,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = s;
    o && (e.contentHooks ??= []).push(-n, o),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      c && (e.viewHooks ??= []).push(-n, c),
      l &&
        ((e.viewHooks ??= []).push(n, l), (e.viewCheckHooks ??= []).push(n, l)),
      u != null && (e.destroyHooks ??= []).push(n, u);
  }
}
function Ia(e, t, n) {
  ty(e, t, 3, n);
}
function Na(e, t, n, r) {
  (e[de] & 3) === n && ty(e, t, n, r);
}
function _u(e, t) {
  let n = e[de];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[de] = n));
}
function ty(e, t, n, r) {
  let i = r !== void 0 ? e[yi] & 65535 : 0,
    s = r ?? -1,
    o = t.length - 1,
    a = 0;
  for (let c = i; c < o; c++)
    if (typeof t[c + 1] == "number") {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      t[c] < 0 && (e[yi] += 65536),
        (a < s || s == -1) &&
          (ED(e, n, t, c), (e[yi] = (e[yi] & 4294901760) + c + 2)),
        c++;
}
function Mm(e, t) {
  sr(4, e, t);
  let n = Oe(null);
  try {
    t.call(e);
  } finally {
    Oe(n), sr(5, e, t);
  }
}
function ED(e, t, n, r) {
  let i = n[r] < 0,
    s = n[r + 1],
    o = i ? -n[r] : n[r],
    a = e[o];
  i
    ? e[de] >> 14 < e[yi] >> 16 &&
      (e[de] & 3) === t &&
      ((e[de] += 16384), Mm(a, s))
    : Mm(a, s);
}
var _i = -1,
  ws = class {
    constructor(t, n, r) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function bD(e) {
  return e instanceof ws;
}
function ny(e) {
  return (
    e != null &&
    typeof e == "object" &&
    (e.insertBeforeIndex === null ||
      typeof e.insertBeforeIndex == "number" ||
      Array.isArray(e.insertBeforeIndex))
  );
}
function _D(e) {
  return !!(e.type & 128);
}
function wD(e) {
  return (e.flags & 8) !== 0;
}
function DD(e) {
  return (e.flags & 16) !== 0;
}
var wu = {},
  $u = class {
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = lc(r);
      let i = this.injector.get(t, wu, r);
      return i !== wu || n === wu ? i : this.parentInjector.get(t, n, r);
    }
  };
function ry(e) {
  return e !== _i;
}
function ja(e) {
  return e & 32767;
}
function TD(e) {
  return e >> 16;
}
function Ua(e, t) {
  let n = TD(e),
    r = t;
  for (; n > 0; ) (r = r[ks]), n--;
  return r;
}
var qu = !0;
function Am(e) {
  let t = qu;
  return (qu = e), t;
}
var SD = 256,
  iy = SD - 1,
  sy = 5,
  CD = 0,
  pn = {};
function ID(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(ds) && (r = n[ds]),
    r == null && (r = n[ds] = CD++);
  let i = r & iy,
    s = 1 << i;
  t.data[e + (i >> sy)] |= s;
}
function oy(e, t) {
  let n = ay(e, t);
  if (n !== -1) return n;
  let r = t[ue];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Du(r.data, e),
    Du(t, null),
    Du(r.blueprint, null));
  let i = Pd(e, t),
    s = e.injectorIndex;
  if (ry(i)) {
    let o = ja(i),
      a = Ua(i, t),
      c = a[ue].data;
    for (let l = 0; l < 8; l++) t[s + l] = a[o + l] | c[o + l];
  }
  return (t[s + 8] = i), s;
}
function Du(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function ay(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Pd(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    i = t;
  for (; i !== null; ) {
    if (((r = fy(i)), r === null)) return _i;
    if ((n++, (i = i[ks]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return _i;
}
function ND(e, t, n) {
  ID(e, t, n);
}
function cy(e, t, n) {
  if (n & Ee.Optional || e !== void 0) return e;
  _d(t, "NodeInjector");
}
function ly(e, t, n, r) {
  if (
    (n & Ee.Optional && r === void 0 && (r = null), !(n & (Ee.Self | Ee.Host)))
  ) {
    let i = e[Di],
      s = $t(void 0);
    try {
      return i ? i.get(t, r, n & Ee.Optional) : fg(t, r, n & Ee.Optional);
    } finally {
      $t(s);
    }
  }
  return cy(r, t, n);
}
function uy(e, t, n, r = Ee.Default, i) {
  if (e !== null) {
    if (t[de] & 2048 && !(r & Ee.Self)) {
      let o = OD(e, t, n, r, pn);
      if (o !== pn) return o;
    }
    let s = dy(e, t, n, r, pn);
    if (s !== pn) return s;
  }
  return ly(t, n, r, i);
}
function dy(e, t, n, r, i) {
  let s = RD(n);
  if (typeof s == "function") {
    if (!Kg(t, e, r)) return r & Ee.Host ? cy(i, n, r) : ly(t, n, r, i);
    try {
      let o;
      if (((o = s(r)), o == null && !(r & Ee.Optional))) _d(n);
      else return o;
    } finally {
      Xg();
    }
  } else if (typeof s == "number") {
    let o = null,
      a = ay(e, t),
      c = _i,
      l = r & Ee.Host ? t[Tt][on] : null;
    for (
      (a === -1 || r & Ee.SkipSelf) &&
      ((c = a === -1 ? Pd(e, t) : t[a + 8]),
      c === _i || !xm(r, !1)
        ? (a = -1)
        : ((o = t[ue]), (a = ja(c)), (t = Ua(c, t))));
      a !== -1;

    ) {
      let u = t[ue];
      if (Rm(s, a, u.data)) {
        let d = MD(a, t, n, o, r, l);
        if (d !== pn) return d;
      }
      (c = t[a + 8]),
        c !== _i && xm(r, t[ue].data[a + 8] === l) && Rm(s, a, t)
          ? ((o = u), (a = ja(c)), (t = Ua(c, t)))
          : (a = -1);
    }
  }
  return i;
}
function MD(e, t, n, r, i, s) {
  let o = t[ue],
    a = o.data[e + 8],
    c = r == null ? Ai(a) && qu : r != o && (a.type & 3) !== 0,
    l = i & Ee.Host && s === a,
    u = AD(a, o, n, c, l);
  return u !== null ? Ds(t, o, u, a) : pn;
}
function AD(e, t, n, r, i) {
  let s = e.providerIndexes,
    o = t.data,
    a = s & 1048575,
    c = e.directiveStart,
    l = e.directiveEnd,
    u = s >> 20,
    d = r ? a : a + u,
    g = i ? a + u : l;
  for (let E = d; E < g; E++) {
    let S = o[E];
    if ((E < c && n === S) || (E >= c && S.type === n)) return E;
  }
  if (i) {
    let E = o[c];
    if (E && Ls(E) && E.type === n) return c;
  }
  return null;
}
function Ds(e, t, n, r) {
  let i = e[n],
    s = t.data;
  if (bD(i)) {
    let o = i;
    o.resolving && cw(aw(s[n]));
    let a = Am(o.canSeeViewProviders);
    o.resolving = !0;
    let c,
      l = o.injectImpl ? $t(o.injectImpl) : null,
      u = Kg(e, r, Ee.Default);
    try {
      (i = e[n] = o.factory(void 0, s, e, r)),
        t.firstCreatePass && n >= r.directiveStart && vD(n, s[n], t);
    } finally {
      l !== null && $t(l), Am(a), (o.resolving = !1), Xg();
    }
  }
  return i;
}
function RD(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(ds) ? e[ds] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & iy : xD) : t;
}
function Rm(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> sy)] & r);
}
function xm(e, t) {
  return !(e & Ee.Self) && !(e & Ee.Host && t);
}
var kr = class {
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return uy(this._tNode, this._lView, t, lc(r), n);
  }
};
function xD() {
  return new kr(yn(), tt());
}
function Fd(e) {
  return oc(() => {
    let t = e.prototype.constructor,
      n = t[Ra] || zu(t),
      r = Object.prototype,
      i = Object.getPrototypeOf(e.prototype).constructor;
    for (; i && i !== r; ) {
      let s = i[Ra] || zu(i);
      if (s && s !== n) return s;
      i = Object.getPrototypeOf(i);
    }
    return (s) => new s();
  });
}
function zu(e) {
  return og(e)
    ? () => {
        let t = zu(qt(e));
        return t && t();
      }
    : wi(e);
}
function OD(e, t, n, r, i) {
  let s = e,
    o = t;
  for (; s !== null && o !== null && o[de] & 2048 && !(o[de] & 512); ) {
    let a = dy(s, o, n, r | Ee.Self, pn);
    if (a !== pn) return a;
    let c = s.parent;
    if (!c) {
      let l = o[Ng];
      if (l) {
        let u = l.get(n, pn, r);
        if (u !== pn) return u;
      }
      (c = fy(o)), (o = o[ks]);
    }
    s = c;
  }
  return i;
}
function fy(e) {
  let t = e[ue],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[on] : null;
}
function Om(e, t = null, n = null, r) {
  let i = hy(e, t, n, r);
  return i.resolveInjectorInitializers(), i;
}
function hy(e, t = null, n = null, r, i = new Set()) {
  let s = [n || cr, Lw(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : At(e))),
    new ys(s, t || Id(), r || null, i)
  );
}
var St = class e {
  static {
    this.THROW_IF_NOT_FOUND = ms;
  }
  static {
    this.NULL = new ka();
  }
  static create(t, n) {
    if (Array.isArray(t)) return Om({ name: "" }, n, t, "");
    {
      let r = t.name ?? "";
      return Om({ name: r }, t.parent, t.providers, r);
    }
  }
  static {
    this.ɵprov = ne({ token: e, providedIn: "any", factory: () => le(pg) });
  }
  static {
    this.__NG_ELEMENT_ID__ = -1;
  }
};
var kD = new ie("");
kD.__NG_ELEMENT_ID__ = (e) => {
  let t = yn();
  if (t === null) throw new G(204, !1);
  if (t.type & 2) return t.value;
  if (e & Ee.Optional) return null;
  throw new G(204, !1);
};
var LD = "ngOriginalError";
function Tu(e) {
  return e[LD];
}
var py = !0,
  my = (() => {
    class e {
      static {
        this.__NG_ELEMENT_ID__ = PD;
      }
      static {
        this.__NG_ENV_ID__ = (n) => n;
      }
    }
    return e;
  })(),
  Gu = class extends my {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return Bg(this._lView, t), () => nD(this._lView, t);
    }
  };
function PD() {
  return new Gu(tt());
}
var Hr = (() => {
  class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new dt(!1));
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
      this.ɵprov = ne({ token: e, providedIn: "root", factory: () => new e() });
    }
  }
  return e;
})();
var Wu = class extends ut {
    constructor(t = !1) {
      super(),
        (this.destroyRef = void 0),
        (this.pendingTasks = void 0),
        (this.__isAsync = t),
        Gw() &&
          ((this.destroyRef = z(my, { optional: !0 }) ?? void 0),
          (this.pendingTasks = z(Hr, { optional: !0 }) ?? void 0));
    }
    emit(t) {
      let n = Oe(null);
      try {
        super.next(t);
      } finally {
        Oe(n);
      }
    }
    subscribe(t, n, r) {
      let i = t,
        s = n || (() => null),
        o = r;
      if (t && typeof t == "object") {
        let c = t;
        (i = c.next?.bind(c)),
          (s = c.error?.bind(c)),
          (o = c.complete?.bind(c));
      }
      this.__isAsync &&
        ((s = this.wrapInTimeout(s)),
        i && (i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)));
      let a = super.subscribe({ next: i, error: s, complete: o });
      return t instanceof rt && t.add(a), a;
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
  Et = Wu;
function Ba(...e) {}
function gy(e) {
  let t, n;
  function r() {
    e = Ba;
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
function km(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = Ba;
    }
  );
}
var jd = "isAngularZone",
  Ha = jd + "_ID",
  FD = 0,
  He = class e {
    constructor(t) {
      (this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new Et(!1)),
        (this.onMicrotaskEmpty = new Et(!1)),
        (this.onStable = new Et(!1)),
        (this.onError = new Et(!1));
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: i = !1,
        scheduleInRootZone: s = py,
      } = t;
      if (typeof Zone > "u") throw new G(908, !1);
      Zone.assertZonePatched();
      let o = this;
      (o._nesting = 0),
        (o._outer = o._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n &&
          Zone.longStackTraceZoneSpec &&
          (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
        (o.shouldCoalesceEventChangeDetection = !i && r),
        (o.shouldCoalesceRunChangeDetection = i),
        (o.callbackScheduled = !1),
        (o.scheduleInRootZone = s),
        BD(o);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(jd) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new G(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new G(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, i) {
      let s = this._inner,
        o = s.scheduleEventTask("NgZoneEvent: " + i, t, jD, Ba, Ba);
      try {
        return s.runTask(o, n, r);
      } finally {
        s.cancelTask(o);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  jD = {};
function Ud(e) {
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
function UD(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    gy(() => {
      (e.callbackScheduled = !1),
        Ku(e),
        (e.isCheckStableRunning = !0),
        Ud(e),
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
    Ku(e);
}
function BD(e) {
  let t = () => {
      UD(e);
    },
    n = FD++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [jd]: !0, [Ha]: n, [Ha + n]: !0 },
    onInvokeTask: (r, i, s, o, a, c) => {
      if (HD(c)) return r.invokeTask(s, o, a, c);
      try {
        return Lm(e), r.invokeTask(s, o, a, c);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          Pm(e);
      }
    },
    onInvoke: (r, i, s, o, a, c, l) => {
      try {
        return Lm(e), r.invoke(s, o, a, c, l);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !VD(c) &&
          t(),
          Pm(e);
      }
    },
    onHasTask: (r, i, s, o) => {
      r.hasTask(s, o),
        i === s &&
          (o.change == "microTask"
            ? ((e._hasPendingMicrotasks = o.microTask), Ku(e), Ud(e))
            : o.change == "macroTask" &&
              (e.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (r, i, s, o) => (
      r.handleError(s, o), e.runOutsideAngular(() => e.onError.emit(o)), !1
    ),
  });
}
function Ku(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Lm(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function Pm(e) {
  e._nesting--, Ud(e);
}
var Va = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new Et()),
      (this.onMicrotaskEmpty = new Et()),
      (this.onStable = new Et()),
      (this.onError = new Et());
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
  runTask(t, n, r, i) {
    return t.apply(n, r);
  }
};
function HD(e) {
  return yy(e, "__ignore_ng_zone__");
}
function VD(e) {
  return yy(e, "__scheduler_tick__");
}
function yy(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
function $D(e = "zone.js", t) {
  return e === "noop" ? new Va() : e === "zone.js" ? new He(t) : e;
}
var On = class {
    constructor() {
      this._console = console;
    }
    handleError(t) {
      let n = this._findOriginalError(t);
      this._console.error("ERROR", t),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(t) {
      let n = t && Tu(t);
      for (; n && Tu(n); ) n = Tu(n);
      return n || null;
    }
  },
  qD = new ie("", {
    providedIn: "root",
    factory: () => {
      let e = z(He),
        t = z(On);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function zD() {
  return Bd(yn(), tt());
}
function Bd(e, t) {
  return new yc(an(e, t));
}
var yc = (() => {
  class e {
    constructor(n) {
      this.nativeElement = n;
    }
    static {
      this.__NG_ELEMENT_ID__ = zD;
    }
  }
  return e;
})();
var Ts = "ngSkipHydration",
  GD = "ngskiphydration";
function Hd(e) {
  let t = e.mergedAttrs;
  if (t === null) return !1;
  for (let n = 0; n < t.length; n += 2) {
    let r = t[n];
    if (typeof r == "number") return !1;
    if (typeof r == "string" && r.toLowerCase() === GD) return !0;
  }
  return !1;
}
function vy(e) {
  return e.hasAttribute(Ts);
}
function Ss(e) {
  return (e.flags & 128) === 128;
}
function Cs(e) {
  if (Ss(e)) return !0;
  let t = e.parent;
  for (; t; ) {
    if (Ss(e) || Hd(t)) return !0;
    t = t.parent;
  }
  return !1;
}
function WD(e) {
  return Ss(e) || Hd(e) || Cs(e);
}
var Ey = new Map(),
  KD = 0;
function QD() {
  return KD++;
}
function YD(e) {
  Ey.set(e[fc], e);
}
function Qu(e) {
  Ey.delete(e[fc]);
}
var Fm = "__ngContext__";
function jr(e, t) {
  nn(t) ? ((e[Fm] = t[fc]), YD(t)) : (e[Fm] = t);
}
function by(e) {
  return wy(e[vs]);
}
function _y(e) {
  return wy(e[tn]);
}
function wy(e) {
  for (; e !== null && !xt(e); ) e = e[tn];
  return e;
}
var Yu;
function vc(e) {
  Yu = e;
}
function Ec() {
  if (Yu !== void 0) return Yu;
  if (typeof document < "u") return document;
  throw new G(210, !1);
}
var Vr = new ie("", { providedIn: "root", factory: () => ZD }),
  ZD = "ng",
  js = new ie(""),
  Ot = new ie("", { providedIn: "platform", factory: () => "unknown" });
var Vd = new ie(""),
  Us = new ie("", {
    providedIn: "root",
    factory: () =>
      Ec().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
function XD() {
  let e = new Ln();
  return z(Ot) === "browser" && (e.store = JD(Ec(), z(Vr))), e;
}
var Ln = (() => {
  class e {
    constructor() {
      (this.store = {}), (this.onSerializeCallbacks = {});
    }
    static {
      this.ɵprov = ne({ token: e, providedIn: "root", factory: XD });
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
function JD(e, t) {
  let n = e.getElementById(t + "-state");
  if (n?.textContent)
    try {
      return JSON.parse(n.textContent);
    } catch (r) {
      console.warn("Exception while restoring TransferState for app " + t, r);
    }
  return {};
}
var $d = "h",
  qd = "b",
  Is = (function (e) {
    return (e.FirstChild = "f"), (e.NextSibling = "n"), e;
  })(Is || {}),
  Zu = "e",
  Xu = "t",
  Ns = "c",
  $a = "x",
  Ci = "r",
  Ju = "i",
  ed = "n",
  fs = "d",
  jm = "l",
  eT = "__nghData__",
  zd = eT,
  hs = "ngh",
  Gd = "nghm",
  Dy = () => null;
function tT(e, t, n = !1) {
  let r = e.getAttribute(hs);
  if (r == null) return null;
  let [i, s] = r.split("|");
  if (((r = n ? s : i), !r)) return null;
  let o = s ? `|${s}` : "",
    a = n ? i : o,
    c = {};
  if (r !== "") {
    let u = t.get(Ln, null, { optional: !0 });
    u !== null && (c = u.get(zd, [])[Number(r)]);
  }
  let l = { data: c, firstChild: e.firstChild ?? null };
  return (
    n && ((l.firstChild = e), bc(l, 0, e.nextSibling)),
    a ? e.setAttribute(hs, a) : e.removeAttribute(hs),
    l
  );
}
function nT() {
  Dy = tT;
}
function Wd(e, t, n = !1) {
  return Dy(e, t, n);
}
function Ty(e) {
  let t = e._lView;
  return t[ue].type === 2 ? null : (bs(t) && (t = t[$e]), t);
}
function rT(e) {
  return e.textContent?.replace(/\s/gm, "");
}
function iT(e) {
  let t = Ec(),
    n = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, {
      acceptNode(s) {
        let o = rT(s);
        return o === "ngetn" || o === "ngtns"
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }),
    r,
    i = [];
  for (; (r = n.nextNode()); ) i.push(r);
  for (let s of i)
    s.textContent === "ngetn"
      ? s.replaceWith(t.createTextNode(""))
      : s.remove();
}
function bc(e, t, n) {
  (e.segmentHeads ??= {}), (e.segmentHeads[t] = n);
}
function td(e, t) {
  return e.segmentHeads?.[t] ?? null;
}
function sT(e, t) {
  let n = e.data,
    r = n[Zu]?.[t] ?? null;
  return r === null && n[Ns]?.[t] && (r = Kd(e, t)), r;
}
function Sy(e, t) {
  return e.data[Ns]?.[t] ?? null;
}
function Kd(e, t) {
  let n = Sy(e, t) ?? [],
    r = 0;
  for (let i of n) r += i[Ci] * (i[$a] ?? 1);
  return r;
}
function oT(e) {
  if (typeof e.disconnectedNodes > "u") {
    let t = e.data[fs];
    e.disconnectedNodes = t ? new Set(t) : null;
  }
  return e.disconnectedNodes;
}
function Bs(e, t) {
  if (typeof e.disconnectedNodes > "u") {
    let n = e.data[fs];
    e.disconnectedNodes = n ? new Set(n) : null;
  }
  return !!oT(e)?.has(t);
}
function Cy(e, t) {
  let n = t,
    r = e.corruptedTextNodes;
  n.textContent === ""
    ? r.set(n, "ngetn")
    : n.nextSibling?.nodeType === Node.TEXT_NODE && r.set(n, "ngtns");
}
var vi = new ie(""),
  Iy = !1,
  Ny = new ie("", { providedIn: "root", factory: () => Iy }),
  aT = new ie(""),
  cT = new ie(""),
  lT = !1;
var qa = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${rg})`;
  }
};
function Qd(e) {
  return e instanceof qa ? e.changingThisBreaksApplicationSecurity : e;
}
function My(e, t) {
  let n = uT(e);
  if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${rg})`);
  }
  return n === t;
}
function uT(e) {
  return (e instanceof qa && e.getTypeName()) || null;
}
var dT = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Ay(e) {
  return (e = String(e)), e.match(dT) ? e : "unsafe:" + e;
}
var Yd = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(Yd || {});
function TP(e) {
  let t = fT();
  return t ? t.sanitize(Yd.URL, e) || "" : My(e, "URL") ? Qd(e) : Ay(cc(e));
}
function fT() {
  let e = tt();
  return e && e[mn].sanitizer;
}
var hT = /^>|^->|<!--|-->|--!>|<!-$/g,
  pT = /(<|>)/g,
  mT = "\u200B$1\u200B";
function gT(e) {
  return e.replace(hT, (t) => t.replace(pT, mT));
}
function yT(e) {
  return e.ownerDocument.body;
}
function Ry(e) {
  return e instanceof Function ? e() : e;
}
function wa(e) {
  return (e ?? z(St)).get(Ot) === "browser";
}
var $r = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })($r || {}),
  vT;
function Zd(e, t) {
  return vT(e, t);
}
function Ei(e, t, n, r, i) {
  if (r != null) {
    let s,
      o = !1;
    xt(r) ? (s = r) : nn(r) && ((o = !0), (r = r[Je]));
    let a = We(r);
    e === 0 && n !== null
      ? i == null
        ? Fy(t, n, a)
        : za(t, n, a, i || null, !0)
      : e === 1 && n !== null
        ? za(t, n, a, i || null, !0)
        : e === 2
          ? tf(t, a, o)
          : e === 3 && t.destroyNode(a),
      s != null && xT(t, e, s, n, i);
  }
}
function xy(e, t) {
  return e.createText(t);
}
function ET(e, t, n) {
  e.setValue(t, n);
}
function Oy(e, t) {
  return e.createComment(gT(t));
}
function Xd(e, t, n) {
  return e.createElement(t, n);
}
function bT(e, t) {
  ky(e, t), (t[Je] = null), (t[on] = null);
}
function _T(e, t, n, r, i, s) {
  (r[Je] = i), (r[on] = t), wc(e, r, n, 1, i, s);
}
function ky(e, t) {
  t[mn].changeDetectionScheduler?.notify(9), wc(e, t, t[et], 2, null, null);
}
function wT(e) {
  let t = e[vs];
  if (!t) return Su(e[ue], e);
  for (; t; ) {
    let n = null;
    if (nn(t)) n = t[vs];
    else {
      let r = t[ft];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[tn] && t !== e; ) nn(t) && Su(t[ue], t), (t = t[ht]);
      t === null && (t = e), nn(t) && Su(t[ue], t), (n = t && t[tn]);
    }
    t = n;
  }
}
function DT(e, t, n, r) {
  let i = ft + r,
    s = n.length;
  r > 0 && (n[i - 1][tn] = t),
    r < s - ft
      ? ((t[tn] = n[i]), hg(n, ft + r, t))
      : (n.push(t), (t[tn] = null)),
    (t[ht] = n);
  let o = t[Ti];
  o !== null && n !== o && Ly(o, t);
  let a = t[Si];
  a !== null && a.insertView(e), Hu(t), (t[de] |= 128);
}
function Ly(e, t) {
  let n = e[Pa],
    r = t[ht];
  if (nn(r)) e[de] |= Fa.HasTransplantedViews;
  else {
    let i = r[ht][Tt];
    t[Tt] !== i && (e[de] |= Fa.HasTransplantedViews);
  }
  n === null ? (e[Pa] = [t]) : n.push(t);
}
function Jd(e, t) {
  let n = e[Pa],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Ms(e, t) {
  if (e.length <= ft) return;
  let n = ft + t,
    r = e[n];
  if (r) {
    let i = r[Ti];
    i !== null && i !== e && Jd(i, r), t > 0 && (e[n - 1][tn] = r[tn]);
    let s = Oa(e, ft + t);
    bT(r[ue], r);
    let o = s[Si];
    o !== null && o.detachView(s[ue]),
      (r[ht] = null),
      (r[tn] = null),
      (r[de] &= -129);
  }
  return r;
}
function _c(e, t) {
  if (!(t[de] & 256)) {
    let n = t[et];
    n.destroyNode && wc(e, t, n, 3, null, null), wT(t);
  }
}
function Su(e, t) {
  if (t[de] & 256) return;
  let n = Oe(null);
  try {
    (t[de] &= -129),
      (t[de] |= 256),
      t[zt] && Xl(t[zt]),
      ST(e, t),
      TT(e, t),
      t[ue].type === 1 && t[et].destroy();
    let r = t[Ti];
    if (r !== null && xt(t[ht])) {
      r !== t[ht] && Jd(r, t);
      let i = t[Si];
      i !== null && i.detachView(e);
    }
    Qu(t);
  } finally {
    Oe(n);
  }
}
function TT(e, t) {
  let n = e.cleanup,
    r = t[Uu];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == "string") {
        let o = n[s + 3];
        o >= 0 ? r[o]() : r[-o].unsubscribe(), (s += 2);
      } else {
        let o = r[n[s + 1]];
        n[s].call(o);
      }
  r !== null && (t[Uu] = null);
  let i = t[or];
  if (i !== null) {
    t[or] = null;
    for (let s = 0; s < i.length; s++) {
      let o = i[s];
      o();
    }
  }
}
function ST(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = t[n[r]];
      if (!(i instanceof ws)) {
        let s = n[r + 1];
        if (Array.isArray(s))
          for (let o = 0; o < s.length; o += 2) {
            let a = i[s[o]],
              c = s[o + 1];
            sr(4, a, c);
            try {
              c.call(a);
            } finally {
              sr(5, a, c);
            }
          }
        else {
          sr(4, i, s);
          try {
            s.call(i);
          } finally {
            sr(5, i, s);
          }
        }
      }
    }
}
function Py(e, t, n) {
  return CT(e, t.parent, n);
}
function CT(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[Je];
  {
    let { componentOffset: i } = r;
    if (i > -1) {
      let { encapsulation: s } = e.data[r.directiveStart + i];
      if (s === rn.None || s === rn.Emulated) return null;
    }
    return an(r, n);
  }
}
function za(e, t, n, r, i) {
  e.insertBefore(t, n, r, i);
}
function Fy(e, t, n) {
  e.appendChild(t, n);
}
function Um(e, t, n, r, i) {
  r !== null ? za(e, t, n, r, i) : Fy(e, t, n);
}
function jy(e, t) {
  return e.parentNode(t);
}
function IT(e, t) {
  return e.nextSibling(t);
}
function NT(e, t, n) {
  return AT(e, t, n);
}
function MT(e, t, n) {
  return e.type & 40 ? an(e, n) : null;
}
var AT = MT,
  Bm;
function ef(e, t, n, r) {
  let i = Py(e, r, t),
    s = t[et],
    o = r.parent || t[on],
    a = NT(o, r, t);
  if (i != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) Um(s, i, n[c], a, !1);
    else Um(s, i, n, a, !1);
  Bm !== void 0 && Bm(s, r, t, n, i);
}
function Or(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return an(t, e);
    if (n & 4) return nd(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return Or(e, r);
      {
        let i = e[t.index];
        return xt(i) ? nd(-1, i) : We(i);
      }
    } else {
      if (n & 128) return Or(e, t.next);
      if (n & 32) return Zd(t, e)() || We(e[t.index]);
      {
        let r = Uy(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let i = Pr(e[Tt]);
          return Or(i, r);
        } else return Or(e, t.next);
      }
    }
  }
  return null;
}
function Uy(e, t) {
  if (t !== null) {
    let r = e[Tt][on],
      i = t.projection;
    return r.projection[i];
  }
  return null;
}
function nd(e, t) {
  let n = ft + e + 1;
  if (n < t.length) {
    let r = t[n],
      i = r[ue].firstChild;
    if (i !== null) return Or(r, i);
  }
  return t[xn];
}
function tf(e, t, n) {
  e.removeChild(null, t, n);
}
function By(e) {
  e.textContent = "";
}
function nf(e, t, n, r, i, s, o) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      c = n.type;
    if (
      (o && t === 0 && (a && jr(We(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) nf(e, t, n.child, r, i, s, !1), Ei(t, e, i, a, s);
      else if (c & 32) {
        let l = Zd(n, r),
          u;
        for (; (u = l()); ) Ei(t, e, i, u, s);
        Ei(t, e, i, a, s);
      } else c & 16 ? RT(e, t, r, n, i, s) : Ei(t, e, i, a, s);
    n = o ? n.projectionNext : n.next;
  }
}
function wc(e, t, n, r, i, s) {
  nf(n, r, e.firstChild, t, i, s, !1);
}
function RT(e, t, n, r, i, s) {
  let o = n[Tt],
    c = o[on].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Ei(t, e, i, u, s);
    }
  else {
    let l = c,
      u = o[ht];
    Ss(r) && (l.flags |= 128), nf(e, t, l, u, i, s, !0);
  }
}
function xT(e, t, n, r, i) {
  let s = n[xn],
    o = We(n);
  s !== o && Ei(t, e, r, s, i);
  for (let a = ft; a < n.length; a++) {
    let c = n[a];
    wc(c[ue], c, e, t, r, s);
  }
}
function OT(e, t, n) {
  e.setAttribute(t, "style", n);
}
function Hy(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Vy(e, t, n) {
  let { mergedAttrs: r, classes: i, styles: s } = n;
  r !== null && ku(e, t, r),
    i !== null && Hy(e, t, i),
    s !== null && OT(e, t, s);
}
var Hs = {};
function SP(e = 1) {
  $y(Ri(), tt(), gc() + e, !1);
}
function $y(e, t, n, r) {
  if (!r)
    if ((t[de] & 3) === 3) {
      let s = e.preOrderCheckHooks;
      s !== null && Ia(t, s, n);
    } else {
      let s = e.preOrderHooks;
      s !== null && Na(t, s, 0, n);
    }
  Fr(n);
}
function rf(e, t = Ee.Default) {
  let n = tt();
  if (n === null) return le(e, t);
  let r = yn();
  return uy(r, n, qt(e), t);
}
function qy(e, t, n, r, i, s) {
  let o = Oe(null);
  try {
    let a = null;
    i & lr.SignalBased && (a = t[r][Lp]),
      a !== null && a.transformFn !== void 0 && (s = a.transformFn(s)),
      i & lr.HasDecoratorInputTransform &&
        (s = e.inputTransforms[r].call(t, s)),
      e.setInput !== null ? e.setInput(t, a, s, n, r) : xg(t, a, r, s);
  } finally {
    Oe(o);
  }
}
function kT(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r];
        if (i < 0) Fr(~i);
        else {
          let s = i,
            o = n[++r],
            a = n[++r];
          hD(o, s);
          let c = t[s];
          a(2, c);
        }
      }
    } finally {
      Fr(-1);
    }
}
function Dc(e, t, n, r, i, s, o, a, c, l, u) {
  let d = t.blueprint.slice();
  return (
    (d[Je] = i),
    (d[de] = r | 4 | 128 | 8 | 64),
    (l !== null || (e && e[de] & 2048)) && (d[de] |= 2048),
    jg(d),
    (d[ht] = d[ks] = e),
    (d[Rt] = n),
    (d[mn] = o || (e && e[mn])),
    (d[et] = a || (e && e[et])),
    (d[Di] = c || (e && e[Di]) || null),
    (d[on] = s),
    (d[fc] = QD()),
    (d[sn] = u),
    (d[Ng] = l),
    (d[Tt] = t.type == 2 ? e[Tt] : d),
    d
  );
}
function Tc(e, t, n, r, i) {
  let s = e.data[t];
  if (s === null) (s = LT(e, t, n, r, i)), fD() && (s.flags |= 32);
  else if (s.type & 64) {
    (s.type = n), (s.value = r), (s.attrs = i);
    let o = lD();
    s.injectorIndex = o === null ? -1 : o.injectorIndex;
  }
  return Fs(s, !0), s;
}
function LT(e, t, n, r, i) {
  let s = $g(),
    o = qg(),
    a = o ? s : s && s.parent,
    c = (e.data[t] = HT(e, a, n, t, r, i));
  return (
    e.firstChild === null && (e.firstChild = c),
    s !== null &&
      (o
        ? s.child == null && c.parent !== null && (s.child = c)
        : s.next === null && ((s.next = c), (c.prev = s))),
    c
  );
}
function zy(e, t, n, r) {
  if (n === 0) return -1;
  let i = t.length;
  for (let s = 0; s < n; s++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return i;
}
function Gy(e, t, n, r, i) {
  let s = gc(),
    o = r & 2;
  try {
    Fr(-1), o && t.length > $e && $y(e, t, $e, !1), sr(o ? 2 : 0, i), n(r, i);
  } finally {
    Fr(s), sr(o ? 3 : 1, i);
  }
}
function Wy(e, t, n) {
  if (Mg(t)) {
    let r = Oe(null);
    try {
      let i = t.directiveStart,
        s = t.directiveEnd;
      for (let o = i; o < s; o++) {
        let a = e.data[o];
        if (a.contentQueries) {
          let c = n[o];
          a.contentQueries(1, c, o);
        }
      }
    } finally {
      Oe(r);
    }
  }
}
function Ky(e, t, n) {
  Vg() && (KT(e, t, n, an(n, t)), (n.flags & 64) === 64 && ev(e, t, n));
}
function Qy(e, t, n = an) {
  let r = t.localNames;
  if (r !== null) {
    let i = t.index + 1;
    for (let s = 0; s < r.length; s += 2) {
      let o = r[s + 1],
        a = o === -1 ? n(t, e) : e[o];
      e[i++] = a;
    }
  }
}
function Yy(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = sf(
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
function sf(e, t, n, r, i, s, o, a, c, l, u) {
  let d = $e + r,
    g = d + i,
    E = PT(d, g),
    S = typeof l == "function" ? l() : l;
  return (E[ue] = {
    type: e,
    blueprint: E,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: E.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: g,
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
    directiveRegistry: typeof s == "function" ? s() : s,
    pipeRegistry: typeof o == "function" ? o() : o,
    firstChild: null,
    schemas: c,
    consts: S,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function PT(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : Hs);
  return n;
}
function FT(e, t, n, r) {
  let s = r.get(Ny, Iy) || n === rn.ShadowDom,
    o = e.selectRootElement(t, s);
  return jT(o), o;
}
function jT(e) {
  Zy(e);
}
var Zy = () => null;
function UT(e) {
  vy(e) ? By(e) : iT(e);
}
function BT() {
  Zy = UT;
}
function HT(e, t, n, r, i, s) {
  let o = t ? t.injectorIndex : -1,
    a = 0;
  return (
    Ps() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: o,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: s,
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
function Hm(e, t, n, r, i) {
  for (let s in t) {
    if (!t.hasOwnProperty(s)) continue;
    let o = t[s];
    if (o === void 0) continue;
    r ??= {};
    let a,
      c = lr.None;
    Array.isArray(o) ? ((a = o[0]), (c = o[1])) : (a = o);
    let l = s;
    if (i !== null) {
      if (!i.hasOwnProperty(s)) continue;
      l = i[s];
    }
    e === 0 ? Vm(r, n, l, a, c) : Vm(r, n, l, a);
  }
  return r;
}
function Vm(e, t, n, r, i) {
  let s;
  e.hasOwnProperty(n) ? (s = e[n]).push(t, r) : (s = e[n] = [t, r]),
    i !== void 0 && s.push(i);
}
function VT(e, t, n) {
  let r = t.directiveStart,
    i = t.directiveEnd,
    s = e.data,
    o = t.attrs,
    a = [],
    c = null,
    l = null;
  for (let u = r; u < i; u++) {
    let d = s[u],
      g = n ? n.get(d) : null,
      E = g ? g.inputs : null,
      S = g ? g.outputs : null;
    (c = Hm(0, d.inputs, u, c, E)), (l = Hm(1, d.outputs, u, l, S));
    let M = c !== null && o !== null && !Td(t) ? rS(c, u, o) : null;
    a.push(M);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (t.flags |= 8),
    c.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = c),
    (t.outputs = l);
}
function $T(e) {
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
function qT(e, t, n, r, i, s, o, a) {
  let c = an(t, n),
    l = t.inputs,
    u;
  !a && l != null && (u = l[r])
    ? (of(e, n, u, r, i), Ai(t) && zT(n, t.index))
    : t.type & 3
      ? ((r = $T(r)),
        (i = o != null ? o(i, t.value || "", r) : i),
        s.setProperty(c, r, i))
      : t.type & 12;
}
function zT(e, t) {
  let n = Br(t, e);
  n[de] & 16 || (n[de] |= 64);
}
function Xy(e, t, n, r) {
  if (Vg()) {
    let i = r === null ? null : { "": -1 },
      s = YT(e, n),
      o,
      a;
    s === null ? (o = a = null) : ([o, a] = s),
      o !== null && Jy(e, t, n, o, i, a),
      i && ZT(n, r, i);
  }
  n.mergedAttrs = Dd(n.mergedAttrs, n.attrs);
}
function Jy(e, t, n, r, i, s) {
  for (let l = 0; l < r.length; l++) ND(oy(n, t), e, r[l].type);
  JT(n, e.data.length, r.length);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    u.providersResolver && u.providersResolver(u);
  }
  let o = !1,
    a = !1,
    c = zy(e, t, r.length, null);
  for (let l = 0; l < r.length; l++) {
    let u = r[l];
    (n.mergedAttrs = Dd(n.mergedAttrs, u.hostAttrs)),
      eS(e, n, t, c, u),
      XT(c, u, i),
      u.contentQueries !== null && (n.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) &&
        (n.flags |= 64);
    let d = u.type.prototype;
    !o &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (o = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      c++;
  }
  VT(e, n, s);
}
function GT(e, t, n, r, i) {
  let s = i.hostBindings;
  if (s) {
    let o = e.hostBindingOpCodes;
    o === null && (o = e.hostBindingOpCodes = []);
    let a = ~t.index;
    WT(o) != a && o.push(a), o.push(n, r, s);
  }
}
function WT(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function KT(e, t, n, r) {
  let i = n.directiveStart,
    s = n.directiveEnd;
  Ai(n) && tS(t, n, e.data[i + n.componentOffset]),
    e.firstCreatePass || oy(n, t),
    jr(r, t);
  let o = n.initialInputs;
  for (let a = i; a < s; a++) {
    let c = e.data[a],
      l = Ds(t, e, a, n);
    if ((jr(l, t), o !== null && nS(t, a - i, l, c, n, o), Ls(c))) {
      let u = Br(n.index, t);
      u[Rt] = Ds(t, e, a, n);
    }
  }
}
function ev(e, t, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    s = n.index,
    o = pD();
  try {
    Fr(s);
    for (let a = r; a < i; a++) {
      let c = e.data[a],
        l = t[a];
      Vu(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          QT(c, l);
    }
  } finally {
    Fr(-1), Vu(o);
  }
}
function QT(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function YT(e, t) {
  let n = e.directiveRegistry,
    r = null,
    i = null;
  if (n)
    for (let s = 0; s < n.length; s++) {
      let o = n[s];
      if (Cw(t, o.selectors, !1))
        if ((r || (r = []), Ls(o)))
          if (o.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              o.findHostDirectiveDefs(o, a, i),
              r.unshift(...a, o);
            let c = a.length;
            rd(e, t, c);
          } else r.unshift(o), rd(e, t, 0);
        else
          (i = i || new Map()), o.findHostDirectiveDefs?.(o, r, i), r.push(o);
    }
  return r === null ? null : [r, i];
}
function rd(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function ZT(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let i = 0; i < t.length; i += 2) {
      let s = n[t[i + 1]];
      if (s == null) throw new G(-301, !1);
      r.push(t[i], s);
    }
  }
}
function XT(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    Ls(t) && (n[""] = e);
  }
}
function JT(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function eS(e, t, n, r, i) {
  e.data[r] = i;
  let s = i.factory || (i.factory = wi(i.type, !0)),
    o = new ws(s, Ls(i), rf);
  (e.blueprint[r] = o), (n[r] = o), GT(e, t, r, zy(e, n, i.hostVars, Hs), i);
}
function tS(e, t, n) {
  let r = an(t, e),
    i = Yy(n),
    s = e[mn].rendererFactory,
    o = 16;
  n.signals ? (o = 4096) : n.onPush && (o = 64);
  let a = Sc(
    e,
    Dc(e, i, null, o, r, t, null, s.createRenderer(r, n), null, null, null),
  );
  e[t.index] = a;
}
function nS(e, t, n, r, i, s) {
  let o = s[t];
  if (o !== null)
    for (let a = 0; a < o.length; ) {
      let c = o[a++],
        l = o[a++],
        u = o[a++],
        d = o[a++];
      qy(r, n, c, l, u, d);
    }
}
function rS(e, t, n) {
  let r = null,
    i = 0;
  for (; i < n.length; ) {
    let s = n[i];
    if (s === 0) {
      i += 4;
      continue;
    } else if (s === 5) {
      i += 2;
      continue;
    }
    if (typeof s == "number") break;
    if (e.hasOwnProperty(s)) {
      r === null && (r = []);
      let o = e[s];
      for (let a = 0; a < o.length; a += 3)
        if (o[a] === t) {
          r.push(s, o[a + 1], o[a + 2], n[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return r;
}
function tv(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function nv(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = Oe(null);
    try {
      for (let i = 0; i < n.length; i += 2) {
        let s = n[i],
          o = n[i + 1];
        if (o !== -1) {
          let a = e.data[o];
          Wg(s), a.contentQueries(2, t[o], o);
        }
      }
    } finally {
      Oe(r);
    }
  }
}
function Sc(e, t) {
  return e[vs] ? (e[Cm][tn] = t) : (e[vs] = t), (e[Cm] = t), t;
}
function id(e, t, n) {
  Wg(0);
  let r = Oe(null);
  try {
    t(e, n);
  } finally {
    Oe(r);
  }
}
function iS(e, t) {
  let n = e[Di],
    r = n ? n.get(On, null) : null;
  r && r.handleError(t);
}
function of(e, t, n, r, i) {
  for (let s = 0; s < n.length; ) {
    let o = n[s++],
      a = n[s++],
      c = n[s++],
      l = t[o],
      u = e.data[o];
    qy(u, l, r, a, c, i);
  }
}
function sS(e, t, n) {
  let r = eD(t, e);
  ET(e[et], r, n);
}
function oS(e, t) {
  let n = Br(t, e),
    r = n[ue];
  aS(r, n);
  let i = n[Je];
  i !== null && n[sn] === null && (n[sn] = Wd(i, n[Di])), af(r, n, n[Rt]);
}
function aS(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function af(e, t, n) {
  xd(t);
  try {
    let r = e.viewQuery;
    r !== null && id(1, r, n);
    let i = e.template;
    i !== null && Gy(e, t, i, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[Si]?.finishViewCreation(e),
      e.staticContentQueries && nv(e, t),
      e.staticViewQueries && id(2, e.viewQuery, n);
    let s = e.components;
    s !== null && cS(t, s);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[de] &= -5), Od();
  }
}
function cS(e, t) {
  for (let n = 0; n < t.length; n++) oS(e, t[n]);
}
function rv(e, t, n, r) {
  let i = Oe(null);
  try {
    let s = t.tView,
      a = e[de] & 4096 ? 4096 : 16,
      c = Dc(
        e,
        s,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      l = e[t.index];
    c[Ti] = l;
    let u = e[Si];
    return u !== null && (c[Si] = u.createEmbeddedView(s)), af(s, c, n), c;
  } finally {
    Oe(i);
  }
}
function lS(e, t) {
  let n = ft + t;
  if (n < e.length) return e[n];
}
function Ga(e, t) {
  return !t || t.firstChild === null || Ss(e);
}
function cf(e, t, n, r = !0) {
  let i = t[ue];
  if ((DT(i, t, e, n), r)) {
    let o = nd(n, e),
      a = t[et],
      c = jy(a, e[xn]);
    c !== null && _T(i, e[on], a, t, c, o);
  }
  let s = t[sn];
  s !== null && s.firstChild !== null && (s.firstChild = null);
}
function uS(e, t) {
  let n = Ms(e, t);
  return n !== void 0 && _c(n[ue], n), n;
}
function As(e, t, n, r, i = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = i ? n.projectionNext : n.next;
      continue;
    }
    let s = t[n.index];
    s !== null && r.push(We(s)), xt(s) && iv(s, r);
    let o = n.type;
    if (o & 8) As(e, t, n.child, r);
    else if (o & 32) {
      let a = Zd(n, t),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (o & 16) {
      let a = Uy(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = Pr(t[Tt]);
        As(c[ue], c, a, r, !0);
      }
    }
    n = i ? n.projectionNext : n.next;
  }
  return r;
}
function iv(e, t) {
  for (let n = ft; n < e.length; n++) {
    let r = e[n],
      i = r[ue].firstChild;
    i !== null && As(r[ue], r, i, t);
  }
  e[xn] !== e[Je] && t.push(e[xn]);
}
var sv = [];
function dS(e) {
  return e[zt] ?? fS(e);
}
function fS(e) {
  let t = sv.pop() ?? Object.create(pS);
  return (t.lView = e), t;
}
function hS(e) {
  e.lView[zt] !== e && ((e.lView = null), sv.push(e));
}
var pS = Ge(Y({}, Ql), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    mc(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[zt] = this;
  },
});
function mS(e) {
  let t = e[zt] ?? Object.create(gS);
  return (t.lView = e), t;
}
var gS = Ge(Y({}, Ql), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    let t = Pr(e.lView);
    for (; t && !ov(t[ue]); ) t = Pr(t);
    t && Ug(t);
  },
  consumerOnSignalRead() {
    this.lView[zt] = this;
  },
});
function ov(e) {
  return e.type !== 2;
}
var yS = 100;
function av(e, t = !0, n = 0) {
  let r = e[mn],
    i = r.rendererFactory,
    s = !1;
  s || i.begin?.();
  try {
    vS(e, n);
  } catch (o) {
    throw (t && iS(e, o), o);
  } finally {
    s || (i.end?.(), r.inlineEffectRunner?.flush());
  }
}
function vS(e, t) {
  let n = zg();
  try {
    Nm(!0), sd(e, t);
    let r = 0;
    for (; pc(e); ) {
      if (r === yS) throw new G(103, !1);
      r++, sd(e, 1);
    }
  } finally {
    Nm(n);
  }
}
function ES(e, t, n, r) {
  let i = t[de];
  if ((i & 256) === 256) return;
  let s = !1,
    o = !1;
  !s && t[mn].inlineEffectRunner?.flush(), xd(t);
  let a = !0,
    c = null,
    l = null;
  s ||
    (ov(e)
      ? ((l = dS(t)), (c = Yl(l)))
      : Pp() === null
        ? ((a = !1), (l = mS(t)), (c = Yl(l)))
        : t[zt] && (Xl(t[zt]), (t[zt] = null)));
  try {
    jg(t), dD(e.bindingStartIndex), n !== null && Gy(e, t, n, 2, r);
    let u = (i & 3) === 3;
    if (!s)
      if (u) {
        let E = e.preOrderCheckHooks;
        E !== null && Ia(t, E, null);
      } else {
        let E = e.preOrderHooks;
        E !== null && Na(t, E, 0, null), _u(t, 0);
      }
    if ((o || bS(t), cv(t, 0), e.contentQueries !== null && nv(e, t), !s))
      if (u) {
        let E = e.contentCheckHooks;
        E !== null && Ia(t, E);
      } else {
        let E = e.contentHooks;
        E !== null && Na(t, E, 1), _u(t, 1);
      }
    kT(e, t);
    let d = e.components;
    d !== null && uv(t, d, 0);
    let g = e.viewQuery;
    if ((g !== null && id(2, g, r), !s))
      if (u) {
        let E = e.viewCheckHooks;
        E !== null && Ia(t, E);
      } else {
        let E = e.viewHooks;
        E !== null && Na(t, E, 2), _u(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[bu])) {
      for (let E of t[bu]) E();
      t[bu] = null;
    }
    s || (t[de] &= -73);
  } catch (u) {
    throw (s || mc(t), u);
  } finally {
    l !== null && (Fp(l, c), a && hS(l)), Od();
  }
}
function cv(e, t) {
  for (let n = by(e); n !== null; n = _y(n))
    for (let r = ft; r < n.length; r++) {
      let i = n[r];
      lv(i, t);
    }
}
function bS(e) {
  for (let t = by(e); t !== null; t = _y(t)) {
    if (!(t[de] & Fa.HasTransplantedViews)) continue;
    let n = t[Pa];
    for (let r = 0; r < n.length; r++) {
      let i = n[r];
      Ug(i);
    }
  }
}
function _S(e, t, n) {
  let r = Br(t, e);
  lv(r, n);
}
function lv(e, t) {
  Ad(e) && sd(e, t);
}
function sd(e, t) {
  let r = e[ue],
    i = e[de],
    s = e[zt],
    o = !!(t === 0 && i & 16);
  if (
    ((o ||= !!(i & 64 && t === 0)),
    (o ||= !!(i & 1024)),
    (o ||= !!(s?.dirty && Zl(s))),
    (o ||= !1),
    s && (s.dirty = !1),
    (e[de] &= -9217),
    o)
  )
    ES(r, e, r.template, e[Rt]);
  else if (i & 8192) {
    cv(e, 1);
    let a = r.components;
    a !== null && uv(e, a, 1);
  }
}
function uv(e, t, n) {
  for (let r = 0; r < t.length; r++) _S(e, t[r], n);
}
function dv(e, t) {
  let n = zg() ? 64 : 1088;
  for (e[mn].changeDetectionScheduler?.notify(t); e; ) {
    e[de] |= n;
    let r = Pr(e);
    if (bs(e) && !r) return e;
    e = r;
  }
  return null;
}
var Ii = class {
  get rootNodes() {
    let t = this._lView,
      n = t[ue];
    return As(n, t, n.firstChild, []);
  }
  constructor(t, n, r = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r),
      (this._appRef = null),
      (this._attachedToViewContainer = !1);
  }
  get context() {
    return this._lView[Rt];
  }
  set context(t) {
    this._lView[Rt] = t;
  }
  get destroyed() {
    return (this._lView[de] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[ht];
      if (xt(t)) {
        let n = t[La],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (Ms(t, r), Oa(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    _c(this._lView[ue], this._lView);
  }
  onDestroy(t) {
    Bg(this._lView, t);
  }
  markForCheck() {
    dv(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[de] &= -129;
  }
  reattach() {
    Hu(this._lView), (this._lView[de] |= 128);
  }
  detectChanges() {
    (this._lView[de] |= 1024), av(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new G(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = bs(this._lView),
      n = this._lView[Ti];
    n !== null && !t && Jd(n, this._lView), ky(this._lView[ue], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new G(902, !1);
    this._appRef = t;
    let n = bs(this._lView),
      r = this._lView[Ti];
    r !== null && !n && Ly(r, this._lView), Hu(this._lView);
  }
};
var od = "<-- AT THIS LOCATION";
function wS(e) {
  switch (e) {
    case 4:
      return "view container";
    case 2:
      return "element";
    case 8:
      return "ng-container";
    case 32:
      return "icu";
    case 64:
      return "i18n";
    case 16:
      return "projection";
    case 1:
      return "text";
    case 128:
      return "@let";
    default:
      return "<unknown>";
  }
}
function DS(e, t) {
  let n = `During serialization, Angular was unable to find an element in the DOM:

`,
    r = `${NS(e, t, !1)}

`,
    i = AS();
  throw new G(-502, n + r + i);
}
function TS(e) {
  let t =
      "During serialization, Angular detected DOM nodes that were created outside of Angular context and provided as projectable nodes (likely via `ViewContainerRef.createComponent` or `createComponent` APIs). Hydration is not supported for such cases, consider refactoring the code to avoid this pattern or using `ngSkipHydration` on the host element of the component.\n\n",
    n = `${MS(e)}

`,
    r = t + n + RS();
  return new G(-503, r);
}
function SS(e) {
  let t = [];
  if (e.attrs)
    for (let n = 0; n < e.attrs.length; ) {
      let r = e.attrs[n++];
      if (typeof r == "number") break;
      let i = e.attrs[n++];
      t.push(`${r}="${Wa(i)}"`);
    }
  return t.join(" ");
}
var CS = new Set(["ngh", "ng-version", "ng-server-context"]);
function IS(e) {
  let t = [];
  for (let n = 0; n < e.attributes.length; n++) {
    let r = e.attributes[n];
    CS.has(r.name) || t.push(`${r.name}="${Wa(r.value)}"`);
  }
  return t.join(" ");
}
function Cu(e, t = "\u2026") {
  switch (e.type) {
    case 1:
      return `#text${e.value ? `(${e.value})` : ""}`;
    case 2:
      let r = SS(e),
        i = e.value.toLowerCase();
      return `<${i}${r ? " " + r : ""}>${t}</${i}>`;
    case 8:
      return "<!-- ng-container -->";
    case 4:
      return "<!-- container -->";
    default:
      return `#node(${wS(e.type)})`;
  }
}
function Ma(e, t = "\u2026") {
  let n = e;
  switch (n.nodeType) {
    case Node.ELEMENT_NODE:
      let r = n.tagName.toLowerCase(),
        i = IS(n);
      return `<${r}${i ? " " + i : ""}>${t}</${r}>`;
    case Node.TEXT_NODE:
      let s = n.textContent ? Wa(n.textContent) : "";
      return `#text${s ? `(${s})` : ""}`;
    case Node.COMMENT_NODE:
      return `<!-- ${Wa(n.textContent ?? "")} -->`;
    default:
      return `#node(${n.nodeType})`;
  }
}
function NS(e, t, n) {
  let r = "  ",
    i = "";
  t.prev
    ? ((i +=
        r +
        `\u2026
`),
      (i +=
        r +
        Cu(t.prev) +
        `
`))
    : t.type &&
      t.type & 12 &&
      (i +=
        r +
        `\u2026
`),
    n
      ? ((i +=
          r +
          Cu(t) +
          `
`),
        (i +=
          r +
          `<!-- container -->  ${od}
`))
      : (i +=
          r +
          Cu(t) +
          `  ${od}
`),
    (i +=
      r +
      `\u2026
`);
  let s = t.type ? Py(e[ue], t, e) : null;
  return (
    s &&
      (i = Ma(
        s,
        `
` + i,
      )),
    i
  );
}
function MS(e) {
  let t = "  ",
    n = "",
    r = e;
  return (
    r.previousSibling &&
      ((n +=
        t +
        `\u2026
`),
      (n +=
        t +
        Ma(r.previousSibling) +
        `
`)),
    (n +=
      t +
      Ma(r) +
      `  ${od}
`),
    e.nextSibling &&
      (n +=
        t +
        `\u2026
`),
    e.parentNode &&
      (n = Ma(
        r.parentNode,
        `
` + n,
      )),
    n
  );
}
function AS(e) {
  return `To fix this problem:
  * check ${e ? `the "${e}"` : "corresponding"} component for hydration-related issues
  * check to see if your template has valid HTML structure
  * or skip hydration by adding the \`ngSkipHydration\` attribute to its host node in a template

`;
}
function RS() {
  return `Note: attributes are only displayed to better represent the DOM but have no effect on hydration mismatches.

`;
}
function xS(e) {
  return e.replace(/\s+/gm, "");
}
function Wa(e, t = 50) {
  return e
    ? ((e = xS(e)), e.length > t ? `${e.substring(0, t - 1)}\u2026` : e)
    : "";
}
function OS(e, t) {
  let n = t[e.currentCaseLViewIndex];
  return n === null ? n : n < 0 ? ~n : n;
}
function fv(e, t, n) {
  e.index = 0;
  let r = OS(t, n);
  r !== null ? (e.removes = t.remove[r]) : (e.removes = cr);
}
function ad(e) {
  if (e.index < e.removes.length) {
    let t = e.removes[e.index++];
    if (t > 0) return e.lView[t];
    {
      e.stack.push(e.index, e.removes);
      let n = ~t,
        r = e.lView[ue].data[n];
      return fv(e, r, e.lView), ad(e);
    }
  } else
    return e.stack.length === 0
      ? null
      : ((e.removes = e.stack.pop()), (e.index = e.stack.pop()), ad(e));
}
function kS(e, t) {
  let n = { stack: [], index: -1, lView: t };
  return fv(n, e, t), ad.bind(null, n);
}
var LS = new RegExp(`^(\\d+)*(${qd}|${$d})*(.*)`);
function PS(e, t) {
  let n = [e];
  for (let r of t) {
    let i = n.length - 1;
    if (i > 0 && n[i - 1] === r) {
      let s = n[i] || 1;
      n[i] = s + 1;
    } else n.push(r, "");
  }
  return n.join("");
}
function FS(e) {
  let t = e.match(LS),
    [n, r, i, s] = t,
    o = r ? parseInt(r, 10) : i,
    a = [];
  for (let [c, l, u] of s.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(l, d);
  }
  return [o, ...a];
}
function jS(e) {
  return !e.prev && e.parent?.type === 8;
}
function Iu(e) {
  return e.index - $e;
}
function Rs(e, t) {
  return !(e.type & 144) && !!t[e.index] && hv(We(t[e.index]));
}
function hv(e) {
  return !!e && !e.isConnected;
}
function US(e, t) {
  let n = e.i18nNodes;
  if (n) return n.get(t);
}
function Cc(e, t, n, r) {
  let i = Iu(r),
    s = US(e, i);
  if (s === void 0) {
    let o = e.data[ed];
    if (o?.[i]) s = HS(o[i], n);
    else if (t.firstChild === r) s = e.firstChild;
    else {
      let a = r.prev === null,
        c = r.prev ?? r.parent;
      if (jS(r)) {
        let l = Iu(r.parent);
        s = td(e, l);
      } else {
        let l = an(c, n);
        if (a) s = l.firstChild;
        else {
          let u = Iu(c),
            d = td(e, u);
          if (c.type === 2 && d) {
            let E = Kd(e, u) + 1;
            s = Ic(E, d);
          } else s = l.nextSibling;
        }
      }
    }
  }
  return s;
}
function Ic(e, t) {
  let n = t;
  for (let r = 0; r < e; r++) n = n.nextSibling;
  return n;
}
function BS(e, t) {
  let n = e;
  for (let r = 0; r < t.length; r += 2) {
    let i = t[r],
      s = t[r + 1];
    for (let o = 0; o < s; o++)
      switch (i) {
        case Is.FirstChild:
          n = n.firstChild;
          break;
        case Is.NextSibling:
          n = n.nextSibling;
          break;
      }
  }
  return n;
}
function HS(e, t) {
  let [n, ...r] = FS(e),
    i;
  if (n === $d) i = t[Tt][Je];
  else if (n === qd) i = yT(t[Tt][Je]);
  else {
    let s = Number(n);
    i = We(t[s + $e]);
  }
  return BS(i, r);
}
function cd(e, t) {
  if (e === t) return [];
  if (e.parentElement == null || t.parentElement == null) return null;
  if (e.parentElement === t.parentElement) return VS(e, t);
  {
    let n = t.parentElement,
      r = cd(e, n),
      i = cd(n.firstChild, t);
    return !r || !i ? null : [...r, Is.FirstChild, ...i];
  }
}
function VS(e, t) {
  let n = [],
    r = null;
  for (r = e; r != null && r !== t; r = r.nextSibling) n.push(Is.NextSibling);
  return r == null ? null : n;
}
function $m(e, t, n) {
  let r = cd(e, t);
  return r === null ? null : PS(n, r);
}
function $S(e, t, n) {
  let r = e.parent,
    i,
    s,
    o;
  for (; r !== null && (Rs(r, t) || n?.has(r.index)); ) r = r.parent;
  r === null || !(r.type & 3)
    ? ((i = o = $d), (s = t[Tt][Je]))
    : ((i = r.index), (s = We(t[i])), (o = cc(i - $e)));
  let a = We(t[e.index]);
  if (e.type & 44) {
    let l = Or(t, e);
    l && (a = l);
  }
  let c = $m(s, a, o);
  if (c === null && s !== a) {
    let l = s.ownerDocument.body;
    if (((c = $m(l, a, qd)), c === null)) throw DS(t, e);
  }
  return c;
}
var pv = !1;
function qS(e) {
  pv = e;
}
function zS() {
  return pv;
}
function GS(e) {
  return (e = e ?? z(St)), e.get(aT, !1);
}
function WS(e, t) {
  let n = t.i18nChildren.get(e);
  return n === void 0 && ((n = KS(e)), t.i18nChildren.set(e, n)), n;
}
function KS(e) {
  let t = new Set();
  function n(r) {
    switch ((t.add(r.index), r.kind)) {
      case 1:
      case 2: {
        for (let i of r.children) n(i);
        break;
      }
      case 3: {
        for (let i of r.cases) for (let s of i) n(s);
        break;
      }
    }
  }
  for (let r = $e; r < e.bindingStartIndex; r++) {
    let i = e.data[r];
    if (!(!i || !i.ast)) for (let s of i.ast) n(s);
  }
  return t.size === 0 ? null : t;
}
function QS(e, t, n) {
  if (!n.isI18nHydrationEnabled) return null;
  let r = e[ue],
    i = r.data[t];
  if (!i || !i.ast) return null;
  let s = r.data[i.parentTNodeIndex];
  if (s && WD(s)) return null;
  let o = {
    caseQueue: [],
    disconnectedNodes: new Set(),
    disjointNodes: new Set(),
  };
  return (
    ld(e, o, n, i.ast),
    o.caseQueue.length === 0 &&
    o.disconnectedNodes.size === 0 &&
    o.disjointNodes.size === 0
      ? null
      : o
  );
}
function ld(e, t, n, r) {
  let i = null;
  for (let s of r) {
    let o = ZS(e, t, n, s);
    o && (YS(i, o) && t.disjointNodes.add(s.index - $e), (i = o));
  }
  return i;
}
function YS(e, t) {
  return e && e.nextSibling !== t;
}
function ZS(e, t, n, r) {
  let i = We(e[r.index]);
  if (!i || hv(i)) return t.disconnectedNodes.add(r.index - $e), null;
  let s = i;
  switch (r.kind) {
    case 0: {
      Cy(n, s);
      break;
    }
    case 1:
    case 2: {
      ld(e, t, n, r.children);
      break;
    }
    case 3: {
      let o = e[r.currentCaseLViewIndex];
      if (o != null) {
        let a = o < 0 ? ~o : o;
        t.caseQueue.push(a), ld(e, t, n, r.cases[a]);
      }
      break;
    }
  }
  return XS(e, r);
}
function XS(e, t) {
  let r = e[ue].data[t.index];
  return ny(r)
    ? Or(e, r)
    : t.kind === 3
      ? (kS(r, e)() ?? We(e[t.index]))
      : (We(e[t.index]) ?? null);
}
function JS(e) {
  let t = e[sn];
  if (t) {
    let { i18nNodes: n, dehydratedIcuData: r } = t;
    if (n && r) {
      let i = e[et];
      for (let s of r.values()) eC(i, n, s);
    }
    (t.i18nNodes = void 0), (t.dehydratedIcuData = void 0);
  }
}
function eC(e, t, n) {
  for (let r of n.node.cases[n.case]) {
    let i = t.get(r.index - $e);
    i && tf(e, i, !1);
  }
}
function mv(e) {
  let t = e[Es] ?? [],
    r = e[ht][et];
  for (let i of t) tC(i, r);
  e[Es] = cr;
}
function tC(e, t) {
  let n = 0,
    r = e.firstChild;
  if (r) {
    let i = e.data[Ci];
    for (; n < i; ) {
      let s = r.nextSibling;
      tf(t, r, !1), (r = s), n++;
    }
  }
}
function gv(e) {
  mv(e);
  let t = e[Je];
  nn(t) && Ka(t);
  for (let n = ft; n < e.length; n++) Ka(e[n]);
}
function Ka(e) {
  JS(e);
  let t = e[ue];
  for (let n = $e; n < t.bindingStartIndex; n++)
    if (xt(e[n])) {
      let r = e[n];
      gv(r);
    } else nn(e[n]) && Ka(e[n]);
}
function nC(e) {
  let t = e._views;
  for (let n of t) {
    let r = Ty(n);
    r !== null && r[Je] !== null && (nn(r) ? Ka(r) : gv(r));
  }
}
function rC(e, t) {
  let n = [];
  for (let r of t)
    for (let i = 0; i < (r[$a] ?? 1); i++) {
      let s = { data: r, firstChild: null };
      r[Ci] > 0 && ((s.firstChild = e), (e = Ic(r[Ci], e))), n.push(s);
    }
  return [e, n];
}
var yv = () => null;
function iC(e, t) {
  let n = e[Es];
  return !t || n === null || n.length === 0
    ? null
    : n[0].data[Ju] === t
      ? n.shift()
      : (mv(e), null);
}
function sC() {
  yv = iC;
}
function Qa(e, t) {
  return yv(e, t);
}
var Ur = class {},
  lf = new ie("", { providedIn: "root", factory: () => !1 });
var vv = new ie(""),
  Ev = new ie(""),
  ud = class {},
  Ya = class {};
function oC(e) {
  let t = Error(`No component factory found for ${At(e)}.`);
  return (t[aC] = e), t;
}
var aC = "ngComponent";
var dd = class {
    resolveComponentFactory(t) {
      throw oC(t);
    }
  },
  Ni = class {
    static {
      this.NULL = new dd();
    }
  },
  dr = class {},
  Vs = (() => {
    class e {
      constructor() {
        this.destroyNode = null;
      }
      static {
        this.__NG_ELEMENT_ID__ = () => cC();
      }
    }
    return e;
  })();
function cC() {
  let e = tt(),
    t = yn(),
    n = Br(t.index, e);
  return (nn(n) ? n : e)[et];
}
var lC = (() => {
  class e {
    static {
      this.ɵprov = ne({ token: e, providedIn: "root", factory: () => null });
    }
  }
  return e;
})();
function fd(e, t, n) {
  let r = n ? e.styles : null,
    i = n ? e.classes : null,
    s = 0;
  if (t !== null)
    for (let o = 0; o < t.length; o++) {
      let a = t[o];
      if (typeof a == "number") s = a;
      else if (s == 1) i = gm(i, a);
      else if (s == 2) {
        let c = a,
          l = t[++o];
        r = gm(r, c + ": " + l + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = i) : (e.classesWithoutHost = i);
}
var Za = class extends Ni {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = ur(t);
    return new xs(n, this.ngModule);
  }
};
function qm(e, t) {
  let n = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let i = e[r];
    if (i === void 0) continue;
    let s = Array.isArray(i),
      o = s ? i[0] : i,
      a = s ? i[1] : lr.None;
    t
      ? n.push({
          propName: o,
          templateName: r,
          isSignal: (a & lr.SignalBased) !== 0,
        })
      : n.push({ propName: o, templateName: r });
  }
  return n;
}
function uC(e) {
  let t = e.toLowerCase();
  return t === "svg" ? Pg : t === "math" ? Jw : null;
}
var xs = class extends Ya {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = qm(t.inputs, !0);
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName]);
      return r;
    }
    get outputs() {
      return qm(this.componentDef.outputs, !1);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = Aw(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, i) {
      let s = Oe(null);
      try {
        i = i || this.ngModule;
        let o = i instanceof Gt ? i : i?.injector;
        o &&
          this.componentDef.getStandaloneInjector !== null &&
          (o = this.componentDef.getStandaloneInjector(o) || o);
        let a = o ? new $u(t, o) : t,
          c = a.get(dr, null);
        if (c === null) throw new G(407, !1);
        let l = a.get(lC, null),
          u = a.get(Ur, null),
          d = {
            rendererFactory: c,
            sanitizer: l,
            inlineEffectRunner: null,
            changeDetectionScheduler: u,
          },
          g = c.createRenderer(null, this.componentDef),
          E = this.componentDef.selectors[0][0] || "div",
          S = r
            ? FT(g, r, this.componentDef.encapsulation, a)
            : Xd(g, E, uC(E)),
          M = 512;
        this.componentDef.signals
          ? (M |= 4096)
          : this.componentDef.onPush || (M |= 16);
        let H = null;
        S !== null && (H = Wd(S, a, !0));
        let L = sf(0, null, null, 1, 0, null, null, null, null, null, null),
          D = Dc(null, L, null, M, null, null, d, g, a, null, H);
        xd(D);
        let w,
          I,
          b = null;
        try {
          let ee = this.componentDef,
            te,
            me = null;
          ee.findHostDirectiveDefs
            ? ((te = []),
              (me = new Map()),
              ee.findHostDirectiveDefs(ee, te, me),
              te.push(ee))
            : (te = [ee]);
          let q = dC(D, S);
          (b = fC(q, S, ee, te, D, d, g)),
            (I = Md(L, $e)),
            S && mC(g, ee, S, r),
            n !== void 0 && gC(I, this.ngContentSelectors, n),
            (w = pC(b, ee, te, me, D, [yC])),
            af(L, D, null);
        } catch (ee) {
          throw (b !== null && Qu(b), Qu(D), ee);
        } finally {
          Od();
        }
        return new hd(this.componentType, w, Bd(I, D), D, I);
      } finally {
        Oe(s);
      }
    }
  },
  hd = class extends ud {
    constructor(t, n, r, i, s) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = s),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new Ii(i, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        i;
      if (r !== null && (i = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return;
        let s = this._rootLView;
        of(s[ue], s, i, t, n), this.previousInputValues.set(t, n);
        let o = Br(this._tNode.index, s);
        dv(o, 1);
      }
    }
    get injector() {
      return new kr(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function dC(e, t) {
  let n = e[ue],
    r = $e;
  return (e[r] = t), Tc(n, r, 2, "#host", null);
}
function fC(e, t, n, r, i, s, o) {
  let a = i[ue];
  hC(r, e, t, o);
  let c = null;
  t !== null && (c = Wd(t, i[Di]));
  let l = s.rendererFactory.createRenderer(t, n),
    u = 16;
  n.signals ? (u = 4096) : n.onPush && (u = 64);
  let d = Dc(i, Yy(n), null, u, i[e.index], e, s, l, null, null, c);
  return (
    a.firstCreatePass && rd(a, e, r.length - 1), Sc(i, d), (i[e.index] = d)
  );
}
function hC(e, t, n, r) {
  for (let i of e) t.mergedAttrs = Dd(t.mergedAttrs, i.hostAttrs);
  t.mergedAttrs !== null &&
    (fd(t, t.mergedAttrs, !0), n !== null && Vy(r, n, t));
}
function pC(e, t, n, r, i, s) {
  let o = yn(),
    a = i[ue],
    c = an(o, i);
  Jy(a, i, o, n, null, r);
  for (let u = 0; u < n.length; u++) {
    let d = o.directiveStart + u,
      g = Ds(i, a, d, o);
    jr(g, i);
  }
  ev(a, i, o), c && jr(c, i);
  let l = Ds(i, a, o.directiveStart + o.componentOffset, o);
  if (((e[Rt] = i[Rt] = l), s !== null)) for (let u of s) u(l, t);
  return Wy(a, o, i), l;
}
function mC(e, t, n, r) {
  if (r) ku(e, n, ["ng-version", "18.2.5"]);
  else {
    let { attrs: i, classes: s } = Rw(t.selectors[0]);
    i && ku(e, n, i), s && s.length > 0 && Hy(e, n, s.join(" "));
  }
}
function gC(e, t, n) {
  let r = (e.projection = []);
  for (let i = 0; i < t.length; i++) {
    let s = n[i];
    r.push(s != null ? Array.from(s) : null);
  }
}
function yC() {
  let e = yn();
  Ld(tt()[ue], e);
}
var Nc = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = vC;
    }
  }
  return e;
})();
function vC() {
  let e = yn();
  return bC(e, tt());
}
var EC = Nc,
  bv = class extends EC {
    constructor(t, n, r) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return Bd(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new kr(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = Pd(this._hostTNode, this._hostLView);
      if (ry(t)) {
        let n = Ua(t, this._hostLView),
          r = ja(t),
          i = n[ue].data[r + 8];
        return new kr(i, n);
      } else return new kr(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = zm(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - ft;
    }
    createEmbeddedView(t, n, r) {
      let i, s;
      typeof r == "number"
        ? (i = r)
        : r != null && ((i = r.index), (s = r.injector));
      let o = Qa(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, s, o);
      return this.insertImpl(a, i, Ga(this._hostTNode, o)), a;
    }
    createComponent(t, n, r, i, s) {
      let o = t && !Kw(t),
        a;
      if (o) a = n;
      else {
        let S = n || {};
        (a = S.index),
          (r = S.injector),
          (i = S.projectableNodes),
          (s = S.environmentInjector || S.ngModuleRef);
      }
      let c = o ? t : new xs(ur(t)),
        l = r || this.parentInjector;
      if (!s && c.ngModule == null) {
        let M = (o ? l : this.parentInjector).get(Gt, null);
        M && (s = M);
      }
      let u = ur(c.componentType ?? {}),
        d = Qa(this._lContainer, u?.id ?? null),
        g = d?.firstChild ?? null,
        E = c.create(l, i, g, s);
      return this.insertImpl(E.hostView, a, Ga(this._hostTNode, d)), E;
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let i = t._lView;
      if (tD(i)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let c = i[ht],
            l = new bv(c, c[on], c[ht]);
          l.detach(l.indexOf(t));
        }
      }
      let s = this._adjustIndex(n),
        o = this._lContainer;
      return cf(o, i, s, r), t.attachToViewContainerRef(), hg(Nu(o), s, t), t;
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = zm(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = Ms(this._lContainer, n);
      r && (Oa(Nu(this._lContainer), n), _c(r[ue], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = Ms(this._lContainer, n);
      return r && Oa(Nu(this._lContainer), n) != null ? new Ii(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function zm(e) {
  return e[La];
}
function Nu(e) {
  return e[La] || (e[La] = []);
}
function bC(e, t) {
  let n,
    r = t[e.index];
  return (
    xt(r) ? (n = r) : ((n = tv(r, t, null, e)), (t[e.index] = n), Sc(t, n)),
    _v(n, t, e, r),
    new bv(n, e, t)
  );
}
function _C(e, t) {
  let n = e[et],
    r = n.createComment(""),
    i = an(t, e),
    s = jy(n, i);
  return za(n, s, r, IT(n, i), !1), r;
}
var _v = wv,
  uf = () => !1;
function wC(e, t, n) {
  return uf(e, t, n);
}
function wv(e, t, n, r) {
  if (e[xn]) return;
  let i;
  n.type & 8 ? (i = We(r)) : (i = _C(t, n)), (e[xn] = i);
}
function DC(e, t, n) {
  if (e[xn] && e[Es]) return !0;
  let r = n[sn],
    i = t.index - $e;
  if (!r || Cs(t) || Bs(r, i)) return !1;
  let o = td(r, i),
    a = r.data[Ns]?.[i],
    [c, l] = rC(o, a);
  return (e[xn] = c), (e[Es] = l), !0;
}
function TC(e, t, n, r) {
  uf(e, n, t) || wv(e, t, n, r);
}
function SC() {
  (_v = TC), (uf = DC);
}
var Gm = new Set();
function pr(e) {
  Gm.has(e) ||
    (Gm.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
function CC(e) {
  let t = [],
    n = new Map();
  function r(i) {
    let s = n.get(i);
    if (!s) {
      let o = e(i);
      n.set(i, (s = o.then(AC)));
    }
    return s;
  }
  return (
    Xa.forEach((i, s) => {
      let o = [];
      i.templateUrl &&
        o.push(
          r(i.templateUrl).then((l) => {
            i.template = l;
          }),
        );
      let a = typeof i.styles == "string" ? [i.styles] : i.styles || [];
      if (((i.styles = a), i.styleUrl && i.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple",
        );
      if (i.styleUrls?.length) {
        let l = i.styles.length,
          u = i.styleUrls;
        i.styleUrls.forEach((d, g) => {
          a.push(""),
            o.push(
              r(d).then((E) => {
                (a[l + g] = E),
                  u.splice(u.indexOf(d), 1),
                  u.length == 0 && (i.styleUrls = void 0);
              }),
            );
        });
      } else
        i.styleUrl &&
          o.push(
            r(i.styleUrl).then((l) => {
              a.push(l), (i.styleUrl = void 0);
            }),
          );
      let c = Promise.all(o).then(() => RC(s));
      t.push(c);
    }),
    NC(),
    Promise.all(t).then(() => {})
  );
}
var Xa = new Map(),
  IC = new Set();
function NC() {
  let e = Xa;
  return (Xa = new Map()), e;
}
function MC() {
  return Xa.size === 0;
}
function AC(e) {
  return typeof e == "string" ? e : e.text();
}
function RC(e) {
  IC.delete(e);
}
var fr = class {},
  Os = class {};
var Ja = class extends fr {
    constructor(t, n, r, i = !0) {
      super(),
        (this.ngModuleType = t),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Za(this));
      let s = wg(t);
      (this._bootstrapComponents = Ry(s.bootstrap)),
        (this._r3Injector = hy(
          t,
          n,
          [
            { provide: fr, useValue: this },
            { provide: Ni, useValue: this.componentFactoryResolver },
            ...r,
          ],
          At(t),
          new Set(["environment"]),
        )),
        i && this.resolveInjectorInitializers();
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
  ec = class extends Os {
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new Ja(this.moduleType, t, []);
    }
  };
function xC(e, t, n) {
  return new Ja(e, t, n, !1);
}
var tc = class extends fr {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new Za(this)),
      (this.instance = null);
    let n = new ys(
      [
        ...t.providers,
        { provide: fr, useValue: this },
        { provide: Ni, useValue: this.componentFactoryResolver },
      ],
      t.parent || Id(),
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
function df(e, t, n = null) {
  return new tc({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
function Dv(e, t, n) {
  return (e[t] = n);
}
function Tv(e, t) {
  return e[t];
}
function Mi(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function Wm(e, t, n, r) {
  let i = Mi(e, t, n);
  return Mi(e, t + 1, r) || i;
}
function OC(e, t, n, r, i, s) {
  let o = Wm(e, t, n, r);
  return Wm(e, t + 2, i, s) || o;
}
function xi(e) {
  return (e.flags & 32) === 32;
}
function kC(e, t, n, r, i, s, o, a, c) {
  let l = t.consts,
    u = Tc(t, e, 4, o || null, a || null);
  Xy(t, n, u, _s(l, c)), Ld(t, u);
  let d = (u.tView = sf(
    2,
    u,
    r,
    i,
    s,
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
function Km(e, t, n, r, i, s, o, a, c, l) {
  let u = n + $e,
    d = t.firstCreatePass ? kC(u, t, e, r, i, s, o, a, c) : t.data[u];
  Fs(d, !1);
  let g = Sv(t, e, d, n);
  kd() && ef(t, e, g, d), jr(g, e);
  let E = tv(g, e, g, d);
  return (
    (e[u] = E),
    Sc(e, E),
    wC(E, d, e),
    Ag(d) && Ky(t, e, d),
    c != null && Qy(e, d, l),
    d
  );
}
var Sv = Cv;
function Cv(e, t, n, r) {
  return hr(!0), t[et].createComment("");
}
function LC(e, t, n, r) {
  let i = t[sn],
    s = !i || Ps() || xi(n) || Bs(i, r);
  if ((hr(s), s)) return Cv(e, t, n, r);
  let o = i.data[Xu]?.[r] ?? null;
  o !== null &&
    n.tView !== null &&
    n.tView.ssrId === null &&
    (n.tView.ssrId = o);
  let a = Cc(i, e, t, n);
  bc(i, r, a);
  let c = Kd(i, r);
  return Ic(c, a);
}
function PC() {
  Sv = LC;
}
var us = (function (e) {
    return (
      (e[(e.EarlyRead = 0)] = "EarlyRead"),
      (e[(e.Write = 1)] = "Write"),
      (e[(e.MixedReadWrite = 2)] = "MixedReadWrite"),
      (e[(e.Read = 3)] = "Read"),
      e
    );
  })(us || {}),
  FC = (() => {
    class e {
      constructor() {
        this.impl = null;
      }
      execute() {
        this.impl?.execute();
      }
      static {
        this.ɵprov = ne({
          token: e,
          providedIn: "root",
          factory: () => new e(),
        });
      }
    }
    return e;
  })(),
  Qm = class e {
    constructor() {
      (this.ngZone = z(He)),
        (this.scheduler = z(Ur)),
        (this.errorHandler = z(On, { optional: !0 })),
        (this.sequences = new Set()),
        (this.deferredRegistrations = new Set()),
        (this.executing = !1);
    }
    static {
      this.PHASES = [us.EarlyRead, us.Write, us.MixedReadWrite, us.Read];
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
      this.ɵprov = ne({ token: e, providedIn: "root", factory: () => new e() });
    }
  };
function jC(e, t, n, r) {
  return Mi(e, Rd(), n) ? t + cc(n) + r : Hs;
}
function UC(e, t, n) {
  let r = tt(),
    i = Rd();
  if (Mi(r, i, t)) {
    let s = Ri(),
      o = gD();
    qT(s, o, r, e, t, r[et], n, !1);
  }
  return UC;
}
function Ym(e, t, n, r, i) {
  let s = t.inputs,
    o = i ? "class" : "style";
  of(e, n, s[o], o, r);
}
var pd = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      i = Math.max(t, n),
      s = this.detach(i);
    if (i - r > 1) {
      let o = this.detach(r);
      this.attach(r, s), this.attach(i, o);
    } else this.attach(r, s);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function Mu(e, t, n, r, i) {
  return e === n && Object.is(t, r) ? 1 : Object.is(i(e, t), i(n, r)) ? -1 : 0;
}
function BC(e, t, n) {
  let r,
    i,
    s = 0,
    o = e.length - 1,
    a = void 0;
  if (Array.isArray(t)) {
    let c = t.length - 1;
    for (; s <= o && s <= c; ) {
      let l = e.at(s),
        u = t[s],
        d = Mu(s, l, s, u, n);
      if (d !== 0) {
        d < 0 && e.updateValue(s, u), s++;
        continue;
      }
      let g = e.at(o),
        E = t[c],
        S = Mu(o, g, c, E, n);
      if (S !== 0) {
        S < 0 && e.updateValue(o, E), o--, c--;
        continue;
      }
      let M = n(s, l),
        H = n(o, g),
        L = n(s, u);
      if (Object.is(L, H)) {
        let D = n(c, E);
        Object.is(D, M)
          ? (e.swap(s, o), e.updateValue(o, E), c--, o--)
          : e.move(o, s),
          e.updateValue(s, u),
          s++;
        continue;
      }
      if (((r ??= new nc()), (i ??= Xm(e, s, o, n)), md(e, r, s, L)))
        e.updateValue(s, u), s++, o++;
      else if (i.has(L)) r.set(M, e.detach(s)), o--;
      else {
        let D = e.create(s, t[s]);
        e.attach(s, D), s++, o++;
      }
    }
    for (; s <= c; ) Zm(e, r, n, s, t[s]), s++;
  } else if (t != null) {
    let c = t[Symbol.iterator](),
      l = c.next();
    for (; !l.done && s <= o; ) {
      let u = e.at(s),
        d = l.value,
        g = Mu(s, u, s, d, n);
      if (g !== 0) g < 0 && e.updateValue(s, d), s++, (l = c.next());
      else {
        (r ??= new nc()), (i ??= Xm(e, s, o, n));
        let E = n(s, d);
        if (md(e, r, s, E)) e.updateValue(s, d), s++, o++, (l = c.next());
        else if (!i.has(E))
          e.attach(s, e.create(s, d)), s++, o++, (l = c.next());
        else {
          let S = n(s, u);
          r.set(S, e.detach(s)), o--;
        }
      }
    }
    for (; !l.done; ) Zm(e, r, n, e.length, l.value), (l = c.next());
  }
  for (; s <= o; ) e.destroy(e.detach(o--));
  r?.forEach((c) => {
    e.destroy(c);
  });
}
function md(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function Zm(e, t, n, r, i) {
  if (md(e, t, r, n(r, i))) e.updateValue(r, i);
  else {
    let s = e.create(r, i);
    e.attach(r, s);
  }
}
function Xm(e, t, n, r) {
  let i = new Set();
  for (let s = t; s <= n; s++) i.add(r(s, e.at(s)));
  return i;
}
var nc = class {
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
      let i = this._vMap;
      for (; i.has(r); ) r = i.get(r);
      i.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let i = this._vMap;
        for (; i.has(r); ) (r = i.get(r)), t(r, n);
      }
  }
};
var gd = class {
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - ft;
  }
};
var yd = class {
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function IP(e, t, n, r, i, s, o, a, c, l, u, d, g) {
  pr("NgControlFlow");
  let E = tt(),
    S = Ri(),
    M = c !== void 0,
    H = tt(),
    L = a ? o.bind(H[Tt][Rt]) : o,
    D = new yd(M, L);
  (H[$e + e] = D),
    Km(E, S, e + 1, t, n, r, i, _s(S.consts, s)),
    M && Km(E, S, e + 2, c, l, u, d, _s(S.consts, g));
}
var vd = class extends pd {
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.operationsCounter = void 0),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - ft;
  }
  at(t) {
    return this.getLView(t)[Rt].$implicit;
  }
  attach(t, n) {
    let r = n[sn];
    (this.needsIndexUpdate ||= t !== this.length),
      cf(this.lContainer, n, t, Ga(this.templateTNode, r));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), HC(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = Qa(this.lContainer, this.templateTNode.tView.ssrId),
      i = rv(
        this.hostLView,
        this.templateTNode,
        new gd(this.lContainer, n, t),
        { dehydratedView: r },
      );
    return this.operationsCounter?.recordCreate(), i;
  }
  destroy(t) {
    _c(t[ue], t), this.operationsCounter?.recordDestroy();
  }
  updateValue(t, n) {
    this.getLView(t)[Rt].$implicit = n;
  }
  reset() {
    (this.needsIndexUpdate = !1), this.operationsCounter?.reset();
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[Rt].$index = t;
  }
  getLView(t) {
    return VC(this.lContainer, t);
  }
};
function NP(e) {
  let t = Oe(null),
    n = gc();
  try {
    let r = tt(),
      i = r[ue],
      s = r[n],
      o = n + 1,
      a = Jm(r, o);
    if (s.liveCollection === void 0) {
      let l = eg(i, o);
      s.liveCollection = new vd(a, r, l);
    } else s.liveCollection.reset();
    let c = s.liveCollection;
    if ((BC(c, e, s.trackByFn), c.updateIndexes(), s.hasEmptyBlock)) {
      let l = Rd(),
        u = c.length === 0;
      if (Mi(r, l, u)) {
        let d = n + 2,
          g = Jm(r, d);
        if (u) {
          let E = eg(i, d),
            S = Qa(g, E.tView.ssrId),
            M = rv(r, E, void 0, { dehydratedView: S });
          cf(g, M, 0, Ga(E, S));
        } else uS(g, 0);
      }
    }
  } finally {
    Oe(t);
  }
}
function Jm(e, t) {
  return e[t];
}
function HC(e, t) {
  return Ms(e, t);
}
function VC(e, t) {
  return lS(e, t);
}
function eg(e, t) {
  return Md(e, t);
}
function $C(e, t, n, r, i, s) {
  let o = t.consts,
    a = _s(o, i),
    c = Tc(t, e, 2, r, a);
  return (
    Xy(t, n, c, _s(o, s)),
    c.attrs !== null && fd(c, c.attrs, !1),
    c.mergedAttrs !== null && fd(c, c.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, c),
    c
  );
}
function Iv(e, t, n, r) {
  let i = tt(),
    s = Ri(),
    o = $e + e,
    a = i[et],
    c = s.firstCreatePass ? $C(o, s, i, t, n, r) : s.data[o],
    l = Mv(s, i, c, a, t, e);
  i[o] = l;
  let u = Ag(c);
  return (
    Fs(c, !0),
    Vy(a, l, c),
    !xi(c) && kd() && ef(s, i, l, c),
    rD() === 0 && jr(l, i),
    iD(),
    u && (Ky(s, i, c), Wy(s, c, i)),
    r !== null && Qy(i, c),
    Iv
  );
}
function Nv() {
  let e = yn();
  qg() ? uD() : ((e = e.parent), Fs(e, !1));
  let t = e;
  oD(t) && cD(), sD();
  let n = Ri();
  return (
    n.firstCreatePass && (Ld(n, e), Mg(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      wD(t) &&
      Ym(n, t, tt(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      DD(t) &&
      Ym(n, t, tt(), t.stylesWithoutHost, !1),
    Nv
  );
}
function ff(e, t, n, r) {
  return Iv(e, t, n, r), Nv(), ff;
}
var Mv = (e, t, n, r, i, s) => (hr(!0), Xd(r, i, Jg()));
function qC(e, t, n, r, i, s) {
  let o = t[sn],
    a = !o || Ps() || xi(n) || Bs(o, s);
  if ((hr(a), a)) return Xd(r, i, Jg());
  let c = Cc(o, e, t, n);
  return (
    Sy(o, s) && bc(o, s, c.nextSibling),
    o && (Hd(n) || vy(c)) && Ai(n) && (aD(n), By(c)),
    c
  );
}
function zC() {
  Mv = qC;
}
var GC = (e, t, n, r) => (hr(!0), Oy(t[et], ""));
function WC(e, t, n, r) {
  let i,
    s = t[sn],
    o = !s || Ps() || Bs(s, r) || xi(n);
  if ((hr(o), o)) return Oy(t[et], "");
  let a = Cc(s, e, t, n),
    c = sT(s, r);
  return bc(s, r, a), (i = Ic(c, a)), i;
}
function KC() {
  GC = WC;
}
var rc = "en-US";
var QC = rc;
function YC(e) {
  typeof e == "string" && (QC = e.toLowerCase().replace(/_/g, "-"));
}
function MP(e, t = "") {
  let n = tt(),
    r = Ri(),
    i = e + $e,
    s = r.firstCreatePass ? Tc(r, i, 1, t, null) : r.data[i],
    o = Av(r, n, s, t, e);
  (n[i] = o), kd() && ef(r, n, o, s), Fs(s, !1);
}
var Av = (e, t, n, r, i) => (hr(!0), xy(t[et], r));
function ZC(e, t, n, r, i) {
  let s = t[sn],
    o = !s || Ps() || xi(n) || Bs(s, i);
  return hr(o), o ? xy(t[et], r) : Cc(s, e, t, n);
}
function XC() {
  Av = ZC;
}
function JC(e) {
  return Rv("", e, ""), JC;
}
function Rv(e, t, n) {
  let r = tt(),
    i = jC(r, e, t, n);
  return i !== Hs && sS(r, gc(), i), Rv;
}
var eI = (() => {
  class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = Sg(!1, n.type),
          i =
            r.length > 0
              ? df([r], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, i);
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
      this.ɵprov = ne({
        token: e,
        providedIn: "environment",
        factory: () => new e(le(Gt)),
      });
    }
  }
  return e;
})();
function xv(e) {
  pr("NgStandalone"),
    (e.getStandaloneInjector = (t) =>
      t.get(eI).getOrCreateStandaloneInjector(e));
}
function AP(e, t, n) {
  let r = Gg() + e,
    i = tt();
  return i[r] === Hs ? Dv(i, r, n ? t.call(n) : t()) : Tv(i, r);
}
function RP(e, t, n, r, i, s, o, a) {
  let c = Gg() + e,
    l = tt(),
    u = OC(l, c, n, r, i, s);
  return Mi(l, c + 4, o) || u
    ? Dv(l, c + 5, a ? t.call(a, n, r, i, s, o) : t(n, r, i, s, o))
    : Tv(l, c + 5);
}
var Da = null;
function tI(e) {
  (Da !== null &&
    (e.defaultEncapsulation !== Da.defaultEncapsulation ||
      e.preserveWhitespaces !== Da.preserveWhitespaces)) ||
    (Da = e);
}
var Mc = (() => {
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
      this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "platform" });
    }
  }
  return e;
})();
var Ac = new ie(""),
  Ov = new ie(""),
  hf = (() => {
    class e {
      constructor(n, r, i) {
        (this._ngZone = n),
          (this.registry = r),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          pf || (nI(i), i.addToWindow(r)),
          this._watchAngularEvents(),
          n.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                He.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      isStable() {
        return this._isZoneStable && !this._ngZone.hasPendingMacrotasks;
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let n = this._callbacks.pop();
              clearTimeout(n.timeoutId), n.doneCb();
            }
          });
        else {
          let n = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((r) =>
            r.updateCb && r.updateCb(n) ? (clearTimeout(r.timeoutId), !1) : !0,
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((n) => ({
              source: n.source,
              creationLocation: n.creationLocation,
              data: n.data,
            }))
          : [];
      }
      addCallback(n, r, i) {
        let s = -1;
        r &&
          r > 0 &&
          (s = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (o) => o.timeoutId !== s,
            )),
              n();
          }, r)),
          this._callbacks.push({ doneCb: n, timeoutId: s, updateCb: i });
      }
      whenStable(n, r, i) {
        if (i && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?',
          );
        this.addCallback(n, r, i), this._runCallbacksIfReady();
      }
      registerApplication(n) {
        this.registry.registerApplication(n, this);
      }
      unregisterApplication(n) {
        this.registry.unregisterApplication(n);
      }
      findProviders(n, r, i) {
        return [];
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(He), le(kv), le(Ov));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  kv = (() => {
    class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(n, r) {
        this._applications.set(n, r);
      }
      unregisterApplication(n) {
        this._applications.delete(n);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(n) {
        return this._applications.get(n) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(n, r = !0) {
        return pf?.findTestabilityInTree(this, n, r) ?? null;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "platform" });
      }
    }
    return e;
  })();
function nI(e) {
  pf = e;
}
var pf;
function $s(e) {
  return !!e && typeof e.then == "function";
}
function Lv(e) {
  return !!e && typeof e.subscribe == "function";
}
var Pv = new ie(""),
  Fv = (() => {
    class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, r) => {
            (this.resolve = n), (this.reject = r);
          })),
          (this.appInits = z(Pv, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let i of this.appInits) {
          let s = i();
          if ($s(s)) n.push(s);
          else if (Lv(s)) {
            let o = new Promise((a, c) => {
              s.subscribe({ complete: a, error: c });
            });
            n.push(o);
          }
        }
        let r = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            r();
          })
          .catch((i) => {
            this.reject(i);
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
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  Oi = new ie("");
function jv() {
  jp(() => {
    throw new G(600, !1);
  });
}
function rI(e) {
  return e.isBoundToModule;
}
var iI = 10;
function sI(e, t, n) {
  try {
    let r = n();
    return $s(r)
      ? r.catch((i) => {
          throw (t.runOutsideAngular(() => e.handleError(i)), i);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
function Uv(e, t) {
  return Array.isArray(t) ? t.reduce(Uv, e) : Y(Y({}, e), t);
}
var Wt = (() => {
  class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = z(qD)),
        (this.afterRenderManager = z(FC)),
        (this.zonelessEnabled = z(lf)),
        (this.dirtyFlags = 0),
        (this.deferredDirtyFlags = 0),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new ut()),
        (this.afterTick = new ut()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = z(Hr).hasPendingTasks.pipe(Se((n) => !n))),
        (this._injector = z(Gt));
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
          next: (i) => {
            i && r();
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
      let i = n instanceof Ya;
      if (!this._injector.get(Fv).done) {
        let g = !i && _g(n),
          E = !1;
        throw new G(405, E);
      }
      let o;
      i ? (o = n) : (o = this._injector.get(Ni).resolveComponentFactory(n)),
        this.componentTypes.push(o.componentType);
      let a = rI(o) ? void 0 : this._injector.get(fr),
        c = r || o.selector,
        l = o.create(St.NULL, [], c, a),
        u = l.location.nativeElement,
        d = l.injector.get(Ac, null);
      return (
        d?.registerApplication(u),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Aa(this.components, l),
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
      if (this._runningTick) throw new G(101, !1);
      let n = Oe(null);
      try {
        (this._runningTick = !0), this.synchronize();
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        (this._runningTick = !1), Oe(n), this.afterTick.next();
      }
    }
    synchronize() {
      let n = null;
      this._injector.destroyed ||
        (n = this._injector.get(dr, null, { optional: !0 })),
        (this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0);
      let r = 0;
      for (; this.dirtyFlags !== 0 && r++ < iI; ) this.synchronizeOnce(n);
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
        for (let { _lView: i, notifyErrorHandler: s } of this._views)
          oI(i, s, r, this.zonelessEnabled);
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
      if (this.allViews.some(({ _lView: n }) => pc(n))) {
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
      Aa(this._views, r), r.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let r = this._injector.get(Oi, []);
      [...this._bootstrapListeners, ...r].forEach((i) => i(n));
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
        this._destroyListeners.push(n), () => Aa(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new G(406, !1);
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
      this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function Aa(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
var Ta;
function ki(e) {
  Ta ??= new WeakMap();
  let t = Ta.get(e);
  if (t) return t;
  let n = e.isStable
    .pipe(Jt((r) => r))
    .toPromise()
    .then(() => {});
  return Ta.set(e, n), e.onDestroy(() => Ta?.delete(e)), n;
}
function oI(e, t, n, r) {
  if (!n && !pc(e)) return;
  av(e, t, n && !r ? 0 : 1);
}
var Ed = class {
    constructor(t, n) {
      (this.ngModuleFactory = t), (this.componentFactories = n);
    }
  },
  mf = (() => {
    class e {
      compileModuleSync(n) {
        return new ec(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let r = this.compileModuleSync(n),
          i = wg(n),
          s = Ry(i.declarations).reduce((o, a) => {
            let c = ur(a);
            return c && o.push(new xs(c)), o;
          }, []);
        return new Ed(r, s);
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
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  aI = new ie("");
function cI(e, t, n) {
  let r = new ec(n);
  return Promise.resolve(r);
}
function tg(e) {
  for (let t = e.length - 1; t >= 0; t--) if (e[t] !== void 0) return e[t];
}
var lI = (() => {
    class e {
      constructor() {
        (this.zone = z(He)),
          (this.changeDetectionScheduler = z(Ur)),
          (this.applicationRef = z(Wt));
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
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  uI = new ie("", { factory: () => !1 });
function gf({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new He(Ge(Y({}, yf()), { scheduleInRootZone: n }))),
    [
      { provide: He, useFactory: e },
      {
        provide: Lr,
        multi: !0,
        useFactory: () => {
          let r = z(lI, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: Lr,
        multi: !0,
        useFactory: () => {
          let r = z(dI);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: vv, useValue: !0 } : [],
      { provide: Ev, useValue: n ?? py },
    ]
  );
}
function xP(e) {
  let t = e?.ignoreChangesOutsideZone,
    n = e?.scheduleInRootZone,
    r = gf({
      ngZoneFactory: () => {
        let i = yf(e);
        return (
          (i.scheduleInRootZone = n),
          i.shouldCoalesceEventChangeDetection && pr("NgZone_CoalesceEvent"),
          new He(i)
        );
      },
      ignoreChangesOutsideZone: t,
      scheduleInRootZone: n,
    });
  return kn([{ provide: uI, useValue: !0 }, { provide: lf, useValue: !1 }, r]);
}
function yf(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var dI = (() => {
  class e {
    constructor() {
      (this.subscription = new rt()),
        (this.initialized = !1),
        (this.zone = z(He)),
        (this.pendingTasks = z(Hr));
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
              He.assertNotInAngularZone(),
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
            He.assertInAngularZone(), (n ??= this.pendingTasks.add());
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
      this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
var Bv = (() => {
  class e {
    constructor() {
      (this.appRef = z(Wt)),
        (this.taskService = z(Hr)),
        (this.ngZone = z(He)),
        (this.zonelessEnabled = z(lf)),
        (this.disableScheduling = z(vv, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < "u" && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new rt()),
        (this.angularZoneId = this.zoneIsDefined
          ? this.ngZone._inner?.get(Ha)
          : null),
        (this.scheduleInRootZone =
          !this.zonelessEnabled &&
          this.zoneIsDefined &&
          (z(Ev, { optional: !0 }) ?? !1)),
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
          (this.ngZone instanceof Va || !this.zoneIsDefined));
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
      let r = this.useMicrotaskScheduler ? km : gy;
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
          Zone.current.get(Ha + this.angularZoneId))
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
        km(() => {
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
      this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function fI() {
  return (typeof $localize < "u" && $localize.locale) || rc;
}
var vf = new ie("", {
  providedIn: "root",
  factory: () => z(vf, Ee.Optional | Ee.SkipSelf) || fI(),
});
var Ef = new ie("");
function Sa(e) {
  return !!e.platformInjector;
}
function Hv(e) {
  let t = Sa(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(He);
  return n.run(() => {
    Sa(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(On, null),
      i;
    if (
      (n.runOutsideAngular(() => {
        i = n.onError.subscribe({
          next: (s) => {
            r.handleError(s);
          },
        });
      }),
      Sa(e))
    ) {
      let s = () => t.destroy(),
        o = e.platformInjector.get(Ef);
      o.add(s),
        t.onDestroy(() => {
          i.unsubscribe(), o.delete(s);
        });
    } else
      e.moduleRef.onDestroy(() => {
        Aa(e.allPlatformModules, e.moduleRef), i.unsubscribe();
      });
    return sI(r, n, () => {
      let s = t.get(Fv);
      return (
        s.runInitializers(),
        s.donePromise.then(() => {
          let o = t.get(vf, rc);
          if ((YC(o || rc), Sa(e))) {
            let a = t.get(Wt);
            return (
              e.rootComponent !== void 0 && a.bootstrap(e.rootComponent), a
            );
          } else return hI(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function hI(e, t) {
  let n = e.injector.get(Wt);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new G(-403, !1);
  t.push(e);
}
var Vv = (() => {
    class e {
      constructor(n) {
        (this._injector = n),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(n, r) {
        let i = r?.scheduleInRootZone,
          s = () =>
            $D(
              r?.ngZone,
              Ge(
                Y(
                  {},
                  yf({
                    eventCoalescing: r?.ngZoneEventCoalescing,
                    runCoalescing: r?.ngZoneRunCoalescing,
                  }),
                ),
                { scheduleInRootZone: i },
              ),
            ),
          o = r?.ignoreChangesOutsideZone,
          a = [
            gf({ ngZoneFactory: s, ignoreChangesOutsideZone: o }),
            { provide: Ur, useExisting: Bv },
          ],
          c = xC(n.moduleType, this.injector, a);
        return Hv({ moduleRef: c, allPlatformModules: this._modules });
      }
      bootstrapModule(n, r = []) {
        let i = Uv({}, r);
        return cI(this.injector, i, n).then((s) =>
          this.bootstrapModuleFactory(s, i),
        );
      }
      onDestroy(n) {
        this._destroyListeners.push(n);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new G(404, !1);
        this._modules.slice().forEach((r) => r.destroy()),
          this._destroyListeners.forEach((r) => r());
        let n = this._injector.get(Ef, null);
        n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(St));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "platform" });
      }
    }
    return e;
  })(),
  ar = null,
  Rc = new ie("");
function pI(e) {
  if (ar && !ar.get(Rc, !1)) throw new G(400, !1);
  jv(), (ar = e);
  let t = e.get(Vv);
  return zv(e), t;
}
function xc(e, t, n = []) {
  let r = `Platform: ${t}`,
    i = new ie(r);
  return (s = []) => {
    let o = qv();
    if (!o || o.injector.get(Rc, !1)) {
      let a = [...n, ...s, { provide: i, useValue: !0 }];
      e ? e(a) : pI($v(a, r));
    }
    return mI(i);
  };
}
function $v(e = [], t) {
  return St.create({
    name: t,
    providers: [
      { provide: dc, useValue: "platform" },
      { provide: Ef, useValue: new Set([() => (ar = null)]) },
      ...e,
    ],
  });
}
function mI(e) {
  let t = qv();
  if (!t) throw new G(401, !1);
  return t;
}
function qv() {
  return ar?.get(Vv) ?? null;
}
function gI(e = []) {
  if (ar) return ar;
  let t = $v(e);
  return (ar = t), jv(), zv(t), t;
}
function zv(e) {
  e.get(js, null)?.forEach((n) => n());
}
var qs = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = yI;
    }
  }
  return e;
})();
function yI(e) {
  return vI(yn(), tt(), (e & 16) === 16);
}
function vI(e, t, n) {
  if (Ai(e) && !n) {
    let r = Br(e.index, t);
    return new Ii(r, r);
  } else if (e.type & 175) {
    let r = t[Tt];
    return new Ii(r, t);
  }
  return null;
}
var bf = xc(null, "core", []);
function Gv(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      i = gI(r),
      s = [gf({}), { provide: Ur, useExisting: Bv }, ...(n || [])],
      o = new tc({
        providers: s,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return Hv({
      r3Injector: o.injector,
      platformInjector: i,
      rootComponent: t,
    });
  } catch (t) {
    return Promise.reject(t);
  }
}
function EI(e, t) {
  if (!t.length) return;
  let n = t.reduce((i, s) => i + s + ":;", ""),
    r = e.getAttribute(vu.JSACTION);
  e.setAttribute(vu.JSACTION, `${r ?? ""}${n}`);
}
var Wv = new ie("");
function bI(e, t, n) {
  let r = new Map(),
    i = t[Uu],
    s = e.cleanup;
  if (!s || !i) return r;
  for (let o = 0; o < s.length; ) {
    let a = s[o++],
      c = s[o++];
    if (typeof a != "string") continue;
    let l = a;
    if (!mm(l)) continue;
    pm(l) ? n.capture.add(l) : n.regular.add(l);
    let u = We(t[c]);
    o++;
    let d = s[o++];
    (typeof d == "boolean" || d >= 0) &&
      (r.has(u) ? r.get(u).push(l) : r.set(u, [l]));
  }
  return r;
}
var bd = class {
    constructor() {
      (this.views = []), (this.indexByContent = new Map());
    }
    add(t) {
      let n = JSON.stringify(t);
      if (!this.indexByContent.has(n)) {
        let r = this.views.length;
        return this.views.push(t), this.indexByContent.set(n, r), r;
      }
      return this.indexByContent.get(n);
    }
    getAll() {
      return this.views;
    }
  },
  _I = 0;
function Kv(e) {
  return e.ssrId || (e.ssrId = `t${_I++}`), e.ssrId;
}
function Qv(e, t, n) {
  let r = [];
  return As(e, t, n, r), r.length;
}
function wI(e) {
  let t = [];
  return iv(e, t), t.length;
}
function Yv(e, t) {
  let n = e[Je];
  return n && !n.hasAttribute(Ts) ? ic(n, e, t) : null;
}
function Zv(e, t) {
  let n = Fg(e[Je]),
    r = Yv(n, t);
  if (r === null) return;
  let i = We(n[Je]),
    s = e[ht],
    o = ic(i, s, t),
    a = n[et],
    c = `${r}|${o}`;
  a.setAttribute(i, hs, c);
}
function Xv(e, t) {
  let n = e.injector,
    r = GS(n),
    i = new bd(),
    s = new Map(),
    o = e._views,
    a = n.get(cT, lT),
    c = { regular: new Set(), capture: new Set() };
  for (let d of o) {
    let g = Ty(d);
    if (g !== null) {
      let E = {
        serializedViewCollection: i,
        corruptedTextNodes: s,
        isI18nHydrationEnabled: r,
        i18nChildren: new Map(),
        eventTypesToReplay: c,
        shouldReplayEvents: a,
      };
      xt(g) ? Zv(g, E) : Yv(g, E), CI(s, t);
    }
  }
  let l = i.getAll();
  return n.get(Ln).set(zd, l), c;
}
function DI(e, t) {
  let n = [],
    r = "";
  for (let i = ft; i < e.length; i++) {
    let s = e[i],
      o,
      a,
      c;
    if (bs(s) && ((s = s[$e]), xt(s))) {
      (a = wI(s) + 1), Zv(s, t);
      let u = Fg(s[Je]);
      c = { [Ju]: u[ue].ssrId, [Ci]: a };
    }
    if (!c) {
      let u = s[ue];
      u.type === 1
        ? ((o = u.ssrId), (a = 1))
        : ((o = Kv(u)), (a = Qv(u, s, u.firstChild))),
        (c = Y({ [Ju]: o, [Ci]: a }, Jv(e[i], t)));
    }
    let l = JSON.stringify(c);
    if (n.length > 0 && l === r) {
      let u = n[n.length - 1];
      (u[$a] ??= 1), u[$a]++;
    } else (r = l), n.push(c);
  }
  return n;
}
function ps(e, t, n, r) {
  let i = t.index - $e;
  (e[ed] ??= {}), (e[ed][i] ??= $S(t, n, r));
}
function Au(e, t) {
  let n = typeof t == "number" ? t : t.index - $e;
  (e[fs] ??= []), e[fs].includes(n) || e[fs].push(n);
}
function Jv(e, t) {
  let n = {},
    r = e[ue],
    i = WS(r, t),
    s = t.shouldReplayEvents ? bI(r, e, t.eventTypesToReplay) : null;
  for (let o = $e; o < r.bindingStartIndex; o++) {
    let a = r.data[o],
      c = o - $e,
      l = QS(e, o, t);
    if (l) {
      (n[jm] ??= {}), (n[jm][c] = l.caseQueue);
      for (let u of l.disconnectedNodes) Au(n, u);
      for (let u of l.disjointNodes) {
        let d = r.data[u + $e];
        ps(n, d, e, i);
      }
      continue;
    }
    if (ny(a) && !xi(a)) {
      if (Rs(a, e) && II(a)) {
        Au(n, a);
        continue;
      }
      if (s && a.type & 2) {
        let u = We(e[o]);
        s.has(u) && EI(u, s.get(u));
      }
      if (Array.isArray(a.projection)) {
        for (let u of a.projection)
          if (u)
            if (!Array.isArray(u))
              !Rg(u) && !Cs(u) && (Rs(u, e) ? Au(n, u) : ps(n, u, e, i));
            else throw TS(We(e[o]));
      }
      if ((TI(n, a, e, i), xt(e[o]))) {
        let u = a.tView;
        u !== null && ((n[Xu] ??= {}), (n[Xu][c] = Kv(u)));
        let d = e[o][Je];
        if (Array.isArray(d)) {
          let g = We(d);
          g.hasAttribute(Ts) || ic(g, d, t);
        }
        (n[Ns] ??= {}), (n[Ns][c] = DI(e[o], t));
      } else if (Array.isArray(e[o]) && !_D(a)) {
        let u = We(e[o][Je]);
        u.hasAttribute(Ts) || ic(u, e[o], t);
      } else if (a.type & 8) (n[Zu] ??= {}), (n[Zu][c] = Qv(r, e, a.child));
      else if (a.type & 144) {
        let u = a.next;
        for (; u !== null && u.type & 144; ) u = u.next;
        u && !Cs(u) && ps(n, u, e, i);
      } else if (a.type & 1) {
        let u = We(e[o]);
        Cy(t, u);
      }
    }
  }
  return n;
}
function TI(e, t, n, r) {
  Rg(t) ||
    (t.projectionNext &&
      t.projectionNext !== t.next &&
      !Cs(t.projectionNext) &&
      ps(e, t.projectionNext, n, r),
    t.prev === null &&
      t.parent !== null &&
      Rs(t.parent, n) &&
      !Rs(t, n) &&
      ps(e, t, n, r));
}
function SI(e) {
  let t = e[Rt];
  return t?.constructor
    ? ur(t.constructor)?.encapsulation === rn.ShadowDom
    : !1;
}
function ic(e, t, n) {
  let r = t[et];
  if ((Qw(t) && !zS()) || SI(t)) return r.setAttribute(e, Ts, ""), null;
  {
    let i = Jv(t, n),
      s = n.serializedViewCollection.add(i);
    return r.setAttribute(e, hs, s.toString()), s;
  }
}
function CI(e, t) {
  for (let [n, r] of e) n.after(t.createComment(r));
}
function II(e) {
  let t = e;
  for (; t != null; ) {
    if (Ai(t)) return !0;
    t = t.parent;
  }
  return !1;
}
var ng = !1;
function NI() {
  ng || ((ng = !0), nT(), zC(), XC(), KC(), PC(), SC(), sC(), BT());
}
function MI(e, t) {
  return ki(e);
}
function eE() {
  return kn([
    {
      provide: vi,
      useFactory: () => {
        let e = !0;
        return (
          wa() && (e = !!z(Ln, { optional: !0 })?.get(zd, null)),
          e && pr("NgHydration"),
          e
        );
      },
    },
    {
      provide: Lr,
      useValue: () => {
        qS(!1), wa() && z(vi) && (AI(), NI());
      },
      multi: !0,
    },
    { provide: Ny, useFactory: () => wa() && z(vi) },
    {
      provide: Oi,
      useFactory: () => {
        if (wa() && z(vi)) {
          let e = z(Wt),
            t = z(St);
          return () => {
            MI(e, t).then(() => {
              nC(e);
            });
          };
        }
        return () => {};
      },
      multi: !0,
    },
  ]);
}
function AI() {
  let e = Ec(),
    t;
  for (let n of e.body.childNodes)
    if (n.nodeType === Node.COMMENT_NODE && n.textContent?.trim() === Gd) {
      t = n;
      break;
    }
  if (!t) throw new G(-507, !1);
}
function OP(...e) {
  return e.reduce(
    (t, n) =>
      Object.assign(t, n, { providers: [...t.providers, ...n.providers] }),
    { providers: [] },
  );
}
var rE = null;
function vn() {
  return rE;
}
function Pc(e) {
  rE ??= e;
}
var Oc = class {};
var qe = new ie(""),
  Gs = (() => {
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
        this.ɵprov = ne({
          token: e,
          factory: () => z(kI),
          providedIn: "platform",
        });
      }
    }
    return e;
  })();
var kI = (() => {
  class e extends Gs {
    constructor() {
      super(),
        (this._doc = z(qe)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return vn().getBaseHref(this._doc);
    }
    onPopState(n) {
      let r = vn().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("popstate", n, !1),
        () => r.removeEventListener("popstate", n)
      );
    }
    onHashChange(n) {
      let r = vn().getGlobalEventTarget(this._doc, "window");
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
    pushState(n, r, i) {
      this._history.pushState(n, r, i);
    }
    replaceState(n, r, i) {
      this._history.replaceState(n, r, i);
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
      this.ɵprov = ne({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      });
    }
  }
  return e;
})();
function iE(e, t) {
  if (e.length == 0) return t;
  if (t.length == 0) return e;
  let n = 0;
  return (
    e.endsWith("/") && n++,
    t.startsWith("/") && n++,
    n == 2 ? e + t.substring(1) : n == 1 ? e + t : e + "/" + t
  );
}
function tE(e) {
  let t = e.match(/#|\?|$/),
    n = (t && t.index) || e.length,
    r = n - (e[n - 1] === "/" ? 1 : 0);
  return e.slice(0, r) + e.slice(n);
}
function qr(e) {
  return e && e[0] !== "?" ? "?" + e : e;
}
var Fc = (() => {
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
        this.ɵprov = ne({ token: e, factory: () => z(sE), providedIn: "root" });
      }
    }
    return e;
  })(),
  LI = new ie(""),
  sE = (() => {
    class e extends Fc {
      constructor(n, r) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            r ??
            this._platformLocation.getBaseHrefFromDOM() ??
            z(qe).location?.origin ??
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
        return iE(this._baseHref, n);
      }
      path(n = !1) {
        let r =
            this._platformLocation.pathname + qr(this._platformLocation.search),
          i = this._platformLocation.hash;
        return i && n ? `${r}${i}` : r;
      }
      pushState(n, r, i, s) {
        let o = this.prepareExternalUrl(i + qr(s));
        this._platformLocation.pushState(n, r, o);
      }
      replaceState(n, r, i, s) {
        let o = this.prepareExternalUrl(i + qr(s));
        this._platformLocation.replaceState(n, r, o);
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
          return new (r || e)(le(Gs), le(LI, 8));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
var Ws = (() => {
  class e {
    constructor(n) {
      (this._subject = new Et()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = n);
      let r = this._locationStrategy.getBaseHref();
      (this._basePath = jI(tE(nE(r)))),
        this._locationStrategy.onPopState((i) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: i.state,
            type: i.type,
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
      return this.path() == this.normalize(n + qr(r));
    }
    normalize(n) {
      return e.stripTrailingSlash(FI(this._basePath, nE(n)));
    }
    prepareExternalUrl(n) {
      return (
        n && n[0] !== "/" && (n = "/" + n),
        this._locationStrategy.prepareExternalUrl(n)
      );
    }
    go(n, r = "", i = null) {
      this._locationStrategy.pushState(i, "", n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + qr(r)), i);
    }
    replaceState(n, r = "", i = null) {
      this._locationStrategy.replaceState(i, "", n, r),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + qr(r)), i);
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
      this._urlChangeListeners.forEach((i) => i(n, r));
    }
    subscribe(n, r, i) {
      return this._subject.subscribe({ next: n, error: r, complete: i });
    }
    static {
      this.normalizeQueryParams = qr;
    }
    static {
      this.joinWithSlash = iE;
    }
    static {
      this.stripTrailingSlash = tE;
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)(le(Fc));
      };
    }
    static {
      this.ɵprov = ne({ token: e, factory: () => PI(), providedIn: "root" });
    }
  }
  return e;
})();
function PI() {
  return new Ws(le(Fc));
}
function FI(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let n = t.substring(e.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t;
}
function nE(e) {
  return e.replace(/\/index.html$/, "");
}
function jI(e) {
  if (new RegExp("^(https?:)?//").test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/);
    return n;
  }
  return e;
}
function Df(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [i, s] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (i.trim() === t) return decodeURIComponent(s);
  }
  return null;
}
var Tf = "browser",
  Sf = "server";
function UI(e) {
  return e === Tf;
}
function Ks(e) {
  return e === Sf;
}
var Cf = (() => {
    class e {
      static {
        this.ɵprov = ne({
          token: e,
          providedIn: "root",
          factory: () => (UI(z(Ot)) ? new _f(z(qe), window) : new zs()),
        });
      }
    }
    return e;
  })(),
  _f = class {
    constructor(t, n) {
      (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
    }
    setOffset(t) {
      Array.isArray(t) ? (this.offset = () => t) : (this.offset = t);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(t) {
      this.window.scrollTo(t[0], t[1]);
    }
    scrollToAnchor(t) {
      let n = BI(this.document, t);
      n && (this.scrollToElement(n), n.focus());
    }
    setHistoryScrollRestoration(t) {
      this.window.history.scrollRestoration = t;
    }
    scrollToElement(t) {
      let n = t.getBoundingClientRect(),
        r = n.left + this.window.pageXOffset,
        i = n.top + this.window.pageYOffset,
        s = this.offset();
      this.window.scrollTo(r - s[0], i - s[1]);
    }
  };
function BI(e, t) {
  let n = e.getElementById(t) || e.getElementsByName(t)[0];
  if (n) return n;
  if (
    typeof e.createTreeWalker == "function" &&
    e.body &&
    typeof e.body.attachShadow == "function"
  ) {
    let r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT),
      i = r.currentNode;
    for (; i; ) {
      let s = i.shadowRoot;
      if (s) {
        let o = s.getElementById(t) || s.querySelector(`[name="${t}"]`);
        if (o) return o;
      }
      i = r.nextNode();
    }
  }
  return null;
}
var zs = class {
    setOffset(t) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(t) {}
    scrollToAnchor(t) {}
    setHistoryScrollRestoration(t) {}
  },
  Pi = class {};
var Uc = class e {
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
                      let i = n.slice(0, r),
                        s = i.toLowerCase(),
                        o = n.slice(r + 1).trim();
                      this.maybeSetNormalizedName(i, s),
                        this.headers.has(s)
                          ? this.headers.get(s).push(o)
                          : this.headers.set(s, [o]);
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
        let i = (t.op === "a" ? this.headers.get(n) : void 0) || [];
        i.push(...r), this.headers.set(n, i);
        break;
      case "d":
        let s = t.value;
        if (!s) this.headers.delete(n), this.normalizedNames.delete(n);
        else {
          let o = this.headers.get(n);
          if (!o) return;
          (o = o.filter((a) => s.indexOf(a) === -1)),
            o.length === 0
              ? (this.headers.delete(n), this.normalizedNames.delete(n))
              : this.headers.set(n, o);
        }
        break;
    }
  }
  setHeaderEntries(t, n) {
    let r = (Array.isArray(n) ? n : [n]).map((s) => s.toString()),
      i = t.toLowerCase();
    this.headers.set(i, r), this.maybeSetNormalizedName(t, i);
  }
  forEach(t) {
    this.init(),
      Array.from(this.normalizedNames.keys()).forEach((n) =>
        t(this.normalizedNames.get(n), this.headers.get(n)),
      );
  }
};
var hE = (function (e) {
    return (
      (e[(e.Sent = 0)] = "Sent"),
      (e[(e.UploadProgress = 1)] = "UploadProgress"),
      (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
      (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
      (e[(e.Response = 4)] = "Response"),
      (e[(e.User = 5)] = "User"),
      e
    );
  })(hE || {}),
  If = class {
    constructor(t, n = 200, r = "OK") {
      (this.headers = t.headers || new Uc()),
        (this.status = t.status !== void 0 ? t.status : n),
        (this.statusText = t.statusText || r),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  };
var Bc = class e extends If {
  constructor(t = {}) {
    super(t),
      (this.type = hE.Response),
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
var Nf = new ie("");
var HI = new ie(""),
  oE = "b",
  aE = "h",
  cE = "s",
  lE = "st",
  uE = "u",
  dE = "rt",
  jc = new ie(""),
  VI = ["GET", "HEAD"];
function $I(e, t) {
  let E = z(jc),
    { isCacheActive: n } = E,
    r = ea(E, ["isCacheActive"]),
    { transferCache: i, method: s } = e;
  if (
    !n ||
    i === !1 ||
    (s === "POST" && !r.includePostRequests && !i) ||
    (s !== "POST" && !VI.includes(s)) ||
    (!r.includeRequestsWithAuthHeaders && qI(e)) ||
    r.filter?.(e) === !1
  )
    return t(e);
  let o = z(Ln),
    a = z(HI, { optional: !0 }),
    c = Ks(z(Ot));
  if (a && !c) throw new G(2803, !1);
  let l = c && a ? KI(e.url, a) : e.url,
    u = GI(e, l),
    d = o.get(u, null),
    g = r.includeHeaders;
  if ((typeof i == "object" && i.includeHeaders && (g = i.includeHeaders), d)) {
    let { [oE]: S, [dE]: M, [aE]: H, [cE]: L, [lE]: D, [uE]: w } = d,
      I = S;
    switch (M) {
      case "arraybuffer":
        I = new TextEncoder().encode(S).buffer;
        break;
      case "blob":
        I = new Blob([S]);
        break;
    }
    let b = new Uc(H);
    return pe(
      new Bc({ body: I, headers: b, status: L, statusText: D, url: w }),
    );
  }
  return t(e).pipe(
    ot((S) => {
      S instanceof Bc &&
        c &&
        o.set(u, {
          [oE]: S.body,
          [aE]: zI(S.headers, g),
          [cE]: S.status,
          [lE]: S.statusText,
          [uE]: l,
          [dE]: e.responseType,
        });
    }),
  );
}
function qI(e) {
  return e.headers.has("authorization") || e.headers.has("proxy-authorization");
}
function zI(e, t) {
  if (!t) return {};
  let n = {};
  for (let r of t) {
    let i = e.getAll(r);
    i !== null && (n[r] = i);
  }
  return n;
}
function fE(e) {
  return [...e.keys()]
    .sort()
    .map((t) => `${t}=${e.getAll(t)}`)
    .join("&");
}
function GI(e, t) {
  let { params: n, method: r, responseType: i } = e,
    s = fE(n),
    o = e.serializeBody();
  o instanceof URLSearchParams ? (o = fE(o)) : typeof o != "string" && (o = "");
  let a = [r, i, t, o, s].join("|"),
    c = WI(a);
  return c;
}
function WI(e) {
  let t = 0;
  for (let n of e) t = (Math.imul(31, t) + n.charCodeAt(0)) << 0;
  return (t += 2147483648), t.toString();
}
function pE(e) {
  return [
    {
      provide: jc,
      useFactory: () => (
        pr("NgHttpTransferCache"), Y({ isCacheActive: !0 }, e)
      ),
    },
    { provide: Nf, useValue: $I, multi: !0, deps: [Ln, jc] },
    {
      provide: Oi,
      multi: !0,
      useFactory: () => {
        let t = z(Wt),
          n = z(jc);
        return () => {
          ki(t).then(() => {
            n.isCacheActive = !1;
          });
        };
      },
    },
  ];
}
function KI(e, t) {
  let n = new URL(e, "resolve://").origin,
    r = t[n];
  return r ? e.replace(n, r) : e;
}
var Rf = class extends Oc {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Ys = class e extends Rf {
    static makeCurrent() {
      Pc(new e());
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
      let n = QI();
      return n == null ? null : YI(n);
    }
    resetBaseElement() {
      Qs = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return Df(document.cookie, t);
    }
  },
  Qs = null;
function QI() {
  return (
    (Qs = Qs || document.querySelector("base")),
    Qs ? Qs.getAttribute("href") : null
  );
}
function YI(e) {
  return new URL(e, document.baseURI).pathname;
}
var ZI = (() => {
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
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Fi = new ie(""),
  yE = (() => {
    class e {
      constructor(n, r) {
        (this._zone = r),
          (this._eventNameToPlugin = new Map()),
          n.forEach((i) => {
            i.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, r, i) {
        return this._findPluginFor(r).addEventListener(n, r, i);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let r = this._eventNameToPlugin.get(n);
        if (r) return r;
        if (((r = this._plugins.find((s) => s.supports(n))), !r))
          throw new G(5101, !1);
        return this._eventNameToPlugin.set(n, r), r;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(Fi), le(He));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  zr = class {
    constructor(t) {
      this._doc = t;
    }
  },
  Mf = "ng-app-id",
  vE = (() => {
    class e {
      constructor(n, r, i, s = {}) {
        (this.doc = n),
          (this.appId = r),
          (this.nonce = i),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Ks(s)),
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
        r.get(n)?.elements?.forEach((i) => i.remove()), r.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${Mf}="${this.appId}"]`);
        if (n?.length) {
          let r = new Map();
          return (
            n.forEach((i) => {
              i.textContent != null && r.set(i.textContent, i);
            }),
            r
          );
        }
        return null;
      }
      changeUsageCount(n, r) {
        let i = this.styleRef;
        if (i.has(n)) {
          let s = i.get(n);
          return (s.usage += r), s.usage;
        }
        return i.set(n, { usage: r, elements: [] }), r;
      }
      getStyleElement(n, r) {
        let i = this.styleNodesInDOM,
          s = i?.get(r);
        if (s?.parentNode === n) return i.delete(r), s.removeAttribute(Mf), s;
        {
          let o = this.doc.createElement("style");
          return (
            this.nonce && o.setAttribute("nonce", this.nonce),
            (o.textContent = r),
            this.platformIsServer && o.setAttribute(Mf, this.appId),
            n.appendChild(o),
            o
          );
        }
      }
      addStyleToHost(n, r) {
        let i = this.getStyleElement(n, r),
          s = this.styleRef,
          o = s.get(r)?.elements;
        o ? o.push(i) : s.set(r, { elements: [i], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(qe), le(Vr), le(Us, 8), le(Ot));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Af = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  kf = /%COMP%/g,
  EE = "%COMP%",
  XI = `_nghost-${EE}`,
  JI = `_ngcontent-${EE}`,
  e1 = !0,
  t1 = new ie("", { providedIn: "root", factory: () => e1 });
function n1(e) {
  return JI.replace(kf, e);
}
function r1(e) {
  return XI.replace(kf, e);
}
function bE(e, t) {
  return t.map((n) => n.replace(kf, e));
}
var Hc = (() => {
    class e {
      constructor(n, r, i, s, o, a, c, l = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = r),
          (this.appId = i),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = o),
          (this.platformId = a),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Ks(a)),
          (this.defaultRenderer = new Zs(n, o, c, this.platformIsServer));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        this.platformIsServer &&
          r.encapsulation === rn.ShadowDom &&
          (r = Ge(Y({}, r), { encapsulation: rn.Emulated }));
        let i = this.getOrCreateRenderer(n, r);
        return (
          i instanceof Vc
            ? i.applyToHost(n)
            : i instanceof Xs && i.applyStyles(),
          i
        );
      }
      getOrCreateRenderer(n, r) {
        let i = this.rendererByCompId,
          s = i.get(r.id);
        if (!s) {
          let o = this.doc,
            a = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            u = this.removeStylesOnCompDestroy,
            d = this.platformIsServer;
          switch (r.encapsulation) {
            case rn.Emulated:
              s = new Vc(c, l, r, this.appId, u, o, a, d);
              break;
            case rn.ShadowDom:
              return new xf(c, l, n, r, o, a, this.nonce, d);
            default:
              s = new Xs(c, l, r, u, o, a, d);
              break;
          }
          i.set(r.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(
            le(yE),
            le(vE),
            le(Vr),
            le(t1),
            le(qe),
            le(Ot),
            le(He),
            le(Us),
          );
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Zs = class {
    constructor(t, n, r, i) {
      (this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(t, n) {
      return n
        ? this.doc.createElementNS(Af[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (mE(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (mE(t) ? t.content : t).insertBefore(n, r);
    }
    removeChild(t, n) {
      n.remove();
    }
    selectRootElement(t, n) {
      let r = typeof t == "string" ? this.doc.querySelector(t) : t;
      if (!r) throw new G(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, n, r, i) {
      if (i) {
        n = i + ":" + n;
        let s = Af[i];
        s ? t.setAttributeNS(s, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let i = Af[r];
        i ? t.removeAttributeNS(i, n) : t.removeAttribute(`${r}:${n}`);
      } else t.removeAttribute(n);
    }
    addClass(t, n) {
      t.classList.add(n);
    }
    removeClass(t, n) {
      t.classList.remove(n);
    }
    setStyle(t, n, r, i) {
      i & ($r.DashCase | $r.Important)
        ? t.style.setProperty(n, r, i & $r.Important ? "important" : "")
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & $r.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
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
        ((t = vn().getGlobalEventTarget(this.doc, t)), !t)
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
function mE(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var xf = class extends Zs {
    constructor(t, n, r, i, s, o, a, c) {
      super(t, s, o, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = bE(i.id, i.styles);
      for (let u of l) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
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
  Xs = class extends Zs {
    constructor(t, n, r, i, s, o, a, c) {
      super(t, s, o, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? bE(c, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Vc = class extends Xs {
    constructor(t, n, r, i, s, o, a, c) {
      let l = i + "-" + r.id;
      super(t, n, r, s, o, a, c, l),
        (this.contentAttr = n1(l)),
        (this.hostAttr = r1(l));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  i1 = (() => {
    class e extends zr {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, r, i) {
        return (
          n.addEventListener(r, i, !1), () => this.removeEventListener(n, r, i)
        );
      }
      removeEventListener(n, r, i) {
        return n.removeEventListener(r, i);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(qe));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  s1 = (() => {
    class e extends zr {
      constructor(n) {
        super(n), (this.delegate = z(Wv, { optional: !0 }));
      }
      supports(n) {
        return this.delegate ? this.delegate.supports(n) : !1;
      }
      addEventListener(n, r, i) {
        return this.delegate.addEventListener(n, r, i);
      }
      removeEventListener(n, r, i) {
        return this.delegate.removeEventListener(n, r, i);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(qe));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  gE = ["alt", "control", "meta", "shift"],
  o1 = {
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
  a1 = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  c1 = (() => {
    class e extends zr {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, r, i) {
        let s = e.parseEventName(r),
          o = e.eventCallback(s.fullKey, i, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => vn().onAndCancel(n, s.domEventName, o));
      }
      static parseEventName(n) {
        let r = n.toLowerCase().split("."),
          i = r.shift();
        if (r.length === 0 || !(i === "keydown" || i === "keyup")) return null;
        let s = e._normalizeKey(r.pop()),
          o = "",
          a = r.indexOf("code");
        if (
          (a > -1 && (r.splice(a, 1), (o = "code.")),
          gE.forEach((l) => {
            let u = r.indexOf(l);
            u > -1 && (r.splice(u, 1), (o += l + "."));
          }),
          (o += s),
          r.length != 0 || s.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = i), (c.fullKey = o), c;
      }
      static matchEventFullKeyCode(n, r) {
        let i = o1[n.key] || n.key,
          s = "";
        return (
          r.indexOf("code.") > -1 && ((i = n.code), (s = "code.")),
          i == null || !i
            ? !1
            : ((i = i.toLowerCase()),
              i === " " ? (i = "space") : i === "." && (i = "dot"),
              gE.forEach((o) => {
                if (o !== i) {
                  let a = a1[o];
                  a(n) && (s += o + ".");
                }
              }),
              (s += i),
              s === r)
        );
      }
      static eventCallback(n, r, i) {
        return (s) => {
          e.matchEventFullKeyCode(s, n) && i.runGuarded(() => r(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(qe));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })();
function HF(e, t) {
  return Gv(Y({ rootComponent: e }, l1(t)));
}
function l1(e) {
  return {
    appProviders: [...p1, ...(e?.providers ?? [])],
    platformProviders: h1,
  };
}
function u1() {
  Ys.makeCurrent();
}
function d1() {
  return new On();
}
function f1() {
  return vc(document), document;
}
var h1 = [
  { provide: Ot, useValue: Tf },
  { provide: js, useValue: u1, multi: !0 },
  { provide: qe, useFactory: f1, deps: [] },
];
var p1 = [
  { provide: dc, useValue: "root" },
  { provide: On, useFactory: d1, deps: [] },
  { provide: Fi, useClass: i1, multi: !0, deps: [qe, He, Ot] },
  { provide: Fi, useClass: c1, multi: !0, deps: [qe] },
  { provide: Fi, useClass: s1, multi: !0 },
  Hc,
  vE,
  yE,
  { provide: dr, useExisting: Hc },
  { provide: Pi, useClass: ZI, deps: [] },
  [],
];
var _E = (() => {
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
        return new (r || e)(le(qe));
      };
    }
    static {
      this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
var Of = (function (e) {
  return (
    (e[(e.NoHttpTransferCache = 0)] = "NoHttpTransferCache"),
    (e[(e.HttpTransferCacheOptions = 1)] = "HttpTransferCacheOptions"),
    (e[(e.I18nSupport = 2)] = "I18nSupport"),
    (e[(e.EventReplay = 3)] = "EventReplay"),
    e
  );
})(Of || {});
function VF(...e) {
  let t = [],
    n = new Set(),
    r = n.has(Of.HttpTransferCacheOptions);
  for (let { ɵproviders: i, ɵkind: s } of e) n.add(s), i.length && t.push(i);
  return kn([[], eE(), n.has(Of.NoHttpTransferCache) || r ? [] : pE({}), t]);
}
var _e = (function (e) {
    return (
      (e[(e.State = 0)] = "State"),
      (e[(e.Transition = 1)] = "Transition"),
      (e[(e.Sequence = 2)] = "Sequence"),
      (e[(e.Group = 3)] = "Group"),
      (e[(e.Animate = 4)] = "Animate"),
      (e[(e.Keyframes = 5)] = "Keyframes"),
      (e[(e.Style = 6)] = "Style"),
      (e[(e.Trigger = 7)] = "Trigger"),
      (e[(e.Reference = 8)] = "Reference"),
      (e[(e.AnimateChild = 9)] = "AnimateChild"),
      (e[(e.AnimateRef = 10)] = "AnimateRef"),
      (e[(e.Query = 11)] = "Query"),
      (e[(e.Stagger = 12)] = "Stagger"),
      e
    );
  })(_e || {}),
  En = "*";
function wE(e, t = null) {
  return { type: _e.Sequence, steps: e, options: t };
}
function Lf(e) {
  return { type: _e.Style, styles: e, offset: null };
}
var mr = class {
    constructor(t = 0, n = 0) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this._started = !1),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._position = 0),
        (this.parentPlayer = null),
        (this.totalTime = t + n);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((t) => t()),
        (this._onDoneFns = []));
    }
    onStart(t) {
      this._originalOnStartFns.push(t), this._onStartFns.push(t);
    }
    onDone(t) {
      this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
    }
    onDestroy(t) {
      this._onDestroyFns.push(t);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
        (this._started = !0);
    }
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      this._onStartFns.forEach((t) => t()), (this._onStartFns = []);
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this.hasStarted() || this._onStart(),
        this.finish(),
        this._onDestroyFns.forEach((t) => t()),
        (this._onDestroyFns = []));
    }
    reset() {
      (this._started = !1),
        (this._finished = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    setPosition(t) {
      this._position = this.totalTime ? t * this.totalTime : 1;
    }
    getPosition() {
      return this.totalTime ? this._position / this.totalTime : 1;
    }
    triggerCallback(t) {
      let n = t == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  Js = class {
    constructor(t) {
      (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._onDestroyFns = []),
        (this.parentPlayer = null),
        (this.totalTime = 0),
        (this.players = t);
      let n = 0,
        r = 0,
        i = 0,
        s = this.players.length;
      s == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((o) => {
            o.onDone(() => {
              ++n == s && this._onFinish();
            }),
              o.onDestroy(() => {
                ++r == s && this._onDestroy();
              }),
              o.onStart(() => {
                ++i == s && this._onStart();
              });
          }),
        (this.totalTime = this.players.reduce(
          (o, a) => Math.max(o, a.totalTime),
          0,
        ));
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((t) => t()),
        (this._onDoneFns = []));
    }
    init() {
      this.players.forEach((t) => t.init());
    }
    onStart(t) {
      this._onStartFns.push(t);
    }
    _onStart() {
      this.hasStarted() ||
        ((this._started = !0),
        this._onStartFns.forEach((t) => t()),
        (this._onStartFns = []));
    }
    onDone(t) {
      this._onDoneFns.push(t);
    }
    onDestroy(t) {
      this._onDestroyFns.push(t);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      this.parentPlayer || this.init(),
        this._onStart(),
        this.players.forEach((t) => t.play());
    }
    pause() {
      this.players.forEach((t) => t.pause());
    }
    restart() {
      this.players.forEach((t) => t.restart());
    }
    finish() {
      this._onFinish(), this.players.forEach((t) => t.finish());
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._onFinish(),
        this.players.forEach((t) => t.destroy()),
        this._onDestroyFns.forEach((t) => t()),
        (this._onDestroyFns = []));
    }
    reset() {
      this.players.forEach((t) => t.reset()),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1);
    }
    setPosition(t) {
      let n = t * this.totalTime;
      this.players.forEach((r) => {
        let i = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
        r.setPosition(i);
      });
    }
    getPosition() {
      let t = this.players.reduce(
        (n, r) => (n === null || r.totalTime > n.totalTime ? r : n),
        null,
      );
      return t != null ? t.getPosition() : 0;
    }
    beforeDestroy() {
      this.players.forEach((t) => {
        t.beforeDestroy && t.beforeDestroy();
      });
    }
    triggerCallback(t) {
      let n = t == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  $c = "!";
function DE(e) {
  return new G(3e3, !1);
}
function g1() {
  return new G(3100, !1);
}
function y1() {
  return new G(3101, !1);
}
function v1(e) {
  return new G(3001, !1);
}
function E1(e) {
  return new G(3003, !1);
}
function b1(e) {
  return new G(3004, !1);
}
function _1(e, t) {
  return new G(3005, !1);
}
function w1() {
  return new G(3006, !1);
}
function D1() {
  return new G(3007, !1);
}
function T1(e, t) {
  return new G(3008, !1);
}
function S1(e) {
  return new G(3002, !1);
}
function C1(e, t, n, r, i) {
  return new G(3010, !1);
}
function I1() {
  return new G(3011, !1);
}
function N1() {
  return new G(3012, !1);
}
function M1() {
  return new G(3200, !1);
}
function A1() {
  return new G(3202, !1);
}
function R1() {
  return new G(3013, !1);
}
function x1(e) {
  return new G(3014, !1);
}
function O1(e) {
  return new G(3015, !1);
}
function k1(e) {
  return new G(3016, !1);
}
function L1(e, t) {
  return new G(3404, !1);
}
function P1(e) {
  return new G(3502, !1);
}
function F1(e) {
  return new G(3503, !1);
}
function j1() {
  return new G(3300, !1);
}
function U1(e) {
  return new G(3504, !1);
}
function B1(e) {
  return new G(3301, !1);
}
function H1(e, t) {
  return new G(3302, !1);
}
function V1(e) {
  return new G(3303, !1);
}
function $1(e, t) {
  return new G(3400, !1);
}
function q1(e) {
  return new G(3401, !1);
}
function z1(e) {
  return new G(3402, !1);
}
function G1(e, t) {
  return new G(3505, !1);
}
function gr(e) {
  switch (e.length) {
    case 0:
      return new mr();
    case 1:
      return e[0];
    default:
      return new Js(e);
  }
}
function FE(e, t, n = new Map(), r = new Map()) {
  let i = [],
    s = [],
    o = -1,
    a = null;
  if (
    (t.forEach((c) => {
      let l = c.get("offset"),
        u = l == o,
        d = (u && a) || new Map();
      c.forEach((g, E) => {
        let S = E,
          M = g;
        if (E !== "offset")
          switch (((S = e.normalizePropertyName(S, i)), M)) {
            case $c:
              M = n.get(E);
              break;
            case En:
              M = r.get(E);
              break;
            default:
              M = e.normalizeStyleValue(E, S, M, i);
              break;
          }
        d.set(S, M);
      }),
        u || s.push(d),
        (a = d),
        (o = l);
    }),
    i.length)
  )
    throw P1(i);
  return s;
}
function ih(e, t, n, r) {
  switch (t) {
    case "start":
      e.onStart(() => r(n && Pf(n, "start", e)));
      break;
    case "done":
      e.onDone(() => r(n && Pf(n, "done", e)));
      break;
    case "destroy":
      e.onDestroy(() => r(n && Pf(n, "destroy", e)));
      break;
  }
}
function Pf(e, t, n) {
  let r = n.totalTime,
    i = !!n.disabled,
    s = sh(
      e.element,
      e.triggerName,
      e.fromState,
      e.toState,
      t || e.phaseName,
      r ?? e.totalTime,
      i,
    ),
    o = e._data;
  return o != null && (s._data = o), s;
}
function sh(e, t, n, r, i = "", s = 0, o) {
  return {
    element: e,
    triggerName: t,
    fromState: n,
    toState: r,
    phaseName: i,
    totalTime: s,
    disabled: !!o,
  };
}
function Lt(e, t, n) {
  let r = e.get(t);
  return r || e.set(t, (r = n)), r;
}
function TE(e) {
  let t = e.indexOf(":"),
    n = e.substring(1, t),
    r = e.slice(t + 1);
  return [n, r];
}
var W1 = typeof document > "u" ? null : document.documentElement;
function oh(e) {
  let t = e.parentNode || e.host || null;
  return t === W1 ? null : t;
}
function K1(e) {
  return e.substring(1, 6) == "ebkit";
}
var Gr = null,
  SE = !1;
function Q1(e) {
  Gr ||
    ((Gr = Y1() || {}), (SE = Gr.style ? "WebkitAppearance" in Gr.style : !1));
  let t = !0;
  return (
    Gr.style &&
      !K1(e) &&
      ((t = e in Gr.style),
      !t &&
        SE &&
        (t = "Webkit" + e.charAt(0).toUpperCase() + e.slice(1) in Gr.style)),
    t
  );
}
function Y1() {
  return typeof document < "u" ? document.body : null;
}
function jE(e, t) {
  for (; t; ) {
    if (t === e) return !0;
    t = oh(t);
  }
  return !1;
}
function UE(e, t, n) {
  if (n) return Array.from(e.querySelectorAll(t));
  let r = e.querySelector(t);
  return r ? [r] : [];
}
var ah = (() => {
    class e {
      validateStyleProperty(n) {
        return Q1(n);
      }
      containsElement(n, r) {
        return jE(n, r);
      }
      getParentElement(n) {
        return oh(n);
      }
      query(n, r, i) {
        return UE(n, r, i);
      }
      computeStyle(n, r, i) {
        return i || "";
      }
      animate(n, r, i, s, o, a = [], c) {
        return new mr(i, s);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Qr = class {
    static {
      this.NOOP = new ah();
    }
  },
  Yr = class {};
var Z1 = 1e3,
  BE = "{{",
  X1 = "}}",
  HE = "ng-enter",
  Vf = "ng-leave",
  qc = "ng-trigger",
  Qc = ".ng-trigger",
  CE = "ng-animating",
  $f = ".ng-animating";
function Pn(e) {
  if (typeof e == "number") return e;
  let t = e.match(/^(-?[\.\d]+)(m?s)/);
  return !t || t.length < 2 ? 0 : qf(parseFloat(t[1]), t[2]);
}
function qf(e, t) {
  switch (t) {
    case "s":
      return e * Z1;
    default:
      return e;
  }
}
function Yc(e, t, n) {
  return e.hasOwnProperty("duration") ? e : J1(e, t, n);
}
function J1(e, t, n) {
  let r =
      /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
    i,
    s = 0,
    o = "";
  if (typeof e == "string") {
    let a = e.match(r);
    if (a === null) return t.push(DE(e)), { duration: 0, delay: 0, easing: "" };
    i = qf(parseFloat(a[1]), a[2]);
    let c = a[3];
    c != null && (s = qf(parseFloat(c), a[4]));
    let l = a[5];
    l && (o = l);
  } else i = e;
  if (!n) {
    let a = !1,
      c = t.length;
    i < 0 && (t.push(g1()), (a = !0)),
      s < 0 && (t.push(y1()), (a = !0)),
      a && t.splice(c, 0, DE(e));
  }
  return { duration: i, delay: s, easing: o };
}
function eN(e) {
  return e.length
    ? e[0] instanceof Map
      ? e
      : e.map((t) => new Map(Object.entries(t)))
    : [];
}
function bn(e, t, n) {
  t.forEach((r, i) => {
    let s = ch(i);
    n && !n.has(i) && n.set(i, e.style[s]), (e.style[s] = r);
  });
}
function Kr(e, t) {
  t.forEach((n, r) => {
    let i = ch(r);
    e.style[i] = "";
  });
}
function eo(e) {
  return Array.isArray(e) ? (e.length == 1 ? e[0] : wE(e)) : e;
}
function tN(e, t, n) {
  let r = t.params || {},
    i = VE(e);
  i.length &&
    i.forEach((s) => {
      r.hasOwnProperty(s) || n.push(v1(s));
    });
}
var zf = new RegExp(`${BE}\\s*(.+?)\\s*${X1}`, "g");
function VE(e) {
  let t = [];
  if (typeof e == "string") {
    let n;
    for (; (n = zf.exec(e)); ) t.push(n[1]);
    zf.lastIndex = 0;
  }
  return t;
}
function no(e, t, n) {
  let r = `${e}`,
    i = r.replace(zf, (s, o) => {
      let a = t[o];
      return a == null && (n.push(E1(o)), (a = "")), a.toString();
    });
  return i == r ? e : i;
}
var nN = /-+([a-z0-9])/g;
function ch(e) {
  return e.replace(nN, (...t) => t[1].toUpperCase());
}
function rN(e, t) {
  return e === 0 || t === 0;
}
function iN(e, t, n) {
  if (n.size && t.length) {
    let r = t[0],
      i = [];
    if (
      (n.forEach((s, o) => {
        r.has(o) || i.push(o), r.set(o, s);
      }),
      i.length)
    )
      for (let s = 1; s < t.length; s++) {
        let o = t[s];
        i.forEach((a) => o.set(a, lh(e, a)));
      }
  }
  return t;
}
function kt(e, t, n) {
  switch (t.type) {
    case _e.Trigger:
      return e.visitTrigger(t, n);
    case _e.State:
      return e.visitState(t, n);
    case _e.Transition:
      return e.visitTransition(t, n);
    case _e.Sequence:
      return e.visitSequence(t, n);
    case _e.Group:
      return e.visitGroup(t, n);
    case _e.Animate:
      return e.visitAnimate(t, n);
    case _e.Keyframes:
      return e.visitKeyframes(t, n);
    case _e.Style:
      return e.visitStyle(t, n);
    case _e.Reference:
      return e.visitReference(t, n);
    case _e.AnimateChild:
      return e.visitAnimateChild(t, n);
    case _e.AnimateRef:
      return e.visitAnimateRef(t, n);
    case _e.Query:
      return e.visitQuery(t, n);
    case _e.Stagger:
      return e.visitStagger(t, n);
    default:
      throw b1(t.type);
  }
}
function lh(e, t) {
  return window.getComputedStyle(e)[t];
}
var sN = new Set([
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "left",
    "top",
    "bottom",
    "right",
    "fontSize",
    "outlineWidth",
    "outlineOffset",
    "paddingTop",
    "paddingLeft",
    "paddingBottom",
    "paddingRight",
    "marginTop",
    "marginLeft",
    "marginBottom",
    "marginRight",
    "borderRadius",
    "borderWidth",
    "borderTopWidth",
    "borderLeftWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "textIndent",
    "perspective",
  ]),
  Zc = class extends Yr {
    normalizePropertyName(t, n) {
      return ch(t);
    }
    normalizeStyleValue(t, n, r, i) {
      let s = "",
        o = r.toString().trim();
      if (sN.has(n) && r !== 0 && r !== "0")
        if (typeof r == "number") s = "px";
        else {
          let a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
          a && a[1].length == 0 && i.push(_1(t, r));
        }
      return o + s;
    }
  };
var Xc = "*";
function oN(e, t) {
  let n = [];
  return (
    typeof e == "string"
      ? e.split(/\s*,\s*/).forEach((r) => aN(r, n, t))
      : n.push(e),
    n
  );
}
function aN(e, t, n) {
  if (e[0] == ":") {
    let c = cN(e, n);
    if (typeof c == "function") {
      t.push(c);
      return;
    }
    e = c;
  }
  let r = e.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
  if (r == null || r.length < 4) return n.push(O1(e)), t;
  let i = r[1],
    s = r[2],
    o = r[3];
  t.push(IE(i, o));
  let a = i == Xc && o == Xc;
  s[0] == "<" && !a && t.push(IE(o, i));
}
function cN(e, t) {
  switch (e) {
    case ":enter":
      return "void => *";
    case ":leave":
      return "* => void";
    case ":increment":
      return (n, r) => parseFloat(r) > parseFloat(n);
    case ":decrement":
      return (n, r) => parseFloat(r) < parseFloat(n);
    default:
      return t.push(k1(e)), "* => *";
  }
}
var zc = new Set(["true", "1"]),
  Gc = new Set(["false", "0"]);
function IE(e, t) {
  let n = zc.has(e) || Gc.has(e),
    r = zc.has(t) || Gc.has(t);
  return (i, s) => {
    let o = e == Xc || e == i,
      a = t == Xc || t == s;
    return (
      !o && n && typeof i == "boolean" && (o = i ? zc.has(e) : Gc.has(e)),
      !a && r && typeof s == "boolean" && (a = s ? zc.has(t) : Gc.has(t)),
      o && a
    );
  };
}
var $E = ":self",
  lN = new RegExp(`s*${$E}s*,?`, "g");
function qE(e, t, n, r) {
  return new Gf(e).build(t, n, r);
}
var NE = "",
  Gf = class {
    constructor(t) {
      this._driver = t;
    }
    build(t, n, r) {
      let i = new Wf(n);
      return this._resetContextStyleTimingState(i), kt(this, eo(t), i);
    }
    _resetContextStyleTimingState(t) {
      (t.currentQuerySelector = NE),
        (t.collectedStyles = new Map()),
        t.collectedStyles.set(NE, new Map()),
        (t.currentTime = 0);
    }
    visitTrigger(t, n) {
      let r = (n.queryCount = 0),
        i = (n.depCount = 0),
        s = [],
        o = [];
      return (
        t.name.charAt(0) == "@" && n.errors.push(w1()),
        t.definitions.forEach((a) => {
          if ((this._resetContextStyleTimingState(n), a.type == _e.State)) {
            let c = a,
              l = c.name;
            l
              .toString()
              .split(/\s*,\s*/)
              .forEach((u) => {
                (c.name = u), s.push(this.visitState(c, n));
              }),
              (c.name = l);
          } else if (a.type == _e.Transition) {
            let c = this.visitTransition(a, n);
            (r += c.queryCount), (i += c.depCount), o.push(c);
          } else n.errors.push(D1());
        }),
        {
          type: _e.Trigger,
          name: t.name,
          states: s,
          transitions: o,
          queryCount: r,
          depCount: i,
          options: null,
        }
      );
    }
    visitState(t, n) {
      let r = this.visitStyle(t.styles, n),
        i = (t.options && t.options.params) || null;
      if (r.containsDynamicStyles) {
        let s = new Set(),
          o = i || {};
        r.styles.forEach((a) => {
          a instanceof Map &&
            a.forEach((c) => {
              VE(c).forEach((l) => {
                o.hasOwnProperty(l) || s.add(l);
              });
            });
        }),
          s.size && n.errors.push(T1(t.name, [...s.values()]));
      }
      return {
        type: _e.State,
        name: t.name,
        style: r,
        options: i ? { params: i } : null,
      };
    }
    visitTransition(t, n) {
      (n.queryCount = 0), (n.depCount = 0);
      let r = kt(this, eo(t.animation), n),
        i = oN(t.expr, n.errors);
      return {
        type: _e.Transition,
        matchers: i,
        animation: r,
        queryCount: n.queryCount,
        depCount: n.depCount,
        options: Wr(t.options),
      };
    }
    visitSequence(t, n) {
      return {
        type: _e.Sequence,
        steps: t.steps.map((r) => kt(this, r, n)),
        options: Wr(t.options),
      };
    }
    visitGroup(t, n) {
      let r = n.currentTime,
        i = 0,
        s = t.steps.map((o) => {
          n.currentTime = r;
          let a = kt(this, o, n);
          return (i = Math.max(i, n.currentTime)), a;
        });
      return (
        (n.currentTime = i),
        { type: _e.Group, steps: s, options: Wr(t.options) }
      );
    }
    visitAnimate(t, n) {
      let r = hN(t.timings, n.errors);
      n.currentAnimateTimings = r;
      let i,
        s = t.styles ? t.styles : Lf({});
      if (s.type == _e.Keyframes) i = this.visitKeyframes(s, n);
      else {
        let o = t.styles,
          a = !1;
        if (!o) {
          a = !0;
          let l = {};
          r.easing && (l.easing = r.easing), (o = Lf(l));
        }
        n.currentTime += r.duration + r.delay;
        let c = this.visitStyle(o, n);
        (c.isEmptyStep = a), (i = c);
      }
      return (
        (n.currentAnimateTimings = null),
        { type: _e.Animate, timings: r, style: i, options: null }
      );
    }
    visitStyle(t, n) {
      let r = this._makeStyleAst(t, n);
      return this._validateStyleAst(r, n), r;
    }
    _makeStyleAst(t, n) {
      let r = [],
        i = Array.isArray(t.styles) ? t.styles : [t.styles];
      for (let a of i)
        typeof a == "string"
          ? a === En
            ? r.push(a)
            : n.errors.push(S1(a))
          : r.push(new Map(Object.entries(a)));
      let s = !1,
        o = null;
      return (
        r.forEach((a) => {
          if (
            a instanceof Map &&
            (a.has("easing") && ((o = a.get("easing")), a.delete("easing")), !s)
          ) {
            for (let c of a.values())
              if (c.toString().indexOf(BE) >= 0) {
                s = !0;
                break;
              }
          }
        }),
        {
          type: _e.Style,
          styles: r,
          easing: o,
          offset: t.offset,
          containsDynamicStyles: s,
          options: null,
        }
      );
    }
    _validateStyleAst(t, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTime,
        s = n.currentTime;
      r && s > 0 && (s -= r.duration + r.delay),
        t.styles.forEach((o) => {
          typeof o != "string" &&
            o.forEach((a, c) => {
              let l = n.collectedStyles.get(n.currentQuerySelector),
                u = l.get(c),
                d = !0;
              u &&
                (s != i &&
                  s >= u.startTime &&
                  i <= u.endTime &&
                  (n.errors.push(C1(c, u.startTime, u.endTime, s, i)),
                  (d = !1)),
                (s = u.startTime)),
                d && l.set(c, { startTime: s, endTime: i }),
                n.options && tN(a, n.options, n.errors);
            });
        });
    }
    visitKeyframes(t, n) {
      let r = { type: _e.Keyframes, styles: [], options: null };
      if (!n.currentAnimateTimings) return n.errors.push(I1()), r;
      let i = 1,
        s = 0,
        o = [],
        a = !1,
        c = !1,
        l = 0,
        u = t.steps.map((L) => {
          let D = this._makeStyleAst(L, n),
            w = D.offset != null ? D.offset : fN(D.styles),
            I = 0;
          return (
            w != null && (s++, (I = D.offset = w)),
            (c = c || I < 0 || I > 1),
            (a = a || I < l),
            (l = I),
            o.push(I),
            D
          );
        });
      c && n.errors.push(N1()), a && n.errors.push(M1());
      let d = t.steps.length,
        g = 0;
      s > 0 && s < d ? n.errors.push(A1()) : s == 0 && (g = i / (d - 1));
      let E = d - 1,
        S = n.currentTime,
        M = n.currentAnimateTimings,
        H = M.duration;
      return (
        u.forEach((L, D) => {
          let w = g > 0 ? (D == E ? 1 : g * D) : o[D],
            I = w * H;
          (n.currentTime = S + M.delay + I),
            (M.duration = I),
            this._validateStyleAst(L, n),
            (L.offset = w),
            r.styles.push(L);
        }),
        r
      );
    }
    visitReference(t, n) {
      return {
        type: _e.Reference,
        animation: kt(this, eo(t.animation), n),
        options: Wr(t.options),
      };
    }
    visitAnimateChild(t, n) {
      return n.depCount++, { type: _e.AnimateChild, options: Wr(t.options) };
    }
    visitAnimateRef(t, n) {
      return {
        type: _e.AnimateRef,
        animation: this.visitReference(t.animation, n),
        options: Wr(t.options),
      };
    }
    visitQuery(t, n) {
      let r = n.currentQuerySelector,
        i = t.options || {};
      n.queryCount++, (n.currentQuery = t);
      let [s, o] = uN(t.selector);
      (n.currentQuerySelector = r.length ? r + " " + s : s),
        Lt(n.collectedStyles, n.currentQuerySelector, new Map());
      let a = kt(this, eo(t.animation), n);
      return (
        (n.currentQuery = null),
        (n.currentQuerySelector = r),
        {
          type: _e.Query,
          selector: s,
          limit: i.limit || 0,
          optional: !!i.optional,
          includeSelf: o,
          animation: a,
          originalSelector: t.selector,
          options: Wr(t.options),
        }
      );
    }
    visitStagger(t, n) {
      n.currentQuery || n.errors.push(R1());
      let r =
        t.timings === "full"
          ? { duration: 0, delay: 0, easing: "full" }
          : Yc(t.timings, n.errors, !0);
      return {
        type: _e.Stagger,
        animation: kt(this, eo(t.animation), n),
        timings: r,
        options: null,
      };
    }
  };
function uN(e) {
  let t = !!e.split(/\s*,\s*/).find((n) => n == $E);
  return (
    t && (e = e.replace(lN, "")),
    (e = e
      .replace(/@\*/g, Qc)
      .replace(/@\w+/g, (n) => Qc + "-" + n.slice(1))
      .replace(/:animating/g, $f)),
    [e, t]
  );
}
function dN(e) {
  return e ? Y({}, e) : null;
}
var Wf = class {
  constructor(t) {
    (this.errors = t),
      (this.queryCount = 0),
      (this.depCount = 0),
      (this.currentTransition = null),
      (this.currentQuery = null),
      (this.currentQuerySelector = null),
      (this.currentAnimateTimings = null),
      (this.currentTime = 0),
      (this.collectedStyles = new Map()),
      (this.options = null),
      (this.unsupportedCSSPropertiesFound = new Set());
  }
};
function fN(e) {
  if (typeof e == "string") return null;
  let t = null;
  if (Array.isArray(e))
    e.forEach((n) => {
      if (n instanceof Map && n.has("offset")) {
        let r = n;
        (t = parseFloat(r.get("offset"))), r.delete("offset");
      }
    });
  else if (e instanceof Map && e.has("offset")) {
    let n = e;
    (t = parseFloat(n.get("offset"))), n.delete("offset");
  }
  return t;
}
function hN(e, t) {
  if (e.hasOwnProperty("duration")) return e;
  if (typeof e == "number") {
    let s = Yc(e, t).duration;
    return Ff(s, 0, "");
  }
  let n = e;
  if (n.split(/\s+/).some((s) => s.charAt(0) == "{" && s.charAt(1) == "{")) {
    let s = Ff(0, 0, "");
    return (s.dynamic = !0), (s.strValue = n), s;
  }
  let i = Yc(n, t);
  return Ff(i.duration, i.delay, i.easing);
}
function Wr(e) {
  return (
    e ? ((e = Y({}, e)), e.params && (e.params = dN(e.params))) : (e = {}), e
  );
}
function Ff(e, t, n) {
  return { duration: e, delay: t, easing: n };
}
function uh(e, t, n, r, i, s, o = null, a = !1) {
  return {
    type: 1,
    element: e,
    keyframes: t,
    preStyleProps: n,
    postStyleProps: r,
    duration: i,
    delay: s,
    totalTime: i + s,
    easing: o,
    subTimeline: a,
  };
}
var ro = class {
    constructor() {
      this._map = new Map();
    }
    get(t) {
      return this._map.get(t) || [];
    }
    append(t, n) {
      let r = this._map.get(t);
      r || this._map.set(t, (r = [])), r.push(...n);
    }
    has(t) {
      return this._map.has(t);
    }
    clear() {
      this._map.clear();
    }
  },
  pN = 1,
  mN = ":enter",
  gN = new RegExp(mN, "g"),
  yN = ":leave",
  vN = new RegExp(yN, "g");
function zE(e, t, n, r, i, s = new Map(), o = new Map(), a, c, l = []) {
  return new Kf().buildKeyframes(e, t, n, r, i, s, o, a, c, l);
}
var Kf = class {
    buildKeyframes(t, n, r, i, s, o, a, c, l, u = []) {
      l = l || new ro();
      let d = new Qf(t, n, l, i, s, u, []);
      d.options = c;
      let g = c.delay ? Pn(c.delay) : 0;
      d.currentTimeline.delayNextStep(g),
        d.currentTimeline.setStyles([o], null, d.errors, c),
        kt(this, r, d);
      let E = d.timelines.filter((S) => S.containsAnimation());
      if (E.length && a.size) {
        let S;
        for (let M = E.length - 1; M >= 0; M--) {
          let H = E[M];
          if (H.element === n) {
            S = H;
            break;
          }
        }
        S &&
          !S.allowOnlyTimelineStyles() &&
          S.setStyles([a], null, d.errors, c);
      }
      return E.length
        ? E.map((S) => S.buildKeyframes())
        : [uh(n, [], [], [], 0, g, "", !1)];
    }
    visitTrigger(t, n) {}
    visitState(t, n) {}
    visitTransition(t, n) {}
    visitAnimateChild(t, n) {
      let r = n.subInstructions.get(n.element);
      if (r) {
        let i = n.createSubContext(t.options),
          s = n.currentTimeline.currentTime,
          o = this._visitSubInstructions(r, i, i.options);
        s != o && n.transformIntoNewTimeline(o);
      }
      n.previousNode = t;
    }
    visitAnimateRef(t, n) {
      let r = n.createSubContext(t.options);
      r.transformIntoNewTimeline(),
        this._applyAnimationRefDelays([t.options, t.animation.options], n, r),
        this.visitReference(t.animation, r),
        n.transformIntoNewTimeline(r.currentTimeline.currentTime),
        (n.previousNode = t);
    }
    _applyAnimationRefDelays(t, n, r) {
      for (let i of t) {
        let s = i?.delay;
        if (s) {
          let o =
            typeof s == "number" ? s : Pn(no(s, i?.params ?? {}, n.errors));
          r.delayNextStep(o);
        }
      }
    }
    _visitSubInstructions(t, n, r) {
      let s = n.currentTimeline.currentTime,
        o = r.duration != null ? Pn(r.duration) : null,
        a = r.delay != null ? Pn(r.delay) : null;
      return (
        o !== 0 &&
          t.forEach((c) => {
            let l = n.appendInstructionToTimeline(c, o, a);
            s = Math.max(s, l.duration + l.delay);
          }),
        s
      );
    }
    visitReference(t, n) {
      n.updateOptions(t.options, !0),
        kt(this, t.animation, n),
        (n.previousNode = t);
    }
    visitSequence(t, n) {
      let r = n.subContextCount,
        i = n,
        s = t.options;
      if (
        s &&
        (s.params || s.delay) &&
        ((i = n.createSubContext(s)),
        i.transformIntoNewTimeline(),
        s.delay != null)
      ) {
        i.previousNode.type == _e.Style &&
          (i.currentTimeline.snapshotCurrentStyles(), (i.previousNode = Jc));
        let o = Pn(s.delay);
        i.delayNextStep(o);
      }
      t.steps.length &&
        (t.steps.forEach((o) => kt(this, o, i)),
        i.currentTimeline.applyStylesToKeyframe(),
        i.subContextCount > r && i.transformIntoNewTimeline()),
        (n.previousNode = t);
    }
    visitGroup(t, n) {
      let r = [],
        i = n.currentTimeline.currentTime,
        s = t.options && t.options.delay ? Pn(t.options.delay) : 0;
      t.steps.forEach((o) => {
        let a = n.createSubContext(t.options);
        s && a.delayNextStep(s),
          kt(this, o, a),
          (i = Math.max(i, a.currentTimeline.currentTime)),
          r.push(a.currentTimeline);
      }),
        r.forEach((o) => n.currentTimeline.mergeTimelineCollectedStyles(o)),
        n.transformIntoNewTimeline(i),
        (n.previousNode = t);
    }
    _visitTiming(t, n) {
      if (t.dynamic) {
        let r = t.strValue,
          i = n.params ? no(r, n.params, n.errors) : r;
        return Yc(i, n.errors);
      } else return { duration: t.duration, delay: t.delay, easing: t.easing };
    }
    visitAnimate(t, n) {
      let r = (n.currentAnimateTimings = this._visitTiming(t.timings, n)),
        i = n.currentTimeline;
      r.delay && (n.incrementTime(r.delay), i.snapshotCurrentStyles());
      let s = t.style;
      s.type == _e.Keyframes
        ? this.visitKeyframes(s, n)
        : (n.incrementTime(r.duration),
          this.visitStyle(s, n),
          i.applyStylesToKeyframe()),
        (n.currentAnimateTimings = null),
        (n.previousNode = t);
    }
    visitStyle(t, n) {
      let r = n.currentTimeline,
        i = n.currentAnimateTimings;
      !i && r.hasCurrentStyleProperties() && r.forwardFrame();
      let s = (i && i.easing) || t.easing;
      t.isEmptyStep
        ? r.applyEmptyStep(s)
        : r.setStyles(t.styles, s, n.errors, n.options),
        (n.previousNode = t);
    }
    visitKeyframes(t, n) {
      let r = n.currentAnimateTimings,
        i = n.currentTimeline.duration,
        s = r.duration,
        a = n.createSubContext().currentTimeline;
      (a.easing = r.easing),
        t.styles.forEach((c) => {
          let l = c.offset || 0;
          a.forwardTime(l * s),
            a.setStyles(c.styles, c.easing, n.errors, n.options),
            a.applyStylesToKeyframe();
        }),
        n.currentTimeline.mergeTimelineCollectedStyles(a),
        n.transformIntoNewTimeline(i + s),
        (n.previousNode = t);
    }
    visitQuery(t, n) {
      let r = n.currentTimeline.currentTime,
        i = t.options || {},
        s = i.delay ? Pn(i.delay) : 0;
      s &&
        (n.previousNode.type === _e.Style ||
          (r == 0 && n.currentTimeline.hasCurrentStyleProperties())) &&
        (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = Jc));
      let o = r,
        a = n.invokeQuery(
          t.selector,
          t.originalSelector,
          t.limit,
          t.includeSelf,
          !!i.optional,
          n.errors,
        );
      n.currentQueryTotal = a.length;
      let c = null;
      a.forEach((l, u) => {
        n.currentQueryIndex = u;
        let d = n.createSubContext(t.options, l);
        s && d.delayNextStep(s),
          l === n.element && (c = d.currentTimeline),
          kt(this, t.animation, d),
          d.currentTimeline.applyStylesToKeyframe();
        let g = d.currentTimeline.currentTime;
        o = Math.max(o, g);
      }),
        (n.currentQueryIndex = 0),
        (n.currentQueryTotal = 0),
        n.transformIntoNewTimeline(o),
        c &&
          (n.currentTimeline.mergeTimelineCollectedStyles(c),
          n.currentTimeline.snapshotCurrentStyles()),
        (n.previousNode = t);
    }
    visitStagger(t, n) {
      let r = n.parentContext,
        i = n.currentTimeline,
        s = t.timings,
        o = Math.abs(s.duration),
        a = o * (n.currentQueryTotal - 1),
        c = o * n.currentQueryIndex;
      switch (s.duration < 0 ? "reverse" : s.easing) {
        case "reverse":
          c = a - c;
          break;
        case "full":
          c = r.currentStaggerTime;
          break;
      }
      let u = n.currentTimeline;
      c && u.delayNextStep(c);
      let d = u.currentTime;
      kt(this, t.animation, n),
        (n.previousNode = t),
        (r.currentStaggerTime =
          i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
    }
  },
  Jc = {},
  Qf = class e {
    constructor(t, n, r, i, s, o, a, c) {
      (this._driver = t),
        (this.element = n),
        (this.subInstructions = r),
        (this._enterClassName = i),
        (this._leaveClassName = s),
        (this.errors = o),
        (this.timelines = a),
        (this.parentContext = null),
        (this.currentAnimateTimings = null),
        (this.previousNode = Jc),
        (this.subContextCount = 0),
        (this.options = {}),
        (this.currentQueryIndex = 0),
        (this.currentQueryTotal = 0),
        (this.currentStaggerTime = 0),
        (this.currentTimeline = c || new el(this._driver, n, 0)),
        a.push(this.currentTimeline);
    }
    get params() {
      return this.options.params;
    }
    updateOptions(t, n) {
      if (!t) return;
      let r = t,
        i = this.options;
      r.duration != null && (i.duration = Pn(r.duration)),
        r.delay != null && (i.delay = Pn(r.delay));
      let s = r.params;
      if (s) {
        let o = i.params;
        o || (o = this.options.params = {}),
          Object.keys(s).forEach((a) => {
            (!n || !o.hasOwnProperty(a)) && (o[a] = no(s[a], o, this.errors));
          });
      }
    }
    _copyOptions() {
      let t = {};
      if (this.options) {
        let n = this.options.params;
        if (n) {
          let r = (t.params = {});
          Object.keys(n).forEach((i) => {
            r[i] = n[i];
          });
        }
      }
      return t;
    }
    createSubContext(t = null, n, r) {
      let i = n || this.element,
        s = new e(
          this._driver,
          i,
          this.subInstructions,
          this._enterClassName,
          this._leaveClassName,
          this.errors,
          this.timelines,
          this.currentTimeline.fork(i, r || 0),
        );
      return (
        (s.previousNode = this.previousNode),
        (s.currentAnimateTimings = this.currentAnimateTimings),
        (s.options = this._copyOptions()),
        s.updateOptions(t),
        (s.currentQueryIndex = this.currentQueryIndex),
        (s.currentQueryTotal = this.currentQueryTotal),
        (s.parentContext = this),
        this.subContextCount++,
        s
      );
    }
    transformIntoNewTimeline(t) {
      return (
        (this.previousNode = Jc),
        (this.currentTimeline = this.currentTimeline.fork(this.element, t)),
        this.timelines.push(this.currentTimeline),
        this.currentTimeline
      );
    }
    appendInstructionToTimeline(t, n, r) {
      let i = {
          duration: n ?? t.duration,
          delay: this.currentTimeline.currentTime + (r ?? 0) + t.delay,
          easing: "",
        },
        s = new Yf(
          this._driver,
          t.element,
          t.keyframes,
          t.preStyleProps,
          t.postStyleProps,
          i,
          t.stretchStartingKeyframe,
        );
      return this.timelines.push(s), i;
    }
    incrementTime(t) {
      this.currentTimeline.forwardTime(this.currentTimeline.duration + t);
    }
    delayNextStep(t) {
      t > 0 && this.currentTimeline.delayNextStep(t);
    }
    invokeQuery(t, n, r, i, s, o) {
      let a = [];
      if ((i && a.push(this.element), t.length > 0)) {
        (t = t.replace(gN, "." + this._enterClassName)),
          (t = t.replace(vN, "." + this._leaveClassName));
        let c = r != 1,
          l = this._driver.query(this.element, t, c);
        r !== 0 &&
          (l = r < 0 ? l.slice(l.length + r, l.length) : l.slice(0, r)),
          a.push(...l);
      }
      return !s && a.length == 0 && o.push(x1(n)), a;
    }
  },
  el = class e {
    constructor(t, n, r, i) {
      (this._driver = t),
        (this.element = n),
        (this.startTime = r),
        (this._elementTimelineStylesLookup = i),
        (this.duration = 0),
        (this.easing = null),
        (this._previousKeyframe = new Map()),
        (this._currentKeyframe = new Map()),
        (this._keyframes = new Map()),
        (this._styleSummary = new Map()),
        (this._localTimelineStyles = new Map()),
        (this._pendingStyles = new Map()),
        (this._backFill = new Map()),
        (this._currentEmptyStepKeyframe = null),
        this._elementTimelineStylesLookup ||
          (this._elementTimelineStylesLookup = new Map()),
        (this._globalTimelineStyles = this._elementTimelineStylesLookup.get(n)),
        this._globalTimelineStyles ||
          ((this._globalTimelineStyles = this._localTimelineStyles),
          this._elementTimelineStylesLookup.set(n, this._localTimelineStyles)),
        this._loadKeyframe();
    }
    containsAnimation() {
      switch (this._keyframes.size) {
        case 0:
          return !1;
        case 1:
          return this.hasCurrentStyleProperties();
        default:
          return !0;
      }
    }
    hasCurrentStyleProperties() {
      return this._currentKeyframe.size > 0;
    }
    get currentTime() {
      return this.startTime + this.duration;
    }
    delayNextStep(t) {
      let n = this._keyframes.size === 1 && this._pendingStyles.size;
      this.duration || n
        ? (this.forwardTime(this.currentTime + t),
          n && this.snapshotCurrentStyles())
        : (this.startTime += t);
    }
    fork(t, n) {
      return (
        this.applyStylesToKeyframe(),
        new e(
          this._driver,
          t,
          n || this.currentTime,
          this._elementTimelineStylesLookup,
        )
      );
    }
    _loadKeyframe() {
      this._currentKeyframe && (this._previousKeyframe = this._currentKeyframe),
        (this._currentKeyframe = this._keyframes.get(this.duration)),
        this._currentKeyframe ||
          ((this._currentKeyframe = new Map()),
          this._keyframes.set(this.duration, this._currentKeyframe));
    }
    forwardFrame() {
      (this.duration += pN), this._loadKeyframe();
    }
    forwardTime(t) {
      this.applyStylesToKeyframe(), (this.duration = t), this._loadKeyframe();
    }
    _updateStyle(t, n) {
      this._localTimelineStyles.set(t, n),
        this._globalTimelineStyles.set(t, n),
        this._styleSummary.set(t, { time: this.currentTime, value: n });
    }
    allowOnlyTimelineStyles() {
      return this._currentEmptyStepKeyframe !== this._currentKeyframe;
    }
    applyEmptyStep(t) {
      t && this._previousKeyframe.set("easing", t);
      for (let [n, r] of this._globalTimelineStyles)
        this._backFill.set(n, r || En), this._currentKeyframe.set(n, En);
      this._currentEmptyStepKeyframe = this._currentKeyframe;
    }
    setStyles(t, n, r, i) {
      n && this._previousKeyframe.set("easing", n);
      let s = (i && i.params) || {},
        o = EN(t, this._globalTimelineStyles);
      for (let [a, c] of o) {
        let l = no(c, s, r);
        this._pendingStyles.set(a, l),
          this._localTimelineStyles.has(a) ||
            this._backFill.set(a, this._globalTimelineStyles.get(a) ?? En),
          this._updateStyle(a, l);
      }
    }
    applyStylesToKeyframe() {
      this._pendingStyles.size != 0 &&
        (this._pendingStyles.forEach((t, n) => {
          this._currentKeyframe.set(n, t);
        }),
        this._pendingStyles.clear(),
        this._localTimelineStyles.forEach((t, n) => {
          this._currentKeyframe.has(n) || this._currentKeyframe.set(n, t);
        }));
    }
    snapshotCurrentStyles() {
      for (let [t, n] of this._localTimelineStyles)
        this._pendingStyles.set(t, n), this._updateStyle(t, n);
    }
    getFinalKeyframe() {
      return this._keyframes.get(this.duration);
    }
    get properties() {
      let t = [];
      for (let n in this._currentKeyframe) t.push(n);
      return t;
    }
    mergeTimelineCollectedStyles(t) {
      t._styleSummary.forEach((n, r) => {
        let i = this._styleSummary.get(r);
        (!i || n.time > i.time) && this._updateStyle(r, n.value);
      });
    }
    buildKeyframes() {
      this.applyStylesToKeyframe();
      let t = new Set(),
        n = new Set(),
        r = this._keyframes.size === 1 && this.duration === 0,
        i = [];
      this._keyframes.forEach((a, c) => {
        let l = new Map([...this._backFill, ...a]);
        l.forEach((u, d) => {
          u === $c ? t.add(d) : u === En && n.add(d);
        }),
          r || l.set("offset", c / this.duration),
          i.push(l);
      });
      let s = [...t.values()],
        o = [...n.values()];
      if (r) {
        let a = i[0],
          c = new Map(a);
        a.set("offset", 0), c.set("offset", 1), (i = [a, c]);
      }
      return uh(
        this.element,
        i,
        s,
        o,
        this.duration,
        this.startTime,
        this.easing,
        !1,
      );
    }
  },
  Yf = class extends el {
    constructor(t, n, r, i, s, o, a = !1) {
      super(t, n, o.delay),
        (this.keyframes = r),
        (this.preStyleProps = i),
        (this.postStyleProps = s),
        (this._stretchStartingKeyframe = a),
        (this.timings = {
          duration: o.duration,
          delay: o.delay,
          easing: o.easing,
        });
    }
    containsAnimation() {
      return this.keyframes.length > 1;
    }
    buildKeyframes() {
      let t = this.keyframes,
        { delay: n, duration: r, easing: i } = this.timings;
      if (this._stretchStartingKeyframe && n) {
        let s = [],
          o = r + n,
          a = n / o,
          c = new Map(t[0]);
        c.set("offset", 0), s.push(c);
        let l = new Map(t[0]);
        l.set("offset", ME(a)), s.push(l);
        let u = t.length - 1;
        for (let d = 1; d <= u; d++) {
          let g = new Map(t[d]),
            E = g.get("offset"),
            S = n + E * r;
          g.set("offset", ME(S / o)), s.push(g);
        }
        (r = o), (n = 0), (i = ""), (t = s);
      }
      return uh(
        this.element,
        t,
        this.preStyleProps,
        this.postStyleProps,
        r,
        n,
        i,
        !0,
      );
    }
  };
function ME(e, t = 3) {
  let n = Math.pow(10, t - 1);
  return Math.round(e * n) / n;
}
function EN(e, t) {
  let n = new Map(),
    r;
  return (
    e.forEach((i) => {
      if (i === "*") {
        r ??= t.keys();
        for (let s of r) n.set(s, En);
      } else for (let [s, o] of i) n.set(s, o);
    }),
    n
  );
}
function AE(e, t, n, r, i, s, o, a, c, l, u, d, g) {
  return {
    type: 0,
    element: e,
    triggerName: t,
    isRemovalTransition: i,
    fromState: n,
    fromStyles: s,
    toState: r,
    toStyles: o,
    timelines: a,
    queriedElements: c,
    preStyleProps: l,
    postStyleProps: u,
    totalTime: d,
    errors: g,
  };
}
var jf = {},
  tl = class {
    constructor(t, n, r) {
      (this._triggerName = t), (this.ast = n), (this._stateStyles = r);
    }
    match(t, n, r, i) {
      return bN(this.ast.matchers, t, n, r, i);
    }
    buildStyles(t, n, r) {
      let i = this._stateStyles.get("*");
      return (
        t !== void 0 && (i = this._stateStyles.get(t?.toString()) || i),
        i ? i.buildStyles(n, r) : new Map()
      );
    }
    build(t, n, r, i, s, o, a, c, l, u) {
      let d = [],
        g = (this.ast.options && this.ast.options.params) || jf,
        E = (a && a.params) || jf,
        S = this.buildStyles(r, E, d),
        M = (c && c.params) || jf,
        H = this.buildStyles(i, M, d),
        L = new Set(),
        D = new Map(),
        w = new Map(),
        I = i === "void",
        b = { params: GE(M, g), delay: this.ast.options?.delay },
        ee = u ? [] : zE(t, n, this.ast.animation, s, o, S, H, b, l, d),
        te = 0;
      return (
        ee.forEach((me) => {
          te = Math.max(me.duration + me.delay, te);
        }),
        d.length
          ? AE(n, this._triggerName, r, i, I, S, H, [], [], D, w, te, d)
          : (ee.forEach((me) => {
              let q = me.element,
                x = Lt(D, q, new Set());
              me.preStyleProps.forEach((Z) => x.add(Z));
              let F = Lt(w, q, new Set());
              me.postStyleProps.forEach((Z) => F.add(Z)), q !== n && L.add(q);
            }),
            AE(
              n,
              this._triggerName,
              r,
              i,
              I,
              S,
              H,
              ee,
              [...L.values()],
              D,
              w,
              te,
            ))
      );
    }
  };
function bN(e, t, n, r, i) {
  return e.some((s) => s(t, n, r, i));
}
function GE(e, t) {
  let n = Y({}, t);
  return (
    Object.entries(e).forEach(([r, i]) => {
      i != null && (n[r] = i);
    }),
    n
  );
}
var Zf = class {
  constructor(t, n, r) {
    (this.styles = t), (this.defaultParams = n), (this.normalizer = r);
  }
  buildStyles(t, n) {
    let r = new Map(),
      i = GE(t, this.defaultParams);
    return (
      this.styles.styles.forEach((s) => {
        typeof s != "string" &&
          s.forEach((o, a) => {
            o && (o = no(o, i, n));
            let c = this.normalizer.normalizePropertyName(a, n);
            (o = this.normalizer.normalizeStyleValue(a, c, o, n)), r.set(a, o);
          });
      }),
      r
    );
  }
};
function _N(e, t, n) {
  return new Xf(e, t, n);
}
var Xf = class {
  constructor(t, n, r) {
    (this.name = t),
      (this.ast = n),
      (this._normalizer = r),
      (this.transitionFactories = []),
      (this.states = new Map()),
      n.states.forEach((i) => {
        let s = (i.options && i.options.params) || {};
        this.states.set(i.name, new Zf(i.style, s, r));
      }),
      RE(this.states, "true", "1"),
      RE(this.states, "false", "0"),
      n.transitions.forEach((i) => {
        this.transitionFactories.push(new tl(t, i, this.states));
      }),
      (this.fallbackTransition = wN(t, this.states, this._normalizer));
  }
  get containsQueries() {
    return this.ast.queryCount > 0;
  }
  matchTransition(t, n, r, i) {
    return this.transitionFactories.find((o) => o.match(t, n, r, i)) || null;
  }
  matchStyles(t, n, r) {
    return this.fallbackTransition.buildStyles(t, n, r);
  }
};
function wN(e, t, n) {
  let r = [(o, a) => !0],
    i = { type: _e.Sequence, steps: [], options: null },
    s = {
      type: _e.Transition,
      animation: i,
      matchers: r,
      options: null,
      queryCount: 0,
      depCount: 0,
    };
  return new tl(e, s, t);
}
function RE(e, t, n) {
  e.has(t) ? e.has(n) || e.set(n, e.get(t)) : e.has(n) && e.set(t, e.get(n));
}
var DN = new ro(),
  Jf = class {
    constructor(t, n, r) {
      (this.bodyNode = t),
        (this._driver = n),
        (this._normalizer = r),
        (this._animations = new Map()),
        (this._playersById = new Map()),
        (this.players = []);
    }
    register(t, n) {
      let r = [],
        i = [],
        s = qE(this._driver, n, r, i);
      if (r.length) throw F1(r);
      i.length && void 0, this._animations.set(t, s);
    }
    _buildPlayer(t, n, r) {
      let i = t.element,
        s = FE(this._normalizer, t.keyframes, n, r);
      return this._driver.animate(i, s, t.duration, t.delay, t.easing, [], !0);
    }
    create(t, n, r = {}) {
      let i = [],
        s = this._animations.get(t),
        o,
        a = new Map();
      if (
        (s
          ? ((o = zE(
              this._driver,
              n,
              s,
              HE,
              Vf,
              new Map(),
              new Map(),
              r,
              DN,
              i,
            )),
            o.forEach((u) => {
              let d = Lt(a, u.element, new Map());
              u.postStyleProps.forEach((g) => d.set(g, null));
            }))
          : (i.push(j1()), (o = [])),
        i.length)
      )
        throw U1(i);
      a.forEach((u, d) => {
        u.forEach((g, E) => {
          u.set(E, this._driver.computeStyle(d, E, En));
        });
      });
      let c = o.map((u) => {
          let d = a.get(u.element);
          return this._buildPlayer(u, new Map(), d);
        }),
        l = gr(c);
      return (
        this._playersById.set(t, l),
        l.onDestroy(() => this.destroy(t)),
        this.players.push(l),
        l
      );
    }
    destroy(t) {
      let n = this._getPlayer(t);
      n.destroy(), this._playersById.delete(t);
      let r = this.players.indexOf(n);
      r >= 0 && this.players.splice(r, 1);
    }
    _getPlayer(t) {
      let n = this._playersById.get(t);
      if (!n) throw B1(t);
      return n;
    }
    listen(t, n, r, i) {
      let s = sh(n, "", "", "");
      return ih(this._getPlayer(t), r, s, i), () => {};
    }
    command(t, n, r, i) {
      if (r == "register") {
        this.register(t, i[0]);
        return;
      }
      if (r == "create") {
        let o = i[0] || {};
        this.create(t, n, o);
        return;
      }
      let s = this._getPlayer(t);
      switch (r) {
        case "play":
          s.play();
          break;
        case "pause":
          s.pause();
          break;
        case "reset":
          s.reset();
          break;
        case "restart":
          s.restart();
          break;
        case "finish":
          s.finish();
          break;
        case "init":
          s.init();
          break;
        case "setPosition":
          s.setPosition(parseFloat(i[0]));
          break;
        case "destroy":
          this.destroy(t);
          break;
      }
    }
  },
  xE = "ng-animate-queued",
  TN = ".ng-animate-queued",
  Uf = "ng-animate-disabled",
  SN = ".ng-animate-disabled",
  CN = "ng-star-inserted",
  IN = ".ng-star-inserted",
  NN = [],
  WE = {
    namespaceId: "",
    setForRemoval: !1,
    setForMove: !1,
    hasAnimation: !1,
    removedBeforeQueried: !1,
  },
  MN = {
    namespaceId: "",
    setForMove: !1,
    setForRemoval: !1,
    hasAnimation: !1,
    removedBeforeQueried: !0,
  },
  cn = "__ng_removed",
  io = class {
    get params() {
      return this.options.params;
    }
    constructor(t, n = "") {
      this.namespaceId = n;
      let r = t && t.hasOwnProperty("value"),
        i = r ? t.value : t;
      if (((this.value = RN(i)), r)) {
        let s = t,
          { value: o } = s,
          a = ea(s, ["value"]);
        this.options = a;
      } else this.options = {};
      this.options.params || (this.options.params = {});
    }
    absorbOptions(t) {
      let n = t.params;
      if (n) {
        let r = this.options.params;
        Object.keys(n).forEach((i) => {
          r[i] == null && (r[i] = n[i]);
        });
      }
    }
  },
  to = "void",
  Bf = new io(to),
  eh = class {
    constructor(t, n, r) {
      (this.id = t),
        (this.hostElement = n),
        (this._engine = r),
        (this.players = []),
        (this._triggers = new Map()),
        (this._queue = []),
        (this._elementListeners = new Map()),
        (this._hostClassName = "ng-tns-" + t),
        Kt(n, this._hostClassName);
    }
    listen(t, n, r, i) {
      if (!this._triggers.has(n)) throw H1(r, n);
      if (r == null || r.length == 0) throw V1(n);
      if (!xN(r)) throw $1(r, n);
      let s = Lt(this._elementListeners, t, []),
        o = { name: n, phase: r, callback: i };
      s.push(o);
      let a = Lt(this._engine.statesByElement, t, new Map());
      return (
        a.has(n) || (Kt(t, qc), Kt(t, qc + "-" + n), a.set(n, Bf)),
        () => {
          this._engine.afterFlush(() => {
            let c = s.indexOf(o);
            c >= 0 && s.splice(c, 1), this._triggers.has(n) || a.delete(n);
          });
        }
      );
    }
    register(t, n) {
      return this._triggers.has(t) ? !1 : (this._triggers.set(t, n), !0);
    }
    _getTrigger(t) {
      let n = this._triggers.get(t);
      if (!n) throw q1(t);
      return n;
    }
    trigger(t, n, r, i = !0) {
      let s = this._getTrigger(n),
        o = new so(this.id, n, t),
        a = this._engine.statesByElement.get(t);
      a ||
        (Kt(t, qc),
        Kt(t, qc + "-" + n),
        this._engine.statesByElement.set(t, (a = new Map())));
      let c = a.get(n),
        l = new io(r, this.id);
      if (
        (!(r && r.hasOwnProperty("value")) && c && l.absorbOptions(c.options),
        a.set(n, l),
        c || (c = Bf),
        !(l.value === to) && c.value === l.value)
      ) {
        if (!LN(c.params, l.params)) {
          let M = [],
            H = s.matchStyles(c.value, c.params, M),
            L = s.matchStyles(l.value, l.params, M);
          M.length
            ? this._engine.reportError(M)
            : this._engine.afterFlush(() => {
                Kr(t, H), bn(t, L);
              });
        }
        return;
      }
      let g = Lt(this._engine.playersByElement, t, []);
      g.forEach((M) => {
        M.namespaceId == this.id &&
          M.triggerName == n &&
          M.queued &&
          M.destroy();
      });
      let E = s.matchTransition(c.value, l.value, t, l.params),
        S = !1;
      if (!E) {
        if (!i) return;
        (E = s.fallbackTransition), (S = !0);
      }
      return (
        this._engine.totalQueuedPlayers++,
        this._queue.push({
          element: t,
          triggerName: n,
          transition: E,
          fromState: c,
          toState: l,
          player: o,
          isFallbackTransition: S,
        }),
        S ||
          (Kt(t, xE),
          o.onStart(() => {
            ji(t, xE);
          })),
        o.onDone(() => {
          let M = this.players.indexOf(o);
          M >= 0 && this.players.splice(M, 1);
          let H = this._engine.playersByElement.get(t);
          if (H) {
            let L = H.indexOf(o);
            L >= 0 && H.splice(L, 1);
          }
        }),
        this.players.push(o),
        g.push(o),
        o
      );
    }
    deregister(t) {
      this._triggers.delete(t),
        this._engine.statesByElement.forEach((n) => n.delete(t)),
        this._elementListeners.forEach((n, r) => {
          this._elementListeners.set(
            r,
            n.filter((i) => i.name != t),
          );
        });
    }
    clearElementCache(t) {
      this._engine.statesByElement.delete(t), this._elementListeners.delete(t);
      let n = this._engine.playersByElement.get(t);
      n &&
        (n.forEach((r) => r.destroy()),
        this._engine.playersByElement.delete(t));
    }
    _signalRemovalForInnerTriggers(t, n) {
      let r = this._engine.driver.query(t, Qc, !0);
      r.forEach((i) => {
        if (i[cn]) return;
        let s = this._engine.fetchNamespacesByElement(i);
        s.size
          ? s.forEach((o) => o.triggerLeaveAnimation(i, n, !1, !0))
          : this.clearElementCache(i);
      }),
        this._engine.afterFlushAnimationsDone(() =>
          r.forEach((i) => this.clearElementCache(i)),
        );
    }
    triggerLeaveAnimation(t, n, r, i) {
      let s = this._engine.statesByElement.get(t),
        o = new Map();
      if (s) {
        let a = [];
        if (
          (s.forEach((c, l) => {
            if ((o.set(l, c.value), this._triggers.has(l))) {
              let u = this.trigger(t, l, to, i);
              u && a.push(u);
            }
          }),
          a.length)
        )
          return (
            this._engine.markElementAsRemoved(this.id, t, !0, n, o),
            r && gr(a).onDone(() => this._engine.processLeaveNode(t)),
            !0
          );
      }
      return !1;
    }
    prepareLeaveAnimationListeners(t) {
      let n = this._elementListeners.get(t),
        r = this._engine.statesByElement.get(t);
      if (n && r) {
        let i = new Set();
        n.forEach((s) => {
          let o = s.name;
          if (i.has(o)) return;
          i.add(o);
          let c = this._triggers.get(o).fallbackTransition,
            l = r.get(o) || Bf,
            u = new io(to),
            d = new so(this.id, o, t);
          this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: t,
              triggerName: o,
              transition: c,
              fromState: l,
              toState: u,
              player: d,
              isFallbackTransition: !0,
            });
        });
      }
    }
    removeNode(t, n) {
      let r = this._engine;
      if (
        (t.childElementCount && this._signalRemovalForInnerTriggers(t, n),
        this.triggerLeaveAnimation(t, n, !0))
      )
        return;
      let i = !1;
      if (r.totalAnimations) {
        let s = r.players.length ? r.playersByQueriedElement.get(t) : [];
        if (s && s.length) i = !0;
        else {
          let o = t;
          for (; (o = o.parentNode); )
            if (r.statesByElement.get(o)) {
              i = !0;
              break;
            }
        }
      }
      if ((this.prepareLeaveAnimationListeners(t), i))
        r.markElementAsRemoved(this.id, t, !1, n);
      else {
        let s = t[cn];
        (!s || s === WE) &&
          (r.afterFlush(() => this.clearElementCache(t)),
          r.destroyInnerAnimations(t),
          r._onRemovalComplete(t, n));
      }
    }
    insertNode(t, n) {
      Kt(t, this._hostClassName);
    }
    drainQueuedTransitions(t) {
      let n = [];
      return (
        this._queue.forEach((r) => {
          let i = r.player;
          if (i.destroyed) return;
          let s = r.element,
            o = this._elementListeners.get(s);
          o &&
            o.forEach((a) => {
              if (a.name == r.triggerName) {
                let c = sh(
                  s,
                  r.triggerName,
                  r.fromState.value,
                  r.toState.value,
                );
                (c._data = t), ih(r.player, a.phase, c, a.callback);
              }
            }),
            i.markedForDestroy
              ? this._engine.afterFlush(() => {
                  i.destroy();
                })
              : n.push(r);
        }),
        (this._queue = []),
        n.sort((r, i) => {
          let s = r.transition.ast.depCount,
            o = i.transition.ast.depCount;
          return s == 0 || o == 0
            ? s - o
            : this._engine.driver.containsElement(r.element, i.element)
              ? 1
              : -1;
        })
      );
    }
    destroy(t) {
      this.players.forEach((n) => n.destroy()),
        this._signalRemovalForInnerTriggers(this.hostElement, t);
    }
  },
  th = class {
    _onRemovalComplete(t, n) {
      this.onRemovalComplete(t, n);
    }
    constructor(t, n, r) {
      (this.bodyNode = t),
        (this.driver = n),
        (this._normalizer = r),
        (this.players = []),
        (this.newHostElements = new Map()),
        (this.playersByElement = new Map()),
        (this.playersByQueriedElement = new Map()),
        (this.statesByElement = new Map()),
        (this.disabledNodes = new Set()),
        (this.totalAnimations = 0),
        (this.totalQueuedPlayers = 0),
        (this._namespaceLookup = {}),
        (this._namespaceList = []),
        (this._flushFns = []),
        (this._whenQuietFns = []),
        (this.namespacesByHostElement = new Map()),
        (this.collectedEnterElements = []),
        (this.collectedLeaveElements = []),
        (this.onRemovalComplete = (i, s) => {});
    }
    get queuedPlayers() {
      let t = [];
      return (
        this._namespaceList.forEach((n) => {
          n.players.forEach((r) => {
            r.queued && t.push(r);
          });
        }),
        t
      );
    }
    createNamespace(t, n) {
      let r = new eh(t, n, this);
      return (
        this.bodyNode && this.driver.containsElement(this.bodyNode, n)
          ? this._balanceNamespaceList(r, n)
          : (this.newHostElements.set(n, r), this.collectEnterElement(n)),
        (this._namespaceLookup[t] = r)
      );
    }
    _balanceNamespaceList(t, n) {
      let r = this._namespaceList,
        i = this.namespacesByHostElement;
      if (r.length - 1 >= 0) {
        let o = !1,
          a = this.driver.getParentElement(n);
        for (; a; ) {
          let c = i.get(a);
          if (c) {
            let l = r.indexOf(c);
            r.splice(l + 1, 0, t), (o = !0);
            break;
          }
          a = this.driver.getParentElement(a);
        }
        o || r.unshift(t);
      } else r.push(t);
      return i.set(n, t), t;
    }
    register(t, n) {
      let r = this._namespaceLookup[t];
      return r || (r = this.createNamespace(t, n)), r;
    }
    registerTrigger(t, n, r) {
      let i = this._namespaceLookup[t];
      i && i.register(n, r) && this.totalAnimations++;
    }
    destroy(t, n) {
      t &&
        (this.afterFlush(() => {}),
        this.afterFlushAnimationsDone(() => {
          let r = this._fetchNamespace(t);
          this.namespacesByHostElement.delete(r.hostElement);
          let i = this._namespaceList.indexOf(r);
          i >= 0 && this._namespaceList.splice(i, 1),
            r.destroy(n),
            delete this._namespaceLookup[t];
        }));
    }
    _fetchNamespace(t) {
      return this._namespaceLookup[t];
    }
    fetchNamespacesByElement(t) {
      let n = new Set(),
        r = this.statesByElement.get(t);
      if (r) {
        for (let i of r.values())
          if (i.namespaceId) {
            let s = this._fetchNamespace(i.namespaceId);
            s && n.add(s);
          }
      }
      return n;
    }
    trigger(t, n, r, i) {
      if (Wc(n)) {
        let s = this._fetchNamespace(t);
        if (s) return s.trigger(n, r, i), !0;
      }
      return !1;
    }
    insertNode(t, n, r, i) {
      if (!Wc(n)) return;
      let s = n[cn];
      if (s && s.setForRemoval) {
        (s.setForRemoval = !1), (s.setForMove = !0);
        let o = this.collectedLeaveElements.indexOf(n);
        o >= 0 && this.collectedLeaveElements.splice(o, 1);
      }
      if (t) {
        let o = this._fetchNamespace(t);
        o && o.insertNode(n, r);
      }
      i && this.collectEnterElement(n);
    }
    collectEnterElement(t) {
      this.collectedEnterElements.push(t);
    }
    markElementAsDisabled(t, n) {
      n
        ? this.disabledNodes.has(t) || (this.disabledNodes.add(t), Kt(t, Uf))
        : this.disabledNodes.has(t) &&
          (this.disabledNodes.delete(t), ji(t, Uf));
    }
    removeNode(t, n, r) {
      if (Wc(n)) {
        let i = t ? this._fetchNamespace(t) : null;
        i ? i.removeNode(n, r) : this.markElementAsRemoved(t, n, !1, r);
        let s = this.namespacesByHostElement.get(n);
        s && s.id !== t && s.removeNode(n, r);
      } else this._onRemovalComplete(n, r);
    }
    markElementAsRemoved(t, n, r, i, s) {
      this.collectedLeaveElements.push(n),
        (n[cn] = {
          namespaceId: t,
          setForRemoval: i,
          hasAnimation: r,
          removedBeforeQueried: !1,
          previousTriggersValues: s,
        });
    }
    listen(t, n, r, i, s) {
      return Wc(n) ? this._fetchNamespace(t).listen(n, r, i, s) : () => {};
    }
    _buildInstruction(t, n, r, i, s) {
      return t.transition.build(
        this.driver,
        t.element,
        t.fromState.value,
        t.toState.value,
        r,
        i,
        t.fromState.options,
        t.toState.options,
        n,
        s,
      );
    }
    destroyInnerAnimations(t) {
      let n = this.driver.query(t, Qc, !0);
      n.forEach((r) => this.destroyActiveAnimationsForElement(r)),
        this.playersByQueriedElement.size != 0 &&
          ((n = this.driver.query(t, $f, !0)),
          n.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
    }
    destroyActiveAnimationsForElement(t) {
      let n = this.playersByElement.get(t);
      n &&
        n.forEach((r) => {
          r.queued ? (r.markedForDestroy = !0) : r.destroy();
        });
    }
    finishActiveQueriedAnimationOnElement(t) {
      let n = this.playersByQueriedElement.get(t);
      n && n.forEach((r) => r.finish());
    }
    whenRenderingDone() {
      return new Promise((t) => {
        if (this.players.length) return gr(this.players).onDone(() => t());
        t();
      });
    }
    processLeaveNode(t) {
      let n = t[cn];
      if (n && n.setForRemoval) {
        if (((t[cn] = WE), n.namespaceId)) {
          this.destroyInnerAnimations(t);
          let r = this._fetchNamespace(n.namespaceId);
          r && r.clearElementCache(t);
        }
        this._onRemovalComplete(t, n.setForRemoval);
      }
      t.classList?.contains(Uf) && this.markElementAsDisabled(t, !1),
        this.driver.query(t, SN, !0).forEach((r) => {
          this.markElementAsDisabled(r, !1);
        });
    }
    flush(t = -1) {
      let n = [];
      if (
        (this.newHostElements.size &&
          (this.newHostElements.forEach((r, i) =>
            this._balanceNamespaceList(r, i),
          ),
          this.newHostElements.clear()),
        this.totalAnimations && this.collectedEnterElements.length)
      )
        for (let r = 0; r < this.collectedEnterElements.length; r++) {
          let i = this.collectedEnterElements[r];
          Kt(i, CN);
        }
      if (
        this._namespaceList.length &&
        (this.totalQueuedPlayers || this.collectedLeaveElements.length)
      ) {
        let r = [];
        try {
          n = this._flushAnimations(r, t);
        } finally {
          for (let i = 0; i < r.length; i++) r[i]();
        }
      } else
        for (let r = 0; r < this.collectedLeaveElements.length; r++) {
          let i = this.collectedLeaveElements[r];
          this.processLeaveNode(i);
        }
      if (
        ((this.totalQueuedPlayers = 0),
        (this.collectedEnterElements.length = 0),
        (this.collectedLeaveElements.length = 0),
        this._flushFns.forEach((r) => r()),
        (this._flushFns = []),
        this._whenQuietFns.length)
      ) {
        let r = this._whenQuietFns;
        (this._whenQuietFns = []),
          n.length
            ? gr(n).onDone(() => {
                r.forEach((i) => i());
              })
            : r.forEach((i) => i());
      }
    }
    reportError(t) {
      throw z1(t);
    }
    _flushAnimations(t, n) {
      let r = new ro(),
        i = [],
        s = new Map(),
        o = [],
        a = new Map(),
        c = new Map(),
        l = new Map(),
        u = new Set();
      this.disabledNodes.forEach((y) => {
        u.add(y);
        let C = this.driver.query(y, TN, !0);
        for (let R = 0; R < C.length; R++) u.add(C[R]);
      });
      let d = this.bodyNode,
        g = Array.from(this.statesByElement.keys()),
        E = LE(g, this.collectedEnterElements),
        S = new Map(),
        M = 0;
      E.forEach((y, C) => {
        let R = HE + M++;
        S.set(C, R), y.forEach((V) => Kt(V, R));
      });
      let H = [],
        L = new Set(),
        D = new Set();
      for (let y = 0; y < this.collectedLeaveElements.length; y++) {
        let C = this.collectedLeaveElements[y],
          R = C[cn];
        R &&
          R.setForRemoval &&
          (H.push(C),
          L.add(C),
          R.hasAnimation
            ? this.driver.query(C, IN, !0).forEach((V) => L.add(V))
            : D.add(C));
      }
      let w = new Map(),
        I = LE(g, Array.from(L));
      I.forEach((y, C) => {
        let R = Vf + M++;
        w.set(C, R), y.forEach((V) => Kt(V, R));
      }),
        t.push(() => {
          E.forEach((y, C) => {
            let R = S.get(C);
            y.forEach((V) => ji(V, R));
          }),
            I.forEach((y, C) => {
              let R = w.get(C);
              y.forEach((V) => ji(V, R));
            }),
            H.forEach((y) => {
              this.processLeaveNode(y);
            });
        });
      let b = [],
        ee = [];
      for (let y = this._namespaceList.length - 1; y >= 0; y--)
        this._namespaceList[y].drainQueuedTransitions(n).forEach((R) => {
          let V = R.player,
            Q = R.element;
          if ((b.push(V), this.collectedEnterElements.length)) {
            let at = Q[cn];
            if (at && at.setForMove) {
              if (
                at.previousTriggersValues &&
                at.previousTriggersValues.has(R.triggerName)
              ) {
                let wn = at.previousTriggersValues.get(R.triggerName),
                  bt = this.statesByElement.get(R.element);
                if (bt && bt.has(R.triggerName)) {
                  let ti = bt.get(R.triggerName);
                  (ti.value = wn), bt.set(R.triggerName, ti);
                }
              }
              V.destroy();
              return;
            }
          }
          let he = !d || !this.driver.containsElement(d, Q),
            T = w.get(Q),
            O = S.get(Q),
            $ = this._buildInstruction(R, r, O, T, he);
          if ($.errors && $.errors.length) {
            ee.push($);
            return;
          }
          if (he) {
            V.onStart(() => Kr(Q, $.fromStyles)),
              V.onDestroy(() => bn(Q, $.toStyles)),
              i.push(V);
            return;
          }
          if (R.isFallbackTransition) {
            V.onStart(() => Kr(Q, $.fromStyles)),
              V.onDestroy(() => bn(Q, $.toStyles)),
              i.push(V);
            return;
          }
          let we = [];
          $.timelines.forEach((at) => {
            (at.stretchStartingKeyframe = !0),
              this.disabledNodes.has(at.element) || we.push(at);
          }),
            ($.timelines = we),
            r.append(Q, $.timelines);
          let yt = { instruction: $, player: V, element: Q };
          o.push(yt),
            $.queriedElements.forEach((at) => Lt(a, at, []).push(V)),
            $.preStyleProps.forEach((at, wn) => {
              if (at.size) {
                let bt = c.get(wn);
                bt || c.set(wn, (bt = new Set())),
                  at.forEach((ti, Zi) => bt.add(Zi));
              }
            }),
            $.postStyleProps.forEach((at, wn) => {
              let bt = l.get(wn);
              bt || l.set(wn, (bt = new Set())),
                at.forEach((ti, Zi) => bt.add(Zi));
            });
        });
      if (ee.length) {
        let y = [];
        ee.forEach((C) => {
          y.push(G1(C.triggerName, C.errors));
        }),
          b.forEach((C) => C.destroy()),
          this.reportError(y);
      }
      let te = new Map(),
        me = new Map();
      o.forEach((y) => {
        let C = y.element;
        r.has(C) &&
          (me.set(C, C),
          this._beforeAnimationBuild(y.player.namespaceId, y.instruction, te));
      }),
        i.forEach((y) => {
          let C = y.element;
          this._getPreviousPlayers(
            C,
            !1,
            y.namespaceId,
            y.triggerName,
            null,
          ).forEach((V) => {
            Lt(te, C, []).push(V), V.destroy();
          });
        });
      let q = H.filter((y) => PE(y, c, l)),
        x = new Map();
      kE(x, this.driver, D, l, En).forEach((y) => {
        PE(y, c, l) && q.push(y);
      });
      let Z = new Map();
      E.forEach((y, C) => {
        kE(Z, this.driver, new Set(y), c, $c);
      }),
        q.forEach((y) => {
          let C = x.get(y),
            R = Z.get(y);
          x.set(y, new Map([...(C?.entries() ?? []), ...(R?.entries() ?? [])]));
        });
      let v = [],
        m = [],
        p = {};
      o.forEach((y) => {
        let { element: C, player: R, instruction: V } = y;
        if (r.has(C)) {
          if (u.has(C)) {
            R.onDestroy(() => bn(C, V.toStyles)),
              (R.disabled = !0),
              R.overrideTotalTime(V.totalTime),
              i.push(R);
            return;
          }
          let Q = p;
          if (me.size > 1) {
            let T = C,
              O = [];
            for (; (T = T.parentNode); ) {
              let $ = me.get(T);
              if ($) {
                Q = $;
                break;
              }
              O.push(T);
            }
            O.forEach(($) => me.set($, Q));
          }
          let he = this._buildAnimation(R.namespaceId, V, te, s, Z, x);
          if ((R.setRealPlayer(he), Q === p)) v.push(R);
          else {
            let T = this.playersByElement.get(Q);
            T && T.length && (R.parentPlayer = gr(T)), i.push(R);
          }
        } else
          Kr(C, V.fromStyles),
            R.onDestroy(() => bn(C, V.toStyles)),
            m.push(R),
            u.has(C) && i.push(R);
      }),
        m.forEach((y) => {
          let C = s.get(y.element);
          if (C && C.length) {
            let R = gr(C);
            y.setRealPlayer(R);
          }
        }),
        i.forEach((y) => {
          y.parentPlayer ? y.syncPlayerEvents(y.parentPlayer) : y.destroy();
        });
      for (let y = 0; y < H.length; y++) {
        let C = H[y],
          R = C[cn];
        if ((ji(C, Vf), R && R.hasAnimation)) continue;
        let V = [];
        if (a.size) {
          let he = a.get(C);
          he && he.length && V.push(...he);
          let T = this.driver.query(C, $f, !0);
          for (let O = 0; O < T.length; O++) {
            let $ = a.get(T[O]);
            $ && $.length && V.push(...$);
          }
        }
        let Q = V.filter((he) => !he.destroyed);
        Q.length ? ON(this, C, Q) : this.processLeaveNode(C);
      }
      return (
        (H.length = 0),
        v.forEach((y) => {
          this.players.push(y),
            y.onDone(() => {
              y.destroy();
              let C = this.players.indexOf(y);
              this.players.splice(C, 1);
            }),
            y.play();
        }),
        v
      );
    }
    afterFlush(t) {
      this._flushFns.push(t);
    }
    afterFlushAnimationsDone(t) {
      this._whenQuietFns.push(t);
    }
    _getPreviousPlayers(t, n, r, i, s) {
      let o = [];
      if (n) {
        let a = this.playersByQueriedElement.get(t);
        a && (o = a);
      } else {
        let a = this.playersByElement.get(t);
        if (a) {
          let c = !s || s == to;
          a.forEach((l) => {
            l.queued || (!c && l.triggerName != i) || o.push(l);
          });
        }
      }
      return (
        (r || i) &&
          (o = o.filter(
            (a) => !((r && r != a.namespaceId) || (i && i != a.triggerName)),
          )),
        o
      );
    }
    _beforeAnimationBuild(t, n, r) {
      let i = n.triggerName,
        s = n.element,
        o = n.isRemovalTransition ? void 0 : t,
        a = n.isRemovalTransition ? void 0 : i;
      for (let c of n.timelines) {
        let l = c.element,
          u = l !== s,
          d = Lt(r, l, []);
        this._getPreviousPlayers(l, u, o, a, n.toState).forEach((E) => {
          let S = E.getRealPlayer();
          S.beforeDestroy && S.beforeDestroy(), E.destroy(), d.push(E);
        });
      }
      Kr(s, n.fromStyles);
    }
    _buildAnimation(t, n, r, i, s, o) {
      let a = n.triggerName,
        c = n.element,
        l = [],
        u = new Set(),
        d = new Set(),
        g = n.timelines.map((S) => {
          let M = S.element;
          u.add(M);
          let H = M[cn];
          if (H && H.removedBeforeQueried) return new mr(S.duration, S.delay);
          let L = M !== c,
            D = kN((r.get(M) || NN).map((te) => te.getRealPlayer())).filter(
              (te) => {
                let me = te;
                return me.element ? me.element === M : !1;
              },
            ),
            w = s.get(M),
            I = o.get(M),
            b = FE(this._normalizer, S.keyframes, w, I),
            ee = this._buildPlayer(S, b, D);
          if ((S.subTimeline && i && d.add(M), L)) {
            let te = new so(t, a, M);
            te.setRealPlayer(ee), l.push(te);
          }
          return ee;
        });
      l.forEach((S) => {
        Lt(this.playersByQueriedElement, S.element, []).push(S),
          S.onDone(() => AN(this.playersByQueriedElement, S.element, S));
      }),
        u.forEach((S) => Kt(S, CE));
      let E = gr(g);
      return (
        E.onDestroy(() => {
          u.forEach((S) => ji(S, CE)), bn(c, n.toStyles);
        }),
        d.forEach((S) => {
          Lt(i, S, []).push(E);
        }),
        E
      );
    }
    _buildPlayer(t, n, r) {
      return n.length > 0
        ? this.driver.animate(t.element, n, t.duration, t.delay, t.easing, r)
        : new mr(t.duration, t.delay);
    }
  },
  so = class {
    constructor(t, n, r) {
      (this.namespaceId = t),
        (this.triggerName = n),
        (this.element = r),
        (this._player = new mr()),
        (this._containsRealPlayer = !1),
        (this._queuedCallbacks = new Map()),
        (this.destroyed = !1),
        (this.parentPlayer = null),
        (this.markedForDestroy = !1),
        (this.disabled = !1),
        (this.queued = !0),
        (this.totalTime = 0);
    }
    setRealPlayer(t) {
      this._containsRealPlayer ||
        ((this._player = t),
        this._queuedCallbacks.forEach((n, r) => {
          n.forEach((i) => ih(t, r, void 0, i));
        }),
        this._queuedCallbacks.clear(),
        (this._containsRealPlayer = !0),
        this.overrideTotalTime(t.totalTime),
        (this.queued = !1));
    }
    getRealPlayer() {
      return this._player;
    }
    overrideTotalTime(t) {
      this.totalTime = t;
    }
    syncPlayerEvents(t) {
      let n = this._player;
      n.triggerCallback && t.onStart(() => n.triggerCallback("start")),
        t.onDone(() => this.finish()),
        t.onDestroy(() => this.destroy());
    }
    _queueEvent(t, n) {
      Lt(this._queuedCallbacks, t, []).push(n);
    }
    onDone(t) {
      this.queued && this._queueEvent("done", t), this._player.onDone(t);
    }
    onStart(t) {
      this.queued && this._queueEvent("start", t), this._player.onStart(t);
    }
    onDestroy(t) {
      this.queued && this._queueEvent("destroy", t), this._player.onDestroy(t);
    }
    init() {
      this._player.init();
    }
    hasStarted() {
      return this.queued ? !1 : this._player.hasStarted();
    }
    play() {
      !this.queued && this._player.play();
    }
    pause() {
      !this.queued && this._player.pause();
    }
    restart() {
      !this.queued && this._player.restart();
    }
    finish() {
      this._player.finish();
    }
    destroy() {
      (this.destroyed = !0), this._player.destroy();
    }
    reset() {
      !this.queued && this._player.reset();
    }
    setPosition(t) {
      this.queued || this._player.setPosition(t);
    }
    getPosition() {
      return this.queued ? 0 : this._player.getPosition();
    }
    triggerCallback(t) {
      let n = this._player;
      n.triggerCallback && n.triggerCallback(t);
    }
  };
function AN(e, t, n) {
  let r = e.get(t);
  if (r) {
    if (r.length) {
      let i = r.indexOf(n);
      r.splice(i, 1);
    }
    r.length == 0 && e.delete(t);
  }
  return r;
}
function RN(e) {
  return e ?? null;
}
function Wc(e) {
  return e && e.nodeType === 1;
}
function xN(e) {
  return e == "start" || e == "done";
}
function OE(e, t) {
  let n = e.style.display;
  return (e.style.display = t ?? "none"), n;
}
function kE(e, t, n, r, i) {
  let s = [];
  n.forEach((c) => s.push(OE(c)));
  let o = [];
  r.forEach((c, l) => {
    let u = new Map();
    c.forEach((d) => {
      let g = t.computeStyle(l, d, i);
      u.set(d, g), (!g || g.length == 0) && ((l[cn] = MN), o.push(l));
    }),
      e.set(l, u);
  });
  let a = 0;
  return n.forEach((c) => OE(c, s[a++])), o;
}
function LE(e, t) {
  let n = new Map();
  if ((e.forEach((a) => n.set(a, [])), t.length == 0)) return n;
  let r = 1,
    i = new Set(t),
    s = new Map();
  function o(a) {
    if (!a) return r;
    let c = s.get(a);
    if (c) return c;
    let l = a.parentNode;
    return n.has(l) ? (c = l) : i.has(l) ? (c = r) : (c = o(l)), s.set(a, c), c;
  }
  return (
    t.forEach((a) => {
      let c = o(a);
      c !== r && n.get(c).push(a);
    }),
    n
  );
}
function Kt(e, t) {
  e.classList?.add(t);
}
function ji(e, t) {
  e.classList?.remove(t);
}
function ON(e, t, n) {
  gr(n).onDone(() => e.processLeaveNode(t));
}
function kN(e) {
  let t = [];
  return KE(e, t), t;
}
function KE(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    r instanceof Js ? KE(r.players, t) : t.push(r);
  }
}
function LN(e, t) {
  let n = Object.keys(e),
    r = Object.keys(t);
  if (n.length != r.length) return !1;
  for (let i = 0; i < n.length; i++) {
    let s = n[i];
    if (!t.hasOwnProperty(s) || e[s] !== t[s]) return !1;
  }
  return !0;
}
function PE(e, t, n) {
  let r = n.get(e);
  if (!r) return !1;
  let i = t.get(e);
  return i ? r.forEach((s) => i.add(s)) : t.set(e, r), n.delete(e), !0;
}
var Ui = class {
  constructor(t, n, r) {
    (this._driver = n),
      (this._normalizer = r),
      (this._triggerCache = {}),
      (this.onRemovalComplete = (i, s) => {}),
      (this._transitionEngine = new th(t.body, n, r)),
      (this._timelineEngine = new Jf(t.body, n, r)),
      (this._transitionEngine.onRemovalComplete = (i, s) =>
        this.onRemovalComplete(i, s));
  }
  registerTrigger(t, n, r, i, s) {
    let o = t + "-" + i,
      a = this._triggerCache[o];
    if (!a) {
      let c = [],
        l = [],
        u = qE(this._driver, s, c, l);
      if (c.length) throw L1(i, c);
      l.length && void 0,
        (a = _N(i, u, this._normalizer)),
        (this._triggerCache[o] = a);
    }
    this._transitionEngine.registerTrigger(n, i, a);
  }
  register(t, n) {
    this._transitionEngine.register(t, n);
  }
  destroy(t, n) {
    this._transitionEngine.destroy(t, n);
  }
  onInsert(t, n, r, i) {
    this._transitionEngine.insertNode(t, n, r, i);
  }
  onRemove(t, n, r) {
    this._transitionEngine.removeNode(t, n, r);
  }
  disableAnimations(t, n) {
    this._transitionEngine.markElementAsDisabled(t, n);
  }
  process(t, n, r, i) {
    if (r.charAt(0) == "@") {
      let [s, o] = TE(r),
        a = i;
      this._timelineEngine.command(s, n, o, a);
    } else this._transitionEngine.trigger(t, n, r, i);
  }
  listen(t, n, r, i, s) {
    if (r.charAt(0) == "@") {
      let [o, a] = TE(r);
      return this._timelineEngine.listen(o, n, a, s);
    }
    return this._transitionEngine.listen(t, n, r, i, s);
  }
  flush(t = -1) {
    this._transitionEngine.flush(t);
  }
  get players() {
    return [...this._transitionEngine.players, ...this._timelineEngine.players];
  }
  whenRenderingDone() {
    return this._transitionEngine.whenRenderingDone();
  }
  afterFlushAnimationsDone(t) {
    this._transitionEngine.afterFlushAnimationsDone(t);
  }
};
function PN(e, t) {
  let n = null,
    r = null;
  return (
    Array.isArray(t) && t.length
      ? ((n = Hf(t[0])), t.length > 1 && (r = Hf(t[t.length - 1])))
      : t instanceof Map && (n = Hf(t)),
    n || r ? new nh(e, n, r) : null
  );
}
var nh = class e {
  static {
    this.initialStylesByElement = new WeakMap();
  }
  constructor(t, n, r) {
    (this._element = t),
      (this._startStyles = n),
      (this._endStyles = r),
      (this._state = 0);
    let i = e.initialStylesByElement.get(t);
    i || e.initialStylesByElement.set(t, (i = new Map())),
      (this._initialStyles = i);
  }
  start() {
    this._state < 1 &&
      (this._startStyles &&
        bn(this._element, this._startStyles, this._initialStyles),
      (this._state = 1));
  }
  finish() {
    this.start(),
      this._state < 2 &&
        (bn(this._element, this._initialStyles),
        this._endStyles &&
          (bn(this._element, this._endStyles), (this._endStyles = null)),
        (this._state = 1));
  }
  destroy() {
    this.finish(),
      this._state < 3 &&
        (e.initialStylesByElement.delete(this._element),
        this._startStyles &&
          (Kr(this._element, this._startStyles), (this._endStyles = null)),
        this._endStyles &&
          (Kr(this._element, this._endStyles), (this._endStyles = null)),
        bn(this._element, this._initialStyles),
        (this._state = 3));
  }
};
function Hf(e) {
  let t = null;
  return (
    e.forEach((n, r) => {
      FN(r) && ((t = t || new Map()), t.set(r, n));
    }),
    t
  );
}
function FN(e) {
  return e === "display" || e === "position";
}
var nl = class {
    constructor(t, n, r, i) {
      (this.element = t),
        (this.keyframes = n),
        (this.options = r),
        (this._specialStyles = i),
        (this._onDoneFns = []),
        (this._onStartFns = []),
        (this._onDestroyFns = []),
        (this._initialized = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._destroyed = !1),
        (this._originalOnDoneFns = []),
        (this._originalOnStartFns = []),
        (this.time = 0),
        (this.parentPlayer = null),
        (this.currentSnapshot = new Map()),
        (this._duration = r.duration),
        (this._delay = r.delay || 0),
        (this.time = this._duration + this._delay);
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((t) => t()),
        (this._onDoneFns = []));
    }
    init() {
      this._buildPlayer(), this._preparePlayerBeforeStart();
    }
    _buildPlayer() {
      if (this._initialized) return;
      this._initialized = !0;
      let t = this.keyframes;
      (this.domPlayer = this._triggerWebAnimation(
        this.element,
        t,
        this.options,
      )),
        (this._finalKeyframe = t.length ? t[t.length - 1] : new Map());
      let n = () => this._onFinish();
      this.domPlayer.addEventListener("finish", n),
        this.onDestroy(() => {
          this.domPlayer.removeEventListener("finish", n);
        });
    }
    _preparePlayerBeforeStart() {
      this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
    }
    _convertKeyframesToObject(t) {
      let n = [];
      return (
        t.forEach((r) => {
          n.push(Object.fromEntries(r));
        }),
        n
      );
    }
    _triggerWebAnimation(t, n, r) {
      return t.animate(this._convertKeyframesToObject(n), r);
    }
    onStart(t) {
      this._originalOnStartFns.push(t), this._onStartFns.push(t);
    }
    onDone(t) {
      this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
    }
    onDestroy(t) {
      this._onDestroyFns.push(t);
    }
    play() {
      this._buildPlayer(),
        this.hasStarted() ||
          (this._onStartFns.forEach((t) => t()),
          (this._onStartFns = []),
          (this._started = !0),
          this._specialStyles && this._specialStyles.start()),
        this.domPlayer.play();
    }
    pause() {
      this.init(), this.domPlayer.pause();
    }
    finish() {
      this.init(),
        this._specialStyles && this._specialStyles.finish(),
        this._onFinish(),
        this.domPlayer.finish();
    }
    reset() {
      this._resetDomPlayerState(),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    _resetDomPlayerState() {
      this.domPlayer && this.domPlayer.cancel();
    }
    restart() {
      this.reset(), this.play();
    }
    hasStarted() {
      return this._started;
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._resetDomPlayerState(),
        this._onFinish(),
        this._specialStyles && this._specialStyles.destroy(),
        this._onDestroyFns.forEach((t) => t()),
        (this._onDestroyFns = []));
    }
    setPosition(t) {
      this.domPlayer === void 0 && this.init(),
        (this.domPlayer.currentTime = t * this.time);
    }
    getPosition() {
      return +(this.domPlayer.currentTime ?? 0) / this.time;
    }
    get totalTime() {
      return this._delay + this._duration;
    }
    beforeDestroy() {
      let t = new Map();
      this.hasStarted() &&
        this._finalKeyframe.forEach((r, i) => {
          i !== "offset" && t.set(i, this._finished ? r : lh(this.element, i));
        }),
        (this.currentSnapshot = t);
    }
    triggerCallback(t) {
      let n = t === "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  rl = class {
    validateStyleProperty(t) {
      return !0;
    }
    validateAnimatableStyleProperty(t) {
      return !0;
    }
    containsElement(t, n) {
      return jE(t, n);
    }
    getParentElement(t) {
      return oh(t);
    }
    query(t, n, r) {
      return UE(t, n, r);
    }
    computeStyle(t, n, r) {
      return lh(t, n);
    }
    animate(t, n, r, i, s, o = []) {
      let a = i == 0 ? "both" : "forwards",
        c = { duration: r, delay: i, fill: a };
      s && (c.easing = s);
      let l = new Map(),
        u = o.filter((E) => E instanceof nl);
      rN(r, i) &&
        u.forEach((E) => {
          E.currentSnapshot.forEach((S, M) => l.set(M, S));
        });
      let d = eN(n).map((E) => new Map(E));
      d = iN(t, d, l);
      let g = PN(t, d);
      return new nl(t, d, c, g);
    }
  };
var Kc = "@",
  QE = "@.disabled",
  il = class {
    constructor(t, n, r, i) {
      (this.namespaceId = t),
        (this.delegate = n),
        (this.engine = r),
        (this._onDestroy = i),
        (this.ɵtype = 0);
    }
    get data() {
      return this.delegate.data;
    }
    destroyNode(t) {
      this.delegate.destroyNode?.(t);
    }
    destroy() {
      this.engine.destroy(this.namespaceId, this.delegate),
        this.engine.afterFlushAnimationsDone(() => {
          queueMicrotask(() => {
            this.delegate.destroy();
          });
        }),
        this._onDestroy?.();
    }
    createElement(t, n) {
      return this.delegate.createElement(t, n);
    }
    createComment(t) {
      return this.delegate.createComment(t);
    }
    createText(t) {
      return this.delegate.createText(t);
    }
    appendChild(t, n) {
      this.delegate.appendChild(t, n),
        this.engine.onInsert(this.namespaceId, n, t, !1);
    }
    insertBefore(t, n, r, i = !0) {
      this.delegate.insertBefore(t, n, r),
        this.engine.onInsert(this.namespaceId, n, t, i);
    }
    removeChild(t, n, r) {
      this.parentNode(n) &&
        this.engine.onRemove(this.namespaceId, n, this.delegate);
    }
    selectRootElement(t, n) {
      return this.delegate.selectRootElement(t, n);
    }
    parentNode(t) {
      return this.delegate.parentNode(t);
    }
    nextSibling(t) {
      return this.delegate.nextSibling(t);
    }
    setAttribute(t, n, r, i) {
      this.delegate.setAttribute(t, n, r, i);
    }
    removeAttribute(t, n, r) {
      this.delegate.removeAttribute(t, n, r);
    }
    addClass(t, n) {
      this.delegate.addClass(t, n);
    }
    removeClass(t, n) {
      this.delegate.removeClass(t, n);
    }
    setStyle(t, n, r, i) {
      this.delegate.setStyle(t, n, r, i);
    }
    removeStyle(t, n, r) {
      this.delegate.removeStyle(t, n, r);
    }
    setProperty(t, n, r) {
      n.charAt(0) == Kc && n == QE
        ? this.disableAnimations(t, !!r)
        : this.delegate.setProperty(t, n, r);
    }
    setValue(t, n) {
      this.delegate.setValue(t, n);
    }
    listen(t, n, r) {
      return this.delegate.listen(t, n, r);
    }
    disableAnimations(t, n) {
      this.engine.disableAnimations(t, n);
    }
  },
  rh = class extends il {
    constructor(t, n, r, i, s) {
      super(n, r, i, s), (this.factory = t), (this.namespaceId = n);
    }
    setProperty(t, n, r) {
      n.charAt(0) == Kc
        ? n.charAt(1) == "." && n == QE
          ? ((r = r === void 0 ? !0 : !!r), this.disableAnimations(t, r))
          : this.engine.process(this.namespaceId, t, n.slice(1), r)
        : this.delegate.setProperty(t, n, r);
    }
    listen(t, n, r) {
      if (n.charAt(0) == Kc) {
        let i = jN(t),
          s = n.slice(1),
          o = "";
        return (
          s.charAt(0) != Kc && ([s, o] = UN(s)),
          this.engine.listen(this.namespaceId, i, s, o, (a) => {
            let c = a._data || -1;
            this.factory.scheduleListenerCallback(c, r, a);
          })
        );
      }
      return this.delegate.listen(t, n, r);
    }
  };
function jN(e) {
  switch (e) {
    case "body":
      return document.body;
    case "document":
      return document;
    case "window":
      return window;
    default:
      return e;
  }
}
function UN(e) {
  let t = e.indexOf("."),
    n = e.substring(0, t),
    r = e.slice(t + 1);
  return [n, r];
}
var sl = class {
  constructor(t, n, r) {
    (this.delegate = t),
      (this.engine = n),
      (this._zone = r),
      (this._currentId = 0),
      (this._microtaskId = 1),
      (this._animationCallbacksBuffer = []),
      (this._rendererCache = new Map()),
      (this._cdRecurDepth = 0),
      (n.onRemovalComplete = (i, s) => {
        s?.removeChild(null, i);
      });
  }
  createRenderer(t, n) {
    let r = "",
      i = this.delegate.createRenderer(t, n);
    if (!t || !n?.data?.animation) {
      let l = this._rendererCache,
        u = l.get(i);
      if (!u) {
        let d = () => l.delete(i);
        (u = new il(r, i, this.engine, d)), l.set(i, u);
      }
      return u;
    }
    let s = n.id,
      o = n.id + "-" + this._currentId;
    this._currentId++, this.engine.register(o, t);
    let a = (l) => {
      Array.isArray(l)
        ? l.forEach(a)
        : this.engine.registerTrigger(s, o, t, l.name, l);
    };
    return n.data.animation.forEach(a), new rh(this, o, i, this.engine);
  }
  begin() {
    this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
  }
  _scheduleCountTask() {
    queueMicrotask(() => {
      this._microtaskId++;
    });
  }
  scheduleListenerCallback(t, n, r) {
    if (t >= 0 && t < this._microtaskId) {
      this._zone.run(() => n(r));
      return;
    }
    let i = this._animationCallbacksBuffer;
    i.length == 0 &&
      queueMicrotask(() => {
        this._zone.run(() => {
          i.forEach((s) => {
            let [o, a] = s;
            o(a);
          }),
            (this._animationCallbacksBuffer = []);
        });
      }),
      i.push([n, r]);
  }
  end() {
    this._cdRecurDepth--,
      this._cdRecurDepth == 0 &&
        this._zone.runOutsideAngular(() => {
          this._scheduleCountTask(), this.engine.flush(this._microtaskId);
        }),
      this.delegate.end && this.delegate.end();
  }
  whenRenderingDone() {
    return this.engine.whenRenderingDone();
  }
};
var VN = (() => {
  class e extends Ui {
    constructor(n, r, i) {
      super(n, r, i);
    }
    ngOnDestroy() {
      this.flush();
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)(le(qe), le(Qr), le(Yr));
      };
    }
    static {
      this.ɵprov = ne({ token: e, factory: e.ɵfac });
    }
  }
  return e;
})();
function $N() {
  return new Zc();
}
function qN(e, t, n) {
  return new sl(e, t, n);
}
var YE = [
    { provide: Yr, useFactory: $N },
    { provide: Ui, useClass: VN },
    { provide: dr, useFactory: qN, deps: [Hc, Ui, He] },
  ],
  n2 = [
    { provide: Qr, useFactory: () => new rl() },
    { provide: Vd, useValue: "BrowserAnimations" },
    ...YE,
  ],
  zN = [
    { provide: Qr, useClass: ah },
    { provide: Vd, useValue: "NoopAnimations" },
    ...YE,
  ];
function ZE() {
  return [...zN];
}
var GN = Object.getOwnPropertyNames,
  oe = (e, t) =>
    function () {
      return t || (0, e[GN(e)[0]])((t = { exports: {} }).exports, t), t.exports;
    },
  oo = oe({
    "external/npm/node_modules/domino/lib/Event.js"(e, t) {
      "use strict";
      (t.exports = n),
        (n.CAPTURING_PHASE = 1),
        (n.AT_TARGET = 2),
        (n.BUBBLING_PHASE = 3);
      function n(r, i) {
        if (
          ((this.type = ""),
          (this.target = null),
          (this.currentTarget = null),
          (this.eventPhase = n.AT_TARGET),
          (this.bubbles = !1),
          (this.cancelable = !1),
          (this.isTrusted = !1),
          (this.defaultPrevented = !1),
          (this.timeStamp = Date.now()),
          (this._propagationStopped = !1),
          (this._immediatePropagationStopped = !1),
          (this._initialized = !0),
          (this._dispatching = !1),
          r && (this.type = r),
          i)
        )
          for (var s in i) this[s] = i[s];
      }
      n.prototype = Object.create(Object.prototype, {
        constructor: { value: n },
        stopPropagation: {
          value: function () {
            this._propagationStopped = !0;
          },
        },
        stopImmediatePropagation: {
          value: function () {
            (this._propagationStopped = !0),
              (this._immediatePropagationStopped = !0);
          },
        },
        preventDefault: {
          value: function () {
            this.cancelable && (this.defaultPrevented = !0);
          },
        },
        initEvent: {
          value: function (i, s, o) {
            (this._initialized = !0),
              !this._dispatching &&
                ((this._propagationStopped = !1),
                (this._immediatePropagationStopped = !1),
                (this.defaultPrevented = !1),
                (this.isTrusted = !1),
                (this.target = null),
                (this.type = i),
                (this.bubbles = s),
                (this.cancelable = o));
          },
        },
      });
    },
  }),
  tb = oe({
    "external/npm/node_modules/domino/lib/UIEvent.js"(e, t) {
      "use strict";
      var n = oo();
      t.exports = r;
      function r() {
        n.call(this), (this.view = null), (this.detail = 0);
      }
      r.prototype = Object.create(n.prototype, {
        constructor: { value: r },
        initUIEvent: {
          value: function (i, s, o, a, c) {
            this.initEvent(i, s, o), (this.view = a), (this.detail = c);
          },
        },
      });
    },
  }),
  nb = oe({
    "external/npm/node_modules/domino/lib/MouseEvent.js"(e, t) {
      "use strict";
      var n = tb();
      t.exports = r;
      function r() {
        n.call(this),
          (this.screenX = this.screenY = this.clientX = this.clientY = 0),
          (this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1),
          (this.button = 0),
          (this.buttons = 1),
          (this.relatedTarget = null);
      }
      r.prototype = Object.create(n.prototype, {
        constructor: { value: r },
        initMouseEvent: {
          value: function (i, s, o, a, c, l, u, d, g, E, S, M, H, L, D) {
            switch (
              (this.initEvent(i, s, o, a, c),
              (this.screenX = l),
              (this.screenY = u),
              (this.clientX = d),
              (this.clientY = g),
              (this.ctrlKey = E),
              (this.altKey = S),
              (this.shiftKey = M),
              (this.metaKey = H),
              (this.button = L),
              L)
            ) {
              case 0:
                this.buttons = 1;
                break;
              case 1:
                this.buttons = 4;
                break;
              case 2:
                this.buttons = 2;
                break;
              default:
                this.buttons = 0;
                break;
            }
            this.relatedTarget = D;
          },
        },
        getModifierState: {
          value: function (i) {
            switch (i) {
              case "Alt":
                return this.altKey;
              case "Control":
                return this.ctrlKey;
              case "Shift":
                return this.shiftKey;
              case "Meta":
                return this.metaKey;
              default:
                return !1;
            }
          },
        },
      });
    },
  }),
  fh = oe({
    "external/npm/node_modules/domino/lib/DOMException.js"(e, t) {
      "use strict";
      t.exports = x;
      var n = 1,
        r = 3,
        i = 4,
        s = 5,
        o = 7,
        a = 8,
        c = 9,
        l = 11,
        u = 12,
        d = 13,
        g = 14,
        E = 15,
        S = 17,
        M = 18,
        H = 19,
        L = 20,
        D = 21,
        w = 22,
        I = 23,
        b = 24,
        ee = 25,
        te = [
          null,
          "INDEX_SIZE_ERR",
          null,
          "HIERARCHY_REQUEST_ERR",
          "WRONG_DOCUMENT_ERR",
          "INVALID_CHARACTER_ERR",
          null,
          "NO_MODIFICATION_ALLOWED_ERR",
          "NOT_FOUND_ERR",
          "NOT_SUPPORTED_ERR",
          "INUSE_ATTRIBUTE_ERR",
          "INVALID_STATE_ERR",
          "SYNTAX_ERR",
          "INVALID_MODIFICATION_ERR",
          "NAMESPACE_ERR",
          "INVALID_ACCESS_ERR",
          null,
          "TYPE_MISMATCH_ERR",
          "SECURITY_ERR",
          "NETWORK_ERR",
          "ABORT_ERR",
          "URL_MISMATCH_ERR",
          "QUOTA_EXCEEDED_ERR",
          "TIMEOUT_ERR",
          "INVALID_NODE_TYPE_ERR",
          "DATA_CLONE_ERR",
        ],
        me = [
          null,
          "INDEX_SIZE_ERR (1): the index is not in the allowed range",
          null,
          "HIERARCHY_REQUEST_ERR (3): the operation would yield an incorrect nodes model",
          "WRONG_DOCUMENT_ERR (4): the object is in the wrong Document, a call to importNode is required",
          "INVALID_CHARACTER_ERR (5): the string contains invalid characters",
          null,
          "NO_MODIFICATION_ALLOWED_ERR (7): the object can not be modified",
          "NOT_FOUND_ERR (8): the object can not be found here",
          "NOT_SUPPORTED_ERR (9): this operation is not supported",
          "INUSE_ATTRIBUTE_ERR (10): setAttributeNode called on owned Attribute",
          "INVALID_STATE_ERR (11): the object is in an invalid state",
          "SYNTAX_ERR (12): the string did not match the expected pattern",
          "INVALID_MODIFICATION_ERR (13): the object can not be modified in this way",
          "NAMESPACE_ERR (14): the operation is not allowed by Namespaces in XML",
          "INVALID_ACCESS_ERR (15): the object does not support the operation or argument",
          null,
          "TYPE_MISMATCH_ERR (17): the type of the object does not match the expected type",
          "SECURITY_ERR (18): the operation is insecure",
          "NETWORK_ERR (19): a network error occurred",
          "ABORT_ERR (20): the user aborted an operation",
          "URL_MISMATCH_ERR (21): the given URL does not match another URL",
          "QUOTA_EXCEEDED_ERR (22): the quota has been exceeded",
          "TIMEOUT_ERR (23): a timeout occurred",
          "INVALID_NODE_TYPE_ERR (24): the supplied node is invalid or has an invalid ancestor for this operation",
          "DATA_CLONE_ERR (25): the object can not be cloned.",
        ],
        q = {
          INDEX_SIZE_ERR: n,
          DOMSTRING_SIZE_ERR: 2,
          HIERARCHY_REQUEST_ERR: r,
          WRONG_DOCUMENT_ERR: i,
          INVALID_CHARACTER_ERR: s,
          NO_DATA_ALLOWED_ERR: 6,
          NO_MODIFICATION_ALLOWED_ERR: o,
          NOT_FOUND_ERR: a,
          NOT_SUPPORTED_ERR: c,
          INUSE_ATTRIBUTE_ERR: 10,
          INVALID_STATE_ERR: l,
          SYNTAX_ERR: u,
          INVALID_MODIFICATION_ERR: d,
          NAMESPACE_ERR: g,
          INVALID_ACCESS_ERR: E,
          VALIDATION_ERR: 16,
          TYPE_MISMATCH_ERR: S,
          SECURITY_ERR: M,
          NETWORK_ERR: H,
          ABORT_ERR: L,
          URL_MISMATCH_ERR: D,
          QUOTA_EXCEEDED_ERR: w,
          TIMEOUT_ERR: I,
          INVALID_NODE_TYPE_ERR: b,
          DATA_CLONE_ERR: ee,
        };
      function x(v) {
        Error.call(this),
          Error.captureStackTrace(this, this.constructor),
          (this.code = v),
          (this.message = me[v]),
          (this.name = te[v]);
      }
      x.prototype.__proto__ = Error.prototype;
      for (Z in q)
        (F = { value: q[Z] }),
          Object.defineProperty(x, Z, F),
          Object.defineProperty(x.prototype, Z, F);
      var F, Z;
    },
  }),
  hh = oe({
    "external/npm/node_modules/domino/lib/config.js"(e) {
      e.isApiWritable = !globalThis.__domino_frozen__;
    },
  }),
  nt = oe({
    "external/npm/node_modules/domino/lib/utils.js"(e) {
      "use strict";
      var t = fh(),
        n = t,
        r = hh().isApiWritable;
      (e.NAMESPACE = {
        HTML: "http://www.w3.org/1999/xhtml",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink",
      }),
        (e.IndexSizeError = function () {
          throw new t(n.INDEX_SIZE_ERR);
        }),
        (e.HierarchyRequestError = function () {
          throw new t(n.HIERARCHY_REQUEST_ERR);
        }),
        (e.WrongDocumentError = function () {
          throw new t(n.WRONG_DOCUMENT_ERR);
        }),
        (e.InvalidCharacterError = function () {
          throw new t(n.INVALID_CHARACTER_ERR);
        }),
        (e.NoModificationAllowedError = function () {
          throw new t(n.NO_MODIFICATION_ALLOWED_ERR);
        }),
        (e.NotFoundError = function () {
          throw new t(n.NOT_FOUND_ERR);
        }),
        (e.NotSupportedError = function () {
          throw new t(n.NOT_SUPPORTED_ERR);
        }),
        (e.InvalidStateError = function () {
          throw new t(n.INVALID_STATE_ERR);
        }),
        (e.SyntaxError = function () {
          throw new t(n.SYNTAX_ERR);
        }),
        (e.InvalidModificationError = function () {
          throw new t(n.INVALID_MODIFICATION_ERR);
        }),
        (e.NamespaceError = function () {
          throw new t(n.NAMESPACE_ERR);
        }),
        (e.InvalidAccessError = function () {
          throw new t(n.INVALID_ACCESS_ERR);
        }),
        (e.TypeMismatchError = function () {
          throw new t(n.TYPE_MISMATCH_ERR);
        }),
        (e.SecurityError = function () {
          throw new t(n.SECURITY_ERR);
        }),
        (e.NetworkError = function () {
          throw new t(n.NETWORK_ERR);
        }),
        (e.AbortError = function () {
          throw new t(n.ABORT_ERR);
        }),
        (e.UrlMismatchError = function () {
          throw new t(n.URL_MISMATCH_ERR);
        }),
        (e.QuotaExceededError = function () {
          throw new t(n.QUOTA_EXCEEDED_ERR);
        }),
        (e.TimeoutError = function () {
          throw new t(n.TIMEOUT_ERR);
        }),
        (e.InvalidNodeTypeError = function () {
          throw new t(n.INVALID_NODE_TYPE_ERR);
        }),
        (e.DataCloneError = function () {
          throw new t(n.DATA_CLONE_ERR);
        }),
        (e.nyi = function () {
          throw new Error("NotYetImplemented");
        }),
        (e.shouldOverride = function () {
          throw new Error(
            "Abstract function; should be overriding in subclass.",
          );
        }),
        (e.assert = function (i, s) {
          if (!i)
            throw new Error(
              "Assertion failed: " +
                (s || "") +
                `
` +
                new Error().stack,
            );
        }),
        (e.expose = function (i, s) {
          for (var o in i)
            Object.defineProperty(s.prototype, o, { value: i[o], writable: r });
        }),
        (e.merge = function (i, s) {
          for (var o in s) i[o] = s[o];
        }),
        (e.documentOrder = function (i, s) {
          return 3 - (i.compareDocumentPosition(s) & 6);
        }),
        (e.toASCIILowerCase = function (i) {
          return i.replace(/[A-Z]+/g, function (s) {
            return s.toLowerCase();
          });
        }),
        (e.toASCIIUpperCase = function (i) {
          return i.replace(/[a-z]+/g, function (s) {
            return s.toUpperCase();
          });
        });
    },
  }),
  rb = oe({
    "external/npm/node_modules/domino/lib/EventTarget.js"(e, t) {
      "use strict";
      var n = oo(),
        r = nb(),
        i = nt();
      t.exports = s;
      function s() {}
      s.prototype = {
        addEventListener: function (a, c, l) {
          if (c) {
            l === void 0 && (l = !1),
              this._listeners || (this._listeners = Object.create(null)),
              this._listeners[a] || (this._listeners[a] = []);
            for (var u = this._listeners[a], d = 0, g = u.length; d < g; d++) {
              var E = u[d];
              if (E.listener === c && E.capture === l) return;
            }
            var S = { listener: c, capture: l };
            typeof c == "function" && (S.f = c), u.push(S);
          }
        },
        removeEventListener: function (a, c, l) {
          if ((l === void 0 && (l = !1), this._listeners)) {
            var u = this._listeners[a];
            if (u)
              for (var d = 0, g = u.length; d < g; d++) {
                var E = u[d];
                if (E.listener === c && E.capture === l) {
                  u.length === 1
                    ? (this._listeners[a] = void 0)
                    : u.splice(d, 1);
                  return;
                }
              }
          }
        },
        dispatchEvent: function (a) {
          return this._dispatchEvent(a, !1);
        },
        _dispatchEvent: function (a, c) {
          typeof c != "boolean" && (c = !1);
          function l(M, H) {
            var L = H.type,
              D = H.eventPhase;
            if (
              ((H.currentTarget = M),
              D !== n.CAPTURING_PHASE && M._handlers && M._handlers[L])
            ) {
              var w = M._handlers[L],
                I;
              if (typeof w == "function") I = w.call(H.currentTarget, H);
              else {
                var b = w.handleEvent;
                if (typeof b != "function")
                  throw new TypeError(
                    "handleEvent property of event handler object isnot a function.",
                  );
                I = b.call(w, H);
              }
              switch (H.type) {
                case "mouseover":
                  I === !0 && H.preventDefault();
                  break;
                case "beforeunload":
                default:
                  I === !1 && H.preventDefault();
                  break;
              }
            }
            var ee = M._listeners && M._listeners[L];
            if (ee) {
              ee = ee.slice();
              for (var te = 0, me = ee.length; te < me; te++) {
                if (H._immediatePropagationStopped) return;
                var q = ee[te];
                if (
                  !(
                    (D === n.CAPTURING_PHASE && !q.capture) ||
                    (D === n.BUBBLING_PHASE && q.capture)
                  )
                )
                  if (q.f) q.f.call(H.currentTarget, H);
                  else {
                    var x = q.listener.handleEvent;
                    if (typeof x != "function")
                      throw new TypeError(
                        "handleEvent property of event listener object is not a function.",
                      );
                    x.call(q.listener, H);
                  }
              }
            }
          }
          (!a._initialized || a._dispatching) && i.InvalidStateError(),
            (a.isTrusted = c),
            (a._dispatching = !0),
            (a.target = this);
          for (var u = [], d = this.parentNode; d; d = d.parentNode) u.push(d);
          a.eventPhase = n.CAPTURING_PHASE;
          for (
            var g = u.length - 1;
            g >= 0 && (l(u[g], a), !a._propagationStopped);
            g--
          );
          if (
            (a._propagationStopped ||
              ((a.eventPhase = n.AT_TARGET), l(this, a)),
            a.bubbles && !a._propagationStopped)
          ) {
            a.eventPhase = n.BUBBLING_PHASE;
            for (
              var E = 0, S = u.length;
              E < S && (l(u[E], a), !a._propagationStopped);
              E++
            );
          }
          if (
            ((a._dispatching = !1),
            (a.eventPhase = n.AT_TARGET),
            (a.currentTarget = null),
            c && !a.defaultPrevented && a instanceof r)
          )
            switch (a.type) {
              case "mousedown":
                this._armed = { x: a.clientX, y: a.clientY, t: a.timeStamp };
                break;
              case "mouseout":
              case "mouseover":
                this._armed = null;
                break;
              case "mouseup":
                this._isClick(a) && this._doClick(a), (this._armed = null);
                break;
            }
          return !a.defaultPrevented;
        },
        _isClick: function (o) {
          return (
            this._armed !== null &&
            o.type === "mouseup" &&
            o.isTrusted &&
            o.button === 0 &&
            o.timeStamp - this._armed.t < 1e3 &&
            Math.abs(o.clientX - this._armed.x) < 10 &&
            Math.abs(o.clientY - this._armed.Y) < 10
          );
        },
        _doClick: function (o) {
          if (!this._click_in_progress) {
            this._click_in_progress = !0;
            for (var a = this; a && !a._post_click_activation_steps; )
              a = a.parentNode;
            a &&
              a._pre_click_activation_steps &&
              a._pre_click_activation_steps();
            var c = this.ownerDocument.createEvent("MouseEvent");
            c.initMouseEvent(
              "click",
              !0,
              !0,
              this.ownerDocument.defaultView,
              1,
              o.screenX,
              o.screenY,
              o.clientX,
              o.clientY,
              o.ctrlKey,
              o.altKey,
              o.shiftKey,
              o.metaKey,
              o.button,
              null,
            );
            var l = this._dispatchEvent(c, !0);
            a &&
              (l
                ? a._post_click_activation_steps &&
                  a._post_click_activation_steps(c)
                : a._cancelled_activation_steps &&
                  a._cancelled_activation_steps());
          }
        },
        _setEventHandler: function (a, c) {
          this._handlers || (this._handlers = Object.create(null)),
            (this._handlers[a] = c);
        },
        _getEventHandler: function (a) {
          return (this._handlers && this._handlers[a]) || null;
        },
      };
    },
  }),
  ib = oe({
    "external/npm/node_modules/domino/lib/LinkedList.js"(e, t) {
      "use strict";
      var n = nt(),
        r = (t.exports = {
          valid: function (i) {
            return (
              n.assert(i, "list falsy"),
              n.assert(i._previousSibling, "previous falsy"),
              n.assert(i._nextSibling, "next falsy"),
              !0
            );
          },
          insertBefore: function (i, s) {
            n.assert(r.valid(i) && r.valid(s));
            var o = i,
              a = i._previousSibling,
              c = s,
              l = s._previousSibling;
            (o._previousSibling = l),
              (a._nextSibling = c),
              (l._nextSibling = o),
              (c._previousSibling = a),
              n.assert(r.valid(i) && r.valid(s));
          },
          replace: function (i, s) {
            n.assert(r.valid(i) && (s === null || r.valid(s))),
              s !== null && r.insertBefore(s, i),
              r.remove(i),
              n.assert(r.valid(i) && (s === null || r.valid(s)));
          },
          remove: function (i) {
            n.assert(r.valid(i));
            var s = i._previousSibling;
            if (s !== i) {
              var o = i._nextSibling;
              (s._nextSibling = o),
                (o._previousSibling = s),
                (i._previousSibling = i._nextSibling = i),
                n.assert(r.valid(i));
            }
          },
        });
    },
  }),
  sb = oe({
    "external/npm/node_modules/domino/lib/NodeUtils.js"(e, t) {
      "use strict";
      t.exports = {
        serializeOne: H,
        ɵescapeMatchingClosingTag: g,
        ɵescapeClosingCommentTag: S,
        ɵescapeProcessingInstructionContent: M,
      };
      var n = nt(),
        r = n.NAMESPACE,
        i = {
          STYLE: !0,
          SCRIPT: !0,
          XMP: !0,
          IFRAME: !0,
          NOEMBED: !0,
          NOFRAMES: !0,
          PLAINTEXT: !0,
        },
        s = {
          area: !0,
          base: !0,
          basefont: !0,
          bgsound: !0,
          br: !0,
          col: !0,
          embed: !0,
          frame: !0,
          hr: !0,
          img: !0,
          input: !0,
          keygen: !0,
          link: !0,
          meta: !0,
          param: !0,
          source: !0,
          track: !0,
          wbr: !0,
        },
        o = {},
        a = /[&<>\u00A0]/g,
        c = /[&"<>\u00A0]/g;
      function l(L) {
        return a.test(L)
          ? L.replace(a, (D) => {
              switch (D) {
                case "&":
                  return "&amp;";
                case "<":
                  return "&lt;";
                case ">":
                  return "&gt;";
                case "\xA0":
                  return "&nbsp;";
              }
            })
          : L;
      }
      function u(L) {
        return c.test(L)
          ? L.replace(c, (D) => {
              switch (D) {
                case "<":
                  return "&lt;";
                case ">":
                  return "&gt;";
                case "&":
                  return "&amp;";
                case '"':
                  return "&quot;";
                case "\xA0":
                  return "&nbsp;";
              }
            })
          : L;
      }
      function d(L) {
        var D = L.namespaceURI;
        return D
          ? D === r.XML
            ? "xml:" + L.localName
            : D === r.XLINK
              ? "xlink:" + L.localName
              : D === r.XMLNS
                ? L.localName === "xmlns"
                  ? "xmlns"
                  : "xmlns:" + L.localName
                : L.name
          : L.localName;
      }
      function g(L, D) {
        let w = "</" + D;
        if (!L.toLowerCase().includes(w)) return L;
        let I = [...L],
          b = L.matchAll(new RegExp(w, "ig"));
        for (let ee of b) I[ee.index] = "&lt;";
        return I.join("");
      }
      var E = /--!?>/;
      function S(L) {
        return E.test(L) ? L.replace(/(--\!?)>/g, "$1&gt;") : L;
      }
      function M(L) {
        return L.includes(">") ? L.replaceAll(">", "&gt;") : L;
      }
      function H(L, D) {
        var w = "";
        switch (L.nodeType) {
          case 1:
            var I = L.namespaceURI,
              b = I === r.HTML,
              ee = b || I === r.SVG || I === r.MATHML ? L.localName : L.tagName;
            w += "<" + ee;
            for (var te = 0, me = L._numattrs; te < me; te++) {
              var q = L._attr(te);
              (w += " " + d(q)),
                q.value !== void 0 && (w += '="' + u(q.value) + '"');
            }
            if (((w += ">"), !(b && s[ee]))) {
              var x = L.serialize();
              i[ee.toUpperCase()] && (x = g(x, ee)),
                b &&
                  o[ee] &&
                  x.charAt(0) ===
                    `
` &&
                  (w += `
`),
                (w += x),
                (w += "</" + ee + ">");
            }
            break;
          case 3:
          case 4:
            var F;
            D.nodeType === 1 && D.namespaceURI === r.HTML
              ? (F = D.tagName)
              : (F = ""),
              i[F] || (F === "NOSCRIPT" && D.ownerDocument._scripting_enabled)
                ? (w += L.data)
                : (w += l(L.data));
            break;
          case 8:
            w += "<!--" + S(L.data) + "-->";
            break;
          case 7:
            let Z = M(L.data);
            w += "<?" + L.target + " " + Z + "?>";
            break;
          case 10:
            (w += "<!DOCTYPE " + L.name), (w += ">");
            break;
          default:
            n.InvalidStateError();
        }
        return w;
      }
    },
  }),
  gt = oe({
    "external/npm/node_modules/domino/lib/Node.js"(e, t) {
      "use strict";
      t.exports = o;
      var n = rb(),
        r = ib(),
        i = sb(),
        s = nt();
      function o() {
        n.call(this),
          (this.parentNode = null),
          (this._nextSibling = this._previousSibling = this),
          (this._index = void 0);
      }
      var a = (o.ELEMENT_NODE = 1),
        c = (o.ATTRIBUTE_NODE = 2),
        l = (o.TEXT_NODE = 3),
        u = (o.CDATA_SECTION_NODE = 4),
        d = (o.ENTITY_REFERENCE_NODE = 5),
        g = (o.ENTITY_NODE = 6),
        E = (o.PROCESSING_INSTRUCTION_NODE = 7),
        S = (o.COMMENT_NODE = 8),
        M = (o.DOCUMENT_NODE = 9),
        H = (o.DOCUMENT_TYPE_NODE = 10),
        L = (o.DOCUMENT_FRAGMENT_NODE = 11),
        D = (o.NOTATION_NODE = 12),
        w = (o.DOCUMENT_POSITION_DISCONNECTED = 1),
        I = (o.DOCUMENT_POSITION_PRECEDING = 2),
        b = (o.DOCUMENT_POSITION_FOLLOWING = 4),
        ee = (o.DOCUMENT_POSITION_CONTAINS = 8),
        te = (o.DOCUMENT_POSITION_CONTAINED_BY = 16),
        me = (o.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32);
      o.prototype = Object.create(n.prototype, {
        baseURI: { get: s.nyi },
        parentElement: {
          get: function () {
            return this.parentNode && this.parentNode.nodeType === a
              ? this.parentNode
              : null;
          },
        },
        hasChildNodes: { value: s.shouldOverride },
        firstChild: { get: s.shouldOverride },
        lastChild: { get: s.shouldOverride },
        isConnected: {
          get: function () {
            let q = this;
            for (; q != null; ) {
              if (q.nodeType === o.DOCUMENT_NODE) return !0;
              (q = q.parentNode),
                q != null &&
                  q.nodeType === o.DOCUMENT_FRAGMENT_NODE &&
                  (q = q.host);
            }
            return !1;
          },
        },
        previousSibling: {
          get: function () {
            var q = this.parentNode;
            return !q || this === q.firstChild ? null : this._previousSibling;
          },
        },
        nextSibling: {
          get: function () {
            var q = this.parentNode,
              x = this._nextSibling;
            return !q || x === q.firstChild ? null : x;
          },
        },
        textContent: {
          get: function () {
            return null;
          },
          set: function (q) {},
        },
        innerText: {
          get: function () {
            return null;
          },
          set: function (q) {},
        },
        _countChildrenOfType: {
          value: function (q) {
            for (var x = 0, F = this.firstChild; F !== null; F = F.nextSibling)
              F.nodeType === q && x++;
            return x;
          },
        },
        _ensureInsertValid: {
          value: function (x, F, Z) {
            var v = this,
              m,
              p;
            if (!x.nodeType) throw new TypeError("not a node");
            switch (v.nodeType) {
              case M:
              case L:
              case a:
                break;
              default:
                s.HierarchyRequestError();
            }
            switch (
              (x.isAncestor(v) && s.HierarchyRequestError(),
              (F !== null || !Z) && F.parentNode !== v && s.NotFoundError(),
              x.nodeType)
            ) {
              case L:
              case H:
              case a:
              case l:
              case E:
              case S:
                break;
              default:
                s.HierarchyRequestError();
            }
            if (v.nodeType === M)
              switch (x.nodeType) {
                case l:
                  s.HierarchyRequestError();
                  break;
                case L:
                  switch (
                    (x._countChildrenOfType(l) > 0 && s.HierarchyRequestError(),
                    x._countChildrenOfType(a))
                  ) {
                    case 0:
                      break;
                    case 1:
                      if (F !== null)
                        for (
                          Z && F.nodeType === H && s.HierarchyRequestError(),
                            p = F.nextSibling;
                          p !== null;
                          p = p.nextSibling
                        )
                          p.nodeType === H && s.HierarchyRequestError();
                      (m = v._countChildrenOfType(a)),
                        Z
                          ? m > 0 && s.HierarchyRequestError()
                          : (m > 1 || (m === 1 && F.nodeType !== a)) &&
                            s.HierarchyRequestError();
                      break;
                    default:
                      s.HierarchyRequestError();
                  }
                  break;
                case a:
                  if (F !== null)
                    for (
                      Z && F.nodeType === H && s.HierarchyRequestError(),
                        p = F.nextSibling;
                      p !== null;
                      p = p.nextSibling
                    )
                      p.nodeType === H && s.HierarchyRequestError();
                  (m = v._countChildrenOfType(a)),
                    Z
                      ? m > 0 && s.HierarchyRequestError()
                      : (m > 1 || (m === 1 && F.nodeType !== a)) &&
                        s.HierarchyRequestError();
                  break;
                case H:
                  if (F === null)
                    v._countChildrenOfType(a) && s.HierarchyRequestError();
                  else
                    for (
                      p = v.firstChild;
                      p !== null && p !== F;
                      p = p.nextSibling
                    )
                      p.nodeType === a && s.HierarchyRequestError();
                  (m = v._countChildrenOfType(H)),
                    Z
                      ? m > 0 && s.HierarchyRequestError()
                      : (m > 1 || (m === 1 && F.nodeType !== H)) &&
                        s.HierarchyRequestError();
                  break;
              }
            else x.nodeType === H && s.HierarchyRequestError();
          },
        },
        insertBefore: {
          value: function (x, F) {
            var Z = this;
            Z._ensureInsertValid(x, F, !0);
            var v = F;
            return (
              v === x && (v = x.nextSibling),
              Z.doc.adoptNode(x),
              x._insertOrReplace(Z, v, !1),
              x
            );
          },
        },
        appendChild: {
          value: function (q) {
            return this.insertBefore(q, null);
          },
        },
        _appendChild: {
          value: function (q) {
            q._insertOrReplace(this, null, !1);
          },
        },
        removeChild: {
          value: function (x) {
            var F = this;
            if (!x.nodeType) throw new TypeError("not a node");
            return x.parentNode !== F && s.NotFoundError(), x.remove(), x;
          },
        },
        replaceChild: {
          value: function (x, F) {
            var Z = this;
            return (
              Z._ensureInsertValid(x, F, !1),
              x.doc !== Z.doc && Z.doc.adoptNode(x),
              x._insertOrReplace(Z, F, !0),
              F
            );
          },
        },
        contains: {
          value: function (x) {
            return x === null
              ? !1
              : this === x
                ? !0
                : (this.compareDocumentPosition(x) & te) !== 0;
          },
        },
        compareDocumentPosition: {
          value: function (x) {
            if (this === x) return 0;
            if (this.doc !== x.doc || this.rooted !== x.rooted) return w + me;
            for (var F = [], Z = [], v = this; v !== null; v = v.parentNode)
              F.push(v);
            for (v = x; v !== null; v = v.parentNode) Z.push(v);
            if ((F.reverse(), Z.reverse(), F[0] !== Z[0])) return w + me;
            v = Math.min(F.length, Z.length);
            for (var m = 1; m < v; m++)
              if (F[m] !== Z[m]) return F[m].index < Z[m].index ? b : I;
            return F.length < Z.length ? b + te : I + ee;
          },
        },
        isSameNode: {
          value: function (x) {
            return this === x;
          },
        },
        isEqualNode: {
          value: function (x) {
            if (!x || x.nodeType !== this.nodeType || !this.isEqual(x))
              return !1;
            for (
              var F = this.firstChild, Z = x.firstChild;
              F && Z;
              F = F.nextSibling, Z = Z.nextSibling
            )
              if (!F.isEqualNode(Z)) return !1;
            return F === null && Z === null;
          },
        },
        cloneNode: {
          value: function (q) {
            var x = this.clone();
            if (q)
              for (var F = this.firstChild; F !== null; F = F.nextSibling)
                x._appendChild(F.cloneNode(!0));
            return x;
          },
        },
        lookupPrefix: {
          value: function (x) {
            var F;
            if (x === "" || x === null || x === void 0) return null;
            switch (this.nodeType) {
              case a:
                return this._lookupNamespacePrefix(x, this);
              case M:
                return (F = this.documentElement), F ? F.lookupPrefix(x) : null;
              case g:
              case D:
              case L:
              case H:
                return null;
              case c:
                return (F = this.ownerElement), F ? F.lookupPrefix(x) : null;
              default:
                return (F = this.parentElement), F ? F.lookupPrefix(x) : null;
            }
          },
        },
        lookupNamespaceURI: {
          value: function (x) {
            (x === "" || x === void 0) && (x = null);
            var F;
            switch (this.nodeType) {
              case a:
                return s.shouldOverride();
              case M:
                return (
                  (F = this.documentElement), F ? F.lookupNamespaceURI(x) : null
                );
              case g:
              case D:
              case H:
              case L:
                return null;
              case c:
                return (
                  (F = this.ownerElement), F ? F.lookupNamespaceURI(x) : null
                );
              default:
                return (
                  (F = this.parentElement), F ? F.lookupNamespaceURI(x) : null
                );
            }
          },
        },
        isDefaultNamespace: {
          value: function (x) {
            (x === "" || x === void 0) && (x = null);
            var F = this.lookupNamespaceURI(null);
            return F === x;
          },
        },
        index: {
          get: function () {
            var q = this.parentNode;
            if (this === q.firstChild) return 0;
            var x = q.childNodes;
            if (this._index === void 0 || x[this._index] !== this) {
              for (var F = 0; F < x.length; F++) x[F]._index = F;
              s.assert(x[this._index] === this);
            }
            return this._index;
          },
        },
        isAncestor: {
          value: function (q) {
            if (this.doc !== q.doc || this.rooted !== q.rooted) return !1;
            for (var x = q; x; x = x.parentNode) if (x === this) return !0;
            return !1;
          },
        },
        ensureSameDoc: {
          value: function (q) {
            q.ownerDocument === null
              ? (q.ownerDocument = this.doc)
              : q.ownerDocument !== this.doc && s.WrongDocumentError();
          },
        },
        removeChildren: { value: s.shouldOverride },
        _insertOrReplace: {
          value: function (x, F, Z) {
            var v = this,
              m,
              p;
            if (
              (v.nodeType === L && v.rooted && s.HierarchyRequestError(),
              x._childNodes &&
                ((m = F === null ? x._childNodes.length : F.index),
                v.parentNode === x))
            ) {
              var y = v.index;
              y < m && m--;
            }
            Z && (F.rooted && F.doc.mutateRemove(F), (F.parentNode = null));
            var C = F;
            C === null && (C = x.firstChild);
            var R = v.rooted && x.rooted;
            if (v.nodeType === L) {
              for (
                var V = [0, Z ? 1 : 0], Q, he = v.firstChild;
                he !== null;
                he = Q
              )
                (Q = he.nextSibling), V.push(he), (he.parentNode = x);
              var T = V.length;
              if (
                (Z
                  ? r.replace(C, T > 2 ? V[2] : null)
                  : T > 2 && C !== null && r.insertBefore(V[2], C),
                x._childNodes)
              )
                for (
                  V[0] = F === null ? x._childNodes.length : F._index,
                    x._childNodes.splice.apply(x._childNodes, V),
                    p = 2;
                  p < T;
                  p++
                )
                  V[p]._index = V[0] + (p - 2);
              else
                x._firstChild === F &&
                  (T > 2
                    ? (x._firstChild = V[2])
                    : Z && (x._firstChild = null));
              if (
                (v._childNodes
                  ? (v._childNodes.length = 0)
                  : (v._firstChild = null),
                x.rooted)
              )
                for (x.modify(), p = 2; p < T; p++) x.doc.mutateInsert(V[p]);
            } else {
              if (F === v) return;
              R ? v._remove() : v.parentNode && v.remove(),
                (v.parentNode = x),
                Z
                  ? (r.replace(C, v),
                    x._childNodes
                      ? ((v._index = m), (x._childNodes[m] = v))
                      : x._firstChild === F && (x._firstChild = v))
                  : (C !== null && r.insertBefore(v, C),
                    x._childNodes
                      ? ((v._index = m), x._childNodes.splice(m, 0, v))
                      : x._firstChild === F && (x._firstChild = v)),
                R
                  ? (x.modify(), x.doc.mutateMove(v))
                  : x.rooted && (x.modify(), x.doc.mutateInsert(v));
            }
          },
        },
        lastModTime: {
          get: function () {
            return (
              this._lastModTime || (this._lastModTime = this.doc.modclock),
              this._lastModTime
            );
          },
        },
        modify: {
          value: function () {
            if (this.doc.modclock)
              for (
                var q = ++this.doc.modclock, x = this;
                x;
                x = x.parentElement
              )
                x._lastModTime && (x._lastModTime = q);
          },
        },
        doc: {
          get: function () {
            return this.ownerDocument || this;
          },
        },
        rooted: {
          get: function () {
            return !!this._nid;
          },
        },
        normalize: {
          value: function () {
            for (var q, x = this.firstChild; x !== null; x = q)
              if (
                ((q = x.nextSibling),
                x.normalize && x.normalize(),
                x.nodeType === o.TEXT_NODE)
              ) {
                if (x.nodeValue === "") {
                  this.removeChild(x);
                  continue;
                }
                var F = x.previousSibling;
                F !== null &&
                  F.nodeType === o.TEXT_NODE &&
                  (F.appendData(x.nodeValue), this.removeChild(x));
              }
          },
        },
        serialize: {
          value: function () {
            if (this._innerHTML) return this._innerHTML;
            for (var q = "", x = this.firstChild; x !== null; x = x.nextSibling)
              q += i.serializeOne(x, this);
            return q;
          },
        },
        outerHTML: {
          get: function () {
            return i.serializeOne(this, { nodeType: 0 });
          },
          set: s.nyi,
        },
        ELEMENT_NODE: { value: a },
        ATTRIBUTE_NODE: { value: c },
        TEXT_NODE: { value: l },
        CDATA_SECTION_NODE: { value: u },
        ENTITY_REFERENCE_NODE: { value: d },
        ENTITY_NODE: { value: g },
        PROCESSING_INSTRUCTION_NODE: { value: E },
        COMMENT_NODE: { value: S },
        DOCUMENT_NODE: { value: M },
        DOCUMENT_TYPE_NODE: { value: H },
        DOCUMENT_FRAGMENT_NODE: { value: L },
        NOTATION_NODE: { value: D },
        DOCUMENT_POSITION_DISCONNECTED: { value: w },
        DOCUMENT_POSITION_PRECEDING: { value: I },
        DOCUMENT_POSITION_FOLLOWING: { value: b },
        DOCUMENT_POSITION_CONTAINS: { value: ee },
        DOCUMENT_POSITION_CONTAINED_BY: { value: te },
        DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: { value: me },
      });
    },
  }),
  WN = oe({
    "external/npm/node_modules/domino/lib/NodeList.es6.js"(e, t) {
      "use strict";
      t.exports = class extends Array {
        constructor(r) {
          if ((super((r && r.length) || 0), r)) for (var i in r) this[i] = r[i];
        }
        item(r) {
          return this[r] || null;
        }
      };
    },
  }),
  KN = oe({
    "external/npm/node_modules/domino/lib/NodeList.es5.js"(e, t) {
      "use strict";
      function n(i) {
        return this[i] || null;
      }
      function r(i) {
        return i || (i = []), (i.item = n), i;
      }
      t.exports = r;
    },
  }),
  Bi = oe({
    "external/npm/node_modules/domino/lib/NodeList.js"(e, t) {
      "use strict";
      var n;
      try {
        n = WN();
      } catch {
        n = KN();
      }
      t.exports = n;
    },
  }),
  ph = oe({
    "external/npm/node_modules/domino/lib/ContainerNode.js"(e, t) {
      "use strict";
      t.exports = i;
      var n = gt(),
        r = Bi();
      function i() {
        n.call(this), (this._firstChild = this._childNodes = null);
      }
      i.prototype = Object.create(n.prototype, {
        hasChildNodes: {
          value: function () {
            return this._childNodes
              ? this._childNodes.length > 0
              : this._firstChild !== null;
          },
        },
        childNodes: {
          get: function () {
            return this._ensureChildNodes(), this._childNodes;
          },
        },
        firstChild: {
          get: function () {
            return this._childNodes
              ? this._childNodes.length === 0
                ? null
                : this._childNodes[0]
              : this._firstChild;
          },
        },
        lastChild: {
          get: function () {
            var s = this._childNodes,
              o;
            return s
              ? s.length === 0
                ? null
                : s[s.length - 1]
              : ((o = this._firstChild),
                o === null ? null : o._previousSibling);
          },
        },
        _ensureChildNodes: {
          value: function () {
            if (!this._childNodes) {
              var s = this._firstChild,
                o = s,
                a = (this._childNodes = new r());
              if (s)
                do a.push(o), (o = o._nextSibling);
                while (o !== s);
              this._firstChild = null;
            }
          },
        },
        removeChildren: {
          value: function () {
            for (
              var o = this.rooted ? this.ownerDocument : null,
                a = this.firstChild,
                c;
              a !== null;

            )
              (c = a),
                (a = c.nextSibling),
                o && o.mutateRemove(c),
                (c.parentNode = null);
            this._childNodes
              ? (this._childNodes.length = 0)
              : (this._firstChild = null),
              this.modify();
          },
        },
      });
    },
  }),
  mh = oe({
    "external/npm/node_modules/domino/lib/xmlnames.js"(e) {
      "use strict";
      (e.isValidName = M), (e.isValidQName = H);
      var t = /^[_:A-Za-z][-.:\w]+$/,
        n = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/,
        r =
          "_A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        i =
          "-._A-Za-z0-9\xB7\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        s = "[" + r + "][" + i + "]*",
        o = r + ":",
        a = i + ":",
        c = new RegExp("^[" + o + "][" + a + "]*$"),
        l = new RegExp("^(" + s + "|" + s + ":" + s + ")$"),
        u = /[\uD800-\uDB7F\uDC00-\uDFFF]/,
        d = /[\uD800-\uDB7F\uDC00-\uDFFF]/g,
        g = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
      (r += "\uD800-\u{EFC00}-\uDFFF"),
        (i += "\uD800-\u{EFC00}-\uDFFF"),
        (s = "[" + r + "][" + i + "]*"),
        (o = r + ":"),
        (a = i + ":");
      var E = new RegExp("^[" + o + "][" + a + "]*$"),
        S = new RegExp("^(" + s + "|" + s + ":" + s + ")$");
      function M(L) {
        if (t.test(L) || c.test(L)) return !0;
        if (!u.test(L) || !E.test(L)) return !1;
        var D = L.match(d),
          w = L.match(g);
        return w !== null && 2 * w.length === D.length;
      }
      function H(L) {
        if (n.test(L) || l.test(L)) return !0;
        if (!u.test(L) || !S.test(L)) return !1;
        var D = L.match(d),
          w = L.match(g);
        return w !== null && 2 * w.length === D.length;
      }
    },
  }),
  ob = oe({
    "external/npm/node_modules/domino/lib/attributes.js"(e) {
      "use strict";
      var t = nt();
      e.property = function (r) {
        if (Array.isArray(r.type)) {
          var i = Object.create(null);
          r.type.forEach(function (a) {
            i[a.value || a] = a.alias || a;
          });
          var s = r.missing;
          s === void 0 && (s = null);
          var o = r.invalid;
          return (
            o === void 0 && (o = s),
            {
              get: function () {
                var a = this._getattr(r.name);
                return a === null
                  ? s
                  : ((a = i[a.toLowerCase()]),
                    a !== void 0 ? a : o !== null ? o : a);
              },
              set: function (a) {
                this._setattr(r.name, a);
              },
            }
          );
        } else {
          if (r.type === Boolean)
            return {
              get: function () {
                return this.hasAttribute(r.name);
              },
              set: function (a) {
                a ? this._setattr(r.name, "") : this.removeAttribute(r.name);
              },
            };
          if (
            r.type === Number ||
            r.type === "long" ||
            r.type === "unsigned long" ||
            r.type === "limited unsigned long with fallback"
          )
            return n(r);
          if (!r.type || r.type === String)
            return {
              get: function () {
                return this._getattr(r.name) || "";
              },
              set: function (a) {
                r.treatNullAsEmptyString && a === null && (a = ""),
                  this._setattr(r.name, a);
              },
            };
          if (typeof r.type == "function") return r.type(r.name, r);
        }
        throw new Error("Invalid attribute definition");
      };
      function n(r) {
        var i;
        typeof r.default == "function"
          ? (i = r.default)
          : typeof r.default == "number"
            ? (i = function () {
                return r.default;
              })
            : (i = function () {
                t.assert(!1, typeof r.default);
              });
        var s = r.type === "unsigned long",
          o = r.type === "long",
          a = r.type === "limited unsigned long with fallback",
          c = r.min,
          l = r.max,
          u = r.setmin;
        return (
          c === void 0 && (s && (c = 0), o && (c = -2147483648), a && (c = 1)),
          l === void 0 && (s || o || a) && (l = 2147483647),
          {
            get: function () {
              var d = this._getattr(r.name),
                g = r.float ? parseFloat(d) : parseInt(d, 10);
              if (
                d === null ||
                !isFinite(g) ||
                (c !== void 0 && g < c) ||
                (l !== void 0 && g > l)
              )
                return i.call(this);
              if (s || o || a) {
                if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test(d)) return i.call(this);
                g = g | 0;
              }
              return g;
            },
            set: function (d) {
              r.float || (d = Math.floor(d)),
                u !== void 0 &&
                  d < u &&
                  t.IndexSizeError(r.name + " set to " + d),
                s
                  ? (d = d < 0 || d > 2147483647 ? i.call(this) : d | 0)
                  : a
                    ? (d = d < 1 || d > 2147483647 ? i.call(this) : d | 0)
                    : o &&
                      (d =
                        d < -2147483648 || d > 2147483647
                          ? i.call(this)
                          : d | 0),
                this._setattr(r.name, String(d));
            },
          }
        );
      }
      e.registerChangeHandler = function (r, i, s) {
        var o = r.prototype;
        Object.prototype.hasOwnProperty.call(o, "_attributeChangeHandlers") ||
          (o._attributeChangeHandlers = Object.create(
            o._attributeChangeHandlers || null,
          )),
          (o._attributeChangeHandlers[i] = s);
      };
    },
  }),
  QN = oe({
    "external/npm/node_modules/domino/lib/FilteredElementList.js"(e, t) {
      "use strict";
      t.exports = r;
      var n = gt();
      function r(i, s) {
        (this.root = i),
          (this.filter = s),
          (this.lastModTime = i.lastModTime),
          (this.done = !1),
          (this.cache = []),
          this.traverse();
      }
      r.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return (
              this.checkcache(), this.done || this.traverse(), this.cache.length
            );
          },
        },
        item: {
          value: function (i) {
            return (
              this.checkcache(),
              !this.done && i >= this.cache.length && this.traverse(),
              this.cache[i]
            );
          },
        },
        checkcache: {
          value: function () {
            if (this.lastModTime !== this.root.lastModTime) {
              for (var i = this.cache.length - 1; i >= 0; i--) this[i] = void 0;
              (this.cache.length = 0),
                (this.done = !1),
                (this.lastModTime = this.root.lastModTime);
            }
          },
        },
        traverse: {
          value: function (i) {
            i !== void 0 && i++;
            for (var s; (s = this.next()) !== null; )
              if (
                ((this[this.cache.length] = s),
                this.cache.push(s),
                i && this.cache.length === i)
              )
                return;
            this.done = !0;
          },
        },
        next: {
          value: function () {
            var i =
                this.cache.length === 0
                  ? this.root
                  : this.cache[this.cache.length - 1],
              s;
            for (
              i.nodeType === n.DOCUMENT_NODE
                ? (s = i.documentElement)
                : (s = i.nextElement(this.root));
              s;

            ) {
              if (this.filter(s)) return s;
              s = s.nextElement(this.root);
            }
            return null;
          },
        },
      });
    },
  }),
  ab = oe({
    "external/npm/node_modules/domino/lib/DOMTokenList.js"(e, t) {
      "use strict";
      var n = nt();
      t.exports = r;
      function r(c, l) {
        (this._getString = c),
          (this._setString = l),
          (this._length = 0),
          (this._lastStringValue = ""),
          this._update();
      }
      Object.defineProperties(r.prototype, {
        length: {
          get: function () {
            return this._length;
          },
        },
        item: {
          value: function (c) {
            var l = a(this);
            return c < 0 || c >= l.length ? null : l[c];
          },
        },
        contains: {
          value: function (c) {
            c = String(c);
            var l = a(this);
            return l.indexOf(c) > -1;
          },
        },
        add: {
          value: function () {
            for (var c = a(this), l = 0, u = arguments.length; l < u; l++) {
              var d = s(arguments[l]);
              c.indexOf(d) < 0 && c.push(d);
            }
            this._update(c);
          },
        },
        remove: {
          value: function () {
            for (var c = a(this), l = 0, u = arguments.length; l < u; l++) {
              var d = s(arguments[l]),
                g = c.indexOf(d);
              g > -1 && c.splice(g, 1);
            }
            this._update(c);
          },
        },
        toggle: {
          value: function (l, u) {
            return (
              (l = s(l)),
              this.contains(l)
                ? u === void 0 || u === !1
                  ? (this.remove(l), !1)
                  : !0
                : u === void 0 || u === !0
                  ? (this.add(l), !0)
                  : !1
            );
          },
        },
        replace: {
          value: function (l, u) {
            String(u) === "" && n.SyntaxError(), (l = s(l)), (u = s(u));
            var d = a(this),
              g = d.indexOf(l);
            if (g < 0) return !1;
            var E = d.indexOf(u);
            return (
              E < 0
                ? (d[g] = u)
                : g < E
                  ? ((d[g] = u), d.splice(E, 1))
                  : d.splice(g, 1),
              this._update(d),
              !0
            );
          },
        },
        toString: {
          value: function () {
            return this._getString();
          },
        },
        value: {
          get: function () {
            return this._getString();
          },
          set: function (c) {
            this._setString(c), this._update();
          },
        },
        _update: {
          value: function (c) {
            c
              ? (i(this, c), this._setString(c.join(" ").trim()))
              : i(this, a(this)),
              (this._lastStringValue = this._getString());
          },
        },
      });
      function i(c, l) {
        var u = c._length,
          d;
        for (c._length = l.length, d = 0; d < l.length; d++) c[d] = l[d];
        for (; d < u; d++) c[d] = void 0;
      }
      function s(c) {
        return (
          (c = String(c)),
          c === "" && n.SyntaxError(),
          /[ \t\r\n\f]/.test(c) && n.InvalidCharacterError(),
          c
        );
      }
      function o(c) {
        for (var l = c._length, u = Array(l), d = 0; d < l; d++) u[d] = c[d];
        return u;
      }
      function a(c) {
        var l = c._getString();
        if (l === c._lastStringValue) return o(c);
        var u = l.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
        if (u === "") return [];
        var d = Object.create(null);
        return u.split(/[ \t\r\n\f]+/g).filter(function (g) {
          var E = "$" + g;
          return d[E] ? !1 : ((d[E] = !0), !0);
        });
      }
    },
  }),
  gh = oe({
    "external/npm/node_modules/domino/lib/select.js"(e, t) {
      "use strict";
      var n = Object.create(null, {
          location: {
            get: function () {
              throw new Error("window.location is not supported.");
            },
          },
        }),
        r = function (v, m) {
          return v.compareDocumentPosition(m);
        },
        i = function (v, m) {
          return r(v, m) & 2 ? 1 : -1;
        },
        s = function (v) {
          for (; (v = v.nextSibling) && v.nodeType !== 1; );
          return v;
        },
        o = function (v) {
          for (; (v = v.previousSibling) && v.nodeType !== 1; );
          return v;
        },
        a = function (v) {
          if ((v = v.firstChild))
            for (; v.nodeType !== 1 && (v = v.nextSibling); );
          return v;
        },
        c = function (v) {
          if ((v = v.lastChild))
            for (; v.nodeType !== 1 && (v = v.previousSibling); );
          return v;
        },
        l = function (v) {
          if (!v.parentNode) return !1;
          var m = v.parentNode.nodeType;
          return m === 1 || m === 9;
        },
        u = function (v) {
          if (!v) return v;
          var m = v[0];
          return m === '"' || m === "'"
            ? (v[v.length - 1] === m ? (v = v.slice(1, -1)) : (v = v.slice(1)),
              v.replace(b.str_escape, function (p) {
                var y = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(p);
                if (!y) return p.slice(1);
                if (y[2]) return "";
                var C = parseInt(y[1], 16);
                return String.fromCodePoint
                  ? String.fromCodePoint(C)
                  : String.fromCharCode(C);
              }))
            : b.ident.test(v)
              ? d(v)
              : v;
        },
        d = function (v) {
          return v.replace(b.escape, function (m) {
            var p = /^\\([0-9A-Fa-f]+)/.exec(m);
            if (!p) return m[1];
            var y = parseInt(p[1], 16);
            return String.fromCodePoint
              ? String.fromCodePoint(y)
              : String.fromCharCode(y);
          });
        },
        g = (function () {
          return Array.prototype.indexOf
            ? Array.prototype.indexOf
            : function (v, m) {
                for (var p = this.length; p--; ) if (this[p] === m) return p;
                return -1;
              };
        })(),
        E = function (v, m) {
          var p = b.inside.source.replace(/</g, v).replace(/>/g, m);
          return new RegExp(p);
        },
        S = function (v, m, p) {
          return (
            (v = v.source), (v = v.replace(m, p.source || p)), new RegExp(v)
          );
        },
        M = function (v, m) {
          return v
            .replace(/^(?:\w+:\/\/|\/+)/, "")
            .replace(/(?:\/+|\/*#.*?)$/, "")
            .split("/", m)
            .join("/");
        },
        H = function (v, m) {
          var p = v.replace(/\s+/g, ""),
            y;
          return (
            p === "even"
              ? (p = "2n+0")
              : p === "odd"
                ? (p = "2n+1")
                : p.indexOf("n") === -1 && (p = "0n" + p),
            (y = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(p)),
            {
              group: y[1] === "-" ? -(y[2] || 1) : +(y[2] || 1),
              offset: y[4] ? (y[3] === "-" ? -y[4] : +y[4]) : 0,
            }
          );
        },
        L = function (v, m, p) {
          var y = H(v),
            C = y.group,
            R = y.offset,
            V = p ? c : a,
            Q = p ? o : s;
          return function (he) {
            if (l(he))
              for (var T = V(he.parentNode), O = 0; T; ) {
                if ((m(T, he) && O++, T === he))
                  return (O -= R), C && O ? O % C === 0 && O < 0 == C < 0 : !O;
                T = Q(T);
              }
          };
        },
        D = {
          "*": (function () {
            return function () {
              return !0;
            };
          })(),
          type: function (v) {
            return (
              (v = v.toLowerCase()),
              function (m) {
                return m.nodeName.toLowerCase() === v;
              }
            );
          },
          attr: function (v, m, p, y) {
            return (
              (m = w[m]),
              function (C) {
                var R;
                switch (v) {
                  case "for":
                    R = C.htmlFor;
                    break;
                  case "class":
                    (R = C.className),
                      R === "" && C.getAttribute("class") == null && (R = null);
                    break;
                  case "href":
                  case "src":
                    R = C.getAttribute(v, 2);
                    break;
                  case "title":
                    R = C.getAttribute("title") || null;
                    break;
                  case "id":
                  case "lang":
                  case "dir":
                  case "accessKey":
                  case "hidden":
                  case "tabIndex":
                  case "style":
                    if (C.getAttribute) {
                      R = C.getAttribute(v);
                      break;
                    }
                  default:
                    if (C.hasAttribute && !C.hasAttribute(v)) break;
                    R =
                      C[v] != null ? C[v] : C.getAttribute && C.getAttribute(v);
                    break;
                }
                if (R != null)
                  return (
                    (R = R + ""),
                    y && ((R = R.toLowerCase()), (p = p.toLowerCase())),
                    m(R, p)
                  );
              }
            );
          },
          ":first-child": function (v) {
            return !o(v) && l(v);
          },
          ":last-child": function (v) {
            return !s(v) && l(v);
          },
          ":only-child": function (v) {
            return !o(v) && !s(v) && l(v);
          },
          ":nth-child": function (v, m) {
            return L(
              v,
              function () {
                return !0;
              },
              m,
            );
          },
          ":nth-last-child": function (v) {
            return D[":nth-child"](v, !0);
          },
          ":root": function (v) {
            return v.ownerDocument.documentElement === v;
          },
          ":empty": function (v) {
            return !v.firstChild;
          },
          ":not": function (v) {
            var m = F(v);
            return function (p) {
              return !m(p);
            };
          },
          ":first-of-type": function (v) {
            if (l(v)) {
              for (var m = v.nodeName; (v = o(v)); )
                if (v.nodeName === m) return;
              return !0;
            }
          },
          ":last-of-type": function (v) {
            if (l(v)) {
              for (var m = v.nodeName; (v = s(v)); )
                if (v.nodeName === m) return;
              return !0;
            }
          },
          ":only-of-type": function (v) {
            return D[":first-of-type"](v) && D[":last-of-type"](v);
          },
          ":nth-of-type": function (v, m) {
            return L(
              v,
              function (p, y) {
                return p.nodeName === y.nodeName;
              },
              m,
            );
          },
          ":nth-last-of-type": function (v) {
            return D[":nth-of-type"](v, !0);
          },
          ":checked": function (v) {
            return !!(v.checked || v.selected);
          },
          ":indeterminate": function (v) {
            return !D[":checked"](v);
          },
          ":enabled": function (v) {
            return !v.disabled && v.type !== "hidden";
          },
          ":disabled": function (v) {
            return !!v.disabled;
          },
          ":target": function (v) {
            return v.id === n.location.hash.substring(1);
          },
          ":focus": function (v) {
            return v === v.ownerDocument.activeElement;
          },
          ":is": function (v) {
            return F(v);
          },
          ":matches": function (v) {
            return D[":is"](v);
          },
          ":nth-match": function (v, m) {
            var p = v.split(/\s*,\s*/),
              y = p.shift(),
              C = F(p.join(","));
            return L(y, C, m);
          },
          ":nth-last-match": function (v) {
            return D[":nth-match"](v, !0);
          },
          ":links-here": function (v) {
            return v + "" == n.location + "";
          },
          ":lang": function (v) {
            return function (m) {
              for (; m; ) {
                if (m.lang) return m.lang.indexOf(v) === 0;
                m = m.parentNode;
              }
            };
          },
          ":dir": function (v) {
            return function (m) {
              for (; m; ) {
                if (m.dir) return m.dir === v;
                m = m.parentNode;
              }
            };
          },
          ":scope": function (v, m) {
            var p = m || v.ownerDocument;
            return p.nodeType === 9 ? v === p.documentElement : v === p;
          },
          ":any-link": function (v) {
            return typeof v.href == "string";
          },
          ":local-link": function (v) {
            if (v.nodeName) return v.href && v.host === n.location.host;
            var m = +v + 1;
            return function (p) {
              if (p.href) {
                var y = n.location + "",
                  C = p + "";
                return M(y, m) === M(C, m);
              }
            };
          },
          ":default": function (v) {
            return !!v.defaultSelected;
          },
          ":valid": function (v) {
            return v.willValidate || (v.validity && v.validity.valid);
          },
          ":invalid": function (v) {
            return !D[":valid"](v);
          },
          ":in-range": function (v) {
            return v.value > v.min && v.value <= v.max;
          },
          ":out-of-range": function (v) {
            return !D[":in-range"](v);
          },
          ":required": function (v) {
            return !!v.required;
          },
          ":optional": function (v) {
            return !v.required;
          },
          ":read-only": function (v) {
            if (v.readOnly) return !0;
            var m = v.getAttribute("contenteditable"),
              p = v.contentEditable,
              y = v.nodeName.toLowerCase();
            return (
              (y = y !== "input" && y !== "textarea"),
              (y || v.disabled) && m == null && p !== "true"
            );
          },
          ":read-write": function (v) {
            return !D[":read-only"](v);
          },
          ":hover": function () {
            throw new Error(":hover is not supported.");
          },
          ":active": function () {
            throw new Error(":active is not supported.");
          },
          ":link": function () {
            throw new Error(":link is not supported.");
          },
          ":visited": function () {
            throw new Error(":visited is not supported.");
          },
          ":column": function () {
            throw new Error(":column is not supported.");
          },
          ":nth-column": function () {
            throw new Error(":nth-column is not supported.");
          },
          ":nth-last-column": function () {
            throw new Error(":nth-last-column is not supported.");
          },
          ":current": function () {
            throw new Error(":current is not supported.");
          },
          ":past": function () {
            throw new Error(":past is not supported.");
          },
          ":future": function () {
            throw new Error(":future is not supported.");
          },
          ":contains": function (v) {
            return function (m) {
              var p = m.innerText || m.textContent || m.value || "";
              return p.indexOf(v) !== -1;
            };
          },
          ":has": function (v) {
            return function (m) {
              return Z(v, m).length > 0;
            };
          },
        },
        w = {
          "-": function () {
            return !0;
          },
          "=": function (v, m) {
            return v === m;
          },
          "*=": function (v, m) {
            return v.indexOf(m) !== -1;
          },
          "~=": function (v, m) {
            var p, y, C, R;
            for (y = 0; ; y = p + 1) {
              if (((p = v.indexOf(m, y)), p === -1)) return !1;
              if (
                ((C = v[p - 1]),
                (R = v[p + m.length]),
                (!C || C === " ") && (!R || R === " "))
              )
                return !0;
            }
          },
          "|=": function (v, m) {
            var p = v.indexOf(m),
              y;
            if (p === 0) return (y = v[p + m.length]), y === "-" || !y;
          },
          "^=": function (v, m) {
            return v.indexOf(m) === 0;
          },
          "$=": function (v, m) {
            var p = v.lastIndexOf(m);
            return p !== -1 && p + m.length === v.length;
          },
          "!=": function (v, m) {
            return v !== m;
          },
        },
        I = {
          " ": function (v) {
            return function (m) {
              for (; (m = m.parentNode); ) if (v(m)) return m;
            };
          },
          ">": function (v) {
            return function (m) {
              if ((m = m.parentNode)) return v(m) && m;
            };
          },
          "+": function (v) {
            return function (m) {
              if ((m = o(m))) return v(m) && m;
            };
          },
          "~": function (v) {
            return function (m) {
              for (; (m = o(m)); ) if (v(m)) return m;
            };
          },
          noop: function (v) {
            return function (m) {
              return v(m) && m;
            };
          },
          ref: function (v, m) {
            var p;
            function y(C) {
              for (
                var R = C.ownerDocument,
                  V = R.getElementsByTagName("*"),
                  Q = V.length;
                Q--;

              )
                if (((p = V[Q]), y.test(C))) return (p = null), !0;
              p = null;
            }
            return (
              (y.combinator = function (C) {
                if (!(!p || !p.getAttribute)) {
                  var R = p.getAttribute(m) || "";
                  if (
                    (R[0] === "#" && (R = R.substring(1)), R === C.id && v(p))
                  )
                    return p;
                }
              }),
              y
            );
          },
        },
        b = {
          escape: /\\(?:[^0-9A-Fa-f\r\n]|[0-9A-Fa-f]{1,6}[\r\n\t ]?)/g,
          str_escape: /(escape)|\\(\n|\r\n?|\f)/g,
          nonascii: /[\u00A0-\uFFFF]/,
          cssid: /(?:(?!-?[0-9])(?:escape|nonascii|[-_a-zA-Z0-9])+)/,
          qname: /^ *(cssid|\*)/,
          simple: /^(?:([.#]cssid)|pseudo|attr)/,
          ref: /^ *\/(cssid)\/ */,
          combinator: /^(?: +([^ \w*.#\\]) +|( )+|([^ \w*.#\\]))(?! *$)/,
          attr: /^\[(cssid)(?:([^\w]?=)(inside))?\]/,
          pseudo: /^(:cssid)(?:\((inside)\))?/,
          inside:
            /(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|<[^"'>]*>|\\["'>]|[^"'>])*/,
          ident: /^(cssid)$/,
        };
      (b.cssid = S(b.cssid, "nonascii", b.nonascii)),
        (b.cssid = S(b.cssid, "escape", b.escape)),
        (b.qname = S(b.qname, "cssid", b.cssid)),
        (b.simple = S(b.simple, "cssid", b.cssid)),
        (b.ref = S(b.ref, "cssid", b.cssid)),
        (b.attr = S(b.attr, "cssid", b.cssid)),
        (b.pseudo = S(b.pseudo, "cssid", b.cssid)),
        (b.inside = S(b.inside, `[^"'>]*`, b.inside)),
        (b.attr = S(b.attr, "inside", E("\\[", "\\]"))),
        (b.pseudo = S(b.pseudo, "inside", E("\\(", "\\)"))),
        (b.simple = S(b.simple, "pseudo", b.pseudo)),
        (b.simple = S(b.simple, "attr", b.attr)),
        (b.ident = S(b.ident, "cssid", b.cssid)),
        (b.str_escape = S(b.str_escape, "escape", b.escape));
      var ee = function (v) {
          for (
            var m = v.replace(/^\s+|\s+$/g, ""),
              p,
              y = [],
              C = [],
              R,
              V,
              Q,
              he,
              T;
            m;

          ) {
            if ((Q = b.qname.exec(m)))
              (m = m.substring(Q[0].length)), (V = d(Q[1])), C.push(te(V, !0));
            else if ((Q = b.simple.exec(m)))
              (m = m.substring(Q[0].length)),
                (V = "*"),
                C.push(te(V, !0)),
                C.push(te(Q));
            else throw new SyntaxError("Invalid selector.");
            for (; (Q = b.simple.exec(m)); )
              (m = m.substring(Q[0].length)), C.push(te(Q));
            if (
              (m[0] === "!" &&
                ((m = m.substring(1)),
                (R = x()),
                (R.qname = V),
                C.push(R.simple)),
              (Q = b.ref.exec(m)))
            ) {
              (m = m.substring(Q[0].length)),
                (T = I.ref(me(C), d(Q[1]))),
                y.push(T.combinator),
                (C = []);
              continue;
            }
            if ((Q = b.combinator.exec(m))) {
              if (
                ((m = m.substring(Q[0].length)),
                (he = Q[1] || Q[2] || Q[3]),
                he === ",")
              ) {
                y.push(I.noop(me(C)));
                break;
              }
            } else he = "noop";
            if (!I[he]) throw new SyntaxError("Bad combinator.");
            y.push(I[he](me(C))), (C = []);
          }
          return (
            (p = q(y)),
            (p.qname = V),
            (p.sel = m),
            R &&
              ((R.lname = p.qname),
              (R.test = p),
              (R.qname = R.qname),
              (R.sel = p.sel),
              (p = R)),
            T && ((T.test = p), (T.qname = p.qname), (T.sel = p.sel), (p = T)),
            p
          );
        },
        te = function (v, m) {
          if (m) return v === "*" ? D["*"] : D.type(v);
          if (v[1])
            return v[1][0] === "."
              ? D.attr("class", "~=", d(v[1].substring(1)), !1)
              : D.attr("id", "=", d(v[1].substring(1)), !1);
          if (v[2]) return v[3] ? D[d(v[2])](u(v[3])) : D[d(v[2])];
          if (v[4]) {
            var p = v[6],
              y = /["'\s]\s*I$/i.test(p);
            return (
              y && (p = p.replace(/\s*I$/i, "")),
              D.attr(d(v[4]), v[5] || "-", u(p), y)
            );
          }
          throw new SyntaxError("Unknown Selector.");
        },
        me = function (v) {
          var m = v.length,
            p;
          return m < 2
            ? v[0]
            : function (y) {
                if (y) {
                  for (p = 0; p < m; p++) if (!v[p](y)) return;
                  return !0;
                }
              };
        },
        q = function (v) {
          return v.length < 2
            ? function (m) {
                return !!v[0](m);
              }
            : function (m) {
                for (var p = v.length; p--; ) if (!(m = v[p](m))) return;
                return !0;
              };
        },
        x = function () {
          var v;
          function m(p) {
            for (
              var y = p.ownerDocument,
                C = y.getElementsByTagName(m.lname),
                R = C.length;
              R--;

            )
              if (m.test(C[R]) && v === p) return (v = null), !0;
            v = null;
          }
          return (
            (m.simple = function (p) {
              return (v = p), !0;
            }),
            m
          );
        },
        F = function (v) {
          for (var m = ee(v), p = [m]; m.sel; ) (m = ee(m.sel)), p.push(m);
          return p.length < 2
            ? m
            : function (y) {
                for (var C = p.length, R = 0; R < C; R++)
                  if (p[R](y)) return !0;
              };
        },
        Z = function (v, m) {
          for (
            var p = [],
              y = ee(v),
              C = m.getElementsByTagName(y.qname),
              R = 0,
              V;
            (V = C[R++]);

          )
            y(V) && p.push(V);
          if (y.sel) {
            for (; y.sel; )
              for (
                y = ee(y.sel), C = m.getElementsByTagName(y.qname), R = 0;
                (V = C[R++]);

              )
                y(V) && g.call(p, V) === -1 && p.push(V);
            p.sort(i);
          }
          return p;
        };
      (t.exports = e =
        function (v, m) {
          var p, y;
          if (m.nodeType !== 11 && v.indexOf(" ") === -1) {
            if (
              v[0] === "#" &&
              m.rooted &&
              /^#[A-Z_][-A-Z0-9_]*$/i.test(v) &&
              m.doc._hasMultipleElementsWithId &&
              ((p = v.substring(1)), !m.doc._hasMultipleElementsWithId(p))
            )
              return (y = m.doc.getElementById(p)), y ? [y] : [];
            if (v[0] === "." && /^\.\w+$/.test(v))
              return m.getElementsByClassName(v.substring(1));
            if (/^\w+$/.test(v)) return m.getElementsByTagName(v);
          }
          return Z(v, m);
        }),
        (e.selectors = D),
        (e.operators = w),
        (e.combinators = I),
        (e.matches = function (v, m) {
          var p = { sel: m };
          do if (((p = ee(p.sel)), p(v))) return !0;
          while (p.sel);
          return !1;
        });
    },
  }),
  yh = oe({
    "external/npm/node_modules/domino/lib/ChildNode.js"(e, t) {
      "use strict";
      var n = gt(),
        r = ib(),
        i = function (o, a) {
          for (var c = o.createDocumentFragment(), l = 0; l < a.length; l++) {
            var u = a[l],
              d = u instanceof n;
            c.appendChild(d ? u : o.createTextNode(String(u)));
          }
          return c;
        },
        s = {
          after: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.nextSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (d) {
                    return d === l;
                  });

                )
                  l = l.nextSibling;
                var u = i(this.doc, a);
                c.insertBefore(u, l);
              }
            },
          },
          before: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.previousSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (g) {
                    return g === l;
                  });

                )
                  l = l.previousSibling;
                var u = i(this.doc, a),
                  d = l ? l.nextSibling : c.firstChild;
                c.insertBefore(u, d);
              }
            },
          },
          remove: {
            value: function () {
              this.parentNode !== null &&
                (this.doc &&
                  (this.doc._preremoveNodeIterators(this),
                  this.rooted && this.doc.mutateRemove(this)),
                this._remove(),
                (this.parentNode = null));
            },
          },
          _remove: {
            value: function () {
              var a = this.parentNode;
              a !== null &&
                (a._childNodes
                  ? a._childNodes.splice(this.index, 1)
                  : a._firstChild === this &&
                    (this._nextSibling === this
                      ? (a._firstChild = null)
                      : (a._firstChild = this._nextSibling)),
                r.remove(this),
                a.modify());
            },
          },
          replaceWith: {
            value: function () {
              var a = Array.prototype.slice.call(arguments),
                c = this.parentNode,
                l = this.nextSibling;
              if (c !== null) {
                for (
                  ;
                  l &&
                  a.some(function (d) {
                    return d === l;
                  });

                )
                  l = l.nextSibling;
                var u = i(this.doc, a);
                this.parentNode === c
                  ? c.replaceChild(u, this)
                  : c.insertBefore(u, l);
              }
            },
          },
        };
      t.exports = s;
    },
  }),
  cb = oe({
    "external/npm/node_modules/domino/lib/NonDocumentTypeChildNode.js"(e, t) {
      "use strict";
      var n = gt(),
        r = {
          nextElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (var i = this.nextSibling; i !== null; i = i.nextSibling)
                  if (i.nodeType === n.ELEMENT_NODE) return i;
              }
              return null;
            },
          },
          previousElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (
                  var i = this.previousSibling;
                  i !== null;
                  i = i.previousSibling
                )
                  if (i.nodeType === n.ELEMENT_NODE) return i;
              }
              return null;
            },
          },
        };
      t.exports = r;
    },
  }),
  lb = oe({
    "external/npm/node_modules/domino/lib/NamedNodeMap.js"(e, t) {
      "use strict";
      t.exports = r;
      var n = nt();
      function r(i) {
        this.element = i;
      }
      Object.defineProperties(r.prototype, {
        length: { get: n.shouldOverride },
        item: { value: n.shouldOverride },
        getNamedItem: {
          value: function (s) {
            return this.element.getAttributeNode(s);
          },
        },
        getNamedItemNS: {
          value: function (s, o) {
            return this.element.getAttributeNodeNS(s, o);
          },
        },
        setNamedItem: { value: n.nyi },
        setNamedItemNS: { value: n.nyi },
        removeNamedItem: {
          value: function (s) {
            var o = this.element.getAttributeNode(s);
            if (o) return this.element.removeAttribute(s), o;
            n.NotFoundError();
          },
        },
        removeNamedItemNS: {
          value: function (s, o) {
            var a = this.element.getAttributeNodeNS(s, o);
            if (a) return this.element.removeAttributeNS(s, o), a;
            n.NotFoundError();
          },
        },
      });
    },
  }),
  ao = oe({
    "external/npm/node_modules/domino/lib/Element.js"(e, t) {
      "use strict";
      t.exports = D;
      var n = mh(),
        r = nt(),
        i = r.NAMESPACE,
        s = ob(),
        o = gt(),
        a = Bi(),
        c = sb(),
        l = QN(),
        u = fh(),
        d = ab(),
        g = gh(),
        E = ph(),
        S = yh(),
        M = cb(),
        H = lb(),
        L = Object.create(null);
      function D(m, p, y, C) {
        E.call(this),
          (this.nodeType = o.ELEMENT_NODE),
          (this.ownerDocument = m),
          (this.localName = p),
          (this.namespaceURI = y),
          (this.prefix = C),
          (this._tagName = void 0),
          (this._attrsByQName = Object.create(null)),
          (this._attrsByLName = Object.create(null)),
          (this._attrKeys = []);
      }
      function w(m, p) {
        if (m.nodeType === o.TEXT_NODE) p.push(m._data);
        else
          for (var y = 0, C = m.childNodes.length; y < C; y++)
            w(m.childNodes[y], p);
      }
      (D.prototype = Object.create(E.prototype, {
        isHTML: {
          get: function () {
            return this.namespaceURI === i.HTML && this.ownerDocument.isHTML;
          },
        },
        tagName: {
          get: function () {
            if (this._tagName === void 0) {
              var p;
              if (
                (this.prefix === null
                  ? (p = this.localName)
                  : (p = this.prefix + ":" + this.localName),
                this.isHTML)
              ) {
                var y = L[p];
                y || (L[p] = y = r.toASCIIUpperCase(p)), (p = y);
              }
              this._tagName = p;
            }
            return this._tagName;
          },
        },
        nodeName: {
          get: function () {
            return this.tagName;
          },
        },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        textContent: {
          get: function () {
            var m = [];
            return w(this, m), m.join("");
          },
          set: function (m) {
            this.removeChildren(),
              m != null &&
                m !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(m));
          },
        },
        innerText: {
          get: function () {
            var m = [];
            return (
              w(this, m),
              m
                .join("")
                .replace(/[ \t\n\f\r]+/g, " ")
                .trim()
            );
          },
          set: function (m) {
            this.removeChildren(),
              m != null &&
                m !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(m));
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: r.nyi,
        },
        outerHTML: {
          get: function () {
            return c.serializeOne(this, { nodeType: 0 });
          },
          set: function (m) {
            var p = this.ownerDocument,
              y = this.parentNode;
            if (y !== null) {
              y.nodeType === o.DOCUMENT_NODE && r.NoModificationAllowedError(),
                y.nodeType === o.DOCUMENT_FRAGMENT_NODE &&
                  (y = y.ownerDocument.createElement("body"));
              var C = p.implementation.mozHTMLParser(p._address, y);
              C.parse(m === null ? "" : String(m), !0),
                this.replaceWith(C._asDocumentFragment());
            }
          },
        },
        _insertAdjacent: {
          value: function (p, y) {
            var C = !1;
            switch (p) {
              case "beforebegin":
                C = !0;
              case "afterend":
                var R = this.parentNode;
                return R === null
                  ? null
                  : R.insertBefore(y, C ? this : this.nextSibling);
              case "afterbegin":
                C = !0;
              case "beforeend":
                return this.insertBefore(y, C ? this.firstChild : null);
              default:
                return r.SyntaxError();
            }
          },
        },
        insertAdjacentElement: {
          value: function (p, y) {
            if (y.nodeType !== o.ELEMENT_NODE)
              throw new TypeError("not an element");
            return (
              (p = r.toASCIILowerCase(String(p))), this._insertAdjacent(p, y)
            );
          },
        },
        insertAdjacentText: {
          value: function (p, y) {
            var C = this.ownerDocument.createTextNode(y);
            (p = r.toASCIILowerCase(String(p))), this._insertAdjacent(p, C);
          },
        },
        insertAdjacentHTML: {
          value: function (p, y) {
            (p = r.toASCIILowerCase(String(p))), (y = String(y));
            var C;
            switch (p) {
              case "beforebegin":
              case "afterend":
                (C = this.parentNode),
                  (C === null || C.nodeType === o.DOCUMENT_NODE) &&
                    r.NoModificationAllowedError();
                break;
              case "afterbegin":
              case "beforeend":
                C = this;
                break;
              default:
                r.SyntaxError();
            }
            (!(C instanceof D) ||
              (C.ownerDocument.isHTML &&
                C.localName === "html" &&
                C.namespaceURI === i.HTML)) &&
              (C = C.ownerDocument.createElementNS(i.HTML, "body"));
            var R = this.ownerDocument.implementation.mozHTMLParser(
              this.ownerDocument._address,
              C,
            );
            R.parse(y, !0), this._insertAdjacent(p, R._asDocumentFragment());
          },
        },
        children: {
          get: function () {
            return (
              this._children || (this._children = new te(this)), this._children
            );
          },
        },
        attributes: {
          get: function () {
            return (
              this._attributes || (this._attributes = new b(this)),
              this._attributes
            );
          },
        },
        firstElementChild: {
          get: function () {
            for (var m = this.firstChild; m !== null; m = m.nextSibling)
              if (m.nodeType === o.ELEMENT_NODE) return m;
            return null;
          },
        },
        lastElementChild: {
          get: function () {
            for (var m = this.lastChild; m !== null; m = m.previousSibling)
              if (m.nodeType === o.ELEMENT_NODE) return m;
            return null;
          },
        },
        childElementCount: {
          get: function () {
            return this.children.length;
          },
        },
        nextElement: {
          value: function (m) {
            m || (m = this.ownerDocument.documentElement);
            var p = this.firstElementChild;
            if (!p) {
              if (this === m) return null;
              p = this.nextElementSibling;
            }
            if (p) return p;
            for (var y = this.parentElement; y && y !== m; y = y.parentElement)
              if (((p = y.nextElementSibling), p)) return p;
            return null;
          },
        },
        getElementsByTagName: {
          value: function (p) {
            var y;
            return p
              ? (p === "*"
                  ? (y = function () {
                      return !0;
                    })
                  : this.isHTML
                    ? (y = q(p))
                    : (y = me(p)),
                new l(this, y))
              : new a();
          },
        },
        getElementsByTagNameNS: {
          value: function (p, y) {
            var C;
            return (
              p === "*" && y === "*"
                ? (C = function () {
                    return !0;
                  })
                : p === "*"
                  ? (C = me(y))
                  : y === "*"
                    ? (C = x(p))
                    : (C = F(p, y)),
              new l(this, C)
            );
          },
        },
        getElementsByClassName: {
          value: function (p) {
            if (((p = String(p).trim()), p === "")) {
              var y = new a();
              return y;
            }
            return (p = p.split(/[ \t\r\n\f]+/)), new l(this, Z(p));
          },
        },
        getElementsByName: {
          value: function (p) {
            return new l(this, v(String(p)));
          },
        },
        clone: {
          value: function () {
            var p;
            this.namespaceURI !== i.HTML ||
            this.prefix ||
            !this.ownerDocument.isHTML
              ? (p = this.ownerDocument.createElementNS(
                  this.namespaceURI,
                  this.prefix !== null
                    ? this.prefix + ":" + this.localName
                    : this.localName,
                ))
              : (p = this.ownerDocument.createElement(this.localName));
            for (var y = 0, C = this._attrKeys.length; y < C; y++) {
              var R = this._attrKeys[y],
                V = this._attrsByLName[R],
                Q = V.cloneNode();
              Q._setOwnerElement(p), (p._attrsByLName[R] = Q), p._addQName(Q);
            }
            return (p._attrKeys = this._attrKeys.concat()), p;
          },
        },
        isEqual: {
          value: function (p) {
            if (
              this.localName !== p.localName ||
              this.namespaceURI !== p.namespaceURI ||
              this.prefix !== p.prefix ||
              this._numattrs !== p._numattrs
            )
              return !1;
            for (var y = 0, C = this._numattrs; y < C; y++) {
              var R = this._attr(y);
              if (
                !p.hasAttributeNS(R.namespaceURI, R.localName) ||
                p.getAttributeNS(R.namespaceURI, R.localName) !== R.value
              )
                return !1;
            }
            return !0;
          },
        },
        _lookupNamespacePrefix: {
          value: function (p, y) {
            if (
              this.namespaceURI &&
              this.namespaceURI === p &&
              this.prefix !== null &&
              y.lookupNamespaceURI(this.prefix) === p
            )
              return this.prefix;
            for (var C = 0, R = this._numattrs; C < R; C++) {
              var V = this._attr(C);
              if (
                V.prefix === "xmlns" &&
                V.value === p &&
                y.lookupNamespaceURI(V.localName) === p
              )
                return V.localName;
            }
            var Q = this.parentElement;
            return Q ? Q._lookupNamespacePrefix(p, y) : null;
          },
        },
        lookupNamespaceURI: {
          value: function (p) {
            if (
              ((p === "" || p === void 0) && (p = null),
              this.namespaceURI !== null && this.prefix === p)
            )
              return this.namespaceURI;
            for (var y = 0, C = this._numattrs; y < C; y++) {
              var R = this._attr(y);
              if (
                R.namespaceURI === i.XMLNS &&
                ((R.prefix === "xmlns" && R.localName === p) ||
                  (p === null && R.prefix === null && R.localName === "xmlns"))
              )
                return R.value || null;
            }
            var V = this.parentElement;
            return V ? V.lookupNamespaceURI(p) : null;
          },
        },
        getAttribute: {
          value: function (p) {
            var y = this.getAttributeNode(p);
            return y ? y.value : null;
          },
        },
        getAttributeNS: {
          value: function (p, y) {
            var C = this.getAttributeNodeNS(p, y);
            return C ? C.value : null;
          },
        },
        getAttributeNode: {
          value: function (p) {
            (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var y = this._attrsByQName[p];
            return y ? (Array.isArray(y) && (y = y[0]), y) : null;
          },
        },
        getAttributeNodeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var C = this._attrsByLName[p + "|" + y];
            return C || null;
          },
        },
        hasAttribute: {
          value: function (p) {
            return (
              (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p)),
              this._attrsByQName[p] !== void 0
            );
          },
        },
        hasAttributeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var C = p + "|" + y;
            return this._attrsByLName[C] !== void 0;
          },
        },
        hasAttributes: {
          value: function () {
            return this._numattrs > 0;
          },
        },
        toggleAttribute: {
          value: function (p, y) {
            (p = String(p)),
              n.isValidName(p) || r.InvalidCharacterError(),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var C = this._attrsByQName[p];
            return C === void 0
              ? y === void 0 || y === !0
                ? (this._setAttribute(p, ""), !0)
                : !1
              : y === void 0 || y === !1
                ? (this.removeAttribute(p), !1)
                : !0;
          },
        },
        _setAttribute: {
          value: function (p, y) {
            var C = this._attrsByQName[p],
              R;
            C
              ? Array.isArray(C) && (C = C[0])
              : ((C = this._newattr(p)), (R = !0)),
              (C.value = y),
              this._attributes && (this._attributes[p] = C),
              R && this._newattrhook && this._newattrhook(p, y);
          },
        },
        setAttribute: {
          value: function (p, y) {
            (p = String(p)),
              n.isValidName(p) || r.InvalidCharacterError(),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p)),
              this._setAttribute(p, String(y));
          },
        },
        _setAttributeNS: {
          value: function (p, y, C) {
            var R = y.indexOf(":"),
              V,
              Q;
            R < 0
              ? ((V = null), (Q = y))
              : ((V = y.substring(0, R)), (Q = y.substring(R + 1))),
              (p === "" || p === void 0) && (p = null);
            var he = (p === null ? "" : p) + "|" + Q,
              T = this._attrsByLName[he],
              O;
            T ||
              ((T = new I(this, Q, V, p)),
              (O = !0),
              (this._attrsByLName[he] = T),
              this._attributes && (this._attributes[this._attrKeys.length] = T),
              this._attrKeys.push(he),
              this._addQName(T)),
              (T.value = C),
              O && this._newattrhook && this._newattrhook(y, C);
          },
        },
        setAttributeNS: {
          value: function (p, y, C) {
            (p = p == null || p === "" ? null : String(p)),
              (y = String(y)),
              n.isValidQName(y) || r.InvalidCharacterError();
            var R = y.indexOf(":"),
              V = R < 0 ? null : y.substring(0, R);
            ((V !== null && p === null) ||
              (V === "xml" && p !== i.XML) ||
              ((y === "xmlns" || V === "xmlns") && p !== i.XMLNS) ||
              (p === i.XMLNS && !(y === "xmlns" || V === "xmlns"))) &&
              r.NamespaceError(),
              this._setAttributeNS(p, y, String(C));
          },
        },
        setAttributeNode: {
          value: function (p) {
            if (p.ownerElement !== null && p.ownerElement !== this)
              throw new u(u.INUSE_ATTRIBUTE_ERR);
            var y = null,
              C = this._attrsByQName[p.name];
            if (C) {
              if (
                (Array.isArray(C) || (C = [C]),
                C.some(function (R) {
                  return R === p;
                }))
              )
                return p;
              if (p.ownerElement !== null) throw new u(u.INUSE_ATTRIBUTE_ERR);
              C.forEach(function (R) {
                this.removeAttributeNode(R);
              }, this),
                (y = C[0]);
            }
            return this.setAttributeNodeNS(p), y;
          },
        },
        setAttributeNodeNS: {
          value: function (p) {
            if (p.ownerElement !== null) throw new u(u.INUSE_ATTRIBUTE_ERR);
            var y = p.namespaceURI,
              C = (y === null ? "" : y) + "|" + p.localName,
              R = this._attrsByLName[C];
            return (
              R && this.removeAttributeNode(R),
              p._setOwnerElement(this),
              (this._attrsByLName[C] = p),
              this._attributes && (this._attributes[this._attrKeys.length] = p),
              this._attrKeys.push(C),
              this._addQName(p),
              this._newattrhook && this._newattrhook(p.name, p.value),
              R || null
            );
          },
        },
        removeAttribute: {
          value: function (p) {
            (p = String(p)),
              /[A-Z]/.test(p) && this.isHTML && (p = r.toASCIILowerCase(p));
            var y = this._attrsByQName[p];
            if (y) {
              Array.isArray(y)
                ? y.length > 2
                  ? (y = y.shift())
                  : ((this._attrsByQName[p] = y[1]), (y = y[0]))
                : (this._attrsByQName[p] = void 0);
              var C = y.namespaceURI,
                R = (C === null ? "" : C) + "|" + y.localName;
              this._attrsByLName[R] = void 0;
              var V = this._attrKeys.indexOf(R);
              this._attributes &&
                (Array.prototype.splice.call(this._attributes, V, 1),
                (this._attributes[p] = void 0)),
                this._attrKeys.splice(V, 1);
              var Q = y.onchange;
              y._setOwnerElement(null),
                Q && Q.call(y, this, y.localName, y.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(y);
            }
          },
        },
        removeAttributeNS: {
          value: function (p, y) {
            (p = p == null ? "" : String(p)), (y = String(y));
            var C = p + "|" + y,
              R = this._attrsByLName[C];
            if (R) {
              this._attrsByLName[C] = void 0;
              var V = this._attrKeys.indexOf(C);
              this._attributes &&
                Array.prototype.splice.call(this._attributes, V, 1),
                this._attrKeys.splice(V, 1),
                this._removeQName(R);
              var Q = R.onchange;
              R._setOwnerElement(null),
                Q && Q.call(R, this, R.localName, R.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(R);
            }
          },
        },
        removeAttributeNode: {
          value: function (p) {
            var y = p.namespaceURI,
              C = (y === null ? "" : y) + "|" + p.localName;
            return (
              this._attrsByLName[C] !== p && r.NotFoundError(),
              this.removeAttributeNS(y, p.localName),
              p
            );
          },
        },
        getAttributeNames: {
          value: function () {
            var p = this;
            return this._attrKeys.map(function (y) {
              return p._attrsByLName[y].name;
            });
          },
        },
        _getattr: {
          value: function (p) {
            var y = this._attrsByQName[p];
            return y ? y.value : null;
          },
        },
        _setattr: {
          value: function (p, y) {
            var C = this._attrsByQName[p],
              R;
            C || ((C = this._newattr(p)), (R = !0)),
              (C.value = String(y)),
              this._attributes && (this._attributes[p] = C),
              R && this._newattrhook && this._newattrhook(p, y);
          },
        },
        _newattr: {
          value: function (p) {
            var y = new I(this, p, null, null),
              C = "|" + p;
            return (
              (this._attrsByQName[p] = y),
              (this._attrsByLName[C] = y),
              this._attributes && (this._attributes[this._attrKeys.length] = y),
              this._attrKeys.push(C),
              y
            );
          },
        },
        _addQName: {
          value: function (m) {
            var p = m.name,
              y = this._attrsByQName[p];
            y
              ? Array.isArray(y)
                ? y.push(m)
                : (this._attrsByQName[p] = [y, m])
              : (this._attrsByQName[p] = m),
              this._attributes && (this._attributes[p] = m);
          },
        },
        _removeQName: {
          value: function (m) {
            var p = m.name,
              y = this._attrsByQName[p];
            if (Array.isArray(y)) {
              var C = y.indexOf(m);
              r.assert(C !== -1),
                y.length === 2
                  ? ((this._attrsByQName[p] = y[1 - C]),
                    this._attributes &&
                      (this._attributes[p] = this._attrsByQName[p]))
                  : (y.splice(C, 1),
                    this._attributes &&
                      this._attributes[p] === m &&
                      (this._attributes[p] = y[0]));
            } else
              r.assert(y === m),
                (this._attrsByQName[p] = void 0),
                this._attributes && (this._attributes[p] = void 0);
          },
        },
        _numattrs: {
          get: function () {
            return this._attrKeys.length;
          },
        },
        _attr: {
          value: function (m) {
            return this._attrsByLName[this._attrKeys[m]];
          },
        },
        id: s.property({ name: "id" }),
        className: s.property({ name: "class" }),
        classList: {
          get: function () {
            var m = this;
            if (this._classList) return this._classList;
            var p = new d(
              function () {
                return m.className || "";
              },
              function (y) {
                m.className = y;
              },
            );
            return (this._classList = p), p;
          },
          set: function (m) {
            this.className = m;
          },
        },
        matches: {
          value: function (m) {
            return g.matches(this, m);
          },
        },
        closest: {
          value: function (m) {
            var p = this;
            do {
              if (p.matches && p.matches(m)) return p;
              p = p.parentElement || p.parentNode;
            } while (p !== null && p.nodeType === o.ELEMENT_NODE);
            return null;
          },
        },
        querySelector: {
          value: function (m) {
            return g(m, this)[0];
          },
        },
        querySelectorAll: {
          value: function (m) {
            var p = g(m, this);
            return p.item ? p : new a(p);
          },
        },
      })),
        Object.defineProperties(D.prototype, S),
        Object.defineProperties(D.prototype, M),
        s.registerChangeHandler(D, "id", function (m, p, y, C) {
          m.rooted &&
            (y && m.ownerDocument.delId(y, m),
            C && m.ownerDocument.addId(C, m));
        }),
        s.registerChangeHandler(D, "class", function (m, p, y, C) {
          m._classList && m._classList._update();
        });
      function I(m, p, y, C, R) {
        (this.localName = p),
          (this.prefix = y === null || y === "" ? null : "" + y),
          (this.namespaceURI = C === null || C === "" ? null : "" + C),
          (this.data = R),
          this._setOwnerElement(m);
      }
      (I.prototype = Object.create(Object.prototype, {
        ownerElement: {
          get: function () {
            return this._ownerElement;
          },
        },
        _setOwnerElement: {
          value: function (p) {
            (this._ownerElement = p),
              this.prefix === null && this.namespaceURI === null && p
                ? (this.onchange = p._attributeChangeHandlers[this.localName])
                : (this.onchange = null);
          },
        },
        name: {
          get: function () {
            return this.prefix
              ? this.prefix + ":" + this.localName
              : this.localName;
          },
        },
        specified: {
          get: function () {
            return !0;
          },
        },
        value: {
          get: function () {
            return this.data;
          },
          set: function (m) {
            var p = this.data;
            (m = m === void 0 ? "" : m + ""),
              m !== p &&
                ((this.data = m),
                this.ownerElement &&
                  (this.onchange &&
                    this.onchange(this.ownerElement, this.localName, p, m),
                  this.ownerElement.rooted &&
                    this.ownerElement.ownerDocument.mutateAttr(this, p)));
          },
        },
        cloneNode: {
          value: function (p) {
            return new I(
              null,
              this.localName,
              this.prefix,
              this.namespaceURI,
              this.data,
            );
          },
        },
        nodeType: {
          get: function () {
            return o.ATTRIBUTE_NODE;
          },
        },
        nodeName: {
          get: function () {
            return this.name;
          },
        },
        nodeValue: {
          get: function () {
            return this.value;
          },
          set: function (m) {
            this.value = m;
          },
        },
        textContent: {
          get: function () {
            return this.value;
          },
          set: function (m) {
            m == null && (m = ""), (this.value = m);
          },
        },
        innerText: {
          get: function () {
            return this.value;
          },
          set: function (m) {
            m == null && (m = ""), (this.value = m);
          },
        },
      })),
        (D._Attr = I);
      function b(m) {
        H.call(this, m);
        for (var p in m._attrsByQName) this[p] = m._attrsByQName[p];
        for (var y = 0; y < m._attrKeys.length; y++)
          this[y] = m._attrsByLName[m._attrKeys[y]];
      }
      b.prototype = Object.create(H.prototype, {
        length: {
          get: function () {
            return this.element._attrKeys.length;
          },
          set: function () {},
        },
        item: {
          value: function (m) {
            return (
              (m = m >>> 0),
              m >= this.length
                ? null
                : this.element._attrsByLName[this.element._attrKeys[m]]
            );
          },
        },
      });
      var ee;
      (ee = globalThis.Symbol) != null &&
        ee.iterator &&
        (b.prototype[globalThis.Symbol.iterator] = function () {
          var m = 0,
            p = this.length,
            y = this;
          return {
            next: function () {
              return m < p ? { value: y.item(m++) } : { done: !0 };
            },
          };
        });
      function te(m) {
        (this.element = m), this.updateCache();
      }
      te.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return this.updateCache(), this.childrenByNumber.length;
          },
        },
        item: {
          value: function (p) {
            return this.updateCache(), this.childrenByNumber[p] || null;
          },
        },
        namedItem: {
          value: function (p) {
            return this.updateCache(), this.childrenByName[p] || null;
          },
        },
        namedItems: {
          get: function () {
            return this.updateCache(), this.childrenByName;
          },
        },
        updateCache: {
          value: function () {
            var p =
              /^(a|applet|area|embed|form|frame|frameset|iframe|img|object)$/;
            if (this.lastModTime !== this.element.lastModTime) {
              this.lastModTime = this.element.lastModTime;
              for (
                var y =
                    (this.childrenByNumber && this.childrenByNumber.length) ||
                    0,
                  C = 0;
                C < y;
                C++
              )
                this[C] = void 0;
              (this.childrenByNumber = []),
                (this.childrenByName = Object.create(null));
              for (
                var R = this.element.firstChild;
                R !== null;
                R = R.nextSibling
              )
                if (R.nodeType === o.ELEMENT_NODE) {
                  (this[this.childrenByNumber.length] = R),
                    this.childrenByNumber.push(R);
                  var V = R.getAttribute("id");
                  V && !this.childrenByName[V] && (this.childrenByName[V] = R);
                  var Q = R.getAttribute("name");
                  Q &&
                    this.element.namespaceURI === i.HTML &&
                    p.test(this.element.localName) &&
                    !this.childrenByName[Q] &&
                    (this.childrenByName[V] = R);
                }
            }
          },
        },
      });
      function me(m) {
        return function (p) {
          return p.localName === m;
        };
      }
      function q(m) {
        var p = r.toASCIILowerCase(m);
        return p === m
          ? me(m)
          : function (y) {
              return y.isHTML ? y.localName === p : y.localName === m;
            };
      }
      function x(m) {
        return function (p) {
          return p.namespaceURI === m;
        };
      }
      function F(m, p) {
        return function (y) {
          return y.namespaceURI === m && y.localName === p;
        };
      }
      function Z(m) {
        return function (p) {
          return m.every(function (y) {
            return p.classList.contains(y);
          });
        };
      }
      function v(m) {
        return function (p) {
          return p.namespaceURI !== i.HTML ? !1 : p.getAttribute("name") === m;
        };
      }
    },
  }),
  ub = oe({
    "external/npm/node_modules/domino/lib/Leaf.js"(e, t) {
      "use strict";
      t.exports = a;
      var n = gt(),
        r = Bi(),
        i = nt(),
        s = i.HierarchyRequestError,
        o = i.NotFoundError;
      function a() {
        n.call(this);
      }
      a.prototype = Object.create(n.prototype, {
        hasChildNodes: {
          value: function () {
            return !1;
          },
        },
        firstChild: { value: null },
        lastChild: { value: null },
        insertBefore: {
          value: function (c, l) {
            if (!c.nodeType) throw new TypeError("not a node");
            s();
          },
        },
        replaceChild: {
          value: function (c, l) {
            if (!c.nodeType) throw new TypeError("not a node");
            s();
          },
        },
        removeChild: {
          value: function (c) {
            if (!c.nodeType) throw new TypeError("not a node");
            o();
          },
        },
        removeChildren: { value: function () {} },
        childNodes: {
          get: function () {
            return (
              this._childNodes || (this._childNodes = new r()), this._childNodes
            );
          },
        },
      });
    },
  }),
  al = oe({
    "external/npm/node_modules/domino/lib/CharacterData.js"(e, t) {
      "use strict";
      t.exports = o;
      var n = ub(),
        r = nt(),
        i = yh(),
        s = cb();
      function o() {
        n.call(this);
      }
      (o.prototype = Object.create(n.prototype, {
        substringData: {
          value: function (c, l) {
            if (arguments.length < 2)
              throw new TypeError("Not enough arguments");
            return (
              (c = c >>> 0),
              (l = l >>> 0),
              (c > this.data.length || c < 0 || l < 0) && r.IndexSizeError(),
              this.data.substring(c, c + l)
            );
          },
        },
        appendData: {
          value: function (c) {
            if (arguments.length < 1)
              throw new TypeError("Not enough arguments");
            this.data += String(c);
          },
        },
        insertData: {
          value: function (c, l) {
            return this.replaceData(c, 0, l);
          },
        },
        deleteData: {
          value: function (c, l) {
            return this.replaceData(c, l, "");
          },
        },
        replaceData: {
          value: function (c, l, u) {
            var d = this.data,
              g = d.length;
            (c = c >>> 0),
              (l = l >>> 0),
              (u = String(u)),
              (c > g || c < 0) && r.IndexSizeError(),
              c + l > g && (l = g - c);
            var E = d.substring(0, c),
              S = d.substring(c + l);
            this.data = E + u + S;
          },
        },
        isEqual: {
          value: function (c) {
            return this._data === c._data;
          },
        },
        length: {
          get: function () {
            return this.data.length;
          },
        },
      })),
        Object.defineProperties(o.prototype, i),
        Object.defineProperties(o.prototype, s);
    },
  }),
  db = oe({
    "external/npm/node_modules/domino/lib/Text.js"(e, t) {
      "use strict";
      t.exports = s;
      var n = nt(),
        r = gt(),
        i = al();
      function s(a, c) {
        i.call(this),
          (this.nodeType = r.TEXT_NODE),
          (this.ownerDocument = a),
          (this._data = c),
          (this._index = void 0);
      }
      var o = {
        get: function () {
          return this._data;
        },
        set: function (a) {
          a == null ? (a = "") : (a = String(a)),
            a !== this._data &&
              ((this._data = a),
              this.rooted && this.ownerDocument.mutateValue(this),
              this.parentNode &&
                this.parentNode._textchangehook &&
                this.parentNode._textchangehook(this));
        },
      };
      s.prototype = Object.create(i.prototype, {
        nodeName: { value: "#text" },
        nodeValue: o,
        textContent: o,
        innerText: o,
        data: {
          get: o.get,
          set: function (a) {
            o.set.call(this, a === null ? "" : String(a));
          },
        },
        splitText: {
          value: function (c) {
            (c > this._data.length || c < 0) && n.IndexSizeError();
            var l = this._data.substring(c),
              u = this.ownerDocument.createTextNode(l);
            this.data = this.data.substring(0, c);
            var d = this.parentNode;
            return d !== null && d.insertBefore(u, this.nextSibling), u;
          },
        },
        wholeText: {
          get: function () {
            for (
              var c = this.textContent, l = this.nextSibling;
              l && l.nodeType === r.TEXT_NODE;
              l = l.nextSibling
            )
              c += l.textContent;
            return c;
          },
        },
        replaceWholeText: { value: n.nyi },
        clone: {
          value: function () {
            return new s(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  fb = oe({
    "external/npm/node_modules/domino/lib/Comment.js"(e, t) {
      "use strict";
      t.exports = i;
      var n = gt(),
        r = al();
      function i(o, a) {
        r.call(this),
          (this.nodeType = n.COMMENT_NODE),
          (this.ownerDocument = o),
          (this._data = a);
      }
      var s = {
        get: function () {
          return this._data;
        },
        set: function (o) {
          o == null ? (o = "") : (o = String(o)),
            (this._data = o),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      i.prototype = Object.create(r.prototype, {
        nodeName: { value: "#comment" },
        nodeValue: s,
        textContent: s,
        innerText: s,
        data: {
          get: s.get,
          set: function (o) {
            s.set.call(this, o === null ? "" : String(o));
          },
        },
        clone: {
          value: function () {
            return new i(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  hb = oe({
    "external/npm/node_modules/domino/lib/DocumentFragment.js"(e, t) {
      "use strict";
      t.exports = c;
      var n = gt(),
        r = Bi(),
        i = ph(),
        s = ao(),
        o = gh(),
        a = nt();
      function c(l) {
        i.call(this),
          (this.nodeType = n.DOCUMENT_FRAGMENT_NODE),
          (this.ownerDocument = l);
      }
      c.prototype = Object.create(i.prototype, {
        nodeName: { value: "#document-fragment" },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        textContent: Object.getOwnPropertyDescriptor(
          s.prototype,
          "textContent",
        ),
        innerText: Object.getOwnPropertyDescriptor(s.prototype, "innerText"),
        querySelector: {
          value: function (l) {
            var u = this.querySelectorAll(l);
            return u.length ? u[0] : null;
          },
        },
        querySelectorAll: {
          value: function (l) {
            var u = Object.create(this);
            (u.isHTML = !0),
              (u.getElementsByTagName = s.prototype.getElementsByTagName),
              (u.nextElement = Object.getOwnPropertyDescriptor(
                s.prototype,
                "firstElementChild",
              ).get);
            var d = o(l, u);
            return d.item ? d : new r(d);
          },
        },
        clone: {
          value: function () {
            return new c(this.ownerDocument);
          },
        },
        isEqual: {
          value: function (u) {
            return !0;
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: a.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: a.nyi,
        },
      });
    },
  }),
  pb = oe({
    "external/npm/node_modules/domino/lib/ProcessingInstruction.js"(e, t) {
      "use strict";
      t.exports = i;
      var n = gt(),
        r = al();
      function i(o, a, c) {
        r.call(this),
          (this.nodeType = n.PROCESSING_INSTRUCTION_NODE),
          (this.ownerDocument = o),
          (this.target = a),
          (this._data = c);
      }
      var s = {
        get: function () {
          return this._data;
        },
        set: function (o) {
          o == null ? (o = "") : (o = String(o)),
            (this._data = o),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      i.prototype = Object.create(r.prototype, {
        nodeName: {
          get: function () {
            return this.target;
          },
        },
        nodeValue: s,
        textContent: s,
        innerText: s,
        data: {
          get: s.get,
          set: function (o) {
            s.set.call(this, o === null ? "" : String(o));
          },
        },
        clone: {
          value: function () {
            return new i(this.ownerDocument, this.target, this._data);
          },
        },
        isEqual: {
          value: function (a) {
            return this.target === a.target && this._data === a._data;
          },
        },
      });
    },
  }),
  cl = oe({
    "external/npm/node_modules/domino/lib/NodeFilter.js"(e, t) {
      "use strict";
      var n = {
        FILTER_ACCEPT: 1,
        FILTER_REJECT: 2,
        FILTER_SKIP: 3,
        SHOW_ALL: 4294967295,
        SHOW_ELEMENT: 1,
        SHOW_ATTRIBUTE: 2,
        SHOW_TEXT: 4,
        SHOW_CDATA_SECTION: 8,
        SHOW_ENTITY_REFERENCE: 16,
        SHOW_ENTITY: 32,
        SHOW_PROCESSING_INSTRUCTION: 64,
        SHOW_COMMENT: 128,
        SHOW_DOCUMENT: 256,
        SHOW_DOCUMENT_TYPE: 512,
        SHOW_DOCUMENT_FRAGMENT: 1024,
        SHOW_NOTATION: 2048,
      };
      t.exports = n.constructor = n.prototype = n;
    },
  }),
  mb = oe({
    "external/npm/node_modules/domino/lib/NodeTraversal.js"(e, t) {
      "use strict";
      var n = (t.exports = {
        nextSkippingChildren: r,
        nextAncestorSibling: i,
        next: s,
        previous: a,
        deepLastChild: o,
      });
      function r(c, l) {
        return c === l
          ? null
          : c.nextSibling !== null
            ? c.nextSibling
            : i(c, l);
      }
      function i(c, l) {
        for (c = c.parentNode; c !== null; c = c.parentNode) {
          if (c === l) return null;
          if (c.nextSibling !== null) return c.nextSibling;
        }
        return null;
      }
      function s(c, l) {
        var u;
        return (
          (u = c.firstChild),
          u !== null
            ? u
            : c === l
              ? null
              : ((u = c.nextSibling), u !== null ? u : i(c, l))
        );
      }
      function o(c) {
        for (; c.lastChild; ) c = c.lastChild;
        return c;
      }
      function a(c, l) {
        var u;
        return (
          (u = c.previousSibling),
          u !== null ? o(u) : ((u = c.parentNode), u === l ? null : u)
        );
      }
    },
  }),
  YN = oe({
    "external/npm/node_modules/domino/lib/TreeWalker.js"(e, t) {
      "use strict";
      t.exports = u;
      var n = gt(),
        r = cl(),
        i = mb(),
        s = nt(),
        o = {
          first: "firstChild",
          last: "lastChild",
          next: "firstChild",
          previous: "lastChild",
        },
        a = {
          first: "nextSibling",
          last: "previousSibling",
          next: "nextSibling",
          previous: "previousSibling",
        };
      function c(d, g) {
        var E, S, M, H, L;
        for (S = d._currentNode[o[g]]; S !== null; ) {
          if (((H = d._internalFilter(S)), H === r.FILTER_ACCEPT))
            return (d._currentNode = S), S;
          if (H === r.FILTER_SKIP && ((E = S[o[g]]), E !== null)) {
            S = E;
            continue;
          }
          for (; S !== null; ) {
            if (((L = S[a[g]]), L !== null)) {
              S = L;
              break;
            }
            if (
              ((M = S.parentNode),
              M === null || M === d.root || M === d._currentNode)
            )
              return null;
            S = M;
          }
        }
        return null;
      }
      function l(d, g) {
        var E, S, M;
        if (((E = d._currentNode), E === d.root)) return null;
        for (;;) {
          for (M = E[a[g]]; M !== null; ) {
            if (((E = M), (S = d._internalFilter(E)), S === r.FILTER_ACCEPT))
              return (d._currentNode = E), E;
            (M = E[o[g]]),
              (S === r.FILTER_REJECT || M === null) && (M = E[a[g]]);
          }
          if (
            ((E = E.parentNode),
            E === null ||
              E === d.root ||
              d._internalFilter(E) === r.FILTER_ACCEPT)
          )
            return null;
        }
      }
      function u(d, g, E) {
        (!d || !d.nodeType) && s.NotSupportedError(),
          (this._root = d),
          (this._whatToShow = Number(g) || 0),
          (this._filter = E || null),
          (this._active = !1),
          (this._currentNode = d);
      }
      Object.defineProperties(u.prototype, {
        root: {
          get: function () {
            return this._root;
          },
        },
        whatToShow: {
          get: function () {
            return this._whatToShow;
          },
        },
        filter: {
          get: function () {
            return this._filter;
          },
        },
        currentNode: {
          get: function () {
            return this._currentNode;
          },
          set: function (g) {
            if (!(g instanceof n)) throw new TypeError("Not a Node");
            this._currentNode = g;
          },
        },
        _internalFilter: {
          value: function (g) {
            var E, S;
            if (
              (this._active && s.InvalidStateError(),
              !((1 << (g.nodeType - 1)) & this._whatToShow))
            )
              return r.FILTER_SKIP;
            if (((S = this._filter), S === null)) E = r.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof S == "function" ? (E = S(g)) : (E = S.acceptNode(g));
              } finally {
                this._active = !1;
              }
            }
            return +E;
          },
        },
        parentNode: {
          value: function () {
            for (var g = this._currentNode; g !== this.root; ) {
              if (((g = g.parentNode), g === null)) return null;
              if (this._internalFilter(g) === r.FILTER_ACCEPT)
                return (this._currentNode = g), g;
            }
            return null;
          },
        },
        firstChild: {
          value: function () {
            return c(this, "first");
          },
        },
        lastChild: {
          value: function () {
            return c(this, "last");
          },
        },
        previousSibling: {
          value: function () {
            return l(this, "previous");
          },
        },
        nextSibling: {
          value: function () {
            return l(this, "next");
          },
        },
        previousNode: {
          value: function () {
            var g, E, S, M;
            for (g = this._currentNode; g !== this._root; ) {
              for (S = g.previousSibling; S; S = g.previousSibling)
                if (
                  ((g = S),
                  (E = this._internalFilter(g)),
                  E !== r.FILTER_REJECT)
                ) {
                  for (
                    M = g.lastChild;
                    M &&
                    ((g = M),
                    (E = this._internalFilter(g)),
                    E !== r.FILTER_REJECT);
                    M = g.lastChild
                  );
                  if (E === r.FILTER_ACCEPT) return (this._currentNode = g), g;
                }
              if (g === this.root || g.parentNode === null) return null;
              if (
                ((g = g.parentNode),
                this._internalFilter(g) === r.FILTER_ACCEPT)
              )
                return (this._currentNode = g), g;
            }
            return null;
          },
        },
        nextNode: {
          value: function () {
            var g, E, S, M;
            (g = this._currentNode), (E = r.FILTER_ACCEPT);
            e: for (;;) {
              for (S = g.firstChild; S; S = g.firstChild) {
                if (
                  ((g = S),
                  (E = this._internalFilter(g)),
                  E === r.FILTER_ACCEPT)
                )
                  return (this._currentNode = g), g;
                if (E === r.FILTER_REJECT) break;
              }
              for (
                M = i.nextSkippingChildren(g, this.root);
                M;
                M = i.nextSkippingChildren(g, this.root)
              ) {
                if (
                  ((g = M),
                  (E = this._internalFilter(g)),
                  E === r.FILTER_ACCEPT)
                )
                  return (this._currentNode = g), g;
                if (E === r.FILTER_SKIP) continue e;
              }
              return null;
            }
          },
        },
        toString: {
          value: function () {
            return "[object TreeWalker]";
          },
        },
      });
    },
  }),
  ZN = oe({
    "external/npm/node_modules/domino/lib/NodeIterator.js"(e, t) {
      "use strict";
      t.exports = c;
      var n = cl(),
        r = mb(),
        i = nt();
      function s(l, u, d) {
        return d ? r.next(l, u) : l === u ? null : r.previous(l, null);
      }
      function o(l, u) {
        for (; u; u = u.parentNode) if (l === u) return !0;
        return !1;
      }
      function a(l, u) {
        var d, g;
        for (d = l._referenceNode, g = l._pointerBeforeReferenceNode; ; ) {
          if (g === u) g = !g;
          else if (((d = s(d, l._root, u)), d === null)) return null;
          var E = l._internalFilter(d);
          if (E === n.FILTER_ACCEPT) break;
        }
        return (l._referenceNode = d), (l._pointerBeforeReferenceNode = g), d;
      }
      function c(l, u, d) {
        (!l || !l.nodeType) && i.NotSupportedError(),
          (this._root = l),
          (this._referenceNode = l),
          (this._pointerBeforeReferenceNode = !0),
          (this._whatToShow = Number(u) || 0),
          (this._filter = d || null),
          (this._active = !1),
          l.doc._attachNodeIterator(this);
      }
      Object.defineProperties(c.prototype, {
        root: {
          get: function () {
            return this._root;
          },
        },
        referenceNode: {
          get: function () {
            return this._referenceNode;
          },
        },
        pointerBeforeReferenceNode: {
          get: function () {
            return this._pointerBeforeReferenceNode;
          },
        },
        whatToShow: {
          get: function () {
            return this._whatToShow;
          },
        },
        filter: {
          get: function () {
            return this._filter;
          },
        },
        _internalFilter: {
          value: function (u) {
            var d, g;
            if (
              (this._active && i.InvalidStateError(),
              !((1 << (u.nodeType - 1)) & this._whatToShow))
            )
              return n.FILTER_SKIP;
            if (((g = this._filter), g === null)) d = n.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof g == "function" ? (d = g(u)) : (d = g.acceptNode(u));
              } finally {
                this._active = !1;
              }
            }
            return +d;
          },
        },
        _preremove: {
          value: function (u) {
            if (!o(u, this._root) && o(u, this._referenceNode)) {
              if (this._pointerBeforeReferenceNode) {
                for (var d = u; d.lastChild; ) d = d.lastChild;
                if (((d = r.next(d, this.root)), d)) {
                  this._referenceNode = d;
                  return;
                }
                this._pointerBeforeReferenceNode = !1;
              }
              if (u.previousSibling === null)
                this._referenceNode = u.parentNode;
              else {
                this._referenceNode = u.previousSibling;
                var g;
                for (
                  g = this._referenceNode.lastChild;
                  g;
                  g = this._referenceNode.lastChild
                )
                  this._referenceNode = g;
              }
            }
          },
        },
        nextNode: {
          value: function () {
            return a(this, !0);
          },
        },
        previousNode: {
          value: function () {
            return a(this, !1);
          },
        },
        detach: { value: function () {} },
        toString: {
          value: function () {
            return "[object NodeIterator]";
          },
        },
      });
    },
  }),
  vh = oe({
    "external/npm/node_modules/domino/lib/URL.js"(e, t) {
      "use strict";
      t.exports = n;
      function n(r) {
        if (!r) return Object.create(n.prototype);
        this.url = r.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
        var i = n.pattern.exec(this.url);
        if (i) {
          if ((i[2] && (this.scheme = i[2]), i[4])) {
            var s = i[4].match(n.userinfoPattern);
            if (
              (s &&
                ((this.username = s[1]),
                (this.password = s[3]),
                (i[4] = i[4].substring(s[0].length))),
              i[4].match(n.portPattern))
            ) {
              var o = i[4].lastIndexOf(":");
              (this.host = i[4].substring(0, o)),
                (this.port = i[4].substring(o + 1));
            } else this.host = i[4];
          }
          i[5] && (this.path = i[5]),
            i[6] && (this.query = i[7]),
            i[8] && (this.fragment = i[9]);
        }
      }
      (n.pattern =
        /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/),
        (n.userinfoPattern = /^([^@:]*)(:([^@]*))?@/),
        (n.portPattern = /:\d+$/),
        (n.authorityPattern = /^[^:\/?#]+:\/\//),
        (n.hierarchyPattern = /^[^:\/?#]+:\//),
        (n.percentEncode = function (i) {
          var s = i.charCodeAt(0);
          if (s < 256) return "%" + s.toString(16);
          throw Error("can't percent-encode codepoints > 255 yet");
        }),
        (n.prototype = {
          constructor: n,
          isAbsolute: function () {
            return !!this.scheme;
          },
          isAuthorityBased: function () {
            return n.authorityPattern.test(this.url);
          },
          isHierarchical: function () {
            return n.hierarchyPattern.test(this.url);
          },
          toString: function () {
            var r = "";
            return (
              this.scheme !== void 0 && (r += this.scheme + ":"),
              this.isAbsolute() &&
                ((r += "//"),
                (this.username || this.password) &&
                  ((r += this.username || ""),
                  this.password && (r += ":" + this.password),
                  (r += "@")),
                this.host && (r += this.host)),
              this.port !== void 0 && (r += ":" + this.port),
              this.path !== void 0 && (r += this.path),
              this.query !== void 0 && (r += "?" + this.query),
              this.fragment !== void 0 && (r += "#" + this.fragment),
              r
            );
          },
          resolve: function (r) {
            var i = this,
              s = new n(r),
              o = new n();
            return (
              s.scheme !== void 0
                ? ((o.scheme = s.scheme),
                  (o.username = s.username),
                  (o.password = s.password),
                  (o.host = s.host),
                  (o.port = s.port),
                  (o.path = c(s.path)),
                  (o.query = s.query))
                : ((o.scheme = i.scheme),
                  s.host !== void 0
                    ? ((o.username = s.username),
                      (o.password = s.password),
                      (o.host = s.host),
                      (o.port = s.port),
                      (o.path = c(s.path)),
                      (o.query = s.query))
                    : ((o.username = i.username),
                      (o.password = i.password),
                      (o.host = i.host),
                      (o.port = i.port),
                      s.path
                        ? (s.path.charAt(0) === "/"
                            ? (o.path = c(s.path))
                            : ((o.path = a(i.path, s.path)),
                              (o.path = c(o.path))),
                          (o.query = s.query))
                        : ((o.path = i.path),
                          s.query !== void 0
                            ? (o.query = s.query)
                            : (o.query = i.query)))),
              (o.fragment = s.fragment),
              o.toString()
            );
            function a(l, u) {
              if (i.host !== void 0 && !i.path) return "/" + u;
              var d = l.lastIndexOf("/");
              return d === -1 ? u : l.substring(0, d + 1) + u;
            }
            function c(l) {
              if (!l) return l;
              for (var u = ""; l.length > 0; ) {
                if (l === "." || l === "..") {
                  l = "";
                  break;
                }
                var d = l.substring(0, 2),
                  g = l.substring(0, 3),
                  E = l.substring(0, 4);
                if (g === "../") l = l.substring(3);
                else if (d === "./") l = l.substring(2);
                else if (g === "/./") l = "/" + l.substring(3);
                else if (d === "/." && l.length === 2) l = "/";
                else if (E === "/../" || (g === "/.." && l.length === 3))
                  (l = "/" + l.substring(4)), (u = u.replace(/\/?[^\/]*$/, ""));
                else {
                  var S = l.match(/(\/?([^\/]*))/)[0];
                  (u += S), (l = l.substring(S.length));
                }
              }
              return u;
            }
          },
        });
    },
  }),
  XN = oe({
    "external/npm/node_modules/domino/lib/CustomEvent.js"(e, t) {
      "use strict";
      t.exports = r;
      var n = oo();
      function r(i, s) {
        n.call(this, i, s);
      }
      r.prototype = Object.create(n.prototype, { constructor: { value: r } });
    },
  }),
  gb = oe({
    "external/npm/node_modules/domino/lib/events.js"(e, t) {
      "use strict";
      t.exports = {
        Event: oo(),
        UIEvent: tb(),
        MouseEvent: nb(),
        CustomEvent: XN(),
      };
    },
  }),
  JN = oe({
    "external/npm/node_modules/domino/lib/style_parser.js"(e) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.hyphenate = e.parse = void 0);
      function t(r) {
        let i = [],
          s = 0,
          o = 0,
          a = 0,
          c = 0,
          l = 0,
          u = null;
        for (; s < r.length; )
          switch (r.charCodeAt(s++)) {
            case 40:
              o++;
              break;
            case 41:
              o--;
              break;
            case 39:
              a === 0
                ? (a = 39)
                : a === 39 && r.charCodeAt(s - 1) !== 92 && (a = 0);
              break;
            case 34:
              a === 0
                ? (a = 34)
                : a === 34 && r.charCodeAt(s - 1) !== 92 && (a = 0);
              break;
            case 58:
              !u &&
                o === 0 &&
                a === 0 &&
                ((u = n(r.substring(l, s - 1).trim())), (c = s));
              break;
            case 59:
              if (u && c > 0 && o === 0 && a === 0) {
                let g = r.substring(c, s - 1).trim();
                i.push(u, g), (l = s), (c = 0), (u = null);
              }
              break;
          }
        if (u && c) {
          let d = r.slice(c).trim();
          i.push(u, d);
        }
        return i;
      }
      e.parse = t;
      function n(r) {
        return r
          .replace(/[a-z][A-Z]/g, (i) => i.charAt(0) + "-" + i.charAt(1))
          .toLowerCase();
      }
      e.hyphenate = n;
    },
  }),
  Eh = oe({
    "external/npm/node_modules/domino/lib/CSSStyleDeclaration.js"(e, t) {
      "use strict";
      var { parse: n } = JN();
      t.exports = function (c) {
        let l = new i(c),
          u = {
            get: function (d, g) {
              return g in d ? d[g] : d.getPropertyValue(r(g));
            },
            has: function (d, g) {
              return !0;
            },
            set: function (d, g, E) {
              return g in d ? (d[g] = E) : d.setProperty(r(g), E ?? void 0), !0;
            },
          };
        return new Proxy(l, u);
      };
      function r(c) {
        return c.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      }
      function i(c) {
        this._element = c;
      }
      var s = "!important";
      function o(c) {
        let l = { property: {}, priority: {} };
        if (!c) return l;
        let u = n(c);
        if (u.length < 2) return l;
        for (let d = 0; d < u.length; d += 2) {
          let g = u[d],
            E = u[d + 1];
          E.endsWith(s) &&
            ((l.priority[g] = "important"), (E = E.slice(0, -s.length).trim())),
            (l.property[g] = E);
        }
        return l;
      }
      var a = {};
      i.prototype = Object.create(Object.prototype, {
        _parsed: {
          get: function () {
            if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
              var c = this.cssText;
              (this._parsedStyles = o(c)),
                (this._lastParsedText = c),
                delete this._names;
            }
            return this._parsedStyles;
          },
        },
        _serialize: {
          value: function () {
            var c = this._parsed,
              l = "";
            for (var u in c.property)
              l && (l += " "),
                (l += u + ": " + c.property[u]),
                c.priority[u] && (l += " !" + c.priority[u]),
                (l += ";");
            (this.cssText = l), (this._lastParsedText = l), delete this._names;
          },
        },
        cssText: {
          get: function () {
            return this._element.getAttribute("style");
          },
          set: function (c) {
            this._element.setAttribute("style", c);
          },
        },
        length: {
          get: function () {
            return (
              this._names ||
                (this._names = Object.getOwnPropertyNames(
                  this._parsed.property,
                )),
              this._names.length
            );
          },
        },
        item: {
          value: function (c) {
            return (
              this._names ||
                (this._names = Object.getOwnPropertyNames(
                  this._parsed.property,
                )),
              this._names[c]
            );
          },
        },
        getPropertyValue: {
          value: function (c) {
            return (c = c.toLowerCase()), this._parsed.property[c] || "";
          },
        },
        getPropertyPriority: {
          value: function (c) {
            return (c = c.toLowerCase()), this._parsed.priority[c] || "";
          },
        },
        setProperty: {
          value: function (c, l, u) {
            if (
              ((c = c.toLowerCase()),
              l == null && (l = ""),
              u == null && (u = ""),
              l !== a && (l = "" + l),
              (l = l.trim()),
              l === "")
            ) {
              this.removeProperty(c);
              return;
            }
            if (!(u !== "" && u !== a && !/^important$/i.test(u))) {
              var d = this._parsed;
              if (l === a) {
                if (!d.property[c]) return;
                u !== "" ? (d.priority[c] = "important") : delete d.priority[c];
              } else {
                if (l.includes(";") && !l.includes("data:")) return;
                var g = o(c + ":" + l);
                if (
                  Object.getOwnPropertyNames(g.property).length === 0 ||
                  Object.getOwnPropertyNames(g.priority).length !== 0
                )
                  return;
                for (var E in g.property)
                  (d.property[E] = g.property[E]),
                    u !== a &&
                      (u !== ""
                        ? (d.priority[E] = "important")
                        : d.priority[E] && delete d.priority[E]);
              }
              this._serialize();
            }
          },
        },
        setPropertyValue: {
          value: function (c, l) {
            return this.setProperty(c, l, a);
          },
        },
        setPropertyPriority: {
          value: function (c, l) {
            return this.setProperty(c, a, l);
          },
        },
        removeProperty: {
          value: function (c) {
            c = c.toLowerCase();
            var l = this._parsed;
            c in l.property &&
              (delete l.property[c], delete l.priority[c], this._serialize());
          },
        },
      });
    },
  }),
  yb = oe({
    "external/npm/node_modules/domino/lib/URLUtils.js"(e, t) {
      "use strict";
      var n = vh();
      t.exports = r;
      function r() {}
      (r.prototype = Object.create(Object.prototype, {
        _url: {
          get: function () {
            return new n(this.href);
          },
        },
        protocol: {
          get: function () {
            var i = this._url;
            return i && i.scheme ? i.scheme + ":" : ":";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              ((i = i.replace(/:+$/, "")),
              (i = i.replace(/[^-+\.a-zA-Z0-9]/g, n.percentEncode)),
              i.length > 0 && ((o.scheme = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        host: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased()
              ? i.host + (i.port ? ":" + i.port : "")
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = i.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                n.percentEncode,
              )),
              i.length > 0 &&
                ((o.host = i), delete o.port, (s = o.toString()))),
              (this.href = s);
          },
        },
        hostname: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased() ? i.host : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = i.replace(/^\/+/, "")),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                n.percentEncode,
              )),
              i.length > 0 && ((o.host = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        port: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isAuthorityBased() && i.port !== void 0
              ? i.port
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((i = "" + i),
              (i = i.replace(/[^0-9].*$/, "")),
              (i = i.replace(/^0+/, "")),
              i.length === 0 && (i = "0"),
              parseInt(i, 10) <= 65535 && ((o.port = i), (s = o.toString()))),
              (this.href = s);
          },
        },
        pathname: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isHierarchical() ? i.path : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isHierarchical() &&
              (i.charAt(0) !== "/" && (i = "/" + i),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g,
                n.percentEncode,
              )),
              (o.path = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        search: {
          get: function () {
            var i = this._url;
            return i.isAbsolute() && i.isHierarchical() && i.query !== void 0
              ? "?" + i.query
              : "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              o.isHierarchical() &&
              (i.charAt(0) === "?" && (i = i.substring(1)),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                n.percentEncode,
              )),
              (o.query = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        hash: {
          get: function () {
            var i = this._url;
            return i == null || i.fragment == null || i.fragment === ""
              ? ""
              : "#" + i.fragment;
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            i.charAt(0) === "#" && (i = i.substring(1)),
              (i = i.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                n.percentEncode,
              )),
              (o.fragment = i),
              (s = o.toString()),
              (this.href = s);
          },
        },
        username: {
          get: function () {
            var i = this._url;
            return i.username || "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              ((i = i.replace(
                /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g,
                n.percentEncode,
              )),
              (o.username = i),
              (s = o.toString())),
              (this.href = s);
          },
        },
        password: {
          get: function () {
            var i = this._url;
            return i.password || "";
          },
          set: function (i) {
            var s = this.href,
              o = new n(s);
            o.isAbsolute() &&
              (i === ""
                ? (o.password = null)
                : ((i = i.replace(
                    /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g,
                    n.percentEncode,
                  )),
                  (o.password = i)),
              (s = o.toString())),
              (this.href = s);
          },
        },
        origin: {
          get: function () {
            var i = this._url;
            if (i == null) return "";
            var s = function (o) {
              var a = [i.scheme, i.host, +i.port || o];
              return a[0] + "://" + a[1] + (a[2] === o ? "" : ":" + a[2]);
            };
            switch (i.scheme) {
              case "ftp":
                return s(21);
              case "gopher":
                return s(70);
              case "http":
              case "ws":
                return s(80);
              case "https":
              case "wss":
                return s(443);
              default:
                return i.scheme + "://";
            }
          },
        },
      })),
        (r._inherit = function (i) {
          Object.getOwnPropertyNames(r.prototype).forEach(function (s) {
            if (!(s === "constructor" || s === "href")) {
              var o = Object.getOwnPropertyDescriptor(r.prototype, s);
              Object.defineProperty(i, s, o);
            }
          });
        });
    },
  }),
  vb = oe({
    "external/npm/node_modules/domino/lib/defineElement.js"(e, t) {
      "use strict";
      var n = ob(),
        r = hh().isApiWritable;
      t.exports = function (a, c, l, u) {
        var d = a.ctor;
        if (d) {
          var g = a.props || {};
          if (a.attributes)
            for (var E in a.attributes) {
              var S = a.attributes[E];
              (typeof S != "object" || Array.isArray(S)) && (S = { type: S }),
                S.name || (S.name = E.toLowerCase()),
                (g[E] = n.property(S));
            }
          (g.constructor = { value: d, writable: r }),
            (d.prototype = Object.create((a.superclass || c).prototype, g)),
            a.events && o(d, a.events),
            (l[a.name] = d);
        } else d = c;
        return (
          (a.tags || (a.tag && [a.tag]) || []).forEach(function (M) {
            u[M] = d;
          }),
          d
        );
      };
      function i(a, c, l, u) {
        (this.body = a),
          (this.document = c),
          (this.form = l),
          (this.element = u);
      }
      i.prototype.build = function () {
        return () => {};
      };
      function s(a, c, l, u) {
        var d = a.ownerDocument || Object.create(null),
          g = a.form || Object.create(null);
        a[c] = new i(u, d, g, a).build();
      }
      function o(a, c) {
        var l = a.prototype;
        c.forEach(function (u) {
          Object.defineProperty(l, "on" + u, {
            get: function () {
              return this._getEventHandler(u);
            },
            set: function (d) {
              this._setEventHandler(u, d);
            },
          }),
            n.registerChangeHandler(a, "on" + u, s);
        });
      }
    },
  }),
  bh = oe({
    "external/npm/node_modules/domino/lib/htmlelts.js"(e) {
      "use strict";
      var t = gt(),
        n = ao(),
        r = Eh(),
        i = nt(),
        s = yb(),
        o = vb(),
        a = (e.elements = {}),
        c = Object.create(null);
      e.createElement = function (D, w, I) {
        var b = c[w] || H;
        return new b(D, w, I);
      };
      function l(D) {
        return o(D, M, a, c);
      }
      function u(D) {
        return {
          get: function () {
            var w = this._getattr(D);
            if (w === null) return "";
            var I = this.doc._resolve(w);
            return I === null ? w : I;
          },
          set: function (w) {
            this._setattr(D, w);
          },
        };
      }
      function d(D) {
        return {
          get: function () {
            var w = this._getattr(D);
            return w === null
              ? null
              : w.toLowerCase() === "use-credentials"
                ? "use-credentials"
                : "anonymous";
          },
          set: function (w) {
            w == null ? this.removeAttribute(D) : this._setattr(D, w);
          },
        };
      }
      var g = {
          type: [
            "",
            "no-referrer",
            "no-referrer-when-downgrade",
            "same-origin",
            "origin",
            "strict-origin",
            "origin-when-cross-origin",
            "strict-origin-when-cross-origin",
            "unsafe-url",
          ],
          missing: "",
        },
        E = {
          A: !0,
          LINK: !0,
          BUTTON: !0,
          INPUT: !0,
          SELECT: !0,
          TEXTAREA: !0,
          COMMAND: !0,
        },
        S = function (D, w, I) {
          M.call(this, D, w, I), (this._form = null);
        },
        M = (e.HTMLElement = l({
          superclass: n,
          name: "HTMLElement",
          ctor: function (w, I, b) {
            n.call(this, w, I, i.NAMESPACE.HTML, b);
          },
          props: {
            dangerouslySetInnerHTML: {
              set: function (D) {
                this._innerHTML = D;
              },
            },
            innerHTML: {
              get: function () {
                return this.serialize();
              },
              set: function (D) {
                var w = this.ownerDocument.implementation.mozHTMLParser(
                  this.ownerDocument._address,
                  this,
                );
                w.parse(D === null ? "" : String(D), !0);
                for (
                  var I = this instanceof c.template ? this.content : this;
                  I.hasChildNodes();

                )
                  I.removeChild(I.firstChild);
                I.appendChild(w._asDocumentFragment());
              },
            },
            style: {
              get: function () {
                return this._style || (this._style = new r(this)), this._style;
              },
              set: function (D) {
                D == null && (D = ""), this._setattr("style", String(D));
              },
            },
            blur: { value: function () {} },
            focus: { value: function () {} },
            forceSpellCheck: { value: function () {} },
            click: {
              value: function () {
                if (!this._click_in_progress) {
                  this._click_in_progress = !0;
                  try {
                    this._pre_click_activation_steps &&
                      this._pre_click_activation_steps();
                    var D = this.ownerDocument.createEvent("MouseEvent");
                    D.initMouseEvent(
                      "click",
                      !0,
                      !0,
                      this.ownerDocument.defaultView,
                      1,
                      0,
                      0,
                      0,
                      0,
                      !1,
                      !1,
                      !1,
                      !1,
                      0,
                      null,
                    );
                    var w = this.dispatchEvent(D);
                    w
                      ? this._post_click_activation_steps &&
                        this._post_click_activation_steps(D)
                      : this._cancelled_activation_steps &&
                        this._cancelled_activation_steps();
                  } finally {
                    this._click_in_progress = !1;
                  }
                }
              },
            },
            submit: { value: i.nyi },
          },
          attributes: {
            title: String,
            lang: String,
            dir: { type: ["ltr", "rtl", "auto"], missing: "" },
            draggable: { type: ["true", "false"], treatNullAsEmptyString: !0 },
            spellcheck: { type: ["true", "false"], missing: "" },
            enterKeyHint: {
              type: [
                "enter",
                "done",
                "go",
                "next",
                "previous",
                "search",
                "send",
              ],
              missing: "",
            },
            autoCapitalize: {
              type: ["off", "on", "none", "sentences", "words", "characters"],
              missing: "",
            },
            autoFocus: Boolean,
            accessKey: String,
            nonce: String,
            hidden: Boolean,
            translate: { type: ["no", "yes"], missing: "" },
            tabIndex: {
              type: "long",
              default: function () {
                return this.tagName in E || this.contentEditable ? 0 : -1;
              },
            },
          },
          events: [
            "abort",
            "canplay",
            "canplaythrough",
            "change",
            "click",
            "contextmenu",
            "cuechange",
            "dblclick",
            "drag",
            "dragend",
            "dragenter",
            "dragleave",
            "dragover",
            "dragstart",
            "drop",
            "durationchange",
            "emptied",
            "ended",
            "input",
            "invalid",
            "keydown",
            "keypress",
            "keyup",
            "loadeddata",
            "loadedmetadata",
            "loadstart",
            "mousedown",
            "mousemove",
            "mouseout",
            "mouseover",
            "mouseup",
            "mousewheel",
            "pause",
            "play",
            "playing",
            "progress",
            "ratechange",
            "readystatechange",
            "reset",
            "seeked",
            "seeking",
            "select",
            "show",
            "stalled",
            "submit",
            "suspend",
            "timeupdate",
            "volumechange",
            "waiting",
            "blur",
            "error",
            "focus",
            "load",
            "scroll",
          ],
        })),
        H = l({
          name: "HTMLUnknownElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
        }),
        L = {
          form: {
            get: function () {
              return this._form;
            },
          },
        };
      l({
        tag: "a",
        name: "HTMLAnchorElement",
        ctor: function (w, I, b) {
          M.call(this, w, I, b);
        },
        props: {
          _post_click_activation_steps: {
            value: function (D) {
              this.href &&
                (this.ownerDocument.defaultView.location = this.href);
            },
          },
        },
        attributes: {
          href: u,
          ping: String,
          download: String,
          target: String,
          rel: String,
          media: String,
          hreflang: String,
          type: String,
          referrerPolicy: g,
          coords: String,
          charset: String,
          name: String,
          rev: String,
          shape: String,
        },
      }),
        s._inherit(c.a.prototype),
        l({
          tag: "area",
          name: "HTMLAreaElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            alt: String,
            target: String,
            download: String,
            rel: String,
            media: String,
            href: u,
            hreflang: String,
            type: String,
            shape: String,
            coords: String,
            ping: String,
            referrerPolicy: g,
            noHref: Boolean,
          },
        }),
        s._inherit(c.area.prototype),
        l({
          tag: "br",
          name: "HTMLBRElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { clear: String },
        }),
        l({
          tag: "base",
          name: "HTMLBaseElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { target: String },
        }),
        l({
          tag: "body",
          name: "HTMLBodyElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          events: [
            "afterprint",
            "beforeprint",
            "beforeunload",
            "blur",
            "error",
            "focus",
            "hashchange",
            "load",
            "message",
            "offline",
            "online",
            "pagehide",
            "pageshow",
            "popstate",
            "resize",
            "scroll",
            "storage",
            "unload",
          ],
          attributes: {
            text: { type: String, treatNullAsEmptyString: !0 },
            link: { type: String, treatNullAsEmptyString: !0 },
            vLink: { type: String, treatNullAsEmptyString: !0 },
            aLink: { type: String, treatNullAsEmptyString: !0 },
            bgColor: { type: String, treatNullAsEmptyString: !0 },
            background: String,
          },
        }),
        l({
          tag: "button",
          name: "HTMLButtonElement",
          ctor: function (w, I, b) {
            S.call(this, w, I, b);
          },
          props: L,
          attributes: {
            name: String,
            value: String,
            disabled: Boolean,
            autofocus: Boolean,
            type: {
              type: ["submit", "reset", "button", "menu"],
              missing: "submit",
            },
            formTarget: String,
            formAction: u,
            formNoValidate: Boolean,
            formMethod: {
              type: ["get", "post", "dialog"],
              invalid: "get",
              missing: "",
            },
            formEnctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "",
            },
          },
        }),
        l({
          tag: "dl",
          name: "HTMLDListElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { compact: Boolean },
        }),
        l({
          tag: "data",
          name: "HTMLDataElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { value: String },
        }),
        l({
          tag: "datalist",
          name: "HTMLDataListElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
        }),
        l({
          tag: "details",
          name: "HTMLDetailsElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { open: Boolean },
        }),
        l({
          tag: "div",
          name: "HTMLDivElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { align: String },
        }),
        l({
          tag: "embed",
          name: "HTMLEmbedElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            src: u,
            type: String,
            width: String,
            height: String,
            align: String,
            name: String,
          },
        }),
        l({
          tag: "fieldset",
          name: "HTMLFieldSetElement",
          ctor: function (w, I, b) {
            S.call(this, w, I, b);
          },
          props: L,
          attributes: { disabled: Boolean, name: String },
        }),
        l({
          tag: "form",
          name: "HTMLFormElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            action: String,
            autocomplete: { type: ["on", "off"], missing: "on" },
            name: String,
            acceptCharset: { name: "accept-charset" },
            target: String,
            noValidate: Boolean,
            method: {
              type: ["get", "post", "dialog"],
              invalid: "get",
              missing: "get",
            },
            enctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "application/x-www-form-urlencoded",
            },
            encoding: {
              name: "enctype",
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "application/x-www-form-urlencoded",
            },
          },
        }),
        l({
          tag: "hr",
          name: "HTMLHRElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            align: String,
            color: String,
            noShade: Boolean,
            size: String,
            width: String,
          },
        }),
        l({
          tag: "head",
          name: "HTMLHeadElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
        }),
        l({
          tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
          name: "HTMLHeadingElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { align: String },
        }),
        l({
          tag: "html",
          name: "HTMLHtmlElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { xmlns: u, version: String },
        }),
        l({
          tag: "iframe",
          name: "HTMLIFrameElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            src: u,
            srcdoc: String,
            name: String,
            width: String,
            height: String,
            seamless: Boolean,
            allow: Boolean,
            allowFullscreen: Boolean,
            allowUserMedia: Boolean,
            allowPaymentRequest: Boolean,
            referrerPolicy: g,
            loading: { type: ["eager", "lazy"], treatNullAsEmptyString: !0 },
            align: String,
            scrolling: String,
            frameBorder: String,
            longDesc: u,
            marginHeight: { type: String, treatNullAsEmptyString: !0 },
            marginWidth: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "img",
          name: "HTMLImageElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            alt: String,
            src: u,
            srcset: String,
            crossOrigin: d,
            useMap: String,
            isMap: Boolean,
            sizes: String,
            height: { type: "unsigned long", default: 0 },
            width: { type: "unsigned long", default: 0 },
            referrerPolicy: g,
            loading: { type: ["eager", "lazy"], missing: "" },
            name: String,
            lowsrc: u,
            align: String,
            hspace: { type: "unsigned long", default: 0 },
            vspace: { type: "unsigned long", default: 0 },
            longDesc: u,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "input",
          name: "HTMLInputElement",
          ctor: function (w, I, b) {
            S.call(this, w, I, b);
          },
          props: {
            form: L.form,
            _post_click_activation_steps: {
              value: function (D) {
                if (this.type === "checkbox") this.checked = !this.checked;
                else if (this.type === "radio")
                  for (
                    var w = this.form.getElementsByName(this.name),
                      I = w.length - 1;
                    I >= 0;
                    I--
                  ) {
                    var b = w[I];
                    b.checked = b === this;
                  }
              },
            },
          },
          attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            accept: String,
            alt: String,
            max: String,
            min: String,
            pattern: String,
            placeholder: String,
            step: String,
            dirName: String,
            defaultValue: { name: "value" },
            multiple: Boolean,
            required: Boolean,
            readOnly: Boolean,
            checked: Boolean,
            value: String,
            src: u,
            defaultChecked: { name: "checked", type: Boolean },
            size: { type: "unsigned long", default: 20, min: 1, setmin: 1 },
            width: { type: "unsigned long", min: 0, setmin: 0, default: 0 },
            height: { type: "unsigned long", min: 0, setmin: 0, default: 0 },
            minLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            maxLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            autocomplete: String,
            type: {
              type: [
                "text",
                "hidden",
                "search",
                "tel",
                "url",
                "email",
                "password",
                "datetime",
                "date",
                "month",
                "week",
                "time",
                "datetime-local",
                "number",
                "range",
                "color",
                "checkbox",
                "radio",
                "file",
                "submit",
                "image",
                "reset",
                "button",
              ],
              missing: "text",
            },
            formTarget: String,
            formNoValidate: Boolean,
            formMethod: { type: ["get", "post"], invalid: "get", missing: "" },
            formEnctype: {
              type: [
                "application/x-www-form-urlencoded",
                "multipart/form-data",
                "text/plain",
              ],
              invalid: "application/x-www-form-urlencoded",
              missing: "",
            },
            inputMode: {
              type: [
                "verbatim",
                "latin",
                "latin-name",
                "latin-prose",
                "full-width-latin",
                "kana",
                "kana-name",
                "katakana",
                "numeric",
                "tel",
                "email",
                "url",
              ],
              missing: "",
            },
            align: String,
            useMap: String,
          },
        }),
        l({
          tag: "keygen",
          name: "HTMLKeygenElement",
          ctor: function (w, I, b) {
            S.call(this, w, I, b);
          },
          props: L,
          attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            challenge: String,
            keytype: { type: ["rsa"], missing: "" },
          },
        }),
        l({
          tag: "li",
          name: "HTMLLIElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { value: { type: "long", default: 0 }, type: String },
        }),
        l({
          tag: "label",
          name: "HTMLLabelElement",
          ctor: function (w, I, b) {
            S.call(this, w, I, b);
          },
          props: L,
          attributes: { htmlFor: { name: "for", type: String } },
        }),
        l({
          tag: "legend",
          name: "HTMLLegendElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { align: String },
        }),
        l({
          tag: "link",
          name: "HTMLLinkElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            href: u,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            crossOrigin: d,
            nonce: String,
            integrity: String,
            referrerPolicy: g,
            imageSizes: String,
            imageSrcset: String,
            charset: String,
            rev: String,
            target: String,
          },
        }),
        l({
          tag: "map",
          name: "HTMLMapElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { name: String },
        }),
        l({
          tag: "menu",
          name: "HTMLMenuElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            type: { type: ["context", "popup", "toolbar"], missing: "toolbar" },
            label: String,
            compact: Boolean,
          },
        }),
        l({
          tag: "meta",
          name: "HTMLMetaElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            name: String,
            content: String,
            httpEquiv: { name: "http-equiv", type: String },
            scheme: String,
          },
        }),
        l({
          tag: "meter",
          name: "HTMLMeterElement",
          ctor: function (w, I, b) {
            S.call(this, w, I, b);
          },
          props: L,
        }),
        l({
          tags: ["ins", "del"],
          name: "HTMLModElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { cite: u, dateTime: String },
        }),
        l({
          tag: "ol",
          name: "HTMLOListElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          props: {
            _numitems: {
              get: function () {
                var D = 0;
                return (
                  this.childNodes.forEach(function (w) {
                    w.nodeType === t.ELEMENT_NODE && w.tagName === "LI" && D++;
                  }),
                  D
                );
              },
            },
          },
          attributes: {
            type: String,
            reversed: Boolean,
            start: {
              type: "long",
              default: function () {
                return this.reversed ? this._numitems : 1;
              },
            },
            compact: Boolean,
          },
        }),
        l({
          tag: "object",
          name: "HTMLObjectElement",
          ctor: function (w, I, b) {
            S.call(this, w, I, b);
          },
          props: L,
          attributes: {
            data: u,
            type: String,
            name: String,
            useMap: String,
            typeMustMatch: Boolean,
            width: String,
            height: String,
            align: String,
            archive: String,
            code: String,
            declare: Boolean,
            hspace: { type: "unsigned long", default: 0 },
            standby: String,
            vspace: { type: "unsigned long", default: 0 },
            codeBase: u,
            codeType: String,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "optgroup",
          name: "HTMLOptGroupElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { disabled: Boolean, label: String },
        }),
        l({
          tag: "option",
          name: "HTMLOptionElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          props: {
            form: {
              get: function () {
                for (
                  var D = this.parentNode;
                  D && D.nodeType === t.ELEMENT_NODE;

                ) {
                  if (D.localName === "select") return D.form;
                  D = D.parentNode;
                }
              },
            },
            value: {
              get: function () {
                return this._getattr("value") || this.text;
              },
              set: function (D) {
                this._setattr("value", D);
              },
            },
            text: {
              get: function () {
                return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim();
              },
              set: function (D) {
                this.textContent = D;
              },
            },
          },
          attributes: {
            disabled: Boolean,
            defaultSelected: { name: "selected", type: Boolean },
            label: String,
          },
        }),
        l({
          tag: "output",
          name: "HTMLOutputElement",
          ctor: function (w, I, b) {
            S.call(this, w, I, b);
          },
          props: L,
          attributes: { name: String },
        }),
        l({
          tag: "p",
          name: "HTMLParagraphElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { align: String },
        }),
        l({
          tag: "param",
          name: "HTMLParamElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            name: String,
            value: String,
            type: String,
            valueType: String,
          },
        }),
        l({
          tags: ["pre", "listing", "xmp"],
          name: "HTMLPreElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { width: { type: "long", default: 0 } },
        }),
        l({
          tag: "progress",
          name: "HTMLProgressElement",
          ctor: function (w, I, b) {
            S.call(this, w, I, b);
          },
          props: L,
          attributes: { max: { type: Number, float: !0, default: 1, min: 0 } },
        }),
        l({
          tags: ["q", "blockquote"],
          name: "HTMLQuoteElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { cite: u },
        }),
        l({
          tag: "script",
          name: "HTMLScriptElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          props: {
            text: {
              get: function () {
                for (
                  var D = "", w = 0, I = this.childNodes.length;
                  w < I;
                  w++
                ) {
                  var b = this.childNodes[w];
                  b.nodeType === t.TEXT_NODE && (D += b._data);
                }
                return D;
              },
              set: function (D) {
                this.removeChildren(),
                  D !== null &&
                    D !== "" &&
                    this.appendChild(this.ownerDocument.createTextNode(D));
              },
            },
          },
          attributes: {
            src: u,
            type: String,
            charset: String,
            referrerPolicy: g,
            defer: Boolean,
            async: Boolean,
            nomodule: Boolean,
            crossOrigin: d,
            nonce: String,
            integrity: String,
          },
        }),
        l({
          tag: "select",
          name: "HTMLSelectElement",
          ctor: function (w, I, b) {
            S.call(this, w, I, b);
          },
          props: {
            form: L.form,
            options: {
              get: function () {
                return this.getElementsByTagName("option");
              },
            },
          },
          attributes: {
            autocomplete: String,
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            multiple: Boolean,
            required: Boolean,
            size: { type: "unsigned long", default: 0 },
          },
        }),
        l({
          tag: "span",
          name: "HTMLSpanElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
        }),
        l({
          tag: "style",
          name: "HTMLStyleElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { media: String, type: String, scoped: Boolean },
        }),
        l({
          tag: "caption",
          name: "HTMLTableCaptionElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { align: String },
        }),
        l({
          name: "HTMLTableCellElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            colSpan: { type: "unsigned long", default: 1 },
            rowSpan: { type: "unsigned long", default: 1 },
            scope: {
              type: ["row", "col", "rowgroup", "colgroup"],
              missing: "",
            },
            abbr: String,
            align: String,
            axis: String,
            height: String,
            width: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            noWrap: Boolean,
            vAlign: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tags: ["col", "colgroup"],
          name: "HTMLTableColElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            span: {
              type: "limited unsigned long with fallback",
              default: 1,
              min: 1,
            },
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
            width: String,
          },
        }),
        l({
          tag: "table",
          name: "HTMLTableElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          props: {
            rows: {
              get: function () {
                return this.getElementsByTagName("tr");
              },
            },
          },
          attributes: {
            align: String,
            border: String,
            frame: String,
            rules: String,
            summary: String,
            width: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
            cellPadding: { type: String, treatNullAsEmptyString: !0 },
            cellSpacing: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tag: "template",
          name: "HTMLTemplateElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b),
              (this._contentFragment = w._templateDoc.createDocumentFragment());
          },
          props: {
            content: {
              get: function () {
                return this._contentFragment;
              },
            },
            serialize: {
              value: function () {
                return this.content.serialize();
              },
            },
          },
        }),
        l({
          tag: "tr",
          name: "HTMLTableRowElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          props: {
            cells: {
              get: function () {
                return this.querySelectorAll("td,th");
              },
            },
          },
          attributes: {
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
            bgColor: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        l({
          tags: ["thead", "tfoot", "tbody"],
          name: "HTMLTableSectionElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          props: {
            rows: {
              get: function () {
                return this.getElementsByTagName("tr");
              },
            },
          },
          attributes: {
            align: String,
            ch: { name: "char", type: String },
            chOff: { name: "charoff", type: String },
            vAlign: String,
          },
        }),
        l({
          tag: "textarea",
          name: "HTMLTextAreaElement",
          ctor: function (w, I, b) {
            S.call(this, w, I, b);
          },
          props: {
            form: L.form,
            type: {
              get: function () {
                return "textarea";
              },
            },
            defaultValue: {
              get: function () {
                return this.textContent;
              },
              set: function (D) {
                this.textContent = D;
              },
            },
            value: {
              get: function () {
                return this.defaultValue;
              },
              set: function (D) {
                this.defaultValue = D;
              },
            },
            textLength: {
              get: function () {
                return this.value.length;
              },
            },
          },
          attributes: {
            autocomplete: String,
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            placeholder: String,
            wrap: String,
            dirName: String,
            required: Boolean,
            readOnly: Boolean,
            rows: { type: "limited unsigned long with fallback", default: 2 },
            cols: { type: "limited unsigned long with fallback", default: 20 },
            maxLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            minLength: {
              type: "unsigned long",
              min: 0,
              setmin: 0,
              default: -1,
            },
            inputMode: {
              type: [
                "verbatim",
                "latin",
                "latin-name",
                "latin-prose",
                "full-width-latin",
                "kana",
                "kana-name",
                "katakana",
                "numeric",
                "tel",
                "email",
                "url",
              ],
              missing: "",
            },
          },
        }),
        l({
          tag: "time",
          name: "HTMLTimeElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { dateTime: String, pubDate: Boolean },
        }),
        l({
          tag: "title",
          name: "HTMLTitleElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          props: {
            text: {
              get: function () {
                return this.textContent;
              },
            },
          },
        }),
        l({
          tag: "ul",
          name: "HTMLUListElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { type: String, compact: Boolean },
        }),
        l({
          name: "HTMLMediaElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            src: u,
            crossOrigin: d,
            preload: {
              type: ["metadata", "none", "auto", { value: "", alias: "auto" }],
              missing: "auto",
            },
            loop: Boolean,
            autoplay: Boolean,
            mediaGroup: String,
            controls: Boolean,
            defaultMuted: { name: "muted", type: Boolean },
          },
        }),
        l({
          name: "HTMLAudioElement",
          tag: "audio",
          superclass: a.HTMLMediaElement,
          ctor: function (w, I, b) {
            a.HTMLMediaElement.call(this, w, I, b);
          },
        }),
        l({
          name: "HTMLVideoElement",
          tag: "video",
          superclass: a.HTMLMediaElement,
          ctor: function (w, I, b) {
            a.HTMLMediaElement.call(this, w, I, b);
          },
          attributes: {
            poster: u,
            width: { type: "unsigned long", min: 0, default: 0 },
            height: { type: "unsigned long", min: 0, default: 0 },
          },
        }),
        l({
          tag: "td",
          name: "HTMLTableDataCellElement",
          superclass: a.HTMLTableCellElement,
          ctor: function (w, I, b) {
            a.HTMLTableCellElement.call(this, w, I, b);
          },
        }),
        l({
          tag: "th",
          name: "HTMLTableHeaderCellElement",
          superclass: a.HTMLTableCellElement,
          ctor: function (w, I, b) {
            a.HTMLTableCellElement.call(this, w, I, b);
          },
        }),
        l({
          tag: "frameset",
          name: "HTMLFrameSetElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
        }),
        l({
          tag: "frame",
          name: "HTMLFrameElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
        }),
        l({
          tag: "canvas",
          name: "HTMLCanvasElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          props: {
            getContext: { value: i.nyi },
            probablySupportsContext: { value: i.nyi },
            setContext: { value: i.nyi },
            transferControlToProxy: { value: i.nyi },
            toDataURL: { value: i.nyi },
            toBlob: { value: i.nyi },
          },
          attributes: {
            width: { type: "unsigned long", default: 300 },
            height: { type: "unsigned long", default: 150 },
          },
        }),
        l({
          tag: "dialog",
          name: "HTMLDialogElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          props: {
            show: { value: i.nyi },
            showModal: { value: i.nyi },
            close: { value: i.nyi },
          },
          attributes: { open: Boolean, returnValue: String },
        }),
        l({
          tag: "menuitem",
          name: "HTMLMenuItemElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          props: {
            _label: {
              get: function () {
                var D = this._getattr("label");
                return D !== null && D !== ""
                  ? D
                  : ((D = this.textContent),
                    D.replace(/[ \t\n\f\r]+/g, " ").trim());
              },
            },
            label: {
              get: function () {
                var D = this._getattr("label");
                return D !== null ? D : this._label;
              },
              set: function (D) {
                this._setattr("label", D);
              },
            },
          },
          attributes: {
            type: {
              type: ["command", "checkbox", "radio"],
              missing: "command",
            },
            icon: u,
            disabled: Boolean,
            checked: Boolean,
            radiogroup: String,
            default: Boolean,
          },
        }),
        l({
          tag: "source",
          name: "HTMLSourceElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            srcset: String,
            sizes: String,
            media: String,
            src: u,
            type: String,
            width: String,
            height: String,
          },
        }),
        l({
          tag: "track",
          name: "HTMLTrackElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            src: u,
            srclang: String,
            label: String,
            default: Boolean,
            kind: {
              type: [
                "subtitles",
                "captions",
                "descriptions",
                "chapters",
                "metadata",
              ],
              missing: "subtitles",
              invalid: "metadata",
            },
          },
          props: {
            NONE: {
              get: function () {
                return 0;
              },
            },
            LOADING: {
              get: function () {
                return 1;
              },
            },
            LOADED: {
              get: function () {
                return 2;
              },
            },
            ERROR: {
              get: function () {
                return 3;
              },
            },
            readyState: { get: i.nyi },
            track: { get: i.nyi },
          },
        }),
        l({
          tag: "font",
          name: "HTMLFontElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: {
            color: { type: String, treatNullAsEmptyString: !0 },
            face: { type: String },
            size: { type: String },
          },
        }),
        l({
          tag: "dir",
          name: "HTMLDirectoryElement",
          ctor: function (w, I, b) {
            M.call(this, w, I, b);
          },
          attributes: { compact: Boolean },
        }),
        l({
          tags: [
            "abbr",
            "address",
            "article",
            "aside",
            "b",
            "bdi",
            "bdo",
            "cite",
            "content",
            "code",
            "dd",
            "dfn",
            "dt",
            "em",
            "figcaption",
            "figure",
            "footer",
            "header",
            "hgroup",
            "i",
            "kbd",
            "main",
            "mark",
            "nav",
            "noscript",
            "rb",
            "rp",
            "rt",
            "rtc",
            "ruby",
            "s",
            "samp",
            "section",
            "small",
            "strong",
            "sub",
            "summary",
            "sup",
            "u",
            "var",
            "wbr",
            "acronym",
            "basefont",
            "big",
            "center",
            "nobr",
            "noembed",
            "noframes",
            "plaintext",
            "strike",
            "tt",
          ],
        });
    },
  }),
  Eb = oe({
    "external/npm/node_modules/domino/lib/svg.js"(e) {
      "use strict";
      var t = ao(),
        n = vb(),
        r = nt(),
        i = Eh(),
        s = (e.elements = {}),
        o = Object.create(null);
      e.createElement = function (l, u, d) {
        var g = o[u] || c;
        return new g(l, u, d);
      };
      function a(l) {
        return n(l, c, s, o);
      }
      var c = a({
        superclass: t,
        name: "SVGElement",
        ctor: function (u, d, g) {
          t.call(this, u, d, r.NAMESPACE.SVG, g);
        },
        props: {
          style: {
            get: function () {
              return this._style || (this._style = new i(this)), this._style;
            },
          },
        },
      });
      a({
        name: "SVGSVGElement",
        ctor: function (u, d, g) {
          c.call(this, u, d, g);
        },
        tag: "svg",
        props: {
          createSVGRect: {
            value: function () {
              return e.createElement(this.ownerDocument, "rect", null);
            },
          },
        },
      }),
        a({
          tags: [
            "a",
            "altGlyph",
            "altGlyphDef",
            "altGlyphItem",
            "animate",
            "animateColor",
            "animateMotion",
            "animateTransform",
            "circle",
            "clipPath",
            "color-profile",
            "cursor",
            "defs",
            "desc",
            "ellipse",
            "feBlend",
            "feColorMatrix",
            "feComponentTransfer",
            "feComposite",
            "feConvolveMatrix",
            "feDiffuseLighting",
            "feDisplacementMap",
            "feDistantLight",
            "feFlood",
            "feFuncA",
            "feFuncB",
            "feFuncG",
            "feFuncR",
            "feGaussianBlur",
            "feImage",
            "feMerge",
            "feMergeNode",
            "feMorphology",
            "feOffset",
            "fePointLight",
            "feSpecularLighting",
            "feSpotLight",
            "feTile",
            "feTurbulence",
            "filter",
            "font",
            "font-face",
            "font-face-format",
            "font-face-name",
            "font-face-src",
            "font-face-uri",
            "foreignObject",
            "g",
            "glyph",
            "glyphRef",
            "hkern",
            "image",
            "line",
            "linearGradient",
            "marker",
            "mask",
            "metadata",
            "missing-glyph",
            "mpath",
            "path",
            "pattern",
            "polygon",
            "polyline",
            "radialGradient",
            "rect",
            "script",
            "set",
            "stop",
            "style",
            "switch",
            "symbol",
            "text",
            "textPath",
            "title",
            "tref",
            "tspan",
            "use",
            "view",
            "vkern",
          ],
        });
    },
  }),
  eM = oe({
    "external/npm/node_modules/domino/lib/MutationConstants.js"(e, t) {
      "use strict";
      t.exports = {
        VALUE: 1,
        ATTR: 2,
        REMOVE_ATTR: 3,
        REMOVE: 4,
        MOVE: 5,
        INSERT: 6,
      };
    },
  }),
  _h = oe({
    "external/npm/node_modules/domino/lib/Document.js"(e, t) {
      "use strict";
      t.exports = q;
      var n = gt(),
        r = Bi(),
        i = ph(),
        s = ao(),
        o = db(),
        a = fb(),
        c = oo(),
        l = hb(),
        u = pb(),
        d = ll(),
        g = YN(),
        E = ZN(),
        S = cl(),
        M = vh(),
        H = gh(),
        L = gb(),
        D = mh(),
        w = bh(),
        I = Eb(),
        b = nt(),
        ee = eM(),
        te = b.NAMESPACE,
        me = hh().isApiWritable;
      function q(T, O) {
        i.call(this),
          (this.nodeType = n.DOCUMENT_NODE),
          (this.isHTML = T),
          (this._address = O || "about:blank"),
          (this.readyState = "loading"),
          (this.implementation = new d(this)),
          (this.ownerDocument = null),
          (this._contentType = T ? "text/html" : "application/xml"),
          (this.doctype = null),
          (this.documentElement = null),
          (this._templateDocCache = null),
          (this._nodeIterators = null),
          (this._nid = 1),
          (this._nextnid = 2),
          (this._nodes = [null, this]),
          (this.byId = Object.create(null)),
          (this.modclock = 0);
      }
      var x = {
          event: "Event",
          customevent: "CustomEvent",
          uievent: "UIEvent",
          mouseevent: "MouseEvent",
        },
        F = {
          events: "event",
          htmlevents: "event",
          mouseevents: "mouseevent",
          mutationevents: "mutationevent",
          uievents: "uievent",
        },
        Z = function (T, O, $) {
          return {
            get: function () {
              var we = T.call(this);
              return we ? we[O] : $;
            },
            set: function (we) {
              var yt = T.call(this);
              yt && (yt[O] = we);
            },
          };
        };
      function v(T, O) {
        var $, we, yt;
        return (
          T === "" && (T = null),
          D.isValidQName(O) || b.InvalidCharacterError(),
          ($ = null),
          (we = O),
          (yt = O.indexOf(":")),
          yt >= 0 && (($ = O.substring(0, yt)), (we = O.substring(yt + 1))),
          $ !== null && T === null && b.NamespaceError(),
          $ === "xml" && T !== te.XML && b.NamespaceError(),
          ($ === "xmlns" || O === "xmlns") &&
            T !== te.XMLNS &&
            b.NamespaceError(),
          T === te.XMLNS &&
            !($ === "xmlns" || O === "xmlns") &&
            b.NamespaceError(),
          { namespace: T, prefix: $, localName: we }
        );
      }
      q.prototype = Object.create(i.prototype, {
        _setMutationHandler: {
          value: function (T) {
            this.mutationHandler = T;
          },
        },
        _dispatchRendererEvent: {
          value: function (T, O, $) {
            var we = this._nodes[T];
            we && we._dispatchEvent(new c(O, $), !0);
          },
        },
        nodeName: { value: "#document" },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        documentURI: {
          get: function () {
            return this._address;
          },
          set: b.nyi,
        },
        compatMode: {
          get: function () {
            return this._quirks ? "BackCompat" : "CSS1Compat";
          },
        },
        createTextNode: {
          value: function (T) {
            return new o(this, String(T));
          },
        },
        createComment: {
          value: function (T) {
            return new a(this, T);
          },
        },
        createDocumentFragment: {
          value: function () {
            return new l(this);
          },
        },
        createProcessingInstruction: {
          value: function (T, O) {
            return (
              (!D.isValidName(T) || O.indexOf("?>") !== -1) &&
                b.InvalidCharacterError(),
              new u(this, T, O)
            );
          },
        },
        createAttribute: {
          value: function (T) {
            return (
              (T = String(T)),
              D.isValidName(T) || b.InvalidCharacterError(),
              this.isHTML && (T = b.toASCIILowerCase(T)),
              new s._Attr(null, T, null, null, "")
            );
          },
        },
        createAttributeNS: {
          value: function (T, O) {
            (T = T == null || T === "" ? null : String(T)), (O = String(O));
            var $ = v(T, O);
            return new s._Attr(null, $.localName, $.prefix, $.namespace, "");
          },
        },
        createElement: {
          value: function (T) {
            return (
              (T = String(T)),
              D.isValidName(T) || b.InvalidCharacterError(),
              this.isHTML
                ? (/[A-Z]/.test(T) && (T = b.toASCIILowerCase(T)),
                  w.createElement(this, T, null))
                : this.contentType === "application/xhtml+xml"
                  ? w.createElement(this, T, null)
                  : new s(this, T, null, null)
            );
          },
          writable: me,
        },
        createElementNS: {
          value: function (T, O) {
            (T = T == null || T === "" ? null : String(T)), (O = String(O));
            var $ = v(T, O);
            return this._createElementNS($.localName, $.namespace, $.prefix);
          },
          writable: me,
        },
        _createElementNS: {
          value: function (T, O, $) {
            return O === te.HTML
              ? w.createElement(this, T, $)
              : O === te.SVG
                ? I.createElement(this, T, $)
                : new s(this, T, O, $);
          },
        },
        createEvent: {
          value: function (O) {
            O = O.toLowerCase();
            var $ = F[O] || O,
              we = L[x[$]];
            if (we) {
              var yt = new we();
              return (yt._initialized = !1), yt;
            } else b.NotSupportedError();
          },
        },
        createTreeWalker: {
          value: function (T, O, $) {
            if (!T) throw new TypeError("root argument is required");
            if (!(T instanceof n)) throw new TypeError("root not a node");
            return (
              (O = O === void 0 ? S.SHOW_ALL : +O),
              ($ = $ === void 0 ? null : $),
              new g(T, O, $)
            );
          },
        },
        createNodeIterator: {
          value: function (T, O, $) {
            if (!T) throw new TypeError("root argument is required");
            if (!(T instanceof n)) throw new TypeError("root not a node");
            return (
              (O = O === void 0 ? S.SHOW_ALL : +O),
              ($ = $ === void 0 ? null : $),
              new E(T, O, $)
            );
          },
        },
        _attachNodeIterator: {
          value: function (T) {
            this._nodeIterators || (this._nodeIterators = []),
              this._nodeIterators.push(T);
          },
        },
        _detachNodeIterator: {
          value: function (T) {
            var O = this._nodeIterators.indexOf(T);
            this._nodeIterators.splice(O, 1);
          },
        },
        _preremoveNodeIterators: {
          value: function (T) {
            this._nodeIterators &&
              this._nodeIterators.forEach(function (O) {
                O._preremove(T);
              });
          },
        },
        _updateDocTypeElement: {
          value: function () {
            this.doctype = this.documentElement = null;
            for (var O = this.firstChild; O !== null; O = O.nextSibling)
              O.nodeType === n.DOCUMENT_TYPE_NODE
                ? (this.doctype = O)
                : O.nodeType === n.ELEMENT_NODE && (this.documentElement = O);
          },
        },
        insertBefore: {
          value: function (O, $) {
            return (
              n.prototype.insertBefore.call(this, O, $),
              this._updateDocTypeElement(),
              O
            );
          },
        },
        replaceChild: {
          value: function (O, $) {
            return (
              n.prototype.replaceChild.call(this, O, $),
              this._updateDocTypeElement(),
              $
            );
          },
        },
        removeChild: {
          value: function (O) {
            return (
              n.prototype.removeChild.call(this, O),
              this._updateDocTypeElement(),
              O
            );
          },
        },
        getElementById: {
          value: function (T) {
            var O = this.byId[T];
            return O ? (O instanceof he ? O.getFirst() : O) : null;
          },
        },
        _hasMultipleElementsWithId: {
          value: function (T) {
            return this.byId[T] instanceof he;
          },
        },
        getElementsByName: { value: s.prototype.getElementsByName },
        getElementsByTagName: { value: s.prototype.getElementsByTagName },
        getElementsByTagNameNS: { value: s.prototype.getElementsByTagNameNS },
        getElementsByClassName: { value: s.prototype.getElementsByClassName },
        adoptNode: {
          value: function (O) {
            return (
              O.nodeType === n.DOCUMENT_NODE && b.NotSupportedError(),
              O.nodeType === n.ATTRIBUTE_NODE ||
                (O.parentNode && O.parentNode.removeChild(O),
                O.ownerDocument !== this && Q(O, this)),
              O
            );
          },
        },
        importNode: {
          value: function (O, $) {
            return this.adoptNode(O.cloneNode($));
          },
          writable: me,
        },
        origin: {
          get: function () {
            return null;
          },
        },
        characterSet: {
          get: function () {
            return "UTF-8";
          },
        },
        contentType: {
          get: function () {
            return this._contentType;
          },
        },
        URL: {
          get: function () {
            return this._address;
          },
        },
        domain: { get: b.nyi, set: b.nyi },
        referrer: { get: b.nyi },
        cookie: { get: b.nyi, set: b.nyi },
        lastModified: { get: b.nyi },
        location: {
          get: function () {
            return this.defaultView ? this.defaultView.location : null;
          },
          set: b.nyi,
        },
        _titleElement: {
          get: function () {
            return this.getElementsByTagName("title").item(0) || null;
          },
        },
        title: {
          get: function () {
            var T = this._titleElement,
              O = T ? T.textContent : "";
            return O.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "");
          },
          set: function (T) {
            var O = this._titleElement,
              $ = this.head;
            (!O && !$) ||
              (O || ((O = this.createElement("title")), $.appendChild(O)),
              (O.textContent = T));
          },
        },
        dir: Z(
          function () {
            var T = this.documentElement;
            if (T && T.tagName === "HTML") return T;
          },
          "dir",
          "",
        ),
        fgColor: Z(
          function () {
            return this.body;
          },
          "text",
          "",
        ),
        linkColor: Z(
          function () {
            return this.body;
          },
          "link",
          "",
        ),
        vlinkColor: Z(
          function () {
            return this.body;
          },
          "vLink",
          "",
        ),
        alinkColor: Z(
          function () {
            return this.body;
          },
          "aLink",
          "",
        ),
        bgColor: Z(
          function () {
            return this.body;
          },
          "bgColor",
          "",
        ),
        charset: {
          get: function () {
            return this.characterSet;
          },
        },
        inputEncoding: {
          get: function () {
            return this.characterSet;
          },
        },
        scrollingElement: {
          get: function () {
            return this._quirks ? this.body : this.documentElement;
          },
        },
        body: {
          get: function () {
            return p(this.documentElement, "body");
          },
          set: b.nyi,
        },
        head: {
          get: function () {
            return p(this.documentElement, "head");
          },
        },
        images: { get: b.nyi },
        embeds: { get: b.nyi },
        plugins: { get: b.nyi },
        links: { get: b.nyi },
        forms: { get: b.nyi },
        scripts: { get: b.nyi },
        applets: {
          get: function () {
            return [];
          },
        },
        activeElement: {
          get: function () {
            return null;
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: b.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: b.nyi,
        },
        write: {
          value: function (T) {
            if ((this.isHTML || b.InvalidStateError(), !!this._parser)) {
              this._parser;
              var O = arguments.join("");
              this._parser.parse(O);
            }
          },
        },
        writeln: {
          value: function (O) {
            this.write(
              Array.prototype.join.call(arguments, "") +
                `
`,
            );
          },
        },
        open: {
          value: function () {
            this.documentElement = null;
          },
        },
        close: {
          value: function () {
            (this.readyState = "interactive"),
              this._dispatchEvent(new c("readystatechange"), !0),
              this._dispatchEvent(new c("DOMContentLoaded"), !0),
              (this.readyState = "complete"),
              this._dispatchEvent(new c("readystatechange"), !0),
              this.defaultView &&
                this.defaultView._dispatchEvent(new c("load"), !0);
          },
        },
        clone: {
          value: function () {
            var O = new q(this.isHTML, this._address);
            return (
              (O._quirks = this._quirks),
              (O._contentType = this._contentType),
              O
            );
          },
        },
        cloneNode: {
          value: function (O) {
            var $ = n.prototype.cloneNode.call(this, !1);
            if (O)
              for (var we = this.firstChild; we !== null; we = we.nextSibling)
                $._appendChild($.importNode(we, !0));
            return $._updateDocTypeElement(), $;
          },
        },
        isEqual: {
          value: function (O) {
            return !0;
          },
        },
        mutateValue: {
          value: function (T) {
            this.mutationHandler &&
              this.mutationHandler({ type: ee.VALUE, target: T, data: T.data });
          },
        },
        mutateAttr: {
          value: function (T, O) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ee.ATTR,
                target: T.ownerElement,
                attr: T,
              });
          },
        },
        mutateRemoveAttr: {
          value: function (T) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ee.REMOVE_ATTR,
                target: T.ownerElement,
                attr: T,
              });
          },
        },
        mutateRemove: {
          value: function (T) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ee.REMOVE,
                target: T.parentNode,
                node: T,
              }),
              V(T);
          },
        },
        mutateInsert: {
          value: function (T) {
            R(T),
              this.mutationHandler &&
                this.mutationHandler({
                  type: ee.INSERT,
                  target: T.parentNode,
                  node: T,
                });
          },
        },
        mutateMove: {
          value: function (T) {
            this.mutationHandler &&
              this.mutationHandler({ type: ee.MOVE, target: T });
          },
        },
        addId: {
          value: function (O, $) {
            var we = this.byId[O];
            we
              ? (we instanceof he || ((we = new he(we)), (this.byId[O] = we)),
                we.add($))
              : (this.byId[O] = $);
          },
        },
        delId: {
          value: function (O, $) {
            var we = this.byId[O];
            b.assert(we),
              we instanceof he
                ? (we.del($),
                  we.length === 1 && (this.byId[O] = we.downgrade()))
                : (this.byId[O] = void 0);
          },
        },
        _resolve: {
          value: function (T) {
            return new M(this._documentBaseURL).resolve(T);
          },
        },
        _documentBaseURL: {
          get: function () {
            var T = this._address;
            T === "about:blank" && (T = "/");
            var O = this.querySelector("base[href]");
            return O ? new M(T).resolve(O.getAttribute("href")) : T;
          },
        },
        _templateDoc: {
          get: function () {
            if (!this._templateDocCache) {
              var T = new q(this.isHTML, this._address);
              this._templateDocCache = T._templateDocCache = T;
            }
            return this._templateDocCache;
          },
        },
        querySelector: {
          value: function (T) {
            return H(T, this)[0];
          },
        },
        querySelectorAll: {
          value: function (T) {
            var O = H(T, this);
            return O.item ? O : new r(O);
          },
        },
      });
      var m = [
        "abort",
        "canplay",
        "canplaythrough",
        "change",
        "click",
        "contextmenu",
        "cuechange",
        "dblclick",
        "drag",
        "dragend",
        "dragenter",
        "dragleave",
        "dragover",
        "dragstart",
        "drop",
        "durationchange",
        "emptied",
        "ended",
        "input",
        "invalid",
        "keydown",
        "keypress",
        "keyup",
        "loadeddata",
        "loadedmetadata",
        "loadstart",
        "mousedown",
        "mousemove",
        "mouseout",
        "mouseover",
        "mouseup",
        "mousewheel",
        "pause",
        "play",
        "playing",
        "progress",
        "ratechange",
        "readystatechange",
        "reset",
        "seeked",
        "seeking",
        "select",
        "show",
        "stalled",
        "submit",
        "suspend",
        "timeupdate",
        "volumechange",
        "waiting",
        "blur",
        "error",
        "focus",
        "load",
        "scroll",
      ];
      m.forEach(function (T) {
        Object.defineProperty(q.prototype, "on" + T, {
          get: function () {
            return this._getEventHandler(T);
          },
          set: function (O) {
            this._setEventHandler(T, O);
          },
        });
      });
      function p(T, O) {
        if (T && T.isHTML) {
          for (var $ = T.firstChild; $ !== null; $ = $.nextSibling)
            if (
              $.nodeType === n.ELEMENT_NODE &&
              $.localName === O &&
              $.namespaceURI === te.HTML
            )
              return $;
        }
        return null;
      }
      function y(T) {
        if (
          ((T._nid = T.ownerDocument._nextnid++),
          (T.ownerDocument._nodes[T._nid] = T),
          T.nodeType === n.ELEMENT_NODE)
        ) {
          var O = T.getAttribute("id");
          O && T.ownerDocument.addId(O, T), T._roothook && T._roothook();
        }
      }
      function C(T) {
        if (T.nodeType === n.ELEMENT_NODE) {
          var O = T.getAttribute("id");
          O && T.ownerDocument.delId(O, T);
        }
        (T.ownerDocument._nodes[T._nid] = void 0), (T._nid = void 0);
      }
      function R(T) {
        if ((y(T), T.nodeType === n.ELEMENT_NODE))
          for (var O = T.firstChild; O !== null; O = O.nextSibling) R(O);
      }
      function V(T) {
        C(T);
        for (var O = T.firstChild; O !== null; O = O.nextSibling) V(O);
      }
      function Q(T, O) {
        (T.ownerDocument = O),
          (T._lastModTime = void 0),
          Object.prototype.hasOwnProperty.call(T, "_tagName") &&
            (T._tagName = void 0);
        for (var $ = T.firstChild; $ !== null; $ = $.nextSibling) Q($, O);
      }
      function he(T) {
        (this.nodes = Object.create(null)),
          (this.nodes[T._nid] = T),
          (this.length = 1),
          (this.firstNode = void 0);
      }
      (he.prototype.add = function (T) {
        this.nodes[T._nid] ||
          ((this.nodes[T._nid] = T), this.length++, (this.firstNode = void 0));
      }),
        (he.prototype.del = function (T) {
          this.nodes[T._nid] &&
            (delete this.nodes[T._nid],
            this.length--,
            (this.firstNode = void 0));
        }),
        (he.prototype.getFirst = function () {
          if (!this.firstNode) {
            var T;
            for (T in this.nodes)
              (this.firstNode === void 0 ||
                this.firstNode.compareDocumentPosition(this.nodes[T]) &
                  n.DOCUMENT_POSITION_PRECEDING) &&
                (this.firstNode = this.nodes[T]);
          }
          return this.firstNode;
        }),
        (he.prototype.downgrade = function () {
          if (this.length === 1) {
            var T;
            for (T in this.nodes) return this.nodes[T];
          }
          return this;
        });
    },
  }),
  wh = oe({
    "external/npm/node_modules/domino/lib/DocumentType.js"(e, t) {
      "use strict";
      t.exports = s;
      var n = gt(),
        r = ub(),
        i = yh();
      function s(o, a, c, l) {
        r.call(this),
          (this.nodeType = n.DOCUMENT_TYPE_NODE),
          (this.ownerDocument = o || null),
          (this.name = a),
          (this.publicId = c || ""),
          (this.systemId = l || "");
      }
      (s.prototype = Object.create(r.prototype, {
        nodeName: {
          get: function () {
            return this.name;
          },
        },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        clone: {
          value: function () {
            return new s(
              this.ownerDocument,
              this.name,
              this.publicId,
              this.systemId,
            );
          },
        },
        isEqual: {
          value: function (a) {
            return (
              this.name === a.name &&
              this.publicId === a.publicId &&
              this.systemId === a.systemId
            );
          },
        },
      })),
        Object.defineProperties(s.prototype, i);
    },
  }),
  Dh = oe({
    "external/npm/node_modules/domino/lib/HTMLParser.js"(e, t) {
      "use strict";
      t.exports = Me;
      var n = _h(),
        r = wh(),
        i = gt(),
        s = nt().NAMESPACE,
        o = bh(),
        a = o.elements,
        c = Function.prototype.apply.bind(Array.prototype.push),
        l = -1,
        u = 1,
        d = 2,
        g = 3,
        E = 4,
        S = 5,
        M = [],
        H =
          /^HTML$|^-\/\/W3O\/\/DTD W3 HTML Strict 3\.0\/\/EN\/\/$|^-\/W3C\/DTD HTML 4\.0 Transitional\/EN$|^\+\/\/Silmaril\/\/dtd html Pro v0r11 19970101\/\/|^-\/\/AdvaSoft Ltd\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/AS\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict\/\/|^-\/\/IETF\/\/DTD HTML 2\.0\/\/|^-\/\/IETF\/\/DTD HTML 2\.1E\/\/|^-\/\/IETF\/\/DTD HTML 3\.0\/\/|^-\/\/IETF\/\/DTD HTML 3\.2 Final\/\/|^-\/\/IETF\/\/DTD HTML 3\.2\/\/|^-\/\/IETF\/\/DTD HTML 3\/\/|^-\/\/IETF\/\/DTD HTML Level 0\/\/|^-\/\/IETF\/\/DTD HTML Level 1\/\/|^-\/\/IETF\/\/DTD HTML Level 2\/\/|^-\/\/IETF\/\/DTD HTML Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 0\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict\/\/|^-\/\/IETF\/\/DTD HTML\/\/|^-\/\/Metrius\/\/DTD Metrius Presentational\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 Tables\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 Tables\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD HTML\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD Strict HTML\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML 2\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended 1\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended Relaxed 1\.0\/\/|^-\/\/SoftQuad Software\/\/DTD HoTMetaL PRO 6\.0::19990601::extensions to HTML 4\.0\/\/|^-\/\/SoftQuad\/\/DTD HoTMetaL PRO 4\.0::19971010::extensions to HTML 4\.0\/\/|^-\/\/Spyglass\/\/DTD HTML 2\.0 Extended\/\/|^-\/\/SQ\/\/DTD HTML 2\.0 HoTMetaL \+ extensions\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava HTML\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava Strict HTML\/\/|^-\/\/W3C\/\/DTD HTML 3 1995-03-24\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Draft\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Final\/\/|^-\/\/W3C\/\/DTD HTML 3\.2\/\/|^-\/\/W3C\/\/DTD HTML 3\.2S Draft\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Transitional\/\/|^-\/\/W3C\/\/DTD HTML Experimental 19960712\/\/|^-\/\/W3C\/\/DTD HTML Experimental 970421\/\/|^-\/\/W3C\/\/DTD W3 HTML\/\/|^-\/\/W3O\/\/DTD W3 HTML 3\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML 2\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML\/\//i,
        L = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd",
        D =
          /^-\/\/W3C\/\/DTD HTML 4\.01 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.01 Transitional\/\//i,
        w =
          /^-\/\/W3C\/\/DTD XHTML 1\.0 Frameset\/\/|^-\/\/W3C\/\/DTD XHTML 1\.0 Transitional\/\//i,
        I = Object.create(null);
      (I[s.HTML] = {
        __proto__: null,
        address: !0,
        applet: !0,
        area: !0,
        article: !0,
        aside: !0,
        base: !0,
        basefont: !0,
        bgsound: !0,
        blockquote: !0,
        body: !0,
        br: !0,
        button: !0,
        caption: !0,
        center: !0,
        col: !0,
        colgroup: !0,
        dd: !0,
        details: !0,
        dir: !0,
        div: !0,
        dl: !0,
        dt: !0,
        embed: !0,
        fieldset: !0,
        figcaption: !0,
        figure: !0,
        footer: !0,
        form: !0,
        frame: !0,
        frameset: !0,
        h1: !0,
        h2: !0,
        h3: !0,
        h4: !0,
        h5: !0,
        h6: !0,
        head: !0,
        header: !0,
        hgroup: !0,
        hr: !0,
        html: !0,
        iframe: !0,
        img: !0,
        input: !0,
        li: !0,
        link: !0,
        listing: !0,
        main: !0,
        marquee: !0,
        menu: !0,
        meta: !0,
        nav: !0,
        noembed: !0,
        noframes: !0,
        noscript: !0,
        object: !0,
        ol: !0,
        p: !0,
        param: !0,
        plaintext: !0,
        pre: !0,
        script: !0,
        section: !0,
        select: !0,
        source: !0,
        style: !0,
        summary: !0,
        table: !0,
        tbody: !0,
        td: !0,
        template: !0,
        textarea: !0,
        tfoot: !0,
        th: !0,
        thead: !0,
        title: !0,
        tr: !0,
        track: !0,
        ul: !0,
        wbr: !0,
        xmp: !0,
      }),
        (I[s.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        }),
        (I[s.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        });
      var b = Object.create(null);
      b[s.HTML] = { __proto__: null, address: !0, div: !0, p: !0 };
      var ee = Object.create(null);
      ee[s.HTML] = { __proto__: null, dd: !0, dt: !0 };
      var te = Object.create(null);
      te[s.HTML] = {
        __proto__: null,
        table: !0,
        thead: !0,
        tbody: !0,
        tfoot: !0,
        tr: !0,
      };
      var me = Object.create(null);
      me[s.HTML] = {
        __proto__: null,
        dd: !0,
        dt: !0,
        li: !0,
        menuitem: !0,
        optgroup: !0,
        option: !0,
        p: !0,
        rb: !0,
        rp: !0,
        rt: !0,
        rtc: !0,
      };
      var q = Object.create(null);
      q[s.HTML] = {
        __proto__: null,
        caption: !0,
        colgroup: !0,
        dd: !0,
        dt: !0,
        li: !0,
        optgroup: !0,
        option: !0,
        p: !0,
        rb: !0,
        rp: !0,
        rt: !0,
        rtc: !0,
        tbody: !0,
        td: !0,
        tfoot: !0,
        th: !0,
        thead: !0,
        tr: !0,
      };
      var x = Object.create(null);
      x[s.HTML] = { __proto__: null, table: !0, template: !0, html: !0 };
      var F = Object.create(null);
      F[s.HTML] = {
        __proto__: null,
        tbody: !0,
        tfoot: !0,
        thead: !0,
        template: !0,
        html: !0,
      };
      var Z = Object.create(null);
      Z[s.HTML] = { __proto__: null, tr: !0, template: !0, html: !0 };
      var v = Object.create(null);
      v[s.HTML] = {
        __proto__: null,
        button: !0,
        fieldset: !0,
        input: !0,
        keygen: !0,
        object: !0,
        output: !0,
        select: !0,
        textarea: !0,
        img: !0,
      };
      var m = Object.create(null);
      (m[s.HTML] = {
        __proto__: null,
        applet: !0,
        caption: !0,
        html: !0,
        table: !0,
        td: !0,
        th: !0,
        marquee: !0,
        object: !0,
        template: !0,
      }),
        (m[s.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        }),
        (m[s.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        });
      var p = Object.create(m);
      (p[s.HTML] = Object.create(m[s.HTML])),
        (p[s.HTML].ol = !0),
        (p[s.HTML].ul = !0);
      var y = Object.create(m);
      (y[s.HTML] = Object.create(m[s.HTML])), (y[s.HTML].button = !0);
      var C = Object.create(null);
      C[s.HTML] = { __proto__: null, html: !0, table: !0, template: !0 };
      var R = Object.create(null);
      R[s.HTML] = { __proto__: null, optgroup: !0, option: !0 };
      var V = Object.create(null);
      V[s.MATHML] = {
        __proto__: null,
        mi: !0,
        mo: !0,
        mn: !0,
        ms: !0,
        mtext: !0,
      };
      var Q = Object.create(null);
      Q[s.SVG] = { __proto__: null, foreignObject: !0, desc: !0, title: !0 };
      var he = {
          __proto__: null,
          "xlink:actuate": s.XLINK,
          "xlink:arcrole": s.XLINK,
          "xlink:href": s.XLINK,
          "xlink:role": s.XLINK,
          "xlink:show": s.XLINK,
          "xlink:title": s.XLINK,
          "xlink:type": s.XLINK,
          "xml:base": s.XML,
          "xml:lang": s.XML,
          "xml:space": s.XML,
          xmlns: s.XMLNS,
          "xmlns:xlink": s.XMLNS,
        },
        T = {
          __proto__: null,
          attributename: "attributeName",
          attributetype: "attributeType",
          basefrequency: "baseFrequency",
          baseprofile: "baseProfile",
          calcmode: "calcMode",
          clippathunits: "clipPathUnits",
          diffuseconstant: "diffuseConstant",
          edgemode: "edgeMode",
          filterunits: "filterUnits",
          glyphref: "glyphRef",
          gradienttransform: "gradientTransform",
          gradientunits: "gradientUnits",
          kernelmatrix: "kernelMatrix",
          kernelunitlength: "kernelUnitLength",
          keypoints: "keyPoints",
          keysplines: "keySplines",
          keytimes: "keyTimes",
          lengthadjust: "lengthAdjust",
          limitingconeangle: "limitingConeAngle",
          markerheight: "markerHeight",
          markerunits: "markerUnits",
          markerwidth: "markerWidth",
          maskcontentunits: "maskContentUnits",
          maskunits: "maskUnits",
          numoctaves: "numOctaves",
          pathlength: "pathLength",
          patterncontentunits: "patternContentUnits",
          patterntransform: "patternTransform",
          patternunits: "patternUnits",
          pointsatx: "pointsAtX",
          pointsaty: "pointsAtY",
          pointsatz: "pointsAtZ",
          preservealpha: "preserveAlpha",
          preserveaspectratio: "preserveAspectRatio",
          primitiveunits: "primitiveUnits",
          refx: "refX",
          refy: "refY",
          repeatcount: "repeatCount",
          repeatdur: "repeatDur",
          requiredextensions: "requiredExtensions",
          requiredfeatures: "requiredFeatures",
          specularconstant: "specularConstant",
          specularexponent: "specularExponent",
          spreadmethod: "spreadMethod",
          startoffset: "startOffset",
          stddeviation: "stdDeviation",
          stitchtiles: "stitchTiles",
          surfacescale: "surfaceScale",
          systemlanguage: "systemLanguage",
          tablevalues: "tableValues",
          targetx: "targetX",
          targety: "targetY",
          textlength: "textLength",
          viewbox: "viewBox",
          viewtarget: "viewTarget",
          xchannelselector: "xChannelSelector",
          ychannelselector: "yChannelSelector",
          zoomandpan: "zoomAndPan",
        },
        O = {
          __proto__: null,
          altglyph: "altGlyph",
          altglyphdef: "altGlyphDef",
          altglyphitem: "altGlyphItem",
          animatecolor: "animateColor",
          animatemotion: "animateMotion",
          animatetransform: "animateTransform",
          clippath: "clipPath",
          feblend: "feBlend",
          fecolormatrix: "feColorMatrix",
          fecomponenttransfer: "feComponentTransfer",
          fecomposite: "feComposite",
          feconvolvematrix: "feConvolveMatrix",
          fediffuselighting: "feDiffuseLighting",
          fedisplacementmap: "feDisplacementMap",
          fedistantlight: "feDistantLight",
          feflood: "feFlood",
          fefunca: "feFuncA",
          fefuncb: "feFuncB",
          fefuncg: "feFuncG",
          fefuncr: "feFuncR",
          fegaussianblur: "feGaussianBlur",
          feimage: "feImage",
          femerge: "feMerge",
          femergenode: "feMergeNode",
          femorphology: "feMorphology",
          feoffset: "feOffset",
          fepointlight: "fePointLight",
          fespecularlighting: "feSpecularLighting",
          fespotlight: "feSpotLight",
          fetile: "feTile",
          feturbulence: "feTurbulence",
          foreignobject: "foreignObject",
          glyphref: "glyphRef",
          lineargradient: "linearGradient",
          radialgradient: "radialGradient",
          textpath: "textPath",
        },
        $ = {
          __proto__: null,
          0: 65533,
          128: 8364,
          130: 8218,
          131: 402,
          132: 8222,
          133: 8230,
          134: 8224,
          135: 8225,
          136: 710,
          137: 8240,
          138: 352,
          139: 8249,
          140: 338,
          142: 381,
          145: 8216,
          146: 8217,
          147: 8220,
          148: 8221,
          149: 8226,
          150: 8211,
          151: 8212,
          152: 732,
          153: 8482,
          154: 353,
          155: 8250,
          156: 339,
          158: 382,
          159: 376,
        },
        we = {
          __proto__: null,
          AElig: 198,
          "AElig;": 198,
          AMP: 38,
          "AMP;": 38,
          Aacute: 193,
          "Aacute;": 193,
          "Abreve;": 258,
          Acirc: 194,
          "Acirc;": 194,
          "Acy;": 1040,
          "Afr;": [55349, 56580],
          Agrave: 192,
          "Agrave;": 192,
          "Alpha;": 913,
          "Amacr;": 256,
          "And;": 10835,
          "Aogon;": 260,
          "Aopf;": [55349, 56632],
          "ApplyFunction;": 8289,
          Aring: 197,
          "Aring;": 197,
          "Ascr;": [55349, 56476],
          "Assign;": 8788,
          Atilde: 195,
          "Atilde;": 195,
          Auml: 196,
          "Auml;": 196,
          "Backslash;": 8726,
          "Barv;": 10983,
          "Barwed;": 8966,
          "Bcy;": 1041,
          "Because;": 8757,
          "Bernoullis;": 8492,
          "Beta;": 914,
          "Bfr;": [55349, 56581],
          "Bopf;": [55349, 56633],
          "Breve;": 728,
          "Bscr;": 8492,
          "Bumpeq;": 8782,
          "CHcy;": 1063,
          COPY: 169,
          "COPY;": 169,
          "Cacute;": 262,
          "Cap;": 8914,
          "CapitalDifferentialD;": 8517,
          "Cayleys;": 8493,
          "Ccaron;": 268,
          Ccedil: 199,
          "Ccedil;": 199,
          "Ccirc;": 264,
          "Cconint;": 8752,
          "Cdot;": 266,
          "Cedilla;": 184,
          "CenterDot;": 183,
          "Cfr;": 8493,
          "Chi;": 935,
          "CircleDot;": 8857,
          "CircleMinus;": 8854,
          "CirclePlus;": 8853,
          "CircleTimes;": 8855,
          "ClockwiseContourIntegral;": 8754,
          "CloseCurlyDoubleQuote;": 8221,
          "CloseCurlyQuote;": 8217,
          "Colon;": 8759,
          "Colone;": 10868,
          "Congruent;": 8801,
          "Conint;": 8751,
          "ContourIntegral;": 8750,
          "Copf;": 8450,
          "Coproduct;": 8720,
          "CounterClockwiseContourIntegral;": 8755,
          "Cross;": 10799,
          "Cscr;": [55349, 56478],
          "Cup;": 8915,
          "CupCap;": 8781,
          "DD;": 8517,
          "DDotrahd;": 10513,
          "DJcy;": 1026,
          "DScy;": 1029,
          "DZcy;": 1039,
          "Dagger;": 8225,
          "Darr;": 8609,
          "Dashv;": 10980,
          "Dcaron;": 270,
          "Dcy;": 1044,
          "Del;": 8711,
          "Delta;": 916,
          "Dfr;": [55349, 56583],
          "DiacriticalAcute;": 180,
          "DiacriticalDot;": 729,
          "DiacriticalDoubleAcute;": 733,
          "DiacriticalGrave;": 96,
          "DiacriticalTilde;": 732,
          "Diamond;": 8900,
          "DifferentialD;": 8518,
          "Dopf;": [55349, 56635],
          "Dot;": 168,
          "DotDot;": 8412,
          "DotEqual;": 8784,
          "DoubleContourIntegral;": 8751,
          "DoubleDot;": 168,
          "DoubleDownArrow;": 8659,
          "DoubleLeftArrow;": 8656,
          "DoubleLeftRightArrow;": 8660,
          "DoubleLeftTee;": 10980,
          "DoubleLongLeftArrow;": 10232,
          "DoubleLongLeftRightArrow;": 10234,
          "DoubleLongRightArrow;": 10233,
          "DoubleRightArrow;": 8658,
          "DoubleRightTee;": 8872,
          "DoubleUpArrow;": 8657,
          "DoubleUpDownArrow;": 8661,
          "DoubleVerticalBar;": 8741,
          "DownArrow;": 8595,
          "DownArrowBar;": 10515,
          "DownArrowUpArrow;": 8693,
          "DownBreve;": 785,
          "DownLeftRightVector;": 10576,
          "DownLeftTeeVector;": 10590,
          "DownLeftVector;": 8637,
          "DownLeftVectorBar;": 10582,
          "DownRightTeeVector;": 10591,
          "DownRightVector;": 8641,
          "DownRightVectorBar;": 10583,
          "DownTee;": 8868,
          "DownTeeArrow;": 8615,
          "Downarrow;": 8659,
          "Dscr;": [55349, 56479],
          "Dstrok;": 272,
          "ENG;": 330,
          ETH: 208,
          "ETH;": 208,
          Eacute: 201,
          "Eacute;": 201,
          "Ecaron;": 282,
          Ecirc: 202,
          "Ecirc;": 202,
          "Ecy;": 1069,
          "Edot;": 278,
          "Efr;": [55349, 56584],
          Egrave: 200,
          "Egrave;": 200,
          "Element;": 8712,
          "Emacr;": 274,
          "EmptySmallSquare;": 9723,
          "EmptyVerySmallSquare;": 9643,
          "Eogon;": 280,
          "Eopf;": [55349, 56636],
          "Epsilon;": 917,
          "Equal;": 10869,
          "EqualTilde;": 8770,
          "Equilibrium;": 8652,
          "Escr;": 8496,
          "Esim;": 10867,
          "Eta;": 919,
          Euml: 203,
          "Euml;": 203,
          "Exists;": 8707,
          "ExponentialE;": 8519,
          "Fcy;": 1060,
          "Ffr;": [55349, 56585],
          "FilledSmallSquare;": 9724,
          "FilledVerySmallSquare;": 9642,
          "Fopf;": [55349, 56637],
          "ForAll;": 8704,
          "Fouriertrf;": 8497,
          "Fscr;": 8497,
          "GJcy;": 1027,
          GT: 62,
          "GT;": 62,
          "Gamma;": 915,
          "Gammad;": 988,
          "Gbreve;": 286,
          "Gcedil;": 290,
          "Gcirc;": 284,
          "Gcy;": 1043,
          "Gdot;": 288,
          "Gfr;": [55349, 56586],
          "Gg;": 8921,
          "Gopf;": [55349, 56638],
          "GreaterEqual;": 8805,
          "GreaterEqualLess;": 8923,
          "GreaterFullEqual;": 8807,
          "GreaterGreater;": 10914,
          "GreaterLess;": 8823,
          "GreaterSlantEqual;": 10878,
          "GreaterTilde;": 8819,
          "Gscr;": [55349, 56482],
          "Gt;": 8811,
          "HARDcy;": 1066,
          "Hacek;": 711,
          "Hat;": 94,
          "Hcirc;": 292,
          "Hfr;": 8460,
          "HilbertSpace;": 8459,
          "Hopf;": 8461,
          "HorizontalLine;": 9472,
          "Hscr;": 8459,
          "Hstrok;": 294,
          "HumpDownHump;": 8782,
          "HumpEqual;": 8783,
          "IEcy;": 1045,
          "IJlig;": 306,
          "IOcy;": 1025,
          Iacute: 205,
          "Iacute;": 205,
          Icirc: 206,
          "Icirc;": 206,
          "Icy;": 1048,
          "Idot;": 304,
          "Ifr;": 8465,
          Igrave: 204,
          "Igrave;": 204,
          "Im;": 8465,
          "Imacr;": 298,
          "ImaginaryI;": 8520,
          "Implies;": 8658,
          "Int;": 8748,
          "Integral;": 8747,
          "Intersection;": 8898,
          "InvisibleComma;": 8291,
          "InvisibleTimes;": 8290,
          "Iogon;": 302,
          "Iopf;": [55349, 56640],
          "Iota;": 921,
          "Iscr;": 8464,
          "Itilde;": 296,
          "Iukcy;": 1030,
          Iuml: 207,
          "Iuml;": 207,
          "Jcirc;": 308,
          "Jcy;": 1049,
          "Jfr;": [55349, 56589],
          "Jopf;": [55349, 56641],
          "Jscr;": [55349, 56485],
          "Jsercy;": 1032,
          "Jukcy;": 1028,
          "KHcy;": 1061,
          "KJcy;": 1036,
          "Kappa;": 922,
          "Kcedil;": 310,
          "Kcy;": 1050,
          "Kfr;": [55349, 56590],
          "Kopf;": [55349, 56642],
          "Kscr;": [55349, 56486],
          "LJcy;": 1033,
          LT: 60,
          "LT;": 60,
          "Lacute;": 313,
          "Lambda;": 923,
          "Lang;": 10218,
          "Laplacetrf;": 8466,
          "Larr;": 8606,
          "Lcaron;": 317,
          "Lcedil;": 315,
          "Lcy;": 1051,
          "LeftAngleBracket;": 10216,
          "LeftArrow;": 8592,
          "LeftArrowBar;": 8676,
          "LeftArrowRightArrow;": 8646,
          "LeftCeiling;": 8968,
          "LeftDoubleBracket;": 10214,
          "LeftDownTeeVector;": 10593,
          "LeftDownVector;": 8643,
          "LeftDownVectorBar;": 10585,
          "LeftFloor;": 8970,
          "LeftRightArrow;": 8596,
          "LeftRightVector;": 10574,
          "LeftTee;": 8867,
          "LeftTeeArrow;": 8612,
          "LeftTeeVector;": 10586,
          "LeftTriangle;": 8882,
          "LeftTriangleBar;": 10703,
          "LeftTriangleEqual;": 8884,
          "LeftUpDownVector;": 10577,
          "LeftUpTeeVector;": 10592,
          "LeftUpVector;": 8639,
          "LeftUpVectorBar;": 10584,
          "LeftVector;": 8636,
          "LeftVectorBar;": 10578,
          "Leftarrow;": 8656,
          "Leftrightarrow;": 8660,
          "LessEqualGreater;": 8922,
          "LessFullEqual;": 8806,
          "LessGreater;": 8822,
          "LessLess;": 10913,
          "LessSlantEqual;": 10877,
          "LessTilde;": 8818,
          "Lfr;": [55349, 56591],
          "Ll;": 8920,
          "Lleftarrow;": 8666,
          "Lmidot;": 319,
          "LongLeftArrow;": 10229,
          "LongLeftRightArrow;": 10231,
          "LongRightArrow;": 10230,
          "Longleftarrow;": 10232,
          "Longleftrightarrow;": 10234,
          "Longrightarrow;": 10233,
          "Lopf;": [55349, 56643],
          "LowerLeftArrow;": 8601,
          "LowerRightArrow;": 8600,
          "Lscr;": 8466,
          "Lsh;": 8624,
          "Lstrok;": 321,
          "Lt;": 8810,
          "Map;": 10501,
          "Mcy;": 1052,
          "MediumSpace;": 8287,
          "Mellintrf;": 8499,
          "Mfr;": [55349, 56592],
          "MinusPlus;": 8723,
          "Mopf;": [55349, 56644],
          "Mscr;": 8499,
          "Mu;": 924,
          "NJcy;": 1034,
          "Nacute;": 323,
          "Ncaron;": 327,
          "Ncedil;": 325,
          "Ncy;": 1053,
          "NegativeMediumSpace;": 8203,
          "NegativeThickSpace;": 8203,
          "NegativeThinSpace;": 8203,
          "NegativeVeryThinSpace;": 8203,
          "NestedGreaterGreater;": 8811,
          "NestedLessLess;": 8810,
          "NewLine;": 10,
          "Nfr;": [55349, 56593],
          "NoBreak;": 8288,
          "NonBreakingSpace;": 160,
          "Nopf;": 8469,
          "Not;": 10988,
          "NotCongruent;": 8802,
          "NotCupCap;": 8813,
          "NotDoubleVerticalBar;": 8742,
          "NotElement;": 8713,
          "NotEqual;": 8800,
          "NotEqualTilde;": [8770, 824],
          "NotExists;": 8708,
          "NotGreater;": 8815,
          "NotGreaterEqual;": 8817,
          "NotGreaterFullEqual;": [8807, 824],
          "NotGreaterGreater;": [8811, 824],
          "NotGreaterLess;": 8825,
          "NotGreaterSlantEqual;": [10878, 824],
          "NotGreaterTilde;": 8821,
          "NotHumpDownHump;": [8782, 824],
          "NotHumpEqual;": [8783, 824],
          "NotLeftTriangle;": 8938,
          "NotLeftTriangleBar;": [10703, 824],
          "NotLeftTriangleEqual;": 8940,
          "NotLess;": 8814,
          "NotLessEqual;": 8816,
          "NotLessGreater;": 8824,
          "NotLessLess;": [8810, 824],
          "NotLessSlantEqual;": [10877, 824],
          "NotLessTilde;": 8820,
          "NotNestedGreaterGreater;": [10914, 824],
          "NotNestedLessLess;": [10913, 824],
          "NotPrecedes;": 8832,
          "NotPrecedesEqual;": [10927, 824],
          "NotPrecedesSlantEqual;": 8928,
          "NotReverseElement;": 8716,
          "NotRightTriangle;": 8939,
          "NotRightTriangleBar;": [10704, 824],
          "NotRightTriangleEqual;": 8941,
          "NotSquareSubset;": [8847, 824],
          "NotSquareSubsetEqual;": 8930,
          "NotSquareSuperset;": [8848, 824],
          "NotSquareSupersetEqual;": 8931,
          "NotSubset;": [8834, 8402],
          "NotSubsetEqual;": 8840,
          "NotSucceeds;": 8833,
          "NotSucceedsEqual;": [10928, 824],
          "NotSucceedsSlantEqual;": 8929,
          "NotSucceedsTilde;": [8831, 824],
          "NotSuperset;": [8835, 8402],
          "NotSupersetEqual;": 8841,
          "NotTilde;": 8769,
          "NotTildeEqual;": 8772,
          "NotTildeFullEqual;": 8775,
          "NotTildeTilde;": 8777,
          "NotVerticalBar;": 8740,
          "Nscr;": [55349, 56489],
          Ntilde: 209,
          "Ntilde;": 209,
          "Nu;": 925,
          "OElig;": 338,
          Oacute: 211,
          "Oacute;": 211,
          Ocirc: 212,
          "Ocirc;": 212,
          "Ocy;": 1054,
          "Odblac;": 336,
          "Ofr;": [55349, 56594],
          Ograve: 210,
          "Ograve;": 210,
          "Omacr;": 332,
          "Omega;": 937,
          "Omicron;": 927,
          "Oopf;": [55349, 56646],
          "OpenCurlyDoubleQuote;": 8220,
          "OpenCurlyQuote;": 8216,
          "Or;": 10836,
          "Oscr;": [55349, 56490],
          Oslash: 216,
          "Oslash;": 216,
          Otilde: 213,
          "Otilde;": 213,
          "Otimes;": 10807,
          Ouml: 214,
          "Ouml;": 214,
          "OverBar;": 8254,
          "OverBrace;": 9182,
          "OverBracket;": 9140,
          "OverParenthesis;": 9180,
          "PartialD;": 8706,
          "Pcy;": 1055,
          "Pfr;": [55349, 56595],
          "Phi;": 934,
          "Pi;": 928,
          "PlusMinus;": 177,
          "Poincareplane;": 8460,
          "Popf;": 8473,
          "Pr;": 10939,
          "Precedes;": 8826,
          "PrecedesEqual;": 10927,
          "PrecedesSlantEqual;": 8828,
          "PrecedesTilde;": 8830,
          "Prime;": 8243,
          "Product;": 8719,
          "Proportion;": 8759,
          "Proportional;": 8733,
          "Pscr;": [55349, 56491],
          "Psi;": 936,
          QUOT: 34,
          "QUOT;": 34,
          "Qfr;": [55349, 56596],
          "Qopf;": 8474,
          "Qscr;": [55349, 56492],
          "RBarr;": 10512,
          REG: 174,
          "REG;": 174,
          "Racute;": 340,
          "Rang;": 10219,
          "Rarr;": 8608,
          "Rarrtl;": 10518,
          "Rcaron;": 344,
          "Rcedil;": 342,
          "Rcy;": 1056,
          "Re;": 8476,
          "ReverseElement;": 8715,
          "ReverseEquilibrium;": 8651,
          "ReverseUpEquilibrium;": 10607,
          "Rfr;": 8476,
          "Rho;": 929,
          "RightAngleBracket;": 10217,
          "RightArrow;": 8594,
          "RightArrowBar;": 8677,
          "RightArrowLeftArrow;": 8644,
          "RightCeiling;": 8969,
          "RightDoubleBracket;": 10215,
          "RightDownTeeVector;": 10589,
          "RightDownVector;": 8642,
          "RightDownVectorBar;": 10581,
          "RightFloor;": 8971,
          "RightTee;": 8866,
          "RightTeeArrow;": 8614,
          "RightTeeVector;": 10587,
          "RightTriangle;": 8883,
          "RightTriangleBar;": 10704,
          "RightTriangleEqual;": 8885,
          "RightUpDownVector;": 10575,
          "RightUpTeeVector;": 10588,
          "RightUpVector;": 8638,
          "RightUpVectorBar;": 10580,
          "RightVector;": 8640,
          "RightVectorBar;": 10579,
          "Rightarrow;": 8658,
          "Ropf;": 8477,
          "RoundImplies;": 10608,
          "Rrightarrow;": 8667,
          "Rscr;": 8475,
          "Rsh;": 8625,
          "RuleDelayed;": 10740,
          "SHCHcy;": 1065,
          "SHcy;": 1064,
          "SOFTcy;": 1068,
          "Sacute;": 346,
          "Sc;": 10940,
          "Scaron;": 352,
          "Scedil;": 350,
          "Scirc;": 348,
          "Scy;": 1057,
          "Sfr;": [55349, 56598],
          "ShortDownArrow;": 8595,
          "ShortLeftArrow;": 8592,
          "ShortRightArrow;": 8594,
          "ShortUpArrow;": 8593,
          "Sigma;": 931,
          "SmallCircle;": 8728,
          "Sopf;": [55349, 56650],
          "Sqrt;": 8730,
          "Square;": 9633,
          "SquareIntersection;": 8851,
          "SquareSubset;": 8847,
          "SquareSubsetEqual;": 8849,
          "SquareSuperset;": 8848,
          "SquareSupersetEqual;": 8850,
          "SquareUnion;": 8852,
          "Sscr;": [55349, 56494],
          "Star;": 8902,
          "Sub;": 8912,
          "Subset;": 8912,
          "SubsetEqual;": 8838,
          "Succeeds;": 8827,
          "SucceedsEqual;": 10928,
          "SucceedsSlantEqual;": 8829,
          "SucceedsTilde;": 8831,
          "SuchThat;": 8715,
          "Sum;": 8721,
          "Sup;": 8913,
          "Superset;": 8835,
          "SupersetEqual;": 8839,
          "Supset;": 8913,
          THORN: 222,
          "THORN;": 222,
          "TRADE;": 8482,
          "TSHcy;": 1035,
          "TScy;": 1062,
          "Tab;": 9,
          "Tau;": 932,
          "Tcaron;": 356,
          "Tcedil;": 354,
          "Tcy;": 1058,
          "Tfr;": [55349, 56599],
          "Therefore;": 8756,
          "Theta;": 920,
          "ThickSpace;": [8287, 8202],
          "ThinSpace;": 8201,
          "Tilde;": 8764,
          "TildeEqual;": 8771,
          "TildeFullEqual;": 8773,
          "TildeTilde;": 8776,
          "Topf;": [55349, 56651],
          "TripleDot;": 8411,
          "Tscr;": [55349, 56495],
          "Tstrok;": 358,
          Uacute: 218,
          "Uacute;": 218,
          "Uarr;": 8607,
          "Uarrocir;": 10569,
          "Ubrcy;": 1038,
          "Ubreve;": 364,
          Ucirc: 219,
          "Ucirc;": 219,
          "Ucy;": 1059,
          "Udblac;": 368,
          "Ufr;": [55349, 56600],
          Ugrave: 217,
          "Ugrave;": 217,
          "Umacr;": 362,
          "UnderBar;": 95,
          "UnderBrace;": 9183,
          "UnderBracket;": 9141,
          "UnderParenthesis;": 9181,
          "Union;": 8899,
          "UnionPlus;": 8846,
          "Uogon;": 370,
          "Uopf;": [55349, 56652],
          "UpArrow;": 8593,
          "UpArrowBar;": 10514,
          "UpArrowDownArrow;": 8645,
          "UpDownArrow;": 8597,
          "UpEquilibrium;": 10606,
          "UpTee;": 8869,
          "UpTeeArrow;": 8613,
          "Uparrow;": 8657,
          "Updownarrow;": 8661,
          "UpperLeftArrow;": 8598,
          "UpperRightArrow;": 8599,
          "Upsi;": 978,
          "Upsilon;": 933,
          "Uring;": 366,
          "Uscr;": [55349, 56496],
          "Utilde;": 360,
          Uuml: 220,
          "Uuml;": 220,
          "VDash;": 8875,
          "Vbar;": 10987,
          "Vcy;": 1042,
          "Vdash;": 8873,
          "Vdashl;": 10982,
          "Vee;": 8897,
          "Verbar;": 8214,
          "Vert;": 8214,
          "VerticalBar;": 8739,
          "VerticalLine;": 124,
          "VerticalSeparator;": 10072,
          "VerticalTilde;": 8768,
          "VeryThinSpace;": 8202,
          "Vfr;": [55349, 56601],
          "Vopf;": [55349, 56653],
          "Vscr;": [55349, 56497],
          "Vvdash;": 8874,
          "Wcirc;": 372,
          "Wedge;": 8896,
          "Wfr;": [55349, 56602],
          "Wopf;": [55349, 56654],
          "Wscr;": [55349, 56498],
          "Xfr;": [55349, 56603],
          "Xi;": 926,
          "Xopf;": [55349, 56655],
          "Xscr;": [55349, 56499],
          "YAcy;": 1071,
          "YIcy;": 1031,
          "YUcy;": 1070,
          Yacute: 221,
          "Yacute;": 221,
          "Ycirc;": 374,
          "Ycy;": 1067,
          "Yfr;": [55349, 56604],
          "Yopf;": [55349, 56656],
          "Yscr;": [55349, 56500],
          "Yuml;": 376,
          "ZHcy;": 1046,
          "Zacute;": 377,
          "Zcaron;": 381,
          "Zcy;": 1047,
          "Zdot;": 379,
          "ZeroWidthSpace;": 8203,
          "Zeta;": 918,
          "Zfr;": 8488,
          "Zopf;": 8484,
          "Zscr;": [55349, 56501],
          aacute: 225,
          "aacute;": 225,
          "abreve;": 259,
          "ac;": 8766,
          "acE;": [8766, 819],
          "acd;": 8767,
          acirc: 226,
          "acirc;": 226,
          acute: 180,
          "acute;": 180,
          "acy;": 1072,
          aelig: 230,
          "aelig;": 230,
          "af;": 8289,
          "afr;": [55349, 56606],
          agrave: 224,
          "agrave;": 224,
          "alefsym;": 8501,
          "aleph;": 8501,
          "alpha;": 945,
          "amacr;": 257,
          "amalg;": 10815,
          amp: 38,
          "amp;": 38,
          "and;": 8743,
          "andand;": 10837,
          "andd;": 10844,
          "andslope;": 10840,
          "andv;": 10842,
          "ang;": 8736,
          "ange;": 10660,
          "angle;": 8736,
          "angmsd;": 8737,
          "angmsdaa;": 10664,
          "angmsdab;": 10665,
          "angmsdac;": 10666,
          "angmsdad;": 10667,
          "angmsdae;": 10668,
          "angmsdaf;": 10669,
          "angmsdag;": 10670,
          "angmsdah;": 10671,
          "angrt;": 8735,
          "angrtvb;": 8894,
          "angrtvbd;": 10653,
          "angsph;": 8738,
          "angst;": 197,
          "angzarr;": 9084,
          "aogon;": 261,
          "aopf;": [55349, 56658],
          "ap;": 8776,
          "apE;": 10864,
          "apacir;": 10863,
          "ape;": 8778,
          "apid;": 8779,
          "apos;": 39,
          "approx;": 8776,
          "approxeq;": 8778,
          aring: 229,
          "aring;": 229,
          "ascr;": [55349, 56502],
          "ast;": 42,
          "asymp;": 8776,
          "asympeq;": 8781,
          atilde: 227,
          "atilde;": 227,
          auml: 228,
          "auml;": 228,
          "awconint;": 8755,
          "awint;": 10769,
          "bNot;": 10989,
          "backcong;": 8780,
          "backepsilon;": 1014,
          "backprime;": 8245,
          "backsim;": 8765,
          "backsimeq;": 8909,
          "barvee;": 8893,
          "barwed;": 8965,
          "barwedge;": 8965,
          "bbrk;": 9141,
          "bbrktbrk;": 9142,
          "bcong;": 8780,
          "bcy;": 1073,
          "bdquo;": 8222,
          "becaus;": 8757,
          "because;": 8757,
          "bemptyv;": 10672,
          "bepsi;": 1014,
          "bernou;": 8492,
          "beta;": 946,
          "beth;": 8502,
          "between;": 8812,
          "bfr;": [55349, 56607],
          "bigcap;": 8898,
          "bigcirc;": 9711,
          "bigcup;": 8899,
          "bigodot;": 10752,
          "bigoplus;": 10753,
          "bigotimes;": 10754,
          "bigsqcup;": 10758,
          "bigstar;": 9733,
          "bigtriangledown;": 9661,
          "bigtriangleup;": 9651,
          "biguplus;": 10756,
          "bigvee;": 8897,
          "bigwedge;": 8896,
          "bkarow;": 10509,
          "blacklozenge;": 10731,
          "blacksquare;": 9642,
          "blacktriangle;": 9652,
          "blacktriangledown;": 9662,
          "blacktriangleleft;": 9666,
          "blacktriangleright;": 9656,
          "blank;": 9251,
          "blk12;": 9618,
          "blk14;": 9617,
          "blk34;": 9619,
          "block;": 9608,
          "bne;": [61, 8421],
          "bnequiv;": [8801, 8421],
          "bnot;": 8976,
          "bopf;": [55349, 56659],
          "bot;": 8869,
          "bottom;": 8869,
          "bowtie;": 8904,
          "boxDL;": 9559,
          "boxDR;": 9556,
          "boxDl;": 9558,
          "boxDr;": 9555,
          "boxH;": 9552,
          "boxHD;": 9574,
          "boxHU;": 9577,
          "boxHd;": 9572,
          "boxHu;": 9575,
          "boxUL;": 9565,
          "boxUR;": 9562,
          "boxUl;": 9564,
          "boxUr;": 9561,
          "boxV;": 9553,
          "boxVH;": 9580,
          "boxVL;": 9571,
          "boxVR;": 9568,
          "boxVh;": 9579,
          "boxVl;": 9570,
          "boxVr;": 9567,
          "boxbox;": 10697,
          "boxdL;": 9557,
          "boxdR;": 9554,
          "boxdl;": 9488,
          "boxdr;": 9484,
          "boxh;": 9472,
          "boxhD;": 9573,
          "boxhU;": 9576,
          "boxhd;": 9516,
          "boxhu;": 9524,
          "boxminus;": 8863,
          "boxplus;": 8862,
          "boxtimes;": 8864,
          "boxuL;": 9563,
          "boxuR;": 9560,
          "boxul;": 9496,
          "boxur;": 9492,
          "boxv;": 9474,
          "boxvH;": 9578,
          "boxvL;": 9569,
          "boxvR;": 9566,
          "boxvh;": 9532,
          "boxvl;": 9508,
          "boxvr;": 9500,
          "bprime;": 8245,
          "breve;": 728,
          brvbar: 166,
          "brvbar;": 166,
          "bscr;": [55349, 56503],
          "bsemi;": 8271,
          "bsim;": 8765,
          "bsime;": 8909,
          "bsol;": 92,
          "bsolb;": 10693,
          "bsolhsub;": 10184,
          "bull;": 8226,
          "bullet;": 8226,
          "bump;": 8782,
          "bumpE;": 10926,
          "bumpe;": 8783,
          "bumpeq;": 8783,
          "cacute;": 263,
          "cap;": 8745,
          "capand;": 10820,
          "capbrcup;": 10825,
          "capcap;": 10827,
          "capcup;": 10823,
          "capdot;": 10816,
          "caps;": [8745, 65024],
          "caret;": 8257,
          "caron;": 711,
          "ccaps;": 10829,
          "ccaron;": 269,
          ccedil: 231,
          "ccedil;": 231,
          "ccirc;": 265,
          "ccups;": 10828,
          "ccupssm;": 10832,
          "cdot;": 267,
          cedil: 184,
          "cedil;": 184,
          "cemptyv;": 10674,
          cent: 162,
          "cent;": 162,
          "centerdot;": 183,
          "cfr;": [55349, 56608],
          "chcy;": 1095,
          "check;": 10003,
          "checkmark;": 10003,
          "chi;": 967,
          "cir;": 9675,
          "cirE;": 10691,
          "circ;": 710,
          "circeq;": 8791,
          "circlearrowleft;": 8634,
          "circlearrowright;": 8635,
          "circledR;": 174,
          "circledS;": 9416,
          "circledast;": 8859,
          "circledcirc;": 8858,
          "circleddash;": 8861,
          "cire;": 8791,
          "cirfnint;": 10768,
          "cirmid;": 10991,
          "cirscir;": 10690,
          "clubs;": 9827,
          "clubsuit;": 9827,
          "colon;": 58,
          "colone;": 8788,
          "coloneq;": 8788,
          "comma;": 44,
          "commat;": 64,
          "comp;": 8705,
          "compfn;": 8728,
          "complement;": 8705,
          "complexes;": 8450,
          "cong;": 8773,
          "congdot;": 10861,
          "conint;": 8750,
          "copf;": [55349, 56660],
          "coprod;": 8720,
          copy: 169,
          "copy;": 169,
          "copysr;": 8471,
          "crarr;": 8629,
          "cross;": 10007,
          "cscr;": [55349, 56504],
          "csub;": 10959,
          "csube;": 10961,
          "csup;": 10960,
          "csupe;": 10962,
          "ctdot;": 8943,
          "cudarrl;": 10552,
          "cudarrr;": 10549,
          "cuepr;": 8926,
          "cuesc;": 8927,
          "cularr;": 8630,
          "cularrp;": 10557,
          "cup;": 8746,
          "cupbrcap;": 10824,
          "cupcap;": 10822,
          "cupcup;": 10826,
          "cupdot;": 8845,
          "cupor;": 10821,
          "cups;": [8746, 65024],
          "curarr;": 8631,
          "curarrm;": 10556,
          "curlyeqprec;": 8926,
          "curlyeqsucc;": 8927,
          "curlyvee;": 8910,
          "curlywedge;": 8911,
          curren: 164,
          "curren;": 164,
          "curvearrowleft;": 8630,
          "curvearrowright;": 8631,
          "cuvee;": 8910,
          "cuwed;": 8911,
          "cwconint;": 8754,
          "cwint;": 8753,
          "cylcty;": 9005,
          "dArr;": 8659,
          "dHar;": 10597,
          "dagger;": 8224,
          "daleth;": 8504,
          "darr;": 8595,
          "dash;": 8208,
          "dashv;": 8867,
          "dbkarow;": 10511,
          "dblac;": 733,
          "dcaron;": 271,
          "dcy;": 1076,
          "dd;": 8518,
          "ddagger;": 8225,
          "ddarr;": 8650,
          "ddotseq;": 10871,
          deg: 176,
          "deg;": 176,
          "delta;": 948,
          "demptyv;": 10673,
          "dfisht;": 10623,
          "dfr;": [55349, 56609],
          "dharl;": 8643,
          "dharr;": 8642,
          "diam;": 8900,
          "diamond;": 8900,
          "diamondsuit;": 9830,
          "diams;": 9830,
          "die;": 168,
          "digamma;": 989,
          "disin;": 8946,
          "div;": 247,
          divide: 247,
          "divide;": 247,
          "divideontimes;": 8903,
          "divonx;": 8903,
          "djcy;": 1106,
          "dlcorn;": 8990,
          "dlcrop;": 8973,
          "dollar;": 36,
          "dopf;": [55349, 56661],
          "dot;": 729,
          "doteq;": 8784,
          "doteqdot;": 8785,
          "dotminus;": 8760,
          "dotplus;": 8724,
          "dotsquare;": 8865,
          "doublebarwedge;": 8966,
          "downarrow;": 8595,
          "downdownarrows;": 8650,
          "downharpoonleft;": 8643,
          "downharpoonright;": 8642,
          "drbkarow;": 10512,
          "drcorn;": 8991,
          "drcrop;": 8972,
          "dscr;": [55349, 56505],
          "dscy;": 1109,
          "dsol;": 10742,
          "dstrok;": 273,
          "dtdot;": 8945,
          "dtri;": 9663,
          "dtrif;": 9662,
          "duarr;": 8693,
          "duhar;": 10607,
          "dwangle;": 10662,
          "dzcy;": 1119,
          "dzigrarr;": 10239,
          "eDDot;": 10871,
          "eDot;": 8785,
          eacute: 233,
          "eacute;": 233,
          "easter;": 10862,
          "ecaron;": 283,
          "ecir;": 8790,
          ecirc: 234,
          "ecirc;": 234,
          "ecolon;": 8789,
          "ecy;": 1101,
          "edot;": 279,
          "ee;": 8519,
          "efDot;": 8786,
          "efr;": [55349, 56610],
          "eg;": 10906,
          egrave: 232,
          "egrave;": 232,
          "egs;": 10902,
          "egsdot;": 10904,
          "el;": 10905,
          "elinters;": 9191,
          "ell;": 8467,
          "els;": 10901,
          "elsdot;": 10903,
          "emacr;": 275,
          "empty;": 8709,
          "emptyset;": 8709,
          "emptyv;": 8709,
          "emsp13;": 8196,
          "emsp14;": 8197,
          "emsp;": 8195,
          "eng;": 331,
          "ensp;": 8194,
          "eogon;": 281,
          "eopf;": [55349, 56662],
          "epar;": 8917,
          "eparsl;": 10723,
          "eplus;": 10865,
          "epsi;": 949,
          "epsilon;": 949,
          "epsiv;": 1013,
          "eqcirc;": 8790,
          "eqcolon;": 8789,
          "eqsim;": 8770,
          "eqslantgtr;": 10902,
          "eqslantless;": 10901,
          "equals;": 61,
          "equest;": 8799,
          "equiv;": 8801,
          "equivDD;": 10872,
          "eqvparsl;": 10725,
          "erDot;": 8787,
          "erarr;": 10609,
          "escr;": 8495,
          "esdot;": 8784,
          "esim;": 8770,
          "eta;": 951,
          eth: 240,
          "eth;": 240,
          euml: 235,
          "euml;": 235,
          "euro;": 8364,
          "excl;": 33,
          "exist;": 8707,
          "expectation;": 8496,
          "exponentiale;": 8519,
          "fallingdotseq;": 8786,
          "fcy;": 1092,
          "female;": 9792,
          "ffilig;": 64259,
          "fflig;": 64256,
          "ffllig;": 64260,
          "ffr;": [55349, 56611],
          "filig;": 64257,
          "fjlig;": [102, 106],
          "flat;": 9837,
          "fllig;": 64258,
          "fltns;": 9649,
          "fnof;": 402,
          "fopf;": [55349, 56663],
          "forall;": 8704,
          "fork;": 8916,
          "forkv;": 10969,
          "fpartint;": 10765,
          frac12: 189,
          "frac12;": 189,
          "frac13;": 8531,
          frac14: 188,
          "frac14;": 188,
          "frac15;": 8533,
          "frac16;": 8537,
          "frac18;": 8539,
          "frac23;": 8532,
          "frac25;": 8534,
          frac34: 190,
          "frac34;": 190,
          "frac35;": 8535,
          "frac38;": 8540,
          "frac45;": 8536,
          "frac56;": 8538,
          "frac58;": 8541,
          "frac78;": 8542,
          "frasl;": 8260,
          "frown;": 8994,
          "fscr;": [55349, 56507],
          "gE;": 8807,
          "gEl;": 10892,
          "gacute;": 501,
          "gamma;": 947,
          "gammad;": 989,
          "gap;": 10886,
          "gbreve;": 287,
          "gcirc;": 285,
          "gcy;": 1075,
          "gdot;": 289,
          "ge;": 8805,
          "gel;": 8923,
          "geq;": 8805,
          "geqq;": 8807,
          "geqslant;": 10878,
          "ges;": 10878,
          "gescc;": 10921,
          "gesdot;": 10880,
          "gesdoto;": 10882,
          "gesdotol;": 10884,
          "gesl;": [8923, 65024],
          "gesles;": 10900,
          "gfr;": [55349, 56612],
          "gg;": 8811,
          "ggg;": 8921,
          "gimel;": 8503,
          "gjcy;": 1107,
          "gl;": 8823,
          "glE;": 10898,
          "gla;": 10917,
          "glj;": 10916,
          "gnE;": 8809,
          "gnap;": 10890,
          "gnapprox;": 10890,
          "gne;": 10888,
          "gneq;": 10888,
          "gneqq;": 8809,
          "gnsim;": 8935,
          "gopf;": [55349, 56664],
          "grave;": 96,
          "gscr;": 8458,
          "gsim;": 8819,
          "gsime;": 10894,
          "gsiml;": 10896,
          gt: 62,
          "gt;": 62,
          "gtcc;": 10919,
          "gtcir;": 10874,
          "gtdot;": 8919,
          "gtlPar;": 10645,
          "gtquest;": 10876,
          "gtrapprox;": 10886,
          "gtrarr;": 10616,
          "gtrdot;": 8919,
          "gtreqless;": 8923,
          "gtreqqless;": 10892,
          "gtrless;": 8823,
          "gtrsim;": 8819,
          "gvertneqq;": [8809, 65024],
          "gvnE;": [8809, 65024],
          "hArr;": 8660,
          "hairsp;": 8202,
          "half;": 189,
          "hamilt;": 8459,
          "hardcy;": 1098,
          "harr;": 8596,
          "harrcir;": 10568,
          "harrw;": 8621,
          "hbar;": 8463,
          "hcirc;": 293,
          "hearts;": 9829,
          "heartsuit;": 9829,
          "hellip;": 8230,
          "hercon;": 8889,
          "hfr;": [55349, 56613],
          "hksearow;": 10533,
          "hkswarow;": 10534,
          "hoarr;": 8703,
          "homtht;": 8763,
          "hookleftarrow;": 8617,
          "hookrightarrow;": 8618,
          "hopf;": [55349, 56665],
          "horbar;": 8213,
          "hscr;": [55349, 56509],
          "hslash;": 8463,
          "hstrok;": 295,
          "hybull;": 8259,
          "hyphen;": 8208,
          iacute: 237,
          "iacute;": 237,
          "ic;": 8291,
          icirc: 238,
          "icirc;": 238,
          "icy;": 1080,
          "iecy;": 1077,
          iexcl: 161,
          "iexcl;": 161,
          "iff;": 8660,
          "ifr;": [55349, 56614],
          igrave: 236,
          "igrave;": 236,
          "ii;": 8520,
          "iiiint;": 10764,
          "iiint;": 8749,
          "iinfin;": 10716,
          "iiota;": 8489,
          "ijlig;": 307,
          "imacr;": 299,
          "image;": 8465,
          "imagline;": 8464,
          "imagpart;": 8465,
          "imath;": 305,
          "imof;": 8887,
          "imped;": 437,
          "in;": 8712,
          "incare;": 8453,
          "infin;": 8734,
          "infintie;": 10717,
          "inodot;": 305,
          "int;": 8747,
          "intcal;": 8890,
          "integers;": 8484,
          "intercal;": 8890,
          "intlarhk;": 10775,
          "intprod;": 10812,
          "iocy;": 1105,
          "iogon;": 303,
          "iopf;": [55349, 56666],
          "iota;": 953,
          "iprod;": 10812,
          iquest: 191,
          "iquest;": 191,
          "iscr;": [55349, 56510],
          "isin;": 8712,
          "isinE;": 8953,
          "isindot;": 8949,
          "isins;": 8948,
          "isinsv;": 8947,
          "isinv;": 8712,
          "it;": 8290,
          "itilde;": 297,
          "iukcy;": 1110,
          iuml: 239,
          "iuml;": 239,
          "jcirc;": 309,
          "jcy;": 1081,
          "jfr;": [55349, 56615],
          "jmath;": 567,
          "jopf;": [55349, 56667],
          "jscr;": [55349, 56511],
          "jsercy;": 1112,
          "jukcy;": 1108,
          "kappa;": 954,
          "kappav;": 1008,
          "kcedil;": 311,
          "kcy;": 1082,
          "kfr;": [55349, 56616],
          "kgreen;": 312,
          "khcy;": 1093,
          "kjcy;": 1116,
          "kopf;": [55349, 56668],
          "kscr;": [55349, 56512],
          "lAarr;": 8666,
          "lArr;": 8656,
          "lAtail;": 10523,
          "lBarr;": 10510,
          "lE;": 8806,
          "lEg;": 10891,
          "lHar;": 10594,
          "lacute;": 314,
          "laemptyv;": 10676,
          "lagran;": 8466,
          "lambda;": 955,
          "lang;": 10216,
          "langd;": 10641,
          "langle;": 10216,
          "lap;": 10885,
          laquo: 171,
          "laquo;": 171,
          "larr;": 8592,
          "larrb;": 8676,
          "larrbfs;": 10527,
          "larrfs;": 10525,
          "larrhk;": 8617,
          "larrlp;": 8619,
          "larrpl;": 10553,
          "larrsim;": 10611,
          "larrtl;": 8610,
          "lat;": 10923,
          "latail;": 10521,
          "late;": 10925,
          "lates;": [10925, 65024],
          "lbarr;": 10508,
          "lbbrk;": 10098,
          "lbrace;": 123,
          "lbrack;": 91,
          "lbrke;": 10635,
          "lbrksld;": 10639,
          "lbrkslu;": 10637,
          "lcaron;": 318,
          "lcedil;": 316,
          "lceil;": 8968,
          "lcub;": 123,
          "lcy;": 1083,
          "ldca;": 10550,
          "ldquo;": 8220,
          "ldquor;": 8222,
          "ldrdhar;": 10599,
          "ldrushar;": 10571,
          "ldsh;": 8626,
          "le;": 8804,
          "leftarrow;": 8592,
          "leftarrowtail;": 8610,
          "leftharpoondown;": 8637,
          "leftharpoonup;": 8636,
          "leftleftarrows;": 8647,
          "leftrightarrow;": 8596,
          "leftrightarrows;": 8646,
          "leftrightharpoons;": 8651,
          "leftrightsquigarrow;": 8621,
          "leftthreetimes;": 8907,
          "leg;": 8922,
          "leq;": 8804,
          "leqq;": 8806,
          "leqslant;": 10877,
          "les;": 10877,
          "lescc;": 10920,
          "lesdot;": 10879,
          "lesdoto;": 10881,
          "lesdotor;": 10883,
          "lesg;": [8922, 65024],
          "lesges;": 10899,
          "lessapprox;": 10885,
          "lessdot;": 8918,
          "lesseqgtr;": 8922,
          "lesseqqgtr;": 10891,
          "lessgtr;": 8822,
          "lesssim;": 8818,
          "lfisht;": 10620,
          "lfloor;": 8970,
          "lfr;": [55349, 56617],
          "lg;": 8822,
          "lgE;": 10897,
          "lhard;": 8637,
          "lharu;": 8636,
          "lharul;": 10602,
          "lhblk;": 9604,
          "ljcy;": 1113,
          "ll;": 8810,
          "llarr;": 8647,
          "llcorner;": 8990,
          "llhard;": 10603,
          "lltri;": 9722,
          "lmidot;": 320,
          "lmoust;": 9136,
          "lmoustache;": 9136,
          "lnE;": 8808,
          "lnap;": 10889,
          "lnapprox;": 10889,
          "lne;": 10887,
          "lneq;": 10887,
          "lneqq;": 8808,
          "lnsim;": 8934,
          "loang;": 10220,
          "loarr;": 8701,
          "lobrk;": 10214,
          "longleftarrow;": 10229,
          "longleftrightarrow;": 10231,
          "longmapsto;": 10236,
          "longrightarrow;": 10230,
          "looparrowleft;": 8619,
          "looparrowright;": 8620,
          "lopar;": 10629,
          "lopf;": [55349, 56669],
          "loplus;": 10797,
          "lotimes;": 10804,
          "lowast;": 8727,
          "lowbar;": 95,
          "loz;": 9674,
          "lozenge;": 9674,
          "lozf;": 10731,
          "lpar;": 40,
          "lparlt;": 10643,
          "lrarr;": 8646,
          "lrcorner;": 8991,
          "lrhar;": 8651,
          "lrhard;": 10605,
          "lrm;": 8206,
          "lrtri;": 8895,
          "lsaquo;": 8249,
          "lscr;": [55349, 56513],
          "lsh;": 8624,
          "lsim;": 8818,
          "lsime;": 10893,
          "lsimg;": 10895,
          "lsqb;": 91,
          "lsquo;": 8216,
          "lsquor;": 8218,
          "lstrok;": 322,
          lt: 60,
          "lt;": 60,
          "ltcc;": 10918,
          "ltcir;": 10873,
          "ltdot;": 8918,
          "lthree;": 8907,
          "ltimes;": 8905,
          "ltlarr;": 10614,
          "ltquest;": 10875,
          "ltrPar;": 10646,
          "ltri;": 9667,
          "ltrie;": 8884,
          "ltrif;": 9666,
          "lurdshar;": 10570,
          "luruhar;": 10598,
          "lvertneqq;": [8808, 65024],
          "lvnE;": [8808, 65024],
          "mDDot;": 8762,
          macr: 175,
          "macr;": 175,
          "male;": 9794,
          "malt;": 10016,
          "maltese;": 10016,
          "map;": 8614,
          "mapsto;": 8614,
          "mapstodown;": 8615,
          "mapstoleft;": 8612,
          "mapstoup;": 8613,
          "marker;": 9646,
          "mcomma;": 10793,
          "mcy;": 1084,
          "mdash;": 8212,
          "measuredangle;": 8737,
          "mfr;": [55349, 56618],
          "mho;": 8487,
          micro: 181,
          "micro;": 181,
          "mid;": 8739,
          "midast;": 42,
          "midcir;": 10992,
          middot: 183,
          "middot;": 183,
          "minus;": 8722,
          "minusb;": 8863,
          "minusd;": 8760,
          "minusdu;": 10794,
          "mlcp;": 10971,
          "mldr;": 8230,
          "mnplus;": 8723,
          "models;": 8871,
          "mopf;": [55349, 56670],
          "mp;": 8723,
          "mscr;": [55349, 56514],
          "mstpos;": 8766,
          "mu;": 956,
          "multimap;": 8888,
          "mumap;": 8888,
          "nGg;": [8921, 824],
          "nGt;": [8811, 8402],
          "nGtv;": [8811, 824],
          "nLeftarrow;": 8653,
          "nLeftrightarrow;": 8654,
          "nLl;": [8920, 824],
          "nLt;": [8810, 8402],
          "nLtv;": [8810, 824],
          "nRightarrow;": 8655,
          "nVDash;": 8879,
          "nVdash;": 8878,
          "nabla;": 8711,
          "nacute;": 324,
          "nang;": [8736, 8402],
          "nap;": 8777,
          "napE;": [10864, 824],
          "napid;": [8779, 824],
          "napos;": 329,
          "napprox;": 8777,
          "natur;": 9838,
          "natural;": 9838,
          "naturals;": 8469,
          nbsp: 160,
          "nbsp;": 160,
          "nbump;": [8782, 824],
          "nbumpe;": [8783, 824],
          "ncap;": 10819,
          "ncaron;": 328,
          "ncedil;": 326,
          "ncong;": 8775,
          "ncongdot;": [10861, 824],
          "ncup;": 10818,
          "ncy;": 1085,
          "ndash;": 8211,
          "ne;": 8800,
          "neArr;": 8663,
          "nearhk;": 10532,
          "nearr;": 8599,
          "nearrow;": 8599,
          "nedot;": [8784, 824],
          "nequiv;": 8802,
          "nesear;": 10536,
          "nesim;": [8770, 824],
          "nexist;": 8708,
          "nexists;": 8708,
          "nfr;": [55349, 56619],
          "ngE;": [8807, 824],
          "nge;": 8817,
          "ngeq;": 8817,
          "ngeqq;": [8807, 824],
          "ngeqslant;": [10878, 824],
          "nges;": [10878, 824],
          "ngsim;": 8821,
          "ngt;": 8815,
          "ngtr;": 8815,
          "nhArr;": 8654,
          "nharr;": 8622,
          "nhpar;": 10994,
          "ni;": 8715,
          "nis;": 8956,
          "nisd;": 8954,
          "niv;": 8715,
          "njcy;": 1114,
          "nlArr;": 8653,
          "nlE;": [8806, 824],
          "nlarr;": 8602,
          "nldr;": 8229,
          "nle;": 8816,
          "nleftarrow;": 8602,
          "nleftrightarrow;": 8622,
          "nleq;": 8816,
          "nleqq;": [8806, 824],
          "nleqslant;": [10877, 824],
          "nles;": [10877, 824],
          "nless;": 8814,
          "nlsim;": 8820,
          "nlt;": 8814,
          "nltri;": 8938,
          "nltrie;": 8940,
          "nmid;": 8740,
          "nopf;": [55349, 56671],
          not: 172,
          "not;": 172,
          "notin;": 8713,
          "notinE;": [8953, 824],
          "notindot;": [8949, 824],
          "notinva;": 8713,
          "notinvb;": 8951,
          "notinvc;": 8950,
          "notni;": 8716,
          "notniva;": 8716,
          "notnivb;": 8958,
          "notnivc;": 8957,
          "npar;": 8742,
          "nparallel;": 8742,
          "nparsl;": [11005, 8421],
          "npart;": [8706, 824],
          "npolint;": 10772,
          "npr;": 8832,
          "nprcue;": 8928,
          "npre;": [10927, 824],
          "nprec;": 8832,
          "npreceq;": [10927, 824],
          "nrArr;": 8655,
          "nrarr;": 8603,
          "nrarrc;": [10547, 824],
          "nrarrw;": [8605, 824],
          "nrightarrow;": 8603,
          "nrtri;": 8939,
          "nrtrie;": 8941,
          "nsc;": 8833,
          "nsccue;": 8929,
          "nsce;": [10928, 824],
          "nscr;": [55349, 56515],
          "nshortmid;": 8740,
          "nshortparallel;": 8742,
          "nsim;": 8769,
          "nsime;": 8772,
          "nsimeq;": 8772,
          "nsmid;": 8740,
          "nspar;": 8742,
          "nsqsube;": 8930,
          "nsqsupe;": 8931,
          "nsub;": 8836,
          "nsubE;": [10949, 824],
          "nsube;": 8840,
          "nsubset;": [8834, 8402],
          "nsubseteq;": 8840,
          "nsubseteqq;": [10949, 824],
          "nsucc;": 8833,
          "nsucceq;": [10928, 824],
          "nsup;": 8837,
          "nsupE;": [10950, 824],
          "nsupe;": 8841,
          "nsupset;": [8835, 8402],
          "nsupseteq;": 8841,
          "nsupseteqq;": [10950, 824],
          "ntgl;": 8825,
          ntilde: 241,
          "ntilde;": 241,
          "ntlg;": 8824,
          "ntriangleleft;": 8938,
          "ntrianglelefteq;": 8940,
          "ntriangleright;": 8939,
          "ntrianglerighteq;": 8941,
          "nu;": 957,
          "num;": 35,
          "numero;": 8470,
          "numsp;": 8199,
          "nvDash;": 8877,
          "nvHarr;": 10500,
          "nvap;": [8781, 8402],
          "nvdash;": 8876,
          "nvge;": [8805, 8402],
          "nvgt;": [62, 8402],
          "nvinfin;": 10718,
          "nvlArr;": 10498,
          "nvle;": [8804, 8402],
          "nvlt;": [60, 8402],
          "nvltrie;": [8884, 8402],
          "nvrArr;": 10499,
          "nvrtrie;": [8885, 8402],
          "nvsim;": [8764, 8402],
          "nwArr;": 8662,
          "nwarhk;": 10531,
          "nwarr;": 8598,
          "nwarrow;": 8598,
          "nwnear;": 10535,
          "oS;": 9416,
          oacute: 243,
          "oacute;": 243,
          "oast;": 8859,
          "ocir;": 8858,
          ocirc: 244,
          "ocirc;": 244,
          "ocy;": 1086,
          "odash;": 8861,
          "odblac;": 337,
          "odiv;": 10808,
          "odot;": 8857,
          "odsold;": 10684,
          "oelig;": 339,
          "ofcir;": 10687,
          "ofr;": [55349, 56620],
          "ogon;": 731,
          ograve: 242,
          "ograve;": 242,
          "ogt;": 10689,
          "ohbar;": 10677,
          "ohm;": 937,
          "oint;": 8750,
          "olarr;": 8634,
          "olcir;": 10686,
          "olcross;": 10683,
          "oline;": 8254,
          "olt;": 10688,
          "omacr;": 333,
          "omega;": 969,
          "omicron;": 959,
          "omid;": 10678,
          "ominus;": 8854,
          "oopf;": [55349, 56672],
          "opar;": 10679,
          "operp;": 10681,
          "oplus;": 8853,
          "or;": 8744,
          "orarr;": 8635,
          "ord;": 10845,
          "order;": 8500,
          "orderof;": 8500,
          ordf: 170,
          "ordf;": 170,
          ordm: 186,
          "ordm;": 186,
          "origof;": 8886,
          "oror;": 10838,
          "orslope;": 10839,
          "orv;": 10843,
          "oscr;": 8500,
          oslash: 248,
          "oslash;": 248,
          "osol;": 8856,
          otilde: 245,
          "otilde;": 245,
          "otimes;": 8855,
          "otimesas;": 10806,
          ouml: 246,
          "ouml;": 246,
          "ovbar;": 9021,
          "par;": 8741,
          para: 182,
          "para;": 182,
          "parallel;": 8741,
          "parsim;": 10995,
          "parsl;": 11005,
          "part;": 8706,
          "pcy;": 1087,
          "percnt;": 37,
          "period;": 46,
          "permil;": 8240,
          "perp;": 8869,
          "pertenk;": 8241,
          "pfr;": [55349, 56621],
          "phi;": 966,
          "phiv;": 981,
          "phmmat;": 8499,
          "phone;": 9742,
          "pi;": 960,
          "pitchfork;": 8916,
          "piv;": 982,
          "planck;": 8463,
          "planckh;": 8462,
          "plankv;": 8463,
          "plus;": 43,
          "plusacir;": 10787,
          "plusb;": 8862,
          "pluscir;": 10786,
          "plusdo;": 8724,
          "plusdu;": 10789,
          "pluse;": 10866,
          plusmn: 177,
          "plusmn;": 177,
          "plussim;": 10790,
          "plustwo;": 10791,
          "pm;": 177,
          "pointint;": 10773,
          "popf;": [55349, 56673],
          pound: 163,
          "pound;": 163,
          "pr;": 8826,
          "prE;": 10931,
          "prap;": 10935,
          "prcue;": 8828,
          "pre;": 10927,
          "prec;": 8826,
          "precapprox;": 10935,
          "preccurlyeq;": 8828,
          "preceq;": 10927,
          "precnapprox;": 10937,
          "precneqq;": 10933,
          "precnsim;": 8936,
          "precsim;": 8830,
          "prime;": 8242,
          "primes;": 8473,
          "prnE;": 10933,
          "prnap;": 10937,
          "prnsim;": 8936,
          "prod;": 8719,
          "profalar;": 9006,
          "profline;": 8978,
          "profsurf;": 8979,
          "prop;": 8733,
          "propto;": 8733,
          "prsim;": 8830,
          "prurel;": 8880,
          "pscr;": [55349, 56517],
          "psi;": 968,
          "puncsp;": 8200,
          "qfr;": [55349, 56622],
          "qint;": 10764,
          "qopf;": [55349, 56674],
          "qprime;": 8279,
          "qscr;": [55349, 56518],
          "quaternions;": 8461,
          "quatint;": 10774,
          "quest;": 63,
          "questeq;": 8799,
          quot: 34,
          "quot;": 34,
          "rAarr;": 8667,
          "rArr;": 8658,
          "rAtail;": 10524,
          "rBarr;": 10511,
          "rHar;": 10596,
          "race;": [8765, 817],
          "racute;": 341,
          "radic;": 8730,
          "raemptyv;": 10675,
          "rang;": 10217,
          "rangd;": 10642,
          "range;": 10661,
          "rangle;": 10217,
          raquo: 187,
          "raquo;": 187,
          "rarr;": 8594,
          "rarrap;": 10613,
          "rarrb;": 8677,
          "rarrbfs;": 10528,
          "rarrc;": 10547,
          "rarrfs;": 10526,
          "rarrhk;": 8618,
          "rarrlp;": 8620,
          "rarrpl;": 10565,
          "rarrsim;": 10612,
          "rarrtl;": 8611,
          "rarrw;": 8605,
          "ratail;": 10522,
          "ratio;": 8758,
          "rationals;": 8474,
          "rbarr;": 10509,
          "rbbrk;": 10099,
          "rbrace;": 125,
          "rbrack;": 93,
          "rbrke;": 10636,
          "rbrksld;": 10638,
          "rbrkslu;": 10640,
          "rcaron;": 345,
          "rcedil;": 343,
          "rceil;": 8969,
          "rcub;": 125,
          "rcy;": 1088,
          "rdca;": 10551,
          "rdldhar;": 10601,
          "rdquo;": 8221,
          "rdquor;": 8221,
          "rdsh;": 8627,
          "real;": 8476,
          "realine;": 8475,
          "realpart;": 8476,
          "reals;": 8477,
          "rect;": 9645,
          reg: 174,
          "reg;": 174,
          "rfisht;": 10621,
          "rfloor;": 8971,
          "rfr;": [55349, 56623],
          "rhard;": 8641,
          "rharu;": 8640,
          "rharul;": 10604,
          "rho;": 961,
          "rhov;": 1009,
          "rightarrow;": 8594,
          "rightarrowtail;": 8611,
          "rightharpoondown;": 8641,
          "rightharpoonup;": 8640,
          "rightleftarrows;": 8644,
          "rightleftharpoons;": 8652,
          "rightrightarrows;": 8649,
          "rightsquigarrow;": 8605,
          "rightthreetimes;": 8908,
          "ring;": 730,
          "risingdotseq;": 8787,
          "rlarr;": 8644,
          "rlhar;": 8652,
          "rlm;": 8207,
          "rmoust;": 9137,
          "rmoustache;": 9137,
          "rnmid;": 10990,
          "roang;": 10221,
          "roarr;": 8702,
          "robrk;": 10215,
          "ropar;": 10630,
          "ropf;": [55349, 56675],
          "roplus;": 10798,
          "rotimes;": 10805,
          "rpar;": 41,
          "rpargt;": 10644,
          "rppolint;": 10770,
          "rrarr;": 8649,
          "rsaquo;": 8250,
          "rscr;": [55349, 56519],
          "rsh;": 8625,
          "rsqb;": 93,
          "rsquo;": 8217,
          "rsquor;": 8217,
          "rthree;": 8908,
          "rtimes;": 8906,
          "rtri;": 9657,
          "rtrie;": 8885,
          "rtrif;": 9656,
          "rtriltri;": 10702,
          "ruluhar;": 10600,
          "rx;": 8478,
          "sacute;": 347,
          "sbquo;": 8218,
          "sc;": 8827,
          "scE;": 10932,
          "scap;": 10936,
          "scaron;": 353,
          "sccue;": 8829,
          "sce;": 10928,
          "scedil;": 351,
          "scirc;": 349,
          "scnE;": 10934,
          "scnap;": 10938,
          "scnsim;": 8937,
          "scpolint;": 10771,
          "scsim;": 8831,
          "scy;": 1089,
          "sdot;": 8901,
          "sdotb;": 8865,
          "sdote;": 10854,
          "seArr;": 8664,
          "searhk;": 10533,
          "searr;": 8600,
          "searrow;": 8600,
          sect: 167,
          "sect;": 167,
          "semi;": 59,
          "seswar;": 10537,
          "setminus;": 8726,
          "setmn;": 8726,
          "sext;": 10038,
          "sfr;": [55349, 56624],
          "sfrown;": 8994,
          "sharp;": 9839,
          "shchcy;": 1097,
          "shcy;": 1096,
          "shortmid;": 8739,
          "shortparallel;": 8741,
          shy: 173,
          "shy;": 173,
          "sigma;": 963,
          "sigmaf;": 962,
          "sigmav;": 962,
          "sim;": 8764,
          "simdot;": 10858,
          "sime;": 8771,
          "simeq;": 8771,
          "simg;": 10910,
          "simgE;": 10912,
          "siml;": 10909,
          "simlE;": 10911,
          "simne;": 8774,
          "simplus;": 10788,
          "simrarr;": 10610,
          "slarr;": 8592,
          "smallsetminus;": 8726,
          "smashp;": 10803,
          "smeparsl;": 10724,
          "smid;": 8739,
          "smile;": 8995,
          "smt;": 10922,
          "smte;": 10924,
          "smtes;": [10924, 65024],
          "softcy;": 1100,
          "sol;": 47,
          "solb;": 10692,
          "solbar;": 9023,
          "sopf;": [55349, 56676],
          "spades;": 9824,
          "spadesuit;": 9824,
          "spar;": 8741,
          "sqcap;": 8851,
          "sqcaps;": [8851, 65024],
          "sqcup;": 8852,
          "sqcups;": [8852, 65024],
          "sqsub;": 8847,
          "sqsube;": 8849,
          "sqsubset;": 8847,
          "sqsubseteq;": 8849,
          "sqsup;": 8848,
          "sqsupe;": 8850,
          "sqsupset;": 8848,
          "sqsupseteq;": 8850,
          "squ;": 9633,
          "square;": 9633,
          "squarf;": 9642,
          "squf;": 9642,
          "srarr;": 8594,
          "sscr;": [55349, 56520],
          "ssetmn;": 8726,
          "ssmile;": 8995,
          "sstarf;": 8902,
          "star;": 9734,
          "starf;": 9733,
          "straightepsilon;": 1013,
          "straightphi;": 981,
          "strns;": 175,
          "sub;": 8834,
          "subE;": 10949,
          "subdot;": 10941,
          "sube;": 8838,
          "subedot;": 10947,
          "submult;": 10945,
          "subnE;": 10955,
          "subne;": 8842,
          "subplus;": 10943,
          "subrarr;": 10617,
          "subset;": 8834,
          "subseteq;": 8838,
          "subseteqq;": 10949,
          "subsetneq;": 8842,
          "subsetneqq;": 10955,
          "subsim;": 10951,
          "subsub;": 10965,
          "subsup;": 10963,
          "succ;": 8827,
          "succapprox;": 10936,
          "succcurlyeq;": 8829,
          "succeq;": 10928,
          "succnapprox;": 10938,
          "succneqq;": 10934,
          "succnsim;": 8937,
          "succsim;": 8831,
          "sum;": 8721,
          "sung;": 9834,
          sup1: 185,
          "sup1;": 185,
          sup2: 178,
          "sup2;": 178,
          sup3: 179,
          "sup3;": 179,
          "sup;": 8835,
          "supE;": 10950,
          "supdot;": 10942,
          "supdsub;": 10968,
          "supe;": 8839,
          "supedot;": 10948,
          "suphsol;": 10185,
          "suphsub;": 10967,
          "suplarr;": 10619,
          "supmult;": 10946,
          "supnE;": 10956,
          "supne;": 8843,
          "supplus;": 10944,
          "supset;": 8835,
          "supseteq;": 8839,
          "supseteqq;": 10950,
          "supsetneq;": 8843,
          "supsetneqq;": 10956,
          "supsim;": 10952,
          "supsub;": 10964,
          "supsup;": 10966,
          "swArr;": 8665,
          "swarhk;": 10534,
          "swarr;": 8601,
          "swarrow;": 8601,
          "swnwar;": 10538,
          szlig: 223,
          "szlig;": 223,
          "target;": 8982,
          "tau;": 964,
          "tbrk;": 9140,
          "tcaron;": 357,
          "tcedil;": 355,
          "tcy;": 1090,
          "tdot;": 8411,
          "telrec;": 8981,
          "tfr;": [55349, 56625],
          "there4;": 8756,
          "therefore;": 8756,
          "theta;": 952,
          "thetasym;": 977,
          "thetav;": 977,
          "thickapprox;": 8776,
          "thicksim;": 8764,
          "thinsp;": 8201,
          "thkap;": 8776,
          "thksim;": 8764,
          thorn: 254,
          "thorn;": 254,
          "tilde;": 732,
          times: 215,
          "times;": 215,
          "timesb;": 8864,
          "timesbar;": 10801,
          "timesd;": 10800,
          "tint;": 8749,
          "toea;": 10536,
          "top;": 8868,
          "topbot;": 9014,
          "topcir;": 10993,
          "topf;": [55349, 56677],
          "topfork;": 10970,
          "tosa;": 10537,
          "tprime;": 8244,
          "trade;": 8482,
          "triangle;": 9653,
          "triangledown;": 9663,
          "triangleleft;": 9667,
          "trianglelefteq;": 8884,
          "triangleq;": 8796,
          "triangleright;": 9657,
          "trianglerighteq;": 8885,
          "tridot;": 9708,
          "trie;": 8796,
          "triminus;": 10810,
          "triplus;": 10809,
          "trisb;": 10701,
          "tritime;": 10811,
          "trpezium;": 9186,
          "tscr;": [55349, 56521],
          "tscy;": 1094,
          "tshcy;": 1115,
          "tstrok;": 359,
          "twixt;": 8812,
          "twoheadleftarrow;": 8606,
          "twoheadrightarrow;": 8608,
          "uArr;": 8657,
          "uHar;": 10595,
          uacute: 250,
          "uacute;": 250,
          "uarr;": 8593,
          "ubrcy;": 1118,
          "ubreve;": 365,
          ucirc: 251,
          "ucirc;": 251,
          "ucy;": 1091,
          "udarr;": 8645,
          "udblac;": 369,
          "udhar;": 10606,
          "ufisht;": 10622,
          "ufr;": [55349, 56626],
          ugrave: 249,
          "ugrave;": 249,
          "uharl;": 8639,
          "uharr;": 8638,
          "uhblk;": 9600,
          "ulcorn;": 8988,
          "ulcorner;": 8988,
          "ulcrop;": 8975,
          "ultri;": 9720,
          "umacr;": 363,
          uml: 168,
          "uml;": 168,
          "uogon;": 371,
          "uopf;": [55349, 56678],
          "uparrow;": 8593,
          "updownarrow;": 8597,
          "upharpoonleft;": 8639,
          "upharpoonright;": 8638,
          "uplus;": 8846,
          "upsi;": 965,
          "upsih;": 978,
          "upsilon;": 965,
          "upuparrows;": 8648,
          "urcorn;": 8989,
          "urcorner;": 8989,
          "urcrop;": 8974,
          "uring;": 367,
          "urtri;": 9721,
          "uscr;": [55349, 56522],
          "utdot;": 8944,
          "utilde;": 361,
          "utri;": 9653,
          "utrif;": 9652,
          "uuarr;": 8648,
          uuml: 252,
          "uuml;": 252,
          "uwangle;": 10663,
          "vArr;": 8661,
          "vBar;": 10984,
          "vBarv;": 10985,
          "vDash;": 8872,
          "vangrt;": 10652,
          "varepsilon;": 1013,
          "varkappa;": 1008,
          "varnothing;": 8709,
          "varphi;": 981,
          "varpi;": 982,
          "varpropto;": 8733,
          "varr;": 8597,
          "varrho;": 1009,
          "varsigma;": 962,
          "varsubsetneq;": [8842, 65024],
          "varsubsetneqq;": [10955, 65024],
          "varsupsetneq;": [8843, 65024],
          "varsupsetneqq;": [10956, 65024],
          "vartheta;": 977,
          "vartriangleleft;": 8882,
          "vartriangleright;": 8883,
          "vcy;": 1074,
          "vdash;": 8866,
          "vee;": 8744,
          "veebar;": 8891,
          "veeeq;": 8794,
          "vellip;": 8942,
          "verbar;": 124,
          "vert;": 124,
          "vfr;": [55349, 56627],
          "vltri;": 8882,
          "vnsub;": [8834, 8402],
          "vnsup;": [8835, 8402],
          "vopf;": [55349, 56679],
          "vprop;": 8733,
          "vrtri;": 8883,
          "vscr;": [55349, 56523],
          "vsubnE;": [10955, 65024],
          "vsubne;": [8842, 65024],
          "vsupnE;": [10956, 65024],
          "vsupne;": [8843, 65024],
          "vzigzag;": 10650,
          "wcirc;": 373,
          "wedbar;": 10847,
          "wedge;": 8743,
          "wedgeq;": 8793,
          "weierp;": 8472,
          "wfr;": [55349, 56628],
          "wopf;": [55349, 56680],
          "wp;": 8472,
          "wr;": 8768,
          "wreath;": 8768,
          "wscr;": [55349, 56524],
          "xcap;": 8898,
          "xcirc;": 9711,
          "xcup;": 8899,
          "xdtri;": 9661,
          "xfr;": [55349, 56629],
          "xhArr;": 10234,
          "xharr;": 10231,
          "xi;": 958,
          "xlArr;": 10232,
          "xlarr;": 10229,
          "xmap;": 10236,
          "xnis;": 8955,
          "xodot;": 10752,
          "xopf;": [55349, 56681],
          "xoplus;": 10753,
          "xotime;": 10754,
          "xrArr;": 10233,
          "xrarr;": 10230,
          "xscr;": [55349, 56525],
          "xsqcup;": 10758,
          "xuplus;": 10756,
          "xutri;": 9651,
          "xvee;": 8897,
          "xwedge;": 8896,
          yacute: 253,
          "yacute;": 253,
          "yacy;": 1103,
          "ycirc;": 375,
          "ycy;": 1099,
          yen: 165,
          "yen;": 165,
          "yfr;": [55349, 56630],
          "yicy;": 1111,
          "yopf;": [55349, 56682],
          "yscr;": [55349, 56526],
          "yucy;": 1102,
          yuml: 255,
          "yuml;": 255,
          "zacute;": 378,
          "zcaron;": 382,
          "zcy;": 1079,
          "zdot;": 380,
          "zeetrf;": 8488,
          "zeta;": 950,
          "zfr;": [55349, 56631],
          "zhcy;": 1078,
          "zigrarr;": 8669,
          "zopf;": [55349, 56683],
          "zscr;": [55349, 56527],
          "zwj;": 8205,
          "zwnj;": 8204,
        },
        yt =
          /(A(?:Elig;?|MP;?|acute;?|breve;|c(?:irc;?|y;)|fr;|grave;?|lpha;|macr;|nd;|o(?:gon;|pf;)|pplyFunction;|ring;?|s(?:cr;|sign;)|tilde;?|uml;?)|B(?:a(?:ckslash;|r(?:v;|wed;))|cy;|e(?:cause;|rnoullis;|ta;)|fr;|opf;|reve;|scr;|umpeq;)|C(?:Hcy;|OPY;?|a(?:cute;|p(?:;|italDifferentialD;)|yleys;)|c(?:aron;|edil;?|irc;|onint;)|dot;|e(?:dilla;|nterDot;)|fr;|hi;|ircle(?:Dot;|Minus;|Plus;|Times;)|lo(?:ckwiseContourIntegral;|seCurly(?:DoubleQuote;|Quote;))|o(?:lon(?:;|e;)|n(?:gruent;|int;|tourIntegral;)|p(?:f;|roduct;)|unterClockwiseContourIntegral;)|ross;|scr;|up(?:;|Cap;))|D(?:D(?:;|otrahd;)|Jcy;|Scy;|Zcy;|a(?:gger;|rr;|shv;)|c(?:aron;|y;)|el(?:;|ta;)|fr;|i(?:a(?:critical(?:Acute;|Do(?:t;|ubleAcute;)|Grave;|Tilde;)|mond;)|fferentialD;)|o(?:pf;|t(?:;|Dot;|Equal;)|uble(?:ContourIntegral;|Do(?:t;|wnArrow;)|L(?:eft(?:Arrow;|RightArrow;|Tee;)|ong(?:Left(?:Arrow;|RightArrow;)|RightArrow;))|Right(?:Arrow;|Tee;)|Up(?:Arrow;|DownArrow;)|VerticalBar;)|wn(?:Arrow(?:;|Bar;|UpArrow;)|Breve;|Left(?:RightVector;|TeeVector;|Vector(?:;|Bar;))|Right(?:TeeVector;|Vector(?:;|Bar;))|Tee(?:;|Arrow;)|arrow;))|s(?:cr;|trok;))|E(?:NG;|TH;?|acute;?|c(?:aron;|irc;?|y;)|dot;|fr;|grave;?|lement;|m(?:acr;|pty(?:SmallSquare;|VerySmallSquare;))|o(?:gon;|pf;)|psilon;|qu(?:al(?:;|Tilde;)|ilibrium;)|s(?:cr;|im;)|ta;|uml;?|x(?:ists;|ponentialE;))|F(?:cy;|fr;|illed(?:SmallSquare;|VerySmallSquare;)|o(?:pf;|rAll;|uriertrf;)|scr;)|G(?:Jcy;|T;?|amma(?:;|d;)|breve;|c(?:edil;|irc;|y;)|dot;|fr;|g;|opf;|reater(?:Equal(?:;|Less;)|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|scr;|t;)|H(?:ARDcy;|a(?:cek;|t;)|circ;|fr;|ilbertSpace;|o(?:pf;|rizontalLine;)|s(?:cr;|trok;)|ump(?:DownHump;|Equal;))|I(?:Ecy;|Jlig;|Ocy;|acute;?|c(?:irc;?|y;)|dot;|fr;|grave;?|m(?:;|a(?:cr;|ginaryI;)|plies;)|n(?:t(?:;|e(?:gral;|rsection;))|visible(?:Comma;|Times;))|o(?:gon;|pf;|ta;)|scr;|tilde;|u(?:kcy;|ml;?))|J(?:c(?:irc;|y;)|fr;|opf;|s(?:cr;|ercy;)|ukcy;)|K(?:Hcy;|Jcy;|appa;|c(?:edil;|y;)|fr;|opf;|scr;)|L(?:Jcy;|T;?|a(?:cute;|mbda;|ng;|placetrf;|rr;)|c(?:aron;|edil;|y;)|e(?:ft(?:A(?:ngleBracket;|rrow(?:;|Bar;|RightArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|Right(?:Arrow;|Vector;)|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;|rightarrow;)|ss(?:EqualGreater;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;))|fr;|l(?:;|eftarrow;)|midot;|o(?:ng(?:Left(?:Arrow;|RightArrow;)|RightArrow;|left(?:arrow;|rightarrow;)|rightarrow;)|pf;|wer(?:LeftArrow;|RightArrow;))|s(?:cr;|h;|trok;)|t;)|M(?:ap;|cy;|e(?:diumSpace;|llintrf;)|fr;|inusPlus;|opf;|scr;|u;)|N(?:Jcy;|acute;|c(?:aron;|edil;|y;)|e(?:gative(?:MediumSpace;|Thi(?:ckSpace;|nSpace;)|VeryThinSpace;)|sted(?:GreaterGreater;|LessLess;)|wLine;)|fr;|o(?:Break;|nBreakingSpace;|pf;|t(?:;|C(?:ongruent;|upCap;)|DoubleVerticalBar;|E(?:lement;|qual(?:;|Tilde;)|xists;)|Greater(?:;|Equal;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|Hump(?:DownHump;|Equal;)|Le(?:ftTriangle(?:;|Bar;|Equal;)|ss(?:;|Equal;|Greater;|Less;|SlantEqual;|Tilde;))|Nested(?:GreaterGreater;|LessLess;)|Precedes(?:;|Equal;|SlantEqual;)|R(?:everseElement;|ightTriangle(?:;|Bar;|Equal;))|S(?:quareSu(?:bset(?:;|Equal;)|perset(?:;|Equal;))|u(?:bset(?:;|Equal;)|cceeds(?:;|Equal;|SlantEqual;|Tilde;)|perset(?:;|Equal;)))|Tilde(?:;|Equal;|FullEqual;|Tilde;)|VerticalBar;))|scr;|tilde;?|u;)|O(?:Elig;|acute;?|c(?:irc;?|y;)|dblac;|fr;|grave;?|m(?:acr;|ega;|icron;)|opf;|penCurly(?:DoubleQuote;|Quote;)|r;|s(?:cr;|lash;?)|ti(?:lde;?|mes;)|uml;?|ver(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;))|P(?:artialD;|cy;|fr;|hi;|i;|lusMinus;|o(?:incareplane;|pf;)|r(?:;|ecedes(?:;|Equal;|SlantEqual;|Tilde;)|ime;|o(?:duct;|portion(?:;|al;)))|s(?:cr;|i;))|Q(?:UOT;?|fr;|opf;|scr;)|R(?:Barr;|EG;?|a(?:cute;|ng;|rr(?:;|tl;))|c(?:aron;|edil;|y;)|e(?:;|verse(?:E(?:lement;|quilibrium;)|UpEquilibrium;))|fr;|ho;|ight(?:A(?:ngleBracket;|rrow(?:;|Bar;|LeftArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;)|o(?:pf;|undImplies;)|rightarrow;|s(?:cr;|h;)|uleDelayed;)|S(?:H(?:CHcy;|cy;)|OFTcy;|acute;|c(?:;|aron;|edil;|irc;|y;)|fr;|hort(?:DownArrow;|LeftArrow;|RightArrow;|UpArrow;)|igma;|mallCircle;|opf;|q(?:rt;|uare(?:;|Intersection;|Su(?:bset(?:;|Equal;)|perset(?:;|Equal;))|Union;))|scr;|tar;|u(?:b(?:;|set(?:;|Equal;))|c(?:ceeds(?:;|Equal;|SlantEqual;|Tilde;)|hThat;)|m;|p(?:;|erset(?:;|Equal;)|set;)))|T(?:HORN;?|RADE;|S(?:Hcy;|cy;)|a(?:b;|u;)|c(?:aron;|edil;|y;)|fr;|h(?:e(?:refore;|ta;)|i(?:ckSpace;|nSpace;))|ilde(?:;|Equal;|FullEqual;|Tilde;)|opf;|ripleDot;|s(?:cr;|trok;))|U(?:a(?:cute;?|rr(?:;|ocir;))|br(?:cy;|eve;)|c(?:irc;?|y;)|dblac;|fr;|grave;?|macr;|n(?:der(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;)|ion(?:;|Plus;))|o(?:gon;|pf;)|p(?:Arrow(?:;|Bar;|DownArrow;)|DownArrow;|Equilibrium;|Tee(?:;|Arrow;)|arrow;|downarrow;|per(?:LeftArrow;|RightArrow;)|si(?:;|lon;))|ring;|scr;|tilde;|uml;?)|V(?:Dash;|bar;|cy;|dash(?:;|l;)|e(?:e;|r(?:bar;|t(?:;|ical(?:Bar;|Line;|Separator;|Tilde;))|yThinSpace;))|fr;|opf;|scr;|vdash;)|W(?:circ;|edge;|fr;|opf;|scr;)|X(?:fr;|i;|opf;|scr;)|Y(?:Acy;|Icy;|Ucy;|acute;?|c(?:irc;|y;)|fr;|opf;|scr;|uml;)|Z(?:Hcy;|acute;|c(?:aron;|y;)|dot;|e(?:roWidthSpace;|ta;)|fr;|opf;|scr;)|a(?:acute;?|breve;|c(?:;|E;|d;|irc;?|ute;?|y;)|elig;?|f(?:;|r;)|grave;?|l(?:e(?:fsym;|ph;)|pha;)|m(?:a(?:cr;|lg;)|p;?)|n(?:d(?:;|and;|d;|slope;|v;)|g(?:;|e;|le;|msd(?:;|a(?:a;|b;|c;|d;|e;|f;|g;|h;))|rt(?:;|vb(?:;|d;))|s(?:ph;|t;)|zarr;))|o(?:gon;|pf;)|p(?:;|E;|acir;|e;|id;|os;|prox(?:;|eq;))|ring;?|s(?:cr;|t;|ymp(?:;|eq;))|tilde;?|uml;?|w(?:conint;|int;))|b(?:Not;|a(?:ck(?:cong;|epsilon;|prime;|sim(?:;|eq;))|r(?:vee;|wed(?:;|ge;)))|brk(?:;|tbrk;)|c(?:ong;|y;)|dquo;|e(?:caus(?:;|e;)|mptyv;|psi;|rnou;|t(?:a;|h;|ween;))|fr;|ig(?:c(?:ap;|irc;|up;)|o(?:dot;|plus;|times;)|s(?:qcup;|tar;)|triangle(?:down;|up;)|uplus;|vee;|wedge;)|karow;|l(?:a(?:ck(?:lozenge;|square;|triangle(?:;|down;|left;|right;))|nk;)|k(?:1(?:2;|4;)|34;)|ock;)|n(?:e(?:;|quiv;)|ot;)|o(?:pf;|t(?:;|tom;)|wtie;|x(?:D(?:L;|R;|l;|r;)|H(?:;|D;|U;|d;|u;)|U(?:L;|R;|l;|r;)|V(?:;|H;|L;|R;|h;|l;|r;)|box;|d(?:L;|R;|l;|r;)|h(?:;|D;|U;|d;|u;)|minus;|plus;|times;|u(?:L;|R;|l;|r;)|v(?:;|H;|L;|R;|h;|l;|r;)))|prime;|r(?:eve;|vbar;?)|s(?:cr;|emi;|im(?:;|e;)|ol(?:;|b;|hsub;))|u(?:ll(?:;|et;)|mp(?:;|E;|e(?:;|q;))))|c(?:a(?:cute;|p(?:;|and;|brcup;|c(?:ap;|up;)|dot;|s;)|r(?:et;|on;))|c(?:a(?:ps;|ron;)|edil;?|irc;|ups(?:;|sm;))|dot;|e(?:dil;?|mptyv;|nt(?:;|erdot;|))|fr;|h(?:cy;|eck(?:;|mark;)|i;)|ir(?:;|E;|c(?:;|eq;|le(?:arrow(?:left;|right;)|d(?:R;|S;|ast;|circ;|dash;)))|e;|fnint;|mid;|scir;)|lubs(?:;|uit;)|o(?:lon(?:;|e(?:;|q;))|m(?:ma(?:;|t;)|p(?:;|fn;|le(?:ment;|xes;)))|n(?:g(?:;|dot;)|int;)|p(?:f;|rod;|y(?:;|sr;|)))|r(?:arr;|oss;)|s(?:cr;|u(?:b(?:;|e;)|p(?:;|e;)))|tdot;|u(?:darr(?:l;|r;)|e(?:pr;|sc;)|larr(?:;|p;)|p(?:;|brcap;|c(?:ap;|up;)|dot;|or;|s;)|r(?:arr(?:;|m;)|ly(?:eq(?:prec;|succ;)|vee;|wedge;)|ren;?|vearrow(?:left;|right;))|vee;|wed;)|w(?:conint;|int;)|ylcty;)|d(?:Arr;|Har;|a(?:gger;|leth;|rr;|sh(?:;|v;))|b(?:karow;|lac;)|c(?:aron;|y;)|d(?:;|a(?:gger;|rr;)|otseq;)|e(?:g;?|lta;|mptyv;)|f(?:isht;|r;)|har(?:l;|r;)|i(?:am(?:;|ond(?:;|suit;)|s;)|e;|gamma;|sin;|v(?:;|ide(?:;|ontimes;|)|onx;))|jcy;|lc(?:orn;|rop;)|o(?:llar;|pf;|t(?:;|eq(?:;|dot;)|minus;|plus;|square;)|ublebarwedge;|wn(?:arrow;|downarrows;|harpoon(?:left;|right;)))|r(?:bkarow;|c(?:orn;|rop;))|s(?:c(?:r;|y;)|ol;|trok;)|t(?:dot;|ri(?:;|f;))|u(?:arr;|har;)|wangle;|z(?:cy;|igrarr;))|e(?:D(?:Dot;|ot;)|a(?:cute;?|ster;)|c(?:aron;|ir(?:;|c;?)|olon;|y;)|dot;|e;|f(?:Dot;|r;)|g(?:;|rave;?|s(?:;|dot;))|l(?:;|inters;|l;|s(?:;|dot;))|m(?:acr;|pty(?:;|set;|v;)|sp(?:1(?:3;|4;)|;))|n(?:g;|sp;)|o(?:gon;|pf;)|p(?:ar(?:;|sl;)|lus;|si(?:;|lon;|v;))|q(?:c(?:irc;|olon;)|s(?:im;|lant(?:gtr;|less;))|u(?:als;|est;|iv(?:;|DD;))|vparsl;)|r(?:Dot;|arr;)|s(?:cr;|dot;|im;)|t(?:a;|h;?)|u(?:ml;?|ro;)|x(?:cl;|ist;|p(?:ectation;|onentiale;)))|f(?:allingdotseq;|cy;|emale;|f(?:ilig;|l(?:ig;|lig;)|r;)|ilig;|jlig;|l(?:at;|lig;|tns;)|nof;|o(?:pf;|r(?:all;|k(?:;|v;)))|partint;|r(?:a(?:c(?:1(?:2;?|3;|4;?|5;|6;|8;)|2(?:3;|5;)|3(?:4;?|5;|8;)|45;|5(?:6;|8;)|78;)|sl;)|own;)|scr;)|g(?:E(?:;|l;)|a(?:cute;|mma(?:;|d;)|p;)|breve;|c(?:irc;|y;)|dot;|e(?:;|l;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|l;))|l(?:;|es;)))|fr;|g(?:;|g;)|imel;|jcy;|l(?:;|E;|a;|j;)|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|opf;|rave;|s(?:cr;|im(?:;|e;|l;))|t(?:;|c(?:c;|ir;)|dot;|lPar;|quest;|r(?:a(?:pprox;|rr;)|dot;|eq(?:less;|qless;)|less;|sim;)|)|v(?:ertneqq;|nE;))|h(?:Arr;|a(?:irsp;|lf;|milt;|r(?:dcy;|r(?:;|cir;|w;)))|bar;|circ;|e(?:arts(?:;|uit;)|llip;|rcon;)|fr;|ks(?:earow;|warow;)|o(?:arr;|mtht;|ok(?:leftarrow;|rightarrow;)|pf;|rbar;)|s(?:cr;|lash;|trok;)|y(?:bull;|phen;))|i(?:acute;?|c(?:;|irc;?|y;)|e(?:cy;|xcl;?)|f(?:f;|r;)|grave;?|i(?:;|i(?:int;|nt;)|nfin;|ota;)|jlig;|m(?:a(?:cr;|g(?:e;|line;|part;)|th;)|of;|ped;)|n(?:;|care;|fin(?:;|tie;)|odot;|t(?:;|cal;|e(?:gers;|rcal;)|larhk;|prod;))|o(?:cy;|gon;|pf;|ta;)|prod;|quest;?|s(?:cr;|in(?:;|E;|dot;|s(?:;|v;)|v;))|t(?:;|ilde;)|u(?:kcy;|ml;?))|j(?:c(?:irc;|y;)|fr;|math;|opf;|s(?:cr;|ercy;)|ukcy;)|k(?:appa(?:;|v;)|c(?:edil;|y;)|fr;|green;|hcy;|jcy;|opf;|scr;)|l(?:A(?:arr;|rr;|tail;)|Barr;|E(?:;|g;)|Har;|a(?:cute;|emptyv;|gran;|mbda;|ng(?:;|d;|le;)|p;|quo;?|rr(?:;|b(?:;|fs;)|fs;|hk;|lp;|pl;|sim;|tl;)|t(?:;|ail;|e(?:;|s;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|quo(?:;|r;)|r(?:dhar;|ushar;)|sh;)|e(?:;|ft(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|leftarrows;|right(?:arrow(?:;|s;)|harpoons;|squigarrow;)|threetimes;)|g;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|r;))|g(?:;|es;)|s(?:approx;|dot;|eq(?:gtr;|qgtr;)|gtr;|sim;)))|f(?:isht;|loor;|r;)|g(?:;|E;)|h(?:ar(?:d;|u(?:;|l;))|blk;)|jcy;|l(?:;|arr;|corner;|hard;|tri;)|m(?:idot;|oust(?:;|ache;))|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|o(?:a(?:ng;|rr;)|brk;|ng(?:left(?:arrow;|rightarrow;)|mapsto;|rightarrow;)|oparrow(?:left;|right;)|p(?:ar;|f;|lus;)|times;|w(?:ast;|bar;)|z(?:;|enge;|f;))|par(?:;|lt;)|r(?:arr;|corner;|har(?:;|d;)|m;|tri;)|s(?:aquo;|cr;|h;|im(?:;|e;|g;)|q(?:b;|uo(?:;|r;))|trok;)|t(?:;|c(?:c;|ir;)|dot;|hree;|imes;|larr;|quest;|r(?:Par;|i(?:;|e;|f;))|)|ur(?:dshar;|uhar;)|v(?:ertneqq;|nE;))|m(?:DDot;|a(?:cr;?|l(?:e;|t(?:;|ese;))|p(?:;|sto(?:;|down;|left;|up;))|rker;)|c(?:omma;|y;)|dash;|easuredangle;|fr;|ho;|i(?:cro;?|d(?:;|ast;|cir;|dot;?)|nus(?:;|b;|d(?:;|u;)))|l(?:cp;|dr;)|nplus;|o(?:dels;|pf;)|p;|s(?:cr;|tpos;)|u(?:;|ltimap;|map;))|n(?:G(?:g;|t(?:;|v;))|L(?:eft(?:arrow;|rightarrow;)|l;|t(?:;|v;))|Rightarrow;|V(?:Dash;|dash;)|a(?:bla;|cute;|ng;|p(?:;|E;|id;|os;|prox;)|tur(?:;|al(?:;|s;)))|b(?:sp;?|ump(?:;|e;))|c(?:a(?:p;|ron;)|edil;|ong(?:;|dot;)|up;|y;)|dash;|e(?:;|Arr;|ar(?:hk;|r(?:;|ow;))|dot;|quiv;|s(?:ear;|im;)|xist(?:;|s;))|fr;|g(?:E;|e(?:;|q(?:;|q;|slant;)|s;)|sim;|t(?:;|r;))|h(?:Arr;|arr;|par;)|i(?:;|s(?:;|d;)|v;)|jcy;|l(?:Arr;|E;|arr;|dr;|e(?:;|ft(?:arrow;|rightarrow;)|q(?:;|q;|slant;)|s(?:;|s;))|sim;|t(?:;|ri(?:;|e;)))|mid;|o(?:pf;|t(?:;|in(?:;|E;|dot;|v(?:a;|b;|c;))|ni(?:;|v(?:a;|b;|c;))|))|p(?:ar(?:;|allel;|sl;|t;)|olint;|r(?:;|cue;|e(?:;|c(?:;|eq;))))|r(?:Arr;|arr(?:;|c;|w;)|ightarrow;|tri(?:;|e;))|s(?:c(?:;|cue;|e;|r;)|hort(?:mid;|parallel;)|im(?:;|e(?:;|q;))|mid;|par;|qsu(?:be;|pe;)|u(?:b(?:;|E;|e;|set(?:;|eq(?:;|q;)))|cc(?:;|eq;)|p(?:;|E;|e;|set(?:;|eq(?:;|q;)))))|t(?:gl;|ilde;?|lg;|riangle(?:left(?:;|eq;)|right(?:;|eq;)))|u(?:;|m(?:;|ero;|sp;))|v(?:Dash;|Harr;|ap;|dash;|g(?:e;|t;)|infin;|l(?:Arr;|e;|t(?:;|rie;))|r(?:Arr;|trie;)|sim;)|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|near;))|o(?:S;|a(?:cute;?|st;)|c(?:ir(?:;|c;?)|y;)|d(?:ash;|blac;|iv;|ot;|sold;)|elig;|f(?:cir;|r;)|g(?:on;|rave;?|t;)|h(?:bar;|m;)|int;|l(?:arr;|c(?:ir;|ross;)|ine;|t;)|m(?:acr;|ega;|i(?:cron;|d;|nus;))|opf;|p(?:ar;|erp;|lus;)|r(?:;|arr;|d(?:;|er(?:;|of;)|f;?|m;?)|igof;|or;|slope;|v;)|s(?:cr;|lash;?|ol;)|ti(?:lde;?|mes(?:;|as;))|uml;?|vbar;)|p(?:ar(?:;|a(?:;|llel;|)|s(?:im;|l;)|t;)|cy;|er(?:cnt;|iod;|mil;|p;|tenk;)|fr;|h(?:i(?:;|v;)|mmat;|one;)|i(?:;|tchfork;|v;)|l(?:an(?:ck(?:;|h;)|kv;)|us(?:;|acir;|b;|cir;|d(?:o;|u;)|e;|mn;?|sim;|two;))|m;|o(?:intint;|pf;|und;?)|r(?:;|E;|ap;|cue;|e(?:;|c(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;))|ime(?:;|s;)|n(?:E;|ap;|sim;)|o(?:d;|f(?:alar;|line;|surf;)|p(?:;|to;))|sim;|urel;)|s(?:cr;|i;)|uncsp;)|q(?:fr;|int;|opf;|prime;|scr;|u(?:at(?:ernions;|int;)|est(?:;|eq;)|ot;?))|r(?:A(?:arr;|rr;|tail;)|Barr;|Har;|a(?:c(?:e;|ute;)|dic;|emptyv;|ng(?:;|d;|e;|le;)|quo;?|rr(?:;|ap;|b(?:;|fs;)|c;|fs;|hk;|lp;|pl;|sim;|tl;|w;)|t(?:ail;|io(?:;|nals;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|ldhar;|quo(?:;|r;)|sh;)|e(?:al(?:;|ine;|part;|s;)|ct;|g;?)|f(?:isht;|loor;|r;)|h(?:ar(?:d;|u(?:;|l;))|o(?:;|v;))|i(?:ght(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|left(?:arrows;|harpoons;)|rightarrows;|squigarrow;|threetimes;)|ng;|singdotseq;)|l(?:arr;|har;|m;)|moust(?:;|ache;)|nmid;|o(?:a(?:ng;|rr;)|brk;|p(?:ar;|f;|lus;)|times;)|p(?:ar(?:;|gt;)|polint;)|rarr;|s(?:aquo;|cr;|h;|q(?:b;|uo(?:;|r;)))|t(?:hree;|imes;|ri(?:;|e;|f;|ltri;))|uluhar;|x;)|s(?:acute;|bquo;|c(?:;|E;|a(?:p;|ron;)|cue;|e(?:;|dil;)|irc;|n(?:E;|ap;|sim;)|polint;|sim;|y;)|dot(?:;|b;|e;)|e(?:Arr;|ar(?:hk;|r(?:;|ow;))|ct;?|mi;|swar;|tm(?:inus;|n;)|xt;)|fr(?:;|own;)|h(?:arp;|c(?:hcy;|y;)|ort(?:mid;|parallel;)|y;?)|i(?:gma(?:;|f;|v;)|m(?:;|dot;|e(?:;|q;)|g(?:;|E;)|l(?:;|E;)|ne;|plus;|rarr;))|larr;|m(?:a(?:llsetminus;|shp;)|eparsl;|i(?:d;|le;)|t(?:;|e(?:;|s;)))|o(?:ftcy;|l(?:;|b(?:;|ar;))|pf;)|pa(?:des(?:;|uit;)|r;)|q(?:c(?:ap(?:;|s;)|up(?:;|s;))|su(?:b(?:;|e;|set(?:;|eq;))|p(?:;|e;|set(?:;|eq;)))|u(?:;|ar(?:e;|f;)|f;))|rarr;|s(?:cr;|etmn;|mile;|tarf;)|t(?:ar(?:;|f;)|r(?:aight(?:epsilon;|phi;)|ns;))|u(?:b(?:;|E;|dot;|e(?:;|dot;)|mult;|n(?:E;|e;)|plus;|rarr;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;)))|cc(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;)|m;|ng;|p(?:1;?|2;?|3;?|;|E;|d(?:ot;|sub;)|e(?:;|dot;)|hs(?:ol;|ub;)|larr;|mult;|n(?:E;|e;)|plus;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;))))|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|nwar;)|zlig;?)|t(?:a(?:rget;|u;)|brk;|c(?:aron;|edil;|y;)|dot;|elrec;|fr;|h(?:e(?:re(?:4;|fore;)|ta(?:;|sym;|v;))|i(?:ck(?:approx;|sim;)|nsp;)|k(?:ap;|sim;)|orn;?)|i(?:lde;|mes(?:;|b(?:;|ar;)|d;|)|nt;)|o(?:ea;|p(?:;|bot;|cir;|f(?:;|ork;))|sa;)|prime;|r(?:ade;|i(?:angle(?:;|down;|left(?:;|eq;)|q;|right(?:;|eq;))|dot;|e;|minus;|plus;|sb;|time;)|pezium;)|s(?:c(?:r;|y;)|hcy;|trok;)|w(?:ixt;|ohead(?:leftarrow;|rightarrow;)))|u(?:Arr;|Har;|a(?:cute;?|rr;)|br(?:cy;|eve;)|c(?:irc;?|y;)|d(?:arr;|blac;|har;)|f(?:isht;|r;)|grave;?|h(?:ar(?:l;|r;)|blk;)|l(?:c(?:orn(?:;|er;)|rop;)|tri;)|m(?:acr;|l;?)|o(?:gon;|pf;)|p(?:arrow;|downarrow;|harpoon(?:left;|right;)|lus;|si(?:;|h;|lon;)|uparrows;)|r(?:c(?:orn(?:;|er;)|rop;)|ing;|tri;)|scr;|t(?:dot;|ilde;|ri(?:;|f;))|u(?:arr;|ml;?)|wangle;)|v(?:Arr;|Bar(?:;|v;)|Dash;|a(?:ngrt;|r(?:epsilon;|kappa;|nothing;|p(?:hi;|i;|ropto;)|r(?:;|ho;)|s(?:igma;|u(?:bsetneq(?:;|q;)|psetneq(?:;|q;)))|t(?:heta;|riangle(?:left;|right;))))|cy;|dash;|e(?:e(?:;|bar;|eq;)|llip;|r(?:bar;|t;))|fr;|ltri;|nsu(?:b;|p;)|opf;|prop;|rtri;|s(?:cr;|u(?:bn(?:E;|e;)|pn(?:E;|e;)))|zigzag;)|w(?:circ;|e(?:d(?:bar;|ge(?:;|q;))|ierp;)|fr;|opf;|p;|r(?:;|eath;)|scr;)|x(?:c(?:ap;|irc;|up;)|dtri;|fr;|h(?:Arr;|arr;)|i;|l(?:Arr;|arr;)|map;|nis;|o(?:dot;|p(?:f;|lus;)|time;)|r(?:Arr;|arr;)|s(?:cr;|qcup;)|u(?:plus;|tri;)|vee;|wedge;)|y(?:ac(?:ute;?|y;)|c(?:irc;|y;)|en;?|fr;|icy;|opf;|scr;|u(?:cy;|ml;?))|z(?:acute;|c(?:aron;|y;)|dot;|e(?:etrf;|ta;)|fr;|hcy;|igrarr;|opf;|scr;|w(?:j;|nj;)))|[\s\S]/g,
        at = 32,
        wn = /[^\r"&\u0000]+/g,
        bt = /[^\r'&\u0000]+/g,
        ti = /[^\r\t\n\f &>\u0000]+/g,
        Zi = /[^\r\t\n\f \/>A-Z\u0000]+/g,
        f_ = /[^\r\t\n\f \/=>A-Z\u0000]+/g,
        h_ = /[^\]\r\u0000\uffff]*/g,
        p_ = /[^&<\r\u0000\uffff]*/g,
        cp = /[^<\r\u0000\uffff]*/g,
        m_ = /[^\r\u0000\uffff]*/g,
        lp = /(?:(\/)?([a-z]+)>)|[\s\S]/g,
        up =
          /(?:([-a-z]+)[ \t\n\f]*=[ \t\n\f]*('[^'&\r\u0000]*'|"[^"&\r\u0000]*"|[^\t\n\r\f "&'\u0000>][^&> \t\n\r\f\u0000]*[ \t\n\f]))|[\s\S]/g,
        No = /[^\x09\x0A\x0C\x0D\x20]/,
        Il = /[^\x09\x0A\x0C\x0D\x20]/g,
        g_ = /[^\x00\x09\x0A\x0C\x0D\x20]/,
        vr = /^[\x09\x0A\x0C\x0D\x20]+/,
        Mo = /\x00/g;
      function mt(j) {
        var B = 16384;
        if (j.length < B) return String.fromCharCode.apply(String, j);
        for (var se = "", X = 0; X < j.length; X += B)
          se += String.fromCharCode.apply(String, j.slice(X, X + B));
        return se;
      }
      function y_(j) {
        for (var B = [], se = 0; se < j.length; se++) B[se] = j.charCodeAt(se);
        return B;
      }
      function ke(j, B) {
        if (typeof B == "string")
          return j.namespaceURI === s.HTML && j.localName === B;
        var se = B[j.namespaceURI];
        return se && se[j.localName];
      }
      function dp(j) {
        return ke(j, V);
      }
      function fp(j) {
        if (ke(j, Q)) return !0;
        if (j.namespaceURI === s.MATHML && j.localName === "annotation-xml") {
          var B = j.getAttribute("encoding");
          if (
            (B && (B = B.toLowerCase()),
            B === "text/html" || B === "application/xhtml+xml")
          )
            return !0;
        }
        return !1;
      }
      function v_(j) {
        return j in O ? O[j] : j;
      }
      function hp(j) {
        for (var B = 0, se = j.length; B < se; B++)
          j[B][0] in T && (j[B][0] = T[j[B][0]]);
      }
      function pp(j) {
        for (var B = 0, se = j.length; B < se; B++)
          if (j[B][0] === "definitionurl") {
            j[B][0] = "definitionURL";
            break;
          }
      }
      function Nl(j) {
        for (var B = 0, se = j.length; B < se; B++)
          j[B][0] in he && j[B].push(he[j[B][0]]);
      }
      function mp(j, B) {
        for (var se = 0, X = j.length; se < X; se++) {
          var Ve = j[se][0],
            J = j[se][1];
          B.hasAttribute(Ve) || B._setAttribute(Ve, J);
        }
      }
      (Me.ElementStack = function () {
        (this.elements = []), (this.top = null);
      }),
        (Me.ElementStack.prototype.push = function (j) {
          this.elements.push(j), (this.top = j);
        }),
        (Me.ElementStack.prototype.pop = function (j) {
          this.elements.pop(),
            (this.top = this.elements[this.elements.length - 1]);
        }),
        (Me.ElementStack.prototype.popTag = function (j) {
          for (var B = this.elements.length - 1; B > 0; B--) {
            var se = this.elements[B];
            if (ke(se, j)) break;
          }
          (this.elements.length = B), (this.top = this.elements[B - 1]);
        }),
        (Me.ElementStack.prototype.popElementType = function (j) {
          for (
            var B = this.elements.length - 1;
            B > 0 && !(this.elements[B] instanceof j);
            B--
          );
          (this.elements.length = B), (this.top = this.elements[B - 1]);
        }),
        (Me.ElementStack.prototype.popElement = function (j) {
          for (
            var B = this.elements.length - 1;
            B > 0 && this.elements[B] !== j;
            B--
          );
          (this.elements.length = B), (this.top = this.elements[B - 1]);
        }),
        (Me.ElementStack.prototype.removeElement = function (j) {
          if (this.top === j) this.pop();
          else {
            var B = this.elements.lastIndexOf(j);
            B !== -1 && this.elements.splice(B, 1);
          }
        }),
        (Me.ElementStack.prototype.clearToContext = function (j) {
          for (
            var B = this.elements.length - 1;
            B > 0 && !ke(this.elements[B], j);
            B--
          );
          (this.elements.length = B + 1), (this.top = this.elements[B]);
        }),
        (Me.ElementStack.prototype.contains = function (j) {
          return this.inSpecificScope(j, Object.create(null));
        }),
        (Me.ElementStack.prototype.inSpecificScope = function (j, B) {
          for (var se = this.elements.length - 1; se >= 0; se--) {
            var X = this.elements[se];
            if (ke(X, j)) return !0;
            if (ke(X, B)) return !1;
          }
          return !1;
        }),
        (Me.ElementStack.prototype.elementInSpecificScope = function (j, B) {
          for (var se = this.elements.length - 1; se >= 0; se--) {
            var X = this.elements[se];
            if (X === j) return !0;
            if (ke(X, B)) return !1;
          }
          return !1;
        }),
        (Me.ElementStack.prototype.elementTypeInSpecificScope = function (
          j,
          B,
        ) {
          for (var se = this.elements.length - 1; se >= 0; se--) {
            var X = this.elements[se];
            if (X instanceof j) return !0;
            if (ke(X, B)) return !1;
          }
          return !1;
        }),
        (Me.ElementStack.prototype.inScope = function (j) {
          return this.inSpecificScope(j, m);
        }),
        (Me.ElementStack.prototype.elementInScope = function (j) {
          return this.elementInSpecificScope(j, m);
        }),
        (Me.ElementStack.prototype.elementTypeInScope = function (j) {
          return this.elementTypeInSpecificScope(j, m);
        }),
        (Me.ElementStack.prototype.inButtonScope = function (j) {
          return this.inSpecificScope(j, y);
        }),
        (Me.ElementStack.prototype.inListItemScope = function (j) {
          return this.inSpecificScope(j, p);
        }),
        (Me.ElementStack.prototype.inTableScope = function (j) {
          return this.inSpecificScope(j, C);
        }),
        (Me.ElementStack.prototype.inSelectScope = function (j) {
          for (var B = this.elements.length - 1; B >= 0; B--) {
            var se = this.elements[B];
            if (se.namespaceURI !== s.HTML) return !1;
            var X = se.localName;
            if (X === j) return !0;
            if (X !== "optgroup" && X !== "option") return !1;
          }
          return !1;
        }),
        (Me.ElementStack.prototype.generateImpliedEndTags = function (j, B) {
          for (var se = B ? q : me, X = this.elements.length - 1; X >= 0; X--) {
            var Ve = this.elements[X];
            if ((j && ke(Ve, j)) || !ke(this.elements[X], se)) break;
          }
          (this.elements.length = X + 1), (this.top = this.elements[X]);
        }),
        (Me.ActiveFormattingElements = function () {
          (this.list = []), (this.attrs = []);
        }),
        (Me.ActiveFormattingElements.prototype.MARKER = { localName: "|" }),
        (Me.ActiveFormattingElements.prototype.insertMarker = function () {
          this.list.push(this.MARKER), this.attrs.push(this.MARKER);
        }),
        (Me.ActiveFormattingElements.prototype.push = function (j, B) {
          for (
            var se = 0, X = this.list.length - 1;
            X >= 0 && this.list[X] !== this.MARKER;
            X--
          )
            if (Er(j, this.list[X], this.attrs[X]) && (se++, se === 3)) {
              this.list.splice(X, 1), this.attrs.splice(X, 1);
              break;
            }
          this.list.push(j);
          for (var Ve = [], J = 0; J < B.length; J++) Ve[J] = B[J];
          this.attrs.push(Ve);
          function Er(Un, br, Dn) {
            if (Un.localName !== br.localName || Un._numattrs !== Dn.length)
              return !1;
            for (var _t = 0, Ao = Dn.length; _t < Ao; _t++) {
              var _r = Dn[_t][0],
                A = Dn[_t][1];
              if (!Un.hasAttribute(_r) || Un.getAttribute(_r) !== A) return !1;
            }
            return !0;
          }
        }),
        (Me.ActiveFormattingElements.prototype.clearToMarker = function () {
          for (
            var j = this.list.length - 1;
            j >= 0 && this.list[j] !== this.MARKER;
            j--
          );
          j < 0 && (j = 0), (this.list.length = j), (this.attrs.length = j);
        }),
        (Me.ActiveFormattingElements.prototype.findElementByTag = function (j) {
          for (var B = this.list.length - 1; B >= 0; B--) {
            var se = this.list[B];
            if (se === this.MARKER) break;
            if (se.localName === j) return se;
          }
          return null;
        }),
        (Me.ActiveFormattingElements.prototype.indexOf = function (j) {
          return this.list.lastIndexOf(j);
        }),
        (Me.ActiveFormattingElements.prototype.remove = function (j) {
          var B = this.list.lastIndexOf(j);
          B !== -1 && (this.list.splice(B, 1), this.attrs.splice(B, 1));
        }),
        (Me.ActiveFormattingElements.prototype.replace = function (j, B, se) {
          var X = this.list.lastIndexOf(j);
          X !== -1 && ((this.list[X] = B), (this.attrs[X] = se));
        }),
        (Me.ActiveFormattingElements.prototype.insertAfter = function (j, B) {
          var se = this.list.lastIndexOf(j);
          se !== -1 &&
            (this.list.splice(se, 0, B), this.attrs.splice(se, 0, B));
        });
      function Me(j, B, se) {
        var X = null,
          Ve = 0,
          J = 0,
          Er = !1,
          Un = !1,
          br = 0,
          Dn = [],
          _t = "",
          Ao = !0,
          _r = 0,
          A = De,
          Bn,
          Ke,
          Le = "",
          Ro = "",
          Pe = [],
          Ct = "",
          wt = "",
          Be = [],
          Hn = [],
          Vn = [],
          $n = [],
          Yt = [],
          xo = !1,
          U = m0,
          Tn = null,
          Sn = [],
          N = new Me.ElementStack(),
          be = new Me.ActiveFormattingElements(),
          wr = B !== void 0,
          Oo = null,
          Cn = null,
          ko = !0;
        B && (ko = B.ownerDocument._scripting_enabled),
          se && se.scripting_enabled === !1 && (ko = !1);
        var Qe = !0,
          Ml = !1,
          Lo,
          Al,
          W = [],
          qn = !1,
          Dr = !1,
          Po = {
            document: function () {
              return Ae;
            },
            _asDocumentFragment: function () {
              for (
                var f = Ae.createDocumentFragment(), h = Ae.firstChild;
                h.hasChildNodes();

              )
                f.appendChild(h.firstChild);
              return f;
            },
            pause: function () {
              _r++;
            },
            resume: function () {
              _r--, this.parse("");
            },
            parse: function (f, h, _) {
              var k;
              return _r > 0
                ? ((_t += f), !0)
                : (br === 0
                    ? (_t && ((f = _t + f), (_t = "")),
                      h && ((f += "\uFFFF"), (Er = !0)),
                      (X = f),
                      (Ve = f.length),
                      (J = 0),
                      Ao && ((Ao = !1), X.charCodeAt(0) === 65279 && (J = 1)),
                      br++,
                      (k = yp(_)),
                      (_t = X.substring(J, Ve)),
                      br--)
                    : (br++,
                      Dn.push(X, Ve, J),
                      (X = f),
                      (Ve = f.length),
                      (J = 0),
                      yp(),
                      (k = !1),
                      (_t = X.substring(J, Ve)),
                      (J = Dn.pop()),
                      (Ve = Dn.pop()),
                      (X = Dn.pop()),
                      _t &&
                        ((X = _t + X.substring(J)),
                        (Ve = X.length),
                        (J = 0),
                        (_t = "")),
                      br--),
                  k);
            },
          },
          Ae = new n(!0, j);
        if (((Ae._parser = Po), (Ae._scripting_enabled = ko), B)) {
          if (
            (B.ownerDocument._quirks && (Ae._quirks = !0),
            B.ownerDocument._limitedQuirks && (Ae._limitedQuirks = !0),
            B.namespaceURI === s.HTML)
          )
            switch (B.localName) {
              case "title":
              case "textarea":
                A = Kn;
                break;
              case "style":
              case "xmp":
              case "iframe":
              case "noembed":
              case "noframes":
              case "script":
              case "plaintext":
                A = Ll;
                break;
            }
          var gp = Ae.createElement("html");
          Ae._appendChild(gp),
            N.push(gp),
            B instanceof a.HTMLTemplateElement && Sn.push(zl),
            rs();
          for (var Xi = B; Xi !== null; Xi = Xi.parentElement)
            if (Xi instanceof a.HTMLFormElement) {
              Cn = Xi;
              break;
            }
        }
        function yp(f) {
          for (var h, _, k, P; J < Ve; ) {
            if (_r > 0 || (f && f())) return !0;
            switch (typeof A.lookahead) {
              case "undefined":
                if (((h = X.charCodeAt(J++)), Un && ((Un = !1), h === 10))) {
                  J++;
                  continue;
                }
                switch (h) {
                  case 13:
                    J < Ve ? X.charCodeAt(J) === 10 && J++ : (Un = !0), A(10);
                    break;
                  case 65535:
                    if (Er && J === Ve) {
                      A(l);
                      break;
                    }
                  default:
                    A(h);
                    break;
                }
                break;
              case "number":
                h = X.charCodeAt(J);
                var K = A.lookahead,
                  ce = !0;
                if ((K < 0 && ((ce = !1), (K = -K)), K < Ve - J))
                  (_ = ce ? X.substring(J, J + K) : null), (P = !1);
                else if (Er)
                  (_ = ce ? X.substring(J, Ve) : null),
                    (P = !0),
                    h === 65535 && J === Ve - 1 && (h = l);
                else return !0;
                A(h, _, P);
                break;
              case "string":
                (h = X.charCodeAt(J)), (k = A.lookahead);
                var Te = X.indexOf(k, J);
                if (Te !== -1) (_ = X.substring(J, Te + k.length)), (P = !1);
                else {
                  if (!Er) return !0;
                  (_ = X.substring(J, Ve)),
                    h === 65535 && J === Ve - 1 && (h = l),
                    (P = !0);
                }
                A(h, _, P);
                break;
            }
          }
          return !1;
        }
        function zn(f, h) {
          for (var _ = 0; _ < Yt.length; _++) if (Yt[_][0] === f) return;
          h !== void 0 ? Yt.push([f, h]) : Yt.push([f]);
        }
        function E_() {
          up.lastIndex = J - 1;
          var f = up.exec(X);
          if (!f) throw new Error("should never happen");
          var h = f[1];
          if (!h) return !1;
          var _ = f[2],
            k = _.length;
          switch (_[0]) {
            case '"':
            case "'":
              (_ = _.substring(1, k - 1)), (J += f[0].length - 1), (A = Ul);
              break;
            default:
              (A = hn), (J += f[0].length - 1), (_ = _.substring(0, k - 1));
              break;
          }
          for (var P = 0; P < Yt.length; P++) if (Yt[P][0] === h) return !0;
          return Yt.push([h, _]), !0;
        }
        function b_() {
          (xo = !1), (Le = ""), (Yt.length = 0);
        }
        function Ji() {
          (xo = !0), (Le = ""), (Yt.length = 0);
        }
        function In() {
          Pe.length = 0;
        }
        function Rl() {
          Ct = "";
        }
        function xl() {
          wt = "";
        }
        function vp() {
          Be.length = 0;
        }
        function ni() {
          (Hn.length = 0), (Vn = null), ($n = null);
        }
        function Fo() {
          Vn = [];
        }
        function Gn() {
          $n = [];
        }
        function Re() {
          Ml = !0;
        }
        function __() {
          return N.top && N.top.namespaceURI !== "http://www.w3.org/1999/xhtml";
        }
        function jt(f) {
          return Ro === f;
        }
        function ri() {
          if (W.length > 0) {
            var f = mt(W);
            if (
              ((W.length = 0),
              Dr &&
                ((Dr = !1),
                f[0] ===
                  `
` && (f = f.substring(1)),
                f.length === 0))
            )
              return;
            Ze(u, f), (qn = !1);
          }
          Dr = !1;
        }
        function es(f) {
          f.lastIndex = J - 1;
          var h = f.exec(X);
          if (h && h.index === J - 1)
            return (
              (h = h[0]),
              (J += h.length - 1),
              Er && J === Ve && ((h = h.slice(0, -1)), J--),
              h
            );
          throw new Error("should never happen");
        }
        function ts(f) {
          f.lastIndex = J - 1;
          var h = f.exec(X)[0];
          return h ? (w_(h), (J += h.length - 1), !0) : !1;
        }
        function w_(f) {
          W.length > 0 && ri(),
            !(
              Dr &&
              ((Dr = !1),
              f[0] ===
                `
` && (f = f.substring(1)),
              f.length === 0)
            ) && Ze(u, f);
        }
        function Nn() {
          if (xo) Ze(g, Le);
          else {
            var f = Le;
            (Le = ""), (Ro = f), Ze(d, f, Yt);
          }
        }
        function D_() {
          if (J === Ve) return !1;
          lp.lastIndex = J;
          var f = lp.exec(X);
          if (!f) throw new Error("should never happen");
          var h = f[2];
          if (!h) return !1;
          var _ = f[1];
          return (
            _
              ? ((J += h.length + 2), Ze(g, h))
              : ((J += h.length + 1), (Ro = h), Ze(d, h, M)),
            !0
          );
        }
        function T_() {
          xo ? Ze(g, Le, null, !0) : Ze(d, Le, Yt, !0);
        }
        function xe() {
          Ze(S, mt(Hn), Vn ? mt(Vn) : void 0, $n ? mt($n) : void 0);
        }
        function ye() {
          ri(), U(l), (Ae.modclock = 1);
        }
        var Ze = (Po.insertToken = function (h, _, k, P) {
          ri();
          var K = N.top;
          !K || K.namespaceURI === s.HTML
            ? U(h, _, k, P)
            : h !== d && h !== u
              ? kp(h, _, k, P)
              : (dp(K) &&
                    (h === u ||
                      (h === d && _ !== "mglyph" && _ !== "malignmark"))) ||
                  (h === d &&
                    _ === "svg" &&
                    K.namespaceURI === s.MATHML &&
                    K.localName === "annotation-xml") ||
                  fp(K)
                ? ((Al = !0), U(h, _, k, P), (Al = !1))
                : kp(h, _, k, P);
        });
        function un(f) {
          var h = N.top;
          Wn && ke(h, te)
            ? Uo(function (_) {
                return _.createComment(f);
              })
            : (h instanceof a.HTMLTemplateElement && (h = h.content),
              h._appendChild(h.ownerDocument.createComment(f)));
        }
        function dn(f) {
          var h = N.top;
          if (Wn && ke(h, te))
            Uo(function (k) {
              return k.createTextNode(f);
            });
          else {
            h instanceof a.HTMLTemplateElement && (h = h.content);
            var _ = h.lastChild;
            _ && _.nodeType === i.TEXT_NODE
              ? _.appendData(f)
              : h._appendChild(h.ownerDocument.createTextNode(f));
          }
        }
        function ns(f, h, _) {
          var k = o.createElement(f, h, null);
          if (_)
            for (var P = 0, K = _.length; P < K; P++)
              k._setAttribute(_[P][0], _[P][1]);
          return k;
        }
        var Wn = !1;
        function fe(f, h) {
          var _ = jo(function (k) {
            return ns(k, f, h);
          });
          return ke(_, v) && (_._form = Cn), _;
        }
        function jo(f) {
          var h;
          return (
            Wn && ke(N.top, te)
              ? (h = Uo(f))
              : N.top instanceof a.HTMLTemplateElement
                ? ((h = f(N.top.content.ownerDocument)),
                  N.top.content._appendChild(h))
                : ((h = f(N.top.ownerDocument)), N.top._appendChild(h)),
            N.push(h),
            h
          );
        }
        function Ol(f, h, _) {
          return jo(function (k) {
            var P = k._createElementNS(f, _, null);
            if (h)
              for (var K = 0, ce = h.length; K < ce; K++) {
                var Te = h[K];
                Te.length === 2
                  ? P._setAttribute(Te[0], Te[1])
                  : P._setAttributeNS(Te[2], Te[0], Te[1]);
              }
            return P;
          });
        }
        function Ep(f) {
          for (var h = N.elements.length - 1; h >= 0; h--)
            if (N.elements[h] instanceof f) return h;
          return -1;
        }
        function Uo(f) {
          var h,
            _,
            k = -1,
            P = -1,
            K;
          if (
            ((k = Ep(a.HTMLTableElement)),
            (P = Ep(a.HTMLTemplateElement)),
            P >= 0 && (k < 0 || P > k)
              ? (h = N.elements[P])
              : k >= 0 &&
                ((h = N.elements[k].parentNode),
                h ? (_ = N.elements[k]) : (h = N.elements[k - 1])),
            h || (h = N.elements[0]),
            h instanceof a.HTMLTemplateElement && (h = h.content),
            (K = f(h.ownerDocument)),
            K.nodeType === i.TEXT_NODE)
          ) {
            var ce;
            if (
              (_ ? (ce = _.previousSibling) : (ce = h.lastChild),
              ce && ce.nodeType === i.TEXT_NODE)
            )
              return ce.appendData(K.data), K;
          }
          return _ ? h.insertBefore(K, _) : h._appendChild(K), K;
        }
        function rs() {
          for (var f = !1, h = N.elements.length - 1; h >= 0; h--) {
            var _ = N.elements[h];
            if (
              (h === 0 && ((f = !0), wr && (_ = B)), _.namespaceURI === s.HTML)
            ) {
              var k = _.localName;
              switch (k) {
                case "select":
                  for (var P = h; P > 0; ) {
                    var K = N.elements[--P];
                    if (K instanceof a.HTMLTemplateElement) break;
                    if (K instanceof a.HTMLTableElement) {
                      U = Jo;
                      return;
                    }
                  }
                  U = Mn;
                  return;
                case "tr":
                  U = os;
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  U = Ir;
                  return;
                case "caption":
                  U = ql;
                  return;
                case "colgroup":
                  U = Xo;
                  return;
                case "table":
                  U = Ut;
                  return;
                case "template":
                  U = Sn[Sn.length - 1];
                  return;
                case "body":
                  U = ae;
                  return;
                case "frameset":
                  U = Gl;
                  return;
                case "html":
                  Oo === null ? (U = Yo) : (U = $l);
                  return;
                default:
                  if (!f) {
                    if (k === "head") {
                      U = Ye;
                      return;
                    }
                    if (k === "td" || k === "th") {
                      U = ii;
                      return;
                    }
                  }
              }
            }
            if (f) {
              U = ae;
              return;
            }
          }
        }
        function Bo(f, h) {
          fe(f, h), (A = is), (Tn = U), (U = Zo);
        }
        function S_(f, h) {
          fe(f, h), (A = Kn), (Tn = U), (U = Zo);
        }
        function kl(f, h) {
          return {
            elt: ns(f, be.list[h].localName, be.attrs[h]),
            attrs: be.attrs[h],
          };
        }
        function vt() {
          if (be.list.length !== 0) {
            var f = be.list[be.list.length - 1];
            if (f !== be.MARKER && N.elements.lastIndexOf(f) === -1) {
              for (
                var h = be.list.length - 2;
                h >= 0 &&
                ((f = be.list[h]),
                !(f === be.MARKER || N.elements.lastIndexOf(f) !== -1));
                h--
              );
              for (h = h + 1; h < be.list.length; h++) {
                var _ = jo(function (k) {
                  return kl(k, h).elt;
                });
                be.list[h] = _;
              }
            }
          }
        }
        var Ho = { localName: "BM" };
        function C_(f) {
          if (ke(N.top, f) && be.indexOf(N.top) === -1) return N.pop(), !0;
          for (var h = 0; h < 8; ) {
            h++;
            var _ = be.findElementByTag(f);
            if (!_) return !1;
            var k = N.elements.lastIndexOf(_);
            if (k === -1) return be.remove(_), !0;
            if (!N.elementInScope(_)) return !0;
            for (var P = null, K, ce = k + 1; ce < N.elements.length; ce++)
              if (ke(N.elements[ce], I)) {
                (P = N.elements[ce]), (K = ce);
                break;
              }
            if (P) {
              var Te = N.elements[k - 1];
              be.insertAfter(_, Ho);
              for (
                var ze = P, lt = P, Bt = K, Zt, Nr = 0;
                Nr++, (ze = N.elements[--Bt]), ze !== _;

              ) {
                if (
                  ((Zt = be.indexOf(ze)),
                  Nr > 3 && Zt !== -1 && (be.remove(ze), (Zt = -1)),
                  Zt === -1)
                ) {
                  N.removeElement(ze);
                  continue;
                }
                var Jn = kl(Te.ownerDocument, Zt);
                be.replace(ze, Jn.elt, Jn.attrs),
                  (N.elements[Bt] = Jn.elt),
                  (ze = Jn.elt),
                  lt === P && (be.remove(Ho), be.insertAfter(Jn.elt, Ho)),
                  ze._appendChild(lt),
                  (lt = ze);
              }
              Wn && ke(Te, te)
                ? Uo(function () {
                    return lt;
                  })
                : Te instanceof a.HTMLTemplateElement
                  ? Te.content._appendChild(lt)
                  : Te._appendChild(lt);
              for (
                var as = kl(P.ownerDocument, be.indexOf(_));
                P.hasChildNodes();

              )
                as.elt._appendChild(P.firstChild);
              P._appendChild(as.elt),
                be.remove(_),
                be.replace(Ho, as.elt, as.attrs),
                N.removeElement(_);
              var b0 = N.elements.lastIndexOf(P);
              N.elements.splice(b0 + 1, 0, as.elt);
            } else return N.popElement(_), be.remove(_), !0;
          }
          return !0;
        }
        function I_() {
          N.pop(), (U = Tn);
        }
        function Tr() {
          delete Ae._parser,
            (N.elements.length = 0),
            Ae.defaultView &&
              Ae.defaultView.dispatchEvent(new a.Event("load", {}));
        }
        function re(f, h) {
          (A = h), J--;
        }
        function De(f) {
          switch (f) {
            case 38:
              (Bn = De), (A = ss);
              break;
            case 60:
              if (D_()) break;
              A = N_;
              break;
            case 0:
              W.push(f), (qn = !0);
              break;
            case -1:
              ye();
              break;
            default:
              ts(p_) || W.push(f);
              break;
          }
        }
        function Kn(f) {
          switch (f) {
            case 38:
              (Bn = Kn), (A = ss);
              break;
            case 60:
              A = A_;
              break;
            case 0:
              W.push(65533), (qn = !0);
              break;
            case -1:
              ye();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function is(f) {
          switch (f) {
            case 60:
              A = O_;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ye();
              break;
            default:
              ts(cp) || W.push(f);
              break;
          }
        }
        function Qn(f) {
          switch (f) {
            case 60:
              A = P_;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ye();
              break;
            default:
              ts(cp) || W.push(f);
              break;
          }
        }
        function Ll(f) {
          switch (f) {
            case 0:
              W.push(65533);
              break;
            case -1:
              ye();
              break;
            default:
              ts(m_) || W.push(f);
              break;
          }
        }
        function N_(f) {
          switch (f) {
            case 33:
              A = Dp;
              break;
            case 47:
              A = M_;
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              b_(), re(f, bp);
              break;
            case 63:
              re(f, zo);
              break;
            default:
              W.push(60), re(f, De);
              break;
          }
        }
        function M_(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Ji(), re(f, bp);
              break;
            case 62:
              A = De;
              break;
            case -1:
              W.push(60), W.push(47), ye();
              break;
            default:
              re(f, zo);
              break;
          }
        }
        function bp(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = hn;
              break;
            case 47:
              A = Zn;
              break;
            case 62:
              (A = De), Nn();
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Le += String.fromCharCode(f + 32);
              break;
            case 0:
              Le += "\uFFFD";
              break;
            case -1:
              ye();
              break;
            default:
              Le += es(Zi);
              break;
          }
        }
        function A_(f) {
          f === 47 ? (In(), (A = R_)) : (W.push(60), re(f, Kn));
        }
        function R_(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Ji(), re(f, x_);
              break;
            default:
              W.push(60), W.push(47), re(f, Kn);
              break;
          }
        }
        function x_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (jt(Le)) {
                A = hn;
                return;
              }
              break;
            case 47:
              if (jt(Le)) {
                A = Zn;
                return;
              }
              break;
            case 62:
              if (jt(Le)) {
                (A = De), Nn();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(f + 32)), Pe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(f)), Pe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Pe), re(f, Kn);
        }
        function O_(f) {
          f === 47 ? (In(), (A = k_)) : (W.push(60), re(f, is));
        }
        function k_(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Ji(), re(f, L_);
              break;
            default:
              W.push(60), W.push(47), re(f, is);
              break;
          }
        }
        function L_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (jt(Le)) {
                A = hn;
                return;
              }
              break;
            case 47:
              if (jt(Le)) {
                A = Zn;
                return;
              }
              break;
            case 62:
              if (jt(Le)) {
                (A = De), Nn();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(f + 32)), Pe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(f)), Pe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Pe), re(f, is);
        }
        function P_(f) {
          switch (f) {
            case 47:
              In(), (A = F_);
              break;
            case 33:
              (A = U_), W.push(60), W.push(33);
              break;
            default:
              W.push(60), re(f, Qn);
              break;
          }
        }
        function F_(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Ji(), re(f, j_);
              break;
            default:
              W.push(60), W.push(47), re(f, Qn);
              break;
          }
        }
        function j_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (jt(Le)) {
                A = hn;
                return;
              }
              break;
            case 47:
              if (jt(Le)) {
                A = Zn;
                return;
              }
              break;
            case 62:
              if (jt(Le)) {
                (A = De), Nn();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(f + 32)), Pe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(f)), Pe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Pe), re(f, Qn);
        }
        function U_(f) {
          f === 45 ? ((A = B_), W.push(45)) : re(f, Qn);
        }
        function B_(f) {
          f === 45 ? ((A = _p), W.push(45)) : re(f, Qn);
        }
        function fn(f) {
          switch (f) {
            case 45:
              (A = H_), W.push(45);
              break;
            case 60:
              A = Pl;
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ye();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function H_(f) {
          switch (f) {
            case 45:
              (A = _p), W.push(45);
              break;
            case 60:
              A = Pl;
              break;
            case 0:
              (A = fn), W.push(65533);
              break;
            case -1:
              ye();
              break;
            default:
              (A = fn), W.push(f);
              break;
          }
        }
        function _p(f) {
          switch (f) {
            case 45:
              W.push(45);
              break;
            case 60:
              A = Pl;
              break;
            case 62:
              (A = Qn), W.push(62);
              break;
            case 0:
              (A = fn), W.push(65533);
              break;
            case -1:
              ye();
              break;
            default:
              (A = fn), W.push(f);
              break;
          }
        }
        function Pl(f) {
          switch (f) {
            case 47:
              In(), (A = V_);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              In(), W.push(60), re(f, q_);
              break;
            default:
              W.push(60), re(f, fn);
              break;
          }
        }
        function V_(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Ji(), re(f, $_);
              break;
            default:
              W.push(60), W.push(47), re(f, fn);
              break;
          }
        }
        function $_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (jt(Le)) {
                A = hn;
                return;
              }
              break;
            case 47:
              if (jt(Le)) {
                A = Zn;
                return;
              }
              break;
            case 62:
              if (jt(Le)) {
                (A = De), Nn();
                return;
              }
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              (Le += String.fromCharCode(f + 32)), Pe.push(f);
              return;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              (Le += String.fromCharCode(f)), Pe.push(f);
              return;
            default:
              break;
          }
          W.push(60), W.push(47), c(W, Pe), re(f, fn);
        }
        function q_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              mt(Pe) === "script" ? (A = Yn) : (A = fn), W.push(f);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Pe.push(f + 32), W.push(f);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Pe.push(f), W.push(f);
              break;
            default:
              re(f, fn);
              break;
          }
        }
        function Yn(f) {
          switch (f) {
            case 45:
              (A = z_), W.push(45);
              break;
            case 60:
              (A = Fl), W.push(60);
              break;
            case 0:
              W.push(65533);
              break;
            case -1:
              ye();
              break;
            default:
              W.push(f);
              break;
          }
        }
        function z_(f) {
          switch (f) {
            case 45:
              (A = G_), W.push(45);
              break;
            case 60:
              (A = Fl), W.push(60);
              break;
            case 0:
              (A = Yn), W.push(65533);
              break;
            case -1:
              ye();
              break;
            default:
              (A = Yn), W.push(f);
              break;
          }
        }
        function G_(f) {
          switch (f) {
            case 45:
              W.push(45);
              break;
            case 60:
              (A = Fl), W.push(60);
              break;
            case 62:
              (A = Qn), W.push(62);
              break;
            case 0:
              (A = Yn), W.push(65533);
              break;
            case -1:
              ye();
              break;
            default:
              (A = Yn), W.push(f);
              break;
          }
        }
        function Fl(f) {
          f === 47 ? (In(), (A = W_), W.push(47)) : re(f, Yn);
        }
        function W_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              mt(Pe) === "script" ? (A = fn) : (A = Yn), W.push(f);
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Pe.push(f + 32), W.push(f);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
            case 108:
            case 109:
            case 110:
            case 111:
            case 112:
            case 113:
            case 114:
            case 115:
            case 116:
            case 117:
            case 118:
            case 119:
            case 120:
            case 121:
            case 122:
              Pe.push(f), W.push(f);
              break;
            default:
              re(f, Yn);
              break;
          }
        }
        function hn(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              A = Zn;
              break;
            case 62:
              (A = De), Nn();
              break;
            case -1:
              ye();
              break;
            case 61:
              Rl(), (Ct += String.fromCharCode(f)), (A = jl);
              break;
            default:
              if (E_()) break;
              Rl(), re(f, jl);
              break;
          }
        }
        function jl(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
            case -1:
              re(f, K_);
              break;
            case 61:
              A = wp;
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Ct += String.fromCharCode(f + 32);
              break;
            case 0:
              Ct += "\uFFFD";
              break;
            case 34:
            case 39:
            case 60:
            default:
              Ct += es(f_);
              break;
          }
        }
        function K_(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              zn(Ct), (A = Zn);
              break;
            case 61:
              A = wp;
              break;
            case 62:
              (A = De), zn(Ct), Nn();
              break;
            case -1:
              zn(Ct), ye();
              break;
            default:
              zn(Ct), Rl(), re(f, jl);
              break;
          }
        }
        function wp(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              xl(), (A = Vo);
              break;
            case 39:
              xl(), (A = $o);
              break;
            case 62:
            default:
              xl(), re(f, qo);
              break;
          }
        }
        function Vo(f) {
          switch (f) {
            case 34:
              zn(Ct, wt), (A = Ul);
              break;
            case 38:
              (Bn = Vo), (A = ss);
              break;
            case 0:
              wt += "\uFFFD";
              break;
            case -1:
              ye();
              break;
            case 10:
              wt += String.fromCharCode(f);
              break;
            default:
              wt += es(wn);
              break;
          }
        }
        function $o(f) {
          switch (f) {
            case 39:
              zn(Ct, wt), (A = Ul);
              break;
            case 38:
              (Bn = $o), (A = ss);
              break;
            case 0:
              wt += "\uFFFD";
              break;
            case -1:
              ye();
              break;
            case 10:
              wt += String.fromCharCode(f);
              break;
            default:
              wt += es(bt);
              break;
          }
        }
        function qo(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              zn(Ct, wt), (A = hn);
              break;
            case 38:
              (Bn = qo), (A = ss);
              break;
            case 62:
              zn(Ct, wt), (A = De), Nn();
              break;
            case 0:
              wt += "\uFFFD";
              break;
            case -1:
              J--, (A = De);
              break;
            case 34:
            case 39:
            case 60:
            case 61:
            case 96:
            default:
              wt += es(ti);
              break;
          }
        }
        function Ul(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = hn;
              break;
            case 47:
              A = Zn;
              break;
            case 62:
              (A = De), Nn();
              break;
            case -1:
              ye();
              break;
            default:
              re(f, hn);
              break;
          }
        }
        function Zn(f) {
          switch (f) {
            case 62:
              (A = De), T_(!0);
              break;
            case -1:
              ye();
              break;
            default:
              re(f, hn);
              break;
          }
        }
        function zo(f, h, _) {
          var k = h.length;
          _ ? (J += k - 1) : (J += k);
          var P = h.substring(0, k - 1);
          (P = P.replace(/\u0000/g, "\uFFFD")),
            (P = P.replace(
              /\u000D\u000A/g,
              `
`,
            )),
            (P = P.replace(
              /\u000D/g,
              `
`,
            )),
            Ze(E, P),
            (A = De);
        }
        zo.lookahead = ">";
        function Dp(f, h, _) {
          if (h[0] === "-" && h[1] === "-") {
            (J += 2), vp(), (A = Q_);
            return;
          }
          h.toUpperCase() === "DOCTYPE"
            ? ((J += 7), (A = n0))
            : h === "[CDATA[" && __()
              ? ((J += 7), (A = Vl))
              : (A = zo);
        }
        Dp.lookahead = 7;
        function Q_(f) {
          switch ((vp(), f)) {
            case 45:
              A = Y_;
              break;
            case 62:
              (A = De), Ze(E, mt(Be));
              break;
            default:
              re(f, Sr);
              break;
          }
        }
        function Y_(f) {
          switch (f) {
            case 45:
              A = Go;
              break;
            case 62:
              (A = De), Ze(E, mt(Be));
              break;
            case -1:
              Ze(E, mt(Be)), ye();
              break;
            default:
              Be.push(45), re(f, Sr);
              break;
          }
        }
        function Sr(f) {
          switch (f) {
            case 60:
              Be.push(f), (A = Z_);
              break;
            case 45:
              A = Bl;
              break;
            case 0:
              Be.push(65533);
              break;
            case -1:
              Ze(E, mt(Be)), ye();
              break;
            default:
              Be.push(f);
              break;
          }
        }
        function Z_(f) {
          switch (f) {
            case 33:
              Be.push(f), (A = X_);
              break;
            case 60:
              Be.push(f);
              break;
            default:
              re(f, Sr);
              break;
          }
        }
        function X_(f) {
          switch (f) {
            case 45:
              A = J_;
              break;
            default:
              re(f, Sr);
              break;
          }
        }
        function J_(f) {
          switch (f) {
            case 45:
              A = e0;
              break;
            default:
              re(f, Bl);
              break;
          }
        }
        function e0(f) {
          switch (f) {
            case 62:
            case -1:
              re(f, Go);
              break;
            default:
              re(f, Go);
              break;
          }
        }
        function Bl(f) {
          switch (f) {
            case 45:
              A = Go;
              break;
            case -1:
              Ze(E, mt(Be)), ye();
              break;
            default:
              Be.push(45), re(f, Sr);
              break;
          }
        }
        function Go(f) {
          switch (f) {
            case 62:
              (A = De), Ze(E, mt(Be));
              break;
            case 33:
              A = t0;
              break;
            case 45:
              Be.push(45);
              break;
            case -1:
              Ze(E, mt(Be)), ye();
              break;
            default:
              Be.push(45), Be.push(45), re(f, Sr);
              break;
          }
        }
        function t0(f) {
          switch (f) {
            case 45:
              Be.push(45), Be.push(45), Be.push(33), (A = Bl);
              break;
            case 62:
              (A = De), Ze(E, mt(Be));
              break;
            case -1:
              Ze(E, mt(Be)), ye();
              break;
            default:
              Be.push(45), Be.push(45), Be.push(33), re(f, Sr);
              break;
          }
        }
        function n0(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = Tp;
              break;
            case -1:
              ni(), Re(), xe(), ye();
              break;
            default:
              re(f, Tp);
              break;
          }
        }
        function Tp(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              ni(), Hn.push(f + 32), (A = Hl);
              break;
            case 0:
              ni(), Hn.push(65533), (A = Hl);
              break;
            case 62:
              ni(), Re(), (A = De), xe();
              break;
            case -1:
              ni(), Re(), xe(), ye();
              break;
            default:
              ni(), Hn.push(f), (A = Hl);
              break;
          }
        }
        function Hl(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = Sp;
              break;
            case 62:
              (A = De), xe();
              break;
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
              Hn.push(f + 32);
              break;
            case 0:
              Hn.push(65533);
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              Hn.push(f);
              break;
          }
        }
        function Sp(f, h, _) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              J += 1;
              break;
            case 62:
              (A = De), (J += 1), xe();
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              (h = h.toUpperCase()),
                h === "PUBLIC"
                  ? ((J += 6), (A = r0))
                  : h === "SYSTEM"
                    ? ((J += 6), (A = o0))
                    : (Re(), (A = Xn));
              break;
          }
        }
        Sp.lookahead = 6;
        function r0(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = i0;
              break;
            case 34:
              Fo(), (A = Cp);
              break;
            case 39:
              Fo(), (A = Ip);
              break;
            case 62:
              Re(), (A = De), xe();
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              Re(), (A = Xn);
              break;
          }
        }
        function i0(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              Fo(), (A = Cp);
              break;
            case 39:
              Fo(), (A = Ip);
              break;
            case 62:
              Re(), (A = De), xe();
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              Re(), (A = Xn);
              break;
          }
        }
        function Cp(f) {
          switch (f) {
            case 34:
              A = Np;
              break;
            case 0:
              Vn.push(65533);
              break;
            case 62:
              Re(), (A = De), xe();
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              Vn.push(f);
              break;
          }
        }
        function Ip(f) {
          switch (f) {
            case 39:
              A = Np;
              break;
            case 0:
              Vn.push(65533);
              break;
            case 62:
              Re(), (A = De), xe();
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              Vn.push(f);
              break;
          }
        }
        function Np(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = s0;
              break;
            case 62:
              (A = De), xe();
              break;
            case 34:
              Gn(), (A = Wo);
              break;
            case 39:
              Gn(), (A = Ko);
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              Re(), (A = Xn);
              break;
          }
        }
        function s0(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (A = De), xe();
              break;
            case 34:
              Gn(), (A = Wo);
              break;
            case 39:
              Gn(), (A = Ko);
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              Re(), (A = Xn);
              break;
          }
        }
        function o0(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              A = a0;
              break;
            case 34:
              Gn(), (A = Wo);
              break;
            case 39:
              Gn(), (A = Ko);
              break;
            case 62:
              Re(), (A = De), xe();
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              Re(), (A = Xn);
              break;
          }
        }
        function a0(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              Gn(), (A = Wo);
              break;
            case 39:
              Gn(), (A = Ko);
              break;
            case 62:
              Re(), (A = De), xe();
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              Re(), (A = Xn);
              break;
          }
        }
        function Wo(f) {
          switch (f) {
            case 34:
              A = Mp;
              break;
            case 0:
              $n.push(65533);
              break;
            case 62:
              Re(), (A = De), xe();
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              $n.push(f);
              break;
          }
        }
        function Ko(f) {
          switch (f) {
            case 39:
              A = Mp;
              break;
            case 0:
              $n.push(65533);
              break;
            case 62:
              Re(), (A = De), xe();
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              $n.push(f);
              break;
          }
        }
        function Mp(f) {
          switch (f) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (A = De), xe();
              break;
            case -1:
              Re(), xe(), ye();
              break;
            default:
              A = Xn;
              break;
          }
        }
        function Xn(f) {
          switch (f) {
            case 62:
              (A = De), xe();
              break;
            case -1:
              xe(), ye();
              break;
            default:
              break;
          }
        }
        function Vl(f) {
          switch (f) {
            case 93:
              A = c0;
              break;
            case -1:
              ye();
              break;
            case 0:
              qn = !0;
            default:
              ts(h_) || W.push(f);
              break;
          }
        }
        function c0(f) {
          switch (f) {
            case 93:
              A = l0;
              break;
            default:
              W.push(93), re(f, Vl);
              break;
          }
        }
        function l0(f) {
          switch (f) {
            case 93:
              W.push(93);
              break;
            case 62:
              ri(), (A = De);
              break;
            default:
              W.push(93), W.push(93), re(f, Vl);
              break;
          }
        }
        function ss(f) {
          switch ((In(), Pe.push(38), f)) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 60:
            case 38:
            case -1:
              re(f, Cr);
              break;
            case 35:
              Pe.push(f), (A = u0);
              break;
            default:
              re(f, Ap);
              break;
          }
        }
        function Ap(f) {
          yt.lastIndex = J;
          var h = yt.exec(X);
          if (!h) throw new Error("should never happen");
          var _ = h[1];
          if (!_) {
            A = Cr;
            return;
          }
          switch (((J += _.length), c(Pe, y_(_)), Bn)) {
            case Vo:
            case $o:
            case qo:
              if (_[_.length - 1] !== ";" && /[=A-Za-z0-9]/.test(X[J])) {
                A = Cr;
                return;
              }
              break;
            default:
              break;
          }
          In();
          var k = we[_];
          typeof k == "number" ? Pe.push(k) : c(Pe, k), (A = Cr);
        }
        Ap.lookahead = -at;
        function u0(f) {
          switch (((Ke = 0), f)) {
            case 120:
            case 88:
              Pe.push(f), (A = d0);
              break;
            default:
              re(f, f0);
              break;
          }
        }
        function d0(f) {
          switch (f) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
              re(f, h0);
              break;
            default:
              re(f, Cr);
              break;
          }
        }
        function f0(f) {
          switch (f) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              re(f, p0);
              break;
            default:
              re(f, Cr);
              break;
          }
        }
        function h0(f) {
          switch (f) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
              (Ke *= 16), (Ke += f - 55);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
              (Ke *= 16), (Ke += f - 87);
              break;
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              (Ke *= 16), (Ke += f - 48);
              break;
            case 59:
              A = Qo;
              break;
            default:
              re(f, Qo);
              break;
          }
        }
        function p0(f) {
          switch (f) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              (Ke *= 10), (Ke += f - 48);
              break;
            case 59:
              A = Qo;
              break;
            default:
              re(f, Qo);
              break;
          }
        }
        function Qo(f) {
          Ke in $
            ? (Ke = $[Ke])
            : (Ke > 1114111 || (Ke >= 55296 && Ke < 57344)) && (Ke = 65533),
            In(),
            Ke <= 65535
              ? Pe.push(Ke)
              : ((Ke = Ke - 65536),
                Pe.push(55296 + (Ke >> 10)),
                Pe.push(56320 + (Ke & 1023))),
            re(f, Cr);
        }
        function Cr(f) {
          switch (Bn) {
            case Vo:
            case $o:
            case qo:
              wt += mt(Pe);
              break;
            default:
              c(W, Pe);
              break;
          }
          re(f, Bn);
        }
        function m0(f, h, _, k) {
          switch (f) {
            case 1:
              if (((h = h.replace(vr, "")), h.length === 0)) return;
              break;
            case 4:
              Ae._appendChild(Ae.createComment(h));
              return;
            case 5:
              var P = h,
                K = _,
                ce = k;
              Ae.appendChild(new r(Ae, P, K, ce)),
                Ml ||
                P.toLowerCase() !== "html" ||
                H.test(K) ||
                (ce && ce.toLowerCase() === L) ||
                (ce === void 0 && D.test(K))
                  ? (Ae._quirks = !0)
                  : (w.test(K) || (ce !== void 0 && D.test(K))) &&
                    (Ae._limitedQuirks = !0),
                (U = Rp);
              return;
          }
          (Ae._quirks = !0), (U = Rp), U(f, h, _, k);
        }
        function Rp(f, h, _, k) {
          var P;
          switch (f) {
            case 1:
              if (((h = h.replace(vr, "")), h.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              Ae._appendChild(Ae.createComment(h));
              return;
            case 2:
              if (h === "html") {
                (P = ns(Ae, h, _)), N.push(P), Ae.appendChild(P), (U = Yo);
                return;
              }
              break;
            case 3:
              switch (h) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          (P = ns(Ae, "html", null)),
            N.push(P),
            Ae.appendChild(P),
            (U = Yo),
            U(f, h, _, k);
        }
        function Yo(f, h, _, k) {
          switch (f) {
            case 1:
              if (((h = h.replace(vr, "")), h.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              un(h);
              return;
            case 2:
              switch (h) {
                case "html":
                  ae(f, h, _, k);
                  return;
                case "head":
                  var P = fe(h, _);
                  (Oo = P), (U = Ye);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          Yo(d, "head", null), U(f, h, _, k);
        }
        function Ye(f, h, _, k) {
          switch (f) {
            case 1:
              var P = h.match(vr);
              if (
                (P && (dn(P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              un(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ae(f, h, _, k);
                  return;
                case "meta":
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                  fe(h, _), N.pop();
                  return;
                case "title":
                  S_(h, _);
                  return;
                case "noscript":
                  if (!ko) {
                    fe(h, _), (U = xp);
                    return;
                  }
                case "noframes":
                case "style":
                  Bo(h, _);
                  return;
                case "script":
                  jo(function (K) {
                    var ce = ns(K, h, _);
                    return (
                      (ce._parser_inserted = !0),
                      (ce._force_async = !1),
                      wr && (ce._already_started = !0),
                      ri(),
                      ce
                    );
                  }),
                    (A = Qn),
                    (Tn = U),
                    (U = Zo);
                  return;
                case "template":
                  fe(h, _), be.insertMarker(), (Qe = !1), (U = zl), Sn.push(U);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "head":
                  N.pop(), (U = $l);
                  return;
                case "body":
                case "html":
                case "br":
                  break;
                case "template":
                  if (!N.contains("template")) return;
                  N.generateImpliedEndTags(null, "thorough"),
                    N.popTag("template"),
                    be.clearToMarker(),
                    Sn.pop(),
                    rs();
                  return;
                default:
                  return;
              }
              break;
          }
          Ye(g, "head", null), U(f, h, _, k);
        }
        function xp(f, h, _, k) {
          switch (f) {
            case 5:
              return;
            case 4:
              Ye(f, h);
              return;
            case 1:
              var P = h.match(vr);
              if (
                (P && (Ye(f, P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 2:
              switch (h) {
                case "html":
                  ae(f, h, _, k);
                  return;
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "style":
                  Ye(f, h, _);
                  return;
                case "head":
                case "noscript":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "noscript":
                  N.pop(), (U = Ye);
                  return;
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          xp(g, "noscript", null), U(f, h, _, k);
        }
        function $l(f, h, _, k) {
          switch (f) {
            case 1:
              var P = h.match(vr);
              if (
                (P && (dn(P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              un(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ae(f, h, _, k);
                  return;
                case "body":
                  fe(h, _), (Qe = !1), (U = ae);
                  return;
                case "frameset":
                  fe(h, _), (U = Gl);
                  return;
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  N.push(Oo), Ye(d, h, _), N.removeElement(Oo);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "template":
                  return Ye(f, h, _, k);
                case "body":
                case "html":
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          $l(d, "body", null), (Qe = !0), U(f, h, _, k);
        }
        function ae(f, h, _, k) {
          var P, K, ce, Te;
          switch (f) {
            case 1:
              if (qn && ((h = h.replace(Mo, "")), h.length === 0)) return;
              Qe && No.test(h) && (Qe = !1), vt(), dn(h);
              return;
            case 5:
              return;
            case 4:
              un(h);
              return;
            case -1:
              if (Sn.length) return zl(f);
              Tr();
              return;
            case 2:
              switch (h) {
                case "html":
                  if (N.contains("template")) return;
                  mp(_, N.elements[0]);
                  return;
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  Ye(d, h, _);
                  return;
                case "body":
                  if (
                    ((P = N.elements[1]),
                    !P ||
                      !(P instanceof a.HTMLBodyElement) ||
                      N.contains("template"))
                  )
                    return;
                  (Qe = !1), mp(_, P);
                  return;
                case "frameset":
                  if (
                    !Qe ||
                    ((P = N.elements[1]),
                    !P || !(P instanceof a.HTMLBodyElement))
                  )
                    return;
                  for (
                    P.parentNode && P.parentNode.removeChild(P);
                    !(N.top instanceof a.HTMLHtmlElement);

                  )
                    N.pop();
                  fe(h, _), (U = Gl);
                  return;
                case "address":
                case "article":
                case "aside":
                case "blockquote":
                case "center":
                case "details":
                case "dialog":
                case "dir":
                case "div":
                case "dl":
                case "fieldset":
                case "figcaption":
                case "figure":
                case "footer":
                case "header":
                case "hgroup":
                case "main":
                case "nav":
                case "ol":
                case "p":
                case "section":
                case "summary":
                case "ul":
                  N.inButtonScope("p") && ae(g, "p"), fe(h, _);
                  return;
                case "menu":
                  N.inButtonScope("p") && ae(g, "p"),
                    ke(N.top, "menuitem") && N.pop(),
                    fe(h, _);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  N.inButtonScope("p") && ae(g, "p"),
                    N.top instanceof a.HTMLHeadingElement && N.pop(),
                    fe(h, _);
                  return;
                case "pre":
                case "listing":
                  N.inButtonScope("p") && ae(g, "p"),
                    fe(h, _),
                    (Dr = !0),
                    (Qe = !1);
                  return;
                case "form":
                  if (Cn && !N.contains("template")) return;
                  N.inButtonScope("p") && ae(g, "p"),
                    (Te = fe(h, _)),
                    N.contains("template") || (Cn = Te);
                  return;
                case "li":
                  for (Qe = !1, K = N.elements.length - 1; K >= 0; K--) {
                    if (((ce = N.elements[K]), ce instanceof a.HTMLLIElement)) {
                      ae(g, "li");
                      break;
                    }
                    if (ke(ce, I) && !ke(ce, b)) break;
                  }
                  N.inButtonScope("p") && ae(g, "p"), fe(h, _);
                  return;
                case "dd":
                case "dt":
                  for (Qe = !1, K = N.elements.length - 1; K >= 0; K--) {
                    if (((ce = N.elements[K]), ke(ce, ee))) {
                      ae(g, ce.localName);
                      break;
                    }
                    if (ke(ce, I) && !ke(ce, b)) break;
                  }
                  N.inButtonScope("p") && ae(g, "p"), fe(h, _);
                  return;
                case "plaintext":
                  N.inButtonScope("p") && ae(g, "p"), fe(h, _), (A = Ll);
                  return;
                case "button":
                  N.inScope("button")
                    ? (ae(g, "button"), U(f, h, _, k))
                    : (vt(), fe(h, _), (Qe = !1));
                  return;
                case "a":
                  var ze = be.findElementByTag("a");
                  ze && (ae(g, h), be.remove(ze), N.removeElement(ze));
                case "b":
                case "big":
                case "code":
                case "em":
                case "font":
                case "i":
                case "s":
                case "small":
                case "strike":
                case "strong":
                case "tt":
                case "u":
                  vt(), be.push(fe(h, _), _);
                  return;
                case "nobr":
                  vt(), N.inScope(h) && (ae(g, h), vt()), be.push(fe(h, _), _);
                  return;
                case "applet":
                case "marquee":
                case "object":
                  vt(), fe(h, _), be.insertMarker(), (Qe = !1);
                  return;
                case "table":
                  !Ae._quirks && N.inButtonScope("p") && ae(g, "p"),
                    fe(h, _),
                    (Qe = !1),
                    (U = Ut);
                  return;
                case "area":
                case "br":
                case "embed":
                case "img":
                case "keygen":
                case "wbr":
                  vt(), fe(h, _), N.pop(), (Qe = !1);
                  return;
                case "input":
                  vt(), (Te = fe(h, _)), N.pop();
                  var lt = Te.getAttribute("type");
                  (!lt || lt.toLowerCase() !== "hidden") && (Qe = !1);
                  return;
                case "param":
                case "source":
                case "track":
                  fe(h, _), N.pop();
                  return;
                case "hr":
                  N.inButtonScope("p") && ae(g, "p"),
                    ke(N.top, "menuitem") && N.pop(),
                    fe(h, _),
                    N.pop(),
                    (Qe = !1);
                  return;
                case "image":
                  ae(d, "img", _, k);
                  return;
                case "textarea":
                  fe(h, _), (Dr = !0), (Qe = !1), (A = Kn), (Tn = U), (U = Zo);
                  return;
                case "xmp":
                  N.inButtonScope("p") && ae(g, "p"), vt(), (Qe = !1), Bo(h, _);
                  return;
                case "iframe":
                  (Qe = !1), Bo(h, _);
                  return;
                case "noembed":
                  Bo(h, _);
                  return;
                case "select":
                  vt(),
                    fe(h, _),
                    (Qe = !1),
                    U === Ut || U === ql || U === Ir || U === os || U === ii
                      ? (U = Jo)
                      : (U = Mn);
                  return;
                case "optgroup":
                case "option":
                  N.top instanceof a.HTMLOptionElement && ae(g, "option"),
                    vt(),
                    fe(h, _);
                  return;
                case "menuitem":
                  ke(N.top, "menuitem") && N.pop(), vt(), fe(h, _);
                  return;
                case "rb":
                case "rtc":
                  N.inScope("ruby") && N.generateImpliedEndTags(), fe(h, _);
                  return;
                case "rp":
                case "rt":
                  N.inScope("ruby") && N.generateImpliedEndTags("rtc"),
                    fe(h, _);
                  return;
                case "math":
                  vt(), pp(_), Nl(_), Ol(h, _, s.MATHML), k && N.pop();
                  return;
                case "svg":
                  vt(), hp(_), Nl(_), Ol(h, _, s.SVG), k && N.pop();
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "frame":
                case "head":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
              }
              vt(), fe(h, _);
              return;
            case 3:
              switch (h) {
                case "template":
                  Ye(g, h, _);
                  return;
                case "body":
                  if (!N.inScope("body")) return;
                  U = Op;
                  return;
                case "html":
                  if (!N.inScope("body")) return;
                  (U = Op), U(f, h, _);
                  return;
                case "address":
                case "article":
                case "aside":
                case "blockquote":
                case "button":
                case "center":
                case "details":
                case "dialog":
                case "dir":
                case "div":
                case "dl":
                case "fieldset":
                case "figcaption":
                case "figure":
                case "footer":
                case "header":
                case "hgroup":
                case "listing":
                case "main":
                case "menu":
                case "nav":
                case "ol":
                case "pre":
                case "section":
                case "summary":
                case "ul":
                  if (!N.inScope(h)) return;
                  N.generateImpliedEndTags(), N.popTag(h);
                  return;
                case "form":
                  if (N.contains("template")) {
                    if (!N.inScope("form")) return;
                    N.generateImpliedEndTags(), N.popTag("form");
                  } else {
                    var Bt = Cn;
                    if (((Cn = null), !Bt || !N.elementInScope(Bt))) return;
                    N.generateImpliedEndTags(), N.removeElement(Bt);
                  }
                  return;
                case "p":
                  N.inButtonScope(h)
                    ? (N.generateImpliedEndTags(h), N.popTag(h))
                    : (ae(d, h, null), U(f, h, _, k));
                  return;
                case "li":
                  if (!N.inListItemScope(h)) return;
                  N.generateImpliedEndTags(h), N.popTag(h);
                  return;
                case "dd":
                case "dt":
                  if (!N.inScope(h)) return;
                  N.generateImpliedEndTags(h), N.popTag(h);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  if (!N.elementTypeInScope(a.HTMLHeadingElement)) return;
                  N.generateImpliedEndTags(),
                    N.popElementType(a.HTMLHeadingElement);
                  return;
                case "sarcasm":
                  break;
                case "a":
                case "b":
                case "big":
                case "code":
                case "em":
                case "font":
                case "i":
                case "nobr":
                case "s":
                case "small":
                case "strike":
                case "strong":
                case "tt":
                case "u":
                  var Zt = C_(h);
                  if (Zt) return;
                  break;
                case "applet":
                case "marquee":
                case "object":
                  if (!N.inScope(h)) return;
                  N.generateImpliedEndTags(), N.popTag(h), be.clearToMarker();
                  return;
                case "br":
                  ae(d, h, null);
                  return;
              }
              for (K = N.elements.length - 1; K >= 0; K--)
                if (((ce = N.elements[K]), ke(ce, h))) {
                  N.generateImpliedEndTags(h), N.popElement(ce);
                  break;
                } else if (ke(ce, I)) return;
              return;
          }
        }
        function Zo(f, h, _, k) {
          switch (f) {
            case 1:
              dn(h);
              return;
            case -1:
              N.top instanceof a.HTMLScriptElement &&
                (N.top._already_started = !0),
                N.pop(),
                (U = Tn),
                U(f);
              return;
            case 3:
              h === "script" ? I_() : (N.pop(), (U = Tn));
              return;
            default:
              return;
          }
        }
        function Ut(f, h, _, k) {
          function P(ce) {
            for (var Te = 0, ze = ce.length; Te < ze; Te++)
              if (ce[Te][0] === "type") return ce[Te][1].toLowerCase();
            return null;
          }
          switch (f) {
            case 1:
              if (Al) {
                ae(f, h, _, k);
                return;
              } else if (ke(N.top, te)) {
                (Lo = []), (Tn = U), (U = g0), U(f, h, _, k);
                return;
              }
              break;
            case 4:
              un(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "caption":
                  N.clearToContext(x), be.insertMarker(), fe(h, _), (U = ql);
                  return;
                case "colgroup":
                  N.clearToContext(x), fe(h, _), (U = Xo);
                  return;
                case "col":
                  Ut(d, "colgroup", null), U(f, h, _, k);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  N.clearToContext(x), fe(h, _), (U = Ir);
                  return;
                case "td":
                case "th":
                case "tr":
                  Ut(d, "tbody", null), U(f, h, _, k);
                  return;
                case "table":
                  if (!N.inTableScope(h)) return;
                  Ut(g, h), U(f, h, _, k);
                  return;
                case "style":
                case "script":
                case "template":
                  Ye(f, h, _, k);
                  return;
                case "input":
                  var K = P(_);
                  if (K !== "hidden") break;
                  fe(h, _), N.pop();
                  return;
                case "form":
                  if (Cn || N.contains("template")) return;
                  (Cn = fe(h, _)), N.popElement(Cn);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "table":
                  if (!N.inTableScope(h)) return;
                  N.popTag(h), rs();
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
                case "template":
                  Ye(f, h, _, k);
                  return;
              }
              break;
            case -1:
              ae(f, h, _, k);
              return;
          }
          (Wn = !0), ae(f, h, _, k), (Wn = !1);
        }
        function g0(f, h, _, k) {
          if (f === u) {
            if (qn && ((h = h.replace(Mo, "")), h.length === 0)) return;
            Lo.push(h);
          } else {
            var P = Lo.join("");
            (Lo.length = 0),
              No.test(P) ? ((Wn = !0), ae(u, P), (Wn = !1)) : dn(P),
              (U = Tn),
              U(f, h, _, k);
          }
        }
        function ql(f, h, _, k) {
          function P() {
            return N.inTableScope("caption")
              ? (N.generateImpliedEndTags(),
                N.popTag("caption"),
                be.clearToMarker(),
                (U = Ut),
                !0)
              : !1;
          }
          switch (f) {
            case 2:
              switch (h) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  P() && U(f, h, _, k);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "caption":
                  P();
                  return;
                case "table":
                  P() && U(f, h, _, k);
                  return;
                case "body":
                case "col":
                case "colgroup":
                case "html":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  return;
              }
              break;
          }
          ae(f, h, _, k);
        }
        function Xo(f, h, _, k) {
          switch (f) {
            case 1:
              var P = h.match(vr);
              if (
                (P && (dn(P[0]), (h = h.substring(P[0].length))),
                h.length === 0)
              )
                return;
              break;
            case 4:
              un(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "html":
                  ae(f, h, _, k);
                  return;
                case "col":
                  fe(h, _), N.pop();
                  return;
                case "template":
                  Ye(f, h, _, k);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "colgroup":
                  if (!ke(N.top, "colgroup")) return;
                  N.pop(), (U = Ut);
                  return;
                case "col":
                  return;
                case "template":
                  Ye(f, h, _, k);
                  return;
              }
              break;
            case -1:
              ae(f, h, _, k);
              return;
          }
          ke(N.top, "colgroup") && (Xo(g, "colgroup"), U(f, h, _, k));
        }
        function Ir(f, h, _, k) {
          function P() {
            (!N.inTableScope("tbody") &&
              !N.inTableScope("thead") &&
              !N.inTableScope("tfoot")) ||
              (N.clearToContext(F),
              Ir(g, N.top.localName, null),
              U(f, h, _, k));
          }
          switch (f) {
            case 2:
              switch (h) {
                case "tr":
                  N.clearToContext(F), fe(h, _), (U = os);
                  return;
                case "th":
                case "td":
                  Ir(d, "tr", null), U(f, h, _, k);
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  P();
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "table":
                  P();
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  N.inTableScope(h) && (N.clearToContext(F), N.pop(), (U = Ut));
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "td":
                case "th":
                case "tr":
                  return;
              }
              break;
          }
          Ut(f, h, _, k);
        }
        function os(f, h, _, k) {
          function P() {
            return N.inTableScope("tr")
              ? (N.clearToContext(Z), N.pop(), (U = Ir), !0)
              : !1;
          }
          switch (f) {
            case 2:
              switch (h) {
                case "th":
                case "td":
                  N.clearToContext(Z), fe(h, _), (U = ii), be.insertMarker();
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                case "tr":
                  P() && U(f, h, _, k);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "tr":
                  P();
                  return;
                case "table":
                  P() && U(f, h, _, k);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  N.inTableScope(h) && P() && U(f, h, _, k);
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                case "td":
                case "th":
                  return;
              }
              break;
          }
          Ut(f, h, _, k);
        }
        function ii(f, h, _, k) {
          switch (f) {
            case 2:
              switch (h) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  N.inTableScope("td")
                    ? (ii(g, "td"), U(f, h, _, k))
                    : N.inTableScope("th") && (ii(g, "th"), U(f, h, _, k));
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "td":
                case "th":
                  if (!N.inTableScope(h)) return;
                  N.generateImpliedEndTags(),
                    N.popTag(h),
                    be.clearToMarker(),
                    (U = os);
                  return;
                case "body":
                case "caption":
                case "col":
                case "colgroup":
                case "html":
                  return;
                case "table":
                case "tbody":
                case "tfoot":
                case "thead":
                case "tr":
                  if (!N.inTableScope(h)) return;
                  ii(g, N.inTableScope("td") ? "td" : "th"), U(f, h, _, k);
                  return;
              }
              break;
          }
          ae(f, h, _, k);
        }
        function Mn(f, h, _, k) {
          switch (f) {
            case 1:
              if (qn && ((h = h.replace(Mo, "")), h.length === 0)) return;
              dn(h);
              return;
            case 4:
              un(h);
              return;
            case 5:
              return;
            case -1:
              ae(f, h, _, k);
              return;
            case 2:
              switch (h) {
                case "html":
                  ae(f, h, _, k);
                  return;
                case "option":
                  N.top instanceof a.HTMLOptionElement && Mn(g, h), fe(h, _);
                  return;
                case "optgroup":
                  N.top instanceof a.HTMLOptionElement && Mn(g, "option"),
                    N.top instanceof a.HTMLOptGroupElement && Mn(g, h),
                    fe(h, _);
                  return;
                case "select":
                  Mn(g, h);
                  return;
                case "input":
                case "keygen":
                case "textarea":
                  if (!N.inSelectScope("select")) return;
                  Mn(g, "select"), U(f, h, _, k);
                  return;
                case "script":
                case "template":
                  Ye(f, h, _, k);
                  return;
              }
              break;
            case 3:
              switch (h) {
                case "optgroup":
                  N.top instanceof a.HTMLOptionElement &&
                    N.elements[N.elements.length - 2] instanceof
                      a.HTMLOptGroupElement &&
                    Mn(g, "option"),
                    N.top instanceof a.HTMLOptGroupElement && N.pop();
                  return;
                case "option":
                  N.top instanceof a.HTMLOptionElement && N.pop();
                  return;
                case "select":
                  if (!N.inSelectScope(h)) return;
                  N.popTag(h), rs();
                  return;
                case "template":
                  Ye(f, h, _, k);
                  return;
              }
              break;
          }
        }
        function Jo(f, h, _, k) {
          switch (h) {
            case "caption":
            case "table":
            case "tbody":
            case "tfoot":
            case "thead":
            case "tr":
            case "td":
            case "th":
              switch (f) {
                case 2:
                  Jo(g, "select"), U(f, h, _, k);
                  return;
                case 3:
                  N.inTableScope(h) && (Jo(g, "select"), U(f, h, _, k));
                  return;
              }
          }
          Mn(f, h, _, k);
        }
        function zl(f, h, _, k) {
          function P(K) {
            (U = K), (Sn[Sn.length - 1] = U), U(f, h, _, k);
          }
          switch (f) {
            case 1:
            case 4:
            case 5:
              ae(f, h, _, k);
              return;
            case -1:
              N.contains("template")
                ? (N.popTag("template"),
                  be.clearToMarker(),
                  Sn.pop(),
                  rs(),
                  U(f, h, _, k))
                : Tr();
              return;
            case 2:
              switch (h) {
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "script":
                case "style":
                case "template":
                case "title":
                  Ye(f, h, _, k);
                  return;
                case "caption":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  P(Ut);
                  return;
                case "col":
                  P(Xo);
                  return;
                case "tr":
                  P(Ir);
                  return;
                case "td":
                case "th":
                  P(os);
                  return;
              }
              P(ae);
              return;
            case 3:
              switch (h) {
                case "template":
                  Ye(f, h, _, k);
                  return;
                default:
                  return;
              }
          }
        }
        function Op(f, h, _, k) {
          switch (f) {
            case 1:
              if (No.test(h)) break;
              ae(f, h);
              return;
            case 4:
              N.elements[0]._appendChild(Ae.createComment(h));
              return;
            case 5:
              return;
            case -1:
              Tr();
              return;
            case 2:
              if (h === "html") {
                ae(f, h, _, k);
                return;
              }
              break;
            case 3:
              if (h === "html") {
                if (wr) return;
                U = v0;
                return;
              }
              break;
          }
          (U = ae), U(f, h, _, k);
        }
        function Gl(f, h, _, k) {
          switch (f) {
            case 1:
              (h = h.replace(Il, "")), h.length > 0 && dn(h);
              return;
            case 4:
              un(h);
              return;
            case 5:
              return;
            case -1:
              Tr();
              return;
            case 2:
              switch (h) {
                case "html":
                  ae(f, h, _, k);
                  return;
                case "frameset":
                  fe(h, _);
                  return;
                case "frame":
                  fe(h, _), N.pop();
                  return;
                case "noframes":
                  Ye(f, h, _, k);
                  return;
              }
              break;
            case 3:
              if (h === "frameset") {
                if (wr && N.top instanceof a.HTMLHtmlElement) return;
                N.pop(),
                  !wr && !(N.top instanceof a.HTMLFrameSetElement) && (U = y0);
                return;
              }
              break;
          }
        }
        function y0(f, h, _, k) {
          switch (f) {
            case 1:
              (h = h.replace(Il, "")), h.length > 0 && dn(h);
              return;
            case 4:
              un(h);
              return;
            case 5:
              return;
            case -1:
              Tr();
              return;
            case 2:
              switch (h) {
                case "html":
                  ae(f, h, _, k);
                  return;
                case "noframes":
                  Ye(f, h, _, k);
                  return;
              }
              break;
            case 3:
              if (h === "html") {
                U = E0;
                return;
              }
              break;
          }
        }
        function v0(f, h, _, k) {
          switch (f) {
            case 1:
              if (No.test(h)) break;
              ae(f, h, _, k);
              return;
            case 4:
              Ae._appendChild(Ae.createComment(h));
              return;
            case 5:
              ae(f, h, _, k);
              return;
            case -1:
              Tr();
              return;
            case 2:
              if (h === "html") {
                ae(f, h, _, k);
                return;
              }
              break;
          }
          (U = ae), U(f, h, _, k);
        }
        function E0(f, h, _, k) {
          switch (f) {
            case 1:
              (h = h.replace(Il, "")), h.length > 0 && ae(f, h, _, k);
              return;
            case 4:
              Ae._appendChild(Ae.createComment(h));
              return;
            case 5:
              ae(f, h, _, k);
              return;
            case -1:
              Tr();
              return;
            case 2:
              switch (h) {
                case "html":
                  ae(f, h, _, k);
                  return;
                case "noframes":
                  Ye(f, h, _, k);
                  return;
              }
              break;
          }
        }
        function kp(f, h, _, k) {
          function P(ze) {
            for (var lt = 0, Bt = ze.length; lt < Bt; lt++)
              switch (ze[lt][0]) {
                case "color":
                case "face":
                case "size":
                  return !0;
              }
            return !1;
          }
          var K;
          switch (f) {
            case 1:
              Qe && g_.test(h) && (Qe = !1),
                qn && (h = h.replace(Mo, "\uFFFD")),
                dn(h);
              return;
            case 4:
              un(h);
              return;
            case 5:
              return;
            case 2:
              switch (h) {
                case "font":
                  if (!P(_)) break;
                case "b":
                case "big":
                case "blockquote":
                case "body":
                case "br":
                case "center":
                case "code":
                case "dd":
                case "div":
                case "dl":
                case "dt":
                case "em":
                case "embed":
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                case "head":
                case "hr":
                case "i":
                case "img":
                case "li":
                case "listing":
                case "menu":
                case "meta":
                case "nobr":
                case "ol":
                case "p":
                case "pre":
                case "ruby":
                case "s":
                case "small":
                case "span":
                case "strong":
                case "strike":
                case "sub":
                case "sup":
                case "table":
                case "tt":
                case "u":
                case "ul":
                case "var":
                  if (wr) break;
                  do N.pop(), (K = N.top);
                  while (K.namespaceURI !== s.HTML && !dp(K) && !fp(K));
                  Ze(f, h, _, k);
                  return;
              }
              (K = N.elements.length === 1 && wr ? B : N.top),
                K.namespaceURI === s.MATHML
                  ? pp(_)
                  : K.namespaceURI === s.SVG && ((h = v_(h)), hp(_)),
                Nl(_),
                Ol(h, _, K.namespaceURI),
                k && (h === "script" && (K.namespaceURI, s.SVG), N.pop());
              return;
            case 3:
              if (
                ((K = N.top),
                h === "script" &&
                  K.namespaceURI === s.SVG &&
                  K.localName === "script")
              )
                N.pop();
              else
                for (var ce = N.elements.length - 1, Te = N.elements[ce]; ; ) {
                  if (Te.localName.toLowerCase() === h) {
                    N.popElement(Te);
                    break;
                  }
                  if (((Te = N.elements[--ce]), Te.namespaceURI === s.HTML)) {
                    U(f, h, _, k);
                    break;
                  }
                }
              return;
          }
        }
        return (
          (Po.testTokenizer = function (f, h, _, k) {
            var P = [];
            switch (h) {
              case "PCDATA state":
                A = De;
                break;
              case "RCDATA state":
                A = Kn;
                break;
              case "RAWTEXT state":
                A = is;
                break;
              case "PLAINTEXT state":
                A = Ll;
                break;
            }
            if (
              (_ && (Ro = _),
              (Ze = function (ce, Te, ze, lt) {
                switch ((ri(), ce)) {
                  case 1:
                    P.length > 0 && P[P.length - 1][0] === "Character"
                      ? (P[P.length - 1][1] += Te)
                      : P.push(["Character", Te]);
                    break;
                  case 4:
                    P.push(["Comment", Te]);
                    break;
                  case 5:
                    P.push([
                      "DOCTYPE",
                      Te,
                      ze === void 0 ? null : ze,
                      lt === void 0 ? null : lt,
                      !Ml,
                    ]);
                    break;
                  case 2:
                    for (
                      var Bt = Object.create(null), Zt = 0;
                      Zt < ze.length;
                      Zt++
                    ) {
                      var Nr = ze[Zt];
                      Nr.length === 1 ? (Bt[Nr[0]] = "") : (Bt[Nr[0]] = Nr[1]);
                    }
                    var Jn = ["StartTag", Te, Bt];
                    lt && Jn.push(!0), P.push(Jn);
                    break;
                  case 3:
                    P.push(["EndTag", Te]);
                    break;
                  case -1:
                    break;
                }
              }),
              !k)
            )
              this.parse(f, !0);
            else {
              for (var K = 0; K < f.length; K++) this.parse(f[K]);
              this.parse("", !0);
            }
            return P;
          }),
          Po
        );
      }
    },
  }),
  ll = oe({
    "external/npm/node_modules/domino/lib/DOMImplementation.js"(e, t) {
      "use strict";
      t.exports = a;
      var n = _h(),
        r = wh(),
        i = Dh(),
        s = nt(),
        o = mh();
      function a(l) {
        this.contextObject = l;
      }
      var c = {
        xml: { "": !0, "1.0": !0, "2.0": !0 },
        core: { "": !0, "2.0": !0 },
        html: { "": !0, "1.0": !0, "2.0": !0 },
        xhtml: { "": !0, "1.0": !0, "2.0": !0 },
      };
      a.prototype = {
        hasFeature: function (u, d) {
          var g = c[(u || "").toLowerCase()];
          return (g && g[d || ""]) || !1;
        },
        createDocumentType: function (u, d, g) {
          return (
            o.isValidQName(u) || s.InvalidCharacterError(),
            new r(this.contextObject, u, d, g)
          );
        },
        createDocument: function (u, d, g) {
          var E = new n(!1, null),
            S;
          return (
            d ? (S = E.createElementNS(u, d)) : (S = null),
            g && E.appendChild(g),
            S && E.appendChild(S),
            u === s.NAMESPACE.HTML
              ? (E._contentType = "application/xhtml+xml")
              : u === s.NAMESPACE.SVG
                ? (E._contentType = "image/svg+xml")
                : (E._contentType = "application/xml"),
            E
          );
        },
        createHTMLDocument: function (u) {
          var d = new n(!0, null);
          d.appendChild(new r(d, "html"));
          var g = d.createElement("html");
          d.appendChild(g);
          var E = d.createElement("head");
          if ((g.appendChild(E), u !== void 0)) {
            var S = d.createElement("title");
            E.appendChild(S), S.appendChild(d.createTextNode(u));
          }
          return g.appendChild(d.createElement("body")), (d.modclock = 1), d;
        },
        mozSetOutputMutationHandler: function (l, u) {
          l.mutationHandler = u;
        },
        mozGetInputMutationHandler: function (l) {
          s.nyi();
        },
        mozHTMLParser: i,
      };
    },
  }),
  tM = oe({
    "external/npm/node_modules/domino/lib/Location.js"(e, t) {
      "use strict";
      var n = vh(),
        r = yb();
      t.exports = i;
      function i(s, o) {
        (this._window = s), (this._href = o);
      }
      i.prototype = Object.create(r.prototype, {
        constructor: { value: i },
        href: {
          get: function () {
            return this._href;
          },
          set: function (s) {
            this.assign(s);
          },
        },
        assign: {
          value: function (s) {
            var o = new n(this._href),
              a = o.resolve(s);
            this._href = a;
          },
        },
        replace: {
          value: function (s) {
            this.assign(s);
          },
        },
        reload: {
          value: function () {
            this.assign(this.href);
          },
        },
        toString: {
          value: function () {
            return this.href;
          },
        },
      });
    },
  }),
  nM = oe({
    "external/npm/node_modules/domino/lib/NavigatorID.js"(e, t) {
      "use strict";
      var n = Object.create(null, {
        appCodeName: { value: "Mozilla" },
        appName: { value: "Netscape" },
        appVersion: { value: "4.0" },
        platform: { value: "" },
        product: { value: "Gecko" },
        productSub: { value: "20100101" },
        userAgent: { value: "" },
        vendor: { value: "" },
        vendorSub: { value: "" },
        taintEnabled: {
          value: function () {
            return !1;
          },
        },
      });
      t.exports = n;
    },
  }),
  rM = oe({
    "external/npm/node_modules/domino/lib/WindowTimers.js"(e, t) {
      "use strict";
      var n = { setTimeout, clearTimeout, setInterval, clearInterval };
      t.exports = n;
    },
  }),
  bb = oe({
    "external/npm/node_modules/domino/lib/impl.js"(e, t) {
      "use strict";
      var n = nt();
      (e = t.exports =
        {
          CSSStyleDeclaration: Eh(),
          CharacterData: al(),
          Comment: fb(),
          DOMException: fh(),
          DOMImplementation: ll(),
          DOMTokenList: ab(),
          Document: _h(),
          DocumentFragment: hb(),
          DocumentType: wh(),
          Element: ao(),
          HTMLParser: Dh(),
          NamedNodeMap: lb(),
          Node: gt(),
          NodeList: Bi(),
          NodeFilter: cl(),
          ProcessingInstruction: pb(),
          Text: db(),
          Window: _b(),
        }),
        n.merge(e, gb()),
        n.merge(e, bh().elements),
        n.merge(e, Eb().elements);
    },
  }),
  _b = oe({
    "external/npm/node_modules/domino/lib/Window.js"(e, t) {
      "use strict";
      var n = ll(),
        r = rb(),
        i = tM(),
        s = nt();
      t.exports = o;
      function o(a) {
        (this.document = a || new n(null).createHTMLDocument("")),
          (this.document._scripting_enabled = !0),
          (this.document.defaultView = this),
          (this.location = new i(
            this,
            this.document._address || "about:blank",
          ));
      }
      (o.prototype = Object.create(r.prototype, {
        console: { value: console },
        history: { value: { back: s.nyi, forward: s.nyi, go: s.nyi } },
        navigator: { value: nM() },
        window: {
          get: function () {
            return this;
          },
        },
        self: {
          get: function () {
            return this;
          },
        },
        frames: {
          get: function () {
            return this;
          },
        },
        parent: {
          get: function () {
            return this;
          },
        },
        top: {
          get: function () {
            return this;
          },
        },
        length: { value: 0 },
        frameElement: { value: null },
        opener: { value: null },
        onload: {
          get: function () {
            return this._getEventHandler("load");
          },
          set: function (a) {
            this._setEventHandler("load", a);
          },
        },
        getComputedStyle: {
          value: function (c) {
            return c.style;
          },
        },
      })),
        s.expose(rM(), o),
        s.expose(bb(), o);
    },
  }),
  iM = oe({
    "external/npm/node_modules/domino/lib/index.js"(e) {
      var t = ll(),
        n = Dh(),
        r = _b(),
        i = bb();
      (e.createDOMImplementation = function () {
        return new t(null);
      }),
        (e.createDocument = function (s, o) {
          if (s || o) {
            var a = new n();
            return a.parse(s || "", !0), a.document();
          }
          return new t(null).createHTMLDocument("");
        }),
        (e.createIncrementalHTMLParser = function () {
          var s = new n();
          return {
            write: function (o) {
              o.length > 0 &&
                s.parse(o, !1, function () {
                  return !0;
                });
            },
            end: function (o) {
              s.parse(o || "", !0, function () {
                return !0;
              });
            },
            process: function (o) {
              return s.parse("", !1, o);
            },
            document: function () {
              return s.document();
            },
          };
        }),
        (e.createWindow = function (s, o) {
          var a = e.createDocument(s);
          return o !== void 0 && (a._address = o), new i.Window(a);
        }),
        (e.impl = i);
    },
  }),
  ol = iM();
function sM() {
  Object.assign(globalThis, ol.impl),
    (globalThis.KeyboardEvent = ol.impl.Event);
}
function wb(e, t = "/") {
  return ol.createWindow(e, t).document;
}
function oM(e) {
  return e.serialize();
}
var dh = class e extends Ys {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !1);
    }
    static makeCurrent() {
      sM(), Pc(new e());
    }
    createHtmlDocument() {
      return wb(
        "<html><head><title>fakeTitle</title></head><body></body></html>",
      );
    }
    getDefaultDocument() {
      return e.defaultDoc || (e.defaultDoc = ol.createDocument()), e.defaultDoc;
    }
    isElementNode(t) {
      return t ? t.nodeType === e.defaultDoc.ELEMENT_NODE : !1;
    }
    isShadowRoot(t) {
      return t.shadowRoot == t;
    }
    getGlobalEventTarget(t, n) {
      return n === "window"
        ? t.defaultView
        : n === "document"
          ? t
          : n === "body"
            ? t.body
            : null;
    }
    getBaseHref(t) {
      return (
        t.documentElement.querySelector("base")?.getAttribute("href") || ""
      );
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n);
      let i = (t.ownerDocument || t).defaultView;
      i && i.dispatchEvent(n);
    }
    getUserAgent() {
      return "Fake user agent";
    }
    getCookie(t) {
      throw new Error("getCookie has not been implemented");
    }
  },
  Db = (() => {
    class e {
      constructor(n) {
        this._doc = n;
      }
      renderToString() {
        return oM(this._doc);
      }
      getDocument() {
        return this._doc;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(qe));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  aM = (() => {
    class e {
      ɵloadImpl() {
        return er(this, null, function* () {
          if (!this.xhrImpl) {
            let { default: n } = yield import("./chunk-VCVCHJZV.mjs");
            this.xhrImpl = n;
          }
        });
      }
      build() {
        let n = this.xhrImpl;
        if (!n)
          throw new Error(
            "Unexpected state in ServerXhr: XHR implementation is not loaded.",
          );
        return new n.XMLHttpRequest();
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })();
function cM(e, t) {
  let n = z(Gs),
    { href: r, protocol: i, hostname: s, port: o } = n;
  if (!i.startsWith("http")) return t(e);
  let a = `${i}//${s}`;
  o && (a += `:${o}`);
  let c = n.getBaseHrefFromDOM() || r,
    l = new URL(c, a),
    u = new URL(e.url, l).toString();
  return t(e.clone({ url: u }));
}
var lM = [
    { provide: Pi, useClass: aM },
    { provide: Nf, useValue: cM, multi: !0 },
  ],
  ul = new ie("Server.INITIAL_CONFIG"),
  Tb = new ie("Server.RENDER_MODULE_HOOK"),
  XE = "resolve:";
function JE(e) {
  let {
    hostname: t,
    protocol: n,
    port: r,
    pathname: i,
    search: s,
    hash: o,
  } = new URL(e, XE + "//");
  return {
    hostname: t,
    protocol: n === XE ? "" : n,
    port: r,
    pathname: i,
    search: s,
    hash: o,
  };
}
var uM = (() => {
    class e {
      constructor(n, r) {
        (this._doc = n),
          (this.href = "/"),
          (this.hostname = "/"),
          (this.protocol = "/"),
          (this.port = "/"),
          (this.pathname = "/"),
          (this.search = ""),
          (this.hash = ""),
          (this._hashUpdate = new ut());
        let i = r;
        if (i && i.url) {
          let s = JE(i.url);
          (this.protocol = s.protocol),
            (this.hostname = s.hostname),
            (this.port = s.port),
            (this.pathname = s.pathname),
            (this.search = s.search),
            (this.hash = s.hash),
            (this.href = n.location.href);
        }
      }
      getBaseHrefFromDOM() {
        return vn().getBaseHref(this._doc);
      }
      onPopState(n) {
        return () => {};
      }
      onHashChange(n) {
        let r = this._hashUpdate.subscribe(n);
        return () => r.unsubscribe();
      }
      get url() {
        return `${this.pathname}${this.search}${this.hash}`;
      }
      setHash(n, r) {
        if (this.hash === n) return;
        this.hash = n;
        let i = this.url;
        queueMicrotask(() =>
          this._hashUpdate.next({
            type: "hashchange",
            state: null,
            oldUrl: r,
            newUrl: i,
          }),
        );
      }
      replaceState(n, r, i) {
        let s = this.url,
          o = JE(i);
        (this.pathname = o.pathname),
          (this.search = o.search),
          this.setHash(o.hash, s);
      }
      pushState(n, r, i) {
        this.replaceState(n, r, i);
      }
      forward() {
        throw new Error("Not implemented");
      }
      back() {
        throw new Error("Not implemented");
      }
      getState() {}
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(qe), le(ul, 8));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  dM = (() => {
    class e extends zr {
      constructor(n) {
        super(n), (this.doc = n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, r, i) {
        return vn().onAndCancel(n, r, i);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(qe));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  fM = [{ provide: Tb, useFactory: hM, deps: [qe, Vr, Ln], multi: !0 }];
function Sb(e, t, n) {
  let r = e.createElement("script");
  return (r.textContent = t), n && r.setAttribute("nonce", n), r;
}
function hM(e, t, n) {
  return () => {
    let r = n.toJson();
    if (n.isEmpty) return;
    let i = Sb(e, r, null);
    (i.id = t + "-state"),
      i.setAttribute("type", "application/json"),
      e.body.appendChild(i);
  };
}
var pM = [
  { provide: qe, useFactory: vM, deps: [St] },
  { provide: Ot, useValue: Sf },
  { provide: js, useFactory: mM, multi: !0 },
  { provide: Gs, useClass: uM, deps: [qe, [uc, ul]] },
  { provide: Db, deps: [qe] },
  { provide: Rc, useValue: !0 },
];
function mM() {
  return () => {
    dh.makeCurrent();
  };
}
var gM = [{ provide: Fi, multi: !0, useClass: dM }],
  yM = [
    fM,
    gM,
    lM,
    { provide: hf, useValue: null },
    { provide: Ac, useValue: null },
    { provide: Cf, useClass: zs },
  ];
function vM(e) {
  let t = e.get(ul, null),
    n;
  return (
    t && t.document
      ? (n = typeof t.document == "string" ? wb(t.document, t.url) : t.document)
      : (n = vn().createHtmlDocument()),
    vc(n),
    n
  );
}
var EM = xc(bf, "server", pM);
function g2() {
  return kn([ZE(), ...yM]);
}
var bM = "\u{1F170}\uFE0F",
  _M = !1;
function wM(e, t) {
  if (!_M) return t();
  let n = `${bM}:${e}`,
    r = `start:${n}`,
    i = `end:${n}`,
    s = () => {
      performance.mark(i),
        performance.measure(n, r, i),
        performance.clearMarks(r),
        performance.clearMarks(i);
    };
  performance.mark(r);
  let o = t();
  return o instanceof Promise ? o.finally(() => s()) : (s(), o);
}
var DM = "ng-event-dispatch-contract";
function Cb(e) {
  let t = e.platformProviders ?? [];
  return EM([
    { provide: ul, useValue: { document: e.document, url: e.url } },
    t,
  ]);
}
function Ib(e) {
  return e.getElementById(DM);
}
function eb(e) {
  Ib(e)?.remove();
}
function TM(e, t) {
  let n = t.injector,
    r = e.getDocument();
  if (!n.get(vi, !1)) {
    eb(r);
    return;
  }
  SM(r);
  let i = Xv(t, r);
  i.regular.size || i.capture.size
    ? IM(n.get(Vr), r, i, n.get(Us, null))
    : eb(r);
}
function SM(e) {
  let t = e.createComment(Gd);
  e.body.firstChild
    ? e.body.insertBefore(t, e.body.firstChild)
    : e.body.append(t);
}
function CM(e) {
  let t = e.injector,
    n = MM(t.get(NM, Mb));
  e.components.forEach((r) => {
    let i = r.injector.get(Vs),
      s = r.location.nativeElement;
    s && i.setAttribute(s, "ng-server-context", n);
  });
}
function IM(e, t, n, r) {
  let { regular: i, capture: s } = n,
    o = Ib(t);
  if (o) {
    let a = `window.__jsaction_bootstrap(document.body,"${e}",${JSON.stringify(Array.from(i))},${JSON.stringify(Array.from(s))});`,
      c = Sb(t, a, r);
    o.after(c);
  }
}
function Nb(e, t) {
  return er(this, null, function* () {
    yield ki(t);
    let n = e.injector.get(Db);
    TM(n, t);
    let i = t.injector.get(Tb, null);
    if (i) {
      let o = [];
      for (let a of i)
        try {
          let c = a();
          c && o.push(c);
        } catch (c) {
          console.warn("Ignoring BEFORE_APP_SERIALIZED Exception: ", c);
        }
      if (o.length)
        for (let a of yield Promise.allSettled(o))
          a.status === "rejected" &&
            console.warn(
              "Ignoring BEFORE_APP_SERIALIZED Exception: ",
              a.reason,
            );
    }
    CM(t);
    let s = n.renderToString();
    return (
      yield new Promise((o) => {
        setTimeout(() => {
          e.destroy(), o();
        }, 0);
      }),
      s
    );
  });
}
var Mb = "other",
  NM = new ie("SERVER_CONTEXT");
function MM(e) {
  let t = e.replace(/[^a-zA-Z0-9\-]/g, "");
  return t.length > 0 ? t : Mb;
}
function y2(e, t) {
  return er(this, null, function* () {
    let { document: n, url: r, extraProviders: i } = t,
      s = Cb({ document: n, url: r, platformProviders: i }),
      a = (yield s.bootstrapModule(e)).injector.get(Wt);
    return Nb(s, a);
  });
}
function v2(e, t) {
  return er(this, null, function* () {
    return wM("renderApplication", () =>
      er(this, null, function* () {
        let n = Cb(t),
          r = yield e();
        return Nb(n, r);
      }),
    );
  });
}
var ve = "primary",
  So = Symbol("RouteTitle"),
  Nh = class {
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
function Gi(e) {
  return new Nh(e);
}
function AM(e, t, n) {
  let r = n.path.split("/");
  if (
    r.length > e.length ||
    (n.pathMatch === "full" && (t.hasChildren() || r.length < e.length))
  )
    return null;
  let i = {};
  for (let s = 0; s < r.length; s++) {
    let o = r[s],
      a = e[s];
    if (o[0] === ":") i[o.substring(1)] = a;
    else if (o !== a.path) return null;
  }
  return { consumed: e.slice(0, r.length), posParams: i };
}
function RM(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; ++n) if (!_n(e[n], t[n])) return !1;
  return !0;
}
function _n(e, t) {
  let n = e ? Mh(e) : void 0,
    r = t ? Mh(t) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let i;
  for (let s = 0; s < n.length; s++)
    if (((i = n[s]), !Fb(e[i], t[i]))) return !1;
  return !0;
}
function Mh(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function Fb(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1;
    let n = [...e].sort(),
      r = [...t].sort();
    return n.every((i, s) => r[s] === i);
  } else return e === t;
}
function jb(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function yr(e) {
  return du(e) ? e : $s(e) ? it(Promise.resolve(e)) : pe(e);
}
var xM = { exact: Bb, subset: Hb },
  Ub = { exact: OM, subset: kM, ignored: () => !0 };
function Ab(e, t, n) {
  return (
    xM[n.paths](e.root, t.root, n.matrixParams) &&
    Ub[n.queryParams](e.queryParams, t.queryParams) &&
    !(n.fragment === "exact" && e.fragment !== t.fragment)
  );
}
function OM(e, t) {
  return _n(e, t);
}
function Bb(e, t, n) {
  if (
    !Xr(e.segments, t.segments) ||
    !hl(e.segments, t.segments, n) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let r in t.children)
    if (!e.children[r] || !Bb(e.children[r], t.children[r], n)) return !1;
  return !0;
}
function kM(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((n) => Fb(e[n], t[n]))
  );
}
function Hb(e, t, n) {
  return Vb(e, t, t.segments, n);
}
function Vb(e, t, n, r) {
  if (e.segments.length > n.length) {
    let i = e.segments.slice(0, n.length);
    return !(!Xr(i, n) || t.hasChildren() || !hl(i, n, r));
  } else if (e.segments.length === n.length) {
    if (!Xr(e.segments, n) || !hl(e.segments, n, r)) return !1;
    for (let i in t.children)
      if (!e.children[i] || !Hb(e.children[i], t.children[i], r)) return !1;
    return !0;
  } else {
    let i = n.slice(0, e.segments.length),
      s = n.slice(e.segments.length);
    return !Xr(e.segments, i) || !hl(e.segments, i, r) || !e.children[ve]
      ? !1
      : Vb(e.children[ve], t, s, r);
  }
}
function hl(e, t, n) {
  return t.every((r, i) => Ub[n](e[i].parameters, r.parameters));
}
var jn = class {
    constructor(t = new Fe([], {}), n = {}, r = null) {
      (this.root = t), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Gi(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return FM.serialize(this);
    }
  },
  Fe = class {
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
      return pl(this);
    }
  },
  Zr = class {
    constructor(t, n) {
      (this.path = t), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= Gi(this.parameters)), this._parameterMap;
    }
    toString() {
      return qb(this);
    }
  };
function LM(e, t) {
  return Xr(e, t) && e.every((n, r) => _n(n.parameters, t[r].parameters));
}
function Xr(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path);
}
function PM(e, t) {
  let n = [];
  return (
    Object.entries(e.children).forEach(([r, i]) => {
      r === ve && (n = n.concat(t(i, r)));
    }),
    Object.entries(e.children).forEach(([r, i]) => {
      r !== ve && (n = n.concat(t(i, r)));
    }),
    n
  );
}
var tp = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = ne({
          token: e,
          factory: () => new mo(),
          providedIn: "root",
        });
      }
    }
    return e;
  })(),
  mo = class {
    parse(t) {
      let n = new Rh(t);
      return new jn(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment(),
      );
    }
    serialize(t) {
      let n = `/${co(t.root, !0)}`,
        r = BM(t.queryParams),
        i = typeof t.fragment == "string" ? `#${jM(t.fragment)}` : "";
      return `${n}${r}${i}`;
    }
  },
  FM = new mo();
function pl(e) {
  return e.segments.map((t) => qb(t)).join("/");
}
function co(e, t) {
  if (!e.hasChildren()) return pl(e);
  if (t) {
    let n = e.children[ve] ? co(e.children[ve], !1) : "",
      r = [];
    return (
      Object.entries(e.children).forEach(([i, s]) => {
        i !== ve && r.push(`${i}:${co(s, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = PM(e, (r, i) =>
      i === ve ? [co(e.children[ve], !1)] : [`${i}:${co(r, !1)}`],
    );
    return Object.keys(e.children).length === 1 && e.children[ve] != null
      ? `${pl(e)}/${n[0]}`
      : `${pl(e)}/(${n.join("//")})`;
  }
}
function $b(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function dl(e) {
  return $b(e).replace(/%3B/gi, ";");
}
function jM(e) {
  return encodeURI(e);
}
function Ah(e) {
  return $b(e)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function ml(e) {
  return decodeURIComponent(e);
}
function Rb(e) {
  return ml(e.replace(/\+/g, "%20"));
}
function qb(e) {
  return `${Ah(e.path)}${UM(e.parameters)}`;
}
function UM(e) {
  return Object.entries(e)
    .map(([t, n]) => `;${Ah(t)}=${Ah(n)}`)
    .join("");
}
function BM(e) {
  let t = Object.entries(e)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((i) => `${dl(n)}=${dl(i)}`).join("&")
        : `${dl(n)}=${dl(r)}`,
    )
    .filter((n) => n);
  return t.length ? `?${t.join("&")}` : "";
}
var HM = /^[^\/()?;#]+/;
function Th(e) {
  let t = e.match(HM);
  return t ? t[0] : "";
}
var VM = /^[^\/()?;=#]+/;
function $M(e) {
  let t = e.match(VM);
  return t ? t[0] : "";
}
var qM = /^[^=?&#]+/;
function zM(e) {
  let t = e.match(qM);
  return t ? t[0] : "";
}
var GM = /^[^&#]+/;
function WM(e) {
  let t = e.match(GM);
  return t ? t[0] : "";
}
var Rh = class {
  constructor(t) {
    (this.url = t), (this.remaining = t);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new Fe([], {})
        : new Fe([], this.parseChildren())
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
      (t.length > 0 || Object.keys(n).length > 0) && (r[ve] = new Fe(t, n)),
      r
    );
  }
  parseSegment() {
    let t = Th(this.remaining);
    if (t === "" && this.peekStartsWith(";")) throw new G(4009, !1);
    return this.capture(t), new Zr(ml(t), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(";"); ) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let n = $M(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let i = Th(this.remaining);
      i && ((r = i), this.capture(r));
    }
    t[ml(n)] = ml(r);
  }
  parseQueryParam(t) {
    let n = zM(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = WM(this.remaining);
      o && ((r = o), this.capture(r));
    }
    let i = Rb(n),
      s = Rb(r);
    if (t.hasOwnProperty(i)) {
      let o = t[i];
      Array.isArray(o) || ((o = [o]), (t[i] = o)), o.push(s);
    } else t[i] = s;
  }
  parseParens(t) {
    let n = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let r = Th(this.remaining),
        i = this.remaining[r.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new G(4010, !1);
      let s;
      r.indexOf(":") > -1
        ? ((s = r.slice(0, r.indexOf(":"))), this.capture(s), this.capture(":"))
        : t && (s = ve);
      let o = this.parseChildren();
      (n[s] = Object.keys(o).length === 1 ? o[ve] : new Fe([], o)),
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
    if (!this.consumeOptional(t)) throw new G(4011, !1);
  }
};
function zb(e) {
  return e.segments.length > 0 ? new Fe([], { [ve]: e }) : e;
}
function Gb(e) {
  let t = {};
  for (let [r, i] of Object.entries(e.children)) {
    let s = Gb(i);
    if (r === ve && s.segments.length === 0 && s.hasChildren())
      for (let [o, a] of Object.entries(s.children)) t[o] = a;
    else (s.segments.length > 0 || s.hasChildren()) && (t[r] = s);
  }
  let n = new Fe(e.segments, t);
  return KM(n);
}
function KM(e) {
  if (e.numberOfChildren === 1 && e.children[ve]) {
    let t = e.children[ve];
    return new Fe(e.segments.concat(t.segments), t.children);
  }
  return e;
}
function go(e) {
  return e instanceof jn;
}
function QM(e, t, n = null, r = null) {
  let i = Wb(e);
  return Kb(i, t, n, r);
}
function Wb(e) {
  let t;
  function n(s) {
    let o = {};
    for (let c of s.children) {
      let l = n(c);
      o[c.outlet] = l;
    }
    let a = new Fe(s.url, o);
    return s === e && (t = a), a;
  }
  let r = n(e.root),
    i = zb(r);
  return t ?? i;
}
function Kb(e, t, n, r) {
  let i = e;
  for (; i.parent; ) i = i.parent;
  if (t.length === 0) return Sh(i, i, i, n, r);
  let s = YM(t);
  if (s.toRoot()) return Sh(i, i, new Fe([], {}), n, r);
  let o = ZM(s, i, e),
    a = o.processChildren
      ? fo(o.segmentGroup, o.index, s.commands)
      : Yb(o.segmentGroup, o.index, s.commands);
  return Sh(i, o.segmentGroup, a, n, r);
}
function gl(e) {
  return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function yo(e) {
  return typeof e == "object" && e != null && e.outlets;
}
function Sh(e, t, n, r, i) {
  let s = {};
  r &&
    Object.entries(r).forEach(([c, l]) => {
      s[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let o;
  e === t ? (o = n) : (o = Qb(e, t, n));
  let a = zb(Gb(o));
  return new jn(a, s, i);
}
function Qb(e, t, n) {
  let r = {};
  return (
    Object.entries(e.children).forEach(([i, s]) => {
      s === t ? (r[i] = n) : (r[i] = Qb(s, t, n));
    }),
    new Fe(e.segments, r)
  );
}
var yl = class {
  constructor(t, n, r) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      t && r.length > 0 && gl(r[0]))
    )
      throw new G(4003, !1);
    let i = r.find(yo);
    if (i && i !== jb(r)) throw new G(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function YM(e) {
  if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
    return new yl(!0, 0, e);
  let t = 0,
    n = !1,
    r = e.reduce((i, s, o) => {
      if (typeof s == "object" && s != null) {
        if (s.outlets) {
          let a = {};
          return (
            Object.entries(s.outlets).forEach(([c, l]) => {
              a[c] = typeof l == "string" ? l.split("/") : l;
            }),
            [...i, { outlets: a }]
          );
        }
        if (s.segmentPath) return [...i, s.segmentPath];
      }
      return typeof s != "string"
        ? [...i, s]
        : o === 0
          ? (s.split("/").forEach((a, c) => {
              (c == 0 && a === ".") ||
                (c == 0 && a === ""
                  ? (n = !0)
                  : a === ".."
                    ? t++
                    : a != "" && i.push(a));
            }),
            i)
          : [...i, s];
    }, []);
  return new yl(n, t, r);
}
var $i = class {
  constructor(t, n, r) {
    (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
  }
};
function ZM(e, t, n) {
  if (e.isAbsolute) return new $i(t, !0, 0);
  if (!n) return new $i(t, !1, NaN);
  if (n.parent === null) return new $i(n, !0, 0);
  let r = gl(e.commands[0]) ? 0 : 1,
    i = n.segments.length - 1 + r;
  return XM(n, i, e.numberOfDoubleDots);
}
function XM(e, t, n) {
  let r = e,
    i = t,
    s = n;
  for (; s > i; ) {
    if (((s -= i), (r = r.parent), !r)) throw new G(4005, !1);
    i = r.segments.length;
  }
  return new $i(r, !1, i - s);
}
function JM(e) {
  return yo(e[0]) ? e[0].outlets : { [ve]: e };
}
function Yb(e, t, n) {
  if (((e ??= new Fe([], {})), e.segments.length === 0 && e.hasChildren()))
    return fo(e, t, n);
  let r = eA(e, t, n),
    i = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let s = new Fe(e.segments.slice(0, r.pathIndex), {});
    return (
      (s.children[ve] = new Fe(e.segments.slice(r.pathIndex), e.children)),
      fo(s, 0, i)
    );
  } else
    return r.match && i.length === 0
      ? new Fe(e.segments, {})
      : r.match && !e.hasChildren()
        ? xh(e, t, n)
        : r.match
          ? fo(e, 0, i)
          : xh(e, t, n);
}
function fo(e, t, n) {
  if (n.length === 0) return new Fe(e.segments, {});
  {
    let r = JM(n),
      i = {};
    if (
      Object.keys(r).some((s) => s !== ve) &&
      e.children[ve] &&
      e.numberOfChildren === 1 &&
      e.children[ve].segments.length === 0
    ) {
      let s = fo(e.children[ve], t, n);
      return new Fe(e.segments, s.children);
    }
    return (
      Object.entries(r).forEach(([s, o]) => {
        typeof o == "string" && (o = [o]),
          o !== null && (i[s] = Yb(e.children[s], t, o));
      }),
      Object.entries(e.children).forEach(([s, o]) => {
        r[s] === void 0 && (i[s] = o);
      }),
      new Fe(e.segments, i)
    );
  }
}
function eA(e, t, n) {
  let r = 0,
    i = t,
    s = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < e.segments.length; ) {
    if (r >= n.length) return s;
    let o = e.segments[i],
      a = n[r];
    if (yo(a)) break;
    let c = `${a}`,
      l = r < n.length - 1 ? n[r + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!Ob(c, l, o)) return s;
      r += 2;
    } else {
      if (!Ob(c, {}, o)) return s;
      r++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: r };
}
function xh(e, t, n) {
  let r = e.segments.slice(0, t),
    i = 0;
  for (; i < n.length; ) {
    let s = n[i];
    if (yo(s)) {
      let c = tA(s.outlets);
      return new Fe(r, c);
    }
    if (i === 0 && gl(n[0])) {
      let c = e.segments[t];
      r.push(new Zr(c.path, xb(n[0]))), i++;
      continue;
    }
    let o = yo(s) ? s.outlets[ve] : `${s}`,
      a = i < n.length - 1 ? n[i + 1] : null;
    o && a && gl(a)
      ? (r.push(new Zr(o, xb(a))), (i += 2))
      : (r.push(new Zr(o, {})), i++);
  }
  return new Fe(r, {});
}
function tA(e) {
  let t = {};
  return (
    Object.entries(e).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (t[n] = xh(new Fe([], {}), 0, r));
    }),
    t
  );
}
function xb(e) {
  let t = {};
  return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
}
function Ob(e, t, n) {
  return e == n.path && _n(t, n.parameters);
}
var ho = "imperative",
  pt = (function (e) {
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
  })(pt || {}),
  Qt = class {
    constructor(t, n) {
      (this.id = t), (this.url = n);
    }
  },
  vo = class extends Qt {
    constructor(t, n, r = "imperative", i = null) {
      super(t, n),
        (this.type = pt.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Jr = class extends Qt {
    constructor(t, n, r) {
      super(t, n), (this.urlAfterRedirects = r), (this.type = pt.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Ft = (function (e) {
    return (
      (e[(e.Redirect = 0)] = "Redirect"),
      (e[(e.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (e[(e.GuardRejected = 3)] = "GuardRejected"),
      e
    );
  })(Ft || {}),
  Oh = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      e
    );
  })(Oh || {}),
  Fn = class extends Qt {
    constructor(t, n, r, i) {
      super(t, n),
        (this.reason = r),
        (this.code = i),
        (this.type = pt.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  ei = class extends Qt {
    constructor(t, n, r, i) {
      super(t, n),
        (this.reason = r),
        (this.code = i),
        (this.type = pt.NavigationSkipped);
    }
  },
  Eo = class extends Qt {
    constructor(t, n, r, i) {
      super(t, n),
        (this.error = r),
        (this.target = i),
        (this.type = pt.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  vl = class extends Qt {
    constructor(t, n, r, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = pt.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  kh = class extends Qt {
    constructor(t, n, r, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = pt.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Lh = class extends Qt {
    constructor(t, n, r, i, s) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.shouldActivate = s),
        (this.type = pt.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Ph = class extends Qt {
    constructor(t, n, r, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = pt.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Fh = class extends Qt {
    constructor(t, n, r, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = i),
        (this.type = pt.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  jh = class {
    constructor(t) {
      (this.route = t), (this.type = pt.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Uh = class {
    constructor(t) {
      (this.route = t), (this.type = pt.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Bh = class {
    constructor(t) {
      (this.snapshot = t), (this.type = pt.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Hh = class {
    constructor(t) {
      (this.snapshot = t), (this.type = pt.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  Vh = class {
    constructor(t) {
      (this.snapshot = t), (this.type = pt.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  },
  $h = class {
    constructor(t) {
      (this.snapshot = t), (this.type = pt.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
    }
  };
var bo = class {},
  Wi = class {
    constructor(t, n) {
      (this.url = t), (this.navigationBehaviorOptions = n);
    }
  };
function nA(e, t) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = df(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  );
}
function ln(e) {
  return e.outlet || ve;
}
function rA(e, t) {
  let n = e.filter((r) => ln(r) === t);
  return n.push(...e.filter((r) => ln(r) !== t)), n;
}
function Co(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let t = e.parent; t; t = t.parent) {
    let n = t.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var qh = class {
    get injector() {
      return Co(this.route?.snapshot) ?? this.rootInjector;
    }
    set injector(t) {}
    constructor(t) {
      (this.rootInjector = t),
        (this.outlet = null),
        (this.route = null),
        (this.children = new Sl(this.rootInjector)),
        (this.attachRef = null);
    }
  },
  Sl = (() => {
    class e {
      constructor(n) {
        (this.rootInjector = n), (this.contexts = new Map());
      }
      onChildOutletCreated(n, r) {
        let i = this.getOrCreateContext(n);
        (i.outlet = r), this.contexts.set(n, i);
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
          r || ((r = new qh(this.rootInjector)), this.contexts.set(n, r)), r
        );
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(Gt));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  El = class {
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
      let n = zh(t, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(t) {
      let n = zh(t, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(t) {
      let n = Gh(t, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((i) => i.value).filter((i) => i !== t);
    }
    pathFromRoot(t) {
      return Gh(t, this._root).map((n) => n.value);
    }
  };
function zh(e, t) {
  if (e === t.value) return t;
  for (let n of t.children) {
    let r = zh(e, n);
    if (r) return r;
  }
  return null;
}
function Gh(e, t) {
  if (e === t.value) return [t];
  for (let n of t.children) {
    let r = Gh(e, n);
    if (r.length) return r.unshift(t), r;
  }
  return [];
}
var Pt = class {
  constructor(t, n) {
    (this.value = t), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Vi(e) {
  let t = {};
  return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
}
var bl = class extends El {
  constructor(t, n) {
    super(t), (this.snapshot = n), np(this, t);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Zb(e) {
  let t = iA(e),
    n = new dt([new Zr("", {})]),
    r = new dt({}),
    i = new dt({}),
    s = new dt({}),
    o = new dt(""),
    a = new Ki(n, r, s, o, i, ve, e, t.root);
  return (a.snapshot = t.root), new bl(new Pt(a, []), t);
}
function iA(e) {
  let t = {},
    n = {},
    r = {},
    i = "",
    s = new qi([], t, r, i, n, ve, e, null, {});
  return new wl("", new Pt(s, []));
}
var Ki = class {
  constructor(t, n, r, i, s, o, a, c) {
    (this.urlSubject = t),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = i),
      (this.dataSubject = s),
      (this.outlet = o),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(Se((l) => l[So])) ?? pe(void 0)),
      (this.url = t),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = i),
      (this.data = s);
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
      (this._paramMap ??= this.params.pipe(Se((t) => Gi(t)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(Se((t) => Gi(t)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function _l(e, t, n = "emptyOnly") {
  let r,
    { routeConfig: i } = e;
  return (
    t !== null &&
    (n === "always" ||
      i?.path === "" ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (r = {
          params: Y(Y({}, t.params), e.params),
          data: Y(Y({}, t.data), e.data),
          resolve: Y(Y(Y(Y({}, e.data), t.data), i?.data), e._resolvedData),
        })
      : (r = {
          params: Y({}, e.params),
          data: Y({}, e.data),
          resolve: Y(Y({}, e.data), e._resolvedData ?? {}),
        }),
    i && Jb(i) && (r.resolve[So] = i.title),
    r
  );
}
var qi = class {
    get title() {
      return this.data?.[So];
    }
    constructor(t, n, r, i, s, o, a, c, l) {
      (this.url = t),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = i),
        (this.data = s),
        (this.outlet = o),
        (this.component = a),
        (this.routeConfig = c),
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
      return (this._paramMap ??= Gi(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Gi(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let t = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${t}', path:'${n}')`;
    }
  },
  wl = class extends El {
    constructor(t, n) {
      super(n), (this.url = t), np(this, n);
    }
    toString() {
      return Xb(this._root);
    }
  };
function np(e, t) {
  (t.value._routerState = e), t.children.forEach((n) => np(e, n));
}
function Xb(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(Xb).join(", ")} } ` : "";
  return `${e.value}${t}`;
}
function Ch(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      n = e._futureSnapshot;
    (e.snapshot = n),
      _n(t.queryParams, n.queryParams) ||
        e.queryParamsSubject.next(n.queryParams),
      t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
      _n(t.params, n.params) || e.paramsSubject.next(n.params),
      RM(t.url, n.url) || e.urlSubject.next(n.url),
      _n(t.data, n.data) || e.dataSubject.next(n.data);
  } else
    (e.snapshot = e._futureSnapshot),
      e.dataSubject.next(e._futureSnapshot.data);
}
function Wh(e, t) {
  let n = _n(e.params, t.params) && LM(e.url, t.url),
    r = !e.parent != !t.parent;
  return n && !r && (!e.parent || Wh(e.parent, t.parent));
}
function Jb(e) {
  return typeof e.title == "string" || e.title === null;
}
var sA = (() => {
    class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = ve),
          (this.activateEvents = new Et()),
          (this.deactivateEvents = new Et()),
          (this.attachEvents = new Et()),
          (this.detachEvents = new Et()),
          (this.parentContexts = z(Sl)),
          (this.location = z(Nc)),
          (this.changeDetector = z(qs)),
          (this.inputBinder = z(rp, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: r, previousValue: i } = n.name;
          if (r) return;
          this.isTrackedInParentContexts(i) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(i)),
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
        if (!this.activated) throw new G(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new G(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new G(4012, !1);
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
        if (this.isActivated) throw new G(4013, !1);
        this._activatedRoute = n;
        let i = this.location,
          o = n.snapshot.component,
          a = this.parentContexts.getOrCreateContext(this.name).children,
          c = new Kh(n, a, i.injector);
        (this.activated = i.createComponent(o, {
          index: i.length,
          injector: c,
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
        this.ɵdir = Sd({
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
          features: [hc],
        });
      }
    }
    return e;
  })(),
  Kh = class e {
    __ngOutletInjector(t) {
      return new e(this.route, this.childContexts, t);
    }
    constructor(t, n, r) {
      (this.route = t), (this.childContexts = n), (this.parent = r);
    }
    get(t, n) {
      return t === Ki
        ? this.route
        : t === Sl
          ? this.childContexts
          : this.parent.get(t, n);
    }
  },
  rp = new ie("");
function oA(e, t, n) {
  let r = _o(e, t._root, n ? n._root : void 0);
  return new bl(r, t);
}
function _o(e, t, n) {
  if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = t.value;
    let i = aA(e, t, n);
    return new Pt(r, i);
  } else {
    if (e.shouldAttach(t.value)) {
      let s = e.retrieve(t.value);
      if (s !== null) {
        let o = s.route;
        return (
          (o.value._futureSnapshot = t.value),
          (o.children = t.children.map((a) => _o(e, a))),
          o
        );
      }
    }
    let r = cA(t.value),
      i = t.children.map((s) => _o(e, s));
    return new Pt(r, i);
  }
}
function aA(e, t, n) {
  return t.children.map((r) => {
    for (let i of n.children)
      if (e.shouldReuseRoute(r.value, i.value.snapshot)) return _o(e, r, i);
    return _o(e, r);
  });
}
function cA(e) {
  return new Ki(
    new dt(e.url),
    new dt(e.params),
    new dt(e.queryParams),
    new dt(e.fragment),
    new dt(e.data),
    e.outlet,
    e.component,
    e,
  );
}
var wo = class {
    constructor(t, n) {
      (this.redirectTo = t), (this.navigationBehaviorOptions = n);
    }
  },
  e_ = "ngNavigationCancelingError";
function Dl(e, t) {
  let { redirectTo: n, navigationBehaviorOptions: r } = go(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    i = t_(!1, Ft.Redirect);
  return (i.url = n), (i.navigationBehaviorOptions = r), i;
}
function t_(e, t) {
  let n = new Error(`NavigationCancelingError: ${e || ""}`);
  return (n[e_] = !0), (n.cancellationCode = t), n;
}
function lA(e) {
  return n_(e) && go(e.url);
}
function n_(e) {
  return !!e && e[e_];
}
var uA = (e, t, n, r) =>
    Se(
      (i) => (
        new Qh(t, i.targetRouterState, i.currentRouterState, n, r).activate(e),
        i
      ),
    ),
  Qh = class {
    constructor(t, n, r, i, s) {
      (this.routeReuseStrategy = t),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = s);
    }
    activate(t) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(n, r, t),
        Ch(this.futureState.root),
        this.activateChildRoutes(n, r, t);
    }
    deactivateChildRoutes(t, n, r) {
      let i = Vi(n);
      t.children.forEach((s) => {
        let o = s.value.outlet;
        this.deactivateRoutes(s, i[o], r), delete i[o];
      }),
        Object.values(i).forEach((s) => {
          this.deactivateRouteAndItsChildren(s, r);
        });
    }
    deactivateRoutes(t, n, r) {
      let i = t.value,
        s = n ? n.value : null;
      if (i === s)
        if (i.component) {
          let o = r.getContext(i.outlet);
          o && this.deactivateChildRoutes(t, n, o.children);
        } else this.deactivateChildRoutes(t, n, r);
      else s && this.deactivateRouteAndItsChildren(n, r);
    }
    deactivateRouteAndItsChildren(t, n) {
      t.value.component &&
      this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, n)
        : this.deactivateRouteAndOutlet(t, n);
    }
    detachAndStoreRouteSubtree(t, n) {
      let r = n.getContext(t.value.outlet),
        i = r && t.value.component ? r.children : n,
        s = Vi(t);
      for (let o of Object.values(s)) this.deactivateRouteAndItsChildren(o, i);
      if (r && r.outlet) {
        let o = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: o,
          route: t,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(t, n) {
      let r = n.getContext(t.value.outlet),
        i = r && t.value.component ? r.children : n,
        s = Vi(t);
      for (let o of Object.values(s)) this.deactivateRouteAndItsChildren(o, i);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(t, n, r) {
      let i = Vi(n);
      t.children.forEach((s) => {
        this.activateRoutes(s, i[s.value.outlet], r),
          this.forwardEvent(new $h(s.value.snapshot));
      }),
        t.children.length && this.forwardEvent(new Hh(t.value.snapshot));
    }
    activateRoutes(t, n, r) {
      let i = t.value,
        s = n ? n.value : null;
      if ((Ch(i), i === s))
        if (i.component) {
          let o = r.getOrCreateContext(i.outlet);
          this.activateChildRoutes(t, n, o.children);
        } else this.activateChildRoutes(t, n, r);
      else if (i.component) {
        let o = r.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            o.children.onOutletReAttached(a.contexts),
            (o.attachRef = a.componentRef),
            (o.route = a.route.value),
            o.outlet && o.outlet.attach(a.componentRef, a.route.value),
            Ch(a.route.value),
            this.activateChildRoutes(t, null, o.children);
        } else
          (o.attachRef = null),
            (o.route = i),
            o.outlet && o.outlet.activateWith(i, o.injector),
            this.activateChildRoutes(t, null, o.children);
      } else this.activateChildRoutes(t, null, r);
    }
  },
  Tl = class {
    constructor(t) {
      (this.path = t), (this.route = this.path[this.path.length - 1]);
    }
  },
  zi = class {
    constructor(t, n) {
      (this.component = t), (this.route = n);
    }
  };
function dA(e, t, n) {
  let r = e._root,
    i = t ? t._root : null;
  return lo(r, i, n, [r.value]);
}
function fA(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: e, guards: t };
}
function Yi(e, t) {
  let n = Symbol(),
    r = t.get(e, n);
  return r === n ? (typeof e == "function" && !ag(e) ? e : t.get(e)) : r;
}
function lo(
  e,
  t,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let s = Vi(t);
  return (
    e.children.forEach((o) => {
      hA(o, s[o.value.outlet], n, r.concat([o.value]), i),
        delete s[o.value.outlet];
    }),
    Object.entries(s).forEach(([o, a]) => po(a, n.getContext(o), i)),
    i
  );
}
function hA(
  e,
  t,
  n,
  r,
  i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
  let s = e.value,
    o = t ? t.value : null,
    a = n ? n.getContext(e.value.outlet) : null;
  if (o && s.routeConfig === o.routeConfig) {
    let c = pA(o, s, s.routeConfig.runGuardsAndResolvers);
    c
      ? i.canActivateChecks.push(new Tl(r))
      : ((s.data = o.data), (s._resolvedData = o._resolvedData)),
      s.component ? lo(e, t, a ? a.children : null, r, i) : lo(e, t, n, r, i),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new zi(a.outlet.component, o));
  } else
    o && po(t, a, i),
      i.canActivateChecks.push(new Tl(r)),
      s.component
        ? lo(e, null, a ? a.children : null, r, i)
        : lo(e, null, n, r, i);
  return i;
}
function pA(e, t, n) {
  if (typeof n == "function") return n(e, t);
  switch (n) {
    case "pathParamsChange":
      return !Xr(e.url, t.url);
    case "pathParamsOrQueryParamsChange":
      return !Xr(e.url, t.url) || !_n(e.queryParams, t.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Wh(e, t) || !_n(e.queryParams, t.queryParams);
    case "paramsChange":
    default:
      return !Wh(e, t);
  }
}
function po(e, t, n) {
  let r = Vi(e),
    i = e.value;
  Object.entries(r).forEach(([s, o]) => {
    i.component
      ? t
        ? po(o, t.children.getContext(s), n)
        : po(o, null, n)
      : po(o, t, n);
  }),
    i.component
      ? t && t.outlet && t.outlet.isActivated
        ? n.canDeactivateChecks.push(new zi(t.outlet.component, i))
        : n.canDeactivateChecks.push(new zi(null, i))
      : n.canDeactivateChecks.push(new zi(null, i));
}
function Io(e) {
  return typeof e == "function";
}
function mA(e) {
  return typeof e == "boolean";
}
function gA(e) {
  return e && Io(e.canLoad);
}
function yA(e) {
  return e && Io(e.canActivate);
}
function vA(e) {
  return e && Io(e.canActivateChild);
}
function EA(e) {
  return e && Io(e.canDeactivate);
}
function bA(e) {
  return e && Io(e.canMatch);
}
function r_(e) {
  return e instanceof An || e?.name === "EmptyError";
}
var fl = Symbol("INITIAL_VALUE");
function Qi() {
  return Vt((e) =>
    va(e.map((t) => t.pipe(Rn(1), gu(fl)))).pipe(
      Se((t) => {
        for (let n of t)
          if (n !== !0) {
            if (n === fl) return fl;
            if (n === !1 || _A(n)) return n;
          }
        return !0;
      }),
      Ht((t) => t !== fl),
      Rn(1),
    ),
  );
}
function _A(e) {
  return go(e) || e instanceof wo;
}
function wA(e, t) {
  return st((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: i,
      guards: { canActivateChecks: s, canDeactivateChecks: o },
    } = n;
    return o.length === 0 && s.length === 0
      ? pe(Ge(Y({}, n), { guardsResult: !0 }))
      : DA(o, r, i, e).pipe(
          st((a) => (a && mA(a) ? TA(r, s, e, t) : pe(a))),
          Se((a) => Ge(Y({}, n), { guardsResult: a })),
        );
  });
}
function DA(e, t, n, r) {
  return it(e).pipe(
    st((i) => MA(i.component, i.route, n, t, r)),
    Jt((i) => i !== !0, !0),
  );
}
function TA(e, t, n, r) {
  return it(t).pipe(
    xr((i) =>
      hi(
        CA(i.route.parent, r),
        SA(i.route, r),
        NA(e, i.path, n),
        IA(e, i.route, n),
      ),
    ),
    Jt((i) => i !== !0, !0),
  );
}
function SA(e, t) {
  return e !== null && t && t(new Vh(e)), pe(!0);
}
function CA(e, t) {
  return e !== null && t && t(new Bh(e)), pe(!0);
}
function IA(e, t, n) {
  let r = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!r || r.length === 0) return pe(!0);
  let i = r.map((s) =>
    Ea(() => {
      let o = Co(t) ?? n,
        a = Yi(s, o),
        c = yA(a) ? a.canActivate(t, e) : gn(o, () => a(t, e));
      return yr(c).pipe(Jt());
    }),
  );
  return pe(i).pipe(Qi());
}
function NA(e, t, n) {
  let r = t[t.length - 1],
    s = t
      .slice(0, t.length - 1)
      .reverse()
      .map((o) => fA(o))
      .filter((o) => o !== null)
      .map((o) =>
        Ea(() => {
          let a = o.guards.map((c) => {
            let l = Co(o.node) ?? n,
              u = Yi(c, l),
              d = vA(u) ? u.canActivateChild(r, e) : gn(l, () => u(r, e));
            return yr(d).pipe(Jt());
          });
          return pe(a).pipe(Qi());
        }),
      );
  return pe(s).pipe(Qi());
}
function MA(e, t, n, r, i) {
  let s = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!s || s.length === 0) return pe(!0);
  let o = s.map((a) => {
    let c = Co(t) ?? i,
      l = Yi(a, c),
      u = EA(l) ? l.canDeactivate(e, t, n, r) : gn(c, () => l(e, t, n, r));
    return yr(u).pipe(Jt());
  });
  return pe(o).pipe(Qi());
}
function AA(e, t, n, r) {
  let i = t.canLoad;
  if (i === void 0 || i.length === 0) return pe(!0);
  let s = i.map((o) => {
    let a = Yi(o, e),
      c = gA(a) ? a.canLoad(t, n) : gn(e, () => a(t, n));
    return yr(c);
  });
  return pe(s).pipe(Qi(), i_(r));
}
function i_(e) {
  return au(
    ot((t) => {
      if (typeof t != "boolean") throw Dl(e, t);
    }),
    Se((t) => t === !0),
  );
}
function RA(e, t, n, r) {
  let i = t.canMatch;
  if (!i || i.length === 0) return pe(!0);
  let s = i.map((o) => {
    let a = Yi(o, e),
      c = bA(a) ? a.canMatch(t, n) : gn(e, () => a(t, n));
    return yr(c);
  });
  return pe(s).pipe(Qi(), i_(r));
}
var Do = class {
    constructor(t) {
      this.segmentGroup = t || null;
    }
  },
  To = class extends Error {
    constructor(t) {
      super(), (this.urlTree = t);
    }
  };
function Hi(e) {
  return fi(new Do(e));
}
function xA(e) {
  return fi(new G(4e3, !1));
}
function OA(e) {
  return fi(t_(!1, Ft.GuardRejected));
}
var Yh = class {
    constructor(t, n) {
      (this.urlSerializer = t), (this.urlTree = n);
    }
    lineralizeSegments(t, n) {
      let r = [],
        i = n.root;
      for (;;) {
        if (((r = r.concat(i.segments)), i.numberOfChildren === 0))
          return pe(r);
        if (i.numberOfChildren > 1 || !i.children[ve])
          return xA(`${t.redirectTo}`);
        i = i.children[ve];
      }
    }
    applyRedirectCommands(t, n, r, i, s) {
      if (typeof n != "string") {
        let a = n,
          {
            queryParams: c,
            fragment: l,
            routeConfig: u,
            url: d,
            outlet: g,
            params: E,
            data: S,
            title: M,
          } = i,
          H = gn(s, () =>
            a({
              params: E,
              data: S,
              queryParams: c,
              fragment: l,
              routeConfig: u,
              url: d,
              outlet: g,
              title: M,
            }),
          );
        if (H instanceof jn) throw new To(H);
        n = H;
      }
      let o = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        t,
        r,
      );
      if (n[0] === "/") throw new To(o);
      return o;
    }
    applyRedirectCreateUrlTree(t, n, r, i) {
      let s = this.createSegmentGroup(t, n.root, r, i);
      return new jn(
        s,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment,
      );
    }
    createQueryParams(t, n) {
      let r = {};
      return (
        Object.entries(t).forEach(([i, s]) => {
          if (typeof s == "string" && s[0] === ":") {
            let a = s.substring(1);
            r[i] = n[a];
          } else r[i] = s;
        }),
        r
      );
    }
    createSegmentGroup(t, n, r, i) {
      let s = this.createSegments(t, n.segments, r, i),
        o = {};
      return (
        Object.entries(n.children).forEach(([a, c]) => {
          o[a] = this.createSegmentGroup(t, c, r, i);
        }),
        new Fe(s, o)
      );
    }
    createSegments(t, n, r, i) {
      return n.map((s) =>
        s.path[0] === ":"
          ? this.findPosParam(t, s, i)
          : this.findOrReturn(s, r),
      );
    }
    findPosParam(t, n, r) {
      let i = r[n.path.substring(1)];
      if (!i) throw new G(4001, !1);
      return i;
    }
    findOrReturn(t, n) {
      let r = 0;
      for (let i of n) {
        if (i.path === t.path) return n.splice(r), i;
        r++;
      }
      return t;
    }
  },
  Zh = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function kA(e, t, n, r, i) {
  let s = s_(e, t, n);
  return s.matched
    ? ((r = nA(t, r)),
      RA(r, t, n, i).pipe(Se((o) => (o === !0 ? s : Y({}, Zh)))))
    : pe(s);
}
function s_(e, t, n) {
  if (t.path === "**") return LA(n);
  if (t.path === "")
    return t.pathMatch === "full" && (e.hasChildren() || n.length > 0)
      ? Y({}, Zh)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (t.matcher || AM)(n, e, t);
  if (!i) return Y({}, Zh);
  let s = {};
  Object.entries(i.posParams ?? {}).forEach(([a, c]) => {
    s[a] = c.path;
  });
  let o =
    i.consumed.length > 0
      ? Y(Y({}, s), i.consumed[i.consumed.length - 1].parameters)
      : s;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: n.slice(i.consumed.length),
    parameters: o,
    positionalParamSegments: i.posParams ?? {},
  };
}
function LA(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? jb(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function kb(e, t, n, r) {
  return n.length > 0 && jA(e, n, r)
    ? {
        segmentGroup: new Fe(t, FA(r, new Fe(n, e.children))),
        slicedSegments: [],
      }
    : n.length === 0 && UA(e, n, r)
      ? {
          segmentGroup: new Fe(e.segments, PA(e, n, r, e.children)),
          slicedSegments: n,
        }
      : { segmentGroup: new Fe(e.segments, e.children), slicedSegments: n };
}
function PA(e, t, n, r) {
  let i = {};
  for (let s of n)
    if (Cl(e, t, s) && !r[ln(s)]) {
      let o = new Fe([], {});
      i[ln(s)] = o;
    }
  return Y(Y({}, r), i);
}
function FA(e, t) {
  let n = {};
  n[ve] = t;
  for (let r of e)
    if (r.path === "" && ln(r) !== ve) {
      let i = new Fe([], {});
      n[ln(r)] = i;
    }
  return n;
}
function jA(e, t, n) {
  return n.some((r) => Cl(e, t, r) && ln(r) !== ve);
}
function UA(e, t, n) {
  return n.some((r) => Cl(e, t, r));
}
function Cl(e, t, n) {
  return (e.hasChildren() || t.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function BA(e, t, n) {
  return t.length === 0 && !e.children[n];
}
var Xh = class {};
function HA(e, t, n, r, i, s, o = "emptyOnly") {
  return new Jh(e, t, n, r, i, o, s).recognize();
}
var VA = 31,
  Jh = class {
    constructor(t, n, r, i, s, o, a) {
      (this.injector = t),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = i),
        (this.urlTree = s),
        (this.paramsInheritanceStrategy = o),
        (this.urlSerializer = a),
        (this.applyRedirects = new Yh(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(t) {
      return new G(4002, `'${t.segmentGroup}'`);
    }
    recognize() {
      let t = kb(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(t).pipe(
        Se(({ children: n, rootSnapshot: r }) => {
          let i = new Pt(r, n),
            s = new wl("", i),
            o = QM(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (o.queryParams = this.urlTree.queryParams),
            (s.url = this.urlSerializer.serialize(o)),
            { state: s, tree: o }
          );
        }),
      );
    }
    match(t) {
      let n = new qi(
        [],
        Object.freeze({}),
        Object.freeze(Y({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        ve,
        this.rootComponentType,
        null,
        {},
      );
      return this.processSegmentGroup(
        this.injector,
        this.config,
        t,
        ve,
        n,
      ).pipe(
        Se((r) => ({ children: r, rootSnapshot: n })),
        nr((r) => {
          if (r instanceof To)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof Do ? this.noMatchError(r) : r;
        }),
      );
    }
    processSegmentGroup(t, n, r, i, s) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(t, n, r, s)
        : this.processSegment(t, n, r, r.segments, i, !0, s).pipe(
            Se((o) => (o instanceof Pt ? [o] : [])),
          );
    }
    processChildren(t, n, r, i) {
      let s = [];
      for (let o of Object.keys(r.children))
        o === "primary" ? s.unshift(o) : s.push(o);
      return it(s).pipe(
        xr((o) => {
          let a = r.children[o],
            c = rA(n, o);
          return this.processSegmentGroup(t, c, a, o, i);
        }),
        mu((o, a) => (o.push(...a), o)),
        rr(null),
        pu(),
        st((o) => {
          if (o === null) return Hi(r);
          let a = o_(o);
          return $A(a), pe(a);
        }),
      );
    }
    processSegment(t, n, r, i, s, o, a) {
      return it(n).pipe(
        xr((c) =>
          this.processSegmentAgainstRoute(
            c._injector ?? t,
            n,
            c,
            r,
            i,
            s,
            o,
            a,
          ).pipe(
            nr((l) => {
              if (l instanceof Do) return pe(null);
              throw l;
            }),
          ),
        ),
        Jt((c) => !!c),
        nr((c) => {
          if (r_(c)) return BA(r, i, s) ? pe(new Xh()) : Hi(r);
          throw c;
        }),
      );
    }
    processSegmentAgainstRoute(t, n, r, i, s, o, a, c) {
      return ln(r) !== o && (o === ve || !Cl(i, s, r))
        ? Hi(i)
        : r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(t, i, r, s, o, c)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(t, i, n, r, s, o, c)
            : Hi(i);
    }
    expandSegmentAgainstRouteUsingRedirect(t, n, r, i, s, o, a) {
      let {
        matched: c,
        parameters: l,
        consumedSegments: u,
        positionalParamSegments: d,
        remainingSegments: g,
      } = s_(n, i, s);
      if (!c) return Hi(n);
      typeof i.redirectTo == "string" &&
        i.redirectTo[0] === "/" &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > VA && (this.allowRedirects = !1));
      let E = new qi(
          s,
          l,
          Object.freeze(Y({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          Lb(i),
          ln(i),
          i.component ?? i._loadedComponent ?? null,
          i,
          Pb(i),
        ),
        S = _l(E, a, this.paramsInheritanceStrategy);
      (E.params = Object.freeze(S.params)), (E.data = Object.freeze(S.data));
      let M = this.applyRedirects.applyRedirectCommands(
        u,
        i.redirectTo,
        d,
        E,
        t,
      );
      return this.applyRedirects
        .lineralizeSegments(i, M)
        .pipe(st((H) => this.processSegment(t, r, n, H.concat(g), o, !1, a)));
    }
    matchSegmentAgainstRoute(t, n, r, i, s, o) {
      let a = kA(n, r, i, t, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        a.pipe(
          Vt((c) =>
            c.matched
              ? ((t = r._injector ?? t),
                this.getChildConfig(t, r, i).pipe(
                  Vt(({ routes: l }) => {
                    let u = r._loadedInjector ?? t,
                      {
                        parameters: d,
                        consumedSegments: g,
                        remainingSegments: E,
                      } = c,
                      S = new qi(
                        g,
                        d,
                        Object.freeze(Y({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        Lb(r),
                        ln(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        Pb(r),
                      ),
                      M = _l(S, o, this.paramsInheritanceStrategy);
                    (S.params = Object.freeze(M.params)),
                      (S.data = Object.freeze(M.data));
                    let { segmentGroup: H, slicedSegments: L } = kb(n, g, E, l);
                    if (L.length === 0 && H.hasChildren())
                      return this.processChildren(u, l, H, S).pipe(
                        Se((w) => new Pt(S, w)),
                      );
                    if (l.length === 0 && L.length === 0)
                      return pe(new Pt(S, []));
                    let D = ln(r) === s;
                    return this.processSegment(
                      u,
                      l,
                      H,
                      L,
                      D ? ve : s,
                      !0,
                      S,
                    ).pipe(Se((w) => new Pt(S, w instanceof Pt ? [w] : [])));
                  }),
                ))
              : Hi(n),
          ),
        )
      );
    }
    getChildConfig(t, n, r) {
      return n.children
        ? pe({ routes: n.children, injector: t })
        : n.loadChildren
          ? n._loadedRoutes !== void 0
            ? pe({ routes: n._loadedRoutes, injector: n._loadedInjector })
            : AA(t, n, r, this.urlSerializer).pipe(
                st((i) =>
                  i
                    ? this.configLoader.loadChildren(t, n).pipe(
                        ot((s) => {
                          (n._loadedRoutes = s.routes),
                            (n._loadedInjector = s.injector);
                        }),
                      )
                    : OA(n),
                ),
              )
          : pe({ routes: [], injector: t });
    }
  };
function $A(e) {
  e.sort((t, n) =>
    t.value.outlet === ve
      ? -1
      : n.value.outlet === ve
        ? 1
        : t.value.outlet.localeCompare(n.value.outlet),
  );
}
function qA(e) {
  let t = e.value.routeConfig;
  return t && t.path === "";
}
function o_(e) {
  let t = [],
    n = new Set();
  for (let r of e) {
    if (!qA(r)) {
      t.push(r);
      continue;
    }
    let i = t.find((s) => r.value.routeConfig === s.value.routeConfig);
    i !== void 0 ? (i.children.push(...r.children), n.add(i)) : t.push(r);
  }
  for (let r of n) {
    let i = o_(r.children);
    t.push(new Pt(r.value, i));
  }
  return t.filter((r) => !n.has(r));
}
function Lb(e) {
  return e.data || {};
}
function Pb(e) {
  return e.resolve || {};
}
function zA(e, t, n, r, i, s) {
  return st((o) =>
    HA(e, t, n, r, o.extractedUrl, i, s).pipe(
      Se(({ state: a, tree: c }) =>
        Ge(Y({}, o), { targetSnapshot: a, urlAfterRedirects: c }),
      ),
    ),
  );
}
function GA(e, t) {
  return st((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: i },
    } = n;
    if (!i.length) return pe(n);
    let s = new Set(i.map((c) => c.route)),
      o = new Set();
    for (let c of s) if (!o.has(c)) for (let l of a_(c)) o.add(l);
    let a = 0;
    return it(o).pipe(
      xr((c) =>
        s.has(c)
          ? WA(c, r, e, t)
          : ((c.data = _l(c, c.parent, e).resolve), pe(void 0)),
      ),
      ot(() => a++),
      mi(1),
      st((c) => (a === o.size ? pe(n) : Nt)),
    );
  });
}
function a_(e) {
  let t = e.children.map((n) => a_(n)).flat();
  return [e, ...t];
}
function WA(e, t, n, r) {
  let i = e.routeConfig,
    s = e._resolve;
  return (
    i?.title !== void 0 && !Jb(i) && (s[So] = i.title),
    KA(s, e, t, r).pipe(
      Se(
        (o) => (
          (e._resolvedData = o), (e.data = _l(e, e.parent, n).resolve), null
        ),
      ),
    )
  );
}
function KA(e, t, n, r) {
  let i = Mh(e);
  if (i.length === 0) return pe({});
  let s = {};
  return it(i).pipe(
    st((o) =>
      QA(e[o], t, n, r).pipe(
        Jt(),
        ot((a) => {
          if (a instanceof wo) throw Dl(new mo(), a);
          s[o] = a;
        }),
      ),
    ),
    mi(1),
    hu(s),
    nr((o) => (r_(o) ? Nt : fi(o))),
  );
}
function QA(e, t, n, r) {
  let i = Co(t) ?? r,
    s = Yi(e, i),
    o = s.resolve ? s.resolve(t, n) : gn(i, () => s(t, n));
  return yr(o);
}
function Ih(e) {
  return Vt((t) => {
    let n = e(t);
    return n ? it(n).pipe(Se(() => t)) : pe(t);
  });
}
var c_ = (() => {
    class e {
      buildTitle(n) {
        let r,
          i = n.root;
        for (; i !== void 0; )
          (r = this.getResolvedTitleForRoute(i) ?? r),
            (i = i.children.find((s) => s.outlet === ve));
        return r;
      }
      getResolvedTitleForRoute(n) {
        return n.data[So];
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: () => z(YA), providedIn: "root" });
      }
    }
    return e;
  })(),
  YA = (() => {
    class e extends c_ {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let r = this.buildTitle(n);
        r !== void 0 && this.title.setTitle(r);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(le(_E));
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  ip = new ie("", { providedIn: "root", factory: () => ({}) }),
  ZA = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵcmp = vg({
          type: e,
          selectors: [["ng-component"]],
          standalone: !0,
          features: [xv],
          decls: 1,
          vars: 0,
          template: function (r, i) {
            r & 1 && ff(0, "router-outlet");
          },
          dependencies: [sA],
          encapsulation: 2,
        });
      }
    }
    return e;
  })();
function sp(e) {
  let t = e.children && e.children.map(sp),
    n = t ? Ge(Y({}, e), { children: t }) : Y({}, e);
  return (
    !n.component &&
      !n.loadComponent &&
      (t || n.loadChildren) &&
      n.outlet &&
      n.outlet !== ve &&
      (n.component = ZA),
    n
  );
}
var op = new ie(""),
  XA = (() => {
    class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = z(mf));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return pe(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let r = yr(n.loadComponent()).pipe(
            Se(l_),
            ot((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            pi(() => {
              this.componentLoaders.delete(n);
            }),
          ),
          i = new di(r, () => new ut()).pipe(ui());
        return this.componentLoaders.set(n, i), i;
      }
      loadChildren(n, r) {
        if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
        if (r._loadedRoutes)
          return pe({ routes: r._loadedRoutes, injector: r._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(r);
        let s = JA(r, this.compiler, n, this.onLoadEndListener).pipe(
            pi(() => {
              this.childrenLoaders.delete(r);
            }),
          ),
          o = new di(s, () => new ut()).pipe(ui());
        return this.childrenLoaders.set(r, o), o;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function JA(e, t, n, r) {
  return yr(e.loadChildren()).pipe(
    Se(l_),
    st((i) =>
      i instanceof Os || Array.isArray(i) ? pe(i) : it(t.compileModuleAsync(i)),
    ),
    Se((i) => {
      r && r(e);
      let s,
        o,
        a = !1;
      return (
        Array.isArray(i)
          ? ((o = i), (a = !0))
          : ((s = i.create(n).injector),
            (o = s.get(op, [], { optional: !0, self: !0 }).flat())),
        { routes: o.map(sp), injector: s }
      );
    }),
  );
}
function eR(e) {
  return e && typeof e == "object" && "default" in e;
}
function l_(e) {
  return eR(e) ? e.default : e;
}
var ap = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: () => z(tR), providedIn: "root" });
      }
    }
    return e;
  })(),
  tR = (() => {
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
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  nR = new ie("");
var rR = new ie(""),
  iR = (() => {
    class e {
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      constructor() {
        (this.currentNavigation = null),
          (this.currentTransition = null),
          (this.lastSuccessfulNavigation = null),
          (this.events = new ut()),
          (this.transitionAbortSubject = new ut()),
          (this.configLoader = z(XA)),
          (this.environmentInjector = z(Gt)),
          (this.urlSerializer = z(tp)),
          (this.rootContexts = z(Sl)),
          (this.location = z(Ws)),
          (this.inputBindingEnabled = z(rp, { optional: !0 }) !== null),
          (this.titleStrategy = z(c_)),
          (this.options = z(ip, { optional: !0 }) || {}),
          (this.paramsInheritanceStrategy =
            this.options.paramsInheritanceStrategy || "emptyOnly"),
          (this.urlHandlingStrategy = z(ap)),
          (this.createViewTransition = z(nR, { optional: !0 })),
          (this.navigationErrorHandler = z(rR, { optional: !0 })),
          (this.navigationId = 0),
          (this.afterPreactivation = () => pe(void 0)),
          (this.rootComponentType = null);
        let n = (i) => this.events.next(new jh(i)),
          r = (i) => this.events.next(new Uh(i));
        (this.configLoader.onLoadEndListener = r),
          (this.configLoader.onLoadStartListener = n);
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(n) {
        let r = ++this.navigationId;
        this.transitions?.next(
          Ge(Y(Y({}, this.transitions.value), n), { id: r }),
        );
      }
      setupNavigations(n, r, i) {
        return (
          (this.transitions = new dt({
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
            source: ho,
            restoredState: null,
            currentSnapshot: i.snapshot,
            targetSnapshot: null,
            currentRouterState: i,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
          })),
          this.transitions.pipe(
            Ht((s) => s.id !== 0),
            Se((s) =>
              Ge(Y({}, s), {
                extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
              }),
            ),
            Vt((s) => {
              let o = !1,
                a = !1;
              return pe(s).pipe(
                Vt((c) => {
                  if (this.navigationId > s.id)
                    return (
                      this.cancelNavigationTransition(
                        s,
                        "",
                        Ft.SupersededByNewNavigation,
                      ),
                      Nt
                    );
                  (this.currentTransition = s),
                    (this.currentNavigation = {
                      id: c.id,
                      initialUrl: c.rawUrl,
                      extractedUrl: c.extractedUrl,
                      targetBrowserUrl:
                        typeof c.extras.browserUrl == "string"
                          ? this.urlSerializer.parse(c.extras.browserUrl)
                          : c.extras.browserUrl,
                      trigger: c.source,
                      extras: c.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? Ge(Y({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                    });
                  let l =
                      !n.navigated ||
                      this.isUpdatingInternalState() ||
                      this.isUpdatedBrowserUrl(),
                    u = c.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                  if (!l && u !== "reload") {
                    let d = "";
                    return (
                      this.events.next(
                        new ei(
                          c.id,
                          this.urlSerializer.serialize(c.rawUrl),
                          d,
                          Oh.IgnoredSameUrlNavigation,
                        ),
                      ),
                      c.resolve(!1),
                      Nt
                    );
                  }
                  if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                    return pe(c).pipe(
                      Vt((d) => {
                        let g = this.transitions?.getValue();
                        return (
                          this.events.next(
                            new vo(
                              d.id,
                              this.urlSerializer.serialize(d.extractedUrl),
                              d.source,
                              d.restoredState,
                            ),
                          ),
                          g !== this.transitions?.getValue()
                            ? Nt
                            : Promise.resolve(d)
                        );
                      }),
                      zA(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        n.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                      ),
                      ot((d) => {
                        (s.targetSnapshot = d.targetSnapshot),
                          (s.urlAfterRedirects = d.urlAfterRedirects),
                          (this.currentNavigation = Ge(
                            Y({}, this.currentNavigation),
                            { finalUrl: d.urlAfterRedirects },
                          ));
                        let g = new vl(
                          d.id,
                          this.urlSerializer.serialize(d.extractedUrl),
                          this.urlSerializer.serialize(d.urlAfterRedirects),
                          d.targetSnapshot,
                        );
                        this.events.next(g);
                      }),
                    );
                  if (
                    l &&
                    this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)
                  ) {
                    let {
                        id: d,
                        extractedUrl: g,
                        source: E,
                        restoredState: S,
                        extras: M,
                      } = c,
                      H = new vo(d, this.urlSerializer.serialize(g), E, S);
                    this.events.next(H);
                    let L = Zb(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = s =
                        Ge(Y({}, c), {
                          targetSnapshot: L,
                          urlAfterRedirects: g,
                          extras: Ge(Y({}, M), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      (this.currentNavigation.finalUrl = g),
                      pe(s)
                    );
                  } else {
                    let d = "";
                    return (
                      this.events.next(
                        new ei(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          d,
                          Oh.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      c.resolve(!1),
                      Nt
                    );
                  }
                }),
                ot((c) => {
                  let l = new kh(
                    c.id,
                    this.urlSerializer.serialize(c.extractedUrl),
                    this.urlSerializer.serialize(c.urlAfterRedirects),
                    c.targetSnapshot,
                  );
                  this.events.next(l);
                }),
                Se(
                  (c) => (
                    (this.currentTransition = s =
                      Ge(Y({}, c), {
                        guards: dA(
                          c.targetSnapshot,
                          c.currentSnapshot,
                          this.rootContexts,
                        ),
                      })),
                    s
                  ),
                ),
                wA(this.environmentInjector, (c) => this.events.next(c)),
                ot((c) => {
                  if (
                    ((s.guardsResult = c.guardsResult),
                    c.guardsResult && typeof c.guardsResult != "boolean")
                  )
                    throw Dl(this.urlSerializer, c.guardsResult);
                  let l = new Lh(
                    c.id,
                    this.urlSerializer.serialize(c.extractedUrl),
                    this.urlSerializer.serialize(c.urlAfterRedirects),
                    c.targetSnapshot,
                    !!c.guardsResult,
                  );
                  this.events.next(l);
                }),
                Ht((c) =>
                  c.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(c, "", Ft.GuardRejected),
                      !1),
                ),
                Ih((c) => {
                  if (c.guards.canActivateChecks.length)
                    return pe(c).pipe(
                      ot((l) => {
                        let u = new Ph(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot,
                        );
                        this.events.next(u);
                      }),
                      Vt((l) => {
                        let u = !1;
                        return pe(l).pipe(
                          GA(
                            this.paramsInheritanceStrategy,
                            this.environmentInjector,
                          ),
                          ot({
                            next: () => (u = !0),
                            complete: () => {
                              u ||
                                this.cancelNavigationTransition(
                                  l,
                                  "",
                                  Ft.NoDataFromResolver,
                                );
                            },
                          }),
                        );
                      }),
                      ot((l) => {
                        let u = new Fh(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot,
                        );
                        this.events.next(u);
                      }),
                    );
                }),
                Ih((c) => {
                  let l = (u) => {
                    let d = [];
                    u.routeConfig?.loadComponent &&
                      !u.routeConfig._loadedComponent &&
                      d.push(
                        this.configLoader.loadComponent(u.routeConfig).pipe(
                          ot((g) => {
                            u.component = g;
                          }),
                          Se(() => {}),
                        ),
                      );
                    for (let g of u.children) d.push(...l(g));
                    return d;
                  };
                  return va(l(c.targetSnapshot.root)).pipe(rr(null), Rn(1));
                }),
                Ih(() => this.afterPreactivation()),
                Vt(() => {
                  let { currentSnapshot: c, targetSnapshot: l } = s,
                    u = this.createViewTransition?.(
                      this.environmentInjector,
                      c.root,
                      l.root,
                    );
                  return u ? it(u).pipe(Se(() => s)) : pe(s);
                }),
                Se((c) => {
                  let l = oA(
                    n.routeReuseStrategy,
                    c.targetSnapshot,
                    c.currentRouterState,
                  );
                  return (
                    (this.currentTransition = s =
                      Ge(Y({}, c), { targetRouterState: l })),
                    (this.currentNavigation.targetRouterState = l),
                    s
                  );
                }),
                ot(() => {
                  this.events.next(new bo());
                }),
                uA(
                  this.rootContexts,
                  n.routeReuseStrategy,
                  (c) => this.events.next(c),
                  this.inputBindingEnabled,
                ),
                Rn(1),
                ot({
                  next: (c) => {
                    (o = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new Jr(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          this.urlSerializer.serialize(c.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(
                        c.targetRouterState.snapshot,
                      ),
                      c.resolve(!0);
                  },
                  complete: () => {
                    o = !0;
                  },
                }),
                yu(
                  this.transitionAbortSubject.pipe(
                    ot((c) => {
                      throw c;
                    }),
                  ),
                ),
                pi(() => {
                  !o &&
                    !a &&
                    this.cancelNavigationTransition(
                      s,
                      "",
                      Ft.SupersededByNewNavigation,
                    ),
                    this.currentTransition?.id === s.id &&
                      ((this.currentNavigation = null),
                      (this.currentTransition = null));
                }),
                nr((c) => {
                  if (((a = !0), n_(c)))
                    this.events.next(
                      new Fn(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        c.message,
                        c.cancellationCode,
                      ),
                    ),
                      lA(c)
                        ? this.events.next(
                            new Wi(c.url, c.navigationBehaviorOptions),
                          )
                        : s.resolve(!1);
                  else {
                    let l = new Eo(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c,
                      s.targetSnapshot ?? void 0,
                    );
                    try {
                      let u = gn(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(l),
                      );
                      if (u instanceof wo) {
                        let { message: d, cancellationCode: g } = Dl(
                          this.urlSerializer,
                          u,
                        );
                        this.events.next(
                          new Fn(
                            s.id,
                            this.urlSerializer.serialize(s.extractedUrl),
                            d,
                            g,
                          ),
                        ),
                          this.events.next(
                            new Wi(u.redirectTo, u.navigationBehaviorOptions),
                          );
                      } else {
                        this.events.next(l);
                        let d = n.errorHandler(c);
                        s.resolve(!!d);
                      }
                    } catch (u) {
                      this.options.resolveNavigationPromiseOnError
                        ? s.resolve(!1)
                        : s.reject(u);
                    }
                  }
                  return Nt;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(n, r, i) {
        let s = new Fn(
          n.id,
          this.urlSerializer.serialize(n.extractedUrl),
          r,
          i,
        );
        this.events.next(s), n.resolve(!1);
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
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function sR(e) {
  return e !== ho;
}
var oR = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: () => z(aR), providedIn: "root" });
      }
    }
    return e;
  })(),
  ep = class {
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
  aR = (() => {
    class e extends ep {
      static {
        this.ɵfac = (() => {
          let n;
          return function (i) {
            return (n || (n = Fd(e)))(i || e);
          };
        })();
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  u_ = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = ne({ token: e, factory: () => z(cR), providedIn: "root" });
      }
    }
    return e;
  })(),
  cR = (() => {
    class e extends u_ {
      constructor() {
        super(...arguments),
          (this.location = z(Ws)),
          (this.urlSerializer = z(tp)),
          (this.options = z(ip, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = z(ap)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new jn()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Zb(null)),
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
        if (n instanceof vo) this.stateMemento = this.createStateMemento();
        else if (n instanceof ei) this.rawUrlTree = r.initialUrl;
        else if (n instanceof vl) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !r.extras.skipLocationChange
          ) {
            let i = this.urlHandlingStrategy.merge(r.finalUrl, r.initialUrl);
            this.setBrowserUrl(r.targetBrowserUrl ?? i, r);
          }
        } else
          n instanceof bo
            ? ((this.currentUrlTree = r.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                r.finalUrl,
                r.initialUrl,
              )),
              (this.routerState = r.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                !r.extras.skipLocationChange &&
                this.setBrowserUrl(r.targetBrowserUrl ?? this.rawUrlTree, r))
            : n instanceof Fn &&
                (n.code === Ft.GuardRejected ||
                  n.code === Ft.NoDataFromResolver)
              ? this.restoreHistory(r)
              : n instanceof Eo
                ? this.restoreHistory(r, !0)
                : n instanceof Jr &&
                  ((this.lastSuccessfulId = n.id),
                  (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, r) {
        let i = n instanceof jn ? this.urlSerializer.serialize(n) : n;
        if (this.location.isCurrentPathEqualTo(i) || r.extras.replaceUrl) {
          let s = this.browserPageId,
            o = Y(Y({}, r.extras.state), this.generateNgRouterState(r.id, s));
          this.location.replaceState(i, "", o);
        } else {
          let s = Y(
            Y({}, r.extras.state),
            this.generateNgRouterState(r.id, this.browserPageId + 1),
          );
          this.location.go(i, "", s);
        }
      }
      restoreHistory(n, r = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let i = this.browserPageId,
            s = this.currentPageId - i;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
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
          return function (i) {
            return (n || (n = Fd(e)))(i || e);
          };
        })();
      }
      static {
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  uo = (function (e) {
    return (
      (e[(e.COMPLETE = 0)] = "COMPLETE"),
      (e[(e.FAILED = 1)] = "FAILED"),
      (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
      e
    );
  })(uo || {});
function lR(e, t) {
  e.events
    .pipe(
      Ht(
        (n) =>
          n instanceof Jr ||
          n instanceof Fn ||
          n instanceof Eo ||
          n instanceof ei,
      ),
      Se((n) =>
        n instanceof Jr || n instanceof ei
          ? uo.COMPLETE
          : (
                n instanceof Fn
                  ? n.code === Ft.Redirect ||
                    n.code === Ft.SupersededByNewNavigation
                  : !1
              )
            ? uo.REDIRECTING
            : uo.FAILED,
      ),
      Ht((n) => n !== uo.REDIRECTING),
      Rn(1),
    )
    .subscribe(() => {
      t();
    });
}
function uR(e) {
  throw e;
}
var dR = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  fR = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  d_ = (() => {
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
          (this.console = z(Mc)),
          (this.stateManager = z(u_)),
          (this.options = z(ip, { optional: !0 }) || {}),
          (this.pendingTasks = z(Hr)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = z(iR)),
          (this.urlSerializer = z(tp)),
          (this.location = z(Ws)),
          (this.urlHandlingStrategy = z(ap)),
          (this._events = new ut()),
          (this.errorHandler = this.options.errorHandler || uR),
          (this.navigated = !1),
          (this.routeReuseStrategy = z(oR)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = z(op, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!z(rp, { optional: !0 })),
          (this.eventsSubscription = new rt()),
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
            let i = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (i !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(r, s),
                r instanceof Fn &&
                  r.code !== Ft.Redirect &&
                  r.code !== Ft.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (r instanceof Jr) this.navigated = !0;
              else if (r instanceof Wi) {
                let o = r.navigationBehaviorOptions,
                  a = this.urlHandlingStrategy.merge(r.url, i.currentRawUrl),
                  c = Y(
                    {
                      browserUrl: i.extras.browserUrl,
                      info: i.extras.info,
                      skipLocationChange: i.extras.skipLocationChange,
                      replaceUrl:
                        i.extras.replaceUrl ||
                        this.urlUpdateStrategy === "eager" ||
                        sR(i.source),
                    },
                    o,
                  );
                this.scheduleNavigation(a, ho, null, c, {
                  resolve: i.resolve,
                  reject: i.reject,
                  promise: i.promise,
                });
              }
            }
            pR(r) && this._events.next(r);
          } catch (i) {
            this.navigationTransitions.transitionAbortSubject.next(i);
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
              ho,
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
      navigateToSyncWithBrowser(n, r, i) {
        let s = { replaceUrl: !0 },
          o = i?.navigationId ? i : null;
        if (i) {
          let c = Y({}, i);
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (s.state = c);
        }
        let a = this.parseUrl(n);
        this.scheduleNavigation(a, r, o, s);
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
        (this.config = n.map(sp)), (this.navigated = !1);
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
            relativeTo: i,
            queryParams: s,
            fragment: o,
            queryParamsHandling: a,
            preserveFragment: c,
          } = r,
          l = c ? this.currentUrlTree.fragment : o,
          u = null;
        switch (a ?? this.options.defaultQueryParamsHandling) {
          case "merge":
            u = Y(Y({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            u = this.currentUrlTree.queryParams;
            break;
          default:
            u = s || null;
        }
        u !== null && (u = this.removeEmptyProps(u));
        let d;
        try {
          let g = i ? i.snapshot : this.routerState.snapshot.root;
          d = Wb(g);
        } catch {
          (typeof n[0] != "string" || n[0][0] !== "/") && (n = []),
            (d = this.currentUrlTree.root);
        }
        return Kb(d, n, u, l ?? null);
      }
      navigateByUrl(n, r = { skipLocationChange: !1 }) {
        let i = go(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
        return this.scheduleNavigation(s, ho, null, r);
      }
      navigate(n, r = { skipLocationChange: !1 }) {
        return hR(n), this.navigateByUrl(this.createUrlTree(n, r), r);
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
        let i;
        if (
          (r === !0 ? (i = Y({}, dR)) : r === !1 ? (i = Y({}, fR)) : (i = r),
          go(n))
        )
          return Ab(this.currentUrlTree, n, i);
        let s = this.parseUrl(n);
        return Ab(this.currentUrlTree, s, i);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (r, [i, s]) => (s != null && (r[i] = s), r),
          {},
        );
      }
      scheduleNavigation(n, r, i, s, o) {
        if (this.disposed) return Promise.resolve(!1);
        let a, c, l;
        o
          ? ((a = o.resolve), (c = o.reject), (l = o.promise))
          : (l = new Promise((d, g) => {
              (a = d), (c = g);
            }));
        let u = this.pendingTasks.add();
        return (
          lR(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(u));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: r,
            restoredState: i,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: a,
            reject: c,
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
        this.ɵprov = ne({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })();
function hR(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new G(4008, !1);
}
function pR(e) {
  return !(e instanceof bo) && !(e instanceof Wi);
}
var mR = new ie("");
function Q2(e, ...t) {
  return kn([
    { provide: op, multi: !0, useValue: e },
    [],
    { provide: Ki, useFactory: gR, deps: [d_] },
    { provide: Oi, multi: !0, useFactory: yR },
    t.map((n) => n.ɵproviders),
  ]);
}
function gR(e) {
  return e.routerState.root;
}
function yR() {
  let e = z(St);
  return (t) => {
    let n = e.get(Wt);
    if (t !== n.components[0]) return;
    let r = e.get(d_),
      i = e.get(vR);
    e.get(ER) === 1 && r.initialNavigation(),
      e.get(bR, null, Ee.Optional)?.setUpPreloading(),
      e.get(mR, null, Ee.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var vR = new ie("", { factory: () => new ut() }),
  ER = new ie("", { providedIn: "root", factory: () => 1 });
var bR = new ie("");
export {
  vg as a,
  wP as b,
  DP as c,
  TP as d,
  SP as e,
  UC as f,
  IP as g,
  NP as h,
  Iv as i,
  Nv as j,
  ff as k,
  MP as l,
  JC as m,
  Rv as n,
  xv as o,
  AP as p,
  RP as q,
  Mc as r,
  Wt as s,
  ki as t,
  mf as u,
  xP as v,
  xc as w,
  bf as x,
  OP as y,
  LI as z,
  HF as A,
  VF as B,
  ul as C,
  pM as D,
  g2 as E,
  NM as F,
  y2 as G,
  v2 as H,
  sA as I,
  JA as J,
  d_ as K,
  Q2 as L,
};
