// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayRemoveAt.ts
function arrayRemoveAt(arr, idx) {
  return arr.splice(idx, 1)[0];
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayClear.ts
function arrayClear(arr) {
  return arr.splice(0);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayRemove.ts
function arrayRemove(arr, value) {
  const idx = arr.indexOf(value);
  if (idx > -1) {
    arrayRemoveAt(arr, idx);
    return true;
  }
  return false;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/PriorityList.ts
var PriorityList = class {
  constructor(init) {
    this.items = /* @__PURE__ */ new Map();
    this.defaultItems = new Array();
    if (isDefined(init)) {
      for (const [key, value] of init) {
        this.add(key, value);
      }
    }
  }
  add(key, value) {
    if (isNullOrUndefined(key)) {
      this.defaultItems.push(value);
    } else {
      let list = this.items.get(key);
      if (isNullOrUndefined(list)) {
        this.items.set(key, list = []);
      }
      list.push(value);
    }
    return this;
  }
  entries() {
    return this.items.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  keys() {
    return this.items.keys();
  }
  *values() {
    for (const item of this.defaultItems) {
      yield item;
    }
    for (const list of this.items.values()) {
      for (const item of list) {
        yield item;
      }
    }
  }
  has(key) {
    if (isDefined(key)) {
      return this.items.has(key);
    } else {
      return this.defaultItems.length > 0;
    }
  }
  get(key) {
    if (isNullOrUndefined(key)) {
      return this.defaultItems;
    }
    return this.items.get(key) || [];
  }
  count(key) {
    if (isNullOrUndefined(key)) {
      return this.defaultItems.length;
    }
    const list = this.get(key);
    if (isDefined(list)) {
      return list.length;
    }
    return 0;
  }
  get size() {
    let size = this.defaultItems.length;
    for (const list of this.items.values()) {
      size += list.length;
    }
    return size;
  }
  delete(key) {
    if (isNullOrUndefined(key)) {
      return arrayClear(this.defaultItems).length > 0;
    } else {
      return this.items.delete(key);
    }
  }
  remove(key, value) {
    if (isNullOrUndefined(key)) {
      arrayRemove(this.defaultItems, value);
    } else {
      const list = this.items.get(key);
      if (isDefined(list)) {
        arrayRemove(list, value);
        if (list.length === 0) {
          this.items.delete(key);
        }
      }
    }
  }
  clear() {
    this.items.clear();
    arrayClear(this.defaultItems);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/EventBase.ts
var EventBase = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
    this.listenerOptions = /* @__PURE__ */ new Map();
  }
  addEventListener(type2, callback, options) {
    if (isFunction(callback)) {
      let listeners = this.listeners.get(type2);
      if (!listeners) {
        listeners = new Array();
        this.listeners.set(type2, listeners);
      }
      if (!listeners.find((c) => c === callback)) {
        listeners.push(callback);
        if (options) {
          this.listenerOptions.set(callback, options);
        }
      }
    }
  }
  removeEventListener(type2, callback) {
    if (isFunction(callback)) {
      const listeners = this.listeners.get(type2);
      if (listeners) {
        this.removeListener(listeners, callback);
      }
    }
  }
  clearEventListeners(type2) {
    for (const [evtName, handlers] of this.listeners) {
      if (isNullOrUndefined(type2) || type2 === evtName) {
        for (const handler of handlers) {
          this.removeEventListener(type2, handler);
        }
        arrayClear(handlers);
        this.listeners.delete(evtName);
      }
    }
  }
  removeListener(listeners, callback) {
    const idx = listeners.findIndex((c) => c === callback);
    if (idx >= 0) {
      arrayRemoveAt(listeners, idx);
      if (this.listenerOptions.has(callback)) {
        this.listenerOptions.delete(callback);
      }
    }
  }
  dispatchEvent(evt) {
    const listeners = this.listeners.get(evt.type);
    if (listeners) {
      for (const callback of listeners) {
        const options = this.listenerOptions.get(callback);
        if (isDefined(options) && !isBoolean(options) && options.once) {
          this.removeListener(listeners, callback);
        }
        callback.call(this, evt);
      }
    }
    return !evt.defaultPrevented;
  }
};
var TypedEvent = class extends Event {
  get type() {
    return super.type;
  }
  constructor(type2) {
    super(type2);
  }
};
var TypedEventBase = class extends EventBase {
  constructor() {
    super(...arguments);
    this.bubblers = /* @__PURE__ */ new Set();
    this.scopes = /* @__PURE__ */ new WeakMap();
  }
  addBubbler(bubbler) {
    this.bubblers.add(bubbler);
  }
  removeBubbler(bubbler) {
    this.bubblers.delete(bubbler);
  }
  addEventListener(type2, callback, options) {
    super.addEventListener(type2, callback, options);
  }
  removeEventListener(type2, callback) {
    super.removeEventListener(type2, callback);
  }
  clearEventListeners(type2) {
    return super.clearEventListeners(type2);
  }
  addScopedEventListener(scope, type2, callback, options) {
    if (!this.scopes.has(scope)) {
      this.scopes.set(scope, []);
    }
    this.scopes.get(scope).push([type2, callback]);
    this.addEventListener(type2, callback, options);
  }
  removeScope(scope) {
    const listeners = this.scopes.get(scope);
    if (listeners) {
      this.scopes.delete(scope);
      for (const [type2, listener] of listeners) {
        this.removeEventListener(type2, listener);
      }
    }
  }
  dispatchEvent(evt) {
    if (!super.dispatchEvent(evt)) {
      return false;
    }
    for (const bubbler of this.bubblers) {
      if (!bubbler.dispatchEvent(evt)) {
        return false;
      }
    }
    return true;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/identity.ts
function alwaysTrue() {
  return true;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/typeChecks.ts
function t(o, s, c) {
  return typeof o === s || o instanceof c;
}
function isFunction(obj) {
  return t(obj, "function", Function);
}
function isBoolean(obj) {
  return t(obj, "boolean", Boolean);
}
function isArray(obj) {
  return obj instanceof Array;
}
function isNullOrUndefined(obj) {
  return obj === null || obj === void 0;
}
function isDefined(obj) {
  return !isNullOrUndefined(obj);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/Task.ts
var Task = class {
  constructor(resolveTestOrAutoStart, rejectTestOrAutoStart, autoStart = true) {
    this.onThens = new Array();
    this.onCatches = new Array();
    this._result = void 0;
    this._error = void 0;
    this._started = false;
    this._errored = false;
    this._finished = false;
    if (isFunction(resolveTestOrAutoStart)) {
      this.resolveTest = resolveTestOrAutoStart;
    } else {
      this.resolveTest = alwaysTrue;
    }
    if (isFunction(rejectTestOrAutoStart)) {
      this.rejectTest = rejectTestOrAutoStart;
    } else {
      this.rejectTest = alwaysTrue;
    }
    if (isBoolean(resolveTestOrAutoStart)) {
      this.autoStart = resolveTestOrAutoStart;
    } else if (isBoolean(rejectTestOrAutoStart)) {
      this.autoStart = rejectTestOrAutoStart;
    } else if (isDefined(autoStart)) {
      this.autoStart = autoStart;
    } else {
      this.autoStart = false;
    }
    this.resolve = (value) => {
      if (this.running && this.resolveTest(value)) {
        this._result = value;
        for (const thenner of this.onThens) {
          thenner(value);
        }
        this.clear();
        this._finished = true;
      }
    };
    this.reject = (reason) => {
      if (this.running && this.rejectTest(reason)) {
        this._error = reason;
        this._errored = true;
        for (const catcher of this.onCatches) {
          catcher(reason);
        }
        this.clear();
        this._finished = true;
      }
    };
    if (this.autoStart) {
      this.start();
    }
  }
  clear() {
    arrayClear(this.onThens);
    arrayClear(this.onCatches);
  }
  start() {
    this._started = true;
  }
  get result() {
    if (isDefined(this.error)) {
      throw this.error;
    }
    return this._result;
  }
  get error() {
    return this._error;
  }
  get started() {
    return this._started;
  }
  get finished() {
    return this._finished;
  }
  get running() {
    return this.started && !this.finished;
  }
  get errored() {
    return this._errored;
  }
  get [Symbol.toStringTag]() {
    return this.toString();
  }
  project() {
    return new Promise((resolve, reject) => {
      if (!this.finished) {
        this.onThens.push(resolve);
        this.onCatches.push(reject);
      } else if (this.errored) {
        reject(this.error);
      } else {
        resolve(this.result);
      }
    });
  }
  then(onfulfilled, onrejected) {
    return this.project().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.project().catch(onrejected);
  }
  finally(onfinally) {
    return this.project().finally(onfinally);
  }
  reset() {
    if (this.running) {
      this.reject("Resetting previous invocation");
    }
    this.clear();
    this._result = void 0;
    this._error = void 0;
    this._errored = false;
    this._finished = false;
    this._started = false;
    if (this.autoStart) {
      this.start();
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/Promisifier.ts
var Promisifier = class {
  constructor(resolveRejectTest, selectValue, selectRejectionReason) {
    this.callback = null;
    this.promise = new Promise((resolve, reject) => {
      this.callback = (...args) => {
        if (resolveRejectTest(...args)) {
          resolve(selectValue(...args));
        } else {
          reject(selectRejectionReason(...args));
        }
      };
    });
  }
  get [Symbol.toStringTag]() {
    return this.promise.toString();
  }
  then(onfulfilled, onrejected) {
    return this.promise.then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.promise.catch(onrejected);
  }
  finally(onfinally) {
    return this.promise.finally(onfinally);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/flags.ts
var oculusBrowserPattern = /OculusBrowser\/(\d+)\.(\d+)\.(\d+)/i;
var oculusMatch = navigator.userAgent.match(oculusBrowserPattern);
var isOculusBrowser = !!oculusMatch;
var oculusBrowserVersion = isOculusBrowser && {
  major: parseFloat(oculusMatch[1]),
  minor: parseFloat(oculusMatch[2]),
  patch: parseFloat(oculusMatch[3])
};
var isOculusGo = isOculusBrowser && /pacific/i.test(navigator.userAgent);
var isOculusQuest = isOculusBrowser && /quest/i.test(navigator.userAgent);
var isOculusQuest2 = isOculusBrowser && /quest 2/i.test(navigator.userAgent);
var isWorkerSupported = "Worker" in globalThis;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/gis/Datum.ts
var invF = 298.257223563;
var equatorialRadius = 6378137;
var flattening = 1 / invF;
var flatteningComp = 1 - flattening;
var n = flattening / (2 - flattening);
var A = equatorialRadius / (1 + n) * (1 + n * n / 4 + n * n * n * n / 64);
var e = Math.sqrt(1 - flatteningComp * flatteningComp);
var esq = 1 - flatteningComp * flatteningComp;
var e0sq = e * e / (1 - e * e);
var alpha1 = 1 - esq * (0.25 + esq * (3 / 64 + 5 * esq / 256));
var alpha2 = esq * (3 / 8 + esq * (3 / 32 + 45 * esq / 1024));
var alpha3 = esq * esq * (15 / 256 + esq * 45 / 1024);
var alpha4 = esq * esq * esq * (35 / 3072);
var beta = [
  n / 2 - 2 * n * n / 3 + 37 * n * n * n / 96,
  n * n / 48 + n * n * n / 15,
  17 * n * n * n / 480
];
var delta = [
  2 * n - 2 * n * n / 3,
  7 * n * n / 3 - 8 * n * n * n / 5,
  56 * n * n * n / 15
];

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/math/angleClamp.ts
var Tau = 2 * Math.PI;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/math/xy2i.ts
function xy2i(x, y, width, components = 1) {
  return components * (x + width * y);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/BaseProgress.ts
var BaseProgress = class extends TypedEventBase {
  constructor() {
    super(...arguments);
    this.attached = new Array();
    this.soFar = null;
    this.total = null;
    this.msg = null;
    this.est = null;
  }
  get p() {
    return this.total > 0 ? this.soFar / this.total : 0;
  }
  report(soFar, total, msg, est) {
    this.soFar = soFar;
    this.total = total;
    this.msg = msg;
    this.est = est;
    for (const attach of this.attached) {
      attach.report(soFar, total, msg, est);
    }
  }
  attach(prog) {
    this.attached.push(prog);
    prog.report(this.soFar, this.total, this.msg, this.est);
  }
  clear() {
    this.report(0, 0);
    this._clear();
  }
  start(msg) {
    this.report(0, 1, msg || "starting");
  }
  end(msg) {
    this.report(1, 1, msg || "done");
    this._clear();
  }
  _clear() {
    this.soFar = null;
    this.total = null;
    this.msg = null;
    this.est = null;
    arrayClear(this.attached);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/singleton.ts
function singleton(name, create) {
  const box = globalThis;
  let value = box[name];
  if (isNullOrUndefined(value)) {
    if (isNullOrUndefined(create)) {
      throw new Error(`No value ${name} found`);
    }
    value = create();
    box[name] = value;
  }
  return value;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/mapInvert.ts
function mapInvert(map) {
  const mapOut = /* @__PURE__ */ new Map();
  for (const [key, value] of map) {
    mapOut.set(value, key);
  }
  return mapOut;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/units/fileSize.ts
var base2Labels = /* @__PURE__ */ new Map([
  [1, "KiB"],
  [2, "MiB"],
  [3, "GiB"],
  [4, "TiB"]
]);
var base10Labels = /* @__PURE__ */ new Map([
  [1, "KB"],
  [2, "MB"],
  [3, "GB"],
  [4, "TB"]
]);
var base2Sizes = mapInvert(base2Labels);
var base10Sizes = mapInvert(base10Labels);

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/units/length.ts
var MICROMETERS_PER_MILLIMETER = 1e3;
var MILLIMETERS_PER_CENTIMETER = 10;
var CENTIMETERS_PER_INCH = 2.54;
var CENTIMETERS_PER_METER = 100;
var INCHES_PER_HAND = 4;
var HANDS_PER_FOOT = 3;
var FEET_PER_YARD = 3;
var FEET_PER_ROD = 16.5;
var METERS_PER_KILOMETER = 1e3;
var RODS_PER_FURLONG = 40;
var FURLONGS_PER_MILE = 8;
var MICROMETERS_PER_CENTIMETER = MICROMETERS_PER_MILLIMETER * MILLIMETERS_PER_CENTIMETER;
var MICROMETERS_PER_INCH = MICROMETERS_PER_CENTIMETER * CENTIMETERS_PER_INCH;
var MICROMETERS_PER_HAND = MICROMETERS_PER_INCH * INCHES_PER_HAND;
var MICROMETERS_PER_FOOT = MICROMETERS_PER_HAND * HANDS_PER_FOOT;
var MICROMETERS_PER_YARD = MICROMETERS_PER_FOOT * FEET_PER_YARD;
var MICROMETERS_PER_METER = MICROMETERS_PER_CENTIMETER * CENTIMETERS_PER_METER;
var MICROMETERS_PER_ROD = MICROMETERS_PER_FOOT * FEET_PER_ROD;
var MICROMETERS_PER_FURLONG = MICROMETERS_PER_ROD * RODS_PER_FURLONG;
var MICROMETERS_PER_KILOMETER = MICROMETERS_PER_METER * METERS_PER_KILOMETER;
var MICROMETERS_PER_MILE = MICROMETERS_PER_FURLONG * FURLONGS_PER_MILE;
var MILLIMETERS_PER_INCH = MILLIMETERS_PER_CENTIMETER * CENTIMETERS_PER_INCH;
var MILLIMETERS_PER_HAND = MILLIMETERS_PER_INCH * INCHES_PER_HAND;
var MILLIMETERS_PER_FOOT = MILLIMETERS_PER_HAND * HANDS_PER_FOOT;
var MILLIMETERS_PER_YARD = MILLIMETERS_PER_FOOT * FEET_PER_YARD;
var MILLIMETERS_PER_METER = MILLIMETERS_PER_CENTIMETER * CENTIMETERS_PER_METER;
var MILLIMETERS_PER_ROD = MILLIMETERS_PER_FOOT * FEET_PER_ROD;
var MILLIMETERS_PER_FURLONG = MILLIMETERS_PER_ROD * RODS_PER_FURLONG;
var MILLIMETERS_PER_KILOMETER = MILLIMETERS_PER_METER * METERS_PER_KILOMETER;
var MILLIMETERS_PER_MILE = MILLIMETERS_PER_FURLONG * FURLONGS_PER_MILE;
var CENTIMETERS_PER_HAND = CENTIMETERS_PER_INCH * INCHES_PER_HAND;
var CENTIMETERS_PER_FOOT = CENTIMETERS_PER_HAND * HANDS_PER_FOOT;
var CENTIMETERS_PER_YARD = CENTIMETERS_PER_FOOT * FEET_PER_YARD;
var CENTIMETERS_PER_ROD = CENTIMETERS_PER_FOOT * FEET_PER_ROD;
var CENTIMETERS_PER_FURLONG = CENTIMETERS_PER_ROD * RODS_PER_FURLONG;
var CENTIMETERS_PER_KILOMETER = CENTIMETERS_PER_METER * METERS_PER_KILOMETER;
var CENTIMETERS_PER_MILE = CENTIMETERS_PER_FURLONG * FURLONGS_PER_MILE;
var INCHES_PER_FOOT = INCHES_PER_HAND * HANDS_PER_FOOT;
var INCHES_PER_YARD = INCHES_PER_FOOT * FEET_PER_YARD;
var INCHES_PER_METER = CENTIMETERS_PER_METER / CENTIMETERS_PER_INCH;
var INCHES_PER_ROD = INCHES_PER_FOOT * FEET_PER_ROD;
var INCHES_PER_FURLONG = INCHES_PER_ROD * RODS_PER_FURLONG;
var INCHES_PER_KILOMETER = INCHES_PER_METER * METERS_PER_KILOMETER;
var INCHES_PER_MILE = INCHES_PER_FURLONG * FURLONGS_PER_MILE;
var HANDS_PER_YARD = HANDS_PER_FOOT * FEET_PER_YARD;
var HANDS_PER_METER = CENTIMETERS_PER_METER / CENTIMETERS_PER_HAND;
var HANDS_PER_ROD = HANDS_PER_FOOT * FEET_PER_ROD;
var HANDS_PER_FURLONG = HANDS_PER_ROD * RODS_PER_FURLONG;
var HANDS_PER_KILOMETER = HANDS_PER_METER * METERS_PER_KILOMETER;
var HANDS_PER_MILE = HANDS_PER_FURLONG * FURLONGS_PER_MILE;
var FEET_PER_METER = INCHES_PER_METER / INCHES_PER_FOOT;
var FEET_PER_FURLONG = FEET_PER_ROD * RODS_PER_FURLONG;
var FEET_PER_KILOMETER = FEET_PER_METER * METERS_PER_KILOMETER;
var FEET_PER_MILE = FEET_PER_FURLONG * FURLONGS_PER_MILE;
var YARDS_PER_METER = INCHES_PER_METER / INCHES_PER_YARD;
var YARDS_PER_ROD = FEET_PER_ROD / FEET_PER_YARD;
var YARDS_PER_FURLONG = YARDS_PER_ROD * RODS_PER_FURLONG;
var YARDS_PER_KILOMETER = YARDS_PER_METER * METERS_PER_KILOMETER;
var YARDS_PER_MILE = YARDS_PER_FURLONG * FURLONGS_PER_MILE;
var METERS_PER_ROD = FEET_PER_ROD / FEET_PER_METER;
var METERS_PER_FURLONG = METERS_PER_ROD * RODS_PER_FURLONG;
var METERS_PER_MILE = METERS_PER_FURLONG * FURLONGS_PER_MILE;
var RODS_PER_KILOMETER = METERS_PER_KILOMETER / METERS_PER_ROD;
var RODS_PER_MILE = RODS_PER_FURLONG * FURLONGS_PER_MILE;
var FURLONGS_PER_KILOMETER = METERS_PER_KILOMETER / METERS_PER_FURLONG;
var KILOMETERS_PER_MILE = FURLONGS_PER_MILE / FURLONGS_PER_KILOMETER;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/URLBuilder.ts
function parsePort(portString) {
  if (isDefined(portString) && portString.length > 0) {
    return parseFloat(portString);
  }
  return null;
}
var URLBuilder = class {
  constructor(url, base) {
    this._url = null;
    this._base = void 0;
    this._protocol = null;
    this._host = null;
    this._hostName = null;
    this._userName = null;
    this._password = null;
    this._port = null;
    this._pathName = null;
    this._hash = null;
    this._query = /* @__PURE__ */ new Map();
    if (url !== void 0) {
      this._url = new URL(url, base);
      this.rehydrate();
    }
  }
  rehydrate() {
    if (isDefined(this._protocol) && this._protocol !== this._url.protocol) {
      this._url.protocol = this._protocol;
    }
    if (isDefined(this._host) && this._host !== this._url.host) {
      this._url.host = this._host;
    }
    if (isDefined(this._hostName) && this._hostName !== this._url.hostname) {
      this._url.hostname = this._hostName;
    }
    if (isDefined(this._userName) && this._userName !== this._url.username) {
      this._url.username = this._userName;
    }
    if (isDefined(this._password) && this._password !== this._url.password) {
      this._url.password = this._password;
    }
    if (isDefined(this._port) && this._port.toFixed(0) !== this._url.port) {
      this._url.port = this._port.toFixed(0);
    }
    if (isDefined(this._pathName) && this._pathName !== this._url.pathname) {
      this._url.pathname = this._pathName;
    }
    if (isDefined(this._hash) && this._hash !== this._url.hash) {
      this._url.hash = this._hash;
    }
    for (const [k, v] of this._query) {
      this._url.searchParams.set(k, v);
    }
    this._protocol = this._url.protocol;
    this._host = this._url.host;
    this._hostName = this._url.hostname;
    this._userName = this._url.username;
    this._password = this._url.password;
    this._port = parsePort(this._url.port);
    this._pathName = this._url.pathname;
    this._hash = this._url.hash;
    this._url.searchParams.forEach((v, k) => this._query.set(k, v));
  }
  refresh() {
    if (this._url === null) {
      if (isDefined(this._protocol) && (isDefined(this._host) || isDefined(this._hostName))) {
        if (isDefined(this._host)) {
          this._url = new URL(`${this._protocol}//${this._host}`, this._base);
          this._port = parsePort(this._url.port);
          this.rehydrate();
          return false;
        } else if (isDefined(this._hostName)) {
          this._url = new URL(`${this._protocol}//${this._hostName}`, this._base);
          this.rehydrate();
          return false;
        }
      } else if (isDefined(this._pathName) && isDefined(this._base)) {
        this._url = new URL(this._pathName, this._base);
        this.rehydrate();
        return false;
      }
    }
    return isDefined(this._url);
  }
  base(base) {
    if (this._url !== null) {
      throw new Error("Cannot redefine base after defining the protocol and domain");
    }
    this._base = base;
    this.refresh();
    return this;
  }
  protocol(protocol) {
    this._protocol = protocol;
    if (this.refresh()) {
      this._url.protocol = protocol;
    }
    return this;
  }
  host(host) {
    this._host = host;
    if (this.refresh()) {
      this._url.host = host;
      this._hostName = this._url.hostname;
      this._port = parsePort(this._url.port);
    }
    return this;
  }
  hostName(hostName) {
    this._hostName = hostName;
    if (this.refresh()) {
      this._url.hostname = hostName;
      this._host = `${this._url.hostname}:${this._url.port}`;
    }
    return this;
  }
  port(port) {
    this._port = port;
    if (this.refresh()) {
      this._url.port = port.toFixed(0);
      this._host = `${this._url.hostname}:${this._url.port}`;
    }
    return this;
  }
  userName(userName) {
    this._userName = userName;
    if (this.refresh()) {
      this._url.username = userName;
    }
    return this;
  }
  password(password) {
    this._password = password;
    if (this.refresh()) {
      this._url.password = password;
    }
    return this;
  }
  path(path) {
    this._pathName = path;
    if (this.refresh()) {
      this._url.pathname = path;
    }
    return this;
  }
  pathPop(pattern) {
    pattern = pattern || /\/[^\/]+\/?$/;
    return this.path(this._pathName.replace(pattern, ""));
  }
  pathPush(part) {
    let path = this._pathName;
    if (!path.endsWith("/")) {
      path += "/";
    }
    path += part;
    return this.path(path);
  }
  query(name, value) {
    this._query.set(name, value);
    if (this.refresh()) {
      this._url.searchParams.set(name, value);
    }
    return this;
  }
  hash(hash) {
    this._hash = hash;
    if (this.refresh()) {
      this._url.hash = hash;
    }
    return this;
  }
  toURL() {
    return this._url;
  }
  toString() {
    return this._url.href;
  }
  [Symbol.toStringTag]() {
    return this.toString();
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/workers/WorkerServer.ts
var WorkerServerProgress = class extends BaseProgress {
  constructor(server, taskID) {
    super();
    this.server = server;
    this.taskID = taskID;
  }
  report(soFar, total, msg, est) {
    const message = {
      type: "progress",
      taskID: this.taskID,
      soFar,
      total,
      msg,
      est
    };
    this.server.postMessage(message);
  }
};
var WorkerServer = class {
  constructor(self) {
    this.self = self;
    this.methods = /* @__PURE__ */ new Map();
    this.self.addEventListener("message", (evt) => {
      const data = evt.data;
      this.callMethod(data);
    });
  }
  postMessage(message, transferables) {
    if (isDefined(transferables)) {
      this.self.postMessage(message, transferables);
    } else {
      this.self.postMessage(message);
    }
  }
  callMethod(data) {
    const method = this.methods.get(data.methodName);
    if (method) {
      try {
        if (isArray(data.params)) {
          method(data.taskID, ...data.params);
        } else if (isDefined(data.params)) {
          method(data.taskID, data.params);
        } else {
          method(data.taskID);
        }
      } catch (exp) {
        this.onError(data.taskID, `method invocation error: ${data.methodName}(${exp.message || exp})`);
      }
    } else {
      this.onError(data.taskID, `method not found: ${data.methodName}`);
    }
  }
  onError(taskID, errorMessage) {
    const message = {
      type: "error",
      taskID,
      errorMessage
    };
    this.postMessage(message);
  }
  onReturn(taskID, returnValue, transferReturnValue) {
    let message = null;
    if (returnValue === void 0) {
      message = {
        type: "return",
        taskID
      };
    } else {
      message = {
        type: "return",
        taskID,
        returnValue
      };
    }
    if (isDefined(transferReturnValue)) {
      const transferables = transferReturnValue(returnValue);
      this.postMessage(message, transferables);
    } else {
      this.postMessage(message);
    }
  }
  addMethodInternal(methodName, asyncFunc, transferReturnValue) {
    if (this.methods.has(methodName)) {
      throw new Error(`${methodName} method has already been mapped.`);
    }
    this.methods.set(methodName, async (taskID, ...params) => {
      const prog = new WorkerServerProgress(this, taskID);
      try {
        const returnValue = await asyncFunc(...params, prog);
        this.onReturn(taskID, returnValue, transferReturnValue);
      } catch (exp) {
        console.error(exp);
        this.onError(taskID, exp.message || exp);
      }
    });
  }
  addFunction(methodName, asyncFunc, transferReturnValue) {
    this.addMethodInternal(methodName, asyncFunc, transferReturnValue);
  }
  addVoidFunction(methodName, asyncFunc) {
    this.addMethodInternal(methodName, asyncFunc);
  }
  addMethod(obj, methodName, method, transferReturnValue) {
    this.addFunction(methodName, method.bind(obj), transferReturnValue);
  }
  addVoidMethod(obj, methodName, method) {
    this.addVoidFunction(methodName, method.bind(obj));
  }
  addEvent(object, eventName, makePayload, transferReturnValue) {
    object.addEventListener(eventName, (evt) => {
      let message = null;
      if (isDefined(makePayload)) {
        message = {
          type: "event",
          eventName,
          data: makePayload(evt)
        };
      } else {
        message = {
          type: "event",
          eventName
        };
      }
      if (message.data !== void 0 && isDefined(transferReturnValue)) {
        const transferables = transferReturnValue(message.data);
        this.postMessage(message, transferables);
      } else {
        this.postMessage(message);
      }
    });
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/canvas.ts
var disableAdvancedSettings = false;
var hasOffscreenCanvas = !disableAdvancedSettings && "OffscreenCanvas" in globalThis;
var hasImageBitmap = !disableAdvancedSettings && "createImageBitmap" in globalThis;
function testOffscreen2D() {
  try {
    const canv = new OffscreenCanvas(1, 1);
    const g = canv.getContext("2d");
    return g != null;
  } catch (exp) {
    return false;
  }
}
var hasOffscreenCanvasRenderingContext2D = hasOffscreenCanvas && testOffscreen2D();
function testOffscreen3D() {
  try {
    const canv = new OffscreenCanvas(1, 1);
    const g = canv.getContext("webgl2");
    return g != null;
  } catch (exp) {
    return false;
  }
}
var hasOffscreenCanvasRenderingContext3D = hasOffscreenCanvas && testOffscreen3D();
function setCanvasSize(canv, w, h, superscale = 1) {
  w = Math.floor(w * superscale);
  h = Math.floor(h * superscale);
  if (canv.width != w || canv.height != h) {
    canv.width = w;
    canv.height = h;
    return true;
  }
  return false;
}
function is2DRenderingContext(ctx) {
  return isDefined(ctx.textBaseline);
}
function setCanvas2DContextSize(ctx, w, h, superscale = 1) {
  const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled, oldTextBaseline = ctx.textBaseline, oldTextAlign = ctx.textAlign, oldFont = ctx.font, resized = setCanvasSize(
    ctx.canvas,
    w,
    h,
    superscale
  );
  if (resized) {
    ctx.imageSmoothingEnabled = oldImageSmoothingEnabled;
    ctx.textBaseline = oldTextBaseline;
    ctx.textAlign = oldTextAlign;
    ctx.font = oldFont;
  }
  return resized;
}
function setContextSize(ctx, w, h, superscale = 1) {
  if (is2DRenderingContext(ctx)) {
    return setCanvas2DContextSize(ctx, w, h, superscale);
  } else {
    return setCanvasSize(
      ctx.canvas,
      w,
      h,
      superscale
    );
  }
}

// src/dirt-worker/DirtService.ts
var actionTypes = singleton("Juniper:Graphics2D:Dirt:StopTypes", () => /* @__PURE__ */ new Map([
  ["mousedown", "down"],
  ["mouseenter", "move"],
  ["mouseleave", "up"],
  ["mousemove", "move"],
  ["mouseout", "up"],
  ["mouseover", "move"],
  ["mouseup", "up"],
  ["pointerdown", "down"],
  ["pointerenter", "move"],
  ["pointerleave", "up"],
  ["pointermove", "move"],
  ["pointerrawupdate", "move"],
  ["pointerout", "up"],
  ["pointerup", "up"],
  ["pointerover", "move"],
  ["touchcancel", "up"],
  ["touchend", "up"],
  ["touchmove", "move"],
  ["touchstart", "down"]
]));
var DirtServiceUpdateEvent = class extends TypedEvent {
  constructor() {
    super("update");
  }
};
var DirtService = class extends TypedEventBase {
  constructor() {
    super();
    this.updateEvt = new DirtServiceUpdateEvent();
    this.canvas = null;
    this.transferCanvas = null;
    this.g = null;
    this.tg = null;
    this.pointerId = null;
    this.fr = null;
    this.pr = null;
    this.height = null;
    this.x = null;
    this.y = null;
    this.lx = null;
    this.ly = null;
    this.components = null;
    this.data = null;
    this.sub = new OffscreenCanvas(this.height, this.height);
    this.subg = this.sub.getContext("2d", {
      alpha: false,
      desynchronized: true,
      willReadFrequently: true
    });
  }
  init(width, height, fr, pr) {
    this.transferCanvas = new OffscreenCanvas(width, height);
    this.tg = this.transferCanvas.getContext("2d");
    this.canvas = new OffscreenCanvas(width, height);
    this.g = this.canvas.getContext("2d", {
      alpha: false,
      desynchronized: true
    });
    this.g.fillStyle = "rgb(50%, 50%, 50%)";
    this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const imgData = this.g.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const { data } = imgData;
    const components = data.length / (width * height);
    for (let i = 0; i < data.length; i += components) {
      const v = Math.floor(50 * (Math.random() - 0.5));
      for (let c = 0; c < components - 1; ++c) {
        data[i + c] += v;
      }
    }
    this.g.putImageData(imgData, 0, 0);
    this.fr = fr;
    this.pr = pr;
    this.height = 2 * (this.fr + this.pr) + 1;
    this.onUpdate();
    return Promise.resolve();
  }
  onUpdate() {
    this.tg.drawImage(this.canvas, 0, 0);
    this.updateEvt.imgBmp = this.transferCanvas.transferToImageBitmap();
    this.dispatchEvent(this.updateEvt);
  }
  I(x, y) {
    return xy2i(x, y + this.fr + this.pr, this.sub.width, this.components);
  }
  GET(x, y) {
    return this.data[this.I(x, y)] / 255;
  }
  SET(x, y, v) {
    return this.data[this.I(x, y)] = 255 * v;
  }
  update() {
    if (this.pointerId !== null && this.canvas) {
      const dx = this.lx - this.x;
      const dy = this.ly - this.y;
      if (Math.abs(dx) + Math.abs(dy) > 0) {
        const a = Math.atan2(dy, dx) + Math.PI;
        const d = Math.round(Math.sqrt(dx * dx + dy * dy));
        setContextSize(this.subg, d + this.fr + this.pr, this.height);
        this.subg.save();
        this.subg.translate(0, this.fr + this.pr);
        this.subg.rotate(-a);
        this.subg.translate(-this.lx, -this.ly);
        this.subg.drawImage(this.canvas, 0, 0);
        this.subg.restore();
        const imgData = this.subg.getImageData(0, 0, this.sub.width, this.sub.height);
        this.data = imgData.data;
        this.components = this.data.length / (this.sub.width * this.height);
        const start = this.GET(0, 0);
        const level = Math.max(0, start - 0.25);
        let accum = 0;
        for (let x = 0; x < d; ++x) {
          const here = this.GET(x, 0);
          accum += here - level;
          this.SET(x, 0, level);
          for (let y = -this.fr; y <= this.fr; ++y) {
            const dx2 = this.fr - Math.abs(y);
            const here2 = this.GET(x + dx2, y);
            accum += here2 - level;
            this.SET(x + dx2, y, level);
          }
          const deposit = level / (2 * this.fr * this.pr);
          for (let y = -this.fr - this.pr; y <= this.fr + this.pr && accum > 0; ++y) {
            if (y < -this.fr || this.fr < y) {
              const dx2 = this.fr - Math.abs(y);
              const there = this.GET(x + dx2, y);
              const v = Math.min(accum, deposit);
              this.SET(x + dx2, y, there + v);
              accum -= v;
            }
          }
        }
        if (accum > 0) {
          const deposit = accum / (2 * this.fr * this.pr);
          for (let y = -this.fr - this.pr; y <= this.fr + this.pr && accum > 0; ++y) {
            if (y < -this.fr || this.fr < y) {
              const dx2 = this.fr - Math.abs(y);
              const there = this.GET(d + dx2, y);
              const v = Math.min(accum, deposit);
              this.SET(d + dx2, y, there + v);
              accum -= v;
            }
          }
        }
        for (let i = 0; i < this.data.length; i += this.components) {
          const p = this.data[i];
          this.data[i + 1] = p;
          this.data[i + 2] = p;
        }
        this.subg.putImageData(imgData, 0, 0);
        this.g.save();
        this.g.translate(this.lx, this.ly);
        this.g.rotate(a);
        this.g.translate(-0, -this.fr - this.pr);
        this.g.drawImage(this.sub, 0, 0);
        this.g.restore();
        this.onUpdate();
      }
    }
    this.lx = this.x;
    this.ly = this.y;
  }
  checkPointer(id, x, y, type2) {
    const action = actionTypes.get(type2) || type2;
    if (this.pointerId === null) {
      if (action === "down") {
        this.pointerId = id;
        this.lx = this.x = x;
        this.ly = this.y = y;
        this.update();
      }
    } else if (id === this.pointerId) {
      this.x = x;
      this.y = y;
      this.update();
      if (action === "up") {
        this.pointerId = null;
      }
    }
  }
  checkPointerUV(id, x, y, type2) {
    this.checkPointer(id, x * this.canvas.width, (1 - y) * this.canvas.height, type2);
  }
};

// src/dirt-worker/DirtWorkerServer.ts
var DirtWorkerServer = class extends WorkerServer {
  constructor(self) {
    super(self);
    const dirtService = new DirtService();
    this.addMethod(dirtService, "init", dirtService.init.bind(dirtService));
    this.addVoidMethod(dirtService, "checkPointer", dirtService.checkPointer.bind(dirtService));
    this.addVoidMethod(dirtService, "checkPointerUV", dirtService.checkPointerUV.bind(dirtService));
    this.addEvent(dirtService, "update", (evt) => evt.imgBmp, (imgBmp) => [imgBmp]);
  }
};

// src/dirt-worker/index.ts
globalThis.server = new DirtWorkerServer(globalThis);
//# sourceMappingURL=index.js.map
