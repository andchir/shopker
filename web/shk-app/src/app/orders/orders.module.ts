import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {NgbModule, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateCustomLoader} from '../services/translateLoader';
import {EditorModule, CalendarModule, ChipsModule, ColorPickerModule, TreeModule} from 'primeng/primeng';

import {ComponentsModule} from '../components.module';
import {ModalOrderContent, OrdersComponent} from './orders.component';
import {OrdersService} from './orders.service';

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
        OrdersComponent,
        ModalOrderContent
    ],

    providers: [
        NgbActiveModal,
        NgbTooltipConfig,
        OrdersService
    ],

    exports: [

    ],
    entryComponents: [
        ModalOrderContent
    ]

})
export class OrdersModule {
}