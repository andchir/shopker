import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';

import {Subject} from 'rxjs';
import {MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';

import {SettingsService} from './settings.service';
import {AppSettings} from '../services/app-settings.service';

declare const window: Window;

@Component({
    selector: 'app-settings',
    templateUrl: './templates/settings.component.html',
    providers: [MessageService, DialogService]
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {

    baseUrl = '';
    destroyed$ = new Subject<void>();
    
    constructor(
        private messageService: MessageService,
        private settingsService: SettingsService,
        private appSettings: AppSettings,
        public dialogService: DialogService,
        public translateService: TranslateService
    ) {
        this.baseUrl = this.appSettings.settings.webApiUrl + '/';
    }

    ngOnInit(): void {
        //this.getSettings();
        //this.getComposerPackages();
    }

    ngAfterViewInit(): void {
        //setTimeout(this.scrollHeightUpdate.bind(this), 1);
    }

    navBarToggle(): void {
        window.document.querySelector('.layout-sidebar').classList.toggle('active');
        window.document.querySelector('.layout-mask').classList.toggle('layout-mask-active');
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}



