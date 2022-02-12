import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {TemplatesEditComponent} from './templates-edit.component';
import {TemplatesEditRoutingModule} from './templates-edit-routing.module';
import {ModalTemplateEditComponent} from './modal-template.component';
import {TemplatesEditMainComponent} from './main.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TemplatesEditRoutingModule
    ],
    declarations: [
        TemplatesEditMainComponent,
        TemplatesEditComponent,
        ModalTemplateEditComponent
    ],
    entryComponents: [
        ModalTemplateEditComponent
    ]
})
export class TemplatesEditModule {
}
