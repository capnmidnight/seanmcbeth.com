var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

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
      let set2 = warnings.get(elem.tagName);
      if (!set2) {
        warnings.set(elem.tagName, set2 = /* @__PURE__ */ new Set());
      }
      if (!set2.has(this.key)) {
        set2.add(this.key);
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
function ID(value) {
  return attr("id", value, false);
}
function Width(value) {
  return attr("width", value, false, "canvas", "embed", "iframe", "img", "input", "object", "video");
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

// node_modules/gl-matrix/esm/common.js
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

// node_modules/gl-matrix/esm/vec2.js
var vec2_exports = {};
__export(vec2_exports, {
  add: () => add,
  angle: () => angle,
  ceil: () => ceil,
  clone: () => clone,
  copy: () => copy,
  create: () => create,
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
  rotate: () => rotate,
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
  transformMat2: () => transformMat2,
  transformMat2d: () => transformMat2d,
  transformMat3: () => transformMat3,
  transformMat4: () => transformMat4,
  zero: () => zero
});
function create() {
  var out = new ARRAY_TYPE(2);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }
  return out;
}
function clone(a) {
  var out = new ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
function fromValues(x, y) {
  var out = new ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
function set(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  return out;
}
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  return out;
}
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
}
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
}
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  return out;
}
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
function scaleAndAdd(out, a, b, scale2) {
  out[0] = a[0] + b[0] * scale2;
  out[1] = a[1] + b[1] * scale2;
  return out;
}
function distance(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1];
  return Math.hypot(x, y);
}
function squaredDistance(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1];
  return x * x + y * y;
}
function length(a) {
  var x = a[0], y = a[1];
  return Math.hypot(x, y);
}
function squaredLength(a) {
  var x = a[0], y = a[1];
  return x * x + y * y;
}
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
function inverse(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  return out;
}
function normalize(out, a) {
  var x = a[0], y = a[1];
  var len2 = x * x + y * y;
  if (len2 > 0) {
    len2 = 1 / Math.sqrt(len2);
  }
  out[0] = a[0] * len2;
  out[1] = a[1] * len2;
  return out;
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
function cross(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
}
function lerp(out, a, b, t2) {
  var ax = a[0], ay = a[1];
  out[0] = ax + t2 * (b[0] - ax);
  out[1] = ay + t2 * (b[1] - ay);
  return out;
}
function random(out, scale2) {
  scale2 = scale2 || 1;
  var r = RANDOM() * 2 * Math.PI;
  out[0] = Math.cos(r) * scale2;
  out[1] = Math.sin(r) * scale2;
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
function transformMat3(out, a, m) {
  var x = a[0], y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
function transformMat4(out, a, m) {
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
function angle(a, b) {
  var x1 = a[0], y1 = a[1], x2 = b[0], y2 = b[1], mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2), cosine = mag && (x1 * x2 + y1 * y2) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
function zero(out) {
  out[0] = 0;
  out[1] = 0;
  return out;
}
function str(a) {
  return "vec2(" + a[0] + ", " + a[1] + ")";
}
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
function equals(a, b) {
  var a0 = a[0], a1 = a[1];
  var b0 = b[0], b1 = b[1];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1));
}
var len = length;
var sub = subtract;
var mul = multiply;
var div = divide;
var dist = distance;
var sqrDist = squaredDistance;
var sqrLen = squaredLength;
var forEach = function() {
  var vec = create();
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

// Pages/Camera.ts
var Camera = class {
  constructor(target) {
    this.target = target;
  }
  position = vec2_exports.create();
  predict(g2) {
    g2.fillStyle = "rgba(0, 0, 0, 0.5)";
    g2.fillRect(0, 0, g2.canvas.width, g2.canvas.height);
    vec2_exports.set(this.position, g2.canvas.width, g2.canvas.height);
    vec2_exports.scale(this.position, this.position, 0.5);
    vec2_exports.scaleAndAdd(this.position, this.position, this.target.position, -1);
    const speed = vec2_exports.len(this.target.velocity);
    if (speed > 0) {
      vec2_exports.scaleAndAdd(this.position, this.position, this.target.velocity, -1 / Math.pow(speed, 0.25));
    }
    g2.translate(this.position[0], this.position[1]);
  }
  prepare(g2, scale2) {
    g2.clearRect(0, 0, g2.canvas.width, g2.canvas.height);
    g2.fillStyle = "rgba(0, 0, 0, 0.75)";
    g2.fillRect(0, 0, g2.canvas.width, g2.canvas.height);
    vec2_exports.set(this.position, g2.canvas.width, g2.canvas.height);
    vec2_exports.scale(this.position, this.position, 0.5);
    vec2_exports.scaleAndAdd(this.position, this.position, this.target.position, -scale2);
    g2.translate(this.position[0], this.position[1]);
    g2.scale(scale2, scale2);
  }
};

// Pages/Keyboard.ts
var Keyboard = class {
  keySet = /* @__PURE__ */ new Set();
  constructor() {
    window.addEventListener("keydown", (evt) => {
      this.keySet.add(evt.key);
    });
    window.addEventListener("keyup", (evt) => {
      this.keySet.delete(evt.key);
    });
  }
  has(key) {
    return this.keySet.has(key);
  }
  get shift() {
    return this.keySet.has("Shift") ? 1 : 0;
  }
  get vertical() {
    return this.keySet.has("ArrowUp") ? 1 : this.keySet.has("ArrowDown") ? -1 : 0;
  }
  get horizontal() {
    return this.keySet.has("ArrowRight") ? 1 : this.keySet.has("ArrowLeft") ? -1 : 0;
  }
};

// Pages/Minimap.ts
var Minimap = class {
  constructor(camera2, drawables2) {
    this.camera = camera2;
    this.drawables = drawables2;
  }
  buffer = Canvas(Width(256), Height(128));
  g = this.buffer.getContext("2d");
  draw(g2) {
    this.g.save();
    this.camera.prepare(this.g, 1e-3);
    for (const drawable of this.drawables) {
      drawable.drawMini(this.g);
    }
    this.g.restore();
    g2.save();
    g2.strokeStyle = "rgba(255, 255, 255, 0.25)";
    g2.lineWidth = 1;
    g2.translate(10, 10);
    g2.drawImage(this.buffer, 0, 0);
    g2.strokeRect(0, 0, this.buffer.width, this.buffer.height);
    g2.restore();
  }
};

// Pages/constants.ts
var zero2 = vec2_exports.create();

// Pages/Physics.ts
var G = 1;
var delta = vec2_exports.create();
var Physics = class {
  bodies;
  constructor(...bodies) {
    this.bodies = bodies;
  }
  update(_) {
    for (const body of this.bodies) {
      vec2_exports.copy(body.gravity, zero2);
    }
    for (let i = 0; i < this.bodies.length - 1; ++i) {
      const a = this.bodies[i];
      for (let j = i + 1; j < this.bodies.length; ++j) {
        const b = this.bodies[j];
        vec2_exports.sub(delta, a.position, b.position);
        const rSquared = vec2_exports.sqrLen(delta);
        if (rSquared > 0) {
          vec2_exports.normalize(delta, delta);
          const F5 = G * a.mass * b.mass / rSquared;
          vec2_exports.scaleAndAdd(a.gravity, a.gravity, delta, -F5 / a.mass);
          vec2_exports.scaleAndAdd(b.gravity, b.gravity, delta, F5 / b.mass);
        }
      }
    }
  }
};

// Pages/Planetoid.ts
var Planetoid = class {
  constructor(mass, radius, atmoRadius) {
    this.mass = mass;
    this.radius = radius;
    this.atmoRadius = atmoRadius;
    if (this.atmoRadius > 0) {
      this.atmoRadius += this.radius;
    }
  }
  gravity = vec2_exports.create();
  velocity = vec2_exports.create();
  position = vec2_exports.create();
  update(dt) {
    vec2_exports.scaleAndAdd(this.velocity, this.velocity, this.gravity, dt);
    vec2_exports.scaleAndAdd(this.position, this.position, this.velocity, dt);
  }
  draw(g2) {
    g2.save();
    g2.strokeStyle = "white";
    g2.fillStyle = "black";
    g2.lineWidth = 10;
    this.drawMajor(g2, 1);
    g2.stroke();
    if (this.atmoRadius > 0) {
      g2.lineWidth = 0.5;
      g2.beginPath();
      g2.arc(this.position[0], this.position[1], this.atmoRadius, 0, 2 * Math.PI);
      g2.stroke();
    }
    g2.restore();
  }
  drawMajor(g2, scale2) {
    g2.beginPath();
    g2.arc(this.position[0], this.position[1], this.radius * scale2, 0, 2 * Math.PI);
    g2.fill();
  }
  drawMini(g2) {
    g2.save();
    g2.fillStyle = "white";
    this.drawMajor(g2, 50);
    g2.restore();
  }
};

// Pages/Ship.ts
var S = 5;
var R = 5;
var F = 1e3;
var D = -0.05;
var Ship = class {
  constructor(keyboard2) {
    this.keyboard = keyboard2;
  }
  enginePower = 0;
  turnRate = 0;
  drag = 0;
  mass = 1;
  rotation = 0;
  shake = vec2_exports.create();
  acceleration = vec2_exports.create();
  gravity = vec2_exports.create();
  velocity = vec2_exports.create();
  position = vec2_exports.create();
  update(dt) {
    this.turnRate = this.keyboard.horizontal;
    this.enginePower = Math.max(-0.5, this.keyboard.vertical) + this.keyboard.shift * 7;
    this.rotation += R * this.turnRate * dt;
    vec2_exports.set(this.acceleration, 1, 0);
    vec2_exports.rotate(this.acceleration, this.acceleration, zero2, this.rotation);
    vec2_exports.scale(this.acceleration, this.acceleration, F * this.enginePower * dt);
    vec2_exports.set(this.shake, 0, Math.random() * 2 - 1);
    vec2_exports.rotate(this.shake, this.shake, zero2, this.rotation);
    const shudder = Math.pow(vec2_exports.len(this.acceleration), 0.3333);
    vec2_exports.scaleAndAdd(this.shake, zero2, this.shake, shudder);
    vec2_exports.scaleAndAdd(this.acceleration, this.acceleration, this.velocity, D * this.drag);
    vec2_exports.add(this.acceleration, this.acceleration, this.gravity);
    vec2_exports.scaleAndAdd(this.velocity, this.velocity, this.acceleration, dt);
    vec2_exports.scaleAndAdd(this.position, this.position, this.velocity, dt);
  }
  draw(g2) {
    g2.save();
    g2.fillStyle = "black";
    g2.strokeStyle = "white";
    g2.lineWidth = 0.25;
    g2.translate(this.position[0] + this.shake[0], this.position[1] + this.shake[1]);
    g2.rotate(this.rotation);
    g2.scale(S, S);
    g2.beginPath();
    g2.moveTo(1.75, 0);
    g2.lineTo(-1, 1.25);
    g2.lineTo(-0.5, 0);
    if (this.enginePower > 0) {
      g2.lineTo(-this.enginePower + 0.4 * Math.random(), 0.2 + 0.4 * Math.random());
      g2.lineTo(-0.7 + 0.1 * Math.random(), 0 + 0.1 * Math.random());
      g2.lineTo(-this.enginePower - 0.4 * Math.random(), -0.2 - 0.4 * Math.random());
      g2.lineTo(-0.5, 0);
    }
    g2.lineTo(-1, -1.25);
    g2.closePath();
    g2.stroke();
    g2.restore();
  }
  drawMini(g2) {
    g2.save();
    g2.fillStyle = "yellow";
    const s = S * 200;
    g2.fillRect(this.position[0] - 0.5 * s, this.position[1] - 0.5 * s, s, s);
    g2.restore();
  }
};

// node_modules/simplex-noise/dist/esm/simplex-noise.js
var F2 = 0.5 * (Math.sqrt(3) - 1);
var G2 = (3 - Math.sqrt(3)) / 6;
var F3 = 1 / 3;
var G3 = 1 / 6;
var F4 = (Math.sqrt(5) - 1) / 4;
var G4 = (5 - Math.sqrt(5)) / 20;
var fastFloor = (x) => Math.floor(x) | 0;
var grad2 = /* @__PURE__ */ new Float64Array([
  1,
  1,
  -1,
  1,
  1,
  -1,
  -1,
  -1,
  1,
  0,
  -1,
  0,
  1,
  0,
  -1,
  0,
  0,
  1,
  0,
  -1,
  0,
  1,
  0,
  -1
]);
function createNoise2D(random2 = Math.random) {
  const perm = buildPermutationTable(random2);
  const permGrad2x = new Float64Array(perm).map((v) => grad2[v % 12 * 2]);
  const permGrad2y = new Float64Array(perm).map((v) => grad2[v % 12 * 2 + 1]);
  return function noise2D(x, y) {
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;
    const s = (x + y) * F2;
    const i = fastFloor(x + s);
    const j = fastFloor(y + s);
    const t2 = (i + j) * G2;
    const X0 = i - t2;
    const Y0 = j - t2;
    const x0 = x - X0;
    const y0 = y - Y0;
    let i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      const gi0 = ii + perm[jj];
      const g0x = permGrad2x[gi0];
      const g0y = permGrad2y[gi0];
      t0 *= t0;
      n0 = t0 * t0 * (g0x * x0 + g0y * y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      const gi1 = ii + i1 + perm[jj + j1];
      const g1x = permGrad2x[gi1];
      const g1y = permGrad2y[gi1];
      t1 *= t1;
      n1 = t1 * t1 * (g1x * x1 + g1y * y1);
    }
    let t22 = 0.5 - x2 * x2 - y2 * y2;
    if (t22 >= 0) {
      const gi2 = ii + 1 + perm[jj + 1];
      const g2x = permGrad2x[gi2];
      const g2y = permGrad2y[gi2];
      t22 *= t22;
      n2 = t22 * t22 * (g2x * x2 + g2y * y2);
    }
    return 70 * (n0 + n1 + n2);
  };
}
function buildPermutationTable(random2) {
  const tableSize = 512;
  const p = new Uint8Array(tableSize);
  for (let i = 0; i < tableSize / 2; i++) {
    p[i] = i;
  }
  for (let i = 0; i < tableSize / 2 - 1; i++) {
    const r = i + ~~(random2() * (256 - i));
    const aux = p[i];
    p[i] = p[r];
    p[r] = aux;
  }
  for (let i = 256; i < tableSize; i++) {
    p[i] = p[i - 256];
  }
  return p;
}

// Pages/Starfield.ts
var S2 = 10;
var Starfield = class {
  constructor(target) {
    this.target = target;
  }
  noise = createNoise2D(Math.random);
  draw(g2) {
    g2.save();
    g2.fillStyle = "white";
    for (let dy = 0; dy < g2.canvas.height; dy += S2) {
      const y = dy - S2 * Math.round(this.target.position[1] / S2);
      for (let dx = 0; dx < g2.canvas.width; dx += S2) {
        const x = dx - S2 * Math.round(this.target.position[0] / S2);
        const v = this.noise(S2 * x, S2 * y);
        if (v > 0.9) {
          g2.fillRect(x, y, 2, 2);
        }
      }
    }
    g2.restore();
  }
  drawMini(_) {
  }
};

// Pages/registerResizer.ts
function registerResizer(canvas2) {
  let doResize = false;
  function resize() {
    canvas2.width = devicePixelRatio * canvas2.clientWidth;
    canvas2.height = devicePixelRatio * canvas2.clientHeight;
    doResize = false;
  }
  const resizer = new ResizeObserver((evts) => {
    for (const evt of evts) {
      if (evt.target === canvas2) {
        if (!doResize) {
          doResize = true;
          queueMicrotask(resize);
        }
      }
    }
  });
  resizer.observe(canvas2);
}

// Pages/runAnimation.ts
function runAnimation(update) {
  let lt = 0;
  requestAnimationFrame((t2) => {
    t2 *= 1e-3;
    lt = t2;
    requestAnimationFrame(doFrame);
  });
  function doFrame(t2) {
    t2 *= 1e-3;
    const dt = t2 - lt;
    lt = t2;
    requestAnimationFrame(doFrame);
    update(dt, t2);
  }
}

// Pages/index.ts
var canvas = Canvas(ID("frontBuffer"));
var g = canvas.getContext("2d");
var keyboard = new Keyboard();
var ship = new Ship(keyboard);
var camera = new Camera(ship);
var blackhole = new Planetoid(1e7, 10, 0);
var planet = new Planetoid(1e6, 50, 50);
var starfield = new Starfield(camera);
var physics = new Physics(blackhole, planet, ship);
var updatables = [physics, blackhole, planet, ship];
var drawables = [starfield, blackhole, planet, ship];
var minimap = new Minimap(camera, drawables);
vec2_exports.set(blackhole.position, 500, 100);
vec2_exports.set(planet.position, -500, -150);
vec2_exports.set(planet.velocity, 200, -100);
registerResizer(canvas);
runAnimation((dt) => {
  g.save();
  for (const updatable of updatables) {
    updatable.update(dt);
  }
  camera.predict(g);
  for (const drawable of drawables) {
    drawable.draw(g);
  }
  g.restore();
  minimap.draw(g);
});
//# sourceMappingURL=index.js.map
