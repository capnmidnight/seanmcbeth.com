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
function isDate(obj) {
  return obj instanceof Date;
}
function isNullOrUndefined(obj) {
  return obj === null || obj === void 0;
}
function isDefined(obj) {
  return !isNullOrUndefined(obj);
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
function arrayInsertAt(arr, item, idx) {
  arr.splice(idx, 0, item);
}
function arrayReplace(arr, ...items) {
  arr.splice(0, arr.length, ...items);
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
function colSpan(value) {
  return new Attr("colspan", value, false, "td", "th");
}
function customData(name, value) {
  return new Attr("data-" + name.toLowerCase(), value, false);
}
function type(value) {
  if (!isString(value)) {
    value = value.value;
  }
  return new Attr("type", value, false, "button", "input", "command", "embed", "link", "object", "script", "source", "style", "menu");
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/css.ts
function px(value) {
  return `${value}px`;
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
function padding(...v) {
  return new CssElementStyleProp("padding", v.join(" "));
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
function getElements(selector) {
  return Array.from(document.querySelectorAll(selector));
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
function elementGetText(elem) {
  elem = resolveElement(elem);
  return elem.innerText;
}
function elementSetTitle(elem, text) {
  elem = resolveElement(elem);
  elem.title = text;
}
function elementSetClass(elem, enabled, className2) {
  elem = resolveElement(elem);
  const canEnable = isDefined(className2);
  const hasEnabled = canEnable && elem.classList.contains(className2);
  if (canEnable && hasEnabled !== enabled) {
    elem.classList.toggle(className2);
  }
}
function buttonSetEnabled(button, enabled, label, title) {
  button = resolveElement(button);
  button.disabled = !enabled;
  elementSetText(button, label);
  elementSetTitle(button, title);
}
function ButtonRaw(...rest) {
  return tag("button", ...rest);
}
function Button(...rest) {
  return ButtonRaw(...rest, type("button"));
}
function ButtonSecondaryOutlineSmall(...rest) {
  return Button(...rest, classList("btn", "btn-sm", "btn-outline-secondary"));
}
function ButtonReset(...rest) {
  return ButtonRaw(...rest, type("reset"));
}
function Label(...rest) {
  return tag("label", ...rest);
}
function Span(...rest) {
  return tag("span", ...rest);
}
function Table(...rest) {
  return tag("table", ...rest);
}
function TBody(...rest) {
  return tag("tbody", ...rest);
}
function TD(...rest) {
  return tag("td", ...rest);
}
function TFoot(...rest) {
  return tag("tfoot", ...rest);
}
function TH(...rest) {
  return tag("th", ...rest);
}
function THead(...rest) {
  return tag("thead", ...rest);
}
function TR(...rest) {
  return tag("tr", ...rest);
}
function TextNode(txt) {
  return document.createTextNode(txt);
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/dom/getColumnIndex.ts
function getColumnIndex(element) {
  let column = element;
  while (column && column.tagName !== "TD" && column.tagName !== "TH") {
    column = column.parentElement;
  }
  if (column) {
    const columnRow = column.parentElement;
    let columnIndex = 0;
    for (const child of columnRow.children) {
      if (child === column) {
        return columnIndex;
      }
      if (child instanceof HTMLTableCellElement) {
        columnIndex += child.colSpan;
      }
    }
  }
  return -1;
}

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/events/debounce.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/strings/stringRandom.ts
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

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/widgets/FilterableTable/index.ts
function makeDate(value) {
  if (/^\d{4}-\d\d?-\d\d?$/.test(value)) {
    var parts = value.split("-");
    var year = parts.shift();
    parts.push(year);
    value = parts.join("/");
  }
  return new Date(value);
}
function isRangeStart(filterElement) {
  return filterElement.classList.contains("range-start");
}
function isRangeEnd(filterElement) {
  return filterElement.classList.contains("range-end");
}
function parseValue(input, value) {
  if (input instanceof HTMLInputElement && (input.type.startsWith("date") || input.type.startsWith("time") || input.type.startsWith("month") || input.type.startsWith("week"))) {
    return value && makeDate(value) || null;
  } else if (input instanceof HTMLInputElement && (input.type === "number" || input.type === "range")) {
    return value && parseFloat(value) || null;
  } else {
    return value && value.toLocaleLowerCase() || null;
  }
}
function getCellValue(cell, filterElement) {
  const inputs = Array.from(cell.querySelectorAll("input"));
  if (inputs.length === 0) {
    const text = cell.textContent.trim();
    return [parseValue(filterElement, text)];
  } else {
    return inputs.map((input) => parseValue(input, input.value));
  }
}
var DEFAULT_PAGE_SIZES = [
  10,
  25,
  50,
  100
];
var FilterableTable = class {
  constructor(element) {
    this.element = element;
    this.ranges = /* @__PURE__ */ new Map();
    this.valueCache = /* @__PURE__ */ new Map();
    this.resetButton = null;
    this.cellMappers = /* @__PURE__ */ new Map();
    this.pageSizes = [0, ...DEFAULT_PAGE_SIZES];
    this.update = debounce(this._update.bind(this));
    this.resourceName = this.element.dataset.resourcename;
    this.pageIndexKey = `${this.resourceName}-page-index`;
    this.pageSizeKey = `${this.resourceName}-page-size`;
    this.rows = Array.from(this.element.querySelectorAll("tbody > tr"));
    this.ranges = /* @__PURE__ */ new Map();
    if (this.element.tHead) {
      this.filterElements = [
        ...this.element.tHead.querySelectorAll("input,select")
      ];
      this.resetButton = this.element.tHead.querySelector("button[type=reset]");
    } else {
      this.filterElements = [];
    }
    this.colCount = Math.max(
      ...Array.from(this.element.querySelectorAll("tr")).map((r) => r.children.length)
    );
    this.noContentMessageElement = TR(TD(colSpan(this.colCount), "No content"));
    this.paginator = TD(colSpan(this.colCount), classList("multi"));
    this.columnIndices = /* @__PURE__ */ new Map();
    if (this.resetButton) {
      this.resetButton.addEventListener("click", () => {
        this.valueCache.clear();
        for (const element2 of this.filterElements) {
          this.deleteValue(element2);
          element2.value = "";
        }
        this.update();
      });
    }
    if (!this.element.tFoot) {
      this.element.tFoot = TFoot();
    }
    elementApply(
      this.element.tFoot,
      this.noContentMessageElement,
      ...this.element.tFoot.children,
      TR(this.paginator)
    );
    for (const f of this.filterElements) {
      const idx = getColumnIndex(f);
      this.columnIndices.set(f, idx);
      f.addEventListener("input", this.update.bind(null, f));
      this.restoreValue(f);
      if (isRangeStart(f) || isRangeEnd(f)) {
        if (!this.ranges.has(idx)) {
          this.ranges.set(idx, [null, null]);
        }
        const range = this.ranges.get(idx);
        const part = isRangeStart(f) ? 0 : 1;
        range[part] = f;
      }
    }
    for (const f of this.element.querySelectorAll("input")) {
      f.classList.add("form-control", "form-control-sm");
    }
    for (const f of this.element.querySelectorAll("select")) {
      f.classList.add("custom-select", "custom-select-sm");
    }
    this.pageIndex = parseFloat(localStorage.getItem(this.pageIndexKey) || "0");
    this.pageSize = parseFloat(localStorage.getItem(this.pageSizeKey) || "10");
    if (isDefined(this.element.dataset.pagesizes) && this.element.dataset.pagesizes.length > 0) {
      const sizes = this.element.dataset.pagesizes.split(",").map((v) => parseFloat(v.trim())).filter(identity);
      this.setPageSizes(sizes);
    } else {
      this.update();
    }
  }
  static create(options) {
    const headerRow = TR();
    const filterRow = TR();
    let burnHeader = 0;
    let burnFilter = 0;
    for (const column of options.columns) {
      let filterId = null;
      if (burnHeader > 0) {
        --burnHeader;
      } else {
        const header = Label(column.header);
        if (column.filter) {
          filterId = stringRandom(10);
          header.htmlFor = filterId;
        }
        const headerCell = TH(header);
        if (isDefined(column.headerColSpan)) {
          headerCell.colSpan = column.headerColSpan;
          burnHeader = column.headerColSpan - 1;
        }
        headerRow.appendChild(headerCell);
      }
      if (burnFilter > 0) {
        --burnFilter;
      } else if (column.filter) {
        const filter = column.filter;
        if (filterId) {
          filter.id = filterId;
        }
        if (column.header && filter instanceof HTMLInputElement) {
          filter.placeholder = "Filter by " + column.header;
        }
        const filterCell = TH(filter);
        if (isDefined(column.filterColSpan)) {
          filterCell.colSpan = column.filterColSpan;
          burnFilter = column.filterColSpan - 1;
        }
        filterRow.appendChild(filterCell);
      }
    }
    let lastColumn = getColumnIndex(headerRow.lastElementChild) - 1;
    while (getColumnIndex(filterRow.lastElementChild) < lastColumn) {
      filterRow.appendChild(TH());
    }
    filterRow.appendChild(TH(ButtonReset(classList("btn", "btn-secondary"), "Reset")));
    lastColumn = getColumnIndex(filterRow.lastElementChild);
    while (lastColumn > getColumnIndex(headerRow.lastElementChild)) {
      headerRow.appendChild(TH());
    }
    const table = new FilterableTable(Table(
      classList("table", "table-responsive", "table-hover", "table-striped", "summary"),
      customData("resourcename", options.resourceName),
      THead(
        headerRow,
        filterRow
      ),
      TBody()
    ));
    options.columns.forEach((c, i) => table.setCellMapper(i, c.getCellValue));
    table.setPageSizes(options.pageSizes || DEFAULT_PAGE_SIZES);
    return table;
  }
  get pageIndex() {
    return this._pageIndex;
  }
  set pageIndex(v) {
    this._pageIndex = v;
    localStorage.setItem(this.pageIndexKey, v.toString());
  }
  get pageSize() {
    return this._pageSize;
  }
  set pageSize(v) {
    this._pageSize = v;
    localStorage.setItem(this.pageSizeKey, v.toString());
  }
  setPageSizes(pageSizes) {
    if (isNullOrUndefined(pageSizes) || pageSizes.length === 0) {
      throw new Exception("Need at least one page size");
    }
    arrayReplace(this.pageSizes, 0, ...pageSizes);
    this.pageSize = this.pageSizes[1];
    this.update();
  }
  setCellMapper(columnIndex, mapper) {
    this.cellMappers.set(columnIndex, mapper);
  }
  clear() {
    arrayClear(this.rows);
    for (const body of this.element.tBodies) {
      elementClearChildren(body);
    }
    this._update();
  }
  setValues(...values) {
    const newRows = values.map((value) => {
      const row = TR();
      for (let i = 0; i < this.colCount; ++i) {
        const cell = TD();
        if (this.cellMappers.has(i)) {
          elementApply(cell, this.cellMappers.get(i)(value, row));
        }
        row.appendChild(cell);
      }
      this.rows.push(row);
      return row;
    });
    arrayReplace(this.rows, ...newRows);
    for (const body of this.element.tBodies) {
      elementClearChildren(body);
    }
    elementApply(
      this.contentRoot,
      ...this.rows
    );
    this._update();
  }
  select(sel) {
    let selectedIndex = null;
    for (let i = 0; i < this.rows.length; ++i) {
      const row = this.rows[i];
      const selected = row === sel;
      elementSetClass(row, selected, "selected");
      if (selected) {
        selectedIndex = i;
      }
    }
    if (selectedIndex !== null) {
      this.pageIndex = Math.floor(selectedIndex / this.pageSize) * this.pageSize;
      this.update();
    }
  }
  get noContentMessage() {
    return elementGetText(this.noContentMessageElement);
  }
  set noContentMessage(v) {
    elementSetText(this.noContentMessageElement, v);
  }
  get contentRoot() {
    return this.element.tBodies[0];
  }
  makeKey(filterElement) {
    return `yarrow:${this.resourceName}:${filterElement.id}`;
  }
  saveValue(filterElement, value) {
    const key = this.makeKey(filterElement);
    if (value) {
      localStorage.setItem(key, value.toString());
    } else {
      localStorage.removeItem(key);
    }
  }
  deleteValue(filterElement) {
    const key = this.makeKey(filterElement);
    localStorage.removeItem(key);
  }
  restoreValue(input) {
    const key = this.makeKey(input);
    const value = localStorage.getItem(key);
    if (!isDefined(value)) {
      input.value = "";
    } else if (input instanceof HTMLSelectElement) {
      input.value = value;
      this.valueCache.set(input, input.value);
    } else if (input.type.startsWith("date")) {
      const date = makeDate(value);
      input.valueAsDate = date;
      this.valueCache.set(input, date);
    } else if (input.type === "number" || input.type === "range") {
      const number = parseFloat(value);
      input.valueAsNumber = number;
      this.valueCache.set(input, number);
    } else {
      input.value = value;
      this.valueCache.set(input, input.value);
    }
  }
  isRange(filterElement) {
    const idx = getColumnIndex(filterElement);
    return this.ranges.has(idx);
  }
  _update(updatedElement = null) {
    if (isDefined(updatedElement)) {
      const value = parseValue(updatedElement, updatedElement.value);
      this.saveValue(updatedElement, value);
      if (value) {
        this.valueCache.set(updatedElement, value);
      } else {
        this.valueCache.delete(updatedElement);
      }
    }
    if (this.resetButton) {
      buttonSetEnabled(this.resetButton, this.valueCache.size > 0, "Reset", "Clear out filters");
      elementSetClass(this.resetButton, this.valueCache.size > 0, "btn-secondary");
      elementSetClass(this.resetButton, this.valueCache.size === 0, "btn-outline-secondary");
    }
    let showCount = 0;
    for (let r = 0; r < this.rows.length; ++r) {
      const row = this.rows[r];
      let showCell = true;
      for (let f = 0; f < this.filterElements.length && showCell; ++f) {
        const element = this.filterElements[f];
        const columnIndex = this.columnIndices.get(element);
        if (this.isRange(element)) {
          const [minFilterElement, maxFilterElement] = this.ranges.get(columnIndex);
          const minFilterValue = this.valueCache.get(minFilterElement);
          const maxFilterValue = this.valueCache.get(maxFilterElement);
          const cell = row.children[columnIndex];
          const cellValues = getCellValue(cell, minFilterElement);
          let matches = null;
          if (isDefined(minFilterValue) && isDefined(maxFilterValue)) {
            matches = cellValues.map((cellValue) => minFilterValue <= cellValue && cellValue <= maxFilterValue);
          } else if (isDefined(minFilterValue)) {
            matches = cellValues.map((cellValue) => minFilterValue <= cellValue);
          } else if (isDefined(maxFilterValue)) {
            matches = cellValues.map((cellValue) => cellValue <= maxFilterValue);
          }
          if (matches) {
            const match = matches.reduce((a, b) => a || b, false);
            showCell &&= match;
          }
        } else {
          const filterValue = this.valueCache.get(element);
          if (filterValue) {
            const cell = row.children[columnIndex];
            const cellValues = getCellValue(cell, element);
            const matches = cellValues.map((cellValue) => isNullOrUndefined(cellValue) ? true : isDate(cellValue) ? filterValue.getTime() === cellValue.getTime() : isNumber(cellValue) ? cellValue === filterValue : filterValue === "XXX_NONE_XXX" ? cellValue.length === 0 || cellValue === "NONE" : element.classList.contains("exact") ? cellValue.toLocaleLowerCase() === filterValue : cellValue.toLocaleLowerCase().indexOf(filterValue) > -1);
            const match = matches.reduce((a, b) => a || b, false);
            showCell &&= match;
          }
        }
      }
      if (showCell) {
        ++showCount;
      }
      row.style.display = showCell ? "" : "none";
    }
    const numPages = Math.ceil(showCount / this.pageSize);
    const lastPage = Math.max(0, numPages - 1);
    const curPage = Math.min(lastPage, Math.floor(this.pageIndex / this.pageSize));
    this.pageIndex = curPage * this.pageSize;
    const nextPage = Math.min(lastPage, curPage + 1);
    const prevPage = Math.max(0, curPage - 1);
    const minIndex = curPage * this.pageSize;
    const maxIndex = minIndex + this.pageSize;
    const filteredRows = this.rows.filter((r) => r.style.display !== "none");
    for (let i = 0; i < filteredRows.length; ++i) {
      if (i < minIndex || maxIndex <= i) {
        filteredRows[i].style.display = "none";
      }
    }
    this.noContentMessageElement.style.display = showCount === 0 ? "" : "none";
    elementClearChildren(this.paginator);
    const pageNumbers = [];
    const addPage = (page) => arraySortedInsert(pageNumbers, page, false);
    addPage(0);
    addPage(curPage);
    addPage(prevPage);
    addPage(nextPage);
    addPage(lastPage);
    const lastIndex = lastPage * this.pageSize;
    const prevPageIndex = Math.max(0, this.pageIndex - this.pageSize);
    const makeChunk = (text, enabled) => {
      let chunk;
      if (enabled) {
        chunk = ButtonSecondaryOutlineSmall(text);
      } else {
        chunk = Span(padding(px(5), px(10)), text);
      }
      this.paginator.append(chunk);
      return chunk;
    };
    const makePageIndexLink = (text, index) => {
      const enabled = 0 <= index && index <= lastIndex && index !== this.pageIndex;
      const link = makeChunk(text, enabled);
      if (enabled) {
        link.addEventListener("click", () => {
          this.pageIndex = index;
          this.update();
        });
      }
    };
    const makePageSizeLink = (size) => {
      const enabled = size !== this.pageSize;
      const link = makeChunk(size.toString(), enabled);
      if (enabled) {
        link.addEventListener("click", () => {
          this.pageSize = size;
          this.update();
        });
      }
    };
    makePageIndexLink("<", prevPageIndex);
    let last = -1;
    for (const pageNumber of pageNumbers) {
      const delta = pageNumber - last;
      last = pageNumber;
      if (delta > 1) {
        makeChunk("...", false);
      }
      makePageIndexLink((pageNumber + 1).toFixed(0), pageNumber * this.pageSize);
    }
    makePageIndexLink(">", maxIndex);
    makeChunk("|", false);
    makeChunk(`${showCount} filtered items of ${this.rows.length} results`, false);
    if (this.pageSizes.length > 2) {
      makeChunk("|", false);
      makeChunk("Items per page:", false);
      for (let i = 1; i < this.pageSizes.length; ++i) {
        if (this.rows.length > this.pageSizes[i - 1]) {
          makePageSizeLink(this.pageSizes[i]);
        }
      }
    }
  }
};

// src/dom-apps/resource-summary/index.ts
var tables = getElements("table.summary");
for (const table of tables) {
  new FilterableTable(table);
}
//# sourceMappingURL=index.js.map
