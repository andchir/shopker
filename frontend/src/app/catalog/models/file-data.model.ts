
export class FileData {

    static getFileData(file: File): FileData {
        if (!file) {
            return null;
        }
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
            if (fileData.fileId) {
                output += `${filesDirBaseUrl}/`;
            }
            output += `${fileData.dirPath}/`;
            output += `${fileData.fileName}.${fileData.extension}`;
        }
        return output;
    }

    static getIsImageFile(fileExtension: string): boolean {
        return ['jpg', 'jpeg', 'png', 'webp', 'gif'].indexOf(fileExtension) > -1;
    }

    static getFileName(fileData: FileData): string {
        return `${fileData.title}.${fileData.extension}`;
    }

    static getExtension(url) {
        if (url.indexOf('.') === -1) {
            return '';
        }
        url = FileData.baseName(url);
        const tmp = url.toLowerCase().split('.');
        return (tmp[tmp.length - 1]).toLowerCase();
    }

    static baseName(url) {
        if (url.indexOf('/') > -1) {
            return url.substr(url.lastIndexOf('/') + 1);
        }
        return url;
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
        public dataUrl?: string|ArrayBuffer,
        public isDir?: boolean
    ) { }
}
