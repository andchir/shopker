import {ContentField} from './content_field.model';
import {findIndex} from 'lodash';

export class ContentType {

    static getSystemFieldName(contentType: ContentType): string {
        const index = findIndex(contentType.fields, {inputType: 'system_name'});
        return index > -1 ? contentType.fields[index].name : 'name';
    }

    static getFieldByName(contentType: ContentType, fieldName: string): ContentField|null {
        const index = findIndex(contentType.fields, {name: fieldName});
        return index > -1 ? contentType.fields[index] : null;
    }

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
