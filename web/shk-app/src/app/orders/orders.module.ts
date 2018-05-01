import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

import {SharedModule} from '../shared.module';
import {OrdersService} from './orders.service';
import {ModalOrderContent, OrdersComponent} from './orders.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        BrowserModule
    ],
    declarations: [
        OrdersComponent,
        ModalOrderContent
    ],
    providers: [
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