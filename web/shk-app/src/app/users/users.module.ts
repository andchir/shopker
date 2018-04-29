import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {NgbModule, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateCustomLoader} from '../services/translateLoader';
import {EditorModule, CalendarModule, ChipsModule, ColorPickerModule, TreeModule} from 'primeng/primeng';

import {UsersService} from './users.service';
import {ModalUserContent, UsersComponent} from './users.component';
import {ComponentsModule} from '../components.module';

@NgModule({
    imports: [
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