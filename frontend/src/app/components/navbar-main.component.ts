import {Component, ElementRef, ViewChild} from '@angular/core';

import {FileManagerComponent} from './file-manager.component';
import {AppSettings} from '../services/app-settings.service';
import {MenuItem} from '../models/menu-item.interface';

declare const adminMenu: MenuItem[];

@Component({
    selector: 'app-navbar',
    templateUrl: './templates/app-navbar.component.html'
})
export class NavbarMainComponent {

    @ViewChild('navbarLeftOverlay', { static: false }) navbarLeftOverlay: ElementRef;
    @ViewChild('fileManager', { static: false }) fileManager: FileManagerComponent;

    baseUrl: string;
    appVersion: string;
    isFileManagerActive = false;
    isFileManagerEnabled = false;

    menuItems: MenuItem[] = [...adminMenu];

    constructor(
        private appSettings: AppSettings
    ) {
        this.baseUrl = this.appSettings.settings.webApiUrl + '/';
        this.appVersion = this.appSettings.settings.version;
        this.isFileManagerEnabled = this.appSettings.settings.isFileManagerEnabled;
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
