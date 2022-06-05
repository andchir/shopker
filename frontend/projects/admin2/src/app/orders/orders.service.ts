import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {DataService} from '../services/data-service.abstract';
import {Order} from './models/order.model';

@Injectable()
export class OrdersService extends DataService<Order> {

    constructor(http: HttpClient) {
        super(http);
        this.setRequestUrl('/admin/orders');
    }
}
