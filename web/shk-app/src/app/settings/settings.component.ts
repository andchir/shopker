import {Component, OnInit, Input} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';

import {Setting, SettingOption, SettingsGroup, SettingsData} from './models/setting.model';
import {AppSettings} from '../services/app-settings.service';
import {SettingsService} from './settings.service';

@Component({
    selector: 'shk-settings',
    templateUrl: './templates/settings.component.html'
})
export class SettingsComponent implements OnInit {
    static title = 'SETTINGS';

    loading = false;
    forms: {[key: string]: FormGroup} = {};
    settings = {
        SETTINGS_MAIN: new SettingsData(false, true, [], null),
        SETTINGS_ORDER_STATUSES: new SettingsData(
            false, true, [],
            {
                template: {value: 'userEmailStatus', type: 'text'},
                color: {value: '#00aeff', type: 'text'}
            }
        ),
        SETTINGS_DELIVERY: new SettingsData(
            false, true, [],
            {
                price: {value: 0, type: 'number'},
                priceLimit: {value: 0, type: 'number'}
            }
        ),
        SETTINGS_PAYMENT: new SettingsData(
            false, true, [],
            {
                value: {value: '', type: 'text'}
            }
        ),
        SETTINGS_CURRENCY: new SettingsData(
            false, true, [],
            {
                value: {value: '', type: 'number'}
            }
        )
    };

    constructor(
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {}

    ngOnInit(): void {
        this.getSettings();
    }

    getSettings(): void {
        this.settingsService.getList()
            .subscribe((res) => {
                if (res['SETTINGS_MAIN']) {
                    this.settings.SETTINGS_MAIN.values = res['SETTINGS_MAIN'];
                    this.settings.SETTINGS_MAIN.defaultValues = _.cloneDeep(res['SETTINGS_MAIN']);
                    this.settings.SETTINGS_MAIN.loading = false;
                }
                if (res['SETTINGS_ORDER_STATUSES']) {
                    this.settings.SETTINGS_ORDER_STATUSES.values = res['SETTINGS_ORDER_STATUSES'];
                    this.settings.SETTINGS_ORDER_STATUSES.defaultValues = _.cloneDeep(res['SETTINGS_ORDER_STATUSES']);
                    this.settings.SETTINGS_ORDER_STATUSES.loading = false;
                }
                if (res['SETTINGS_DELIVERY']) {
                    this.settings.SETTINGS_DELIVERY.values = res['SETTINGS_DELIVERY'];
                    this.settings.SETTINGS_DELIVERY.defaultValues = _.cloneDeep(res['SETTINGS_DELIVERY']);
                    this.settings.SETTINGS_DELIVERY.loading = false;
                }
                if (res['SETTINGS_PAYMENT']) {
                    this.settings.SETTINGS_PAYMENT.values = res['SETTINGS_PAYMENT'];
                    this.settings.SETTINGS_PAYMENT.defaultValues = _.cloneDeep(res['SETTINGS_PAYMENT']);
                    this.settings.SETTINGS_PAYMENT.loading = false;
                }
                if (res['SETTINGS_CURRENCY']) {
                    this.settings.SETTINGS_CURRENCY.values = res['SETTINGS_CURRENCY'];
                    this.settings.SETTINGS_CURRENCY.defaultValues = _.cloneDeep(res['SETTINGS_CURRENCY']);
                    this.settings.SETTINGS_CURRENCY.loading = false;
                }
            });
    }

    addSetting(groupName: string): void {
        const newSetting = {
            name: '',
            description: '',
            options: _.cloneDeep(this.settings[groupName].defaultOptions)
        };
        this.settings[groupName].values.push(newSetting);
    }

    deleteSetting(groupName: string, index: number): void {
        this.settings[groupName].values.splice(index, 1);
        this.settings[groupName].changed = true;
    }

    saveSettings(groupName: string): void {
        const data = this.settings[groupName].values;

        this.settings[groupName].loading = true;
        this.settingsService.updateGroup(groupName, data)
            .subscribe((data) => {
                this.settings[groupName].defaultValues = data;
                this.settings[groupName].loading = false;
                this.settings[groupName].changed = false;

                if (this.getCurrentLocale() !== this.appSettings.settings.locale) {
                    this.pageReload();
                }
            });
    }

    getCurrentLocale(): string {
        const index = _.findIndex(this.settings['SETTINGS_MAIN'].values, {name: 'locale'});
        if (index > -1) {
            return String(this.settings['SETTINGS_MAIN'].values[index].value);
        }
        return '';
    }

    resetSettingsForm(groupName: string): void {
        let dataLength = this.settings[groupName].defaultValues.length;
        if (dataLength < this.settings[groupName].values.length) {
            this.settings[groupName].values.splice(dataLength - 1, this.settings[groupName].values.length - dataLength);
        }

        _.extend(this.settings[groupName].values, _.cloneDeepWith(this.settings[groupName].defaultValues));
        this.settings[groupName].loading = false;
        this.settings[groupName].changed = false;
    }

    clearCache(): void {
        this.loading = true;
        this.settingsService.clearCache()
            .subscribe(() => {
                this.loading = false;
            });
    }

    onValueChanged(groupName: string): void {
        this.settings[groupName].changed = true;
    }

    pageReload(): void {
        window.location.reload();
    }

}
