/* eslint-disable no-inner-declarations */

import { buttonSetEnabled, elementSetDisplay, elementSetText, getButton, getCanvas, getElement, getInput } from "@juniper-lib/dom/tags";
import { assertSuccess } from "@juniper-lib/fetcher/assertSuccess";
import { unwrapResponse } from "@juniper-lib/fetcher/unwrapResponse";
import { getUserNumber, hasUserNumber } from "@juniper-lib/testing/userNumber";
import type { BaseTele } from "@juniper-lib/threejs/BaseTele";
import { ScreenMode } from "@juniper-lib/threejs/ScreenMode";
import type { Environment, EnvironmentModule } from "@juniper-lib/threejs/environment/Environment";
import { URLBuilder } from "@juniper-lib/tslib/URLBuilder";
import { Task } from "@juniper-lib/events/Task";
import { WindowQuitEventer } from "@juniper-lib/events/WindowQuitEventer";
import { all } from "@juniper-lib/events/all";
import { isIOS, isMobileVR } from "@juniper-lib/tslib/flags";
import { IProgress } from "@juniper-lib/progress/IProgress";
import { progressSplit, progressSplitWeighted } from "@juniper-lib/progress/progressSplit";
import { SetIntervalTimer } from "@juniper-lib/timers/SetIntervalTimer";
import { isDefined } from "@juniper-lib/tslib/typeChecks";
import { version as threeJSVersion } from "../../../node_modules/three/package.json";
import { createFetcher } from "../../createFetcher";
import { isDebug } from "../../isDebug";
import {
    BasicLabelColor,
    DLSBlue,
    MULTIPLAYER_HUB_NAME,
    createDataLogger,
    defaultFont,
    enableFullResolution,
    getAppScriptUrl,
    getAppStyleUrl,
    getLibScriptUrl,
    getUIImagePaths,
    loadFonts,
    menu,
    version as yarrowVersion
} from "../../settings";
import type MainMenu from "../../vr-apps/menu";
import type Yarrow from "../../vr-apps/yarrow";

import "./styles.css";

const fetcher = createFetcher(false);
const logger = createDataLogger(fetcher);

try {
    type UserType = "Student"
        | "Instructor"
        | "Explore";

    const selectUserTypeForm = getElement("#selectUserTypeForm");
    const loginForm = getElement("#loginForm");
    const studentButton = getButton("#studentButton");
    const instructorButton = getButton("#instructorButton");
    const exploreButton = getButton("#exploreButton");
    const joinSessionMessage = getElement("#joinSessionMessage");
    const studentMeetingIDHelpBlock = getElement("#studentMeetingIDHelpBlock");
    const instructorMeetingIDHelpBlock = getElement("#instructorMeetingIDHelpBlock");
    const appContainer = getElement("#appContainer");
    const heroImage = getElement("#heroImage");
    const scenarioIDInput = getInput("#scenarioID");
    const userNameInput = getInput("#userName");
    const meetingIDInput = getInput("#meetingID");
    const connectButton = getButton("#connectButton");
    const iOSError = getElement("#iOSError");
    const threeJSRevisionMatch = threeJSVersion.match(/\d+\.(\d+)\.\d+/);
    const threeJSRevision = threeJSRevisionMatch[1];

    const isTest = hasUserNumber();
    const userNumber = getUserNumber();
    const LOGIN_USER_NAME_KEY = "login:userName";
    const userTypeSelected = new Task();
    const teleLoaded = new Task();
    const versionChecker = new SetIntervalTimer(0.5);
    const scenarioIDPattern = /\/\d+\/?$/;
    const windowQuitter = new WindowQuitEventer();

    let env: Environment = null;
    let yarrow: Yarrow = null;
    let mainMenu: MainMenu = null;
    let userType: UserType = null;
    let curVersion = yarrowVersion;
    let lastVersion = curVersion;
    let connecting = false;

    if (isDebug) {
        Object.assign(window, {
            setVersion: (v: string) => lastVersion = v
        });
    }

    versionChecker.addTickHandler(checkVersion);
    elementSetDisplay(appContainer, false);
    configureInputs();
    refreshForm();
    loadEverything().catch(logger.error.bind(logger, "Login", "loadEverything"));

    async function loadEverything() {
        curVersion = await getVersion();
        versionChecker.start();
        
        await loadFonts();

        await fetcher
            .get(getLibScriptUrl("three"))
            .useCache(!isDebug)
            .module()
            .then(assertSuccess);

        if (THREE.REVISION !== threeJSRevision) {
            console.warn(`After loading Three.js, version was ${THREE.REVISION}, but expected ${threeJSRevision}`);
        }

        const { default: EnvironmentConstructor } = await fetcher
            .get(getAppScriptUrl("environment"))
            .useCache(!isDebug)
            .module<EnvironmentModule>()
            .then(unwrapResponse);

        env = new EnvironmentConstructor({
            canvas: getCanvas("#frontBuffer"),
            fetcher,
            dialogFontFamily: defaultFont.fontFamily,
            getAppUrl: getAppScriptUrl,
            uiImagePaths: getUIImagePaths(),
            buttonFillColor: DLSBlue,
            labelFillColor: BasicLabelColor,
            enableFullResolution,
            DEBUG: isDebug,
            styleSheetPath: getAppStyleUrl("environment"),
            watchModelPath: "/models/watch1.glb"
        });

        if (isDebug) {
            env.apps.cacheBustString = curVersion + "&DEBUG";
        }
        else {
            env.apps.cacheBustString = curVersion;
        }

        env.apps.addEventListener("apploaded", (evt) => {
            if (evt.appName === "menu") {
                mainMenu = evt.app as MainMenu;

                mainMenu.addEventListener("select", async (evt) => {
                    await env.withFade(async () => {
                        mainMenu.hide();
                        const req = env.apps.app("yarrow");
                        req.param("dataLogger", logger);
                        req.param("scenarioID", evt.scenarioID);

                        const progs = progressSplit(env.loadingBar, 2);
                        const app = await req.load(progs.shift());
                        await app.show(progs.shift());
                    });
                });

                mainMenu.addEventListener("lobby", async () => {
                    await env.withFade(async () => {
                        if (yarrow) {
                            yarrow.quit();
                        }
                        await mainMenu.show(env.loadingBar);
                    });
                });
            }
            else if (evt.appName === "yarrow") {
                yarrow = evt.app as Yarrow;

                yarrow.addEventListener("shown", async () => {
                    versionChecker.stop();
                    const loc = new URLBuilder(location.href)
                        .pathPop(scenarioIDPattern)
                        .pathPush(yarrow.scenarioID.toString())
                        .toString();
                    history.replaceState(null, null, loc);
                });

                yarrow.addEventListener("quit", async () => {
                    versionChecker.start();
                    const loc = new URLBuilder(location.href)
                        .pathPop(scenarioIDPattern)
                        .toString();
                    history.replaceState(null, null, loc);
                });
            }
        });

        refreshForm();

        const [envAssetLoad, subAppLoad, teleLoad] = progressSplitWeighted(env.loadingBar, [1, 2, 1]);

        await env.fadeOut();

        await all(
            env.load(envAssetLoad),
            firstLoad(subAppLoad),
            loadTele(teleLoad)
        );

        if (isTest) {
            onConnect();
        }
    }

    async function getVersion(): Promise<string> {
        if (isDebug || !navigator.onLine) {
            return lastVersion;
        }

        return await fetcher
            .get("/vr/version")
            .text()
            .then(unwrapResponse);
    }

    async function checkVersion() {
        try {
            const nextVersion = await getVersion();
            if (nextVersion !== curVersion) {
                location.reload();
            }
        }
        // eslint-disable-next-line no-empty
        catch {

        }
    }

    async function firstLoad(subAppLoad: IProgress): Promise<void> {
        const scenarioID = parseFloat(scenarioIDInput.value);
        const scenarioDirectLoad = Number.isInteger(scenarioID);
        const progs = progressSplit(subAppLoad, scenarioDirectLoad ? 2 : 1);
        const tasks = [
            loadMenu(progs.shift())
        ];
        if (scenarioDirectLoad) {
            tasks.push(loadYarrow(scenarioID, progs.shift()));
        }
        const apps = await Promise.all(tasks);
        const lastApp = apps.pop();
        await lastApp.show();
        await env.fadeIn();
    }

    async function loadYarrow(scenarioID: number, subAppLoad: IProgress) {
        return await env.apps
            .app("yarrow")
            .param("scenarioID", scenarioID)
            .param("dataLogger", logger)
            .load(subAppLoad);
    }

    async function loadMenu(subAppLoad: IProgress) {
        return await env.apps
            .app("menu")
            .param("config", menu)
            .load(subAppLoad);
    }

    async function loadTele(teleLoad: IProgress) {
        try {
            await userTypeSelected;

            env.devicesDialog.showWebcams
                = userType !== "Explore";

            if (userType === "Explore") {
                onConnect();
                teleLoad.end("skip");
            }
            else {

                userNameInput.focus();

                const tele = await env.apps
                    .app("tele")
                    .param("nameTagFont", defaultFont)
                    .param("hub", MULTIPLAYER_HUB_NAME)
                    .param("dataLogger", logger)
                    .load(teleLoad);

                await tele.show();
            }
            teleLoaded.resolve();
        }
        catch (err) {
            teleLoaded.reject(err);
        }
    }

    async function onConnect() {
        const onQuit = () => logger.log("quitting");

        env.addEventListener("quitting", onQuit);
        windowQuitter.addEventListener("quitting", onQuit);

        connecting = true;
        refreshForm();

        await env.audio.ready;
        await teleLoaded;

        const hasTele = env.apps.isLoaded("tele");

        env.devicesDialog.showMicrophones ||= hasTele;

        if (env.devicesDialog.showMicrophones || env.devicesDialog.showWebcams) {
            if (isTest && userNumber !== 1) {
                env.microphones.gain.setValueAtTime(0, 0);
            }

            // this must be called *before* setting the conference info on the BaseTele app.
            await env.devicesDialog.showDialog();
        }

        elementSetDisplay(heroImage, false);
        elementSetDisplay(appContainer, true);

        if (hasTele) {
            const userName = userNameInput.value;
            const meetingID = meetingIDInput.value.toLocaleUpperCase();

            localStorage.setItem(LOGIN_USER_NAME_KEY, userName);
            const loc = new URLBuilder(location.href)
                .query("m", meetingID)
                .toString();
            history.replaceState(null, null, loc);

            const tele = env.apps.get<BaseTele>("tele");
            // Make sure env.devicesDialog has been shown at least once before
            // calling tele.setConfereinceInfo
            await tele.setConferenceInfo(userType, userName, meetingID);
            connecting = false;
            refreshForm();
        }
        else {
            logger.log("explore");
        }

        if (isMobileVR()) {
            env.screenControl.start(ScreenMode.VR);
        }
        else {
            env.renderer.domElement.focus();
        }

        if (env.speech) {
            env.speech.speakerCulture = "en-US";
            if (!isTest || userNumber === 1) {
                env.speech.start();
            }
        }
    }

    function refreshForm() {
        const envCreated = isDefined(env);
        const hasUserType = userType !== null && userType.length > 0;
        const isInstructor = userType === "Instructor";
        const isStudent = userType === "Student";
        const meetingID = meetingIDInput.value.toLocaleUpperCase();
        const hasMeetingID = meetingID.length > 0;
        const hasUserName = userNameInput.value.length > 0;

        elementSetDisplay(iOSError, isIOS());
        elementSetDisplay(selectUserTypeForm, !hasUserType);
        elementSetDisplay(loginForm, hasUserType && userType !== "Explore", "grid");
        elementSetDisplay(studentMeetingIDHelpBlock, isStudent, "");
        elementSetDisplay(instructorMeetingIDHelpBlock, isInstructor, "");

        elementSetText(joinSessionMessage, isInstructor
            ? "Create Session"
            : "Join Session"
        );

        const basicStatus = envCreated
            ? ""
            : " (loading)";

        buttonSetEnabled(
            exploreButton,
            envCreated,
            "Explore alone" + basicStatus,
            "Explore lesson content without teleconferencing features" + basicStatus
        );

        const connectStatus = envCreated
            ? hasUserName
                ? hasMeetingID
                    ? connecting
                        ? "ing..."
                        : ""
                    : " (meeting ID required)"
                : hasMeetingID
                    ? " (user name required)"
                    : " (user name and meeting ID required)"
            : " (loading)";

        buttonSetEnabled(
            connectButton,
            envCreated
            && userType !== "Explore"
            && hasUserName
            && hasMeetingID
            && !connecting,
            "Connect" + connectStatus,
            connectStatus || "Join session"
        );
    }

    function selectUserType(type: UserType): () => Promise<void> {
        return async () => {
            userType = type;
            refreshForm();
            userTypeSelected.resolve();
        };
    }

    function configureInputs() {
        connectButton.addEventListener("click", onConnect);

        if (isDefined(studentButton)) {
            studentButton.addEventListener("click", selectUserType("Student"));
        }

        if (isDefined(instructorButton)) {
            instructorButton.addEventListener("click", selectUserType("Instructor"));
        }

        exploreButton.addEventListener("click", selectUserType("Explore"));

        addTrimmer(userNameInput);
        addTrimmer(meetingIDInput);

        if (userNameInput.value.length === 0) {
            userNameInput.value = localStorage.getItem(LOGIN_USER_NAME_KEY);
        }

        if (isTest) {
            const namePattern = /^(.+?) *\d+$/;
            const match = userNameInput.value.match(namePattern);
            const name = match && match[1] || "Test";
            userNameInput.value = `${name} ${getUserNumber()}`;
            meetingIDInput.value = "TEST";
            selectUserType("Student")();
        }

        userNameInput.addEventListener("input", () => refreshForm());

        meetingIDInput.addEventListener("input", () => refreshForm());

        if (isDefined(studentButton)) {
            studentButton.disabled = false;
        }

        if (isDefined(instructorButton)) {
            instructorButton.disabled = false;
        }

        const loc = new URL(location.href);
        const meetingID = loc.searchParams.get("m");
        if (meetingID) {
            meetingIDInput.value = meetingID.toUpperCase();
        }
    }

    function addTrimmer(control: HTMLInputElement) {
        function trimmer() {
            control.value = control.value
                .trim()
                .replace(/\s+/g, " ");
        }

        control.addEventListener("blur", trimmer);
        control.addEventListener("keydown", (evt: KeyboardEvent) => {
            if (evt.key === "Enter") {
                trimmer();
            }
        });
    }
}
catch (exp) {
    logger.error("Login", "Top level", exp);
}