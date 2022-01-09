import {Component} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';

import {AppSettings} from '@app/services/app-settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [MessageService]
})
export class AppComponent {

    constructor(
        private translate: TranslateService,
        private appSettings: AppSettings,
        private primengConfig: PrimeNGConfig,
        private messageService: MessageService
    ) {
        this.translate.addLangs(['en', 'ru']);
        this.translate.setDefaultLang('en');
        this.translate.use(this.appSettings.settings.locale);

        this.primengConfig.ripple = true;
    }
}
