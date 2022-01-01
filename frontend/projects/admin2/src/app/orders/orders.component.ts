import {Component, OnInit, Input, ElementRef} from '@angular/core';

import {Order, OrderContent} from './models/order.model';
import {OrdersService} from './orders.service';
import {QueryOptions} from '../models/query-options';

declare const window: Window;

@Component({
    selector: 'app-orders',
    templateUrl: 'templates/orders.component.html',
    providers: [OrdersService]
})
export class OrdersComponent {
    
    queryOptions: QueryOptions = new QueryOptions(1, 12, 'createdDate', 'desc');
    items: Order[] = [];
    tableFields = [];

    constructor(
        
    ) {
        
    }

    navBarToggle(): void {
        window.document.querySelector('.layout-sidebar').classList.toggle('active');
        window.document.querySelector('.layout-mask').classList.toggle('layout-mask-active');
    }
}
