import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {TemplatesEditComponent} from './templates-edit.component';
import {TemplatesEditRoutingModule} from './templates-edit-routing.module';
import {ModalTemplateEditComponent} from './modal-template.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TemplatesEditRoutingModule
    ],
    declarations: [
        TemplatesEditComponent,
        ModalTemplateEditComponent
    ],
    entryComponents: [
        ModalTemplateEditComponent
    ]
})
export class TemplatesEditModule {
}
