import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {NgbModule, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateCustomLoader} from '../services/translateLoader';
import {EditorModule, CalendarModule, ChipsModule, ColorPickerModule, TreeModule} from 'primeng/primeng';

import {ComponentsModule} from '../components.module';
import {UsersRoutingModule} from './users-routing.module';
import {UsersService} from './users.service';
import {ModalUserContent, UsersComponent} from './users.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        EditorModule,
        CalendarModule,
        ChipsModule,
        ColorPickerModule,
        TreeModule,
        NgbModule.forRoot(),
        UsersRoutingModule,
        ComponentsModule
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