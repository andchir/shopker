import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {UsersRoutingModule} from './users-routing.module';
import {UsersService} from './users.service';
import {ModalUserContent, UsersComponent} from './users.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        UsersRoutingModule,
    ],
    providers: [
        UsersService
    ],
    declarations: [
        UsersComponent,
        ModalUserContent
    ],
    exports: [

    ],
    entryComponents: [
        ModalUserContent
    ]
})
export class UsersModule {
}