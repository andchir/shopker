export class FileModel {

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
        public createdDate: string
    ) { }
}
