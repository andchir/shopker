export class FileData {
    constructor(
        public fileId: number,
        public title: string,
        public extension: string,
        public size?: number,
        public fileName?: string,
        public dirPath?: string
    ) { }
}
