import {Component} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';

import {AppSettings} from '@app/services/app-settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    constructor(
        private translate: TranslateService,
        private appSettings: AppSettings
    ) {
        this.translate.addLangs(['en', 'ru']);
        this.translate.setDefaultLang('en');
        this.translate.use(this.appSettings.settings.locale);
    }
}
