import {Component, OnDestroy, OnInit} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService} from 'primeng/api';

import {TemplatesEditService} from './services/templates-edit.service';

declare const window: Window;

@Component({
    selector: 'app-template-edit-main',
    templateUrl: './templates/main.component.html',
    providers: [DialogService, ConfirmationService, TemplatesEditService]
})
export class TemplatesEditMainComponent {

    navBarToggle(): void {
        window.document.querySelector('.layout-sidebar').classList.toggle('active');
        window.document.querySelector('.layout-mask').classList.toggle('layout-mask-active');
    }
}
