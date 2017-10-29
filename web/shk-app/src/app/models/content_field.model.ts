export class ContentField {
    constructor(
        public id: number,
        public name: string,
        public title: string,
        public description: string,
        public inputType: string,
        public inputProperties: {[key: string]: string},
        public outputType: string,
        public outputProperties: {[key: string]: string},
        public group: string,
        public required: boolean,
        public isFilter: boolean,
        public showInTable: boolean,
        public options?: {}[]
    ) { }
}
