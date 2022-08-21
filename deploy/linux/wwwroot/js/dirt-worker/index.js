// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayClear.ts
function arrayClear(arr) {
  return arr.splice(0);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/collections/arrayRemoveAt.ts
function arrayRemoveAt(arr, idx) {
  return arr.splice(idx, 1)[0];
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/typeChecks.ts
function t(o, s, c) {
  return typeof o === s || o instanceof c;
}
function isFunction(obj) {
  return t(obj, "function", Function);
}
function isBoolean(obj) {
  return t(obj, "boolean", Boolean);
}
function isArray(obj) {
  return obj instanceof Array;
}
function isNullOrUndefined(obj) {
  return obj === null || obj === void 0;
}
function isDefined(obj) {
  return !isNullOrUndefined(obj);
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/progress/BaseProgress.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/workers/WorkerServer.ts
var WorkerServerProgress = class extends BaseProgress {
  constructor(server, taskID) {
    super();
    this.server = server;
    this.taskID = taskID;
  }
  report(soFar, total, msg, est) {
    const message = {
      type: "progress",
      taskID: this.taskID,
      soFar,
      total,
      msg,
      est
    };
    this.server.postMessage(message);
  }
};
var WorkerServer = class {
  constructor(self) {
    this.self = self;
    this.methods = /* @__PURE__ */ new Map();
    this.self.addEventListener("message", (evt) => {
      const data = evt.data;
      this.callMethod(data);
    });
  }
  postMessage(message, transferables) {
    if (isDefined(transferables)) {
      this.self.postMessage(message, transferables);
    } else {
      this.self.postMessage(message);
    }
  }
  callMethod(data) {
    const method = this.methods.get(data.methodName);
    if (method) {
      try {
        if (isArray(data.params)) {
          method(data.taskID, ...data.params);
        } else if (isDefined(data.params)) {
          method(data.taskID, data.params);
        } else {
          method(data.taskID);
        }
      } catch (exp) {
        this.onError(data.taskID, `method invocation error: ${data.methodName}(${exp.message || exp})`);
      }
    } else {
      this.onError(data.taskID, `method not found: ${data.methodName}`);
    }
  }
  onError(taskID, errorMessage) {
    const message = {
      type: "error",
      taskID,
      errorMessage
    };
    this.postMessage(message);
  }
  onReturn(taskID, returnValue, transferReturnValue) {
    let message = null;
    if (returnValue === void 0) {
      message = {
        type: "return",
        taskID
      };
    } else {
      message = {
        type: "return",
        taskID,
        returnValue
      };
    }
    if (isDefined(transferReturnValue)) {
      const transferables = transferReturnValue(returnValue);
      this.postMessage(message, transferables);
    } else {
      this.postMessage(message);
    }
  }
  addMethodInternal(methodName, asyncFunc, transferReturnValue) {
    if (this.methods.has(methodName)) {
      throw new Error(`${methodName} method has already been mapped.`);
    }
    this.methods.set(methodName, async (taskID, ...params) => {
      const prog = new WorkerServerProgress(this, taskID);
      try {
        const returnValue = await asyncFunc(...params, prog);
        this.onReturn(taskID, returnValue, transferReturnValue);
      } catch (exp) {
        console.error(exp);
        this.onError(taskID, exp.message || exp);
      }
    });
  }
  addFunction(methodName, asyncFunc, transferReturnValue) {
    this.addMethodInternal(methodName, asyncFunc, transferReturnValue);
  }
  addVoidFunction(methodName, asyncFunc) {
    this.addMethodInternal(methodName, asyncFunc);
  }
  addMethod(obj, methodName, method, transferReturnValue) {
    this.addFunction(methodName, method.bind(obj), transferReturnValue);
  }
  addVoidMethod(obj, methodName, method) {
    this.addVoidFunction(methodName, method.bind(obj));
  }
  addEvent(object, eventName, makePayload, transferReturnValue) {
    object.addEventListener(eventName, (evt) => {
      let message = null;
      if (isDefined(makePayload)) {
        message = {
          type: "event",
          eventName,
          data: makePayload(evt)
        };
      } else {
        message = {
          type: "event",
          eventName
        };
      }
      if (message.data !== void 0 && isDefined(transferReturnValue)) {
        const transferables = transferReturnValue(message.data);
        this.postMessage(message, transferables);
      } else {
        this.postMessage(message);
      }
    });
  }
};

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/identity.ts
function alwaysTrue() {
  return true;
}

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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/canvas.ts
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
  const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled, oldTextBaseline = ctx.textBaseline, oldTextAlign = ctx.textAlign, oldFont = ctx.font, resized = setCanvasSize(
    ctx.canvas,
    w,
    h,
    superscale
  );
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
    return setCanvasSize(
      ctx.canvas,
      w,
      h,
      superscale
    );
  }
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/math/xy2i.ts
function xy2i(x, y, width, components = 1) {
  return components * (x + width * y);
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

// src/dirt-worker/DirtService.ts
var actionTypes = singleton("Juniper:Graphics2D:Dirt:StopTypes", () => /* @__PURE__ */ new Map([
  ["mousedown", "down"],
  ["mouseenter", "move"],
  ["mouseleave", "up"],
  ["mousemove", "move"],
  ["mouseout", "up"],
  ["mouseover", "move"],
  ["mouseup", "up"],
  ["pointerdown", "down"],
  ["pointerenter", "move"],
  ["pointerleave", "up"],
  ["pointermove", "move"],
  ["pointerrawupdate", "move"],
  ["pointerout", "up"],
  ["pointerup", "up"],
  ["pointerover", "move"],
  ["touchcancel", "up"],
  ["touchend", "up"],
  ["touchmove", "move"],
  ["touchstart", "down"]
]));
var DirtServiceUpdateEvent = class extends TypedEvent {
  constructor() {
    super("update");
  }
};
var DirtService = class extends TypedEventBase {
  constructor() {
    super();
    this.updateEvt = new DirtServiceUpdateEvent();
    this.canvas = null;
    this.transferCanvas = null;
    this.g = null;
    this.tg = null;
    this.pointerId = null;
    this.fr = null;
    this.pr = null;
    this.height = null;
    this.x = null;
    this.y = null;
    this.lx = null;
    this.ly = null;
    this.components = null;
    this.data = null;
    this.sub = new OffscreenCanvas(this.height, this.height);
    this.subg = this.sub.getContext("2d", {
      alpha: false,
      desynchronized: true,
      willReadFrequently: true
    });
  }
  init(width, height, fr, pr) {
    this.transferCanvas = new OffscreenCanvas(width, height);
    this.tg = this.transferCanvas.getContext("2d");
    this.canvas = new OffscreenCanvas(width, height);
    this.g = this.canvas.getContext("2d", {
      alpha: false,
      desynchronized: true
    });
    this.g.fillStyle = "rgb(50%, 50%, 50%)";
    this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const imgData = this.g.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const { data } = imgData;
    const components = data.length / (width * height);
    for (let i = 0; i < data.length; i += components) {
      const v = Math.floor(50 * (Math.random() - 0.5));
      for (let c = 0; c < components - 1; ++c) {
        data[i + c] += v;
      }
    }
    this.g.putImageData(imgData, 0, 0);
    this.fr = fr;
    this.pr = pr;
    this.height = 2 * (this.fr + this.pr) + 1;
    this.onUpdate();
    return Promise.resolve();
  }
  onUpdate() {
    this.tg.drawImage(this.canvas, 0, 0);
    this.updateEvt.imgBmp = this.transferCanvas.transferToImageBitmap();
    this.dispatchEvent(this.updateEvt);
  }
  I(x, y) {
    return xy2i(x, y + this.fr + this.pr, this.sub.width, this.components);
  }
  GET(x, y) {
    return this.data[this.I(x, y)] / 255;
  }
  SET(x, y, v) {
    return this.data[this.I(x, y)] = 255 * v;
  }
  update() {
    if (this.pointerId !== null && this.canvas) {
      const dx = this.lx - this.x;
      const dy = this.ly - this.y;
      if (Math.abs(dx) + Math.abs(dy) > 0) {
        const a = Math.atan2(dy, dx) + Math.PI;
        const d = Math.round(Math.sqrt(dx * dx + dy * dy));
        setContextSize(this.subg, d + this.fr + this.pr, this.height);
        this.subg.save();
        this.subg.translate(0, this.fr + this.pr);
        this.subg.rotate(-a);
        this.subg.translate(-this.lx, -this.ly);
        this.subg.drawImage(this.canvas, 0, 0);
        this.subg.restore();
        const imgData = this.subg.getImageData(0, 0, this.sub.width, this.sub.height);
        this.data = imgData.data;
        this.components = this.data.length / (this.sub.width * this.height);
        const start = this.GET(0, 0);
        const level = Math.max(0, start - 0.25);
        let accum = 0;
        for (let x = 0; x < d; ++x) {
          const here = this.GET(x, 0);
          accum += here - level;
          this.SET(x, 0, level);
          for (let y = -this.fr; y <= this.fr; ++y) {
            const dx2 = this.fr - Math.abs(y);
            const here2 = this.GET(x + dx2, y);
            accum += here2 - level;
            this.SET(x + dx2, y, level);
          }
          const deposit = level / (2 * this.fr * this.pr);
          for (let y = -this.fr - this.pr; y <= this.fr + this.pr && accum > 0; ++y) {
            if (y < -this.fr || this.fr < y) {
              const dx2 = this.fr - Math.abs(y);
              const there = this.GET(x + dx2, y);
              const v = Math.min(accum, deposit);
              this.SET(x + dx2, y, there + v);
              accum -= v;
            }
          }
        }
        if (accum > 0) {
          const deposit = accum / (2 * this.fr * this.pr);
          for (let y = -this.fr - this.pr; y <= this.fr + this.pr && accum > 0; ++y) {
            if (y < -this.fr || this.fr < y) {
              const dx2 = this.fr - Math.abs(y);
              const there = this.GET(d + dx2, y);
              const v = Math.min(accum, deposit);
              this.SET(d + dx2, y, there + v);
              accum -= v;
            }
          }
        }
        for (let i = 0; i < this.data.length; i += this.components) {
          const p = this.data[i];
          this.data[i + 1] = p;
          this.data[i + 2] = p;
        }
        this.subg.putImageData(imgData, 0, 0);
        this.g.save();
        this.g.translate(this.lx, this.ly);
        this.g.rotate(a);
        this.g.translate(-0, -this.fr - this.pr);
        this.g.drawImage(this.sub, 0, 0);
        this.g.restore();
        this.onUpdate();
      }
    }
    this.lx = this.x;
    this.ly = this.y;
  }
  checkPointer(id, x, y, type2) {
    const action = actionTypes.get(type2) || type2;
    if (this.pointerId === null) {
      if (action === "down") {
        this.pointerId = id;
        this.lx = this.x = x;
        this.ly = this.y = y;
        this.update();
      }
    } else if (id === this.pointerId) {
      this.x = x;
      this.y = y;
      this.update();
      if (action === "up") {
        this.pointerId = null;
      }
    }
  }
  checkPointerUV(id, x, y, type2) {
    this.checkPointer(id, x * this.canvas.width, (1 - y) * this.canvas.height, type2);
  }
};

// src/dirt-worker/DirtWorkerServer.ts
var DirtWorkerServer = class extends WorkerServer {
  constructor(self) {
    super(self);
    const dirtService = new DirtService();
    this.addMethod(dirtService, "init", dirtService.init.bind(dirtService));
    this.addVoidMethod(dirtService, "checkPointer", dirtService.checkPointer.bind(dirtService));
    this.addVoidMethod(dirtService, "checkPointerUV", dirtService.checkPointerUV.bind(dirtService));
    this.addEvent(dirtService, "update", (evt) => evt.imgBmp, (imgBmp) => [imgBmp]);
  }
};

// src/dirt-worker/index.ts
globalThis.server = new DirtWorkerServer(globalThis);
//# sourceMappingURL=index.js.map
