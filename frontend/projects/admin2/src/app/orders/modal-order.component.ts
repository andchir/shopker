import {Component, ElementRef} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {Order, OrderContent} from './models/order.model';
import {SettingPretty} from '../settings/models/setting.model';
import {FormFieldsOptions} from '../models/form-fields-options.interface';

@Component({
    selector: 'app-modal-order',
    templateUrl: 'templates/modal-order.html',
    providers: []
})
export class ModalOrderContentComponent {

    model = new Order(0, 0, '', '', '');
    modalTitle = 'Order';
    settings: {[groupName: string]: SettingPretty[]};
    deliveryLimit = 0;
    deliveryLimitApplied = false;
    baseUrl: string;
    formFields: FormFieldsOptions[] = [];
    contentEdit = new OrderContent(0, '', 0, 0);

    constructor(
        
    ) {
        
    }
}
