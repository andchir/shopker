export interface FieldIndexData {
    index: number;
    additFieldsCount: number;
}

export class ContentField {

    static getFieldBaseName(fieldName: string): string {
        if (fieldName.indexOf('__') > -1) {
            const tmp = fieldName.split('__');
            if (!isNaN(tmp[1] as any)) {
                fieldName = tmp[0];
            }
        }
        return fieldName;
    }

    static getFieldIndexData(fields: ContentField[], fieldName): FieldIndexData {
        let index = -1,
            additFieldsCount = 0;
        const baseFieldName = ContentField.getFieldBaseName(fieldName);
        fields.forEach((fld, ind) => {
            if (fld.name === fieldName) { index = ind; }
            if (fld.name.indexOf(`${baseFieldName}__`) > -1) { additFieldsCount++; }
        });
        return {index: index, additFieldsCount: additFieldsCount};
    }

    constructor(
        public id: number,
        public name: string,
        public title: string,
        public description: string,
        public inputType: string,
        public inputProperties: {[key: string]: string|number|string[]},
        public outputType: string,
        public outputProperties: {[key: string]: string|number},
        public group: string,
        public required?: boolean,
        public isFilter?: boolean,
        public showInTable?: boolean,
        public showOnPage?: boolean,
        public showInList?: boolean,
        public options?: {}[],
        public inputTypeMain?: string,
        public filterOrder?: number,
        public listOrder?: number,
        public pageOrder?: number
    ) {
        if (typeof this.filterOrder === 'undefined') {
            this.filterOrder = 0;
        }
        if (typeof this.listOrder === 'undefined') {
            this.listOrder = 0;
        }
        if (typeof this.required === 'undefined') {
            this.required = false;
        }
        if (typeof this.isFilter === 'undefined') {
            this.isFilter = false;
        }
        if (typeof this.showInTable === 'undefined') {
            this.showInTable = true;
        }
        if (typeof this.showOnPage === 'undefined') {
            this.showOnPage = true;
        }
        if (typeof this.showInList === 'undefined') {
            this.showInList = false;
        }
        if (typeof this.options === 'undefined') {
            this.options = [];
        }
    }
}
