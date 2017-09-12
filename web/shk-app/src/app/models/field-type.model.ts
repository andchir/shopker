import { FieldTypeProperty } from './field-type-property.model';

export class FieldType {
    constructor(
        public id: string,
        public name: string,
        public title: string,
        public description: string,
        public isActive: boolean,
        public inputProperties: FieldTypeProperty[],
        public outputProperties: FieldTypeProperty[]
    ) { }
}