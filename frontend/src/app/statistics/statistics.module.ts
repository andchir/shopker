import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {StatisticsRoutingModule} from './statistics-routing.module';
import {StatisticsComponent} from './statistics.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        StatisticsRoutingModule
    ],
    declarations: [StatisticsComponent]
})
export class StatisticsModule {
}
