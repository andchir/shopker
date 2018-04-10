import { Component, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { AppSettings } from './services/app-settings.service';

@Component({
    selector: 'modal-confirm',
    templateUrl: 'templates/modal-confirm.html'
})
export class ConfirmModalContent {
    @Input() modalTitle;
    @Input() modalContent;

    constructor(public activeModal: NgbActiveModal) {
    }

    accept() {
        this.activeModal.close('accept');
    }
}

@Component({
    selector: 'modal-alert',
    templateUrl: 'templates/modal-alert.html'
})
export class AlertModalContent {
    @Input() modalTitle;
    @Input() modalContent;
    @Input() messageType;

    constructor(public activeModal: NgbActiveModal) {
    }
}

@Component({
    selector: 'app-root',
    templateUrl: './templates/app.component.html',
    styleUrls: [ './app.component.css' ],
    providers: [ NgbTooltipConfig ]
})
export class AppComponent {
    baseUrl: string;
    routeData: any[];

    constructor(
        tooltipConfig: NgbTooltipConfig,
        private titleService: Title,
        private router: Router,
        private translate: TranslateService,
        private appSettings: AppSettings
    ) {
        this.baseUrl = this.appSettings.settings.webApiUrl + '/';

        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.triggers = 'hover click';

        this.translate.addLangs(['en', 'ru']);
        this.translate.setDefaultLang('en');
        this.translate.use(this.appSettings.settings.locale);

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.routeData = this.getRouteData(this.router.routerState, this.router.routerState.root);
                this.updateTitle();
            }
        });
    }

    getRouteData(state, parent) {
        let data = [];
        if (parent && parent.snapshot) {
            data.push(parent.snapshot);
        }
        if (state && parent) {
            data.push(... this.getRouteData(state, state.firstChild(parent)));
        }
        return data;
    }

    updateTitle(): void {
        let promises = [];
        this.routeData.forEach((data) => {
            if (data.component && data.component.title) {
                const promise = this.translate.get(data.component.title)
                    .toPromise();
                promises.push(promise);
            }
        });
        Promise.all(promises).then(values => {
            values.unshift(this.appSettings.settings.appName);
            this.setTitle(values.reverse().join(' - '));
        });
    }

    setTitle(newTitle: string): void {
        this.titleService.setTitle(newTitle);
    }

}
