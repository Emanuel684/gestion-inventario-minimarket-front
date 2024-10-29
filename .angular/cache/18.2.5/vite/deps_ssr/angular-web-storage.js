import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-QIUYSFOA.js";
import "./chunk-VDZEJD3D.js";
import "./chunk-NQ4HTGF6.js";

// node_modules/angular-web-storage/fesm2022/angular-web-storage.mjs
var isBrowser = typeof document === "object" && !!document;
var StorageUtil = class _StorageUtil {
  static get(storage, key) {
    if (storage == null) {
      return null;
    }
    const value = _StorageUtil.parse(storage.getItem(key) || "null") || null;
    if (value === null) {
      return null;
    }
    if (typeof value === "object" && typeof value._expired !== "undefined" && value._expired !== 0 && +/* @__PURE__ */ new Date() > value._expired) {
      _StorageUtil.remove(storage, key);
      return null;
    }
    return value._value || null;
  }
  static set(storage, key, value, expiredAt = 0, expiredUnit = "t") {
    if (storage == null) {
      return;
    }
    storage.setItem(key, _StorageUtil.stringify({
      _expired: _StorageUtil.getExpired(expiredAt, expiredUnit),
      _value: value
    }));
  }
  static remove(storage, key) {
    if (storage == null) {
      return;
    }
    storage.removeItem(key);
  }
  static key(storage, index) {
    if (storage == null) {
      return null;
    }
    return storage.key(index);
  }
  static getExpired(val, unit) {
    if (val <= 0) {
      return 0;
    }
    const now = +/* @__PURE__ */ new Date();
    switch (unit) {
      case "s":
        return now + 1e3 * val;
      case "m":
        return now + 1e3 * 60 * val;
      case "h":
        return now + 1e3 * 60 * 60 * val;
      case "d":
        return now + 1e3 * 60 * 60 * 24 * val;
      case "w":
        return now + 1e3 * 60 * 60 * 24 * 7 * val;
      case "y":
        return now + 1e3 * 60 * 60 * 24 * 365 * val;
      case "t":
        return now + val;
      default:
        return 0;
    }
  }
  static stringify(value) {
    return JSON.stringify(value);
  }
  static parse(text) {
    try {
      return JSON.parse(text) || null;
    } catch (e) {
      return text;
    }
  }
};
var cache = {};
function WebStorage(storage, key, expiredAt = 0, expiredUnit = "d") {
  return (target, propertyName) => {
    key = key || propertyName;
    Object.defineProperty(target, propertyName, {
      get: () => {
        return StorageUtil.get(storage, key);
      },
      set: (value) => {
        if (!cache[key]) {
          const storedValue = StorageUtil.get(storage, key);
          if (storedValue === null) {
            StorageUtil.set(storage, key, value, expiredAt, expiredUnit);
          }
          cache[key] = true;
          return;
        }
        StorageUtil.set(storage, key, value, expiredAt, expiredUnit);
      },
      enumerable: true,
      configurable: true
    });
  };
}
function LocalStorage(key, expiredAt = 0, expiredUnit = "t") {
  return WebStorage(isBrowser ? localStorage : null, key, expiredAt, expiredUnit);
}
function SessionStorage(key, expiredAt = 0, expiredUnit = "t") {
  return WebStorage(isBrowser ? sessionStorage : null, key, expiredAt, expiredUnit);
}
var StorageService = class _StorageService {
  constructor(storage) {
    this.storage = storage;
  }
  get(key) {
    return StorageUtil.get(this.storage, key);
  }
  set(key, value, expiredAt = 0, expiredUnit = "d") {
    return StorageUtil.set(this.storage, key, value, expiredAt, expiredUnit);
  }
  /**
   * 删除指定key，如：
   * - `remove('key')` 删除 `key` 键
   * - `remove(/BMap_\w+/)` 批量删除所有 BMap_ 开头的键
   * @param key 键名或正则表达式
   */
  remove(key) {
    if (typeof key === "string") {
      StorageUtil.remove(this.storage, key);
      return;
    }
    let index = 0;
    let next = StorageUtil.key(this.storage, index);
    const ls = [];
    while (next) {
      if (key.test(next)) {
        ls.push(next);
      }
      next = StorageUtil.key(this.storage, ++index);
    }
    ls.forEach((v) => StorageUtil.remove(this.storage, v));
  }
  clear() {
    this.storage?.clear();
  }
  static {
    this.ɵfac = function StorageService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _StorageService)(ɵɵinject(Storage));
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _StorageService,
      factory: _StorageService.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StorageService, [{
    type: Injectable
  }], () => [{
    type: Storage
  }], null);
})();
var LocalStorageService = class _LocalStorageService extends StorageService {
  constructor() {
    super(isBrowser ? localStorage : null);
  }
  static {
    this.ɵfac = function LocalStorageService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LocalStorageService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _LocalStorageService,
      factory: _LocalStorageService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalStorageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var SessionStorageService = class _SessionStorageService extends StorageService {
  constructor() {
    super(isBrowser ? sessionStorage : null);
  }
  static {
    this.ɵfac = function SessionStorageService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SessionStorageService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _SessionStorageService,
      factory: _SessionStorageService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SessionStorageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
export {
  LocalStorage,
  LocalStorageService,
  SessionStorage,
  SessionStorageService,
  StorageService,
  StorageUtil,
  isBrowser
};
//# sourceMappingURL=angular-web-storage.js.map
