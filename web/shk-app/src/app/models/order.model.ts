import { UserOption } from './user.model';

export class OrderContent {
    constructor(
        public id: number,
        public title: string,
        public count: number,
        public price: number,
        public contentTypeName?: string,
        public uri?: string,
        public image?: string
    ){}
}

export class Order {
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
        public content?: OrderContent[],
        public options?: UserOption[]
    ) { }
}