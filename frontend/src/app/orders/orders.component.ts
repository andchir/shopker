import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {NgbModal, NgbActiveModal, NgbModalRef, NgbPopover, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, Validators} from '@angular/forms';

import {cloneDeep, findIndex} from 'lodash';
import {TranslateService} from '@ngx-translate/core';

import {Order, OrderContent} from './models/order.model';
import {PageTableAbstractComponent} from '../page-table.abstract';
import {OrdersService} from './orders.service';
import {AppModalContentAbstractComponent} from '../components/app-modal-content.abstract';
import {SettingsService} from '../settings/settings.service';
import {Setting, SettingPretty, SettingsGroup} from '../settings/models/setting.model';
import {AppSettings} from '../services/app-settings.service';
import {QueryOptions} from '../models/query-options';
import {UserOption} from '../users/models/user.model';
import {FormFieldsOptions} from '../models/form-fields-options.interface';

@Component({
    selector: 'app-modal-order',
    templateUrl: 'templates/modal-order.html',
    providers: []
})
export class ModalOrderContentComponent extends AppModalContentAbstractComponent<Order> {

    model = new Order(0, 0, '', '', '');
    modalTitle = 'Order';
    settings: {[groupName: string]: SettingPretty[]};
    baseUrl: string;
    formFields: FormFieldsOptions[] = [
        {
            name: 'id',
            validators: [Validators.required]
        },
        {
            name: 'email',
            validators: [Validators.required, this.emailValidator]
        },
        {
            name: 'phone',
            validators: []
        },
        {
            name: 'fullName',
            validators: [Validators.required]
        },
        {
            name: 'comment',
            validators: []
        },
        {
            name: 'deliveryName',
            validators: []
        },
        {
            name: 'paymentName',
            validators: []
        },
        {
            name: 'options',
            validators: [],
            children: [
                {
                    name: 'name',
                    validators: [Validators.required]
                },
                {
                    name: 'title',
                    validators: [Validators.required]
                },
                {
                    name: 'value',
                    validators: []
                }
            ]
        },
        {
            name: 'content',
            validators: [],
            children: [
                {
                    name: 'uniqId',
                    validators: []
                },
                {
                    name: 'id',
                    validators: []
                },
                {
                    name: 'price',
                    validators: []
                },
                {
                    name: 'count',
                    validators: []
                }
            ]
        }
    ];

    contentEdit = new OrderContent(0, '', 0, 0);

    constructor(
        public fb: FormBuilder,
        public activeModal: NgbActiveModal,
        public translateService: TranslateService,
        public dataService: OrdersService,
        public elRef: ElementRef,
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {
        super(fb, activeModal, translateService, dataService, elRef);
    }

    onBeforeInit(): void {
        this.baseUrl = this.appSettings.settings.webApiUrl + '/';
        this.settings = this.appSettings.settings.systemSettings;
    }

    editContentToggle(content: OrderContent): void {
        if (this.getIsContentEdit(content)) {
            const index = findIndex<OrderContent>(this.model.content, {
                uniqId: this.contentEdit.uniqId,
                contentTypeName: this.contentEdit.contentTypeName
            });
            if (index > -1) {
                this.arrayFields.content.at(index).patchValue({
                    price: this.model.content[index].price,
                    count: this.model.content[index].count
                });
            }
            this.contentEdit = new OrderContent(0, '', 0, 0);
            this.priceTotalUpdate();
        } else {
            this.contentEdit = cloneDeep<OrderContent>(content);
        }
    }

    editContentCancel(): void {
        if (!this.contentEdit.uniqId) {
            return;
        }
        const index = findIndex<OrderContent>(this.model.content, {
            uniqId: this.contentEdit.uniqId,
            contentTypeName: this.contentEdit.contentTypeName
        });
        if (index > -1) {
            this.model.content[index] = cloneDeep(this.contentEdit);
            this.contentEdit = new OrderContent(0, '', 0, 0, '');
            this.priceTotalUpdate();
        }
    }

    getIsContentEdit(content: OrderContent): boolean {
        return this.contentEdit.uniqId === content.uniqId
            && this.contentEdit.contentTypeName === content.contentTypeName;
    }

    deleteContent(content: OrderContent): void {
        const index = findIndex(this.model.content, {
            uniqId: content.uniqId,
            contentTypeName: content.contentTypeName
        });
        if (index > -1) {
            this.model.content.splice(index, 1);
            this.arrayFields.content.removeAt(index);
            this.priceTotalUpdate();
        }
    }

    onDeliveryUpdate(): void {
        if (!this.settings || !this.settings.SETTINGS_DELIVERY) {
            return;
        }
        const index = findIndex(this.settings.SETTINGS_DELIVERY, {name: this.model.deliveryName});
        if (index > -1) {
            const deliveryPrice = parseFloat(String(this.settings.SETTINGS_DELIVERY[index]['options']['price']));
            const currencyRate = this.model.currencyRate || 1;
            this.model.deliveryPrice = deliveryPrice / currencyRate;
            this.priceTotalUpdate();
        }
    }

    priceTotalUpdate(): void {
        let priceTotal = parseFloat(String(this.model.deliveryPrice));
        this.model.content.forEach((content) => {
            if (content instanceof OrderContent) {
                content.priceUpdate();
            }
            priceTotal += content.priceTotal;
        });
        this.model.price = priceTotal;
    }
}

@Component({
    selector: 'app-shk-orders',
    templateUrl: 'templates/page-orders.html',
    providers: [OrdersService]
})
export class OrdersComponent extends PageTableAbstractComponent<Order> {

    static title = 'ORDERS';
    queryOptions: QueryOptions = new QueryOptions('createdDate', 'desc', 1, 10, 0, 0);
    items: Order[] = [];

    tableFields = [
        {
            name: 'id',
            sortName: 'id',
            title: 'ID',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'status',
            sortName: 'status',
            title: 'STATUS',
            outputType: 'status',
            outputProperties: {}
        },
        {
            name: 'price',
            sortName: 'price',
            title: 'PRICE',
            outputType: 'number',
            outputProperties: {}
        },
        {
            name: 'contentCount',
            sortName: 'contentCount',
            title: 'CONTENT_COUNT',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'email',
            sortName: 'email',
            title: 'EMAIL',
            outputType: 'userEmail',
            outputProperties: {}
        },
        {
            name: 'createdDate',
            sortName: 'createdDate',
            title: 'DATE_TIME',
            outputType: 'date',
            outputProperties: {
                format: 'dd/MM/y H:mm:s'
            }
        }
    ];

    constructor(
        public dataService: OrdersService,
        public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        public translateService: TranslateService
    ) {
        super(dataService, activeModal, modalService, translateService);
    }

    setModalInputs(itemId?: number, isItemCopy: boolean = false, modalId = ''): void {
        this.modalRef.componentInstance.modalTitle = `${this.getLangString('ORDER')} #${itemId}`;
        this.modalRef.componentInstance.modalId = modalId;
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.isEditMode = true;
    }

    getModalElementId(itemId?: number): string {
        return ['modal', 'order', itemId || 0].join('-');
    }

    getModalContent() {
        return ModalOrderContentComponent;
    }

    changeRequest(e): void {
        const [object, optionName, value] = e;
        if (!object['id']) {
            return;
        }
        this.dataService.updateProperty(object['id'], optionName, value)
            .subscribe(() => {
                this.getList();
            });
    }
}
