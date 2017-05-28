export class Category {
    constructor(
        public id: number,
        public parent_id: number,
        public name: string,
        public title: string,
        public description: string
    ) { }
}