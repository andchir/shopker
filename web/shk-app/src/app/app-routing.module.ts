import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found.component';
import { OrdersComponent } from './orders.component';
import { CatalogComponent } from './catalog.component';
import { ContentTypesComponent } from './content-types.component';
import { FieldTypesComponent } from './field-types.component';
import { StatisticsComponent } from './stat.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
    { path: '', redirectTo: '/orders', pathMatch: 'full' },
    { path: 'orders', component: OrdersComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'catalog/category/:categoryId', component: CatalogComponent },
    { path: 'catalog/content_types', component: ContentTypesComponent },
    { path: 'catalog/field_types', component: FieldTypesComponent },
    { path: 'statistics', component: StatisticsComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {

}
