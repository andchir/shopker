import {Component, OnInit} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MessageService, PrimeNGConfig, Translation} from 'primeng/api';

import {AppSettings} from '@app/services/app-settings.service';

declare const window: Window;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [MessageService, ConfirmationService]
})
export class AppComponent implements OnInit {

    isFileManagerActive = false;
    sidebarPosition = 'left';
    sidebarStyle = {width: '20rem', height: '100%'};
    
    constructor(
        private translateService: TranslateService,
        private appSettings: AppSettings,
        private primengConfig: PrimeNGConfig
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
