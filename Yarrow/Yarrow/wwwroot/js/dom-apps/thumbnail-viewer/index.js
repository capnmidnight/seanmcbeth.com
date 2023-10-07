// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/identity.js
function identity(item) {
  return item;
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
function isObject(obj) {
  return isDefined(obj) && t(obj, "object", Object);
}
function isNullOrUndefined(obj) {
  return obj === null || obj === void 0;
}
function isDefined(obj) {
  return !isNullOrUndefined(obj);
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
function ClassList(...values) {
  values = values.filter(identity);
  return attr("CLASS_LIST", (element) => element.classList.add(...values), false);
}
function ID(value) {
  return attr("id", value, false);
}
function Title_attr(value) {
  return attr("title", value, false);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/css.js
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/arrays.js
function arrayClear(arr) {
  return arr.splice(0);
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
function Div(...rest) {
  return HtmlTag("div", ...rest);
}
function IFrame(...rest) {
  return HtmlTag("iframe", ...rest);
}
function Img(...rest) {
  return HtmlTag("img", ...rest);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/widgets/dist/registerThumbnails.js
function showThumbnail(elem, isPhotosphere) {
  elementSetDisplay(thumbnailView, true, "block");
  elementSetDisplay(thumbnailImage, !isPhotosphere, "block");
  elementSetDisplay(thumbnailIFrame, isPhotosphere, "block");
  const match = elem.src.match(/\/file\/(\d+)$/);
  if (isPhotosphere && match) {
    const id = parseInt(match[1], 10);
    thumbnailIFrame.src = `/Editor/PhotosphereViewer?FileID=${id}`;
  } else {
    thumbnailImage.src = elem.src;
  }
}
function hideThumbnail() {
  thumbnailView.style.display = "none";
}
var existing = /* @__PURE__ */ new WeakSet();
function registerThumbnails() {
  const thumbnails = document.querySelectorAll(".thumbnail");
  for (const thumbnail of thumbnails) {
    if (!existing.has(thumbnail)) {
      thumbnail.addEventListener("click", () => showThumbnail(thumbnail, thumbnail.classList.contains("photosphere")));
      existing.add(thumbnail);
    }
  }
}
var thumbnailViewerID = "33D0371F-B096-473D-AEE3-B17F5392CCEC";
var thumbnailView = document.getElementById(thumbnailViewerID);
if (!thumbnailView) {
  thumbnailView = Div(ID(thumbnailViewerID), ClassList("thumbnail-view"), display("none"), Img(Title_attr("Thumbnail")), IFrame(Title_attr("Preview")));
}
var thumbnailImage = thumbnailView.querySelector("img");
var thumbnailIFrame = thumbnailView.querySelector("iframe");
if (!thumbnailView.parentElement) {
  HtmlRender(document.body, thumbnailView);
  thumbnailView.addEventListener("pointerleave", hideThumbnail);
  thumbnailView.addEventListener("click", hideThumbnail);
}

// src/dom-apps/thumbnail-viewer/index.ts
registerThumbnails();
//# sourceMappingURL=index.js.map
