import {UserOption} from '../../users/models/user.model';
import {FileData} from '../../catalog/models/file-data.model';
import {AppSettings} from '../../services/app-settings.service';

interface OrderContentParameter {
    name: string;
    price: number;
    value: string|number;
}

export class OrderContent {

    private _parametersString: string;
    private _filesString: string;

    constructor(
        public id: number,
        public title: string,
        public count: number,
        public price: number,
        public uniqId?: string,
        public priceTotal?: number,
        public contentTypeName?: string,
        public uri?: string,
        public image?: string,
        public parameters?: OrderContentParameter[],
        public files?: FileData[],
        public currency?: string
    ) {
        this.createParametersString();
        this.createFilesString();
    }

    get parametersString(): string {
        return this._parametersString;
    }

    set parametersString(parametersString: string) {
        this._parametersString = parametersString;
    }

    get filesString(): string {
        return this._filesString;
    }

    set filesString(filesString: string) {
        this._filesString = filesString;
    }

    priceUpdate(): void {
        this.priceTotal = this.price * this.count;
        let parametersPrice = 0;
        if (typeof this.parameters !== 'undefined') {
            this.parameters.forEach((parameter) => {
                parametersPrice += parameter.price * this.count;
            });
        }
        this.priceTotal += parametersPrice;
    }

    createParametersString(): void {
        if (!this.parameters) {
            return;
        }
        const parametersStrArr = [];
        this.parameters.forEach((parameter) => {
            let parametersStr = '';
            if (parameter.name) {
                parametersStr += `${parameter.name}: `;
            }
            parametersStr += parameter.value
                + (parameter.price ? ` (${parameter.price})` : '');
            parametersStrArr.push(parametersStr);
        });
        this.parametersString = parametersStrArr.join(', ');
    }

    createFilesString(): void {
        if (!this.files) {
            return;
        }
        const filesStrArr = [],
            baseUrl = AppSettings.getBaseUrl();
        this.files.forEach((fileData) => {
            const downloadLink = `${baseUrl}admin/files/download/${fileData.fileId}`;
            let fileStr = `<a href="${downloadLink}" target="_blank">`;
            fileStr += `${fileData.title}.${fileData.extension}</a>`;
            filesStrArr.push(fileStr);
        });
        this.filesString = filesStrArr.join(', ');
    }
}

export class Order {

    private _content: OrderContent[];

    get content(): OrderContent[] {
        return this._content;
    }

    set content(content: OrderContent[]) {
        this._content = [];
        content.forEach((cont: any) => {
            this._content.push(new OrderContent(
                cont['id'],
                cont['title'],
                cont['count'],
                cont['price'],
                cont['uniqId'],
                cont['priceTotal'],
                cont['contentTypeName'],
                cont['uri'],
                cont['image'],
                cont['parameters'],
                cont['files'] || []
            ));
        });
    }

    constructor(
        public id: number,
        public userId: number,
        public status: string,
        public email: string,
        public phone: string,
        public fullName?: string,
        public createdDate?: Date,
        public deliveryName?: string,
        public deliveryPrice?: number,
        public paymentName?: string,
        public paymentValue?: string,
        public comment?: string,
        public contentCount?: number,
        public price?: number,
        public currency?: string,
        public options?: UserOption[],
        public currencyRate?: number
    ) { }
}
