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
function isObject(obj) {
  return isDefined(obj) && t(obj, "object", Object);
}
function isNullOrUndefined(obj) {
  return obj === null || obj === void 0;
}
function isDefined(obj) {
  return !isNullOrUndefined(obj);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/arrays.ts
function arrayClear(arr) {
  return arr.splice(0);
}
function arrayRemoveAt(arr, idx) {
  return arr.splice(idx, 1)[0];
}
function arrayReplace(arr, ...items) {
  arr.splice(0, arr.length, ...items);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/identity.ts
function identity(item) {
  return item;
}

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
function classList(...values) {
  return new Attr("classList", values, false);
}
function htmlFor(value) {
  return new Attr("htmlFor", value, false, "label", "output");
}
function type(value) {
  if (!isString(value)) {
    value = value.value;
  }
  return new Attr("type", value, false, "button", "input", "command", "embed", "link", "object", "script", "source", "style", "menu");
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
function elementClearChildren(elem) {
  elem = resolveElement(elem);
  while (elem.lastChild) {
    elem.lastChild.remove();
  }
}
function elementSetText(elem, text) {
  elem = resolveElement(elem);
  elementClearChildren(elem);
  elem.append(TextNode(text));
}
function ButtonRaw(...rest) {
  return tag("button", ...rest);
}
function Button(...rest) {
  return ButtonRaw(...rest, type("button"));
}
function Input(...rest) {
  return tag("input", ...rest);
}
function Label(...rest) {
  return tag("label", ...rest);
}
function PreLabeled(id, label, input2) {
  resolveElement(input2).id = id;
  return [
    Label(htmlFor(id), label),
    input2
  ];
}
function Pre(...rest) {
  return tag("pre", ...rest);
}
function InputCheckbox(...rest) {
  return Input(type("checkbox"), ...rest);
}
function InputFile(...rest) {
  return Input(type("file"), ...rest);
}
function TextNode(txt) {
  return document.createTextNode(txt);
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
function onInput(callback, opts) {
  return onEvent("input", callback, opts);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/mediatypes/util.ts
function mediaTypesToAcceptValue(types) {
  return types.flatMap((type2) => type2.extensions.map((ext) => "." + ext)).sort().join(", ");
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/widgets/FileUploadInput.ts
var FileUploadInputEvent = class extends TypedEvent {
  constructor(files) {
    super("input");
    this.files = files;
  }
};
var FileUploadInput = class extends TypedEventBase {
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
    this.file.insertAdjacentElement(
      "afterend",
      this.element = Button(
        classList("btn", `btn-${buttonStyle}`),
        onClick(() => this.show()),
        buttonText
      )
    );
    this.dragTarget = dragTarget || this.element;
    this.file.addEventListener("input", () => select(this.file.files));
    this.setTypeFilters();
    this.enabled = true;
  }
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
        elementApply(
          this.dragTarget,
          onDragOver(this.onDragOver),
          onDragLeave(this.onDragEnd),
          onDragEnd(this.onDragEnd),
          onDrop(this.onDrop)
        );
      }
    }
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

// src/tests/file-input/index.ts
var input = new FileUploadInput(
  "Pick a file, any file",
  "primary",
  InputFile(),
  document.documentElement
);
var disabler = InputCheckbox(onInput(() => input.disabled = disabler.checked));
input.addEventListener("input", (evt) => {
  for (const file of evt.files) {
    elementApply("main", Pre(file.name));
  }
});
elementApply(
  "main",
  input,
  ...PreLabeled(
    "file-disabler",
    Label("Disable picker"),
    disabler
  )
);
//# sourceMappingURL=index.js.map
