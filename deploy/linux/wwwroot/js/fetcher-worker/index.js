// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayCompare.ts
function arrayCompare(arr1, arr2) {
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }
  return -1;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/mapMap.ts
function mapMap(items, makeID, makeValue) {
  return new Map(items.map((item) => [makeID(item), makeValue(item)]));
}

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
function isArray(obj) {
  return obj instanceof Array;
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
function isArrayBufferView(obj) {
  return obj instanceof Uint8Array || obj instanceof Uint8ClampedArray || obj instanceof Int8Array || obj instanceof Uint16Array || obj instanceof Int16Array || obj instanceof Uint32Array || obj instanceof Int32Array || obj instanceof Float32Array || obj instanceof Float64Array || "BigUint64Array" in globalThis && obj instanceof globalThis["BigUint64Array"] || "BigInt64Array" in globalThis && obj instanceof globalThis["BigInt64Array"];
}
function isArrayBuffer(val) {
  return val && typeof ArrayBuffer !== "undefined" && (val instanceof ArrayBuffer || val.constructor && val.constructor.name === "ArrayBuffer");
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayClear.ts
function arrayClear(arr) {
  return arr.splice(0);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayRemoveAt.ts
function arrayRemoveAt(arr, idx) {
  return arr.splice(idx, 1)[0];
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/Exception.ts
var Exception = class extends Error {
  constructor(message, innerError = null) {
    super(message);
    this.innerError = innerError;
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/events/EventBase.ts
var EventBase = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
    this.listenerOptions = /* @__PURE__ */ new Map();
  }
  addEventListener(type, callback, options) {
    if (isFunction(callback)) {
      let listeners = this.listeners.get(type);
      if (!listeners) {
        listeners = new Array();
        this.listeners.set(type, listeners);
      }
      if (!listeners.find((c) => c === callback)) {
        listeners.push(callback);
        if (options) {
          this.listenerOptions.set(callback, options);
        }
      }
    }
  }
  removeEventListener(type, callback) {
    if (isFunction(callback)) {
      const listeners = this.listeners.get(type);
      if (listeners) {
        this.removeListener(listeners, callback);
      }
    }
  }
  clearEventListeners(type) {
    for (const [evtName, handlers] of this.listeners) {
      if (isNullOrUndefined(type) || type === evtName) {
        for (const handler of handlers) {
          this.removeEventListener(type, handler);
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
  addEventListener(type, callback, options) {
    super.addEventListener(type, callback, options);
  }
  removeEventListener(type, callback) {
    super.removeEventListener(type, callback);
  }
  clearEventListeners(type) {
    return super.clearEventListeners(type);
  }
  addScopedEventListener(scope, type, callback, options) {
    if (!this.scopes.has(scope)) {
      this.scopes.set(scope, []);
    }
    this.scopes.get(scope).push([type, callback]);
    this.addEventListener(type, callback, options);
  }
  removeScope(scope) {
    const listeners = this.scopes.get(scope);
    if (listeners) {
      this.scopes.delete(scope);
      for (const [type, listener] of listeners) {
        this.removeEventListener(type, listener);
      }
    }
  }
  dispatchEvent(evt) {
    if (!super.dispatchEvent(evt)) {
      return false;
    }
    if (!evt.cancelBubble) {
      for (const bubbler of this.bubblers) {
        if (!bubbler.dispatchEvent(evt)) {
          return false;
        }
      }
    }
    return true;
  }
};

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
function targetValidateEvent(target, type) {
  return "on" + type in target;
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/indexdb/index.ts
var IDexDB = class {
  constructor(db) {
    this.db = db;
  }
  static async getCurrentVersion(dbName) {
    if (isDefined(indexedDB.databases)) {
      const databases = await indexedDB.databases();
      for (const { name, version } of databases) {
        if (name === dbName) {
          return version;
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
    const indexesByName = new PriorityMap(
      storeDefs.filter((storeDef) => isDefined(storeDef.indexes)).flatMap((storeDef) => storeDef.indexes.map((indexDef) => [storeDef.name, indexDef.name, indexDef]))
    );
    const storesToAdd = new Array();
    const storesToRemove = new Array();
    const storesToChange = new Array();
    const indexesToAdd = new PriorityList();
    const indexesToRemove = new PriorityList();
    let version = await this.getCurrentVersion(name);
    if (isNullOrUndefined(version)) {
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
        ++version;
      }
    }
    const upgrading = new Task();
    const openRequest = isDefined(version) ? indexedDB.open(name, version) : indexedDB.open(name);
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
      const delta = end - this.start;
      const est = this.start - end + delta * this.weightTotal / soFar;
      this.prog.report(soFar, this.weightTotal, msg, est);
    }
  }
};

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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/using.ts
function interfaceSigCheck(obj, ...funcNames) {
  if (!isObject(obj)) {
    return false;
  }
  obj = obj;
  for (const funcName of funcNames) {
    if (!(funcName in obj)) {
      return false;
    }
    const func = obj[funcName];
    if (!isFunction(func)) {
      return false;
    }
  }
  return true;
}
function isDisposable(obj) {
  return interfaceSigCheck(obj, "dispose");
}
function isDestroyable(obj) {
  return interfaceSigCheck(obj, "destroy");
}
function isClosable(obj) {
  return interfaceSigCheck(obj, "close");
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/FetchingServiceImplXHR.ts
function isXHRBodyInit(obj) {
  return isString(obj) || isArrayBufferView(obj) || obj instanceof Blob || obj instanceof FormData || isArrayBuffer(obj) || "Document" in globalThis && obj instanceof Document;
}
function trackProgress(name, xhr, target, prog, skipLoading, prevTask) {
  let prevDone = !prevTask;
  if (prevTask) {
    prevTask.then(() => prevDone = true);
  }
  let done = false;
  let loaded = skipLoading;
  const requestComplete = new Task(
    () => loaded && done,
    () => prevDone
  );
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
        const text = await contentBlob.text();
        if (text.length > 0) {
          return JSON.parse(text);
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
      this.tasks.add(
        request.method,
        request.path,
        action().finally(() => this.tasks.delete(request.method, request.path))
      );
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
    return translateResponse(
      await this.sendNothingGetBlob(request, progress),
      URL.createObjectURL
    );
  }
  async sendObjectGetFile(request, progress) {
    return translateResponse(
      await this.sendObjectGetBlob(request, progress),
      URL.createObjectURL
    );
  }
  async sendNothingGetXml(request, progress) {
    return translateResponse(
      await this.impl.sendNothingGetSomething("document", request, progress),
      (doc) => doc.documentElement
    );
  }
  async sendObjectGetXml(request, progress) {
    return translateResponse(
      await this.impl.sendSomethingGetSomething("document", request, this.defaultPostHeaders, progress),
      (doc) => doc.documentElement
    );
  }
  async sendNothingGetImageBitmap(request, progress) {
    return translateResponse(
      await this.sendNothingGetBlob(request, progress),
      createImageBitmap
    );
  }
  async sendObjectGetImageBitmap(request, progress) {
    return translateResponse(
      await this.sendObjectGetBlob(request, progress),
      createImageBitmap
    );
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/FetchingServiceServer.ts
var FetchingServiceServer = class extends WorkerServer {
  constructor(self, impl) {
    super(self);
    const fetcher = new FetchingService(impl);
    addFetcherMethods(this, fetcher);
  }
};
function getContent(response) {
  return [response.content];
}
function addFetcherMethods(server, fetcher) {
  server.addVoidMethod(fetcher, "setRequestVerificationToken", fetcher.setRequestVerificationToken);
  server.addMethod(fetcher, "clearCache", fetcher.clearCache);
  server.addMethod(fetcher, "sendNothingGetNothing", fetcher.sendNothingGetNothing);
  server.addMethod(fetcher, "sendNothingGetBuffer", fetcher.sendNothingGetBuffer, getContent);
  server.addMethod(fetcher, "sendNothingGetImageBitmap", fetcher.sendNothingGetImageBitmap, getContent);
  server.addMethod(fetcher, "sendNothingGetObject", fetcher.sendNothingGetObject);
  server.addMethod(fetcher, "sendNothingGetFile", fetcher.sendNothingGetFile);
  server.addMethod(fetcher, "sendNothingGetText", fetcher.sendNothingGetText);
  server.addMethod(fetcher, "sendObjectGetNothing", fetcher.sendObjectGetNothing);
  server.addMethod(fetcher, "sendObjectGetImageBitmap", fetcher.sendObjectGetImageBitmap, getContent);
  server.addMethod(fetcher, "sendObjectGetBuffer", fetcher.sendObjectGetBuffer, getContent);
  server.addMethod(fetcher, "sendObjectGetObject", fetcher.sendObjectGetObject);
  server.addMethod(fetcher, "sendObjectGetFile", fetcher.sendObjectGetFile);
  server.addMethod(fetcher, "sendObjectGetText", fetcher.sendObjectGetText);
  server.addMethod(fetcher, "drawImageToCanvas", fetcher.drawImageToCanvas);
}

// src/fetcher-worker/index.ts
globalThis.server = new FetchingServiceServer(
  globalThis,
  new FetchingServiceImplXHR()
);
//# sourceMappingURL=index.js.map
