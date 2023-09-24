import { isNullOrUndefined, isString } from "@juniper-lib/tslib/dist/typeChecks";
import { URLBuilder } from "@juniper-lib/tslib/dist/URLBuilder";
import { isYouTube } from "@juniper-lib/video/dist/YouTubeProxy";

function resolveURL(url: string | URL): URL {
    if (isNullOrUndefined(url)) {
        return null;
    }

    if (isString(url)) {
        url = new URL(url, location.href);
    }

    return url;
}

export function isProxyableDomain(url: string | URL): boolean {

    if (isNullOrUndefined(url)) {
        return false;
    }

    url = resolveURL(url);

    return isYouTube(url);
}

export function stripParameters(url: string | URL): URL {

    if (isNullOrUndefined(url)) {
        throw new Error("URL is undefined");
    }

    url = resolveURL(url);

    if (isYouTube(url)) {
        const toRemove = Array
            .from(url.searchParams.keys())
            .filter(key => key !== "v"
                && key !== "t");

        for (const key of toRemove) {
            url.searchParams.delete(key);
        }
    }

    return url;
}

export function makeProxyURL(url: string | URL): URL {
    url = resolveURL(url);

    if (isNullOrUndefined(url)) {
        throw new Error("URL is undefined");
    }

    url = stripParameters(url);

    return new URLBuilder("/vr/link", location.href)
        .query("q", url.href)
        .toURL();
}
