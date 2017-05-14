import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrdersComponent } from './orders.component';
import { CatalogComponent } from './catalog.component';
import { ContentTypesComponent } from './content_types.component';
import { StatisticsComponent } from './stat.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
    { path: '', redirectTo: '/orders', pathMatch: 'full' },
    { path: 'orders', component: OrdersComponent },
    { path: 'catalog', component: CatalogComponent },
    { path: 'catalog/content_types', component: ContentTypesComponent },
    { path: 'statistics', component: StatisticsComponent },
    { path: 'settings', component: SettingsComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {

}