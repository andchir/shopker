import {Component} from '@angular/core';

declare const window: Window;

@Component({
    selector: 'app-catalog',
    templateUrl: './templates/catalog.component.html',
    providers: []
})
export class CatalogComponent {

    navBarToggle(): void {
        window.document.querySelector('.layout-sidebar').classList.toggle('active');
        window.document.querySelector('.layout-mask').classList.toggle('layout-mask-active');
    }
}
