import {Component, OnInit} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MessageService, PrimeNGConfig} from 'primeng/api';

import {AppSettings} from '@app/services/app-settings.service';
import {AppAbstractComponent} from '@app/components/app.component.abstract';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [MessageService, ConfirmationService]
})
export class AppComponent extends AppAbstractComponent implements OnInit {
    constructor(
        public translateService: TranslateService,
        public appSettings: AppSettings,
        public primengConfig: PrimeNGConfig
    ) {
        super(translateService, appSettings, primengConfig);
    }
}
