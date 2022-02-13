export class EditableFile {

    static getPath(file: EditableFile): string {
        return `${file.path}/${file.name}`;
    }

    constructor(
        public id?: number,
        public name?: string,
        public extension?: string,
        public type?: string,
        public content?: string,
        public path?: string,
        public clearCache?: boolean,
        public themeName?: string,
        public fileSize?: number|string,
        public fileSizeString?: string
    ) {
        if (!this.type) {
            this.type = 'template';
        }
    }
}
