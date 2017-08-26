import { FieldTypeProperty } from './field-type-property.model';

export class FieldType {
    constructor(
        public id: string,
        public name: string,
        public title: string,
        public description: string,
        public properties: FieldTypeProperty[]
    ) { }
}