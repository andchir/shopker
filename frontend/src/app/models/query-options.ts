export class QueryOptions {
    constructor(
        public sort_by: string,
        public sort_dir: string,
        public page: number,
        public limit?: number,
        public full?: number,
        public only_active?: number
    ) { }
}
