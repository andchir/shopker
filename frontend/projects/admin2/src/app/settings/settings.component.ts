import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';

import {SettingsService} from './settings.service';
import {AppSettings} from '../services/app-settings.service';
import {Setting, SettingsData} from './models/setting.model';

declare const window: Window;

@Component({
    selector: 'app-settings',
    templateUrl: './templates/settings.component.html',
    providers: [MessageService, DialogService]
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {

    baseUrl = '';
    scrollHeight = 600;
    settingsCloned: {[key: string]: string|number} = {};
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
        SETTINGS_PROMOCODES: new SettingsData(
            false, true, [],
            {
                value: {value: '', type: 'text'},
                quantity: {value: 0, type: 'number'}
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
                value: {value: 1, type: 'number'}
            }
        ),
        SETTINGS_LANGUAGES: new SettingsData(
            false, true, [],
            {
                value: {value: '', type: 'text'}
            }
        ),
        SETTINGS_COMPOSER_PACKAGES: new SettingsData(false, true, [], null),
    };
    destroyed$ = new Subject<void>();
    
    constructor(
        private messageService: MessageService,
        private settingsService: SettingsService,
        private appSettings: AppSettings,
        public dialogService: DialogService,
        public translateService: TranslateService
    ) {
        this.baseUrl = this.appSettings.settings.webApiUrl + '/';
    }

    ngOnInit(): void {
        this.getSettings();
        // this.getComposerPackages();
    }

    ngAfterViewInit(): void {
        // setTimeout(this.scrollHeightUpdate.bind(this), 1);
    }

    getSettings(): void {
        this.settingsService.getList()
            .pipe(takeUntil(this.destroyed$))
            .subscribe((res) => {
                if (res['SETTINGS_MAIN']) {
                    this.settings.SETTINGS_MAIN.values = res['SETTINGS_MAIN'];
                    this.settings.SETTINGS_MAIN.defaultValues = res['SETTINGS_MAIN'];
                    this.settings.SETTINGS_MAIN.loading = false;
                }
                if (res['SETTINGS_ORDER_STATUSES']) {
                    this.settings.SETTINGS_ORDER_STATUSES.values = res['SETTINGS_ORDER_STATUSES'];
                    this.settings.SETTINGS_ORDER_STATUSES.defaultValues = res['SETTINGS_ORDER_STATUSES'];
                    this.settings.SETTINGS_ORDER_STATUSES.loading = false;
                }
                if (res['SETTINGS_DELIVERY']) {
                    this.settings.SETTINGS_DELIVERY.values = res['SETTINGS_DELIVERY'];
                    this.settings.SETTINGS_DELIVERY.defaultValues = res['SETTINGS_DELIVERY'];
                    this.settings.SETTINGS_DELIVERY.loading = false;
                }
                if (res['SETTINGS_PAYMENT']) {
                    this.settings.SETTINGS_PAYMENT.values = res['SETTINGS_PAYMENT'];
                    this.settings.SETTINGS_PAYMENT.defaultValues = res['SETTINGS_PAYMENT'];
                    this.settings.SETTINGS_PAYMENT.loading = false;
                }
                if (res['SETTINGS_CURRENCY']) {
                    this.settings.SETTINGS_CURRENCY.values = res['SETTINGS_CURRENCY'];
                    this.settings.SETTINGS_CURRENCY.defaultValues = res['SETTINGS_CURRENCY'];
                    this.settings.SETTINGS_CURRENCY.loading = false;
                }
                if (res['SETTINGS_PROMOCODES']) {
                    this.settings.SETTINGS_PROMOCODES.values = res['SETTINGS_PROMOCODES'];
                    this.settings.SETTINGS_PROMOCODES.defaultValues = res['SETTINGS_PROMOCODES'];
                    this.settings.SETTINGS_PROMOCODES.loading = false;
                }
                if (res['SETTINGS_LANGUAGES']) {
                    this.settings.SETTINGS_LANGUAGES.values = res['SETTINGS_LANGUAGES'];
                    this.settings.SETTINGS_LANGUAGES.defaultValues = res['SETTINGS_LANGUAGES'];
                    this.settings.SETTINGS_LANGUAGES.loading = false;
                }
            });
    }

    saveSettings(groupName: string, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        const data = this.settings[groupName].values;
        this.settings[groupName].loading = true;
        this.settingsService.updateGroup(groupName, data)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res: any) => {
                    this.messageService.add({
                        key: 'message',
                        severity: 'success',
                        summary: this.getLangString('MESSAGE'),
                        detail: this.getLangString('DATA_SAVED_SUCCESSFULLY')
                    });
                    this.settings[groupName].defaultValues = res;
                    this.settings[groupName].loading = false;
                    this.settings[groupName].changed = false;
                    this.pageReload();
                },
                error: (err) => {
                    if (err['error']) {
                        this.messageService.add({
                            key: 'message',
                            severity: 'error',
                            summary: this.getLangString('ERROR'),
                            detail: err['error']
                        });
                    }
                    this.settings[groupName].loading = false;
                }
            });
    }

    getFieldTypeByName(setting: Setting): string {
        return setting.name.toLowerCase().indexOf('password') > -1 && setting.value
            ? 'password'
            : 'text';
    }

    getLangString(value: string): string {
        if (!this.translateService.store.translations[this.translateService.currentLang]) {
            return value;
        }
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    pageReload(): void {
        window.location.reload();
    }

    onRowEditInit(setting: Setting) {
        this.settingsCloned[setting.name] = setting.value;
    }

    onRowEditSave(setting: Setting) {
        this.saveSettings('SETTINGS_MAIN');
    }

    onRowEditCancel(setting: Setting, index: number) {
        if (this.settingsCloned[setting.name]) {
            setting.value = this.settingsCloned[setting.name];
            delete this.settingsCloned[setting.name];
        }
    }

    navBarToggle(): void {
        window.document.querySelector('.layout-sidebar').classList.toggle('active');
        window.document.querySelector('.layout-mask').classList.toggle('layout-mask-active');
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}



