export interface FileRegularInterface {
    id?: number;
    name?: string;
    extension?: string;
    path?: string;
    content?: string;
    fileSize?: number|string;
    fileSizeString?: string;
    clearCache?: boolean;
    type?: string;
}
