// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/typeChecks.js
function t(o, s, c) {
  return typeof o === s || o instanceof c;
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

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/collections/dist/arrays.js
function arrayClear(arr) {
  return arr.splice(0);
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
function getElement(selector) {
  return document.querySelector(selector);
}
function getButton(selector) {
  return getElement(selector);
}
function getInput(selector) {
  return getElement(selector);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/widgets/dist/MessageBox.js
var MessageBox = class {
  constructor(msgBox) {
    this.msgBox = msgBox;
    this.task = new Task(false);
    this.msgBoxConfirm = this.msgBox.querySelector("button.confirm");
    this.msgBoxCancel = this.msgBox.querySelector("button.cancel");
    this.msgBoxConfirm.addEventListener("click", this.task.resolver(true));
    this.msgBoxCancel.addEventListener("click", this.task.resolver(false));
  }
  async show() {
    this.task.restart();
    elementSetDisplay(this.msgBox, true, "block");
    await this.task;
    elementSetDisplay(this.msgBox, false);
    return this.task.result;
  }
};

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/widgets/dist/makeAction.js
function makeAction(buttonID, msgBoxID, action) {
  const button = getButton(buttonID);
  const msgBoxElement = getElement(msgBoxID);
  if (button && msgBoxElement) {
    const msgBox = new MessageBox(msgBoxElement);
    if (msgBox) {
      button.addEventListener("click", async () => {
        button.form.action = button.form.action.replace(/handler=\w+/, `handler=${action}`);
        const confirmed = await msgBox.show();
        if (confirmed) {
          button.form.submit();
        }
      }, true);
    }
  }
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/dist/fadeOut.js
function fadeOut(element, opaqueSeconds = 1, fadeSeconds = 1, dt = 0.01) {
  opaqueSeconds *= 1e3;
  fadeSeconds *= 1e3;
  dt *= 1e3;
  let time = opaqueSeconds + fadeSeconds;
  const timer = setInterval(() => {
    time -= dt;
    const opacity = time > fadeSeconds ? 1 : time / fadeSeconds;
    element.style.opacity = `${Math.min(100, opacity * 100)}%`;
    if (time === 0) {
      element.style.display = "none";
      clearInterval(timer);
    }
  }, dt);
}

// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/widgets/dist/makeAlerts.js
function makeAlerts() {
  const alerts = document.querySelectorAll(".alert");
  for (const alert of alerts) {
    if (alert.style.display !== "none") {
      fadeOut(alert, 2, 0.5);
    }
  }
}

// src/dom-apps/resource-detail/index.ts
var saveButton = getButton("#saveDetailButton");
var deleteButton = getButton("#deleteDetailButton");
var nameInput = getInput("#nameInput") || getInput("#headsetName");
makeAlerts();
if (saveButton) {
  let updateSaveButton = function() {
    saveButton.disabled = nameInput.value.length === 0;
  };
  makeAction("#saveDetailButton", "#saveDetailMessage", "Update");
  updateSaveButton();
  nameInput.addEventListener("input", () => updateSaveButton());
}
if (deleteButton) {
  makeAction("#deleteDetailButton", "#deleteDetailMessage", "Delete");
}
//# sourceMappingURL=index.js.map
