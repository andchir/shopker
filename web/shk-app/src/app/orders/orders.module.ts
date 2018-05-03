import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {OrdersRoutingModule} from './orders-routing.module';
import {OrdersService} from './orders.service';
import {ModalOrderContent, OrdersComponent} from './orders.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        OrdersRoutingModule
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