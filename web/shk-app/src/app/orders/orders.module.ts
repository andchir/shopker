import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {OrdersRoutingModule} from './orders-routing.module';
import {OrdersService} from './orders.service';
import {ModalOrderContentComponent, OrdersComponent} from './orders.component';

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
