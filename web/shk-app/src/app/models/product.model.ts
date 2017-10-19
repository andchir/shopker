export class Product {
    constructor(
        public id: number,
        public is_active: boolean,
        public parent_id: number,
        public content_type: string,
        public name: string,
        public title: string,
        public description?: string,
        public price?: number
    ) { }
}