export class Template {

    static getPath(template: Template): string {
        return `${template.path}/${template.name}`;
    }

    constructor(
        public id: number,
        public name: string,
        public themeName: string,
        public content?: string,
        public path?: string,
        public clearCache?: boolean
    ) { }
}
