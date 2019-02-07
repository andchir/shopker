import {FileData} from './file-data.model';

export class Category {
    constructor(
        public id: number,
        public isFolder: boolean,
        public parentId: number,
        public name: string,
        public title: string,
        public description: string,
        public contentTypeName: string,
        public isActive: boolean,
        public clearCache?: boolean,
        public menuIndex?: number,
        public translations?: {[fieldName: string]: {[lang: string]: string}},
        public image?: FileData
    ) {
        if (typeof this.clearCache === 'undefined') {
            this.clearCache = false;
        }
        if (typeof this.translations === 'undefined') {
            this.translations = {};
        }
    }
}
