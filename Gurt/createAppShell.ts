import { AppShell } from "@juniper-lib/appshell";
import { createFetcher } from "./createFetcher";

const GLOBAL_APPSHELL_KEY = "JUNIPER::APPSHELL";

export function createAppShell() {
    if(GLOBAL_APPSHELL_KEY in window){
        return window[GLOBAL_APPSHELL_KEY] as AppShell;
    }

    const fetcher = createFetcher();
    const appShell = new AppShell(fetcher);

    appShell.setCloseButton(
        document.querySelector("#closeBtn")
    );

    Object.assign(window, {
        [GLOBAL_APPSHELL_KEY]: appShell
    });

    return appShell;
}
