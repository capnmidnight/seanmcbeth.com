import { JuniperAudioContext } from "@juniper-lib/audio/dist/context/JuniperAudioContext";
import { id } from "@juniper-lib/dom/dist/attrs";
import { em, minWidth } from "@juniper-lib/dom/dist/css";
import { Div, HtmlRender, getInput, getSelect } from "@juniper-lib/dom/dist/tags";
import { fileFolder, label } from "@juniper-lib/emoji/dist";
import { assertSuccess } from "@juniper-lib/fetcher/dist/assertSuccess";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { Application_JsonUTF8 } from "@juniper-lib/mediatypes/dist";
import { arrayScan } from "@juniper-lib/collections/dist/arrays";
import { makeLookup } from "@juniper-lib/collections/dist/makeLookup";
import { all } from "@juniper-lib/events/dist/all";
import { Task } from "@juniper-lib/events/dist/Task";
import { alwaysTrue } from "@juniper-lib/tslib/dist/identity";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/dist/typeChecks";
import { TreeView, TreeViewOptions } from "@juniper-lib/widgets/dist/TreeView";
import { createFetcher } from "../../createFetcher";
import { MenuItemData, ScenarioGroupData } from "../../vr-apps/yarrow/data";
import { MenuItemView } from "./MenuItemView";

import "./style.css";

const saveTask = new Task();
let saveTimer: number = null;
let menuItems: Map<number, MenuItemData>;
const toSave = new Map<number, MenuItemData>();

const selectedMenuItemIDField = getInput("#selectedMenuItemID");
const fetcher = createFetcher();
const context = new JuniperAudioContext();
const itemView = new MenuItemView(fetcher, context);
const isAction = (v: MenuItemData) => isDefined(v)
    && (isDefined(v.scenarioGroupID)
        || isDefined(v.scenarioID));
const isSubMenu = (v: MenuItemData) => isDefined(v)
    && isNullOrUndefined(v.scenarioGroupID)
    && isNullOrUndefined(v.scenarioID);
const orgIdInput = getInput("#orgId");
const orgSelector = getSelect("#organizations");

const treeViewOptions: TreeViewOptions<MenuItemData> = {
    showNameFilter: true,
    defaultLabel: "Menu",
    getParent: (v) => menuItems.get(v.parentID),
    getOrder: (v) => v.order,
    getLabel: (v) => {
        if (isAction(v)) {
            return label.emojiStyle + v.label.replace(/\s+/g, ' ').trim();
        }
        else if (isSubMenu(v)) {
            return fileFolder.emojiStyle + v.label.replace(/\s+/g, ' ').trim();
        }
        else {
            return "Menu";
        }
    },
    getDescription: (v) =>
        isAction(v) && "scenario"
        || "sub menu",
    getChildDescription: () =>
        "item",
    canHaveChildren: node =>
        node.isRoot || isSubMenu(node.value),
    canReorder: alwaysTrue
};


if (orgSelector) {
    treeViewOptions.additionalProperties = [["Organization", orgSelector]];
    orgIdInput.value = orgSelector.value;
    orgSelector.addEventListener("input", () => {
        orgIdInput.value = orgSelector.value;
        getMenu();
    });
}

const treeView = new TreeView<MenuItemData>(
    treeViewOptions,
    minWidth(em(20))
);


HtmlRender(
    "#menuForm",
    Div(
        id("menuEditor"),
        treeView,
        itemView
    )
);


treeView.addEventListener("select", (evt) => {
    if (evt.node && evt.node.value) {
        itemView.node = evt.node;
        itemView.enabled = true;
    }
    else {
        itemView.node = null;
        itemView.enabled = false;
    }
});


treeView.addEventListener("add", async (evt) => {
    const menuItem = await createMenuItem(evt.parent.node.value);
    evt.parent.add(menuItem);
    treeView.selectedValue = menuItem;
    itemView.node = treeView.selectedNode;
    itemView.enabled = true;
    if (evt.parent.node.isChild) {
        await clearAction(evt.parent.node.value);
    }
});

treeView.addEventListener("moved", async (evt) => {
    evt.node.value.order = evt.newIndex;
    await saveMenuItem(evt.node.value);
});

treeView.addEventListener("reparented", async (evt) => {
    if (evt.newParent.isRoot) {
        evt.node.value.parentID = null;
    }
    else {
        evt.node.value.parentID = evt.newParent.value.id;
        clearAction(evt.newParent.value);
    }

    await saveMenuItem(evt.node.value);
});


itemView.addEventListener("update", async (evt) => {
    treeView.updateNode(evt.node);
    await saveMenuItem(evt.node.value);
});

itemView.addEventListener("delete", async (evt) => {
    await deleteMenuItem(evt.node.value);
    treeView.removeNode(evt.node);
});

getMenu();

async function getMenu() {
    itemView.node = null;

    const [menuValues, scenarios] = await all(
        fetcher
            .get("/Editor/Menu")
            .query("orgId", orgIdInput.value)
            .object<MenuItemData[]>()
            .then(unwrapResponse),
        fetcher
            .get("/Editor/Scenarios")
            .query("orgId", orgIdInput.value)
            .object<ScenarioGroupData[]>()
            .then(unwrapResponse)
    );

    itemView.setScenarios(scenarios);

    menuItems = makeLookup(menuValues, v => v.id);
    treeView.values = menuValues;
    if (selectedMenuItemIDField.value.length > 0) {
        const selectedMenuItemID = parseFloat(selectedMenuItemIDField.value);
        const selectedMenuItem = arrayScan(menuValues, v => v.id === selectedMenuItemID);
        treeView.selectedValue = selectedMenuItem;
        itemView.node = treeView.selectedNode;
    }
}

async function createMenuItem(parent: MenuItemData): Promise<MenuItemData> {
    const parentID = parent && parent.id && parent.id.toFixed(0) || null;
    const form = new FormData();
    form.append("organizationID", orgIdInput.value);
    form.append("parentID", parentID);
    const value = await fetcher
        .post("/Editor/Menu")
        .query("handler", "Create")
        .body(form)
        .object<MenuItemData>()
        .then(unwrapResponse);
    menuItems.set(value.id, value);
    return value;
}

async function clearAction(item: MenuItemData): Promise<void> {
    if (item.scenarioGroupID !== null
        || item.scenarioID !== null) {
        item.scenarioGroupID = null;
        item.scenarioID = null;
        await saveMenuItem(item);
    }
}

function saveMenuItem(item: MenuItemData): Promise<void> {
    toSave.set(item.id, item);

    if (saveTimer) {
        clearTimeout(saveTimer);
    }

    saveTimer = setTimeout(async () => {
        if (toSave.size > 0) {
            const items = Array.from(toSave.values());

            try {
                await fetcher
                    .post("/Editor/Menu")
                    .query("handler", "Update")
                    .body(items, Application_JsonUTF8)
                    .exec()
                    .then(assertSuccess);

                toSave.clear();
                saveTask.resolve();
            }
            catch (exp) {
                saveTask.reject(exp);
            }
        }
        itemView.refresh();
    }, 250) as any;

    return saveTask;
}

async function deleteMenuItem(item: MenuItemData) {
    if (isDefined(item)) {
        menuItems.delete(item.id);
        toSave.delete(item.id);
        await fetcher
            .post("/Editor/Menu")
            .query("handler", "Delete")
            .body(item.id, Application_JsonUTF8)
            .exec()
            .then(assertSuccess);
    }
    itemView.refresh();
}