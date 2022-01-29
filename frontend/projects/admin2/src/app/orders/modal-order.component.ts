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
            count: {validators: []},
            price: {validators: []},
            title: {validators: []},
            uniqId: {validators: []}
        }
    };

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public dataService: OrdersService,
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {
        super(ref, config, dataService);
    }
    
    ngOnInit() {
        super.ngOnInit();
        this.settings = this.appSettings.settings.systemSettings;
        this.createArrayFieldsProperty('options');
        this.createArrayFieldsProperty('content');
    }

    onGetData(model: Order) {
        super.onGetData(model);
        this.priceTotalUpdate();
        this.getDeliveryLimit();
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

    onRowEditInit(content: OrderContent): void {
        console.log('onRowEditInit', content);
    }

    onRowEditSave(content: OrderContent): void {
        console.log('onRowEditSave', content);
    }

    onRowEditCancel(content: OrderContent, rowIndex: number): void {
        console.log('onRowEditCancel', content, rowIndex);
    }
}
