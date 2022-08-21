// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/identity.ts
function alwaysTrue() {
  return true;
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
  const realTest = test || alwaysTrue;
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayInsertAt.ts
function arrayInsertAt(arr, item, idx) {
  arr.splice(idx, 0, item);
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
      arraySortedInsert(this._forward, child, (n) => keySelector(n.value));
      arraySortedInsert(child._reverse, this, (n) => keySelector(n.value));
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/Exception.ts
var Exception = class extends Error {
  constructor(message, innerError = null) {
    super(message);
    this.innerError = innerError;
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayClear.ts
function arrayClear(arr) {
  return arr.splice(0);
}

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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/audio/nodes.ts
var hasAudioContext = "AudioContext" in globalThis;
var hasAudioListener = hasAudioContext && "AudioListener" in globalThis;
var hasOldAudioListener = hasAudioListener && "setPosition" in AudioListener.prototype;
var hasNewAudioListener = hasAudioListener && "positionX" in AudioListener.prototype;
var canCaptureStream = /* @__PURE__ */ isFunction(HTMLMediaElement.prototype.captureStream) || isFunction(HTMLMediaElement.prototype.mozCaptureStream);
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
function margin(...v) {
  return new CssProp("margin", v.join(" "));
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
function overflow(...v) {
  return new CssProp("overflow", v.join(" "));
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
    sheet.insertRule(
      `${this.selector} {${style}}`,
      sheet.cssRules.length
    );
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
  return elem.element instanceof HTMLElement;
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayRandom.ts
function arrayRandom(arr, defaultValue) {
  const offset = defaultValue != null ? 1 : 0, idx = Math.floor(Math.random() * (arr.length + offset)) - offset;
  if (idx < 0) {
    return defaultValue;
  } else {
    return arr[idx];
  }
}

// src/yabs-app/index.ts
document.title = "No More Jabber Yabs: The Game";
Style(
  rule(
    "html, body, .cloud, .cloud-bit, .frowny, .shadow, .boop, .beam, .subBeam, .endMessage, #scoreBox",
    position("absolute")
  ),
  rule(
    "html, body",
    height("100%"),
    width("100%"),
    padding(0),
    margin(0),
    border(0),
    overflow("hidden")
  ),
  rule(
    "body",
    fontFamily("sans-serif"),
    backgroundColor("hsl(200, 50%, 75%)"),
    backgroundImage("linear-gradient(hsl(200, 50%, 50%), hsl(200, 20%, 75%) 75%, hsl(100, 75%, 50%) 75%, hsl(100, 100%, 20%))")
  ),
  rule(
    "#scoreBox, .endMessage, .frowny, #instructions, #starter",
    fontSize("24pt")
  ),
  rule(
    "#scoreBox",
    display("none"),
    color("white"),
    top("5em"),
    left(0),
    padding("1em")
  ),
  rule(
    ".endMessage",
    display("none"),
    padding("1em"),
    top(0),
    zIndex(9001),
    pointerEvents("none"),
    color("white")
  ),
  rule(
    ".cloud-bit",
    backgroundColor("white"),
    width("100px"),
    height("50px"),
    borderBottomRightRadius("25px"),
    borderBottomLeftRadius("50px"),
    borderTopRightRadius("12.5px"),
    borderTopLeftRadius("6.25px")
  ),
  rule(
    ".frowny",
    fontFamily("fixedsys, monospace"),
    padding("5px"),
    border("solid 2px black"),
    borderRadius("10px"),
    transform("rotate(90deg)"),
    width("50px"),
    height("50px"),
    overflow("hidden")
  ),
  rule(
    ".shadow",
    width("45px"),
    height("10px"),
    borderRadius("5px"),
    backgroundImage("radial-gradient(black, transparent)"),
    backgroundColor("grey")
  ),
  rule(
    ".boop",
    display("none"),
    color("white"),
    textTransform("uppercase"),
    fontFamily("sans-serif"),
    fontWeight("bold"),
    fontSize("10pt"),
    zIndex(9001)
  ),
  rule(
    ".beam, .subBeam",
    display("none"),
    backgroundColor("red"),
    boxShadow("0 0 25px red"),
    left("0")
  ),
  rule(
    ".beam",
    top("0"),
    width("50px"),
    height("50px"),
    borderRadius("50%")
  ),
  rule(
    ".subBeam",
    top("50%"),
    height("2000px")
  ),
  rule(
    "#instructions, #starter",
    position("relative"),
    display("none"),
    fontWeight("bold"),
    marginLeft("auto"),
    marginRight("auto"),
    marginTop("3em"),
    width("20em"),
    zIndex(9001)
  )
);
function PointDisplay() {
  return Span(className("pointDisplay"), 0);
}
elementApply(
  document.body,
  Button(
    id("starter"),
    "Start",
    onClick(() => audio.resume())
  ),
  Div(id("instructions"), "Go ahead, click and hold the mouse"),
  Div(id("scoreBox"), "GET EM: ", PointDisplay()),
  Div(
    id("message0"),
    className("endMessage"),
    P("You have killed everyone. You did it. Just you. Noone else."),
    P("And why have you done this? Because you were ordered to? The pursuit of points?"),
    P("You got your points. All ", PointDisplay(), " of them. What will you do with them? There's noone left. And it's not like they took them as currency, anyway."),
    P("For no reason whatsoever, you have committed genocide against another race of people. Congratulations."),
    P("Hitler.")
  ),
  Div(
    id("message1"),
    className("endMessage"),
    P("You have killed almost everyone. Their bodies are strewn about on the ground they once called their home."),
    P("There is but one person left. Did you spare them out of mercy? Or have you left them, devoid of personal contact, alone, surrounded by the burned and rotting bodies of their former loved ones, to serve as witness to your terrible deeds?"),
    P("And why have you done this? Because you were ordered to? The pursuit of points?"),
    P("You got your points. All ", PointDisplay(), "  of them. What will you do with them? There's noone left. And it's not like they took them as currency, anyway."),
    P("You are sick.")
  ),
  Div(
    id("message2"),
    className("endMessage"),
    P("You have killed almost everyone. Their bodies are strewn about on the ground they once called their home."),
    P("There are only two people left. Did you spare them out of mercy? Or have you left them, surrounded by the burned and rotting bodies of their former loved ones, to repopulate their world together, to serve as witness to your terrible deeds to future generations?"),
    P("And why have you done this? Because you were ordered to? The pursuit of points?"),
    P("You got your points. All ", PointDisplay(), "  of them. What will you do with them? There's noone left. And it's not like they took them as currency, anyway."),
    P("I...I don't understand you.")
  ),
  Div(
    id("messageN"),
    className("endMessage"),
    styles(color("black")),
    P('"Hi there!"'),
    P("You blink. Did someone speak?"),
    P('"Down here!"'),
    P("It's the people below."),
    P('"We noticed you up there. What are you doing?"'),
    P("You reply, haltingly, that you do not know."),
    P('"Oh, well, okay. Cool beans. Later!"')
  )
);
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
function piano(n) {
  return 440 * Math.pow(base, n - 49);
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
    if (nt >= randomInt(0, 4)) {
      nt = Math.floor(nt);
      len /= 2;
    }
    if (score > 0) {
      const n = 25 - Math.floor(nt * 4) + randomInt(-1, 2) * 3;
      play(n, 0.04, len);
      play(n + 3, 0.04, len);
      play(n + 7, 0.04, len);
    } else {
      const n = 40 + Math.floor(nt * 3) + randomInt(-1, 2) * 4;
      play(n, 0.04, 0.05);
      play(n + randomInt(3, 5), 0.04, 0.05);
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
    this.element = Div(
      className("frowny"),
      onMouseOut(this.jump.bind(this, "boop")),
      onTouchStart(this.jump.bind(this, "boop")),
      styles(
        backgroundColor(arrayRandom(skins)),
        zIndex(this.z)
      )
    );
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
      play(
        (score > 0 ? 10 : 20) + 3 * randomInt(0, 5),
        0.125,
        0.05
      );
      shake();
    }
  }
};
var Cloud = class {
  constructor() {
    this.element = document.createElement("div");
    this.element.className = "cloud";
    const n = randomInt(4, 7);
    for (let i = 0; i < n; ++i) {
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
      const n = Math.floor(this.t / 10) + 70;
      for (let i = 70; i < n; ++i) {
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
(async function() {
  await audioReady(audio);
  starter.style.display = "none";
  inst.style.display = "block";
  requestAnimationFrame(animate);
  setTimeout(function() {
    fading = true;
  }, 5e3);
})();
var goodEndingTimer = setTimeout(function() {
  messages[messages.length - 1].style.display = "block";
  beam.disable();
}, 15e3);
//# sourceMappingURL=index.js.map
