export class Order {
    constructor(
        public id: number,
        public userId: number,
        public status: string,
        public email: string,
        public fullName?: string,
        public address?: string,
        public deliveryName?: string,
        public deliveryPrice?: number,
        public paymentName?: string,
        public paymentValue?: string,
        public comment?: string,
        public contentCount?: number
    ) { }
}