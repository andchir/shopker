export class ContentField {
    constructor(
        public id: string,
        public name: string,
        public title: string,
        public description: string,
        public input_type: string,
        public input_properties: {[key: string]: string},
        public output_type: string,
        public output_properties: {[key: string]: string},
        public group: string,
        public required: boolean,
        public is_filter: boolean,
        public show_in_table: boolean
    ) { }
}