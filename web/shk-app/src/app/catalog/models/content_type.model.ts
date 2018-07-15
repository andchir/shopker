import {ContentField} from './content_field.model';

export class ContentType {
    constructor(
        public id: number,
        public name: string,
        public title: string,
        public description: string,
        public collection: string,
        public fields: ContentField[],
        public groups: string[],
        public isActive: boolean
    ) { }
}
