// ../../Juniper/src/Juniper.TypeScript/@juniper-lib/tslib/dist/typeChecks.js
function t(o, s, c) {
  return typeof o === s || o instanceof c;
}
function isString(obj) {
  return t(obj, "string", String);
}

// src/dom-apps/confirm-button/index.ts
for (const button of document.querySelectorAll("button[type=button].confirm-button")) {
  const warningName = button.dataset.updatemessage;
  if (isString(warningName)) {
    button.addEventListener("click", function() {
      this.parentElement.querySelector(`span.${warningName}`).style.display = "block";
    });
  } else {
    button.addEventListener("click", function() {
      this.parentElement.style.display = "none";
    });
  }
}
//# sourceMappingURL=index.js.map
