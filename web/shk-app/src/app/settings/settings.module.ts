import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsService} from './settings.service';
import {SettingsComponent} from './settings.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SettingsRoutingModule
    ],
    providers: [
        SettingsService
    ],
    declarations: [
        SettingsComponent
    ]
})
export class SettingsModule {
}
