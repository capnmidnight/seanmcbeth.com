import { ID, Query, Src } from "@juniper-lib/dom/attrs";
import { canvasToBlob, setContextSize } from "@juniper-lib/dom/canvas";
import { onClick, onDragOver, onDrop, onInput } from "@juniper-lib/dom/evts";
import "@juniper-lib/dom/fileSystemAPIPolyfill";
import { Button, Canvas, Form, Img, Input, Span, TextArea, buttonSetEnabled } from "@juniper-lib/dom/tags";
import { once } from "@juniper-lib/events/once";
import { Image_Jpeg, Image_Png, Image_SvgXml, MediaType } from "@juniper-lib/mediatypes";
import { centimeters2Inches, inches2Centimeters } from "@juniper-lib/tslib/units/length";
import { PropertyList } from "@juniper-lib/widgets/PropertyList";
import { LabelField, SelectList, SelectedValue, Values } from "@juniper-lib/widgets/SelectList";
import "@juniper-lib/widgets/TabPanel";
import "./index.css";
import { TabPanel, onTabSelected } from "@juniper-lib/widgets/TabPanel";

type UnitsSystem = "metric" | "us-customary";
const unitsLabels = new Map<UnitsSystem, string>([
    ["us-customary", "US Customary (in)"],
    ["metric", "Metric (cm)"]
]);
const unitsNames = Array.from(unitsLabels.keys());

const props = PropertyList.find()[0];
props.setGroupVisible("JPEG", false);

let image: HTMLImageElement = null;
const parser = new DOMParser();
const canvas = Canvas(Query("canvas"));
const g = canvas.getContext("2d");

type ImageType = "PNG" | "JPEG"

const typeSelector = TabPanel<ImageType>(
    ID("typeSelector"),
    onTabSelected<ImageType>(evt => {
        props.setGroupVisible("JPEG", evt.tabname === "JPEG");
        render();
    })
);

const exportButton = Button(
    ID("exportButton"),
    onClick(exportImage)
);

const resetButton = Button(
    ID("resetButton"),
    onClick(() => setImage(null))
);

const nameInput = Input(ID("nameInput"));
const sourceEditor = TextArea(
    ID("sourceEditor"),
    onInput(() => setImage(sourceEditor.value))
);

const resolutionLabel = Span(Query("label[for=resolutionInput]>.unit-specifier"));
const resolutionInput = Input(
    ID("resolutionInput"),
    onInput(render)
);

const clearColorSelect = Input(
    ID("clearColorSelect"),
    onInput(render)
);

const clearOpacityRange = Input(
    ID("clearOpacityRange"),
    onInput(render)
);

const maintainAspectRatioCheck = Input(ID("maintainAspectRatioCheck"));

const widthLabel = Span(Query("label[for=widthInput]>.unit-specifier"));
const widthInput = Input(
    ID("widthInput"),
    onInput(render)
);

const heightLabel = Span(Query("label[for=heightInput]>.unit-specifier"));
const heightInput = Input(
    ID("heightInput"),
    onInput(render)
);

const jpegQualityInput = Input(
    ID("jpegQualityInput"),
    onInput(render)
);

const units = SelectList<UnitsSystem>(
    ID("unitsSelect"),
    LabelField<UnitsSystem>(v => unitsLabels.get(v)),
    Values(unitsNames),
    SelectedValue<UnitsSystem>("us-customary"),
    onInput(() => {
        const isMetric = units.selectedValue === "metric";
        resolutionInput.placeholder
            = resolutionLabel.innerText
            = isMetric ? "pixels/cm" : "PPI";
        resolutionInput.title = "Image resolution in " + (isMetric ? "pixels per centimeter" : "pixels per inch");

        widthInput.placeholder
            = widthLabel.innerText
            = heightInput.placeholder
            = heightLabel.innerText
            = isMetric ? "cm" : "in";

        widthInput.title = "Image width in " + (isMetric ? "centimeters" : "inches");
        heightInput.title = "Image height in " + (isMetric ? "centimeters" : "inches");

        const converter = isMetric ? inches2Centimeters : centimeters2Inches;
        const convert = (v: number) => sigfig(converter(v));
        widthInput.valueAsNumber = convert(widthInput.valueAsNumber);
        heightInput.valueAsNumber = convert(heightInput.valueAsNumber);
        resolutionInput.valueAsNumber = Math.round(sigfig(1 / converter(1 / resolutionInput.valueAsNumber)));
        render();
    })
);

Form(Query("form"),
    onDragOver(evt =>
        evt.preventDefault()
    ),
    onDrop(evt => {
        evt.preventDefault();
        const [item] = evt.dataTransfer.items;
        const file = item && item.getAsFile();
        if (file && file.type === Image_SvgXml.value) {
            setImage(file);
        }
        else {
            alert("This file doesn't look like an SVG file.")
        }
    })
);

Button(
    ID("openButton"),
    onClick(async () => {
        try {
            const [fileHandle] = await showOpenFilePicker({
                multiple: false,
                types: [{
                    description: "Scalable Vector Graphics",
                    accept: Image_SvgXml.toFileSystemAPIAccepts()
                }]
            });

            await setImage(await fileHandle.getFile());
        }
        catch (exp) {
            if (!(exp instanceof DOMException)
                || exp.message !== "The user aborted a request.") {
                throw exp;
            }
        }
    })
);

render();

function parseSource() {
    const doc = parser.parseFromString(sourceEditor.value, "image/svg+xml");
    return doc.querySelector("svg");
}

async function setImage(fileOrString: File | string) {
    if (image) {
        URL.revokeObjectURL(image.src);
        image = null;
    }

    if (fileOrString) {
        let blob: Blob = null;

        if (fileOrString instanceof File) {
            blob = fileOrString;
            nameInput.value = MediaType.removeExtension(fileOrString.name);
            sourceEditor.value = await blob.text();
        }
        else {
            blob = new Blob([fileOrString], { type: Image_SvgXml.value })
        }

        image = Img(Src(URL.createObjectURL(blob)));

        await once(image, "load");

        const svg = parseSource();
        const isMetric = units.selectedValue === "metric";
        const svgUnits = isMetric ? SVGLength.SVG_LENGTHTYPE_CM : SVGLength.SVG_LENGTHTYPE_IN;

        svg.width.baseVal.convertToSpecifiedUnits(svgUnits)
        svg.height.baseVal.convertToSpecifiedUnits(svgUnits);

        resolutionInput.valueAsNumber = parseFloat(svg.getAttribute("inkscape:export-xdpi")) || 300;
        widthInput.valueAsNumber = sigfig(svg.width.baseVal.valueInSpecifiedUnits);
        heightInput.valueAsNumber = sigfig(svg.height.baseVal.valueInSpecifiedUnits);
    }

    if (!image) {
        nameInput.value = null;
        resolutionInput.value = null;
        widthInput.value = null;
        heightInput.value = null;
        sourceEditor.value = null;
    }

    const src = sourceEditor.value.trim();
    buttonSetEnabled(exportButton, "secondary", !!image);
    buttonSetEnabled(resetButton, "danger", !!image);
    nameInput.disabled
        = units.disabled
        = clearColorSelect.disabled
        = clearOpacityRange.disabled
        = resolutionInput.disabled
        = maintainAspectRatioCheck.disabled
        = widthInput.disabled
        = heightInput.disabled
        = typeSelector.disabled
        = jpegQualityInput.disabled
        = src.length === 0;

    render();
}

async function render(evt?: Event) {
    if (evt && maintainAspectRatioCheck.checked) {
        const aspectRatio = image.naturalWidth / image.naturalHeight;
        if (evt.target === widthInput) {
            heightInput.valueAsNumber = sigfig(widthInput.valueAsNumber / aspectRatio);
        }
        else if (evt.target === heightInput) {
            widthInput.valueAsNumber = sigfig(heightInput.valueAsNumber * aspectRatio);
        }
    }

    const width = widthInput.valueAsNumber || 1;
    const height = heightInput.valueAsNumber || 1;
    const resolution = resolutionInput.valueAsNumber || 100;
    const isMetric = units.selectedValue === "metric";
    const w = width + (isMetric ? "cm" : "in");
    const h = height + (isMetric ? "cm" : "in");
    let opacity = (255 * clearOpacityRange.valueAsNumber).toString(16);
    if (opacity.length === 1) {
        opacity = "0" + opacity;
    }

    setContextSize(g, width, height, resolution);
    canvas.style.width = w;
    canvas.style.height = h;

    g.clearRect(0, 0, canvas.width, canvas.height);
    g.fillStyle = clearColorSelect.value + opacity;
    g.fillRect(0, 0, canvas.width, canvas.height);
    if (image) {
        image.style.width = w;
        image.style.height = h;
        g.drawImage(image, 0, 0, canvas.width, canvas.height);
        if (typeSelector.isSelected("JPEG")) {
            const blob = await canvasToBlob(canvas, Image_Jpeg, jpegQualityInput.valueAsNumber);
            const url = URL.createObjectURL(blob);
            const img = Img(Src(url));
            await once(img, "load");
            g.clearRect(0, 0, canvas.width, canvas.height);
            g.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
        }
    }
}

async function exportImage() {
    try {
        const mediaType = typeSelector.isSelected("PNG") ? Image_Png : Image_Jpeg;
        let quality: number = null;
        if (mediaType === Image_Jpeg) {
            quality = jpegQualityInput.valueAsNumber;
        }

        const fileHandle = await showSaveFilePicker({
            suggestedName: nameInput.value,
            types: [{
                description: "Joint Photographic Expert Group",
                accept: mediaType.toFileSystemAPIAccepts()
            }]
        });
        const blob = await canvasToBlob(canvas, mediaType, quality);
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
    }
    catch (exp) {
        if (!(exp instanceof DOMException)
            || exp.message !== "The user aborted a request.") {
            throw exp;
        }
    }
}

function sigfig(value: number) {
    return 0.001 * Math.round(1000 * value);
}