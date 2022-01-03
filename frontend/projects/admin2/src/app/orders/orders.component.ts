import {Component, OnInit, Input, ElementRef} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';

import {Order} from './models/order.model';
import {OrdersService} from './orders.service';
import {QueryOptions} from '../models/query-options';
import {AppTablePageAbstractComponent} from '../components/table-page.components.abstract';
import {ModalOrderContentComponent} from './modal-order.component';

@Component({
    selector: 'app-orders',
    templateUrl: 'templates/orders.component.html',
    providers: [DialogService, MessageService, ConfirmationService, OrdersService]
})
export class OrdersComponent extends AppTablePageAbstractComponent<Order> {
    
    queryOptions: QueryOptions = new QueryOptions(1, 12, 'id', 'desc');
    items: Order[] = [];
    tableFields = [];
    cols = [
        { field: 'id', header: 'ID' },
        { field: 'status', header: 'STATUS' },
        { field: 'price', header: 'PRICE' },
        { field: 'contentCount', header: 'CONTENT_COUNT' },
        { field: 'email', header: 'EMAIL' },
        { field: 'createdDate', header: 'DATE_TIME' }
    ];

    constructor(
        public dialogService: DialogService,
        public dataService: OrdersService,
        public messageService: MessageService,
        public confirmationService: ConfirmationService
    ) {
        super(dialogService, dataService, messageService, confirmationService);
    }
    
    getModalComponent() {
        return ModalOrderContentComponent;
    }
}
