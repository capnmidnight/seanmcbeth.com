import { TypedEvent } from "@juniper-lib/events/dist/TypedEventTarget";
import { FileData } from "../vr-apps/yarrow/data";

export class SelectingEvent extends TypedEvent<"selecting"> {
    constructor() {
        super("selecting");
    }
}

export class URLSelectedEvent extends TypedEvent<"urlselected"> {
    constructor(public readonly file: URL) {
        super("urlselected");
    }
}

export class FileDataSelectedEvent extends TypedEvent<"filedataselected"> {
    constructor(public readonly file: FileData) {
        super("filedataselected");
    }
}

export class FileSelectedEvent extends TypedEvent<"fileselected"> {
    constructor(public readonly file: File, public readonly mediaType: string) {
        super("fileselected");
    }
}