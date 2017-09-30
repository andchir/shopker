export class Category {
    constructor(
        public id: number,
        public is_folder: boolean,
        public parent_id: number,
        public name: string,
        public title: string,
        public description: string,
        public content_type: string,
        public is_active: boolean
    ) { }
}