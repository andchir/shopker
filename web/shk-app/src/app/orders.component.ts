import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbPopover, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { SystemNameService } from './services/system-name.service';

import { Order } from './models/order.model';
import { PageTableAbstractComponent } from './page-table.abstract';
import { OrdersService } from './services/orders.service';
import { ModalContentAbstractComponent } from './modal.abstract';
import { SettingsService } from './services/settings.service';
import { Setting, SettingsGroup } from './models/setting.model';
import { AppSettings } from './services/app-settings.service';

@Component({
    selector: 'modal-order',
    templateUrl: 'templates/modal-order.html',
    providers: [OrdersService, SettingsService, SystemNameService]
})
export class ModalOrderContent extends ModalContentAbstractComponent<Order> {

    model = new Order(0, 0, '', '', '');
    modalTitle = 'Order';
    settings: SettingsGroup;
    baseUrl: string;
    formFields = {
        id: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'ID is required.'
            }
        },
        email: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'Email is required.'
            }
        },
        phone: {
            value: '',
            validators: [],
            messages: {}
        },
        fullName: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'Full name is required.'
            }
        },
        address: {
            value: '',
            validators: [],
            messages: {}
        },
        comment: {
            value: '',
            validators: [],
            messages: {}
        },
        deliveryName: {
            value: '',
            validators: [],
            messages: {}
        },
        paymentName: {
            value: '',
            validators: [],
            messages: {}
        }
    };

    constructor(
        public fb: FormBuilder,
        public dataService: OrdersService,
        public systemNameService: SystemNameService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig,
        private modalService: NgbModal,
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig);
    }

    onBeforeInit(): void {
        this.baseUrl = this.appSettings.settings.webApiUrl + '/';
        this.settingsService.getList()
            .subscribe((res) => {
                this.settings = res;
            });
    }

    save(): void {

        console.log('SAVE');

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
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'createdDate',
            title: 'DATE_TIME',
            outputType: 'dateObject',
            outputProperties: {
                format: 'dd/MM/y H:mm:s'
            }
        }
    ];

    setModalInputs(itemId?: number, isItemCopy: boolean = false): void {
        this.modalRef.componentInstance.modalTitle = `Order #${itemId}`;
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.isEditMode = true;
    }

    getModalContent(){
        return ModalOrderContent;
    }
}