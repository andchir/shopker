import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared.module';
import {CatalogRoutingModule} from './catalog-routing.module';
import {CatalogComponent} from './catalog.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CatalogRoutingModule
    ],
    declarations: [CatalogComponent]
})
export class CatalogModule {
}
