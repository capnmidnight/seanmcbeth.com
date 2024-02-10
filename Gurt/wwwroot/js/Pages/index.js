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
function isNumber(obj) {
  return t(obj, "number", Number);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/src/attrs.ts
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
  tags;
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
function ID(value) {
  return attr("id", value, false);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/arrays.js
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/src/tags.ts
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
function Canvas(...rest) {
  return HtmlTag("canvas", ...rest);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/src/arrays.ts
function arrayRandom(arr, defaultValue) {
  const offset = defaultValue != null ? 1 : 0, idx = Math.floor(Math.random() * (arr.length + offset)) - offset;
  if (idx < 0) {
    return defaultValue;
  } else {
    return arr[idx];
  }
}

// node_modules/gl-matrix/dist/esm/common.js
var EPSILON = 1e-6;

// node_modules/gl-matrix/dist/esm/vec2.js
var Vec2 = class _Vec2 extends Float32Array {
  /**
   * The number of bytes in a {@link Vec2}.
   */
  static BYTE_LENGTH = 2 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Vec2}.
   */
  constructor(...values) {
    switch (values.length) {
      case 2: {
        const v = values[0];
        if (typeof v === "number") {
          super([v, values[1]]);
        } else {
          super(v, values[1], 2);
        }
        break;
      }
      case 1: {
        const v = values[0];
        if (typeof v === "number") {
          super([v, v]);
        } else {
          super(v, 0, 2);
        }
        break;
      }
      default:
        super(2);
        break;
    }
  }
  //============
  // Attributes
  //============
  // Getters and setters to make component access read better.
  // These are likely to be a little bit slower than direct array access.
  /**
   * The x component of the vector. Equivalent to `this[0];`
   * @category Vector components
   */
  get x() {
    return this[0];
  }
  set x(value) {
    this[0] = value;
  }
  /**
   * The y component of the vector. Equivalent to `this[1];`
   * @category Vector components
   */
  get y() {
    return this[1];
  }
  set y(value) {
    this[1] = value;
  }
  // Alternate set of getters and setters in case this is being used to define
  // a color.
  /**
   * The r component of the vector. Equivalent to `this[0];`
   * @category Color components
   */
  get r() {
    return this[0];
  }
  set r(value) {
    this[0] = value;
  }
  /**
   * The g component of the vector. Equivalent to `this[1];`
   * @category Color components
   */
  get g() {
    return this[1];
  }
  set g(value) {
    this[1] = value;
  }
  /**
   * The magnitude (length) of this.
   * Equivalent to `Vec2.magnitude(this);`
   *
   * Magnitude is used because the `length` attribute is already defined by
   * `Float32Array` to mean the number of elements in the array.
   */
  get magnitude() {
    return Math.hypot(this[0], this[1]);
  }
  /**
   * Alias for {@link Vec2.magnitude}
   */
  get mag() {
    return this.magnitude;
  }
  /**
   * The squared magnitude (length) of `this`.
   * Equivalent to `Vec2.squaredMagnitude(this);`
   */
  get squaredMagnitude() {
    const x = this[0];
    const y = this[1];
    return x * x + y * y;
  }
  /**
   * Alias for {@link Vec2.squaredMagnitude}
   */
  get sqrMag() {
    return this.squaredMagnitude;
  }
  /**
   * A string representation of `this`
   * Equivalent to `Vec2.str(this);`
   */
  get str() {
    return _Vec2.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Vec2} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(a) {
    this.set(a);
    return this;
  }
  // Instead of zero(), use a.fill(0) for instances;
  /**
   * Adds a {@link Vec2} to `this`.
   * Equivalent to `Vec2.add(this, this, b);`
   *
   * @param b - The vector to add to `this`
   * @returns `this`
   */
  add(b) {
    this[0] += b[0];
    this[1] += b[1];
    return this;
  }
  /**
   * Subtracts a {@link Vec2} from `this`.
   * Equivalent to `Vec2.subtract(this, this, b);`
   *
   * @param b - The vector to subtract from `this`
   * @returns `this`
   */
  subtract(b) {
    this[0] -= b[0];
    this[1] -= b[1];
    return this;
  }
  /**
   * Alias for {@link Vec2.subtract}
   */
  sub(b) {
    return this;
  }
  /**
   * Multiplies `this` by a {@link Vec2}.
   * Equivalent to `Vec2.multiply(this, this, b);`
   *
   * @param b - The vector to multiply `this` by
   * @returns `this`
   */
  multiply(b) {
    this[0] *= b[0];
    this[1] *= b[1];
    return this;
  }
  /**
   * Alias for {@link Vec2.multiply}
   */
  mul(b) {
    return this;
  }
  /**
   * Divides `this` by a {@link Vec2}.
   * Equivalent to `Vec2.divide(this, this, b);`
   *
   * @param b - The vector to divide `this` by
   * @returns {Vec2} `this`
   */
  divide(b) {
    this[0] /= b[0];
    this[1] /= b[1];
    return this;
  }
  /**
   * Alias for {@link Vec2.divide}
   */
  div(b) {
    return this;
  }
  /**
   * Scales `this` by a scalar number.
   * Equivalent to `Vec2.scale(this, this, b);`
   *
   * @param b - Amount to scale `this` by
   * @returns `this`
   */
  scale(b) {
    this[0] *= b;
    this[1] *= b;
    return this;
  }
  /**
   * Calculates `this` scaled by a scalar value then adds the result to `this`.
   * Equivalent to `Vec2.scaleAndAdd(this, this, b, scale);`
   *
   * @param b - The vector to add to `this`
   * @param scale - The amount to scale `b` by before adding
   * @returns `this`
   */
  scaleAndAdd(b, scale) {
    this[0] += b[0] * scale;
    this[1] += b[1] * scale;
    return this;
  }
  /**
   * Calculates the euclidian distance between another {@link Vec2} and `this`.
   * Equivalent to `Vec2.distance(this, b);`
   *
   * @param b - The vector to calculate the distance to
   * @returns Distance between `this` and `b`
   */
  distance(b) {
    return _Vec2.distance(this, b);
  }
  /**
   * Alias for {@link Vec2.distance}
   */
  dist(b) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between another {@link Vec2} and `this`.
   * Equivalent to `Vec2.squaredDistance(this, b);`
   *
   * @param b The vector to calculate the squared distance to
   * @returns Squared distance between `this` and `b`
   */
  squaredDistance(b) {
    return _Vec2.squaredDistance(this, b);
  }
  /**
   * Alias for {@link Vec2.squaredDistance}
   */
  sqrDist(b) {
    return 0;
  }
  /**
   * Negates the components of `this`.
   * Equivalent to `Vec2.negate(this, this);`
   *
   * @returns `this`
   */
  negate() {
    this[0] *= -1;
    this[1] *= -1;
    return this;
  }
  /**
   * Inverts the components of `this`.
   * Equivalent to `Vec2.inverse(this, this);`
   *
   * @returns `this`
   */
  invert() {
    this[0] = 1 / this[0];
    this[1] = 1 / this[1];
    return this;
  }
  /**
   * Calculates the dot product of this and another {@link Vec2}.
   * Equivalent to `Vec2.dot(this, b);`
   *
   * @param b - The second operand
   * @returns Dot product of `this` and `b`
   */
  dot(b) {
    return this[0] * b[0] + this[1] * b[1];
  }
  /**
   * Normalize `this`.
   * Equivalent to `Vec2.normalize(this, this);`
   *
   * @returns `this`
   */
  normalize() {
    return _Vec2.normalize(this, this);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, empty {@link Vec2}
   * @category Static
   *
   * @returns A new 2D vector
   */
  static create() {
    return new _Vec2();
  }
  /**
   * Creates a new {@link Vec2} initialized with values from an existing vector
   * @category Static
   *
   * @param a - Vector to clone
   * @returns A new 2D vector
   */
  static clone(a) {
    return new _Vec2(a);
  }
  /**
   * Creates a new {@link Vec2} initialized with the given values
   * @category Static
   *
   * @param x - X component
   * @param y - Y component
   * @returns A new 2D vector
   */
  static fromValues(x, y) {
    return new _Vec2(x, y);
  }
  /**
   * Copy the values from one {@link Vec2} to another
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - The source vector
   * @returns `out`
   */
  static copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
  }
  /**
   * Set the components of a {@link Vec2} to the given values
   * @category Static
   *
   * @param out - The receiving vector
   * @param x - X component
   * @param y - Y component
   * @returns `out`
   */
  static set(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
  }
  /**
   * Adds two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
  }
  /**
   * Subtracts vector b from vector a
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
  }
  /**
   * Alias for {@link Vec2.subtract}
   * @category Static
   */
  static sub(out, a, b) {
    return [0, 0];
  }
  /**
   * Multiplies two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static multiply(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
  }
  /**
   * Alias for {@link Vec2.multiply}
   * @category Static
   */
  static mul(out, a, b) {
    return [0, 0];
  }
  /**
   * Divides two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
  }
  /**
   * Alias for {@link Vec2.divide}
   * @category Static
   */
  static div(out, a, b) {
    return [0, 0];
  }
  /**
   * Math.ceil the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to ceil
   * @returns `out`
   */
  static ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    return out;
  }
  /**
   * Math.floor the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to floor
   * @returns `out`
   */
  static floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    return out;
  }
  /**
   * Returns the minimum of two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
  }
  /**
   * Returns the maximum of two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
  }
  /**
   * Math.round the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to round
   * @returns `out`
   */
  static round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    return out;
  }
  /**
   * Scales a {@link Vec2} by a scalar number
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The vector to scale
   * @param b - Amount to scale the vector by
   * @returns `out`
   */
  static scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
  }
  /**
   * Adds two Vec2's after scaling the second operand by a scalar value
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @param scale - The amount to scale b by before adding
   * @returns `out`
   */
  static scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + b[0] * scale;
    out[1] = a[1] + b[1] * scale;
    return out;
  }
  /**
   * Calculates the euclidian distance between two {@link Vec2}s
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns distance between `a` and `b`
   */
  static distance(a, b) {
    return Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  /**
   * Alias for {@link Vec2.distance}
   * @category Static
   */
  static dist(a, b) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between two {@link Vec2}s
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns Squared distance between `a` and `b`
   */
  static squaredDistance(a, b) {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    return x * x + y * y;
  }
  /**
   * Alias for {@link Vec2.distance}
   * @category Static
   */
  static sqrDist(a, b) {
    return 0;
  }
  /**
   * Calculates the magnitude (length) of a {@link Vec2}
   * @category Static
   *
   * @param a - Vector to calculate magnitude of
   * @returns Magnitude of a
   */
  static magnitude(a) {
    let x = a[0];
    let y = a[1];
    return Math.sqrt(x * x + y * y);
  }
  /**
   * Alias for {@link Vec2.magnitude}
   * @category Static
   */
  static mag(a) {
    return 0;
  }
  /**
   * Alias for {@link Vec2.magnitude}
   * @category Static
   * @deprecated Use {@link Vec2.magnitude} to avoid conflicts with builtin `length` methods/attribs
   *
   * @param a - vector to calculate length of
   * @returns length of a
   */
  // @ts-ignore: Length conflicts with Function.length
  static length(a) {
    return 0;
  }
  /**
   * Alias for {@link Vec2.magnitude}
   * @category Static
   * @deprecated Use {@link Vec2.mag}
   */
  static len(a) {
    return 0;
  }
  /**
   * Calculates the squared length of a {@link Vec2}
   * @category Static
   *
   * @param a - Vector to calculate squared length of
   * @returns Squared length of a
   */
  static squaredLength(a) {
    const x = a[0];
    const y = a[1];
    return x * x + y * y;
  }
  /**
   * Alias for {@link Vec2.squaredLength}
   */
  static sqrLen(a, b) {
    return 0;
  }
  /**
   * Negates the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to negate
   * @returns `out`
   */
  static negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
  }
  /**
   * Returns the inverse of the components of a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to invert
   * @returns `out`
   */
  static inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    return out;
  }
  /**
   * Normalize a {@link Vec2}
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - Vector to normalize
   * @returns `out`
   */
  static normalize(out, a) {
    const x = a[0];
    const y = a[1];
    let len = x * x + y * y;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    return out;
  }
  /**
   * Calculates the dot product of two {@link Vec2}s
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns Dot product of `a` and `b`
   */
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  /**
   * Computes the cross product of two {@link Vec2}s
   * Note that the cross product must by definition produce a 3D vector.
   * For this reason there is also not instance equivalent for this function.
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static cross(out, a, b) {
    const z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
  }
  /**
   * Performs a linear interpolation between two {@link Vec2}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @param t - Interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(out, a, b, t2) {
    const ax = a[0];
    const ay = a[1];
    out[0] = ax + t2 * (b[0] - ax);
    out[1] = ay + t2 * (b[1] - ay);
    return out;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat2}
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat2(out, a, m) {
    const x = a[0];
    const y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat2d}
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat2d(out, a, m) {
    const x = a[0];
    const y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat3}
   * 3rd vector component is implicitly '1'
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat3(out, a, m) {
    const x = a[0];
    const y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
  }
  /**
   * Transforms the {@link Vec2} with a {@link Mat4}
   * 3rd vector component is implicitly '0'
   * 4th vector component is implicitly '1'
   *
   * @param out - The receiving vector
   * @param a - The vector to transform
   * @param m - Matrix to transform with
   * @returns `out`
   */
  static transformMat4(out, a, m) {
    const x = a[0];
    const y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
  }
  /**
   * Rotate a 2D vector
   * @category Static
   *
   * @param out - The receiving {@link Vec2}
   * @param a - The {@link Vec2} point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotate(out, a, b, rad) {
    const p0 = a[0] - b[0];
    const p1 = a[1] - b[1];
    const sinC = Math.sin(rad);
    const cosC = Math.cos(rad);
    out[0] = p0 * cosC - p1 * sinC + b[0];
    out[1] = p0 * sinC + p1 * cosC + b[1];
    return out;
  }
  /**
   * Get the angle between two 2D vectors
   * @category Static
   *
   * @param a - The first operand
   * @param b - The second operand
   * @returns The angle in radians
   */
  static angle(a, b) {
    const x1 = a[0];
    const y1 = a[1];
    const x2 = b[0];
    const y2 = b[1];
    const mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2);
    const cosine = mag && (x1 * x2 + y1 * y2) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  /**
   * Set the components of a {@link Vec2} to zero
   * @category Static
   *
   * @param out - The receiving vector
   * @returns `out`
   */
  static zero(out) {
    out[0] = 0;
    out[1] = 0;
    return out;
  }
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns `true` if the vectors components are ===, `false` otherwise.
   */
  static exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1];
  }
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns `true` if the vectors are approximately equal, `false` otherwise.
   */
  static equals(a, b) {
    const a0 = a[0];
    const a1 = a[1];
    const b0 = b[0];
    const b1 = b[1];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1));
  }
  /**
   * Returns a string representation of a vector
   * @category Static
   *
   * @param a - Vector to represent as a string
   * @returns String representation of the vector
   */
  static str(a) {
    return `Vec2(${a.join(", ")})`;
  }
};
Vec2.prototype.sub = Vec2.prototype.subtract;
Vec2.prototype.mul = Vec2.prototype.multiply;
Vec2.prototype.div = Vec2.prototype.divide;
Vec2.prototype.dist = Vec2.prototype.distance;
Vec2.prototype.sqrDist = Vec2.prototype.squaredDistance;
Vec2.sub = Vec2.subtract;
Vec2.mul = Vec2.multiply;
Vec2.div = Vec2.divide;
Vec2.dist = Vec2.distance;
Vec2.sqrDist = Vec2.squaredDistance;
Vec2.sqrLen = Vec2.squaredLength;
Vec2.mag = Vec2.magnitude;
Vec2.length = Vec2.magnitude;
Vec2.len = Vec2.magnitude;

// Pages/Ball.ts
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
var colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "magenta",
  "cyan"
];
var Ball = class _Ball {
  #pos;
  get pos() {
    return this.#pos;
  }
  #vel;
  get vel() {
    return this.#vel;
  }
  #color;
  static BYTE_LENGTH = 2 * Vec2.BYTE_LENGTH;
  constructor(floats) {
    this.#pos = new Vec2(floats, 0);
    this.#vel = new Vec2(floats, Vec2.BYTE_LENGTH);
    this.#color = arrayRandom(colors);
  }
  static fill(outputArray) {
    const buffer = new ArrayBuffer(_Ball.BYTE_LENGTH * outputArray.length);
    for (let i = 0; i < outputArray.length; ++i) {
      const floats = new Float32Array(buffer, _Ball.BYTE_LENGTH * i, 4);
      const ball = outputArray[i] = new _Ball(floats);
      ball.pos.x = randomRange(-1, 1);
      ball.pos.y = randomRange(-1, 1);
      ball.vel.x = randomRange(-0.1, 0.1);
      ball.vel.y = randomRange(-0.1, 0.1);
    }
    return buffer;
  }
  draw2d(g, s, sh) {
    const heading = Math.atan2(this.vel.y, this.vel.x);
    const speed = this.vel.magnitude;
    g.save();
    g.fillStyle = this.#color;
    g.translate(this.#pos.x, this.#pos.y);
    g.rotate(heading);
    g.scale(1 + speed, 1);
    g.fillRect(-sh, -sh, s, s);
    g.restore();
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/src/debounce.ts
function debounce(timeOrAction, action) {
  let time = 0;
  if (isNumber(timeOrAction)) {
    time = timeOrAction;
  } else {
    action = timeOrAction;
  }
  let ready = true;
  return (...args) => {
    if (ready) {
      ready = false;
      setTimeout(() => {
        ready = true;
        action(...args);
      }, time);
    }
  };
}

// Pages/index.ts
var canvas = Canvas(ID("frontBuffer"));
var context = canvas.getContext("2d", { alpha: true, desynchronized: true });
var resize = debounce(_resize);
var resizer = new ResizeObserver((evts) => {
  for (const evt of evts) {
    if (evt.target === canvas) {
      resize();
    }
  }
});
var adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
var device = await adapter.requestDevice();
var balls = new Array(100);
var srcArrayBuffer = Ball.fill(balls);
var srcDataBuffer = new Uint8Array(srcArrayBuffer);
var gpuBuffer = device.createBuffer({
  mappedAtCreation: true,
  size: srcArrayBuffer.byteLength,
  usage: GPUBufferUsage.MAP_WRITE
});
var gpuArrayBuffer = gpuBuffer.getMappedRange();
var gpuDataBuffer = new Uint8Array(gpuArrayBuffer);
gpuDataBuffer.set(srcDataBuffer);
resizer.observe(canvas);
function _resize() {
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
}
requestAnimationFrame(draw);
function draw() {
  requestAnimationFrame(draw);
  const s = Math.min(canvas.width, canvas.height);
  const sh = s / 2;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.scale(0.01, 0.01);
  for (const ball of balls) {
    ball.draw2d(context, s, sh);
  }
  context.restore();
}
requestAnimationFrame(update);
async function update() {
  requestAnimationFrame(update);
}
//# sourceMappingURL=index.js.map
