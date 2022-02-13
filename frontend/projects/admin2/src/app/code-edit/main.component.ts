import {Component, OnDestroy, OnInit} from '@angular/core';

declare const window: Window;

@Component({
    selector: 'app-template-edit-main',
    templateUrl: './templates/main.component.html',
    providers: []
})
export class TemplatesEditMainComponent {

    navBarToggle(): void {
        window.document.querySelector('.layout-sidebar').classList.toggle('active');
        window.document.querySelector('.layout-mask').classList.toggle('layout-mask-active');
    }
}
