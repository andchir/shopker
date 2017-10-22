export class Product {
    constructor(
        public id: number,
        public isActive: boolean,
        public parentId: number,
        public contentType: string,
        public name: string,
        public title: string,
        public description?: string,
        public price?: number
    ) { }
}