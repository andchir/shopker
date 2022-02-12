import {FileRegularInterface} from './file-regular.interface';

export class Template {

    static getPath(file: Template|FileRegularInterface): string {
        return `${file.path}/${file.name}`;
    }

    constructor(
        public id: number,
        public name: string,
        public themeName: string,
        public content?: string,
        public path?: string,
        public clearCache?: boolean
    ) { }
}
