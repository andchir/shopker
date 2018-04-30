import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {EditorModule, CalendarModule, ChipsModule, ColorPickerModule, TreeModule} from 'primeng/primeng';

import {SharedModule} from '../shared.module';
import {UsersRoutingModule} from './users-routing.module';
import {UsersService} from './users.service';
import {ModalUserContent, UsersComponent} from './users.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        HttpClientModule,
        EditorModule,
        CalendarModule,
        ChipsModule,
        ColorPickerModule,
        TreeModule,
        NgbModule.forRoot(),
        UsersRoutingModule
    ],
    declarations: [
        UsersComponent,
        ModalUserContent
    ],

    providers: [
        NgbActiveModal,
        NgbTooltipConfig,
        UsersService
    ],

    exports: [

    ],
    entryComponents: [
        ModalUserContent
    ]

})
export class UsersModule {
}