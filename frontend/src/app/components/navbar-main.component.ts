import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

import {filter} from 'rxjs/operators';

import {AppSettings} from '../services/app-settings.service';
import {MenuItem} from '../models/menu-item.interface';

declare const adminMenu: MenuItem[];
declare const window: Window;

@Component({
    selector: 'app-navbar',
    templateUrl: './templates/app-navbar.component.html'
})
export class NavbarMainComponent implements OnInit {

    @Input() hrefMode = false;
    @Input() baseRoute = '';

    baseUrl: string;
    appVersion: string;
    isFileManagerActive = false;
    isFileManagerEnabled = false;

    menuItems: MenuItem[] = [...adminMenu];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private appSettings: AppSettings
    ) {
        this.baseUrl = this.appSettings.settings.webApiUrl + '/';
        this.appVersion = this.appSettings.settings.version;
        this.isFileManagerEnabled = this.appSettings.settings.isFileManagerEnabled;
    }

    ngOnInit(): void {
        this.router.events.pipe(
            filter((event: any) => event instanceof NavigationEnd)
        )
            .subscribe(event => {
                this.makeMenuItemActive(event.urlAfterRedirects);
            });
    }

    makeMenuItemActive(route: string): void {
        this.menuItems.map((item) => {
            item.isActive = (this.baseRoute + route).indexOf(item.route) === 0;
            return item;
        });
    }

    navigateRoute(menuItem: MenuItem, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (this.hrefMode) {
            window.location.href = `${this.baseUrl}admin/#${menuItem.route}`;
        } else {
            this.router.navigate([menuItem.route]);
        }
    }

    fileManagerToggle(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.isFileManagerActive = !this.isFileManagerActive;
    }
}
