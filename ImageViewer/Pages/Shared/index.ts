import { AppShell } from "@juniper-lib/appshell";
import { createFetcher } from "../../createFetcher";

const fetcher = createFetcher();
const appShell = new AppShell(fetcher);

appShell.setCloseButton(document.querySelector("#closeBtn"));

Object.assign(window, {
    fetcher,
    appShell
});