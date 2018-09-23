import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {extend, findIndex} from 'lodash';
import {isNumeric} from 'rxjs/util/isNumeric';

import {ContentField} from './catalog/models/content_field.model';
import {AppSettings} from './services/app-settings.service';
import {Properties} from './models/properties.iterface';
import {SettingPretty} from './settings/models/setting.model';

@Component({
    selector: 'app-output-field',
    templateUrl: 'templates/render-output-field.html',
    providers: []
})
export class OutputFieldComponent implements OnInit {

    @Input() object: any;
    @Input() value: string | number | boolean;
    @Input() outputType: string;
    @Input() options: {};
    @Output() changeRequest = new EventEmitter<any>();
    settingsStatuses: SettingPretty[] = [];

    constructor(
        private appSettings: AppSettings
    ) { }

    ngOnInit(): void {
        if (this.appSettings.settings.systemSettings['SETTINGS_ORDER_STATUSES']) {
            this.settingsStatuses = this.appSettings.settings.systemSettings['SETTINGS_ORDER_STATUSES'];
        }
        this.updateOptions();
    }

    updateOptions(): void {

        let propertiesDefault: Properties;

        switch (this.outputType) {
            case 'date':

                propertiesDefault = {
                    format: 'mm/dd/yy'
                };
                this.options = this.extendProperties(
                    this.options,
                    propertiesDefault
                );

                break;
        }
    }

    extendProperties(object1: Properties, object2: Properties): Properties {
        object1 = extend({}, object2, object1);
        for (const key in object1) {
            if (object1.hasOwnProperty(key)) {
                if (isNumeric(object1[key])) {
                    object1[key] = parseInt(String(object1[key]), 10);
                }
            }
        }
        return object1;
    }

    getStatusColor(statusValue): string {
        let output = null;
        if (!this.settingsStatuses) {
            return output;
        }
        const index = findIndex(this.settingsStatuses, {name: statusValue});
        if (index > -1 && this.settingsStatuses[index].options.color) {
            output = this.settingsStatuses[index].options.color;
        }
        return output;
    }

    optionUpdate(optionName: string, value: string | number): void {
        this.changeRequest.emit([this.object, optionName, value]);
    }
}
