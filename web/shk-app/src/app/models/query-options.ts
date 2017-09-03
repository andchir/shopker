export class QueryOptions {
    constructor(
        public sortBy: string,
        public sortDir: string,
        public page: number,
        public limit?: number,
        public full?: number
    ) { }
}