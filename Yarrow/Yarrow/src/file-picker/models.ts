import { FileData } from "../vr-apps/yarrow/data";

export type FileTypes = File | URL | FileData;

export interface SearchInput {
    typeFilter?: string;
    tagFilter?: string;
}

export type SearchOutput = FileData[];