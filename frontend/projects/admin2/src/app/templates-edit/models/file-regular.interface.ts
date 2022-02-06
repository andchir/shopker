export interface FileRegularInterface {
    name: string;
    extension: string;
    path: string;
    content?: string;
    size?: number|string;
    clearCache?: boolean;
    type?: string;
}
