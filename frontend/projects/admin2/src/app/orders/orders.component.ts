import {Component, OnInit, Input, ElementRef, OnDestroy} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {Order} from './models/order.model';
import {OrdersService} from './orders.service';
import {QueryOptions} from '../models/query-options';
import {AppTablePageAbstractComponent, TableField} from '../components/table-page.components.abstract';
import {ModalOrderContentComponent} from './modal-order.component';
import {ContentTypesService} from '../catalog/services/content_types.service';

@Component({
    selector: 'app-orders',
    templateUrl: 'templates/orders.component.html',
    providers: [DialogService, MessageService, ConfirmationService, OrdersService]
})
export class OrdersComponent extends AppTablePageAbstractComponent<Order> implements OnInit, OnDestroy {
    
    queryOptions: QueryOptions = new QueryOptions(1, 12, 'id', 'desc');
    items: Order[] = [];
    cols: TableField[] = [
        { field: 'id', header: 'ID', outputType: 'text-center', outputProperties: {} },
        { field: 'status', header: 'STATUS', outputType: 'status', outputProperties: {} },
        { field: 'price', header: 'PRICE', outputType: 'number', outputProperties: {} },
        { field: 'contentCount', header: 'CONTENT_COUNT', outputType: 'text-center', outputProperties: {} },
        { field: 'email', header: 'EMAIL', outputType: 'userEmail', outputProperties: {} },
        { field: 'createdDate', header: 'DATE_TIME', outputType: 'date', outputProperties: {format: 'dd/MM/y HH:mm:ss'} }
    ];
    menuItems: MenuItem[];

    constructor(
        public dialogService: DialogService,
        public contentTypesService: ContentTypesService,
        public dataService: OrdersService,
        public translateService: TranslateService,
        public messageService: MessageService,
        public confirmationService: ConfirmationService
    ) {
        super(dialogService, contentTypesService, dataService, translateService, messageService, confirmationService);
    }
    
    ngOnInit() {
        this.menuItems = [
            {
                label: this.getLangString('REFRESH'),
                icon: 'pi pi-refresh',
                command: () => {
                    this.queryOptions.page = 1;
                    this.queryOptions.search_word = '';
                    this.getData();
                }
            },
            {
                label: this.getLangString('DELETE_SELECTED'),
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

    onOptionUpdate(e): void {
        const [object, optionName, value] = e;
        if (!object['id']) {
            return;
        }
        this.dataService.updateProperty(object['id'], optionName, value)
            .subscribe(() => {
                this.getData();
            });
    }
}
