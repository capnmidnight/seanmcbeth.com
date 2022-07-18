const url = /*@__PURE__*/ new URL(globalThis.location.href);
export const isDebug = /*@__PURE__*/ (DEBUG || url.searchParams.has("DEBUG")) && !url.searchParams.has("RELEASE");
export const JS_EXT = isDebug ? ".js" : ".min.js";