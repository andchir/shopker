import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
export class AppNavbarComponent implements OnInit {

    @Input() hrefMode = false;
    @Input() baseRoute = '';
    @Output() fileManagerActive = new EventEmitter<boolean>();

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
        } else if (menuItem.component) {
            this.displayComponent(menuItem.component);
        } else if (menuItem.route) {
            this.router.navigate([menuItem.route]);
        } else if (menuItem.target) {
            window.open(menuItem.href, menuItem.target).focus();
        } else {
            window.location.href = menuItem.href;
        }
    }

    displayComponent(componentName: string): void {
        switch (componentName) {
            case 'filemanager':
                this.fileManagerActive.emit(true);
                break;
        }
    }

    fileManagerToggle(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.isFileManagerActive = !this.isFileManagerActive;
        this.onActiveToggle();
    }
    
    onActiveToggle(isActive?: boolean): void {
        if (this.isFileManagerActive) {
            window.document.body.classList.add('navbar-open');
        } else {
            window.document.body.classList.remove('navbar-open');
        }
    }

    navBarToggle(): void {
        window.document.querySelector('.layout-sidebar').classList.toggle('active');
        window.document.querySelector('.layout-mask').classList.toggle('layout-mask-active');
    }
}
