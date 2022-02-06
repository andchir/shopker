import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {MenuItem, MessageService} from 'primeng/api';

declare const window: Window;

@Component({
    template: ''
})
export abstract class AppPageAbstractComponent implements OnInit, OnDestroy {

    loading = false;
    menuItems: MenuItem[];
    destroyed$ = new Subject<void>();

    constructor(
        public translateService: TranslateService,
        public messageService: MessageService
    ) {
    }

    ngOnInit() {
        this.getData();
    }

    getData(event?: any): void {}

    navBarToggle(): void {
        window.document.querySelector('.layout-sidebar').classList.toggle('active');
        window.document.querySelector('.layout-mask').classList.toggle('layout-mask-active');
    }

    getLangString(value: string): string {
        if (!this.translateService.store.translations[this.translateService.currentLang]) {
            return value;
        }
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
