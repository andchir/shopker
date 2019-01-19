export class Template {
    constructor(
        public id: number,
        public name: string,
        public themeName: string,
        public content?: string,
        public path?: string,
        public clearCache?: boolean
    ) { }
}
