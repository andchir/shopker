import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';

import { SettingsService } from './services/settings.service';
import { Setting } from './models/setting.model';
import { SettingsGroup } from './models/settings-group.model';
import { AppSettings } from './services/app-settings.service';

@Component({
    selector: 'shk-settings',
    templateUrl: 'templates/page-settings.html',
    providers: [ SettingsService ]
})
export class SettingsComponent implements OnInit {
    title = 'Настройки';
    forms: {[key: string]: FormGroup} = {};
    settings = {
        SETTINGS_MAIN: {
            changed: false,
            loading: false,
            values: [] as Setting[]
        },
        SETTINGS_DELIVERY: {
            changed: false,
            loading: false,
            values: [] as Setting[]
        },
        SETTINGS_ORDER_STATUSES: {
            changed: false,
            loading: false,
            values: [] as Setting[]
        }
    };

    constructor(
        private titleService: Title,
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {}

    ngOnInit(): void {
        this.setTitle( this.title );
        this.getSettings();
    }

    public setTitle( newTitle: string ): void {
        this.titleService.setTitle( newTitle );
    }

    getSettings(): void {
        this.settingsService.getList()
            .subscribe((res) => {
                if (res['SETTINGS_MAIN']) {
                    this.settings.SETTINGS_MAIN.values = res['SETTINGS_MAIN'];
                    this.buildForm('SETTINGS_MAIN');
                }
            });
    }

    buildForm(groupName: string): void {
        let controls = {};
        this.settings[groupName].values.forEach((setting) => {
            controls[setting.name] = new FormControl(setting.value);
        });
        this.forms[groupName] = new FormGroup(controls);
        this.forms[groupName].valueChanges
            .subscribe((data) => this.onValueChanged(data, groupName));
    }

    saveSettings(groupName: string): void {
        const data = this.forms[groupName].value;
        this.settings[groupName].loading = true;
        this.settingsService.updateGroup(groupName, data)
            .subscribe((data) => {
                if (data.locale) {
                    this.appSettings.settings.locale = String(data.locale);
                }
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

    onValueChanged(data, groupName: string): void {
        this.settings[groupName].changed = true;
    }

    pageReload(): void {
        window.location.reload();
    }

}
