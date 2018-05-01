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
        UsersRoutingModule
    ],
    declarations: [
        UsersComponent,
        ModalUserContent
    ],
    providers: [
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