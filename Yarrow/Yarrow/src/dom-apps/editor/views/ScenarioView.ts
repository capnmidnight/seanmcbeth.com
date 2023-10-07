import { onClick } from "@juniper-lib/dom/dist/evts";
import { ButtonPrimary, HtmlRender, Run, buttonSetEnabled, elementClearChildren, elementSetClass, elementSetText } from "@juniper-lib/dom/dist/tags";
import { TypedEvent } from "@juniper-lib/events/dist/TypedEventTarget";
import { isDefined } from "@juniper-lib/tslib/dist/typeChecks";
import { EditableScenario } from "../EditableScenario";
import { BaseScenarioView } from "./BaseScenarioView";

export class LoadScenarioEvent extends TypedEvent<"loadscenario"> {
    constructor(public readonly scenarioID: number) {
        super("loadscenario");
    }
}

export class ForkScenarioEvent extends TypedEvent<"forkscenario"> {
    constructor(public readonly scenarioID: number) {
        super("forkscenario");
    }
}

export class PublishScenarioEvent extends TypedEvent<"publishscenario"> {
    constructor(public readonly scenarioID: number) {
        super("publishscenario");
    }
}

export class ScenarioView extends BaseScenarioView<{
    "loadscenario": LoadScenarioEvent;
    "forkscenario": ForkScenarioEvent;
    "publishscenario": PublishScenarioEvent;
}, EditableScenario> {

    private readonly nameBox: HTMLSpanElement;
    private readonly versionBox: HTMLSpanElement;
    private readonly isPublishedBox: HTMLSpanElement;
    private readonly latitudeBox: HTMLSpanElement;
    private readonly longitudeBox: HTMLSpanElement;
    private readonly zonesCountBox: HTMLSpanElement;
    private readonly stationsCountBox: HTMLSpanElement;
    private readonly voiceOversCountBox: HTMLSpanElement;
    private readonly videosCountBox: HTMLSpanElement;
    private readonly textsCountBox: HTMLSpanElement;
    private readonly signsCountBox: HTMLSpanElement;
    private readonly modelsCountBox: HTMLSpanElement;
    private readonly connectionsCountBox: HTMLSpanElement;
    private readonly editOrPublishButton: HTMLButtonElement;
    private readonly previousVersionsBox: HTMLDivElement;

    constructor() {
        super("Scenario");

        this.addProperties(
            ["Name", this.nameBox = Run()],
            ["Version", this.versionBox = Run()],
            ["Published", this.isPublishedBox = Run()],
            ["Latitude", this.latitudeBox = Run()],
            ["Longitude", this.longitudeBox = Run()],
            ["Zones", this.zonesCountBox = Run()],
            ["Stations", this.stationsCountBox = Run()],
            ["Voice overs", this.voiceOversCountBox = Run()],
            ["Videos", this.videosCountBox = Run()],
            ["Texts", this.textsCountBox = Run()],
            ["Signs", this.signsCountBox = Run()],
            ["3D Models", this.modelsCountBox = Run()],
            ["Connections", this.connectionsCountBox = Run()],
            ["", this.editOrPublishButton = ButtonPrimary(
                "",
                onClick(() => {
                    if (this.hasScenario) {
                        if (this.scenario.published) {
                            this.dispatchEvent(new ForkScenarioEvent(this.scenario.id));
                        }
                        else {
                            this.dispatchEvent(new PublishScenarioEvent(this.scenario.id));
                        }
                    }
                })
            )],
            ["Other versions", this.previousVersionsBox = Run()]
        );

        Object.seal(this);

        Object.assign(window, { scenarios: this });

        this.refresh();
    }

    protected onScenarioChanged(_oldScenario: EditableScenario) {
        const editAction =
            this.hasScenario
                ? this.scenario.published
                    ? "Create new version"
                    : "Publish"
                : "No scenario available";

        const isPublished = this.hasScenario && this.scenario.published;
        const isPublishable = this.hasScenario && !this.scenario.published;

        buttonSetEnabled(this.editOrPublishButton, this.hasScenario, editAction, editAction);
        elementSetClass(this.editOrPublishButton, isPublished, "btn-danger");
        elementSetClass(this.editOrPublishButton, isPublishable, "btn-primary");

        elementClearChildren(this.previousVersionsBox);

        if (this.hasScenario) {
            elementSetText(this.nameBox, this.scenario.name);
            elementSetText(this.versionBox, this.scenario.version.toFixed(0));
            elementSetText(this.isPublishedBox, this.scenario.published ? "Yes" : "No");
            HtmlRender(this.previousVersionsBox,
                ...this.scenario.versions
                    .filter(v => v.version !== this.scenario.version)
                    .map(v => ButtonPrimary(
                        `${v.version} (${v.published ? "Published" : "Not published"})`,
                        onClick(() => this.dispatchEvent(new LoadScenarioEvent(v.id))))));
        }
        else {
            elementSetText(this.nameBox, "N/A");
            elementSetText(this.versionBox, "N/A");
            elementSetText(this.isPublishedBox, "N/A");
        }

        if (this.previousVersionsBox.childElementCount === 0) {
            elementSetText(this.previousVersionsBox, "N/A");
        }
    }

    get value() {
        return this.scenario;
    }

    set value(v) {
        this.scenario = v;
    }

    get hasValue() {
        return this.hasScenario;
    }

    protected override onRefresh() {
        super.onRefresh();

        if (this.hasScenario) {
            elementSetText(this.zonesCountBox, this.value.zones.length.toFixed(0));
            elementSetText(this.stationsCountBox, this.value.stations.length.toFixed(0));
            elementSetText(this.voiceOversCountBox, this.value.audios.filter(v => !v.spatialize).length.toFixed(0));
            elementSetText(this.videosCountBox, this.value.videos.length.toFixed(0));
            elementSetText(this.textsCountBox, this.value.texts.length.toFixed(0));
            elementSetText(this.signsCountBox, this.value.signs.length.toFixed(0));
            elementSetText(this.modelsCountBox, this.value.models.length.toFixed(0));
            elementSetText(this.connectionsCountBox, (this.value.connections.length / 2).toFixed(0));

            if (isDefined(this.value.originLL)) {
                const [lat, lng] = this.value.originLL.toDMSArray(2);
                elementSetText(this.latitudeBox, lat);
                elementSetText(this.longitudeBox, lng);
            }
            else {
                elementSetText(this.latitudeBox, "???");
                elementSetText(this.longitudeBox, "???");
            }
        }
        else {
            elementSetText(this.zonesCountBox, "N/A");
            elementSetText(this.stationsCountBox, "N/A");
            elementSetText(this.voiceOversCountBox, "N/A");
            elementSetText(this.videosCountBox, "N/A");
            elementSetText(this.textsCountBox, "N/A");
            elementSetText(this.signsCountBox, "N/A");
            elementSetText(this.modelsCountBox, "N/A");
            elementSetText(this.connectionsCountBox, "N/A");
            elementSetText(this.latitudeBox, "N/A");
            elementSetText(this.longitudeBox, "N/A");
        }
    }
}