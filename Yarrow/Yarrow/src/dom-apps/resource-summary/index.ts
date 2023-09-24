import { getElements } from "@juniper-lib/dom/dist/tags";
import { FilterableTable } from "@juniper-lib/widgets/dist/FilterableTable";

const tables = getElements<HTMLTableElement>("table.summary");
for (const table of tables) {
    new FilterableTable(table);
}