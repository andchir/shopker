import { UserOption } from '../../users/models/user.model';

interface OrderContentParameter {
    name: string;
    price: number;
    value: string|number;
}

export class OrderContent {

    private _parametersString: string;

    constructor(
        public id: number,
        public title: string,
        public count: number,
        public price: number,
        public priceTotal?: number,
        public contentTypeName?: string,
        public uri?: string,
        public image?: string,
        public parameters?: OrderContentParameter[]
    ) {
        this.createParametersString();
    }

    get parametersString(): string {
        return this._parametersString;
    }

    set parametersString(parametersString: string) {
        this._parametersString = parametersString;
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
                cont['priceTotal'],
                cont['contentTypeName'],
                cont['uri'],
                cont['image'],
                cont['parameters']
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
        public options?: UserOption[]
    ) { }
}
