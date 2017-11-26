import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

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
        main: {
            changed: false,
            values: [] as Setting[]
        },
        delivery: {
            changed: false,
            values: [] as Setting[]
        },
        order_statuses: {
            changed: false,
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

        console.log('getSettings');

        this.settingsService.getList()
            .subscribe((res) => {

                console.log(res);

                if (res['main']) {
                    this.settings.main.values = res['main'];
                    this.buildForm('main');
                }

            });

        // let controls = {};
        // this.settings.main.values.push({key: 'database_host', value: ''});
        // this.settings.main.values.push({key: 'locale', value: 'ru'});
        //
        // controls['database_host'] = new FormControl(this.settings.main.values[0].value);
        // controls['locale'] = new FormControl(this.settings.main.values[1].value);
        //
        // this.forms.main = new FormGroup(controls);
        // this.forms.main.valueChanges
        //     .subscribe((e) => this.onValueChanged(e, 'main'));
    }

    buildForm(formName: string): void {
        let controls = {};
        this.settings[formName].values.forEach((setting) => {
            controls[setting.name] = new FormControl(setting.value);
        });
        this.forms[formName] = new FormGroup(controls);
        this.forms[formName].valueChanges
            .subscribe((data) => this.onValueChanged(data, formName));
    }

    saveSettings(key: string): void {

        console.log('saveSettings', key);

    }

    onValueChanged(data, key: string): void {

        console.log('onValueChanged', data, key);

        this.settings[key].changed = true;
    }

}
