import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {TemplatesEditComponent} from './templates-edit.component';
import {TemplatesEditRoutingModule} from './templates-edit-routing.module';
import {TemplatesEditMainComponent} from './main.component';
import {AssetsEditComponent} from './assets-edit.component';
import {ModalFileEditComponent} from './modal-file-edit.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TemplatesEditRoutingModule
    ],
    declarations: [
        TemplatesEditMainComponent,
        TemplatesEditComponent,
        AssetsEditComponent,
        ModalFileEditComponent
    ],
    entryComponents: [
        ModalFileEditComponent
    ]
})
export class TemplatesEditModule {
}
