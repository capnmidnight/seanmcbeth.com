import { getElements } from "@juniper-lib/dom/tags";
import { FilterableTable } from "@juniper-lib/widgets/FilterableTable";

const tables = getElements<HTMLTableElement>("table.summary");
for (const table of tables) {
    new FilterableTable(table);
}