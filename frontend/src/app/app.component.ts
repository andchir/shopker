import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {PrimeNGConfig} from 'primeng/api';
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
        private config: PrimeNGConfig,
        private tooltipConfig: NgbTooltipConfig,
        private titleService: Title,
        private router: Router,
        private translateService: TranslateService,
        private appSettings: AppSettings
    ) {
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.triggers = 'hover click';

        this.translateService.addLangs(['en', 'ru']);
        this.translateService.setDefaultLang('en');
        this.translateService.use(this.appSettings.settings.locale);
        this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));

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
                const promise = this.translateService.get(data.component.title)
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

    translate(lang: string): void {
        this.translateService.use(lang);
        this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
    }
}
