const tables = Array.from(document.querySelectorAll("table.summary"));
for (const table of tables) {
    const rows = Array.from(table.querySelectorAll("tr"));
    rows.shift();
    const firstRow = rows.shift();
    const values = firstRow.querySelectorAll<HTMLInputElement>("input");
    for (const row of rows) {
        const rowValues = row.querySelectorAll<HTMLInputElement>("input");
        const showWarning = (name: string) =>
            row.querySelector<HTMLElement>(`span.${name}`).style.display = "block";
        for (const button of row.querySelectorAll<HTMLButtonElement>("button[type=button]")) {
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