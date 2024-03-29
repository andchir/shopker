import {FileData} from '../catalog/models/file-data.model';

export class FileModel {
    
    static getFilePath(file: FileModel, currentPath?: string): string {
        return currentPath
            ? `${currentPath}/${file.fileName}`
            : `${file.fileName}`;
    }
    
    static getFileData(file: File, filesDirBaseUrl = ''): FileData {
        const fileName = file.name.substr(0, file.name.lastIndexOf('.')),
            extension = file.name.substr(file.name.lastIndexOf('.') + 1),
            size = file.size;
        const fileData = new FileData(0, fileName, extension.toLowerCase(), size);
        fileData.fileName = fileName;
        return fileData;
    }

    public toString = (): string => {
        return `${this.title}.${this.extension}`;
    };

    constructor(
        public id: number,
        public title: string,
        public fileName: string,
        public extension: string,
        public mimeType: string,
        public ownerType: string,
        public size: number,
        public createdDate: string,
        public modifiedDate?: string,
        public isDir?: boolean,
        public isEditable?: boolean
    ) { }
}
