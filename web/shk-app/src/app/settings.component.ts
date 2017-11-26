import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { _ } from '@biesbjerg/ngx-translate-extract';

import { SettingsService } from './services/settings.service';
import { Setting } from './models/setting.model';
import { SettingsGroup } from './models/settings-group.model';

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
        private settingsService: SettingsService
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
            .subscribe(() => {
                this.settings[groupName].loading = false;
                this.settings[groupName].changed = false;
            });
    }

    onValueChanged(data, groupName: string): void {
        this.settings[groupName].changed = true;
    }

}
