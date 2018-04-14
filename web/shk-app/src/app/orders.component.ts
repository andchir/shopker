import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbPopover, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { SystemNameService } from './services/system-name.service';
import * as _ from "lodash";

import { Order, OrderContent } from './models/order.model';
import { PageTableAbstractComponent } from './page-table.abstract';
import { OrdersService } from './services/orders.service';
import { ModalContentAbstractComponent } from './modal.abstract';
import { SettingsService } from './services/settings.service';
import { Setting, SettingPretty, SettingsGroup } from './models/setting.model';
import { AppSettings } from './services/app-settings.service';

@Component({
    selector: 'modal-order',
    templateUrl: 'templates/modal-order.html',
    providers: [OrdersService, SettingsService, SystemNameService]
})
export class ModalOrderContent extends ModalContentAbstractComponent<Order> {

    model = new Order(0, 0, '', '', '');
    modalTitle = 'Order';
    settings: {[groupName: string]: SettingPretty[]};
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
    contentEdit = new OrderContent(0, '', 0, 0);

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
        this.settings = this.appSettings.settings.systemSettings;
    }

    save(): void {
        this.loading = true;
        this.dataService.update(this.getFormData())
            .subscribe((res) => {
                this.closeModal();
            }, () => {
                this.loading = false;
            });
    }

    editContentToggle(content: OrderContent): void {
        if (this.getIsContentEdit(content)) {
            this.contentEdit = new OrderContent(0, '', 0, 0);
            this.priceTotalUpdate();
        } else {
            this.contentEdit = _.cloneDeep<OrderContent>(content);
        }
    }

    editContentCancel(): void {
        if (this.contentEdit.id === 0) {
            return;
        }
        const index = _.findIndex<OrderContent>(this.model.content, {
            id: this.contentEdit.id,
            contentTypeName: this.contentEdit.contentTypeName
        });
        if (index > -1) {
            this.model.content[index] = _.cloneDeep(this.contentEdit);
            this.contentEdit = new OrderContent(0, '', 0, 0);
            this.priceTotalUpdate();
        }
    }

    getIsContentEdit(content: OrderContent): boolean {
        return this.contentEdit.id === content.id
            && this.contentEdit.contentTypeName === content.contentTypeName;
    }

    deleteContent(content: OrderContent): void {
        const index = _.findIndex(this.model.content, {
            id: content.id,
            contentTypeName: content.contentTypeName
        });
        if (index > -1) {
            this.model.content.splice(index, 1);
            this.priceTotalUpdate();
        }
    }

    onDeliveryUpdate(): void {
        if (!this.settings || !this.settings.SETTINGS_DELIVERY) {
            return;
        }
        const index = _.findIndex(this.settings.SETTINGS_DELIVERY, {name: this.model.deliveryName});
        if (index > -1) {
            const deliveryPrice = this.settings.SETTINGS_DELIVERY[index]['options']['price'];
            this.model.deliveryPrice = deliveryPrice
                ? parseFloat(String(deliveryPrice))
                : 0;
            this.priceTotalUpdate();
        }
    }

    priceTotalUpdate(): void {
        let priceTotal = parseFloat(String(this.model.deliveryPrice));
        this.model.content.forEach((content) => {
            if (typeof content.price === 'number') {
                priceTotal += content.price * content.count;
            }
        });
        this.model.price = priceTotal;
    }
}

@Component({
    selector: 'shk-orders',
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
            outputType: 'status',
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