declare const DEBUG: boolean;
const url = /*@__PURE__*/ new URL(globalThis.location.href);
export const isDebug = /*@__PURE__*/
    DEBUG && !url.searchParams.has("RELEASE")
    || !DEBUG && url.searchParams.has("DEBUG");
export const JS_EXT = isDebug ? ".js" : ".min.js";
export const CSS_EXT = isDebug ? ".css" : ".min.css";