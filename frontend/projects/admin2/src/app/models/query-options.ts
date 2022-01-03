export class QueryOptions {
    constructor(
        public page: number,
        public limit: number,
        public sort_by?: string,
        public sort_dir?: string,
        public order_by?: string,
        public full?: number,
        public category?: string,
        public only_active?: number,
        public query?: string,
        public filter?: string,
        public groups?: string
    ) { }
}
