export class FileData {

    static getFileData(file: File): FileData {
        const title = file.name.substr(0, file.name.lastIndexOf('.')),
            extension = file.name.substr(file.name.lastIndexOf('.') + 1),
            size = file.size;

        return new FileData(0, title, extension, size);
    }

    static getImageUrl(filesDirBaseUrl: string, fileData: FileData|null): string|ArrayBuffer {
        if (!fileData) {
            return '';
        }
        if (fileData.dataUrl) {
            return fileData.dataUrl;
        }
        let output = '';
        if (fileData.fileName) {
            output += `${filesDirBaseUrl}/${fileData.dirPath}/`;
            output += `${fileData.fileName}.${fileData.extension}`;
        }
        return output;
    }

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
        public dataUrl?: string|ArrayBuffer
    ) { }
}
