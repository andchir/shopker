import {Component, OnInit} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';

import {AppSettings} from '@app/services/app-settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [MessageService]
})
export class AppComponent implements OnInit {

    isFileManagerActive = false;
    
    constructor(
        private translateService: TranslateService,
        private appSettings: AppSettings,
        private primengConfig: PrimeNGConfig,
        private messageService: MessageService
    ) {
        this.translateService.addLangs(['en', 'ru']);
        this.translateService.setDefaultLang('en');
        this.translateService.use(this.appSettings.settings.locale);

        this.primengConfig.ripple = true;
    }

    ngOnInit() {
        this.primengConfig.setTranslation({
            accept: this.getLangString('YES'),
            reject: this.getLangString('NO')
        });
    }

    getLangString(value: string): string {
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
        this.isFileManagerActive = isActive;
        
    }
}
