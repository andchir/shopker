export class QueryOptions {
    constructor(
        public page: number,
        public limit: number,
        public sortBy?: string,
        public sortDir?: string,
        public orderBy?: string,
        public full?: number,
        public category?: string,
        public onlyActive?: number,
        public query?: string,
        public filter?: string,
        public groups?: string
    ) { }
}
