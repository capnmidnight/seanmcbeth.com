// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/typeChecks.js
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
  return val && typeof ArrayBuffer !== "undefined" && (val instanceof ArrayBuffer || // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
  val.constructor && val.constructor.name === "ArrayBuffer");
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/arrays.js
function arrayClear(arr) {
  return arr.splice(0);
}
function arrayCompare(arr1, arr2) {
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }
  return -1;
}
function arrayRemove(arr, value) {
  const idx = arr.indexOf(value);
  if (idx > -1) {
    arrayRemoveAt(arr, idx);
    return true;
  }
  return false;
}
function arrayRemoveAt(arr, idx) {
  return arr.splice(idx, 1)[0];
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/identity.js
function identity(item) {
  return item;
}
function alwaysTrue() {
  return true;
}
function alwaysFalse() {
  return false;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/mapMap.js
function mapMap(items, makeID, makeValue) {
  return new Map(items.map((item) => [makeID(item), makeValue(item)]));
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/makeLookup.js
function makeLookup(items, makeID) {
  return mapMap(items, makeID, identity);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/PriorityList.js
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
  add(key, ...values) {
    for (const value of values) {
      if (isNullOrUndefined(key)) {
        this.defaultItems.push(value);
      } else {
        let list = this.items.get(key);
        if (isNullOrUndefined(list)) {
          this.items.set(key, list = []);
        }
        list.push(value);
      }
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/PriorityMap.js
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
      const items = this.items.get(key1);
      const deleted = items.delete(key2);
      if (items.size === 0) {
        this.items.delete(key1);
      }
      return deleted;
    } else {
      return false;
    }
  }
  clear() {
    this.items.clear();
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/EventTarget.js
var CustomEventTarget = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
    this.listenerOptions = /* @__PURE__ */ new Map();
    this.bubblers = /* @__PURE__ */ new Set();
    this.scopes = /* @__PURE__ */ new WeakMap();
  }
  addBubbler(bubbler) {
    this.bubblers.add(bubbler);
  }
  removeBubbler(bubbler) {
    this.bubblers.delete(bubbler);
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
  addEventListener(type, callback, options) {
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
  removeEventListener(type, callback) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      this.removeListener(listeners, callback);
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
        if (isFunction(callback)) {
          callback.call(this, evt);
        } else {
          callback.handleEvent(evt);
        }
      }
    }
    if (evt.defaultPrevented) {
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/Task.js
var Task = class {
  /**
   * Create a new Task
   *
   * @param autoStart - set to false to require manually starting the Task. Useful
   * for reusable tasks that run on timers.
   */
  constructor(autoStart = true) {
    this.autoStart = autoStart;
    this.onThens = new Array();
    this.onCatches = new Array();
    this._result = void 0;
    this._error = void 0;
    this._executionState = "waiting";
    this._resultState = "none";
    this.resolve = (value) => {
      if (this.running) {
        this._result = value;
        this._resultState = "resolved";
        for (const thenner of this.onThens) {
          thenner(value);
        }
        this.clear();
        this._executionState = "finished";
      }
    };
    this.reject = (reason) => {
      if (this.running) {
        this._error = reason;
        this._resultState = "errored";
        for (const catcher of this.onCatches) {
          catcher(reason);
        }
        this.clear();
        this._executionState = "finished";
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
  /**
   * If the task was not auto-started, signal that the task is now ready to recieve
   * resolutions or rejections.
   **/
  start() {
    this._executionState = "running";
  }
  /**
   * Creates a resolving callback for a static value.
   * @param value
   */
  resolver(value) {
    return () => this.resolve(value);
  }
  resolveOn(target, resolveEvt, value) {
    const resolver = this.resolver(value);
    target.addEventListener(resolveEvt, resolver);
    this.finally(() => target.removeEventListener(resolveEvt, resolver));
  }
  /**
   * Get the last result that the task had resolved to, if any is available.
   *
   * If the Task had been rejected, attempting to get the result will rethrow
   * the error that had rejected the task.
   **/
  get result() {
    if (isDefined(this.error)) {
      throw this.error;
    }
    return this._result;
  }
  /**
   * Get the last error that the task had been rejected by, if any.
   **/
  get error() {
    return this._error;
  }
  /**
   * Get the current state of the task.
   **/
  get executionState() {
    return this._executionState;
  }
  /**
   * Returns true when the Task is hasn't started yet.
   **/
  get waiting() {
    return this.executionState === "waiting";
  }
  /**
   * Returns true when the Task is waiting to be resolved or rejected.
   **/
  get started() {
    return this.executionState !== "waiting";
  }
  /**
   * Returns true after the Task has started, but before it has finished.
   **/
  get running() {
    return this.executionState === "running";
  }
  /**
   * Returns true when the Task has been resolved or rejected.
   **/
  get finished() {
    return this.executionState === "finished";
  }
  get resultState() {
    return this._resultState;
  }
  /**
   * Returns true if the Task had been resolved successfully.
   **/
  get resolved() {
    return this.resultState === "resolved";
  }
  /**
   * Returns true if the Task had been rejected, regardless of any
   * reason being given.
   **/
  get errored() {
    return this.resultState === "errored";
  }
  get [Symbol.toStringTag]() {
    return this.toString();
  }
  /**
   * Calling Task.then(), Task.catch(), or Task.finally() creates a new Promise.
   * This method creates that promise and links it with the task.
   **/
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
  /**
   * Attach a handler to the task that fires when the task is resolved.
   *
   * @param onfulfilled
   * @param onrejected
   */
  then(onfulfilled, onrejected) {
    return this.project().then(onfulfilled, onrejected);
  }
  /**
   * Attach a handler that fires when the Task is rejected.
   *
   * @param onrejected
   */
  catch(onrejected) {
    return this.project().catch(onrejected);
  }
  /**
   * Attach a handler that fires regardless of whether the Task is resolved
   * or rejected.
   *
   * @param onfinally
   */
  finally(onfinally) {
    return this.project().finally(onfinally);
  }
  /**
   * Resets the Task to an unsignalled state, which is useful for
   * reducing GC pressure when working with lots of tasks.
   **/
  reset() {
    this._reset(this.autoStart);
  }
  restart() {
    this._reset(true);
  }
  _reset(start) {
    if (this.running) {
      this.reject("Resetting previous invocation");
    }
    this.clear();
    this._result = void 0;
    this._error = void 0;
    this._executionState = "waiting";
    this._resultState = "none";
    if (start) {
      this.start();
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/once.js
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
  if (!(target instanceof CustomEventTarget)) {
    if (!targetValidateEvent(target, resolveEvt)) {
      throw new Error(`Target does not have a ${resolveEvt} rejection event`);
    }
    for (const evt of rejectEvts) {
      if (!targetValidateEvent(target, evt)) {
        throw new Error(`Target does not have a ${evt} rejection event`);
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
  register(resolveEvt, (evt) => task.resolve(evt));
  const onReject = (evt) => task.reject(evt);
  for (const rejectEvt of rejectEvts) {
    register(rejectEvt, onReject);
  }
  return task;
}
function success(task) {
  return task.then(alwaysTrue).catch(alwaysFalse);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/using.js
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/indexdb/dist/index.js
var IDexDB = class _IDexDB {
  static delete(dbName) {
    const deleteRequest = indexedDB.deleteDatabase(dbName);
    const task = once(deleteRequest, "success", "error", "blocked");
    return success(task);
  }
  static async open(name, ...storeDefs) {
    const storesByName = makeLookup(storeDefs, (v) => v.name);
    const indexesByName = new PriorityMap(storeDefs.filter((storeDef) => isDefined(storeDef.indexes)).flatMap((storeDef) => storeDef.indexes.map((indexDef) => [storeDef.name, indexDef.name, indexDef])));
    const storesToAdd = new Array();
    const storesToRemove = new Array();
    const storesToChange = new Array();
    const indexesToAdd = new PriorityList();
    const indexesToRemove = new PriorityList();
    let version = null;
    const D = indexedDB.open(name);
    if (await success(once(D, "success", "error", "blocked"))) {
      const db = D.result;
      version = db.version;
      const storesToScrutinize = new Array();
      for (const storeName of db.objectStoreNames) {
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
          const storeDef = storesByName.get(storeName);
          if (isDefined(storeDef.options) && store.keyPath !== storeDef.options.keyPath) {
            storesToRemove.push(storeName);
            storesToAdd.push(storeName);
          }
          for (const indexName of store.indexNames) {
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
      dispose(db);
    } else {
      version = 0;
      storesToAdd.push(...storesByName.keys());
      for (const storeDef of storeDefs) {
        if (isDefined(storeDef.indexes)) {
          for (const indexDef of storeDef.indexes) {
            indexesToAdd.add(storeDef.name, indexDef.name);
          }
        }
      }
    }
    if (storesToAdd.length > 0 || storesToRemove.length > 0 || indexesToAdd.size > 0 || indexesToRemove.size > 0) {
      ++version;
    }
    const upgrading = new Task();
    const openRequest = isDefined(version) ? indexedDB.open(name, version) : indexedDB.open(name);
    const opening = once(openRequest, "success", "error", "blocked");
    const upgraded = success(upgrading);
    const opened = success(opening);
    const noUpgrade = upgrading.resolver(false);
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
    return new _IDexDB(openRequest.result);
  }
  constructor(db) {
    this.db = db;
  }
  dispose() {
    dispose(this.db);
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
  async has(query) {
    return await this.getCount(query) > 0;
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/mapJoin.js
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/sleep.js
var SleepTask = class extends Task {
  constructor(milliseconds) {
    super(false);
    this.milliseconds = milliseconds;
    this._timer = null;
  }
  start() {
    super.start();
    this._timer = setTimeout(() => {
      this._timer = null;
      this.resolve();
    }, this.milliseconds);
  }
  reset() {
    super.reset();
    if (isDefined(this._timer)) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
};
function sleep(milliseconds) {
  const task = new SleepTask(milliseconds);
  task.start();
  return task;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/withRetry.js
function withRetry(retryCount, action) {
  return async () => {
    let lastError = null;
    let retryTime = 500;
    for (let retry = 0; retry <= retryCount; ++retry) {
      try {
        if (retry > 0) {
          await sleep(retryTime);
          retryTime *= 2;
        }
        return await action();
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  };
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/TypedEventTarget.js
var TypedEventTarget = class extends CustomEventTarget {
  addBubbler(bubbler) {
    super.addBubbler(bubbler);
  }
  removeBubbler(bubbler) {
    super.removeBubbler(bubbler);
  }
  addScopedEventListener(scope, type, callback, options) {
    super.addScopedEventListener(scope, type, callback, options);
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
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/dist/BaseProgress.js
var BaseProgress = class extends TypedEventTarget {
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/dist/ChildProgressCallback.js
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/dist/BaseParentProgressCallback.js
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/dist/progressSplit.js
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/translateResponse.js
async function translateResponse(response, translate) {
  const { status, requestPath, responsePath, content, contentType, contentLength, fileName, headers, date } = response;
  return {
    status,
    requestPath,
    responsePath,
    content: isDefined(translate) ? await translate(content) : void 0,
    contentType,
    contentLength,
    fileName,
    headers,
    date
  };
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/dist/util.js
var typePattern = /([^\/]+)\/(.+)/;
var subTypePattern = /(?:([^\.]+)\.)?([^\+;]+)(?:\+([^;]+))?((?:; *([^=]+)=([^;]+))*)/;
var MediaType = class _MediaType {
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
    const type = match[1];
    const subType = match[2];
    return new _MediaType(type, subType);
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
    return new _MediaType(this.typeName, newSubType, this.extensions);
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
  toFileSystemAPIAccepts() {
    return {
      [this.value]: this.extensions.map((v) => "." + v)
    };
  }
  addExtension(fileName) {
    if (!fileName) {
      throw new Error("File name is not defined");
    }
    if (this.primaryExtension) {
      fileName = _MediaType.removeExtension(fileName);
      fileName = `${fileName}.${this.primaryExtension}`;
    }
    return fileName;
  }
  static removeExtension(fileName) {
    const idx = fileName.lastIndexOf(".");
    if (idx > -1) {
      fileName = fileName.substring(0, idx);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/dist/text.js
var text = /* @__PURE__ */ specialize("text");
var Text_Plain = /* @__PURE__ */ text("plain", "txt", "text", "conf", "def", "list", "log", "in");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/FetchingServiceImplXHR.js
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
  const requestComplete = new Task();
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
        if (done) {
          requestComplete.resolve();
        }
      }
    }
  });
  target.addEventListener("load", () => {
    if (prevDone && !done) {
      if (prog) {
        prog.end(name);
      }
      done = true;
      if (loaded) {
        requestComplete.resolve();
      }
    }
  });
  const onError = (msg) => () => {
    if (prevDone) {
      requestComplete.reject(`${msg} (${xhr.status})`);
    }
  };
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
      imageOrientation: "from-image"
    }), (img) => {
      canvas.width = img.width;
      canvas.height = img.height;
      const g = canvas.getContext("2d");
      g.drawImage(img, 0, 0);
      return translateResponse(response);
    });
  }
  async openCache() {
    const options = {
      keyPath: "requestPath"
    };
    this.cache = await IDexDB.open(DB_NAME, {
      name: "files",
      options
    });
    this.store = await this.cache.getStore("files");
  }
  async clearCache() {
    await this.cacheReady;
    await this.store.clear();
  }
  async evict(path) {
    await this.cacheReady;
    if (this.store.has(path)) {
      await this.store.delete(path);
    }
  }
  async readResponseHeaders(requestPath, xhr) {
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
      requestPath,
      responsePath: xhr.responseURL,
      content: void 0,
      contentType,
      contentLength,
      fileName,
      date,
      headers
    };
    return response;
  }
  async readResponse(requestPath, xhr) {
    const { responsePath, status, contentType, contentLength, fileName, date, headers } = await this.readResponseHeaders(requestPath, xhr);
    const response = {
      requestPath,
      responsePath,
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
    return this.withCachedTask(request, withRetry(request.retryCount, async () => {
      const xhr = new XMLHttpRequest();
      const download = trackProgress(`requesting: ${request.path}`, xhr, xhr, null, true);
      sendRequest(xhr, request.method, request.path, request.timeout, request.headers);
      await download;
      return await this.readResponseHeaders(request.path, xhr);
    }));
  }
  sendNothingGetSomething(xhrType, request, progress) {
    return this.withCachedTask(request, withRetry(request.retryCount, async () => {
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
    }));
  }
  sendSomethingGetSomething(xhrType, request, defaultPostHeaders, progress) {
    let body = null;
    const headers = mapJoin(/* @__PURE__ */ new Map(), defaultPostHeaders, request.headers);
    let contentType = null;
    if (isDefined(headers)) {
      const contentTypeHeaders = new Array();
      for (const key of headers.keys()) {
        if (key.toLowerCase() === "content-type") {
          contentTypeHeaders.push(key);
        }
      }
      if (contentTypeHeaders.length > 0) {
        if (!(request.body instanceof FormData)) {
          contentType = headers.get(contentTypeHeaders[0]);
          contentTypeHeaders.shift();
        }
        for (const key of contentTypeHeaders) {
          headers.delete(key);
        }
      }
    }
    if (isXHRBodyInit(request.body) && !isString(request.body) || isString(request.body) && Text_Plain.matches(contentType)) {
      body = request.body;
    } else if (isDefined(request.body)) {
      body = JSON.stringify(request.body);
    }
    const hasBody = isDefined(body);
    const progs = progressSplit(progress, hasBody ? 2 : 1);
    const [progUpload, progDownload] = progs;
    const query = async () => {
      const xhr = new XMLHttpRequest();
      const upload = hasBody ? trackProgress("uploading", xhr, xhr.upload, progUpload, false) : Promise.resolve();
      const download = trackProgress("saving", xhr, xhr, progDownload, true, upload);
      sendRequest(xhr, request.method, request.path, request.timeout, headers, body);
      await upload;
      await download;
      const response = await this.readResponse(request.path, xhr);
      return await this.decodeContent(xhrType, response);
    };
    return withRetry(request.retryCount, query)();
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/flags.js
var oculusBrowserPattern = /OculusBrowser\/(\d+)\.(\d+)\.(\d+)/i;
var oculusMatch = /* @__PURE__ */ navigator.userAgent.match(oculusBrowserPattern);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/workers/dist/WorkerServer.js
var WorkerServerProgress = class extends BaseProgress {
  constructor(server, taskID) {
    super();
    this.server = server;
    this.taskID = taskID;
  }
  /**
   * Report progress through long-running invocations. If your invocable
   * functions don't report progress, this can be safely ignored.
   * @param soFar - how much of the process we've gone through.
   * @param total - the total amount we need to go through.
   * @param msg - an optional message to include as part of the progress update.
   * @param est - an optional estimate of how many milliseconds are left in the progress.
   */
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
  /**
   * Creates a new worker thread method call listener.
   * @param self - the worker scope in which to listen.
   */
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
  /**
   * Report an error back to the calling thread.
   * @param taskID - the invocation ID of the method that errored.
   * @param errorMessage - what happened?
   */
  onError(taskID, errorMessage) {
    const message = {
      type: "error",
      taskID,
      errorMessage
    };
    this.postMessage(message);
  }
  /**
   * Return back to the client.
   * @param taskID - the invocation ID of the method that is returning.
   * @param returnValue - the (optional) value to return.
   * @param transferReturnValue - a mapping function to extract any Transferable objects from the return value.
   */
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
  /**
   * Registers a function call for cross-thread invocation.
   * @param methodName - the name of the function to use during invocations.
   * @param asyncFunc - the function to execute when the method is invoked.
   * @param transferReturnValue - an (optional) function that reports on which values in the `returnValue` should be transfered instead of copied.
   */
  addFunction(methodName, asyncFunc, transferReturnValue) {
    this.addMethodInternal(methodName, asyncFunc, transferReturnValue);
  }
  /**
   * Registers a function call for cross-thread invocation.
   * @param methodName - the name of the function to use during invocations.
   * @param asyncFunc - the function to execute when the method is invoked.
   */
  addVoidFunction(methodName, asyncFunc) {
    this.addMethodInternal(methodName, asyncFunc);
  }
  /**
   * Registers a class method call for cross-thread invocation.
   * @param obj - the object on which to find the method.
   * @param methodName - the name of the method to use during invocations.
   * @param transferReturnValue - an (optional) function that reports on which values in the `returnValue` should be transfered instead of copied.
   */
  addMethod(obj, methodName, method, transferReturnValue) {
    this.addFunction(methodName, method.bind(obj), transferReturnValue);
  }
  /**
   * Registers a class method call for cross-thread invocation.
   * @param methodName - the name of the method to use during invocations.
   * @param obj - the object on which to find the method.
   */
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/FetchingService.js
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
  evict(path) {
    return this.impl.evict(path);
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
  sendNothingGetObject(request, progress) {
    return this.impl.sendNothingGetSomething("json", request, progress);
  }
  sendObjectGetObject(request, progress) {
    return this.impl.sendSomethingGetSomething("json", request, this.defaultPostHeaders, progress);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/FetchingServiceServer.js
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
  server.addMethod(fetcher, "evict", fetcher.evict);
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

// workers/fetcher/index.ts
globalThis.server = new FetchingServiceServer(
  globalThis,
  new FetchingServiceImplXHR()
);
//# sourceMappingURL=index.js.map
