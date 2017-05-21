export class ContentField {
    constructor(
        public id: string,
        public name: string,
        public title: string,
        public description: string,
        public input_type: string,
        public input_type_options: any[],
        public output_type: string,
        public output_type_options: any[],
        public group: string,
        public is_filter: boolean
    ) { }
}