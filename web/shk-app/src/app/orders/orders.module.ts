import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
//import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {EditorModule, CalendarModule, ChipsModule, ColorPickerModule, TreeModule} from 'primeng/primeng';

import {SharedModule} from '../shared.module';
import {OrdersService} from './orders.service';
import {ModalOrderContent, OrdersComponent} from './orders.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        BrowserModule,
        //BrowserAnimationsModule,
        //FormsModule,
        //ReactiveFormsModule,
        HttpClientModule,
        EditorModule,
        CalendarModule,
        ChipsModule,
        ColorPickerModule,
        TreeModule,
        NgbModule.forRoot()
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