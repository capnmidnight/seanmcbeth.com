var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
function nothing() {
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/arrays.ts
function defaultKeySelector(obj) {
  return obj;
}
function arrayBinarySearchByKey(arr, itemKey, keySelector) {
  let left = 0;
  let right = arr.length;
  let idx = Math.floor((left + right) / 2);
  let found = false;
  while (left < right && idx < arr.length) {
    const compareTo = arr[idx];
    const compareToKey = isNullOrUndefined(compareTo) ? null : keySelector(compareTo);
    if (isDefined(compareToKey) && itemKey < compareToKey) {
      right = idx;
    } else {
      if (itemKey === compareToKey) {
        found = true;
      }
      left = idx + 1;
    }
    idx = Math.floor((left + right) / 2);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/EventBase.ts
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
  constructor(type2, eventInitDict) {
    super(type2, eventInitDict);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/Task.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/once.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/attrs.ts
var Attr = class {
  /**
   * Creates a new setter functor for HTML Attributes
   * @param key - the attribute name.
   * @param value - the value to set for the attribute.
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
      const arr = this.value.filter(identity);
      if (arr.length > 0) {
        arr.forEach((v) => elem.classList.add(v));
      }
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
function htmlHeight(value) {
  return new Attr("height", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}
function id(value) {
  return new Attr("id", value, false);
}
function rel(value) {
  return new Attr("rel", value, false, "a", "area", "link");
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
function perc(value) {
  return `${value}%`;
}
function em(value) {
  return `${value}em`;
}
function px(value) {
  return `${value}px`;
}
function fr(value) {
  return `${value}fr`;
}
function getMonospaceFonts() {
  return "ui-monospace, 'Droid Sans Mono', 'Cascadia Mono', 'Segoe UI Mono', 'Ubuntu Mono', 'Roboto Mono', Menlo, Monaco, Consolas, monospace";
}
function getMonospaceFamily() {
  return fontFamily(getMonospaceFonts());
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
function backgroundColor(v) {
  return new CssElementStyleProp("backgroundColor", v);
}
function color(v) {
  return new CssElementStyleProp("color", v);
}
function columnGap(v) {
  return new CssElementStyleProp("columnGap", v);
}
function display(v) {
  return new CssElementStyleProp("display", v);
}
function fontFamily(v) {
  return new CssElementStyleProp("fontFamily", v);
}
function gridColumn(vOrColStart, colEnd) {
  if (!isString(vOrColStart)) {
    vOrColStart = [vOrColStart, colEnd].filter(isDefined).join("/");
  }
  return new CssElementStyleProp("gridColumn", vOrColStart);
}
function gridTemplateColumns(...v) {
  return new CssElementStyleProp("gridTemplateColumns", v.join(" "));
}
function height(v) {
  return new CssElementStyleProp("height", v);
}
function overflow(...v) {
  return new CssElementStyleProp("overflow", v.join(" "));
}
function paddingTop(v) {
  return new CssElementStyleProp("paddingTop", v);
}
function whiteSpace(v) {
  return new CssElementStyleProp("whiteSpace", v);
}
function width(v) {
  return new CssElementStyleProp("width", v);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/tags.ts
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
function elementApply(elem, ...children) {
  elem = resolveElement(elem);
  for (const child of children) {
    if (isDefined(child)) {
      if (child instanceof Node) {
        elem.append(child);
      } else if (isErsatzElement(child)) {
        elem.append(resolveElement(child));
      } else if (isIElementAppliable(child)) {
        child.applyToElement(elem);
      } else {
        elem.append(document.createTextNode(child.toLocaleString()));
      }
    }
  }
  return elem;
}
function elementReplace(elem, ...elems) {
  elem = resolveElement(elem);
  elem.replaceWith(...elems.map(resolveElement));
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
function ButtonRaw(...rest) {
  return tag("button", ...rest);
}
function Button(...rest) {
  return ButtonRaw(...rest, type("button"));
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
function Link(...rest) {
  return tag("link", ...rest);
}
function Script(...rest) {
  return tag("script", ...rest);
}
function Span(...rest) {
  return tag("span", ...rest);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/BaseProgress.ts
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
function onClick(callback, opts) {
  return onEvent("click", callback, opts);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/testing/tdd/TestOutputResultsEvent.ts
var TestOutputResultsEvent = class extends TypedEvent {
  constructor(results, stats) {
    super("testoutputresults");
    this.results = results;
    this.stats = stats;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/PriorityMap.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/testing/tdd/TestCaseFailEvent.ts
var TestCaseFailEvent = class extends TypedEvent {
  constructor(message) {
    super("testcasefail");
    this.message = message;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/testing/tdd/TestRunnerResultsEvent.ts
var TestRunnerResultsEvent = class extends TypedEvent {
  /**
   * Creates a new test result event containing the results.
   */
  constructor(results) {
    super("testrunnerresults");
    this.results = results;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/testing/tdd/TestScore.ts
var TestScore = class {
  constructor(name) {
    this.name = name;
    this.state = 0 /* found */;
    this.messages = [];
  }
  start() {
    this.state |= 1 /* started */;
  }
  success() {
    this.state |= 2 /* succeeded */;
  }
  fail(message) {
    this.state |= 4 /* failed */;
    this.messages.push(message);
  }
  finish(value) {
    this.state |= 8 /* completed */;
    if (!!value) {
      this.messages.push(value);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/testing/tdd/TestRunner.ts
function testNames(TestClass) {
  const names = Object.getOwnPropertyNames(TestClass);
  names.sort();
  return names;
}
function isTest(testCase, name, testName) {
  return (name === testName || isNullOrUndefined(testName) && name.startsWith("test_")) && isFunction(testCase[name]);
}
var TestRunner = class extends TypedEventBase {
  constructor(...rest) {
    super();
    this.props = rest.filter((v) => !isFunction(v));
    this.CaseClasses = rest.filter((v) => isFunction(v));
  }
  scaffold() {
    const results = new PriorityMap();
    for (let CaseClass of this.CaseClasses) {
      for (let name of testNames(CaseClass.prototype)) {
        if (isTest(CaseClass.prototype, name)) {
          results.add(CaseClass.name, name, new TestScore(name));
        }
      }
    }
    this.dispatchEvent(new TestRunnerResultsEvent(results));
  }
  async run(testCaseName, testName) {
    const onUpdate = () => this.dispatchEvent(new TestRunnerResultsEvent(results));
    const results = new PriorityMap();
    const q = new Array();
    for (const CaseClass of this.CaseClasses) {
      for (const funcName of testNames(CaseClass.prototype)) {
        if (isTest(CaseClass.prototype, funcName, testName)) {
          results.add(CaseClass.name, funcName, new TestScore(funcName));
          if (CaseClass.name === testCaseName || isNullOrUndefined(testCaseName)) {
            q.push(() => this.runTest(CaseClass, funcName, results, CaseClass.name, onUpdate));
          }
        }
      }
    }
    const update = async () => {
      onUpdate();
      const N = 10;
      for (let i = 0; i < N && q.length > 0; ++i) {
        const test = q.shift();
        await test().finally(nothing);
        if (i === N - 1) {
          setTimeout(update);
        }
      }
    };
    update();
  }
  async runTest(CaseClass, funcName, results, className2, onUpdate) {
    const testCase = new CaseClass(), func = testCase[funcName], caseResults = results.get(className2), score = caseResults.get(funcName);
    const onMessage = (evt) => {
      score.messages.push(evt.message);
      onUpdate();
    };
    const onSuccess = () => {
      score.success();
      onUpdate();
    };
    const onFailure = (evt) => {
      score.fail(evt.message);
      onUpdate();
    };
    for (let prop of this.props) {
      Object.assign(testCase, prop);
    }
    testCase.addEventListener("testcasemessage", onMessage);
    testCase.addEventListener("testcasesuccess", onSuccess);
    testCase.addEventListener("testcasefail", onFailure);
    let message = null;
    try {
      score.start();
      onUpdate();
      testCase.setup();
      message = await func.call(testCase);
    } catch (exp) {
      console.error(`Test case failed [${className2}::${funcName}]`, exp);
      message = exp;
      onFailure(new TestCaseFailEvent(exp));
    }
    score.finish(message);
    onUpdate();
    testCase.teardown();
    testCase.clearEventListeners();
    onUpdate();
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/testing/tdd/TestOutput.ts
var TestOutput = class extends TypedEventBase {
  constructor(...CaseClasses) {
    super();
    this.CaseClasses = CaseClasses;
  }
  /**
   * Runs a specific test within a test case.
   */
  async run(caseName, testName) {
    const testRunner = this.createTestRunner();
    testRunner.run(caseName, testName);
  }
  scaffold() {
    const testRunner = this.createTestRunner();
    testRunner.scaffold();
  }
  createTestRunner() {
    const testRunner = new TestRunner(...this.CaseClasses);
    testRunner.addEventListener("testrunnerresults", (evt) => {
      const results = evt.results;
      let totalFound = 0, totalRan = 0, totalCompleted = 0, totalIncomplete = 0, totalSucceeded = 0, totalFailed = 0;
      for (let test of results.values()) {
        ++totalFound;
        if (test.state & 1 /* started */) {
          ++totalRan;
        }
        if (test.state & 8 /* completed */) {
          ++totalCompleted;
        } else {
          ++totalIncomplete;
        }
        if (test.state & 2 /* succeeded */) {
          ++totalSucceeded;
        }
        if (test.state & 4 /* failed */) {
          ++totalFailed;
        }
      }
      const stats = {
        totalFound,
        totalRan,
        totalCompleted,
        totalIncomplete,
        totalSucceeded,
        totalFailed
      };
      this.dispatchEvent(new TestOutputResultsEvent(results, stats));
    });
    return testRunner;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/testing/tdd/TestOutputHTML.ts
function bar(c, w) {
  return [
    backgroundColor(c),
    color(c),
    width(`${w}%`)
  ];
}
function refresher(thunk, ...rest) {
  return Button(
    onClick(thunk),
    gridColumn(1),
    "\u{1F504}\uFE0F",
    ...rest
  );
}
function makeStatus(id2) {
  const complete = id2 & 8 /* completed */;
  if (id2 & 4 /* failed */) {
    return complete ? "Failure" : "Failing";
  } else if (id2 & 2 /* succeeded */) {
    return complete ? "Success" : "Succeeding";
  } else if (id2 & 1 /* started */) {
    return complete ? "No test ran" : "Running";
  } else {
    return "Found";
  }
}
var TestOutputHTML = class extends TestOutput {
  constructor(...CaseClasses) {
    super(...CaseClasses);
    this.element = Div(id("testOutput"));
    let lastTable = null;
    this.addEventListener("testoutputresults", (evt) => {
      const s = Math.round(100 * evt.stats.totalSucceeded / evt.stats.totalFound), f = Math.round(100 * evt.stats.totalFailed / evt.stats.totalFound), t2 = Math.round(100 * (evt.stats.totalFound - evt.stats.totalSucceeded - evt.stats.totalFailed) / evt.stats.totalFound), basicStyle = [
        display("inline-block"),
        overflow("hidden"),
        height(em(1))
      ], table = Div(
        display("grid"),
        gridTemplateColumns("auto", "auto", "auto", fr(1)),
        getMonospaceFamily(),
        width(perc(100)),
        columnGap(em(1)),
        refresher(() => this.run()),
        Div(
          gridColumn(2, 5),
          height(em(2)),
          whiteSpace("nowrap"),
          overflow("hidden"),
          Span(...basicStyle, ...bar("green", s)),
          Span(...basicStyle, ...bar("red", f)),
          Span(...basicStyle, ...bar("grey", t2))
        ),
        Div(gridColumn(1), "Rerun"),
        Div(gridColumn(2), "Name"),
        Div(gridColumn(3), "Status")
      );
      let lastTestCaseName = null;
      for (let [testCaseName, testName, test] of evt.results.entries()) {
        if (testCaseName !== lastTestCaseName) {
          lastTestCaseName = testCaseName;
          table.append(
            refresher(() => this.run(testCaseName)),
            Div(
              gridColumn(2, 5),
              paddingTop(px(20)),
              testCaseName
            )
          );
        }
        table.append(
          refresher(() => this.run(testCaseName, testName)),
          Div(gridColumn(2), testName),
          Div(gridColumn(3), makeStatus(test.state)),
          Div(gridColumn(4), test.messages.join(", "))
        );
      }
      if (isDefined(lastTable)) {
        elementReplace(lastTable, table);
      } else {
        this.element.append(table);
      }
      lastTable = table;
    });
    this.scaffold();
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/ChildProgressCallback.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/BaseParentProgressCallback.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/progressSplit.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/progress/progressTasks.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/text.ts
var text = /* @__PURE__ */ specialize("text");
var Text_Css = /* @__PURE__ */ text("css", "css");
var Text_Plain = /* @__PURE__ */ text("plain", "txt", "text", "conf", "def", "list", "log", "in");
var Text_Xml = /* @__PURE__ */ text("xml");

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/assertSuccess.ts
function assertSuccess(response) {
  if (response.status >= 400) {
    throw new Error("Resource could not be retrieved: " + response.requestPath);
  }
  return response;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/unwrapResponse.ts
function unwrapResponse(response) {
  const { content } = assertSuccess(response);
  return content;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/Asset.ts
function isAsset(obj) {
  return isDefined(obj) && isFunction(obj.then) && isFunction(obj.catch) && isFunction(obj.finally) && isFunction(obj.fetch) && isFunction(obj.getSize);
}
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
function usingArray(vals, thunk) {
  try {
    return thunk(vals);
  } finally {
    if (isDefined(vals)) {
      for (const val of vals) {
        dispose(val);
      }
    }
  }
}
async function usingAsync(val, thunk) {
  try {
    return await thunk(val);
  } finally {
    dispose(val);
  }
}
async function usingArrayAsync(vals, thunk) {
  try {
    return await thunk(vals);
  } finally {
    if (isDefined(vals)) {
      for (const val of vals) {
        dispose(val);
      }
    }
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/canvas.ts
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
function createOffscreenCanvas(width2, height2) {
  return new OffscreenCanvas(width2, height2);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/waitFor.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/translateResponse.ts
async function translateResponse(response, translate) {
  const {
    status,
    requestPath,
    responsePath,
    content,
    contentType,
    contentLength,
    fileName,
    headers,
    date
  } = response;
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/RequestBuilder.ts
var testAudio = null;
function canPlay(type2) {
  if (testAudio === null) {
    testAudio = new Audio();
  }
  return testAudio.canPlayType(type2) !== "";
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
        for (let [key, value] of Object.entries(body)) {
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
  async audioBuffer(context, acceptType) {
    return translateResponse(
      await this.audioBlob(acceptType),
      async (blob) => await context.decodeAudioData(await blob.arrayBuffer())
    );
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
    return this.htmlElement(
      Img(),
      "load",
      acceptType
    );
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
    const tag2 = Link(
      type(Text_Css),
      rel("stylesheet")
    );
    document.head.append(tag2);
    const response = await this.htmlElement(
      tag2,
      "load",
      Text_Css
    );
    return translateResponse(response);
  }
  async getScript() {
    const tag2 = Script(type(Application_Javascript));
    document.head.append(tag2);
    const response = await this.htmlElement(
      tag2,
      "load",
      Application_Javascript
    );
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
  async worker(type2 = "module") {
    const scriptPath = this.request.path;
    const response = await this.file(Application_Javascript);
    this.prog = null;
    this.request.timeout = null;
    const worker = new Worker(response.content, { type: type2 });
    if (this.prog) {
      this.prog.end(scriptPath);
    }
    return translateResponse(response, () => worker);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/Fetcher.ts
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
    return new RequestBuilder(
      this.service,
      method,
      new URL(path, base || location.href),
      this.useBLOBs
    );
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
    await progressTasksWeighted(
      progress,
      assets.map((asset) => [assetSizes.get(asset), (prog) => asset.fetch(this, prog)])
    );
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/mapMap.ts
function mapMap(items, makeID, makeValue) {
  return new Map(items.map((item) => [makeID(item), makeValue(item)]));
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/makeLookup.ts
function makeLookup(items, makeID) {
  return mapMap(items, makeID, identity);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/PriorityList.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/indexdb/index.ts
var IDexDB = class {
  constructor(db) {
    this.db = db;
  }
  static delete(dbName) {
    const deleteRequest = indexedDB.deleteDatabase(dbName);
    const task = once(deleteRequest, "success", "error", "blocked");
    return success(task);
  }
  static async open(name, ...storeDefs) {
    const storesByName = makeLookup(storeDefs, (v) => v.name);
    const indexesByName = new PriorityMap(
      storeDefs.filter((storeDef) => isDefined(storeDef.indexes)).flatMap((storeDef) => storeDef.indexes.map((indexDef) => [storeDef.name, indexDef.name, indexDef]))
    );
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
    return new IDexDB(openRequest.result);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/mapJoin.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/sleep.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/withRetry.ts
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
    const {
      responsePath,
      status,
      contentType,
      contentLength,
      fileName,
      date,
      headers
    } = await this.readResponseHeaders(requestPath, xhr);
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
      this.tasks.add(
        request.method,
        request.path,
        action().finally(() => this.tasks.delete(request.method, request.path))
      );
    }
    return this.tasks.get(request.method, request.path);
  }
  sendNothingGetNothing(request) {
    return this.withCachedTask(
      request,
      withRetry(request.retryCount, async () => {
        const xhr = new XMLHttpRequest();
        const download = trackProgress(`requesting: ${request.path}`, xhr, xhr, null, true);
        sendRequest(xhr, request.method, request.path, request.timeout, request.headers);
        await download;
        return await this.readResponseHeaders(request.path, xhr);
      })
    );
  }
  sendNothingGetSomething(xhrType, request, progress) {
    return this.withCachedTask(
      request,
      withRetry(request.retryCount, async () => {
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
      })
    );
  }
  sendSomethingGetSomething(xhrType, request, defaultPostHeaders, progress) {
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/testing/tdd/TestCaseMessageEvent.ts
var TestCaseMessageEvent = class extends TypedEvent {
  constructor(message) {
    super("testcasemessage");
    this.message = message;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/testing/tdd/TestCaseSuccessEvent.ts
var TestCaseSuccessEvent = class extends TypedEvent {
  constructor() {
    super("testcasesuccess");
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/testing/tdd/TestCase.ts
var TestCase = class extends TypedEventBase {
  constructor() {
    super(...arguments);
    this.defaultError = 1e-3;
  }
  setup() {
  }
  teardown() {
  }
  message(msg) {
    msg = msg || "N/A";
    this.dispatchEvent(new TestCaseMessageEvent(msg));
  }
  success() {
    this.dispatchEvent(new TestCaseSuccessEvent());
    return true;
  }
  fail(msg) {
    msg = msg || "Fail";
    this.dispatchEvent(new TestCaseFailEvent(msg));
    return false;
  }
  areSame(actual, expected, message) {
    return this.twoValueTest(actual, "==", expected, (a, b) => a == b, message);
  }
  areExact(actual, expected, message) {
    return this.twoValueTest(actual, "===", expected, (a, b) => a === b, message);
  }
  areApprox(actual, expected, messageOrExpectedError, expectedError) {
    expectedError = isNumber(expectedError) && expectedError || isNumber(messageOrExpectedError) && messageOrExpectedError || this.defaultError;
    const actualError = Math.abs(actual - expected);
    const pre = isString(messageOrExpectedError) && messageOrExpectedError || "";
    const message = `(${actualError}) ${pre}`;
    return this.twoValueTest(actual, "~==", expected, (a, b) => Math.abs(a - b) <= expectedError, message);
  }
  isNull(value, message) {
    return this.areExact(value, null, message);
  }
  isNotNull(value, message) {
    return this.isNotEqualTo(value, null, message);
  }
  isUndefined(value, message) {
    return this.areExact(value, void 0, message);
  }
  isNotUndefined(value, message) {
    return this.isNotEqualTo(value, void 0, message);
  }
  isTrue(value, message) {
    return this.areExact(value, true, message);
  }
  isTruthy(value, message) {
    return this.isTrue(!!value, message);
  }
  isFalse(value, message) {
    return this.areExact(value, false, message);
  }
  isFalsey(value, message) {
    return this.isFalse(!!value, message);
  }
  isBoolean(value, message) {
    return this.areExact(value === true || value === false, true, message);
  }
  hasValue(value, message) {
    message = message || value;
    const goodMessage = `${message} is a value`, badMessage = `${message} is not a value`, isValue = value !== null && value !== void 0;
    return this.isTrue(isValue, isValue ? goodMessage : badMessage);
  }
  isEmpty(value, message) {
    message = message || `${value} is empty`;
    return this.areExact(value.length, 0, message);
  }
  isNotEqualTo(actual, expected, message) {
    return this.twoValueTest(actual, "!==", expected, (a, b) => a !== b, message);
  }
  areDifferent(actual, expected, message) {
    return this.twoValueTest(actual, "!=", expected, (a, b) => a != b, message);
  }
  isLessThan(actual, expected, message) {
    return this.twoValueTest(actual, "<", expected, (a, b) => a < b, message);
  }
  isLessThanEqual(actual, expected, message) {
    return this.twoValueTest(actual, "<=", expected, (a, b) => a <= b, message);
  }
  isGreaterThan(actual, expected, message) {
    return this.twoValueTest(actual, ">", expected, (a, b) => a > b, message);
  }
  isGreaterThanEqual(actual, expected, message) {
    return this.twoValueTest(actual, ">=", expected, (a, b) => a >= b, message);
  }
  throws(func, message) {
    return this.throwTest(func, true, message);
  }
  doesNotThrow(func, message) {
    return this.throwTest(func, false, message);
  }
  async resolves(task) {
    await this.doesNotThrow(() => task);
  }
  async rejects(task) {
    await this.throws(() => task);
  }
  twoValueTest(actual, op, expected, testFunc, message) {
    if (testFunc(actual, expected)) {
      return this.success();
    } else {
      return this.fail(`${message || ""} [Actual: ${actual}] ${op} [Expected: ${expected}]`);
    }
  }
  async throwTest(func, op, message) {
    let threw = false;
    try {
      await func();
    } catch (exp) {
      if (!op) {
        console.error(exp);
      }
      threw = true;
    }
    const testValue = threw === op, testString = testValue ? "Success!" : "Fail!", throwMessage = op ? "throw" : "not throw", testMessage = `Expected function to ${throwMessage} -> ${testString}`;
    message = (message && message + ". " || "") + testMessage;
    if (testValue) {
      return this.success();
    } else {
      return this.fail(message);
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/blobToObjectURL.ts
function blobToObjectURL(obj) {
  return new URL(URL.createObjectURL(obj));
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/fetcher/Fetcher.ts
var FetcherTests = class extends TestCase {
  async test_Blob() {
    const fetcher = new Fetcher(new FetchingService(new FetchingServiceImplXHR()));
    const text2 = "Hello, world";
    const textBlob = new Blob([text2], { type: "text/plain" });
    const textURL = blobToObjectURL(textBlob);
    const response = await fetcher.get(textURL).text();
    this.areExact(response.contentType, Text_Plain.value);
    this.areExact(response.content, text2);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/fetcher/index.ts
var tests = [
  FetcherTests
];

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/hax/copyProps.ts
function copyProps(from, to) {
  for (const key in from) {
    let value = from[key];
    if (value instanceof Function) {
      value = value.bind(from);
    }
    to[key] = value;
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/hax/Hax.ts
var Hax = class {
  constructor(source, key, value) {
    this.source = source;
    this.key = key;
    this.value = value;
    this.disposed = false;
  }
  dispose() {
    if (!this.disposed) {
      this.disposed = true;
      this.source[this.key] = this.value;
    }
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/hax/haxClass.ts
function haxClass(obj, constructor, name, hax, obj2 = null) {
  if (constructor !== obj[name]) {
    throw new Error(`The provided class constructor is not the same object as the field "${name}" in the provided object.`);
  }
  obj[name] = function(...args) {
    hax.apply(obj2, args);
    return new constructor(...args);
  };
  copyProps(constructor, obj[name]);
  return new Hax(obj, name, constructor);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/hax/haxMethod.ts
function haxMethod(obj, method, name, hax, obj2 = null) {
  if (method != obj[name]) {
    throw new Error(`The provided method is not the same object as the field "${name}" in the provided object.`);
  }
  obj[name] = function(...params) {
    hax.apply(obj2, params);
    return method.apply(obj, params);
  };
  copyProps(method, obj[name]);
  return new Hax(obj, name, method);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/hax/index.ts
var haxTests = class extends TestCase {
  test_Method() {
    const oldLog = console.log;
    const values = [];
    using(haxMethod(console, console.log, "log", values.push.bind(values)), () => {
      this.areDifferent(console.log, oldLog);
      console.log("Hello", "world");
      this.areExact("Hello", values[0]);
      this.areExact("world", values[1]);
    });
    this.areExact(console.log, oldLog);
  }
  async test_Class() {
    const fetcher = new Fetcher(new FetchingService(new FetchingServiceImplXHR()));
    const oldURL = window.URL;
    const values = new Array();
    const blob = new Blob(["asdf"], { type: "text/plain" });
    const x = URL.createObjectURL(blob);
    await usingAsync(haxClass(window, URL, "URL", values.push.bind(values)), async () => {
      this.areDifferent(window.URL, oldURL);
      const y = URL.createObjectURL(blob);
      const url = new URL("images", "https://www.seanmcbeth.com/");
      this.areExact(url.href, "https://www.seanmcbeth.com/images");
      this.areExact("images", values[0]);
      this.areExact("https://www.seanmcbeth.com/", values[1]);
      const xText = await fetcher.get(x).text().then(unwrapResponse);
      const yText = await fetcher.get(y).text().then(unwrapResponse);
      this.areExact(yText, xText);
    });
    this.areSame(window.URL, oldURL);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/BaseGraphNode.ts
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
      arraySortedInsert(this._forward, child, (n2) => keySelector(n2.value));
      arraySortedInsert(child._reverse, this, (n2) => keySelector(n2.value));
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
    return this.search((n2) => n2.value === v, breadthFirst);
  }
  findAll(v, breadthFirst = true) {
    return this.searchAll((n2) => n2.value === v, breadthFirst);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/TreeNode.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/tslib/collections/TreeNode.ts
var TreeNodeTests = class extends TestCase {
  setup() {
    this.tree = new TreeNode(0);
    const one = new TreeNode(1);
    const two = new TreeNode(2);
    this.tree.connectTo(one);
    this.tree.connectTo(two);
    one.connectTo(new TreeNode(3));
    one.connectTo(new TreeNode(4));
    two.connectTo(new TreeNode(5));
    two.connectTo(new TreeNode(6));
  }
  test_BreadthFirst() {
    const values = Array.from(this.tree.breadthFirst()).map((node) => node.value);
    this.areExact(values[0], 0);
    this.areExact(values[1], 1);
    this.areExact(values[2], 2);
    this.areExact(values[3], 3);
    this.areExact(values[4], 4);
    this.areExact(values[5], 5);
    this.areExact(values[6], 6);
  }
  test_DepthFirst() {
    const values = Array.from(this.tree.depthFirst()).map((node) => node.value);
    this.areExact(values[0], 6);
    this.areExact(values[1], 5);
    this.areExact(values[2], 2);
    this.areExact(values[3], 4);
    this.areExact(values[4], 3);
    this.areExact(values[5], 1);
    this.areExact(values[6], 0);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/tslib/collections/index.ts
var tests2 = [
  TreeNodeTests
];

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/tslib/events/once.ts
var WithValueEvent = class extends TypedEvent {
  constructor(type2, value) {
    super(type2);
    this.value = value;
  }
};
var Rig = class extends TypedEventBase {
  triggerGood() {
    this.dispatchEvent(new TypedEvent("good"));
  }
  triggerWithValue(value) {
    this.dispatchEvent(new WithValueEvent("withValue", value));
  }
  triggerBad() {
    this.dispatchEvent(new TypedEvent("bad"));
  }
};
var OnceTests = class extends TestCase {
  setup() {
    this.rig = new Rig();
  }
  async test_Good() {
    const task = once(this.rig, "good");
    await this.doesNotThrow(async () => {
      this.rig.triggerGood();
      const evt = await task;
      this.areExact(evt.type, "good");
    });
  }
  async test_WithValue() {
    const task = once(this.rig, "withValue");
    const value = 13;
    await this.doesNotThrow(async () => {
      this.rig.triggerWithValue(value);
      const evt = await task;
      this.areExact(evt.type, "withValue");
      this.areExact(evt instanceof WithValueEvent && evt.value, value);
    });
  }
  async test_Timeout() {
    const timeout = 250;
    await this.rejects(once(this.rig, "good", timeout));
  }
  async test_NoTimeout() {
    const timeout = 250;
    const task = once(this.rig, "good", timeout);
    await this.doesNotThrow(async () => {
      this.rig.triggerGood();
      const evt = await task;
      this.areExact(evt.type, "good");
    });
  }
  async test_Bad() {
    const task = once(this.rig, "good", "bad");
    this.rig.triggerBad();
    await this.rejects(task);
  }
};
var SuccessTests = class extends TestCase {
  setup() {
    this.rig = new Rig();
  }
  async test_Good() {
    const task = once(this.rig, "good");
    await this.doesNotThrow(async () => {
      this.rig.triggerGood();
      this.isTrue(await success(task));
    });
  }
  async test_WithValue() {
    const task = once(this.rig, "withValue");
    const value = 13;
    await this.doesNotThrow(async () => {
      this.rig.triggerWithValue(value);
      this.isTrue(await success(task));
      this.areExact(task.result.type, "withValue");
      this.areExact(task.result instanceof WithValueEvent && task.result.value, value);
    });
  }
  async test_Timeout() {
    const timeout = 250;
    const task = once(this.rig, "good", timeout);
    await this.doesNotThrow(async () => {
      this.isFalse(await success(task));
    });
  }
  async test_NoTimeout() {
    const timeout = 250;
    const task = once(this.rig, "good", timeout);
    await this.doesNotThrow(async () => {
      this.rig.triggerGood();
      this.isTrue(await success(task));
      this.areExact(task.result.type, "good");
    });
  }
  async test_Bad() {
    const task = once(this.rig, "good", "bad");
    await this.doesNotThrow(async () => {
      this.rig.triggerBad();
      this.isFalse(await success(task));
    });
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/tslib/events/Task.ts
var TaskTests = class extends TestCase {
  async test_Basic() {
    const task = new Task();
    task.resolve(true);
    const value = await task;
    this.isTrue(value);
  }
  async test_NoDoubleResolve() {
    const task = new Task();
    let counter = 0;
    task.then(() => ++counter);
    task.resolve();
    await task;
    task.resolve();
    await task;
    this.areExact(counter, 1);
  }
  async test_NoDoubleResolveAfterReset() {
    const task = new Task();
    let counter = 0;
    task.then(() => ++counter);
    task.resolve();
    await task;
    task.reset();
    task.resolve();
    await task;
    this.areExact(counter, 1);
  }
  async test_ThenableAfterAfterReset() {
    const task = new Task();
    let counter = 0;
    task.then(() => ++counter);
    task.resolve();
    await task;
    task.reset();
    task.then(() => ++counter);
    task.resolve();
    await task;
    this.areExact(counter, 2);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/tslib/events/TypedEventBase.ts
var Rig2 = class extends TypedEventBase {
  triggerBubbles() {
    const evt = new TypedEvent("test", { bubbles: true });
    this.dispatchEvent(evt);
  }
  triggerNoBubbles() {
    const evt = new TypedEvent("test", { bubbles: true });
    evt.cancelBubble = true;
    this.dispatchEvent(evt);
  }
};
var TypedEventBaseTests = class extends TestCase {
  setup() {
  }
  async test_Bubbles() {
    const parent = new Rig2();
    const child = new Rig2();
    child.addBubbler(parent);
    const task = once(parent, "test", 10);
    child.triggerBubbles();
    await this.resolves(task);
  }
  async test_CancelBubble() {
    const parent = new Rig2();
    const child = new Rig2();
    child.addBubbler(parent);
    const task = once(parent, "test", 10);
    const evt = new TypedEvent("test");
    evt.cancelBubble = true;
    child.triggerNoBubbles();
    await this.rejects(task);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/tslib/events/index.ts
var tests3 = [
  OnceTests,
  SuccessTests,
  TaskTests,
  TypedEventBaseTests
];

// ../Juniper/src/Juniper.TypeScript/node_modules/gl-matrix/esm/common.js
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

// ../Juniper/src/Juniper.TypeScript/node_modules/gl-matrix/esm/vec3.js
var vec3_exports = {};
__export(vec3_exports, {
  add: () => add,
  angle: () => angle,
  bezier: () => bezier,
  ceil: () => ceil,
  clone: () => clone,
  copy: () => copy,
  create: () => create2,
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
function create2() {
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
function scaleAndAdd(out, a, b, scale3) {
  out[0] = a[0] + b[0] * scale3;
  out[1] = a[1] + b[1] * scale3;
  out[2] = a[2] + b[2] * scale3;
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
function random(out, scale3) {
  scale3 = scale3 || 1;
  var r = RANDOM() * 2 * Math.PI;
  var z = RANDOM() * 2 - 1;
  var zScale = Math.sqrt(1 - z * z) * scale3;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale3;
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
  var vec = create2();
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

// ../Juniper/src/Juniper.TypeScript/node_modules/gl-matrix/esm/vec2.js
var vec2_exports = {};
__export(vec2_exports, {
  add: () => add2,
  angle: () => angle2,
  ceil: () => ceil2,
  clone: () => clone2,
  copy: () => copy2,
  create: () => create3,
  cross: () => cross2,
  dist: () => dist2,
  distance: () => distance2,
  div: () => div2,
  divide: () => divide2,
  dot: () => dot2,
  equals: () => equals2,
  exactEquals: () => exactEquals2,
  floor: () => floor2,
  forEach: () => forEach2,
  fromValues: () => fromValues2,
  inverse: () => inverse2,
  len: () => len2,
  length: () => length2,
  lerp: () => lerp2,
  max: () => max2,
  min: () => min2,
  mul: () => mul2,
  multiply: () => multiply2,
  negate: () => negate2,
  normalize: () => normalize2,
  random: () => random2,
  rotate: () => rotate,
  round: () => round2,
  scale: () => scale2,
  scaleAndAdd: () => scaleAndAdd2,
  set: () => set2,
  sqrDist: () => sqrDist2,
  sqrLen: () => sqrLen2,
  squaredDistance: () => squaredDistance2,
  squaredLength: () => squaredLength2,
  str: () => str2,
  sub: () => sub2,
  subtract: () => subtract2,
  transformMat2: () => transformMat2,
  transformMat2d: () => transformMat2d,
  transformMat3: () => transformMat32,
  transformMat4: () => transformMat42,
  zero: () => zero2
});
function create3() {
  var out = new ARRAY_TYPE(2);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }
  return out;
}
function clone2(a) {
  var out = new ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
function fromValues2(x, y) {
  var out = new ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
function copy2(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
function set2(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
function add2(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
function subtract2(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
function multiply2(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
function divide2(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}
function ceil2(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  return out;
}
function floor2(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  return out;
}
function min2(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
}
function max2(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
}
function round2(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  return out;
}
function scale2(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
function scaleAndAdd2(out, a, b, scale3) {
  out[0] = a[0] + b[0] * scale3;
  out[1] = a[1] + b[1] * scale3;
  return out;
}
function distance2(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1];
  return Math.hypot(x, y);
}
function squaredDistance2(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1];
  return x * x + y * y;
}
function length2(a) {
  var x = a[0], y = a[1];
  return Math.hypot(x, y);
}
function squaredLength2(a) {
  var x = a[0], y = a[1];
  return x * x + y * y;
}
function negate2(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
function inverse2(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  return out;
}
function normalize2(out, a) {
  var x = a[0], y = a[1];
  var len3 = x * x + y * y;
  if (len3 > 0) {
    len3 = 1 / Math.sqrt(len3);
  }
  out[0] = a[0] * len3;
  out[1] = a[1] * len3;
  return out;
}
function dot2(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
function cross2(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
}
function lerp2(out, a, b, t2) {
  var ax = a[0], ay = a[1];
  out[0] = ax + t2 * (b[0] - ax);
  out[1] = ay + t2 * (b[1] - ay);
  return out;
}
function random2(out, scale3) {
  scale3 = scale3 || 1;
  var r = RANDOM() * 2 * Math.PI;
  out[0] = Math.cos(r) * scale3;
  out[1] = Math.sin(r) * scale3;
  return out;
}
function transformMat2(out, a, m) {
  var x = a[0], y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
}
function transformMat2d(out, a, m) {
  var x = a[0], y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
function transformMat32(out, a, m) {
  var x = a[0], y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
function transformMat42(out, a, m) {
  var x = a[0];
  var y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}
function rotate(out, a, b, rad) {
  var p0 = a[0] - b[0], p1 = a[1] - b[1], sinC = Math.sin(rad), cosC = Math.cos(rad);
  out[0] = p0 * cosC - p1 * sinC + b[0];
  out[1] = p0 * sinC + p1 * cosC + b[1];
  return out;
}
function angle2(a, b) {
  var x1 = a[0], y1 = a[1], x2 = b[0], y2 = b[1], mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2), cosine = mag && (x1 * x2 + y1 * y2) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
function zero2(out) {
  out[0] = 0;
  out[1] = 0;
  return out;
}
function str2(a) {
  return "vec2(" + a[0] + ", " + a[1] + ")";
}
function exactEquals2(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
function equals2(a, b) {
  var a0 = a[0], a1 = a[1];
  var b0 = b[0], b1 = b[1];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1));
}
var len2 = length2;
var sub2 = subtract2;
var mul2 = multiply2;
var div2 = divide2;
var dist2 = distance2;
var sqrDist2 = squaredDistance2;
var sqrLen2 = squaredLength2;
var forEach2 = function() {
  var vec = create3();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 2;
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
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }
    return a;
  };
}();

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/math.ts
var Pi = Math.PI;
var HalfPi = 0.5 * Pi;
var Tau = 2 * Pi;
var TIME_MAX = 864e13;
var TIME_MIN = -TIME_MAX;
function deg2rad(degrees) {
  return degrees * Tau / 360;
}
function rad2deg(radians) {
  return radians * 360 / Tau;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/gis/Datum.ts
var FalseNorthing = 1e7;
var invF = 298.257223563;
var equatorialRadius = 6378137;
var pointScaleFactor = 0.9996;
var E0 = 5e5;
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
var DatumWGS_84 = {
  FalseNorthing,
  equatorialRadius,
  pointScaleFactor,
  E0,
  A,
  flattening,
  e,
  esq,
  e0sq,
  alpha1,
  alpha2,
  alpha3,
  alpha4,
  beta,
  delta
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/gis/UTMPoint.ts
var UTMPoint = class {
  static centroid(points) {
    const zoneCounts = /* @__PURE__ */ new Map();
    points.forEach((p) => zoneCounts.set(p.zone, (zoneCounts.get(p.zone) || 0) + 1));
    let maxZone = 0;
    let maxZoneCount = 0;
    for (const [zone, count] of zoneCounts) {
      if (count > maxZoneCount) {
        maxZone = zone;
        maxZoneCount = count;
      }
    }
    const scale3 = 1 / points.length;
    const vec = points.map((p) => p.rezone(maxZone).toVec3()).reduce((a, b) => vec3_exports.scaleAndAdd(a, a, b, scale3), vec3_exports.create());
    return new UTMPoint().fromVec3(vec, maxZone).toLatLng().toUTM();
  }
  /**
   * The east/west component of the coordinate.
   **/
  get easting() {
    return this._easting;
  }
  /**
   * The north/south component of the coordinate.
   **/
  get northing() {
    return this._northing;
  }
  /**
   * An altitude component.
   **/
  get altitude() {
    return this._altitude;
  }
  /**
   * The UTM Zone for which this coordinate represents.
   **/
  get zone() {
    return this._zone;
  }
  /**
   * The hemisphere in which the UTM point sits.
   **/
  get hemisphere() {
    return this.northing >= 0 ? "northern" : "southern";
  }
  constructor(eastingOrCopy, northing, altitude, zone) {
    if (isObject(eastingOrCopy)) {
      this._easting = eastingOrCopy.easting;
      this._northing = eastingOrCopy.northing;
      this._altitude = eastingOrCopy.altitude;
      this._zone = eastingOrCopy.zone;
    } else {
      this._easting = eastingOrCopy || 0;
      this._northing = northing || 0;
      this._altitude = altitude || 0;
      this._zone = zone || 0;
    }
  }
  toJSON() {
    return JSON.stringify({
      easting: this.easting,
      northing: this.northing,
      altitude: this.altitude,
      zone: this.zone,
      hemisphere: this.hemisphere
    });
  }
  toString() {
    return `(${this.easting}, ${this.northing}, ${this.altitude}) zone ${this.zone}`;
  }
  equals(other) {
    return isDefined(other) && this.hemisphere == other.hemisphere && this.easting == other.easting && this.northing == other.northing && this.altitude == other.altitude && this.zone == other.zone;
  }
  static A(cosPhi, lng, utmz) {
    const zcm = 3 + 6 * (utmz - 1) - 180;
    return deg2rad(lng - zcm) * cosPhi;
  }
  static getZoneWidthAtLatitude(lat) {
    const phi = deg2rad(lat);
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    const tanPhi = sinPhi / cosPhi;
    const ePhi = DatumWGS_84.e * sinPhi;
    const N = DatumWGS_84.equatorialRadius / Math.sqrt(1 - ePhi * ePhi);
    const T = tanPhi * tanPhi;
    const C = DatumWGS_84.e0sq * cosPhi * cosPhi;
    const Tsqr = T * T;
    const A2 = deg2rad(3) * cosPhi;
    const Asqr = A2 * A2;
    const x0 = 1 - T + C;
    const x1 = 5 - 18 * T + Tsqr + 72 * C - 58 * DatumWGS_84.e0sq;
    const x2 = x0 / 6 + Asqr * x1 / 120;
    const x3 = 1 + Asqr * x2;
    const width2 = 2 * DatumWGS_84.pointScaleFactor * N * A2 * x3;
    return width2;
  }
  /**
   * Converts this UTMPoint to a Latitude/Longitude point using the WGS-84 datum. The
   * coordinate pair's units will be in meters, and should be usable to make distance
   * calculations over short distances.
   * reference: http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
   **/
  fromLatLng(latLng) {
    const phi = deg2rad(latLng.lat);
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    const cosPhi2 = 2 * cosPhi;
    const sin2Phi = cosPhi2 * sinPhi;
    const cos2Phi = cosPhi2 * cosPhi - 1;
    const cos2Phi2 = 2 * cos2Phi;
    const sin4Phi = cos2Phi2 * sin2Phi;
    const cos4Phi = cos2Phi2 * cos2Phi - 1;
    const sin6Phi = sin4Phi * cos2Phi + cos4Phi * sin2Phi;
    const tanPhi = sinPhi / cosPhi;
    const ePhi = DatumWGS_84.e * sinPhi;
    const N = DatumWGS_84.equatorialRadius / Math.sqrt(1 - ePhi * ePhi);
    const M = DatumWGS_84.equatorialRadius * (phi * DatumWGS_84.alpha1 - sin2Phi * DatumWGS_84.alpha2 + sin4Phi * DatumWGS_84.alpha3 - sin6Phi * DatumWGS_84.alpha4);
    const utmz = 1 + (latLng.lng + 180) / 6 | 0;
    const A2 = UTMPoint.A(cosPhi, latLng.lng, utmz);
    const Asqr = A2 * A2;
    const T = tanPhi * tanPhi;
    const C = DatumWGS_84.e0sq * cosPhi * cosPhi;
    const Tsqr = T * T;
    const x0 = 1 - T + C;
    const x1 = 5 - 18 * T + Tsqr + 72 * C - 58 * DatumWGS_84.e0sq;
    const x2 = Asqr * x1 / 120;
    const x3 = x0 / 6 + x2;
    const x4 = 1 + Asqr * x3;
    const easting = DatumWGS_84.pointScaleFactor * N * A2 * x4 + DatumWGS_84.E0;
    const y0 = 5 - T + 9 * C + 4 * C * C;
    const y1 = 61 - 58 * T + Tsqr + 600 * C - 330 * DatumWGS_84.e0sq;
    const y2 = y0 / 24 + Asqr * y1 / 720;
    const y3 = 0.5 + Asqr * y2;
    const y4 = M + N * tanPhi * Asqr * y3;
    const northing = DatumWGS_84.pointScaleFactor * y4;
    this._easting = easting;
    this._northing = northing;
    this._altitude = latLng.alt;
    this._zone = utmz;
    return this;
  }
  rezone(newZone) {
    if (!(1 <= newZone && newZone <= 60)) {
      throw new Error(`Zones must be on the range [1, 60]. Given: ${newZone}`);
    }
    if (newZone !== this.zone) {
      const deltaZone = newZone - this.zone;
      const ll = this.toLatLng();
      const width2 = UTMPoint.getZoneWidthAtLatitude(ll.lat);
      return new UTMPoint(
        this.easting - width2 * deltaZone,
        this.northing,
        this.altitude,
        newZone
      );
    } else {
      return this;
    }
  }
  /**
   * Converts this UTMPoint to a Latitude/Longitude point using the WGS-84 datum. The
   * coordinate pair's units will be in meters, and should be usable to make distance
   * calculations over short distances.
   * reference: http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
   **/
  toLatLng() {
    return new LatLngPoint().fromUTM(this);
  }
  toVec2() {
    const v = vec2_exports.create();
    vec2_exports.set(v, this.easting, -this.northing);
    return v;
  }
  fromVec2(arr, zone) {
    this._easting = arr[0];
    this._northing = -arr[1];
    this._altitude = 0;
    this._zone = zone;
    return this;
  }
  toVec3() {
    const v = vec3_exports.create();
    vec3_exports.set(v, this.easting, this.altitude, -this.northing);
    return v;
  }
  fromVec3(arr, zone) {
    this._easting = arr[0];
    this._altitude = arr[1];
    this._northing = -arr[2];
    this._zone = zone;
    return this;
  }
  copy(other) {
    this._easting = other.easting;
    this._northing = other.northing;
    this._altitude = other.altitude;
    this._zone = other.zone;
    return this;
  }
  clone() {
    return new UTMPoint(this);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/gis/LatLngPoint.ts
var LatLngPoint = class {
  static centroid(points) {
    const scale3 = 1 / points.length;
    const vec = points.map((p) => p.toVec3()).reduce((a, b) => vec3_exports.scaleAndAdd(a, a, b, scale3), vec3_exports.create());
    return new LatLngPoint().fromVec3(vec);
  }
  /**
   * An altitude value thrown in just for kicks. It makes some calculations and conversions
   * easier if we keep the Altitude value.
   **/
  get alt() {
    return this._alt;
  }
  /**
   * Lines of latitude run east/west around the globe, parallel to the equator, never
   * intersecting. They measure angular distance north/south.
   **/
  get lat() {
    return this._lat;
  }
  /**
   * Lines of longitude run north/south around the globe, intersecting at the poles. They
   * measure angular distance east/west.
   **/
  get lng() {
    return this._lng;
  }
  constructor(lat, lng, alt) {
    if (isObject(lat)) {
      this._lat = lat.lat;
      this._lng = lat.lng;
      this._alt = lat.alt;
    } else {
      this._lat = lat || 0;
      this._lng = lng || 0;
      this._alt = alt;
    }
  }
  toJSON() {
    return JSON.stringify({
      lat: this.lat,
      lng: this.lng,
      alt: this.alt
    });
  }
  static parseDMS(value) {
    const parts = value.split(" ");
    if (parts.length == 3) {
      const hemisphere = parts[0];
      const degrees = parseInt(parts[1], 10);
      const minutes = parseFloat(parts[2]);
      if ((hemisphere == "N" || hemisphere == "S" || hemisphere == "E" || hemisphere == "W") && Number.isInteger(degrees) && Number.isFinite(minutes)) {
        let dec = degrees + minutes / 60;
        if (hemisphere == "S" || hemisphere == "W") {
          dec *= -1;
        }
        return dec;
      }
    }
    return Number.NaN;
  }
  static parseDMSPair(value) {
    const parts = value.split(",");
    if (parts.length == 2) {
      const lat = LatLngPoint.parseDMS(parts[0]);
      const lng = LatLngPoint.parseDMS(parts[1]);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        return new LatLngPoint(lat, lng);
      }
    }
    return null;
  }
  static parseDecimal(value) {
    const parts = value.split(",");
    if (parts.length == 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return new LatLngPoint(lat, lng);
      }
    }
    return null;
  }
  /**
   * Try to parse a string as a Latitude/Longitude.
   **/
  static parse(value) {
    const asDecimal = LatLngPoint.parseDecimal(value);
    const asDMS = LatLngPoint.parseDMSPair(value);
    return asDecimal || asDMS;
  }
  /**
   * Pretty-print the Degrees/Minutes/Second version of the Latitude/Longitude angles.
   * @param sigfigs
   */
  toDMS(sigfigs, withAltitude = true) {
    const latStr = LatLngPoint.toDMS(this.lat, "S", "N", sigfigs);
    const lngStr = LatLngPoint.toDMS(this.lng, "W", "E", sigfigs);
    if (this.alt && withAltitude) {
      const altStr = `${this.alt.toFixed(sigfigs)}m`;
      return `<${latStr}, ${lngStr}> alt ${altStr}`;
    } else {
      return `<${latStr}, ${lngStr}>`;
    }
  }
  toDMSArray(sigfigs, withAltitude = false) {
    const parts = [
      LatLngPoint.toDMS(this.lat, "S", "N", sigfigs),
      LatLngPoint.toDMS(this.lng, "W", "E", sigfigs)
    ];
    if (this.alt && withAltitude) {
      parts.push(`${this.alt.toFixed(sigfigs)}m`);
    }
    return parts;
  }
  /**
   * Pretty-print the Degrees/Minutes/Second version of the Latitude/Longitude angles.
   * @param value The decimal degree value to format
   * @param negative The string prefix to use when the value is negative
   * @param positive The string prefix to use when the value is positive
   * @param sigfigs The number of significant figures to which to print the value
   */
  static toDMS(value, negative, positive, sigfigs) {
    const hemisphere = value < 0 ? negative : positive;
    value = Math.abs(value);
    const degrees = Math.floor(value);
    const minutes = (value - degrees) * 60;
    const intMinutes = Math.floor(minutes);
    const seconds = (minutes - intMinutes) * 60;
    let secondsStr = seconds.toFixed(sigfigs);
    while (secondsStr.indexOf(".") <= 1) {
      secondsStr = `0${secondsStr}`;
    }
    return `${hemisphere} ${degrees.toFixed(0)}\xB0 ${intMinutes.toFixed(0)}' ${secondsStr}"`;
  }
  /**
   * Pretty-print the LatLngPoint for easier debugging.
   * @param sigfigs
   */
  toString(sigfigs) {
    sigfigs = sigfigs || 6;
    return `(${this.lat.toFixed(sigfigs)}\xB0, ${this.lng.toFixed(sigfigs)}\xB0)`;
  }
  /**
   * Check two LatLngPoints to see if they overlap.
   * @param other
   */
  equals(other) {
    return isObject(other) && this.lat == other.lat && this.lng == other.lng && this.alt == other.alt;
  }
  compareTo(other) {
    if (isNullOrUndefined(other)) {
      return -1;
    } else {
      const byLat = this.lat - other.lat;
      const byLng = this.lng - other.lng;
      const byAlt = (this.alt || 0) - (other.alt || 0);
      if (byLat == 0 && byLng == 0) {
        return byAlt;
      } else if (byLat == 0) {
        return byLng;
      } else {
        return byLat;
      }
    }
  }
  /**
   * Calculate a rough distance, in meters, between two LatLngPoints.
   * @param other
   */
  distance(other) {
    const a = this.toUTM();
    const b = other.toUTM().rezone(a.zone);
    const dx = b.easting - a.easting;
    const dy = b.northing - a.northing;
    return Math.sqrt(dx * dx + dy * dy);
  }
  /**
   * Converts this UTMPoint to a Latitude/Longitude point using the WGS-84 datum. The
   * coordinate pair's units will be in meters, and should be usable to make distance
   * calculations over short distances.
   * reference: http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
   **/
  fromUTM(utm) {
    const N0 = utm.hemisphere === "southern" && utm.northing >= 0 ? DatumWGS_84.FalseNorthing : 0;
    const xi = (utm.northing - N0) / (DatumWGS_84.pointScaleFactor * DatumWGS_84.A);
    const eta = (utm.easting - DatumWGS_84.E0) / (DatumWGS_84.pointScaleFactor * DatumWGS_84.A);
    let xiPrime = xi;
    let etaPrime = eta;
    for (let j = 1; j <= 3; ++j) {
      const beta2 = DatumWGS_84.beta[j - 1];
      const je2 = 2 * j * xi;
      const jn2 = 2 * j * eta;
      const sinje2 = Math.sin(je2);
      const coshjn2 = Math.cosh(jn2);
      const cosje2 = Math.cos(je2);
      const sinhjn2 = Math.sinh(jn2);
      xiPrime -= beta2 * sinje2 * coshjn2;
      etaPrime -= beta2 * cosje2 * sinhjn2;
    }
    const chi = Math.asin(Math.sin(xiPrime) / Math.cosh(etaPrime));
    let lat = chi;
    for (let j = 1; j <= 3; ++j) {
      lat += DatumWGS_84.delta[j - 1] * Math.sin(2 * j * chi);
    }
    const long0 = utm.zone * 6 - 183;
    const lng = Math.atan(Math.sinh(etaPrime) / Math.cos(xiPrime));
    this._lat = rad2deg(lat);
    this._lng = long0 + rad2deg(lng);
    while (this._lng < -180) {
      this._lng += 360;
    }
    while (this._lng > 180) {
      this._lng -= 360;
    }
    this._alt = utm.altitude;
    return this;
  }
  /**
   * Converts this LatLngPoint to a Universal Transverse Mercator point using the WGS-84
   * datum. The coordinate pair's units will be in meters, and should be usable to make
   * distance calculations over short distances.
   *
   * @see http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
   **/
  toUTM() {
    return new UTMPoint().fromLatLng(this);
  }
  toVec2() {
    const v = vec2_exports.create();
    vec2_exports.set(v, this.lng, this.lat);
    return v;
  }
  fromVec2(v) {
    this._lng = v[0];
    this._lat = v[1];
    this._alt = void 0;
    return this;
  }
  toVec3() {
    const v = vec3_exports.create();
    vec3_exports.set(v, this.lng, this.alt, this.lat);
    return v;
  }
  fromVec3(v) {
    this._lng = v[0];
    this._alt = v[1];
    this._lat = v[2];
    return this;
  }
  toArray() {
    return [this._lng, this._alt, this._lat];
  }
  fromArray(arr) {
    return this.fromVec3(arr);
  }
  copy(other) {
    this._lat = other.lat;
    this._lng = other.lng;
    this._alt = other.alt;
    return this;
  }
  clone() {
    return new LatLngPoint(this);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/tslib/gis/UTMPoint.ts
var K = 1e-8;
var UTMPointTests = class extends TestCase {
  setup() {
  }
  conversionTest(lat, lng, alt, easting, northing, zone, hemisphere) {
    const llExpected = new LatLngPoint(lat, lng, alt);
    const utmActual = llExpected.toUTM();
    const utmExpected = new UTMPoint(easting, northing, alt, zone);
    const llActual = utmExpected.toLatLng();
    this.areApprox(utmActual.easting, utmExpected.easting, "Easting");
    this.areApprox(utmActual.northing, utmExpected.northing, "Northing");
    this.areApprox(utmActual.altitude, utmExpected.altitude, "Altitude");
    this.areApprox(utmActual.zone, utmExpected.zone, "Zone");
    this.areExact(utmActual.hemisphere, utmExpected.hemisphere, "Hemisphere 1");
    this.areExact(utmActual.hemisphere, hemisphere, "Hemisphere 2");
    this.areApprox(llActual.lat, llExpected.lat, "Latitude");
    this.areApprox(llActual.lng, llExpected.lng, "Longitude");
    this.areApprox(llActual.alt, llExpected.alt, "Altitude");
  }
  test_JonesPoint() {
    this.conversionTest(38.790342, -77.040682, 0, 322765.32, 42954888e-1, 18, "northern");
  }
  test_ZeroLatLng() {
    this.conversionTest(0, 0, 0, 166021.443, 0, 31, "northern");
  }
  test_NorthernHemisphereIsAllPositiveNorthings() {
    for (let lat = 0; lat <= 90; ++lat) {
      const ll = new LatLngPoint(lat, 0);
      const utm = ll.toUTM();
      this.isGreaterThanEqual(utm.northing, 0, `Latitude ${lat}`);
    }
  }
  test_SouthernHemisphereIsAllNegativeNorthings() {
    for (let lat = 0; lat >= -90; --lat) {
      const ll = new LatLngPoint(lat, 0);
      const utm = ll.toUTM();
      this.isLessThanEqual(utm.northing, 0, `Latitude ${lat}`);
    }
  }
  test_ZoneBoundaries() {
    const ll1 = new LatLngPoint(0, 0 - K, 0);
    const ll2 = new LatLngPoint(0, 0, 0);
    const ll3 = new LatLngPoint(0, K, 0);
    const ll4 = new LatLngPoint(0, 6 - 2 * K, 0);
    const ll5 = new LatLngPoint(0, 6 - K, 0);
    const ll6 = new LatLngPoint(0, 6, 0);
    const utm2 = ll2.toUTM();
    const utm1 = ll1.toUTM().rezone(utm2.zone);
    const utm3 = ll3.toUTM();
    const utm4 = ll4.toUTM();
    const utm5 = ll5.toUTM();
    const utm6 = ll6.toUTM().rezone(utm5.zone);
    const dEasting1 = utm2.easting - utm1.easting;
    const dEasting2 = utm3.easting - utm2.easting;
    const dEasting3 = utm5.easting - utm4.easting;
    const dEasting4 = utm6.easting - utm5.easting;
    this.areApprox(dEasting1, dEasting2, "A", 0.01);
    this.areApprox(dEasting1, dEasting3, "B", 0.01);
    this.areApprox(dEasting1, dEasting4, "C", 0.01);
    this.areApprox(dEasting2, dEasting3, "D", 0.01);
    this.areApprox(dEasting2, dEasting4, "E", 0.01);
    this.areApprox(dEasting3, dEasting4, "F", 0.01);
  }
  centroidTest(r, dy) {
    const numPoints = 4;
    const lls = new Array();
    for (let i = 0; i < numPoints; ++i) {
      const a = i * HalfPi;
      const x = r * Math.cos(a);
      const y = r * Math.sin(a);
      lls.push(new LatLngPoint(y + dy, x + 3));
    }
    const centLL = LatLngPoint.centroid(lls);
    const utms = lls.map((ll) => ll.toUTM());
    const centUTM = UTMPoint.centroid(utms);
    const centUTMll = centUTM.toLatLng();
    if (!this.areApprox(centUTMll.lat, centLL.lat, "Latitude", 0.01) || !this.areApprox(centUTMll.lng, centLL.lng, "Longitude", 0.01)) {
      console.log({ centUTMll, centUTM, centLL });
    }
  }
  test_Centroid_InOneZone_InOneHemisphere() {
    this.centroidTest(2.5, 3);
  }
  test_Centroid_InOneZone_SpanningHemispheres() {
    this.centroidTest(2.5, 0);
  }
  test_Centroid_SpanningZones_InOneHemisphere() {
    this.centroidTest(3.5, 4);
  }
  test_Centroid_SpanningZones_SpanningHemispheres() {
    this.centroidTest(3.5, 0);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/tslib/gis/index.ts
var tests4 = [
  UTMPointTests
];

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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/tslib/URLBuilder.ts
var URLBuilderTests = class extends TestCase {
  test_EmptyConstructor() {
    this.doesNotThrow(() => {
      const b = new URLBuilder();
      this.throws(() => b.toString());
    });
  }
  test_EmptyConstructor_SetProtocol() {
    const b = new URLBuilder();
    this.doesNotThrow(() => {
      b.protocol("http:");
      this.throws(() => b.toString());
    });
  }
  test_EmptyConstructor_SetHost() {
    const b = new URLBuilder();
    this.doesNotThrow(() => {
      b.host("www.seanmcbeth.com:8081");
      this.throws(() => b.toString());
    });
  }
  test_EmptyConstructor_SetHostName() {
    const b = new URLBuilder();
    this.doesNotThrow(() => {
      b.hostName("www.seanmcbeth.com");
      this.throws(() => b.toString());
    });
  }
  test_EmptyConstructor_SetProtocolAndHost() {
    const b = new URLBuilder();
    this.areExact(b.protocol("http:").host("www.seanmcbeth.com:8081").toString(), "http://www.seanmcbeth.com:8081/");
  }
  test_EmptyConstructor_SetProtocolAndHostName() {
    const b = new URLBuilder();
    this.areExact(b.protocol("http:").hostName("www.seanmcbeth.com").toString(), "http://www.seanmcbeth.com/");
  }
  test_EmptyConstructor_SetProtocolAndHostNameAndPathName() {
    const b = new URLBuilder();
    this.areExact(b.protocol("http:").hostName("www.seanmcbeth.com").path("images").toString(), "http://www.seanmcbeth.com/images");
  }
  test_EmptyConstructor_SetProtocolAndPathNameAndHostName() {
    const b = new URLBuilder();
    this.areExact(b.protocol("http:").path("images").hostName("www.seanmcbeth.com").toString(), "http://www.seanmcbeth.com/images");
  }
  test_EmptyConstructor_SetHostNameAndProtocolAndPathName() {
    const b = new URLBuilder();
    this.areExact(b.hostName("www.seanmcbeth.com").protocol("http:").path("images").toString(), "http://www.seanmcbeth.com/images");
  }
  test_EmptyConstructor_SetHostNameAndPathNameAndProtocol() {
    const b = new URLBuilder();
    this.areExact(b.hostName("www.seanmcbeth.com").path("images").protocol("http:").toString(), "http://www.seanmcbeth.com/images");
  }
  test_EmptyConstructor_SetPathNameAndProtocolAndHostName() {
    const b = new URLBuilder();
    this.areExact(b.path("images").protocol("http:").hostName("www.seanmcbeth.com").toString(), "http://www.seanmcbeth.com/images");
  }
  test_EmptyConstructor_SetPathNameAndHostNameAndProtocol() {
    const b = new URLBuilder();
    this.areExact(b.path("images").hostName("www.seanmcbeth.com").protocol("http:").toString(), "http://www.seanmcbeth.com/images");
  }
  test_EmptyConstructor_BaseAndPathName() {
    const b = new URLBuilder();
    this.areExact(b.path("").base(new URL("https://www.seanmcbeth.com")).toString(), "https://www.seanmcbeth.com/");
  }
  test_EmptyConstructor_PathNameAndBase() {
    const b = new URLBuilder();
    this.areExact(b.base("https://www.seanmcbeth.com").path("").toString(), "https://www.seanmcbeth.com/");
  }
  test_CantResetBase1() {
    const b = new URLBuilder("https://www.seanmcbeth.com");
    this.throws(() => b.base("https://yahoo.com"));
  }
  test_CantResetBase2() {
    const b = new URLBuilder().base("https://www.seanmcbeth.com").path("");
    this.throws(() => b.base("https://yahoo.com"));
  }
  test_CanResetBaseBeforePathIsSet() {
    const b = new URLBuilder().base("https://www.seanmcbeth.com").base("https://yahoo.com").path("");
    this.areExact(b.toString(), "https://yahoo.com/");
  }
  test_PathPush1() {
    const b = new URLBuilder("https://www.seanmcbeth.com").pathPush("images");
    this.areExact(b.toString(), "https://www.seanmcbeth.com/images");
  }
  test_PathPush2() {
    const b = new URLBuilder("https://www.seanmcbeth.com").pathPush("images").pathPush("archive");
    this.areExact(b.toString(), "https://www.seanmcbeth.com/images/archive");
  }
  test_PathPop() {
    const b = new URLBuilder("https://www.seanmcbeth.com/images/archive").pathPop();
    this.areExact(b.toString(), "https://www.seanmcbeth.com/images");
  }
  test_PathPopPush() {
    const b = new URLBuilder("https://www.seanmcbeth.com/images/archive").pathPop().pathPush("whatever");
    this.areExact(b.toString(), "https://www.seanmcbeth.com/images/whatever");
  }
  test_UndefinedConstructor() {
    this.doesNotThrow(() => new URLBuilder(void 0));
  }
  test_UndefinedUndefinedConstructor() {
    this.doesNotThrow(() => new URLBuilder(void 0, void 0));
  }
  test_UndefinedNullConstructor() {
    this.doesNotThrow(() => new URLBuilder(void 0, null));
  }
  test_NullConstructor() {
    this.throws(() => new URLBuilder(null));
  }
  test_NullUndefinedConstructor() {
    this.throws(() => new URLBuilder(null, void 0));
  }
  test_NullNullConstructor() {
    this.throws(() => new URLBuilder(null, null));
  }
  test_FullURLConstructor() {
    this.doesNotThrow(() => {
      const b = new URLBuilder("https://www.seanmcbeth.com");
      this.areExact(b.toString(), "https://www.seanmcbeth.com/");
    });
  }
  test_RelativeConstructorWithStringBase1() {
    this.doesNotThrow(() => {
      const b = new URLBuilder("image.jpg", "https://www.seanmcbeth.com");
      this.areExact(b.toString(), "https://www.seanmcbeth.com/image.jpg");
    });
  }
  test_RelativeConstructorWithNullBase() {
    this.throws(() => new URLBuilder("image.jpg", null));
  }
  test_RelativeConstructorWithUndefinedBase() {
    this.throws(() => new URLBuilder("image.jpg", void 0));
  }
  test_RelativeConstructorWithStringBase2() {
    this.doesNotThrow(() => {
      const b = new URLBuilder("image.jpg", "https://www.seanmcbeth.com/images/");
      this.areExact(b.toString(), "https://www.seanmcbeth.com/images/image.jpg");
    });
  }
  test_RelativeConstructorWithStringBase3() {
    this.doesNotThrow(() => {
      const b = new URLBuilder("../image.jpg", "https://www.seanmcbeth.com/images/");
      this.areExact(b.toString(), "https://www.seanmcbeth.com/image.jpg");
    });
  }
  test_AbsoluteConstructorWithStringBase1() {
    this.doesNotThrow(() => {
      const b = new URLBuilder("/image.jpg", "https://www.seanmcbeth.com");
      this.areExact(b.toString(), "https://www.seanmcbeth.com/image.jpg");
    });
  }
  test_AbsoluteConstructorWithStringBase2() {
    this.doesNotThrow(() => {
      const b = new URLBuilder("/image.jpg", "https://www.seanmcbeth.com/images");
      this.areExact(b.toString(), "https://www.seanmcbeth.com/image.jpg");
    });
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/tslib/using.ts
function makeIDisposable() {
  return {
    disposed: false,
    dispose() {
      this.disposed = true;
    }
  };
}
function makeIClosable() {
  return {
    closed: false,
    close() {
      this.closed = true;
    }
  };
}
function makeIDestroyable() {
  return {
    destroyed: false,
    destroy() {
      this.destroyed = true;
    }
  };
}
var UsingTests = class extends TestCase {
  test_DisposeIDisposable() {
    const obj = makeIDisposable();
    this.isFalse(obj.disposed, "Before");
    dispose(obj);
    this.isTrue(obj.disposed, "After");
  }
  test_DisposeIClosable() {
    const obj = makeIClosable();
    this.isFalse(obj.closed, "Before");
    dispose(obj);
    this.isTrue(obj.closed, "After");
  }
  test_DisposeIDestroyable() {
    const obj = makeIDestroyable();
    this.isFalse(obj.destroyed, "Before");
    dispose(obj);
    this.isTrue(obj.destroyed, "After");
  }
  test_DisposeNull() {
    this.doesNotThrow(() => dispose(null));
  }
  test_DisposeUndefined() {
    this.doesNotThrow(() => dispose(void 0));
  }
  test_DisposeString() {
    this.doesNotThrow(() => dispose("ASDFXYZ"));
  }
  test_DisposeNumber() {
    this.doesNotThrow(() => dispose(3));
  }
  test_DisposeObject() {
    this.doesNotThrow(() => dispose({}));
  }
  test_DisposeArray() {
    this.doesNotThrow(() => dispose([123, 456]));
  }
  test_UsingIDisposable() {
    const obj = makeIDisposable();
    this.isFalse(obj.disposed, "Before");
    using(obj, (o) => {
      this.areExact(obj, o);
      this.isFalse(obj.disposed, "Inside");
    });
    this.isTrue(obj.disposed, "After");
  }
  test_UsingIClosable() {
    const obj = makeIClosable();
    this.isFalse(obj.closed, "Before");
    using(obj, (o) => {
      this.areExact(obj, o);
      this.isFalse(obj.closed, "Inside");
    });
    this.isTrue(obj.closed, "After");
  }
  test_UsingIDestroyable() {
    const obj = makeIDestroyable();
    this.isFalse(obj.destroyed, "Before");
    using(obj, (o) => {
      this.areExact(obj, o);
      this.isFalse(obj.destroyed, "Inside");
    });
    this.isTrue(obj.destroyed, "After");
  }
  test_UsingNull() {
    this.doesNotThrow(() => using(null, this.isNull.bind(this)));
  }
  test_UsingUndefined() {
    this.doesNotThrow(() => using(void 0, this.isUndefined.bind(this)));
  }
  async test_UsingAsyncIDisposable() {
    const obj = makeIDisposable();
    this.isFalse(obj.disposed, "Before");
    await usingAsync(obj, async (o) => {
      this.areExact(obj, o);
      this.isFalse(obj.disposed, "Inside");
    });
    this.isTrue(obj.disposed, "After");
  }
  async test_UsingAsyncIClosable() {
    const obj = makeIClosable();
    this.isFalse(obj.closed, "Before");
    await usingAsync(obj, async (o) => {
      this.areExact(obj, o);
      this.isFalse(obj.closed, "Inside");
    });
    this.isTrue(obj.closed, "After");
  }
  async test_UsingAsyncIDestroyable() {
    const obj = makeIDestroyable();
    this.isFalse(obj.destroyed, "Before");
    await usingAsync(obj, async (o) => {
      this.areExact(obj, o);
      this.isFalse(obj.destroyed, "Inside");
    });
    this.isTrue(obj.destroyed, "After");
  }
  test_UsingAsyncNull() {
    this.doesNotThrow(() => usingAsync(null, async (obj) => this.isNull(obj)));
  }
  test_UsingAsyncUndefined() {
    this.doesNotThrow(() => usingAsync(void 0, async (obj) => this.isUndefined(obj)));
  }
  test_UsingArrayIDisposable() {
    const arr = [
      makeIDisposable(),
      makeIDisposable(),
      makeIDisposable()
    ];
    arr.forEach((obj) => this.isFalse(obj.disposed, "Before"));
    usingArray(arr, (a) => {
      this.areExact(arr, a);
      arr.forEach((obj) => this.isFalse(obj.disposed, "Inside"));
    });
    arr.forEach((obj) => this.isTrue(obj.disposed, "After"));
  }
  test_UsingArrayIClosable() {
    const arr = [
      makeIClosable(),
      makeIClosable(),
      makeIClosable()
    ];
    arr.forEach((obj) => this.isFalse(obj.closed, "Before"));
    usingArray(arr, (a) => {
      this.areExact(arr, a);
      arr.forEach((obj) => this.isFalse(obj.closed, "Inside"));
    });
    arr.forEach((obj) => this.isTrue(obj.closed, "After"));
  }
  test_UsingArrayIDestroyable() {
    const arr = [
      makeIDestroyable(),
      makeIDestroyable(),
      makeIDestroyable()
    ];
    arr.forEach((obj) => this.isFalse(obj.destroyed, "Before"));
    usingArray(arr, (a) => {
      this.areExact(arr, a);
      arr.forEach((obj) => this.isFalse(obj.destroyed, "Inside"));
    });
    arr.forEach((obj) => this.isTrue(obj.destroyed, "After"));
  }
  test_UsingArrayNull() {
    this.doesNotThrow(() => usingArray(null, this.isNull.bind(this)));
  }
  test_UsingArrayOfNulls() {
    this.doesNotThrow(() => usingArray([null, null, null], (arr) => arr.forEach((obj) => this.isNull(obj))));
  }
  test_UsingArrayUndefined() {
    this.doesNotThrow(() => usingArray(void 0, this.isUndefined.bind(this)));
  }
  test_UsingArrayOfUndefineds() {
    this.doesNotThrow(() => usingArray([void 0, void 0, void 0], (arr) => arr.forEach((obj) => this.isUndefined(obj))));
  }
  async test_UsingArrayAsyncIDisposable() {
    const arr = [
      makeIDisposable(),
      makeIDisposable(),
      makeIDisposable()
    ];
    arr.forEach((obj) => this.isFalse(obj.disposed, "Before"));
    await usingArrayAsync(arr, async (a) => {
      this.areExact(arr, a);
      arr.forEach((obj) => this.isFalse(obj.disposed, "Inside"));
    });
    arr.forEach((obj) => this.isTrue(obj.disposed, "After"));
  }
  async test_UsingArrayAsyncIClosable() {
    const arr = [
      makeIClosable(),
      makeIClosable(),
      makeIClosable()
    ];
    arr.forEach((obj) => this.isFalse(obj.closed, "Before"));
    await usingArrayAsync(arr, async (a) => {
      this.areExact(arr, a);
      arr.forEach((obj) => this.isFalse(obj.closed, "Inside"));
    });
    arr.forEach((obj) => this.isTrue(obj.closed, "After"));
  }
  async test_UsingArrayAsyncIDestroyable() {
    const arr = [
      makeIDestroyable(),
      makeIDestroyable(),
      makeIDestroyable()
    ];
    arr.forEach((obj) => this.isFalse(obj.destroyed, "Before"));
    await usingArrayAsync(arr, async (a) => {
      this.areExact(arr, a);
      arr.forEach((obj) => this.isFalse(obj.destroyed, "Inside"));
    });
    arr.forEach((obj) => this.isTrue(obj.destroyed, "After"));
  }
  test_UsingArrayAsyncNull() {
    this.doesNotThrow(() => usingArrayAsync(null, async (arr) => this.isNull(arr)));
  }
  test_UsingArrayAsyncOfNulls() {
    this.doesNotThrow(() => usingArrayAsync([null, null, null], async (arr) => arr.forEach((obj) => this.isNull(obj))));
  }
  test_UsingArrayAsyncUndefined() {
    this.doesNotThrow(() => usingArrayAsync(void 0, async (arr) => this.isUndefined(arr)));
  }
  test_UsingArrayAsyncOfUndefineds() {
    this.doesNotThrow(() => usingArrayAsync([void 0, void 0, void 0], async (arr) => arr.forEach((obj) => this.isUndefined(obj))));
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/tslib/index.ts
var tests5 = [
  ...tests2,
  ...tests3,
  ...tests4,
  URLBuilderTests,
  UsingTests
];

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/mapInvert.ts
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
var base2Sizes = /* @__PURE__ */ mapInvert(base2Labels);
var base10Sizes = /* @__PURE__ */ mapInvert(base10Labels);
var labels = /* @__PURE__ */ new Map([
  [2, base2Labels],
  [10, base10Labels]
]);
function formatBytes(value, base = 10) {
  const isNegative = value < 0;
  value = Math.abs(value);
  const systemBase = base === 2 ? 1024 : 1e3;
  let size = Math.min(4, Math.floor(Math.log(value) / Math.log(systemBase)));
  let divisor = Math.pow(systemBase, size);
  if (2 * value >= systemBase * divisor && size < 4) {
    size++;
    divisor *= systemBase;
  }
  let label;
  if (size === 0) {
    label = "B";
  } else {
    const levels = labels.get(base);
    label = levels.get(size);
    value /= divisor;
  }
  const isExact = value % 1 === 0;
  const str3 = `${isNegative ? "-" : ""}${value.toFixed(isExact ? 0 : 2)} ${label}`;
  return str3;
}
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/units/fileSizes.ts
var FileSizeTests = class extends TestCase {
  test_FormatBytes1() {
    const value = formatBytes(500, 2);
    this.areExact(value, "500 B");
  }
  test_ToBytes1() {
    const value = toBytes(2, "KiB");
    this.areExact(value, 2048);
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/units/index.ts
var tests6 = [
  FileSizeTests
];

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tests/index.ts
var tests7 = [
  haxTests,
  ...tests6,
  ...tests,
  ...tests5
];

// src/tests/tdd/index.ts
var output = new TestOutputHTML(
  ...tests7
);
elementApply("main", output);
output.run("UTMPointTests");
//# sourceMappingURL=index.js.map
