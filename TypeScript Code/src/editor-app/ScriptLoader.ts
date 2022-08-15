import { isArray, isString } from "@juniper-lib/tslib/typeChecks";

type progressCallback = (soFar: number, total: number, msg?: string) => void;
type testCallback = () => boolean;
type ImportExpr = string | [string, testCallback];

interface Script {
    prog: progressCallback;
    path: string;
    test: testCallback;
    soFar: number;
    total: number;
    result: any;
}

export async function loadScripts(JS_EXT: string, onProgress: progressCallback, ...paths: ImportExpr[]): Promise<any[]>;
export async function loadScripts(JS_EXT: string, ...paths: ImportExpr[]): Promise<any[]>;
export async function loadScripts(JS_EXT: string, onProgressOrPath: progressCallback | ImportExpr, ...paths: ImportExpr[]): Promise<any[]> {
    let onProgress: progressCallback = null;
    if (isString(onProgressOrPath) || isArray(onProgressOrPath)) {
        paths.unshift(onProgressOrPath);
    }
    else {
        onProgress = onProgressOrPath;
    }

    function updateProg(msg?: string) {
        if (onProgress) {
            let soFar = 0;
            let total = 0;
            for (const script of scripts) {
                soFar += script.soFar;
                total += script.total;
            }
            onProgress(soFar, total, msg);
        }
    }

    const scripts: Script[] = paths.map(expr => {
        let test: testCallback = null;
        let path: string = null;
        if (isString(expr)) {
            path = expr;
        }
        else {
            path = expr[0];
            test = expr[1];
        }
        const isModule = !path.startsWith("$");
        path = isModule ? path : path.substr(1);
        path = `/js/${path}/index${JS_EXT}`;
        return {
            prog: function (soFar, total) {
                this.soFar = soFar;
                this.total = total;
                updateProg(this.path);
            },
            path,
            test,
            soFar: 0,
            total: 0,
            result: null
        };
    });

    if (JS_EXT === ".min.js") {
        await Promise.all(scripts.map(loadScript));
    }

    for (const script of scripts) {
        await applyScript(script);
    }

    return scripts.map(script => script.result).filter(v => !!v);
}

async function loadScript(script: Script): Promise<void> {
    script.path = await preloadFile(script.path, script.prog);
}

function preloadFile(path: string, prog?: progressCallback): Promise<string> {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.open("GET", path);
    if (prog) {
        xhr.onloadstart = () => prog(0, 0);
        xhr.onprogress = (evt) => prog(evt.loaded || 1, evt.total || 1);
    }
    return new Promise<string>((resolve, reject) => {
        xhr.onloadend = () => resolve(URL.createObjectURL(xhr.response));
        xhr.onerror = () => reject(`(${xhr.status}) ${path}`);
        xhr.send();
    });
}

async function applyScript(script: Script): Promise<void> {
    if (script.test) {
        const elem = document.createElement("script");
        elem.src = script.path;
        document.head.append(elem);
        await new Promise<void>((resolve, reject) => {
            let tries = 0;
            const handle = setInterval(() => {
                ++tries;
                if (script.result = script.test()) {
                    clearInterval(handle);
                    resolve();
                }
                else if (tries > 3) {
                    clearInterval(handle);
                    reject("TIMEOUT");
                }
            }, 100);
        });
    }
    else {
        script.result = (await import(script.path)).default;
    }
}