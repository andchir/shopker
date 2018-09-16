import {Component, OnInit, Input} from '@angular/core';
import {NgbModal, NgbActiveModal, NgbModalRef, NgbPopover, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';

import {SystemNameService} from '../services/system-name.service';
import {Order, OrderContent} from './models/order.model';
import {PageTableAbstractComponent} from '../page-table.abstract';
import {OrdersService} from './orders.service';
import {ModalContentAbstractComponent} from '../modal.abstract';
import {SettingsService} from '../settings/settings.service';
import {Setting, SettingPretty, SettingsGroup} from '../settings/models/setting.model';
import {AppSettings} from '../services/app-settings.service';
import {QueryOptions} from '../models/query-options';
import {UserOption} from '../users/models/user.model';

@Component({
    selector: 'app-modal-order',
    templateUrl: 'templates/modal-order.html',
    providers: [SettingsService, SystemNameService]
})
export class ModalOrderContentComponent extends ModalContentAbstractComponent<Order> {

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
        public translateService: TranslateService,
        private modalService: NgbModal,
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig, translateService);
    }

    onBeforeInit(): void {
        this.baseUrl = this.appSettings.settings.webApiUrl + '/';
        this.settings = this.appSettings.settings.systemSettings;
    }

    getModelData(): Promise<Order> {
        this.loading = true;
        return new Promise((resolve, reject) => {
            this.dataService.getItem(this.itemId)
                .subscribe(data => {
                    if (this.isItemCopy) {
                        data.id = null;
                        data[this.getSystemFieldName()] = '';
                    }
                    this.model = new Order(
                        data['id'],
                        data['userId'],
                        data['status'],
                        data['email'],
                        data['phone'],
                        data['fullName'],
                        data['createdDate'],
                        data['deliveryName'],
                        data['deliveryPrice'],
                        data['paymentName'],
                        data['paymentValue'],
                        data['comment'],
                        data['contentCount'],
                        data['price'],
                        data['currency'],
                        data['options'],
                        data['currencyRate'] || 1
                    );
                    this.model.content = data['content'];
                    this.loading = false;
                    resolve(data as Order);
                }, (err) => {
                    this.errorMessage = err.error || 'Error.';
                    this.loading = false;
                    reject(err);
                });
        });
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
        if (!this.contentEdit.uniqId) {
            return;
        }
        const index = _.findIndex<OrderContent>(this.model.content, {
            uniqId: this.contentEdit.uniqId,
            contentTypeName: this.contentEdit.contentTypeName
        });
        if (index > -1) {
            this.model.content[index] = _.cloneDeep(this.contentEdit);
            this.contentEdit = new OrderContent(0, '', 0, 0, '');
            this.priceTotalUpdate();
        }
    }

    getIsContentEdit(content: OrderContent): boolean {
        return this.contentEdit.uniqId === content.uniqId
            && this.contentEdit.contentTypeName === content.contentTypeName;
    }

    deleteContent(content: OrderContent): void {
        const index = _.findIndex(this.model.content, {
            uniqId: content.uniqId,
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

    optionsAdd(): void {
        if (!this.model.options) {
            this.model.options = [];
        }
        this.model.options.push(new UserOption('', '', ''));
    }

    optionsDelete(index: number): void {
        this.model.options.splice(index, 1);
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
            outputType: 'text',
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

    setModalInputs(itemId?: number, isItemCopy: boolean = false): void {
        this.modalRef.componentInstance.modalTitle = `Order #${itemId}`;
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.isEditMode = true;
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
