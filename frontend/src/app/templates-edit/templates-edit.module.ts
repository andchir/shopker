import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {TemplatesEditComponent} from './templates-edit.component';
import {TemplatesEditRoutingModule} from './templates-edit-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TemplatesEditRoutingModule
    ],
    declarations: [TemplatesEditComponent]
})
export class TemplatesEditModule {
}
