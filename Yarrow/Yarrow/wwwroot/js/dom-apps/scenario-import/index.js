// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/documentReady.js
var documentReady = document.readyState === "complete" ? Promise.resolve("already") : new Promise((resolve) => {
  const onReadyStateChanged = () => {
    if (document.readyState === "complete") {
      document.removeEventListener("readystatechange", onReadyStateChanged);
      resolve("had to wait for it");
    }
  };
  document.addEventListener("readystatechange", onReadyStateChanged, false);
});

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
function arrayReplace(arr, ...items) {
  arr.splice(0, arr.length, ...items);
}

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
function mediaTypesToAcceptValue(types) {
  return types.flatMap((type) => type.extensions.map((ext) => "." + ext)).sort().join(", ");
}
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
var Application_X_Zip_Compressed = /* @__PURE__ */ application("x-zip-compressed", "zip");
var Application_Zip = /* @__PURE__ */ application("zip", "zip");

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/dist/text.js
var text = /* @__PURE__ */ specialize("text");
var Text_Css = /* @__PURE__ */ text("css", "css");
var Text_Plain = /* @__PURE__ */ text("plain", "txt", "text", "conf", "def", "list", "log", "in");
var Text_Xml = /* @__PURE__ */ text("xml");

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/strings/stringRandom.js
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
function isAttr(obj) {
  return obj instanceof HtmlAttr;
}
function AriaValueMax(value) {
  return attr("ariaValueMax", value, false);
}
function AriaValueMin(value) {
  return attr("ariaValueMin", value, false);
}
function AriaValueNow(value) {
  return attr("ariaValueNow", value, false);
}
function ClassList(...values) {
  values = values.filter(identity);
  return attr("CLASS_LIST", (element) => element.classList.add(...values), false);
}
function CustomData(name, value) {
  return attr("data-" + name.toLowerCase(), value, true);
}
function Height(value) {
  return attr("height", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}
function Rel(value) {
  return attr("rel", value, false, "a", "area", "link");
}
function Role(value) {
  return attr("role", value, false);
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
function display(v) {
  return new CssElementStyleProp("display", v);
}
function width(v) {
  return new CssElementStyleProp("width", v);
}

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
function elementClearChildren(elem) {
  elem = resolveElement(elem);
  while (elem.lastChild) {
    elem.lastChild.remove();
  }
}
function elementSetText(elem, text2) {
  elem = resolveElement(elem);
  elementClearChildren(elem);
  elem.append(TextNode(text2));
}
function elementSetTitle(elem, text2) {
  elem = resolveElement(elem);
  elem.title = text2;
}
function buttonSetEnabled(button, styleOrEnabled, enabledOrlabel, labelOrTitle, title) {
  button = resolveElement(button);
  let style = null;
  let enabled = null;
  let label = null;
  if (isBoolean(styleOrEnabled)) {
    enabled = styleOrEnabled;
    label = enabledOrlabel;
    title = labelOrTitle;
  } else {
    style = styleOrEnabled;
    enabled = enabledOrlabel;
    label = labelOrTitle;
  }
  button.disabled = !enabled;
  if (label) {
    elementSetText(button, label);
  }
  if (title) {
    elementSetTitle(button, title);
  }
  if (style) {
    button.classList.toggle("btn-" + style, enabled);
    button.classList.toggle("btn-outline-" + style, !enabled);
  }
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
function ButtonSecondary(...rest) {
  return Button(...rest, ClassList("btn", "btn-secondary"));
}
function Canvas(...rest) {
  return HtmlTag("canvas", ...rest);
}
function Div(...rest) {
  return HtmlTag("div", ...rest);
}
function H1(...rest) {
  return HtmlTag("h1", ...rest);
}
function H2(...rest) {
  return HtmlTag("h2", ...rest);
}
function Img(...rest) {
  return HtmlTag("img", ...rest);
}
function Link(...rest) {
  return HtmlTag("link", ...rest);
}
function P(...rest) {
  return HtmlTag("p", ...rest);
}
function Script(...rest) {
  return HtmlTag("script", ...rest);
}
function TextNode(txt) {
  return document.createTextNode(txt);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/fetcher/dist/assertSuccess.js
function assertSuccess(response) {
  if (response.status >= 400) {
    throw new Error("Resource could not be retrieved: " + response.requestPath);
  }
  return response;
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/widgets/dist/BootstrapProgressBar.js
var BootstrapProgressBarElement = class {
  constructor(outerClassName = "controls progress") {
    const inner = Div(ClassList("progress-bar"), Role("progressbar"), AriaValueNow(0), AriaValueMin(0), AriaValueMax(1), width(0));
    this.element = Div(ClassList(outerClassName), inner);
    this.progress = new BootstrapProgressBarCallback(inner);
  }
  clear() {
    this.progress.clear();
  }
  report(soFar, total, message, est) {
    this.progress.report(soFar, total, message, est);
  }
  attach(prog) {
    this.progress.attach(prog);
  }
  start(msg) {
    this.progress.start(msg);
  }
  end(msg) {
    this.progress.end(msg);
  }
};
var BootstrapProgressBarCallback = class extends BaseProgress {
  constructor(progressBar, showMessage = true) {
    super();
    this.progressBar = progressBar;
    this.showMessage = showMessage;
  }
  report(soFar, total, message, estimate) {
    super.report(soFar, total, message, estimate);
    if (soFar === 0) {
      this.progressBar.style.width = "0";
      this.progressBar.setAttribute("aria-valuenow", "0");
    } else {
      const percent = (100 * this.p).toFixed(1);
      this.progressBar.style.width = `${percent}%`;
      this.progressBar.setAttribute("aria-valuenow", percent);
    }
    if (this.showMessage) {
      elementSetText(this.progressBar, message || "");
    }
  }
};
function BootstrapProgressBar(outerClassName = "controls progress") {
  return new BootstrapProgressBarElement(outerClassName);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/widgets/dist/DialogBox/index.js
var DialogBox = class {
  constructor(title) {
    this.task = new Task(false);
    this.element = Div(ClassList("dialog"), display("none"), CustomData("dialogname", title), this.container = Div(ClassList("dialog-container"), this.titleElement = H1(ClassList("title-bar"), title), this.contentArea = Div(ClassList("dialog-content")), Div(ClassList("dialog-controls"), this.confirmButton = ButtonPrimary("Confirm", ClassList("confirm-button")), this.cancelButton = ButtonSecondary("Cancel", ClassList("cancel-button")))));
    this.confirmButton.addEventListener("click", this.task.resolver(true));
    this.cancelButton.addEventListener("click", this.task.resolver(false));
    HtmlRender(document.body, this);
  }
  get title() {
    return this._title;
  }
  set title(v) {
    elementSetText(this.titleElement, this._title = v);
  }
  async onShowing() {
  }
  onShown() {
  }
  async onConfirm() {
  }
  onCancel() {
  }
  async onClosing() {
  }
  onClosed() {
  }
  show(v) {
    elementSetDisplay(this, v);
  }
  get isOpen() {
    return elementIsDisplayed(this);
  }
  hide() {
    this.show(false);
  }
  async toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.showDialog();
    }
  }
  async showDialog() {
    await this.onShowing();
    this.show(true);
    this.onShown();
    this.task.restart();
    if (await this.task) {
      await this.onConfirm();
    } else {
      this.onCancel();
    }
    await this.onClosing();
    this.show(false);
    this.onClosed();
    return this.task.result;
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
function onClick(callback, opts) {
  return onEvent("click", callback, opts);
}
function onDragEnd(callback, opts) {
  return onEvent("dragend", callback, opts);
}
function onDragLeave(callback, opts) {
  return onEvent("dragleave", callback, opts);
}
function onDragOver(callback, opts) {
  return onEvent("dragover", callback, opts);
}
function onDrop(callback, opts) {
  return onEvent("drop", callback, opts);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/widgets/dist/FileUploadInput.js
var FileUploadInputEvent = class extends TypedEvent {
  constructor(files) {
    super("input");
    this.files = files;
  }
};
var FileUploadInput = class extends TypedEventTarget {
  get dragTarget() {
    return this._dragTarget;
  }
  set dragTarget(v) {
    if (v !== this.dragTarget) {
      if (this.dragTarget) {
        this.dragTarget.removeEventListener("dragover", this.onDragOver);
        this.dragTarget.removeEventListener("dragend", this.onDragEnd);
        this.dragTarget.removeEventListener("dragleave", this.onDragEnd);
        this.dragTarget.removeEventListener("drop", this.onDrop);
      }
      this._dragTarget = v;
      if (this.dragTarget) {
        HtmlRender(this.dragTarget, onDragOver(this.onDragOver), onDragLeave(this.onDragEnd), onDragEnd(this.onDragEnd), onDrop(this.onDrop));
      }
    }
  }
  constructor(buttonText, buttonStyle, file, dragTarget = null) {
    super();
    this.file = file;
    this.typeFilters = new Array();
    this.element = null;
    this._dragTarget = null;
    const getMatchingFiles = (fileList) => Array.from(fileList).filter((f) => this.typeFilters.length === 0 || this.typeFilters.filter((t2) => t2.matches(f.type)).length > 0);
    const getMatchingItems = (itemList) => Array.from(itemList).filter((f) => f.kind == "file" && (this.typeFilters.length === 0 || this.typeFilters.filter((t2) => t2.matches(f.type)).length > 0));
    this.onDragOver = (evt) => {
      if (this.enabled) {
        const items = getMatchingItems(evt.dataTransfer.items);
        if (items.length > 0) {
          elementSetText(this.element, "Drop file...");
        } else {
          elementSetText(this.element, "No files matching expected type(s)");
        }
      }
      evt.preventDefault();
    };
    this.onDragEnd = (evt) => {
      if (this.enabled) {
        elementSetText(this.element, buttonText);
      }
      evt.preventDefault();
    };
    this.onDrop = (evt) => {
      if (this.enabled) {
        select(evt.dataTransfer.files);
      }
      this.onDragEnd(evt);
    };
    const select = (fileList) => {
      const files = getMatchingFiles(fileList);
      if (files.length > 0) {
        this.dispatchEvent(new FileUploadInputEvent(files));
      }
    };
    this.file.style.display = "none";
    this.file.insertAdjacentElement("afterend", this.element = Button(ClassList("btn", `btn-${buttonStyle}`), onClick(() => this.show()), buttonText));
    this.dragTarget = dragTarget || this.element;
    this.file.addEventListener("input", () => select(this.file.files));
    this.setTypeFilters();
    this.enabled = true;
  }
  show() {
    if (this.file.showPicker) {
      this.file.showPicker();
    } else {
      this.file.click();
    }
  }
  setTypeFilters(...types) {
    arrayReplace(this.typeFilters, ...types);
    this.file.accept = mediaTypesToAcceptValue(types);
  }
  isExpectedType(contentType) {
    if (isNullOrUndefined(contentType)) {
      return false;
    }
    if (this.typeFilters.length === 0) {
      return true;
    }
    return this.typeFilters.map((t2) => t2.matches(contentType)).reduce((a, b) => a || b, false);
  }
  get accept() {
    return this.file.accept;
  }
  get enabled() {
    return !this.file.disabled;
  }
  set enabled(v) {
    this.file.disabled = !v;
    this.element.disabled = !v;
  }
  get disabled() {
    return !this.enabled;
  }
  set disabled(v) {
    this.enabled = !v;
  }
  get files() {
    return this.file.files;
  }
  clear() {
    this.file.value = null;
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
function createOffscreenCanvas(width2, height) {
  return new OffscreenCanvas(width2, height);
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

// src/isDebug.ts
var url = /* @__PURE__ */ new URL(globalThis.location.href);
var isDebug = !url.searchParams.has("RELEASE");

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/singleton.js
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

// src/dom-apps/scenario-import/index.ts
var LoadingDialog = class extends DialogBox {
  statusMessage;
  progressBar;
  constructor() {
    super("Scenario Importing...");
    HtmlRender(
      this.contentArea,
      H2("Please wait"),
      P("Importing scenarios takes a significant amount of time. Please do not close the window before the import completes."),
      this.statusMessage = P("Uploading..."),
      this.progressBar = BootstrapProgressBar()
    );
    this.cancelButton.remove();
    buttonSetEnabled(this.confirmButton, false, "OK", "Close dialog");
  }
  success() {
    elementSetText(this.statusMessage, "Upload completed successfully!");
    buttonSetEnabled(this.confirmButton, true, "OK", "Close dialog");
  }
  fail(err) {
    console.error(err);
    elementSetText(this.statusMessage, "Upload failed!");
    buttonSetEnabled(this.confirmButton, true, "OK", "Close dialog");
  }
};
(async function() {
  await documentReady;
  const fetcher = createFetcher(false);
  const dialog = new LoadingDialog();
  const fileUpload = new FileUploadInput("Import", "danger", getInput("#scenarioPackageFile"));
  fileUpload.setTypeFilters(Application_X_Zip_Compressed, Application_Zip);
  fileUpload.addEventListener("input", async (evt) => {
    dialog.progressBar.start("Uploading...");
    fileUpload.enabled = false;
    const dialogTask = dialog.showDialog();
    try {
      const form = new FormData();
      form.set("FormFile", evt.files[0]);
      const response = await fetcher.post("/editor/scenarios/").query("handler", "Import").body(form).progress(dialog.progressBar).exec();
      assertSuccess(response);
      dialog.success();
      globalThis.location.href = response.responsePath;
    } catch (exp) {
      dialog.fail(exp);
    } finally {
      await dialogTask;
      location.reload();
    }
  });
})();
//# sourceMappingURL=index.js.map
