import {NgModule} from '@angular/core';
import {APP_BASE_HREF, CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './settings.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SettingsRoutingModule
    ],
    providers: [],
    declarations: [
        SettingsComponent
    ],
    entryComponents: [
        
    ]
})
export class SettingsModule {
}
