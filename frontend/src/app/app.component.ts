import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

import {AppSettings} from './services/app-settings.service';
import {MenuItem} from './models/menu-item.interface';
import {FileManagerComponent} from './components/file-manager.component';

declare const adminMenu: MenuItem[];

@Component({
    selector: 'app-root',
    templateUrl: './templates/app.component.html',
    styleUrls: [ './app.component.css' ],
    providers: [ NgbTooltipConfig ],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    @ViewChild('navbarLeftOverlay', { static: true }) navbarLeftOverlay: ElementRef;
    @ViewChild('fileManager', { static: false }) fileManager: FileManagerComponent;
    baseUrl: string;
    routeData: any[];
    currentRoute = '';
    menuItems: MenuItem[] = [...adminMenu];
    appVersion: string;
    isFileManagerActive = false;
    isFileManagerEnabled = false;

    constructor(
        tooltipConfig: NgbTooltipConfig,
        private titleService: Title,
        private router: Router,
        private translate: TranslateService,
        private appSettings: AppSettings
    ) {
        this.baseUrl = this.appSettings.settings.webApiUrl + '/';
        this.isFileManagerEnabled = this.appSettings.settings.isFileManagerEnabled;

        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.triggers = 'hover click';

        this.translate.addLangs(['en', 'ru']);
        this.translate.setDefaultLang('en');
        this.translate.use(this.appSettings.settings.locale);
        this.appVersion = this.appSettings.settings.version;

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

    fileManagerToggle(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.isFileManagerActive = !this.isFileManagerActive;

        if (this.isFileManagerActive) {
            this.navbarLeftOverlay.nativeElement.classList.add('active');
            this.fileManager.setActive();
        } else {
            this.navbarLeftOverlay.nativeElement.classList.remove('active');
            this.fileManager.setUnactive();
        }
    }

}
