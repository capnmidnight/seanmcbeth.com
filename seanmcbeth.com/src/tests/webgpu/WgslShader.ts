import { Text_Wgsl } from "@juniper-lib/mediatypes/dist/text";
import { BaseFetchedAsset } from "@juniper-lib/fetcher/dist/Asset";
import { IFetcherBodiedResult } from "@juniper-lib/fetcher/dist/IFetcher";
import { IResponse } from "@juniper-lib/fetcher/dist/IResponse";
import { translateResponse } from "@juniper-lib/fetcher/dist/translateResponse";
import { Exception } from "@juniper-lib/tslib/dist/Exception";
import { isGoodNumber } from "@juniper-lib/tslib/dist/typeChecks";

type EntryPointType =
    | "compute"
    | "vertex"
    | "fragment";

class WgslShader {

    readonly constants: Map<string, number>;
    readonly entryPoints = new Map<EntryPointType, string>();
    readonly workGroupSize: number = null;

    #code;
    get code(){ return this.#code; }

    constructor(code: string) {

        this.#code = code;

        this.constants = new Map(
            Array.from(code.matchAll(/const (\w+) = ([^;]+);/g))
                .map(match => [
                    match[1],
                    parseFloat(match[2])
                ])
        );

        const computeMatch = code.match(/@compute\s+@workgroup_size\s*\(\s*([^)]+)\s*\)\s+fn\s+(\w+)/);
        if (computeMatch) {
            this.entryPoints.set("compute", computeMatch[2]);
            const keyOrValue = computeMatch[2];
            if (this.constants.has(keyOrValue)) {
                this.workGroupSize = this.constants.get(keyOrValue);
            }
            else {
                const value = parseFloat(keyOrValue);
                if (isGoodNumber(value)) {
                    this.workGroupSize = value;
                }
            }
        }

        for (const match of code.matchAll(/@(vertex|fragment)\s+fn\s+(\w+)/g)) {
            this.entryPoints.set(match[1] as EntryPointType, match[2]);
        }
    }

    changeConstant(key: string, value: number) {
        if (!this.constants.has(key)) {
            throw new Exception(`The constant "${key}" does not exist in the shader source.`);
        }

        const replacePattern = new RegExp(`const ${key} = ([^;]+);`);
        this.#code = this.#code.replace(replacePattern, `const ${key} = ${value};`);
    }
}
export class AssetWgslShader extends BaseFetchedAsset<WgslShader> {
    constructor(path: string, useCache?: boolean) {
        super(path, Text_Wgsl, useCache);
    }

    protected override async getResponse(request: IFetcherBodiedResult): Promise<IResponse<WgslShader>> {
        return translateResponse(
            await request.text(this.type),
            code => new WgslShader(code)
        );
    }
}
