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
        public menuIndex?: number
    ) { }
}