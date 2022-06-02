import { stringRandom } from "@juniper-lib/tslib";
import { version as pkgVersion } from "../package.json";

export const version = DEBUG
    ? stringRandom(10)
    : pkgVersion;