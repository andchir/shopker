import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {OrdersRoutingModule} from './orders-routing.module';
import {OrdersService} from './orders.service';
import {OrdersComponent} from './orders.component';
import {ModalOrderContentComponent} from './modal-order.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        OrdersRoutingModule
    ],
    declarations: [
        OrdersComponent,
        ModalOrderContentComponent
    ],
    providers: [
        OrdersService
    ],
    exports: [

    ],
    entryComponents: [
        ModalOrderContentComponent
    ]
})
export class OrdersModule {
}
