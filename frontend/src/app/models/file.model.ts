import {FileData} from '../catalog/models/file-data.model';

export class FileModel {

    static getFileData(file: File): FileData {
        const title = file.name.substr(0, file.name.lastIndexOf('.')),
            extension = file.name.substr(file.name.lastIndexOf('.') + 1),
            size = file.size;

        return new FileData(0, title, extension, size);
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
