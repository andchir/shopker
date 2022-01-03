export class QueryOptions {
    constructor(
        public page: number,
        public limit: number,
        public sort_by?: string,
        public sort_dir?: string,
        public order_by?: string,
        public full?: number,
        public only_active?: number,
        public query?: string,
        public search_word?: string,
        public category?: string
    ) {
        if (typeof search_word === 'undefined') {
            this.search_word = '';
        }
    }
}
