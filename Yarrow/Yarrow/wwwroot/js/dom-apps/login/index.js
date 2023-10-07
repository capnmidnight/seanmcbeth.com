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
var Application_JsonUTF8 = /* @__PURE__ */ application("json; charset=UTF-8", "json");
var Application_Wasm = /* @__PURE__ */ application("wasm", "wasm");

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
function Height(value) {
  return attr("height", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
}
function Rel(value) {
  return attr("rel", value, false, "a", "area", "link");
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
function rgb(...v) {
  return `rgb(${v.join(", ")})`;
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
function getButton(selector) {
  return getElement(selector);
}
function getInput(selector) {
  return getElement(selector);
}
function getCanvas(selector) {
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
function Canvas(...rest) {
  return HtmlTag("canvas", ...rest);
}
function Img(...rest) {
  return HtmlTag("img", ...rest);
}
function Link(...rest) {
  return HtmlTag("link", ...rest);
}
function Script(...rest) {
  return HtmlTag("script", ...rest);
}
function TextNode(txt) {
  return document.createTextNode(txt);
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/WindowQuitEventer.js
var WindowQuitEventer = class extends TypedEventTarget {
  constructor() {
    super();
    this.event = new TypedEvent("quitting");
    const onWindowClosed = () => this.dispatchEvent(this.event);
    window.addEventListener("beforeunload", onWindowClosed);
    window.addEventListener("unload", onWindowClosed);
    window.addEventListener("pagehide", onWindowClosed);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/events/dist/all.js
function all(...tasks) {
  return Promise.all(tasks);
}

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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/testing/dist/userNumber.js
function getTestNumber() {
  if ("location" in globalThis) {
    const loc = new URL(globalThis.location.href);
    const testNumber = loc.searchParams.get("testUserNumber");
    return testNumber;
  } else {
    return null;
  }
}
function hasUserNumber() {
  const testNumber = getTestNumber();
  return isDefined(testNumber);
}
function getUserNumber() {
  const testNumber = getTestNumber();
  return isDefined(testNumber) ? parseInt(testNumber, 10) : 1;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/threejs/dist/ScreenMode.js
var ScreenMode;
(function(ScreenMode2) {
  ScreenMode2["None"] = "None";
  ScreenMode2["Fullscreen"] = "Fullscreen";
  ScreenMode2["VR"] = "VR";
  ScreenMode2["AR"] = "AR";
  ScreenMode2["Anaglyph"] = "Anaglyph";
  ScreenMode2["FullscreenAnaglyph"] = "FullscreenAnaglyph";
})(ScreenMode || (ScreenMode = {}));

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/math.js
var Pi = Math.PI;
var HalfPi = 0.5 * Pi;
var Tau = 2 * Pi;
var TIME_MAX = 864e13;
var TIME_MIN = -TIME_MAX;
function lerp(a, b, p) {
  return (1 - p) * a + p * b;
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/timers/dist/ITimer.js
var BaseTimerTickEvent = class extends TypedEvent {
  constructor() {
    super("update");
    this.t = 0;
    this.dt = 0;
    this.sdt = 0;
    this.fps = 0;
  }
  set(t2, dt) {
    this.t = t2;
    this.dt = dt;
    this.sdt = lerp(this.sdt, dt, 0.01);
    if (dt > 0) {
      this.fps = 1e3 / dt;
    }
  }
};
var TimerTickEvent = class extends BaseTimerTickEvent {
  constructor() {
    super();
    Object.seal(this);
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/timers/dist/BaseTimer.js
var BaseTimer = class {
  constructor(targetFrameRate) {
    this.timer = null;
    this.lt = -1;
    this.tickHandlers = new Array();
    this._targetFPS = null;
    this.targetFPS = targetFrameRate;
    const tickEvt = new TimerTickEvent();
    let dt = 0;
    this.onTick = (t2) => {
      if (this.lt >= 0) {
        dt = t2 - this.lt;
        tickEvt.set(t2, dt);
        this.tick(tickEvt);
      }
      this.lt = t2;
    };
  }
  get targetFPS() {
    return this._targetFPS;
  }
  set targetFPS(v) {
    this._targetFPS = v;
  }
  addTickHandler(onTick) {
    this.tickHandlers.push(onTick);
  }
  removeTickHandler(onTick) {
    arrayRemove(this.tickHandlers, onTick);
  }
  tick(evt) {
    for (const handler of this.tickHandlers) {
      handler(evt);
    }
  }
  restart() {
    this.stop();
    this.start();
  }
  get isRunning() {
    return this.timer != null;
  }
  stop() {
    this.timer = null;
    this.lt = -1;
  }
  get targetFrameTime() {
    return 1e3 / this.targetFPS;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/timers/dist/SetIntervalTimer.js
var SetIntervalTimer = class extends BaseTimer {
  constructor(targetFrameRate) {
    super(targetFrameRate);
  }
  start() {
    this.timer = setInterval(() => this.onTick(performance.now()), this.targetFrameTime);
  }
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      super.stop();
    }
  }
  get targetFPS() {
    return super.targetFPS;
  }
  set targetFPS(fps) {
    super.targetFPS = fps;
    if (this.isRunning) {
      this.restart();
    }
  }
};

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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/flags.js
function isMacOS() {
  return /^mac/i.test(navigator.platform);
}
function isIOS() {
  return /iP(ad|hone|od)/.test(navigator.platform) || /Macintosh(.*?) FxiOS(.*?)\//.test(navigator.platform) || isMacOS() && "maxTouchPoints" in navigator && navigator.maxTouchPoints > 2;
}
function isMobileVR() {
  return /Mobile VR/.test(navigator.userAgent) || /Pico Neo 3 Link/.test(navigator.userAgent) || isOculusBrowser;
}
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

// node_modules/three/package.json
var version = "0.150.1";

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
  async getSize(fetcher2) {
    try {
      const { contentLength } = await fetcher2.head(this.path).accept(this.type).exec();
      return [this, contentLength || 1];
    } catch (exp) {
      console.warn(exp);
      return [this, 1];
    }
  }
  async fetch(fetcher2, prog) {
    try {
      const result = await this.getResult(fetcher2, prog);
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
  constructor(fetcher2, method, path, useBLOBs = false) {
    this.fetcher = fetcher2;
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
    let version4 = null;
    const D = indexedDB.open(name);
    if (await success(once(D, "success", "error", "blocked"))) {
      const db = D.result;
      version4 = db.version;
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
      version4 = 0;
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
      ++version4;
    }
    const upgrading = new Task();
    const openRequest = isDefined(version4) ? indexedDB.open(name, version4) : indexedDB.open(name);
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

// package.json
var version2 = "3.7.24";

// src/DataLogger.ts
var DataLogger = class {
  constructor(log) {
    this.log = log;
  }
  error(page, operation, exception) {
    console.error(page, operation, exception);
    this.log("error", {
      page,
      operation,
      exception
    });
  }
};

// src/settings.ts
var version3 = isDebug ? stringRandom(10) : version2;
var enableFullResolution = false;
var MULTIPLAYER_HUB_NAME = "/Multiplayer";
var DEMO_PPI = 50;
var DEMO_DIM = 12;
var DEMO_PX = DEMO_PPI * DEMO_DIM;
var menu = {
  images: {
    backButton: "/images/back-button.jpg",
    defaultButton: "/images/back-button.jpg",
    title: "/images/menu-title.jpg",
    logo: {
      back: "/images/main-logo.png"
    }
  },
  font: {
    fontFamily: "Lato",
    fontSize: 20,
    fontWeight: "bold"
  }
};
var defaultFont = {
  fontFamily: "Lato",
  fontSize: 20
};
var emojiFont = {
  fontFamily: "Segoe UI Emoji",
  fontSize: 20
};
async function loadFonts() {
  await all(
    loadFont(defaultFont),
    loadFont(emojiFont),
    loadFont(menu.font)
  );
}
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
    ["zoom", "zoom-info"],
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
      uiImagePaths.add(
        setName,
        iconName.replace(setName + "-", ""),
        `/images/ui/${iconName}.png`
      );
    }
  }
  return uiImagePaths;
}
var JS_EXT = isDebug ? ".js" : ".min.js";
var CSS_EXT = isDebug ? ".css" : ".min.css";
function getAppUrl(ext, name) {
  return `/js/${name}/index${ext}?v=${version3}`;
}
function getScriptUrl(name) {
  return getAppUrl(JS_EXT, name);
}
function getStyleUrl(name) {
  return getAppUrl(CSS_EXT, name);
}
function getAppScriptUrl(name) {
  return getScriptUrl("vr-apps/" + name);
}
function getAppStyleUrl(name) {
  return getStyleUrl("vr-apps/" + name);
}
function getLibScriptUrl(name) {
  return getScriptUrl("libs/" + name);
}
function createDataLogger(fetcher2) {
  let reportID = null;
  let lastTask = Promise.resolve();
  const log = async (key, value) => {
    reportID = await fetcher2.post("/").body({ reportID, key, value }, Application_JsonUTF8).object().then(unwrapResponse);
  };
  return new DataLogger((key, value) => {
    lastTask = lastTask.then(() => log(key, value));
  });
}

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

// src/dom-apps/login/index.ts
var fetcher = createFetcher(false);
var logger = createDataLogger(fetcher);
try {
  let refreshForm = function() {
    const envCreated = isDefined(env);
    const hasUserType = userType !== null && userType.length > 0;
    const isInstructor = userType === "Instructor";
    const isStudent = userType === "Student";
    const meetingID = meetingIDInput.value.toLocaleUpperCase();
    const hasMeetingID = meetingID.length > 0;
    const hasUserName = userNameInput.value.length > 0;
    elementSetDisplay(iOSError, isIOS());
    elementSetDisplay(selectUserTypeForm, !hasUserType);
    elementSetDisplay(loginForm, hasUserType && userType !== "Explore", "grid");
    elementSetDisplay(studentMeetingIDHelpBlock, isStudent, "");
    elementSetDisplay(instructorMeetingIDHelpBlock, isInstructor, "");
    elementSetText(
      joinSessionMessage,
      isInstructor ? "Create Session" : "Join Session"
    );
    const basicStatus = envCreated ? "" : " (loading)";
    buttonSetEnabled(
      exploreButton,
      envCreated,
      "Explore alone" + basicStatus,
      "Explore lesson content without teleconferencing features" + basicStatus
    );
    const connectStatus = envCreated ? hasUserName ? hasMeetingID ? connecting ? "ing..." : "" : " (meeting ID required)" : hasMeetingID ? " (user name required)" : " (user name and meeting ID required)" : " (loading)";
    buttonSetEnabled(
      connectButton,
      envCreated && userType !== "Explore" && hasUserName && hasMeetingID && !connecting,
      "Connect" + connectStatus,
      connectStatus || "Join session"
    );
  }, selectUserType = function(type) {
    return async () => {
      userType = type;
      refreshForm();
      userTypeSelected.resolve();
    };
  }, configureInputs = function() {
    connectButton.addEventListener("click", onConnect);
    if (isDefined(studentButton)) {
      studentButton.addEventListener("click", selectUserType("Student"));
    }
    if (isDefined(instructorButton)) {
      instructorButton.addEventListener("click", selectUserType("Instructor"));
    }
    exploreButton.addEventListener("click", selectUserType("Explore"));
    addTrimmer(userNameInput);
    addTrimmer(meetingIDInput);
    if (userNameInput.value.length === 0) {
      userNameInput.value = localStorage.getItem(LOGIN_USER_NAME_KEY);
    }
    if (isTest) {
      const namePattern = /^(.+?) *\d+$/;
      const match = userNameInput.value.match(namePattern);
      const name = match && match[1] || "Test";
      userNameInput.value = `${name} ${getUserNumber()}`;
      meetingIDInput.value = "TEST";
      selectUserType("Student")();
    }
    userNameInput.addEventListener("input", () => refreshForm());
    meetingIDInput.addEventListener("input", () => refreshForm());
    if (isDefined(studentButton)) {
      studentButton.disabled = false;
    }
    if (isDefined(instructorButton)) {
      instructorButton.disabled = false;
    }
    const loc = new URL(location.href);
    const meetingID = loc.searchParams.get("m");
    if (meetingID) {
      meetingIDInput.value = meetingID.toUpperCase();
    }
  }, addTrimmer = function(control) {
    function trimmer() {
      control.value = control.value.trim().replace(/\s+/g, " ");
    }
    control.addEventListener("blur", trimmer);
    control.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter") {
        trimmer();
      }
    });
  };
  const selectUserTypeForm = getElement("#selectUserTypeForm");
  const loginForm = getElement("#loginForm");
  const studentButton = getButton("#studentButton");
  const instructorButton = getButton("#instructorButton");
  const exploreButton = getButton("#exploreButton");
  const joinSessionMessage = getElement("#joinSessionMessage");
  const studentMeetingIDHelpBlock = getElement("#studentMeetingIDHelpBlock");
  const instructorMeetingIDHelpBlock = getElement("#instructorMeetingIDHelpBlock");
  const appContainer = getElement("#appContainer");
  const heroImage = getElement("#heroImage");
  const scenarioIDInput = getInput("#scenarioID");
  const userNameInput = getInput("#userName");
  const meetingIDInput = getInput("#meetingID");
  const connectButton = getButton("#connectButton");
  const iOSError = getElement("#iOSError");
  const threeJSRevisionMatch = version.match(/\d+\.(\d+)\.\d+/);
  const threeJSRevision = threeJSRevisionMatch[1];
  const isTest = hasUserNumber();
  const userNumber = getUserNumber();
  const LOGIN_USER_NAME_KEY = "login:userName";
  const userTypeSelected = new Task();
  const teleLoaded = new Task();
  const versionChecker = new SetIntervalTimer(0.5);
  const scenarioIDPattern = /\/\d+\/?$/;
  const windowQuitter = new WindowQuitEventer();
  let env = null;
  let yarrow = null;
  let mainMenu = null;
  let userType = null;
  let curVersion = version3;
  let lastVersion = curVersion;
  let connecting = false;
  if (isDebug) {
    Object.assign(window, {
      setVersion: (v) => lastVersion = v
    });
  }
  versionChecker.addTickHandler(checkVersion);
  elementSetDisplay(appContainer, false);
  configureInputs();
  refreshForm();
  loadEverything().catch(logger.error.bind(logger, "Login", "loadEverything"));
  async function loadEverything() {
    curVersion = await getVersion();
    versionChecker.start();
    await loadFonts();
    await fetcher.get(getLibScriptUrl("three")).useCache(!isDebug).module().then(assertSuccess);
    if (THREE.REVISION !== threeJSRevision) {
      console.warn(`After loading Three.js, version was ${THREE.REVISION}, but expected ${threeJSRevision}`);
    }
    const { default: EnvironmentConstructor } = await fetcher.get(getAppScriptUrl("environment")).useCache(!isDebug).module().then(unwrapResponse);
    env = new EnvironmentConstructor({
      canvas: getCanvas("#frontBuffer"),
      fetcher,
      dialogFontFamily: defaultFont.fontFamily,
      getAppUrl: getAppScriptUrl,
      uiImagePaths: getUIImagePaths(),
      buttonFillColor: DLSBlue,
      labelFillColor: BasicLabelColor,
      enableFullResolution,
      DEBUG: isDebug,
      styleSheetPath: getAppStyleUrl("environment"),
      watchModelPath: "/models/watch1.glb"
    });
    if (isDebug) {
      env.apps.cacheBustString = curVersion + "&DEBUG";
    } else {
      env.apps.cacheBustString = curVersion;
    }
    env.apps.addEventListener("apploaded", (evt) => {
      if (evt.appName === "menu") {
        mainMenu = evt.app;
        mainMenu.addEventListener("select", async (evt2) => {
          await env.withFade(async () => {
            mainMenu.hide();
            const req = env.apps.app("yarrow");
            req.param("dataLogger", logger);
            req.param("scenarioID", evt2.scenarioID);
            const progs = progressSplit(env.loadingBar, 2);
            const app = await req.load(progs.shift());
            await app.show(progs.shift());
          });
        });
        mainMenu.addEventListener("lobby", async () => {
          await env.withFade(async () => {
            if (yarrow) {
              yarrow.quit();
            }
            await mainMenu.show(env.loadingBar);
          });
        });
      } else if (evt.appName === "yarrow") {
        yarrow = evt.app;
        yarrow.addEventListener("shown", async () => {
          versionChecker.stop();
          const loc = new URLBuilder(location.href).pathPop(scenarioIDPattern).pathPush(yarrow.scenarioID.toString()).toString();
          history.replaceState(null, null, loc);
        });
        yarrow.addEventListener("quit", async () => {
          versionChecker.start();
          const loc = new URLBuilder(location.href).pathPop(scenarioIDPattern).toString();
          history.replaceState(null, null, loc);
        });
      }
    });
    refreshForm();
    const [envAssetLoad, subAppLoad, teleLoad] = progressSplitWeighted(env.loadingBar, [1, 2, 1]);
    await env.fadeOut();
    await all(
      env.load(envAssetLoad),
      firstLoad(subAppLoad),
      loadTele(teleLoad)
    );
    if (isTest) {
      onConnect();
    }
  }
  async function getVersion() {
    if (isDebug || !navigator.onLine) {
      return lastVersion;
    }
    return await fetcher.get("/vr/version").text().then(unwrapResponse);
  }
  async function checkVersion() {
    try {
      const nextVersion = await getVersion();
      if (nextVersion !== curVersion) {
        location.reload();
      }
    } catch {
    }
  }
  async function firstLoad(subAppLoad) {
    const scenarioID = parseFloat(scenarioIDInput.value);
    const scenarioDirectLoad = Number.isInteger(scenarioID);
    const progs = progressSplit(subAppLoad, scenarioDirectLoad ? 2 : 1);
    const tasks = [
      loadMenu(progs.shift())
    ];
    if (scenarioDirectLoad) {
      tasks.push(loadYarrow(scenarioID, progs.shift()));
    }
    const apps = await Promise.all(tasks);
    const lastApp = apps.pop();
    await lastApp.show();
    await env.fadeIn();
  }
  async function loadYarrow(scenarioID, subAppLoad) {
    return await env.apps.app("yarrow").param("scenarioID", scenarioID).param("dataLogger", logger).load(subAppLoad);
  }
  async function loadMenu(subAppLoad) {
    return await env.apps.app("menu").param("config", menu).load(subAppLoad);
  }
  async function loadTele(teleLoad) {
    try {
      await userTypeSelected;
      env.devicesDialog.showWebcams = userType !== "Explore";
      if (userType === "Explore") {
        onConnect();
        teleLoad.end("skip");
      } else {
        userNameInput.focus();
        const tele = await env.apps.app("tele").param("nameTagFont", defaultFont).param("hub", MULTIPLAYER_HUB_NAME).param("dataLogger", logger).load(teleLoad);
        await tele.show();
      }
      teleLoaded.resolve();
    } catch (err) {
      teleLoaded.reject(err);
    }
  }
  async function onConnect() {
    const onQuit = () => logger.log("quitting");
    env.addEventListener("quitting", onQuit);
    windowQuitter.addEventListener("quitting", onQuit);
    connecting = true;
    refreshForm();
    await env.audio.ready;
    await teleLoaded;
    const hasTele = env.apps.isLoaded("tele");
    env.devicesDialog.showMicrophones ||= hasTele;
    if (env.devicesDialog.showMicrophones || env.devicesDialog.showWebcams) {
      if (isTest && userNumber !== 1) {
        env.microphones.gain.setValueAtTime(0, 0);
      }
      await env.devicesDialog.showDialog();
    }
    elementSetDisplay(heroImage, false);
    elementSetDisplay(appContainer, true);
    if (hasTele) {
      const userName = userNameInput.value;
      const meetingID = meetingIDInput.value.toLocaleUpperCase();
      localStorage.setItem(LOGIN_USER_NAME_KEY, userName);
      const loc = new URLBuilder(location.href).query("m", meetingID).toString();
      history.replaceState(null, null, loc);
      const tele = env.apps.get("tele");
      await tele.setConferenceInfo(userType, userName, meetingID);
      connecting = false;
      refreshForm();
    } else {
      logger.log("explore");
    }
    if (isMobileVR()) {
      env.screenControl.start(ScreenMode.VR);
    } else {
      env.renderer.domElement.focus();
    }
    if (env.speech) {
      env.speech.speakerCulture = "en-US";
      if (!isTest || userNumber === 1) {
        env.speech.start();
      }
    }
  }
} catch (exp) {
  logger.error("Login", "Top level", exp);
}
//# sourceMappingURL=index.js.map
