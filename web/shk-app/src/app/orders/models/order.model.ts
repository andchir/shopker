import { UserOption } from '../../users/models/user.model';

interface OrderContentParameter {
    nama: string;
    price: number;
    value: string|number;
}

export class OrderContent {
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
    ){}

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
}

export class Order {

    private _content: OrderContent[];

    get content(): OrderContent[] {
        return this._content;
    }

    set content(content: OrderContent[]) {
        this._content = content;
    }

    constructor(
        public id: number,
        public userId: number,
        public status: string,
        public email: string,
        public phone: string,
        public fullName?: string,
        public createdDate?: string,
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