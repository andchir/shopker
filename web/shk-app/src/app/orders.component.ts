import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbPopover, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { SystemNameService } from './services/system-name.service';

import { Order } from './models/order.model';
import { PageTableAbstractComponent } from './page-table.abstract';
import { OrdersService } from './services/orders.service';
import { ModalContentAbstractComponent } from './modal.abstract';

@Component({
    selector: 'modal-order',
    templateUrl: 'templates/modal-order.html',
    providers: [OrdersService, SystemNameService]
})
export class ModalOrderContent extends ModalContentAbstractComponent<Order> {

    model = new Order(0, 0, '', '');
    modalTitle = 'Order';

    constructor(
        public fb: FormBuilder,
        public dataService: OrdersService,
        public systemNameService: SystemNameService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig,
        private modalService: NgbModal
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig);
    }

    save(): void {

    }
}

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
            name: 'status',
            title: 'STATUS',
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
            name: 'contentCount',
            title: 'CONTENT_COUNT',
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
        return ModalOrderContent;
    }
}