// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/typeChecks.js
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
function isBadNumber(num) {
  return isNullOrUndefined(num) || !Number.isFinite(num) || Number.isNaN(num);
}
function isGoodNumber(obj2) {
  return isNumber(obj2) && !isBadNumber(obj2);
}
function isObject(obj2) {
  return isDefined(obj2) && t(obj2, "object", Object);
}
function isArray(obj2) {
  return obj2 instanceof Array;
}
function isNullOrUndefined(obj2) {
  return obj2 === null || obj2 === void 0;
}
function isDefined(obj2) {
  return !isNullOrUndefined(obj2);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/arrays.js
function isIComparable(obj2) {
  return isObject(obj2) && "compareTo" in obj2 && isFunction(obj2.compareTo);
}
function compareBy(directionOrFirstKeyGetter, ...getKeys) {
  let direction = null;
  if (isString(directionOrFirstKeyGetter)) {
    direction = directionOrFirstKeyGetter;
  } else {
    direction = "ascending";
    getKeys.unshift(directionOrFirstKeyGetter);
  }
  const d = direction === "ascending" ? 1 : -1;
  const comparer = (a, b) => {
    if (a === b) {
      return 0;
    }
    for (const getKey of getKeys) {
      const keyA = isNullOrUndefined(a) ? null : getKey(a);
      const keyB = isNullOrUndefined(b) ? null : getKey(b);
      const relation = keyA === keyB ? 0 : isString(keyA) && isString(keyB) ? d * keyA.localeCompare(keyB) : isIComparable(keyA) && isIComparable(keyB) ? d * keyA.compareTo(keyB) : direction === "ascending" && keyA > keyB || direction === "descending" && keyA < keyB ? 1 : -1;
      if (relation !== 0) {
        return relation;
      }
    }
    return 0;
  };
  return Object.assign(comparer, {
    direction
  });
}
function binarySearch(arr, searchValue, comparer, mode = "search") {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = left + right >> 1;
    let relation = comparer(arr[mid], searchValue);
    if (relation === 0) {
      if (mode !== "search") {
        const scanDirection = mode === "append" ? 1 : -1;
        if (scanDirection > 0) {
          mid += scanDirection;
        }
        while (0 <= mid && mid < arr.length && (relation = comparer(arr[mid], searchValue)) === 0) {
          mid += scanDirection;
        }
        if (scanDirection < 0) {
          mid -= scanDirection;
        }
      }
      return mid;
    } else if (relation < 0) {
      left = mid - relation;
    } else {
      right = mid - relation;
    }
  }
  return -left - 1;
}
function insertSorted(arr, val, comparerOrIdx, mode = "search") {
  const allowDuplicates = mode !== "set";
  if (mode === "set") {
    mode = "search";
  }
  let idx = null;
  if (isNumber(comparerOrIdx)) {
    idx = comparerOrIdx;
  } else {
    idx = binarySearch(arr, val, comparerOrIdx, mode);
  }
  if (idx < 0) {
    idx = -idx - 1;
  } else if (!allowDuplicates) {
    return -1;
  }
  arrayInsertAt(arr, val, idx);
  return idx;
}
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
function arrayInsertAt(arr, item, idx) {
  arr.splice(idx, 0, item);
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
function arrayReplace(arr, ...items) {
  arr.splice(0, arr.length, ...items);
}
function _arrayScan(forward, arr, tests) {
  const start2 = forward ? 0 : arr.length - 1;
  const end2 = forward ? arr.length : -1;
  const inc = forward ? 1 : -1;
  for (const test of tests) {
    for (let i = start2; i != end2; i += inc) {
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/PriorityList.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/BaseGraphNode.js
function breadthFirstPeek(arr) {
  return arr[0];
}
function breadthFirstRemove(arr) {
  return arr.shift();
}
function depthFirstPeek(arr) {
  return arr[arr.length - 1];
}
function depthFirstRemove(arr) {
  return arr.pop();
}
var BaseGraphNode = class {
  constructor(value) {
    this.value = value;
    this._forward = new Array();
    this._reverse = new Array();
  }
  connectSorted(child, keySelector) {
    if (isDefined(keySelector)) {
      const comparer = compareBy((n) => keySelector(n.value));
      insertSorted(this._forward, child, comparer);
      insertSorted(child._reverse, this, comparer);
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
    const visited = /* @__PURE__ */ new Set();
    const queue = [this];
    while (queue.length > 0) {
      const here = queue.shift();
      if (isDefined(here) && !visited.has(here)) {
        visited.add(here);
        queue.push(...here._forward);
      }
    }
    return Array.from(visited);
  }
  *traverse(breadthFirst) {
    const visited = /* @__PURE__ */ new Set();
    const queue = [this];
    const peek = breadthFirst ? breadthFirstPeek : depthFirstPeek;
    const remove = breadthFirst ? breadthFirstRemove : depthFirstRemove;
    while (queue.length > 0) {
      const here = peek(queue);
      if (!visited.has(here)) {
        visited.add(here);
        if (breadthFirst) {
          remove(queue);
          yield here;
        }
        if (here._forward.length > 0) {
          queue.push(...here._forward);
        }
      } else if (!breadthFirst) {
        remove(queue);
        yield here;
      }
    }
  }
  breadthFirst() {
    return this.traverse(true);
  }
  depthFirst() {
    return this.traverse(false);
  }
  search(predicate, breadthFirst = true) {
    for (const node of this.traverse(breadthFirst)) {
      if (predicate(node)) {
        return node;
      }
    }
    return null;
  }
  *searchAll(predicate, breadthFirst = true) {
    for (const node of this.traverse(breadthFirst)) {
      if (predicate(node)) {
        yield node;
      }
    }
  }
  find(v, breadthFirst = true) {
    return this.search((n) => n.value === v, breadthFirst);
  }
  findAll(v, breadthFirst = true) {
    return this.searchAll((n) => n.value === v, breadthFirst);
  }
  contains(node, breadthFirst = true) {
    for (const child of this.traverse(breadthFirst)) {
      if (child === node) {
        return true;
      }
    }
    return false;
  }
  containsValue(v, breadthFirst = true) {
    for (const child of this.traverse(breadthFirst)) {
      if (child.value === v) {
        return true;
      }
    }
    return false;
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/identity.js
function identity(item) {
  return item;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/mapMap.js
function mapMap(items, makeID, makeValue) {
  return new Map(items.map((item) => [makeID(item), makeValue(item)]));
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/makeLookup.js
function makeLookup(items, makeID) {
  return mapMap(items, makeID, identity);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/TreeNode.js
function buildTree(items, getParent, _getOrder) {
  const getOrder = (v) => isDefined(v) && isDefined(_getOrder) && _getOrder(v);
  const rootNode = new TreeNode(null);
  const nodes = /* @__PURE__ */ new Map();
  for (const item of items) {
    const node = new TreeNode(item);
    nodes.set(item, node);
  }
  for (const node of nodes.values()) {
    const parent = getParent(node.value);
    const hasParentNode = parent != null && nodes.has(parent);
    const parentNode = hasParentNode ? nodes.get(parent) : rootNode;
    parentNode.connectSorted(node, getOrder);
  }
  return rootNode;
}
var TreeNode = class extends BaseGraphNode {
  get depth() {
    let counter = 0;
    let here = this.parent;
    while (isDefined(here)) {
      ++counter;
      here = here.parent;
    }
    return counter;
  }
  removeFromParent() {
    while (this.parent) {
      this.parent.disconnectFrom(this);
    }
  }
  connectTo(child) {
    child.removeFromParent();
    super.connectTo(child);
  }
  connectAt(child, index) {
    child.removeFromParent();
    super.connectAt(child, index);
  }
  connectSorted(child, sortKey) {
    child.removeFromParent();
    super.connectSorted(child, sortKey);
  }
  get parent() {
    if (this._reverse.length === 0) {
      return null;
    }
    return this._reverse[0];
  }
  get children() {
    return this._forward;
  }
  get isRoot() {
    return this._isEntryPoint;
  }
  get isChild() {
    return !this._isEntryPoint;
  }
  get isLeaf() {
    return this._isExitPoint;
  }
  get hasChildren() {
    return !this._isExitPoint;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/EventTarget.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/Task.js
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
  _reset(start2) {
    if (this.running) {
      this.reject("Resetting previous invocation");
    }
    this.clear();
    this._result = void 0;
    this._error = void 0;
    this._executionState = "waiting";
    this._resultState = "none";
    if (start2) {
      this.start();
    }
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/dist/util.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/dist/image.js
var image = /* @__PURE__ */ specialize("image");
var Image_Jpeg = /* @__PURE__ */ image("jpeg", "jpeg", "jpg", "jpe");
var Image_Png = /* @__PURE__ */ image("png", "png");

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/attrs.js
var warnings = /* @__PURE__ */ new Map();
var HtmlAttr = class {
  /**
   * Creates a new setter functor for HTML Attributes
   * @param key - the attribute name.
   * @param value - the value to set for the attribute.
   * @param bySetAttribute - whether the attribute should be set via the setAttribute method.
   * @param tags - the HTML tags that support this attribute.
   */
  constructor(key, value, bySetAttribute, ...tags) {
    this.key = key;
    this.value = value;
    this.bySetAttribute = bySetAttribute;
    this.tags = tags.map((t2) => t2.toLocaleUpperCase());
    Object.freeze(this);
  }
  /**
   * Set the attribute value on an HTMLElement
   * @param elem - the element on which to set the attribute.
   */
  applyToElement(elem) {
    if (this.tags.length > 0 && this.tags.indexOf(elem.tagName) === -1) {
      let set = warnings.get(elem.tagName);
      if (!set) {
        warnings.set(elem.tagName, set = /* @__PURE__ */ new Set());
      }
      if (!set.has(this.key)) {
        set.add(this.key);
        console.warn(`Element ${elem.tagName} does not support Attribute ${this.key}`);
      }
    }
    if (this.bySetAttribute) {
      elem.setAttribute(this.key, this.value.toString());
    } else if (this.key in elem) {
      elem[this.key] = this.value;
    } else if (this.value === false) {
      elem.removeAttribute(this.key);
    } else if (this.value === true) {
      elem.setAttribute(this.key, "");
    } else if (isFunction(this.value)) {
      this.value(elem);
    } else {
      elem.setAttribute(this.key, this.value.toString());
    }
  }
};
function attr(key, value, bySetAttribute, ...tags) {
  return new HtmlAttr(key, value, bySetAttribute, ...tags);
}
function isAttr(obj2) {
  return obj2 instanceof HtmlAttr;
}
function ClassList(...values) {
  values = values.filter(identity);
  return attr("CLASS_LIST", (element) => element.classList.add(...values), false);
}
function Height(value) {
  return attr("height", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}
function unpackURL(value) {
  if (value instanceof URL) {
    value = value.href;
  }
  return value;
}
function Src(value) {
  return attr("src", unpackURL(value), false, "audio", "embed", "iframe", "img", "input", "script", "source", "track", "video");
}
function Title_attr(value) {
  return attr("title", value, false);
}
function Type(value) {
  if (!isString(value)) {
    value = value.value;
  }
  return attr("type", value, false, "button", "input", "command", "embed", "link", "object", "script", "source", "style", "menu");
}
function Width(value) {
  return attr("width", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/css.js
function px(value) {
  return `${value}px`;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/tags.js
function isErsatzElement(obj2) {
  if (!isObject(obj2)) {
    return false;
  }
  const elem = obj2;
  return elem.element instanceof Element;
}
function resolveElement(elem) {
  if (isErsatzElement(elem)) {
    return elem.element;
  } else if (isString(elem)) {
    return getElement(elem);
  }
  return elem;
}
function isIElementAppliable(obj2) {
  return isObject(obj2) && "applyToElement" in obj2 && isFunction(obj2.applyToElement);
}
function elementSetDisplay(elem, visible, visibleDisplayType = "") {
  elem = resolveElement(elem);
  if (visible) {
    elem.style.removeProperty("display");
    const style = getComputedStyle(elem);
    if (style.display === "none") {
      elem.style.display = visibleDisplayType || "block";
    }
  } else {
    elem.style.display = "none";
  }
}
function elementIsDisplayed(elem) {
  elem = resolveElement(elem);
  return elem.style.display !== "none";
}
function HtmlRender(element, ...children) {
  const elem = element instanceof Element ? element : element instanceof ShadowRoot ? element : isString(element) ? document.querySelector(element) : element.element;
  const target = elem instanceof HTMLTemplateElement ? elem.content : elem;
  for (const child of children) {
    if (isDefined(child)) {
      if (child instanceof Node) {
        target.appendChild(child);
      } else if (isErsatzElement(child)) {
        target.appendChild(resolveElement(child));
      } else if (isIElementAppliable(child)) {
        if (!(elem instanceof ShadowRoot)) {
          child.applyToElement(elem);
        }
      } else {
        target.appendChild(document.createTextNode(child.toLocaleString()));
      }
    }
  }
  return elem;
}
function getElement(selector) {
  return document.querySelector(selector);
}
function HtmlTag(name2, ...rest) {
  let elem = null;
  const finders = rest.filter(isAttr).filter((v) => v.key === "id" || v.key === "query");
  for (const finder of finders) {
    if (finder.key === "query") {
      elem = finder.value;
      arrayRemove(rest, finder);
    } else if (finder.key === "id") {
      elem = document.getElementById(finder.value);
      if (elem) {
        arrayRemove(rest, finder);
      }
    }
  }
  if (elem && elem.tagName !== name2.toUpperCase()) {
    console.warn(`Expected a "${name2.toUpperCase()}" element but found a "${elem.tagName}".`);
  }
  if (!elem) {
    elem = document.createElement(name2);
  }
  HtmlRender(elem, ...rest);
  return elem;
}
function isDisableable(obj2) {
  return isObject(obj2) && "disabled" in obj2 && isBoolean(obj2.disabled);
}
function ButtonRaw(...rest) {
  return HtmlTag("button", ...rest);
}
function Button(...rest) {
  return ButtonRaw(...rest, Type("button"));
}
function ButtonPrimary(...rest) {
  return Button(...rest, ClassList("btn", "btn-primary"));
}
function Canvas(...rest) {
  return HtmlTag("canvas", ...rest);
}
function Img(...rest) {
  return HtmlTag("img", ...rest);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/TypedEventTarget.js
var TypedEvent = class extends Event {
  get type() {
    return super.type;
  }
  constructor(type, eventInitDict) {
    super(type, eventInitDict);
  }
};
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/assertSuccess.js
function assertSuccess(response) {
  if (response.status >= 400) {
    throw new Error("Resource could not be retrieved: " + response.requestPath);
  }
  return response;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/unwrapResponse.js
function unwrapResponse(response) {
  const { content } = assertSuccess(response);
  return content;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/dist/BaseProgress.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/dist/ChildProgressCallback.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/dist/BaseParentProgressCallback.js
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
      const end2 = performance.now();
      const delta = end2 - this.start;
      const est = this.start - end2 + delta * this.weightTotal / soFar;
      this.prog.report(soFar, this.weightTotal, msg, est);
    }
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/dist/progressSplit.js
function progressSplitWeighted(prog, subProgressWeights) {
  const subProg = new WeightedParentProgressCallback(subProgressWeights, prog);
  return subProg.subProgressCallbacks;
}
var WeightedParentProgressCallback = class extends BaseParentProgressCallback {
  constructor(subProgressWeights, prog) {
    super(prog);
    for (const weight of subProgressWeights) {
      this.addSubProgress(weight);
    }
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/dist/progressOfArray.js
function progressOfArray(prog, items, callback) {
  const weights = items.map(() => 1);
  const progs = progressSplitWeighted(prog, weights);
  return Promise.all(items.map(async (item, i) => {
    const prog2 = progs[i];
    prog2.start();
    const value = await callback(item, prog2, i);
    prog2.end();
    return value;
  }));
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/dist/progressTasks.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/using.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/canvas.js
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
function isImageBitmap(img) {
  return hasImageBitmap && img instanceof ImageBitmap;
}
function isImageData(img) {
  return img instanceof ImageData;
}
function isCanvas(obj2) {
  return isHTMLCanvas(obj2) || isOffscreenCanvas(obj2);
}
function drawImageBitmapToCanvas(canv, img) {
  const g = canv.getContext("2d");
  if (isNullOrUndefined(g)) {
    throw new Error("Could not create 2d context for canvas");
  }
  g.drawImage(img, 0, 0);
}
function drawImageDataToCanvas(canv, img) {
  const g = canv.getContext("2d");
  if (isNullOrUndefined(g)) {
    throw new Error("Could not create 2d context for canvas");
  }
  g.putImageData(img, 0, 0);
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
  return Canvas(Width(w), Height(h));
}
function createOffscreenCanvasFromImageBitmap(img) {
  const canv = createOffscreenCanvas(img.width, img.height);
  drawImageBitmapToCanvas(canv, img);
  return canv;
}
function createCanvasFromImageBitmap(img) {
  if (false) {
    throw new Error("HTML Canvas is not supported in workers");
  }
  const canv = createCanvas(img.width, img.height);
  drawImageBitmapToCanvas(canv, img);
  return canv;
}
var createUtilityCanvasFromImageBitmap = hasOffscreenCanvasRenderingContext2D && createOffscreenCanvasFromImageBitmap || hasHTMLCanvas && createCanvasFromImageBitmap || null;
function createOffscreenCanvasFromImageData(img) {
  const canv = createOffscreenCanvas(img.width, img.height);
  drawImageDataToCanvas(canv, img);
  return canv;
}
function createCanvasFromImageData(img) {
  if (false) {
    throw new Error("HTML Canvas is not supported in workers");
  }
  const canv = createCanvas(img.width, img.height);
  drawImageDataToCanvas(canv, img);
  return canv;
}
var createUtilityCanvasFromImageData = hasOffscreenCanvasRenderingContext2D && createOffscreenCanvasFromImageData || hasHTMLCanvas && createCanvasFromImageData || null;
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
  const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled, oldTextBaseline = ctx.textBaseline, oldTextAlign = ctx.textAlign, oldFont = ctx.font, resized = setCanvasSize(ctx.canvas, w, h, superscale);
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
    return setCanvasSize(ctx.canvas, w, h, superscale);
  }
}
function dispose2(val) {
  if (isCanvas(val)) {
    val.width = val.height = 0;
  } else {
    dispose(val);
  }
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/math.js
var Pi = Math.PI;
var HalfPi = 0.5 * Pi;
var Tau = 2 * Pi;
var TIME_MAX = 864e13;
var TIME_MIN = -TIME_MAX;
function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/graphics2d/dist/animation/tween.js
function bump(t2, k) {
  const a = t2 * Pi;
  return 0.5 * (1 - Math.cos(a)) - k * Math.sin(2 * a);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/singleton.js
function singleton(name2, create2) {
  const box = globalThis;
  let value = box[name2];
  if (isNullOrUndefined(value)) {
    if (isNullOrUndefined(create2)) {
      throw new Error(`No value ${name2} found`);
    }
    value = create2();
    box[name2] = value;
  }
  return value;
}

// global-externals:three
var { ACESFilmicToneMapping, AddEquation, AddOperation, AdditiveAnimationBlendMode, AdditiveBlending, AlphaFormat, AlwaysDepth, AlwaysStencilFunc, AmbientLight, AmbientLightProbe, AnimationClip, AnimationLoader, AnimationMixer, AnimationObjectGroup, AnimationUtils, ArcCurve, ArrayCamera, ArrowHelper, Audio, AudioAnalyser, AudioContext, AudioListener, AudioLoader, AxesHelper, BackSide, BasicDepthPacking, BasicShadowMap, Bone, BooleanKeyframeTrack, Box2, Box3, Box3Helper, BoxBufferGeometry, BoxGeometry, BoxHelper, BufferAttribute, BufferGeometry, BufferGeometryLoader, ByteType, Cache, Camera, CameraHelper, CanvasTexture, CapsuleBufferGeometry, CapsuleGeometry, CatmullRomCurve3, CineonToneMapping, CircleBufferGeometry, CircleGeometry, ClampToEdgeWrapping, Clock, Color, ColorKeyframeTrack, ColorManagement, CompressedArrayTexture, CompressedTexture, CompressedTextureLoader, ConeBufferGeometry, ConeGeometry, CubeCamera, CubeReflectionMapping, CubeRefractionMapping, CubeTexture, CubeTextureLoader, CubeUVReflectionMapping, CubicBezierCurve, CubicBezierCurve3, CubicInterpolant, CullFaceBack, CullFaceFront, CullFaceFrontBack, CullFaceNone, Curve, CurvePath, CustomBlending, CustomToneMapping, CylinderBufferGeometry, CylinderGeometry, Cylindrical, Data3DTexture, DataArrayTexture, DataTexture, DataTextureLoader, DataUtils, DecrementStencilOp, DecrementWrapStencilOp, DefaultLoadingManager, DepthFormat, DepthStencilFormat, DepthTexture, DirectionalLight, DirectionalLightHelper, DiscreteInterpolant, DisplayP3ColorSpace, DodecahedronBufferGeometry, DodecahedronGeometry, DoubleSide, DstAlphaFactor, DstColorFactor, DynamicCopyUsage, DynamicDrawUsage, DynamicReadUsage, EdgesGeometry, EllipseCurve, EqualDepth, EqualStencilFunc, EquirectangularReflectionMapping, EquirectangularRefractionMapping, Euler, EventDispatcher, ExtrudeBufferGeometry, ExtrudeGeometry, FileLoader, Float16BufferAttribute, Float32BufferAttribute, Float64BufferAttribute, FloatType, Fog, FogExp2, FramebufferTexture, FrontSide, Frustum, GLBufferAttribute, GLSL1, GLSL3, GreaterDepth, GreaterEqualDepth, GreaterEqualStencilFunc, GreaterStencilFunc, GridHelper, Group, HalfFloatType, HemisphereLight, HemisphereLightHelper, HemisphereLightProbe, IcosahedronBufferGeometry, IcosahedronGeometry, ImageBitmapLoader, ImageLoader, ImageUtils, IncrementStencilOp, IncrementWrapStencilOp, InstancedBufferAttribute, InstancedBufferGeometry, InstancedInterleavedBuffer, InstancedMesh, Int16BufferAttribute, Int32BufferAttribute, Int8BufferAttribute, IntType, InterleavedBuffer, InterleavedBufferAttribute, Interpolant, InterpolateDiscrete, InterpolateLinear, InterpolateSmooth, InvertStencilOp, KeepStencilOp, KeyframeTrack, LOD, LatheBufferGeometry, LatheGeometry, Layers, LessDepth, LessEqualDepth, LessEqualStencilFunc, LessStencilFunc, Light, LightProbe, Line, Line3, LineBasicMaterial, LineCurve, LineCurve3, LineDashedMaterial, LineLoop, LineSegments, LinearEncoding, LinearFilter, LinearInterpolant, LinearMipMapLinearFilter, LinearMipMapNearestFilter, LinearMipmapLinearFilter, LinearMipmapNearestFilter, LinearSRGBColorSpace, LinearToneMapping, Loader, LoaderUtils, LoadingManager, LoopOnce, LoopPingPong, LoopRepeat, LuminanceAlphaFormat, LuminanceFormat, MOUSE, Material, MaterialLoader, MathUtils, Matrix3, Matrix4, MaxEquation, Mesh, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, MinEquation, MirroredRepeatWrapping, MixOperation, MultiplyBlending, MultiplyOperation, NearestFilter, NearestMipMapLinearFilter, NearestMipMapNearestFilter, NearestMipmapLinearFilter, NearestMipmapNearestFilter, NeverDepth, NeverStencilFunc, NoBlending, NoColorSpace, NoToneMapping, NormalAnimationBlendMode, NormalBlending, NotEqualDepth, NotEqualStencilFunc, NumberKeyframeTrack, Object3D, ObjectLoader, ObjectSpaceNormalMap, OctahedronBufferGeometry, OctahedronGeometry, OneFactor, OneMinusDstAlphaFactor, OneMinusDstColorFactor, OneMinusSrcAlphaFactor, OneMinusSrcColorFactor, OrthographicCamera, PCFShadowMap, PCFSoftShadowMap, PMREMGenerator, Path, PerspectiveCamera, Plane, PlaneBufferGeometry, PlaneGeometry, PlaneHelper, PointLight, PointLightHelper, Points, PointsMaterial, PolarGridHelper, PolyhedronBufferGeometry, PolyhedronGeometry, PositionalAudio, PropertyBinding, PropertyMixer, QuadraticBezierCurve, QuadraticBezierCurve3, Quaternion, QuaternionKeyframeTrack, QuaternionLinearInterpolant, RED_GREEN_RGTC2_Format, RED_RGTC1_Format, REVISION, RGBADepthPacking, RGBAFormat, RGBAIntegerFormat, RGBA_ASTC_10x10_Format, RGBA_ASTC_10x5_Format, RGBA_ASTC_10x6_Format, RGBA_ASTC_10x8_Format, RGBA_ASTC_12x10_Format, RGBA_ASTC_12x12_Format, RGBA_ASTC_4x4_Format, RGBA_ASTC_5x4_Format, RGBA_ASTC_5x5_Format, RGBA_ASTC_6x5_Format, RGBA_ASTC_6x6_Format, RGBA_ASTC_8x5_Format, RGBA_ASTC_8x6_Format, RGBA_ASTC_8x8_Format, RGBA_BPTC_Format, RGBA_ETC2_EAC_Format, RGBA_PVRTC_2BPPV1_Format, RGBA_PVRTC_4BPPV1_Format, RGBA_S3TC_DXT1_Format, RGBA_S3TC_DXT3_Format, RGBA_S3TC_DXT5_Format, RGB_ETC1_Format, RGB_ETC2_Format, RGB_PVRTC_2BPPV1_Format, RGB_PVRTC_4BPPV1_Format, RGB_S3TC_DXT1_Format, RGFormat, RGIntegerFormat, RawShaderMaterial, Ray, Raycaster, RectAreaLight, RedFormat, RedIntegerFormat, ReinhardToneMapping, RepeatWrapping, ReplaceStencilOp, ReverseSubtractEquation, RingBufferGeometry, RingGeometry, SIGNED_RED_GREEN_RGTC2_Format, SIGNED_RED_RGTC1_Format, SRGBColorSpace, Scene, ShaderChunk, ShaderLib, ShaderMaterial, ShadowMaterial, Shape, ShapeBufferGeometry, ShapeGeometry, ShapePath, ShapeUtils, ShortType, Skeleton, SkeletonHelper, SkinnedMesh, Source, Sphere, SphereBufferGeometry, SphereGeometry, Spherical, SphericalHarmonics3, SplineCurve, SpotLight, SpotLightHelper, Sprite, SpriteMaterial, SrcAlphaFactor, SrcAlphaSaturateFactor, SrcColorFactor, StaticCopyUsage, StaticDrawUsage, StaticReadUsage, StereoCamera, StreamCopyUsage, StreamDrawUsage, StreamReadUsage, StringKeyframeTrack, SubtractEquation, SubtractiveBlending, TOUCH, TangentSpaceNormalMap, TetrahedronBufferGeometry, TetrahedronGeometry, Texture, TextureLoader, TorusBufferGeometry, TorusGeometry, TorusKnotBufferGeometry, TorusKnotGeometry, Triangle, TriangleFanDrawMode, TriangleStripDrawMode, TrianglesDrawMode, TubeBufferGeometry, TubeGeometry, TwoPassDoubleSide, UVMapping, Uint16BufferAttribute, Uint32BufferAttribute, Uint8BufferAttribute, Uint8ClampedBufferAttribute, Uniform, UniformsGroup, UniformsLib, UniformsUtils, UnsignedByteType, UnsignedInt248Type, UnsignedIntType, UnsignedShort4444Type, UnsignedShort5551Type, UnsignedShortType, VSMShadowMap, Vector2, Vector3, Vector4, VectorKeyframeTrack, VideoTexture, WebGL1Renderer, WebGL3DRenderTarget, WebGLArrayRenderTarget, WebGLCubeRenderTarget, WebGLMultipleRenderTargets, WebGLRenderTarget, WebGLRenderer, WebGLUtils, WireframeGeometry, WrapAroundEnding, ZeroCurvatureEnding, ZeroFactor, ZeroSlopeEnding, ZeroStencilOp, _SRGBAFormat, sRGBEncoding } = THREE;

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/typeChecks.js
function isMesh(obj2) {
  return isDefined(obj2) && obj2.isMesh;
}
function isMaterial(obj2) {
  return isDefined(obj2) && obj2.isMaterial;
}
function isNamedMaterial(name2, obj2) {
  return isMaterial(obj2) && obj2.type === name2;
}
function isMeshBasicMaterial(obj2) {
  return isNamedMaterial("MeshBasicMaterial", obj2);
}
function isObject3D(obj2) {
  return isDefined(obj2) && obj2.isObject3D;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/objects.js
function isErsatzObject(obj2) {
  return isDefined(obj2) && isObject3D(obj2.object);
}
function objectResolve(obj2) {
  if (isErsatzObject(obj2)) {
    return obj2.object;
  }
  return obj2;
}
function objectSetVisible(obj2, visible) {
  obj2 = objectResolve(obj2);
  obj2.visible = visible;
  return visible;
}
function objectIsFullyVisible(obj2) {
  if (!obj2) {
    return false;
  }
  obj2 = objectResolve(obj2);
  while (obj2) {
    if (!obj2.visible) {
      return false;
    }
    obj2 = obj2.parent;
  }
  return true;
}
function objGraph(obj2, ...children) {
  const toAdd = children.filter(isDefined).map(objectResolve);
  if (toAdd.length > 0) {
    objectResolve(obj2).add(...toAdd);
  }
  return obj2;
}
function obj(name2, ...rest) {
  const obj2 = new Object3D();
  obj2.name = name2;
  objGraph(obj2, ...rest);
  return obj2;
}
function objectSetEnabled(obj2, enabled) {
  obj2 = objectResolve(obj2);
  if (isDisableable(obj2)) {
    obj2.disabled = !enabled;
  }
}
function mesh(name2, geom, mat) {
  const mesh2 = new Mesh(geom, mat);
  mesh2.name = name2;
  return mesh2;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/animation/scaleOnHover.js
var scaledItems = singleton("Juniper:ScaledItems", () => /* @__PURE__ */ new Map());
var start = 1;
var end = 1.1;
var ScaleState = class {
  constructor(target) {
    this.target = target;
    this.obj = objectResolve(this.target);
    this.base = this.obj.scale.clone();
    this.p = 0;
    this.dir = 0;
    this.running = false;
    this.wasDisabled = this.disabled;
    this.target.addScopedEventListener(this, "enter", (evt) => {
      if (evt.pointer.type !== "nose") {
        this.run(1);
      }
    });
    this.target.addScopedEventListener(this, "exit", (evt) => {
      if (evt.pointer.type !== "nose") {
        this.run(-1);
      }
    });
    this.obj.traverse((child) => {
      if (isMesh(child)) {
        this.target.addMesh(child);
      }
    });
  }
  get disabled() {
    return this.target.disabled;
  }
  run(d) {
    if (!this.disabled || (d === -1 || this.p > 0)) {
      this.dir = d;
      this.running = true;
    }
  }
  updateScaling(dt) {
    if (this.disabled !== this.wasDisabled) {
      this.wasDisabled = this.disabled;
      if (this.disabled) {
        this.run(-1);
      }
    }
    if (this.running) {
      this.p += this.dir * dt;
      if (this.dir > 0 && this.p >= 1 || this.dir < 0 && this.p < 0) {
        this.p = Math.max(0, Math.min(1, this.p));
        this.running = false;
      }
      const q = bump(this.p, 1.1);
      this.obj.scale.copy(this.base).multiplyScalar(q * (end - start) + start);
    }
  }
  dispose() {
    this.target.removeScope(this);
  }
};
function removeScaledObj(obj2) {
  const state = scaledItems.get(obj2);
  if (state) {
    scaledItems.delete(obj2);
    dispose(state);
  }
}
function scaleOnHover(target, enabled) {
  const has = scaledItems.has(target);
  if (enabled != has) {
    if (enabled) {
      scaledItems.set(target, new ScaleState(target));
    } else {
      const scaler = scaledItems.get(target);
      dispose(scaler);
      scaledItems.delete(target);
    }
  }
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/cleanup.js
function cleanup(obj2) {
  const cleanupQ = new Array();
  const cleanupSeen = /* @__PURE__ */ new Set();
  cleanupQ.push(obj2);
  while (cleanupQ.length > 0) {
    const here = cleanupQ.shift();
    if (here && !cleanupSeen.has(here)) {
      cleanupSeen.add(here);
      if (here.isMesh) {
        cleanupQ.push(here.material, here.geometry);
      }
      if (here.isMaterial) {
        cleanupQ.push(...Object.values(here));
      }
      if (here.isObject3D) {
        cleanupQ.push(...here.children);
        here.clear();
        removeScaledObj(here);
      }
      if (isArray(here)) {
        cleanupQ.push(...here);
      }
      dispose2(here);
    }
  }
  cleanupSeen.clear();
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/environment/Application.js
var ApplicationEvent = class extends TypedEvent {
  constructor(type, app) {
    super(type);
    this.app = app;
  }
};
var ApplicationJoinRoomEvent = class extends ApplicationEvent {
  constructor(app, roomName) {
    super("joinroom", app);
    this.roomName = roomName;
  }
};
var ApplicationQuitEvent = class extends ApplicationEvent {
  constructor(app) {
    super("quit", app);
  }
};
var ApplicationShownEvent = class extends ApplicationEvent {
  constructor(app) {
    super("shown", app);
  }
};
var ApplicationHiddenEvent = class extends ApplicationEvent {
  constructor(app) {
    super("hidden", app);
  }
};
var Application = class extends TypedEventTarget {
  constructor(env) {
    super();
    this.env = env;
    this.dataLogger = null;
  }
  quit() {
    this.dispatchEvent(new ApplicationQuitEvent(this));
  }
  join(roomName) {
    this.dispatchEvent(new ApplicationJoinRoomEvent(this, roomName));
    this.env.avatar.reset();
  }
  async show(prog) {
    await this.showing(prog);
    this.dispatchEvent(new ApplicationShownEvent(this));
  }
  hide() {
    this.hiding();
    this.dispatchEvent(new ApplicationHiddenEvent(this));
  }
  init(params) {
    this.dataLogger = params.get("dataLogger");
    return Promise.resolve();
  }
  log(key, value) {
    if (isDefined(this.dataLogger)) {
      this.dataLogger.log(key, value);
    }
  }
  error(page, operation, exception) {
    if (isDefined(this.dataLogger)) {
      this.dataLogger.error(page, operation, exception);
    }
  }
  onError(page, operation) {
    return this.error.bind(this, page, operation);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/fonts.js
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
  fontParts.push(px(style.fontSize));
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/Asset.js
var BaseAsset = class {
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
  constructor(path, type) {
    this.path = path;
    this.type = type;
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
  async getSize(fetcher) {
    try {
      const { contentLength } = await fetcher.head(this.path).accept(this.type).exec();
      return [this, contentLength || 1];
    } catch (exp) {
      console.warn(exp);
      return [this, 1];
    }
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
    let type;
    if (isBoolean(typeOrUseCache)) {
      useCache = typeOrUseCache;
    } else {
      type = typeOrUseCache;
    }
    super(path, type);
    this.useCache = !!useCache;
  }
  getResult(fetcher, prog) {
    return this.getRequest(fetcher, prog).then(unwrapResponse);
  }
  getRequest(fetcher, prog) {
    const request = fetcher.get(this.path).useCache(this.useCache).progress(prog);
    return this.getResponse(request);
  }
};
var AssetImage = class extends BaseFetchedAsset {
  getResponse(request) {
    return request.image(this.type);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/graphics2d/dist/animation/Animator.js
function isDead(task) {
  return !task.started || task.finished;
}
var AnimationTask = class extends Task {
  constructor() {
    super(false);
    this.time = 0;
    this.duration = 0;
    this.onTick = null;
  }
  begin(delay, duration, onTick) {
    this.restart();
    this.time = -delay;
    this.duration = duration;
    this.onTick = onTick;
    this.onTick(0);
  }
  update(dt) {
    if (!isDead(this)) {
      this.time += dt / this.duration;
      if (this.time >= 1) {
        this.onTick(1);
        this.resolve();
      } else if (this.time >= 0) {
        this.onTick(this.time);
      }
    }
  }
};
var Animator = class {
  constructor() {
    this.animations = new Array();
  }
  update(dt) {
    dt = 1e-3 * dt;
    for (const animation of this.animations) {
      animation.update(dt);
    }
  }
  clear() {
    for (const animation of this.animations) {
      animation.resolve();
    }
  }
  start(delay, duration, update) {
    let task = arrayScan(this.animations, isDead);
    if (!task) {
      this.animations.push(task = new AnimationTask());
    }
    task.begin(delay, duration, update);
    return task;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/images.js
function getWidth(img) {
  if (img instanceof HTMLVideoElement) {
    return img.videoWidth;
  } else if (img instanceof VideoFrame) {
    return img.displayWidth;
  } else {
    return img.width;
  }
}
function getHeight(img) {
  if (img instanceof HTMLVideoElement) {
    return img.videoHeight;
  } else if (img instanceof VideoFrame) {
    return img.displayHeight;
  } else {
    return img.height;
  }
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/units/length.js
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
function inches2Meters(inches) {
  return inches / INCHES_PER_METER;
}
function meters2Inches(meters) {
  return meters * INCHES_PER_METER;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/Plane.js
var plane = /* @__PURE__ */ new PlaneGeometry(1, 1, 1, 1);
plane.name = "PlaneGeom";

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/getRelativeXRRigidTransform.js
var M = new Matrix4();
var P3 = new Vector3();
var P4 = new Vector4();
var Q = new Quaternion();
function getRelativeXRRigidTransform(ref, obj2, scale) {
  M.copy(ref.matrixWorld).invert().multiply(obj2.matrixWorld).decompose(P3, Q, scale);
  P4.set(P3.x, P3.y, P3.z, 1);
  return new XRRigidTransform(P4, Q);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/examples/lines/LineMaterial.js
UniformsLib.line = {
  worldUnits: { value: 1 },
  linewidth: { value: 1 },
  resolution: { value: new Vector2(1, 1) },
  dashOffset: { value: 0 },
  dashScale: { value: 1 },
  dashSize: { value: 1 },
  gapSize: { value: 1 }
  // todo FIX - maybe change to totalSize
};
ShaderLib["line"] = {
  uniforms: UniformsUtils.merge([
    UniformsLib.common,
    UniformsLib.fog,
    UniformsLib.line
  ]),
  vertexShader: (
    /* glsl */
    `
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
		`
  ),
  fragmentShader: (
    /* glsl */
    `
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
  )
};
var LineMaterial = class extends ShaderMaterial {
  constructor(parameters) {
    super({
      type: "LineMaterial",
      uniforms: UniformsUtils.clone(ShaderLib["line"].uniforms),
      vertexShader: ShaderLib["line"].vertexShader,
      fragmentShader: ShaderLib["line"].fragmentShader,
      clipping: true
      // required for clipping support
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/materials.js
var materials = singleton("Juniper:Three:Materials", () => /* @__PURE__ */ new Map());
function del(obj2, name2) {
  if (name2 in obj2) {
    delete obj2[name2];
  }
}
function makeMaterial(slug, material, options) {
  const key = `${slug}_${Object.keys(options).map((k) => `${k}:${options[k]}`).join(",")}`;
  if (!materials.has(key)) {
    del(options, "name");
    materials.set(key, new material(options));
  }
  return materials.get(key);
}
function trans(options) {
  return Object.assign(options, {
    transparent: true
  });
}
function solidTransparent(options) {
  return makeMaterial("solidTransparent", MeshBasicMaterial, trans(options));
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/widgets/Image2D.js
var S = new Vector3();
var copyCounter = 0;
var Image2D = class extends Object3D {
  constructor(env, name2, webXRLayerType, materialOrOptions = null) {
    super();
    this.webXRLayerType = webXRLayerType;
    this.lastMatrixWorld = new Matrix4();
    this._imageWidth = 0;
    this._imageHeight = 0;
    this.forceUpdate = false;
    this.wasUsingLayer = false;
    this.layer = null;
    this.curImage = null;
    this.lastImage = null;
    this.lastWidth = null;
    this.lastHeight = null;
    this.env = null;
    this.mesh = null;
    this.stereoLayoutName = "mono";
    this.sizeMode = "none";
    if (env) {
      this.setEnvAndName(env, name2);
      const material = isMeshBasicMaterial(materialOrOptions) ? materialOrOptions : solidTransparent(Object.assign({}, materialOrOptions, { name: this.name }));
      objGraph(this, this.mesh = mesh(name2 + "-Mesh", plane, material));
    }
  }
  copy(source, recursive = true) {
    super.copy(source, recursive);
    this.webXRLayerType = source.webXRLayerType;
    this.setImageSize(source.imageWidth, source.imageHeight);
    this.setEnvAndName(source.env, source.name + ++copyCounter);
    this.mesh = arrayScan(this.children, isMesh);
    if (isNullOrUndefined(this.mesh)) {
      this.mesh = source.mesh.clone();
      objGraph(this, this.mesh);
    }
    this.setTextureMap(source.curImage);
    return this;
  }
  dispose() {
    this.env.removeScope(this);
    this.disposeImage();
    cleanup(this.mesh);
  }
  disposeImage() {
    this.removeWebXRLayer();
    cleanup(this.mesh.material.map);
    this.curImage = null;
  }
  setImageSize(width, height) {
    if (width !== this.imageWidth || height !== this.imageHeight) {
      const { objectWidth, objectHeight } = this;
      this._imageWidth = width;
      this._imageHeight = height;
      if (this.sizeMode !== "none") {
        if (this.sizeMode === "fixed-width") {
          this.objectWidth = objectWidth;
        } else {
          this.objectHeight = objectHeight;
        }
      }
    }
  }
  get imageWidth() {
    return this._imageWidth;
  }
  get imageHeight() {
    return this._imageHeight;
  }
  get imageAspectRatio() {
    return this.imageWidth / this.imageHeight;
  }
  get objectWidth() {
    return this.scale.x;
  }
  set objectWidth(v) {
    this.scale.set(v, this.scale.y = v / this.imageAspectRatio, 1);
  }
  get objectHeight() {
    return this.scale.y;
  }
  set objectHeight(v) {
    this.scale.set(this.imageAspectRatio * v, v, 1);
  }
  get pixelDensity() {
    const inches = meters2Inches(this.objectWidth);
    const ppi = this.imageWidth / inches;
    return ppi;
  }
  set pixelDensity(ppi) {
    const inches = this.imageWidth / ppi;
    const meters = inches2Meters(inches);
    this.objectWidth = meters;
  }
  setEnvAndName(env, name2) {
    this.env = env;
    this.name = name2;
    this.env.addScopedEventListener(this, "update", (evt) => this.checkWebXRLayer(evt.frame));
  }
  get needsLayer() {
    if (!objectIsFullyVisible(this) || isNullOrUndefined(this.mesh.material.map) || isNullOrUndefined(this.curImage)) {
      return false;
    }
    if (!(this.curImage instanceof HTMLVideoElement)) {
      return true;
    }
    return !this.curImage.paused || this.curImage.currentTime > 0;
  }
  removeWebXRLayer() {
    if (isDefined(this.layer)) {
      this.wasUsingLayer = false;
      this.env.removeWebXRLayer(this.layer);
      this.mesh.visible = true;
      const layer = this.layer;
      this.layer = null;
      setTimeout(() => dispose2(layer), 100);
    }
  }
  setTextureMap(img) {
    if (this.curImage) {
      this.disposeImage();
    }
    if (img) {
      if (isImageBitmap(img)) {
        img = createUtilityCanvasFromImageBitmap(img);
      } else if (isImageData(img)) {
        img = createUtilityCanvasFromImageData(img);
      }
      if (isOffscreenCanvas(img)) {
        img = img;
      }
      this.curImage = img;
      this.setImageSize(getWidth(img), getHeight(img));
      if (img instanceof HTMLVideoElement) {
        this.mesh.material.map = new VideoTexture(img);
      } else {
        this.mesh.material.map = new Texture(img);
        this.mesh.material.map.needsUpdate = true;
      }
    }
    this.mesh.material.needsUpdate = true;
  }
  get isVideo() {
    return this.curImage instanceof HTMLVideoElement;
  }
  updateTexture() {
    if (isDefined(this.curImage)) {
      const newWidth = getWidth(this.curImage);
      const newHeight = getHeight(this.curImage);
      ;
      if (this.imageWidth !== newWidth || this.imageHeight !== newHeight) {
        const img = this.curImage;
        this.disposeImage();
        this.setTextureMap(img);
      } else {
        this.mesh.material.map.needsUpdate = this.forceUpdate = true;
      }
    }
  }
  checkWebXRLayer(frame) {
    if (this.mesh.material.map && this.curImage) {
      const isLayersAvailable = this.webXRLayerType !== "none" && this.env.hasXRCompositionLayers && this.env.showWebXRLayers && isDefined(frame) && (this.isVideo && isDefined(this.env.xrMediaBinding) || !this.isVideo && isDefined(this.env.xrBinding));
      const useLayer = isLayersAvailable && this.needsLayer;
      const useLayerChanged = useLayer !== this.wasUsingLayer;
      const imageChanged = this.curImage !== this.lastImage || this.mesh.material.needsUpdate || this.mesh.material.map.needsUpdate || this.forceUpdate;
      const sizeChanged = this.imageWidth !== this.lastWidth || this.imageHeight !== this.lastHeight;
      this.wasUsingLayer = useLayer;
      this.lastImage = this.curImage;
      this.lastWidth = this.imageWidth;
      this.lastHeight = this.imageHeight;
      if (useLayerChanged || sizeChanged) {
        if ((!useLayer || sizeChanged) && this.layer) {
          this.removeWebXRLayer();
        }
        if (useLayer) {
          const space = this.env.referenceSpace;
          const transform = getRelativeXRRigidTransform(this.env.stage, this.mesh, S);
          this.lastMatrixWorld.copy(this.matrixWorld);
          const width = S.x / 2;
          const height = S.y / 2;
          const layout = this.stereoLayoutName === "mono" ? "mono" : this.stereoLayoutName === "left-right" || this.stereoLayoutName === "right-left" ? "stereo-left-right" : "stereo-top-bottom";
          if (this.isVideo) {
            const invertStereo = this.stereoLayoutName === "right-left" || this.stereoLayoutName === "bottom-top";
            this.layer = this.env.xrMediaBinding.createQuadLayer(this.curImage, {
              space,
              layout,
              invertStereo,
              transform,
              width,
              height
            });
          } else {
            this.layer = this.env.xrBinding.createQuadLayer({
              space,
              layout,
              textureType: "texture",
              isStatic: this.webXRLayerType === "static",
              viewPixelWidth: getWidth(this.curImage),
              viewPixelHeight: getHeight(this.curImage),
              transform,
              width,
              height
            });
          }
          this.env.addWebXRLayer(this.layer, 500);
          this.mesh.visible = false;
        }
      }
      if (this.layer) {
        if (imageChanged || this.layer.needsRedraw) {
          const gl = this.env.gl;
          const gLayer = this.env.xrBinding.getSubImage(this.layer, frame);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.bindTexture(gl.TEXTURE_2D, gLayer.colorTexture);
          gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.curImage);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.bindTexture(gl.TEXTURE_2D, null);
          this.forceUpdate = false;
        }
        if (arrayCompare(this.matrixWorld.elements, this.lastMatrixWorld.elements) >= 0) {
          this.layer.transform = getRelativeXRRigidTransform(this.env.stage, this.mesh, S);
          this.lastMatrixWorld.copy(this.matrixWorld);
          this.layer.width = S.x / 2;
          this.layer.height = S.y / 2;
        }
      } else {
        this.forceUpdate = false;
      }
    }
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/graphics2d/dist/CanvasImage.js
var CanvasImage = class extends TypedEventTarget {
  constructor(width, height, options) {
    super();
    this._scale = 250;
    this._visible = true;
    this.wasVisible = null;
    this.redrawnEvt = new TypedEvent("redrawn");
    if (isDefined(options)) {
      if (isDefined(options.scale)) {
        this._scale = options.scale;
      }
    }
    this._canvas = createUICanvas(width, height);
    this._g = this.canvas.getContext("2d");
  }
  fillRect(color, x, y, width, height, margin2) {
    this.g.fillStyle = color;
    this.g.fillRect(x + margin2, y + margin2, width - 2 * margin2, height - 2 * margin2);
  }
  drawText(text, x, y, align) {
    this.g.textAlign = align;
    this.g.strokeText(text, x, y);
    this.g.fillText(text, x, y);
  }
  redraw() {
    if ((this.visible || this.wasVisible) && this.onRedraw()) {
      this.wasVisible = this.visible;
      this.dispatchEvent(this.redrawnEvt);
    }
  }
  onClear() {
    this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  clear() {
    this.onClear();
    this.dispatchEvent(this.redrawnEvt);
  }
  get canvas() {
    return this._canvas;
  }
  get g() {
    return this._g;
  }
  get imageWidth() {
    return this.canvas.width;
  }
  get imageHeight() {
    return this.canvas.height;
  }
  get aspectRatio() {
    return this.imageWidth / this.imageHeight;
  }
  get width() {
    return this.imageWidth / this.scale;
  }
  get height() {
    return this.imageHeight / this.scale;
  }
  get scale() {
    return this._scale;
  }
  set scale(v) {
    if (this.scale !== v) {
      this._scale = v;
      this.redraw();
    }
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    if (this.visible !== v) {
      this.wasVisible = this._visible;
      this._visible = v;
      this.redraw();
    }
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/graphics2d/dist/TextImage.js
var TextImage = class extends CanvasImage {
  constructor(options) {
    super(10, 10, options);
    this.trueWidth = null;
    this.trueHeight = null;
    this.trueFontSize = null;
    this.dx = null;
    this._minWidth = null;
    this._maxWidth = null;
    this._minHeight = null;
    this._maxHeight = null;
    this._freezeDimensions = false;
    this._dimensionsFrozen = false;
    this._bgFillColor = null;
    this._bgStrokeColor = null;
    this._bgStrokeSize = null;
    this._textStrokeColor = null;
    this._textStrokeSize = null;
    this._textFillColor = "black";
    this._textDirection = "horizontal";
    this._fontStyle = "normal";
    this._fontVariant = "normal";
    this._fontWeight = "normal";
    this._fontFamily = "sans-serif";
    this._fontSize = 20;
    this._value = null;
    this.lastValue = null;
    if (isDefined(options)) {
      if (isDefined(options.minWidth)) {
        this._minWidth = options.minWidth;
      }
      if (isDefined(options.maxWidth)) {
        this._maxWidth = options.maxWidth;
      }
      if (isDefined(options.minHeight)) {
        this._minHeight = options.minHeight;
      }
      if (isDefined(options.maxHeight)) {
        this._maxHeight = options.maxHeight;
      }
      if (isDefined(options.freezeDimensions)) {
        this._freezeDimensions = options.freezeDimensions;
      }
      if (isDefined(options.textStrokeColor)) {
        this._textStrokeColor = options.textStrokeColor;
      }
      if (isDefined(options.textStrokeSize)) {
        this._textStrokeSize = options.textStrokeSize;
      }
      if (isDefined(options.bgFillColor)) {
        this._bgFillColor = options.bgFillColor;
      }
      if (isDefined(options.bgStrokeColor)) {
        this._bgStrokeColor = options.bgStrokeColor;
      }
      if (isDefined(options.bgStrokeSize)) {
        this._bgStrokeSize = options.bgStrokeSize;
      }
      if (isDefined(options.value)) {
        this._value = options.value;
      }
      if (isDefined(options.textFillColor)) {
        this._textFillColor = options.textFillColor;
      }
      if (isDefined(options.textDirection)) {
        this._textDirection = options.textDirection;
      }
      if (isDefined(options.fontStyle)) {
        this._fontStyle = options.fontStyle;
      }
      if (isDefined(options.fontVariant)) {
        this._fontVariant = options.fontVariant;
      }
      if (isDefined(options.fontWeight)) {
        this._fontWeight = options.fontWeight;
      }
      if (isDefined(options.fontFamily)) {
        this._fontFamily = options.fontFamily;
      }
      if (isDefined(options.fontSize)) {
        this._fontSize = options.fontSize;
      }
      if (isDefined(options.padding)) {
        if (isNumber(options.padding)) {
          this._padding = {
            left: options.padding,
            right: options.padding,
            top: options.padding,
            bottom: options.padding
          };
        } else {
          this._padding = options.padding;
        }
      }
    }
    if (isNullOrUndefined(this._padding)) {
      this._padding = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }
    this.redraw();
  }
  get minWidth() {
    return this._minWidth;
  }
  set minWidth(v) {
    if (this.minWidth !== v) {
      this._minWidth = v;
      this.redraw();
    }
  }
  get maxWidth() {
    return this._maxWidth;
  }
  set maxWidth(v) {
    if (this.maxWidth !== v) {
      this._maxWidth = v;
      this.redraw();
    }
  }
  get minHeight() {
    return this._minHeight;
  }
  set minHeight(v) {
    if (this.minHeight !== v) {
      this._minHeight = v;
      this.redraw();
    }
  }
  get maxHeight() {
    return this._maxHeight;
  }
  set maxHeight(v) {
    if (this.maxHeight !== v) {
      this._maxHeight = v;
      this.redraw();
    }
  }
  get padding() {
    return this._padding;
  }
  set padding(v) {
    if (v instanceof Array) {
      throw new Error("Invalid padding");
    }
    if (this.padding.top !== v.top || this.padding.right != v.right || this.padding.bottom != v.bottom || this.padding.left != v.left) {
      this._padding = v;
      this.redraw();
    }
  }
  get textDirection() {
    return this._textDirection;
  }
  set textDirection(v) {
    if (this.textDirection !== v) {
      this._textDirection = v;
      this.redraw();
    }
  }
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(v) {
    if (this.fontStyle !== v) {
      this._fontStyle = v;
      this.redraw();
    }
  }
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(v) {
    if (this.fontVariant !== v) {
      this._fontVariant = v;
      this.redraw();
    }
  }
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(v) {
    if (this.fontWeight !== v) {
      this._fontWeight = v;
      this.redraw();
    }
  }
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(v) {
    if (this.fontSize !== v) {
      this._fontSize = v;
      this.redraw();
    }
  }
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(v) {
    if (this.fontFamily !== v) {
      this._fontFamily = v;
      this.redraw();
    }
  }
  get textFillColor() {
    return this._textFillColor;
  }
  set textFillColor(v) {
    if (this.textFillColor !== v) {
      this._textFillColor = v;
      this.redraw();
    }
  }
  get textStrokeColor() {
    return this._textStrokeColor;
  }
  set textStrokeColor(v) {
    if (this.textStrokeColor !== v) {
      this._textStrokeColor = v;
      this.redraw();
    }
  }
  get textStrokeSize() {
    return this._textStrokeSize;
  }
  set textStrokeSize(v) {
    if (this.textStrokeSize !== v) {
      this._textStrokeSize = v;
      this.redraw();
    }
  }
  get bgFillColor() {
    return this._bgFillColor;
  }
  set bgFillColor(v) {
    if (this.bgFillColor !== v) {
      this._bgFillColor = v;
      this.redraw();
    }
  }
  get bgStrokeColor() {
    return this._bgStrokeColor;
  }
  set bgStrokeColor(v) {
    if (this.bgStrokeColor !== v) {
      this._bgStrokeColor = v;
      this.redraw();
    }
  }
  get bgStrokeSize() {
    return this._bgStrokeSize;
  }
  set bgStrokeSize(v) {
    if (this.bgStrokeSize !== v) {
      this._bgStrokeSize = v;
      this.redraw();
    }
  }
  get value() {
    return this._value;
  }
  set value(v) {
    if (this.value !== v) {
      this._value = v;
      this.redraw();
    }
  }
  split(value) {
    return value.replace(/\r\n/g, "\n").split("\n");
  }
  unfreeze() {
    this._dimensionsFrozen = false;
  }
  onRedraw() {
    this.onClear();
    if (this.visible && this.fontFamily && this.fontSize && (this.textFillColor || this.textStrokeColor && this.textStrokeSize) && this.value && this.value !== this.lastValue) {
      const lines = this.split(this.value);
      const isVertical = this.textDirection && this.textDirection.indexOf("vertical") === 0;
      if (this.trueWidth === null || this.trueHeight === null || this.dx === null || this.trueFontSize === null || !this._dimensionsFrozen) {
        this._dimensionsFrozen = this._freezeDimensions;
        const autoResize = this.minWidth != null || this.maxWidth != null || this.minHeight != null || this.maxHeight != null;
        const _targetMinWidth = ((this.minWidth || 0) - this.padding.right - this.padding.left) * this.scale;
        const _targetMaxWidth = ((this.maxWidth || 4096) - this.padding.right - this.padding.left) * this.scale;
        const _targetMinHeight = ((this.minHeight || 0) - this.padding.top - this.padding.bottom) * this.scale;
        const _targetMaxHeight = ((this.maxHeight || 4096) - this.padding.top - this.padding.bottom) * this.scale;
        const targetMinWidth = isVertical ? _targetMinHeight : _targetMinWidth;
        const targetMaxWidth = isVertical ? _targetMaxHeight : _targetMaxWidth;
        const targetMinHeight = isVertical ? _targetMinWidth : _targetMinHeight;
        const targetMaxHeight = isVertical ? _targetMaxWidth : _targetMaxHeight;
        const tried = [];
        this.trueWidth = 0;
        this.trueHeight = 0;
        this.dx = 0;
        let tooBig = false, tooSmall = false, highFontSize = 1e4, lowFontSize = 0;
        this.trueFontSize = clamp(this.fontSize * this.scale, lowFontSize, highFontSize);
        let minFont = null, minFontDelta = Number.MAX_VALUE;
        do {
          const realFontSize = this.fontSize;
          this._fontSize = this.trueFontSize;
          const font = makeFont(this);
          this._fontSize = realFontSize;
          this.g.textAlign = "center";
          this.g.textBaseline = "middle";
          this.g.font = font;
          this.trueWidth = 0;
          this.trueHeight = 0;
          for (const line of lines) {
            const metrics = this.g.measureText(line);
            this.trueWidth = Math.max(this.trueWidth, metrics.width);
            this.trueHeight += this.trueFontSize;
            if (isNumber(metrics.actualBoundingBoxLeft) && isNumber(metrics.actualBoundingBoxRight) && isNumber(metrics.actualBoundingBoxAscent) && isNumber(metrics.actualBoundingBoxDescent)) {
              if (!autoResize) {
                this.trueWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
                this.trueHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                this.dx = (metrics.actualBoundingBoxLeft - this.trueWidth / 2) / 2;
              }
            }
          }
          if (autoResize) {
            const dMinWidth = this.trueWidth - targetMinWidth;
            const dMaxWidth = this.trueWidth - targetMaxWidth;
            const dMinHeight = this.trueHeight - targetMinHeight;
            const dMaxHeight = this.trueHeight - targetMaxHeight;
            const mdMinWidth = Math.abs(dMinWidth);
            const mdMaxWidth = Math.abs(dMaxWidth);
            const mdMinHeight = Math.abs(dMinHeight);
            const mdMaxHeight = Math.abs(dMaxHeight);
            tooBig = dMaxWidth > 1 || dMaxHeight > 1;
            tooSmall = dMinWidth < -1 && dMinHeight < -1;
            const minDif = Math.min(mdMinWidth, Math.min(mdMaxWidth, Math.min(mdMinHeight, mdMaxHeight)));
            if (minDif < minFontDelta) {
              minFontDelta = minDif;
              minFont = this.g.font;
            }
            if ((tooBig || tooSmall) && tried.indexOf(this.g.font) > -1 && minFont) {
              this.g.font = minFont;
              tooBig = false;
              tooSmall = false;
            }
            if (tooBig) {
              highFontSize = this.trueFontSize;
              this.trueFontSize = (lowFontSize + this.trueFontSize) / 2;
            } else if (tooSmall) {
              lowFontSize = this.trueFontSize;
              this.trueFontSize = (this.trueFontSize + highFontSize) / 2;
            }
          }
          tried.push(this.g.font);
        } while (tooBig || tooSmall);
        if (autoResize) {
          if (this.trueWidth < targetMinWidth) {
            this.trueWidth = targetMinWidth;
          } else if (this.trueWidth > targetMaxWidth) {
            this.trueWidth = targetMaxWidth;
          }
          if (this.trueHeight < targetMinHeight) {
            this.trueHeight = targetMinHeight;
          } else if (this.trueHeight > targetMaxHeight) {
            this.trueHeight = targetMaxHeight;
          }
        }
        const newW = this.trueWidth + this.scale * (this.padding.right + this.padding.left);
        const newH = this.trueHeight + this.scale * (this.padding.top + this.padding.bottom);
        try {
          setContextSize(this.g, newW, newH);
        } catch (exp) {
          console.error(exp);
          throw exp;
        }
      }
      if (this.bgFillColor) {
        this.g.fillStyle = this.bgFillColor;
        this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else {
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      if (this.textStrokeColor && this.textStrokeSize) {
        this.g.lineWidth = this.textStrokeSize * this.scale;
        this.g.strokeStyle = this.textStrokeColor;
      }
      if (this.textFillColor) {
        this.g.fillStyle = this.textFillColor;
      }
      const di = 0.5 * (lines.length - 1);
      for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        const dy = (i - di) * this.trueFontSize;
        const x = this.dx + this.trueWidth / 2 + this.scale * this.padding.left;
        const y = dy + this.trueHeight / 2 + this.scale * this.padding.top;
        if (this.textStrokeColor && this.textStrokeSize) {
          this.g.strokeText(line, x, y);
        }
        if (this.textFillColor) {
          this.g.fillText(line, x, y);
        }
      }
      if (this.bgStrokeColor && this.bgStrokeSize) {
        this.g.strokeStyle = this.bgStrokeColor;
        this.g.lineWidth = this.bgStrokeSize * this.scale;
        const s = this.bgStrokeSize / 2;
        this.g.strokeRect(s, s, this.canvas.width - this.bgStrokeSize, this.canvas.height - this.bgStrokeSize);
      }
      if (isVertical) {
        const canv = createUtilityCanvas(this.canvas.height, this.canvas.width);
        const g = canv.getContext("2d");
        if (g) {
          g.translate(canv.width / 2, canv.height / 2);
          if (this.textDirection === "vertical" || this.textDirection === "vertical-left") {
            g.rotate(HalfPi);
          } else if (this.textDirection === "vertical-right") {
            g.rotate(-HalfPi);
          }
          g.translate(-this.canvas.width / 2, -this.canvas.height / 2);
          g.drawImage(this.canvas, 0, 0);
          setContextSize(this.g, canv.width, canv.height);
        } else {
          console.warn("Couldn't rotate the TextImage");
        }
        this.g.drawImage(canv, 0, 0);
      }
      this.lastValue = this.value;
      return true;
    } else {
      const changed = this.value !== this.lastValue;
      this.lastValue = this.value;
      return changed;
    }
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/widgets/CanvasImageMesh.js
var redrawnEvt = { type: "redrawn" };
var CanvasImageMesh = class extends Image2D {
  get object() {
    return this;
  }
  get element() {
    if (isHTMLCanvas(this.image.canvas)) {
      return this.image.canvas;
    } else {
      return null;
    }
  }
  get canvas() {
    return this._image.canvas;
  }
  constructor(env, name2, webXRLayerType, image2, materialOptions) {
    super(env, name2, webXRLayerType, materialOptions);
    this._image = null;
    this.image = image2;
  }
  onRedrawn() {
    this.updateTexture();
    this.dispatchEvent(redrawnEvt);
  }
  get image() {
    return this._image;
  }
  set image(v) {
    if (this.image) {
      this.image.removeScope(this);
    }
    this._image = v;
    if (this.image) {
      this.image.addScopedEventListener(this, "redrawn", () => this.onRedrawn());
      this.setTextureMap(this.image.canvas);
      this.onRedrawn();
    }
  }
  get imageWidth() {
    return this.image.width;
  }
  get imageHeight() {
    return this.image.height;
  }
  copy(source, recursive = true) {
    super.copy(source, recursive);
    this.image = source.image;
    return this;
  }
  get isVisible() {
    return elementIsDisplayed(this);
  }
  set isVisible(v) {
    elementSetDisplay(this, v, "inline-block");
    objectSetVisible(this, v);
    objectSetVisible(this.mesh, v);
    this.image.visible = v;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/widgets/TextMesh.js
var TextMesh = class extends CanvasImageMesh {
  constructor(env, name2, webXRLayerType, textOptions, materialOptions) {
    let image2;
    if (textOptions instanceof TextImage) {
      image2 = textOptions;
    } else {
      image2 = new TextImage(textOptions);
    }
    super(env, name2, webXRLayerType, image2, materialOptions);
  }
  onRedrawn() {
    this.objectHeight = this.imageHeight;
    super.onRedrawn();
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/eventSystem/RayTarget.js
var RAY_TARGET_KEY = "Juniper:ThreeJS:EventSystem:RayTarget";
var RayTarget = class extends TypedEventTarget {
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
  addMesh(mesh2) {
    mesh2.userData[RAY_TARGET_KEY] = this;
    this.meshes.push(mesh2);
    return this;
  }
  removeMesh(mesh2) {
    if (arrayRemove(this.meshes, mesh2)) {
      delete mesh2.userData[RAY_TARGET_KEY];
    }
    return this;
  }
  addMeshes(...meshes) {
    for (const mesh2 of meshes) {
      this.addMesh(mesh2);
    }
    return this;
  }
  removeMeshes(...meshes) {
    for (const mesh2 of meshes) {
      this.removeMesh(mesh2);
    }
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/menu/MenuItem.js
var MenuItem = class extends RayTarget {
  constructor(width, height, name2, front, back) {
    super(obj(`MenuItem-${name2}`));
    this.front = front;
    this.back = back;
    this.startX = 0;
    if (this.back) {
      this.back = back;
      this.back.renderOrder = 0;
      this.back.position.z = -0.05;
      this.addMesh(this.back.mesh);
    }
    if (this.front) {
      this.front = front;
      this.front.renderOrder = 5;
      if (!this.back) {
        this.addMesh(this.front.mesh);
      }
    }
    this.back.scale.x = width;
    this.back.scale.y = height;
    objGraph(this, this.back, this.front);
  }
  get disabled() {
    return super.disabled;
  }
  set disabled(v) {
    if (v !== this.disabled) {
      super.disabled = v;
      this.updateHover();
    }
  }
  get clickable() {
    return super.clickable;
  }
  set clickable(v) {
    if (v !== this.clickable) {
      super.clickable = v;
      this.updateHover();
    }
  }
  updateHover() {
    scaleOnHover(this, this.clickable && this.enabled);
  }
  get width() {
    return this.back.scale.x;
  }
  get height() {
    return this.back.scale.y;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/menu/Menu.js
var zero = new Vector3(0, 0, 0);
var PAGE_SIZE = 5;
var Menu = class extends Object3D {
  constructor(env) {
    super();
    this.env = env;
    this.logo = null;
    this.animator = new Animator();
    this.lastMenuIndex = /* @__PURE__ */ new Map();
    this.buttons = new Array();
    this.menuFont = null;
    this.curBlowout = Promise.resolve();
    this.name = "Menu";
    this.defaultButtonImage = new Image2D(this.env, "DefaultButton", "none");
    this.logo = {
      name: "Logo",
      noLabel: true,
      back: new Image2D(this.env, "LogoBack", "none"),
      width: 1,
      clickable: false
    };
    this.backButton = {
      name: "Back",
      back: new Image2D(this.env, "BackButton", "none")
    };
    this.nextButton = {
      name: "Next",
      back: new Image2D(this.env, "NextButton", "none"),
      width: 0.25,
      textDirection: "vertical",
      textPosition: "middle",
      enabled: true
    };
    this.prevButton = {
      name: "Previous",
      back: new Image2D(this.env, "PrevButton", "none"),
      width: 0.25,
      height: 1,
      textDirection: "vertical",
      textPosition: "top",
      enabled: true
    };
    this.menuTitle = {
      name: "Menu",
      back: new Image2D(this.env, "MenuTitle", "none"),
      width: 0.25,
      textDirection: "vertical",
      textPosition: "top",
      clickable: false
    };
  }
  async load(description, prog) {
    this.menuFont = description.font;
    const imgs = description.images;
    const backButtonAsset = new AssetImage(imgs.backButton, Image_Jpeg, !this.env.DEBUG);
    const defaultButtonAsset = new AssetImage(imgs.defaultButton, Image_Jpeg, !this.env.DEBUG);
    const titleAsset = new AssetImage(imgs.title, Image_Jpeg, !this.env.DEBUG);
    const logoBackAsset = new AssetImage(imgs.logo.back, Image_Png, !this.env.DEBUG);
    let logoFrontAsset = null;
    if (imgs.logo.front) {
      logoFrontAsset = new AssetImage(imgs.logo.front, Image_Png, !this.env.DEBUG);
      this.logo.front = new Image2D(this.env, "LogoFront", "none", { transparent: true });
    }
    await progressTasksWeighted(prog, [
      [1, (prog2) => loadFont(this.menuFont, null, prog2)],
      [5, (prog2) => this.env.fetcher.assets(prog2, backButtonAsset, defaultButtonAsset, titleAsset, logoBackAsset, logoFrontAsset)]
    ]);
    this.backButton.back.setTextureMap(backButtonAsset.result);
    this.defaultButtonImage.setTextureMap(defaultButtonAsset.result);
    this.menuTitle.back.setTextureMap(titleAsset.result);
    this.nextButton.back.setTextureMap(titleAsset.result);
    this.prevButton.back.setTextureMap(titleAsset.result);
    this.logo.back.setTextureMap(logoBackAsset.result);
    if (imgs.logo.front) {
      this.logo.front.setTextureMap(logoFrontAsset.result);
      this.logo.front.width = 1;
    }
  }
  async showMenu(menuID, title, items, onClick, onBack, prog) {
    let pageSize = PAGE_SIZE;
    do {
      const rem = items.length % pageSize;
      if (rem === 0 || rem === pageSize - 1 || pageSize === Math.ceil(PAGE_SIZE / 2)) {
        break;
      } else {
        --pageSize;
      }
    } while (true);
    const index = this.lastMenuIndex.get(menuID) || 0;
    await this.showMenuInternal(menuID, title, items, pageSize, index, onClick, onBack, prog);
  }
  disableAll() {
    setTimeout(() => {
      for (const button of this.buttons) {
        button.disabled = true;
      }
    }, 10);
  }
  async showMenuInternal(menuID, title, items, pageSize, index, onClick, onBack, prog) {
    this.lastMenuIndex.set(menuID, index);
    await this.curBlowout;
    this.clear();
    this.menuTitle.text = title;
    const displayItems = [this.logo, this.menuTitle];
    if (index > 0) {
      displayItems.push(this.prevButton);
    }
    displayItems.push(...items.slice(index, index + Math.min(pageSize, items.length - index)));
    if (index < items.length - pageSize) {
      displayItems.push(this.nextButton);
    }
    const oldOnClick = onClick;
    onClick = (item) => {
      this.disableAll();
      oldOnClick(item);
    };
    if (onBack) {
      displayItems.push(this.backButton);
      const oldOnBack = onBack;
      onBack = () => {
        this.disableAll();
        oldOnBack();
      };
    }
    const onPrev = () => {
      this.disableAll();
      this.showMenuInternal(menuID, title, items, pageSize, index - pageSize, onClick, onBack);
    };
    const onNext = () => {
      this.disableAll();
      this.showMenuInternal(menuID, title, items, pageSize, index + pageSize, onClick, onBack);
    };
    const buttons = await progressOfArray(prog, displayItems, (item, prog2) => {
      if (item === this.backButton) {
        return this.createMenuItem(item, onBack, prog2);
      } else if (item === this.prevButton) {
        return this.createMenuItem(item, onPrev, prog2);
      } else if (item === this.nextButton) {
        return this.createMenuItem(item, onNext, prog2);
      } else {
        return this.createMenuItem(item, onClick, prog2);
      }
    });
    arrayReplace(this.buttons, ...buttons);
    const space = 0.05;
    const radius = 3;
    const midPoint = (this.buttons.length - 1) / 2;
    const l = Math.ceil(midPoint);
    const r = Math.floor(midPoint + 1);
    const left = this.buttons.slice(0, l).reverse();
    const mid = this.buttons.slice(l, r);
    const right = this.buttons.slice(r, this.buttons.length);
    let midWidth = 0;
    let a = 0;
    for (const button of mid) {
      midWidth += button.width + space;
      this.setButtonPosition(button, a, radius);
    }
    midWidth /= 2;
    a = -midWidth / radius;
    for (const button of left) {
      a -= 0.5 * (button.width + space) / radius;
      this.setButtonPosition(button, a, radius);
      a -= 0.5 * (button.width + space) / radius;
    }
    a = midWidth / radius;
    for (const button of right) {
      a += 0.5 * (button.width + space) / radius;
      this.setButtonPosition(button, a, radius);
      a += 0.5 * (button.width + space) / radius;
    }
    objGraph(this, ...this.buttons);
    await this.blowOut(false);
    for (const button of this.buttons) {
      button.back.frustumCulled = true;
    }
  }
  update(dt) {
    this.animator.update(dt);
  }
  setButtonPosition(button, a, radius) {
    const x = radius * Math.sin(a);
    const z = -radius * Math.cos(a);
    button.object.position.set(x, 0, z);
    button.object.lookAt(zero);
    button.startX = x;
    button.object.position.x = x - 10;
  }
  async createMenuItem(item, onClick, prog) {
    if (!item.back) {
      if (item.filePath) {
        item.back = new Image2D(this.env, `${item.name}-Background`, "none");
        const img = await this.env.fetcher.get(item.filePath).progress(prog).image().then(unwrapResponse);
        item.back.setTextureMap(img);
      } else {
        item.back = this.defaultButtonImage.clone();
      }
      item.back.frustumCulled = false;
    }
    if (!isGoodNumber(item.width)) {
      item.width = 0.5;
    }
    if (!isGoodNumber(item.height)) {
      item.height = 1;
    }
    if (!isString(item.textDirection)) {
      item.textDirection = "horizontal";
    }
    if (!isString(item.textPosition)) {
      item.textPosition = "bottom";
    }
    if (!isString(item.text)) {
      item.text = item.name;
    }
    const enabled = item.enabled !== false;
    if (item.text.length > 0) {
      if (!item.front && !item.noLabel) {
        const options = {
          textFillColor: enabled ? "white" : "dimgray",
          textDirection: item.textDirection,
          padding: {
            top: 0.025,
            right: 0.05,
            bottom: 0.025,
            left: 0.05
          },
          scale: 400,
          fontFamily: this.menuFont.fontFamily,
          fontSize: this.menuFont.fontSize,
          fontStyle: this.menuFont.fontStyle,
          fontVariant: this.menuFont.fontVariant,
          fontWeight: this.menuFont.fontWeight,
          maxWidth: item.width,
          maxHeight: item.height
        };
        const img = new TextMesh(this.env, item.text, "none", options);
        img.mesh.renderOrder = 1;
        img.addEventListener("redrawn", () => {
          const y = (img.image.height - item.height + 0.025) / 2;
          if (item.textPosition === "bottom") {
            img.position.y = y;
          } else {
            img.position.y = -y;
          }
        });
        img.position.z = -0.01;
        item.front = img;
      }
      if (item.front) {
        item.front.frustumCulled = false;
        if (item.front instanceof TextMesh) {
          item.front.image.value = item.text;
        }
      }
    }
    const button = new MenuItem(item.width, item.height, item.name, item.front, item.back);
    button.clickable = item.clickable !== false;
    button.enabled = enabled;
    if (button.clickable && isFunction(onClick)) {
      button.addEventListener("click", () => {
        this.curBlowout = this.blowOut(true);
        onClick(item);
      });
    }
    if (prog) {
      prog.end("button loaded");
    }
    return button;
  }
  async blowOut(d) {
    await Promise.all(this.buttons.map((child, i) => this.blowOutChild(child, i, d)));
    this.animator.clear();
  }
  async blowOutChild(child, i, d) {
    const wasDisabled = child.disabled;
    child.disabled = true;
    await this.animator.start(0.125 * i, 0.5, (t2) => {
      const st = clamp(d ? t2 : 1 - t2, 0, 1);
      child.object.position.x = child.startX - 10 * bump(st, 0.15);
    });
    child.disabled = wasDisabled;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/widgets/widgets.js
function widgetSetEnabled(obj2, enabled) {
  if (obj2.element instanceof HTMLButtonElement) {
    obj2.element.disabled = !enabled;
  }
  objectSetEnabled(obj2, enabled);
}
var Widget = class {
  constructor(element, object, displayType) {
    this.element = element;
    this.object = object;
    this.displayType = displayType;
  }
  get name() {
    return this.object.name;
  }
  addEventListener(type, listener, options) {
    this.element.addEventListener(type, listener, options);
  }
  dispatchEvent(event) {
    return this.element.dispatchEvent(event);
  }
  removeEventListener(type, callback, options) {
    this.element.removeEventListener(type, callback, options);
  }
  click() {
    this.element.click();
  }
  get visible() {
    return elementIsDisplayed(this);
  }
  set visible(visible) {
    elementSetDisplay(this, visible, this.displayType);
    this.object.visible = visible;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/widgets/ButtonImageWidget.js
var ButtonImageWidget = class extends Widget {
  constructor(buttons, setName, iconName) {
    const t2 = Title_attr(`${setName} ${iconName}`);
    super(ButtonPrimary(t2, Img(t2, Src(buttons.getImageSrc(setName, iconName)))), obj(`${name}-button`), "inline-block");
    this.mesh = null;
    this.load(buttons, setName, iconName);
  }
  async load(buttons, setName, iconName) {
    this.mesh = await buttons.getMeshButton(setName, iconName, 0.2);
    this.mesh.disabled = this.disabled;
    objGraph(this, this.mesh);
    this.mesh.object.visible = this.visible;
    this.mesh.addEventListener("click", () => {
      this.element.click();
    });
  }
  get disabled() {
    return this.element.disabled;
  }
  set disabled(v) {
    this.element.disabled = v;
    if (this.mesh) {
      this.mesh.disabled = v;
    }
  }
  get visible() {
    return super.visible;
  }
  set visible(v) {
    super.visible = v;
    if (this.mesh) {
      objectSetVisible(this.mesh, v);
    }
  }
};

// src/vr-apps/menu/MainMenu.ts
var MainMenuSelectionEvent = class extends TypedEvent {
  constructor(scenarioID) {
    super("select");
    this.scenarioID = scenarioID;
  }
};
var MainMenuLobbyEvent = class extends TypedEvent {
  constructor() {
    super("lobby");
  }
};
var MainMenu = class extends Application {
  menu;
  node2MenuItem = /* @__PURE__ */ new Map();
  menuItem2Node = /* @__PURE__ */ new Map();
  images = /* @__PURE__ */ new Map();
  lobbyButton = null;
  menuDesc = null;
  curMenu = null;
  menuRoot = null;
  constructor(env) {
    super(env);
    this.lobbyButton = new ButtonImageWidget(this.env.uiButtons, "ui", "lobby");
    this.menu = new Menu(this.env);
    this.env.addScopedEventListener(this, "update", (evt) => this.menu.update(evt.dt));
    this.env.addScopedEventListener(this, "dialogshowing", (evt) => widgetSetEnabled(this.lobbyButton, !evt.showing));
    this.lobbyButton.addEventListener("click", () => this.env.withConfirmation(
      "Confirm return to lobby",
      "Are you sure you want to return to the lobby?",
      () => this.dispatchEvent(new MainMenuLobbyEvent())
    ));
    Object.seal(this);
  }
  async init(params) {
    this.menuDesc = params.get("config");
    await super.init(params);
  }
  async load(prog) {
    await progressTasksWeighted(prog, [
      [5, (prog2) => this.menu.load(this.menuDesc, prog2)],
      [1, (prog2) => this.loadMenuData(prog2)]
    ]);
    objGraph(this.env.worldUISpace, this.menu);
    this.env.xrUI.addItem(this.lobbyButton, { x: 1, y: 1, scale: 0.5 });
    HtmlRender(this.env.screenUISpace.topRight, this.lobbyButton);
  }
  async loadMenuData(prog) {
    this.destroyMenuItems();
    const menuItems = await this.env.fetcher.get("/vr/menu" + (location.search.includes("all") ? "/1" : "")).progress(prog).object().then(unwrapResponse);
    for (const menuItem of menuItems) {
      if (isDefined(menuItem.audioElementCount)) {
        this.env.audio.preparePool(menuItem.audioElementCount);
      }
    }
    const organizations = Array.from(new Set(menuItems.map((m) => m.organizationName)));
    const orgIds = /* @__PURE__ */ new Map();
    if (organizations.length > 1) {
      const topLevel = menuItems.filter((m) => isNullOrUndefined(m.parentID));
      const topLevelLookup = new PriorityList();
      for (const m of topLevel) {
        topLevelLookup.add(m.organizationName, m);
      }
      for (let i = 0; i < organizations.length; ++i) {
        const label = organizations[i];
        const id = -(i + 1);
        const data = {
          id,
          label,
          order: i,
          organizationName: label
        };
        orgIds.set(label, id);
        menuItems.push(data);
        for (const m of topLevelLookup.get(label)) {
          m.parentID = id;
        }
      }
    }
    const map = makeLookup(menuItems, (m) => m.id);
    this.menuRoot = buildTree(
      menuItems,
      (v) => map.get(v.parentID),
      (v) => v && v.order || -1
    );
    for (const node of this.menuRoot.breadthFirst()) {
      const value = node.value;
      if (value !== null) {
        const item = {
          name: value.label,
          filePath: value.filePath,
          enabled: true
        };
        this.node2MenuItem.set(node, item);
        this.menuItem2Node.set(item, node);
      }
    }
  }
  async loadMenuItems(parent, prog) {
    const imageSet = Array.from(new Set(parent.children.map((m) => m.value.filePath))).filter((f) => isDefined(f) && !this.images.has(f));
    await progressOfArray(
      prog,
      imageSet,
      async (f, prog2) => this.images.set(f, await this.env.fetcher.get(f).progress(prog2).image().then(unwrapResponse))
    );
    for (const child of parent.children) {
      const item = this.node2MenuItem.get(child);
      if (isNullOrUndefined(item.back) && this.images.has(item.filePath)) {
        const imgMesh = new Image2D(this.env, item.filePath + item.name, "none");
        imgMesh.setTextureMap(this.images.get(item.filePath));
        imgMesh.mesh.frustumCulled = false;
        item.back = imgMesh;
      }
    }
  }
  async showing(prog) {
    const selection = this.curMenu || this.menuRoot;
    await progressTasksWeighted(prog, [
      [10, async (prog2) => {
        this.env.skybox.rotation = null;
        const image2 = await this.env.fetcher.get("/vr/LandingPageImage").progress(prog2).image().then(unwrapResponse);
        return this.env.skybox.setImage("/vr/LandingPageImage", image2);
      }],
      [1, (prog2) => this.showMenuSelection(selection, prog2)]
    ]);
    this.menu.visible = true;
    this.lobbyButton.visible = false;
    this.join("lobby");
  }
  hiding() {
    this.menu.visible = false;
    this.lobbyButton.visible = true;
  }
  get visible() {
    return this.menu.visible;
  }
  dispose() {
    this.env.removeScope(this);
    this.env.worldUISpace.remove(this.menu);
    cleanup(this.menu);
    this.menu.removeFromParent();
    this.destroyMenuItems();
  }
  destroyMenuItems() {
    for (const img of this.images.values()) {
      dispose(img);
    }
    this.images.clear();
    this.node2MenuItem.clear();
    this.menuItem2Node.clear();
  }
  async showMenuSelection(selection, prog) {
    this.curMenu = selection;
    const [imgProg, showProg] = progressSplitWeighted(prog, [10, 1]);
    await this.loadMenuItems(selection, imgProg);
    const menuItems = selection.children.map((child) => this.node2MenuItem.get(child));
    const onBack = selection.isRoot ? null : () => this.selectMenuItem(selection.parent);
    let menuID = 0;
    let label = "Menu";
    if (selection.value) {
      menuID = selection.value.id;
      label = selection.value.label;
    }
    await this.menu.showMenu(
      menuID,
      label,
      menuItems,
      (item) => {
        const node = this.menuItem2Node.get(item);
        this.selectMenuItem(node);
      },
      onBack,
      showProg
    );
  }
  async selectMenuItem(selection, prog) {
    if (selection.isLeaf) {
      this.dispatchEvent(new MainMenuSelectionEvent(selection.value.scenarioID));
    } else {
      await this.showMenuSelection(selection, prog);
    }
  }
};

// src/vr-apps/menu/index.ts
var menu_default = MainMenu;
export {
  menu_default as default
};
//# sourceMappingURL=index.js.map
