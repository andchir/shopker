import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbPopover, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { Order } from './models/order.model';
import { PageTableAbstractComponent } from './page-table.abstract';
import { OrdersService } from './services/orders.service';

@Component({
    selector: 'shk-settings',
    templateUrl: 'templates/page-orders.html',
    providers: [OrdersService]
})
export class OrdersComponent extends PageTableAbstractComponent<Order> {
    static title = 'ORDERS';

    constructor(
        dataService: OrdersService,
        activeModal: NgbActiveModal,
        modalService: NgbModal
    ) {
        super(dataService, activeModal, modalService);
    }

    tableFields = [
        {
            name: 'id',
            title: 'ID',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'price',
            title: 'PRICE',
            outputType: 'number',
            outputProperties: {}
        },
        {
            name: 'email',
            title: 'EMAIL',
            outputType: 'text',
            outputProperties: {}
        }
    ];

    getModalContent(){
        return null;
    }
}