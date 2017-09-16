import { FieldTypeProperty } from './field-type-property.model';

export class FieldType {
    constructor(
        public id: number,
        public name: string,
        public title: string,
        public description: string,
        public is_active: boolean,
        public inputProperties: FieldTypeProperty[],
        public outputProperties: FieldTypeProperty[]
    ) { }
}