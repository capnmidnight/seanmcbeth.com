// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayBinarySearch.ts
function defaultKeySelector(obj) {
  return obj;
}
function arrayBinarySearchByKey(arr, itemKey, keySelector) {
  let left2 = 0;
  let right = arr.length;
  let idx = Math.floor((left2 + right) / 2);
  let found = false;
  while (left2 < right && idx < arr.length) {
    const compareTo = arr[idx];
    const compareToKey = isNullOrUndefined(compareTo) ? null : keySelector(compareTo);
    if (isDefined(compareToKey) && itemKey < compareToKey) {
      right = idx;
    } else {
      if (itemKey === compareToKey) {
        found = true;
      }
      left2 = idx + 1;
    }
    idx = Math.floor((left2 + right) / 2);
  }
  if (!found) {
    idx += 0.5;
  }
  return idx;
}
function arrayBinarySearch(arr, item, keySelector) {
  keySelector = keySelector || defaultKeySelector;
  const itemKey = keySelector(item);
  return arrayBinarySearchByKey(arr, itemKey, keySelector);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayRemoveAt.ts
function arrayRemoveAt(arr, idx) {
  return arr.splice(idx, 1)[0];
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayClear.ts
function arrayClear(arr) {
  return arr.splice(0);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayInsertAt.ts
function arrayInsertAt(arr, item, idx) {
  arr.splice(idx, 0, item);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayRandom.ts
function arrayRandom(arr, defaultValue) {
  const offset = defaultValue != null ? 1 : 0, idx = Math.floor(Math.random() * (arr.length + offset)) - offset;
  if (idx < 0) {
    return defaultValue;
  } else {
    return arr[idx];
  }
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arraySortedInsert.ts
function arraySortedInsert(arr, item, keySelector, allowDuplicates) {
  let ks;
  if (isFunction(keySelector)) {
    ks = keySelector;
  } else if (isBoolean(keySelector)) {
    allowDuplicates = keySelector;
  }
  if (isNullOrUndefined(allowDuplicates)) {
    allowDuplicates = true;
  }
  return arraySortedInsertInternal(arr, item, ks, allowDuplicates);
}
function arraySortedInsertInternal(arr, item, ks, allowDuplicates) {
  let idx = arrayBinarySearch(arr, item, ks);
  const found = idx % 1 === 0;
  idx = idx | 0;
  if (!found || allowDuplicates) {
    arrayInsertAt(arr, item, idx);
  }
  return idx;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/BaseGraphNode.ts
var BaseGraphNode = class {
  constructor(value) {
    this.value = value;
    this._forward = new Array();
    this._reverse = new Array();
  }
  connectSorted(child, keySelector) {
    if (isDefined(keySelector)) {
      arraySortedInsert(this._forward, child, (n2) => keySelector(n2.value));
      child._reverse.push(this);
    } else {
      this.connectTo(child);
    }
  }
  connectTo(child) {
    this.connectAt(child, this._forward.length);
  }
  connectAt(child, index) {
    arrayInsertAt(this._forward, child, index);
    child._reverse.push(this);
  }
  disconnectFrom(child) {
    arrayRemove(this._forward, child);
    arrayRemove(child._reverse, this);
  }
  isConnectedTo(node) {
    return this._forward.indexOf(node) >= 0 || this._reverse.indexOf(node) >= 0;
  }
  flatten() {
    const nodes = /* @__PURE__ */ new Set();
    const queue = [this];
    while (queue.length > 0) {
      const here = queue.shift();
      if (isDefined(here) && !nodes.has(here)) {
        nodes.add(here);
        queue.push(...here._forward);
      }
    }
    return Array.from(nodes);
  }
  get _isEntryPoint() {
    return this._reverse.length === 0;
  }
  get _isExitPoint() {
    return this._forward.length === 0;
  }
  get isDisconnected() {
    return this._isEntryPoint && this._isExitPoint;
  }
  get isConnected() {
    return !this._isExitPoint || !this._isEntryPoint;
  }
  get isTerminus() {
    return this._isEntryPoint || this._isExitPoint;
  }
  get isInternal() {
    return !this._isEntryPoint && !this._isExitPoint;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/GraphNode.ts
var GraphNode = class extends BaseGraphNode {
  connectTo(node) {
    super.connectTo(node);
  }
  connectAt(child, index) {
    super.connectAt(child, index);
  }
  connectSorted(child, sortKey) {
    super.connectSorted(child, sortKey);
  }
  disconnectFrom(node) {
    super.disconnectFrom(node);
  }
  isConnectedTo(node) {
    return super.isConnectedTo(node);
  }
  flatten() {
    return super.flatten();
  }
  get connections() {
    return this._forward;
  }
  get isEntryPoint() {
    return this._isEntryPoint;
  }
  get isExitPoint() {
    return this._isExitPoint;
  }
};

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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/Task.ts
var Task = class {
  constructor(resolveTestOrAutoStart, rejectTestOrAutoStart, autoStart = true) {
    this._resolve = null;
    this._reject = null;
    this._result = null;
    this._error = null;
    this._started = false;
    this._finished = false;
    this.resolve = null;
    this.reject = null;
    let resolveTest = alwaysTrue;
    let rejectTest = alwaysTrue;
    if (isFunction(resolveTestOrAutoStart)) {
      resolveTest = resolveTestOrAutoStart;
    }
    if (isFunction(rejectTestOrAutoStart)) {
      rejectTest = rejectTestOrAutoStart;
    }
    if (isBoolean(resolveTestOrAutoStart)) {
      autoStart = resolveTestOrAutoStart;
    } else if (isBoolean(rejectTestOrAutoStart)) {
      autoStart = rejectTestOrAutoStart;
    }
    this.resolve = (value) => {
      if (isDefined(this._resolve)) {
        this._resolve(value);
      }
    };
    this.reject = (reason) => {
      if (isDefined(this._reject)) {
        this._reject(reason);
      }
    };
    this.promise = new Promise((resolve, reject) => {
      this._resolve = (value) => {
        if (resolveTest(value)) {
          this._result = value;
          this._finished = true;
          resolve(value);
        }
      };
      this._reject = (reason) => {
        if (rejectTest(reason)) {
          this._error = reason;
          this._finished = true;
          reject(reason);
        }
      };
    });
    if (autoStart) {
      this.start();
    }
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
  start() {
    this._started = true;
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/once.ts
function targetValidateEvent(target, type2) {
  return "on" + type2 in target;
}
function once(target, resolveEvt, rejectEvtOrTimeout, ...rejectEvts) {
  if (isNullOrUndefined(rejectEvts)) {
    rejectEvts = [];
  }
  let timeout = void 0;
  if (isString(rejectEvtOrTimeout)) {
    rejectEvts.unshift(rejectEvtOrTimeout);
  } else if (isNumber(rejectEvtOrTimeout)) {
    timeout = rejectEvtOrTimeout;
  }
  if (!(target instanceof EventBase)) {
    if (!targetValidateEvent(target, resolveEvt)) {
      throw new Exception(`Target does not have a ${resolveEvt} rejection event`);
    }
    for (const evt of rejectEvts) {
      if (!targetValidateEvent(target, evt)) {
        throw new Exception(`Target does not have a ${evt} rejection event`);
      }
    }
  }
  const task = new Task();
  if (isNumber(timeout)) {
    const timeoutHandle = setTimeout(task.reject, timeout, `'${resolveEvt}' has timed out.`);
    task.finally(clearTimeout.bind(globalThis, timeoutHandle));
  }
  const register = (evt, callback) => {
    target.addEventListener(evt, callback);
    task.finally(() => target.removeEventListener(evt, callback));
  };
  const onResolve = (evt) => task.resolve(evt);
  const onReject = (evt) => task.reject(evt);
  register(resolveEvt, onResolve);
  for (const rejectEvt of rejectEvts) {
    register(rejectEvt, onReject);
  }
  return task;
}

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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/Exception.ts
var Exception = class extends Error {
  constructor(message, innerError = null) {
    super(message);
    this.innerError = innerError;
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
var isWorker = !("Document" in globalThis);

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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/identity.ts
function alwaysTrue() {
  return true;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/math/angleClamp.ts
var Tau = 2 * Math.PI;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/typeChecks.ts
function t(o, s, c) {
  return typeof o === s || o instanceof c;
}
function isFunction(obj) {
  return t(obj, "function", Function);
}
function isString(obj) {
  return t(obj, "string", String);
}
function isBoolean(obj) {
  return t(obj, "boolean", Boolean);
}
function isNumber(obj) {
  return t(obj, "number", Number);
}
function isObject(obj) {
  return isDefined(obj) && t(obj, "object", Object);
}
function assertNever(x, msg) {
  throw new Error((msg || "Unexpected object: ") + x);
}
function isNullOrUndefined(obj) {
  return obj === null || obj === void 0;
}
function isDefined(obj) {
  return !isNullOrUndefined(obj);
}

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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/strings/stringRandom.ts
var DEFAULT_CHAR_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
function stringRandom(length, charSet) {
  if (length < 0) {
    throw new Error("Length must be greater than 0");
  }
  if (isNullOrUndefined(charSet)) {
    charSet = DEFAULT_CHAR_SET;
  }
  let str = "";
  for (let i = 0; i < length; ++i) {
    const idx = Math.floor(Math.random() * charSet.length);
    str += charSet[idx];
  }
  return str;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/URLBuilder.ts
function parsePort(portString) {
  if (isDefined(portString) && portString.length > 0) {
    return parseFloat(portString);
  }
  return null;
}
var URLBuilder = class {
  constructor(url, base2) {
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
      this._url = new URL(url, base2);
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
  base(base2) {
    if (this._url !== null) {
      throw new Error("Cannot redefine base after defining the protocol and domain");
    }
    this._base = base2;
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/attrs.ts
var Attr = class {
  constructor(key, value, bySetAttribute, ...tags) {
    this.key = key;
    this.value = value;
    this.bySetAttribute = bySetAttribute;
    this.tags = tags.map((t2) => t2.toLocaleUpperCase());
    Object.freeze(this);
  }
  applyToElement(elem) {
    const isDataSet = this.key.startsWith("data-");
    const isValid = this.tags.length === 0 || this.tags.indexOf(elem.tagName) > -1 || isDataSet;
    if (!isValid) {
      console.warn(`Element ${elem.tagName} does not support Attribute ${this.key}`);
    } else if (isDataSet) {
      const subkey = this.key.substring(5);
      elem.dataset[subkey] = this.value;
    } else if (this.key === "style") {
      Object.assign(elem.style, this.value);
    } else if (this.key === "classList") {
      this.value.forEach((v) => elem.classList.add(v));
    } else if (this.bySetAttribute) {
      elem.setAttribute(this.key, this.value);
    } else if (this.key in elem) {
      elem[this.key] = this.value;
    } else if (this.value === false) {
      elem.removeAttribute(this.key);
    } else if (this.value === true) {
      elem.setAttribute(this.key, "");
    } else {
      elem.setAttribute(this.key, this.value);
    }
  }
};
function className(value) {
  return new Attr("className", value, false);
}
function id(value) {
  return new Attr("id", value, false);
}
function type(value) {
  if (!isString(value)) {
    value = value.value;
  }
  return new Attr("type", value, false, "button", "input", "command", "embed", "link", "object", "script", "source", "style", "menu");
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/css.ts
var CssProp = class {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.name = key.replace(/[A-Z]/g, (m) => `-${m.toLocaleLowerCase()}`);
  }
  name;
  applyToElement(elem) {
    elem.style[this.key] = this.value;
  }
};
var CssPropSet = class {
  rest;
  constructor(...rest) {
    this.rest = rest;
  }
  applyToElement(elem) {
    for (const prop of this.rest) {
      prop.applyToElement(elem);
    }
  }
};
function styles(...rest) {
  return new CssPropSet(...rest);
}
function backgroundColor(v) {
  return new CssProp("backgroundColor", v);
}
function backgroundImage(...v) {
  return new CssProp("backgroundImage", v.join(", "));
}
function border(v) {
  return new CssProp("border", v);
}
function borderBottomLeftRadius(v) {
  return new CssProp("borderBottomLeftRadius", v);
}
function borderBottomRightRadius(v) {
  return new CssProp("borderBottomRightRadius", v);
}
function borderRadius(v) {
  return new CssProp("borderRadius", v);
}
function borderTopLeftRadius(v) {
  return new CssProp("borderTopLeftRadius", v);
}
function borderTopRightRadius(v) {
  return new CssProp("borderTopRightRadius", v);
}
function boxShadow(v) {
  return new CssProp("boxShadow", v);
}
function color(v) {
  return new CssProp("color", v);
}
function display(v) {
  return new CssProp("display", v);
}
function fontFamily(v) {
  return new CssProp("fontFamily", v);
}
function fontSize(v) {
  return new CssProp("fontSize", v);
}
function fontWeight(v) {
  return new CssProp("fontWeight", v);
}
function height(v) {
  return new CssProp("height", v);
}
function left(v) {
  return new CssProp("left", v);
}
function margin(v) {
  return new CssProp("margin", v);
}
function marginLeft(v) {
  return new CssProp("marginLeft", v);
}
function marginRight(v) {
  return new CssProp("marginRight", v);
}
function marginTop(v) {
  return new CssProp("marginTop", v);
}
function overflow(v) {
  return new CssProp("overflow", v);
}
function padding(...v) {
  return new CssProp("padding", v.join(" "));
}
function pointerEvents(v) {
  return new CssProp("pointerEvents", v);
}
function position(v) {
  return new CssProp("position", v);
}
function textTransform(v) {
  return new CssProp("textTransform", v);
}
function top(v) {
  return new CssProp("top", v);
}
function transform(v) {
  return new CssProp("transform", v);
}
function width(v) {
  return new CssProp("width", v);
}
function zIndex(v) {
  return new CssProp("zIndex", isNumber(v) ? v.toFixed(0) : v);
}
var CSSInJSRule = class {
  constructor(selector, props) {
    this.selector = selector;
    this.props = props;
  }
  apply(sheet) {
    const style = this.props.map((prop) => `${prop.name}: ${prop.value};`).join("");
    sheet.insertRule(`${this.selector} {${style}}`, sheet.cssRules.length);
  }
};
function rule(selector, ...props) {
  return new CSSInJSRule(selector, props);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/tags.ts
function isErsatzElement(obj) {
  if (!isObject(obj)) {
    return false;
  }
  const elem = obj;
  return elem.element instanceof Node;
}
function isErsatzElements(obj) {
  return isObject(obj) && "elements" in obj && obj.elements instanceof Array;
}
function resolveElement(elem) {
  if (isErsatzElement(elem)) {
    return elem.element;
  }
  return elem;
}
function isIElementAppliable(obj) {
  return isObject(obj) && "applyToElement" in obj && isFunction(obj.applyToElement);
}
function elementApply(elem, ...children) {
  elem = resolveElement(elem);
  for (const child of children) {
    if (isDefined(child)) {
      if (child instanceof Node) {
        elem.append(child);
      } else if (isErsatzElement(child)) {
        elem.append(resolveElement(child));
      } else if (isErsatzElements(child)) {
        elem.append(...child.elements.map(resolveElement));
      } else if (isIElementAppliable(child)) {
        child.applyToElement(elem);
      } else {
        elem.append(document.createTextNode(child.toLocaleString()));
      }
    }
  }
  return elem;
}
function getElement(selector) {
  return document.querySelector(selector);
}
function tag(name, ...rest) {
  let elem = null;
  for (const attr of rest) {
    if (attr instanceof Attr && attr.key === "id") {
      elem = document.getElementById(attr.value);
      break;
    }
  }
  if (elem == null) {
    elem = document.createElement(name);
  }
  elementApply(elem, ...rest);
  return elem;
}
function ButtonRaw(...rest) {
  return tag("button", ...rest);
}
function Button(...rest) {
  return ButtonRaw(...rest, type("button"));
}
function Div(...rest) {
  return tag("div", ...rest);
}
function P(...rest) {
  return tag("p", ...rest);
}
function Span(...rest) {
  return tag("span", ...rest);
}
function Style(...rest) {
  let elem = document.createElement("style");
  document.head.append(elem);
  for (let x of rest) {
    x.apply(elem.sheet);
  }
  return elem;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/evts.ts
var HtmlEvt = class {
  constructor(name, callback, opts) {
    this.name = name;
    this.callback = callback;
    if (!isFunction(callback)) {
      throw new Error("A function instance is required for this parameter");
    }
    this.opts = opts;
    Object.freeze(this);
  }
  opts;
  applyToElement(elem) {
    this.add(elem);
  }
  add(elem) {
    elem.addEventListener(this.name, this.callback, this.opts);
  }
  remove(elem) {
    elem.removeEventListener(this.name, this.callback);
  }
};
function onClick(callback, opts) {
  return new HtmlEvt("click", callback, opts);
}
function onMouseOut(callback, opts) {
  return new HtmlEvt("mouseout", callback, opts);
}
function onTouchStart(callback, opts) {
  return new HtmlEvt("touchstart", callback, opts);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/onUserGesture.ts
var gestures = [
  "change",
  "click",
  "contextmenu",
  "dblclick",
  "mouseup",
  "pointerup",
  "reset",
  "submit",
  "touchend"
];
function onUserGesture(callback, test) {
  const realTest = test || (async () => true);
  const check = async (evt) => {
    if (evt.isTrusted && await realTest()) {
      for (const gesture of gestures) {
        window.removeEventListener(gesture, check);
      }
      await callback();
    }
  };
  for (const gesture of gestures) {
    window.addEventListener(gesture, check);
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/nodes.ts
var hasAudioContext = "AudioContext" in globalThis;
var hasAudioListener = hasAudioContext && "AudioListener" in globalThis;
var hasOldAudioListener = hasAudioListener && "setPosition" in AudioListener.prototype;
var hasNewAudioListener = hasAudioListener && "positionX" in AudioListener.prototype;
var canCaptureStream = isFunction(HTMLMediaElement.prototype.captureStream) || isFunction(HTMLMediaElement.prototype.mozCaptureStream);
var connections = singleton("Juniper:Audio:connections", () => /* @__PURE__ */ new Map());
var names = singleton("Juniper:Audio:names", () => /* @__PURE__ */ new Map());
function nameVertex(name, v) {
  names.set(v, name);
}
function getAudioGraph() {
  const nodes = /* @__PURE__ */ new Map();
  function maybeAdd(node) {
    if (!nodes.has(node)) {
      nodes.set(node, new GraphNode(node));
    }
  }
  for (const node of names.keys()) {
    maybeAdd(node);
  }
  for (const [parent, children] of connections) {
    maybeAdd(parent);
    for (const child of children) {
      maybeAdd(child);
    }
  }
  for (const [parent, children] of connections) {
    const branch = nodes.get(parent);
    for (const child of children) {
      if (nodes.has(child)) {
        branch.connectTo(nodes.get(child));
      }
    }
  }
  return Array.from(nodes.values());
}
globalThis.getAudioGraph = getAudioGraph;
async function audioReady(audioCtx) {
  nameVertex("speakers", audioCtx.destination);
  if (audioCtx.state !== "running") {
    if (audioCtx.state === "closed") {
      await audioCtx.resume();
    } else if (audioCtx.state === "suspended") {
      const stateChange = once(audioCtx, "statechange");
      onUserGesture(() => audioCtx.resume());
      await stateChange;
    } else {
      assertNever(audioCtx.state);
    }
  }
}

// src/yabs-app/index.ts
document.title = "No More Jabber Yabs: The Game";
Style(rule("html, body, .cloud, .cloud-bit, .frowny, .shadow, .boop, .beam, .subBeam, .endMessage, #scoreBox", position("absolute")), rule("html, body", height("100%"), width("100%"), padding(0), margin(0), border(0), overflow("hidden")), rule("body", fontFamily("sans-serif"), backgroundColor("hsl(200, 50%, 75%)"), backgroundImage("linear-gradient(hsl(200, 50%, 50%), hsl(200, 20%, 75%) 75%, hsl(100, 75%, 50%) 75%, hsl(100, 100%, 20%))")), rule("#scoreBox, .endMessage, .frowny, #instructions, #starter", fontSize("24pt")), rule("#scoreBox", display("none"), color("white"), top("5em"), left(0), padding("1em")), rule(".endMessage", display("none"), padding("1em"), top(0), zIndex(9001), pointerEvents("none"), color("white")), rule(".cloud-bit", backgroundColor("white"), width("100px"), height("50px"), borderBottomRightRadius("25px"), borderBottomLeftRadius("50px"), borderTopRightRadius("12.5px"), borderTopLeftRadius("6.25px")), rule(".frowny", fontFamily("fixedsys, monospace"), padding("5px"), border("solid 2px black"), borderRadius("10px"), transform("rotate(90deg)"), width("50px"), height("50px"), overflow("hidden")), rule(".shadow", width("45px"), height("10px"), borderRadius("5px"), backgroundImage("radial-gradient(black, transparent)"), backgroundColor("grey")), rule(".boop", display("none"), color("white"), textTransform("uppercase"), fontFamily("sans-serif"), fontWeight("bold"), fontSize("10pt"), zIndex(9001)), rule(".beam, .subBeam", display("none"), backgroundColor("red"), boxShadow("0 0 25px red"), left("0")), rule(".beam", top("0"), width("50px"), height("50px"), borderRadius("50%")), rule(".subBeam", top("50%"), height("2000px")), rule("#instructions, #starter", position("relative"), display("none"), fontWeight("bold"), marginLeft("auto"), marginRight("auto"), marginTop("3em"), width("20em"), zIndex(9001)));
function PointDisplay() {
  return Span(className("pointDisplay"), 0);
}
elementApply(document.body, Button(id("starter"), "Start", onClick(() => audio.resume())), Div(id("instructions"), "Go ahead, click and hold the mouse"), Div(id("scoreBox"), "GET EM: ", PointDisplay()), Div(id("message0"), className("endMessage"), P("You have killed everyone. You did it. Just you. Noone else."), P("And why have you done this? Because you were ordered to? The pursuit of points?"), P("You got your points. All ", PointDisplay(), " of them. What will you do with them? There's noone left. And it's not like they took them as currency, anyway."), P("For no reason whatsoever, you have committed genocide against another race of people. Congratulations."), P("Hitler.")), Div(id("message1"), className("endMessage"), P("You have killed almost everyone. Their bodies are strewn about on the ground they once called their home."), P("There is but one person left. Did you spare them out of mercy? Or have you left them, devoid of personal contact, alone, surrounded by the burned and rotting bodies of their former loved ones, to serve as witness to your terrible deeds?"), P("And why have you done this? Because you were ordered to? The pursuit of points?"), P("You got your points. All ", PointDisplay(), "  of them. What will you do with them? There's noone left. And it's not like they took them as currency, anyway."), P("You are sick.")), Div(id("message2"), className("endMessage"), P("You have killed almost everyone. Their bodies are strewn about on the ground they once called their home."), P("There are only two people left. Did you spare them out of mercy? Or have you left them, surrounded by the burned and rotting bodies of their former loved ones, to repopulate their world together, to serve as witness to your terrible deeds to future generations?"), P("And why have you done this? Because you were ordered to? The pursuit of points?"), P("You got your points. All ", PointDisplay(), "  of them. What will you do with them? There's noone left. And it's not like they took them as currency, anyway."), P("I...I don't understand you.")), Div(id("messageN"), className("endMessage"), styles(color("black")), P('"Hi there!"'), P("You blink. Did someone speak?"), P('"Down here!"'), P("It's the people below."), P('"We noticed you up there. What are you doing?"'), P("You reply, haltingly, that you do not know."), P('"Oh, well, okay. Cool beans. Later!"')));
var NUM_YABS = Math.round(window.innerWidth / 30);
var NUM_CLD = Math.round(window.innerWidth / 200);
var HIT_POINTS = 2;
var MSG_TIMEOUT = 5e3;
var skins = [
  "#FFDFC4",
  "#F0D5BE",
  "#EECEB3",
  "#E1B899",
  "#E5C298",
  "#FFDCB2",
  "#E5B887",
  "#E5A073",
  "#E79E6D",
  "#DB9065",
  "#CE967C",
  "#C67856",
  "#BA6C49",
  "#A57257",
  "#F0C8C9",
  "#DDA8A0",
  "#B97C6D",
  "#A8756C",
  "#AD6452",
  "#5C3836",
  "#CB8442",
  "#BD723C",
  "#704139",
  "#A3866A",
  "#870400",
  "#710101",
  "#430000",
  "#5B0001",
  "#302E2E"
];
var curses = [
  "ow!",
  "yikes!",
  "holy cow!",
  "ouch!",
  "that smarts!",
  "ow!",
  "yikes!",
  "holy cow!",
  "ouch!",
  "that smarts!",
  "ow!",
  "yikes!",
  "holy cow!",
  "ouch!",
  "that smarts!",
  "mother puss-bucket!"
];
var happyFaces = [":)", ":o", ":^", ":.", ":P", ":D"];
var sadFaces = [":(", ":(", ":(", ":(", ":(", ":(", ":O"];
var inst = getElement("#instructions");
var starter = getElement("#starter");
var scoreBox = getElement("#scoreBox");
var scoreBoxes = document.querySelectorAll(".pointDisplay");
var messages = document.querySelectorAll(".endMessage");
var audio = new AudioContext();
var out = audio.createGain();
var fs = new Array();
var osc = new Array();
var timers = /* @__PURE__ */ new Map();
var base = Math.pow(2, 1 / 12);
var fading = false;
var scale = 1;
var lt = null;
var dt = 0;
var step = 1;
var lnt = -1;
var score = 0;
var kills = 0;
var repopulateTimer;
var dystopianTimer;
function piano(n2) {
  return 440 * Math.pow(base, n2 - 49);
}
function play(i, volume, duration) {
  const o = osc[i];
  if (o) {
    if (timers.has(o)) {
      clearTimeout(timers.get(o));
      timers.delete(o);
    }
    o.gain.value = volume;
    timers.set(o, setTimeout(() => {
      o.gain.value = 0;
      timers.delete(o);
    }, duration * 1e3));
  }
}
function randomRange(min, max) {
  return min + Math.random() * (max - min);
}
function randomInt(min, max) {
  return Math.floor(randomRange(min, max));
}
function music(t2) {
  let nt = 0;
  if (score > 0) {
    nt = Math.floor(t2 / 2e3 % 4) + Math.floor(t2 / 1e3 % 2) / 2;
  } else {
    nt = Math.floor(t2 / 500 % 4) + Math.floor(t2 / 250 % 3) / 3;
  }
  if (lnt !== nt) {
    let len = 0.2;
    stringRandom;
    if (nt >= randomInt(0, 4)) {
      nt = Math.floor(nt);
      len /= 2;
    }
    if (score > 0) {
      const n2 = 25 - Math.floor(nt * 4) + randomInt(-1, 2) * 3;
      play(n2, 0.04, len);
      play(n2 + 3, 0.04, len);
      play(n2 + 7, 0.04, len);
    } else {
      const n2 = 40 + Math.floor(nt * 3) + randomInt(-1, 2) * 4;
      play(n2, 0.04, 0.05);
      play(n2 + randomInt(3, 5), 0.04, 0.05);
    }
  }
  lnt = nt;
}
function shake(elem) {
  elem = elem || document.body;
  elem.style.transform = "translate(" + randomRange(-4, 4) + "px," + randomRange(-4, 4) + "px)";
}
function isFace(obj) {
  return obj instanceof Face;
}
var Face = class {
  element;
  boop;
  shadow;
  alive;
  hits;
  onground;
  x;
  y;
  z;
  f;
  dx;
  dy;
  df;
  width;
  height;
  boopFor;
  boopX;
  boopY;
  boopDX;
  boopDY;
  constructor() {
    this.alive = true;
    this.hits = 0;
    this.onground = false;
    this.x = randomRange(0, window.innerWidth);
    this.y = randomRange(0, window.innerHeight / 2);
    this.z = randomInt(0, 10);
    this.f = 0;
    this.dx = randomRange(-1, 1);
    this.dy = 0;
    this.df = randomRange(0.05, 0.1);
    this.element = Div(className("frowny"), onMouseOut(this.jump.bind(this, "boop")), onTouchStart(this.jump.bind(this, "boop")), styles(backgroundColor(arrayRandom(skins)), zIndex(this.z)));
    this.width = 5;
    this.height = 5;
    this.boop = Div(className("boop"), "boop");
    this.boopFor = 0;
    this.boopX = 0;
    this.boopY = 0;
    this.boopDX = 0;
    this.boopDY = 0;
    this.shadow = Div(className("shadow"));
    document.body.append(this.boop, this.shadow);
    this.render();
  }
  jump(word) {
    if (this.onground) {
      this.boop.innerHTML = word;
      this.dy = -5;
      this.onground = false;
      this.boopX = this.x;
      this.boopY = this.y - 125;
      this.boopDX = randomRange(-0.5, 0.5);
      this.boopDY = randomRange(-0.5, 0);
      this.boopFor = 100;
      play(30 + 3 * randomInt(0, 5), 0.125, 0.05);
      fading = true;
    }
  }
  render() {
    this.boop.style.display = this.boopFor > 0 ? "block" : "none";
    this.boop.style.left = this.boopX + "px";
    this.boop.style.top = this.boopY + "px";
    this.boop.style.transform = "scale(" + (0.5 + this.boopFor / 200) + ")";
    this.shadow.style.left = this.element.style.left = this.x + "px";
    this.element.style.top = this.y + 10 * this.z - 120 + "px";
    this.shadow.style.top = 10 * this.z + window.innerHeight - 120 + "px";
    const sy = Math.sqrt(Math.abs(this.dy)) * 10;
    this.element.style.paddingLeft = this.element.style.paddingRight = this.height + sy + "px";
    this.element.style.paddingTop = this.element.style.paddingBottom = this.width - sy + "px";
    if (this.alive && this.f > 1) {
      this.element.innerHTML = arrayRandom(score > 0 ? sadFaces : happyFaces);
      this.f = 0;
    } else if (!this.alive) {
      this.element.innerHTML = "X(";
    }
  }
  update(dt2) {
    this.boopFor -= dt2;
    this.boopX += this.boopDX * dt2;
    this.boopY += this.boopDY * dt2;
    this.x += this.dx * dt2;
    this.y += this.dy * dt2;
    this.f += this.df * dt2;
    if (!this.onground) {
      this.dy = this.dy + 0.1 * dt2;
    }
    if (this.x <= 0 && this.dx < 0 || this.x + this.element.clientWidth >= window.innerWidth && this.dx > 0) {
      this.dx *= -1;
    }
    if (!this.onground && this.y + this.element.clientHeight >= window.innerHeight && this.dy > 0) {
      if (this.dy > 2) {
        this.dy *= -0.5;
      } else {
        this.onground = true;
        this.dy = 0;
        if (!this.alive) {
          this.dx = 0;
        }
      }
      play((score > 0 ? 10 : 20) + 3 * randomInt(0, 5), 0.125, 0.05);
      shake();
    }
  }
};
var Cloud = class {
  element;
  x;
  y;
  dx;
  constructor() {
    this.element = document.createElement("div");
    this.element.className = "cloud";
    const n2 = randomInt(4, 7);
    for (let i = 0; i < n2; ++i) {
      const b = document.createElement("div");
      b.className = "cloud-bit";
      b.style.top = randomRange(-25, 25) + "px";
      b.style.left = randomRange(-50, 50) + "px";
      this.element.appendChild(b);
    }
    this.x = randomRange(0, window.innerWidth);
    this.y = randomRange(0, window.innerHeight / 4) + 50;
    this.dx = randomRange(-0.25, 0.25);
    this.element.style.zIndex = (-this.y).toFixed(0);
    this.render();
  }
  render() {
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }
  update(dt2) {
    this.x += this.dx * dt2;
    if (this.x <= 0 && this.dx < 0 || this.x + this.element.clientWidth >= window.innerWidth && this.dx > 0) {
      this.dx *= -1;
    }
  }
};
var Beam = class {
  element;
  subBeam;
  x;
  y;
  t;
  charging;
  firing;
  enabled;
  constructor() {
    this.x = 0;
    this.y = 0;
    this.t = 0;
    this.charging = false;
    this.firing = false;
    this.enabled = true;
    this.element = document.createElement("div");
    this.element.className = "beam";
    this.subBeam = document.createElement("div");
    this.subBeam.className = "subBeam";
    this.element.appendChild(this.subBeam);
  }
  disable() {
    this.enabled = false;
  }
  update(dt2) {
    if (this.charging && this.t < 100) {
      this.t += dt2;
      if (this.t >= 100) {
        this.firing = true;
        if (goodEndingTimer) {
          clearTimeout(goodEndingTimer);
        }
      }
    } else if (!this.charging && this.t > 0) {
      this.t -= dt2 / 4;
      if (this.t <= 0) {
        this.firing = false;
      }
    }
    if (this.firing) {
      shake(this.element);
      for (let i = 0, l = this.t / 10; i < l; ++i) {
        play(87 - i, 0.02, dt2 / 100);
      }
      for (let i = 0; i < NUM_YABS; ++i) {
        const yab = fs[i];
        if (isFace(yab) && yab.alive && yab.onground) {
          if (this.x <= yab.x + 50 && this.x + 50 >= yab.x) {
            if (score === 0) {
              scoreBox.style.display = "block";
              document.body.style.backgroundImage = "linear-gradient(hsl(0, 50%, 0%), hsl(0, 50%, 50%) 75%, hsl(0, 50%, 15%) 75%, hsl(0, 50%, 33%))";
              for (let j = 0; j < NUM_CLD; ++j) {
                const cld = fs[NUM_YABS + j].element;
                for (let k = 0; k < cld.children.length; ++k) {
                  const bit = cld.children[k].style;
                  bit.backgroundColor = "black";
                }
              }
            }
            ++score;
            for (let j = 0; j < scoreBoxes.length; ++j) {
              scoreBoxes[j].innerHTML = score.toFixed(0);
            }
            shake(yab.element);
            ++yab.hits;
            if (yab.hits >= HIT_POINTS) {
              yab.alive = false;
              ++kills;
              score += 10;
              if (kills === NUM_YABS - 2) {
                repopulateTimer = setTimeout(() => {
                  messages[2].style.display = "block";
                  scoreBox.style.display = "none";
                  this.disable();
                }, MSG_TIMEOUT);
              } else if (kills === NUM_YABS - 1) {
                clearTimeout(repopulateTimer);
                dystopianTimer = setTimeout(() => {
                  messages[1].style.display = "block";
                  scoreBox.style.display = "none";
                  this.disable();
                }, MSG_TIMEOUT);
              } else if (kills === NUM_YABS) {
                clearTimeout(dystopianTimer);
                messages[0].style.display = "block";
                scoreBox.style.display = "none";
                this.disable();
              }
            } else {
              yab.element.style.transform += " rotate(90deg)";
            }
            yab.jump(arrayRandom(curses));
            play(10 + randomInt(-1, 2), 0.1, 0.05);
          } else if (this.x <= yab.x + 200 && this.x + 200 >= yab.x) {
            shake(yab.element);
            yab.element.style.transform += " rotate(90deg)";
          }
        }
      }
    } else if (this.charging) {
      const n2 = Math.floor(this.t / 10) + 70;
      for (let i = 70; i < n2; ++i) {
        play(i, 0.02, dt2 / 100);
      }
    }
  }
  render() {
    this.element.style.display = this.charging || this.firing ? "block" : "none";
    this.subBeam.style.display = this.firing ? "block" : "none";
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
    const c = "hsl(0, 100%, " + this.t + "%)";
    this.element.style.backgroundColor = this.subBeam.style.backgroundColor = c;
    this.element.style.boxShadow = this.subBeam.style.boxShadow = "0 0 25px " + c;
    this.subBeam.style.width = this.t + "%";
    this.subBeam.style.left = (100 - this.t) / 2 + "%";
    this.subBeam.style.opacity = (this.t / 100).toFixed(3);
  }
  start(evt) {
    audio.resume();
    fading = true;
    this.x = evt.clientX - 10;
    this.y = evt.clientY - 10;
    if (this.enabled) {
      this.charging = true;
    }
  }
  end() {
    this.element.style.display = "none";
    this.charging = false;
    if (!this.firing) {
      this.t = 0;
    }
  }
  move(evt) {
    this.x = evt.clientX - 10;
    this.y = evt.clientY - 10;
  }
};
function add(obj) {
  fs.push(obj);
  elementApply(document.body, obj);
  return obj;
}
for (let i = 0; i < 88; ++i) {
  const gn = audio.createGain();
  gn.gain.value = 0;
  const o = audio.createOscillator();
  o.frequency.value = piano(i + 1);
  o.type = "sawtooth";
  o.start();
  o.connect(gn);
  gn.connect(out);
  osc.push(gn);
}
for (let i = 0; i < NUM_YABS; ++i) {
  add(new Face());
}
for (let i = 0; i < NUM_CLD; ++i) {
  add(new Cloud());
}
var beam = add(new Beam());
document.addEventListener("mousedown", beam.start.bind(beam), false);
document.addEventListener("mousemove", (evt) => {
  beam.move(evt);
  evt.preventDefault();
}, false);
document.addEventListener("mouseup", beam.end.bind(beam), false);
document.addEventListener("touchstart", function(evt) {
  if (evt.touches.length === 1) {
    beam.start(evt.touches[0]);
    evt.preventDefault();
  }
}, false);
document.addEventListener("touchmove", function(evt) {
  beam.move(evt.touches[0]);
  evt.preventDefault();
}, false);
document.addEventListener("touchend", function(evt) {
  if (evt.touches.length === 0) {
    beam.end();
    evt.preventDefault();
  }
}, false);
function animate(t2) {
  requestAnimationFrame(animate);
  music(t2);
  if (lt != null) {
    dt += (t2 - lt) / 10;
    while (dt >= step) {
      for (let i = 0; i < fs.length; ++i) {
        fs[i].update(step);
      }
      dt -= step;
    }
    for (let i = 0; i < fs.length; ++i) {
      fs[i].render();
    }
  }
  lt = t2;
  if (fading && scale > 0) {
    inst.style.opacity = (parseFloat(inst.style.opacity) - 0.05).toFixed(3);
    scale -= 0.05;
    inst.style.transform = "scale(" + Math.pow(scale, 0.25) + ")";
  }
}
out.connect(audio.destination);
inst.style.opacity = "1";
starter.style.display = "block";
await audioReady(audio);
starter.style.display = "none";
inst.style.display = "block";
requestAnimationFrame(animate);
setTimeout(function() {
  fading = true;
}, 5e3);
var goodEndingTimer = setTimeout(function() {
  messages[messages.length - 1].style.display = "block";
  beam.disable();
}, 15e3);
//# sourceMappingURL=index.js.map
