var __defProp = Object.defineProperty;
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/onUserGesture.js
var USER_GESTURE_EVENTS = [
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
function onUserGesture(callback, perpetual = false) {
  const check = async (evt) => {
    if (evt.isTrusted) {
      if (!perpetual) {
        for (const gesture of USER_GESTURE_EVENTS) {
          window.removeEventListener(gesture, check);
        }
      }
      callback();
    }
  };
  for (const gesture of USER_GESTURE_EVENTS) {
    window.addEventListener(gesture, check);
  }
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/typeChecks.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/arrays.js
function isIComparable(obj) {
  return isObject(obj) && "compareTo" in obj && isFunction(obj.compareTo);
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/GraphNode.js
var GraphNode = class extends BaseGraphNode {
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/IAudioNode.js
function isEndpoint(obj) {
  return isDefined(obj) && "_resolveInput" in obj;
}
function isIAudioNode(obj) {
  return isEndpoint(obj) && "_resolveOutput" in obj;
}

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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/BaseNode.js
var BaseNode = class extends TypedEventTarget {
  get name() {
    return this._name;
  }
  set name(v) {
    this._name = v;
    this.context._name(this, v);
  }
  constructor(nodeType, context) {
    super();
    this.nodeType = nodeType;
    this.context = context;
    this._name = null;
    this.disposed = false;
  }
  dispose() {
    if (!this.disposed) {
      this.disposed = true;
      this.onDisposing();
    }
  }
  onDisposing() {
  }
  isConnected(dest, output, input) {
    return this.context._isConnected(this, dest, output, input);
  }
  resolveOutput(output) {
    let resolution = {
      source: this,
      output
    };
    while (isIAudioNode(resolution.source)) {
      resolution = resolution.source._resolveOutput(resolution.output);
    }
    return resolution;
  }
  resolveInput(input) {
    let resolution = {
      destination: this,
      input
    };
    while (isEndpoint(resolution.destination)) {
      resolution = resolution.destination._resolveInput(resolution.input);
    }
    return resolution;
  }
  toggle(dest, outp, inp) {
    this._toggle(dest, outp, inp);
  }
  _toggle(dest, outp, inp) {
    if (this.isConnected(dest, outp, inp)) {
      this._disconnect(dest, outp, inp);
    } else {
      return this._connect(dest, outp, inp);
    }
  }
  connect(dest, outp, inp) {
    return this._connect(dest, outp, inp);
  }
  _connect(dest, outp, inp) {
    return this.context._connect(this, dest, outp, inp);
  }
  disconnect(destinationOrOutput, outp, inp) {
    this._disconnect(destinationOrOutput, outp, inp);
  }
  _disconnect(destinationOrOutput, outp, inp) {
    this.context._disconnect(this, destinationOrOutput, outp, inp);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperAudioNode.js
var JuniperAudioNode = class extends BaseNode {
  constructor(type, context, _node) {
    super(type, context);
    this._node = _node;
    this.context._init(this._node, this.nodeType);
  }
  onDisposing() {
    this.disconnect();
    this.context._dispose(this._node);
    super.onDisposing();
  }
  parent(param) {
    this.context._parent(this, param);
  }
  get channelCount() {
    return this._node.channelCount;
  }
  set channelCount(v) {
    this._node.channelCount = v;
  }
  get channelCountMode() {
    return this._node.channelCountMode;
  }
  set channelCountMode(v) {
    this._node.channelCountMode = v;
  }
  get channelInterpretation() {
    return this._node.channelInterpretation;
  }
  set channelInterpretation(v) {
    this._node.channelInterpretation = v;
  }
  get numberOfInputs() {
    return this._node.numberOfInputs;
  }
  get numberOfOutputs() {
    return this._node.numberOfOutputs;
  }
  _resolveInput(input) {
    return {
      destination: this._node,
      input
    };
  }
  _resolveOutput(output) {
    return {
      source: this._node,
      output
    };
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperAnalyserNode.js
var JuniperAnalyserNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("analyser", context, new AnalyserNode(context, options));
  }
  get fftSize() {
    return this._node.fftSize;
  }
  set fftSize(v) {
    this._node.fftSize = v;
  }
  get frequencyBinCount() {
    return this._node.frequencyBinCount;
  }
  get maxDecibels() {
    return this._node.maxDecibels;
  }
  set maxDecibels(v) {
    this._node.maxDecibels = v;
  }
  get minDecibels() {
    return this._node.minDecibels;
  }
  set minDecibels(v) {
    this._node.minDecibels = v;
  }
  get smoothingTimeConstant() {
    return this._node.smoothingTimeConstant;
  }
  set smoothingTimeConstant(v) {
    this._node.smoothingTimeConstant = v;
  }
  getByteFrequencyData(array) {
    this._node.getByteFrequencyData(array);
  }
  getByteTimeDomainData(array) {
    this._node.getByteTimeDomainData(array);
  }
  getFloatFrequencyData(array) {
    this._node.getFloatFrequencyData(array);
  }
  getFloatTimeDomainData(array) {
    this._node.getFloatTimeDomainData(array);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperAudioParam.js
var JuniperAudioParam = class {
  get name() {
    return this._name;
  }
  set name(v) {
    this._name = v;
    this.context._name(this, v);
  }
  constructor(nodeType, context, param) {
    this.nodeType = nodeType;
    this.context = context;
    this.param = param;
    this._name = null;
    this.disposed = false;
    this.context._init(this.param, this.nodeType);
  }
  dispose() {
    if (!this.disposed) {
      this.disposed = true;
      this.onDisposing();
    }
  }
  onDisposing() {
    this.context._dispose(this.param);
  }
  get automationRate() {
    return this.param.automationRate;
  }
  set automationRate(v) {
    this.param.automationRate = v;
  }
  get defaultValue() {
    return this.param.defaultValue;
  }
  get maxValue() {
    return this.param.maxValue;
  }
  get minValue() {
    return this.param.minValue;
  }
  get value() {
    return this.param.value;
  }
  set value(v) {
    this.param.value = v;
  }
  cancelAndHoldAtTime(cancelTime) {
    this.param.cancelAndHoldAtTime(cancelTime);
    return this;
  }
  cancelScheduledValues(cancelTime) {
    this.param.cancelScheduledValues(cancelTime);
    return this;
  }
  exponentialRampToValueAtTime(value, endTime) {
    this.param.exponentialRampToValueAtTime(value, endTime);
    return this;
  }
  linearRampToValueAtTime(value, endTime) {
    this.param.linearRampToValueAtTime(value, endTime);
    return this;
  }
  setTargetAtTime(target, startTime, timeConstant) {
    this.param.setTargetAtTime(target, startTime, timeConstant);
    return this;
  }
  setValueAtTime(value, startTime) {
    this.param.setValueAtTime(value, startTime);
    return this;
  }
  setValueCurveAtTime(values, startTime, duration) {
    this.param.setValueCurveAtTime(values, startTime, duration);
    return this;
  }
  _resolveInput() {
    return {
      destination: this.param
    };
  }
  resolveInput() {
    return this._resolveInput();
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperAudioBufferSourceNode.js
var JuniperAudioBufferSourceNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("audio-buffer-source", context, new AudioBufferSourceNode(context, options));
    this._node.addEventListener("ended", () => this.dispatchEvent(new TypedEvent("ended")));
    this.parent(this.playbackRate = new JuniperAudioParam("playbackRate", context, this._node.playbackRate));
    this.parent(this.detune = new JuniperAudioParam("detune", context, this._node.detune));
  }
  get buffer() {
    return this._node.buffer;
  }
  set buffer(v) {
    this._node.buffer = v;
  }
  get loop() {
    return this._node.loop;
  }
  set loop(v) {
    this._node.loop = v;
  }
  get loopEnd() {
    return this._node.loopEnd;
  }
  set loopEnd(v) {
    this._node.loopEnd = v;
  }
  get loopStart() {
    return this._node.loopStart;
  }
  set loopStart(v) {
    this._node.loopStart = v;
  }
  get onended() {
    return this._node.onended;
  }
  set onended(v) {
    this._node.onended = v;
  }
  start(when, offset, duration) {
    this._node.start(when, offset, duration);
  }
  stop(when) {
    this._node.stop(when);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperAudioDestinationNode.js
var JuniperAudioDestinationNode = class extends JuniperAudioNode {
  constructor(context, destination) {
    super("destination", context, destination);
  }
  get maxChannelCount() {
    return this._node.maxChannelCount;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperBiquadFilterNode.js
var JuniperBiquadFilterNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("biquad-filter", context, new BiquadFilterNode(context, options));
    this.parent(this.Q = new JuniperAudioParam("Q", this.context, this._node.Q));
    this.parent(this.detune = new JuniperAudioParam("detune", this.context, this._node.detune));
    this.parent(this.frequency = new JuniperAudioParam("frequency", this.context, this._node.frequency));
    this.parent(this.gain = new JuniperAudioParam("gain", this.context, this._node.gain));
  }
  get type() {
    return this._node.type;
  }
  set type(v) {
    this._node.type = v;
  }
  getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
    this._node.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperChannelMergerNode.js
var JuniperChannelMergerNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("channel-merger", context, new ChannelMergerNode(context, options));
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperChannelSplitterNode.js
var JuniperChannelSplitterNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("channel-splitter", context, new ChannelSplitterNode(context, options));
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperConstantSourceNode.js
var JuniperConstantSourceNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("constant-source", context, new ConstantSourceNode(context, options));
    this._node.addEventListener("ended", () => this.dispatchEvent(new TypedEvent("ended")));
    this.parent(this.offset = new JuniperAudioParam("offset", this.context, this._node.offset));
  }
  get onended() {
    return this._node.onended;
  }
  set onended(v) {
    this._node.onended = v;
  }
  start(when) {
    this._node.start(when);
  }
  stop(when) {
    this._node.stop(when);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperConvolverNode.js
var JuniperConvolverNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("convolver", context, new ConvolverNode(context, options));
  }
  get buffer() {
    return this._node.buffer;
  }
  set buffer(v) {
    this._node.buffer = v;
  }
  get normalize() {
    return this._node.normalize;
  }
  set normalize(v) {
    this._node.normalize = v;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperDelayNode.js
var JuniperDelayNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("delay", context, new DelayNode(context, options));
    this.parent(this.delayTime = new JuniperAudioParam("delay", this.context, this._node.delayTime));
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperDynamicsCompressorNode.js
var JuniperDynamicsCompressorNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("dynamics-compressor", context, new DynamicsCompressorNode(context, options));
    this.parent(this.attack = new JuniperAudioParam("attack", this.context, this._node.attack));
    this.parent(this.knee = new JuniperAudioParam("knee", this.context, this._node.knee));
    this.parent(this.ratio = new JuniperAudioParam("ratio", this.context, this._node.ratio));
    this.parent(this.release = new JuniperAudioParam("release", this.context, this._node.release));
    this.parent(this.threshold = new JuniperAudioParam("threshold", this.context, this._node.threshold));
  }
  get reduction() {
    return this._node.reduction;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperGainNode.js
var JuniperGainNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("gain", context, new GainNode(context, options));
    this.parent(this.gain = new JuniperAudioParam("gain", this.context, this._node.gain));
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperIIRFilterNode.js
var JuniperIIRFilterNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("iir-filter", context, new IIRFilterNode(context, options));
  }
  getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
    this._node.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperMediaElementAudioSourceNode.js
var JuniperMediaElementAudioSourceNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("media-element-audio-source", context, new MediaElementAudioSourceNode(context, options));
  }
  get mediaElement() {
    return this._node.mediaElement;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperMediaStreamAudioDestinationNode.js
var JuniperMediaStreamAudioDestinationNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("media-stream-audio-destination", context, new MediaStreamAudioDestinationNode(context, options));
  }
  get stream() {
    return this._node.stream;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/identity.js
function identity(item) {
  return item;
}
function alwaysTrue() {
  return true;
}
function alwaysFalse() {
  return false;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/strings/stringRandom.js
var DEFAULT_CHAR_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
function stringRandom(length4, charSet) {
  if (length4 < 0) {
    throw new Error("Length must be greater than 0");
  }
  if (isNullOrUndefined(charSet)) {
    charSet = DEFAULT_CHAR_SET;
  }
  let str3 = "";
  for (let i = 0; i < length4; ++i) {
    const idx = Math.floor(Math.random() * charSet.length);
    str3 += charSet[idx];
  }
  return str3;
}

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
      let set4 = warnings.get(elem.tagName);
      if (!set4) {
        warnings.set(elem.tagName, set4 = /* @__PURE__ */ new Set());
      }
      if (!set4.has(this.key)) {
        set4.add(this.key);
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
function isAttr(obj) {
  return obj instanceof HtmlAttr;
}
function AutoPlay(value) {
  return attr("autoplay", value, false, "audio", "video");
}
function ClassList(...values) {
  values = values.filter(identity);
  return attr("CLASS_LIST", (element) => element.classList.add(...values), false);
}
function Controls(value) {
  return attr("controls", value, false, "audio", "video");
}
function Height(value) {
  return attr("height", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}
function Loop(value) {
  return attr("loop", value, false, "audio", "bgsound", "marquee", "video");
}
function Muted(value) {
  return attr("muted", value, false, "audio", "video");
}
function Rel(value) {
  return attr("rel", value, false, "a", "area", "link");
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
function SrcObject(value) {
  return attr("srcObject", value, false, "audio", "video");
}
function Type(value) {
  if (!isString(value)) {
    value = value.value;
  }
  return attr("type", value, false, "button", "input", "command", "embed", "link", "object", "script", "source", "style", "menu");
}
function Value(value) {
  return attr("value", value, false, "button", "data", "input", "li", "meter", "option", "progress", "param");
}
function Width(value) {
  return attr("width", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/css.js
function rgb(...v) {
  return `rgb(${v.join(", ")})`;
}
var Prop = class {
  constructor(_value) {
    this._value = _value;
  }
  get value() {
    return this._value;
  }
  toString() {
    return this.value;
  }
};
var KeyValueProp = class extends Prop {
  constructor(_name, sep, value) {
    super(value);
    this._name = _name;
    this.sep = sep;
  }
  get name() {
    return this._name;
  }
  toString() {
    return this.name + this.sep + this.value + ";";
  }
};
var CssDeclareProp = class extends KeyValueProp {
  constructor(key, value) {
    super(key, ": ", value);
  }
};
var CssElementStyleProp = class extends CssDeclareProp {
  constructor(key, value) {
    super(key.replace(/[A-Z]/g, (m) => `-${m.toLocaleLowerCase()}`), value.toString());
    this.key = key;
    this.priority = "";
  }
  /**
   * Set the attribute value on an HTMLElement
   * @param elem - the element on which to set the attribute.
   */
  applyToElement(elem) {
    elem.style[this.key] = this.value + this.priority;
  }
  important() {
    this.priority = " !important";
    return this;
  }
  get value() {
    return super.value + this.priority;
  }
};
function cursor(v) {
  return new CssElementStyleProp("cursor", v);
}
function display(v) {
  return new CssElementStyleProp("display", v);
}
function opacity(v) {
  return new CssElementStyleProp("opacity", v);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/once.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/dist/application.js
var application = /* @__PURE__ */ specialize("application");
var Application_Javascript = /* @__PURE__ */ application("javascript", "js");
var Application_Json = /* @__PURE__ */ application("json", "json");
var Application_Wasm = /* @__PURE__ */ application("wasm", "wasm");

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/dist/text.js
var text = /* @__PURE__ */ specialize("text");
var Text_Css = /* @__PURE__ */ text("css", "css");
var Text_Plain = /* @__PURE__ */ text("plain", "txt", "text", "conf", "def", "list", "log", "in");
var Text_Xml = /* @__PURE__ */ text("xml");

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/dist/video.js
var video = /* @__PURE__ */ specialize("video");
var Video_Vendor_Mpeg_Dash_Mpd = /* @__PURE__ */ video("vnd.mpeg.dash.mpd", "mpd");

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/tags.js
function isErsatzElement(obj) {
  if (!isObject(obj)) {
    return false;
  }
  const elem = obj;
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
function isIElementAppliable(obj) {
  return isObject(obj) && "applyToElement" in obj && isFunction(obj.applyToElement);
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
function getInput(selector) {
  return getElement(selector);
}
function HtmlTag(name, ...rest) {
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
  if (elem && elem.tagName !== name.toUpperCase()) {
    console.warn(`Expected a "${name.toUpperCase()}" element but found a "${elem.tagName}".`);
  }
  if (!elem) {
    elem = document.createElement(name);
  }
  HtmlRender(elem, ...rest);
  return elem;
}
async function mediaElementCan(type, elem, prog) {
  if (isDefined(prog)) {
    prog.start();
  }
  const expectedState = type === "canplay" ? elem.HAVE_CURRENT_DATA : elem.HAVE_ENOUGH_DATA;
  if (elem.readyState >= expectedState) {
    return true;
  }
  try {
    await once(elem, type, "error");
    return true;
  } catch (err) {
    console.warn(elem.error, err);
    return false;
  } finally {
    if (isDefined(prog)) {
      prog.end();
    }
  }
}
function mediaElementCanPlayThrough(elem, prog) {
  return mediaElementCan("canplaythrough", elem, prog);
}
function Audio2(...rest) {
  return HtmlTag("audio", ...rest);
}
function BR() {
  return HtmlTag("br");
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
function Div(...rest) {
  return HtmlTag("div", ...rest);
}
function Img(...rest) {
  return HtmlTag("img", ...rest);
}
function Link(...rest) {
  return HtmlTag("link", ...rest);
}
function Option(...rest) {
  return HtmlTag("option", ...rest);
}
function Script(...rest) {
  return HtmlTag("script", ...rest);
}
function Select(...rest) {
  return HtmlTag("select", ...rest);
}
function Video(...rest) {
  return HtmlTag("video", ...rest);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/util.js
var hasAudioContext = "AudioContext" in globalThis;
var hasAudioListener = hasAudioContext && "AudioListener" in globalThis;
var hasOldAudioListener = hasAudioListener && "setPosition" in AudioListener.prototype;
var hasNewAudioListener = hasAudioListener && "positionX" in AudioListener.prototype;
var hasStreamSources = "createMediaStreamSource" in AudioContext.prototype;
var canCaptureStream = /* @__PURE__ */ isFunction(HTMLMediaElement.prototype.captureStream) || isFunction(HTMLMediaElement.prototype.mozCaptureStream);

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperMediaStreamAudioSourceNode.js
var JuniperMediaStreamAudioSourceNode = class extends JuniperAudioNode {
  constructor(context, options) {
    const element = Audio2(Controls(false), Muted(hasStreamSources), AutoPlay(true), Loop(false), display("none"), SrcObject(options.mediaStream));
    let node;
    if (hasStreamSources) {
      node = new MediaStreamAudioSourceNode(context, options);
    } else {
      node = new MediaElementAudioSourceNode(context, {
        mediaElement: element
      });
    }
    super("media-stream-audio-source", context, node);
    this._stream = options.mediaStream;
    this._element = element;
  }
  onDisposing() {
    this._element.pause();
    super.onDisposing();
  }
  get mediaStream() {
    return this._stream;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperOscillatorNode.js
var JuniperOscillatorNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("oscillator", context, new OscillatorNode(context, options));
    this._node.addEventListener("ended", () => this.dispatchEvent(new TypedEvent("ended")));
    this.parent(this.detune = new JuniperAudioParam("detune", this.context, this._node.detune));
    this.parent(this.frequency = new JuniperAudioParam("frequency", this.context, this._node.frequency));
  }
  get type() {
    return this._node.type;
  }
  set type(v) {
    this._node.type = v;
  }
  get onended() {
    return this._node.onended;
  }
  set onended(v) {
    this._node.onended = v;
  }
  setPeriodicWave(periodicWave) {
    this._node.setPeriodicWave(periodicWave);
  }
  start(when) {
    this._node.start(when);
  }
  stop(when) {
    this._node.stop(when);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperPannerNode.js
var JuniperPannerNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("panner", context, new PannerNode(context, options));
    this.parent(this.positionX = new JuniperAudioParam("positionX", this.context, this._node.positionX));
    this.parent(this.positionY = new JuniperAudioParam("positionY", this.context, this._node.positionY));
    this.parent(this.positionZ = new JuniperAudioParam("positionZ", this.context, this._node.positionZ));
    this.parent(this.orientationX = new JuniperAudioParam("orientationX", this.context, this._node.orientationX));
    this.parent(this.orientationY = new JuniperAudioParam("orientationY", this.context, this._node.orientationY));
    this.parent(this.orientationZ = new JuniperAudioParam("orientationZ", this.context, this._node.orientationZ));
  }
  get coneInnerAngle() {
    return this._node.coneInnerAngle;
  }
  set coneInnerAngle(v) {
    this._node.coneInnerAngle = v;
  }
  get coneOuterAngle() {
    return this._node.coneOuterAngle;
  }
  set coneOuterAngle(v) {
    this._node.coneOuterAngle = v;
  }
  get coneOuterGain() {
    return this._node.coneOuterGain;
  }
  set coneOuterGain(v) {
    this._node.coneOuterGain = v;
  }
  get distanceModel() {
    return this._node.distanceModel;
  }
  set distanceModel(v) {
    this._node.distanceModel = v;
  }
  get maxDistance() {
    return this._node.maxDistance;
  }
  set maxDistance(v) {
    this._node.maxDistance = v;
  }
  get panningModel() {
    return this._node.panningModel;
  }
  set panningModel(v) {
    this._node.panningModel = v;
  }
  get refDistance() {
    return this._node.refDistance;
  }
  set refDistance(v) {
    this._node.refDistance = v;
  }
  get rolloffFactor() {
    return this._node.rolloffFactor;
  }
  set rolloffFactor(v) {
    this._node.rolloffFactor = v;
  }
  setOrientation(x, y, z) {
    this._node.setOrientation(x, y, z);
  }
  setPosition(x, y, z) {
    this._node.setPosition(x, y, z);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperStereoPannerNode.js
var JuniperStereoPannerNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("stereo-panner", context, new StereoPannerNode(context, options));
    this.parent(this.pan = new JuniperAudioParam("pan", this.context, this._node.pan));
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperWaveShaperNode.js
var JuniperWaveShaperNode = class extends JuniperAudioNode {
  constructor(context, options) {
    super("wave-shaper", context, new WaveShaperNode(context, options));
  }
  get curve() {
    return this._node.curve;
  }
  set curve(v) {
    this._node.curve = v;
  }
  get oversample() {
    return this._node.oversample;
  }
  set oversample(v) {
    this._node.oversample = v;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/context/JuniperAudioContext.js
if (!("AudioContext" in globalThis) && "webkitAudioContext" in globalThis) {
  globalThis.AudioContext = globalThis.webkitAudioContext;
}
if (!("OfflineAudioContext" in globalThis) && "webkitOfflineAudioContext" in globalThis) {
  globalThis.OfflineAudioContext = globalThis.webkitOfflineAudioContext;
}
var NodeInfo = class {
  constructor(type, name) {
    this.type = type;
    this.name = name;
    this.connections = /* @__PURE__ */ new Set();
  }
};
function isMatchingConnection(conn, type, destination, output, input) {
  return conn.type === type && (isNullOrUndefined(destination) || destination === conn.destination) && (isNullOrUndefined(output) || output === conn.output) && (isNullOrUndefined(input) || input === conn.input);
}
function resolveInput(dest, inp) {
  let destination = null;
  let input = null;
  if (isDefined(dest)) {
    ({ destination, input } = dest.resolveInput(inp));
  }
  return { destination, input };
}
var JuniperAudioContext = class extends AudioContext {
  get ready() {
    return this._ready;
  }
  get isReady() {
    return this._ready.finished && this._ready.resolved;
  }
  constructor(contextOptions) {
    super(contextOptions);
    this.counters = /* @__PURE__ */ new Map();
    this.nodes = /* @__PURE__ */ new Map();
    this._ready = new Task();
    this._destination = new JuniperAudioDestinationNode(this, super.destination);
    if (this.state === "running") {
      this._ready.resolve();
    } else if (this.state === "closed") {
      this.resume().then(() => this._ready.resolve());
    } else {
      onUserGesture(() => this.resume().then(() => this._ready.resolve()));
    }
    this.ready.then(() => console.log("Audio is now ready"));
  }
  _init(node, type) {
    if (!this.nodes.has(node)) {
      if (!this.counters.has(type)) {
        this.counters.set(type, 0);
      }
      const count = this.counters.get(type);
      const name = `${type}-${count}`;
      this.nodes.set(node, new NodeInfo(type, name));
      if (isEndpoint(node)) {
        node.name = name;
      }
      this.counters.set(type, count + 1);
    }
  }
  _name(dest, name) {
    const { destination } = resolveInput(dest);
    if (this.nodes.has(destination)) {
      const info = this.nodes.get(destination);
      info.name = `${name}-${info.type}`;
    }
  }
  _dispose(node) {
    this.nodes.delete(node);
  }
  _isConnected(src, dest, outp, inp) {
    const { source, output } = src.resolveOutput(outp);
    const { destination, input } = resolveInput(dest, inp);
    if (isNullOrUndefined(source) || !this.nodes.has(source)) {
      return null;
    } else {
      const info = this.nodes.get(source);
      for (const conn of info.connections) {
        if (isMatchingConnection(conn, "conn", destination, output, input)) {
          return true;
        }
      }
      return false;
    }
  }
  _parent(src, dest) {
    const { source } = src.resolveOutput();
    const { destination } = resolveInput(dest);
    if (this.nodes.has(source)) {
      const conns = this.nodes.get(source).connections;
      conns.add({
        type: "parent",
        src,
        dest,
        destination,
        source
      });
    }
  }
  _unparent(src, dest) {
    const { source } = src.resolveOutput();
    const { destination } = resolveInput(dest);
    if (this.nodes.has(source)) {
      const conns = this.nodes.get(source).connections;
      const toDelete = /* @__PURE__ */ new Set();
      for (const conn of conns) {
        if (isMatchingConnection(conn, "parent", destination)) {
          toDelete.add(conn);
        }
      }
      for (const conn of toDelete) {
        conns.delete(conn);
      }
    }
  }
  _getConnections(node) {
    if (!this.nodes.has(node)) {
      return null;
    }
    return this.nodes.get(node).connections;
  }
  _connect(src, dest, outp, inp) {
    const { source, output } = src.resolveOutput(outp);
    const { destination, input } = resolveInput(dest, inp);
    if (this.nodes.has(source)) {
      const conns = this.nodes.get(source).connections;
      let matchFound = false;
      for (const conn of conns) {
        if (isMatchingConnection(conn, "conn", destination, output, input)) {
          matchFound = true;
        }
      }
      if (!matchFound) {
        conns.add({
          type: "conn",
          src,
          dest,
          outp,
          inp,
          source,
          destination,
          output,
          input
        });
      }
    }
    if (destination instanceof AudioNode) {
      dest = dest;
      if (isDefined(input)) {
        source.connect(destination, output, input);
        return dest;
      } else if (isDefined(output)) {
        source.connect(destination, output);
        return dest;
      } else {
        source.connect(destination);
        return dest;
      }
    } else if (destination instanceof AudioParam) {
      if (isDefined(output)) {
        source.connect(destination, output);
      } else if (isDefined(destination)) {
        source.connect(destination);
      } else {
        assertNever(destination);
      }
    } else {
      assertNever(destination);
    }
  }
  _disconnect(src, destinationOrOutput, outp, inp) {
    let dest;
    if (isNumber(destinationOrOutput)) {
      dest = void 0;
      outp = destinationOrOutput;
    } else {
      dest = destinationOrOutput;
    }
    const { source, output } = src.resolveOutput(outp);
    const { destination, input } = resolveInput(dest, inp);
    if (this.nodes.has(source)) {
      const conns = this.nodes.get(source).connections;
      const toDelete = /* @__PURE__ */ new Set();
      for (const conn of conns) {
        if (isMatchingConnection(conn, "conn", destination, output, input)) {
          toDelete.add(conn);
        }
      }
      for (const conn of toDelete) {
        conns.delete(conn);
      }
    }
    if (destination instanceof AudioNode) {
      if (isDefined(inp)) {
        source.disconnect(destination, outp, inp);
      } else if (isDefined(outp)) {
        source.disconnect(destination, outp);
      } else if (isDefined(destination)) {
        source.disconnect(destination);
      } else {
        source.disconnect();
      }
    } else if (isDefined(outp)) {
      source.disconnect(destination, outp);
    } else if (isDefined(destination)) {
      source.disconnect(destination);
    } else {
      source.disconnect();
    }
  }
  getAudioGraph(includeParams) {
    const nodes = /* @__PURE__ */ new Map();
    for (const [node, info] of this.nodes) {
      const nodeClass = node instanceof AudioNode ? "node" : node instanceof AudioParam ? "param" : "unknown";
      if (includeParams || nodeClass !== "param") {
        nodes.set(node, new GraphNode({
          name: info.name,
          type: info.type,
          nodeClass
        }));
      }
    }
    for (const [source, info] of this.nodes) {
      const branch = nodes.get(source);
      for (const child of info.connections) {
        const destination = child.destination;
        if (nodes.has(destination)) {
          const cnode = nodes.get(destination);
          branch.connectTo(cnode);
          cnode.connectTo(branch);
        }
      }
    }
    return Array.from(nodes.values());
  }
  get destination() {
    return this._destination;
  }
  createAnalyser() {
    return new JuniperAnalyserNode(this);
  }
  createBiquadFilter() {
    return new JuniperBiquadFilterNode(this);
  }
  createBufferSource() {
    return new JuniperAudioBufferSourceNode(this);
  }
  createChannelMerger(numberOfInputs) {
    return new JuniperChannelMergerNode(this, {
      numberOfInputs
    });
  }
  createChannelSplitter(numberOfOutputs) {
    return new JuniperChannelSplitterNode(this, {
      numberOfOutputs
    });
  }
  createConstantSource() {
    return new JuniperConstantSourceNode(this);
  }
  createConvolver() {
    return new JuniperConvolverNode(this);
  }
  createDelay(maxDelayTime) {
    return new JuniperDelayNode(this, {
      maxDelayTime
    });
  }
  createDynamicsCompressor() {
    return new JuniperDynamicsCompressorNode(this);
  }
  createGain() {
    return new JuniperGainNode(this);
  }
  createIIRFilter(feedforward, feedback) {
    return new JuniperIIRFilterNode(this, {
      feedforward,
      feedback
    });
  }
  createMediaElementSource(mediaElement) {
    return new JuniperMediaElementAudioSourceNode(this, {
      mediaElement
    });
  }
  createMediaStreamDestination() {
    return new JuniperMediaStreamAudioDestinationNode(this);
  }
  createMediaStreamSource(mediaStream) {
    return new JuniperMediaStreamAudioSourceNode(this, {
      mediaStream
    });
  }
  createOscillator() {
    return new JuniperOscillatorNode(this);
  }
  createPanner() {
    return new JuniperPannerNode(this);
  }
  createStereoPanner() {
    return new JuniperStereoPannerNode(this);
  }
  createWaveShaper() {
    return new JuniperWaveShaperNode(this);
  }
  createScriptProcessor() {
    throw new Error("Script processor nodes are deprecated");
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/using.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/BaseNodeCluster.js
var BaseNodeCluster = class _BaseNodeCluster extends BaseNode {
  get exemplar() {
    return this.allNodes[0];
  }
  constructor(type, context, inputs, endpoints, extras) {
    super(type, context);
    inputs = inputs || [];
    extras = extras || [];
    const exits = endpoints || inputs;
    this.inputs = inputs;
    const entries = inputs.filter(isIAudioNode).map((o) => o);
    this.outputs = exits.filter(isIAudioNode).map((o) => o);
    this.allNodes = Array.from(/* @__PURE__ */ new Set([
      ...entries,
      ...this.outputs,
      ...extras
    ]));
  }
  add(node) {
    this.allNodes.push(node);
    this.context._parent(this, node);
  }
  remove(node) {
    arrayRemove(this.allNodes, node);
    this.context._unparent(this, node);
  }
  onDisposing() {
    this.allNodes.forEach(dispose);
    super.onDisposing();
  }
  get channelCount() {
    return this.exemplar.channelCount;
  }
  set channelCount(v) {
    this.allNodes.forEach((n) => n.channelCount = v);
  }
  get channelCountMode() {
    return this.exemplar.channelCountMode;
  }
  set channelCountMode(v) {
    this.allNodes.forEach((n) => n.channelCountMode = v);
  }
  get channelInterpretation() {
    return this.exemplar.channelInterpretation;
  }
  set channelInterpretation(v) {
    this.allNodes.forEach((n) => n.channelInterpretation = v);
  }
  get numberOfInputs() {
    return this.inputs.length;
  }
  get numberOfOutputs() {
    return this.outputs.length;
  }
  static resolve(source, index) {
    index = index || 0;
    if (index < 0 || source.length <= index) {
      return null;
    }
    return source[index];
  }
  _resolveInput(input) {
    return {
      destination: _BaseNodeCluster.resolve(this.inputs, input)
    };
  }
  _resolveOutput(output) {
    return {
      source: _BaseNodeCluster.resolve(this.outputs, output)
    };
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/spatializers/BaseSpatializer.js
var BaseSpatializer = class extends BaseNodeCluster {
  constructor(type, context, spatialized, input, output, nodes) {
    super(type, context, input, output, nodes);
    this.spatialized = spatialized;
    this._minDistance = 1;
    this._maxDistance = 10;
    this._algorithm = "inverse";
  }
  get minDistance() {
    return this._minDistance;
  }
  get maxDistance() {
    return this._maxDistance;
  }
  get algorithm() {
    return this._algorithm;
  }
  /**
   * Sets parameters that alter spatialization.
   **/
  setAudioProperties(minDistance, maxDistance, algorithm) {
    this._minDistance = minDistance;
    this._maxDistance = maxDistance;
    this._algorithm = algorithm;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/spatializers/NoSpatializer.js
var NoSpatializer = class extends BaseSpatializer {
  constructor(node) {
    super("no-spatializer", node.context, false, [node], [node]);
  }
  readPose(_loc) {
  }
  getGainAtDistance(_) {
    return 1;
  }
};

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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/evts.js
var HtmlEvt = class {
  /**
   * Creates a new setter functor for an HTML element event.
   * @param name - the name of the event to attach to.
   * @param callback - the callback function to use with the event handler.
   * @param opts - additional attach options.
   */
  constructor(name, callback, opts) {
    this.name = name;
    this.callback = callback;
    if (!isFunction(callback)) {
      throw new Error("A function instance is required for this parameter");
    }
    this.opts = opts;
    Object.freeze(this);
  }
  applyToElement(elem) {
    this.add(elem);
  }
  /**
   * Add the encapsulate callback as an event listener to the give HTMLElement
   */
  add(elem) {
    elem.addEventListener(this.name, this.callback, this.opts);
  }
  /**
   * Remove the encapsulate callback as an event listener from the give HTMLElement
   */
  remove(elem) {
    elem.removeEventListener(this.name, this.callback);
  }
};
function onEvent(eventName, callback, opts) {
  return new HtmlEvt(eventName, callback, opts);
}
function onInput(callback, opts) {
  return onEvent("input", callback, opts);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/all.js
function all(...tasks) {
  return Promise.all(tasks);
}

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
      const end = performance.now();
      const delta = end - this.start;
      const est = this.start - end + delta * this.weightTotal / soFar;
      this.prog.report(soFar, this.weightTotal, msg, est);
    }
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/dist/progressSplit.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/flags.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/DeviceManager.js
var deviceComparer = compareBy((d) => d.label);

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/SpeakerManager.js
var canChangeAudioOutput = /* @__PURE__ */ isFunction(HTMLAudioElement.prototype.setSinkId);

// ../../Juniper/src/Juniper.TypeScript/node_modules/gl-matrix/esm/common.js
var EPSILON = 1e-6;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var RANDOM = Math.random;
var degree = Math.PI / 180;
if (!Math.hypot)
  Math.hypot = function() {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };

// ../../Juniper/src/Juniper.TypeScript/node_modules/gl-matrix/esm/mat3.js
function create2() {
  var out = new ARRAY_TYPE(9);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }
  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}

// ../../Juniper/src/Juniper.TypeScript/node_modules/gl-matrix/esm/quat.js
var quat_exports = {};
__export(quat_exports, {
  add: () => add3,
  calculateW: () => calculateW,
  clone: () => clone3,
  conjugate: () => conjugate,
  copy: () => copy3,
  create: () => create5,
  dot: () => dot3,
  equals: () => equals3,
  exactEquals: () => exactEquals3,
  exp: () => exp,
  fromEuler: () => fromEuler,
  fromMat3: () => fromMat3,
  fromValues: () => fromValues3,
  getAngle: () => getAngle,
  getAxisAngle: () => getAxisAngle,
  identity: () => identity2,
  invert: () => invert,
  len: () => len2,
  length: () => length3,
  lerp: () => lerp3,
  ln: () => ln,
  mul: () => mul2,
  multiply: () => multiply2,
  normalize: () => normalize3,
  pow: () => pow,
  random: () => random2,
  rotateX: () => rotateX2,
  rotateY: () => rotateY2,
  rotateZ: () => rotateZ2,
  rotationTo: () => rotationTo,
  scale: () => scale3,
  set: () => set3,
  setAxes: () => setAxes,
  setAxisAngle: () => setAxisAngle,
  slerp: () => slerp,
  sqlerp: () => sqlerp,
  sqrLen: () => sqrLen2,
  squaredLength: () => squaredLength3,
  str: () => str2
});

// ../../Juniper/src/Juniper.TypeScript/node_modules/gl-matrix/esm/vec3.js
var vec3_exports = {};
__export(vec3_exports, {
  add: () => add,
  angle: () => angle,
  bezier: () => bezier,
  ceil: () => ceil,
  clone: () => clone,
  copy: () => copy,
  create: () => create3,
  cross: () => cross,
  dist: () => dist,
  distance: () => distance,
  div: () => div,
  divide: () => divide,
  dot: () => dot,
  equals: () => equals,
  exactEquals: () => exactEquals,
  floor: () => floor,
  forEach: () => forEach,
  fromValues: () => fromValues,
  hermite: () => hermite,
  inverse: () => inverse,
  len: () => len,
  length: () => length,
  lerp: () => lerp,
  max: () => max,
  min: () => min,
  mul: () => mul,
  multiply: () => multiply,
  negate: () => negate,
  normalize: () => normalize,
  random: () => random,
  rotateX: () => rotateX,
  rotateY: () => rotateY,
  rotateZ: () => rotateZ,
  round: () => round,
  scale: () => scale,
  scaleAndAdd: () => scaleAndAdd,
  set: () => set,
  sqrDist: () => sqrDist,
  sqrLen: () => sqrLen,
  squaredDistance: () => squaredDistance,
  squaredLength: () => squaredLength,
  str: () => str,
  sub: () => sub,
  subtract: () => subtract,
  transformMat3: () => transformMat3,
  transformMat4: () => transformMat4,
  transformQuat: () => transformQuat,
  zero: () => zero
});
function create3() {
  var out = new ARRAY_TYPE(3);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}
function clone(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
function fromValues(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
function scaleAndAdd(out, a, b, scale4) {
  out[0] = a[0] + b[0] * scale4;
  out[1] = a[1] + b[1] * scale4;
  out[2] = a[2] + b[2] * scale4;
  return out;
}
function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
function inverse(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
}
function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len3 = x * x + y * y + z * z;
  if (len3 > 0) {
    len3 = 1 / Math.sqrt(len3);
  }
  out[0] = a[0] * len3;
  out[1] = a[1] * len3;
  out[2] = a[2] * len3;
  return out;
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2];
  var bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function lerp(out, a, b, t2) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t2 * (b[0] - ax);
  out[1] = ay + t2 * (b[1] - ay);
  out[2] = az + t2 * (b[2] - az);
  return out;
}
function hermite(out, a, b, c, d, t2) {
  var factorTimes2 = t2 * t2;
  var factor1 = factorTimes2 * (2 * t2 - 3) + 1;
  var factor2 = factorTimes2 * (t2 - 2) + t2;
  var factor3 = factorTimes2 * (t2 - 1);
  var factor4 = factorTimes2 * (3 - 2 * t2);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function bezier(out, a, b, c, d, t2) {
  var inverseFactor = 1 - t2;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t2 * t2;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t2 * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t2;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function random(out, scale4) {
  scale4 = scale4 || 1;
  var r = RANDOM() * 2 * Math.PI;
  var z = RANDOM() * 2 - 1;
  var zScale = Math.sqrt(1 - z * z) * scale4;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale4;
  return out;
}
function transformMat4(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
function transformMat3(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
function transformQuat(out, a, q) {
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  var x = a[0], y = a[1], z = a[2];
  var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
  var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
function rotateX(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateY(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateZ(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2];
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function angle(a, b) {
  var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
function zero(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}
function str(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
function equals(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2];
  var b0 = b[0], b1 = b[1], b2 = b[2];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
}
var sub = subtract;
var mul = multiply;
var div = divide;
var dist = distance;
var sqrDist = squaredDistance;
var len = length;
var sqrLen = squaredLength;
var forEach = function() {
  var vec = create3();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 3;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
}();

// ../../Juniper/src/Juniper.TypeScript/node_modules/gl-matrix/esm/vec4.js
function create4() {
  var out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }
  return out;
}
function clone2(a) {
  var out = new ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function fromValues2(x, y, z, w) {
  var out = new ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
function copy2(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function set2(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
function add2(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
function scale2(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
function length2(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.hypot(x, y, z, w);
}
function squaredLength2(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}
function normalize2(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len3 = x * x + y * y + z * z + w * w;
  if (len3 > 0) {
    len3 = 1 / Math.sqrt(len3);
  }
  out[0] = x * len3;
  out[1] = y * len3;
  out[2] = z * len3;
  out[3] = w * len3;
  return out;
}
function dot2(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
function lerp2(out, a, b, t2) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t2 * (b[0] - ax);
  out[1] = ay + t2 * (b[1] - ay);
  out[2] = az + t2 * (b[2] - az);
  out[3] = aw + t2 * (b[3] - aw);
  return out;
}
function exactEquals2(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
function equals2(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
}
var forEach2 = function() {
  var vec = create4();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 4;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }
    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }
    return a;
  };
}();

// ../../Juniper/src/Juniper.TypeScript/node_modules/gl-matrix/esm/quat.js
function create5() {
  var out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  out[3] = 1;
  return out;
}
function identity2(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
function getAxisAngle(out_axis, q) {
  var rad = Math.acos(q[3]) * 2;
  var s = Math.sin(rad / 2);
  if (s > EPSILON) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }
  return rad;
}
function getAngle(a, b) {
  var dotproduct = dot3(a, b);
  return Math.acos(2 * dotproduct * dotproduct - 1);
}
function multiply2(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = b[0], by = b[1], bz = b[2], bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
function rotateX2(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
function rotateY2(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var by = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
function rotateZ2(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bz = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
function calculateW(out, a) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
  return out;
}
function exp(out, a) {
  var x = a[0], y = a[1], z = a[2], w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var et = Math.exp(w);
  var s = r > 0 ? et * Math.sin(r) / r : 0;
  out[0] = x * s;
  out[1] = y * s;
  out[2] = z * s;
  out[3] = et * Math.cos(r);
  return out;
}
function ln(out, a) {
  var x = a[0], y = a[1], z = a[2], w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var t2 = r > 0 ? Math.atan2(r, w) / r : 0;
  out[0] = x * t2;
  out[1] = y * t2;
  out[2] = z * t2;
  out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
  return out;
}
function pow(out, a, b) {
  ln(out, a);
  scale3(out, out, b);
  exp(out, out);
  return out;
}
function slerp(out, a, b, t2) {
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = b[0], by = b[1], bz = b[2], bw = b[3];
  var omega, cosom, sinom, scale0, scale1;
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1 - cosom > EPSILON) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1 - t2) * omega) / sinom;
    scale1 = Math.sin(t2 * omega) / sinom;
  } else {
    scale0 = 1 - t2;
    scale1 = t2;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
function random2(out) {
  var u1 = RANDOM();
  var u2 = RANDOM();
  var u3 = RANDOM();
  var sqrt1MinusU1 = Math.sqrt(1 - u1);
  var sqrtU1 = Math.sqrt(u1);
  out[0] = sqrt1MinusU1 * Math.sin(2 * Math.PI * u2);
  out[1] = sqrt1MinusU1 * Math.cos(2 * Math.PI * u2);
  out[2] = sqrtU1 * Math.sin(2 * Math.PI * u3);
  out[3] = sqrtU1 * Math.cos(2 * Math.PI * u3);
  return out;
}
function invert(out, a) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var dot4 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot4 ? 1 / dot4 : 0;
  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
function fromMat3(out, m) {
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;
  if (fTrace > 0) {
    fRoot = Math.sqrt(fTrace + 1);
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    var i = 0;
    if (m[4] > m[0])
      i = 1;
    if (m[8] > m[i * 3 + i])
      i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }
  return out;
}
function fromEuler(out, x, y, z) {
  var halfToRad = 0.5 * Math.PI / 180;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;
  var sx = Math.sin(x);
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);
  var sz = Math.sin(z);
  var cz = Math.cos(z);
  out[0] = sx * cy * cz - cx * sy * sz;
  out[1] = cx * sy * cz + sx * cy * sz;
  out[2] = cx * cy * sz - sx * sy * cz;
  out[3] = cx * cy * cz + sx * sy * sz;
  return out;
}
function str2(a) {
  return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
var clone3 = clone2;
var fromValues3 = fromValues2;
var copy3 = copy2;
var set3 = set2;
var add3 = add2;
var mul2 = multiply2;
var scale3 = scale2;
var dot3 = dot2;
var lerp3 = lerp2;
var length3 = length2;
var len2 = length3;
var squaredLength3 = squaredLength2;
var sqrLen2 = squaredLength3;
var normalize3 = normalize2;
var exactEquals3 = exactEquals2;
var equals3 = equals2;
var rotationTo = function() {
  var tmpvec3 = create3();
  var xUnitVec3 = fromValues(1, 0, 0);
  var yUnitVec3 = fromValues(0, 1, 0);
  return function(out, a, b) {
    var dot4 = dot(a, b);
    if (dot4 < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 1e-6)
        cross(tmpvec3, yUnitVec3, a);
      normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot4 > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot4;
      return normalize3(out, out);
    }
  };
}();
var sqlerp = function() {
  var temp1 = create5();
  var temp2 = create5();
  return function(out, a, b, c, d, t2) {
    slerp(temp1, a, d, t2);
    slerp(temp2, b, c, t2);
    slerp(out, temp1, temp2, 2 * t2 * (1 - t2));
    return out;
  };
}();
var setAxes = function() {
  var matr = create2();
  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize3(out, fromMat3(out, matr));
  };
}();

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/Pose.js
var Pose = class {
  /**
   * Creates a new position and orientation, at a given time.
   **/
  constructor() {
    this.p = vec3_exports.create();
    this.q = quat_exports.create();
    Object.seal(this);
  }
  /**
   * Sets the components of the pose.
   */
  set(px2, py, pz, qx, qy, qz, qw) {
    this.setPosition(px2, py, pz);
    this.setOrientation(qx, qy, qz, qw);
  }
  setPosition(px2, py, pz) {
    vec3_exports.set(this.p, px2, py, pz);
  }
  setOrientation(qx, qy, qz, qw) {
    quat_exports.set(this.q, qx, qy, qz, qw);
  }
  /**
   * Copies the components of another pose into this pose.
   */
  copy(other) {
    vec3_exports.copy(this.p, other.p);
    quat_exports.copy(this.q, other.q);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/listeners/BaseWebAudioListener.js
var f = vec3_exports.create();
var u = vec3_exports.create();

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/spatializers/BaseWebAudioPanner.js
var fwd = vec3_exports.create();

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/effects/RadioEffect.js
var RadioEffectNode = class extends BaseNodeCluster {
  constructor(context) {
    const filter = new JuniperBiquadFilterNode(context, {
      type: "bandpass",
      frequency: 2500,
      Q: 4.5
    });
    const gain = new JuniperGainNode(context, {
      gain: 10
    });
    filter.connect(gain);
    super("radio-effect", context, [filter], [gain]);
  }
};
function RadioEffect(name, context) {
  const node = new RadioEffectNode(context);
  node.name = `${name}-radio-effect`;
  return node;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/effects/WallEffect.js
function WallEffect(name, context) {
  const node = new JuniperBiquadFilterNode(context, {
    type: "bandpass",
    frequency: 400,
    Q: 4.5
  });
  node.name = `${name}-wall-effect`;
  return node;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/effects/index.js
var effectStore = /* @__PURE__ */ new Map([
  ["Radio", RadioEffect],
  ["Wall", WallEffect]
]);

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/sources/BaseAudioSource.js
var BaseAudioSource = class extends BaseNodeCluster {
  constructor(type, context, spatializer, effectNames, extras) {
    const volumeControl = new JuniperGainNode(context);
    volumeControl.name = "volume-control";
    extras = extras || [];
    super(type, context, [], [spatializer], extras);
    this.spatializer = spatializer;
    this.effects = new Array();
    this.pose = new Pose();
    this.volumeControl = volumeControl;
    this.setEffects(...effectNames);
  }
  onDisposing() {
    arrayClear(this.effects);
    super.onDisposing();
  }
  setEffects(...effectNames) {
    this.disable();
    for (const effect of this.effects) {
      this.remove(effect);
      dispose(effect);
    }
    arrayClear(this.effects);
    let last = this.volumeControl;
    for (const effectName of effectNames) {
      if (isDefined(effectName)) {
        const createEffect = effectStore.get(effectName);
        if (isDefined(createEffect)) {
          const effect = createEffect(effectName, this.context);
          this.add(effect);
          this.effects.push(effect);
          last = last.connect(effect);
        }
      }
    }
    this.enable();
  }
  get spatialized() {
    return this.spatializer.spatialized;
  }
  get lastInternal() {
    return this.effects[this.effects.length - 1] || this.volumeControl;
  }
  enable() {
    if (!this.lastInternal.isConnected()) {
      this.lastInternal.connect(this.spatializer);
    }
  }
  disable() {
    if (this.lastInternal.isConnected()) {
      this.lastInternal.disconnect();
    }
  }
  tog() {
    if (this.lastInternal.isConnected()) {
      this.disable();
    } else {
      this.enable();
    }
  }
  get volume() {
    return this.volumeControl.gain.value;
  }
  set volume(v) {
    this.volumeControl.gain.value = v;
  }
  get minDistance() {
    if (isDefined(this.spatializer)) {
      return this.spatializer.minDistance;
    }
    return null;
  }
  get maxDistance() {
    if (isDefined(this.spatializer)) {
      return this.spatializer.maxDistance;
    }
    return null;
  }
  get algorithm() {
    if (isDefined(this.spatializer)) {
      return this.spatializer.algorithm;
    }
    return null;
  }
  setPosition(px2, py, pz) {
    if (isDefined(this.spatializer)) {
      this.pose.setPosition(px2, py, pz);
      this.spatializer.readPose(this.pose);
    }
  }
  setOrientation(qx, qy, qz, qw) {
    if (isDefined(this.spatializer)) {
      this.pose.setOrientation(qx, qy, qz, qw);
      this.spatializer.readPose(this.pose);
    }
  }
  set(px2, py, pz, qx, qy, qz, qw) {
    if (isDefined(this.spatializer)) {
      this.pose.set(px2, py, pz, qx, qy, qz, qw);
      this.spatializer.readPose(this.pose);
    }
  }
  setAudioProperties(minDistance, maxDistance, algorithm) {
    if (isDefined(this.spatializer)) {
      this.spatializer.setAudioProperties(minDistance, maxDistance, algorithm);
    }
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/sources/IPlayable.js
var MediaElementSourceEvent = class extends TypedEvent {
  constructor(type, source) {
    super(type);
    this.source = source;
  }
};
var MediaElementSourceLoadedEvent = class extends MediaElementSourceEvent {
  constructor(source) {
    super("loaded", source);
  }
};
var MediaElementSourcePlayedEvent = class extends MediaElementSourceEvent {
  constructor(source) {
    super("played", source);
  }
};
var MediaElementSourcePausedEvent = class extends MediaElementSourceEvent {
  constructor(source) {
    super("paused", source);
  }
};
var MediaElementSourceStoppedEvent = class extends MediaElementSourceEvent {
  constructor(source) {
    super("stopped", source);
  }
};
var MediaElementSourceProgressEvent = class extends MediaElementSourceEvent {
  constructor(source) {
    super("progress", source);
    this.value = 0;
    this.total = 0;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/sources/AudioElementSource.js
var DISPOSING_EVT = new TypedEvent("disposing");

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/AudioManager.js
var useHeadphonesToggledEvt = new TypedEvent("useheadphonestoggled");
var RELEASE_EVT = new TypedEvent("released");

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/data.js
var audioRecordSorter = compareBy("descending", (f2) => f2.resolution);

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/dist/sources/IPlayer.js
var MediaPlayerEvent = class extends MediaElementSourceEvent {
  constructor(type, source) {
    super(type, source);
  }
};
var MediaPlayerLoadingEvent = class extends MediaPlayerEvent {
  constructor(source) {
    super("loading", source);
  }
};

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
function progressTasks(prog, ...subTaskDef) {
  const taskDefs = subTaskDef.map((t2) => [1, t2]);
  return progressTasksWeighted(prog, taskDefs);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/video/dist/data.js
function isVideoRecord(obj) {
  return isString(obj.vcodec);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/video/dist/BaseVideoPlayer.js
var BaseVideoPlayer = class _BaseVideoPlayer extends BaseAudioSource {
  get data() {
    return this._data;
  }
  get loaded() {
    return this._loaded;
  }
  get title() {
    return this.video.title;
  }
  setTitle(v) {
    this.video.title = v;
    this.audio.title = v;
  }
  constructor(type, context, spatializer) {
    const video2 = _BaseVideoPlayer.createMediaElement(Video, Controls(true));
    const audio = _BaseVideoPlayer.createMediaElement(Audio2, Controls(false));
    const videoNode = new JuniperMediaElementAudioSourceNode(context, {
      mediaElement: video2
    });
    videoNode.name = `${type}-video`;
    const audioNode = new JuniperMediaElementAudioSourceNode(context, {
      mediaElement: audio
    });
    audioNode.name = `${type}-audio`;
    super(type, context, spatializer, [], [videoNode, audioNode]);
    this.onTimeUpdate = null;
    this.wasUsingAudioElement = false;
    this.nextStartTime = null;
    this._data = null;
    this._loaded = false;
    this.onError = /* @__PURE__ */ new Map();
    this.sourcesByURL = /* @__PURE__ */ new Map();
    this.sources = new PriorityList();
    this.potatoes = new PriorityList();
    videoNode.connect(this.volumeControl);
    audioNode.connect(this.volumeControl);
    this.video = video2;
    this.audio = audio;
    this.loadingEvt = new MediaPlayerLoadingEvent(this);
    this.loadEvt = new MediaElementSourceLoadedEvent(this);
    this.playEvt = new MediaElementSourcePlayedEvent(this);
    this.pauseEvt = new MediaElementSourcePausedEvent(this);
    this.stopEvt = new MediaElementSourceStoppedEvent(this);
    this.progEvt = new MediaElementSourceProgressEvent(this);
    this.onSeeked = () => {
      if (this.useAudioElement) {
        this.audio.currentTime = this.video.currentTime;
      }
    };
    this.onPlay = async () => {
      this.onSeeked();
      if (this.useAudioElement) {
        await this.context.ready;
        await this.audio.play();
      }
      this.dispatchEvent(this.playEvt);
    };
    this.onPause = (evt) => {
      if (this.useAudioElement) {
        this.onSeeked();
        this.audio.pause();
      }
      if (this.video.currentTime === 0 || evt.type === "ended") {
        this.dispatchEvent(this.stopEvt);
      } else {
        this.dispatchEvent(this.pauseEvt);
      }
    };
    let wasWaiting = false;
    this.onWaiting = () => {
      if (this.useAudioElement) {
        wasWaiting = true;
        this.audio.pause();
      }
    };
    this.onCanPlay = async () => {
      if (this.useAudioElement && wasWaiting) {
        await this.context.ready;
        await this.audio.play();
        wasWaiting = false;
      }
    };
    this.wasUsingAudioElement = false;
    this.onTimeUpdate = async () => {
      const quality = this.video.getVideoPlaybackQuality();
      if (quality.totalVideoFrames === 0) {
        const onError = this.onError.get(this.video);
        if (isDefined(onError)) {
          await onError();
        }
      } else if (this.useAudioElement) {
        this.wasUsingAudioElement = false;
        const delta = this.video.currentTime - this.audio.currentTime;
        if (Math.abs(delta) > 0.25) {
          this.audio.currentTime = this.video.currentTime;
        }
      } else if (!this.wasUsingAudioElement) {
        this.wasUsingAudioElement = true;
        this.audio.pause();
      }
      this.progEvt.value = this.video.currentTime;
      this.progEvt.total = this.video.duration;
      this.dispatchEvent(this.progEvt);
    };
    this.video.addEventListener("seeked", this.onSeeked);
    this.video.addEventListener("play", this.onPlay);
    this.video.addEventListener("pause", this.onPause);
    this.video.addEventListener("ended", this.onPause);
    this.video.addEventListener("waiting", this.onWaiting);
    this.video.addEventListener("canplay", this.onCanPlay);
    this.video.addEventListener("timeupdate", this.onTimeUpdate);
    Object.assign(window, { videoPlayer: this });
  }
  elementHasAudio(elem) {
    const source = this.sourcesByURL.get(elem.src);
    return isDefined(source) && source.acodec !== "none" || isDefined(elem.audioTracks) && elem.audioTracks.length > 0 || isDefined(elem.webkitAudioDecodedByteCount) && elem.webkitAudioDecodedByteCount > 0 || isDefined(elem.mozHasAudio) && elem.mozHasAudio;
  }
  get useAudioElement() {
    return !this.elementHasAudio(this.video) && this.elementHasAudio(this.audio);
  }
  onDisposing() {
    this.clear();
    this.video.removeEventListener("seeked", this.onSeeked);
    this.video.removeEventListener("play", this.onPlay);
    this.video.removeEventListener("pause", this.onPause);
    this.video.removeEventListener("ended", this.onPause);
    this.video.removeEventListener("waiting", this.onWaiting);
    this.video.removeEventListener("canplay", this.onCanPlay);
    this.video.removeEventListener("timeupdate", this.onTimeUpdate);
    super.onDisposing();
    this.audio.dispatchEvent(RELEASE_EVT);
    this.video.dispatchEvent(RELEASE_EVT);
  }
  clear() {
    this.stop();
    for (const [elem, onError] of this.onError) {
      elem.removeEventListener("error", onError);
    }
    this.onError.clear();
    this.sourcesByURL.clear();
    this.sources.clear();
    this.potatoes.clear();
    this.video.src = "";
    this.audio.src = "";
    this.wasUsingAudioElement = false;
    this._data = null;
    this._loaded = false;
  }
  async load(data, prog) {
    this.clear();
    this._data = data;
    if (isString(data)) {
      this.setTitle(data);
      this.potatoes.add(this.video, data);
    } else {
      this.setTitle(data.title);
      this.fillSources(this.video, data.videos);
      this.fillSources(this.audio, data.audios);
    }
    if (!this.hasSources(this.video)) {
      throw new Error("No video sources found");
    }
    this.dispatchEvent(this.loadingEvt);
    await progressTasks(prog, (prog2) => this.loadMediaElement(this.audio, prog2), (prog2) => this.loadMediaElement(this.video, prog2));
    if (isString(data)) {
      this.nextStartTime = null;
    } else {
      this.nextStartTime = data.startTime;
    }
    if (!this.hasSources(this.video)) {
      throw new Error("No video playable sources");
    }
    this._loaded = true;
    this.dispatchEvent(this.loadEvt);
    return this;
  }
  fillSources(elem, formats) {
    formats.sort(audioRecordSorter);
    for (const format of formats) {
      if (!Video_Vendor_Mpeg_Dash_Mpd.matches(format.contentType)) {
        this.sources.add(elem, format);
        this.sourcesByURL.set(format.url, format);
      }
    }
  }
  static createMediaElement(MediaElement, ...rest) {
    return MediaElement(AutoPlay(false), Loop(false), ...rest);
  }
  async getMediaCapabilities(source) {
    const config = {
      type: "file"
    };
    if (isVideoRecord(source)) {
      config.video = {
        contentType: source.contentType,
        bitrate: source.vbr * 1024,
        framerate: source.fps,
        width: source.width,
        height: source.height
      };
    } else if (source.acodec !== "none") {
      config.audio = {
        contentType: source.contentType,
        bitrate: source.abr * 1024,
        samplerate: source.asr
      };
    }
    try {
      return await navigator.mediaCapabilities.decodingInfo(config);
    } catch {
      return {
        supported: true,
        powerEfficient: false,
        smooth: false,
        configuration: config
      };
    }
  }
  hasSources(elem) {
    return this.sources.get(elem).length > 0 || this.potatoes.count(elem) > 0;
  }
  async loadMediaElement(elem, prog) {
    if (isDefined(prog)) {
      prog.start();
    }
    if (this.onError.has(elem)) {
      elem.removeEventListener("error", this.onError.get(elem));
      this.onError.delete(elem);
    }
    while (this.hasSources(elem)) {
      let url2 = null;
      const source = this.sources.get(elem).shift();
      if (isDefined(source)) {
        const caps = await this.getMediaCapabilities(source);
        if (!caps.smooth || !caps.powerEfficient) {
          this.potatoes.add(elem, source.url);
          continue;
        } else {
          url2 = source.url;
        }
      } else {
        url2 = this.potatoes.get(elem).shift();
      }
      elem.src = url2;
      elem.load();
      if (await mediaElementCanPlayThrough(elem)) {
        if (isDefined(source)) {
          this.sources.get(elem).unshift(source);
        } else {
          this.potatoes.get(elem).unshift(url2);
        }
        const onError = () => this.loadMediaElement(elem, prog);
        elem.addEventListener("error", onError);
        this.onError.set(elem, onError);
        this.wasUsingAudioElement = this.wasUsingAudioElement;
        if (isDefined(prog)) {
          prog.end();
        }
        return;
      }
    }
  }
  get width() {
    return this.video.videoWidth;
  }
  get height() {
    return this.video.videoHeight;
  }
  get playbackState() {
    if (isNullOrUndefined(this.data)) {
      return "empty";
    }
    if (!this.loaded) {
      return "loading";
    }
    if (this.video.error) {
      return "errored";
    }
    if (this.video.ended || this.video.paused && this.video.currentTime === 0) {
      return "stopped";
    }
    if (this.video.paused) {
      return "paused";
    }
    return "playing";
  }
  async play() {
    await this.context.ready;
    if (isDefined(this.nextStartTime) && this.nextStartTime > 0) {
      this.video.pause();
      this.video.currentTime = this.nextStartTime;
      this.nextStartTime = null;
    }
    await this.video.play();
  }
  async playThrough() {
    const endTask = once(this, "stopped");
    await this.play();
    await endTask;
  }
  pause() {
    this.video.pause();
  }
  stop() {
    this.pause();
    this.video.currentTime = 0;
  }
  restart() {
    this.stop();
    return this.play();
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/video/dist/VideoPlayer.js
var loadingCursor = "wait";
var loadedCursor = "pointer";
var errorCursor = "not-allowed";
var VideoPlayer = class extends BaseVideoPlayer {
  constructor(context, spatializer) {
    super("video-player", context, spatializer);
    this.element = Div(display("inline-block"), this.thumbnail = Img(cursor(loadingCursor)), this.video, this.audio);
    this.thumbnail.addEventListener("click", () => {
      if (this.loaded) {
        this.play();
      }
    });
    this.addEventListener("played", () => this.showVideo(true));
    this.addEventListener("stopped", () => this.showVideo(false));
    this.showVideo(false);
  }
  onDisposing() {
    super.onDisposing();
    if (isDefined(this.element.parentElement)) {
      this.element.remove();
    }
  }
  showVideo(v) {
    elementSetDisplay(this.video, v, "inline-block");
    elementSetDisplay(this.thumbnail, !v, "inline-block");
  }
  async load(data, prog) {
    try {
      HtmlRender(this.thumbnail, opacity(0.5), cursor(loadingCursor));
      const progs = progressSplitWeighted(prog, [1, 10]);
      await all(super.load(data, progs.shift()), this.loadThumbnail(data, progs.shift()));
      return this;
    } finally {
      HtmlRender(this.thumbnail, opacity(1), cursor(this.loaded ? loadedCursor : errorCursor));
    }
  }
  clear() {
    super.clear();
    this.thumbnail.src = "";
  }
  setTitle(v) {
    super.setTitle(v);
    this.thumbnail.title = v;
  }
  async loadThumbnail(data, prog) {
    prog.start();
    if (isDefined(data)) {
      HtmlRender(this.thumbnail, Src(data.thumbnail.url), opacity(0.5));
      const loading = once(this.thumbnail, "load", "error");
      await success(loading);
    }
    prog.end();
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/video/dist/YouTubeProxy.js
function isYouTube(url2) {
  return url2.hostname === "www.youtube.com" || url2.hostname === "youtube.com" || url2.hostname === "youtu.be";
}
var codecReplaces = /* @__PURE__ */ new Map([
  ["vp9", "vp09.00.10.08"]
]);
function classifyFormat(f2) {
  if (isNullOrUndefined(f2.vcodec) || f2.vcodec === "none") {
    return "audio";
  }
  return "video";
}
function combineContentTypeAndCodec(content_type, codec) {
  const parts = [content_type];
  if (isDefined(codec) && codec.length > 0 && codec !== "none") {
    codec = codecReplaces.get(codec) || codec;
  }
  if (isDefined(codec) && codec.length > 0 && codec !== "none") {
    const asterisk = encodeURI(codec) !== codec ? "*" : "";
    parts.push(`codecs${asterisk}="${codec}"`);
  }
  return parts.join(";");
}
var YouTubeProxy = class {
  constructor(fetcher, makeProxyURL2) {
    this.fetcher = fetcher;
    this.makeProxyURL = makeProxyURL2;
  }
  makeVideoRecord(f2) {
    const { content_type, acodec, vcodec } = f2;
    const fullContentType = combineContentTypeAndCodec(content_type, vcodec);
    return {
      contentType: fullContentType,
      url: this.makeProxyURL(f2.url).href,
      acodec,
      abr: f2.abr * 1024,
      asr: f2.asr,
      vcodec,
      vbr: f2.vbr * 1024,
      fps: f2.fps,
      width: f2.width,
      height: f2.height,
      resolution: f2.width * f2.height
    };
  }
  makeAudioRecord(f2) {
    const { content_type, acodec } = f2;
    const fullContentType = combineContentTypeAndCodec(content_type, acodec);
    return {
      contentType: fullContentType,
      url: this.makeProxyURL(f2.url).href,
      acodec,
      abr: f2.abr * 1024,
      asr: f2.asr,
      resolution: f2.abr
    };
  }
  makeImageRecord(f2) {
    const { content_type, url: url2, width, height } = f2;
    return {
      contentType: content_type,
      url: this.makeProxyURL(url2).href,
      width,
      height,
      resolution: width * height
    };
  }
  async loadData(pageURLOrMetadata, prog) {
    if (isNullOrUndefined(pageURLOrMetadata)) {
      throw new Error("must provide a YouTube URL or a YTMetadata object");
    }
    if (isDefined(prog)) {
      prog.start();
    }
    let metadata = null;
    if (isString(pageURLOrMetadata)) {
      metadata = await this.fetcher.get(pageURLOrMetadata).progress(prog).object().then(unwrapResponse);
    } else {
      if (isDefined(prog)) {
        prog.end(pageURLOrMetadata.title);
      }
      metadata = pageURLOrMetadata;
    }
    let startTime = 0;
    if (isDefined(metadata.original_url)) {
      const url2 = new URL(metadata.original_url);
      if (isYouTube(url2) && url2.searchParams.has("t")) {
        startTime = parseFloat(url2.searchParams.get("t"));
      }
    }
    const formats = new PriorityList((await Promise.all(metadata.formats)).map((f2) => [classifyFormat(f2), f2]));
    const title = metadata.title;
    const thumbnails = metadata.thumbnails || [];
    const thumbnail = metadata.thumbnail && this.makeImageRecord(arrayScan(thumbnails, (t2) => t2.url === metadata.thumbnail));
    const videos = formats.get("video").map((f2) => this.makeVideoRecord(f2));
    const audios = formats.get("audio").map((f2) => this.makeAudioRecord(f2));
    const data = {
      title,
      thumbnail,
      videos,
      audios,
      startTime
    };
    return data;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/Asset.js
function isAsset(obj) {
  return isDefined(obj) && isFunction(obj.then) && isFunction(obj.catch) && isFunction(obj.finally) && isFunction(obj.fetch) && isFunction(obj.getSize);
}
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
    } catch (exp2) {
      console.warn(exp2);
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/canvas.js
var hasHTMLCanvas = "HTMLCanvasElement" in globalThis;
var hasHTMLImage = "HTMLImageElement" in globalThis;
var disableAdvancedSettings = false;
var hasOffscreenCanvas = !disableAdvancedSettings && "OffscreenCanvas" in globalThis;
var hasImageBitmap = !disableAdvancedSettings && "createImageBitmap" in globalThis;
function testOffscreen2D() {
  try {
    const canv = new OffscreenCanvas(1, 1);
    const g = canv.getContext("2d");
    return g != null;
  } catch (exp2) {
    return false;
  }
}
var hasOffscreenCanvasRenderingContext2D = hasOffscreenCanvas && testOffscreen2D();
function testOffscreen3D() {
  try {
    const canv = new OffscreenCanvas(1, 1);
    const g = canv.getContext("webgl2");
    return g != null;
  } catch (exp2) {
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
function drawImageToCanvas(canv, img) {
  const g = canv.getContext("2d");
  if (isNullOrUndefined(g)) {
    throw new Error("Could not create 2d context for canvas");
  }
  g.drawImage(img, 0, 0);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/waitFor.js
function waitFor(test) {
  const task = new Task();
  const handle = setInterval(() => {
    if (test()) {
      clearInterval(handle);
      task.resolve();
    }
  }, 100);
  return task;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/translateResponse.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/RequestBuilder.js
var testAudio = null;
function canPlay(type) {
  if (testAudio === null) {
    testAudio = new Audio();
  }
  return testAudio.canPlayType(type) !== "";
}
var RequestBuilder = class {
  constructor(fetcher, method, path, useBLOBs = false) {
    this.fetcher = fetcher;
    this.method = method;
    this.path = path;
    this.useBLOBs = useBLOBs;
    this.prog = null;
    this.request = {
      method,
      path: this.path.href,
      body: null,
      headers: null,
      timeout: null,
      withCredentials: false,
      useCache: false,
      retryCount: 3
    };
  }
  retries(count) {
    this.request.retryCount = count;
    return this;
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
  headers(headers) {
    for (const [name, value] of headers.entries()) {
      this.header(name, value);
    }
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
    if (isDefined(body)) {
      const seen = /* @__PURE__ */ new Set();
      const queue = new Array();
      queue.push(body);
      let isForm = false;
      while (!isForm && queue.length > 0) {
        const here = queue.shift();
        if (here && !seen.has(here)) {
          seen.add(here);
          if (here instanceof Blob) {
            isForm = true;
            break;
          } else if (!isString(here)) {
            queue.push(...Object.values(here));
          }
        }
      }
      if (isForm) {
        const form = new FormData();
        const fileNames = /* @__PURE__ */ new Map();
        const toSkip = /* @__PURE__ */ new Set();
        for (const [key, value] of Object.entries(body)) {
          if (value instanceof Blob) {
            const fileNameKey = key + ".name";
            const fileName = body[fileNameKey];
            if (isString(fileName)) {
              fileNames.set(value, fileName);
              toSkip.add(fileNameKey);
            }
          }
        }
        for (const [key, value] of Object.entries(body)) {
          if (toSkip.has(key)) {
            continue;
          }
          if (value instanceof Blob) {
            form.append(key, value, fileNames.get(value));
          } else if (isString(value)) {
            form.append(key, value);
          } else if (isDefined(value) && isFunction(value.toString)) {
            form.append(key, value.toString());
          } else {
            console.warn("Can't serialize value to formdata", key, value);
          }
        }
        body = form;
        contentType = void 0;
      }
      this.request.body = body;
      this.content(contentType);
    }
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
  async file(acceptType) {
    this.accept(acceptType);
    if (this.method === "POST" || this.method === "PUT" || this.method === "PATCH" || this.method === "DELETE") {
      return await this.fetcher.sendObjectGetFile(this.request, this.prog);
    } else if (this.method === "GET") {
      if (this.useBLOBs) {
        return await this.fetcher.sendNothingGetFile(this.request, this.prog);
      } else {
        const response = await this.fetcher.sendNothingGetNothing(this.request);
        return translateResponse(response, () => this.request.path);
      }
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
      throw new Error("GET requests should expect a response type");
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
  async audioBuffer(context, acceptType) {
    return translateResponse(await this.audioBlob(acceptType), async (blob) => await context.decodeAudioData(await blob.arrayBuffer()));
  }
  async htmlElement(element, resolveEvt, acceptType) {
    const response = await this.file(acceptType);
    const task = once(element, resolveEvt, "error");
    if (element instanceof HTMLLinkElement) {
      element.href = response.content;
    } else {
      element.src = response.content;
    }
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
  async style() {
    const tag = Link(Type(Text_Css), Rel("stylesheet"));
    document.head.append(tag);
    const response = await this.htmlElement(tag, "load", Text_Css);
    return translateResponse(response);
  }
  async getScript() {
    const tag = Script(Type(Application_Javascript));
    document.head.append(tag);
    const response = await this.htmlElement(tag, "load", Application_Javascript);
    return translateResponse(response);
  }
  async script(test) {
    let response = null;
    const scriptPath = this.request.path;
    if (!test) {
      response = await this.getScript();
    } else if (!test()) {
      const scriptLoadTask = waitFor(test);
      response = await this.getScript();
      await scriptLoadTask;
    }
    if (this.prog) {
      this.prog.end(scriptPath);
    }
    return response;
  }
  async module() {
    const scriptPath = this.request.path;
    const response = await this.file(Application_Javascript);
    const value = await import(response.content);
    if (this.prog) {
      this.prog.end(scriptPath);
    }
    return translateResponse(response, () => value);
  }
  async wasm(imports) {
    const response = await this.buffer(Application_Wasm);
    if (!Application_Wasm.matches(response.contentType)) {
      throw new Error(`Server did not respond with WASM file. Was: ${response.contentType}`);
    }
    const module = await WebAssembly.compile(response.content);
    const instance = await WebAssembly.instantiate(module, imports);
    return translateResponse(response, () => instance.exports);
  }
  async worker(type = "module") {
    const scriptPath = this.request.path;
    const response = await this.file(Application_Javascript);
    this.prog = null;
    this.request.timeout = null;
    const worker = new Worker(response.content, { type });
    if (this.prog) {
      this.prog.end(scriptPath);
    }
    return translateResponse(response, () => worker);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/Fetcher.js
var Fetcher = class {
  constructor(service, useBLOBs = false) {
    this.service = service;
    this.useBLOBs = useBLOBs;
    if (true) {
      const antiforgeryToken = getInput("input[name=__RequestVerificationToken]");
      if (antiforgeryToken) {
        this.service.setRequestVerificationToken(antiforgeryToken.value);
      }
    }
  }
  clearCache() {
    return this.service.clearCache();
  }
  evict(path, base) {
    return this.service.evict(new URL(path, base || location.href).href);
  }
  request(method, path, base) {
    return new RequestBuilder(this.service, method, new URL(path, base || location.href), this.useBLOBs);
  }
  head(path, base) {
    return this.request("HEAD", path, base);
  }
  options(path, base) {
    return this.request("OPTIONS", path, base);
  }
  get(path, base) {
    return this.request("GET", path, base);
  }
  post(path, base) {
    return this.request("POST", path, base);
  }
  put(path, base) {
    return this.request("PUT", path, base);
  }
  patch(path, base) {
    return this.request("PATCH", path, base);
  }
  delete(path, base) {
    return this.request("DELETE", path, base);
  }
  async assets(progressOrAsset, firstAsset, ...assets) {
    if (isNullOrUndefined(assets)) {
      assets = [];
    }
    assets.unshift(firstAsset);
    let progress;
    if (isAsset(progressOrAsset)) {
      assets.unshift(progressOrAsset);
    } else if (isDefined(progressOrAsset)) {
      progress = progressOrAsset;
    }
    assets = assets.filter(isDefined);
    const sizes = await Promise.all(assets.map((asset) => asset.getSize(this)));
    const assetSizes = new Map(sizes);
    await progressTasksWeighted(progress, assets.map((asset) => [assetSizes.get(asset), (prog) => asset.fetch(this, prog)]));
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/FetchingService.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/mapMap.js
function mapMap(items, makeID, makeValue) {
  return new Map(items.map((item) => [makeID(item), makeValue(item)]));
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/makeLookup.js
function makeLookup(items, makeID) {
  return mapMap(items, makeID, identity);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/PriorityMap.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/indexdb/dist/index.js
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
    let version3 = null;
    const D = indexedDB.open(name);
    if (await success(once(D, "success", "error", "blocked"))) {
      const db = D.result;
      version3 = db.version;
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
      version3 = 0;
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
      ++version3;
    }
    const upgrading = new Task();
    const openRequest = isDefined(version3) ? indexedDB.open(name, version3) : indexedDB.open(name);
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/mapJoin.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/sleep.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/withRetry.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/FetchingServiceImplXHR.js
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
  } catch (exp2) {
    console.warn(key, exp2);
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

// src/isDebug.ts
var url = /* @__PURE__ */ new URL(globalThis.location.href);
var isDebug = !url.searchParams.has("RELEASE");

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/singleton.js
function singleton(name, create6) {
  const box = globalThis;
  let value = box[name];
  if (isNullOrUndefined(value)) {
    if (isNullOrUndefined(create6)) {
      throw new Error(`No value ${name} found`);
    }
    value = create6();
    box[name] = value;
  }
  return value;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/fonts.js
var loadedFonts = singleton("juniper::loadedFonts", () => []);

// package.json
var version = "3.7.24";

// src/settings.ts
var version2 = isDebug ? stringRandom(10) : version;
var DEMO_PPI = 50;
var DEMO_DIM = 12;
var DEMO_PX = DEMO_PPI * DEMO_DIM;
var defaultFont = {
  fontFamily: "Lato",
  fontSize: 20
};
var DLSBlue = rgb(30, 67, 136);
var BasicLabelColor = rgb(78, 77, 77);
var baseTextStyle = {
  fontFamily: defaultFont.fontFamily,
  fontSize: defaultFont.fontSize,
  textFillColor: "white"
};
var textButtonStyle = Object.assign({}, baseTextStyle, {
  bgFillColor: rgb(0, 120, 215),
  bgStrokeColor: "black",
  bgStrokeSize: 0.02,
  padding: {
    top: 0.025,
    left: 0.05,
    bottom: 0.025,
    right: 0.05
  },
  minHeight: 0.2,
  maxHeight: 0.2,
  scale: 300
});
var textLabelStyle = Object.assign({}, baseTextStyle, {
  textStrokeColor: "black",
  textStrokeSize: 0.01,
  minHeight: 0.25,
  maxHeight: 0.25
});

// src/createFetcher.ts
function createFetcher(enableWorkers = true) {
  let fallback = new FetchingService(new FetchingServiceImplXHR());
  if (false) {
    fallback = new FetchingServicePool({
      scriptPath: getWorkerUrl("fetcher")
    }, fallback);
  }
  return new Fetcher(fallback, !isDebug);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/URLBuilder.js
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
    pattern = pattern || /\/[^/]+\/?$/;
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

// src/vr-apps/yarrow/proxy.ts
function resolveURL(url2) {
  if (isNullOrUndefined(url2)) {
    return null;
  }
  if (isString(url2)) {
    url2 = new URL(url2, location.href);
  }
  return url2;
}
function stripParameters(url2) {
  if (isNullOrUndefined(url2)) {
    throw new Error("URL is undefined");
  }
  url2 = resolveURL(url2);
  if (isYouTube(url2)) {
    const toRemove = Array.from(url2.searchParams.keys()).filter((key) => key !== "v" && key !== "t");
    for (const key of toRemove) {
      url2.searchParams.delete(key);
    }
  }
  return url2;
}
function makeProxyURL(url2) {
  url2 = resolveURL(url2);
  if (isNullOrUndefined(url2)) {
    throw new Error("URL is undefined");
  }
  url2 = stripParameters(url2);
  return new URLBuilder("/vr/link", location.href).query("q", url2.href).toURL();
}

// src/tests/video/index.ts
(async function() {
  const urls = [
    "https://www.youtube.com/watch?v=sPyAQQklc1s",
    "https://www.youtube.com/watch?v=MgJITGvVfR0",
    "https://www.youtube.com/watch?v=UUzQcPuK8uk",
    "https://www.youtube.com/watch?v=K6uGXtPCjEw",
    "https://www.youtube.com/watch?v=7NGExT9cPKA",
    "https://www.youtube.com/watch?v=mlbWpufL_5s",
    "https://www.youtube.com/watch?v=PqpVB72lZa8",
    "https://www.youtube.com/watch?v=uC7ELzPyrcE"
  ];
  const context = new JuniperAudioContext();
  const player = new VideoPlayer(context, new NoSpatializer(context.destination));
  const fetcher = createFetcher();
  const proxy = new YouTubeProxy(fetcher, makeProxyURL);
  const videosSelect = Select(
    onInput(async () => {
      try {
        videosSelect.disabled = true;
        const video2 = videos.get(videosSelect.value);
        if (isDefined(video2)) {
          await player.load(video2);
        } else {
          player.clear();
        }
      } finally {
        videosSelect.disabled = false;
      }
    }),
    Option("NONE")
  );
  if (context.state !== "running") {
    const btn = ButtonPrimary("Load");
    HtmlRender("main", btn);
    await context.ready;
    btn.remove();
  }
  HtmlRender(
    "main",
    videosSelect,
    BR(),
    player
  );
  videosSelect.disabled = true;
  const videos = new Map(
    await Promise.all(
      urls.map(async (url2) => {
        const data = await proxy.loadData(makeProxyURL(url2).href);
        return [data.title, data];
      })
    )
  );
  HtmlRender(videosSelect, ...Array.from(videos.keys()).map(
    (title) => Option(
      title,
      Value(title)
    )
  ));
  videosSelect.disabled = false;
})();
//# sourceMappingURL=index.js.map
