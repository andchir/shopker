export class FileModel {
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
