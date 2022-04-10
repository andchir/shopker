import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {Order, OrderContent} from './models/order.model';
import {SettingPretty} from '../settings/models/setting.model';
import {FormFieldsOptions} from '../models/form-fields-options.interface';
import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {OrdersService} from './orders.service';
import {SettingsService} from '../settings/settings.service';
import {AppSettings} from '../services/app-settings.service';
import {FormFieldsData} from '../models/form-field.interface';
import {SystemNameService} from '../services/system-name.service';

@Component({
    selector: 'app-modal-order',
    templateUrl: 'templates/modal-order.html',
    providers: []
})
export class ModalOrderContentComponent extends AppModalAbstractComponent<Order> implements OnInit, OnDestroy {

    model = new Order(0, 0, '', '', '');
    modalTitle = 'Order';
    settings: {[groupName: string]: SettingPretty[]};
    deliveryLimit = 0;
    deliveryLimitApplied = false;
    baseUrl: string;
    formFields: FormFieldsOptions[] = [];
    contentEdit = new OrderContent(0, '', 0, 0);

    form = new FormGroup({
        id: new FormControl('', []),
        createdDate: new FormControl('', []),
        status: new FormControl('', []),
        email: new FormControl('', []),
        fullName: new FormControl('', []),
        phone: new FormControl('', []),
        comment: new FormControl('', []),
        deliveryName: new FormControl('', []),
        paymentName: new FormControl('', []),
        options: new FormArray([]),
        content: new FormArray([])
    });
    arrayFieldsData: {[key: string]: FormFieldsData} = {
        options: {
            name: {validators: [Validators.required]},
            title: {validators: [Validators.required]},
            value: {validators: []}
        },
        content: {
            id: {validators: []},
            uniqId: {validators: []},
            title: {validators: []},
            price: {validators: []},
            count: {validators: []},
            deleted: {validators: []}
        }
    };

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public systemNameService: SystemNameService,
        public dataService: OrdersService,
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {
        super(ref, config, systemNameService, dataService);
    }
    
    ngOnInit() {
        super.ngOnInit();
        this.settings = this.appSettings.settings.systemSettings;
        this.createArrayFieldsProperty('options');
        this.createArrayFieldsProperty('content');
    }

    onGetData(item: Order) {
        this.model = item;
        this.priceTotalUpdate();
        this.getDeliveryLimit();
        this.updateControls();
    }

    onDataSaved(): void {
        super.onDataSaved();
        this.priceTotalUpdate();
    }

    getDeliveryLimit(): void {
        if (!this.model || !this.model.options) {
            return;
        }
        const index = this.model.options.findIndex((item) => {
            return item.name === 'deliveryPriceLimit';
        });
        if (index > -1) {
            this.deliveryLimit = parseFloat(this.model.options[index].value);
        }
    }

    priceTotalUpdate(): void {
        let priceTotal = 0;
        this.model.content.forEach((content) => {
            if (content instanceof OrderContent) {
                content.priceUpdate();
            } else {
                OrderContent.priceUpdate(content);
            }
            if (content.deleted) {
                return;
            }
            priceTotal += content.priceTotal;
        });
        if (this.model.discount) {
            priceTotal -= this.model.discount;
        }
        if (this.model.discountPercent) {
            priceTotal *= this.model.discountPercent / 100;
        }
        if (this.deliveryLimit && priceTotal >= this.deliveryLimit) {
            this.deliveryLimitApplied = true;
        } else {
            priceTotal += this.model.deliveryPrice || 0;
            this.deliveryLimitApplied = false;
        }
        this.model.price = Math.max(priceTotal, 0);
    }

    deleteContent(content: OrderContent): void {
        const index = this.model.content.findIndex((item) => {
            return item.uniqId === content.uniqId && item.contentTypeName === content.contentTypeName;
        });
        if (index > -1) {
            this.arrayFields.content.at(index).get('deleted').setValue(!this.model.content[index].deleted);
            this.model.content[index].deleted = !this.model.content[index].deleted;
            this.priceTotalUpdate();
        }
    }

    onRowEditSave(content: OrderContent, rowIndex: number): void {
        const formContentRow = this.arrayFields.content.controls[rowIndex];
        content.price = formContentRow.controls.price.value;
        content.count = formContentRow.controls.count.value;
        this.priceTotalUpdate();
    }

    onRowEditCancel(content: OrderContent, rowIndex: number): void {
        const formContentRow = this.arrayFields.content.controls[rowIndex];
        formContentRow.controls.price.setValue(content.price);
        formContentRow.controls.count.setValue(content.count);
    }
}
