import { JuniperAudioContext } from "@juniper-lib/audio/dist/context/JuniperAudioContext";
import { TreeNode } from "@juniper-lib/collections/dist/TreeNode";
import { AutoComplete, ClassList, ClassName, CustomData, PlaceHolder, Title_attr, Value, Wrap } from "@juniper-lib/dom/dist/attrs";
import { resizeContext } from "@juniper-lib/dom/dist/canvas";
import { px } from "@juniper-lib/dom/dist/css";
import { onClick, onInput } from "@juniper-lib/dom/dist/evts";
import { loadFont } from "@juniper-lib/dom/dist/fonts";
import {
    ButtonDanger,
    ButtonPrimary,
    Canvas, Div,
    Em,
    H2,
    Img, InputText, Option,
    Select, TextArea,
    buttonSetEnabled,
    elementSetClass,
    elementSetDisplay,
    elementSetText
} from "@juniper-lib/dom/dist/tags";
import { lightBulb, warning } from "@juniper-lib/emoji/dist";
import { TypedEvent } from "@juniper-lib/events/dist/TypedEventTarget";
import type { IFetcher } from "@juniper-lib/fetcher/dist/IFetcher";
import { unwrapResponse } from "@juniper-lib/fetcher/dist/unwrapResponse";
import { TextImage } from "@juniper-lib/graphics2d/dist/TextImage";
import { Image_Jpeg, Image_Png } from "@juniper-lib/mediatypes/dist";
import { stringRandom } from "@juniper-lib/tslib/dist/strings/stringRandom";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import { formatBytes } from "@juniper-lib/tslib/dist/units/fileSize";
import { FilterableTable } from "@juniper-lib/widgets/dist/FilterableTable";
import { PropertyList, group } from "@juniper-lib/widgets/dist/PropertyList";
import { FilePicker } from "../../file-picker/FilePicker";
import { menu } from "../../settings";
import { MenuItemData, ScenarioGroupData } from "../../vr-apps/yarrow/data";
import { BaseEditorView } from "../editor/views/BaseEditorView";

abstract class MenuItemViewEvent<T extends string> extends TypedEvent<T> {
    constructor(public readonly node: TreeNode<MenuItemData>, type: T) {
        super(type);
    }
}

export class MenuItemViewUpdateEvent extends MenuItemViewEvent<"update">
{
    constructor(node: TreeNode<MenuItemData>) {
        super(node, "update");
    }
}

export class MenuItemViewDeleteEvent extends MenuItemViewEvent<"delete"> {
    constructor(node: TreeNode<MenuItemData>) {
        super(node, "delete");
    }
}

type MenuItemViewEvents = {
    update: MenuItemViewUpdateEvent;
    delete: MenuItemViewDeleteEvent;
};

const MIN_IMAGE_WIDTH = 512;
const MIN_IMAGE_HEIGHT = 1024;

export class MenuItemView
    extends BaseEditorView<MenuItemViewEvents> {

    private readonly fileUpload: FilePicker;
    private readonly pickFileButton: HTMLButtonElement;
    private readonly deleter: HTMLButtonElement;
    private readonly fields: PropertyList;
    private readonly labelField: HTMLTextAreaElement;
    private readonly actionTypeID: string;
    private readonly actionType: HTMLSelectElement;
    private readonly scenarioListID: string;
    private readonly fileNameField: HTMLElement;
    private readonly image: HTMLImageElement;
    private readonly previewCanvas: HTMLCanvasElement;
    private readonly previewContext: CanvasRenderingContext2D;
    private readonly textImage: TextImage;
    private readonly aspectWarning: HTMLDivElement;
    private readonly resolutionWarning: HTMLDivElement;
    private readonly scenarioIDsToRows = new Map<number, HTMLTableRowElement>();

    private _node: TreeNode<MenuItemData> = null;
    private readonly scenariosTable: FilterableTable<ScenarioGroupData>;
    private lastImagePath: string = "";

    constructor(private readonly fetcher: IFetcher, audioSys: JuniperAudioContext) {
        super();

        const onEnabledClick = (act: () => void) =>
            onClick((evt: Event) => {
                if (this.hasNode) {
                    evt.preventDefault();
                    act();
                }
            });

        this.fileUpload = new FilePicker(this.fetcher, audioSys);
        this.fileUpload.setTypeFilters(Image_Png, Image_Jpeg);
        this.fileUpload.setTags("ui");

        this._element = Div(

            ClassName("menu-item-view"),

            Div(
                ClassName("controls"),

                this.deleter = ButtonDanger(
                    Title_attr("Delete menu item"),
                    onEnabledClick(() => {
                        this.deleter.disabled = true;
                        this.dispatchEvent(new MenuItemViewDeleteEvent(this.node));
                    }),
                    "Delete"
                )
            ),

            this.fields = PropertyList.create(
                H2("Properties"),

                ["Label",
                    this.labelField = TextArea(
                        PlaceHolder("Enter label"),
                        ClassList("form-control"),
                        Wrap("soft"),
                        AutoComplete("off"),
                        CustomData("lpignore", "true"),
                        onInput(() => {
                            if (this.hasNode) {
                                this.node.value.label = this.labelField.value;
                                this.onUpdate();
                            }
                        })
                    )
                ],

                ["",

                    Div(ClassName("alert alert-info"),
                        lightBulb.emojiStyle,
                        " ",
                        Em(`Upload PNG or JPEG files, ${px(MIN_IMAGE_WIDTH)} wide by ${px(MIN_IMAGE_HEIGHT)} tall.`)
                    ),

                    this.aspectWarning = Div(ClassName("alert alert-warning"),
                        warning.emojiStyle,
                        " ",
                        Em("Images should be twice as tall as they are wide. This image will be distorted in the menu.")
                    ),

                    this.resolutionWarning = Div(ClassName("alert alert-warning"),
                        warning.emojiStyle,
                        " ",
                        Em(`Images should be ${px(MIN_IMAGE_WIDTH)} wide by ${px(MIN_IMAGE_HEIGHT)} tall. This image will be blurry in the menu.`)
                    ),

                    this.pickFileButton = ButtonPrimary(
                        onClick(async () => {
                            if (this.hasNode && await this.fileUpload.showDialog()) {
                                const file = this.fileUpload.selectedFile;
                                this.node.value.fileID = file.id;
                                this.node.value.filePath = file.filePath;
                                this.node.value.fileName = file.name;
                                this.node.value.fileSize = file.size;
                                this.node.value.fileType = file.mediaType;
                                this.onUpdate();
                            }
                        })
                    ),

                    this.fileNameField = Div("file name field")
                ],

                group(this.actionTypeID = "actionType" + stringRandom(8),
                    ["Action type",
                        this.actionType = Select(
                            ClassList("custom-select", "custom-select-sm"),
                            Option("NONE", Value("")),
                            Option("Start scenario", Value("yarrow")),
                            onInput(() => {
                                if (this.hasNode
                                    && this.actionType.value !== "yarrow"
                                    && isDefined(this.node.value.scenarioGroupID)) {
                                    this.node.value.scenarioGroupID = null;
                                    this.node.value.scenarioID = null;
                                    this.onUpdate();
                                }
                                else {
                                    this.refresh();
                                }
                            })
                        )
                    ]
                ),

                group(this.scenarioListID = "scenarioList" + stringRandom(8),
                    ["Scenario",

                        this.scenariosTable = FilterableTable.create<ScenarioGroupData>({
                            resourceName: "scenario-picker",
                            pageSizes: [5, 10, 20],
                            columns: [{
                                header: "Language",
                                filter: InputText(),
                                getCellValue: (value: ScenarioGroupData) =>
                                    value.languageName
                            }, {
                                header: "Name",
                                filter: InputText(),
                                getCellValue: (value: ScenarioGroupData) =>
                                    value.name
                            }, {
                                header: "Version",
                                getCellValue: (value: ScenarioGroupData) =>
                                    value.latestVersion && value.latestVersion.version || "--"
                            }, {
                                getCellValue: (value: ScenarioGroupData, row: HTMLTableRowElement) => {
                                    this.scenarioIDsToRows.set(value.id, row);
                                    return ButtonPrimary("Select", onClick(() => {
                                        this.scenariosTable.select(row);
                                        this.node.value.label = value.name;
                                        this.node.value.scenarioGroupID = value.id;
                                        this.node.value.scenarioID = value.latestVersion && value.latestVersion.id || null;
                                        this.onUpdate();
                                    }));
                                }
                            }]
                        })])
            ),

            Div(
                ClassName("preview"),
                H2("Preview"),
                this.previewCanvas = Canvas()
            )
        );

        this.image = Img(Title_attr("Menu item image"))

        this.previewContext = this.previewCanvas.getContext("2d");

        this.textImage = new TextImage({
            textFillColor: "white",
            textDirection: "horizontal",
            padding: {
                top: 0.025,
                right: 0.05,
                bottom: 0.025,
                left: 0.05
            },
            scale: 400,
            fontFamily: menu.font.fontFamily,
            fontSize: menu.font.fontSize,
            fontWeight: menu.font.fontWeight,
            maxWidth: 0.5,
            maxHeight: 1
        });

        this.load();
    }

    private async load(): Promise<void> {
        this.enabled = false;
        await loadFont(menu.font);
        this.enabled = true;
    }

    setScenarios(scenarios: ScenarioGroupData[]) {
        this.scenarioIDsToRows.clear();
        this.scenariosTable.setValues(...scenarios);
    }

    private onUpdate(): void {
        this.dispatchEvent(new MenuItemViewUpdateEvent(this.node));
        this.refresh();
    }

    get node(): TreeNode<MenuItemData> {
        return this._node;
    }

    set node(v: TreeNode<MenuItemData>) {
        if (v !== this.node) {
            this.scenariosTable.select(null);
            this._node = v;
            if (this.node && this.node.value && (this.node.value.scenarioGroupID || this.node.value.scenarioID)) {
                this.actionType.value = "yarrow";
                this.scenariosTable.select(this.scenarioIDsToRows.get(this.node.value.scenarioGroupID));
            }
            else {
                this.actionType.value = "";
                this.scenariosTable.select(null);
            }
            this.refresh();
        }
    }

    private get hasNode(): boolean {
        return isDefined(this.node);
    }

    protected onRefresh() {

        let fileName: string = null;
        let fileType = "N/A";
        let formattedFileSize: string = null;
        let imagePath: string = null;

        if (this.hasNode) {
            const value = this.node.value;
            this.deleter.disabled = !this.enabled || this.node.hasChildren;

            this.labelField.value = value.label || "";

            this.fields.setGroupVisible(this.actionTypeID, this.node.isLeaf);
            this.fields.setGroupVisible(this.scenarioListID, this.actionType.value.length > 0);

            fileName = value.fileName;
            fileType = value.fileType;
            formattedFileSize = formatBytes(value.fileSize);

            imagePath = value.filePath;

            this.labelField.disabled
                = this.actionType.disabled
                = !this.enabled;

        }
        else {
            this.labelField.value = "";

            this.fields.setGroupVisible(this.actionTypeID, false);
            this.fields.setGroupVisible(this.scenarioListID, false);

            this.labelField.disabled
                = this.actionType.disabled
                = this.deleter.disabled
                = true;
        }

        const hasFileName = isDefined(fileName);

        elementSetClass(this.pickFileButton, hasFileName, "btn-danger");
        elementSetClass(this.pickFileButton, !hasFileName, "btn-primary");

        buttonSetEnabled(
            this.pickFileButton,
            this.enabled && this.hasNode,
            hasFileName ? "Replace image" : "Select image",
            hasFileName ? "Replace the current image with a new one" : "Select an image to upload"
        );

        if (imagePath !== this.lastImagePath) {
            elementSetDisplay(this.aspectWarning, false);
            elementSetDisplay(this.resolutionWarning, false);
            elementSetDisplay(this.image, hasFileName);
            this.image.src = "";
            if (imagePath) {
                requestAnimationFrame(() => this.image.src = imagePath);
            }
            this.lastImagePath = imagePath;
        }

        this.drawPreview(fileName, fileType, formattedFileSize);
    }

    private async drawPreview(fileName: string, fileType: string, formattedFileSize: string) {
        resizeContext(this.previewContext, devicePixelRatio);
        const { width, height } = this.previewCanvas;
        this.previewContext.clearRect(0, 0, width, height);
        if (this.hasNode) {
            const img = await this.fetcher
                .get(this.lastImagePath || menu.images.defaultButton)
                .image()
                .then(unwrapResponse);
            const aspectRatio = img.height / img.width;
            const alpha = Math.abs(2 - aspectRatio);

            this.previewContext.drawImage(
                img,
                0, 0, img.width, img.height,
                0, 0, width, height);

            this.textImage.scale = height;
            this.textImage.value = this.labelField.value;

            const x = (width - this.textImage.imageWidth) / 2;
            const y = height * 0.975 - this.textImage.imageHeight;

            this.previewContext.drawImage(
                this.textImage.canvas,
                x, y, this.textImage.imageWidth, this.textImage.imageHeight);

            elementSetDisplay(this.aspectWarning, alpha > 0.01);
            elementSetDisplay(this.resolutionWarning, img.width < MIN_IMAGE_WIDTH);

            if (isDefined(fileName)) {
                fileName = `${fileName} (${fileType}) (${formattedFileSize}) ${px(img.width)} x ${px(img.height)}`;
            }
            else {
                fileName = "No file selected. Default image will be used (see Preview).";
            }
        }

        elementSetText(this.fileNameField, fileName);
    }
}
