import { createRequire } from "node:module";
globalThis["require"] ??= createRequire(import.meta.url);
var zr = ((E) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
      ? new Proxy(E, { get: (S, p) => (typeof require < "u" ? require : S)[p] })
      : E)(function (E) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + E + '" is not supported');
});
var ct = globalThis;
function lt(E) {
  return (ct.__Zone_symbol_prefix || "__zone_symbol__") + E;
}
function Hs() {
  let E = ct.performance;
  function S(d) {
    E && E.mark && E.mark(d);
  }
  function p(d, h) {
    E && E.measure && E.measure(d, h);
  }
  S("Zone");
  class l {
    static {
      this.__symbol__ = lt;
    }
    static assertZonePatched() {
      if (ct.Promise !== D.ZoneAwarePromise)
        throw new Error(
          "Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)",
        );
    }
    static get root() {
      let h = l.current;
      for (; h.parent; ) h = h.parent;
      return h;
    }
    static get current() {
      return Z.zone;
    }
    static get currentTask() {
      return u;
    }
    static __load_patch(h, v, C = !1) {
      if (D.hasOwnProperty(h)) {
        let j = ct[lt("forceDuplicateZoneCheck")] === !0;
        if (!C && j) throw Error("Already loaded patch: " + h);
      } else if (!ct["__Zone_disable_" + h]) {
        let j = "Zone:" + h;
        S(j), (D[h] = v(ct, l, P)), p(j, j);
      }
    }
    get parent() {
      return this._parent;
    }
    get name() {
      return this._name;
    }
    constructor(h, v) {
      (this._parent = h),
        (this._name = v ? v.name || "unnamed" : "<root>"),
        (this._properties = (v && v.properties) || {}),
        (this._zoneDelegate = new a(
          this,
          this._parent && this._parent._zoneDelegate,
          v,
        ));
    }
    get(h) {
      let v = this.getZoneWith(h);
      if (v) return v._properties[h];
    }
    getZoneWith(h) {
      let v = this;
      for (; v; ) {
        if (v._properties.hasOwnProperty(h)) return v;
        v = v._parent;
      }
      return null;
    }
    fork(h) {
      if (!h) throw new Error("ZoneSpec required!");
      return this._zoneDelegate.fork(this, h);
    }
    wrap(h, v) {
      if (typeof h != "function")
        throw new Error("Expecting function got: " + h);
      let C = this._zoneDelegate.intercept(this, h, v),
        j = this;
      return function () {
        return j.runGuarded(C, this, arguments, v);
      };
    }
    run(h, v, C, j) {
      Z = { parent: Z, zone: this };
      try {
        return this._zoneDelegate.invoke(this, h, v, C, j);
      } finally {
        Z = Z.parent;
      }
    }
    runGuarded(h, v = null, C, j) {
      Z = { parent: Z, zone: this };
      try {
        try {
          return this._zoneDelegate.invoke(this, h, v, C, j);
        } catch (re) {
          if (this._zoneDelegate.handleError(this, re)) throw re;
        }
      } finally {
        Z = Z.parent;
      }
    }
    runTask(h, v, C) {
      if (h.zone != this)
        throw new Error(
          "A task can only be run in the zone of creation! (Creation: " +
            (h.zone || J).name +
            "; Execution: " +
            this.name +
            ")",
        );
      let j = h,
        { type: re, data: { isPeriodic: w = !1, isRefreshable: A = !1 } = {} } =
          h;
      if (h.state === B && (re === G || re === Q)) return;
      let X = h.state != k;
      X && j._transitionTo(k, g);
      let ge = u;
      (u = j), (Z = { parent: Z, zone: this });
      try {
        re == Q && h.data && !w && !A && (h.cancelFn = void 0);
        try {
          return this._zoneDelegate.invokeTask(this, j, v, C);
        } catch (Me) {
          if (this._zoneDelegate.handleError(this, Me)) throw Me;
        }
      } finally {
        let Me = h.state;
        if (Me !== B && Me !== ae)
          if (re == G || w || (A && Me === T)) X && j._transitionTo(g, k, T);
          else {
            let bt = j._zoneDelegates;
            this._updateTaskCount(j, -1),
              X && j._transitionTo(B, k, B),
              A && (j._zoneDelegates = bt);
          }
        (Z = Z.parent), (u = ge);
      }
    }
    scheduleTask(h) {
      if (h.zone && h.zone !== this) {
        let C = this;
        for (; C; ) {
          if (C === h.zone)
            throw Error(
              `can not reschedule task to ${this.name} which is descendants of the original zone ${h.zone.name}`,
            );
          C = C.parent;
        }
      }
      h._transitionTo(T, B);
      let v = [];
      (h._zoneDelegates = v), (h._zone = this);
      try {
        h = this._zoneDelegate.scheduleTask(this, h);
      } catch (C) {
        throw (
          (h._transitionTo(ae, T, B),
          this._zoneDelegate.handleError(this, C),
          C)
        );
      }
      return (
        h._zoneDelegates === v && this._updateTaskCount(h, 1),
        h.state == T && h._transitionTo(g, T),
        h
      );
    }
    scheduleMicroTask(h, v, C, j) {
      return this.scheduleTask(new o(ne, h, v, C, j, void 0));
    }
    scheduleMacroTask(h, v, C, j, re) {
      return this.scheduleTask(new o(Q, h, v, C, j, re));
    }
    scheduleEventTask(h, v, C, j, re) {
      return this.scheduleTask(new o(G, h, v, C, j, re));
    }
    cancelTask(h) {
      if (h.zone != this)
        throw new Error(
          "A task can only be cancelled in the zone of creation! (Creation: " +
            (h.zone || J).name +
            "; Execution: " +
            this.name +
            ")",
        );
      if (!(h.state !== g && h.state !== k)) {
        h._transitionTo(_, g, k);
        try {
          this._zoneDelegate.cancelTask(this, h);
        } catch (v) {
          throw (
            (h._transitionTo(ae, _), this._zoneDelegate.handleError(this, v), v)
          );
        }
        return (
          this._updateTaskCount(h, -1),
          h._transitionTo(B, _),
          (h.runCount = -1),
          h
        );
      }
    }
    _updateTaskCount(h, v) {
      let C = h._zoneDelegates;
      v == -1 && (h._zoneDelegates = null);
      for (let j = 0; j < C.length; j++) C[j]._updateTaskCount(h.type, v);
    }
  }
  let t = {
    name: "",
    onHasTask: (d, h, v, C) => d.hasTask(v, C),
    onScheduleTask: (d, h, v, C) => d.scheduleTask(v, C),
    onInvokeTask: (d, h, v, C, j, re) => d.invokeTask(v, C, j, re),
    onCancelTask: (d, h, v, C) => d.cancelTask(v, C),
  };
  class a {
    get zone() {
      return this._zone;
    }
    constructor(h, v, C) {
      (this._taskCounts = { microTask: 0, macroTask: 0, eventTask: 0 }),
        (this._zone = h),
        (this._parentDelegate = v),
        (this._forkZS = C && (C && C.onFork ? C : v._forkZS)),
        (this._forkDlgt = C && (C.onFork ? v : v._forkDlgt)),
        (this._forkCurrZone = C && (C.onFork ? this._zone : v._forkCurrZone)),
        (this._interceptZS = C && (C.onIntercept ? C : v._interceptZS)),
        (this._interceptDlgt = C && (C.onIntercept ? v : v._interceptDlgt)),
        (this._interceptCurrZone =
          C && (C.onIntercept ? this._zone : v._interceptCurrZone)),
        (this._invokeZS = C && (C.onInvoke ? C : v._invokeZS)),
        (this._invokeDlgt = C && (C.onInvoke ? v : v._invokeDlgt)),
        (this._invokeCurrZone =
          C && (C.onInvoke ? this._zone : v._invokeCurrZone)),
        (this._handleErrorZS = C && (C.onHandleError ? C : v._handleErrorZS)),
        (this._handleErrorDlgt =
          C && (C.onHandleError ? v : v._handleErrorDlgt)),
        (this._handleErrorCurrZone =
          C && (C.onHandleError ? this._zone : v._handleErrorCurrZone)),
        (this._scheduleTaskZS =
          C && (C.onScheduleTask ? C : v._scheduleTaskZS)),
        (this._scheduleTaskDlgt =
          C && (C.onScheduleTask ? v : v._scheduleTaskDlgt)),
        (this._scheduleTaskCurrZone =
          C && (C.onScheduleTask ? this._zone : v._scheduleTaskCurrZone)),
        (this._invokeTaskZS = C && (C.onInvokeTask ? C : v._invokeTaskZS)),
        (this._invokeTaskDlgt = C && (C.onInvokeTask ? v : v._invokeTaskDlgt)),
        (this._invokeTaskCurrZone =
          C && (C.onInvokeTask ? this._zone : v._invokeTaskCurrZone)),
        (this._cancelTaskZS = C && (C.onCancelTask ? C : v._cancelTaskZS)),
        (this._cancelTaskDlgt = C && (C.onCancelTask ? v : v._cancelTaskDlgt)),
        (this._cancelTaskCurrZone =
          C && (C.onCancelTask ? this._zone : v._cancelTaskCurrZone)),
        (this._hasTaskZS = null),
        (this._hasTaskDlgt = null),
        (this._hasTaskDlgtOwner = null),
        (this._hasTaskCurrZone = null);
      let j = C && C.onHasTask,
        re = v && v._hasTaskZS;
      (j || re) &&
        ((this._hasTaskZS = j ? C : t),
        (this._hasTaskDlgt = v),
        (this._hasTaskDlgtOwner = this),
        (this._hasTaskCurrZone = this._zone),
        C.onScheduleTask ||
          ((this._scheduleTaskZS = t),
          (this._scheduleTaskDlgt = v),
          (this._scheduleTaskCurrZone = this._zone)),
        C.onInvokeTask ||
          ((this._invokeTaskZS = t),
          (this._invokeTaskDlgt = v),
          (this._invokeTaskCurrZone = this._zone)),
        C.onCancelTask ||
          ((this._cancelTaskZS = t),
          (this._cancelTaskDlgt = v),
          (this._cancelTaskCurrZone = this._zone)));
    }
    fork(h, v) {
      return this._forkZS
        ? this._forkZS.onFork(this._forkDlgt, this.zone, h, v)
        : new l(h, v);
    }
    intercept(h, v, C) {
      return this._interceptZS
        ? this._interceptZS.onIntercept(
            this._interceptDlgt,
            this._interceptCurrZone,
            h,
            v,
            C,
          )
        : v;
    }
    invoke(h, v, C, j, re) {
      return this._invokeZS
        ? this._invokeZS.onInvoke(
            this._invokeDlgt,
            this._invokeCurrZone,
            h,
            v,
            C,
            j,
            re,
          )
        : v.apply(C, j);
    }
    handleError(h, v) {
      return this._handleErrorZS
        ? this._handleErrorZS.onHandleError(
            this._handleErrorDlgt,
            this._handleErrorCurrZone,
            h,
            v,
          )
        : !0;
    }
    scheduleTask(h, v) {
      let C = v;
      if (this._scheduleTaskZS)
        this._hasTaskZS && C._zoneDelegates.push(this._hasTaskDlgtOwner),
          (C = this._scheduleTaskZS.onScheduleTask(
            this._scheduleTaskDlgt,
            this._scheduleTaskCurrZone,
            h,
            v,
          )),
          C || (C = v);
      else if (v.scheduleFn) v.scheduleFn(v);
      else if (v.type == ne) H(v);
      else throw new Error("Task is missing scheduleFn.");
      return C;
    }
    invokeTask(h, v, C, j) {
      return this._invokeTaskZS
        ? this._invokeTaskZS.onInvokeTask(
            this._invokeTaskDlgt,
            this._invokeTaskCurrZone,
            h,
            v,
            C,
            j,
          )
        : v.callback.apply(C, j);
    }
    cancelTask(h, v) {
      let C;
      if (this._cancelTaskZS)
        C = this._cancelTaskZS.onCancelTask(
          this._cancelTaskDlgt,
          this._cancelTaskCurrZone,
          h,
          v,
        );
      else {
        if (!v.cancelFn) throw Error("Task is not cancelable");
        C = v.cancelFn(v);
      }
      return C;
    }
    hasTask(h, v) {
      try {
        this._hasTaskZS &&
          this._hasTaskZS.onHasTask(
            this._hasTaskDlgt,
            this._hasTaskCurrZone,
            h,
            v,
          );
      } catch (C) {
        this.handleError(h, C);
      }
    }
    _updateTaskCount(h, v) {
      let C = this._taskCounts,
        j = C[h],
        re = (C[h] = j + v);
      if (re < 0) throw new Error("More tasks executed then were scheduled.");
      if (j == 0 || re == 0) {
        let w = {
          microTask: C.microTask > 0,
          macroTask: C.macroTask > 0,
          eventTask: C.eventTask > 0,
          change: h,
        };
        this.hasTask(this._zone, w);
      }
    }
  }
  class o {
    constructor(h, v, C, j, re, w) {
      if (
        ((this._zone = null),
        (this.runCount = 0),
        (this._zoneDelegates = null),
        (this._state = "notScheduled"),
        (this.type = h),
        (this.source = v),
        (this.data = j),
        (this.scheduleFn = re),
        (this.cancelFn = w),
        !C)
      )
        throw new Error("callback is not defined");
      this.callback = C;
      let A = this;
      h === G && j && j.useG
        ? (this.invoke = o.invokeTask)
        : (this.invoke = function () {
            return o.invokeTask.call(ct, A, this, arguments);
          });
    }
    static invokeTask(h, v, C) {
      h || (h = this), i++;
      try {
        return h.runCount++, h.zone.runTask(h, v, C);
      } finally {
        i == 1 && R(), i--;
      }
    }
    get zone() {
      return this._zone;
    }
    get state() {
      return this._state;
    }
    cancelScheduleRequest() {
      this._transitionTo(B, T);
    }
    _transitionTo(h, v, C) {
      if (this._state === v || this._state === C)
        (this._state = h), h == B && (this._zoneDelegates = null);
      else
        throw new Error(
          `${this.type} '${this.source}': can not transition to '${h}', expecting state '${v}'${C ? " or '" + C + "'" : ""}, was '${this._state}'.`,
        );
    }
    toString() {
      return this.data && typeof this.data.handleId < "u"
        ? this.data.handleId.toString()
        : Object.prototype.toString.call(this);
    }
    toJSON() {
      return {
        type: this.type,
        state: this.state,
        source: this.source,
        zone: this.zone.name,
        runCount: this.runCount,
      };
    }
  }
  let c = lt("setTimeout"),
    f = lt("Promise"),
    s = lt("then"),
    b = [],
    m = !1,
    N;
  function I(d) {
    if ((N || (ct[f] && (N = ct[f].resolve(0))), N)) {
      let h = N[s];
      h || (h = N.then), h.call(N, d);
    } else ct[c](d, 0);
  }
  function H(d) {
    i === 0 && b.length === 0 && I(R), d && b.push(d);
  }
  function R() {
    if (!m) {
      for (m = !0; b.length; ) {
        let d = b;
        b = [];
        for (let h = 0; h < d.length; h++) {
          let v = d[h];
          try {
            v.zone.runTask(v, null, null);
          } catch (C) {
            P.onUnhandledError(C);
          }
        }
      }
      P.microtaskDrainDone(), (m = !1);
    }
  }
  let J = { name: "NO ZONE" },
    B = "notScheduled",
    T = "scheduling",
    g = "scheduled",
    k = "running",
    _ = "canceling",
    ae = "unknown",
    ne = "microTask",
    Q = "macroTask",
    G = "eventTask",
    D = {},
    P = {
      symbol: lt,
      currentZoneFrame: () => Z,
      onUnhandledError: n,
      microtaskDrainDone: n,
      scheduleMicroTask: H,
      showUncaughtError: () => !l[lt("ignoreConsoleErrorUncaughtError")],
      patchEventTarget: () => [],
      patchOnProperties: n,
      patchMethod: () => n,
      bindArguments: () => [],
      patchThen: () => n,
      patchMacroTask: () => n,
      patchEventPrototype: () => n,
      isIEOrEdge: () => !1,
      getGlobalObjects: () => {},
      ObjectDefineProperty: () => n,
      ObjectGetOwnPropertyDescriptor: () => {},
      ObjectCreate: () => {},
      ArraySlice: () => [],
      patchClass: () => n,
      wrapWithCurrentZone: () => n,
      filterProperties: () => [],
      attachOriginToPatched: () => n,
      _redefineProperty: () => n,
      patchCallbacks: () => n,
      nativeScheduleMicroTask: I,
    },
    Z = { parent: null, zone: new l(null, null) },
    u = null,
    i = 0;
  function n() {}
  return p("Zone", "Zone"), l;
}
var Tn = Object.getOwnPropertyDescriptor,
  qs = Object.defineProperty,
  aa = Object.getPrototypeOf,
  Ps = Array.prototype.slice,
  Bs = "addEventListener",
  Fs = "removeEventListener",
  Ht = "true",
  qt = "false",
  Wr = lt("");
function Us(E, S) {
  return Zone.current.wrap(E, S);
}
function sa(E, S, p, l, t) {
  return Zone.current.scheduleMacroTask(E, S, p, l, t);
}
var Ue = lt,
  Yr = typeof window < "u",
  Qr = Yr ? window : void 0,
  et = (Yr && Qr) || globalThis,
  js = "removeAttribute";
function Vs(E, S) {
  for (let p = E.length - 1; p >= 0; p--)
    typeof E[p] == "function" && (E[p] = Us(E[p], S + "_" + p));
  return E;
}
function Gs(E) {
  return E
    ? E.writable === !1
      ? !1
      : !(typeof E.get == "function" && typeof E.set > "u")
    : !0;
}
var ia = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope,
  oa =
    !("nw" in et) &&
    typeof et.process < "u" &&
    et.process.toString() === "[object process]",
  zs = !oa && !ia && !!(Yr && Qr.HTMLElement),
  Jn =
    typeof et.process < "u" &&
    et.process.toString() === "[object process]" &&
    !ia &&
    !!(Yr && Qr.HTMLElement),
  Kr = {},
  Zs = Ue("enable_beforeunload"),
  ea = function (E) {
    if (((E = E || et.event), !E)) return;
    let S = Kr[E.type];
    S || (S = Kr[E.type] = Ue("ON_PROPERTY" + E.type));
    let p = this || E.target || et,
      l = p[S],
      t;
    if (zs && p === Qr && E.type === "error") {
      let a = E;
      (t =
        l && l.call(this, a.message, a.filename, a.lineno, a.colno, a.error)),
        t === !0 && E.preventDefault();
    } else
      (t = l && l.apply(this, arguments)),
        E.type === "beforeunload" && et[Zs] && typeof t == "string"
          ? (E.returnValue = t)
          : t != null && !t && E.preventDefault();
    return t;
  };
function ta(E, S, p) {
  let l = Tn(E, S);
  if (
    (!l && p && Tn(p, S) && (l = { enumerable: !0, configurable: !0 }),
    !l || !l.configurable)
  )
    return;
  let t = Ue("on" + S + "patched");
  if (E.hasOwnProperty(t) && E[t]) return;
  delete l.writable, delete l.value;
  let a = l.get,
    o = l.set,
    c = S.slice(2),
    f = Kr[c];
  f || (f = Kr[c] = Ue("ON_PROPERTY" + c)),
    (l.set = function (s) {
      let b = this;
      if ((!b && E === et && (b = et), !b)) return;
      typeof b[f] == "function" && b.removeEventListener(c, ea),
        o && o.call(b, null),
        (b[f] = s),
        typeof s == "function" && b.addEventListener(c, ea, !1);
    }),
    (l.get = function () {
      let s = this;
      if ((!s && E === et && (s = et), !s)) return null;
      let b = s[f];
      if (b) return b;
      if (a) {
        let m = a.call(this);
        if (m)
          return (
            l.set.call(this, m),
            typeof s[js] == "function" && s.removeAttribute(S),
            m
          );
      }
      return null;
    }),
    qs(E, S, l),
    (E[t] = !0);
}
function Ws(E, S, p) {
  if (S) for (let l = 0; l < S.length; l++) ta(E, "on" + S[l], p);
  else {
    let l = [];
    for (let t in E) t.slice(0, 2) == "on" && l.push(t);
    for (let t = 0; t < l.length; t++) ta(E, l[t], p);
  }
}
function Ks(E, S) {
  if (typeof Object.getOwnPropertySymbols != "function") return;
  Object.getOwnPropertySymbols(E).forEach((l) => {
    let t = Object.getOwnPropertyDescriptor(E, l);
    Object.defineProperty(S, l, {
      get: function () {
        return E[l];
      },
      set: function (a) {
        (t && (!t.writable || typeof t.set != "function")) || (E[l] = a);
      },
      enumerable: t ? t.enumerable : !0,
      configurable: t ? t.configurable : !0,
    });
  });
}
var ca = !1;
function Xs(E) {
  ca = E;
}
function nr(E, S, p) {
  let l = E;
  for (; l && !l.hasOwnProperty(S); ) l = aa(l);
  !l && E[S] && (l = E);
  let t = Ue(S),
    a = null;
  if (l && (!(a = l[t]) || !l.hasOwnProperty(t))) {
    a = l[t] = l[S];
    let o = l && Tn(l, S);
    if (Gs(o)) {
      let c = p(a, t, S);
      (l[S] = function () {
        return c(this, arguments);
      }),
        _r(l[S], a),
        ca && Ks(a, l[S]);
    }
  }
  return a;
}
function Xr(E, S, p) {
  let l = null;
  function t(a) {
    let o = a.data;
    return (
      (o.args[o.cbIdx] = function () {
        a.invoke.apply(this, arguments);
      }),
      l.apply(o.target, o.args),
      a
    );
  }
  l = nr(
    E,
    S,
    (a) =>
      function (o, c) {
        let f = p(o, c);
        return f.cbIdx >= 0 && typeof c[f.cbIdx] == "function"
          ? sa(f.name, c[f.cbIdx], f, t)
          : a.apply(o, c);
      },
  );
}
function Ys(E, S, p) {
  let l = null;
  function t(a) {
    let o = a.data;
    return (
      (o.args[o.cbIdx] = function () {
        a.invoke.apply(this, arguments);
      }),
      l.apply(o.target, o.args),
      a
    );
  }
  l = nr(
    E,
    S,
    (a) =>
      function (o, c) {
        let f = p(o, c);
        return f.cbIdx >= 0 && typeof c[f.cbIdx] == "function"
          ? Zone.current.scheduleMicroTask(f.name, c[f.cbIdx], f, t)
          : a.apply(o, c);
      },
  );
}
function _r(E, S) {
  E[Ue("OriginalDelegate")] = S;
}
function ra(E) {
  return typeof E == "function";
}
function na(E) {
  return typeof E == "number";
}
function Qs(E) {
  E.__load_patch("ZoneAwarePromise", (S, p, l) => {
    let t = Object.getOwnPropertyDescriptor,
      a = Object.defineProperty;
    function o(Y) {
      if (Y && Y.toString === Object.prototype.toString) {
        let z = Y.constructor && Y.constructor.name;
        return (z || "") + ": " + JSON.stringify(Y);
      }
      return Y ? Y.toString() : Object.prototype.toString.call(Y);
    }
    let c = l.symbol,
      f = [],
      s = S[c("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== !1,
      b = c("Promise"),
      m = c("then"),
      N = "__creationTrace__";
    (l.onUnhandledError = (Y) => {
      if (l.showUncaughtError()) {
        let z = Y && Y.rejection;
        z
          ? console.error(
              "Unhandled Promise rejection:",
              z instanceof Error ? z.message : z,
              "; Zone:",
              Y.zone.name,
              "; Task:",
              Y.task && Y.task.source,
              "; Value:",
              z,
              z instanceof Error ? z.stack : void 0,
            )
          : console.error(Y);
      }
    }),
      (l.microtaskDrainDone = () => {
        for (; f.length; ) {
          let Y = f.shift();
          try {
            Y.zone.runGuarded(() => {
              throw Y.throwOriginal ? Y.rejection : Y;
            });
          } catch (z) {
            H(z);
          }
        }
      });
    let I = c("unhandledPromiseRejectionHandler");
    function H(Y) {
      l.onUnhandledError(Y);
      try {
        let z = p[I];
        typeof z == "function" && z.call(this, Y);
      } catch {}
    }
    function R(Y) {
      return Y && Y.then;
    }
    function J(Y) {
      return Y;
    }
    function B(Y) {
      return A.reject(Y);
    }
    let T = c("state"),
      g = c("value"),
      k = c("finally"),
      _ = c("parentPromiseValue"),
      ae = c("parentPromiseState"),
      ne = "Promise.then",
      Q = null,
      G = !0,
      D = !1,
      P = 0;
    function Z(Y, z) {
      return (O) => {
        try {
          d(Y, z, O);
        } catch (W) {
          d(Y, !1, W);
        }
      };
    }
    let u = function () {
        let Y = !1;
        return function (O) {
          return function () {
            Y || ((Y = !0), O.apply(null, arguments));
          };
        };
      },
      i = "Promise resolved with itself",
      n = c("currentTaskTrace");
    function d(Y, z, O) {
      let W = u();
      if (Y === O) throw new TypeError(i);
      if (Y[T] === Q) {
        let ce = null;
        try {
          (typeof O == "object" || typeof O == "function") &&
            (ce = O && O.then);
        } catch (he) {
          return (
            W(() => {
              d(Y, !1, he);
            })(),
            Y
          );
        }
        if (
          z !== D &&
          O instanceof A &&
          O.hasOwnProperty(T) &&
          O.hasOwnProperty(g) &&
          O[T] !== Q
        )
          v(O), d(Y, O[T], O[g]);
        else if (z !== D && typeof ce == "function")
          try {
            ce.call(O, W(Z(Y, z)), W(Z(Y, !1)));
          } catch (he) {
            W(() => {
              d(Y, !1, he);
            })();
          }
        else {
          Y[T] = z;
          let he = Y[g];
          if (
            ((Y[g] = O),
            Y[k] === k && z === G && ((Y[T] = Y[ae]), (Y[g] = Y[_])),
            z === D && O instanceof Error)
          ) {
            let se =
              p.currentTask && p.currentTask.data && p.currentTask.data[N];
            se &&
              a(O, n, {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: se,
              });
          }
          for (let se = 0; se < he.length; )
            C(Y, he[se++], he[se++], he[se++], he[se++]);
          if (he.length == 0 && z == D) {
            Y[T] = P;
            let se = O;
            try {
              throw new Error(
                "Uncaught (in promise): " +
                  o(O) +
                  (O && O.stack
                    ? `
` + O.stack
                    : ""),
              );
            } catch (me) {
              se = me;
            }
            s && (se.throwOriginal = !0),
              (se.rejection = O),
              (se.promise = Y),
              (se.zone = p.current),
              (se.task = p.currentTask),
              f.push(se),
              l.scheduleMicroTask();
          }
        }
      }
      return Y;
    }
    let h = c("rejectionHandledHandler");
    function v(Y) {
      if (Y[T] === P) {
        try {
          let z = p[h];
          z &&
            typeof z == "function" &&
            z.call(this, { rejection: Y[g], promise: Y });
        } catch {}
        Y[T] = D;
        for (let z = 0; z < f.length; z++) Y === f[z].promise && f.splice(z, 1);
      }
    }
    function C(Y, z, O, W, ce) {
      v(Y);
      let he = Y[T],
        se = he
          ? typeof W == "function"
            ? W
            : J
          : typeof ce == "function"
            ? ce
            : B;
      z.scheduleMicroTask(
        ne,
        () => {
          try {
            let me = Y[g],
              be = !!O && k === O[k];
            be && ((O[_] = me), (O[ae] = he));
            let _e = z.run(se, void 0, be && se !== B && se !== J ? [] : [me]);
            d(O, !0, _e);
          } catch (me) {
            d(O, !1, me);
          }
        },
        O,
      );
    }
    let j = "function ZoneAwarePromise() { [native code] }",
      re = function () {},
      w = S.AggregateError;
    class A {
      static toString() {
        return j;
      }
      static resolve(z) {
        return z instanceof A ? z : d(new this(null), G, z);
      }
      static reject(z) {
        return d(new this(null), D, z);
      }
      static withResolvers() {
        let z = {};
        return (
          (z.promise = new A((O, W) => {
            (z.resolve = O), (z.reject = W);
          })),
          z
        );
      }
      static any(z) {
        if (!z || typeof z[Symbol.iterator] != "function")
          return Promise.reject(new w([], "All promises were rejected"));
        let O = [],
          W = 0;
        try {
          for (let se of z) W++, O.push(A.resolve(se));
        } catch {
          return Promise.reject(new w([], "All promises were rejected"));
        }
        if (W === 0)
          return Promise.reject(new w([], "All promises were rejected"));
        let ce = !1,
          he = [];
        return new A((se, me) => {
          for (let be = 0; be < O.length; be++)
            O[be].then(
              (_e) => {
                ce || ((ce = !0), se(_e));
              },
              (_e) => {
                he.push(_e),
                  W--,
                  W === 0 &&
                    ((ce = !0), me(new w(he, "All promises were rejected")));
              },
            );
        });
      }
      static race(z) {
        let O,
          W,
          ce = new this((me, be) => {
            (O = me), (W = be);
          });
        function he(me) {
          O(me);
        }
        function se(me) {
          W(me);
        }
        for (let me of z) R(me) || (me = this.resolve(me)), me.then(he, se);
        return ce;
      }
      static all(z) {
        return A.allWithCallback(z);
      }
      static allSettled(z) {
        return (this && this.prototype instanceof A ? this : A).allWithCallback(
          z,
          {
            thenCallback: (W) => ({ status: "fulfilled", value: W }),
            errorCallback: (W) => ({ status: "rejected", reason: W }),
          },
        );
      }
      static allWithCallback(z, O) {
        let W,
          ce,
          he = new this((_e, Ae) => {
            (W = _e), (ce = Ae);
          }),
          se = 2,
          me = 0,
          be = [];
        for (let _e of z) {
          R(_e) || (_e = this.resolve(_e));
          let Ae = me;
          try {
            _e.then(
              (Se) => {
                (be[Ae] = O ? O.thenCallback(Se) : Se), se--, se === 0 && W(be);
              },
              (Se) => {
                O
                  ? ((be[Ae] = O.errorCallback(Se)), se--, se === 0 && W(be))
                  : ce(Se);
              },
            );
          } catch (Se) {
            ce(Se);
          }
          se++, me++;
        }
        return (se -= 2), se === 0 && W(be), he;
      }
      constructor(z) {
        let O = this;
        if (!(O instanceof A))
          throw new Error("Must be an instanceof Promise.");
        (O[T] = Q), (O[g] = []);
        try {
          let W = u();
          z && z(W(Z(O, G)), W(Z(O, D)));
        } catch (W) {
          d(O, !1, W);
        }
      }
      get [Symbol.toStringTag]() {
        return "Promise";
      }
      get [Symbol.species]() {
        return A;
      }
      then(z, O) {
        let W = this.constructor?.[Symbol.species];
        (!W || typeof W != "function") && (W = this.constructor || A);
        let ce = new W(re),
          he = p.current;
        return (
          this[T] == Q ? this[g].push(he, ce, z, O) : C(this, he, ce, z, O), ce
        );
      }
      catch(z) {
        return this.then(null, z);
      }
      finally(z) {
        let O = this.constructor?.[Symbol.species];
        (!O || typeof O != "function") && (O = A);
        let W = new O(re);
        W[k] = k;
        let ce = p.current;
        return (
          this[T] == Q ? this[g].push(ce, W, z, z) : C(this, ce, W, z, z), W
        );
      }
    }
    (A.resolve = A.resolve),
      (A.reject = A.reject),
      (A.race = A.race),
      (A.all = A.all);
    let X = (S[b] = S.Promise);
    S.Promise = A;
    let ge = c("thenPatched");
    function Me(Y) {
      let z = Y.prototype,
        O = t(z, "then");
      if (O && (O.writable === !1 || !O.configurable)) return;
      let W = z.then;
      (z[m] = W),
        (Y.prototype.then = function (ce, he) {
          return new A((me, be) => {
            W.call(this, me, be);
          }).then(ce, he);
        }),
        (Y[ge] = !0);
    }
    l.patchThen = Me;
    function bt(Y) {
      return function (z, O) {
        let W = Y.apply(z, O);
        if (W instanceof A) return W;
        let ce = W.constructor;
        return ce[ge] || Me(ce), W;
      };
    }
    return (
      X && (Me(X), nr(S, "fetch", (Y) => bt(Y))),
      (Promise[p.__symbol__("uncaughtPromiseErrors")] = f),
      A
    );
  });
}
function $s(E) {
  E.__load_patch("toString", (S) => {
    let p = Function.prototype.toString,
      l = Ue("OriginalDelegate"),
      t = Ue("Promise"),
      a = Ue("Error"),
      o = function () {
        if (typeof this == "function") {
          let b = this[l];
          if (b)
            return typeof b == "function"
              ? p.call(b)
              : Object.prototype.toString.call(b);
          if (this === Promise) {
            let m = S[t];
            if (m) return p.call(m);
          }
          if (this === Error) {
            let m = S[a];
            if (m) return p.call(m);
          }
        }
        return p.call(this);
      };
    (o[l] = p), (Function.prototype.toString = o);
    let c = Object.prototype.toString,
      f = "[object Promise]";
    Object.prototype.toString = function () {
      return typeof Promise == "function" && this instanceof Promise
        ? f
        : c.call(this);
    };
  });
}
function Js() {
  let E = globalThis,
    S = E[lt("forceDuplicateZoneCheck")] === !0;
  if (E.Zone && (S || typeof E.Zone.__symbol__ != "function"))
    throw new Error("Zone already loaded.");
  return (E.Zone ??= Hs()), E.Zone;
}
var rr = !1;
if (typeof window < "u")
  try {
    let E = Object.defineProperty({}, "passive", {
      get: function () {
        rr = !0;
      },
    });
    window.addEventListener("test", E, E),
      window.removeEventListener("test", E, E);
  } catch {
    rr = !1;
  }
var ei = { useG: !0 },
  nt = {},
  ti = {},
  la = new RegExp("^" + Wr + "(\\w+)(true|false)$"),
  ri = Ue("propagationStopped");
function ua(E, S) {
  let p = (S ? S(E) : E) + qt,
    l = (S ? S(E) : E) + Ht,
    t = Wr + p,
    a = Wr + l;
  (nt[E] = {}), (nt[E][qt] = t), (nt[E][Ht] = a);
}
function ni(E, S, p, l) {
  let t = (l && l.add) || Bs,
    a = (l && l.rm) || Fs,
    o = (l && l.listeners) || "eventListeners",
    c = (l && l.rmAll) || "removeAllListeners",
    f = Ue(t),
    s = "." + t + ":",
    b = "prependListener",
    m = "." + b + ":",
    N = function (T, g, k) {
      if (T.isRemoved) return;
      let _ = T.callback;
      typeof _ == "object" &&
        _.handleEvent &&
        ((T.callback = (Q) => _.handleEvent(Q)), (T.originalDelegate = _));
      let ae;
      try {
        T.invoke(T, g, [k]);
      } catch (Q) {
        ae = Q;
      }
      let ne = T.options;
      if (ne && typeof ne == "object" && ne.once) {
        let Q = T.originalDelegate ? T.originalDelegate : T.callback;
        g[a].call(g, k.type, Q, ne);
      }
      return ae;
    };
  function I(T, g, k) {
    if (((g = g || E.event), !g)) return;
    let _ = T || g.target || E,
      ae = _[nt[g.type][k ? Ht : qt]];
    if (ae) {
      let ne = [];
      if (ae.length === 1) {
        let Q = N(ae[0], _, g);
        Q && ne.push(Q);
      } else {
        let Q = ae.slice();
        for (let G = 0; G < Q.length && !(g && g[ri] === !0); G++) {
          let D = N(Q[G], _, g);
          D && ne.push(D);
        }
      }
      if (ne.length === 1) throw ne[0];
      for (let Q = 0; Q < ne.length; Q++) {
        let G = ne[Q];
        S.nativeScheduleMicroTask(() => {
          throw G;
        });
      }
    }
  }
  let H = function (T) {
      return I(this, T, !1);
    },
    R = function (T) {
      return I(this, T, !0);
    };
  function J(T, g) {
    if (!T) return !1;
    let k = !0;
    g && g.useG !== void 0 && (k = g.useG);
    let _ = g && g.vh,
      ae = !0;
    g && g.chkDup !== void 0 && (ae = g.chkDup);
    let ne = !1;
    g && g.rt !== void 0 && (ne = g.rt);
    let Q = T;
    for (; Q && !Q.hasOwnProperty(t); ) Q = aa(Q);
    if ((!Q && T[t] && (Q = T), !Q || Q[f])) return !1;
    let G = g && g.eventNameToString,
      D = {},
      P = (Q[f] = Q[t]),
      Z = (Q[Ue(a)] = Q[a]),
      u = (Q[Ue(o)] = Q[o]),
      i = (Q[Ue(c)] = Q[c]),
      n;
    g && g.prepend && (n = Q[Ue(g.prepend)] = Q[g.prepend]);
    function d(O, W) {
      return !rr && typeof O == "object" && O
        ? !!O.capture
        : !rr || !W
          ? O
          : typeof O == "boolean"
            ? { capture: O, passive: !0 }
            : O
              ? typeof O == "object" && O.passive !== !1
                ? { ...O, passive: !0 }
                : O
              : { passive: !0 };
    }
    let h = function (O) {
        if (!D.isExisting)
          return P.call(D.target, D.eventName, D.capture ? R : H, D.options);
      },
      v = function (O) {
        if (!O.isRemoved) {
          let W = nt[O.eventName],
            ce;
          W && (ce = W[O.capture ? Ht : qt]);
          let he = ce && O.target[ce];
          if (he) {
            for (let se = 0; se < he.length; se++)
              if (he[se] === O) {
                he.splice(se, 1),
                  (O.isRemoved = !0),
                  O.removeAbortListener &&
                    (O.removeAbortListener(), (O.removeAbortListener = null)),
                  he.length === 0 &&
                    ((O.allRemoved = !0), (O.target[ce] = null));
                break;
              }
          }
        }
        if (O.allRemoved)
          return Z.call(O.target, O.eventName, O.capture ? R : H, O.options);
      },
      C = function (O) {
        return P.call(D.target, D.eventName, O.invoke, D.options);
      },
      j = function (O) {
        return n.call(D.target, D.eventName, O.invoke, D.options);
      },
      re = function (O) {
        return Z.call(O.target, O.eventName, O.invoke, O.options);
      },
      w = k ? h : C,
      A = k ? v : re,
      X = function (O, W) {
        let ce = typeof W;
        return (
          (ce === "function" && O.callback === W) ||
          (ce === "object" && O.originalDelegate === W)
        );
      },
      ge = g && g.diff ? g.diff : X,
      Me = Zone[Ue("UNPATCHED_EVENTS")],
      bt = E[Ue("PASSIVE_EVENTS")];
    function Y(O) {
      if (typeof O == "object" && O !== null) {
        let W = { ...O };
        return O.signal && (W.signal = O.signal), W;
      }
      return O;
    }
    let z = function (O, W, ce, he, se = !1, me = !1) {
      return function () {
        let be = this || E,
          _e = arguments[0];
        g && g.transferEventName && (_e = g.transferEventName(_e));
        let Ae = arguments[1];
        if (!Ae) return O.apply(this, arguments);
        if (oa && _e === "uncaughtException") return O.apply(this, arguments);
        let Se = !1;
        if (typeof Ae != "function") {
          if (!Ae.handleEvent) return O.apply(this, arguments);
          Se = !0;
        }
        if (_ && !_(O, Ae, be, arguments)) return;
        let Xe = rr && !!bt && bt.indexOf(_e) !== -1,
          Ye = Y(d(arguments[2], Xe)),
          ze = Ye?.signal;
        if (ze?.aborted) return;
        if (Me) {
          for (let F = 0; F < Me.length; F++)
            if (_e === Me[F])
              return Xe ? O.call(be, _e, Ae, Ye) : O.apply(this, arguments);
        }
        let Et = Ye ? (typeof Ye == "boolean" ? !0 : Ye.capture) : !1,
          Fe = Ye && typeof Ye == "object" ? Ye.once : !1,
          tn = Zone.current,
          Ne = nt[_e];
        Ne || (ua(_e, G), (Ne = nt[_e]));
        let sr = Ne[Et ? Ht : qt],
          ut = be[sr],
          vr = !1;
        if (ut) {
          if (((vr = !0), ae)) {
            for (let F = 0; F < ut.length; F++) if (ge(ut[F], Ae)) return;
          }
        } else ut = be[sr] = [];
        let Pt,
          ir = be.constructor.name,
          Xt = ti[ir];
        Xt && (Pt = Xt[_e]),
          Pt || (Pt = ir + W + (G ? G(_e) : _e)),
          (D.options = Ye),
          Fe && (D.options.once = !1),
          (D.target = be),
          (D.capture = Et),
          (D.eventName = _e),
          (D.isExisting = vr);
        let vt = k ? ei : void 0;
        vt && (vt.taskData = D), ze && (D.options.signal = void 0);
        let de = tn.scheduleEventTask(Pt, Ae, vt, ce, he);
        if (ze) {
          D.options.signal = ze;
          let F = () => de.zone.cancelTask(de);
          O.call(ze, "abort", F, { once: !0 }),
            (de.removeAbortListener = () => ze.removeEventListener("abort", F));
        }
        if (
          ((D.target = null),
          vt && (vt.taskData = null),
          Fe && (D.options.once = !0),
          (!rr && typeof de.options == "boolean") || (de.options = Ye),
          (de.target = be),
          (de.capture = Et),
          (de.eventName = _e),
          Se && (de.originalDelegate = Ae),
          me ? ut.unshift(de) : ut.push(de),
          se)
        )
          return be;
      };
    };
    return (
      (Q[t] = z(P, s, w, A, ne)),
      n && (Q[b] = z(n, m, j, A, ne, !0)),
      (Q[a] = function () {
        let O = this || E,
          W = arguments[0];
        g && g.transferEventName && (W = g.transferEventName(W));
        let ce = arguments[2],
          he = ce ? (typeof ce == "boolean" ? !0 : ce.capture) : !1,
          se = arguments[1];
        if (!se) return Z.apply(this, arguments);
        if (_ && !_(Z, se, O, arguments)) return;
        let me = nt[W],
          be;
        me && (be = me[he ? Ht : qt]);
        let _e = be && O[be];
        if (_e)
          for (let Ae = 0; Ae < _e.length; Ae++) {
            let Se = _e[Ae];
            if (ge(Se, se)) {
              if (
                (_e.splice(Ae, 1),
                (Se.isRemoved = !0),
                _e.length === 0 &&
                  ((Se.allRemoved = !0),
                  (O[be] = null),
                  !he && typeof W == "string"))
              ) {
                let Xe = Wr + "ON_PROPERTY" + W;
                O[Xe] = null;
              }
              return Se.zone.cancelTask(Se), ne ? O : void 0;
            }
          }
        return Z.apply(this, arguments);
      }),
      (Q[o] = function () {
        let O = this || E,
          W = arguments[0];
        g && g.transferEventName && (W = g.transferEventName(W));
        let ce = [],
          he = fa(O, G ? G(W) : W);
        for (let se = 0; se < he.length; se++) {
          let me = he[se],
            be = me.originalDelegate ? me.originalDelegate : me.callback;
          ce.push(be);
        }
        return ce;
      }),
      (Q[c] = function () {
        let O = this || E,
          W = arguments[0];
        if (W) {
          g && g.transferEventName && (W = g.transferEventName(W));
          let ce = nt[W];
          if (ce) {
            let he = ce[qt],
              se = ce[Ht],
              me = O[he],
              be = O[se];
            if (me) {
              let _e = me.slice();
              for (let Ae = 0; Ae < _e.length; Ae++) {
                let Se = _e[Ae],
                  Xe = Se.originalDelegate ? Se.originalDelegate : Se.callback;
                this[a].call(this, W, Xe, Se.options);
              }
            }
            if (be) {
              let _e = be.slice();
              for (let Ae = 0; Ae < _e.length; Ae++) {
                let Se = _e[Ae],
                  Xe = Se.originalDelegate ? Se.originalDelegate : Se.callback;
                this[a].call(this, W, Xe, Se.options);
              }
            }
          }
        } else {
          let ce = Object.keys(O);
          for (let he = 0; he < ce.length; he++) {
            let se = ce[he],
              me = la.exec(se),
              be = me && me[1];
            be && be !== "removeListener" && this[c].call(this, be);
          }
          this[c].call(this, "removeListener");
        }
        if (ne) return this;
      }),
      _r(Q[t], P),
      _r(Q[a], Z),
      i && _r(Q[c], i),
      u && _r(Q[o], u),
      !0
    );
  }
  let B = [];
  for (let T = 0; T < p.length; T++) B[T] = J(p[T], l);
  return B;
}
function fa(E, S) {
  if (!S) {
    let a = [];
    for (let o in E) {
      let c = la.exec(o),
        f = c && c[1];
      if (f && (!S || f === S)) {
        let s = E[o];
        if (s) for (let b = 0; b < s.length; b++) a.push(s[b]);
      }
    }
    return a;
  }
  let p = nt[S];
  p || (ua(S), (p = nt[S]));
  let l = E[p[qt]],
    t = E[p[Ht]];
  return l ? (t ? l.concat(t) : l.slice()) : t ? t.slice() : [];
}
function ai(E, S) {
  S.patchMethod(
    E,
    "queueMicrotask",
    (p) =>
      function (l, t) {
        Zone.current.scheduleMicroTask("queueMicrotask", t[0]);
      },
  );
}
var Zr = Ue("zoneTask");
function Jt(E, S, p, l) {
  let t = null,
    a = null;
  (S += l), (p += l);
  let o = {};
  function c(s) {
    let b = s.data;
    b.args[0] = function () {
      return s.invoke.apply(this, arguments);
    };
    let m = t.apply(E, b.args);
    return (
      na(m)
        ? (b.handleId = m)
        : ((b.handle = m), (b.isRefreshable = ra(m.refresh))),
      s
    );
  }
  function f(s) {
    let { handle: b, handleId: m } = s.data;
    return a.call(E, b ?? m);
  }
  (t = nr(
    E,
    S,
    (s) =>
      function (b, m) {
        if (ra(m[0])) {
          let N = {
              isRefreshable: !1,
              isPeriodic: l === "Interval",
              delay: l === "Timeout" || l === "Interval" ? m[1] || 0 : void 0,
              args: m,
            },
            I = m[0];
          m[0] = function () {
            try {
              return I.apply(this, arguments);
            } finally {
              let {
                handle: k,
                handleId: _,
                isPeriodic: ae,
                isRefreshable: ne,
              } = N;
              !ae && !ne && (_ ? delete o[_] : k && (k[Zr] = null));
            }
          };
          let H = sa(S, m[0], N, c, f);
          if (!H) return H;
          let {
            handleId: R,
            handle: J,
            isRefreshable: B,
            isPeriodic: T,
          } = H.data;
          if (R) o[R] = H;
          else if (J && ((J[Zr] = H), B && !T)) {
            let g = J.refresh;
            J.refresh = function () {
              let { zone: k, state: _ } = H;
              return (
                _ === "notScheduled"
                  ? ((H._state = "scheduled"), k._updateTaskCount(H, 1))
                  : _ === "running" && (H._state = "scheduling"),
                g.call(this)
              );
            };
          }
          return J ?? R ?? H;
        } else return s.apply(E, m);
      },
  )),
    (a = nr(
      E,
      p,
      (s) =>
        function (b, m) {
          let N = m[0],
            I;
          na(N)
            ? ((I = o[N]), delete o[N])
            : ((I = N?.[Zr]), I ? (N[Zr] = null) : (I = N)),
            I?.type ? I.cancelFn && I.zone.cancelTask(I) : s.apply(E, m);
        },
    ));
}
function si(E) {
  E.__load_patch("EventEmitter", (S, p, l) => {
    let t = "addListener",
      a = "prependListener",
      o = "removeListener",
      c = "removeAllListeners",
      f = "listeners",
      s = "on",
      b = "off",
      m = function (R, J) {
        return R.callback === J || R.callback.listener === J;
      },
      N = function (R) {
        return typeof R == "string"
          ? R
          : R
            ? R.toString().replace("(", "_").replace(")", "_")
            : "";
      };
    function I(R) {
      let J = ni(S, l, [R], {
        useG: !1,
        add: t,
        rm: o,
        prepend: a,
        rmAll: c,
        listeners: f,
        chkDup: !1,
        rt: !0,
        diff: m,
        eventNameToString: N,
      });
      J && J[0] && ((R[s] = R[t]), (R[b] = R[o]));
    }
    let H;
    try {
      H = zr("events");
    } catch {}
    H && H.EventEmitter && I(H.EventEmitter.prototype);
  });
}
function ii(E) {
  E.__load_patch("fs", (S, p, l) => {
    let t;
    try {
      t = zr("fs");
    } catch {}
    if (!t) return;
    [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "exists",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "lutimes",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "read",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "write",
      "writeFile",
      "writev",
    ]
      .filter((c) => !!t[c] && typeof t[c] == "function")
      .forEach((c) => {
        Xr(t, c, (f, s) => ({
          name: "fs." + c,
          args: s,
          cbIdx: s.length > 0 ? s.length - 1 : -1,
          target: f,
        }));
      });
    let o = t.realpath?.[l.symbol("OriginalDelegate")];
    o?.native &&
      ((t.realpath.native = o.native),
      Xr(t.realpath, "native", (c, f) => ({
        args: f,
        target: c,
        cbIdx: f.length > 0 ? f.length - 1 : -1,
        name: "fs.realpath.native",
      })));
  });
}
function oi(E) {
  E.__load_patch("node_util", (S, p, l) => {
    (l.patchOnProperties = Ws),
      (l.patchMethod = nr),
      (l.bindArguments = Vs),
      (l.patchMacroTask = Xr),
      Xs(!0);
  });
}
var er = "set",
  tr = "clear";
function ci(E) {
  oi(E),
    si(E),
    ii(E),
    E.__load_patch("node_timers", (S, p) => {
      let l = !1;
      try {
        let t = zr("timers");
        if (!(S.setTimeout === t.setTimeout) && !Jn) {
          let o = t.setTimeout;
          t.setTimeout = function () {
            return (l = !0), o.apply(this, arguments);
          };
          let c = S.setTimeout(() => {}, 100);
          clearTimeout(c), (t.setTimeout = o);
        }
        Jt(t, er, tr, "Timeout"),
          Jt(t, er, tr, "Interval"),
          Jt(t, er, tr, "Immediate");
      } catch {}
      Jn ||
        (l
          ? ((S[p.__symbol__("setTimeout")] = S.setTimeout),
            (S[p.__symbol__("setInterval")] = S.setInterval),
            (S[p.__symbol__("setImmediate")] = S.setImmediate))
          : (Jt(S, er, tr, "Timeout"),
            Jt(S, er, tr, "Interval"),
            Jt(S, er, tr, "Immediate")));
    }),
    E.__load_patch("nextTick", () => {
      Ys(process, "nextTick", (S, p) => ({
        name: "process.nextTick",
        args: p,
        cbIdx: p.length > 0 && typeof p[0] == "function" ? 0 : -1,
        target: process,
      }));
    }),
    E.__load_patch("handleUnhandledPromiseRejection", (S, p, l) => {
      (p[l.symbol("unhandledPromiseRejectionHandler")] =
        t("unhandledRejection")),
        (p[l.symbol("rejectionHandledHandler")] = t("rejectionHandled"));
      function t(a) {
        return function (o) {
          fa(process, a).forEach((f) => {
            a === "unhandledRejection"
              ? f.invoke(o.rejection, o.promise)
              : a === "rejectionHandled" && f.invoke(o.promise);
          });
        };
      }
    }),
    E.__load_patch("crypto", () => {
      let S;
      try {
        S = zr("crypto");
      } catch {}
      S &&
        ["randomBytes", "pbkdf2"].forEach((l) => {
          Xr(S, l, (t, a) => ({
            name: "crypto." + l,
            args: a,
            cbIdx:
              a.length > 0 && typeof a[a.length - 1] == "function"
                ? a.length - 1
                : -1,
            target: S,
          }));
        });
    }),
    E.__load_patch("console", (S, p) => {
      [
        "dir",
        "log",
        "info",
        "error",
        "warn",
        "assert",
        "debug",
        "timeEnd",
        "trace",
      ].forEach((t) => {
        let a = (console[p.__symbol__(t)] = console[t]);
        a &&
          (console[t] = function () {
            let o = Ps.call(arguments);
            return p.current === p.root
              ? a.apply(this, o)
              : p.root.run(a, this, o);
          });
      });
    }),
    E.__load_patch("queueMicrotask", (S, p, l) => {
      ai(S, l);
    });
}
function li() {
  let E = Js();
  return ci(E), Qs(E), $s(E), E;
}
li();
var ui = Object.getOwnPropertyNames,
  le = (E, S) =>
    function () {
      return S || (0, E[ui(E)[0]])((S = { exports: {} }).exports, S), S.exports;
    },
  br = le({
    "external/npm/node_modules/domino/lib/Event.js"(E, S) {
      "use strict";
      (S.exports = p),
        (p.CAPTURING_PHASE = 1),
        (p.AT_TARGET = 2),
        (p.BUBBLING_PHASE = 3);
      function p(l, t) {
        if (
          ((this.type = ""),
          (this.target = null),
          (this.currentTarget = null),
          (this.eventPhase = p.AT_TARGET),
          (this.bubbles = !1),
          (this.cancelable = !1),
          (this.isTrusted = !1),
          (this.defaultPrevented = !1),
          (this.timeStamp = Date.now()),
          (this._propagationStopped = !1),
          (this._immediatePropagationStopped = !1),
          (this._initialized = !0),
          (this._dispatching = !1),
          l && (this.type = l),
          t)
        )
          for (var a in t) this[a] = t[a];
      }
      p.prototype = Object.create(Object.prototype, {
        constructor: { value: p },
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
          value: function (t, a, o) {
            (this._initialized = !0),
              !this._dispatching &&
                ((this._propagationStopped = !1),
                (this._immediatePropagationStopped = !1),
                (this.defaultPrevented = !1),
                (this.isTrusted = !1),
                (this.target = null),
                (this.type = t),
                (this.bubbles = a),
                (this.cancelable = o));
          },
        },
      });
    },
  }),
  da = le({
    "external/npm/node_modules/domino/lib/UIEvent.js"(E, S) {
      "use strict";
      var p = br();
      S.exports = l;
      function l() {
        p.call(this), (this.view = null), (this.detail = 0);
      }
      l.prototype = Object.create(p.prototype, {
        constructor: { value: l },
        initUIEvent: {
          value: function (t, a, o, c, f) {
            this.initEvent(t, a, o), (this.view = c), (this.detail = f);
          },
        },
      });
    },
  }),
  pa = le({
    "external/npm/node_modules/domino/lib/MouseEvent.js"(E, S) {
      "use strict";
      var p = da();
      S.exports = l;
      function l() {
        p.call(this),
          (this.screenX = this.screenY = this.clientX = this.clientY = 0),
          (this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1),
          (this.button = 0),
          (this.buttons = 1),
          (this.relatedTarget = null);
      }
      l.prototype = Object.create(p.prototype, {
        constructor: { value: l },
        initMouseEvent: {
          value: function (t, a, o, c, f, s, b, m, N, I, H, R, J, B, T) {
            switch (
              (this.initEvent(t, a, o, c, f),
              (this.screenX = s),
              (this.screenY = b),
              (this.clientX = m),
              (this.clientY = N),
              (this.ctrlKey = I),
              (this.altKey = H),
              (this.shiftKey = R),
              (this.metaKey = J),
              (this.button = B),
              B)
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
            this.relatedTarget = T;
          },
        },
        getModifierState: {
          value: function (t) {
            switch (t) {
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
  yn = le({
    "external/npm/node_modules/domino/lib/DOMException.js"(E, S) {
      "use strict";
      S.exports = D;
      var p = 1,
        l = 3,
        t = 4,
        a = 5,
        o = 7,
        c = 8,
        f = 9,
        s = 11,
        b = 12,
        m = 13,
        N = 14,
        I = 15,
        H = 17,
        R = 18,
        J = 19,
        B = 20,
        T = 21,
        g = 22,
        k = 23,
        _ = 24,
        ae = 25,
        ne = [
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
        Q = [
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
        G = {
          INDEX_SIZE_ERR: p,
          DOMSTRING_SIZE_ERR: 2,
          HIERARCHY_REQUEST_ERR: l,
          WRONG_DOCUMENT_ERR: t,
          INVALID_CHARACTER_ERR: a,
          NO_DATA_ALLOWED_ERR: 6,
          NO_MODIFICATION_ALLOWED_ERR: o,
          NOT_FOUND_ERR: c,
          NOT_SUPPORTED_ERR: f,
          INUSE_ATTRIBUTE_ERR: 10,
          INVALID_STATE_ERR: s,
          SYNTAX_ERR: b,
          INVALID_MODIFICATION_ERR: m,
          NAMESPACE_ERR: N,
          INVALID_ACCESS_ERR: I,
          VALIDATION_ERR: 16,
          TYPE_MISMATCH_ERR: H,
          SECURITY_ERR: R,
          NETWORK_ERR: J,
          ABORT_ERR: B,
          URL_MISMATCH_ERR: T,
          QUOTA_EXCEEDED_ERR: g,
          TIMEOUT_ERR: k,
          INVALID_NODE_TYPE_ERR: _,
          DATA_CLONE_ERR: ae,
        };
      function D(u) {
        Error.call(this),
          Error.captureStackTrace(this, this.constructor),
          (this.code = u),
          (this.message = Q[u]),
          (this.name = ne[u]);
      }
      D.prototype.__proto__ = Error.prototype;
      for (Z in G)
        (P = { value: G[Z] }),
          Object.defineProperty(D, Z, P),
          Object.defineProperty(D.prototype, Z, P);
      var P, Z;
    },
  }),
  Nn = le({
    "external/npm/node_modules/domino/lib/config.js"(E) {
      E.isApiWritable = !globalThis.__domino_frozen__;
    },
  }),
  Be = le({
    "external/npm/node_modules/domino/lib/utils.js"(E) {
      "use strict";
      var S = yn(),
        p = S,
        l = Nn().isApiWritable;
      (E.NAMESPACE = {
        HTML: "http://www.w3.org/1999/xhtml",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink",
      }),
        (E.IndexSizeError = function () {
          throw new S(p.INDEX_SIZE_ERR);
        }),
        (E.HierarchyRequestError = function () {
          throw new S(p.HIERARCHY_REQUEST_ERR);
        }),
        (E.WrongDocumentError = function () {
          throw new S(p.WRONG_DOCUMENT_ERR);
        }),
        (E.InvalidCharacterError = function () {
          throw new S(p.INVALID_CHARACTER_ERR);
        }),
        (E.NoModificationAllowedError = function () {
          throw new S(p.NO_MODIFICATION_ALLOWED_ERR);
        }),
        (E.NotFoundError = function () {
          throw new S(p.NOT_FOUND_ERR);
        }),
        (E.NotSupportedError = function () {
          throw new S(p.NOT_SUPPORTED_ERR);
        }),
        (E.InvalidStateError = function () {
          throw new S(p.INVALID_STATE_ERR);
        }),
        (E.SyntaxError = function () {
          throw new S(p.SYNTAX_ERR);
        }),
        (E.InvalidModificationError = function () {
          throw new S(p.INVALID_MODIFICATION_ERR);
        }),
        (E.NamespaceError = function () {
          throw new S(p.NAMESPACE_ERR);
        }),
        (E.InvalidAccessError = function () {
          throw new S(p.INVALID_ACCESS_ERR);
        }),
        (E.TypeMismatchError = function () {
          throw new S(p.TYPE_MISMATCH_ERR);
        }),
        (E.SecurityError = function () {
          throw new S(p.SECURITY_ERR);
        }),
        (E.NetworkError = function () {
          throw new S(p.NETWORK_ERR);
        }),
        (E.AbortError = function () {
          throw new S(p.ABORT_ERR);
        }),
        (E.UrlMismatchError = function () {
          throw new S(p.URL_MISMATCH_ERR);
        }),
        (E.QuotaExceededError = function () {
          throw new S(p.QUOTA_EXCEEDED_ERR);
        }),
        (E.TimeoutError = function () {
          throw new S(p.TIMEOUT_ERR);
        }),
        (E.InvalidNodeTypeError = function () {
          throw new S(p.INVALID_NODE_TYPE_ERR);
        }),
        (E.DataCloneError = function () {
          throw new S(p.DATA_CLONE_ERR);
        }),
        (E.nyi = function () {
          throw new Error("NotYetImplemented");
        }),
        (E.shouldOverride = function () {
          throw new Error(
            "Abstract function; should be overriding in subclass.",
          );
        }),
        (E.assert = function (t, a) {
          if (!t)
            throw new Error(
              "Assertion failed: " +
                (a || "") +
                `
` +
                new Error().stack,
            );
        }),
        (E.expose = function (t, a) {
          for (var o in t)
            Object.defineProperty(a.prototype, o, { value: t[o], writable: l });
        }),
        (E.merge = function (t, a) {
          for (var o in a) t[o] = a[o];
        }),
        (E.documentOrder = function (t, a) {
          return 3 - (t.compareDocumentPosition(a) & 6);
        }),
        (E.toASCIILowerCase = function (t) {
          return t.replace(/[A-Z]+/g, function (a) {
            return a.toLowerCase();
          });
        }),
        (E.toASCIIUpperCase = function (t) {
          return t.replace(/[a-z]+/g, function (a) {
            return a.toUpperCase();
          });
        });
    },
  }),
  ma = le({
    "external/npm/node_modules/domino/lib/EventTarget.js"(E, S) {
      "use strict";
      var p = br(),
        l = pa(),
        t = Be();
      S.exports = a;
      function a() {}
      a.prototype = {
        addEventListener: function (c, f, s) {
          if (f) {
            s === void 0 && (s = !1),
              this._listeners || (this._listeners = Object.create(null)),
              this._listeners[c] || (this._listeners[c] = []);
            for (var b = this._listeners[c], m = 0, N = b.length; m < N; m++) {
              var I = b[m];
              if (I.listener === f && I.capture === s) return;
            }
            var H = { listener: f, capture: s };
            typeof f == "function" && (H.f = f), b.push(H);
          }
        },
        removeEventListener: function (c, f, s) {
          if ((s === void 0 && (s = !1), this._listeners)) {
            var b = this._listeners[c];
            if (b)
              for (var m = 0, N = b.length; m < N; m++) {
                var I = b[m];
                if (I.listener === f && I.capture === s) {
                  b.length === 1
                    ? (this._listeners[c] = void 0)
                    : b.splice(m, 1);
                  return;
                }
              }
          }
        },
        dispatchEvent: function (c) {
          return this._dispatchEvent(c, !1);
        },
        _dispatchEvent: function (c, f) {
          typeof f != "boolean" && (f = !1);
          function s(R, J) {
            var B = J.type,
              T = J.eventPhase;
            if (
              ((J.currentTarget = R),
              T !== p.CAPTURING_PHASE && R._handlers && R._handlers[B])
            ) {
              var g = R._handlers[B],
                k;
              if (typeof g == "function") k = g.call(J.currentTarget, J);
              else {
                var _ = g.handleEvent;
                if (typeof _ != "function")
                  throw new TypeError(
                    "handleEvent property of event handler object isnot a function.",
                  );
                k = _.call(g, J);
              }
              switch (J.type) {
                case "mouseover":
                  k === !0 && J.preventDefault();
                  break;
                case "beforeunload":
                default:
                  k === !1 && J.preventDefault();
                  break;
              }
            }
            var ae = R._listeners && R._listeners[B];
            if (ae) {
              ae = ae.slice();
              for (var ne = 0, Q = ae.length; ne < Q; ne++) {
                if (J._immediatePropagationStopped) return;
                var G = ae[ne];
                if (
                  !(
                    (T === p.CAPTURING_PHASE && !G.capture) ||
                    (T === p.BUBBLING_PHASE && G.capture)
                  )
                )
                  if (G.f) G.f.call(J.currentTarget, J);
                  else {
                    var D = G.listener.handleEvent;
                    if (typeof D != "function")
                      throw new TypeError(
                        "handleEvent property of event listener object is not a function.",
                      );
                    D.call(G.listener, J);
                  }
              }
            }
          }
          (!c._initialized || c._dispatching) && t.InvalidStateError(),
            (c.isTrusted = f),
            (c._dispatching = !0),
            (c.target = this);
          for (var b = [], m = this.parentNode; m; m = m.parentNode) b.push(m);
          c.eventPhase = p.CAPTURING_PHASE;
          for (
            var N = b.length - 1;
            N >= 0 && (s(b[N], c), !c._propagationStopped);
            N--
          );
          if (
            (c._propagationStopped ||
              ((c.eventPhase = p.AT_TARGET), s(this, c)),
            c.bubbles && !c._propagationStopped)
          ) {
            c.eventPhase = p.BUBBLING_PHASE;
            for (
              var I = 0, H = b.length;
              I < H && (s(b[I], c), !c._propagationStopped);
              I++
            );
          }
          if (
            ((c._dispatching = !1),
            (c.eventPhase = p.AT_TARGET),
            (c.currentTarget = null),
            f && !c.defaultPrevented && c instanceof l)
          )
            switch (c.type) {
              case "mousedown":
                this._armed = { x: c.clientX, y: c.clientY, t: c.timeStamp };
                break;
              case "mouseout":
              case "mouseover":
                this._armed = null;
                break;
              case "mouseup":
                this._isClick(c) && this._doClick(c), (this._armed = null);
                break;
            }
          return !c.defaultPrevented;
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
            for (var c = this; c && !c._post_click_activation_steps; )
              c = c.parentNode;
            c &&
              c._pre_click_activation_steps &&
              c._pre_click_activation_steps();
            var f = this.ownerDocument.createEvent("MouseEvent");
            f.initMouseEvent(
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
            var s = this._dispatchEvent(f, !0);
            c &&
              (s
                ? c._post_click_activation_steps &&
                  c._post_click_activation_steps(f)
                : c._cancelled_activation_steps &&
                  c._cancelled_activation_steps());
          }
        },
        _setEventHandler: function (c, f) {
          this._handlers || (this._handlers = Object.create(null)),
            (this._handlers[c] = f);
        },
        _getEventHandler: function (c) {
          return (this._handlers && this._handlers[c]) || null;
        },
      };
    },
  }),
  ga = le({
    "external/npm/node_modules/domino/lib/LinkedList.js"(E, S) {
      "use strict";
      var p = Be(),
        l = (S.exports = {
          valid: function (t) {
            return (
              p.assert(t, "list falsy"),
              p.assert(t._previousSibling, "previous falsy"),
              p.assert(t._nextSibling, "next falsy"),
              !0
            );
          },
          insertBefore: function (t, a) {
            p.assert(l.valid(t) && l.valid(a));
            var o = t,
              c = t._previousSibling,
              f = a,
              s = a._previousSibling;
            (o._previousSibling = s),
              (c._nextSibling = f),
              (s._nextSibling = o),
              (f._previousSibling = c),
              p.assert(l.valid(t) && l.valid(a));
          },
          replace: function (t, a) {
            p.assert(l.valid(t) && (a === null || l.valid(a))),
              a !== null && l.insertBefore(a, t),
              l.remove(t),
              p.assert(l.valid(t) && (a === null || l.valid(a)));
          },
          remove: function (t) {
            p.assert(l.valid(t));
            var a = t._previousSibling;
            if (a !== t) {
              var o = t._nextSibling;
              (a._nextSibling = o),
                (o._previousSibling = a),
                (t._previousSibling = t._nextSibling = t),
                p.assert(l.valid(t));
            }
          },
        });
    },
  }),
  _a = le({
    "external/npm/node_modules/domino/lib/NodeUtils.js"(E, S) {
      "use strict";
      S.exports = {
        serializeOne: J,
        ɵescapeMatchingClosingTag: N,
        ɵescapeClosingCommentTag: H,
        ɵescapeProcessingInstructionContent: R,
      };
      var p = Be(),
        l = p.NAMESPACE,
        t = {
          STYLE: !0,
          SCRIPT: !0,
          XMP: !0,
          IFRAME: !0,
          NOEMBED: !0,
          NOFRAMES: !0,
          PLAINTEXT: !0,
        },
        a = {
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
        c = /[&<>\u00A0]/g,
        f = /[&"<>\u00A0]/g;
      function s(B) {
        return c.test(B)
          ? B.replace(c, (T) => {
              switch (T) {
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
          : B;
      }
      function b(B) {
        return f.test(B)
          ? B.replace(f, (T) => {
              switch (T) {
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
          : B;
      }
      function m(B) {
        var T = B.namespaceURI;
        return T
          ? T === l.XML
            ? "xml:" + B.localName
            : T === l.XLINK
              ? "xlink:" + B.localName
              : T === l.XMLNS
                ? B.localName === "xmlns"
                  ? "xmlns"
                  : "xmlns:" + B.localName
                : B.name
          : B.localName;
      }
      function N(B, T) {
        let g = "</" + T;
        if (!B.toLowerCase().includes(g)) return B;
        let k = [...B],
          _ = B.matchAll(new RegExp(g, "ig"));
        for (let ae of _) k[ae.index] = "&lt;";
        return k.join("");
      }
      var I = /--!?>/;
      function H(B) {
        return I.test(B) ? B.replace(/(--\!?)>/g, "$1&gt;") : B;
      }
      function R(B) {
        return B.includes(">") ? B.replaceAll(">", "&gt;") : B;
      }
      function J(B, T) {
        var g = "";
        switch (B.nodeType) {
          case 1:
            var k = B.namespaceURI,
              _ = k === l.HTML,
              ae = _ || k === l.SVG || k === l.MATHML ? B.localName : B.tagName;
            g += "<" + ae;
            for (var ne = 0, Q = B._numattrs; ne < Q; ne++) {
              var G = B._attr(ne);
              (g += " " + m(G)),
                G.value !== void 0 && (g += '="' + b(G.value) + '"');
            }
            if (((g += ">"), !(_ && a[ae]))) {
              var D = B.serialize();
              t[ae.toUpperCase()] && (D = N(D, ae)),
                _ &&
                  o[ae] &&
                  D.charAt(0) ===
                    `
` &&
                  (g += `
`),
                (g += D),
                (g += "</" + ae + ">");
            }
            break;
          case 3:
          case 4:
            var P;
            T.nodeType === 1 && T.namespaceURI === l.HTML
              ? (P = T.tagName)
              : (P = ""),
              t[P] || (P === "NOSCRIPT" && T.ownerDocument._scripting_enabled)
                ? (g += B.data)
                : (g += s(B.data));
            break;
          case 8:
            g += "<!--" + H(B.data) + "-->";
            break;
          case 7:
            let Z = R(B.data);
            g += "<?" + B.target + " " + Z + "?>";
            break;
          case 10:
            (g += "<!DOCTYPE " + B.name), (g += ">");
            break;
          default:
            p.InvalidStateError();
        }
        return g;
      }
    },
  }),
  Ve = le({
    "external/npm/node_modules/domino/lib/Node.js"(E, S) {
      "use strict";
      S.exports = o;
      var p = ma(),
        l = ga(),
        t = _a(),
        a = Be();
      function o() {
        p.call(this),
          (this.parentNode = null),
          (this._nextSibling = this._previousSibling = this),
          (this._index = void 0);
      }
      var c = (o.ELEMENT_NODE = 1),
        f = (o.ATTRIBUTE_NODE = 2),
        s = (o.TEXT_NODE = 3),
        b = (o.CDATA_SECTION_NODE = 4),
        m = (o.ENTITY_REFERENCE_NODE = 5),
        N = (o.ENTITY_NODE = 6),
        I = (o.PROCESSING_INSTRUCTION_NODE = 7),
        H = (o.COMMENT_NODE = 8),
        R = (o.DOCUMENT_NODE = 9),
        J = (o.DOCUMENT_TYPE_NODE = 10),
        B = (o.DOCUMENT_FRAGMENT_NODE = 11),
        T = (o.NOTATION_NODE = 12),
        g = (o.DOCUMENT_POSITION_DISCONNECTED = 1),
        k = (o.DOCUMENT_POSITION_PRECEDING = 2),
        _ = (o.DOCUMENT_POSITION_FOLLOWING = 4),
        ae = (o.DOCUMENT_POSITION_CONTAINS = 8),
        ne = (o.DOCUMENT_POSITION_CONTAINED_BY = 16),
        Q = (o.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32);
      o.prototype = Object.create(p.prototype, {
        baseURI: { get: a.nyi },
        parentElement: {
          get: function () {
            return this.parentNode && this.parentNode.nodeType === c
              ? this.parentNode
              : null;
          },
        },
        hasChildNodes: { value: a.shouldOverride },
        firstChild: { get: a.shouldOverride },
        lastChild: { get: a.shouldOverride },
        isConnected: {
          get: function () {
            let G = this;
            for (; G != null; ) {
              if (G.nodeType === o.DOCUMENT_NODE) return !0;
              (G = G.parentNode),
                G != null &&
                  G.nodeType === o.DOCUMENT_FRAGMENT_NODE &&
                  (G = G.host);
            }
            return !1;
          },
        },
        previousSibling: {
          get: function () {
            var G = this.parentNode;
            return !G || this === G.firstChild ? null : this._previousSibling;
          },
        },
        nextSibling: {
          get: function () {
            var G = this.parentNode,
              D = this._nextSibling;
            return !G || D === G.firstChild ? null : D;
          },
        },
        textContent: {
          get: function () {
            return null;
          },
          set: function (G) {},
        },
        innerText: {
          get: function () {
            return null;
          },
          set: function (G) {},
        },
        _countChildrenOfType: {
          value: function (G) {
            for (var D = 0, P = this.firstChild; P !== null; P = P.nextSibling)
              P.nodeType === G && D++;
            return D;
          },
        },
        _ensureInsertValid: {
          value: function (D, P, Z) {
            var u = this,
              i,
              n;
            if (!D.nodeType) throw new TypeError("not a node");
            switch (u.nodeType) {
              case R:
              case B:
              case c:
                break;
              default:
                a.HierarchyRequestError();
            }
            switch (
              (D.isAncestor(u) && a.HierarchyRequestError(),
              (P !== null || !Z) && P.parentNode !== u && a.NotFoundError(),
              D.nodeType)
            ) {
              case B:
              case J:
              case c:
              case s:
              case I:
              case H:
                break;
              default:
                a.HierarchyRequestError();
            }
            if (u.nodeType === R)
              switch (D.nodeType) {
                case s:
                  a.HierarchyRequestError();
                  break;
                case B:
                  switch (
                    (D._countChildrenOfType(s) > 0 && a.HierarchyRequestError(),
                    D._countChildrenOfType(c))
                  ) {
                    case 0:
                      break;
                    case 1:
                      if (P !== null)
                        for (
                          Z && P.nodeType === J && a.HierarchyRequestError(),
                            n = P.nextSibling;
                          n !== null;
                          n = n.nextSibling
                        )
                          n.nodeType === J && a.HierarchyRequestError();
                      (i = u._countChildrenOfType(c)),
                        Z
                          ? i > 0 && a.HierarchyRequestError()
                          : (i > 1 || (i === 1 && P.nodeType !== c)) &&
                            a.HierarchyRequestError();
                      break;
                    default:
                      a.HierarchyRequestError();
                  }
                  break;
                case c:
                  if (P !== null)
                    for (
                      Z && P.nodeType === J && a.HierarchyRequestError(),
                        n = P.nextSibling;
                      n !== null;
                      n = n.nextSibling
                    )
                      n.nodeType === J && a.HierarchyRequestError();
                  (i = u._countChildrenOfType(c)),
                    Z
                      ? i > 0 && a.HierarchyRequestError()
                      : (i > 1 || (i === 1 && P.nodeType !== c)) &&
                        a.HierarchyRequestError();
                  break;
                case J:
                  if (P === null)
                    u._countChildrenOfType(c) && a.HierarchyRequestError();
                  else
                    for (
                      n = u.firstChild;
                      n !== null && n !== P;
                      n = n.nextSibling
                    )
                      n.nodeType === c && a.HierarchyRequestError();
                  (i = u._countChildrenOfType(J)),
                    Z
                      ? i > 0 && a.HierarchyRequestError()
                      : (i > 1 || (i === 1 && P.nodeType !== J)) &&
                        a.HierarchyRequestError();
                  break;
              }
            else D.nodeType === J && a.HierarchyRequestError();
          },
        },
        insertBefore: {
          value: function (D, P) {
            var Z = this;
            Z._ensureInsertValid(D, P, !0);
            var u = P;
            return (
              u === D && (u = D.nextSibling),
              Z.doc.adoptNode(D),
              D._insertOrReplace(Z, u, !1),
              D
            );
          },
        },
        appendChild: {
          value: function (G) {
            return this.insertBefore(G, null);
          },
        },
        _appendChild: {
          value: function (G) {
            G._insertOrReplace(this, null, !1);
          },
        },
        removeChild: {
          value: function (D) {
            var P = this;
            if (!D.nodeType) throw new TypeError("not a node");
            return D.parentNode !== P && a.NotFoundError(), D.remove(), D;
          },
        },
        replaceChild: {
          value: function (D, P) {
            var Z = this;
            return (
              Z._ensureInsertValid(D, P, !1),
              D.doc !== Z.doc && Z.doc.adoptNode(D),
              D._insertOrReplace(Z, P, !0),
              P
            );
          },
        },
        contains: {
          value: function (D) {
            return D === null
              ? !1
              : this === D
                ? !0
                : (this.compareDocumentPosition(D) & ne) !== 0;
          },
        },
        compareDocumentPosition: {
          value: function (D) {
            if (this === D) return 0;
            if (this.doc !== D.doc || this.rooted !== D.rooted) return g + Q;
            for (var P = [], Z = [], u = this; u !== null; u = u.parentNode)
              P.push(u);
            for (u = D; u !== null; u = u.parentNode) Z.push(u);
            if ((P.reverse(), Z.reverse(), P[0] !== Z[0])) return g + Q;
            u = Math.min(P.length, Z.length);
            for (var i = 1; i < u; i++)
              if (P[i] !== Z[i]) return P[i].index < Z[i].index ? _ : k;
            return P.length < Z.length ? _ + ne : k + ae;
          },
        },
        isSameNode: {
          value: function (D) {
            return this === D;
          },
        },
        isEqualNode: {
          value: function (D) {
            if (!D || D.nodeType !== this.nodeType || !this.isEqual(D))
              return !1;
            for (
              var P = this.firstChild, Z = D.firstChild;
              P && Z;
              P = P.nextSibling, Z = Z.nextSibling
            )
              if (!P.isEqualNode(Z)) return !1;
            return P === null && Z === null;
          },
        },
        cloneNode: {
          value: function (G) {
            var D = this.clone();
            if (G)
              for (var P = this.firstChild; P !== null; P = P.nextSibling)
                D._appendChild(P.cloneNode(!0));
            return D;
          },
        },
        lookupPrefix: {
          value: function (D) {
            var P;
            if (D === "" || D === null || D === void 0) return null;
            switch (this.nodeType) {
              case c:
                return this._lookupNamespacePrefix(D, this);
              case R:
                return (P = this.documentElement), P ? P.lookupPrefix(D) : null;
              case N:
              case T:
              case B:
              case J:
                return null;
              case f:
                return (P = this.ownerElement), P ? P.lookupPrefix(D) : null;
              default:
                return (P = this.parentElement), P ? P.lookupPrefix(D) : null;
            }
          },
        },
        lookupNamespaceURI: {
          value: function (D) {
            (D === "" || D === void 0) && (D = null);
            var P;
            switch (this.nodeType) {
              case c:
                return a.shouldOverride();
              case R:
                return (
                  (P = this.documentElement), P ? P.lookupNamespaceURI(D) : null
                );
              case N:
              case T:
              case J:
              case B:
                return null;
              case f:
                return (
                  (P = this.ownerElement), P ? P.lookupNamespaceURI(D) : null
                );
              default:
                return (
                  (P = this.parentElement), P ? P.lookupNamespaceURI(D) : null
                );
            }
          },
        },
        isDefaultNamespace: {
          value: function (D) {
            (D === "" || D === void 0) && (D = null);
            var P = this.lookupNamespaceURI(null);
            return P === D;
          },
        },
        index: {
          get: function () {
            var G = this.parentNode;
            if (this === G.firstChild) return 0;
            var D = G.childNodes;
            if (this._index === void 0 || D[this._index] !== this) {
              for (var P = 0; P < D.length; P++) D[P]._index = P;
              a.assert(D[this._index] === this);
            }
            return this._index;
          },
        },
        isAncestor: {
          value: function (G) {
            if (this.doc !== G.doc || this.rooted !== G.rooted) return !1;
            for (var D = G; D; D = D.parentNode) if (D === this) return !0;
            return !1;
          },
        },
        ensureSameDoc: {
          value: function (G) {
            G.ownerDocument === null
              ? (G.ownerDocument = this.doc)
              : G.ownerDocument !== this.doc && a.WrongDocumentError();
          },
        },
        removeChildren: { value: a.shouldOverride },
        _insertOrReplace: {
          value: function (D, P, Z) {
            var u = this,
              i,
              n;
            if (
              (u.nodeType === B && u.rooted && a.HierarchyRequestError(),
              D._childNodes &&
                ((i = P === null ? D._childNodes.length : P.index),
                u.parentNode === D))
            ) {
              var d = u.index;
              d < i && i--;
            }
            Z && (P.rooted && P.doc.mutateRemove(P), (P.parentNode = null));
            var h = P;
            h === null && (h = D.firstChild);
            var v = u.rooted && D.rooted;
            if (u.nodeType === B) {
              for (
                var C = [0, Z ? 1 : 0], j, re = u.firstChild;
                re !== null;
                re = j
              )
                (j = re.nextSibling), C.push(re), (re.parentNode = D);
              var w = C.length;
              if (
                (Z
                  ? l.replace(h, w > 2 ? C[2] : null)
                  : w > 2 && h !== null && l.insertBefore(C[2], h),
                D._childNodes)
              )
                for (
                  C[0] = P === null ? D._childNodes.length : P._index,
                    D._childNodes.splice.apply(D._childNodes, C),
                    n = 2;
                  n < w;
                  n++
                )
                  C[n]._index = C[0] + (n - 2);
              else
                D._firstChild === P &&
                  (w > 2
                    ? (D._firstChild = C[2])
                    : Z && (D._firstChild = null));
              if (
                (u._childNodes
                  ? (u._childNodes.length = 0)
                  : (u._firstChild = null),
                D.rooted)
              )
                for (D.modify(), n = 2; n < w; n++) D.doc.mutateInsert(C[n]);
            } else {
              if (P === u) return;
              v ? u._remove() : u.parentNode && u.remove(),
                (u.parentNode = D),
                Z
                  ? (l.replace(h, u),
                    D._childNodes
                      ? ((u._index = i), (D._childNodes[i] = u))
                      : D._firstChild === P && (D._firstChild = u))
                  : (h !== null && l.insertBefore(u, h),
                    D._childNodes
                      ? ((u._index = i), D._childNodes.splice(i, 0, u))
                      : D._firstChild === P && (D._firstChild = u)),
                v
                  ? (D.modify(), D.doc.mutateMove(u))
                  : D.rooted && (D.modify(), D.doc.mutateInsert(u));
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
                var G = ++this.doc.modclock, D = this;
                D;
                D = D.parentElement
              )
                D._lastModTime && (D._lastModTime = G);
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
            for (var G, D = this.firstChild; D !== null; D = G)
              if (
                ((G = D.nextSibling),
                D.normalize && D.normalize(),
                D.nodeType === o.TEXT_NODE)
              ) {
                if (D.nodeValue === "") {
                  this.removeChild(D);
                  continue;
                }
                var P = D.previousSibling;
                P !== null &&
                  P.nodeType === o.TEXT_NODE &&
                  (P.appendData(D.nodeValue), this.removeChild(D));
              }
          },
        },
        serialize: {
          value: function () {
            if (this._innerHTML) return this._innerHTML;
            for (var G = "", D = this.firstChild; D !== null; D = D.nextSibling)
              G += t.serializeOne(D, this);
            return G;
          },
        },
        outerHTML: {
          get: function () {
            return t.serializeOne(this, { nodeType: 0 });
          },
          set: a.nyi,
        },
        ELEMENT_NODE: { value: c },
        ATTRIBUTE_NODE: { value: f },
        TEXT_NODE: { value: s },
        CDATA_SECTION_NODE: { value: b },
        ENTITY_REFERENCE_NODE: { value: m },
        ENTITY_NODE: { value: N },
        PROCESSING_INSTRUCTION_NODE: { value: I },
        COMMENT_NODE: { value: H },
        DOCUMENT_NODE: { value: R },
        DOCUMENT_TYPE_NODE: { value: J },
        DOCUMENT_FRAGMENT_NODE: { value: B },
        NOTATION_NODE: { value: T },
        DOCUMENT_POSITION_DISCONNECTED: { value: g },
        DOCUMENT_POSITION_PRECEDING: { value: k },
        DOCUMENT_POSITION_FOLLOWING: { value: _ },
        DOCUMENT_POSITION_CONTAINS: { value: ae },
        DOCUMENT_POSITION_CONTAINED_BY: { value: ne },
        DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: { value: Q },
      });
    },
  }),
  fi = le({
    "external/npm/node_modules/domino/lib/NodeList.es6.js"(E, S) {
      "use strict";
      S.exports = class extends Array {
        constructor(l) {
          if ((super((l && l.length) || 0), l)) for (var t in l) this[t] = l[t];
        }
        item(l) {
          return this[l] || null;
        }
      };
    },
  }),
  hi = le({
    "external/npm/node_modules/domino/lib/NodeList.es5.js"(E, S) {
      "use strict";
      function p(t) {
        return this[t] || null;
      }
      function l(t) {
        return t || (t = []), (t.item = p), t;
      }
      S.exports = l;
    },
  }),
  ar = le({
    "external/npm/node_modules/domino/lib/NodeList.js"(E, S) {
      "use strict";
      var p;
      try {
        p = fi();
      } catch {
        p = hi();
      }
      S.exports = p;
    },
  }),
  wn = le({
    "external/npm/node_modules/domino/lib/ContainerNode.js"(E, S) {
      "use strict";
      S.exports = t;
      var p = Ve(),
        l = ar();
      function t() {
        p.call(this), (this._firstChild = this._childNodes = null);
      }
      t.prototype = Object.create(p.prototype, {
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
            var a = this._childNodes,
              o;
            return a
              ? a.length === 0
                ? null
                : a[a.length - 1]
              : ((o = this._firstChild),
                o === null ? null : o._previousSibling);
          },
        },
        _ensureChildNodes: {
          value: function () {
            if (!this._childNodes) {
              var a = this._firstChild,
                o = a,
                c = (this._childNodes = new l());
              if (a)
                do c.push(o), (o = o._nextSibling);
                while (o !== a);
              this._firstChild = null;
            }
          },
        },
        removeChildren: {
          value: function () {
            for (
              var o = this.rooted ? this.ownerDocument : null,
                c = this.firstChild,
                f;
              c !== null;

            )
              (f = c),
                (c = f.nextSibling),
                o && o.mutateRemove(f),
                (f.parentNode = null);
            this._childNodes
              ? (this._childNodes.length = 0)
              : (this._firstChild = null),
              this.modify();
          },
        },
      });
    },
  }),
  Sn = le({
    "external/npm/node_modules/domino/lib/xmlnames.js"(E) {
      "use strict";
      (E.isValidName = R), (E.isValidQName = J);
      var S = /^[_:A-Za-z][-.:\w]+$/,
        p = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/,
        l =
          "_A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        t =
          "-._A-Za-z0-9\xB7\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD",
        a = "[" + l + "][" + t + "]*",
        o = l + ":",
        c = t + ":",
        f = new RegExp("^[" + o + "][" + c + "]*$"),
        s = new RegExp("^(" + a + "|" + a + ":" + a + ")$"),
        b = /[\uD800-\uDB7F\uDC00-\uDFFF]/,
        m = /[\uD800-\uDB7F\uDC00-\uDFFF]/g,
        N = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
      (l += "\uD800-\u{EFC00}-\uDFFF"),
        (t += "\uD800-\u{EFC00}-\uDFFF"),
        (a = "[" + l + "][" + t + "]*"),
        (o = l + ":"),
        (c = t + ":");
      var I = new RegExp("^[" + o + "][" + c + "]*$"),
        H = new RegExp("^(" + a + "|" + a + ":" + a + ")$");
      function R(B) {
        if (S.test(B) || f.test(B)) return !0;
        if (!b.test(B) || !I.test(B)) return !1;
        var T = B.match(m),
          g = B.match(N);
        return g !== null && 2 * g.length === T.length;
      }
      function J(B) {
        if (p.test(B) || s.test(B)) return !0;
        if (!b.test(B) || !H.test(B)) return !1;
        var T = B.match(m),
          g = B.match(N);
        return g !== null && 2 * g.length === T.length;
      }
    },
  }),
  ba = le({
    "external/npm/node_modules/domino/lib/attributes.js"(E) {
      "use strict";
      var S = Be();
      E.property = function (l) {
        if (Array.isArray(l.type)) {
          var t = Object.create(null);
          l.type.forEach(function (c) {
            t[c.value || c] = c.alias || c;
          });
          var a = l.missing;
          a === void 0 && (a = null);
          var o = l.invalid;
          return (
            o === void 0 && (o = a),
            {
              get: function () {
                var c = this._getattr(l.name);
                return c === null
                  ? a
                  : ((c = t[c.toLowerCase()]),
                    c !== void 0 ? c : o !== null ? o : c);
              },
              set: function (c) {
                this._setattr(l.name, c);
              },
            }
          );
        } else {
          if (l.type === Boolean)
            return {
              get: function () {
                return this.hasAttribute(l.name);
              },
              set: function (c) {
                c ? this._setattr(l.name, "") : this.removeAttribute(l.name);
              },
            };
          if (
            l.type === Number ||
            l.type === "long" ||
            l.type === "unsigned long" ||
            l.type === "limited unsigned long with fallback"
          )
            return p(l);
          if (!l.type || l.type === String)
            return {
              get: function () {
                return this._getattr(l.name) || "";
              },
              set: function (c) {
                l.treatNullAsEmptyString && c === null && (c = ""),
                  this._setattr(l.name, c);
              },
            };
          if (typeof l.type == "function") return l.type(l.name, l);
        }
        throw new Error("Invalid attribute definition");
      };
      function p(l) {
        var t;
        typeof l.default == "function"
          ? (t = l.default)
          : typeof l.default == "number"
            ? (t = function () {
                return l.default;
              })
            : (t = function () {
                S.assert(!1, typeof l.default);
              });
        var a = l.type === "unsigned long",
          o = l.type === "long",
          c = l.type === "limited unsigned long with fallback",
          f = l.min,
          s = l.max,
          b = l.setmin;
        return (
          f === void 0 && (a && (f = 0), o && (f = -2147483648), c && (f = 1)),
          s === void 0 && (a || o || c) && (s = 2147483647),
          {
            get: function () {
              var m = this._getattr(l.name),
                N = l.float ? parseFloat(m) : parseInt(m, 10);
              if (
                m === null ||
                !isFinite(N) ||
                (f !== void 0 && N < f) ||
                (s !== void 0 && N > s)
              )
                return t.call(this);
              if (a || o || c) {
                if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test(m)) return t.call(this);
                N = N | 0;
              }
              return N;
            },
            set: function (m) {
              l.float || (m = Math.floor(m)),
                b !== void 0 &&
                  m < b &&
                  S.IndexSizeError(l.name + " set to " + m),
                a
                  ? (m = m < 0 || m > 2147483647 ? t.call(this) : m | 0)
                  : c
                    ? (m = m < 1 || m > 2147483647 ? t.call(this) : m | 0)
                    : o &&
                      (m =
                        m < -2147483648 || m > 2147483647
                          ? t.call(this)
                          : m | 0),
                this._setattr(l.name, String(m));
            },
          }
        );
      }
      E.registerChangeHandler = function (l, t, a) {
        var o = l.prototype;
        Object.prototype.hasOwnProperty.call(o, "_attributeChangeHandlers") ||
          (o._attributeChangeHandlers = Object.create(
            o._attributeChangeHandlers || null,
          )),
          (o._attributeChangeHandlers[t] = a);
      };
    },
  }),
  di = le({
    "external/npm/node_modules/domino/lib/FilteredElementList.js"(E, S) {
      "use strict";
      S.exports = l;
      var p = Ve();
      function l(t, a) {
        (this.root = t),
          (this.filter = a),
          (this.lastModTime = t.lastModTime),
          (this.done = !1),
          (this.cache = []),
          this.traverse();
      }
      l.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return (
              this.checkcache(), this.done || this.traverse(), this.cache.length
            );
          },
        },
        item: {
          value: function (t) {
            return (
              this.checkcache(),
              !this.done && t >= this.cache.length && this.traverse(),
              this.cache[t]
            );
          },
        },
        checkcache: {
          value: function () {
            if (this.lastModTime !== this.root.lastModTime) {
              for (var t = this.cache.length - 1; t >= 0; t--) this[t] = void 0;
              (this.cache.length = 0),
                (this.done = !1),
                (this.lastModTime = this.root.lastModTime);
            }
          },
        },
        traverse: {
          value: function (t) {
            t !== void 0 && t++;
            for (var a; (a = this.next()) !== null; )
              if (
                ((this[this.cache.length] = a),
                this.cache.push(a),
                t && this.cache.length === t)
              )
                return;
            this.done = !0;
          },
        },
        next: {
          value: function () {
            var t =
                this.cache.length === 0
                  ? this.root
                  : this.cache[this.cache.length - 1],
              a;
            for (
              t.nodeType === p.DOCUMENT_NODE
                ? (a = t.documentElement)
                : (a = t.nextElement(this.root));
              a;

            ) {
              if (this.filter(a)) return a;
              a = a.nextElement(this.root);
            }
            return null;
          },
        },
      });
    },
  }),
  Ea = le({
    "external/npm/node_modules/domino/lib/DOMTokenList.js"(E, S) {
      "use strict";
      var p = Be();
      S.exports = l;
      function l(f, s) {
        (this._getString = f),
          (this._setString = s),
          (this._length = 0),
          (this._lastStringValue = ""),
          this._update();
      }
      Object.defineProperties(l.prototype, {
        length: {
          get: function () {
            return this._length;
          },
        },
        item: {
          value: function (f) {
            var s = c(this);
            return f < 0 || f >= s.length ? null : s[f];
          },
        },
        contains: {
          value: function (f) {
            f = String(f);
            var s = c(this);
            return s.indexOf(f) > -1;
          },
        },
        add: {
          value: function () {
            for (var f = c(this), s = 0, b = arguments.length; s < b; s++) {
              var m = a(arguments[s]);
              f.indexOf(m) < 0 && f.push(m);
            }
            this._update(f);
          },
        },
        remove: {
          value: function () {
            for (var f = c(this), s = 0, b = arguments.length; s < b; s++) {
              var m = a(arguments[s]),
                N = f.indexOf(m);
              N > -1 && f.splice(N, 1);
            }
            this._update(f);
          },
        },
        toggle: {
          value: function (s, b) {
            return (
              (s = a(s)),
              this.contains(s)
                ? b === void 0 || b === !1
                  ? (this.remove(s), !1)
                  : !0
                : b === void 0 || b === !0
                  ? (this.add(s), !0)
                  : !1
            );
          },
        },
        replace: {
          value: function (s, b) {
            String(b) === "" && p.SyntaxError(), (s = a(s)), (b = a(b));
            var m = c(this),
              N = m.indexOf(s);
            if (N < 0) return !1;
            var I = m.indexOf(b);
            return (
              I < 0
                ? (m[N] = b)
                : N < I
                  ? ((m[N] = b), m.splice(I, 1))
                  : m.splice(N, 1),
              this._update(m),
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
          set: function (f) {
            this._setString(f), this._update();
          },
        },
        _update: {
          value: function (f) {
            f
              ? (t(this, f), this._setString(f.join(" ").trim()))
              : t(this, c(this)),
              (this._lastStringValue = this._getString());
          },
        },
      });
      function t(f, s) {
        var b = f._length,
          m;
        for (f._length = s.length, m = 0; m < s.length; m++) f[m] = s[m];
        for (; m < b; m++) f[m] = void 0;
      }
      function a(f) {
        return (
          (f = String(f)),
          f === "" && p.SyntaxError(),
          /[ \t\r\n\f]/.test(f) && p.InvalidCharacterError(),
          f
        );
      }
      function o(f) {
        for (var s = f._length, b = Array(s), m = 0; m < s; m++) b[m] = f[m];
        return b;
      }
      function c(f) {
        var s = f._getString();
        if (s === f._lastStringValue) return o(f);
        var b = s.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
        if (b === "") return [];
        var m = Object.create(null);
        return b.split(/[ \t\r\n\f]+/g).filter(function (N) {
          var I = "$" + N;
          return m[I] ? !1 : ((m[I] = !0), !0);
        });
      }
    },
  }),
  kn = le({
    "external/npm/node_modules/domino/lib/select.js"(E, S) {
      "use strict";
      var p = Object.create(null, {
          location: {
            get: function () {
              throw new Error("window.location is not supported.");
            },
          },
        }),
        l = function (u, i) {
          return u.compareDocumentPosition(i);
        },
        t = function (u, i) {
          return l(u, i) & 2 ? 1 : -1;
        },
        a = function (u) {
          for (; (u = u.nextSibling) && u.nodeType !== 1; );
          return u;
        },
        o = function (u) {
          for (; (u = u.previousSibling) && u.nodeType !== 1; );
          return u;
        },
        c = function (u) {
          if ((u = u.firstChild))
            for (; u.nodeType !== 1 && (u = u.nextSibling); );
          return u;
        },
        f = function (u) {
          if ((u = u.lastChild))
            for (; u.nodeType !== 1 && (u = u.previousSibling); );
          return u;
        },
        s = function (u) {
          if (!u.parentNode) return !1;
          var i = u.parentNode.nodeType;
          return i === 1 || i === 9;
        },
        b = function (u) {
          if (!u) return u;
          var i = u[0];
          return i === '"' || i === "'"
            ? (u[u.length - 1] === i ? (u = u.slice(1, -1)) : (u = u.slice(1)),
              u.replace(_.str_escape, function (n) {
                var d = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(n);
                if (!d) return n.slice(1);
                if (d[2]) return "";
                var h = parseInt(d[1], 16);
                return String.fromCodePoint
                  ? String.fromCodePoint(h)
                  : String.fromCharCode(h);
              }))
            : _.ident.test(u)
              ? m(u)
              : u;
        },
        m = function (u) {
          return u.replace(_.escape, function (i) {
            var n = /^\\([0-9A-Fa-f]+)/.exec(i);
            if (!n) return i[1];
            var d = parseInt(n[1], 16);
            return String.fromCodePoint
              ? String.fromCodePoint(d)
              : String.fromCharCode(d);
          });
        },
        N = (function () {
          return Array.prototype.indexOf
            ? Array.prototype.indexOf
            : function (u, i) {
                for (var n = this.length; n--; ) if (this[n] === i) return n;
                return -1;
              };
        })(),
        I = function (u, i) {
          var n = _.inside.source.replace(/</g, u).replace(/>/g, i);
          return new RegExp(n);
        },
        H = function (u, i, n) {
          return (
            (u = u.source), (u = u.replace(i, n.source || n)), new RegExp(u)
          );
        },
        R = function (u, i) {
          return u
            .replace(/^(?:\w+:\/\/|\/+)/, "")
            .replace(/(?:\/+|\/*#.*?)$/, "")
            .split("/", i)
            .join("/");
        },
        J = function (u, i) {
          var n = u.replace(/\s+/g, ""),
            d;
          return (
            n === "even"
              ? (n = "2n+0")
              : n === "odd"
                ? (n = "2n+1")
                : n.indexOf("n") === -1 && (n = "0n" + n),
            (d = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(n)),
            {
              group: d[1] === "-" ? -(d[2] || 1) : +(d[2] || 1),
              offset: d[4] ? (d[3] === "-" ? -d[4] : +d[4]) : 0,
            }
          );
        },
        B = function (u, i, n) {
          var d = J(u),
            h = d.group,
            v = d.offset,
            C = n ? f : c,
            j = n ? o : a;
          return function (re) {
            if (s(re))
              for (var w = C(re.parentNode), A = 0; w; ) {
                if ((i(w, re) && A++, w === re))
                  return (A -= v), h && A ? A % h === 0 && A < 0 == h < 0 : !A;
                w = j(w);
              }
          };
        },
        T = {
          "*": (function () {
            return function () {
              return !0;
            };
          })(),
          type: function (u) {
            return (
              (u = u.toLowerCase()),
              function (i) {
                return i.nodeName.toLowerCase() === u;
              }
            );
          },
          attr: function (u, i, n, d) {
            return (
              (i = g[i]),
              function (h) {
                var v;
                switch (u) {
                  case "for":
                    v = h.htmlFor;
                    break;
                  case "class":
                    (v = h.className),
                      v === "" && h.getAttribute("class") == null && (v = null);
                    break;
                  case "href":
                  case "src":
                    v = h.getAttribute(u, 2);
                    break;
                  case "title":
                    v = h.getAttribute("title") || null;
                    break;
                  case "id":
                  case "lang":
                  case "dir":
                  case "accessKey":
                  case "hidden":
                  case "tabIndex":
                  case "style":
                    if (h.getAttribute) {
                      v = h.getAttribute(u);
                      break;
                    }
                  default:
                    if (h.hasAttribute && !h.hasAttribute(u)) break;
                    v =
                      h[u] != null ? h[u] : h.getAttribute && h.getAttribute(u);
                    break;
                }
                if (v != null)
                  return (
                    (v = v + ""),
                    d && ((v = v.toLowerCase()), (n = n.toLowerCase())),
                    i(v, n)
                  );
              }
            );
          },
          ":first-child": function (u) {
            return !o(u) && s(u);
          },
          ":last-child": function (u) {
            return !a(u) && s(u);
          },
          ":only-child": function (u) {
            return !o(u) && !a(u) && s(u);
          },
          ":nth-child": function (u, i) {
            return B(
              u,
              function () {
                return !0;
              },
              i,
            );
          },
          ":nth-last-child": function (u) {
            return T[":nth-child"](u, !0);
          },
          ":root": function (u) {
            return u.ownerDocument.documentElement === u;
          },
          ":empty": function (u) {
            return !u.firstChild;
          },
          ":not": function (u) {
            var i = P(u);
            return function (n) {
              return !i(n);
            };
          },
          ":first-of-type": function (u) {
            if (s(u)) {
              for (var i = u.nodeName; (u = o(u)); )
                if (u.nodeName === i) return;
              return !0;
            }
          },
          ":last-of-type": function (u) {
            if (s(u)) {
              for (var i = u.nodeName; (u = a(u)); )
                if (u.nodeName === i) return;
              return !0;
            }
          },
          ":only-of-type": function (u) {
            return T[":first-of-type"](u) && T[":last-of-type"](u);
          },
          ":nth-of-type": function (u, i) {
            return B(
              u,
              function (n, d) {
                return n.nodeName === d.nodeName;
              },
              i,
            );
          },
          ":nth-last-of-type": function (u) {
            return T[":nth-of-type"](u, !0);
          },
          ":checked": function (u) {
            return !!(u.checked || u.selected);
          },
          ":indeterminate": function (u) {
            return !T[":checked"](u);
          },
          ":enabled": function (u) {
            return !u.disabled && u.type !== "hidden";
          },
          ":disabled": function (u) {
            return !!u.disabled;
          },
          ":target": function (u) {
            return u.id === p.location.hash.substring(1);
          },
          ":focus": function (u) {
            return u === u.ownerDocument.activeElement;
          },
          ":is": function (u) {
            return P(u);
          },
          ":matches": function (u) {
            return T[":is"](u);
          },
          ":nth-match": function (u, i) {
            var n = u.split(/\s*,\s*/),
              d = n.shift(),
              h = P(n.join(","));
            return B(d, h, i);
          },
          ":nth-last-match": function (u) {
            return T[":nth-match"](u, !0);
          },
          ":links-here": function (u) {
            return u + "" == p.location + "";
          },
          ":lang": function (u) {
            return function (i) {
              for (; i; ) {
                if (i.lang) return i.lang.indexOf(u) === 0;
                i = i.parentNode;
              }
            };
          },
          ":dir": function (u) {
            return function (i) {
              for (; i; ) {
                if (i.dir) return i.dir === u;
                i = i.parentNode;
              }
            };
          },
          ":scope": function (u, i) {
            var n = i || u.ownerDocument;
            return n.nodeType === 9 ? u === n.documentElement : u === n;
          },
          ":any-link": function (u) {
            return typeof u.href == "string";
          },
          ":local-link": function (u) {
            if (u.nodeName) return u.href && u.host === p.location.host;
            var i = +u + 1;
            return function (n) {
              if (n.href) {
                var d = p.location + "",
                  h = n + "";
                return R(d, i) === R(h, i);
              }
            };
          },
          ":default": function (u) {
            return !!u.defaultSelected;
          },
          ":valid": function (u) {
            return u.willValidate || (u.validity && u.validity.valid);
          },
          ":invalid": function (u) {
            return !T[":valid"](u);
          },
          ":in-range": function (u) {
            return u.value > u.min && u.value <= u.max;
          },
          ":out-of-range": function (u) {
            return !T[":in-range"](u);
          },
          ":required": function (u) {
            return !!u.required;
          },
          ":optional": function (u) {
            return !u.required;
          },
          ":read-only": function (u) {
            if (u.readOnly) return !0;
            var i = u.getAttribute("contenteditable"),
              n = u.contentEditable,
              d = u.nodeName.toLowerCase();
            return (
              (d = d !== "input" && d !== "textarea"),
              (d || u.disabled) && i == null && n !== "true"
            );
          },
          ":read-write": function (u) {
            return !T[":read-only"](u);
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
          ":contains": function (u) {
            return function (i) {
              var n = i.innerText || i.textContent || i.value || "";
              return n.indexOf(u) !== -1;
            };
          },
          ":has": function (u) {
            return function (i) {
              return Z(u, i).length > 0;
            };
          },
        },
        g = {
          "-": function () {
            return !0;
          },
          "=": function (u, i) {
            return u === i;
          },
          "*=": function (u, i) {
            return u.indexOf(i) !== -1;
          },
          "~=": function (u, i) {
            var n, d, h, v;
            for (d = 0; ; d = n + 1) {
              if (((n = u.indexOf(i, d)), n === -1)) return !1;
              if (
                ((h = u[n - 1]),
                (v = u[n + i.length]),
                (!h || h === " ") && (!v || v === " "))
              )
                return !0;
            }
          },
          "|=": function (u, i) {
            var n = u.indexOf(i),
              d;
            if (n === 0) return (d = u[n + i.length]), d === "-" || !d;
          },
          "^=": function (u, i) {
            return u.indexOf(i) === 0;
          },
          "$=": function (u, i) {
            var n = u.lastIndexOf(i);
            return n !== -1 && n + i.length === u.length;
          },
          "!=": function (u, i) {
            return u !== i;
          },
        },
        k = {
          " ": function (u) {
            return function (i) {
              for (; (i = i.parentNode); ) if (u(i)) return i;
            };
          },
          ">": function (u) {
            return function (i) {
              if ((i = i.parentNode)) return u(i) && i;
            };
          },
          "+": function (u) {
            return function (i) {
              if ((i = o(i))) return u(i) && i;
            };
          },
          "~": function (u) {
            return function (i) {
              for (; (i = o(i)); ) if (u(i)) return i;
            };
          },
          noop: function (u) {
            return function (i) {
              return u(i) && i;
            };
          },
          ref: function (u, i) {
            var n;
            function d(h) {
              for (
                var v = h.ownerDocument,
                  C = v.getElementsByTagName("*"),
                  j = C.length;
                j--;

              )
                if (((n = C[j]), d.test(h))) return (n = null), !0;
              n = null;
            }
            return (
              (d.combinator = function (h) {
                if (!(!n || !n.getAttribute)) {
                  var v = n.getAttribute(i) || "";
                  if (
                    (v[0] === "#" && (v = v.substring(1)), v === h.id && u(n))
                  )
                    return n;
                }
              }),
              d
            );
          },
        },
        _ = {
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
      (_.cssid = H(_.cssid, "nonascii", _.nonascii)),
        (_.cssid = H(_.cssid, "escape", _.escape)),
        (_.qname = H(_.qname, "cssid", _.cssid)),
        (_.simple = H(_.simple, "cssid", _.cssid)),
        (_.ref = H(_.ref, "cssid", _.cssid)),
        (_.attr = H(_.attr, "cssid", _.cssid)),
        (_.pseudo = H(_.pseudo, "cssid", _.cssid)),
        (_.inside = H(_.inside, `[^"'>]*`, _.inside)),
        (_.attr = H(_.attr, "inside", I("\\[", "\\]"))),
        (_.pseudo = H(_.pseudo, "inside", I("\\(", "\\)"))),
        (_.simple = H(_.simple, "pseudo", _.pseudo)),
        (_.simple = H(_.simple, "attr", _.attr)),
        (_.ident = H(_.ident, "cssid", _.cssid)),
        (_.str_escape = H(_.str_escape, "escape", _.escape));
      var ae = function (u) {
          for (
            var i = u.replace(/^\s+|\s+$/g, ""),
              n,
              d = [],
              h = [],
              v,
              C,
              j,
              re,
              w;
            i;

          ) {
            if ((j = _.qname.exec(i)))
              (i = i.substring(j[0].length)), (C = m(j[1])), h.push(ne(C, !0));
            else if ((j = _.simple.exec(i)))
              (i = i.substring(j[0].length)),
                (C = "*"),
                h.push(ne(C, !0)),
                h.push(ne(j));
            else throw new SyntaxError("Invalid selector.");
            for (; (j = _.simple.exec(i)); )
              (i = i.substring(j[0].length)), h.push(ne(j));
            if (
              (i[0] === "!" &&
                ((i = i.substring(1)),
                (v = D()),
                (v.qname = C),
                h.push(v.simple)),
              (j = _.ref.exec(i)))
            ) {
              (i = i.substring(j[0].length)),
                (w = k.ref(Q(h), m(j[1]))),
                d.push(w.combinator),
                (h = []);
              continue;
            }
            if ((j = _.combinator.exec(i))) {
              if (
                ((i = i.substring(j[0].length)),
                (re = j[1] || j[2] || j[3]),
                re === ",")
              ) {
                d.push(k.noop(Q(h)));
                break;
              }
            } else re = "noop";
            if (!k[re]) throw new SyntaxError("Bad combinator.");
            d.push(k[re](Q(h))), (h = []);
          }
          return (
            (n = G(d)),
            (n.qname = C),
            (n.sel = i),
            v &&
              ((v.lname = n.qname),
              (v.test = n),
              (v.qname = v.qname),
              (v.sel = n.sel),
              (n = v)),
            w && ((w.test = n), (w.qname = n.qname), (w.sel = n.sel), (n = w)),
            n
          );
        },
        ne = function (u, i) {
          if (i) return u === "*" ? T["*"] : T.type(u);
          if (u[1])
            return u[1][0] === "."
              ? T.attr("class", "~=", m(u[1].substring(1)), !1)
              : T.attr("id", "=", m(u[1].substring(1)), !1);
          if (u[2]) return u[3] ? T[m(u[2])](b(u[3])) : T[m(u[2])];
          if (u[4]) {
            var n = u[6],
              d = /["'\s]\s*I$/i.test(n);
            return (
              d && (n = n.replace(/\s*I$/i, "")),
              T.attr(m(u[4]), u[5] || "-", b(n), d)
            );
          }
          throw new SyntaxError("Unknown Selector.");
        },
        Q = function (u) {
          var i = u.length,
            n;
          return i < 2
            ? u[0]
            : function (d) {
                if (d) {
                  for (n = 0; n < i; n++) if (!u[n](d)) return;
                  return !0;
                }
              };
        },
        G = function (u) {
          return u.length < 2
            ? function (i) {
                return !!u[0](i);
              }
            : function (i) {
                for (var n = u.length; n--; ) if (!(i = u[n](i))) return;
                return !0;
              };
        },
        D = function () {
          var u;
          function i(n) {
            for (
              var d = n.ownerDocument,
                h = d.getElementsByTagName(i.lname),
                v = h.length;
              v--;

            )
              if (i.test(h[v]) && u === n) return (u = null), !0;
            u = null;
          }
          return (
            (i.simple = function (n) {
              return (u = n), !0;
            }),
            i
          );
        },
        P = function (u) {
          for (var i = ae(u), n = [i]; i.sel; ) (i = ae(i.sel)), n.push(i);
          return n.length < 2
            ? i
            : function (d) {
                for (var h = n.length, v = 0; v < h; v++)
                  if (n[v](d)) return !0;
              };
        },
        Z = function (u, i) {
          for (
            var n = [],
              d = ae(u),
              h = i.getElementsByTagName(d.qname),
              v = 0,
              C;
            (C = h[v++]);

          )
            d(C) && n.push(C);
          if (d.sel) {
            for (; d.sel; )
              for (
                d = ae(d.sel), h = i.getElementsByTagName(d.qname), v = 0;
                (C = h[v++]);

              )
                d(C) && N.call(n, C) === -1 && n.push(C);
            n.sort(t);
          }
          return n;
        };
      (S.exports = E =
        function (u, i) {
          var n, d;
          if (i.nodeType !== 11 && u.indexOf(" ") === -1) {
            if (
              u[0] === "#" &&
              i.rooted &&
              /^#[A-Z_][-A-Z0-9_]*$/i.test(u) &&
              i.doc._hasMultipleElementsWithId &&
              ((n = u.substring(1)), !i.doc._hasMultipleElementsWithId(n))
            )
              return (d = i.doc.getElementById(n)), d ? [d] : [];
            if (u[0] === "." && /^\.\w+$/.test(u))
              return i.getElementsByClassName(u.substring(1));
            if (/^\w+$/.test(u)) return i.getElementsByTagName(u);
          }
          return Z(u, i);
        }),
        (E.selectors = T),
        (E.operators = g),
        (E.combinators = k),
        (E.matches = function (u, i) {
          var n = { sel: i };
          do if (((n = ae(n.sel)), n(u))) return !0;
          while (n.sel);
          return !1;
        });
    },
  }),
  Ln = le({
    "external/npm/node_modules/domino/lib/ChildNode.js"(E, S) {
      "use strict";
      var p = Ve(),
        l = ga(),
        t = function (o, c) {
          for (var f = o.createDocumentFragment(), s = 0; s < c.length; s++) {
            var b = c[s],
              m = b instanceof p;
            f.appendChild(m ? b : o.createTextNode(String(b)));
          }
          return f;
        },
        a = {
          after: {
            value: function () {
              var c = Array.prototype.slice.call(arguments),
                f = this.parentNode,
                s = this.nextSibling;
              if (f !== null) {
                for (
                  ;
                  s &&
                  c.some(function (m) {
                    return m === s;
                  });

                )
                  s = s.nextSibling;
                var b = t(this.doc, c);
                f.insertBefore(b, s);
              }
            },
          },
          before: {
            value: function () {
              var c = Array.prototype.slice.call(arguments),
                f = this.parentNode,
                s = this.previousSibling;
              if (f !== null) {
                for (
                  ;
                  s &&
                  c.some(function (N) {
                    return N === s;
                  });

                )
                  s = s.previousSibling;
                var b = t(this.doc, c),
                  m = s ? s.nextSibling : f.firstChild;
                f.insertBefore(b, m);
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
              var c = this.parentNode;
              c !== null &&
                (c._childNodes
                  ? c._childNodes.splice(this.index, 1)
                  : c._firstChild === this &&
                    (this._nextSibling === this
                      ? (c._firstChild = null)
                      : (c._firstChild = this._nextSibling)),
                l.remove(this),
                c.modify());
            },
          },
          replaceWith: {
            value: function () {
              var c = Array.prototype.slice.call(arguments),
                f = this.parentNode,
                s = this.nextSibling;
              if (f !== null) {
                for (
                  ;
                  s &&
                  c.some(function (m) {
                    return m === s;
                  });

                )
                  s = s.nextSibling;
                var b = t(this.doc, c);
                this.parentNode === f
                  ? f.replaceChild(b, this)
                  : f.insertBefore(b, s);
              }
            },
          },
        };
      S.exports = a;
    },
  }),
  va = le({
    "external/npm/node_modules/domino/lib/NonDocumentTypeChildNode.js"(E, S) {
      "use strict";
      var p = Ve(),
        l = {
          nextElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (var t = this.nextSibling; t !== null; t = t.nextSibling)
                  if (t.nodeType === p.ELEMENT_NODE) return t;
              }
              return null;
            },
          },
          previousElementSibling: {
            get: function () {
              if (this.parentNode) {
                for (
                  var t = this.previousSibling;
                  t !== null;
                  t = t.previousSibling
                )
                  if (t.nodeType === p.ELEMENT_NODE) return t;
              }
              return null;
            },
          },
        };
      S.exports = l;
    },
  }),
  Ta = le({
    "external/npm/node_modules/domino/lib/NamedNodeMap.js"(E, S) {
      "use strict";
      S.exports = l;
      var p = Be();
      function l(t) {
        this.element = t;
      }
      Object.defineProperties(l.prototype, {
        length: { get: p.shouldOverride },
        item: { value: p.shouldOverride },
        getNamedItem: {
          value: function (a) {
            return this.element.getAttributeNode(a);
          },
        },
        getNamedItemNS: {
          value: function (a, o) {
            return this.element.getAttributeNodeNS(a, o);
          },
        },
        setNamedItem: { value: p.nyi },
        setNamedItemNS: { value: p.nyi },
        removeNamedItem: {
          value: function (a) {
            var o = this.element.getAttributeNode(a);
            if (o) return this.element.removeAttribute(a), o;
            p.NotFoundError();
          },
        },
        removeNamedItemNS: {
          value: function (a, o) {
            var c = this.element.getAttributeNodeNS(a, o);
            if (c) return this.element.removeAttributeNS(a, o), c;
            p.NotFoundError();
          },
        },
      });
    },
  }),
  Er = le({
    "external/npm/node_modules/domino/lib/Element.js"(E, S) {
      "use strict";
      S.exports = T;
      var p = Sn(),
        l = Be(),
        t = l.NAMESPACE,
        a = ba(),
        o = Ve(),
        c = ar(),
        f = _a(),
        s = di(),
        b = yn(),
        m = Ea(),
        N = kn(),
        I = wn(),
        H = Ln(),
        R = va(),
        J = Ta(),
        B = Object.create(null);
      function T(i, n, d, h) {
        I.call(this),
          (this.nodeType = o.ELEMENT_NODE),
          (this.ownerDocument = i),
          (this.localName = n),
          (this.namespaceURI = d),
          (this.prefix = h),
          (this._tagName = void 0),
          (this._attrsByQName = Object.create(null)),
          (this._attrsByLName = Object.create(null)),
          (this._attrKeys = []);
      }
      function g(i, n) {
        if (i.nodeType === o.TEXT_NODE) n.push(i._data);
        else
          for (var d = 0, h = i.childNodes.length; d < h; d++)
            g(i.childNodes[d], n);
      }
      (T.prototype = Object.create(I.prototype, {
        isHTML: {
          get: function () {
            return this.namespaceURI === t.HTML && this.ownerDocument.isHTML;
          },
        },
        tagName: {
          get: function () {
            if (this._tagName === void 0) {
              var n;
              if (
                (this.prefix === null
                  ? (n = this.localName)
                  : (n = this.prefix + ":" + this.localName),
                this.isHTML)
              ) {
                var d = B[n];
                d || (B[n] = d = l.toASCIIUpperCase(n)), (n = d);
              }
              this._tagName = n;
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
            var i = [];
            return g(this, i), i.join("");
          },
          set: function (i) {
            this.removeChildren(),
              i != null &&
                i !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(i));
          },
        },
        innerText: {
          get: function () {
            var i = [];
            return (
              g(this, i),
              i
                .join("")
                .replace(/[ \t\n\f\r]+/g, " ")
                .trim()
            );
          },
          set: function (i) {
            this.removeChildren(),
              i != null &&
                i !== "" &&
                this._appendChild(this.ownerDocument.createTextNode(i));
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: l.nyi,
        },
        outerHTML: {
          get: function () {
            return f.serializeOne(this, { nodeType: 0 });
          },
          set: function (i) {
            var n = this.ownerDocument,
              d = this.parentNode;
            if (d !== null) {
              d.nodeType === o.DOCUMENT_NODE && l.NoModificationAllowedError(),
                d.nodeType === o.DOCUMENT_FRAGMENT_NODE &&
                  (d = d.ownerDocument.createElement("body"));
              var h = n.implementation.mozHTMLParser(n._address, d);
              h.parse(i === null ? "" : String(i), !0),
                this.replaceWith(h._asDocumentFragment());
            }
          },
        },
        _insertAdjacent: {
          value: function (n, d) {
            var h = !1;
            switch (n) {
              case "beforebegin":
                h = !0;
              case "afterend":
                var v = this.parentNode;
                return v === null
                  ? null
                  : v.insertBefore(d, h ? this : this.nextSibling);
              case "afterbegin":
                h = !0;
              case "beforeend":
                return this.insertBefore(d, h ? this.firstChild : null);
              default:
                return l.SyntaxError();
            }
          },
        },
        insertAdjacentElement: {
          value: function (n, d) {
            if (d.nodeType !== o.ELEMENT_NODE)
              throw new TypeError("not an element");
            return (
              (n = l.toASCIILowerCase(String(n))), this._insertAdjacent(n, d)
            );
          },
        },
        insertAdjacentText: {
          value: function (n, d) {
            var h = this.ownerDocument.createTextNode(d);
            (n = l.toASCIILowerCase(String(n))), this._insertAdjacent(n, h);
          },
        },
        insertAdjacentHTML: {
          value: function (n, d) {
            (n = l.toASCIILowerCase(String(n))), (d = String(d));
            var h;
            switch (n) {
              case "beforebegin":
              case "afterend":
                (h = this.parentNode),
                  (h === null || h.nodeType === o.DOCUMENT_NODE) &&
                    l.NoModificationAllowedError();
                break;
              case "afterbegin":
              case "beforeend":
                h = this;
                break;
              default:
                l.SyntaxError();
            }
            (!(h instanceof T) ||
              (h.ownerDocument.isHTML &&
                h.localName === "html" &&
                h.namespaceURI === t.HTML)) &&
              (h = h.ownerDocument.createElementNS(t.HTML, "body"));
            var v = this.ownerDocument.implementation.mozHTMLParser(
              this.ownerDocument._address,
              h,
            );
            v.parse(d, !0), this._insertAdjacent(n, v._asDocumentFragment());
          },
        },
        children: {
          get: function () {
            return (
              this._children || (this._children = new ne(this)), this._children
            );
          },
        },
        attributes: {
          get: function () {
            return (
              this._attributes || (this._attributes = new _(this)),
              this._attributes
            );
          },
        },
        firstElementChild: {
          get: function () {
            for (var i = this.firstChild; i !== null; i = i.nextSibling)
              if (i.nodeType === o.ELEMENT_NODE) return i;
            return null;
          },
        },
        lastElementChild: {
          get: function () {
            for (var i = this.lastChild; i !== null; i = i.previousSibling)
              if (i.nodeType === o.ELEMENT_NODE) return i;
            return null;
          },
        },
        childElementCount: {
          get: function () {
            return this.children.length;
          },
        },
        nextElement: {
          value: function (i) {
            i || (i = this.ownerDocument.documentElement);
            var n = this.firstElementChild;
            if (!n) {
              if (this === i) return null;
              n = this.nextElementSibling;
            }
            if (n) return n;
            for (var d = this.parentElement; d && d !== i; d = d.parentElement)
              if (((n = d.nextElementSibling), n)) return n;
            return null;
          },
        },
        getElementsByTagName: {
          value: function (n) {
            var d;
            return n
              ? (n === "*"
                  ? (d = function () {
                      return !0;
                    })
                  : this.isHTML
                    ? (d = G(n))
                    : (d = Q(n)),
                new s(this, d))
              : new c();
          },
        },
        getElementsByTagNameNS: {
          value: function (n, d) {
            var h;
            return (
              n === "*" && d === "*"
                ? (h = function () {
                    return !0;
                  })
                : n === "*"
                  ? (h = Q(d))
                  : d === "*"
                    ? (h = D(n))
                    : (h = P(n, d)),
              new s(this, h)
            );
          },
        },
        getElementsByClassName: {
          value: function (n) {
            if (((n = String(n).trim()), n === "")) {
              var d = new c();
              return d;
            }
            return (n = n.split(/[ \t\r\n\f]+/)), new s(this, Z(n));
          },
        },
        getElementsByName: {
          value: function (n) {
            return new s(this, u(String(n)));
          },
        },
        clone: {
          value: function () {
            var n;
            this.namespaceURI !== t.HTML ||
            this.prefix ||
            !this.ownerDocument.isHTML
              ? (n = this.ownerDocument.createElementNS(
                  this.namespaceURI,
                  this.prefix !== null
                    ? this.prefix + ":" + this.localName
                    : this.localName,
                ))
              : (n = this.ownerDocument.createElement(this.localName));
            for (var d = 0, h = this._attrKeys.length; d < h; d++) {
              var v = this._attrKeys[d],
                C = this._attrsByLName[v],
                j = C.cloneNode();
              j._setOwnerElement(n), (n._attrsByLName[v] = j), n._addQName(j);
            }
            return (n._attrKeys = this._attrKeys.concat()), n;
          },
        },
        isEqual: {
          value: function (n) {
            if (
              this.localName !== n.localName ||
              this.namespaceURI !== n.namespaceURI ||
              this.prefix !== n.prefix ||
              this._numattrs !== n._numattrs
            )
              return !1;
            for (var d = 0, h = this._numattrs; d < h; d++) {
              var v = this._attr(d);
              if (
                !n.hasAttributeNS(v.namespaceURI, v.localName) ||
                n.getAttributeNS(v.namespaceURI, v.localName) !== v.value
              )
                return !1;
            }
            return !0;
          },
        },
        _lookupNamespacePrefix: {
          value: function (n, d) {
            if (
              this.namespaceURI &&
              this.namespaceURI === n &&
              this.prefix !== null &&
              d.lookupNamespaceURI(this.prefix) === n
            )
              return this.prefix;
            for (var h = 0, v = this._numattrs; h < v; h++) {
              var C = this._attr(h);
              if (
                C.prefix === "xmlns" &&
                C.value === n &&
                d.lookupNamespaceURI(C.localName) === n
              )
                return C.localName;
            }
            var j = this.parentElement;
            return j ? j._lookupNamespacePrefix(n, d) : null;
          },
        },
        lookupNamespaceURI: {
          value: function (n) {
            if (
              ((n === "" || n === void 0) && (n = null),
              this.namespaceURI !== null && this.prefix === n)
            )
              return this.namespaceURI;
            for (var d = 0, h = this._numattrs; d < h; d++) {
              var v = this._attr(d);
              if (
                v.namespaceURI === t.XMLNS &&
                ((v.prefix === "xmlns" && v.localName === n) ||
                  (n === null && v.prefix === null && v.localName === "xmlns"))
              )
                return v.value || null;
            }
            var C = this.parentElement;
            return C ? C.lookupNamespaceURI(n) : null;
          },
        },
        getAttribute: {
          value: function (n) {
            var d = this.getAttributeNode(n);
            return d ? d.value : null;
          },
        },
        getAttributeNS: {
          value: function (n, d) {
            var h = this.getAttributeNodeNS(n, d);
            return h ? h.value : null;
          },
        },
        getAttributeNode: {
          value: function (n) {
            (n = String(n)),
              /[A-Z]/.test(n) && this.isHTML && (n = l.toASCIILowerCase(n));
            var d = this._attrsByQName[n];
            return d ? (Array.isArray(d) && (d = d[0]), d) : null;
          },
        },
        getAttributeNodeNS: {
          value: function (n, d) {
            (n = n == null ? "" : String(n)), (d = String(d));
            var h = this._attrsByLName[n + "|" + d];
            return h || null;
          },
        },
        hasAttribute: {
          value: function (n) {
            return (
              (n = String(n)),
              /[A-Z]/.test(n) && this.isHTML && (n = l.toASCIILowerCase(n)),
              this._attrsByQName[n] !== void 0
            );
          },
        },
        hasAttributeNS: {
          value: function (n, d) {
            (n = n == null ? "" : String(n)), (d = String(d));
            var h = n + "|" + d;
            return this._attrsByLName[h] !== void 0;
          },
        },
        hasAttributes: {
          value: function () {
            return this._numattrs > 0;
          },
        },
        toggleAttribute: {
          value: function (n, d) {
            (n = String(n)),
              p.isValidName(n) || l.InvalidCharacterError(),
              /[A-Z]/.test(n) && this.isHTML && (n = l.toASCIILowerCase(n));
            var h = this._attrsByQName[n];
            return h === void 0
              ? d === void 0 || d === !0
                ? (this._setAttribute(n, ""), !0)
                : !1
              : d === void 0 || d === !1
                ? (this.removeAttribute(n), !1)
                : !0;
          },
        },
        _setAttribute: {
          value: function (n, d) {
            var h = this._attrsByQName[n],
              v;
            h
              ? Array.isArray(h) && (h = h[0])
              : ((h = this._newattr(n)), (v = !0)),
              (h.value = d),
              this._attributes && (this._attributes[n] = h),
              v && this._newattrhook && this._newattrhook(n, d);
          },
        },
        setAttribute: {
          value: function (n, d) {
            (n = String(n)),
              p.isValidName(n) || l.InvalidCharacterError(),
              /[A-Z]/.test(n) && this.isHTML && (n = l.toASCIILowerCase(n)),
              this._setAttribute(n, String(d));
          },
        },
        _setAttributeNS: {
          value: function (n, d, h) {
            var v = d.indexOf(":"),
              C,
              j;
            v < 0
              ? ((C = null), (j = d))
              : ((C = d.substring(0, v)), (j = d.substring(v + 1))),
              (n === "" || n === void 0) && (n = null);
            var re = (n === null ? "" : n) + "|" + j,
              w = this._attrsByLName[re],
              A;
            w ||
              ((w = new k(this, j, C, n)),
              (A = !0),
              (this._attrsByLName[re] = w),
              this._attributes && (this._attributes[this._attrKeys.length] = w),
              this._attrKeys.push(re),
              this._addQName(w)),
              (w.value = h),
              A && this._newattrhook && this._newattrhook(d, h);
          },
        },
        setAttributeNS: {
          value: function (n, d, h) {
            (n = n == null || n === "" ? null : String(n)),
              (d = String(d)),
              p.isValidQName(d) || l.InvalidCharacterError();
            var v = d.indexOf(":"),
              C = v < 0 ? null : d.substring(0, v);
            ((C !== null && n === null) ||
              (C === "xml" && n !== t.XML) ||
              ((d === "xmlns" || C === "xmlns") && n !== t.XMLNS) ||
              (n === t.XMLNS && !(d === "xmlns" || C === "xmlns"))) &&
              l.NamespaceError(),
              this._setAttributeNS(n, d, String(h));
          },
        },
        setAttributeNode: {
          value: function (n) {
            if (n.ownerElement !== null && n.ownerElement !== this)
              throw new b(b.INUSE_ATTRIBUTE_ERR);
            var d = null,
              h = this._attrsByQName[n.name];
            if (h) {
              if (
                (Array.isArray(h) || (h = [h]),
                h.some(function (v) {
                  return v === n;
                }))
              )
                return n;
              if (n.ownerElement !== null) throw new b(b.INUSE_ATTRIBUTE_ERR);
              h.forEach(function (v) {
                this.removeAttributeNode(v);
              }, this),
                (d = h[0]);
            }
            return this.setAttributeNodeNS(n), d;
          },
        },
        setAttributeNodeNS: {
          value: function (n) {
            if (n.ownerElement !== null) throw new b(b.INUSE_ATTRIBUTE_ERR);
            var d = n.namespaceURI,
              h = (d === null ? "" : d) + "|" + n.localName,
              v = this._attrsByLName[h];
            return (
              v && this.removeAttributeNode(v),
              n._setOwnerElement(this),
              (this._attrsByLName[h] = n),
              this._attributes && (this._attributes[this._attrKeys.length] = n),
              this._attrKeys.push(h),
              this._addQName(n),
              this._newattrhook && this._newattrhook(n.name, n.value),
              v || null
            );
          },
        },
        removeAttribute: {
          value: function (n) {
            (n = String(n)),
              /[A-Z]/.test(n) && this.isHTML && (n = l.toASCIILowerCase(n));
            var d = this._attrsByQName[n];
            if (d) {
              Array.isArray(d)
                ? d.length > 2
                  ? (d = d.shift())
                  : ((this._attrsByQName[n] = d[1]), (d = d[0]))
                : (this._attrsByQName[n] = void 0);
              var h = d.namespaceURI,
                v = (h === null ? "" : h) + "|" + d.localName;
              this._attrsByLName[v] = void 0;
              var C = this._attrKeys.indexOf(v);
              this._attributes &&
                (Array.prototype.splice.call(this._attributes, C, 1),
                (this._attributes[n] = void 0)),
                this._attrKeys.splice(C, 1);
              var j = d.onchange;
              d._setOwnerElement(null),
                j && j.call(d, this, d.localName, d.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(d);
            }
          },
        },
        removeAttributeNS: {
          value: function (n, d) {
            (n = n == null ? "" : String(n)), (d = String(d));
            var h = n + "|" + d,
              v = this._attrsByLName[h];
            if (v) {
              this._attrsByLName[h] = void 0;
              var C = this._attrKeys.indexOf(h);
              this._attributes &&
                Array.prototype.splice.call(this._attributes, C, 1),
                this._attrKeys.splice(C, 1),
                this._removeQName(v);
              var j = v.onchange;
              v._setOwnerElement(null),
                j && j.call(v, this, v.localName, v.value, null),
                this.rooted && this.ownerDocument.mutateRemoveAttr(v);
            }
          },
        },
        removeAttributeNode: {
          value: function (n) {
            var d = n.namespaceURI,
              h = (d === null ? "" : d) + "|" + n.localName;
            return (
              this._attrsByLName[h] !== n && l.NotFoundError(),
              this.removeAttributeNS(d, n.localName),
              n
            );
          },
        },
        getAttributeNames: {
          value: function () {
            var n = this;
            return this._attrKeys.map(function (d) {
              return n._attrsByLName[d].name;
            });
          },
        },
        _getattr: {
          value: function (n) {
            var d = this._attrsByQName[n];
            return d ? d.value : null;
          },
        },
        _setattr: {
          value: function (n, d) {
            var h = this._attrsByQName[n],
              v;
            h || ((h = this._newattr(n)), (v = !0)),
              (h.value = String(d)),
              this._attributes && (this._attributes[n] = h),
              v && this._newattrhook && this._newattrhook(n, d);
          },
        },
        _newattr: {
          value: function (n) {
            var d = new k(this, n, null, null),
              h = "|" + n;
            return (
              (this._attrsByQName[n] = d),
              (this._attrsByLName[h] = d),
              this._attributes && (this._attributes[this._attrKeys.length] = d),
              this._attrKeys.push(h),
              d
            );
          },
        },
        _addQName: {
          value: function (i) {
            var n = i.name,
              d = this._attrsByQName[n];
            d
              ? Array.isArray(d)
                ? d.push(i)
                : (this._attrsByQName[n] = [d, i])
              : (this._attrsByQName[n] = i),
              this._attributes && (this._attributes[n] = i);
          },
        },
        _removeQName: {
          value: function (i) {
            var n = i.name,
              d = this._attrsByQName[n];
            if (Array.isArray(d)) {
              var h = d.indexOf(i);
              l.assert(h !== -1),
                d.length === 2
                  ? ((this._attrsByQName[n] = d[1 - h]),
                    this._attributes &&
                      (this._attributes[n] = this._attrsByQName[n]))
                  : (d.splice(h, 1),
                    this._attributes &&
                      this._attributes[n] === i &&
                      (this._attributes[n] = d[0]));
            } else
              l.assert(d === i),
                (this._attrsByQName[n] = void 0),
                this._attributes && (this._attributes[n] = void 0);
          },
        },
        _numattrs: {
          get: function () {
            return this._attrKeys.length;
          },
        },
        _attr: {
          value: function (i) {
            return this._attrsByLName[this._attrKeys[i]];
          },
        },
        id: a.property({ name: "id" }),
        className: a.property({ name: "class" }),
        classList: {
          get: function () {
            var i = this;
            if (this._classList) return this._classList;
            var n = new m(
              function () {
                return i.className || "";
              },
              function (d) {
                i.className = d;
              },
            );
            return (this._classList = n), n;
          },
          set: function (i) {
            this.className = i;
          },
        },
        matches: {
          value: function (i) {
            return N.matches(this, i);
          },
        },
        closest: {
          value: function (i) {
            var n = this;
            do {
              if (n.matches && n.matches(i)) return n;
              n = n.parentElement || n.parentNode;
            } while (n !== null && n.nodeType === o.ELEMENT_NODE);
            return null;
          },
        },
        querySelector: {
          value: function (i) {
            return N(i, this)[0];
          },
        },
        querySelectorAll: {
          value: function (i) {
            var n = N(i, this);
            return n.item ? n : new c(n);
          },
        },
      })),
        Object.defineProperties(T.prototype, H),
        Object.defineProperties(T.prototype, R),
        a.registerChangeHandler(T, "id", function (i, n, d, h) {
          i.rooted &&
            (d && i.ownerDocument.delId(d, i),
            h && i.ownerDocument.addId(h, i));
        }),
        a.registerChangeHandler(T, "class", function (i, n, d, h) {
          i._classList && i._classList._update();
        });
      function k(i, n, d, h, v) {
        (this.localName = n),
          (this.prefix = d === null || d === "" ? null : "" + d),
          (this.namespaceURI = h === null || h === "" ? null : "" + h),
          (this.data = v),
          this._setOwnerElement(i);
      }
      (k.prototype = Object.create(Object.prototype, {
        ownerElement: {
          get: function () {
            return this._ownerElement;
          },
        },
        _setOwnerElement: {
          value: function (n) {
            (this._ownerElement = n),
              this.prefix === null && this.namespaceURI === null && n
                ? (this.onchange = n._attributeChangeHandlers[this.localName])
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
          set: function (i) {
            var n = this.data;
            (i = i === void 0 ? "" : i + ""),
              i !== n &&
                ((this.data = i),
                this.ownerElement &&
                  (this.onchange &&
                    this.onchange(this.ownerElement, this.localName, n, i),
                  this.ownerElement.rooted &&
                    this.ownerElement.ownerDocument.mutateAttr(this, n)));
          },
        },
        cloneNode: {
          value: function (n) {
            return new k(
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
          set: function (i) {
            this.value = i;
          },
        },
        textContent: {
          get: function () {
            return this.value;
          },
          set: function (i) {
            i == null && (i = ""), (this.value = i);
          },
        },
        innerText: {
          get: function () {
            return this.value;
          },
          set: function (i) {
            i == null && (i = ""), (this.value = i);
          },
        },
      })),
        (T._Attr = k);
      function _(i) {
        J.call(this, i);
        for (var n in i._attrsByQName) this[n] = i._attrsByQName[n];
        for (var d = 0; d < i._attrKeys.length; d++)
          this[d] = i._attrsByLName[i._attrKeys[d]];
      }
      _.prototype = Object.create(J.prototype, {
        length: {
          get: function () {
            return this.element._attrKeys.length;
          },
          set: function () {},
        },
        item: {
          value: function (i) {
            return (
              (i = i >>> 0),
              i >= this.length
                ? null
                : this.element._attrsByLName[this.element._attrKeys[i]]
            );
          },
        },
      });
      var ae;
      (ae = globalThis.Symbol) != null &&
        ae.iterator &&
        (_.prototype[globalThis.Symbol.iterator] = function () {
          var i = 0,
            n = this.length,
            d = this;
          return {
            next: function () {
              return i < n ? { value: d.item(i++) } : { done: !0 };
            },
          };
        });
      function ne(i) {
        (this.element = i), this.updateCache();
      }
      ne.prototype = Object.create(Object.prototype, {
        length: {
          get: function () {
            return this.updateCache(), this.childrenByNumber.length;
          },
        },
        item: {
          value: function (n) {
            return this.updateCache(), this.childrenByNumber[n] || null;
          },
        },
        namedItem: {
          value: function (n) {
            return this.updateCache(), this.childrenByName[n] || null;
          },
        },
        namedItems: {
          get: function () {
            return this.updateCache(), this.childrenByName;
          },
        },
        updateCache: {
          value: function () {
            var n =
              /^(a|applet|area|embed|form|frame|frameset|iframe|img|object)$/;
            if (this.lastModTime !== this.element.lastModTime) {
              this.lastModTime = this.element.lastModTime;
              for (
                var d =
                    (this.childrenByNumber && this.childrenByNumber.length) ||
                    0,
                  h = 0;
                h < d;
                h++
              )
                this[h] = void 0;
              (this.childrenByNumber = []),
                (this.childrenByName = Object.create(null));
              for (
                var v = this.element.firstChild;
                v !== null;
                v = v.nextSibling
              )
                if (v.nodeType === o.ELEMENT_NODE) {
                  (this[this.childrenByNumber.length] = v),
                    this.childrenByNumber.push(v);
                  var C = v.getAttribute("id");
                  C && !this.childrenByName[C] && (this.childrenByName[C] = v);
                  var j = v.getAttribute("name");
                  j &&
                    this.element.namespaceURI === t.HTML &&
                    n.test(this.element.localName) &&
                    !this.childrenByName[j] &&
                    (this.childrenByName[C] = v);
                }
            }
          },
        },
      });
      function Q(i) {
        return function (n) {
          return n.localName === i;
        };
      }
      function G(i) {
        var n = l.toASCIILowerCase(i);
        return n === i
          ? Q(i)
          : function (d) {
              return d.isHTML ? d.localName === n : d.localName === i;
            };
      }
      function D(i) {
        return function (n) {
          return n.namespaceURI === i;
        };
      }
      function P(i, n) {
        return function (d) {
          return d.namespaceURI === i && d.localName === n;
        };
      }
      function Z(i) {
        return function (n) {
          return i.every(function (d) {
            return n.classList.contains(d);
          });
        };
      }
      function u(i) {
        return function (n) {
          return n.namespaceURI !== t.HTML ? !1 : n.getAttribute("name") === i;
        };
      }
    },
  }),
  ya = le({
    "external/npm/node_modules/domino/lib/Leaf.js"(E, S) {
      "use strict";
      S.exports = c;
      var p = Ve(),
        l = ar(),
        t = Be(),
        a = t.HierarchyRequestError,
        o = t.NotFoundError;
      function c() {
        p.call(this);
      }
      c.prototype = Object.create(p.prototype, {
        hasChildNodes: {
          value: function () {
            return !1;
          },
        },
        firstChild: { value: null },
        lastChild: { value: null },
        insertBefore: {
          value: function (f, s) {
            if (!f.nodeType) throw new TypeError("not a node");
            a();
          },
        },
        replaceChild: {
          value: function (f, s) {
            if (!f.nodeType) throw new TypeError("not a node");
            a();
          },
        },
        removeChild: {
          value: function (f) {
            if (!f.nodeType) throw new TypeError("not a node");
            o();
          },
        },
        removeChildren: { value: function () {} },
        childNodes: {
          get: function () {
            return (
              this._childNodes || (this._childNodes = new l()), this._childNodes
            );
          },
        },
      });
    },
  }),
  $r = le({
    "external/npm/node_modules/domino/lib/CharacterData.js"(E, S) {
      "use strict";
      S.exports = o;
      var p = ya(),
        l = Be(),
        t = Ln(),
        a = va();
      function o() {
        p.call(this);
      }
      (o.prototype = Object.create(p.prototype, {
        substringData: {
          value: function (f, s) {
            if (arguments.length < 2)
              throw new TypeError("Not enough arguments");
            return (
              (f = f >>> 0),
              (s = s >>> 0),
              (f > this.data.length || f < 0 || s < 0) && l.IndexSizeError(),
              this.data.substring(f, f + s)
            );
          },
        },
        appendData: {
          value: function (f) {
            if (arguments.length < 1)
              throw new TypeError("Not enough arguments");
            this.data += String(f);
          },
        },
        insertData: {
          value: function (f, s) {
            return this.replaceData(f, 0, s);
          },
        },
        deleteData: {
          value: function (f, s) {
            return this.replaceData(f, s, "");
          },
        },
        replaceData: {
          value: function (f, s, b) {
            var m = this.data,
              N = m.length;
            (f = f >>> 0),
              (s = s >>> 0),
              (b = String(b)),
              (f > N || f < 0) && l.IndexSizeError(),
              f + s > N && (s = N - f);
            var I = m.substring(0, f),
              H = m.substring(f + s);
            this.data = I + b + H;
          },
        },
        isEqual: {
          value: function (f) {
            return this._data === f._data;
          },
        },
        length: {
          get: function () {
            return this.data.length;
          },
        },
      })),
        Object.defineProperties(o.prototype, t),
        Object.defineProperties(o.prototype, a);
    },
  }),
  Na = le({
    "external/npm/node_modules/domino/lib/Text.js"(E, S) {
      "use strict";
      S.exports = a;
      var p = Be(),
        l = Ve(),
        t = $r();
      function a(c, f) {
        t.call(this),
          (this.nodeType = l.TEXT_NODE),
          (this.ownerDocument = c),
          (this._data = f),
          (this._index = void 0);
      }
      var o = {
        get: function () {
          return this._data;
        },
        set: function (c) {
          c == null ? (c = "") : (c = String(c)),
            c !== this._data &&
              ((this._data = c),
              this.rooted && this.ownerDocument.mutateValue(this),
              this.parentNode &&
                this.parentNode._textchangehook &&
                this.parentNode._textchangehook(this));
        },
      };
      a.prototype = Object.create(t.prototype, {
        nodeName: { value: "#text" },
        nodeValue: o,
        textContent: o,
        innerText: o,
        data: {
          get: o.get,
          set: function (c) {
            o.set.call(this, c === null ? "" : String(c));
          },
        },
        splitText: {
          value: function (f) {
            (f > this._data.length || f < 0) && p.IndexSizeError();
            var s = this._data.substring(f),
              b = this.ownerDocument.createTextNode(s);
            this.data = this.data.substring(0, f);
            var m = this.parentNode;
            return m !== null && m.insertBefore(b, this.nextSibling), b;
          },
        },
        wholeText: {
          get: function () {
            for (
              var f = this.textContent, s = this.nextSibling;
              s && s.nodeType === l.TEXT_NODE;
              s = s.nextSibling
            )
              f += s.textContent;
            return f;
          },
        },
        replaceWholeText: { value: p.nyi },
        clone: {
          value: function () {
            return new a(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  wa = le({
    "external/npm/node_modules/domino/lib/Comment.js"(E, S) {
      "use strict";
      S.exports = t;
      var p = Ve(),
        l = $r();
      function t(o, c) {
        l.call(this),
          (this.nodeType = p.COMMENT_NODE),
          (this.ownerDocument = o),
          (this._data = c);
      }
      var a = {
        get: function () {
          return this._data;
        },
        set: function (o) {
          o == null ? (o = "") : (o = String(o)),
            (this._data = o),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      t.prototype = Object.create(l.prototype, {
        nodeName: { value: "#comment" },
        nodeValue: a,
        textContent: a,
        innerText: a,
        data: {
          get: a.get,
          set: function (o) {
            a.set.call(this, o === null ? "" : String(o));
          },
        },
        clone: {
          value: function () {
            return new t(this.ownerDocument, this._data);
          },
        },
      });
    },
  }),
  Sa = le({
    "external/npm/node_modules/domino/lib/DocumentFragment.js"(E, S) {
      "use strict";
      S.exports = f;
      var p = Ve(),
        l = ar(),
        t = wn(),
        a = Er(),
        o = kn(),
        c = Be();
      function f(s) {
        t.call(this),
          (this.nodeType = p.DOCUMENT_FRAGMENT_NODE),
          (this.ownerDocument = s);
      }
      f.prototype = Object.create(t.prototype, {
        nodeName: { value: "#document-fragment" },
        nodeValue: {
          get: function () {
            return null;
          },
          set: function () {},
        },
        textContent: Object.getOwnPropertyDescriptor(
          a.prototype,
          "textContent",
        ),
        innerText: Object.getOwnPropertyDescriptor(a.prototype, "innerText"),
        querySelector: {
          value: function (s) {
            var b = this.querySelectorAll(s);
            return b.length ? b[0] : null;
          },
        },
        querySelectorAll: {
          value: function (s) {
            var b = Object.create(this);
            (b.isHTML = !0),
              (b.getElementsByTagName = a.prototype.getElementsByTagName),
              (b.nextElement = Object.getOwnPropertyDescriptor(
                a.prototype,
                "firstElementChild",
              ).get);
            var m = o(s, b);
            return m.item ? m : new l(m);
          },
        },
        clone: {
          value: function () {
            return new f(this.ownerDocument);
          },
        },
        isEqual: {
          value: function (b) {
            return !0;
          },
        },
        innerHTML: {
          get: function () {
            return this.serialize();
          },
          set: c.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: c.nyi,
        },
      });
    },
  }),
  ka = le({
    "external/npm/node_modules/domino/lib/ProcessingInstruction.js"(E, S) {
      "use strict";
      S.exports = t;
      var p = Ve(),
        l = $r();
      function t(o, c, f) {
        l.call(this),
          (this.nodeType = p.PROCESSING_INSTRUCTION_NODE),
          (this.ownerDocument = o),
          (this.target = c),
          (this._data = f);
      }
      var a = {
        get: function () {
          return this._data;
        },
        set: function (o) {
          o == null ? (o = "") : (o = String(o)),
            (this._data = o),
            this.rooted && this.ownerDocument.mutateValue(this);
        },
      };
      t.prototype = Object.create(l.prototype, {
        nodeName: {
          get: function () {
            return this.target;
          },
        },
        nodeValue: a,
        textContent: a,
        innerText: a,
        data: {
          get: a.get,
          set: function (o) {
            a.set.call(this, o === null ? "" : String(o));
          },
        },
        clone: {
          value: function () {
            return new t(this.ownerDocument, this.target, this._data);
          },
        },
        isEqual: {
          value: function (c) {
            return this.target === c.target && this._data === c._data;
          },
        },
      });
    },
  }),
  Jr = le({
    "external/npm/node_modules/domino/lib/NodeFilter.js"(E, S) {
      "use strict";
      var p = {
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
      S.exports = p.constructor = p.prototype = p;
    },
  }),
  La = le({
    "external/npm/node_modules/domino/lib/NodeTraversal.js"(E, S) {
      "use strict";
      var p = (S.exports = {
        nextSkippingChildren: l,
        nextAncestorSibling: t,
        next: a,
        previous: c,
        deepLastChild: o,
      });
      function l(f, s) {
        return f === s
          ? null
          : f.nextSibling !== null
            ? f.nextSibling
            : t(f, s);
      }
      function t(f, s) {
        for (f = f.parentNode; f !== null; f = f.parentNode) {
          if (f === s) return null;
          if (f.nextSibling !== null) return f.nextSibling;
        }
        return null;
      }
      function a(f, s) {
        var b;
        return (
          (b = f.firstChild),
          b !== null
            ? b
            : f === s
              ? null
              : ((b = f.nextSibling), b !== null ? b : t(f, s))
        );
      }
      function o(f) {
        for (; f.lastChild; ) f = f.lastChild;
        return f;
      }
      function c(f, s) {
        var b;
        return (
          (b = f.previousSibling),
          b !== null ? o(b) : ((b = f.parentNode), b === s ? null : b)
        );
      }
    },
  }),
  pi = le({
    "external/npm/node_modules/domino/lib/TreeWalker.js"(E, S) {
      "use strict";
      S.exports = b;
      var p = Ve(),
        l = Jr(),
        t = La(),
        a = Be(),
        o = {
          first: "firstChild",
          last: "lastChild",
          next: "firstChild",
          previous: "lastChild",
        },
        c = {
          first: "nextSibling",
          last: "previousSibling",
          next: "nextSibling",
          previous: "previousSibling",
        };
      function f(m, N) {
        var I, H, R, J, B;
        for (H = m._currentNode[o[N]]; H !== null; ) {
          if (((J = m._internalFilter(H)), J === l.FILTER_ACCEPT))
            return (m._currentNode = H), H;
          if (J === l.FILTER_SKIP && ((I = H[o[N]]), I !== null)) {
            H = I;
            continue;
          }
          for (; H !== null; ) {
            if (((B = H[c[N]]), B !== null)) {
              H = B;
              break;
            }
            if (
              ((R = H.parentNode),
              R === null || R === m.root || R === m._currentNode)
            )
              return null;
            H = R;
          }
        }
        return null;
      }
      function s(m, N) {
        var I, H, R;
        if (((I = m._currentNode), I === m.root)) return null;
        for (;;) {
          for (R = I[c[N]]; R !== null; ) {
            if (((I = R), (H = m._internalFilter(I)), H === l.FILTER_ACCEPT))
              return (m._currentNode = I), I;
            (R = I[o[N]]),
              (H === l.FILTER_REJECT || R === null) && (R = I[c[N]]);
          }
          if (
            ((I = I.parentNode),
            I === null ||
              I === m.root ||
              m._internalFilter(I) === l.FILTER_ACCEPT)
          )
            return null;
        }
      }
      function b(m, N, I) {
        (!m || !m.nodeType) && a.NotSupportedError(),
          (this._root = m),
          (this._whatToShow = Number(N) || 0),
          (this._filter = I || null),
          (this._active = !1),
          (this._currentNode = m);
      }
      Object.defineProperties(b.prototype, {
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
          set: function (N) {
            if (!(N instanceof p)) throw new TypeError("Not a Node");
            this._currentNode = N;
          },
        },
        _internalFilter: {
          value: function (N) {
            var I, H;
            if (
              (this._active && a.InvalidStateError(),
              !((1 << (N.nodeType - 1)) & this._whatToShow))
            )
              return l.FILTER_SKIP;
            if (((H = this._filter), H === null)) I = l.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof H == "function" ? (I = H(N)) : (I = H.acceptNode(N));
              } finally {
                this._active = !1;
              }
            }
            return +I;
          },
        },
        parentNode: {
          value: function () {
            for (var N = this._currentNode; N !== this.root; ) {
              if (((N = N.parentNode), N === null)) return null;
              if (this._internalFilter(N) === l.FILTER_ACCEPT)
                return (this._currentNode = N), N;
            }
            return null;
          },
        },
        firstChild: {
          value: function () {
            return f(this, "first");
          },
        },
        lastChild: {
          value: function () {
            return f(this, "last");
          },
        },
        previousSibling: {
          value: function () {
            return s(this, "previous");
          },
        },
        nextSibling: {
          value: function () {
            return s(this, "next");
          },
        },
        previousNode: {
          value: function () {
            var N, I, H, R;
            for (N = this._currentNode; N !== this._root; ) {
              for (H = N.previousSibling; H; H = N.previousSibling)
                if (
                  ((N = H),
                  (I = this._internalFilter(N)),
                  I !== l.FILTER_REJECT)
                ) {
                  for (
                    R = N.lastChild;
                    R &&
                    ((N = R),
                    (I = this._internalFilter(N)),
                    I !== l.FILTER_REJECT);
                    R = N.lastChild
                  );
                  if (I === l.FILTER_ACCEPT) return (this._currentNode = N), N;
                }
              if (N === this.root || N.parentNode === null) return null;
              if (
                ((N = N.parentNode),
                this._internalFilter(N) === l.FILTER_ACCEPT)
              )
                return (this._currentNode = N), N;
            }
            return null;
          },
        },
        nextNode: {
          value: function () {
            var N, I, H, R;
            (N = this._currentNode), (I = l.FILTER_ACCEPT);
            e: for (;;) {
              for (H = N.firstChild; H; H = N.firstChild) {
                if (
                  ((N = H),
                  (I = this._internalFilter(N)),
                  I === l.FILTER_ACCEPT)
                )
                  return (this._currentNode = N), N;
                if (I === l.FILTER_REJECT) break;
              }
              for (
                R = t.nextSkippingChildren(N, this.root);
                R;
                R = t.nextSkippingChildren(N, this.root)
              ) {
                if (
                  ((N = R),
                  (I = this._internalFilter(N)),
                  I === l.FILTER_ACCEPT)
                )
                  return (this._currentNode = N), N;
                if (I === l.FILTER_SKIP) continue e;
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
  mi = le({
    "external/npm/node_modules/domino/lib/NodeIterator.js"(E, S) {
      "use strict";
      S.exports = f;
      var p = Jr(),
        l = La(),
        t = Be();
      function a(s, b, m) {
        return m ? l.next(s, b) : s === b ? null : l.previous(s, null);
      }
      function o(s, b) {
        for (; b; b = b.parentNode) if (s === b) return !0;
        return !1;
      }
      function c(s, b) {
        var m, N;
        for (m = s._referenceNode, N = s._pointerBeforeReferenceNode; ; ) {
          if (N === b) N = !N;
          else if (((m = a(m, s._root, b)), m === null)) return null;
          var I = s._internalFilter(m);
          if (I === p.FILTER_ACCEPT) break;
        }
        return (s._referenceNode = m), (s._pointerBeforeReferenceNode = N), m;
      }
      function f(s, b, m) {
        (!s || !s.nodeType) && t.NotSupportedError(),
          (this._root = s),
          (this._referenceNode = s),
          (this._pointerBeforeReferenceNode = !0),
          (this._whatToShow = Number(b) || 0),
          (this._filter = m || null),
          (this._active = !1),
          s.doc._attachNodeIterator(this);
      }
      Object.defineProperties(f.prototype, {
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
          value: function (b) {
            var m, N;
            if (
              (this._active && t.InvalidStateError(),
              !((1 << (b.nodeType - 1)) & this._whatToShow))
            )
              return p.FILTER_SKIP;
            if (((N = this._filter), N === null)) m = p.FILTER_ACCEPT;
            else {
              this._active = !0;
              try {
                typeof N == "function" ? (m = N(b)) : (m = N.acceptNode(b));
              } finally {
                this._active = !1;
              }
            }
            return +m;
          },
        },
        _preremove: {
          value: function (b) {
            if (!o(b, this._root) && o(b, this._referenceNode)) {
              if (this._pointerBeforeReferenceNode) {
                for (var m = b; m.lastChild; ) m = m.lastChild;
                if (((m = l.next(m, this.root)), m)) {
                  this._referenceNode = m;
                  return;
                }
                this._pointerBeforeReferenceNode = !1;
              }
              if (b.previousSibling === null)
                this._referenceNode = b.parentNode;
              else {
                this._referenceNode = b.previousSibling;
                var N;
                for (
                  N = this._referenceNode.lastChild;
                  N;
                  N = this._referenceNode.lastChild
                )
                  this._referenceNode = N;
              }
            }
          },
        },
        nextNode: {
          value: function () {
            return c(this, !0);
          },
        },
        previousNode: {
          value: function () {
            return c(this, !1);
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
  Cn = le({
    "external/npm/node_modules/domino/lib/URL.js"(E, S) {
      "use strict";
      S.exports = p;
      function p(l) {
        if (!l) return Object.create(p.prototype);
        this.url = l.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, "");
        var t = p.pattern.exec(this.url);
        if (t) {
          if ((t[2] && (this.scheme = t[2]), t[4])) {
            var a = t[4].match(p.userinfoPattern);
            if (
              (a &&
                ((this.username = a[1]),
                (this.password = a[3]),
                (t[4] = t[4].substring(a[0].length))),
              t[4].match(p.portPattern))
            ) {
              var o = t[4].lastIndexOf(":");
              (this.host = t[4].substring(0, o)),
                (this.port = t[4].substring(o + 1));
            } else this.host = t[4];
          }
          t[5] && (this.path = t[5]),
            t[6] && (this.query = t[7]),
            t[8] && (this.fragment = t[9]);
        }
      }
      (p.pattern =
        /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/),
        (p.userinfoPattern = /^([^@:]*)(:([^@]*))?@/),
        (p.portPattern = /:\d+$/),
        (p.authorityPattern = /^[^:\/?#]+:\/\//),
        (p.hierarchyPattern = /^[^:\/?#]+:\//),
        (p.percentEncode = function (t) {
          var a = t.charCodeAt(0);
          if (a < 256) return "%" + a.toString(16);
          throw Error("can't percent-encode codepoints > 255 yet");
        }),
        (p.prototype = {
          constructor: p,
          isAbsolute: function () {
            return !!this.scheme;
          },
          isAuthorityBased: function () {
            return p.authorityPattern.test(this.url);
          },
          isHierarchical: function () {
            return p.hierarchyPattern.test(this.url);
          },
          toString: function () {
            var l = "";
            return (
              this.scheme !== void 0 && (l += this.scheme + ":"),
              this.isAbsolute() &&
                ((l += "//"),
                (this.username || this.password) &&
                  ((l += this.username || ""),
                  this.password && (l += ":" + this.password),
                  (l += "@")),
                this.host && (l += this.host)),
              this.port !== void 0 && (l += ":" + this.port),
              this.path !== void 0 && (l += this.path),
              this.query !== void 0 && (l += "?" + this.query),
              this.fragment !== void 0 && (l += "#" + this.fragment),
              l
            );
          },
          resolve: function (l) {
            var t = this,
              a = new p(l),
              o = new p();
            return (
              a.scheme !== void 0
                ? ((o.scheme = a.scheme),
                  (o.username = a.username),
                  (o.password = a.password),
                  (o.host = a.host),
                  (o.port = a.port),
                  (o.path = f(a.path)),
                  (o.query = a.query))
                : ((o.scheme = t.scheme),
                  a.host !== void 0
                    ? ((o.username = a.username),
                      (o.password = a.password),
                      (o.host = a.host),
                      (o.port = a.port),
                      (o.path = f(a.path)),
                      (o.query = a.query))
                    : ((o.username = t.username),
                      (o.password = t.password),
                      (o.host = t.host),
                      (o.port = t.port),
                      a.path
                        ? (a.path.charAt(0) === "/"
                            ? (o.path = f(a.path))
                            : ((o.path = c(t.path, a.path)),
                              (o.path = f(o.path))),
                          (o.query = a.query))
                        : ((o.path = t.path),
                          a.query !== void 0
                            ? (o.query = a.query)
                            : (o.query = t.query)))),
              (o.fragment = a.fragment),
              o.toString()
            );
            function c(s, b) {
              if (t.host !== void 0 && !t.path) return "/" + b;
              var m = s.lastIndexOf("/");
              return m === -1 ? b : s.substring(0, m + 1) + b;
            }
            function f(s) {
              if (!s) return s;
              for (var b = ""; s.length > 0; ) {
                if (s === "." || s === "..") {
                  s = "";
                  break;
                }
                var m = s.substring(0, 2),
                  N = s.substring(0, 3),
                  I = s.substring(0, 4);
                if (N === "../") s = s.substring(3);
                else if (m === "./") s = s.substring(2);
                else if (N === "/./") s = "/" + s.substring(3);
                else if (m === "/." && s.length === 2) s = "/";
                else if (I === "/../" || (N === "/.." && s.length === 3))
                  (s = "/" + s.substring(4)), (b = b.replace(/\/?[^\/]*$/, ""));
                else {
                  var H = s.match(/(\/?([^\/]*))/)[0];
                  (b += H), (s = s.substring(H.length));
                }
              }
              return b;
            }
          },
        });
    },
  }),
  gi = le({
    "external/npm/node_modules/domino/lib/CustomEvent.js"(E, S) {
      "use strict";
      S.exports = l;
      var p = br();
      function l(t, a) {
        p.call(this, t, a);
      }
      l.prototype = Object.create(p.prototype, { constructor: { value: l } });
    },
  }),
  Ca = le({
    "external/npm/node_modules/domino/lib/events.js"(E, S) {
      "use strict";
      S.exports = {
        Event: br(),
        UIEvent: da(),
        MouseEvent: pa(),
        CustomEvent: gi(),
      };
    },
  }),
  _i = le({
    "external/npm/node_modules/domino/lib/style_parser.js"(E) {
      "use strict";
      Object.defineProperty(E, "__esModule", { value: !0 }),
        (E.hyphenate = E.parse = void 0);
      function S(l) {
        let t = [],
          a = 0,
          o = 0,
          c = 0,
          f = 0,
          s = 0,
          b = null;
        for (; a < l.length; )
          switch (l.charCodeAt(a++)) {
            case 40:
              o++;
              break;
            case 41:
              o--;
              break;
            case 39:
              c === 0
                ? (c = 39)
                : c === 39 && l.charCodeAt(a - 1) !== 92 && (c = 0);
              break;
            case 34:
              c === 0
                ? (c = 34)
                : c === 34 && l.charCodeAt(a - 1) !== 92 && (c = 0);
              break;
            case 58:
              !b &&
                o === 0 &&
                c === 0 &&
                ((b = p(l.substring(s, a - 1).trim())), (f = a));
              break;
            case 59:
              if (b && f > 0 && o === 0 && c === 0) {
                let N = l.substring(f, a - 1).trim();
                t.push(b, N), (s = a), (f = 0), (b = null);
              }
              break;
          }
        if (b && f) {
          let m = l.slice(f).trim();
          t.push(b, m);
        }
        return t;
      }
      E.parse = S;
      function p(l) {
        return l
          .replace(/[a-z][A-Z]/g, (t) => t.charAt(0) + "-" + t.charAt(1))
          .toLowerCase();
      }
      E.hyphenate = p;
    },
  }),
  Dn = le({
    "external/npm/node_modules/domino/lib/CSSStyleDeclaration.js"(E, S) {
      "use strict";
      var { parse: p } = _i();
      S.exports = function (f) {
        let s = new t(f),
          b = {
            get: function (m, N) {
              return N in m ? m[N] : m.getPropertyValue(l(N));
            },
            has: function (m, N) {
              return !0;
            },
            set: function (m, N, I) {
              return N in m ? (m[N] = I) : m.setProperty(l(N), I ?? void 0), !0;
            },
          };
        return new Proxy(s, b);
      };
      function l(f) {
        return f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      }
      function t(f) {
        this._element = f;
      }
      var a = "!important";
      function o(f) {
        let s = { property: {}, priority: {} };
        if (!f) return s;
        let b = p(f);
        if (b.length < 2) return s;
        for (let m = 0; m < b.length; m += 2) {
          let N = b[m],
            I = b[m + 1];
          I.endsWith(a) &&
            ((s.priority[N] = "important"), (I = I.slice(0, -a.length).trim())),
            (s.property[N] = I);
        }
        return s;
      }
      var c = {};
      t.prototype = Object.create(Object.prototype, {
        _parsed: {
          get: function () {
            if (!this._parsedStyles || this.cssText !== this._lastParsedText) {
              var f = this.cssText;
              (this._parsedStyles = o(f)),
                (this._lastParsedText = f),
                delete this._names;
            }
            return this._parsedStyles;
          },
        },
        _serialize: {
          value: function () {
            var f = this._parsed,
              s = "";
            for (var b in f.property)
              s && (s += " "),
                (s += b + ": " + f.property[b]),
                f.priority[b] && (s += " !" + f.priority[b]),
                (s += ";");
            (this.cssText = s), (this._lastParsedText = s), delete this._names;
          },
        },
        cssText: {
          get: function () {
            return this._element.getAttribute("style");
          },
          set: function (f) {
            this._element.setAttribute("style", f);
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
          value: function (f) {
            return (
              this._names ||
                (this._names = Object.getOwnPropertyNames(
                  this._parsed.property,
                )),
              this._names[f]
            );
          },
        },
        getPropertyValue: {
          value: function (f) {
            return (f = f.toLowerCase()), this._parsed.property[f] || "";
          },
        },
        getPropertyPriority: {
          value: function (f) {
            return (f = f.toLowerCase()), this._parsed.priority[f] || "";
          },
        },
        setProperty: {
          value: function (f, s, b) {
            if (
              ((f = f.toLowerCase()),
              s == null && (s = ""),
              b == null && (b = ""),
              s !== c && (s = "" + s),
              (s = s.trim()),
              s === "")
            ) {
              this.removeProperty(f);
              return;
            }
            if (!(b !== "" && b !== c && !/^important$/i.test(b))) {
              var m = this._parsed;
              if (s === c) {
                if (!m.property[f]) return;
                b !== "" ? (m.priority[f] = "important") : delete m.priority[f];
              } else {
                if (s.includes(";") && !s.includes("data:")) return;
                var N = o(f + ":" + s);
                if (
                  Object.getOwnPropertyNames(N.property).length === 0 ||
                  Object.getOwnPropertyNames(N.priority).length !== 0
                )
                  return;
                for (var I in N.property)
                  (m.property[I] = N.property[I]),
                    b !== c &&
                      (b !== ""
                        ? (m.priority[I] = "important")
                        : m.priority[I] && delete m.priority[I]);
              }
              this._serialize();
            }
          },
        },
        setPropertyValue: {
          value: function (f, s) {
            return this.setProperty(f, s, c);
          },
        },
        setPropertyPriority: {
          value: function (f, s) {
            return this.setProperty(f, c, s);
          },
        },
        removeProperty: {
          value: function (f) {
            f = f.toLowerCase();
            var s = this._parsed;
            f in s.property &&
              (delete s.property[f], delete s.priority[f], this._serialize());
          },
        },
      });
    },
  }),
  Da = le({
    "external/npm/node_modules/domino/lib/URLUtils.js"(E, S) {
      "use strict";
      var p = Cn();
      S.exports = l;
      function l() {}
      (l.prototype = Object.create(Object.prototype, {
        _url: {
          get: function () {
            return new p(this.href);
          },
        },
        protocol: {
          get: function () {
            var t = this._url;
            return t && t.scheme ? t.scheme + ":" : ":";
          },
          set: function (t) {
            var a = this.href,
              o = new p(a);
            o.isAbsolute() &&
              ((t = t.replace(/:+$/, "")),
              (t = t.replace(/[^-+\.a-zA-Z0-9]/g, p.percentEncode)),
              t.length > 0 && ((o.scheme = t), (a = o.toString()))),
              (this.href = a);
          },
        },
        host: {
          get: function () {
            var t = this._url;
            return t.isAbsolute() && t.isAuthorityBased()
              ? t.host + (t.port ? ":" + t.port : "")
              : "";
          },
          set: function (t) {
            var a = this.href,
              o = new p(a);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((t = t.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                p.percentEncode,
              )),
              t.length > 0 &&
                ((o.host = t), delete o.port, (a = o.toString()))),
              (this.href = a);
          },
        },
        hostname: {
          get: function () {
            var t = this._url;
            return t.isAbsolute() && t.isAuthorityBased() ? t.host : "";
          },
          set: function (t) {
            var a = this.href,
              o = new p(a);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((t = t.replace(/^\/+/, "")),
              (t = t.replace(
                /[^-+\._~!$&'()*,;:=a-zA-Z0-9]/g,
                p.percentEncode,
              )),
              t.length > 0 && ((o.host = t), (a = o.toString()))),
              (this.href = a);
          },
        },
        port: {
          get: function () {
            var t = this._url;
            return t.isAbsolute() && t.isAuthorityBased() && t.port !== void 0
              ? t.port
              : "";
          },
          set: function (t) {
            var a = this.href,
              o = new p(a);
            o.isAbsolute() &&
              o.isAuthorityBased() &&
              ((t = "" + t),
              (t = t.replace(/[^0-9].*$/, "")),
              (t = t.replace(/^0+/, "")),
              t.length === 0 && (t = "0"),
              parseInt(t, 10) <= 65535 && ((o.port = t), (a = o.toString()))),
              (this.href = a);
          },
        },
        pathname: {
          get: function () {
            var t = this._url;
            return t.isAbsolute() && t.isHierarchical() ? t.path : "";
          },
          set: function (t) {
            var a = this.href,
              o = new p(a);
            o.isAbsolute() &&
              o.isHierarchical() &&
              (t.charAt(0) !== "/" && (t = "/" + t),
              (t = t.replace(
                /[^-+\._~!$&'()*,;:=@\/a-zA-Z0-9]/g,
                p.percentEncode,
              )),
              (o.path = t),
              (a = o.toString())),
              (this.href = a);
          },
        },
        search: {
          get: function () {
            var t = this._url;
            return t.isAbsolute() && t.isHierarchical() && t.query !== void 0
              ? "?" + t.query
              : "";
          },
          set: function (t) {
            var a = this.href,
              o = new p(a);
            o.isAbsolute() &&
              o.isHierarchical() &&
              (t.charAt(0) === "?" && (t = t.substring(1)),
              (t = t.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                p.percentEncode,
              )),
              (o.query = t),
              (a = o.toString())),
              (this.href = a);
          },
        },
        hash: {
          get: function () {
            var t = this._url;
            return t == null || t.fragment == null || t.fragment === ""
              ? ""
              : "#" + t.fragment;
          },
          set: function (t) {
            var a = this.href,
              o = new p(a);
            t.charAt(0) === "#" && (t = t.substring(1)),
              (t = t.replace(
                /[^-+\._~!$&'()*,;:=@\/?a-zA-Z0-9]/g,
                p.percentEncode,
              )),
              (o.fragment = t),
              (a = o.toString()),
              (this.href = a);
          },
        },
        username: {
          get: function () {
            var t = this._url;
            return t.username || "";
          },
          set: function (t) {
            var a = this.href,
              o = new p(a);
            o.isAbsolute() &&
              ((t = t.replace(
                /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\:]/g,
                p.percentEncode,
              )),
              (o.username = t),
              (a = o.toString())),
              (this.href = a);
          },
        },
        password: {
          get: function () {
            var t = this._url;
            return t.password || "";
          },
          set: function (t) {
            var a = this.href,
              o = new p(a);
            o.isAbsolute() &&
              (t === ""
                ? (o.password = null)
                : ((t = t.replace(
                    /[\x00-\x1F\x7F-\uFFFF "#<>?`\/@\\]/g,
                    p.percentEncode,
                  )),
                  (o.password = t)),
              (a = o.toString())),
              (this.href = a);
          },
        },
        origin: {
          get: function () {
            var t = this._url;
            if (t == null) return "";
            var a = function (o) {
              var c = [t.scheme, t.host, +t.port || o];
              return c[0] + "://" + c[1] + (c[2] === o ? "" : ":" + c[2]);
            };
            switch (t.scheme) {
              case "ftp":
                return a(21);
              case "gopher":
                return a(70);
              case "http":
              case "ws":
                return a(80);
              case "https":
              case "wss":
                return a(443);
              default:
                return t.scheme + "://";
            }
          },
        },
      })),
        (l._inherit = function (t) {
          Object.getOwnPropertyNames(l.prototype).forEach(function (a) {
            if (!(a === "constructor" || a === "href")) {
              var o = Object.getOwnPropertyDescriptor(l.prototype, a);
              Object.defineProperty(t, a, o);
            }
          });
        });
    },
  }),
  Aa = le({
    "external/npm/node_modules/domino/lib/defineElement.js"(E, S) {
      "use strict";
      var p = ba(),
        l = Nn().isApiWritable;
      S.exports = function (c, f, s, b) {
        var m = c.ctor;
        if (m) {
          var N = c.props || {};
          if (c.attributes)
            for (var I in c.attributes) {
              var H = c.attributes[I];
              (typeof H != "object" || Array.isArray(H)) && (H = { type: H }),
                H.name || (H.name = I.toLowerCase()),
                (N[I] = p.property(H));
            }
          (N.constructor = { value: m, writable: l }),
            (m.prototype = Object.create((c.superclass || f).prototype, N)),
            c.events && o(m, c.events),
            (s[c.name] = m);
        } else m = f;
        return (
          (c.tags || (c.tag && [c.tag]) || []).forEach(function (R) {
            b[R] = m;
          }),
          m
        );
      };
      function t(c, f, s, b) {
        (this.body = c),
          (this.document = f),
          (this.form = s),
          (this.element = b);
      }
      t.prototype.build = function () {
        return () => {};
      };
      function a(c, f, s, b) {
        var m = c.ownerDocument || Object.create(null),
          N = c.form || Object.create(null);
        c[f] = new t(b, m, N, c).build();
      }
      function o(c, f) {
        var s = c.prototype;
        f.forEach(function (b) {
          Object.defineProperty(s, "on" + b, {
            get: function () {
              return this._getEventHandler(b);
            },
            set: function (m) {
              this._setEventHandler(b, m);
            },
          }),
            p.registerChangeHandler(c, "on" + b, a);
        });
      }
    },
  }),
  An = le({
    "external/npm/node_modules/domino/lib/htmlelts.js"(E) {
      "use strict";
      var S = Ve(),
        p = Er(),
        l = Dn(),
        t = Be(),
        a = Da(),
        o = Aa(),
        c = (E.elements = {}),
        f = Object.create(null);
      E.createElement = function (T, g, k) {
        var _ = f[g] || J;
        return new _(T, g, k);
      };
      function s(T) {
        return o(T, R, c, f);
      }
      function b(T) {
        return {
          get: function () {
            var g = this._getattr(T);
            if (g === null) return "";
            var k = this.doc._resolve(g);
            return k === null ? g : k;
          },
          set: function (g) {
            this._setattr(T, g);
          },
        };
      }
      function m(T) {
        return {
          get: function () {
            var g = this._getattr(T);
            return g === null
              ? null
              : g.toLowerCase() === "use-credentials"
                ? "use-credentials"
                : "anonymous";
          },
          set: function (g) {
            g == null ? this.removeAttribute(T) : this._setattr(T, g);
          },
        };
      }
      var N = {
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
        I = {
          A: !0,
          LINK: !0,
          BUTTON: !0,
          INPUT: !0,
          SELECT: !0,
          TEXTAREA: !0,
          COMMAND: !0,
        },
        H = function (T, g, k) {
          R.call(this, T, g, k), (this._form = null);
        },
        R = (E.HTMLElement = s({
          superclass: p,
          name: "HTMLElement",
          ctor: function (g, k, _) {
            p.call(this, g, k, t.NAMESPACE.HTML, _);
          },
          props: {
            dangerouslySetInnerHTML: {
              set: function (T) {
                this._innerHTML = T;
              },
            },
            innerHTML: {
              get: function () {
                return this.serialize();
              },
              set: function (T) {
                var g = this.ownerDocument.implementation.mozHTMLParser(
                  this.ownerDocument._address,
                  this,
                );
                g.parse(T === null ? "" : String(T), !0);
                for (
                  var k = this instanceof f.template ? this.content : this;
                  k.hasChildNodes();

                )
                  k.removeChild(k.firstChild);
                k.appendChild(g._asDocumentFragment());
              },
            },
            style: {
              get: function () {
                return this._style || (this._style = new l(this)), this._style;
              },
              set: function (T) {
                T == null && (T = ""), this._setattr("style", String(T));
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
                    var T = this.ownerDocument.createEvent("MouseEvent");
                    T.initMouseEvent(
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
                    var g = this.dispatchEvent(T);
                    g
                      ? this._post_click_activation_steps &&
                        this._post_click_activation_steps(T)
                      : this._cancelled_activation_steps &&
                        this._cancelled_activation_steps();
                  } finally {
                    this._click_in_progress = !1;
                  }
                }
              },
            },
            submit: { value: t.nyi },
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
                return this.tagName in I || this.contentEditable ? 0 : -1;
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
        J = s({
          name: "HTMLUnknownElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
        }),
        B = {
          form: {
            get: function () {
              return this._form;
            },
          },
        };
      s({
        tag: "a",
        name: "HTMLAnchorElement",
        ctor: function (g, k, _) {
          R.call(this, g, k, _);
        },
        props: {
          _post_click_activation_steps: {
            value: function (T) {
              this.href &&
                (this.ownerDocument.defaultView.location = this.href);
            },
          },
        },
        attributes: {
          href: b,
          ping: String,
          download: String,
          target: String,
          rel: String,
          media: String,
          hreflang: String,
          type: String,
          referrerPolicy: N,
          coords: String,
          charset: String,
          name: String,
          rev: String,
          shape: String,
        },
      }),
        a._inherit(f.a.prototype),
        s({
          tag: "area",
          name: "HTMLAreaElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            alt: String,
            target: String,
            download: String,
            rel: String,
            media: String,
            href: b,
            hreflang: String,
            type: String,
            shape: String,
            coords: String,
            ping: String,
            referrerPolicy: N,
            noHref: Boolean,
          },
        }),
        a._inherit(f.area.prototype),
        s({
          tag: "br",
          name: "HTMLBRElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { clear: String },
        }),
        s({
          tag: "base",
          name: "HTMLBaseElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { target: String },
        }),
        s({
          tag: "body",
          name: "HTMLBodyElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
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
        s({
          tag: "button",
          name: "HTMLButtonElement",
          ctor: function (g, k, _) {
            H.call(this, g, k, _);
          },
          props: B,
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
            formAction: b,
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
        s({
          tag: "dl",
          name: "HTMLDListElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { compact: Boolean },
        }),
        s({
          tag: "data",
          name: "HTMLDataElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { value: String },
        }),
        s({
          tag: "datalist",
          name: "HTMLDataListElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
        }),
        s({
          tag: "details",
          name: "HTMLDetailsElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { open: Boolean },
        }),
        s({
          tag: "div",
          name: "HTMLDivElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { align: String },
        }),
        s({
          tag: "embed",
          name: "HTMLEmbedElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            src: b,
            type: String,
            width: String,
            height: String,
            align: String,
            name: String,
          },
        }),
        s({
          tag: "fieldset",
          name: "HTMLFieldSetElement",
          ctor: function (g, k, _) {
            H.call(this, g, k, _);
          },
          props: B,
          attributes: { disabled: Boolean, name: String },
        }),
        s({
          tag: "form",
          name: "HTMLFormElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
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
        s({
          tag: "hr",
          name: "HTMLHRElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            align: String,
            color: String,
            noShade: Boolean,
            size: String,
            width: String,
          },
        }),
        s({
          tag: "head",
          name: "HTMLHeadElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
        }),
        s({
          tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
          name: "HTMLHeadingElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { align: String },
        }),
        s({
          tag: "html",
          name: "HTMLHtmlElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { xmlns: b, version: String },
        }),
        s({
          tag: "iframe",
          name: "HTMLIFrameElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            src: b,
            srcdoc: String,
            name: String,
            width: String,
            height: String,
            seamless: Boolean,
            allow: Boolean,
            allowFullscreen: Boolean,
            allowUserMedia: Boolean,
            allowPaymentRequest: Boolean,
            referrerPolicy: N,
            loading: { type: ["eager", "lazy"], treatNullAsEmptyString: !0 },
            align: String,
            scrolling: String,
            frameBorder: String,
            longDesc: b,
            marginHeight: { type: String, treatNullAsEmptyString: !0 },
            marginWidth: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        s({
          tag: "img",
          name: "HTMLImageElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            alt: String,
            src: b,
            srcset: String,
            crossOrigin: m,
            useMap: String,
            isMap: Boolean,
            sizes: String,
            height: { type: "unsigned long", default: 0 },
            width: { type: "unsigned long", default: 0 },
            referrerPolicy: N,
            loading: { type: ["eager", "lazy"], missing: "" },
            name: String,
            lowsrc: b,
            align: String,
            hspace: { type: "unsigned long", default: 0 },
            vspace: { type: "unsigned long", default: 0 },
            longDesc: b,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        s({
          tag: "input",
          name: "HTMLInputElement",
          ctor: function (g, k, _) {
            H.call(this, g, k, _);
          },
          props: {
            form: B.form,
            _post_click_activation_steps: {
              value: function (T) {
                if (this.type === "checkbox") this.checked = !this.checked;
                else if (this.type === "radio")
                  for (
                    var g = this.form.getElementsByName(this.name),
                      k = g.length - 1;
                    k >= 0;
                    k--
                  ) {
                    var _ = g[k];
                    _.checked = _ === this;
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
            src: b,
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
        s({
          tag: "keygen",
          name: "HTMLKeygenElement",
          ctor: function (g, k, _) {
            H.call(this, g, k, _);
          },
          props: B,
          attributes: {
            name: String,
            disabled: Boolean,
            autofocus: Boolean,
            challenge: String,
            keytype: { type: ["rsa"], missing: "" },
          },
        }),
        s({
          tag: "li",
          name: "HTMLLIElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { value: { type: "long", default: 0 }, type: String },
        }),
        s({
          tag: "label",
          name: "HTMLLabelElement",
          ctor: function (g, k, _) {
            H.call(this, g, k, _);
          },
          props: B,
          attributes: { htmlFor: { name: "for", type: String } },
        }),
        s({
          tag: "legend",
          name: "HTMLLegendElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { align: String },
        }),
        s({
          tag: "link",
          name: "HTMLLinkElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            href: b,
            rel: String,
            media: String,
            hreflang: String,
            type: String,
            crossOrigin: m,
            nonce: String,
            integrity: String,
            referrerPolicy: N,
            imageSizes: String,
            imageSrcset: String,
            charset: String,
            rev: String,
            target: String,
          },
        }),
        s({
          tag: "map",
          name: "HTMLMapElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { name: String },
        }),
        s({
          tag: "menu",
          name: "HTMLMenuElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            type: { type: ["context", "popup", "toolbar"], missing: "toolbar" },
            label: String,
            compact: Boolean,
          },
        }),
        s({
          tag: "meta",
          name: "HTMLMetaElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            name: String,
            content: String,
            httpEquiv: { name: "http-equiv", type: String },
            scheme: String,
          },
        }),
        s({
          tag: "meter",
          name: "HTMLMeterElement",
          ctor: function (g, k, _) {
            H.call(this, g, k, _);
          },
          props: B,
        }),
        s({
          tags: ["ins", "del"],
          name: "HTMLModElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { cite: b, dateTime: String },
        }),
        s({
          tag: "ol",
          name: "HTMLOListElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          props: {
            _numitems: {
              get: function () {
                var T = 0;
                return (
                  this.childNodes.forEach(function (g) {
                    g.nodeType === S.ELEMENT_NODE && g.tagName === "LI" && T++;
                  }),
                  T
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
        s({
          tag: "object",
          name: "HTMLObjectElement",
          ctor: function (g, k, _) {
            H.call(this, g, k, _);
          },
          props: B,
          attributes: {
            data: b,
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
            codeBase: b,
            codeType: String,
            border: { type: String, treatNullAsEmptyString: !0 },
          },
        }),
        s({
          tag: "optgroup",
          name: "HTMLOptGroupElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { disabled: Boolean, label: String },
        }),
        s({
          tag: "option",
          name: "HTMLOptionElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          props: {
            form: {
              get: function () {
                for (
                  var T = this.parentNode;
                  T && T.nodeType === S.ELEMENT_NODE;

                ) {
                  if (T.localName === "select") return T.form;
                  T = T.parentNode;
                }
              },
            },
            value: {
              get: function () {
                return this._getattr("value") || this.text;
              },
              set: function (T) {
                this._setattr("value", T);
              },
            },
            text: {
              get: function () {
                return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim();
              },
              set: function (T) {
                this.textContent = T;
              },
            },
          },
          attributes: {
            disabled: Boolean,
            defaultSelected: { name: "selected", type: Boolean },
            label: String,
          },
        }),
        s({
          tag: "output",
          name: "HTMLOutputElement",
          ctor: function (g, k, _) {
            H.call(this, g, k, _);
          },
          props: B,
          attributes: { name: String },
        }),
        s({
          tag: "p",
          name: "HTMLParagraphElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { align: String },
        }),
        s({
          tag: "param",
          name: "HTMLParamElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            name: String,
            value: String,
            type: String,
            valueType: String,
          },
        }),
        s({
          tags: ["pre", "listing", "xmp"],
          name: "HTMLPreElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { width: { type: "long", default: 0 } },
        }),
        s({
          tag: "progress",
          name: "HTMLProgressElement",
          ctor: function (g, k, _) {
            H.call(this, g, k, _);
          },
          props: B,
          attributes: { max: { type: Number, float: !0, default: 1, min: 0 } },
        }),
        s({
          tags: ["q", "blockquote"],
          name: "HTMLQuoteElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { cite: b },
        }),
        s({
          tag: "script",
          name: "HTMLScriptElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          props: {
            text: {
              get: function () {
                for (
                  var T = "", g = 0, k = this.childNodes.length;
                  g < k;
                  g++
                ) {
                  var _ = this.childNodes[g];
                  _.nodeType === S.TEXT_NODE && (T += _._data);
                }
                return T;
              },
              set: function (T) {
                this.removeChildren(),
                  T !== null &&
                    T !== "" &&
                    this.appendChild(this.ownerDocument.createTextNode(T));
              },
            },
          },
          attributes: {
            src: b,
            type: String,
            charset: String,
            referrerPolicy: N,
            defer: Boolean,
            async: Boolean,
            nomodule: Boolean,
            crossOrigin: m,
            nonce: String,
            integrity: String,
          },
        }),
        s({
          tag: "select",
          name: "HTMLSelectElement",
          ctor: function (g, k, _) {
            H.call(this, g, k, _);
          },
          props: {
            form: B.form,
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
        s({
          tag: "span",
          name: "HTMLSpanElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
        }),
        s({
          tag: "style",
          name: "HTMLStyleElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { media: String, type: String, scoped: Boolean },
        }),
        s({
          tag: "caption",
          name: "HTMLTableCaptionElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { align: String },
        }),
        s({
          name: "HTMLTableCellElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
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
        s({
          tags: ["col", "colgroup"],
          name: "HTMLTableColElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
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
        s({
          tag: "table",
          name: "HTMLTableElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
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
        s({
          tag: "template",
          name: "HTMLTemplateElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _),
              (this._contentFragment = g._templateDoc.createDocumentFragment());
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
        s({
          tag: "tr",
          name: "HTMLTableRowElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
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
        s({
          tags: ["thead", "tfoot", "tbody"],
          name: "HTMLTableSectionElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
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
        s({
          tag: "textarea",
          name: "HTMLTextAreaElement",
          ctor: function (g, k, _) {
            H.call(this, g, k, _);
          },
          props: {
            form: B.form,
            type: {
              get: function () {
                return "textarea";
              },
            },
            defaultValue: {
              get: function () {
                return this.textContent;
              },
              set: function (T) {
                this.textContent = T;
              },
            },
            value: {
              get: function () {
                return this.defaultValue;
              },
              set: function (T) {
                this.defaultValue = T;
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
        s({
          tag: "time",
          name: "HTMLTimeElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { dateTime: String, pubDate: Boolean },
        }),
        s({
          tag: "title",
          name: "HTMLTitleElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          props: {
            text: {
              get: function () {
                return this.textContent;
              },
            },
          },
        }),
        s({
          tag: "ul",
          name: "HTMLUListElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { type: String, compact: Boolean },
        }),
        s({
          name: "HTMLMediaElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            src: b,
            crossOrigin: m,
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
        s({
          name: "HTMLAudioElement",
          tag: "audio",
          superclass: c.HTMLMediaElement,
          ctor: function (g, k, _) {
            c.HTMLMediaElement.call(this, g, k, _);
          },
        }),
        s({
          name: "HTMLVideoElement",
          tag: "video",
          superclass: c.HTMLMediaElement,
          ctor: function (g, k, _) {
            c.HTMLMediaElement.call(this, g, k, _);
          },
          attributes: {
            poster: b,
            width: { type: "unsigned long", min: 0, default: 0 },
            height: { type: "unsigned long", min: 0, default: 0 },
          },
        }),
        s({
          tag: "td",
          name: "HTMLTableDataCellElement",
          superclass: c.HTMLTableCellElement,
          ctor: function (g, k, _) {
            c.HTMLTableCellElement.call(this, g, k, _);
          },
        }),
        s({
          tag: "th",
          name: "HTMLTableHeaderCellElement",
          superclass: c.HTMLTableCellElement,
          ctor: function (g, k, _) {
            c.HTMLTableCellElement.call(this, g, k, _);
          },
        }),
        s({
          tag: "frameset",
          name: "HTMLFrameSetElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
        }),
        s({
          tag: "frame",
          name: "HTMLFrameElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
        }),
        s({
          tag: "canvas",
          name: "HTMLCanvasElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          props: {
            getContext: { value: t.nyi },
            probablySupportsContext: { value: t.nyi },
            setContext: { value: t.nyi },
            transferControlToProxy: { value: t.nyi },
            toDataURL: { value: t.nyi },
            toBlob: { value: t.nyi },
          },
          attributes: {
            width: { type: "unsigned long", default: 300 },
            height: { type: "unsigned long", default: 150 },
          },
        }),
        s({
          tag: "dialog",
          name: "HTMLDialogElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          props: {
            show: { value: t.nyi },
            showModal: { value: t.nyi },
            close: { value: t.nyi },
          },
          attributes: { open: Boolean, returnValue: String },
        }),
        s({
          tag: "menuitem",
          name: "HTMLMenuItemElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          props: {
            _label: {
              get: function () {
                var T = this._getattr("label");
                return T !== null && T !== ""
                  ? T
                  : ((T = this.textContent),
                    T.replace(/[ \t\n\f\r]+/g, " ").trim());
              },
            },
            label: {
              get: function () {
                var T = this._getattr("label");
                return T !== null ? T : this._label;
              },
              set: function (T) {
                this._setattr("label", T);
              },
            },
          },
          attributes: {
            type: {
              type: ["command", "checkbox", "radio"],
              missing: "command",
            },
            icon: b,
            disabled: Boolean,
            checked: Boolean,
            radiogroup: String,
            default: Boolean,
          },
        }),
        s({
          tag: "source",
          name: "HTMLSourceElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            srcset: String,
            sizes: String,
            media: String,
            src: b,
            type: String,
            width: String,
            height: String,
          },
        }),
        s({
          tag: "track",
          name: "HTMLTrackElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            src: b,
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
            readyState: { get: t.nyi },
            track: { get: t.nyi },
          },
        }),
        s({
          tag: "font",
          name: "HTMLFontElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: {
            color: { type: String, treatNullAsEmptyString: !0 },
            face: { type: String },
            size: { type: String },
          },
        }),
        s({
          tag: "dir",
          name: "HTMLDirectoryElement",
          ctor: function (g, k, _) {
            R.call(this, g, k, _);
          },
          attributes: { compact: Boolean },
        }),
        s({
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
  Ma = le({
    "external/npm/node_modules/domino/lib/svg.js"(E) {
      "use strict";
      var S = Er(),
        p = Aa(),
        l = Be(),
        t = Dn(),
        a = (E.elements = {}),
        o = Object.create(null);
      E.createElement = function (s, b, m) {
        var N = o[b] || f;
        return new N(s, b, m);
      };
      function c(s) {
        return p(s, f, a, o);
      }
      var f = c({
        superclass: S,
        name: "SVGElement",
        ctor: function (b, m, N) {
          S.call(this, b, m, l.NAMESPACE.SVG, N);
        },
        props: {
          style: {
            get: function () {
              return this._style || (this._style = new t(this)), this._style;
            },
          },
        },
      });
      c({
        name: "SVGSVGElement",
        ctor: function (b, m, N) {
          f.call(this, b, m, N);
        },
        tag: "svg",
        props: {
          createSVGRect: {
            value: function () {
              return E.createElement(this.ownerDocument, "rect", null);
            },
          },
        },
      }),
        c({
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
  bi = le({
    "external/npm/node_modules/domino/lib/MutationConstants.js"(E, S) {
      "use strict";
      S.exports = {
        VALUE: 1,
        ATTR: 2,
        REMOVE_ATTR: 3,
        REMOVE: 4,
        MOVE: 5,
        INSERT: 6,
      };
    },
  }),
  Mn = le({
    "external/npm/node_modules/domino/lib/Document.js"(E, S) {
      "use strict";
      S.exports = G;
      var p = Ve(),
        l = ar(),
        t = wn(),
        a = Er(),
        o = Na(),
        c = wa(),
        f = br(),
        s = Sa(),
        b = ka(),
        m = en(),
        N = pi(),
        I = mi(),
        H = Jr(),
        R = Cn(),
        J = kn(),
        B = Ca(),
        T = Sn(),
        g = An(),
        k = Ma(),
        _ = Be(),
        ae = bi(),
        ne = _.NAMESPACE,
        Q = Nn().isApiWritable;
      function G(w, A) {
        t.call(this),
          (this.nodeType = p.DOCUMENT_NODE),
          (this.isHTML = w),
          (this._address = A || "about:blank"),
          (this.readyState = "loading"),
          (this.implementation = new m(this)),
          (this.ownerDocument = null),
          (this._contentType = w ? "text/html" : "application/xml"),
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
      var D = {
          event: "Event",
          customevent: "CustomEvent",
          uievent: "UIEvent",
          mouseevent: "MouseEvent",
        },
        P = {
          events: "event",
          htmlevents: "event",
          mouseevents: "mouseevent",
          mutationevents: "mutationevent",
          uievents: "uievent",
        },
        Z = function (w, A, X) {
          return {
            get: function () {
              var ge = w.call(this);
              return ge ? ge[A] : X;
            },
            set: function (ge) {
              var Me = w.call(this);
              Me && (Me[A] = ge);
            },
          };
        };
      function u(w, A) {
        var X, ge, Me;
        return (
          w === "" && (w = null),
          T.isValidQName(A) || _.InvalidCharacterError(),
          (X = null),
          (ge = A),
          (Me = A.indexOf(":")),
          Me >= 0 && ((X = A.substring(0, Me)), (ge = A.substring(Me + 1))),
          X !== null && w === null && _.NamespaceError(),
          X === "xml" && w !== ne.XML && _.NamespaceError(),
          (X === "xmlns" || A === "xmlns") &&
            w !== ne.XMLNS &&
            _.NamespaceError(),
          w === ne.XMLNS &&
            !(X === "xmlns" || A === "xmlns") &&
            _.NamespaceError(),
          { namespace: w, prefix: X, localName: ge }
        );
      }
      G.prototype = Object.create(t.prototype, {
        _setMutationHandler: {
          value: function (w) {
            this.mutationHandler = w;
          },
        },
        _dispatchRendererEvent: {
          value: function (w, A, X) {
            var ge = this._nodes[w];
            ge && ge._dispatchEvent(new f(A, X), !0);
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
          set: _.nyi,
        },
        compatMode: {
          get: function () {
            return this._quirks ? "BackCompat" : "CSS1Compat";
          },
        },
        createTextNode: {
          value: function (w) {
            return new o(this, String(w));
          },
        },
        createComment: {
          value: function (w) {
            return new c(this, w);
          },
        },
        createDocumentFragment: {
          value: function () {
            return new s(this);
          },
        },
        createProcessingInstruction: {
          value: function (w, A) {
            return (
              (!T.isValidName(w) || A.indexOf("?>") !== -1) &&
                _.InvalidCharacterError(),
              new b(this, w, A)
            );
          },
        },
        createAttribute: {
          value: function (w) {
            return (
              (w = String(w)),
              T.isValidName(w) || _.InvalidCharacterError(),
              this.isHTML && (w = _.toASCIILowerCase(w)),
              new a._Attr(null, w, null, null, "")
            );
          },
        },
        createAttributeNS: {
          value: function (w, A) {
            (w = w == null || w === "" ? null : String(w)), (A = String(A));
            var X = u(w, A);
            return new a._Attr(null, X.localName, X.prefix, X.namespace, "");
          },
        },
        createElement: {
          value: function (w) {
            return (
              (w = String(w)),
              T.isValidName(w) || _.InvalidCharacterError(),
              this.isHTML
                ? (/[A-Z]/.test(w) && (w = _.toASCIILowerCase(w)),
                  g.createElement(this, w, null))
                : this.contentType === "application/xhtml+xml"
                  ? g.createElement(this, w, null)
                  : new a(this, w, null, null)
            );
          },
          writable: Q,
        },
        createElementNS: {
          value: function (w, A) {
            (w = w == null || w === "" ? null : String(w)), (A = String(A));
            var X = u(w, A);
            return this._createElementNS(X.localName, X.namespace, X.prefix);
          },
          writable: Q,
        },
        _createElementNS: {
          value: function (w, A, X) {
            return A === ne.HTML
              ? g.createElement(this, w, X)
              : A === ne.SVG
                ? k.createElement(this, w, X)
                : new a(this, w, A, X);
          },
        },
        createEvent: {
          value: function (A) {
            A = A.toLowerCase();
            var X = P[A] || A,
              ge = B[D[X]];
            if (ge) {
              var Me = new ge();
              return (Me._initialized = !1), Me;
            } else _.NotSupportedError();
          },
        },
        createTreeWalker: {
          value: function (w, A, X) {
            if (!w) throw new TypeError("root argument is required");
            if (!(w instanceof p)) throw new TypeError("root not a node");
            return (
              (A = A === void 0 ? H.SHOW_ALL : +A),
              (X = X === void 0 ? null : X),
              new N(w, A, X)
            );
          },
        },
        createNodeIterator: {
          value: function (w, A, X) {
            if (!w) throw new TypeError("root argument is required");
            if (!(w instanceof p)) throw new TypeError("root not a node");
            return (
              (A = A === void 0 ? H.SHOW_ALL : +A),
              (X = X === void 0 ? null : X),
              new I(w, A, X)
            );
          },
        },
        _attachNodeIterator: {
          value: function (w) {
            this._nodeIterators || (this._nodeIterators = []),
              this._nodeIterators.push(w);
          },
        },
        _detachNodeIterator: {
          value: function (w) {
            var A = this._nodeIterators.indexOf(w);
            this._nodeIterators.splice(A, 1);
          },
        },
        _preremoveNodeIterators: {
          value: function (w) {
            this._nodeIterators &&
              this._nodeIterators.forEach(function (A) {
                A._preremove(w);
              });
          },
        },
        _updateDocTypeElement: {
          value: function () {
            this.doctype = this.documentElement = null;
            for (var A = this.firstChild; A !== null; A = A.nextSibling)
              A.nodeType === p.DOCUMENT_TYPE_NODE
                ? (this.doctype = A)
                : A.nodeType === p.ELEMENT_NODE && (this.documentElement = A);
          },
        },
        insertBefore: {
          value: function (A, X) {
            return (
              p.prototype.insertBefore.call(this, A, X),
              this._updateDocTypeElement(),
              A
            );
          },
        },
        replaceChild: {
          value: function (A, X) {
            return (
              p.prototype.replaceChild.call(this, A, X),
              this._updateDocTypeElement(),
              X
            );
          },
        },
        removeChild: {
          value: function (A) {
            return (
              p.prototype.removeChild.call(this, A),
              this._updateDocTypeElement(),
              A
            );
          },
        },
        getElementById: {
          value: function (w) {
            var A = this.byId[w];
            return A ? (A instanceof re ? A.getFirst() : A) : null;
          },
        },
        _hasMultipleElementsWithId: {
          value: function (w) {
            return this.byId[w] instanceof re;
          },
        },
        getElementsByName: { value: a.prototype.getElementsByName },
        getElementsByTagName: { value: a.prototype.getElementsByTagName },
        getElementsByTagNameNS: { value: a.prototype.getElementsByTagNameNS },
        getElementsByClassName: { value: a.prototype.getElementsByClassName },
        adoptNode: {
          value: function (A) {
            return (
              A.nodeType === p.DOCUMENT_NODE && _.NotSupportedError(),
              A.nodeType === p.ATTRIBUTE_NODE ||
                (A.parentNode && A.parentNode.removeChild(A),
                A.ownerDocument !== this && j(A, this)),
              A
            );
          },
        },
        importNode: {
          value: function (A, X) {
            return this.adoptNode(A.cloneNode(X));
          },
          writable: Q,
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
        domain: { get: _.nyi, set: _.nyi },
        referrer: { get: _.nyi },
        cookie: { get: _.nyi, set: _.nyi },
        lastModified: { get: _.nyi },
        location: {
          get: function () {
            return this.defaultView ? this.defaultView.location : null;
          },
          set: _.nyi,
        },
        _titleElement: {
          get: function () {
            return this.getElementsByTagName("title").item(0) || null;
          },
        },
        title: {
          get: function () {
            var w = this._titleElement,
              A = w ? w.textContent : "";
            return A.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "");
          },
          set: function (w) {
            var A = this._titleElement,
              X = this.head;
            (!A && !X) ||
              (A || ((A = this.createElement("title")), X.appendChild(A)),
              (A.textContent = w));
          },
        },
        dir: Z(
          function () {
            var w = this.documentElement;
            if (w && w.tagName === "HTML") return w;
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
            return n(this.documentElement, "body");
          },
          set: _.nyi,
        },
        head: {
          get: function () {
            return n(this.documentElement, "head");
          },
        },
        images: { get: _.nyi },
        embeds: { get: _.nyi },
        plugins: { get: _.nyi },
        links: { get: _.nyi },
        forms: { get: _.nyi },
        scripts: { get: _.nyi },
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
          set: _.nyi,
        },
        outerHTML: {
          get: function () {
            return this.serialize();
          },
          set: _.nyi,
        },
        write: {
          value: function (w) {
            if ((this.isHTML || _.InvalidStateError(), !!this._parser)) {
              this._parser;
              var A = arguments.join("");
              this._parser.parse(A);
            }
          },
        },
        writeln: {
          value: function (A) {
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
              this._dispatchEvent(new f("readystatechange"), !0),
              this._dispatchEvent(new f("DOMContentLoaded"), !0),
              (this.readyState = "complete"),
              this._dispatchEvent(new f("readystatechange"), !0),
              this.defaultView &&
                this.defaultView._dispatchEvent(new f("load"), !0);
          },
        },
        clone: {
          value: function () {
            var A = new G(this.isHTML, this._address);
            return (
              (A._quirks = this._quirks),
              (A._contentType = this._contentType),
              A
            );
          },
        },
        cloneNode: {
          value: function (A) {
            var X = p.prototype.cloneNode.call(this, !1);
            if (A)
              for (var ge = this.firstChild; ge !== null; ge = ge.nextSibling)
                X._appendChild(X.importNode(ge, !0));
            return X._updateDocTypeElement(), X;
          },
        },
        isEqual: {
          value: function (A) {
            return !0;
          },
        },
        mutateValue: {
          value: function (w) {
            this.mutationHandler &&
              this.mutationHandler({ type: ae.VALUE, target: w, data: w.data });
          },
        },
        mutateAttr: {
          value: function (w, A) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ae.ATTR,
                target: w.ownerElement,
                attr: w,
              });
          },
        },
        mutateRemoveAttr: {
          value: function (w) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ae.REMOVE_ATTR,
                target: w.ownerElement,
                attr: w,
              });
          },
        },
        mutateRemove: {
          value: function (w) {
            this.mutationHandler &&
              this.mutationHandler({
                type: ae.REMOVE,
                target: w.parentNode,
                node: w,
              }),
              C(w);
          },
        },
        mutateInsert: {
          value: function (w) {
            v(w),
              this.mutationHandler &&
                this.mutationHandler({
                  type: ae.INSERT,
                  target: w.parentNode,
                  node: w,
                });
          },
        },
        mutateMove: {
          value: function (w) {
            this.mutationHandler &&
              this.mutationHandler({ type: ae.MOVE, target: w });
          },
        },
        addId: {
          value: function (A, X) {
            var ge = this.byId[A];
            ge
              ? (ge instanceof re || ((ge = new re(ge)), (this.byId[A] = ge)),
                ge.add(X))
              : (this.byId[A] = X);
          },
        },
        delId: {
          value: function (A, X) {
            var ge = this.byId[A];
            _.assert(ge),
              ge instanceof re
                ? (ge.del(X),
                  ge.length === 1 && (this.byId[A] = ge.downgrade()))
                : (this.byId[A] = void 0);
          },
        },
        _resolve: {
          value: function (w) {
            return new R(this._documentBaseURL).resolve(w);
          },
        },
        _documentBaseURL: {
          get: function () {
            var w = this._address;
            w === "about:blank" && (w = "/");
            var A = this.querySelector("base[href]");
            return A ? new R(w).resolve(A.getAttribute("href")) : w;
          },
        },
        _templateDoc: {
          get: function () {
            if (!this._templateDocCache) {
              var w = new G(this.isHTML, this._address);
              this._templateDocCache = w._templateDocCache = w;
            }
            return this._templateDocCache;
          },
        },
        querySelector: {
          value: function (w) {
            return J(w, this)[0];
          },
        },
        querySelectorAll: {
          value: function (w) {
            var A = J(w, this);
            return A.item ? A : new l(A);
          },
        },
      });
      var i = [
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
      i.forEach(function (w) {
        Object.defineProperty(G.prototype, "on" + w, {
          get: function () {
            return this._getEventHandler(w);
          },
          set: function (A) {
            this._setEventHandler(w, A);
          },
        });
      });
      function n(w, A) {
        if (w && w.isHTML) {
          for (var X = w.firstChild; X !== null; X = X.nextSibling)
            if (
              X.nodeType === p.ELEMENT_NODE &&
              X.localName === A &&
              X.namespaceURI === ne.HTML
            )
              return X;
        }
        return null;
      }
      function d(w) {
        if (
          ((w._nid = w.ownerDocument._nextnid++),
          (w.ownerDocument._nodes[w._nid] = w),
          w.nodeType === p.ELEMENT_NODE)
        ) {
          var A = w.getAttribute("id");
          A && w.ownerDocument.addId(A, w), w._roothook && w._roothook();
        }
      }
      function h(w) {
        if (w.nodeType === p.ELEMENT_NODE) {
          var A = w.getAttribute("id");
          A && w.ownerDocument.delId(A, w);
        }
        (w.ownerDocument._nodes[w._nid] = void 0), (w._nid = void 0);
      }
      function v(w) {
        if ((d(w), w.nodeType === p.ELEMENT_NODE))
          for (var A = w.firstChild; A !== null; A = A.nextSibling) v(A);
      }
      function C(w) {
        h(w);
        for (var A = w.firstChild; A !== null; A = A.nextSibling) C(A);
      }
      function j(w, A) {
        (w.ownerDocument = A),
          (w._lastModTime = void 0),
          Object.prototype.hasOwnProperty.call(w, "_tagName") &&
            (w._tagName = void 0);
        for (var X = w.firstChild; X !== null; X = X.nextSibling) j(X, A);
      }
      function re(w) {
        (this.nodes = Object.create(null)),
          (this.nodes[w._nid] = w),
          (this.length = 1),
          (this.firstNode = void 0);
      }
      (re.prototype.add = function (w) {
        this.nodes[w._nid] ||
          ((this.nodes[w._nid] = w), this.length++, (this.firstNode = void 0));
      }),
        (re.prototype.del = function (w) {
          this.nodes[w._nid] &&
            (delete this.nodes[w._nid],
            this.length--,
            (this.firstNode = void 0));
        }),
        (re.prototype.getFirst = function () {
          if (!this.firstNode) {
            var w;
            for (w in this.nodes)
              (this.firstNode === void 0 ||
                this.firstNode.compareDocumentPosition(this.nodes[w]) &
                  p.DOCUMENT_POSITION_PRECEDING) &&
                (this.firstNode = this.nodes[w]);
          }
          return this.firstNode;
        }),
        (re.prototype.downgrade = function () {
          if (this.length === 1) {
            var w;
            for (w in this.nodes) return this.nodes[w];
          }
          return this;
        });
    },
  }),
  xn = le({
    "external/npm/node_modules/domino/lib/DocumentType.js"(E, S) {
      "use strict";
      S.exports = a;
      var p = Ve(),
        l = ya(),
        t = Ln();
      function a(o, c, f, s) {
        l.call(this),
          (this.nodeType = p.DOCUMENT_TYPE_NODE),
          (this.ownerDocument = o || null),
          (this.name = c),
          (this.publicId = f || ""),
          (this.systemId = s || "");
      }
      (a.prototype = Object.create(l.prototype, {
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
            return new a(
              this.ownerDocument,
              this.name,
              this.publicId,
              this.systemId,
            );
          },
        },
        isEqual: {
          value: function (c) {
            return (
              this.name === c.name &&
              this.publicId === c.publicId &&
              this.systemId === c.systemId
            );
          },
        },
      })),
        Object.defineProperties(a.prototype, t);
    },
  }),
  In = le({
    "external/npm/node_modules/domino/lib/HTMLParser.js"(E, S) {
      "use strict";
      S.exports = de;
      var p = Mn(),
        l = xn(),
        t = Ve(),
        a = Be().NAMESPACE,
        o = An(),
        c = o.elements,
        f = Function.prototype.apply.bind(Array.prototype.push),
        s = -1,
        b = 1,
        m = 2,
        N = 3,
        I = 4,
        H = 5,
        R = [],
        J =
          /^HTML$|^-\/\/W3O\/\/DTD W3 HTML Strict 3\.0\/\/EN\/\/$|^-\/W3C\/DTD HTML 4\.0 Transitional\/EN$|^\+\/\/Silmaril\/\/dtd html Pro v0r11 19970101\/\/|^-\/\/AdvaSoft Ltd\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/AS\/\/DTD HTML 3\.0 asWedit \+ extensions\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML 2\.0 Strict\/\/|^-\/\/IETF\/\/DTD HTML 2\.0\/\/|^-\/\/IETF\/\/DTD HTML 2\.1E\/\/|^-\/\/IETF\/\/DTD HTML 3\.0\/\/|^-\/\/IETF\/\/DTD HTML 3\.2 Final\/\/|^-\/\/IETF\/\/DTD HTML 3\.2\/\/|^-\/\/IETF\/\/DTD HTML 3\/\/|^-\/\/IETF\/\/DTD HTML Level 0\/\/|^-\/\/IETF\/\/DTD HTML Level 1\/\/|^-\/\/IETF\/\/DTD HTML Level 2\/\/|^-\/\/IETF\/\/DTD HTML Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 0\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 1\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 2\/\/|^-\/\/IETF\/\/DTD HTML Strict Level 3\/\/|^-\/\/IETF\/\/DTD HTML Strict\/\/|^-\/\/IETF\/\/DTD HTML\/\/|^-\/\/Metrius\/\/DTD Metrius Presentational\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 2\.0 Tables\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML Strict\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 HTML\/\/|^-\/\/Microsoft\/\/DTD Internet Explorer 3\.0 Tables\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD HTML\/\/|^-\/\/Netscape Comm\. Corp\.\/\/DTD Strict HTML\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML 2\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended 1\.0\/\/|^-\/\/O'Reilly and Associates\/\/DTD HTML Extended Relaxed 1\.0\/\/|^-\/\/SoftQuad Software\/\/DTD HoTMetaL PRO 6\.0::19990601::extensions to HTML 4\.0\/\/|^-\/\/SoftQuad\/\/DTD HoTMetaL PRO 4\.0::19971010::extensions to HTML 4\.0\/\/|^-\/\/Spyglass\/\/DTD HTML 2\.0 Extended\/\/|^-\/\/SQ\/\/DTD HTML 2\.0 HoTMetaL \+ extensions\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava HTML\/\/|^-\/\/Sun Microsystems Corp\.\/\/DTD HotJava Strict HTML\/\/|^-\/\/W3C\/\/DTD HTML 3 1995-03-24\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Draft\/\/|^-\/\/W3C\/\/DTD HTML 3\.2 Final\/\/|^-\/\/W3C\/\/DTD HTML 3\.2\/\/|^-\/\/W3C\/\/DTD HTML 3\.2S Draft\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.0 Transitional\/\/|^-\/\/W3C\/\/DTD HTML Experimental 19960712\/\/|^-\/\/W3C\/\/DTD HTML Experimental 970421\/\/|^-\/\/W3C\/\/DTD W3 HTML\/\/|^-\/\/W3O\/\/DTD W3 HTML 3\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML 2\.0\/\/|^-\/\/WebTechs\/\/DTD Mozilla HTML\/\//i,
        B = "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd",
        T =
          /^-\/\/W3C\/\/DTD HTML 4\.01 Frameset\/\/|^-\/\/W3C\/\/DTD HTML 4\.01 Transitional\/\//i,
        g =
          /^-\/\/W3C\/\/DTD XHTML 1\.0 Frameset\/\/|^-\/\/W3C\/\/DTD XHTML 1\.0 Transitional\/\//i,
        k = Object.create(null);
      (k[a.HTML] = {
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
        (k[a.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        }),
        (k[a.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        });
      var _ = Object.create(null);
      _[a.HTML] = { __proto__: null, address: !0, div: !0, p: !0 };
      var ae = Object.create(null);
      ae[a.HTML] = { __proto__: null, dd: !0, dt: !0 };
      var ne = Object.create(null);
      ne[a.HTML] = {
        __proto__: null,
        table: !0,
        thead: !0,
        tbody: !0,
        tfoot: !0,
        tr: !0,
      };
      var Q = Object.create(null);
      Q[a.HTML] = {
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
      var G = Object.create(null);
      G[a.HTML] = {
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
      var D = Object.create(null);
      D[a.HTML] = { __proto__: null, table: !0, template: !0, html: !0 };
      var P = Object.create(null);
      P[a.HTML] = {
        __proto__: null,
        tbody: !0,
        tfoot: !0,
        thead: !0,
        template: !0,
        html: !0,
      };
      var Z = Object.create(null);
      Z[a.HTML] = { __proto__: null, tr: !0, template: !0, html: !0 };
      var u = Object.create(null);
      u[a.HTML] = {
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
      var i = Object.create(null);
      (i[a.HTML] = {
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
        (i[a.MATHML] = {
          __proto__: null,
          mi: !0,
          mo: !0,
          mn: !0,
          ms: !0,
          mtext: !0,
          "annotation-xml": !0,
        }),
        (i[a.SVG] = {
          __proto__: null,
          foreignObject: !0,
          desc: !0,
          title: !0,
        });
      var n = Object.create(i);
      (n[a.HTML] = Object.create(i[a.HTML])),
        (n[a.HTML].ol = !0),
        (n[a.HTML].ul = !0);
      var d = Object.create(i);
      (d[a.HTML] = Object.create(i[a.HTML])), (d[a.HTML].button = !0);
      var h = Object.create(null);
      h[a.HTML] = { __proto__: null, html: !0, table: !0, template: !0 };
      var v = Object.create(null);
      v[a.HTML] = { __proto__: null, optgroup: !0, option: !0 };
      var C = Object.create(null);
      C[a.MATHML] = {
        __proto__: null,
        mi: !0,
        mo: !0,
        mn: !0,
        ms: !0,
        mtext: !0,
      };
      var j = Object.create(null);
      j[a.SVG] = { __proto__: null, foreignObject: !0, desc: !0, title: !0 };
      var re = {
          __proto__: null,
          "xlink:actuate": a.XLINK,
          "xlink:arcrole": a.XLINK,
          "xlink:href": a.XLINK,
          "xlink:role": a.XLINK,
          "xlink:show": a.XLINK,
          "xlink:title": a.XLINK,
          "xlink:type": a.XLINK,
          "xml:base": a.XML,
          "xml:lang": a.XML,
          "xml:space": a.XML,
          xmlns: a.XMLNS,
          "xmlns:xlink": a.XMLNS,
        },
        w = {
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
        A = {
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
        X = {
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
        ge = {
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
        Me =
          /(A(?:Elig;?|MP;?|acute;?|breve;|c(?:irc;?|y;)|fr;|grave;?|lpha;|macr;|nd;|o(?:gon;|pf;)|pplyFunction;|ring;?|s(?:cr;|sign;)|tilde;?|uml;?)|B(?:a(?:ckslash;|r(?:v;|wed;))|cy;|e(?:cause;|rnoullis;|ta;)|fr;|opf;|reve;|scr;|umpeq;)|C(?:Hcy;|OPY;?|a(?:cute;|p(?:;|italDifferentialD;)|yleys;)|c(?:aron;|edil;?|irc;|onint;)|dot;|e(?:dilla;|nterDot;)|fr;|hi;|ircle(?:Dot;|Minus;|Plus;|Times;)|lo(?:ckwiseContourIntegral;|seCurly(?:DoubleQuote;|Quote;))|o(?:lon(?:;|e;)|n(?:gruent;|int;|tourIntegral;)|p(?:f;|roduct;)|unterClockwiseContourIntegral;)|ross;|scr;|up(?:;|Cap;))|D(?:D(?:;|otrahd;)|Jcy;|Scy;|Zcy;|a(?:gger;|rr;|shv;)|c(?:aron;|y;)|el(?:;|ta;)|fr;|i(?:a(?:critical(?:Acute;|Do(?:t;|ubleAcute;)|Grave;|Tilde;)|mond;)|fferentialD;)|o(?:pf;|t(?:;|Dot;|Equal;)|uble(?:ContourIntegral;|Do(?:t;|wnArrow;)|L(?:eft(?:Arrow;|RightArrow;|Tee;)|ong(?:Left(?:Arrow;|RightArrow;)|RightArrow;))|Right(?:Arrow;|Tee;)|Up(?:Arrow;|DownArrow;)|VerticalBar;)|wn(?:Arrow(?:;|Bar;|UpArrow;)|Breve;|Left(?:RightVector;|TeeVector;|Vector(?:;|Bar;))|Right(?:TeeVector;|Vector(?:;|Bar;))|Tee(?:;|Arrow;)|arrow;))|s(?:cr;|trok;))|E(?:NG;|TH;?|acute;?|c(?:aron;|irc;?|y;)|dot;|fr;|grave;?|lement;|m(?:acr;|pty(?:SmallSquare;|VerySmallSquare;))|o(?:gon;|pf;)|psilon;|qu(?:al(?:;|Tilde;)|ilibrium;)|s(?:cr;|im;)|ta;|uml;?|x(?:ists;|ponentialE;))|F(?:cy;|fr;|illed(?:SmallSquare;|VerySmallSquare;)|o(?:pf;|rAll;|uriertrf;)|scr;)|G(?:Jcy;|T;?|amma(?:;|d;)|breve;|c(?:edil;|irc;|y;)|dot;|fr;|g;|opf;|reater(?:Equal(?:;|Less;)|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|scr;|t;)|H(?:ARDcy;|a(?:cek;|t;)|circ;|fr;|ilbertSpace;|o(?:pf;|rizontalLine;)|s(?:cr;|trok;)|ump(?:DownHump;|Equal;))|I(?:Ecy;|Jlig;|Ocy;|acute;?|c(?:irc;?|y;)|dot;|fr;|grave;?|m(?:;|a(?:cr;|ginaryI;)|plies;)|n(?:t(?:;|e(?:gral;|rsection;))|visible(?:Comma;|Times;))|o(?:gon;|pf;|ta;)|scr;|tilde;|u(?:kcy;|ml;?))|J(?:c(?:irc;|y;)|fr;|opf;|s(?:cr;|ercy;)|ukcy;)|K(?:Hcy;|Jcy;|appa;|c(?:edil;|y;)|fr;|opf;|scr;)|L(?:Jcy;|T;?|a(?:cute;|mbda;|ng;|placetrf;|rr;)|c(?:aron;|edil;|y;)|e(?:ft(?:A(?:ngleBracket;|rrow(?:;|Bar;|RightArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|Right(?:Arrow;|Vector;)|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;|rightarrow;)|ss(?:EqualGreater;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;))|fr;|l(?:;|eftarrow;)|midot;|o(?:ng(?:Left(?:Arrow;|RightArrow;)|RightArrow;|left(?:arrow;|rightarrow;)|rightarrow;)|pf;|wer(?:LeftArrow;|RightArrow;))|s(?:cr;|h;|trok;)|t;)|M(?:ap;|cy;|e(?:diumSpace;|llintrf;)|fr;|inusPlus;|opf;|scr;|u;)|N(?:Jcy;|acute;|c(?:aron;|edil;|y;)|e(?:gative(?:MediumSpace;|Thi(?:ckSpace;|nSpace;)|VeryThinSpace;)|sted(?:GreaterGreater;|LessLess;)|wLine;)|fr;|o(?:Break;|nBreakingSpace;|pf;|t(?:;|C(?:ongruent;|upCap;)|DoubleVerticalBar;|E(?:lement;|qual(?:;|Tilde;)|xists;)|Greater(?:;|Equal;|FullEqual;|Greater;|Less;|SlantEqual;|Tilde;)|Hump(?:DownHump;|Equal;)|Le(?:ftTriangle(?:;|Bar;|Equal;)|ss(?:;|Equal;|Greater;|Less;|SlantEqual;|Tilde;))|Nested(?:GreaterGreater;|LessLess;)|Precedes(?:;|Equal;|SlantEqual;)|R(?:everseElement;|ightTriangle(?:;|Bar;|Equal;))|S(?:quareSu(?:bset(?:;|Equal;)|perset(?:;|Equal;))|u(?:bset(?:;|Equal;)|cceeds(?:;|Equal;|SlantEqual;|Tilde;)|perset(?:;|Equal;)))|Tilde(?:;|Equal;|FullEqual;|Tilde;)|VerticalBar;))|scr;|tilde;?|u;)|O(?:Elig;|acute;?|c(?:irc;?|y;)|dblac;|fr;|grave;?|m(?:acr;|ega;|icron;)|opf;|penCurly(?:DoubleQuote;|Quote;)|r;|s(?:cr;|lash;?)|ti(?:lde;?|mes;)|uml;?|ver(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;))|P(?:artialD;|cy;|fr;|hi;|i;|lusMinus;|o(?:incareplane;|pf;)|r(?:;|ecedes(?:;|Equal;|SlantEqual;|Tilde;)|ime;|o(?:duct;|portion(?:;|al;)))|s(?:cr;|i;))|Q(?:UOT;?|fr;|opf;|scr;)|R(?:Barr;|EG;?|a(?:cute;|ng;|rr(?:;|tl;))|c(?:aron;|edil;|y;)|e(?:;|verse(?:E(?:lement;|quilibrium;)|UpEquilibrium;))|fr;|ho;|ight(?:A(?:ngleBracket;|rrow(?:;|Bar;|LeftArrow;))|Ceiling;|Do(?:ubleBracket;|wn(?:TeeVector;|Vector(?:;|Bar;)))|Floor;|T(?:ee(?:;|Arrow;|Vector;)|riangle(?:;|Bar;|Equal;))|Up(?:DownVector;|TeeVector;|Vector(?:;|Bar;))|Vector(?:;|Bar;)|arrow;)|o(?:pf;|undImplies;)|rightarrow;|s(?:cr;|h;)|uleDelayed;)|S(?:H(?:CHcy;|cy;)|OFTcy;|acute;|c(?:;|aron;|edil;|irc;|y;)|fr;|hort(?:DownArrow;|LeftArrow;|RightArrow;|UpArrow;)|igma;|mallCircle;|opf;|q(?:rt;|uare(?:;|Intersection;|Su(?:bset(?:;|Equal;)|perset(?:;|Equal;))|Union;))|scr;|tar;|u(?:b(?:;|set(?:;|Equal;))|c(?:ceeds(?:;|Equal;|SlantEqual;|Tilde;)|hThat;)|m;|p(?:;|erset(?:;|Equal;)|set;)))|T(?:HORN;?|RADE;|S(?:Hcy;|cy;)|a(?:b;|u;)|c(?:aron;|edil;|y;)|fr;|h(?:e(?:refore;|ta;)|i(?:ckSpace;|nSpace;))|ilde(?:;|Equal;|FullEqual;|Tilde;)|opf;|ripleDot;|s(?:cr;|trok;))|U(?:a(?:cute;?|rr(?:;|ocir;))|br(?:cy;|eve;)|c(?:irc;?|y;)|dblac;|fr;|grave;?|macr;|n(?:der(?:B(?:ar;|rac(?:e;|ket;))|Parenthesis;)|ion(?:;|Plus;))|o(?:gon;|pf;)|p(?:Arrow(?:;|Bar;|DownArrow;)|DownArrow;|Equilibrium;|Tee(?:;|Arrow;)|arrow;|downarrow;|per(?:LeftArrow;|RightArrow;)|si(?:;|lon;))|ring;|scr;|tilde;|uml;?)|V(?:Dash;|bar;|cy;|dash(?:;|l;)|e(?:e;|r(?:bar;|t(?:;|ical(?:Bar;|Line;|Separator;|Tilde;))|yThinSpace;))|fr;|opf;|scr;|vdash;)|W(?:circ;|edge;|fr;|opf;|scr;)|X(?:fr;|i;|opf;|scr;)|Y(?:Acy;|Icy;|Ucy;|acute;?|c(?:irc;|y;)|fr;|opf;|scr;|uml;)|Z(?:Hcy;|acute;|c(?:aron;|y;)|dot;|e(?:roWidthSpace;|ta;)|fr;|opf;|scr;)|a(?:acute;?|breve;|c(?:;|E;|d;|irc;?|ute;?|y;)|elig;?|f(?:;|r;)|grave;?|l(?:e(?:fsym;|ph;)|pha;)|m(?:a(?:cr;|lg;)|p;?)|n(?:d(?:;|and;|d;|slope;|v;)|g(?:;|e;|le;|msd(?:;|a(?:a;|b;|c;|d;|e;|f;|g;|h;))|rt(?:;|vb(?:;|d;))|s(?:ph;|t;)|zarr;))|o(?:gon;|pf;)|p(?:;|E;|acir;|e;|id;|os;|prox(?:;|eq;))|ring;?|s(?:cr;|t;|ymp(?:;|eq;))|tilde;?|uml;?|w(?:conint;|int;))|b(?:Not;|a(?:ck(?:cong;|epsilon;|prime;|sim(?:;|eq;))|r(?:vee;|wed(?:;|ge;)))|brk(?:;|tbrk;)|c(?:ong;|y;)|dquo;|e(?:caus(?:;|e;)|mptyv;|psi;|rnou;|t(?:a;|h;|ween;))|fr;|ig(?:c(?:ap;|irc;|up;)|o(?:dot;|plus;|times;)|s(?:qcup;|tar;)|triangle(?:down;|up;)|uplus;|vee;|wedge;)|karow;|l(?:a(?:ck(?:lozenge;|square;|triangle(?:;|down;|left;|right;))|nk;)|k(?:1(?:2;|4;)|34;)|ock;)|n(?:e(?:;|quiv;)|ot;)|o(?:pf;|t(?:;|tom;)|wtie;|x(?:D(?:L;|R;|l;|r;)|H(?:;|D;|U;|d;|u;)|U(?:L;|R;|l;|r;)|V(?:;|H;|L;|R;|h;|l;|r;)|box;|d(?:L;|R;|l;|r;)|h(?:;|D;|U;|d;|u;)|minus;|plus;|times;|u(?:L;|R;|l;|r;)|v(?:;|H;|L;|R;|h;|l;|r;)))|prime;|r(?:eve;|vbar;?)|s(?:cr;|emi;|im(?:;|e;)|ol(?:;|b;|hsub;))|u(?:ll(?:;|et;)|mp(?:;|E;|e(?:;|q;))))|c(?:a(?:cute;|p(?:;|and;|brcup;|c(?:ap;|up;)|dot;|s;)|r(?:et;|on;))|c(?:a(?:ps;|ron;)|edil;?|irc;|ups(?:;|sm;))|dot;|e(?:dil;?|mptyv;|nt(?:;|erdot;|))|fr;|h(?:cy;|eck(?:;|mark;)|i;)|ir(?:;|E;|c(?:;|eq;|le(?:arrow(?:left;|right;)|d(?:R;|S;|ast;|circ;|dash;)))|e;|fnint;|mid;|scir;)|lubs(?:;|uit;)|o(?:lon(?:;|e(?:;|q;))|m(?:ma(?:;|t;)|p(?:;|fn;|le(?:ment;|xes;)))|n(?:g(?:;|dot;)|int;)|p(?:f;|rod;|y(?:;|sr;|)))|r(?:arr;|oss;)|s(?:cr;|u(?:b(?:;|e;)|p(?:;|e;)))|tdot;|u(?:darr(?:l;|r;)|e(?:pr;|sc;)|larr(?:;|p;)|p(?:;|brcap;|c(?:ap;|up;)|dot;|or;|s;)|r(?:arr(?:;|m;)|ly(?:eq(?:prec;|succ;)|vee;|wedge;)|ren;?|vearrow(?:left;|right;))|vee;|wed;)|w(?:conint;|int;)|ylcty;)|d(?:Arr;|Har;|a(?:gger;|leth;|rr;|sh(?:;|v;))|b(?:karow;|lac;)|c(?:aron;|y;)|d(?:;|a(?:gger;|rr;)|otseq;)|e(?:g;?|lta;|mptyv;)|f(?:isht;|r;)|har(?:l;|r;)|i(?:am(?:;|ond(?:;|suit;)|s;)|e;|gamma;|sin;|v(?:;|ide(?:;|ontimes;|)|onx;))|jcy;|lc(?:orn;|rop;)|o(?:llar;|pf;|t(?:;|eq(?:;|dot;)|minus;|plus;|square;)|ublebarwedge;|wn(?:arrow;|downarrows;|harpoon(?:left;|right;)))|r(?:bkarow;|c(?:orn;|rop;))|s(?:c(?:r;|y;)|ol;|trok;)|t(?:dot;|ri(?:;|f;))|u(?:arr;|har;)|wangle;|z(?:cy;|igrarr;))|e(?:D(?:Dot;|ot;)|a(?:cute;?|ster;)|c(?:aron;|ir(?:;|c;?)|olon;|y;)|dot;|e;|f(?:Dot;|r;)|g(?:;|rave;?|s(?:;|dot;))|l(?:;|inters;|l;|s(?:;|dot;))|m(?:acr;|pty(?:;|set;|v;)|sp(?:1(?:3;|4;)|;))|n(?:g;|sp;)|o(?:gon;|pf;)|p(?:ar(?:;|sl;)|lus;|si(?:;|lon;|v;))|q(?:c(?:irc;|olon;)|s(?:im;|lant(?:gtr;|less;))|u(?:als;|est;|iv(?:;|DD;))|vparsl;)|r(?:Dot;|arr;)|s(?:cr;|dot;|im;)|t(?:a;|h;?)|u(?:ml;?|ro;)|x(?:cl;|ist;|p(?:ectation;|onentiale;)))|f(?:allingdotseq;|cy;|emale;|f(?:ilig;|l(?:ig;|lig;)|r;)|ilig;|jlig;|l(?:at;|lig;|tns;)|nof;|o(?:pf;|r(?:all;|k(?:;|v;)))|partint;|r(?:a(?:c(?:1(?:2;?|3;|4;?|5;|6;|8;)|2(?:3;|5;)|3(?:4;?|5;|8;)|45;|5(?:6;|8;)|78;)|sl;)|own;)|scr;)|g(?:E(?:;|l;)|a(?:cute;|mma(?:;|d;)|p;)|breve;|c(?:irc;|y;)|dot;|e(?:;|l;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|l;))|l(?:;|es;)))|fr;|g(?:;|g;)|imel;|jcy;|l(?:;|E;|a;|j;)|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|opf;|rave;|s(?:cr;|im(?:;|e;|l;))|t(?:;|c(?:c;|ir;)|dot;|lPar;|quest;|r(?:a(?:pprox;|rr;)|dot;|eq(?:less;|qless;)|less;|sim;)|)|v(?:ertneqq;|nE;))|h(?:Arr;|a(?:irsp;|lf;|milt;|r(?:dcy;|r(?:;|cir;|w;)))|bar;|circ;|e(?:arts(?:;|uit;)|llip;|rcon;)|fr;|ks(?:earow;|warow;)|o(?:arr;|mtht;|ok(?:leftarrow;|rightarrow;)|pf;|rbar;)|s(?:cr;|lash;|trok;)|y(?:bull;|phen;))|i(?:acute;?|c(?:;|irc;?|y;)|e(?:cy;|xcl;?)|f(?:f;|r;)|grave;?|i(?:;|i(?:int;|nt;)|nfin;|ota;)|jlig;|m(?:a(?:cr;|g(?:e;|line;|part;)|th;)|of;|ped;)|n(?:;|care;|fin(?:;|tie;)|odot;|t(?:;|cal;|e(?:gers;|rcal;)|larhk;|prod;))|o(?:cy;|gon;|pf;|ta;)|prod;|quest;?|s(?:cr;|in(?:;|E;|dot;|s(?:;|v;)|v;))|t(?:;|ilde;)|u(?:kcy;|ml;?))|j(?:c(?:irc;|y;)|fr;|math;|opf;|s(?:cr;|ercy;)|ukcy;)|k(?:appa(?:;|v;)|c(?:edil;|y;)|fr;|green;|hcy;|jcy;|opf;|scr;)|l(?:A(?:arr;|rr;|tail;)|Barr;|E(?:;|g;)|Har;|a(?:cute;|emptyv;|gran;|mbda;|ng(?:;|d;|le;)|p;|quo;?|rr(?:;|b(?:;|fs;)|fs;|hk;|lp;|pl;|sim;|tl;)|t(?:;|ail;|e(?:;|s;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|quo(?:;|r;)|r(?:dhar;|ushar;)|sh;)|e(?:;|ft(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|leftarrows;|right(?:arrow(?:;|s;)|harpoons;|squigarrow;)|threetimes;)|g;|q(?:;|q;|slant;)|s(?:;|cc;|dot(?:;|o(?:;|r;))|g(?:;|es;)|s(?:approx;|dot;|eq(?:gtr;|qgtr;)|gtr;|sim;)))|f(?:isht;|loor;|r;)|g(?:;|E;)|h(?:ar(?:d;|u(?:;|l;))|blk;)|jcy;|l(?:;|arr;|corner;|hard;|tri;)|m(?:idot;|oust(?:;|ache;))|n(?:E;|ap(?:;|prox;)|e(?:;|q(?:;|q;))|sim;)|o(?:a(?:ng;|rr;)|brk;|ng(?:left(?:arrow;|rightarrow;)|mapsto;|rightarrow;)|oparrow(?:left;|right;)|p(?:ar;|f;|lus;)|times;|w(?:ast;|bar;)|z(?:;|enge;|f;))|par(?:;|lt;)|r(?:arr;|corner;|har(?:;|d;)|m;|tri;)|s(?:aquo;|cr;|h;|im(?:;|e;|g;)|q(?:b;|uo(?:;|r;))|trok;)|t(?:;|c(?:c;|ir;)|dot;|hree;|imes;|larr;|quest;|r(?:Par;|i(?:;|e;|f;))|)|ur(?:dshar;|uhar;)|v(?:ertneqq;|nE;))|m(?:DDot;|a(?:cr;?|l(?:e;|t(?:;|ese;))|p(?:;|sto(?:;|down;|left;|up;))|rker;)|c(?:omma;|y;)|dash;|easuredangle;|fr;|ho;|i(?:cro;?|d(?:;|ast;|cir;|dot;?)|nus(?:;|b;|d(?:;|u;)))|l(?:cp;|dr;)|nplus;|o(?:dels;|pf;)|p;|s(?:cr;|tpos;)|u(?:;|ltimap;|map;))|n(?:G(?:g;|t(?:;|v;))|L(?:eft(?:arrow;|rightarrow;)|l;|t(?:;|v;))|Rightarrow;|V(?:Dash;|dash;)|a(?:bla;|cute;|ng;|p(?:;|E;|id;|os;|prox;)|tur(?:;|al(?:;|s;)))|b(?:sp;?|ump(?:;|e;))|c(?:a(?:p;|ron;)|edil;|ong(?:;|dot;)|up;|y;)|dash;|e(?:;|Arr;|ar(?:hk;|r(?:;|ow;))|dot;|quiv;|s(?:ear;|im;)|xist(?:;|s;))|fr;|g(?:E;|e(?:;|q(?:;|q;|slant;)|s;)|sim;|t(?:;|r;))|h(?:Arr;|arr;|par;)|i(?:;|s(?:;|d;)|v;)|jcy;|l(?:Arr;|E;|arr;|dr;|e(?:;|ft(?:arrow;|rightarrow;)|q(?:;|q;|slant;)|s(?:;|s;))|sim;|t(?:;|ri(?:;|e;)))|mid;|o(?:pf;|t(?:;|in(?:;|E;|dot;|v(?:a;|b;|c;))|ni(?:;|v(?:a;|b;|c;))|))|p(?:ar(?:;|allel;|sl;|t;)|olint;|r(?:;|cue;|e(?:;|c(?:;|eq;))))|r(?:Arr;|arr(?:;|c;|w;)|ightarrow;|tri(?:;|e;))|s(?:c(?:;|cue;|e;|r;)|hort(?:mid;|parallel;)|im(?:;|e(?:;|q;))|mid;|par;|qsu(?:be;|pe;)|u(?:b(?:;|E;|e;|set(?:;|eq(?:;|q;)))|cc(?:;|eq;)|p(?:;|E;|e;|set(?:;|eq(?:;|q;)))))|t(?:gl;|ilde;?|lg;|riangle(?:left(?:;|eq;)|right(?:;|eq;)))|u(?:;|m(?:;|ero;|sp;))|v(?:Dash;|Harr;|ap;|dash;|g(?:e;|t;)|infin;|l(?:Arr;|e;|t(?:;|rie;))|r(?:Arr;|trie;)|sim;)|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|near;))|o(?:S;|a(?:cute;?|st;)|c(?:ir(?:;|c;?)|y;)|d(?:ash;|blac;|iv;|ot;|sold;)|elig;|f(?:cir;|r;)|g(?:on;|rave;?|t;)|h(?:bar;|m;)|int;|l(?:arr;|c(?:ir;|ross;)|ine;|t;)|m(?:acr;|ega;|i(?:cron;|d;|nus;))|opf;|p(?:ar;|erp;|lus;)|r(?:;|arr;|d(?:;|er(?:;|of;)|f;?|m;?)|igof;|or;|slope;|v;)|s(?:cr;|lash;?|ol;)|ti(?:lde;?|mes(?:;|as;))|uml;?|vbar;)|p(?:ar(?:;|a(?:;|llel;|)|s(?:im;|l;)|t;)|cy;|er(?:cnt;|iod;|mil;|p;|tenk;)|fr;|h(?:i(?:;|v;)|mmat;|one;)|i(?:;|tchfork;|v;)|l(?:an(?:ck(?:;|h;)|kv;)|us(?:;|acir;|b;|cir;|d(?:o;|u;)|e;|mn;?|sim;|two;))|m;|o(?:intint;|pf;|und;?)|r(?:;|E;|ap;|cue;|e(?:;|c(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;))|ime(?:;|s;)|n(?:E;|ap;|sim;)|o(?:d;|f(?:alar;|line;|surf;)|p(?:;|to;))|sim;|urel;)|s(?:cr;|i;)|uncsp;)|q(?:fr;|int;|opf;|prime;|scr;|u(?:at(?:ernions;|int;)|est(?:;|eq;)|ot;?))|r(?:A(?:arr;|rr;|tail;)|Barr;|Har;|a(?:c(?:e;|ute;)|dic;|emptyv;|ng(?:;|d;|e;|le;)|quo;?|rr(?:;|ap;|b(?:;|fs;)|c;|fs;|hk;|lp;|pl;|sim;|tl;|w;)|t(?:ail;|io(?:;|nals;)))|b(?:arr;|brk;|r(?:ac(?:e;|k;)|k(?:e;|sl(?:d;|u;))))|c(?:aron;|e(?:dil;|il;)|ub;|y;)|d(?:ca;|ldhar;|quo(?:;|r;)|sh;)|e(?:al(?:;|ine;|part;|s;)|ct;|g;?)|f(?:isht;|loor;|r;)|h(?:ar(?:d;|u(?:;|l;))|o(?:;|v;))|i(?:ght(?:arrow(?:;|tail;)|harpoon(?:down;|up;)|left(?:arrows;|harpoons;)|rightarrows;|squigarrow;|threetimes;)|ng;|singdotseq;)|l(?:arr;|har;|m;)|moust(?:;|ache;)|nmid;|o(?:a(?:ng;|rr;)|brk;|p(?:ar;|f;|lus;)|times;)|p(?:ar(?:;|gt;)|polint;)|rarr;|s(?:aquo;|cr;|h;|q(?:b;|uo(?:;|r;)))|t(?:hree;|imes;|ri(?:;|e;|f;|ltri;))|uluhar;|x;)|s(?:acute;|bquo;|c(?:;|E;|a(?:p;|ron;)|cue;|e(?:;|dil;)|irc;|n(?:E;|ap;|sim;)|polint;|sim;|y;)|dot(?:;|b;|e;)|e(?:Arr;|ar(?:hk;|r(?:;|ow;))|ct;?|mi;|swar;|tm(?:inus;|n;)|xt;)|fr(?:;|own;)|h(?:arp;|c(?:hcy;|y;)|ort(?:mid;|parallel;)|y;?)|i(?:gma(?:;|f;|v;)|m(?:;|dot;|e(?:;|q;)|g(?:;|E;)|l(?:;|E;)|ne;|plus;|rarr;))|larr;|m(?:a(?:llsetminus;|shp;)|eparsl;|i(?:d;|le;)|t(?:;|e(?:;|s;)))|o(?:ftcy;|l(?:;|b(?:;|ar;))|pf;)|pa(?:des(?:;|uit;)|r;)|q(?:c(?:ap(?:;|s;)|up(?:;|s;))|su(?:b(?:;|e;|set(?:;|eq;))|p(?:;|e;|set(?:;|eq;)))|u(?:;|ar(?:e;|f;)|f;))|rarr;|s(?:cr;|etmn;|mile;|tarf;)|t(?:ar(?:;|f;)|r(?:aight(?:epsilon;|phi;)|ns;))|u(?:b(?:;|E;|dot;|e(?:;|dot;)|mult;|n(?:E;|e;)|plus;|rarr;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;)))|cc(?:;|approx;|curlyeq;|eq;|n(?:approx;|eqq;|sim;)|sim;)|m;|ng;|p(?:1;?|2;?|3;?|;|E;|d(?:ot;|sub;)|e(?:;|dot;)|hs(?:ol;|ub;)|larr;|mult;|n(?:E;|e;)|plus;|s(?:et(?:;|eq(?:;|q;)|neq(?:;|q;))|im;|u(?:b;|p;))))|w(?:Arr;|ar(?:hk;|r(?:;|ow;))|nwar;)|zlig;?)|t(?:a(?:rget;|u;)|brk;|c(?:aron;|edil;|y;)|dot;|elrec;|fr;|h(?:e(?:re(?:4;|fore;)|ta(?:;|sym;|v;))|i(?:ck(?:approx;|sim;)|nsp;)|k(?:ap;|sim;)|orn;?)|i(?:lde;|mes(?:;|b(?:;|ar;)|d;|)|nt;)|o(?:ea;|p(?:;|bot;|cir;|f(?:;|ork;))|sa;)|prime;|r(?:ade;|i(?:angle(?:;|down;|left(?:;|eq;)|q;|right(?:;|eq;))|dot;|e;|minus;|plus;|sb;|time;)|pezium;)|s(?:c(?:r;|y;)|hcy;|trok;)|w(?:ixt;|ohead(?:leftarrow;|rightarrow;)))|u(?:Arr;|Har;|a(?:cute;?|rr;)|br(?:cy;|eve;)|c(?:irc;?|y;)|d(?:arr;|blac;|har;)|f(?:isht;|r;)|grave;?|h(?:ar(?:l;|r;)|blk;)|l(?:c(?:orn(?:;|er;)|rop;)|tri;)|m(?:acr;|l;?)|o(?:gon;|pf;)|p(?:arrow;|downarrow;|harpoon(?:left;|right;)|lus;|si(?:;|h;|lon;)|uparrows;)|r(?:c(?:orn(?:;|er;)|rop;)|ing;|tri;)|scr;|t(?:dot;|ilde;|ri(?:;|f;))|u(?:arr;|ml;?)|wangle;)|v(?:Arr;|Bar(?:;|v;)|Dash;|a(?:ngrt;|r(?:epsilon;|kappa;|nothing;|p(?:hi;|i;|ropto;)|r(?:;|ho;)|s(?:igma;|u(?:bsetneq(?:;|q;)|psetneq(?:;|q;)))|t(?:heta;|riangle(?:left;|right;))))|cy;|dash;|e(?:e(?:;|bar;|eq;)|llip;|r(?:bar;|t;))|fr;|ltri;|nsu(?:b;|p;)|opf;|prop;|rtri;|s(?:cr;|u(?:bn(?:E;|e;)|pn(?:E;|e;)))|zigzag;)|w(?:circ;|e(?:d(?:bar;|ge(?:;|q;))|ierp;)|fr;|opf;|p;|r(?:;|eath;)|scr;)|x(?:c(?:ap;|irc;|up;)|dtri;|fr;|h(?:Arr;|arr;)|i;|l(?:Arr;|arr;)|map;|nis;|o(?:dot;|p(?:f;|lus;)|time;)|r(?:Arr;|arr;)|s(?:cr;|qcup;)|u(?:plus;|tri;)|vee;|wedge;)|y(?:ac(?:ute;?|y;)|c(?:irc;|y;)|en;?|fr;|icy;|opf;|scr;|u(?:cy;|ml;?))|z(?:acute;|c(?:aron;|y;)|dot;|e(?:etrf;|ta;)|fr;|hcy;|igrarr;|opf;|scr;|w(?:j;|nj;)))|[\s\S]/g,
        bt = 32,
        Y = /[^\r"&\u0000]+/g,
        z = /[^\r'&\u0000]+/g,
        O = /[^\r\t\n\f &>\u0000]+/g,
        W = /[^\r\t\n\f \/>A-Z\u0000]+/g,
        ce = /[^\r\t\n\f \/=>A-Z\u0000]+/g,
        he = /[^\]\r\u0000\uffff]*/g,
        se = /[^&<\r\u0000\uffff]*/g,
        me = /[^<\r\u0000\uffff]*/g,
        be = /[^\r\u0000\uffff]*/g,
        _e = /(?:(\/)?([a-z]+)>)|[\s\S]/g,
        Ae =
          /(?:([-a-z]+)[ \t\n\f]*=[ \t\n\f]*('[^'&\r\u0000]*'|"[^"&\r\u0000]*"|[^\t\n\r\f "&'\u0000>][^&> \t\n\r\f\u0000]*[ \t\n\f]))|[\s\S]/g,
        Se = /[^\x09\x0A\x0C\x0D\x20]/,
        Xe = /[^\x09\x0A\x0C\x0D\x20]/g,
        Ye = /[^\x00\x09\x0A\x0C\x0D\x20]/,
        ze = /^[\x09\x0A\x0C\x0D\x20]+/,
        Et = /\x00/g;
      function Fe(F) {
        var V = 16384;
        if (F.length < V) return String.fromCharCode.apply(String, F);
        for (var oe = "", ee = 0; ee < F.length; ee += V)
          oe += String.fromCharCode.apply(String, F.slice(ee, ee + V));
        return oe;
      }
      function tn(F) {
        for (var V = [], oe = 0; oe < F.length; oe++) V[oe] = F.charCodeAt(oe);
        return V;
      }
      function Ne(F, V) {
        if (typeof V == "string")
          return F.namespaceURI === a.HTML && F.localName === V;
        var oe = V[F.namespaceURI];
        return oe && oe[F.localName];
      }
      function sr(F) {
        return Ne(F, C);
      }
      function ut(F) {
        if (Ne(F, j)) return !0;
        if (F.namespaceURI === a.MATHML && F.localName === "annotation-xml") {
          var V = F.getAttribute("encoding");
          if (
            (V && (V = V.toLowerCase()),
            V === "text/html" || V === "application/xhtml+xml")
          )
            return !0;
        }
        return !1;
      }
      function vr(F) {
        return F in A ? A[F] : F;
      }
      function Pt(F) {
        for (var V = 0, oe = F.length; V < oe; V++)
          F[V][0] in w && (F[V][0] = w[F[V][0]]);
      }
      function ir(F) {
        for (var V = 0, oe = F.length; V < oe; V++)
          if (F[V][0] === "definitionurl") {
            F[V][0] = "definitionURL";
            break;
          }
      }
      function Xt(F) {
        for (var V = 0, oe = F.length; V < oe; V++)
          F[V][0] in re && F[V].push(re[F[V][0]]);
      }
      function vt(F, V) {
        for (var oe = 0, ee = F.length; oe < ee; oe++) {
          var Ie = F[oe][0],
            te = F[oe][1];
          V.hasAttribute(Ie) || V._setAttribute(Ie, te);
        }
      }
      (de.ElementStack = function () {
        (this.elements = []), (this.top = null);
      }),
        (de.ElementStack.prototype.push = function (F) {
          this.elements.push(F), (this.top = F);
        }),
        (de.ElementStack.prototype.pop = function (F) {
          this.elements.pop(),
            (this.top = this.elements[this.elements.length - 1]);
        }),
        (de.ElementStack.prototype.popTag = function (F) {
          for (var V = this.elements.length - 1; V > 0; V--) {
            var oe = this.elements[V];
            if (Ne(oe, F)) break;
          }
          (this.elements.length = V), (this.top = this.elements[V - 1]);
        }),
        (de.ElementStack.prototype.popElementType = function (F) {
          for (
            var V = this.elements.length - 1;
            V > 0 && !(this.elements[V] instanceof F);
            V--
          );
          (this.elements.length = V), (this.top = this.elements[V - 1]);
        }),
        (de.ElementStack.prototype.popElement = function (F) {
          for (
            var V = this.elements.length - 1;
            V > 0 && this.elements[V] !== F;
            V--
          );
          (this.elements.length = V), (this.top = this.elements[V - 1]);
        }),
        (de.ElementStack.prototype.removeElement = function (F) {
          if (this.top === F) this.pop();
          else {
            var V = this.elements.lastIndexOf(F);
            V !== -1 && this.elements.splice(V, 1);
          }
        }),
        (de.ElementStack.prototype.clearToContext = function (F) {
          for (
            var V = this.elements.length - 1;
            V > 0 && !Ne(this.elements[V], F);
            V--
          );
          (this.elements.length = V + 1), (this.top = this.elements[V]);
        }),
        (de.ElementStack.prototype.contains = function (F) {
          return this.inSpecificScope(F, Object.create(null));
        }),
        (de.ElementStack.prototype.inSpecificScope = function (F, V) {
          for (var oe = this.elements.length - 1; oe >= 0; oe--) {
            var ee = this.elements[oe];
            if (Ne(ee, F)) return !0;
            if (Ne(ee, V)) return !1;
          }
          return !1;
        }),
        (de.ElementStack.prototype.elementInSpecificScope = function (F, V) {
          for (var oe = this.elements.length - 1; oe >= 0; oe--) {
            var ee = this.elements[oe];
            if (ee === F) return !0;
            if (Ne(ee, V)) return !1;
          }
          return !1;
        }),
        (de.ElementStack.prototype.elementTypeInSpecificScope = function (
          F,
          V,
        ) {
          for (var oe = this.elements.length - 1; oe >= 0; oe--) {
            var ee = this.elements[oe];
            if (ee instanceof F) return !0;
            if (Ne(ee, V)) return !1;
          }
          return !1;
        }),
        (de.ElementStack.prototype.inScope = function (F) {
          return this.inSpecificScope(F, i);
        }),
        (de.ElementStack.prototype.elementInScope = function (F) {
          return this.elementInSpecificScope(F, i);
        }),
        (de.ElementStack.prototype.elementTypeInScope = function (F) {
          return this.elementTypeInSpecificScope(F, i);
        }),
        (de.ElementStack.prototype.inButtonScope = function (F) {
          return this.inSpecificScope(F, d);
        }),
        (de.ElementStack.prototype.inListItemScope = function (F) {
          return this.inSpecificScope(F, n);
        }),
        (de.ElementStack.prototype.inTableScope = function (F) {
          return this.inSpecificScope(F, h);
        }),
        (de.ElementStack.prototype.inSelectScope = function (F) {
          for (var V = this.elements.length - 1; V >= 0; V--) {
            var oe = this.elements[V];
            if (oe.namespaceURI !== a.HTML) return !1;
            var ee = oe.localName;
            if (ee === F) return !0;
            if (ee !== "optgroup" && ee !== "option") return !1;
          }
          return !1;
        }),
        (de.ElementStack.prototype.generateImpliedEndTags = function (F, V) {
          for (
            var oe = V ? G : Q, ee = this.elements.length - 1;
            ee >= 0;
            ee--
          ) {
            var Ie = this.elements[ee];
            if ((F && Ne(Ie, F)) || !Ne(this.elements[ee], oe)) break;
          }
          (this.elements.length = ee + 1), (this.top = this.elements[ee]);
        }),
        (de.ActiveFormattingElements = function () {
          (this.list = []), (this.attrs = []);
        }),
        (de.ActiveFormattingElements.prototype.MARKER = { localName: "|" }),
        (de.ActiveFormattingElements.prototype.insertMarker = function () {
          this.list.push(this.MARKER), this.attrs.push(this.MARKER);
        }),
        (de.ActiveFormattingElements.prototype.push = function (F, V) {
          for (
            var oe = 0, ee = this.list.length - 1;
            ee >= 0 && this.list[ee] !== this.MARKER;
            ee--
          )
            if (Bt(F, this.list[ee], this.attrs[ee]) && (oe++, oe === 3)) {
              this.list.splice(ee, 1), this.attrs.splice(ee, 1);
              break;
            }
          this.list.push(F);
          for (var Ie = [], te = 0; te < V.length; te++) Ie[te] = V[te];
          this.attrs.push(Ie);
          function Bt(Tt, Ft, ft) {
            if (Tt.localName !== Ft.localName || Tt._numattrs !== ft.length)
              return !1;
            for (var Ze = 0, Tr = ft.length; Ze < Tr; Ze++) {
              var Ut = ft[Ze][0],
                M = ft[Ze][1];
              if (!Tt.hasAttribute(Ut) || Tt.getAttribute(Ut) !== M) return !1;
            }
            return !0;
          }
        }),
        (de.ActiveFormattingElements.prototype.clearToMarker = function () {
          for (
            var F = this.list.length - 1;
            F >= 0 && this.list[F] !== this.MARKER;
            F--
          );
          F < 0 && (F = 0), (this.list.length = F), (this.attrs.length = F);
        }),
        (de.ActiveFormattingElements.prototype.findElementByTag = function (F) {
          for (var V = this.list.length - 1; V >= 0; V--) {
            var oe = this.list[V];
            if (oe === this.MARKER) break;
            if (oe.localName === F) return oe;
          }
          return null;
        }),
        (de.ActiveFormattingElements.prototype.indexOf = function (F) {
          return this.list.lastIndexOf(F);
        }),
        (de.ActiveFormattingElements.prototype.remove = function (F) {
          var V = this.list.lastIndexOf(F);
          V !== -1 && (this.list.splice(V, 1), this.attrs.splice(V, 1));
        }),
        (de.ActiveFormattingElements.prototype.replace = function (F, V, oe) {
          var ee = this.list.lastIndexOf(F);
          ee !== -1 && ((this.list[ee] = V), (this.attrs[ee] = oe));
        }),
        (de.ActiveFormattingElements.prototype.insertAfter = function (F, V) {
          var oe = this.list.lastIndexOf(F);
          oe !== -1 &&
            (this.list.splice(oe, 0, V), this.attrs.splice(oe, 0, V));
        });
      function de(F, V, oe) {
        var ee = null,
          Ie = 0,
          te = 0,
          Bt = !1,
          Tt = !1,
          Ft = 0,
          ft = [],
          Ze = "",
          Tr = !0,
          Ut = 0,
          M = Te,
          yt,
          Oe,
          Ce = "",
          yr = "",
          De = [],
          Ke = "",
          We = "",
          xe = [],
          Nt = [],
          wt = [],
          St = [],
          tt = [],
          Nr = !1,
          U = As,
          ht = null,
          dt = [],
          L = new de.ElementStack(),
          ve = new de.ActiveFormattingElements(),
          jt = V !== void 0,
          wr = null,
          pt = null,
          Sr = !0;
        V && (Sr = V.ownerDocument._scripting_enabled),
          oe && oe.scripting_enabled === !1 && (Sr = !1);
        var He = !0,
          rn = !1,
          kr,
          nn,
          K = [],
          kt = !1,
          Vt = !1,
          Lr = {
            document: function () {
              return we;
            },
            _asDocumentFragment: function () {
              for (
                var e = we.createDocumentFragment(), r = we.firstChild;
                r.hasChildNodes();

              )
                e.appendChild(r.firstChild);
              return e;
            },
            pause: function () {
              Ut++;
            },
            resume: function () {
              Ut--, this.parse("");
            },
            parse: function (e, r, y) {
              var x;
              return Ut > 0
                ? ((Ze += e), !0)
                : (Ft === 0
                    ? (Ze && ((e = Ze + e), (Ze = "")),
                      r && ((e += "\uFFFF"), (Bt = !0)),
                      (ee = e),
                      (Ie = e.length),
                      (te = 0),
                      Tr && ((Tr = !1), ee.charCodeAt(0) === 65279 && (te = 1)),
                      Ft++,
                      (x = On(y)),
                      (Ze = ee.substring(te, Ie)),
                      Ft--)
                    : (Ft++,
                      ft.push(ee, Ie, te),
                      (ee = e),
                      (Ie = e.length),
                      (te = 0),
                      On(),
                      (x = !1),
                      (Ze = ee.substring(te, Ie)),
                      (te = ft.pop()),
                      (Ie = ft.pop()),
                      (ee = ft.pop()),
                      Ze &&
                        ((ee = Ze + ee.substring(te)),
                        (Ie = ee.length),
                        (te = 0),
                        (Ze = "")),
                      Ft--),
                  x);
            },
          },
          we = new p(!0, F);
        if (((we._parser = Lr), (we._scripting_enabled = Sr), V)) {
          if (
            (V.ownerDocument._quirks && (we._quirks = !0),
            V.ownerDocument._limitedQuirks && (we._limitedQuirks = !0),
            V.namespaceURI === a.HTML)
          )
            switch (V.localName) {
              case "title":
              case "textarea":
                M = At;
                break;
              case "style":
              case "xmp":
              case "iframe":
              case "noembed":
              case "noframes":
              case "script":
              case "plaintext":
                M = ln;
                break;
            }
          var Rn = we.createElement("html");
          we._appendChild(Rn),
            L.push(Rn),
            V instanceof c.HTMLTemplateElement && dt.push(En),
            hr();
          for (var or = V; or !== null; or = or.parentElement)
            if (or instanceof c.HTMLFormElement) {
              pt = or;
              break;
            }
        }
        function On(e) {
          for (var r, y, x, q; te < Ie; ) {
            if (Ut > 0 || (e && e())) return !0;
            switch (typeof M.lookahead) {
              case "undefined":
                if (((r = ee.charCodeAt(te++)), Tt && ((Tt = !1), r === 10))) {
                  te++;
                  continue;
                }
                switch (r) {
                  case 13:
                    te < Ie ? ee.charCodeAt(te) === 10 && te++ : (Tt = !0),
                      M(10);
                    break;
                  case 65535:
                    if (Bt && te === Ie) {
                      M(s);
                      break;
                    }
                  default:
                    M(r);
                    break;
                }
                break;
              case "number":
                r = ee.charCodeAt(te);
                var $ = M.lookahead,
                  fe = !0;
                if (($ < 0 && ((fe = !1), ($ = -$)), $ < Ie - te))
                  (y = fe ? ee.substring(te, te + $) : null), (q = !1);
                else if (Bt)
                  (y = fe ? ee.substring(te, Ie) : null),
                    (q = !0),
                    r === 65535 && te === Ie - 1 && (r = s);
                else return !0;
                M(r, y, q);
                break;
              case "string":
                (r = ee.charCodeAt(te)), (x = M.lookahead);
                var ye = ee.indexOf(x, te);
                if (ye !== -1) (y = ee.substring(te, ye + x.length)), (q = !1);
                else {
                  if (!Bt) return !0;
                  (y = ee.substring(te, Ie)),
                    r === 65535 && te === Ie - 1 && (r = s),
                    (q = !0);
                }
                M(r, y, q);
                break;
            }
          }
          return !1;
        }
        function Lt(e, r) {
          for (var y = 0; y < tt.length; y++) if (tt[y][0] === e) return;
          r !== void 0 ? tt.push([e, r]) : tt.push([e]);
        }
        function Ra() {
          Ae.lastIndex = te - 1;
          var e = Ae.exec(ee);
          if (!e) throw new Error("should never happen");
          var r = e[1];
          if (!r) return !1;
          var y = e[2],
            x = y.length;
          switch (y[0]) {
            case '"':
            case "'":
              (y = y.substring(1, x - 1)), (te += e[0].length - 1), (M = dn);
              break;
            default:
              (M = ot), (te += e[0].length - 1), (y = y.substring(0, x - 1));
              break;
          }
          for (var q = 0; q < tt.length; q++) if (tt[q][0] === r) return !0;
          return tt.push([r, y]), !0;
        }
        function Oa() {
          (Nr = !1), (Ce = ""), (tt.length = 0);
        }
        function cr() {
          (Nr = !0), (Ce = ""), (tt.length = 0);
        }
        function mt() {
          De.length = 0;
        }
        function an() {
          Ke = "";
        }
        function sn() {
          We = "";
        }
        function Hn() {
          xe.length = 0;
        }
        function Yt() {
          (Nt.length = 0), (wt = null), (St = null);
        }
        function Cr() {
          wt = [];
        }
        function Ct() {
          St = [];
        }
        function ke() {
          rn = !0;
        }
        function Ha() {
          return L.top && L.top.namespaceURI !== "http://www.w3.org/1999/xhtml";
        }
        function Qe(e) {
          return yr === e;
        }
        function Qt() {
          if (K.length > 0) {
            var e = Fe(K);
            if (
              ((K.length = 0),
              Vt &&
                ((Vt = !1),
                e[0] ===
                  `
` && (e = e.substring(1)),
                e.length === 0))
            )
              return;
            Pe(b, e), (kt = !1);
          }
          Vt = !1;
        }
        function lr(e) {
          e.lastIndex = te - 1;
          var r = e.exec(ee);
          if (r && r.index === te - 1)
            return (
              (r = r[0]),
              (te += r.length - 1),
              Bt && te === Ie && ((r = r.slice(0, -1)), te--),
              r
            );
          throw new Error("should never happen");
        }
        function ur(e) {
          e.lastIndex = te - 1;
          var r = e.exec(ee)[0];
          return r ? (qa(r), (te += r.length - 1), !0) : !1;
        }
        function qa(e) {
          K.length > 0 && Qt(),
            !(
              Vt &&
              ((Vt = !1),
              e[0] ===
                `
` && (e = e.substring(1)),
              e.length === 0)
            ) && Pe(b, e);
        }
        function gt() {
          if (Nr) Pe(N, Ce);
          else {
            var e = Ce;
            (Ce = ""), (yr = e), Pe(m, e, tt);
          }
        }
        function Pa() {
          if (te === Ie) return !1;
          _e.lastIndex = te;
          var e = _e.exec(ee);
          if (!e) throw new Error("should never happen");
          var r = e[2];
          if (!r) return !1;
          var y = e[1];
          return (
            y
              ? ((te += r.length + 2), Pe(N, r))
              : ((te += r.length + 1), (yr = r), Pe(m, r, R)),
            !0
          );
        }
        function Ba() {
          Nr ? Pe(N, Ce, null, !0) : Pe(m, Ce, tt, !0);
        }
        function Le() {
          Pe(H, Fe(Nt), wt ? Fe(wt) : void 0, St ? Fe(St) : void 0);
        }
        function Ee() {
          Qt(), U(s), (we.modclock = 1);
        }
        var Pe = (Lr.insertToken = function (r, y, x, q) {
          Qt();
          var $ = L.top;
          !$ || $.namespaceURI === a.HTML
            ? U(r, y, x, q)
            : r !== m && r !== b
              ? $n(r, y, x, q)
              : (sr($) &&
                    (r === b ||
                      (r === m && y !== "mglyph" && y !== "malignmark"))) ||
                  (r === m &&
                    y === "svg" &&
                    $.namespaceURI === a.MATHML &&
                    $.localName === "annotation-xml") ||
                  ut($)
                ? ((nn = !0), U(r, y, x, q), (nn = !1))
                : $n(r, y, x, q);
        });
        function at(e) {
          var r = L.top;
          Dt && Ne(r, ne)
            ? Ar(function (y) {
                return y.createComment(e);
              })
            : (r instanceof c.HTMLTemplateElement && (r = r.content),
              r._appendChild(r.ownerDocument.createComment(e)));
        }
        function st(e) {
          var r = L.top;
          if (Dt && Ne(r, ne))
            Ar(function (x) {
              return x.createTextNode(e);
            });
          else {
            r instanceof c.HTMLTemplateElement && (r = r.content);
            var y = r.lastChild;
            y && y.nodeType === t.TEXT_NODE
              ? y.appendData(e)
              : r._appendChild(r.ownerDocument.createTextNode(e));
          }
        }
        function fr(e, r, y) {
          var x = o.createElement(e, r, null);
          if (y)
            for (var q = 0, $ = y.length; q < $; q++)
              x._setAttribute(y[q][0], y[q][1]);
          return x;
        }
        var Dt = !1;
        function pe(e, r) {
          var y = Dr(function (x) {
            return fr(x, e, r);
          });
          return Ne(y, u) && (y._form = pt), y;
        }
        function Dr(e) {
          var r;
          return (
            Dt && Ne(L.top, ne)
              ? (r = Ar(e))
              : L.top instanceof c.HTMLTemplateElement
                ? ((r = e(L.top.content.ownerDocument)),
                  L.top.content._appendChild(r))
                : ((r = e(L.top.ownerDocument)), L.top._appendChild(r)),
            L.push(r),
            r
          );
        }
        function on(e, r, y) {
          return Dr(function (x) {
            var q = x._createElementNS(e, y, null);
            if (r)
              for (var $ = 0, fe = r.length; $ < fe; $++) {
                var ye = r[$];
                ye.length === 2
                  ? q._setAttribute(ye[0], ye[1])
                  : q._setAttributeNS(ye[2], ye[0], ye[1]);
              }
            return q;
          });
        }
        function qn(e) {
          for (var r = L.elements.length - 1; r >= 0; r--)
            if (L.elements[r] instanceof e) return r;
          return -1;
        }
        function Ar(e) {
          var r,
            y,
            x = -1,
            q = -1,
            $;
          if (
            ((x = qn(c.HTMLTableElement)),
            (q = qn(c.HTMLTemplateElement)),
            q >= 0 && (x < 0 || q > x)
              ? (r = L.elements[q])
              : x >= 0 &&
                ((r = L.elements[x].parentNode),
                r ? (y = L.elements[x]) : (r = L.elements[x - 1])),
            r || (r = L.elements[0]),
            r instanceof c.HTMLTemplateElement && (r = r.content),
            ($ = e(r.ownerDocument)),
            $.nodeType === t.TEXT_NODE)
          ) {
            var fe;
            if (
              (y ? (fe = y.previousSibling) : (fe = r.lastChild),
              fe && fe.nodeType === t.TEXT_NODE)
            )
              return fe.appendData($.data), $;
          }
          return y ? r.insertBefore($, y) : r._appendChild($), $;
        }
        function hr() {
          for (var e = !1, r = L.elements.length - 1; r >= 0; r--) {
            var y = L.elements[r];
            if (
              (r === 0 && ((e = !0), jt && (y = V)), y.namespaceURI === a.HTML)
            ) {
              var x = y.localName;
              switch (x) {
                case "select":
                  for (var q = r; q > 0; ) {
                    var $ = L.elements[--q];
                    if ($ instanceof c.HTMLTemplateElement) break;
                    if ($ instanceof c.HTMLTableElement) {
                      U = Gr;
                      return;
                    }
                  }
                  U = _t;
                  return;
                case "tr":
                  U = mr;
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  U = Wt;
                  return;
                case "caption":
                  U = bn;
                  return;
                case "colgroup":
                  U = Vr;
                  return;
                case "table":
                  U = $e;
                  return;
                case "template":
                  U = dt[dt.length - 1];
                  return;
                case "body":
                  U = ue;
                  return;
                case "frameset":
                  U = vn;
                  return;
                case "html":
                  wr === null ? (U = Ur) : (U = _n);
                  return;
                default:
                  if (!e) {
                    if (x === "head") {
                      U = qe;
                      return;
                    }
                    if (x === "td" || x === "th") {
                      U = $t;
                      return;
                    }
                  }
              }
            }
            if (e) {
              U = ue;
              return;
            }
          }
        }
        function Mr(e, r) {
          pe(e, r), (M = dr), (ht = U), (U = jr);
        }
        function Fa(e, r) {
          pe(e, r), (M = At), (ht = U), (U = jr);
        }
        function cn(e, r) {
          return {
            elt: fr(e, ve.list[r].localName, ve.attrs[r]),
            attrs: ve.attrs[r],
          };
        }
        function Ge() {
          if (ve.list.length !== 0) {
            var e = ve.list[ve.list.length - 1];
            if (e !== ve.MARKER && L.elements.lastIndexOf(e) === -1) {
              for (
                var r = ve.list.length - 2;
                r >= 0 &&
                ((e = ve.list[r]),
                !(e === ve.MARKER || L.elements.lastIndexOf(e) !== -1));
                r--
              );
              for (r = r + 1; r < ve.list.length; r++) {
                var y = Dr(function (x) {
                  return cn(x, r).elt;
                });
                ve.list[r] = y;
              }
            }
          }
        }
        var xr = { localName: "BM" };
        function Ua(e) {
          if (Ne(L.top, e) && ve.indexOf(L.top) === -1) return L.pop(), !0;
          for (var r = 0; r < 8; ) {
            r++;
            var y = ve.findElementByTag(e);
            if (!y) return !1;
            var x = L.elements.lastIndexOf(y);
            if (x === -1) return ve.remove(y), !0;
            if (!L.elementInScope(y)) return !0;
            for (var q = null, $, fe = x + 1; fe < L.elements.length; fe++)
              if (Ne(L.elements[fe], k)) {
                (q = L.elements[fe]), ($ = fe);
                break;
              }
            if (q) {
              var ye = L.elements[x - 1];
              ve.insertAfter(y, xr);
              for (
                var Re = q, je = q, Je = $, rt, Kt = 0;
                Kt++, (Re = L.elements[--Je]), Re !== y;

              ) {
                if (
                  ((rt = ve.indexOf(Re)),
                  Kt > 3 && rt !== -1 && (ve.remove(Re), (rt = -1)),
                  rt === -1)
                ) {
                  L.removeElement(Re);
                  continue;
                }
                var Ot = cn(ye.ownerDocument, rt);
                ve.replace(Re, Ot.elt, Ot.attrs),
                  (L.elements[Je] = Ot.elt),
                  (Re = Ot.elt),
                  je === q && (ve.remove(xr), ve.insertAfter(Ot.elt, xr)),
                  Re._appendChild(je),
                  (je = Re);
              }
              Dt && Ne(ye, ne)
                ? Ar(function () {
                    return je;
                  })
                : ye instanceof c.HTMLTemplateElement
                  ? ye.content._appendChild(je)
                  : ye._appendChild(je);
              for (
                var gr = cn(q.ownerDocument, ve.indexOf(y));
                q.hasChildNodes();

              )
                gr.elt._appendChild(q.firstChild);
              q._appendChild(gr.elt),
                ve.remove(y),
                ve.replace(xr, gr.elt, gr.attrs),
                L.removeElement(y);
              var Os = L.elements.lastIndexOf(q);
              L.elements.splice(Os + 1, 0, gr.elt);
            } else return L.popElement(y), ve.remove(y), !0;
          }
          return !0;
        }
        function ja() {
          L.pop(), (U = ht);
        }
        function Gt() {
          delete we._parser,
            (L.elements.length = 0),
            we.defaultView &&
              we.defaultView.dispatchEvent(new c.Event("load", {}));
        }
        function ie(e, r) {
          (M = r), te--;
        }
        function Te(e) {
          switch (e) {
            case 38:
              (yt = Te), (M = pr);
              break;
            case 60:
              if (Pa()) break;
              M = Va;
              break;
            case 0:
              K.push(e), (kt = !0);
              break;
            case -1:
              Ee();
              break;
            default:
              ur(se) || K.push(e);
              break;
          }
        }
        function At(e) {
          switch (e) {
            case 38:
              (yt = At), (M = pr);
              break;
            case 60:
              M = za;
              break;
            case 0:
              K.push(65533), (kt = !0);
              break;
            case -1:
              Ee();
              break;
            default:
              K.push(e);
              break;
          }
        }
        function dr(e) {
          switch (e) {
            case 60:
              M = Ka;
              break;
            case 0:
              K.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              ur(me) || K.push(e);
              break;
          }
        }
        function Mt(e) {
          switch (e) {
            case 60:
              M = Qa;
              break;
            case 0:
              K.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              ur(me) || K.push(e);
              break;
          }
        }
        function ln(e) {
          switch (e) {
            case 0:
              K.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              ur(be) || K.push(e);
              break;
          }
        }
        function Va(e) {
          switch (e) {
            case 33:
              M = Un;
              break;
            case 47:
              M = Ga;
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
              Oa(), ie(e, Pn);
              break;
            case 63:
              ie(e, Hr);
              break;
            default:
              K.push(60), ie(e, Te);
              break;
          }
        }
        function Ga(e) {
          switch (e) {
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
              cr(), ie(e, Pn);
              break;
            case 62:
              M = Te;
              break;
            case -1:
              K.push(60), K.push(47), Ee();
              break;
            default:
              ie(e, Hr);
              break;
          }
        }
        function Pn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              M = ot;
              break;
            case 47:
              M = It;
              break;
            case 62:
              (M = Te), gt();
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
              Ce += String.fromCharCode(e + 32);
              break;
            case 0:
              Ce += "\uFFFD";
              break;
            case -1:
              Ee();
              break;
            default:
              Ce += lr(W);
              break;
          }
        }
        function za(e) {
          e === 47 ? (mt(), (M = Za)) : (K.push(60), ie(e, At));
        }
        function Za(e) {
          switch (e) {
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
              cr(), ie(e, Wa);
              break;
            default:
              K.push(60), K.push(47), ie(e, At);
              break;
          }
        }
        function Wa(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qe(Ce)) {
                M = ot;
                return;
              }
              break;
            case 47:
              if (Qe(Ce)) {
                M = It;
                return;
              }
              break;
            case 62:
              if (Qe(Ce)) {
                (M = Te), gt();
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
              (Ce += String.fromCharCode(e + 32)), De.push(e);
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
              (Ce += String.fromCharCode(e)), De.push(e);
              return;
            default:
              break;
          }
          K.push(60), K.push(47), f(K, De), ie(e, At);
        }
        function Ka(e) {
          e === 47 ? (mt(), (M = Xa)) : (K.push(60), ie(e, dr));
        }
        function Xa(e) {
          switch (e) {
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
              cr(), ie(e, Ya);
              break;
            default:
              K.push(60), K.push(47), ie(e, dr);
              break;
          }
        }
        function Ya(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qe(Ce)) {
                M = ot;
                return;
              }
              break;
            case 47:
              if (Qe(Ce)) {
                M = It;
                return;
              }
              break;
            case 62:
              if (Qe(Ce)) {
                (M = Te), gt();
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
              (Ce += String.fromCharCode(e + 32)), De.push(e);
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
              (Ce += String.fromCharCode(e)), De.push(e);
              return;
            default:
              break;
          }
          K.push(60), K.push(47), f(K, De), ie(e, dr);
        }
        function Qa(e) {
          switch (e) {
            case 47:
              mt(), (M = $a);
              break;
            case 33:
              (M = es), K.push(60), K.push(33);
              break;
            default:
              K.push(60), ie(e, Mt);
              break;
          }
        }
        function $a(e) {
          switch (e) {
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
              cr(), ie(e, Ja);
              break;
            default:
              K.push(60), K.push(47), ie(e, Mt);
              break;
          }
        }
        function Ja(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qe(Ce)) {
                M = ot;
                return;
              }
              break;
            case 47:
              if (Qe(Ce)) {
                M = It;
                return;
              }
              break;
            case 62:
              if (Qe(Ce)) {
                (M = Te), gt();
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
              (Ce += String.fromCharCode(e + 32)), De.push(e);
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
              (Ce += String.fromCharCode(e)), De.push(e);
              return;
            default:
              break;
          }
          K.push(60), K.push(47), f(K, De), ie(e, Mt);
        }
        function es(e) {
          e === 45 ? ((M = ts), K.push(45)) : ie(e, Mt);
        }
        function ts(e) {
          e === 45 ? ((M = Bn), K.push(45)) : ie(e, Mt);
        }
        function it(e) {
          switch (e) {
            case 45:
              (M = rs), K.push(45);
              break;
            case 60:
              M = un;
              break;
            case 0:
              K.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              K.push(e);
              break;
          }
        }
        function rs(e) {
          switch (e) {
            case 45:
              (M = Bn), K.push(45);
              break;
            case 60:
              M = un;
              break;
            case 0:
              (M = it), K.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              (M = it), K.push(e);
              break;
          }
        }
        function Bn(e) {
          switch (e) {
            case 45:
              K.push(45);
              break;
            case 60:
              M = un;
              break;
            case 62:
              (M = Mt), K.push(62);
              break;
            case 0:
              (M = it), K.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              (M = it), K.push(e);
              break;
          }
        }
        function un(e) {
          switch (e) {
            case 47:
              mt(), (M = ns);
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
              mt(), K.push(60), ie(e, ss);
              break;
            default:
              K.push(60), ie(e, it);
              break;
          }
        }
        function ns(e) {
          switch (e) {
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
              cr(), ie(e, as);
              break;
            default:
              K.push(60), K.push(47), ie(e, it);
              break;
          }
        }
        function as(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              if (Qe(Ce)) {
                M = ot;
                return;
              }
              break;
            case 47:
              if (Qe(Ce)) {
                M = It;
                return;
              }
              break;
            case 62:
              if (Qe(Ce)) {
                (M = Te), gt();
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
              (Ce += String.fromCharCode(e + 32)), De.push(e);
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
              (Ce += String.fromCharCode(e)), De.push(e);
              return;
            default:
              break;
          }
          K.push(60), K.push(47), f(K, De), ie(e, it);
        }
        function ss(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              Fe(De) === "script" ? (M = xt) : (M = it), K.push(e);
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
              De.push(e + 32), K.push(e);
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
              De.push(e), K.push(e);
              break;
            default:
              ie(e, it);
              break;
          }
        }
        function xt(e) {
          switch (e) {
            case 45:
              (M = is), K.push(45);
              break;
            case 60:
              (M = fn), K.push(60);
              break;
            case 0:
              K.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              K.push(e);
              break;
          }
        }
        function is(e) {
          switch (e) {
            case 45:
              (M = os), K.push(45);
              break;
            case 60:
              (M = fn), K.push(60);
              break;
            case 0:
              (M = xt), K.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              (M = xt), K.push(e);
              break;
          }
        }
        function os(e) {
          switch (e) {
            case 45:
              K.push(45);
              break;
            case 60:
              (M = fn), K.push(60);
              break;
            case 62:
              (M = Mt), K.push(62);
              break;
            case 0:
              (M = xt), K.push(65533);
              break;
            case -1:
              Ee();
              break;
            default:
              (M = xt), K.push(e);
              break;
          }
        }
        function fn(e) {
          e === 47 ? (mt(), (M = cs), K.push(47)) : ie(e, xt);
        }
        function cs(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
              Fe(De) === "script" ? (M = it) : (M = xt), K.push(e);
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
              De.push(e + 32), K.push(e);
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
              De.push(e), K.push(e);
              break;
            default:
              ie(e, xt);
              break;
          }
        }
        function ot(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              M = It;
              break;
            case 62:
              (M = Te), gt();
              break;
            case -1:
              Ee();
              break;
            case 61:
              an(), (Ke += String.fromCharCode(e)), (M = hn);
              break;
            default:
              if (Ra()) break;
              an(), ie(e, hn);
              break;
          }
        }
        function hn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 47:
            case 62:
            case -1:
              ie(e, ls);
              break;
            case 61:
              M = Fn;
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
              Ke += String.fromCharCode(e + 32);
              break;
            case 0:
              Ke += "\uFFFD";
              break;
            case 34:
            case 39:
            case 60:
            default:
              Ke += lr(ce);
              break;
          }
        }
        function ls(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 47:
              Lt(Ke), (M = It);
              break;
            case 61:
              M = Fn;
              break;
            case 62:
              (M = Te), Lt(Ke), gt();
              break;
            case -1:
              Lt(Ke), Ee();
              break;
            default:
              Lt(Ke), an(), ie(e, hn);
              break;
          }
        }
        function Fn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              sn(), (M = Ir);
              break;
            case 39:
              sn(), (M = Rr);
              break;
            case 62:
            default:
              sn(), ie(e, Or);
              break;
          }
        }
        function Ir(e) {
          switch (e) {
            case 34:
              Lt(Ke, We), (M = dn);
              break;
            case 38:
              (yt = Ir), (M = pr);
              break;
            case 0:
              We += "\uFFFD";
              break;
            case -1:
              Ee();
              break;
            case 10:
              We += String.fromCharCode(e);
              break;
            default:
              We += lr(Y);
              break;
          }
        }
        function Rr(e) {
          switch (e) {
            case 39:
              Lt(Ke, We), (M = dn);
              break;
            case 38:
              (yt = Rr), (M = pr);
              break;
            case 0:
              We += "\uFFFD";
              break;
            case -1:
              Ee();
              break;
            case 10:
              We += String.fromCharCode(e);
              break;
            default:
              We += lr(z);
              break;
          }
        }
        function Or(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              Lt(Ke, We), (M = ot);
              break;
            case 38:
              (yt = Or), (M = pr);
              break;
            case 62:
              Lt(Ke, We), (M = Te), gt();
              break;
            case 0:
              We += "\uFFFD";
              break;
            case -1:
              te--, (M = Te);
              break;
            case 34:
            case 39:
            case 60:
            case 61:
            case 96:
            default:
              We += lr(O);
              break;
          }
        }
        function dn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              M = ot;
              break;
            case 47:
              M = It;
              break;
            case 62:
              (M = Te), gt();
              break;
            case -1:
              Ee();
              break;
            default:
              ie(e, ot);
              break;
          }
        }
        function It(e) {
          switch (e) {
            case 62:
              (M = Te), Ba(!0);
              break;
            case -1:
              Ee();
              break;
            default:
              ie(e, ot);
              break;
          }
        }
        function Hr(e, r, y) {
          var x = r.length;
          y ? (te += x - 1) : (te += x);
          var q = r.substring(0, x - 1);
          (q = q.replace(/\u0000/g, "\uFFFD")),
            (q = q.replace(
              /\u000D\u000A/g,
              `
`,
            )),
            (q = q.replace(
              /\u000D/g,
              `
`,
            )),
            Pe(I, q),
            (M = Te);
        }
        Hr.lookahead = ">";
        function Un(e, r, y) {
          if (r[0] === "-" && r[1] === "-") {
            (te += 2), Hn(), (M = us);
            return;
          }
          r.toUpperCase() === "DOCTYPE"
            ? ((te += 7), (M = _s))
            : r === "[CDATA[" && Ha()
              ? ((te += 7), (M = gn))
              : (M = Hr);
        }
        Un.lookahead = 7;
        function us(e) {
          switch ((Hn(), e)) {
            case 45:
              M = fs;
              break;
            case 62:
              (M = Te), Pe(I, Fe(xe));
              break;
            default:
              ie(e, zt);
              break;
          }
        }
        function fs(e) {
          switch (e) {
            case 45:
              M = qr;
              break;
            case 62:
              (M = Te), Pe(I, Fe(xe));
              break;
            case -1:
              Pe(I, Fe(xe)), Ee();
              break;
            default:
              xe.push(45), ie(e, zt);
              break;
          }
        }
        function zt(e) {
          switch (e) {
            case 60:
              xe.push(e), (M = hs);
              break;
            case 45:
              M = pn;
              break;
            case 0:
              xe.push(65533);
              break;
            case -1:
              Pe(I, Fe(xe)), Ee();
              break;
            default:
              xe.push(e);
              break;
          }
        }
        function hs(e) {
          switch (e) {
            case 33:
              xe.push(e), (M = ds);
              break;
            case 60:
              xe.push(e);
              break;
            default:
              ie(e, zt);
              break;
          }
        }
        function ds(e) {
          switch (e) {
            case 45:
              M = ps;
              break;
            default:
              ie(e, zt);
              break;
          }
        }
        function ps(e) {
          switch (e) {
            case 45:
              M = ms;
              break;
            default:
              ie(e, pn);
              break;
          }
        }
        function ms(e) {
          switch (e) {
            case 62:
            case -1:
              ie(e, qr);
              break;
            default:
              ie(e, qr);
              break;
          }
        }
        function pn(e) {
          switch (e) {
            case 45:
              M = qr;
              break;
            case -1:
              Pe(I, Fe(xe)), Ee();
              break;
            default:
              xe.push(45), ie(e, zt);
              break;
          }
        }
        function qr(e) {
          switch (e) {
            case 62:
              (M = Te), Pe(I, Fe(xe));
              break;
            case 33:
              M = gs;
              break;
            case 45:
              xe.push(45);
              break;
            case -1:
              Pe(I, Fe(xe)), Ee();
              break;
            default:
              xe.push(45), xe.push(45), ie(e, zt);
              break;
          }
        }
        function gs(e) {
          switch (e) {
            case 45:
              xe.push(45), xe.push(45), xe.push(33), (M = pn);
              break;
            case 62:
              (M = Te), Pe(I, Fe(xe));
              break;
            case -1:
              Pe(I, Fe(xe)), Ee();
              break;
            default:
              xe.push(45), xe.push(45), xe.push(33), ie(e, zt);
              break;
          }
        }
        function _s(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              M = jn;
              break;
            case -1:
              Yt(), ke(), Le(), Ee();
              break;
            default:
              ie(e, jn);
              break;
          }
        }
        function jn(e) {
          switch (e) {
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
              Yt(), Nt.push(e + 32), (M = mn);
              break;
            case 0:
              Yt(), Nt.push(65533), (M = mn);
              break;
            case 62:
              Yt(), ke(), (M = Te), Le();
              break;
            case -1:
              Yt(), ke(), Le(), Ee();
              break;
            default:
              Yt(), Nt.push(e), (M = mn);
              break;
          }
        }
        function mn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              M = Vn;
              break;
            case 62:
              (M = Te), Le();
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
              Nt.push(e + 32);
              break;
            case 0:
              Nt.push(65533);
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              Nt.push(e);
              break;
          }
        }
        function Vn(e, r, y) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              te += 1;
              break;
            case 62:
              (M = Te), (te += 1), Le();
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              (r = r.toUpperCase()),
                r === "PUBLIC"
                  ? ((te += 6), (M = bs))
                  : r === "SYSTEM"
                    ? ((te += 6), (M = Ts))
                    : (ke(), (M = Rt));
              break;
          }
        }
        Vn.lookahead = 6;
        function bs(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              M = Es;
              break;
            case 34:
              Cr(), (M = Gn);
              break;
            case 39:
              Cr(), (M = zn);
              break;
            case 62:
              ke(), (M = Te), Le();
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              ke(), (M = Rt);
              break;
          }
        }
        function Es(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              Cr(), (M = Gn);
              break;
            case 39:
              Cr(), (M = zn);
              break;
            case 62:
              ke(), (M = Te), Le();
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              ke(), (M = Rt);
              break;
          }
        }
        function Gn(e) {
          switch (e) {
            case 34:
              M = Zn;
              break;
            case 0:
              wt.push(65533);
              break;
            case 62:
              ke(), (M = Te), Le();
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              wt.push(e);
              break;
          }
        }
        function zn(e) {
          switch (e) {
            case 39:
              M = Zn;
              break;
            case 0:
              wt.push(65533);
              break;
            case 62:
              ke(), (M = Te), Le();
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              wt.push(e);
              break;
          }
        }
        function Zn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              M = vs;
              break;
            case 62:
              (M = Te), Le();
              break;
            case 34:
              Ct(), (M = Pr);
              break;
            case 39:
              Ct(), (M = Br);
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              ke(), (M = Rt);
              break;
          }
        }
        function vs(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (M = Te), Le();
              break;
            case 34:
              Ct(), (M = Pr);
              break;
            case 39:
              Ct(), (M = Br);
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              ke(), (M = Rt);
              break;
          }
        }
        function Ts(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              M = ys;
              break;
            case 34:
              Ct(), (M = Pr);
              break;
            case 39:
              Ct(), (M = Br);
              break;
            case 62:
              ke(), (M = Te), Le();
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              ke(), (M = Rt);
              break;
          }
        }
        function ys(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 34:
              Ct(), (M = Pr);
              break;
            case 39:
              Ct(), (M = Br);
              break;
            case 62:
              ke(), (M = Te), Le();
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              ke(), (M = Rt);
              break;
          }
        }
        function Pr(e) {
          switch (e) {
            case 34:
              M = Wn;
              break;
            case 0:
              St.push(65533);
              break;
            case 62:
              ke(), (M = Te), Le();
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              St.push(e);
              break;
          }
        }
        function Br(e) {
          switch (e) {
            case 39:
              M = Wn;
              break;
            case 0:
              St.push(65533);
              break;
            case 62:
              ke(), (M = Te), Le();
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              St.push(e);
              break;
          }
        }
        function Wn(e) {
          switch (e) {
            case 9:
            case 10:
            case 12:
            case 32:
              break;
            case 62:
              (M = Te), Le();
              break;
            case -1:
              ke(), Le(), Ee();
              break;
            default:
              M = Rt;
              break;
          }
        }
        function Rt(e) {
          switch (e) {
            case 62:
              (M = Te), Le();
              break;
            case -1:
              Le(), Ee();
              break;
            default:
              break;
          }
        }
        function gn(e) {
          switch (e) {
            case 93:
              M = Ns;
              break;
            case -1:
              Ee();
              break;
            case 0:
              kt = !0;
            default:
              ur(he) || K.push(e);
              break;
          }
        }
        function Ns(e) {
          switch (e) {
            case 93:
              M = ws;
              break;
            default:
              K.push(93), ie(e, gn);
              break;
          }
        }
        function ws(e) {
          switch (e) {
            case 93:
              K.push(93);
              break;
            case 62:
              Qt(), (M = Te);
              break;
            default:
              K.push(93), K.push(93), ie(e, gn);
              break;
          }
        }
        function pr(e) {
          switch ((mt(), De.push(38), e)) {
            case 9:
            case 10:
            case 12:
            case 32:
            case 60:
            case 38:
            case -1:
              ie(e, Zt);
              break;
            case 35:
              De.push(e), (M = Ss);
              break;
            default:
              ie(e, Kn);
              break;
          }
        }
        function Kn(e) {
          Me.lastIndex = te;
          var r = Me.exec(ee);
          if (!r) throw new Error("should never happen");
          var y = r[1];
          if (!y) {
            M = Zt;
            return;
          }
          switch (((te += y.length), f(De, tn(y)), yt)) {
            case Ir:
            case Rr:
            case Or:
              if (y[y.length - 1] !== ";" && /[=A-Za-z0-9]/.test(ee[te])) {
                M = Zt;
                return;
              }
              break;
            default:
              break;
          }
          mt();
          var x = ge[y];
          typeof x == "number" ? De.push(x) : f(De, x), (M = Zt);
        }
        Kn.lookahead = -bt;
        function Ss(e) {
          switch (((Oe = 0), e)) {
            case 120:
            case 88:
              De.push(e), (M = ks);
              break;
            default:
              ie(e, Ls);
              break;
          }
        }
        function ks(e) {
          switch (e) {
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
              ie(e, Cs);
              break;
            default:
              ie(e, Zt);
              break;
          }
        }
        function Ls(e) {
          switch (e) {
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
              ie(e, Ds);
              break;
            default:
              ie(e, Zt);
              break;
          }
        }
        function Cs(e) {
          switch (e) {
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
              (Oe *= 16), (Oe += e - 55);
              break;
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
              (Oe *= 16), (Oe += e - 87);
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
              (Oe *= 16), (Oe += e - 48);
              break;
            case 59:
              M = Fr;
              break;
            default:
              ie(e, Fr);
              break;
          }
        }
        function Ds(e) {
          switch (e) {
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
              (Oe *= 10), (Oe += e - 48);
              break;
            case 59:
              M = Fr;
              break;
            default:
              ie(e, Fr);
              break;
          }
        }
        function Fr(e) {
          Oe in X
            ? (Oe = X[Oe])
            : (Oe > 1114111 || (Oe >= 55296 && Oe < 57344)) && (Oe = 65533),
            mt(),
            Oe <= 65535
              ? De.push(Oe)
              : ((Oe = Oe - 65536),
                De.push(55296 + (Oe >> 10)),
                De.push(56320 + (Oe & 1023))),
            ie(e, Zt);
        }
        function Zt(e) {
          switch (yt) {
            case Ir:
            case Rr:
            case Or:
              We += Fe(De);
              break;
            default:
              f(K, De);
              break;
          }
          ie(e, yt);
        }
        function As(e, r, y, x) {
          switch (e) {
            case 1:
              if (((r = r.replace(ze, "")), r.length === 0)) return;
              break;
            case 4:
              we._appendChild(we.createComment(r));
              return;
            case 5:
              var q = r,
                $ = y,
                fe = x;
              we.appendChild(new l(we, q, $, fe)),
                rn ||
                q.toLowerCase() !== "html" ||
                J.test($) ||
                (fe && fe.toLowerCase() === B) ||
                (fe === void 0 && T.test($))
                  ? (we._quirks = !0)
                  : (g.test($) || (fe !== void 0 && T.test($))) &&
                    (we._limitedQuirks = !0),
                (U = Xn);
              return;
          }
          (we._quirks = !0), (U = Xn), U(e, r, y, x);
        }
        function Xn(e, r, y, x) {
          var q;
          switch (e) {
            case 1:
              if (((r = r.replace(ze, "")), r.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              we._appendChild(we.createComment(r));
              return;
            case 2:
              if (r === "html") {
                (q = fr(we, r, y)), L.push(q), we.appendChild(q), (U = Ur);
                return;
              }
              break;
            case 3:
              switch (r) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          (q = fr(we, "html", null)),
            L.push(q),
            we.appendChild(q),
            (U = Ur),
            U(e, r, y, x);
        }
        function Ur(e, r, y, x) {
          switch (e) {
            case 1:
              if (((r = r.replace(ze, "")), r.length === 0)) return;
              break;
            case 5:
              return;
            case 4:
              at(r);
              return;
            case 2:
              switch (r) {
                case "html":
                  ue(e, r, y, x);
                  return;
                case "head":
                  var q = pe(r, y);
                  (wr = q), (U = qe);
                  return;
              }
              break;
            case 3:
              switch (r) {
                case "html":
                case "head":
                case "body":
                case "br":
                  break;
                default:
                  return;
              }
          }
          Ur(m, "head", null), U(e, r, y, x);
        }
        function qe(e, r, y, x) {
          switch (e) {
            case 1:
              var q = r.match(ze);
              if (
                (q && (st(q[0]), (r = r.substring(q[0].length))),
                r.length === 0)
              )
                return;
              break;
            case 4:
              at(r);
              return;
            case 5:
              return;
            case 2:
              switch (r) {
                case "html":
                  ue(e, r, y, x);
                  return;
                case "meta":
                case "base":
                case "basefont":
                case "bgsound":
                case "link":
                  pe(r, y), L.pop();
                  return;
                case "title":
                  Fa(r, y);
                  return;
                case "noscript":
                  if (!Sr) {
                    pe(r, y), (U = Yn);
                    return;
                  }
                case "noframes":
                case "style":
                  Mr(r, y);
                  return;
                case "script":
                  Dr(function ($) {
                    var fe = fr($, r, y);
                    return (
                      (fe._parser_inserted = !0),
                      (fe._force_async = !1),
                      jt && (fe._already_started = !0),
                      Qt(),
                      fe
                    );
                  }),
                    (M = Mt),
                    (ht = U),
                    (U = jr);
                  return;
                case "template":
                  pe(r, y), ve.insertMarker(), (He = !1), (U = En), dt.push(U);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (r) {
                case "head":
                  L.pop(), (U = _n);
                  return;
                case "body":
                case "html":
                case "br":
                  break;
                case "template":
                  if (!L.contains("template")) return;
                  L.generateImpliedEndTags(null, "thorough"),
                    L.popTag("template"),
                    ve.clearToMarker(),
                    dt.pop(),
                    hr();
                  return;
                default:
                  return;
              }
              break;
          }
          qe(N, "head", null), U(e, r, y, x);
        }
        function Yn(e, r, y, x) {
          switch (e) {
            case 5:
              return;
            case 4:
              qe(e, r);
              return;
            case 1:
              var q = r.match(ze);
              if (
                (q && (qe(e, q[0]), (r = r.substring(q[0].length))),
                r.length === 0)
              )
                return;
              break;
            case 2:
              switch (r) {
                case "html":
                  ue(e, r, y, x);
                  return;
                case "basefont":
                case "bgsound":
                case "link":
                case "meta":
                case "noframes":
                case "style":
                  qe(e, r, y);
                  return;
                case "head":
                case "noscript":
                  return;
              }
              break;
            case 3:
              switch (r) {
                case "noscript":
                  L.pop(), (U = qe);
                  return;
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          Yn(N, "noscript", null), U(e, r, y, x);
        }
        function _n(e, r, y, x) {
          switch (e) {
            case 1:
              var q = r.match(ze);
              if (
                (q && (st(q[0]), (r = r.substring(q[0].length))),
                r.length === 0)
              )
                return;
              break;
            case 4:
              at(r);
              return;
            case 5:
              return;
            case 2:
              switch (r) {
                case "html":
                  ue(e, r, y, x);
                  return;
                case "body":
                  pe(r, y), (He = !1), (U = ue);
                  return;
                case "frameset":
                  pe(r, y), (U = vn);
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
                  L.push(wr), qe(m, r, y), L.removeElement(wr);
                  return;
                case "head":
                  return;
              }
              break;
            case 3:
              switch (r) {
                case "template":
                  return qe(e, r, y, x);
                case "body":
                case "html":
                case "br":
                  break;
                default:
                  return;
              }
              break;
          }
          _n(m, "body", null), (He = !0), U(e, r, y, x);
        }
        function ue(e, r, y, x) {
          var q, $, fe, ye;
          switch (e) {
            case 1:
              if (kt && ((r = r.replace(Et, "")), r.length === 0)) return;
              He && Se.test(r) && (He = !1), Ge(), st(r);
              return;
            case 5:
              return;
            case 4:
              at(r);
              return;
            case -1:
              if (dt.length) return En(e);
              Gt();
              return;
            case 2:
              switch (r) {
                case "html":
                  if (L.contains("template")) return;
                  vt(y, L.elements[0]);
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
                  qe(m, r, y);
                  return;
                case "body":
                  if (
                    ((q = L.elements[1]),
                    !q ||
                      !(q instanceof c.HTMLBodyElement) ||
                      L.contains("template"))
                  )
                    return;
                  (He = !1), vt(y, q);
                  return;
                case "frameset":
                  if (
                    !He ||
                    ((q = L.elements[1]),
                    !q || !(q instanceof c.HTMLBodyElement))
                  )
                    return;
                  for (
                    q.parentNode && q.parentNode.removeChild(q);
                    !(L.top instanceof c.HTMLHtmlElement);

                  )
                    L.pop();
                  pe(r, y), (U = vn);
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
                  L.inButtonScope("p") && ue(N, "p"), pe(r, y);
                  return;
                case "menu":
                  L.inButtonScope("p") && ue(N, "p"),
                    Ne(L.top, "menuitem") && L.pop(),
                    pe(r, y);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  L.inButtonScope("p") && ue(N, "p"),
                    L.top instanceof c.HTMLHeadingElement && L.pop(),
                    pe(r, y);
                  return;
                case "pre":
                case "listing":
                  L.inButtonScope("p") && ue(N, "p"),
                    pe(r, y),
                    (Vt = !0),
                    (He = !1);
                  return;
                case "form":
                  if (pt && !L.contains("template")) return;
                  L.inButtonScope("p") && ue(N, "p"),
                    (ye = pe(r, y)),
                    L.contains("template") || (pt = ye);
                  return;
                case "li":
                  for (He = !1, $ = L.elements.length - 1; $ >= 0; $--) {
                    if (((fe = L.elements[$]), fe instanceof c.HTMLLIElement)) {
                      ue(N, "li");
                      break;
                    }
                    if (Ne(fe, k) && !Ne(fe, _)) break;
                  }
                  L.inButtonScope("p") && ue(N, "p"), pe(r, y);
                  return;
                case "dd":
                case "dt":
                  for (He = !1, $ = L.elements.length - 1; $ >= 0; $--) {
                    if (((fe = L.elements[$]), Ne(fe, ae))) {
                      ue(N, fe.localName);
                      break;
                    }
                    if (Ne(fe, k) && !Ne(fe, _)) break;
                  }
                  L.inButtonScope("p") && ue(N, "p"), pe(r, y);
                  return;
                case "plaintext":
                  L.inButtonScope("p") && ue(N, "p"), pe(r, y), (M = ln);
                  return;
                case "button":
                  L.inScope("button")
                    ? (ue(N, "button"), U(e, r, y, x))
                    : (Ge(), pe(r, y), (He = !1));
                  return;
                case "a":
                  var Re = ve.findElementByTag("a");
                  Re && (ue(N, r), ve.remove(Re), L.removeElement(Re));
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
                  Ge(), ve.push(pe(r, y), y);
                  return;
                case "nobr":
                  Ge(), L.inScope(r) && (ue(N, r), Ge()), ve.push(pe(r, y), y);
                  return;
                case "applet":
                case "marquee":
                case "object":
                  Ge(), pe(r, y), ve.insertMarker(), (He = !1);
                  return;
                case "table":
                  !we._quirks && L.inButtonScope("p") && ue(N, "p"),
                    pe(r, y),
                    (He = !1),
                    (U = $e);
                  return;
                case "area":
                case "br":
                case "embed":
                case "img":
                case "keygen":
                case "wbr":
                  Ge(), pe(r, y), L.pop(), (He = !1);
                  return;
                case "input":
                  Ge(), (ye = pe(r, y)), L.pop();
                  var je = ye.getAttribute("type");
                  (!je || je.toLowerCase() !== "hidden") && (He = !1);
                  return;
                case "param":
                case "source":
                case "track":
                  pe(r, y), L.pop();
                  return;
                case "hr":
                  L.inButtonScope("p") && ue(N, "p"),
                    Ne(L.top, "menuitem") && L.pop(),
                    pe(r, y),
                    L.pop(),
                    (He = !1);
                  return;
                case "image":
                  ue(m, "img", y, x);
                  return;
                case "textarea":
                  pe(r, y), (Vt = !0), (He = !1), (M = At), (ht = U), (U = jr);
                  return;
                case "xmp":
                  L.inButtonScope("p") && ue(N, "p"), Ge(), (He = !1), Mr(r, y);
                  return;
                case "iframe":
                  (He = !1), Mr(r, y);
                  return;
                case "noembed":
                  Mr(r, y);
                  return;
                case "select":
                  Ge(),
                    pe(r, y),
                    (He = !1),
                    U === $e || U === bn || U === Wt || U === mr || U === $t
                      ? (U = Gr)
                      : (U = _t);
                  return;
                case "optgroup":
                case "option":
                  L.top instanceof c.HTMLOptionElement && ue(N, "option"),
                    Ge(),
                    pe(r, y);
                  return;
                case "menuitem":
                  Ne(L.top, "menuitem") && L.pop(), Ge(), pe(r, y);
                  return;
                case "rb":
                case "rtc":
                  L.inScope("ruby") && L.generateImpliedEndTags(), pe(r, y);
                  return;
                case "rp":
                case "rt":
                  L.inScope("ruby") && L.generateImpliedEndTags("rtc"),
                    pe(r, y);
                  return;
                case "math":
                  Ge(), ir(y), Xt(y), on(r, y, a.MATHML), x && L.pop();
                  return;
                case "svg":
                  Ge(), Pt(y), Xt(y), on(r, y, a.SVG), x && L.pop();
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
              Ge(), pe(r, y);
              return;
            case 3:
              switch (r) {
                case "template":
                  qe(N, r, y);
                  return;
                case "body":
                  if (!L.inScope("body")) return;
                  U = Qn;
                  return;
                case "html":
                  if (!L.inScope("body")) return;
                  (U = Qn), U(e, r, y);
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
                  if (!L.inScope(r)) return;
                  L.generateImpliedEndTags(), L.popTag(r);
                  return;
                case "form":
                  if (L.contains("template")) {
                    if (!L.inScope("form")) return;
                    L.generateImpliedEndTags(), L.popTag("form");
                  } else {
                    var Je = pt;
                    if (((pt = null), !Je || !L.elementInScope(Je))) return;
                    L.generateImpliedEndTags(), L.removeElement(Je);
                  }
                  return;
                case "p":
                  L.inButtonScope(r)
                    ? (L.generateImpliedEndTags(r), L.popTag(r))
                    : (ue(m, r, null), U(e, r, y, x));
                  return;
                case "li":
                  if (!L.inListItemScope(r)) return;
                  L.generateImpliedEndTags(r), L.popTag(r);
                  return;
                case "dd":
                case "dt":
                  if (!L.inScope(r)) return;
                  L.generateImpliedEndTags(r), L.popTag(r);
                  return;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                  if (!L.elementTypeInScope(c.HTMLHeadingElement)) return;
                  L.generateImpliedEndTags(),
                    L.popElementType(c.HTMLHeadingElement);
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
                  var rt = Ua(r);
                  if (rt) return;
                  break;
                case "applet":
                case "marquee":
                case "object":
                  if (!L.inScope(r)) return;
                  L.generateImpliedEndTags(), L.popTag(r), ve.clearToMarker();
                  return;
                case "br":
                  ue(m, r, null);
                  return;
              }
              for ($ = L.elements.length - 1; $ >= 0; $--)
                if (((fe = L.elements[$]), Ne(fe, r))) {
                  L.generateImpliedEndTags(r), L.popElement(fe);
                  break;
                } else if (Ne(fe, k)) return;
              return;
          }
        }
        function jr(e, r, y, x) {
          switch (e) {
            case 1:
              st(r);
              return;
            case -1:
              L.top instanceof c.HTMLScriptElement &&
                (L.top._already_started = !0),
                L.pop(),
                (U = ht),
                U(e);
              return;
            case 3:
              r === "script" ? ja() : (L.pop(), (U = ht));
              return;
            default:
              return;
          }
        }
        function $e(e, r, y, x) {
          function q(fe) {
            for (var ye = 0, Re = fe.length; ye < Re; ye++)
              if (fe[ye][0] === "type") return fe[ye][1].toLowerCase();
            return null;
          }
          switch (e) {
            case 1:
              if (nn) {
                ue(e, r, y, x);
                return;
              } else if (Ne(L.top, ne)) {
                (kr = []), (ht = U), (U = Ms), U(e, r, y, x);
                return;
              }
              break;
            case 4:
              at(r);
              return;
            case 5:
              return;
            case 2:
              switch (r) {
                case "caption":
                  L.clearToContext(D), ve.insertMarker(), pe(r, y), (U = bn);
                  return;
                case "colgroup":
                  L.clearToContext(D), pe(r, y), (U = Vr);
                  return;
                case "col":
                  $e(m, "colgroup", null), U(e, r, y, x);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  L.clearToContext(D), pe(r, y), (U = Wt);
                  return;
                case "td":
                case "th":
                case "tr":
                  $e(m, "tbody", null), U(e, r, y, x);
                  return;
                case "table":
                  if (!L.inTableScope(r)) return;
                  $e(N, r), U(e, r, y, x);
                  return;
                case "style":
                case "script":
                case "template":
                  qe(e, r, y, x);
                  return;
                case "input":
                  var $ = q(y);
                  if ($ !== "hidden") break;
                  pe(r, y), L.pop();
                  return;
                case "form":
                  if (pt || L.contains("template")) return;
                  (pt = pe(r, y)), L.popElement(pt);
                  return;
              }
              break;
            case 3:
              switch (r) {
                case "table":
                  if (!L.inTableScope(r)) return;
                  L.popTag(r), hr();
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
                  qe(e, r, y, x);
                  return;
              }
              break;
            case -1:
              ue(e, r, y, x);
              return;
          }
          (Dt = !0), ue(e, r, y, x), (Dt = !1);
        }
        function Ms(e, r, y, x) {
          if (e === b) {
            if (kt && ((r = r.replace(Et, "")), r.length === 0)) return;
            kr.push(r);
          } else {
            var q = kr.join("");
            (kr.length = 0),
              Se.test(q) ? ((Dt = !0), ue(b, q), (Dt = !1)) : st(q),
              (U = ht),
              U(e, r, y, x);
          }
        }
        function bn(e, r, y, x) {
          function q() {
            return L.inTableScope("caption")
              ? (L.generateImpliedEndTags(),
                L.popTag("caption"),
                ve.clearToMarker(),
                (U = $e),
                !0)
              : !1;
          }
          switch (e) {
            case 2:
              switch (r) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  q() && U(e, r, y, x);
                  return;
              }
              break;
            case 3:
              switch (r) {
                case "caption":
                  q();
                  return;
                case "table":
                  q() && U(e, r, y, x);
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
          ue(e, r, y, x);
        }
        function Vr(e, r, y, x) {
          switch (e) {
            case 1:
              var q = r.match(ze);
              if (
                (q && (st(q[0]), (r = r.substring(q[0].length))),
                r.length === 0)
              )
                return;
              break;
            case 4:
              at(r);
              return;
            case 5:
              return;
            case 2:
              switch (r) {
                case "html":
                  ue(e, r, y, x);
                  return;
                case "col":
                  pe(r, y), L.pop();
                  return;
                case "template":
                  qe(e, r, y, x);
                  return;
              }
              break;
            case 3:
              switch (r) {
                case "colgroup":
                  if (!Ne(L.top, "colgroup")) return;
                  L.pop(), (U = $e);
                  return;
                case "col":
                  return;
                case "template":
                  qe(e, r, y, x);
                  return;
              }
              break;
            case -1:
              ue(e, r, y, x);
              return;
          }
          Ne(L.top, "colgroup") && (Vr(N, "colgroup"), U(e, r, y, x));
        }
        function Wt(e, r, y, x) {
          function q() {
            (!L.inTableScope("tbody") &&
              !L.inTableScope("thead") &&
              !L.inTableScope("tfoot")) ||
              (L.clearToContext(P),
              Wt(N, L.top.localName, null),
              U(e, r, y, x));
          }
          switch (e) {
            case 2:
              switch (r) {
                case "tr":
                  L.clearToContext(P), pe(r, y), (U = mr);
                  return;
                case "th":
                case "td":
                  Wt(m, "tr", null), U(e, r, y, x);
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  q();
                  return;
              }
              break;
            case 3:
              switch (r) {
                case "table":
                  q();
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  L.inTableScope(r) && (L.clearToContext(P), L.pop(), (U = $e));
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
          $e(e, r, y, x);
        }
        function mr(e, r, y, x) {
          function q() {
            return L.inTableScope("tr")
              ? (L.clearToContext(Z), L.pop(), (U = Wt), !0)
              : !1;
          }
          switch (e) {
            case 2:
              switch (r) {
                case "th":
                case "td":
                  L.clearToContext(Z), pe(r, y), (U = $t), ve.insertMarker();
                  return;
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                case "tr":
                  q() && U(e, r, y, x);
                  return;
              }
              break;
            case 3:
              switch (r) {
                case "tr":
                  q();
                  return;
                case "table":
                  q() && U(e, r, y, x);
                  return;
                case "tbody":
                case "tfoot":
                case "thead":
                  L.inTableScope(r) && q() && U(e, r, y, x);
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
          $e(e, r, y, x);
        }
        function $t(e, r, y, x) {
          switch (e) {
            case 2:
              switch (r) {
                case "caption":
                case "col":
                case "colgroup":
                case "tbody":
                case "td":
                case "tfoot":
                case "th":
                case "thead":
                case "tr":
                  L.inTableScope("td")
                    ? ($t(N, "td"), U(e, r, y, x))
                    : L.inTableScope("th") && ($t(N, "th"), U(e, r, y, x));
                  return;
              }
              break;
            case 3:
              switch (r) {
                case "td":
                case "th":
                  if (!L.inTableScope(r)) return;
                  L.generateImpliedEndTags(),
                    L.popTag(r),
                    ve.clearToMarker(),
                    (U = mr);
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
                  if (!L.inTableScope(r)) return;
                  $t(N, L.inTableScope("td") ? "td" : "th"), U(e, r, y, x);
                  return;
              }
              break;
          }
          ue(e, r, y, x);
        }
        function _t(e, r, y, x) {
          switch (e) {
            case 1:
              if (kt && ((r = r.replace(Et, "")), r.length === 0)) return;
              st(r);
              return;
            case 4:
              at(r);
              return;
            case 5:
              return;
            case -1:
              ue(e, r, y, x);
              return;
            case 2:
              switch (r) {
                case "html":
                  ue(e, r, y, x);
                  return;
                case "option":
                  L.top instanceof c.HTMLOptionElement && _t(N, r), pe(r, y);
                  return;
                case "optgroup":
                  L.top instanceof c.HTMLOptionElement && _t(N, "option"),
                    L.top instanceof c.HTMLOptGroupElement && _t(N, r),
                    pe(r, y);
                  return;
                case "select":
                  _t(N, r);
                  return;
                case "input":
                case "keygen":
                case "textarea":
                  if (!L.inSelectScope("select")) return;
                  _t(N, "select"), U(e, r, y, x);
                  return;
                case "script":
                case "template":
                  qe(e, r, y, x);
                  return;
              }
              break;
            case 3:
              switch (r) {
                case "optgroup":
                  L.top instanceof c.HTMLOptionElement &&
                    L.elements[L.elements.length - 2] instanceof
                      c.HTMLOptGroupElement &&
                    _t(N, "option"),
                    L.top instanceof c.HTMLOptGroupElement && L.pop();
                  return;
                case "option":
                  L.top instanceof c.HTMLOptionElement && L.pop();
                  return;
                case "select":
                  if (!L.inSelectScope(r)) return;
                  L.popTag(r), hr();
                  return;
                case "template":
                  qe(e, r, y, x);
                  return;
              }
              break;
          }
        }
        function Gr(e, r, y, x) {
          switch (r) {
            case "caption":
            case "table":
            case "tbody":
            case "tfoot":
            case "thead":
            case "tr":
            case "td":
            case "th":
              switch (e) {
                case 2:
                  Gr(N, "select"), U(e, r, y, x);
                  return;
                case 3:
                  L.inTableScope(r) && (Gr(N, "select"), U(e, r, y, x));
                  return;
              }
          }
          _t(e, r, y, x);
        }
        function En(e, r, y, x) {
          function q($) {
            (U = $), (dt[dt.length - 1] = U), U(e, r, y, x);
          }
          switch (e) {
            case 1:
            case 4:
            case 5:
              ue(e, r, y, x);
              return;
            case -1:
              L.contains("template")
                ? (L.popTag("template"),
                  ve.clearToMarker(),
                  dt.pop(),
                  hr(),
                  U(e, r, y, x))
                : Gt();
              return;
            case 2:
              switch (r) {
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
                  qe(e, r, y, x);
                  return;
                case "caption":
                case "colgroup":
                case "tbody":
                case "tfoot":
                case "thead":
                  q($e);
                  return;
                case "col":
                  q(Vr);
                  return;
                case "tr":
                  q(Wt);
                  return;
                case "td":
                case "th":
                  q(mr);
                  return;
              }
              q(ue);
              return;
            case 3:
              switch (r) {
                case "template":
                  qe(e, r, y, x);
                  return;
                default:
                  return;
              }
          }
        }
        function Qn(e, r, y, x) {
          switch (e) {
            case 1:
              if (Se.test(r)) break;
              ue(e, r);
              return;
            case 4:
              L.elements[0]._appendChild(we.createComment(r));
              return;
            case 5:
              return;
            case -1:
              Gt();
              return;
            case 2:
              if (r === "html") {
                ue(e, r, y, x);
                return;
              }
              break;
            case 3:
              if (r === "html") {
                if (jt) return;
                U = Is;
                return;
              }
              break;
          }
          (U = ue), U(e, r, y, x);
        }
        function vn(e, r, y, x) {
          switch (e) {
            case 1:
              (r = r.replace(Xe, "")), r.length > 0 && st(r);
              return;
            case 4:
              at(r);
              return;
            case 5:
              return;
            case -1:
              Gt();
              return;
            case 2:
              switch (r) {
                case "html":
                  ue(e, r, y, x);
                  return;
                case "frameset":
                  pe(r, y);
                  return;
                case "frame":
                  pe(r, y), L.pop();
                  return;
                case "noframes":
                  qe(e, r, y, x);
                  return;
              }
              break;
            case 3:
              if (r === "frameset") {
                if (jt && L.top instanceof c.HTMLHtmlElement) return;
                L.pop(),
                  !jt && !(L.top instanceof c.HTMLFrameSetElement) && (U = xs);
                return;
              }
              break;
          }
        }
        function xs(e, r, y, x) {
          switch (e) {
            case 1:
              (r = r.replace(Xe, "")), r.length > 0 && st(r);
              return;
            case 4:
              at(r);
              return;
            case 5:
              return;
            case -1:
              Gt();
              return;
            case 2:
              switch (r) {
                case "html":
                  ue(e, r, y, x);
                  return;
                case "noframes":
                  qe(e, r, y, x);
                  return;
              }
              break;
            case 3:
              if (r === "html") {
                U = Rs;
                return;
              }
              break;
          }
        }
        function Is(e, r, y, x) {
          switch (e) {
            case 1:
              if (Se.test(r)) break;
              ue(e, r, y, x);
              return;
            case 4:
              we._appendChild(we.createComment(r));
              return;
            case 5:
              ue(e, r, y, x);
              return;
            case -1:
              Gt();
              return;
            case 2:
              if (r === "html") {
                ue(e, r, y, x);
                return;
              }
              break;
          }
          (U = ue), U(e, r, y, x);
        }
        function Rs(e, r, y, x) {
          switch (e) {
            case 1:
              (r = r.replace(Xe, "")), r.length > 0 && ue(e, r, y, x);
              return;
            case 4:
              we._appendChild(we.createComment(r));
              return;
            case 5:
              ue(e, r, y, x);
              return;
            case -1:
              Gt();
              return;
            case 2:
              switch (r) {
                case "html":
                  ue(e, r, y, x);
                  return;
                case "noframes":
                  qe(e, r, y, x);
                  return;
              }
              break;
          }
        }
        function $n(e, r, y, x) {
          function q(Re) {
            for (var je = 0, Je = Re.length; je < Je; je++)
              switch (Re[je][0]) {
                case "color":
                case "face":
                case "size":
                  return !0;
              }
            return !1;
          }
          var $;
          switch (e) {
            case 1:
              He && Ye.test(r) && (He = !1),
                kt && (r = r.replace(Et, "\uFFFD")),
                st(r);
              return;
            case 4:
              at(r);
              return;
            case 5:
              return;
            case 2:
              switch (r) {
                case "font":
                  if (!q(y)) break;
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
                  if (jt) break;
                  do L.pop(), ($ = L.top);
                  while ($.namespaceURI !== a.HTML && !sr($) && !ut($));
                  Pe(e, r, y, x);
                  return;
              }
              ($ = L.elements.length === 1 && jt ? V : L.top),
                $.namespaceURI === a.MATHML
                  ? ir(y)
                  : $.namespaceURI === a.SVG && ((r = vr(r)), Pt(y)),
                Xt(y),
                on(r, y, $.namespaceURI),
                x && (r === "script" && ($.namespaceURI, a.SVG), L.pop());
              return;
            case 3:
              if (
                (($ = L.top),
                r === "script" &&
                  $.namespaceURI === a.SVG &&
                  $.localName === "script")
              )
                L.pop();
              else
                for (var fe = L.elements.length - 1, ye = L.elements[fe]; ; ) {
                  if (ye.localName.toLowerCase() === r) {
                    L.popElement(ye);
                    break;
                  }
                  if (((ye = L.elements[--fe]), ye.namespaceURI === a.HTML)) {
                    U(e, r, y, x);
                    break;
                  }
                }
              return;
          }
        }
        return (
          (Lr.testTokenizer = function (e, r, y, x) {
            var q = [];
            switch (r) {
              case "PCDATA state":
                M = Te;
                break;
              case "RCDATA state":
                M = At;
                break;
              case "RAWTEXT state":
                M = dr;
                break;
              case "PLAINTEXT state":
                M = ln;
                break;
            }
            if (
              (y && (yr = y),
              (Pe = function (fe, ye, Re, je) {
                switch ((Qt(), fe)) {
                  case 1:
                    q.length > 0 && q[q.length - 1][0] === "Character"
                      ? (q[q.length - 1][1] += ye)
                      : q.push(["Character", ye]);
                    break;
                  case 4:
                    q.push(["Comment", ye]);
                    break;
                  case 5:
                    q.push([
                      "DOCTYPE",
                      ye,
                      Re === void 0 ? null : Re,
                      je === void 0 ? null : je,
                      !rn,
                    ]);
                    break;
                  case 2:
                    for (
                      var Je = Object.create(null), rt = 0;
                      rt < Re.length;
                      rt++
                    ) {
                      var Kt = Re[rt];
                      Kt.length === 1 ? (Je[Kt[0]] = "") : (Je[Kt[0]] = Kt[1]);
                    }
                    var Ot = ["StartTag", ye, Je];
                    je && Ot.push(!0), q.push(Ot);
                    break;
                  case 3:
                    q.push(["EndTag", ye]);
                    break;
                  case -1:
                    break;
                }
              }),
              !x)
            )
              this.parse(e, !0);
            else {
              for (var $ = 0; $ < e.length; $++) this.parse(e[$]);
              this.parse("", !0);
            }
            return q;
          }),
          Lr
        );
      }
    },
  }),
  en = le({
    "external/npm/node_modules/domino/lib/DOMImplementation.js"(E, S) {
      "use strict";
      S.exports = c;
      var p = Mn(),
        l = xn(),
        t = In(),
        a = Be(),
        o = Sn();
      function c(s) {
        this.contextObject = s;
      }
      var f = {
        xml: { "": !0, "1.0": !0, "2.0": !0 },
        core: { "": !0, "2.0": !0 },
        html: { "": !0, "1.0": !0, "2.0": !0 },
        xhtml: { "": !0, "1.0": !0, "2.0": !0 },
      };
      c.prototype = {
        hasFeature: function (b, m) {
          var N = f[(b || "").toLowerCase()];
          return (N && N[m || ""]) || !1;
        },
        createDocumentType: function (b, m, N) {
          return (
            o.isValidQName(b) || a.InvalidCharacterError(),
            new l(this.contextObject, b, m, N)
          );
        },
        createDocument: function (b, m, N) {
          var I = new p(!1, null),
            H;
          return (
            m ? (H = I.createElementNS(b, m)) : (H = null),
            N && I.appendChild(N),
            H && I.appendChild(H),
            b === a.NAMESPACE.HTML
              ? (I._contentType = "application/xhtml+xml")
              : b === a.NAMESPACE.SVG
                ? (I._contentType = "image/svg+xml")
                : (I._contentType = "application/xml"),
            I
          );
        },
        createHTMLDocument: function (b) {
          var m = new p(!0, null);
          m.appendChild(new l(m, "html"));
          var N = m.createElement("html");
          m.appendChild(N);
          var I = m.createElement("head");
          if ((N.appendChild(I), b !== void 0)) {
            var H = m.createElement("title");
            I.appendChild(H), H.appendChild(m.createTextNode(b));
          }
          return N.appendChild(m.createElement("body")), (m.modclock = 1), m;
        },
        mozSetOutputMutationHandler: function (s, b) {
          s.mutationHandler = b;
        },
        mozGetInputMutationHandler: function (s) {
          a.nyi();
        },
        mozHTMLParser: t,
      };
    },
  }),
  Ei = le({
    "external/npm/node_modules/domino/lib/Location.js"(E, S) {
      "use strict";
      var p = Cn(),
        l = Da();
      S.exports = t;
      function t(a, o) {
        (this._window = a), (this._href = o);
      }
      t.prototype = Object.create(l.prototype, {
        constructor: { value: t },
        href: {
          get: function () {
            return this._href;
          },
          set: function (a) {
            this.assign(a);
          },
        },
        assign: {
          value: function (a) {
            var o = new p(this._href),
              c = o.resolve(a);
            this._href = c;
          },
        },
        replace: {
          value: function (a) {
            this.assign(a);
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
  vi = le({
    "external/npm/node_modules/domino/lib/NavigatorID.js"(E, S) {
      "use strict";
      var p = Object.create(null, {
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
      S.exports = p;
    },
  }),
  Ti = le({
    "external/npm/node_modules/domino/lib/WindowTimers.js"(E, S) {
      "use strict";
      var p = { setTimeout, clearTimeout, setInterval, clearInterval };
      S.exports = p;
    },
  }),
  xa = le({
    "external/npm/node_modules/domino/lib/impl.js"(E, S) {
      "use strict";
      var p = Be();
      (E = S.exports =
        {
          CSSStyleDeclaration: Dn(),
          CharacterData: $r(),
          Comment: wa(),
          DOMException: yn(),
          DOMImplementation: en(),
          DOMTokenList: Ea(),
          Document: Mn(),
          DocumentFragment: Sa(),
          DocumentType: xn(),
          Element: Er(),
          HTMLParser: In(),
          NamedNodeMap: Ta(),
          Node: Ve(),
          NodeList: ar(),
          NodeFilter: Jr(),
          ProcessingInstruction: ka(),
          Text: Na(),
          Window: Ia(),
        }),
        p.merge(E, Ca()),
        p.merge(E, An().elements),
        p.merge(E, Ma().elements);
    },
  }),
  Ia = le({
    "external/npm/node_modules/domino/lib/Window.js"(E, S) {
      "use strict";
      var p = en(),
        l = ma(),
        t = Ei(),
        a = Be();
      S.exports = o;
      function o(c) {
        (this.document = c || new p(null).createHTMLDocument("")),
          (this.document._scripting_enabled = !0),
          (this.document.defaultView = this),
          (this.location = new t(
            this,
            this.document._address || "about:blank",
          ));
      }
      (o.prototype = Object.create(l.prototype, {
        console: { value: console },
        history: { value: { back: a.nyi, forward: a.nyi, go: a.nyi } },
        navigator: { value: vi() },
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
          set: function (c) {
            this._setEventHandler("load", c);
          },
        },
        getComputedStyle: {
          value: function (f) {
            return f.style;
          },
        },
      })),
        a.expose(Ti(), o),
        a.expose(xa(), o);
    },
  }),
  yi = le({
    "external/npm/node_modules/domino/lib/index.js"(E) {
      var S = en(),
        p = In(),
        l = Ia(),
        t = xa();
      (E.createDOMImplementation = function () {
        return new S(null);
      }),
        (E.createDocument = function (a, o) {
          if (a || o) {
            var c = new p();
            return c.parse(a || "", !0), c.document();
          }
          return new S(null).createHTMLDocument("");
        }),
        (E.createIncrementalHTMLParser = function () {
          var a = new p();
          return {
            write: function (o) {
              o.length > 0 &&
                a.parse(o, !1, function () {
                  return !0;
                });
            },
            end: function (o) {
              a.parse(o || "", !0, function () {
                return !0;
              });
            },
            process: function (o) {
              return a.parse("", !1, o);
            },
            document: function () {
              return a.document();
            },
          };
        }),
        (E.createWindow = function (a, o) {
          var c = E.createDocument(a);
          return o !== void 0 && (c._address = o), new t.Window(c);
        }),
        (E.impl = t);
    },
  }),
  ha = yi();
function Ni() {
  Object.assign(globalThis, ha.impl),
    (globalThis.KeyboardEvent = ha.impl.Event);
}
Ni();
