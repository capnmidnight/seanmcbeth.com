import { PriorityList } from "@juniper-lib/collections/dist/PriorityList";
import { TreeNode, buildTree } from "@juniper-lib/collections/dist/TreeNode";
import { makeLookup } from "@juniper-lib/collections/dist/makeLookup";
import { CanvasImageTypes } from "@juniper-lib/dom/dist/canvas";
import { HtmlRender } from "@juniper-lib/dom/dist/tags";
import { TypedEvent } from "@juniper-lib/events/dist/TypedEventTarget";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { IProgress } from "@juniper-lib/progress/dist/IProgress";
import { progressOfArray } from "@juniper-lib/progress/dist/progressOfArray";
import { progressSplitWeighted } from "@juniper-lib/progress/dist/progressSplit";
import { progressTasksWeighted } from "@juniper-lib/progress/dist/progressTasks";
import { cleanup } from "@juniper-lib/threejs/dist/cleanup";
import { Application, ApplicationEvents } from "@juniper-lib/threejs/dist/environment/Application";
import type { Environment } from "@juniper-lib/threejs/dist/environment/Environment";
import { Menu, MenuDescription, MenuItemDescription } from "@juniper-lib/threejs/dist/menu/Menu";
import { objGraph } from "@juniper-lib/threejs/dist/objects";
import { ButtonImageWidget } from "@juniper-lib/threejs/dist/widgets/ButtonImageWidget";
import { Image2D } from "@juniper-lib/threejs/dist/widgets/Image2D";
import { widgetSetEnabled } from "@juniper-lib/threejs/dist/widgets/widgets";
import { isDefined, isNullOrUndefined } from "@juniper-lib/tslib/dist/typeChecks";
import { dispose } from "@juniper-lib/tslib/dist/using";
import { MenuItemData } from "../yarrow/data";

type Node = TreeNode<MenuItemData>;

export class MainMenuSelectionEvent extends TypedEvent<"select">{
    constructor(public readonly scenarioID: number) {
        super("select");
    }
}

export class MainMenuLobbyEvent extends TypedEvent<"lobby">{
    constructor() {
        super("lobby");
    }
}

interface MainMenuEvents extends ApplicationEvents {
    select: MainMenuSelectionEvent;
    lobby: MainMenuLobbyEvent;
}

export class MainMenu extends Application<MainMenuEvents> {
    private readonly menu: Menu;
    private readonly node2MenuItem = new Map<Node, MenuItemDescription>();
    private readonly menuItem2Node = new Map<MenuItemDescription, Node>();
    private readonly images = new Map<string, CanvasImageTypes>();
    private readonly lobbyButton: ButtonImageWidget = null;

    private menuDesc: MenuDescription = null;
    private curMenu: Node = null;
    private menuRoot: Node = null;

    constructor(env: Environment) {
        super(env);


        this.lobbyButton = new ButtonImageWidget(this.env.uiButtons, "ui", "lobby");
        this.menu = new Menu(this.env);

        this.env.addScopedEventListener(this, "update", (evt) =>
            this.menu.update(evt.dt));

        this.env.addScopedEventListener(this, "dialogshowing", (evt) =>
            widgetSetEnabled(this.lobbyButton, !evt.showing));

        this.lobbyButton.addEventListener("click", () =>
            this.env.withConfirmation(
                "Confirm return to lobby",
                "Are you sure you want to return to the lobby?",
                () =>
                    this.dispatchEvent(new MainMenuLobbyEvent())));

        Object.seal(this);
    }

    override async init(params: Map<string, unknown>): Promise<void> {
        this.menuDesc = params.get("config") as MenuDescription;

        await super.init(params);
    }

    async load(prog?: IProgress) {
        await progressTasksWeighted(prog, [
            [5, prog => this.menu.load(this.menuDesc, prog)],
            [1, prog => this.loadMenuData(prog)]
        ]);

        objGraph(this.env.worldUISpace, this.menu);
        this.env.xrUI.addItem(this.lobbyButton, { x: 1, y: 1, scale: 0.5 });
        HtmlRender(this.env.screenUISpace.topRight, this.lobbyButton);
    }

    private async loadMenuData(prog?: IProgress): Promise<void> {
        this.destroyMenuItems();

        const menuItems = await this.env.fetcher
            .get("/vr/menu" + (location.search.includes("all") ? "/1" : ""))
            .progress(prog)
            .object<MenuItemData[]>()
            .then(unwrapResponse);

        for (const menuItem of menuItems) {
            if (isDefined(menuItem.audioElementCount)) {
                this.env.audio.preparePool(menuItem.audioElementCount);
            }
        }

        const organizations = Array.from(new Set(menuItems.map(m => m.organizationName)));
        const orgIds = new Map<string, number>();
        if (organizations.length > 1) {
            const topLevel = menuItems.filter(m => isNullOrUndefined(m.parentID));
            const topLevelLookup = new PriorityList<string, MenuItemData>();
            for (const m of topLevel) {
                topLevelLookup.add(m.organizationName, m);
            }

            for (let i = 0; i < organizations.length; ++i) {
                const label = organizations[i];
                const id = -(i + 1);
                const data: MenuItemData = {
                    id,
                    label,
                    order: i,
                    organizationName: label
                };
                orgIds.set(label, id);

                menuItems.push(data);
                for (const m of topLevelLookup.get(label)) {
                    m.parentID = id;
                }
            }
        }

        const map = makeLookup(menuItems, m => m.id);

        this.menuRoot = buildTree(
            menuItems,
            v => map.get(v.parentID),
            v => v && v.order || -1
        );

        for (const node of this.menuRoot.breadthFirst()) {
            const value = node.value;
            if (value !== null) {
                const item: MenuItemDescription = {
                    name: value.label,
                    filePath: value.filePath,
                    enabled: true
                };
                this.node2MenuItem.set(node, item);
                this.menuItem2Node.set(item, node);
            }
        }
    }

    private async loadMenuItems(parent: Node, prog?: IProgress) {
        const imageSet = Array.from(new Set(parent.children.map(m => m.value.filePath)))
            .filter(f => isDefined(f) && !this.images.has(f));

        await progressOfArray(
            prog,
            imageSet,
            async (f, prog) =>
                this.images.set(f, await this.env.fetcher
                    .get(f)
                    .progress(prog)
                    .image()
                    .then(unwrapResponse)));

        for (const child of parent.children) {
            const item = this.node2MenuItem.get(child);
            if (isNullOrUndefined(item.back)
                && this.images.has(item.filePath)) {
                const imgMesh = new Image2D(this.env, item.filePath + item.name, "none");
                imgMesh.setTextureMap(this.images.get(item.filePath));
                imgMesh.mesh.frustumCulled = false;
                item.back = imgMesh;
            }
        }
    }

    async showing(prog?: IProgress) {
        const selection = this.curMenu || this.menuRoot;
        await progressTasksWeighted(prog, [
            [10, async prog => {
                this.env.skybox.rotation = null;
                const image = await this.env.fetcher
                    .get("/vr/LandingPageImage")
                    .progress(prog)
                    .image()
                    .then(unwrapResponse);
                return this.env.skybox.setImage("/vr/LandingPageImage", image);
            }],
            [1, prog => this.showMenuSelection(selection, prog)]
        ]);
        this.menu.visible = true;
        this.lobbyButton.visible = false;
        this.join("lobby");
    }

    protected hiding() {
        this.menu.visible = false;
        this.lobbyButton.visible = true;
    }

    get visible() {
        return this.menu.visible;
    }

    dispose() {
        this.env.removeScope(this);
        this.env.worldUISpace.remove(this.menu);
        cleanup(this.menu);
        this.menu.removeFromParent();
        this.destroyMenuItems();
    }

    private destroyMenuItems() {
        for (const img of this.images.values()) {
            dispose(img);
        }

        this.images.clear();
        this.node2MenuItem.clear();
        this.menuItem2Node.clear();
    }

    private async showMenuSelection(selection: Node, prog?: IProgress) {
        this.curMenu = selection;
        const [imgProg, showProg] = progressSplitWeighted(prog, [10, 1]);
        await this.loadMenuItems(selection, imgProg);

        const menuItems = selection
            .children
            .map(child => this.node2MenuItem.get(child));

        const onBack = selection.isRoot
            ? null
            : () => this.selectMenuItem(selection.parent);

        let menuID = 0;
        let label = "Menu";

        if (selection.value) {
            menuID = selection.value.id;
            label = selection.value.label;
        }

        await this.menu.showMenu(
            menuID,
            label,
            menuItems,
            (item) => {
                const node = this.menuItem2Node.get(item);
                this.selectMenuItem(node);
            },
            onBack,
            showProg);
    }

    private async selectMenuItem(selection: Node, prog?: IProgress) {
        if (selection.isLeaf) {
            this.dispatchEvent(new MainMenuSelectionEvent(selection.value.scenarioID));
        }
        else {
            await this.showMenuSelection(selection, prog);
        }
    }
}
