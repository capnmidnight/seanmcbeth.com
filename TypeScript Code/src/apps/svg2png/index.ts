import { Accept, ID, Query, Src, Target } from "@juniper-lib/dom/attrs";
import { canvasToBlob, setContextSize } from "@juniper-lib/dom/canvas";
import { onClick, onDragOver, onDrop, onInput } from "@juniper-lib/dom/evts";
import { A, Button, Canvas, Form, Img, InputFile, InputNumber, InputText, Span, TextArea, buttonSetEnabled } from "@juniper-lib/dom/tags";
import { once } from "@juniper-lib/events/once";
import { Image_Png, Image_SvgXml, MediaType } from "@juniper-lib/mediatypes";
import { centimeters2Inches, inches2Centimeters } from "@juniper-lib/tslib/units/length";
import { PropertyList } from "@juniper-lib/widgets/PropertyList";
import { LabelField, SelectList, SelectedValue, Values } from "@juniper-lib/widgets/SelectList";
import "./index.css";
import { identity } from "@juniper-lib/tslib/identity";

type UnitsSystem = "metric" | "us-customary";
const unitsLabels = new Map<UnitsSystem, string>([
    ["us-customary", "US Customary (in)"],
    ["metric", "Metric (cm)"]
]);
const unitsNames = Array.from(unitsLabels.keys());

PropertyList.find();

const canvas = Canvas(Query("canvas"));
const g = canvas.getContext("2d");

const onSetSize = onInput(() =>
    render(
        widthInput.valueAsNumber,
        heightInput.valueAsNumber,
        resolutionInput.valueAsNumber
    )
);

const nameInput = InputText(ID("nameInput"));
const sourceEditor = TextArea(
    ID("sourceEditor"),
    onInput(() => setImage(sourceEditor.value))
);

const resolutionLabel = Span(Query("label[for=resolutionInput]>.unit-specifier"));
const resolutionInput = InputNumber(
    ID("resolutionInput"),
    onSetSize
);

const widthLabel = Span(Query("label[for=widthInput]>.unit-specifier"));
const widthInput = InputNumber(
    ID("widthInput"),
    onSetSize
);

const heightLabel = Span(Query("label[for=heightInput]>.unit-specifier"));
const heightInput = InputNumber(
    ID("heightInput"),
    onSetSize
);

Form(Query("form"),
    onDragOver(evt => evt.preventDefault()),
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

function sigfig(value: number) {
    return 0.001 * Math.round(1000 * value);
}


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
    }),
    onSetSize
);

let image: HTMLImageElement = null;

if (!("showOpenFilePicker" in globalThis)) {
    const fileInput = InputFile(
        Accept(Image_SvgXml.value)
    );

    const anchor = A(Target("_blank"));

    Object.assign(globalThis, {
        async showOpenFilePicker(options?: OpenFilePickerOptions) {
            fileInput.multiple = options && options.multiple;
            if (options && options.types) {
                fileInput.accept = options
                    .types
                    .filter(v => v.accept)
                    .flatMap(v => Object.keys(v.accept))
                    .join(",");
            }
            const task = once(fileInput, "input", "cancel")
                .catch(() => {
                    throw new DOMException("The user aborted a request.");
                });
            fileInput.click();

            await task;

            return Array.from(fileInput.files)
                .map(file => {
                    return {
                        getFile() {
                            return Promise.resolve(file);
                        }
                    };
                })
        },

        async showSaveFilePicker(options?: SaveFilePickerOptions) {
            anchor.download = options && options.suggestedName || null;
            let blobParts = new Array<BlobPart>();
            return {
                async createWritable() {
                    return {
                        async write(blob: Blob) {
                            blobParts.push(blob);
                            return Promise.resolve();
                        },
                        async close() {
                            const types = options
                                && options.types
                                && options.types.filter(v => v.accept)
                                    .flatMap(v => Object.keys(v.accept))
                                    .filter(identity);
                            const type = types && types.length > 0 && types[0] || null;
                            const blob = new Blob(blobParts, { type });
                            const url = URL.createObjectURL(blob);
                            anchor.href = url;
                            const task = once(anchor, "click");
                            anchor.click();
                            await task;
                        }
                    }
                }
            }
        }
    });
}

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

const exportPNGButton = Button(
    ID("exportPNGButton"),
    onClick(async () => {
        try {
            const fileHandle = await showSaveFilePicker({
                suggestedName: nameInput.value,
                types: [{
                    description: "Portable Network Graphics",
                    accept: Image_Png.toFileSystemAPIAccepts()
                }]
            });
            const blob = await canvasToBlob(canvas, Image_Png);
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
    })
);

const resetButton = Button(
    ID("resetButton"),
    onClick(() => setImage(null))
);

const parser = new DOMParser();
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
    buttonSetEnabled(exportPNGButton, "primary", !!image);
    buttonSetEnabled(resetButton, "danger", !!image);
    nameInput.disabled
        = units.disabled
        = resolutionInput.disabled
        = widthInput.disabled
        = heightInput.disabled
        = src.length === 0;

    onSetSize.callback(null);
}

function render(width: number, height: number, resolution: number) {
    const isMetric = units.selectedValue === "metric";
    const w = width + (isMetric ? "cm" : "in");
    const h = height + (isMetric ? "cm" : "in");

    setContextSize(g, width || 1, height || 1, resolution || 1);
    canvas.style.width = w;
    canvas.style.height = h;

    g.clearRect(0, 0, canvas.width, canvas.height);
    if (image) {
        g.drawImage(image, 0, 0, canvas.width, canvas.height);
        image.style.width = w;
        image.style.height = h;
    }
}

onSetSize.callback(null);