import { JuniperAudioContext } from "@juniper-lib/audio/dist/context/JuniperAudioContext";
import { ID } from "@juniper-lib/dom/dist/attrs";
import { onClick } from "@juniper-lib/dom/dist/evts";
import { ButtonPrimary, Div, Form, HtmlRender, P } from "@juniper-lib/dom/dist/tags";
import { Audio_Mpeg, Audio_Webm, Image_Jpeg, Image_Png, Model_Gltf_Binary, Model_Gltf_Json, Video_Mpeg, Video_Webm } from "@juniper-lib/mediatypes/dist";
import { createFetcher } from "../../createFetcher";
import { FilePicker } from "../../file-picker/FilePicker";
import { Video_Vnd_Yarrow_YtDlp_Json } from "../../vr-apps/yarrow/data";

const fetcher = createFetcher(false);
const context = new JuniperAudioContext();
const picker = new FilePicker(fetcher, context);

async function logPickedFile() {
    if (await picker.showDialog()) {
        console.log(picker.selectedFile);
    }
    else {
        console.log("Cancelled");
    }
}

function Btn(label: string, callback: () => void): HTMLButtonElement {
    return ButtonPrimary(
        label,
        onClick(callback)
    );
};

HtmlRender("main", Form(
    Btn("No filter", () => {
        picker.setTags();
        picker.setTypeFilters();
        logPickedFile();
    }),

    Btn("Videos", () => {
        picker.setTags();
        picker.setTypeFilters(Video_Mpeg, Video_Webm, Video_Vnd_Yarrow_YtDlp_Json);
        logPickedFile();
    }),

    Btn("3D Models", () => {
        picker.setTags();
        picker.setTypeFilters(Model_Gltf_Binary, Model_Gltf_Json);
        logPickedFile();
    }),

    Btn("Images", () => {
        picker.setTags();
        picker.setTypeFilters(Image_Jpeg, Image_Png);
        logPickedFile();
    }),

    Btn("Audios", () => {
        picker.setTags();
        picker.setTypeFilters(Audio_Mpeg, Audio_Webm);
        logPickedFile();
    }),

    Btn("Ambient audios", () => {
        picker.setTags("nature", "ambient");
        picker.setTypeFilters(Audio_Mpeg, Audio_Webm);
        logPickedFile();
    }),

    Btn("Shouldn't be clickbable when picker is open", () =>
        alert("Whoops!")),

    Div(
        ID("lipsum"),
        P("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu pellentesque libero. Proin porta dictum porta. Proin placerat dignissim congue. Phasellus quis posuere metus. Sed eu augue nulla. Ut rhoncus nec ipsum et molestie. Quisque a libero quis nulla bibendum semper ullamcorper et ante. Mauris eget laoreet ante. Donec velit augue, ornare et eleifend condimentum, rhoncus ac tortor. Curabitur porta nisi vitae est venenatis, in ullamcorper libero faucibus. Donec sagittis accumsan ante at volutpat. Sed interdum lobortis tristique."),
        P("Mauris a congue ex. Vestibulum suscipit iaculis lacus non suscipit. Duis commodo tortor eu felis imperdiet, in congue urna tincidunt. Nulla mattis nisi vel magna egestas euismod. Quisque aliquet vestibulum lacus, sit amet posuere libero elementum facilisis. Nulla tempus leo ut lectus molestie finibus. In sit amet lacus vitae velit efficitur viverra ut sed urna."),
        P("Donec fringilla laoreet nisi. Proin cursus sem sit amet dui viverra feugiat. In eu diam mauris. Pellentesque sit amet dignissim erat. Sed tristique justo nec velit convallis, sit amet facilisis sem gravida. Sed commodo quam dolor, quis mollis mauris euismod ut. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed semper quis tellus vel consectetur. Nulla tempus vel sem eu maximus. Nulla eget nulla at enim cursus elementum. Morbi fermentum enim non lorem tempor, et dapibus dui mollis."),
        P("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel blandit nulla, commodo fringilla elit. Proin sodales blandit erat, pellentesque interdum nulla cursus id. Fusce id massa tortor. Duis odio felis, feugiat ac ipsum quis, interdum commodo sapien. Quisque non mi in enim ultricies viverra non sit amet quam. Nullam et lorem lectus. Praesent volutpat orci eu lacus dignissim, sed suscipit est vehicula. Maecenas id ipsum non libero viverra molestie sed aliquam mauris. Nullam aliquam, neque blandit pulvinar venenatis, nisi magna posuere sapien, non vehicula nisl tortor vitae tellus. Sed sed massa hendrerit, porttitor felis eu, ultricies felis. Phasellus enim orci, vehicula luctus eros eu, dictum vestibulum purus. Proin orci quam, semper feugiat felis in, feugiat volutpat massa. Suspendisse dapibus dolor vel aliquam condimentum. In et maximus enim."),
        P("Morbi viverra enim vitae semper ultricies. Nunc commodo, ipsum a elementum dictum, sem diam mattis elit, sit amet ullamcorper urna dolor et leo. Integer vel tellus aliquet, facilisis felis vitae, elementum velit. Aliquam eros turpis, feugiat non turpis nec, pharetra pulvinar orci. Quisque non tincidunt dolor. Mauris id nisi eu metus volutpat elementum. Phasellus at nisi interdum, vulputate lacus eu, bibendum metus.")
    )
));