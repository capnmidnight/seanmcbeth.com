// src/dom-apps/settings-editor/index.ts
var tables = Array.from(document.querySelectorAll("table.summary"));
for (const table of tables) {
  const rows = Array.from(table.querySelectorAll("tr"));
  rows.shift();
  const firstRow = rows.shift();
  const values = firstRow.querySelectorAll("input");
  for (const row of rows) {
    const rowValues = row.querySelectorAll("input");
    const showWarning = (name) => row.querySelector(`span.${name}`).style.display = "block";
    for (const button of row.querySelectorAll("button[type=button]")) {
      const warningName = button.dataset.updatemessage;
      button.addEventListener("click", () => showWarning(warningName));
    }
    const changeForm = () => {
      for (let i = 0; i < values.length; ++i) {
        values[i].value = rowValues[i].value;
      }
    };
    for (const button of row.querySelectorAll("button[type=submit]")) {
      button.addEventListener("click", changeForm, true);
    }
  }
}
//# sourceMappingURL=index.js.map
