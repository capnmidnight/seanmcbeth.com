// src/isDebug.ts
var url = /* @__PURE__ */ new URL(globalThis.location.href);
var isDebug = !url.searchParams.has("RELEASE") || false;
var JS_EXT = isDebug ? ".js" : ".min.js";

// ../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/typeChecks.ts
function t(o, s, c) {
  return typeof o === s || o instanceof c;
}
function isString(obj) {
  return t(obj, "string", String);
}
function isArray(obj) {
  return obj instanceof Array;
}

// src/editor-app/ScriptLoader.ts
async function loadScripts(JS_EXT2, onProgressOrPath, ...paths) {
  let onProgress2 = null;
  if (isString(onProgressOrPath) || isArray(onProgressOrPath)) {
    paths.unshift(onProgressOrPath);
  } else {
    onProgress2 = onProgressOrPath;
  }
  function updateProg(msg) {
    if (onProgress2) {
      let soFar = 0;
      let total = 0;
      for (const script of scripts) {
        soFar += script.soFar;
        total += script.total;
      }
      onProgress2(soFar, total, msg);
    }
  }
  const scripts = paths.map((expr) => {
    let test = null;
    let path = null;
    if (isString(expr)) {
      path = expr;
    } else {
      path = expr[0];
      test = expr[1];
    }
    const isModule = !path.startsWith("$");
    path = isModule ? path : path.substr(1);
    path = `/js/${path}/index${JS_EXT2}`;
    return {
      prog: function(soFar, total) {
        this.soFar = soFar;
        this.total = total;
        updateProg(this.path);
      },
      path,
      test,
      soFar: 0,
      total: 0,
      result: null
    };
  });
  if (JS_EXT2 === ".min.js") {
    await Promise.all(scripts.map(loadScript));
  }
  for (const script of scripts) {
    await applyScript(script);
  }
  return scripts.map((script) => script.result).filter((v) => !!v);
}
async function loadScript(script) {
  script.path = await preloadFile(script.path, script.prog);
}
function preloadFile(path, prog) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.open("GET", path);
  if (prog) {
    xhr.onloadstart = () => prog(0, 0);
    xhr.onprogress = (evt) => prog(evt.loaded || 1, evt.total || 1);
  }
  return new Promise((resolve, reject) => {
    xhr.onloadend = () => resolve(URL.createObjectURL(xhr.response));
    xhr.onerror = () => reject(`(${xhr.status}) ${path}`);
    xhr.send();
  });
}
async function applyScript(script) {
  if (script.test) {
    const elem = document.createElement("script");
    elem.src = script.path;
    document.head.append(elem);
    await new Promise((resolve, reject) => {
      let tries = 0;
      const handle = setInterval(() => {
        ++tries;
        if (script.result = script.test()) {
          clearInterval(handle);
          resolve();
        } else if (tries > 3) {
          clearInterval(handle);
          reject("TIMEOUT");
        }
      }, 100);
    });
  } else {
    script.result = (await import(script.path)).default;
  }
}

// src/editor-app/index.ts
function onProgress(soFar, total, msg) {
  console.log(msg, (100 * soFar / (total || 1)).toFixed(1) + "%");
}
(async function() {
  const [_, loadEditor] = await loadScripts(
    JS_EXT,
    onProgress,
    ["three", () => globalThis.THREE],
    "editor"
  );
  await loadEditor();
})();
//# sourceMappingURL=index.js.map
