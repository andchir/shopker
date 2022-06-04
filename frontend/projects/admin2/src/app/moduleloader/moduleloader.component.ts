import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare const window: Window;

import {AppSettings} from '../services/app-settings.service';

@Component({
    selector: 'app-moduleloader',
    templateUrl: './moduleloader.component.html',
    providers: []
})
export class ModuleLoaderComponent implements OnInit {

    @ViewChild('vc', {read: ViewContainerRef, static: true}) _vcRef: ViewContainerRef;
    moduleName: string;
    baseUrl: string;

    constructor(
        private appSettings: AppSettings,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.baseUrl = this.appSettings.settings.webApiUrl + '/';
        this.moduleName = this.route.snapshot.paramMap.get('moduleName');
        
        window.location.href = `${this.baseUrl}admin/module/${this.moduleName}/`;
    }
}
