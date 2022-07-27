// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayRemoveAt.ts
function arrayRemoveAt(arr, idx) {
  return arr.splice(idx, 1)[0];
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayClear.ts
function arrayClear(arr) {
  return arr.splice(0);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayCompare.ts
function arrayCompare(arr1, arr2) {
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }
  return -1;
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayScan.ts
function _arrayScan(forward, arr, tests) {
  const start = forward ? 0 : arr.length - 1;
  const end = forward ? arr.length : -1;
  const inc = forward ? 1 : -1;
  for (const test of tests) {
    for (let i = start; i != end; i += inc) {
      const item = arr[i];
      if (test(item)) {
        return item;
      }
    }
  }
  return null;
}
function arrayScan(arr, ...tests) {
  return _arrayScan(true, arr, tests);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/mapMap.ts
function mapMap(items, makeID, makeValue) {
  return new Map(items.map((item) => [makeID(item), makeValue(item)]));
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/mapJoin.ts
function mapJoin(dest, ...sources) {
  for (const source of sources) {
    if (isDefined(source)) {
      for (const [key, value] of source) {
        dest.set(key, value);
      }
    }
  }
  return dest;
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/PriorityMap.ts
var PriorityMap = class {
  constructor(init) {
    this.items = /* @__PURE__ */ new Map();
    if (isDefined(init)) {
      for (const [key1, key2, value] of init) {
        this.add(key1, key2, value);
      }
    }
  }
  add(key1, key2, value) {
    let level1 = this.items.get(key1);
    if (isNullOrUndefined(level1)) {
      this.items.set(key1, level1 = /* @__PURE__ */ new Map());
    }
    level1.set(key2, value);
    return this;
  }
  *entries() {
    for (const [key1, level1] of this.items) {
      for (const [key2, value] of level1) {
        yield [key1, key2, value];
      }
    }
  }
  keys(key1) {
    if (isNullOrUndefined(key1)) {
      return this.items.keys();
    } else {
      return this.items.get(key1).keys();
    }
  }
  *values() {
    for (const level1 of this.items.values()) {
      for (const value of level1.values()) {
        yield value;
      }
    }
  }
  has(key1, key2) {
    return this.items.has(key1) && (isNullOrUndefined(key2) || this.items.get(key1).has(key2));
  }
  get(key1, key2) {
    if (isNullOrUndefined(key2)) {
      return this.items.get(key1);
    } else if (this.items.has(key1)) {
      return this.items.get(key1).get(key2);
    } else {
      return null;
    }
  }
  count(key1) {
    if (this.items.has(key1)) {
      return this.items.get(key1).size;
    }
    return null;
  }
  get size() {
    let size = 0;
    for (const list of this.items.values()) {
      size += list.size;
    }
    return size;
  }
  delete(key1, key2) {
    if (isNullOrUndefined(key2)) {
      return this.items.delete(key1);
    } else if (this.items.has(key1)) {
      return this.items.get(key1).delete(key2);
    } else {
      return false;
    }
  }
  clear() {
    this.items.clear();
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
function identity(item) {
  return item;
}
function alwaysTrue() {
  return true;
}
function alwaysFalse() {
  return false;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/typeChecks.ts
function t(o, s, c) {
  return typeof o === s || o instanceof c;
}
function isFunction(obj2) {
  return t(obj2, "function", Function);
}
function isString(obj2) {
  return t(obj2, "string", String);
}
function isBoolean(obj2) {
  return t(obj2, "boolean", Boolean);
}
function isNumber(obj2) {
  return t(obj2, "number", Number);
}
function isObject(obj2) {
  return isDefined(obj2) && t(obj2, "object", Object);
}
function isArray(obj2) {
  return obj2 instanceof Array;
}
function assertNever(x, msg) {
  throw new Error((msg || "Unexpected object: ") + x);
}
function isNullOrUndefined(obj2) {
  return obj2 === null || obj2 === void 0;
}
function isDefined(obj2) {
  return !isNullOrUndefined(obj2);
}
function isArrayBufferView(obj2) {
  return obj2 instanceof Uint8Array || obj2 instanceof Uint8ClampedArray || obj2 instanceof Int8Array || obj2 instanceof Uint16Array || obj2 instanceof Int16Array || obj2 instanceof Uint32Array || obj2 instanceof Int32Array || obj2 instanceof Float32Array || obj2 instanceof Float64Array || "BigUint64Array" in globalThis && obj2 instanceof globalThis["BigUint64Array"] || "BigInt64Array" in globalThis && obj2 instanceof globalThis["BigInt64Array"];
}
function isArrayBuffer(val) {
  return val && typeof ArrayBuffer !== "undefined" && (val instanceof ArrayBuffer || val.constructor && val.constructor.name === "ArrayBuffer");
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
function success(task) {
  return task.then(alwaysTrue).catch(alwaysFalse);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/waitFor.ts
function waitFor(test) {
  const task = new Task(test);
  const handle = setInterval(() => {
    if (test()) {
      clearInterval(handle);
      task.resolve();
    }
  }, 100);
  return task;
}

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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/ChildProgressCallback.ts
var ChildProgressCallback = class extends BaseProgress {
  constructor(i, prog) {
    super();
    this.i = i;
    this.prog = prog;
  }
  report(soFar, total, msg, est) {
    super.report(soFar, total, msg, est);
    this.prog.update(this.i, soFar, total, msg);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/BaseParentProgressCallback.ts
var BaseParentProgressCallback = class {
  constructor(prog) {
    this.prog = prog;
    this.weightTotal = 0;
    this.subProgressCallbacks = new Array();
    this.subProgressWeights = new Array();
    this.subProgressValues = new Array();
    this.start = performance.now();
    for (let i = 0; i < this.subProgressWeights.length; ++i) {
      this.subProgressValues[i] = 0;
      this.subProgressCallbacks[i] = new ChildProgressCallback(i, this);
    }
  }
  addSubProgress(weight) {
    weight = weight || 1;
    this.weightTotal += weight;
    this.subProgressWeights.push(weight);
    this.subProgressValues.push(0);
    const child = new ChildProgressCallback(this.subProgressCallbacks.length, this);
    this.subProgressCallbacks.push(child);
    return child;
  }
  update(i, subSoFar, subTotal, msg) {
    if (this.prog) {
      this.subProgressValues[i] = subSoFar / subTotal;
      let soFar = 0;
      for (let j = 0; j < this.subProgressWeights.length; ++j) {
        soFar += this.subProgressValues[j] * this.subProgressWeights[j];
      }
      const end = performance.now();
      const delta2 = end - this.start;
      const est = this.start - end + delta2 * this.weightTotal / soFar;
      this.prog.report(soFar, this.weightTotal, msg, est);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/IProgress.ts
function isProgressCallback(obj2) {
  return isDefined(obj2) && isFunction(obj2.report) && isFunction(obj2.attach) && isFunction(obj2.end);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/progressSplit.ts
function progressSplitWeighted(prog, subProgressWeights) {
  const subProg = new WeightedParentProgressCallback(subProgressWeights, prog);
  return subProg.subProgressCallbacks;
}
function progressSplit(prog, taskCount) {
  const subProgressWeights = new Array(taskCount);
  for (let i = 0; i < taskCount; ++i) {
    subProgressWeights[i] = 1;
  }
  return progressSplitWeighted(prog, subProgressWeights);
}
var WeightedParentProgressCallback = class extends BaseParentProgressCallback {
  constructor(subProgressWeights, prog) {
    super(prog);
    for (const weight of subProgressWeights) {
      this.addSubProgress(weight);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/progressTasks.ts
async function progressTasksWeighted(prog, taskDefs) {
  const weights = new Array(taskDefs.length);
  const callbacks = new Array(taskDefs.length);
  for (let i = 0; i < taskDefs.length; ++i) {
    const taskDef = taskDefs[i];
    weights[i] = taskDef[0];
    callbacks[i] = taskDef[1];
  }
  const progs = progressSplitWeighted(prog, weights);
  const tasks = new Array(taskDefs.length);
  for (let i = 0; i < taskDefs.length; ++i) {
    tasks[i] = callbacks[i](progs[i]);
  }
  return await Promise.all(tasks);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/singleton.ts
function singleton(name, create2) {
  const box = globalThis;
  let value = box[name];
  if (isNullOrUndefined(value)) {
    if (isNullOrUndefined(create2)) {
      throw new Error(`No value ${name} found`);
    }
    value = create2();
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/mapInvert.ts
function mapInvert(map) {
  const mapOut = /* @__PURE__ */ new Map();
  for (const [key, value] of map) {
    mapOut.set(value, key);
  }
  return mapOut;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/units/fileSize.ts
function isBase2Units(label) {
  return label !== "B" && label[1] === "i";
}
function isBase10Units(label) {
  return label !== "B" && !isBase10Units(label);
}
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
function toBytes(value, units) {
  if (units === "B") {
    return value;
  } else {
    let systemBase;
    let size;
    if (isBase2Units(units)) {
      systemBase = 1024;
      size = base2Sizes.get(units);
    } else if (isBase10Units(units)) {
      systemBase = 1e3;
      size = base10Sizes.get(units);
    } else {
      assertNever(units);
    }
    const multiplier = Math.pow(systemBase, size);
    return value * multiplier;
  }
}

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
  constructor(url2, base) {
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
    if (url2 !== void 0) {
      this._url = new URL(url2, base);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/using.ts
function interfaceSigCheck(obj2, ...funcNames) {
  if (!isObject(obj2)) {
    return false;
  }
  obj2 = obj2;
  for (const funcName of funcNames) {
    if (!(funcName in obj2)) {
      return false;
    }
    const func = obj2[funcName];
    if (!isFunction(func)) {
      return false;
    }
  }
  return true;
}
function isDisposable(obj2) {
  return interfaceSigCheck(obj2, "dispose");
}
function isDestroyable(obj2) {
  return interfaceSigCheck(obj2, "destroy");
}
function isClosable(obj2) {
  return interfaceSigCheck(obj2, "close");
}
function dispose(val) {
  if (isDisposable(val)) {
    val.dispose();
  }
  if (isClosable(val)) {
    val.close();
  }
  if (isDestroyable(val)) {
    val.destroy();
  }
}
function using(val, thunk) {
  try {
    return thunk(val);
  } finally {
    dispose(val);
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/util.ts
var typePattern = /([^\/]+)\/(.+)/;
var subTypePattern = /(?:([^\.]+)\.)?([^\+;]+)(?:\+([^;]+))?((?:; *([^=]+)=([^;]+))*)/;
var MediaType = class {
  constructor(_type, _fullSubType, extensions) {
    this._type = _type;
    this._fullSubType = _fullSubType;
    this._primaryExtension = null;
    this.depMessage = null;
    const parameters = /* @__PURE__ */ new Map();
    this._parameters = parameters;
    const subTypeParts = this._fullSubType.match(subTypePattern);
    this._tree = subTypeParts[1];
    this._subType = subTypeParts[2];
    this._suffix = subTypeParts[3];
    const paramStr = subTypeParts[4];
    this._value = this._fullValue = this._type + "/";
    if (isDefined(this._tree)) {
      this._value = this._fullValue += this._tree + ".";
    }
    this._value = this._fullValue += this._subType;
    if (isDefined(this._suffix)) {
      this._value = this._fullValue += "+" + this._suffix;
    }
    if (isDefined(paramStr)) {
      const pairs = paramStr.split(";").map((p) => p.trim()).filter((p) => p.length > 0).map((p) => p.split("="));
      for (const [key, ...values] of pairs) {
        const value = values.join("=");
        parameters.set(key, value);
        const slug = `; ${key}=${value}`;
        this._fullValue += slug;
        if (key !== "q") {
          this._value += slug;
        }
      }
    }
    this._extensions = extensions || [];
    this._primaryExtension = this._extensions[0] || null;
  }
  static parse(value) {
    if (!value) {
      return null;
    }
    const match = value.match(typePattern);
    if (!match) {
      return null;
    }
    const type2 = match[1];
    const subType = match[2];
    return new MediaType(type2, subType);
  }
  deprecate(message) {
    this.depMessage = message;
    return this;
  }
  check() {
    if (isDefined(this.depMessage)) {
      console.warn(`${this._value} is deprecated ${this.depMessage}`);
    }
  }
  matches(value) {
    if (isNullOrUndefined(value)) {
      return false;
    }
    if (this.typeName === "*" && this.subTypeName === "*") {
      return true;
    }
    let typeName = null;
    let subTypeName = null;
    if (isString(value)) {
      const match = value.match(typePattern);
      if (!match) {
        return false;
      }
      typeName = match[1];
      subTypeName = match[2];
    } else {
      typeName = value.typeName;
      subTypeName = value._fullSubType;
    }
    return this.typeName === typeName && (this._fullSubType === "*" || this._fullSubType === subTypeName);
  }
  withParameter(key, value) {
    const newSubType = `${this._fullSubType}; ${key}=${value}`;
    return new MediaType(this.typeName, newSubType, this.extensions);
  }
  get typeName() {
    this.check();
    return this._type;
  }
  get tree() {
    this.check();
    return this._tree;
  }
  get suffix() {
    return this._suffix;
  }
  get subTypeName() {
    this.check();
    return this._subType;
  }
  get value() {
    this.check();
    return this._value;
  }
  __getValueUnsafe() {
    return this._value;
  }
  get fullValue() {
    this.check();
    return this._fullValue;
  }
  get parameters() {
    this.check();
    return this._parameters;
  }
  get extensions() {
    this.check();
    return this._extensions;
  }
  __getExtensionsUnsafe() {
    return this._extensions;
  }
  get primaryExtension() {
    this.check();
    return this._primaryExtension;
  }
  toString() {
    if (this.parameters.get("q") === "1") {
      return this.value;
    } else {
      return this.fullValue;
    }
  }
  addExtension(fileName) {
    if (!fileName) {
      throw new Error("File name is not defined");
    }
    if (this.primaryExtension) {
      const idx = fileName.lastIndexOf(".");
      if (idx > -1) {
        const currentExtension = fileName.substring(idx + 1);
        ;
        if (this.extensions.indexOf(currentExtension) > -1) {
          fileName = fileName.substring(0, idx);
        }
      }
      fileName = `${fileName}.${this.primaryExtension}`;
    }
    return fileName;
  }
};
function create(group, value, ...extensions) {
  return new MediaType(group, value, extensions);
}
function specialize(group) {
  return create.bind(null, group);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/application.ts
var application = /* @__PURE__ */ specialize("application");
var Application_Javascript = /* @__PURE__ */ application("javascript", "js");
var Application_Json = /* @__PURE__ */ application("json", "json");
var Application_Wasm = /* @__PURE__ */ application("wasm", "wasm");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/audio.ts
var audio = /* @__PURE__ */ specialize("audio");
var Audio_Mpeg = /* @__PURE__ */ audio("mpeg", "mp3", "mp2", "mp2a", "mpga", "m2a", "m3a");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/image.ts
var image = /* @__PURE__ */ specialize("image");
var Image_Jpeg = /* @__PURE__ */ image("jpeg", "jpeg", "jpg", "jpe");
var Image_Png = /* @__PURE__ */ image("png", "png");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/model.ts
var model = /* @__PURE__ */ specialize("model");
var Model_Gltf_Binary = /* @__PURE__ */ model("gltf-binary", "glb");
var Model_Gltf_Json = /* @__PURE__ */ model("gltf+json", "gltf");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/text.ts
var text = /* @__PURE__ */ specialize("text");
var Text_Plain = /* @__PURE__ */ text("plain", "txt", "text", "conf", "def", "list", "log", "in");
var Text_Xml = /* @__PURE__ */ text("xml");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/Asset.ts
var BaseAsset = class {
  constructor(path, type2) {
    this.path = path;
    this.type = type2;
    this._result = null;
    this._error = null;
    this._started = false;
    this._finished = false;
    this.resolve = null;
    this.reject = null;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (value) => {
        this._result = value;
        this._finished = true;
        resolve(value);
      };
      this.reject = (reason) => {
        this._error = reason;
        this._finished = true;
        reject(reason);
      };
    });
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
  async getSize(fetcher) {
    try {
      const { contentLength } = await fetcher.head(this.path).accept(this.type).exec();
      return [this, contentLength || 1];
    } catch (exp) {
      console.warn(exp);
      return [this, 1];
    }
    ;
  }
  async fetch(fetcher, prog) {
    try {
      const result = await this.getResult(fetcher, prog);
      this.resolve(result);
    } catch (err) {
      this.reject(err);
    }
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
var BaseFetchedAsset = class extends BaseAsset {
  constructor(path, typeOrUseCache, useCache) {
    let type2;
    if (isBoolean(typeOrUseCache)) {
      useCache = typeOrUseCache;
    } else {
      type2 = typeOrUseCache;
    }
    super(path, type2);
    this.useCache = !!useCache;
  }
  async getResult(fetcher, prog) {
    const response = await this.getRequest(fetcher, prog);
    return response.content;
  }
  getRequest(fetcher, prog) {
    const request = fetcher.get(this.path).useCache(this.useCache).progress(prog);
    return this.getResponse(request);
  }
};
var AssetAudio = class extends BaseFetchedAsset {
  getResponse(request) {
    return request.audio(false, false, this.type);
  }
};
var AssetImage = class extends BaseFetchedAsset {
  getResponse(request) {
    return request.image(this.type);
  }
};

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
function autoPlay(value) {
  return new Attr("autoplay", value, false, "audio", "video");
}
function controls(value) {
  return new Attr("controls", value, false, "audio", "video");
}
function htmlHeight(value) {
  return new Attr("height", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}
function id(value) {
  return new Attr("id", value, false);
}
function loop(value) {
  return new Attr("loop", value, false, "audio", "bgsound", "marquee", "video");
}
function muted(value) {
  return new Attr("muted", value, false, "audio", "video");
}
function playsInline(value) {
  return new Attr("playsInline", value, false, "audio", "video");
}
function type(value) {
  if (!isString(value)) {
    value = value.value;
  }
  return new Attr("type", value, false, "button", "input", "command", "embed", "link", "object", "script", "source", "style", "menu");
}
function htmlWidth(value) {
  return new Attr("width", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/css.ts
var CssProp = class {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.name = key.replace(/[A-Z]/g, (m) => `-${m.toLocaleLowerCase()}`);
  }
  applyToElement(elem) {
    elem.style[this.key] = this.value;
  }
};
var CssPropSet = class {
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
function display(v) {
  return new CssProp("display", v);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/tags.ts
function isErsatzElement(obj2) {
  if (!isObject(obj2)) {
    return false;
  }
  const elem = obj2;
  return elem.element instanceof Node;
}
function isErsatzElements(obj2) {
  return isObject(obj2) && "elements" in obj2 && obj2.elements instanceof Array;
}
function resolveElement(elem) {
  if (isErsatzElement(elem)) {
    return elem.element;
  }
  return elem;
}
function isIElementAppliable(obj2) {
  return isObject(obj2) && "applyToElement" in obj2 && isFunction(obj2.applyToElement);
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
function getInput(selector) {
  return getElement(selector);
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
function Audio2(...rest) {
  return tag("audio", ...rest);
}
function Canvas(...rest) {
  return tag("canvas", ...rest);
}
function Div(...rest) {
  return tag("div", ...rest);
}
function Img(...rest) {
  return tag("img", ...rest);
}
function Script(...rest) {
  return tag("script", ...rest);
}
function Video(...rest) {
  return tag("video", ...rest);
}
function BackgroundAudio(autoplay, mute, looping, ...rest) {
  return Audio2(playsInline(true), controls(false), muted(mute), autoPlay(autoplay), loop(looping), styles(display("none")), ...rest);
}
function BackgroundVideo(autoplay, mute, looping, ...rest) {
  return Video(playsInline(true), controls(false), muted(mute), autoPlay(autoplay), loop(looping), styles(display("none")), ...rest);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/canvas.ts
var hasHTMLCanvas = "HTMLCanvasElement" in globalThis;
var hasHTMLImage = "HTMLImageElement" in globalThis;
var disableAdvancedSettings = false;
var hasOffscreenCanvas = !disableAdvancedSettings && "OffscreenCanvas" in globalThis;
var hasImageBitmap = !disableAdvancedSettings && "createImageBitmap" in globalThis;
function isHTMLCanvas(obj2) {
  return hasHTMLCanvas && obj2 instanceof HTMLCanvasElement;
}
function isOffscreenCanvas(obj2) {
  return hasOffscreenCanvas && obj2 instanceof OffscreenCanvas;
}
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
var createUtilityCanvas = hasOffscreenCanvasRenderingContext2D && createOffscreenCanvas || hasHTMLCanvas && createCanvas || null;
var createUICanvas = hasHTMLCanvas ? createCanvas : createUtilityCanvas;
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
function createOffscreenCanvas(width, height) {
  return new OffscreenCanvas(width, height);
}
function createCanvas(w, h) {
  if (false) {
    throw new Error("HTML Canvas is not supported in workers");
  }
  return Canvas(htmlWidth(w), htmlHeight(h));
}
function drawImageToCanvas(canv, img) {
  const g = canv.getContext("2d");
  if (isNullOrUndefined(g)) {
    throw new Error("Could not create 2d context for canvas");
  }
  g.drawImage(img, 0, 0);
}
function canvasToBlob(canvas, type2, quality) {
  if (isOffscreenCanvas(canvas)) {
    return canvas.convertToBlob({ type: type2, quality });
  } else if (isHTMLCanvas(canvas)) {
    const blobCreated = new Task();
    canvas.toBlob(blobCreated.resolve, type2, quality);
    return blobCreated;
  } else {
    throw new Error("Cannot save image from canvas");
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/RequestBuilder.ts
var testAudio = null;
function canPlay(type2) {
  if (testAudio === null) {
    testAudio = new Audio();
  }
  return testAudio.canPlayType(type2) !== "";
}
var RequestBuilder = class {
  constructor(fetcher, useFileBlobsForModules, method, path) {
    this.fetcher = fetcher;
    this.useFileBlobsForModules = useFileBlobsForModules;
    this.method = method;
    this.prog = null;
    this.path = path;
    this.request = {
      method,
      path: this.path.href,
      body: null,
      headers: null,
      timeout: null,
      withCredentials: false,
      useCache: false
    };
  }
  query(name, value) {
    this.path.searchParams.set(name, value);
    this.request.path = this.path.href;
    return this;
  }
  header(name, value) {
    if (this.request.headers === null) {
      this.request.headers = /* @__PURE__ */ new Map();
    }
    this.request.headers.set(name.toLowerCase(), value);
    return this;
  }
  timeout(value) {
    this.request.timeout = value;
    return this;
  }
  progress(prog) {
    this.prog = prog;
    return this;
  }
  body(body, contentType) {
    this.request.body = body;
    this.content(contentType);
    return this;
  }
  withCredentials() {
    this.request.withCredentials = true;
    return this;
  }
  useCache(enabled = true) {
    this.request.useCache = enabled;
    return this;
  }
  media(key, mediaType) {
    if (isDefined(mediaType)) {
      if (!isString(mediaType)) {
        mediaType = mediaType.value;
      }
      this.header(key, mediaType);
    }
  }
  content(contentType) {
    this.media("content-type", contentType);
  }
  accept(acceptType) {
    this.media("accept", acceptType);
    return this;
  }
  blob(acceptType) {
    this.accept(acceptType);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetBlob(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetBlob(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  buffer(acceptType) {
    this.accept(acceptType);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetBuffer(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetBuffer(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  file(acceptType) {
    this.accept(acceptType);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetFile(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetFile(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  text(acceptType) {
    this.accept(acceptType || Text_Plain);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetText(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetText(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  object(acceptType) {
    this.accept(acceptType || Application_Json);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetObject(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetObject(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  xml(acceptType) {
    this.accept(acceptType || Text_Xml);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetXml(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetXml(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  imageBitmap(acceptType) {
    this.accept(acceptType);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetImageBitmap(this.request, this.prog);
    } else if (this.method === "GET") {
      return this.fetcher.sendNothingGetImageBitmap(this.request, this.prog);
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  exec() {
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return this.fetcher.sendObjectGetNothing(this.request, this.prog);
    } else if (this.method === "GET") {
      throw new Exception("GET requests should expect a response type");
    } else if (this.method === "HEAD" || this.method === "OPTIONS") {
      return this.fetcher.sendNothingGetNothing(this.request);
    } else {
      assertNever(this.method);
    }
  }
  async audioBlob(acceptType) {
    if (isDefined(acceptType)) {
      if (!isString(acceptType)) {
        acceptType = acceptType.value;
      }
      if (!canPlay(acceptType)) {
        throw new Error(`Probably can't play file of type "${acceptType}" at path: ${this.request.path}`);
      }
    }
    const response = await this.blob(acceptType);
    if (canPlay(response.contentType)) {
      return response;
    }
    throw new Error(`Cannot play file of type "${response.contentType}" at path: ${this.request.path}`);
  }
  async audioBuffer(audioCtx, acceptType) {
    return translateResponse(await this.audioBlob(acceptType), async (blob) => await audioCtx.decodeAudioData(await blob.arrayBuffer()));
  }
  async htmlElement(element, resolveEvt, acceptType) {
    const response = await this.file(acceptType);
    const task = once(element, resolveEvt, "error");
    element.src = response.content;
    await task;
    return await translateResponse(response, () => element);
  }
  image(acceptType) {
    return this.htmlElement(Img(), "load", acceptType);
  }
  async htmlCanvas(acceptType) {
    if (false) {
      throw new Error("HTMLCanvasElement not supported in Workers.");
    }
    const canvas = createCanvas(1, 1);
    if (this.method === "GET") {
      if (hasOffscreenCanvas) {
        this.accept(acceptType);
        const response = await this.fetcher.drawImageToCanvas(this.request, canvas.transferControlToOffscreen(), this.prog);
        return await translateResponse(response, () => canvas);
      } else {
        const response = await (false ? this.imageBitmap(acceptType) : this.image(acceptType));
        return await translateResponse(response, (img) => {
          canvas.width = img.width;
          canvas.height = img.height;
          drawImageToCanvas(canvas, img);
          dispose(img);
          return canvas;
        });
      }
    } else if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE" || this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  canvas(acceptType) {
    if (hasOffscreenCanvas) {
      return this.offscreenCanvas(acceptType);
    } else {
      return this.htmlCanvas(acceptType);
    }
  }
  async offscreenCanvas(acceptType) {
    if (!hasOffscreenCanvas) {
      throw new Error("This system does not support OffscreenCanvas");
    }
    if (this.method === "GET") {
      const response = await (false ? this.imageBitmap(acceptType) : this.image(acceptType));
      return await translateResponse(response, (img) => {
        const canvas = createOffscreenCanvas(img.width, img.height);
        drawImageToCanvas(canvas, img);
        dispose(img);
        return canvas;
      });
    } else if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE" || this.method === "HEAD" || this.method === "OPTIONS") {
      throw new Error(`${this.method} responses do not contain bodies`);
    } else {
      assertNever(this.method);
    }
  }
  audio(autoPlaying, looping, acceptType) {
    return this.htmlElement(BackgroundAudio(autoPlaying, false, looping), "canplay", acceptType);
  }
  video(autoPlaying, looping, acceptType) {
    return this.htmlElement(BackgroundVideo(autoPlaying, false, looping), "canplay", acceptType);
  }
  async getScript() {
    const tag2 = Script(type(Application_Javascript));
    document.body.append(tag2);
    if (this.useFileBlobsForModules) {
      await this.htmlElement(tag2, "load", Application_Javascript);
    } else {
      tag2.src = this.request.path;
    }
  }
  async script(test) {
    const scriptPath = this.request.path;
    if (!test) {
      await this.getScript();
    } else if (!test()) {
      const scriptLoadTask = waitFor(test);
      await this.getScript();
      await scriptLoadTask;
    }
    if (this.prog) {
      this.prog.end(scriptPath);
    }
  }
  async module() {
    const scriptPath = this.request.path;
    let requestPath = scriptPath;
    if (this.useFileBlobsForModules) {
      const { content: file } = await this.file(Application_Javascript);
      requestPath = file;
    }
    const value = await import(requestPath);
    if (this.prog) {
      this.prog.end(scriptPath);
    }
    return value;
  }
  async wasm(imports) {
    const { content: buffer, contentType } = await this.buffer(Application_Wasm);
    if (!Application_Wasm.matches(contentType)) {
      throw new Error(`Server did not respond with WASM file. Was: ${contentType}`);
    }
    const module = await WebAssembly.compile(buffer);
    const instance = await WebAssembly.instantiate(module, imports);
    return instance.exports;
  }
  async worker(type2 = "module") {
    const scriptPath = this.request.path;
    let requestPath = scriptPath;
    if (this.useFileBlobsForModules) {
      const { content: file } = await this.file(Application_Javascript);
      requestPath = file;
    }
    this.prog = null;
    this.request.timeout = null;
    const worker = new Worker(requestPath, { type: type2 });
    if (this.prog) {
      this.prog.end(scriptPath);
    }
    return worker;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/Fetcher.ts
var Fetcher = class {
  constructor(service, useFileBlobsForModules = true) {
    this.service = service;
    this.useFileBlobsForModules = useFileBlobsForModules;
    if (true) {
      const antiforgeryToken = getInput("input[name=__RequestVerificationToken]");
      if (antiforgeryToken) {
        this.service.setRequestVerificationToken(antiforgeryToken.value);
      }
    }
  }
  createRequest(method, path, base) {
    return new RequestBuilder(this.service, this.useFileBlobsForModules, method, new URL(path, base || location.href));
  }
  clearCache() {
    return this.service.clearCache();
  }
  head(path, base) {
    return this.createRequest("HEAD", path, base);
  }
  options(path, base) {
    return this.createRequest("OPTIONS", path, base);
  }
  get(path, base) {
    return this.createRequest("GET", path, base);
  }
  post(path, base) {
    return this.createRequest("POST", path, base);
  }
  put(path, base) {
    return this.createRequest("PUT", path, base);
  }
  patch(path, base) {
    return this.createRequest("PATCH", path, base);
  }
  delete(path, base) {
    return this.createRequest("DELETE", path, base);
  }
  async assets(progress, ...assets) {
    assets = assets.filter(isDefined);
    const assetSizes = new Map(await Promise.all(assets.map((asset) => asset.getSize(this))));
    await progressTasksWeighted(progress, assets.map((asset) => [assetSizes.get(asset), (prog) => asset.fetch(this, prog)]));
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/translateResponse.ts
async function translateResponse(response, translate) {
  const {
    status,
    path,
    content,
    contentType,
    contentLength,
    fileName,
    headers,
    date
  } = response;
  return {
    status,
    path,
    content: await translate(content),
    contentType,
    contentLength,
    fileName,
    headers,
    date
  };
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/FetchingService.ts
var FetchingService = class {
  constructor(impl) {
    this.impl = impl;
    this.defaultPostHeaders = /* @__PURE__ */ new Map();
  }
  setRequestVerificationToken(value) {
    this.defaultPostHeaders.set("RequestVerificationToken", value);
  }
  clearCache() {
    return this.impl.clearCache();
  }
  sendNothingGetNothing(request) {
    return this.impl.sendNothingGetNothing(request);
  }
  sendNothingGetBlob(request, progress) {
    return this.impl.sendNothingGetSomething("blob", request, progress);
  }
  sendObjectGetBlob(request, progress) {
    return this.impl.sendSomethingGetSomething("blob", request, this.defaultPostHeaders, progress);
  }
  sendNothingGetBuffer(request, progress) {
    return this.impl.sendNothingGetSomething("arraybuffer", request, progress);
  }
  sendObjectGetBuffer(request, progress) {
    return this.impl.sendSomethingGetSomething("arraybuffer", request, this.defaultPostHeaders, progress);
  }
  sendNothingGetText(request, progress) {
    return this.impl.sendNothingGetSomething("text", request, progress);
  }
  sendObjectGetText(request, progress) {
    return this.impl.sendSomethingGetSomething("text", request, this.defaultPostHeaders, progress);
  }
  async sendNothingGetObject(request, progress) {
    const response = await this.impl.sendNothingGetSomething("json", request, progress);
    return response.content;
  }
  async sendObjectGetObject(request, progress) {
    const response = await this.impl.sendSomethingGetSomething("json", request, this.defaultPostHeaders, progress);
    return response.content;
  }
  sendObjectGetNothing(request, progress) {
    return this.impl.sendSomethingGetSomething("", request, this.defaultPostHeaders, progress);
  }
  drawImageToCanvas(request, canvas, progress) {
    return this.impl.drawImageToCanvas(request, canvas, progress);
  }
  async sendNothingGetFile(request, progress) {
    return translateResponse(await this.sendNothingGetBlob(request, progress), URL.createObjectURL);
  }
  async sendObjectGetFile(request, progress) {
    return translateResponse(await this.sendObjectGetBlob(request, progress), URL.createObjectURL);
  }
  async sendNothingGetXml(request, progress) {
    return translateResponse(await this.impl.sendNothingGetSomething("document", request, progress), (doc) => doc.documentElement);
  }
  async sendObjectGetXml(request, progress) {
    return translateResponse(await this.impl.sendSomethingGetSomething("document", request, this.defaultPostHeaders, progress), (doc) => doc.documentElement);
  }
  async sendNothingGetImageBitmap(request, progress) {
    return translateResponse(await this.sendNothingGetBlob(request, progress), createImageBitmap);
  }
  async sendObjectGetImageBitmap(request, progress) {
    return translateResponse(await this.sendObjectGetBlob(request, progress), createImageBitmap);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/workers/WorkerClient.ts
var WorkerClient = class extends TypedEventBase {
  constructor(worker) {
    super();
    this.worker = worker;
    this.taskCounter = 0;
    this.invocations = /* @__PURE__ */ new Map();
    this.tasks = new Array();
    if (!isWorkerSupported) {
      console.warn("Workers are not supported on this system.");
    }
    this.worker.addEventListener("message", (evt) => {
      const data = evt.data;
      switch (data.type) {
        case "event":
          this.propogateEvent(data);
          break;
        case "progress":
          this.progressReport(data);
          break;
        case "return":
          this.methodReturned(data);
          break;
        case "error":
          this.invocationError(data);
          break;
        default:
          assertNever(data);
      }
    });
  }
  postMessage(message, transferables) {
    if (message.type !== "methodCall") {
      assertNever(message.type);
    }
    if (transferables) {
      this.worker.postMessage(message, transferables);
    } else {
      this.worker.postMessage(message);
    }
  }
  dispose() {
    this.worker.terminate();
  }
  progressReport(data) {
    const invocation = this.invocations.get(data.taskID);
    if (invocation) {
      const { prog } = invocation;
      if (prog) {
        prog.report(data.soFar, data.total, data.msg, data.est);
      }
    }
  }
  methodReturned(data) {
    const messageHandler = this.removeInvocation(data.taskID);
    const { task } = messageHandler;
    task.resolve(data.returnValue);
  }
  invocationError(data) {
    const messageHandler = this.removeInvocation(data.taskID);
    const { task, methodName } = messageHandler;
    task.reject(new Error(`${methodName} failed. Reason: ${data.errorMessage}`));
  }
  removeInvocation(taskID) {
    const invocation = this.invocations.get(taskID);
    this.invocations.delete(taskID);
    return invocation;
  }
  callMethod(methodName, parameters, transferables, prog) {
    if (!isWorkerSupported) {
      return Promise.reject(new Error("Workers are not supported on this system."));
    }
    let params = null;
    let tfers = null;
    if (isProgressCallback(parameters)) {
      prog = parameters;
      parameters = null;
      transferables = null;
    }
    if (isProgressCallback(transferables) && !prog) {
      prog = transferables;
      transferables = null;
    }
    if (isArray(parameters)) {
      params = parameters;
    }
    if (isArray(transferables)) {
      tfers = transferables;
    }
    const taskID = this.taskCounter++;
    let task = arrayScan(this.tasks, (t2) => t2.finished);
    if (task) {
      task.reset();
    } else {
      task = new Task();
      this.tasks.push(task);
    }
    const invocation = {
      methodName,
      task,
      prog
    };
    this.invocations.set(taskID, invocation);
    let message = null;
    if (isDefined(parameters)) {
      message = {
        type: "methodCall",
        taskID,
        methodName,
        params
      };
    } else {
      message = {
        type: "methodCall",
        taskID,
        methodName
      };
    }
    this.postMessage(message, tfers);
    return task;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/workers/WorkerPool.ts
var WorkerPool = class extends TypedEventBase {
  constructor(options, WorkerClientClass) {
    super();
    this.scriptPath = options.scriptPath;
    let workerPoolSize = -1;
    const workersDef = options.workers;
    let workers = null;
    if (isNumber(workersDef)) {
      workerPoolSize = workersDef;
    } else if (isDefined(workersDef)) {
      this.taskCounter = workersDef.curTaskCounter;
      workers = workersDef.workers;
      workerPoolSize = workers.length;
    } else {
      workerPoolSize = navigator.hardwareConcurrency || 4;
    }
    if (workerPoolSize < 1) {
      throw new Error("Worker pool size must be a postive integer greater than 0");
    }
    this.workers = new Array(workerPoolSize);
    if (isNullOrUndefined(workers)) {
      this.taskCounter = 0;
      for (let i = 0; i < workerPoolSize; ++i) {
        this.workers[i] = new WorkerClientClass(new Worker(this.scriptPath, { type: "module" }));
      }
    } else {
      for (let i = 0; i < workerPoolSize; ++i) {
        this.workers[i] = new WorkerClientClass(workers[i]);
      }
    }
    for (const worker of this.workers) {
      worker.addBubbler(this);
    }
  }
  dispose() {
    for (const worker of this.workers) {
      worker.dispose();
    }
    arrayClear(this.workers);
  }
  nextWorker() {
    const worker = this.peekWorker();
    this.taskCounter++;
    return worker;
  }
  peekWorker() {
    return this.workers[this.taskCounter % this.workers.length];
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/FetchingServiceClient.ts
function isDOMParsersSupportedType(type2) {
  return type2 === "application/xhtml+xml" || type2 === "application/xml" || type2 === "image/svg+xml" || type2 === "text/html" || type2 === "text/xml";
}
function bufferToXml(response) {
  const {
    status,
    path,
    content: buffer,
    contentType,
    contentLength,
    fileName,
    headers,
    date
  } = response;
  if (!isDOMParsersSupportedType(contentType)) {
    throw new Error(`Content-Type ${contentType} is not one supported by the DOM parser.`);
  }
  const decoder = new TextDecoder();
  const text2 = decoder.decode(buffer);
  const parser = new DOMParser();
  const doc = parser.parseFromString(text2, contentType);
  return {
    status,
    path,
    content: doc.documentElement,
    contentType,
    contentLength,
    fileName,
    date,
    headers
  };
}
function bufferToBlob(response) {
  const {
    status,
    path,
    content: buffer,
    contentType,
    contentLength,
    fileName,
    headers,
    date
  } = response;
  const blob = new Blob([buffer], {
    type: contentType
  });
  return {
    status,
    path,
    content: blob,
    contentType,
    contentLength,
    fileName,
    date,
    headers
  };
}
function cloneRequest(request) {
  request = {
    method: request.method,
    path: request.path,
    timeout: request.timeout,
    headers: request.headers,
    withCredentials: request.withCredentials,
    useCache: request.useCache
  };
  return request;
}
function cloneRequestWithBody(request) {
  request = {
    method: request.method,
    path: request.path,
    body: request.body,
    timeout: request.timeout,
    headers: request.headers,
    withCredentials: request.withCredentials,
    useCache: request.useCache
  };
  return request;
}
var FetchingServiceClient = class extends WorkerClient {
  setRequestVerificationToken(value) {
    this.callMethod("setRequestVerificationToken", [value]);
  }
  clearCache() {
    return this.callMethod("clearCache");
  }
  propogateEvent(data) {
    assertNever(data.eventName);
  }
  makeRequest(methodName, request, progress) {
    return this.callMethod(methodName, [cloneRequest(request)], progress);
  }
  makeRequestWithBody(methodName, request, progress) {
    return this.callMethod(methodName, [cloneRequestWithBody(request)], progress);
  }
  sendNothingGetNothing(request) {
    return this.makeRequest("sendNothingGetNothing", request, null);
  }
  sendNothingGetBuffer(request, progress) {
    return this.makeRequest("sendNothingGetBuffer", request, progress);
  }
  sendNothingGetText(request, progress) {
    return this.makeRequest("sendNothingGetText", request, progress);
  }
  sendNothingGetObject(request, progress) {
    return this.makeRequest("sendNothingGetObject", request, progress);
  }
  sendNothingGetFile(request, progress) {
    return this.makeRequest("sendNothingGetFile", request, progress);
  }
  sendNothingGetImageBitmap(request, progress) {
    return this.makeRequest("sendNothingGetImageBitmap", request, progress);
  }
  sendObjectGetNothing(request, progress) {
    return this.makeRequestWithBody("sendObjectGetNothing", request, progress);
  }
  sendObjectGetBuffer(request, progress) {
    return this.makeRequestWithBody("sendObjectGetBuffer", request, progress);
  }
  sendObjectGetText(request, progress) {
    return this.makeRequestWithBody("sendObjectGetText", request, progress);
  }
  sendObjectGetObject(request, progress) {
    return this.makeRequestWithBody("sendObjectGetObject", request, progress);
  }
  sendObjectGetFile(request, progress) {
    return this.makeRequestWithBody("sendObjectGetFile", request, progress);
  }
  sendObjectGetImageBitmap(request, progress) {
    return this.makeRequestWithBody("sendObjectGetImageBitmap", request, progress);
  }
  drawImageToCanvas(request, canvas, progress) {
    return this.callMethod("drawImageToCanvas", [cloneRequest(request), canvas], [canvas], progress);
  }
  async sendNothingGetBlob(request, progress) {
    const response = await this.sendNothingGetBuffer(request, progress);
    return bufferToBlob(response);
  }
  async sendNothingGetXml(request, progress) {
    const response = await this.sendNothingGetBuffer(request, progress);
    return bufferToXml(response);
  }
  async sendObjectGetBlob(request, progress) {
    const response = await this.sendObjectGetBuffer(request, progress);
    return bufferToBlob(response);
  }
  async sendObjectGetXml(request, progress) {
    const response = await this.sendObjectGetBuffer(request, progress);
    return bufferToXml(response);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/indexdb/index.ts
var IDexDB = class {
  constructor(db) {
    this.db = db;
  }
  static async getCurrentVersion(dbName) {
    if (isDefined(indexedDB.databases)) {
      const databases = await indexedDB.databases();
      for (const { name, version: version2 } of databases) {
        if (name === dbName) {
          return version2;
        }
      }
    }
    return null;
  }
  static delete(dbName) {
    const deleteRequest = indexedDB.deleteDatabase(dbName);
    const task = once(deleteRequest, "success", "error", "blocked");
    return success(task);
  }
  static async open(name, ...storeDefs) {
    const storesByName = mapMap(storeDefs, (v) => v.name, identity);
    const indexesByName = new PriorityMap(storeDefs.filter((storeDef) => isDefined(storeDef.indexes)).flatMap((storeDef) => storeDef.indexes.map((indexDef) => [storeDef.name, indexDef.name, indexDef])));
    const storesToAdd = new Array();
    const storesToRemove = new Array();
    const storesToChange = new Array();
    const indexesToAdd = new PriorityList();
    const indexesToRemove = new PriorityList();
    let version2 = await this.getCurrentVersion(name);
    if (isNullOrUndefined(version2)) {
      storesToAdd.push(...storesByName.keys());
      for (const storeDef of storeDefs) {
        if (isDefined(storeDef.indexes)) {
          for (const indexDef of storeDef.indexes) {
            indexesToAdd.add(storeDef.name, indexDef.name);
          }
        }
      }
    } else {
      const D = indexedDB.open(name);
      if (await success(once(D, "success", "error", "blocked"))) {
        const db = D.result;
        const storesToScrutinize = new Array();
        for (const storeName of Array.from(db.objectStoreNames)) {
          if (!storesByName.has(storeName)) {
            storesToRemove.push(storeName);
          }
        }
        for (const storeName of storesByName.keys()) {
          if (!db.objectStoreNames.contains(storeName)) {
            storesToAdd.push(storeName);
          } else {
            storesToScrutinize.push(storeName);
          }
        }
        if (storesToScrutinize.length > 0) {
          const transaction = db.transaction(storesToScrutinize);
          const transacting = once(transaction, "complete", "error", "abort");
          const transacted = success(transacting);
          for (const storeName of storesToScrutinize) {
            const store = transaction.objectStore(storeName);
            for (const indexName of Array.from(store.indexNames)) {
              if (!indexesByName.has(storeName, indexName)) {
                if (storesToChange.indexOf(storeName) === -1) {
                  storesToChange.push(storeName);
                }
                indexesToRemove.add(storeName, indexName);
              }
            }
            if (indexesByName.has(storeName)) {
              for (const indexName of indexesByName.get(storeName).keys()) {
                if (!store.indexNames.contains(indexName)) {
                  if (storesToChange.indexOf(storeName) === -1) {
                    storesToChange.push(storeName);
                  }
                  indexesToAdd.add(storeName, indexName);
                } else {
                  const indexDef = indexesByName.get(storeName, indexName);
                  const index = store.index(indexName);
                  if (isString(indexDef.keyPath) !== isString(index.keyPath) || isString(indexDef.keyPath) && isString(index.keyPath) && indexDef.keyPath !== index.keyPath || isArray(indexDef.keyPath) && isArray(index.keyPath) && arrayCompare(indexDef.keyPath, index.keyPath)) {
                    if (storesToChange.indexOf(storeName) === -1) {
                      storesToChange.push(storeName);
                    }
                    indexesToRemove.add(storeName, indexName);
                    indexesToAdd.add(storeName, indexName);
                  }
                }
              }
            }
          }
          transaction.commit();
          await transacted;
        }
        db.close();
      }
      if (storesToAdd.length > 0 || storesToRemove.length > 0 || indexesToAdd.size > 0 || indexesToRemove.size > 0) {
        ++version2;
      }
    }
    const upgrading = new Task();
    const openRequest = isDefined(version2) ? indexedDB.open(name, version2) : indexedDB.open(name);
    const opening = once(openRequest, "success", "error", "blocked");
    const upgraded = success(upgrading);
    const opened = success(opening);
    const noUpgrade = () => upgrading.resolve(false);
    openRequest.addEventListener("success", noUpgrade);
    openRequest.addEventListener("upgradeneeded", () => {
      const transacting = once(openRequest.transaction, "complete", "error", "abort");
      const db = openRequest.result;
      for (const storeName of storesToRemove) {
        db.deleteObjectStore(storeName);
      }
      const stores = /* @__PURE__ */ new Map();
      for (const storeName of storesToAdd) {
        const storeDef = storesByName.get(storeName);
        const store = db.createObjectStore(storeName, storeDef.options);
        stores.set(storeName, store);
      }
      for (const storeName of storesToChange) {
        const store = openRequest.transaction.objectStore(storeName);
        stores.set(storeName, store);
      }
      for (const [storeName, store] of stores) {
        for (const indexName of indexesToRemove.get(storeName)) {
          store.deleteIndex(indexName);
        }
        for (const indexName of indexesToAdd.get(storeName)) {
          const indexDef = indexesByName.get(storeName, indexName);
          store.createIndex(indexName, indexDef.keyPath, indexDef.options);
        }
      }
      success(transacting).then(upgrading.resolve).catch(upgrading.reject).finally(() => openRequest.removeEventListener("success", noUpgrade));
    });
    if (!await upgraded) {
      throw upgrading.error;
    }
    if (!await opened) {
      throw opening.error;
    }
    return new IDexDB(openRequest.result);
  }
  dispose() {
    this.db.close();
  }
  get name() {
    return this.db.name;
  }
  get version() {
    return this.db.version;
  }
  get storeNames() {
    return Array.from(this.db.objectStoreNames);
  }
  getStore(storeName) {
    return new IDexStore(this.db, storeName);
  }
};
var IDexStore = class {
  constructor(db, storeName) {
    this.db = db;
    this.storeName = storeName;
  }
  async request(makeRequest, mode) {
    const transaction = this.db.transaction(this.storeName, mode);
    const transacting = once(transaction, "complete", "error");
    const store = transaction.objectStore(this.storeName);
    const request = makeRequest(store);
    const requesting = once(request, "success", "error");
    if (!await success(requesting)) {
      transaction.abort();
      throw requesting.error;
    }
    transaction.commit();
    if (!await success(transacting)) {
      throw transacting.error;
    }
    return request.result;
  }
  add(value, key) {
    return this.request((store) => store.add(value, key), "readwrite");
  }
  clear() {
    return this.request((store) => store.clear(), "readwrite");
  }
  getCount(query) {
    return this.request((store) => store.count(query), "readonly");
  }
  delete(query) {
    return this.request((store) => store.delete(query), "readwrite");
  }
  get(key) {
    return this.request((store) => store.get(key), "readonly");
  }
  getAll() {
    return this.request((store) => store.getAll(), "readonly");
  }
  getAllKeys() {
    return this.request((store) => store.getAllKeys(), "readonly");
  }
  getKey(query) {
    return this.request((store) => store.getKey(query), "readonly");
  }
  openCursor(query, direction) {
    return this.request((store) => store.openCursor(query, direction), "readonly");
  }
  openKeyCursor(query, direction) {
    return this.request((store) => store.openKeyCursor(query, direction), "readonly");
  }
  put(value, key) {
    return this.request((store) => store.put(value, key), "readwrite");
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/FetchingServiceImplXHR.ts
function isXHRBodyInit(obj2) {
  return isString(obj2) || isArrayBufferView(obj2) || obj2 instanceof Blob || obj2 instanceof FormData || isArrayBuffer(obj2) || obj2 instanceof ReadableStream || "Document" in globalThis && obj2 instanceof Document;
}
function trackProgress(name, xhr, target, prog, skipLoading, prevTask) {
  let prevDone = !prevTask;
  if (prevTask) {
    prevTask.then(() => prevDone = true);
  }
  let done = false;
  let loaded = skipLoading;
  const requestComplete = new Task(() => loaded && done, () => prevDone);
  target.addEventListener("loadstart", () => {
    if (prevDone && !done && prog) {
      prog.start(name);
    }
  });
  target.addEventListener("progress", (ev) => {
    if (prevDone && !done) {
      const evt = ev;
      if (prog) {
        prog.report(evt.loaded, Math.max(evt.loaded, evt.total), name);
      }
      if (evt.loaded === evt.total) {
        loaded = true;
        requestComplete.resolve();
      }
    }
  });
  target.addEventListener("load", () => {
    if (prevDone && !done) {
      if (prog) {
        prog.end(name);
      }
      done = true;
      requestComplete.resolve();
    }
  });
  const onError = (msg) => () => requestComplete.reject(`${msg} (${xhr.status})`);
  target.addEventListener("error", onError("error"));
  target.addEventListener("abort", onError("abort"));
  target.addEventListener("timeout", onError("timeout"));
  return requestComplete;
}
function sendRequest(xhr, method, path, timeout, headers, body) {
  xhr.open(method, path);
  xhr.responseType = "blob";
  xhr.timeout = timeout;
  if (headers) {
    for (const [key, value] of headers) {
      xhr.setRequestHeader(key, value);
    }
  }
  if (isDefined(body)) {
    xhr.send(body);
  } else {
    xhr.send();
  }
}
function readResponseHeader(headers, key, translate) {
  if (!headers.has(key)) {
    return null;
  }
  const value = headers.get(key);
  try {
    const translated = translate(value);
    headers.delete(key);
    return translated;
  } catch (exp) {
    console.warn(key, exp);
  }
  return null;
}
var FILE_NAME_PATTERN = /filename=\"(.+)\"(;|$)/;
var DB_NAME = "Juniper:Fetcher:Cache";
var FetchingServiceImplXHR = class {
  constructor() {
    this.cache = null;
    this.store = null;
    this.tasks = new PriorityMap();
    this.cacheReady = this.openCache();
  }
  async drawImageToCanvas(request, canvas, progress) {
    const response = await this.sendNothingGetSomething("blob", request, progress);
    const blob = response.content;
    return using(await createImageBitmap(blob, {
      imageOrientation: "none"
    }), (img) => {
      canvas.width = img.width;
      canvas.height = img.height;
      const g = canvas.getContext("2d");
      g.drawImage(img, 0, 0);
      return translateResponse(response, () => null);
    });
  }
  async openCache() {
    this.cache = await IDexDB.open(DB_NAME, {
      name: "files",
      options: {
        keyPath: "path"
      }
    });
    this.store = await this.cache.getStore("files");
  }
  async clearCache() {
    await this.cacheReady;
    await this.store.clear();
  }
  async readResponseHeaders(path, xhr) {
    const headerParts = xhr.getAllResponseHeaders().split(/[\r\n]+/).map((v) => v.trim()).filter((v) => v.length > 0).map((line) => {
      const parts = line.split(": ");
      const key = parts.shift().toLowerCase();
      const value = parts.join(": ");
      return [key, value];
    });
    const pList = new PriorityList(headerParts);
    const normalizedHeaderParts = Array.from(pList.keys()).map((key) => [
      key,
      pList.get(key).join(", ")
    ]);
    const headers = new Map(normalizedHeaderParts);
    const contentType = readResponseHeader(headers, "content-type", identity);
    const contentLength = readResponseHeader(headers, "content-length", parseFloat);
    const date = readResponseHeader(headers, "date", (v) => new Date(v));
    const fileName = readResponseHeader(headers, "content-disposition", (v) => {
      if (isDefined(v)) {
        const match = v.match(FILE_NAME_PATTERN);
        if (isDefined(match)) {
          return match[1];
        }
      }
      return null;
    });
    const response = {
      status: xhr.status,
      path,
      content: void 0,
      contentType,
      contentLength,
      fileName,
      date,
      headers
    };
    return response;
  }
  async readResponse(path, xhr) {
    const {
      status,
      contentType,
      contentLength,
      fileName,
      date,
      headers
    } = await this.readResponseHeaders(path, xhr);
    const response = {
      path,
      status,
      contentType,
      contentLength,
      fileName,
      date,
      headers,
      content: xhr.response
    };
    if (isDefined(response.content)) {
      response.contentType = response.contentType || response.content.type;
      response.contentLength = response.contentLength || response.content.size;
    }
    return response;
  }
  async decodeContent(xhrType, response) {
    return translateResponse(response, async (contentBlob) => {
      if (xhrType === "") {
        return null;
      } else if (isNullOrUndefined(response.contentType)) {
        const headerBlock = Array.from(response.headers.entries()).map((kv) => kv.join(": ")).join("\n  ");
        throw new Error("No content type found in headers: \n  " + headerBlock);
      } else if (xhrType === "blob") {
        return contentBlob;
      } else if (xhrType === "arraybuffer") {
        return await contentBlob.arrayBuffer();
      } else if (xhrType === "json") {
        const text2 = await contentBlob.text();
        if (text2.length > 0) {
          return JSON.parse(text2);
        } else {
          return null;
        }
      } else if (xhrType === "document") {
        const parser = new DOMParser();
        if (response.contentType === "application/xhtml+xml" || response.contentType === "text/html" || response.contentType === "application/xml" || response.contentType === "image/svg+xml" || response.contentType === "text/xml") {
          return parser.parseFromString(await contentBlob.text(), response.contentType);
        } else {
          throw new Error("Couldn't parse document");
        }
      } else if (xhrType === "text") {
        return await contentBlob.text();
      } else {
        assertNever(xhrType);
      }
    });
  }
  async withCachedTask(request, action) {
    if (request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS") {
      return await action();
    }
    if (!this.tasks.has(request.method, request.path)) {
      this.tasks.add(request.method, request.path, action().finally(() => this.tasks.delete(request.method, request.path)));
    }
    return this.tasks.get(request.method, request.path);
  }
  sendNothingGetNothing(request) {
    return this.withCachedTask(request, async () => {
      const xhr = new XMLHttpRequest();
      const download = trackProgress(`requesting: ${request.path}`, xhr, xhr, null, true);
      sendRequest(xhr, request.method, request.path, request.timeout, request.headers);
      await download;
      return await this.readResponseHeaders(request.path, xhr);
    });
  }
  sendNothingGetSomething(xhrType, request, progress) {
    return this.withCachedTask(request, async () => {
      let response = null;
      const useCache = request.useCache && request.method === "GET";
      if (useCache) {
        if (isDefined(progress)) {
          progress.start();
        }
        await this.cacheReady;
        response = await this.store.get(request.path);
      }
      const noCachedResponse = isNullOrUndefined(response);
      if (noCachedResponse) {
        const xhr = new XMLHttpRequest();
        const download = trackProgress(`requesting: ${request.path}`, xhr, xhr, progress, true);
        sendRequest(xhr, request.method, request.path, request.timeout, request.headers);
        await download;
        response = await this.readResponse(request.path, xhr);
        if (useCache) {
          await this.store.add(response);
        }
      }
      const value = await this.decodeContent(xhrType, response);
      if (noCachedResponse && isDefined(progress)) {
        progress.end();
      }
      return value;
    });
  }
  async sendSomethingGetSomething(xhrType, request, defaultPostHeaders, progress) {
    let body = null;
    const headers = mapJoin(/* @__PURE__ */ new Map(), defaultPostHeaders, request.headers);
    if (request.body instanceof FormData && isDefined(headers)) {
      const toDelete = new Array();
      for (const key of headers.keys()) {
        if (key.toLowerCase() === "content-type") {
          toDelete.push(key);
        }
      }
      for (const key of toDelete) {
        headers.delete(key);
      }
    }
    if (isXHRBodyInit(request.body) && !isString(request.body)) {
      body = request.body;
    } else if (isDefined(request.body)) {
      body = JSON.stringify(request.body);
    }
    const progs = progressSplit(progress, 2);
    const xhr = new XMLHttpRequest();
    const upload = isDefined(body) ? trackProgress("uploading", xhr, xhr.upload, progs.shift(), false) : Promise.resolve();
    const downloadProg = progs.shift();
    const download = trackProgress("saving", xhr, xhr, downloadProg, true, upload);
    sendRequest(xhr, request.method, request.path, request.timeout, headers, body);
    await upload;
    await download;
    const response = await this.readResponse(request.path, xhr);
    return await this.decodeContent(xhrType, response);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/FetchingServicePool.ts
var FetchingServicePool = class extends WorkerPool {
  constructor(options, fetcher) {
    super(options, FetchingServiceClient);
    this.fetcher = fetcher;
  }
  getFetcher(obj2) {
    if (obj2 instanceof FormData) {
      return this.fetcher;
    } else {
      return this.nextWorker();
    }
  }
  setRequestVerificationToken(value) {
    this.fetcher.setRequestVerificationToken(value);
    for (const worker of this.workers) {
      worker.setRequestVerificationToken(value);
    }
  }
  async clearCache() {
    await Promise.all(this.workers.map((w) => w.clearCache()));
  }
  sendNothingGetNothing(request) {
    return this.nextWorker().sendNothingGetNothing(request);
  }
  sendNothingGetBlob(request, progress) {
    return this.nextWorker().sendNothingGetBlob(request, progress);
  }
  sendNothingGetBuffer(request, progress) {
    return this.nextWorker().sendNothingGetBuffer(request, progress);
  }
  sendNothingGetFile(request, progress) {
    return this.nextWorker().sendNothingGetFile(request, progress);
  }
  sendNothingGetText(request, progress) {
    return this.nextWorker().sendNothingGetText(request, progress);
  }
  sendNothingGetObject(request, progress) {
    return this.nextWorker().sendNothingGetObject(request, progress);
  }
  sendNothingGetXml(request, progress) {
    return this.nextWorker().sendNothingGetXml(request, progress);
  }
  sendNothingGetImageBitmap(request, progress) {
    return this.nextWorker().sendNothingGetImageBitmap(request, progress);
  }
  drawImageToCanvas(request, canvas, progress) {
    return this.nextWorker().drawImageToCanvas(request, canvas, progress);
  }
  sendObjectGetBlob(request, progress) {
    return this.getFetcher(request.body).sendObjectGetBlob(request, progress);
  }
  sendObjectGetBuffer(request, progress) {
    return this.getFetcher(request.body).sendObjectGetBuffer(request, progress);
  }
  sendObjectGetFile(request, progress) {
    return this.getFetcher(request.body).sendObjectGetFile(request, progress);
  }
  sendObjectGetText(request, progress) {
    return this.getFetcher(request.body).sendObjectGetText(request, progress);
  }
  sendObjectGetNothing(request, progress) {
    return this.getFetcher(request.body).sendObjectGetNothing(request, progress);
  }
  sendObjectGetObject(request, progress) {
    return this.getFetcher(request.body).sendObjectGetObject(request, progress);
  }
  sendObjectGetXml(request, progress) {
    return this.getFetcher(request.body).sendObjectGetXml(request, progress);
  }
  sendObjectGetImageBitmap(request, progress) {
    return this.getFetcher(request.body).sendObjectGetImageBitmap(request, progress);
  }
};

// src/isDebug.ts
var url = /* @__PURE__ */ new URL(globalThis.location.href);
var isDebug = !url.searchParams.has("RELEASE");
var JS_EXT = isDebug ? ".js" : ".min.js";

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/fonts.ts
var DEFAULT_TEST_TEXT = "The quick brown fox jumps over the lazy dog";
var loadedFonts = singleton("juniper::loadedFonts", () => []);
function makeFont(style) {
  const fontParts = [];
  if (style.fontStyle && style.fontStyle !== "normal") {
    fontParts.push(style.fontStyle);
  }
  if (style.fontVariant && style.fontVariant !== "normal") {
    fontParts.push(style.fontVariant);
  }
  if (style.fontWeight && style.fontWeight !== "normal") {
    fontParts.push(style.fontWeight);
  }
  fontParts.push(`${style.fontSize}px`);
  fontParts.push(style.fontFamily);
  return fontParts.join(" ");
}
async function loadFont(font, testString = null, prog) {
  if (!isString(font)) {
    font = makeFont(font);
  }
  if (loadedFonts.indexOf(font) === -1) {
    testString = testString || DEFAULT_TEST_TEXT;
    if (prog) {
      prog.start(font);
    }
    const fonts = await document.fonts.load(font, testString);
    if (prog) {
      prog.end(font);
    }
    if (fonts.length === 0) {
      console.warn(`Failed to load font "${font}". If this is a system font, just set the object's \`value\` property, instead of calling \`loadFontAndSetText\`.`);
    } else {
      loadedFonts.push(font);
    }
  }
}

// src/settings.ts
var version = true ? stringRandom(10) : pkgVersion;
var defaultAvatarHeight = 1.75;
var enableFullResolution = false;
var defaultFont = {
  fontFamily: "Segoe UI",
  fontSize: 20
};
var emojiFont = {
  fontFamily: "Segoe UI Emoji",
  fontSize: 20
};
async function loadFonts() {
  await Promise.all([
    loadFont(emojiFont)
  ]);
}
function getUIImagePaths() {
  const imageNames = new PriorityList([
    ["arrow", "arrow-up"],
    ["arrow", "arrow-down"],
    ["arrow", "arrow-left"],
    ["arrow", "arrow-right"],
    ["chat", "user"],
    ["chat", "chat"],
    ["ui", "menu"],
    ["ui", "settings"],
    ["ui", "quit"],
    ["ui", "lobby"],
    ["zoom", "zoom-in"],
    ["zoom", "zoom-out"],
    ["environment-audio", "environment-audio-mute"],
    ["environment-audio", "environment-audio-unmute"],
    ["headphones", "headphones-unmuted"],
    ["headphones", "headphones-muted"],
    ["microphone", "microphone-mute"],
    ["microphone", "microphone-unmute"],
    ["volume", "volume-muted"],
    ["volume", "volume-low"],
    ["volume", "volume-medium"],
    ["volume", "volume-high"],
    ["media", "media-pause"],
    ["media", "media-play"],
    ["media", "media-stop"],
    ["media", "media-replay"],
    ["ar", "ar-enter"],
    ["ar", "ar-exit"],
    ["vr", "vr-enter"],
    ["vr", "vr-exit"],
    ["fullscreen", "fullscreen-enter"],
    ["fullscreen", "fullscreen-exit"]
  ]);
  const uiImagePaths = new PriorityMap();
  for (const [setName, iconNames] of imageNames.entries()) {
    for (const iconName of iconNames) {
      uiImagePaths.add(setName, iconName.replace(setName + "-", ""), `/img/ui/${iconName}.png`);
    }
  }
  return uiImagePaths;
}

// src/createFetcher.ts
function createFetcher(enableWorkers = true) {
  let fallback = new FetchingService(new FetchingServiceImplXHR());
  if (enableWorkers) {
    fallback = new FetchingServicePool({
      scriptPath: `/js/fetcher-worker/index${JS_EXT}?${version}`
    }, fallback);
  }
  return new Fetcher(fallback, !isDebug);
}

// src/createTestEnvironment.ts
async function createTestEnvironment(debug = true) {
  const canvas = Canvas(id("frontBuffer"));
  document.body.append(Div(id("appContainer"), canvas));
  await loadFonts();
  const fetcher = createFetcher(!debug);
  const JS_EXT2 = debug ? ".js" : ".min.js";
  const { default: EnvironmentConstructor } = await fetcher.get(`/js/environment/index${JS_EXT2}`).useCache(!debug).module();
  const env = new EnvironmentConstructor(canvas, fetcher, defaultFont.fontFamily, getUIImagePaths(), defaultAvatarHeight, enableFullResolution, {
    DEBUG: debug
  });
  if (debug) {
    const MAX_IMAGE_SIZE = toBytes(200, "KiB");
    window.addEventListener("keypress", async (evt) => {
      if (evt.key === "`") {
        env.drawSnapshot();
        const canv = env.renderer.domElement;
        const aspectRatio = canv.width / canv.height;
        let width = 640;
        let height = 480;
        if (aspectRatio >= 1) {
          width = height * aspectRatio;
        } else {
          height = width / aspectRatio;
        }
        const canvResize = createUICanvas(width, height);
        const gResize = canvResize.getContext("2d", { alpha: false, desynchronized: true });
        gResize.drawImage(canv, 0, 0, canv.width, canv.height, 0, 0, canvResize.width, canvResize.height);
        let blob = null;
        for (let quality = 1; quality >= 0.05; quality -= 0.05) {
          blob = await canvasToBlob(canvResize, Image_Jpeg.value, quality);
          if (blob.size <= MAX_IMAGE_SIZE) {
            break;
          }
        }
        if (isNullOrUndefined(blob)) {
          console.error("No image");
        } else {
          if (blob.size > MAX_IMAGE_SIZE) {
            console.warn("Image was pretty big");
          }
          const form = new FormData();
          form.append("File", blob, "thumbnail.jpg");
          await fetcher.post(location.href).body(form).exec();
        }
      }
    });
  }
  return env;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/AssetGltfModel.ts
var AssetGltfModel = class extends BaseFetchedAsset {
  constructor(env, path, type2, useCache) {
    if (!Model_Gltf_Binary.matches(type2) && !Model_Gltf_Json.matches(type2)) {
      throw new Error("Only GLTF model types are currently supported");
    }
    super(path, type2, useCache);
    this.env = env;
  }
  async getResponse(request) {
    const response = await request.file();
    return translateResponse(response, (file) => this.env.loadGltf(file));
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/typeChecks.ts
function isMesh(obj2) {
  return isDefined(obj2) && obj2.isMesh;
}
function isObject3D(obj2) {
  return isDefined(obj2) && obj2.isObject3D;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/objects.ts
function isErsatzObject(obj2) {
  return isDefined(obj2) && isObject3D(obj2.object);
}
function objectResolve(obj2) {
  if (isErsatzObject(obj2)) {
    return obj2.object;
  }
  return obj2;
}
function objGraph(obj2, ...children) {
  const toAdd = children.filter(isDefined).map(objectResolve);
  if (toAdd.length > 0) {
    objectResolve(obj2).add(...toAdd);
  }
  return obj2;
}
function obj(name, ...rest) {
  const obj2 = new THREE.Object3D();
  obj2.name = name;
  objGraph(obj2, ...rest);
  return obj2;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/eventSystem/RayTarget.ts
var RAY_TARGET_KEY = "Juniper:ThreeJS:EventSystem:RayTarget";
var RayTarget = class extends TypedEventBase {
  constructor(object) {
    super();
    this.object = object;
    this.meshes = new Array();
    this._disabled = false;
    this._clickable = false;
    this._draggable = false;
    this._navigable = false;
    this.object.userData[RAY_TARGET_KEY] = this;
  }
  addMesh(mesh) {
    mesh.userData[RAY_TARGET_KEY] = this;
    this.meshes.push(mesh);
    return this;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(v) {
    this._disabled = v;
  }
  get enabled() {
    return !this.disabled;
  }
  set enabled(v) {
    this.disabled = !v;
  }
  get clickable() {
    return this._clickable;
  }
  set clickable(v) {
    this._clickable = v;
  }
  get draggable() {
    return this._draggable;
  }
  set draggable(v) {
    this._draggable = v;
  }
  get navigable() {
    return this._navigable;
  }
  set navigable(v) {
    this._navigable = v;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/examples/lines/LineMaterial.js
THREE.UniformsLib.line = {
  worldUnits: { value: 1 },
  linewidth: { value: 1 },
  resolution: { value: new THREE.Vector2(1, 1) },
  dashOffset: { value: 0 },
  dashScale: { value: 1 },
  dashSize: { value: 1 },
  gapSize: { value: 1 }
};
THREE.ShaderLib["line"] = {
  uniforms: THREE.UniformsUtils.merge([
    THREE.UniformsLib.common,
    THREE.UniformsLib.fog,
    THREE.UniformsLib.line
  ]),
  vertexShader: `
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				// get the offset direction as perpendicular to the view vector
				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 offset;
				if ( position.y < 0.5 ) {

					offset = normalize( cross( start.xyz, worldDir ) );

				} else {

					offset = normalize( cross( end.xyz, worldDir ) );

				}

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// extend the line bounds to encompass  endcaps
					start.xyz += - worldDir * linewidth * 0.5;
					end.xyz += worldDir * linewidth * 0.5;

					// shift the position of the quad so it hugs the forward edge of the line
					offset.xy -= dir * forwardOffset;
					offset.z += 0.5;

				#endif

				// endcaps
				if ( position.y > 1.0 || position.y < 0.0 ) {

					offset.xy += dir * 2.0 * forwardOffset;

				}

				// adjust for linewidth
				offset *= linewidth * 0.5;

				// set the world position
				worldPos = ( position.y < 0.5 ) ? start : end;
				worldPos.xyz += offset;

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segements overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,
  fragmentShader: `
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`
};
var LineMaterial = class extends THREE.ShaderMaterial {
  constructor(parameters) {
    super({
      type: "LineMaterial",
      uniforms: THREE.UniformsUtils.clone(THREE.ShaderLib["line"].uniforms),
      vertexShader: THREE.ShaderLib["line"].vertexShader,
      fragmentShader: THREE.ShaderLib["line"].fragmentShader,
      clipping: true
    });
    Object.defineProperties(this, {
      color: {
        enumerable: true,
        get: function() {
          return this.uniforms.diffuse.value;
        },
        set: function(value) {
          this.uniforms.diffuse.value = value;
        }
      },
      worldUnits: {
        enumerable: true,
        get: function() {
          return "WORLD_UNITS" in this.defines;
        },
        set: function(value) {
          if (value === true) {
            this.defines.WORLD_UNITS = "";
          } else {
            delete this.defines.WORLD_UNITS;
          }
        }
      },
      linewidth: {
        enumerable: true,
        get: function() {
          return this.uniforms.linewidth.value;
        },
        set: function(value) {
          this.uniforms.linewidth.value = value;
        }
      },
      dashed: {
        enumerable: true,
        get: function() {
          return Boolean("USE_DASH" in this.defines);
        },
        set(value) {
          if (Boolean(value) !== Boolean("USE_DASH" in this.defines)) {
            this.needsUpdate = true;
          }
          if (value === true) {
            this.defines.USE_DASH = "";
          } else {
            delete this.defines.USE_DASH;
          }
        }
      },
      dashScale: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashScale.value;
        },
        set: function(value) {
          this.uniforms.dashScale.value = value;
        }
      },
      dashSize: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashSize.value;
        },
        set: function(value) {
          this.uniforms.dashSize.value = value;
        }
      },
      dashOffset: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashOffset.value;
        },
        set: function(value) {
          this.uniforms.dashOffset.value = value;
        }
      },
      gapSize: {
        enumerable: true,
        get: function() {
          return this.uniforms.gapSize.value;
        },
        set: function(value) {
          this.uniforms.gapSize.value = value;
        }
      },
      opacity: {
        enumerable: true,
        get: function() {
          return this.uniforms.opacity.value;
        },
        set: function(value) {
          this.uniforms.opacity.value = value;
        }
      },
      resolution: {
        enumerable: true,
        get: function() {
          return this.uniforms.resolution.value;
        },
        set: function(value) {
          this.uniforms.resolution.value.copy(value);
        }
      },
      alphaToCoverage: {
        enumerable: true,
        get: function() {
          return Boolean("USE_ALPHA_TO_COVERAGE" in this.defines);
        },
        set: function(value) {
          if (Boolean(value) !== Boolean("USE_ALPHA_TO_COVERAGE" in this.defines)) {
            this.needsUpdate = true;
          }
          if (value === true) {
            this.defines.USE_ALPHA_TO_COVERAGE = "";
            this.extensions.derivatives = true;
          } else {
            delete this.defines.USE_ALPHA_TO_COVERAGE;
            this.extensions.derivatives = false;
          }
        }
      }
    });
    this.setValues(parameters);
  }
};
LineMaterial.prototype.isLineMaterial = true;

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/materials.ts
var materials = singleton("Juniper:Three:Materials", () => /* @__PURE__ */ new Map());
function materialStandardToBasic(oldMat) {
  if (oldMat.type !== "MeshStandardMaterial") {
    throw new Error("Input material is not MeshStandardMaterial");
  }
  const params = {
    alphaMap: oldMat.alphaMap,
    alphaTest: oldMat.alphaTest,
    alphaToCoverage: oldMat.alphaToCoverage,
    aoMap: oldMat.aoMap,
    aoMapIntensity: oldMat.aoMapIntensity,
    blendDst: oldMat.blendDst,
    blendDstAlpha: oldMat.blendDstAlpha,
    blendEquation: oldMat.blendEquation,
    blendEquationAlpha: oldMat.blendEquationAlpha,
    blending: oldMat.blending,
    blendSrc: oldMat.blendSrc,
    blendSrcAlpha: oldMat.blendSrcAlpha,
    clipIntersection: oldMat.clipIntersection,
    clippingPlanes: oldMat.clippingPlanes,
    clipShadows: oldMat.clipShadows,
    color: oldMat.color,
    colorWrite: oldMat.colorWrite,
    depthFunc: oldMat.depthFunc,
    depthTest: oldMat.depthTest,
    depthWrite: oldMat.depthWrite,
    dithering: oldMat.dithering,
    envMap: oldMat.envMap,
    fog: oldMat.fog,
    lightMap: oldMat.lightMap,
    lightMapIntensity: oldMat.lightMapIntensity,
    map: oldMat.emissiveMap || oldMat.map,
    name: oldMat.name + "-Standard-To-Basic",
    opacity: oldMat.opacity,
    polygonOffset: oldMat.polygonOffset,
    polygonOffsetFactor: oldMat.polygonOffsetFactor,
    polygonOffsetUnits: oldMat.polygonOffsetUnits,
    precision: oldMat.precision,
    premultipliedAlpha: oldMat.premultipliedAlpha,
    shadowSide: oldMat.shadowSide,
    side: oldMat.side,
    stencilFail: oldMat.stencilFail,
    stencilFunc: oldMat.stencilFunc,
    stencilFuncMask: oldMat.stencilFuncMask,
    stencilRef: oldMat.stencilRef,
    stencilWrite: oldMat.stencilWrite,
    stencilWriteMask: oldMat.stencilWriteMask,
    stencilZFail: oldMat.stencilZFail,
    stencilZPass: oldMat.stencilZPass,
    toneMapped: oldMat.toneMapped,
    transparent: oldMat.transparent,
    userData: oldMat.userData,
    vertexColors: oldMat.vertexColors,
    visible: oldMat.visible,
    wireframe: oldMat.wireframe,
    wireframeLinecap: oldMat.wireframeLinecap,
    wireframeLinejoin: oldMat.wireframeLinejoin,
    wireframeLinewidth: oldMat.wireframeLinewidth
  };
  for (const [key, value] of Object.entries(params)) {
    if (isNullOrUndefined(value)) {
      delete params[key];
    }
  }
  return new THREE.MeshBasicMaterial(params);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/objectScan.ts
function objectScan(obj2, test) {
  const queue = [obj2];
  while (queue.length > 0) {
    const here = queue.shift();
    if (test(here)) {
      return here;
    }
    if (here.children.length > 0) {
      queue.push(...here.children);
    }
  }
  return null;
}

// src/forest-app/Forest.ts
function isMeshNamed(name) {
  return (obj2) => isMesh(obj2) && obj2.name === name;
}
var Forest = class {
  constructor(env) {
    this.env = env;
    this.assets = [
      this.skybox = new AssetImage("/skyboxes/BearfenceMountain.jpeg", Image_Jpeg, !isDebug),
      this.forest = new AssetGltfModel(this.env, "/models/Forest-Ground.glb", Model_Gltf_Binary, !isDebug),
      this.bgAudio = new AssetAudio("/audio/forest.mp3", Audio_Mpeg, !isDebug),
      this.tree = new AssetGltfModel(this.env, "/models/Forest-Tree.glb", Model_Gltf_Binary, !isDebug)
    ];
    this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0.1, 100);
    this.hits = new Array();
    Promise.all(this.assets).then(() => this.finish());
  }
  get ground() {
    return this._ground;
  }
  get water() {
    return this._water;
  }
  get trees() {
    return this._trees;
  }
  convertMesh(oldMesh) {
    const oldMat = oldMesh.material;
    const newMat = materialStandardToBasic(oldMesh.material);
    if (newMat === oldMat) {
      return oldMesh;
    }
    const newMesh = oldMesh;
    newMesh.material = newMat;
    oldMat.dispose();
    return newMesh;
  }
  finish() {
    this.env.skybox.setImage("forest", this.skybox.result);
    const clip = this.env.audio.createClip("forest", this.bgAudio.result, true, true, true, 1, []);
    this.env.addEventListener("environmentaudiotoggled", () => {
      if (this.env.environmentAudioMuted) {
        clip.stop();
      } else {
        clip.play();
      }
    });
    this.env.audio.setClipPosition("forest", 25, 5, 25);
    this.env.foreground.add(this.forest.result.scene);
    this.forest.result.scene.updateMatrixWorld();
    this.raycaster.camera = this.env.camera;
    const ground = objectScan(this.forest.result.scene, isMeshNamed("Ground"));
    this._ground = this.convertMesh(ground);
    this.navMesh = new RayTarget(this._ground);
    this.navMesh.addMesh(this._ground);
    this.navMesh.navigable = true;
    this.navMesh.addEventListener("click", async (evt) => {
      if (evt.pointer.canTeleport) {
        this.env.audio.playClip("footsteps");
        await this.env.fadeOut();
        this.env.avatar.stage.position.copy(evt.hit.point);
        this.env.avatar.stage.position.y += defaultAvatarHeight;
        await this.env.fadeIn();
      }
    });
    this.env.timer.addTickHandler(() => {
      const groundHit = this.groundTest(this.env.avatar.worldPos);
      if (groundHit) {
        this.env.avatar.stage.position.y = groundHit.point.y;
      }
    });
    const water = objectScan(this.forest.result.scene, isMeshNamed("Water"));
    this._water = this.convertMesh(water);
    const matrices = this.makeTrees();
    const treeMesh = objectScan(this.tree.result.scene, isMesh);
    const treeGeom = treeMesh.geometry;
    const treeMat = materialStandardToBasic(treeMesh.material);
    this._trees = new THREE.InstancedMesh(treeGeom, treeMat, matrices.length);
    for (let i = 0; i < matrices.length; ++i) {
      this._trees.setMatrixAt(i, matrices[i]);
    }
    this.env.foreground.add(this._trees);
  }
  makeTrees() {
    const matrices = new Array();
    const q = new THREE.Quaternion();
    const right = new THREE.Vector3(1, 0, 0);
    const p = new THREE.Vector3();
    const q2 = new THREE.Quaternion().setFromAxisAngle(right, Math.PI / 2);
    const up = new THREE.Vector3(0, 1, 0);
    const s = new THREE.Vector3();
    for (let dz = -25; dz <= 25; ++dz) {
      for (let dx = -25; dx <= 25; ++dx) {
        if ((dx !== 0 || dx !== 0) && Math.random() <= 0.02) {
          const x = Math.random() * 0.1 + dx;
          const z = Math.random() * 0.1 + dz;
          p.set(x, 0, z);
          const groundHit = this.groundTest(p);
          if (groundHit) {
            const w = THREE.MathUtils.randFloat(0.6, 1.3);
            const h = THREE.MathUtils.randFloat(0.6, 1.3);
            s.set(w, h, w);
            const a = THREE.MathUtils.randFloat(0, 2 * Math.PI);
            const m = new THREE.Matrix4().compose(groundHit.point, q.setFromAxisAngle(up, a).multiply(q2), s);
            matrices.push(m);
          }
        }
      }
    }
    return matrices;
  }
  groundTest(p) {
    this.raycaster.ray.origin.copy(p);
    this.raycaster.ray.origin.y += 10;
    this.raycaster.intersectObject(this.ground, true, this.hits);
    const groundHit = arrayScan(this.hits, isDefined);
    arrayClear(this.hits);
    return groundHit;
  }
};

// src/grass-app/makeGrass.ts
function makeGrass(env, spatter) {
  const grassGeom = new THREE.PlaneBufferGeometry(5, 5, 1, 1);
  const grassTex = new THREE.CanvasTexture(spatter);
  const grassMat = new THREE.MeshBasicMaterial({
    map: grassTex,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide
  });
  const grass = new THREE.InstancedMesh(grassGeom, grassMat, 25);
  const dummy = obj("Dummy");
  dummy.rotation.set(Math.PI / 2, 0, 0);
  for (let i = 0; i < grass.count; ++i) {
    dummy.position.set(0, i / (5 * grass.count), 0);
    dummy.updateMatrix();
    grass.setMatrixAt(i, dummy.matrix);
    grass.setColorAt(i, new THREE.Color(0.25, 0.25 + i / (2 * grass.count), 0));
  }
  env.foreground.add(grass);
  env.timer.addTickHandler((evt) => {
    for (let i = 0; i < grass.count; ++i) {
      dummy.position.set(0.08 + 0.05 * Math.cos(evt.t / 1e3) * i / grass.count, i / (5 * grass.count), 0);
      dummy.updateMatrix();
      grass.setMatrixAt(i, dummy.matrix);
    }
    grass.instanceMatrix.needsUpdate = true;
  });
}

// src/forest-and-grass-app/index.ts
(async function() {
  const env = await createTestEnvironment();
  await env.fadeOut();
  const forest = new Forest(env);
  const spatter = new AssetImage("/img/spatter.png", Image_Png, !isDebug);
  await env.load(spatter, ...forest.assets);
  makeGrass(env, spatter.result);
  await env.fadeIn();
})();
//# sourceMappingURL=index.js.map