export class FileData {

    static getFileName(fileData: FileData): string {
        return `${fileData.title}.${fileData.extension}`;
    }

    public toString = (): string => {
        return `${this.title}.${this.extension}`;
    };

    constructor(
        public fileId: number,
        public title: string,
        public extension: string,
        public size?: number,
        public fileName?: string,
        public dirPath?: string,
        public dataUrl?: string
    ) { }
}
