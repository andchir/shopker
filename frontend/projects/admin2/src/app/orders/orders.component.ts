import {Component, OnInit, Input, ElementRef, OnDestroy} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';

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
export class OrdersComponent extends AppTablePageAbstractComponent<Order> implements OnInit, OnDestroy {
    
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
    menuItems: MenuItem[];

    constructor(
        public dialogService: DialogService,
        public dataService: OrdersService,
        public messageService: MessageService,
        public confirmationService: ConfirmationService
    ) {
        super(dialogService, dataService, messageService, confirmationService);
    }
    
    ngOnInit() {
        this.menuItems = [
            {
                label: 'Обновить',
                icon: 'pi pi-refresh',
                command: () => {
                    this.queryOptions.page = 1;
                    this.queryOptions.search_word = '';
                    this.getData();
                }
            },
            {
                label: 'Удалить выбранные',
                icon: 'pi pi-times',
                command: () => {
                    this.deleteSelected();
                }
            }
        ];
        super.ngOnInit();
    }

    getModalComponent() {
        return ModalOrderContentComponent;
    }
}
