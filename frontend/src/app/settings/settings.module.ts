import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './settings.component';
import {ModalSystemUpdateComponent} from './modal-system-update.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SettingsRoutingModule
    ],
    providers: [],
    declarations: [
        SettingsComponent,
        ModalSystemUpdateComponent
    ],
    entryComponents: [
        ModalSystemUpdateComponent
    ]
})
export class SettingsModule {
}
