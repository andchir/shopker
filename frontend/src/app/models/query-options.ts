export class QueryOptions {
    constructor(
        public sort_by: string,
        public sort_dir: string,
        public page: number,
        public limit?: number,
        public full?: number,
        public only_active?: number,
        public search_word?: string,
        public category?: string
    ) {
        if (typeof this.search_word === 'undefined') {
            this.search_word = '';
        }
        if (typeof this.category === 'undefined') {
            this.category = '';
        }
    }
}
