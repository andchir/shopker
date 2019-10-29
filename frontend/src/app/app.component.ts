import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

import {AppSettings} from './services/app-settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './templates/app.component.html',
    styleUrls: [ './app.component.css' ],
    providers: [ NgbTooltipConfig ],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    routeData: any[];
    currentRoute = '';

    constructor(
        tooltipConfig: NgbTooltipConfig,
        private titleService: Title,
        private router: Router,
        private translate: TranslateService,
        private appSettings: AppSettings
    ) {
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.triggers = 'hover click';

        this.translate.addLangs(['en', 'ru']);
        this.translate.setDefaultLang('en');
        this.translate.use(this.appSettings.settings.locale);

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.routeData = this.getRouteData(this.router.routerState, this.router.routerState.root);
                this.currentRoute = event.urlAfterRedirects;
                this.updateTitle();
            }
        });
    }

    getRouteData(state, parent) {
        const data = [];
        if (parent && parent.snapshot) {
            data.push(parent.snapshot);
        }
        if (state && parent) {
            data.push(... this.getRouteData(state, state.firstChild(parent)));
        }
        return data;
    }

    updateTitle(): void {
        const promises = [];
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
