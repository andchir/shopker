import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {UsersRoutingModule} from './users-routing.module';
import {UsersService} from './users.service';
import {UsersComponent} from './users.component';
import {ModalUserContentComponent} from './modal-user.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        UsersRoutingModule
    ],
    declarations: [
        UsersComponent,
        ModalUserContentComponent
    ],
    providers: [
        UsersService
    ],
    exports: [

    ],
    entryComponents: [
        ModalUserContentComponent
    ]
})
export class UsersModule {
}
