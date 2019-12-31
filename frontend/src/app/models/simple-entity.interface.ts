export class SimpleEntity {
    constructor(
        public id: number,
        public title?: string,
        public isActive?: boolean,
        public _id?: number,
        public translations?: {[fieldName: string]: {[lang: string]: string}}
    ) { }
}
