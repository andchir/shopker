import {Component, OnInit} from '@angular/core';

import {PrimeNGConfig, Translation} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {AppSettings} from '@app/services/app-settings.service';

declare const window: Window;

@Component({
    template: ''
})
export abstract class AppAbstractComponent implements OnInit {
    isFileManagerActive = false;
    sidebarPosition = 'left';
    sidebarStyle = {width: '20rem', height: '100%'};

    constructor(
        public translateService: TranslateService,
        public appSettings: AppSettings,
        public primengConfig: PrimeNGConfig
    ) {
        this.translateService.addLangs(['en', 'ru']);
        this.translateService.setDefaultLang('en');
        this.translateService.use(this.appSettings.settings.locale);

        this.primengConfig.ripple = true;
    }

    ngOnInit() {
        this.primengConfig.setTranslation(this.getLangString('primeng') as Translation);
    }

    getLangString(value: string): string|Translation {
        if (!this.translateService.store.translations[this.translateService.currentLang]) {
            return value;
        }
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    fileManagerToggle(isActive: boolean): void {
        if (this.isFileManagerActive === isActive) {
            return;
        }
        this.sidebarPosition = window.innerWidth <= 960 ? 'bottom' : 'left';
        this.sidebarStyle = window.innerWidth <= 960
            ? {width: '100%', height: '20rem'}
            : {width: '20rem', height: '100%'};
        this.isFileManagerActive = isActive;
    }
}
