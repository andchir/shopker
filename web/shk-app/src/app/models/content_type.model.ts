import { ContentField } from './content_field.model';

export class ContentType {
    constructor(
        public id: string,
        public name: string,
        public title: string,
        public description: string,
        public fields: ContentField[],
        public groups: any[]
    ) { }
}